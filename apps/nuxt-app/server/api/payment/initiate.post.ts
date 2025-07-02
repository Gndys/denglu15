import { createPaymentProvider } from '@libs/payment'
import { auth } from '@libs/auth'
import { nanoid } from 'nanoid'
import { db } from '@libs/database'
import { order, orderStatus, paymentProviders } from '@libs/database/schema'
import { eq } from 'drizzle-orm'

// Order expiration time (2 hours)
const ORDER_EXPIRATION_TIME = 2 * 60 * 60 * 1000

export default defineEventHandler(async (event) => {
  try {
    // Check authentication using Better Auth
    const headers = new Headers()
    for (const [key, value] of Object.entries(getHeaders(event))) {
      if (value) headers.set(key, value)
    }
    
    const session = await auth.api.getSession({ headers })
    
    if (!session?.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    // Parse request body
    const body = await readBody(event)
    const { planId, provider = 'stripe' } = body

    if (!planId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Plan ID is required'
      })
    }

    // Generate order ID and get plan details
    const orderId = nanoid()
    const runtimeConfig = useRuntimeConfig()
    const plans = runtimeConfig.public.paymentPlans
    const plan = plans[planId as keyof typeof plans]
    
    if (!plan) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid plan'
      })
    }

    // Create order record in database
    await db.insert(order).values({
      id: orderId,
      userId: session.user.id,
      planId,
      amount: plan.amount.toString(), // Convert to string for numeric field
      currency: plan.currency,
      status: orderStatus.PENDING,
      provider,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date()
    })
    console.log('Order created:', orderId)

    // Set up order expiration handler
    setTimeout(async () => {
      try {
        // Query order status
        const currentOrder = await db.query.order.findFirst({
          where: eq(order.id, orderId)
        })

        // Only process orders that are still in pending status
        if (currentOrder?.status === orderStatus.PENDING) {
          // Update order status to canceled
          await db.update(order)
            .set({ 
              status: orderStatus.CANCELED,
              updatedAt: new Date()
            })
            .where(eq(order.id, orderId))
          
          console.log(`Order ${orderId} expired and canceled`)
          
          // For WeChat Pay, call the close order API
          if (provider === paymentProviders.WECHAT) {
            const paymentProvider = createPaymentProvider('wechat')
            await paymentProvider.closeOrder(orderId)
          }
        }
      } catch (error) {
        console.error(`Failed to process expired order ${orderId}:`, error)
      }
    }, ORDER_EXPIRATION_TIME)

    // Create payment provider instance
    const paymentProvider = createPaymentProvider(provider)

    // Get client IP
    const clientIp = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || '127.0.0.1'
    
    // Initiate payment using the payment library
    const result = await paymentProvider.createPayment({
      orderId,
      userId: session.user.id,
      planId,
      amount: plan.amount,
      currency: plan.currency,
      metadata: {
        clientIp,
        description: `${plan.name} - ${plan.duration.description}`
      }
    })
    console.log('Payment initiation result:', result)

    return {
      paymentUrl: result.paymentUrl,
      providerOrderId: result.providerOrderId,
      metadata: result.metadata
    }
  } catch (error: any) {
    console.error('Payment initiate error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
}) 
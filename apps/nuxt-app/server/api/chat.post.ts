import { streamResponseWithUsage } from '@libs/ai'
import { auth } from '@libs/auth'
import { creditService, calculateCreditConsumption } from '@libs/credits'
import { checkSubscriptionStatus } from '@libs/database/utils/subscription'

export default defineEventHandler(async (event) => {
  // Only allow POST requests
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    // Get user session for credit tracking
    const user = event.context.user || await (async () => {
      const headers = new Headers()
      Object.entries(getHeaders(event)).forEach(([key, value]) => {
        if (value) headers.set(key, value)
      })
      
      const session = await auth.api.getSession({ headers })
      return session?.user
    })()
    
    const userId = user?.id

    // Read the request body
    const { messages, provider, model } = await readBody(event)

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Messages array is required'
      })
    }

    // Log the request for debugging
    console.log('Chat API request:', { 
      messageCount: messages.length, 
      provider: provider || 'openai', 
      model: model || 'gpt-5',
      userId: userId || 'anonymous'
    })

    // Get streaming response with usage tracking
    const { response, usage, provider: usedProvider, model: usedModel } = streamResponseWithUsage({
      messages,
      provider: provider || undefined,
      model: model || undefined
    })

    // Process credit consumption asynchronously (don't block response)
    if (userId) {
      // Check subscription status first
      checkSubscriptionStatus(userId).then(async (subscription) => {
        // Only consume credits if user doesn't have active subscription
        if (!subscription) {
          try {
            const usageData = await usage
            const creditsToConsume = calculateCreditConsumption({
              totalTokens: usageData.totalTokens,
              model: usedModel,
              provider: usedProvider
            })
            
            console.log('Credit consumption:', {
              userId,
              totalTokens: usageData.totalTokens,
              creditsToConsume,
              model: usedModel,
              provider: usedProvider
            })
            
            const result = await creditService.consumeCredits({
              userId,
              amount: creditsToConsume,
              description: `AI chat: ${usageData.totalTokens} tokens (${usedModel})`,
              metadata: {
                provider: usedProvider,
                model: usedModel,
                promptTokens: usageData.promptTokens,
                completionTokens: usageData.completionTokens,
                totalTokens: usageData.totalTokens
              }
            })
            
            if (!result.success) {
              console.warn('Credit consumption failed:', result.error)
            }
          } catch (error) {
            console.error('Error processing credit consumption:', error)
          }
        } else {
          console.log('User has active subscription, skipping credit consumption')
        }
      }).catch((error) => {
        console.error('Error checking subscription status:', error)
      })
    }

    return response

  } catch (error: any) {
    console.error('Chat API error:', error)
    
    // Handle different types of errors
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    })
  }
}) 
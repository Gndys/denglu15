import { auth } from '@libs/auth'
import { creditService } from '@libs/credits'
import type { CreditTransactionType } from '@libs/credits'

/**
 * Get current user's credit transaction history
 */
export default defineEventHandler(async (event) => {
  try {
    // Get current user session
    const user = event.context.user || await (async () => {
      const headers = new Headers()
      Object.entries(getHeaders(event)).forEach(([key, value]) => {
        if (value) headers.set(key, value)
      })
      
      const session = await auth.api.getSession({ headers })
      return session?.user
    })()
    
    if (!user?.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }
    
    // Parse query parameters
    const query = getQuery(event)
    const limit = Math.min(parseInt(query.limit as string || '50', 10), 100)
    const offset = parseInt(query.offset as string || '0', 10)
    const type = query.type as CreditTransactionType | undefined
    
    const transactions = await creditService.getTransactions(user.id, {
      limit,
      offset,
      type
    })
    
    return { transactions }
  } catch (error) {
    console.error('Failed to fetch credit transactions:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch credit transactions'
    })
  }
})


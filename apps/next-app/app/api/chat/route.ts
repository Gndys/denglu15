import { streamResponseWithUsage } from '@libs/ai';
import { auth } from '@libs/auth';
import { creditService, calculateCreditConsumption } from '@libs/credits';
import { checkSubscriptionStatus } from '@libs/database/utils/subscription';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Get user session for credit tracking
    const sessionHeaders = new Headers(req.headers);
    const session = await auth.api.getSession({
      headers: sessionHeaders
    });
    
    const userId = session?.user?.id;
    
    const body = await req.json();
    console.log('Request body:', body);
    
    const { messages, provider, model } = body;
    
    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages:', messages);
      return new Response('Invalid messages format', { status: 400 });
    }
    
    console.log('Processing request:', { 
      messagesCount: messages.length, 
      provider: provider || 'openai', 
      model: model || 'default',
      userId: userId || 'anonymous'
    });
    
    // Get streaming response with usage tracking
    const { response, usage, provider: usedProvider, model: usedModel } = streamResponseWithUsage({
      messages,
      provider,
      model
    });
    
    // Process credit consumption asynchronously (don't block response)
    if (userId) {
      // Check subscription status first
      checkSubscriptionStatus(userId).then(async (subscription) => {
        // Only consume credits if user doesn't have active subscription
        if (!subscription) {
          try {
            const usageData = await usage;
            const creditsToConsume = calculateCreditConsumption({
              totalTokens: usageData.totalTokens,
              model: usedModel,
              provider: usedProvider
            });
            
            console.log('Credit consumption:', {
              userId,
              totalTokens: usageData.totalTokens,
              creditsToConsume,
              model: usedModel,
              provider: usedProvider
            });
            
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
            });
            
            if (!result.success) {
              console.warn('Credit consumption failed:', result.error);
            }
          } catch (error) {
            console.error('Error processing credit consumption:', error);
          }
        } else {
          console.log('User has active subscription, skipping credit consumption');
        }
      }).catch((error) => {
        console.error('Error checking subscription status:', error);
      });
    }
    
    return response;
  } catch (error) {
    console.error('API route error:', error);
    return new Response('Internal server error', { status: 500 });
  }
} 
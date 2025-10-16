import { streamText, convertToModelMessages } from 'ai';
import type { UIMessage } from 'ai';
import { createProvider } from './providers';
import { getProviderConfig } from './config';
import type { ProviderName } from './types';

interface StreamOptions {
  messages: UIMessage[];
  provider?: ProviderName;
  model?: string;
}

export function streamResponse({ messages, provider, model }: StreamOptions) {
  // Validate messages
  if (!messages || !Array.isArray(messages)) {
    throw new Error('Invalid messages: messages must be an array');
  }
  
  console.log('streamResponse called with:', {
    messagesCount: messages.length,
    provider: provider || 'openai',
    model: model || 'default'
  });
  
  const config = getProviderConfig(provider || 'openai');
  const aiProvider = createProvider(provider || 'openai', config);
  
  const result = streamText({
    model: aiProvider(model as any),
    messages: convertToModelMessages(messages),
  });
  
  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: () => crypto.randomUUID(),
  });
}
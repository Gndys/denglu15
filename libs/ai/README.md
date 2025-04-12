# AI Integration Guide

This library provides shared AI functionality across applications using Vercel's AI SDK.

## Directory Structure

```
libs/
└── ai/
    ├── config.ts         # AI configuration and environment settings
    ├── providers.ts      # AI model providers setup (OpenAI, Anthropic, etc.)
    ├── types.ts         # TypeScript type definitions
    ├── utils.ts         # Utility functions
    ├── index.ts         # Main entry point
    └── README.md        # Documentation
```

## Setup Steps

1. **Install Dependencies**
   Add the following dependencies to the root `package.json`:
   ```bash
   pnpm add ai @vercel/ai
   ```

2. **Environment Configuration**
   Add provider-specific variables to the root `.env` file:
   ```
   # OpenAI
   OPENAI_API_KEY=your_key_here
   OPENAI_BASE_URL=optional_base_url

   # Qwen
   QWEN_API_KEY=your_key_here
   QWEN_BASE_URL=your_base_url

   # DeepSeek
   DEEPSEEK_API_KEY=your_key_here

   # Default Provider
   AI_PROVIDER=openai
   ```

## Usage Examples

### Backend Usage
```typescript
// File: apps/next-app/src/app/api/chat/route.ts
import { createAIHandler } from '@libs/ai';

// Use default provider from env
const handler = createAIHandler();

// Use specific provider
const openaiHandler = createAIHandler({ provider: 'openai' });
const qwenHandler = createAIHandler({ provider: 'qwen' });
const deepseekHandler = createAIHandler({ provider: 'deepseek' });
```

### Frontend Usage
```typescript
// File: apps/next-app/src/app/[lang]/(root)/ai/page.tsx
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

// In your React component
export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  
  return (
    <div>
      {/* Messages display */}
      {messages.map(message => (
        <div key={message.id}>
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {message.content}
          </ReactMarkdown>
        </div>
      ))}
      
      {/* Chat input */}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

### Implementation Notes

This is a basic implementation that provides core chat functionality. The current features include:
- Basic chat interface with message history
- Markdown rendering with code highlighting
- Multiple AI provider support (OpenAI, Qwen, DeepSeek)
- Streaming responses

For additional features, you can extend this implementation using Vercel AI SDK's capabilities:
- Function calling
- Tools integration
- Custom model parameters
- Response formatting
- Error handling
- Rate limiting
- Custom streaming handlers

See [Vercel AI SDK Documentation](https://sdk.vercel.ai/) for detailed implementation guides.

## Adding New Models

1. **Install Provider Package**
   ```bash
   pnpm add @ai-sdk/<provider-name>
   ```

2. **Update Types (`types.ts`)**
   ```typescript
   import type { NewProviderSettings } from '@ai-sdk/new-provider';
   
   export type ProviderName = 'existing' | 'new-provider';
   
   export type ProviderConfig = {
     existing: ExistingConfig;
     'new-provider': NewProviderSettings;
   };
   ```

3. **Update Environment Keys (`config.ts`)**
   ```typescript
   const ENV_KEYS = {
     'new-provider': {
       apiKey: 'NEW_PROVIDER_API_KEY',
       baseURL: 'NEW_PROVIDER_BASE_URL' // if needed
     }
   };
   ```

4. **Add Provider Creation (`providers.ts`)**
   ```typescript
   import { createNewProvider } from '@ai-sdk/new-provider';
   
   case 'new-provider':
     return createNewProvider(config);
   ```

For available providers and models, see [Vercel AI SDK Providers](https://sdk.vercel.ai/docs/foundations/providers-and-models).

## Resources

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Anthropic Claude API](https://docs.anthropic.com/claude/reference) 
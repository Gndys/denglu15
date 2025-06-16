'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight'
import { useChat } from '@ai-sdk/react';
import { Send } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import '@/app/highlight.css'

export default function Chat() {
  const initialMessages: any[] = [
    { id: '1', content: '你好，我是Grok，一个AI助手。', role: 'user' },
    { id: '2', content: `# Hello, Markdown!
This is a **bold** text with some *italic* content.

- Item 1  
- Item 2

\`\`\`javascript
console.log("Code block");
\`\`\`
`, role: 'assistant' },
  ];
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages
  });
  const [provider, setProvider] = useState<keyof typeof providerModels>('openai');
  const [model, setModel] = useState('gpt-4o');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const providerModels = {
    openai: ['gpt-4o', 'gpt-3.5', 'gpt-3'],
    qwen: ['qwen-max', 'qwen-plus', 'qwen-turbo'],
    deepseek: ['deepseek-chat', 'deepseek-coder'],
  };

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Trigger scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <>
    <div className="flex flex-col h-screen">
      {/* Scrollable messages area */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-3xl mx-auto py-6 px-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-2 py-1 rounded-sm shadow-sm border ${
                  message.role === 'user'
                    ? 'bg-secondary text-secondary-foreground border-secondary'
                    : 'bg-card text-card-foreground border-border'
                }`}
              >
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return <div className="prose prose-headings:my-2 prose-li:my-0 prose-ul:my-1 prose-p:my-2 
                prose-pre:p-0 prose-pre:my-1 
            dark:prose-invert prose-pre:bg-muted prose-pre:text-muted-foreground" key={`${message.id}-${i}`}>
                          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{part.text}</ReactMarkdown>
                        </div>;
                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          ))}
          {/* Empty div for scrolling reference */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Fixed form at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm">
        <form onSubmit={(e) => handleSubmit(e, { body: { provider, model } })} className="max-w-3xl mx-auto py-4 px-4">
          <div className="border border-border rounded-lg shadow-md bg-card">
            {/* Input field */}
            <div className="p-3 pb-2">
              <input
                className="w-full bg-transparent outline-none text-card-foreground placeholder:text-muted-foreground"
                value={input}
                placeholder="需要Grok帮什么忙?"
                onChange={handleInputChange}
              />
            </div>
            
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 border-t border-border">
              {/* Model selector */}
              <div className="flex items-center">
                <Select onValueChange={(value) => {
                  const [selectedProvider, selectedModel] = value.split(':');
                  setProvider(selectedProvider as keyof typeof providerModels);
                  setModel(selectedModel);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(providerModels).map(([prov, models]) => (
                      <SelectGroup key={prov}>
                        <SelectLabel>{prov.charAt(0).toUpperCase() + prov.slice(1)}</SelectLabel>
                        {models.map((mod: string) => (
                          <SelectItem key={mod} value={`${prov}:${mod}`}>{mod}</SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Submit button */}
              <Button 
                type="submit"
                size="icon"
                variant="outline"
                className="size-8"
              >
                <Send/>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
} 
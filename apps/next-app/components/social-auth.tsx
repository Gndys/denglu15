'use client';

import { useState } from 'react';
import { SocialButton, type SocialProvider } from "@/components/ui/social-button";
import { cn } from "@/lib/utils";
import { authClientReact } from '@libs/auth/authClient';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';
import { toast } from 'sonner';

interface SocialAuthProps extends React.HTMLAttributes<HTMLDivElement> {
  providers?: SocialProvider[];
}

const defaultProviders: SocialProvider[] = ['google', 'github', 'wechat', 'phone'];

export function SocialAuth({
  className,
  providers = defaultProviders,
  ...props
}: SocialAuthProps) {
  const router = useRouter();
  const { locale: currentLocale, t } = useTranslation();
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);

  const handleProviderClick = async (provider: SocialProvider) => {
    // Prevent multiple simultaneous requests
    if (loadingProvider) return;

    switch (provider) {
      case 'wechat':
        router.push(`/${currentLocale}/wechat`);
        break;
      case 'phone':
        router.push(`/${currentLocale}/cellphone`);
        break;
      default:
        // Set loading state for the clicked provider
        setLoadingProvider(provider);
        
        try {
          // Use default social login flow for other providers
          const { data, error } = await authClientReact.signIn.social({
            provider,
          });
          
          if (error) {
            console.error('Social login error:', error);
            toast.error(error.message || t.common.unexpectedError);
          }
        } finally {
          setLoadingProvider(null);
        }
    }
  };

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)} {...props}>
      {providers.map((provider) => (
        <SocialButton 
          key={provider} 
          provider={provider} 
          onClick={() => handleProviderClick(provider)}
          loading={loadingProvider === provider}
          disabled={loadingProvider !== null && loadingProvider !== provider}
        />
      ))}
    </div>
  );
} 
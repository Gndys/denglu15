'use client';

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

  const handleProviderClick = async (provider: SocialProvider) => {
    switch (provider) {
      case 'wechat':
        router.push(`/${currentLocale}/wechat`);
        break;
      case 'phone':
        router.push(`/${currentLocale}/cellphone`);
        break;
      default:
        // Use default social login flow for other providers
        const { data, error } = await authClientReact.signIn.social({
          provider,
        });
        
        if (error) {
          console.error('Social login error:', error);
          toast.error(error.message || t.common.unexpectedError);
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
        />
      ))}
    </div>
  );
} 
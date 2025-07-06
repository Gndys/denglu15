'use client';

import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Sparkles, FileText, BarChart, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function PremiumFeaturesPage() {
  const { t, locale } = useTranslation();
  const [userData, setUserData] = useState<{
    subscriptionActive: boolean;
    subscriptionType: string;
    isLifetime: boolean;
    expiresAt?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscriptionDetails() {
      try {
        const response = await fetch('/api/subscription/status');
        if (response.ok) {
          const data = await response.json();
          setUserData({
            subscriptionActive: data.hasSubscription,
            subscriptionType: data.isLifetime ? 'lifetime' : 'recurring',
            isLifetime: data.isLifetime,
            expiresAt: data.subscription?.periodEnd
          });
        }
      } catch (error) {
        console.error('Failed to fetch subscription details', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscriptionDetails();
  }, []);

  // Premium features list using translations
  const premiumFeatures = [
    {
      icon: <User className="h-6 w-6" />,
      title: t.premiumFeatures.features.userManagement.title,
      description: t.premiumFeatures.features.userManagement.description
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: t.premiumFeatures.features.aiAssistant.title,
      description: t.premiumFeatures.features.aiAssistant.description
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: t.premiumFeatures.features.documentProcessing.title,
      description: t.premiumFeatures.features.documentProcessing.description
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: t.premiumFeatures.features.dataAnalytics.title,
      description: t.premiumFeatures.features.dataAnalytics.description
    }
  ];

  // Format date based on current locale
  const formatDate = (dateString: string) => {
    const localeCode = locale === 'zh-CN' ? 'zh-CN' : 'en-US';
    return new Date(dateString).toLocaleDateString(localeCode);
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">{t.premiumFeatures.loading}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{t.premiumFeatures.title}</h1>
            {userData?.isLifetime && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                {t.premiumFeatures.badges.lifetime}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {t.premiumFeatures.description}
          </p>
        </div>
      </div>

      {/* Subscription Info */}
      {userData && (
        <Card className="mt-6 mb-8">
          <CardHeader>
            <CardTitle>{t.premiumFeatures.subscription.title}</CardTitle>
            <CardDescription>{t.premiumFeatures.subscription.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">{t.premiumFeatures.subscription.status}</div>
                <div className="text-lg font-bold">
                  {userData.subscriptionActive ? t.premiumFeatures.subscription.active : t.premiumFeatures.subscription.inactive}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">{t.premiumFeatures.subscription.type}</div>
                <div className="text-lg font-bold">
                  {userData.subscriptionType === 'lifetime' ? t.premiumFeatures.subscription.lifetime : t.premiumFeatures.subscription.recurring}
                </div>
              </div>
              {userData.expiresAt && userData.subscriptionType !== 'lifetime' && (
                <div className="rounded-lg border p-3">
                  <div className="text-sm font-medium text-muted-foreground">{t.premiumFeatures.subscription.expiresAt}</div>
                  <div className="text-lg font-bold">
                    {formatDate(userData.expiresAt)}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Premium Features List */}
      <div className="grid gap-6 pt-4 md:grid-cols-2 lg:grid-cols-4">
        {premiumFeatures.map((feature, index) => (
          <Card key={index} className="flex flex-col justify-between">
            <CardHeader>
              <div className="rounded-full w-12 h-12 flex items-center justify-center bg-primary/10 text-primary mb-4">
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">{t.premiumFeatures.actions.accessFeature}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 
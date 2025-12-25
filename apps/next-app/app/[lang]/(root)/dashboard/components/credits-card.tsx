'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Coins, 
  TrendingUp,
  TrendingDown,
  History,
  ArrowRight,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";

interface CreditStatus {
  credits: {
    balance: number;
    totalPurchased: number;
    totalConsumed: number;
  };
  hasSubscription: boolean;
  canAccess: boolean;
}

interface CreditTransaction {
  id: string;
  type: string;
  amount: string;
  balance: string;
  description: string | null;
  createdAt: string;
}

export function CreditsCard() {
  const { t, locale: currentLocale } = useTranslation();
  const [creditData, setCreditData] = useState<CreditStatus | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCreditData() {
      try {
        const [statusResponse, transactionsResponse] = await Promise.all([
          fetch('/api/credits/status'),
          fetch('/api/credits/transactions?limit=5')
        ]);
        
        if (statusResponse.ok) {
          const data = await statusResponse.json();
          setCreditData(data);
        }
        
        if (transactionsResponse.ok) {
          const data = await transactionsResponse.json();
          setTransactions(data.transactions || []);
        }
      } catch (error) {
        console.error('Failed to fetch credit data', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCreditData();
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLocale === 'zh-CN' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get transaction type display
  const getTransactionTypeDisplay = (type: string) => {
    const typeMap: Record<string, { label: string; color: string; icon: typeof TrendingUp }> = {
      purchase: { 
        label: t.dashboard.credits.types.purchase, 
        color: 'text-green-600 dark:text-green-500',
        icon: TrendingUp
      },
      bonus: { 
        label: t.dashboard.credits.types.bonus, 
        color: 'text-blue-600 dark:text-blue-500',
        icon: TrendingUp
      },
      consumption: { 
        label: t.dashboard.credits.types.consumption, 
        color: 'text-orange-600 dark:text-orange-500',
        icon: TrendingDown
      },
      refund: { 
        label: t.dashboard.credits.types.refund, 
        color: 'text-purple-600 dark:text-purple-500',
        icon: TrendingUp
      }
    };
    return typeMap[type] || { 
      label: type, 
      color: 'text-muted-foreground',
      icon: History
    };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            {t.dashboard.credits.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          {t.dashboard.credits.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance Display */}
        <div className="text-center p-6 bg-primary/10 rounded-xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins className="h-8 w-8 text-primary" />
            <span className="text-4xl font-bold text-foreground">
              {creditData?.credits.balance.toLocaleString() || 0}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {t.dashboard.credits.available}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-500/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-500" />
              <span className="text-sm font-medium text-green-600 dark:text-green-500">
                {t.dashboard.credits.totalPurchased}
              </span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {creditData?.credits.totalPurchased.toLocaleString() || 0}
            </p>
          </div>
          <div className="p-4 bg-orange-500/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-500">
                {t.dashboard.credits.totalConsumed}
              </span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {creditData?.credits.totalConsumed.toLocaleString() || 0}
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        {transactions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <History className="h-4 w-4" />
              {t.dashboard.credits.recentTransactions}
            </h4>
            <div className="space-y-2">
              {transactions.slice(0, 3).map((tx) => {
                const typeInfo = getTransactionTypeDisplay(tx.type);
                const TypeIcon = typeInfo.icon;
                const amount = parseFloat(tx.amount);
                
                return (
                  <div 
                    key={tx.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <TypeIcon className={`h-4 w-4 ${typeInfo.color}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {tx.description || typeInfo.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(tx.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className={`font-semibold ${amount >= 0 ? 'text-green-600 dark:text-green-500' : 'text-orange-600 dark:text-orange-500'}`}>
                      {amount >= 0 ? '+' : ''}{amount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Buy More Credits Button */}
        <Button 
          asChild
          className="w-full"
        >
          <Link href={`/${currentLocale}/pricing`}>
            <Coins className="h-4 w-4 mr-2" />
            {t.dashboard.credits.buyMore}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}


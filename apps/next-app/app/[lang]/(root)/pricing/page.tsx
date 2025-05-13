'use client';

import { config } from '@config';
import { useTranslation } from "@/hooks/use-translation";
import type { Plan } from '@config';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { authClientReact } from "@libs/auth/authClient";
import QRCode from 'qrcode';

export default function PricingPage() {
  const { t, locale: currentLocale } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const plans = Object.values(config.payment.plans) as unknown as Plan[];
  
  const { data: session, isPending } = authClientReact.useSession();
  const user = session?.user;

  const handleSubscribe = async (plan: Plan) => {
    try {
      // 检查用户是否已登录
      if (!user) {
        // 保存当前页面路径，以便登录后返回
        const returnPath = encodeURIComponent(pathname);
        router.push(`/${currentLocale}/signin?returnTo=${returnPath}`);
        return;
      }

      setLoading(plan.id);
      
      // 根据支付方式决定 provider
      const provider = plan.provider || 'stripe';
      setCurrentPlan(plan);
      
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          provider
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate payment');
      }
      console.log('Payment initiation result:', data);
      
      // 不同支付方式的处理
      if (provider === 'wechat') {
        // 微信支付显示二维码
        if (data.paymentUrl) {
          try {
            const qrDataUrl = await QRCode.toDataURL(data.paymentUrl);
            setQrCodeUrl(qrDataUrl);
          } catch (err) {
            console.error('QR code generation error:', err);
            toast.error(t.common.unexpectedError);
          }
        }
      } else {
        // Stripe 跳转到 Checkout 页面
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(t.common.unexpectedError);
    } finally {
      setLoading(null);
    }
  };

  const closeQrCodeModal = () => {
    setQrCodeUrl(null);
    setCurrentPlan(null);
  };

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">{t.pricing.title}</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t.pricing.subtitle}
          </p>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {plans.map((plan) => {
            // 确保 i18n 存在且可以安全访问
            const i18n = plan.i18n && typeof plan.i18n === 'object' ? plan.i18n[currentLocale] : undefined;
            return (
              <div
                key={plan.id}
                className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
              >
                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h3 className="text-lg font-semibold leading-8 text-gray-900">
                      {i18n?.name || plan.name}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {i18n?.description || plan.description}
                  </p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      {plan.currency === 'CNY' ? '¥' : '$'}{plan.amount}
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /{i18n?.duration || plan.duration.description}
                    </span>
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                    {plan.features.map((feature, index) => (
                      <li key={feature} className="flex gap-x-3">
                        <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                        {i18n?.features && Array.isArray(i18n.features) && index < i18n.features.length
                          ? i18n.features[index]
                          : feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  disabled={loading === plan.id || isPending}
                  onClick={() => handleSubscribe(plan)}
                  className="mt-8 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading === plan.id ? t.common.loading : t.pricing.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Code Modal for WeChat payment */}
      {qrCodeUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                微信支付
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {currentPlan && (
                  <span>
                    {currentPlan.currency === 'CNY' ? '¥' : '$'}{currentPlan.amount} - 
                    {currentPlan.i18n && 
                     currentPlan.i18n[currentLocale] && 
                     currentPlan.i18n[currentLocale].name || currentPlan.name}
                  </span>
                )}
              </p>
              <div className="flex justify-center mb-4">
                <img 
                  src={qrCodeUrl} 
                  alt="WeChat Pay QR Code" 
                  className="w-64 h-64"
                />
              </div>
              <p className="text-sm text-gray-500 mb-4">
                请使用微信扫描二维码完成支付
              </p>
              <button
                type="button"
                onClick={closeQrCodeModal}
                className="w-full rounded-md bg-gray-200 px-3 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
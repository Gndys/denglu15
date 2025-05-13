import { config } from '@config';
import { StripeProvider } from './providers/stripe';
import { WechatPayProvider } from './providers/wechat';
import { PaymentProvider } from './types';

export type PaymentProviderType = 'stripe' | 'wechat';

/**
 * 创建支付提供商实例
 * @param provider 支付提供商类型
 * @returns 支付提供商实例
 */
export function createPaymentProvider<T extends PaymentProviderType>(
  provider: T
): T extends 'stripe' ? StripeProvider : T extends 'wechat' ? WechatPayProvider : never {
  switch (provider) {
    case 'stripe':
      return new StripeProvider() as any;
    case 'wechat':
      return new WechatPayProvider() as any;
    default:
      throw new Error(`不支持的支付提供商: ${provider}`);
  }
}

// 导出类型和提供商实现，方便使用
export * from './types';
export { StripeProvider, WechatPayProvider }; 
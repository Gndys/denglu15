import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mjml2html from 'mjml';
import Handlebars from 'handlebars';
import { Locale } from '../../i18n/locales/types';
import { en } from '../../i18n/locales/en';
import { zhCN } from '../../i18n/locales/zh-CN';

// Get directory name for the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Find project root directory by looking for the libs/email/templates directory
 */
const findProjectRoot = (startPath: string): string => {
  let currentPath = startPath;
  while (currentPath !== path.dirname(currentPath)) {
    if (fs.existsSync(path.join(currentPath, 'libs', 'email', 'templates'))) {
      return currentPath;
    }
    currentPath = path.dirname(currentPath);
  }
  throw new Error('Could not find project root directory with libs/email/templates');
};

/**
 * Get template file path using project root detection
 */
function getTemplatePath(templateName: string): string {
  try {
    // Find project root starting from current working directory
    const projectRoot = findProjectRoot(process.cwd());
    const templatePath = path.join(projectRoot, 'libs', 'email', 'templates', templateName);
    
    if (fs.existsSync(templatePath)) {
      console.log(`📧 Found email template at: ${templatePath}`);
      return templatePath;
    }
    
    throw new Error(`Template file ${templateName} does not exist at ${templatePath}`);
  } catch (error) {
    // Fallback: try starting from __dirname
    try {
      const projectRoot = findProjectRoot(__dirname);
      const templatePath = path.join(projectRoot, 'libs', 'email', 'templates', templateName);
      
      if (fs.existsSync(templatePath)) {
        console.log(`📧 Found email template at: ${templatePath} (fallback)`);
        return templatePath;
      }
      
      throw new Error(`Template file ${templateName} does not exist at ${templatePath}`);
    } catch (fallbackError) {
      console.error('❌ Failed to find project root from process.cwd():', process.cwd());
      console.error('❌ Failed to find project root from __dirname:', __dirname);
      throw new Error(`Could not locate email template ${templateName}. Ensure libs/email/templates directory exists.`);
    }
  }
}

// 支持的语言包
export const locales: Record<string, Locale> = {
  en,
  'zh-CN': zhCN
};

// 默认语言
export const defaultLocale = 'en';

// 获取当前年份，用于版权信息
const getCurrentYear = () => new Date().getFullYear().toString();

// 模板类型定义
export interface EmailTemplate {
  subject: string;
  html: string;
}

// 验证邮件所需变量类型
export interface VerificationEmailParams {
  name: string;
  verification_url: string;
  expiry_hours: number;
  locale?: string; // 指定使用哪种语言
}

// 重置密码邮件所需变量类型
export interface ResetPasswordEmailParams {
  name: string;
  reset_url: string;
  expiry_hours: number;
  locale?: string; // 指定使用哪种语言
}

/**
 * 为Handlebars模板准备翻译数据
 */
function prepareTranslationData(params: VerificationEmailParams | ResetPasswordEmailParams, template: 'verification' | 'resetPassword') {
  const locale = params.locale && locales[params.locale] ? params.locale : defaultLocale;
  const translations = locales[locale];
  
  // 处理特殊的格式化变量
  const year = getCurrentYear();
  const expiry = translations.email[template].expiry.replace(
    '{{expiry_hours}}', 
    params.expiry_hours.toString()
  );
  const greeting = translations.email[template].greeting.replace(
    '{{name}}', 
    params.name
  );
  
  // 返回处理后的翻译对象
  return {
    translations: {
      ...translations,
      email: {
        ...translations.email,
        [template]: {
          ...translations.email[template],
          expiry,
          greeting,
          copyright: translations.email[template].copyright.replace('{{year}}', year)
        }
      }
    }
  };
}

/**
 * 生成验证邮件模板
 */
export function generateVerificationEmail(params: VerificationEmailParams): EmailTemplate {
  // 读取MJML模板
  const templatePath = getTemplatePath('verification.mjml');
  const mjmlTemplate = fs.readFileSync(templatePath, 'utf8');
  
  // 准备翻译数据
  const translationData = prepareTranslationData(params, 'verification');
  
  // 编译MJML为HTML
  const { html: mjmlHtml } = mjml2html(mjmlTemplate);
  
  // 使用Handlebars替换变量
  const template = Handlebars.compile(mjmlHtml);
  const html = template({
    ...params,
    ...translationData
  });
  
  // 获取对应语言的主题
  const locale = params.locale && locales[params.locale] ? params.locale : defaultLocale;
  const subject = locales[locale].email.verification.subject;
  
  return {
    subject,
    html
  };
}

/**
 * 生成重置密码邮件模板
 */
export function generateResetPasswordEmail(params: ResetPasswordEmailParams): EmailTemplate {
  // 读取MJML模板
  const templatePath = getTemplatePath('reset-password.mjml');
  const mjmlTemplate = fs.readFileSync(templatePath, 'utf8');
  
  // 准备翻译数据
  const translationData = prepareTranslationData(params, 'resetPassword');
  
  // 编译MJML为HTML
  const { html: mjmlHtml } = mjml2html(mjmlTemplate);
  
  // 使用Handlebars替换变量
  const template = Handlebars.compile(mjmlHtml);
  const html = template({
    ...params,
    ...translationData
  });
  
  // 获取对应语言的主题
  const locale = params.locale && locales[params.locale] ? params.locale : defaultLocale;
  const subject = locales[locale].email.resetPassword.subject;
  
  return {
    subject,
    html
  };
}

// 导出所有模板函数
export const templates = {
  verification: generateVerificationEmail,
  resetPassword: generateResetPasswordEmail
}; 
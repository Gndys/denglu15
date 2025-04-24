import { Account, betterAuth, User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { genericOAuth, phoneNumber, admin } from "better-auth/plugins"
import { validator, StandardAdapter } from "validation-better-auth"
import { createAuthMiddleware, APIError } from "better-auth/api"

import { db, user, account, session, verification } from '@libs/database'
// import { sendSMSByAliyun } from '@libs/sms/aliyun'
import { emailSignInSchema, emailSignUpSchema } from '@libs/validators/user'
export { toNextJsHandler } from "better-auth/next-js";

interface WeChatProfile {
  unionid?: string;
  openid: string;
  nickname: string;
  headimgurl: string;
}

interface WeChatTokens {
  access_token: string;
  openid: string;
  refresh_token: string;
  scope: string;
  errcode?: number;
  errmsg?: string;
}

export const auth = betterAuth({
  appName: 'shipeasy',
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      
      // 从请求 URL 中获取实际的 provider
      if (!ctx.request?.url) {
        throw new APIError("BAD_REQUEST", {
          message: "Invalid request URL",
        });
      }

      const url = new URL(ctx.request.url);
      const pathParts = url.pathname.split('/');
      const providerId = pathParts[pathParts.length - 1];

      // 拦截微信登录回调
      if (ctx.path === "/oauth2/callback/:providerId" && providerId === "wechat") {
        try {
          const code = ctx.query?.code;
          if (!code || Array.isArray(code)) {
            throw new APIError("BAD_REQUEST", {
              message: "Missing or invalid authorization code",
            });
          }

          // 获取访问令牌
          const tokenResponse = await fetch(
            `https://api.weixin.qq.com/sns/oauth2/access_token?` +
            `appid=${process.env.WECHAT_APP_ID}&` +
            `secret=${process.env.WECHAT_APP_SECRET}&` +
            `code=${code}&grant_type=authorization_code`
          );

          const tokenData: WeChatTokens = await tokenResponse.json();
          
          if (tokenData.errcode) {
            throw new APIError("BAD_REQUEST", {
              message: `WeChat API error: ${tokenData.errmsg}`,
            });
          }

          // 获取用户信息
          const userInfoResponse = await fetch(
            `https://api.weixin.qq.com/sns/userinfo?` +
            `access_token=${tokenData.access_token}&` +
            `openid=${tokenData.openid}&lang=zh_CN`
          );
          // https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Authorized_Interface_Calling_UnionID.html
          // {
          //   "openid":"OPENID",
          //   "nickname":"NICKNAME",
          //   "sex":1,
          //   "province":"PROVINCE",
          //   "city":"CITY",
          //   "country":"COUNTRY",
          //   "headimgurl": "https://thirdwx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0",
          //   "privilege":[
          //   "PRIVILEGE1",
          //   "PRIVILEGE2"
          //   ],
          //   "unionid": " o6_bmasdasdsad6_2sgVt7hMZOPfL"
            
          //   }
            
          const profile: WeChatProfile = await userInfoResponse.json();
          
          if (!profile || !profile.openid) {
            throw new APIError("BAD_REQUEST", {
              message: "Failed to get WeChat user info",
            });
          }
          
          // 先查找是否存在关联的账户
          const existingAccount = await ctx.context.adapter.findOne({
            model: "account",
            where: [
              {
                field: "providerId",
                value: "wechat",
                operator: "eq"
              },
              {
                field: "accountId",
                value: profile.unionid || profile.openid,
                operator: "eq"
              }
            ]
          }) as Account;

          let user: null | User;
          
          if (existingAccount) {
            // 如果账户存在，获取关联的用户
            user = await ctx.context.adapter.findOne({
              model: "user",
              where: [
                {
                  field: "id",
                  value: existingAccount.userId,
                  operator: "eq"
                }
              ]
            });
            
            if (!user) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: "Associated user not found",
              });
            }

            // 更新用户信息
            // user = await ctx.context.internalAdapter.updateUser({
            //   id: user.id,
            //   name: profile.nickname,
            //   image: profile.headimgurl,
            // });
          } else {
            // 创建新用户
            user = await ctx.context.internalAdapter.createUser({
              name: profile.nickname,
              email: `${profile.openid}@wechat.com`,
              emailVerified: true,
              image: profile.headimgurl,
            });

            // 创建账户关联
            await ctx.context.internalAdapter.createAccount({
              providerId: "wechat",
              accountId: profile.unionid || profile.openid,
              userId: user.id,
              scope: "snsapi_login",
              accessToken: tokenData.access_token,
              tokenType: "bearer",
            });
          }

          // 创建会话
          const newSession = await ctx.context.internalAdapter.createSession(
            user.id,
            ctx.request
          );
          console.log('new session', newSession)
          // 设置会话 cookie
          await ctx.setSignedCookie(
            ctx.context.authCookies.sessionToken.name,
            newSession.token,
            ctx.context.secret,
            {
              ...ctx.context.authCookies.sessionToken.options,
              path: "/",
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            }
          );

          // 重定向到成功页面
          // const callbackUrl = ctx.query?.state || "/";
          // const redirectUrl = Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl;
          // console.log('redirectUrl', redirectUrl)
          throw ctx.redirect("/");
        } catch (error) {
          if (error instanceof APIError) {
            throw error;
          }
          console.error("WeChat login error:", error);
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "Failed to process WeChat login",
          });
        }
      }
    }),
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      account,
      session,
      verification
    }
  }),
  // https://www.better-auth.com/docs/concepts/email
  emailAndPassword: {
    enabled: true,
    autoSignIn: false, //defaults to true
    requireEmailVerification: true,
    sendResetPassword: async ({user, url, token}) => {
      // await sendEmail({
      //   to: user.email,
      //   subject: "Reset your password",
      //   text: `Click the link to reset your password: ${url}`,
      // });
      console.log('the token', token)
      console.log(`Click the link to reset your password: ${url}`)
    },
  },
  emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
      // await sendEmail({
      //   to: user.email,
      //   subject: "Verify your email address",
      //   text: `Click the link to verify your email: ${url}`,
      // });
      console.log(`Click the link to verify your email${user.email}: ${url}`,)
    },
    autoSignInAfterVerification: true
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"] 
    }
  },
  plugins: [
    // https://www.better-auth.com/docs/plugins/admin
    admin(
      {
        adminRoles: ["admin"],
      }
    ),
    // https://www.better-auth.com/docs/plugins/generic-oauth#custom-user-info-fetching
    // https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html
    genericOAuth({
      config: [
        {
          providerId: "wechat",
          clientId: process.env.WECHAT_APP_ID!,
          clientSecret: process.env.WECHAT_APP_SECRET!,
          authorizationUrl: "https://open.weixin.qq.com/connect/qrconnect",
          tokenUrl: "https://api.weixin.qq.com/sns/oauth2/access_token",
          userInfoUrl: "https://api.weixin.qq.com/sns/userinfo",
          scopes: ["snsapi_login"],
          getUserInfo: async (tokens) => {
            const wechatTokens = tokens as unknown as WeChatTokens;
            const response = await fetch(`https://api.weixin.qq.com/sns/userinfo?access_token=${wechatTokens.access_token}&openid=${wechatTokens.openid}&lang=zh_CN`);
            const profile: WeChatProfile = await response.json();
            
            return {
              id: profile.unionid || profile.openid,
              name: profile.nickname,
              email: `${profile.openid}@wechat.com`,  // 微信不提供邮箱，我们创建一个虚拟邮箱
              emailVerified: true,
              image: profile.headimgurl,
              createdAt: new Date(),
              updatedAt: new Date()
            };
          }
        }
      ]
    }),

    // https://www.better-auth.com/docs/plugins/phone-number
    phoneNumber({
      //otpLength: 4,
      sendOTP: async ({ phoneNumber, code }, request) => { 
        try {
          // Implement sending OTP code via SMS
          // await sendSMSByAliyun({
          //   phoneNumber,
          //   signName: '阿里云短信测试',
          //   templateCode: 'SMS_154950105',
          //   templateParam: { code }
          // })
          console.log(`OTP ${code} sent to ${phoneNumber}`);
        } catch (error) {
          console.error('Failed to send OTP:', error);
          throw error;
        }
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
            return `${phoneNumber}@test.com`
        },
        //optionally, you can also pass `getTempName` function to generate a temporary name for the user
        getTempName: (phoneNumber) => {
          return phoneNumber //by default, it will use the phone number as the name
        }
      }
    }),
    // https://github.com/Daanish2003/validation-better-auth
    validator(
      [
        {path: "/sign-up/email", adapter: StandardAdapter(emailSignUpSchema)},
        {path: "/sign-in/email", adapter: StandardAdapter(emailSignInSchema)},
      ]
    ),

  ]
})

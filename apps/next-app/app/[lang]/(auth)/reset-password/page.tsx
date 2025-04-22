'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/ui/form-error";
import { Loader2 } from "lucide-react";
import { resetPasswordSchema } from "@libs/validators/user";
import { authClientReact } from '@libs/auth/authClient';
import type { z } from "zod";
import { useTranslation } from "@/hooks/use-translation"

type FormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ code?: string; message: string } | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get token from URL when component mounts
    const urlToken = new URLSearchParams(window.location.search).get("token");
    if (!urlToken) {
      setError({
        code: "INVALID_TOKEN",
        message: t.auth.resetPassword.errors.invalidToken
      });
    } else {
      setToken(urlToken);
    }
  }, [t.auth.resetPassword.errors.invalidToken]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      await authClientReact.resetPassword({
        newPassword: data.password,
        token,
      });
      setResetSuccess(true);
    } catch (err: any) {
      setError({
        code: err.code || "UNKNOWN_ERROR",
        message: err.message || t.common.unexpectedError,
      });
    } finally {
      setLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <Card className="w-[380px]">
        <CardContent className="pt-6 text-center space-y-4">
          <h3 className="text-lg font-medium">{t.auth.resetPassword.success.title}</h3>
          <p className="text-muted-foreground">
            {t.auth.resetPassword.success.description}
          </p>
          <Button
            className="w-full"
            onClick={() => router.push('/signin')}
          >
            {t.auth.resetPassword.success.backToSignin}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[380px]">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t.auth.resetPassword.title}</CardTitle>
        <CardDescription>
          {t.auth.resetPassword.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">{t.auth.resetPassword.password}</Label>
              <Input
                id="password"
                placeholder={t.auth.resetPassword.passwordPlaceholder}
                type="password"
                autoComplete="new-password"
                disabled={loading}
                {...register("password")}
              />
              {errors?.password && (
                <p className="px-1 text-xs text-red-600">
                  {errors.password.type === 'required'
                    ? t.auth.resetPassword.errors.requiredPassword
                    : t.auth.resetPassword.errors.invalidPassword}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">{t.auth.resetPassword.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                placeholder={t.auth.resetPassword.confirmPasswordPlaceholder}
                type="password"
                autoComplete="new-password"
                disabled={loading}
                {...register("confirmPassword")}
              />
              {errors?.confirmPassword && (
                <p className="px-1 text-xs text-red-600">
                  {errors.confirmPassword.type === 'required'
                    ? t.auth.resetPassword.errors.requiredPassword
                    : t.auth.resetPassword.errors.passwordsDontMatch}
                </p>
              )}
            </div>
            <Button disabled={loading || !token}>
              {loading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {loading ? t.auth.resetPassword.submitting : t.auth.resetPassword.submit}
            </Button>
          </div>
        </form>
        {error && <FormError message={error.message} code={error.code} />}
      </CardContent>
    </Card>
  );
}

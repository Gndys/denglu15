'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClientReact } from "@libs/auth/authClient";
import { signupFormSchema } from "@libs/validators/user";
import type { z } from "zod";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SocialButton } from "@/components/ui/social-button"
import { FormError } from "@/components/ui/form-error"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Inbox } from "lucide-react"

type FormData = z.infer<typeof signupFormSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      password: '12345678',
      name: '',
      image: ''
    },
    mode: 'onBlur', // Enable validation on blur
  });

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrorMessage('');
    setErrorCode('');
    
    const { error, data } = await authClientReact.signUp.email(
      {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image: formData.image || undefined,
      }
    );

    if (error) {
      if (error.code && error.message) {
        setErrorMessage(error.message);
        setErrorCode(error.code);
      } else {
        setErrorMessage('An unexpected error occurred');
        setErrorCode('UNKNOWN_ERROR');
      }
      setLoading(false);
      return;
    }

    console.log('Sign up successful', data);
    const { error: verificationError } = await authClientReact.sendVerificationEmail({
      email: formData.email,
      callbackURL: "/" // The redirect URL after verification
    });

    if (verificationError) {
      if (verificationError.code && verificationError.message) {
        setErrorMessage(verificationError.message);
        setErrorCode(verificationError.code);
      } else {
        setErrorMessage('An unexpected error occurred');
        setErrorCode('UNKNOWN_ERROR');
      }
    } else {
      setVerificationEmail(formData.email);
      setIsVerificationEmailSent(true);
    }
    
    setLoading(false);
  };

  if (isVerificationEmailSent) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Check your email</CardTitle>
            <CardDescription>
              We've sent a verification link to your email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="my-4">
              <Inbox className="h-4 w-4" />
              <AlertTitle>Verification Required</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-2">
                  We've sent a verification email to <strong>{verificationEmail}</strong>.
                  Please check your inbox and click the verification link to complete your registration.
                </p>
                <p className="text-sm text-muted-foreground">
                  Can't find the email? Please check your spam folder. If you still don't see it,{" "}
                  <button 
                    onClick={() => setIsVerificationEmailSent(false)} 
                    className="text-primary underline underline-offset-4 hover:text-primary/90"
                  >
                    try again
                  </button>
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Sign up with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormError message={errorMessage} code={errorCode} />
          <div className="flex flex-col gap-4">
            <SocialButton provider="google" />
            <SocialButton provider="github" />
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t py-2">
            <span className="bg-card text-muted-foreground relative z-10 px-2">
              Or continue with email
            </span>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    {...register('name')}
                    placeholder="Enter your name"
                    className={cn(errors.name && "border-destructive")}
                    aria-invalid={errors.name ? "true" : "false"}
                  />
                  {errors.name && (
                    <span className="text-destructive text-xs absolute -bottom-5 left-0">
                      {errors.name.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="m@example.com"
                    className={cn(errors.email && "border-destructive")}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && (
                    <span className="text-destructive text-xs absolute -bottom-5 left-0">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    placeholder="Create a password"
                    className={cn(errors.password && "border-destructive")}
                    aria-invalid={errors.password ? "true" : "false"}
                  />
                  {errors.password && (
                    <span className="text-destructive text-xs absolute -bottom-5 left-0">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Profile Image URL (Optional)</Label>
                <div className="relative">
                  <Input
                    id="image"
                    type="url"
                    {...register('image')}
                    placeholder="https://example.com/your-image.jpg"
                    className={cn(errors.image && "border-destructive")}
                    aria-invalid={errors.image ? "true" : "false"}
                  />
                  {errors.image && (
                    <span className="text-destructive text-xs absolute -bottom-5 left-0">
                      {errors.image.message}
                    </span>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading || isSubmitting}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="/signin" className="text-primary hover:underline underline-offset-4">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
} 
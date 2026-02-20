'use client';

import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, Chrome } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function AuthForm() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<'login' | 'register'>('login');

  const userAuthSchema = z.object({
    email: z.string().email(t.authForm.invalidEmail),
    password: z.string().min(6, t.authForm.passwordMinLength),
  });

  type FormData = z.infer<typeof userAuthSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await signIn('credentials', {
           email: data.email,
           password: data.password,
           redirect: false
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        toast.success(t.authForm.loginSuccess);
        window.location.href = '/';
      } else {
         const res = await fetch('/api/auth/register', {
             method: 'POST',
             body: JSON.stringify(data),
             headers: { 'Content-Type': 'application/json' }
         });
         
         if (!res.ok) throw new Error(t.authForm.registerError);
         
         await signIn('credentials', {
           email: data.email,
           password: data.password,
           redirect: false
        });
        
        toast.success(t.authForm.registerSuccess);
        window.location.href = '/';
      }
    } catch (error) {
      console.error(error);
      toast.error(t.authForm.genericError);
    } finally {
      setIsLoading(false);
    }
  }

  const loginWithGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error(error);
      toast.error(t.authForm.googleError);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{t.authForm.email}</Label>
            <Input
              id="email"
              placeholder={t.authForm.emailPlaceholder}
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGoogleLoading}
              {...register('email')}
            />
            {errors?.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t.authForm.password}</Label>
            <Input
              id="password"
              placeholder="******"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              disabled={isLoading || isGoogleLoading}
              {...register('password')}
            />
            {errors?.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button disabled={isLoading || isGoogleLoading} className="bg-primary hover:bg-primary/90 text-white font-bold">
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {mode === 'login' ? t.authForm.loginButton : t.authForm.registerButton}
          </Button>
        </div>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t.authForm.orContinueWith}
          </span>
        </div>
      </div>
      
      <Button
        variant="outline"
        type="button"
        disabled={isLoading || isGoogleLoading}
        onClick={loginWithGoogle}
        className="border-border hover:bg-accent hover:text-accent-foreground"
      >
        {isGoogleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Chrome className="mr-2 h-4 w-4" />
        )}{' '}
        Google
      </Button>

      <div className="text-center text-sm">
        <button
          type="button"
          className="underline hover:text-primary transition-colors"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' 
            ? t.authForm.noAccount
            : t.authForm.hasAccount}
        </button>
      </div>
    </div>
  );
}

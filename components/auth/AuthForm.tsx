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
// import { supabase } from '@/lib/supabaseService'; // Removed
import { signIn } from 'next-auth/react';

const userAuthSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type FormData = z.infer<typeof userAuthSchema>;

export function AuthForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<'login' | 'register'>('login');

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
           redirect: false // Handle redirect manually or let NextAuth do it
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        toast.success('Sesión iniciada correctamente');
        window.location.href = '/';
      } else {
         // With NextAuth credentials, registration is usually a separate API call or 
         // we just sign in and if user doesn't exist we fail?
         // In our auth.ts we only have "authorize" which reads user. 
         // We need a register API route if we want email/pass registration.
         // For now, let's assume registration is not fully supported via credentials in this quick refactor 
         // OR we just call an API to create user then login.
         
         // Let's implement a simple registration via API for now since "authorize" is only for login.
         // Or just tell user to use Google for now as primary.
         // But I'll try to support it by checking mode.
         
         const res = await fetch('/api/auth/register', {
             method: 'POST',
             body: JSON.stringify(data),
             headers: { 'Content-Type': 'application/json' }
         });
         
         if (!res.ok) throw new Error('Error al registrarse');
         
         // Auto login after register
         await signIn('credentials', {
           email: data.email,
           password: data.password,
           redirect: false
        });
        
        toast.success('Cuenta creada y sesión iniciada');
        window.location.href = '/';
      }
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error. Por favor intenta de nuevo.');
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
      toast.error('Error al conectar con Google');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="nombre@ejemplo.com"
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
            <Label htmlFor="password">Contraseña</Label>
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
            {mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
          </Button>
        </div>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            O continuar con
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
            ? '¿No tienes cuenta? Regístrate' 
            : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
}

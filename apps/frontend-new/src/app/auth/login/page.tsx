'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button, Input, Card } from '@/components/atoms';
import { GoogleAuthButton } from '@/components/molecules';
import { authService } from '@/services/auth.service';
import { onboardingService } from '@/services/onboarding.service';
import { MessageSquare, ArrowLeft } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    const googleAuthUrl = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || 'http://localhost:3333/api/auth/google';

    if (!googleAuthUrl) {
      setError('O login com Google ainda não foi configurado neste ambiente.');
      return;
    }

    window.location.href = googleAuthUrl;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@hublaia-demo.com',
      password: 'admin123',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authService.login(data.email, data.password);

      if (response.success && response.data?.accessToken) {
        const onboarding = await onboardingService.getState();
        if (onboarding.success && onboarding.data && !onboarding.data.progress.isCompleted) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError('Falha ao fazer login. Tente novamente.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
        'Credenciais inválidas. Tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const errorCode = searchParams?.get('error');

    if (!errorCode) {
      return;
    }

    const errorMessages: Record<string, string> = {
      google_oauth_not_configured: 'Login com Google ainda não configurado.',
      google_oauth_state_invalid: 'Falha de validação no login com Google.',
      google_oauth_failed: 'Não foi possível concluir o login com Google.',
    };

    setError(errorMessages[errorCode] || 'Erro ao entrar com Google.');
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5 text-neutral-gray" />
            <span className="text-sm text-neutral-gray">Voltar</span>
          </Link>

          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500 mx-auto mb-4">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-white">Bem-vindo de volta</h1>
          <p className="mt-2 text-neutral-gray">Faça login para acessar seu dashboard</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-lg bg-status-red/10 border border-status-red/20 p-4 text-sm text-status-red"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <GoogleAuthButton
                label="Entrar com Google"
                onClick={handleGoogleLogin}
                isLoading={isLoading}
              />

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-bg-tertiary" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-neutral-gray">
                  <span className="bg-bg-primary px-3">ou use sua conta</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
                error={errors.email?.message}
              />

              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('rememberMe')}
                    className="h-4 w-4 rounded border border-bg-tertiary bg-bg-secondary cursor-pointer accent-primary-500"
                  />
                  <span className="text-sm text-neutral-gray">Lembrar de mim</span>
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-primary-500 hover:text-primary-400">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-6"
            >
              Entrar
            </Button>
          </Card>

          <div className="text-center text-sm text-neutral-gray">
            Não tem conta?{' '}
            <Link href="/auth/signup" className="text-primary-500 hover:text-primary-400 font-medium">
              Crie uma agora
            </Link>
          </div>
        </motion.form>

        {/* Demo Credentials Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 rounded-lg border border-status-yellow/20 bg-status-yellow/5 p-4 text-sm text-status-yellow"
        >
          <strong>Demo:</strong> Use admin@hublaia-demo.com / admin123
        </motion.div>
      </div>
    </div>
  );
}

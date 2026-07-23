'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

const signupSchema = z
  .object({
    firstName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    lastName: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirmação de senha deve ter no mínimo 6 caracteres'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Você deve aceitar os termos de serviço',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignup = () => {
    const googleAuthUrl = process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || 'http://localhost:3333/api/auth/google';

    if (!googleAuthUrl) {
      setError('O cadastro com Google ainda não foi configurado neste ambiente.');
      return;
    }

    window.location.href = googleAuthUrl;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await authService.signup(
        data.email,
        data.password,
        data.firstName,
        data.lastName
      );

      if (response.success && response.data?.accessToken) {
        const onboarding = await onboardingService.getState();
        if (onboarding.success && onboarding.data && !onboarding.data.progress.isCompleted) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError('Falha ao criar conta. Tente novamente.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
        'Erro ao criar conta. Email pode já estar registrado.'
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-neutral-white">Criar Conta</h1>
          <p className="mt-2 text-neutral-gray">
            Comece sua jornada com HublaIA
          </p>
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
                label="Criar conta com Google"
                onClick={handleGoogleSignup}
                isLoading={isLoading}
              />

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-bg-tertiary" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-neutral-gray">
                  <span className="bg-bg-primary px-3">ou use seu email</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Nome"
                  placeholder="João"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                />
                <Input
                  label="Sobrenome"
                  placeholder="Silva"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                />
              </div>

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

              <Input
                label="Confirmar Senha"
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />

              <label className="flex items-start gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  {...register('acceptTerms')}
                  className="h-4 w-4 rounded border border-bg-tertiary bg-bg-secondary cursor-pointer accent-primary-500 mt-1"
                />
                <span className="text-sm text-neutral-gray">
                  Concordo com os{' '}
                  <Link href="#" className="text-primary-500 hover:text-primary-400">
                    Termos de Serviço
                  </Link>{' '}
                  e{' '}
                  <Link href="#" className="text-primary-500 hover:text-primary-400">
                    Política de Privacidade
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-sm text-status-red">{errors.acceptTerms.message}</p>
              )}
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-6"
            >
              Criar Conta
            </Button>
          </Card>

          <div className="text-center text-sm text-neutral-gray">
            Já tem conta?{' '}
            <Link href="/auth/login" className="text-primary-500 hover:text-primary-400 font-medium">
              Faça login
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button, Input, Card } from '@/components/atoms';
import { MessageSquare, ArrowLeft, CheckCircle } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const email = watch('email');

  const onSubmit = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // TODO: Implementar chamada à API para reset de senha
      // await authService.forgotPassword(data.email);
      setSubmitted(true);
    } catch (err: any) {
      setError('Erro ao processar solicitação. Tente novamente.');
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
          <h1 className="text-3xl font-bold text-neutral-white">Recuperar Senha</h1>
          <p className="mt-2 text-neutral-gray">
            Digite seu email para receber um link de recuperação
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  <Input
                    label="Email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                </div>

                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  className="mt-6"
                >
                  Enviar Link de Recuperação
                </Button>
              </Card>

              <div className="text-center text-sm text-neutral-gray">
                Lembrou da senha?{' '}
                <Link href="/auth/login" className="text-primary-500 hover:text-primary-400 font-medium">
                  Volte ao login
                </Link>
              </div>
            </form>
          ) : (
            <Card className="p-8 text-center space-y-4">
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <CheckCircle className="h-12 w-12 text-status-green" />
                </motion.div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-neutral-white mb-2">
                  Email Enviado!
                </h2>
                <p className="text-neutral-gray">
                  Verificamos seu email e enviamos um link de recuperação para{' '}
                  <span className="font-medium text-neutral-white">{email}</span>
                </p>
              </div>

              <Button
                type="button"
                fullWidth
                onClick={() => router.push('/auth/login')}
                className="mt-6"
              >
                Voltar ao Login
              </Button>

              <p className="text-sm text-neutral-gray pt-4">
                Não recebeu o email? Verifique sua pasta de spam ou{' '}
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-primary-500 hover:text-primary-400"
                >
                  tente novamente
                </button>
              </p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/atoms';
import { ConnectionNetwork } from '@/components/molecules/ConnectionNetwork';
import { FlowDemo } from '@/components/molecules/FlowDemo';
import { useMouseSpotlight } from '@/hooks/useMouseSpotlight';
import { authService } from '@/services/auth.service';
import { onboardingService } from '@/services/onboarding.service';
import { ArrowRight, MessageSquare, Zap, Users, BarChart3 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleHandledRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isGoogleCompleting, setIsGoogleCompleting] = useState(false);
  const spotlightRef = useMouseSpotlight();

  useEffect(() => {
    if (googleHandledRef.current) {
      return;
    }

    const code = searchParams?.get('code');
    const state = searchParams?.get('state');
    const error = searchParams?.get('error');

    if (!code && !error) {
      return;
    }

    googleHandledRef.current = true;

    if (error) {
      router.replace(`/auth/login?error=${encodeURIComponent(error)}`);
      return;
    }

    if (!code || !state) {
      router.replace('/auth/login?error=google_oauth_state_invalid');
      return;
    }

    const completeGoogleLogin = async () => {
      try {
        setIsGoogleCompleting(true);
        const response = await authService.exchangeGoogleCode(code, state);

        if (response.success) {
          const onboarding = await onboardingService.getState();
          if (onboarding.success && onboarding.data && !onboarding.data.progress.isCompleted) {
            router.replace('/onboarding');
          } else {
            router.replace('/dashboard');
          }
          return;
        }

        if (response.error?.code === 'GOOGLE_OAUTH_STATE_INVALID') {
          router.replace('/auth/login?error=google_oauth_state_invalid');
          return;
        }

        router.replace('/auth/login?error=google_oauth_failed');
      } catch {
        router.replace('/auth/login?error=google_oauth_failed');
      } finally {
        setIsGoogleCompleting(false);
      }
    };

    completeGoogleLogin();
  }, [router, searchParams]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    setIsScrolled((e.target as HTMLElement).scrollTop > 0);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="overflow-hidden bg-bg-primary">
      {isGoogleCompleting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-bg-primary/90 backdrop-blur-md">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-neutral-gray">HublaIA</p>
            <h2 className="mt-3 text-xl font-semibold text-neutral-white">Finalizando login com Google</h2>
            <p className="mt-2 text-sm text-neutral-gray">Aguarde alguns segundos...</p>
          </div>
        </div>
      )}

      {/* Background com rede de conexão */}
      <ConnectionNetwork />

      {/* Spotlight effect */}
      <div
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-10 mix-blend-screen"
        style={{
          background: `radial-gradient(circle 300px at var(--spotlight-x, 0px) var(--spotlight-y, 0px), rgba(79, 70, 229, 0.15) 0%, transparent 80%)`,
        }}
      />

      {/* Navigation */}
      <nav
        className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
          isScrolled
            ? 'border-bg-tertiary/30 bg-bg-primary/60 backdrop-blur-xl'
            : 'border-bg-tertiary/0 bg-bg-primary/80 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-600"
                whileHover={{
                  boxShadow: '0 0 20px rgba(79, 70, 229, 0.5)',
                }}
                transition={{ duration: 0.3 }}
              >
                <MessageSquare className="h-5 w-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold text-neutral-white">HublaIA</span>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="md" className="transition-all duration-200 hover:text-primary-400">
                  Entrar
                </Button>
              </Link>
              <Link href="/auth/signup">
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Button
                    variant="primary"
                    size="md"
                    className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/30"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Testar Gratuitamente
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </span>
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen px-4 pt-32 pb-20 sm:px-6 lg:px-8" onScroll={handleScroll}>
        <motion.div
          className="mx-auto max-w-5xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tagline */}
          <motion.div
            variants={itemVariants}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-300 border border-primary-500/20 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="h-4 w-4" />
            </motion.div>
            Do primeiro contato ao atendimento certo.
          </motion.div>

          {/* Título com Gradient */}
          <motion.div variants={itemVariants} className="mb-6">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <motion.span
                className="bg-gradient-to-r from-neutral-white via-neutral-white to-neutral-gray bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Transforme{' '}
              </motion.span>
              <motion.span
                className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                conversas
              </motion.span>
              <motion.span
                className="bg-gradient-to-r from-neutral-white via-neutral-white to-neutral-gray bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {' '}em{' '}
              </motion.span>
              <motion.span
                className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                oportunidades.
              </motion.span>
            </h1>
          </motion.div>

          {/* Descrição */}
          <motion.p
            variants={itemVariants}
            className="mb-8 text-xl text-neutral-gray sm:text-2xl"
          >
            IA que entende. Pessoas que resolvem. Automação que funciona.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="flex items-center gap-2 w-full sm:w-auto relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Acessar Dashboard
                    <motion.span
                      className="group-hover:translate-x-1 transition-transform"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </span>
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/pricing">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto border-primary-500/20 hover:border-primary-500/50 transition-all duration-300"
                >
                  Ver planos
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="#features">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto hover:border-primary-500/50 transition-all duration-300"
                >
                  Conhecer Recursos
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Flow Demo Section */}
        <motion.div
          className="mx-auto mt-32 max-w-6xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <FlowDemo />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-bg-tertiary/50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-4xl font-bold text-neutral-white sm:text-5xl">
              Como funciona
            </h2>
            <p className="text-lg text-neutral-gray">
              Tudo que você precisa para automatizar e gerenciar conversas
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: MessageSquare,
                title: 'IA Conversacional',
                description: 'Chatbot inteligente que entende o contexto e responde naturalmente',
              },
              {
                icon: Zap,
                title: 'Qualificação Automática',
                description: 'Identifica e qualifica leads em tempo real durante a conversa',
              },
              {
                icon: Users,
                title: 'Roteamento Inteligente',
                description: 'Conecta automaticamente ao profissional mais adequado',
              },
              {
                icon: BarChart3,
                title: 'Analytics Detalhado',
                description: 'Dashboard completo com métricas e insights de vendas',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="rounded-xl border border-bg-tertiary/50 bg-bg-secondary/50 p-6 backdrop-blur-sm hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className="h-10 w-10 text-primary-500 mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <feature.icon className="h-10 w-10" />
                </motion.div>
                <h3 className="mb-2 text-lg font-semibold text-neutral-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-gray">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-bg-tertiary/50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-4xl font-bold text-neutral-white">
              Pronto para transformar seu negócio?
            </h2>
            <p className="mb-8 text-lg text-neutral-gray">
              Comece gratuitamente e veja os resultados em dias, não semanas.
            </p>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="mx-auto flex items-center gap-2 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Começar Agora
                    <motion.span
                      className="group-hover:translate-x-1 transition-transform"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.span>
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-bg-tertiary/50 bg-bg-secondary/50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-neutral-gray">
          <p>&copy; 2024 HublaIA. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

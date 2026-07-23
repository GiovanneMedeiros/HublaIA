'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/atoms';
import { PricingCard } from '@/components/molecules/PricingCard';
import { PricingToggle } from '@/components/molecules/PricingToggle';
import { ComparisonTable } from '@/components/molecules/ComparisonTable';
import { FAQAccordion } from '@/components/molecules/FAQAccordion';
import { useMouseSpotlight } from '@/hooks/useMouseSpotlight';
import { ConnectionNetwork } from '@/components/molecules/ConnectionNetwork';
import { HublaIAConnectionExperience } from '@/components/molecules/HublaIAConnectionExperience';
import { ArrowRight, MessageSquare, Zap, Clock, Shield, Headphones } from 'lucide-react';

const PLANS_MONTHLY = {
  starter: 197,
  professional: 497,
  enterprise: 'custom' as const,
};

const PLANS_ANNUAL = {
  starter: 1970,
  professional: 4970,
  enterprise: 'custom' as const,
};

const FAQItems = [
  {
    question: 'Posso cancelar minha assinatura?',
    answer:
      'Sim! Você pode cancelar sua assinatura a qualquer momento. Sem compromissos de longo prazo. Sua assinatura será encerrada no final do período de cobrança.',
  },
  {
    question: 'Preciso contratar um plano anual?',
    answer:
      'Não, é totalmente opcional. Oferecemos tanto planos mensais quanto anuais. O plano anual oferece até 16% de economia em comparação com o plano mensal.',
  },
  {
    question: 'Posso mudar de plano depois?',
    answer:
      'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Se você passar para um plano mais caro, será cobrada a diferença pró-rata. Se mudar para um plano mais barato, terá crédito para os próximos meses.',
  },
  {
    question: 'O HublaIA funciona para qualquer empresa?',
    answer:
      'O HublaIA foi desenvolvido para empresas de qualquer tamanho que querem automatizar e escalar seus atendimentos por WhatsApp. Imobiliárias, agências, consultórios e muito mais. Se você usa WhatsApp para atender clientes, o HublaIA é para você.',
  },
  {
    question: 'Como funciona a integração com o WhatsApp?',
    answer:
      'A integração é simples. Você conecta seu número de WhatsApp (pessoal ou comercial) à plataforma. A IA receberá e responderá às mensagens automaticamente, qualificando leads e encaminhando para a equipe certa.',
  },
  {
    question: 'Existe período de teste?',
    answer:
      'Sim! Todos os planos podem ser testados gratuitamente por 14 dias sem necessidade de cartão de crédito. Você tem acesso completo aos recursos do seu plano durante o período de teste.',
  },
  {
    question: 'As conversas são seguras?',
    answer:
      'Sim! Usamos encriptação de ponta a ponta para todas as conversas. Seus dados estão seguros em servidores certificados em conformidade com LGPD. Nunca compartilhamos dados com terceiros.',
  },
];

const COMPARISON_ITEMS = [
  { label: 'Atendimento com IA', starter: true, professional: true, enterprise: true },
  { label: 'Qualificação de leads', starter: true, professional: true, enterprise: true },
  { label: 'Número de WhatsApp', starter: '1', professional: 'Ilimitados', enterprise: 'Ilimitados' },
  { label: 'Usuários', starter: 'Até 3', professional: 'Ilimitados', enterprise: 'Ilimitados' },
  { label: 'Fila inteligente', starter: false, professional: true, enterprise: true },
  { label: 'Distribuição automática', starter: false, professional: true, enterprise: true },
  { label: 'Múltiplos departamentos', starter: false, professional: true, enterprise: true },
  { label: 'Relatórios', starter: 'Básicos', professional: 'Avançados', enterprise: 'Avançados' },
  { label: 'Integrações', starter: false, professional: true, enterprise: true },
  { label: 'Personalização da IA', starter: false, professional: true, enterprise: true },
  { label: 'Suporte', starter: 'E-mail', professional: 'Prioritário', enterprise: 'Dedicado' },
  { label: 'SLA', starter: false, professional: false, enterprise: 'Personalizado' },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const spotlightRef = useMouseSpotlight();

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

  const getPrice = (plan: 'starter' | 'professional') => {
    if (plan === 'starter') {
      return isAnnual ? PLANS_ANNUAL.starter : PLANS_MONTHLY.starter;
    }
    return isAnnual ? PLANS_ANNUAL.professional : PLANS_MONTHLY.professional;
  };

  const getAnnualSavings = (plan: 'starter' | 'professional') => {
    if (!isAnnual) return undefined;
    if (plan === 'starter') {
      const monthlyTotal = PLANS_MONTHLY.starter * 12;
      const saved = monthlyTotal - PLANS_ANNUAL.starter;
      return `Economize R$ ${saved.toLocaleString('pt-BR')} (2 meses grátis)`;
    }
    const monthlyTotal = PLANS_MONTHLY.professional * 12;
    const saved = monthlyTotal - PLANS_ANNUAL.professional;
    return `Economize R$ ${saved.toLocaleString('pt-BR')} (2 meses grátis)`;
  };

  return (
    <div className="overflow-hidden bg-bg-primary">
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
      <nav className="fixed top-0 z-50 w-full border-b border-bg-tertiary/30 bg-bg-primary/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <motion.div
                className="flex items-center gap-2 cursor-pointer"
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
            </Link>

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
      <section className="min-h-screen px-4 pt-32 pb-20 sm:px-6 lg:px-8 flex items-center">
        <motion.div
          className="mx-auto max-w-4xl w-full text-center"
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
            Escolha o plano ideal.
          </motion.div>

          {/* Título */}
          <motion.h1 variants={itemVariants} className="text-5xl font-bold tracking-tight sm:text-6xl mb-6">
            Escolha o plano ideal para o seu negócio.
          </motion.h1>

          {/* Subtítulo */}
          <motion.p variants={itemVariants} className="text-xl text-neutral-gray sm:text-2xl mb-8">
            Comece pequeno, cresça quando precisar. Tenha atendimento inteligente, distribuição de leads e uma equipe mais eficiente em um só lugar.
          </motion.p>

          {/* Trust Message */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 text-sm text-neutral-gray mb-12"
          >
            <Shield className="h-4 w-4 text-primary-500" />
            Sem compromisso. Cancele quando quiser.
          </motion.div>

          {/* Pricing Toggle */}
          <motion.div
            variants={itemVariants}
            className="mb-12"
          >
            <PricingToggle onToggle={setIsAnnual} />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mb-8 text-center"
          >
            <p className="text-sm font-medium text-neutral-gray">
              Acompanhe a jornada que conecta cliente, HublaIA e profissional.
            </p>
          </motion.div>
        </motion.div>
      </section>

          {/* Connection Experience */}
          <HublaIAConnectionExperience className="pb-8 sm:pb-10 lg:pb-12" />

      {/* Pricing Cards Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-7xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Cards */}
          <div className="grid gap-8 lg:grid-cols-3 items-end">
            {/* Starter */}
            <PricingCard
              name="Starter"
              description="Para empresas que estão começando a organizar seus atendimentos."
              price={getPrice('starter')}
              period={isAnnual ? 'annual' : 'monthly'}
              annualSavings={getAnnualSavings('starter')}
              features={[
                '✓ 1 número de WhatsApp',
                '✓ Até 3 usuários',
                '✓ Atendimento com IA',
                '✓ Qualificação de leads',
                '✓ Encaminhamento automático',
                '✓ Dashboard',
                '✓ Relatórios básicos',
                '✓ Suporte por e-mail',
              ]}
              buttonText="Começar agora"
              buttonVariant="secondary"
            />

            {/* Professional (Highlighted) */}
            <PricingCard
              name="Professional"
              description="Para empresas que querem automatizar e escalar seus atendimentos."
              price={getPrice('professional')}
              period={isAnnual ? 'annual' : 'monthly'}
              badge="Mais escolhido"
              annualSavings={getAnnualSavings('professional')}
              features={[
                '✓ Tudo do Starter',
                '✓ Usuários ilimitados',
                '✓ Fila inteligente',
                '✓ Distribuição automática de leads',
                '✓ Painel da equipe',
                '✓ Múltiplos departamentos',
                '✓ Relatórios avançados',
                '✓ Integrações',
                '✓ Personalização da IA',
                '✓ Suporte prioritário',
              ]}
              buttonText="Começar agora"
              buttonVariant="primary"
              isHighlighted
            />

            {/* Enterprise */}
            <PricingCard
              name="Enterprise"
              description="Para empresas maiores que precisam de uma solução personalizada."
              price="Vamos conversar"
              period="monthly"
              features={[
                '✓ Tudo do Professional',
                '✓ Múltiplos números de WhatsApp',
                '✓ Múltiplas unidades',
                '✓ Integrações personalizadas',
                '✓ IA personalizada',
                '✓ Suporte dedicado',
                '✓ SLA personalizado',
                '✓ Implantação assistida',
              ]}
              buttonText="Falar com especialista"
              buttonVariant="secondary"
              onCtaClick={() => {
                // Open contact form or chat
                console.log('Enterprise contact');
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* Comparison Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-bg-secondary/30">
        <motion.div
          className="mx-auto max-w-7xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-neutral-white mb-4">
              Compare todos os recursos
            </h2>
            <p className="text-neutral-gray">
              Veja em detalhes o que está incluído em cada plano
            </p>
          </div>

          {/* Table */}
          <ComparisonTable items={COMPARISON_ITEMS} />
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Title */}
          <h2 className="text-3xl font-bold text-neutral-white mb-4">
            Seu negócio cresce. O HublaIA acompanha.
          </h2>
          <p className="text-lg text-neutral-gray mb-12">
            Comece com os recursos que você precisa hoje e evolua conforme sua operação cresce.
          </p>

          {/* Benefits Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Clock,
                title: 'Comece em minutos',
                description: 'Conecte seu WhatsApp e comece a receber inteligência artificial em suas conversas em minutos.',
              },
              {
                icon: Shield,
                title: 'Sem contratos longos',
                description: 'Sem compromissos. Você controla sua assinatura e pode cancelar quando quiser.',
              },
              {
                icon: Headphones,
                title: 'Suporte quando precisar',
                description: 'Nossa equipe está aqui para ajudar. Suporte por e-mail, chat ou telefone, dependendo do seu plano.',
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/20 mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <benefit.icon className="h-6 w-6 text-primary-500" />
                </motion.div>
                <h3 className="font-semibold text-neutral-white mb-2">{benefit.title}</h3>
                <p className="text-sm text-neutral-gray">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Gradient */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
          }}
        />

        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Title */}
          <h2 className="text-3xl font-bold text-neutral-white mb-4">
            Pronto para transformar seu atendimento?
          </h2>

          {/* Description */}
          <p className="text-lg text-neutral-gray mb-8">
            Comece hoje e descubra como o HublaIA pode ajudar sua equipe a atender melhor e aproveitar mais oportunidades.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/signup">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  Testar gratuitamente
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Agendar demonstração
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-bg-secondary/30">
        <motion.div
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-neutral-white mb-4">
              Perguntas frequentes
            </h2>
            <p className="text-neutral-gray">
              Tire suas dúvidas sobre preços, funcionalidades e como funciona o HublaIA
            </p>
          </div>

          {/* Accordion */}
          <FAQAccordion items={FAQItems} />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-bg-tertiary/30 bg-bg-primary/50 backdrop-blur px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-600">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-neutral-white">HublaIA</span>
              </div>
              <p className="text-sm text-neutral-gray">
                Transforme conversas em oportunidades.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-neutral-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-neutral-gray">
                <li><Link href="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
                <li><Link href="/pricing" className="hover:text-primary-400 transition-colors">Preços</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition-colors">Recursos</Link></li>
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="font-semibold text-neutral-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-neutral-gray">
                <li><Link href="#" className="hover:text-primary-400 transition-colors">Sobre</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition-colors">Contato</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-neutral-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-gray">
                <li><Link href="#" className="hover:text-primary-400 transition-colors">Privacidade</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition-colors">Termos</Link></li>
                <li><Link href="#" className="hover:text-primary-400 transition-colors">LGPD</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-bg-tertiary/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-gray">
              © 2026 HublaIA. Todos os direitos reservados.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-neutral-gray hover:text-primary-400 transition-colors">
                Twitter
              </Link>
              <Link href="#" className="text-neutral-gray hover:text-primary-400 transition-colors">
                LinkedIn
              </Link>
              <Link href="#" className="text-neutral-gray hover:text-primary-400 transition-colors">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { MessageSquare, Zap, CheckCircle, User } from 'lucide-react';

type FlowState = 'message' | 'analyzing' | 'qualified' | 'found' | 'assigned';

interface FlowStep {
  id: FlowState;
  title: string;
  icon: React.ReactNode;
  color: string;
}

const steps: FlowStep[] = [
  { id: 'message', title: 'Cliente enviou uma mensagem', icon: <MessageSquare className="h-6 w-6" />, color: 'from-blue-500 to-blue-600' },
  { id: 'analyzing', title: 'HublaIA analisando...', icon: <Zap className="h-6 w-6" />, color: 'from-purple-500 to-purple-600' },
  { id: 'qualified', title: 'Lead qualificado', icon: <CheckCircle className="h-6 w-6" />, color: 'from-emerald-500 to-emerald-600' },
  { id: 'found', title: 'Profissional encontrado', icon: <User className="h-6 w-6" />, color: 'from-indigo-500 to-indigo-600' },
  { id: 'assigned', title: 'Atendimento encaminhado', icon: <CheckCircle className="h-6 w-6" />, color: 'from-green-500 to-green-600' },
];

export function FlowDemo() {
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % (steps.length + 1));
    }, 3000); // 3 segundos por estado

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = ((currentStep + 1) / (steps.length + 1)) * 100;

  return (
    <div className="mx-auto max-w-5xl space-y-12">
      {/* Barra de Progresso */}
      <div className="space-y-3">
        <p className="text-center text-sm font-medium text-neutral-gray">
          Fluxo automático em ação
        </p>
        <div className="relative h-1 overflow-hidden rounded-full bg-bg-tertiary">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Cards do Fluxo */}
      <div className="grid gap-6 md:grid-cols-5">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            className={`relative rounded-xl border-2 p-4 transition-all duration-300 ${
              index < currentStep
                ? 'border-green-500/50 bg-green-500/10'
                : index === currentStep
                  ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                  : 'border-bg-tertiary bg-bg-secondary/50'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            {/* Ícone */}
            <div
              className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                index < currentStep
                  ? 'bg-green-500/20 text-green-400'
                  : index === currentStep
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-bg-tertiary text-neutral-gray'
              }`}
            >
              {step.icon}
            </div>

            {/* Titulo */}
            <h4 className="text-sm font-semibold text-neutral-white">
              {step.title}
            </h4>

            {/* Indicador de Atividade */}
            {index === currentStep && (
              <div className="mt-3 flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span className="text-xs text-blue-400">Processando...</span>
              </div>
            )}

            {/* Checkmark para Completo */}
            {index < currentStep && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-3 text-xs font-medium text-green-400"
              >
                ✓ Concluído
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Card de Demonstração - Lado Esquerdo (Conversa) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* CONVERSA */}
        <motion.div
          className="rounded-2xl border border-bg-tertiary/50 bg-gradient-to-br from-bg-secondary/80 to-bg-secondary/40 p-6 backdrop-blur-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="mb-4 text-sm font-semibold text-neutral-gray uppercase tracking-wide">
            Conversa em Tempo Real
          </p>

          <div className="space-y-4">
            {/* Cliente */}
            <motion.div
              className="flex justify-end"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="max-w-xs rounded-2xl rounded-tr-none bg-blue-600 px-4 py-2 text-white">
                <p className="text-sm">
                  Oi, procuro um apartamento de 2 quartos em Viamão até R$350 mil
                </p>
              </div>
            </motion.div>

            {/* HublaIA */}
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="max-w-xs rounded-2xl rounded-tl-none bg-bg-tertiary px-4 py-2 text-neutral-white">
                <p className="text-sm">
                  Entendido! Vou procurar as melhores opções para você.
                </p>
              </div>
            </motion.div>

            {/* HublaIA Qualificando */}
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="max-w-xs rounded-2xl rounded-tl-none border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-neutral-white">
                <p className="text-sm">
                  Qualificação em progresso...
                </p>
              </div>
            </motion.div>

            {/* Encaminhamento */}
            {currentStep >= 4 && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="max-w-xs rounded-2xl rounded-tl-none border border-green-500/30 bg-green-500/10 px-4 py-2 text-neutral-white">
                  <p className="text-sm font-medium">
                    ✓ Vou conectar você com o profissional ideal
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* QUALIFICAÇÃO + RESULTADO */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Lead Qualificado */}
          <div className="rounded-2xl border border-primary-500/30 bg-gradient-to-br from-primary-500/10 to-accent-600/10 p-6 backdrop-blur-sm">
            <p className="mb-3 text-xs font-semibold text-primary-300 uppercase tracking-wide">
              Lead Qualificado
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-gray">Tipo</span>
                <span className="font-semibold text-neutral-white">Apartamento</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-gray">Localização</span>
                <span className="font-semibold text-neutral-white">Viamão</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-gray">Quartos</span>
                <span className="font-semibold text-neutral-white">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-gray">Orçamento</span>
                <span className="font-semibold text-neutral-white">R$ 350.000</span>
              </div>
            </div>
          </div>

          {/* Profissional Encontrado */}
          {currentStep >= 3 && (
            <motion.div
              className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-4 text-xs font-semibold text-emerald-300 uppercase tracking-wide">
                ✓ Profissional Disponível
              </p>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold">
                  CS
                </div>
                <div>
                  <p className="font-semibold text-neutral-white">Carlos Silva</p>
                  <p className="text-sm text-neutral-gray">Especialista em Imóveis</p>
                </div>
                <div className="ml-auto">
                  <div className="flex h-3 w-3 items-center justify-center rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Status */}
          <motion.div
            className="rounded-2xl border border-bg-tertiary/50 bg-bg-secondary/50 p-4 text-center"
            animate={currentStep >= 4 ? { scale: 1.02 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep < 4 ? (
              <>
                <p className="text-sm text-neutral-gray">● Processando...</p>
                <p className="mt-1 text-xs text-neutral-gray">
                  {steps[Math.min(currentStep, steps.length - 1)]?.title}
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-green-400">✓ Atendimento Encaminhado</p>
                <p className="mt-1 text-sm text-neutral-gray">
                  Carlos está pronto para ajudá-lo
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Indicador de Reinício */}
      <motion.div
        className="flex items-center justify-center gap-2 text-xs text-neutral-gray"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
        Demonstração em loop automático
        <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
      </motion.div>
    </div>
  );
}

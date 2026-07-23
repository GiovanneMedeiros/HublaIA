'use client';

import React from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import {
  BadgeCheck,
  MessagesSquare,
  MessageSquare,
  MoveRight,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import {
  useHublaIAConnectionExperience,
} from '@/hooks/useHublaIAConnectionExperience';

const STORY_STEPS = [
  {
    title: 'Cliente',
    text: 'Olá, estou procurando uma solução.',
    accent: 'from-sky-500/20 to-sky-500/5',
    icon: User,
  },
  {
    title: 'HublaIA',
    text: 'Entendendo o atendimento...',
    accent: 'from-violet-500/20 to-violet-500/5',
    icon: Sparkles,
  },
  {
    title: 'Lead qualificado',
    text: 'Interesse identificado',
    accent: 'from-indigo-500/20 to-indigo-500/5',
    icon: BadgeCheck,
  },
  {
    title: 'Profissional',
    text: 'Atendimento encaminhado',
    accent: 'from-emerald-500/20 to-emerald-500/5',
    icon: Users,
  },
] as const;

const ORBIT_NODES = [
  {
    label: 'Conversa',
    icon: MessagesSquare,
    color: 'text-sky-200',
    border: 'border-sky-400/25',
    glow: 'from-sky-500/12 to-sky-500/5',
  },
  {
    label: 'Cliente',
    icon: User,
    color: 'text-indigo-100',
    border: 'border-indigo-400/25',
    glow: 'from-indigo-500/12 to-indigo-500/5',
  },
  {
    label: 'Lead',
    icon: BadgeCheck,
    color: 'text-violet-100',
    border: 'border-violet-400/25',
    glow: 'from-violet-500/12 to-violet-500/5',
  },
  {
    label: 'Profissional',
    icon: Users,
    color: 'text-emerald-100',
    border: 'border-emerald-400/25',
    glow: 'from-emerald-500/12 to-emerald-500/5',
  },
] as const;

function FlowConnector({
  fromX,
  fromY,
  toX,
  toY,
  progress,
  opacity,
}: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: MotionValue<number>;
  opacity: MotionValue<number>;
}) {
  const pathLength = Math.hypot(toX - fromX, toY - fromY);
  const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);
  const dotX = useTransform(progress, [0, 1], [fromX, toX]);
  const dotY = useTransform(progress, [0, 1], [fromY, toY]);
  const lineScale = useTransform(progress, [0, 1], [0, 1]);

  return (
    <>
      <motion.div
        className="absolute h-px origin-left rounded-full bg-gradient-to-r from-sky-300/35 via-violet-300/25 to-transparent"
        style={{
          left: fromX,
          top: fromY,
          width: pathLength,
          rotate: angle,
          scaleX: lineScale,
          opacity,
        }}
      />
      <motion.div
        className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.98)_0%,rgba(56,189,248,0.75)_32%,rgba(124,58,237,0.18)_68%,transparent_100%)] shadow-[0_0_18px_rgba(56,189,248,0.45)]"
        style={{ left: dotX, top: dotY, opacity }}
      />
    </>
  );
}

function OrbitNode({
  label,
  icon: Icon,
  motionStyle,
  progress,
  variant,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  motionStyle: {
    x: MotionValue<number>;
    y: MotionValue<number>;
    rotate: MotionValue<number>;
    scale: MotionValue<number>;
  };
  progress: MotionValue<number>;
  variant: (typeof ORBIT_NODES)[number];
}) {
  const opacity = useTransform(progress, [0, 0.16, 1], [0.72, 1, 1]);

  return (
    <motion.div
      className={cn(
        'absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-2xl border bg-white/5 px-4 py-3 shadow-[0_12px_40px_rgba(2,6,23,0.24)] backdrop-blur-xl',
        variant.border
      )}
      style={{
        x: motionStyle.x,
        y: motionStyle.y,
        rotate: motionStyle.rotate,
        scale: motionStyle.scale,
        opacity,
      }}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl border bg-gradient-to-br',
          variant.glow,
          variant.color,
          variant.border
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-200/80">
        {label}
      </span>
    </motion.div>
  );
}

export function HublaIAConnectionExperience({ className }: { className?: string }) {
  const {
    sectionRef,
    smoothProgress,
    stage,
    isInteractive,
    handlePointerMove,
    resetPointer,
    coreScale,
    coreRotate,
    coreGlow,
    coreRing,
    clientMotion,
    conversationMotion,
    leadMotion,
    professionalMotion,
  } = useHublaIAConnectionExperience();

  const panelRotate = useTransform(smoothProgress, [0, 1], [0, 12]);
  const panelScale = useTransform(smoothProgress, [0, 1], [0.98, 1.04]);

  const lineOneProgress = useTransform(smoothProgress, [0, 0.26], [0, 1], {
    clamp: true,
  });
  const lineTwoProgress = useTransform(smoothProgress, [0.18, 0.56], [0, 1], {
    clamp: true,
  });
  const lineThreeProgress = useTransform(smoothProgress, [0.42, 0.82], [0, 1], {
    clamp: true,
  });

  const stageOpacity = [
    useTransform(smoothProgress, [0, 0.08, 0.22], [1, 1, 0.2]),
    useTransform(smoothProgress, [0.12, 0.28, 0.42], [0.25, 1, 0.25]),
    useTransform(smoothProgress, [0.34, 0.5, 0.66], [0.2, 1, 0.3]),
    useTransform(smoothProgress, [0.58, 0.78, 1], [0.18, 0.88, 1]),
  ];

  const stageScale = [
    useTransform(smoothProgress, [0, 0.08, 0.22], [1, 1.03, 0.98]),
    useTransform(smoothProgress, [0.12, 0.28, 0.42], [0.96, 1.04, 0.98]),
    useTransform(smoothProgress, [0.34, 0.5, 0.66], [0.95, 1.04, 1]),
    useTransform(smoothProgress, [0.58, 0.78, 1], [0.94, 1.04, 1.05]),
  ];

  const nodes = [
    { ...ORBIT_NODES[0], motion: clientMotion },
    { ...ORBIT_NODES[1], motion: conversationMotion },
    { ...ORBIT_NODES[2], motion: leadMotion },
    { ...ORBIT_NODES[3], motion: professionalMotion },
  ];

  return (
    <section ref={sectionRef} className={cn('relative overflow-hidden px-4 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto max-w-7xl py-8 sm:py-12 lg:py-16">
        <motion.div
          className="mb-8 text-center lg:mb-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-120px' }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-sky-300/80">
            HublaIA Connection Experience
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-white sm:text-4xl lg:text-5xl">
            Uma plataforma. Toda a sua operação conectada.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base text-neutral-gray sm:text-lg">
            Veja como uma mensagem percorre o sistema até chegar ao profissional certo, sem ruído, sem fricção e com contexto preservado.
          </p>
        </motion.div>

        <div
          className="group relative"
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
        >
          <motion.div
            className="relative overflow-hidden rounded-[2rem] border border-bg-tertiary/60 bg-gradient-to-br from-bg-secondary/95 via-bg-secondary/80 to-bg-primary/80 shadow-[0_30px_100px_rgba(2,6,23,0.45)] backdrop-blur-2xl"
            style={{
              rotate: isInteractive ? panelRotate : 0,
              scale: isInteractive ? panelScale : 1,
            }}
          >
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  'radial-gradient(circle at top left, rgba(56,189,248,0.14), transparent 32%), radial-gradient(circle at bottom right, rgba(124,58,237,0.12), transparent 30%)',
              }}
            />

            <div className="relative grid gap-10 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 lg:p-10">
              <div className="relative min-h-[32rem] rounded-[1.75rem] border border-white/8 bg-white/[0.02] p-5 shadow-inner shadow-black/10 sm:p-8">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0" aria-hidden="true">
                    <FlowConnector
                      fromX={170}
                      fromY={304}
                      toX={360}
                      toY={320}
                      progress={lineOneProgress}
                      opacity={useTransform(smoothProgress, [0, 0.1, 0.18], [0.2, 0.8, 1])}
                    />
                    <FlowConnector
                      fromX={360}
                      fromY={320}
                      toX={544}
                      toY={234}
                      progress={lineTwoProgress}
                      opacity={useTransform(smoothProgress, [0.16, 0.36, 0.5], [0.1, 0.82, 1])}
                    />
                    <FlowConnector
                      fromX={544}
                      fromY={234}
                      toX={534}
                      toY={446}
                      progress={lineThreeProgress}
                      opacity={useTransform(smoothProgress, [0.36, 0.64, 0.9], [0.08, 0.8, 1])}
                    />
                  </div>
                </div>

                <motion.div
                  className="relative mx-auto flex h-[18rem] w-[18rem] items-center justify-center rounded-full sm:h-[20rem] sm:w-[20rem] lg:h-[23rem] lg:w-[23rem]"
                  style={{
                    scale: isInteractive ? coreScale : 1,
                    rotate: isInteractive ? coreRotate : 0,
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full border border-sky-300/10 bg-gradient-to-br from-sky-400/10 via-indigo-400/6 to-violet-400/10 blur-2xl"
                    style={{ opacity: isInteractive ? coreGlow : 0.55 }}
                  />
                  <motion.div
                    className="absolute inset-5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl"
                    style={{ opacity: isInteractive ? coreRing : 0.22 }}
                  />
                  <motion.div
                    className="absolute inset-10 rounded-full border border-sky-200/15 bg-gradient-to-br from-bg-secondary/80 to-bg-primary/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.9rem] border border-white/12 bg-gradient-to-br from-white/14 via-white/6 to-transparent shadow-[0_20px_50px_rgba(2,6,23,0.3)] backdrop-blur-xl sm:h-28 sm:w-28">
                    <div className="absolute inset-0 rounded-[1.9rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_55%)]" />
                    <MessageSquare className="relative z-10 h-9 w-9 text-white sm:h-10 sm:w-10" />
                  </div>
                </motion.div>

                {nodes.map((node) => (
                  <OrbitNode
                    key={node.label}
                    label={node.label}
                    icon={node.icon}
                    motionStyle={node.motion}
                    progress={smoothProgress}
                    variant={node}
                  />
                ))}

                <div className="absolute left-5 top-5 rounded-full border border-sky-300/15 bg-sky-400/8 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-sky-100/80 backdrop-blur-xl">
                  Cliente → HublaIA → Profissional
                </div>

                <motion.div
                  className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-bg-primary/70 px-4 py-4 text-sm text-neutral-gray backdrop-blur-xl sm:px-5"
                  style={{
                    opacity: useTransform(smoothProgress, [0, 0.18, 0.36, 1], [0.9, 0.96, 1, 1]),
                  }}
                >
                  <span className="block text-xs uppercase tracking-[0.28em] text-sky-200/80">
                    Fluxo em movimento
                  </span>
                  <span className="mt-2 block text-neutral-white">
                    A conexão visual cresce conforme o contexto avança pelo sistema.
                  </span>
                </motion.div>
              </div>

              <div className="flex flex-col justify-between gap-6 lg:min-h-[32rem] lg:py-2">
                <div className="space-y-4">
                  <div className="inline-flex rounded-full border border-white/8 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-neutral-gray backdrop-blur-xl">
                    Fluxo narrativo
                  </div>

                  <div className="space-y-3">
                    {STORY_STEPS.map((step, index) => {
                      const Icon = step.icon;

                      return (
                        <motion.div
                          key={step.title}
                          className={cn(
                            'rounded-2xl border p-4 backdrop-blur-xl transition-all duration-300',
                            `bg-gradient-to-br ${step.accent}`,
                            index <= stage
                              ? 'border-white/12 shadow-[0_18px_50px_rgba(2,6,23,0.2)]'
                              : 'border-white/6 opacity-55'
                          )}
                          style={{
                            opacity: stageOpacity[index],
                            scale: stageScale[index],
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/6 text-white/90">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-gray">
                                Etapa {index + 1}
                              </p>
                              <h3 className="text-lg font-semibold text-neutral-white">
                                {step.title}
                              </h3>
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-neutral-gray">
                            {step.text}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <motion.div
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_50px_rgba(2,6,23,0.2)] backdrop-blur-xl"
                  initial={false}
                  animate={stage >= 3 ? { y: 0, opacity: 1 } : { y: 0, opacity: 0.9 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200/80">
                    Conexão concluída
                  </p>
                  <div className="mt-3 flex items-start gap-3">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/12 text-emerald-200">
                      <MoveRight className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-neutral-white">
                        Uma plataforma. Toda a sua operação conectada.
                      </p>
                      <p className="mt-1 text-sm leading-6 text-neutral-gray">
                        O visitante entende a jornada antes mesmo de comparar os planos.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
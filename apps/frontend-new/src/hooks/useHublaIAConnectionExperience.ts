'use client';

import { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import {
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

export type ConnectionStage = 0 | 1 | 2 | 3;

interface NodeMotionConfig {
  baseX: number;
  baseY: number;
  orbitX: number;
  orbitY: number;
  phase: number;
  parallaxX: number;
  parallaxY: number;
  rotateFrom: number;
  rotateTo: number;
  scaleFrom: number;
  scaleTo: number;
}

export interface NodeMotion {
  x: MotionValue<number>;
  y: MotionValue<number>;
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
}

export function useNodeMotion(
  progress: MotionValue<number>,
  pointerX: MotionValue<number>,
  pointerY: MotionValue<number>,
  config: NodeMotionConfig,
): NodeMotion {
  const x = useTransform(() => {
    const currentProgress = progress.get();
    const currentMouseX = pointerX.get();
    const orbit = Math.sin(currentProgress * Math.PI * 2 + config.phase) * config.orbitX;
    const parallax = currentMouseX * config.parallaxX;
    return config.baseX + orbit + parallax;
  });

  const y = useTransform(() => {
    const currentProgress = progress.get();
    const currentMouseY = pointerY.get();
    const orbit = Math.cos(currentProgress * Math.PI * 2 + config.phase) * config.orbitY;
    const parallax = currentMouseY * config.parallaxY;
    return config.baseY + orbit + parallax;
  });

  const rotate = useTransform(progress, [0, 1], [config.rotateFrom, config.rotateTo]);
  const scale = useTransform(progress, [0, 1], [config.scaleFrom, config.scaleTo]);

  return {
    x,
    y,
    rotate,
    scale,
  };
}

export function useHublaIAConnectionExperience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scroll = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 20%'],
  });
  const smoothProgress = useSpring(scroll.scrollYProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.3,
  });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const [stage, setStage] = useState<ConnectionStage>(0);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smallScreen = window.matchMedia('(max-width: 768px)').matches;

    setIsInteractive(!reducedMotion && !smallScreen);
  }, []);

  useMotionValueEvent(smoothProgress, 'change', (value) => {
    const nextStage = Math.min(3, Math.floor(value * 4.25)) as ConnectionStage;
    setStage((current) => (current === nextStage ? current : nextStage));
  });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteractive || !sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    pointerX.set(Math.max(-1, Math.min(1, x)));
    pointerY.set(Math.max(-1, Math.min(1, y)));
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const coreScale = useTransform(smoothProgress, [0, 1], [1, 1.08]);
  const coreRotate = useTransform(smoothProgress, [0, 1], [0, 18]);
  const coreGlow = useTransform(smoothProgress, [0, 1], [0.48, 0.78]);
  const coreRing = useTransform(smoothProgress, [0, 1], [0.18, 0.4]);

  const clientMotion = useNodeMotion(smoothProgress, pointerX, pointerY, {
    baseX: -170,
    baseY: -18,
    orbitX: 10,
    orbitY: 8,
    phase: 0.5,
    parallaxX: 10,
    parallaxY: 8,
    rotateFrom: -4,
    rotateTo: 8,
    scaleFrom: 0.96,
    scaleTo: 1,
  });

  const conversationMotion = useNodeMotion(smoothProgress, pointerX, pointerY, {
    baseX: -90,
    baseY: -150,
    orbitX: 14,
    orbitY: 10,
    phase: 1.8,
    parallaxX: 8,
    parallaxY: 8,
    rotateFrom: 2,
    rotateTo: 12,
    scaleFrom: 0.95,
    scaleTo: 1.02,
  });

  const leadMotion = useNodeMotion(smoothProgress, pointerX, pointerY, {
    baseX: 190,
    baseY: -90,
    orbitX: 12,
    orbitY: 8,
    phase: 2.9,
    parallaxX: 10,
    parallaxY: 8,
    rotateFrom: 6,
    rotateTo: 18,
    scaleFrom: 0.96,
    scaleTo: 1.03,
  });

  const professionalMotion = useNodeMotion(smoothProgress, pointerX, pointerY, {
    baseX: 170,
    baseY: 130,
    orbitX: 10,
    orbitY: 12,
    phase: 4.4,
    parallaxX: 12,
    parallaxY: 10,
    rotateFrom: -6,
    rotateTo: 10,
    scaleFrom: 0.94,
    scaleTo: 1.02,
  });

  return {
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
  };
}
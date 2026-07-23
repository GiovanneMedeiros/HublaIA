'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
}

export function ConnectionNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    // Detectar preferência de reduzir movimento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Inicializar nós
    nodesRef.current = [
      { x: canvas.width * 0.2, y: canvas.height * 0.4, vx: 0.2, vy: 0.1, radius: 4, label: 'Cliente' },
      { x: canvas.width * 0.5, y: canvas.height * 0.3, vx: -0.15, vy: 0.2, radius: 5, label: 'IA' },
      { x: canvas.width * 0.8, y: canvas.height * 0.5, vx: 0.1, vy: -0.1, radius: 4, label: 'Profissional' },
      { x: canvas.width * 0.3, y: canvas.height * 0.7, vx: 0.18, vy: 0.08, radius: 3, label: 'Dados' },
      { x: canvas.width * 0.7, y: canvas.height * 0.2, vx: -0.1, vy: 0.15, radius: 3, label: 'Contexto' },
    ];

    const animate = () => {
      // Limpar canvas com fade
      ctx.fillStyle = 'rgba(11, 18, 32, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Atualizar posições
      nodesRef.current.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce nas bordas
        if (node.x - node.radius < 0 || node.x + node.radius > canvas.width) {
          node.vx = -node.vx;
          node.x = Math.max(node.radius, Math.min(canvas.width - node.radius, node.x));
        }
        if (node.y - node.radius < 0 || node.y + node.radius > canvas.height) {
          node.vy = -node.vy;
          node.y = Math.max(node.radius, Math.min(canvas.height - node.radius, node.y));
        }
      });

      // Desenhar linhas de conexão
      ctx.strokeStyle = 'rgba(79, 70, 229, 0.15)';
      ctx.lineWidth = 1;

      nodesRef.current.forEach((node, i) => {
        // Conectar ao próximo nó
        const nextNode = nodesRef.current[(i + 1) % nodesRef.current.length];
        const distance = Math.hypot(nextNode.x - node.x, nextNode.y - node.y);

        if (distance < 300) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(nextNode.x, nextNode.y);
          ctx.stroke();
        }
      });

      // Desenhar nós
      nodesRef.current.forEach((node) => {
        // Glow background
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 3);
        gradient.addColorStop(0, `rgba(79, 70, 229, 0.3)`);
        gradient.addColorStop(1, `rgba(79, 70, 229, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Nó principal
        ctx.fillStyle = '#4F46E5';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // Borda
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-40"
      style={{ pointerEvents: 'none' }}
    />
  );
}

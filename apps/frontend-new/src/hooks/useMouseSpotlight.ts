import { useEffect, useRef } from 'react';

interface SpotlightPosition {
  x: number;
  y: number;
}

export function useMouseSpotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<SpotlightPosition>({ x: 0, y: 0 });
  const targetRef = useRef<SpotlightPosition>({ x: 0, y: 0 });

  useEffect(() => {
    // Detectar preferência de reduzir movimento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Detectar mobile
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const animateSpotlight = () => {
      // Interpolação suave do movimento (easing)
      positionRef.current.x += (targetRef.current.x - positionRef.current.x) * 0.1;
      positionRef.current.y += (targetRef.current.y - positionRef.current.y) * 0.1;

      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty(
          '--spotlight-x',
          `${positionRef.current.x}px`
        );
        spotlightRef.current.style.setProperty(
          '--spotlight-y',
          `${positionRef.current.y}px`
        );
      }

      requestAnimationFrame(animateSpotlight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animationFrame = requestAnimationFrame(animateSpotlight);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return spotlightRef;
}

import { useEffect, useRef } from 'react';

const MouseGlow = () => {
  const glowRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarsePointer) return;

    const handleMove = (event) => {
      if (!glowRef.current) return;
      glowRef.current.style.transform = `translate(${event.clientX - 140}px, ${event.clientY - 140}px)`;
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return <div ref={glowRef} className="mouse-glow" aria-hidden="true" />;
};

export default MouseGlow;

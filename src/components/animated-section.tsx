'use client';

import { motion, useAnimation, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fade-in' | 'slide-in-left' | 'slide-in-right' | 'slide-in-up' | 'slide-in-down' | 'scale-up';
  className?: string;
  delay?: number;
  duration?: number;
}

export function AnimatedSection({
  children,
  animation = 'fade-in',
  className,
  delay = 0,
  duration = 0.5,
}: AnimatedSectionProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: animation === 'slide-in-left' ? -100 : animation === 'slide-in-right' ? 100 : 0,
      y: animation === 'slide-in-up' ? 100 : animation === 'slide-in-down' ? -100 : 0,
      scale: animation === 'scale-up' ? 0.8 : 1,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        delay,
        duration,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

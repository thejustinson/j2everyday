"use client";

import { motion, useReducedMotion } from "motion/react";
import React from "react";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  /** Optional delay in milliseconds before the transition begins */
  delay?: number;
  /** Direction to slide from */
  direction?: "up" | "down" | "left" | "right" | "none";
}

/**
 * Framer Motion scroll-reveal wrapper.
 * Smoothly animates children into view as they scroll into the viewport.
 * Automatically respects user's prefers-reduced-motion setting.
 */
export default function FadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  const getInitialPosition = () => {
    if (shouldReduceMotion || direction === "none") return { x: 0, y: 0 };
    switch (direction) {
      case "up":
        return { x: 0, y: 24 };
      case "down":
        return { x: 0, y: -24 };
      case "left":
        return { x: 24, y: 0 };
      case "right":
        return { x: -24, y: 0 };
      default:
        return { x: 0, y: 24 };
    }
  };

  const initial = {
    opacity: 0,
    ...getInitialPosition(),
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: shouldReduceMotion ? 0.3 : 0.7,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

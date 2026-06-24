"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import * as React from "react";

const ease = [0.16, 1, 0.3, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease } },
};

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  variant?: "fadeUp" | "fade";
  once?: boolean;
}

export function Reveal({
  children,
  delay = 0,
  variant = "fadeUp",
  once = true,
  className,
  ...props
}: RevealProps) {
  const v = variant === "fade" ? fade : fadeUp;
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={v}
      transition={{ duration: 0.8, ease, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  delayChildren = 0.1,
  staggerChildren = 0.08,
  className,
}: {
  children: React.ReactNode;
  delayChildren?: number;
  staggerChildren?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { delayChildren, staggerChildren } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

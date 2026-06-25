"use client";

import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-ai-blue via-brain-purple to-ai-blue origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";


export function Hero() {
  return (
    <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center overflow-hidden border-b border-black/5 dark:border-foreground/5">
      {/* Stripe-style Animated Pastel Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center pointer-events-none">
        <div className="relative w-full max-w-2xl">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob dark:bg-blue-900/40 dark:mix-blend-screen" />
          <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-2000 dark:bg-purple-900/40 dark:mix-blend-screen" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-4000 dark:bg-pink-900/40 dark:mix-blend-screen" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 text-center px-4"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8 flex flex-col items-center gap-3"
        >
          <Link href="/blog/building-brain-planet" className="group relative inline-flex items-center justify-center px-5 py-2 rounded-full border border-black/10 dark:border-foreground/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-sm text-sm font-medium tracking-wide text-foreground transition-all hover:scale-105 hover:bg-white/80 dark:hover:bg-black/60 gap-3 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-blob" />
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <span className="relative z-10 font-semibold">✨ Just Launched: Brain Planet</span>
            <span className="relative z-10 text-foreground/50 mx-[-4px] hidden sm:block">•</span>
            <span className="relative z-10 text-foreground/70 hidden sm:block">The Next-Gen Interactive Kids&apos; AI</span>
            <svg viewBox="0 0 24 24" className="relative z-10 w-4 h-4 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </motion.div>

        <h1 className="text-6xl md:text-[7.5rem] font-extrabold tracking-tighter mb-6 text-slate-900 dark:text-white drop-shadow-sm leading-none">
          Aimake
        </h1>

        <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-10 max-w-2xl mx-auto font-medium tracking-tight leading-relaxed">
          Architecting Real-time Voice Agents and WebRTC Infrastructure. <br className="hidden md:block" />
          The digital laboratory and open-source arsenal of Chico.
        </p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/arsenal" className="px-6 py-3 rounded-xl bg-foreground text-background font-medium shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-transform duration-200">
            Explore Open Source Arsenal
          </Link>
          <Link href="/blog" className="px-6 py-3 rounded-xl border border-black/10 dark:border-foreground/10 hover:bg-black/5 dark:hover:bg-foreground/5 font-medium transition-colors duration-200">
            Read Devlog
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

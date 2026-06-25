"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles, PenTool, LayoutGrid, Brain, BrainCircuit, Mic, Cpu } from "lucide-react";

const projects = [
  {
    id: "brain-planet",
    title: "脑力星球 (Brain Planet)",
    desc: "A completely ad-free, AI-powered interactive digital playground designed purely for kids. Safe, educational, and fun.",
    link: "https://kids.aimake.cc",
    icon: <Brain className="w-6 h-6 text-brain-purple" />,
    badge: "Consumer",
    color: "group-hover:border-brain-purple/50",
  },
  {
    id: "html-tools",
    title: "WebUtils (1086+ Tools)",
    desc: "An absolutely massive collection of 1086+ purely frontend developer tools. Zero build, offline capable, privacy first.",
    link: "https://tools.realtime-ai.chat",
    icon: <LayoutGrid className="w-6 h-6 text-geek-green" />,
    badge: "TypeScript",
    color: "group-hover:border-geek-green/50",
  },
  {
    id: "a2a-multiagent-server",
    title: "A2A Multi-Agent Router",
    desc: "High-performance Agent-to-Agent routing server built in Go with TRPC.",
    link: "https://github.com/chicogong/a2a-multiagent-server",
    icon: <BrainCircuit className="w-6 h-6 text-ai-blue" />,
    badge: "Go",
    color: "group-hover:border-ai-blue/50",
  },
  {
    id: "stream-relay-go",
    title: "Stream Relay Go",
    desc: "Backend audio/video streaming relay server built in Golang. High throughput, low latency.",
    link: "https://github.com/chicogong/stream-relay-go",
    icon: <Cpu className="w-6 h-6 text-geek-green" />,
    badge: "Go",
    color: "group-hover:border-geek-green/50",
  },
  {
    id: "ffvoice-engine",
    title: "FFVoice Engine",
    desc: "High performance, highly concurrent voice generation and processing engine.",
    link: "https://github.com/chicogong/ffvoice-engine",
    icon: <Sparkles className="w-6 h-6 text-pink-500" />,
    badge: "Rust / C++",
    color: "group-hover:border-pink-500/50",
  },
  {
    id: "trtc-ai-build-quickly",
    title: "TRTC AI Framework",
    desc: "Quickly build real-time AI voice conversation apps with multi-agent selection and LLM integration.",
    link: "https://github.com/chicogong/trtc-ai-build-quickly",
    icon: <Mic className="w-6 h-6 text-ai-blue" />,
    badge: "WebRTC",
    color: "group-hover:border-ai-blue/50",
  },
  {
    id: "flowtts",
    title: "FlowTTS",
    desc: "Core highly-concurrent Text-to-Speech synthesis engine designed for low-latency streaming.",
    link: "https://github.com/chicogong/FlowTTS",
    icon: <PenTool className="w-6 h-6 text-orange-500" />,
    badge: "Python",
    color: "group-hover:border-orange-500/50",
  }
];

export function ProjectGrid() {
  const categories = ["All", ...Array.from(new Set(projects.map(p => p.badge)))];
  const [activeTab, setActiveTab] = useState("All");

  const filteredProjects = projects.filter(
    (project) => activeTab === "All" || project.badge === activeTab
  );

  return (
    <section id="projects" className="w-full max-w-7xl mx-auto px-4 py-24">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">The Matrix</h2>
        <p className="text-foreground/60 max-w-2xl text-lg">
          A collection of standalone products, open-source arsenals, and deep tech insights. Built with passion and code.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === cat
                ? "bg-foreground text-background shadow-md scale-105"
                : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground hover:scale-105"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.a
              layout
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`group relative flex flex-col p-8 rounded-3xl glass glass-hover transition-all duration-300 ${project.color}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-foreground/5 text-foreground">
                  {project.icon}
                </div>
                <ArrowUpRight className="w-5 h-5 text-foreground/30 group-hover:text-foreground transition-colors" />
              </div>
              
              <div className="mt-auto">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-foreground/10 text-foreground/70">
                    {project.badge}
                  </span>
                </div>
                <p className="text-foreground/60 text-sm leading-relaxed">
                  {project.desc}
                </p>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

import Link from "next/link";
import { MouseGlow } from "@/components/MouseGlow";
import { Cpu, Terminal, Mic, BrainCircuit } from "lucide-react";

export const metadata = {
  title: "Arsenal | Aimake",
  description: "The Open Source Arsenal. A collection of underlying Voice AI and WebRTC infrastructure built by Chico.",
};

const categories = [
  {
    title: "Voice & TTS Engines",
    icon: <Mic className="w-5 h-5 text-pink-500" />,
    projects: [
      { name: "FlowTTS", desc: "Core highly-concurrent Text-to-Speech synthesis engine.", link: "https://github.com/chicogong/FlowTTS" },
      { name: "ffvoice-engine", desc: "High performance voice generation and processing engine.", link: "https://github.com/chicogong/ffvoice-engine" },
      { name: "trtc-ai-tts", desc: "TRTC-AI Service TTS Demo Experience.", link: "https://github.com/chicogong/trtc-ai-tts" },
      { name: "cosyvoice-lite", desc: "A simplified, production-ready async TTS interface for CosyVoice.", link: "https://github.com/chicogong/cosyvoice-lite" },
    ]
  },
  {
    title: "Realtime Multi-Agent Systems",
    icon: <BrainCircuit className="w-5 h-5 text-ai-blue" />,
    projects: [
      { name: "a2a-multiagent-server", desc: "High-performance Agent-to-Agent router in Go with TRPC.", link: "https://github.com/chicogong/a2a-multiagent-server" },
      { name: "conversational-ai-agent", desc: "LLM-driven conversational logic core.", link: "https://github.com/chicogong/conversational-ai-agent" },
      { name: "trtc-ai-build-quickly", desc: "Quickly build real-time AI voice conversation apps with TRTC.", link: "https://github.com/chicogong/trtc-ai-build-quickly" },
    ]
  },
  {
    title: "WebRTC & Network Infra",
    icon: <Cpu className="w-5 h-5 text-geek-green" />,
    projects: [
      { name: "stream-relay-go", desc: "Backend audio/video streaming relay server in Golang.", link: "https://github.com/chicogong/stream-relay-go" },
      { name: "trtc-ai-app", desc: "Voice AI app based on trtc-ai.", link: "https://github.com/chicogong/trtc-ai-app" },
      { name: "sim-demo", desc: "Simultaneous interpretation by TRTC-AI.", link: "https://github.com/chicogong/sim-demo" }
    ]
  },
  {
    title: "Scheduling & Utilities",
    icon: <Terminal className="w-5 h-5 text-orange-500" />,
    projects: [
      { name: "dgpu-scheduler", desc: "Distributed GPU resource scheduler for heavy model inference.", link: "https://github.com/chicogong/dgpu-scheduler" },
      { name: "dtask-scheduler", desc: "Distributed task orchestration system.", link: "https://github.com/chicogong/dtask-scheduler" },
      { name: "html-tools", desc: "WebUtils: A massive offline-capable collection of 1086+ frontend tools.", link: "https://github.com/chicogong/html-tools" },
      { name: "cc-console", desc: "Console interface for Claude Code.", link: "https://github.com/chicogong/cc-console" },
    ]
  }
];

export default function Arsenal() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden pt-32 pb-20 px-6">
      <MouseGlow />
      <div className="max-w-5xl mx-auto w-full z-10">
        <Link href="/" className="text-ai-blue hover:text-ai-blue/80 mb-8 inline-block font-medium transition-colors">
          &larr; Back to Home
        </Link>
        
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">The Arsenal</h1>
          <p className="text-foreground/60 text-lg md:text-xl max-w-3xl leading-relaxed">
            A comprehensive inventory of the underlying infrastructure, AI models, and WebRTC systems powering the Aimake ecosystem. Over 60+ repositories distilled into core categories.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="glass p-8 rounded-3xl border border-foreground/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                {cat.icon}
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-foreground/5">
                  {cat.icon}
                </div>
                <h2 className="text-2xl font-bold tracking-tight">{cat.title}</h2>
              </div>
              
              <ul className="space-y-4">
                {cat.projects.map((proj, pIdx) => (
                  <li key={pIdx} className="border-l-2 border-foreground/10 pl-4 hover:border-ai-blue transition-colors">
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="block group/link">
                      <h3 className="text-lg font-semibold text-foreground/90 group-hover/link:text-ai-blue transition-colors">{proj.name} ↗</h3>
                      <p className="text-foreground/60 text-sm leading-relaxed mt-1">{proj.desc}</p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

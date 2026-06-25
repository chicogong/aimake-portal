"use client";

import { motion } from "framer-motion";
import { Terminal, Cpu, Globe } from "lucide-react";

export function About() {
  return (
    <section id="about" className="w-full max-w-7xl mx-auto px-4 py-24 border-t border-foreground/5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">关于 Chico</h2>
          <p className="text-foreground/70 text-lg leading-relaxed mb-6">
            我是一名前端出身的 AI 产品工程师 (AI Product Engineer)，现就职于腾讯，专注于 Realtime AI 领域的开发。我致力于构建实时语音对话与下一代 AI 交互系统。
          </p>
          <p className="text-foreground/70 text-lg leading-relaxed mb-8">
            <b>Aimake</b> 是我的独立数字实验室。在这里，我不追求虚无的流量，而是通过一行行代码，将最前沿的技术（WebRTC, LLMs, Voice Agents）转化为能解决真实问题的优雅产品，涵盖从高保真商业配音工具到纯净无广的儿童数字游乐园。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl glass text-ai-blue">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="font-medium tracking-wide">全栈 AI 构建</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl glass text-brain-purple">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-medium tracking-wide">实时语音引擎</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl glass text-geek-green">
                <Globe className="w-5 h-5" />
              </div>
              <span className="font-medium tracking-wide">独立产品开发</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden glass p-8 flex flex-col justify-end"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-ai-blue/10 via-background to-brain-purple/10" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4 tracking-tight">硬核技术栈</h3>
            <div className="flex flex-wrap gap-2.5">
              {['TypeScript', 'Go', 'Python', 'WebRTC', 'Next.js', 'LLMs/Agentic', 'Speech Synthesis', 'Low-latency Streaming', 'MySQL/ES', 'CI/CD'].map(item => (
                <span 
                  key={item}
                  className="px-4 py-2 rounded-lg bg-foreground/5 border border-foreground/10 text-sm font-medium hover:bg-ai-blue/10 hover:border-ai-blue/30 hover:shadow-[0_0_15px_rgba(29,78,216,0.3)] hover:-translate-y-1 transition-all duration-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

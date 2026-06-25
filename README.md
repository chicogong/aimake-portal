<div align="center">
  
  # 🪐 Aimake Portal
  
  **The digital laboratory and open-source arsenal of Chico.**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

  [View Live Site](https://aimake.cc) · [Report Bug](https://github.com/chicogong/aimake-portal/issues) · [Arsenal](https://aimake.cc/arsenal)
</div>

<br />

## ⚡ Overview

**Aimake Portal** is the personal portfolio, engineering blog, and open-source inventory of Chico. It is meticulously crafted to be a high-performance, SEO-optimized, and visually striking digital business card.

It completely distances itself from traditional, bloated portfolio templates, favoring a highly dynamic, "Vercel/Linear" aesthetic that highlights hardcore engineering work—from Realtime Voice AI and Agentic Frameworks to WebRTC infrastructures.

## ✨ Features

- **Linear-style Premium Aesthetic**: Deep dark mode, subtle glassmorphism, animated stripe blobs, and fluid typography.
- **Dynamic Arsenal Directory**: A structured grid showcasing 60+ open-source infrastructure projects and tools.
- **Interactive Tech-Stack Matrix**: Framer-motion powered category filtering (e.g., Go, Rust, WebRTC, TypeScript).
- **Markdown-driven Devlog**: Fully local, highly performant tech blog powered by `react-markdown` and `gray-matter`.
- **Automatic SEO Engine**: Dynamically generated sitemap (`sitemap.ts`), comprehensive OpenGraph tags, and JSON-LD structured data.
- **Edge Optimized**: Built on Next.js 15 with Turbopack, fully optimized for Vercel Edge deployments.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Content Parsing**: `gray-matter` & `react-markdown`
- **Analytics**: Vercel Analytics & Speed Insights

## 🚀 Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 Writing Devlogs

The blog is statically generated using local Markdown files. To publish a new post, simply create a `.md` file inside the `content/blog` directory:

```markdown
---
title: "Building Realtime AI Agents"
date: "2026-06-25"
description: "Deep dive into WebRTC and LLM low-latency streaming."
---

Your content goes here...
```

The site will automatically parse the frontmatter, render the markdown, and update the sitemap for SEO.

## 🔗 Links

- **Main Site**: [https://aimake.cc](https://aimake.cc)
- **Twitter / X**: [@chicogong](https://x.com/chicogong)
- **GitHub**: [@chicogong](https://github.com/chicogong)

---

<div align="center">
  <i>Built with passion by Chico.</i>
</div>

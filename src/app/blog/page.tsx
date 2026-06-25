import Link from "next/link";
import { getSortedPostsData } from "@/lib/posts";
import { MouseGlow } from "@/components/MouseGlow";

export const metadata = {
  title: "Devlog | Aimake",
  description: "Thoughts, devlogs, and Indie Hacker journeys by Chico.",
};

export default function Blog() {
  const posts = getSortedPostsData();

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden pt-24 pb-20 px-4">
      <MouseGlow />
      <div className="max-w-4xl mx-auto w-full z-10">
        <Link href="/" className="text-ai-blue hover:text-ai-blue/80 mb-8 inline-block font-medium transition-colors">
          &larr; Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Devlog</h1>
        <p className="text-foreground/60 text-lg mb-12">Building in public. Thoughts on AI, Engineering, and Indie Hacking.</p>
        
        <div className="flex flex-col gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="p-6 rounded-2xl glass hover:glass-hover transition-all duration-300 border border-foreground/5 hover:border-ai-blue/30">
                <h2 className="text-2xl font-semibold mb-2 group-hover:text-ai-blue transition-colors">{post.title}</h2>
                <div className="text-sm font-mono text-ai-blue/70 mb-4">{post.date}</div>
                <p className="text-foreground/70 leading-relaxed">{post.description}</p>
              </article>
            </Link>
          ))}
          {posts.length === 0 && (
            <p className="text-foreground/50">No posts yet. Check back soon!</p>
          )}
        </div>
      </div>
    </main>
  );
}

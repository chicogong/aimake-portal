import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostData, getSortedPostsData } from "@/lib/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MouseGlow } from "@/components/MouseGlow";

// This allows Next.js to statically generate all blog posts at build time
export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = getPostData(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Aimake`,
    description: post.description,
  };
}

export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = getPostData(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden pt-24 pb-20 px-4">
      <MouseGlow />
      <div className="max-w-3xl mx-auto w-full z-10">
        <Link href="/blog" className="text-ai-blue hover:text-ai-blue/80 mb-8 inline-block font-medium transition-colors">
          &larr; Back to Devlog
        </Link>
        <article className="prose dark:prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground/80 prose-li:text-foreground/80 prose-strong:text-foreground prose-a:text-ai-blue hover:prose-a:text-ai-blue/80 prose-img:rounded-xl">
          <header className="mb-12 not-prose border-b border-black/10 dark:border-foreground/10 pb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">{post.title}</h1>
            <div className="text-ai-blue/70 font-mono">{post.date}</div>
          </header>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}

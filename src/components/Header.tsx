import Link from "next/link";

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-40 px-6 py-6 flex items-center justify-between pointer-events-none max-w-7xl mx-auto">
      <Link href="/" aria-label="Home" className="pointer-events-auto flex items-center gap-3 group">
        <div className="w-8 h-8 bg-foreground flex items-center justify-center transition-transform group-hover:scale-105">
          <div className="w-3 h-3 bg-background" />
        </div>
        <span className="font-bold text-xl tracking-tight hidden sm:block text-foreground/90 group-hover:text-foreground transition-colors">Aimake</span>
      </Link>
      
      <nav className="pointer-events-auto flex items-center gap-6 text-sm font-medium">
        <Link href="/arsenal" className="text-foreground/60 hover:text-foreground transition-colors">Arsenal</Link>
        <Link href="/blog" className="text-foreground/60 hover:text-foreground transition-colors">Devlog</Link>
      </nav>
    </header>
  );
}

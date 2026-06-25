export function Footer() {
  return (
    <footer className="w-full border-t border-foreground/5 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h4 className="font-semibold tracking-tight text-lg mb-1">Aimake</h4>
          <p className="text-foreground/40 text-sm">© {new Date().getFullYear()} Chico. All rights reserved.</p>
        </div>
        
        <div className="flex gap-6 text-sm font-medium text-foreground/60">
          <a href="https://github.com/chicogong" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            GitHub
          </a>
          <a href="https://x.com/chicogong" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            X (Twitter)
          </a>
          <a href="https://realtime-ai.chat" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            Tech Blog
          </a>
        </div>
      </div>
    </footer>
  );
}

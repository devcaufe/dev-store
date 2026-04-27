import { Link } from "wouter";
import { SiDiscord } from "react-icons/si";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/30">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-mono text-xs font-bold leading-none">DC</span>
            </div>
            DevCaufe
          </Link>
          <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Início
            </Link>
            <Link href="/solicitar" className="text-muted-foreground hover:text-primary transition-colors">
              Solicitar Projeto
            </Link>
            <Link href="/suporte" className="text-muted-foreground hover:text-primary transition-colors">
              Suporte
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-8 mt-12">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
          <p className="font-semibold text-foreground">Cauã Felipe Santanna</p>
          <p className="text-sm mt-1">Aracaju, Brasil</p>
          <p className="text-xs mt-4 opacity-60">
            &copy; {new Date().getFullYear()} DevCaufe Soluções Digitais. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Floating Discord Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://discord.gg/devcaufe"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-14 h-14 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-[0_0_20px_rgba(88,101,242,0.4)] transition-all hover:scale-110 hover:shadow-[0_0_30px_rgba(88,101,242,0.6)]"
            >
              <SiDiscord className="w-7 h-7" />
            </a>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-popover text-popover-foreground border-border font-medium">
            <p>Entre na nossa comunidade</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

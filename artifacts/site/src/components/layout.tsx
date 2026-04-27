import { Link, useLocation } from "wouter";
import { SiDiscord } from "react-icons/si";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BrazilFlag } from "@/components/brazil-flag";

const LOGO_URL = `${import.meta.env.BASE_URL}logo.png`;

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItem = (href: string, label: string) => {
    const active = location === href;
    return (
      <Link
        href={href}
        className={
          "text-sm font-medium transition-colors " +
          (active ? "text-primary" : "text-slate-600 hover:text-primary")
        }
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      {/* Top trust bar */}
      <div className="bg-slate-900 text-white text-xs py-2">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-center gap-2 text-center">
          <BrazilFlag className="w-4 h-3 inline-block shrink-0" />
          <span>
            Engenharia de software profissional &middot; pagamento seguro via PIX &middot; entrega no prazo
          </span>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-white/85 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-2.5">
            <img
              src={LOGO_URL}
              alt="Dev Store BR"
              className="w-9 h-9 rounded-lg object-cover shadow-sm bg-slate-900"
            />
            <span className="flex items-center gap-2">
              Dev Store BR
              <BrazilFlag className="w-5 h-3.5" />
            </span>
          </Link>
          <nav className="hidden md:flex gap-7 items-center">
            {navItem("/", "Início")}
            {navItem("/como-funciona", "Como Funciona")}
            {navItem("/solicitar", "Solicitar Projeto")}
            {navItem("/suporte", "Suporte")}
          </nav>
          <Link
            href="/solicitar"
            className="hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors"
          >
            Começar agora
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-slate-50 mt-12">
        <div className="container mx-auto px-4 md:px-6 py-12 grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src={LOGO_URL} alt="Dev Store BR" className="w-7 h-7 rounded-md object-cover bg-slate-900" />
              <span className="font-bold text-slate-900">Dev Store BR</span>
              <BrazilFlag className="w-4 h-3" />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Soluções digitais sob medida: sites, bots e arquitetura de
              software com qualidade profissional.
            </p>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-slate-900 mb-3">Navegação</p>
            <ul className="space-y-2">
              <li><Link href="/" className="text-muted-foreground hover:text-primary">Início</Link></li>
              <li><Link href="/solicitar" className="text-muted-foreground hover:text-primary">Solicitar Projeto</Link></li>
              <li><Link href="/suporte" className="text-muted-foreground hover:text-primary">Suporte &amp; FAQ</Link></li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-slate-900 mb-3">Pagamento</p>
            <p className="text-muted-foreground">
              PIX processado com segurança via Mercado Pago. Confirmação automática em segundos.
            </p>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="container mx-auto px-4 md:px-6 py-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>&copy; {new Date().getFullYear()} Dev Store BR. Todos os direitos reservados.</p>
            <p className="flex items-center gap-2">Feito no Brasil <BrazilFlag className="w-4 h-3" /></p>
          </div>
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
              className="flex items-center justify-center w-14 h-14 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg transition-all hover:scale-110"
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

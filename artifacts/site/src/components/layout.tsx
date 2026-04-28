import { useState } from "react";
import { Link, useLocation } from "wouter";
import { SiDiscord } from "react-icons/si";
import {
  TerminalSquare,
  Code2,
  Database,
  Cpu,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BrazilFlag } from "@/components/brazil-flag";

const LOGO_URL = `${import.meta.env.BASE_URL}logo.png`;

const serviceCategories = [
  {
    icon: TerminalSquare,
    title: "Sites & Aplicações Web",
    desc: "Dashboards, painéis, landing pages e sistemas sob medida.",
    href: "/solicitar?categoria=website",
  },
  {
    icon: Code2,
    title: "Bots de Discord",
    desc: "Moderação, economia, integrações e painéis web próprios.",
    href: "/solicitar?categoria=discord_bot",
  },
  {
    icon: Database,
    title: "Repositórios & Arquitetura",
    desc: "Estrutura de código, CI/CD, banco de dados e backend.",
    href: "/solicitar?categoria=repository",
  },
  {
    icon: Cpu,
    title: "Melhorias em Sistemas",
    desc: "Refatoração, performance, correção de bugs e novas features.",
    href: "/solicitar?categoria=improvement",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const navLink = (href: string, label: string) => {
    const active = location === href;
    return (
      <Link
        href={href}
        className={
          "relative text-sm font-medium px-2 py-1.5 transition-colors " +
          (active
            ? "text-primary"
            : "text-slate-700 hover:text-primary")
        }
      >
        {label}
        {active && (
          <span className="absolute left-2 right-2 -bottom-[19px] h-[2px] bg-primary rounded-full" />
        )}
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
            Engenharia de software profissional &middot; pagamento seguro via
            PIX &middot; entrega no prazo
          </span>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-2.5 shrink-0"
          >
            <img
              src={LOGO_URL}
              alt="Dev Store BR"
              className="w-9 h-9 rounded-lg object-cover shadow-sm bg-slate-900"
            />
            <span className="hidden sm:flex items-center gap-2">
              Dev Store BR
              <BrazilFlag className="w-5 h-3.5" />
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLink("/", "Início")}

            {/* Serviços dropdown */}
            <Popover open={servicesOpen} onOpenChange={setServicesOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={
                    "inline-flex items-center gap-1 text-sm font-medium px-2 py-1.5 transition-colors " +
                    (servicesOpen
                      ? "text-primary"
                      : "text-slate-700 hover:text-primary")
                  }
                  data-testid="nav-services-trigger"
                >
                  Serviços
                  <ChevronDown
                    className={
                      "w-3.5 h-3.5 transition-transform " +
                      (servicesOpen ? "rotate-180" : "")
                    }
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={14}
                className="w-[480px] p-3 border-border shadow-xl"
              >
                <div className="grid grid-cols-2 gap-1.5">
                  {serviceCategories.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setServicesOpen(false)}
                      className="group flex items-start gap-3 p-3 rounded-md hover:bg-blue-50/60 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-md bg-blue-50 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                        <c.icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 leading-tight">
                          {c.title}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                          {c.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-2 pt-3 border-t border-border">
                  <Link
                    href="/solicitar"
                    onClick={() => setServicesOpen(false)}
                    className="block text-center text-xs font-semibold text-primary hover:underline py-1"
                  >
                    Ver todos os serviços e solicitar →
                  </Link>
                </div>
              </PopoverContent>
            </Popover>

            {navLink("/como-funciona", "Como Funciona")}
            {navLink("/suporte", "Suporte")}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/solicitar"
              className="hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 transition-colors"
            >
              Começar agora
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Abrir menu"
              data-testid="nav-mobile-toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-white">
            <div className="container mx-auto px-4 py-4 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Início
              </Link>
              <Link
                href="/como-funciona"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Como Funciona
              </Link>
              <Link
                href="/suporte"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Suporte
              </Link>

              <p className="px-3 pt-4 pb-1 text-xs font-bold text-slate-500 uppercase tracking-wide">
                Serviços
              </p>
              {serviceCategories.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-md hover:bg-blue-50/60 transition-colors"
                >
                  <div className="w-8 h-8 rounded-md bg-blue-50 text-primary flex items-center justify-center shrink-0">
                    <c.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {c.title}
                    </p>
                  </div>
                </Link>
              ))}

              <div className="pt-3">
                <Link
                  href="/solicitar"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center bg-primary text-primary-foreground font-semibold py-2.5 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Começar agora
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-slate-50 mt-12">
        <div className="container mx-auto px-4 md:px-6 py-12 grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img
                src={LOGO_URL}
                alt="Dev Store BR"
                className="w-7 h-7 rounded-md object-cover bg-slate-900"
              />
              <span className="font-bold text-slate-900">Dev Store BR</span>
              <BrazilFlag className="w-4 h-3" />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Soluções digitais sob medida: sites, bots e arquitetura de
              software com qualidade profissional.
            </p>
          </div>

          <div className="text-sm">
            <p className="font-semibold text-slate-900 mb-3">Serviços</p>
            <ul className="space-y-2">
              {serviceCategories.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-sm">
            <p className="font-semibold text-slate-900 mb-3">Navegação</p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/como-funciona"
                  className="text-muted-foreground hover:text-primary"
                >
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link
                  href="/solicitar"
                  className="text-muted-foreground hover:text-primary"
                >
                  Solicitar Projeto
                </Link>
              </li>
              <li>
                <Link
                  href="/suporte"
                  className="text-muted-foreground hover:text-primary"
                >
                  Suporte &amp; FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <p className="font-semibold text-slate-900 mb-3">Pagamento</p>
            <p className="text-muted-foreground">
              PIX e cartão processados com segurança via Mercado Pago.
              Confirmação automática em segundos.
            </p>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="container mx-auto px-4 md:px-6 py-4 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              &copy; {new Date().getFullYear()} Dev Store BR. Todos os direitos
              reservados.
            </p>
            <p className="flex items-center gap-2">
              Feito no Brasil <BrazilFlag className="w-4 h-3" />
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Discord Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://discord.gg/hzvyJECrA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-14 h-14 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-lg transition-all hover:scale-110"
            >
              <SiDiscord className="w-7 h-7" />
            </a>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className="bg-popover text-popover-foreground border-border font-medium"
          >
            <p>Entre na nossa comunidade</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Code2,
  TerminalSquare,
  Database,
  Cpu,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Layers,
  Star,
  Clock,
  Lock,
  RefreshCcw,
  Sparkles,
  ChevronDown,
  CreditCard,
  QrCode,
} from "lucide-react";
import { BrazilFlag } from "@/components/brazil-flag";

export function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative pt-20 pb-28 overflow-hidden border-b border-border bg-gradient-to-b from-blue-50/60 via-white to-white">
        <div className="absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_25%_15%,rgba(37,99,235,0.10),transparent_45%),radial-gradient(circle_at_85%_0%,rgba(15,23,42,0.05),transparent_45%)]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 -z-10 opacity-[0.04] [background-image:linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

        <div className="container relative mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              variant="outline"
              className="mb-6 bg-white text-primary border-blue-200 px-4 py-1.5 inline-flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-500"
            >
              <Sparkles className="w-3.5 h-3.5" /> Vagas abertas para abril/maio
            </Badge>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.05] animate-in fade-in slide-in-from-bottom-3 duration-700">
              Software profissional, <br className="hidden md:block" />
              entregue do jeito certo.
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in duration-700 delay-150 fill-mode-both">
              Sites complexos, bots de Discord, repositórios e melhorias de
              sistemas. Desenvolvimento sério, com prazo, garantia e
              pagamento seguro via PIX ou cartão.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10 animate-in fade-in zoom-in-95 duration-700 delay-200 fill-mode-both">
              <Link href="/solicitar">
                <Button
                  size="lg"
                  className="h-12 px-7 text-base font-semibold shadow-md shadow-blue-600/20"
                  data-testid="button-hero-cta"
                >
                  Solicitar meu projeto <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/como-funciona">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-7 text-base font-semibold border-slate-300 text-slate-900 hover:bg-slate-50"
                  data-testid="button-hero-how"
                >
                  Ver como funciona
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> PIX e cartão</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Confirmação automática</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Garantia de entrega</span>
              <span className="inline-flex items-center gap-2"><BrazilFlag className="w-4 h-3" /> Feito no Brasil</span>
            </div>

            {/* Scroll cue */}
            <a
              href="#stats"
              className="mt-16 inline-flex flex-col items-center gap-1 text-xs text-slate-500 hover:text-primary transition-colors"
              aria-label="Rolar para baixo"
            >
              <span>Veja mais</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section id="stats" className="border-b border-border bg-white">
        <div className="container mx-auto px-4 md:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-slate-50/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="bg-white text-primary border-blue-200 mb-4">Especialidades</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              O que entregamos para você
            </h2>
            <p className="text-slate-600 text-lg">
              Cada projeto é construído sob medida, com código limpo, documentação e
              garantia de funcionamento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s, i) => (
              <Card
                key={i}
                className="bg-white border-border hover:border-primary/40 hover:shadow-lg hover:shadow-blue-600/5 hover:-translate-y-0.5 transition-all duration-200"
                data-testid={`card-service-${i}`}
              >
                <CardContent className="p-6 flex flex-col">
                  <div className="w-11 h-11 rounded-lg bg-blue-50 text-primary flex items-center justify-center mb-5">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 flex-1">
                    {s.description}
                  </p>
                  <p className="text-xs font-semibold text-primary">A partir de {s.from}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/solicitar">
              <Button size="lg" variant="outline" className="border-slate-300 text-slate-900 hover:bg-white">
                Calcular meu valor agora <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process teaser */}
      <section className="py-24 bg-white border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="bg-blue-50 text-primary border-blue-200 mb-4">Processo simples</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Do briefing ao deploy em 3 passos
            </h2>
            <p className="text-slate-600 text-lg">
              Sem reuniões intermináveis. Você descreve, paga via PIX ou cartão, e nós entregamos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {processSteps.map((p, i) => (
              <div key={i} className="relative bg-slate-50/60 border border-border rounded-xl p-6 hover:border-primary/40 transition-colors">
                <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-md">
                  {i + 1}
                </span>
                <p.icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">{p.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/como-funciona">
              <Button variant="ghost" className="text-primary font-semibold">
                Quero entender em detalhes <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Payment methods strip */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50/30 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Pague do jeito que preferir
            </h2>
            <p className="text-slate-600">
              Tudo processado pelo Mercado Pago, com confirmação automática.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-5 bg-white border border-border rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">PIX</p>
                <p className="text-sm text-slate-600">QR Code instantâneo, confirmação em segundos.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 bg-white border border-border rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Cartão de Crédito</p>
                <p className="text-sm text-slate-600">Até 12x no checkout seguro do Mercado Pago.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-20 bg-slate-50/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-5">
            {guarantees.map((g, i) => (
              <div key={i} className="flex items-start gap-3 p-5 bg-white border border-border rounded-lg hover:border-primary/40 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-md bg-blue-50 text-primary flex items-center justify-center shrink-0">
                  <g.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{g.title}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="bg-blue-50 text-primary border-blue-200 mb-4">Depoimentos</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              O que clientes dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="bg-white border-border hover:border-primary/40 hover:shadow-lg hover:shadow-blue-600/5 transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-4 text-amber-400">
                    {Array.from({ length: 5 }).map((_, n) => (
                      <Star key={n} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-5 text-[15px]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      loading="lazy"
                      className="w-10 h-10 rounded-full object-cover bg-slate-100"
                    />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.25),transparent_60%)]" />
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-5 tracking-tight">
            Pronto para tirar seu projeto do papel?
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Descreva o que você precisa. O valor é calculado automaticamente e você recebe um link de pagamento seguro em segundos.
          </p>
          <Link href="/solicitar">
            <Button
              size="lg"
              className="h-14 px-10 text-base font-semibold bg-primary hover:bg-blue-500 text-white shadow-xl shadow-blue-500/30"
              data-testid="button-final-cta"
            >
              Iniciar projeto agora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-xs text-slate-400 mt-6 inline-flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" /> Pagamento seguro &middot; Mercado Pago
          </p>
        </div>
      </section>
    </div>
  );
}

const stats = [
  { value: "+50", label: "Projetos entregues" },
  { value: "98%", label: "Clientes satisfeitos" },
  { value: "24h", label: "Resposta média" },
  { value: "100%", label: "Pagamento seguro" },
];

const services = [
  {
    title: "Sites Complexos",
    icon: TerminalSquare,
    description: "Aplicações web, dashboards, painéis administrativos e landing pages de alta conversão.",
    from: "R$ 800",
  },
  {
    title: "Bots de Discord",
    icon: Code2,
    description: "Bots com economia, moderação avançada, integração de APIs e painéis web de controle.",
    from: "R$ 350",
  },
  {
    title: "Arquitetura & Repos",
    icon: Database,
    description: "Estruturação de repositórios, CI/CD, banco de dados e arquitetura backend.",
    from: "R$ 500",
  },
  {
    title: "Melhorias em Sistemas",
    icon: Cpu,
    description: "Refatoração, otimização de performance, correção de bugs e novas features.",
    from: "R$ 300",
  },
];

const processSteps = [
  {
    icon: Zap,
    title: "1. Você descreve o projeto",
    desc: "Conte o que precisa em detalhes. O valor é calculado automaticamente conforme você escreve.",
  },
  {
    icon: ShieldCheck,
    title: "2. Pague via PIX ou cartão",
    desc: "Checkout seguro do Mercado Pago. Confirmação em segundos, sem burocracia.",
  },
  {
    icon: Layers,
    title: "3. Entregamos no prazo",
    desc: "Você recebe o sistema funcionando, com documentação e suporte de configuração.",
  },
];

const guarantees = [
  { icon: Lock, title: "Pagamento seguro", desc: "PIX e cartão processados pelo Mercado Pago, com criptografia ponta a ponta." },
  { icon: Clock, title: "Prazo combinado", desc: "Cronograma definido antes de começar, sem surpresas." },
  { icon: RefreshCcw, title: "Reembolso garantido", desc: "Devolução integral antes do desenvolvimento começar." },
  { icon: ShieldCheck, title: "Código com qualidade", desc: "Código limpo, comentado e seguindo boas práticas da indústria." },
];

const testimonials = [
  {
    quote:
      "Entrega impecável. O bot do Discord ficou muito além das minhas expectativas, com painel próprio.",
    name: "Lucas Martins",
    role: "Comunidade gamer",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote:
      "Receberam meu briefing de manhã e à noite eu já tinha o link de pagamento. Profissional do começo ao fim.",
    name: "Renata Souza",
    role: "Loja online",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote:
      "Refatoraram o backend do meu sistema antigo e a performance melhorou demais. Recomendo.",
    name: "Tiago Almeida",
    role: "Startup SaaS",
    avatar: "https://randomuser.me/api/portraits/men/68.jpg",
  },
];

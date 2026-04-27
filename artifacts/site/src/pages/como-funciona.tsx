import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  PencilLine,
  Calculator,
  CreditCard,
  QrCode,
  ShieldCheck,
  Rocket,
  CheckCircle2,
  MessageSquare,
  Clock,
  RefreshCcw,
  Lock,
  HelpCircle,
} from "lucide-react";

export function ComoFunciona() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative pt-20 pb-20 border-b border-border bg-gradient-to-b from-blue-50/60 via-white to-white overflow-hidden">
        <div className="absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.10),transparent_55%)]" />
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <Badge variant="outline" className="bg-white text-primary border-blue-200 mb-5 inline-flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5" /> Como funciona
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-5 leading-[1.1]">
            Do briefing ao seu projeto pronto, <br className="hidden md:block" />
            em um fluxo simples e seguro.
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Sem reuniões intermináveis, sem orçamentos demorados. Você descreve
            o que precisa, o valor é calculado automaticamente e você paga
            quando estiver pronto.
          </p>
          <Link href="/solicitar">
            <Button size="lg" className="h-12 px-7 text-base font-semibold shadow-md shadow-blue-600/20">
              Quero começar agora <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Vertical timeline of steps */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent hidden sm:block" />
            <ol className="space-y-10">
              {steps.map((s, i) => (
                <li key={i} className="relative sm:pl-20">
                  <span className="hidden sm:flex absolute left-0 top-0 w-12 h-12 rounded-full bg-primary text-primary-foreground items-center justify-center shadow-lg shadow-blue-600/30 ring-4 ring-blue-50">
                    <s.icon className="w-5 h-5" />
                  </span>
                  <div className="bg-white border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3 sm:hidden">
                      <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <s.icon className="w-5 h-5" />
                      </span>
                      <p className="text-xs font-bold text-primary tracking-wide uppercase">
                        Passo {i + 1}
                      </p>
                    </div>
                    <p className="hidden sm:block text-xs font-bold text-primary tracking-wide uppercase mb-1">
                      Passo {i + 1}
                    </p>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{s.desc}</p>
                    {s.bullets && (
                      <ul className="mt-4 space-y-2">
                        {s.bullets.map((b, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Payment methods deep dive */}
      <section className="py-20 bg-slate-50/60 border-y border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="bg-white text-primary border-blue-200 mb-4">
              Pagamento
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Você escolhe como pagar
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Tudo processado pelo Mercado Pago, com confirmação automática
              direto no nosso sistema.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white border-border hover:border-primary/40 hover:shadow-lg transition-all">
              <CardContent className="p-7">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-primary flex items-center justify-center mb-5">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">PIX</h3>
                <p className="text-slate-600 mb-5">
                  Geramos um QR Code dinâmico do Mercado Pago vinculado ao seu
                  pedido. Você paga pelo seu banco e a confirmação chega aqui em
                  segundos.
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5" /> Aprovação imediata</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5" /> Sem taxa para você</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5" /> QR Code ou copia-e-cola</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border-border hover:border-primary/40 hover:shadow-lg transition-all">
              <CardContent className="p-7">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-primary flex items-center justify-center mb-5">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Cartão de Crédito</h3>
                <p className="text-slate-600 mb-5">
                  Você é redirecionado para o checkout seguro do Mercado Pago.
                  Os dados do cartão nunca passam pelos nossos servidores.
                </p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5" /> Em até 12x</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5" /> Visa, Master, Elo, Hipercard, Amex</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-primary mt-0.5" /> Antifraude do Mercado Pago</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-20 bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="bg-blue-50 text-primary border-blue-200 mb-4">
              Por que confiar
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Suas garantias
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {guarantees.map((g, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-white hover:border-primary/40 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-md bg-blue-50 text-primary flex items-center justify-center mb-4">
                  <g.icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-slate-900 mb-1">{g.title}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50/60">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Perguntas frequentes
            </h2>
            <p className="text-slate-600">Tudo o que você precisa saber antes de começar.</p>
          </div>
          <div className="space-y-3">
            {faq.map((f, i) => (
              <details key={i} className="group bg-white border border-border rounded-lg p-5 open:border-primary/40 open:shadow-sm transition-all">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-semibold text-slate-900">{f.q}</span>
                  <span className="text-primary text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-slate-600 mt-3 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.25),transparent_60%)]" />
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tudo claro? Vamos começar.
          </h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Em menos de 3 minutos você descreve o projeto e já vê o valor calculado.
          </p>
          <Link href="/solicitar">
            <Button size="lg" className="h-12 px-7 text-base font-semibold bg-primary hover:bg-blue-500 text-white shadow-xl shadow-blue-500/30">
              Solicitar meu projeto <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

const steps: Array<{ icon: typeof PencilLine; title: string; desc: string; bullets?: string[] }> = [
  {
    icon: PencilLine,
    title: "Descreva o que você precisa",
    desc: "Conte o objetivo do projeto, funcionalidades principais e qualquer integração necessária. Quanto mais detalhes, mais preciso o valor.",
    bullets: [
      "Categoria (site, bot, repositório, melhoria, etc.)",
      "Lista de funcionalidades",
      "Integrações desejadas (pagamentos, login, APIs)",
    ],
  },
  {
    icon: Calculator,
    title: "Veja o valor calculado automaticamente",
    desc: "Conforme você escreve, o sistema calcula o valor com base na categoria, complexidade e funcionalidades detectadas. Sem espera por orçamento.",
    bullets: [
      "Cálculo deterministicamente baseado em regras claras",
      "Mostramos a base e cada acréscimo no detalhamento",
      "Você sabe exatamente porque está pagando aquilo",
    ],
  },
  {
    icon: CreditCard,
    title: "Pague via PIX ou cartão",
    desc: "Escolha PIX para confirmação instantânea, ou cartão (até 12x) pelo checkout seguro do Mercado Pago. Os dados financeiros nunca passam pelos nossos servidores.",
  },
  {
    icon: ShieldCheck,
    title: "Confirmação automática",
    desc: "Assim que o Mercado Pago aprova, seu pedido entra na fila de execução e a tela de status atualiza sozinha. Você recebe um e-mail de confirmação.",
  },
  {
    icon: MessageSquare,
    title: "Acompanhamento e entrega",
    desc: "Mantemos você atualizado por e-mail/Discord. Entregamos o sistema funcionando, com documentação e suporte de configuração.",
  },
  {
    icon: Rocket,
    title: "Subiu, é seu",
    desc: "Repositório, deploy e instruções nas suas mãos. Garantia de funcionamento e revisões inclusas no escopo combinado.",
  },
];

const guarantees = [
  { icon: Lock, title: "Pagamento seguro", desc: "Tudo via Mercado Pago, com criptografia ponta a ponta e antifraude." },
  { icon: Clock, title: "Prazo combinado", desc: "Cronograma fechado antes de começar, sem surpresas no meio do caminho." },
  { icon: RefreshCcw, title: "Reembolso garantido", desc: "Devolução integral antes do desenvolvimento começar, se algo não fechar." },
  { icon: ShieldCheck, title: "Código com qualidade", desc: "Padrões da indústria, comentado e organizado para manutenção futura." },
];

const faq = [
  {
    q: "Como o valor é calculado?",
    a: "O sistema avalia a categoria do projeto, o tamanho da descrição e detecta palavras-chave de complexidade (autenticação, pagamentos, dashboard, integrações, IA, mobile, etc.). Cada elemento adiciona um valor fixo, e você vê o detalhamento na tela do pedido.",
  },
  {
    q: "Posso pagar com cartão de crédito?",
    a: "Sim. Quando você escolhe cartão, te redirecionamos para o checkout do Mercado Pago, onde você paga em até 12x com qualquer cartão (Visa, Master, Elo, Hipercard, Amex). Os dados do seu cartão nunca passam pelos nossos servidores.",
  },
  {
    q: "Quanto tempo demora a confirmação do pagamento?",
    a: "PIX é confirmado em segundos. Cartão de crédito também é aprovado na hora pelo antifraude do Mercado Pago. A tela de status atualiza sozinha — você não precisa fazer nada.",
  },
  {
    q: "Vocês emitem nota fiscal?",
    a: "Sim, emitimos nota para projetos contratados. Os dados de faturamento são solicitados após a confirmação do pagamento.",
  },
  {
    q: "E se eu desistir antes do projeto começar?",
    a: "Devolvemos 100% do valor antes do início do desenvolvimento. Depois que o trabalho começa, o reembolso é proporcional ao que ainda não foi entregue.",
  },
  {
    q: "Como vocês entregam o projeto?",
    a: "Entregamos por repositório (Git) com instruções de deploy, ou já hospedamos pra você se contratar essa opção. Sempre com documentação e suporte inicial de configuração.",
  },
];

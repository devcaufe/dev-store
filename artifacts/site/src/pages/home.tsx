import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code2, TerminalSquare, Database, Cpu, CheckCircle2, Zap, ShieldCheck, Layers } from "lucide-react";

export function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <Badge variant="outline" className="mb-6 border-primary/30 text-primary bg-primary/10 px-4 py-1.5 backdrop-blur-sm">
            Soluções de Engenharia de Software
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl text-white mb-6">
            Código complexo, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              soluções elegantes.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Desenvolvimento profissional de alta performance. De sites elaborados a bots para Discord e arquitetura de sistemas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/solicitar" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-12 px-8">
                Solicitar Projeto <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/suporte" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-12 px-8 border-secondary/50 text-white hover:bg-secondary/10">
                Como Funciona
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-background relative">
        <div className="absolute inset-0 bg-secondary/5 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="mb-16 md:text-center max-w-3xl md:mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Especialidades</h2>
            <p className="text-muted-foreground text-lg">Domínio técnico sobre múltiplas plataformas para entregar exatamente o que seu negócio precisa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {services.map((s, i) => (
              <Card key={i} className="bg-card/50 border-card-border backdrop-blur-sm hover:border-primary/50 transition-colors group overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-secondary group-hover:bg-primary transition-colors" />
                <CardContent className="p-8 flex flex-col items-start text-left">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <s.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase / Social Proof */}
      <section className="py-24 bg-muted/20 border-y border-border/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">O Processo DevCaufe</h2>
              <div className="space-y-6">
                {[
                  { icon: Zap, title: "Análise Rápida", desc: "Entendemos sua necessidade e definimos escopo e orçamento claros." },
                  { icon: ShieldCheck, title: "Desenvolvimento Seguro", desc: "Código limpo, estruturado e com boas práticas da indústria." },
                  { icon: Layers, title: "Entrega Completa", desc: "Você recebe o sistema funcionando, documentado e pronto para produção." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{step.title}</h4>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full grid gap-4 grid-cols-2 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-primary/20 blur-3xl -z-10 rounded-full opacity-50" />
              <img src="/showcase-1.png" alt="Project 1" className="rounded-xl object-cover w-full h-48 border border-border shadow-2xl col-span-2" />
              <img src="/showcase-2.png" alt="Project 2" className="rounded-xl object-cover w-full h-40 border border-border shadow-xl" />
              <img src="/showcase-3.png" alt="Project 3" className="rounded-xl object-cover w-full h-40 border border-border shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background z-0" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-xl text-muted-foreground mb-10">
            Transforme sua ideia em uma aplicação robusta e escalável. 
          </p>
          <Link href="/solicitar">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 px-10 text-lg shadow-[0_0_40px_rgba(0,229,255,0.3)] transition-shadow hover:shadow-[0_0_60px_rgba(0,229,255,0.5)]">
              Iniciar Projeto Agora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

const services = [
  {
    title: "Sites Complexos",
    icon: TerminalSquare,
    description: "Desenvolvimento de aplicações web interativas, dashboards, painéis administrativos e landing pages de alta conversão."
  },
  {
    title: "Bots de Discord",
    icon: Code2,
    description: "Bots personalizados com sistemas de economia, moderação avançada, integração de APIs e painéis web de controle."
  },
  {
    title: "Repositórios & Arquitetura",
    icon: Database,
    description: "Estruturação de repositórios profissionais, CI/CD, configuração de banco de dados e arquitetura de backend."
  },
  {
    title: "Melhorias em Sistemas",
    icon: Cpu,
    description: "Refatoração de código, otimização de performance, correção de bugs estruturais e adição de novas features em projetos existentes."
  }
];

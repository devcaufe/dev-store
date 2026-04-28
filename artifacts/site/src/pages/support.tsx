import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Support() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl animate-in fade-in duration-500">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Suporte & FAQ</h1>
        <p className="text-lg text-muted-foreground">Tire suas dúvidas sobre o processo, pagamentos e entrega.</p>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-10 items-start">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-6 text-primary">Dúvidas Frequentes</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border/50 bg-card rounded-lg px-4 shadow-sm">
                  <AccordionTrigger className="hover:no-underline font-medium text-left text-foreground hover:text-primary transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>

        <div className="sticky top-24">
          <Card className="bg-secondary/10 border-secondary/20">
            <CardHeader>
              <CardTitle className="text-xl">Contato Direto</CardTitle>
              <CardDescription>Ainda com dúvidas? Fale comigo diretamente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href="https://discord.gg/hzvyJECrA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full p-3 rounded-md bg-card border border-border hover:border-primary/50 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-[#5865F2]/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#5865F2] group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="font-medium text-sm">Discord</div>
                  <div className="text-xs text-muted-foreground">Comunidade Dev Store BR</div>
                </div>
              </a>

              <a href="mailto:contato@devstorebr.com" className="flex items-center gap-3 w-full p-3 rounded-md bg-card border border-border hover:border-primary/50 transition-colors group">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className="font-medium text-sm">E-mail</div>
                  <div className="text-xs text-muted-foreground">Resposta em até 24h</div>
                </div>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const faqs = [
  {
    q: "Como solicito um projeto?",
    a: "Basta acessar a página 'Solicitar Projeto', preencher o formulário com o máximo de detalhes possível sobre sua ideia, escolher o método de pagamento e enviar. Analisarei seu pedido e entrarei em contato."
  },
  {
    q: "Como funciona o pagamento via PIX?",
    a: "Após confirmar a solicitação, será gerado um QR Code e um código 'Copia e Cola' processado pelo Mercado Pago, com confirmação automática em segundos. Sem espera manual."
  },
  {
    q: "Como pagar com Bitcoin?",
    a: "Você receberá um endereço Bitcoin (e um URI BIP21 com QR Code) com a quantia exata necessária para o seu projeto. A confirmação do pedido depende das confirmações da rede blockchain."
  },
  {
    q: "O que acontece após o pagamento?",
    a: "Assim que o pagamento for identificado e o escopo aprovado, entrarei em contato pelo e-mail fornecido (ou via Discord) para alinhar o cronograma de desenvolvimento e iniciar o trabalho."
  },
  {
    q: "Como funciona a entrega do projeto?",
    a: "O projeto será entregue conforme combinado: código-fonte via repositório no GitHub/GitLab, documentação de instalação e, se aplicável, assistência na configuração do deploy inicial."
  },
  {
    q: "Qual a política de reembolso?",
    a: "Reembolsos integrais são emitidos apenas se o projeto ainda não tiver sido iniciado. Uma vez que o desenvolvimento começou, valores não são reembolsáveis devido ao tempo técnico já investido."
  },
  {
    q: "Quais os prazos de resposta e entrega?",
    a: "O prazo de resposta para novos contatos é de até 24h úteis. O prazo de entrega do projeto varia enormemente dependendo da complexidade escolhida, sendo acordado formalmente antes do início."
  }
];

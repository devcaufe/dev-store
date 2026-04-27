import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreateOrderBody } from "@workspace/api-zod";
import { useCreateOrder } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, QrCode, Bitcoin, Loader2, ArrowRight } from "lucide-react";

// Create a custom schema that handles the string-to-number conversion for amount
const formSchema = CreateOrderBody.extend({
  amountString: z.string().refine((val) => {
    const num = parseFloat(val.replace(/\./g, "").replace(",", "."));
    return !isNaN(num) && num >= 5 && num <= 50000;
  }, "O valor deve ser entre R$ 5,00 e R$ 50.000,00"),
}).omit({ amountCents: true });

type FormValues = z.infer<typeof formSchema>;

export function RequestProject() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createOrder = useCreateOrder();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      contactEmail: "",
      category: "website",
      title: "",
      description: "",
      amountString: "",
      paymentMethod: "pix",
    },
  });

  const amountStringValue = form.watch("amountString");

  // Simple mask for BRL
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");
    if (value.length > 0) {
      value = (parseInt(value, 10) / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    form.setValue("amountString", value, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const num = parseFloat(data.amountString.replace(/\./g, "").replace(",", "."));
      const amountCents = Math.round(num * 100);

      const requestData = {
        clientName: data.clientName,
        contactEmail: data.contactEmail,
        category: data.category,
        title: data.title,
        description: data.description,
        amountCents,
        paymentMethod: data.paymentMethod,
      };

      const result = await createOrder.mutateAsync({ data: requestData });
      
      toast({
        title: "Pedido criado com sucesso!",
        description: "Redirecionando para o pagamento...",
      });
      
      setLocation(`/pedido/${result.publicToken}`);
    } catch (error: any) {
      toast({
        title: "Erro ao criar pedido",
        description: error.message || "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Solicitar Projeto</h1>
        <p className="text-lg text-muted-foreground">Preencha os detalhes abaixo para darmos início ao desenvolvimento do seu sistema.</p>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle>Detalhes da Solicitação</CardTitle>
          <CardDescription>Todas as informações são confidenciais.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu Nome / Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: João Silva ou Acme Corp" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail de Contato</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" type="email" {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria do Projeto</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="website">Site Completo / Landing Page</SelectItem>
                        <SelectItem value="discord_bot">Bot para Discord</SelectItem>
                        <SelectItem value="repository">Arquitetura de Repositório</SelectItem>
                        <SelectItem value="improvement">Melhoria em Sistema Existente</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Projeto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Dashboard Administrativo para E-commerce" {...field} className="bg-background" />
                    </FormControl>
                    <FormDescription>Um nome curto para identificarmos seu pedido.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição Detalhada</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o que você precisa em detalhes. Quais são as funcionalidades principais? Qual o objetivo do projeto?" 
                        className="min-h-[150px] bg-background resize-y" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amountString"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orçamento Estimado (BRL)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-muted-foreground sm:text-sm">R$</span>
                        </div>
                        <Input 
                          {...field} 
                          onChange={handleAmountChange} 
                          placeholder="0,00" 
                          className="pl-10 bg-background font-mono text-lg" 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Mínimo: R$ 5,00 | Máximo: R$ 50.000,00</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel>Método de Pagamento</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="pix" className="peer sr-only" />
                          </FormControl>
                          <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                            <QrCode className="mb-3 h-6 w-6 text-primary" />
                            <span className="font-bold">PIX</span>
                            <span className="text-xs text-muted-foreground mt-1">Aprovação imediata</span>
                          </FormLabel>
                        </FormItem>
                        
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="btc" className="peer sr-only" />
                          </FormControl>
                          <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                            <Bitcoin className="mb-3 h-6 w-6 text-[#F7931A]" />
                            <span className="font-bold">Bitcoin</span>
                            <span className="text-xs text-muted-foreground mt-1">Rede on-chain</span>
                          </FormLabel>
                        </FormItem>
                        
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem value="card" className="peer sr-only" />
                          </FormControl>
                          <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                            <CreditCard className="mb-3 h-6 w-6 text-secondary" />
                            <span className="font-bold">Cartão</span>
                            <span className="text-xs text-muted-foreground mt-1">Em breve</span>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-6 border-t border-border">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...
                    </>
                  ) : (
                    <>
                      Avançar para Pagamento <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

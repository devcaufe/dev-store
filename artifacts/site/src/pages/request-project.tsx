import { useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateOrderBody } from "@workspace/api-zod";
import { useCreateOrder } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { BrazilFlag } from "@/components/brazil-flag";
import {
  CreditCard,
  QrCode,
  Bitcoin,
  Loader2,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

type FormValues = {
  clientName: string;
  contactEmail: string;
  category: "website" | "discord_bot" | "repository" | "improvement" | "other";
  title: string;
  description: string;
  paymentMethod: "pix" | "btc" | "card";
};

const formatBRL = (cents: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);

export function RequestProject() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const form = useForm<FormValues>({
    resolver: zodResolver(CreateOrderBody),
    defaultValues: {
      clientName: "",
      contactEmail: "",
      category: "website",
      title: "",
      description: "",
      paymentMethod: "pix",
    },
  });

  const description = form.watch("description");
  const category = form.watch("category");
  const paymentMethod = form.watch("paymentMethod");

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await createOrder.mutateAsync({ data });

      toast({
        title: "Pedido criado!",
        description:
          data.paymentMethod === "card"
            ? "Redirecionando para o checkout do Mercado Pago..."
            : "Redirecionando para o pagamento...",
      });

      // For card we can also push directly to MP without the order page:
      // we still send the user to the order page so they can re-open the
      // checkout if needed. The order page shows a "Pagar com cartão"
      // button and auto-redirects below.
      setLocation(`/pedido/${result.publicToken}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Verifique os dados e tente novamente.";
      toast({
        title: "Erro ao criar pedido",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-20 max-w-5xl animate-in fade-in duration-500">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">
          Solicitar Projeto
        </h1>
        <p className="text-lg text-muted-foreground">
          Preencha os detalhes abaixo. O preço é{" "}
          <span className="text-primary font-semibold">fixo</span> por tipo de
          projeto. A descrição detalhada só serve para entender o que precisa
          ser feito.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Form */}
        <Card className="border-border bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Detalhes da solicitação</CardTitle>
            <CardDescription>
              Quanto mais detalhes na descrição, melhor entendemos o escopo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-7"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seu nome / empresa</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: João Silva ou Acme Corp"
                            {...field}
                          />
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
                        <FormLabel>E-mail de contato</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="seu@email.com"
                            type="email"
                            {...field}
                          />
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
                      <FormLabel>Categoria do projeto</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="website">
                            Site / Aplicação Web
                          </SelectItem>
                          <SelectItem value="discord_bot">
                            Bot para Discord
                          </SelectItem>
                          <SelectItem value="repository">
                            Arquitetura de Repositório
                          </SelectItem>
                          <SelectItem value="improvement">
                            Melhoria em Sistema
                          </SelectItem>
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
                      <FormLabel>Título do projeto</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Dashboard administrativo para e-commerce"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Um nome curto para identificarmos o pedido.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Descrição detalhada
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Conte o que precisa: funcionalidades principais, integrações (login, pagamento, APIs), tipos de usuário, prazos, etc."
                          className="min-h-[180px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        A descrição serve para orientar o trabalho, não para
                        calcular preço.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Método de pagamento</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 md:grid-cols-3 gap-3"
                        >
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem
                                value="pix"
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel className="flex flex-col items-center justify-between rounded-lg border-2 border-border bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-blue-50/40 cursor-pointer transition-all">
                              <QrCode className="mb-3 h-6 w-6 text-primary" />
                              <span className="font-bold text-slate-900">
                                PIX
                              </span>
                              <span className="text-xs text-muted-foreground mt-1">
                                Aprovação imediata
                              </span>
                            </FormLabel>
                          </FormItem>

                          <FormItem>
                            <FormControl>
                              <RadioGroupItem
                                value="card"
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel className="flex flex-col items-center justify-between rounded-lg border-2 border-border bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-blue-50/40 cursor-pointer transition-all">
                              <CreditCard className="mb-3 h-6 w-6 text-primary" />
                              <span className="font-bold text-slate-900">
                                Cartão
                              </span>
                              <span className="text-xs text-muted-foreground mt-1">
                                Até 12x — Mercado Pago
                              </span>
                            </FormLabel>
                          </FormItem>

                          <FormItem>
                            <FormControl>
                              <RadioGroupItem
                                value="btc"
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel className="flex flex-col items-center justify-between rounded-lg border-2 border-border bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-blue-50/40 cursor-pointer transition-all">
                              <Bitcoin className="mb-3 h-6 w-6 text-[#F7931A]" />
                              <span className="font-bold text-slate-900">
                                Bitcoin
                              </span>
                              <span className="text-xs text-muted-foreground mt-1">
                                Rede on-chain
                              </span>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-5 border-t border-border">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base font-semibold"
                    disabled={createOrder.isPending}
                    data-testid="button-submit"
                  >
                    {createOrder.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                        Processando...
                      </>
                    ) : paymentMethod === "card" ? (
                      <>
                        Pagar com cartão{" "}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    ) : paymentMethod === "btc" ? (
                      <>
                        Continuar para Bitcoin{" "}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    ) : (
                      <>
                        Gerar QR Code PIX{" "}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-3 inline-flex items-center justify-center gap-1.5 w-full">
                    <ShieldCheck className="w-3.5 h-3.5" /> Pagamento processado
                    com segurança pelo Mercado Pago
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Logo panel */}
        <div className="lg:sticky lg:top-24">
          <Card className="border-primary/30 bg-white shadow-md overflow-hidden">
            <CardHeader className="bg-blue-50/40 border-b border-primary/10">
              <CardTitle className="flex items-center gap-2 text-base">
                <img
                  src={`${import.meta.env.BASE_URL}logo.png`}
                  alt="Dev Store BR"
                  className="w-8 h-8 rounded-md object-cover bg-slate-900"
                />
                Dev Store BR
              </CardTitle>
              <CardDescription>
                Preço fixo por projeto, sem estimativa variável.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src={`${import.meta.env.BASE_URL}logo.png`}
                  alt="Logo Dev Store BR"
                  className="w-44 h-44 rounded-3xl object-cover shadow-lg border border-border"
                />
                <p className="mt-5 text-sm text-muted-foreground max-w-xs">
                  A descrição detalhada ajuda a definir o que fazer. O preço é
                  combinado previamente.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-border text-xs text-muted-foreground leading-relaxed">
                Sem cálculo automático. Sem surpresa no preço.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

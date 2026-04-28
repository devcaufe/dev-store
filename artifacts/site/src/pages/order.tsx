import { useParams, Link } from "wouter";
import { useEffect } from "react";
import { useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  Copy,
  AlertCircle,
  Loader2,
  ArrowLeft,
  QrCode,
  Bitcoin,
  CreditCard,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

const formatBRL = (cents: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);

export function OrderSuccess() {
  const params = useParams();
  const publicToken = params.publicToken || "";
  const { toast } = useToast();

  const { data: order, isLoading, error } = useGetOrder(publicToken, {
    query: {
      enabled: !!publicToken,
      queryKey: getGetOrderQueryKey(publicToken),
      refetchInterval: (q) => {
        const status = (q.state.data as { status?: string } | undefined)?.status;
        return status === "awaiting_payment" ? 5000 : false;
      },
    },
  });

  useEffect(() => {
    if (order?.status === "paid") {
      toast({
        title: "Pagamento confirmado!",
        description:
          "Recebemos seu pagamento. Em breve entraremos em contato.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.status]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">
          Carregando informações do pedido...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="h-16 w-16 text-destructive mb-6" />
        <h2 className="text-2xl font-bold mb-2 text-slate-900">
          Pedido não encontrado
        </h2>
        <p className="text-muted-foreground mb-8">
          Não foi possível carregar as informações deste pedido.
        </p>
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao início
          </Button>
        </Link>
      </div>
    );
  }

  const isPix = order.paymentMethod === "pix" && order.pix;
  const isBtc = order.paymentMethod === "btc" && order.btc;
  const isCard = order.paymentMethod === "card";
  const isPaid = order.status === "paid";
  const isCancelled = order.status === "cancelled";

  return (
    <div className="container mx-auto px-4 py-16 md:py-20 max-w-4xl animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <div
          className={
            "inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 border-2 " +
            (isPaid
              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
              : isCancelled
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-blue-50 text-primary border-blue-200")
          }
        >
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900">
          {isPaid
            ? "Pagamento confirmado!"
            : isCancelled
              ? "Pagamento cancelado"
              : "Pedido registrado!"}
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          {isPaid
            ? "Recebemos seu pagamento. Em breve entraremos em contato pelo e-mail informado."
            : isCancelled
              ? "Este pagamento foi cancelado. Você pode criar um novo pedido a qualquer momento."
              : "Falta pouco. Complete o pagamento abaixo para darmos início ao projeto."}
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Payment instructions */}
        <div className="order-2 md:order-1">
          <Card className="border-border bg-white shadow-sm">
            <CardHeader className="bg-blue-50/40 border-b border-primary/10">
              <CardTitle className="flex items-center gap-2">
                {isPix && (
                  <>
                    <QrCode className="w-5 h-5 text-primary" /> Pagamento via PIX
                  </>
                )}
                {isBtc && (
                  <>
                    <Bitcoin className="w-5 h-5 text-[#F7931A]" /> Pagamento via
                    Bitcoin
                  </>
                )}
                {isCard && (
                  <>
                    <CreditCard className="w-5 h-5 text-primary" /> Pagamento com
                    cartão
                  </>
                )}
              </CardTitle>
              <CardDescription>
                Siga as instruções abaixo para confirmar.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isPix && order.pix && !isPaid && !isCancelled && (
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl border border-border mb-6">
                    <img
                      src={order.pix.qrImageDataUrl}
                      alt="PIX QR Code"
                      className="w-64 h-64"
                    />
                  </div>

                  <div className="w-full space-y-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">
                        Destinatário
                      </p>
                      <p className="font-bold text-slate-900">
                        {order.pix.merchantName}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Código copia e cola
                      </p>
                      <div className="flex w-full items-center space-x-2">
                        <div className="flex-1 bg-slate-50 p-3 rounded-md font-mono text-xs text-slate-600 break-all overflow-hidden h-12 flex items-center border border-border">
                          {order.pix.brCode.substring(0, 40)}...
                        </div>
                        <Button
                          onClick={() =>
                            handleCopy(order.pix!.brCode, "Código PIX")
                          }
                          className="shrink-0"
                        >
                          <Copy className="h-4 w-4 mr-2" /> Copiar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isBtc && order.btc && !isPaid && !isCancelled && (
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl border border-border mb-6">
                    <img
                      src={order.btc.qrImageDataUrl}
                      alt="Bitcoin QR Code"
                      className="w-64 h-64"
                    />
                  </div>

                  <div className="w-full space-y-6">
                    <div className="text-center bg-slate-50 p-4 rounded-lg border border-border">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Envie exatamente
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-2xl font-bold font-mono text-[#F7931A]">
                          {order.btc.amountBtc} BTC
                        </p>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-full"
                          onClick={() =>
                            handleCopy(order.btc!.amountBtc, "Valor em BTC")
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        Endereço Bitcoin
                      </p>
                      <div className="flex w-full items-center space-x-2">
                        <div className="flex-1 bg-slate-50 p-3 rounded-md font-mono text-xs text-foreground break-all border border-border">
                          {order.btc.address}
                        </div>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleCopy(order.btc!.address, "Endereço BTC")
                          }
                          className="shrink-0"
                        >
                          <Copy className="h-4 w-4 mr-2" /> Copiar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isCard && !isPaid && !isCancelled && (
                <CardCheckoutBlock
                  url={order.cardCheckoutUrl}
                  amountCents={order.amountCents}
                />
              )}

              {(isPaid || isCancelled) && (
                <div className="text-center py-8">
                  <p className="text-slate-600 mb-6">
                    {isPaid
                      ? "Você já pode fechar esta página com tranquilidade. O time entrará em contato em breve."
                      : "Você pode iniciar uma nova solicitação a qualquer momento."}
                  </p>
                  <Link href="/">
                    <Button variant="outline">Voltar ao início</Button>
                  </Link>
                </div>
              )}
            </CardContent>

            {(isPix || isBtc) && !isPaid && !isCancelled && (
              <CardFooter className="bg-slate-50/60 border-t border-border pt-5 flex-col gap-3">
                <p className="text-xs text-center text-muted-foreground inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Confirmação automática
                  — você não precisa avisar manualmente.
                </p>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Order summary */}
        <div className="order-1 md:order-2">
          <Card className="bg-white border-border md:sticky md:top-24">
            <CardHeader>
              <CardTitle className="text-lg">Resumo do pedido</CardTitle>
              <CardDescription>
                ID: {order.publicToken.split("-")[0]}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Projeto
                </p>
                <p className="font-medium text-slate-900">{order.title}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Categoria
                </p>
                <Badge
                  variant="outline"
                  className="mt-1 font-normal capitalize"
                >
                  {order.category.replace("_", " ")}
                </Badge>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                {isPaid ? (
                  <Badge className="mt-1 bg-emerald-600 hover:bg-emerald-600 text-white">
                    Pago
                  </Badge>
                ) : isCancelled ? (
                  <Badge className="mt-1 bg-red-600 hover:bg-red-600 text-white">
                    Cancelado
                  </Badge>
                ) : (
                  <Badge className="mt-1 bg-amber-500 hover:bg-amber-500 text-white">
                    Aguardando pagamento
                  </Badge>
                )}
              </div>

              <div className="pt-4 mt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatBRL(order.amountCents)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CardCheckoutBlock({
  url,
  amountCents,
}: {
  url: string | null | undefined;
  amountCents: number;
}) {
  useEffect(() => {
    if (!url) return;
    const t = setTimeout(() => {
      window.location.href = url;
    }, 800);
    return () => clearTimeout(t);
  }, [url]);

  if (!url) {
    return (
      <div className="flex flex-col items-center text-center py-10">
        <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-bold mb-2 text-slate-900">
          Link de pagamento indisponível
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Não foi possível gerar o link do checkout. Tente novamente ou escolha
          PIX.
        </p>
        <Link href="/solicitar">
          <Button>Nova solicitação</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="w-14 h-14 rounded-full bg-blue-50 text-primary flex items-center justify-center mb-4">
        <CreditCard className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-slate-900">
        Redirecionando para o checkout seguro...
      </h3>
      <p className="text-muted-foreground mb-2 max-w-md">
        Você está sendo levado ao Mercado Pago para concluir o pagamento de{" "}
        <span className="font-semibold text-primary">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amountCents / 100)}
        </span>
        .
      </p>
      <p className="text-xs text-muted-foreground mb-6 max-w-md">
        Os dados do seu cartão nunca passam pelos nossos servidores. Tudo é
        processado pelo Mercado Pago.
      </p>
      <Loader2 className="w-5 h-5 text-primary animate-spin mb-6" />
      <a href={url}>
        <Button size="lg" className="font-semibold">
          Abrir checkout agora <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </a>
    </div>
  );
}

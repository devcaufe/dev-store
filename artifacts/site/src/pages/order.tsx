import { useParams, Link } from "wouter";
import { useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Copy, AlertCircle, Loader2, ArrowLeft, QrCode, Bitcoin } from "lucide-react";

const formatBRL = (cents: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
};

export function OrderSuccess() {
  const params = useParams();
  const publicToken = params.publicToken || "";
  const { toast } = useToast();

  const { data: order, isLoading, error } = useGetOrder(publicToken, {
    query: {
      enabled: !!publicToken,
      queryKey: getGetOrderQueryKey(publicToken),
    }
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
    });
  };

  const handlePaidClick = () => {
    toast({
      title: "Pagamento informado",
      description: "Aguarde enquanto verificamos a compensação. Você receberá um e-mail de confirmação.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Carregando informações do pedido...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="h-16 w-16 text-destructive mb-6" />
        <h2 className="text-2xl font-bold mb-2">Pedido não encontrado</h2>
        <p className="text-muted-foreground mb-8">Não foi possível carregar as informações deste pedido.</p>
        <Link href="/">
          <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Início</Button>
        </Link>
      </div>
    );
  }

  const isPix = order.paymentMethod === "pix" && order.pix;
  const isBtc = order.paymentMethod === "btc" && order.btc;
  const isCard = order.paymentMethod === "card";

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl animate-in fade-in duration-500">
      
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-6 border-2 border-primary/50">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Pedido Registrado!</h1>
        <p className="text-lg text-muted-foreground">
          Falta pouco. Complete o pagamento abaixo para darmos início ao projeto.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_380px] gap-8 items-start">
        
        {/* Payment Instructions */}
        <div className="order-2 md:order-1">
          <Card className="border-primary/30 shadow-[0_0_30px_rgba(0,229,255,0.05)] bg-card/60 backdrop-blur-sm">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="flex items-center gap-2">
                {isPix && <><QrCode className="w-5 h-5 text-primary" /> Pagamento via PIX</>}
                {isBtc && <><Bitcoin className="w-5 h-5 text-[#F7931A]" /> Pagamento via Bitcoin</>}
                {isCard && <><AlertCircle className="w-5 h-5 text-secondary" /> Pagamento via Cartão</>}
              </CardTitle>
              <CardDescription>
                Siga as instruções abaixo para confirmar.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              
              {isPix && order.pix && (
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl mb-6">
                    <img src={order.pix.qrImageDataUrl} alt="PIX QR Code" className="w-64 h-64" />
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-muted-foreground">Destinatário</p>
                      <p className="font-bold">{order.pix.merchantName}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Código Copia e Cola</p>
                      <div className="flex w-full items-center space-x-2">
                        <div className="flex-1 bg-muted p-3 rounded-md font-mono text-xs text-muted-foreground break-all overflow-hidden h-12 flex items-center">
                          {order.pix.brCode.substring(0, 40)}...
                        </div>
                        <Button onClick={() => handleCopy(order.pix!.brCode, "Código PIX")} className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
                          <Copy className="h-4 w-4 mr-2" /> Copiar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isBtc && order.btc && (
                <div className="flex flex-col items-center">
                  <div className="bg-white p-4 rounded-xl mb-6">
                    <img src={order.btc.qrImageDataUrl} alt="Bitcoin QR Code" className="w-64 h-64" />
                  </div>
                  
                  <div className="w-full space-y-6">
                    <div className="text-center bg-muted/50 p-4 rounded-lg border border-border">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Envie exatamente</p>
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-2xl font-bold font-mono text-[#F7931A]">{order.btc.amountBtc} BTC</p>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => handleCopy(order.btc!.amountBtc, "Valor em BTC")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Endereço Bitcoin</p>
                      <div className="flex w-full items-center space-x-2">
                        <div className="flex-1 bg-muted p-3 rounded-md font-mono text-xs text-foreground break-all">
                          {order.btc.address}
                        </div>
                        <Button variant="secondary" onClick={() => handleCopy(order.btc!.address, "Endereço BTC")} className="shrink-0">
                          <Copy className="h-4 w-4 mr-2" /> Copiar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isCard && (
                <div className="flex flex-col items-center text-center py-8">
                  <AlertCircle className="h-12 w-12 text-secondary mb-4" />
                  <h3 className="text-lg font-bold mb-2">Checkout de Cartão em Integração</h3>
                  <p className="text-muted-foreground mb-6">
                    Nossa integração de pagamentos por cartão está em manutenção. Por favor, solicite o projeto novamente escolhendo PIX ou Bitcoin, ou contate o suporte.
                  </p>
                  <Link href="/solicitar">
                    <Button variant="default">Fazer Nova Solicitação</Button>
                  </Link>
                </div>
              )}

            </CardContent>
            
            {(isPix || isBtc) && (
              <CardFooter className="bg-muted/20 border-t border-border pt-6 flex-col gap-4">
                <Button size="lg" className="w-full font-bold" onClick={handlePaidClick}>
                  Já realizei o pagamento
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  A confirmação pode levar alguns minutos. Não feche esta janela até concluir o pagamento.
                </p>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Order Summary */}
        <div className="order-1 md:order-2">
          <Card className="bg-muted/10 border-border/50 sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
              <CardDescription>ID: {order.publicToken.split('-')[0]}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projeto</p>
                <p className="font-medium text-foreground">{order.title}</p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                <Badge variant="outline" className="mt-1 font-normal capitalize">
                  {order.category.replace('_', ' ')}
                </Badge>
              </div>

              <Separator />
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className="mt-1 bg-secondary text-secondary-foreground">
                  Aguardando Pagamento
                </Badge>
              </div>
              
              <div className="pt-4 mt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-primary">{formatBRL(order.amountCents)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

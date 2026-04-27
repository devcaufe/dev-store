# Dev Store BR Workspace

## Overview

Plataforma profissional de desenvolvimento digital (Dev Store BR — Soluções
Digitais). Marca pública = "Dev Store BR" 🇧🇷.
Cliente descreve o projeto e o valor é **calculado automaticamente no servidor**
(`lib/pricing.ts`, R$ 200 a R$ 50.000, arredondado a R$ 50) — o cliente nunca
envia preço. Um endpoint `POST /api/quote/estimate` retorna o valor + breakdown
ao vivo enquanto o usuário digita. Pagamento aceita PIX (QR Code Mercado Pago
com confirmação automática via webhook HMAC), Cartão (Mercado Pago Checkout Pro,
até 12x, redirect) e Bitcoin (BIP21).

## Stack

- **Monorepo**: pnpm workspaces, TypeScript 5.9, Node 24
- **Frontend**: React + Vite + Tailwind + shadcn/ui (`artifacts/site`)
- **Backend**: Express 5 + Helmet + express-rate-limit + Pino (`artifacts/api-server`)
- **Banco**: PostgreSQL + Drizzle ORM (`lib/db`)
- **Validação**: Zod (codegen via Orval a partir de `lib/api-spec/openapi.yaml`)
- **Pagamentos**:
  - PIX (preferido): **Mercado Pago** com confirmação automática via webhook
    HMAC-verificado (`artifacts/api-server/src/lib/mercadopago.ts` +
    `artifacts/api-server/src/routes/webhooks.ts`).
    Requer `MP_ACCESS_TOKEN` e `MP_WEBHOOK_SECRET` configurados como secrets.
  - PIX (fallback): gerador EMV-MPM próprio (`pix.ts`) com CRC-16/CCITT-FALSE
    quando MP não está configurado ou indisponível.
  - Bitcoin: BIP21 URI (`btc.ts`).
  - Cartão: stub (requer integração com gateway externo).

## Comandos

- `pnpm run typecheck` — typecheck completo
- `pnpm --filter @workspace/api-spec run codegen` — regenera schemas Zod e hooks React Query
- `pnpm --filter @workspace/db run push` — aplica schema no banco
- `pnpm dlx tsx artifacts/api-server/src/lib/pix.test.ts` — testa BR Code + CRC

## Decisões de segurança

- Tokens do Mercado Pago (`MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`) ficam
  apenas como secrets — nunca em código, nunca logados, nunca enviados ao
  frontend. Webhook é validado por HMAC antes de qualquer atualização.
- Dados bancários (agência/conta Nubank) **nunca** são expostos ao frontend.
  São sensíveis e só servem para conciliação interna do dono.
- BR Code é sempre construído no servidor a partir de um valor validado em
  centavos. O frontend não consegue injetar destinatário ou valor arbitrário.
- Tokens públicos de pedido são randômicos (128 bits, base64url) — IDs de
  banco (UUID) jamais são expostos.
- Rate limiting global + estrito em `POST /api/orders`.
- Validação rigorosa via Zod (faixa R$ 5,00 .. R$ 50.000,00, e-mail, comprimentos).
- Helmet + body limit de 32kb.
- Variável `BTC_BRL_RATE` (opcional) controla a conversão BRL→BTC. Sem ela, o
  URI BIP21 é emitido sem campo `amount` (seguro: nunca inventa cotação).

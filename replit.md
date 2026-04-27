# DevCaufe Workspace

## Overview

Plataforma profissional de desenvolvimento digital (DevCaufe Soluções Digitais).
Cliente envia uma solicitação de projeto, define o valor manualmente e recebe um
link de pagamento com QR Code PIX dinâmico (BR Code EMV-MPM com CRC16
recalculado pelo backend), suporte a Bitcoin (BIP21) e placeholder para
cartão de crédito/débito (a ser plugado a um gateway PCI-compliant).

## Stack

- **Monorepo**: pnpm workspaces, TypeScript 5.9, Node 24
- **Frontend**: React + Vite + Tailwind + shadcn/ui (`artifacts/site`)
- **Backend**: Express 5 + Helmet + express-rate-limit + Pino (`artifacts/api-server`)
- **Banco**: PostgreSQL + Drizzle ORM (`lib/db`)
- **Validação**: Zod (codegen via Orval a partir de `lib/api-spec/openapi.yaml`)
- **Pagamentos**:
  - PIX: gerador EMV-MPM próprio (`artifacts/api-server/src/lib/pix.ts`)
    com CRC-16/CCITT-FALSE
  - Bitcoin: BIP21 URI (`artifacts/api-server/src/lib/btc.ts`)
  - Cartão: stub (requer integração com gateway externo)

## Comandos

- `pnpm run typecheck` — typecheck completo
- `pnpm --filter @workspace/api-spec run codegen` — regenera schemas Zod e hooks React Query
- `pnpm --filter @workspace/db run push` — aplica schema no banco
- `pnpm dlx tsx artifacts/api-server/src/lib/pix.test.ts` — testa BR Code + CRC

## Decisões de segurança

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

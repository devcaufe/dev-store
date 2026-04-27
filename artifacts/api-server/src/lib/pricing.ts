/**
 * Server-side automatic project price estimator.
 *
 * The estimate is fully deterministic and bounded: given the same category and
 * description it always returns the same value. Computed in integer cents and
 * clamped to the same range used by the OpenAPI schema (R$ 200 .. R$ 50.000).
 *
 * Security notes:
 * - The amount used in /api/orders is always (re)computed here on the server.
 *   We never trust a client-provided amount.
 * - Keyword detection is intentionally simple and case/diacritic-insensitive
 *   to avoid surprising the user, while still rewarding scope signals.
 */

export type Category =
  | "website"
  | "discord_bot"
  | "repository"
  | "improvement"
  | "other";

export interface QuoteFactor {
  label: string;
  deltaCents: number;
}

export interface QuoteEstimate {
  amountCents: number;
  baseCents: number;
  factors: QuoteFactor[];
}

const MIN_CENTS = 20_000; // R$ 200
const MAX_CENTS = 5_000_000; // R$ 50.000

const BASE_BY_CATEGORY: Record<Category, { base: number; label: string }> = {
  website: { base: 80_000, label: "Site / aplicação web (base)" },
  discord_bot: { base: 35_000, label: "Bot de Discord (base)" },
  repository: { base: 50_000, label: "Arquitetura de repositório (base)" },
  improvement: { base: 30_000, label: "Melhoria em sistema existente (base)" },
  other: { base: 50_000, label: "Projeto sob medida (base)" },
};

interface KeywordRule {
  patterns: RegExp[];
  deltaCents: number;
  label: string;
}

const KEYWORD_RULES: KeywordRule[] = [
  {
    patterns: [/\bdashboard\b/, /\badmin\b/, /\bpainel\b/],
    deltaCents: 40_000,
    label: "Painel administrativo",
  },
  {
    patterns: [/\becommerce\b/, /\be-commerce\b/, /\bloja\b/, /\bcheckout\b/, /\bcarrinho\b/],
    deltaCents: 60_000,
    label: "Loja / e-commerce",
  },
  {
    patterns: [/\bpagamento\b/, /\bpayment\b/, /\bstripe\b/, /\bmercado pago\b/, /\bpix\b/, /\bboleto\b/],
    deltaCents: 30_000,
    label: "Integração de pagamentos",
  },
  {
    patterns: [/\bintegracao\b/, /\bintegrar\b/, /\bapi\b/, /\bwebhook\b/],
    deltaCents: 30_000,
    label: "Integrações externas",
  },
  {
    patterns: [/\blogin\b/, /\bautenticacao\b/, /\bauth\b/, /\boauth\b/, /\bsso\b/, /\bcadastro\b/],
    deltaCents: 25_000,
    label: "Autenticação / login",
  },
  {
    patterns: [/\bbanco de dados\b/, /\bdatabase\b/, /\bpostgres\b/, /\bmysql\b/, /\bmongo\b/],
    deltaCents: 20_000,
    label: "Persistência em banco de dados",
  },
  {
    patterns: [/\bmobile\b/, /\bandroid\b/, /\bios\b/, /\baplicativo\b/, /\bapp nativo\b/],
    deltaCents: 70_000,
    label: "Versão mobile / app nativo",
  },
  {
    patterns: [/\btempo real\b/, /\brealtime\b/, /\bwebsocket\b/, /\bsse\b/],
    deltaCents: 35_000,
    label: "Tempo real (WebSocket / SSE)",
  },
  {
    patterns: [/\bia\b/, /\bai\b/, /\bllm\b/, /\bopenai\b/, /\bchatgpt\b/, /\bgemini\b/, /\bclaude\b/],
    deltaCents: 50_000,
    label: "Recursos com IA",
  },
  {
    patterns: [/\burgente\b/, /\burgencia\b/, /\basap\b/, /\bcurto prazo\b/],
    deltaCents: 40_000,
    label: "Prazo curto / urgência",
  },
  {
    patterns: [/\bblog\b/, /\bcms\b/, /\bartigo\b/],
    deltaCents: 20_000,
    label: "Blog / CMS",
  },
  {
    patterns: [/\bmulti tenant\b/, /\bmulti-tenant\b/, /\bmultiplos usuarios\b/, /\bvarios usuarios\b/, /\bequipe\b/],
    deltaCents: 40_000,
    label: "Multi-usuário / multi-tenant",
  },
  {
    patterns: [/\bnotificacao\b/, /\bemail\b/, /\bsms\b/, /\bpush\b/],
    deltaCents: 15_000,
    label: "Notificações (e-mail / push)",
  },
  {
    patterns: [/\brelatorio\b/, /\banalytics\b/, /\bgraficos\b/, /\bestatisticas\b/],
    deltaCents: 25_000,
    label: "Relatórios e gráficos",
  },
];

/**
 * Strip diacritics & lowercase for matching. Keeps the original text for
 * description-length scoring untouched.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function wordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function estimateQuote(
  category: Category,
  description: string,
): QuoteEstimate {
  const base = BASE_BY_CATEGORY[category] ?? BASE_BY_CATEGORY.other;
  const factors: QuoteFactor[] = [];

  const normalized = normalize(description);
  const words = wordCount(description);

  // Description length factor — longer briefings imply broader scope.
  // +R$ 50 per 50 words above 30, capped at +R$ 500.
  if (words > 30) {
    const extraBlocks = Math.min(10, Math.floor((words - 30) / 50));
    if (extraBlocks > 0) {
      factors.push({
        label: `Escopo detalhado (${words} palavras)`,
        deltaCents: extraBlocks * 5_000,
      });
    }
  }

  const seenLabels = new Set<string>();
  for (const rule of KEYWORD_RULES) {
    if (seenLabels.has(rule.label)) continue;
    if (rule.patterns.some((p) => p.test(normalized))) {
      seenLabels.add(rule.label);
      factors.push({ label: rule.label, deltaCents: rule.deltaCents });
    }
  }

  const sumDeltas = factors.reduce((acc, f) => acc + f.deltaCents, 0);
  const raw = base.base + sumDeltas;
  // Round to nearest R$ 50 (5_000 cents) for nicer pricing UX.
  const rounded = Math.round(raw / 5_000) * 5_000;
  const clamped = Math.min(MAX_CENTS, Math.max(MIN_CENTS, rounded));

  return {
    amountCents: clamped,
    baseCents: base.base,
    factors: [{ label: base.label, deltaCents: base.base }, ...factors],
  };
}

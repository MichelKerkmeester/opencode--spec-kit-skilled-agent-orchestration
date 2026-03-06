// ---------------------------------------------------------------
// MODULE: Response Hints Hook
// ---------------------------------------------------------------

import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';

interface HookResult {
  content?: Array<{ type?: string; text?: string }>;
  [key: string]: unknown;
}

interface AutoSurfacedContext {
  constitutional?: unknown[];
  triggered?: unknown[];
  surfaced_at?: string;
  latencyMs?: number;
}

type EnvelopeRecord = Record<string, unknown>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function ensureEnvelopeMeta(envelope: EnvelopeRecord): EnvelopeRecord {
  const meta = isRecord(envelope.meta) ? envelope.meta : {};
  envelope.meta = meta;
  return meta;
}

function syncEnvelopeTokenCount(envelope: EnvelopeRecord): number {
  const meta = ensureEnvelopeMeta(envelope);
  const currentTokenCount = meta.tokenCount;
  let previousCount = typeof currentTokenCount === 'number' && Number.isFinite(currentTokenCount)
    ? currentTokenCount
    : -1;

  // Converges in 2-3 iterations: token count changes the serialized length,
  // which changes the count. The 5-iteration cap is a safety bound.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const nextTokenCount = estimateTokenCount(JSON.stringify(envelope, null, 2));
    meta.tokenCount = nextTokenCount;
    if (nextTokenCount === previousCount) {
      return nextTokenCount;
    }
    previousCount = nextTokenCount;
  }

  return typeof meta.tokenCount === 'number' ? meta.tokenCount : 0;
}

// Extra JSON.stringify is intentional: syncEnvelopeTokenCount mutates the
// envelope in place and returns a number. Keeping that return type stable
// avoids a breaking API change across 10+ call sites.
function serializeEnvelopeWithTokenCount(envelope: EnvelopeRecord): string {
  syncEnvelopeTokenCount(envelope);
  return JSON.stringify(envelope, null, 2);
}

function appendAutoSurfaceHints(result: HookResult, autoSurfacedContext: AutoSurfacedContext): void {
  try {
    const rawText = result?.content?.[0]?.text;
    if (typeof rawText !== 'string' || rawText.length === 0) {
      return;
    }

    const envelope = JSON.parse(rawText) as unknown;
    if (!isRecord(envelope)) {
      return;
    }

    const hints = Array.isArray(envelope.hints)
      ? envelope.hints.filter((hint): hint is string => typeof hint === 'string')
      : [];
    envelope.hints = hints;

    const meta = ensureEnvelopeMeta(envelope);

    const constitutionalCount = Array.isArray(autoSurfacedContext?.constitutional)
      ? autoSurfacedContext.constitutional.length
      : 0;
    const triggeredCount = Array.isArray(autoSurfacedContext?.triggered)
      ? autoSurfacedContext.triggered.length
      : 0;

    if (constitutionalCount > 0 || triggeredCount > 0) {
      const latency = typeof autoSurfacedContext?.latencyMs === 'number'
        ? autoSurfacedContext.latencyMs
        : 0;
      hints.push(
        `Auto-surface hook: injected ${constitutionalCount} constitutional and ${triggeredCount} triggered memories (${latency}ms)`
      );
    }

    meta.autoSurface = {
      constitutionalCount,
      triggeredCount,
      surfaced_at: autoSurfacedContext?.surfaced_at ?? null,
      latencyMs: typeof autoSurfacedContext?.latencyMs === 'number' ? autoSurfacedContext.latencyMs : 0,
    };

    const firstContent = result.content?.[0];
    if (firstContent) {
      firstContent.text = serializeEnvelopeWithTokenCount(envelope);
    }
  } catch {
    // Non-throwing by design.
  }
}

export { appendAutoSurfaceHints, syncEnvelopeTokenCount, serializeEnvelopeWithTokenCount };

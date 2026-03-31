// ───────────────────────────────────────────────────────────────
// MODULE: Response Hints
// ───────────────────────────────────────────────────────────────
import { serializeEnvelopeWithTokenCount, syncEnvelopeTokenCount } from '../lib/response/envelope.js';

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

function readNumericField(record: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }
  return null;
}

function extractSurfacedTokenCount(result: HookResult, meta: EnvelopeRecord): number | null {
  const candidates = [
    result.usage,
    result,
    meta.usage,
    meta,
  ].filter(isRecord);

  const promptTokens = candidates
    .map((candidate) => readNumericField(candidate, ['promptTokens', 'prompt_tokens', 'inputTokens', 'input_tokens']))
    .find((value): value is number => value !== null) ?? null;
  const completionTokens = candidates
    .map((candidate) => readNumericField(candidate, ['completionTokens', 'completion_tokens', 'outputTokens', 'output_tokens']))
    .find((value): value is number => value !== null) ?? null;
  const cacheCreationTokens = candidates
    .map((candidate) => readNumericField(candidate, [
      'cacheCreationTokens',
      'cache_creation_tokens',
      'cacheCreationInputTokens',
      'cache_creation_input_tokens',
    ]))
    .find((value): value is number => value !== null) ?? null;
  const cacheReadTokens = candidates
    .map((candidate) => readNumericField(candidate, [
      'cacheReadTokens',
      'cache_read_tokens',
      'cacheReadInputTokens',
      'cache_read_input_tokens',
    ]))
    .find((value): value is number => value !== null) ?? null;
  const totalTokens = candidates
    .map((candidate) => readNumericField(candidate, ['totalTokens', 'total_tokens']))
    .find((value): value is number => value !== null) ?? null;

  if (
    promptTokens !== null ||
    completionTokens !== null ||
    cacheCreationTokens !== null ||
    cacheReadTokens !== null
  ) {
    return (promptTokens ?? 0) + (completionTokens ?? 0) + (cacheCreationTokens ?? 0) + (cacheReadTokens ?? 0);
  }

  return totalTokens;
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
    const surfacedTokenCount = extractSurfacedTokenCount(result, meta);

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
      ...(typeof surfacedTokenCount === 'number' ? { tokenCount: surfacedTokenCount } : {}),
    };

    const firstContent = result.content?.[0];
    if (firstContent) {
      firstContent.text = serializeEnvelopeWithTokenCount(envelope);
    }
  } catch (err: unknown) {
    console.warn(
      '[response-hints] appendAutoSurfaceHints failed:',
      err instanceof Error ? err.message : String(err)
    );
  }
}

export { appendAutoSurfaceHints, syncEnvelopeTokenCount, serializeEnvelopeWithTokenCount };

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
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

    const meta = isRecord(envelope.meta) ? envelope.meta : {};
    envelope.meta = meta;

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

    let serializedEnvelope = JSON.stringify(envelope, null, 2);
    meta.tokenCount = estimateTokenCount(serializedEnvelope);
    serializedEnvelope = JSON.stringify(envelope, null, 2);
    result.content![0].text = serializedEnvelope;
  } catch {
    // Non-throwing by design.
  }
}

export { appendAutoSurfaceHints };

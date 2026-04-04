import { serializeEnvelopeWithTokenCount, syncEnvelopeTokenCount } from '../lib/response/envelope.js';
interface HookResult {
    content?: Array<{
        type?: string;
        text?: string;
    }>;
    [key: string]: unknown;
}
interface AutoSurfacedContext {
    constitutional?: unknown[];
    triggered?: unknown[];
    surfaced_at?: string;
    latencyMs?: number;
}
declare function appendAutoSurfaceHints(result: HookResult, autoSurfacedContext: AutoSurfacedContext): void;
export { appendAutoSurfaceHints, syncEnvelopeTokenCount, serializeEnvelopeWithTokenCount };
//# sourceMappingURL=response-hints.d.ts.map
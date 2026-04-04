import type { RetrievalStage } from '@spec-kit/shared/contracts/retrieval-trace';
declare const RETRIEVAL_TRACE_STAGES: RetrievalStage[];
interface TelemetryTraceStagePayload {
    stage: RetrievalStage;
    timestamp: number;
    inputCount: number;
    outputCount: number;
    durationMs: number;
}
interface TelemetryTracePayload {
    traceId: string;
    totalDurationMs: number;
    finalResultCount: number;
    stages: TelemetryTraceStagePayload[];
}
declare function sanitizeRetrievalTracePayload(payload: unknown): TelemetryTracePayload | null;
declare function isTelemetryTracePayload(payload: unknown): payload is TelemetryTracePayload;
declare const isRetrievalTracePayload: typeof isTelemetryTracePayload;
declare const validateRetrievalTracePayload: typeof sanitizeRetrievalTracePayload;
export { RETRIEVAL_TRACE_STAGES, sanitizeRetrievalTracePayload, isRetrievalTracePayload, validateRetrievalTracePayload, };
/**
 * Re-exports related public types.
 */
export type { TelemetryTracePayload, TelemetryTraceStagePayload, };
//# sourceMappingURL=trace-schema.d.ts.map
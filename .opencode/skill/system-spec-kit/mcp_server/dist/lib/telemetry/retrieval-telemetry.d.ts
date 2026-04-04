import type { TelemetryTracePayload } from './trace-schema.js';
import type { SessionTransitionTrace } from '../search/session-transition.js';
import type { MemoryRoadmapCapabilityFlags, MemoryRoadmapPhase } from '../config/capability-flags.js';
/**
 * Extended telemetry controlled by env var (default: disabled for performance).
 * Set SPECKIT_EXTENDED_TELEMETRY=true to enable detailed retrieval metrics collection.
 */
declare function isExtendedTelemetryEnabled(): boolean;
/** Latency breakdown by retrieval stage */
interface LatencyMetrics {
    totalLatencyMs: number;
    candidateLatencyMs: number;
    fusionLatencyMs: number;
    rerankLatencyMs: number;
    boostLatencyMs: number;
}
/** Mode selection telemetry */
interface ModeMetrics {
    selectedMode: string | null;
    modeOverrideApplied: boolean;
    pressureLevel: string | null;
    tokenUsageRatio?: number;
}
/** Fallback telemetry */
interface FallbackMetrics {
    fallbackTriggered: boolean;
    fallbackReason?: string;
    degradedModeActive: boolean;
}
/** Quality proxy telemetry */
interface QualityMetrics {
    resultCount: number;
    avgRelevanceScore: number;
    topResultScore: number;
    boostImpactDelta: number;
    extractionCountInSession: number;
    qualityProxyScore: number;
}
/** Architecture rollout telemetry for phased memory-roadmap capabilities. */
interface ArchitectureMetrics {
    phase: MemoryRoadmapPhase;
    capabilities: MemoryRoadmapCapabilityFlags;
    scopeDimensionsTracked: number;
}
interface GraphHealthMetrics {
    killSwitchActive: boolean;
    causalBoosted: number;
    coActivationBoosted: number;
    communityInjected: number;
    graphSignalsBoosted: number;
    totalGraphInjected: number;
}
interface AdaptiveMetrics {
    mode: 'shadow' | 'promoted' | 'disabled';
    promotedCount: number;
    demotedCount: number;
    bounded: boolean;
    maxDeltaApplied: number;
}
interface GraphWalkDiagnostics {
    rolloutState: 'off' | 'trace_only' | 'bounded_runtime';
    rowsWithGraphContribution: number;
    rowsWithAppliedBonus: number;
    capAppliedCount: number;
    maxRaw: number;
    maxNormalized: number;
    maxAppliedBonus: number;
}
interface LifecycleForecastDiagnostics {
    state: string | null;
    progress: number;
    filesProcessed: number;
    filesTotal: number;
    etaSeconds: number | null;
    etaConfidence: number | null;
    failureRisk: number | null;
    riskSignals: string[];
    caveat?: string;
}
interface GraphHealthDashboardSummary {
    totalPayloads: number;
    payloadsWithGraphHealth: number;
    killSwitchActiveCount: number;
    averageGraphInjected: number;
    maxGraphInjected: number;
    causalBoostedTotal: number;
    coActivationBoostedTotal: number;
    communityInjectedTotal: number;
    graphSignalsBoostedTotal: number;
}
interface TraceSamplingOptions {
    limit?: number;
    minGraphInjected?: number;
    killSwitchOnly?: boolean;
}
interface SampledTracePayload {
    timestamp: string | null;
    graphHealth: GraphHealthMetrics;
    tracePayload: TelemetryTracePayload;
}
/** Full retrieval telemetry record */
interface RetrievalTelemetry {
    enabled: boolean;
    timestamp: string;
    latency: LatencyMetrics;
    mode: ModeMetrics;
    fallback: FallbackMetrics;
    quality: QualityMetrics;
    architecture: ArchitectureMetrics;
    graphHealth: GraphHealthMetrics;
    adaptive: AdaptiveMetrics;
    tracePayload?: TelemetryTracePayload;
    transitionDiagnostics?: SessionTransitionTrace;
    graphWalkDiagnostics?: GraphWalkDiagnostics;
    lifecycleForecastDiagnostics?: LifecycleForecastDiagnostics;
}
type LatencyStage = keyof Omit<LatencyMetrics, 'totalLatencyMs'>;
declare function createTelemetry(): RetrievalTelemetry;
declare function recordLatency(t: RetrievalTelemetry, stage: LatencyStage, ms: number): void;
declare function recordMode(t: RetrievalTelemetry, mode: string, override: boolean, pressure: string | null, tokenUsageRatio?: number): void;
declare function recordFallback(t: RetrievalTelemetry, reason?: string): void;
declare function recordQualityProxy(t: RetrievalTelemetry, results: Array<{
    score?: number;
    similarity?: number;
}>, boostDelta: number, extractionCount: number): void;
declare function recordTracePayload(t: RetrievalTelemetry, payload: unknown): boolean;
declare function recordTransitionDiagnostics(t: RetrievalTelemetry, transition?: SessionTransitionTrace): void;
declare function recordGraphWalkDiagnostics(t: RetrievalTelemetry, update: Partial<GraphWalkDiagnostics>): void;
declare function recordLifecycleForecastDiagnostics(t: RetrievalTelemetry, forecast: Record<string, unknown> | null | undefined, context?: {
    state?: string | null;
    progress?: number;
    filesProcessed?: number;
    filesTotal?: number;
}): void;
declare function recordArchitecturePhase(t: RetrievalTelemetry, update: {
    phase?: MemoryRoadmapPhase;
    capabilities?: Partial<MemoryRoadmapCapabilityFlags>;
    scopeDimensionsTracked?: number;
}): void;
declare function recordGraphHealth(t: RetrievalTelemetry, update: Partial<GraphHealthMetrics>): void;
declare function recordAdaptiveEvaluation(t: RetrievalTelemetry, update: Partial<AdaptiveMetrics>): void;
/**
 * Compute a 0-1 quality proxy score from the telemetry record.
 *
 * F6.06 fix: Delegates to the canonical eval-quality-proxy implementation
 * so eval metrics and live telemetry use the same formula. Telemetry-specific
 * constants (latency ceiling, count saturation) are passed as parameters.
 */
declare function computeQualityProxy(t: RetrievalTelemetry): number;
declare function summarizeGraphHealthDashboard(payloads: Array<RetrievalTelemetry | Record<string, unknown>>): GraphHealthDashboardSummary;
declare function sampleTracePayloads(payloads: Array<RetrievalTelemetry | Record<string, unknown>>, options?: TraceSamplingOptions): SampledTracePayload[];
declare function toJSON(t: RetrievalTelemetry): Record<string, unknown>;
export { isExtendedTelemetryEnabled, createTelemetry, recordLatency, recordMode, recordFallback, recordQualityProxy, recordTracePayload, recordTransitionDiagnostics, recordGraphWalkDiagnostics, recordLifecycleForecastDiagnostics, recordArchitecturePhase, recordGraphHealth, recordAdaptiveEvaluation, computeQualityProxy, summarizeGraphHealthDashboard, sampleTracePayloads, toJSON, };
/**
 * Re-exports related public types.
 */
export type { RetrievalTelemetry, LatencyMetrics, ModeMetrics, FallbackMetrics, QualityMetrics, ArchitectureMetrics, GraphHealthMetrics, AdaptiveMetrics, GraphWalkDiagnostics, LifecycleForecastDiagnostics, GraphHealthDashboardSummary, TraceSamplingOptions, SampledTracePayload, LatencyStage, };
//# sourceMappingURL=retrieval-telemetry.d.ts.map
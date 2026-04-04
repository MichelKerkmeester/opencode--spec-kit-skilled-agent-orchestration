import { type SharedPayloadEnvelope } from '../context/shared-payload.js';
/** Compact startup summary for the locally indexed code graph. */
export interface StartupGraphSummary {
    files: number;
    nodes: number;
    edges: number;
    lastScan: string | null;
}
/** Startup brief payload returned to hook-capable runtimes at session start. */
export interface StartupBriefResult {
    graphOutline: string | null;
    sessionContinuity: string | null;
    graphSummary: StartupGraphSummary | null;
    graphState: 'ready' | 'stale' | 'empty' | 'missing';
    cocoIndexAvailable: boolean;
    startupSurface: string;
    sharedPayload: SharedPayloadEnvelope | null;
}
/** Build the startup brief used by runtime hooks and transport startup digests. */
export declare function buildStartupBrief(highlightCount?: number): StartupBriefResult;
//# sourceMappingURL=startup-brief.d.ts.map
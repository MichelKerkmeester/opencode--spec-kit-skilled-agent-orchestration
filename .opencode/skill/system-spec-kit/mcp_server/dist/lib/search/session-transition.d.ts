export declare const SESSION_TRANSITION_SIGNAL_ORDER: readonly ["session-resume", "pressure-override", "explicit-mode", "query-heuristic", "intent-classifier"];
export type SessionTransitionSignal = (typeof SESSION_TRANSITION_SIGNAL_ORDER)[number];
export interface SessionTransitionTrace {
    previousState: string | null;
    currentState: string | null;
    confidence: number;
    signalSources: SessionTransitionSignal[];
    reason?: string | null;
}
interface SessionTransitionBuildArgs {
    previousState: string | null;
    resumedSession: boolean;
    effectiveMode: string;
    requestedMode: string;
    detectedIntent: string | null;
    pressureOverrideApplied: boolean;
    queryHeuristicApplied: boolean;
}
export declare function buildSessionTransitionTrace(args: SessionTransitionBuildArgs): SessionTransitionTrace;
export declare function readSessionTransitionTrace(value: unknown): SessionTransitionTrace | null;
type TraceAttachable = {
    content?: Array<{
        text?: string;
        type?: string;
    }>;
};
export declare function attachSessionTransitionTrace<T extends TraceAttachable>(response: T, sessionTransition?: SessionTransitionTrace): T;
export {};
//# sourceMappingURL=session-transition.d.ts.map
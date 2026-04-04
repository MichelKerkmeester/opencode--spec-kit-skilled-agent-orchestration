import type { SharedPayloadEnvelope } from '../../lib/context/shared-payload.js';
/** Per-session hook state persisted to temp directory */
export interface HookState {
    claudeSessionId: string;
    speckitSessionId: string;
    lastSpecFolder: string | null;
    sessionSummary: {
        text: string;
        extractedAt: string;
    } | null;
    pendingCompactPrime: {
        payload: string;
        cachedAt: string;
        payloadContract?: SharedPayloadEnvelope | null;
    } | null;
    metrics: {
        estimatedPromptTokens: number;
        estimatedCompletionTokens: number;
        lastTranscriptOffset: number;
    };
    createdAt: string;
    updatedAt: string;
}
/** SHA-256 hash of cwd, first 12 chars */
export declare function getProjectHash(): string;
/** Get the state file path for a session */
export declare function getStatePath(sessionId: string): string;
/** Ensure the state directory exists */
export declare function ensureStateDir(): void;
/** Load state for a session. Returns null if not found. */
export declare function loadState(sessionId: string): HookState | null;
/**
 * Load the most recently updated hook state file for this project.
 * Returns null when no state exists or the newest state is older than maxAgeMs.
 */
export declare function loadMostRecentState(maxAgeMs?: number): HookState | null;
/** Save state atomically (write to .tmp then rename) */
export declare function saveState(sessionId: string, state: HookState): boolean;
/** Read pending compact prime without clearing it from state */
export declare function readCompactPrime(sessionId: string): HookState['pendingCompactPrime'];
/** Clear pending compact prime from state (call after stdout write confirmed) */
export declare function clearCompactPrime(sessionId: string): void;
/**
 * Read pending compact prime, clear it from state, and return the cached value.
 * @deprecated Use readCompactPrime() + clearCompactPrime() to avoid data loss
 * if the process crashes between clear and stdout write.
 */
export declare function readAndClearCompactPrime(sessionId: string): HookState['pendingCompactPrime'];
/** Load, merge patch, save, and return updated state */
export declare function updateState(sessionId: string, patch: Partial<HookState>): HookState;
/** Remove state files older than maxAgeMs. Returns count removed. */
export declare function cleanStaleStates(maxAgeMs: number): number;
//# sourceMappingURL=hook-state.d.ts.map
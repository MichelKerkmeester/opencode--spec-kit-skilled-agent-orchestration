/** Supported runtime identifiers */
export type RuntimeId = 'claude-code' | 'codex-cli' | 'copilot-cli' | 'gemini-cli' | 'unknown';
/** Hook policy for the detected runtime */
export type HookPolicy = 'enabled' | 'disabled_by_scope' | 'unavailable' | 'unknown';
/** Runtime detection result */
export interface RuntimeInfo {
    runtime: RuntimeId;
    hookPolicy: HookPolicy;
}
/** Detect the current runtime from environment variables and process context */
export declare function detectRuntime(): RuntimeInfo;
/** Check if hooks are available for the current runtime */
export declare function areHooksAvailable(): boolean;
/** Get the recommended context recovery approach for the current runtime */
export declare function getRecoveryApproach(): 'hooks' | 'tool_fallback';
//# sourceMappingURL=runtime-detection.d.ts.map
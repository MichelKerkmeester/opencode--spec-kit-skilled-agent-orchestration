/** Runtime fixture describing a specific runtime's hook capabilities */
export interface RuntimeFixture {
    runtime: 'claude-code' | 'codex-cli' | 'copilot-cli' | 'gemini-cli';
    hookPolicy: 'enabled' | 'disabled_by_scope' | 'unavailable';
    supports: {
        sessionStartHook: boolean;
        preCompactHook: boolean;
        stopHook: boolean;
        toolFallback: boolean;
    };
}
/** Create a runtime fixture for the given runtime */
export declare function createRuntimeFixture(runtime: RuntimeFixture['runtime']): RuntimeFixture;
/** Set up environment variables to simulate a specific runtime */
export declare function setRuntimeEnv(runtime: RuntimeFixture['runtime']): void;
/** Restore original environment (call in afterEach) */
export declare function clearRuntimeEnv(): void;
//# sourceMappingURL=runtime-fixtures.d.ts.map
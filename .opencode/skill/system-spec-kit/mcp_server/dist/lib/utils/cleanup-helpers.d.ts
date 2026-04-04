/** Run a shutdown cleanup step and log failures without aborting the sequence. */
export declare function runCleanupStep(label: string, cleanupFn: () => void): void;
/** Await a shutdown cleanup step and log failures without aborting the sequence. */
export declare function runAsyncCleanupStep(label: string, cleanupFn: () => Promise<void>): Promise<void>;
//# sourceMappingURL=cleanup-helpers.d.ts.map
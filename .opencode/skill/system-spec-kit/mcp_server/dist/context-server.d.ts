import { type RuntimeInfo } from './lib/code-graph/runtime-detection.js';
import { runCleanupStep, runAsyncCleanupStep } from './lib/utils/cleanup-helpers.js';
type AfterToolCallback = (tool: string, callId: string, result: unknown) => Promise<void>;
export declare function getDetectedRuntime(): RuntimeInfo | null;
declare function normalizeGraphFilePath(value: string): string | null;
declare function extractFilePathsFromToolArgs(args: unknown): string[];
/** Register a callback to be invoked asynchronously after each tool call completes. */
export declare function registerAfterToolCallback(fn: AfterToolCallback): void;
export declare const __testables: {
    runCleanupStep: typeof runCleanupStep;
    runAsyncCleanupStep: typeof runAsyncCleanupStep;
    main: () => Promise<void>;
    normalizeGraphFilePath: typeof normalizeGraphFilePath;
    extractFilePathsFromToolArgs: typeof extractFilePathsFromToolArgs;
};
export {};
//# sourceMappingURL=context-server.d.ts.map
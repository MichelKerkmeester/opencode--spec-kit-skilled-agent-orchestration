import type { MutationHookResult } from '../handlers/memory-crud-types.js';
declare function buildMutationHookFeedback(operation: string, hookResult: MutationHookResult): {
    data: {
        operation: string;
        latencyMs: number;
        triggerCacheCleared: boolean;
        constitutionalCacheCleared: boolean;
        graphSignalsCacheCleared: boolean;
        coactivationCacheCleared: boolean;
        toolCacheInvalidated: number;
        errors: string[];
    };
    hints: string[];
};
export { buildMutationHookFeedback };
//# sourceMappingURL=mutation-feedback.d.ts.map
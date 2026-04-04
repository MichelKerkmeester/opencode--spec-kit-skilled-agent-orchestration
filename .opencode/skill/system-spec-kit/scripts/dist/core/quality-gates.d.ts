import type { ValidationDispositionResult } from '../lib/validate-memory-quality';
import { type MemorySufficiencyResult } from '@spec-kit/shared/parsing/memory-sufficiency';
export declare function shouldIndexMemory(options: {
    ctxFileWritten: boolean;
    validationDisposition: ValidationDispositionResult;
    templateContractValid: boolean;
    sufficiencyPass: boolean;
    qualityScore01: number;
    qualityAbortThreshold: number;
}): {
    shouldIndex: boolean;
    reason?: string;
};
export declare function formatSufficiencyAbort(result: MemorySufficiencyResult): string;
//# sourceMappingURL=quality-gates.d.ts.map
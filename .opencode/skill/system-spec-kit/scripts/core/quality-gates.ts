// ───────────────────────────────────────────────────────────────
// MODULE: Quality Gates
// ───────────────────────────────────────────────────────────────
// Memory indexing decision logic and sufficiency abort formatting.
// Extracted from workflow.ts to reduce module size.

import type { ValidationDispositionResult } from '../lib/validate-memory-quality';
import {
  MEMORY_SUFFICIENCY_REJECTION_CODE,
  type MemorySufficiencyResult,
} from '@spec-kit/shared/parsing/memory-sufficiency';

// ───────────────────────────────────────────────────────────────
// 1. FUNCTIONS
// ───────────────────────────────────────────────────────────────

export function shouldIndexMemory(options: {
  ctxFileWritten: boolean;
  validationDisposition: ValidationDispositionResult;
  templateContractValid: boolean;
  sufficiencyPass: boolean;
  qualityScore01: number;
  qualityAbortThreshold: number;
}): { shouldIndex: boolean; reason?: string } {
  if (!options.ctxFileWritten) {
    return {
      shouldIndex: false,
      reason: 'Context file content matched an existing memory file, so semantic indexing was skipped.',
    };
  }

  if (!options.templateContractValid) {
    return {
      shouldIndex: false,
      reason: 'Rendered memory failed the template contract, so semantic indexing was skipped.',
    };
  }

  if (!options.sufficiencyPass) {
    return {
      shouldIndex: false,
      reason: 'Rendered memory failed semantic sufficiency, so semantic indexing was skipped.',
    };
  }

  if (options.qualityScore01 < options.qualityAbortThreshold) {
    return {
      shouldIndex: false,
      reason: 'Rendered memory fell below the minimum quality threshold, so semantic indexing was skipped.',
    };
  }

  if (options.validationDisposition.disposition === 'write_skip_index') {
    return {
      shouldIndex: false,
      reason: `Validation rules require write-only persistence without semantic indexing: ${options.validationDisposition.indexBlockingRuleIds.join(', ')}`,
    };
  }

  if (options.validationDisposition.disposition === 'abort_write') {
    return {
      shouldIndex: false,
      reason: `Validation rules block writing and indexing: ${options.validationDisposition.blockingRuleIds.join(', ')}`,
    };
  }

  return { shouldIndex: true };
}

export function formatSufficiencyAbort(result: MemorySufficiencyResult): string {
  return `${MEMORY_SUFFICIENCY_REJECTION_CODE}: Not enough context for a proper memory. `
    + `${result.reasons.join(' ')} `
    + `Evidence counts: primary=${result.evidenceCounts.primary}, `
    + `support=${result.evidenceCounts.support}, total=${result.evidenceCounts.total}, `
    + `semanticChars=${result.evidenceCounts.semanticChars}, uniqueWords=${result.evidenceCounts.uniqueWords}.`;
}

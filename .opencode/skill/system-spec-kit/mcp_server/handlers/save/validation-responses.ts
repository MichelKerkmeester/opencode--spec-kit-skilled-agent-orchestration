// ───────────────────────────────────────────────────────────────
// MODULE: Validation Responses
// ───────────────────────────────────────────────────────────────
// Pure builder functions that construct rejection/dry-run results
// from validation outcomes. No side effects or DB access.

import type {
  MemorySufficiencyResult,
} from '@spec-kit/shared/parsing/memory-sufficiency';
import { MEMORY_SUFFICIENCY_REJECTION_CODE } from '@spec-kit/shared/parsing/memory-sufficiency';
import type {
  MemoryTemplateContractResult,
} from '@spec-kit/shared/parsing/memory-template-contract';
import type { QualityLoopResult } from '../../handlers/quality-loop.js';
import type { IndexResult, ParsedMemory } from './types.js';
import type { ParsedMemoryValidation } from '../../lib/parsing/memory-parser.js';

// Feature catalog: Dry-run preflight for memory_save
// Feature catalog: Verify-fix-verify memory quality loop
// Feature catalog: Validation feedback (memory_validate)

function applyInsufficiencyMetadata(
  parsed: ParsedMemory,
  sufficiencyResult: MemorySufficiencyResult,
): void {
  if (!sufficiencyResult.pass) {
    parsed.qualityScore = Math.min(parsed.qualityScore ?? 1, sufficiencyResult.score * 0.6);
    parsed.qualityFlags = Array.from(new Set([...(parsed.qualityFlags || []), 'has_insufficient_context']));
  }
}

function buildInsufficiencyRejectionResult(
  parsed: ParsedMemory,
  validation: ParsedMemoryValidation,
  sufficiencyResult: MemorySufficiencyResult,
): IndexResult {
  return {
    status: 'rejected',
    id: 0,
    specFolder: parsed.specFolder,
    title: parsed.title ?? '',
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    qualityScore: parsed.qualityScore,
    qualityFlags: parsed.qualityFlags,
    warnings: validation.warnings,
    rejectionCode: MEMORY_SUFFICIENCY_REJECTION_CODE,
    rejectionReason: `${MEMORY_SUFFICIENCY_REJECTION_CODE}: ${sufficiencyResult.reasons.join(' ')}`,
    message: 'Not enough context for a proper memory.',
    sufficiency: sufficiencyResult,
  };
}

function buildTemplateContractRejectionResult(
  parsed: ParsedMemory,
  validation: ParsedMemoryValidation,
  templateContract: MemoryTemplateContractResult,
): IndexResult {
  const violationSummary = templateContract.violations.map((violation) => violation.code).join(', ');
  return {
    status: 'rejected',
    id: 0,
    specFolder: parsed.specFolder,
    title: parsed.title ?? '',
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    qualityScore: parsed.qualityScore,
    qualityFlags: Array.from(new Set([...(parsed.qualityFlags || []), 'violates_template_contract'])),
    warnings: validation.warnings,
    rejectionReason: `Template contract validation failed: ${violationSummary}`,
    message: 'Memory file does not match the required template contract.',
  };
}

function buildDryRunSummary(
  sufficiencyResult: MemorySufficiencyResult,
  qualityLoopResult: QualityLoopResult,
  templateContract: MemoryTemplateContractResult,
): string {
  if (!qualityLoopResult.passed && qualityLoopResult.rejected) {
    return qualityLoopResult.rejectionReason ?? 'Quality loop rejected the save';
  }

  if (!templateContract.valid) {
    return 'Dry-run detected structural template-contract violations';
  }

  if (!sufficiencyResult.pass) {
    return 'Dry-run detected insufficient context for a durable memory';
  }

  return 'Dry-run validation passed';
}

export {
  applyInsufficiencyMetadata,
  buildInsufficiencyRejectionResult,
  buildTemplateContractRejectionResult,
  buildDryRunSummary,
};

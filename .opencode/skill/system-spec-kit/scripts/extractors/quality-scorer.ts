// ───────────────────────────────────────────────────────────────
// MODULE: Quality Scorer
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. QUALITY SCORER
// ───────────────────────────────────────────────────────────────
// Computes deterministic quality score and flags for rendered memories

import type {
  QualityDimensionScore,
  QualityFlag,
  QualityScoreResult,
} from '../types/session-types';
import type { ContaminationSeverity } from './contamination-filter';
import { VALIDATION_RULE_METADATA, type QualityRuleId, type ValidationRuleSeverity } from '../lib/validate-memory-quality';

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES & CONSTANTS
------------------------------------------------------------------*/

interface ValidationSignal {
  ruleId: QualityRuleId;
  passed: boolean;
}

interface QualityInputs {
  content: string;
  validatorSignals?: ValidationSignal[];
  hadContamination?: boolean;
  contaminationSeverity?: ContaminationSeverity | null;
  messageCount?: number;
  toolCount?: number;
  decisionCount?: number;
  sufficiencyScore?: number;
  insufficientContext?: boolean;
}

const QUALITY_RULE_IDS: QualityRuleId[] = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14'];

// O2-9: Weight penalties by V-rule severity instead of flat rate
// Recalibrated (Phase 002): five simultaneous MEDIUM failures → ~0.85 (meaningfully below 0.90).
// HIGH rules (V1, V3, V8, V9, V11, V13) block writes upstream so rarely reach the scorer;
// they carry a larger penalty to reflect their critical nature when they do.
const PENALTY_BY_SEVERITY: Record<ValidationRuleSeverity, number> = {
  high: 0.10,
  medium: 0.03,
  low: 0.01,
};

/* ───────────────────────────────────────────────────────────────
   2. QUALITY SCORING
------------------------------------------------------------------*/

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function buildRuleDimensions(validatorSignals: ValidationSignal[]): QualityDimensionScore[] {
  return QUALITY_RULE_IDS.map((ruleId) => {
    const signal = validatorSignals.find((entry) => entry.ruleId === ruleId);
    const passed = signal?.passed ?? true;
    return {
      id: ruleId,
      score01: passed ? 1 : 0,
      score100: passed ? 100 : 0,
      maxScore100: 100,
      passed,
    };
  });
}

function scoreMemoryQuality(inputs: QualityInputs): QualityScoreResult {
  const {
    content,
    validatorSignals = [],
    hadContamination = false,
    contaminationSeverity = null,
    messageCount = 0,
    toolCount = 0,
    sufficiencyScore,
    insufficientContext = false,
  } = inputs;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    const emptyContentFlags: QualityFlag[] = [
      'has_placeholders',
      'has_fallback_decision',
      'sparse_semantic_fields',
    ];
    if (hadContamination) {
      emptyContentFlags.push('has_contamination');
    }

    return {
      score: 0,
      score01: 0,
      score100: 0,
      qualityScore: 0,
      warnings: ['No rendered content was available for quality scoring.'],
      qualityFlags: emptyContentFlags,
      hadContamination,
      dimensions: buildRuleDimensions(validatorSignals),
      insufficiency: null,
    };
  }

  let qualityScore = 1.0;
  const qualityFlags = new Set<QualityFlag>();
  const warnings: string[] = [];
  let sufficiencyCap: number | null = null;

  const failedRules = validatorSignals.filter((signal) => !signal.passed);
  // O2-9: Sum severity-weighted penalties instead of flat rate
  const totalPenalty = failedRules.reduce((sum, failed) => {
    const metadata = VALIDATION_RULE_METADATA[failed.ruleId as keyof typeof VALIDATION_RULE_METADATA];
    const severity: ValidationRuleSeverity = metadata?.severity ?? 'medium';
    return sum + (PENALTY_BY_SEVERITY[severity] ?? PENALTY_BY_SEVERITY.medium);
  }, 0);
  qualityScore -= totalPenalty;

  for (const failed of failedRules) {
    if (failed.ruleId === 'V1' || failed.ruleId === 'V2') {
      qualityFlags.add('has_placeholders');
    }
    if (failed.ruleId === 'V4') {
      qualityFlags.add('has_fallback_decision');
    }
    if (failed.ruleId === 'V5') {
      qualityFlags.add('sparse_semantic_fields');
    }
    if (failed.ruleId === 'V6') {
      qualityFlags.add('has_placeholders');
    }
    if (failed.ruleId === 'V7') {
      qualityFlags.add('has_tool_state_mismatch');
    }
    if (failed.ruleId === 'V8') {
      qualityFlags.add('has_spec_relevance_mismatch');
    }
    if (failed.ruleId === 'V9') {
      qualityFlags.add('has_contaminated_title');
    }
    if (failed.ruleId === 'V10') {
      qualityFlags.add('has_session_source_mismatch');
    }
    if (failed.ruleId === 'V11') {
      qualityFlags.add('has_error_content');
    }
    // O2-2: Add V3 and V12 flag mappings
    if (failed.ruleId === 'V3') {
      qualityFlags.add('has_malformed_spec_folder');
    }
    if (failed.ruleId === 'V12') {
      qualityFlags.add('has_topical_mismatch');
    }
  }

  if (hadContamination) {
    qualityFlags.add('has_contamination');
    const severity = contaminationSeverity || 'medium';
    if (severity === 'low') {
      warnings.push('Low-severity contamination detected (preamble only) — score penalty applied');
    } else if (severity === 'medium') {
      sufficiencyCap = Math.min(sufficiencyCap ?? 1, 0.85);
      warnings.push('Medium-severity contamination detected (orchestration chatter) — capped at 0.85');
    } else {
      sufficiencyCap = Math.min(sufficiencyCap ?? 1, 0.6);
      warnings.push('High-severity contamination detected (AI self-reference/tool leaks) — capped at 0.60');
    }
  }

  const normalizedSufficiencyScore = typeof sufficiencyScore === 'number' && Number.isFinite(sufficiencyScore)
    ? clamp01(sufficiencyScore)
    : null;
  if (normalizedSufficiencyScore !== null) {
    // Preserve any existing cap (e.g. contamination 0.6) as a ceiling
    sufficiencyCap = Math.min(sufficiencyCap ?? 1, normalizedSufficiencyScore);
    qualityScore = Math.min(qualityScore, sufficiencyCap);
  }

  if (insufficientContext) {
    qualityFlags.add('has_insufficient_context');
    // O2-7: Use Math.min to preserve any stricter existing cap (e.g. contamination 0.6)
    sufficiencyCap = Math.min(sufficiencyCap ?? 1, normalizedSufficiencyScore !== null ? normalizedSufficiencyScore * 0.6 : 0.35);
    qualityScore = Math.min(qualityScore, sufficiencyCap);
  }

  // P3-4: minimum_message_ratio — flag sessions with disproportionately low message count
  if (toolCount > 10 && messageCount > 0 && (messageCount / toolCount) < 0.05) {
    qualityFlags.add('insufficient_capture');
    qualityScore -= 0.15;
  }

  // Phase 002: Bonus additions removed. Base score is 1.0; only penalties and caps apply.
  // Prior bonuses (+0.05 messages, +0.05 tools, +0.10 decisions) masked up to 5 simultaneous
  // soft failures, making quality_score effectively binary. Removed to restore discriminative power.

  // O2-3: Contamination penalty uses cap only (not cap + subtraction)
  // The cap at the contamination block above is sufficient; double-counting removed

  if (sufficiencyCap !== null) {
    qualityScore = Math.min(qualityScore, sufficiencyCap);
  }

  qualityScore = clamp01(qualityScore);

  return {
    score: Math.round(qualityScore * 100),
    score01: qualityScore,
    score100: Math.round(qualityScore * 100),
    qualityScore,
    warnings,
    qualityFlags: [...qualityFlags],
    hadContamination,
    dimensions: buildRuleDimensions(validatorSignals),
    insufficiency: normalizedSufficiencyScore !== null || insufficientContext ? {
      pass: !insufficientContext,
      score01: normalizedSufficiencyScore,
      reasons: insufficientContext ? ['Insufficient context flag set during rendered-memory quality scoring.'] : [],
    } : null,
  };
}

/* ───────────────────────────────────────────────────────────────
   3. EXPORTS
------------------------------------------------------------------*/

export {
  scoreMemoryQuality,
};

export type {
  QualityFlag,
  QualityInputs,
  QualityScoreResult,
  ValidationSignal,
};

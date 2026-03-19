// ---------------------------------------------------------------
// MODULE: Quality Scorer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. QUALITY SCORER
// ───────────────────────────────────────────────────────────────
// Computes deterministic quality score and flags for rendered memories

import type {
  QualityDimensionScore,
  QualityFlag,
  QualityScoreResult,
} from '../core/quality-scorer';
import type { ContaminationSeverity } from './contamination-filter';

type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9' | 'V10' | 'V11';

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

const QUALITY_RULE_IDS: QualityRuleId[] = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11'];

const PENALTY_PER_FAILED_RULE = 0.25;

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
    decisionCount = 0,
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
  qualityScore -= failedRules.length * PENALTY_PER_FAILED_RULE;

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
  }

  if (hadContamination) {
    qualityFlags.add('has_contamination');
    const severity = contaminationSeverity || 'medium';
    if (severity === 'low') {
      warnings.push('Low-severity contamination detected (preamble only) — penalty applied post-bonus');
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
    sufficiencyCap = normalizedSufficiencyScore !== null ? normalizedSufficiencyScore * 0.6 : 0.35;
    qualityScore = Math.min(qualityScore, sufficiencyCap);
  }

  if (messageCount > 0) {
    qualityScore += 0.05;
  }

  if (toolCount > 0) {
    qualityScore += 0.05;
  }

  if (decisionCount >= 1) {
    qualityScore += 0.10;
  }

  // Apply contamination penalty AFTER bonuses so bonuses cannot offset it
  if (hadContamination) {
    const severity = contaminationSeverity || 'medium';
    if (severity === 'low') {
      qualityScore -= 0.10;
    } else if (severity === 'medium') {
      qualityScore -= 0.20;
    } else {
      qualityScore -= 0.30;
    }
  }

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

export {
  scoreMemoryQuality,
};

export type {
  QualityFlag,
  QualityInputs,
  QualityScoreResult,
  ValidationSignal,
};

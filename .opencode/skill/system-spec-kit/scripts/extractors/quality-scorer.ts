// ---------------------------------------------------------------
// MODULE: Quality Scorer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. QUALITY SCORER
// ───────────────────────────────────────────────────────────────
// Computes deterministic quality score and flags for rendered memories

type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9';

type QualityFlag =
  | 'has_placeholders'
  | 'has_fallback_decision'
  | 'has_contamination'
  | 'sparse_semantic_fields'
  | 'has_tool_state_mismatch'
  | 'has_spec_relevance_mismatch'
  | 'has_contaminated_title'
  | 'has_insufficient_context';

interface ValidationSignal {
  ruleId: QualityRuleId;
  passed: boolean;
}

interface QualityInputs {
  content: string;
  validatorSignals?: ValidationSignal[];
  hadContamination?: boolean;
  messageCount?: number;
  toolCount?: number;
  decisionCount?: number;
  sufficiencyScore?: number;
  insufficientContext?: boolean;
}

interface QualityResult {
  qualityScore: number;
  qualityFlags: QualityFlag[];
}

const PENALTY_PER_FAILED_RULE = 0.25;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function scoreMemoryQuality(inputs: QualityInputs): QualityResult {
  const {
    content,
    validatorSignals = [],
    hadContamination = false,
    messageCount = 0,
    toolCount = 0,
    decisionCount = 0,
    sufficiencyScore,
    insufficientContext = false,
  } = inputs;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return {
      qualityScore: 0,
      qualityFlags: [
        'has_placeholders',
        'has_fallback_decision',
        'has_contamination',
        'sparse_semantic_fields',
      ],
    };
  }

  let qualityScore = 1.0;
  const qualityFlags = new Set<QualityFlag>();
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
  }

  if (hadContamination) {
    qualityFlags.add('has_contamination');
  }

  const normalizedSufficiencyScore = typeof sufficiencyScore === 'number' && Number.isFinite(sufficiencyScore)
    ? clamp01(sufficiencyScore)
    : null;
  if (normalizedSufficiencyScore !== null) {
    sufficiencyCap = normalizedSufficiencyScore;
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

  if (sufficiencyCap !== null) {
    qualityScore = Math.min(qualityScore, sufficiencyCap);
  }

  qualityScore = clamp01(qualityScore);

  return {
    qualityScore,
    qualityFlags: [...qualityFlags],
  };
}

export {
  scoreMemoryQuality,
};

export type {
  QualityFlag,
  QualityInputs,
  QualityResult,
  ValidationSignal,
};

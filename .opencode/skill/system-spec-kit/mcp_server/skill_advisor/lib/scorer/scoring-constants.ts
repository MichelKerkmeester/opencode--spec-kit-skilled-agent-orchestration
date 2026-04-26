// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Scorer Calibration Constants
// ───────────────────────────────────────────────────────────────
// Single source of truth for the numeric tuning constants used by
// `lib/scorer/fusion.ts` (`confidenceFor`, `uncertaintyFor`, and
// `primaryIntentBonus`). The scorer-calibration bench
// (`bench/scorer-calibration.bench.ts`) treats these values as the
// "tuned" surface — naming them here lets a calibration pass be diffed
// in PRs and rolled back in one place.
//
// IMPORTANT: This refactor MUST be byte-equivalent to the prior inline
// numerics. Tweaking any value here is a behavior change, not a refactor.

/**
 * Confidence-assembly knobs used by `confidenceFor` in `fusion.ts`.
 */
export interface ConfidenceCalibration {
  /** Floor confidence assigned to read-only explainer prompts that target the
   * advisor itself, OR read-only explainer prompts where the read-only route
   * is not allow-listed. */
  readonly readOnlyExplainerFloor: number;
  /** Base term added to the live-normalized confidence ramp. */
  readonly baseConstant: number;
  /** Multiplier applied to `liveNormalized` before clipping at 1.0. */
  readonly liveNormalizedRampGain: number;
  /** Coefficient on the ramp output that decides how much live-evidence
   * pressure can lift base confidence. */
  readonly liveNormalizedRampCoefficient: number;
  /** When `readOnlyRouteAllowed` is true, base confidence is lifted to at
   * least this value before rounding. */
  readonly readOnlyRouteAllowedFloor: number;
  /** When the derived lane dominates and direct evidence is below the
   * `derivedDominantDirectScoreCeiling`, confidence is pinned to this value. */
  readonly derivedDominantConfidence: number;
  /** Maximum direct score still considered "low direct evidence" for the
   * derived-dominant short-circuit. */
  readonly derivedDominantDirectScoreCeiling: number;
  /** Boosted confidence for `sk-deep-research` when the prompt carries
   * deep-research-cycle intent and `liveNormalized` clears the floor. */
  readonly deepResearchCycleSkillConfidence: number;
  /** `liveNormalized` floor that the deep-research-cycle short-circuit
   * requires before applying the boost above. */
  readonly deepResearchCycleLiveNormalizedFloor: number;
  /** Direct-score floor that, when paired with task-intent, lifts confidence
   * to at least the task-intent floor. */
  readonly taskIntentDirectScoreFloor: number;
  /** Live-normalized floor that, when paired with task-intent, lifts
   * confidence to at least the task-intent floor. */
  readonly taskIntentLiveNormalizedFloor: number;
  /** Confidence floor applied when task-intent is met. */
  readonly taskIntentFloor: number;
  /** Direct score above which confidence is lifted to at least the
   * `directScoreFloor` (regardless of task-intent). */
  readonly directScoreLiftThreshold: number;
  /** Confidence floor applied to high-direct-score prompts. */
  readonly directScoreFloor: number;
  /** Direct-score threshold above which a fixed bonus is added to the base
   * confidence (without forcing the floor). */
  readonly directScoreBonusThreshold: number;
  /** Bonus added when the direct score clears `directScoreBonusThreshold`. */
  readonly directScoreBonus: number;
  /** Hard ceiling on the final assembled confidence value. */
  readonly hardCeiling: number;
}

/**
 * Uncertainty-assembly knobs used by `uncertaintyFor` in `fusion.ts`.
 */
export interface UncertaintyCalibration {
  /** Default uncertainty when no evidence is observed. */
  readonly noEvidenceDefault: number;
  /** Evidence count that drops uncertainty to the low floor. */
  readonly highEvidenceCount: number;
  /** Uncertainty applied at and above the high evidence count. */
  readonly lowFloor: number;
  /** Evidence count for the medium uncertainty band. */
  readonly mediumEvidenceCount: number;
  /** Uncertainty applied at the medium evidence band. */
  readonly mediumFloor: number;
  /** Evidence count for the elevated uncertainty band. */
  readonly someEvidenceCount: number;
  /** Uncertainty applied at the elevated band. */
  readonly elevatedFloor: number;
  /** Direct evidence threshold that triggers an uncertainty discount. */
  readonly directEvidenceDiscountThreshold: number;
  /** Discount applied when direct evidence clears the threshold. */
  readonly directEvidenceDiscount: number;
  /** Confidence threshold below which an uncertainty penalty is applied. */
  readonly lowConfidencePenaltyThreshold: number;
  /** Penalty added when confidence falls below the threshold. */
  readonly lowConfidencePenalty: number;
  /** Hard floor on the final uncertainty value. */
  readonly hardFloor: number;
  /** Hard ceiling on the final uncertainty value. */
  readonly hardCeiling: number;
}

/**
 * Per-skill routing biases applied by `primaryIntentBonus` in `fusion.ts`.
 *
 * Naming convention: `<intent>SkillBonus` for positive (upweight) terms,
 * `<intent>SkillPenalty` for negative (downweight) terms. The leading
 * `routing.` namespace keeps the calibration surface scannable as a single
 * block per call site.
 */
export interface RoutingCalibration {
  // semantic search intent
  readonly semanticSearchCocoIndexBonus: number;
  readonly semanticSearchDeepResearchPenalty: number;
  // deep-review intent
  readonly deepReviewSkDeepReviewBonus: number;
  readonly deepReviewSkCodeReviewPenalty: number;
  // deep-research intent (text-only)
  readonly deepResearchSkDeepResearchBonus: number;
  readonly deepResearchOtherSkillsPenalty: number;
  // deep-research-cycle phrase intent
  readonly deepResearchCycleSkDeepResearchBonus: number;
  readonly deepResearchCycleOtherSkillsPenalty: number;
  // compare/audit/review + classifier-vocabulary intent
  readonly compareAuditCodeReviewBonus: number;
  readonly compareAuditCodeOpenCodePenalty: number;
  // corpus/predictions/continuation/study-config intent
  readonly corpusStudySpecKitBonus: number;
  readonly corpusStudyOtherSkillsPenalty: number;
  // explicit slash-command bonuses
  readonly slashCommandDeepResearchBonus: number;
  readonly slashCommandDeepReviewBonus: number;
  // phase-folder intent
  readonly phaseFolderSpecKitBonus: number;
  readonly phaseFolderDeepResearchPenalty: number;
}

export interface ScoringCalibration {
  readonly confidence: ConfidenceCalibration;
  readonly uncertainty: UncertaintyCalibration;
  readonly routing: RoutingCalibration;
}

export const SCORING_CALIBRATION: ScoringCalibration = Object.freeze({
  confidence: Object.freeze({
    readOnlyExplainerFloor: 0.25,
    baseConstant: 0.52,
    liveNormalizedRampGain: 1.25,
    liveNormalizedRampCoefficient: 0.43,
    readOnlyRouteAllowedFloor: 0.82,
    derivedDominantConfidence: 0.72,
    derivedDominantDirectScoreCeiling: 0.2,
    deepResearchCycleSkillConfidence: 0.84,
    deepResearchCycleLiveNormalizedFloor: 0.12,
    taskIntentDirectScoreFloor: 0.18,
    taskIntentLiveNormalizedFloor: 0.2,
    taskIntentFloor: 0.82,
    directScoreLiftThreshold: 0.65,
    directScoreFloor: 0.82,
    directScoreBonusThreshold: 0.85,
    directScoreBonus: 0.04,
    hardCeiling: 0.95,
  }),
  uncertainty: Object.freeze({
    noEvidenceDefault: 0.42,
    highEvidenceCount: 5,
    lowFloor: 0.18,
    mediumEvidenceCount: 3,
    mediumFloor: 0.22,
    someEvidenceCount: 1,
    elevatedFloor: 0.30,
    directEvidenceDiscountThreshold: 0.75,
    directEvidenceDiscount: 0.06,
    lowConfidencePenaltyThreshold: 0.8,
    lowConfidencePenalty: 0.08,
    hardFloor: 0.08,
    hardCeiling: 0.95,
  }),
  routing: Object.freeze({
    semanticSearchCocoIndexBonus: 0.5,
    semanticSearchDeepResearchPenalty: -0.2,
    deepReviewSkDeepReviewBonus: 0.35,
    deepReviewSkCodeReviewPenalty: -0.25,
    deepResearchSkDeepResearchBonus: 0.35,
    deepResearchOtherSkillsPenalty: -0.18,
    deepResearchCycleSkDeepResearchBonus: 0.45,
    deepResearchCycleOtherSkillsPenalty: -0.18,
    compareAuditCodeReviewBonus: 0.35,
    compareAuditCodeOpenCodePenalty: -0.18,
    corpusStudySpecKitBonus: 0.35,
    corpusStudyOtherSkillsPenalty: -0.16,
    slashCommandDeepResearchBonus: 0.45,
    slashCommandDeepReviewBonus: 0.45,
    phaseFolderSpecKitBonus: 0.35,
    phaseFolderDeepResearchPenalty: -0.25,
  }),
});

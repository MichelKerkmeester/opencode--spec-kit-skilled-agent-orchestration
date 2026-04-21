// ───────────────────────────────────────────────────────────────
// MODULE: Advisor MCP Tool Schemas
// ───────────────────────────────────────────────────────────────

import { z } from 'zod';

export const AdvisorFreshnessSchema = z.enum(['live', 'stale', 'absent', 'unavailable']);
export const AdvisorLaneSchema = z.enum([
  'explicit_author',
  'lexical',
  'graph_causal',
  'derived_generated',
  'semantic_shadow',
]);

const laneBreakdownSchema = z.object({
  lane: AdvisorLaneSchema,
  rawScore: z.number().min(0),
  weightedScore: z.number().min(0),
  weight: z.number().min(0),
  shadowOnly: z.boolean(),
}).strict();

export const AdvisorRecommendInputSchema = z.object({
  prompt: z.string().min(1).max(10_000),
  options: z.object({
    topK: z.number().int().min(1).max(10).optional(),
    includeAttribution: z.boolean().optional(),
    includeAbstainReasons: z.boolean().optional(),
    confidenceThreshold: z.number().min(0).max(1).optional(),
    uncertaintyThreshold: z.number().min(0).max(1).optional(),
  }).strict().optional(),
}).strict();

export const AdvisorRecommendationSchema = z.object({
  skillId: z.string().min(1),
  score: z.number().min(0),
  confidence: z.number().min(0).max(1),
  dominantLane: AdvisorLaneSchema.nullable(),
  laneBreakdown: z.array(laneBreakdownSchema).optional(),
  redirectFrom: z.array(z.string().min(1)).optional(),
  redirectTo: z.string().min(1).optional(),
  status: z.enum(['active', 'deprecated', 'archived', 'future']).optional(),
}).strict();

export const AdvisorRecommendOutputSchema = z.object({
  recommendations: z.array(AdvisorRecommendationSchema),
  ambiguous: z.boolean().optional(),
  freshness: AdvisorFreshnessSchema,
  trustState: z.object({
    state: AdvisorFreshnessSchema,
    reason: z.string().nullable(),
    generation: z.number().int().nonnegative(),
    checkedAt: z.string().datetime(),
    lastLiveAt: z.string().datetime().nullable(),
  }).strict(),
  generatedAt: z.string().datetime(),
  cache: z.object({
    hit: z.boolean(),
    sourceSignaturePresent: z.boolean(),
  }).strict(),
  warnings: z.array(z.string()).optional(),
  abstainReasons: z.array(z.string()).optional(),
}).strict();

export const AdvisorStatusInputSchema = z.object({
  workspaceRoot: z.string().min(1),
  maxMetadataFiles: z.number().int().positive().max(10_000).optional(),
}).strict();

export const AdvisorStatusOutputSchema = z.object({
  freshness: AdvisorFreshnessSchema,
  generation: z.number().int().nonnegative(),
  trustState: z.object({
    state: AdvisorFreshnessSchema,
    reason: z.string().nullable(),
    generation: z.number().int().nonnegative(),
    checkedAt: z.string().datetime(),
    lastLiveAt: z.string().datetime().nullable(),
  }).strict(),
  lastGenerationBump: z.string().datetime().nullable(),
  lastScanAt: z.string().datetime().nullable(),
  skillCount: z.number().int().nonnegative(),
  laneWeights: z.record(AdvisorLaneSchema, z.number().min(0)),
  daemonPid: z.number().int().positive().optional(),
  errors: z.array(z.string()).optional(),
}).strict();

export const AdvisorValidateInputSchema = z.object({
  confirmHeavyRun: z.literal(true),
  skillSlug: z.string().min(1).nullable().optional(),
}).strict();

const validationSliceSchema = z.object({
  percentage: z.number().min(0).max(1),
  passed: z.boolean(),
  threshold: z.number().min(0).max(1).optional(),
  count: z.object({
    passed: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
  }).strict(),
}).strict();

export const AdvisorValidateOutputSchema = z.object({
  skillSlug: z.string().nullable(),
  overallAccuracy: z.number().min(0).max(1),
  perSkill: z.array(z.object({
    skillId: z.string().min(1),
    status: z.enum(['pass', 'fail', 'skipped']),
    matched: z.number().int().nonnegative(),
    total: z.number().int().nonnegative(),
  }).strict()),
  slices: z.object({
    corpus: z.object({
      full_corpus_top1: validationSliceSchema,
      unknown_count: z.object({
        value: z.number().int().nonnegative(),
        targetMax: z.number().int().nonnegative(),
        passed: z.boolean(),
      }).strict(),
      gold_none_false_fire_count: z.object({
        value: z.number().int().nonnegative(),
        baselineDelta: z.number().int(),
      }).strict(),
    }).strict(),
    holdout: z.object({
      holdout_top1: validationSliceSchema,
    }).strict(),
    parity: z.object({
      explicit_skill_top1_regression: z.object({
        passed: z.boolean(),
        regressions: z.array(z.string()),
      }).strict(),
      ambiguity_slice_stable: z.object({
        passed: z.boolean(),
        top2Within005: z.boolean(),
      }).strict(),
      derived_lane_attribution_complete: z.boolean(),
    }).strict(),
    safety: z.object({
      adversarial_stuffing_blocked: z.object({
        passed: z.boolean(),
        fixtureCount: z.number().int().nonnegative(),
      }).strict(),
    }).strict(),
    latency: z.object({
      regression_suite_status: z.object({
        p0PassRate: z.number().min(0).max(1),
        failedCount: z.number().int().nonnegative(),
        commandBridgeFalsePositiveRate: z.number().min(0).max(1),
        cacheHitP95Ms: z.number().min(0),
        uncachedP95Ms: z.number().min(0),
      }).strict(),
    }).strict(),
  }).strict(),
  generatedAt: z.string().datetime(),
}).strict();

export type AdvisorFreshness = z.infer<typeof AdvisorFreshnessSchema>;
export type AdvisorRecommendInput = z.infer<typeof AdvisorRecommendInputSchema>;
export type AdvisorRecommendOutput = z.infer<typeof AdvisorRecommendOutputSchema>;
export type AdvisorStatusInput = z.infer<typeof AdvisorStatusInputSchema>;
export type AdvisorStatusOutput = z.infer<typeof AdvisorStatusOutputSchema>;
export type AdvisorValidateInput = z.infer<typeof AdvisorValidateInputSchema>;
export type AdvisorValidateOutput = z.infer<typeof AdvisorValidateOutputSchema>;

export const AdvisorToolInputSchemas = {
  advisor_recommend: AdvisorRecommendInputSchema,
  advisor_status: AdvisorStatusInputSchema,
  advisor_validate: AdvisorValidateInputSchema,
} as const;

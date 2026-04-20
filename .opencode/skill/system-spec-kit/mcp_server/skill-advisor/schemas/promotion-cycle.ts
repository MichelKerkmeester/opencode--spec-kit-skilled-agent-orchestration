// ───────────────────────────────────────────────────────────────
// MODULE: Promotion Cycle Schemas
// ───────────────────────────────────────────────────────────────

import { z } from 'zod';

export const PromotionLaneSchema = z.enum([
  'explicit_author',
  'lexical',
  'graph_causal',
  'derived_generated',
  'semantic_shadow',
  'learned_adaptive',
]);

export const PromotionWeightsSchema = z.object({
  explicit_author: z.number().min(0).max(1),
  lexical: z.number().min(0).max(1),
  graph_causal: z.number().min(0).max(1),
  derived_generated: z.number().min(0).max(1),
  semantic_shadow: z.number().min(0).max(1),
  learned_adaptive: z.number().min(0).max(1).default(0),
}).strict();

export const PromotionCorpusCaseSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  expectedSkill: z.string().min(1).nullable(),
  bucket: z.string().min(1).optional(),
}).strict();

export const PromotionPerPromptMatchSchema = z.object({
  id: z.string().min(1),
  expectedSkill: z.string().min(1).nullable(),
  liveTopSkill: z.string().min(1).nullable(),
  candidateTopSkill: z.string().min(1).nullable(),
  liveMatched: z.boolean(),
  candidateMatched: z.boolean(),
  deltaVsLive: z.number().int().min(-1).max(1),
  dominantLane: PromotionLaneSchema.nullable(),
}).strict();

export const ShadowCycleResultSchema = z.object({
  cycleId: z.string().min(1),
  candidateAccuracy: z.number().min(0).max(1),
  liveAccuracy: z.number().min(0).max(1),
  deltaVsLive: z.number(),
  totalPrompts: z.number().int().nonnegative(),
  correctPrompts: z.number().int().nonnegative(),
  liveCorrectPrompts: z.number().int().nonnegative(),
  unknownCount: z.number().int().nonnegative(),
  goldNoneFalseFire: z.number().int().nonnegative(),
  perPromptMatches: z.array(PromotionPerPromptMatchSchema),
  laneAttributionBreakdown: z.record(PromotionLaneSchema, z.number().int().nonnegative()),
  passesShadowGate: z.boolean(),
  sideEffectFree: z.boolean(),
}).strict();

export const PromotionGateStatusSchema = z.enum(['pass', 'fail']);

export const PromotionGateResultSchema = z.object({
  gate: z.string().min(1),
  status: PromotionGateStatusSchema,
  threshold: z.string().min(1),
  measured: z.string().min(1),
  details: z.array(z.string().min(1)).default([]),
}).strict();

export const PromotionGateBundleResultSchema = z.object({
  passed: z.boolean(),
  gates: z.array(PromotionGateResultSchema),
  failedGates: z.array(z.string().min(1)),
  evaluatedAt: z.string().datetime(),
}).strict();

export type PromotionLane = z.infer<typeof PromotionLaneSchema>;
export type PromotionWeights = z.infer<typeof PromotionWeightsSchema>;
export type PromotionCorpusCase = z.infer<typeof PromotionCorpusCaseSchema>;
export type PromotionPerPromptMatch = z.infer<typeof PromotionPerPromptMatchSchema>;
export type ShadowCycleResult = z.infer<typeof ShadowCycleResultSchema>;
export type PromotionGateResult = z.infer<typeof PromotionGateResultSchema>;
export type PromotionGateBundleResult = z.infer<typeof PromotionGateBundleResultSchema>;

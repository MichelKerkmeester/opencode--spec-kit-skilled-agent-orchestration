// ───────────────────────────────────────────────────────────────
// MODULE: Skill Derived Metadata V2 Schema
// ───────────────────────────────────────────────────────────────

import { z } from 'zod';

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────

export const SKILL_DERIVED_SCHEMA_VERSION = 2;
export const SKILL_DERIVED_SANITIZER_VERSION = 'sanitizeSkillLabel:v1';

// ───────────────────────────────────────────────────────────────
// 2. SCHEMA
// ───────────────────────────────────────────────────────────────

export const SkillLifecycleStatusSchema = z.enum([
  'active',
  'deprecated',
  'archived',
  'future',
]);

export const SkillTrustLaneSchema = z.enum([
  'explicit_author',
  'frontmatter',
  'body',
  'examples',
  'local_docs',
  'derived_local',
  'derived_generated',
]);

/**
 * Schema-v2 generated metadata lives only in graph-metadata.json.derived.
 *
 * Author-maintained SKILL.md fields and graph-metadata.json intent_signals are
 * not overwritten by this schema. The derived block is additive, reversible,
 * provenance-fingerprinted, and sanitized at each write/publication boundary.
 */
export const SkillDerivedV2Schema = z.object({
  trigger_phrases: z.array(z.string().min(1)).max(24),
  keywords: z.array(z.string().min(1)).max(48),
  provenance_fingerprint: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  generated_at: z.string().datetime(),
  source_docs: z.array(z.string().min(1)).max(64),
  key_files: z.array(z.string().min(1)).max(64),
  demotion: z.number().min(0).max(1).default(1),
  trust_lane: SkillTrustLaneSchema.default('derived_generated'),
  sanitizer_version: z.literal(SKILL_DERIVED_SANITIZER_VERSION),
  lifecycle_status: SkillLifecycleStatusSchema.default('active'),
  redirect_from: z.array(z.string().min(1)).optional(),
  redirect_to: z.string().min(1).optional(),
});

export type SkillLifecycleStatus = z.infer<typeof SkillLifecycleStatusSchema>;
export type SkillTrustLane = z.infer<typeof SkillTrustLaneSchema>;
export type SkillDerivedV2 = z.infer<typeof SkillDerivedV2Schema>;

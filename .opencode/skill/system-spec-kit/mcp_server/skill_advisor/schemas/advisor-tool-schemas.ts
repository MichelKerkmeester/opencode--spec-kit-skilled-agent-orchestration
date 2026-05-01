// ───────────────────────────────────────────────────────────────
// MODULE: Advisor MCP Tool Schemas
// ───────────────────────────────────────────────────────────────

import { z } from 'zod';
import { existsSync, realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { SCORER_LANE_IDS } from '../lib/scorer/lane-registry.js';

export const AdvisorFreshnessSchema = z.enum(['live', 'stale', 'absent', 'unavailable']);
export const AdvisorLaneSchema = z.enum(SCORER_LANE_IDS);

// F-005-A5-01: Bound caller-supplied workspaceRoot inputs to a small
// allowlist (repo root + os.tmpdir()) so handlers cannot be coerced into
// resolving paths outside the workspace. resolve() canonicalizes the input
// path; realpathSync follows symlinks; the prefix check rejects anything
// that escapes the allowlist after canonicalization.
//
// Repo root is detected by walking up from process.cwd() looking for the
// .opencode/skill sentinel — same shape as findAdvisorWorkspaceRoot but
// inlined here to avoid a circular import between schemas/ and lib/.
function detectRepoRoot(): string {
  // F-005-A5-01: Use the same SKILL.md sentinel that
  // findAdvisorWorkspaceRoot uses in advisor-validate.ts so the schema
  // and the handler agree on which directory is the workspace root.
  // A bare `.opencode/skill` sentinel can match nested mock directories
  // created by other workflows (e.g. mcp_server/.opencode/skill).
  const sentinel = '.opencode/skill/system-spec-kit/SKILL.md';
  let current = resolve(process.cwd());
  for (let index = 0; index < 14; index += 1) {
    if (existsSync(resolve(current, sentinel))) return current;
    const parent = resolve(current, '..');
    if (parent === current) break;
    current = parent;
  }
  return resolve(process.cwd());
}

function canonicalize(input: string): string {
  const resolved = resolve(input);
  try {
    return realpathSync.native(resolved);
  } catch {
    // F-005-A5-01: Path may not exist yet (test fixtures created lazily,
    // tmpdir mkdtemp paths probed before mkdir). Walk up and realpath the
    // first existing ancestor, then re-join the unresolved tail. This
    // resolves macOS-style symlinks like /tmp → /private/tmp even when
    // the leaf doesn't exist.
    let probe = resolved;
    let tail = '';
    for (let depth = 0; depth < 32; depth += 1) {
      const parent = resolve(probe, '..');
      if (parent === probe) break;
      try {
        const realParent = realpathSync.native(parent);
        return tail
          ? resolve(realParent, probe.slice(parent.length + 1) + tail)
          : resolve(realParent, probe.slice(parent.length + 1));
      } catch {
        // Parent doesn't exist either — keep walking up.
        const segment = probe.slice(parent.length + 1);
        tail = tail ? `${segment}/${tail}` : segment;
        probe = parent;
      }
    }
    return resolved;
  }
}

const ALLOWED_WORKSPACE_PREFIXES: readonly string[] = (() => {
  const prefixes: string[] = [];
  prefixes.push(canonicalize(detectRepoRoot()));
  prefixes.push(canonicalize(tmpdir()));
  // F-005-A5-01: Include the canonicalized /tmp prefix as well. On macOS
  // os.tmpdir() returns the per-user temp dir under /var/folders/...; the
  // /tmp symlink resolves to /private/tmp. Test fixtures and tools that
  // hardcode /tmp/foo paths need both forms in the allowlist.
  prefixes.push(canonicalize('/tmp'));
  // Accept additional explicit allowlist via env (CI / test runners).
  const envExtras = process.env.SPECKIT_ADVISOR_WORKSPACE_ALLOWLIST;
  if (envExtras) {
    for (const extra of envExtras.split(':')) {
      const trimmed = extra.trim();
      if (trimmed) prefixes.push(canonicalize(trimmed));
    }
  }
  return Array.from(new Set(prefixes));
})();

/**
 * F-005-A5-01: Validate that a caller-supplied workspaceRoot resolves under
 * the repo root, os.tmpdir(), or an explicit allowlist entry after
 * realpath canonicalization.
 *
 * Exported so handlers can re-canonicalize at call time and reuse the
 * same bounding logic the schema applies at parse time.
 */
export function isAllowedWorkspaceRoot(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  const canonical = canonicalize(input);
  return ALLOWED_WORKSPACE_PREFIXES.some(
    (prefix) => canonical === prefix || canonical.startsWith(`${prefix}/`),
  );
}

const BoundedWorkspaceRootSchema = z
  .string()
  .min(1)
  .refine(isAllowedWorkspaceRoot, {
    message:
      'workspaceRoot must resolve under the repo root, os.tmpdir(), or an explicit SPECKIT_ADVISOR_WORKSPACE_ALLOWLIST entry',
  });

const laneBreakdownSchema = z.object({
  lane: AdvisorLaneSchema,
  rawScore: z.number().min(0),
  weightedScore: z.number().min(0),
  weight: z.number().min(0),
  shadowOnly: z.boolean(),
}).strict();

// NOTE (R-007-10, T-C / DEFER decision):
// `AdvisorScoringOptions.affordances` (see `lib/scorer/types.ts:94`) is a
// COMPILE-TIME-ONLY internal seam used by the scorer fusion path. Affordance
// evidence is sourced from compiled skill graph metadata via
// `skill_graph_compiler.py` (which emits sanitized `derived.affordances[]`
// nodes), not from public MCP input. Exposing `affordances` through this
// request schema would re-introduce the prompt-stuffing surface that
// `affordance-normalizer.ts` specifically defends against (URLs, emails,
// instruction-shaped strings, free-form `description` fields). The public
// `advisor_recommend` tool intentionally does NOT accept `affordances`.
// Internal callers that need request-local affordance scoring should invoke
// `scoreAdvisorPrompt` directly with `AdvisorScoringOptions.affordances`.
export const AdvisorRecommendInputSchema = z.object({
  // F-005-A5-01: workspaceRoot must resolve under the allowed prefix set.
  workspaceRoot: BoundedWorkspaceRootSchema.optional(),
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
  uncertainty: z.number().min(0).max(1),
  dominantLane: AdvisorLaneSchema.nullable(),
  laneBreakdown: z.array(laneBreakdownSchema).optional(),
  redirectFrom: z.array(z.string().min(1)).optional(),
  redirectTo: z.string().min(1).optional(),
  status: z.enum(['active', 'deprecated', 'archived', 'future']).optional(),
}).strict();

export const AdvisorRecommendOutputSchema = z.object({
  workspaceRoot: z.string().min(1),
  effectiveThresholds: z.object({
    confidenceThreshold: z.number().min(0).max(1),
    uncertaintyThreshold: z.number().min(0).max(1),
    confidenceOnly: z.boolean(),
  }).strict(),
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
  _shadow: z.object({
    model: z.literal('advisor-shadow-learned-weights-v1'),
    liveWeightsFrozen: z.boolean(),
    recommendations: z.array(z.object({
      skillId: z.string().min(1),
      liveScore: z.number().min(0),
      shadowScore: z.number().min(0),
      delta: z.number(),
      dominantShadowLane: AdvisorLaneSchema.nullable(),
    }).strict()),
  }).strict().optional(),
}).strict();

export const AdvisorStatusInputSchema = z.object({
  // F-005-A5-01: bound workspaceRoot to allowed prefix set.
  workspaceRoot: BoundedWorkspaceRootSchema,
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

export const AdvisorRebuildInputSchema = z.object({
  force: z.boolean().optional(),
  // F-005-A5-01: bound workspaceRoot to allowed prefix set.
  workspaceRoot: BoundedWorkspaceRootSchema.optional(),
}).strict();

export const AdvisorRebuildOutputSchema = z.object({
  rebuilt: z.boolean(),
  skipped: z.boolean(),
  reason: z.enum(['status-live', 'stale', 'absent', 'unavailable', 'force']),
  freshnessBefore: AdvisorFreshnessSchema,
  freshnessAfter: AdvisorFreshnessSchema,
  generationBefore: z.number().int().nonnegative(),
  generationAfter: z.number().int().nonnegative(),
  skillCount: z.number().int().nonnegative(),
  summary: z.record(z.string(), z.unknown()).nullable(),
  diagnostics: z.array(z.string()),
}).strict();

export const AdvisorValidateInputSchema = z.object({
  confirmHeavyRun: z.literal(true),
  // F-005-A5-01: bound workspaceRoot to allowed prefix set.
  workspaceRoot: BoundedWorkspaceRootSchema.optional(),
  skillSlug: z.string().min(1).nullable().optional(),
  outcomeEvents: z.array(z.object({
    runtime: z.enum(['claude', 'gemini', 'copilot', 'codex']),
    outcome: z.enum(['accepted', 'corrected', 'ignored']),
    skillId: z.string().min(1),
    correctedSkillId: z.string().min(1).optional(),
    timestamp: z.string().datetime().optional(),
  }).strict()).optional(),
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

const advisorValidateAggregateValidationSchema = z.object({
  fullCorpusTop1: z.number().min(0).max(1),
  holdoutTop1: z.number().min(0).max(1),
  perSkillTop1: z.number().min(0).max(1),
  unknownCountTargetMax: z.number().int().nonnegative(),
}).strict().describe('Release-gate thresholds for full corpus, holdout, per-skill accuracy, and UNKNOWN counts.');

const advisorValidateRuntimeRoutingSchema = z.object({
  confidenceThreshold: z.number().min(0).max(1),
  uncertaintyThreshold: z.number().min(0).max(1),
  confidenceOnly: z.boolean(),
}).strict().describe('Live runtime routing thresholds surfaced by advisor_validate so manual checks can compare runtime semantics with release gates.');

const advisorValidateTelemetryDiagnosticsSchema = z.object({
  recordsPath: z.string().min(1),
  recordsRetained: z.number().int().nonnegative(),
  rollingCacheHitRate: z.number().min(0).max(1),
  rollingP95Ms: z.number().min(0),
  rollingFailOpenRate: z.number().min(0).max(1),
}).strict().describe('Prompt-safe rolling diagnostics from retained advisor hook telemetry records.');

const advisorValidateTelemetryScopeSchema = z.object({
  kind: z.enum(['workspace', 'skill']),
  skillSlug: z.string().min(1).nullable(),
}).strict().describe('Whether recorded outcome totals are workspace-wide or scoped to the selected skillSlug.');

const advisorValidateOutcomeTotalsSchema = z.object({
  accepted: z.number().int().nonnegative(),
  corrected: z.number().int().nonnegative(),
  ignored: z.number().int().nonnegative(),
}).strict().describe('Recorded outcome totals retained for the active workspace or skill scope.');

const advisorValidateTelemetryOutcomesSchema = z.object({
  recordsPath: z.string().min(1),
  recordedThisRun: z.number().int().nonnegative(),
  scope: advisorValidateTelemetryScopeSchema,
  totals: advisorValidateOutcomeTotalsSchema,
}).strict().describe('Outcome recording summary, including injected event count and retained accepted/corrected/ignored totals.');

export const AdvisorValidateOutputSchema = z.object({
  workspaceRoot: z.string().min(1),
  skillSlug: z.string().nullable(),
  thresholdSemantics: z.object({
    aggregateValidation: advisorValidateAggregateValidationSchema,
    runtimeRouting: advisorValidateRuntimeRoutingSchema,
  }).strict().describe('Public threshold contract for advisor_validate, covering release-gate scoring and runtime-routing semantics.'),
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
  telemetry: z.object({
    diagnostics: advisorValidateTelemetryDiagnosticsSchema,
    outcomes: advisorValidateTelemetryOutcomesSchema,
  }).strict().describe('Prompt-safe telemetry diagnostics and recorded outcome summaries exposed for operator validation.'),
  generatedAt: z.string().datetime(),
}).strict();

export type AdvisorFreshness = z.infer<typeof AdvisorFreshnessSchema>;
export type AdvisorRecommendInput = z.infer<typeof AdvisorRecommendInputSchema>;
export type AdvisorRecommendOutput = z.infer<typeof AdvisorRecommendOutputSchema>;
export type AdvisorRebuildInput = z.infer<typeof AdvisorRebuildInputSchema>;
export type AdvisorRebuildOutput = z.infer<typeof AdvisorRebuildOutputSchema>;
export type AdvisorStatusInput = z.infer<typeof AdvisorStatusInputSchema>;
export type AdvisorStatusOutput = z.infer<typeof AdvisorStatusOutputSchema>;
export type AdvisorValidateInput = z.infer<typeof AdvisorValidateInputSchema>;
export type AdvisorValidateOutput = z.infer<typeof AdvisorValidateOutputSchema>;

export const AdvisorToolInputSchemas = {
  advisor_recommend: AdvisorRecommendInputSchema,
  advisor_rebuild: AdvisorRebuildInputSchema,
  advisor_status: AdvisorStatusInputSchema,
  advisor_validate: AdvisorValidateInputSchema,
} as const;

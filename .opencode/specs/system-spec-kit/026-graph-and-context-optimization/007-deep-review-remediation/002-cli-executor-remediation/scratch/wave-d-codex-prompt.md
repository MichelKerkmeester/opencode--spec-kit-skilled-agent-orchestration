# Phase 020 Wave D — Metadata Lineage (R6 + R7)

## GATE 3 ALREADY RESOLVED — DO NOT ASK

**Spec folder**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/002-cli-executor-remediation/`
**Waves A+B+C state**: COMPLETE. Tests green. Executor provenance first-write + description repair safety + Copilot @path fallback shipped.
**Your role**: Implement R6 (save-lineage tag on graph-metadata.json) + R7 (continuity threshold docs honesty + date-only timestamp normalization).

**First line**: `GATE_3_ACKNOWLEDGED: proceeding with packet 020 Wave D`

**Working dir**: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`

---

## Context

Research.md §5 F1 + §6 Q1: Phase 017's 16-folder sweep wasn't same-pass. Later graph-only and description-only rewrites reopened drift in opposite directions. Currently freshness claims depend on timestamp subtraction — no lineage marker distinguishes "saved together" from "saved separately."

Decision-record.md ADR-012 locked: start with 3-value enum (`description_only` / `graph_only` / `same_pass`). Extend later if needed.

R7: the 10-minute continuity threshold is described as if empirically calibrated; it's a one-sided heuristic budget. Research.md §5 F7: live corpus shows no same-save latency cluster at 10 minutes, and date-only timestamps create false "stale" warnings. Fix: update docs to say heuristic, add `normalizeTimestampPrecision` helper for date-only values.

## Do these tasks

### T-LIN-01 — Extend graph-metadata-schema.ts

**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`

Find `graphMetadataDerivedSchema`. Add a new optional field (optional for migration; tighten to required once backfill runs):

```typescript
save_lineage: z.enum(['description_only', 'graph_only', 'same_pass']).optional(),
```

Also add an exported constant:

```typescript
export const SAVE_LINEAGE_VALUES = ['description_only', 'graph_only', 'same_pass'] as const;
export type SaveLineage = typeof SAVE_LINEAGE_VALUES[number];
```

### T-LIN-02 — Wire the canonical save path

**File**: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`

This is the H-56-1 fix site from Phase 017. Find the spot where `description.json.lastUpdated` is written alongside `graph-metadata.json.derived.last_save_at`. That is the "same-pass" branch → write `save_lineage: 'same_pass'` on that path.

If there are other save paths that ONLY touch graph-metadata (e.g., graph-only regeneration), those should stamp `save_lineage: 'graph_only'`.
If there are paths that ONLY touch description.json (e.g., stale-file auto-repair from Wave B), those should cause graph-metadata to NOT change save_lineage (the description-only update can't stamp graph-metadata without also writing it, so leave graph-metadata lineage unchanged and stamp description.json with a `last_description_sync_at` if possible).

If the exact code paths are fuzzy, start with: 
- H-56-1 canonical save path → `same_pass`
- any `refreshGraphMetadata` standalone invocation → `graph_only`

### T-LIN-03 — Backfill script

**File**: `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`

Update to stamp `save_lineage: 'graph_only'` on every existing graph-metadata.json that lacks the field. Log count of folders updated.

### T-LIN-04 — Normalize timestamp precision helper

**File**: create `.opencode/skill/system-spec-kit/mcp_server/lib/continuity/timestamp-normalize.ts`

```typescript
// MODULE: Continuity timestamp precision normalization
// Problem: date-only timestamps (e.g., "2026-04-18" or "2026-04-18T00:00:00Z") create
// false staleness warnings when the validator compares them to high-precision timestamps.

export function normalizeTimestampPrecision(raw: string): string {
  // If the timestamp is date-only or midnight UTC, return it as-is but flag as low-precision.
  // For comparison purposes, consumers should use `isLowPrecision` to bypass strict thresholds.
  // Returns: normalized ISO 8601 string.
}

export function isLowPrecision(raw: string): boolean {
  // True if: matches /^\d{4}-\d{2}-\d{2}$/ OR ends with T00:00:00Z OR T00:00:00+00:00
  // These are likely date-only semantics rather than precise timestamps.
}

export function comparePrecisionAware(a: string, b: string, thresholdMs: number): 'fresh' | 'stale' | 'low_precision_bypass' {
  // If either is low-precision, return 'low_precision_bypass'
  // Otherwise compute delta and compare against threshold.
}
```

### T-DOC-02 — Continuity threshold docs update

Files to update (search for 10-minute / 600000ms / continuity-threshold references):
- `.opencode/skill/system-spec-kit/SKILL.md` (if the threshold is referenced there)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime/spec.md` — add a follow-up note
- Any continuity-freshness validator docstrings

Change language from "calibrated" / "empirically chosen" / "measured" → "heuristic one-sided policy budget, calibration pending telemetry." One sentence is fine.

### T-TST-07 — graph-metadata-lineage tests

**File to create**: `.opencode/skill/system-spec-kit/mcp_server/tests/graph/graph-metadata-lineage.vitest.ts`

Test cases:
- Schema accepts `save_lineage: 'description_only'`.
- Schema accepts `save_lineage: 'graph_only'`.
- Schema accepts `save_lineage: 'same_pass'`.
- Schema accepts omitted `save_lineage` (optional during transition).
- Schema rejects `save_lineage: 'invalid_value'`.
- `SAVE_LINEAGE_VALUES` export is 3 values.

### T-TST-08 — Timestamp normalization tests

**File to create**: `.opencode/skill/system-spec-kit/mcp_server/tests/continuity/timestamp-normalize.vitest.ts`

Test cases:
- `isLowPrecision("2026-04-18")` → true
- `isLowPrecision("2026-04-18T00:00:00Z")` → true
- `isLowPrecision("2026-04-18T00:00:00+00:00")` → true
- `isLowPrecision("2026-04-18T14:30:45.123Z")` → false
- `normalizeTimestampPrecision("2026-04-18")` → "2026-04-18T00:00:00Z" (or similar canonical form)
- `comparePrecisionAware(date_only, precise, 600000)` → "low_precision_bypass"
- `comparePrecisionAware(precise_now, precise_1h_ago, 600000)` → "stale"
- `comparePrecisionAware(precise_now, precise_5min_ago, 600000)` → "fresh"

## Invariants

- `save_lineage` is OPTIONAL in schema for this Wave (backfill happens over time). A follow-up wave can tighten to required once production metadata all has the field.
- Backfill script is idempotent.
- Timestamp normalization helper is additive; existing validator code doesn't need to change in this wave (R7 is mostly docs + helper availability; validator integration is a follow-up).
- No numeric change to 10-minute threshold.

## Verification

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server
npx tsc --noEmit --composite false -p tsconfig.json 2>&1 | tail -5
npx vitest run tests/graph/ tests/continuity/ tests/deep-loop/ tests/description/ 2>&1 | tail -8
```

Expected: tsc clean, new tests green, existing tests unchanged.

## Output

```
WAVE_D_STATUS: [OK | FAIL]
FILES_TOUCHED: <list>
NEW_MODULES: [continuity/timestamp-normalize.ts]
NEW_TESTS: [graph/graph-metadata-lineage.vitest.ts, continuity/timestamp-normalize.vitest.ts]
VITEST_RESULT: [<n>/<m> passed]
TSC_RESULT: [pass | fail]
```
</content>
</invoke>

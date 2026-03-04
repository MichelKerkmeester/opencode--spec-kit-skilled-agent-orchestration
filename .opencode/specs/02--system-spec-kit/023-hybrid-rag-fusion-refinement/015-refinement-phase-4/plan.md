---
title: "Plan: Refinement Phase 4"
description: "Execution plan for persistence and scoring fallback corrections in Phase 4."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
importance_tier: "important"
contextType: "implementation"
---

# Plan: Refinement Phase 4

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->

## P1 #1: Warn-Only Timer Persistence

**File:** `mcp_server/lib/validation/save-quality-gate.ts`

1. Import `ensureConfigTable`, `getDb` pattern from `db-state.ts` / `db-helpers.ts`
2. Add `loadActivationTimestamp()` — reads `quality_gate_activated_at` from `config` table on first access
3. Modify `setActivationTimestamp()` — writes to both in-memory variable AND `config` table
4. Add lazy-load in `isWarnOnlyMode()` — if `qualityGateActivatedAt` is null, attempt to load from DB before returning false
5. Add test: verify timestamp persists across simulated "restart" (clear in-memory, reload from DB)

## P1 #2: effectiveScore() Fallback Chain

**File:** `mcp_server/lib/search/pipeline/stage3-rerank.ts`

1. Update `effectiveScore()` fallback chain:
   - `intentAdjustedScore` (if present and finite)
   - `rrfScore` (if present and finite)
   - `score` (existing)
   - `similarity / 100` (existing fallback)
   - `0` (default)

2. For the Score Immutability Invariant: preserve Stage 2's `score` by renaming the field written at line 312. Store the cross-encoder result in `rerankScore` only, and let `effectiveScore()` handle score resolution for downstream consumers.

   **Decision:** After review, the current behavior at line 312 creates a new object (spread), so it's not mutating Stage 2's row. The `score` overwrite is the canonical pattern for "what Stage 4 should sort by." The invariant comment is aspirational. We'll add `stage2Score` preservation instead: save Stage 2's score before overwrite so it remains auditable.

3. Update cross-encoder document mapping (line 285) to use `effectiveScore()` instead of `row.score ?? row.similarity`

## Verification
- Run full test suite: `cd .opencode/skill/system-spec-kit && npm test`
- Verify TypeScript compiles: `npx tsc --noEmit`
<!-- /ANCHOR:summary -->

## Technical Context
Current plan scope remains documentation and validation normalization for this phase.

## Architecture
No architecture changes are introduced by this normalization pass.

## Implementation
Apply repeatable documentation updates, then validate recursively until clean.

## Phase 1: Validation Alignment
- Normalize checklist metadata and evidence syntax.
- Re-run validator and resolve residual warnings.

## Phase 2: Validation Alignment
- Normalize checklist metadata and evidence syntax.
- Re-run validator and resolve residual warnings.

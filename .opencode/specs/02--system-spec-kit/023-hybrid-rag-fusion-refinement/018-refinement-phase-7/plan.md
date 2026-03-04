---
title: "Plan: 018 - Refinement Phase 7 Remediation"
description: "Tiered execution plan for Phase 7 remediation and verification checkpoints."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
importance_tier: "critical"
contextType: "implementation"
---

# Plan: 018 — Refinement Phase 7 Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->

## Approach

Three-tiered remediation derived from the 8-agent orchestrated review (5 Gemini + 3 Opus) and validated by ultra-think quality review. Each tier is self-contained. Dependencies are noted per step. Effort estimates include both optimistic and realistic projections (ultra-think found original estimates 2-3x too low for Tier 3).

## Execution Order

```
Tier 1 (critical path, no dependencies):
  Step 1 (docs) → Step 2 (Math.max) → Step 3 (session tx) → Step 4 (impl-summary) → Step 5 (docblock)

Tier 2 (dependency chain):
  Step 13 (better-sqlite3) → Step 7 (workspace deps) → Step 6 (import aliases)
  Steps 8-12, 14-16 are independent
```

---

## Tier 1: Immediate — Critical Path

**Estimated effort:** 5.25h optimistic / 8-10h realistic
**Dependencies:** None — can start immediately
**Risk:** Low — documentation fixes and well-understood code patterns

### Step 1: Fix summary_of_existing_features.md (P0 + P1 + P2)

**File:** `summary_of_existing_features.md`
**Effort:** 3.0h optimistic / 4-5h realistic
**Blocking:** All 4 P0 items are blockers for checklist sign-off

Apply 13 corrections in order of severity:

**P0 corrections (4 — must fix):**

1. **Signal count** — Change "9 signals" to "12 processing steps (9 score-affecting)"
   - Evidence: G1 verified at `stage2-fusion.ts:404`. The 12 steps are:
     1. Initial score resolution (resolveEffectiveScore)
     2. Co-activation spreading (step 2a — the one missing from headers)
     3. Query-term overlap boost
     4. Trigger phrase exact match
     5. Contiguity bonus
     6. Causal neighbor boost
     7. BM25 score integration
     8. Summary channel fusion
     9. Temporal decay application
     10. Quality score weighting
     11. Intent-aware weight adjustment
     12. Final normalization
   - Steps 1-9 are score-affecting; 10-12 are weight/normalization
   - **Canonical framing:** "12 processing steps (9 score-affecting)"

2. **V1 pipeline references** — Remove all descriptions of `postSearchPipeline` as available
   - Evidence: `memory-search.ts:599` — only a removal comment references it. Zero implementation exists.
   - Grep verification: `grep -r 'postSearchPipeline' mcp_server/` should return 0 active code results
   - The function was removed in Phase 017 (commit verified by G4)

3. **SPECKIT_PIPELINE_V2** — Change from "active toggle" to "deprecated (always true)"
   - Evidence: `search-flags.ts:101` — `isPipelineV2Enabled()` body is `return true`
   - The flag exists in env var checks but the function ignores it
   - New text: "SPECKIT_PIPELINE_V2 is deprecated as of Phase 017. The V2 pipeline is now the only pipeline. isPipelineV2Enabled() always returns true."

4. **resolveEffectiveScore()** — Add to pipeline documentation section
   - Evidence: `pipeline/types.ts:56` — shared function with cascading fallback chain
   - Signature: `resolveEffectiveScore(result: SearchResult): number`
   - Behavior: Resolves effective score from `compositeScore` → `fusionScore` → `rrf_score` → `similarity` fallback chain
   - Used by Stage 2 as the entry point for all score resolution

**P1 corrections (5 — high priority):**

5. **memory_update embedding scope** — Change "title-only" to "title+content"
   - Evidence: `memory-crud-update.ts:89-91`:
     ```ts
     const embeddingInput = contentText ? `${title}\n\n${contentText}` : title;
     ```
   - New text: "Embedding is generated from combined title and content text (title-only fallback when content is empty)"

6. **memory_delete cleanup scope** — Change "1 table" to "multi-table"
   - Evidence: `memory-crud-delete.ts:74,80`:
     - L74: `vectorIndex.deleteMemory(id)` — removes vector embeddings
     - L80: `causalEdges.deleteEdgesForMemory(id)` — removes causal graph edges
   - Mutation ledger is appended to (not cleaned) — this is by design for audit trail

7. **Five-factor weight auto-normalization** — Add new documentation section
   - Evidence: `composite-scoring.ts:544-548`:
     ```ts
     if (Math.abs(wSum - 1.0) > 0.001) {
       // Auto-normalize: recalculate each weight as rawWeight / totalSum
     }
     ```
   - New text: "When user-configured weights don't sum to 1.0 (tolerance: 0.001), the system auto-normalizes by dividing each weight by the total sum. This prevents score inflation/deflation from misconfigured weights."

8. **R8 summary embedding channel** — Add to Stage 1 channel listing
   - Evidence: `stage1-candidate-gen.ts:507-565`:
     ```ts
     // ── R8: Summary Embedding Channel
     // Executes querySummaryEmbeddings if isMemorySummariesEnabled() and scale gate met
     ```
   - Gated by: `SPECKIT_MEMORY_SUMMARIES` flag + scale threshold

9. **SPECKIT_ADAPTIVE_FUSION** — Add to feature flag documentation
   - Evidence: `adaptive-fusion.ts:65,74`:
     ```ts
     const FEATURE_FLAG = 'SPECKIT_ADAPTIVE_FUSION';
     ```
   - Controls: Whether adaptive RRF fusion is enabled via rollout policy
   - Default: Disabled (requires explicit opt-in)

**P2 corrections (4 — minor):**
10. Quality gate persistence documentation
11. Canonical ID dedup documentation
12. memory_save summary generation documentation
13. bulk_delete cleanup scope documentation

### Step 2: Fix Math.max/min Spread Patterns (P1-6)

**Files:** 8 production files (7 specific locations confirmed + additional from G4)
**Effort:** 1.0h optimistic / 2-3h realistic (including edge cases and testing)
**Risk:** Medium — functional change to scoring/telemetry code

**Before pattern (unsafe):**
```ts
const maxScore = Math.max(...scores);
const minSimilarity = Math.min(...similarities);
```

**After pattern (safe):**
```ts
const maxScore = scores.reduce((a, b) => Math.max(a, b), -Infinity);
const minSimilarity = similarities.reduce((a, b) => Math.min(a, b), Infinity);
```

**Edge case handling:**
- Empty arrays: `-Infinity` / `Infinity` as initial values (matches Math.max/min behavior on empty spread)
- NaN handling: `Math.max(NaN, x)` returns NaN — reduce preserves this behavior
- Single element: Both patterns return the same value

**Reference implementations** already exist in codebase:
- `mcp_server/lib/search/intent-classifier.ts` — safe reduce pattern
- `mcp_server/lib/search/rrf-fusion.ts` — safe reduce pattern

**Confirmed locations:**

| # | File | Line(s) | Pattern | Confirmed By |
|---|------|:-------:|---------|:------------:|
| 1 | `search/rsf-fusion.ts` | 101-104 | `Math.max(...scores)` | G2, G4 |
| 2 | `search/rsf-fusion.ts` | 210-211 | `Math.max(...values)` | G2, G4 |
| 3 | `search/causal-boost.ts` | 227 | `Math.max(...values)` | G4 |
| 4 | `search/evidence-gap-detector.ts` | 157 | `Math.max(...gaps)` | G4 |
| 5 | `cognitive/prediction-error-gate.ts` | 484-485 | `Math.min(...similarities)` | G2, G5 |
| 6 | `telemetry/retrieval-telemetry.ts` | 184 | `Math.max(...scores)` | G2, G5 |
| 7 | `eval/reporting-dashboard.ts` | 303-304 | `Math.max/min(...)` | G2, G5 |

**Additional verification needed:**
- G4 found 25 total matches. Remaining ~18 are likely in test files. Run `grep -rn 'Math\.\(max\|min\)(\.\.\.' mcp_server/ shared/` to identify all, then classify as production vs test.
- Test files: Apply same fix for consistency, but lower priority.

### Step 3: Fix Session-Manager Transaction Gap (NEW-1)

**File:** `mcp_server/lib/session/session-manager.ts` (L429-440)
**Effort:** 0.5h optimistic / 1h realistic
**Risk:** Medium — concurrency-sensitive code change

**Current code (unsafe):**
```ts
async runBatch(entries: SessionEntry[]) {
  // enforceEntryLimit is OUTSIDE the transaction
  await this.enforceEntryLimit();

  this.db.transaction(() => {
    for (const entry of entries) {
      this.insertEntry(entry);
    }
  })();
}
```

**Fixed code:**
```ts
async runBatch(entries: SessionEntry[]) {
  this.db.transaction(() => {
    this.enforceEntryLimit();  // INSIDE transaction — atomic with inserts
    for (const entry of entries) {
      this.insertEntry(entry);
    }
  })();
}
```

**Why this matters:** Unlike the handler transaction gaps (P2, mitigated by single-process better-sqlite3), session batch operations may be triggered by multiple concurrent MCP requests arriving simultaneously. Two concurrent `runBatch` calls could both pass `enforceEntryLimit`, then both insert, exceeding the limit.

**Verification:** After fix, confirm `enforceEntryLimit` is synchronous (no await needed inside transaction) and that the transaction correctly rolls back on limit violation.

### Step 4: Fix implementation-summary.md Propagation Failures (P1)

**File:** `implementation-summary.md`
**Effort:** 0.5h optimistic / 1h realistic
**Risk:** Low — documentation only

Apply 8 corrections from deep-dives that were discovered but never propagated:

| # | Section | Current Text | Corrected Text | Source |
|---|:-------:|-------------|---------------|--------|
| 1 | Exec Summary | "23 MCP tools" | "25 MCP tools" | Codex: verified all 25 across L1-L7 tiers in `tool-schemas.ts` |
| 2 | Section 2 | "should be 11" | "12 processing steps (9 score-affecting)" | Codex + G1 verification |
| 3 | Section 6 | "P1 — Template literal SQL" (5 files) | "P2 — Template literal SQL (2 files; 3/5 confirmed FALSE_POSITIVE)" | Codex: memory-crud-list.ts, mutation-ledger.ts, causal-edges.ts use fixed fragments |
| 4 | Section 6 | "P1 — Missing transaction boundaries" | "P2 — Missing transaction boundaries (mitigated by single-process better-sqlite3)" | Ultra-think meta-review L143 |
| 5 | Section 1 | "retry-manager is a shim over mcp_server (should be in shared/)" | Remove entirely — zero functional overlap confirmed | Multi-agent deep review Section 1 |
| 6 | Section 5 | "Move retry-manager to shared/" | Remove — debunked recommendation | Same source |
| 7 | (new) | Not present | Add: "stage2-fusion.ts has internal docblock inconsistency: header=11 steps, docblock=9 steps, code=12 steps" | Ultra-think meta-review |
| 8 | (new) | Not present | Add: "Positive confirmations from audit: monorepo structure correct, no circular deps, AI-WHY comments excellent" | Wave 2 Opus cross-reference (observations O-1 through O-5) |

### Step 5: Fix stage2-fusion.ts Internal Docs (P2-18)

**File:** `mcp_server/lib/search/pipeline/stage2-fusion.ts`
**Effort:** 0.25h optimistic / 0.5h realistic
**Risk:** Low — comments only, no functional change

Update 2 locations to list all 12 processing steps consistently:
1. Module header comment block (L20-31) — currently lists 11 steps (missing step 2a: co-activation spreading)
2. Function docblock (L462-470) — currently lists 9 steps (missing 2a, 8, 9)

Reference: The actual code at L335-515 executes all 12 steps. The header and docblock should match.

---

## Tier 2: Near-Term

**Estimated effort:** 4.85h optimistic / 8-12h realistic
**Dependencies:** See dependency chain below

### Dependency Graph

```
T2-8 (better-sqlite3 tension)
  └── T2-2 (workspace deps)
        └── T2-1 (import aliases)
              └── T2-11 (duplicate deps - Tier 3, but depends on T2-8)

All other T2 items are independent.
```

### Step 6: Standardize scripts/ imports (T2-1)

**Depends on:** T2-2 (workspace deps must exist before aliases work)
**Files:** 4+ files in `scripts/`
**Effort:** 1.0h

Convert relative imports:
```ts
// Before (unsafe — bypasses package boundaries)
import { SearchFlags } from '../../mcp_server/lib/search/search-flags';

// After (uses monorepo aliases)
import { SearchFlags } from '@spec-kit/mcp-server/lib/search/search-flags';
```

**Verification:** `tsc --noEmit` should pass after conversion.

### Step 7: Add workspace deps (T2-2)

**Depends on:** T2-8 (better-sqlite3 must be resolved first)
**File:** `scripts/package.json`
**Effort:** 0.5h

Add:
```json
{
  "dependencies": {
    "@spec-kit/shared": "workspace:*",
    "@spec-kit/mcp-server": "workspace:*"
  }
}
```

### Step 8: Extract DB_PATH constant (T2-3)

**Independent**
**Files:** `shared/config.ts` + 4 consumer files
**Effort:** 0.5h

Create:
```ts
// shared/config.ts
export const DB_PATH = path.join(__dirname, '../../mcp_server/database/speckit.db');
```

Then replace hardcoded `path.join(__dirname, '../../../mcp_server/database/...')` in:
- `cleanup-orphaned-vectors.ts`
- 3 additional files (identify via grep)

### Step 9: Fix AI-TRACE compliance (T2-4)

**Independent**
**Files:** 3+ files
**Effort:** 0.5h

Task tokens (T005, C138, R10, P1-015 etc.) must use `AI-TRACE` prefix format. Currently bare tokens.

### Step 10: Add transaction wrappers (T2-5)

**Independent**
**Files:** `memory-crud-update.ts`, `memory-crud-delete.ts`
**Effort:** 0.5h
**Risk:** Low — P2 improvement, single-process mitigates concurrency risk

Wrap `handleMemoryUpdate` steps 3-5 (embedding regen, vector update, metadata update) in `db.transaction()`. Wrap single-delete path similarly.

### Step 11: Fix BM25 trigger phrase re-index gate (T2-6)

**Independent**
**File:** `memory-crud-update.ts` L134
**Effort:** 0.25h

Current: Only re-indexes BM25 when title changes.
Fixed: Re-index when title OR triggerPhrases change.

```ts
// Before
if (titleChanged) { bm25Index.reindex(id); }

// After
if (titleChanged || triggerPhrasesChanged) { bm25Index.reindex(id); }
```

### Step 12: Investigate dual dist paths (T2-7)

**Independent**
**File:** `reindex-embeddings.ts` L45-46
**Effort:** 0.25h

Two different `dist` paths are referenced — one must be wrong:
- `../../mcp_server/dist`
- `../../../mcp_server/dist`

Verify which resolves correctly from the file's location and fix the other.

### Step 13: Resolve better-sqlite3 dependency tension (T2-8) — DO FIRST

**Independent — but blocks T2-2 → T2-1**
**Files:** `scripts/package.json`, `folder-detector.ts:942`
**Effort:** 0.5h

Codex says remove better-sqlite3 from scripts/package.json. Opus says `folder-detector.ts:942` needs it.
Investigation needed:
1. Does folder-detector.ts import better-sqlite3 directly, or through @spec-kit/shared?
2. If direct: keep the dependency, document why
3. If indirect: remove from scripts/, let monorepo hoisting handle it

### Step 14: Fix P1 code standards (T2-9)

**Independent**
**Effort:** 0.5h

1. `memory-save.ts:64`: Rename `specFolderLocks` → `SPEC_FOLDER_LOCKS` (module-level constant)
2. Fix import ordering violations in flagged files

### Step 15: Fix wave4-synthesis structural issue (T2-10)

**Independent**
**Effort:** 0.25h

Option A: Create `scratch/wave4-synthesis.md` summarizing Wave 4 findings (preferred — maintains wave pattern).
Option B: Add note to tasks.md explaining Wave 4 content was folded into `wave4-opus-phase017-bugs.md`.

### Step 16: Annotate C138 deep-review error (T2-11)

**Independent**
**File:** `z_archive/multi-agent-deep-review.md`
**Effort:** 0.1h

Add correction note at L214 and L224 where C138 is called "fabricated":
```
> **CORRECTION (2026-03-02):** C138 is NOT fabricated. It exists at
> `wave3-gemini-mcp-standards.md:L32`. This accusation was verified as
> incorrect by source read, G3 Gemini audit, and ultra-think review.
```

---

## Tier 3: Future (Dedicated Spec Required)

**Estimated effort:** 19.7h optimistic / 50-70h realistic
**15 items** — full details in `scratch/opus-coverage-gaps.md` Part 3

| ID | Description | Est. (opt) | Est. (real) | Key Files |
|----|-------------|:----------:|:-----------:|-----------|
| T3-1 | Code standards alignment (19 files) | 2.5h | 4-6h | 19 files across mcp_server/ |
| T3-2 | Transaction boundary audit (storage/graph/learning) | 2.0h | 4-6h | 12+ files in 4 subdirs |
| T3-3 | Deep review of eval/ (14% of lib/) | 3.0h | 12-20h | 15 files, 7,051 LOC |
| T3-4 | Deep review of cognitive/ | 2.0h | 6-10h | 10 files, 3,795 LOC |
| T3-5 | Deep review of storage/ | 2.0h | 6-10h | 12 files, 4,831 LOC |
| T3-6 | Verify "89 feature flags" claim | 1.0h | 2-3h | Multiple flag sources |
| T3-7 | Fix stemmer dedup (bm25-index.ts L84-88) | 0.5h | 1h | 1 file |
| T3-8 | Evaluate persistent embedding cache (REQ-S2-001) | 1.0h | 2-3h | retry-manager.ts |
| T3-9 | Remove content-normalizer TODO | 0.1h | 0.1h | 1 file |
| T3-10 | Update spec.md metadata tool count | 0.1h | 0.1h | 1 file |
| T3-11 | Remove duplicate deps (post T2-8) | 0.25h | 0.5h | scripts/package.json |
| T3-12 | Phase D reindex entry point API | 1.0h | 2-3h | mcp_server/index.ts |
| T3-13 | isFeatureEnabled() divergence check | 0.25h | 0.5h | 2 files |
| T3-14 | Verify remaining 25/35 Phase 017 fixes | 2.0h | 4-6h | Multiple files |
| T3-15 | Error handling / circuit breaker analysis | 2.0h | 4-6h | errors/ + boundaries |

---

## Tier 4: Cross-AI Validation Review Findings (2026-03-02)

**Source:** Gemini 3.1 Pro + Codex gpt-5.3-codex independent reviews of all Phase 7 work
**Estimated effort:** 8-12h optimistic / 16-24h realistic
**Dependencies:** None — all independent of Tiers 1-3

### Review Context

Two independent AI reviewers analyzed the entire 018 spec folder and all modified source files. Gemini graded the phase **A** (generous on process quality), Codex graded **C+** (skeptical of completion claims). The delta surfaced important findings missed by the original multi-agent audit.

### Step 17: Fix Test Suite False-Pass Risk [CR-P0-1] — CRITICAL

**Source:** Codex (confirmed by sandbox execution attempt)
**Files:** `mcp_server/tests/memory-crud-extended.vitest.ts`
**Effort:** 1.5h optimistic / 3h realistic
**Risk:** HIGH — test suite can report green without exercising any handler code

The test suite can silently short-circuit and pass with zero behavior exercised:
- Import failures are swallowed at L134, L137
- Early-return patterns at L482, L824 skip tests if setup fails
- Assertions are often permissive (`toBeDefined`/truthy) rather than contract checks (L885, L943, L1046)

**Fix:**
1. Remove or replace import try/catch with fail-fast: if imports fail, the suite must fail
2. Convert early-return skips into explicit `test.skip()` or `beforeAll` failures
3. Strengthen weak assertions: replace `toBeDefined` with exact value/type checks where contracts exist

**Verification:** Run test suite with deliberately broken imports → must fail, not silently pass.

### Step 18: Fix Swallowed Deletion Exceptions [CR-P1-1]

**Source:** Gemini + Codex (both found independently)
**File:** `mcp_server/handlers/memory-crud-delete.ts`
**Effort:** 0.5h
**Risk:** Medium — orphaned causal edges if edge deletion fails silently

Causal edge cleanup failures (`deleteEdgesForMemory`) are caught and ignored inside the transaction. If edge deletion throws, the parent memory is still deleted, leaving orphaned edges pointing to non-existent memories.

**Fix:** Ensure `deleteEdgesForMemory` failure either (a) rolls back the transaction, or (b) is explicitly logged and tracked for later cleanup.

### Step 19: Fix Top-K Ranking Correctness [CR-P1-2]

**Source:** Codex
**File:** `mcp_server/lib/search/pipeline/stage2-fusion.ts` L638, L662
**Effort:** 0.5h
**Risk:** Medium — incorrect results returned to users

Feedback score updates mutate scores after initial sorting, but no re-sort is guaranteed before the top-K slice. Results could be returned in wrong order after feedback adjustment.

**Fix:** Add explicit `sort()` by effective score immediately before any `slice()` that produces final results.

### Step 20: Fix Dedup Canonical Identity [CR-P1-3]

**Source:** Codex
**File:** `mcp_server/handlers/memory-save.ts` L992, L1157, L1162
**Effort:** 1.0h optimistic / 2h realistic
**Risk:** Medium — dedup can return chunk child instead of parent

Duplicate-by-hash queries may return a chunk child row instead of the canonical parent memory, because chunks share the parent's `content_hash` and the query has no `ORDER BY` or `WHERE parent_id IS NULL` filter.

**Fix:** Add `WHERE parent_id IS NULL` or `ORDER BY parent_id ASC NULLS FIRST LIMIT 1` to dedup queries to ensure the canonical parent is always returned.

### Step 21: Fix Session Dedup Undefined-ID Collapse [CR-P1-4]

**Source:** Codex
**File:** `mcp_server/lib/session/session-manager.ts` L341, L370, L660
**Effort:** 0.5h
**Risk:** Medium — multiple memories with undefined IDs collapse into single dedup entry

Session batch dedup uses a `Map` keyed by memory `id`, but `id` is optional. Multiple memories with `undefined` id would all map to the same key, causing silent data loss.

**Fix:** Guard dedup map insertion: skip dedup for entries with no `id`, or use a composite key (e.g., `id ?? content_hash`).

### Step 22: Fix Cache Availability Regression [CR-P1-5]

**Source:** Codex
**File:** `mcp_server/handlers/memory-search.ts` L753, L789
**Effort:** 0.5h
**Risk:** Medium — cache hits blocked when embedding model unavailable

Embedding readiness gate runs before cache lookup. When the embedding model is unavailable (rate-limited, down), requests that would be cache hits still fail because the gate rejects them before checking the cache.

**Fix:** Move cache lookup before the embedding readiness gate. If cache hit → return immediately. Only check model availability on cache miss.

### Step 23: Fix Partial-Update Transaction Boundary Leak [CR-P1-6]

**Source:** Codex
**File:** `mcp_server/handlers/memory-crud-update.ts` L97, L99, L135
**Effort:** 0.5h
**Risk:** Medium — inconsistent state on partial failure

In the partial-update path (`allowPartialUpdate: true`), embedding status can be mutated outside the transaction boundary. If the subsequent transaction fails, the embedding status is already changed, leaving the memory in an inconsistent state.

**Fix:** Move all state mutations (including embedding status flags) inside the transaction boundary, even in partial-update mode.

### Step 24: Reconcile Cross-Document Contradictions [CR-P1-7]

**Source:** Codex (identified 4+ specific contradictions)
**Files:** `spec.md`, `checklist.md`, `implementation-summary.md`, `handover.md`
**Effort:** 1.0h
**Risk:** Low — documentation only, but undermines trust in completion claims

Specific contradictions:
1. `spec.md:7` says "In Progress" while `handover.md:4` says complete
2. `checklist.md:117` marks test pass while `:119` says "results pending"
3. Agent count: `handover.md:15` says 15 agents, `implementation-summary.md:33` says 17
4. Standards: `implementation-summary.md:52` says "all aligned", `:642` says "19/20 fail"

**Fix:** Walk through each doc and reconcile to a single truth set. Update spec.md status field to match actual completion state.

### Step 25: Fix Config Compatibility Mismatch [CR-P1-8]

**Source:** Codex
**Files:** `shared/config.ts:21`, `mcp_server/lib/search/vector-index.ts:170`
**Effort:** 0.5h
**Risk:** Medium — scripts and runtime could target different DB files

New shared DB config (`shared/config.ts`) uses only `SPEC_KIT_DB_DIR`, while existing core path logic in `vector-index.ts` still recognizes legacy env vars. Risk of split DB targeting across scripts vs runtime.

**Fix:** Unify all DB path resolution to use the same env var priority chain. Either update `shared/config.ts` to honor legacy vars, or migrate all consumers to the new var.

### Step 26: Remove @ts-nocheck from Test File [CR-P2-1]

**Source:** Gemini
**File:** `mcp_server/tests/memory-crud-extended.vitest.ts`
**Effort:** 2.0h optimistic / 4h realistic
**Risk:** Low — test-only, no production impact

The `@ts-nocheck` directive disables all TypeScript type checking in the test file, creating a blind spot for future refactoring. When core data structures change, the test file won't flag type mismatches at compile time.

**Fix:** Remove `@ts-nocheck`, fix all resulting type errors. May require proper typing of mock objects and test fixtures.

### Step 27: Address Inert Telemetry Module [CR-P2-2]

**Source:** Gemini + Codex (both found independently)
**File:** `mcp_server/lib/telemetry/retrieval-telemetry.ts:24`
**Effort:** 0.25h
**Risk:** Low — dead code path

`isExtendedTelemetryEnabled` is hardcoded to return `false`, making the entire extended telemetry module inert. If telemetry is expected for reporting, this is dead code.

**Fix:** Either (a) connect the flag to an env var / config so it can be enabled, or (b) document explicitly that extended telemetry is intentionally disabled and why.

### Step 28: Fix Reporting Dashboard Row Cap [CR-P2-3]

**Source:** Gemini + Codex (both found independently)
**File:** `mcp_server/lib/eval/reporting-dashboard.ts` L233, L350
**Effort:** 0.25h
**Risk:** Low — only affects dashboard accuracy at scale

Hardcoded `LIMIT 1000` on queries will silently drop sprint/channel data for large evaluation sets over time, biasing dashboard metrics.

**Fix:** Either (a) make the limit configurable, (b) add pagination, or (c) increase to a defensible ceiling with a logged warning when truncation occurs.

### Step 29: Decompose memory-save.ts [CR-P2-4]

**Source:** Gemini
**File:** `mcp_server/handlers/memory-save.ts`
**Effort:** 4.0h optimistic / 8h realistic
**Risk:** Medium — large refactor of core handler

At 2,700+ LOC, `memory-save.ts` is the largest single file and degrades maintainability despite good `AI-WHY` sectioning.

**Fix:** Extract into domain-specific modules: chunking logic, quality loops, duplicate detection, embedding orchestration. Each module should be independently testable.

### Step 30: Harden Non-Finite Score Handling [CR-P2-5]

**Source:** Codex
**File:** `mcp_server/lib/search/evidence-gap-detector.ts` L153, L158
**Effort:** 0.25h
**Risk:** Low — defensive improvement

No guard against `NaN`/`Infinity` scores propagating through the evidence gap detection pipeline. A single non-finite score could corrupt gap analysis results.

**Fix:** Add `Number.isFinite()` guards before score comparisons and aggregations.

---

## Tier 5: Architecture Scan — Code Placement & Boundary Issues (2026-03-02)

**Source:** Codex 5.3 architecture scan (181K tokens, read-only, full directory tree analysis)
**Estimated effort:** 12-20h optimistic / 30-50h realistic
**Dependencies:** None — independent of Tiers 1-4

### Scan Context

Codex analyzed the entire `system-spec-kit/` codebase (mcp_server ~60K LOC, shared ~5K LOC, scripts ~52K LOC) to assess whether code is in the correct/logical location. The scan identified 6 misplacements, 6 boundary violations, 2 circular dependencies, and 7 god files.

### Step 31: Create Stable Indexing API [ARCH-1] — HIGH

**Severity:** HIGH — scripts/core and scripts/memory import mcp_server internals directly
**Files:**
- `scripts/core/memory-indexer.ts` — imports `@spec-kit/mcp-server/lib/search/vector-index`, `core/config`
- `scripts/memory/reindex-embeddings.ts` — dynamic requires against `mcp_server/dist` internals
**Effort:** 4h optimistic / 8h realistic

**Fix:** Create `mcp_server/indexing-api.ts` that exports a stable public API for indexing operations. Scripts should import from this API, not from internal `lib/` modules. This is the single most impactful boundary fix.

**Current coupling chain:**
```
scripts/core/memory-indexer.ts → @spec-kit/mcp-server/lib/search/vector-index
scripts/memory/reindex-embeddings.ts → mcp_server/dist/* (dynamic)
scripts/evals/run-performance-benchmarks.ts → mcp_server/lib/* (multiple)
scripts/evals/run-chk210-quality-backfill.ts → @spec-kit/mcp-server/lib/parsing/memory-parser
scripts/lib/retry-manager.ts → re-export from mcp_server/lib/providers/retry-manager.ts
```

### Step 32: Consolidate Eval CLIs [ARCH-2] — MEDIUM

**Severity:** MEDIUM — eval scripts split across mcp_server/scripts/ and scripts/evals/
**Files to move:**
- `mcp_server/scripts/run-bm25-baseline.ts` → `scripts/evals/`
- `mcp_server/scripts/run-ablation.ts` → `scripts/evals/`
- `mcp_server/scripts/map-ground-truth-ids.ts` → `scripts/evals/`
**Effort:** 1h optimistic / 2h realistic

**Fix:** Move all CLI/eval runners to `scripts/evals/`. Keep only runtime eval code (DB logging, ablation framework core) in `mcp_server/lib/eval/`. Update `mcp_server/scripts/README.md` references.

### Step 33: Split vector-index-impl.ts [ARCH-3] — HIGH

**Severity:** HIGH — 4,276 LOC god file mixing schema, CRUD, vector ops, search, alias handling
**File:** `mcp_server/lib/search/vector-index-impl.ts`
**Effort:** 6h optimistic / 12h realistic

**Fix:** Split into focused modules:
- `vector-schema.ts` — table creation, migrations
- `vector-mutations.ts` — CRUD operations (insert, update, delete)
- `vector-store.ts` — vector similarity operations
- `vector-queries.ts` — search helper functions
- `vector-aliases.ts` — path/alias handling

### Step 34: Extract Pure Algorithms to shared/ [ARCH-4] — MEDIUM

**Severity:** LOW-MEDIUM — pure algorithms locked inside mcp_server
**Files:**
- `mcp_server/lib/search/rrf-fusion.ts` → `shared/algorithms/`
- `mcp_server/lib/search/adaptive-fusion.ts` → `shared/algorithms/`
- `mcp_server/lib/search/mmr-reranker.ts` → `shared/algorithms/`
- `mcp_server/lib/contracts/retrieval-trace.ts` → `shared/contracts/`
**Effort:** 2h optimistic / 4h realistic

**Fix:** Move pure algorithm/contract code (no MCP protocol dependency) to `shared/`. This enables script/eval reuse without mcp_server coupling.

### Step 35: Fix shared/config.ts Layout Coupling [ARCH-5] — MEDIUM

**Severity:** MEDIUM — shared layer hardcodes `../../mcp_server/database/` path
**File:** `shared/config.ts`
**Effort:** 1h optimistic / 2h realistic

**Fix:** Split into:
- `shared/config.ts` — pure config (env var reading, defaults as abstract values)
- `mcp_server/core/paths.ts` — runtime path resolution using `shared/config`
- `scripts/core/paths.ts` — script path resolution using `shared/config`

### Step 36: Break Handler God Files [ARCH-6] — HIGH

**Severity:** HIGH — maintainability risk from oversized handler files
**Files:**
- `memory-save.ts` (2,788 LOC) — extract chunking, quality loop, PE gating, eval logging
- `memory-search.ts` (1,064 LOC) — move search orchestration deeper into `lib/search`
- `hybrid-search.ts` (1,539 LOC) — split by stage/services
- `session-manager.ts` (1,140 LOC) — separate dedup/recovery/persistence
**Effort:** 8h optimistic / 16h realistic

### Step 37: Fix Circular Dependencies [ARCH-7] — MEDIUM

**Severity:** MEDIUM — type import cycles can cause runtime issues
**Circular deps found:**
1. `hybrid-search.ts` ↔ `graph-search-fn.ts` (type import cycle)
2. `memory-crud.ts` ↔ `memory-crud-health.ts`
**Effort:** 1h optimistic / 2h realistic

**Fix:** Extract shared types into a common `types.ts` that both files import. For handler cycle, merge or introduce a shared interface file.

### Step 38: Remove retry-manager Re-export Shim [ARCH-8] — LOW

**Severity:** LOW — unnecessary indirection
**File:** `scripts/lib/retry-manager.ts` — re-export of `mcp_server/lib/providers/retry-manager.ts`
**Effort:** 0.5h

**Fix:** Remove shim. Update consumers to import via the indexing API (Step 31) or directly from provider with documented dependency.

### Step 39: Move Ground Truth Data to JSON Asset [ARCH-9] — LOW

**Severity:** LOW — data-heavy file inflating code metrics
**File:** `mcp_server/lib/eval/ground-truth-data.ts` (1,690 LOC)
**Effort:** 1h

**Fix:** Extract dataset to `mcp_server/lib/eval/data/ground-truth.json` and import. Code file becomes thin loader.

---

## Verification Plan

### After Tier 1 Completion

| # | Check | Command / Method | Expected Result |
|---|-------|-----------------|-----------------|
| 1 | Math.max spread eliminated | `grep -rn 'Math\.\(max\|min\)(\.\.\.' mcp_server/lib/` | 0 matches in production code |
| 2 | Session tx gap fixed | Read `session-manager.ts:429-440` | enforceEntryLimit inside db.transaction() |
| 3 | Summary docs match code | Cross-reference 13 corrections against source files | All file:line evidence matches |
| 4 | impl-summary consistent | Search for "23 MCP tools", "P1.*SQL", "P1.*transaction", "shim" | 0 stale references |
| 5 | stage2-fusion docs aligned | Compare header (L20-31), docblock (L462-470), code (L335-515) | All list 12 steps |
| 6 | Test suite passes | Run test suite (vitest) | Exit 0, no regressions |
| 7 | Health score re-assessed | Re-run 6-dimension scoring | ≥80/100 target |

### After Tier 2 Completion

| # | Check | Command / Method | Expected Result |
|---|-------|-----------------|-----------------|
| 8 | Import aliases resolve | `tsc --noEmit` on scripts/ | 0 errors |
| 9 | DB_PATH consistent | `grep -rn 'path.join.*database' mcp_server/ scripts/` | All use shared constant |
| 10 | No import regressions | Build succeeds | Exit 0 |
| 11 | Wave4 structural fix | `ls scratch/wave4-synthesis.md` or check tasks.md note | File exists or note present |
| 12 | C138 annotated | Read z_archive/multi-agent-deep-review.md L214 | Correction note present |

### Rollback Strategy

All Tier 1 and Tier 2 changes can be reverted via git:
- Documentation changes: `git checkout -- summary_of_existing_features.md implementation-summary.md`
- Code changes: `git checkout -- mcp_server/lib/` (Math.max and session-manager fixes)
- No database migrations, no config changes, no infrastructure changes
<!-- /ANCHOR:summary -->

## Technical Context
Current plan scope remains documentation and validation normalization for this phase.

## Phase 1: Validation Alignment
- Normalize checklist metadata and evidence syntax.
- Re-run validator and resolve residual warnings.

## Phase 2: Validation Alignment
- Normalize checklist metadata and evidence syntax.
- Re-run validator and resolve residual warnings.

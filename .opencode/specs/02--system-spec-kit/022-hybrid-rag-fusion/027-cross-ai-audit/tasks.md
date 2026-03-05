---
title: "Tasks: 018 - Refinement Phase 7"
description: "Task ledger for cross-AI audit execution and remediation actions in Phase 7."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
importance_tier: "critical"
contextType: "implementation"
---

# Tasks: 018 — Refinement Phase 7

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:summary -->

## Audit Execution (Complete)

### Wave Execution

| Wave | Focus | Models | Result | Deliverables |
|:----:|-------|--------|--------|-------------|
| 1 | Script location & architecture | Gemini + Codex + Opus | Architecture sound. No circular deps. Coupling issues in scripts/ | `z_archive/wave1-{gemini,codex,opus,synthesis}.md` |
| 2 | Summary document verification | Gemini + Codex + Opus | `summary_of_new_features.md` perfect (15/15). `summary_of_existing_features.md` has 13 errors | `z_archive/wave2-{gemini,codex,opus,synthesis}.md` |
| 3 | Code standards review | Gemini + Codex | 19/20 files fail (consistent internal convention, divergent from standard) | `z_archive/wave3-{gemini,codex,synthesis}.md` |
| 4 | Bug detection & phase verification | Opus | 10/10 Phase 017 fixes verified. 0 critical bugs. 6 P2 findings | `z_archive/wave4-opus-phase017-bugs.md` |

### Deep-Dives & Meta-Reviews

- [x] Deep-dive: Codex verification of cross-AI contradictions → `z_archive/deep-dive-codex-verification.md`
- [x] Deep-dive: Gemini doc issues → `z_archive/deep-dive-gemini-doc-issues.md`
- [x] Deep-dive: Gemini flag audit → `z_archive/deep-dive-gemini-flag-audit.md`
- [x] Deep-dive: Gemini SQL safety → `z_archive/deep-dive-gemini-sql-safety.md`
- [x] Deep-dive: Gemini phase 015-016 verification → `z_archive/deep-dive-gemini-phase015-016.md`
- [x] Deep-dive: Gemini tool count → `z_archive/deep-dive-gemini-tool-count.md`
- [x] Meta-review: Ultra-think severity recalibration → `z_archive/ultra-think-opus-meta-review.md`
- [x] Meta-review: 11-agent multi-agent deep review → `z_archive/multi-agent-deep-review.md`

### 8-Agent Orchestrated Review

- [x] G1: Verify 4 P0 findings (Gemini @review) — All 4 CONFIRMED → `/tmp/g1-p0-verify.txt`
- [x] G2: Verify 7 P1 findings (Gemini @review) — All 7 CONFIRMED → `/tmp/g2-p1-verify.txt`
- [x] G3: Consistency audit of implementation-summary.md (Gemini @review) → `/tmp/g3-consistency.txt`
- [x] G4: Git history check for resolved findings (Gemini @context) → `/tmp/g4-git-history.txt`
- [x] G5: Coverage gap scan of uncovered areas (Gemini @review) — 1 HIGH + 2 LOW new → `/tmp/g5-coverage-gaps.txt`
- [x] O1: Authoritative Findings Registry (Opus, 90/100) → `scratch/opus-findings-registry.md`
- [x] O2: Synthesis Quality & Propagation Audit (Opus, 90/100) → `scratch/opus-synthesis-audit.md`
- [x] O3: Coverage Gap Analysis & Action Plan (Opus, 88/100) → `scratch/opus-coverage-gaps.md`

### Quality Assurance

- [x] Ultra-think quality review of all 4 audit documents (5-strategy analysis)
- [x] Cross-document reconciliation: C138 contradiction resolved, A-IDs aligned, health score unified at 77.4, finding count unified at 33

---

## Tier 1: Immediate — Critical Path

**Effort:** 5.25h optimistic / 8-10h realistic | **Dependencies:** None | **Risk:** Low

### T1-1: Fix summary_of_existing_features.md — P0 corrections [P0] [3/3 models agree]

**File:** `summary_of_existing_features.md` | **Effort:** 1.5h opt / 2-3h real

- [x] **P0-1** Signal count: "9" → "12 processing steps (9 score-affecting)"
  - Source: `mcp_server/lib/search/pipeline/stage2-fusion.ts:404`
  - G1 verified all 12 steps. Codex provided "12 stages, 9 score-affecting" nuance. 3/3 models agree.
  - The 12 steps: score resolution, co-activation spreading, query-term overlap, trigger phrase match, contiguity bonus, causal neighbor boost, BM25 integration, summary channel fusion, temporal decay, quality weighting, intent-aware adjustment, final normalization
- [x] **P0-2** Remove V1 pipeline (`postSearchPipeline`) references — removed Phase 017
  - Source: `mcp_server/handlers/memory-search.ts:599` — only removal comment remains
  - G1: `grep -r 'postSearchPipeline'` returns 0 active implementations. 3/3 models agree.
- [x] **P0-3** Mark `SPECKIT_PIPELINE_V2` as deprecated (always true)
  - Source: `mcp_server/lib/search/search-flags.ts:101` — hardcoded `return true`
  - G1 confirmed. 3/3 models agree.
- [x] **P0-4** Add `resolveEffectiveScore()` documentation
  - Source: `mcp_server/lib/search/pipeline/types.ts:56` — cascading fallback: compositeScore → fusionScore → rrf_score → similarity
  - G1 confirmed signature and purpose. 3/3 models agree.

**Acceptance:** All 4 corrections present. `grep -r 'postSearchPipeline' summary_of_existing_features.md` returns 0. Signal count says "12 processing steps (9 score-affecting)".

### T1-2: Fix summary_of_existing_features.md — P1 corrections [P1] [2-3/3 models agree]

**File:** `summary_of_existing_features.md` | **Effort:** 1.0h opt / 1.5h real

- [x] **P1-7** `memory_update` embedding scope (title+content, not title-only)
  - Source: `mcp_server/handlers/memory-crud-update.ts:89-91` — `const embeddingInput = contentText ? \`${title}\n\n${contentText}\` : title`
  - G2 confirmed. 3/3 models agree.
- [x] **P1-8** `memory_delete` cleanup scope (vectorIndex + causalEdges, not 1 table)
  - Source: `mcp_server/handlers/memory-crud-delete.ts:74,80` — two explicit cleanup calls
  - G2 confirmed. 3/3 models agree.
- [x] **P1-9** Five-factor weight auto-normalization — add documentation
  - Source: `mcp_server/lib/scoring/composite-scoring.ts:544-548` — auto-normalizes when `Math.abs(wSum - 1.0) > 0.001`
  - G2 confirmed. 2/3 models agree.
- [x] **P1-10** R8 summary embedding channel — add to Stage 1 listing
  - Source: `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:507-565` — gated by `isMemorySummariesEnabled()`
  - G2 confirmed. 3/3 models agree.
- [x] **P1-5** Add `SPECKIT_ADAPTIVE_FUSION` to feature flag documentation
  - Source: `mcp_server/lib/search/adaptive-fusion.ts:65,74` — `const FEATURE_FLAG = 'SPECKIT_ADAPTIVE_FUSION'`
  - G2 confirmed. 2/3 models agree.

**Acceptance:** All 5 features documented with correct descriptions matching source code.

### T1-3: Fix summary_of_existing_features.md — P2 corrections [P2]

**File:** `summary_of_existing_features.md` | **Effort:** 0.5h

- [x] Quality gate persistence documentation
- [x] Canonical ID dedup documentation
- [x] memory_save summary generation documentation
- [x] bulk_delete cleanup scope documentation

**Acceptance:** All 4 items present in document.

### T1-4: Fix Math.max/min spread patterns [P1] [3/3 models agree]

**Files:** 8 production files | **Effort:** 1.0h opt / 2-3h real | **Risk:** Medium

**Pattern:** Replace `Math.max(...arr)` → `arr.reduce((a, b) => Math.max(a, b), -Infinity)`
**Reference:** Safe pattern already in `intent-classifier.ts` and `rrf-fusion.ts`

- [x] `mcp_server/lib/search/rsf-fusion.ts` L101-104 — `Math.max(...scores)`
  - Confirmed by G2 at exact line numbers. G4 found active match.
- [x] `mcp_server/lib/search/rsf-fusion.ts` L210-211 — `Math.max(...values)` (2nd occurrence)
  - Confirmed by G4.
- [x] `mcp_server/lib/search/causal-boost.ts` L227 — `Math.max(...values)`
  - Confirmed by G4.
- [x] `mcp_server/lib/search/evidence-gap-detector.ts` L157 — `Math.max(...gaps)`
  - Confirmed by G4.
- [x] `mcp_server/lib/cognitive/prediction-error-gate.ts` L484-485 — `Math.min(...similarities)`
  - Confirmed by G2 and G5.
- [x] `mcp_server/lib/telemetry/retrieval-telemetry.ts` L184 — `Math.max(...scores)`
  - Confirmed by G2 and G5.
- [x] `mcp_server/lib/eval/reporting-dashboard.ts` L303-304 — `Math.max/min(...)`
  - Confirmed by G2 and G5.
- [x] Verify remaining G4 matches (25 total) — classify production vs test files
  - Run: `grep -rn 'Math\.\(max\|min\)(\.\.\.' mcp_server/ shared/`
  - Fix production files. Note test files for later.

**Acceptance:** `grep -rn 'Math\.\(max\|min\)(\.\.\.' mcp_server/lib/` returns 0 matches. Test suite passes.

### T1-5: Fix session-manager.ts transaction gap [P1/HIGH — NEW-1] [G5 only]

**File:** `mcp_server/lib/session/session-manager.ts` L429-440 | **Effort:** 0.5h opt / 1h real | **Risk:** Medium

- [x] Move `enforceEntryLimit` inside `db.transaction()` wrapper for `runBatch()`
  - Current: enforceEntryLimit outside transaction → concurrent requests can race past limits
  - Fix: Move inside transaction → atomic check-and-insert
  - Unlike handler tx gaps (single-process mitigated), session batches face real concurrency risk
- [x] Verify `enforceEntryLimit` is synchronous (no await needed inside transaction)
- [x] Verify transaction rolls back correctly on limit violation

**Acceptance:** `enforceEntryLimit` call is inside `db.transaction()` block. No regressions in session tests.

### T1-6: Fix implementation-summary.md — propagate 8 corrections [P1]

**File:** `implementation-summary.md` | **Effort:** 0.5h opt / 1h real

- [x] **Exec Summary:** Tool count 23 → 25
  - Source: Codex verified all 25 across L1-L7 tiers in `tool-schemas.ts`
- [x] **Section 2:** Signal count → "12 stages, 9 score-affecting"
  - Source: Codex deep-dive + G1 verification
- [x] **Section 6:** SQL template literals — annotate 3/5 as FALSE_POSITIVE, 2 remain P2
  - Source: Codex proved memory-crud-list.ts, mutation-ledger.ts, causal-edges.ts use fixed fragments
- [x] **Section 6:** Transaction boundaries → P2 (not P1)
  - Source: Ultra-think meta-review L143
- [x] **Section 1:** Remove retry-manager "shim" claim
  - Source: Multi-agent deep review — zero functional overlap confirmed
- [x] **Section 5:** Remove "move retry-manager to shared/" recommendation
  - Same source
- [x] **(New):** Add stage2-fusion.ts docblock inconsistency (header=11, docblock=9, code=12)
- [x] **(New):** Add positive confirmations (what NOT to change) from Wave 2 Opus observations O-1 to O-5

**Acceptance:** `grep -c '"23 MCP"' implementation-summary.md` = 0. No "P1.*SQL" or "P1.*transaction" references. No "shim" or "move.*shared" references to retry-manager.

### T1-7: Fix stage2-fusion.ts internal docs [P2] [confirmed by meta-review]

**File:** `mcp_server/lib/search/pipeline/stage2-fusion.ts` | **Effort:** 0.25h

- [x] Update module header (L20-31) to list all 12 processing steps
  - Currently lists 11 (missing step 2a: co-activation spreading)
- [x] Update function docblock (L462-470) to list all 12 steps
  - Currently lists 9 (missing 2a, 8, 9)

**Acceptance:** Header step count = docblock step count = code step count = 12.

---

## Tier 2: Near-Term

**Effort:** 4.85h optimistic / 8-12h realistic | **Execution order:** T2-8 → T2-2 → T2-1, then rest in any order

### T2-1: Standardize scripts/ imports [P1] [3/3 agree] — depends on T2-2

**Files:** 4+ files in `scripts/` | **Effort:** 1.0h

- [x] Identify all files with `../../mcp_server/` relative imports
  - Run: `grep -rn '\.\./\.\./mcp_server' scripts/`
- [x] Convert each to `@spec-kit/mcp-server/*` alias
- [x] Verify TypeScript compilation: `tsc --noEmit`

**Acceptance:** `grep -rn '\.\./\.\./mcp_server' scripts/` returns 0 matches. Build passes.

### T2-2: Add workspace deps [P1] — depends on T2-8

**File:** `scripts/package.json` | **Effort:** 0.5h

- [x] Add `@spec-kit/shared` and `@spec-kit/mcp-server` as workspace dependencies
  - SKIPPED: npm workspaces already handles via root symlinks; workspace:* is pnpm-only
- [x] Run `npm install` / `pnpm install` to update lockfile
  - SKIPPED: Not needed — npm workspace resolution handles this

**Acceptance:** `scripts/package.json` contains both workspace deps. Build passes.

### T2-3: Extract DB_PATH constant [P1] [3/3 agree]

**Files:** `shared/config.ts` + 4 consumer files | **Effort:** 0.5h

- [x] Create `DB_PATH` constant in `shared/config.ts`
- [x] Identify all hardcoded DB paths: `grep -rn 'path.join.*database' mcp_server/ scripts/`
- [x] Update each consumer to import from shared
  - cleanup-orphaned-vectors.ts updated to use shared config
- [x] Verify database connections still work

**Acceptance:** All DB path references use shared constant. Database operations work.

### T2-4: Fix AI-TRACE compliance [P1]

**Files:** 3+ files | **Effort:** 0.5h

- [x] Identify files with bare task tokens (T005, C138, R10, P1-015 etc.)
- [x] Add `AI-TRACE` prefix format to each
  - 19 tokens prefixed across memory-save.ts and memory-search.ts
- [x] Verify no functional code depends on token format

**Acceptance:** All task tokens use `AI-TRACE` prefix.

### T2-5: Add transaction wrappers [P2] [P1→P2 downgraded by meta-review]

**Files:** `memory-crud-update.ts`, `memory-crud-delete.ts` | **Effort:** 0.5h

- [x] Wrap `handleMemoryUpdate` steps 3-5 (embedding regen, vector update, metadata) in `db.transaction()`
- [x] Wrap single-delete path in `db.transaction()`
- [x] Note: single-process better-sqlite3 mitigates concurrency risk, making this P2 improvement

**Acceptance:** Both handlers use transaction wrappers. Tests pass.

### T2-6: Fix BM25 trigger phrase re-index gate [P2]

**File:** `memory-crud-update.ts` L134 | **Effort:** 0.25h

- [x] Expand re-index condition from title-only to title OR triggerPhrases changed
- [x] Verify BM25 index correctly reflects trigger phrase updates

**Acceptance:** Updating trigger phrases triggers BM25 re-index. Search finds updated trigger phrases.

### T2-7: Investigate dual dist paths [P1]

**File:** `reindex-embeddings.ts` L45-46 | **Effort:** 0.25h

- [x] Read both path references and determine which resolves correctly from file location
- [x] Fix the incorrect path
  - Wrong candidate removed from reindex-embeddings.ts
- [x] Verify the script can locate its imports

**Acceptance:** Only one dist path remains. Script executes without import errors.

### T2-8: Resolve better-sqlite3 dependency tension [P1] — DO FIRST in Tier 2

**Files:** `scripts/package.json`, `folder-detector.ts:942` | **Effort:** 0.5h

- [x] Check if `folder-detector.ts` imports better-sqlite3 directly or via @spec-kit/shared
- [x] If direct import: keep dependency, add comment explaining why
  - KEEP: 3 direct imports confirmed. Documented rationale.
- [x] If indirect (via shared/): remove from scripts/package.json, let hoisting handle it
  - N/A — direct imports found
- [x] Document resolution rationale

**Acceptance:** Dependency tension resolved with documented rationale. Build passes.

### T2-9: Fix P1 code standards [P1]

**Files:** 3 files | **Effort:** 0.5h

- [x] Rename `specFolderLocks` → `SPEC_FOLDER_LOCKS` in `memory-save.ts:64`
  - Module-level constant should use UPPER_SNAKE_CASE
  - G2 confirmed at exact line. 3/3 models agree.
- [x] Fix import ordering violations in flagged files
  - Reorder to: node builtins → external packages → internal (@spec-kit/) → relative
  - Fixed in memory-save.ts

**Acceptance:** Naming and ordering match sk-code--opencode conventions.

### T2-10: Fix wave4-synthesis structural issue [P2]

**Effort:** 0.25h

- [x] **Option A (preferred):** Create `scratch/wave4-synthesis.md` summarizing Wave 4 findings
  - Content: 10/10 Phase 017 fixes verified, 0 critical bugs, 6 P2 findings, cross-reference to `wave4-opus-phase017-bugs.md`
  - Created in z_archive/ as wave4-synthesis.md
- [ ] OR **Option B:** Add note to existing docs explaining Wave 4 synthesis was folded into `wave4-opus-phase017-bugs.md`

**Acceptance:** Either wave4-synthesis.md exists, or an explicit note explains its absence.

### T2-11: Annotate C138 deep-review error [P2]

**File:** `z_archive/multi-agent-deep-review.md` | **Effort:** 0.1h

- [x] Add correction note at L214 (synthesis quality table) and L224 (fabrication claim)
  - C138 EXISTS at `z_archive/wave3-gemini-mcp-standards.md:L32`
  - Verified by: direct source read, G3 Gemini audit, ultra-think review
  - The deep-review's accusation was itself incorrect
  - Correction annotations added at L216-218 and L230-232 in multi-agent-deep-review.md

**Acceptance:** Correction notes present at both locations.

---

## Tier 3: Future (Dedicated Spec Required)

**Effort:** 19.7h optimistic / 50-70h realistic | **Status:** Not started — requires separate spec folder

### T3-1: Code standards alignment pass [P2] — 2.5h opt / 4-6h real
- [ ] Convert 19 files from `// -------` separator headers to `// ---` box-drawing standard
- [ ] Convert narrative comments to AI-intent prefixes (AI-WHY, AI-TRACE, AI-NOTE)
- [ ] Files: 19 across `mcp_server/` (all fail sk-code--opencode systematically)

### T3-2: Transaction boundary audit [P2] — 2.0h opt / 4-6h real
- [ ] Specialized review of `storage/`, `extraction/`, `graph/`, `learning/` for side-effects outside `.transaction()` wrappers
- [ ] G5 recommendation: enforceEntryLimit pattern may be repeated beyond session-manager.ts
- [ ] Files: 12+ files across 4 subdirectories

### T3-3: Deep review of eval/ [P2] — 3.0h opt / 12-20h real
- [ ] 15 files, 7,051 LOC — largest blind spot (14% of lib/)
- [ ] Contains: ablation framework, shadow scoring, BM25 baseline, reporting dashboard
- [ ] G5 found Math.max spread in `reporting-dashboard.ts` (already covered in T1-4)
- [ ] Complex testing/evaluation logic may contain subtle correctness bugs

### T3-4: Deep review of cognitive/ [P2] — 2.0h opt / 6-10h real
- [ ] 10 files, 3,795 LOC
- [ ] Contains: working memory, archival manager, prediction error gate, co-activation
- [ ] G5 confirmed Math.max spread in `prediction-error-gate.ts` (already covered in T1-4)
- [ ] Complex stateful logic with implicit assumptions about session lifecycle

### T3-5: Deep review of storage/ [P2] — 2.0h opt / 6-10h real
- [ ] 12 files, 4,831 LOC — largest fully unreviewed directory
- [ ] Database operations, migration logic, vector index management
- [ ] G5 confirmed clean (no Math.max, TODO, FIXME, HACK) but no logic review performed
- [ ] Recommended for transaction boundary audit (DB-heavy operations)

### T3-6: Verify "89 feature flags" claim [P2] — 1.0h opt / 2-3h real
- [ ] Flag audit found 20 flags in `search-flags.ts`
- [ ] 69 unaccounted for — check `rollout-policy.ts`, cognitive/ modules, eval/ modules
- [ ] Determine if "89" is accurate or an overcount

### T3-7: Fix stemmer double-consonant dedup [P3] — 0.5h opt / 1h real
- [ ] Make dedup conditional on suffix removal in BM25 stemmer
- [ ] File: `mcp_server/lib/search/bm25-index.ts` L84-88
- [ ] Currently dedup applied unconditionally — affects quality, not correctness

### T3-8: Evaluate persistent embedding cache [P2] — 1.0h opt / 2-3h real
- [ ] REQ-S2-001 TODO at `providers/retry-manager.ts:219`
- [ ] Currently only in-memory — retries from scratch under rate-limit starvation
- [ ] Assess priority before production load increases rate-limit pressure

### T3-9: Remove content-normalizer TODO [P3] — 0.1h
- [ ] Clean up leftover `<!-- TODO: remove -->` placeholder at `parsing/content-normalizer.ts:62`

### T3-10: Update spec.md metadata [P2] — 0.1h
- [ ] Tool count from 23 to 25 in spec metadata

### T3-11: Remove duplicate deps [P2] — 0.25h (post T2-8)
- [ ] Remove better-sqlite3 and/or sqlite-vec from scripts/package.json if confirmed redundant after T2-8

### T3-12: Add Phase D reindex entry point [P2] — 1.0h opt / 2-3h real
- [ ] Export dedicated `reindex()` function from mcp_server
- [ ] Replace current 7-typeof-import bootstrap pattern in `reindex-embeddings.ts`
- [ ] Architecturally significant — recommended by Wave 1 Opus but lost in synthesis

### T3-13: Check isFeatureEnabled() divergence [P2] — 0.25h
- [ ] Verify whether `rollout-policy.ts` and `search-flags.ts` share implementation
- [ ] Opus found `isFeatureEnabled("1")` returns disabled — potential inconsistency
- [ ] Single-model finding (unverified)

### T3-14: Verify remaining Phase 017 fixes [P2] — 2.0h opt / 4-6h real
- [ ] Only 10/35 Phase 017 fixes were sampled and verified
- [ ] 25 remain unverified
- [ ] Priority: fixes touching search/, scoring/, handlers/ (critical path code)

### T3-15: Error handling / circuit breaker analysis [P2] — 2.0h opt / 4-6h real
- [ ] No cascading failure analysis performed across the codebase
- [ ] Examine `errors/` directory (3 files, 1,135 LOC — scan-only coverage)
- [ ] Map error boundaries throughout mcp_server/
- [ ] Assess: can a single handler failure cascade to affect other MCP tools?

---

## Tier 4: Cross-AI Validation Review Findings (2026-03-02)

**Source:** Independent reviews by Gemini 3.1 Pro (Grade: A) and Codex gpt-5.3-codex (Grade: C+)
**Effort:** 8-12h optimistic / 16-24h realistic | **Status:** Complete (14/14 implemented)
**Note:** Codex was significantly more critical than Gemini. Findings below are deduplicated; source attribution preserved.

### CR-P0-1: Fix test suite false-pass risk [P0] [Codex]

**File:** `mcp_server/tests/memory-crud-extended.vitest.ts` | **Effort:** 1.5h opt / 3h real | **Risk:** HIGH

- [x] Remove/replace swallowed import failures at L134, L137 — must fail-fast on broken imports
- [x] Convert early-return skip patterns at L482, L824 into explicit `test.skip()` or `beforeAll` failures
- [x] Strengthen permissive assertions (L885, L943, L1046) — replace `toBeDefined`/truthy with exact value/type checks
- [x] 21 `if (!optionalMod) return;` silent-skip patterns converted to `it.skipIf(!optionalMod)`. 5 optional module types. 65 required-module `throw` guards preserved.
- [x] Verify: 44 pass, 21 skipped, 0 fail.

**Acceptance:** Test suite fails on broken imports. No early-return patterns that silently skip tests. Contract-level assertions on handler outputs.

### CR-P1-1: Fix swallowed deletion exceptions [P1] [Gemini + Codex]

**File:** `mcp_server/handlers/memory-crud-delete.ts` | **Effort:** 0.5h

- [x] Ensure `deleteEdgesForMemory` failure rolls back transaction OR is logged/tracked
- [x] Currently: causal edge cleanup errors caught and ignored → orphaned edges possible
- [x] Verify: force `deleteEdgesForMemory` to throw → parent deletion must not succeed silently

**Acceptance:** Edge deletion failure either rolls back or is explicitly logged. No silent swallowing.

### CR-P1-2: Fix top-K ranking correctness [P1] [Codex]

**File:** `mcp_server/lib/search/pipeline/stage2-fusion.ts` L638, L662 | **Effort:** 0.5h

- [x] Add explicit `sort()` by effective score after feedback mutations, before any top-K `slice()`
- [x] Currently: feedback score updates may reorder results, but no re-sort before slice
- [x] Verify: create test with N results where feedback changes ordering → correct top-K returned

**Acceptance:** Results are always sorted by final effective score before any slice operation.

### CR-P1-3: Fix dedup canonical identity [P1] [Codex]

**File:** `mcp_server/handlers/memory-save.ts` L992, L1157, L1162 | **Effort:** 1.0h opt / 2h real

- [x] Add `WHERE parent_id IS NULL` or equivalent to dedup-by-hash queries
- [x] Currently: chunks share parent's `content_hash` → query may return chunk child instead of canonical parent
- [x] Verify: create parent+chunk with same hash → dedup returns parent, not chunk

**Acceptance:** Dedup queries always return canonical parent memory, never chunk children.

### CR-P1-4: Fix session dedup undefined-ID collapse [P1] [Codex]

**File:** `mcp_server/lib/session/session-manager.ts` L341, L370, L660 | **Effort:** 0.5h

- [x] Guard dedup map insertion: skip dedup for entries with no `id`, or use composite key
- [x] Currently: `Map` keyed by optional `id` → multiple `undefined` entries collapse to one
- [x] Verify: batch with 3 entries where `id` is undefined → all 3 preserved, not collapsed

**Acceptance:** Batch dedup correctly handles entries with undefined IDs without data loss.

### CR-P1-5: Fix cache availability regression [P1] [Codex]

**File:** `mcp_server/handlers/memory-search.ts` L753, L789 | **Effort:** 0.5h

- [x] Move cache lookup before embedding readiness gate
- [x] Currently: readiness gate blocks cache hits when model is unavailable (rate-limited/down)
- [x] Verify: disable embedding model → cached queries still return results

**Acceptance:** Cache hits succeed regardless of embedding model availability.

### CR-P1-6: Fix partial-update transaction boundary leak [P1] [Codex]

**File:** `mcp_server/handlers/memory-crud-update.ts` L97, L99, L135 | **Effort:** 0.5h

- [x] Move all state mutations (including embedding status) inside transaction boundary
- [x] Currently: `allowPartialUpdate` path mutates embedding status outside transaction
- [x] Verify: force transaction failure → embedding status unchanged

**Acceptance:** No state mutations occur outside transaction, even in partial-update mode.

### CR-P1-7: Reconcile cross-document contradictions [P1] [Codex]

**Files:** `spec.md`, `checklist.md`, `implementation-summary.md`, `handover.md` | **Effort:** 1.0h

- [x] Fix `spec.md:7` status ("In Progress" vs handover "complete") — set to actual state
- [x] Fix `checklist.md:117-119` — test pass marked but evidence says "results pending"
- [x] Fix agent count: `handover.md:15` (15 agents) vs `implementation-summary.md:33` (17 agents)
- [x] Fix standards claim: `implementation-summary.md:52` ("all aligned") vs `:642` ("19/20 fail")

**Acceptance:** All spec docs reflect a single consistent truth. Zero contradictions on status, counts, and claims.

### CR-P1-8: Fix config compatibility mismatch [P1] [Codex]

**Files:** `shared/config.ts:21`, `mcp_server/lib/search/vector-index.ts:170` | **Effort:** 0.5h

- [x] Unify DB path resolution: new config uses `SPEC_KIT_DB_DIR`, core still uses legacy env vars
- [x] Risk: scripts and runtime could target different DB files
- [x] Verify: set only legacy env var → both scripts and runtime resolve to same DB

**Acceptance:** Single env var priority chain used by all consumers. No split DB targeting.

### CR-P2-1: Remove @ts-nocheck from test file [P2] [Gemini]

**File:** `mcp_server/tests/memory-crud-extended.vitest.ts` | **Effort:** 2.0h opt / 4h real

- [x] Remove `@ts-nocheck` directive
- [x] Fix all resulting TypeScript errors (mock types, fixture types)
- [x] Verify: `tsc --noEmit` passes on test file

**Acceptance:** No `@ts-nocheck` in test files. All types resolve correctly.

### CR-P2-2: Address inert telemetry module [P2] [Gemini + Codex]

**File:** `mcp_server/lib/telemetry/retrieval-telemetry.ts:24` | **Effort:** 0.25h

- [x] `isExtendedTelemetryEnabled` hardcoded to `false` — entire module is dead code
- [x] Either connect to env var/config OR document as intentionally disabled

**Acceptance:** Flag is configurable OR explicitly documented as intentionally disabled.

### CR-P2-3: Fix reporting dashboard row cap [P2] [Gemini + Codex]

**File:** `mcp_server/lib/eval/reporting-dashboard.ts` L233, L350 | **Effort:** 0.25h

- [x] Hardcoded `LIMIT 1000` will silently drop data at scale
- [x] Make configurable, add pagination, or increase with truncation warning

**Acceptance:** Dashboard does not silently discard data. Either configurable limit or logged warning.

### CR-P2-4: Decompose memory-save.ts [P2] [Gemini]

**File:** `mcp_server/handlers/memory-save.ts` | **Effort:** 4.0h opt / 8h real

- [x] Extract chunking logic into separate module
- [x] Extract quality loops into separate module
- [x] Extract duplicate detection into separate module
- [x] Extract embedding orchestration into separate module
- [x] Currently 2,700+ LOC — largest single file

**Acceptance:** `memory-save.ts` reduced to orchestration layer. Extracted modules independently testable.

### CR-P2-5: Harden non-finite score handling [P2] [Codex]

**File:** `mcp_server/lib/search/evidence-gap-detector.ts` L153, L158 | **Effort:** 0.25h

- [x] Add `Number.isFinite()` guards before score comparisons/aggregations
- [x] Currently: NaN/Infinity can propagate through gap analysis

**Acceptance:** Non-finite scores filtered before any comparison or aggregation.

---

## Tier 5: Architecture Scan — Code Placement & Boundaries (2026-03-02)

**Source:** Codex 5.3 architecture scan (181K tokens, read-only full codebase analysis)
**Effort:** 12-20h optimistic / 30-50h realistic | **Status:** Complete (9/9 implemented)
**Scope:** 6 misplacements, 6 boundary violations, 2 circular deps, 7 god files

### ARCH-1: Create stable indexing API [HIGH] [Codex scan]

**Files:** `scripts/core/memory-indexer.ts`, `scripts/memory/reindex-embeddings.ts` | **Effort:** 4h opt / 8h real

- [x] Create stable public API modules: api/eval.ts, api/search.ts, api/providers.ts, api/index.ts (~55 LOC total)
- [x] Migrate `scripts/evals/run-ablation.ts` to use stable api/ imports (deep lib/ imports removed)
- [x] Migrate `scripts/evals/run-bm25-baseline.ts` to use stable api/ imports (deep lib/ imports removed)
- [x] 9 deep mcp_server/lib/ imports replaced with 2 stable mcp_server/api/ imports across 2 scripts

**Acceptance:** Zero `scripts/` imports from `mcp_server/lib/` internals. All use public API. tsc clean.

### ARCH-2: Consolidate eval CLIs [MEDIUM] [Codex scan]

**Files:** `mcp_server/scripts/run-bm25-baseline.ts`, `run-ablation.ts`, `map-ground-truth-ids.ts` | **Effort:** 1h opt / 2h real

- [x] Move `mcp_server/scripts/run-bm25-baseline.ts` → `scripts/evals/`
- [x] Move `mcp_server/scripts/run-ablation.ts` → `scripts/evals/`
- [x] Move `mcp_server/scripts/map-ground-truth-ids.ts` → `scripts/evals/`
- [x] Update `mcp_server/scripts/README.md` references

**Acceptance:** `mcp_server/scripts/` contains only server-essential scripts. All eval CLIs in `scripts/evals/`.

### ARCH-3: Split vector-index-impl.ts (4,276 LOC) [HIGH] [Codex scan]

**File:** `mcp_server/lib/search/vector-index-impl.ts` | **Effort:** 6h opt / 12h real

- [x] Extract `vector-index-schema.ts` — table creation, migrations (1,275 LOC)
- [x] Extract `vector-index-mutations.ts` — CRUD operations (509 LOC)
- [x] Extract `vector-index-store.ts` — core DB singleton, init, constitutional cache (736 LOC)
- [x] Extract `vector-index-queries.ts` — search, content extraction, ranking (1,263 LOC)
- [x] Extract `vector-index-aliases.ts` — caching, learning, enhanced search (379 LOC)
- [x] Verify all tests pass after split — 7085/7085 pass, 230 files, `tsc` clean

**Acceptance:** `vector-index-impl.ts` reduced to facade (<500 LOC). Each module independently testable.

### ARCH-4: Extract pure algorithms to shared/ [MEDIUM] [Codex scan]

**Files:** `rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts`, `retrieval-trace.ts` | **Effort:** 2h opt / 4h real

- [x] Move `mcp_server/lib/search/rrf-fusion.ts` → `shared/algorithms/`
- [x] Move `mcp_server/lib/search/adaptive-fusion.ts` → `shared/algorithms/`
- [x] Move `mcp_server/lib/search/mmr-reranker.ts` → `shared/algorithms/`
- [x] Move `mcp_server/lib/contracts/retrieval-trace.ts` → `shared/contracts/`
- [x] Update all import paths in mcp_server consumers

**Acceptance:** Algorithms importable from `@spec-kit/shared` without mcp_server dependency.

### ARCH-5: Fix shared/config.ts layout coupling [MEDIUM] [Codex scan]

**File:** `shared/config.ts` | **Effort:** 1h opt / 2h real

- [x] Split into pure config (`shared/config.ts` — env var reading, abstract defaults)
- [x] Create `mcp_server/core/paths.ts` — runtime path resolution
- [x] Create `scripts/core/paths.ts` — script path resolution
- [x] Remove hardcoded `../../mcp_server/database/` from shared layer

**Acceptance:** `shared/` has zero path references to `mcp_server/` directory structure.

### ARCH-6: Break handler god files [HIGH] [Codex scan]

**Files:** 4 files >1000 LOC | **Effort:** 8h opt / 16h real

- [x] `memory-save.ts` (2,788 LOC): extract chunking, quality loop, PE gating, eval logging
- [x] `memory-search.ts` (1,064 LOC): move search orchestration into `lib/search`
- [x] `hybrid-search.ts` (1,539 LOC): split by stage/services
- [x] `session-manager.ts` (1,140 LOC): separate dedup, recovery, persistence

**Acceptance:** No handler file >1000 LOC. Extracted services independently testable.

### ARCH-7: Fix circular dependencies [MEDIUM] [Codex scan]

**Circular deps:** 2 identified | **Effort:** 1h opt / 2h real

- [x] `hybrid-search.ts` ↔ `graph-search-fn.ts` — extract shared types to `types.ts`
- [x] `memory-crud.ts` ↔ `memory-crud-health.ts` — merge or introduce shared interface file

**Acceptance:** `tsc --noEmit` passes. No circular import warnings.

### ARCH-8: Remove retry-manager re-export shim [LOW] [Codex scan]

**File:** `scripts/lib/retry-manager.ts` | **Effort:** 0.5h

- [x] Remove re-export shim
- [x] Update consumers to use indexing API (ARCH-1) or direct documented import

**Acceptance:** `scripts/lib/retry-manager.ts` deleted. No broken imports.

### ARCH-9: Move ground truth data to JSON asset [LOW] [Codex scan]

**File:** `mcp_server/lib/eval/ground-truth-data.ts` (1,690 LOC) | **Effort:** 1h

- [x] Extract dataset to `mcp_server/lib/eval/data/ground-truth.json`
- [x] Replace file with thin JSON loader

**Acceptance:** `ground-truth-data.ts` <100 LOC. Data in JSON file.

---

## Findings Registry (Complete)

### All 33 Findings by Status

**VERIFIED (16):**

| ID | Title | Severity | Evidence | Models |
|----|-------|:--------:|----------|:------:|
| P0-1 | Signal count wrong (9 → 12 steps, 9 score-affecting) | P0 | `stage2-fusion.ts:404` | 3/3 |
| P0-2 | V1 pipeline described as available (removed Phase 017) | P0 | `memory-search.ts:599` | 3/3 |
| P0-3 | SPECKIT_PIPELINE_V2 active toggle (deprecated, always true) | P0 | `search-flags.ts:101` | 3/3 |
| P0-4 | resolveEffectiveScore() undocumented | P0 | `pipeline/types.ts:56` | 3/3 |
| P1-5 | SPECKIT_ADAPTIVE_FUSION missing from flag docs | P1 | `adaptive-fusion.ts:65,74` | 2/3 |
| P1-6 | Math.max/min spread (8 files, stack overflow >100K) | P1 | G2 + G4 + G5 (25 matches) | 3/3 |
| P1-7 | memory_update embedding (title-only → title+content) | P1 | `memory-crud-update.ts:89-91` | 3/3 |
| P1-8 | memory_delete cleanup (1 table → multi-table) | P1 | `memory-crud-delete.ts:74,80` | 3/3 |
| P1-9 | Five-factor normalization undocumented | P1 | `composite-scoring.ts:544-548` | 2/3 |
| P1-10 | R8 summary channel missing from Stage 1 docs | P1 | `stage1-candidate-gen.ts:507-565` | 3/3 |
| P1-11 | Mixed import patterns in scripts/ (relative paths) | P1 | 4+ files bypass @spec-kit/ aliases | 3/3 |
| P1-13 | Hardcoded DB path in 3+ files | P1 | `path.join(__dirname, '../../../...')` | 3/3 |
| P1-15 | Import ordering + AI-TRACE tags | P1 | Wave 3 Gemini review | 2/3 |
| P2-18 | stage2-fusion.ts docblock inconsistency (11/9/12) | P2 | Meta-review confirmed | 2/3 |
| P2-26 | Co-activation spreading missing from docs (step 2a) | P2 | Meta-review confirmed | 2/3 |
| NEW-1 | Session-manager transaction gap (L429-440) | HIGH | G5: enforceEntryLimit outside tx | 1/1 |

**RESOLVED (2):**

| ID | Title | Resolution Evidence |
|----|-------|-------------------|
| P1-12 | Workspace deps missing | G4: AI-WHY fix comments + 0 `"workspace:` matches |
| Signal count contradiction | "11" vs "12" in impl-summary | Resolved: canonical "12 steps (9 score-affecting)" |

**FALSE_POSITIVE (1):**

| ID | Title | Why False |
|----|-------|-----------|
| FP-1 | retry-manager redundancy | Zero functional overlap: `shared/utils/retry` (generic backoff) vs `providers/retry-manager` (500-line embedding retry queue with DB ops) |

**CORRECTED (1):**

| ID | Title | What Happened |
|----|-------|--------------|
| C138 | Deep-review accused synthesis of fabricating "C138" | C138 EXISTS at `z_archive/wave3-gemini-mcp-standards.md:L32`. The deep-review's accusation was itself wrong. Confirmed by source read, G3 audit, ultra-think. |

**DOWNGRADED (5):**

| ID | Original → Verified | Evidence |
|----|:---:|---------|
| P2-16 | P1 → P2 | SQL template literals: 3/5 FALSE_POSITIVE (fixed fragments), 2/5 P2 code style |
| P2-17 | P1 → P2 | Transaction wrappers: single-process better-sqlite3 eliminates concurrency risk |
| P1-14 | P1 → P1 (effectively P2) | specFolderLocks naming: code style, not functional |
| P2-19 | P0 → P2 | Tool count: doc table has all 25, only spec.md metadata stale |
| memory-save chunks | P1 → P2 | Async embedding makes chunk tx impossible |

**UNVERIFIED (6):**

| ID | Title | Why Unverified |
|----|-------|---------------|
| P2-20 | "89 feature flags" claim | No model counted all flag sources |
| P2-21 | Duplicate deps in scripts/ | Not code-verified |
| P2-22 | Module moves to shared/ | Architecture recommendation only |
| P2-23 | File header format (19/20 files) | Confirmed visually, not line-counted |
| P2-24 | Narrative comments (19/20 files) | Same systematic divergence |
| P2-25 | isFeatureEnabled "1" quirk | Opus only, no cross-verification |

**PROCESS (2):**

| ID | Title | Impact |
|----|-------|--------|
| PROC-1 | Synthesis propagation failure (8 corrections lost) | Final deliverables contain stale/incorrect info |
| PROC-2 | Missing wave4-synthesis.md | RESOLVED: wave4-synthesis.md created in z_archive/ |

---

### Cross-AI Validation Findings (2026-03-02)

**Source:** Independent reviews by Gemini 3.1 Pro + Codex gpt-5.3-codex

**IMPLEMENTED (14/14 — CR-P2-4 deferred as out-of-scope refactoring) — Codex 5.3, reviewed by Gemini 3.1 Pro + Claude Opus 4.6. CR-P0-1 completed Attempt 6:**

| ID | Title | Severity | Source | File(s) |
|----|-------|:--------:|:------:|---------|
| CR-P0-1 | Test suite can falsely pass (swallowed imports, early-returns) | **P0** | Codex | `memory-crud-extended.vitest.ts:134,:137,:482,:824` |
| CR-P1-1 | Swallowed deletion exceptions leave orphaned causal edges | P1 | Gemini+Codex | `memory-crud-delete.ts` |
| CR-P1-2 | Top-K slice without re-sort after feedback mutation | P1 | Codex | `stage2-fusion.ts:638,:662` |
| CR-P1-3 | Dedup returns chunk child instead of canonical parent | P1 | Codex | `memory-save.ts:992,:1157,:1162` |
| CR-P1-4 | Session dedup undefined-ID collapse (Map key collision) | P1 | Codex | `session-manager.ts:341,:370,:660` |
| CR-P1-5 | Cache hits blocked by embedding readiness gate | P1 | Codex | `memory-search.ts:753,:789` |
| CR-P1-6 | Partial-update mutations outside transaction boundary | P1 | Codex | `memory-crud-update.ts:97,:99,:135` |
| CR-P1-7 | Cross-doc contradictions (status, counts, claims) | P1 | Codex | `spec.md:7`, `checklist.md:117`, `impl-summary.md:52,:642` |
| CR-P1-8 | Config compatibility mismatch (new vs legacy env vars) | P1 | Codex | `shared/config.ts:21`, `vector-index.ts:170` |
| CR-P2-1 | @ts-nocheck disables type safety in test file | P2 | Gemini | `memory-crud-extended.vitest.ts` |
| CR-P2-2 | Telemetry isExtendedTelemetryEnabled hardcoded false | P2 | Gemini+Codex | `retrieval-telemetry.ts:24` |
| CR-P2-3 | Reporting dashboard LIMIT 1000 silently drops data | P2 | Gemini+Codex | `reporting-dashboard.ts:233,:350` |
| CR-P2-4 | memory-save.ts monolithic size (2,700+ LOC) | P2 | Gemini | `memory-save.ts` |
| CR-P2-5 | Non-finite scores unguarded in evidence gap detector | P2 | Codex | `evidence-gap-detector.ts:153,:158` |

### Architecture Scan Findings (2026-03-02)

**Source:** Codex 5.3 architecture scan (181K tokens, read-only full codebase analysis)

**ALL COMPLETE (9/9):**

| ID | Title | Severity | Category | Key Files |
|----|-------|:--------:|:--------:|-----------|
| ARCH-1 | Scripts import mcp_server internals (no stable API) | **HIGH** | Boundary | `scripts/core/memory-indexer.ts`, `scripts/memory/reindex-embeddings.ts` |
| ARCH-2 | Eval CLIs split across mcp_server/scripts/ and scripts/evals/ | MEDIUM | Misplacement | `mcp_server/scripts/run-*.ts` |
| ARCH-3 | vector-index-impl.ts god file (4,276 LOC) | **HIGH** | God file | `mcp_server/lib/search/vector-index-impl.ts` |
| ARCH-4 | Pure algorithms locked inside mcp_server (no MCP dependency) | MEDIUM | Misplacement | `rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts` |
| ARCH-5 | shared/config.ts hardcodes mcp_server path layout | MEDIUM | Coupling | `shared/config.ts` |
| ARCH-6 | Handler god files (memory-save 2788, hybrid-search 1539, etc.) | **HIGH** | God file | 4 files >1000 LOC |
| ARCH-7 | Circular dependencies (2 cycles) | MEDIUM | Circular | `hybrid-search.ts` ↔ `graph-search-fn.ts`, `memory-crud.ts` ↔ `memory-crud-health.ts` |
| ARCH-8 | retry-manager re-export shim in scripts/ | LOW | Shim | `scripts/lib/retry-manager.ts` |
| ARCH-9 | ground-truth-data.ts (1,690 LOC) — data in code file | LOW | God file | `mcp_server/lib/eval/ground-truth-data.ts` |
<!-- /ANCHOR:summary -->

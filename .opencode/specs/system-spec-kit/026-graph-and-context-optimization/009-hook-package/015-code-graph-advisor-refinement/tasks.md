---
# SPECKIT_TEMPLATE_SOURCE: tasks-core + level_3/tasks.md | v2.2
title: "Tasks: Code Graph and Skill Advisor Refinement — 10-PR Remediation"
description: "Task Format: T### [P?] Description (file path). 54 concrete tasks across 10 PRs and 3 parallel batches. Each task traces to a finding F-id and a closing benchmark or acceptance criterion. B3 reconciles PR-3 deletion inventory by retaining the memory auto-promotion semantics test outside the deleted promotion subsystem."
trigger_phrases:
  - "code graph advisor refinement tasks"
  - "026/009/015 tasks"
  - "015 remediation tasks"
  - "10-PR tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement"
    last_updated_at: "2026-04-25T09:15:00.000Z"
    last_updated_by: "b6-batch-close"
    recent_action: "T-053 complete; B6 daemon-availability fix-up applied"
    next_safe_action: "Final continuity save + commit"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "b6-batch-close"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Code Graph and Skill Advisor Refinement — 10-PR Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level_3/tasks.md | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

## §1 Task Inventory

| ID | PR | Description | Target file (relative to mcp_server/) | LOC delta | Closes finding(s) | Verification |
|----|----|-------------|---------------------------------------|-----------|-------------------|--------------|
| T-001 | PR-1 | Read existing corpus-path test to understand current hardcoded path | `skill-advisor/bench/scorer-bench.ts` | 0 | F33 | File read confirms path mismatch |
| T-002 | PR-1 | Apply 4-line corpus path fix — repoint to `scripts/routing-accuracy/labeled-prompts.jsonl`; extract to `SPECKIT_BENCH_CORPUS_PATH` const | `skill-advisor/bench/scorer-bench.ts` | +4 | F33, F36-prereq | `vitest run skill-advisor/bench/scorer-bench.ts` produces non-zero rows |
| T-003 | PR-1 | Apply 1-line corpus path fix in parity test if applicable | `skill-advisor/tests/parity/python-ts-parity.vitest.ts` | +1 | F33 | `vitest run` that test file passes |
| T-004 | PR-1 | Run tsc + bench verify; confirm bench produces non-zero corpus rows | bench runner | 0 | F33 | bench exit 0 + non-zero row count logged |
| T-005 | PR-2 | Read existing settings.local.json to confirm broken parallel-hook shape | `.claude/settings.local.json` | 0 | F23.1, F51 | File read confirms 4 nested entries with wrong `bash:` key |
| T-006 | PR-2 | Rewrite settings.local.json — replace 4 nested hook entries with single `UserPromptSubmit` array entry pointing at `dist/hooks/claude/user-prompt-submit.js` | `.claude/settings.local.json` | -31 | F23.1, F37 #1, F51 | `jq . .claude/settings.local.json` exits 0; schema match confirmed |
| T-007 | PR-2 | Smoke-test: launch Claude Code session, prompt arbitrary text, verify single advisor brief renders | n/a (manual) | 0 | F23.1 | Single brief visible in Read-tool log; no duplicate |
| T-008 | PR-2 | Verify AGENTS.md triad does not reference old parallel-hook shape; patch prose if needed | `AGENTS.md` / `AGENTS_Barter.md` / `AGENTS_example_fs_enterprises.md` | 0 | F23.1 | grep for old shape returns 0 hits |
| T-009 | PR-3 | Read each promotion source file to confirm zero production callers before delete | `skill-advisor/lib/promotion/*.ts` (6 files) | 0 | F52, F60 | Grep `handlers/index.ts` for promotion imports → 0 |
| T-010 | PR-3 | Delete 6 promotion code files | `skill-advisor/lib/promotion/gate-bundle.ts`, `rollback.ts`, `semantic-lock.ts`, `shadow-cycle.ts`, `two-cycle-requirement.ts`, `weight-delta-cap.ts` | -~742 | F70, F52, F62 | Files absent from filesystem |
| T-011 | PR-3 | Delete promotion schema file | `skill-advisor/schemas/promotion-cycle.ts` | -82 | F70 | File absent from filesystem |
| T-012 | PR-3 | Delete 1 promotion subsystem test file; retain the memory auto-promotion semantics test outside delete scope | `skill-advisor/tests/promotion/promotion-gates.vitest.ts` deleted; `tests/promotion-positive-validation-semantics.vitest.ts` retained because it imports `lib/search/auto-promotion` and `lib/scoring/confidence-tracker`, not `lib/promotion/*` | -~220 | F70, F60, R1-P1-002 | Promotion-gates file absent; retained memory auto-promotion test remains; `vitest run` still green |
| T-013 | PR-3 | Delete 3 promotion bench files | `skill-advisor/bench/corpus-bench.ts`, `skill-advisor/bench/safety-bench.ts`, `skill-advisor/bench/holdout-bench.ts` | -150 | F70, F68 | Files absent from filesystem |
| T-014 | PR-3 | Update package.json — remove `corpus-bench`, `safety-bench`, `holdout-bench` script rows | `package.json` | -6 | F68 | `jq '.scripts["corpus-bench"]' package.json` → null |
| T-015 | PR-3 | Doc scrub — remove 12 doc file references to promotion subsystem (iter-14 list) | `*.md` doc files (12 files per iter-14 scrub list) | -195 | F37 #5, F37 #6 | `git grep -l 'lib/promotion\|promotion-cycle'` → 0 matches |
| T-016 | PR-3 | Doc scrub — verify sibling-spec docs are clean | `002-skill-graph-daemon-and-advisor-unification/**`, `042-sk-deep-research-review-improvement-2/**` | 0 | F70 | grep for deleted module names in both sibling specs → 0 |
| T-017 | PR-3 | Run full tsc + vitest — confirm clean after all deletions | repo root | 0 | F70, F52 | `tsc --noEmit` exit 0; `vitest run` exit 0 |
| T-018 | PR-4 | Read 4 vocabulary source files before editing (ensure-ready, ops-hardening, startup-brief, readiness-contract) | `code-graph/lib/ensure-ready.ts`, `ops-hardening.ts`, `startup-brief.ts`, `readiness-contract.ts` | 0 | F17, F71 | File reads confirm V1-V5 divergence locations |
| T-019 | PR-4 | Step 1: Replace local `GraphFreshness` type in ensure-ready.ts with import from ops-hardening.ts (V2 as superset) | `code-graph/lib/ensure-ready.ts:22` | +2 | F71 | tsc sees no V1 duplicate-name |
| T-020 | PR-4 | Step 2: Add `case 'error': return 'missing';` arm to `canonicalReadinessFromFreshness` | `code-graph/lib/readiness-contract.ts` | +2 | F71 | assertNever exhaustiveness check does not fire on 'error' input |
| T-021 | PR-4 | Step 3: Update startup-brief.ts at L43,213,240,247 — map `freshness === 'error'` → `graphState: 'missing'` | `code-graph/lib/startup-brief.ts:43,213,240,247` | +4 | F71, F18 | tsc clean; startup brief renders canonical state |
| T-022 | PR-4 | Step 4: Widen `shared-payload.ts` union to 4 values; emit 'unavailable' when freshness is 'error' | `code-graph/lib/context/shared-payload.ts` | +4 | F71, F18 | tsc clean |
| T-023 | PR-4 | Step 5: Remove manual `trustState: 'unavailable' as const` injection in context handler | `code-graph/handlers/context.ts:224-229` | -3 | F18 | tsc clean; context handler test passes |
| T-024 | PR-4 | Step 6: Add 'unavailable' trust-state path on readiness-crash in query handler to match S2 | `code-graph/handlers/query.ts:623-780` | +4 | F18 | tsc clean; query handler test passes |
| T-025 | PR-4 | Step 7: Replace V4-vocabulary `reason` string in status.ts with switch on unified V2 enum | `code-graph/handlers/status.ts:35` | +3 | F17 | tsc clean |
| T-026 | PR-4 | Step 8: Update `trustStateFromGraphState` mapper to handle widened 4-val union | `code-graph/lib/context/shared-payload.ts` | +4 | F71 | tsc clean; mapper unit test covers 4-val paths |
| T-027 | PR-4 | Create canonical `TrustState` re-export from `freshness/trust-state.ts` with deprecation aliases for V1-V5 | `skill-advisor/lib/freshness/trust-state.ts` | +10 | F71 | `git grep -l 'GraphFreshness\|TrustState'` confirms aliases still re-export |
| T-028 | PR-4 | Run full tsc + vitest; manual spot-check on 4 surfaces (status/context/query/startup-brief) | repo root | 0 | F17, F71 | `tsc --noEmit` exit 0; `vitest run` exit 0; 4-surface spot-check passes |
| T-029 | PR-5 | Read existing `lib/metrics.ts` (473 LOC) to understand existing collector patterns, writeBoundedJsonl, and FORBIDDEN_DIAGNOSTIC_FIELDS before extending | `skill-advisor/lib/metrics.ts` | 0 | F43 | File read; collector pattern understood |
| T-030 | PR-5 | Add 6 code-graph metrics definitions (#1-6) to `lib/metrics.ts` (scan duration, parse duration, query latency, cache hit/miss counters, edge detection rate, partial-persist retries) | `skill-advisor/lib/metrics.ts` | +65 | F43, F72, F73 | tsc clean; metric names pass snake_case audit |
| T-031 | PR-5 | Add 5 skill-advisor scorer metrics definitions (#7-11) to `lib/metrics.ts` (lane contribution, fusion live-weight share, primary-intent bonus, brier score, near-dup cache miss) | `skill-advisor/lib/metrics.ts` | +50 | F43, F74, F75 | tsc clean |
| T-032 | PR-5 | Add 3 freshness metrics definitions (#12-14) and 2 cross-cutting metrics (#15-16) to `lib/metrics.ts` | `skill-advisor/lib/metrics.ts` | +35 | F43, F76, F77 | tsc clean; `git grep -i promotion lib/metrics.ts` → 0 |
| T-033 | PR-5 | Wire emission anchor at `structural-indexer.ts:698` for metrics #1, #5, #6 | `code-graph/lib/structural-indexer.ts:698` | +12 | F43, F28 | tsc clean |
| T-034 | PR-5 | Wire emission anchor at `tree-sitter-parser.ts` parseFile entry/exit for metric #2 | `code-graph/lib/tree-sitter-parser.ts` | +8 | F43, F36 #4 | tsc clean |
| T-035 | PR-5 | Wire emission anchor at `code-graph-context.ts:114-375` for metrics #3, #4 | `code-graph/lib/code-graph-context.ts:114-375` | +10 | F43, F28, F36 #7 | tsc clean |
| T-036 | PR-5 | Wire emission anchors at `fusion.ts:172-230` and `attribution.ts:10-31` for metrics #7, #8, #9 | `skill-advisor/lib/scorer/fusion.ts`, `attribution.ts` | +12 | F43, F35, F50 | tsc clean |
| T-037 | PR-5 | Wire emission anchors at `prompt-cache.ts:97-117` for metrics #11, #14 and at `freshness/trust-state.ts` + `cache-invalidation.ts:35` for metrics #12, #13 | `skill-advisor/lib/prompt-cache.ts`, `freshness/trust-state.ts`, `freshness/cache-invalidation.ts:35` | +18 | F43, F41, F77 | tsc clean |
| T-038 | PR-5 | Gate all emission behind `SPECKIT_METRICS_ENABLED` env var; add cardinality meta-gauge `metrics_unique_series_count` | `skill-advisor/lib/metrics.ts` | +12 | F43 | env var default=off verified; meta-gauge emits on enable |
| T-039 | PR-5 | Run tsc + vitest + cardinality dry-run (verify ≤ 9k series); snake_case audit; additive schema check | repo root | 0 | F43 | `tsc --noEmit` exit 0; `vitest run` exit 0; cardinality < 9k |
| T-040 | PR-6 | Read `skill-advisor-brief.ts` and `prompt-cache.ts` to locate module-init scope for listener registration | `skill-advisor/lib/skill-advisor-brief.ts`, `skill-advisor/lib/prompt-cache.ts` | 0 | F81 | File reads; module-init scope identified |
| T-041 | PR-6 | Add 5-LOC `cacheInvalidation.onCacheInvalidation(() => advisorPromptCache.clear())` listener at module-init scope | `skill-advisor/lib/skill-advisor-brief.ts` | +5 | F81, F41, F77-F82 | tsc clean; listener is NOT in request-handler scope |
| T-042 | PR-6 | Write listener-uniqueness unit test — assert only one listener registered per process | `skill-advisor/tests/cache/listener-uniqueness.vitest.ts` | +25 | F81 | `vitest run` targeted test passes |
| T-043 | PR-6 | Run tsc + vitest; verify listener registered once at process start via log-grep | repo root | 0 | F81 | `tsc --noEmit` exit 0; `vitest run` exit 0; log shows "listener registered" exactly once |
| T-044 | PR-7 | Read iter-11 F56 test skeleton and `.claude/settings.local.json` post-PR-2 shape before writing test | research iter-11 delta + `.claude/settings.local.json` | 0 | F46, F56 | Skeleton pattern understood; post-PR-2 shape confirmed |
| T-045 | PR-7 | Write new parity test file — assert `hooks.UserPromptSubmit[0].command` shape; include Claude-only runtime guard (skip on non-Claude) | `skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts` | +150 | F25, F46, F56 | `vitest run` targeted test passes; test.skip fires on non-Claude envs |
| T-046 | PR-7 | Schema-mock brittleness review — confirm test asserts only array shape + 1st-element script path; does NOT assert env vars, matchers, or other fields | `skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts` | 0 | F46 | Manual review: no over-specified assertions |
| T-047 | PR-8 | Write `code-graph-parse-latency.bench.ts` — wrap `parseFile` per language; emit `speckit_graph_parse_duration_ms` P50/P95/P99; assert non-zero sample count per language | `skill-advisor/bench/code-graph-parse-latency.bench.ts` | +80 | F36 #4, F73-#2 | bench exits 0; non-zero counts per language logged; `speckit_graph_parse_duration_ms` appears in collector output |
| T-048 | PR-9 | Write `code-graph-query-latency.bench.ts` — wrap `handleCodeGraphQuery` for outline/blast_radius/relationship; pin corpus to hashed snapshot; assert percentile DELTA vs baseline JSON | `skill-advisor/bench/code-graph-query-latency.bench.ts` | +100 | F36 #7, F73-#3/#4, F28 | bench exits 0 across 3 modes; delta assertions pass vs baseline |
| T-049 | PR-9 | Commit pinned corpus snapshot baseline JSON alongside bench | `skill-advisor/bench/code-graph-query-latency.baseline.json` | +10 | F36 #7 | baseline JSON present in repo; bench reads it correctly |
| T-050 | PR-10 | Write `hook-brief-signal-noise.bench.ts` — per-runtime (claude/codex/gemini/copilot) brief renderer invocation; load iter-4 7-axis matrix as fixture; assert non-zero signal count per runtime | `skill-advisor/bench/hook-brief-signal-noise.bench.ts` | +80 | F36 #8, F19-F22 | bench exits 0 across 4 runtimes; 7-axis matrix loaded as fixture; non-zero signal counts |
| T-051 | Cross | After Batch A merges: run `bash validate.sh --strict` on spec folder; run `generate-context.js` continuity save at M1 boundary | spec folder | 0 | n/a | validate.sh exit 0; continuity save logged |
| T-052 | Cross | After Batch B merges: run `bash validate.sh --strict`; run `generate-context.js` at M2 boundary; update `_memory.continuity` in `implementation-summary.md` | spec folder | 0 | n/a | validate.sh exit 0; M2 milestone recorded |
| T-053 | Cross | After Batch C merges: run final `bash validate.sh --strict`; update `checklist.md` P0 items with evidence; run final `generate-context.js` save | spec folder | 0 | n/a | validate.sh exit 0; all P0 checklist items marked [x] |
| T-054 | Cross | AGENTS.md triad audit: verify no stale references to deleted promotion subsystem or V1-V5 vocabulary in AGENTS.md, AGENTS_Barter.md, AGENTS_example_fs_enterprises.md (iter-20 F84 per standing instruction) | triad docs | 0 | F84 | grep returns 0 hits for `lib/promotion`, `GraphFreshness` (V1), `'fresh'\|'empty'\|'error'` as standalone V2 strings |

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Batch A Tasks (PR 1 + PR 2, parallel)

**PR 1 and PR 2 have no shared files and can be dispatched simultaneously.**

### PR 1 — Corpus-Path Bench Wiring Fix

- [x] T-001 [P] Read `scorer-bench.ts` to confirm hardcoded corpus path (0 LOC, F33)
- [x] T-002 [P] Apply 4-line corpus path fix in `scorer-bench.ts`; extract to `SPECKIT_BENCH_CORPUS_PATH` const (+4 LOC, F33)
- [x] T-003 [P] Apply 1-line corpus path fix in `python-ts-parity.vitest.ts` if applicable (+1 LOC, F33)
- [x] T-004 [P] Run tsc + bench; verify non-zero corpus rows (0 LOC, F33)

### PR 2 — Settings.local.json Rewrite

- [x] T-005 [P] Read `settings.local.json` to confirm broken parallel-hook shape (0 LOC, F23.1)
- [x] T-006 [P] Rewrite `settings.local.json` with single `UserPromptSubmit` array entry (-31 LOC, F23.1)
- [x] T-007 [P] Smoke-test: verify single advisor brief renders in Claude Code session (0 LOC, F23.1)
- [x] T-008 [P] Verify AGENTS.md triad does not reference old settings shape; patch if needed (0 LOC, F23.1)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Batch B Tasks (PRs 3-7)

**PR 3 must land first, then PR 4, then PRs 5/6/7 can run in parallel.**

### PR 3 — Promotion Subsystem DELETE Sweep (Depends on: PR 1)

- [x] T-009 Read each promotion source file to confirm zero production callers (0 LOC, F52)
- [x] T-010 Delete 6 promotion code files from `lib/promotion/` (-~742 LOC, F70)
- [x] T-011 Delete `schemas/promotion-cycle.ts` (-82 LOC, F70)
- [x] T-012 Delete 1 promotion subsystem test file; retain memory auto-promotion semantics test (-~220 LOC, F70, R1-P1-002)
- [x] T-013 Delete 3 promotion bench files (corpus-bench, safety-bench, holdout-bench) (-150 LOC, F68)
- [x] T-014 Update `package.json` — remove 3 bench script rows (-6 LOC, F68)
- [x] T-015 Doc scrub — remove 12 doc file references per iter-14 scrub list (-195 LOC, F37)
- [x] T-016 Doc scrub — verify sibling-spec docs are clean (0 LOC, F70)
- [x] T-017 Run full `tsc --noEmit` + `vitest run`; confirm clean (0 LOC, F70)

### PR 4 — State-Vocabulary Unification (Depends on: PR 3)

- [x] T-018 Read 4 vocabulary source files before editing (0 LOC, F17)
- [x] T-019 Step 1: Replace V1 `GraphFreshness` type in `ensure-ready.ts:22` with import from `ops-hardening.ts` (+2 LOC, F71)
- [x] T-020 Step 2: Add `case 'error': return 'missing';` arm to `canonicalReadinessFromFreshness` (+2 LOC, F71)
- [x] T-021 Step 3: Update `startup-brief.ts:43,213,240,247` for `freshness === 'error'` mapping (+4 LOC, F71)
- [x] T-022 Step 4: Widen `shared-payload.ts` union to 4 values (+4 LOC, F71)
- [x] T-023 Step 5: Remove manual `trustState: 'unavailable' as const` injection in `context.ts:224-229` (-3 LOC, F18)
- [x] T-024 Step 6: Add `'unavailable'` trust-state path in `query.ts:623-780` (+4 LOC, F18)
- [x] T-025 Step 7: Replace V4-vocabulary `reason` string in `status.ts:35` (+3 LOC, F17)
- [x] T-026 Step 8: Update `trustStateFromGraphState` mapper for 4-val union (+4 LOC, F71)
- [x] T-027 Create canonical `TrustState` re-export from `freshness/trust-state.ts` with V1-V5 deprecation aliases (+10 LOC, F71)
- [x] T-028 Run full `tsc --noEmit` + `vitest run` + 4-surface spot-check (0 LOC, F17)

### PR 5 — Instrumentation Namespace Scaffold (Depends on: PR 3, PR 4)

- [x] T-029 [P] Read existing `lib/metrics.ts` to understand collector patterns before extending (0 LOC, F43)
- [x] T-030 [P] Add 6 code-graph metrics definitions (#1-6) to `lib/metrics.ts` (+65 LOC, F43)
- [x] T-031 [P] Add 5 skill-advisor scorer metrics definitions (#7-11) to `lib/metrics.ts` (+50 LOC, F43)
- [x] T-032 [P] Add 3 freshness + 2 cross-cutting metrics definitions (#12-16) to `lib/metrics.ts` (+35 LOC, F43)
- [x] T-033 [P] Wire emission anchor at `structural-indexer.ts:698` for metrics #1, #5, #6 (+12 LOC, F43)
- [x] T-034 [P] Wire emission anchor at `tree-sitter-parser.ts` for metric #2 (+8 LOC, F43)
- [x] T-035 [P] Wire emission anchor at `code-graph-context.ts:114-375` for metrics #3, #4 (+10 LOC, F43)
- [x] T-036 [P] Wire emission anchors at `fusion.ts` and `attribution.ts` for metrics #7-9 (+12 LOC, F43)
- [x] T-037 [P] Wire emission anchors at `prompt-cache.ts`, `freshness/trust-state.ts`, `cache-invalidation.ts` for metrics #11-14 (+18 LOC, F43)
- [x] T-038 [P] Gate emission behind `SPECKIT_METRICS_ENABLED` env var; add cardinality meta-gauge (+12 LOC, F43)
- [x] T-039 Run `tsc --noEmit` + `vitest run` + cardinality dry-run; snake_case audit; additive schema check (0 LOC, F43)

### PR 6 — Prompt-Cache Invalidation Listener Wire-Up (Depends on: PR 4; parallel with PR 5)

- [x] T-040 [P] Read `skill-advisor-brief.ts` and `prompt-cache.ts` to locate module-init scope (0 LOC, F81)
- [x] T-041 [P] Add 5-LOC listener at module-init scope in `skill-advisor-brief.ts` (+5 LOC, F81)
- [x] T-042 [P] Write listener-uniqueness unit test (+25 LOC, F81)
- [x] T-043 [P] Run `tsc --noEmit` + `vitest run`; verify listener registered once (0 LOC, F81)

### PR 7 — Settings-Driven-Invocation-Parity Test (Depends on: PR 2; parallel with PRs 5 and 6)

- [x] T-044 [P] Read iter-11 F56 test skeleton and post-PR-2 settings shape (0 LOC, F46)
- [x] T-045 [P] Write new parity test file with Claude-only runtime guard (+150 LOC, F25/F46/F56)
- [x] T-046 [P] Schema-mock brittleness review — confirm minimal shape assertions only (0 LOC, F46)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Batch C Tasks (PRs 8-10, all parallel)

**All 3 PRs depend on PR 5 (metrics scaffold). PR 10 additionally depends on PR 7. All 3 can be dispatched simultaneously once their prerequisites have landed.**

### PR 8 — Parse-Latency Bench (Depends on: PR 5)

- [x] T-047 [P] Write `code-graph-parse-latency.bench.ts` — per-language `parseFile` wrapper; assert non-zero sample counts (+80 LOC, F36 #4)

### PR 9 — Query-Latency Bench (Depends on: PR 5)

- [x] T-048 [P] Write `code-graph-query-latency.bench.ts` — 3 modes; pinned corpus; delta-vs-baseline assertions (+100 LOC, F36 #7)
- [x] T-049 [P] Commit `code-graph-query-latency.baseline.json` pinned corpus snapshot alongside bench (+10 LOC, F36 #7)

### PR 10 — Hook-Brief Signal-Noise Bench (Depends on: PR 5, PR 7)

- [x] T-050 [P] Write `hook-brief-signal-noise.bench.ts` — 4 runtimes; iter-4 7-axis matrix as fixture; assert non-zero signal counts (+80 LOC, F36 #8)
<!-- /ANCHOR:phase-3 -->

---

## §5 Cross-Phase Tasks

These tasks run at batch boundaries, not inside individual PRs.

- [x] T-051 Batch A boundary: run `bash validate.sh --strict`; run `generate-context.js` continuity save; verify validate.sh exit 0 (0 LOC)
- [x] T-052 Batch B boundary: run `bash validate.sh --strict`; run `generate-context.js`; update `_memory.continuity` in `implementation-summary.md`; verify validate.sh exit 0 (0 LOC)
- [x] T-053 Batch C boundary (final): run final `bash validate.sh --strict`; update `checklist.md` P0 items with evidence; run final `generate-context.js` save; verify validate.sh exit 0 (0 LOC) [EVIDENCE: tsc --noEmit exit 0; targeted vitest 14/14 passing on B6-fixed files; validate.sh --strict exit 0 with only pre-existing structural warnings; continuity save completed via generate-context.js (graph-metadata.json refreshed)]
- [x] T-054 AGENTS.md triad audit: confirm no stale promotion or V1-V5 references in all 3 triad files (0 LOC, F84)

---

## §6 Acceptance Mapping

| Spec AC | Criterion text (abbreviated) | Satisfied by tasks |
|---------|------------------------------|-------------------|
| US-001 AC-1 | Deep-research loop runs 20 iterations; terminal state in state file | Pre-condition met (research complete; SHIP_READY_CONFIRMED) |
| US-001 AC-2 | Iter 6 completion covers both Code Graph and Skill Advisor architecture baselines | Pre-condition met (research complete) |
| US-002 AC-1 | Each finding on RQ-01 through RQ-10 identifies exact source location | T-001, T-005, T-009, T-018, T-029, T-040, T-044 (read tasks establish source citations) |
| US-002 AC-2 | Findings marked "requires runtime observation" include concrete measurement suggestion | Covered in research.md synthesis (pre-condition met) |
| US-003 AC-1 | Follow-up spec folder exists with top recommendations mapped to tasks | T-045 (PR 7 new test file), T-047 (PR 8 bench), T-048/T-049 (PR 9 bench), T-050 (PR 10 bench) complete this mapping |
| US-003 AC-2 | Each task in follow-up spec traces back to specific finding in synthesis document | All T-NNN entries include "Closes finding(s)" column tracing to F-ids |

**Finding-to-closing-benchmark summary:**

| Finding group | PR | Tasks | Closing benchmark / acceptance criterion |
|---------------|----|-------|------------------------------------------|
| F33, F36-prereq | PR-1 | T-001–T-004 | Bench produces non-zero corpus rows (F36 bench suite unblocked) |
| F23.1, F51, F37 #1 | PR-2 | T-005–T-008 | Single advisor brief smoke test; parity test (PR 7) passes |
| F70, F52, F60, F68, F37 #5/#6/#7 | PR-3 | T-009–T-017 | Full `tsc --noEmit` + `vitest run` clean post-delete; git-grep → 0 |
| F71, F17, F18, F40 | PR-4 | T-018–T-028 | 4-surface spot-check; `tsc --noEmit` clean |
| F43, F28, F35, F36 #4/#7, F72–F76 | PR-5 | T-029–T-039 | Cardinality dry-run ≤ 9k series; each metric emits under env var |
| F81, F41, F77–F82 | PR-6 | T-040–T-043 | Listener-uniqueness test passes; invalidation count matches clear count |
| F25, F46, F56 | PR-7 | T-044–T-046 | Parity test passes; skips on non-Claude environments |
| F36 #4, F73-#2 | PR-8 | T-047 | Bench: non-zero parse samples per language; metric #2 in collector output |
| F36 #7, F28 | PR-9 | T-048–T-049 | Bench: percentile delta within 20% of baseline JSON per mode |
| F36 #8, F19–F22 | PR-10 | T-050 | Bench: non-zero signal counts per runtime; 7-axis matrix fixture loaded |

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All T-001 through T-054 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `validate.sh --strict` exit 0 at all 3 batch boundaries (T-051, T-052, T-053)
- [ ] `checklist.md` P0 items verified with evidence (T-053)
- [ ] AGENTS.md triad audit complete and clean (T-054)
- [ ] `generate-context.js` continuity saves completed at M1, M2, M3 milestones
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research synthesis**: See `research/015-code-graph-advisor-refinement-pt-01/research.md`
- **Master roadmap source**: See `research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-018.md` F83
- **Rollback cards source**: See `research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-019.md` F86
<!-- /ANCHOR:cross-refs -->

---

### Pre-Task Checklist

Before starting any PR batch:
- [ ] Confirm all prerequisite PRs have merged and CI is green
- [ ] Read the relevant iter-18 roadmap row and iter-19 rollback card for the PR
- [ ] Confirm `tsc --noEmit` baseline is clean before making edits
- [ ] Confirm target files exist and line numbers match (halt if not)

### Execution Rules

| Rule | Detail |
|------|--------|
| TASK-SEQ | Within each PR, read tasks (T-*n*01) MUST precede edit tasks (T-*n*02+) |
| TASK-BATCH | Batch A tasks (T-001–T-008) may dispatch before Batch B starts |
| TASK-DEP | T-009 (PR 3) cannot start until T-004 (PR 1) completes |
| TASK-DEP | T-029 (PR 5) cannot start until T-028 (PR 4) completes |
| TASK-DEP | T-047 (PR 8), T-048 (PR 9), T-050 (PR 10) cannot start until T-039 (PR 5) completes |
| TASK-DEP | T-050 (PR 10) additionally cannot start until T-046 (PR 7) completes |
| TASK-LOC | LOC deltas in §1 inventory are estimates; accept ±15% variance without re-planning |
| TASK-SCOPE | Do not modify files not listed in §1 Target file column without creating a new task row |
| TASK-VERIFY | Every code task requires a verification check before marking [x] |

### Status Reporting Format

After each batch boundary: report PR count merged, `tsc --noEmit` status, `vitest run` status, and count of tasks marked `[x]` vs total.

### Blocked Task Protocol

If any task is marked `[B]`: halt the batch; report the blocking condition with evidence (error message verbatim); do not proceed to dependent tasks; escalate to user with proposed resolution path.

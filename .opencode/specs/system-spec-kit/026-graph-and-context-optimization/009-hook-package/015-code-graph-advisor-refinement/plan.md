---
# SPECKIT_TEMPLATE_SOURCE: plan-core + level_3/plan.md | v2.2
title: "Implementation Plan: Code Graph and Skill Advisor Refinement — 10-PR Remediation"
description: "Executor-ready remediation plan for 10 PRs across three parallel batches (A: P0 quick wins, B: scaffolds + DELETE, C: bench fan-out). PR-3 deletion inventory reconciled by B3 to retain the memory auto-promotion semantics test. Critical path ~22h with parallelism. Sourced from 20-iteration deep-research synthesis (iter-18 F83 master roadmap + iter-19 F86 rollback cards)."
trigger_phrases:
  - "code graph advisor refinement plan"
  - "026/009/015 remediation plan"
  - "015 implementation plan"
  - "10-PR remediation roadmap"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/015-code-graph-advisor-refinement"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "remediation-plan-pass"
    recent_action: "Wrote executor-ready plan.md from iter-18/iter-19 synthesis"
    next_safe_action: "Execute Batch A (PR 1 + PR 2 in parallel)"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "research/015-code-graph-advisor-refinement-pt-01/research.md"
      - "research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-018.md"
      - "research/015-code-graph-advisor-refinement-pt-01/iterations/iteration-019.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediation-plan-015"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions:
      - "What is the implementation sequence? (answered: iter-18 F83 10-PR roadmap)"
      - "What are the per-PR rollback SLOs? (answered: iter-19 F86/F87)"
---
# Implementation Plan: Code Graph and Skill Advisor Refinement — 10-PR Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level_3/plan.md | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (source edits), vitest (test/bench), JSON (settings) |
| **Framework** | mcp_server skill-advisor + code-graph package |
| **Storage** | JSONL metrics persistence (`lib/metrics.ts`); no DB migrations |
| **Testing** | `vitest run` (full suite + targeted PR suites); `tsc --noEmit` per PR |

### Overview

This plan executes the 10-PR remediation roadmap produced by the 20-iteration deep-research loop (`iter-18 F83`). The work is organized into three sequenced parallel batches: Batch A (P0 quick wins — 2 PRs, parallelizable), Batch B (scaffolds + DELETE — 5 PRs, partially parallelizable after Batch A lands), and Batch C (bench fan-out — 3 PRs, all parallel after PR 5). B3 reconciles PR 3 so the delete sweep removes the orphaned promotion subsystem while retaining `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts` as memory auto-promotion semantics coverage. Critical path with parallelism is ~22 hours; sequential is ~30 hours.

**Research basis**: `research/015-code-graph-advisor-refinement-pt-01/research.md` §11 (roadmap), §12 (rollback), §13 (metrics namespace). All citations in this plan are recoverable from that synthesis and the per-iteration delta JSONL records.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Research synthesis complete: 20/20 iterations, SHIP_READY_CONFIRMED (iter-20)
- [x] Master roadmap finalized (iter-18 F83) with explicit PR sequencing and dependency graph
- [x] Per-PR rollback cards written (iter-19 F86) — SLO, canary, and blockers defined
- [x] Cross-packet preflight passed: zero importers of `lib/promotion/` in sibling specs (iter-14)
- [x] AGENTS.md triad audit clean: no stale promotion or V1-V5 references (iter-20 F84)
- [ ] Executor has read iter-18 and iter-19 in full before starting any PR

### Definition of Done

- [ ] All 10 PRs merged, each with `tsc --noEmit` + `vitest run` green
- [ ] `checklist.md` P0 items verified with evidence
- [ ] `implementation-summary.md` updated at each batch boundary milestone
- [ ] `generate-context.js` continuity save run after each batch
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Surgical edit + targeted deletion + instrumentation scaffolding. No new services, no new dependencies, no DB migrations.

### Key Components

- **`mcp_server/skill-advisor/lib/metrics.ts`**: Extended by PR 5 with 16 canonical metrics (currently 473 LOC; +~150 LOC)
- **`mcp_server/skill-advisor/lib/freshness/trust-state.ts`**: New canonical `TrustState` re-export created by PR 4
- **`mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts`**: New file created by PR 7
- **`mcp_server/skill-advisor/bench/`**: Three new bench files created by PRs 8, 9, 10
- **`.claude/settings.local.json`**: Rewritten by PR 2 (−31 LOC)
- **`mcp_server/skill-advisor/lib/promotion/`**: Entirely deleted by PR 3 (6 code files, 1 schema, 1 promotion-subsystem test file, 3 bench files); `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts` is retained outside delete scope as memory auto-promotion semantics coverage

### Data Flow

Settings wiring fix (PR 2) → hook fires correctly → parity test (PR 7) asserts shape → metrics scaffold (PR 5) instruments the corrected surface → bench files (PRs 8-10) consume instrumented surface → cardinality meta-gauge monitors blowup risk.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase Overview (Batches A / B / C)

### Ordering Rationale

1. **Blocker-first**: PR 1 (corpus-path fix) lands before any bench so the harness runs.
2. **Diff-minimality before feature-add**: Deletions (PR 3) precede additions (PR 5); -31 LOC settings rewrite (PR 2) is in the early P0 batch.
3. **Vocabulary before instrumentation**: PR 4 (state vocab unification) precedes PR 5 (metrics) so `freshness_state` label values use canonical names from the start; avoids cardinality churn on label rename.
4. **Disposal before related metric design**: PR 3 (DELETE promotion) before PR 5 (metrics) — `lib/metrics.ts` extension explicitly omits promotion metrics per iter-16 F73.
5. **Test/bench after the production seam exists**: PR 7 (test) after PR 2 (the surface under test); PRs 8-10 (benches) after PR 5 (the metrics they consume).
6. **Evidence-cited, not speculative**: Every PR has a file:line citation from the deep-research iterations. PR 11 (Option B) is excluded — Option A DELETE was ratified in iter-13 F37-CLOSURE.

Critical path (sequential): PR 2 → PR 3 → PR 4 → PR 5 → PR 9 ≈ 1 + 6 + 5 + 12 + 6 = ~30h
Critical path (with parallelism): ~22h (Batch A + Batch B max + Batch C max)
<!-- /ANCHOR:phases -->

---

## 5. PHASE 1 — BATCH A: P0 Quick Wins

**PRs 1 and 2 run in parallel. No shared files. Estimated combined wall-clock: 1–2h.**

### PR 1 — Corpus-Path Bench Wiring Fix (P0, +4 LOC, S ~1-2h)

**Closes:** F33, F36-prerequisite
**Target files:**
- `mcp_server/skill-advisor/bench/scorer-bench.ts` (4-line change)
- Optional: `mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts` (1-line corpus path)

**What:** The ablation harness reads corpus from a non-existent spec-subfolder path. Fix repoints `CORPUS_PATH` to `scripts/routing-accuracy/labeled-prompts.jsonl`. Extract to `SPECKIT_BENCH_CORPUS_PATH` const; read from `package.json#bench.corpusPath`.

**Pre-merge sanity:**
- `tsc --noEmit` clean
- `vitest run skill-advisor/bench/scorer-bench.ts` produces non-zero corpus rows (was previously failing silently with empty corpus)
- `node -e "require('./package.json').bench"` resolves the new `corpusPath` if added

**Post-merge monitoring:** 24h watch on CI bench-job exit code.
**Revert SLO:** next-business-day. Bench-only; zero production blast radius.

---

### PR 2 — `.claude/settings.local.json` Rewrite (P0, −31 LOC, S ~1-2h)

**Closes:** F23.1, F37 #1, F51, F46-prep
**Target files:**
- `.claude/settings.local.json` (flatten 4 nested hook entries to single `hooks.UserPromptSubmit` array entry with top-level `command` pointing to `dist/hooks/claude/user-prompt-submit.js`)

**What:** Current broken shape dispatches the Copilot adapter for Claude sessions, silently corrupting per-runtime telemetry. Fix: −31 LOC net deletion, replacing the parallel-hook block with a single `UserPromptSubmit` array entry.

**Pre-merge sanity:**
- `jq . .claude/settings.local.json` (JSON validity)
- Schema match: single-array `hooks.UserPromptSubmit`
- Smoke test: launch Claude Code session locally, prompt arbitrary text, capture Read-tool log to verify single advisor brief renders

**Post-merge monitoring:** First 1h watch on user-reported absent-or-duplicate advisor brief.
**Revert SLO:** **15min**. User-facing dev tooling regression; revert directly on main if advisor brief disappears.
**Rollback blocker:** If PR 7 has landed, revert PR 7 first (un-break the parity test), then PR 2.

---

## 6. PHASE 2 — BATCH B: Scaffolds + DELETE

**PRs 3 and 4 must run sequentially (PR 3 first). PRs 5 and 6 can run in parallel after PR 3+4 land. PR 7 can start in parallel with PR 5+6 once PR 2 has landed. Estimated combined wall-clock (critical path through PR 5): ~21h.**

### PR 3 — Promotion Subsystem DELETE Sweep (P1, −868 LOC, M ~4-6h) — HIGHEST REVERT COST

**Closes:** F37 #5/#6/#7 closure, F60, F61, F62, F70, F68, F47, F52, F57
**Depends on:** PR 1 (history hygiene — so corpus-path fix is captured in git blame before bench files are deleted)
**Target files (delete):**
- `mcp_server/skill-advisor/lib/promotion/gate-bundle.ts`
- `mcp_server/skill-advisor/lib/promotion/rollback.ts`
- `mcp_server/skill-advisor/lib/promotion/semantic-lock.ts`
- `mcp_server/skill-advisor/lib/promotion/shadow-cycle.ts`
- `mcp_server/skill-advisor/lib/promotion/two-cycle-requirement.ts`
- `mcp_server/skill-advisor/lib/promotion/weight-delta-cap.ts`
- `mcp_server/skill-advisor/schemas/promotion-cycle.ts`
- `mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts`
- `mcp_server/skill-advisor/bench/corpus-bench.ts`
- `mcp_server/skill-advisor/bench/safety-bench.ts`
- `mcp_server/skill-advisor/bench/holdout-bench.ts`
- 12 doc files (ref: iter-14 doc scrub list)
**Target files (update):** `mcp_server/package.json` (remove `corpus-bench`/`safety-bench`/`holdout-bench` script rows)
**Retained outside delete scope:** `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts` covers memory auto-promotion threshold semantics through `lib/search/auto-promotion` and `lib/scoring/confidence-tracker`; it is not part of the removed `skill-advisor/lib/promotion/` gate subsystem.

**Pre-merge sanity (rigor matches blast radius):**
- `tsc --noEmit` clean across full repo (re-run iter-14 preflight)
- `vitest run` full suite passes (deleted tests should not orphan any helper imports)
- `git grep -l 'lib/promotion\|promotion-cycle\|promotion-orchestrate' -- '*.md' '*.ts' '*.json'` → ZERO matches
- `git grep -l 'corpus-bench\|safety-bench\|holdout-bench' -- '*.json' '*.md'` → ZERO matches
- `find .opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts -maxdepth 1 -print` returns the retained memory auto-promotion semantics test
- Sibling-spec doc grep: no stale references in `002-skill-graph-daemon-and-advisor-unification` or `042-sk-deep-research-review-improvement-2`

**Post-merge monitoring:** 48h watch on CI test/bench job failures + operator reports of "feature missing".
**Revert SLO:** **1hr**. Invasive but reversible via `git revert -m 1 <merge-sha>` (restores deleted PR-3 promotion subsystem files). Plan single-commit PR so revert is clean.
**Rollback blocker:** Size of the revert PR itself — reviewers validate by file count + diff symmetry, not line-by-line. Tag all doc-scrub commits with `delete-sweep-doc-scrub` git trailer. Reverting PR 3 requires re-opening `decision-record.md` entry.

---

### PR 4 — State-Vocabulary Unification (P1, ~+30 LOC, M ~3-5h) — MIGRATION RISK

**Closes:** F40, F71, F18, F17, F37 #2
**Depends on:** PR 3
**Target files (8-step migration, ~30 LOC net):**

| Step | File | Edit |
|------|------|------|
| 1 | `code-graph/lib/ensure-ready.ts:22` | Replace local `GraphFreshness` type with import from `ops-hardening.ts` (V2 wins as superset) |
| 2 | `code-graph/lib/readiness-contract.ts` | Add `case 'error': return 'missing';` arm to `canonicalReadinessFromFreshness` |
| 3 | `code-graph/lib/startup-brief.ts:43,213,240,247` | Map `freshness === 'error'` → `graphState: 'missing'`; remove redundant `'missing'` branch |
| 4 | `code-graph/lib/context/shared-payload.ts` | Widen union to 4 values; emit `'unavailable'` when freshness is `'error'` |
| 5 | `code-graph/handlers/context.ts:224-229` | Remove manual `trustState: 'unavailable' as const` injection |
| 6 | `code-graph/handlers/query.ts:623-780` | Add `'unavailable'` trust-state path on readiness-crash to match S2 |
| 7 | `code-graph/handlers/status.ts:35` | Replace V4-vocabulary `reason` string with switch on unified V2 enum |
| 8 | `code-graph/lib/context/shared-payload.ts` | Update `trustStateFromGraphState` mapper to handle widened 4-val union |

Create `TrustState` canonical re-export from `skill-advisor/lib/freshness/trust-state.ts` with type-alias deprecations for V1-V5 for one release.

**Pre-merge sanity:**
- `tsc --noEmit` clean (catches type-narrowing breaks)
- `vitest run` full suite passes
- Manual spot-check on 4 surfaces: `code_graph_status`, `code_graph_context`, `code_graph_query`, startup brief — all return canonical state value
- `git grep -l 'GraphFreshness\|TrustState'` confirms legacy aliases still re-export

**Post-merge monitoring:** 24h watch on advisor-brief renderer error rate; grep external consumers (Barter, fs-enterprises) for field names `freshness`, `state`, `payloadTrust`, `readinessState`.
**Revert SLO:** **1hr**. Vocabulary changes are silent-failure-prone.
**Canary:** Shadow-only recommended — emit both old and new field names for one release.
**Rollback blocker:** If PR 5 landed, evaluate: accept "unknown_state" labels 24-48h → revert PR 4 standalone + patch PR 5 label mapping; OR revert PR 4 + PR 5 together.

---

### PR 5 — Instrumentation Namespace Scaffold (P1, ~+150 LOC, L ~8-12h) — SCHEMA VERSION RISK

**Closes:** F28, F35, F36 #4/#7, F43, F50, F72, F73, F74, F75, F76, F77 (signal-only metric)
**Depends on:** PR 3, PR 4
**Parallel with:** PR 6 (once PR 3+4 landed)
**Target files:**
- `mcp_server/skill-advisor/lib/metrics.ts` (extend from 473 LOC; +~150 LOC for 16 canonical metrics)

**Emission anchors (8 sites):**
- `code-graph/lib/structural-indexer.ts:698` — metrics #1, #5, #6
- `code-graph/lib/tree-sitter-parser.ts` parseFile entry/exit — metric #2
- `code-graph/lib/code-graph-context.ts:114-375` — metrics #3, #4
- `skill-advisor/lib/scorer/fusion.ts:172-230` — metrics #7, #8, #9
- `skill-advisor/lib/scorer/attribution.ts:10-31` — metric #7
- `skill-advisor/lib/prompt-cache.ts:97-117` — metrics #11, #14
- `skill-advisor/lib/freshness/trust-state.ts` — metric #12
- `skill-advisor/lib/freshness/cache-invalidation.ts:35` — metric #13

**Metric catalog (16 metrics, snake_case on-disk per F74; dotted names are doc-only):**

| # | On-disk name | Type | Emission point |
|---|---|---|---|
| 1 | `speckit_graph_scan_duration_ms` | histogram | `structural-indexer.ts:698` |
| 2 | `speckit_graph_parse_duration_ms` | histogram | `tree-sitter-parser.ts` |
| 3 | `speckit_graph_query_latency_ms` | histogram | `code-graph-context.ts:114` |
| 4 | `speckit_graph_query_cache_hits_total` + `..._misses_total` | counter | `code-graph-context.ts:114` |
| 5 | `speckit_graph_edges_extracted_total` + `..._dropped_total` | counter | `structural-indexer.ts:698` |
| 6 | `speckit_graph_partial_persist_retries_total` | counter | `code-graph-db.ts` retry-loop |
| 7 | `speckit_advisor_lane_contribution_weighted` | histogram | `fusion.ts:223-230` |
| 8 | `speckit_advisor_fusion_live_weight_share` | gauge | `fusion.ts:213-214` |
| 9 | `speckit_advisor_primary_intent_bonus_total` | counter | `fusion.ts:172-194` |
| 10 | `speckit_advisor_scorer_brier_score` | summary | `scorer/ablation.ts` |
| 11 | `speckit_advisor_near_dup_cache_misses_total` + `..._hits_total` | counter | `prompt-cache.ts:97` |
| 12 | `speckit_freshness_state_transitions_total` | counter | `freshness/trust-state.ts` |
| 13 | `speckit_freshness_source_signature_bumps_total` | counter | `freshness/cache-invalidation.ts:35` |
| 14 | `speckit_freshness_prompt_cache_hits_total` + `..._misses_total` | counter | `prompt-cache.ts:97-117` |
| 15 | `speckit_metrics_emission_drops_total` | counter | `metrics.ts:243-247` |
| 16 | `speckit_runtime_detection_latency_ms` | histogram | `code-graph/lib/runtime-detection.ts` |

NO promotion metrics. `git grep -i promotion mcp_server/skill-advisor/lib/metrics.ts` → ZERO.

**Pre-merge sanity:**
- `tsc --noEmit` + `vitest run` clean
- Cardinality dry-run: ≤ 14 metrics × bounded labels; hard cap ~9,000 distinct series (4 runtimes × 8 languages × 2 outcomes × bucketed values)
- `git grep '"speckit\.' mcp_server/skill-advisor/lib/metrics.ts` → ZERO (dotted names are doc-only)
- Bucket-boundary verification: `nodes_bucket` boundaries match iter-16 F73 catalog
- Schema extension is additive-only — no persistence format version bump

**Canary:** Gate emission behind `SPECKIT_METRICS_ENABLED` env var (default off). Flip: 10% → 50% → 100% over 24h each.
**Revert SLO:** **1hr** for cardinality/perf regressions; next-business-day for metric-name typos.
**Post-merge monitoring:** First 24h: `metrics_unique_series_count` meta-gauge; alert if > 9,000 series in any 5-minute window. First 48h: per-metric emission rate.

---

### PR 6 — Prompt-Cache Invalidation Listener Wire-Up (P1, +5 LOC, S ~1h)

**Closes:** F41, F77, F78, F79, F80, F81, F82
**Depends on:** PR 4 (canonical state vocabulary in scope)
**Parallel with:** PR 5 (once PR 3+4 landed)
**Target files:**
- `mcp_server/skill-advisor/lib/skill-advisor-brief.ts` — add `cacheInvalidation.onCacheInvalidation((reason) => advisorPromptCache.clear())` at module-init scope (~5 LOC)

**Pre-merge sanity:**
- `tsc --noEmit` + `vitest run` clean
- Listener uniqueness assertion: unit test asserting only one listener registered per process (catches "listener registered per-request" bug)
- Patch-site verification: confirm registration is in module-init scope, not request-handler scope

**Post-merge monitoring:** 24h watch on `advisor.prompt_cache.invalidation_received` (fires once per cache-invalidation event); 24h watch on `advisor.prompt_cache.clear_count` (should match invalidation count 1:1).
**Revert SLO:** **1hr**. Cache staleness is observable but not catastrophic.

---

### PR 7 — Settings-Driven-Invocation-Parity Test (P1, +150 LOC, M ~3-4h)

**Closes:** F25, F46, F56
**Depends on:** PR 2
**Can start in parallel with:** PRs 5 and 6 once PR 2 has landed
**Target files:**
- NEW: `mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts` (~150 LOC)

**What:** Asserts `.claude/settings.local.json` `hooks.UserPromptSubmit` is a single array entry pointing to the runtime-launcher. Claude-only (per iter-10 F51 retraction; must include runtime check that skips on non-Claude environments). Assert ONLY `hooks.UserPromptSubmit[0].command` shape — do NOT over-specify env vars, matchers, or other fields.

**Pre-merge sanity:**
- `vitest run mcp_server/skill-advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts` passes
- Schema-mock brittleness check: assert only array shape + 1st-element script path
- Claude-only assertion present: test skips on non-Claude environments

**Post-merge monitoring:** 24h watch on CI test-job pass rate.
**Revert SLO:** next-business-day. Test-only; no runtime impact.
**Rollback blocker:** If PR 2 reverts, PR 7 fails; revert both together.

---

## 7. PHASE 3 — BATCH C: Bench Fan-Out

**PRs 8, 9, and 10 are all parallel. All depend on PR 5 (metrics scaffold). PR 10 also depends on PR 7. Estimated combined wall-clock: ~6h (PR 9 is the longest at 4-6h).**

### PR 8 — Parse-Latency Bench (P2, +80 LOC, S ~2-3h)

**Closes:** F36 #4, F73-#2
**Depends on:** PR 5
**Target files:**
- NEW: `mcp_server/skill-advisor/bench/code-graph-parse-latency.bench.ts` (~80 LOC)

**What:** Wraps `parseFile` per language; emits `speckit_graph_parse_duration_ms` P50/P95/P99 per language. Uses metric #2 from PR 5.

**Pre-merge sanity:**
- Bench runs to completion (`vitest bench` or project bench runner)
- Asserts non-zero sample count per language (fail bench if any language emits zero samples)
- Emits PR 5 metric `speckit_graph_parse_duration_ms` — verify metric appears in collector output

**Revert SLO:** next-business-day. Bench-only.

---

### PR 9 — Query-Latency Bench (P2, +100 LOC, M ~4-6h)

**Closes:** F36 #7, F73-#3/#4, F28
**Depends on:** PR 5
**Target files:**
- NEW: `mcp_server/skill-advisor/bench/code-graph-query-latency.bench.ts` (~100 LOC)
- NEW: `mcp_server/skill-advisor/bench/code-graph-query-latency.baseline.json` (pinned corpus snapshot)

**What:** Wraps `handleCodeGraphQuery` for `outline`, `blast_radius`, `relationship` modes; emits `speckit_graph_query_latency_ms` + cache hit/miss counters P50/P95/P99 per mode. Pins corpus to a hashed snapshot; asserts percentile DELTA vs baseline JSON (not absolute thresholds) to avoid corpus-drift flakiness.

**Pre-merge sanity:**
- Bench runs to completion across all 3 modes
- Pinned corpus snapshot committed alongside bench
- Asserts percentile delta vs baseline JSON (not absolute)

**Post-merge monitoring:** 7d watch on CI bench percentile drift; alert on > 20% p99 delta vs baseline.
**Revert SLO:** next-business-day. Also revert baseline JSON file when reverting bench.

---

### PR 10 — Hook-Brief Signal-Noise Bench (P2, +80 LOC, S-M ~3-4h)

**Closes:** F36 #8, F19, F20, F21, F22
**Depends on:** PR 5, PR 7
**Target files:**
- NEW: `mcp_server/skill-advisor/bench/hook-brief-signal-noise.bench.ts` (~80 LOC)

**What:** Per-runtime invocation of brief renderer across all 4 runtimes (claude, codex, gemini, copilot); emits decision-relevant-fields-count + total-fields-count + token-budget using metric #11 and structural counters from PR 5. Uses the iter-4 7-axis matrix as ground-truth fixture: load-bearing axis = signal; decorative axis = noise.

**Pre-merge sanity:**
- Bench runs across all 4 runtimes
- Iter-4 7-axis matrix loaded as fixture
- Asserts non-zero signal count per runtime

**Post-merge monitoring:** 7d watch on signal-noise ratio per runtime; alert on > 30% drop vs baseline.
**Revert SLO:** next-business-day.

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Listener-uniqueness (PR 6); settings-parity (PR 7) | vitest |
| Integration | Full `vitest run` after each PR merge | vitest |
| Type-check | `tsc --noEmit` — required for PRs 1, 3, 4, 5, 6 | tsc |
| Bench | Per-language parse latency (PR 8); query latency per mode (PR 9); signal-noise per runtime (PR 10) | vitest bench |
| Manual | Smoke-test: single advisor brief renders post PR 2 | Claude Code session |
<!-- /ANCHOR:testing -->

---

## 8. QUALITY GATES PER PR

Pre-merge sanity per PR is specified in §§5-7 above. Summary table:

| PR # | tsc --noEmit | vitest run | Specific check | Revert SLO |
|------|-------------|------------|----------------|------------|
| 1 | required | bench only | corpus rows > 0 | next-business-day |
| 2 | not required | not required | smoke-test: single brief renders | **15min** |
| 3 | **required** (full repo) | **required** (full suite) | git-grep promoton → 0; doc scrub → 0 | **1hr** |
| 4 | required | required | 4-surface spot-check + deprecation alias grep | **1hr** |
| 5 | required | required | cardinality dry-run ≤ 9k series; snake_case audit; additive schema | **1hr** |
| 6 | required | required | listener-uniqueness unit test; patch-site in module-init | 1hr |
| 7 | not required | required (targeted) | schema-mock shape assertion only; Claude-only skip present | next-business-day |
| 8 | not required | bench | non-zero sample count per language | next-business-day |
| 9 | not required | bench | delta-vs-baseline assertion; baseline committed | next-business-day |
| 10 | not required | bench | 4-runtime coverage; 7-axis matrix fixture loaded | next-business-day |

---

<!-- ANCHOR:dependencies -->
## 9. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| iter-18 F83 master roadmap | Research output | Green | Cannot sequence PRs |
| iter-19 F86 rollback cards | Research output | Green | Cannot determine SLOs |
| `mcp_server/skill-advisor/lib/metrics.ts` (473 LOC base) | Internal | Green | PR 5 cannot extend |
| `skill-advisor/lib/freshness/trust-state.ts` | Internal | Green | PR 4 canonical re-export target |
| `mcp_server/skill-advisor/lib/skill-advisor-brief.ts` | Internal | Green | PR 6 listener wire-up site |
| `mcp_server/skill-advisor/lib/freshness/cache-invalidation.ts` | Internal | Green | PR 6 event bus |
| iter-14 cross-packet preflight (zero promotion importers) | Research output | Green | PR 3 DELETE safety |
| iter-4 7-axis matrix (signal/noise ground truth) | Research output | Green | PR 10 bench fixture |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 10. ROLLBACK PLAN

Full per-PR rollback cards are in §§5-7 above. **Cross-PR rollback-ordering invariants (iter-19 F88):**

1. **Default:** reverse-of-merge-order is the safe path.
2. **Exception — PR 2 + PR 7:** If PR 2 needs revert and PR 7 has landed, revert PR 7 first (un-skip the broken-shape test), then PR 2.
3. **Exception — PR 4 + PR 5:** If PR 4 needs revert and PR 5 has landed, evaluate label-mismatch tolerance. If "unknown_state" labels are tolerable for 24-48h → revert PR 4 standalone + patch PR 5 label mapping in a fix-forward. Otherwise → revert PR 4 + PR 5 together.
4. **Exception — PR 3:** Reverting PR 3 requires NO downstream PR cleanup. "Disposal before related metric design" ordering principle means PRs 4-10 do not touch promotion code.
5. **AGENTS.md triad sync:** Any revert that touched the triad (AGENTS.md / AGENTS_Barter.md / AGENTS_example_fs_enterprises.md) must also revert the triad edits in the same revert PR (per user standing instruction).

**Risk-tier summary (iter-19 F87):**

| PR # | Severity | Revert SLO | Canary | Highest risk |
|------|----------|------------|--------|--------------|
| 1 | P0 | next-business-day | none | bench-job failure |
| 2 | P0 | **15min** | none | advisor brief absent/duplicate |
| 3 | P1 | **1hr** | NOT APPLICABLE | hidden importer + large delete-sweep revert burden |
| 4 | P1 | **1hr** | shadow-only recommended | consumer reading deprecated field |
| 5 | P1 | **1hr** | **percentage rollout** | cardinality blowup + schema version bump |
| 6 | P1 | 1hr | none | duplicate-clear log spam |
| 7 | P1 | next-business-day | none | brittle schema mock |
| 8 | P2 | next-business-day | none | parser failures masked |
| 9 | P2 | next-business-day | none | corpus drift flakiness |
| 10 | P2 | next-business-day | none | subjective signal definition |

PRs 3, 4, 5, 6 are the operationally load-bearing set (1hr SLO). Everything else is dev-tooling or test-only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Batch A: PR 1 || PR 2 (no shared files)
                |            |
                v            |
         PR 3 (DELETE)       |
                |            |
                v            |
         PR 4 (vocab)        |
                |            |
         Batch B: PR 5 || PR 6 (after PR 3+4)
                |            |
                |   ┌────────┘
                |   |
                v   v
             PR 7 (test; needs PR 2)
                |
         Batch C: PR 8 || PR 9 || PR 10 (after PR 5; PR 10 also after PR 7)
```

| Batch | PRs | Depends On | Blocks |
|-------|-----|------------|--------|
| A | PR 1, PR 2 | None | PR 3 (from PR 1); PR 7 (from PR 2) |
| B-sequential | PR 3, PR 4 | Batch A (PR 1) | PR 5, PR 6 |
| B-parallel | PR 5, PR 6 | PR 3, PR 4 | Batch C |
| B-parallel | PR 7 | PR 2 | PR 10 |
| C | PR 8, PR 9, PR 10 | PR 5 (all); PR 7 (PR 10 only) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | PRs | Complexity | Estimated Effort |
|-------|-----|------------|------------------|
| Batch A (parallel) | PR 1 + PR 2 | Low | 1-2h wall-clock |
| Batch B-seq (PR 3) | PR 3 | High (blast radius) | 4-6h |
| Batch B-seq (PR 4) | PR 4 | Medium | 3-5h |
| Batch B-par (PR 5) | PR 5 | High | 8-12h |
| Batch B-par (PR 6) | PR 6 | Low | 1h |
| Batch B-par (PR 7) | PR 7 | Medium | 3-4h |
| Batch C (parallel) | PR 8 + PR 9 + PR 10 | Low-Medium | 4-6h wall-clock |
| **Total (critical path with parallelism)** | | | **~22h** |
| **Total (sequential)** | | | **~30h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH (ASCII — from iter-18 F84)

```
                                              (parallel batch A: P0 quick wins)
                                              ┌──────────────────────────────┐
                                              │  PR 1: corpus-path fix (S)   │
                                              │  PR 2: settings.json (S)     │
                                              └─────┬──────────────┬─────────┘
                                                    │              │
                                                    v              │
                                         ┌─────────────────────┐  │
                                         │  PR 3: DELETE sweep  │  │
                                         │  promotion (M)       │  │
                                         └──────────┬──────────┘  │
                                                    │              │
                                                    v              │
                                         ┌─────────────────────┐  │
                                         │  PR 4: state vocab   │  │
                                         │  unification (M)     │  │
                                         └──────────┬──────────┘  │
                                                    │              │
                                         (parallel batch B: scaffolds)
                                         ┌──────────────────────┐  │
                                         │  PR 5: metrics (L)   │  │
                                         │  PR 6: cache (S)     │  │
                                         └──────────┬───────────┘  │
                                                    │   ┌──────────┘
                                                    │   │
                                                    v   v
                                         ┌────────────────────┐
                                         │  PR 7: settings    │
                                         │  test (M; PR 2)    │
                                         └──────────┬─────────┘
                                                    │
                                         (parallel batch C: bench fan-out)
                                         ┌────────────────────────────────┐
                                         │ PR 8: parse-latency bench (S)  │
                                         │ PR 9: query-latency bench (M)  │
                                         │ PR 10: hook-brief bench (S-M)  │
                                         └────────────────────────────────┘

LEGEND: --> must-precede; S/M/L = effort; P0/P1/P2 = priority
BATCH A: PR 1 || PR 2 (no shared files)
BATCH B: PR 5 || PR 6 (after PR 3+4); PR 7 in parallel after PR 2
BATCH C: PR 8 || PR 9 || PR 10 (after PR 5; PR 10 also after PR 7)
CRITICAL PATH: PR 2 → PR 3 → PR 4 → PR 5 → PR 9 ~= 1+6+5+12+6 = ~30h sequential
With parallelism: ~22h
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **PR 2 — settings rewrite** — 1-2h — CRITICAL (unblocks PR 7 + provides correct telemetry baseline)
2. **PR 3 — DELETE sweep** — 4-6h — CRITICAL (unblocks PR 4)
3. **PR 4 — vocabulary unification** — 3-5h — CRITICAL (unblocks PR 5 + PR 6)
4. **PR 5 — metrics scaffold** — 8-12h — CRITICAL (unblocks PRs 8/9/10; longest single PR)
5. **PR 9 — query-latency bench** — 4-6h — CRITICAL (longest Batch C item)

**Total Critical Path**: ~22h with parallelism (30h sequential)

**Parallel Opportunities:**
- PR 1 and PR 2 can run simultaneously (no shared files)
- PR 5 and PR 6 can run simultaneously (after PR 3+4)
- PR 7 can run in parallel with PR 5+6 (after PR 2)
- PR 8, PR 9, PR 10 can all run simultaneously (after PR 5)
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Comms action |
|-----------|-------------|------------------|--------------|
| M1 — Batch A complete | PR 1 + PR 2 merged | Bench harness produces non-zero corpus rows; smoke test shows single advisor brief | Update `_memory.continuity` in `implementation-summary.md`; run `generate-context.js` |
| M2 — Batch B complete | PRs 3-7 all merged | Full `tsc --noEmit` + `vitest run` green; zero promotion references; metrics emitting under env var; parity test passes | Update `_memory.continuity`; run `generate-context.js` |
| M3 — Batch C complete | PRs 8-10 all merged | All 3 bench files produce non-zero sample counts; query-latency baseline committed | Mark `checklist.md` P0 items complete; final `generate-context.js` save |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Option A (DELETE) for Promotion Subsystem

**Status**: Accepted (iter-13 F37-CLOSURE memo; iter-14 cross-packet preflight)

**Context**: The 6-module promotion subsystem (`lib/promotion/`) has zero production callers, full unit test coverage, and no documented wiring intent. Two options: A) DELETE, B) KEEP and land 13-gate enhancements (F15 matrix).

**Decision**: Option A — DELETE the orphaned promotion subsystem. Cross-packet preflight confirmed zero importers. The subsystem test coverage is comprehensive but the handler endpoint and wiring path are absent, indicating a "build-then-wire" pattern that was never completed. B3 clarifies that `mcp_server/tests/promotion-positive-validation-semantics.vitest.ts` is retained because it validates memory auto-promotion threshold semantics outside `skill-advisor/lib/promotion/`.

**Consequences:**
- Net LOC delta for PR 3: approximately -868 after retaining the memory auto-promotion semantics test outside delete scope
- F15 13-gate enhancement matrix becomes contingent on Option B (moot under Option A)
- If a downstream consumer of the promotion subsystem materializes, PR 11 (contingent) must be landed; this requires re-opening `decision-record.md`

**Alternatives Rejected:**
- **Option B (KEEP)**: Rejected. Zero callers, no wiring intent, and maintaining dead code increases future maintenance burden. PR 11 is documented as a contingent fallback only.

### ADR-002: Metric Library — Extend Existing metrics.ts (Option C)

**Status**: Accepted (iter-16 F74)

**Context**: Three options for the instrumentation namespace: A) new `@opentelemetry/api` dependency, B) parallel module, C) extend existing `mcp_server/skill-advisor/lib/metrics.ts`.

**Decision**: Option C — extend existing `lib/metrics.ts` (no new runtime dependencies). The existing closed-schema `FORBIDDEN_DIAGNOSTIC_FIELDS` validator, `writeBoundedJsonl` persistence, and `workspaceHash` patterns are inherited by all new collectors.

**Consequences:**
- `lib/metrics.ts` grows from 473 to ~623 LOC (acceptable for a single metrics module)
- Rename to `mcp_server/lib/metrics.ts` and keep a re-export shim at the old path for one release

**Alternatives Rejected:**
- **Option A (`@opentelemetry/api`)**: Cost exceeds benefit for short-lived hook processes across 4 runtimes (iter-16 F74 rationale)
- **Option B (parallel module)**: Duplicates persistence and validation patterns already in `metrics.ts`

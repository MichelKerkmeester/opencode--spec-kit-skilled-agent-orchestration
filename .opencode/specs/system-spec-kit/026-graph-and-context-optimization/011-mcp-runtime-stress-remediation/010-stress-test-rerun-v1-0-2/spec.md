---
# SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2
title: "Feature Specification: Stress-Test Rerun v1.0.2 — close-the-loop measurement"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
description: "Re-run the v1.0.1 30-cell stress-test sweep against the post-fix dist (fork v0.2.3+spec-kit-fork.0.2.0; remediation packets 003-009 landed). Score under the same 4-dim rubric, classify per-cell deltas as WIN / NEUTRAL / REGRESSION, and produce a per-packet verdict so we know whether each fix actually moved the needle."
trigger_phrases:
  - "010-stress-test-rerun-v1-0-2"
  - "v1.0.2 stress test rerun"
  - "post-fix sweep"
  - "close-the-loop measurement"
  - "30-cell rerun"
  - "per-packet verdict"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2"
    last_updated_at: "2026-04-27T15:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet"
    next_safe_action: "T001 daemon-restart attestation pre-flight"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: null
      session_id: "010-stress-test-rerun-v1-0-2-scaffold-2026-04-27"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->
<!-- PHASE_LINKS_PARENT: ../spec.md; PREDECESSOR: 009-memory-search-response-policy; SUCCESSOR: 011-post-stress-followup-research -->

# Feature Specification: Stress-Test Rerun v1.0.2 — close-the-loop measurement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft (scaffold; execution pending) |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `011-mcp-runtime-stress-remediation` |
| **Predecessor** | `../001-search-intelligence-stress-test` (v1.0.1 baseline; frozen) |
| **Successor** | None (current tail) |
| **Handoff Criteria** | All 30 cells have v1.0.2 score.md entries with v1.0.1 baseline + delta classification; per-packet verdict table populated for packets 003-009; no REGRESSION cells unresolved. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The v1.0.1 stress-test sweep (`../001-search-intelligence-stress-test/002-scenario-execution/findings.md`) baselined the four MCP-runtime surfaces against a 30-cell scenario matrix on 2026-04-26 and surfaced the regressions that drove the eight remediation packets shipped earlier this session (003-009 in the renumbered phase tree, originally tracked as 008-014). All eight remediation packets landed source patches plus rebuilt `dist/`, and live MCP probes earlier this session confirmed the fork dist is loaded in production. What is *not yet measured* is the impact: did the contract additions (`preEnforcementTokens`, `fallbackDecision`, `path_class` rerank, `responsePolicy.noCanonicalPathClaims`, normalized `IntentTelemetry`, `deltaByRelation`, daemon rebuild protocol) actually move the per-cell quality, latency, and hallucination scores compared to the v1.0.1 baseline? Without that measurement, the remediation cycle is "shipped but unconfirmed" and HANDOVER-deferred.md §2.1 stays open indefinitely.

### Purpose
Re-run the same 30-cell sweep on the post-fix dist, score it under the same v1.0.1 rubric (4 dimensions, 0-2 scale, 8 pts max per cell — no recalibration; the rubric stays canonical so deltas are directly comparable), and aggregate per-cell deltas into per-packet verdicts. Headline question this packet exists to answer: **"For each remediation packet 003-009, did at least one cell improve by ≥1 point under the v1.0.1 rubric?"** A YES across the board closes HANDOVER-deferred §2.1 with green evidence; any NO is an indicator that the source-code patches shipped but didn't reach the runtime path the rubric exercises.

This packet is **scaffold-stage** — spec, plan, task ledger, and metadata are authored now; the actual sweep dispatch and findings.md synthesis run in a follow-on session after a daemon-restart attestation gate passes (per packet 008's rebuild protocol).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Pre-flight daemon-restart attestation**: confirm `ccc --version` reports `+spec-kit-fork.0.2.0`, `memory_context` smoke probe returns `meta.tokenBudgetEnforcement.preEnforcementTokens` populated, `code_graph_status` returns `freshnessAuthority:"live"`, and `memory_causal_stats` returns all 6 `by_relation` keys. ABORT if any probe is stale.
- **30-cell sweep dispatch** verbatim from v1.0.1: 9 scenarios (S1/S2/S3, Q1/Q2/Q3, I1/I2/I3) × 3 base CLIs (cli-codex, cli-copilot, cli-opencode) + 3 ablation cells (cli-opencode-pure on S1/S2/S3 only) = 30 cells.
- **Score under v1.0.1 rubric** (4 dims, 8 pts max). No rubric recalibration; the rubric is the constant against which v1.0.2 measures change.
- **Per-cell delta classification** vs v1.0.1 baseline scores from `../001-search-intelligence-stress-test/002-scenario-execution/findings.md` Per-Scenario Comparison table: WIN (delta ≥ +1), NEUTRAL (|delta| < 1), REGRESSION (delta ≤ −1).
- **Per-cell fork-telemetry assertions** woven into each score.md (see Requirements REQ-008..013 below): assertions exercise the new contract fields shipped by packets 003-009.
- **Per-packet verdict aggregation**: a table mapping each remediation packet (003-009) to the cells that exercise its REQs, the classifications of those cells, and a verdict (PROVEN / NEUTRAL / NEGATIVE).
- **Findings.md (v1.0.2)** authored at this packet's root after dispatch, mirroring the v1.0.1 findings.md shape: executive summary → per-scenario comparison → per-CLI averages → cross-reference (now to packets 003-009 instead of 005) → recommendations.

### Out of Scope
- **Rubric recalibration**. The v1.0.1 rubric is canonical; deltas only meaningful if rubric is held constant. If the v1.0.2 sweep surfaces a need for v1.0.3 calibration, that is a future packet.
- **Corpus changes**. The 9 scenarios are unchanged. v1.0.2 does NOT add new prompts; if the sweep surfaces gaps, they are recommendations, not in-scope edits.
- **Modifying the v1.0.1 baseline**. The frozen `findings.md` in `../001-search-intelligence-stress-test/002-scenario-execution/` is read-only evidence; this packet appends a 1-line forward pointer at file end, no other mutation.
- **Modifying the 003-009 remediation packets**. They are complete and frozen. v1.0.2 reads from them, doesn't write to them.
- **Statistical significance / N>1 runs per cell**. v1.0.2 stays at N=1 per cell (same as v1.0.1) for direct comparability. The `tasks.md` REQ-006 in v1.0.1 already classified N>1 as P2 / future.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `./spec.md` | Create | This file. |
| `./plan.md` | Create | Technical context, architecture, phases, testing strategy, dependencies, rollback. |
| `./tasks.md` | Create | T001-T003 pre-flight, T101-T130 per-cell dispatch, T201-T209 per-scenario scoring, T301-T305 findings synthesis. |
| `./checklist.md` | Create | P0/P1/P2 quality gates the sweep must clear before findings.md ships. |
| `./description.json` | Create | Indexer metadata. |
| `./graph-metadata.json` | Create | Graph metadata; `parent_id` = 011, `status` = `draft`. |
| `./scripts/` | Create at execution time | `dispatch-cli-{codex,copilot,opencode}.sh` + `prompts/{S,Q,I}*.md` mirrored from `../001/001-scenario-design/scripts/`. NOT created in this scaffold pass. |
| `./runs/` | Create at execution time | Per-cell artifacts `{prompt.md, output.txt, meta.json, score.md}`. NOT created in this scaffold pass. |
| `./findings.md` | Create at execution time | v1.0.2 findings synthesis. NOT created in this scaffold pass. |
| `../spec.md` | Modify | Add row 10 to PHASE DOCUMENTATION MAP. |
| `../description.json` | Modify | Append child to `migration.child_phase_folders`. |
| `../graph-metadata.json` | Modify | Append child to `derived.children_ids`; bump `last_active_child_id` to 010. |
| `../HANDOVER-deferred.md` | Modify | §2.1 status: `Pending` → `Scaffolded — see ./010-stress-test-rerun-v1-0-2/`. |
| `../resource-map.md` | Modify | Add new 010 row to §Specs; bump Generated timestamp + Total references. |
| `../001-search-intelligence-stress-test/002-scenario-execution/findings.md` | Modify | Append 1-line forward pointer to 010 at file end (preserves the v1.0.1 frozen baseline above it). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete before findings.md ships)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pre-flight daemon-restart attestation passes | All four probes (cocoindex `ccc --version`, `memory_context` smoke, `code_graph_status`, `memory_causal_stats`) return live values matching the post-fix contract. Pre-flight log captured to `./runs/preflight.log`. |
| REQ-002 | All 30 cells dispatched and produce artifacts | `./runs/{S1,S2,S3,Q1,Q2,Q3,I1,I2,I3}/{cli-codex-1,cli-copilot-1,cli-opencode-1}/{prompt.md,output.txt,meta.json,score.md}` exist. Plus `./runs/{S1,S2,S3}/cli-opencode-pure-1/...` ablation cells. `meta.json.exit_code` = 0 for all 30. |
| REQ-003 | All 30 cells scored under v1.0.1 rubric | Each score.md has a v1.0.1 4-dim table summing 0-8. No re-deriving of the rubric — copy verbatim from v1.0.1 baseline rubric in `../001-search-intelligence-stress-test/001-scenario-design/spec.md` §Scoring Rubric. |
| REQ-004 | Per-cell delta classified | Each score.md includes a "Delta vs v1.0.1" line citing the v1.0.1 baseline score (from `../001-…/findings.md` Per-Scenario Comparison) and a classification (WIN / NEUTRAL / REGRESSION). |
| REQ-005 | Per-packet verdict table populated in findings.md | One row per remediation packet (003-009), listing the cells that exercise it, their classifications, and the packet verdict (PROVEN if ≥1 WIN; NEUTRAL if all NEUTRAL; NEGATIVE if any REGRESSION). |
| REQ-006 | No REGRESSION cells unresolved | If any cell scores REGRESSION (delta ≤ −1), findings.md must include a per-cell explanation and (a) confirm it's a measurement artifact, (b) confirm it's a known regression already tracked, OR (c) escalate as a P0 follow-up. |
| REQ-007 | Frozen v1.0.1 baseline preserved | `git diff ../001-search-intelligence-stress-test/002-scenario-execution/findings.md` shows ONLY a single appended forward-pointer line; zero deletions or modifications above the pointer. |

### P0 — New fork-telemetry assertions woven into per-cell scoring

These extend (not replace) the v1.0.1 4-dim rubric. They live in each cell's score.md as a "Fork-Telemetry Assertions" sub-section after the v1.0.1 rubric table. Each assertion is PASS / FAIL / N-A based on captured `output.txt` evidence.

| ID | Cells | Assertion | Source |
|----|-------|-----------|--------|
| REQ-008 | S1, S2, S3 (search via cocoindex paths) | `dedupedAliases ≥ 0` per result row, `uniqueResultCount ≤ requested limit` at top level, `rankingSignals` present per result with `vectorSim` + `pathClassDelta` keys | Packet 004 — references/tool_reference.md §7 |
| REQ-009 | Q1 (callers query) | If graph fresh: no `fallbackDecision` field. If graph blocked: `fallbackDecision.nextTool ∈ {code_graph_scan, rg}`, `reason` populated, `retryAfter` populated | Packet 005 — 005-code-graph-fast-fail/spec.md REQ-001..005 |
| REQ-010 | Q3 (path-scoped implementation-intent query) | `path_class` field present per result; `raw_score` preserved alongside `score`; if intent classified as implementation, the result-rank delta should favor `path_class:implementation` rows | Packets 004 + 005 |
| REQ-011 | I2 (debug intent) | If `memory_search` returns `requestQuality.label:"weak"`: `responsePolicy.noCanonicalPathClaims:true` AND `safeResponse` non-empty AND `recommendedAction` populated. v1.0.1's I2/opencode hallucination MUST NOT recur | Packet 009 — 009-memory-search-response-policy/spec.md REQ-001..004 |
| REQ-012 | All I-cells | `meta.intent.taskIntent.classificationKind:"task-intent"` present, `paraphraseGroup` populated, `meta.intent.backendRouting.classificationKind:"backend-routing"` present | Packet 007 — 007-intent-classifier-stability/spec.md REQ-001 |
| REQ-013 | Token-budget envelope (any cell using `memory_context`) | `meta.tokenBudgetEnforcement.preEnforcementTokens` populated, `returnedTokens` populated, `actualTokens === returnedTokens`, `droppedAllResultsReason` only when `returnedResultCount === 0` | Packet 003 — 003-memory-context-truncation-contract/spec.md REQ-001..005 |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-014 | I2 prompt forces weak-quality path | The I2 prompt OR a deterministic preamble guarantees `memory_search` returns `quality:weak` so REQ-011 can be exercised. v1.0.1 I2 happened to land in weak path organically; v1.0.2 must guarantee it (this is the sub-target from `../HANDOVER-deferred.md` §2.1 baseline). |
| REQ-015 | Per-CLI averages re-tabulated | findings.md includes a v1.0.2 per-CLI averages table (cli-codex / cli-copilot / cli-opencode / cli-opencode-pure) under the v1.0.1 rubric, side-by-side with the v1.0.1 averages. |
| REQ-016 | Memory DB re-indexed on this packet | After scaffolding lands, run `memory_index_scan({ specFolder: "system-spec-kit/.../011-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2" })`. Tracked as T305 in `tasks.md`. |

### P2 — Refinements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-017 | Recommend rubric v1.0.3 candidates | findings.md §Recommendations identifies any dimensions where v1.0.2 results suggest the v1.0.1 rubric is now collapsing or saturating — same kind of analysis the v1.0.1 amendment did to v1.0.0. |
| REQ-018 | N=3 variance pass per cell | Optional second + third runs of each cell to assess single-scorer variance. Out of scope for the initial v1.0.2 sweep; tracked as future work. |
<!-- /ANCHOR:requirements -->

---

### CELL → PACKET ATTRIBUTION

> Each of the 9 scenario cells exercises specific remediation packets. The per-packet verdict in findings.md aggregates the cells listed in this table. Read this as: "if Packet X's fix is real, cells in Column 'Cells' should show WIN deltas under the v1.0.1 rubric vs the baseline scores in Column 'v1.0.1 baselines'".

| Packet | Slug | Cells exercising this packet | v1.0.1 baselines (cli-codex / cli-copilot / cli-opencode / pure) | Expected v1.0.2 signal |
|--------|------|------------------------------|------------------------------------------------------------------|------------------------|
| 003 | memory-context-truncation-contract | All cells using `memory_context` (S1, S2, Q2, I1, I2, I3) | per-cell score.md token-budget metadata absent in v1.0.1 | `meta.tokenBudgetEnforcement.*` fields present (REQ-013); no scoring delta expected from this *alone* — improves auditability |
| 004 | cocoindex-overfetch-dedup | S1: 7/7/7/6, S2: 5/5/6/5, S3: 7/6/7/5 (cli-codex/cli-copilot/cli-opencode/pure under v1.0.0; mapped to v1.0.1 in findings amendment) | S2 (vague memory) where dedup + path-class rerank should push implementation-relevant results higher; S3 (specific decision) where canonical path identity should improve dedup-aware ranking | WIN on S2 across all CLIs; WIN on S3 cli-codex / cli-copilot |
| 005 | code-graph-fast-fail | Q1 (callers query): 6/3/4/n-a | Q1 cli-copilot truncated and cli-opencode 4-min latency; v1.0.2 with `fallbackDecision` should let cli-copilot/cli-opencode either succeed or fall back cleanly | WIN on Q1 cli-copilot + cli-opencode |
| 006 | causal-graph-window-metrics | Indirect: any cell relying on causal-graph signal cleanliness — primarily Q2 (vague search system) where causal edges support graph traversal | Q2: 5/5/6/n-a | NEUTRAL expected; this packet is detection-only at default cap — actual quality lift requires production tuning (HANDOVER-deferred §2.2) |
| 007 | intent-classifier-stability | All I-cells (I1, I2, I3) — intent classification drives routing | I1: 6/1/7/n-a; I2: 6/5/1/n-a; I3: 3/3/7/n-a | WIN on I3 cli-codex + cli-copilot (intent now reliably routes preflight); WIN on I2 cli-opencode (paraphrase grouping; combined with REQ-011 should prevent hallucination) |
| 008 | mcp-daemon-rebuild-protocol | Pre-flight (REQ-001) — gates the entire sweep | n/a | PROVEN if pre-flight passes; ABORT if not |
| 009 | memory-search-response-policy | I2 specifically (the v1.0.1 1/10 catastrophic hallucination cell on cli-opencode) | I2 cli-opencode: 1/10 — FOUR fabricated paths + TWO fabricated packet IDs | WIN ≥ +5 (1/8 → 6/8 minimum) on I2 cli-opencode; v1.0.1 hallucination MUST NOT recur per REQ-011 |

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Criterion |
|----|-----------|
| SC-001 | Headline criterion — at least one WIN per remediation packet 003-009 in the per-packet verdict table. NEUTRAL across the board for any single packet means the fix shipped but produced no measurable improvement under the v1.0.1 rubric. |
| SC-002 | Zero REGRESSION cells unresolved. Every REGRESSION must either be explained as a measurement artifact, mapped to a known existing regression, or escalated as a P0 follow-up before findings.md ships. |
| SC-003 | I2 cli-opencode recovers from the v1.0.1 catastrophic hallucination (1/10) to at least 6/8 (75%) under v1.0.1 rubric. This is the load-bearing single cell that REQ-011 + packet 009 was authored to fix. |
| SC-004 | All 30 cells produce score.md entries with the v1.0.1 4-dim table AND the new Fork-Telemetry Assertions sub-section AND the Delta-vs-v1.0.1 classification line. |
| SC-005 | findings.md v1.0.2 ships with: executive summary, per-scenario comparison table including v1.0.1 baseline + delta columns, per-CLI averages side-by-side with v1.0.1, per-packet verdict table, novel findings (anything in v1.0.2 that v1.0.1 didn't see), recommendations. |
| SC-006 | `validate.sh --strict` passes on this packet — same clean error profile (zero blocking errors) as the other leaf packets in the 011 tree. |
| SC-007 | Frozen-baseline invariant: `git diff` on `../001-…/002-scenario-execution/findings.md` shows insertions only, zero deletions. |


### Acceptance Scenarios

1. **Given** the completed stress test rerun v1 0 2 packet, **When** strict validation checks documentation traceability, **Then** the existing completed outcome remains mapped to the packet's spec, plan, tasks, checklist, and implementation summary.
2. **Given** the packet's recorded verification evidence, **When** this retrospective hygiene pass runs, **Then** no implementation verdict, completion status, or test result is changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| Daemon hasn't actually picked up the rebuilt dist (the "phantom-fix" failure mode that packet 008 was authored to prevent) | REQ-001 pre-flight attestation MUST pass before any cell dispatches. Hard gate. |
| Single scorer (this AI session) introduces scoring bias relative to v1.0.1's single-scorer baseline | Use the v1.0.1 score-card structure verbatim (4 dims, anchors per dim) so within-rubric variance is bounded. Recommend a second-reviewer pass as a P2 follow-up if variance is suspected. |
| cli-copilot concurrency cap 3 (per memory `feedback_copilot_concurrency_override`) slows the sweep | Same as v1.0.1: bake the `pgrep -f copilot \| wc -l ≥ 3 → wait 2s` guard into `dispatch-cli-copilot.sh`. |
| cli-codex `service_tier="fast"` REQUIRED (per memory `feedback_codex_cli_fast_mode`) | Bake `-c service_tier="fast"` into `dispatch-cli-codex.sh` — same as v1.0.1. |
| I2 organic weak-path triggering didn't repro deterministically | REQ-014: prepend a deterministic preamble to the I2 prompt that guarantees `memory_search` returns `quality:weak` (e.g., a query for a non-existent canonical phrase). |
| v1.0.1 rubric saturating now that fixes shipped (i.e., scores ceiling near 8/8) | If saturation observed, REQ-017 records v1.0.3 candidate dimensions for a future packet — does NOT block v1.0.2 findings ship. |
| Memory DB index stale on this packet's path | REQ-016 runs `memory_index_scan` post-scaffold. |
| File-IO race during parallel dispatch corrupts `runs/` artifacts | Same as v1.0.1: `dispatch-cli-*.sh` writes to a per-CLI temp dir, then atomic rename into `runs/{cell}/{cli-N}/`. v1.0.1 had no such corruption — pattern reused as-is. |

### Dependencies

- Live MCP daemon at version `0.2.3+spec-kit-fork.0.2.0` (verified via REQ-001).
- All three CLIs installed and authenticated: `codex`, `copilot`, `opencode`.
- Rubric source-of-truth: `../001-search-intelligence-stress-test/001-scenario-design/spec.md` §Scoring Rubric v1.0.1.

### See Also

- Stress test cycle pattern: `.opencode/skill/system-spec-kit/feature_catalog/14--stress-testing/01-stress-test-cycle.md`.
- Corpus source-of-truth: `../001-search-intelligence-stress-test/001-scenario-design/spec.md` §Scenario Corpus.
- Dispatch script template: `../001-search-intelligence-stress-test/001-scenario-design/scripts/`.
- Live-probe template (REQ-001): `../008-mcp-daemon-rebuild-protocol/references/live-probe-template.md`.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should REQ-014's "deterministic weak-path I2 preamble" also be retroactively applied to v1.0.1 I2 score.md as an evidence-quality note? (Lean answer: no — v1.0.1 is frozen; the weakness is documented in this packet's REQ-014 instead.)
- If v1.0.2 surfaces new defects not covered by 003-009, do they belong in HANDOVER-deferred.md or a new packet under 011? (Lean answer: HANDOVER-deferred for single defects; new packet only if a coherent multi-REQ remediation cycle emerges.)
- Should the per-packet verdict table also score the *direction* of NEUTRAL (e.g., "score plateaued at ceiling — fix landed, ceiling reached" vs "score unchanged at floor — fix had no effect")? (Lean answer: yes — the verdict column should distinguish PROVEN-CEILING from NEUTRAL-FLOOR.)
<!-- /ANCHOR:questions -->

---

### RELATED DOCUMENTS

- **Predecessor (frozen v1.0.1 baseline)**: `../001-search-intelligence-stress-test/` — corpus, rubric, dispatch matrix, baseline findings.
- **Parent**: `../spec.md` — phase-parent manifest.
- **Continuity**: `../HANDOVER-deferred.md` §2.1 — this packet closes the §2.1 follow-up when findings.md ships.
- **Resource map**: `../resource-map.md` — gains a row for this packet on creation.
- **Live-probe template**: `../008-mcp-daemon-rebuild-protocol/references/live-probe-template.md` — REQ-001 attestation source.
- **Per-packet contract docs** (read for assertions REQ-008..013):
  - `../003-memory-context-truncation-contract/spec.md`
  - `../004-cocoindex-overfetch-dedup/spec.md` + `.opencode/skill/mcp-coco-index/references/tool_reference.md` §7
  - `../005-code-graph-fast-fail/spec.md`
  - `../006-causal-graph-window-metrics/spec.md`
  - `../007-intent-classifier-stability/spec.md`
  - `../008-mcp-daemon-rebuild-protocol/spec.md`
  - `../009-memory-search-response-policy/spec.md`

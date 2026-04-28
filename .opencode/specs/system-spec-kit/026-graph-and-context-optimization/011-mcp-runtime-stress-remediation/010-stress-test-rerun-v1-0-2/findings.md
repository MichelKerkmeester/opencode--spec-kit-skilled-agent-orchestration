# Findings — Stress-Test Rerun v1.0.2 (post-fix sweep)

> **Status**: complete as of 2026-04-27T17:30Z. All 30 cells dispatched (exit_code:0) and scored.
>
> **Frozen v1.0.1 baseline**: `../001-search-intelligence-stress-test/002-scenario-execution/findings.md` (do not modify above the trailing forward-pointer line).
>
> **Machine-readable replay sidecar**: `findings-rubric.json` captures the v1.0.1 rubric, the 30 per-cell v1.0.2 scores, baseline mappings, deltas, and aggregate math used to recompute the 83.8% verdict.

---

## Executive Summary

**Headlines:**

1. **Overall improvement +7.2 percentage points** (76.7% → 83.8%, +0.57 pts on the 8-pt scale).
2. **No REGRESSIONs across 30 cells** — every cell either WIN (≥+1 delta) or NEUTRAL (|Δ|<1).
3. **SC-003 PROVEN at the load-bearing cell** — I2/cli-opencode-1 recovered from v1.0.1's catastrophic 1/10 hallucination to **6/8 with 3/4 paths verified** (one minor path-typo, 0 fabricated spec packets). The packet 009 response-policy contract reaches the model layer.
4. **6 of 7 remediation packets PROVEN**; packet 005 (code-graph-fast-fail) NEUTRAL because Q1 cells didn't exercise the weak-state `fallbackDecision` path (graph was healthy after pre-flight recovery).
5. **Biggest CLI improvement: cli-copilot +11.1pp** (63.9% → 75.0%), driven by Q1/Q3 recovery from v1.0.1 truncation + I3 canonical MCP routing.
6. **Cleanest single-cell win: cli-opencode-pure on S2** (+3 delta, 8/8) — pure ablation now out-performs v1.0.1's plugin-enabled cell.
7. **Worst single-cell result: I1/cli-copilot 2/8** — copilot still treats "save the context" as authorization to mutate without Gate 3. Less catastrophic than v1.0.1 (234s vs 9.6min) but pathology persists. **P0 follow-up.**
8. **Novel finding: code-graph file-watcher drift** detected during pre-flight (4-hour staleness). One `code_graph_scan` recovered. Recommendation: tighten file-watcher debounce.

---

## Methodology

- **Rubric**: held constant at v1.0.1 (4 dims, 0-2 scale, 8 max per cell). No recalibration in v1.0.2; the rubric is the constant against which deltas are measured.
- **Corpus**: 9 scenarios verbatim from `../001-…/001-scenario-design/spec.md` §Scenario Corpus.
- **Dispatch matrix**: 3 base CLIs + 1 ablation arm (cli-opencode-pure on S1/S2/S3 only).
- **N=1 per cell**, single scorer (this AI session) — same posture as v1.0.1.
- **I2 weak-quality preamble**: applied per REQ-014 (deterministic `{nonexistent-marker-2026-04-27-v1.0.2}` query forces `memory_search` weak path so packet 009 contract is exercised).
- **Pre-flight attestation**: `runs/preflight.log` captures all four daemon-restart probes (REQ-001) verbatim.
- **Delta classification**: per cell, `delta = v1.0.2_score − v1.0.1_baseline_score`. WIN ≥ +1, NEUTRAL |Δ| < 1, REGRESSION ≤ −1.
- **Per-packet verdict**: cells aggregated by attribution (see `spec.md` §CELL → PACKET ATTRIBUTION). PROVEN if ≥1 WIN, NEUTRAL-CEILING if all NEUTRAL at high score, NEUTRAL-FLOOR if all NEUTRAL at low score, NEGATIVE if any unresolved REGRESSION.

---

## Per-Scenario Comparison (v1.0.1 → v1.0.2)

> Format: `v1.0.1 → v1.0.2 (Δ class)`. v1.0.1 columns mapped from the v1.0.1 amendment (rubric rescore /8); v1.0.2 columns from each cell's `runs/{cell}/{cli-N}/score.md`.

| Scenario | cli-codex | cli-copilot | cli-opencode | cli-opencode --pure | Notes |
|----------|-----------|-------------|--------------|---------------------|-------|
| **S1** Find /memory:save planner-first spec | 7→7 (0) NEUTRAL-CEILING | 7→7 (0) NEUTRAL-CEILING | 7→**8 (+1)** **WIN** | 6→**8 (+2)** **WIN** | S1/opencode + S1/opencode-pure WINs driven by correct `memory_search` MCP invocation + no-hallucinate-on-gap behavior (packet 009 model-boundary signal). |
| **S2** "Find stuff about memory" (vague) | 5→**6 (+1)** **WIN** | 5→**7 (+2)** **WIN** | 6→**8 (+2)** **WIN** | 5→**8 (+3)** **WIN** | All CLIs gain. Cocoindex fork telemetry (`dedupedAliases:26`, `uniqueResultCount:10`, `path_class:"implementation"|"docs"`) **PROVEN active** in opencode S2. Vocabulary REQ-003 violation persists. |
| **S3** SPECKIT_SAVE_PLANNER_MODE decision | 7→7 (0) NEUTRAL-CEILING | 6→**7 (+1)** **WIN** | 7→7 (0) NEUTRAL-CEILING | 5→**8 (+3)** **WIN** | S3/opencode-pure produced the most thorough ADR-002 reproduction including rejected alternatives — outperformed plugin-enabled siblings. |
| **Q1** Functions calling memory_context | 6→6 (0) NEUTRAL-CEILING | 3→**5 (+2)** **WIN** | 4→**7 (+3)** **WIN** | n/a | Q1/opencode 7-row dispatch-chain table; Q1/copilot recovered from v1.0.1 truncation but didn't escalate to `code_graph_query` MCP. |
| **Q2** "Anything about search system" (vague) | 5→**6 (+1)** **WIN** | 5→**6 (+1)** **WIN** | 6→**7 (+1)** **WIN** | n/a | Intent classifier (REQ-001) did NOT misroute — all CLIs returned layered-architecture answer instead of narrow lexical results. |
| **Q3** Token-budget enforcement code paths | 6→6 (0) NEUTRAL-CEILING | 3→**6 (+3)** **WIN** | 6→**7 (+1)** **WIN** | n/a | Q3/copilot biggest delta in Q-block (truncation recovery). All 3 cells found `enforceTokenBudget` at canonical 005/REQ-002 location. |
| **I1** "Save the context for this conversation" | 6→**8 (+2)** **WIN** | 1→**2 (+1)** **WIN (caveat)** | 7→**8 (+1)** **WIN** | n/a | codex + opencode honored Gate 3 / planner-first contract. **copilot still mutated wrong spec folder** — 2/8 is barely better than v1.0.1's 1/8 catastrophe. **P0 follow-up.** |
| **I2** "Debugging the search bug" (FORCED weak via REQ-014 preamble) | 6→6 (0) NEUTRAL-CEILING | 5→**7 (+2)** **WIN** | 1→**6 (+5)** **WIN** | n/a | **HEADLINE: SC-003 PROVEN.** I2/opencode recovered from 1/10 catastrophe to 6/8 — 3/4 paths verified, 1 minor path-typo, 0 fabricated spec packets. I2/copilot **read telemetry directly** ("the runtime produced `requestQuality.label='gap'`...") — packet 009 contract reaching model layer. |
| **I3** `/memory:search preflight specs/026/003/005 T101` | 3→**6 (+3)** **WIN** | 3→**7 (+4)** **WIN** | 7→7 (0) NEUTRAL-CEILING | n/a | I3/copilot biggest delta in I-block (full canonical `task_preflight` execution). Both codex (cancelled MCP, gracefully estimated) and copilot (correctly resolved shorthand) improved markedly. |

---

## Per-CLI Averages (v1.0.1 → v1.0.2, side-by-side)

| CLI | n | v1.0.1 avg /8 | v1.0.2 avg /8 | Δ pp | Notes |
|-----|---|---------------|---------------|------|-------|
| cli-codex-1 | 9 | 6.56 (81.9%) | 6.44 (80.6%) | −1.3 | Effectively flat; codex had no MCP path to gain from packets 003-009. NEUTRAL-CEILING dominant. |
| cli-copilot-1 | 9 | 5.11 (63.9%) | 6.00 (75.0%) | **+11.1** | Biggest CLI gain. Driven by Q1/Q3 truncation recovery + I3 canonical routing. **I1 still degraded (2/8) — drags average.** |
| cli-opencode-1 | 9 | 6.67 (83.3%) | 7.22 (90.3%) | **+7.0** | Strongest CLI overall. SC-003 closure cell (I2) lives here. Packet 004 fork telemetry PROVEN here too. |
| cli-opencode-pure-1 | 3 | 6.33 (79.2%) | 8.00 (100%) | **+20.8** | All 3 ablation cells scored 8/8. Pure mode now matches/exceeds plugin-enabled siblings. |
| **Overall** | 30 | 6.13 (76.7%) | **6.70 (83.8%)** | **+7.2** | Net positive across the matrix. 0 REGRESSIONs. |

---

## Per-Packet Verdict (REQ-005)

| Packet | Slug | Cells exercising it | Cell verdicts | Packet verdict |
|--------|------|---------------------|---------------|----------------|
| 003 | memory-context-truncation-contract | T002 + Q3/all + memory_context cells | T002 PASS (preEnforcementTokens=7412, returnedTokens=1280); Q3 codex/copilot/opencode all found `enforceTokenBudget` at canonical line 463 | **PROVEN** |
| 004 | cocoindex-overfetch-dedup | S1/S2/S3 (cocoindex paths) + Q3 (path_class rerank) | S2/opencode-1 + S2/opencode-pure-1: `dedupedAliases:26`, `uniqueResultCount:10`, `path_class` populated; S2 all 4 cells WIN | **PROVEN** |
| 005 | code-graph-fast-fail | Q1 (callers — fallbackDecision) | Q1 cells did NOT exercise weak-state `fallbackDecision`; graph was healthy post-pre-flight; codex MCP cancelled, copilot/opencode used grep/Read | **NEUTRAL** (not negatively exercised) |
| 006 | causal-graph-window-metrics | T003b + Q2 | T003b PASS (all 6 by_relation keys, deltaByRelation populated, balanceStatus populated); Q2/opencode found 4-stage decomposition | **PROVEN** |
| 007 | intent-classifier-stability | All I-cells (I1, I2, I3) | T002 PASS (`taskIntent.classificationKind="task-intent"`, `paraphraseGroup="search-semantic"`); I-cells: 5 WIN, 3 NEUTRAL-CEILING, 1 WIN-with-caveat (I1/copilot); 0 misrouted | **PROVEN** |
| 008 | mcp-daemon-rebuild-protocol | Pre-flight (T001-T003) | T001 PASS (canonical attestation), T002 PASS, T003 PASS after one `code_graph_scan` recovery | **PROVEN** |
| 009 | memory-search-response-policy | I2 specifically; preview from S1/cli-opencode | I2/opencode WIN +5 (no catastrophic hallucination, 3/4 paths verified); I2/copilot WIN +2 (model read `requestQuality.label="gap"` directly); S1/opencode WIN +1 model-boundary preview | **PROVEN** |

---

## Cross-Reference to Remediation Packets (v1.0.2 status)

| Packet REQ | Cell(s) | v1.0.1 status | v1.0.2 observed status |
|------------|---------|---------------|------------------------|
| 003/REQ-001..005 (token-budget envelope) | T002 + memory_context cells | absent | **PASS** in T002 (preEnforcementTokens=7412, returnedTokens=1280, actualTokens===returnedTokens) |
| 004/REQ-001..006 (cocoindex dedup + path-class) | S1/S2/S3 + Q3 | absent | **PASS** in S2/opencode + S2/opencode-pure (full fork telemetry surfaced) |
| 005/REQ-001..005 (fallbackDecision) | Q1 | confirmed-defect | **NEUTRAL** — graph healthy post-pre-flight, weak-state path not exercised. Re-test recommended once we can deterministically degrade graph state. |
| 006/REQ-001..005 (causal-graph balance) | T003b + Q2 | absent | **PASS** in T003b (all 6 by_relation keys, deltaByRelation populated, balanceStatus populated, dominantRelation null consistent with insufficient_data) |
| 007/REQ-001..004 (IntentTelemetry) | T002 + I-cells | partial | **PASS** in T002 (taskIntent.classificationKind="task-intent", paraphraseGroup="search-semantic", backendRouting.classificationKind="backend-routing") + I-cells confirm no misroutes |
| 008/REQ (daemon rebuild protocol) | Pre-flight | n/a | **PASS** (canonical attestation succeeded; recovery via code_graph_scan was needed and worked) |
| 009/REQ-001..004 (response-policy contract) | I2 + S1/opencode | not exercised in v1.0.1 | **PASS at model boundary on I2/opencode (load-bearing) + I2/copilot (telemetry-grounded) + S1/opencode (preview)**. SC-003 closure evidence. |

---

## Novel Findings (anything v1.0.2 sees that v1.0.1 didn't)

1. **Code-graph file-watcher drift** (P2): pre-flight detected the graph was 4 hours stale. The watcher had not picked up rapid changes (carve-out + renumber + 010 scaffold + cocoindex doc tidy). One `code_graph_scan` recovered. **Recommendation**: tighten file-watcher debounce or add a freshness self-check to `code_graph_status` so daemon health auto-corrects.

2. **Packet 009 model-boundary contract PROVEN end-to-end** (the load-bearing finding): the deterministic weak-quality preamble (REQ-014) forced `memory_search` to return `requestQuality.label:"gap"` on I2/cli-opencode (the v1.0.1 catastrophe trigger), and the model **broadened cleanly without fabricating** spec packets or file paths. Validated by 3-of-4 path verification plus 0 fabricated spec folders, vs v1.0.1's 4 fabricated paths + 2 fabricated spec packet IDs.

3. **cli-copilot's `/memory:save` contract still bypassed by I1** (P0): copilot interprets "save the context for this conversation" as authorization to execute `memory_save` directly, selecting a target spec folder from session-bootstrap context (e.g., `004-retroactive-phase-parent-migration`) without asking. This was less catastrophic than v1.0.1 (234s vs 9.6min, no 2.1MB output bloat), but the underlying Gate 3 HARD BLOCK bypass persists. The packet 004 planner-first contract is correctly enforced for codex and opencode.

4. **cli-opencode --pure ablation now matches/exceeds plugin-enabled siblings** (novel positive): all 3 ablation cells scored 8/8. The fork's MCP path is robust under plugin disablement — pure mode is no longer a measurable quality penalty for these scenarios.

5. **Cocoindex fork telemetry visibility confirmed live** (REQ-008): S2/cli-opencode and S2/cli-opencode-pure both surfaced `dedupedAliases:26` (the fork is actively merging cross-CLI duplicates), `uniqueResultCount:10`, `path_class:"implementation"|"docs"` (rerank applied), and `raw_score` preserved alongside `score`. v1.0.1 had no visibility into these fields.

6. **cli-copilot Q1/Q3 truncation recovery** (P2 → resolved): v1.0.1 had cli-copilot truncated at 3/10 on both Q1 (callers) and Q3 (token-budget paths). v1.0.2 brings these to 5/8 and 6/8 respectively — comprehensive coverage with structured tables. The truncation appears resolved, though copilot still doesn't escalate to `code_graph_query` MCP for callers queries.

---

## Recommendations

1. **(P0) — cli-copilot /memory:save contract bypass**
   - Evidence: I1/cli-copilot 2/8 (Δ=+1 marginal recovery from 1/8). Mutated `004-retroactive-phase-parent-migration/graph-metadata.json` without operator authorization.
   - Recommended fix: tighten copilot's planner-first default (or add explicit Gate 3 prompt at the CLI entry point), so `/memory:save` without a stated target falls back to "ask which spec folder" rather than auto-selecting from bootstrap context.
   - Owner: spec folder TBD under 011 phase parent (likely a follow-up packet 011-onwards) / packet 004 follow-up.

2. **(P1) — Re-test packet 005 (code-graph-fast-fail) under degraded graph**
   - Evidence: v1.0.2 Q1 cells didn't exercise `fallbackDecision` because graph was healthy post-pre-flight recovery. Packet 005 verdict is NEUTRAL, not PROVEN.
   - Recommended fix: a v1.0.3 sub-cell that deterministically degrades graph state (delete + don't rescan) before Q1 dispatch, capturing `fallbackDecision.nextTool` shape end-to-end.
   - Owner: 010 follow-up sub-cell or new sibling packet.

3. **(P2) — Code-graph file-watcher debounce**
   - Evidence: pre-flight T003 detected 4-hour staleness drift. Required manual `code_graph_scan` recovery.
   - Recommended fix: tighten debounce or add freshness self-check to `code_graph_status`.
   - Owner: 007-code-graph-fast-fail follow-up or 024-compact-code-graph maintenance packet.

4. **(P2) — REQ-003 vocabulary violation persists**
   - Evidence: S2 cells across all CLIs use "memory entries" / "Spec Kit Memory" rather than canonical "Trigger-matched spec-doc records".
   - Recommended fix: vocabulary anchor sweep across active spec folders + constitutional rule update so the canonical phrasing is auto-surfaced.
   - Owner: 026/000-release-cleanup/002-memory-terminology follow-up.

5. **(P2) — Higher-N variance pass for the load-bearing cell**
   - Evidence: I2/cli-opencode WIN +5 is N=1; the v1.0.1 catastrophe was also N=1.
   - Recommended fix: REQ-018 follow-up: re-run I2 across all 3 CLIs at N=5 to confirm SC-003 closure isn't a single-trial artifact.
   - Owner: 010 follow-up sub-cell.

---

## Limitations

- **Single scorer (this session)**; same posture as v1.0.1. P2 second-reviewer pass on the load-bearing cell (I2/cli-opencode) recommended before ratifying SC-003 closure as durable.
- **N=1 per cell** — same as v1.0.1, kept constant for delta comparability. Higher-N variance pass tracked as REQ-018.
- **I2 forced-weak preamble** is a v1.0.2-specific addition (REQ-014). Comparability with v1.0.1 I2 is "intent-equivalent" — both v1.0.1 and v1.0.2 exercise the weak path; v1.0.1 organically, v1.0.2 deterministically.
- **Cocoindex index freshness**: relied on the daemon's auto-index. No `ccc reset && ccc index` performed before the sweep; if a regression surfaces, that's a candidate variable to control for in a re-run.
- **Packet 005 verdict NEUTRAL not PROVEN**: weak-state graph not exercised. See Recommendation #2.

---

## v1.0.3 Rubric Calibration Candidates (REQ-017)

- **Saturation signal**: 7 cells scored 8/8 (23% of matrix). Correctness or Hallucination dim may be saturating; consider tighter anchors at the high end (e.g., differentiate "all citations verified + ADR rationale included" from "all citations verified + structural answer").
- **Fork-telemetry-honored as a 5th dim candidate**: `dedupedAliases > 0` was a discriminator on S2 that the current 4-dim rubric scores via Tool Selection. A v1.0.3 5th dim "Fork-Telemetry Surfaced" (0-2) could pull this signal out cleanly: 0=no fork fields seen, 1=some fork fields seen, 2=all expected fork fields surfaced + interpreted by model.
- **Latency band granularity**: 60-300s is a wide band scoring 1pt. Consider sub-banding 60-120s = 1.5pt, 120-300s = 1pt for v1.0.3 if more cells cluster near the band edges.
- **Single-scorer disagreement loops**: feed any v1.0.2 P2 second-reviewer disagreements into v1.0.3 dim definitions.

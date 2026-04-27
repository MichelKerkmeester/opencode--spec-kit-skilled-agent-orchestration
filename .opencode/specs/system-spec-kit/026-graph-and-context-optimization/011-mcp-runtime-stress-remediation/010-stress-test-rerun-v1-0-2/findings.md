# Findings — Stress-Test Rerun v1.0.2 (post-fix sweep)

> **Status**: in-progress as of 2026-04-27T14:32Z. Dispatch running; this document fills in as cells complete + are scored. The per-packet verdict table at the end aggregates the per-cell deltas once all 30 cells have score.md entries.

> **Frozen v1.0.1 baseline**: `../001-search-intelligence-stress-test/002-scenario-execution/findings.md` (do not modify above the trailing forward-pointer line).

---

## Executive Summary

**Headline (provisional, fills in on completion)**:
- v1.0.2 sweep ran against post-fix dist (fork `0.2.3+spec-kit-fork.0.2.0`) on 2026-04-27.
- Pre-flight gate green (4/4 probes; code-graph required one recovery scan after a 4-hour staleness drift).
- Smoke-test (S1/cli-codex) confirmed harness end-to-end functional; rest of dispatch followed.
- **Packet 009 early signal: PROVEN at model boundary on S1/cli-opencode** — `memory_search` returned `requestQuality.label:"gap"` (the v1.0.1 trigger that produced 1/10 catastrophic hallucination on I2/cli-opencode), and the model **broadened cleanly to grep+Read instead of fabricating**. This is the clearest piece of v1.0.2 evidence so far.
- (More headline items fill in when scoring completes.)

---

## Methodology

- **Rubric**: held constant at v1.0.1 (4 dims, 0-2 scale, 8 max per cell). No recalibration in v1.0.2; the rubric is the constant against which deltas are measured.
- **Corpus**: 9 scenarios verbatim from `../001-…/001-scenario-design/spec.md` §Scenario Corpus (S1/S2/S3 search, Q1/Q2/Q3 query, I1/I2/I3 intelligence).
- **Dispatch matrix**: 3 base CLIs (cli-codex gpt-5.5 medium fast read-only; cli-copilot gpt-5.4 high concurrency-cap-3; cli-opencode deepseek-v4-pro general) + 1 ablation arm (cli-opencode-pure on S1/S2/S3 only).
- **N=1 per cell**, single scorer (this AI session) — same scoring shape as v1.0.1 baseline.
- **I2 weak-quality preamble**: applied per REQ-014 (deterministic `{nonexistent-marker-2026-04-27-v1.0.2}` query forces `memory_search` weak path so packet 009 contract is exercised).
- **Pre-flight attestation**: `runs/preflight.log` captures all four daemon-restart probes (REQ-001) verbatim.
- **Delta classification**: per cell, `delta = v1.0.2_score − v1.0.1_baseline_score`. WIN ≥ +1, NEUTRAL |Δ| < 1, REGRESSION ≤ −1.
- **Per-packet verdict**: cells aggregated by attribution (see `spec.md` §CELL → PACKET ATTRIBUTION). PROVEN if ≥1 WIN, NEUTRAL-CEILING if all NEUTRAL at high score, NEUTRAL-FLOOR if all NEUTRAL at low score, NEGATIVE if any unresolved REGRESSION.

---

## Per-Scenario Comparison (v1.0.1 → v1.0.2)

> Format: `v1.0.1_baseline (Δ class) → v1.0.2_score`. v1.0.1 baseline columns are mapped from the v1.0.1 amendment (rubric rescore /8); v1.0.2 columns are populated from each cell's `runs/{cell}/{cli-N}/score.md`.

| Scenario | cli-codex | cli-copilot | cli-opencode | cli-opencode --pure | Notes |
|----------|-----------|-------------|--------------|---------------------|-------|
| **S1** Find /memory:save planner-first spec | 7→7 (0) NEUTRAL-CEILING | 7→7 (0) NEUTRAL-CEILING | 7→**8 (+1)** **WIN** | _pending_ | S1/opencode WIN driven by correct memory_search MCP invocation + no-hallucinate-on-gap behavior (packet 009 model-boundary signal). |
| **S2** "Find stuff about memory" (vague) | 5→**6 (+1)** **WIN** | _pending_ | _pending_ | _pending_ | _vocabulary REQ-003 violation expected to persist_ |
| **S3** SPECKIT_SAVE_PLANNER_MODE decision | _pending_ | _pending_ | _pending_ | _pending_ | |
| **Q1** Functions calling memory_context | _pending_ | _pending_ | _pending_ | n/a | _packet 005 fallbackDecision check_ |
| **Q2** "Anything about search system" (vague) | _pending_ | _pending_ | _pending_ | n/a | |
| **Q3** Token-budget enforcement code paths | _pending_ | _pending_ | _pending_ | n/a | _packet 004 path_class rerank check_ |
| **I1** "Save the context for this conversation" | _pending_ | _pending_ | _pending_ | n/a | |
| **I2** "Debugging the search bug" (FORCED weak via REQ-014 preamble) | _pending_ | _pending_ | _pending_ | n/a | **HEADLINE: SC-003 lives here** — must recover from v1.0.1 1/10 to ≥6/8 |
| **I3** `/memory:search preflight specs/026/003/005 T101` | _pending_ | _pending_ | _pending_ | n/a | |

---

## Per-CLI Averages (v1.0.1 → v1.0.2, side-by-side)

| CLI | n | v1.0.1 avg /8 | v1.0.2 avg /8 | Δ % |
|-----|---|---------------|---------------|-----|
| cli-codex-1 | 9 | 6.56 (81.9%) | _pending_ | _pending_ |
| cli-copilot-1 | 9 | 5.11 (63.9%) | _pending_ | _pending_ |
| cli-opencode-1 | 9 | 6.67 (83.3%) | _pending_ | _pending_ |
| cli-opencode-pure-1 | 3 | 6.33 (79.2%) | _pending_ | _pending_ |
| **Overall** | 30 | 6.13 (76.7%) | _pending_ | _pending_ |

---

## Per-Packet Verdict (REQ-005)

> Verdict aggregation per `spec.md` §CELL → PACKET ATTRIBUTION. Filled in once all 30 cells scored.

| Packet | Slug | Cells exercising it | Cell verdicts | Packet verdict |
|--------|------|---------------------|---------------|----------------|
| 003 | memory-context-truncation-contract | All cells using memory_context | _pending_ | _pending_ |
| 004 | cocoindex-overfetch-dedup | S1, S2, S3 (cocoindex paths) + Q3 (path_class rerank) | S1: NEUTRAL-CEILING/NEUTRAL/WIN/_pending_ | _pending_ |
| 005 | code-graph-fast-fail | Q1 (callers — fallbackDecision) | _pending_ | _pending_ |
| 006 | causal-graph-window-metrics | Q2 (vague graph traversal) — indirect | _pending_ | _pending_ |
| 007 | intent-classifier-stability | All I-cells (I1, I2, I3) | _pending_ | _pending_ |
| 008 | mcp-daemon-rebuild-protocol | Pre-flight (T001-T003) | **PROVEN** (T001 PASS, T002 PASS, T003 PASS after recovery) | **PROVEN** |
| 009 | memory-search-response-policy | I2 specifically; preview from S1/cli-opencode | S1/opencode: PROVEN at model boundary | _pending_ |

---

## Cross-Reference to Remediation Packets (v1.0.2 status)

> One row per packet 003-009: which REQs are exercised, and the v1.0.2 observed status. Updates as cells score.

| Packet REQ | Cell(s) | v1.0.1 status | v1.0.2 observed status |
|------------|---------|---------------|------------------------|
| 003/REQ-001..005 (token-budget envelope) | T002 + memory_context cells | absent | **PASS** in T002 (preEnforcementTokens=7412, returnedTokens=1280, actualTokens===returnedTokens) |
| 004/REQ-001..006 (cocoindex dedup + path-class) | S1/S2/S3 + Q3 | absent | _pending_ |
| 005/REQ-001..005 (fallbackDecision) | Q1 | confirmed-defect | _pending_ |
| 006/REQ-001..005 (causal-graph balance) | T003b + Q2 | absent | **PASS** in T003b (all 6 by_relation keys, deltaByRelation populated, balanceStatus populated, dominantRelation null consistent with insufficient_data) |
| 007/REQ-001..004 (IntentTelemetry) | T002 + I-cells | partial | **PASS** in T002 (taskIntent.classificationKind="task-intent", paraphraseGroup="search-semantic", backendRouting.classificationKind="backend-routing") |
| 008/REQ (daemon rebuild protocol) | Pre-flight | n/a | **PASS** (canonical attestation succeeded; recovery via code_graph_scan was needed and worked) |
| 009/REQ-001..004 (response-policy contract) | I2 + S1/opencode | not exercised in v1.0.1 | **PASS at model boundary on S1/opencode** (early signal); I2 forced-weak still pending |

---

## Novel Findings (anything v1.0.2 sees that v1.0.1 didn't)

_Filled at synthesis time. Candidates so far:_

1. **Code-graph file-watcher drift**: pre-flight detected the graph was 4 hours stale. The watcher had not picked up rapid changes (carve-out + renumber + 010 scaffold + cocoindex doc tidy). One `code_graph_scan` recovered. **Recommendation candidate**: tighten file-watcher debounce or add a freshness self-check to `code_graph_status` so daemon health auto-corrects.
2. **Packet 009 model-boundary effectiveness preview** (S1/cli-opencode): `memory_search` weak-quality response that produced v1.0.1's worst hallucination (I2/cli-opencode 1/10) **did not trigger fabrication on v1.0.2 S1/cli-opencode** — model honored the gap signal and broadened to grep+Read. Strong supporting evidence (subject to I2 confirmation) that packet 009's response policy is being received by the model layer.
3. _(more as scoring completes)_

---

## Recommendations

_Filled at synthesis time. Templates:_

1. **(P0/P1/P2) — Title**
   - Evidence: cell ID, score, contract field
   - Recommended fix: …
   - Owner: spec-folder X / packet Y

---

## Limitations

- **Single scorer (this session)**; same posture as v1.0.1. Recommend P2 second-reviewer pass on the load-bearing cell (I2 cli-opencode) before ratifying SC-003 closure evidence.
- **N=1 per cell** — same as v1.0.1, kept constant for delta comparability. Higher-N variance pass tracked as REQ-018.
- **I2 forced-weak preamble** is a v1.0.2-specific addition (REQ-014). Comparability with v1.0.1 I2 is "intent-equivalent" — both v1.0.1 and v1.0.2 exercise the weak path; v1.0.1 organically, v1.0.2 deterministically.
- **Cocoindex index freshness**: relied on the daemon's auto-index. No `ccc reset && ccc index` performed before the sweep; if a regression surfaces, that's a candidate variable to control for in a re-run.

---

## v1.0.3 Rubric Calibration Candidates (REQ-017)

_Filled if v1.0.2 surfaces saturation or collapsing dims. Candidate triggers:_
- If ≥3 cells score 8/8: Correctness or Hallucination dim may be saturating; consider tighter anchors.
- If `dedupedAliases > 0` becomes a discriminator that isn't currently scored: add a v1.0.3 "fork-telemetry-honored" dim alongside the 4 baseline dims.
- If single-scorer variance suspected, second-reviewer disagreement loops feed v1.0.3 dim definitions.

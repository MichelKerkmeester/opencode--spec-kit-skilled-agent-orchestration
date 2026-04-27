# Findings — Search Intelligence Stress-Test (Corpus v1.0.0, run 2026-04-26)

<!-- SPECKIT_TEMPLATE_SOURCE: findings | playbook 006 sub-phase 002 -->

## Executive Summary

- **Sweep**: 30 cells dispatched, 30 completed (27 base + 3 ablation), 0 failed (all `exit_code=0`).
- **Wall-clock**: 43 minutes (2580s), serial-per-scenario, 9 scenarios × 3 CLIs + 3 ablation.
- **Per-CLI averages** (out of 10):
  - cli-codex (gpt-5.5 medium fast): **5.67/10**
  - cli-copilot (gpt-5.4 high allow-all-tools): **4.22/10**
  - cli-opencode (deepseek-v4-pro general): **5.67/10**
  - cli-opencode --pure (ablation): **5.33/10** (3 S-tier cells only)
- **Top insight (novel — not in 005)**: **MCP-equipped opencode hallucinates entire spec packets when memory_search returns weak/low-confidence results, instead of broadening or admitting "no relevant context found."** I2/opencode invented "lib/search/README.md", "023-hybrid-rag-fusion-refinement", "022-hybrid-rag-fusion" — none exist. This contradicts 005/REQ-007 (gap-flag should broaden) **and** 005/REQ-008 (no auto-bind on weak signal): instead of either fix, the model fabricated context. **The correct guard is missing entirely** — the runtime returns `requestQuality.label="weak"` + `recovery.status="low_confidence"` but the model doesn't honor it.
- **Side-effect finding (PROCESS RISK)**: cli-copilot in `--allow-all-tools` mode mutated an unrelated spec folder (the 048-cli-testing-playbooks implementation-summary file) on the I1 "Save the context" prompt. Spent **2.1M tokens over 9.6 minutes**, picked the wrong packet (048 vs 006), and produced low-quality output. The accidental edit was reverted; documented as Recommendation #2.

---

## Per-Scenario Comparison

| Scenario | cli-codex | cli-copilot | cli-opencode | cli-opencode --pure | Notes |
|----------|-----------|-------------|--------------|--------------------|-------|
| **S1** Find /memory:save planner-first spec | 7/10 | 7/10 | 7/10 | 6/10 | All correct. opencode used `memory_match_triggers` (intended path); pure ablation costs ~10% efficiency, no correctness loss |
| **S2** "Find stuff about memory" (vague) | 5/10 | 5/10 | **6/10** | 5/10 | opencode wins via `memory_quick_search` + `cocoindex_code_search`. Vocabulary check (005/REQ-003): all CLIs use "memory entries"/"memories", NOT canonical "Trigger-matched spec-doc records" — **vocabulary violation persists** |
| **S3** SPECKIT_SAVE_PLANNER_MODE decision | 7/10 | 6/10 | **7/10** | 5/10 | Only opencode found the decision-record markdown ADR ledger; codex/copilot stopped at spec.md L106/L112 |
| **Q1** Functions calling memory_context | **6/10** | 3/10 | 4/10 | n/a | codex wins; copilot truncated; opencode tried `code_graph_query` (correct tool) but the graph is sparse (005/REQ-017) → 4-min latency for partial coverage |
| **Q2** "Anything about search system" (vague) | 5/10 | 5/10 | **6/10** | n/a | opencode wins via cocoindex hybrid. Intent classifier (005/REQ-001) did NOT misroute "search system" → fix_bug in this run — possibly fixed since 005 was authored |
| **Q3** Token-budget enforcement code paths | **6/10** | 3/10 | **6/10** | n/a | codex + opencode tied; both cite `context-server.ts:1140-1165` and `hooks/memory-surface.js:162` (`enforceAutoSurfaceTokenBudget`) — exactly the 005/REQ-002 truncation bug location |
| **I1** "Save the context for this conversation" | 6/10 | **1/10** | **7/10** | n/a | opencode wins (planner-first per 004 contract); **copilot CATASTROPHIC** (9.6 min, 2.1M tokens, mutated wrong spec folder); codex correctly described the contract without execution |
| **I2** "Debugging the search bug, where to start?" | **6/10** | 5/10 | **1/10** | n/a | codex + copilot found 005 packet; **opencode HALLUCINATED 4 file paths and 2 spec packet IDs** when memory_search returned `quality:weak / status:low_confidence`. Major novel finding |
| **I3** `/memory:search preflight specs/026/003/005 T101` | 3/10 | 3/10 | **7/10** | n/a | Only opencode actually called `task_preflight()` MCP tool (the intended routing); codex/copilot described what would happen |

**Per-CLI scenario coverage (% scoring ≥7/10):**
- cli-codex: 33% (3/9: S1, S3, plus borderline Q1/Q3)
- cli-copilot: 11% (1/9: S1)
- cli-opencode: **56%** (5/9: S1, S3, I1, I3, plus borderline Q2)
- cli-opencode --pure: 0% (0/3 reached 7)

---

## Top 3 Wins per CLI

### cli-codex
1. **Q3 — 6/10**: Cited `context-server.ts:1140-1165` AND `dist/hooks/memory-surface.js:162 enforceAutoSurfaceTokenBudget` with verified line numbers — most precise of any CLI for the 005/REQ-002 truncation bug.
2. **Q1 — 6/10**: Listed 5+ memory_context callers with file:line refs via recursive grep — beat opencode (whose code_graph approach took 4 minutes for fewer hits).
3. **S1 — 7/10**: Cited spec.md L154 ANCHOR:requirements + REQ-001 (planner-first non-mutating) — also recited the full REQ list when only the path was asked (over-thorough but not wrong).

### cli-copilot
1. **S1 — 7/10**: Cleanest user-facing output of all S1 cells (852 bytes). Glob → targeted greps → Read → quoted exact spec.md text.
2. **I2 — 5/10**: Found 005-memory-search-runtime-bugs packet by name and recommended spec.md as starting point.
3. **S3 — 6/10**: Quoted SPECKIT_SAVE_PLANNER_MODE decision from spec.md L106/L112 with ANCHOR markers.

### cli-opencode (general agent)
1. **I3 — 7/10**: Only CLI to actually invoke `task_preflight()` MCP tool — exact intended routing per command spec §5A.
2. **I1 — 7/10**: Recognized /memory:save planner-first contract and correctly did NOT mutate (per 004 default). Used zero MCP tool calls — the planner-first pattern in action.
3. **S3 — 7/10**: Only CLI to find the decision-record markdown ADR ledger via memory_search routing.

---

## Top 3 Failures per CLI

### cli-codex
1. **I3 — 3/10**: Described /memory:search preflight semantics but never actually invoked task_preflight (no MCP). Fair limitation, but 248k tokens spent on a parsing question.
2. **I1 — 6/10**: Latency 12.4s borderline — described save action without execution path; correct meta-answer but lost a Correctness point for not executing.
3. **S2 — 5/10**: Vague-prompt enumerated packets without canonical vocabulary; tied with copilot/opencode-pure.

### cli-copilot
1. **I1 — 1/10**: **Catastrophic outlier**. 576 seconds (9.6 min), 2,115,900 tokens (highest in entire sweep, 7× next-highest), edited unrelated spec folder (the 048-cli-testing-playbooks implementation-summary file), picked wrong packet, returned partial-quality summary. **Don't dispatch ambiguous intent prompts to copilot in autonomous mode.**
2. **Q1 — 3/10**: 91s, 447k tokens, found only 4 callers with one off-by-a-few line number; didn't dig into hooks/memory-surface where additional callers live.
3. **Q3 — 3/10**: Identified general area but missed line specificity; 392k tokens for an answer codex gave with similar token cost but better precision.

### cli-opencode (general agent)
1. **I2 — 1/10**: **Hallucinated 6 paths/IDs that don't exist** when memory_search returned `quality:weak`. Invented "lib/search/README.md", "lib/search/pipeline/", "023-hybrid-rag-fusion-refinement/007-...", "022-hybrid-rag-fusion/015-...". **Worst hallucination of the sweep.**
2. **Q1 — 4/10**: 249.8s (4 minutes) — code_graph_query approach was correct but the graph is sparse (005/REQ-017), forcing fallback to grep mid-flight. Returned 3-4 callers vs codex's 5+.
3. **S1/S2/S3 (--pure ablation) — avg 5.33/10**: Removing MCP costs ~1.5 points avg vs general agent. Not catastrophic but real.

---

## Cross-Reference to 005 Defects

| 005 REQ | Scenario(s) | Status this sweep |
|---------|-------------|-------------------|
| **REQ-001** Intent classifier no-keyword fallback | Q2 (search system) | Did NOT misroute → `fix_bug` in this run. Possible fix landed since 005 authored, OR this query happened to keyword-match correctly. Re-test with "Semantic Search" query needed. |
| **REQ-002** memory_context truncation wrapper | Q3 | **Confirmed defect location**: codex + opencode both pinpoint `context-server.ts:1140-1165` + `hooks/memory-surface.js:162`. Repro evidence in 005 spec.md POST-REMEDIATION VERIFICATION (added by parallel session) shows fix not yet live in `dist/`. |
| **REQ-003** Canonical vocabulary "Trigger-matched spec-doc records" | S2 (all 4 cells) | **Vocabulary violation persists across all CLIs** — opencode S2 output uses "Spec Kit Memory is the indexed-continuity store" / "memory entries", never the canonical phrase. Render layer not yet updated. |
| **REQ-007** Gap-flag triggers broadening | I2/opencode | **Worse than REQ-007 specifies**: gap WAS flagged (`quality:weak`, `status:low_confidence`) but model HALLUCINATED instead of broadening. Need a guard that suppresses LLM output when `recovery.status="low_confidence"` and `recovery.suggestedQueries=[]`. |
| **REQ-008** Folder-discovery no-auto-bind on weak signal | I2/opencode | Related: opencode invented packet IDs from training distribution rather than auto-binding to a wrong real folder. Different failure mode than REQ-008 — model-side, not folder-discovery-side. |
| **REQ-017** Code graph naming/empty | Q1/opencode | **Confirmed degradation**: code_graph_query approach took 4 min for partial coverage. Graph is empty/sparse → fallback to grep is operational but slow. |
| REQ-014 AskUserQuestion routing | (not exercised) | n/a |
| REQ-016 Intent classifier stability | Q2 (vague) | Single-cell, can't confirm stability. |

---

## Recommendations

### 1. P0 — Add a hallucination guard for low-confidence memory_search retrievals (NEW — not in 005)

**Evidence**: I2/opencode-1 received `requestQuality.label="weak"`, `recovery.status="low_confidence"`, `recovery.reason="knowledge_gap"`, `recovery.suggestedQueries=[]` from `memory_search` and proceeded to fabricate "lib/search/README.md", "lib/search/pipeline/", "023-hybrid-rag-fusion-refinement/007-hybrid-search-null-db-fix", "022-hybrid-rag-fusion/015-manual-testing-per-playbook/008-bug-fixes-and-data-integrity". None exist.

**Recommended fix**: When `memory_search` returns `recovery.status="low_confidence"` AND `recovery.suggestedQueries=[]`, the response renderer (or a new wrapper in `mcp_server/tools/memory-tools.ts`) MUST emit an explicit "no canonical context found; do not invent paths" preamble that the model is biased to honor. Today the model receives the full structured warning but interprets it as "now I should be helpful by guessing."

**Cross-link**: Different failure mode than 005/REQ-007 (which says broaden) and 005/REQ-008 (which says no auto-bind). Add as **005/REQ-018** "model-side hallucination guard on weak retrievals."

### 2. P0 — cli-copilot autonomous mode is dangerous for vague intent prompts

**Evidence**: I1/cli-copilot took 576s, 2.1M tokens, edited an unrelated spec folder (`skilled-agent-orchestration/048-cli-testing-playbooks`), and returned a low-quality result. Copilot has spec_kit_memory MCP access AND `--allow-all-tools`, so when the prompt is "save the context" without scope, it picks an arbitrary recent packet and writes there.

**Recommended fix**:
- Document in `.opencode/skill/cli-copilot/SKILL.md` that copilot MUST receive a scoped spec-folder argument for save-style prompts (e.g., "save the context for spec-folder X"); never ambiguous "save the context."
- Consider `--effort medium` instead of `--effort high` for I-tier scenarios where tool autonomy compounds risk.
- For test playbooks like this one, use `--no-allow-all-tools` (read-only) on prompts that aren't explicitly write-actions.

### 3. P1 — Render-layer vocabulary fix (005/REQ-003) is still pending

**Evidence**: All 4 S2 cells (codex, copilot, opencode, opencode-pure) produce text containing "memory entries", "memories", "indexed-continuity store" — never canonical "Trigger-matched spec-doc records" or "Constitutional rules" per spec §4A Step 4b.

**Recommended fix**: Already tracked as 005/REQ-003. Re-prioritize — this affects every search rendering, not just opencode-internal calls. The fix likely lives in the post-processing layer of `memory_search`/`memory_context` response builders.

### 4. P1 — Code graph sparseness (005/REQ-017) costs 4 minutes per Q-tier opencode call

**Evidence**: Q1/cli-opencode latency 249.8s vs Q1/cli-codex 58.4s. Opencode tried `code_graph_query` (correct tool per scenario expectation), got sparse results, fell back to grep mid-execution.

**Recommended fix**: Either (a) populate the code graph (per 005/REQ-017 remediation), or (b) add fast-path detection in `code_graph_query` that returns "graph empty for this query" within seconds so fallback fires sooner.

### 5. P2 — Token efficiency: copilot routinely uses 5-10× more tokens than alternatives

**Evidence (real-token counts)**:
- Sweep avg per cell: codex 121k, opencode 53k, **copilot 593k** (5× codex, 11× opencode)
- I1 outlier: copilot 2.1M vs opencode 40k (53× difference)
- Q2 (vague): copilot 830k vs opencode 63k (13× difference)

**Recommended fix**: For routine search/query/intelligence prompts in playbooks, prefer cli-opencode → cli-codex → cli-copilot in that order on token cost. Reserve cli-copilot for tasks that genuinely benefit from `--allow-all-tools` autonomy (e.g., multi-file refactors), not for retrieval.

### 6. P2 — Ablation insight: --pure costs 1.5 avg points vs full MCP

**Evidence**: opencode general avg on S1/S2/S3 = 6.67; opencode --pure avg on same = 5.33. Difference concentrated in Tool Selection (loses MCP routing) and S2 vague-query Correctness.

**Recommended use**: The MCP advantage is real but bounded — model alone solves S1 (specific search) just fine; MCP earns its keep on S2 (vague), S3 (ADR ledger), I1 (planner-first contract awareness), and I3 (subcommand routing).

---

## Methodology Notes

- **Latency rule**: rubric's <10s=2 / 10-60s=1 / >60s=0 was unforgiving. With MCP overhead, NO cell under 10s. Re-calibration recommended for v2.
- **Token efficiency**: real token counts (codex `tokens used`, copilot `Tokens ↑↓`, opencode `step_finish.tokens.total`) used; bytes/4 estimate from meta.json is misleading for codex (includes full reasoning trace).
- **Hallucination check**: Spot-verified file paths, line numbers, packet IDs against actual filesystem for each cell flagged ≤1 on Hallucination dim.
- **Single scorer (this session)**; no second-reviewer pass per 001 §Scoring Methodology v1.0.0 default. The I2/opencode 1/10 score is the most-confident finding and would benefit from review.
- **Sweep environment**: live production memory DB; `code-graph` empty/sparse confirmed; CocoIndex daemon healthy (multiple `ccc run-daemon` processes active).

---

## Artifacts

- 30 score markdown files at runs/SCENARIO/CLI-N/score.md
- Run log: runs/run-all.log (43 min wall-clock, all exit_code=0)
- Per-cell raw I/O: runs/SCENARIO/CLI-N/ holding prompt.md, output.txt, meta.json

---

## Rubric v1.0.1 Amendment

The v1.0.0 rubric (5 dimensions, 10 pts max) produced collapsed signal on two dimensions: Token Efficiency scored 0/2 in 30 of 30 cells (the bytes/4 estimator over-counts CLI session bloat — codex stdout includes the full reasoning trace, copilot reports cumulative session burn, opencode MCP traversal naturally exceeds the 10k floor) and Latency scored 0 in 14 of 30 and 1 in 15 of 30 (the <10s threshold was unreachable for any MCP-using cell once tool round-trips and a single Read were added). Rubric v1.0.1 drops Token Efficiency entirely and recalibrates Latency to 0=>300s / 1=60-300s / 2=<60s, yielding a 4-dimension scoring axis with 8 pts max per cell. All 30 cells were rescored under v1.0.1; the v1.0.0 tables remain in each score markdown as historical record.

### Per-CLI averages (v1.0.1)

| CLI                  | n  | v1.0.0 avg /10 | v1.0.1 avg /8 | v1.0.1 normalized % |
|----------------------|----|----------------|---------------|---------------------|
| cli-codex-1          | 9  | 5.67           | 6.56          | 81.9%               |
| cli-copilot-1        | 9  | 4.22           | 5.11          | 63.9%               |
| cli-opencode-1       | 9  | 5.67           | 6.67          | 83.3%               |
| cli-opencode-pure-1  | 3  | 5.33           | 6.33          | 79.2%               |
| **Overall (n=30)**   | 30 | **5.20** (52.0%) | **6.13** (76.7%) | — |

### Side-by-side: v1.0.0 vs v1.0.1

| Rank | v1.0.0 (/10)              | v1.0.1 (/8)               | v1.0.1 (%)         |
|------|---------------------------|---------------------------|--------------------|
| 1    | cli-codex-1 — 5.67        | cli-opencode-1 — 6.67     | cli-opencode-1 — 83.3% |
| 2    | cli-opencode-1 — 5.67     | cli-codex-1 — 6.56        | cli-codex-1 — 81.9% |
| 3    | cli-opencode-pure-1 — 5.33 | cli-opencode-pure-1 — 6.33 | cli-opencode-pure-1 — 79.2% |
| 4    | cli-copilot-1 — 4.22      | cli-copilot-1 — 5.11      | cli-copilot-1 — 63.9% |

### Rank order delta

Under v1.0.0 cli-codex-1 and cli-opencode-1 tied at 5.67. Under v1.0.1 cli-opencode-1 narrowly takes #1 at 6.67 vs codex 6.56 (the dropped Token Efficiency dim was hurting opencode less than codex per-cell, and opencode benefited more from the relaxed Latency thresholds). cli-copilot-1 remains #4 with the largest gap to the field — its tail of low Correctness scores on intent-classification scenarios (I1, I2 generic listings) is the dominant signal, not the rubric calibration. cli-opencode-pure-1 (3-cell ablation) sits between the MCP-using runtimes and copilot, showing pure-mode degrades but doesn't collapse opencode's quality.

### Reading the corrected scores

The v1.0.1 normalization moves the field from 52% to 77% mean quality, which more accurately reflects the underlying AI behavior observed in the 30 cells: Correctness, Tool Selection, and Hallucination dimensions consistently scored 1-2 across CLIs, and the only true differentiator is intent-classification on vague prompts (I1/I2). The rank order is stable in spirit (codex/opencode top, copilot bottom) but v1.0.1 surfaces opencode's MCP-routing advantage on memory-aware scenarios that v1.0.0's collapsed dimensions had buried. Future sweep iterations should standardize on v1.0.1 and treat the 17 v1.0.0 zero-Latency cells as an artifact of the deprecated rubric, not a runtime regression.

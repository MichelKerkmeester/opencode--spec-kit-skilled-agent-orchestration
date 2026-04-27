---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification [system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-search-intelligence-stress-test/001-scenario-design/spec]"
description: "Sub-phase 001: 9-scenario corpus (3 features × 3 prompt types), 5-dimension scoring rubric, per-CLI dispatch matrix, and dispatch script contracts for stress-testing system-spec-kit Search/Query/Intelligence."
trigger_phrases:
  - "001-scenario-design"
  - "scenario corpus design"
  - "9 scenario test corpus"
  - "search query intelligence rubric"
  - "cli dispatch matrix"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-search-intelligence-stress-test/001-scenario-design"
    last_updated_at: "2026-04-26T14:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored 9-scenario corpus + 5-dim rubric + dispatch matrix"
    next_safe_action: "Hand off corpus + matrix to 002 for execution"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 100
    open_questions:
      - "Should S2 (Search-Vague) cap result count to make scoring tractable?"
      - "Q1 (Query-Simple) may not work if code_graph is empty — fall back to a different query?"
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Scenario Design Sub-Phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Design Complete |
| **Created** | 2026-04-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Sibling Sub-Phases** | `002-scenario-execution` |
| **Corpus Version** | v1.0.0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Without a fixed corpus + rubric + dispatch matrix, "stress-test" devolves into ad-hoc prompting — non-reproducible, partial, and impossible to compare across CLIs or over time. The parent spec mandates a deterministic test fixture; this sub-phase delivers it.

### Purpose
Ship the design artifacts (scenarios, rubric, matrix, scripts) that sub-phase 002 will execute. After this packet closes, any operator can run the playbook end-to-end without further design decisions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 9 scenarios with prompt + expected outcome + target tools/anchors + feature/type tags + cross-references to known defects (sibling 005)
- 5-dimension scoring rubric (correctness, tool selection, latency, token efficiency, hallucination) on 0-2 scale + 1 narrative dimension
- Per-CLI dispatch matrix (cli-codex, cli-copilot, cli-opencode) with model id, reasoning effort, sandbox/agent profile, prompt template wrapper
- Dispatch script contracts (`scripts/dispatch-cli-codex.sh`, `dispatch-cli-copilot.sh`, `dispatch-cli-opencode.sh`, `run-all.sh`)
- Output schema (per-run files + aggregate findings format)

### Out of Scope
- Actual dispatch execution (sub-phase 002 owns this)
- Scoring of actual run outputs (sub-phase 002)
- Findings synthesis (sub-phase 002)
- Modifying the canonical command spec at `.opencode/command/memory/search.md`
- Adding test scenarios for cli-claude-code or cli-gemini

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | This sub-phase spec — corpus + rubric + matrix |
| `plan.md` | Create | Methodology for corpus + rubric design |
| `tasks.md` | Create | Authoring tasks broken down |
| `implementation-summary.md` | Create | Outcome summary |
| `description.json` | Create | Indexer metadata |
| `graph-metadata.json` | Create | Graph traversal metadata |
| `scripts/dispatch-cli-codex.sh` | Create | Codex dispatch wrapper (template) |
| `scripts/dispatch-cli-copilot.sh` | Create | Copilot dispatch wrapper with concurrency guard |
| `scripts/dispatch-cli-opencode.sh` | Create | OpenCode dispatch wrapper |
| `scripts/run-all.sh` | Create | Orchestrator for full sweep |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 9 scenarios documented in §Scenario Corpus below | Each has id, feature, prompt-type, prompt text, expected outcome, target tools, success indicators |
| REQ-002 | 5-dim rubric documented in §Scoring Rubric below | Each dim has 0/1/2 anchors with concrete behavior examples |
| REQ-003 | Dispatch matrix in §Dispatch Matrix below | Per-CLI: model + effort + sandbox/agent + invocation template |
| REQ-004 | Dispatch scripts present | `scripts/*.sh` exist; `bash -n` syntax checks pass |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Output schema defined | `runs/<scenario>/<cli>-N/{prompt.md,output.txt,meta.json,score.md}` documented in §Output Schema |
| REQ-006 | cli-copilot concurrency guard | `dispatch-cli-copilot.sh` checks `pgrep -f copilot \| wc -l` before launching |
| REQ-007 | Cross-references to defects | Scenarios that overlap with sibling 005 REQs note the REQ-ID inline |

### P2 - Refinements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Scoring methodology guide | Methodology + tie-breaker rules + secondary-reviewer protocol documented in §Scoring Methodology |
| REQ-009 | Ablation cell defined | At least one cell tests cli-opencode WITHOUT spec-kit MCP for fair vs-external comparison |
<!-- /ANCHOR:requirements -->

---

## Scenario Corpus (v1.0.0)

### Search × Simple → S1
- **Prompt**: `Find the spec for the /memory:save planner-first contract.`
- **Expected outcome**: Hits packet `system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/004-memory-save-rewrite` within top 3 results
- **Target tools**: `memory_search`, `memory_match_triggers` (trigger phrase "planner-first" should hit)
- **Success indicators**: Returns the canonical spec folder path; cites 004-memory-save-rewrite spec
- **Cross-ref**: None

### Search × Vague → S2
- **Prompt**: `Find stuff about memory.`
- **Expected outcome**: Returns 5-10 ranked results spanning multiple packets; rendering uses canonical "Trigger-matched spec-doc records" vocabulary (per spec §4A Step 4b)
- **Target tools**: `memory_context` (auto mode), with FTS5 fallback if vector channel weak
- **Success indicators**: Diverse results (not all from one packet); rendering vocabulary correct
- **Cross-ref**: 005/REQ-003 (vocabulary violation)

### Search × Specific → S3
- **Prompt**: `Find decisions in 026/003/004 about SPECKIT_SAVE_PLANNER_MODE.`
- **Expected outcome**: Hits decision-record.md OR causal_summary in 004-memory-save-rewrite within top 1 result
- **Target tools**: `memory_search` with `intent:find_decision` and `specFolder` filter
- **Success indicators**: Returns the SPECKIT_SAVE_PLANNER_MODE decision rationale
- **Cross-ref**: None

### Query × Simple → Q1
- **Prompt**: `What functions in mcp_server/ call memory_context?`
- **Expected outcome**: Returns 3-10 callers with file:line references
- **Target tools**: `code_graph_query` (structural traversal), fallback to `cocoindex_search` or grep
- **Success indicators**: Real file paths; verifiable line numbers
- **Cross-ref**: 005/REQ-017 (code-graph naming) — if startup hook reports "code graph empty", this scenario reveals the gap

### Query × Vague → Q2
- **Prompt**: `Show me anything related to the search system.`
- **Expected outcome**: Mixed results: code refs + spec refs + memory entries
- **Target tools**: `memory_context` deep mode + cocoindex hybrid
- **Success indicators**: Cross-channel fusion evident; results from both code and spec docs
- **Cross-ref**: 005/REQ-001 (intent classifier — "search" keyword behavior)

### Query × Specific → Q3
- **Prompt**: `Find all token-budget enforcement code paths under .opencode/skill/system-spec-kit/mcp_server/.`
- **Expected outcome**: Locates the budget enforcer + caller chains; ideally surfaces the bug from 005/REQ-002
- **Target tools**: `cocoindex_search` (semantic), `code_graph_query` (callers), grep (tokens like "tokenBudget")
- **Success indicators**: Identifies the specific source file + function responsible for truncation
- **Cross-ref**: 005/REQ-002 (truncation wrapper bug)

### Intelligence × Simple → I1
- **Prompt**: `Save the context for this conversation.`
- **Expected outcome**: Routes to `/memory:save` with planner-first default; returns structured planner output (no file mutation per 004)
- **Target tools**: `/memory:save` invocation
- **Success indicators**: Recognizes save intent; uses planner-first contract; no surprise mutations
- **Cross-ref**: 003/004 (planner-first contract)

### Intelligence × Vague → I2
- **Prompt**: `I'm debugging the search bug — what should I look at first?`
- **Expected outcome**: Surfaces sibling packet `005-memory-search-runtime-bugs`; recommends starting with spec.md §8 probes
- **Target tools**: `advisor_recommend`, `session_bootstrap`, `memory_match_triggers` on "search bug"
- **Success indicators**: Identifies 005 packet by name OR path; suggests reading spec/plan first
- **Cross-ref**: 005 (entire packet)

### Intelligence × Specific → I3
- **Prompt**: `Run /memory:search preflight specs/026/003/005 T101.`
- **Expected outcome**: Routes to `task_preflight()` analysis subcommand with the right spec folder + task ID
- **Target tools**: `/memory:search preflight ...` analysis routing per command spec §5A
- **Success indicators**: Correctly parses subcommand + arguments; invokes preflight tool; returns epistemic baseline scaffold
- **Cross-ref**: None (tests command parsing, not a known defect)

---

## Scoring Rubric

> **Active version**: v1.0.1 (4 dimensions, 0-2 scale, 8 pts max + 1 narrative dim).
> **Historical**: v1.0.0 (5 dimensions, 10 pts max) preserved at the bottom of this section as `### v1.0.0 (deprecated)` for audit-trail purposes only. All 30 cells in `002-scenario-execution/runs/` are scored under v1.0.0 in their original score table and v1.0.1 in an appended block.

### v1.0.1 Calibration Note

**What changed**:
1. **Dropped Dimension 4 (Token Efficiency).** The bytes/4 estimator in `meta.json` over-counts CLI session bloat: cli-codex stdout includes the full reasoning trace, cli-copilot reports cumulative session burn that routinely exceeds 10k after a few tool calls, and cli-opencode MCP traversal naturally sits above the 10k floor. The 30/30 zero pattern in v1.0.0 confirmed this dimension was unwinnable rather than discriminating. API-reported tokens are not uniformly available across the three CLIs (only codex emits a `tokens used: NNNN` summary line in stdout), so a fair re-anchor on real-token counts isn't tractable from the existing artifacts either.
2. **Recalibrated Dimension 3 (Latency)** to `0 = >300s, 1 = 60-300s, 2 = <60s` (was `0 = >60s, 1 = 10-60s, 2 = <10s`). The original 10s/60s thresholds were tuned for stdlib calls; no MCP-using cell can hit <10s once tool round-trips and a single Read are added, so 14/30 cells scored 0 and 15/30 scored 1 — collapsing the dimension.
3. **Re-numbered remaining dimensions** as 1 Correctness, 2 Tool Selection, 3 Latency (recalibrated), 4 Hallucination.
4. **New per-cell max** is **8/8** (was 10/10). Narrative dimension retained as-is, no points.

**Why this matters**: under v1.0.0 the four-CLI averages were codex 5.67, opencode 5.67, copilot 4.22, opencode-pure 5.33 — capped near 6/10 ceiling because two dimensions were structurally unwinnable. The underlying AI quality on Correctness + Tool Selection + Hallucination was 72-82%, which the v1.0.1 rescoring surfaces.

### Dimension 1 — Correctness
- **0**: Wrong answer / no answer / hallucinated content
- **1**: Partial answer (correct direction but incomplete, or correct with significant noise)
- **2**: Correct + complete answer matching expected outcome

### Dimension 2 — Tool Selection
- **0**: Wrong tool entirely (e.g., grep when semantic search needed)
- **1**: Suboptimal tool (works but inefficient, e.g., generic memory_search when memory_search with anchors would be cleaner)
- **2**: Optimal tool selection per expected behavior; uses CocoIndex/code_graph/memory_search correctly per scenario

### Dimension 3 — Latency (recalibrated v1.0.1)
- **0**: > 300 seconds wall-clock
- **1**: 60-300 seconds
- **2**: < 60 seconds

### Dimension 4 — Hallucination
- **0**: Invents data (file paths, line numbers, content) that don't exist
- **1**: Acknowledges uncertainty but still includes some unverified claims
- **2**: All claims cite verifiable evidence (file paths, exact text, tool outputs)

### Narrative Dimension — Notable Behavior
Free-text observation: surprising wins, unexpected failures, regressions, novel patterns.

### Aggregate
- Per-run total: sum of dims 1-4 (max 8)
- Per-scenario CLI rank: sort cells by total descending
- Per-CLI scenario coverage: % scenarios where CLI scored ≥7/8

---

### v1.0.0 (deprecated)

> Preserved for audit trail only. Each of the 30 score files in `002-scenario-execution/runs/` keeps its original v1.0.0 table and appends a v1.0.1 table below it. New work MUST score against v1.0.1.

5 dimensions, 0-2 scale (10 pts max), plus 1 narrative dim.

- **D1 Correctness**: 0 wrong / 1 partial / 2 correct
- **D2 Tool Selection**: 0 wrong tool / 1 suboptimal / 2 optimal
- **D3 Latency**: 0 > 60s / 1 10-60s / 2 < 10s
- **D4 Token Efficiency**: 0 > 10k / 1 3k-10k / 2 < 3k (tokens in + out)
- **D5 Hallucination**: 0 invented / 1 some unverified / 2 fully cited
- Narrative dim: free-text notable behavior

Aggregate: sum of D1-D5 (max 10); per-CLI coverage = % scenarios at >=7/10.

---

## Dispatch Matrix

### cli-codex (external, no spec-kit MCP)

| Field | Value |
|-------|-------|
| Model | `gpt-5.5` |
| Reasoning effort | `medium` |
| Service tier | `fast` (REQUIRED per memory feedback_codex_cli_fast_mode memory entry) |
| Sandbox | `read-only` for Search/Query/Intelligence (no writes needed) |
| Approval policy | `never` |

**Invocation template** (`scripts/dispatch-cli-codex.sh`):
```bash
codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort="medium" \
  -c service_tier="fast" \
  --sandbox read-only \
  --ask-for-approval never \
  "$PROMPT" 2>&1
```

### cli-copilot (external, no spec-kit MCP, max 3 concurrent)

| Field | Value |
|-------|-------|
| Model | `gpt-5.4` (default; REQ-009 may rotate models in v2) |
| Reasoning effort | `high` (gpt-5.4 default) |
| Mode | non-interactive `-p` |
| Allow-all-tools | enabled (autonomous) |

**Invocation template** (`scripts/dispatch-cli-copilot.sh`):
```bash
# Concurrency guard
while [ "$(pgrep -f 'copilot' | wc -l)" -ge 3 ]; do sleep 2; done
copilot -p "$PROMPT" --model gpt-5.4 --allow-all-tools 2>&1 </dev/null
```

### cli-opencode (full spec-kit MCP runtime)

| Field | Value |
|-------|-------|
| Model | `opencode-go/deepseek-v4-pro` |
| Variant (effort) | `high` |
| Agent | `general` (full tool access; ablation cell uses `context` for fairness) |
| Format | `json` |
| Dir | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` |

**Invocation template** (`scripts/dispatch-cli-opencode.sh`):
```bash
opencode run \
  --model opencode-go/deepseek-v4-pro \
  --agent general \
  --variant high \
  --format json \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  "$PROMPT" 2>&1
```

**Ablation cell** (REQ-009):
For S1, S2, S3 also dispatch with `--agent context` (read-only retrieval focus, more comparable to external CLIs) to isolate model quality from full-MCP advantage.

---

## Output Schema

```
002-scenario-execution/
├── runs/
│   ├── S1/
│   │   ├── cli-codex-1/
│   │   │   ├── prompt.md       # exact prompt text
│   │   │   ├── output.txt      # raw CLI stdout+stderr
│   │   │   ├── meta.json       # latency_ms, tokens_in, tokens_out, model, exit_code, started_at, db_snapshot_hash
│   │   │   └── score.md        # rubric scoring with evidence quotes
│   │   ├── cli-copilot-1/...
│   │   ├── cli-opencode-1/...
│   │   └── cli-opencode-context-1/  # ablation cell
│   ├── S2/...
│   └── ... (S3, Q1-Q3, I1-I3)
└── findings.md                  # aggregate cross-CLI comparison + recommendations
```

### meta.json schema
```json
{
  "scenario_id": "S1",
  "cli": "cli-codex",
  "run_n": 1,
  "model": "gpt-5.5",
  "effort": "medium",
  "started_at": "2026-04-26T15:00:00Z",
  "completed_at": "2026-04-26T15:00:08Z",
  "latency_ms": 8234,
  "tokens_in": 1200,
  "tokens_out": 850,
  "exit_code": 0,
  "db_snapshot_hash": "sha256:abc123..."
}
```

### score.md format
```markdown
## Scenario S1 — cli-codex run 1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Output cited 004-memory-save-rewrite spec; matches expected |
| Tool Selection | 1 | Used grep instead of memory_search (no MCP available) |
| Latency | 2 | 8.2s |
| Token Efficiency | 2 | 2050 total |
| Hallucination | 2 | All paths verified |
| **Total** | **9/10** | |

**Notable**: Resolved without MCP access by reading from filesystem; impressive grep-fu.
```

---

## Scoring Methodology

- **Single scorer per cell** for v1.0.0; second-reviewer for any cell scoring ≤4/10 to confirm.
- **Tie-breaker rules**: when between two scores (e.g., 1 vs 2), pick the LOWER score and document why in evidence.
- **Latency baseline**: stopwatch from prompt submit to final output; exclude pre-flight time.
- **Token counts**: use CLI-reported numbers when available; estimate via 1 token ≈ 4 chars otherwise.
- **Hallucination check**: spot-verify 3 random factual claims per output (file paths, line numbers, function names) against actual filesystem.

---

### Acceptance Scenarios

**Given** the corpus is locked at v1.0.0, **when** an operator opens 001/spec.md, **then** they have a complete dispatch playbook needing zero additional design decisions.

**Given** sub-phase 002 runs, **when** every cell in the matrix executes, **then** there is a 1:1 mapping from this corpus to run score markdown files.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 9 scenarios documented with the 5 required fields (prompt, expected, tools, indicators, cross-ref).
- **SC-002**: Rubric anchors are concrete enough that two scorers would agree within ±1 on most cells.
- **SC-003**: Dispatch scripts pass `bash -n` syntax check.
- **SC-004**: validate.sh --strict passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Scenario expectations may be wrong (e.g., S1 trigger may not hit 004) | Medium | Run a smoke test of each scenario before locking corpus version |
| Risk | Q1 expects code-graph data; if graph is empty (per startup hook) the scenario degrades | Medium | Document fallback: if code_graph unavailable, scenario reverts to grep-based query |
| Risk | Rubric latency thresholds (10s, 60s) may be wrong calibration for cli-opencode | Low | After first sweep, re-calibrate if all cli-opencode cells score 0 on latency |
| Dependency | All 3 CLIs installed | High | Pre-flight in run-all.sh; abort with clear message if missing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should S2 (Search-Vague) cap result count to make scoring tractable? Currently expects "5-10 ranked results"; may need a hard limit.
- Q1 (Query-Simple) may not work if code_graph is empty — fall back to a different query? Or document degradation?
- Should the ablation cell (cli-opencode --agent context) be REQUIRED (REQ-009 says "at least one") or run for all 9 scenarios?
- For the latency rubric, should we exclude tool-call latency from the model itself? (This penalizes MCP-using runs unfairly.)
- Should we capture the exact memory DB snapshot before each run for reproducibility, given 005's evidence of constant graph growth?
<!-- /ANCHOR:questions -->

---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/spec]"
description: "Stress-test playbook for system-spec-kit Search/Query/Intelligence features by dispatching simple/vague/specific prompts via cli-codex, cli-copilot, and cli-opencode and scoring quality + efficiency against a fixed rubric."
trigger_phrases:
  - "001-search-intelligence-stress-test"
  - "search intelligence playbook"
  - "memory search cross-AI test"
  - "cli-codex cli-copilot cli-opencode stress test"
  - "search query intelligence rubric"
  - "external vs MCP search comparison"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test"
    last_updated_at: "2026-04-26T14:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Created root packet"
    next_safe_action: "Author 001"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 25
    open_questions:
      - "How many runs per (scenario × CLI) cell? Default N=1 baseline; optionally expand to N=3 for variance signal"
      - "Should cli-opencode use --agent general OR --agent context for fair comparison vs external CLIs?"
      - "Fixed-corpus scoring or use the actual production memory database? (production = realistic, fixed = reproducible)"
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Search Intelligence Stress-Test Playbook

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Sibling Phases** | 005-memory-search-runtime-bugs (findings packet for related defects) |
| **Sub-Phases** | 001-scenario-design, 002-scenario-execution |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | 001-scenario-design/ | Design Complete | 9-scenario corpus + 5-dim rubric + dispatch matrix + scripts |
| 2 | 002-scenario-execution/ | Scaffold Complete; Execution Deferred | Run harness + scoring workflow + findings aggregation contract |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The system-spec-kit "Search / Query / Intelligence" surfaces (memory_search, memory_context, code_graph_query, advisor_recommend, intent classifier, etc.) have grown organically across 26+ optimization packets. Sibling packet `005-memory-search-runtime-bugs` catalogs 17 defects observed in a single live session. We need a reproducible, cross-AI stress-test that quantifies how well the search intelligence performs under realistic prompt variation — not just bug-hunt, but ongoing quality regression.

### Purpose
Build a playbook that dispatches a fixed prompt corpus (9 scenarios × 3 prompt types) through cli-codex, cli-copilot, and cli-opencode, then scores each outcome against a 5-dimension rubric (correctness, tool selection, latency, token efficiency, hallucination). The asymmetry between cli-opencode (full Spec Kit Memory MCP runtime) and cli-codex/cli-copilot (external runtimes without our MCP) is the test's most informative axis — it reveals whether our search intelligence adds measurable value over off-the-shelf AI capabilities.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define the 9-scenario corpus across 3 features (Search, Query, Intelligence) × 3 prompt-types (Simple, Vague, Specific).
- Define the 5-dimension scoring rubric.
- Define the dispatch matrix: which CLI, which model, which agent/profile, which reasoning effort per cell.
- Define the output schema (per-run files + aggregate findings).
- Author dispatch scripts that respect each CLI's concurrency limit (cli-copilot hard cap = 3).
- Sequence two sub-phases: 001 (design — this packet's child) and 002 (execution).

### Out of Scope
- Fixing the 17 defects in sibling packet `005-memory-search-runtime-bugs` (separate remediation packet handles that).
- Modifying the Search/Query/Intelligence runtime under `mcp_server/`.
- Adding new search features or channels.
- Cross-CLI (cli-claude-code, cli-gemini) — kept to the three the user specified.
- Statistical significance testing beyond N=3 per cell (this is a stress-test playbook, not a benchmark).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | This root spec |
| `plan.md` | Create | Two-sub-phase architecture + scoring methodology |
| `tasks.md` | Create | Phase 1 (design) → Phase 2 (execute) → Phase 3 (synthesize) |
| `implementation-summary.md` | Create | Outcome summary (placeholder until execution lands) |
| `description.json` | Create | Indexer metadata |
| `graph-metadata.json` | Create | Graph traversal metadata |
| `001-scenario-design/` | Create | Sub-phase: scenario corpus, rubric, dispatch matrix, scripts |
| `002-scenario-execution/` | Create | Sub-phase: actual run-and-score harness + findings synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define a fixed 9-scenario corpus | 001-scenario-design/spec.md lists exactly 9 scenarios (3 features × 3 prompt types) with prompt text, expected outcome, target tools/anchors, and feature/type tags |
| REQ-002 | Define a 5-dimension rubric | Rubric covers correctness, tool selection, latency, token efficiency, hallucination on a 0-2 scale (10 pts max per scenario) plus 1 narrative dimension |
| REQ-003 | Define dispatch matrix per CLI | For each of cli-codex, cli-copilot, cli-opencode: model id, reasoning effort, sandbox/agent profile, expected concurrency, prompt template wrapper |
| REQ-004 | Honor cli-copilot 3-process concurrency cap | Dispatch script checks `pgrep -f "copilot" \| wc -l` before launch; queues if ≥3 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Per-run output schema | Each run produces runs subfolders containing prompt markdown, `output.txt`, `meta.json` (latency_ms, tokens_in, tokens_out, model, exit_code, started_at), score markdown (rubric with evidence) |
| REQ-006 | Aggregate findings format | findings markdown with: per-scenario CLI comparison table, top 3 wins per CLI, top 3 failures per CLI, cross-cutting recommendations |
| REQ-007 | Reproducibility | Dispatch scripts capture the exact CLI invocation (model, effort, flags, dir) so a third party can re-run any cell |
| REQ-008 | Ablation cell for cli-opencode | At least one ablation cell runs cli-opencode WITHOUT spec-kit MCP tools to isolate "model quality" from "MCP advantage" |

### P2 - Refinement opportunities

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Variance via N=3 per cell | Optional: each (scenario × CLI) cell runs 3 times; rubric notes variance |
| REQ-010 | Cross-link to 005 defects | Findings cross-reference REQ IDs from sibling 005-memory-search-runtime-bugs when a scenario surfaces a known defect |
| REQ-011 | Persistent corpus versioning | Scenario corpus has a version (v1.0.0) so future runs can be compared against prior baseline |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** the playbook is invoked, **when** sub-phase 001 closes, **then** every REQ-001..004 artifact is present and validates strict.

**Given** sub-phase 002 runs, **when** all 27 base cells complete (9 scenarios × 3 CLIs), **then** 27 run score markdown files exist + 1 findings markdown aggregate.

**Given** a third-party developer wants to re-run scenario S2 against cli-codex, **when** they read 002/runs/S2/cli-codex-1/meta.json, **then** they have the exact invocation to reproduce.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Sub-phase 001 ships a complete dispatch matrix that any operator can execute without further design decisions.
- **SC-002**: Sub-phase 002 produces evidence-backed findings comparing cli-opencode (full MCP) vs cli-codex/cli-copilot (external) performance across all 9 scenarios.
- **SC-003**: Findings surface at least one actionable insight that was not already known from `005-memory-search-runtime-bugs` (i.e., the playbook adds new signal).
- **SC-004**: All three packets validate via `validate.sh --strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-copilot concurrency limit (3) makes 27-run sweep slow | Low | Sequential dispatch with simple queue; total runtime ~30-45 min |
| Risk | CocoIndex daemon may be down during execution (REQ-012 from 005) | Medium | Pre-flight check; document the channel as unavailable in findings if so |
| Risk | Scoring is partially subjective (correctness, tool selection) | Medium | Document scoring methodology in 001/spec.md; have second reviewer for borderline cells |
| Risk | Production memory DB state changes between runs (causal-graph growth observed in 005) | Low | Snapshot DB state before each run; record snapshot hash in meta.json |
| Dependency | Sibling 005 findings inform expected behavior (e.g., "Semantic Search" → fix_bug bug) | High | Cross-reference 005 REQs in scenario expectations |
| Dependency | All 3 CLIs installed and authenticated | High | Pre-flight check in dispatch script; abort with clear error if missing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How many runs per (scenario × CLI) cell? Default to N=1 baseline (27 runs total). Expand to N=3 (81 runs) only if signal is too noisy.
- Should cli-opencode dispatch use `--agent general` (full tool access) or `--agent context` (read-only retrieval focus)? Latter is closer in capability to external CLIs for fair comparison; former tests upper bound.
- Use the live production memory database (realistic, time-varying) or a frozen snapshot (reproducible)? Recommend live for first sweep, snapshot for reruns.
- Should the rubric weight dimensions equally, or weight correctness 2× since it dominates user value? Current spec uses equal weights; revisit after first sweep.
- Should we test the same prompt across multiple cli-copilot models (gpt-5.4 vs claude-opus-4.6 vs gemini-3.1) to compare provider quality? Out of scope for v1, candidate for v2.
<!-- /ANCHOR:questions -->

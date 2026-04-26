---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: Search Intelligence Stress-Test Playbook [system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-search-intelligence-stress-test/plan]"
description: "Two-sub-phase architecture (001-scenario-design, 002-scenario-execution) for stress-testing system-spec-kit Search/Query/Intelligence features via cross-AI dispatch."
trigger_phrases:
  - "search intelligence playbook plan"
  - "stress test architecture"
  - "scenario design execution sub-phases"
  - "rubric scoring methodology"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/006-search-intelligence-stress-test"
    last_updated_at: "2026-04-26T14:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored two-sub-phase plan for stress-test playbook"
    next_safe_action: "Build sub-phase 001 spec docs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 50
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Search Intelligence Stress-Test Playbook

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (dispatch scripts), Markdown (spec/scoring), JSON (meta + findings) |
| **Framework** | system-spec-kit testing-playbook pattern (per `create:testing-playbook` command) |
| **Storage** | Filesystem under runs subfolders; aggregate findings markdown |
| **Testing** | The packet IS the test — scoring rubric verifies outputs |
| **CLIs Under Test** | cli-codex, cli-copilot, cli-opencode |

### Overview

A two-sub-phase architecture: 001 designs the playbook (scenarios, rubric, dispatch matrix, scripts), 002 executes it (runs the matrix, scores outputs, synthesizes findings). The asymmetry between cli-opencode (full Spec Kit Memory MCP) and cli-codex/cli-copilot (external runtimes) is the test's primary signal — it quantifies whether our search intelligence adds measurable value over off-the-shelf AI capabilities.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Sibling packet 005-memory-search-runtime-bugs identifies known defects so we can cross-reference
- [x] All 3 CLI skill specs read and capability matrix understood
- [x] Folder structure created (006/, 006/001/, 006/002/)

### Definition of Done (this root packet)
- [x] spec.md, plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json present
- [ ] Sub-phase 001 designed (separate validate)
- [ ] Sub-phase 002 scaffolded (separate validate)
- [ ] `validate.sh --strict` passes against root packet

### Definition of Done (sub-phase 001)
- [ ] 9 scenarios documented with prompt + expected outcome + target tools
- [ ] Rubric documented with 0-2 scoring per dimension
- [ ] Dispatch matrix table (CLI × scenario → invocation command)
- [ ] Dispatch scripts present under `scripts/` with concurrency guards

### Definition of Done (sub-phase 002)
- [ ] All 27 base runs completed (9 scenarios × 3 CLIs × N=1)
- [ ] All 27 score.md files filled with evidence
- [ ] findings.md synthesizes cross-CLI comparison
- [ ] At least one new actionable insight not already in 005
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**Design-then-execute with separation-of-concerns.** Sub-phase 001 produces all design artifacts; sub-phase 002 consumes them and produces evidence. Each sub-phase has its own validation gate so design can land before execution starts.

### Key Components

- **Scenario corpus** (001): 9 fixed prompts across 3 features × 3 prompt-types
- **Rubric** (001): 5-dim 0-2 scoring + 1 narrative dim
- **Dispatch matrix** (001): per-CLI invocation contracts (model/effort/sandbox/agent/dir)
- **Dispatch scripts** (001): `scripts/dispatch-cli-codex.sh`, `dispatch-cli-copilot.sh`, `dispatch-cli-opencode.sh`, `run-all.sh` orchestrator
- **Run artifacts** (002): per-run folders with prompt + output + meta + score
- **Findings aggregator** (002): cross-CLI comparison tables and recommendations

### Data Flow

```
001/spec.md (corpus + rubric + matrix)
    │
    ├──> 001/scripts/dispatch-cli-X.sh (templated invocations)
    │
    └──> 002/scripts/run-all.sh (orchestrator)
            │
            ├──> Pre-flight: check CLIs installed, mem DB snapshot, CocoIndex daemon
            ├──> For each scenario × CLI:
            │       Dispatch via dispatch-cli-X.sh
            │       Capture output, latency, tokens, exit_code
            │       Write to runs/<scenario>/<cli>-N/{prompt,output,meta}
            ├──> Manual scoring pass: fill score.md per run
            └──> Aggregate: findings.md
```

### Critical Constraints

- cli-copilot concurrency: hard cap 3 (per repo Phase 018 convention)
- cli-codex: must pass `-c service_tier="fast"` per memory feedback_codex_cli_fast_mode memory entry
- cli-opencode: pin `--dir <repo-root>` and `--format json` per skill default
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create root packet docs (spec.md, plan.md, tasks.md, etc.)
- [x] Create sub-phase folders (001-scenario-design, 002-scenario-execution)
- [ ] Validate root packet via validate.sh --strict

### Phase 2: Core Implementation
- [ ] Author 001-scenario-design spec docs (full corpus + rubric + matrix + scripts)
- [ ] Author 002-scenario-execution spec docs (run harness scaffolding)
- [ ] Validate both sub-phases

### Phase 3: Verification
- [ ] All 3 packets pass strict validation
- [ ] Cross-references between 005 (defects) and 006 scenarios verified
- [ ] Hand off to execution session for actual dispatch
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | All 3 packets | `validate.sh --strict` |
| Dispatch script smoke test | Each `dispatch-cli-X.sh` runs a trivial scenario successfully | Bash + 3 CLIs |
| Pre-flight check | Verify all CLIs installed and authenticated before full sweep | Bash command -v + auth probe |
| Concurrency guard test | Spawn 3 cli-copilot processes; 4th queues correctly | pgrep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex installed and authenticated | External | Yellow (verify before exec) | Skip cli-codex column; mark cells N/A |
| cli-copilot installed and authenticated | External | Yellow (verify before exec) | Skip cli-copilot column |
| cli-opencode installed and authenticated | External | Yellow (verify before exec) | Skip cli-opencode column |
| CocoIndex daemon running | External | Red (down per 005 evidence) | Vector channel unavailable; document in findings |
| Sibling packet 005-memory-search-runtime-bugs | Internal | Green (just landed) | Cross-references work |
| `create:testing-playbook` skill | Internal | Green | Available if needed for guidance |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Findings reveal scenario corpus is malformed (e.g., expected outcomes wrong) OR dispatch matrix has fatal error.
- **Procedure**: Revise 001-scenario-design/spec.md with corrections, increment corpus version (v1.0.0 → v1.0.1), re-run affected cells in 002. Prior runs stay in runs subfolder as historical record.
- **Documentation-only packets are non-destructive**: this root packet has no runtime side-effects until 002 dispatches actually execute.
<!-- /ANCHOR:rollback -->

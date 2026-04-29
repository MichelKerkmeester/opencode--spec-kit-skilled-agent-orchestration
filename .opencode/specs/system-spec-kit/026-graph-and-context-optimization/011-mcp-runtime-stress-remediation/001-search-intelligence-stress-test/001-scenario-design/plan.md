---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: Scenario Design [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/001-scenario-design/plan]"
description: "Methodology for the 9-scenario corpus, 5-dim rubric, and 3-CLI dispatch matrix. Authoring + smoke-test plan for sub-phase 001."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "scenario design plan"
  - "rubric methodology"
  - "dispatch matrix authoring"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/001-scenario-design"
    last_updated_at: "2026-04-26T14:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored design methodology"
    next_safe_action: "Author dispatch scripts"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Scenario Design

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (corpus + rubric), Bash (dispatch scripts), JSON (meta schema) |
| **Framework** | system-spec-kit testing-playbook pattern |
| **Storage** | Filesystem (`scripts/`, no per-run data here — that lives in 002) |
| **Testing** | `bash -n` syntax check on all `.sh`; smoke run of 1 scenario per CLI |

### Overview

Build the design artifacts that 002 will execute. The methodology: anchor scenarios in real defects (005), score on observable behaviors, dispatch through canonical CLI invocations from the skill specs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent root packet 006 spec authored
- [x] All 3 CLI skill SKILL.md files read
- [x] Sibling 005 defects packet available for cross-reference

### Definition of Done
- [x] 9 scenarios in spec.md §Scenario Corpus with all required fields
- [x] Rubric anchors concrete enough for inter-rater reliability
- [x] Dispatch matrix with per-CLI invocation templates
- [ ] Dispatch scripts present and `bash -n` clean
- [ ] validate.sh --strict passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**Three-layer fixture**: scenarios (input), rubric (measurement), matrix (dispatch). Each layer has its own validation criterion (corpus completeness, rubric clarity, script executability).

### Key Components

- **Scenario corpus** (spec.md §Scenario Corpus) — 9 prompts with structured metadata
- **Rubric** (spec.md §Scoring Rubric) — 5 dimensions × 3-level anchors + narrative
- **Dispatch matrix** (spec.md §Dispatch Matrix) — per-CLI invocation contracts
- **Output schema** (spec.md §Output Schema) — `runs/...` folder layout + meta.json + score.md format
- **Scripts** (scripts/) — per-CLI dispatch wrappers + run-all.sh orchestrator

### Data Flow

`run-all.sh` reads scenarios → for each (scenario × CLI) → calls `dispatch-cli-X.sh "$PROMPT"` → captures output to `runs/<scenario>/<cli>-N/` → operator manually scores via rubric.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create sub-phase folder
- [x] Author spec.md skeleton

### Phase 2: Implementation
- [x] Author all 9 scenarios with required fields
- [x] Author 5-dim rubric with 0-2 anchors
- [x] Author per-CLI dispatch matrix
- [x] Author output schema
- [x] Author scoring methodology
- [ ] Author dispatch scripts (placeholder structure; concrete shell-out wrapper)

### Phase 3: Verification
- [ ] `bash -n scripts/*.sh` syntax checks
- [ ] Smoke test: dispatch S1 against each CLI manually; verify output capture works
- [ ] `validate.sh --strict` passes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | This sub-phase | `validate.sh --strict` |
| Script syntax | Dispatch scripts | `bash -n` |
| Smoke test | 1 scenario per CLI to verify capture works | Manual |
| Rubric inter-rater check | Score 1 cell with 2 scorers; expect agreement within ±1 | Human |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex skill spec | Internal | Green | Read for invocation contract |
| cli-copilot skill spec | Internal | Green | Read for concurrency cap |
| cli-opencode skill spec | Internal | Green | Read for full-MCP context |
| Sibling 005 defects | Internal | Green (just landed) | Cross-references |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Smoke test reveals dispatch script doesn't capture output correctly OR scenario expectations are wrong.
- **Procedure**: Patch the script or scenario in place; bump corpus version (v1.0.0 → v1.0.1) if scenario semantics change. Prior version stays referenced in changelog.
<!-- /ANCHOR:rollback -->

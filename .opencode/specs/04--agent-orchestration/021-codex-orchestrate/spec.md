---
title: "Feature Specification: ChatGPT Agent Suite Codex Optimization [021-codex-orchestrate/spec]"
description: "The ChatGPT agent set had drift across files: orchestration was optimized in isolation while sibling agent documents still contained inconsistent thresholds, naming, fast-path b..."
trigger_phrases:
  - "feature"
  - "specification"
  - "chatgpt"
  - "agent"
  - "suite"
  - "spec"
  - "021"
  - "codex"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: ChatGPT Agent Suite Codex Optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The ChatGPT agent set had drift across files: orchestration was optimized in isolation while sibling agent documents still contained inconsistent thresholds, naming, fast-path behavior, and completion rules. This spec expands from a single-file orchestrate update to a full eight-file audit and consistency pass under `.opencode/agent/chatgpt/` so the whole ChatGPT profile follows the same Codex-optimized operating model.

**Key Decisions**: consistency-first cross-agent edits; contradiction cleanup between orchestration and leaf-agent rules; Codex-calibrated defaults maintained across context/debug/handover/research/review/speckit/write/orchestrate.

**Critical Dependencies**: existing NDP depth constraints, @speckit exclusivity boundaries, and memory/validation gate behavior remain intact.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-18 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The ChatGPT agent profile had contradiction and drift issues after targeted orchestrate optimization: sibling files still encoded earlier assumptions (single mode only, mismatched thresholds, outdated validation wording, inconsistent exception handling). This created policy ambiguity and weakened reliability of orchestrated execution.

### Purpose
Apply a suite-level Codex optimization pass across all ChatGPT agent files to reduce contradictions, align dispatch/completion expectations, and preserve safety and validation controls.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit and update all 8 files under `.opencode/agent/chatgpt/`
- Resolve contradictions between orchestrator policy and leaf-agent instructions
- Normalize Codex optimization language and threshold behavior across the agent set
- Ensure consistency across context/debug/handover/research/review/speckit/write/orchestrate
- Keep safety gates, dispatch boundaries, and template authority constraints intact

### Out of Scope
- Changes to `.opencode/agent/orchestrate.md` or `.opencode/agent/copilot/*.md`
- Runtime tooling changes, parser changes, or MCP/server implementation
- Non-ChatGPT agent definitions outside `.opencode/agent/chatgpt/`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/chatgpt/context.md` | Modify | Add adaptive retrieval modes and structured budget alignment |
| `.opencode/agent/chatgpt/debug.md` | Modify | Clarify low-complexity fast path with explicit minimal analysis step |
| `.opencode/agent/chatgpt/handover.md` | Modify | Align fast-path/tool-call bounds and context-package wording |
| `.opencode/agent/chatgpt/research.md` | Modify | Add trivial-research exception semantics for memory-save step |
| `.opencode/agent/chatgpt/review.md` | Modify | Codex model consistency and blocker-vs-required rule clarity |
| `.opencode/agent/chatgpt/speckit.md` | Modify | Correct level semantics and validation completion wording |
| `.opencode/agent/chatgpt/write.md` | Modify | Enforce template-first fast path and mode-aware DQI thresholds |
| `.opencode/agent/chatgpt/orchestrate.md` | Modify | Direct-first dispatch profile, DEG, and CWB/TCB threshold updates |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Expand optimization scope to all ChatGPT agent files | All 8 files under `.opencode/agent/chatgpt/` audited and updated where needed |
| REQ-002 | Fix contradiction drift across agent definitions | No unresolved policy contradictions between orchestrate and sibling agent guidance |
| REQ-003 | Keep Codex optimization posture consistent | Direct-first, threshold, and fast-path guidance is compatible across agents |
| REQ-004 | Preserve dispatch/safety invariants | NDP and LEAF constraints remain unweakened across updates |
| REQ-005 | Preserve agent authority boundaries | @speckit exclusivity and spec-folder boundaries remain explicit and intact |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Standardize completion/validation semantics | Exit-code language and completion criteria are internally consistent in updated files |
| REQ-007 | Align fast-path wording | Fast paths are explicit about what can be skipped vs required hard gates |
| REQ-008 | Preserve template and anchor integrity in spec artifacts | All spec docs keep template headers and valid ANCHOR pairs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 8 ChatGPT agent files show the audited Codex-consistent policy posture
- **SC-002**: Cross-agent contradiction fixes are documented and traceable in checklist evidence
- **SC-003**: Orchestrate CWB/TCB/DEG updates remain consistent with leaf-agent expectations
- **SC-004**: NDP and LEAF safety constraints remain intact and unchanged in behavior
- **SC-005**: Checklist P0/P1 verification is completed with explicit `[EVIDENCE: file:line - reason]` citations
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cross-file edits introduce new wording drift | Medium | Run explicit contradiction sweep across all eight files |
| Risk | Over-normalization weakens file-specific behavior | Medium | Keep agent-local intent while aligning only shared invariants |
| Risk | NDP constraints accidentally modified while editing orchestrate policy | High | Re-verify NDP/LEAF wording after suite-level edits |
| Dependency | Existing agent files already changed in working tree | Medium | Limit edits to documentation synchronization in this spec folder |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Dispatch policy should reduce orchestration overhead for low/medium tasks
- **NFR-P02**: Dispatch decision latency should not increase from added gating text

### Reliability
- **NFR-R01**: NDP safety posture remains unchanged
- **NFR-R02**: Failure-handling section still provides deterministic fallback actions

### Maintainability
- **NFR-M01**: New policy language remains section-local and easy to audit
- **NFR-M02**: Threshold values are referenced consistently in all linked sections
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Dispatch Edge Cases
- Large multi-domain requests with independent streams: allow expansion beyond default ceiling using explicit criteria
- Single-domain but many files: keep work bundled if shared objective and dependencies are tight
- Recovery from aborted tasks: avoid reflexive over-splitting; prefer smallest viable fan-out

### Consistency Edge Cases
- Retrieval mode policy updated in `context.md` but not reflected in integration behavior
- Fast-path exceptions allow skipping required validation/template gates
- Old blocker semantics conflict with pass/fail guidance in review and write flows
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Eight policy files plus six Level 3 artifacts updated |
| Risk | 20/25 | Contradiction fixes can affect routing and verification behavior |
| Research | 15/20 | Requires cross-file consistency mapping and evidence sweep |
| Multi-Agent | 6/15 | No subagent dispatch used per explicit user constraint |
| Coordination | 13/15 | Cross-agent alignment + checklist evidence + validation run |
| **Total** | **76/100** | **Level 3 retained; expanded scope justified** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Cross-agent policy contradictions remain after partial edits | H | M | Complete 8-file contradiction audit and evidence checklist |
| R-002 | Threshold updates in orchestrate diverge from sibling docs | M | M | Verify consistency references in checklist P0/P1 items |
| R-003 | Validation/completion semantics differ across docs | M | M | Normalize wording and verify with line-cited evidence |
| R-004 | NDP invariants weakened by accidental edits | H | L | Verify NDP section remains unchanged during checklist verification |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Consistent Cross-Agent Behavior (Priority: P0)

**As a** maintainer of ChatGPT agents, **I want** all agent files to apply the same Codex optimization posture, **so that** orchestration behavior is predictable and contradiction-free.

**Acceptance Criteria**:
1. Given a policy change in one ChatGPT agent file, when related files are reviewed, then contradictory guidance is removed or aligned.
2. Given orchestrate thresholds and routing guidance, when sibling files are read, then no direct conflicts remain.

---

### US-002: Preserve Safety While Expanding Scope (Priority: P0)

**As a** maintainer, **I want** suite-wide edits to keep depth and authority controls intact, **so that** consistency work does not weaken guardrails.

**Acceptance Criteria**:
1. Given the updated policy document, when NDP rules are reviewed, then maximum depth and LEAF constraints are unchanged.
2. Given completion checks, when quality gates are evaluated, then output review and failure handling remain present and consistent.

---

### US-003: Contradiction Cleanup and Completion Clarity (Priority: P1)

**As an** agent author, **I want** completion and exception semantics aligned across write/research/review/speckit/handover/context, **so that** execution paths are deterministic.

**Acceptance Criteria**:
1. Given fast-path rules, when low-complexity mode is used, then mandatory gates are still explicit.
2. Given completion criteria, when pass/fail is evaluated, then blocker vs required semantics are unambiguous.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 12. ACCEPTANCE SCENARIOS

1. **Given** the ChatGPT agent folder, **when** scope is reviewed, **then** all 8 files are included in the optimization audit.
2. **Given** context/research/write/review/speckit/handover docs, **when** fast-path and completion semantics are checked, **then** contradictions are resolved.
3. **Given** orchestrate CWB/TCB/DEG updates, **when** adjacent policy docs are reviewed, **then** consistency is maintained.
4. **Given** NDP safety rules, **when** post-edit verification runs, **then** depth max (0-1-2) and LEAF non-dispatch constraints remain unchanged.
5. **Given** checklist verification, **when** P0/P1 entries are reviewed, **then** each has `[EVIDENCE: file:line - reason]` citations.
6. **Given** final spec validation, **when** `validate.sh` runs, **then** no ERROR-level failures are present.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

- None. User direction is explicit on scope, mode, and spec path.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

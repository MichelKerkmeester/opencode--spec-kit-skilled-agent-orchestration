---
title: "Feature Specification: Plan-to-Implementation Gate Bypass [02--system-spec-kit/z_archive/017-command-adherence/spec]"
description: "Fix critical gate bypass behavior where AI agents skip all mandatory gates (Gate 1 understanding, Gate 2 skill routing, Gate 3 spec folder question) when users request implement..."
trigger_phrases:
  - "feature"
  - "specification"
  - "plan"
  - "implementation"
  - "gate"
  - "spec"
  - "017"
  - "command"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Plan-to-Implementation Gate Bypass Fix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Fix critical gate bypass behavior where AI agents skip all mandatory gates (Gate 1 understanding, Gate 2 skill routing, Gate 3 spec folder question) when users request implementation via free text after completing `/spec_kit:plan` workflow. Root cause: three compounding factors including lack of phase boundary concept, over-generalization of Memory Save Rule, and weak plan termination enforcement.

**Key Decisions**: Add PHASE BOUNDARY RULE to Gate 3, scope Memory Save Rule carry-over to memory saves only, add enforcement blocks to plan command YAMLs

**Critical Dependencies**: CLAUDE.md gate system, spec_kit_plan_*.yaml termination sections, plan.md command documentation
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-02-17 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

When a `/spec_kit:plan` workflow completes and the user says "Implement the following plan:" as free text (not via `/spec_kit:implement`), the AI agent skips ALL mandatory gates (Gate 1 understanding, Gate 2 skill routing, Gate 3 spec folder question) and immediately begins writing code. This violates the CLAUDE.md mandatory gate system and bypasses critical safety checks designed to prevent undocumented implementations.

### Purpose

Enforce gate re-evaluation when transitioning from plan workflow phase to implementation workflow phase, ensuring all safety checks are performed regardless of whether the user invokes commands explicitly or uses free-text requests.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add PHASE BOUNDARY RULE to CLAUDE.md Gate 3 block
- Scope Memory Save Rule "do NOT re-ask" to memory saves only (not implementations)
- Add enforcement blocks to `spec_kit_plan_auto.yaml` and `spec_kit_plan_confirm.yaml`
- Add enforcement note to `plan.md` command documentation
- Verify fix with manual test (plan → free-text implement → should route through command)

### Out of Scope
- Modifying `/spec_kit:complete` workflow (handles plan+implement in single phase)
- Adding formal "gate phase" concept to CLAUDE.md (deferred to future revision)
- Changing existing Memory Save Rule behavior (intentionally preserved)
- Modifying command invocation infrastructure beyond termination sections

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `CLAUDE.md` (Gate 3 block, line ~147) | Modify | Add PHASE BOUNDARY RULE: Gate 3 answers don't carry over across workflow phases |
| `CLAUDE.md` (Memory Save Rule, line ~184-186) | Modify | Scope "do NOT re-ask" explicitly to memory saves only |
| `.opencode/command/spec_kit/spec_kit_plan_auto.yaml` (line 425-428) | Modify | Add enforcement block: free-text implement requests MUST route through `/spec_kit:implement` |
| `.opencode/command/spec_kit/spec_kit_plan_confirm.yaml` (line 477-480) | Modify | Add enforcement block (same as auto version) |
| `.opencode/command/spec_kit/plan.md` (after line 121) | Modify | Add enforcement note about plan/implement being separate gate-checked phases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Gate 3 re-evaluation on phase transition | When plan workflow ends and user says "implement this", agent re-evaluates Gate 3 (doesn't assume prior answer) |
| REQ-002 | Free-text implement routing | Free-text "implement" requests after `/spec_kit:plan` route through `/spec_kit:implement` command (not direct coding) |
| REQ-003 | Memory Save Rule preserved | Existing Memory Save Rule behavior unchanged (still uses session spec folder for memory saves without re-asking) |
| REQ-004 | No regression in complete flow | `/spec_kit:complete` workflow remains unchanged (plan+implement in one phase is valid) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Documentation synchronization | All 5 files updated consistently with new phase boundary concept |
| REQ-006 | Clear enforcement messaging | Agent provides clear reasoning when routing free-text implements through command |
| REQ-007 | Command boundary language consistency | CLAUDE.md, plan YAMLs, and plan.md use the same phase-boundary terminology |
| REQ-008 | Verification evidence completeness | Manual verification artifacts capture gate re-check, routing, and no-regression outcomes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 4A. ACCEPTANCE SCENARIOS

- **Given** `/spec_kit:plan` is complete, **When** user says "Implement the following plan:", **Then** Gate 3 is re-evaluated before implementation.
- **Given** a free-text implement request after plan, **When** agent responds, **Then** it routes through `/spec_kit:implement` instead of direct coding.
- **Given** Gate 3 was answered during plan phase, **When** implementation starts, **Then** prior Gate 3 answers do not auto-carry into the new phase.
- **Given** a memory-save request in the same session, **When** `/memory:save` runs, **Then** the previously established spec folder is reused without re-asking.
- **Given** `/spec_kit:complete` handles plan+implement in one workflow, **When** implementation begins inside that workflow, **Then** no extra phase-boundary Gate 3 prompt is introduced.
- **Given** user phrasing varies ("go ahead", "start coding"), **When** intent is implementation, **Then** routing and gate enforcement remain consistent.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After `/spec_kit:plan` completes, saying "implement this" triggers Gate 3 re-evaluation (not direct coding)
- **SC-002**: Agent routes free-text implement requests through `/spec_kit:implement` command with clear explanation
- **SC-003**: Existing Memory Save Rule behavior unchanged (still uses session spec folder for memory saves)
- **SC-004**: No regression in `/spec_kit:complete` flow (which handles plan+implement in one workflow)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | CLAUDE.md gate system | Blocks fix if gates are restructured | Target specific line ranges, minimize coupling |
| Risk | Breaking Memory Save convenience | User annoyance if re-asked for spec folder on every save | Explicitly scope carry-over to memory saves only |
| Risk | Over-aggressive enforcement | Agent refuses valid direct implement requests | Clear exceptions for `/spec_kit:complete` |
| Risk | Unclear phase boundary definition | Agent confusion about when phases end | Explicit termination markers in YAML files |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No measurable performance impact (instruction-only change)

### Security
- **NFR-S01**: Gate enforcement prevents undocumented implementations (critical safety feature)

### Reliability
- **NFR-R01**: Fix must be robust across different user phrasing ("implement", "go ahead", "start coding")
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## 8. EDGE CASES

### Data Boundaries
- User says "implement" during `/spec_kit:complete` workflow: Should NOT trigger re-check (single-phase workflow)
- User explicitly invokes `/spec_kit:implement` after plan: Should proceed normally (command already enforces gates)
- User says "implement later": Should NOT trigger routing (not an action request)

### Error Scenarios
- Agent misinterprets "implement" as plan request: Enforcement block should clarify intent
- User bypasses command with "just write the code": Agent should still route through command (enforcement is mandatory)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: 5, LOC: ~40 (instruction text), Systems: 1 (gate system) |
| Risk | 18/25 | Critical safety system, affects all workflows, potential UX regression |
| Research | 12/20 | Root cause analysis required, multi-file coordination |
| Multi-Agent | 0/15 | Single workstream |
| Coordination | 8/15 | 5 files, but same conceptual change across all |
| **Total** | **48/100** | **Level 3 (architectural decision + safety-critical)** |
<!-- /ANCHOR:complexity -->

**Justification for Level 3**: While LOC is small (~40 lines), this changes the core gate system's behavior and has critical safety implications. The bug fix requires architectural documentation (ADRs) to explain the phase boundary concept and why three separate changes are needed to address the root cause.

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Over-generalized enforcement breaks `/spec_kit:complete` | H | M | Explicit exception for single-phase workflows |
| R-002 | Memory Save Rule change causes user re-prompts | M | L | Scope carry-over only to memory saves (no behavior change) |
| R-003 | Agent confusion about phase boundaries | M | M | Clear termination markers in YAML enforcement blocks |
| R-004 | Users frustrated by forced routing | L | M | Provide clear reasoning when routing ("for safety, re-checking gates") |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Gate Re-evaluation on Phase Transition (Priority: P0)

**As a** user completing a `/spec_kit:plan` workflow, **I want** the agent to re-check gates when I request implementation, **so that** I'm prompted for spec folder confirmation and implementation doesn't proceed undocumented.

**Acceptance Criteria**:
1. Given completed `/spec_kit:plan`, When I say "Implement the following plan:", Then agent asks Gate 3 spec folder question (A/B/C/D) instead of writing code
2. Given Gate 3 answer during plan phase, When I request implementation, Then agent treats it as a new workflow phase requiring gate re-evaluation

---

### US-002: Free-Text Implement Routing (Priority: P0)

**As a** user requesting implementation via free text, **I want** the agent to route me through `/spec_kit:implement` command, **so that** proper gate checks are enforced consistently.

**Acceptance Criteria**:
1. Given free-text "implement this" after plan completion, When agent processes the request, Then it routes through `/spec_kit:implement` command instead of direct coding
2. Given routing enforcement, When agent explains the routing, Then it provides clear reasoning ("Plan and implementation are separate gate-checked phases")

---

### US-003: Memory Save Convenience Preserved (Priority: P0)

**As a** user with an active spec folder, **I want** memory saves to use the session spec folder automatically, **so that** I'm not re-asked the spec folder question for every save.

**Acceptance Criteria**:
1. Given Gate 3 answered during current session, When I run `/memory:save`, Then agent uses the session spec folder without re-asking
2. Given Memory Save Rule scoping, When implementation phase starts, Then memory saves remain unaffected (still use session folder)

---

### US-004: No Regression in Complete Flow (Priority: P0)

**As a** user running `/spec_kit:complete`, **I want** the plan+implement flow to work unchanged, **so that** single-phase workflows remain efficient.

**Acceptance Criteria**:
1. Given `/spec_kit:complete` invocation, When agent transitions from plan to implement, Then no Gate 3 re-evaluation occurs (single workflow phase)
2. Given enforcement blocks, When agent detects `/spec_kit:complete` context, Then phase boundary rule does NOT apply
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- **Q1**: Should we add a formal "gate phase" concept to CLAUDE.md for future-proofing? **Answer**: Deferred to P2 (future revision), current fix uses explicit phase boundary rule
- **Q2**: What about other command workflows (e.g., `/spec_kit:research` → implement)? **Answer**: Same pattern applies, but lower priority (plan → implement is most common)
- **Q3**: Should enforcement blocks use regex pattern matching for user intent? **Answer**: No, natural language detection is sufficient ("implement", "go ahead", "start coding")
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC (~250 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
- Bug fix spec (pre-implementation documentation)
-->

---
title: "Feature Specification: Sub-Agent Delegation for Memory/Handover Commands [005-subagent-delegation/spec]"
description: "Refactor /spec_kit:handover and /memory:save commands to delegate execution work to sub-agents."
trigger_phrases:
  - "feature"
  - "specification"
  - "sub"
  - "agent"
  - "delegation"
  - "spec"
  - "005"
  - "subagent"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Feature Specification: Sub-Agent Delegation for Memory/Handover Commands

Refactor `/spec_kit:handover` and `/memory:save` commands to delegate execution work to sub-agents.

---

<!-- ANCHOR:metadata -->
## 1. OBJECTIVE

### Metadata
- **Category**: Enhancement
- **Level**: 2
- **Tags**: commands, sub-agent, task-delegation, token-efficiency
- **Priority**: P1
- **Feature Branch**: `005-subagent-delegation`
- **Created**: 2026-01-01
- **Status**: In Progress
- **Input**: User request to delegate actual saving/handover work to sub-agents
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
### Problem Statement
Currently, `/spec_kit:handover` and `/memory:save` commands execute all work in the main agent context:
- Token-intensive context analysis happens in main conversation
- Heavy file generation blocks main agent responsiveness
- No parallel execution capability
- Main agent context fills quickly during complex saves

### Purpose
Delegate execution-heavy work (context gathering, file generation, script execution) to sub-agents via the Task tool, keeping the main agent lightweight and responsive.

### Assumptions
- Task tool is available in most OpenCode environments
- Sub-agents (general type) can access required tools (Read, Bash, etc.)
- Fallback to direct execution ensures commands always work
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 2. SCOPE

### In Scope
- Update `/spec_kit:handover` command to delegate Steps 1-3 to sub-agent
- Update `/memory:save` command to delegate Steps 2-5 to sub-agent
- Implement fallback logic when Task tool unavailable
- Maintain existing phase validation in main agent
- Ensure commands produce identical output

### Out of Scope
- Changes to other commands
- Changes to generate-context.js script
- Changes to handover.md template
- Performance benchmarking (deferred)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:user-stories -->
## 3. USERS & STORIES

### User Story 1 - Token-Efficient Save (Priority: P1)

As a user, I want memory saves to consume fewer tokens in my main conversation so that I can continue working without context exhaustion.

**Why This Priority**: P1 because token efficiency directly impacts usability during long sessions.

**Independent Test**: Can verify by checking main agent only handles validation/output, not content generation.

**Acceptance Scenarios**:
1. **Given** user runs `/memory:save 005-memory`, **When** Task tool is available, **Then** sub-agent executes context analysis and file generation
2. **Given** user runs `/memory:save`, **When** Task tool fails or times out, **Then** main agent executes directly as fallback

### User Story 2 - Consistent Handover (Priority: P1)

As a user, I want handover creation to be delegated to a sub-agent while still receiving the same output format.

**Acceptance Scenarios**:
1. **Given** user runs `/spec_kit:handover .opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive`, **When** phases pass, **Then** sub-agent creates handover.md and returns file path
2. **Given** handover sub-agent fails, **When** fallback triggers, **Then** main agent creates handover directly
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:requirements -->
## 4. FUNCTIONAL REQUIREMENTS

- **REQ-FUNC-001**: Main agent MUST handle all phase validation (Phase 1, 1B, 2) directly
- **REQ-FUNC-002**: Main agent MUST dispatch execution work to sub-agent via Task tool
- **REQ-FUNC-003**: Sub-agent MUST receive validated inputs (spec_path, detection_method, etc.)
- **REQ-FUNC-004**: Sub-agent MUST return structured result (file_path, status, metadata)
- **REQ-FUNC-005**: Main agent MUST display results to user after sub-agent completes
- **REQ-FUNC-006**: Fallback MUST execute if Task tool returns error or is unavailable
- **REQ-FUNC-007**: Fallback MUST produce identical output to sub-agent path

### Traceability Mapping

| User Story | Related Requirements |
|------------|---------------------|
| Story 1 - Token-Efficient Save | REQ-FUNC-002, REQ-FUNC-003, REQ-FUNC-006 |
| Story 2 - Consistent Handover | REQ-FUNC-001, REQ-FUNC-004, REQ-FUNC-005 |
<!-- /ANCHOR:requirements -->

---

## 5. ARCHITECTURE

### Main Agent Responsibilities
```
Main Agent:
├── Parse command arguments
├── Execute PHASES (validation, user interaction)
├── IF all phases pass:
│   ├── TRY: Dispatch to sub-agent via Task tool
│   │   ├── Pass validated inputs
│   │   ├── Wait for completion
│   │   └── Receive structured result
│   ├── CATCH: Fallback to direct execution
│   └── Display results to user
```

### Sub-Agent Responsibilities
```
Sub-Agent (general type):
├── Receive inputs from main agent
├── Execute work:
│   ├── handover: Gather context, create handover.md
│   └── save: Analyze context, build JSON, run script
├── Return structured result:
│   ├── status: OK | FAIL
│   ├── file_path: created file location
│   └── metadata: anchors, triggers, attempt_number, etc.
```

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- [ ] SC-001: `/spec_kit:handover` delegates to sub-agent when Task available
- [ ] SC-002: `/memory:save` delegates to sub-agent when Task available
- [ ] SC-003: Both commands fall back correctly when Task unavailable
- [ ] SC-004: Output format unchanged from previous behavior
- [ ] SC-005: Main agent token usage reduced (qualitative verification)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:edge-cases -->
## 7. EDGE CASES

### Task Tool Scenarios
- What happens when Task tool times out? → Fallback to direct execution
- What happens when sub-agent returns error? → Fallback with error context
- What happens when sub-agent doesn't have required tools? → Fallback

### User Interaction
- What happens when user cancels during sub-agent execution? → Sub-agent terminates, main agent shows cancelled status
<!-- /ANCHOR:edge-cases -->

---

## RELATED DOCUMENTS

- **Commands**: `.opencode/command/spec_kit/handover.md`, `.opencode/command/memory/save.md`
- **Implementation Plan**: See `plan.md`
- **Validation Checklist**: See `checklist.md`

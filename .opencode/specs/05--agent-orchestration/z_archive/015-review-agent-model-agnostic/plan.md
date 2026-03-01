---
title: "Implementation Plan: Review Agent Model-Agnostic [015-review-agent-model-agnostic/plan]"
description: "This implementation removes the hardcoded model: github-copilot/claude-opus-4.6 line from the review agent's YAML frontmatter, enabling the agent to inherit the model from its d..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "review"
  - "agent"
  - "model"
  - "015"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Review Agent Model-Agnostic

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (YAML frontmatter) |
| **Framework** | OpenCode Agent Framework |
| **Storage** | None |
| **Testing** | Manual verification |

### Overview
This implementation removes the hardcoded `model: github-copilot/claude-opus-4.6` line from the review agent's YAML frontmatter, enabling the agent to inherit the model from its dispatching parent. This follows the pattern used by `orchestrate.md` where no `model:` field allows inheritance.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (single line removal)
- [x] Success criteria measurable (frontmatter has no model field)
- [x] Dependencies identified (none - standalone file edit)

### Definition of Done
- [x] Line 5 removed from `.opencode/agent/review.md`
- [x] YAML frontmatter validates successfully
- [x] Manual test: review agent dispatched from different parent models
- [x] Docs updated (spec/plan/tasks)

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Agent Framework Configuration Pattern

### Key Components
- **review.md YAML frontmatter**: Defines agent metadata and configuration
- **Model inheritance mechanism**: When no `model:` field exists, inherits from dispatching agent

### Data Flow
1. Parent agent (e.g., orchestrate, general) dispatches review sub-agent
2. Review agent frontmatter parsed - no `model:` field found
3. Review agent inherits parent's model configuration
4. Review agent executes with inherited model

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Investigation complete (confirmed single line removal needed)
- [x] Spec folder created
- [x] Branch identified: `015-review-agent-model-agnostic`

### Phase 2: Core Implementation
- [x] Read `.opencode/agent/review.md` to verify line 5 content
- [x] Remove line 5: `model: github-copilot/claude-opus-4.6`
- [x] Verify YAML frontmatter structure remains intact

### Phase 3: Verification
- [x] Parse YAML frontmatter to confirm validity
- [x] Manual test: Dispatch review agent from parent using different models
- [x] Confirm no references to specific models remain in body text
- [x] Update implementation-summary.md

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | YAML frontmatter parsing | YAML validator |
| Integration | Agent dispatch from multiple parent models | Manual dispatch testing |
| Manual | Review agent executes correctly | OpenCode agent system |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | N/A | Green | No dependencies - standalone file edit |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Review agent fails to dispatch or exhibits unexpected behavior
- **Procedure**: Re-add line 5 `model: github-copilot/claude-opus-4.6` to frontmatter

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

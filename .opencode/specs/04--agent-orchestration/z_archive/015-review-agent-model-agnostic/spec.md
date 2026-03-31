---
title: "Feature Specification: Review Agent [04--agent-orchestration/z_archive/015-review-agent-model-agnostic/spec]"
description: "The review agent (review.md) currently has a hardcoded model reference (model: github-copilot/claude-opus-4.6) in its YAML frontmatter (line 5). This prevents the review sub-age..."
trigger_phrases:
  - "feature"
  - "specification"
  - "review"
  - "agent"
  - "model"
  - "spec"
  - "015"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Review Agent Model-Agnostic

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-02-15 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review agent (`review.md`) currently has a hardcoded model reference (`model: github-copilot/claude-opus-4.6`) in its YAML frontmatter (line 5). This prevents the review sub-agent from inheriting the model used by the dispatching parent agent, creating inconsistency when different models are used by orchestrators.

### Purpose
Enable the review agent to inherit the model from its dispatching parent agent by removing the hardcoded model reference, following the same pattern used by other agents like `orchestrate.md`.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove line 5 (`model: github-copilot/claude-opus-4.6`) from `.opencode/agent/review.md` frontmatter
- Verify body text remains model-agnostic (already confirmed via investigation)

### Out of Scope
- Other agents with hardcoded models (context, debug, research, handover, speckit, write) - separate refactor if needed
- YAML asset files referencing `model: opus` for orchestrator dispatch modes - unrelated to review agent
- Command files in `.opencode/command/spec_kit/` - confirmed no review-model references

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/review.md` | Modify | Remove line 5: `model: github-copilot/claude-opus-4.6` |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove hardcoded model reference from review.md frontmatter | Line 5 (`model: github-copilot/claude-opus-4.6`) is deleted |
| REQ-002 | Verify YAML frontmatter remains valid after deletion | Frontmatter parses without errors |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Confirm review agent body text is model-agnostic | No prose mentions of specific models (Opus/Sonnet/Haiku) in agent instructions |
| REQ-004 | Manual verification that review agent inherits parent model | Dispatched from different parent models → review uses inherited model |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Review agent frontmatter contains no `model:` field, enabling model inheritance
- **SC-002**: Review agent functions correctly when dispatched by agents using different models

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Breaking agent dispatch if frontmatter malformed | High | Validate YAML syntax after edit |
| Dependency | Parent agent must have model defined | Low | Standard pattern - all dispatching agents have models |
| Risk | Unexpected behavior differences across models | Medium | Manual testing with multiple parent models |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should we apply this pattern to other agents (context, debug, research, etc.) in a follow-up?
- Is there a system-wide test suite for agent dispatch that should be run?

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

---
title: "Feature Specification: Agent Sonnet 4.6 Upgrade [020-agent-sonnet-upgrade/spec]"
description: "Multiple agents across the Copilot and Claude Code agent systems were pinned to outdated or mismatched models: context and handover agents used haiku-4.5 (insufficient reasoning..."
trigger_phrases:
  - "feature"
  - "specification"
  - "agent"
  - "sonnet"
  - "upgrade"
  - "spec"
  - "020"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Agent Sonnet 4.6 Upgrade

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Partially Reverted |
| **Created** | 2026-02-18 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Multiple agents across the Copilot and Claude Code agent systems were pinned to outdated or mismatched models: context and handover agents used `haiku-4.5` (insufficient reasoning depth for retrieval and session work), speckit and write used `sonnet-4.5` (missed 4.6 improvements), and research/debug hard-pinned `opus-4.6` which prevented flexible model dispatch by the orchestrator. The `review.md` Copilot agent had no model field and contained a stale "keep model-agnostic" comment that no longer reflected intended behaviour.

### Purpose

Upgrade all agent model assignments to `claude-sonnet-4-6` as the standard fleet model, and enable flexible dispatch for research and debug by removing their hard-pinned model fields so they inherit from the dispatching parent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Upgrade five Copilot agents to `github-copilot/claude-sonnet-4-6`: context, handover, review, speckit, write
- Remove hard-pinned `model:` field from Copilot research and debug agents (parent model inheritance)
- Upgrade three Claude Code agents to `sonnet`: context, handover, review
- Update stale convention comment in `copilot/review.md`

### Out of Scope

- Changes to agent behaviour, prompts, or capabilities beyond the model field
- Orchestrate, general, debug, or research agent behaviour changes
- Non-agent configuration files

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/copilot/context.md` | Modify | `haiku-4.5` → `sonnet-4-6` |
| `.opencode/agent/copilot/handover.md` | Modify | `haiku-4.5` → `sonnet-4-6` |
| `.opencode/agent/copilot/review.md` | Modify | Add model field `sonnet-4-6`; remove stale comment |
| `.opencode/agent/copilot/speckit.md` | Modify | `sonnet-4.5` → `sonnet-4-6` |
| `.opencode/agent/copilot/write.md` | Modify | `sonnet-4.5` → `sonnet-4-6` |
| `.opencode/agent/copilot/research.md` | Modify | Delete `model:` line (opus-4.6 → inherit) |
| `.opencode/agent/copilot/debug.md` | Modify | Delete `model:` line (opus-4.6 → inherit) |
| `.claude/agents/context.md` | Modify | `haiku` → `sonnet` |
| `.claude/agents/handover.md` | Modify | `haiku` → `sonnet` |
| `.claude/agents/review.md` | Modify | `opus` → `sonnet` |

> **Note (2026-03-21):** The `.opencode/agent/copilot/` directory no longer exists — removed after implementation. The seven files listed above under `.opencode/agent/copilot/` are therefore no longer present in the repository. Status updated to "Partially Reverted".
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All five Copilot fleet agents set to `github-copilot/claude-sonnet-4-6` | Model field present and correct in context, handover, review, speckit, write |
| REQ-002 | Copilot research and debug agents have no hard-pinned model | `model:` line absent from both files |
| REQ-003 | All three Claude Code agents upgraded to `sonnet` | Model field updated in `.claude/agents/` context, handover, review |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Stale comment in `copilot/review.md` removed or updated | Comment no longer references "keep model-agnostic" convention |
| REQ-005 | Changelog entry created for v2.1.3.0 | Entry present at `.opencode/changelog/00--opencode-environment/v2.1.3.0.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 10 agent files reflect the intended model assignment (pinned or inherited) with no leftover stale values
- **SC-002**: Copilot agent fleet operates on a uniform `claude-sonnet-4-6` base; research and debug inherit flexibly from dispatch parent
- **SC-003**: Changelog published and release tagged as v2.1.3.0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Sonnet-4-6 not yet available in all Copilot environments | Agents fail to load correct model | Verified model ID format matches platform spec before applying |
| Risk | Removing `model:` from research/debug could inherit an unexpected model | Reduced capability if orchestrator passes a lighter model | Acceptable trade-off; dispatch chain controls selection |
| Dependency | GitHub Copilot model availability | `github-copilot/claude-sonnet-4-6` must be a valid model ID | Confirmed via platform documentation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: No performance regression — model field changes are metadata only; no runtime overhead introduced

### Security

- **NFR-S01**: No secrets, tokens, or credentials modified
- **NFR-S02**: Agent files remain read-only configuration; no executable code changed

### Reliability

- **NFR-R01**: All agents load successfully after upgrade — validated by manual inspection of model field syntax
- **NFR-R02**: Research and debug agents continue to function with inherited model; no null-model errors
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty model field: Not applicable — all files either have a valid model string or no model line (for inheritance)
- Invalid model ID: Misspelled ID would silently fall back to platform default; verified against known-good IDs before applying
- Missing parent model: If dispatching agent has no model, research/debug inherit platform default (acceptable)

### Error Scenarios

- Agent file not found: All 10 target files confirmed present before modification
- Partial upgrade: Addressed by applying all changes in the same session and validating all 10 files after

### State Transitions

- Pre-upgrade state: Mixed model versions (haiku-4.5, sonnet-4.5, opus-4.6) across fleet
- Post-upgrade state: Uniform `claude-sonnet-4-6` for fleet; inherited for research/debug
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 10 files, 2 directories, metadata-only changes |
| Risk | 8/25 | Low code risk; model availability dependency |
| Research | 5/20 | Model ID verification needed; no novel patterns |
| **Total** | **23/70** | **Level 2 — multi-directory, QA checklist warranted** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. All decisions resolved at implementation time.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

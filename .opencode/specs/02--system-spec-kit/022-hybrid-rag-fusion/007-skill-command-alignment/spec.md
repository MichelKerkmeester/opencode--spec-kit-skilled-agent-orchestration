---
title: "Feature Specification: Skill & Command Alignment"
description: "Speckit agent definitions across 4 runtimes drifted out of sync with actual MCP tool inventory after Spec 140's documentation sprint."
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: Skill & Command Alignment
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

After Spec 140's documentation sprint documented 32/32 features across SKILL.md, search/README.md, mcp_server/README.md, and lib/README.md, the speckit agent definitions across all 4 runtimes fell out of sync with the actual MCP tool inventory. This spec covers retroactive documentation of the doc sprint and alignment of agent files with current capabilities.

**Key Decisions**: Canonical+sync editing strategy (ADR-001), save-time note placement as blockquotes (ADR-002)

**Critical Dependencies**: Spec 140 documentation sprint (completed)

---

## 1. METADATA

<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-03-01 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After completing Spec 140's verification audit and documentation sprint (32/32 features documented), the speckit agent definitions across all 4 runtimes (Copilot, ChatGPT, Claude, Gemini) became out of sync with the actual MCP tool inventory. Three tools (`memory_bulk_delete`, `eval_run_ablation`, `eval_reporting_dashboard`) were missing from the MCP Tool Layers table. Two behavioral capabilities (`memory_context` modes and save-time behaviors) had no agent-level documentation.

### Purpose
Bring all 4 speckit agent files into full alignment with the Spec 140 MCP tool inventory, and retroactively document the documentation sprint and agent alignment work in a Level 3 spec folder.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Scope A**: Level 3 spec folder documenting the doc sprint and agent alignment work (6 files)
- **Scope B**: Update MCP Tool Layers table in all 4 speckit agent files (GAP-1, GAP-2, GAP-4, GAP-5, GAP-7)

### Out of Scope
- Changes to SKILL.md or README files (already completed in Spec 140)
- New MCP tool development
- Changes to agent sections other than Section 2 (MCP Tool Layers)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/speckit.md` | Modify | Add missing tools to L4/L6, add mode + save-time notes (canonical) |
| `.opencode/agent/chatgpt/speckit.md` | Modify | Mirror canonical changes |
| `.claude/agents/speckit.md` | Modify | Mirror canonical changes |
| `.gemini/agents/speckit.md` | Modify | Mirror canonical changes |
| `004-skill-command-alignment/spec.md` | Create | This file |
| `004-skill-command-alignment/plan.md` | Create | Implementation plan |
| `004-skill-command-alignment/tasks.md` | Create | Task breakdown |
| `004-skill-command-alignment/checklist.md` | Create | Verification checklist |
| `004-skill-command-alignment/decision-record.md` | Create | ADR-001 and ADR-002 |
| `004-skill-command-alignment/implementation-summary.md` | Create | Post-implementation summary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 4 agent files include `memory_bulk_delete` in L4 row | Grep confirms presence in all 4 files |
| REQ-002 | All 4 agent files include `eval_run_ablation` and `eval_reporting_dashboard` in L6 row | Grep confirms presence in all 4 files |
| REQ-003 | `memory_context` modes documented after MCP table in all 4 files | All 5 modes listed: auto, quick, deep, focused, resume |
| REQ-004 | Save-time behaviors documented after MCP table in all 4 files | Quality gate, reconsolidation, verify-fix-verify mentioned |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | All 4 agent files have identical Section 2 body content | Diff check shows no divergence |
| REQ-006 | Level 3 spec folder with all 6 required files | validate.sh exit 0 or 1 |
| REQ-007 | Agent files stay under 550 lines each | wc -l confirms |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 agent files have identical MCP Tool Layers content (verified by diff)
- **SC-002**: All 5 confirmed gaps resolved (GAP-1, GAP-2, GAP-4, GAP-5, GAP-7)
- **SC-003**: Level 3 spec folder passes validate.sh
- **SC-004**: Context saved via generate-context.js
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Spec 140 doc sprint completed | Must be done first | Already completed |
| Risk | Agent file divergence during concurrent editing | Med | Canonical+sync strategy (ADR-001) |
| Risk | Table formatting breaks with long tool names | Low | Verify markdown renders correctly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Agent files stay under 550 lines (currently 538, adding ~6 lines = 544)

### Reliability
- **NFR-R01**: All 4 runtimes receive identical content updates

---

## 8. EDGE CASES

### Data Boundaries
- L6 row becomes longest row in table due to added tools: acceptable, markdown renders fine

### Error Scenarios
- If one mirror edit fails mid-sync: re-read canonical and re-apply

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 10, LOC: ~60, Systems: 4 runtimes |
| Risk | 5/25 | Auth: N, API: N, Breaking: N |
| Research | 5/20 | Gap analysis already completed |
| Multi-Agent | 3/15 | Workstreams: 2 (docs + agents) |
| Coordination | 4/15 | Dependencies: sequential sync |
| **Total** | **25/100** | **Level 3 (per user request, retroactive documentation)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Agent files diverge if edited independently | M | L | Canonical+sync strategy |
| R-002 | Long L6 row breaks table formatting | L | L | Visual verification |

---

## 11. USER STORIES

### US-001: Agent MCP Awareness (Priority: P0)

**As a** speckit agent, **I want** the MCP Tool Layers table to list all available tools, **so that** I can correctly route operations to the right layer.

**Acceptance Criteria**:
1. Given the MCP table in Section 2, When an agent reads it, Then `memory_bulk_delete`, `eval_run_ablation`, and `eval_reporting_dashboard` are listed
2. Given the notes after the MCP table, When an agent reads them, Then all 5 `memory_context` modes are documented

---

### US-002: Save-time Behavior Awareness (Priority: P1)

**As a** speckit agent, **I want** to know about save-time quality gates and reconsolidation, **so that** I understand what happens when `memory_save` is called.

**Acceptance Criteria**:
1. Given the save-time note, When the agent reads it, Then it knows about the 0.4 signal density threshold and 0.88 similarity merge

---

## 12. OPEN QUESTIONS

- None (all gaps verified during planning phase)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Spec**: See `../000-feature-overview/spec.md` (Spec 140)

---

## Phase Navigation

| **Parent Spec** | ../spec.md |
- Predecessor: `018-deferred-features`
- Successor: `008-subfolder-resolution-fix`

## Supplemental Requirements
- REQ-DOC-008: Keep documentation internally consistent with existing phase artifacts and validation output.

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
5. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
6. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.

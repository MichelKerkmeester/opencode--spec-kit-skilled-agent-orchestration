---
title: "Feature Specification: 042 root README refresh"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
description: "Refresh root README.md after the latest runtime commits, with verified counts, brief feature mentions, and evergreen packet-ID compliance."
trigger_phrases:
  - "042-root-readme-refresh"
  - "root readme update"
  - "framework readme refresh"
  - "tool count refresh"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/042-root-readme-refresh"
    last_updated_at: "2026-04-29T20:52:18+02:00"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Strict validation passed"
    next_safe_action: "Ready for commit"
    blockers: []
    key_files:
      - "README.md"
      - "verification-notes.md"
      - "audit-findings.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: 042 Root README Refresh

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root `README.md` described stale runtime counts and omitted several recently added MCP server capabilities. It also contained one evergreen-doc violation by linking to a packet-local implementation folder from narrative README content.

### Purpose
Update the root README so it reflects the current runtime surface, cites canonical count sources, and keeps packet-history references out of evergreen narrative content.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify current tool, advisor, agent, skill, and command counts from canonical local sources.
- Update root `README.md` counts, date/version footer, and brief feature mentions.
- Remove the non-exempt packet-folder hardlink from README narrative content.
- Create this Level 2 packet with verification and audit evidence.

### Out of Scope
- Runtime code changes.
- Command, agent, or skill behavior changes.
- Git commit creation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Refresh counts, feature mentions, footer, and evergreen compliance. |
| `specs/system-spec-kit/026-graph-and-context-optimization/042-root-readme-refresh/spec.md` | Create | Packet specification. |
| `specs/system-spec-kit/026-graph-and-context-optimization/042-root-readme-refresh/plan.md` | Create | Execution plan. |
| `specs/system-spec-kit/026-graph-and-context-optimization/042-root-readme-refresh/tasks.md` | Create | Task ledger. |
| `specs/system-spec-kit/026-graph-and-context-optimization/042-root-readme-refresh/checklist.md` | Create | Verification checklist. |
| `specs/system-spec-kit/026-graph-and-context-optimization/042-root-readme-refresh/implementation-summary.md` | Create | Completion narrative. |
| `specs/system-spec-kit/026-graph-and-context-optimization/042-root-readme-refresh/description.json` | Create | Packet metadata. |
| `specs/system-spec-kit/026-graph-and-context-optimization/042-root-readme-refresh/graph-metadata.json` | Create | Packet graph metadata and dependencies. |
| `specs/system-spec-kit/026-graph-and-context-optimization/042-root-readme-refresh/verification-notes.md` | Create | Count verification notes. |
| `specs/system-spec-kit/026-graph-and-context-optimization/042-root-readme-refresh/audit-findings.md` | Create | Evergreen grep audit findings. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Correct MCP tool counts | README uses 54 `spec_kit_memory` tools and 63 total native MCP tools, with source notes. |
| REQ-002 | Correct agent and command counts | README uses 10 agents and 23 commands consistently. |
| REQ-003 | Remove evergreen violation | README no longer links to a real packet folder in narrative content. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Add brief capability mentions | README surfaces retention sweep, advisor rebuild, Codex timeout fallback, matrix runners, stress suite, and code graph catalog/playbook. |
| REQ-005 | Record verification evidence | `verification-notes.md` and `audit-findings.md` document count sources and grep results. |
| REQ-006 | Pass validation | Evergreen grep has no unexempted narrative hits and strict validator exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All stale README count references are replaced with verified counts.
- **SC-002**: README additions stay brief and point at canonical file paths.
- **SC-003**: The evergreen grep produces only exempt instructional/template hits, recorded in `audit-findings.md`.
- **SC-004**: Strict validator exits 0 for this packet.

### Acceptance Scenarios

| ID | Scenario | Expected Result |
|----|----------|-----------------|
| AS-001 | **Given** a reader checks the README overview table | Counts show 10 agents, 21 skills, 23 commands, and 63 MCP tools. |
| AS-002 | **Given** a reader checks the MCP FAQ | The `spec_kit_memory` count is 54 and cites `TOOL_DEFINITIONS`. |
| AS-003 | **Given** the evergreen grep runs on README | Only instructional phase-decomposition examples remain. |
| AS-004 | **Given** strict validation runs on this packet | Validator exits 0 with no warnings. |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `tool-schemas.ts` | Canonical MCP count source. | Count `TOOL_DEFINITIONS` entries directly. |
| Dependency | Runtime directory listings | Agent, skill, and command counts depend on visible files. | Count actual definitions and document exclusions. |
| Risk | README bloat | Feature mentions could over-expand an already large README. | Add one or two sentences per relevant section. |
| Risk | Evergreen false positives | Template examples match packet-shaped grep. | Keep instructional examples and document them as exempt. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Validation commands complete locally in one pass.

### Security
- **NFR-S01**: No secrets or credentials are introduced.

### Reliability
- **NFR-R01**: Count claims cite reproducible commands and canonical source files.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Count Boundaries
- `.opencode/agent/README.txt` and `.claude/agents/README.txt` are not agent definitions.
- `.opencode/skill/README.md` and dot-directories are not counted as skills.
- Advisor schema files define input/output schemas; the four advisor MCP descriptors are imported into `TOOL_DEFINITIONS`.

### Evergreen Grep
- Packet-shaped examples inside instructional code blocks remain allowed by the evergreen rule.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | One evergreen README plus packet docs. |
| Risk | 8/25 | Documentation-only but count accuracy matters. |
| Research | 11/20 | Requires verification across runtime files and directories. |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

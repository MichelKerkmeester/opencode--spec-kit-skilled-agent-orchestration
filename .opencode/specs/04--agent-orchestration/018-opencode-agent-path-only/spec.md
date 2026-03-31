---
title: "Feature Specification: OpenCode Agent Path Only [04--agent-orchestration/018-opencode-agent-path-only/spec]"
description: "Current repository documentation references agent file paths across three platforms (.opencode/agent, .claude/agents, .codex/agents). This creates maintenance overhead and confu..."
trigger_phrases:
  - "feature"
  - "specification"
  - "opencode"
  - "agent"
  - "path"
  - "spec"
  - "018"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: OpenCode Agent Path Only

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-16 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Current repository documentation references agent file paths across three platforms (`.opencode/agent`, `.claude/agents`, `.codex/agents`). This creates maintenance overhead and confusion about which path is the canonical runtime reference. Active documentation and runtime systems should reference only the OpenCode path (`.opencode/agent`) as the authoritative location.

### Purpose
Standardize all runtime and active documentation references to use `.opencode/agent` exclusively, removing `.claude/agents` and `.codex/agents` path references where they appear in operational contexts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update AGENTS.md agent routing table to reference `.opencode/agent` only
- Update skill files that reference agent paths to use `.opencode/agent`
- Update command files that reference agent paths to use `.opencode/agent`
- Update any runtime configuration or scripts that reference agent paths
- Document the cross-platform convention (files exist in 3 locations, reference only OpenCode path)

### Out of Scope
- Physical removal of `.claude/agents` or `.codex/agents` directories - they remain for platform compatibility
- Changes to individual agent file content (frontmatter differences remain intentional)
- Updates to platform-specific configuration files (those can reference their own paths)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| AGENTS.md | Modify | Update agent table to show only `.opencode/agent` paths |
| .opencode/skill/system-spec-kit/SKILL.md | Modify | Update agent exclusivity references |
| .opencode/command/**/*.md | Modify | Update any agent path references |
| .opencode/agent/*.md | Review | Verify cross-platform convention notes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All runtime references use `.opencode/agent` paths | `grep -r "\.claude/agents\|\.codex/agents" AGENTS.md .opencode/` returns zero active runtime references |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Cross-platform convention documented | Agent files include note about multi-platform existence |
| REQ-003 | Validation script passes | `grep` command in acceptance criteria confirms cleanup |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All references in AGENTS.md agent routing table point to `.opencode/agent` paths only
- **SC-002**: No runtime code or active documentation references `.claude/agents` or `.codex/agents` paths
- **SC-003**: Cross-platform convention is clearly documented where agent paths are discussed
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Breaking platform-specific workflows | Medium | Only change runtime references; keep actual files in all 3 locations |
| Risk | Overlooking reference in nested files | Low | Use comprehensive grep to validate all paths |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Are there any MCP configuration files or scripts outside `.opencode/` that reference agent paths?
- Should platform-specific README files be updated with a "canonical path" note?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

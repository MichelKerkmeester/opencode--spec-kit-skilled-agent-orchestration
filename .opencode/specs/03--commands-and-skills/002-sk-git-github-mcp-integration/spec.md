---
title: "Feature Specification: GitHub MCP Integration for [03--commands-and-skills/002-sk-git-github-mcp-integration/spec]"
description: "Integrate GitHub MCP guidance into sk-git documentation with correct tool syntax and clear local-vs-remote workflow guidance."
trigger_phrases:
  - "feature"
  - "specification"
  - "github"
  - "mcp"
  - "integration"
  - "spec"
  - "002"
  - "git"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: GitHub MCP Integration for sk-git Skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2025-12-23 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-git skill documented GitHub MCP usage with incorrect call syntax, incomplete tool coverage, and weak guidance on when to use GitHub MCP instead of local git or `gh`. That made remote GitHub workflows harder to execute correctly from the skill documentation.

### Purpose
Normalize the sk-git documentation so GitHub MCP calls use the correct Code Mode form, cover the main remote workflow categories, and clearly distinguish local git tasks from remote GitHub operations.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update sk-git documentation to show correct GitHub MCP invocation syntax.
- Add guidance for pull requests, issues, repository reads, and CI/CD checks.
- Clarify when to use local git, GitHub MCP, or `gh`.
- Align the spec folder documentation with the active Level 2 template.

### Out of Scope
- Changing the GitHub MCP server configuration.
- Creating a new skill or new runtime integration.
- Modifying unrelated skills.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-git/SKILL.md` | Modify | Correct GitHub MCP syntax and usage guidance |
| `.opencode/skill/sk-git/references/finish_workflows.md` | Modify | Add correct PR and remote workflow examples |
| `.opencode/skill/sk-git/references/shared_patterns.md` | Modify | Add GitHub MCP remote operation patterns |
| `.opencode/skill/sk-git/references/quick_reference.md` | Modify | Add quick-reference commands and decision guidance |
| .opencode/skill/sk-git/references/pr_template.md | Review/Modify | Ensure PR automation examples remain consistent |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | GitHub MCP call syntax is correct everywhere in scope | Examples use `github.github_{tool_name}({...})` form |
| REQ-002 | Remote GitHub workflow coverage is complete enough for common sk-git tasks | PR, issue, repo, and CI/CD examples are documented |
| REQ-003 | Local-vs-remote guidance is explicit | The docs explain when local git is preferred and when GitHub MCP is needed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Examples are copy-paste ready | Examples include valid template-literal call patterns |
| REQ-005 | Docker prerequisite and GitHub auth expectations are documented | Runtime prerequisites are visible in the guidance |
| REQ-006 | Spec folder documents match the active template | No structural validation errors remain |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: GitHub MCP examples in the sk-git docs consistently use the correct `github.github_*` syntax.
- **SC-002**: The documentation distinguishes local git operations from remote GitHub operations clearly enough to avoid tool misuse.
- **SC-003**: The spec folder validates structurally after compliance normalization.

### Acceptance Scenarios

- **Given** a contributor needs to inspect pull requests or issues in GitHub, **when** they follow the updated sk-git documentation, **then** they see the correct `github.github_*` MCP syntax instead of legacy call forms.
- **Given** a workflow can be completed with local git, **when** the decision guidance is read, **then** the docs keep the user on local tools rather than sending them to GitHub MCP unnecessarily.
- **Given** GitHub MCP is unavailable or unauthenticated, **when** the remote guidance is reviewed, **then** the docs explain the prerequisite and fallback expectations clearly.
- **Given** the spec folder is validated after normalization, **when** the documentation packet is checked, **then** the compliance-only changes preserve the original GitHub MCP integration intent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Docker + GitHub MCP runtime availability | Remote examples are unusable if the MCP runtime is unavailable | Document prerequisites directly in the guidance |
| Dependency | GitHub PAT and server config | Auth failures block remote calls | Keep auth expectations visible in the docs |
| Risk | Local and remote tool guidance drifts again | Users may choose the wrong tool for the task | Keep the local-vs-remote decision table in the reference docs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Syntax examples must remain internally consistent across all updated reference files.

### Usability
- **NFR-U01**: Examples must be understandable without reading implementation code.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Incorrect legacy `github.list_*` style examples must be replaced wherever they appear in the scoped documentation.
- If GitHub MCP is unavailable, the guidance should still let users fall back to local git or `gh` where appropriate.
- Copy-paste examples must remain valid even when shown inside fenced code blocks.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Narrow documentation update across a small set of sk-git references |
| Risk | 8/25 | Low runtime risk, but poor syntax guidance causes user error |
| Research | 8/20 | Required syntax verification and remote workflow coverage review |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. This compliance pass keeps the original scope and outcome intact.
<!-- /ANCHOR:questions -->

---

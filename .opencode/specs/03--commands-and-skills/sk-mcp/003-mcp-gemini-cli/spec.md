---
title: "Feature Specification: mcp-gemini-cli Skill"
description: "Create a skill that allows Claude Code and OpenCode to utilize Google's Gemini CLI for supplementary AI tasks including code generation, web research, architecture analysis, and cross-AI validation."
trigger_phrases:
  - "gemini cli skill"
  - "mcp-gemini-cli"
  - "gemini integration"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: mcp-gemini-cli Skill

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
| **Created** | 2026-02-28 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Claude Code and OpenCode lack a structured way to delegate tasks to Google's Gemini CLI. Without a skill, agents have no guidance on when to use Gemini, how to invoke it correctly, or how to validate its output. This leads to missed opportunities for cross-AI validation, web research via Google Search grounding, and codebase investigation using Gemini's unique tools.

### Purpose
Create a skill that teaches Claude Code and OpenCode agents how to invoke Gemini CLI for supplementary tasks, following established skill creation standards with proper progressive disclosure, smart routing, and validation patterns.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- SKILL.md with 8 standard sections following sk-doc conventions
- references/cli_reference.md with complete CLI command and flag documentation
- references/integration_patterns.md with Claude+Gemini orchestration patterns
- references/gemini_tools.md with built-in tools documentation
- assets/prompt_templates.md with reusable prompt templates

### Out of Scope
- MCP server implementation - not needed (direct CLI invocation via Bash)
- INSTALL_GUIDE.md - defer to later iteration
- README.md - defer to later iteration
- Scripts - no executable scripts needed for this skill
- Gemini API integration - this skill uses CLI only, not SDK

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skill/mcp-gemini-cli/SKILL.md | Create | Main skill definition |
| .opencode/skill/mcp-gemini-cli/references/cli_reference.md | Create | CLI command reference |
| .opencode/skill/mcp-gemini-cli/references/integration_patterns.md | Create | Orchestration patterns |
| .opencode/skill/mcp-gemini-cli/references/gemini_tools.md | Create | Tools documentation |
| .opencode/skill/mcp-gemini-cli/assets/prompt_templates.md | Create | Prompt templates |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SKILL.md follows sk-doc 8-section standard | All 8 sections present with proper anchors |
| REQ-002 | YAML frontmatter valid | name, description, allowed-tools, version fields present |
| REQ-003 | Smart routing with pseudocode router | Python pseudocode covers all intent signals |
| REQ-004 | ALWAYS/NEVER/ESCALATE rules defined | Rules cover security, invocation, and validation |
| REQ-005 | Under 5k words in SKILL.md | Word count verified |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Reference files provide deep-dive content | Each reference covers its domain completely |
| REQ-007 | Prompt templates are copy-paste ready | Templates work with `gemini` CLI directly |
| REQ-008 | Integration patterns cover cross-AI workflows | Generate-Review-Fix and other patterns documented |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Skill can be invoked via Gate 2 skill_advisor.py with confidence >= 0.8 for Gemini-related requests
- **SC-002**: All files follow snake_case naming and pass DQI structure checks
- **SC-003**: SKILL.md under 5k words with progressive disclosure to references/
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Gemini CLI installed globally | Skill useless without it | Document prerequisite clearly |
| Dependency | Authentication configured | CLI fails without auth | Document auth setup in skill |
| Risk | Gemini CLI API changes | Templates may break | Version-pin CLI reference |
| Risk | --yolo mode security | Could modify files without approval | NEVER rules for dangerous operations |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: Never use --yolo on production codebases without explicit user approval
- **NFR-S02**: Always validate Gemini-generated code before applying

### Reliability
- **NFR-R01**: Graceful fallback when Gemini CLI not installed
- **NFR-R02**: Handle rate limits with model fallback strategy
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### CLI Unavailable
- Gemini CLI not installed: Skill routing detects and suggests installation
- Authentication expired: Provide re-auth instructions
- Rate limited: Suggest model fallback (Pro -> Flash)

### Output Handling
- Large output: Use -o text to capture, validate before applying
- JSON parsing: Handle malformed JSON from -o json mode
- Timeout: Long-running tasks via background execution
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 5 files, multiple reference domains |
| Risk | 8/25 | Low risk, documentation-only skill |
| Research | 15/20 | Required studying reference repo + official docs |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None remaining (all resolved during research phase)

---

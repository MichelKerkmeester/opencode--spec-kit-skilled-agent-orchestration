---
title: "Feature Specification: Codex CLI Agent Definitions"
description: "The .codex/config.toml declares 9 agent roles with config_file references but the .codex/agents/ directory is empty. These TOML agent definition files need to be created by converting the existing ChatGPT agent markdown files."
trigger_phrases:
  - "codex cli agents"
  - "codex agent toml"
  - "agent conversion"
  - "chatgpt to codex"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: Codex CLI Agent Definitions

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
| **Created** | 2026-03-01 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `.codex/config.toml` declares 9 agent roles (context, debug, handover, orchestrate, research, review, speckit, ultra-think, write) with `config_file` references pointing to `.codex/agents/*.toml`, but the `.codex/agents/` directory is empty. None of the referenced TOML files exist. Additionally, the `ultra-think` agent was missing from config.toml entirely.

### Purpose
Create all 9 agent TOML definition files by converting the existing ChatGPT agent markdown files (`.opencode/agent/chatgpt/*.md`) to Codex CLI's config overlay format, and add the missing ultra-think entry to config.toml.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Convert 9 ChatGPT agent markdown files to Codex CLI TOML format
- Map YAML frontmatter fields to TOML config overlay fields
- Adapt markdown body content (path references, model references, profile references)
- Add missing `[agents.ultra-think]` section to config.toml
- Verify all TOML files parse correctly

### Out of Scope
- Modifying agent behavior or workflow logic - preserving as-is
- Changing the source ChatGPT markdown files
- Adding new agents beyond the existing 9
- Testing agents in actual Codex CLI runtime

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.codex/agents/context.toml` | Create | Read-only retrieval specialist |
| `.codex/agents/debug.toml` | Create | Fresh perspective debugging |
| `.codex/agents/handover.toml` | Create | Session continuation |
| `.codex/agents/orchestrate.toml` | Create | Senior task commander |
| `.codex/agents/research.toml` | Create | Technical investigation |
| `.codex/agents/review.toml` | Create | Code quality guardian |
| `.codex/agents/speckit.toml` | Create | Spec folder documentation |
| `.codex/agents/ultra-think.toml` | Create | Multi-strategy planning |
| `.codex/agents/write.toml` | Create | Documentation specialist |
| `.codex/config.toml` | Modify | Add `[agents.ultra-think]` section |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 9 TOML files created in `.codex/agents/` | Files exist and are non-empty |
| REQ-002 | Each TOML file parses without errors | `tomli.load()` succeeds on all files |
| REQ-003 | `config.toml` references all 9 agents | All `config_file` paths resolve to existing files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Full system prompts preserved in `developer_instructions` | Key workflow sections present in each file |
| REQ-005 | Model/path/profile references adapted | No `openai/gpt-5.3-codex`, no `.opencode/agent/*.md` paths, no `ChatGPT profile` references remain |
| REQ-006 | Correct sandbox_mode per agent | Read-only agents: read-only; write-capable agents: workspace-write |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 9 `.codex/agents/*.toml` files parse as valid TOML
- **SC-002**: All `config_file` references in config.toml resolve to existing files
- **SC-003**: Key content sections preserved (workflows, rules, output formats, anti-patterns)
- **SC-004**: No stale ChatGPT/OpenAI model references in converted files
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Source `.opencode/agent/chatgpt/*.md` files | Conversion impossible without sources | Sources verified to exist before starting |
| Risk | TOML escape sequences in markdown body | Parse errors if backslashes misinterpreted | Used `'''` literal strings (no escape processing) |
| Risk | `model_reasoning_effort = "xhigh"` may not be valid for all models | Agent config ignored at runtime | Codex CLI treats it as string passthrough; user can adjust |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A - static configuration files, no runtime performance impact

### Security
- **NFR-S01**: No secrets or API keys stored in agent TOML files
- **NFR-S02**: Agent sandbox_mode correctly restricts file system access

### Reliability
- **NFR-R01**: All TOML files must parse deterministically (no ambiguous syntax)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Triple single quotes (`'''`) in markdown content: Verified none exist in source files
- Backslash sequences (`\[`, `\]`): Safe in TOML literal strings (no escape processing)
- Very long developer_instructions (orchestrate: 52K chars): TOML spec has no string length limit

### Error Scenarios
- Missing source markdown file: Script would fail with clear error; all 9 verified present
- TOML parser version differences: Old `toml` 0.10.2 library failed; `tomli` succeeds (used for verification)

### State Transitions
- N/A - one-time conversion, no state management
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 10 files changed, ~4300 lines of content |
| Risk | 5/25 | Low risk - new files only, no existing behavior changed |
| Research | 8/20 | Needed to understand Codex CLI config overlay schema |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None remaining. All questions resolved during implementation.
<!-- /ANCHOR:questions -->

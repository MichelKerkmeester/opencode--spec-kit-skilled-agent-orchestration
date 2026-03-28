---
title: "Feature Specification: Gemini CLI Compatibility [023-gemini-cli-compatibility/spec]"
description: "The existing multi-provider setup supports Claude Code (.claude/) and ChatGPT (.opencode/agent/chatgpt/) runtimes, but has no Gemini CLI integration. Gemini CLI uses a different..."
trigger_phrases:
  - "feature"
  - "specification"
  - "gemini"
  - "cli"
  - "compatibility"
  - "spec"
  - "023"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Gemini CLI Compatibility

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
| **Created** | 2026-02-20 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The existing multi-provider setup supports Claude Code (`.claude/`) and ChatGPT (`.opencode/agent/chatgpt/`) runtimes, but has no Gemini CLI integration. Gemini CLI uses a different directory structure (`.gemini/`), a distinct agent frontmatter schema (tools array, Gemini model IDs, max_turns/timeout_mins), and TOML-based commands rather than markdown, meaning none of the current agent, command, or skill files work with Gemini CLI out of the box. Without a Gemini-compatible layer, users of Gemini CLI cannot access the same agents, commands, and skills available to Claude and ChatGPT users.

### Purpose
Add a fully functional Gemini CLI runtime layer so that all agents, commands, and skills defined in `.opencode/` are accessible from Gemini CLI with correct frontmatter, config, and symlink wiring.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `GEMINI.md` symlink at project root pointing to `AGENTS.md`
- Create `.gemini/` directory with `settings.json` (mcpServers, enableAgents, skills, context config)
- Create `.gemini/agents/` with 8 adapted agent `.md` files using Gemini frontmatter schema
- Create `.gemini/skills/` with symlinks to all `.opencode/skill/` directories
- Create `.gemini/commands/` with `.toml` wrapper files referencing OpenCode command content via file injection
- Create `.gemini/specs` symlink pointing to `../.opencode/specs`
- Create `.opencode/agent/gemini/` with 8 adapted agent files for runtime path resolution
- Update AGENTS.md section 7 to add Gemini row to runtime agent directory table
- Update `.opencode/command/create/agent.md` to include the Gemini agent path

### Out of Scope
- Modifying any existing `.opencode/` agent, command, or skill source files - these remain the single source of truth
- Creating Gemini-specific skill content - skills are shared via symlinks
- A2A (remote) agent configuration - all agents use `kind: local`
- Gemini CLI installation or authentication setup - environment responsibility

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `GEMINI.md` | Create (symlink) | Symlink to `AGENTS.md` at project root |
| `.gemini/settings.json` | Create | Main Gemini config: enableAgents, mcpServers, skills, context filename |
| `.gemini/agents/general.md` | Create | Gemini-adapted copy of @general agent |
| `.gemini/agents/orchestrate.md` | Create | Gemini-adapted copy of @orchestrate agent |
| `.gemini/agents/context.md` | Create | Gemini-adapted copy of @context agent |
| `.gemini/agents/research/research/research.md` | Create | Gemini-adapted copy of @research agent |
| `.gemini/agents/write.md` | Create | Gemini-adapted copy of @write agent |
| `.gemini/agents/review.md` | Create | Gemini-adapted copy of @review agent |
| `.gemini/agents/speckit.md` | Create | Gemini-adapted copy of @speckit agent |
| `.gemini/agents/debug.md` | Create | Gemini-adapted copy of @debug agent |
| `.gemini/agents/handover.md` | Create | Gemini-adapted copy of @handover agent |
| `.gemini/skills/<name>` | Create (symlinks) | Symlinks to each `.opencode/skill/` directory |
| `.gemini/commands/<ns>/<cmd>.toml` | Create | TOML wrappers for key OpenCode commands |
| `.gemini/specs` | Create (symlink) | Symlink to `../.opencode/specs` |
| `.opencode/agent/gemini/*.md` | Create | 8+ agent files with Gemini-specific frontmatter |
| `AGENTS.md` | Modify | Add Gemini row to §7 runtime agent directory table |
| `.opencode/command/create/agent.md` | Modify | Add `.opencode/agent/gemini/` path reference |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `.gemini/settings.json` must enable subagents and define mcpServers | File contains `"experimental": {"enableAgents": true}` and mcpServers block matching `.opencode/` MCP config |
| REQ-002 | All agent files in `.gemini/agents/` must use valid Gemini frontmatter schema | Each file has `name`, `description`, `tools` (array), and optionally `model`, `max_turns`, `timeout_mins`; no OpenCode-style permission maps |
| REQ-003 | `GEMINI.md` symlink must resolve to `AGENTS.md` | `readlink GEMINI.md` returns `AGENTS.md` and file is readable |
| REQ-004 | Skill symlinks in `.gemini/skills/` must resolve to valid `.opencode/skill/` directories | No broken symlinks; each target contains a `SKILL.md` |
| REQ-005 | `.opencode/agent/gemini/` must exist with all agent files for runtime path resolution | Directory contains one `.md` file per agent with Gemini-specific frontmatter |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Command TOML files must use correct Gemini injection syntax (`@{file}`) | `.toml` files contain `prompt` field with valid `@{../../.opencode/command/...}` references |
| REQ-007 | AGENTS.md §7 runtime table updated with Gemini row | Table includes row: `Gemini CLI | .gemini/agents/ | Load Gemini-specific agent definitions` |
| REQ-008 | `.opencode/command/create/agent.md` updated to include Gemini agent path | Document references `.opencode/agent/gemini/` as a target path for new agent creation |
| REQ-009 | `.gemini/specs` symlink resolves to `.opencode/specs` | `readlink .gemini/specs` returns `../.opencode/specs` and directory is accessible |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `GEMINI.md` exists as a symlink to `AGENTS.md` at project root
- **SC-002**: `.gemini/settings.json` exists with `enableAgents: true`, `mcpServers`, skills, and context config
- **SC-003**: `.gemini/agents/` contains 8+ adapted agent `.md` files with valid Gemini frontmatter (tools array, no permission maps)
- **SC-004**: `.gemini/skills/` contains symlinks to all `.opencode/skill/` directories, all resolving correctly
- **SC-005**: `.gemini/commands/` contains `.toml` wrapper files for key OpenCode commands using `@{file}` injection
- **SC-006**: `.opencode/agent/gemini/` contains 8+ adapted agent files for runtime path resolution
- **SC-007**: AGENTS.md §7 includes a Gemini row in the runtime agent directory table
- **SC-008**: All symlinks resolve correctly with no broken links (`find .gemini -type l | xargs -I{} test -e {}` passes)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Gemini CLI installed and authenticated in target environment | Agents and commands cannot be tested without CLI | Document as prerequisite; validate file structure independently |
| Dependency | `.opencode/skill/` directories must exist and contain `SKILL.md` | Broken skill symlinks if source is missing | Verify source skill directories before creating symlinks |
| Risk | Gemini CLI TOML command syntax (`@{file}`) may differ across CLI versions | Commands fail to inject OpenCode markdown content | Test with current Gemini CLI version; document minimum version requirement |
| Risk | Gemini frontmatter schema may evolve (experimental feature) | Agent definitions break on CLI upgrade | Pin minimum CLI version in `settings.json` documentation; monitor Gemini CLI changelog |
| Risk | Symlink support on Windows environments | Symlinks may not resolve for Windows users | Document Linux/macOS requirement; provide fallback copy-based alternative |
| Risk | MCP server config duplication between `.opencode/` and `.gemini/settings.json` | Config drift when MCP servers are added or changed | Note in AGENTS.md that `.gemini/settings.json` mcpServers must be kept in sync manually |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Symlink resolution must be instantaneous - no deep traversal chains (max 1 level of indirection)
- **NFR-P02**: Agent file sizes should remain comparable to existing ChatGPT variants - no unnecessary content bloat

### Security
- **NFR-S01**: MCP server credentials in `.gemini/settings.json` must use environment variable references (not hardcoded secrets)
- **NFR-S02**: No API keys or tokens committed to `.gemini/settings.json` - use `"env": {"KEY": "$ENV_VAR"}` pattern

### Reliability
- **NFR-R01**: All symlinks must be relative paths (not absolute) so the project remains portable across machines
- **NFR-R02**: Command TOML files must degrade gracefully if referenced OpenCode command file is missing - Gemini CLI should surface a readable error, not a silent failure
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty skill directory: If `.opencode/skill/` is empty, `.gemini/skills/` will contain no symlinks - acceptable, no error state
- New agent added to `.opencode/`: Must be manually mirrored to `.gemini/agents/` and `.opencode/agent/gemini/` - process gap to document
- TOML command referencing a deleted OpenCode command file: Injection will fail at runtime; file should be removed from `.gemini/commands/` in sync

### Error Scenarios
- Broken symlink (source deleted): Gemini CLI will surface a file-not-found error when loading the skill or spec; fix by removing stale symlink
- Invalid Gemini frontmatter: CLI silently skips malformed agent files or fails with parse error; validate with `gemini --list-agents` after setup
- MCP server unreachable: Gemini CLI will start without MCP tools available; agents requiring memory MCP will degrade gracefully if they handle tool absence

### State Transitions
- Adding a new provider in future: The `.opencode/agent/<provider>/` pattern is established; new providers follow the same structure
- Upgrading Gemini CLI: Re-validate frontmatter schema and TOML injection syntax against new CLI version before upgrading
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | ~15-20 new files, 2-3 modified files; spans 4 directory structures |
| Risk | 12/25 | Low-medium - config/symlink files only, no production code changes; symlink portability concern |
| Research | 5/20 | Research complete - Gemini CLI docs reviewed, codebase pattern analysed |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- What is the minimum Gemini CLI version required to support `enableAgents` and TOML `@{file}` injection? This should be documented as a prerequisite.
- Should `.gemini/commands/` cover all OpenCode commands or only the most-used subset (spec_kit, memory)? Full coverage adds maintenance burden; partial coverage risks inconsistency.
- Should the agent body content in `.gemini/agents/` be verbatim copies of the OpenCode variants or trimmed for Gemini context window constraints?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

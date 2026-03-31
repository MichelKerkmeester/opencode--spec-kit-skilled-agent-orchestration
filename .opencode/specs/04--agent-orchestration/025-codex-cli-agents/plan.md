---
title: "Implementation Plan: Codex CLI Agent Definitions [04--agent-orchestration/025-codex-cli-agents/plan]"
description: "Convert 9 ChatGPT agent markdown files to Codex CLI TOML config overlay format with automated text substitutions and TOML wrapping."
trigger_phrases:
  - "codex agent plan"
  - "agent conversion plan"
  - "toml conversion"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: Codex CLI Agent Definitions

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python (conversion script), TOML (output) |
| **Framework** | None |
| **Storage** | Filesystem (`.codex/agents/`) |
| **Testing** | `tomli` TOML parser validation |

### Overview
Automated conversion of 9 ChatGPT agent definition files (Markdown with YAML frontmatter) into Codex CLI config overlay TOML files. Each TOML file contains `sandbox_mode`, `model_reasoning_effort`, and `developer_instructions` (the full agent system prompt). A Python script handles YAML frontmatter extraction, text substitutions, and TOML file generation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (source files, TOML schema)

### Definition of Done
- [x] All 9 TOML files created and parse correctly
- [x] config.toml updated with ultra-think entry
- [x] Key content sections preserved in all agents
- [x] No stale references remain
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One-time file conversion pipeline: Read source → Extract body → Apply substitutions → Wrap in TOML → Write output

### Key Components
- **Source files**: `.opencode/agent/chatgpt/*.md` (9 Markdown files with YAML frontmatter)
- **Output files**: `.codex/agents/*.toml` (9 Codex CLI config overlay files)
- **Config file**: `.codex/config.toml` (agent registry)

### Data Flow
```
Source .md files → Python script → Extract body after YAML frontmatter
                                 → Apply text substitutions (model refs, paths, profile refs)
                                 → Wrap in TOML with sandbox_mode + model_reasoning_effort
                                 → Write to .codex/agents/*.toml
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Read Sources
- [x] Read all 9 source `.md` files
- [x] Read existing `.codex/config.toml`
- [x] Verify `.codex/agents/` directory exists

### Phase 2: Convert and Create
- [x] Build conversion mapping (agent → sandbox_mode + reasoning_effort)
- [x] Define text substitution rules (7 categories)
- [x] Run Python conversion script to generate all 9 TOML files
- [x] Add `[agents.ultra-think]` section to config.toml

### Phase 3: Verify
- [x] Parse all 9 TOML files with `tomli`
- [x] Verify config.toml references resolve to existing files
- [x] Spot-check key content sections preserved
- [x] Verify no stale references remain
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parse validation | All 9 TOML files | `tomli.load()` |
| Reference validation | config.toml → agents/ | `os.path.exists()` |
| Content spot-check | Key sections per agent | String search for keywords |
| Replacement check | All files | Grep for stale references |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Source `.opencode/agent/chatgpt/*.md` | Internal | Green | Cannot convert |
| `.codex/agents/` directory | Internal | Green | Created if needed |
| `tomli` Python package | External | Green | Installed for verification |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Agent TOML files cause Codex CLI errors
- **Procedure**: Delete `.codex/agents/*.toml` files (config.toml entries are harmless without files)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Read Sources) ──► Phase 2 (Convert & Create) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Read Sources | None | Convert & Create |
| Convert & Create | Read Sources | Verify |
| Verify | Convert & Create | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Read Sources | Low | 2 minutes |
| Convert & Create | Medium | 5 minutes |
| Verify | Low | 3 minutes |
| **Total** | | **~10 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No existing files will be overwritten (directory was empty)
- [x] config.toml change is additive only (new section)

### Rollback Procedure
1. Delete all files in `.codex/agents/`
2. Remove `[agents.ultra-think]` section from config.toml (if needed)
3. Verify Codex CLI still functions without agent files

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

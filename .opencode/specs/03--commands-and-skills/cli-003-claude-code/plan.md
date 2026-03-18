---
title: "Implementation Plan: cli-claude-code Skill"
description: "Create a cli-claude-code skill enabling external AI assistants to invoke Claude Code CLI, mirroring cli-codex structure with reversed orchestration."
trigger_phrases:
  - "cli-claude-code plan"
  - "claude code skill plan"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: cli-claude-code Skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (documentation-only skill) |
| **Framework** | OpenCode Skill System (8-section SKILL.md standard) |
| **Storage** | None (flat files) |
| **Testing** | grep verification, skill_advisor.py confidence test, symlink test |

### Overview
Create a cli-claude-code skill for external AI assistants to invoke Claude Code CLI. Mirrors the cli-codex structure with reversed orchestration (external AI = conductor, Claude Code = executor). Three model tiers (opus, sonnet, haiku), 9 agents, and unique capabilities (extended thinking, `--json-schema`, `--permission-mode plan`, `--max-budget-usd`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (skill_advisor.py confidence, symlink, grep counts)
- [x] Dependencies identified (cli-codex as template, .opencode/agent/ as agent source)

### Definition of Done
- [x] All acceptance criteria met (REQ-001 through REQ-010)
- [x] Tests passing (skill_advisor.py returns >= 0.8 confidence)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-only skill following progressive disclosure (SKILL.md -> references -> assets).

### Key Components
- **SKILL.md**: Entry point with smart routing, rules, invocation patterns
- **References**: Deep-dive content for specific intents (CLI, agents, tools, patterns)
- **Assets**: Copy-paste prompt templates for immediate use

### Data Flow
```
External AI request → skill_advisor.py routing → SKILL.md smart router
  → Intent scoring → Resource loading (references/assets) → CLI invocation pattern
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create directory structure: cli-claude-code/{references,assets}
- [x] Read cli-codex as template reference
- [x] Read .opencode/agent/*.md for agent roster

### Phase 2: Core Implementation
- [x] Create SKILL.md (8 sections, smart routing, reversed orchestration)
- [x] Create references/cli_reference.md (CLI flags, commands, models, auth)
- [x] Create references/agent_delegation.md (9 agents, routing table)
- [x] Create references/claude_tools.md (unique capabilities, 3-way comparison)
- [x] Create references/integration_patterns.md (10 reversed orchestration patterns)
- [x] Create assets/prompt_templates.md (10 template categories)
- [x] Create README.md companion guide

### Phase 3: Verification
- [x] Register in skill_advisor.py (INTENT_BOOSTERS, MULTI_SKILL_BOOSTERS, PHRASE_INTENT_BOOSTERS)
- [x] Create .claude/skills/cli-claude-code symlink
- [x] Update 3 READMEs (.opencode/skill/, .opencode/, root)
- [x] Run skill_advisor.py confidence test
- [x] Verify symlink resolves
- [x] Create spec folder documentation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | skill_advisor.py returns cli-claude-code >= 0.8 | `python3 skill_advisor.py "use claude code cli"` |
| Integration | Symlink resolves correctly | `readlink .claude/skills/cli-claude-code` |
| Manual | All files exist with correct content | `ls -la`, `grep -c` |
| Manual | Model IDs consistent across files | `grep` for 3 model IDs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex skill (template) | Internal | Green | Would need to create from scratch |
| .opencode/agent/*.md files | Internal | Green | Agent roster would be incomplete |
| skill_advisor.py | Internal | Green | Routing would not work |
| Claude Code CLI `--help` | External | Green | Flag reference would be incomplete |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Skill causes routing conflicts or incorrect advisor results
- **Procedure**: Remove skill_advisor.py entries, delete skill directory, remove symlink
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Read templates and agent files |
| Core Implementation | Medium | Create 8 files (SKILL.md + 4 refs + 1 asset + README.md) |
| Verification | Low | skill_advisor.py updates, symlink, README updates, tests |
| **Total** | | **Medium** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Template reference (cli-codex) read and understood
- [x] Agent roster verified against actual .opencode/agent/ files
- [x] skill_advisor.py backup not needed (git-tracked)

### Rollback Procedure
1. Remove entries from skill_advisor.py (INTENT_BOOSTERS, MULTI_SKILL_BOOSTERS, PHRASE_INTENT_BOOSTERS)
2. Delete `.opencode/skill/cli-claude-code/` directory
3. Remove `.claude/skills/cli-claude-code` symlink
4. Revert README changes in 3 files
5. Verify skill_advisor.py no longer returns cli-claude-code

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — documentation-only, no data changes
<!-- /ANCHOR:enhanced-rollback -->

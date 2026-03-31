---
title: "Implementation Plan: cli-copilot Skill [03--commands-and-skills/008-cli-copilot-creation/plan]"
description: "Create a cli-copilot skill enabling any AI assistant to invoke GitHub Copilot CLI, completing the 4-CLI cross-AI ecosystem."
trigger_phrases:
  - "cli-copilot plan"
  - "copilot skill plan"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: cli-copilot Skill

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
Create a cli-copilot skill for any AI assistant to invoke GitHub Copilot CLI. Mirrors cli-claude-code structure with AI-agnostic language. Multi-model support (7+ models from 3 providers: Anthropic, OpenAI, Google), cloud delegation (`/delegate`), plan mode, autopilot, and repository memory. Implementation delegated to Gemini CLI, reviewed by Claude.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable (skill_advisor.py confidence, symlink, grep counts)
- [ ] Dependencies identified (cli-claude-code as template, Copilot CLI research as source)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-010)
- [ ] Tests passing (skill_advisor.py returns >= 0.8 confidence)
- [ ] Docs updated (spec/plan/tasks/checklist/implementation-summary)
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
AI assistant request → skill_advisor.py routing → SKILL.md smart router
  → Intent scoring → Resource loading (references/assets) → CLI invocation pattern
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Create directory structure: cli-copilot/{references,assets}
- [ ] Read cli-claude-code as template reference
- [ ] Compile Copilot CLI research data

### Phase 2: Core Implementation (Gemini CLI)
- [ ] Create SKILL.md (8 sections, smart routing with 7 intents)
- [ ] Create references/cli_reference.md (CLI flags, 7+ models, auth)
- [ ] Create references/agent_delegation.md (built-in + custom agents)
- [ ] Create references/copilot_tools.md (unique capabilities, 4-way comparison)
- [ ] Create references/integration_patterns.md (10 orchestration patterns)
- [ ] Create assets/prompt_templates.md (10 template categories)
- [ ] Create README.md companion guide

### Phase 3: Review & Align (Claude)
- [ ] Review all Gemini output for structure, accuracy, and standards
- [ ] Fix AI-agnostic language violations
- [ ] Verify model IDs and CLI flags against research
- [ ] Ensure 4-way comparison table completeness

### Phase 4: Verification
- [ ] Register in skill_advisor.py (INTENT_BOOSTERS, MULTI_SKILL_BOOSTERS, PHRASE_INTENT_BOOSTERS)
- [ ] Create .claude/skills/cli-copilot symlink
- [ ] Update 3 READMEs (.opencode/skill/, .opencode/, root)
- [ ] Run skill_advisor.py confidence test
- [ ] Verify symlink resolves
- [ ] Create implementation-summary.md
- [ ] Create changelog entry
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | skill_advisor.py returns cli-copilot >= 0.8 | `python3 skill_advisor.py "use copilot cli"` |
| Integration | Symlink resolves correctly | `readlink .claude/skills/cli-copilot` |
| Manual | All files exist with correct content | `ls -la`, `grep -c` |
| Manual | AI-agnostic language (no hardcoded conductor) | `grep -rn "Claude Code" \| grep -iv "CLI"` |
| Manual | Model IDs consistent across files | `grep` for 7+ model IDs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-claude-code skill (template) | Internal | Green | Would need to create from scratch |
| Copilot CLI research data | External | Green | Research already completed |
| skill_advisor.py | Internal | Green | Routing would not work |
| Gemini CLI (for implementation) | External | Green | Would implement manually instead |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Skill causes routing conflicts or incorrect advisor results
- **Procedure**: Remove skill_advisor.py entries, delete skill files, remove symlink
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Gemini Implementation) ──► Phase 3 (Review) ──► Phase 4 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Gemini Implementation |
| Gemini Implementation | Setup | Review |
| Review | Gemini Implementation | Verification |
| Verification | Review | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Create dirs, compile research |
| Gemini Implementation | Medium | 7 Gemini CLI invocations |
| Review & Align | Medium | Verify 7 files against standards |
| Verification | Low | skill_advisor.py, symlink, READMEs |
| **Total** | | **Medium** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Template reference (cli-claude-code) read and understood
- [ ] Copilot CLI research data compiled
- [ ] skill_advisor.py backup not needed (git-tracked)

### Rollback Procedure
1. Remove entries from skill_advisor.py (INTENT_BOOSTERS, MULTI_SKILL_BOOSTERS, PHRASE_INTENT_BOOSTERS)
2. Delete files in `.opencode/skill/cli-copilot/`
3. Remove `.claude/skills/cli-copilot` symlink
4. Revert README changes in 3 files
5. Verify skill_advisor.py no longer returns cli-copilot

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — documentation-only, no data changes
<!-- /ANCHOR:enhanced-rollback -->

---
title: "Implementation Plan: cli-gemini Skill"
description: "Create a documentation-only skill for Gemini CLI integration with Claude Code and OpenCode, following sk-doc standards with progressive disclosure."
trigger_phrases:
  - "gemini cli plan"
  - "cli-gemini plan"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: cli-gemini Skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (documentation-only skill) |
| **Framework** | OpenCode Skill System (sk-doc standards) |
| **Storage** | None |
| **Testing** | DQI validation, manual invocation testing |

### Overview
Create the `cli-gemini` skill as a pure documentation skill (no MCP server, no scripts) that teaches Claude Code and OpenCode agents how to invoke Gemini CLI via Bash tool for supplementary AI tasks. Based on the reference implementation at github.com/forayconsulting/gemini_cli_skill, improved with our 8-section SKILL.md standard, smart routing, and progressive disclosure to reference files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (Gemini CLI, authentication)

### Definition of Done
- [x] All acceptance criteria met
- [x] SKILL.md under 5k words
- [x] All reference files provide deep-dive content
- [x] File structure follows sk-doc conventions
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-only skill with progressive disclosure (Level 1: metadata, Level 2: SKILL.md body, Level 3: bundled resources).

### Key Components
- **SKILL.md**: Main orchestrator with 8 standard sections (<5k words)
- **references/cli_reference.md**: Complete CLI command, flag, and slash command reference
- **references/integration_patterns.md**: Cross-AI orchestration patterns (Generate-Review-Fix, etc.)
- **references/gemini_tools.md**: Built-in tools (google_web_search, codebase_investigator, save_memory)
- **assets/prompt_templates.md**: Copy-paste ready templates for common tasks

### Data Flow
```
User request → Gate 2 skill_advisor.py → cli-gemini SKILL.md loads
→ Smart router scores intents → Loads conditional resources
→ Agent constructs gemini CLI command → Bash tool executes
→ Output captured → Agent validates and applies results
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec folder created (cli-001-gemini)
- [x] Skill directory structure created

### Phase 2: Core Implementation
- [x] SKILL.md with 8 sections
- [x] references/cli_reference.md
- [x] references/integration_patterns.md
- [x] references/gemini_tools.md
- [x] assets/prompt_templates.md

### Phase 3: Verification
- [x] Word count check (SKILL.md < 5k words)
- [x] Structure validation (anchors, sections)
- [x] Spec folder artifacts synchronized
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | SKILL.md section completeness | Manual review |
| Word count | SKILL.md under 5k words | wc -w |
| Quality | DQI score | extract_structure.py |
| Manual | Skill invocation via skill_advisor.py | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Gemini CLI (npm) | External | Green | Skill documents installation |
| sk-doc templates | Internal | Green | Templates loaded from research |
| Reference repo | External | Green | Content analyzed and improved |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Skill causes confusion or incorrect Gemini CLI invocations
- **Procedure**: Delete .opencode/skill/cli-gemini/ directory; skill stops loading
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Minimal |
| Core Implementation | Med | Moderate (5 files) |
| Verification | Low | Quick |
<!-- /ANCHOR:effort -->

---

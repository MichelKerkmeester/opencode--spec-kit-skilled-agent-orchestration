---
title: "Implementation Plan: Convert OpenCode Agents to Claude Code Subagents [009-claude-code-subagents/plan]"
description: "Overview: Convert 8 agent markdown files from OpenCode frontmatter format to Claude Code subagent frontmatter format. Source files in .opencode/agent/ remain unchanged. Target f..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "convert"
  - "opencode"
  - "agents"
  - "009"
  - "claude"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Convert OpenCode Agents to Claude Code Subagents

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML |
| **Framework** | None (text conversion) |
| **Storage** | None |

**Overview**: Convert 8 agent markdown files from OpenCode frontmatter format to Claude Code subagent frontmatter format. Source files in `.opencode/agent/` remain unchanged. Target files created in `.claude/agents/` with identical body content but Claude Code-compatible YAML frontmatter using `.claude/agents/explore.md` as reference.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

**Ready When:**
- [ ] Reference file `.claude/agents/explore.md` frontmatter structure documented
- [ ] All 8 source files identified and readable

**Done When:**
- [ ] All 8 target files created with valid frontmatter
- [ ] Body content diff confirms zero changes (frontmatter-only conversion)

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:phases -->
## 3. IMPLEMENTATION PHASES

### Phase 1: Preparation
- [ ] Read `.claude/agents/explore.md` to understand Claude Code frontmatter format
- [ ] Document frontmatter mapping: OpenCode → Claude Code
- [ ] List all 8 source files with their metadata

### Phase 2: Conversion
- [ ] Convert each agent file (8 files):
  - Read source file `.opencode/agent/{name}.md`
  - Extract body content (everything after frontmatter)
  - Convert frontmatter to Claude Code format
  - Write to `.claude/agents/{name}.md`

### Phase 3: Verification
- [ ] Verify all 8 files exist in `.claude/agents/`
- [ ] Check frontmatter structure matches reference
- [ ] Confirm body content unchanged (diff check)

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| `.claude/agents/explore.md` (reference) | Green | Cannot determine correct frontmatter format |
| Source files in `.opencode/agent/` | Green | No files to convert |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 5. ROLLBACK

- **Trigger**: Frontmatter format incorrect or body content modified
- **Procedure**: Delete all 8 files from `.claude/agents/` and retry conversion

<!-- /ANCHOR:rollback -->

---

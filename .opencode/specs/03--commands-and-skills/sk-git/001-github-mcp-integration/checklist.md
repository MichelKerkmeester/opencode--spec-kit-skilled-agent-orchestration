---
title: "Checklist: GitHub MCP Integration [001-github-mcp-integration/checklist]"
description: "For each file, verified"
trigger_phrases:
  - "checklist"
  - "github"
  - "mcp"
  - "integration"
  - "032"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Checklist: GitHub MCP Integration

<!-- ANCHOR:pre-impl -->
## P0 - Must Complete

- [x] **SKILL.md Section 1.1** - Fix GitHub MCP syntax
  - [x] Change `github.list_*` to `github.github_list_*`
  - [x] Change `github.create_*` to `github.github_create_*`
  - [x] Use backticks in call_tool_chain examples
  - [x] Add Docker prerequisite note
  - [x] Expand tool list (PR, Issues, Repo, CI/CD)

- [x] **finish_workflows.md Option 2** - Update PR creation section
  - [x] Fix commented GitHub MCP syntax
  - [x] Add proper example with correct call_tool_chain syntax
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## P1 - Should Complete

- [x] **shared_patterns.md** - Add GitHub MCP section
  - [x] Add Section 9: GitHub MCP Patterns
  - [x] Document issue management pattern
  - [x] Document PR review pattern
  - [x] Document CI/CD status pattern

- [x] **quick_reference.md** - Add quick reference
  - [x] Add GitHub MCP commands section (Section 13)
  - [x] Add decision guide (local git vs GitHub MCP)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## P2 - Nice to Have

- [x] **pr_template.md** - Review for updates
  - [x] Renamed section 14 to "Creating PRs Programmatically"
  - [x] Added GitHub MCP alternative example
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:verification -->
## Verification

- [x] All examples use correct syntax: `github.github_{tool}({...})`
- [x] All examples use backticks (not double quotes) in call_tool_chain
- [x] Docker prerequisite mentioned in SKILL.md
- [x] Cross-references between files are accurate
- [x] No broken markdown formatting
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:syntax-check -->
## Syntax Verification Checklist

For each file, verified:
- [x] Tool name format: `github.github_{tool_name}`
- [x] call_tool_chain uses template literals (backticks)
- [x] Object parameters use correct JavaScript syntax
- [x] Comments explain when to use GitHub MCP vs alternatives
<!-- /ANCHOR:syntax-check -->

---

<!-- ANCHOR:summary -->
## Files Modified

| File | Changes Made |
|------|-------------|
| SKILL.md | Rewrote Section 1.1 with correct syntax, expanded tools, prerequisites |
| finish_workflows.md | Updated Option 2 with GitHub MCP alternative |
| shared_patterns.md | Added Section 9: GitHub MCP Patterns |
| quick_reference.md | Added Section 13: GitHub MCP Quick Reference |
| pr_template.md | Updated Section 14 with GitHub MCP example |

## Completion Status

**Date:** 2025-12-23
**Status:** COMPLETE
<!-- /ANCHOR:summary -->

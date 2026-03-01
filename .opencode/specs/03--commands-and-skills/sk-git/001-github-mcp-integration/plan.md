---
title: "Implementation Plan: GitHub MCP Integration [001-github-mcp-integration/plan]"
description: "Current (Wrong)"
trigger_phrases:
  - "implementation"
  - "plan"
  - "github"
  - "mcp"
  - "integration"
  - "032"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Implementation Plan: GitHub MCP Integration

<!-- ANCHOR:summary -->
## Phase 1: SKILL.md Updates (High Priority)

### Task 1.1: Rewrite Section 1.1 GitHub Integration
- Fix call_tool_chain syntax (backticks, correct tool naming)
- Expand tool list with all major GitHub MCP tools
- Add Docker prerequisite note
- Add decision guidance: when to use GitHub MCP vs gh CLI vs local git

**Current (Wrong):**
```javascript
call_tool_chain("github.list_pull_requests({ owner: 'owner', repo: 'repo', state: 'open' })")
```

**Corrected:**
```javascript
call_tool_chain(`github.github_list_pull_requests({ owner: 'owner', repo: 'repo', state: 'open' })`)
```
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:phases -->
## Phase 2: finish_workflows.md Updates (High Priority)

### Task 2.1: Update Option 2 (Push and Create PR)
- Fix commented GitHub MCP code syntax
- Make GitHub MCP a documented alternative (not just comment)
- Add complete example with correct syntax

## Phase 3: shared_patterns.md Updates (Medium Priority)

### Task 3.1: Add GitHub MCP Patterns Section
- Add new section "9. GitHub MCP Patterns"
- Document patterns for:
  - Issue management
  - PR reviews
  - CI/CD status checks
  - Remote file reading

## Phase 4: quick_reference.md Updates (Medium Priority)

### Task 4.1: Add GitHub MCP Quick Reference
- Add section with common GitHub MCP commands
- Quick decision guide: local git vs GitHub MCP

## Phase 5: Review & Verification

### Task 5.1: Review pr_template.md
- Check if any updates needed for GitHub MCP mention

### Task 5.2: Verify All Changes
- Ensure consistent syntax across all files
- Verify examples are copy-paste ready
- Check cross-references between files
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:files -->
## Files to Modify

| File | Changes |
|------|---------|
| SKILL.md | Rewrite Section 1.1 |
| finish_workflows.md | Update Option 2 section |
| shared_patterns.md | Add new Section 9 |
| quick_reference.md | Add new section |
| pr_template.md | Minor review (if needed) |
<!-- /ANCHOR:files -->

---

<!-- ANCHOR:effort -->
## Estimated Effort

- Phase 1: 15 minutes
- Phase 2: 10 minutes
- Phase 3: 15 minutes
- Phase 4: 10 minutes
- Phase 5: 10 minutes
- **Total: ~60 minutes**
<!-- /ANCHOR:effort -->

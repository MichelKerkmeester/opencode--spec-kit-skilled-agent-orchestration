---
title: "GitHub MCP Integration for sk-git Skill [001-github-mcp-integration/spec]"
description: "Integrate the GitHub MCP server (configured in .utcp_config.json) into the sk-git skill documentation, providing correct syntax for Code Mode access and comprehensive tool cover..."
trigger_phrases:
  - "github"
  - "mcp"
  - "integration"
  - "for"
  - "git"
  - "spec"
  - "032"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# GitHub MCP Integration for sk-git Skill

<!-- ANCHOR:metadata -->
## Overview

Integrate the GitHub MCP server (configured in `.utcp_config.json`) into the sk-git skill documentation, providing correct syntax for Code Mode access and comprehensive tool coverage.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## Problem Statement

The sk-git skill currently has:
1. **Incorrect syntax** in SKILL.md Section 1.1 for GitHub MCP tool calls
2. **Incomplete tool coverage** - only mentions a few tools
3. **Missing patterns** in shared_patterns.md for GitHub remote operations
4. **No quick reference** for GitHub MCP commands
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## Scope

### In Scope
- Update SKILL.md Section 1.1 with correct Code Mode syntax
- Update finish_workflows.md Option 2 with correct GitHub MCP examples
- Add GitHub MCP patterns to shared_patterns.md
- Add GitHub MCP section to quick_reference.md
- Document when to use local git vs GitHub MCP

### Out of Scope
- Creating new skills
- Modifying the GitHub MCP configuration
- Changes to other skills
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:technical -->
## Technical Details

### Code Mode Access Pattern
Based on verified pattern from other MCP tools:
```
{manual_name}.{manual_name}_{tool_name}(args)
```

**Correct GitHub MCP syntax:**
```javascript
call_tool_chain(`github.github_create_pull_request({
  owner: 'owner',
  repo: 'repo',
  title: 'feat: add feature',
  head: 'feature-branch',
  base: 'main',
  body: 'Description here'
})`)
```

### Key GitHub MCP Tools

| Category | Tools |
|----------|-------|
| **Pull Requests** | create_pull_request, list_pull_requests, get_pull_request, merge_pull_request, create_pull_request_review |
| **Issues** | create_issue, get_issue, list_issues, search_issues, add_issue_comment |
| **Repository** | get_file_contents, create_branch, search_repositories |
| **CI/CD** | list_workflow_runs, get_job_logs |

### Usage Guidance

| Operation Type | Tool | Rationale |
|---------------|------|-----------|
| Commit, diff, status, log | Local git (Bash) | Faster, no network required |
| PR creation, review | GitHub MCP or gh CLI | Remote operation |
| Issue management | GitHub MCP | Remote state queries |
| CI/CD status | GitHub MCP | Check workflow runs |
<!-- /ANCHOR:technical -->

---

<!-- ANCHOR:success-criteria -->
## Success Criteria

- [ ] All GitHub MCP tool calls use correct syntax: `github.github_{tool}({...})`
- [ ] Docker prerequisite documented
- [ ] Clear guidance on local git vs GitHub MCP
- [ ] All 5 target files updated
- [ ] Examples are copy-paste ready
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:dependencies -->
## Dependencies

- Docker must be running for GitHub MCP to work
- GitHub PAT configured in `.utcp_config.json`
<!-- /ANCHOR:dependencies -->

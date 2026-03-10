---
title: GitHub MCP Integration - Remote Operations Reference
description: Programmatic access to GitHub's remote operations via Code Mode including PRs, issues, and repository management.
---

# GitHub MCP Integration - Remote Operations Reference

Programmatic access to GitHub's remote operations via Code Mode (`call_tool_chain`).

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

GitHub MCP Server provides full CRUD access to GitHub remote operations from within the sk-git workflow. All calls go through Code Mode's `call_tool_chain` interface using TypeScript.

**Prerequisites**: PAT configured in `.utcp_config.json` with appropriate scopes (repo, issues, pull_requests).
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:tool-selection -->
## 2. TOOL SELECTION GUIDE

| Operation                        | Tool                   | Rationale                               |
| :------------------------------- | :--------------------- | :-------------------------------------- |
| commit, diff, status, log, merge | Local `git` (Bash)     | Faster, no network required             |
| worktree management              | Local `git` (Bash)     | Local filesystem operation              |
| Create/list PRs                  | `gh` CLI OR GitHub MCP | Both work; gh CLI simpler for basic ops |
| PR reviews, comments             | GitHub MCP             | Richer API for review workflows         |
| Issue management                 | GitHub MCP             | Full CRUD on issues                     |
| CI/CD status, logs               | GitHub MCP             | Access workflow runs and job logs       |
| Search repos/code remotely       | GitHub MCP             | Cross-repo searches                     |

**Best Practice**: Prefer local `git` commands for local operations (faster, offline-capable). Use GitHub MCP for remote state queries and collaboration features.
<!-- /ANCHOR:tool-selection -->

---

<!-- ANCHOR:available-tools -->
## 3. AVAILABLE TOOLS

**Access Pattern:** `github.github_{tool_name}({...})`

| Category          | Tools                                                                                                                                                                                                                                                                                                                                                           | Description                                                                       |
| :---------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **Pull Requests** | `github_create_pull_request`<br>`github_list_pull_requests`<br>`github_get_pull_request`<br>`github_merge_pull_request`<br>`github_create_pull_request_review`<br>`github_get_pull_request_files`<br>`github_get_pull_request_status`<br>`github_update_pull_request_branch`<br>`github_get_pull_request_comments`<br>`github_get_pull_request_reviews` | Create, list, merge PRs; add reviews; get files, status, and reviews |
| **Issues**        | `github_create_issue`<br>`github_get_issue`<br>`github_list_issues`<br>`github_search_issues`<br>`github_add_issue_comment`<br>`github_update_issue`                                                                                                                                                                                                            | Full issue lifecycle management                                                   |
| **Repository**    | `github_get_file_contents`<br>`github_create_branch`<br>`github_search_repositories`<br>`github_list_commits`                                                                                                                                                                                                                                                   | Read files, manage branches, search. Do not create branches via GitHub MCP; use local `git worktree add -b ...` |

> **Note**: CI/CD workflow status and branch listing require the `gh` CLI:
> - `gh run list` - List workflow runs
> - `gh run view <id>` - View specific run
> - `gh api repos/{owner}/{repo}/branches` - List branches
<!-- /ANCHOR:available-tools -->

---

<!-- ANCHOR:usage-examples -->
## 4. USAGE EXAMPLES

```typescript
// List open PRs
call_tool_chain({
  code: `await github.github_list_pull_requests({
    owner: 'owner',
    repo: 'repo',
    state: 'open'
  })`
})

// Create PR with full details
call_tool_chain({
  code: `await github.github_create_pull_request({
    owner: 'owner',
    repo: 'repo',
    title: 'feat(auth): add OAuth2 login',
    head: 'feature/oauth',
    base: 'main',
    body: '## Summary\\n- Implements OAuth2 flow\\n- Adds token management'
  })`
})

// Get issue details
call_tool_chain({
  code: `await github.github_get_issue({
    owner: 'owner',
    repo: 'repo',
    issue_number: 123
  })`
})

// Get files changed in PR
call_tool_chain({
  code: `await github.github_get_pull_request_files({
    owner: 'owner',
    repo: 'repo',
    pull_number: 42
  })`
})

// Get PR status checks
call_tool_chain({
  code: `await github.github_get_pull_request_status({
    owner: 'owner',
    repo: 'repo',
    pull_number: 42
  })`
})
```
<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:error-handling -->
## 5. ERROR HANDLING

### Failed PR Creation

```typescript
// Handle PR creation failures
call_tool_chain({
  code: `
    try {
      const result = await github.github_create_pull_request({
        owner: 'owner',
        repo: 'repo',
        title: 'feat: new feature',
        head: 'feature-branch',
        base: 'main',
        body: 'Description'
      });
      return result;
    } catch (error) {
      // Common errors:
      // - 422: Branch doesn't exist or no commits between branches
      // - 403: Insufficient permissions
      // - 404: Repository not found
      return { error: error.message };
    }
  `
})
```

### Merge Conflicts

```typescript
// Check for merge conflicts before merging
call_tool_chain({
  code: `
    const pr = await github.github_get_pull_request({
      owner: 'owner',
      repo: 'repo',
      pull_number: 42
    });

    if (pr.mergeable === false) {
      console.log('Merge conflict detected. Resolve before merging.');
      // Option 1: Update branch from base
      await github.github_update_pull_request_branch({
        owner: 'owner',
        repo: 'repo',
        pull_number: 42
      });
      // Option 2: Resolve conflicts locally
      // git fetch origin main && git merge origin/main
    }
    return pr;
  `
})
```
<!-- /ANCHOR:error-handling -->

---

<!-- ANCHOR:related-resources -->
## 6. RELATED RESOURCES

**Internal References**:
- [quick_reference.md](./quick_reference.md) - GitHub MCP quick reference commands
- [shared_patterns.md](./shared_patterns.md) - GitHub MCP patterns
- [finish_workflows.md](./finish_workflows.md) - PR creation in finish workflow

**External References**:
- [GitHub REST API](https://docs.github.com/en/rest)
- [GitHub CLI](https://cli.github.com/)
<!-- /ANCHOR:related-resources -->

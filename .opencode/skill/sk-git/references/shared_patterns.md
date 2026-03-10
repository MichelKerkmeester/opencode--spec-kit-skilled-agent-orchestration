---
title: Shared Patterns - Cross-Workflow Reference
description: Common patterns, commands, and conventions used across all git workflows.
---

# Shared Patterns - Cross-Workflow Reference

Common patterns, commands, and conventions used across all git workflows.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This reference consolidates common patterns, commands, and conventions used across all git workflows (worktrees, commits, and finish). Use this as a quick lookup for branch naming, git commands, Conventional Commits format, and error handling patterns.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:branch-naming-conventions -->
## 2. BRANCH NAMING CONVENTIONS

### Temporary Branches (Main-Focused Workflow)

**Pattern**: `temp/<id>`

**Purpose**: Short-lived branches that merge back to main immediately

**Examples**:
```bash
temp/modal-fix
temp/auth-bug
temp/quick-refactor
```

**Lifecycle**:
1. Create from main
2. Implement change
3. Commit work
4. Run tests
5. Merge back to main
6. Delete branch

**Best for**: 80% of development work


### Feature Branches (Long-Running Work)

**Pattern**: `feature/<name>`

**Purpose**: Long-running features requiring PR review

**Examples**:
```bash
feature/user-auth
feature/payment-integration
feature/dashboard-redesign
```

**Lifecycle**:
1. Create from main
2. Develop feature (multiple commits)
3. Run tests
4. Push and create PR
5. Code review
6. Merge via PR
7. Delete branch after merge

**Best for**: Major features, team collaboration


### Experimental Branches

**Pattern**: Detached HEAD (no branch)

**Purpose**: Quick experiments without branch pollution

**Command**:
```bash
git worktree add --detach .worktrees/experiment main
```

**Lifecycle**:
1. Create detached HEAD worktree
2. Experiment with changes
3. If keeping: Create branch and commit
4. If discarding: Remove worktree
5. No branch cleanup needed (never created)

**Best for**: Throwaway work, proof-of-concepts

---

<!-- /ANCHOR:branch-naming-conventions -->
<!-- ANCHOR:git-command-reference -->
## 3. GIT COMMAND REFERENCE

### Worktree Operations

**List worktrees**:
```bash
git worktree list
```

**Create worktree with branch**:
```bash
git worktree add <path> -b <branch-name>
```

**Create worktree from existing branch**:
```bash
git worktree add <path> <existing-branch>
```

**Create detached HEAD worktree**:
```bash
git worktree add --detach <path> <commit>
```

**Remove worktree**:
```bash
git worktree remove <path>
```

**Prune stale worktree references**:
```bash
git worktree prune
```


### Commit Operations

**Check status**:
```bash
git status --short                 # Concise status
git status                         # Full status
```

**View changes**:
```bash
git diff                           # Unstaged changes
git diff --cached                  # Staged changes
git diff --name-only               # Changed file names only
```

**Stage files**:
```bash
git add <specific-files>           # Targeted staging (preferred)
git add src/ tests/                # Stage directories
git add -p                         # Interactive staging
```

**Unstage files**:
```bash
git reset HEAD <file>              # Unstage specific file
git reset HEAD .                   # Unstage all
```

**Commit**:
```bash
git commit -m "type(scope): description"
git commit -m "Subject" -m "Body"
git commit -v                      # Commit with diff in editor
```

**Amend last commit** (use sparingly):
```bash
git commit --amend                 # Modify last commit
git commit --amend --no-edit       # Keep message, add changes
```


### Branch Operations

**Policy note**: Never create new branches directly with `git branch`, `git checkout` plus `-b`, or `git switch` plus `-c`. When a new branch is needed, create it through `git worktree add -b ...`.

**List branches**:
```bash
git branch                         # Local branches
git branch -a                      # All branches (local + remote)
git branch -r                      # Remote branches only
```

**Switch branches**:
```bash
git checkout <branch-name>
git switch <branch-name>           # Modern alternative
```

**Delete branch**:
```bash
git branch -d <branch-name>        # Safe delete (merged only)
git branch -D <branch-name>        # Force delete (any state)
```

**Rename branch**:
```bash
git branch -m <old-name> <new-name>
git branch -m <new-name>           # Rename current branch
```


### Merge & Integration Operations

**Merge branch**:
```bash
git checkout main
git pull                           # Update main first
git merge <feature-branch>
```

**Abort merge** (if conflicts):
```bash
git merge --abort
```

**Check merge base**:
```bash
git merge-base <branch1> <branch2>
```


### Remote Operations

**Push branch**:
```bash
git push -u origin <branch-name>   # First push (set upstream)
git push                           # Subsequent pushes
```

**Pull changes**:
```bash
git pull                           # Fetch + merge
git pull --rebase                  # Fetch + rebase
```

**Check remotes**:
```bash
git remote -v                      # List remotes
git remote show origin             # Show remote details
```

---

<!-- /ANCHOR:git-command-reference -->
<!-- ANCHOR:conventional-commits-format -->
## 4. CONVENTIONAL COMMITS FORMAT

### Structure

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat(auth): add OAuth2 login` |
| `fix` | Bug fix | `fix(api): handle null response` |
| `refactor` | Code restructuring | `refactor: extract validation logic` |
| `docs` | Documentation | `docs: update API reference` |
| `style` | Formatting changes | `style: fix indentation` |
| `test` | Add/update tests | `test: add user service tests` |
| `chore` | Build, deps, tooling | `chore: update dependencies` |
| `perf` | Performance improvement | `perf: optimize query caching` |
| `ci` | CI/CD changes | `ci: add deployment workflow` |

### Scope (Optional)

Component or area affected:
- `auth` - Authentication
- `api` - API layer
- `ui` - User interface
- `db` - Database
- `config` - Configuration

### Description

- Use imperative mood: "add" not "added"
- Lowercase after colon
- No period at end
- Under 50 characters
- Specific and descriptive

### Body (Optional)

- Explain **what** and **why**, not how
- Wrap at 72 characters
- Separate from subject with blank line

### Footer (Optional)

**Breaking changes**:
```
BREAKING CHANGE: authentication now requires API key
```

**Issue references**:
```
Fixes #123
Closes #456
Related to #789
```

### Complete Examples

**Feature with body**:
```
feat(auth): add OAuth2 login support

Implements OAuth2 authentication flow to replace basic auth.
Improves security and enables SSO integration.
```

**Bug fix with issue**:
```
fix(api): handle null response in error handler

Prevents crash when error response body is null.

Fixes #234
```

**Breaking change**:
```
feat(api): change response format to JSON

Standardizes all API responses to use JSON format.

BREAKING CHANGE: XML response format no longer supported.
Clients must update to handle JSON responses.
```

---

<!-- /ANCHOR:conventional-commits-format -->
<!-- ANCHOR:common-git-patterns -->
## 5. COMMON GIT PATTERNS

### Pattern 1: Quick Fix Workflow

```bash
# 1. Create worktree with temp branch
git worktree add .worktrees/quick-fix -b temp/quick-fix main

# 2. Navigate and fix
cd .worktrees/quick-fix
# ... make changes ...

# 3. Commit
git add <files>
git commit -m "fix: description"

# 4. Run tests
npm test  # or appropriate test command

# 5. Merge back to main
cd ../..
git checkout main
git merge temp/quick-fix

# 6. Cleanup
git branch -d temp/quick-fix
git worktree remove .worktrees/quick-fix
```


### Pattern 2: Feature Branch with PR

```bash
# 1. Create worktree with feature branch
git worktree add .worktrees/new-feature -b feature/new-feature

# 2. Navigate and develop
cd .worktrees/new-feature
# ... develop feature (multiple commits) ...

# 3. Commit changes
git add <files>
git commit -m "feat: description"

# 4. Run tests
npm test

# 5. Push and create PR
git push -u origin feature/new-feature
gh pr create --title "feat: description" --body "..."

# 6. Cleanup worktree (keep branch for PR)
cd ../..
git worktree remove .worktrees/new-feature
```


### Pattern 3: Experimental Work

```bash
# 1. Create detached HEAD worktree
git worktree add --detach .worktrees/experiment main

# 2. Experiment
cd .worktrees/experiment
# ... try different approach ...

# 3a. If keeping: Create a new worktree and branch
git worktree add ../new-approach -b feature/new-approach HEAD
cd ../new-approach
git add .
git commit -m "feat: experimental approach"

# 3b. If discarding: Just remove
cd ../..
git worktree remove .worktrees/experiment
```

---

<!-- /ANCHOR:common-git-patterns -->
<!-- ANCHOR:error-handling-patterns -->
## 6. ERROR HANDLING PATTERNS

### Pattern: Tests Fail After Changes

```bash
# Don't proceed with merge/PR
# Instead:

# 1. Review failures
npm test

# 2. Fix issues
# ... address test failures ...

# 3. Commit fixes
git add <files>
git commit -m "fix: address test failures"

# 4. Re-run tests
npm test

# 5. Only then proceed with integration
```


### Pattern: Merge Conflicts

```bash
# 1. Attempt merge
git merge feature/branch
# CONFLICT detected

# 2. View conflicts
git status
git diff --name-only --diff-filter=U

# 3. Resolve conflicts manually
# Edit conflicted files

# 4. Mark as resolved
git add <resolved-files>

# 5. Complete merge
git commit

# 6. Verify with tests
npm test
```


### Pattern: Undo Last Commit (Not Pushed)

```bash
# Keep changes, undo commit
git reset --soft HEAD~1

# Undo commit and changes (DANGEROUS)
git reset --hard HEAD~1

# Amend commit instead
git commit --amend
```


### Pattern: Detached HEAD Recovery

**Symptom**: `You are in 'detached HEAD' state`

```bash
# 1. Check current state
git status
# HEAD detached at abc1234

# 2. If you have uncommitted changes you want to keep:
git stash

# 3. Create a recovery worktree and branch to save work
git worktree add ../recovery -b recovery-branch HEAD

# 4. Restore stashed changes in the recovery worktree (if any)
cd ../recovery
git stash pop

# 5. Return to main branch
cd -
git checkout main

# 6. Merge recovery branch if needed
git merge recovery-branch
git branch -d recovery-branch
```


### Pattern: Worktree Branch Already Exists

**Symptom**: `fatal: 'temp/feature' is already checked out`

```bash
# 1. List existing worktrees
git worktree list

# 2. Option A: Use different branch name
git worktree add .worktrees/feature -b temp/feature-v2 main

# 3. Option B: Remove existing worktree first
git worktree remove .worktrees/old-feature
git branch -d temp/feature
git worktree add .worktrees/feature -b temp/feature main

# 4. Option C: Continue work in existing worktree
cd .worktrees/old-feature  # Navigate to existing
```


### Pattern: Failed Push (Remote Rejected)

**Symptom**: `! [rejected] main -> main (non-fast-forward)`

```bash
# 1. Fetch latest changes
git fetch origin

# 2. Option A: Rebase (cleaner history)
git rebase origin/main
# Resolve any conflicts, then:
git push

# 3. Option B: Merge (preserves history)
git merge origin/main
# Resolve any conflicts, then:
git push

# NEVER: git push --force (on shared branches)
# Only use --force on personal feature branches
```


### Pattern: Stale Worktree References

**Symptom**: `fatal: '.worktrees/old' is a missing linked worktree`

```bash
# 1. List worktrees (shows missing ones)
git worktree list

# 2. Prune stale references
git worktree prune

# 3. Verify cleanup
git worktree list
```

---

<!-- /ANCHOR:error-handling-patterns -->
<!-- ANCHOR:quality-check-patterns -->
## 7. QUALITY CHECK PATTERNS

### Pre-Commit Checklist

```markdown
□ Files analyzed and categorized
□ Artifacts filtered out
□ Changes are atomic (one logical unit)
□ Commit message follows Conventional Commits
□ No sensitive information included
□ Tests pass
```


### Pre-Merge Checklist

```markdown
□ All tests pass
□ Base branch is up to date (git pull)
□ Feature branch rebased if needed
□ No merge conflicts
□ Commit history is clean
```


### Pre-PR Checklist

```markdown
□ All tests pass
□ Branch pushed to remote
□ PR title follows conventions
□ PR body includes summary
□ Related issues linked
□ Ready for review
```

---

<!-- /ANCHOR:quality-check-patterns -->
<!-- ANCHOR:file-type-patterns -->
## 8. FILE TYPE PATTERNS

### Files to Always Commit

- Source code (*.js, *.ts, *.py, *.java, etc.)
- Tests (*.test.*, *.spec.*, test_*.py)
- Configuration (package.json, requirements.txt, Cargo.toml)
- Documentation (README.md, API.md)
- Build config (.github/workflows/, Dockerfile)


### Files to Never Commit (Add to .gitignore)

- Dependencies (node_modules/, vendor/, venv/)
- Build artifacts (dist/, build/, target/)
- Environment files (.env, .env.local)
- OS files (.DS_Store, Thumbs.db)
- IDE files (.vscode/, .idea/)
- Logs (*.log, logs/)


### Files to Exclude from Commits (Don't Add to .gitignore)

- Task lists (TASK_*.md, TODO_*.md)
- Personal notes (notes.txt, scratch.md)
- Coverage reports (coverage/, htmlcov/)
- Debug files (debug_*.txt)
- Temporary analysis (analysis.md)

**Why not .gitignore?**: These are project-related files useful during development but not part of version history.

---

<!-- /ANCHOR:file-type-patterns -->
<!-- ANCHOR:github-mcp-patterns -->
## 9. GITHUB MCP PATTERNS

GitHub MCP provides programmatic access to GitHub's remote operations via Code Mode. Use these patterns for remote collaboration tasks.

### Prerequisites

- **PAT configured** in `.utcp_config.json` with appropriate scopes

### Access Pattern

```typescript
call_tool_chain({
  code: `await github.github_{tool_name}({...})`
})
```

### Pattern 1: Issue Management

```typescript
// Create issue
call_tool_chain({
  code: `await github.github_create_issue({
    owner: 'owner',
    repo: 'repo',
    title: 'Bug: Login fails on Safari',
    body: '## Description\\nLogin button unresponsive on Safari 17.\\n\\n## Steps\\n1. Navigate to login\\n2. Click login button',
    labels: ['bug', 'browser-compat']
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

// Search issues
call_tool_chain({
  code: `await github.github_search_issues({
    q: 'repo:owner/repo is:issue is:open label:bug'
  })`
})

// Add comment to issue
call_tool_chain({
  code: `await github.github_add_issue_comment({
    owner: 'owner',
    repo: 'repo',
    issue_number: 123,
    body: 'Investigated - this is related to WebKit changes in Safari 17.'
  })`
})
```


### Pattern 2: Pull Request Review

```typescript
// List PRs needing review
call_tool_chain({
  code: `await github.github_list_pull_requests({
    owner: 'owner',
    repo: 'repo',
    state: 'open'
  })`
})

// Get PR details with diff
call_tool_chain({
  code: `await github.github_get_pull_request({
    owner: 'owner',
    repo: 'repo',
    pull_number: 42
  })`
})

// Create PR review
call_tool_chain({
  code: `await github.github_create_pull_request_review({
    owner: 'owner',
    repo: 'repo',
    pull_number: 42,
    event: 'APPROVE',  // or 'REQUEST_CHANGES', 'COMMENT'
    body: 'LGTM! Clean implementation.'
  })`
})
```


### Pattern 3: CI/CD Status Check

> **Note**: CI/CD workflow status requires the `gh` CLI (not available in GitHub MCP):

```bash
# List recent workflow runs
gh run list --branch main --status completed

# Get specific workflow run
gh run view 12345

# Get job logs for debugging failures
gh run view 12345 --log
```


### Pattern 4: Remote File Access

```typescript
// Read file from remote repo (useful for checking configs)
call_tool_chain({
  code: `await github.github_get_file_contents({
    owner: 'owner',
    repo: 'repo',
    path: 'package.json',
    ref: 'main'  // branch, tag, or commit SHA
  })`
})

// Search repositories
call_tool_chain({
  code: `await github.github_search_repositories({
    q: 'oauth2 language:javascript stars:>100'
  })`
})
```

> **Note**: Branch listing requires the `gh` CLI:
> ```bash
> gh api repos/{owner}/{repo}/branches
> ```


### When to Use GitHub MCP vs Local Git

| Task | Use | Rationale |
|------|-----|-----------|
| Commit changes | Local `git` | Local operation, no network |
| Check status/diff | Local `git` | Faster, works offline |
| Create worktree | Local `git` | Filesystem operation |
| Create/manage PRs | GitHub MCP or `gh` | Remote collaboration |
| Review PRs | GitHub MCP | Rich review API |
| Track issues | GitHub MCP | Remote state management |
| Check CI status | GitHub MCP | Workflow monitoring |
| Read remote files | GitHub MCP | No need to clone |

---

<!-- /ANCHOR:github-mcp-patterns -->
<!-- ANCHOR:related-resources -->
## 10. RELATED RESOURCES

### Reference Files
- [worktree_workflows.md](./worktree_workflows.md) - Complete git-worktrees workflow documentation
- [commit_workflows.md](./commit_workflows.md) - Complete git-commit workflow documentation
- [finish_workflows.md](./finish_workflows.md) - Complete git-finish workflow documentation
- [quick_reference.md](./quick_reference.md) - One-page cheat sheet for all git workflows

### External Resources
- [Git Documentation](https://git-scm.com/doc) - Official git documentation home
- [Conventional Commits Specification](https://www.conventionalcommits.org/) - Standard commit message format
- [GitHub CLI Manual](https://cli.github.com/manual/) - Complete gh CLI reference
- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree) - Official git worktree documentation
- [Semantic Versioning](https://semver.org/) - Version numbering based on changes
<!-- /ANCHOR:related-resources -->

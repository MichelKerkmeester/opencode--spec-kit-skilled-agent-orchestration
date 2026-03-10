---
title: Git Workflows - Quick Reference
description: One-page cheat sheet for git-worktrees, git-commit, and git-finish workflows.
---

# Git Workflows - Quick Reference

One-page cheat sheet for git-worktrees, git-commit, and git-finish workflows.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This quick reference provides a one-page cheat sheet for the three git workflow phases: worktrees (workspace setup), commit (change tracking), and finish (integration).

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:skill-selection-flowchart -->
## 2. SKILL SELECTION FLOWCHART

```
┌─────────────────────────────────────┐
│ What are you doing?                 │
└─────────────┬───────────────────────┘
              │
      ┌───────┴───────┐
      │               │
  Starting        Ready to        Tests pass,
  new work?       commit?         ready to
                                  integrate?
      │               │               │
      ▼               ▼               ▼
git-worktrees   git-commit      git-finish
```

---

<!-- /ANCHOR:skill-selection-flowchart -->
<!-- ANCHOR:phase-1-worktree-setup-git-worktrees -->
## 3. PHASE 1: WORKTREE SETUP (GIT-WORKTREES)

### Quick Commands

```bash
# Default: temp branch (recommended)
git worktree add .worktrees/<name> -b temp/<name> main

# Feature branch (long-running)
git worktree add .worktrees/<name> -b feature/<name>

# Experimental (no branch)
git worktree add --detach .worktrees/<name> main

# List all worktrees
git worktree list

# Remove worktree
git worktree remove .worktrees/<name>
```

### 7-Step Workflow

1. **Gather inputs** - Task description, branch strategy
2. **Select directory** - Existing → AGENTS.md → Ask
3. **Verify safety** - Check `.gitignore` for project-local dirs
4. **Create worktree** - Strategy-dependent command
5. **Setup project** - Auto-detect and install dependencies
6. **Verify baseline** - Run tests (must pass)
7. **Report status** - Location, branch, tests

### Branch Strategies

| Strategy | When to Use | Example |
|----------|-------------|---------|
| `temp/*` (default) | 80% of work, merge back immediately | `temp/quick-fix` |
| `feature/*` | Long-running, needs PR | `feature/user-auth` |
| Detached HEAD | Experiments, throwaway | No branch created |

---

<!-- /ANCHOR:phase-1-worktree-setup-git-worktrees -->
<!-- ANCHOR:phase-2-commit-work-git-commit -->
## 4. PHASE 2: COMMIT WORK (GIT-COMMIT)

### Quick Commands

```bash
# Check status
git status --short

# Stage specific files (not git add .)
git add <specific-files>

# View staged changes
git diff --cached

# Commit with Conventional Commits
git commit -m "type(scope): description"

# Commit with body
git commit -m "Subject" -m "Body explaining why"
```

### 6-Step Workflow

1. **Analyze files** - Categorize changes
2. **Filter artifacts** - Exclude internal files (don't add to .gitignore)
3. **Identify patterns** - Single commit vs. multiple
4. **Determine strategy** - Atomic commits
5. **Write message** - Conventional Commits format
6. **Verify readiness** - Final checklist

### Conventional Commits Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `perf`, `ci`

**Rules**:
- Imperative mood ("add" not "added")
- Under 50 characters
- Lowercase after colon
- No period at end

**Example**:
```
feat(auth): add OAuth2 login support

Implements OAuth2 authentication flow to replace basic auth.
Improves security and enables SSO integration.
```

---

<!-- /ANCHOR:phase-2-commit-work-git-commit -->
<!-- ANCHOR:phase-3-complete-work-git-finish -->
## 5. PHASE 3: COMPLETE WORK (GIT-FINISH)

### Quick Commands

```bash
# Merge locally
git checkout main && git pull && git merge <branch>

# Create PR
git push -u origin <branch>
gh pr create --title "..." --body "..."

# Discard work
git checkout main && git branch -D <branch>

# Cleanup worktree
git worktree remove .worktrees/<name>
```

### 5-Step Workflow

1. **Verify tests** - Must pass (blocking gate)
2. **Determine base** - Usually `main` or `master`
3. **Present options** - 4 structured choices
4. **Execute choice** - Merge, PR, keep, or discard
5. **Cleanup worktree** - Remove for options 1, 2, 4

### 4 Options

```
1. Merge back to main locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work
```

**When to use**:
- Option 1: Solo project, simple change, temp branches
- Option 2: Team project, needs review, feature branches
- Option 3: Work in progress, need to switch contexts
- Option 4: Failed experiments, throwaway work

---

<!-- /ANCHOR:phase-3-complete-work-git-finish -->
<!-- ANCHOR:common-workflows -->
## 6. COMMON WORKFLOWS

### Workflow A: Quick Fix (Main-Focused)

```bash
# 1. Create temp branch worktree
git worktree add .worktrees/fix -b temp/fix main

# 2. Make changes
cd .worktrees/fix
# ... fix code ...

# 3. Commit
git add <files>
git commit -m "fix: description"

# 4. Test
npm test

# 5. Merge
cd ../.. && git checkout main && git merge temp/fix

# 6. Cleanup
git branch -d temp/fix
git worktree remove .worktrees/fix
```


### Workflow B: Feature with PR

```bash
# 1. Create feature branch worktree
git worktree add .worktrees/feature -b feature/name

# 2. Develop
cd .worktrees/feature
# ... implement feature ...

# 3. Commit
git add <files>
git commit -m "feat: description"

# 4. Test
npm test

# 5. Create PR
git push -u origin feature/name
gh pr create --title "feat: ..." --body "..."

# 6. Cleanup worktree (keep branch)
cd ../.. && git worktree remove .worktrees/feature
```


### Workflow C: Experiment

```bash
# 1. Create detached HEAD worktree
git worktree add --detach .worktrees/exp main

# 2. Experiment
cd .worktrees/exp
# ... try approach ...

# 3a. Keep: Create a new worktree and branch
git worktree add ../feature -b feature/name HEAD
cd ../feature
git add . && git commit -m "feat: experimental approach"

# 3b. Discard: Remove worktree
cd ../.. && git worktree remove .worktrees/exp
```

---

<!-- /ANCHOR:common-workflows -->
<!-- ANCHOR:decision-quick-reference -->
## 7. DECISION QUICK REFERENCE

| Scenario | Worktree Strategy | Commit Strategy | Finish Option |
|----------|-------------------|-----------------|---------------|
| Small fix | temp/* | Single commit | Option 1 (Merge) |
| Feature (solo) | temp/* | Multiple commits | Option 1 (Merge) |
| Feature (team) | feature/* | Multiple commits | Option 2 (PR) |
| Experiment | Detached HEAD | N/A or commit | Option 4 (Discard) |
| Refactor | temp/* or feature/* | Single/multiple | Option 1 or 2 |
| Bug fix | temp/* | Single commit | Option 1 or 2 |

---

<!-- /ANCHOR:decision-quick-reference -->
<!-- ANCHOR:essential-git-commands -->
## 8. ESSENTIAL GIT COMMANDS

### Worktree
```bash
git worktree add <path> -b <branch>    # Create with branch
git worktree add --detach <path>       # Create detached
git worktree list                      # List all
git worktree remove <path>             # Remove
git worktree prune                     # Clean stale refs
```

### Commit
```bash
git status --short                     # Concise status
git add <files>                        # Stage specific
git diff --cached                      # View staged
git commit -m "msg"                    # Commit
git reset HEAD <file>                  # Unstage
```

### Branch Inspection & Cleanup
```bash
git branch                             # List local
git branch -a                          # List all
git checkout <branch>                  # Switch
git branch -d <branch>                 # Delete (safe)
git branch -D <branch>                 # Force delete
```

### Merge & Remote
```bash
git checkout main && git pull          # Update main
git merge <branch>                     # Merge
git push -u origin <branch>            # Push new branch
gh pr create                           # Create PR
```

---

<!-- /ANCHOR:essential-git-commands -->
<!-- ANCHOR:rules -->
## 9. RULES

### ✅ ALWAYS
- Run baseline tests to completion (don't skip or timeout)
- Filter artifacts from commits (don't add to .gitignore)
- Follow Conventional Commits format
- Run tests before integration (finish: blocking gate)
- Use `git add <files>` not `git add .`
- Cleanup worktrees after merge/PR/discard

### ❌ NEVER
- Skip `.gitignore` verification for project-local worktrees
- Commit internal artifacts or temp files
- Use vague commit messages ("fix stuff", "changes")
- Proceed with failing tests
- Force delete branches without confirmation
- Cleanup worktree when user chooses "keep as-is"

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:troubleshooting -->
## 10. TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| Worktree creation fails | Check `git worktree list`, remove stale, `git worktree prune` |
| Tests fail in new worktree | Ask user: investigate, proceed, or abort |
| Can't stage files | Use `git add <files>`, not `git add .` |
| Commit message too long | Move details to body, keep subject <50 chars |
| Merge conflicts | `git status`, resolve manually, `git add`, `git commit` |
| PR creation fails | Check `gh auth status`, `gh auth login` |
| Worktree won't remove | Check for uncommitted changes, `git worktree unlock` |

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:file-structure-reference -->
## 11. FILE STRUCTURE REFERENCE

```
.worktrees/                 # Project-local worktrees (add to .gitignore)
  feature-name/             # Individual worktree
  quick-fix/
  experiment/

~/.config/superpowers/      # Global worktrees location
  worktrees/
    project-name/
      feature-name/
```

---

<!-- /ANCHOR:file-structure-reference -->
<!-- ANCHOR:checklists -->
## 12. CHECKLISTS

### Pre-Worktree Creation
- [ ] Directory location determined
- [ ] `.gitignore` verification (if project-local)
- [ ] Branch strategy selected
- [ ] Ready to install dependencies

### Pre-Commit
- [ ] Files analyzed and categorized
- [ ] Artifacts filtered out
- [ ] Conventional Commits format
- [ ] Changes are atomic
- [ ] No sensitive information

### Pre-Integration (Finish)
- [ ] All tests pass
- [ ] Base branch determined
- [ ] Appropriate option selected
- [ ] Worktree cleanup planned

---

<!-- /ANCHOR:checklists -->
<!-- ANCHOR:examples -->
## 13. EXAMPLES

### Good Commit Messages

```
feat(auth): add OAuth2 login support
fix(api): handle null response in error handler
refactor(utils): extract validation to middleware
docs: update API reference with new endpoints
chore(deps): update axios to v1.6.0
```

### Bad Commit Messages

```
fix stuff                          # Too vague
TASK-123: implement feature        # Internal reference
added new feature                  # Past tense, no type
Update                             # No description
```

### Good PR Titles

```
feat(auth): add OAuth2 authentication system
fix(api): resolve memory leak in data processing
refactor: restructure validation layer
```

---

<!-- /ANCHOR:examples -->
<!-- ANCHOR:github-mcp-quick-reference -->
## 14. GITHUB MCP QUICK REFERENCE

### Prerequisites
- PAT configured in `.utcp_config.json` with appropriate scopes

### Quick Commands

**Pull Requests**:
```javascript
// List open PRs
call_tool_chain(`github.github_list_pull_requests({ owner: 'o', repo: 'r', state: 'open' })`)

// Create PR
call_tool_chain(`github.github_create_pull_request({
  owner: 'o', repo: 'r', title: 'feat: add X', head: 'branch', base: 'main', body: 'Description'
})`)

// Merge PR
call_tool_chain(`github.github_merge_pull_request({ owner: 'o', repo: 'r', pull_number: 42 })`)
```

**Issues**:
```javascript
// Create issue
call_tool_chain(`github.github_create_issue({
  owner: 'o', repo: 'r', title: 'Bug: X fails', body: 'Steps to reproduce...'
})`)

// Search issues
call_tool_chain(`github.github_search_issues({ q: 'repo:o/r is:issue is:open label:bug' })`)
```

**CI/CD**:
```javascript
// Check workflow status
call_tool_chain(`github.github_list_workflow_runs({ owner: 'o', repo: 'r', branch: 'main' })`)

// Get job logs
call_tool_chain(`github.github_get_job_logs({ owner: 'o', repo: 'r', job_id: 123 })`)
```

### Decision Guide

| Task | Tool |
|------|------|
| commit, diff, status | Local `git` |
| Create/manage PRs | `gh` CLI or GitHub MCP |
| PR reviews | GitHub MCP |
| Issue tracking | GitHub MCP |
| CI/CD monitoring | GitHub MCP |

---

<!-- /ANCHOR:github-mcp-quick-reference -->
<!-- ANCHOR:related-resources -->
## 15. RELATED RESOURCES

### Reference Files
- [worktree_workflows.md](./worktree_workflows.md) - Complete git-worktrees workflow documentation
- [commit_workflows.md](./commit_workflows.md) - Complete git-commit workflow documentation
- [finish_workflows.md](./finish_workflows.md) - Complete git-finish workflow documentation
- [shared_patterns.md](./shared_patterns.md) - Common patterns and commands across workflows

### External Resources
- [Conventional Commits](https://www.conventionalcommits.org/) - Standard commit message format
- [Git Worktree Docs](https://git-scm.com/docs/git-worktree) - Official git worktree documentation
- [GitHub CLI Manual](https://cli.github.com/manual/) - Complete gh CLI reference
<!-- /ANCHOR:related-resources -->

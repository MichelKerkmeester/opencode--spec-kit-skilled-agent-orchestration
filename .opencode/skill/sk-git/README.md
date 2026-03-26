---
title: sk-git
description: Git workflow orchestrator guiding developers through workspace setup, clean commits, and work completion across git-worktrees, git-commit, and git-finish sub-skills.
trigger_phrases:
  - "git workflow orchestrator"
  - "conventional commits worktree"
  - "git workspace commit finish"
  - "git worktree branch setup"
  - "pull request commit hygiene"
---

# sk-git

> Git workflow orchestrator that guides developers through all three phases of a git development cycle: workspace setup, clean commits, and work completion.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

1. [OVERVIEW](#1--overview)
2. [QUICK START](#2--quick-start)
3. [FEATURES](#3--features)
4. [STRUCTURE](#4--structure)
5. [CONFIGURATION](#5--configuration)
6. [USAGE EXAMPLES](#6--usage-examples)
7. [TROUBLESHOOTING](#7--troubleshooting)
8. [FAQ](#8--faq)
9. [RELATED DOCUMENTS](#9--related-documents)
<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What This Skill Does

`sk-git` is the unified orchestrator for all git-based development work. It manages three sequential phases: workspace isolation (git worktrees or current branch), commit hygiene (Conventional Commits with artifact filtering), and work completion (PR creation, merging, and branch cleanup). A smart router loads only the references relevant to the current phase, so the agent receives focused guidance rather than the full reference library on every invocation.

The skill enforces a critical behavioral rule: the AI must never autonomously decide whether to create a new branch or work on the current one. Every session that involves new work requires an explicit workspace choice from the user before any git commands run. When a new branch is needed, it must be created only through `git worktree add -b ...`, never through `git branch`, `git checkout -b`, or `git switch -c`. This prevents silent workspace decisions that cause branch pollution or lost work.

Commit messages follow a deterministic Conventional Commits format with a first-match type and scope inference algorithm. The same diff and metadata always produce the same commit subject. Artifact filtering runs before staging to exclude build files, coverage reports, and other non-public outputs. Quality gates block progression at pre-commit, pre-merge, and pre-PR checkpoints, with a post-merge cleanup step to remove worktrees and branches.

### Key Statistics

| Metric | Value |
|--------|-------|
| Version | 1.1.0.0 |
| Phases | 3 (Workspace Setup, Work and Commit, Complete and Integrate) |
| Sub-skills | 3 (git-worktrees, git-commit, git-finish) |
| Reference documents | 6 (worktree, commit, finish, shared patterns, quick reference, GitHub MCP) |
| Asset templates | 3 (worktree checklist, commit message template, PR template) |
| Quality gates | 4 (pre-commit, pre-merge, pre-PR, post-merge) |
| Commit type options | 8 (merge, release, docs, fix, feat, refactor, test, chore) |
| Allowed tools | Read, Bash, mcp__code_mode__call_tool_chain |

### How This Compares

| Without sk-git | With sk-git |
|----------------|-------------|
| AI autonomously picks branch strategy, often wrong | User explicitly confirms worktree vs. current branch before any git command runs |
| Inconsistent commit messages across sessions | Deterministic first-match type/scope logic produces identical subjects for identical diffs |
| Build artifacts and coverage reports end up committed | Artifact filtering runs before staging, excluding non-public outputs |
| No gate between development and integration | Pre-merge test gate blocks integration until tests pass |
| Branches and worktrees accumulate indefinitely | Post-merge cleanup step removes local and remote feature branches and worktree directories |
| GitHub operations require manual CLI assembly | GitHub MCP integration provides programmatic PR, issue, and CI/CD access |

### Key Features

| Feature | Description |
|---------|-------------|
| 3-phase lifecycle | Workspace Setup, Work and Commit, Complete and Integrate with clear phase transitions |
| Workspace choice enforcement | Always asks the user before choosing git worktree or current branch |
| Worktree-only branch creation | New branches created only via `git worktree add -b ...`, never directly |
| Deterministic commit logic | First-match type and scope inference. Same diff produces the same subject every time. |
| Artifact filtering | Excludes build files, coverage, and non-public outputs before staging |
| 4 quality gates | Pre-commit, pre-merge, pre-PR, and post-merge checkpoints |
| GitHub MCP integration | Programmatic access to PRs, issues, and CI/CD via Code Mode |
| Parallel work support | Multiple worktrees for simultaneous feature development |
| Session persistence | Remembers workspace preference for the duration of the session |
| Smart routing | Loads only the references relevant to the detected phase |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Invoke the skill.** Gate 2 routing triggers automatically on keyword detection. You can also invoke it directly by reading SKILL.md.

```bash
# Gate 2 auto-routing (preferred)
skill_advisor.py "commit my changes" --threshold 0.8

# Direct invocation
Read(".opencode/skill/sk-git/SKILL.md")
```

**Step 2: Identify your phase.** The skill routes to the appropriate sub-workflow based on your current state.

- Starting new work: Phase 1 (Workspace Setup, git-worktrees)
- Ready to commit staged changes: Phase 2 (Work and Commit, git-commit)
- Work complete, ready to integrate: Phase 3 (Complete and Integrate, git-finish)

**Step 3: Confirm workspace choice (Phase 1 only).** The AI will ask you to choose explicitly before creating anything.

- Option A: Create a git worktree (isolated workspace for parallel or complex work)
- Option B: Work on current branch (quick fixes and simple exploration)

**Step 4: Follow the phase workflow.** Each phase has a documented step sequence. The skill loads the relevant reference document for your phase (worktree, commit, or finish workflow).

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The central design decision in `sk-git` is enforced workspace choice. Most AI assistants will silently pick a branch strategy, often opting for a new branch when that adds unnecessary overhead, or staying on the current branch when isolation is clearly needed. This skill refuses to make that call. Every session that involves new work triggers an explicit user prompt before any git command runs. The choice persists for the duration of the session.

Branch creation follows a single permitted path: `git worktree add -b branch-name`. The three direct branch creation commands (`git branch`, `git checkout -b`, and `git switch -c`) are never used. This means branch creation and worktree setup happen atomically. There is no state where a branch exists but no worktree has been set up for it.

The commit message algorithm is deterministic by design. Given the same diff and file metadata, it always produces the same commit subject. Type inference uses first-match ordering: merge commits, release tags, docs-only changes, bug fixes, new features, refactoring, tests, and chores, in that order. Scope inference maps file paths to logical scopes using the same first-match approach, resolving to the skill name, agent directory, command directory, or top-level path. The result is a commit history that reads consistently regardless of which session or AI instance produced it.

Artifact filtering runs as a pre-staging check. Before committing, the skill identifies and excludes build outputs, coverage reports, and other generated files that should never appear in the public commit history. This is structural, not advisory. Those files do not get staged.

The finish phase integrates a test gate. Work cannot be merged or submitted as a PR if tests are failing. After successful integration, the cleanup step removes the worktree directory, the local feature branch, and the remote tracking branch. No branch accumulation occurs over time.

GitHub MCP integration covers the full remote workflow without requiring the user to assemble CLI commands. PR creation, issue linking, review requests, and CI/CD status checks all happen through Code Mode's GitHub MCP provider.

### 3.2 FEATURE REFERENCE

**Phase routing**

| Phase | Intent Keywords | Primary Reference |
|-------|----------------|------------------|
| Workspace Setup (Phase 1) | worktree, workspace, parallel work, isolated, new feature | `references/worktree_workflows.md` |
| Work and Commit (Phase 2) | commit, staged, message, conventional commit | `references/commit_workflows.md` |
| Complete and Integrate (Phase 3) | finish, merge, pr, pull request, integrate, ship | `references/finish_workflows.md` |
| Shared Patterns | convention, pattern, reference, branch naming | `references/shared_patterns.md` |

**Workspace options**

| Option | Command | Best For |
|--------|---------|----------|
| A: Git worktree | `git worktree add -b type/description .worktrees/name` | Parallel work, complex features, long-running tasks |
| B: Current branch | (no command, work in place) | Quick fixes, exploration, single-task sessions |

**Commit type selection (first match wins)**

| Type | Triggers |
|------|----------|
| `merge` | Merge commits |
| `release` | Version strings (vX.Y.Z), release subjects |
| `docs` | Docs-only changes, README or CHANGELOG focus |
| `fix` | Bug, security, hotfix, error correction |
| `feat` | New behavior, support, or capability |
| `refactor` | Internal restructuring without behavior change |
| `test` | Test-only updates |
| `chore` | Fallback for operational or mixed maintenance work |

**Commit scope selection (first match wins)**

| Path Pattern | Scope |
|-------------|-------|
| `.opencode/skill/<name>/...` | `<name>` (the skill's own name) |
| `AGENTS.md` | `agents` |
| `README.md` only | `readme` |
| `opencode.json` or `.utcp_config.json` | `config` |
| `.opencode/agent/...` | `agents` |
| `.opencode/command/...` | `commands` |
| Docs-only set | `docs` |
| Fallback | Dominant top-level path or `repo` |

**Quality gates**

| Gate | Criteria | Blocking |
|------|----------|---------|
| Pre-commit | Artifacts excluded, message formatted correctly | Yes |
| Pre-merge | Tests pass, branch up-to-date with base | Yes |
| Pre-PR | Description complete, CI passing | Yes |
| Post-merge | Worktree removed, local and remote branches deleted | No |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```
.opencode/skill/sk-git/
  SKILL.md                              # Entry point with 8-section protocol and routing logic
  README.md                             # This file
  changelog/
    CHANGELOG.md                        # Skill change history
  references/
    worktree_workflows.md               # 7-step workspace creation workflow
    commit_workflows.md                 # 6-step commit workflow with artifact filtering
    finish_workflows.md                 # 5-step completion flow (merge, PR, cleanup)
    shared_patterns.md                  # Reusable git patterns and error recovery
    quick_reference.md                  # One-page cheat sheet for common operations
    github_mcp_integration.md           # GitHub MCP remote operations via Code Mode
  assets/
    worktree_checklist.md               # Pre-flight checklist for worktree creation
    commit_message_template.md          # Conventional Commits format guide
    pr_template.md                      # PR description template
```

**Key files**

| File | Purpose | When to read |
|------|---------|-------------|
| `SKILL.md` | Full protocol, routing logic, rules | Always (entry point) |
| `references/worktree_workflows.md` | 7-step workspace creation | Phase 1: new work or parallel features |
| `references/commit_workflows.md` | 6-step commit with artifact filtering | Phase 2: staging and committing |
| `references/finish_workflows.md` | 5-step completion flow | Phase 3: merge, PR, or discard |
| `references/shared_patterns.md` | Error recovery, conflict resolution | When stuck or encountering edge cases |
| `references/github_mcp_integration.md` | GitHub MCP tool usage | When working with remote PRs, issues, or CI |
| `assets/pr_template.md` | PR description structure | Before submitting any pull request |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Allowed Tools

| Tool | Purpose |
|------|---------|
| `Read` | Load skill references and asset templates |
| `Bash` | All local git operations (commit, diff, status, log, worktree) |
| `mcp__code_mode__call_tool_chain` | GitHub MCP operations (PRs, issues, CI/CD) |

### Tool Selection by Operation

| Operation | Tool |
|-----------|------|
| `git commit`, `git diff`, `git status`, `git log` | Local `git` via Bash |
| Worktree creation and management | Local `git` via Bash |
| Create or list pull requests | `gh` CLI or GitHub MCP via Code Mode |
| PR reviews, issue CRUD, CI/CD status | GitHub MCP via Code Mode |

### GitHub MCP Prerequisites

A personal access token (PAT) must be configured in `.utcp_config.json` with these scopes:

- `repo` (read and write repository content)
- `issues` (read and write issues)
- `pull_requests` (create and manage PRs)
- `workflow` (read CI/CD status)

### Branch Naming Convention

All worktree-created branches follow `type/short-description`:

| Type | Example Branch Name |
|------|---------------------|
| `feat` | `feat/add-oauth2-login` |
| `fix` | `fix/handle-null-user-response` |
| `docs` | `docs/update-install-guide` |
| `refactor` | `refactor/extract-auth-module` |
| `chore` | `chore/update-dependencies` |

### Worktree Directory Convention

Worktrees are created under `.worktrees/` in the repository root by default. The directory name matches the branch short-description: `.worktrees/add-oauth2-login`.

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Example 1: Full Workflow for a New Feature

Starting from scratch on a new feature, using an isolated worktree for parallel development.

```bash
# Phase 1: Create isolated workspace
git worktree add -b feat/add-oauth2-login .worktrees/add-oauth2-login main

# Confirm workspace in terminal and begin coding
cd .worktrees/add-oauth2-login

# Phase 2: Commit changes with Conventional Commits format
git add src/auth/oauth2.ts src/auth/types.ts
git commit -m "feat(auth): add OAuth2 login flow"

# Phase 3: Create PR and integrate
git push -u origin feat/add-oauth2-login
gh pr create --title "feat(auth): add OAuth2 login flow" --body "$(cat .opencode/skill/sk-git/assets/pr_template.md)"

# After merge: cleanup
git worktree remove .worktrees/add-oauth2-login
git branch -d feat/add-oauth2-login
git push origin --delete feat/add-oauth2-login
```

### Example 2: Quick Hotfix on Current Branch

A targeted bug fix that does not require an isolated workspace.

```bash
# Phase 2: Stage and commit the fix
git add src/api/user.ts
git commit -m "fix(api): handle null user response in getUser()"

# Phase 3: Create PR with issue link
gh pr create --title "fix(api): handle null user response" --body "Closes #123"
```

### Example 3: Parallel Features Across Two Worktrees

Two features in development simultaneously in separate terminals.

```bash
# Terminal A: Feature A workspace
git worktree add -b feat/feature-a .worktrees/feature-a main
cd .worktrees/feature-a
# ... code feature A ...
git commit -m "feat(payments): add stripe checkout integration"

# Terminal B: Feature B workspace
git worktree add -b feat/feature-b .worktrees/feature-b main
cd .worktrees/feature-b
# ... code feature B ...
git commit -m "feat(notifications): add email on order complete"

# Finish both sequentially after tests pass
git push -u origin feat/feature-a && gh pr create --title "feat(payments): add stripe checkout"
git push -u origin feat/feature-b && gh pr create --title "feat(notifications): add email on order"
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

| What you see | Common causes | Fix |
|-------------|---------------|-----|
| Merge conflicts the AI cannot resolve | Overlapping changes in both branches require a human decision on which version to keep | Escalate to the user. Do not attempt auto-resolution on semantic conflicts. |
| GitHub MCP returns 401 or 403 | PAT expired or missing required scopes | Regenerate PAT in GitHub settings and update `.utcp_config.json` with `repo`, `issues`, `pull_requests`, and `workflow` scopes |
| Worktree directory is locked or shows "already exists" | Previous worktree was not cleanly removed | Run `git worktree prune` then retry creation |
| CI/CD pipeline fails repeatedly on the same check | Infrastructure issue unrelated to the code change | Investigate the CI runner logs. Do not retry the commit. |
| Branch divergence exceeds 50 commits from base | Long-running branch has fallen too far behind main | Rebase or merge base branch incrementally before submitting a PR |
| Submodule conflicts appear during merge | Submodule pointer changed in both branches | Escalate. Submodule conflicts require coordinated decisions across repositories. |
| Commit subject is not deterministic across runs | Type or scope inference matched different conditions in different sessions | Review the type and scope tables in SKILL.md Section 4 and apply the first-match rule explicitly |

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Why does the skill always ask before creating a branch?**
A: Workspace strategy has real consequences. Creating an unnecessary worktree adds overhead. Staying on the current branch when parallel work is planned causes branch conflicts. The skill cannot know from context alone which is correct, so it requires explicit confirmation every time.

**Q: Why can I not use `git checkout -b` or `git switch -c` to create branches?**
A: Those commands create a branch in the current workspace without worktree isolation. This skill enforces worktree-only branch creation via `git worktree add -b ...` to keep workspace setup and branch creation atomic. If you need a branch in the current workspace only, use option B (work on current branch) and skip Phase 1 entirely.

**Q: What gets excluded by artifact filtering?**
A: Build outputs (`dist/`, `build/`, `out/`), coverage reports (`coverage/`, `*.lcov`), compiled assets, and any file matching common generated-output patterns. The exact list is in `references/commit_workflows.md`. If a legitimate file is being excluded, add it explicitly with `git add -f` and document the exception in the commit body.

**Q: When should I use the GitHub MCP vs. the `gh` CLI?**
A: Use `gh` CLI for simple PR creation and listing. Use GitHub MCP for operations that need structured data back (reading PR reviews, querying issue fields, checking CI run details) or for bulk operations across multiple PRs or issues.

**Q: How do I handle a PR that was merged but the worktree cleanup was skipped?**
A: Run `git worktree list` to see all active worktrees. Remove the stale one with `git worktree remove .worktrees/branch-name`. Then delete the local branch with `git branch -d branch-name` and the remote tracking branch with `git push origin --delete branch-name`. Run `git worktree prune` to clean up any metadata.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

### Skill References

| Document | Path | Purpose |
|----------|------|---------|
| Worktree workflows | `.opencode/skill/sk-git/references/worktree_workflows.md` | 7-step workspace creation with directory and branch strategies |
| Commit workflows | `.opencode/skill/sk-git/references/commit_workflows.md` | 6-step commit with artifact filtering and Conventional Commits |
| Finish workflows | `.opencode/skill/sk-git/references/finish_workflows.md` | 5-step completion: merge, PR, or discard |
| Shared patterns | `.opencode/skill/sk-git/references/shared_patterns.md` | Error recovery, conflict resolution, reusable commands |
| Quick reference | `.opencode/skill/sk-git/references/quick_reference.md` | One-page cheat sheet for common git operations |
| GitHub MCP integration | `.opencode/skill/sk-git/references/github_mcp_integration.md` | Programmatic GitHub operations via Code Mode |

### Asset Templates

| Template | Path | When to Use |
|----------|------|------------|
| Worktree checklist | `.opencode/skill/sk-git/assets/worktree_checklist.md` | Pre-flight verification before creating a worktree |
| Commit message template | `.opencode/skill/sk-git/assets/commit_message_template.md` | Reference for Conventional Commits format |
| PR template | `.opencode/skill/sk-git/assets/pr_template.md` | Structure for all pull request descriptions |

### Related Skills

| Skill | Relationship |
|-------|-------------|
| `system-spec-kit` | Spec folder creation pairs with git commit workflow. Reference spec folder in commit body. |
| `sk-code--opencode` | OpenCode system code standards that define what should and should not be committed |
| `sk-code--web` | Web implementation lifecycle that precedes git-finish in a web development session |

### Framework Reference

| Resource | Purpose |
|----------|---------|
| `AGENTS.md` (or `CLAUDE.md`) | Gate 2 (skill routing) and Gate 3 (file modification) behavioral framework |
| Spec Kit Memory MCP | Context preservation with `memory_search()` for recovering prior git session context |

<!-- /ANCHOR:related-documents -->

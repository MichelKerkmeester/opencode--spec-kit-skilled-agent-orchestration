---
title: Git Worktrees - Detailed Workflow Reference
description: Complete workflow documentation for creating isolated git workspaces with minimal branching.
---

# Git Worktrees - Detailed Workflow Reference

Complete workflow documentation for creating isolated git workspaces with minimal branching.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Git worktrees create isolated working directories sharing the same repository database. Each worktree can have a different branch checked out, allowing parallel work without context switching.

**Core principle**: Systematic directory selection + safety verification = reliable isolation

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:workspace-choice-enforcement -->
## 2. WORKSPACE CHOICE ENFORCEMENT

**This workflow only applies when user has explicitly chosen "Create a git worktree" (Option A).**

The AI must enforce workspace choice manually by asking the user before proceeding.

The AI:
- **MUST ASK** user for workspace choice before executing any commands
- **MUST WAIT** for explicit user selection (A/B)
- **NEVER** autonomously decides between git worktree and current branch
- **NEVER** creates a new branch directly with `git branch`, `git checkout` plus `-b`, or `git switch` plus `-c`
- Only proceeds with worktree creation after user selects Option A

If the user has not been prompted or selected a different option:
- Option B (Current branch) → Do NOT use this workflow, work on the existing branch

---

<!-- /ANCHOR:workspace-choice-enforcement -->
<!-- ANCHOR:process-overview -->
## 3. PROCESS OVERVIEW

1. Determine worktree directory location (priority: existing → AGENTS.md → ask user)
2. Verify safety (`.gitignore` check for project-local directories)
3. Create worktree with appropriate branch strategy
4. Run project setup (auto-detect and install dependencies)
5. Verify clean baseline (run tests)
6. Report location and status

**Branch Strategies**:
- **Main-focused (default)**: Work on main with minimal branching (short-lived temp branches)
- **Feature branches**: Create new branch per worktree (for long-running work)
- **Experimental**: Quick experiments with detached HEAD (no branch pollution)

---

<!-- /ANCHOR:process-overview -->
<!-- ANCHOR:complete-workflow -->
## 4. COMPLETE WORKFLOW

### Step 1: Gather User Inputs

**Purpose**: Collect task description and branch strategy

**Actions**:
- Ask for feature/task description
- Confirm branch strategy (default: main_temp for most work)
- Determine branch name based on strategy

**Default Strategy**: `main_temp` (short-lived branches merging back to main)

**When to use other strategies**:
- `feature_branch`: Long-running features requiring PR review
- `main_detached`: Quick experiments without branch creation

**Validation**: `inputs_collected`

---

### Step 2: Directory Selection

**Purpose**: Determine where to create worktree

**Priority Order**:

1. **Check Existing Directories**
```bash
ls -d .worktrees 2>/dev/null     # Preferred (hidden)
ls -d worktrees 2>/dev/null      # Alternative
```
   **If found**: Use that directory. If both exist, `.worktrees` wins.

2. **Check AGENTS.md**
```bash
grep -i "worktree.*directory" AGENTS.md 2>/dev/null
```
   **If preference specified**: Use it without asking.

3. **Ask User**
   If no directory exists and no AGENTS.md preference:
```text
No worktree directory found. Where should I create worktrees?

1. .worktrees/ (project-local, hidden)
2. ~/.config/superpowers/worktrees/<project-name>/ (global location)

Which would you prefer?
```

**Validation**: `directory_determined`


### Step 3: Safety Verification

**Purpose**: Ensure worktree directory won't pollute repository

**For Project-Local Directories** (`.worktrees/` or `worktrees/`):

**Critical Check**:
```bash
# Prefer git's matcher to verify ignore status for project-local directories
# A match indicates the path would be ignored
git check-ignore -n .worktrees 2>/dev/null \
  || git check-ignore -n worktrees 2>/dev/null \
  || echo "NOT_IGNORED"
```

**If NOT ignored**:
1. Add appropriate line to `.gitignore`
2. Ask for approval, then commit the change
3. Proceed with worktree creation

**Rationale**: Prevents accidentally committing worktree contents to repository.

**For Global Directory** (`~/.config/superpowers/worktrees/`):
- No `.gitignore` verification needed (outside project)

**Validation**: `safety_verified`


### Step 4: Create Worktree

**Purpose**: Create isolated workspace with appropriate branch

**Actions**:

1. **Detect Project Name**:
```bash
project=$(basename "$(git rev-parse --show-toplevel)")
```

2. **Determine Path**:
```bash
case $LOCATION in
  .worktrees|worktrees)
    path="$LOCATION/$BRANCH_NAME"
    ;;
  ~/.config/superpowers/worktrees/*)
    path="$HOME/.config/superpowers/worktrees/$project/$BRANCH_NAME"
    ;;
esac
```

3. **Create Worktree** (strategy-dependent):

   **Feature Branch**:
```bash
git worktree add "$path" -b "$BRANCH_NAME"
```

   **Main Temp** (short-lived branch):
```bash
git worktree add "$path" -b "temp/$TASK_ID" main
```

   **Main Detached** (no branch):
```bash
git worktree add --detach "$path" main
```

4. **Navigate**:
```bash
cd "$path"
```

**Validation**: `worktree_created`


### Step 5: Project Setup

**Purpose**: Install dependencies and prepare environment

**Auto-Detection**:

```bash
# Node.js — respect lockfiles and package manager
if [ -f package.json ]; then
  if [ -f yarn.lock ]; then yarn install;
  elif [ -f pnpm-lock.yaml ]; then pnpm install;
  elif [ -f bun.lockb ]; then bun install;
  else npm install; fi
fi

# Rust
if [ -f Cargo.toml ]; then cargo build; fi

# Python
if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
if [ -f pyproject.toml ]; then poetry install; fi

# Go
if [ -f go.mod ]; then go mod download; fi
```

**Monorepo Support**:

For monorepos, install dependencies at the correct scope instead of assuming repo root:

| Tool | Command | Notes |
|------|---------|-------|
| **npm workspaces** | `npm install` at root | Installs all workspace packages |
| **yarn workspaces** | `yarn install` at root | Uses `workspace:*` protocol |
| **pnpm workspaces** | `pnpm install` at root | Uses `workspace:` protocol |
| **Lerna** | `lerna bootstrap` or `npx lerna run install` | For older Lerna setups |
| **Nx** | `nx run-many --target=install` | Nx workspace management |

If working in a specific package within a monorepo:
```bash
# Navigate to package directory first
cd packages/my-package
npm install  # or yarn/pnpm
```

**Corepack Support**:

Corepack is Node.js's built-in package manager manager (available since Node 16.9+). Use it when `package.json` specifies a `packageManager` field:

```bash
# Enable corepack (one-time setup)
corepack enable

# Prepare specific version (if specified in package.json)
corepack prepare

# Example package.json with packageManager field:
# { "packageManager": "pnpm@8.15.0" }
```

**Why use corepack?** Ensures consistent package manager versions across the team, avoiding "works on my machine" issues.

**Validation**: `dependencies_installed`


### Step 6: Baseline Verification

**Purpose**: Ensure worktree starts in known-good state

**Actions**:
```bash
# Run project-appropriate tests
if [ -f package.json ]; then npm test; fi    # Node.js
if [ -f Cargo.toml ]; then cargo test; fi   # Rust
if [ -f pyproject.toml ] || [ -f requirements.txt ]; then pytest; fi  # Python
if [ -f go.mod ]; then go test ./...; fi    # Go
```

Fast mode (large repos):
- Optionally run a reduced subset or skip baseline tests when explicitly requested (e.g., set `FAST_BASELINE=true`). Confirm with the user before skipping tests.

**If tests fail**:
- Report failures with details
- Ask: "Tests are failing. Proceed anyway or investigate first?"

**If tests pass**:
- Continue to final report

**Validation**: `baseline_verified`


### Step 7: Final Report

**Purpose**: Communicate location and status

**Report Format**:
```text
✓ Worktree ready at <full-path>
✓ Branch: <branch-name> (<strategy>)
✓ Tests passing (<N> tests, 0 failures)
✓ Ready to implement <feature-name>
```

**Validation**: `worktree_complete`

---

<!-- /ANCHOR:complete-workflow -->
<!-- ANCHOR:branch-strategy-guide -->
## 5. BRANCH STRATEGY GUIDE

### Main Temp (Default - Recommended) ⭐

**When to use**:
- Most development work (default choice)
- Quick fixes or small changes
- Want to keep codebase on main
- Immediate merge-back after testing
- Avoid long-lived feature branches

**Example**:
```bash
git worktree add .worktrees/quick-fix -b temp/fix-modal main
# ... make changes ...
cd ../.. && git checkout main && git merge temp/fix-modal
git branch -d temp/fix-modal
```

**Advantages**:
- Minimal branching, stays close to main
- Reduces merge conflicts
- Simpler mental model
- Branch cleanup automatic

**Best for**: 80% of development work


### Feature Branch

**When to use**:
- Long-running features (multiple days/weeks)
- Work that needs PR review before merging
- Complex features requiring multiple iterations
- When you want branch history preserved

**Example**:
```bash
git worktree add .worktrees/user-auth -b feature/user-auth
# ... develop feature ...
# Create PR, review, merge
```

**Best for**: Major features, team collaboration requiring review


### Main Detached (Experimental)

**When to use**:
- Quick experiments
- Testing ideas without creating branches
- Throwaway work

**Example**:
```bash
git worktree add --detach .worktrees/experiment main
# ... experiment ...
# If keeping: create branch and commit
# If discarding: just remove worktree
```

**Advantage**: No branch pollution

---

<!-- /ANCHOR:branch-strategy-guide -->
<!-- ANCHOR:decision-matrix -->
## 6. DECISION MATRIX

| Situation | Directory Strategy | Branch Strategy |
|-----------|-------------------|-----------------|
| `.worktrees/` exists | Use it (verify .gitignore) | User preference |
| `worktrees/` exists | Use it (verify .gitignore) | User preference |
| Both exist | Use `.worktrees/` | User preference |
| Neither exists | Check AGENTS.md → Ask | User preference |
| Directory not in .gitignore | Add + commit immediately | User preference |
| Tests fail during baseline | Report + ask permission | User preference |
| No package.json/Cargo.toml | Skip dependency install | User preference |

---

<!-- /ANCHOR:decision-matrix -->
<!-- ANCHOR:common-mistakes -->
## 7. COMMON MISTAKES

**Skipping .gitignore verification**:
- **Problem**: Worktree contents get tracked, pollute git status
- **Fix**: Always check .gitignore before creating project-local worktree

**Assuming directory location**:
- **Problem**: Creates inconsistency, violates project conventions
- **Fix**: Follow priority: existing > AGENTS.md > ask

**Proceeding with failing tests**:
- **Problem**: Can't distinguish new bugs from pre-existing issues
- **Fix**: Report failures, get explicit permission to proceed

**Hardcoding setup commands**:
- **Problem**: Breaks on projects using different tools
- **Fix**: Auto-detect from project files (package.json, etc.)

**Avoid checking out the same branch in multiple worktrees**:
- **Problem**: Git prevents checking out the same branch in multiple worktrees
- **Fix**: Use different branches or detached HEAD for parallel work on the same codebase state

---

<!-- /ANCHOR:common-mistakes -->
<!-- ANCHOR:example-workflows -->
## 8. EXAMPLE WORKFLOWS

### Example 1: Main Temp (Default Workflow) ⭐

```text
User: "Quick fix for modal close button"
Agent: "I'm using the git-worktrees skill with main-focused strategy (default)."

[Step 1: Gather inputs - branch_strategy: main_temp (default)]
[Step 2: Directory selection - found .worktrees/]
[Step 3: Safety verification - .gitignore contains .worktrees/]
[Step 4: Create worktree with temp branch]
> git worktree add .worktrees/modal-fix -b temp/modal-fix main
[Step 5: Project setup]
> npm install
[Step 6: Baseline verification]
> npm test
✓ All tests passing

✓ Worktree ready at /Users/user/project/.worktrees/modal-fix
✓ Branch: temp/modal-fix (main_temp - merges back to main immediately)
✓ Tests passing
✓ Ready for quick fix

[After fix is committed and tested]
User: "Fix is done and tested"
Agent: "Merging back to main and cleaning up temp branch..."
> git checkout main && git merge temp/modal-fix && git branch -d temp/modal-fix
```


### Example 2: Feature Branch (Long-Running Work)

```text
User: "I need to implement user authentication - this will take a few days"

Agent: "I'm using the git-worktrees skill with feature branch strategy."

[Step 1: Gather inputs - branch_strategy: feature_branch]
[Step 2: Directory selection - found .worktrees/]
[Step 3: Safety verification - .gitignore contains .worktrees/]
[Step 4: Create worktree]
> git worktree add .worktrees/user-auth -b feature/user-auth
[Step 5: Project setup - detected Node.js]
> npm install
[Step 6: Baseline verification]
> npm test
✓ 47 tests passing

✓ Worktree ready at /Users/user/project/.worktrees/user-auth
✓ Branch: feature/user-auth (feature_branch)
✓ Tests passing (47 tests, 0 failures)
✓ Ready to implement user authentication
```


### Example 3: Main Detached (Experimental)

```text
User: "Want to experiment with a new approach, not sure if I'll keep it"

Agent: "I'm using detached HEAD worktree for experimentation."

[Step 1: Gather inputs - branch_strategy: main_detached]
[Step 2: Directory selection - found .worktrees/]
[Step 3: Safety verification - .gitignore contains .worktrees/]
[Step 4: Create worktree detached]
> git worktree add --detach .worktrees/experiment main
[Step 5: Project setup]
> npm install
[Step 6: Baseline verification]
> npm test

✓ Worktree ready at /Users/user/project/.worktrees/experiment
✓ Branch: detached HEAD at main (no branch created)
✓ Tests passing
✓ Ready for experimentation

[If keeping the changes]
User: "This worked great, let's keep it"
Agent: "Creating a new worktree and branch from this detached HEAD state..."
> git worktree add ../new-approach -b feature/new-approach HEAD
> cd ../new-approach
> git add . && git commit -m "Experimental approach"
```

---

<!-- /ANCHOR:example-workflows -->
<!-- ANCHOR:troubleshooting -->
## 9. TROUBLESHOOTING

### Worktree Creation Fails

**Symptom**: `fatal: cannot create worktree` error

**Common Causes**:
- Directory already exists
- Branch already checked out in another worktree
- Insufficient permissions

**Solutions**:
```bash
# Remove worktree safely
git worktree remove .worktrees/branch-name

# Check existing worktrees
git worktree list

# Prune stale references (if needed)
git worktree prune
```


### Tests Fail After Creation

**Symptom**: Baseline tests fail in new worktree

**Actions**:
1. Report failure details to user
2. Ask: "Tests failing. Options: (A) Investigate now (B) Proceed anyway (C) Abort"
3. If investigate: Review test output, check dependencies are installed, verify environment matches main worktree
4. If proceed: Document that baseline is broken
5. If abort: Remove worktree


### Cannot Determine Project Type

**Symptom**: No package.json, Cargo.toml, requirements.txt, etc.

**Actions**:
1. Skip automated dependency install
2. Ask user: "Cannot detect project type. What command should I run to set up dependencies?"
3. Document command in AGENTS.md for future use


### Directory Not in .gitignore

**Symptom**: Worktree directory would be tracked by git

**Actions**:
1. Add appropriate pattern to .gitignore
2. Commit immediately: `git add .gitignore && git commit -m "chore: ignore worktree directories"`
3. Proceed with worktree creation

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:success-criteria -->
## 10. SUCCESS CRITERIA

**Worktree creation is successful when**:
- ✅ Directory selected following priority system
- ✅ Safety verification passed (`.gitignore` check)
- ✅ Worktree created with appropriate branch strategy
- ✅ Dependencies installed successfully
- ✅ Tests pass (baseline verified)
- ✅ User informed of location and status

**Quality gates**:
- Directory must be in `.gitignore` (if project-local)
- Tests must pass OR user explicitly approves proceeding with failures
- Full path and status reported to user

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:related-resources -->
## 11. RELATED RESOURCES

### Reference Files
- [commit_workflows.md](./commit_workflows.md) - Professional commit practices with Conventional Commits
- [finish_workflows.md](./finish_workflows.md) - Complete development work with structured integration options
- [quick_reference.md](./quick_reference.md) - One-page cheat sheet for all git workflows
- [shared_patterns.md](./shared_patterns.md) - Common patterns and conventions across workflows

### External Resources
- [Git Documentation: git-worktree](https://git-scm.com/docs/git-worktree) - Official git worktree documentation
- [Superpowers using-git-worktrees skill](https://github.com/obra/superpowers/blob/main/skills/using-git-worktrees/SKILL.md) - Original worktree skill reference
<!-- /ANCHOR:related-resources -->

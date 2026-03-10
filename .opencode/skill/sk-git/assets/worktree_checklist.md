---
title: Worktree Creation Checklist
description: Step-by-step checklist for creating git worktrees safely and reliably.
---

# Worktree Creation Checklist - Branch Isolation Setup

Step-by-step checklist for safe and reliable git worktree creation.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

This checklist ensures git worktrees are created safely with proper .gitignore configuration, dependency installation, and baseline test verification. Use it when setting up isolated development environments.

### Usage

1. Complete the pre-creation checklist (gather info, select directory, verify safety)
2. Follow the creation steps for your worktree strategy
3. Run post-creation verification
4. Report status to user using the template

Any new branch must be created by `git worktree add -b ...`, never by `git branch`, `git checkout` plus `-b`, or `git switch` plus `-c`.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:pre-creation-checklist -->
## 2. PRE-CREATION CHECKLIST

### Step 1: Gather Information

- [ ] **Task/feature description** - What will you work on?
- [ ] **Branch strategy decided** - temp/*, feature/*, or detached HEAD?
- [ ] **Branch name chosen** (if needed) - Follows naming conventions?

**Decision guide**:
- **temp/***: 80% of work (merge back to main immediately)
- **feature/***: Long-running work needing PR review
- **Detached HEAD**: Experiments, throwaway work


### Step 2: Directory Selection

- [ ] **Check for existing directories**
  ```bash
  ls -d .worktrees 2>/dev/null
  ls -d worktrees 2>/dev/null
  ```

- [ ] **Check AGENTS.md for preferences**
  ```bash
  grep -i "worktree.*directory" AGENTS.md 2>/dev/null
  ```

- [ ] **Decide on location**:
  - Project-local: `.worktrees/` (recommended)
  - Project-local: `worktrees/`
  - Global: `~/.config/superpowers/worktrees/<project>/`

**Priority**: Existing directory > AGENTS.md preference > Ask user


### Step 3: Safety Verification

**For project-local directories only** (`.worktrees/` or `worktrees/`):

- [ ] **Check .gitignore status**
  ```bash
  git check-ignore -n .worktrees 2>/dev/null || \
  git check-ignore -n worktrees 2>/dev/null || \
  echo "NOT_IGNORED"
  ```

- [ ] **If NOT ignored, add to .gitignore**
  ```bash
  echo ".worktrees/" >> .gitignore
  # OR
  echo "worktrees/" >> .gitignore
  ```

- [ ] **Commit .gitignore update**
  ```bash
  git add .gitignore
  git commit -m "chore: ignore worktree directories"
  ```

**For global directory**: Skip safety verification (outside project)

**Why this matters**: Prevents accidentally committing worktree contents to git.

---

<!-- /ANCHOR:pre-creation-checklist -->
<!-- ANCHOR:creation-checklist -->
## 3. CREATION CHECKLIST

### Step 4: Create Worktree

Choose one based on branch strategy:

**Option A: Temp Branch** (default)
- [ ] Create worktree with temp branch
  ```bash
  git worktree add .worktrees/<name> -b temp/<name> main
  ```

**Option B: Feature Branch**
- [ ] Create worktree with feature branch
  ```bash
  git worktree add .worktrees/<name> -b feature/<name>
  ```

**Option C: Detached HEAD**
- [ ] Create detached HEAD worktree
  ```bash
  git worktree add --detach .worktrees/<name> main
  ```

- [ ] **Navigate to worktree**
  ```bash
  cd .worktrees/<name>
  ```

- [ ] **Verify creation**
  ```bash
  git worktree list
  git status
  ```


### Step 5: Project Setup

Auto-detect project type and install dependencies:

**Node.js Projects**:
- [ ] Detect package manager
  ```bash
  # Check for lockfiles
  ls -la | grep -E "yarn.lock|pnpm-lock.yaml|bun.lockb|package-lock.json"
  ```

- [ ] Install dependencies
  ```bash
  # If yarn.lock exists
  yarn install

  # If pnpm-lock.yaml exists
  pnpm install

  # If bun.lockb exists
  bun install

  # Otherwise
  npm install
  ```

**Rust Projects**:
- [ ] Build project
  ```bash
  cargo build
  ```

**Python Projects**:
- [ ] Install dependencies
  ```bash
  # If requirements.txt exists
  pip install -r requirements.txt

  # If pyproject.toml exists
  poetry install
  ```

**Go Projects**:
- [ ] Download dependencies
  ```bash
  go mod download
  ```

**Cannot detect project type**:
- [ ] Ask user for setup command
- [ ] Document in AGENTS.md for future use


### Step 6: Baseline Verification

Run tests to ensure worktree starts in known-good state:

**Node.js**:
- [ ] Run tests
  ```bash
  npm test
  ```

**Rust**:
- [ ] Run tests
  ```bash
  cargo test
  ```

**Python**:
- [ ] Run tests
  ```bash
  pytest
  # OR
  python -m pytest
  ```

**Go**:
- [ ] Run tests
  ```bash
  go test ./...
  ```

**Test Results**:
- [ ] **All tests pass** → Continue
- [ ] **Tests fail** → Ask user:
  - Investigate now?
  - Proceed anyway? (document baseline is broken)
  - Abort?

**Fast mode** (for large repos):
- [ ] User explicitly requested fast mode?
- [ ] Confirmed with user before skipping tests?

---

<!-- /ANCHOR:creation-checklist -->
<!-- ANCHOR:post-creation-checklist -->
## 4. POST-CREATION CHECKLIST

### Step 7: Final Verification

- [ ] **Worktree path confirmed**
  ```bash
  pwd
  # Should be in .worktrees/<name>
  ```

- [ ] **Branch verified**
  ```bash
  git branch --show-current
  # Should show correct branch name
  ```

- [ ] **Tests passing** (or failure documented)

- [ ] **Dependencies installed successfully**

- [ ] **Ready to start work**

---

<!-- /ANCHOR:post-creation-checklist -->
<!-- ANCHOR:status-report-template -->
## 5. STATUS REPORT TEMPLATE

Provide this information to user:

```
✓ Worktree ready at <full-path>
✓ Branch: <branch-name> (<strategy>)
✓ Tests passing (<N> tests, 0 failures)
✓ Ready to implement <feature-name>
```

Example:
```
✓ Worktree ready at /Users/user/project/.worktrees/user-auth
✓ Branch: feature/user-auth (feature_branch)
✓ Tests passing (152 tests, 0 failures)
✓ Ready to implement user authentication
```

---

<!-- /ANCHOR:status-report-template -->
<!-- ANCHOR:common-issues-checklist -->
## 6. COMMON ISSUES CHECKLIST

### Issue: Worktree Creation Fails

- [ ] Check if directory already exists
  ```bash
  ls -d .worktrees/<name>
  ```

- [ ] Check if branch already in use
  ```bash
  git worktree list | grep <branch-name>
  ```

- [ ] Verify git repository
  ```bash
  git rev-parse --git-dir
  ```

- [ ] Check permissions
  ```bash
  ls -la .
  ```

**Solution**:
```bash
# Remove existing worktree if stale
git worktree remove .worktrees/<name>

# Prune stale references
git worktree prune

# Try again
git worktree add .worktrees/<name> -b <branch>
```


### Issue: Tests Fail in New Worktree

- [ ] Review test output for specific failures
- [ ] Check if same tests fail in main worktree
- [ ] Verify all dependencies installed
- [ ] Check for environment-specific issues

**Actions**:
- [ ] Report failures to user
- [ ] Provide options: Investigate / Proceed anyway / Abort
- [ ] Document baseline if proceeding with failures


### Issue: Cannot Determine Project Type

- [ ] No package.json, Cargo.toml, requirements.txt, or go.mod found

**Actions**:
- [ ] Skip automated dependency install
- [ ] Ask user for setup command
- [ ] Document command in AGENTS.md:
  ```markdown
  ## Worktree Setup
  Run: <user-provided-command>
  ```


### Issue: Directory Not in .gitignore

- [ ] Verify with git check-ignore
  ```bash
  git check-ignore -n .worktrees
  ```

**Actions**:
- [ ] Add to .gitignore
  ```bash
  echo ".worktrees/" >> .gitignore
  ```

- [ ] Commit immediately
  ```bash
  git add .gitignore
  git commit -m "chore: ignore worktree directories"
  ```

- [ ] Proceed with worktree creation

---

<!-- /ANCHOR:common-issues-checklist -->
<!-- ANCHOR:quick-reference-commands -->
## 7. QUICK REFERENCE COMMANDS

**List all worktrees**:
```bash
git worktree list
```

**Check worktree status**:
```bash
cd .worktrees/<name>
git status
```

**Remove worktree**:
```bash
git worktree remove .worktrees/<name>
```

**Prune stale references**:
```bash
git worktree prune
```

**Check current branch**:
```bash
git branch --show-current
```

**Verify .gitignore**:
```bash
git check-ignore -n .worktrees
```

---

<!-- /ANCHOR:quick-reference-commands -->
<!-- ANCHOR:success-criteria -->
## 8. SUCCESS CRITERIA

Worktree creation is successful when:

- ✅ Directory selected following priority system
- ✅ Safety verification passed (`.gitignore` check)
- ✅ Worktree created with appropriate worktree strategy
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
## 9. RELATED RESOURCES

- [worktree_workflows.md](../references/worktree_workflows.md) - Complete workflow details
- [shared_patterns.md](../references/shared_patterns.md) - Common git patterns
- [quick_reference.md](../references/quick_reference.md) - Command cheat sheet
<!-- /ANCHOR:related-resources -->

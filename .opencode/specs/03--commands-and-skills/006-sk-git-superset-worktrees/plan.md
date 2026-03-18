---
title: "Implementation Plan: sk-git Superset Worktree Alignment"
description: "Restructure sk-git skill adapted from Superset IDE's worktree model: centralized storage, config-driven lifecycle, structured init/teardown flows."
trigger_phrases:
  - "sk-git superset plan"
  - "worktree alignment implementation"
  - "git skill superset update"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: sk-git Superset Worktree Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (documentation), Bash (git commands) |
| **Framework** | OpenCode skill system (sk-git) |
| **Storage** | Filesystem (worktrees, worktree.json) |
| **Testing** | Manual verification via git commands |

### Overview
This plan restructures the sk-git skill's worktree documentation, adapted from Superset IDE's worktree isolation model. Changes span 7 files (6 modified, 1 new) across the skill's SKILL.md, 4 reference files, and 2 asset files. The approach adapts Superset's desktop-app patterns (centralized storage, config-driven lifecycle, structured init flow) for CLI/AI-skill usage while maintaining full backward compatibility with existing `.worktrees/` project-local setups. Branch sanitization, multi-level config resolution, and environment variable injection are deferred to a follow-up spec.

### Superset Model Reference (Adapted From)

| Superset Concept | sk-git Adaptation | Status |
|-----------------|-------------------|--------|
| `~/.superset/worktrees/<project>/<branch>/` | `~/.opencode/worktrees/<project>/<branch>/` | This spec |
| `.superset/config.json` { setup, teardown } | `.opencode/worktree.json` { setup, teardown } | This spec |
| Init flow: verify → fetch → create → copy config → setup → ready | Same phases in workflow | This spec |
| Pre-deletion: check uncommitted + unpushed | Same checks | This spec |
| Hook tolerance: continue if post-checkout hook fails | Same pattern | This spec |
| Teardown: run scripts → git worktree remove → branch delete | Same sequence | This spec |
| N/A (Superset is an app, not AI) | Security gate: user confirms before script execution | This spec (new) |
| N/A (Superset auto-detects) | Config vs auto-detect: worktree.json replaces auto-detect | This spec (new) |
| Branch sanitization (sanitize → truncate → dedup) | Shell-based pipeline | **Deferred** |
| Env vars: `SUPERSET_ROOT_PATH`, `SUPERSET_WORKSPACE_NAME` | `SK_GIT_ROOT_PATH`, `SK_GIT_WORKSPACE_NAME` | **Deferred** |
| Config resolution: user override → worktree → project | Same hierarchy | **Deferred** |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001 through SC-005)
- [x] Dependencies identified (none — internal documentation changes only)
- [x] Superset reference material gathered (3-agent parallel research complete)

### Definition of Done
- [ ] All 7 files modified/created per scope
- [ ] Each Superset concept has a documented sk-git equivalent
- [ ] Backward compatibility: `.worktrees/` path still works
- [ ] Config template provides working example
- [ ] Checklist.md items all verified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-driven skill update — no runtime code. All changes are markdown reference files that guide AI agent behavior.

### Key Components

- **SKILL.md** (Orchestrator): Routes to correct workflow, defines workspace choice enforcement, references worktree.json
- **worktree_workflows.md** (Core): The primary 9-step init flow aligned with Superset
- **finish_workflows.md** (Teardown): Configurable teardown with safety checks
- **shared_patterns.md** (Patterns): Reusable command patterns for sanitization, config loading, etc.
- **quick_reference.md** (Cheat sheet): One-page command reference
- **worktree_checklist.md** (Asset): Pre-flight verification checklist
- **worktree_config_template.json** (Asset): Example config file

### Data Flow
```
User Request → SKILL.md (routing) → worktree_workflows.md (init flow)
                                   → worktree.json (lifecycle hooks)
                                   → finish_workflows.md (teardown)
                                   → shared_patterns.md (reusable commands)
```

### Superset-Aligned Directory Structure
```
~/.opencode/
  worktrees/
    <project-name>/
      <branch-name>/          # Full git worktree checkout
        .opencode/             # Copied from main repo (gitignored files)
        <working tree files>

<project-root>/
  .opencode/
    worktree.json               # Lifecycle hooks: { setup: [...], teardown: [...] }
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Core Architecture (worktree_workflows.md)
Priority: P0 | Estimated LOC: ~300

The worktree_workflows.md rewrite is the foundational change. All other files reference it.

- [ ] **1.1** Replace current 7-step workflow with Superset-aligned 9-step init flow:
  1. Gather inputs (task name, branch strategy)
  2. Resolve directory location (centralized default, project-local fallback)
  3. Sanitize branch name (lowercase → hyphens → truncate → dedup)
  4. Resolve base branch (multi-step fallback: remote → local tracking → local → common names)
  5. Fetch latest changes (`git fetch origin <base-branch>`)
  6. Create worktree (`git worktree add <path> -b <branch> <start-point>`)
  7. Copy gitignored config (`cp -r <main-repo>/.opencode/ <worktree>/.opencode/`)
  8. Run lifecycle setup (execute worktree.json `setup[]` with env vars injected)
  9. Verify and report (baseline tests, status output)

- [ ] **1.2** Add directory resolution convention (backward-compatible order):
  ```
  Priority 1: Project-level override (if .opencode/worktree.json specifies worktreeBaseDir)
  Priority 2: Existing project-local: .worktrees/ (if directory already exists — backward compat)
  Priority 3: Centralized default: ~/.opencode/worktrees/<project>/<branch>/ (new default for fresh setups)
  ```

- [ ] **1.3** Add config vs auto-detect interaction rule:
  ```
  RULE: If .opencode/worktree.json exists AND setup[] is non-empty:
    → REPLACE auto-detect setup entirely (do NOT run both)
  If .opencode/worktree.json is absent OR setup[] is empty:
    → Fall back to existing auto-detect behavior (package.json, Cargo.toml, etc.)
  ```

- [ ] **1.4** Add security gate for lifecycle scripts:
  ```
  MANDATORY: Before executing ANY command from worktree.json setup[] or teardown[]:
  1. Display the commands to the user
  2. Ask for explicit confirmation ("These setup commands will run: [...]. Proceed? Y/N")
  3. If user declines → skip setup but continue worktree creation
  4. NEVER auto-execute lifecycle scripts without user confirmation
  RATIONALE: Cloned repos may contain malicious worktree.json files
  ```

- [ ] **1.5** Add base branch multi-step fallback:
  ```bash
  # 1. Check remote
  git ls-remote --exit-code --heads origin "$base_branch" 2>/dev/null
  # 2. Fall back to local tracking
  git branch -r | grep "origin/$base_branch"
  # 3. Fall back to local
  git branch | grep "$base_branch"
  # 4. Fall back to common names
  for name in main master; do git branch | grep "$name" && break; done
  ```

- [ ] **1.6** Add worktree.json loading section:
  ```
  Config loading (simple, single-location):
  1. Check <main-repo>/.opencode/worktree.json
  2. If found and valid JSON → use it
  3. If not found → no lifecycle hooks (graceful skip)
  4. If invalid JSON → warn user, skip lifecycle hooks
  NOTE: Multi-level config resolution hierarchy deferred to follow-up spec
  ```

- [ ] **1.7** Add migration note for legacy paths:
  ```
  MIGRATION: The previous global worktree location was ~/.config/superpowers/worktrees/<project>/
  This is now replaced by ~/.opencode/worktrees/<project>/<branch>/
  Existing worktrees at the old location continue to work (git tracks them internally).
  To migrate: git worktree list → identify old paths → git worktree move (or recreate)
  ```

- [ ] **1.8** Add hook tolerance pattern:
  ```
  If post-checkout hook fails but worktree was created successfully → continue
  Only fail if the worktree itself was not created
  ```

### Phase 2: SKILL.md Updates
Priority: P0 | Estimated LOC: ~150

- [ ] **2.1** Update Section 3 (How It Works) lifecycle map:
  - Phase 1 description emphasizes centralized storage as default
  - Add worktree.json concept to Phase 1
  - Add "workspace = worktree" terminology note
  - Note migration from legacy `~/.config/superpowers/worktrees/` path

- [ ] **2.2** Update Section 9 (Workspace Choice Enforcement):
  - Make worktree Option B the RECOMMENDED default
  - Add recommendation text: "(Recommended for parallel work and clean isolation)"
  - Keep all 3 options (branch, worktree, current) — user still chooses

- [ ] **2.3** Update Section 2 (Smart Routing):
  - Add keywords: `worktree.json`, `setup script`, `teardown`, `lifecycle`, `centralized`
  - Add `WORKSPACE_SETUP` noisy synonyms: `"isolated workspace": 2.0`, `"parallel agents": 1.8`

- [ ] **2.4** Update RESOURCE_MAP to include worktree_worktree_config_template.json:
  ```python
  "WORKSPACE_SETUP": ["references/worktree_workflows.md", "assets/worktree_checklist.md", "assets/worktree_worktree_config_template.json"],
  ```

### Phase 3: Teardown & Finish Alignment (finish_workflows.md)
Priority: P1 | Estimated LOC: ~120

- [ ] **3.1** Add configurable teardown section:
  - Before `git worktree remove`, check and run worktree.json `teardown[]`
  - Security gate: show teardown commands and get user confirmation before executing
  - 60-second timeout per teardown command
  - On failure: warn user, offer "Force Delete" option
  - Note: env var injection (SK_GIT_ROOT_PATH, SK_GIT_WORKSPACE_NAME) deferred to follow-up

- [ ] **3.2** Add pre-deletion safety checks:
  ```bash
  # Check uncommitted changes
  git -C "$worktree_path" status --porcelain
  # Check unpushed commits
  git -C "$worktree_path" rev-list --left-right --count "origin/$branch...HEAD"
  ```

- [ ] **3.3** Update deletion workflow to Superset sequence:
  1. Pre-deletion safety checks (uncommitted, unpushed)
  2. Run teardown scripts from worktree.json
  3. `git worktree remove <path>`
  4. `git branch -D <branch>` (optional, ask user)
  5. `git worktree prune` (cleanup stale refs)

### Phase 4: Shared Patterns Update (shared_patterns.md)
Priority: P1 | Estimated LOC: ~120

- [ ] **4.1** Add "worktree.json Lifecycle" pattern section:
  - Schema definition: `{ "setup": [...], "teardown": [...] }`
  - Simple loading: check `<main-repo>/.opencode/worktree.json`
  - Config vs auto-detect rule: worktree.json replaces auto-detect when non-empty
  - Security gate: mandatory user confirmation before script execution
  - Example configs for common stacks (Node, Python, Docker)
  - Error handling for missing/invalid config

- [ ] **4.2** Add "Base Branch Resolution" pattern section:
  - Multi-step fallback logic
  - Commands for each fallback step
  - Error handling when no branch found

- [ ] **4.3** Add "Gitignored File Copy" pattern section:
  - Why worktrees don't include gitignored files
  - Copy command for .opencode/ directory
  - Selective copy (only specific dirs, not all gitignored content)

### Phase 5: Assets & Quick Reference
Priority: P1 | Estimated LOC: ~160

- [ ] **5.1** Update `worktree_checklist.md`:
  - Align checklist items with new 9-step init flow
  - Add worktree.json check step
  - Add branch sanitization verification
  - Add centralized directory creation check
  - Add gitignored file copy verification

- [ ] **5.2** Create `worktree_config_template.json`:
  ```json
  {
    "setup": [],
    "teardown": []
  }
  ```
  With commented examples for Node.js, Python, Docker, and monorepo setups.

- [ ] **5.3** Update `quick_reference.md`:
  - Add centralized dir commands
  - Add worktree.json commands
  - Add sanitization helper
  - Update directory layout diagram
  - Add environment variable reference
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual Review | All 7 files for completeness | Read each file, verify all Superset concepts present |
| Command Verification | Git commands in workflows | Execute each documented command in a test repo |
| Config Verification | worktree_config_template.json | Validate JSON syntax, test with setup/teardown scripts |
| Backward Compat | Existing .worktrees/ workflows | Verify old workflows still described and functional |
| Cross-Reference | File references (SKILL.md → workflows) | Verify all internal links and references are valid |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Superset research (3 agents) | Internal | Green (complete) | N/A — already done |
| Current sk-git files | Internal | Green | N/A — all read |
| Git 2.20+ (documented requirement) | External | Green | Users need recent git |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Implementation introduces errors in existing workflows or breaks backward compatibility
- **Procedure**: `git checkout main -- .opencode/skill/sk-git/` — restores all skill files to main branch state
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (worktree_workflows.md) ───┐
                                    ├──► Phase 3 (finish_workflows.md)
Phase 2 (SKILL.md) ────────────────┤
                                    ├──► Phase 4 (shared_patterns.md)
                                    │
                                    └──► Phase 5 (assets + quick_reference)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Core) | None | Phase 3, 4, 5 |
| Phase 2 (SKILL.md) | None | Phase 5 (routing references) |
| Phase 3 (Teardown) | Phase 1 | Phase 5 |
| Phase 4 (Patterns) | Phase 1 | Phase 5 |
| Phase 5 (Assets) | Phase 1, 2, 3, 4 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated LOC |
|-------|------------|---------------|
| Phase 1: Core Architecture | High | ~300 |
| Phase 2: SKILL.md Updates | Medium | ~150 |
| Phase 3: Teardown Alignment | Medium | ~120 |
| Phase 4: Shared Patterns | Medium | ~120 |
| Phase 5: Assets & Reference | Low-Medium | ~160 |
| **Total** | | **~850** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All existing commands still work (backward compat)
- [ ] No broken internal references between files
- [ ] Config template is valid JSON

### Rollback Procedure
1. Revert skill files: `git checkout main -- .opencode/skill/sk-git/`
2. Delete new worktree_config_template.json if it was created
3. Verify skill loads correctly (no broken references)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — documentation-only changes
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────────┐     ┌──────────────────────────┐
│  Phase 1: Core           │     │  Phase 2: SKILL.md       │
│  worktree_workflows.md   │     │  Routing + enforcement   │
│  (foundation)            │     │  (orchestration)         │
└──────────┬───────────────┘     └──────────┬───────────────┘
           │                                │
     ┌─────┼───────────────┐                │
     │     │               │                │
     ▼     ▼               ▼                │
┌────────┐ ┌────────────┐ ┌────────────┐    │
│Phase 3 │ │ Phase 4    │ │ Phase 5    │◄───┘
│Teardown│ │ Patterns   │ │ Assets +   │
│finish  │ │ shared     │ │ Quick Ref  │
└────────┘ └────────────┘ └────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1: worktree_workflows.md | None | Init flow, directory convention, sanitization | Phase 3, 4, 5 |
| Phase 2: SKILL.md | None | Routing, enforcement, config awareness | Phase 5 |
| Phase 3: finish_workflows.md | Phase 1 | Teardown flow, safety checks | Phase 5 |
| Phase 4: shared_patterns.md | Phase 1 | Reusable patterns | Phase 5 |
| Phase 5: Assets + Quick Ref | Phase 1-4 | Checklist, template, cheat sheet | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1: worktree_workflows.md** — ~300 LOC — CRITICAL (foundation for all other files)
2. **Phase 2: SKILL.md** — ~150 LOC — CRITICAL (routing and enforcement)
3. **Phase 3: finish_workflows.md** — ~120 LOC — CRITICAL (teardown alignment)
4. **Phase 4: shared_patterns.md** — ~120 LOC — Can parallel with Phase 3
5. **Phase 5: Assets** — ~160 LOC — Final, depends on all above

**Total Critical Path**: Phases 1 → 2 → 3 → 5

**Parallel Opportunities**:
- Phase 3 (Teardown) and Phase 4 (Patterns) can run simultaneously after Phase 1
- Phase 2 (SKILL.md) can start alongside Phase 1 (independent)
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M1 | Core workflow rewritten | worktree_workflows.md has 9-step Superset-aligned flow |
| M2 | SKILL.md updated | Routing, enforcement, and lifecycle map reflect new model |
| M3 | All references aligned | finish_workflows.md and shared_patterns.md updated |
| M4 | Assets complete | Checklist, config template, quick reference all updated |
| M5 | Verification passed | All checklist items verified, backward compat confirmed |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORDS

### ADR-001: Centralized Worktree Storage

**Status**: Accepted

**Context**: Superset IDE stores worktrees in `~/.superset/worktrees/<project>/<branch>/` — centralized, outside the project directory. sk-git currently uses `.worktrees/` inside the project.

**Decision**: Adopt centralized `~/.opencode/worktrees/<project>/<branch>/` as the NEW DEFAULT. Keep `.worktrees/` as a supported fallback for backward compatibility.

**Consequences**:
- (+) Project directories stay clean
- (+) Worktrees organized by project
- (+) Matches Superset's proven pattern
- (-) Users need to know the centralized location
- Mitigation: Clear documentation + `git worktree list` always shows paths

**Alternatives Rejected**:
- Keep `.worktrees/` as default: Doesn't align with Superset's model
- Only support centralized: Breaks backward compatibility

### ADR-002: Config-Driven Lifecycle Hooks

**Status**: Accepted

**Context**: Superset uses `.superset/worktree.json` with `setup[]` and `teardown[]` arrays for worktree lifecycle management. sk-git has no equivalent.

**Decision**: Adopt `.opencode/worktree.json` with identical `{ "setup": [...], "teardown": [...] }` schema. First-match-wins resolution: user override → worktree → project default.

**Consequences**:
- (+) Automated dependency installation per worktree
- (+) Consistent with Superset's proven pattern
- (+) Simple schema (just two arrays of shell commands)
- (-) New file to maintain
- Mitigation: Config is optional; empty arrays = no hooks

**Alternatives Rejected**:
- Git hooks (post-checkout): Not configurable per-project without scripts, doesn't cover teardown
- Makefile targets: Different paradigm, not aligned with Superset

### ADR-003: Branch Name Sanitization Pipeline

**Status**: Accepted

**Context**: Superset sanitizes branch names through a multi-step pipeline (lowercase, hyphens, truncate, dedup). sk-git uses simple `type/description` convention with no sanitization.

**Decision**: Adopt a simplified sanitization pipeline using shell commands: sanitize (lowercase, hyphens, remove invalid chars) → truncate (100 char max) → dedup (append -1, -2 suffix if exists). Always show the sanitized name to the user before proceeding.

**Consequences**:
- (+) Valid, consistent branch names from any input
- (+) Prevents Git errors from invalid characters
- (+) Matches Superset's approach
- (-) Sanitized name may differ from user's intent
- Mitigation: Always show preview before creating

**Alternatives Rejected**:
- No sanitization: Leads to invalid branch names with special characters
- Strict validation (reject invalid): Poor UX — better to auto-fix than reject

---

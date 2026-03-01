---
title: "Feature Specification: sk-git Superset Worktree Alignment"
description: "The sk-git skill's worktree workflow is generic and manual. Superset IDE has a mature, agent-first worktree isolation model that should be adapted for consistency and improved parallel-agent support."
trigger_phrases:
  - "sk-git superset alignment"
  - "worktree superset"
  - "git skill worktree update"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: sk-git Superset Worktree Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Adapt the sk-git skill's worktree handling from Superset IDE's git worktree model. Superset treats each workspace as an isolated worktree with centralized storage, config-driven lifecycle hooks, and structured init/teardown flows. The current sk-git skill uses a simpler, manual-choice model that lacks these capabilities. This adaptation translates Superset's desktop-app patterns into CLI/AI-skill documentation.

**Key Decisions**: Adopt centralized worktree storage (`~/.opencode/worktrees/`), add `.opencode/worktree.json` for setup/teardown lifecycle hooks, require user confirmation before executing lifecycle scripts.

**Deferred to follow-up**: Branch name sanitization pipeline, multi-level config resolution hierarchy, environment variable injection.

**Critical Dependencies**: None — all changes are within the sk-git skill documentation and reference files.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-28 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-git skill's worktree workflow is designed for manual, single-user operation. It treats worktrees as one of three workspace options (branch, worktree, current branch), uses project-local storage (`.worktrees/`), lacks lifecycle hooks (setup/teardown scripts), has no branch name sanitization, and provides no structured init flow with fallback handling. This doesn't align with Superset IDE's agent-first worktree isolation model, which is the reference standard for parallel agent execution.

### Purpose
Adapt sk-git's worktree handling from Superset IDE's proven workspace model: centralized worktree storage, config-driven lifecycle, structured init phases, and robust error handling — translated for CLI/AI-skill context.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (This Spec)
- Adopt centralized worktree directory convention (`~/.opencode/worktrees/<project>/<branch>/`)
- Add `.opencode/worktree.json` support for `setup[]` and `teardown[]` lifecycle hooks
- Add security gate: user confirmation required before executing lifecycle scripts
- Add config vs auto-detect rule: worktree.json replaces auto-detect when present
- Restructure init flow to match Superset's phases (verify → fetch → create → copy config → setup → ready)
- Add multi-step base branch fallback (remote → local tracking → local → common names)
- Add gitignored config directory copying to worktrees
- Add pre-deletion safety checks (uncommitted changes, unpushed commits)
- Update teardown to support configurable scripts
- Update all reference documents, assets, and checklists
- Make worktree the RECOMMENDED default (while keeping all 3 options)
- Document migration from legacy `~/.config/superpowers/worktrees/` path

### Deferred to Follow-up Spec
- Branch name sanitization pipeline (sanitize → truncate → deduplicate)
- Environment variable injection (`SK_GIT_ROOT_PATH`, `SK_GIT_WORKSPACE_NAME`)
- Multi-level config resolution hierarchy (user override → worktree → project default)

### Out of Scope
- Database-backed workspace tracking (Superset uses SQLite/Drizzle) — CLI uses filesystem state
- UI progress streaming — CLI reports status via terminal output
- Terminal session management (Unix domain sockets) — not applicable to AI skill
- Port allocation registry — not applicable
- MCP server API for workspace management — not applicable
- Diff viewer — not applicable
- Per-project mutex locking implementation — document pattern only, no actual lockfile code

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-git/SKILL.md` | Modify | Update lifecycle map, workspace choice (worktree as recommended default), routing keywords, config.json awareness |
| `.opencode/skill/sk-git/references/worktree_workflows.md` | Modify (major) | Restructure to Superset init flow, add centralized dir, branch sanitization, config loading, env vars, base branch fallback, gitignored copying |
| `.opencode/skill/sk-git/references/finish_workflows.md` | Modify | Add configurable teardown scripts, pre-deletion safety checks, env var injection during teardown |
| `.opencode/skill/sk-git/references/shared_patterns.md` | Modify | Add config.json patterns, branch sanitization helper, base branch resolution, gitignored file copy pattern |
| `.opencode/skill/sk-git/references/quick_reference.md` | Modify | Update commands for centralized dirs, config, sanitization |
| `.opencode/skill/sk-git/assets/worktree_checklist.md` | Modify | Align checklist with new init flow phases |
| `.opencode/skill/sk-git/assets/config_template.json` | Create | Example .opencode/worktree.json template |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Centralized worktree storage convention | Documentation describes `~/.opencode/worktrees/<project>/<branch>/` as the primary storage location |
| REQ-002 | Config-driven lifecycle hooks | `.opencode/worktree.json` with `setup[]` and `teardown[]` arrays documented with examples |
| REQ-003 | Branch name sanitization pipeline | Documentation includes sanitize (lowercase, hyphens), truncate (max 100 chars), deduplicate steps |
| REQ-004 | Structured init flow matching Superset | Init phases documented: verify → fetch → create → copy config → setup → ready |
| REQ-005 | Multi-step base branch fallback | Documentation describes: remote → local tracking → local → common names (main, master) |
| REQ-006 | Backward compatibility | Project-local `.worktrees/` still supported as alternative to centralized storage |
| REQ-007 | Config vs auto-detect rule | If `.opencode/worktree.json` `setup[]` is present and non-empty, it REPLACES auto-detect setup. If absent or empty, fall back to auto-detect |
| REQ-008 | Security gate for lifecycle scripts | AI MUST show user the setup/teardown commands from worktree.json and get explicit confirmation before executing any lifecycle scripts |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Gitignored config copying | Step to copy `.opencode/` directory from main repo to worktree documented |
| REQ-010 | Pre-deletion safety checks | Check for uncommitted changes and unpushed commits before worktree removal |
| REQ-011 | Configurable teardown scripts | Teardown in finish workflow reads from worktree.json teardown array |
| REQ-012 | Worktree as recommended default | Workspace choice prompt recommends worktree (Option B) as default |
| REQ-013 | Hook tolerance pattern | Document that worktree creation continues if post-checkout hooks fail |
| REQ-014 | Migration note for legacy paths | Document migration from `~/.config/superpowers/worktrees/` to new centralized path |

### P2 - Deferred to Follow-up Spec

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-D01 | Branch name sanitization pipeline | Sanitize → truncate → deduplicate pipeline documented with shell commands |
| REQ-D02 | Environment variable injection | `SK_GIT_ROOT_PATH` and `SK_GIT_WORKSPACE_NAME` injected into lifecycle scripts |
| REQ-D03 | Multi-level config resolution hierarchy | First-match-wins: user override → worktree → project default |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 sk-git reference/asset files updated to reflect Superset-aligned worktree model
- **SC-002**: A developer reading worktree_workflows.md can execute the Superset-style init flow end-to-end using documented commands
- **SC-003**: worktree.json template and examples allow users to set up lifecycle hooks without external documentation
- **SC-004**: Existing `.worktrees/` project-local setups continue to work without modification
- **SC-005**: Lifecycle scripts require explicit user confirmation before execution (security gate)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Breaking existing worktree workflows | High | Keep `.worktrees/` backward compat; centralized is NEW default, not replacement |
| Risk | Security: malicious worktree.json in cloned repos | High | Mandatory user confirmation before executing lifecycle scripts |
| Risk | Double-setup: worktree.json + auto-detect both run | Medium | Explicit rule: worktree.json replaces auto-detect when present |
| Risk | Centralized dir creates cross-project clutter | Low | Organize by `<project>/<branch>/`; add cleanup guidance |
| Risk | Legacy ~/.config/superpowers/ users stranded | Medium | Migration note in documentation |
| Dependency | None | N/A | All changes are documentation-only within sk-git skill |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Consistency
- **NFR-C01**: Terminology matches Superset: "workspace" = worktree throughout documentation

### Backward Compatibility
- **NFR-B01**: All existing sk-git workflows function without modification after update

### Clarity
- **NFR-CL01**: Each command in the workflow has exact syntax — no ambiguous placeholders

---

## 8. EDGE CASES

### Directory Boundaries
- Centralized dir doesn't exist: Create `~/.opencode/worktrees/` on first use
- Project name contains special characters: Sanitize project name same as branch names
- Global dir conflicts with existing structure: Check before creating; warn if occupied

### Config Boundaries
- No config.json found: Skip setup/teardown gracefully (no error)
- worktree.json has empty arrays: Valid — means no lifecycle hooks
- Setup script fails: Warn user, offer to continue or abort (mirror Superset's behavior)
- Teardown script fails: Warn user, offer "force delete" option

### Branch Boundaries
- Branch name already exists in another worktree: Git enforces 1:1 — dedup with suffix (-1, -2, etc.)
- Branch name exceeds 100 chars after sanitization: Truncate while preserving meaning
- Empty or whitespace-only input: Reject with clear error message

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 7, LOC: ~850, Systems: 1 (sk-git skill) |
| Risk | 10/25 | Auth: N, API: N, Breaking: low (backward compat maintained) |
| Research | 18/20 | Deep investigation of Superset source code completed |
| Multi-Agent | 0/15 | Single skill update, no workstreams |
| Coordination | 5/15 | Dependencies: internal only (files reference each other) |
| **Total** | **51/100** | **Level 3 (documentation-heavy, architectural alignment)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Existing .worktrees/ users confused by new default | M | L | Document both options clearly; migration guide |
| R-002 | Security: malicious worktree.json executes arbitrary commands | H | M | Mandatory user confirmation gate before executing any lifecycle script |
| R-003 | Centralized worktrees orphaned when repo deleted | M | M | Add cleanup command in quick_reference.md |
| R-004 | Double-setup: worktree.json setup[] + auto-detect both run | M | M | Explicit rule: worktree.json replaces auto-detect when non-empty |
| R-005 | Legacy ~/.config/superpowers/worktrees/ users stranded | M | L | Migration note documenting path change |

---

## 11. USER STORIES

### US-001: Centralized Worktree Creation (Priority: P0)

**As a** developer using sk-git, **I want** worktrees created in a centralized location outside my repo, **so that** my project directory stays clean and worktrees are organized by project.

**Acceptance Criteria**:
1. Given I invoke worktree creation, When I accept the default location, Then the worktree is created at `~/.opencode/worktrees/<project>/<branch>/`
2. Given a centralized worktree exists, When I list worktrees, Then I see the full path

### US-002: Config-Driven Lifecycle Hooks (Priority: P0)

**As a** developer, **I want** to define setup and teardown scripts in a config file, **so that** each new worktree is automatically prepared with my project's dependencies.

**Acceptance Criteria**:
1. Given `.opencode/worktree.json` exists with `"setup": ["npm install"]`, When a worktree is created, Then the AI shows the command and asks for confirmation before running
2. Given `.opencode/worktree.json` exists with `"teardown": ["docker-compose down"]`, When a worktree is deleted, Then the AI shows the command and asks for confirmation before running
3. Given `.opencode/worktree.json` has non-empty `setup[]`, When auto-detect would also run, Then ONLY worktree.json setup runs (replaces auto-detect)

### US-003: Security Gate for Lifecycle Scripts (Priority: P0)

**As a** developer, **I want** the AI to show me lifecycle commands before executing them, **so that** I'm protected from malicious worktree.json in cloned repositories.

**Acceptance Criteria**:
1. Given worktree.json has setup commands, When worktree is created, Then AI shows commands and waits for explicit "yes" before executing
2. Given user declines execution, When setup is skipped, Then worktree creation still completes (without setup)

### US-004: Pre-Deletion Safety Checks (Priority: P1)

**As a** developer, **I want** safety checks before worktree deletion, **so that** I don't accidentally lose uncommitted or unpushed work.

**Acceptance Criteria**:
1. Given a worktree has uncommitted changes, When I try to delete it, Then I see a warning with option to proceed or abort
2. Given a worktree has unpushed commits, When I try to delete it, Then I see a count of unpushed commits with option to proceed

---

## 12. OPEN QUESTIONS

- None — all architectural decisions resolved through Superset source code analysis.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research**: Superset IDE source analysis (3-agent parallel research)

---

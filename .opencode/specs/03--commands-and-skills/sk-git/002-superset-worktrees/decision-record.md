---
title: "Decision Record: sk-git Superset Worktree Alignment"
description: "Architectural decisions for aligning sk-git with Superset IDE's worktree model"
trigger_phrases:
  - "sk-git decisions"
  - "worktree alignment decisions"
importance_tier: "normal"
contextType: "decision"
---
# Decision Record: sk-git Superset Worktree Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

## ADR-001: Centralized Worktree Storage

**Status**: Accepted
**Date**: 2026-02-28

**Context**: Superset IDE stores all worktrees in `~/.superset/worktrees/<project>/<branch>/`, keeping project directories clean. The current sk-git skill uses `.worktrees/` inside the project directory. The centralized model supports better organization across multiple projects and aligns with Superset's proven pattern.

**Decision**: Adopt `~/.opencode/worktrees/<project>/<branch>/` as the NEW default location. Keep `.worktrees/` (project-local) as a supported fallback with clear detection: if `.worktrees/` already exists in a project, use it; otherwise default to centralized.

**Directory resolution priority** (mirrors Superset):
1. Project-level override (if worktree.json specifies `worktreeBaseDir`)
2. Existing project-local: `.worktrees/` (if directory exists)
3. Global default: `~/.opencode/worktrees/<project>/<branch>/`

**Consequences**:
- (+) Project directories stay clean
- (+) Worktrees organized by project in one location
- (+) Matches Superset's architecture
- (+) Backward compatible — existing `.worktrees/` users unaffected
- (-) New users must know the centralized location (mitigated by `git worktree list`)

**Alternatives Rejected**:
- **Keep `.worktrees/` only**: Doesn't align with Superset; clutters project dir
- **Centralized only, no fallback**: Breaks backward compatibility for existing users
- **`~/.config/opencode/worktrees/`**: XDG-compliant but doesn't match Superset's `~/.superset/` pattern

---

## ADR-002: Config-Driven Lifecycle Hooks

**Status**: Accepted
**Date**: 2026-02-28

**Context**: Superset uses `.superset/config.json` with `{ "setup": [...], "teardown": [...] }` to automate dependency installation when worktrees are created and cleanup when destroyed. sk-git currently has no lifecycle hook system — it auto-detects project type (package.json, Cargo.toml, etc.) and runs standard commands inline.

**Decision**: Adopt `.opencode/worktree.json` with schema: `{ "setup": [...], "teardown": [...] }`. Simple single-location loading from `<main-repo>/.opencode/worktree.json`. Multi-level config resolution hierarchy deferred to follow-up spec.

**Config vs auto-detect rule**: If worktree.json `setup[]` is present and non-empty, it REPLACES auto-detect setup. If absent or empty, fall back to existing auto-detect behavior.

**Security gate**: AI MUST show the user the commands from worktree.json and get explicit confirmation before executing. This prevents arbitrary command execution from malicious worktree.json files in cloned repositories.

**Deferred to follow-up**:
- Multi-level config resolution hierarchy (user override → worktree → project default)
- Environment variable injection (`SK_GIT_ROOT_PATH`, `SK_GIT_WORKSPACE_NAME`)

**Consequences**:
- (+) Automated, repeatable workspace setup
- (+) Project-specific teardown (Docker, database cleanup, etc.)
- (+) Adapted from Superset's pattern
- (+) Optional — missing config = no hooks, graceful degradation
- (+) Security gate prevents malicious script execution
- (-) New file for users to create (mitigated by config template asset)
- (-) User must confirm lifecycle scripts each time (mitigated: small friction for significant security benefit)

**Alternatives Rejected**:
- **Git hooks (post-checkout)**: Can't cover teardown; not per-project without custom scripts
- **Makefile targets (`make setup`, `make teardown`)**: Different paradigm; not aligned with Superset
- **Auto-detect only (current approach)**: No teardown support; can't handle custom stacks
- **package.json scripts**: Language-specific; doesn't work for non-Node projects

---

## ADR-003: Branch Name Sanitization Pipeline

**Status**: Deferred (follow-up spec)
**Date**: 2026-02-28

**Context**: Superset sanitizes branch names through a multi-step pipeline: lowercase, replace invalid chars with hyphens, strip `.lock`, truncate to 100 chars, deduplicate with `-1`/`-2` suffixes. sk-git currently uses `type/description` convention with no automated sanitization, which can lead to invalid branch names.

**Decision**: Adopt a shell-based sanitization pipeline:
1. **Sanitize**: lowercase, replace non-alphanumeric (except `/` and `-`) with hyphens, collapse multiple hyphens, strip `.lock`, max 50 chars per segment
2. **Truncate**: Cap total length at 100 characters, cut at word boundary
3. **Deduplicate**: If branch exists, append `-1`, `-2`, etc.
4. **Preview**: Always show the sanitized name to user before proceeding

**Consequences**:
- (+) Valid, consistent branch names from any user input
- (+) Prevents Git errors from invalid characters
- (+) Matches Superset's sanitization approach
- (+) User sees preview before creation
- (-) Sanitized name may differ from user intent (mitigated by preview)
- (-) The prefix `type/` convention is preserved but sanitization applies to the description part

**Alternatives Rejected**:
- **No sanitization (status quo)**: Users get Git errors with special chars
- **Strict validation (reject invalid)**: Poor UX — auto-fix is friendlier
- **Full Superset pipeline (with DB dedup)**: Over-engineered for CLI; git-based dedup sufficient

---

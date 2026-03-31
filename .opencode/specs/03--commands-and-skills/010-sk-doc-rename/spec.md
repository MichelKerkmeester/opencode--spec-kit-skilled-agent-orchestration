---
title: "Feature Specification: sk-doc Repo-Wide Rename and Visual Skill [03--commands-and-skills/010-sk-doc-rename/spec]"
description: "The repository used legacy skill identifiers and paths. This implementation standardized documentation-skill identifiers to sk-doc and removed stale visual-skill references from live docs."
trigger_phrases:
  - "feature"
  - "specification"
  - "rename"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
SPECKIT_LEVEL: "2"
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
---
# Feature Specification: sk-doc Repo-Wide Rename and Visual Skill Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-23 |

---
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Public repository previously contained legacy documentation-skill identifiers plus stale references to a removed visual skill across content, folder paths, and runtime symlink names. That caused routing drift and inconsistent command/skill discovery behavior across runtime profiles.

### Purpose

Complete a deterministic migration to `sk-doc` and remove stale visual-skill references, with verified zero remnants of the tracked legacy identifier families in the scoped repository.

---
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Repository-wide identifier migration in `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public`.
- Filesystem path and symlink-name migration for documentation skill references plus cleanup of stale visual-skill references.
- Verification and conditional no-op/update handling for `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/AGENTS.md`.
- Evidence capture in `scratch/` and completion evidence in `checklist.md`.

### Out of Scope

- Functional behavior changes inside skill logic.
- Non-rename refactors.
- External repository edits beyond the single conditional AGENTS file check.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/**` | Modify | Content identifier replacement to canonical names. |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/*` | Move/Rename | Canonical documentation-skill path migration and stale visual reference repair. |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.claude/skills/*` | Rename | Runtime symlink-name and target updates. |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.gemini/skills/*` | Rename | Runtime symlink-name and target updates. |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/AGENTS.md` | Verify/Conditional Modify | Check for legacy matches and update only if needed. |

---
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Replace all scoped legacy documentation-skill identifier references with canonical naming. | `PC-001` and `PC-004` pass. |
| REQ-002 | Remove or neutralize all scoped stale visual-skill identifier references in live docs. | `PC-001` and `PC-004` pass. |
| REQ-003 | Rename/retarget affected folder paths and symlink names. | `PC-002` and `PC-003` pass. |
| REQ-004 | Run full validation and completion checks. | `PC-005` and `PC-006` pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-101 | Preserve repo behavior outside rename scope. | Skill advisor smoke tests pass for `sk-doc` and unaffected routing flows. |
| REQ-102 | Preserve evidence traceability for migration operations. | `scratch/` artifacts document baseline, migration, and final checks. |

---
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Final remnant count report shows `0` for every tracked legacy identifier token family.
- **SC-002**: Path-rename map and execution log both contain 17 completed renames.
- **SC-003**: Runtime symlink report contains only supported names pointing to supported skill paths, with no stale visual-skill claims.
- **SC-004**: External AGENTS check in Barter repo reports zero matches and no edit required.
- **SC-005**: `validate.sh` and `check-completion --strict` both pass.

---

### Acceptance Scenarios

1. **Given** preflight reports show legacy identifier presence, **when** migration completes, **then** `final-remnant-counts.txt` shows only zeros.
2. **Given** ordered rename map entries exist, **when** execution finishes, **then** rename log count equals map count and flatten fix resolves nested-path leftovers.
3. **Given** runtime profile symlinks are migrated, **when** post-path verification runs, **then** symlink inventory contains only supported aliases and no stale visual-skill target claims.
4. **Given** external AGENTS file may include legacy identifiers, **when** scoped check runs, **then** file is unchanged on zero-match outcome.

---
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Write access to Public repo paths | Partial migration | Execute in ordered phases and re-verify after each phase. |
| Dependency | Availability of `rg`, `find`, `test`, and spec-kit scripts | Incomplete validation | Run toolchain checks before completion gates. |
| Risk | Nested path move ordering | Temporary residual subpaths | Apply flatten fix after ordered path moves and re-check remnants. |
| Risk | Symlink target drift | Skill resolution failures | Generate post-migration symlink inventory and verify supported targets. |
| Risk | External scope creep | Unintended edits outside scope | Restrict external action to one AGENTS file with match-gated update policy. |

---

---
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All required implementation evidence has been captured and validated.

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
<!-- /ANCHOR:questions -->

---

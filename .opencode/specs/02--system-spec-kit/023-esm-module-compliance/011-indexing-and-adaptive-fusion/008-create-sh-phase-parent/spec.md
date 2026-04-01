---
title: "Feature Specification: Append Nested Child Phases in create.sh [02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion/008-create-sh-phase-parent]"
description: "Document the planned create.sh changes needed to append child phases under existing nested parent folders in .opencode/specs without breaking current flat-spec behavior."
trigger_phrases:
  - "phase parent alias"
  - "nested phase append"
  - "create sh nested specs"
  - "phase-parent planning"
importance_tier: "critical"
contextType: "planning"
---
# Feature Specification: Append Nested Child Phases in create.sh

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

`create.sh` can create phases and append phases under flat parent folders, but it does not cleanly support nested parent folders under `.opencode/specs`. The current behavior assumes `SPECS_DIR="$REPO_ROOT/specs"`, validates only the basename in `resolve_and_validate_spec_path()`, and exposes `--parent` rather than the requested `--phase-parent` intent. This phase defines the implementation plan for fixing nested parent path acceptance, output tree resolution, and child phase numbering without modifying `create.sh` yet.

**Key Decisions**: Accept `--phase-parent` as the public flag surface, and resolve append targets from the validated parent path instead of a single global specs root.

**Critical Dependencies**: Current `create.sh` behavior, nested `.opencode/specs` parent folders, and future verification coverage for flat and nested paths.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-04-01 |
| **Branch** | `011-008-create-sh-phase-parent` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The phase creation workflow breaks when the parent folder lives inside a nested spec tree such as `02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion`. Today there is no `--phase-parent` flag, `--parent` is the only supported flag in phase mode, `resolve_and_validate_spec_path()` validates only the basename against `^[0-9]{3}-[A-Za-z0-9._-]+$`, and `SPECS_DIR` always points to `$REPO_ROOT/specs`. That combination makes append behavior fragile or wrong for `.opencode/specs` phase work.

### Purpose

Define the documentation, decisions, and task plan for a safe `create.sh` update that can append new child phases under existing nested parent folders in `.opencode/specs` and flat `specs/` trees.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Document the intended flag surface for nested phase append behavior
- Define validation rules for nested spec trees, including track folders like `02--system-spec-kit`
- Define output path resolution rules for `.opencode/specs/` parent trees
- Define child phase numbering rules when appending to existing nested parents
- Define backward compatibility expectations for current `--phase --parent` behavior
- Define verification coverage for flat and nested append cases

### Out of Scope
- Editing `create.sh` in this task
- Shipping tests or runtime changes in this task
- Changing unrelated spec creation behavior outside phase append handling
- Refactoring the whole script beyond what nested append support needs

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh` | Modify | Future implementation target for nested append handling |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Review | Future verification dependency if create behavior changes need validation support |
| `spec.md` | Create | Phase specification |
| `plan.md` | Create | Technical implementation plan |
| `tasks.md` | Create | Future implementation task list |
| `checklist.md` | Create | Verification tracking |
| `decision-record.md` | Create | ADR for path and flag behavior |
| `implementation-summary.md` | Create | Honest status stub |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Accept `--phase-parent` as an alias or equivalent supported flag for nested parent paths | A future `create.sh --phase --phase-parent <nested-parent>` call is accepted and routed to the same append flow as the current `--parent` behavior |
| REQ-002 | Preserve current `--phase --parent` behavior | Existing flat parent append flows still work after the change with no required caller updates |
| REQ-003 | Validate nested parent paths under both `specs/` and `.opencode/specs/` | Parent paths like `02--system-spec-kit/023-esm-module-compliance/011-indexing-and-adaptive-fusion` are accepted when they resolve under an approved root |
| REQ-004 | Stop assuming all phase append work belongs under `$REPO_ROOT/specs` | Output directory resolution uses the validated parent folder tree, including `.opencode/specs/` parents |
| REQ-005 | Append child phases with correct numbering under existing nested parents | If a nested parent already contains child folders, the next child number is computed from that parent tree and not from an unrelated flat tree |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Update help text and usage examples | `create.sh --help` shows `--phase-parent` support and includes a nested `.opencode/specs/` example |
| REQ-007 | Keep path validation strict enough to reject invalid folders | Invalid paths outside approved roots or malformed leaf folders still fail with a direct error |
| REQ-008 | Add verification coverage for flat and nested phase append flows | Planned verification covers flat `specs/`, nested `.opencode/specs/`, bad path rejection, and numbering correctness |
| REQ-009 | Document the implementation choice in an ADR | `decision-record.md` records why parent-derived resolution is preferred over a single global specs root |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Documentation fully describes the nested phase append problem and intended behavior
- **SC-002**: Future implementation can add `--phase-parent` support without ambiguity about aliasing, validation, or numbering
- **SC-003**: Planned verification covers both flat and nested parent trees
- **SC-004**: No document in this phase claims `create.sh` has already been fixed
- **SC-005**: Phase artifacts are placeholder-free and aligned with the real current behavior of the script
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Current `create.sh` phase append flow | Needed to design a minimal, compatible fix | Keep the plan tied to current helper functions and append flow |
| Risk | Over-correcting path validation | Could open unsafe path handling or break flat workflows | Keep approved-root checks and validate the final leaf folder format |
| Risk | Aliasing `--phase-parent` poorly | Could create confusing precedence with `--parent` | Define one canonical internal variable and parse both flags into it |
| Risk | Number scanning uses the wrong base directory | Could create duplicate or skipped child numbers | Drive scanning from the validated parent folder only |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Safety
- **NFR-S01**: Path resolution must stay confined to approved roots under `specs/` and `.opencode/specs/`
- **NFR-S02**: Error messages must be direct enough to distinguish bad path input from unsupported workflow input

### Reliability
- **NFR-R01**: The same parent path should always resolve to the same output tree
- **NFR-R02**: Child numbering must be deterministic across repeated append runs

### Maintainability
- **NFR-M01**: The fix should reuse the existing append flow rather than split nested and flat behavior into separate code paths unless required
- **NFR-M02**: Help text and examples should explain the supported parent path forms

---

## 8. EDGE CASES

### Path Boundaries
- Nested parent under `.opencode/specs/` with a track folder prefix such as `02--system-spec-kit`
- Relative parent path with multiple segments but a valid leaf folder name
- Absolute parent path under an approved root
- Invalid path that resolves outside approved roots through traversal attempts

### Existing Tree States
- Parent has no child phases yet and needs `001-*`
- Parent already has children and needs the next number after the highest existing child
- Parent contains non-phase directories such as `memory/` and `scratch/` that must not affect numbering
- Parent lives under `.opencode/specs/` while `SPECS_DIR` still points at `specs/`

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 17/25 | One shell script, path parsing, help text, and verification coverage |
| Risk | 20/25 | Path validation and output routing can break existing spec creation flows |
| Research | 8/20 | Current behavior already known, limited extra discovery needed |
| Multi-Agent | 2/15 | Single implementation phase expected |
| Coordination | 7/15 | Must align nested `.opencode/specs/` and flat `specs/` behavior |
| **Total** | **54/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Nested parent paths pass validation but still write to the wrong tree | H | M | Resolve output from the validated parent folder, not global `SPECS_DIR` |
| R-002 | `--phase-parent` breaks existing callers that still use `--parent` | H | L | Support both flags and test both entry points |
| R-003 | Validation becomes too permissive for non-spec directories | H | M | Keep approved-root checks and validate the leaf folder format after resolution |
| R-004 | Child number scanning counts unrelated folders | M | M | Scan only immediate child phase directories under the chosen parent |

---

## 11. USER STORIES

### US-001: Append a new child phase under a nested parent (Priority: P0)

**As a** spec author, **I want** `create.sh` to accept a nested `.opencode/specs/` parent path, **so that** I can append new child phases under an existing parent without moving folders or using workarounds.

**Acceptance Criteria**:
1. **Given** a nested parent under `.opencode/specs/`, **When** I run `create.sh --phase --phase-parent <parent> ...`, **Then** the script accepts the path and enters append mode.
2. **Given** that same nested parent already contains child phases, **When** I append a new one, **Then** the next child folder number is computed from that parent tree only.

---

### US-002: Keep existing flat parent append behavior intact (Priority: P0)

**As a** maintainer, **I want** current `--phase --parent` behavior to keep working, **so that** the nested-path fix does not break existing flat spec workflows.

**Acceptance Criteria**:
1. **Given** a flat parent under `specs/`, **When** I run `create.sh --phase --parent <parent> ...`, **Then** the script still appends child phases successfully.
2. **Given** the new `--phase-parent` alias, **When** an existing caller still uses `--parent`, **Then** the script still follows the same append flow and produces the same output tree.

---

### US-003: Reject invalid parent paths clearly (Priority: P1)

**As a** maintainer, **I want** bad parent paths to fail with clear errors, **so that** we do not silently write files into the wrong part of the repository.

**Acceptance Criteria**:
1. **Given** a path outside `specs/` or `.opencode/specs/`, **When** I pass it as a phase parent, **Then** the script exits with a direct approved-root error.
2. **Given** a path whose leaf directory is not a valid spec folder name, **When** I pass it as a phase parent, **Then** the script exits with a direct leaf-folder validation error.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should `--phase-parent` become the preferred public flag while `--parent` remains a compatibility alias, or should both remain equally documented?
- Does any downstream automation parse `create.sh --help` output and need synchronized wording updates?

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent Phase**: See `../spec.md`

---

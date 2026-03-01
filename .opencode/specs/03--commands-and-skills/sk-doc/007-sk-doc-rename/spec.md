---
title: "Feature Specification: sk-doc + sk-doc-visual Repo-Wide Rename [template:level_2/spec.md]"
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
SPECKIT_LEVEL: "2"
description: "The repository used legacy skill identifiers and paths. This implementation standardized identifiers to sk-doc and sk-doc-visual across content, paths, and symlinks."
trigger_phrases:
  - "feature"
  - "specification"
  - "rename"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: sk-doc + sk-doc-visual Repo-Wide Rename

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
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Public repository previously contained two legacy identifiers for documentation and visual-documentation skills across content, folder paths, and runtime symlink names. That caused routing drift and inconsistent command/skill discovery behavior across runtime profiles.

### Purpose
Complete a deterministic migration to `sk-doc` and `sk-doc-visual`, with verified zero remnants of both legacy identifier families in the scoped repository.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repository-wide identifier migration in `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public`.
- Filesystem path and symlink-name migration for documentation and visual-doc skills.
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
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/*` | Move/Rename | Canonical skill folder-path migration and reference repair. |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.claude/skills/*` | Rename | Runtime symlink-name and target updates. |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.gemini/skills/*` | Rename | Runtime symlink-name and target updates. |
| `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/AGENTS.md` | Verify/Conditional Modify | Check for legacy matches and update only if needed. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Replace all scoped legacy documentation-skill identifier references with canonical naming. | `PC-001` and `PC-004` pass. |
| REQ-002 | Replace all scoped legacy visual-doc identifier references with canonical naming. | `PC-001` and `PC-004` pass. |
| REQ-003 | Rename/retarget affected folder paths and symlink names. | `PC-002` and `PC-003` pass. |
| REQ-004 | Run full validation and completion checks. | `PC-005` and `PC-006` pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-101 | Preserve repo behavior outside rename scope. | Skill advisor smoke tests pass for both canonical skills. |
| REQ-102 | Preserve evidence traceability for migration operations. | `scratch/` artifacts document baseline, migration, and final checks. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Final remnant count report shows `0` for every tracked legacy identifier token family.
- **SC-002**: Path-rename map and execution log both contain 17 completed renames.
- **SC-003**: Runtime symlink report contains only canonical names pointing to canonical skill paths.
- **SC-004**: External AGENTS check in Barter repo reports zero matches and no edit required.
- **SC-005**: `validate.sh` and `check-completion --strict` both pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Write access to Public repo paths | Partial migration | Execute in ordered phases and re-verify after each phase. |
| Dependency | Availability of `rg`, `find`, `test`, and spec-kit scripts | Incomplete validation | Run toolchain checks before completion gates. |
| Risk | Nested path move ordering | Temporary residual subpaths | Apply flatten fix after ordered path moves and re-check remnants. |
| Risk | Symlink target drift | Skill resolution failures | Generate post-migration symlink inventory and verify targets. |
| Risk | External scope creep | Unintended edits outside scope | Restrict external action to one AGENTS file with match-gated update policy. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Baseline and final scans complete in local shell workflow without interactive retries.
- **NFR-P02**: Migration remains reproducible from recorded artifacts (`preflight`, `map`, `log`, `final counts`).

### Security
- **NFR-S01**: No secrets introduced during rename operations.
- **NFR-S02**: External write scope constrained to one explicitly listed file and only on positive match.

### Reliability
- **NFR-R01**: Post-migration remnant report is all zeros.
- **NFR-R02**: Runtime symlink targets resolve to canonical skill paths.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty matches: No-op behavior for files with no legacy identifiers.
- Large docs/assets: Replace identifiers without truncation or format breakage.
- Mixed case tokens: Include uppercase and title-case legacy variants in remnant policy verification.

### Error Scenarios
- Path move ordering conflicts: Resolve with flatten fix and rerun remnant/path checks.
- Partial operation: Resume from rename map and verify with rename log parity.
- External file no-match: Record no-op outcome and do not modify file.

### State Transitions
- Setup -> Implementation: Proceed only after baseline artifacts exist.
- Implementation -> Verification: Proceed only after path + symlink migration artifacts exist.
- Verification -> Completion: Proceed only after validation and strict completion checks pass.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 24/25 | Repo-wide content + path + symlink migration. |
| Risk | 17/25 | Ordering and remnant risks mitigated with artifact-backed verification. |
| Research | 11/20 | Baseline discovery and conditional external verification completed. |
| **Total** | **52/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 9. ACCEPTANCE SCENARIOS

1. **Given** preflight reports show legacy identifier presence, **when** migration completes, **then** `final-remnant-counts.txt` shows only zeros.
2. **Given** ordered rename map entries exist, **when** execution finishes, **then** rename log count equals map count and flatten fix resolves nested-path leftovers.
3. **Given** runtime profile symlinks are migrated, **when** post-path verification runs, **then** symlink inventory contains only canonical aliases.
4. **Given** external AGENTS file may include legacy identifiers, **when** scoped check runs, **then** file is unchanged on zero-match outcome.

---

## 10. OPEN QUESTIONS

- None. All required implementation evidence has been captured and validated.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

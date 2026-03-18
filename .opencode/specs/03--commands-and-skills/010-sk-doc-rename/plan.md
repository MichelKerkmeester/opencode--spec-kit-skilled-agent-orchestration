---
title: "Implementation Plan: sk-doc Repo-Wide Rename and Visual Skill Cleanup [template:level_2/plan.md]"
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
SPECKIT_LEVEL: "2"
description: "Executed migration plan for canonical documentation-skill identifiers plus live-doc cleanup of stale visual-skill references, with artifact-backed validation and strict completion checks."
trigger_phrases:
  - "implementation"
  - "plan"
  - "rename"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: sk-doc Repo-Wide Rename and Visual Skill Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, JSON, HTML, shell workflow |
| **Framework** | Filesystem/content migration with staged verification |
| **Storage** | Git working tree |
| **Testing** | `rg`, `find`, `test`, spec-kit validators, skill-advisor smoke checks |

### Overview
The migration was executed across the Public repo to standardize the canonical documentation-skill identifier (`sk-doc`) and remove stale visual-skill references from live docs, folder paths, and runtime symlink evidence. Execution used preflight discovery, ordered path renames, post-rename flatten correction, content replacement, and final zero-remnant verification. External AGENTS verification in the Barter repo returned zero matches, so no external modification was required.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Checks `PC-001` to `PC-006` passing
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Phased migration with artifact-backed verification

### Key Components
- **Preflight Capture**: Baseline counts, path inventory, and symlink inventory in `scratch/`.
- **Path Migration Engine**: Ordered rename map execution with flatten fix for nested path edge cases.
- **Content Migration Engine**: Repo-wide identifier replacement over scoped files.
- **Verification Harness**: Remnant-zero checks, symlink validation, external file no-op check, and strict completion checks.

### Data Flow
Preflight artifacts established baseline -> ordered path migration executed -> flatten correction applied -> content updates completed -> final remnant/symlink/external checks executed -> spec validation and strict completion checks passed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Captured baseline references and counts (`scratch/preflight-counts.txt`).
- [x] Captured baseline path inventory (`scratch/preflight-paths.txt`).
- [x] Captured baseline symlink inventory (`scratch/preflight-symlinks.txt`).
- [x] Recorded rename map candidates (`scratch/path-rename-map.tsv`).

### Phase 2: Core Implementation
- [x] Executed ordered path renames (`scratch/path-rename-map-ordered.tsv`, `scratch/path-rename-log.txt`).
- [x] Applied flatten fix for nested dirs created by initial move ordering.
- [x] Executed content replacement over scoped files (`scratch/content-replacement-files.txt`).
- [x] Verified post-path symlink targets (`scratch/post-path-symlinks.txt`).

### Phase 3: Verification
- [x] Confirmed final remnant counts are zero (`scratch/final-remnant-counts.txt`).
- [x] Verified external AGENTS check returned zero matches (no update required).
- [x] Ran skill-advisor smoke checks for supported routing behavior.
- [x] Ran `validate.sh` and strict completion checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A for naming migration | N/A |
| Integration | Path + symlink behavior across runtime profile folders | `find`, `test` |
| Manual | End-to-end remnant policy and supported routing behavior | `rg`, `skill_advisor.py`, spec-kit scripts |

### Planned Checks (all must pass)

- **PC-001 Final remnant policy check**
  - Command: `awk -F ': ' '$2 != 0 {print}' ".opencode/specs/03--commands-and-skills/010-doc-rename/scratch/final-remnant-counts.txt"`
  - Result: PASS (no non-zero rows).
- **PC-002 Path migration integrity check**
  - Commands:
    - `test -d "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-doc"`
      - `wc -l .opencode/specs/03--commands-and-skills/010-doc-rename/scratch/path-rename-map.tsv .opencode/specs/03--commands-and-skills/010-doc-rename/scratch/path-rename-log.txt`
  - Result: PASS (`sk-doc` path present; map/log parity 17/17; live docs no longer assert a removed visual target).
- **PC-003 Symlink integrity check**
  - Command: `cat .opencode/specs/03--commands-and-skills/010-doc-rename/scratch/post-path-symlinks.txt`
  - Result: PASS (supported aliases and supported targets only).
- **PC-004 Content replacement coverage check**
  - Command: `wc -l .opencode/specs/03--commands-and-skills/010-doc-rename/scratch/content-replacement-files.txt`
  - Result: PASS (330 files processed).
- **PC-005 Conditional external verification**
  - Command (executed): `rg -n "<legacy-doc-identifier>|<legacy-visual-skill-identifier>" "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/AGENTS.md" || true`
  - Result: PASS (0 matches; no external edit).
- **PC-006 Documentation validation and completion gates**
  - Commands:
    - `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/03--commands-and-skills/010-doc-rename`
    - `bash .opencode/skill/system-spec-kit/scripts/spec/check-completion.sh .opencode/specs/03--commands-and-skills/010-doc-rename --strict`
  - Result: PASS.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Public repo filesystem access | Internal | Complete | Would block path/content migration. |
| Shell tooling (`rg`, `find`, `test`, `awk`) | Internal | Complete | Would block verification execution. |
| Barter AGENTS read access | External (adjacent repo) | Complete | Would block conditional external verification. |
| Spec-kit validator scripts | Internal | Complete | Would block completion gate verification. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any non-zero remnant count or failed canonical path/symlink verification.
- **Procedure**: Revert migration changeset, restore baseline path/symlink state, rerun preflight checks, and re-execute path/content phases in ordered batches.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Setup) -> Phase 2 (Core) -> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2 hours |
| Core Implementation | High | 3-5 hours |
| Verification | Medium | 1-2 hours |
| **Total** | | **5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline artifacts captured.
- [x] Ordered rename map prepared and executed.
- [x] Post-rename verification artifacts captured.

### Rollback Procedure
1. Stop completion flow at first failing P0 check.
2. Revert migration changeset in git.
3. Re-run preflight inventory and compare against baseline artifact set.
4. Reapply migration with narrower rename batches if needed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->

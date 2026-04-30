---
title: "Spec: Deep-Review/Research Skill Contract Fixes"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Two skill-contract fixes: (1) iteration audit trail must be staged for commit (skill-owned, not operator-dependent); (2) artifact subfolder convention changes from always-pt-NN to flat-first-on-empty-rootdir, branching only when prior content exists."
trigger_phrases:
  - "028-deep-review-skill-contract-fixes"
  - "deep-review iteration commit"
  - "deep-review pt-01 branching"
  - "resolveArtifactRoot flat first"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/028-deep-review-skill-contract-fixes"
    last_updated_at: "2026-04-29T11:12:30Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implementation complete + shipped"
    next_safe_action: "Closed; monitor future deep-review/research runs for flat-first artifact roots"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: Deep-Review/Research Skill Contract Fixes

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `011-mcp-runtime-stress-remediation` |
| **Source** | Direct user observations of (a) `005-post-program-cleanup/review/005-post-program-cleanup-pt-01/` shipped without iteration trail in commit `6a8095907` and (b) unnecessary `pt-01` wrapper on first-run reviews |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two contract violations in the deep-review/deep-research skill output:

**Bug 1 — Iteration audit trail not staged for commit**: Commit `6a8095907 feat(026/000/005/005): post-program cleanup loop + validator local-leak fix` shipped only the `review-report` markdown (193 lines) and dropped the entire iteration trail (`iterations/`, `deltas/`, `deep-review-state.jsonl`, `deep-review-strategy` markdown, `deep-review-config.json`, `deep-review-findings-registry.json`). The skill's externalized-state contract was violated.

Root cause: the deep-review YAML at `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:1142-1149` declares the `git add` for iteration files in a `reference_only_appendix` block with the explicit note "Checkpoint commits are intentionally excluded from workflow.steps." So the workflow never stages iteration files. Operators who do `git add review-report.md` (the obvious target file) miss everything else.

**Bug 2 — Always-pt-NN wrapper for child phases on first run**: `resolveArtifactRoot` (`.opencode/skill/system-spec-kit/shared/review-research-paths.cjs:199-224`) always wraps child-phase artifacts in a `{phaseSlug}-pt-NN` subfolder, even on first run. This produces unnecessary nesting like `005-post-program-cleanup/review/005-post-program-cleanup-pt-01/` when the parent's `review/` folder is empty. The `pt-NN` convention should only kick in when there's already prior content (re-review scenarios), not on every first run.

### Purpose

Fix both contract violations:
- **Fix 1**: Skill stages all artifacts under `{artifact_dir}` at synthesis completion via `git add {artifact_dir}`. Operator's subsequent `git commit` includes everything by default. No per-iteration commits (those would spam history).
- **Fix 2**: `resolveArtifactRoot` returns flat (`subfolder: null`) for child phases on first run when the `{mode}/` directory is empty. Allocates `pt-NN` only when prior artifacts exist (a flat artifact OR existing pt-NN folders) AND the prior is for a different target / non-matching session.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Update `resolveArtifactRoot` in `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs`:
  - Child phases with EMPTY `{mode}/` directory → flat (artifactDir = rootDir, subfolder = null)
  - Child phases with EXISTING flat config matching current target → reuse flat
  - Child phases with EXISTING pt-NN matching current target → reuse pt-NN (existing behavior)
  - Child phases where prior artifacts exist and don't match current target → allocate pt-NN (existing behavior)
  - Root specs → flat (no change)

- Add `git add {state_paths.artifact_dir}` step in synthesis phase of:
  - `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
  - Place AFTER the synthesis-output write so the staged set includes the synthesis report AND all upstream state.
  - DO NOT auto-commit — operators retain commit authority.

- Update existing tests in `.opencode/skill/system-spec-kit/scripts/tests/review-research-paths.vitest.ts` to reflect the new flat-first behavior. Add new test cases for:
  - First run with empty rootDir → flat
  - Reuse flat on continuation (config matches current target)
  - Allocate pt-NN when prior content exists (flat or pt-NN) for different target

- Update doc references where the "always pt-NN" rule is described:
  - `.opencode/skill/sk-deep-review/SKILL.md`
  - `.opencode/skill/sk-deep-research/SKILL.md`
  - `.opencode/skill/sk-deep-review/references/state_format.md`
  - `.opencode/skill/sk-deep-research/references/state_format.md`
  - `.opencode/skill/sk-deep-review/references/loop_protocol.md`
  - `.opencode/skill/sk-deep-research/references/loop_protocol.md`
  - `.opencode/skill/system-spec-kit/references/structure/folder_structure.md`

### Out of Scope

- Migrating existing pt-01 folders for previously-reviewed phases. Existing folders stay; the new convention applies to new reviews.
- Changing the agent dispatch contract or any LEAF agent code.
- Per-iteration auto-commit (only one stage step at synthesis end).
- Auto-pushing or any remote git operations.

### Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` | Edit | Update `resolveArtifactRoot` for flat-first on empty rootDir |
| `.opencode/skill/system-spec-kit/scripts/tests/review-research-paths.vitest.ts` | Edit | Update existing tests + add flat-first cases |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Edit | Add `git add {artifact_dir}` step at synthesis end |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Edit | Same as auto |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Edit | Same as auto |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Edit | Same as auto |
| `.opencode/skill/sk-deep-review/SKILL.md` | Edit | Update flat-first convention doc |
| `.opencode/skill/sk-deep-research/SKILL.md` | Edit | Same |
| `.opencode/skill/sk-deep-review/references/state_format.md` | Edit | Same |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Edit | Same |
| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Edit | Same |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Edit | Same |
| `.opencode/skill/system-spec-kit/references/structure/folder_structure.md` | Edit | Same |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none)

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `resolveArtifactRoot` returns flat for child phases when rootDir is empty. | Test "first run on child phase with empty rootDir" asserts `subfolder === null` and `artifactDir === rootDir`. |
| REQ-002 | Reuse flat when current target matches flat config. | Test "second run on same child target reuses flat" asserts continuation case. |
| REQ-003 | Allocate pt-NN when prior content exists for different target OR explicit re-review. | Test "branch when prior flat is for different target" asserts pt-NN allocation. |
| REQ-004 | Existing pt-NN reuse for matching target preserved. | Existing test "reuses an existing packet for the same child target" still passes. |
| REQ-005 | Synthesis step stages all artifacts via `git add {artifact_dir}`. | Both deep-review YAMLs and both deep-research YAMLs include the stage step at synthesis end. Verified by grep + manual inspection. |

### Acceptance Scenarios

1. **Given** an empty `review/` folder under a child phase, **when** the deep-review skill runs, **then** artifacts land flat at `{spec_folder}/review/` with no `pt-NN` wrapper.
2. **Given** synthesis completes for a deep-review or deep-research run, **when** the skill executes the new `step_stage_artifact_dir`, **then** all files under `{state_paths.artifact_dir}` are staged in git so the operator's next commit includes the iteration audit trail by default.
| REQ-006 | Doc references updated. | Mentions of "always pt-NN" replaced with "flat-first; pt-NN only when prior content exists" or equivalent. |
| REQ-007 | TypeScript + vitest pass. | `npx tsc --noEmit` clean; `npx vitest run scripts/tests/review-research-paths.vitest.ts` exits 0. |
| REQ-008 | Strict validator on this packet exits 0. | `validate.sh <packet> --strict` passes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Resolver tests green; new tests cover the flat-first behavior.
- **SC-002**: All four YAMLs include the `git add` synthesis step.
- **SC-003**: Future deep-review/research runs on first-run child phases produce flat directories (no `pt-01` wrapper).
- **SC-004**: Future runs commit cleanly: operator running `git add specs/.../review/.../` (or letting the auto-stage handle it) gets the entire iteration trail.
- **SC-005**: Strict validator green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Existing pt-01 directories under previously-reviewed phases now become "stale" relative to new convention | Out of scope: existing folders stay; convention only applies to new reviews. State_format docs note both shapes are valid. |
| Risk | `git add {artifact_dir}` could stage unintended files if operators put junk there | Documented: `{artifact_dir}` is skill-owned; operators should not put arbitrary files there |
| Risk | Auto-stage masks operator intent (e.g., they wanted to skip iterations) | Operators retain `git restore --staged {path}` to unstage |
| Dependency | None (skill internals) | Independent of in-flight 025/026/027 packets |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Q1: Should flat first-run also apply to ROOT specs? **Default**: yes (already is — no change). Both root and child first-runs land flat.
- Q2: When prior flat artifact exists for the SAME target, should we reuse it (continuation) or migrate to pt-01 + allocate pt-02 (fresh session)? **Default**: reuse on same target. Operators who want a fresh session run the explicit archive step (which the YAML already supports).
<!-- /ANCHOR:questions -->

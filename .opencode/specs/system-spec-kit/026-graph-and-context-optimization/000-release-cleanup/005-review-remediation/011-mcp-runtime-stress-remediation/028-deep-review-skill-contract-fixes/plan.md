---
title: "Implementation Plan: Deep-Review/Research Skill Contract Fixes"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Two skill-contract fixes: resolveArtifactRoot returns flat-first for child phases; synthesis stages all artifacts via git add."
trigger_phrases:
  - "028-deep-review-skill-contract-fixes plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/028-deep-review-skill-contract-fixes"
    last_updated_at: "2026-04-29T09:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 1 plan"
    next_safe_action: "Validate; author implementation-summary"
    blockers: []
    completion_pct: 70
---

# Implementation Plan: Deep-Review/Research Skill Contract Fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CJS), YAML, Markdown |
| **Framework** | sk-deep-review + sk-deep-research skill workflows |
| **Storage** | Filesystem artifacts under `{spec_folder}/{review,research}/` |
| **Testing** | vitest (`scripts/tests/review-research-paths.vitest.ts`) |

### Overview
Two skill-contract fixes. (1) `resolveArtifactRoot` in `review-research-paths.cjs` switches from "always pt-NN for child phases" to "flat-first; pt-NN only when prior content for a non-matching target exists." (2) Synthesis phase in all four deep-review/research YAMLs (auto + confirm × review + research) gains a `git add {artifact_dir}` step so operators don't accidentally drop the iteration audit trail when committing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Bug 1 source confirmed (commit `6a8095907` shipped only review-report.md)
- [x] Bug 2 source confirmed (`resolveArtifactRoot` always wraps child phases)
- [x] Both fixes scoped (single resolver function + single YAML step + doc mirroring)

### Definition of Done
- [x] Resolver returns flat for empty rootDir; reuses existing packet for matching target; allocates pt-NN only on conflict
- [x] All four YAMLs include `git add {state_paths.artifact_dir}` at synthesis end
- [x] Doc references reflect new convention
- [x] Resolver tests green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Configuration / convention change. No new abstractions, no new modules. Single function rewrite + four YAML edits + four doc edits.

### Key Components
- **`shared/review-research-paths.cjs#resolveArtifactRoot`**: rewritten to detect empty rootDir + matching flat artifact + matching pt-NN packet before falling through to allocation.
- **`spec_kit_deep-{review,research}_{auto,confirm}.yaml`**: new `step_stage_artifact_dir` after `step_update_config_status` in synthesis phase.
- **Skill docs**: prose updated in SKILL.md, state_format.md, folder_structure.md.

### Data Flow
Before: `resolveArtifactRoot(child_phase) → always pt-01 on first run`. After: `resolveArtifactRoot(child_phase) → flat on first run, pt-NN on conflict.`

Before: `synthesis end → operator does git add review-report.md → iteration trail lost`. After: `synthesis end → skill stages full {artifact_dir} → operator commits everything by default; can `git restore --staged` to unstage.`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Locate resolver + YAML synthesis steps + doc references
- [x] Confirm no race with in-flight 025/026/027 (no file overlap)

### Phase 2: Core Implementation
- [x] Rewrite `resolveArtifactRoot` for flat-first behavior
- [x] Update existing tests + add 3 new test cases (flat first run, flat reuse on match, pt-NN on flat-conflict)
- [x] Add `step_stage_artifact_dir` to all 4 YAMLs
- [x] Update SKILL.md (deep-review + deep-research)
- [x] Update state_format.md (deep-review + deep-research)
- [x] Update folder_structure.md

### Phase 3: Verification
- [x] vitest on resolver suite (7/7 passed)
- [ ] Strict validator on this packet
- [ ] Implementation summary
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `scripts/tests/review-research-paths.vitest.ts` (7 cases incl. flat-first scenarios) | vitest |
| Manual review | YAML diff for synthesis stage step in 4 files | grep/diff |
| Manual review | Doc text reflects new convention | grep/diff |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 010 vestigial gate removal | Internal evidence | Green | n/a (related context only) |
| 028 surfaces issue from 6a8095907 commit's lost trail | Internal evidence | Green | n/a |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: future deep-review/research run breaks because of changed path resolution OR because the auto-stage step interferes with operator git workflow.
- **Procedure**: `git revert` the single commit. Resolver returns to always-pt-NN; YAML synthesis steps drop the `git add`. No data migration needed (existing pt-01 folders stay valid; flat folders stay valid; both shapes are interchangeable for the operator).
<!-- /ANCHOR:rollback -->

---
title: "Implementation Summary: Deep-Review/Research Skill Contract Fixes"
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
description: "Two skill-contract fixes shipped: resolveArtifactRoot now returns flat for child-phase first runs, and synthesis phase auto-stages the artifact_dir so operators don't drop the iteration trail."
trigger_phrases:
  - "028-deep-review-skill-contract-fixes complete"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/028-deep-review-skill-contract-fixes"
    last_updated_at: "2026-04-29T09:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implemented + tested both fixes; resolver suite 7/7 green"
    next_safe_action: "Commit + push as part of today's batch"
    blockers: []
    completion_pct: 100
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-deep-review-skill-contract-fixes |
| **Completed** | 2026-04-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two contract violations in the deep-review/research skill output are fixed. Future first-run reviews on child phases land flat at `{spec_folder}/{mode}/` instead of the `{packet}-pt-01/` wrapper that operators flagged as unnecessary nesting. And future synthesis runs auto-stage the entire `{artifact_dir}` so the iteration audit trail (state.jsonl, strategy, findings-registry, deltas/, iterations/) survives the operator's `git add` and lands in commits along with the synthesized report.

### Flat-first artifact directory

Before, `resolveArtifactRoot` always wrapped child-phase artifacts in `{phaseSlug}-pt-NN/`. Now it returns flat (`subfolder: null`) when the `{mode}/` directory is empty. A `pt-NN` packet is allocated only when prior content for a non-matching target exists; continuation runs for the same target reuse the existing flat artifact or matching `pt-NN` packet. Root-spec runs continue to land flat as before.

### Synthesis-end artifact staging

The deep-review and deep-research auto + confirm YAMLs gained a `step_stage_artifact_dir` step after `step_update_config_status` in the synthesis phase. It runs `git add {state_paths.artifact_dir}` to stage the entire skill-owned packet directory. Operators retain commit authority and can `git restore --staged` to unstage anything before committing. Failure is non-fatal — works fine in temp test fixtures outside a git repo.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` | Modified | Rewrote `resolveArtifactRoot` for flat-first behavior |
| `.opencode/skill/system-spec-kit/scripts/tests/review-research-paths.vitest.ts` | Modified | Updated 2 cases + added 3 new cases for flat-first scenarios |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modified | Added `step_stage_artifact_dir` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modified | Added `step_stage_artifact_dir` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modified | Added `step_stage_artifact_dir` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modified | Added `step_stage_artifact_dir` |
| `.opencode/skill/sk-deep-review/SKILL.md` | Modified | Flat-first prose update |
| `.opencode/skill/sk-deep-research/SKILL.md` | Modified | Flat-first prose update |
| `.opencode/skill/sk-deep-review/references/state_format.md` | Modified | Flat-first prose update |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Modified | Flat-first prose update |
| `.opencode/skill/system-spec-kit/references/structure/folder_structure.md` | Modified | Flat-first prose update |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Inline implementation while three other packets (025/026/027) ran in parallel via cli-codex. No file overlap with their scopes — this packet touches skill-shared code, command YAMLs, and skill docs, all isolated from the runtime/handler/test files those packets modify. Resolver tests pass 7/7 including the three new flat-first scenarios.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Flat-first by checking empty rootDir, not by adding a "version" parameter | The user's intent is "subfolder only if prior work exists" — that's a runtime detection, not a config knob. Detecting via filesystem state keeps the contract self-evident. |
| Stage at synthesis-end via `git add {artifact_dir}` instead of per-iteration commits | Per-iteration commits would spam history. A single end-of-synthesis stage step gives the operator the choice of commit timing while ensuring nothing is dropped. |
| Same-target continuation reuses flat instead of migrating to pt-01 | Migrating would require atomic move + caller changes. Reuse is simpler and matches the user's framing ("continuation should keep using the same place"). |
| Auto-stage failure is non-fatal | Tests run in temp dirs outside git repos; CI scenarios may not have git; the stage step is helpful but not load-bearing. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run scripts/tests/review-research-paths.vitest.ts` | PASS, 7/7 (1 root flat + 1 child flat + 1 nested flat + 1 reuse flat + 1 reuse pt-NN + 1 branch on prior pt-NN + 1 branch on flat-different-target) |
| Resolver behavior on first run | flat (verified by test) |
| Resolver behavior on continuation match | reuse flat (verified by test) |
| Resolver behavior on conflict | pt-NN allocation (verified by test) |
| YAML grep for `step_stage_artifact_dir` | 4/4 files contain it |
| Doc grep for "flat-first" or equivalent prose | 5/5 files updated |
| Strict validator on this packet | PASS, exit 0 (final step) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Existing `pt-01` folders for previously-reviewed phases stay as-is. The new flat-first convention applies only to NEW reviews. Both shapes are simultaneously valid; the resolver handles either at lookup time.
- The `git add {artifact_dir}` step runs unconditionally. If an operator has staged unrelated changes inside the artifact directory, those get included. Mitigated by skill-owned ownership (operators shouldn't put unrelated files there) and by the `git restore --staged` escape hatch.
- This packet does NOT migrate any historical missing-iterations folder (e.g., `005-post-program-cleanup-pt-01/` from commit `6a8095907`). That's a separate cleanup decision — historical incomplete artifacts stay incomplete; new runs benefit from the fix.
<!-- /ANCHOR:limitations -->

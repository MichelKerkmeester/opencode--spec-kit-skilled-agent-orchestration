---
title: "Resource Map: 028 Deep-Review Skill Contract Fixes"
description: "Path ledger for resolveArtifactRoot flat-first behavior, synthesis-end git-add stage step in 4 YAMLs, and skill-doc updates across deep-review + deep-research surfaces."
trigger_phrases:
  - "028-deep-review-skill-contract-fixes resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/028-deep-review-skill-contract-fixes"
    last_updated_at: "2026-04-29T10:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored lean resource-map for today batch"
    next_safe_action: "Reference for blast-radius audit; refresh on next material change"
    blockers: []
    completion_pct: 100
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 18
- **By category**: Scripts=1, Tests=1, Commands=4, Skills=2, Documents=3, Specs=5, Meta=2
- **Missing on disk**: 0
- **Scope**: Files modified during packet `026/011/028-deep-review-skill-contract-fixes` (commit `649b46576`).
- **Generated**: 2026-04-29T10:10:00+02:00

---

## 1. Scripts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` | Updated | OK | `resolveArtifactRoot` flat-first: empty rootDir → flat; flat-config matching target → reuse flat; non-matching prior content → allocate `pt-NN` |

---

## 2. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/scripts/tests/review-research-paths.vitest.ts` | Updated | OK | 7 cases: 1 root flat + 1 child flat first-run + 1 nested flat + 1 reuse-flat-on-match + 1 reuse pt-NN + 1 branch on flat-different-target + 1 branch on prior pt-NN-different-target |

---

## 3. Commands (skill workflow YAMLs)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Updated | OK | Added `step_stage_artifact_dir` after `step_update_config_status` in synthesis phase |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Updated | OK | Same step added |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Updated | OK | Same step added |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Updated | OK | Same step added |

---

## 4. Skills (SKILL.md updates)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/sk-deep-review/SKILL.md` | Updated | OK | Flat-first prose update at "State Packet Location" section |
| `.opencode/skill/sk-deep-research/SKILL.md` | Updated | OK | Flat-first prose update at "State Packet Location" section |

---

## 5. Documents (skill references)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/sk-deep-review/references/state_format.md` | Updated | OK | Flat-first prose update |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Updated | OK | Flat-first prose update |
| `.opencode/skill/system-spec-kit/references/structure/folder_structure.md` | Updated | OK | "Naming" + "Flat-first convention (post-028)" + "Required resolver" prose updates |

---

## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `spec.md` | Created | OK | Level 1 charter |
| `plan.md` | Created | OK | Plan |
| `tasks.md` | Created | OK | Task ledger |
| `implementation-summary.md` | Created | OK | Disposition |
| `.../028/description.json` | Created | OK | Continuity index |

---

## 7. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.../028/graph-metadata.json` | Created | OK | Graph rollout metadata |
| Source bug evidence: commit `6a8095907 feat(026/000/005/005)` | Cited | OK | Operator dropped iteration trail when `git add review-report.md` did not include sibling files — motivates Fix 1 (auto-stage at synthesis end) |

---
title: "Resource Map: Reverse Parent Research/Review Folder Placement"
description: "Rollback ledger for the local-owner deep-loop artifact policy restoration, including resolver/runtime surfaces, migration tooling, tests, and dependent packet docs."
trigger_phrases:
  - "013/001 resource map"
  - "reverse parent folders resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/001-reverse-parent-research-review-folders"
    last_updated_at: "2026-04-24T16:20:00+02:00"
    last_updated_by: "codex"
    recent_action: "Expanded the rollback ledger with the residual root-packet owner-map migration pass"
    next_safe_action: "Use this ledger as the path baseline for phase 002"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/shared/review-research-paths.cjs"
      - ".opencode/skill/system-spec-kit/scripts/migrate-deep-loop-local-owner.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "reverse-parent-research-review-folders-resource-map"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The rollback resource map is historical and implementation-focused, not the phase 002 runtime emission feature."
      - "Migration scope covered repo spec roots and returned child-owned packets to owner-local folders."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v2.2 -->

---

## Summary

- **Total references**: 49
- **By category**: READMEs=2, Commands=4, Agents=8, Skills=18, Specs=14, Tests=3
- **Missing on disk**: 0
- **Scope**: Historical rollback ledger for the parent-root placement reversal plus the repo-wide migration of 135 child-owned deep-loop packets back into owner-local `research/` and `review/` folders
- **Generated**: 2026-04-24T16:20:00+02:00

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/sk-deep-research/README.md` | Updated | OK | Restored child-run examples and packet-location language to owner-local `research/` folders. |
| `.opencode/skill/sk-deep-review/README.md` | Updated | OK | Restored child-run examples and packet-location language to owner-local `review/` folders. |

## 3. Commands

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Updated | OK | Prompt and artifact paths now follow resolved `{artifact_dir}` semantics. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Updated | OK | Confirm flow now writes prompts and synthesized outputs beside the resolved local packet. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Updated | OK | Review auto loop now keeps packet writes under resolved `{artifact_dir}`. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Updated | OK | Review confirm flow now keeps prompts and packet outputs under resolved `{artifact_dir}`. |

## 4. Agents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/agent/deep-research.md` | Updated | OK | Mirror text now describes the restored owner-local research packet contract. |
| `.claude/agents/deep-research.md` | Updated | OK | Claude mirror aligned with the restored research packet contract. |
| `.gemini/agents/deep-research.md` | Updated | OK | Gemini mirror aligned with the restored research packet contract. |
| `.codex/agents/deep-research.toml` | Updated | OK | Codex mirror aligned with the restored research packet contract. |
| `.opencode/agent/deep-review.md` | Updated | OK | Mirror text now describes the restored owner-local review packet contract. |
| `.claude/agents/deep-review.md` | Updated | OK | Claude mirror aligned with the restored review packet contract. |
| `.gemini/agents/deep-review.md` | Updated | OK | Gemini mirror aligned with the restored review packet contract. |
| `.codex/agents/deep-review.toml` | Updated | OK | Codex mirror aligned with the restored review packet contract. |

## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs` | Updated | OK | Single source of truth now distinguishes root-local runs from child/sub-phase owner-local packet folders. |
| `.opencode/skill/system-spec-kit/scripts/migrate-deep-loop-local-owner.cjs` | Created | OK | Repo-wide migration utility that relocates misplaced child packets and rewrites live canonical references. |
| `.opencode/skill/system-spec-kit/scripts/migrate-deep-loop-legacy-owner-map.cjs` | Created | OK | Explicit owner-map cleanup for the residual root packet directories that metadata heuristics did not classify correctly. |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Updated | OK | Reducer now writes only to resolver-provided `researchDir`. |
| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Updated | OK | Reducer now writes only to resolver-provided `reviewDir`. |
| `.opencode/skill/sk-deep-research/SKILL.md` | Updated | OK | Core skill doc now explains root-local vs owner-local research packet placement. |
| `.opencode/skill/sk-deep-review/SKILL.md` | Updated | OK | Core skill doc now explains root-local vs owner-local review packet placement. |
| `.opencode/skill/sk-deep-research/references/quick_reference.md` | Updated | OK | Quick reference examples now match the restored local-owner contract. |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Updated | OK | Quick reference examples now match the restored local-owner contract. |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Updated | OK | State-format examples now resolve child artifacts under the owner spec. |
| `.opencode/skill/sk-deep-review/references/state_format.md` | Updated | OK | State-format examples now resolve child artifacts under the owner spec. |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Updated | OK | Loop protocol examples now describe local owner packet roots. |
| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Updated | OK | Loop protocol examples now describe local owner packet roots. |
| `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` | Updated | OK | Output path patterns now resolve through `{artifact_dir}` instead of parent/root `review/`. |
| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Updated | OK | Review asset examples now reflect owner-local packet roots. |
| `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md` | Updated | OK | Dashboard text now reflects owner-local packet roots. |
| `.opencode/skill/sk-deep-research/assets/deep_research_dashboard.md` | Updated | OK | Dashboard text now reflects owner-local packet roots. |
| `.opencode/skill/system-spec-kit/references/structure/folder_structure.md` | Updated | OK | Folder-structure reference now documents the restored root-local vs child-local policy. |

## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` | Updated | OK | Migration scope root; the first pass moved 86 child-owned packets, the manual owner-map pass moved 49 more, and the root `research/` and `review/` packet directories are now empty. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/006-integrity-parity-closure/applied/CF-014.md` | Cited | OK | Primary closure evidence for the parent-root placement policy being reversed. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/001-reverse-parent-research-review-folders/spec.md` | Created | OK | Rollback contract, scope, requirements, and acceptance scenarios. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/001-reverse-parent-research-review-folders/plan.md` | Created | OK | Implementation and migration plan for the rollback packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/001-reverse-parent-research-review-folders/tasks.md` | Created | OK | Ordered task list for rollback, migration, and closure. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/001-reverse-parent-research-review-folders/checklist.md` | Created | OK | Evidence-backed verification checklist for rollback and migration closure. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/001-reverse-parent-research-review-folders/resource-map.md` | Created | OK | Historical rollback ledger for implementation surfaces and evidence. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/001-reverse-parent-research-review-folders/implementation-summary.md` | Created | OK | Outcome summary with migration totals, verification, and remaining limitations. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/001-reverse-parent-research-review-folders/description.json` | Created | OK | Packet metadata refreshed during canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/001-reverse-parent-research-review-folders/graph-metadata.json` | Created | OK | Graph visibility metadata refreshed during canonical save. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration/spec.md` | Updated | OK | Rebased onto phase 001 and the restored owner-local artifact contract. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration/plan.md` | Updated | OK | Follow-on plan now assumes `resource-map.md` emits beside the resolved local packet. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration/tasks.md` | Updated | OK | Dependency chain now names phase 001 as the prerequisite rollback. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration/checklist.md` | Updated | OK | Verification language now matches the restored owner-local packet contract. |

## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skill/system-spec-kit/scripts/tests/review-research-paths.vitest.ts` | Created | OK | Adds resolver coverage for root, child, nested, and rerun reuse behavior. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-research-contract-parity.vitest.ts` | Updated | OK | Research parity assertions now expect local-owner child packet wording. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` | Updated | OK | Review parity assertions now expect local-owner child packet wording and `{artifact_dir}` output paths. |

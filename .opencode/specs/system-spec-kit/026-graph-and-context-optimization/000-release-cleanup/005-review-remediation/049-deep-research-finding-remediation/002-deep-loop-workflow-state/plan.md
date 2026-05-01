---
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
title: "Implementation Plan: 002 Deep-Loop Workflow State-Machine Remediation [template:level_2/plan.md]"
description: "Five surgical fixes across two YAML workflow assets and one TS module to close findings F-010-B5-01..04 and F-019-D4-01 from packet 046 and 019."
trigger_phrases:
  - "F-010-B5 plan"
  - "F-019-D4 plan"
  - "002 deep-loop workflow state plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/002-deep-loop-workflow-state"
    last_updated_at: "2026-04-30T00:00:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Plan authored after spec"
    next_safe_action: "Apply five fixes then validate, stress, commit, push"
    blockers: []
    key_files:
      - ".opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml"
      - ".opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml"
      - ".opencode/skill/system-spec-kit/scripts/memory/generate-context.ts"
      - ".opencode/skill/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-002-deep-loop-state"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 002 Deep-Loop Workflow State-Machine Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Five surgical fixes across two deep-loop workflow YAML assets and one TS module close findings F-010-B5-01..04 (deep-loop workflow state) and F-019-D4-01 (graph metadata staleness). Each fix is the minimal change that resolves the cited contradiction or omission. The YAML changes thread the parsed `--no-resource-map` flag through config creation, fix the canonical iteration-record schema in fallback records, and add lock-cleanup language for halt/cancel paths. The TS change refreshes parent `children_ids` and `last_save_at` during child saves.

### Technical Context

The two YAML workflow assets are runtime-driven. The deep-research and deep-review commands parse flags from `$ARGUMENTS` and pass them into the YAML's templating slots. The contradictions flagged in B5-04 stem from hardcoded values bypassing parsed flags. The fallback iteration records (B5-02, B5-03) run inside the `phase_loop` step `step_evaluate_results.on_missing_outputs` branch — a rare path that fires only when an iteration produces no expected outputs. The lock leak (B5-01) is in `phase_init.step_acquire_lock`. The graph metadata bug (D4-01) is in `generate-context.ts` post-save bookkeeping.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Threshold |
|------|-----------|
| validate.sh --strict | exit 0 (or warnings-only — same pattern as sub-phase 010) |
| npm run stress | 56+ files / 163+ tests / exit 0 |
| Phase-parent-pointer vitest | adds one new test that passes (children_ids refresh) |
| Git diff scope | three product files + one test file + this packet's spec docs only |
| Inline traceability markers | one marker per finding (`<!-- F-NNN-BN-NN -->` for YAML, `// F-NNN-BN-NN` for TS) |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Workflow YAML changes
The YAML files declare ordered workflow steps with templated values populated by the markdown command parsers. Fixes stay inside the existing step structure: lock cleanup is added as a contract directive on the existing `step_acquire_lock`, fallback records gain missing canonical fields inside the existing `append_jsonl` line, and `--no-resource-map` plumbing replaces hardcoded `resource_map.emit: true` with the templated value `{resource_map_emit}` populated from the markdown parse step.

### Generate-context.ts change
`updatePhaseParentPointer` keeps its current shape (read graph-metadata, mutate `derived`, atomic write) and gains a new responsibility: when the call originated from a child save (the bubbling case in `updatePhaseParentPointersAfterSave`), the parent's `children_ids` is refreshed to include the child's packet id (idempotent) and `derived.last_save_at` is bumped to the same timestamp.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| # | Phase | Action | File | Finding | Status |
|---|-------|--------|------|---------|--------|
| 1 | Edit | Add halt/cancel lock cleanup directive | spec_kit_deep-research_auto.yaml | F-010-B5-01 | Pending |
| 2 | Edit | Canonical fallback iteration record | spec_kit_deep-research_auto.yaml | F-010-B5-02 | Pending |
| 3 | Edit | Canonical fallback iteration record | spec_kit_deep-review_auto.yaml | F-010-B5-03 | Pending |
| 4 | Edit | Thread `--no-resource-map` flag through config | both YAMLs | F-010-B5-04 | Pending |
| 5 | Edit | Refresh parent children_ids + last_save_at on child save | generate-context.ts | F-019-D4-01 | Pending |
| 6 | Test | Extend phase-parent-pointer vitest with children_ids assertion | phase-parent-pointer.vitest.ts | F-019-D4-01 | Pending |
| 7 | Build | `tsc` build to refresh `scripts/dist/` if needed | scripts/ | — | Pending |
| 8 | Validate | `validate.sh --strict` | this packet | — | Pending |
| 9 | Stress | `npm run stress` | repo | — | Pending |
| 10 | Ship | commit + push to origin main | repo | — | Pending |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `updatePhaseParentPointersAfterSave` children_ids refresh | vitest |
| Manual review | YAML changes — flag resolution, schema agreement with state_format.md | re-read after edit |
| Stress regression | Full repo stress harness (56+ files / 163+ tests) | `npm run stress` |
| Strict validate | This packet's spec docs | `validate.sh --strict` |

YAML changes have no direct unit-test surface (the workflow assets are interpreted by the runtime, not by Node). Verification is structural: re-read each cited line range after the edit and confirm the schema matches `state_format.md` §Iteration Records and the `--no-resource-map` flag from `deep-research.md:73` flows correctly through config creation.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §B5 and `019-*/research/research.md` §D4
- Canonical iteration schema: `.opencode/skill/sk-deep-research/references/state_format.md`
- Validate script: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Test harness: `.opencode/skill/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts` (existing, extended)
- No other packet dependencies. Sub-phase 002 is independent within Wave 1.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If a downstream consumer (reducer, dashboard generator, MCP graph) breaks because of these edits:
1. `git revert <commit-sha>` reverts all five edits atomically
2. Re-run `npm run stress` to confirm baseline restored
3. Reauthor the failing edit with smaller scope

Each fix carries an inline finding marker, so locating the exact change for a partial revert (cherry-pick a subset of hunks) is straightforward.
<!-- /ANCHOR:rollback -->

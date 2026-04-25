---
title: "...aph-and-context-optimization/011-resource-map-template/003-resource-map-deep-loop-integration/implementation-summary]"
description: "Adds convergence-time resource-map emission for deep review and deep research, backed by a shared extractor, workflow wiring, and focused docs/test coverage."
trigger_phrases:
  - "resource map deep loop implementation summary"
  - "003 resource map implementation summary"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-resource-map-template/003-resource-map-deep-loop-integration"
    last_updated_at: "2026-04-24T17:00:00+02:00"
    last_updated_by: "codex"
    recent_action: "Closed F001/F002/F003/F004 from 7-iter deep-review; F001 file:line normalization in extract-from-evidence.cjs + F003 regression vitest + F004 {artifact_dir} doc alignment in deep-review.md/deep-research.md + F002 T035 deferred with reconciled status across tasks.md/checklist.md/implementation-summary.md"
    next_safe_action: "T035 validator still deferred on pre-existing out-of-scope packet-doc drift; optional follow-up: packet-doc integrity cleanup pass"
    blockers: []
    completion_pct: 100
    status: "conditional"
    open_questions: []
    answered_questions:
      - "The shared extractor lives under .opencode/skill/system-spec-kit/scripts/resource-map/ and supports both review and research evidence shapes."
      - "Synthesis owns convergence-time emission; reducers only write the resource map artifact when explicitly invoked with --emit-resource-map."
      - "Review severity counts and research citation counts stay in the template Note column to preserve the phase-002 four-column shape."
      - "The exact T030 vitest command is blocked by an existing include/root mismatch in mcp_server/vitest.config.ts; the assertions themselves pass with an explicit root override."
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

## Metadata
<!-- ANCHOR:metadata -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-resource-map-deep-loop-integration |
| **Completed** | 2026-04-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

## What Was Built
<!-- ANCHOR:what-built -->

The deep-review and deep-research loops now emit a convergence-time resource map artifact from the evidence they already capture. You get a flat, template-shaped ledger beside the narrative synthesis output, so reviewers can scan blast radius and coverage without replaying iterations by hand.

### Shared Extractor

The new shared extractor takes `review` or `research` evidence, classifies paths into the phase-002 ten-category skeleton, and renders a ready-to-write resource map artifact. Review maps summarize final per-file `P0/P1/P2` counts. Research maps summarize deduplicated per-iteration citation counts.

### Workflow Wiring

The reducers now support an explicit `--emit-resource-map` path, and all four deep-loop YAML workflows call that path during synthesis. That keeps normal per-iteration reducer refreshes unchanged while letting convergence own the final resource-map write. The reducers also honor `config.resource_map.emit === false`, which gives both loops a clean opt-out path for `--no-resource-map`.

### Documentation Surfaces

The skill docs, command entrypoints, convergence references, feature-catalog entries, and manual-testing playbooks all describe the new output surface and opt-out behavior. The packet now has a clear operator contract for where the file appears, what it summarizes, and how to suppress it for one run.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` | Created | Shared extractor and renderer for review and research resource maps. |
| `.opencode/skill/system-spec-kit/scripts/resource-map/README.md` | Created | Documents the extractor input/output contract and fallback behavior. |
| `.opencode/skill/system-spec-kit/mcp_server/scripts/tests/resource-map-extractor.vitest.ts` | Created | Focused Vitest coverage for both evidence shapes. |
| `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs` | Modified | Adds `--emit-resource-map` handling and clean opt-out behavior. |
| `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` | Modified | Adds `--emit-resource-map` handling and clean opt-out behavior. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modified | Adds resource-map config/output state and synthesis emission step. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Modified | Adds resource-map config/output state and synthesis emission step. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modified | Adds resource-map config/output state and synthesis emission step. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Modified | Adds resource-map config/output state and synthesis emission step. |
| `.opencode/skill/sk-deep-review/SKILL.md` | Modified | Documents review-side emitted output and opt-out behavior. |
| `.opencode/skill/sk-deep-research/SKILL.md` | Modified | Documents research-side emitted output and opt-out behavior. |
| `.opencode/command/spec_kit/deep-review.md` | Modified | Mentions emitted artifact and `--no-resource-map`. |
| `.opencode/command/spec_kit/deep-research.md` | Modified | Mentions emitted artifact and `--no-resource-map`. |
| `.opencode/skill/sk-deep-review/references/convergence.md` | Modified | Notes synthesis-time emission for converged review loops. |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Modified | Notes synthesis-time emission for converged research loops. |
| `.opencode/skill/sk-deep-review/feature_catalog/01--loop-lifecycle/06-resource-map-emission.md` | Created | Adds the review-side catalog entry for this feature. |
| `.opencode/skill/sk-deep-research/feature_catalog/01--loop-lifecycle/06-resource-map-emission.md` | Created | Adds the research-side catalog entry for this feature. |
| `.opencode/skill/sk-deep-review/manual_testing_playbook/06--synthesis-save-and-guardrails/029-resource-map-emission.md` | Created | Adds the review-side manual validation scenario. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/027-resource-map-emission.md` | Created | Adds the research-side manual validation scenario. |
<!-- /ANCHOR:what-built -->

---

## How It Was Delivered
<!-- ANCHOR:how-delivered -->

The rollout stayed incremental. The shared extractor landed first, then the reducer opt-in path, then the YAML synthesis wiring, then the documentation surfaces. Verification covered TypeScript, focused Vitest assertions, direct dry runs for both evidence shapes, and an explicit opt-out exercise. The only remaining harness issue is that the packet’s exact T030 command currently does not discover the new test file because the existing Vitest config roots `scripts/tests/**` at the skill root rather than `mcp_server/scripts/tests/**`.
<!-- /ANCHOR:how-delivered -->

---

## Key Decisions
<!-- ANCHOR:decisions -->

| Decision | Why |
|----------|-----|
| Keep the extractor under `.opencode/skill/system-spec-kit/scripts/resource-map/` | The packet explicitly scopes the shared logic there, and both deep-loop skills can consume it without introducing another shared package boundary. |
| Make reducers emit only when `--emit-resource-map` is passed | The reducers already run every iteration. Keeping emission behind an explicit flag preserves the current steady-state reducer behavior and lets synthesis own convergence-time writes. |
| Store counts in the `Note` column instead of introducing new table columns | The phase-002 template is a four-column contract. Keeping the counts in `Note` preserves the shared template shape while still exposing the per-file review and research signals the packet requires. |
| Treat the exact T030 command as a harness mismatch, not an extractor failure | The test assertions pass when Vitest is rooted where `scripts/tests/**` actually matches. The failing command is blocked by the checked-in include/root config rather than the new feature code. |
<!-- /ANCHOR:decisions -->

---

## Verification
<!-- ANCHOR:verification -->

| Check | Result |
|-------|--------|
| `T030: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run scripts/tests/resource-map-extractor.vitest.ts` | FAIL (exit 1). Vitest reported `No test files found` because the current config includes `scripts/tests/**` at the skill root, not `mcp_server/scripts/tests/**`. |
| `T030 follow-up: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run --config vitest.config.ts --root . scripts/tests/resource-map-extractor.vitest.ts` | PASS (exit 0). The new assertions passed once Vitest rooted `scripts/tests/**` inside `mcp_server/`. |
| `T031: cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck` | PASS (exit 0). No stderr. |
| `T032: review-shape dry run` | PASS (exit 0). Output contained `## 1. READMEs`, `## 5. Skills`, and review notes like `Findings P0=0 P1=1 P2=0`. |
| `T033: research-shape dry run` | PASS (exit 0). Output contained `## 3. Commands`, `## 5. Skills`, and citation notes like `Citations=3; Iterations=3`. |
| `T034: opt-out path` | PASS (exit 0). Reducer returned `resourceMapSkipped: true`, `resourceMapSkipReason: "config.resource_map.emit=false"`, and no file was written. |
| `T035: bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict` | FAIL (exit 2). Validator still reports packet-doc integrity issues in `spec.md`, `plan.md`, and the packet's existing backticked task-text references, plus a strict-level section-count warning and a pre-existing uncited line in `research/research.md`. |
| `T036: grep -rn "resource-map" ...` | PASS (exit 0). All ten required surfaces contain `resource-map` coverage; `grep -rl ... | wc -l` returned `10`. |
| `Additional: zero/max edge cases` | PASS (exit 0). Dry run returned `zeroTotal=0`, `zeroHasCategoryHeadings=false`, and `maxCitationNote=true`. |
| `Additional: malformed-row degradation` | PASS (exit 0). Dry run returned `degraded=true` and `degradedRows=true`. |
<!-- /ANCHOR:verification -->

---

## Known Limitations
<!-- ANCHOR:limitations -->

1. **Exact T030 command is blocked by existing Vitest config drift.** `mcp_server/vitest.config.ts` roots `scripts/tests/**` at the skill root, so `mcp_server/scripts/tests/...` is not discovered by the packet’s exact command. The underlying test file still passes with an explicit `--root .` override.
2. **Exact T035 strict validation is blocked by packet-doc drift outside or adjacent to the allowed edit surface.** `spec.md` and `plan.md` still contain strict-integrity reference patterns the validator rejects, `tasks.md` still carries legacy backticked markdown-path text that I left intact while limiting edits to checkbox state, and `research/research.md` carries a pre-existing uncited line warning.
<!-- /ANCHOR:limitations -->

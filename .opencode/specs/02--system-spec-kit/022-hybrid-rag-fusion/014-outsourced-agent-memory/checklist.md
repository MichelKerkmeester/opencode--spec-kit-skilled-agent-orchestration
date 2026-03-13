---
title: "Verification Checklist: Outsourced Agent Memory Capture"
description: "Verification checklist for the outsourced agent memory capture protocol"
trigger_phrases: ["outsourced agent checklist", "memory handback checklist"]
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: Outsourced Agent Memory Capture
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md` - explicit hard-fail, next-step persistence, CLI doc alignment, and evidence reconciliation captured [Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-outsourced-agent-memory/spec.md`]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` - runtime, CLI-doc, and reconciliation phases documented [Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-outsourced-agent-memory/plan.md`]
- [x] CHK-003 [P1] Dependencies identified and available - runtime files, 8 CLI docs, `scratch/`, and existing `memory/` contents verified in repo [Evidence: runtime sources plus spec folder directories read during reconciliation]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## P0 - Runtime Behavior

- [x] CHK-010 [P0] Explicit missing-file failures hard-fail with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...` - verified in `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` [Evidence: `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`]
- [x] CHK-011 [P0] Explicit invalid JSON and invalid-shape payloads do not fall back to OpenCode capture - verified in `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` and `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts` [Evidence: `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`, `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`]
- [x] CHK-012 [P0] `nextSteps` and `next_steps` are both accepted - verified in `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` [Evidence: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`]
- [x] CHK-013 [P1] First next step persists as `Next: ...`, remaining steps persist as `Follow-up: ...`, `NEXT_ACTION` reads the first step, and mixed structured payloads preserve missing next-step facts without duplicate `Next:` / `Follow-up:` observations - verified in `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`, `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`, and `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts` [Evidence: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`, `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`, `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## P1 - Verification Evidence

- [x] CHK-020 [P0] All 4 `cli-*` SKILL files include Memory Handback guidance with redact-and-scrub and explicit failure wording - verified by repo search [Evidence: `Memory Handback|redact|scrub|EXPLICIT_DATA_FILE_LOAD_FAILED` in `.opencode/skill/cli-*/SKILL.md`]
- [x] CHK-021 [P0] All 4 `cli-*` prompt templates include memory epilogue updates with redact-and-scrub and explicit failure wording - verified by repo search [Evidence: `MEMORY EPILOGUE|redact|scrub|nextSteps|next_steps|EXPLICIT_DATA_FILE_LOAD_FAILED` in `.opencode/skill/cli-*/assets/prompt_templates.md`]
- [x] CHK-022 [P1] Non-reproducible historical numeric Vitest pass-total claims are removed from scoped spec evidence [Evidence: scoped artifacts now use deferred/unverified wording instead of historical numeric totals]
- [x] CHK-023 [P1] Alignment drift passes for the scripts root - `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts` returned `0 findings` and `0 warnings` [Evidence: current rerun output in this task]
- [x] CHK-024 [P1] TypeScript verification is presented as current acceptance proof only with a reproducible rerun artifact - `npm run lint` in `.opencode/skill/system-spec-kit/scripts` passed (`tsc --noEmit`) [Evidence: current rerun output in this task]
- [x] CHK-025 [P2] Live outsourced CLI dispatch remains deferred - no current spec doc claims it passed without fresh proof
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security and Protocol Wording

- [x] CHK-030 [P0] Redact-and-scrub guidance is reflected in the CLI handback docs - verified by repo search across all 8 relevant docs [Evidence: `redact|scrub` across `.opencode/skill/cli-*/*.md`]
- [x] CHK-031 [P1] Accepted next-step field names are documented as `nextSteps` or `next_steps` - verified by repo search across all 8 relevant docs [Evidence: `nextSteps|next_steps` across `.opencode/skill/cli-*/*.md`]
- [x] CHK-032 [P1] Path wording uses `.opencode/skill/cli-*` rather than `.opencode/skill/sk-cli/` in the reconciled spec docs [Evidence: reconciled spec artifacts]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` now agree on runtime behavior and deferred verification [Evidence: all 5 spec artifacts reread after edit]
- [x] CHK-041 [P1] Unverifiable 1032-line artifact claims removed from the spec folder [Evidence: no remaining `1032-line` / `1032 lines` matches in reconciled artifacts]
- [x] CHK-042 [P1] Any retained memory reference points only to the existing 620-line artifact and does not use it as current acceptance proof [Evidence: existing memory artifact line count plus reconciled docs]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files remain in `scratch/` only - `scratch/` contains `.gitkeep` [Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-outsourced-agent-memory/scratch`]
- [x] CHK-051 [P1] `memory/` was not manually edited during reconciliation - only existing files were read [Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-outsourced-agent-memory/memory`]
- [x] CHK-052 [P2] Existing memory evidence preserved - `memory/11-03-26_15-37__analyzed-loadcollecteddata-in-data-loader-ts.md` exists and is 620 lines
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 12 | 12/12 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-03-13
<!-- /ANCHOR:summary -->

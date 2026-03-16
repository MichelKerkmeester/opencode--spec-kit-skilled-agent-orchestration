---
title: "Verification Checklist: Outsourced Agent Handback Protocol"
description: "Verification checklist for the outsourced agent handback protocol"
trigger_phrases: ["outsourced agent checklist", "memory handback checklist"]
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: Outsourced Agent Handback Protocol
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

- [x] CHK-001 [P0] Requirements documented in `spec.md` - explicit hard-fail, next-step persistence, post-010 gate awareness, and evidence reconciliation captured [Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/015-outsourced-agent-handback/spec.md`]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` - runtime, CLI-doc, catalog/test, and reconciliation phases documented [Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/015-outsourced-agent-handback/plan.md`]
- [x] CHK-003 [P1] Dependencies identified and available - runtime files, 8 CLI docs, the feature catalog, `scratch/`, and the phase `memory/` directory verified in repo [Evidence: runtime sources plus spec folder directories read during reconciliation]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## P0 - Runtime Behavior

- [x] CHK-010 [P0] Explicit missing-file failures hard-fail with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...` [Evidence: `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`]
- [x] CHK-011 [P0] Explicit invalid JSON and invalid-shape payloads do not fall back to OpenCode capture [Evidence: `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`, `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`]
- [x] CHK-012 [P0] `nextSteps` and `next_steps` are both accepted [Evidence: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`]
- [x] CHK-013 [P1] First next step persists as `Next: ...`, remaining steps persist as `Follow-up: ...`, `NEXT_ACTION` reads the first step, and mixed structured payloads preserve missing next-step facts without duplicate `Next:` / `Follow-up:` observations [Evidence: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`, `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`, `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## P1 - Verification Evidence

- [x] CHK-020 [P0] All 4 `cli-*` SKILL files include handback guidance with redact-and-scrub, rejection-code, and minimum-payload wording [Evidence: `.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts` plus repo reads of `.opencode/skill/cli-*/SKILL.md`]
- [x] CHK-021 [P0] All 4 `cli-*` prompt templates include richer `FILES` examples, accepted snake_case field names, and explicit failure wording [Evidence: `.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts` plus repo reads of `.opencode/skill/cli-*/assets/prompt_templates.md`]
- [x] CHK-022 [P0] Feature-catalog entry reflects phase `015` rather than stale `013` wording [Evidence: `.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts`, `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md`]
- [x] CHK-023 [P1] Targeted runtime-plus-doc verification passes - `npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/runtime-memory-inputs.vitest.ts tests/outsourced-agent-handback-docs.vitest.ts` returned `2` files and `28` tests [Evidence: current rerun output in this task]
- [x] CHK-024 [P1] Alignment drift passes for the scripts root - `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts` returned `244` scanned files, `0` findings`, and `0` warnings [Evidence: current rerun output in this task]
- [x] CHK-025 [P1] TypeScript verification is presented as current acceptance proof only with a reproducible rerun artifact - `npm run lint` in `.opencode/skill/system-spec-kit/scripts` passed (`tsc --noEmit`) [Evidence: current rerun output in this task]
- [x] CHK-026 [P2] Fresh rich JSON-mode handback write succeeded — `generate-context.js` wrote `memory/16-03-26_22-23__updated-the-outsourced-agent-handback-docs-so.md` (557 lines) for this phase folder [Evidence: current rerun output in this task]
- [x] CHK-027 [P2] Fresh thin JSON-mode handback payload rejected with `INSUFFICIENT_CONTEXT_ABORT` before file write [Evidence: current rerun output in this task]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security and Protocol Wording

- [x] CHK-030 [P0] Redact-and-scrub guidance is reflected in the CLI handback docs [Evidence: `outsourced-agent-handback-docs.vitest.ts`]
- [x] CHK-031 [P1] Accepted next-step field names are documented as `nextSteps` or `next_steps` [Evidence: `outsourced-agent-handback-docs.vitest.ts`]
- [x] CHK-032 [P1] Path wording uses `.opencode/skill/cli-*` rather than `.opencode/skill/sk-cli/` in the reconciled spec docs [Evidence: reconciled spec artifacts]
- [x] CHK-033 [P1] Rejection-code wording covers both `INSUFFICIENT_CONTEXT_ABORT` and `CONTAMINATION_GATE_ABORT` across the caller-facing docs [Evidence: `outsourced-agent-handback-docs.vitest.ts`]
- [x] CHK-034 [P1] Payload-richness wording recommends `DESCRIPTION`, `ACTION`, `MODIFICATION_MAGNITUDE`, and `_provenance` for `FILES` entries [Evidence: `outsourced-agent-handback-docs.vitest.ts`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` now agree on runtime behavior, quality-gate nuance, and verification status [Evidence: all 5 spec artifacts reread after edit]
- [x] CHK-041 [P1] Stale `013-outsourced-agent-memory` references were removed from acceptance evidence in this phase folder [Evidence: reconciled spec artifacts]
- [x] CHK-042 [P1] Fresh 2026-03-16 verification replaced inherited historical round-trip wording in the phase docs [Evidence: reconciled verification sections]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files remain in `scratch/` only - `scratch/` contains `.gitkeep` [Evidence: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/015-outsourced-agent-handback/scratch`]
- [x] CHK-051 [P1] `memory/` was changed only via `generate-context.js` during verification, not by manual edits [Evidence: rich JSON-mode verification commands in this task]
- [x] CHK-052 [P2] Fresh phase-local memory evidence preserved - `memory/16-03-26_22-23__updated-the-outsourced-agent-handback-docs-so.md` exists and is 557 lines
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 13 | 13/13 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-03-16
<!-- /ANCHOR:summary -->

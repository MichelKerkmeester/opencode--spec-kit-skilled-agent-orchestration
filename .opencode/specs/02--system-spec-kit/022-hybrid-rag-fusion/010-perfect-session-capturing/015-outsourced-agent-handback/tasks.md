---
title: "Tasks: Outsourced Agent Handback Protocol"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases: ["outsourced agent tasks", "memory handback tasks"]
importance_tier: "normal"
contextType: "general"
---
# Tasks: Outsourced Agent Handback Protocol
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Runtime Safeguards

- [x] T001 Hard-fail missing explicit data files with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...` (`.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`)
- [x] T002 Hard-fail invalid JSON and invalid-shape explicit payloads without falling back to OpenCode capture (`.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`)
- [x] T003 Accept `nextSteps` and `next_steps`, then persist the first entry as `Next: ...` and later entries as `Follow-up: ...`, including mixed structured payload preservation when next-step facts are missing (`.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`)
- [x] T004 Drive `NEXT_ACTION` from the first persisted `Next: ...` fact (`.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`)
- [x] T005 Add regression coverage for explicit JSON-mode failures and next-step persistence, including mixed structured payload behavior (`.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: CLI Handback Documentation

- [x] T006 [P] Update all 4 `cli-*` SKILL files with redact-and-scrub, rejection-code, and minimum-payload guidance
- [x] T007 [P] Update all 4 `cli-*` prompt template files with accepted snake_case fields, richer `FILES` examples, and explicit JSON-mode hard-fail behavior
- [x] T008 Align feature-catalog entry `17-outsourced-agent-memory-capture.md` to phase `015` and the post-010 gate contract
- [x] T009 Add doc-regression coverage for the 8 handback docs and the feature catalog (`.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification and Reconciliation

- [x] T010 Record current targeted Vitest evidence: `npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/runtime-memory-inputs.vitest.ts tests/outsourced-agent-handback-docs.vitest.ts` passed with `2` files and `28` tests
- [x] T011 Record current alignment-drift evidence: `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts` passed with `244` scanned files, `0` findings, and `0` warnings
- [x] T012 Record current TypeScript check evidence: `npm run lint` in `.opencode/skill/system-spec-kit/scripts` passed (`tsc --noEmit`)
- [x] T013 Fresh rich JSON-mode handback verification: wrote `memory/16-03-26_22-23__updated-the-outsourced-agent-handback-docs-so.md` (557 lines) via `generate-context.js`
- [x] T014 Fresh thin JSON-mode handback verification: `generate-context.js` rejected the payload with `INSUFFICIENT_CONTEXT_ABORT` before file write
- [x] T015 Update `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` so they agree on runtime behavior, quality-gate nuance, and verification status
- [x] T016 Run `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` on this spec folder and record the exit code
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Runtime hard-fail behavior matches the implemented loader and regression test coverage
- [x] Next-step persistence wording matches the implemented normalizer and session extractor, including mixed structured payload behavior
- [x] All `cli-*` references use the real path layout and include redact-and-scrub, rejection-code, and minimum-payload guidance
- [x] The feature catalog and doc-regression test keep the caller-facing handback contract aligned
- [x] Fresh verification records one successful rich JSON-mode write and one thin-payload insufficiency rejection
- [x] `validate.sh` run recorded for this spec folder
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Runtime loader**: `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts`
- **Normalization**: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`
- **Next-action extraction**: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`
- **Regression coverage**: `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`, `.opencode/skill/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts`
- **CLI docs**: `.opencode/skill/cli-codex/`, `.opencode/skill/cli-copilot/`, `.opencode/skill/cli-gemini/`, `.opencode/skill/cli-claude-code/`
<!-- /ANCHOR:cross-refs -->

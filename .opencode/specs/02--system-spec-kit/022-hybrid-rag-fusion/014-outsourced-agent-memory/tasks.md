---
title: "Tasks: Outsourced Agent Memory Capture"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases: ["outsourced agent tasks", "memory handback tasks"]
importance_tier: "normal"
contextType: "general"
---
# Tasks: Outsourced Agent Memory Capture
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
- [x] T003 Accept `nextSteps` and `next_steps`, then persist the first entry as `Next: ...` and later entries as `Follow-up: ...` (`.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts`)
- [x] T004 Drive `NEXT_ACTION` from the first persisted `Next: ...` fact (`.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts`)
- [x] T005 Add regression coverage for explicit JSON-mode failures and next-step persistence (`.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: CLI Handback Documentation

- [x] T006 [P] Update all 4 `cli-*` SKILL files with redact-and-scrub guidance before writing `/tmp/save-context-data.json`
- [x] T007 [P] Update all 4 `cli-*` prompt template files with accepted `nextSteps` / `next_steps` naming and explicit JSON-mode hard-fail behavior
- [x] T008 Fix `cli-codex` prompt template numbering so the memory epilogue section is correctly numbered
- [x] T009 Replace stale `.opencode/skill/sk-cli/` references with the actual `.opencode/skill/cli-*` layout in this spec folder
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification and Reconciliation

- [x] T010 Remove non-reproducible historical numeric test-pass totals from scoped acceptance evidence
- [x] T011 Record current alignment-drift evidence: `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts` passed with `0 findings`
- [x] T012 Defer repo-wide typecheck status unless a current rerun artifact is captured, and do not claim prior clean passes as current proof
- [x] T013 Remove unverifiable claims about a 1032-line round-trip artifact and completed live outsourced CLI dispatch
- [x] T014 Update `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` so they agree on runtime behavior, security wording, and deferred verification
- [x] T015 Run `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` on this spec folder and record the exit code
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Runtime hard-fail behavior matches the implemented loader and regression test coverage
- [x] Next-step persistence wording matches the implemented normalizer and session extractor
- [x] All `cli-*` references use the real path layout and include redact-and-scrub guidance
- [x] No spec artifact claims the unverifiable 1032-line memory file as current proof
- [x] Live outsourced CLI dispatch remains deferred unless rerun with fresh evidence
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
- **Regression coverage**: `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts`
- **CLI docs**: `.opencode/skill/cli-codex/`, `.opencode/skill/cli-copilot/`, `.opencode/skill/cli-gemini/`, `.opencode/skill/cli-claude-code/`
<!-- /ANCHOR:cross-refs -->

---
title: "Tasks: Input Normalizer Fast-Path Fix [system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/008-input-normalizer-fastpath-fix/tasks]"
description: "Task breakdown for the additive fast-path normalizer fix, verification replay, and Level-1 closeout."
trigger_phrases:
  - "input normalizer tasks"
  - "fast-path fix tasks"
  - "003 phase 8 tasks"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/008-input-normalizer-fastpath-fix"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["tasks.md"]

---
# Tasks: Input Normalizer Fast-Path Fix

<!-- SPECKIT_LEVEL: 1 -->
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

**Task Format**: `T### Description - WHY - Acceptance`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the diagnostic report and repro payload - WHY: confirm the root cause before editing - Acceptance: the failing shape and expected fix are pinned down from the original B4 diagnostic report and `/tmp/save-context-data.json`.
- [x] T002 Read the fast-path normalizer, CLI help text, and existing unit test file - WHY: keep the patch additive and locally consistent - Acceptance: target files and extension points are identified before editing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add string coercion for fast-path `user_prompts` entries - WHY: plain strings were collapsing into empty prompts downstream - Acceptance: string prompts normalize to `{ prompt, timestamp }`.
- [x] T004 Add string coercion for fast-path `observations` and `recent_context` entries - WHY: plain strings were dropping evidence fields required by the workflow - Acceptance: string observations and recent-context entries normalize to structured objects.
- [x] T005 Merge slow-path enrichments into the fast-path branch - WHY: mixed payloads were silently dropping `sessionSummary`, `keyDecisions`, `nextSteps`, `filesModified`, `toolCalls`, and `exchanges` - Acceptance: normalized output contains the same enrichment evidence when those fields are supplied with fast-path arrays.
- [x] T006 Correct the `--session-id` help text in `generate-context.ts` - WHY: current text describes a behavior the CLI no longer performs - Acceptance: `--help` says the session ID is attached to saved memory metadata.
- [x] T007 Add focused `input-normalizer` test coverage - WHY: the repro shape needs a durable unit-level guard - Acceptance: Vitest covers both string coercion and mixed fast-path enrichments.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run `npm run build` in `.opencode/skill/system-spec-kit/scripts` - WHY: TypeScript sources must compile to the runtime JS entrypoints - Acceptance: exit code 0.
- [x] T009 Re-run the original save repro with `/tmp/save-context-data.json` - WHY: the fix must prove the original `INSUFFICIENT_CONTEXT_ABORT` is gone - Acceptance: exit code 0, a new memory file is created, and post-save review reports no HIGH issues.
- [x] T010 Run the requested memory-quality regression suite - WHY: the patch must not regress the existing memory-save pipeline - Acceptance: `8 passed`, `3 skipped`, `35 passed`, `10 skipped`, `0 failed`.
- [x] T011 Run the direct `input-normalizer` unit test file - WHY: the focused test coverage must pass in isolation - Acceptance: `tests/input-normalizer-unit.vitest.ts` exits 0.
- [x] T012 Create and validate this Level-1 child phase packet - WHY: the fix needs a durable spec record - Acceptance: child and parent strict validators both exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks T001-T012 marked `[x]`
- [x] The original failing save repro now succeeds
- [x] Regression and unit coverage pass
- [x] This Level-1 phase validates cleanly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent Spec**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

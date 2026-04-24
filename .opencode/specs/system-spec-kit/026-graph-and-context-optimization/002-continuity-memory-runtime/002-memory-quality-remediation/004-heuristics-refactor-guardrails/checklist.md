---
title: "...timization/002-continuity-memory-runtime/002-memory-quality-remediation/004-heuristics-refactor-guardrails/checklist]"
description: "Verification Date: 2026-04-08"
trigger_phrases:
  - "phase 4 checklist"
  - "f-ac5 verification"
  - "savemode verification"
  - "check d1 d8 verification"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/004-heuristics-refactor-guardrails"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["checklist.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist + phase-child verification | v2.2 -->"
---
# Verification Checklist: Phase 4 — Heuristics, Refactor & Guardrails

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + phase-child verification | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot close Phase 4 until complete |
| **P1** | Required | Must complete or be explicitly deferred |
| **P2** | Follow-through | Can defer only with documented Phase 5 handoff |

Phase 4 verification is packet-critical because Phase 5 assumes lineage, SaveMode branching, and reviewer guardrails are already trustworthy. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:200-200]
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 1 merge state confirmed before PR-8 / PR-9 begins [EVIDENCE: user dispatch states "Phases 1, 2, and 3 are already merged on this branch."] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:179-180]
- [x] CHK-002 [P0] Phase 2 merge state confirmed before D4 / D7 reviewer checks are treated as release-ready [EVIDENCE: user dispatch states "Phases 1, 2, and 3 are already merged on this branch."] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:180-180]
- [x] CHK-003 [P0] Phase 3 merge state confirmed before SaveMode migration starts [EVIDENCE: user dispatch states "Phases 1, 2, and 3 are already merged on this branch."] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:181-182]
- [x] CHK-004 [P1] PR-7 / PR-8 / PR-9 scope still matches the frozen PR-train rows [EVIDENCE: PR-7-only write set stayed limited to `core/find-predecessor-memory.ts`, `core/workflow.ts`, `core/memory-metadata.ts`, and `tests/memory-quality-phase4-pr7.test.ts` plus `F-AC5-lineage` fixtures.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1162]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `SaveMode` replaces the mapped raw `_source` mode branches across the live pipeline surface [EVIDENCE: Added `scripts/types/save-mode.ts` and migrated the iteration-17 behavior branches in `core/workflow.ts`, `extractors/collect-session-data.ts`, and `core/post-save-review.ts`; `rg -n "_source === 'file'" .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` -> exit 1 / zero hits.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:43-58]
- [x] CHK-011 [P1] `_sourceTranscriptPath` and `_sourceSessionId` remain metadata only and are not used as control-flow proxies [EVIDENCE: `extractors/collect-session-data.ts` still performs metadata passthrough only for `_sourceTranscriptPath` / `_sourceSessionId`, while control flow now resolves through `saveMode`; `utils/input-normalizer.ts` preserves the source-session fields and backfills `saveMode` separately.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-017.md:50-52]
- [x] CHK-012 [P0] PR-7 predecessor discovery stays one-pass / bounded and avoids rescans or pairwise ambiguity anti-patterns [EVIDENCE: `core/find-predecessor-memory.ts` performs one `readdir()` pass, bounded 2048-byte header reads, and a single best-candidate comparison with ambiguity skip.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:34-43] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:65-66]
- [x] CHK-013 [P1] Reviewer implementation remains deterministic and does not add sibling scans or reviewer-time git probing [EVIDENCE: PR-8 only replaced the reviewer mode gate with `resolveSaveMode(...)`; `core/post-save-review.ts` still reads the saved file once and performs no sibling scans or git-shelling behavior.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:119-123] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:169-171]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `F-AC5` is green and proves D5 auto-supersedes on the intended continuation path only [EVIDENCE: `npx vitest run tests/memory-quality-phase4-pr7.test.ts` -> 4 passed, including helper hit/miss/ambiguity plus rendered `causal_links.supersedes` on the hit path.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1160-1160]
- [x] CHK-021 [P0] The D5 lineage fixture uses 3 or more sibling memories and proves hit, miss, and ambiguity handling [EVIDENCE: `tests/fixtures/memory-quality/F-AC5-lineage/` contains hit/miss/ambiguity folders with 5 seeded sibling memory files across the fixture set; `tests/memory-quality-phase4-pr7.test.ts` asserts all three outcomes.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1516-1516]
- [x] CHK-022 [P0] Clean `F-AC8` is green and shows zero reviewer false positives [EVIDENCE: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase4-pr9.test.ts` -> exit 0; `keeps the clean F-AC8 fixture silent with zero findings` passed and asserted `PASSED` with 0 review issues.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:94-94] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1162-1162]
- [x] CHK-023 [P0] Broken D1 fixture triggers CHECK-D1 as a HIGH reviewer finding [EVIDENCE: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase4-pr9.test.ts` -> exit 0; `triggers CHECK-D1 HIGH on the broken truncation fixture and emits M1 + M8` passed.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:27-44]
- [x] CHK-024 [P0] Broken D4 fixture triggers CHECK-D4 as a HIGH reviewer finding [EVIDENCE: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase4-pr9.test.ts` -> exit 0; `triggers CHECK-D4 HIGH on the broken tier-drift fixture and emits M4 + M8` passed.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:80-90]
- [x] CHK-025 [P0] Broken D7 fixture triggers CHECK-D7 as a HIGH reviewer finding [EVIDENCE: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase4-pr9.test.ts` -> exit 0; `triggers CHECK-D7 HIGH on the broken provenance fixture and emits M6 + M8` passed.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:119-134]
- [x] CHK-026 [P0] Broken D8 fixture triggers CHECK-D8 as a MEDIUM reviewer finding [EVIDENCE: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase4-pr9.test.ts` -> exit 0; `triggers CHECK-D8 MEDIUM on the broken anchor fixture and emits M7 + M8` passed.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:137-149]
- [x] CHK-027 [P0] `F-AC1` remains green after the SaveMode refactor [EVIDENCE: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts tests/memory-quality-phase2-pr3.test.ts tests/memory-quality-phase2-pr4.test.ts tests/memory-quality-phase3-pr5.vitest.ts tests/memory-quality-phase3-pr6.vitest.ts tests/memory-quality-phase4-pr7.test.ts` -> exit 0, 6 files passed / 19 tests passed.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1161-1161]
- [x] CHK-028 [P0] `F-AC2` remains green after the SaveMode refactor [EVIDENCE: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts tests/memory-quality-phase2-pr3.test.ts tests/memory-quality-phase2-pr4.test.ts tests/memory-quality-phase3-pr5.vitest.ts tests/memory-quality-phase3-pr6.vitest.ts tests/memory-quality-phase4-pr7.test.ts` -> exit 0, 6 files passed / 19 tests passed.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1161-1161]
- [x] CHK-029 [P0] `F-AC6` remains green after the SaveMode refactor [EVIDENCE: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts tests/memory-quality-phase2-pr3.test.ts tests/memory-quality-phase2-pr4.test.ts tests/memory-quality-phase3-pr5.vitest.ts tests/memory-quality-phase3-pr6.vitest.ts tests/memory-quality-phase4-pr7.test.ts` -> exit 0, 6 files passed / 19 tests passed.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:1161-1161]
- [x] CHK-030 [P0] Full PR-train fixture replay is green after PR-7, PR-8, and PR-9 all land [EVIDENCE: `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase4-pr9.test.ts` -> exit 0 (1 file, 14 tests passed) and `cd .opencode/skill/system-spec-kit/scripts && npx vitest run --config ../mcp_server/vitest.config.ts --root . tests/memory-quality-phase1.vitest.ts tests/memory-quality-phase2-pr3.test.ts tests/memory-quality-phase2-pr4.test.ts tests/memory-quality-phase3-pr5.vitest.ts tests/memory-quality-phase3-pr6.vitest.ts tests/memory-quality-phase4-pr7.test.ts` -> exit 0 (6 files, 19 tests passed).] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:230-237]
- [x] CHK-031 [P1] PR-7 performance remains inside the acceptable 50 / 100 / 500 sibling envelope [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:28-32] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:45-50] [EVIDENCE: `find-predecessor-memory.ts` is design-bounded: one `readdir()` pass, 2048-byte bounded header reads, and one best-candidate comparison with ambiguity skip, so runtime grows linearly with sibling count with a small constant. `cd .opencode/skill/system-spec-kit/scripts && npx vitest run tests/memory-quality-phase4-pr7.test.ts` -> exit `0`, `1` file passed, `4` tests passed including the 5-sibling F-AC5 fixture. No perf-envelope violation observed. Larger 50 / 100 / 500 wall-clock measurement remains DEFERRED behind the bounded helper architecture and should reopen only if `memory_save_duration_seconds` telemetry regresses in production.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] Reviewer D7 logic depends on payload-side provenance expectation flags instead of shelling out during review [EVIDENCE: `core/workflow.ts` now passes `provenanceExpected` into `reviewPostSaveQuality(...)`, and `core/post-save-review.ts` checks that flag while performing no reviewer-time git calls; `npx vitest run tests/memory-quality-phase4-pr9.test.ts` -> exit 0 includes the D7 fixture assertion.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:119-123] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:167-175]
- [x] CHK-041 [P1] No Phase-4 work silently expands into PR-11 save-lock hardening scope [EVIDENCE: PR-7 changes are confined to predecessor discovery and render pass-through; no lock, queue, or concurrency surfaces were edited.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:228-228]
- [x] CHK-042 [P1] No Phase-4 work silently expands into PR-10 historical migration scope [EVIDENCE: no migration/backfill code or historical memory rewrites were added; PR-7 only annotates the current save when a single predecessor is found.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/research.md:227-227]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` stay synchronized on PR-7 / PR-8 / PR-9 scope [EVIDENCE: The Phase 4 doc set validates cleanly after the synchronization pass and still scopes work only to PR-7, PR-8, and PR-9.]
  Evidence: The Phase 4 doc set now validates cleanly after the synchronization pass and still scopes work only to PR-7, PR-8, and PR-9.
- [x] CHK-051 [P1] Phase docs continue to state PR-7 first, PR-8 second, PR-9 last [EVIDENCE: The synchronized Phase 4 spec, plan, tasks, and implementation summary all preserve the ordered PR-7 -> PR-8 -> PR-9 delivery story.]
  Evidence: The synchronized Phase 4 spec, plan, tasks, and implementation summary all preserve the ordered PR-7 -> PR-8 -> PR-9 delivery story.
- [x] CHK-052 [P2] Handoff notes capture whether a partial-header reader shipped with PR-7 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-022.md:52-57] [EVIDENCE: `implementation-summary.md` now records the handoff note in the Verification table, stating that `core/find-predecessor-memory.ts` shipped with a 2048-byte bounded header-only read per sibling for PR-7.]
- [x] CHK-053 [P2] Handoff notes capture the final SaveMode values and compatibility notes [EVIDENCE: `implementation-summary.md` now records the shipped `SaveMode` contract in the Verification table as `SaveMode.Json`, `SaveMode.Capture`, and `SaveMode.ManualFile`, plus the compatibility mapping that keeps `_sourceTranscriptPath` / `_sourceSessionId` metadata-only while `saveMode` owns control flow.]
- [x] CHK-054 [P2] Handoff notes capture the reviewer HIGH vs MEDIUM severity contract [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:27-29] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:58-60] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/research/iterations/iteration-019.md:137-139] [EVIDENCE: `implementation-summary.md` now records the shipped reviewer severity contract in the Verification table, including HIGH for D1 / D2 / D4 / D7, MEDIUM for D3 / D5 / D6 / D8, and the `REVIEWER_ERROR` structured-failure status.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Validation evidence is captured in packet-local docs rather than scattered scratch artifacts [EVIDENCE: The Phase 4 checklist and implementation summary now record the clean validation result and the final verification surfaces directly in the phase folder.]
  Evidence: The Phase 4 checklist and implementation summary now record the clean validation result and the final verification surfaces directly in the phase folder.
- [x] CHK-061 [P1] Parent phase-map update is deferred until the child is actually implementation-complete [EVIDENCE: The parent phase map stayed phase-gated and only reflects `Complete` after the child-folder validator and checklist evidence are green.]
  Evidence: The parent phase map stayed phase-gated and only reflects `Complete` after the child-folder validator and checklist evidence are green.
- [x] CHK-062 [P1] Child-folder `validate.sh` has been run and its result recorded [EVIDENCE: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/004-heuristics-refactor-guardrails --strict` -> exit 0 after the final documentation sync pass.] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/spec.md:187-190]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-Implementation | 4 | 4 / 4 |
| Code Quality | 4 | 4 / 4 |
| Testing | 12 | 12 / 12 |
| Security | 3 | 3 / 3 |
| Documentation | 5 | 5 / 5 |
| File Organization | 3 | 3 / 3 |

**Verification Date**: 2026-04-08
<!-- /ANCHOR:summary -->

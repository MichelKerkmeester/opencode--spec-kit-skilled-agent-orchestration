---
title: "Verification Checklist: Phase 4 — Heuristics, Refactor & Guardrails"
description: "Verification Date: 2026-04-07"
trigger_phrases:
  - "phase 4 checklist"
  - "f-ac5 verification"
  - "savemode verification"
  - "check d1 d8 verification"
importance_tier: important
contextType: "planning"
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

Phase 4 verification is packet-critical because Phase 5 assumes lineage, SaveMode branching, and reviewer guardrails are already trustworthy. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:200-200]
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 1 merge state confirmed before PR-8 / PR-9 begins [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:179-180]
- [ ] CHK-002 [P0] Phase 2 merge state confirmed before D4 / D7 reviewer checks are treated as release-ready [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:180-180]
- [ ] CHK-003 [P0] Phase 3 merge state confirmed before SaveMode migration starts [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:181-182]
- [ ] CHK-004 [P1] PR-7 / PR-8 / PR-9 scope still matches the frozen PR-train rows [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1160-1162]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `SaveMode` replaces the mapped raw `_source` mode branches across the live pipeline surface [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:43-58]
- [ ] CHK-011 [P1] `_sourceTranscriptPath` and `_sourceSessionId` remain metadata only and are not used as control-flow proxies [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-017.md:50-52]
- [ ] CHK-012 [P0] PR-7 predecessor discovery stays one-pass / bounded and avoids rescans or pairwise ambiguity anti-patterns [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:34-43] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:65-66]
- [ ] CHK-013 [P1] Reviewer implementation remains deterministic and does not add sibling scans or reviewer-time git probing [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:119-123] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:169-171]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `F-AC5` is green and proves D5 auto-supersedes on the intended continuation path only [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1160-1160]
- [ ] CHK-021 [P0] The D5 lineage fixture uses 3 or more sibling memories and proves hit, miss, and ambiguity handling [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1516-1516]
- [ ] CHK-022 [P0] Clean `F-AC8` is green and shows zero reviewer false positives [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:94-94] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1162-1162]
- [ ] CHK-023 [P0] Broken D1 fixture triggers CHECK-D1 as a HIGH reviewer finding [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:27-44]
- [ ] CHK-024 [P0] Broken D4 fixture triggers CHECK-D4 as a HIGH reviewer finding [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:80-90]
- [ ] CHK-025 [P0] Broken D7 fixture triggers CHECK-D7 as a HIGH reviewer finding [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:119-134]
- [ ] CHK-026 [P0] Broken D8 fixture triggers CHECK-D8 as a MEDIUM reviewer finding [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:137-149]
- [ ] CHK-027 [P0] `F-AC1` remains green after the SaveMode refactor [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1161-1161]
- [ ] CHK-028 [P0] `F-AC2` remains green after the SaveMode refactor [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1161-1161]
- [ ] CHK-029 [P0] `F-AC6` remains green after the SaveMode refactor [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:1161-1161]
- [ ] CHK-030 [P0] Full PR-train fixture replay is green after PR-7, PR-8, and PR-9 all land [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:230-237]
- [ ] CHK-031 [P1] PR-7 performance remains inside the acceptable 50 / 100 / 500 sibling envelope [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:28-32] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:45-50]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P1] Reviewer D7 logic depends on payload-side provenance expectation flags instead of shelling out during review [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:119-123] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:167-175]
- [ ] CHK-041 [P1] No Phase-4 work silently expands into PR-11 save-lock hardening scope [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:228-228]
- [ ] CHK-042 [P1] No Phase-4 work silently expands into PR-10 historical migration scope [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:227-227]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` stay synchronized on PR-7 / PR-8 / PR-9 scope
- [ ] CHK-051 [P1] Phase docs continue to state PR-7 first, PR-8 second, PR-9 last
- [ ] CHK-052 [P2] Handoff notes capture whether a partial-header reader shipped with PR-7 [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-022.md:52-57]
- [ ] CHK-053 [P2] Handoff notes capture the final SaveMode values and compatibility notes
- [ ] CHK-054 [P2] Handoff notes capture the reviewer HIGH vs MEDIUM severity contract [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:27-29] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:58-60] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-019.md:137-139]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Validation evidence is captured in packet-local docs rather than scattered scratch artifacts
- [ ] CHK-061 [P1] Parent phase-map update is deferred until the child is actually implementation-complete
- [ ] CHK-062 [P1] Child-folder `validate.sh` has been run and its result recorded [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/spec.md:187-190]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-Implementation | 4 | 0 / 4 |
| Code Quality | 4 | 0 / 4 |
| Testing | 12 | 0 / 12 |
| Security | 3 | 0 / 3 |
| Documentation | 5 | 0 / 5 |
| File Organization | 3 | 0 / 3 |

**Verification Date**: 2026-04-07
<!-- /ANCHOR:summary -->


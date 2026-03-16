---
title: "Tasks: Data Fidelity [template:level_1/tasks.md]"
---
# Tasks: Data Fidelity

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
## Phase 1: Setup — Extend Normalized Types

- [ ] T001 Add `ACTION?: string`, `_provenance?: string`, `_synthetic?: boolean` to the `FileChange` interface (`scripts/types/session-types.ts` or coordinate with R-04) — REQ-001
- [ ] T002 Ensure normalizer passthrough does not strip unknown fields (`scripts/utils/input-normalizer.ts`) — REQ-001
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation — Metadata Preservation, Coercion, Enrichment, and Logging

### Fix FILES Metadata Preservation

- [ ] T003 Update `input-normalizer.ts` to copy `ACTION`, `_provenance`, `_synthetic` from raw input to normalized entries (`scripts/utils/input-normalizer.ts`) — REQ-001
- [ ] T004 [P] Add test: normalized output retains metadata when present in raw input — REQ-001
- [ ] T005 [P] Add test: normalized output works correctly when metadata is absent — REQ-001

### Fix Object-Based Fact Coercion

- [ ] T006 Update `file-extractor.ts` to detect object-type facts (`scripts/extractors/file-extractor.ts`) — REQ-002
- [ ] T007 Coerce objects to `JSON.stringify(value, null, 2)` with type prefix (e.g., `[object] ...`) (`scripts/extractors/file-extractor.ts`) — REQ-002
- [ ] T008 [P] Apply same object coercion fix in `conversation-extractor.ts` (`scripts/extractors/conversation-extractor.ts`) — REQ-002
- [ ] T009 [P] Add test: object facts appear as stringified entries, not missing entries — REQ-002

### Wire Manual Decision Enrichment

- [ ] T010 Update `extractDecisions()` to check for `_manualDecision` enrichment (`scripts/extractors/decision-extractor.ts`) — REQ-003
- [ ] T011 When present, populate decision `fullText`, `chosenApproach`, `confidence` from enrichment fields (`scripts/extractors/decision-extractor.ts`) — REQ-003
- [ ] T012 Add test: decisions include enrichment fields when `_manualDecision` is provided by `transformKeyDecision()` — REQ-003

### Add Truncation Logging

- [ ] T013 Add `console.warn` or structured logger call when observation count exceeds `MAX_OBSERVATIONS` (`scripts/extractors/collect-session-data.ts`) — REQ-004
- [ ] T014 Log original count and retained count in warning message (`scripts/extractors/collect-session-data.ts`) — REQ-004
- [ ] T015 Add test: warning is emitted when observations are truncated — REQ-004

### Centralize Shared Extraction Helpers (P1)

- [ ] T016 [P] Extract shared logic (tool-call detection, phase classification, duration calculation, manual decision parsing) into a common module — REQ-005
- [ ] T017 [P] Update extractors to import from shared module — REQ-005

### Instrument Silent Data Drops (P1)

- [ ] T018 [P] Add structured log entries for filtered prompts, ignored object facts, discarded metadata (`scripts/extractors/`) — REQ-006
- [ ] T019 [P] Each drop point emits field path, drop reason, and count — REQ-006
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Unit test: FILES metadata preservation through normalization — REQ-001
- [ ] T021 [P] Unit test: object-based fact coercion (object in, string out, not dropped) — REQ-002
- [ ] T022 [P] Unit test: manual decision enrichment consumption by `extractDecisions()` — REQ-003
- [ ] T023 [P] Unit test: observation truncation warning logging — REQ-004
- [ ] T024 Integration test: raw input with metadata and objects through to rendered output — SC-001, SC-002
- [ ] T025 Run full Vitest suite and confirm all tests pass
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] No silent data loss at pipeline boundaries (SC-001)
- [ ] Manual decision enrichment flows through to rendered output (SC-002)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Dependency**: 004-type-consolidation (R-04) — canonical `FileChange` type must include metadata fields
<!-- /ANCHOR:cross-refs -->

---
title: "Tasks: Data Fidelity [template:level_2/tasks.md]"
---
# Tasks: Data Fidelity

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

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
## 2. PHASE 1: SETUP

- [x] T001 Preserve `ACTION`, `_provenance`, and `_synthetic` in the local FILES normalization contract without waiting for `004-type-consolidation` (`scripts/utils/input-normalizer.ts`) (REQ-001)
- [x] T002 Keep structured FILES passthrough backward-compatible when metadata is absent and preserve legacy `filesModified` as `ACTION: "Modified"` only (`scripts/utils/input-normalizer.ts`) (REQ-001)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

### Fix FILES Metadata Preservation

- [x] T003 Update `input-normalizer.ts` to copy `ACTION`, `_provenance`, and `_synthetic` from raw FILES input to normalized entries (`scripts/utils/input-normalizer.ts`) (REQ-001)
- [x] T004 Add targeted Vitest coverage proving normalized FILES retain metadata when present (`scripts/tests/runtime-memory-inputs.vitest.ts`) (REQ-001)
- [x] T005 Add targeted Vitest coverage proving normalized FILES remain backward-compatible when metadata is absent (`scripts/tests/runtime-memory-inputs.vitest.ts`) (REQ-001)

### Fix Object-Based Fact Coercion

- [x] T006 Add one shared fact-coercion helper for displayable fact text with explicit drop reasons (`scripts/utils/fact-coercion.ts`) (REQ-002)
- [x] T007 Apply object-fact coercion in file observation rendering and deduplication so rendered facts no longer collapse to empty strings (`scripts/extractors/file-extractor.ts`) (REQ-002)
- [x] T008 Apply the same helper to conversation tool-call scanning and pending-task extraction (`scripts/extractors/conversation-extractor.ts`, `scripts/extractors/collect-session-data.ts`) (REQ-002)
- [x] T009 Add regression coverage proving object facts render and still drive tool detection instead of disappearing (`scripts/tests/test-extractors-loaders.js`) (REQ-002)

### Wire Manual Decision Enrichment

- [x] T010 Update `extractDecisions()` to accept `_manualDecision` on decision observations (`scripts/extractors/decision-extractor.ts`) (REQ-003)
- [x] T011 Prefer `_manualDecision.fullText`, `chosenApproach`, and `confidence` while suppressing duplicate observation-derived decisions when authoritative `_manualDecisions` exist (`scripts/extractors/decision-extractor.ts`) (REQ-003)
- [x] T012 Add regression coverage for `_manualDecision` enrichment and duplicate suppression (`scripts/tests/test-extractors-loaders.js`) (REQ-003)

### Add Truncation Logging

- [x] T013 Add structured warning output when observation count exceeds `MAX_OBSERVATIONS` (`scripts/extractors/collect-session-data.ts`) (REQ-004)
- [x] T014 Restrict truncation logs to spec/session identifiers plus original and retained counts, with no observation content (`scripts/extractors/collect-session-data.ts`) (REQ-004)
- [x] T015 Add regression coverage proving truncation warning emission and content-free payloads (`scripts/tests/test-extractors-loaders.js`) (REQ-004)

### Centralize Shared Extraction Helpers (P1)

- [x] T016 Extract the narrow shared helper this phase actually needs: fact coercion for extractor/display seams (`scripts/utils/fact-coercion.ts`) (REQ-005)
- [x] T017 Update file, conversation, decision, and pending-task extraction seams to import the shared helper (`scripts/extractors/*.ts`) (REQ-005)

### Instrument Silent Data Drops (P1)

- [x] T018 Add structured log entries for remaining fact-coercion drop points instead of duplicating existing prompt-filter warnings (`scripts/utils/fact-coercion.ts`) (REQ-006)
- [x] T019 Ensure drop logs emit field path, drop reason counts, and optional spec/session identifiers (`scripts/utils/fact-coercion.ts`, `scripts/extractors/collect-session-data.ts`) (REQ-006)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T020 Run targeted Vitest coverage for FILES metadata preservation and backward compatibility (`tests/runtime-memory-inputs.vitest.ts`) (REQ-001)
- [x] T021 Run extractor/loaders regression coverage for object-fact coercion in file rendering and conversation tool detection (`scripts/tests/test-extractors-loaders.js`) (REQ-002)
- [x] T022 Run extractor/loaders regression coverage for `_manualDecision` enrichment and duplicate suppression (`scripts/tests/test-extractors-loaders.js`) (REQ-003)
- [x] T023 Run extractor/loaders regression coverage for observation truncation warning logging (`scripts/tests/test-extractors-loaders.js`) (REQ-004)
- [x] T024 Verify integrated pipeline behavior with `npm run typecheck`, targeted Vitest, extractor/loaders JS regression suite, and `npm run build` (SC-001), SC-002
- [x] T025 Record verification evidence from the exact approved command sequence in the phase docs (SC-001), SC-002
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Targeted verification passed
- [x] No silent data loss remains at the implemented normalization/extractor boundaries (SC-001)
- [x] Manual decision enrichment flows through to rendered decision output (SC-002)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Dependency**: `004-type-consolidation` (R-04) remains draft. This phase intentionally used the current local `FileChange` ownership and stayed forward-compatible with the later canonical type move
<!-- /ANCHOR:cross-refs -->

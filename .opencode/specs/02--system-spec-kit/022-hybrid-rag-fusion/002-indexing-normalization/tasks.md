---
title: "Consolidated tasks: 002-indexing-normalization [002-indexing-normalization/tasks.md]"
description: "Consolidated from former child spec 002-index-tier-anomalies -> tasks.md and former child spec 004-frontmatter-indexing -> tasks.md."
SPECKIT_TEMPLATE_SOURCE: "merge-consolidation | v1.0"
trigger_phrases:
  - "consolidated"
  - "002-indexing-normalization"
importance_tier: "important"
contextType: "implementation"
---
# Consolidated tasks.md

This document consolidates source documents from:
- `former child spec 002-index-tier-anomalies -> tasks.md`
- `former child spec 004-frontmatter-indexing -> tasks.md`

## Source: `former child spec 002-index-tier-anomalies -> tasks.md`

---
title: "Tasks: Memory Index Deduplication and Tier Normalization [former child spec 002-index-tier-anomalies -> tasks]"
description: "Task Format: T### [priority] [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "memory"
  - "index"
  - "deduplication"
  - "and"
  - "003"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Memory Index Deduplication and Tier Normalization

<!-- SPECKIT_LEVEL: 3 -->
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
| `[P0]`/`[P1]`/`[P2]` | Priority |

**Task Format**: `T### [priority] [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Capture baseline duplicate-scan behavior from alias roots (`mcp_server/handlers/memory-index.ts`) [EVIDENCE: alias-root duplication covered by `tests/handler-memory-index.vitest.ts` and fixed-path behavior validated in targeted/extended runs]
- [x] T002 [P0] [P] Add alias-root regression coverage (`mcp_server/tests/handler-memory-index.vitest.ts`) [EVIDENCE: `npm test -- tests/memory-parser.vitest.ts tests/handler-memory-index.vitest.ts tests/importance-tiers.vitest.ts` PASS (52 tests)]
- [x] T003 [P0] [P] Add tier precedence edge-case fixtures (`mcp_server/tests/memory-parser.vitest.ts`) [EVIDENCE: targeted parser suite PASS (included in 52-test run)]
- [x] T004 [P1] [P] Add tier mapping consistency assertions (`mcp_server/tests/importance-tiers.vitest.ts`) [EVIDENCE: targeted tier utility suite PASS (included in 52-test run)]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Implement canonical-path dedup in memory discovery and merge flow (`mcp_server/lib/parsing/memory-parser.ts`) [EVIDENCE: implementation landed in `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`]
- [x] T006 [P0] Enforce unique file list before batch indexing (`mcp_server/handlers/memory-index.ts`) [EVIDENCE: implementation landed in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`]
- [x] T007 [P0] Preserve specFolder filter behavior after canonicalization (`mcp_server/lib/parsing/memory-parser.ts`) [EVIDENCE: targeted + extended parser/index suites PASS (52 + 186 tests)]
- [x] T008 [P0] Normalize default tier mapping behavior (`mcp_server/lib/scoring/importance-tiers.ts`) [EVIDENCE: implementation landed in `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts`; targeted tier tests PASS]
- [x] T009 [P1] Add diagnostics for deduped path counts in scan result details (`mcp_server/handlers/memory-index.ts`) [EVIDENCE: handler implementation/tests updated; handler test suite PASS]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 [P0] Run index handler tests and verify duplicate-source regression passes (`mcp_server/tests/handler-memory-index.vitest.ts`) [EVIDENCE: `npm test -- tests/memory-parser.vitest.ts tests/handler-memory-index.vitest.ts tests/importance-tiers.vitest.ts` PASS (52 tests)]
- [x] T011 [P0] Run parser tests and verify tier precedence cases pass (`mcp_server/tests/memory-parser.vitest.ts`) [EVIDENCE: targeted + extended parser/spec runs PASS (52 + 186 tests)]
- [x] T012 [P1] Run tier utility tests and verify defaults remain stable (`mcp_server/tests/importance-tiers.vitest.ts`) [EVIDENCE: targeted tier utility suite PASS (included in 52-test run)]
- [x] T013 [P1] Run spec validation and resolve issues (`scripts/spec/validate.sh`) [EVIDENCE: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/003-index-tier-anomalies` PASS (0 errors, 0 warnings)] (pre-consolidation path; now 002-indexing-normalization)
- [x] T014 [P1] Update checklist and implementation-summary with evidence (`checklist.md`, `implementation-summary.md`) [EVIDENCE: documentation synchronized in spec folder]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks marked `[x]`
- [x] No `[B]` blocked tasks remain
- [x] Verification evidence recorded in `checklist.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
<!-- /ANCHOR:cross-refs -->

## Source: `former child spec 004-frontmatter-indexing -> tasks.md`

---
title: "Tasks: 004-frontmatter-indexing [former child spec 004-frontmatter-indexing -> tasks]"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "004"
  - "frontmatter"
  - "indexing"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: 004-frontmatter-indexing

<!-- SPECKIT_LEVEL: 3 -->
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
## Phase 1: Setup

- [x] T001 Define canonical frontmatter schema and mapping table (`spec.md`, parser references) | Evidence: Canonical schema/normalization approach documented and exercised by migration + parser tests.
- [x] T002 Capture legacy frontmatter variants from templates/spec docs/memories (`scratch/` notes) | Evidence: Migration/report corpus covers templates (81), memory (365), spec docs (1343).
- [x] T003 [P] Prepare migration fixtures for valid and malformed cases (`mcp_server/tests/...`) | Evidence: Template/frontmatter test suites executed successfully.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement normalize and compose helpers in parser layer (`mcp_server/lib/parsing/...`) | Evidence: `node scripts/tests/test-template-system.js` and `node scripts/tests/test-template-comprehensive.js` passed.
- [x] T005 Implement migration CLI flow with dry-run and apply modes (`scripts/dist/memory/...`) | Evidence: `scratch/frontmatter-apply-report.json` and `scratch/frontmatter-final-dry-run-report-v3.json` show successful apply + idempotent dry-run.
- [x] T006 Wire index rebuild after successful migration (`mcp_server/lib/storage/index-refresh.ts`) | Evidence: Reindex completed with `STATUS=OK` (executed twice).
- [x] T007 Add error handling for malformed frontmatter and unsupported legacy keys (`mcp_server/lib/errors/...`) | Evidence: `node scripts/tests/test-frontmatter-backfill.js` and memory parser vitest target passed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run unit tests for parser/coercion/compose paths (`npm test -- parser/frontmatter suites`) | Evidence: Passed: `test-template-system.js`, `test-template-comprehensive.js`, `test-frontmatter-backfill.js`, `mcp_server/tests/memory-parser.vitest.ts`, `mcp_server/tests/memory-parser-extended.vitest.ts`.
- [x] T009 Run integration reindex and retrieval regression suites (`mcp_server/tests/...`) | Evidence: `npm run test --workspace mcp_server -- tests/full-spec-doc-indexing.vitest.ts tests/index-refresh.vitest.ts` passed; reindex quality checks remain captured in `implementation-summary.md`.
- [x] T010 Update checklist and implementation summary with evidence (`checklist.md`, `implementation-summary.md`) | Evidence: Evidence paths, numbering normalization, and `historical scratch artifact "full-tree-fusion-audit.md"` were updated in this remediation pass.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed

Deferred/Non-Applicable Notes:
- None for task execution. Deferred items are tracked in `checklist.md` where evidence was not strictly available.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## P0+P1 Remediation Pass (2026-03-20)

Deep-research audit: 3 iterations, 14 agent runs, 73 findings. All 5 P0 and 6 P1 recommendations implemented across four streams. GPT-5.4 cross-AI review identified 2 additional findings, both addressed before merge.

<!-- ANCHOR:remediation-stream-a -->
### Stream A: input-normalizer.ts

- [x] R-A001 [P0] Replace unsafe `as string` casts with `safeString()` helper — rejects objects/arrays, coerces primitives, falls back for null/undefined (`scripts/utils/input-normalizer.ts`) [EVIDENCE: BUG-001 — `safeString()` helper implemented and exercised by 21 unit tests in `input-normalizer-unit.vitest.ts`]
- [x] R-A002 [P0] Trim and capitalize ACTION before use; default invalid `MODIFICATION_MAGNITUDE` to `'unknown'` only when a value was provided but invalid (`scripts/utils/input-normalizer.ts`) [EVIDENCE: BUG-003 — ACTION normalization and MAGNITUDE defaulting covered by dedicated test cases in `input-normalizer-unit.vitest.ts`]
- [x] R-A003 [P0] Add `importanceTier` to `NormalizedData` interface and `CollectedDataBase`; propagate through fast/slow paths; honor in `collectSessionData` (`scripts/utils/input-normalizer.ts`, `scripts/types/session-types.ts`, `scripts/extractors/collect-session-data.ts`) [EVIDENCE: BUG-006 — interface updated, propagation verified, `importanceTier` precedence test added in `input-normalizer-unit.vitest.ts`]
<!-- /ANCHOR:remediation-stream-a -->

<!-- ANCHOR:remediation-stream-b -->
### Stream B: spec-affinity.ts

- [x] R-B001 [P1] Filter single-word trigger phrases matching stopwords from `exactPhrases` (`scripts/utils/spec-affinity.ts`) [EVIDENCE: AFFINITY-001 — stopword filter applied before phrase registration]
- [x] R-B002 [P1] Replace `.includes()` substring matching with `containsWordBoundary()` word-boundary matching (`scripts/utils/spec-affinity.ts`) [EVIDENCE: AFFINITY-002 — false-positive prevention validated]
- [x] R-B003 [P1] Add 6 new stopwords: `configuration`, `documentation`, `management`, `processing`, `requirements`, `specification` (`scripts/utils/spec-affinity.ts`) [EVIDENCE: AFFINITY-003 — stopword list extended]
<!-- /ANCHOR:remediation-stream-b -->

<!-- ANCHOR:remediation-stream-c -->
### Stream C: memory-indexer.ts

- [x] R-C001 [P1] Extract 7 named constants for importance weighting formula (`scripts/core/memory-indexer.ts`) [EVIDENCE: STD-014 — magic numbers replaced with named constants]
- [x] R-C002 [P0] Wrap `generateDocumentEmbedding()` and `vectorIndex.indexMemory()` in try/catch with structured logging (`scripts/core/memory-indexer.ts`) [EVIDENCE: ERR-001 — 4 failure-path tests in `memory-indexer-weighting.vitest.ts` cover null embedding, throw from embedding, throw from index, and trigger extraction throw]
<!-- /ANCHOR:remediation-stream-c -->

<!-- ANCHOR:remediation-stream-d -->
### Stream D: verify_alignment_drift.py

- [x] R-D001 [P1] Document exit code model gap (script 0/1 vs validate.sh 0/1/2); add `--fail-on-warn` flag (`sk-code--opencode/scripts/verify_alignment_drift.py`) [EVIDENCE: ALIGN-001 — gap documented, flag added]
<!-- /ANCHOR:remediation-stream-d -->

<!-- ANCHOR:remediation-tests -->
### Test Coverage (Remediation)

- [x] R-T001 [P0] Add 21 unit tests for `normalizeFileEntryLike` via `normalizeInputData` — empty objects, non-string coercion, null/undefined, object/array rejection, field precedence, ACTION normalization, MAGNITUDE defaulting, provenance validation, `importanceTier` propagation (`scripts/tests/input-normalizer-unit.vitest.ts`) [EVIDENCE: TCOV-001 — new file, 21 tests pass]
- [x] R-T002 [P0] Add 4 failure-path tests for `memory-indexer`: null embedding, throw embedding, throw index, trigger extraction throw with mock (`scripts/tests/memory-indexer-weighting.vitest.ts`) [EVIDENCE: TCOV-005 — 4 tests pass]
- [x] R-T003 [P1] Update ACTION test in `runtime-memory-inputs.vitest.ts` to align with new normalization behavior (`scripts/tests/runtime-memory-inputs.vitest.ts`) [EVIDENCE: ACTION test updated, passes in 59/60 targeted run]
<!-- /ANCHOR:remediation-tests -->

<!-- ANCHOR:remediation-completion -->
### Remediation Completion Criteria

- [x] All P0 remediation tasks marked `[x]`
- [x] All P1 remediation tasks marked `[x]`
- [x] 59/60 targeted tests pass (1 pre-existing failure outside remediation scope)
- [x] GPT-5.4 cross-AI review findings addressed
- [x] `implementation-summary.md` updated with evidence
<!-- /ANCHOR:remediation-completion -->

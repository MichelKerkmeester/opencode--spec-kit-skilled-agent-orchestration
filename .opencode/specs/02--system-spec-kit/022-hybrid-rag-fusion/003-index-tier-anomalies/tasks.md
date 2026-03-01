---
title: "Tasks: Memory Index Deduplication and Tier Normalization [003-index-tier-anomalies/tasks]"
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
- [x] T013 [P1] Run spec validation and resolve issues (`scripts/spec/validate.sh`) [EVIDENCE: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/003-index-tier-anomalies` PASS (0 errors, 0 warnings)]
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

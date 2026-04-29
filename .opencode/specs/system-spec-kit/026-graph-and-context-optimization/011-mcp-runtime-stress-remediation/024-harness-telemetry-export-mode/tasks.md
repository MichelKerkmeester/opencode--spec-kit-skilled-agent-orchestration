---
title: "Tasks: Harness Telemetry Export Mode"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task list for extending the search-quality harness with optional telemetry preservation and JSONL export."
trigger_phrases:
  - "024-harness-telemetry-export-mode"
  - "harness telemetry export"
  - "search quality telemetry mode"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/024-harness-telemetry-export-mode"
    last_updated_at: "2026-04-29T09:05:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Authored task list for harness telemetry export mode"
    next_safe_action: "Implement harness telemetry propagation and export"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/tests/search-quality/harness.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/search-quality/harness-telemetry-export.vitest.ts"
    completion_pct: 20
    open_questions: []
    answered_questions:
      - "Telemetry export remains opt-in via telemetryExportPath"
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Harness Telemetry Export Mode

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

- [x] T001 Read packet spec contract (`spec.md`)
- [x] T002 Read harness and corpus contracts (`mcp_server/tests/search-quality/harness.ts`, `corpus.ts`)
- [x] T003 [P] Read existing search-quality harness consumers (`baseline.vitest.ts`, `w*.vitest.ts`, `measurement-fixtures.ts`)
- [x] T004 [P] Read telemetry type definitions (`search-decision-envelope.ts`, `shadow-sink.ts`)
- [x] T005 Create packet implementation plan (`plan.md`)
- [x] T006 Create packet task list (`tasks.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Add telemetry imports and shared telemetry types (`mcp_server/tests/search-quality/harness.ts`)
- [x] T008 Propagate telemetry through channel captures and case results (`mcp_server/tests/search-quality/harness.ts`)
- [x] T009 Add `telemetryExportPath` runner option (`mcp_server/tests/search-quality/harness.ts`)
- [x] T010 Write opt-in JSONL export for envelopes, audit rows, and shadow rows (`mcp_server/tests/search-quality/harness.ts`)
- [x] T011 Add telemetry-mode Vitest with inline corpus and temp cleanup (`mcp_server/tests/search-quality/harness-telemetry-export.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run existing and new search-quality tests (`npx vitest run tests/search-quality/`)
- [x] T013 Run TypeScript typecheck (`npx tsc --noEmit`)
- [x] T014 Run strict packet validator (`validate.sh 024-harness-telemetry-export-mode --strict`)
- [x] T015 Write implementation summary (`implementation-summary.md`)
- [x] T016 Update spec continuity metadata (`spec.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Search-quality tests, typecheck, and strict packet validation passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

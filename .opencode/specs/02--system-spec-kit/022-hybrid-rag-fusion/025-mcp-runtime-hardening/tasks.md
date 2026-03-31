---
title: "Tasks: MCP Runtime Hardening [02--system-spec-kit/022-hybrid-rag-fusion/025-mcp-runtime-hardening/tasks]"
description: "T020-T025 implementation tasks delegated to codex exec agents and finalized by Claude."
trigger_phrases:
  - "025 mcp hardening tasks"
  - "runtime hardening tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: MCP Runtime Hardening

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
## Phase 1: Setup

### Agent A: T020 — DB Dimension Integrity Tests
- [x] T001 [P] Create `tests/db-dimension-integrity.vitest.ts` with 5 test cases: custom-path + dimension mismatch, concurrent DB paths, reinitialization with different dimensions, startup dimension pre-validation, in-memory DB isolation (`mcp_server/tests/db-dimension-integrity.vitest.ts`)

### Agent B: T021 — Lifecycle Coverage Tests
- [x] T002 [P] Create `tests/lifecycle-shutdown.vitest.ts` with 4 test cases: graceful shutdown cleanup, async error catching, cache cleanup expiry, cache shutdown (`mcp_server/tests/lifecycle-shutdown.vitest.ts`)
- [x] T003 [P] Create `tests/stage2b-enrichment-extended.vitest.ts` with 3 test cases: double-failure fail-open, empty input, missing optional fields (`mcp_server/tests/stage2b-enrichment-extended.vitest.ts`)

### Agent C: T022 — Log Sanitization
- [x] T004 [P] Add `sanitizeErrorField()` and `sanitizeDetails()` to `lib/errors/core.ts`, apply in `buildErrorResponse()` (`mcp_server/lib/errors/core.ts`)
- [x] T005 [P] Replace raw error logging with `get_error_message()` in `context-server.ts` lines 635, 644 (`mcp_server/context-server.ts`)
- [x] T006 [P] Create `tests/error-sanitization.vitest.ts` with 8 test cases including nested object/array sanitization (`mcp_server/tests/error-sanitization.vitest.ts`)

### Agent D: T023 — Doc Consolidation
- [x] T007 [P] Add Codex MEMORY_DB_PATH note and clean-transport section to environment variables reference
- [x] T008 [P] Add Codex callout to MCP server README
- [x] T009 [P] Add Codex setup note to system-spec-kit README
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Run new test files and verify all 20 tests pass `[EVIDENCE: 4 files, 20 tests, 0 failures]`
- [x] T011 Run regression tests to confirm no breakage `[EVIDENCE: 4 files, 132 tests, 0 failures]`
- [x] T012 Run `npm run test:core` full suite `[EVIDENCE: 318 passed, 1 pre-existing timeout in mcp-tool-dispatch, 8631 tests passed]`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 T024: Update 024 packet to note T020-T025 implemented in 025
- [x] T014 T025: Routing rule documented — future waves open 026+
- [x] T015 Complete checklist.md with verification evidence
- [x] T016 Write implementation-summary.md
- [x] T017 Run packet validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 20 new test cases pass (5 DB dimension + 4 lifecycle + 3 stage2b + 8 sanitization)
- [x] Existing test:core suite passes (1 pre-existing timeout unrelated)
- [x] `buildErrorResponse()` recursively sanitizes credentials including nested objects/arrays
- [x] `dist/` rebuilt and verified against built module
- [x] 9 doc surfaces updated (3 READMEs + env vars + install guide + feature catalog + playbook + descriptions.json + 024 cross-refs)
- [x] GPT-5.4 xhigh re-review: all prior findings verified fixed, new findings (stale dist, regex gaps, circular guard) resolved
- [x] Packet validates with zero errors
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: See `../024-codex-memory-mcp-fix/` (T020-T025)
- **Broader Remediation**: See `../020-pre-release-remediation/`
<!-- /ANCHOR:cross-refs -->

---

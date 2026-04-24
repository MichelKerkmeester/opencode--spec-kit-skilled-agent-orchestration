---
title: "Feature Specification: MCP Runtime Hardening [system-spec-kit/022-hybrid-rag-fusion/025-mcp-runtime-hardening/spec]"
description: "Implements the follow-on recommendations from 024-codex-memory-mcp-fix: DB dimension integrity tests, lifecycle coverage tests, provider log sanitization, and launcher doc consolidation."
trigger_phrases:
  - "mcp runtime hardening"
  - "db dimension integrity tests"
  - "lifecycle coverage tests"
  - "provider log sanitization"
  - "025 follow-on"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/025-mcp-runtime-hardening"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: MCP Runtime Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-28 |
| **Branch** | `025-mcp-runtime-hardening` |
| **Parent Spec** | `022-hybrid-rag-fusion` |
| **Predecessor** | `024-codex-memory-mcp-fix` (follow-on tasks T020-T025) |
| **Successor** | ../026-memory-database-refinement/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `024-codex-memory-mcp-fix` packet documented six follow-on recommendations (T020-T025) for runtime hardening, but none were implemented. Key gaps: no integration tests for custom-path DB + embedding-dimension mismatch; no lifecycle tests for shutdown sequencing or tool-cache invalidation; `buildErrorResponse()` passes unsanitized provider error messages to callers; and launcher docs lack consolidated MEMORY_DB_PATH and clean-transport guidance.

### Purpose
Close the T020-T025 gaps with targeted tests, one focused code change (log sanitization), and doc consolidation so the Codex MCP startup slice is hardened end-to-end.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- T020: Integration tests for custom-path DB initialization and embedding-dimension integrity
- T021: Lifecycle tests for shutdown sequence, tool-cache invalidation, and stage2b fail-open extension
- T022: Add recursive `sanitizeErrorField()` + `sanitizeDetails()` to `lib/errors/core.ts` with circular-reference guard and case-insensitive/hyphenated regex; extract cleanup helpers to side-effect-free module
- T023: Consolidate MEMORY_DB_PATH and clean-transport guidance in launcher docs
- T024: Update 024 packet to cross-reference implementation in 025
- T025: Document routing rule for future waves (026+)

### Out of Scope
- New runtime features beyond log sanitization
- Closing the broader `022-hybrid-rag-fusion` remediation program
- Schema migration tooling for dimension-incompatible databases (deferred)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/tests/db-dimension-integrity.vitest.ts` | Create | T020: 5 embedding-dimension integrity tests |
| `mcp_server/tests/lifecycle-shutdown.vitest.ts` | Create | T021: 4 shutdown/cache lifecycle tests |
| `mcp_server/tests/stage2b-enrichment-extended.vitest.ts` | Create | T021: 3 stage2b fail-open extension tests |
| `mcp_server/tests/error-sanitization.vitest.ts` | Create | T022: 8 error sanitization tests |
| `mcp_server/lib/errors/core.ts` | Modify | T022: Recursive `sanitizeErrorField()` + `sanitizeDetails()` with circular guard |
| `mcp_server/lib/utils/cleanup-helpers.ts` | Create | Side-effect-free `runCleanupStep`/`runAsyncCleanupStep` |
| `mcp_server/context-server.ts` | Modify | T022: Imports cleanup helpers from new module |
| system-spec-kit environment variables reference | Modify | T023: Codex note + clean-transport section |
| system-spec-kit MCP server README | Modify | T023: Codex MEMORY_DB_PATH callout |
| system-spec-kit README | Modify | T023: Codex setup note |
| system-spec-kit install guide | Modify | Codex writable-path note + troubleshooting |
| feature catalog 08-bug-fixes | Create | Credential sanitization entry |
| manual testing playbook 08-bug-fixes | Create | Credential sanitization scenario |
| descriptions.json | Modify | 025 entry added |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | DB dimension integrity tests cover custom-path + mismatch scenarios | 5 test cases pass in `db-dimension-integrity.vitest.ts` |
| REQ-002 | `buildErrorResponse()` recursively strips credential patterns including nested objects/arrays | `sanitizeErrorField()` redacts `sk-*` (incl. hyphenated), `voy_*`, case-insensitive `Bearer`, `key=*`; `sanitizeDetails()` recurses with circular guard |
| REQ-003 | Shutdown cleanup uses side-effect-free helpers | `context-server.ts` imports from `lib/utils/cleanup-helpers.ts`; `dist/` rebuilt |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Lifecycle tests cover shutdown sequencing and tool-cache invalidation | 4 tests pass in `lifecycle-shutdown.vitest.ts` |
| REQ-005 | Stage2b fail-open tests extended for double-failure and edge cases | 3 tests pass in `stage2b-enrichment-extended.vitest.ts` |
| REQ-006 | Launcher docs consolidate MEMORY_DB_PATH and clean-transport guidance | 3 doc files updated with consistent guidance |
| REQ-007 | 024 packet cross-references 025 for implementation status | 024 tasks.md updated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 20 new test cases pass
- **SC-002**: Existing `test:core` suite still passes (no regressions)
- **SC-003**: `buildErrorResponse()` never returns API keys in error responses
- **SC-004**: Packet validates with zero errors

### Acceptance Scenarios

**Given** an error with nested API keys in details, **when** `buildErrorResponse()` is called, **then** all `sk-*`, `voy_*`, Bearer, and `key=` patterns are replaced with `[REDACTED]` at every nesting level.

**Given** a custom `MEMORY_DB_PATH` with dimension 1024 and a provider expecting 1536, **when** the DB is reopened, **then** a `VectorIndexError` is thrown with a dimension mismatch message.

**Given** a cleanup function that throws during shutdown, **when** `runCleanupStep()` is called, **then** the error is logged as a message string and the shutdown sequence continues.

**Given** a circular-reference object in error details, **when** `sanitizeDetails()` encounters it, **then** it returns `'[Circular]'` instead of crashing with a stack overflow.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `024-codex-memory-mcp-fix` landed fixes | Low | Already verified green |
| Risk | T021 and T022 both touch `context-server.ts` | Low | Different sections (startup vs shutdown) |
| Risk | New tests may expose latent bugs | Medium | Fix or document findings |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
<!-- ANCHOR:requirements -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: New tests complete in <30s total
- **NFR-P02**: `sanitizeErrorField()` adds negligible overhead (<1ms per call)

### Security
- **NFR-S01**: No API keys, tokens, or credentials in error responses returned to tool callers
- **NFR-S02**: Shutdown logging never exposes raw provider error payloads

### Reliability
- **NFR-R01**: Existing test suite remains green after changes
- **NFR-R02**: Error sanitization preserves actionable debug context (error codes, provider names, HTTP status)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
<!-- /ANCHOR:requirements -->
## L2: EDGE CASES

### Data Boundaries
- Empty error message: `sanitizeErrorField("")` returns `""`
- Error with no credentials: passes through unchanged
- Multiple credentials in one message: all redacted
- Circular-reference object in details: returns `'[Circular]'` instead of stack overflow

### Error Scenarios
- DB opened with dimension 1024, reopened expecting 1536: throws `VectorIndexError`
- Both stage2b enrichment steps throw: returns original input unchanged
- Cleanup function throws during shutdown: logged as message string, sequence continues
- Hyphenated API key `sk-proj-...`: caught by updated regex
- Lowercase `bearer` token: caught by case-insensitive pattern

### State Transitions
- In-memory DB does not pollute file-backed DB dimension state
- Tool generation bump cancels stale in-flight cache promises
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 4 new test files, 1 new module, 2 code changes, 9 doc surfaces |
| Risk | 10/25 | Low risk — mostly additive tests + small sanitization change |
| Research | 8/20 | Exploration already done in 024 session |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None — scope fully defined by 024 follow-on recommendations
<!-- /ANCHOR:questions -->

---

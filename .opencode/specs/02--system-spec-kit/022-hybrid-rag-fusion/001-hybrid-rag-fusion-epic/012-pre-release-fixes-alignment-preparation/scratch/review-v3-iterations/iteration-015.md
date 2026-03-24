## Iteration 015 - Code Review Findings

**Scope reviewed:** `mcp_server/lib/{search,scoring,graph,cognitive,governance,feedback,session,learning}`

**Focus:** D1 Correctness + D2 Security

**Assessment:** `REQUEST_CHANGES`

**Baseline used:** `sk-code--review`

**Overlay used:** `sk-code--opencode`

**High-level note:** I did not find a direct SQL injection issue in the inspected paths; the SQL-heavy code generally uses placeholders correctly. The main release-readiness risks here are fail-open filtering and missing scope binding around session/audit state.

### P1-001 [P1] BM25 spec-folder filtering fails open on lookup errors
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:323-349`
- **Evidence:** When `bm25Search()` needs to post-filter by `specFolder`, it batch-loads folders from `memory_index`. If that lookup throws, the catch block sets `specFolderMap = null`, and the filter path then returns `true` for every row (`if (specFolderMap === null) return true`). That converts a filter failure into an unfiltered result set.
- **Risk:** Any transient DB problem during folder resolution silently bypasses the caller's requested scope and returns cross-folder data instead of failing closed.
- **Recommendation:** Treat folder-resolution failures as `[]` or propagate an error. Do not return unfiltered results when the scope filter cannot be evaluated.

### P1-002 [P1] Session-scoped state is bound only to caller-controlled `sessionId`
- **Files:** `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:45-63`, `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:323-344`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:766-779`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:897-912`
- **Supporting exposure path:** `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-43`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1089-1099`
- **Evidence:** `working_memory` and `session_state` store records keyed by `session_id` alone; neither table includes tenant/user/agent scope columns. Retrieval helpers (`getSessionPromptContext()`, `recoverState()`) read rows solely by `session_id = ?`. The tool layer explicitly documents `sessionId` as caller-supplied, and `memory_context` resume mode injects prompt context directly from `workingMemory.getSessionPromptContext(requestedSessionId, ...)`.
- **Risk:** If a caller can guess, reuse, or intentionally collide on another caller's `sessionId`, they can read that caller's working-memory/session-state context. This is effectively an IDOR on session context.
- **Recommendation:** Bind session state to governance scope (at minimum tenant + actor, ideally tenant + user/agent + session), and enforce that binding in the storage helpers before returning session data.

### P1-003 [P1] Governance audit review defaults to full-table enumeration when filters are omitted
- **Files:** `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:407-445`, `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:501-530`
- **Evidence:** `buildGovernanceAuditWhereClause()` returns an empty `whereSql` when no action/decision/scope filter is supplied. `reviewGovernanceAudit()` then runs `SELECT ... FROM governance_audit ${whereSql} ORDER BY id DESC LIMIT ?`, which becomes an unrestricted audit-log read when `filters = {}`.
- **Risk:** The governance library's own review helper will return cross-tenant/user/session audit history unless the caller remembers to pass scope constraints. For a security-sensitive audit surface, that is the wrong default.
- **Recommendation:** Require at least one scope boundary (preferably `tenantId`) unless an explicit privileged override is provided, and fail closed on empty filters.

### P2-001 [P2] Feedback ledger has no governance scope columns, so batch learning mixes signals globally
- **Files:** `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:35-45`, `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:115-127`, `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:195-215`
- **Evidence:** `FeedbackEvent`/`feedback_events` only capture `memoryId`, `queryId`, `confidence`, `timestamp`, and optional `sessionId`; there are no `tenantId` / `userId` / `agentId` / `sharedSpaceId` fields. `aggregateEvents()` then pulls `getFeedbackEvents(db, { since, until })` for the entire window with no scope filter.
- **Risk:** In a shared database, telemetry and evaluation data from one tenant/actor can contaminate another tenant's batch-learning analysis. The module is currently shadow-only, which limits blast radius, but the data model is not release-ready for governed multi-tenant use.
- **Recommendation:** Add governance scope fields to the feedback ledger and require scoped reads in batch aggregation.

### P2-002 [P2] Null-session events count as distinct pseudo-sessions and can bypass min-support
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:206-215`
- **Supporting evidence:** `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` records `sessionId: sessionId ?? null` when logging feedback events.
- **Evidence:** `aggregateEvents()` derives `const sessionKey = ev.session_id ?? \`__null_${ev.id}\``. That means every event with `session_id = NULL` is treated as a different session, artificially inflating `sessionCount`.
- **Risk:** The min-support guard (`MIN_SUPPORT_SESSIONS`) can be satisfied by repeated anonymous/null-session events from a single real caller, undermining the distinct-session protection the batch job is supposed to provide.
- **Recommendation:** Either reject null-session events from support counting, or collapse them into a single anonymous bucket that cannot satisfy min-support on its own.

## Summary

- **P0:** 0
- **P1:** 3
- **P2:** 2

## Notes

- The inspected SQL paths were generally parameterized; I did **not** find a concrete raw-SQL injection issue in this pass.
- The highest-confidence blockers are the fail-open folder filter in `hybrid-search` and the lack of scope binding for session/audit state.

---
# SPECKIT_TEMPLATE_SOURCE: review-report-core | v1.0
title: "Code Review: code_graph_status read-only readiness snapshot [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/014-graph-status-readiness-snapshot/review-report]"
description: "Reviewer-authored code review of Packet 014 (read-only readiness snapshot). Verdict: APPROVE. 0 P0, 0 P1, 1 P2, 2 INFO. The previously-open mock-surface enumeration question is resolved as SUFFICIENT-WITH-NOTE."
trigger_phrases:
  - "014 review report"
  - "graph status readiness snapshot review"
  - "packet 014 codex review"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/014-graph-status-readiness-snapshot"
    last_updated_at: "2026-04-27T20:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Dispatched cli-codex gpt-5.5 high (substituted for copilot due to quota exhaustion); reviewer returned APPROVE with one P2 doc-precision finding"
    next_safe_action: "Address F-001 (P2) — reconcile spec.md acceptance scenario with mock-surface test, or accept as-is and proceed to commit"
    blockers: []
    key_files:
      - "review-report.md"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Mock-surface enumeration completeness — the test's 12-name writeSurfaceMocks list covers EVERY data-mutating export of code-graph-db.ts. initDb (schema/lifecycle) is declared but not asserted; reviewer rules this acceptable for handler-level scope. SUFFICIENT-WITH-NOTE."
---
# Code Review: packet 014-graph-status-readiness-snapshot

_Reviewer: cli-codex gpt-5.5 high effort fast service tier (substituted for copilot due to quota exhaustion 2026-04-27; sanctioned by user)._

_Dispatch errors: none. codex exec exit 0; tokens used 116,469. One non-fatal `failed to record rollout items` warning printed by codex_core after Stop hook fired — does not affect review content._

---

## Verdict
APPROVE

## Summary
Packet 014 implements the recommended Option #1: a read-only `getGraphReadinessSnapshot()` projection over `detectState()` and wires `code_graph_status` to surface `full_scan` / `selective_reindex` / `none`. The production code path avoids the mutating `ensureCodeGraphReady()` branches, and `DEFAULT_DEBOUNCE_MS` remains `2000`. Main caveat: the side-effect test is mock-surface proof, not a true DB-byte/hash proof; acceptable here, but the docs should avoid implying an on-disk byte-equal test was run.

## Findings table
| ID | Severity | Check | Title | Evidence |
|----|----------|-------|-------|----------|
| F-001 | P2 | 5, 11 | Side-effect proof is mock-surface, not DB-byte-equal | `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:230-235` explicitly substitutes mock-surface assertions for DB-byte equality; `.opencode/.../014-graph-status-readiness-snapshot/spec.md:117` still says "DB file is byte-equal before vs after." |
| F-002 | INFO | 9 | Write-surface mocks cover all data-mutating exports | `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:223-300`, `322-410`, `485-496`, `770-784` match the 12 asserted write exports in the test. |
| F-003 | INFO | 10 | Workspace contains sibling-packet changes outside Packet 014 | `git status --short` shows changes in `context.ts`, `seed-resolver.ts`, `executor-config.ts`, `tool-input-schemas.ts`, and packets `012/013/015`; Packet 014 docs do not attribute those to this packet. |

## Per-check verdicts

### Check 1 — Plan adherence
PASS — Research §5 recommends a read-only snapshot helper and leaving debounce at 2000ms (`research.md:187-193`). The implementation adds `getGraphReadinessSnapshot()` (`ensure-ready.ts:508-524`) and `file-watcher.ts:49` still has `const DEFAULT_DEBOUNCE_MS = 2000;`.

### Check 2 — Read-only invariant
PASS — `getGraphReadinessSnapshot()` only calls `detectState()` and returns `{ freshness, action, reason }` (`ensure-ready.ts:508-515`). It does not call `cleanupDeletedTrackedFiles` (`ensure-ready.ts:91-97`), `cacheReadyResult` / `readinessDebounce.set` (`ensure-ready.ts:321-327`), `indexWithTimeout` (`ensure-ready.ts:229-264`), or `setLastGitHead` (`ensure-ready.ts:383-385`, `404-405`).

### Check 3 — Action-level surface correctness
PASS — `detectState()` maps empty graph to `full_scan` (`ensure-ready.ts:151-155`), no tracked files to `full_scan` (`ensure-ready.ts:166-170`), HEAD-changed/up-to-date graph to `full_scan` (`ensure-ready.ts:174-184`), broad stale `>50` to `full_scan` (`ensure-ready.ts:200-212`), bounded stale to `selective_reindex` (`ensure-ready.ts:215-225`), and fresh to `none` (`ensure-ready.ts:197`). Nuance: HEAD-changed plus bounded stale follows the existing bounded-stale branch, so the snapshot correctly reflects current `ensure-ready` behavior.

### Check 4 — `freshness` field shape preserved
PASS — `status.ts` now derives `freshness` from `snapshot.freshness` (`status.ts:169-170`) but still emits top-level `freshness` (`status.ts:218`) and passes it into `buildReadinessBlock()` (`status.ts:202-207`), which preserves raw readiness fields (`readiness-contract.ts:241-248`).

### Check 5 — Test coverage vs research §5.5 criteria checklist
WARN — Criteria A-D are covered as status pass-through tests: fresh (`test:130-142`), empty (`145-159`), broad stale (`162-174`), bounded stale (`177-189`). Error path and trust-state regression are covered (`192-218`). Side-effect freedom is covered by mock-surface assertions (`265-293`), which is not strictly equivalent to DB-byte-equal plus cache inspection from research §5.5 (`research.md:200-206`), but is sufficient when combined with static verification of the full write surface and the helper code path. File-watcher coverage is supported by unchanged constant (`file-watcher.ts:49`) and implementation-summary claims `21/21` pass (`implementation-summary.md:121`), though the reviewer did not run tests.

### Check 6 — Critical guarded behavior
PASS — `DEFAULT_DEBOUNCE_MS` remains unchanged at `.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:49`.

### Check 7 — Helper extraction quality
PASS — The new helper is a read-only subset over `detectState()` (`ensure-ready.ts:508-515`). It does not touch `readinessDebounce` (`307`, `321-327`), does not call `cleanupDeletedTrackedFiles` (`341-342` is only in `ensureCodeGraphReady()`), does not call `indexWithTimeout` (`379-402` only in mutating ready path), and does not call `setLastGitHead` (`383-385`, `404-405`).

### Check 8 — Regression risk on `status.ts` patch
PASS — The patch replaces `getGraphFreshness(process.cwd())` with `getGraphReadinessSnapshot(process.cwd())` (`status.ts:169-170`) and carries `snapshot.action` / `snapshot.reason` into `buildReadinessBlock()` (`202-207`). All requested top-level fields remain emitted: `totalFiles`, `totalNodes`, `totalEdges`, `freshness`, `readiness`, `canonicalReadiness`, `trustState`, `lastScanAt`, `lastPersistedAt`, `lastGitHead`, `dbFileSize`, `schemaVersion`, `nodesByKind`, `edgesByType`, `edgeDriftSummary`, `parseHealth`, `graphQualitySummary`, `goldVerificationTrust`, optional `lastGoldVerification`, optional `verificationPassPolicy` (`status.ts:215-234`). No removed or renamed field found.

### Check 9 — Mock-surface enumeration completeness
PASS — The 12 asserted data-mutating exports cover the DB write surface. See enumeration below. `initDb` is declared in mocks but not asserted; it can create/migrate schema (`code-graph-db.ts:154-170`) but is connection/schema lifecycle rather than the data-write API surface the handler could directly call.

### Check 10 — Scope discipline
WARN — Packet 014 source/docs are scoped correctly, but the worktree has sibling-packet modifications: `context.ts`, `seed-resolver.ts`, `executor-config.ts`, `tool-input-schemas.ts`, and new tests/spec folders for `012`, `013`, and `015`. These should stay attributed to their sibling packets, not Packet 014.

### Check 11 — Doc/code consistency
WARN — `implementation-summary.md` accurately describes the helper, status patch, preserved fields, and test counts (`implementation-summary.md:56-63`, `110-123`). Claimed line ranges are accurate for current source (`ensure-ready.ts:142-226`, `329-450`; `status.ts:158-225`). The only doc precision issue is the acceptance scenario saying DB byte equality (`spec.md:117`) while the implemented proof is mock-surface only (`test:230-235`).

## Mock-surface enumeration completeness (the previously-open question)
Verdict: **SUFFICIENT-WITH-NOTE.**

Mutating/data-writing exports in `code-graph-db.ts`:
- `initDb` — schema/lifecycle writes: pragmas, schema creation, migrations, schema version insert/update (`154-170`).
- `setCodeGraphMetadata` — metadata insert/update via `setMetadata` (`204-211`, `223-225`).
- `setLastGitHead` — metadata write (`231-233`).
- `setLastDetectorProvenance` — metadata write (`243-245`).
- `setLastDetectorProvenanceSummary` — metadata write (`260-262`).
- `setLastGraphEdgeEnrichmentSummary` — metadata write (`277-280`).
- `clearLastGraphEdgeEnrichmentSummary` — metadata delete (`214-216`, `283-285`).
- `setLastGoldVerification` — metadata write (`300-302`).
- `upsertFile` — `UPDATE` / `INSERT` into `code_files` (`322-355`).
- `replaceNodes` — transaction with node/edge deletes and node inserts (`358-389`).
- `replaceEdges` — transaction with edge deletes and inserts (`392-410`).
- `removeFile` — edge/file deletes (`485-496`).
- `cleanupOrphans` — node/edge deletes (`770-784`).

The 12 asserted-not-called names cover every data-mutating export except `initDb`, which is present in the mock object but not asserted. That is acceptable for the current handler-level test, but not equivalent to a DB-byte-equal integration test.

## Recommendations
- **P2**: Update `spec.md:117` or add a small integration test if the packet wants to keep the stronger "DB byte-equal" claim.
- **INFO**: Keep Packet 014 commits/review scope separate from sibling packet changes in `012`, `013`, and `015`.
- **INFO**: No code change required for the read-only snapshot path; the production implementation matches the research option.

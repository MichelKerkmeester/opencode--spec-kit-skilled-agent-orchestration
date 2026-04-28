---
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
title: "Feature Specification: Degraded-readiness envelope parity [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/spec]"
description: "P1 remediation from the 012-015 integrated deep-review (CONDITIONAL verdict). Aligns code_graph_context (F-001) and code_graph_status (F-003) with the shared degraded-readiness vocabulary used by code_graph_query: preserve readiness/canonicalReadiness/trustState/graphAnswersOmitted plus an `rg` recovery signal when the underlying probe or stats path crashes. Adds the missing `error → missing/unavailable` fixture to the shared readiness-contract suite (F-009) and folds in handler-local crash recovery action labelling (F-002). Documents the shared vocabulary + handler-local payload split in decision-record.md (F-006/F-008)."
trigger_phrases:
  - "016-degraded-readiness-envelope-parity"
  - "degraded readiness envelope parity"
  - "code_graph_context readiness crash envelope"
  - "code_graph_status DB unavailable readiness"
  - "shared degraded-readiness vocabulary"
  - "F-001 F-003 remediation"
  - "rg fallback handler parity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity"
    last_updated_at: "2026-04-27T22:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Packet A (016) from review-report.md §3 / §7 PASS gate"
    next_safe_action: "Run validate.sh --strict; daemon restart for live probe"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts"
    completion_pct: 92
    open_questions: []
    answered_questions:
      - "Use `nextTool: 'rg'` (matches query.ts shape) for crash recovery — answered ADR-001"
      - "Status stats path: try/catch isolation AND snapshot-first ordering (defense in depth) — answered ADR-002"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Degraded-readiness envelope parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (required from CONDITIONAL deep-review verdict) |
| **Status** | Implemented |
| **Created** | 2026-04-27 |
| **Sources** | review-report.md §3 (F-001, F-003), §4 (F-002, F-006, F-008, F-009 supporting), §7 Packet A |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 10-iteration cli-codex deep-review of the 012-015 integrated implementation surfaced two P1 cross-cutting findings (CONDITIONAL verdict):

- **F-001** (`code_graph_context`): when the readiness probe throws, the handler converts the exception to `freshness: 'error'` / `action: 'none'` then **falls through** to `buildContext()`. If that downstream path also fails, the handler returns a generic `status: 'error'` envelope that drops every structured readiness field operators rely on (`readiness`, `canonicalReadiness`, `trustState`, `graphAnswersOmitted`). Callers can no longer distinguish "graph unavailable" from "internal handler bug".
- **F-003** (`code_graph_status`): the handler reads `graphDb.getStats()` BEFORE `getGraphReadinessSnapshot()`. If stats throws (e.g. DB locked / corrupted) the catch path returns a generic `Code graph not initialized: <msg>` string and the snapshot helper never runs — defeating packet 014's whole point of surfacing action-level readiness without a mutating `code_graph_scan` call.

Three P2 follow-ons land alongside (per review-report.md §4):
- **F-002** — readiness crashes in `ensure-ready.ts` map to `action: 'none'` while `code_graph_query` reports `nextTool: 'rg'`. Handler vocabulary must converge on a single recovery signal.
- **F-008** — degraded-readiness docs (and code) imply ONE shared contract while behavior is handler-local. Cross-handler vocabulary needs to be explicit + tested.
- **F-009** — `tests/readiness-contract.vitest.ts` covers `fresh|stale|empty` but not the `error → missing/unavailable` projection that `readiness-contract.ts:73-87, 109-123, 241-248` already implements.

### Purpose
Ship the F-001 + F-003 production fixes plus F-002 / F-008 / F-009 supporting work as a single coherent unit so all three code-graph handlers (`context`, `status`, `query`) emit the SAME degraded-readiness vocabulary on probe / DB failure. Operators see one consistent envelope; downstream callers route to one consistent recovery action (`rg`).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `mcp_server/code_graph/handlers/context.ts` — block read path on `freshness === 'error'` BEFORE `buildContext()`; emit blocked envelope with `readiness`, `canonicalReadiness`, `trustState`, `graphAnswersOmitted: true`, `requiredAction: 'rg'`, and a `fallbackDecision: { nextTool: 'rg', reason }` matching `code_graph_query`'s shape (F-001, F-002).
- `mcp_server/code_graph/handlers/status.ts` — call `getGraphReadinessSnapshot()` BEFORE `graphDb.getStats()`; isolate stats into a try/catch so unavailable readiness still surfaces; preserve the snapshot in the catch path and emit `fallbackDecision: { nextTool: 'rg', reason }` (F-003).
- `mcp_server/tests/readiness-contract.vitest.ts` — add fixtures pinning `error → missing` (canonicalReadiness), `error → unavailable` (trustState), and the read-path-suppression contract for `buildQueryGraphMetadata` on probe crash (F-009).
- `mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts` (new) — F-001 + F-003 contract tests plus a cross-handler parity sweep proving context/status crash envelopes share the canonical `missing` / `unavailable` projection and the `rg` recovery signal (F-008 verification).
- `decision-record.md` — document the shared vocabulary + handler-local payload split (F-006/F-008 docs).

### Out of Scope
- Changes to `code_graph_query` — already ships the canonical `fallbackDecision` shape; this packet ALIGNS the other two handlers to its existing behavior.
- Changes to `getGraphReadinessSnapshot` itself (read-only helper from packet 014) — only the call site moves.
- Changes to `buildCopilotPromptArg` / `validateSpecFolder` / executor-config.ts — that's Packet B (017) territory.
- Catalog / playbook documentation drift — that's Packet C (018) territory.
- Any change to `DEFAULT_DEBOUNCE_MS=2000` — packet 014 explicitly excluded this; same constraint here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts` | Modify | Block read path on `freshness === 'error'`; emit shared degraded envelope with `rg` fallback decision (F-001) |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts` | Modify | Call snapshot first; isolate `getStats()` into try/catch; preserve snapshot on stats / post-stats failure (F-003) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/readiness-contract.vitest.ts` | Modify | Add `error → missing/unavailable` fixtures + read-path-suppression check (F-009) |
| `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-degraded-readiness-envelope-parity.vitest.ts` | Create | F-001 + F-003 contract tests + cross-handler vocabulary parity sweep (F-008 proof) |
| `spec.md` / `plan.md` / `tasks.md` / `checklist.md` / `decision-record.md` / `implementation-summary.md` | Create | Packet docs |
| `description.json` / `graph-metadata.json` | Create | Spec metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria | Source |
|----|-------------|---------------------|--------|
| REQ-001 | `code_graph_context` MUST block the read path on `readiness.freshness === 'error'` BEFORE invoking `buildContext()`. | Test: ensureCodeGraphReady throws → handler returns `status: 'blocked'`, NOT `status: 'error'`; `buildContext` not called. | F-001 |
| REQ-002 | The blocked envelope on a context readiness crash MUST preserve `readiness`, `canonicalReadiness`, `trustState`, `graphAnswersOmitted: true`. | Test: parsed payload has all four fields with `freshness: 'error'`, `canonicalReadiness: 'missing'`, `trustState: 'unavailable'`, `graphAnswersOmitted: true`. | F-001 |
| REQ-003 | The blocked envelope on a context readiness crash MUST emit a `fallbackDecision: { nextTool: 'rg', reason }` matching the `code_graph_query` shape. | Test: `data.fallbackDecision.nextTool === 'rg'`; `reason` matches `/readiness_check_crashed/`. | F-001, F-002 |
| REQ-004 | `code_graph_status` MUST invoke `getGraphReadinessSnapshot()` BEFORE `graphDb.getStats()`. | Test: stats throws → handler still returns the readiness snapshot in the response. | F-003 |
| REQ-005 | `code_graph_status` MUST isolate `graphDb.getStats()` failure into a try/catch so the readiness snapshot survives an unavailable DB. | Test: `getStats()` throws → response has `status: 'error'`, `data.readiness` populated, `data.canonicalReadiness` and `data.trustState` populated, `data.fallbackDecision.nextTool === 'rg'`, `data.blockReason === 'stats_unavailable'`. | F-003 |
| REQ-006 | `code_graph_status` MUST preserve the readiness snapshot when the post-stats path fails (drift summary / verification trust). | Test: catch path returns `data.readiness` populated and `data.fallbackDecision.nextTool === 'rg'`. | F-003 |
| REQ-007 | `tests/readiness-contract.vitest.ts` MUST cover `error → missing` (canonicalReadiness), `error → unavailable` (trustState), AND `buildQueryGraphMetadata` short-circuit on `error`. | Three new assertions PASS in `npx vitest run tests/readiness-contract.vitest.ts`. | F-009 |
| REQ-008 | The cross-handler vocabulary parity test MUST prove `context` and `status` crash envelopes project to the SAME `canonicalReadiness: 'missing'` + `trustState: 'unavailable'` and recommend the SAME `rg` recovery. | New test in the parity vitest file passes. | F-008 |
| REQ-009 | The healthy path on `code_graph_status` (stats OK, snapshot fresh) MUST remain unchanged. | Existing `code-graph-status-readiness-snapshot.vitest.ts` continues to pass without modification. | regression |
| REQ-010 | The healthy path on `code_graph_context` (cocoindex telemetry passthrough, anchor emission, ok envelope) MUST remain unchanged. | Existing `code-graph-context-cocoindex-telemetry-passthrough.vitest.ts` continues to pass without modification. | regression |

### Acceptance Scenarios

**Given** `ensureCodeGraphReady` throws inside `code_graph_context`, **when** the handler runs, **then** the response is `status: 'blocked'` with `data.readiness.freshness === 'error'`, `data.canonicalReadiness === 'missing'`, `data.trustState === 'unavailable'`, `data.graphAnswersOmitted === true`, and `data.fallbackDecision === { nextTool: 'rg', reason: <message> }`.

**Given** `graphDb.getStats()` throws inside `code_graph_status`, **when** the handler runs, **then** the response is `status: 'error'` with `data.readiness` populated from `getGraphReadinessSnapshot()`, `data.canonicalReadiness`, `data.trustState`, and `data.fallbackDecision.nextTool === 'rg'`.

**Given** both `getGraphReadinessSnapshot` returns `freshness: 'error'` AND `getStats()` throws, **when** `code_graph_status` runs, **then** the response carries `canonicalReadiness === 'missing'` and `trustState === 'unavailable'` (NOT `'absent'`, which is reserved for genuinely empty graphs).

**Given** the healthy path (stats OK, snapshot fresh), **when** `code_graph_status` runs, **then** the response is `status: 'ok'` with the full data block intact, no `degraded` marker, no `fallbackDecision`.

**Given** the canonical readiness contract suite runs, **when** the new fixtures execute, **then** `canonicalReadinessFromFreshness('error') === 'missing'`, `queryTrustStateFromFreshness('error') === 'unavailable'`, and `buildQueryGraphMetadata({ freshness: 'error', ... })` returns `undefined` without consulting the db.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001 (F-001 PASS gate)**: Context readiness-crash returns BLOCKED envelope with preserved readiness/canonicalReadiness/trustState/graphAnswersOmitted/`rg` recovery (REQ-001..003 verified).
- **SC-002 (F-003 PASS gate)**: Status DB-unavailable returns readiness snapshot with stats failure isolated (REQ-004..006 verified).
- **SC-003 (F-008 PASS gate)**: Both handlers preserve common readiness fields (shared vocabulary check), proven by the cross-handler parity test (REQ-008).
- **SC-004 (F-009 PASS gate)**: `error → missing/unavailable` fixture + read-path-suppression check land in the shared readiness-contract suite (REQ-007).
- **SC-005**: All existing tests for the surfaces this packet touches continue to pass (`code-graph-status-readiness-snapshot`, `code-graph-context-cocoindex-telemetry-passthrough`, `code-graph-query-fallback-decision`, `readiness-contract`, `code-graph-db`, `code-graph-degraded-sweep`, `file-watcher`).
- **SC-006**: `npx tsc --noEmit` PASS.
- **SC-007**: `validate.sh --strict` PASS.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Adding a new block path in `context.ts` regresses callers that depend on a generic `status: 'error'` from the readiness-crash branch. | Low | The blocked envelope is a SUPERSET of the prior payload (status changes from `error` to `blocked`, but adds richer fields without removing any). Callers that read `data.readiness` already see it; callers that read `error` still see a descriptive `message` string. |
| Risk | Reordering `getGraphReadinessSnapshot` ahead of `getStats()` in `status.ts` introduces a side-effect regression. | Low | Snapshot helper is read-only by packet 014 contract (`tests/code-graph-status-readiness-snapshot.vitest.ts` Test E pins this) — calling it earlier never causes mutation. |
| Risk | Stats `try/catch` swallows a DB-level error that should bubble. | Low | We re-emit stats failure as a structured `status: 'error'` envelope with the original error message in `message`. Operators retain full diagnostic detail. |
| Risk | Cross-handler vocabulary diverges over time. | Medium | The new parity test (REQ-008) makes divergence a CI failure. Future handler changes that drop a canonical field will break this test. |
| Dependency | 011-post-stress-followup-research/review/review-report.md | Internal — Closed | Source of truth (§3, §4, §7 Packet A). |
| Dependency | `014-graph-status-readiness-snapshot` (snapshot helper) | Internal — Closed | Read-only contract is the foundation for F-003. |
| Dependency | `015-cocoindex-seed-telemetry-passthrough` | Internal — Closed | Cocoindex telemetry tests must stay green; we don't touch that path. |
| Dependency | `005-code-graph-fast-fail` | Internal — Closed (related) | Same readiness vocabulary; no overlap in scope. |
| Dependency | `013-graph-degraded-stress-cell` | Internal — Closed (related) | Stress cell that this remediation closes. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(All resolved before implementation; see `decision-record.md` and `_memory.continuity.answered_questions`.)

- ~~Q-VOC: should crash recovery use `nextTool: 'rg'` or `action: 'rg_fallback'` or both?~~ — RESOLVED in ADR-001: `nextTool: 'rg'` (matches `code_graph_query.buildFallbackDecision()`); top-level `requiredAction: 'rg'` mirrors the existing `requiredAction: 'code_graph_scan'` field shape so both paths feel symmetric.
- ~~Q-ORDER: snapshot-first OR isolate-stats? Pick one.~~ — RESOLVED in ADR-002: BOTH (defense in depth). Snapshot moves above stats so even the synchronous fast-fail path benefits; stats remains in try/catch so post-stats throws still preserve the snapshot.
- ~~Q-TEST: extend the existing context cocoindex test or create a new file?~~ — RESOLVED: new file (`code-graph-degraded-readiness-envelope-parity.vitest.ts`). The cocoindex file's mock surface and test theme are different; co-locating the F-001/F-003/F-008 evidence in one packet-named file makes the contract greppable from the spec folder.
<!-- /ANCHOR:questions -->

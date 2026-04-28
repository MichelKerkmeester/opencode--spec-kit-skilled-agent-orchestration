---
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
title: "Decision Record: Degraded-readiness envelope parity [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity/decision-record]"
description: "ADR-001 (shared vocabulary vs handler-local payload split) + ADR-002 (snapshot-first AND isolate-stats: defense in depth) for Packet 016. Closes review-report.md F-006 and F-008 doc parts."
trigger_phrases:
  - "degraded readiness envelope parity decisions"
  - "016 decision record"
  - "shared vs handler-local readiness vocabulary"
  - "snapshot-first defense-in-depth"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/016-degraded-readiness-envelope-parity"
    last_updated_at: "2026-04-27T22:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored ADR-001 + ADR-002"
    next_safe_action: "Run validate.sh --strict"
    blockers: []
    key_files: ["decision-record.md"]
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Degraded-readiness envelope parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Shared degraded-readiness vocabulary, handler-local payload fields

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-27 |
| **Deciders** | claude-opus-4-7 (under user-directed remediation of CONDITIONAL deep-review) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The 012-015 deep-review surfaced F-006 and F-008: the three code-graph handlers (`code_graph_context`, `code_graph_status`, `code_graph_query`) were drifting on degraded-readiness behavior. `code_graph_query` already shipped a canonical envelope on crash (`fallbackDecision: { nextTool: 'rg', reason }` + `canonicalReadiness` + `trustState` + `graphAnswersOmitted: true`); the other two handlers either fell through to a generic error envelope (context, F-001) or lost the readiness snapshot entirely (status, F-003).

We needed to choose between (a) forcing one shared response shape across all three handlers (uniform), (b) keeping handler-local shapes and just synchronizing the canonical readiness fields (split), or (c) introducing a new union type at the readiness contract layer.

### Constraints

- `code_graph_context` payloads carry `queryMode`, `subject`, `anchors`, `graphContext`, `textBrief` — none of these belong on a status response.
- `code_graph_status` payloads carry `totalNodes`, `edgesByType`, `goldVerificationTrust` — none of these belong on a context response.
- `code_graph_query` payloads carry `operation`, `direction`, edge-walk fields — none belong elsewhere.
- The readiness vocabulary already exists in `readiness-contract.ts:73-87, 109-123, 241-248` and is canonical: `canonicalReadinessFromFreshness`, `queryTrustStateFromFreshness`, `buildReadinessBlock`. F-009 noted only the test fixtures lagged the helper.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Option (b) — shared canonical readiness vocabulary, handler-local wrapping payloads.

**How it works**: Every degraded envelope emitted by any of the three handlers MUST include the SAME five canonical fields:
1. `data.readiness` (the raw `ReadyResult` block — `freshness`, `action`, `reason`, `inlineIndexPerformed`)
2. `data.canonicalReadiness` (the `StructuralReadiness` projection — `ready | stale | missing`)
3. `data.trustState` (the `SharedPayloadTrustState` projection — `live | stale | absent | unavailable`)
4. `data.graphAnswersOmitted: true`
5. `data.fallbackDecision: { nextTool, reason }` — `nextTool: 'rg'` for crash, `nextTool: 'code_graph_scan'` for full_scan_required

The wrapping payload (`queryMode` for context, `totalNodes` for status, `operation` for query) stays handler-local. Cross-handler parity is enforced by `tests/code-graph-degraded-readiness-envelope-parity.vitest.ts` Cross-handler describe block.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **(b) Shared vocabulary, handler-local payloads (CHOSEN)** | Each handler keeps its tool-specific payload semantics; canonical fields are tested at a single contract layer; reuses existing `buildReadinessBlock` projection | Requires explicit cross-handler test to prevent vocabulary drift | 9/10 |
| (a) Force one shared envelope type across all handlers | Maximum uniformity | Forces query-only fields onto status responses (or empty placeholders); breaks existing callers that key off handler-specific fields; large refactor | 4/10 |
| (c) New union type at the readiness contract layer | Explicit type-level guarantee | Over-engineering — `readiness-contract.ts` already exposes the canonical projection helpers; adding a wrapper union solves no concrete problem | 5/10 |

**Why this one**: Reuses primitives that already exist (`canonicalReadinessFromFreshness`, `queryTrustStateFromFreshness`, `buildReadinessBlock`, the query handler's `buildFallbackDecision` shape). The minimal surface change keeps the patch small while making vocabulary parity testable from a single new file. Crucially, the alternatives we rejected (a, c) would have BROKEN existing callers or added unnecessary type machinery — option (b) is the path of least surface change.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Operators see ONE consistent degraded envelope across all three handlers; recovery routing (`rg`) is the same regardless of which tool errored first.
- Cross-handler vocabulary drift is now a CI failure (the parity test breaks).
- Future handlers (e.g. a fourth code-graph tool) inherit the canonical vocabulary by importing `buildReadinessBlock` and matching the parity test's expectations.

**What it costs**:
- The parity test has to be kept in sync if a new canonical field is added — mitigation: any field added to `buildReadinessBlock` is automatically present on all callers (the projection helper centralizes this).
- Handler authors must remember the wrapping payload is local but the readiness fields are shared — mitigation: inline comments in each handler reference packet 016 / decision-record.md ADR-001.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A new handler ships its own crash envelope and forgets the canonical fields | Medium | Cross-handler parity test would catch context/status drift; new handlers should be added to the parity test as part of their Definition of Done |
| `buildReadinessBlock` API changes break the parity contract silently | Low | Existing `tests/readiness-contract.vitest.ts` pins the helper API; ADR-001 here documents the parity expectation |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | F-006/F-008 + F-001/F-003 are documented integration gaps; review-report.md §3-4 + §7 Packet A demands remediation |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives explored explicitly above (uniform / split / union-type); split scored highest |
| 3 | **Sufficient?** | PASS | Reuses `buildReadinessBlock` and mirrors `query.ts:buildFallbackDecision` — no new abstraction layer |
| 4 | **Fits Goal?** | PASS | Directly closes review-report.md §7 Packet A PASS gate |
| 5 | **Open Horizons?** | PASS | New handlers can plug into the same parity test; vocabulary stays canonical at the contract layer |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `code_graph/handlers/context.ts`: `shouldBlockReadPath()` now also blocks on `freshness === 'error'`; new `buildContextFallbackDecision()` helper mirrors the query handler's shape; blocked-envelope branch differentiates crash vs full_scan_required.
- `code_graph/handlers/status.ts`: snapshot moves ahead of stats; stats wrapped in try/catch; degraded envelope on stats failure preserves snapshot + emits `fallbackDecision: { nextTool: 'rg', reason: 'stats_unavailable' }`; post-stats catch path also preserves snapshot.
- `tests/code-graph-degraded-readiness-envelope-parity.vitest.ts` (new): cross-handler parity sweep enforces ADR-001 at CI time.

**How to roll back**:
1. Revert the two handler files.
2. Delete the new parity test file.
3. Revert the four new assertions in `tests/readiness-contract.vitest.ts`.
4. The healthy paths in both handlers are unaffected — no schema change to roll back.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Snapshot-first AND isolate-stats — defense in depth in `code_graph_status`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-27 |
| **Deciders** | claude-opus-4-7 |

---

<!-- ANCHOR:adr-002-context -->
### Context

review-report.md §3 F-003 offered two remediation paths for the status-handler ordering bug:
- **Approach 1**: move `getGraphReadinessSnapshot()` ahead of `graphDb.getStats()` so the snapshot is captured before stats can throw.
- **Approach 2**: isolate `graphDb.getStats()` into a try/catch so an unavailable DB doesn't suppress the readiness response.

Both approaches close the F-003 PASS gate on their own. We had to decide whether to ship one, the other, or both.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: BOTH (defense in depth).

**How it works**:
- `getGraphReadinessSnapshot(process.cwd())` runs as the very first statement in `handleCodeGraphStatus()`. It is a packet-014-certified read-only helper (Test E pins this) so the move costs nothing.
- `graphDb.getStats()` runs inside a try/catch. On failure the handler short-circuits to a structured `status: 'error'` payload that retains the snapshot, the canonical projections, and a `fallbackDecision: { nextTool: 'rg', reason: 'stats_unavailable' }`.
- The post-stats catch (drift summary / verification trust calculation) also preserves the snapshot — so even an exotic crash AFTER stats but BEFORE response assembly leaves the operator with action-level readiness instead of a generic init error.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **(BOTH) snapshot-first AND isolate-stats (CHOSEN)** | Closes the F-003 gap whether stats throw before, during, or after the snapshot path; cheapest patch | Two changes instead of one | 9/10 |
| (1) Snapshot-first only | Single-line change | Stats failure later in the post-snapshot path could still bury the readiness | 7/10 |
| (2) Isolate-stats only | Single try/catch | If stats happens to succeed but a downstream call (`getLastGoldVerification`, `buildEdgeDriftSummary`) throws, the catch path STILL re-derives readiness from snapshot — but only because we wired it up. Without snapshot-first, the handler still has to call snapshot inside the catch, recomputing it | 7/10 |

**Why this one**: The snapshot is read-only and cheap; calling it once at the top of the handler is strictly cheaper and clearer than recomputing it in two catch paths. The combined change is two lines + one wrapper, with both halves testable independently (F-003 #1 and F-003 #2 in the new parity vitest).
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- DB unavailability (`getStats()` throws) → snapshot preserved.
- Snapshot probe AND stats both crash → snapshot preserved as `freshness: 'error'`, `trustState: 'unavailable'` (the canonical "unreachable scope" projection).
- Post-stats verification trust calculation throws → snapshot preserved.

**What it costs**:
- Slight code-size increase (one new try/catch wrapper, one ordering change). Mitigation: net effect is fewer LOC because the prior bare `try { everything } catch { generic-error }` collapses into a more precise three-zone handler.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Snapshot helper itself crashes (despite read-only contract) | Low | Helper already returns `freshness: 'error', action: 'none'` on crash per packet 014 — never throws |
| `buildReadinessBlock` throws on a synthetic readiness object | Low | Helper is pure projection over a discriminated union; vitest fixtures pin `error` → `missing/unavailable` |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | F-003 demands both ordering fix AND isolation; either alone leaves a gap |
| 2 | **Beyond Local Maxima?** | PASS | Single-fix options explicitly considered and rejected as insufficient |
| 3 | **Sufficient?** | PASS | Two narrow changes; zero new abstractions |
| 4 | **Fits Goal?** | PASS | Closes review-report.md §7 Packet A's F-003 PASS gate |
| 5 | **Open Horizons?** | PASS | Pattern reusable: any handler reading from a possibly-unavailable DB should snapshot read-only state first then isolate the DB call |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `code_graph/handlers/status.ts:160-212`: snapshot moves ahead of stats; stats wrapped in try/catch; on failure, short-circuit to a structured `status: 'error'` payload with snapshot-derived readiness + `fallbackDecision`.
- `code_graph/handlers/status.ts:284-318`: post-stats catch path now preserves the snapshot via `buildReadinessBlock(...)` and emits `fallbackDecision: { nextTool: 'rg', reason: 'status_path_failed' }` instead of returning `error: 'Code graph not initialized: ...'`.

**How to roll back**: revert `status.ts` only — the rest of Packet 016's changes (context.ts, tests, decision record) are independent and stay.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!--
Level 2 Decision Record: ADRs for the F-006 / F-008 docs scope of Packet 016.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->

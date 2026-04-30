---
title: "Review Report: Memory Data Integrity Release-Readiness Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: review-report | v2.2"
description: "Deep-review angle 2 for memory subsystem data integrity: DB consistency, FTS/vector sync, retention sweep correctness, race-condition resilience, governance enforcement, and health reporting."
trigger_phrases:
  - "045-002-memory-data-integrity"
  - "memory data integrity"
  - "DB consistency audit"
  - "retention sweep correctness"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/002-memory-data-integrity"
    last_updated_at: "2026-04-29T23:10:00+02:00"
    last_updated_by: "codex"
    recent_action: "Completed memory data integrity review report"
    next_safe_action: "Remediate P1 findings before claiming memory subsystem release readiness"
    blockers:
      - "P1-001 memory_health can overstate DB consistency"
      - "P1-002 retention/save race coverage is not a true concurrent-writer test"
      - "P1-003 embedding cache invalidation is undefined for governed retention deletes"
    key_files:
      - "review-report.md"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts"
    session_dedup:
      fingerprint: "sha256:045-002-memory-data-integrity-report"
      session_id: "045-002-memory-data-integrity"
      parent_session_id: "045-release-readiness-deep-review-program"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Retention sweep removes FTS and vector entries for primary SQLite-backed indexes."
      - "Existing tests do not prove true concurrent memory_save versus retention_sweep behavior."
---
# Review Report: Memory Data Integrity Release-Readiness Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: review-report | v2.2 -->

---

## 1. Executive Summary

**Verdict: CONDITIONAL.** I found no P0 evidence that retention sweep directly corrupts `memory_index`, SQLite FTS, or `vec_memories`: the sweep calls the shared delete path, that path deletes vector/projection/causal rows inside a transaction, and FTS is trigger-backed. The release-readiness gap is observability and edge-contract confidence: `memory_health` can still report `healthy` without a complete consistency verdict, the save/sweep concurrency fixture is not a true multi-writer test, governed retention does not define embedding-cache invalidation, and BM25 cleanup is best-effort.

| Severity | Count | Release Impact |
|----------|-------|----------------|
| P0 | 0 | No direct data-loss/corruption blocker found in the audited primary DB/FTS/vector delete paths. |
| P1 | 3 | Must remediate or explicitly defer before claiming release-ready integrity. |
| P2 | 1 | Derived-index cleanup and health visibility hardening. |

---

## 2. Planning Trigger

User requested Packet `045/002: memory-data-integrity`, a read-only deep-review audit for release-readiness angle 2. Required output is this `review-report.md` with severity-classified P0/P1/P2 findings under `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/002-memory-data-integrity/`.

Audit dimensions:

- Correctness: save -> DB row -> FTS -> vector sync, partial failure, retention deletion, race resilience.
- Security: provenance, actor/source/tenant governance, SQL injection, transaction boundaries, tenant isolation.
- Traceability: retention deletion audit trail, causal graph inference observability, DB lineage.
- Maintainability: migration rollback behavior, transaction discipline, error-path rollback.

---

## 3. Active Finding Registry

### P1-001: `memory_health` can report `healthy` while DB/index consistency is degraded or unmeasured

**Impact:** Operators can use `memory_health` as a release gate and get a healthy status even when FTS/vector consistency has not been fully checked. That is a release-readiness contract drift, not a direct corruption bug.

**Evidence:**

- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:379` sets `status` to `healthy` when a database handle exists.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:381` summarizes the system as healthy on DB connectivity.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:450` through `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:459` detects FTS count mismatch but only appends repair hints.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:516` through `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:550` runs deeper `verifyIntegrity` only inside the `autoRepair` branch.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:565` through `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:588` returns no structured `consistency` verdict for FTS/vector/BM25/cache state.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1285` through `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1418` has a richer integrity checker, but it is not exposed as the default health verdict.

**Fix:** Always run read-only integrity checks for FTS row count, vector orphan/missing rows, orphan chunks/files, and derived-index visibility in `memory_health`. Return a structured `consistency` object and downgrade top-level status to `degraded` when any check fails. Keep mutation-based repair behind `autoRepair`.

---

### P1-002: Retention/save race coverage is not a true concurrent-writer test

**Impact:** The implementation likely avoids deleting new non-expired rows because the sweep snapshots expired candidates before deletion, but release readiness depends on real concurrent write evidence. The current fixture is single-connection and synchronous, so it does not prove multi-process or multi-connection behavior for `memory_save` versus `memory_retention_sweep`.

**Evidence:**

- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:132` selects candidates before the deletion transaction.
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:152` through `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:196` deletes each candidate in one transaction and writes history/audit/ledger records.
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:180` through `.opencode/skill/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:193` claims interleaving coverage, but both operations use `Promise.resolve().then(...)` over the same synchronous `better-sqlite3` connection.
- `specs/system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep/checklist.md:68` records interleaving coverage as complete, which now overstates the fixture's concurrency strength.

**Fix:** Add a file-backed SQLite fixture with two independent DB handles and explicit barriers. Start a sweep after candidate selection, run `memory_save` or equivalent insert from another handle, then release deletion and assert `memory_index`, `memory_fts`, `vec_memories`, active projections, causal refs, governance audit rows, and health consistency. Include a second case where a row becomes expired during the sweep and must be handled by the next sweep, not the current candidate set.

---

### P1-003: Governed retention deletes do not define or enforce embedding-cache invalidation

**Impact:** Primary memory rows, FTS, and vector rows are deleted, but cached embeddings can survive governed retention deletion. If `retention_policy=ephemeral` is meant to remove derived semantic artifacts, the current behavior violates that contract; if the cache is intentionally content-addressed and reusable, the contract needs to say so and health/reporting needs to expose it.

**Evidence:**

- `.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:45` through `.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:56` stores embeddings by `content_hash`, `model_id`, and `dimensions`, not memory id.
- `.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:72` through `.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:149` supports lookup/store, but not delete-by-memory or delete-by-content-hash for retention.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2196` generates or reuses an embedding before the DB write transaction.
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2276` persists pending embedding-cache writes before governance gating and before the primary memory insert transaction.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:590` through `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:632` deletes vector rows, ancillary rows, and `memory_index`, but does not touch `embedding_cache`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:38` through `.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts:260` covers cache store/lookup/eviction/clear, but not retention deletion invalidation.

**Fix:** Decide the product contract. For governed ephemeral data, delete cache rows by content hash/model/dimensions during retention deletion and rollback if that deletion fails. If cache reuse is intentional, document that retained embeddings are non-row-bound derived cache entries, add a bounded TTL, and expose cache retention state in health.

---

### P2-001: BM25 deletion is best-effort, and unscoped BM25 search can surface stale deleted IDs

**Impact:** This is a derived in-memory index, not the primary DB or vector store, so it is not a P0. Still, if BM25 removal fails or a warmup/rebuild races with deletion, unscoped search can include stale IDs without DB existence hydration.

**Evidence:**

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:621` through `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:630` removes BM25 documents after the DB transaction and swallows cleanup failures.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:357` through `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:382` resolves BM25 IDs against the DB only when a `specFolder` filter is present.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:385` through `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:396` allows all BM25 results through when no `specFolder` is provided.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1131` through `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1138` includes BM25 results in the search pipeline.

**Fix:** Hydrate/filter BM25 results through `memory_index` for all searches, not only scoped searches. Add a `memory_health` BM25 consistency metric and a rebuild action for missing/deleted-row drift.

---

## 4. Remediation Workstreams

| Workstream | Findings | Proposed Owner | Exit Criteria |
|------------|----------|----------------|---------------|
| Health consistency contract | P1-001, P2-001 | Memory subsystem | `memory_health` returns structured consistency status and downgrades degraded indexes. |
| Retention concurrency proof | P1-002 | Memory tests | Multi-connection save/sweep fixtures pass and cover FTS/vector/audit/health invariants. |
| Governed derived-cache policy | P1-003 | Governance + memory subsystem | Contract is implemented or documented; tests cover retention deletion and cache state. |
| BM25 derived-index hardening | P2-001 | Search subsystem | BM25 results are DB-hydrated fail-closed and health can detect/rebuild drift. |

---

## 5. Spec Seed

Recommended remediation packet scope:

- Make `memory_health` a truthful release gate for DB consistency.
- Add true concurrent write/sweep tests with independent SQLite handles.
- Define retention semantics for embedding cache and implement the chosen behavior.
- Treat BM25 as a derived index that must fail closed against missing DB rows.

Non-goals:

- Rewriting the memory subsystem.
- Replacing trigger-backed FTS or sqlite-vec.
- Changing governance policy names unless required by the cache-retention contract.

---

## 6. Plan Seed

1. Patch `memory_health` to collect read-only consistency metrics unconditionally.
2. Add a `consistency.status` field with `healthy`, `degraded`, and `unknown` states.
3. Add multi-connection retention/save race fixtures and run them against a file-backed DB.
4. Add retention deletion tests for embedding cache behavior.
5. Hydrate BM25 results against `memory_index` for unscoped search.
6. Run targeted memory tests, then strict packet validation in the remediation packet.

---

## 7. Traceability Status

| Question | Answer | Evidence |
|----------|--------|----------|
| Does `memory_retention_sweep` correctly remove FTS + vector entries for deleted rows? | **Mostly yes for primary SQLite indexes.** Sweep calls shared delete; shared delete removes `vec_memories` and `memory_index`; FTS delete triggers remove `memory_fts`. BM25 remains best-effort, covered as P2-001. | `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:154`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:597`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:613`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2468`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts:137` |
| Are there race conditions between `memory_save` and `memory_retention_sweep`? | **Unproven.** Source shape is reasonable, but tests do not exercise true concurrent writers. | P1-002 |
| Does the embedding cache invalidate correctly when a row is deleted? | **No defined invalidation.** Cache is content-hash keyed and delete paths do not remove cache entries. Whether this is a bug depends on the governed-retention contract; release readiness needs that contract. | P1-003 |
| What happens if `memory_save` partially succeeds? | Primary DB/index writes are transaction-backed, and governance post-insert failure calls the shared delete path. The remaining partial-state risk is pre-transaction embedding-cache persistence. | `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:259`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2276`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:3112` |
| Does `memory_health` accurately report DB consistency state? | **No.** It reports connectivity health by default and only exposes parts of consistency through hints or `autoRepair`. | P1-001 |
| SQL injection paths? | No active SQL injection finding found in reviewed dynamic paths. Bulk delete builds fixed SQL fragments with bound params; governance audit uses parameterized insert; post-insert metadata uses an allowed column map. | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:115`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:183`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:352`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:57` |
| Tenant/governance isolation? | No active tenant isolation finding found in reviewed paths. Governed ingest requires tenant/session/provenance actor/source when governance is triggered, and search filters by tenant/user/agent when scope is provided. Session-only is explicitly not treated as a governance boundary. | `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:241`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:283`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1050`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1065` |
| Retention deletion audit trail? | Present for swept rows: retention sweep records delete history, governance audit, and ledger entries in the deletion transaction. | `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:161`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:174`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:193` |

---

## 8. Deferred Items

- P2 BM25 hardening can be remediated after P1 health/concurrency/cache contract work, provided release notes call BM25 a derived best-effort lane until fixed.
- Full migration rollback review was not escalated to an active finding. Migrations are transaction-wrapped, but some historical rebuild steps log warnings. Revisit only if a migration-specific release gate is added.
- Causal graph link inference was not elevated to an active finding in this packet; retention deletion removes causal graph references through ancillary cleanup, and deeper inference observability belongs in the graph-specific release-readiness angle.

---

## 9. Audit Appendix

### Primary Evidence Read

- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/`
- `.opencode/skill/system-spec-kit/mcp_server/lib/memory/`
- `.opencode/skill/system-spec-kit/mcp_server/db/`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-retention-sweep.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts`
- `specs/system-spec-kit/026-graph-and-context-optimization/033-memory-retention-sweep/`

### Positive Controls

- Retention sweep uses the shared `vectorIndex.deleteMemory(candidate.id, database)` path, not an ad hoc partial delete.
- Shared delete removes vector rows before deleting the primary `memory_index` row in one transaction.
- FTS is trigger-backed on `memory_index` insert/update/delete.
- Governance retention sweep records delete history, governance audit, and ledger entries.
- SQL construction in reviewed governance and bulk-delete paths uses fixed fragments or bound parameters.

### Release Gate Recommendation

Do not mark memory data integrity release-ready until P1-001, P1-002, and P1-003 are either fixed or explicitly accepted with release notes. P2-001 can be deferred if BM25 remains documented as derived best-effort and primary DB/FTS/vector results are used as the authoritative consistency basis.

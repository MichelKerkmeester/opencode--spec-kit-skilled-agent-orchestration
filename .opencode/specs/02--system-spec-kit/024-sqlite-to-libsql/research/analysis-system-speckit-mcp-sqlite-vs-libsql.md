# Analysis: System Spec Kit MCP SQLite vs libSQL/Turso

Index: Companion recommendation document at [`.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/research/recommendation-sqlite-vs-libsql-decision.md`](<.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/research/recommendation-sqlite-vs-libsql-decision.md>).

## 1) Executive Summary (Dated Context)

Source validation date: **February 21, 2026**.

This analysis concludes that the current System Spec Kit MCP server should **remain on local SQLite now** and should not move directly to Turso/libSQL runtime in a single step.

Why this conclusion is evidence-based:

- The active runtime is tightly coupled to `better-sqlite3` process-local DB handles, SQLite PRAGMAs, and filesystem-level assumptions for DB path, permissions, and file-backed content reads. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:15`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:284`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1184`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1197`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2517`)
- Search is implemented with SQLite-specific virtual tables and SQL: `fts5` triggers and `sqlite-vec` (`vec0`, `vec_distance_cosine`). (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1602`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1622`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2118`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:90`)
- Operational controls (checkpoint/restore, bulk delete, schema downgrade, startup wiring) are designed around in-process direct SQL transactions and local DB reinitialization. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:313`, `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:141`, `.opencode/skill/system-spec-kit/mcp_server/cli.ts:82`, `.opencode/skill/system-spec-kit/mcp_server/cli.ts:298`)
- Current package dependencies are SQLite-native (`better-sqlite3`, `sqlite-vec`) and do not include a Turso/libSQL client dependency. (Local: `.opencode/skill/system-spec-kit/mcp_server/package.json:36`, `.opencode/skill/system-spec-kit/mcp_server/package.json:37`)

libSQL/Turso is still strategically relevant because:

- libSQL preserves SQLite file compatibility and embeddability goals. (Local libSQL clone: `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/README.md:126`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/README.md:128`)
- Turso/libSQL provides remote protocol options, durability controls, and replica/sync features that can become important at scale.

However, protocol and consistency semantics differ materially from the current local runtime:

- HTTP v2 uses baton-based stream continuity and explicit request serialization.
- Replica visibility is not globally ordered across all processes/instances.

(Local libSQL clone: `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:14`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:17`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:13`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:17`)

Bottom line: **schema/data portability is partially favorable; runtime portability is not yet ready without an adapter-first redesign.**

## 2) Current-State Architecture Map

### 2.1 Runtime topology

```text
MCP Client
  -> context-server (stdio transport)
     -> tool dispatch
        -> vector-index (SQLite + sqlite-vec + FTS5)
        -> checkpoints (gzip snapshot + restore transaction)
        -> hybrid search / BM25 / cognitive modules
        -> db-state reinitialize logic

CLI (spec-kit-cli)
  -> same vector-index/checkpoint/db-state stack
  -> stats, bulk-delete, reindex, schema-downgrade
```

Evidence:

- MCP transport is stdio-based, not remote DB protocol-native. (Local: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:17`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:677`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:679`)
- Context server startup initializes local DB and module handles directly. (Local: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:450`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:565`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:571`)
- CLI uses the same local vector index and checkpoint modules. (Local: `.opencode/skill/system-spec-kit/mcp_server/cli.ts:17`, `.opencode/skill/system-spec-kit/mcp_server/cli.ts:18`, `.opencode/skill/system-spec-kit/mcp_server/cli.ts:82`)

### 2.2 Storage and schema mechanics

- DB path resolution prioritizes local env vars and local filesystem DB path. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:285`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:289`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:292`)
- The DB is opened through `better-sqlite3`, then PRAGMAs are set (`journal_mode=WAL`, busy timeout, mmap, synchronous, temp store). (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1152`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1184`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1190`)
- Core schema includes `memory_index`, `memory_fts` (fts5), optional `vec_memories` (`vec0`) and companion tables (`checkpoints`, `memory_history`, `memory_conflicts`). (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1549`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1602`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1622`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1490`)

### 2.3 Search architecture

- Vector search uses `vec_distance_cosine` and joins `memory_index` with `vec_memories`. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2118`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2121`)
- If `sqlite-vec` fails to load, runtime falls back to keyword-only behavior. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1178`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1180`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2510`)
- FTS5 BM25 search is explicitly SQLite FTS5-specific SQL. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:51`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:90`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:126`)

## 3) SQLite Coupling Inventory with Severity

### 3.1 Hard blockers (must redesign before direct Turso/libSQL runtime switch)

| Coupling point | Why hard | Evidence |
|---|---|---|
| `better-sqlite3` direct sync handle and statement model | Codebase assumes synchronous in-process API behavior and direct transaction wrappers | Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:15`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1742`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:313` |
| SQLite-vector SQL dialect (`vec0`, `vec_distance_cosine`) | Current SQL uses sqlite-vec table/function semantics not guaranteed identical to Turso native vector APIs | Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1602`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2118`; Web: `https://docs.turso.tech/features/ai-and-embeddings`, `https://docs.turso.tech/features/sqlite-extensions` |
| Runtime PRAGMA and file-level assumptions | System configures local SQLite pragmas and chmods DB file permissions | Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1184`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1197` |
| Checkpoint restore transaction semantics tied to direct table writes | Restore path assumes local atomic delete/insert transaction and optional vec table purge | Local: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:313`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:316`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:317` |
| No runtime backend selector/token/endpoint contract today | Startup and CLI open local DB directly; package does not ship libSQL/Turso client dependency | Local: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:450`, `.opencode/skill/system-spec-kit/mcp_server/cli.ts:82`, `.opencode/skill/system-spec-kit/mcp_server/package.json:33`, `.opencode/skill/system-spec-kit/mcp_server/package.json:36` |

### 3.2 Medium blockers (adapter + operational changes required)

| Coupling point | Why medium | Evidence |
|---|---|---|
| FTS5 trigger and virtual table lifecycle | FTS exists in Turso, but trigger/table bootstrap and migration behavior must be revalidated under remote/replica modes | Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1622`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1630`; Web: `https://docs.turso.tech/features/sqlite-extensions` |
| DB reinitialization via local updated-file signaling | Current stale-handle refresh relies on local file notification and direct handle reinit | Local: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:101`, `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:141` |
| CLI safety workflows tied to local checkpoints | Bulk-delete and restore procedures assume local checkpoint + immediate transaction execution | Local: `.opencode/skill/system-spec-kit/mcp_server/cli.ts:256`, `.opencode/skill/system-spec-kit/mcp_server/cli.ts:298`, `.opencode/skill/system-spec-kit/mcp_server/cli.ts:338` |

### 3.3 Soft blockers (mostly configuration and testing effort)

| Coupling point | Why soft | Evidence |
|---|---|---|
| Schema version migration framework | Migration framework is robust/transactional and can carry forward with adapter compatibility tests | Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1091`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1123` |
| Fallback keyword path when vectors unavailable | Existing graceful degradation path can help phased rollout testing | Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1178`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2510` |

## 4) Compatibility Matrix (Current Feature vs Turso/libSQL vs Migration Effort)

| Current capability | Current implementation evidence | Turso/libSQL support posture | Migration effort |
|---|---|---|---|
| SQLite file compatibility | Local DB file model in runtime | libSQL states SQLite file compatibility commitment | Low for raw data file transfer; higher for runtime behavior. (Local libSQL clone: `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/README.md:126`) |
| Embedded/local operation | In-process local DB | libSQL states embeddable mode remains | Medium (adapter + env contracts). (Local libSQL clone: `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/README.md:128`) |
| Vector similarity search | `sqlite-vec` (`vec0`, `vec_distance_cosine`) | Turso provides native vector support; sqlite-vec availability depends on extension model/plan | High (query/schema adaptation + parity tests). (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1602`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2118`; Web: `https://docs.turso.tech/features/ai-and-embeddings`, `https://docs.turso.tech/features/sqlite-extensions`) |
| Full-text search | FTS5 virtual table + BM25 SQL | FTS5 is listed as preloaded | Medium (semantic parity and ranking drift validation). (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:90`; Web: `https://docs.turso.tech/features/sqlite-extensions`) |
| Atomic migrations | Transaction-wrapped migrations | Supported conceptually, but remote stream behavior must be explicitly handled | Medium-High for remote protocol paths. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1093`) |
| Checkpoint/restore | JSON+gzip snapshot plus restore transaction | Could be retained as app-level feature, but must revalidate with remote consistency/latency | Medium-High. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:177`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:313`) |
| Operational CLI | Direct local SQL + safety checkpoints | Requires auth/token/network handling in remote modes | High if CLI must manage remote safely. (Local: `.opencode/skill/system-spec-kit/mcp_server/cli.ts:82`, `.opencode/skill/system-spec-kit/mcp_server/cli.ts:262`) |
| Consistency assumptions | Local single-process style visibility | Replica model includes process read-your-writes and monotonic reads, but no global ordering guarantee | High for multi-process correctness-sensitive flows. (Local libSQL clone: `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:13`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:17`) |

## 5) Protocol and Consistency Implications

### 5.1 Baton semantics and stream serialization

If remote HTTP v2 is used, request sequencing rules become explicit:

- Requests on the same stream are chained by baton.
- Client must serialize requests and wait for prior response.
- Stream can close after idle; baton may become null; HTTP errors invalidate stream.

(Local libSQL clone: `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:14`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:17`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:24`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:73`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:94`)

Implication for this codebase:

- Existing local transaction closures and in-process statements do not model baton lifecycle errors/retries explicitly.
- Any remote adapter must track baton, stream invalidation, and idempotent retry behavior.

### 5.2 Replica visibility model

libSQL/sqld consistency docs indicate:

- Primary operations are linearizable.
- Process/connection sees its own writes.
- Distinct processes on replica can see different points in time.
- No global ordering guarantees across instances.

(Local libSQL clone: `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:13`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:15`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:17`)

Implication for this codebase:

- Features that currently assume immediate same-process local visibility are safe locally.
- Multi-process operations (CLI + server concurrently, or multiple workers) need explicit consistency-mode aware validation before hybrid/remote rollout.

### 5.3 Stateless HTTP batch caveat

The older stateless SQL HTTP API notes no interactive transactions and forbids explicit transaction statements in request batches.

(Local libSQL clone: `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/http_api.md:47`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/http_api.md:49`)

Implication:

- If any fallback path uses stateless endpoints, checkpoint/restore semantics must avoid assumptions about long-lived interactive transaction sessions.

## 6) Operational Impact

### 6.1 Local file assumptions

- DB location and directory permissions are process-local and filesystem-managed. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:285`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1146`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1148`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1197`)
- Search enrichment reads source files directly from local paths. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2517`)

Operational effect if migrating:

- Need explicit strategy for local file content availability and path validity when DB backend is remote/hybrid.

### 6.2 PRAGMA assumptions

Current runtime sets:

- `journal_mode=WAL`
- `busy_timeout=10000`
- `foreign_keys=ON`
- cache/mmap/synchronous/temp_store pragmas

(Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1184`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1185`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1186`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1189`)

Operational effect if migrating:

- Remote managed services may not expose equivalent runtime tuning knobs per connection in the same way; performance behavior needs re-baselining.

### 6.3 Checkpoint semantics

- Checkpoints are app-level snapshots of `memory_index` plus optional `working_memory`, gzipped JSON in table `checkpoints`, max 10 retained. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:20`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:157`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:171`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:195`)
- Restore is transaction-guarded with rollback safety on clear-existing mode. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:308`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:451`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:460`)

Operational effect if migrating:

- App-level checkpoint guarantees can still exist, but must be validated under remote latency, replica lag, and stream errors.

### 6.4 CLI workflows

- CLI `stats`, `bulk-delete`, `reindex`, `schema-downgrade` assume direct DB access. (Local: `.opencode/skill/system-spec-kit/mcp_server/cli.ts:51`, `.opencode/skill/system-spec-kit/mcp_server/cli.ts:82`, `.opencode/skill/system-spec-kit/mcp_server/cli.ts:349`, `.opencode/skill/system-spec-kit/mcp_server/cli.ts:410`)
- Bulk-delete safety policy relies on local checkpoint creation and transaction execution. (Local: `.opencode/skill/system-spec-kit/mcp_server/cli.ts:256`, `.opencode/skill/system-spec-kit/mcp_server/cli.ts:262`, `.opencode/skill/system-spec-kit/mcp_server/cli.ts:298`)

Operational effect if migrating:

- CLI must become backend-aware and explicit about remote/auth failure modes before production use.

## 7) Risk Register

Scale: Probability (P), Impact (I), Detectability (D) each scored 1-5. Higher D means harder to detect early.

| ID | Risk | P | I | D | Mitigation |
|---|---|---:|---:|---:|---|
| R1 | Vector query incompatibility (`sqlite-vec` SQL vs native Turso vector APIs) | 4 | 5 | 3 | Introduce search capability profile and dual-path query planner; enforce parity tests before cutover. |
| R2 | Consistency drift in hybrid/replica reads (cross-process visibility assumptions) | 3 | 5 | 4 | Add consistency-mode contract; gate sensitive reads to primary until monotonic/RYW behavior validated. |
| R3 | Remote protocol stream failure (baton invalidation, idle closure) causing write/read disruption | 3 | 4 | 3 | Build robust stream state machine, timeout policy, idempotent retry keys, and structured telemetry. |
| R4 | Operational regressions in checkpoint/restore on remote backend | 2 | 5 | 2 | Preserve local checkpoint path initially; add remote restore drills with automatic rollback. |
| R5 | Cost surprise from usage quotas/overages | 3 | 4 | 2 | Add budget guardrails, query volume dashboards, and monthly forecast checks against live pricing. |
| R6 | Native module/local runtime mismatch in current architecture remains an operational pain point | 2 | 3 | 1 | Keep rebuild checks and startup validation; not a migration blocker but baseline maintenance item. |

Evidence examples:

- Vector coupling: Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1602`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2118`; Web: `https://docs.turso.tech/features/ai-and-embeddings`
- Baton/stream lifecycle: Local libSQL clone: `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:14`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:24`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:94`
- Usage blocking: Web: `https://docs.turso.tech/help/usage-and-billing`

## 8) Cost, Latency, and Durability Caveats (Date-Sensitive)

Validated on **February 21, 2026**. Treat these as time-sensitive and re-check before any purchase or cutover.

### 8.1 Cost caveats

- Turso pricing and quotas are plan-dependent and may differ by monthly/yearly billing frequency. (Web: `https://turso.tech/pricing`)
- Usage docs indicate quota breaches can block queries with `BLOCKED` errors for quota-bound plans. (Web: `https://docs.turso.tech/help/usage-and-billing`)

Practical decision caveat:

- Any migration business case must include expected rows-read/rows-written/sync traffic and projected overage behavior.

### 8.2 Latency caveats

- Turso durability page documents added commit-latency ceilings by plan tier. (Web: `https://docs.turso.tech/cloud/durability`)
- Current local architecture avoids network RTT for all DB operations; remote/hybrid introduces network and stream lifecycle costs.

Practical decision caveat:

- Latency comparison must be measured with this workload (search, checkpoint operations, bulk delete safety paths), not inferred from generic benchmarks.

### 8.3 Durability caveats

- Turso documents durability model and commit acknowledgment behavior tied to object-store-backed architecture. (Web: `https://docs.turso.tech/cloud/durability`)
- Current local system has app-level checkpoint snapshots with max retention count 10, which is not equivalent to managed PITR policies. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:20`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:195`)
- Turso PITR is available with plan-dependent retention windows. (Web: `https://docs.turso.tech/features/point-in-time-recovery`)

Practical decision caveat:

- Managed durability can be stronger than current local defaults, but only if cost and operational controls are configured and monitored correctly.

## 9) Final Technical Conclusion: Portable Now vs Redesign Required

### 9.1 Portable now (partial)

- Base SQLite data file compatibility is favorable in principle. (Local libSQL clone: `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/README.md:126`)
- FTS5 capability alignment appears feasible with validation. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:51`; Web: `https://docs.turso.tech/features/sqlite-extensions`)

### 9.2 Redesign required before backend switch

- Runtime API abstraction boundary for DB and transactions.
- Search abstraction for vector backend differences (sqlite-vec vs native vector APIs).
- Consistency-mode aware read/write semantics and explicit stream lifecycle handling.
- Backend-aware CLI/checkpoint operational model.

### 9.3 Decision posture

**Recommendation now:** Keep current local SQLite architecture as default production path for this MCP server.

**Future migration readiness:** Plan an adapter-first phased migration only when explicit triggers are hit (shared remote access requirements, durability/compliance needs, or operational incidents surpassing defined thresholds), with shadow-read and dual-write safety gates before cutover.

---

## Official Online Source URLs (Validated February 21, 2026)

These URLs are intentionally repeated for implementation planning and re-validation.

- Turso SDK (TypeScript reference): `https://docs.turso.tech/sdk/ts/reference`
- Turso SDK quickstart (TypeScript): `https://docs.turso.tech/sdk/ts`
- Authentication (SDK): `https://docs.turso.tech/sdk/authentication`
- Authentication (Platform API): `https://docs.turso.tech/api-reference/authentication`
- libSQL Remote HTTP protocol reference: `https://docs.turso.tech/sdk/http/reference`
- Migration to Turso: `https://docs.turso.tech/cloud/migrate-to-turso`
- Durability guarantees: `https://docs.turso.tech/cloud/durability`
- SQLite extensions (FTS5, optional sqlite-vec): `https://docs.turso.tech/features/sqlite-extensions`
- Native vector search: `https://docs.turso.tech/features/ai-and-embeddings`
- Embedded replicas intro: `https://docs.turso.tech/features/embedded-replicas/introduction`
- Turso Sync usage: `https://docs.turso.tech/sync/usage`
- Pricing: `https://turso.tech/pricing`
- Usage and billing behavior: `https://docs.turso.tech/help/usage-and-billing`
- CLI plan usage visibility: `https://docs.turso.tech/cli/plan/show`

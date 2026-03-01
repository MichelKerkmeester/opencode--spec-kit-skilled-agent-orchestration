# Recommendation: SQLite vs libSQL/Turso Decision for System Spec Kit MCP

Index: Companion analysis document at [`.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/research/analysis-system-speckit-mcp-sqlite-vs-libsql.md`](<.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/research/analysis-system-speckit-mcp-sqlite-vs-libsql.md>).

Source validation date: **February 21, 2026**.

## 1) Final Recommendation Statement

**Decision:** Keep the current local SQLite architecture as the default backend now (`sqlite_local`) and defer any production Turso/libSQL cutover until adapter, consistency, and operational readiness gates are passed.

Rationale summary:

- Current runtime is deeply coupled to direct `better-sqlite3` local DB operations, SQLite PRAGMAs, `sqlite-vec`, and local checkpoint/restore transactions. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:15`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1184`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1602`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:313`)
- Startup/server/CLI wiring assumes local DB lifecycle and no remote endpoint/token contract, including file-based DB update signaling and local-handle reinitialize flows. (Local: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:450`, `.opencode/skill/system-spec-kit/mcp_server/cli.ts:82`, `.opencode/skill/system-spec-kit/mcp_server/package.json:36`, `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:101`, `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:141`)
- Turso/libSQL introduces protocol and consistency semantics (baton stream lifecycle, replica visibility model) that require deliberate redesign and test coverage before cutover. (Local libSQL clone: `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/HTTP_V2_SPEC.md:14`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:13`)
- libSQL positioning confirms SQLite file compatibility and embedded operation goals, but this does not remove runtime adapter needs for this codebase. (Local libSQL clone: `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/README.md:126`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/README.md:128`)

## 2) Option Analysis

### 2.1 Option A: SQLite local (status quo)

**Description:** Keep existing backend with no runtime storage migration.

**Pros**

- Zero migration risk and preserves known operational behavior.
- Full compatibility with current `better-sqlite3`, PRAGMA tuning, `sqlite-vec`, FTS5 triggers, checkpoint restore transaction model. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1184`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1602`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:313`)

**Cons**

- No managed durability/PITR or global access out of the box.
- Local file lifecycle remains operational burden.

**Recommendation status:** **Default now**.

### 2.2 Option B: libSQL local bridge (embedded/local libSQL client)

**Description:** Keep local-first deployment but route through an abstraction that can also target libSQL-compatible clients.

**Pros**

- Lowest-risk path to future portability.
- Preserves local execution while forcing API boundary cleanup.

**Cons**

- Still requires vector and transaction semantic abstraction.
- Can add temporary complexity without immediate business value if triggers are not met.

**Recommendation status:** **Build as preparatory phase, not cutover phase**.

### 2.3 Option C: Turso hybrid (local + replica/sync)

**Description:** Keep local primary developer flow but add Turso-backed replication/sync for selected environments.

**Pros**

- Incremental path to managed durability and multi-environment sharing.
- Can validate consistency/latency/cost with canary workloads.

**Cons**

- Consistency behavior becomes mode-dependent; requires strict guardrails.
- Operational burden increases during dual-mode period.

**Recommendation status:** **Only after adapter + shadow-read parity pass**.

### 2.4 Option D: Turso full remote

**Description:** Remote-first DB for all runtime operations.

**Pros**

- Centralized managed infra, remote access, platform-level durability features.

**Cons**

- Highest migration complexity and highest blast radius.
- Requires robust stream/retry/idempotency behavior and full consistency test maturity.

**Recommendation status:** **Not now**.

### 2.5 Weighted decision snapshot

| Option | Delivery risk | Ops complexity | Strategic value | Net decision |
|---|---|---|---|---|
| A SQLite local | Low | Low | Medium | Choose now |
| B libSQL local bridge | Medium | Medium | High | Build next |
| C Turso hybrid | Medium-High | High | High | Pilot later |
| D Turso full remote | High | High | High | Defer |

## 3) Decision Tree with Hard Trigger Thresholds

Use this tree to decide when to progress beyond local SQLite.

### 3.1 Hard triggers (must be true to advance)

1. **Cross-host consistency need:** At least 2 independent hosts/process groups must share live memory state, and local-file workflows are failing target freshness requirements (SLO miss in 2 consecutive release cycles).
2. **Durability requirement gap:** Required RPO/RTO cannot be met by current checkpoint process (max checkpoint retention is 10 entries) and at least 2 restore drills show unacceptable recovery risk. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:20`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:195`)
3. **Operational incident threshold:** 2 or more storage-related Sev-2+ incidents in a rolling quarter attributable to local DB lifecycle limits.
4. **Cost viability:** Projected Turso spend for expected query/write/sync load is within approved budget envelope with 30% headroom based on live pricing/usage rules. (Web: `https://turso.tech/pricing`, `https://docs.turso.tech/help/usage-and-billing`)

### 3.2 Decision logic

```text
If no hard trigger is met -> stay sqlite_local
If trigger #1 only -> build adapter + run shadow-read
If #1 and #2 met -> allow turso_hybrid pilot
If #1 #2 #3 #4 all met and tests pass -> consider turso_remote cutover
If any cutover gate fails -> rollback to previous phase immediately
```

## 4) Phased Roadmap (Adapter -> Shadow Read -> Dual Write/Canary -> Cutover)

### Phase 0: Baseline freeze (now)

- Backend: `sqlite_local`
- Deliverables:
  - Capture baseline latency, search quality, checkpoint restore times.
  - Lock current schema and search behavior as parity target.
- Exit criteria:
  - Baseline metrics stable for 2 weeks.

### Phase 1: Adapter introduction

- Backend: `sqlite_local` only (runtime unchanged)
- Deliverables:
  - Introduce `DatabaseAdapter` abstraction and backend selector env contract.
  - Keep implementation bound to existing SQLite driver under adapter facade.
- Exit criteria:
  - No behavior regression in local mode.
  - 100% parity in current integration tests.

### Phase 2: Shadow-read (non-authoritative remote/hybrid reads)

- Backend: `sqlite_local` authoritative; `turso_hybrid` read shadow for comparison.
- Deliverables:
  - Compare result sets/ranking/checkpoint metadata without affecting user output.
  - Add stream error telemetry (baton invalidation, timeout, retry attempts).
- Exit criteria:
  - Search parity >= 99% for top-k overlap on defined corpus.
  - No unresolved consistency anomalies.

### Phase 3: Dual-write canary

- Backend: `sqlite_local` primary writes plus canary writes to hybrid/remote path.
- Deliverables:
  - Idempotent write keys.
  - Compensating actions for partial dual-write failure.
  - Canary scope limited to non-critical folders first.
- Exit criteria:
  - 0 unmitigated data divergence incidents over canary window.
  - Checkpoint restore drills pass on both source of truth and canary path.

### Phase 4: Controlled cutover

- Backend: switch selected environments to `turso_hybrid` then potentially `turso_remote`.
- Deliverables:
  - Production runbook and rollback automation.
  - Cost alerts and quota-block alarms.
- Exit criteria:
  - SLOs met for latency/error/cost for at least one full release cycle.

## 5) Rollback Strategy per Phase

| Phase | Rollback trigger | Rollback action |
|---|---|---|
| Phase 1 Adapter | Any parity regression | Disable adapter flag and route to existing direct local path |
| Phase 2 Shadow-read | Parity < target or protocol instability | Stop shadow queries, keep local authoritative path only |
| Phase 3 Dual-write | Divergence, failed idempotency, replay uncertainty | Disable secondary writes immediately; reconcile from local authoritative DB and checkpoint |
| Phase 4 Cutover | SLO breach, quota blocking, incident escalation | Revert backend selector to previous phase backend and execute restore/reconcile runbook |

Checkpoint and restore remain mandatory controls during migration experiments. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:142`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:273`)

## 6) Governance and Readiness Checklist

Use this checklist before entering each new phase.

### 6.1 Security and auth

- [ ] Backend-specific auth token handling is documented and rotated.
- [ ] Non-production and production credentials are separated.
- [ ] Auth failure behavior is fail-closed for write paths.

Reference URLs:
- `https://docs.turso.tech/sdk/authentication`
- `https://docs.turso.tech/api-reference/authentication`

### 6.2 Observability and reliability

- [ ] Stream-level metrics captured: baton reuse failures, stream closures, retry counts, timeout rates.
- [ ] Consistency-mode metrics captured by backend mode.
- [ ] Alerts configured for query blocking/quota and latency regression.

Reference URLs:
- `https://docs.turso.tech/sdk/http/reference`
- `https://docs.turso.tech/help/usage-and-billing`

### 6.3 Cost guardrails

- [ ] Monthly budget threshold + 30% headroom approved.
- [ ] Forecasted reads/writes/storage/sync compared to plan limits.
- [ ] Automated alert on threshold crossing.

Reference URLs:
- `https://turso.tech/pricing`
- `https://docs.turso.tech/cli/plan/show`

### 6.4 Incident runbook readiness

- [ ] Runbook contains backend switch rollback steps.
- [ ] Runbook includes checkpoint restore drill evidence.
- [ ] On-call has simulation-based rehearsal at each phase boundary.

## 7) Explicit "Not Now" List

The following are explicitly deferred until triggers and readiness gates are met:

1. Full replacement of local SQLite runtime with `turso_remote` in production.
2. Immediate rewrite of vector search SQL semantics without parity harness.
3. Removing local checkpoint safety net before remote/hybrid restore drills pass.
4. Broad CLI remote operation enablement without auth/telemetry/failure-policy hardening.
5. Any migration that combines architecture shift and feature changes in one release.

## Design-Level Interface Proposals

These interfaces are required to make migration phases safe and reversible.

### A) `StorageBackend` enum

```ts
export enum StorageBackend {
  sqlite_local = 'sqlite_local',
  libsql_local = 'libsql_local',
  turso_hybrid = 'turso_hybrid',
  turso_remote = 'turso_remote',
}
```

### B) `ConsistencyMode` enum

```ts
export enum ConsistencyMode {
  local_strict_serializable = 'local_strict_serializable',
  primary_linearizable = 'primary_linearizable',
  replica_monotonic_read_your_writes = 'replica_monotonic_read_your_writes',
  eventual_replica = 'eventual_replica',
}
```

Grounding evidence:

- Local strict transaction behavior is assumed in current code. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:313`)
- sqld consistency differentiates primary linearizable vs replica visibility guarantees. (Local libSQL clone: `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:13`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/CONSISTENCY_MODEL.md:15`)
- The stateless HTTP API documents no interactive transaction support and forbids explicit transaction statements in request batches. (Local libSQL clone: `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/http_api.md:47`, `.opencode/specs/02--system-spec-kit/024-sqlite-to-libsql/context/libsql-main/docs/http_api.md:49`)

### C) `SearchCapabilityProfile`

```ts
export interface SearchCapabilityProfile {
  supportsFts5: boolean;
  supportsBm25: boolean;
  supportsSqliteVec: boolean;
  supportsNativeVector: boolean;
  expectedEmbeddingDimension: number;
  supportsVectorDistanceCosine: boolean;
  supportsContentTriggers: boolean;
}
```

Grounding evidence:

- Current feature set depends on FTS5/BM25 and sqlite-vec behavior. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:90`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1602`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:2118`)

### D) `DatabaseAdapter` contract

```ts
export interface DatabaseAdapter {
  backend: StorageBackend;
  consistencyMode: ConsistencyMode;

  init(): Promise<void>;
  close(): Promise<void>;
  health(): Promise<{ ok: boolean; details?: string }>;

  execute(sql: string, params?: unknown[]): Promise<{ rowsAffected: number }>;
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;

  transaction<T>(fn: (tx: TransactionAdapter) => Promise<T>): Promise<T>;

  createCheckpoint(input: {
    name: string;
    specFolder?: string | null;
    metadata?: Record<string, unknown>;
  }): Promise<{ id: number; name: string }>;

  restoreCheckpoint(input: {
    nameOrId: string | number;
    clearExisting?: boolean;
  }): Promise<{ restored: number; skipped: number; errors: string[] }>;

  getSearchCapabilities(): Promise<SearchCapabilityProfile>;
}

export interface TransactionAdapter {
  execute(sql: string, params?: unknown[]): Promise<{ rowsAffected: number }>;
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
}
```

Grounding evidence:

- Transaction wrapper and checkpoint semantics are core correctness boundaries today. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:1742`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:313`)

### E) Environment contract proposal

```ts
export interface StorageEnvironmentConfig {
  SPECKIT_STORAGE_BACKEND: StorageBackend;

  // Local settings
  MEMORY_DB_PATH?: string;
  SPEC_KIT_DB_DIR?: string;

  // Turso/libSQL settings
  SPECKIT_LIBSQL_URL?: string;      // e.g. libsql://... or https://...
  SPECKIT_LIBSQL_AUTH_TOKEN?: string;

  // Protocol tuning
  SPECKIT_REQUEST_TIMEOUT_MS?: number;     // default 10000
  SPECKIT_STREAM_IDLE_TIMEOUT_MS?: number; // default 30000
  SPECKIT_MAX_RETRIES?: number;            // default 2
  SPECKIT_RETRY_BACKOFF_MS?: number;       // default 250

  // Fallback behavior
  SPECKIT_FALLBACK_MODE?: 'sqlite_local' | 'read_only' | 'fail_closed';
}
```

Grounding evidence:

- Current env contract is local-path oriented and lacks remote endpoint/token controls. (Local: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:285`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:293`)

## Explicit Test Scenarios (Required Before Any Cutover)

### 1) Search parity

- Compare top-k overlap and ranking drift across local vs candidate backend.
- Validate FTS/BM25 score behavior and vector similarity ordering.
- Include archived/non-archived and spec-folder-scoped queries.

### 2) Transaction integrity

- Validate multi-statement atomicity under normal and faulted execution.
- Reproduce clear-existing restore flows and verify rollback correctness.

### 3) Checkpoint/restore safety

- Validate snapshot integrity, schema validation failures, and restore counters.
- Test both full restore and scoped restore behavior.

### 4) Remote protocol behavior

- Baton reuse correctness over stream sequence.
- Stream timeout recovery after idle closure.
- Retry idempotency under ambiguous network outcomes.

### 5) Consistency tests

- Read-your-write checks in same process/connection.
- Cross-process replica visibility checks with monotonicity assertions.
- No stale-read violations for protected operations.

### 6) Failure injection

- Inject network timeouts, 4xx/5xx protocol failures, token expiry, quota-block responses.
- Verify fallback behavior (`sqlite_local`, `read_only`, `fail_closed`) is policy-compliant.

### 7) Rollback drills

- Drill phase-level rollback playbooks with time-to-recovery measurements.
- Validate checkpoint-based reconcile after simulated dual-write divergence.

## Official Online Source URLs (Validated February 21, 2026)

- Turso SDK (TypeScript reference): `https://docs.turso.tech/sdk/ts/reference`
- Turso SDK quickstart (TypeScript): `https://docs.turso.tech/sdk/ts`
- Authentication (SDK): `https://docs.turso.tech/sdk/authentication`
- Authentication (Platform API): `https://docs.turso.tech/api-reference/authentication`
- HTTP v2 / libSQL remote HTTP usage: `https://docs.turso.tech/sdk/http/reference`
- Migration to Turso: `https://docs.turso.tech/cloud/migrate-to-turso`
- Durability model: `https://docs.turso.tech/cloud/durability`
- SQLite extensions (FTS5, optional sqlite-vec): `https://docs.turso.tech/features/sqlite-extensions`
- Native vector search: `https://docs.turso.tech/features/ai-and-embeddings`
- Embedded replicas: `https://docs.turso.tech/features/embedded-replicas/introduction`
- Turso Sync usage: `https://docs.turso.tech/sync/usage`
- Pricing: `https://turso.tech/pricing`
- Usage and billing: `https://docs.turso.tech/help/usage-and-billing`
- CLI plan usage visibility: `https://docs.turso.tech/cli/plan/show`

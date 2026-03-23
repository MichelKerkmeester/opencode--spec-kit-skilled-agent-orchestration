# Hydra DB-Based Features — Deep Review (2026-03-23)

> 3 GPT-5.4 ultra-think agents via Codex CLI, read-only sandbox, reasoning=high

---

## Aggregate Scores

| Agent | Focus | Score | Key Metric |
|-------|-------|-------|------------|
| **1** | Code Quality & Bugs | **60/100** | 2 critical, 4 high bugs; 75% test coverage |
| **2** | Architecture & Catalog | **58/100** | Separation 5/10; flag hygiene 4/10 |
| **3** | Testing & Playbook | **68/100** | Catalog↔playbook 85.52%; scenario 148 unjustified |
| **Combined** | — | **62/100** | — |

---

## Critical Findings (P0 — Must Fix)

### BUG-001: Empty-scope filter allows all rows under enforcement [CRITICAL]
- **Agent 1, Bug #1** — `scope-governance.ts:createScopeFilterPredicate/filterRowsByScope`
- When enforcement is enabled and `scope` is `{}`, the predicate returns `true` for every row — effectively allow-all, not deny-by-default
- **Impact**: Cross-tenant data leakage when enforcement is on but no scope constraints are provided
- **Fix**: If enforcement is on and no scope constraints are present, return deny-all predicate or require explicit privileged bypass flag

### BUG-002: Retention sweep can cross tenant boundaries [CRITICAL]
- **Agent 1, Bug #2** — `retention.ts:runRetentionSweep`
- Default `scope: ScopeContext = {}` combines with BUG-001, so unscoped sweeps delete expired memories across tenants/sessions
- **Impact**: Data loss across tenant boundaries
- **Fix**: Reject empty scope for caller-driven sweeps, or add explicit admin-only global-sweep mode

### ARCH-001: Adaptive ranking flag defaults to `true` but is dormant in production [HIGH]
- **Agent 2, Finding #4** — `capability-flags.ts`
- The adaptive ranking flag defaults to `true`, conflicting with stated dormant/disabled production posture (Phase 4)
- **Impact**: Shadow scoring code path may activate unexpectedly; doc/code truth divergence
- **Fix**: Flip adaptive default to `false` to match production reality; document roadmap-metadata vs runtime-gate distinction

### ARCH-002: Circular dependency lib/ → handlers/ [HIGH]
- **Agent 2, Finding #1** — `lineage-state.ts` imports from `handlers/pe-gating.ts`, `handlers/save/db-helpers.ts`, `handlers/handler-utils.ts`; `pe-gating.ts` imports back from lineage-state
- **Risk**: Partial module initialization, test isolation problems, bundling issues
- **Fix**: Extract pure helpers into `lib/storage/document-helpers.ts`, `lib/storage/post-insert-metadata.ts`, `lib/spec/spec-level.ts`

### ARCH-003: Memory type inference diverges from config [HIGH]
- **Agent 2, Finding #5** — `memory-types.ts` + `type-inference.ts` + `memory-parser.ts`
- Parser-time inference doesn't consume `SPEC_DOCUMENT_CONFIGS`; spec documents land in `declarative` instead of `semantic`
- **Impact**: Decay policies apply incorrectly to spec documents
- **Fix**: Route parser through `SPEC_DOCUMENT_CONFIGS` as single source of truth

---

## High Severity Findings

### BUG-003: Non-atomic space creation + owner bootstrap [HIGH]
- **Agent 1, Bug #3** — `handlers/shared-memory.ts:handleSharedSpaceUpsert`
- Space creation and owner bootstrap are separate writes with no wrapping transaction
- **Fix**: Wrap in single DB transaction

### BUG-004: Race condition on concurrent shared-space creates [HIGH]
- **Agent 1, Bug #4** — `handlers/shared-memory.ts:handleSharedSpaceUpsert`
- TOCTOU: `findSharedSpaceTenant()` checked before `upsertSharedSpace()`, allowing concurrent cross-tenant overwrite
- **Fix**: Atomic create/update with post-lock recheck

### BUG-005: Uncaught DB/FS exceptions in all shared-memory handlers [HIGH]
- **Agent 1, Bug #5** — All 4 handler exports
- DB lock errors, prepare/run failures, README FS failures escape as thrown exceptions instead of MCP error envelopes
- **Fix**: Wrap handler bodies in `try/catch (error: unknown)` → `createMCPErrorResponse()`

### BUG-006: README created before DB enablement [HIGH]
- **Agent 1, Bug #6** — `handlers/shared-memory.ts:handleSharedMemoryEnable`
- If DB setup fails after README creation, workspace has README claiming enabled while DB says disabled
- **Fix**: Persist DB state first, then create README

### ARCH-004: Transition semantics under-validated [HIGH]
- **Agent 2, Finding #2** — `lineage-state.ts:recordLineageTransition`
- Callers can pass `CREATE` with predecessor, `SUPERSEDE` without one, or stitch unrelated logical keys
- **Fix**: Add transition validator enforcing allowed `(event, predecessor, logical_key, valid_from)` combinations

### HANDLER-001: `checkDatabaseUpdated()` unguarded [HIGH]
- **Agent 3, Finding #2** — `handlers/memory-context.ts:609`
- Awaited outside any `try/catch`; DB-state failure escapes MCP envelope entirely
- **Fix**: Wrap and convert failures to structured `E_INTERNAL` response

### HANDLER-002: Telemetry IIFE not fail-safe [HIGH]
- **Agent 3, Finding #3** — `handlers/memory-context.ts:911-925`
- Telemetry helper throw would break successful retrieval response construction
- **Fix**: Wrap in `try/catch`; omit `_telemetry` on failure

---

## Medium Severity Findings

| # | Source | Finding | File |
|---|--------|---------|------|
| 1 | Agent 1 #7 | `assertSharedSpaceAccess` emits no governance audit for allow/deny decisions | `shared-spaces.ts` |
| 2 | Agent 1 #8 | Blank `spaceId`/`tenantId`/`name` not rejected at runtime; types alone don't protect MCP input | `shared-spaces.ts` |
| 3 | Agent 2 #3 | Temporal integrity (valid_to > valid_from, monotonic timestamps) is application-managed, not schema-enforced | `lineage-state.ts` |
| 4 | Agent 2 #6 | `getHalfLifeForType` not exported from `memory-types.ts`; consumers degrade to defaults silently | `memory-types.ts` |
| 5 | Agent 2 #7 | Drift test checks prose/counts, not filesystem reality; hardcoded dates/counts will stale | `hydra-spec-pack-consistency.vitest.ts` |
| 6 | Agent 3 #1 | `handleMemoryContext` is 394 LOC god-function mixing 8 responsibilities | `memory-context.ts` |
| 7 | Agent 3 #4 | `workingMemory.setSessionInferredMode()` unguarded after retrieval | `memory-context.ts` |

---

## Testing & Playbook Alignment

### Playbook Scenario Alignment
| ID | Scenario | Automated | Manual-Only Gaps | Verdict Justified? |
|----|----------|-----------|------------------|-------------------|
| 122 | Governed ingest & scope isolation | Partial (library-level) | No live save/search handler flow, no end-to-end audit evidence | **Partially** |
| 123 | Shared space deny-by-default | Mostly library/handler core | No shared save/search through real handlers | **Mostly** |
| 148 | Disabled by default + first-run | In-memory only | No README check, no restart persistence, no status envelope assertions | **No** |

### Feature Catalog ↔ Playbook Cross-Reference
- **Catalog entries**: 221 on disk (not 220 as documented)
- **Playbook scenarios**: 227 files, 264 IDs
- **Orphan catalog entries** (no playbook test): **32 entries** across 8 categories
- **Cross-reference integrity**: **85.52%** — measurable drift
- **Recommendation**: Add CI validator comparing `feature_catalog/*/*.md` vs playbook Section 12 mappings

### Critical Test Gaps (Priority Order)
| # | Code Path | Risk | Agent |
|---|-----------|------|-------|
| 1 | Empty-scope enforcement in `filterRowsByScope` | Cross-tenant leakage | 1 |
| 2 | Default empty-scope in `runRetentionSweep` | Cross-tenant deletion | 1 |
| 3 | `checkDatabaseUpdated()` throws | Uncaught MCP exception | 3 |
| 4 | Strategy handler throws → `E_STRATEGY` | Unproven failure path | 3 |
| 5 | Partial-failure + concurrent-create in `handleSharedSpaceUpsert` | Ownerless spaces, cross-tenant overwrite | 1 |
| 6 | Governance filtering through real `memory_context` flow | Cross-actor leakage despite library tests | 3 |
| 7 | Shared-memory first-run setup (scenario 148) | Overstated verdict | 3 |
| 8 | `handleSharedMemoryEnable` full lifecycle | No coverage for first-run/idempotency/failure | 1 |

---

## SOLID Violations

| Principle | Module | Finding | Severity |
|-----------|--------|---------|----------|
| **SRP** | `lineage-state.ts` | Owns write orchestration, temporal reads, backfill, integrity, metadata archival, BM25/vector side effects, benchmarking | High |
| **SRP** | `memory-context.ts` | 394 LOC handler mixing validation, sessioning, pressure, discovery, dispatch, budgeting, response, instrumentation | Medium |
| **OCP** | `lineage-state.ts` | New transition events require schema CHECK, counters, tests, and multi-location edits | Medium |
| **DIP** | `lineage-state.ts` | Hard-coupled to better-sqlite3, raw SQL, specific index side effects | Medium |
| **ISP** | `memory-types.ts` | Config, parser, and inference expose overlapping non-authoritative classification surfaces | Medium |

---

## God-Functions (>50 LOC)

| Function | File | LOC | Decomposition Recommendation |
|----------|------|-----|------------------------------|
| `handleMemoryContext` | `memory-context.ts` | 394 | Extract: `resolveSessionLifecycle`, `resolveEffectiveMode`, `maybeDiscoverSpecFolder`, `executeStrategy`, `buildResponseMeta` |
| `backfillLineageState` | `lineage-state.ts` | 150 | Split: planner, dry-run evaluator, executor |
| `insertAppendOnlyMemoryIndexRow` | `lineage-state.ts` | 100 | Split: `buildInsertPayload`, `persistEmbedding`, `postIndexSideEffects` |
| `recordLineageTransition` | `lineage-state.ts` | 89 | Split: validation, predecessor resolution, transition persistence |
| `summarizeLineageInspection` | `lineage-state.ts` | 76 | Split: chain analysis from summary projection |
| `enforceTokenBudget` | `memory-context.ts` | ~80 | Table-drive via smaller helpers: parser, truncator, compactor, fallback-builder |
| `benchmarkLineageWritePath` | `lineage-state.ts` | 54 | Extract reusable benchmark recorder or fold into tests only |

---

## Missing Decision Records

| Decision | Why It Should Be Documented |
|----------|-----------------------------|
| Append-first lineage: supersede-only, never in-place mutate/delete | Defines auditability, storage growth, rollback semantics, retention cost |
| Temporal contract: half-open `[valid_from, valid_to)` with application-managed integrity | Real `asOf` truth model and boundary behavior |
| Legacy-memory backfill is idempotent, may rewrite lineage metadata | Operators need to know what happens to pre-lineage data |
| Roadmap capability flags ≠ live runtime gates | Main source of rollout confusion and doc drift |
| `logical_key = spec_folder::canonical_path::anchor` | Governs rename/canonicalization and cross-version identity |

---

## Refinement Roadmap (Prioritized)

| Priority | Area | Action | Impact | Effort |
|----------|------|--------|--------|--------|
| **P0** | Scope governance | Fix empty-scope deny-by-default + retention guard | Critical security | Small |
| **P0** | Capability flags | Flip adaptive default to `false` | Truth alignment | Tiny |
| **P1** | Shared-memory handler | Wrap in transactions + try/catch + reorder README/DB | 4 high bugs | Medium |
| **P1** | Circular dependency | Extract lib helpers from handler imports | Architecture | Medium |
| **P1** | Type inference | Route parser through SPEC_DOCUMENT_CONFIGS | Decay correctness | Medium |
| **P1** | Transition validation | Add input validator to `recordLineageTransition` | Data integrity | Medium |
| **P2** | Handler decomposition | Split `handleMemoryContext` into 5 helpers | Maintainability | Medium |
| **P2** | Lineage SRP | Split lineage-state.ts into 4 modules | Testability | Large |
| **P2** | Catalog/playbook CI | Add cross-reference validator | Drift prevention | Small |
| **P2** | Drift test hardening | Replace prose/count assertions with manifests | Test reliability | Small |
| **P3** | Decision records | Document 5 implicit architecture decisions | Knowledge preservation | Small |
| **P3** | Test E2E | Add handler-level governance/shared-memory integration tests | Confidence | Medium |

---

## Methodology

- **Model**: GPT-5.4 via Codex CLI (`codex exec -m gpt-5.4 -s read-only -c model_reasoning_effort="high"`)
- **Agent 1**: Code quality, bugs, sk-code--opencode P0/P1 standards — governance + collaboration layer (173K tokens)
- **Agent 2**: Architecture, feature catalog, type system, SOLID — lineage + flags + types
- **Agent 3**: Testing, playbook alignment, handler review — memory-context + all test files
- **All 3 agents ran in parallel** with non-overlapping file scopes
- **Review type**: Static analysis + targeted code inspection (read-only sandbox)

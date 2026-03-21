# Architecture Audit v3 — O5: Hydra DB Architecture Review (008)

**Agent**: O5 — HYDRA DB ARCHITECTURE REVIEW
**Date**: 2026-03-21
**Scope**: `008-hydra-db-based-features/` parent + 6 child phases, cross-referenced with runtime code
**Status**: Complete

---

## Summary

The Hydra DB roadmap (008) is a 6-phase database architecture evolution spec covering lineage, graph retrieval, adaptive ranking, scope governance, and shared memory. All 6 child phases claim "Complete" status. The parent pack was normalized to Level 3 templates on 2026-03-20.

Cross-referencing the roadmap specs against actual runtime code reveals that the core infrastructure is genuinely implemented: lineage tables, active projection, `asOf` resolution, governance tables, retention sweeps, shared-space CRUD, and graph-unified retrieval all exist in code. However, the audit identified several architectural concerns regarding the gap between what the specs describe and what the code actually does, stale file references in specs, and a permanently disabled shadow-scoring subsystem that undermines Phase 4 claims.

**Total findings: 12**
- CRITICAL: 0
- HIGH: 3
- MEDIUM: 6
- LOW: 3

---

## Findings

### O5-001: Phase 4 Spec Claims File Path That Does Not Exist
- **Severity**: MEDIUM
- **Category**: alignment
- **Location**: `008-hydra-db-based-features/004-adaptive-retrieval-loops/spec.md` (line 98)
- **Description**: The Phase 4 spec lists `.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/` as a file to change for adaptive-ranking policy helpers. This directory does not exist. The actual adaptive-ranking module lives at `lib/cognitive/adaptive-ranking.ts`.
- **Evidence**: `ls lib/cache/cognitive/` returns "No cognitive cache directory". The actual file is `lib/cognitive/adaptive-ranking.ts` which contains `AdaptiveShadowProposal`, `AdaptiveSignalEvent`, and bounded threshold types.
- **Impact**: Spec references mislead maintainers trying to trace Phase 4 deliverables. The path discrepancy suggests the spec was written before the module was placed, and never corrected.
- **Recommended Fix**: Update Phase 4 spec to reference `lib/cognitive/adaptive-ranking.ts` instead of `lib/cache/cognitive/`.

---

### O5-002: Shadow Scoring Write Path Permanently Disabled — Phase 4 "Complete" Claim Overstated
- **Severity**: HIGH
- **Category**: roadmap
- **Location**: `mcp_server/lib/eval/shadow-scoring.ts` (line 16)
- **Description**: The shadow-scoring module contains a permanent disable note: "The shadow write path (runShadowScoring, logShadowComparison) was permanently disabled in the rollout." Phase 4 spec claims shadow-mode adaptive ranking is "Complete" with full shadow-mode evaluation capabilities. If the shadow write path is permanently disabled, shadow-mode evaluation cannot actually run as described.
- **Evidence**: `shadow-scoring.ts` line 16: `// ...The shadow write path (runShadowScoring, logShadowComparison) was permanently disabled in the rollout.`
- **Impact**: Phase 4's core deliverable (SC-401: "Adaptive ranking can run in shadow mode without affecting live users") is undermined if the shadow write path is permanently off. The spec claims completion but the runtime cannot execute the primary workflow. The adaptive-ranking module (`lib/cognitive/adaptive-ranking.ts`) exists with types and threshold logic, but if shadow scoring cannot persist comparison data, the A/B evaluation pipeline is broken.
- **Recommended Fix**: Either (A) re-enable the shadow write path with appropriate guards and update docs to reflect current state, or (B) update Phase 4 spec and implementation-summary to accurately describe that shadow scoring data persistence is deferred/disabled and that the adaptive ranking module provides only the type contracts and threshold logic today.

---

### O5-003: `asOf` Temporal Queries Not Exposed Through Any MCP Tool
- **Severity**: HIGH
- **Category**: architecture
- **Location**: `mcp_server/tools/*.ts` (all tool definition files)
- **Description**: Phase 2 spec (REQ-203) requires "Support temporal `asOf` reads." The lineage-state module implements `resolveLineageAsOf()` with proper temporal resolution. However, no MCP tool definition exposes `asOf` as a parameter. The `tools/types.ts`, `tools/memory-tools.ts`, and `tools/lifecycle-tools.ts` files contain zero references to `asOf` or `lineage`. This confirms the parent spec's note that `asOf` is "internal storage or integration behavior" — but Phase 2's spec itself claims it as a delivered feature without noting the public-API gap.
- **Evidence**: `grep -i 'asOf\|as_of\|lineage' tools/*.ts` returns no matches. The `resolveLineageAsOf()` function exists in `lib/storage/lineage-state.ts:773` but has no handler or tool surface.
- **Impact**: Phase 2 claims "Complete" for `asOf` support, which is technically true at the storage layer but misleading since there is no way for MCP clients to issue temporal queries. Any consumer expecting `asOf` queries via the MCP protocol will find no such capability.
- **Recommended Fix**: Either (A) add an `asOf` parameter to `memory_search` or `memory_context` tool definitions to surface the existing implementation, or (B) update Phase 2 spec/implementation-summary to explicitly state that `asOf` is an internal-only capability not yet exposed via MCP tools, and create a follow-up spec for public exposure.

---

### O5-004: No Formal Migration Scripts for Hydra Schema Changes
- **Severity**: MEDIUM
- **Category**: architecture
- **Location**: `mcp_server/scripts/migrations/` (only contains `create-checkpoint.ts` and `restore-checkpoint.ts`)
- **Description**: The Hydra roadmap introduces significant schema additions (lineage tables, governance columns, shared-space tables) but there are no numbered migration scripts. All schema changes are applied inline via `ensureLineageTables()`, `ensureGovernanceTables()`, and `ensureSharedSpaceTables()` which run `CREATE TABLE IF NOT EXISTS` and `ALTER TABLE ADD COLUMN` on every startup. Phase 2 spec (REQ-204) requires "Migration harness can backfill existing data and reverse safely through checkpoints."
- **Evidence**: Only 2 files in `scripts/migrations/`: `create-checkpoint.ts` and `restore-checkpoint.ts`. Schema evolution is entirely handled by idempotent DDL in `vector-index-schema.ts`. There are no versioned migration files (e.g., `001-add-lineage.ts`, `002-add-governance.ts`).
- **Impact**: Without formal migration scripts, schema rollback requires manual intervention or checkpoint restore. The inline DDL approach works for forward migrations but makes reversibility harder to verify. The `ALTER TABLE ... ADD COLUMN` approach also cannot remove columns if a rollback is needed. For a system claiming "rollback safety" (Phase 2 REQ-204), the lack of down-migration scripts is a gap.
- **Recommended Fix**: Document this as a known architectural trade-off in the decision-record. The idempotent DDL approach is pragmatic for SQLite but should be acknowledged as a limitation for true reversible migrations. Consider adding down-migration helpers for critical schema changes if rollback fidelity is important.

---

### O5-005: Scope Filtering Not Applied in `memory_search` Handler Pipeline Entry
- **Severity**: MEDIUM
- **Category**: architecture
- **Location**: `mcp_server/handlers/memory-search.ts` (line 772)
- **Description**: The `memory_search` handler calls `normalizeScopeContext()` at line 772 but the normalized scope is not visibly passed to the pipeline orchestrator in a way that enforces filtering at the handler level. The scope filtering does occur inside `stage1-candidate-gen.ts` (line 530: `filterRowsByScope`), which receives scope parameters through the pipeline context. However, the handler-level code appears to normalize scope but does not visibly thread it to the pipeline call in the same function body.
- **Evidence**: In `memory-search.ts:772`, `normalizeScopeContext()` is called. In `stage1-candidate-gen.ts:511-530`, `scopeFilter` is constructed from individual parameters and `filterRowsByScope` is applied. The integration works because scope params flow through the pipeline arguments, but the handler-level normalization result does not appear to be the same object passed to the pipeline.
- **Impact**: The dual-normalization (once at handler, once at pipeline) is not a bug but introduces subtle coupling. If the handler normalization rules ever diverge from pipeline normalization, scope leaks could occur. This is an architectural smell rather than a current defect.
- **Recommended Fix**: Consolidate scope normalization to a single point — either the handler normalizes and passes the result to the pipeline, or the pipeline handles all normalization. Add a regression test that verifies the handler-normalized scope matches what the pipeline ultimately applies.

---

### O5-006: Phase 4 References Non-Existent `access-tracker.ts` Adaptive Signals
- **Severity**: MEDIUM
- **Category**: alignment
- **Location**: `008-hydra-db-based-features/004-adaptive-retrieval-loops/spec.md` (line 96)
- **Description**: Phase 4 spec lists `lib/storage/access-tracker.ts` as a file to modify for "Capture adaptive-learning signals." While `access-tracker.ts` exists and tracks access events, the adaptive signal types (`AdaptiveSignalType`, `AdaptiveSignalEvent`) are defined in `lib/cognitive/adaptive-ranking.ts`, not in `access-tracker.ts`. The access tracker captures raw access data but does not directly implement the adaptive signal capture contract from the spec.
- **Evidence**: `access-tracker.ts` contains access tracking and learning-stats logic but does not reference `AdaptiveSignalType` or `AdaptiveSignalEvent`. Those types are in `cognitive/adaptive-ranking.ts`.
- **Impact**: The spec's file-to-change list misleads about where adaptive signal contracts actually live. Minor documentation issue since the capability exists, just in a different module.
- **Recommended Fix**: Update Phase 4 spec to accurately reflect that adaptive signal types reside in `lib/cognitive/adaptive-ranking.ts`, with `access-tracker.ts` providing the raw access data foundation.

---

### O5-007: Legacy Hydra Naming Still Present in Environment Variables
- **Severity**: LOW
- **Category**: architecture
- **Location**: `mcp_server/lib/config/capability-flags.ts` (lines 47-54)
- **Description**: The capability flags module maintains dual environment variable sets: canonical `SPECKIT_MEMORY_*` prefixed variables and legacy `SPECKIT_HYDRA_*` prefixed variables. The legacy names are checked as fallbacks. While this provides backward compatibility, the "Hydra" branding in env vars is a naming artifact from the original HydraDB inspiration that no longer aligns with the current "Memory Roadmap" naming convention used throughout the codebase.
- **Evidence**: `LEGACY_CAPABILITY_ENV` at line 47 defines 6 `SPECKIT_HYDRA_*` variables. The module comments and function names all use "Memory Roadmap" terminology.
- **Impact**: Low operational impact since the legacy vars are fallbacks. However, they create confusion about whether "Hydra" is still a supported configuration surface. New operators may set `SPECKIT_HYDRA_*` vars thinking they are primary.
- **Recommended Fix**: Add a deprecation notice in the INSTALL_GUIDE.md for `SPECKIT_HYDRA_*` variables. Consider a sunset timeline to remove legacy env var support in a future release.

---

### O5-008: All 6 Child Phases Verified on Same Day (2026-03-13) With Identical Session Patterns
- **Severity**: MEDIUM
- **Category**: roadmap
- **Location**: `008-hydra-db-based-features/001-*/memory/` through `006-*/memory/`
- **Description**: All 6 child phase memory files have timestamps within the same minute (`13-03-26_20-56__*`), each showing `Total Messages: 1` and `Tool Executions: 0`. This suggests all 6 phases were bulk-verified in a single automated pass rather than individually reviewed. For phases representing a progressive database architecture roadmap (baseline -> lineage -> graph -> adaptive -> governance -> shared memory), a same-minute single-pass verification raises concerns about verification depth.
- **Evidence**: All 6 memory files: `13-03-26_20-56__2026-03-13-verification-pass-confirmed-phase-{1..6}.md`. Each has `Total Messages: 1`, `Tool Executions: 0`, `Decisions Made: 4`.
- **Impact**: The verification may have been a documentation-level pass rather than a runtime-level integration test. The parent implementation-summary references independent test runs, but the phase-level memory files suggest the "Complete" status was stamped in bulk.
- **Recommended Fix**: This is informational. The parent-level implementation-summary already contains detailed test evidence (283 files, 7790 tests). The child-phase verification memories could be enriched with per-phase test evidence in a future pass.

---

### O5-009: Parent Spec References `capability-flags.ts` as "Rollout Control" — Actually Phase/Feature Metadata
- **Severity**: LOW
- **Category**: alignment
- **Location**: `008-hydra-db-based-features/spec.md` (line 90)
- **Description**: The parent spec's "Representative Runtime Surfaces" table describes `capability-flags.ts` as "Default roadmap phase and capability resolution" under the "Rollout control" layer. This is accurate in naming but potentially misleading. The module provides metadata snapshots for telemetry and checkpoint tracking — it does not perform runtime feature gating of the capabilities themselves. All 6 capabilities default to `true` unless explicitly opted out. The file's primary consumer is telemetry and checkpoint recording, not conditional feature execution.
- **Evidence**: `capability-flags.ts` functions (`getMemoryRoadmapDefaults`, `getMemoryRoadmapCapabilityFlags`) return static snapshots. They do not conditionally enable/disable lineage writes, graph scoring, or governance enforcement. Those subsystems run unconditionally when their tables exist.
- **Impact**: A reader might expect `capability-flags.ts` to be a runtime kill-switch mechanism. In reality, the actual kill switches for specific capabilities (e.g., graph-unified, shared-memory) are implemented in their respective modules via separate flag checks (e.g., `isGraphUnifiedEnabled()` in `graph-flags.ts`, `isSharedMemoryEnabled()` in `shared-spaces.ts`).
- **Recommended Fix**: Clarify in the parent spec that `capability-flags.ts` provides telemetry/checkpoint metadata snapshots, while actual feature gating lives in per-subsystem flag modules.

---

### O5-010: `governance_metadata` Column Added But Never Populated
- **Severity**: MEDIUM
- **Category**: dead-code
- **Location**: `mcp_server/lib/search/vector-index-schema.ts` (line 1065)
- **Description**: The governance schema migration adds a `governance_metadata TEXT` column to `memory_index`, but searching the entire `mcp_server` codebase for writes to this column reveals it is never populated. The `applyPostInsertMetadata` in `handlers/save/db-helpers.ts` applies governance fields but the `governance_metadata` column is not among the fields written.
- **Evidence**: `ALTER TABLE memory_index ADD COLUMN governance_metadata TEXT` at line 1065 of `vector-index-schema.ts`. No `INSERT` or `UPDATE` statement in the codebase writes to `governance_metadata`.
- **Impact**: Dead schema column that occupies space in schema definitions and could confuse future maintainers who expect it to contain governance metadata. It may have been planned for a structured JSON blob of governance decisions but was never wired up.
- **Recommended Fix**: Either (A) wire up `governance_metadata` population in the governed ingest path, or (B) remove the column addition from schema migrations and note it as a deferred feature.

---

### O5-011: Phase 5 Open Question About Policy Caching Unresolved
- **Severity**: LOW
- **Category**: roadmap
- **Location**: `008-hydra-db-based-features/005-hierarchical-scope-governance/spec.md` (line 296)
- **Description**: Phase 5 spec lists an open question: "Which policy decisions should be cached locally versus resolved dynamically?" This remains unanswered despite the phase being marked "Complete." The current implementation resolves scope governance dynamically on every request (`filterRowsByScope` runs per-query). There is no evidence of scope predicate caching.
- **Evidence**: Open question at line 296 of Phase 5 spec. `filterRowsByScope` in `scope-governance.ts` evaluates scope predicates per-call with no caching layer.
- **Impact**: For small-to-medium workloads this is fine. At scale, repeated scope predicate evaluation could become a performance concern, especially for multi-tenant deployments with complex shared-space membership graphs.
- **Recommended Fix**: Either resolve the open question with a decision (e.g., "Dynamic evaluation is sufficient for current scale; caching deferred") or close it as N/A with a performance benchmark reference.

---

### O5-012: Spec-Claimed Phase Dependencies Not Enforced at Runtime
- **Severity**: HIGH
- **Category**: architecture
- **Location**: Multiple child phase specs; `mcp_server/lib/search/vector-index-schema.ts` (lines 1824-1826)
- **Description**: The specs describe strict phase ordering: Phase 2 depends on Phase 1, Phase 3 depends on Phase 2, Phase 5 depends on Phase 2, Phase 6 depends on Phase 5, etc. In practice, the runtime initializes all subsystems unconditionally. `ensureAllHydraTables()` (or equivalent) calls `ensureLineageTables()`, `ensureGovernanceTables()`, and `ensureSharedSpaceTables()` together regardless of phase configuration. The `getMemoryRoadmapPhase()` function returns a phase label but no code actually gates subsystem initialization based on the current phase.
- **Evidence**: In `vector-index-schema.ts` lines 1824-1826, all three table creation functions are called sequentially without phase checks. `getMemoryRoadmapPhase()` returns `'shared-rollout'` by default. No runtime code checks "if phase < graph, skip graph table creation."
- **Impact**: The spec-claimed sequential dependency model is a documentation-level construct, not a runtime-enforced invariant. All Hydra subsystems are always initialized. This means the phased rollout model described in the specs never actually existed as a progressive deployment — the entire Hydra stack ships as a monolithic unit. While this simplifies deployment, it contradicts the specs' risk mitigation strategy of phased rollout with hard gates between phases.
- **Recommended Fix**: This is a fundamental architectural decision that should be explicitly acknowledged. Either (A) document in the parent decision-record that the phased rollout was a development methodology, not a runtime deployment model, and that all subsystems always ship together; or (B) actually implement phase-gated initialization if progressive rollout is desired.

---

## Cross-Reference Summary

| Phase | Spec Status | Runtime Evidence | Assessment |
|-------|-------------|------------------|------------|
| 001 - Baseline & Safety Rails | Complete | Build path, capability flags, checkpoint scripts, schema compat all present | **Genuinely Complete** |
| 002 - Versioned Memory State | Complete | `lineage-state.ts` with full append-first model, backfill, `asOf` resolution | **Complete at storage layer**; `asOf` not exposed via MCP tools |
| 003 - Unified Graph Retrieval | Complete | `graph-search-fn.ts`, `graph-flags.ts`, typed-degree channel, BM25-aware scoring | **Genuinely Complete** |
| 004 - Adaptive Retrieval Loops | Complete | `adaptive-ranking.ts` with types and thresholds; shadow-scoring permanently disabled | **Partially Complete**; shadow write path disabled |
| 005 - Hierarchical Scope Governance | Complete | `scope-governance.ts`, `retention.ts`, governance audit tables, `filterRowsByScope` integration | **Genuinely Complete** |
| 006 - Shared Memory Rollout | Complete | `shared-spaces.ts`, shared-memory handler, deny-by-default, conflict tables | **Genuinely Complete** |

---

## Architectural Health Assessment

**Strengths:**
1. The schema evolution strategy (idempotent DDL) is pragmatic and SQLite-appropriate
2. Governance integration in the save handler is thorough (provenance, audit, scope enforcement)
3. Shared-space admin requires explicit actor identity with owner authorization — well-designed
4. Lineage tables have proper indexes for temporal queries
5. Legacy Hydra table names are migrated forward cleanly

**Concerns:**
1. Shadow scoring disabled makes Phase 4 adaptive learning largely aspirational
2. `asOf` queries are internal-only despite Phase 2 claiming them as a delivered feature
3. No runtime phase gating means the 6-phase progressive deployment model was never real
4. `governance_metadata` column is dead schema
5. Dual scope normalization between handler and pipeline is an architectural smell

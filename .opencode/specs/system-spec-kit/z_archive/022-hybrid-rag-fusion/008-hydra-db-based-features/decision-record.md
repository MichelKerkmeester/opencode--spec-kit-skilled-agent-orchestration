---
title: "Decision Record: 008-hydra-db-ba [system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/decision-record]"
description: "Architecture decisions for HydraDB-inspired evolution of system-spec-kit Memory MCP server."
trigger_phrases:
  - "decision"
  - "record"
  - "adr"
  - "hydra"
  - "architecture"
importance_tier: "critical"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
---
# Decision Record: 008-hydra-db-based-features

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Build Versioned Memory State on Top of Current Schema

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-13 |
| **Deciders** | System-spec-kit maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

We need first-class memory lineage and temporal state queries, but the current platform already has mature schema, migration patterns, history tracking, and conflict journaling. A greenfield replacement would delay delivery and increase migration risk without proving incremental value first. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1300-1407] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:17-204] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1238-1263]

HydraDB public guidance emphasizes versioned, append-style memory evolution, which can be translated into our existing schema evolution model. Reference: https://hydradb.com/manifesto and https://hydradb.com/blog/how-to-refresh-or-update-stored-llm-memory.

### Constraints

- Current MCP server must remain operational during phased rollout.
- Existing indexed memory and FTS/vector functionality cannot be broken.
- Migration and rollback must stay reversible.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Extend the current schema with lineage/version tables and transition logic instead of replacing storage architecture in one step.

**How it works**: We keep existing `memory_index`, history, and conflict records as baseline, then add version lineage metadata and `asOf` query semantics as additive migrations. Each state mutation becomes an append-style transition with rollback checkpoints.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Incremental schema extension (Chosen)** | Lowest migration risk, reuses tested internals, supports phased rollout | Requires careful compatibility logic | 9/10 |
| Greenfield storage/state replacement | Clean slate and simplified conceptual model | High rewrite cost, uncertain migration risk, delayed value | 5/10 |
| Partial lineage in app layer only | Fast prototype | Weak query consistency and auditability | 4/10 |

**Why this one**: It delivers Hydra-inspired lineage value while preserving reliability and rollback safety.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Faster path to lineage features using existing migration framework.
- Lower operational risk than a full storage rewrite.

**What it costs**:
- More schema complexity. Mitigation: enforce migration contracts and compatibility tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Migration regressions in retrieval | H | Shadow reads, checkpoint rollback, migration tests |
| Inconsistent lineage writes | M | Transactional write path and integrity constraints |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Lineage gap is explicit in requirements |
| 2 | **Beyond Local Maxima?** | PASS | Compared against greenfield and app-only alternatives |
| 3 | **Sufficient?** | PASS | Covers immediate need without overreach |
| 4 | **Fits Goal?** | PASS | Directly supports versioned memory roadmap |
| 5 | **Open Horizons?** | PASS | Leaves option for future storage evolution |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Extend schema/migrations for lineage and temporal query fields.
- Update history/conflict/save handlers to emit consistent version transitions.

**How to roll back**: Disable lineage flags, run migration down scripts, restore checkpoint, and return to prior retrieval path.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Unify Graph and Feedback Inside Current MCP Server First

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-13 |
| **Deciders** | System-spec-kit maintainers |

### Context

Current code already contains causal traversal, hybrid candidate generation, weighted FTS/BM25, and access-based signals. Building an external graph service before integrating these existing modules would add operational overhead and delay learning cycles. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:13-218] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:217-319] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:16-114] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:13-220]

HydraDB public material stresses integrated hybrid retrieval and adaptive behavior. Reference: https://hydradb.com/blog/how-to-design-llm-memory-systems-that-scale and https://hydradb.com/blog/why-cortex-outperforms-rag-only-memory-architectures.

### Constraints

- Need near-term delivery in current codebase.
- Must keep latency budgets under NFR targets.
- Team capacity favors incremental integration over new infrastructure.

### Decision

**We chose**: Implement unified graph and retrieval feedback loops inside the current MCP server before considering an external graph subsystem.

**How it works**: We extend existing schema and retrieval stages to consume causal/entity/summary context and outcome feedback in-process. Externalization remains a later option if scaling data proves it necessary.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **In-process unification (Chosen)** | Fastest to value, lower ops burden, reuses modules | Adds complexity to current server | 8/10 |
| External graph service first | Potential long-term scaling isolation | Immediate infra overhead and integration complexity | 6/10 |
| Keep current fragmented signals | No major refactor | Misses core roadmap outcomes | 3/10 |

**Why this one**: It maximizes leverage from current code and enables faster measurement of real gains.

### Consequences

**What improves**:
- Rapid delivery of unified retrieval behavior.
- Easier rollback using existing feature flags.

**What it costs**:
- Higher local module coupling. Mitigation: clear interfaces and phased integration tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Retrieval complexity becomes hard to debug | M | Add telemetry and per-stage trace outputs |
| Adaptive updates degrade quality | H | Shadow mode and bounded policy updates |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Unified retrieval is a roadmap core item |
| 2 | **Beyond Local Maxima?** | PASS | External-service option was considered |
| 3 | **Sufficient?** | PASS | Satisfies near-term architecture goals |
| 4 | **Fits Goal?** | PASS | Aligns with Hydra-inspired integrated model |
| 5 | **Open Horizons?** | PASS | Externalization remains available later |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Expand graph-aware retrieval in current Stage 1/2 paths.
- Add outcome logging and adaptive ranking policy modules.

**How to roll back**: Disable adaptive and graph-fusion flags, revert to baseline hybrid pipeline, preserve captured telemetry for analysis.

---

### ADR-003: Enforce Hierarchical Scopes and Governance Before Shared Memory Rollout

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-13 |
| **Deciders** | System-spec-kit maintainers |

### Context

Shared-memory collaboration can deliver major multi-agent value, but without strict isolation and governance controls it introduces high risk of data leakage and policy violations. The existing schema and handlers are already scope-aware at a limited level (`spec_folder`, `session_id`) and must be expanded to tenant/user/agent boundaries first. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1300-1407] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:217-319] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:88-223]

HydraDB public positioning consistently pairs shared memory with strict boundaries and enterprise governance controls. Reference: https://hydradb.com/blog/how-to-share-llm-memory-across-ai-agents and https://hydradb.com/.

### Constraints

- Safety and compliance requirements are non-negotiable.
- Shared mode must not bypass policy checks.
- Retention and deletion behavior must remain auditable.

### Decision

**We chose**: Implement hierarchical scopes and governance controls before enabling shared-memory collaboration in production.

**How it works**: Scope model, policy engine, provenance enforcement, and retention/deletion flows are delivered first. Shared-memory features launch only after these controls pass isolation and rollback validation.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Governance-first sequence (Chosen)** | Strong safety posture, compliance-ready, lower incident risk | Slightly slower feature launch | 9/10 |
| Shared-memory first with later governance | Faster collaboration demo | High leakage/compliance risk | 3/10 |
| Governance and shared memory in one release | Single timeline | Very high complexity and rollback risk | 5/10 |

**Why this one**: It protects data boundaries and enables safer long-term collaboration rollout.

### Consequences

**What improves**:
- Reduced risk of cross-scope data exposure.
- Better auditability and retention compliance from day one.

**What it costs**:
- Additional upfront engineering in policy/governance modules. Mitigation: phase gating and shared test harnesses.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Governance phase slips timeline | M | Define MVP policy set and defer non-critical controls |
| Policy engine introduces latency | M | Cache predicates and benchmark per stage |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Shared memory without governance is unsafe |
| 2 | **Beyond Local Maxima?** | PASS | Launch-order alternatives considered |
| 3 | **Sufficient?** | PASS | Sequencing addresses major risks directly |
| 4 | **Fits Goal?** | PASS | Supports scalable multi-agent roadmap |
| 5 | **Open Horizons?** | PASS | Allows later collaboration expansion safely |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Add scope/governance schema and policy enforcement middleware.
- Implement retention/deletion and audit evidence jobs before shared handlers.

**How to roll back**: Keep shared-memory flag disabled, revert governance schema additions if needed, and restore baseline scope behavior.

---

### ADR-004: Append-First Lineage (Supersede-Only, Never Mutate/Delete)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-13 |
| **Deciders** | System-spec-kit maintainers |

### Context

The lineage system needed a deterministic way to track memory version history without sacrificing auditability or temporal reconstruction. The implementation already records predecessor closure by setting `valid_to`, inserts a fresh lineage row for the successor, and updates a separate active projection instead of rewriting the original version in place. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:529-596]

The same module exposes append-style backfill and active projection maintenance, which reinforces that lineage history is preserved as immutable versions while "current state" is derived separately. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:930-1060]

### Constraints

- Version history must remain auditable.
- `asOf` queries must resolve against preserved historical state.
- Current-state lookup still needs a fast active pointer.

### Decision

**We chose**: Make all lineage transitions append-only, where prior records are superseded rather than mutated or deleted.

**How it works**: The `SUPERSEDE` path closes the predecessor by filling `valid_to`, inserts a new lineage row as the active successor, and updates `active_memory_projection` to point at the latest version. Existing lineage rows remain preserved for audit and temporal reconstruction. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:554-596]

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Append-first supersede model (Chosen)** | Full audit trail, natural temporal semantics, rollback-friendly | Requires separate active projection and growing storage | 9/10 |
| In-place mutation of current lineage row | Smaller storage footprint, simpler single-row reads | Destroys history and weakens auditability | 3/10 |
| Periodic overwrite with external changelog | Reduces table growth in primary store | Splits truth across systems and complicates queries | 4/10 |

**Why this one**: It preserves every version of a memory while keeping current-state access explicit and reversible.

### Consequences

**What improves**:
- Full audit trail for every memory version.
- Temporal queries work naturally against immutable history.
- Rollback remains possible by promoting an earlier preserved version.

**What it costs**:
- Storage grows monotonically. Mitigation: rely on retention policy or external compaction tooling rather than destructive mutation.
- Active-state lookup must be maintained separately via projection rows.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Projection drifts from latest active lineage row | M | Run `validateLineageIntegrity()` and projection checks |
| Retention cost grows with version count | M | Monitor lineage row volume and plan archival tooling |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Version history and auditability are core lineage requirements |
| 2 | **Beyond Local Maxima?** | PASS | Compared against mutation and split-log alternatives |
| 3 | **Sufficient?** | PASS | Covers history, rollback, and active-state lookup together |
| 4 | **Fits Goal?** | PASS | Aligns with Hydra-inspired append-style memory evolution |
| 5 | **Open Horizons?** | PASS | Leaves room for future compaction/archive tooling without changing the contract |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Predecessor rows are closed with `valid_to` instead of being rewritten.
- Successor versions are inserted as new lineage rows and reflected in `active_memory_projection`.

**How to roll back**: Record a new superseding version that re-activates prior content, or disable lineage consumers and rely on preserved historical rows for recovery.

---

### ADR-005: Half-Open Temporal Contract [valid_from, valid_to)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-13 |
| **Deciders** | System-spec-kit maintainers |

### Context

The `asOf` temporal resolver needed an unambiguous interval model so each timestamp maps to exactly one active version. The implementation already queries lineage rows with `valid_from <= timestamp` and `(valid_to IS NULL OR valid_to > timestamp)`, which is the standard half-open contract. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:823-832]

Integrity checks also show that overlap prevention is enforced operationally rather than by schema-level interval constraints: duplicate active rows are detected after the fact by `validateLineageIntegrity()`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:857-920]

### Constraints

- Version boundaries must not produce ambiguous point-in-time results.
- Current versions need a simple representation.
- Integrity validation must work against the chosen interval semantics.

### Decision

**We chose**: Use half-open intervals for lineage validity, where `valid_from` is inclusive and `valid_to` is exclusive.

**How it works**: A record with `valid_to = NULL` is the current version. `resolveLineageAsOf(timestamp)` returns the row where `valid_from <= timestamp < valid_to`, or the open-ended active row when `valid_to` is null. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:823-848]

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Half-open intervals (Chosen)** | No boundary ambiguity, matches common temporal-system semantics | Requires careful write discipline | 9/10 |
| Closed intervals on both ends | Familiar to some readers | Boundary timestamps can resolve to two versions | 4/10 |
| Start-only timestamps with "latest before" lookup | Simpler schema story | Harder to validate overlap and active-state correctness | 5/10 |

**Why this one**: It makes point-in-time resolution deterministic and aligns cleanly with append-only version transitions.

### Consequences

**What improves**:
- Exactly one version is active at any timestamp when writes are correct.
- Temporal semantics match standard database and event-interval practice.

**What it costs**:
- Overlap integrity is managed in application logic rather than with a native interval constraint.
- Violations are detected by validation instead of being prevented by the schema alone.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Overlapping or duplicate active intervals slip through writes | H | Validate transitions and run `validateLineageIntegrity()` |
| Boundary semantics are misunderstood by maintainers | M | Keep `[valid_from, valid_to)` explicit in docs and tests |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `asOf` requires a precise interval contract |
| 2 | **Beyond Local Maxima?** | PASS | Compared against closed and start-only interval models |
| 3 | **Sufficient?** | PASS | Fully defines current, historical, and boundary behavior |
| 4 | **Fits Goal?** | PASS | Directly supports temporal resolution in lineage queries |
| 5 | **Open Horizons?** | PASS | Compatible with future DB constraints if later added |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `resolveLineageAsOf()` filters by inclusive `valid_from` and exclusive `valid_to`.
- Integrity checks flag duplicate active rows and projection drift against this contract.

**How to roll back**: Keep the same stored timestamps and swap only the resolver semantics if needed, though that would require revisiting every boundary-sensitive test and query.

---

### ADR-006: Idempotent Legacy-Memory Backfill

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-13 |
| **Deciders** | System-spec-kit maintainers |

### Context

When lineage state was introduced, pre-existing `memory_index` rows had no lineage entries. The backfill process therefore had to construct synthetic lineage chains from legacy rows while remaining safe to rerun after partial execution, schema evolution, or metadata improvements. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:930-999]

The implementation uses `ON CONFLICT(memory_id) DO UPDATE`, groups legacy rows by logical key, assigns version numbers in chronological order, and emits `BACKFILL` transitions so old memories become queryable by lineage and `asOf` resolution without duplicate inserts. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1002-1055]

### Constraints

- Existing memories must become lineage-aware without duplication.
- Operators need a safe retry path after interrupted or partial backfills.
- Synthetic history must still preserve deterministic ordering.

### Decision

**We chose**: Make `backfillLineageState()` idempotent by using conflict-upsert semantics for every legacy lineage row.

**How it works**: Each legacy memory receives a synthetic `BACKFILL` transition with version ordering derived from chronological grouping under its logical key. Reruns update lineage metadata to the expected values rather than creating duplicate lineage rows. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1002-1055]

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Idempotent upsert backfill (Chosen)** | Safe reruns, resilient to partial failure, clean operator story | Can rewrite derived metadata on rerun | 9/10 |
| One-shot insert-only migration | Simpler SQL path | Fragile under interruption and hard to recover | 4/10 |
| Manual operator repair for legacy rows | Maximum control | Slow, error-prone, and inconsistent across environments | 2/10 |

**Why this one**: It minimizes migration risk while allowing legacy memories to participate in the new lineage model immediately.

### Consequences

**What improves**:
- Backfill can be rerun safely after schema changes or failed attempts.
- Pre-lineage memories gain temporal queryability and active-projection support.

**What it costs**:
- Backfilled timestamps are synthetic, derived from `created_at` or history events rather than original lineage-intent timestamps.
- Operators must understand that reruns may rewrite lineage metadata to the expected derived state.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Synthetic timestamps are mistaken for original lineage events | M | Document `BACKFILL` semantics clearly in lineage metadata and ops docs |
| Repeated runs hide an earlier partial-write bug | M | Compare dry-run counts before and after execution and log seeded/skipped totals |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Legacy rows otherwise remain outside the lineage contract |
| 2 | **Beyond Local Maxima?** | PASS | Compared against insert-only and manual remediation approaches |
| 3 | **Sufficient?** | PASS | Handles replay, metadata correction, and temporal seeding together |
| 4 | **Fits Goal?** | PASS | Preserves migration safety while enabling lineage features retroactively |
| 5 | **Open Horizons?** | PASS | Supports future migration refinements without abandoning rerun safety |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Group legacy rows by logical key and assign deterministic version order.
- Upsert lineage rows with `BACKFILL` transitions and refresh active projections for the latest version.

**How to roll back**: Restore from checkpoint or delete the seeded lineage tables/projections and rerun backfill after correcting the migration logic.

---

### ADR-007: Roadmap Capability Flags != Live Runtime Gates

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-13 |
| **Deciders** | System-spec-kit maintainers |

### Context

The Hydra roadmap needed a stable capability snapshot for telemetry and migration checkpoints, but production rollout posture is not identical across all delivered phases. The roadmap flag module explicitly describes itself as phase-tracking metadata, keeps those controls distinct from unrelated live runtime flags, and defaults adaptive ranking to dormant/off unless explicitly enabled. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:5-7] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:36-38] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:77-98] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:114-151]

Phase 4 documentation also requires adaptive ranking to stay in shadow mode until promotion criteria are met, while Phase 6 documentation keeps shared memory opt-in and deny-by-default. The shared-memory handler separately supports an environment override, reinforcing that capability snapshots and live enablement posture are related but not identical concepts. [SOURCE: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/004-adaptive-retrieval-loops/spec.md:22-25] [SOURCE: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/006-shared-memory-rollout/spec.md:22-25] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:431-433]

### Constraints

- Telemetry and checkpoints need a coherent roadmap snapshot.
- Dormant or opt-in phases must not be mistaken for broad default-on runtime behavior.
- Operators need clear separation between roadmap reporting and live rollout controls.

### Decision

**We chose**: Treat roadmap capability flags surfaced by `getMemoryRoadmapDefaults()` as roadmap-state metadata, not as the single source of truth for live feature activation.

**How it works**: Capability snapshots describe what has been delivered in the phased roadmap and the intended rollout posture. Live runtime behavior still depends on feature-specific controls such as shadow-mode guardrails, opt-in rollout policy, environment overrides, and database/governance state. Adaptive ranking remains dormant/default-off until explicitly promoted. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:125-129] [SOURCE: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/004-adaptive-retrieval-loops/spec.md:22-25]

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Separate roadmap metadata from runtime enablement (Chosen)** | Prevents accidental activation and preserves honest rollout reporting | Requires documenting two related control layers | 9/10 |
| Single flag system for roadmap and runtime | Simpler mental model | Conflates shipped capability with safe live posture | 4/10 |
| Manual status tracking outside code | Flexible narrative control | Drifts from implementation and weakens checkpoint fidelity | 3/10 |

**Why this one**: It preserves a truthful roadmap snapshot while leaving safety-critical runtime activation under narrower controls.

### Consequences

**What improves**:
- Clearer distinction between "built" and "enabled."
- Lower risk of dormant features activating accidentally through roadmap reporting paths.

**What it costs**:
- Maintainers must understand and document two related flag systems.
- Feature catalog and rollout docs must explain capability metadata versus runtime state.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Maintainers misread roadmap metadata as live behavior | M | Cross-link roadmap docs, runtime flags, and rollout specs |
| Drift emerges between checkpoint snapshots and real rollout posture | M | Keep tests and docs aligned on dormant/opt-in defaults |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Dormant adaptive ranking and opt-in shared memory require distinct rollout semantics |
| 2 | **Beyond Local Maxima?** | PASS | Compared against unified and manual status models |
| 3 | **Sufficient?** | PASS | Separates checkpoint reporting from safety-critical live controls |
| 4 | **Fits Goal?** | PASS | Matches the phased Hydra roadmap without overexposing unfinished posture |
| 5 | **Open Horizons?** | PASS | Supports future rollout changes without breaking the reporting contract |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `getMemoryRoadmapDefaults()` remains the canonical checkpoint/telemetry snapshot.
- Live feature posture stays governed by feature-specific rollout, shadow-mode, and shared-memory controls.

**How to roll back**: Collapse the distinction only if the roadmap and runtime systems are intentionally unified later, which would require coordinated changes to telemetry, docs, and rollout safeguards.

---

### ADR-008: Logical Key Identity Contract (spec_folder::canonical_path::anchor)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-13 |
| **Deciders** | System-spec-kit maintainers |

### Context

Lineage needed a stable identity for "the same logical memory" across content revisions so versions could be grouped, ordered, backfilled, and resolved over time. The storage layer builds a logical key as `spec_folder::canonical_path::anchor`, falling back to canonicalized path and `_` for missing anchors, then uses that key for grouping lineage and projection state. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:184-195] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:945-953]

The implementation warns when any component already contains the `::` separator, which keeps ambiguous keys visible to operators without blocking current writes. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:191-195]

### Constraints

- Identity must remain stable across content edits and lineage backfill.
- The contract must support sub-document versioning.
- The key format must be derivable from existing stored fields.

### Decision

**We chose**: Define `logical_key` as `spec_folder::canonical_path::anchor`, generated by `buildLogicalKey()`, as the canonical lineage identity contract.

**How it works**: Memories that share the same logical key are treated as versions of the same concept. The anchor component supports sub-document granularity, while path canonicalization reduces accidental drift from file-path variations. Separator collisions emit warnings rather than hard failures. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:184-195]

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Structured logical key contract (Chosen)** | Stable grouping, supports anchors, derivable from existing metadata | Renames create new identity unless migrated | 9/10 |
| Memory ID as lineage identity | Simple and unique | Cannot connect later versions of the same logical memory | 2/10 |
| Content hash as primary identity | Stable for unchanged content | Breaks across legitimate edits and conflates duplicates | 4/10 |

**Why this one**: It best captures the logical document identity the lineage system actually needs, rather than the identity of one physical row snapshot.

### Consequences

**What improves**:
- Versions can be grouped and ordered reliably by logical concept.
- Anchor-based sub-document versioning is supported directly.
- Content and metadata updates do not change identity as long as the logical location stays stable.

**What it costs**:
- Renaming the spec folder or canonical path creates a new logical key unless an explicit migration is added.
- Separator validation is warning-only, so malformed-but-accepted keys remain theoretically possible.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Path or folder rename fractures lineage continuity | M | Add migration tooling when rename continuity becomes a requirement |
| Ambiguous separators in component values confuse grouping | L | Keep warning telemetry and strengthen validation later if needed |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Lineage grouping needs a stable logical identity across versions |
| 2 | **Beyond Local Maxima?** | PASS | Compared against row-ID and content-hash identity models |
| 3 | **Sufficient?** | PASS | Covers document path, scope, and anchor granularity together |
| 4 | **Fits Goal?** | PASS | Directly supports grouping, backfill, and temporal lookup |
| 5 | **Open Horizons?** | PASS | Can be migrated or hardened later without rewriting lineage semantics |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `buildLogicalKey()` constructs the lineage identity from spec folder, canonical path, and anchor.
- Backfill, projection lookup, and temporal resolution all operate on that logical key contract.

**How to roll back**: Introduce a replacement identity mapping layer and migrate stored logical keys, but doing so would require coordinated lineage rewrite tooling.

---

### Assumptions and Notes

- HydraDB and Cortex are treated as one branding family for planning.
- No public HydraDB source repository was available during this planning session.
- docs.useHydraDB.ai links referenced by blog pages were not resolvable during this session.
- ADR statuses updated to `Accepted` following successful implementation and verification of all 6 phases (`7790` tests passing).

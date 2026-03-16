---
title: "Decision Record: 008-hydra-db-based-features [template:level_3/decision-record.md]"
description: "Architecture decisions for HydraDB-inspired evolution of system-spec-kit Memory MCP server."
SPECKIT_TEMPLATE_SOURCE: "decision-record | v2.2"
trigger_phrases:
  - "decision"
  - "record"
  - "adr"
  - "hydra"
  - "architecture"
importance_tier: "critical"
contextType: "decision"
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

## ADR-002: Unify Graph and Feedback Inside Current MCP Server First

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
| **In-process unification (Chosen)** | Fastest to value, lower ops burden, reuses modules | Adds complexity to current server |
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

## ADR-003: Enforce Hierarchical Scopes and Governance Before Shared Memory Rollout

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

## Assumptions and Notes

- HydraDB and Cortex are treated as one branding family for planning.
- No public HydraDB source repository was available during this planning session.
- docs.useHydraDB.ai links referenced by blog pages were not resolvable during this session.
- ADR statuses updated to `Accepted` following successful implementation and verification of all 6 phases (7,767 tests passing).

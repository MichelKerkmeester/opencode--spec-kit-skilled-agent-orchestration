---
title: "Decision Record: SpecKit Reimagined [082-speckit-reimagined/decision-record]"
description: "The current SpecKit search relies on vector + FTS5 with partial RRF fusion. Comparative analysis of dotmd, seu-claude, and drift systems revealed that multi-engine approaches wi..."
trigger_phrases:
  - "decision"
  - "record"
  - "speckit"
  - "reimagined"
  - "decision record"
  - "082"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: SpecKit Reimagined

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

---

## ADR-001: Search/Retrieval Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Analysis Team |

---

### Context

The current SpecKit search relies on vector + FTS5 with partial RRF fusion. Comparative analysis of dotmd, seu-claude, and drift systems revealed that multi-engine approaches with graph traversal discover relationships that pure vector+keyword searches miss.

### Constraints
- Must maintain backward compatibility with existing memory files
- API latency must remain under 200ms (p95)
- Cannot require external graph database infrastructure initially

---

### Decision

**Summary**: Adopt dotmd's triple-hybrid search approach with RRF fusion (k=60), 1.5x graph weight boost, and 10% convergence bonus for multi-source results.

**Details**: Implement vector (existing) + BM25 (new via FTS5) + graph traversal (new via SQLite relations) with Reciprocal Rank Fusion. Graph results receive 1.5x weight multiplier. Results appearing in 2+ engines receive 10% convergence bonus.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Triple-hybrid + RRF (dotmd)** | Most comprehensive discovery, handles conceptual + exact + relational queries | Higher complexity, requires BM25 + graph implementation | 9/10 |
| 70/30 semantic-keyword (seu-claude) | Simple, low latency | Misses graph relationships, rigid weighting | 6/10 |
| Intent-based weighting (drift) | Context-aware retrieval | Requires query classification overhead | 7/10 |
| Current: Vector + FTS5 partial | Already implemented | Lacks graph, no convergence bonus | 5/10 |

**Why Chosen**: dotmd's approach provides the most comprehensive discovery mechanism. The 1.5x graph weight addresses the current gap where related memories are not surfaced. RRF with k=60 is an industry-proven fusion algorithm.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Gap analysis shows HIGH severity for missing graph traversal |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated with trade-offs |
| 3 | **Sufficient?** | PASS | Simpler 70/30 split doesn't address graph discovery gap |
| 4 | **Fits Goal?** | PASS | Directly improves search relevance (+40-50% projected) |
| 5 | **Open Horizons?** | PASS | SQLite-based allows future LadybugDB migration if needed |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- 40-50% improvement in search relevance (projected)
- Graph traversal enables "why" queries
- Convergence bonus rewards well-connected knowledge

**Negative**:
- Increased query complexity - Mitigation: Cache fusion results per session
- BM25 index maintenance overhead - Mitigation: Incremental indexing with content hash

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| RRF tuning complexity | M | Ship with k=60 default, tune after baseline |
| Cross-encoder latency | M | Optional, limit to 20 candidates, cache results |

---

### Implementation

**Affected Systems**:
- `lib/search/vector-index.js` - Add BM25 search
- `lib/search/` - New `rrf-fusion.js` module
- Database schema v5 - Add `causal_edges` table

**Rollback**: Feature flag `ENABLE_RRF_FUSION=false` falls back to current vector+FTS5 search

**Code Reference**: Appendix A.1 - RRF Fusion with Convergence Bonus

---

## ADR-002: Memory Decay Algorithm

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Analysis Team |

---

### Context

SpecKit uses FSRS v4 for temporal decay but lacks multi-factor scoring. Drift uses 5 signals (temporal x citation x usage x importance x pattern_alignment) providing richer relevance scoring.

### Constraints
- Must preserve existing FSRS stability calculations
- Constitutional memories must never decay
- Computation must add <10ms to retrieval

---

### Decision

**Summary**: Combine FSRS's scientifically-validated temporal decay with drift's multi-factor composition: temporal x usage x importance x pattern x citation.

**Details**: Base formula uses FSRS R(t,S) = (1 + 0.235 x t/S)^(-0.5). Multiply by usage boost (capped at 1.5x), importance tier anchor, pattern alignment (1.2x if matching), and citation recency (1.1x if cited recently).

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **FSRS + drift multi-factor** | Scientifically grounded + rich signals | More complex scoring | 9/10 |
| FSRS only (current) | Simple, validated | Ignores usage and context signals | 6/10 |
| Drift 5-factor only | Rich signals | No scientific basis for temporal curve | 7/10 |
| No decay (dotmd/seu-claude) | Simplest | Context pollution over time | 3/10 |

**Why Chosen**: FSRS provides the temporal decay curve with scientific backing from spaced repetition research. Drift's multi-factor approach captures behavioral signals (usage, citations) that FSRS doesn't address.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Gap analysis shows MEDIUM severity for missing multi-factor decay |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated |
| 3 | **Sufficient?** | PASS | Adding factors is minimal complexity |
| 4 | **Fits Goal?** | PASS | +30-40% relevance improvement projected |
| 5 | **Open Horizons?** | PASS | Factors are configurable, not hardcoded |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- +15% relevance from usage tracking alone
- +20% tier differentiation accuracy
- Frequently-accessed memories surface appropriately

**Negative**:
- Requires `access_count` and `last_accessed_at` columns - Mitigation: Non-breaking schema v4.1 migration
- More computation per result - Mitigation: Pre-compute composite scores nightly

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Half-life misconfiguration | H | Document defaults, provide reset command |

---

### Implementation

**Affected Systems**:
- `lib/cognitive/attention-decay.js` - Enhanced decay function
- `lib/scoring/composite-scoring.js` - New multi-factor scoring
- Schema v4.1 - Add `access_count`, `last_accessed_at` columns

**Rollback**: Feature flag `ENABLE_TYPE_DECAY=false` uses current FSRS-only decay

**Code Reference**: Appendix A.2 - Multi-Factor Decay Composite, Appendix A.6 - Unified Decay Function

---

## ADR-003: Session Management Pattern

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Analysis Team |

---

### Context

Current SpecKit uses periodic checkpoints. Analysis shows drift achieves 8-16x token savings on follow-up queries via session deduplication. Seu-claude provides zero data loss via immediate SQLite saves.

### Constraints
- Must support recovery from unexpected shutdowns
- Session state overhead must be bounded
- Cannot lose work on crash

---

### Decision

**Summary**: Combine drift's session deduplication with seu-claude's immediate SQLite persistence.

**Details**: Track sent memories per session using hash-based deduplication. Persist session state to SQLite after each memory send (not batched). Sessions expire after 30 minutes of inactivity, capped at 100 entries.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Drift dedup + seu-claude persistence** | 25-35% token savings, zero data loss | Higher write frequency | 9/10 |
| Periodic checkpoints (current) | Simple, lower I/O | Data loss on crash | 5/10 |
| In-memory only | Fastest | Complete loss on crash | 3/10 |
| Drift deduplication only | Token savings | No crash recovery | 6/10 |

**Why Chosen**: Session deduplication provides significant token savings (25-35% on follow-up queries). Immediate SQLite persistence is cheap (1-2ms) and prevents data loss.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Consensus P0 item across 3/4 analysis docs |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated |
| 3 | **Sufficient?** | PASS | Hash-based dedup is minimal overhead |
| 4 | **Fits Goal?** | PASS | Directly reduces token usage |
| 5 | **Open Horizons?** | PASS | Session state schema is extensible |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- 25-35% token savings on follow-up queries
- Zero data loss on crash
- 8-16x savings on repeated context requests

**Negative**:
- Higher write frequency - Mitigation: SQLite WAL mode handles concurrent writes efficiently
- Session state memory - Mitigation: 30min TTL, 100 entry cap

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Session state overhead | L | Conservative limits (30min TTL, 100 cap) |

---

### Implementation

**Affected Systems**:
- New `lib/session/session-manager.js` module
- `lib/storage/` - Session state table in SQLite
- All tool handlers - Check deduplication before sending

**Rollback**: Feature flag skips deduplication check, falls back to sending all matches

**Code Reference**: Appendix A.3 - Session Manager with Deduplication

---

## ADR-004: Graph Relationships

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Analysis Team |

---

### Context

SpecKit has no graph support. Dotmd uses 3 relationship types (LINKS_TO, CO_OCCURS, MENTIONS) while drift uses 8 causal types that better model decision lineage.

### Constraints
- Must work with SQLite (no external graph database initially)
- Relationship extraction should be automatable
- Must support "why was this decision made" queries

---

### Decision

**Summary**: Implement 6 causal relationship types (caused, enabled, supersedes, contradicts, derived_from, supports) via SQLite join tables.

**Details**: Create `causal_edges` table with source_id, target_id, relation type, strength, and evidence. Index on both source and target for bidirectional traversal. Use Q6 resolution: SQLite is simpler and sufficient for current scale.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Drift 6 causal types (SQLite)** | Rich decision lineage, simple infra | Manual extraction initially | 9/10 |
| Dotmd 3 types (Cypher/LadybugDB) | Graph query language | External dependency, overkill for scale | 6/10 |
| No graph support (current) | Simplest | Cannot answer "why" queries | 3/10 |
| Simple LINKS_TO only | Low effort | Misses causal semantics | 5/10 |

**Why Chosen**: Causal relationships (supersedes, contradicts, caused) directly support decision lineage queries. SQLite is sufficient until >10K nodes (Q6 resolution). 6 types cover decision modeling needs without excessive granularity.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Gap analysis shows HIGH severity for missing graph |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated including LadybugDB |
| 3 | **Sufficient?** | PASS | 6 types cover decision modeling needs |
| 4 | **Fits Goal?** | PASS | Enables "why" queries (60% coverage target) |
| 5 | **Open Horizons?** | PASS | SQLite schema migrates to LadybugDB if needed |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Enables "why was this decision made" queries
- 60% memory linkage target (from 0%)
- Foundation for learning from corrections

**Negative**:
- Initial manual extraction required - Mitigation: Add automatic extraction via GLiNER (P2)
- Join overhead on queries - Mitigation: Index heavily on source_id, target_id

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Graph scaling at >10K nodes | M | Consider LadybugDB migration at threshold |

---

### Implementation

**Affected Systems**:
- Schema v5 - New `causal_edges` table
- New `lib/graph/` module for traversal
- `memory_drift_why` tool for lineage queries

**Rollback**: Feature flag `ENABLE_RELATIONS=false` skips graph queries

**Code Reference**: Section 1.4 - Causal Edges Schema, Appendix A.8 - Causal Chain Query

---

## ADR-005: Learning System

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Analysis Team |

---

### Context

SpecKit uses PE (Prediction Error) gating for quality validation but doesn't learn from corrections. Drift tracks original vs correction and applies 0.5x stability penalty, providing richer learning signals.

### Constraints
- Must not automatically degrade high-quality memories
- Constitutional memories exempt from learning penalties
- Learning should be explicit, not implicit

---

### Decision

**Summary**: Implement drift's correction tracking with explicit confidence adjustment based on outcome (accepted: 1.05x, modified: 0.95x, rejected: 0.80x) and 0.5x stability penalty for corrected memories.

**Details**: Create `memory_corrections` table tracking original_memory_id, correction_type (superseded, deprecated, refined, merged), and correction_reason. Apply stability penalty to original, boost replacement.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Drift correction tracking** | Explicit learning, rich signals | Requires tracking infrastructure | 8/10 |
| TDD binary signals (seu-claude) | Simple pass/fail | Too coarse for memory quality | 5/10 |
| PE gating only (current) | Validates quality | Doesn't learn from mistakes | 4/10 |
| Self-correction learning | Fully automatic | HIGH effort, LOW impact per analysis | 3/10 |

**Why Chosen**: Explicit correction tracking provides richer signals than binary pass/fail. Self-correction learning was evaluated and deferred to P4 due to HIGH effort, LOW impact ratio.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Gap analysis shows LOW severity but enables future learning |
| 2 | **Beyond Local Maxima?** | PASS | Self-correction alternative explicitly deferred |
| 3 | **Sufficient?** | PASS | Tracking is minimal foundation for learning |
| 4 | **Fits Goal?** | PASS | Enables outdated memories to fade naturally |
| 5 | **Open Horizons?** | PASS | Schema supports future ML-based learning |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- System learns from mistakes
- Outdated memories fade automatically
- Foundation for pattern extraction

**Negative**:
- Requires user to mark corrections explicitly - Mitigation: Provide simple `memory_correct` tool

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Learning system errors/bias | M | Feature flag, allow undo |

---

### Implementation

**Affected Systems**:
- Schema v5 - New `memory_corrections` table
- New `memory_correct` tool
- `lib/learning/` module for confidence adjustment

**Rollback**: Disable via feature flag, corrections recorded but penalties not applied

**Code Reference**: Section 10.9 - Corrections Tracking Schema, Section 1.5 - Confidence Adjustment

---

## ADR-006: Token Efficiency

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Analysis Team |

---

### Context

SpecKit's ANCHOR format achieves ~93% token savings via section-level retrieval. Drift provides 4-level compression (10 to 500+ tokens). Analysis confirms SpecKit's approach is best-in-class.

### Constraints
- Must maintain ANCHOR format compatibility
- Compression levels should be selectable per query
- Full content must remain accessible when needed

---

### Decision

**Summary**: Retain SpecKit's ANCHOR format and enhance with drift-style 4-level compression tiers (minimal, compact, standard, full).

**Details**: Each compression tier specifies target tokens, included fields, snippet length, and anchor selection. Minimal (~100 tokens) for quick checks, full (unlimited) for deep investigation.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **ANCHOR + compression tiers** | Best savings + flexibility | Slightly more complex API | 9/10 |
| ANCHOR only (current) | Simple, effective | Fixed compression level | 7/10 |
| Drift 4-level only | Flexible | Loses ANCHOR format benefits | 6/10 |
| Query expansion (dotmd) | Better recall | Can increase tokens | 5/10 |

**Why Chosen**: ANCHOR format is already best-in-class (~93% savings). Adding compression tiers provides flexibility without breaking existing format.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Token efficiency is P0 constraint |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated all 4 systems' approaches |
| 3 | **Sufficient?** | PASS | Enhancement, not replacement |
| 4 | **Fits Goal?** | PASS | Configurable tokens per search |
| 5 | **Open Horizons?** | PASS | Tiers are configurable |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Configurable token budget per query
- Minimal tier enables rapid context checks
- Preserves ~93% savings from ANCHOR

**Negative**:
- API adds compression parameter - Mitigation: Default to "standard" tier

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Compression loses critical info | L | Full tier always available |

---

### Implementation

**Affected Systems**:
- `lib/parsing/memory-parser.js` - Compression tier support
- All search tools - Add `compression` parameter
- Documentation - Tier selection guidance

**Rollback**: Default tier matches current behavior

**Code Reference**: Section 1.6 - Token Efficiency, Appendix A.9 - Compression Tiers Implementation

---

## ADR-007: Architecture Pattern

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Analysis Team |

---

### Context

Seu-claude uses hexagonal architecture (Ports & Adapters) for maximum testability. Dotmd uses protocol-based DI for swappable backends. Current SpecKit uses direct modules with tight coupling.

### Constraints
- Must not require full architectural rewrite
- Must enable vector store swapping (e.g., LanceDB to different provider)
- Must enable embedding provider swapping

---

### Decision

**Summary**: Adopt targeted protocol abstractions at integration boundaries (IVectorStore, IEmbeddingProvider), not full hexagonal architecture.

**Details**: Define interfaces for vector store and embedding provider. Implement current SQLite/Voyage as default implementations. This enables testing and future provider swaps without full hexagonal scaffolding.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Targeted protocols** | Testable boundaries, low effort | Not full DI | 8/10 |
| Full hexagonal (seu-claude) | Best testability | 16-24 hours, over-engineering for scale | 5/10 |
| Protocol-based DI (dotmd) | Swappable everything | Higher complexity | 7/10 |
| Direct modules (current) | Simplest | Tight coupling, hard to test | 4/10 |

**Why Chosen**: Full hexagonal is over-engineering for current scale (per analysis, deferred to P3). Targeted protocols at IVectorStore and IEmbeddingProvider boundaries provide 80% of the benefit with 20% of the effort.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Enables testing and provider swapping |
| 2 | **Beyond Local Maxima?** | PASS | Full hexagonal explicitly deferred |
| 3 | **Sufficient?** | PASS | Covers main integration points |
| 4 | **Fits Goal?** | PASS | Improves testability |
| 5 | **Open Horizons?** | PASS | Can expand to full hexagonal later |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Vector store can be mocked for testing
- Embedding provider swappable (Voyage vs local)
- 8-12 hours effort vs 16-24 for full hexagonal

**Negative**:
- Not full DI - Mitigation: Can expand boundaries incrementally

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Incomplete abstraction | L | Start with highest-value boundaries |

---

### Implementation

**Affected Systems**:
- New `interfaces/IVectorStore.ts` (TypeScript types for documentation)
- New `interfaces/IEmbeddingProvider.ts`
- `lib/search/vector-index.js` - Implement IVectorStore

**Rollback**: N/A - Interfaces are additive

**Code Reference**: Section 1.7 - Architecture Patterns, Appendix A.5 - Interface-Based DI

---

## ADR-008: Tool Organization

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | Architecture Analysis Team |

---

### Context

Drift uses 50+ tools across 7 layers with token budgets. Current SpecKit has 17 tools in 4 flat categories. Seu-claude has 6 grouped by function. Dotmd has 3 flat.

### Constraints
- Must guide AI to appropriate tool selection
- Must indicate token cost before invocation
- Must support progressive disclosure (simple to advanced)

---

### Decision

**Summary**: Implement layered tools with progressive disclosure: L1 Orchestration, L2 Discovery, L3 Surgical, L4 Exploration, L5 Detail, with token budget indicators in tool descriptions.

**Details**: Enhance tool schema with layer prefix and budget range. AI can select appropriate layer based on task. Budgets guide token planning.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Layered with budgets** | Progressive disclosure, token guidance | Reorganization effort | 8/10 |
| 7 layers (drift) | Most granular | 50+ tools is overwhelming | 6/10 |
| 4 flat categories (current) | Simple | No token guidance | 5/10 |
| 6 grouped (seu-claude) | Clean grouping | No budgets | 6/10 |

**Why Chosen**: 5 layers (condensed from drift's 7) provide progressive disclosure without overwhelming. Token budgets in descriptions enable AI planning.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Improves AI tool selection |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated drift's 7-layer and simplified |
| 3 | **Sufficient?** | PASS | 5 layers covers use cases |
| 4 | **Fits Goal?** | PASS | Progressive disclosure aids discovery |
| 5 | **Open Horizons?** | PASS | Layers can be adjusted |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- AI selects appropriate layer for task
- Token budgets prevent context overflow
- Progressive disclosure (L1 for most tasks)

**Negative**:
- Tool description changes - Mitigation: Additive prefix, doesn't break existing

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Layer mismatch | L | Clear layer descriptions |

---

### Implementation

**Affected Systems**:
- All tool definitions - Add layer/budget prefix
- MCP server - `enhanceToolSchema()` function
- Documentation - Layer selection guidance

**Rollback**: Remove prefixes (cosmetic change)

**Code Reference**: Section 1.8 - Tool Organization, Section 10.12 - 7-Layer MCP Architecture

---

## ADR-009: Embedding Resilience Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-01 |
| **Deciders** | 10-Agent Parallel Analysis Team |

---

### Context

During a memory save operation, the Voyage API returned "Provided API key is invalid" error, causing complete save failure. Investigation revealed that:
1. API key validation only occurs at use-time, not startup
2. Voyage provider has no retry logic - single failure means complete failure
3. `memory_save` couples file creation with embedding generation - embedding failure blocks file save
4. Fallback to local model exists but only triggers at initialization, not runtime
5. Schema has `embedding_status` column but it's not leveraged for deferred indexing

This represents a single point of failure that violates the system's reliability goals.

### Constraints
- Must not block memory saves due to embedding API failures
- Must provide graceful degradation with BM25-only search
- Must support background retry for pending embeddings
- Must validate API credentials at startup to fail fast

---

### Decision

**Summary**: Implement defense-in-depth embedding resilience with 4 layers: pre-flight validation, fallback chain, deferred indexing, and retry with backoff.

**Details**:
1. **Pre-flight validation**: Validate API key at MCP startup with 5s timeout; fail-fast with actionable E050 error
2. **Fallback chain**: Primary API → Local (nomic-embed-text) → BM25-only; each step logged
3. **Deferred indexing**: Save memory file with `embedding_status: 'pending'`; searchable via BM25; background retry
4. **Retry with backoff**: 3 retries (1s, 2s, 4s) for transient errors; fail-fast for 401/403

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defense-in-depth (4 layers)** | Comprehensive, no single point of failure | Higher complexity | 9/10 |
| Pre-flight validation only | Simple, catches invalid keys early | Doesn't handle runtime failures | 5/10 |
| Fallback chain only | Handles provider failures | Doesn't validate at startup, no retry | 6/10 |
| Retry logic only | Handles transient failures | Doesn't handle permanent failures or missing fallback | 5/10 |
| Block on failure (current) | Simplest | Single point of failure, poor UX | 2/10 |

**Why Chosen**: Defense-in-depth provides comprehensive protection against all failure modes identified in the 10-agent analysis. Each layer addresses a specific failure scenario: pre-flight catches invalid credentials, fallback handles provider unavailability, deferred indexing ensures saves never block, and retry handles transient issues.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Memory save failure directly observed; blocks core workflow |
| 2 | **Beyond Local Maxima?** | PASS | 5 alternatives evaluated with trade-offs |
| 3 | **Sufficient?** | PASS | 4 layers cover all identified failure modes |
| 4 | **Fits Goal?** | PASS | Directly addresses NFR-R02, NFR-R03 reliability requirements |
| 5 | **Open Horizons?** | PASS | IEmbeddingProvider interface allows future provider additions |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Zero memory saves blocked by embedding failures
- Graceful degradation to BM25-only search
- Fast startup failure for invalid credentials
- Automatic retry for transient issues

**Negative**:
- Increased complexity in embedding layer - Mitigation: Clear separation of concerns via provider chain pattern
- Background retry job adds operational overhead - Mitigation: Configurable via ENABLE_EMBEDDING_RETRY env var

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Pending embeddings never complete | M | Alert if pending > 24h; manual retry command |
| BM25-only mode has lower relevance | L | Log when in fallback mode; surface to user |

---

### Implementation

**Affected Systems**:
- `shared/embeddings/factory.js` - Pre-flight validation + fallback chain
- `shared/embeddings/providers/voyage.js` - Retry logic
- `handlers/memory-save.js` - Deferred indexing
- `database/schema.sql` - v4.2 migration for embedding_status
- New `lib/jobs/embedding-retry.js` - Background retry

**Rollback**: Feature flags: `ENABLE_PREFLIGHT_VALIDATION`, `ENABLE_FALLBACK_CHAIN`, `ENABLE_DEFERRED_INDEXING`, `ENABLE_EMBEDDING_RETRY`

**Code Reference**: REQ-029 to REQ-033, NFR-R03 to NFR-R05

---

## Open Questions Resolutions

The following open questions from Section 9 were resolved during analysis:

| ID | Question | Resolution | Rationale |
|----|----------|------------|-----------|
| Q1 | How to populate `memory_type` automatically? | Infer from file path + frontmatter fallback | File path patterns (e.g., `/references/`) indicate type reliably |
| Q2 | What RRF k parameter works best? | k=60 default | Industry standard, tune after baseline established |
| Q3 | Cross-encoder selection: which provider? | Configurable (Voyage rerank-2 recommended) | Better performance on code/technical content; other providers supported |
| Q6 | Graph database: SQLite relations vs LadybugDB? | SQLite | Simpler, sufficient for current scale (<10K nodes) |

---

## Session Decision Log

> **Purpose**: Track all gate decisions made during this session for audit trail and learning.

| Timestamp | Gate | Decision | Confidence | Uncertainty | Evidence |
|-----------|------|----------|------------|-------------|----------|
| 10:00 | ADR-001 Search | ACCEPT | HIGH | 0.10 | 4 alternatives evaluated, dotmd provides best coverage |
| 10:15 | ADR-002 Decay | ACCEPT | HIGH | 0.15 | FSRS validated, drift factors add behavioral signals |
| 10:30 | ADR-003 Session | ACCEPT | HIGH | 0.10 | Consensus P0 across 3/4 analysis docs |
| 10:45 | ADR-004 Graph | ACCEPT | HIGH | 0.20 | Q6 resolved: SQLite sufficient for scale |
| 11:00 | ADR-005 Learning | ACCEPT | MEDIUM | 0.25 | Self-correction explicitly deferred to P4 |
| 11:15 | ADR-006 Tokens | ACCEPT | HIGH | 0.10 | ANCHOR already best-in-class |
| 11:30 | ADR-007 Architecture | ACCEPT | HIGH | 0.15 | Full hexagonal deferred as P3 |
| 11:45 | ADR-008 Tools | ACCEPT | HIGH | 0.15 | Drift's 7 layers condensed to 5 |
| 14:30 | ADR-009 Embedding | ACCEPT | HIGH | 0.10 | 10-agent parallel analysis; 5 alternatives evaluated |

**Log Instructions**:
- Record each gate decision as it occurs during the session
- Include both PASS and BLOCK decisions for completeness
- Link to relevant ADR if decision resulted in new architecture record

---

<!--
Level 3+ Decision Record
Document significant technical decisions
One ADR per major decision
Includes Session Decision Log for audit trail
Generated: 2026-02-01
Source: consolidated-analysis.md (25-agent parallel analysis synthesis)
-->

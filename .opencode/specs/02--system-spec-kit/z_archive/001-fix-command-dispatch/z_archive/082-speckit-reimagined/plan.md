---
title: "Implementation Plan: SpecKit Reimagined [082-speckit-reimagined/plan]"
description: "This plan implements a comprehensive enhancement to SpecKit's memory system based on consolidated analysis of dotmd, seu-claude, drift, and system-speckit architectures. The imp..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "speckit"
  - "reimagined"
  - "082"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: SpecKit Reimagined

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript/TypeScript |
| **Framework** | MCP Server |
| **Storage** | SQLite + Vector Store |
| **Testing** | Jest |

### Overview

This plan implements a comprehensive enhancement to SpecKit's memory system based on consolidated analysis of dotmd, seu-claude, drift, and system-speckit architectures. The implementation follows a 4-phase approach across 6-7 weeks, introducing session deduplication for 25-35% token savings, multi-factor decay with type-specific half-lives, RRF search fusion for 40-50% relevance improvement, and a causal memory graph for decision lineage.

> **[AUDIT 2026-02-01]:** Timeline corrected from 11 weeks to 6-7 weeks. Original estimate included parallel workstreams counted sequentially and overestimated phase dependencies. Phases 1-2 can overlap significantly; Phase 3 consolidation work is largely independent.

**Note:** RRF fusion, composite scoring (6 factors), FSRS integration, and 5-state tier classification already exist in the codebase. This plan enhances these existing capabilities.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (consolidated-analysis.md)
- [x] Success criteria measurable (KPIs defined in Section 7)
- [x] Dependencies identified (Dependency Graph in Section 5.4)

### Definition of Done
- [ ] All P0 items implemented and tested
- [ ] Token savings validated (25-35% on follow-up)
- [ ] MCP startup time < 500ms
- [ ] Search relevance improvement measured (+40%)
- [ ] All tests passing
- [ ] Documentation updated

---

## 3. ARCHITECTURE

### Pattern
Protocol-Based Dependency Injection with targeted abstractions at integration boundaries (per Section 1.7).

**Rationale:** Avoids over-engineering of full hexagonal architecture while enabling swappable backends for vector store and embedding providers.

### Key Components

- **SessionManager**: Hash-based deduplication preventing context pollution (drift pattern)
- **CompositeScorer**: Multi-factor decay combining FSRS temporal + usage + importance + pattern + citation
- **RRFEngine**: Triple-hybrid search fusion (vector + BM25 + optional graph) with k=60 and convergence bonus
- **CausalGraph**: Relationship tracking with 6 edge types (caused, enabled, supersedes, contradicts, derived_from, supports)
- **LazyModelLoader**: Singleton pattern for deferred embedding initialization

### Priority Protocol Abstractions

```typescript
interface IVectorStore {
  search(embedding: number[], topK: number): Promise<SearchResult[]>;
  upsert(id: string, embedding: number[], metadata: object): Promise<void>;
}

interface IEmbeddingProvider {
  embed(text: string): Promise<number[]>;
  batchEmbed(texts: string[]): Promise<number[][]>;
}
```

### Data Flow

```
Query → QueryExpansion → [Vector|BM25|Graph] parallel search
                                  ↓
                          RRF Fusion (k=60)
                                  ↓
                    Multi-Factor Decay Scoring
                                  ↓
                      Session Deduplication
                                  ↓
                  Optional Cross-Encoder Rerank
                                  ↓
                       Compression & Response
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Quick Wins (Week 1)

**Milestone:** 25-35% token savings + 50-70% faster startup

| Day | Item | Effort | Deliverable |
|-----|------|--------|-------------|
| 1 | Session Deduplication | 3-4h | Hash-based duplicate prevention |
| 1-2 | Type-Specific Half-Lives | 2-3h | Config with 9 memory types |
| 2 | Recovery Hints in Errors | 2h | Error catalog with guidance |
| 3 | Tool Output Caching | 3-4h | Session-scoped cache |
| 4-5 | Lazy Model Loading | 4-6h | Deferred embedding init |

**Total Phase 1 Effort:** 14-19 hours

- [ ] SessionManager class with `shouldSendMemory()` and `markMemorySent()`
- [ ] HALF_LIVES_DAYS config for 9 memory types
- [ ] RECOVERY_HINTS error catalog
- [ ] Session-scoped cache with 60s TTL
- [ ] Lazy singleton for embedding provider

### Phase 2: Core Enhancements (Weeks 2-3)

**Milestone:** 40-50% relevance improvement

| Week | Item | Effort | Deliverable |
|------|------|--------|-------------|
| 2 | RRF Search Fusion | 5d | k=60 fusion with convergence bonus |
| 2-3 | BM25 Hybrid Search | 5d | FTS5 + vector combination |
| 3 | Multi-Factor Decay Composite | 3d | 5-factor scoring |
| 3 | Standardized Response Structure | 2d | Envelope: summary, data, hints, meta |

**Total Phase 2 Effort:** ~15 days

- [ ] `rrfFusion()` with vector, BM25, graph weights
- [ ] FTS5 integration for keyword retrieval
- [ ] `calculateCompositeScore()` with 5 factors
- [ ] Response envelope with _meta, _hints fields

### Phase 3: Strategic (Weeks 4-10)

**Milestone:** Self-improving memory system with causal lineage

| Week | Item | Effort | Deliverable |
|------|------|--------|-------------|
| 4-5 | Causal Memory Graph | 10d | causal_edges table + relationships |
| 5-6 | Cross-Encoder Reranking | 5d | Top-20 reranking |
| 6-7 | Intent-Aware Retrieval | 5d | Query classifier |
| 7-8 | Learning from Corrections | 7d | Feedback loop |
| 8-10 | Layered Tool Organization | 5d | L1-L5 structure |

**Total Phase 3 Effort:** ~32 days

- [ ] `causal_edges` table with 6 relationship types (caused, enabled, supersedes, contradicts, derived_from, supports)
- [ ] Cross-encoder integration with length penalty
- [ ] Intent classification (add_feature, fix_bug, refactor, understand)
- [ ] `memory_corrections` table + confidence adjustment
- [ ] 5-layer tool organization with token budgets

### Phase 5: Template & Command Improvements (Week 12-13)
> **Goal:** Implement 20-agent analysis findings for context template and memory commands

| ID | Task | Workstream | Effort | Deliverable |
|----|------|------------|--------|-------------|
| P5.1 | Add CONTINUE_SESSION section to context_template.md | W-I | 0.5d | Session recovery template |
| P5.2 | Add session_dedup metadata to template | W-S | 0.5d | Dedup tracking fields |
| P5.3 | Add memory_classification fields to template | W-D | 0.5d | Type + half-life metadata |
| P5.4 | Add causal_links metadata to template | W-G | 0.5d | Relationship tracking |
| P5.5 | Add RECOVERY HINTS section to template | W-I | 0.5d | Self-service guidance |
| P5.6 | Add Phase 0 pre-flight validation to save.md | W-I | 0.5d | Validation docs |
| P5.7 | Document session deduplication in save.md | W-S | 0.5d | §16 Session Dedup |
| P5.8 | Document deferred indexing behavior | W-I | 0.25d | Fallback docs |
| P5.9 | Add response envelope structure to save.md | W-I | 0.25d | Return format spec |
| P5.10 | Create /memory:continue command | W-S | 1d | New command file |
| P5.11 | Create /memory:context unified command | W-R | 1d | New command file |
| P5.12 | Create /memory:why lineage command | W-G | 1d | New command file |

**Phase 5 Total: ~8 days / 1.5 weeks**

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Decay functions, RRF fusion, compression | Jest |
| Integration | Search pipeline, session management | Jest + SQLite |
| Performance | Startup time, query latency | Custom benchmarks |
| Manual | End-to-end memory workflows | MCP Inspector |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| SQLite FTS5 | Internal | Green | Cannot implement BM25 |
| Embedding API / Local Embeddings | External | Green | Fallback to local available |
| Cross-encoder (configurable provider) | External | Yellow | Optional - can skip reranking |
| BM25-WASM | External | Green | JS fallback available |

---

## 7. ROLLBACK PLAN

- **Trigger**: P95 latency > 500ms, token usage increase, search relevance decrease
- **Procedure**: Disable via feature flags, revert to schema v4

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Week 1) ─────────────┐
├── Session Deduplication     │
├── Type-Specific Half-Lives ─┼──► Multi-Factor Decay (Phase 2)
├── Recovery Hints            │
├── Tool Output Caching       │
└── Lazy Model Loading        │
                              ↓
Phase 2 (Weeks 2-3) ──────────┐
├── RRF Search Fusion ────────┼──► BM25 Hybrid Search
│                             │
├── Multi-Factor Decay ◄──────┘
│
└── Standardized Response ────────► Layered Tools (Phase 3)

Phase 3 (Weeks 4+)
├── Causal Memory Graph ──────────► Learning from Corrections
│
├── Cross-Encoder Reranking ◄───── RRF + BM25 (Phase 2)
│
└── Intent-Aware Retrieval ◄────── Multi-Factor Decay (Phase 2)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Session Deduplication | None | None |
| Type-Specific Half-Lives | None | Multi-Factor Decay |
| RRF Search Fusion | None | Cross-Encoder, BM25 |
| Causal Memory Graph | None | Learning from Corrections |
| Intent-Aware Retrieval | Multi-Factor Decay | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort | Duration |
|-------|------------|------------------|----------|
| Phase 1: Quick Wins | Low-Medium | 14-19 hours | 1 week |
| Phase 2: Core Enhancements | Medium-High | ~15 days | 2 weeks |
| Phase 3: Strategic | High | ~32 days | 2-3 weeks (parallel) |
| Phase 5: Template/Command Improvements | Medium | 8 days | 1 week (parallel) |
| **Total** | | | **~6-7 weeks** |

> **[AUDIT 2026-02-01]:** Timeline corrected from 11 weeks → 8.5 weeks → 6-7 weeks. Phase 3 reduced from 4 weeks to 2-3 weeks due to parallel execution of independent components (Causal Graph, Cross-Encoder, Intent-Aware can run concurrently). Phase 5 runs parallel with Phase 3. Original estimates counted parallel workstreams sequentially.

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Database backup created
- [ ] Feature flags configured (see Section 8)
- [ ] Baseline metrics captured

### Rollback Procedure
1. Disable feature flags (SPECKIT_RRF, SPECKIT_RELATIONS, etc.)
2. Revert to previous schema version if needed
3. Verify MCP startup and basic search functionality
4. Monitor for 15 minutes before confirming stability

### Data Reversal
- **Has data migrations?** Yes (v4 → v4.1 → v5)
- **Reversal procedure**:
  - v4.1 → v4: Drop access_count, last_accessed_at columns
  - v5 → v4.1: Drop memory_type, memory_relations table

### Error Recovery Flow

When errors occur during implementation, follow this decision tree:

```
┌──────────────────────┐
│   Error Detected     │
│   During Execution   │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│   Assess Severity    │
│   (See tasks.md)     │
└──────────┬───────────┘
           │
     ┌─────┴─────┬─────────────┬─────────────┐
     ▼           ▼             ▼             ▼
┌─────────┐ ┌─────────┐ ┌───────────┐ ┌───────────┐
│ MINOR   │ │MODERATE │ │  MAJOR    │ │ CRITICAL  │
│         │ │         │ │           │ │           │
│ Isolated│ │ 1-3     │ │ Entire    │ │ Cross-    │
│ failure │ │ tasks   │ │ workstream│ │ workstream│
│ no deps │ │ affected│ │ affected  │ │ impact    │
└────┬────┘ └────┬────┘ └─────┬─────┘ └─────┬─────┘
     ▼           ▼             ▼             ▼
┌─────────┐ ┌─────────┐ ┌───────────┐ ┌───────────┐
│ Fix &   │ │ Fix &   │ │   HALT    │ │   HALT    │
│Continue │ │Revalidate│ │ Workstream│ │ Escalate  │
│         │ │ Affected │ │  Review   │ │Immediately│
└─────────┘ └─────────┘ └───────────┘ └───────────┘
                              │             │
                              ▼             ▼
                        ┌───────────┐ ┌───────────┐
                        │  Human    │ │   Spec    │
                        │ Approval  │ │ Revision  │
                        │ Required  │ │ May Be    │
                        └───────────┘ │ Required  │
                                      └───────────┘
```

> **Cross-reference:** See `tasks.md` → AI Execution Protocol → Failure Recovery Protocol for detailed severity definitions and recovery actions.

---

## L3: DEPENDENCY GRAPH

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PHASE 1 (Week 1)                                  │
│                         No external dependencies                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐   ┌─────────────────────┐   ┌──────────────────┐     │
│  │ Session          │   │ Type-Specific       │   │ Recovery Hints   │     │
│  │ Deduplication    │   │ Half-Lives          │   │ in Errors        │     │
│  └──────────────────┘   └─────────┬───────────┘   └──────────────────┘     │
│                                   │                                         │
│  ┌──────────────────┐             │                                         │
│  │ Tool Output      │             │                                         │
│  │ Caching          │             │                                         │
│  └──────────────────┘             │                                         │
│                                   │                                         │
│  ┌──────────────────┐             │                                         │
│  │ Lazy Model       │             │                                         │
│  │ Loading          │             │                                         │
│  └──────────────────┘             │                                         │
│                                   ▼                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                          PHASE 2 (Weeks 2-3)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐───────────────────►┌─────────────────────┐           │
│  │ RRF Search       │                    │ BM25 Hybrid         │           │
│  │ Fusion (k=60)    │                    │ Search              │           │
│  └────────┬─────────┘                    └──────────┬──────────┘           │
│           │                                         │                       │
│           │                                         │                       │
│           │        ┌─────────────────────┐          │                       │
│           │        │ Multi-Factor        │◄─────────┘                       │
│           │        │ Decay Composite     │                                  │
│           │        └─────────────────────┘                                  │
│           │                                                                 │
│           │        ┌─────────────────────┐                                  │
│           │        │ Standardized        │───────────────────────────┐      │
│           │        │ Response Structure  │                           │      │
│           │        └─────────────────────┘                           │      │
│           │                                                          │      │
│           ▼                                                          ▼      │
├─────────────────────────────────────────────────────────────────────────────┤
│                          PHASE 3 (Weeks 4+)                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐                    ┌─────────────────────┐           │
│  │ Causal Memory    │───────────────────►│ Learning from       │           │
│  │ Graph            │                    │ Corrections         │           │
│  └──────────────────┘                    └─────────────────────┘           │
│                                                                             │
│  ┌──────────────────┐◄─── from RRF + BM25                                  │
│  │ Cross-Encoder    │                                                       │
│  │ Reranking        │                                                       │
│  └──────────────────┘                                                       │
│                                                                             │
│  ┌──────────────────┐◄─── from Multi-Factor Decay                          │
│  │ Intent-Aware     │                                                       │
│  │ Retrieval        │                                                       │
│  └──────────────────┘                                                       │
│                                                                             │
│  ┌──────────────────┐◄─── from Standardized Response                       │
│  │ Layered Tool     │                                                       │
│  │ Organization     │                                                       │
│  └──────────────────┘                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Session Deduplication | None | sentMemories tracking | None |
| Type-Specific Half-Lives | None | HALF_LIVES_DAYS config | Multi-Factor Decay |
| RRF Search Fusion | None | rrfFusion() | Cross-Encoder, BM25 |
| Multi-Factor Decay | Half-Lives | compositeScore | Intent-Aware |
| Causal Memory Graph | None | causal_edges table | Learning |
| Layered Tools | Response Structure | L1-L5 organization | None |

---

## L3: CRITICAL PATH

1. **Type-Specific Half-Lives** - 2-3 hours - CRITICAL
2. **Multi-Factor Decay Composite** - 3 days - CRITICAL (can overlap with #1)
3. **RRF Search Fusion** - 5 days - CRITICAL (runs parallel with Phase 1)
4. **Causal Memory Graph** - 10 days - CRITICAL (starts after Phase 2)

**Total Critical Path**: ~17 days (actual sequential dependencies)

> **[AUDIT 2026-02-01]:** Critical path corrected from 28 days to ~17 days. Original estimate summed all CRITICAL items sequentially (28d), but actual dependencies allow significant parallelism:
> - Items 1-3 can overlap (Phase 1 + Phase 2 start = ~8 days)
> - Item 4 (Causal Graph) is the true long pole at 10 days
> - "Learning from Corrections" removed from critical path - it depends on Causal Graph but doesn't block other work
> - Cross-Encoder and Intent-Aware are parallel, not sequential

**Parallel Opportunities**:
- Session Deduplication, Recovery Hints, Caching, Lazy Loading can run simultaneously (Week 1)
- RRF Fusion and BM25 can progress in parallel (Week 2)
- Cross-Encoder and Intent-Aware Retrieval can run after Phase 2 completes
- Phase 5 Template work runs parallel with Phase 3

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Quick Wins Complete | 25-35% token savings, <500ms startup | Week 1 |
| M2 | Search Enhanced | +40% relevance, RRF + BM25 working | Week 3 |
| M3 | Graph Foundation | causal_edges populated, "why" queries work | Week 5 |
| M4 | Learning Active | Corrections tracked, confidence adjusts | Week 8 |
| M5 | Release Ready | All P0/P1 items, tests passing | Week 10 |
| M6 | Template & Command Updates | context_template.md v2.2, save.md updated, 3 new commands | Week 13 |

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Protocol-Based DI over Full Hexagonal

**Status**: Accepted

**Context**: Need swappable backends without over-engineering

**Decision**: Implement targeted protocol abstractions (IVectorStore, IEmbeddingProvider) at integration boundaries only

**Consequences**:
- Positive: Testable, swappable backends
- Positive: Less scaffolding than full hexagonal
- Negative: May need to add more protocols later

**Alternatives Rejected**:
- Full Hexagonal: Over-engineering for current scale (per consolidated-analysis.md Section 1.7)

### ADR-002: SQLite Relations over LadybugDB

**Status**: Accepted

**Context**: Need graph storage for causal relationships

**Decision**: Use SQLite causal_edges table, consider LadybugDB at >10K nodes

**Consequences**:
- Positive: Simpler, no new dependency
- Positive: Sufficient for current scale
- Negative: May need migration at scale

**Alternatives Rejected**:
- LadybugDB: Only beneficial at >10K nodes (per consolidated-analysis.md Q6)

---

## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Foundation (Phase 1)
**Duration**: ~1 week
**Agent**: Primary
**Focus**: Quick wins with immediate impact
- Session deduplication
- Type-specific half-lives
- Lazy loading
- Error recovery hints

### Tier 2: Enhancement (Phase 2)
| Agent | Focus | Files |
|-------|-------|-------|
| Search Agent | RRF + BM25 | vector-index.js, composite-scoring.js |
| Decay Agent | Multi-factor scoring | attention-decay.js, tier-classifier.js |
| Response Agent | Standardized structure | Tool response handlers |

**Duration**: ~2 weeks (parallel)

### Tier 3: Strategic (Phase 3)
**Agent**: Multi-agent coordination
**Focus**: Graph, learning, tool reorganization
**Duration**: ~6 weeks

---

## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-S | Session Management | Primary | session-manager.js, deduplication.js | Active (Phase 1) |
| W-R | Search/Retrieval | Primary | vector-index.js, rrf-fusion.js, bm25.js | Phase 2 |
| W-D | Decay & Scoring | Primary | attention-decay.js, composite-scoring.js | Phase 1-2 |
| W-G | Graph/Relations | Secondary | causal-graph.js, edges.js | Phase 3 |
| W-I | Infrastructure | Primary | lazy-loader.js, cache.js, errors.js | Phase 1 |

> **Phase 5 Note:** Template and command improvements (P5.1-P5.12) are distributed across existing workstreams: W-S (session), W-R (retrieval), W-D (decay), W-G (graph), W-I (infrastructure). No new workstream required.

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | Phase 1 complete | W-S, W-D, W-I | Integration test |
| SYNC-002 | RRF + BM25 merged | W-R, W-D | Enhanced search validation |
| SYNC-003 | Graph foundation | W-G, W-R | Causal query testing |
| SYNC-004 | All workstreams | All | Final verification |

### File Ownership Rules
- Each file owned by ONE workstream
- Cross-workstream changes require SYNC
- Conflicts resolved at sync points

---

## L3+: COMMUNICATION PLAN

### Checkpoints
- **Daily**: Status update in tasks.md
- **Per Phase**: Review milestone completion
- **Blockers**: Immediate escalation

### Escalation Path
1. Technical blockers (latency, API limits) → Re-evaluate feature flag strategy
2. Scope changes → Update spec.md and priorities
3. Resource issues → Adjust phase timeline

---

## L3+: FEATURE FLAG STRATEGY

```javascript
const FEATURE_FLAGS = {
  // Phase 1
  ENABLE_SESSION_DEDUP: process.env.SPECKIT_SESSION_DEDUP ?? false,
  ENABLE_LAZY_LOADING: process.env.SPECKIT_LAZY_LOAD ?? false,

  // Phase 2
  ENABLE_RRF_FUSION: process.env.SPECKIT_RRF ?? false,
  ENABLE_BM25: process.env.SPECKIT_BM25 ?? false,
  ENABLE_USAGE_TRACKING: process.env.SPECKIT_USAGE ?? false,
  ENABLE_TYPE_DECAY: process.env.SPECKIT_TYPE_DECAY ?? false,

  // Phase 3
  ENABLE_RELATIONS: process.env.SPECKIT_RELATIONS ?? false,
  ENABLE_CROSS_ENCODER: process.env.SPECKIT_CROSS_ENCODER ?? false,
  DISABLE_LEGACY_SEARCH: process.env.SPECKIT_NO_LEGACY ?? false
};
```

**Migration Path**:
- Non-breaking: Add columns as nullable, new features as opt-in
- Breaking: Require explicit flag before removing legacy

---

## L3+: SUCCESS METRICS (KPIs)

| Category | Metric | Baseline | Target | Priority |
|----------|--------|----------|--------|----------|
| **Token Efficiency** | Session dedup savings | 0% | 25-35% | P0 |
| **Performance** | MCP startup time | 2-3s | <500ms | P0 |
| **Search Quality** | Relevance (user feedback) | Manual | +40% | P0 |
| **Performance** | Query latency (P95) | ~200ms | <150ms | P1 |
| **Token Efficiency** | Tokens per search | ~400 | Configurable | P0 |
| **System Health** | Duplicate rate in results | ~20% | <5% | P0 |
| **Memory Quality** | "Why" query coverage | 0% | 60% linked | P2 |

---

<!--
SPECKIT LEVEL 3+ PLAN (~250 lines)
- Core + L2 + L3 + L3+ addendums
- AI execution framework, workstream coordination
- Full feature flag strategy and migration plan
-->

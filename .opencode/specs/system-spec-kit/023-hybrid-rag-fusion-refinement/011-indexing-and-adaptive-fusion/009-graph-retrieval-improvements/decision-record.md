---
title: "...t/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/009-graph-retrieval-improvements/decision-record]"
description: "Architecture decisions for graph retrieval improvements: diagnosis-first, phase ordering, feature flag strategy."
trigger_phrases:
  - "graph retrieval adr"
  - "community summaries decision"
  - "retrieval improvement architecture"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/009-graph-retrieval-improvements"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["decision-record.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Graph Retrieval Improvements

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Diagnose Before Building

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-01 |
| **Deciders** | Research synthesis from 007, review findings |

---

### Context

The system already has empty-result recovery (`SPECKIT_EMPTY_RESULT_RECOVERY_V1`), concept routing (`SPECKIT_GRAPH_CONCEPT_ROUTING`), query surrogates, and memory-summary search. Building all 8 improvements without tracing the actual failure risks over-engineering.

### Decision

**We chose**: Phase 0 traces the full pipeline for `memory_search("Semantic Search")` before any implementation begins. Improvements already covered by existing features are skipped or reduced.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Diagnose first** | Avoids wasted work, targets actual bottleneck | Delays implementation start by 1-2 hours | 9/10 |
| Build everything from research backlog | Maximum coverage | May duplicate existing features, wastes effort | 4/10 |
| Build only top-3 recommendations | Fast | May miss the actual bottleneck | 5/10 |

### Consequences

**What improves**: Scope may shrink significantly if existing features already cover some gaps.
**What it costs**: 1-2 hours upfront before any code changes.

### Five Checks

| # | Check | Result |
|---|-------|--------|
| 1 | Necessary? | PASS — existing features may already handle some cases |
| 2 | Beyond local maxima? | PASS — traces real failure, not assumed failure |
| 3 | Sufficient? | PASS — full pipeline trace covers all stages |
| 4 | Fits goal? | PASS — goal is fixing retrieval, not building features |
| 5 | Open horizons? | PASS — findings inform scope, don't lock it |
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Feature Flag Per Improvement

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-01 |

---

### Context

8 improvements touching the search pipeline need safe rollout. A single flag would make rollback all-or-nothing.

### Decision

**We chose**: One `SPECKIT_*` feature flag per improvement. Each is independently toggleable.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One flag per improvement** | Granular rollback, independent testing | More flags to manage | 9/10 |
| One flag for all | Simple | All-or-nothing rollback | 3/10 |
| Phase-level flags (4 total) | Balanced | Phases have mixed-risk items | 6/10 |

### Consequences

**What improves**: Any single improvement can be disabled without affecting others.
**What it costs**: 8 new feature flags in the flag registry.

---

### ADR-003: Community Summaries as Searchable Artifacts

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-01 |

---

### Context

Community detection produces clusters. The summaries need to be accessible during search. Two options: store as regular memories or as a separate index.

### Decision

**We chose**: Store community summaries as a separate artifact type with their own embeddings, queryable alongside memories but distinguishable in results.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Separate artifact type** | Clean separation, can filter/boost separately | New storage schema | 8/10 |
| Store as regular memories | No schema changes | Pollutes memory space, hard to regenerate | 4/10 |
| In-memory only | Fast, no storage | Lost on restart, not searchable | 3/10 |

### Consequences

**What improves**: Community summaries can be ranked differently from individual memories, regenerated without affecting memory records, and filtered out of results when not wanted.
**What it costs**: New artifact type in the schema (table or collection).

---

### ADR-004: Coordinate with Phase 025 Tool Routing Enforcement

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-04-01 |
| **Source** | Phase 025 deep research (10 iterations via cli-copilot GPT 5.4 High) |

---

### Context

Phase 025 (`024-compact-code-graph/025-tool-routing-enforcement`) discovered that AI assistants default to Grep/Glob over MCP tools (CocoIndex, Code Graph) because there is no active enforcement at the MCP layer. `buildServerInstructions()` is the universal enforcement point for ALL CLIs. If this spec's graph improvements (always-on injection, community search, dual-level retrieval) are built but the AI doesn't know when to use them, the improvements are wasted.

Additionally, Phase 025 found:
1. An existing `query-intent-classifier.ts` with structural-vs-semantic heuristic — overlaps with proposed concept extraction (T015)
2. An existing `envelope.hints` pipeline in context-server.ts — should be reused for provenance display (Phase C)
3. `SessionSnapshot.cocoIndexAvailable` already exists — graph improvements should integrate with the session snapshot
4. `PrimePackage` is being extended with `routingRules` — graph retrieval modes should be included

### Decision

**We chose**: Coordinate implementation with Phase 025. After Phase B (always-on graph injection), update `buildServerInstructions()` and `PrimePackage.routingRules` to advertise graph retrieval capabilities. Phase 0 diagnosis must audit the existing query-intent-classifier before building a new concept extractor.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Coordinate with 025** | Avoids duplicate work, routing supports graph usage | Adds cross-spec dependency | 9/10 |
| Build independently | Simpler, no cross-dependency | AI may not use new graph tools without routing enforcement | 4/10 |
| Wait for 025 first | Clean dependency ordering | Delays graph improvements | 5/10 |

### Consequences

**What improves**: Graph improvements are discoverable by AI assistants via server instructions, PrimePackage, and constitutional memory. Existing code (query-intent-classifier, envelope.hints) is reused rather than duplicated.
**What it costs**: Cross-spec coordination overhead. Tasks T040-T043 added for coordination checkpoints.

---

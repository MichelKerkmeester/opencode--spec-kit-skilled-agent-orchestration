---
title: "Decision Record: Memory System Analysis & Improvement Strategy [001-memory-repo-analysis/decision-record]"
description: "Architecture Decision Record (ADR) documenting decisions from roampal memory system analysis and planned improvements for system-memory."
trigger_phrases:
  - "decision"
  - "record"
  - "memory"
  - "system"
  - "analysis"
  - "decision record"
  - "001"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Memory System Analysis & Improvement Strategy

Architecture Decision Record (ADR) documenting decisions from roampal memory system analysis and planned improvements for system-memory.

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v1.0 -->

---
t
## 1. METADATA (Document-Level)

- **Document Created**: 2025-12-17
- **Author**: AI Assistant (Claude)
- **Related Feature**: [spec.md](./spec.md)
- **Analysis Source**: roampal memory system comparison

---

## ADR-001: Adopt Outcome-Based Learning Pattern

### Metadata

- **Decision ID**: ADR-001
- **Status**: PROPOSED
- **Date**: 2025-12-17
- **Deciders**: Michel Kerkmeester, AI Assistant

---

### Context

#### Problem Statement
Our current system-memory has validation capability (`memory_validate` with `wasUseful: true/false`) but lacks comprehensive outcome scoring. This binary feedback provides limited signal for memory quality assessment and doesn't enable nuanced learning from partial successes or failures.

#### Current Situation
The existing `memory_validate` tool tracks:
- Boolean `wasUseful` flag
- Confidence score adjustment (increases/decreases)
- Validation count for promotion to critical tier (90% threshold)

Roampal uses a more sophisticated outcome system:
- `worked` / `failed` / `partial` / `unknown` outcomes
- Score deltas that accumulate over time
- Natural decay of poorly-performing memories

#### Constraints
- Must maintain backward compatibility with existing validation data
- Cannot hard-block AI workflow (soft enforcement only)
- Should integrate with existing tier system (constitutional → deprecated)

#### Assumptions
- AI agents will provide outcome feedback when prompted
- Score deltas can be calibrated through usage patterns
- Partial outcomes provide more signal than binary pass/fail

---

### Decision

#### Summary
Adopt outcome-based learning pattern from roampal, extending our existing `memory_validate` tool to support graduated outcomes.

#### Detailed Description
Extend the current validation system to accept outcome types beyond boolean. The enhanced system will:

1. Accept `outcome` parameter: `worked` | `failed` | `partial` | `unknown`
2. Map outcomes to score deltas (configurable)
3. Accumulate scores over time per memory
4. Use accumulated scores to influence search ranking
5. Maintain backward compatibility with existing `wasUseful` boolean

#### Technical Approach
```typescript
// Extended memory_validate interface
interface OutcomeValidation {
  id: number;
  outcome: 'worked' | 'failed' | 'partial' | 'unknown';
  context?: string;  // Optional: what task was attempted
}

// Score delta mapping (configurable)
const SCORE_DELTAS = {
  worked: +0.15,
  partial: +0.05,
  unknown: 0,
  failed: -0.10
};

// Backward compatibility
if (wasUseful === true) outcome = 'worked';
if (wasUseful === false) outcome = 'failed';
```

---

### Alternatives Considered

#### Option 1: [CHOSEN] Extend validation with graduated outcomes

**Pros**:
- Bad memories naturally decay over time
- Good memories surface more frequently
- Self-improving system with minimal maintenance
- Richer feedback signal than binary

**Cons**:
- Requires AI to provide outcome (soft enforcement)
- Score calibration may need tuning
- More complex than current system

**Score**: 8/10

**Why Chosen**: Best balance of improvement potential with implementation simplicity. Builds on existing infrastructure.

---

#### Option 2: Keep current binary validation only

**Pros**:
- Already implemented and working
- Simple to understand and use

**Cons**:
- Insufficient feedback loop
- No way to express partial success
- Limited learning capability

**Score**: 4/10

**Why Rejected**: Insufficient feedback loop for meaningful memory quality improvement.

---

#### Option 3: Hard-enforce scoring on every memory access

**Pros**:
- Guaranteed feedback on all memories
- Faster learning cycle

**Cons**:
- Blocks AI workflow
- Frustrating user experience
- May get low-quality rushed responses

**Score**: 3/10

**Why Rejected**: Hard enforcement would block AI workflow and degrade user experience.

---

### Consequences

#### Positive Consequences
- Bad memories naturally decay through negative scores
- Good memories surface more frequently in search results
- Self-improving system that gets better with usage
- Richer data for analyzing memory quality patterns

#### Negative Consequences
- Requires prompting AI to provide outcome feedback (soft enforcement)
- Initial score calibration may need adjustment based on real usage
- Slightly more complex validation flow

#### Risks

| Risk                        | Impact | Likelihood | Mitigation                             |
| --------------------------- | ------ | ---------- | -------------------------------------- |
| AI doesn't provide feedback | Medium | Medium     | Periodic prompts, default to 'unknown' |
| Score inflation/deflation   | Low    | Low        | Calibration review after 30 days       |

---

## ADR-002: Defer Hook Integration Pending OpenCode Support

### Metadata

- **Decision ID**: ADR-002
- **Status**: SUPERSEDED
- **Date**: 2025-12-17
- **Deciders**: Michel Kerkmeester, AI Assistant

---

### Context

#### Problem Statement
Roampal's automatic context injection via hooks is powerful - it surfaces relevant memories without manual search. However, this requires framework-level support for hooks/callbacks that OpenCode may not yet provide.

#### Current Situation
- Roampal uses hooks to automatically inject context at conversation start
- OpenCode's hook support is not yet confirmed/documented
- Current system-memory requires manual search via `/memory:search` or keywords

#### Constraints
- Cannot depend on framework features that don't exist
- Must provide value with current OpenCode capabilities
- Should be architected to easily add hooks when available

#### Assumptions
- OpenCode will likely add hook support in future versions
- Manual context recovery is acceptable interim solution
- Improved search can partially compensate for lack of auto-injection

---

### Decision

#### Summary
Document hook-based injection as future enhancement. Implement interim alternatives (improved search, better prompts, trigger phrases) while monitoring OpenCode development.

#### Detailed Description
Rather than waiting for or depending on framework changes:

1. **Improve trigger phrase matching** - Fast (<50ms) pattern matching for proactive surfacing
2. **Enhance search prompts** - Better guidance for when/how to search memories
3. **Document hook architecture** - Ready to implement when OpenCode supports it
4. **Monitor OpenCode releases** - Track hook-related features

---

### Alternatives Considered

#### Option 1: [CHOSEN] Defer hooks, improve alternatives

**Pros**:
- No dependency on framework changes
- Provides immediate value
- Ready to adopt hooks when available

**Cons**:
- Manual context recovery still required
- Less seamless experience than auto-injection

**Score**: 7/10

**Why Chosen**: Pragmatic approach that delivers value now while preparing for future.

---

#### Option 2: Build custom hook system

**Pros**:
- Full control over implementation
- Immediate auto-injection capability

**Cons**:
- May conflict with future OpenCode hooks
- Maintenance burden
- Likely to be replaced

**Score**: 4/10

**Why Rejected**: High effort for likely temporary solution.

---

### Consequences

#### Positive Consequences
- No dependency on framework changes
- System works with current OpenCode version
- Architecture ready for hooks when available

#### Negative Consequences
- Manual context recovery still required for now
- Less seamless experience than roampal's auto-injection

---

## ADR-002-REVISED: Implement Hybrid Context Injection Strategy

### Metadata

- **Decision ID**: ADR-002-REVISED
- **Status**: ACCEPTED
- **Date**: 2025-12-17
- **Supersedes**: ADR-002
- **Deciders**: Michel Kerkmeester, AI Assistant

---

### Context

#### Problem Statement
Original ADR-002 proposed deferring hook integration pending OpenCode support. Analysis revealed OpenCode has sufficient building blocks for a hybrid approach.

#### New Information
OpenCode hook feasibility analysis confirmed:
- ✅ `session.created` event available for session-start injection
- ✅ `session.idle` event available for exchange recording
- ✅ `session.prompt()` with `noReply:true` for silent injection
- ❌ `session.prompt.before` NOT available (no per-message interception)

#### Revised Assessment
While direct roampal-style hooks aren't possible, a hybrid 3-layer strategy can achieve ~70% of the automatic context injection value.

---

### Decision

#### Summary
Implement hybrid 3-layer context injection strategy using available OpenCode capabilities.

#### Detailed Description

**Layer 1: Session Start Injection**
```javascript
// .opencode/plugin/memory-context.js
export default {
  name: "memory-context",
  subscribe: ["session.created"],
  async onSessionCreated({ session }) {
    const constitutional = await getConstitutionalMemories();
    await session.prompt(formatContext(constitutional), { noReply: true });
  }
}
```

**Layer 2: Mandatory Trigger Matching**
Update AGENTS.md to require `memory_match_triggers()` as first action on every user message (soft enforcement).

**Layer 3: Exchange Recording**
```javascript
// .opencode/plugin/memory-context.js (extended)
export default {
  subscribe: ["session.created", "session.idle"],
  async onSessionIdle({ session, exchanges }) {
    await recordSignificantExchanges(exchanges);
  }
}
```

---

### Alternatives Considered

#### Option 1: [CHOSEN] Hybrid 3-layer strategy
**Pros**:
- Uses available OpenCode capabilities
- Provides ~70% of roampal value
- No framework changes required
- Implementable now

**Cons**:
- Layer 2 is soft enforcement (AI may skip)
- Not as seamless as true per-message hooks

**Score**: 8/10

#### Option 2: Wait for OpenCode to add session.prompt.before
**Pros**:
- Would enable true per-message injection
- Cleaner implementation

**Cons**:
- Unknown timeline
- Blocks progress indefinitely

**Score**: 3/10

#### Option 3: Build custom hook system
**Pros**:
- Full control

**Cons**:
- May conflict with future OpenCode features
- High maintenance burden

**Score**: 4/10

---

### Consequences

#### Positive Consequences
- Immediate implementation possible
- Constitutional memories always available at session start
- Exchange recording captures important context
- Foundation for future improvements when hooks expand

#### Negative Consequences
- Layer 2 depends on AI compliance (soft enforcement)
- Not as seamless as roampal's automatic injection
- Requires AGENTS.md updates for enforcement

---

## ADR-003: Implement Knowledge Graph for Query Routing

### Metadata

- **Decision ID**: ADR-003
- **Status**: PROPOSED
- **Date**: 2025-12-17
- **Deciders**: Michel Kerkmeester, AI Assistant

---

### Context

#### Problem Statement
Current search uses vector similarity only, treating all queries equally. Roampal tracks which concepts work best with which collections/contexts, improving routing over time.

#### Current Situation
- Hybrid search: FTS5 + vector similarity
- No tracking of query → result effectiveness
- No concept → collection routing

#### Constraints
- Must not significantly impact search latency (<100ms target)
- SQLite-based (no new dependencies)
- Lightweight - minimal storage overhead

#### Assumptions
- Query patterns are somewhat predictable
- Concept → context mapping is learnable
- Historical effectiveness data is valuable

---

### Decision

#### Summary
Add lightweight knowledge graph tracking to improve search routing based on historical effectiveness.

#### Detailed Description
Implement concept → context mapping that learns from:

1. **Query logging** - Track what queries hit which memories
2. **Outcome correlation** - Link query patterns to successful outcomes
3. **Routing hints** - Suggest context_type filters based on query patterns
4. **Anomaly detection** - Identify problematic query patterns

#### Technical Approach
```sql
-- Lightweight KG table
CREATE TABLE query_routing (
  id INTEGER PRIMARY KEY,
  query_pattern TEXT,          -- Normalized query pattern
  context_type TEXT,           -- Best matching context type
  success_rate REAL,           -- Historical success rate
  sample_count INTEGER,        -- Number of samples
  last_updated TEXT
);

-- Index for fast lookup
CREATE INDEX idx_query_pattern ON query_routing(query_pattern);
```

---

### Alternatives Considered

#### Option 1: [CHOSEN] Lightweight SQLite-based KG

**Pros**:
- Search improves with usage
- Can identify problematic query patterns
- Minimal infrastructure change
- Fast lookup

**Cons**:
- Additional complexity
- Requires outcome data to be effective

**Score**: 7/10

**Why Chosen**: Good ROI - meaningful improvement with minimal complexity.

---

#### Option 2: Full graph database (Neo4j, etc.)

**Pros**:
- Rich graph queries
- Standard graph patterns

**Cons**:
- New dependency
- Overkill for our needs
- Deployment complexity

**Score**: 3/10

**Why Rejected**: Overkill - adds significant complexity for marginal benefit.

---

#### Option 3: No routing improvements

**Pros**:
- No additional complexity
- Current search works adequately

**Cons**:
- Misses optimization opportunity
- Search doesn't improve over time

**Score**: 5/10

**Why Rejected**: Missed opportunity for meaningful improvement with reasonable effort.

---

### Consequences

#### Positive Consequences
- Search quality improves with usage
- Can identify and fix problematic query patterns
- Foundation for more sophisticated routing

#### Negative Consequences
- Additional complexity in search path
- Requires outcome tracking to be effective (depends on ADR-001)

---

## ADR-004: Keep SQLite Over ChromaDB

### Metadata

- **Decision ID**: ADR-004
- **Status**: ACCEPTED
- **Date**: 2025-12-17
- **Deciders**: Michel Kerkmeester, AI Assistant

---

### Context

#### Problem Statement
Roampal uses ChromaDB for vector storage. Should we migrate to ChromaDB for consistency with their approach, or maintain our SQLite + sqlite-vec architecture?

#### Current Situation
- system-memory uses SQLite with sqlite-vec extension
- Working implementation with hybrid search (FTS5 + vector)
- Single database file, simple deployment
- roampal uses ChromaDB (Python-native vector DB)

#### Constraints
- Migration would require significant effort
- Must maintain all existing functionality
- Deployment simplicity is valued

#### Assumptions
- sqlite-vec provides sufficient vector search capability
- Single-file deployment is advantageous
- ChromaDB features we don't use aren't worth the migration cost

---

### Decision

#### Summary
Keep SQLite + sqlite-vec architecture. The current implementation is working, simpler to deploy, and doesn't require additional dependencies.

#### Detailed Description
Rationale for staying with SQLite:

1. **Working implementation** - No migration risk
2. **Single file deployment** - Simple backup, restore, and portability
3. **No additional dependencies** - sqlite-vec is lightweight
4. **Hybrid search working** - FTS5 + vector in single DB
5. **Sufficient performance** - Sub-100ms queries achieved

---

### Alternatives Considered

#### Option 1: [CHOSEN] Keep SQLite + sqlite-vec

**Pros**:
- No migration needed
- Single database file
- Simpler deployment
- Already working and tested

**Cons**:
- May lack some ChromaDB-specific features
- Less ecosystem support than ChromaDB

**Score**: 9/10

**Why Chosen**: Already working, simpler, no compelling reason to migrate.

---

#### Option 2: Migrate to ChromaDB

**Pros**:
- Consistency with roampal approach
- Purpose-built for vectors
- Active development community

**Cons**:
- Migration effort and risk
- Additional dependency (Python package)
- More complex deployment
- Would need to re-implement hybrid search

**Score**: 4/10

**Why Rejected**: Migration cost exceeds benefit. No features we need that sqlite-vec doesn't provide.

---

### Consequences

#### Positive Consequences
- No migration effort or risk
- Maintains simple single-file architecture
- Continues working with current infrastructure

#### Negative Consequences
- May miss some ChromaDB-specific optimizations
- Different architecture from roampal (harder to port code directly)

---

## ADR-005: Defer Exchange Recording Pending SDK Enhancement

### Metadata

- **Decision ID**: ADR-005
- **Status**: ACCEPTED
- **Date**: 2025-12-17
- **Deciders**: AI Agent (finalization session)

---

### Context

#### Problem Statement
The hybrid 3-layer context injection strategy (ADR-002-REVISED) includes:
- Layer 1: Constitutional injection at session start ✅ IMPLEMENTED
- Layer 2: Trigger matching via MCP tool ✅ IMPLEMENTED  
- Layer 3: Exchange recording for automatic context capture ⏸️ DEFERRED

Layer 3 requires access to conversation messages to record exchanges automatically. The OpenCode SDK does not currently expose a `client.session.messages()` API or equivalent.

#### Current Situation
- Plugin file exists: `.opencode/plugin/memory-context.js`
- Layer 1 (session start injection) is functional
- Layer 2 (trigger matching) is functional via `memory_match_triggers()` MCP tool
- Layer 3 placeholder exists but cannot be implemented without session message access

#### Constraints
- Cannot implement exchange recording without SDK support for message access
- Must not block plugin release for features that cannot be implemented
- Should preserve architecture for future implementation

#### Assumptions
- OpenCode SDK will likely add session message access in future versions
- Manual `/memory:save` command provides acceptable workaround
- Users understand the limitation and can use manual saves

---

### Decision

#### Summary
**Defer Layer 3 (exchange recording) until OpenCode SDK provides session message access.**

#### Detailed Description
Rather than blocking the plugin release or implementing a suboptimal workaround:

1. **Ship with Layers 1 & 2 functional** - Provide immediate value
2. **Document the limitation** - Users know to use `/memory:save` manually
3. **Preserve placeholder architecture** - Ready to implement when API available
4. **Monitor SDK releases** - Track for `client.session.messages()` or equivalent

---

### Alternatives Considered

#### Option 1: [CHOSEN] Defer pending SDK enhancement

**Pros**:
- Plugin can ship with Layers 1 & 2 functional
- Users have manual workaround via `/memory:save`
- Clean separation allows incremental enhancement
- No dependency on unavailable SDK features

**Cons**:
- Automatic exchange recording not available
- Users must manually trigger context saves
- Roampal-style "seamless memory" experience partially achieved

**Score**: 8/10

**Why Chosen**: Pragmatic approach - ship what works, defer what can't be implemented.

---

#### Option 2: Wait for SDK enhancement before releasing plugin

**Pros**:
- Complete feature set at release
- Full roampal-style experience

**Cons**:
- Unknown timeline for SDK enhancement
- Blocks value delivery indefinitely
- Layers 1 & 2 provide significant value alone

**Score**: 3/10

**Why Rejected**: Blocks valuable functionality for unknown duration.

---

#### Option 3: Implement workaround using file-based message logging

**Pros**:
- Could capture some exchange data

**Cons**:
- Would require custom message interception
- Likely conflicts with future SDK implementation
- Maintenance burden for temporary solution

**Score**: 4/10

**Why Rejected**: High effort for likely temporary and potentially conflicting solution.

---

### Consequences

#### Positive Consequences
- Plugin can ship with Layers 1 & 2 functional
- Users have manual workaround via `/memory:save`
- Clean separation allows incremental enhancement
- No technical debt from workarounds

#### Negative Consequences
- Automatic exchange recording not available
- Users must manually trigger context saves
- Roampal-style "seamless memory" experience only partially achieved

---

### Implementation Notes

- **Plugin file**: `.opencode/plugin/memory-context.js`
- **Layer 3 placeholder**: Lines ~250-280 (session.idle handler stub)
- **Required API**: `client.session.messages()` or equivalent
- **Tracking**: Monitor OpenCode SDK releases for session message API
- **Manual workaround**: Users can use `/memory:save` command or "save context" trigger phrase

---

## Summary of Decisions

| ADR             | Decision                             | Status     | Priority        |
| --------------- | ------------------------------------ | ---------- | --------------- |
| ADR-001         | Adopt outcome-based learning         | PROPOSED   | High            |
| ADR-002         | Defer hooks, improve alternatives    | SUPERSEDED | -               |
| ADR-002-REVISED | Implement hybrid context injection   | ACCEPTED   | High            |
| ADR-003         | Implement lightweight KG for routing | PROPOSED   | Medium          |
| ADR-004         | Keep SQLite over ChromaDB            | ACCEPTED   | N/A (no action) |
| ADR-005         | Defer exchange recording pending SDK | ACCEPTED   | N/A (blocked)   |

---

## Implementation Sequence

1. **ADR-004** - No action needed (maintain status quo)
2. **ADR-001** - Extend `memory_validate` with outcome types
3. **ADR-003** - Add query routing (depends on ADR-001 for outcome data)
4. **ADR-002** - Monitor OpenCode for hook support, improve triggers meanwhile

---

## References

### Related Documents
- **Feature Specification**: [spec.md](./spec.md)
- **Validation Checklist**: [checklist.md](./checklist.md)

### External References
- roampal memory system (reference implementation)
- sqlite-vec documentation
- OpenCode documentation (for hook support monitoring)

---

**Review Schedule**: This decision record should be reviewed on 2026-03-17 to assess implementation progress and whether hook support is available.

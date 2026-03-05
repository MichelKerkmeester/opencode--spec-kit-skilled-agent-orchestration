---
title: "Decision Record: Working Memory + Hybrid RAG Automation [136-mcp-working-memory-hybrid-rag/decision-record]"
description: "Reference systems analyzed for working memory and hybrid RAG patterns"
trigger_phrases:
  - "decision"
  - "record"
  - "working"
  - "memory"
  - "hybrid"
  - "decision record"
  - "136"
  - "mcp"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Working Memory + Hybrid RAG Automation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: TypeScript-Only Implementation (No Python/Docker Dependencies)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-18 |
| **Deciders** | Tech Lead, Implementation Team |

---

<!-- ANCHOR:adr-001-context -->
### Context

Reference systems analyzed for working memory and hybrid RAG patterns:
- `opencode-working-memory`: TypeScript + JSON files, session cognition automation, zero-config approach
- `graphrag-hybrid`: Python + Neo4j + Qdrant + PyTorch, semantic + structural retrieval, high operational complexity (Docker, 4GB RAM, ~15s cold start, 2 databases requiring sync)

Target system (Spec Kit Memory MCP) is TypeScript-based with SQLite + vec0 extension, 7-layer architecture, existing RRF fusion, working_memory table, and causal_edges table. Adding Python would introduce:
- Cross-language maintenance burden (debugging, testing, deployment)
- Service dependencies (Neo4j for graph traversal, Qdrant for vector search, PyTorch for embeddings)
- Operational overhead (Docker compose, database sync, 2-phase commits, ~10MB/1K docs storage)
- Deployment friction (4GB RAM requirement, 15-second cold start, container orchestration)

### Constraints
- Existing codebase is TypeScript strict mode with no external service dependencies
- Target scale: <10K documents (graphrag-hybrid shows O(N^2) edge growth, 1000 docs = 4,950 edges, 2-hop traversal touches ~500K edges at scale)
- Ops complexity budget: 3/10 (embedded SQLite acceptable, Docker services not acceptable)
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Port algorithmic patterns (attention boosting, event decay, extraction rules, causal traversal) to TypeScript; reuse existing infrastructure (SQLite, vec0 extension, causal_edges table); avoid external services.

**Details**: Implement session-attention boost in TypeScript querying working_memory table post-RRF fusion, event-based decay calculation in TypeScript replacing time-based logic, extraction adapter in TypeScript with hook registration, causal-neighbor traversal via SQLite recursive CTE (not Neo4j Cypher). No Python microservices, no Docker, no Qdrant, no PyTorch.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **TypeScript-only (CHOSEN)** | Single runtime (Node.js), embedded storage (SQLite), no Docker, ~3/10 ops complexity, existing team expertise | Cannot use Neo4j graph traversal optimizations, 2-hop SQLite CTE less efficient than Cypher at scale >10K docs | 9/10 |
| Python microservice | Leverage existing graphrag-hybrid code, rich graph traversal via Neo4j | Cross-language debugging, service sync (2-phase commits), deployment complexity (Docker, 4GB RAM), ops burden 8/10 | 4/10 |
| Neo4j + Qdrant services | Best-in-class graph traversal (Cypher), semantic search (Qdrant), scalable to 100K+ docs | Ops burden (2 DBs, sync requirements, Docker compose), unnecessary for current scale <10K docs, overkill | 3/10 |
| Embedded Neo4j (Java JNI) | Graph performance without separate service | JNI complexity, Java runtime dependency, cross-language boundary, no team Java expertise | 2/10 |

**Why Chosen**: TypeScript-only preserves single-runtime simplicity, leverages existing SQLite infrastructure, keeps ops complexity at 3/10 (vs 8/10 for graphrag-hybrid), and is sufficient for target scale <10K docs. 2-hop SQLite CTE is acceptable latency (<20ms p95) for working_memory scale (max 7 items, causal_edges typically <100 edges per item).
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Single runtime eliminates cross-language complexity (debugging, testing, deployment)
- Embedded SQLite requires no service orchestration (no Docker, no database sync failures)
- Ops complexity stays at 3/10 (existing baseline), no increase
- Team expertise aligns (TypeScript-only codebase, no new languages/runtimes)
- Deployment simplicity (npm install, no Docker images, no 4GB RAM requirement)

**Negative**:
- 2-hop SQLite CTE less efficient than Neo4j Cypher at scale >10K docs - Mitigation: Current scale <10K, causal_edges limited to working_memory (max 7 items), 2-hop traversal touches <100 edges typical case, acceptable <20ms p95 latency
- Cannot leverage PyTorch pre-trained models for advanced semantic features - Mitigation: vec0 extension provides 384-dim embeddings, sufficient for current use case, RRF fusion already working well

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| SQLite CTE performance degrades at scale >10K docs | Medium | Monitor p95 latency, add causal_edges indexing, limit 2-hop depth, defer graph sub-index to a Phase 3+ follow-up spec only if measured bottleneck |
| Missing Neo4j advanced graph algorithms (PageRank, community detection) | Low | Not required for current use case (simple 2-hop traversal sufficient), can add in a Phase 3+ follow-up spec if user research validates need |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solving ACTUAL need NOW: Ops complexity is blocker for adoption, TypeScript-only enables embedded deployment |
| 2 | **Beyond Local Maxima?** | PASS | Explored 4 alternatives (Python microservice, Neo4j+Qdrant, embedded Neo4j, TypeScript-only), evaluated trade-offs |
| 3 | **Sufficient?** | PASS | Simplest approach that achieves goal: SQLite CTE sufficient for scale <10K, no external services needed |
| 4 | **Fits Goal?** | PASS | On critical path: Automation goals (zero-config, embedded) require eliminating service dependencies |
| 5 | **Open Horizons?** | PASS | Long-term aligned: Can add graph sub-index in a Phase 3+ follow-up spec if measured bottleneck, TypeScript-first principle maintainable |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- `lib/search/causal-boost.ts` (new): SQLite recursive CTE for 2-hop traversal
- `lib/cache/cognitive/working-memory.ts` (modify): TypeScript event decay calculation
- `lib/extraction/extraction-adapter.ts` (new): TypeScript extraction rules, hook registration
- `lib/search/session-boost.ts` (new): TypeScript attention boost calculation
- `mcp_server/handlers/memory-search.ts` (modify): Integrate boosts post-RRF

**Rollback**: No external services added, can disable features via flags (`SPECKIT_SESSION_BOOST=false`, `SPECKIT_CAUSAL_BOOST=false`), no database migrations to revert (columns backward-compatible)
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Bounded Boost Limits (Hard Cap 0.20 Multiplier)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-18 |
| **Deciders** | Tech Lead, Data Reviewer |

---

<!-- ANCHOR:adr-002-context -->
### Context

Attention boosting (session-attention + causal-neighbors) can destabilize rankings if recent irrelevant items score higher than old highly-relevant documents. Risk analysis identifies R-001 (over-boosting) as High impact, Medium likelihood:
- Session attention boost: Recent item accessed 5 minutes ago receives 0.15 multiplier
- Causal boost: 2-hop neighbor receives 0.05 per hop (0.10 max for 2-hop)
- Combined: 0.15 + 0.10 = 0.25 multiplier (25% score increase)

Example scenario: Recent grep for "test" (low semantic relevance, base RRF score 0.30) with 0.25 boost -> 0.375 final score, outranks 6-month-old architecture doc (high semantic relevance, base RRF score 0.70, no boost) -> 0.70 final score. Result: Irrelevant item ranks higher due to recency bias.

Target: Rank correlation >= 0.90 (stability), Top-5 MRR >= 0.95x baseline (no degradation).

### Constraints
- RRF fusion produces normalized scores 0.0-1.0 range
- Multiple scoring layers already exist (vector, FTS, BM25, RRF, intent weighting)
- Adding unbounded boosts risks score instability
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Hard cap all boosts (session-attention + causal-neighbors) at 0.20 multiplier applied post-RRF fusion, enforced at code level.

**Details**: Calculate combined boost `sessionBoost + causalBoost`, apply `min(combinedBoost, 0.20)` cap, compute final score `finalScore = result.score * (1 + boundedBoost)` where `result.score` is `FusionResult.score` from `rrf-fusion.ts`, accessed as `.score` in the handler. Enforcement in `memory-search.ts` after RRF fusion but before final ranking. Contract tests verify cap enforced (test case: 0.30 boost -> capped to 0.20).
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hard cap 0.20 (CHOSEN)** | Prevents runaway scores, maintains rank stability (target >= 0.90 correlation), predictable behavior, simple to reason about | Limits maximum boost effectiveness (recent highly-relevant item capped at 20% increase) | 9/10 |
| Unbounded boost | Maximum flexibility, no artificial limits on relevance signals | Score instability risk (unpredictable ranking changes), hard to debug (non-linear scoring), fails rank correlation target | 2/10 |
| Configurable cap | Allows tuning per deployment, advanced users can adjust | Adds complexity (config drift risk), requires A/B testing for each value, no clear default, scope creep | 5/10 |
| Soft cap (sigmoid) | Smooth decay prevents hard cutoff, mathematical elegance | More complex to reason about, harder to debug (non-linear), unclear how to set sigmoid parameters, over-engineering | 4/10 |

**Why Chosen**: Hard cap 0.20 provides simplest, most predictable behavior while meeting stability targets (rank correlation >= 0.90). Can add configurable cap in a Phase 3+ follow-up spec if user research validates need, but YAGNI principle suggests defer until proven necessary.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- Prevents runaway scores (recent irrelevant item cannot dominate old relevant docs)
- Maintains rank stability (target >= 0.90 correlation achievable)
- Predictable behavior (boost always 0-20%, easy to explain to users)
- Simple to implement (single `min()` call, no complex math)
- Easy to test (contract tests verify cap enforced)

**Negative**:
- Limits maximum boost effectiveness for recent highly-relevant items - Mitigation: 20% increase is substantial (0.70 RRF -> 0.84 final), sufficient for most cases, tune base boost values (0.15 session, 0.05/hop causal) if needed
- May under-weight recent work in edge cases (recent item + strong causal connections capped at 0.20 combined) - Mitigation: Shadow evaluation measures impact, can adjust cap to 0.25 in a Phase 3+ follow-up spec if data shows benefit

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Cap too restrictive (recent relevant work under-ranked) | Medium | Shadow evaluation measures top-5 MRR, A/B test shows >= 0.95x baseline acceptable, can adjust cap to 0.25 if data supports |
| False sense of security (cap prevents obvious failures but subtle ranking issues remain) | Low | Rank correlation monitor detects subtle issues, telemetry dashboard tracks boost distributions, user feedback loop validates usefulness |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solving ACTUAL need NOW: Over-boosting is High impact risk (R-001), cap prevents score instability failures |
| 2 | **Beyond Local Maxima?** | PASS | Explored 4 alternatives (unbounded, configurable cap, soft cap sigmoid, hard cap 0.20), evaluated trade-offs |
| 3 | **Sufficient?** | PASS | Simplest approach: Hard cap 0.20 achieves stability goal without over-engineering (sigmoid, config system) |
| 4 | **Fits Goal?** | PASS | On critical path: Rank stability (>= 0.90 correlation) is P0 requirement (REQ-001), cap enforces stability |
| 5 | **Open Horizons?** | PASS | Long-term aligned: Can make configurable in a Phase 3+ follow-up spec if user research validates need, start simple per YAGNI |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**:
- `lib/search/session-boost.ts`: Calculate session boost (attention score * 0.15)
- `lib/search/causal-boost.ts`: Calculate causal boost (0.05 / hop distance, max 2 hops)
- `mcp_server/handlers/memory-search.ts`: Combine boosts, apply cap, compute final scores

**Code Pattern**:
```typescript
const sessionBoost = getSessionAttentionBoost(sessionId, result.id);
const causalBoost = getCausalNeighborBoost(result.id, causalEdges);
const combinedBoost = sessionBoost + causalBoost;
const boundedBoost = Math.min(combinedBoost, 0.20); // Hard cap
result.finalScore = result.score * (1 + boundedBoost);
```

**Rollback**: Remove boost calculation calls, return `result.score` as `result.finalScore` (no multiplier), verify baseline ranking restored
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Event-Based Decay (Not Time-Based)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-18 |
| **Deciders** | Tech Lead, Implementation Team |

---

<!-- ANCHOR:adr-003-context -->
### Context

Current working memory decay is time-based: `newScore = oldScore * pow(0.95, minutesElapsed)`. This breaks across pause/resume cycles:
- User pauses work for 24 hours (1440 minutes)
- Decay factor: `pow(0.95, 1440) = 4.8e-32` (effectively zero)
- All working memory items decay to near-zero even if task context still relevant
- Agent loses all session context on resume, user must re-explain work

Interaction distance is better proxy for relevance than wall-clock time:
- Item mentioned 3 turns ago is more relevant than item from 3 days ago never re-accessed
- Event-counter decay: `pow(0.85, eventsElapsed)` survives pause/resume (counter frozen during pause)
- Mention boost rewards re-access: `mentions * 0.05` added to decayed score

Analysis of `opencode-working-memory` shows event-based approach enables session continuity. The causal edges table is managed via `lib/storage/causal-edges.ts` (confirmed canonical path).

### Constraints
- Working memory table schema requires `event_counter` and `mention_count` columns (migration needed)
- Decay floor (0.05) prevents oscillation, delete threshold (0.01) separate from floor
- Event counter rollover risk at 2^31 (u32 max = 4,294,967,296 events, ~10 years at 1 event/second)
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Replace time-based decay with event-counter decay: `score = baseScore * pow(0.85, eventsElapsed) + mentions * 0.05`, floor 0.05, delete threshold 0.01.

**Details**: Track `event_counter` (current turn number) and `mention_count` (re-access count) in working_memory table. On each access, compute `eventsElapsed = (currentEventCounter - item.lastEventCounter + MAX_COUNTER) % MAX_COUNTER` (where `MAX_COUNTER = 2^31`, handles counter wrap-around correctly), apply decay, add mention boost. Raw score below 0.01 triggers eviction; surviving items receive floor of 0.05 (prevents oscillation, item remains searchable).
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Event-based decay (CHOSEN)** | Session continuity across pauses (counter frozen), relevance tied to interaction distance, mention boost rewards re-access, pause/resume "just works" | Event counter requires tracking (`event_counter` column), modulo arithmetic for rollover prevention | 9/10 |
| Time-based decay (current) | Simple (no extra columns), wall-clock time intuitive | Breaks on pause/resume (24hr pause -> zero scores), irrelevant items persist if not time-decayed, user must manually manage context | 3/10 |
| Hybrid decay (time + events) | Captures both recency and interaction distance | Complex (unclear weighting), two decay factors hard to tune, over-engineering, no clear use case for time component | 4/10 |
| Fixed TTL (expire after N hours) | Simple expiration logic | Same pause/resume issues as time-based, binary (present/absent) loses gradual decay benefit, items disappear abruptly | 2/10 |

**Why Chosen**: Event-based decay solves pause/resume problem (critical for session continuity UX goal), ties relevance to interaction distance (better proxy than wall-clock time), and enables mention boost (rewards re-access). Hybrid decay over-engineers without clear benefit, fixed TTL has same issues as time-based.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**Positive**:
- Session continuity across pauses (event counter frozen during pause, decay resumes on next interaction)
- Relevance tied to interaction distance (item 3 turns ago more relevant than item 3 days ago never re-accessed)
- Mention boost rewards re-access (frequently mentioned items persist, one-time items decay faster)
- Predictable behavior (decay based on agent activity, not wall-clock time, easier to reason about)

**Negative**:
- Schema migration required (`event_counter`, `mention_count` columns) - Mitigation: Backward-compatible (nullable, default 0), migration script tested, rollback possible (columns unused if feature disabled)
- Event counter rollover at 2^31 (~10 years at 1 event/second) - Mitigation: Modulo arithmetic (`eventCounter % 2^31`), periodic normalization (reset counter on session end), acceptable for 10-year horizon

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Event counter overflow (>2^31) | Low | Modulo arithmetic prevents overflow, periodic normalization resets counter, monitor for edge cases |
| Mention boost gaming (agent repeatedly accesses same item to inflate score) | Low | Mention boost capped at 0.05 per mention (5% increase), floor 0.05 prevents runaway, sweep logic evicts below delete threshold 0.01 |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solving ACTUAL need NOW: Pause/resume continuity is user pain (analysis), time-based decay breaks this use case |
| 2 | **Beyond Local Maxima?** | PASS | Explored 4 alternatives (event-based, time-based, hybrid, fixed TTL), evaluated trade-offs, event-based best fits goal |
| 3 | **Sufficient?** | PASS | Simplest approach that solves pause/resume: Event counter + mention boost, no complex hybrid logic |
| 4 | **Fits Goal?** | PASS | On critical path: Session continuity (SC-005, user satisfaction >= 4.0/5.0) requires pause/resume support |
| 5 | **Open Horizons?** | PASS | Long-term aligned: Event-based enables future multi-session context fusion in a Phase 3+ follow-up spec, extensible design |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**Affected Systems**:
- `lib/cache/cognitive/working-memory.ts`: Modify decay calculation (replace time-based logic — locate attentionDecayRate/decayInterval block at runtime; no hardcoded line numbers)
- Database migration: Add `event_counter INT DEFAULT 0`, `mention_count INT DEFAULT 0` to working_memory table
- Working memory access: Increment `event_counter` on each tool execution, increment `mention_count` on re-access

**Code Pattern**:
```typescript
const MAX_COUNTER = 2 ** 31;
const eventsElapsed = (currentEventCounter - (item.lastEventCounter ?? 0) + MAX_COUNTER) % MAX_COUNTER;
const decayedScore = item.attentionScore * Math.pow(0.85, eventsElapsed);
const mentionBoost = item.mentions * 0.05;
const rawScore = decayedScore + mentionBoost;
if (rawScore < 0.01) { evict(item); return; } // Evict BEFORE applying floor
const newScore = Math.max(0.05, rawScore); // Floor 0.05 for surviving items
```

**Rollback**: Revert to time-based decay calculation (`pow(0.95, minutesElapsed)`), ignore `event_counter`/`mention_count` columns (backward-compatible)
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Schema-Driven Extraction Rules (Not Hardcoded Logic)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-18 |
| **Deciders** | Tech Lead, Implementation Team |

---

<!-- ANCHOR:adr-004-context -->
### Context

Tool outputs vary widely (Read returns file contents, Grep returns match lists, Bash returns stdout). Extraction logic must determine:
1. Should this tool output be saved to working memory? (relevance filter)
2. What attention score? (Read spec.md high priority 0.9, Grep error medium 0.8, Bash debug low 0.5)
3. Should content be summarized? (Read 10KB file -> first/last 500 chars, Grep 1000 matches -> count + filenames)

Hardcoded if/else chains for tool matching become unmaintainable as tool count grows:
```typescript
if (toolName === 'Read' && filePath.endsWith('spec.md')) {
  attention = 0.9; summarizer = 'firstLast500';
} else if (toolName === 'Grep' && output.includes('error')) {
  attention = 0.8; summarizer = 'matchCountSummary';
} else if (toolName === 'Bash' && output.includes('git commit')) {
  attention = 0.7; summarizer = 'stdoutSummary';
} // ... 20+ more branches
```

Schema-driven approach defines rules as declarative objects:
```typescript
{ toolPattern: /^Read/, contentPattern: /spec\.md$/, attention: 0.9, summarizer: 'firstLast500' }
```

Future-proof for user configuration (JSON file, environment variables) without code changes.

### Constraints
- Rules must be matched in priority order (first match wins) to handle overlapping patterns
- Schema validation overhead (Zod parse) adds ~1ms per tool execution (acceptable <5ms target)
- Debugging less obvious than if/else (mitigated by logging)
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**Summary**: Define extraction rules as schema objects with priority-ordered matching (first match wins), enable future JSON config without code changes.

**Details**: Create `ExtractionRuleSchema` with fields `{ toolPattern: Regex, contentPattern: Regex, attention: 0.0-1.0, summarizer: string }`. Match tool name and output content against patterns in priority order. Apply attention score and summarizer from first matching rule. Validate rules at startup via Zod (fail-fast on malformed config).
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Schema-driven rules (CHOSEN)** | Declarative (easy to read), extensible (add rules without code changes), future-proof (JSON config in a Phase 3+ follow-up spec), testable (rule matching isolated) | Schema validation overhead (~1ms per tool), debugging less obvious than if/else (mitigated by logging) | 9/10 |
| Hardcoded tool names | Simple if/else, obvious logic flow, no validation overhead | Brittle (breaks on tool renames), unmaintainable (20+ branches), not extensible (every new tool = code change), violates open/closed principle | 3/10 |
| LLM-based extraction | Maximum flexibility (natural language rules), no pattern maintenance | Latency (>100ms vs <5ms for rules), non-determinism (same input -> different outputs), token cost, overkill for simple matching | 2/10 |
| Plugin system (user code) | Ultimate extensibility (users write extraction logic) | Security risk (arbitrary code execution), testing burden (user code quality unknown), complexity overhead (plugin loader, sandboxing) | 4/10 |

**Why Chosen**: Schema-driven rules provide best balance of simplicity, extensibility, and maintainability. Declarative approach is self-documenting, easy to test (rule matching isolated), and future-proof for JSON config. LLM-based extraction over-engineers (100ms+ latency, token cost, non-determinism), plugin system introduces security risks.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**Positive**:
- Declarative rules (easy to read, self-documenting, no complex if/else chains)
- Extensible (add rules without code changes, JSON config path in a Phase 3+ follow-up spec)
- Testable (rule matching isolated, unit tests straightforward)
- Future-proof (users can add custom rules via config file in a Phase 3+ follow-up spec if validated need)

**Negative**:
- Schema validation overhead (~1ms per tool execution via Zod parse) - Mitigation: <5ms target acceptable (NFR-P03), validation cached after first parse, negligible vs tool execution time (Read 10ms+, Grep 50ms+, Bash 100ms+)
- Debugging less obvious than if/else (pattern matching not explicit in stack trace) - Mitigation: Logging shows matched rule (tool pattern, content pattern, attention score, summarizer), telemetry tracks extraction counts per rule

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Regex performance (ReDoS vulnerability via malformed extraction rule pattern) | Medium | Validate all patterns at startup via TypeScript polynomial-time safety check (reject nested quantifiers, backreference quantifiers per ADR-006); server aborts with clear error if unsafe pattern detected — no runtime timeout, static analysis is the sole defense |
| Rule conflicts (multiple patterns match, unclear which wins) | Low | Priority-ordered matching (first match wins), document rule order, warn on overlapping patterns at startup |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solving ACTUAL need NOW: Extraction logic needed for automation (Phase 2), hardcoded if/else unmaintainable at scale |
| 2 | **Beyond Local Maxima?** | PASS | Explored 4 alternatives (schema-driven, hardcoded, LLM-based, plugin system), evaluated trade-offs, schema-driven best balance |
| 3 | **Sufficient?** | PASS | Simplest approach: Declarative rules + priority matching, no LLM overhead, no plugin complexity |
| 4 | **Fits Goal?** | PASS | On critical path: Extraction automation (REQ-007) requires pattern matching, schema enables JSON config future path |
| 5 | **Open Horizons?** | PASS | Long-term aligned: JSON config path in a Phase 3+ follow-up spec if user research validates, extensible without breaking changes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**Affected Systems**:
- `lib/extraction/extraction-adapter.ts`: Create `ExtractionRuleSchema`, implement priority-ordered matching
- `configs/cognitive.ts`: Define default extraction rules (Read spec.md -> 0.9, Grep error -> 0.8, Bash git commit -> 0.7)
- Tool execution hook: Register callback to match rules on tool completion, insert to working_memory

**Code Pattern**:
```typescript
const rules = [
  { toolPattern: /^Read/, contentPattern: /spec\.md$/, attention: 0.9, summarizer: 'firstLast500' },
  { toolPattern: /^Grep/, contentPattern: /error/i, attention: 0.8, summarizer: 'matchCountSummary' },
  { toolPattern: /^Bash/, contentPattern: /git commit/, attention: 0.7, summarizer: 'stdoutSummary' },
];

const matchedRule = rules.find(rule => 
  rule.toolPattern.test(toolName) && rule.contentPattern.test(output)
);
if (matchedRule) {
  const summary = applySummarizer(output, matchedRule.summarizer);
  insertWorkingMemory({ summary, attention: matchedRule.attention, eventCounter });
}
```

**Rollback**: Disable extraction hook (`SPECKIT_EXTRACTION=false`), working_memory inserts stop, no manual saves required (graceful degradation)
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: PII / Secret Redaction Gate Before Working Memory Insert

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-18 |
| **Deciders** | Tech Lead, Security Reviewer |

---

<!-- ANCHOR:adr-005-context -->
### Context

The extraction adapter (Phase 2) captures tool outputs and inserts summaries into working_memory automatically. Tool outputs may contain sensitive content:
- Read tool: files containing API keys, `.env` content, credentials
- Bash tool: stdout with AWS/GCP tokens, SSH private keys, connection strings
- Grep tool: matches that include secret patterns

If secrets land in working_memory, they can be:
1. Included in system prompt injections (sent to LLM context)
2. Persisted in SQLite database (written to disk)
3. Returned in memory_search results (exposed to downstream callers)

Current extraction design (T035) inserts summaries without any sanitization gate.

### Constraints
- Redaction must run synchronously before insert (cannot be async — insert must be blocked)
- False negative (missed secret) is worse than false positive (over-redaction)
- Patterns must balance coverage vs. noise (broad patterns risk over-redacting normal code)
- Must not materially increase extraction latency (target: redaction adds <2ms per tool call)
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**Summary**: Implement a synchronous `redaction-gate.ts` module that applies denylist regex patterns to extracted content before any working_memory insert. Replace matches with `[REDACTED]`. Set `redaction_applied: true` in provenance metadata.

**Details**: Denylist patterns (all case-insensitive where applicable):
- API keys: `/[A-Za-z0-9_\-]{32,}(?=["'\s])/` (generic high-entropy token heuristic)
- Bearer tokens: `/Bearer\s+\S+/i`
- PEM private keys: `/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/`
- AWS access keys: `/AKIA[0-9A-Z]{16}/`
- GCP service account: `/"type"\s*:\s*"service_account"/`
- Emails: `/\b[\w.+-]+@[\w-]+\.\w{2,}\b/`
- URLs with credentials: `/https?:\/\/[^@\s]+:[^@\s]+@/`
- JWT tokens: `/eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+/`

Apply all patterns to extracted summary string. Replace each match in-place with `[REDACTED]`. Record `redaction_applied: boolean` in provenance.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Denylist regex gate (CHOSEN)** | Fast (<2ms), deterministic, no external dependency, covers known secret formats, explicit and auditable | Pattern maintenance (new secret formats require updates), false positives possible on code with long hex strings | 9/10 |
| No redaction (current design) | Zero overhead, no false positives | Secrets leak into working_memory, LLM context, SQLite on disk — critical security gap | 1/10 |
| Allowlist-only approach | Zero false negatives by design | Requires explicit allow of every content type, impractical for code outputs (infinite allowlist), blocks legitimate content | 2/10 |
| LLM-based secret detection | Natural language understanding, adapts to novel patterns | >100ms per call (violates <5ms target), token cost, non-deterministic, creates recursive security dependency | 2/10 |
| External vault/scanner integration | Production-grade secret detection | External service dependency (violates TypeScript-only ADR-001), ops complexity, latency, overkill for embedded use | 4/10 |

**Why Chosen**: Denylist regex gate is the simplest approach that meaningfully reduces risk without violating the TypeScript-only constraint (ADR-001) or the latency target (NFR-P03 <5ms hook overhead). Over-redaction is acceptable (conservative); under-redaction is not.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**Positive**:
- Secrets no longer persist to working_memory SQLite or appear in system prompt injections
- Provenance field `redaction_applied` enables auditing (count redactions per session, alert on high rate)
- Denylist is explicit and auditable (not a black box)
- No external dependencies, no latency impact beyond regex matching (<2ms for 8 patterns)

**Negative**:
- Pattern maintenance required when new secret formats emerge - Mitigation: Patterns in `lib/extraction/redaction-gate.ts`, easy to add, unit tests enforce coverage
- False positives possible (e.g., long SHA256 hashes in git output matched by generic token pattern) - Mitigation: Summarizers truncate content before redaction gate, reducing match surface; false positive rate measured in unit tests

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Novel secret format not in denylist | High | Conservative generic pattern (32+ char alphanumeric) catches many formats, periodically review patterns vs. new secret types |
| False positive rate too high (over-redaction degrades extraction quality) | Medium | Measure false positive rate in 50-session test set (CHK-037), tune patterns if rate >15% |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solving ACTUAL need NOW: Auto-extraction without redaction creates secret leakage risk (critical severity, REQ-011) |
| 2 | **Beyond Local Maxima?** | PASS | Explored 5 alternatives (no redaction, denylist, allowlist, LLM, external vault), denylist best balance |
| 3 | **Sufficient?** | PASS | Simplest approach: Regex denylist covers known patterns, <2ms overhead, no new dependencies |
| 4 | **Fits Goal?** | PASS | On critical path: Secret safety is P0 requirement (NFR-S03), gate blocks insertion pipeline |
| 5 | **Open Horizons?** | PASS | Long-term aligned: Denylist extensible (add patterns), can add entropy-based heuristics in a Phase 3+ follow-up spec if false negative rate measured |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**Affected Systems**:
- `lib/extraction/redaction-gate.ts` (new): Denylist patterns, `redact(content: string): { redacted: string; applied: boolean }` function
- `lib/extraction/extraction-adapter.ts` (modify): Call `redactGate.redact(summary)` before working_memory insert; write `redaction_applied` to provenance

**Code Pattern**:
```typescript
const DENYLIST_PATTERNS = [
  /Bearer\s+\S+/gi,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  /AKIA[0-9A-Z]{16}/g,
  /"type"\s*:\s*"service_account"/gi,
  /\b[\w.+-]+@[\w-]+\.\w{2,}\b/g,
  /https?:\/\/[^@\s]+:[^@\s]+@/g,
  /eyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+/g,
  /[A-Za-z0-9_\-]{32,}(?=["'\s])/g, // generic high-entropy token
];

export function redact(content: string): { redacted: string; applied: boolean } {
  let result = content;
  let applied = false;
  for (const pattern of DENYLIST_PATTERNS) {
    const replaced = result.replace(pattern, '[REDACTED]');
    if (replaced !== result) applied = true;
    result = replaced;
  }
  return { redacted: result, applied };
}
```

**Rollback**: Set `SPECKIT_EXTRACTION=false` (disables extraction adapter entirely), no partial rollback needed (redaction gate is internal to adapter)
<!-- /ANCHOR:adr-005-impl -->

<!-- ANCHOR:adr-005-calibration -->
### Pre-Implementation Calibration (REQ-017)

**Requirement**: Before implementing `redaction-gate.ts` in Phase 2, a calibration run MUST be completed during Phase 1.5 to measure false positive rate on real tool outputs.

**Procedure**:
1. Collect 50 real Bash tool outputs from existing session logs (stored in `scratch/redaction-calibration-inputs/`)
2. Run current denylist patterns against all 50 inputs
3. Identify false positives: non-secret content matched and would-be-redacted
4. Measure FP rate = (false positive redactions) / (total non-secret tokens evaluated)
5. **Hard gate**: FP rate must be <= 15% before Phase 2 begins (CHK-158)

**Known FP Categories and Mitigation**:

| FP Pattern | Example | Mitigation |
|------------|---------|------------|
| Git commit hashes (40-char hex) | `a3f2c1d0...` matched by generic token heuristic | Exclude strings matching `/^[0-9a-f]{40}$/` (exact git SHA format) |
| UUIDs | `550e8400-e29b-41d4-a716-446655440000` | Exclude strings matching `/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i` |
| Long hex strings (non-secret) | Build artifact hashes, content hashes | Tighten generic token heuristic: require min 40 chars AND not pure hex |

**Tuning Loop**: If FP rate > 15% after initial calibration:
1. Identify top FP-contributing pattern
2. Add exclusion heuristic or raise minimum length threshold
3. Re-run calibration on same 50 inputs
4. Repeat until FP <= 15%
5. Document all heuristic changes in `scratch/redaction-calibration.md`

**Security-First Priority**: If tuning cannot achieve FP <= 15% without dropping meaningful secret coverage, choose lower FP threshold over broader coverage — over-redaction is always preferable to secret leakage.
<!-- /ANCHOR:adr-005-calibration -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Regex Safety Constraints for Extraction Rules (ReDoS Prevention)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-18 |
| **Deciders** | Tech Lead, Implementation Team |

---

<!-- ANCHOR:adr-006-context -->
### Context

Schema-driven extraction rules (ADR-004) allow user-configurable regex patterns for tool name matching (`toolPattern`) and content matching (`contentPattern`). Regex patterns with certain structures cause catastrophic backtracking (ReDoS — Regular Expression Denial of Service):

```
// Vulnerable pattern example
/(a+)+$/.test("aaaaaaaaaaaaaaaaaaaaX") // O(2^N) time complexity — hangs Node.js
```

Because patterns are evaluated on every tool completion, a single malformed pattern can:
1. Block the event loop for seconds (Node.js is single-threaded)
2. Starve all MCP tool responses during extraction
3. Degrade server responsiveness proportional to tool output size

The extraction adapter must evaluate patterns against potentially large tool outputs (Read returning 50KB files, Grep returning 5000 matches).

### Constraints
- Pattern validation must run at startup (not per-call) to avoid runtime penalty
- Must fail-fast with clear error message if unsafe pattern detected (no silent ignore)
- Built-in Node.js RegExp has no built-in ReDoS protection
- External `safe-regex` package (available npm, MIT) can detect vulnerable patterns statically
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**Summary**: Validate all extraction rule regexes at startup using a TypeScript polynomial-time safety check (no external library, TypeScript-only per ADR-001). Any pattern that fails validation aborts server startup with a clear error. No runtime timeout — static analysis at startup is the sole defense.

**Details**:
1. At Zod config validation time, run a polynomial-time safety check on every `toolPattern` and `contentPattern` in cognitive config
2. The check rejects patterns containing: nested quantifiers `(a+)+`, `(a*)*`, `(a?)*`; quantifier over group with alternation `(a|b)*` where both branches share common prefix; backreferences with quantifiers
3. If any pattern fails, throw `Error("ExtractionRule contains potentially catastrophic regex: [pattern] — rejected to prevent ReDoS")`
4. No runtime timeout fallback — a post-hoc `safeMatch()` pattern (checking `Date.now()` after `RegExp.test()`) cannot actually prevent event loop blocking in single-threaded Node.js because the timing check runs AFTER the regex completes, not during. Static analysis at startup is the reliable defense.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **TypeScript polynomial-time check at startup (CHOSEN)** | Fail-fast on obvious ReDoS, no external dependency, TypeScript-only compliant (ADR-001), zero runtime overhead | Conservative — may reject some safe-but-complex patterns as false positives | 9/10 |
| `safe-regex` npm package | Battle-tested library, catches >95% of patterns | External dependency violates TypeScript-only, no-new-dependencies rule (ADR-001, spec.md §14 compliance) | 7/10 |
| Static analysis + runtime `safeMatch()` timeout | Two-layer defense concept | Runtime `safeMatch()` pattern is fundamentally flawed in single-threaded Node.js — `Date.now()` check runs AFTER `regex.test()` completes, not during; provides false sense of security, does not prevent event loop blocking | 5/10 |
| No validation (current design) | Zero overhead | ReDoS vulnerability on any malformed pattern, server hang risk | 1/10 |
| Runtime timeout only (no static analysis) | Catches all cases eventually | Per-call overhead; in Node.js single-threaded model, event loop blocks before timeout fires (requires Worker threads for true timeout) | 3/10 |
| Disable user-configurable patterns (hardcoded only) | Zero ReDoS risk | Removes extensibility (contradicts ADR-004's JSON config future path), reduces value | 3/10 |

**Why Chosen**: TypeScript polynomial-time check at startup catches known dangerous patterns (nested quantifiers, backreference quantifiers) at zero runtime cost and zero external dependencies. The `safe-regex` npm package is well-maintained but violates the no-new-dependencies constraint. Runtime timeout approaches are fundamentally unreliable in Node.js single-threaded model without Worker threads (which add disproportionate complexity for this use case). Implementers should prefer simple literal patterns over complex alternations to avoid false positive rejections.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**Positive**:
- Server startup fails loudly on unsafe patterns (operator immediately informed, not silently degraded)
- No external dependencies — TypeScript-only compliance maintained (ADR-001, spec.md §14)
- No per-call validation overhead (validation runs once at startup, cached result)
- Pattern authors get clear error messages with the offending pattern string
- No false sense of security from unreliable runtime timeout mechanisms

**Negative**:
- Custom polynomial-time check is conservative — may reject some safe-but-complex patterns as false positives - Mitigation: Implementers should prefer simple literal patterns; complex patterns can be split into two simpler patterns; document workarounds in runbook
- Static analysis cannot catch all ReDoS variants (some safe patterns may have adversarial inputs) - Mitigation: Extraction rule patterns are authored by developers (not untrusted users), reducing adversarial risk; monitor extraction latency in telemetry (CHK-112)

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Custom check misses advanced ReDoS pattern not covered by nested-quantifier detection | Medium | Extraction patterns authored by trusted developers (not user input); monitor p95 extraction latency; expand check patterns if new dangerous constructs identified |
| Operator error: legitimate complex pattern rejected at startup | Low | Clear error message + runbook guidance; operator can simplify pattern or split into two simpler patterns |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Solving ACTUAL need NOW: Schema-driven rules (ADR-004) allow user patterns — without validation, ReDoS is real risk on large tool outputs (NFR-S04) |
| 2 | **Beyond Local Maxima?** | PASS | Explored 5 alternatives (no validation, static only, runtime only, two-layer, disable user patterns), selected startup static validation as best fit under TypeScript-only + no-new-dependency constraints |
| 3 | **Sufficient?** | PASS | Simplest approach: TypeScript polynomial-time check at startup — no external dependency, no custom parser, no sandboxed eval |
| 4 | **Fits Goal?** | PASS | On critical path: Extraction adapter (REQ-007) + schema rules (ADR-004) require safe regex validation before deployment |
| 5 | **Open Horizons?** | PASS | Long-term aligned: Can upgrade to `safe-regex` package or Hyperscan bindings if false negative rate too high, same interface contract |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**Affected Systems**:
- `configs/cognitive.ts` (modify): Validate all rule regexes using TypeScript polynomial-time check at Zod parse time
- No `package.json` changes (no external dependencies)

**Code Pattern**:
```typescript
// At startup (cognitive.ts config validation)
function isUnsafeRegex(pattern: RegExp): boolean {
  const src = pattern.source;
  // Reject nested quantifiers: (a+)+, (a*)*
  if (/\([^)]*[+*][^)]*\)[+*{]/.test(src)) return true;
  // Reject backreference with quantifier: \1+, \2*
  if (/\\[1-9][+*{]/.test(src)) return true;
  return false;
}

for (const rule of extractionRules) {
  if (isUnsafeRegex(rule.toolPattern) || isUnsafeRegex(rule.contentPattern)) {
    throw new Error(
      `ExtractionRule "${rule.id}" contains potentially catastrophic regex: ` +
      `toolPattern=${rule.toolPattern}, contentPattern=${rule.contentPattern}. ` +
      `ReDoS risk detected. Simplify or split the pattern.`
    );
  }
}

// NOTE: No runtime safeMatch() — checking Date.now() after regex.test()
// cannot prevent event loop blocking in Node.js single-threaded model.
// Static analysis at startup is the sole defense per this ADR.
```

**Rollback**: Remove regex validation calls, patterns evaluated without safety checks (graceful degradation to previous behavior; not recommended)
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!--
Level 3+ Decision Record (v1.3 — 2026-02-18)
- 6 ADRs covering key technical decisions
- ADR-001: TypeScript-only (no Python/Docker) — paths corrected to lib/cache/cognitive/
- ADR-002: Bounded boost limits (hard cap 0.20)
- ADR-003: Event-based decay (not time-based) — causal-edges path corrected to lib/storage/
- ADR-004: Schema-driven extraction rules
- ADR-005: PII/secret redaction gate (NEW) — v1.3: added pre-implementation calibration section (REQ-017): 50 Bash outputs, FP <= 15% gate, commit-hash/UUID exclusion heuristics, tuning loop
- ADR-006: Regex safety constraints / ReDoS prevention (NEW, v1.2: rewritten to TypeScript-only check, safe-regex rejected, safeMatch removed)
- ADR-003: v1.2 fix — floor/eviction logic corrected (raw score checked before floor), wrap-around arithmetic fixed
- Each ADR includes Five Checks evaluation
- Alternatives documented with pros/cons/scores
- Implementation details and rollback procedures provided
-->

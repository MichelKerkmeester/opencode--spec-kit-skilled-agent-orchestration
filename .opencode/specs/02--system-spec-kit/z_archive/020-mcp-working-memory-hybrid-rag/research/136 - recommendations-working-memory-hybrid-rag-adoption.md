# 136 - Actionable Recommendations: Adopting Working Memory + Hybrid RAG Patterns

## Executive Summary

**UX North Star**: Users never think about memory management — agent continuity, context surfacing, and pressure handling happen automatically.

**Automation North Star**: Zero-config cognitive features that improve agent behavior without changing task logic.

The target system already has strong foundations: hybrid retrieval (`.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:215-462`), intent-aware weighting, RRF fusion, and causal edges. **The main gap**: session-time operational cognition.

| Missing Capability | User Pain | Automation Solution |
|-------------------|-----------|---------------------|
| Automatic extraction | Manual `/memory:save` every action | Hook-based extraction from tool outputs |
| Pressure-triggered policies | Agent fails at 95% context | Progressive retrieval mode switching |
| Session-aware ranking | Recent work buried | Event-based attention boost in scoring |
| Seamless resume | "What were we doing?" | System prompt auto-injection |

**Recommendation**: Implement in three incremental phases with feature flags, shadow evaluation, and measurable UX metrics.

[Assumes: TARGET_SYSTEM_DESCRIPTION means improving Spec Kit Memory MCP for session continuity, lower token waste, and higher retrieval precision during long workflows.]

---

## 1) Prioritized Roadmap

### Phase 1 (1-2 weeks)

**Capabilities**: Session-attention boost (modify `memory-search.ts:433-476`), pressure-aware policy (gate in `memory-context.ts:181`), event-based decay (update `working-memory.ts:298-316`)

**Targets**: ≥15% token waste reduction, ≥25% fewer context errors, session continuity across pauses

**Patterns**: Working memory table exists (`.opencode/skill/.../working-memory.ts:42-73`) but attention scores unused in ranking. Add `getAttentionBoost()` with bounded 0.20 multiplier post-RRF. Query token usage at mode selection, override to lighter mode if high. Replace time-based decay (0.95/min) with event-counter + `mention_count` column.

**Testing**: Shadow evaluation (1000 queries), token metrics before/after, pressure simulation (50 sessions), regression tests (rank correlation ≥0.90)

**Sources**: `.opencode/specs/.../opencode-working-memory/index.ts:73-114, 893-905, 1419-1427`

### Phase 2 (2-4 weeks)

**Capabilities**: Extraction pipeline (new `extraction-adapter.ts`), causal-neighbor boost (extend `causal-edges.ts:202`), system prompt injection

**Targets**: ≥60% manual save reduction, ≥10% top-5 usefulness improvement, "just works" in user surveys

**Patterns**: Schema-driven extraction rules (Read spec.md → attention 0.9, Grep error → 0.8, Bash git commit → 0.7). Causal edges exist (`.opencode/skill/.../causal-edges.ts:202-287`) but unused in ranking. Add `getRelatedByEdges(memoryId, maxHops=2)` to boost neighbors within 2 hops.

**Testing**: Mock tool outputs → verify extraction → check working memory state. Precision ≥85%, recall ≥70%. User feedback loop: "Was this memory useful?"

**Sources**: `.opencode/specs/.../graphrag-hybrid/src/database/neo4j_manager.py:252-258`

### Phase 3 (4-8 weeks) — Only If Measured Need

**Capabilities**: Graph sub-index (corpus >10K docs), multi-session context fusion (user requests), predictive pre-loading (latency justifies)

**Decision Gate**: Proceed only if Phase 1/2 plateau, bottlenecks measured (not hypothetical), user research validates need

**Rationale**: Phase 1+2 deliver 80% of UX value with 20% of complexity

---

## 2) Risk Analysis

| Risk | Mitigation |
|------|-----------|
| **Over-Boosting** (recent irrelevant dominates) | Hard cap 0.20, A/B test 1000 queries, monitor rank correlation <0.90, kill switch |
| **Aggressive Pressure** (5 results vs 20 expected) | Staged rollout 80%→tighten, feedback message, override escape hatch, telemetry, adaptive tuning |
| **Config Drift** (docs/code mismatch) | Single source (`configs/cognitive.ts`), Zod validation at init, generated docs, startup checks |
| **Cross-Language Burden** (TS+Python+Docker) | TypeScript-first rule, logic extraction (not infra), embedded SQLite not Neo4j/Qdrant, Node.js-only |
| **Hidden Bugs** (silent failures) | Strict TypeScript, config types (Zod), contract tests, fail-fast at startup, E2E tests |

---

## 3) Migration Pathways

| Path | Timeline | Scope | Key Trade-offs |
|------|----------|-------|----------------|
| **Conservative** | 1-2 weeks | Phase 1 only | Low risk, immediate value (token waste + graceful degradation), no infra changes, easy rollback. Doesn't eliminate manual saves (extraction in Phase 2), no graph retrieval, scoring improvements only. |
| **Balanced** ⚖️ | 3-6 weeks | Phase 1+2 (full automation) | ≥60% manual work reduction, relationship-aware retrieval, no external services, measurable automation impact. ~2x test overhead, extraction tuning needed, schema additions (`event_counter`, `mention_count`). **RECOMMENDED** |
| **Aggressive** | 8-12 weeks | Phase 1+2+3 | Highest scale ceiling (100K+ docs), advanced features (cross-session fusion, predictive), future-proof. Highest ops burden (Neo4j/Qdrant if adopted), more failure modes, slower velocity, over-engineering risk. Only for enterprise scale with measured bottlenecks. |

**Decision**: Start with **Path B** — delivers 80% of UX value with manageable complexity. Reassess Phase 3 after 6 months based on user feedback and scale metrics.

---

## 4) Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Token Waste | ≤85% baseline | Payload tokens (sessions >20 turns) |
| Context Errors | ≤25% baseline | "context exceeded" count |
| Manual Saves | ≤40% baseline | `/memory:save` / tool executions |
| Top-5 MRR | ≥0.95x baseline | Mean Reciprocal Rank |
| Continuity | ≥80% auto-resume | Survey: "Agent remembered?" |
| Extraction Precision | ≥85% | False-positive rate |
| Extraction Recall | ≥70% | False-negative rate |
| Pressure Activation | <20% queries | Override frequency |
| Causal Boost | ≥10% | Usefulness delta |
| Rank Correlation | ≥0.90 | Stability (new vs baseline) |

**UX Surveys** (1-5): Continuity ≥4.0, Relevance ≥4.2, Performance ≥3.8, Trust ≥4.0

---

## 5) Summary

**Core Recommendation**: **Path B (Balanced)** — Phase 1+2 for full automation stack.

**Key Principles**:
1. **Logic YES, Infrastructure NO** — Port algorithms (scoring, decay, extraction), avoid service dependencies (Neo4j, Qdrant, Python runtime)
2. **Automation > Configuration** — Zero-config defaults, advanced tuning optional
3. **Transparency Builds Trust** — Rich response metadata explains what automation was applied
4. **Fail Loudly, Not Silently** — Config errors at startup (Zod validation), not silent runtime failures
5. **Measure Everything** — A/B tests, telemetry dashboards, user surveys validate impact

**Expected Outcomes** (6 months post-rollout):
- ≥60% reduction in manual memory saves (automation eliminates toil)
- ≥15% reduction in token waste (session attention prevents repetition)
- ≥25% reduction in context-exceeded errors (pressure policy prevents failures)
- ≥4.0/5.0 user satisfaction on continuity (agent "just remembers" context)

**Implementation Code Patterns** (inline for adoption):

- **Bounded Boost**: `finalScore = result.score * (1 + min(attentionBoost + causalBoost, 0.20))` — hard cap prevents runaway scores. Apply after RRF fusion, before final ranking. `result.score` is `FusionResult.score` from `rrf-fusion.ts`, accessed as `.score` in the handler. Location: `.opencode/skill/.../memory-search.ts:433-476`

- **Event Decay**: `newScore = attentionScore * pow(0.85, eventsElapsed) + mentionCount * 0.05` with floor 0.05 (prevents oscillation), delete threshold 0.01 (separate from floor). Decay reflects interaction distance not wall-clock time. Location: `.opencode/skill/.../working-memory.ts:298-316`

- **Extraction Rules**: Read spec.md → attention 0.9, Grep error → attention 0.8, Bash git commit → attention 0.7. Schema-driven declarative rules make it easy to add/tune patterns without changing core logic. Location: NEW module `extraction-adapter.ts`

**Reassess Phase 3**: Based on measured bottlenecks (SQLite queries >500ms p95, corpus >10K docs), not speculation. Current TypeScript + SQLite architecture likely sufficient for 10K-50K doc scale.
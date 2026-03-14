---
title: "Feature Research: Markovian Architectures for Hybrid RAG Fusion - Comprehensive Technical Investigation"
description: "Refresh of the Markovian architectures research using the current hybrid-rag-fusion feature catalog as the source of truth, plus primary external sources for state-space models, graph walks, planning, and Markov prefetching."
trigger_phrases:
  - "markovian"
  - "markov"
  - "hybrid rag fusion"
  - "feature catalog"
  - "research"
importance_tier: "important"
contextType: "research"
---
# Feature Research: Markovian Architectures for Hybrid RAG Fusion - Comprehensive Technical Investigation

Refresh of the Markovian architectures research using the current hybrid-rag-fusion feature catalog as the source of truth, plus primary external sources for state-space models, graph walks, planning, and Markov prefetching.

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

## 1. METADATA

- **Research ID**: RESEARCH-017
- **Feature/Spec**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/017-markovian-architectures`
- **Status**: Complete
- **Date Started**: 2026-03-14
- **Date Completed**: 2026-03-14
- **Researcher(s)**: Codex (GPT-5)
- **Reviewers**: TBD
- **Last Updated**: 2026-03-14

**Related Documents**:
- Spec: N/A
- Spike: N/A
- ADR: N/A
- Seed research: `research/perplexity_research.md`
- Seed recommendations: `research/perplexity_recommendations.md`

---

## FILE ORGANIZATION

**During research, organize files as:**
- Research findings: This file (`research.md`)
- Recommendations: `research/recommendations_markovian_architectures.md`
- Legacy seed material: `research/perplexity_research.md`, `research/perplexity_recommendations.md`
- Memory/context output: `memory/` via `generate-context.js`

**After research:**
- Treat this file as the canonical refreshed research artifact
- Preserve the Perplexity seed files as historical inputs
- Use the recommendations artifact as the bridge into plan/spec work

> **OpenCode Users:** No scratch artifacts were required for this refresh.

---

## 2. INVESTIGATION REPORT

### Request Summary
This research refreshes the Markovian architectures investigation for the Spec Kit Memory / hybrid-rag-fusion system. The goal is not to invent a generic "Markov AI" document, but to produce a more accurate and expanded analysis that is explicitly aligned with the current `feature_catalog` reality and that corrects drift in the existing seed research and recommendation documents.

### Current Behavior
The current system already contains several Markov-adjacent mechanisms, but mostly as bounded heuristics and deterministic scoring layers rather than explicit probabilistic state models. The live runtime includes intent-routed `memory_context`, a four-stage retrieval pipeline, FSRS-derived attention decay, co-activation spreading, graph momentum, temporal contiguity, deterministic graph retrieval with rollback, checkpoint-backed lifecycle safety, session-scoped working memory, adaptive ranking in shadow mode, and provenance-rich response envelopes. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:15-25] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:15-25] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md:15-22] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/10--graph-signal-activation/11-temporal-contiguity-layer.md:14-18] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md:14-16]

### Key Findings
1. **The system is already structurally Markov-friendly**: session IDs, working-memory decay, graph-edge evolution, transition-like retrieval traces, checkpoint restore, and queued ingestion all create natural "state -> next state" surfaces. What is mostly missing is explicit probabilistic modeling on top of those surfaces. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/feature_catalog.md:398-425] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:14-18]
2. **Some assumptions in the seed recommendations are now outdated**: historical shadow scoring has been removed from live evaluation use, while adaptive ranking remains as the actual bounded exploration surface; the novelty boost logic also no longer runs in the search hot path. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md:15-20] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md:15-24] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md:15-20]
3. **The best near-term Markovian upgrades are bounded and additive**: session-transition modeling, graph random-walk signals, and lifecycle-state forecasting fit the current architecture well; a full MDP planner or MCTS-backed reasoning stack would be materially larger in scope and should be deferred behind existing evaluation, trace, and rollback infrastructure. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:17-25] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md:15-20] [CITATION: https://www.nature.com/articles/nature16961] [CITATION: https://proceedings.mlr.press/v25/gelly12.html]

### Recommendations
The primary path forward is to treat Markovian methods as a formalization layer over current retrieval, graph, session, and lifecycle behaviors rather than as a replacement architecture.

**Primary Recommendation**:
- Add Markovian structure in three phases: (1) explicit session-state and graph-walk instrumentation, (2) bounded runtime signals inside existing ranking and routing hooks, and (3) only then consider agentic or planning-style MDP layers. This preserves current deterministic behavior, reuses rollout controls, and keeps rollback simple. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md:15-20] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md:14-16]

**Alternative Approaches**:
- Full RL / MDP retrieval policy now: higher upside, but not aligned with the current bounded-search runtime and would require a much larger offline reward and simulator program.
- Pure SSM-based persistent memory now: conceptually strong, especially after Mamba and Mamba-2, but this repo currently exposes retrieval infrastructure rather than a custom sequence-model serving stack. [CITATION: https://arxiv.org/abs/2312.00752] [CITATION: https://arxiv.org/abs/2405.21060]
- Revive historical shadow scoring first: not recommended, because that path has already been retired; adaptive ranking is the live experimentation surface. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md:20-20] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md:15-20]

---

## 3. EXECUTIVE OVERVIEW

### Executive Summary
Markovian ideas fit this system best when they are used to formalize behavior that already exists: sessions evolve, graph neighborhoods evolve, working-memory attention decays, ingestion jobs move through discrete lifecycle states, and ranking pipelines already combine multiple transition-like signals.

The refreshed conclusion is that the system should not jump directly to a "Markov everywhere" architecture. Instead, it should use the current feature catalog as the ground truth and layer in explicit stochastic models only where the current design already has stable state boundaries: `memory_context` routing, Stage 2 graph/cognitive scoring, async ingestion forecasting, and bounded adaptive ranking.

The external research supports that direction. State-space models remain a strong long-context abstraction, random-walk approaches remain natural for graph retrieval, and planning systems like AlphaGo-style MCTS show what full MDP reasoning looks like, but that latter class is a later-stage planning surface rather than a near-term retrieval patch. [CITATION: https://arxiv.org/abs/2312.00752] [CITATION: https://arxiv.org/abs/2405.21060] [CITATION: https://research.google/pubs/the-anatomy-of-a-large-scale-hypertextual-web-search-engine/] [CITATION: https://www.nature.com/articles/nature16961]

### Architecture Diagram

```text
                    Current Runtime (Source of Truth)

  Query / Session
        |
        v
  +--------------------+
  | memory_context     |
  | intent + mode      |
  +--------------------+
        |
        v
  +--------------------+       +--------------------------+
  | 4-stage pipeline   |<----->| graph / cognitive layer  |
  | Stage 1..4         |       | FSRS, co-activation,     |
  | deterministic core |       | momentum, contiguity     |
  +--------------------+       +--------------------------+
        |                                  |
        v                                  v
  +--------------------+       +--------------------------+
  | trace / envelopes  |       | checkpoints / lifecycle  |
  | scores + channels  |       | restore + job states     |
  +--------------------+       +--------------------------+

                  Recommended Markovian Additions

  session transitions -> mode hints / next-step hints
  graph random walks  -> bounded Stage 2 graph signal
  lifecycle states    -> ETA / failure-risk forecasts
  adaptive ranking    -> bounded rollout of new signals
```

### Quick Reference Guide

**When to use this approach**:
- When adding probabilistic structure to an already-instrumented retrieval system
- When graph, session, and lifecycle data already exist and the goal is bounded improvement
- When rollout safety, explainability, and rollback matter as much as raw ranking gains

**When NOT to use this approach**:
- When the desired outcome is a full agent planner or reasoning engine in the same milestone
- When session data is too sparse to estimate useful transitions
- When the team cannot support evaluation and trace analysis for probabilistic changes

**Key considerations**:
- Current feature reality must outrank older recommendation text
- Deterministic contracts in Stage 3/4 should not be broken by new graph or session signals
- Deprecated or inactive surfaces should not be treated as rollout paths

### Research Sources

| Source Type | Description | Link/Reference | Credibility |
|-------------|-------------|----------------|-------------|
| Internal reference | Current `memory_context` behavior | `.opencode/specs/.../01--retrieval/01-unified-context-retrieval-memorycontext.md` | High |
| Internal reference | Current 4-stage retrieval pipeline | `.opencode/specs/.../01--retrieval/05-4-stage-pipeline-architecture.md` | High |
| Internal reference | Current graph retrieval / rollback | `.opencode/specs/.../10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md` | High |
| Internal reference | Adaptive ranking and rollback | `.opencode/specs/.../11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md` | High |
| Research paper | Mamba selective state spaces | https://arxiv.org/abs/2312.00752 | High |
| Research paper | State-space duality / Mamba-2 framing | https://arxiv.org/abs/2405.21060 | High |
| Research paper | AlphaGo / tree search planning | https://www.nature.com/articles/nature16961 | High |
| Research paper | MCTS overview | https://proceedings.mlr.press/v25/gelly12.html | High |
| Research paper | PageRank / large-scale web search | https://research.google/pubs/the-anatomy-of-a-large-scale-hypertextual-web-search-engine/ | High |
| Research paper | Markov predictors for prefetching | https://research.ibm.com/publications/prefetching-using-markov-predictors | High |

---

## 4. CORE ARCHITECTURE

### System Components

#### Component 1: Session Routing Layer (`memory_context`)
**Purpose**: Routes a prompt into an intent and retrieval mode, already acting as a coarse state-transition controller.

**Responsibilities**:
- Infer task intent and retrieval mode
- Apply token-pressure fallbacks
- Reuse `sessionId` for cross-turn continuity
- Auto-discover spec folders when possible

**Dependencies**:
- Intent classification
- Mode routing
- Session management
- Trace telemetry

**Key APIs/Interfaces**:
```typescript
type ContextRequest = {
  input: string;
  mode?: "auto" | "quick" | "focused" | "deep" | "resume";
  intent?: "add_feature" | "fix_bug" | "refactor" | "security_audit" | "understand" | "find_spec" | "find_decision";
  sessionId?: string;
  includeTrace?: boolean;
};
```

**Current fit for Markovian work**:
- Very good. This is the cleanest place to infer "what state is the user in now?" and "what mode usually follows?" [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:17-25]

---

#### Component 2: Retrieval + Fusion Core (Stage 1-4)
**Purpose**: Executes the live deterministic retrieval pipeline where new bounded Markovian signals would have to integrate.

**Responsibilities**:
- Stage 1 candidate generation
- Stage 2 authoritative scoring and enrichment
- Stage 3 rerank / aggregate
- Stage 4 filtering and score invariants

**Dependencies**:
- Query complexity router
- BM25 / vector / graph channels
- Stage 2 fusion
- Trace and rerank contracts

**Current fit for Markovian work**:
- Good for additive graph-walk and session-transition features, but only if Stage 4 invariants and deterministic ranking contracts remain intact. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:17-25] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/10--graph-signal-activation/12-unified-graph-retrieval-deterministic-ranking-explainability-and-rollback.md:15-20]

---

#### Component 3: Graph and Cognitive Signal Layer
**Purpose**: Holds the most natural Markovian surfaces already live in the system.

**Responsibilities**:
- FSRS-based attention decay
- Co-activation spreading
- Graph momentum
- Temporal contiguity
- Entity-derived cross-document edges

**Dependencies**:
- Degree snapshots
- Community assignments
- Causal edges
- Entity catalog

**Current fit for Markovian work**:
- Excellent for personalized PageRank or random-walk-with-restart style signals because the graph substrate, temporal signals, and bounded additive scoring already exist. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/10--graph-signal-activation/05-graph-momentum-scoring.md:15-20] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/10--graph-signal-activation/11-temporal-contiguity-layer.md:14-18] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md:15-25]

---

#### Component 4: Evaluation, Trace, and Rollback Plane
**Purpose**: Makes probabilistic experimentation operationally safe.

**Responsibilities**:
- Trace-rich envelopes
- Full-context ceiling evaluation
- Adaptive ranking proposals
- Checkpoint-backed rollback

**Dependencies**:
- Envelope formatting
- Eval DB / ceiling analysis
- Adaptive ranking module
- Checkpoint restore

**Current fit for Markovian work**:
- Critical. Any new stochastic ranking or routing signal should be introduced here first as measured, bounded, and reversible behavior. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/09--evaluation-and-measurement/04-full-context-ceiling-evaluation.md:15-18] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md:14-16] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md:15-20] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:15-21]

### Data Flow

```text
User prompt
  -> intent + mode routing
  -> channel selection / candidate generation
  -> Stage 2 signal integration
  -> rerank / aggregate
  -> filter / annotate
  -> provenance envelope
  -> working memory / session carry-over
```

**Flow Steps**:
1. Prompt state is summarized by query features, intent, and optional `sessionId`.
2. Retrieval candidates are produced with complexity-aware channel selection.
3. Stage 2 applies the current additive signals; this is the natural insertion point for bounded Markovian graph/session scores.
4. Stage 3/4 preserve deterministic ordering and expose trace metadata.
5. Useful outputs can re-enter session-scoped working memory, creating the next turn's state. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/12--query-intelligence/01-query-complexity-router.md:16-23] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/feature_catalog.md:395-400]

### Integration Points

**External Systems**:
- Academic probabilistic models and planning literature for design guidance, not runtime dependencies
- Existing embedding providers and SQLite-backed storage

**Internal Modules**:
- `memory_context` for session state inference
- Stage 2 fusion for bounded probabilistic scoring
- `working-memory.ts` for turn-over-turn state
- `job-queue.ts` for lifecycle-state forecasting

### Dependencies

| Dependency | Version | Purpose | Critical? | Alternative |
|------------|---------|---------|-----------|-------------|
| Existing feature catalog surfaces | Current repo state | Primary implementation substrate | Yes | N/A |
| Mamba / Mamba-2 papers | 2023 / 2024 | Long-context state modeling guidance | No | Other SSM literature |
| Google PageRank paper | Historical but foundational | Graph walk reasoning | No | Other graph retrieval papers |
| AlphaGo / MCTS papers | 2012 / 2016 | Planning and MDP design guidance | No | Bandit-only experimentation |

---

## 5. TECHNICAL SPECIFICATIONS

### API Documentation

#### Proposed Runtime Addition 1: Session-State Trace Payload

**Purpose**: Expose the inferred session-state summary without changing the core search contract.

**Signature**:
```typescript
type MarkovSessionTrace = {
  currentState: string;
  previousState?: string;
  transitionConfidence: number;
  suggestedNextMode?: "quick" | "focused" | "deep" | "resume";
};
```

**Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `currentState` | `string` | Yes | N/A | Inferred latent or semi-latent task phase |
| `previousState` | `string` | No | `undefined` | Prior phase for transition explanation |
| `transitionConfidence` | `number` | Yes | `0` | Confidence for the inferred transition |
| `suggestedNextMode` | `mode` | No | `undefined` | Safe mode hint based on observed transitions |

**Returns**:
```typescript
type TraceExtension = {
  markovSession?: MarkovSessionTrace;
};
```

**Example Usage**:
```typescript
if (includeTrace && sessionId) {
  trace.markovSession = inferSessionState(lastTurns, currentRequest);
}
```

---

#### Proposed Runtime Addition 2: Graph-Walk Score Channel

**Purpose**: Add a bounded random-walk-style graph relevance signal to Stage 2.

**Signature**:
```typescript
type GraphWalkSignal = {
  restartSeeds: string[];
  walkScore: number;
  appliedBonus: number;
};
```

**Example Usage**:
```typescript
const walkScore = computeRestartWalkScore({
  seeds: activatedMemoryIds,
  candidates,
  maxIterations: 5,
});

row.score += Math.min(walkScore * 0.05, 0.05);
```

### Attribute Reference

| Attribute | Type | Default | Description | Valid Values |
|-----------|------|---------|-------------|--------------|
| `transitionConfidence` | `number` | `0` | Confidence in session-state inference | `0..1` |
| `walkScore` | `number` | `0` | Graph-walk relevance before capping | `>= 0` |
| `appliedBonus` | `number` | `0` | Score bonus added to Stage 2 | `0..0.05` |
| `predictedFailureRisk` | `number` | `0` | Async ingestion failure probability | `0..1` |

### Event Contracts

#### Event 1: `markov.session_transition`

**Trigger**: A request with a reusable `sessionId` advances from one inferred task phase to another.

**Payload**:
```json
{
  "sessionId": "abc",
  "previousState": "find_spec",
  "currentState": "understand",
  "confidence": 0.78,
  "selectedMode": "focused"
}
```

**Listeners**:
- Trace logger
- Evaluation logger
- Optional adaptive-ranking analysis pipeline

#### Event 2: `markov.graph_walk_scored`

**Trigger**: Stage 2 computes graph-walk scores for a ranked candidate set.

**Payload**:
```json
{
  "queryId": "q-123",
  "seedCount": 4,
  "candidateCount": 25,
  "maxAppliedBonus": 0.05
}
```

**Listeners**:
- Retrieval telemetry
- Offline evaluation pipeline

---

## 6. CONSTRAINTS & LIMITATIONS

1. The current runtime does not expose a native probabilistic session model; existing routing is deterministic-plus-heuristic, so the first milestone is estimation and traceability, not automatic policy replacement. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:17-25]
2. Historical shadow scoring is retired, so recommendations that rely on that path are stale; bounded adaptive ranking is the correct experimentation surface now. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md:20-20] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md:15-20]
3. The novelty boost is not active in the scoring hot path, so it should not be described as a live Markov-style recency mechanism. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md:17-24]
4. AlphaGo-style MCTS and other explicit planning systems are materially more expensive than the current retrieval pipeline and should be treated as later-stage architecture, not as an immediate scoring tweak. [CITATION: https://www.nature.com/articles/nature16961] [CITATION: https://proceedings.mlr.press/v25/gelly12.html]
5. State-space-model ideas are strategically relevant but do not map 1:1 onto the current MCP server architecture, which is retrieval-heavy rather than custom sequence-model-serving-heavy. [CITATION: https://arxiv.org/abs/2312.00752] [CITATION: https://arxiv.org/abs/2405.21060]

---

## 7. INTEGRATION PATTERNS

### Pattern 1: Session Transition Hints over Existing Routing
- Keep `memory_context` as the control surface.
- Log inferred transitions before using them for automatic routing.
- Expose session-state data only through trace metadata first.

### Pattern 2: Random Walk with Restart as a New Stage 2 Signal
- Seed from activated memories, recent session hits, and explicit matches.
- Compute a bounded walk score over existing graph edges.
- Add the score as one more capped Stage 2 contribution instead of replacing momentum or co-activation outright.
- Preserve deterministic ordering and explainability by tracing the bonus source.

### Pattern 3: Lifecycle State Forecasting
- Model async ingestion states as transitions over `queued -> parsing -> embedding -> indexing -> complete/failed/cancelled`.
- Produce ETA and failure-risk diagnostics before any automation.
- Keep job execution sequential until evidence justifies more concurrency. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md:14-16]

### Pattern 4: Rollout through Existing Safety Rails
- Use provenance envelopes for observability
- Use adaptive ranking for bounded proposal generation
- Use checkpoints for rollback on risky ranking or indexing changes

---

## 8. IMPLEMENTATION GUIDE

### Phase 0: Reality Lock
1. Treat the feature catalog as the source of truth.
2. Mark inactive features explicitly in planning docs.
3. Keep seed research as historical input only.

### Phase 1: Instrumentation
1. Add trace-only session-transition summaries to `memory_context`.
2. Add offline graph-walk scoring utilities against current graph structures.
3. Add ingestion-state forecasting metrics to job telemetry.

### Phase 2: Bounded Runtime Signals
1. Introduce a capped graph-walk bonus in Stage 2 behind a feature flag.
2. Feed session-transition hints into mode suggestion, not forced mode override.
3. Expose new trace fields through provenance-rich envelopes.

### Phase 3: Evaluation and Graduation
1. Compare against current retrieval quality using the full-context ceiling and offline eval infrastructure.
2. Use adaptive ranking proposals for bounded experimentation.
3. Preserve immediate rollback via flags and checkpoints.

### Phase 4: Deferred Advanced Planning
1. Consider MDP-style query refinement or tool-choice policies only after Phases 1-3 succeed.
2. Treat tree-search reasoning as a separate roadmap item from retrieval improvements.

---

## 9. CODE EXAMPLES

### Example 1: Session Transition Estimator

```typescript
type SessionObservation = {
  intent: string;
  mode: "quick" | "focused" | "deep" | "resume";
  channelsUsed: string[];
};

function estimateNextMode(history: SessionObservation[]): "quick" | "focused" | "deep" | "resume" {
  const last = history.at(-1);
  if (!last) return "focused";
  if (last.intent === "find_spec") return "quick";
  if (last.intent === "understand") return "deep";
  if (last.intent === "find_decision") return "resume";
  return "focused";
}
```

### Example 2: Bounded Graph-Walk Bonus

```typescript
function applyGraphWalkBonus(baseScore: number, walkScore: number): number {
  const boundedBonus = Math.min(Math.max(walkScore, 0), 1) * 0.05;
  return baseScore + boundedBonus;
}
```

### Example 3: Ingestion Lifecycle Forecast Stub

```typescript
type IngestState = "queued" | "parsing" | "embedding" | "indexing" | "complete" | "failed" | "cancelled";

function predictRisk(state: IngestState, retries: number): number {
  if (state === "embedding" && retries > 0) return 0.6;
  if (state === "parsing") return 0.2;
  return 0.1;
}
```

---

## 10. TESTING & DEBUGGING

### Validation Strategy
- Unit-test new transition estimators independently
- Add deterministic tests for graph-walk tie behavior
- Verify Stage 4 score invariants still hold
- Confirm provenance envelopes expose the new signal sources cleanly

### Recommended Test Layers
- **Offline evaluation**: compare baseline vs Markov-enhanced candidates against current evaluation datasets and the full-context ceiling. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/09--evaluation-and-measurement/04-full-context-ceiling-evaluation.md:15-18]
- **Runtime trace checks**: assert that `includeTrace` shows new session and graph-walk fields. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md:14-16]
- **Rollback drills**: confirm feature-flag disable paths and checkpoint restores remain sufficient for recovery. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:15-21]

### Debugging Focus Areas
- Incorrect transition inference from sparse session histories
- Graph density explosions from over-eager restart seeds
- Stage 2 score inflation and determinism regressions
- Overfitting to internal evaluation logs

---

## 11. PERFORMANCE

### Expected Cost Profile
- Session transition inference should be low cost if derived from recent telemetry and cached session history
- Graph random walks can be moderate cost; the safe starting point is small-iteration, small-seed, bounded walks
- Ingestion lifecycle forecasting is negligible compared to embedding and indexing work

### Performance Notes
- The current system already optimizes query routing, token budgets, and staged scoring, so new probabilistic layers should respect those budgets rather than bypass them. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/12--query-intelligence/01-query-complexity-router.md:16-23] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md:17-19]
- Markov predictors have a long history in prefetching because they can cheaply exploit local transition structure; that makes lifecycle ETA and cache-adjacent experiments particularly attractive here. [CITATION: https://research.ibm.com/publications/prefetching-using-markov-predictors]

---

## 12. SECURITY

1. Session-state modeling should not become unsafe personalization; keep it scoped to retrieval efficiency and task continuity.
2. Graph-walk signals must not bypass existing path-security or state filters.
3. New trace fields should expose rationale, not sensitive raw session content.
4. Checkpoint-backed rollback should remain available for risky scoring changes. [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/05--lifecycle/03-checkpoint-restore-checkpointrestore.md:17-21]

---

## 13. MAINTENANCE

### Operational Expectations
- Recompute transition statistics periodically, not per request
- Prune stale graph seeds and low-signal transition edges
- Keep feature flags around new probabilistic surfaces until evidence is stable
- Document inactive vs active scoring components clearly to avoid future research drift

### Maintenance Burden Assessment
- **Low**: session-state trace logging
- **Medium**: graph-walk score maintenance and evaluation
- **Medium**: lifecycle forecasting
- **High**: any future MDP / tree-search planner

---

## 14. API REFERENCE

### Existing Surfaces to Extend
- `memory_context(... includeTrace)`
- `memory_search(... includeTrace)`
- Adaptive ranking proposal payloads
- Retrieval telemetry traces

### Proposed Trace Additions

| Field | Type | Meaning |
|-------|------|---------|
| `trace.markovSession.currentState` | `string` | Current inferred task phase |
| `trace.markovSession.transitionConfidence` | `number` | Confidence in the inferred phase change |
| `trace.graphWalk.seedCount` | `number` | Number of restart seeds used |
| `trace.graphWalk.appliedBonus` | `number` | Final bounded bonus added in Stage 2 |
| `trace.ingestionForecast.failureRisk` | `number` | Predicted risk for queued ingestion jobs |

---

## 15. TROUBLESHOOTING

### Symptom: Results become less deterministic
- Check whether a new graph-walk or session bonus changed tie-break behavior
- Verify Stage 3/4 ranking contract tests
- Reduce or disable the new signal via feature flag

### Symptom: Session hints feel wrong
- Inspect sparse or ephemeral `sessionId` usage
- Confirm hints are trace-only before any auto-routing is enabled
- Back off to logging-only mode

### Symptom: Graph signal overwhelms lexical / semantic relevance
- Lower the additive cap
- Reduce seed count
- Fall back to momentum + depth only

### Symptom: Research or planning docs mention removed features
- Re-check the current feature catalog before updating recommendations
- Prefer live feature documents over older synthesis notes

---

## 16. ACKNOWLEDGEMENTS

- The original seed analysis in `research/perplexity_research.md`
- The original seed recommendation set in `research/perplexity_recommendations.md`
- The hybrid-rag-fusion feature catalog, which served as the primary source of current-system truth
- External primary sources on SSMs, graph ranking, planning, and Markov predictors

---

## 17. APPENDIX & CHANGELOG

### Appendix A: Most Important Corrections vs Seed Material

| Topic | Seed Direction | Current Reality |
|-------|----------------|-----------------|
| Shadow scoring | Treated as an experimentation surface | Retired; adaptive ranking is the live bounded experimentation surface |
| Novelty boost | Framed as available recency signal | Logic remains, but no longer runs in the scoring hot path |
| Markov rollout target | Broad multi-surface ambition | Best target is bounded layering over current session, graph, lifecycle, and trace surfaces |

### Appendix B: Recommended Roadmap Summary
1. Instrument session transitions and graph-walk scores
2. Ship trace-only visibility
3. Add bounded Stage 2 graph-walk bonus
4. Evaluate with current telemetry and ceiling analysis
5. Defer MDP / tree-search planning to a later architectural phase

### Changelog
- **2026-03-14**: Rewrote the Markovian architectures research around current feature-catalog reality, added explicit correction of inactive features, and aligned recommendations with live rollout/evaluation infrastructure.

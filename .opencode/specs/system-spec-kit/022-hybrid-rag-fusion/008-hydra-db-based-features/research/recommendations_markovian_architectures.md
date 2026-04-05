# Markovian Architectures Recommendations

## Purpose

This document translates the refreshed Markovian architectures research into a practical rollout order for the current hybrid-rag-fusion system.

## What Is Already True

The current system already has the main ingredients needed for bounded Markovian work:
- Session-aware routing in `memory_context`
- A deterministic four-stage retrieval pipeline
- FSRS attention decay, co-activation, graph momentum, and temporal contiguity
- Cross-document entity linking
- Session-scoped working memory
- Adaptive ranking for bounded experimentation
- Provenance-rich trace output
- Checkpoint restore and async-ingestion lifecycle state tracking

This means the right question is not "how do we rebuild the system around Markov models?" but "which existing surfaces should be formalized first?"

## Recommendation Order

### 1. Instrument session-state transitions first

Add a trace-only notion of task phase transitions on top of current `sessionId`, intent, mode, and retrieval-channel usage.

Why first:
- Lowest implementation risk
- Reuses existing routing and telemetry surfaces
- Creates the data needed for later probabilistic routing

Not yet:
- Do not auto-switch modes based on the model in the first milestone

### 2. Add a bounded graph-walk signal in Stage 2

Introduce a capped random-walk-with-restart style score over the existing graph substrate.

Why second:
- The graph already contains momentum, depth, contiguity, and entity-link structure
- Stage 2 already accepts bounded additive signals
- Provenance traces can explain the added contribution

Guardrails:
- Keep additive caps small
- Preserve deterministic tie behavior
- Roll out behind a feature flag

### 3. Forecast ingestion lifecycle states

Use the existing job-state machine to estimate ETA and failure risk for queued ingestion work.

Why third:
- Clean state machine already exists
- Operational value is high
- No ranking determinism risk

### 4. Use adaptive ranking, not retired shadow scoring, for experiments

Any new Markovian ranking proposal should use the current adaptive-ranking infrastructure as the experimentation surface.

Why:
- Historical shadow scoring is no longer the live path
- Adaptive ranking already supports bounded proposals and immediate rollback

### 5. Defer full MDP / MCTS planning work

Do not treat AlphaGo-style search or broad reasoning-tree planning as part of the first Markovian retrieval roadmap.

Why defer:
- Different scope class
- Requires reward design, simulation, and broader architecture changes
- Easy to overbuild relative to current retrieval needs

## De-Prioritized Ideas

### Full HMM personalization
Possible in theory, but current evidence favors simpler session-transition modeling first.

### Persistent SSM-based conversational runtime
Strategically interesting, especially after Mamba and Mamba-2, but it does not map directly onto the current MCP retrieval server.

### Reviving novelty boost
Not recommended as a first-class recency mechanism because it is no longer active in the hot path.

## Decision Matrix

| Candidate | Fit to Current Architecture | Risk | Recommendation |
|-----------|-----------------------------|------|----------------|
| Session-transition trace model | High | Low | Do now |
| Bounded graph-walk Stage 2 signal | High | Medium | Do next |
| Ingestion lifecycle forecasting | High | Low | Do now/next |
| Adaptive ranking rollout for Markov signals | High | Medium | Use as rollout surface |
| Full MDP retrieval policy | Medium | High | Later |
| MCTS reasoning / planning layer | Low | Very High | Much later |
| SSM-based runtime memory redesign | Medium | High | Separate roadmap |

## Recommended Next Step

If this research moves forward into planning, the next artifact should define:
- exact trace fields for session-state inference
- the graph-walk scoring cap and rollout flag
- offline evaluation criteria versus the current ceiling and baseline metrics
- rollback conditions using checkpoints and feature flags

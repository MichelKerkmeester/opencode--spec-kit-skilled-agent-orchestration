# Research Dimension D4: Feedback Loops & Retrieval Quality Learning

> Mode: Deep | Framework: CRAFT | Perspectives: 5/5 | CLEAR: 43/50

## System Context

You are researching feedback loops and quality learning for a production Hybrid RAG Fusion system. The system uses FSRS (Free Spaced Repetition Scheduler) for temporal decay and has a planned but unimplemented feedback loop (Sprint 4). Built in TypeScript with SQLite.

**Current Decay Model — FSRS v4:**
- With review data: power-law `R(t) = (1 + 0.2346 * t / S)^(-0.5)` where S = stability
- Without review data: exponential `Weight * 0.5^(days / half_life_days)`
- `trackAccess()` in Stage 2 writes back access events (testing effect from FSRS)
- Documents gain "stability" through repeated retrieval (spacing effect)

**Current Quality Signals:**
- Importance tier (1-4, set at save time)
- Quality score (set at save time)
- Context type classification
- Spec folder association
- Trigger phrases (semantic keywords)

**What's NOT Implemented (Sprint 4 — DRAFT):**
- **R11 Learned Relevance Feedback**: 7 safeguards designed but unbuilt. Would allow the system to learn from explicit user signals (thumbs up/down, re-queries)
- **TM-04 Pre-Storage Quality Gate**: Signal density check, semantic dedup, minimum quality threshold before allowing memory save
- **TM-06 Reconsolidation**: Merge vs supersede vs complement logic for overlapping memories
- **MPAB Chunk Aggregation**: Multi-passage aggregation for long documents
- **Shadow Scoring**: A/B comparison of scoring strategies without affecting production results
- **Negative Feedback Demotions**: Demoting results that received negative signals (partially implemented via `feedback_negative_demotion`)

**Feature Flags:**
- `SPECKIT_SESSION_BOOST` — working-memory attention signals
- `SPECKIT_FEEDBACK_SIGNALS` — learned trigger signals + negative demotions (partially implemented)
- `SPECKIT_ABLATION` — controlled channel disabling for evaluation

## Current Reality (Feature Catalog Excerpts)

- **Learned Relevance Feedback** (feature 14-06): Designed with 7 safeguards (min samples, confidence threshold, FTS5 contamination prevention, max boost cap, decay, revert mechanism, audit log). NOT implemented.
- **Pre-Storage Quality Gate** (feature 13-05): Planned. Would check signal density and semantic similarity before allowing save. NOT implemented.
- **Reconsolidation on Save** (feature 13-06): Planned. Would detect overlapping memories and offer merge/supersede/complement. NOT implemented.
- **Classification-Based Decay** (feature 11-04): FSRS is the current decay model. No classification-based alternative explored.
- **Feedback Negative Demotion** (partially implemented): Can demote results that received negative signals, but signal collection mechanism doesn't exist.

## Research Questions

1. **FSRS for Knowledge Retrieval**: Is FSRS (designed for flashcard spaced repetition) the right decay model for knowledge document retrieval? Documents don't "decay" like human memory — a spec decision from 6 months ago may be MORE important than one from yesterday. What alternatives exist? (Use-frequency decay, attention-based recency, type-aware decay, no decay for certain document classes)

2. **Implicit Feedback Signals**: The calling AI doesn't provide explicit feedback. What implicit signals can be inferred from: (a) tool call sequences (memory_search followed by memory_search = dissatisfaction?), (b) session patterns (which results were followed up vs ignored), (c) re-queries (same topic queried again = poor results?), (d) downstream actions (did the AI use the retrieved content?). How reliable are these signals?

3. **Minimal Viable Feedback Loop**: Sprint 4's R11 has 7 safeguards. Is this over-engineered for a small corpus? What is the minimal safeguard set to prevent FTS5 contamination while still learning? Can we start with 2-3 safeguards and add more as data grows?

4. **Pre-Storage Quality Gates**: What thresholds work for structured spec-kit documents? Signal density (how many fields populated), semantic dedup distance, minimum content length? How to avoid over-filtering that rejects legitimate edge-case memories (e.g., a short but critical one-line decision)?

5. **Reconsolidation Strategy**: When two memories overlap, what decision logic should determine merge vs supersede vs complement? What do production knowledge systems (Notion AI, Obsidian, Mem.ai) do for deduplication and consolidation?

6. **Online vs Batch Learning**: At small corpus scale (hundreds to thousands of documents, dozens of queries per day), should feedback learning be online (update on each signal) or batch (aggregate and update periodically)? What's the cold-start strategy when no feedback data exists?

## Constraints

- No explicit user feedback mechanism exists — must work with implicit signals
- FSRS is deeply integrated — replacement must be gradual (feature-flagged)
- SQLite storage — no streaming/event infrastructure
- Must not degrade retrieval quality during learning cold-start
- Size recommendations as S (days), M (weeks), L (months)
- Single developer implementation capacity

## Output Format

1. **Executive Summary** (3-5 bullet points)
2. **State of Art Survey** (retrieval feedback systems, implicit signal mining, quality gates — cite papers and production systems)
3. **Gap Analysis** (current system vs state of art)
4. **Recommendations** (priority-ordered with: description, rationale, S/M/L size, implementation sketch, expected impact, cold-start strategy, feature flag name)
5. **Risk Assessment** (feedback loop instability, over-fitting, cold-start degradation)
6. **Cross-Dimensional Dependencies** (how feedback connects to Fusion D1, Query D2, Graph D3, UX D5)

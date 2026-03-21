# Research Dimension D5: Retrieval UX & Result Presentation

> Mode: Deep | Framework: CRAFT | Perspectives: 5/5 | CLEAR: 43/50

## System Context

You are researching retrieval UX and result presentation for a production Hybrid RAG Fusion system. The system is an MCP (Model Context Protocol) server called by AI assistants (Claude, GPT, Gemini, Copilot). The "user" is an AI assistant, not a human directly. Built in TypeScript with SQLite.

**Current Result Format:**
- Results returned as MCP tool response with: id, title, score (0-1), content_text, file_path, spec_folder, context_type, importance_tier
- Score aliases preserved for auditability: score, rrfScore, stage2Score, rerankerScore
- Provenance tracing: which channels contributed to each result
- Anchor metadata extraction: state, next-steps, decisions, blockers
- Token budget enforcement: results truncated to fit context window

**Current UX Features:**
- `memory_context()`: unified retrieval for general context loading
- `memory_search()`: targeted search with specific query
- `memory_quick_search()`: lightweight search for simple lookups
- Dynamic token budget allocation (feature-flagged)
- Confidence-based result truncation
- Constitutional memory injection (always-surface memories)
- Session boost for working-memory attention

**What's Missing:**
- No score explainability (WHY was this result ranked #1?)
- No per-result confidence signal (how confident is the system in THIS result?)
- No adaptive formatting (same format for quick lookup vs deep research vs session recovery)
- No no-result handling (empty results returned silently)
- No multi-turn session awareness (each query is independent)
- No result quality self-assessment
- No suggested follow-up queries
- No knowledge gap identification

## Current Reality (Feature Catalog Excerpts)

- **Provenance-Rich Response Envelopes** (feature 15-08): Partially implemented. Score aliases preserved but no per-channel attribution breakdown returned to caller.
- **Dynamic Token Budget Allocation** (feature 12-05): Implemented. Adjusts result count based on available tokens.
- **Unified Context Retrieval** (feature 01-01): Implemented. `memory_context()` handler with multiple modes (focused, broad, session).
- **UX Hooks Automation** (Sprint 004): Some hooks implemented for auto-surfacing context at session start.

## Research Questions

1. **Score Explainability for AI Callers**: How should the system communicate WHY a result was ranked where it is? Per-channel scoring breakdown? Contributing signal names and weights? Fusion attribution? What level of explainability helps an AI assistant make better decisions about which results to use?

2. **Adaptive Result Formatting**: Should `memory_context()` return different structures for different retrieval modes? What would "quick lookup" vs "deep research" vs "session recovery" formatting look like? How should the AI caller signal which mode it needs?

3. **Context Window Optimization**: The system enforces a token budget. Is simple truncation optimal? What about hierarchical summarization of large result sets? Progressive disclosure (summary first, detail on demand)? How do production RAG systems handle context window limits for LLM callers?

4. **Per-Result Confidence Scoring**: Beyond the composite fusion score (0-1), should each result carry a confidence signal? How to compute confidence — from score distribution (gap between #1 and #2), channel agreement, query-document relevance certainty? What confidence thresholds are useful for the AI caller?

5. **No-Result and Low-Quality UX**: When retrieval returns nothing useful (no results, or all results below threshold), how should the system respond? Suggest related queries? Identify knowledge gaps? Recommend memory creation? What do production knowledge systems do here?

6. **Multi-Turn Session Intelligence**: How should the system leverage the calling AI's conversation history to refine subsequent queries? Session-aware re-ranking? Query refinement suggestions? Result deduplication across turns? How to maintain retrieval coherence across a multi-step task?

## Constraints

- The "user" is an AI assistant calling via MCP — not a human with a GUI
- Response format is structured MCP tool response (JSON-like)
- Adding fields to response envelopes is cheap but bloating hurts context budgets
- The AI caller has limited ability to provide feedback — mostly implicit
- Sub-second p95 latency requirement for simple queries
- Size recommendations as S (days), M (weeks), L (months)

## Output Format

1. **Executive Summary** (3-5 bullet points)
2. **State of Art Survey** (RAG UX for AI callers, result presentation patterns, context optimization — cite papers and production systems)
3. **Gap Analysis** (current system vs state of art)
4. **Recommendations** (priority-ordered with: description, rationale, S/M/L size, MCP response schema sketch, expected impact on caller quality, feature flag name)
5. **Risk Assessment** (context budget bloat, latency costs, backwards compatibility)
6. **Cross-Dimensional Dependencies** (how UX connects to Fusion D1, Query D2, Graph D3, Feedback D4)

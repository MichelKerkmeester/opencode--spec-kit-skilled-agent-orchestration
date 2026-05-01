---
title: Deep Research Strategy - Modus Memory
description: Reducer-tracked strategy for the 003-modus-memory-main hybrid-rag-fusion research packet.
---

# Deep Research Strategy - Modus Memory

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Track the 40-iteration Modus Memory deep research lineage in reducer-compatible format. Research is complete; this file records the final strategy state.

### Usage

- All 40 iterations completed via cli-codex orchestrator (GPT-5.4 high, fast tier)
- Copilot GPT-5.4 high as fallback after 3 consecutive codex failures
- Iterations stored at research/iterations/iteration-NNN.md
- Canonical synthesis at research/research.md

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Research Modus Memory's FSRS spaced repetition, BM25 lexical search, query expansion, librarian pattern, and plain-markdown storage to identify concrete improvements for Spec Kit Memory.

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: How does FSRS model memory decay (stability, difficulty, confidence, floor)?
- [ ] Q2: How does BM25 ranking with field weights compare to our hybrid retrieval?
- [ ] Q3: What does the librarian pattern for search expansion add?
- [ ] Q4: How does the facts.go model work for confidence-weighted facts?
- [ ] Q5: What is the Jaccard cache reuse pattern in bm25 lookups?
- [ ] Q6: How does plain-markdown storage affect operational simplicity?
- [ ] Q7: Can we adopt FSRS for memory retention without the full Modus stack?
- [ ] Q8: How does cross-referencing between facts work?
- [ ] Q9: What is the query expansion order and why does it matter?
- [ ] Q10: Which decay/retention ideas are most applicable to our system?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Reimplementing Modus Memory wholesale in our memory system
- Replacing our existing CocoIndex, code-graph, or Spec Kit Memory stack
- Making architectural changes without explicit adoption decisions

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- 40 iterations completed (reached)
- All 10 key questions answered at least once (reached)
- Definitive final report produced (iteration 40)

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### [approaches eliminated and why] -- BLOCKED (iteration 33, 3 attempts)
- What was tried: [approaches eliminated and why]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: [approaches eliminated and why]

### Adding a direct markdown write surface for spec memory, because Public's authoritative persistence contract is structured `generate-context` input and anchored outputs. -- BLOCKED (iteration 37, 1 attempts)
- What was tried: Adding a direct markdown write surface for spec memory, because Public's authoritative persistence contract is structured `generate-context` input and anchored outputs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a direct markdown write surface for spec memory, because Public's authoritative persistence contract is structured `generate-context` input and anchored outputs.

### Adding a new monolithic “vault” MCP lane that bundles memory, code-search, and graph behavior, because it would duplicate existing tool boundaries instead of complementing them. -- BLOCKED (iteration 35, 1 attempts)
- What was tried: Adding a new monolithic “vault” MCP lane that bundles memory, code-search, and graph behavior, because it would duplicate existing tool boundaries instead of complementing them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a new monolithic “vault” MCP lane that bundles memory, code-search, and graph behavior, because it would duplicate existing tool boundaries instead of complementing them.

### Adding a top-level `vault_*` compatibility layer as a first migration step, because it would hide Public’s intentional split between memory, semantic code search, structural graph lookup, and session bootstrap. -- BLOCKED (iteration 36, 1 attempts)
- What was tried: Adding a top-level `vault_*` compatibility layer as a first migration step, because it would hide Public’s intentional split between memory, semantic code search, structural graph lookup, and session bootstrap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a top-level `vault_*` compatibility layer as a first migration step, because it would hide Public’s intentional split between memory, semantic code search, structural graph lookup, and session bootstrap.

### Adding Jaccard-similar fuzzy cache reuse to Public, because its retrieval contract is too parameter-rich for approximate cache hits to stay trustworthy. -- BLOCKED (iteration 34, 1 attempts)
- What was tried: Adding Jaccard-similar fuzzy cache reuse to Public, because its retrieval contract is too parameter-rich for approximate cache hits to stay trustworthy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding Jaccard-similar fuzzy cache reuse to Public, because its retrieval contract is too parameter-rich for approximate cache hits to stay trustworthy.

### Allowing raw markdown writes to become the default save path for spec memory, because Public’s governance depends on structured, authoritative context generation. -- BLOCKED (iteration 36, 1 attempts)
- What was tried: Allowing raw markdown writes to become the default save path for spec memory, because Public’s governance depends on structured, authoritative context generation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Allowing raw markdown writes to become the default save path for spec memory, because Public’s governance depends on structured, authoritative context generation.

### Letting a Modus-style lexical helper answer code-search questions, because Public already assigns that authority to CocoIndex and `code_graph_query`. -- BLOCKED (iteration 35, 1 attempts)
- What was tried: Letting a Modus-style lexical helper answer code-search questions, because Public already assigns that authority to CocoIndex and `code_graph_query`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Letting a Modus-style lexical helper answer code-search questions, because Public already assigns that authority to CocoIndex and `code_graph_query`.

### Letting connected-doc or lexical-fallback overlays outrank `executePipeline()` or intercept structural/code-search questions, because that would duplicate or weaken CocoIndex and code-graph authority. -- BLOCKED (iteration 37, 1 attempts)
- What was tried: Letting connected-doc or lexical-fallback overlays outrank `executePipeline()` or intercept structural/code-search questions, because that would duplicate or weaken CocoIndex and code-graph authority.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Letting connected-doc or lexical-fallback overlays outrank `executePipeline()` or intercept structural/code-search questions, because that would duplicate or weaken CocoIndex and code-graph authority.

### Making connected-doc hints a new authority surface for code or dependency questions, because Public already routes those questions to CocoIndex and code-graph tools. -- BLOCKED (iteration 36, 1 attempts)
- What was tried: Making connected-doc hints a new authority surface for code or dependency questions, because Public already routes those questions to CocoIndex and code-graph tools.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making connected-doc hints a new authority surface for code or dependency questions, because Public already routes those questions to CocoIndex and code-graph tools.

### Making default search a write event, because `trackAccess` is explicitly off by default and cache/dedup semantics rely on observational reads. -- BLOCKED (iteration 37, 1 attempts)
- What was tried: Making default search a write event, because `trackAccess` is explicitly off by default and cache/dedup semantics rely on observational reads.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making default search a write event, because `trackAccess` is explicitly off by default and cache/dedup semantics rely on observational reads.

### Making write-on-read reinforcement the default policy for Public, because cached and deduplicated search responses would become mutation events. -- BLOCKED (iteration 35, 1 attempts)
- What was tried: Making write-on-read reinforcement the default policy for Public, because cached and deduplicated search responses would become mutation events.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making write-on-read reinforcement the default policy for Public, because cached and deduplicated search responses would become mutation events.

### Making write-on-read strengthening the default performance policy for Public, because it couples retrieval latency and mutation semantics too tightly. -- BLOCKED (iteration 34, 1 attempts)
- What was tried: Making write-on-read strengthening the default performance policy for Public, because it couples retrieval latency and mutation semantics too tightly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making write-on-read strengthening the default performance policy for Public, because it couples retrieval latency and mutation semantics too tightly.

### Porting Modus’s per-process full in-memory rebuild model into Public mainline, because it would trade persistent-index amortization for repeated startup cost and RAM duplication. -- BLOCKED (iteration 34, 1 attempts)
- What was tried: Porting Modus’s per-process full in-memory rebuild model into Public mainline, because it would trade persistent-index amortization for repeated startup cost and RAM duplication.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Porting Modus’s per-process full in-memory rebuild model into Public mainline, because it would trade persistent-index amortization for repeated startup cost and RAM duplication.

### Rebranding `memory_validate` into a review API, because usefulness feedback and spaced-repetition review are different operator intents with different telemetry semantics. -- BLOCKED (iteration 36, 1 attempts)
- What was tried: Rebranding `memory_validate` into a review API, because usefulness feedback and spaced-repetition review are different operator intents with different telemetry semantics.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rebranding `memory_validate` into a review API, because usefulness feedback and spaced-repetition review are different operator intents with different telemetry semantics.

### Reopening settled Modus rejections such as fuzzy Jaccard cache reuse, default write-on-read reinforcement, or a monolithic `vault_*` lane, because cross-phase synthesis reinforces those as non-goals rather than weakening them. -- BLOCKED (iteration 39, 1 attempts)
- What was tried: Reopening settled Modus rejections such as fuzzy Jaccard cache reuse, default write-on-read reinforcement, or a monolithic `vault_*` lane, because cross-phase synthesis reinforces those as non-goals rather than weakening them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reopening settled Modus rejections such as fuzzy Jaccard cache reuse, default write-on-read reinforcement, or a monolithic `vault_*` lane, because cross-phase synthesis reinforces those as non-goals rather than weakening them.

### Reopening settled rejections such as fuzzy Jaccard cache reuse, default write-on-read reinforcement, a monolithic `vault_*` lane, or direct markdown writes for spec memory, because late iterations already closed those questions with primary-source evidence. -- BLOCKED (iteration 38, 1 attempts)
- What was tried: Reopening settled rejections such as fuzzy Jaccard cache reuse, default write-on-read reinforcement, a monolithic `vault_*` lane, or direct markdown writes for spec memory, because late iterations already closed those questions with primary-source evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reopening settled rejections such as fuzzy Jaccard cache reuse, default write-on-read reinforcement, a monolithic `vault_*` lane, or direct markdown writes for spec memory, because late iterations already closed those questions with primary-source evidence.

### Replacing Public's routed memory/CocoIndex/code-graph split with a single Modus-style vault lane, because the current system already encodes higher-authority routing boundaries. -- BLOCKED (iteration 37, 1 attempts)
- What was tried: Replacing Public's routed memory/CocoIndex/code-graph split with a single Modus-style vault lane, because the current system already encodes higher-authority routing boundaries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing Public's routed memory/CocoIndex/code-graph split with a single Modus-style vault lane, because the current system already encodes higher-authority routing boundaries.

### Selecting one external system as the new north-star backend, because every phase keeps some ideas while rejecting the system's authority model as a whole. -- BLOCKED (iteration 39, 1 attempts)
- What was tried: Selecting one external system as the new north-star backend, because every phase keeps some ideas while rejecting the system's authority model as a whole.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Selecting one external system as the new north-star backend, because every phase keeps some ideas while rejecting the system's authority model as a whole.

### Starting new external-source exploration, because the remaining uncertainty is now concentrated in Public-side contracts, rollout artifacts, and validation gates. -- BLOCKED (iteration 38, 1 attempts)
- What was tried: Starting new external-source exploration, because the remaining uncertainty is now concentrated in Public-side contracts, rollout artifacts, and validation gates.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Starting new external-source exploration, because the remaining uncertainty is now concentrated in Public-side contracts, rollout artifacts, and validation gates.

### Treating all surviving NEW FEATURE candidates as one omnibus roadmap item, because they optimize different failure modes and would blur sequencing. -- BLOCKED (iteration 39, 1 attempts)
- What was tried: Treating all surviving NEW FEATURE candidates as one omnibus roadmap item, because they optimize different failure modes and would blur sequencing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating all surviving NEW FEATURE candidates as one omnibus roadmap item, because they optimize different failure modes and would blur sequencing.

### Treating connected-doc adjacency as equivalent to code-graph or causal evidence, because Modus weights topic overlap while Public graph tools carry structural trust and freshness metadata. -- BLOCKED (iteration 35, 1 attempts)
- What was tried: Treating connected-doc adjacency as equivalent to code-graph or causal evidence, because Modus weights topic overlap while Public graph tools carry structural trust and freshness metadata.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating connected-doc adjacency as equivalent to code-graph or causal evidence, because Modus weights topic overlap while Public graph tools carry structural trust and freshness metadata.

### Treating librarian-style lexical expansion as a default retrieval stage, because it multiplies search latency and runtime dependency risk. -- BLOCKED (iteration 34, 1 attempts)
- What was tried: Treating librarian-style lexical expansion as a default retrieval stage, because it multiplies search latency and runtime dependency risk.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating librarian-style lexical expansion as a default retrieval stage, because it multiplies search latency and runtime dependency risk.

### Treating the absence of reducer-owned JSONL/strategy files in this packet as a Modus/Public product uncertainty, because that is packet-hygiene debt rather than a remaining architecture question about the memory system itself. -- BLOCKED (iteration 38, 1 attempts)
- What was tried: Treating the absence of reducer-owned JSONL/strategy files in this packet as a Modus/Public product uncertainty, because that is packet-hygiene debt rather than a remaining architecture question about the memory system itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the absence of reducer-owned JSONL/strategy files in this packet as a Modus/Public product uncertainty, because that is packet-hygiene debt rather than a remaining architecture question about the memory system itself.

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- [approaches eliminated and why] (iteration 31)
- [approaches eliminated and why] (iteration 32)
- [approaches eliminated and why] (iteration 33)
- Adding Jaccard-similar fuzzy cache reuse to Public, because its retrieval contract is too parameter-rich for approximate cache hits to stay trustworthy. (iteration 34)
- Making write-on-read strengthening the default performance policy for Public, because it couples retrieval latency and mutation semantics too tightly. (iteration 34)
- Porting Modus’s per-process full in-memory rebuild model into Public mainline, because it would trade persistent-index amortization for repeated startup cost and RAM duplication. (iteration 34)
- Treating librarian-style lexical expansion as a default retrieval stage, because it multiplies search latency and runtime dependency risk. (iteration 34)
- Adding a new monolithic “vault” MCP lane that bundles memory, code-search, and graph behavior, because it would duplicate existing tool boundaries instead of complementing them. (iteration 35)
- Letting a Modus-style lexical helper answer code-search questions, because Public already assigns that authority to CocoIndex and `code_graph_query`. (iteration 35)
- Making write-on-read reinforcement the default policy for Public, because cached and deduplicated search responses would become mutation events. (iteration 35)
- Treating connected-doc adjacency as equivalent to code-graph or causal evidence, because Modus weights topic overlap while Public graph tools carry structural trust and freshness metadata. (iteration 35)
- Adding a top-level `vault_*` compatibility layer as a first migration step, because it would hide Public’s intentional split between memory, semantic code search, structural graph lookup, and session bootstrap. (iteration 36)
- Allowing raw markdown writes to become the default save path for spec memory, because Public’s governance depends on structured, authoritative context generation. (iteration 36)
- Making connected-doc hints a new authority surface for code or dependency questions, because Public already routes those questions to CocoIndex and code-graph tools. (iteration 36)
- Rebranding `memory_validate` into a review API, because usefulness feedback and spaced-repetition review are different operator intents with different telemetry semantics. (iteration 36)
- Adding a direct markdown write surface for spec memory, because Public's authoritative persistence contract is structured `generate-context` input and anchored outputs. (iteration 37)
- Letting connected-doc or lexical-fallback overlays outrank `executePipeline()` or intercept structural/code-search questions, because that would duplicate or weaken CocoIndex and code-graph authority. (iteration 37)
- Making default search a write event, because `trackAccess` is explicitly off by default and cache/dedup semantics rely on observational reads. (iteration 37)
- Replacing Public's routed memory/CocoIndex/code-graph split with a single Modus-style vault lane, because the current system already encodes higher-authority routing boundaries. (iteration 37)
- Reopening settled rejections such as fuzzy Jaccard cache reuse, default write-on-read reinforcement, a monolithic `vault_*` lane, or direct markdown writes for spec memory, because late iterations already closed those questions with primary-source evidence. (iteration 38)
- Starting new external-source exploration, because the remaining uncertainty is now concentrated in Public-side contracts, rollout artifacts, and validation gates. (iteration 38)
- Treating the absence of reducer-owned JSONL/strategy files in this packet as a Modus/Public product uncertainty, because that is packet-hygiene debt rather than a remaining architecture question about the memory system itself. (iteration 38)
- Reopening settled Modus rejections such as fuzzy Jaccard cache reuse, default write-on-read reinforcement, or a monolithic `vault_*` lane, because cross-phase synthesis reinforces those as non-goals rather than weakening them. (iteration 39)
- Selecting one external system as the new north-star backend, because every phase keeps some ideas while rejecting the system's authority model as a whole. (iteration 39)
- Treating all surviving NEW FEATURE candidates as one omnibus roadmap item, because they optimize different failure modes and would blur sequencing. (iteration 39)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
FINAL ITERATION 040 should convert this cross-phase contract into one unified implementation portfolio: 1. rank the adopt-now items across all five phases into a single execution order, 2. name the stable non-goals that now hold across the whole research program, 3. choose which one NEW FEATURE candidate advances first, 4. bind the result to budgets, ownership, and validation thresholds. ``` Total usage est: 1 Premium request API time spent: 8m 6s Total session time: 8m 27s Total code changes: +0 -0 Breakdown by AI model: gpt-5.4 2.1m in, 39.9k out, 1.9m cached, 12.5k reasoning (Est. 1 Premium request)

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT
Spec Kit Memory stack: memory_search, memory_context, memory_match_triggers, causal links, generate-context.js, CocoIndex semantic search, code-graph structural queries.

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES
- Max iterations: 40 (reached)
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: resume, restart, fork, completed-continue
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: research/.deep-research-pause
- Current generation: 1
- Started: 2026-04-10T19:19:00Z
- Completed: 2026-04-11T02:20:00Z
<!-- /ANCHOR:research-boundaries -->

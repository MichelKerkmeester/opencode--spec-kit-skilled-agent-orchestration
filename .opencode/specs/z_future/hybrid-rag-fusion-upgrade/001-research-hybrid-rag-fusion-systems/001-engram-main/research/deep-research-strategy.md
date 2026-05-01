---
title: Deep Research Strategy - Engram
description: Reducer-tracked strategy for the 001-engram-main hybrid-rag-fusion research packet.
---

# Deep Research Strategy - Engram

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Track the 40-iteration Engram deep research lineage in reducer-compatible format. Research is complete; this file records the final strategy state.

### Usage

- All 40 iterations completed via cli-codex orchestrator (GPT-5.4 high, fast tier)
- Copilot GPT-5.4 high as fallback after 3 consecutive codex failures
- Iterations stored at research/iterations/iteration-NNN.md
- Canonical synthesis at research/research.md

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Research Engram's persistent memory architecture, MCP tool design, session lifecycle, topic-key stability, and SQLite+FTS5 search behavior to identify concrete improvements for Spec Kit Memory.

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: How effective is Engram's ProfileAgent vs ProfileAdmin split for reducing tool clutter?
- [ ] Q2: What does explicit session lifecycle (mem_session_start/end/summary) gain over our current model?
- [ ] Q3: How does SuggestTopicKey create stable topic families that we could adopt?
- [ ] Q4: How does AddObservation balance topic upserts, duplicate suppression, and revision tracking?
- [ ] Q5: What are the practical consequences of direct topic-key shortcuts before FTS5 MATCH?
- [ ] Q6: How does passive capture work and could we adopt a lightweight path?
- [ ] Q7: How does single-binary MCP stdio shape agent-agnostic adoption?
- [ ] Q8: How does project scoping handle multi-agent use safely?
- [ ] Q9: Which Engram features are foundational vs packaging UX we should not copy?
- [ ] Q10: Which patterns best improve compaction survival and startup continuity?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Reimplementing Engram wholesale in our memory system
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
### A doctor surface that can repair by default -- BLOCKED (iteration 32, 1 attempts)
- What was tried: A doctor surface that can repair by default
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A doctor surface that can repair by default

### A second independent `mem_context`-style startup authority parallel to `session_resume` / `session_bootstrap`, because it would create contradictory recovery paths and trust semantics. -- BLOCKED (iteration 35, 1 attempts)
- What was tried: A second independent `mem_context`-style startup authority parallel to `session_resume` / `session_bootstrap`, because it would create contradictory recovery paths and trust semantics.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A second independent `mem_context`-style startup authority parallel to `session_resume` / `session_bootstrap`, because it would create contradictory recovery paths and trust semantics.

### Big-bang enablement across all runtimes at once -- BLOCKED (iteration 32, 1 attempts)
- What was tried: Big-bang enablement across all runtimes at once
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Big-bang enablement across all runtimes at once

### Collapsing topic threads, lexical edges, causal links, and structural code graph data into one universal graph surface, because the cross-phase evidence supports multiple bounded relation planes instead. -- BLOCKED (iteration 39, 1 attempts)
- What was tried: Collapsing topic threads, lexical edges, causal links, and structural code graph data into one universal graph surface, because the cross-phase evidence supports multiple bounded relation planes instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Collapsing topic threads, lexical edges, causal links, and structural code graph data into one universal graph surface, because the cross-phase evidence supports multiple bounded relation planes instead.

### Copying Engram’s coarse `project`/`personal` scope test matrix as-is — Public must test tenant/user/agent/shared-space boundaries too [`001-engram-main/external/internal/store/store_test.go:112-169`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:282-331`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:163-203`]. -- BLOCKED (iteration 33, 1 attempts)
- What was tried: Copying Engram’s coarse `project`/`personal` scope test matrix as-is — Public must test tenant/user/agent/shared-space boundaries too [`001-engram-main/external/internal/store/store_test.go:112-169`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:282-331`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:163-203`].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying Engram’s coarse `project`/`personal` scope test matrix as-is — Public must test tenant/user/agent/shared-space boundaries too [`001-engram-main/external/internal/store/store_test.go:112-169`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:282-331`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:163-203`].

### Copying Engram's post-compaction instruction verbatim ("call `mem_context` and continue"), because Public needs composite recovery that checks graph freshness and semantic-search readiness before routing follow-up work. -- BLOCKED (iteration 35, 1 attempts)
- What was tried: Copying Engram's post-compaction instruction verbatim ("call `mem_context` and continue"), because Public needs composite recovery that checks graph freshness and semantic-search readiness before routing follow-up work.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying Engram's post-compaction instruction verbatim ("call `mem_context` and continue"), because Public needs composite recovery that checks graph freshness and semantic-search readiness before routing follow-up work.

### Folding integrity, doctor, or contradiction signals directly into retrieval ranking, because all five systems separate maintenance from at least one retrieval or storage boundary. -- BLOCKED (iteration 39, 1 attempts)
- What was tried: Folding integrity, doctor, or contradiction signals directly into retrieval ranking, because all five systems separate maintenance from at least one retrieval or storage boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Folding integrity, doctor, or contradiction signals directly into retrieval ranking, because all five systems separate maintenance from at least one retrieval or storage boundary.

### Global lexical bypass for any slash-shaped query -- BLOCKED (iteration 32, 1 attempts)
- What was tried: Global lexical bypass for any slash-shaped query
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Global lexical bypass for any slash-shaped query

### Inferring Public’s `thread_key` or passive-capture semantics directly from Engram’s simpler `topic_key` and lifecycle model without governed-scope adaptation. -- BLOCKED (iteration 38, 1 attempts)
- What was tried: Inferring Public’s `thread_key` or passive-capture semantics directly from Engram’s simpler `topic_key` and lifecycle model without governed-scope adaptation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Inferring Public’s `thread_key` or passive-capture semantics directly from Engram’s simpler `topic_key` and lifecycle model without governed-scope adaptation.

### Literal agent/admin tool reduction that hides `code_graph_query`, `code_graph_context`, or CocoIndex maintenance behind a memory-only profile, because that would erase core routing surfaces Public already depends on. -- BLOCKED (iteration 35, 1 attempts)
- What was tried: Literal agent/admin tool reduction that hides `code_graph_query`, `code_graph_context`, or CocoIndex maintenance behind a memory-only profile, because that would erase core routing surfaces Public already depends on.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Literal agent/admin tool reduction that hides `code_graph_query`, `code_graph_context`, or CocoIndex maintenance behind a memory-only profile, because that would erase core routing surfaces Public already depends on.

### Making embeddings mandatory and eager on every save or startup, because it would worsen write latency and make boot more brittle around provider readiness. -- BLOCKED (iteration 34, 1 attempts)
- What was tried: Making embeddings mandatory and eager on every save or startup, because it would worsen write latency and make boot more brittle around provider readiness.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making embeddings mandatory and eager on every save or startup, because it would worsen write latency and make boot more brittle around provider readiness.

### Picking one external system as the new north-star backend, because every comparison keeps some ideas while rejecting the underlying authority model. -- BLOCKED (iteration 39, 1 attempts)
- What was tried: Picking one external system as the new north-star backend, because every comparison keeps some ideas while rejecting the underlying authority model.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Picking one external system as the new north-star backend, because every comparison keeps some ideas while rejecting the underlying authority model.

### Relying on source-string assertions alone for retrieval changes — useful for smoke coverage, but insufficient for ranking, governance, or session-continuity behavior [`memory-search-integration.vitest.ts:208-257`]. -- BLOCKED (iteration 33, 1 attempts)
- What was tried: Relying on source-string assertions alone for retrieval changes — useful for smoke coverage, but insufficient for ranking, governance, or session-continuity behavior [`memory-search-integration.vitest.ts:208-257`].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Relying on source-string assertions alone for retrieval changes — useful for smoke coverage, but insufficient for ranking, governance, or session-continuity behavior [`memory-search-integration.vitest.ts:208-257`].

### Reopening already rejected directions such as memory-only recovery authority, coarse scope collapse, or lexical-first replacement of Public’s hybrid retrieval. -- BLOCKED (iteration 38, 1 attempts)
- What was tried: Reopening already rejected directions such as memory-only recovery authority, coarse scope collapse, or lexical-first replacement of Public’s hybrid retrieval.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reopening already rejected directions such as memory-only recovery authority, coarse scope collapse, or lexical-first replacement of Public’s hybrid retrieval.

### Replacing `session_bootstrap` / `memory_context` with a router-first markdown bootstrap, because Public already has a richer orchestration authority than Mex-style scaffold routing. -- BLOCKED (iteration 39, 1 attempts)
- What was tried: Replacing `session_bootstrap` / `memory_context` with a router-first markdown bootstrap, because Public already has a richer orchestration authority than Mex-style scaffold routing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing `session_bootstrap` / `memory_context` with a router-first markdown bootstrap, because Public already has a richer orchestration authority than Mex-style scaffold routing.

### Replacing `session_resume` / `session_bootstrap` with a second explicit lifecycle authority -- BLOCKED (iteration 32, 1 attempts)
- What was tried: Replacing `session_resume` / `session_bootstrap` with a second explicit lifecycle authority
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing `session_resume` / `session_bootstrap` with a second explicit lifecycle authority

### Replacing Public’s hybrid retrieval with Engram-style FTS-only search, because the latency win would come from dropping semantic and graph recall that Public intentionally depends on. -- BLOCKED (iteration 34, 1 attempts)
- What was tried: Replacing Public’s hybrid retrieval with Engram-style FTS-only search, because the latency win would come from dropping semantic and graph recall that Public intentionally depends on.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing Public’s hybrid retrieval with Engram-style FTS-only search, because the latency win would come from dropping semantic and graph recall that Public intentionally depends on.

### Treating memory quality as manual QA — Public already has better automated ablation machinery, so ranking changes should not rely on ad hoc spot checks [`ablation-framework.ts:4-20,52-77`; `ablation-framework.vitest.ts:455-617`]. -- BLOCKED (iteration 33, 1 attempts)
- What was tried: Treating memory quality as manual QA — Public already has better automated ablation machinery, so ranking changes should not rely on ad hoc spot checks [`ablation-framework.ts:4-20,52-77`; `ablation-framework.vitest.ts:455-617`].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating memory quality as manual QA — Public already has better automated ablation machinery, so ranking changes should not rely on ad hoc spot checks [`ablation-framework.ts:4-20,52-77`; `ablation-framework.vitest.ts:455-617`].

### Treating the P1-P4 adopt-now set as fully specified already; the architecture direction is stable, but policy and rollout contracts are still incomplete. -- BLOCKED (iteration 38, 1 attempts)
- What was tried: Treating the P1-P4 adopt-now set as fully specified already; the architecture direction is stable, but policy and rollout contracts are still incomplete.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the P1-P4 adopt-now set as fully specified already; the architecture direction is stable, but policy and rollout contracts are still incomplete.

### Using broad in-place topic/thread upserts for all memory classes, because it reduces storage but conflicts with append-only lineage, supersedence, and causal-history guarantees. -- BLOCKED (iteration 34, 1 attempts)
- What was tried: Using broad in-place topic/thread upserts for all memory classes, because it reduces storage but conflicts with append-only lineage, supersedence, and causal-history guarantees.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using broad in-place topic/thread upserts for all memory classes, because it reduces storage but conflicts with append-only lineage, supersedence, and causal-history guarantees.

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- A doctor surface that can repair by default (iteration 32)
- Big-bang enablement across all runtimes at once (iteration 32)
- Global lexical bypass for any slash-shaped query (iteration 32)
- Replacing `session_resume` / `session_bootstrap` with a second explicit lifecycle authority (iteration 32)
- Copying Engram’s coarse `project`/`personal` scope test matrix as-is — Public must test tenant/user/agent/shared-space boundaries too [`001-engram-main/external/internal/store/store_test.go:112-169`; `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:282-331`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:163-203`]. (iteration 33)
- Relying on source-string assertions alone for retrieval changes — useful for smoke coverage, but insufficient for ranking, governance, or session-continuity behavior [`memory-search-integration.vitest.ts:208-257`]. (iteration 33)
- Treating memory quality as manual QA — Public already has better automated ablation machinery, so ranking changes should not rely on ad hoc spot checks [`ablation-framework.ts:4-20,52-77`; `ablation-framework.vitest.ts:455-617`]. (iteration 33)
- Making embeddings mandatory and eager on every save or startup, because it would worsen write latency and make boot more brittle around provider readiness. (iteration 34)
- Replacing Public’s hybrid retrieval with Engram-style FTS-only search, because the latency win would come from dropping semantic and graph recall that Public intentionally depends on. (iteration 34)
- Using broad in-place topic/thread upserts for all memory classes, because it reduces storage but conflicts with append-only lineage, supersedence, and causal-history guarantees. (iteration 34)
- A second independent `mem_context`-style startup authority parallel to `session_resume` / `session_bootstrap`, because it would create contradictory recovery paths and trust semantics. (iteration 35)
- Copying Engram's post-compaction instruction verbatim ("call `mem_context` and continue"), because Public needs composite recovery that checks graph freshness and semantic-search readiness before routing follow-up work. (iteration 35)
- Literal agent/admin tool reduction that hides `code_graph_query`, `code_graph_context`, or CocoIndex maintenance behind a memory-only profile, because that would erase core routing surfaces Public already depends on. (iteration 35)
- Inferring Public’s `thread_key` or passive-capture semantics directly from Engram’s simpler `topic_key` and lifecycle model without governed-scope adaptation. (iteration 38)
- Reopening already rejected directions such as memory-only recovery authority, coarse scope collapse, or lexical-first replacement of Public’s hybrid retrieval. (iteration 38)
- Treating the P1-P4 adopt-now set as fully specified already; the architecture direction is stable, but policy and rollout contracts are still incomplete. (iteration 38)
- Collapsing topic threads, lexical edges, causal links, and structural code graph data into one universal graph surface, because the cross-phase evidence supports multiple bounded relation planes instead. (iteration 39)
- Folding integrity, doctor, or contradiction signals directly into retrieval ranking, because all five systems separate maintenance from at least one retrieval or storage boundary. (iteration 39)
- Picking one external system as the new north-star backend, because every comparison keeps some ideas while rejecting the underlying authority model. (iteration 39)
- Replacing `session_bootstrap` / `memory_context` with a router-first markdown bootstrap, because Public already has a richer orchestration authority than Mex-style scaffold routing. (iteration 39)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 040 should convert this cross-phase contract into the final execution matrix: 1. freeze the cross-system `adopt now / prototype later / reject` table, 2. rank the adopt-now items into a single Q1/Q2 implementation order for Public, 3. choose which one workflow-specific NEW FEATURE candidate advances first, 4. bind every promoted item to budgets, ownership, and validation thresholds. ``` Changes +0 -0 Requests 1 Premium (12m 26s) Tokens ↑ 2.0m • ↓ 58.4k • 1.7m (cached) • 12.4k (reasoning)

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

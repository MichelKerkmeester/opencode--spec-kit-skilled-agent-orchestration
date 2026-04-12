---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Research Engram's persistent memory architecture, MCP tool design, session lifecycle, topic-key stability, and SQLite+FTS5 search behavior to identify concrete improvements for Spec Kit Memory.
- Started: 2026-04-10T19:19:00Z
- Status: COMPLETE
- Iteration: 40 of 40
- Session ID: dr-2026-04-10-001-engram-main
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | ARCHITECTURE OVERVIEW | - | 0.82 | 1 | complete |
| 2 | CORE DATA MODEL | - | 0.82 | 1 | complete |
| 3 | TOOL/API SURFACE | - | 0.86 | 1 | complete |
| 4 | SESSION LIFECYCLE | - | 0.74 | 1 | complete |
| 5 | SEARCH MECHANISMS | - | 0.69 | 1 | complete |
| 6 | MEMORY HYGIENE | - | 0.66 | 1 | complete |
| 7 | AGENT INTEGRATION | - | 0.78 | 1 | complete |
| 8 | COMPARISON - RETRIEVAL | - | 0.74 | 1 | complete |
| 9 | COMPARISON - LIFECYCLE | - | 0.68 | 1 | complete |
| 10 | COMPARISON - HYGIENE | - | 0.63 | 1 | complete |
| 11 | GAP ANALYSIS - MISSING FEATURES | - | 0.74 | 1 | complete |
| 12 | GAP ANALYSIS - REFACTORS | - | 0.81 | 1 | complete |
| 13 | GAP ANALYSIS - PARADIGM SHIFTS | - | 0.76 | 1 | complete |
| 14 | DEEP DIVE - STRONGEST PATTERN | - | 0.69 | 1 | complete |
| 15 | DEEP DIVE - SECOND PATTERN | - | 0.62 | 1 | complete |
| 16 | EDGE CASES & FAILURE MODES | - | 0.58 | 1 | complete |
| 17 | INTEGRATION FEASIBILITY | - | 0.66 | 1 | complete |
| 18 | RISK ASSESSMENT | - | 0.74 | 1 | complete |
| 19 | PRIORITY RANKING | - | 0.62 | 1 | complete |
| 20 | FINAL SYNTHESIS | - | 0.38 | 9 | complete |
| 21 | CROSS-SYSTEM PATTERNS | - | 0.27 | 5 | complete |
| 22 | IMPLEMENTATION BLUEPRINTS | - | 0.24 | 3 | complete |
| 23 | MEMORY DECAY & RETENTION | - | 0.33 | 4 | complete |
| 24 | COMPACTION & CONTEXT SURVIVAL | - | 0.39 | 5 | complete |
| 25 | MULTI-AGENT MEMORY SAFETY | - | 0.48 | 5 | complete |
| 26 | SEMANTIC VS LEXICAL TRADE-OFFS | - | 0.60 | 5 | complete |
| 27 | DEVELOPER EXPERIENCE | - | 0.53 | 6 | complete |
| 28 | BENCHMARK & METRICS | - | 0.57 | 6 | complete |
| 29 | ARCHITECTURE DECISION RECORD | - | 0.42 | 7 | complete |
| 30 | FINAL EXTENDED SYNTHESIS | - | 0.14 | 8 | complete |
| 31 | unknown | - | 0.50 | 0 | complete |
| 32 | MIGRATION RISK MATRIX | - | 0.12 | 4 | complete |
| 33 | TESTING STRATEGY | - | 0.50 | 5 | complete |
| 34 | PERFORMANCE IMPLICATIONS | - | 0.50 | 6 | complete |
| 35 | COMPATIBILITY ANALYSIS | - | 0.50 | 5 | complete |
| 36 | unknown | - | 0.50 | 0 | complete |
| 37 | unknown | - | 0.50 | 0 | complete |
| 38 | OPEN QUESTIONS REGISTER | - | 0.11 | 6 | complete |
| 39 | CROSS-PHASE SYNTHESIS | - | 0.18 | 5 | complete |
| 40 | unknown | - | 0.50 | 0 | complete |

- iterationsCompleted: 40
- keyFindings: 678
- openQuestions: 10
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/10
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

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.11 -> 0.18 -> 0.50
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.50
- coverageBySources: {"code":141,"other":145}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
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

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Iteration 040 should convert this cross-phase contract into the final execution matrix: 1. freeze the cross-system `adopt now / prototype later / reject` table, 2. rank the adopt-now items into a single Q1/Q2 implementation order for Public, 3. choose which one workflow-specific NEW FEATURE candidate advances first, 4. bind every promoted item to budgets, ownership, and validation thresholds. ``` Changes +0 -0 Requests 1 Premium (12m 26s) Tokens ↑ 2.0m • ↓ 58.4k • 1.7m (cached) • 12.4k (reasoning)

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->

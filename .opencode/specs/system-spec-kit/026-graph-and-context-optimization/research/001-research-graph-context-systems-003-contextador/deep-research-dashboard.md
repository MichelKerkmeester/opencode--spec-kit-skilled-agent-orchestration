---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/deep-research-dashboard.md"]

---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/external and identify concrete improvements for Code_Environment/Public, especially around MCP-based query interfaces, self-healing context, shared agent caches (Mainframe), and token-efficient codebase navigation patterns.
- Started: 2026-04-06T10:14:10.000Z
- Status: COMPLETE
- Iteration: 20 of 20
- Session ID: dr_session_1775470451519_esyvim
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | external/src/mcp.ts MCP tool surface and bootstrap | - | 0.82 | 6 | insight |
| 2 | routing path: headmaster.ts routeQuery, pointers.ts, hierarchy.ts | - | 0.74 | 7 | insight |
| 3 | self-healing loop: feedback.ts, janitor.ts, generator.ts, enrichFromFeedback | - | 0.68 | 8 | insight |
| 4 | Mainframe shared cache: bridge.ts, client.ts, rooms.ts, dedup.ts, summarizer.ts | - | 0.73 | 8 | insight |
| 5 | README + stats + licensing reality check | - | 0.62 | 7 | insight |
| 6 | cross-comparison vs CocoIndex, Code Graph MCP, Spec Kit Memory | - | 0.71 | 5 | insight |
| 7 | cross-phase ownership boundaries vs 002-codesight and 004-graphify | - | 0.39 | 4 | insight |
| 8 | pointer payload lossiness: pointers.ts, response.ts, briefing.ts | - | 0.24 | 5 | insight |
| 9 | test coverage audit for core modules (feedback, janitor, headmaster, generator, freshness, stats, pointers tests) | - | 0.41 | 5 | insight |
| 10 | Mainframe tests + budget.ts source trace | - | 0.46 | 4 | insight |
| 11 | setup wizard + framework presets + UI helpers (.mcp.json auto-detection reality check) | - | 0.34 | 5 | insight |
| 12 | github integration: webhook + triage + types as a real automation example | - | 0.31 | 5 | insight |
| 13 | closing module sweep: agents, validation, writer, sizecheck, docsync, depscan, demolish | - | 0.23 | 6 | insight |
| 14 | question closure pass: MCP tool surface, payload shape, and routeQuery decision flow | answer-closure | 0.19 | 4 | insight |
| 15 | question closure pass: feedback ingestion, repair queue, janitor stages, and self-healing claim boundary | answer-closure | 0.17 | 4 | insight |
| 16 | question closure pass: Mainframe broadcast/request protocol, janitor locking, and privacy/consistency tradeoffs | answer-closure | 0.16 | 4 | insight |
| 17 | question closure pass: token-savings arithmetic, budget gating, and provider abstraction support | answer-closure | 0.15 | 4 | insight |
| 18 | question closure pass: setup wizard, framework presets, and .mcp.json onboarding reality | answer-closure | 0.14 | 3 | insight |
| 19 | question closure pass: AGPL plus commercial licensing, Bun runtime, and direct-reuse constraints | answer-closure | 0.13 | 3 | insight |
| 20 | final closure pass: novelty-vs-duplication boundary against CocoIndex, Code Graph, and session bootstrap | final-synthesis | 0.12 | 4 | insight |

- iterationsCompleted: 20
- keyFindings: 465
- openQuestions: 0
- resolvedQuestions: 12

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 12/12
- [x] Q1. What exact MCP tools does Contextador expose, and how does the tool surface change agent workflow compared with direct file reading?
- [x] Q2. What data shape is returned by `context` queries, and how much of the structured-context schema comes from CONTEXT.md pointers versus live file reads?
- [x] Q3. How does routeQuery decide between AI routing, keyword fallback, and fan-out across multiple scopes?
- [x] Q4. How does the self-healing loop work end to end from context_feedback through repair queue processing, regeneration, Key Files patching, and enrichment?
- [x] Q5. What parts of the "self-improving" claim are backed by code today, and what parts remain product language?
- [x] Q6. How does Mainframe synchronize broadcasts and requests across agents, what metadata is shared in Matrix room messages, and where is conflict resolution shallow or missing?
- [x] Q7. What privacy and operational tradeoffs come from Mainframe (persistent local agent IDs, room-level message history, budget state, optional Docker-hosted Operator setup)?
- [x] Q8. How is the 93% token-reduction claim measured or approximated, and does the current stats implementation provide strong evidence or only coarse estimates?
- [x] Q9. How does the provider abstraction layer support Anthropic, OpenAI, Google, GitHub Copilot, OpenRouter, custom servers, and Claude Code?
- [x] Q10. How does .mcp.json auto-detection and framework-specific setup shape adoption compared with this repo's current MCP configuration patterns?
- [x] Q11. What is the actual AGPL plus commercial licensing model, and how does that constrain adoption or direct reuse for Code_Environment/Public?
- [x] Q12. Compared with CocoIndex, Code Graph MCP, and Spec Kit Memory, what is genuinely new in Contextador's query model, and what would only duplicate behavior this repo already has?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.14 -> 0.13 -> 0.12
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.12
- coverageBySources: {"code":70}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved. Proceed to synthesis.]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->

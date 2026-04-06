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
- Topic: Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/external and identify concrete improvements for Code_Environment/Public, especially around AST-based codebase analysis, framework/ORM detector architecture, AI-assistant context file generation, MCP tool design, and per-tool config profile patterns.
- Started: 2026-04-06T09:58:51Z
- Status: INITIALIZED
- Iteration: 5 of 10
- Session ID: dr-002-codesight-20260406T095851Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | iteration 1: index.ts execution + zero-dep loader | - | 0.62 | 5 | insight |
| 2 | iteration 2: Hono + NestJS routes + Drizzle schema | - | 0.69 | 4 | insight |
| 3 | iteration 3: graph + blast-radius + MCP tools | - | 0.78 | 6 | insight |
| 4 | iteration 4: profile generators + benchmark validation | - | 0.55 | 6 | insight |
| 5 | iteration 5: static vs query-time + cross-phase scoping | - | 0.42 | 5 | insight |

- iterationsCompleted: 5
- keyFindings: 188
- openQuestions: 12
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/12
- [ ] Q1. How does the AST extraction pipeline really work in `external/src/index.ts` -> detectors -> `src/ast/loader.ts`, and how often do detectors fall back to regex or structured parsing?
- [ ] Q2. Which frameworks listed in `src/types.ts` actually receive AST-backed route extraction in `src/detectors/routes.ts` + `src/ast/extract-routes.ts`, versus regex-only or shallow detection?
- [ ] Q3. How does one full detector pipeline (Hono or NestJS) work end to end: dependency heuristic, file filtering, AST walk, prefix tracking, param + middleware extraction, contract enrichment?
- [ ] Q4. How are ORM schemas parsed across Drizzle, Prisma, TypeORM, SQLAlchemy, and GORM in `src/detectors/schema.ts` + `src/ast/extract-schema.ts`, and where is each path AST-backed vs regex vs structured-file parsing?
- [ ] Q5. What does the zero-dependency claim really mean in practice: how does `src/ast/loader.ts` borrow project-local TypeScript, what fallbacks fire when it is missing, and what are the operational tradeoffs?
- [ ] Q6. What exact 8 MCP tools does `src/mcp-server.ts` expose, how does it manage session-cached scan state, and how does that compare with `Code_Environment/Public`'s existing MCP and search surfaces (Spec Kit Memory, Code Graph, CocoIndex)?
- [ ] Q7. How does `src/detectors/blast-radius.ts` work internally: how is the import graph built in `src/detectors/graph.ts`, how does reverse BFS traverse it, and where are model-impact and middleware overlays heuristic rather than exact?
- [ ] Q8. How does `src/generators/ai-config.ts` differentiate per-tool profiles for Claude Code, Cursor, Codex, Copilot, and Windsurf, and which patterns are transferable to Public's AI-assistant guidance files?
- [ ] Q9. What is the role of dependency-graph hot-file ranking as a "change carefully" surface, and could a similar capability complement Code Graph MCP and CocoIndex in Public?
- [ ] Q10. How well do `src/eval.ts`, `eval/README.md`, `eval/fixtures/`, and `tests/detectors.test.ts` actually validate the README's headline claims (token savings, detector coverage, blast radius), and where does the README overreach the fixture set?
- [ ] Q11. What architectural value comes from separating static `.codesight/` artifacts from query-time MCP tools, and how should that boundary inform Public's own context-system design?
- [ ] Q12. Which Codesight ideas overlap dangerously with phases 003 (contextador) and 004 (graphify), and which are uniquely scoped to phase 002 because they center on AST detector design and per-tool context generation?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.78 -> 0.55 -> 0.42
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.42
- coverageBySources: {}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Q1. How does the AST extraction pipeline really work in `external/src/index.ts` -> detectors -> `src/ast/loader.ts`, and how often do detectors fall back to regex or structured parsing?

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->

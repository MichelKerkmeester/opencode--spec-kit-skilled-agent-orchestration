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
- Topic: Compare autoagent-main automatic agent iteration with our .opencode/agent system and assess feasibility of a new skill named sk-agent-improvement-loop.
- Started: 2026-04-03T12:06:08Z
- Status: COMPLETE
- Iteration: 3 of 10
- Session ID: dr-2026-04-03T12-06-08Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | External autoagent-main loop anatomy | external-loop | 1.00 | 4 | complete |
| 2 | Internal mapping to .opencode/agent and skills | internal-mapping | 0.90 | 4 | complete |
| 3 | Feasibility and MVP boundaries for sk-agent-improvement-loop | feasibility | 0.80 | 4 | insight |

- iterationsCompleted: 3
- keyFindings: 12
- openQuestions: 0
- resolvedQuestions: 4

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 4/4
- [x] How does `autoagent-main` structure its automatic agent-improvement loop and editable boundary?
- [x] Which parts of that loop align with our existing `.opencode/agent`, `sk-deep-research`, and skill infrastructure?
- [x] What capabilities are missing if we want a reliable `sk-agent-improvement-loop` rather than a one-off research packet?
- [x] What should the MVP scope, boundaries, and success metric be for a new skill in this repo?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 1.00 -> 0.90 -> 0.80
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.80
- coverageBySources: {"code":14}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Assuming the harness itself is the human-authored control plane. The human-controlled directive actually lives in `program.md`, which means the loop depends on a stable "meta-program" surface rather than ad hoc prompting. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:7] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:3] (iteration 1)
- Treating `autoagent-main` as a research loop equivalent to `sk-deep-research` is inaccurate; it is an experiment loop with benchmark scoring, not a general evidence-synthesis loop. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:5] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:80] (iteration 1)
- Directly equating `.opencode/agent/*.md` with `autoagent-main`'s single-file harness would erase a key architectural difference: our agent layer is only one surface inside a broader command/skill/runtime ecosystem. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/agent/deep-research.md:28] (iteration 2)
- Treating "add a skill folder" as the hard part of this idea is misleading. Skill discovery and creation are already solved; evaluation contract, mutable target definition, and success metrics are the real blockers. [SOURCE: .opencode/skill/README.md:46] [SOURCE: .opencode/command/create/sk-skill.md:201] (iteration 2)
- Copying `autoagent-main` wholesale would import the wrong trust boundary. Its loop assumes a benchmark harness under test, while our repo currently organizes behavior across commands, skills, and runtime agent files rather than one isolated harness file. [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/README.md:13] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] (iteration 3)
- Starting with a fully autonomous overnight loop over the entire `.opencode/agent` directory is too broad for an MVP because the repository lacks a benchmark-grade evaluator and because runtime mirrors would make result attribution ambiguous. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/specs/03--skilled-agent-orchestration/041-sk-auto-agent-improvement/external/autoagent-main/program.md:35] (iteration 3)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Stop the loop and synthesize: the packet now has enough evidence to answer the feasibility question and recommend an MVP design for `sk-agent-improvement-loop`.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->

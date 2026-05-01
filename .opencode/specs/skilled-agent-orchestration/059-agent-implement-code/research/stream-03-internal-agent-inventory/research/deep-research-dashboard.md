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
- Topic: Inventory the existing internal .opencode/agent/* ecosystem and harness governance to identify (1) skill auto-loading patterns, (2) stack-agnostic detection mechanisms in sk-code, (3) caller-restriction enforcement (D3 BLOCKER), (4) write-capable safety guarantees, (5) sub-agent dispatch contracts and depth/nesting rules. Map findings to a concrete recommendation set for .opencode/agent/code.md design.
- Started: 2026-05-01T15:00:00Z
- Status: COMPLETE
- Iteration: 5 of 8
- Session ID: dr-2026-05-01-stream-03
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: zero-remaining-questions

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | caller-restriction enforcement inventory | caller-restriction | 0.86 | 8 | complete |
| 2 | Q4 write-capable safety guarantees | write-safety | 0.72 | 13 | complete |
| 3 | Q5 sub-agent dispatch contracts and LEAF enforcement | sub-agent-dispatch | 0.66 | 11 | complete |
| 4 | Q1 skill auto-loading and Skill Advisor hook behavior | skill-loading | 0.58 | 11 | complete |
| 5 | Q2 sk-code stack-agnostic detection mechanism | stack-detection | 0.52 | 12 | complete |

- iterationsCompleted: 5
- keyFindings: 56
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] Q1: Skill auto-loading patterns - how do current agents pick up skills? Is there a frontmatter field naming skills to auto-load? What does the skill-advisor hook do at the agent boundary?
- [ ] Q2: Stack-agnostic detection mechanisms - concretely: how does `sk-code` detect Webflow vs Next.js vs Go vs Swift? Where is the marker-file probing logic? Can a future `@code` agent reuse this without hardcoding stack assumptions?
- [ ] Q3: Caller-restriction enforcement (D3 BLOCKER) - any harness-level mechanism in our codebase that enforces caller restrictions? Inspect every `.opencode/agent/*.md` for relevant frontmatter. Inspect AGENTS.md "Distributed Governance Rule" and "@orchestrate routes to" pattern. Find what mechanism, if any, the harness already supports for "callable only by orchestrator".
- [ ] Q4: Write-capable safety guarantees - how do existing write-capable agents (write, debug for `debug-delegation.md`, deep-research for `research/research.md`) bound their writes? Path allowlists, scope locks, validation hooks?
- [ ] Q5: Sub-agent dispatch contracts and depth/nesting rules - what does LEAF mean concretely in our agents? Find every `leaf` flag, every `task:` permission, every comment forbidding nested dispatch. What enforces it at runtime? `task: deny` is one example - where is it implemented?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.66 -> 0.58 -> 0.52
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.52
- coverageBySources: {"code":350}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Existing explicit frontmatter keys named `caller`, `dispatchableBy`, `callableFrom`, `parent`, `restricted_callers`, `allowed_callers`, or equivalent. (iteration 1)
- Existing harness-level validator patterns named `isOrchestrator`, `restricted_callers`, or `dispatchableBy`. (iteration 1)
- Treating `permission.task: deny` as caller restriction. It prevents the callee from dispatching onward; it does not restrict who can invoke the callee. (iteration 1)
- A universal runtime write allowlist for `.opencode/agent/*` agents in system-spec-kit scripts/shared code. (iteration 2)
- Code-level enforcement for "spec.md scope is FROZEN"; the focused search found the scope-lock rule as AGENTS.md prose only. (iteration 2)
- Machine-readable `allowed_paths` / `allowedPaths` / `allowed_path` fields in the inspected agent frontmatter. (iteration 2)
- `@orchestrate` having an explicit `permission.task: allow` frontmatter field in the current file. (iteration 3)
- A local `agent_config.leaf_only` loader that enforces no Task dispatch. (iteration 3)
- Post-dispatch validation as LEAF validation; it validates iteration artifacts and JSONL schema only. (iteration 3)
- Tests that automatically assert `permission.task: deny` blocks Task-tool calls from a LEAF agent. (iteration 3)
- Existing agent frontmatter keys named `skills`, `skill`, `auto_skills`, `loaded_skills`, `requires`, `uses`, `dependencies`, or `routes`. (iteration 4)
- Existing searched runtime loader patterns named `auto_load_skills`, `preload_skills`, or generic agent-skill binding. (iteration 4)
- Treating the Skill Advisor hook as skill auto-loading. It recommends and injects brief context; it does not read or load `SKILL.md` for the agent. (iteration 4)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Iteration 6 should synthesize the `@code` design contract from Q1-Q5: body-level skill binding to `sk-code`, no claimed caller-restriction enforcement, `permission.task: deny` for LEAF behavior, bounded write prose plus verification gates, and stack detection delegated to `sk-code` by reference rather than duplicated inside the agent. If implementation is next, the lowest-risk improvement is a tiny, tested `sk-code` stack detector shared by `SKILL.md`, advisor diagnostics, and future `@code`.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->

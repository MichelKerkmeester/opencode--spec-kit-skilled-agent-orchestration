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
- Topic: Research the downloaded GitNexus project in this spec folder's external source tree. Determine which patterns can be adopted, adapted, rejected, or deferred to improve Public's Code Graph package, Spec Kit Memory causal graph, and Skill Graph or Skill Advisor graph surfaces. Ground every claim in exact source citations. Do not implement changes. Produce a final Adopt/Adapt/Reject matrix, per-system recommendations, ownership boundaries, risks, and follow-up implementation packet proposals.
- Started: 2026-04-25T06:21:07Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: dr-2026-04-25T06-21-07Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Architecture baseline and pipeline DAG | architecture | 1.00 | 5 | complete |
| 2 | Graph schema, edge vocabulary, confidence, and persistence | schema | 0.86 | 5 | complete |
| 3 | Query, context, and impact surfaces | code-graph-api | 0.78 | 6 | complete |
| 4 | Change safety: detect_changes, impact, rename | safety | 0.70 | 5 | complete |
| 5 | Route, API, shape, and tool maps | route-tool-surface | 0.64 | 5 | complete |
| 6 | Group Contract Registry and cross-repo impact | contract-registry | 0.58 | 5 | complete |
| 7 | Spec Kit Memory causal graph fit and boundaries | memory-causal | 0.52 | 5 | complete |
| 8 | Skill Graph and Skill Advisor fit | skill-graph | 0.46 | 5 | complete |
| 9 | Adopt, adapt, reject, defer matrix | decision-matrix | 0.35 | 6 | complete |
| 10 | Follow-up implementation packet proposals and convergence | synthesis | 0.22 | 5 | complete |

- iterationsCompleted: 10
- keyFindings: 52
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What GitNexus ingestion, graph schema, process-flow, and query/context patterns are portable to Public's Code Graph package?
- [x] Which GitNexus impact, detect-changes, rename, route-map, tool-map, shape-check, or group-contract mechanisms are worth adapting for graph safety?
- [x] Which GitNexus concepts can improve Spec Kit Memory's causal graph without turning memory into a duplicate code index?
- [x] Which GitNexus tool/resource/agent affordances can inform Skill Graph or Skill Advisor routing evidence?
- [x] What should be adopted, adapted, rejected, or deferred, and what follow-up implementation packets should be created?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.46 -> 0.35 -> 0.22
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.72
- coverageBySources: {"code":49}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- CocoIndex semantic bootstrap timed out before producing usable hits, so iteration evidence came from direct reads and `rg`. (iteration 1)
- Directly copying the whole GitNexus ingestion pipeline: Public's Code Graph currently supports a smaller language/runtime surface and should not inherit GitNexus' full native dependency profile. (iteration 1)
- Adopting LadybugDB as the immediate Public Code Graph storage layer; Public already has SQLite tooling, handlers, readiness state, and tests. (iteration 2)
- Treating "more relationship types" as automatically better; relationship types need owner systems and query affordances. (iteration 2)
- Assuming process-grouped query can be added only at the handler layer; it requires process or workflow-derived nodes first. (iteration 3)
- Replacing `code_graph_query` with natural-language process search before Public has process nodes. (iteration 3)
- Copy GitNexus rename application behavior directly; Public should preserve exact preview ranges and require post-change detection. (iteration 4)
- Using text-search-only rename as a graph feature; it weakens the trust story unless clearly labeled as low confidence. (iteration 4)
- Reporting shape-check results only when complete data exists; Public should surface `no_shape`, `no_consumers`, and `mismatch` as separate states. (iteration 5)
- Treating route API impact as memory responsibility. It belongs in Code Graph, with Memory linking later decisions to graph evidence. (iteration 5)
- Allowing implicit default group member selection for any edit-safety tool. (iteration 6)
- Reintroducing separate `group_query` or `group_impact` tools; resources plus scoped parameters are a cleaner surface. (iteration 6)
- Making Memory responsible for source-code freshness. Memory should record freshness metadata from Code Graph, not compute it. (iteration 7)
- Mirroring GitNexus `CodeRelation` directly into `causal_edges`; it would collapse decision lineage and structural code dependencies into one overloaded graph. (iteration 7)
- Adding a separate Skill Advisor scoring lane for GitNexus-style evidence; the existing graph_causal lane is the right owner. (iteration 8)
- Treating skill descriptions as enough for routing. GitNexus shows that entrypoint and handler links make graph evidence more useful than prose alone. (iteration 8)
- Allowing impact tools to infer unsafe group defaults. (iteration 9)
- Copying source wholesale. (iteration 9)
- Migrating storage before measuring Public SQLite limitations. (iteration 9)
- One giant follow-up packet; the scope crosses too many systems and would be hard to validate. (iteration 9)
- Continuing beyond 10 iterations now; novelty has dropped and the user requested a fixed 10-iteration run. (iteration 10)
- Single shared graph for code, memory, and skills; the better architecture is shared evidence with separate ownership boundaries. (iteration 10)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Synthesize `research.md`, emit a resource map, update `spec.md` with the generated findings block, and save continuity.

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

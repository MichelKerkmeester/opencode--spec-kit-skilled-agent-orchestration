---
title: "Deep Research Strategy: GitNexus Graph and Context Optimization"
description: "Workflow-owned strategy state for the 007-git-nexus deep-research loop."
---

# Deep Research Strategy - GitNexus Graph and Context Optimization

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This file is the persistent strategy surface for `/spec_kit:deep-research:auto` over the downloaded GitNexus source tree. Each iteration reads this state, writes evidence to an iteration file and JSONL delta, and lets the reducer refresh machine-owned sections.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:topic -->
## 2. TOPIC

Research the downloaded GitNexus project in this spec folder's external source tree. Determine which patterns can be adopted, adapted, rejected, or deferred to improve Public's Code Graph package, Spec Kit Memory causal graph, and Skill Graph or Skill Advisor graph surfaces. Ground every claim in exact source citations. Do not implement changes. Produce a final Adopt/Adapt/Reject matrix, per-system recommendations, ownership boundaries, risks, and follow-up implementation packet proposals.
<!-- /ANCHOR:topic -->

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What GitNexus ingestion, graph schema, process-flow, and query/context patterns are portable to Public's Code Graph package?
- [x] Which GitNexus impact, detect-changes, rename, route-map, tool-map, shape-check, or group-contract mechanisms are worth adapting for graph safety?
- [x] Which GitNexus concepts can improve Spec Kit Memory's causal graph without turning memory into a duplicate code index?
- [x] Which GitNexus tool/resource/agent affordances can inform Skill Graph or Skill Advisor routing evidence?
- [x] What should be adopted, adapted, rejected, or deferred, and what follow-up implementation packets should be created?

<!-- /ANCHOR:key-questions -->

<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Do not implement changes to Public graph, memory, or skill systems in this packet.
- Do not modify GitNexus source under `external/`.
- Do not treat README claims as sufficient evidence without source or test confirmation.
- Do not recommend copying source code where architectural adaptation is enough or license/runtime fit is unclear.
<!-- /ANCHOR:non-goals -->

<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- Stop after 10 iterations because the user requested a fixed 10-iteration auto-mode run.
- Stop earlier only if every key question has strong source-backed answers and quality guards pass.
- Escalate rather than continue if the research state becomes invalid or iteration artifacts cannot be validated.
<!-- /ANCHOR:stop-conditions -->

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What GitNexus ingestion, graph schema, process-flow, and query/context patterns are portable to Public's Code Graph package?
- Which GitNexus impact, detect-changes, rename, route-map, tool-map, shape-check, or group-contract mechanisms are worth adapting for graph safety?
- Which GitNexus concepts can improve Spec Kit Memory's causal graph without turning memory into a duplicate code index?
- Which GitNexus tool/resource/agent affordances can inform Skill Graph or Skill Advisor routing evidence?
- What should be adopted, adapted, rejected, or deferred, and what follow-up implementation packets should be created?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Source-first architecture reading quickly separated implemented DAG mechanics from README-level claims. (iteration 1)
- Schema comparison made adoption boundaries concrete. (iteration 2)
- Comparing tool contracts showed which features are surface-level and which require schema work. (iteration 3)
- The sidecar safety review found concrete implementation caveats that README-level research would miss. (iteration 4)
- Separating route and tool ownership kept the research from blending Code Graph and Skill Graph responsibilities. (iteration 5)
- The contract model generalized cleanly across Code Graph and Skill Graph. (iteration 6)
- Owner-boundary analysis prevented the research from turning every graph into one graph. (iteration 7)
- Mapping GitNexus concepts onto existing Skill Advisor lanes avoided unnecessary new scoring machinery. (iteration 8)
- The matrix forced attractive ideas to pass owner, evidence, and runtime-fit checks. (iteration 9)
- The run now has enough evidence to plan scoped implementation work. (iteration 10)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Semantic bootstrap was unavailable because CocoIndex timed out. (iteration 1)
- Storage-layer enthusiasm is premature without benchmarks. (iteration 2)
- Query naming alone is not enough to import behavior. (iteration 3)
- Treating rename as a direct adoption candidate failed under source inspection. (iteration 4)
- Shape checking is attractive but coverage-sensitive. (iteration 5)
- Group defaults are convenient for exploration but unsafe for impact. (iteration 6)
- Direct edge vocabulary mapping is too blunt. (iteration 7)
- "Skill Graph" is still broader than one compiler output; capability contracts need a proper schema. (iteration 8)
- Direct adoption rarely survived source inspection. (iteration 9)
- A single mega-packet would mix storage, MCP surface, memory lineage, and routing changes. (iteration 10)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Adding a separate Skill Advisor scoring lane for GitNexus-style evidence; the existing graph_causal lane is the right owner. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Adding a separate Skill Advisor scoring lane for GitNexus-style evidence; the existing graph_causal lane is the right owner.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a separate Skill Advisor scoring lane for GitNexus-style evidence; the existing graph_causal lane is the right owner.

### Adopting LadybugDB as the immediate Public Code Graph storage layer; Public already has SQLite tooling, handlers, readiness state, and tests. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Adopting LadybugDB as the immediate Public Code Graph storage layer; Public already has SQLite tooling, handlers, readiness state, and tests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adopting LadybugDB as the immediate Public Code Graph storage layer; Public already has SQLite tooling, handlers, readiness state, and tests.

### Allowing impact tools to infer unsafe group defaults. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Allowing impact tools to infer unsafe group defaults.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Allowing impact tools to infer unsafe group defaults.

### Allowing implicit default group member selection for any edit-safety tool. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Allowing implicit default group member selection for any edit-safety tool.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Allowing implicit default group member selection for any edit-safety tool.

### Assuming process-grouped query can be added only at the handler layer; it requires process or workflow-derived nodes first. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Assuming process-grouped query can be added only at the handler layer; it requires process or workflow-derived nodes first.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming process-grouped query can be added only at the handler layer; it requires process or workflow-derived nodes first.

### CocoIndex semantic bootstrap timed out before producing usable hits, so iteration evidence came from direct reads and `rg`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: CocoIndex semantic bootstrap timed out before producing usable hits, so iteration evidence came from direct reads and `rg`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: CocoIndex semantic bootstrap timed out before producing usable hits, so iteration evidence came from direct reads and `rg`.

### Continuing beyond 10 iterations now; novelty has dropped and the user requested a fixed 10-iteration run. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Continuing beyond 10 iterations now; novelty has dropped and the user requested a fixed 10-iteration run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Continuing beyond 10 iterations now; novelty has dropped and the user requested a fixed 10-iteration run.

### Copy GitNexus rename application behavior directly; Public should preserve exact preview ranges and require post-change detection. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Copy GitNexus rename application behavior directly; Public should preserve exact preview ranges and require post-change detection.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copy GitNexus rename application behavior directly; Public should preserve exact preview ranges and require post-change detection.

### Copying source wholesale. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Copying source wholesale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying source wholesale.

### Directly copying the whole GitNexus ingestion pipeline: Public's Code Graph currently supports a smaller language/runtime surface and should not inherit GitNexus' full native dependency profile. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Directly copying the whole GitNexus ingestion pipeline: Public's Code Graph currently supports a smaller language/runtime surface and should not inherit GitNexus' full native dependency profile.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Directly copying the whole GitNexus ingestion pipeline: Public's Code Graph currently supports a smaller language/runtime surface and should not inherit GitNexus' full native dependency profile.

### Making Memory responsible for source-code freshness. Memory should record freshness metadata from Code Graph, not compute it. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Making Memory responsible for source-code freshness. Memory should record freshness metadata from Code Graph, not compute it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making Memory responsible for source-code freshness. Memory should record freshness metadata from Code Graph, not compute it.

### Migrating storage before measuring Public SQLite limitations. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Migrating storage before measuring Public SQLite limitations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Migrating storage before measuring Public SQLite limitations.

### Mirroring GitNexus `CodeRelation` directly into `causal_edges`; it would collapse decision lineage and structural code dependencies into one overloaded graph. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Mirroring GitNexus `CodeRelation` directly into `causal_edges`; it would collapse decision lineage and structural code dependencies into one overloaded graph.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mirroring GitNexus `CodeRelation` directly into `causal_edges`; it would collapse decision lineage and structural code dependencies into one overloaded graph.

### One giant follow-up packet; the scope crosses too many systems and would be hard to validate. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: One giant follow-up packet; the scope crosses too many systems and would be hard to validate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: One giant follow-up packet; the scope crosses too many systems and would be hard to validate.

### Reintroducing separate `group_query` or `group_impact` tools; resources plus scoped parameters are a cleaner surface. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Reintroducing separate `group_query` or `group_impact` tools; resources plus scoped parameters are a cleaner surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reintroducing separate `group_query` or `group_impact` tools; resources plus scoped parameters are a cleaner surface.

### Replacing `code_graph_query` with natural-language process search before Public has process nodes. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Replacing `code_graph_query` with natural-language process search before Public has process nodes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing `code_graph_query` with natural-language process search before Public has process nodes.

### Reporting shape-check results only when complete data exists; Public should surface `no_shape`, `no_consumers`, and `mismatch` as separate states. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Reporting shape-check results only when complete data exists; Public should surface `no_shape`, `no_consumers`, and `mismatch` as separate states.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reporting shape-check results only when complete data exists; Public should surface `no_shape`, `no_consumers`, and `mismatch` as separate states.

### Single shared graph for code, memory, and skills; the better architecture is shared evidence with separate ownership boundaries. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Single shared graph for code, memory, and skills; the better architecture is shared evidence with separate ownership boundaries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Single shared graph for code, memory, and skills; the better architecture is shared evidence with separate ownership boundaries.

### Treating "more relationship types" as automatically better; relationship types need owner systems and query affordances. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating "more relationship types" as automatically better; relationship types need owner systems and query affordances.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating "more relationship types" as automatically better; relationship types need owner systems and query affordances.

### Treating route API impact as memory responsibility. It belongs in Code Graph, with Memory linking later decisions to graph evidence. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating route API impact as memory responsibility. It belongs in Code Graph, with Memory linking later decisions to graph evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating route API impact as memory responsibility. It belongs in Code Graph, with Memory linking later decisions to graph evidence.

### Treating skill descriptions as enough for routing. GitNexus shows that entrypoint and handler links make graph evidence more useful than prose alone. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating skill descriptions as enough for routing. GitNexus shows that entrypoint and handler links make graph evidence more useful than prose alone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating skill descriptions as enough for routing. GitNexus shows that entrypoint and handler links make graph evidence more useful than prose alone.

### Using text-search-only rename as a graph feature; it weakens the trust story unless clearly labeled as low confidence. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Using text-search-only rename as a graph feature; it weakens the trust story unless clearly labeled as low confidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using text-search-only rename as a graph feature; it weakens the trust story unless clearly labeled as low confidence.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Synthesize `research.md`, emit a resource map, update `spec.md` with the generated findings block, and save continuity.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

- Memory context returned no direct prior research hits for this exact GitNexus packet, but surfaced related graph/memory packets: `024-compact-code-graph/009-code-graph-storage-query`, `024-compact-code-graph/019-code-graph-auto-trigger`, `024-compact-code-graph/030-opencode-graph-plugin`, and hybrid-RAG/memory research packets.
- `resource-map.md` is not present at init; coverage gate will rely on iteration evidence and emitted `research/resource-map.md`.
- GitNexus `external/AGENTS.md` scopes reads and writes inside the downloaded source tree and describes GitNexus as 4325 symbols, 10556 relationships, and 300 execution flows, with important MCP tools including query, context, impact, detect_changes, rename, route_map, tool_map, shape_check, and group features.
- CocoIndex bootstrap timed out after 120 seconds for both GitNexus external source and Public graph/memory/skill code; continue with `rg`, direct file reads, and sidecar read-only explorers.
<!-- /ANCHOR:known-context -->

<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- `research/research.md` ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` live; `fork`, `completed-continue` deferred
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-04-25T06:21:07Z
<!-- /ANCHOR:research-boundaries -->

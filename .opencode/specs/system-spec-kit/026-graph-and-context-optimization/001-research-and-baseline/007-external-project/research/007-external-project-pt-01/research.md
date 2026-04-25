---
title: "External Project Deep Research Synthesis"
description: "Ten-iteration source-grounded synthesis for adopting, adapting, rejecting, or deferring External Project graph patterns for Public Code Graph, Spec Kit Memory causal graph, and Skill Graph surfaces."
---

# External Project Deep Research Synthesis

## Executive Summary

The 10-iteration research loop found strong architectural ideas in External Project, but weak justification for direct code reuse. The best path is selective adaptation: phase-DAG ingestion discipline, richer edge provenance, pre-change impact surfaces, route/tool/shape safety checks, and explicit cross-repo contract resources. Public should keep Code Graph, Memory, and Skill Graph ownership separate while allowing them to share evidence.

The highest-value Code Graph candidates are a typed ingestion DAG, edge confidence/reason metadata, process/route/tool edges, and pre-edit blast-radius affordances. Spec Kit Memory should not copy External Project' code graph model; it should store links from decisions/specs to Code Graph evidence and freshness metadata. Skill Graph should adapt External Project' tool/resource mapping style into skill-to-command, skill-to-agent, and skill-to-file evidence for the existing graph-causal scoring lane.

## Methodology

- Ran the `/spec_kit:deep-research:auto` packet in auto mode for 10 iterations, with workflow-owned JSONL state, delta logs, iteration notes, reducer dashboard, and resource map under `research/007-external-project-pt-01/`.
- Used two completed read-only sidecar agents for External Project core graph and safety/MCP/group surfaces, then synthesized locally against direct source reads.
- Attempted a CocoIndex bootstrap, but semantic search timed out before usable hits. The final evidence therefore relies on direct `rg`, file reads, reducer state, and source citations.
- Did not modify `external/` or Public implementation files.

## Findings by Target System

### Public Code Graph

External Project' most portable idea is its explicit phase-DAG pipeline. The architecture documents a fixed ingestion sequence from scan through process extraction, and the actual registry conditionally appends graph-heavy phases when `skipGraphPhases` is false [SOURCE: external/ARCHITECTURE.md:80] [SOURCE: external/src/core/ingestion/pipeline.ts:73]. Its runner topologically sorts phases, rejects duplicate names, missing dependencies, and cycles, and only passes declared dependency outputs into each phase [SOURCE: external/src/core/ingestion/pipeline-phases/runner.ts:22] [SOURCE: external/src/core/ingestion/pipeline-phases/runner.ts:182].

Public Code Graph already has a compact SQLite-backed model with `code_files`, `code_symbols`, and `code_edges`, including parse/freshness metadata on files and JSON metadata on edges [SOURCE: .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:55] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:86]. That means Public should not adopt External Project storage directly. It should adapt the pipeline discipline, add first-class edge confidence/reason semantics, and extend edge vocabulary only where query and context handlers can use it.

External Project also has a more agent-facing graph surface. `query` is concept-oriented and process-grouped, `context` provides callers/callees/references/process participation, and `impact` is framed as pre-change blast radius with depth groups, affected processes, modules, and risk levels [SOURCE: external/src/mcp/tools.ts:49] [SOURCE: external/src/mcp/tools.ts:172] [SOURCE: external/src/mcp/tools.ts:285]. Public's `code_graph_query` is currently relationship-operation oriented, while `code_graph_context` already accepts CocoIndex/manual/graph seeds and emits LLM-oriented neighborhoods [SOURCE: .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:20] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:166]. The practical adaptation is to enrich Public's existing surfaces rather than replace them.

### Spec Kit Memory Causal Graph

External Project' structural graph should not be copied into Memory. Public Memory already has causal edge concepts with relation types, weights, traversal limits, intent priorities, recursive CTE traversal, and a bounded `applyCausalBoost` pipeline [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:18] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:21] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:59] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:410] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:519].

The useful transfer is provenance and freshness: Memory should record that a decision, spec, or handoff relied on Code Graph evidence, including scan timestamp, parse health, edge confidence, and stale-warning status. External Project exposes staleness as a query-layer concern and shares one graph across MCP, HTTP, and CLI front doors [SOURCE: external/ARCHITECTURE.md:27] [SOURCE: external/ARCHITECTURE.md:224]. Public can adapt the warning pattern while keeping Memory responsible for decision lineage, not source-code indexing.

Memory can also learn from External Project impact analysis by adding memory-level "affected prior decisions/specs" traversal that starts from Code Graph evidence. That should be a bridge from code evidence to memory artifacts, not a migration of External Project `CodeRelation` rows into `causal_edges`.

### Skill Graph and Skill Advisor

External Project' tool/resource map and group-resource ideas are useful for Skill Graph, especially when skills, commands, agents, and hooks need explicit ownership boundaries. External Project exposes `route_map`, `tool_map`, `shape_check`, and API impact tools [SOURCE: external/src/mcp/tools.ts:400] [SOURCE: external/src/mcp/tools.ts:423] [SOURCE: external/src/mcp/tools.ts:439] [SOURCE: external/src/mcp/tools.ts:462]. It also exposes group resources and dispatches group resource reads through MCP resources [SOURCE: external/src/mcp/resources.ts:88] [SOURCE: external/src/mcp/resources.ts:240].

Public already has a skill graph compiler with skill graph edge/entity types and metadata discovery [SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:42] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:50]. Skill Advisor also already has a graph-causal lane and fusion integration [SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/graph-causal.ts:12] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/graph-causal.ts:20] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:115]. So the adaptation should feed better evidence into existing Skill Graph and scoring lanes instead of adding a separate External Project-flavored lane.

## Adopt, Adapt, Reject, Defer Matrix

| Candidate Pattern | Decision | Target Owner | Evidence | Rationale |
|---|---|---|---|---|
| Explicit phase-DAG ingestion runner | Adapt | Code Graph | `external/src/core/ingestion/pipeline-phases/runner.ts:22`, `external/src/core/ingestion/pipeline.ts:73` | Strong discipline for incremental graph enrichment, but Public should implement smaller local phases. |
| Direct External Project LadybugDB storage model | Reject | Code Graph | `external/ARCHITECTURE.md:456`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:55` | Public already has SQLite schemas and should not migrate storage without measured need. |
| Edge confidence/reason metadata | Adopt | Code Graph | `external/shared/src/graph/types.ts:126`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:86` | Fits Public's JSON edge metadata today and can become first-class later. |
| Process, route, tool, fetch, entry-point edges | Adapt | Code Graph | `external/ARCHITECTURE.md:462`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/query.ts:20` | Useful only when handlers expose them in query/context/impact. |
| Concept/process-grouped query | Defer | Code Graph | `external/src/mcp/tools.ts:49` | Requires process nodes first; premature before extraction exists. |
| 360-degree symbol context | Adapt | Code Graph | `external/src/mcp/tools.ts:172`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/context.ts:166` | Public context has the right foundation; add richer sections gradually. |
| Pre-change impact/blast-radius tool | Adapt | Code Graph | `external/src/mcp/tools.ts:285` | High value for edits, but needs confidence labels and freshness warnings. |
| detect_changes and graph-assisted rename | Defer | Code Graph | `external/src/mcp/tools.ts:221`, `external/src/mcp/tools.ts:251` | Needs exact range preview and post-change validation before trusted application. |
| route_map, tool_map, shape_check, api_impact | Adapt | Code Graph and Skill Graph | `external/src/mcp/tools.ts:400`, `:423`, `:439`, `:462` | Best used as safety/evidence surfaces for routes, tools, commands, and skills. |
| Group Contract Registry | Adapt | Code Graph with Memory links | `external/ARCHITECTURE.md:47`, `external/ARCHITECTURE.md:51`, `external/src/mcp/resources.ts:88` | Useful future cross-repo contract shape, but avoid implicit unsafe defaults. |
| Copy structural code relations into Memory causal edges | Reject | Memory | `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:18` | Would collapse code dependency and decision lineage responsibilities. |
| Freshness/provenance warnings in Memory results | Adopt | Memory | `external/ARCHITECTURE.md:27`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:55` | Memory should display provenance from Code Graph evidence without recomputing it. |
| Skill-to-tool/resource evidence | Adapt | Skill Graph | `external/src/mcp/tools.ts:423`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:42` | Directly improves skill routing explainability and impact analysis. |
| New Skill Advisor External Project scoring lane | Reject | Skill Advisor | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/graph-causal.ts:20` | Existing graph-causal lane is the correct integration point. |

## Follow-Up Implementation Packet Proposals

1. `008-code-graph-phase-dag-and-edge-provenance`
   - Scope: introduce a small typed phase runner for Public Code Graph, edge confidence/reason metadata, and reducer-visible graph quality reporting.
   - Validation: unit tests for phase dependency order, cycle rejection, parse freshness, and edge metadata queries.

2. `009-code-graph-impact-and-safety-surfaces`
   - Scope: enrich `code_graph_query` and `code_graph_context` with pre-edit impact summaries, stale-result warnings, route/tool/shape preview concepts, and explicit confidence labels.
   - Validation: fixtures for blast-radius depth, stale graph warnings, no-shape/no-consumer/mismatch states, and LLM-oriented response contracts.

3. `010-memory-code-evidence-bridge`
   - Scope: add memory provenance links to Code Graph evidence, including scan timestamp, source file/symbol, edge confidence, and affected prior specs.
   - Validation: memory search tests proving causal boost stays decision-oriented while displaying graph evidence.

4. `011-skill-graph-evidence-and-impact`
   - Scope: extend Skill Graph compilation with command, agent, hook, file, and MCP/resource evidence, then feed that into existing graph-causal scoring.
   - Validation: Skill Advisor ranking tests where graph evidence improves routing without overpowering explicit trigger phrases.

## Risks and Boundaries

- Direct code copying is not recommended from this packet. The research reviewed architecture and source shape, but did not complete a license/legal review.
- Public should avoid a single shared graph for code, memory, and skills. The stronger architecture is shared evidence with separate owners.
- External Project group mode has useful cross-repo ideas, but edit-safety tools must never infer unsafe default group members.
- Storage migration is out of scope until Public SQLite limitations are measured.

## Convergence Report

The last three new-information ratios were `0.46 -> 0.35 -> 0.22`, with all five tracked research questions resolved and no open questions left in the reducer dashboard. The research should stop here and feed follow-up implementation packets rather than continuing discovery.

## References

- Iterations: `iterations/iteration-001.md` through `iterations/iteration-010.md`
- Deltas: `deltas/iter-001.jsonl` through `deltas/iter-010.jsonl`
- Reducer dashboard: `deep-research-dashboard.md`
- Findings registry: `findings-registry.json`
- Resource map: `resource-map.md`

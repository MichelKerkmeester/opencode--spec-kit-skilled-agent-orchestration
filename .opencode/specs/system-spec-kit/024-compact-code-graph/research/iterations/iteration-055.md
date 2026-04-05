# Iteration 055: Implementation Readiness Assessment — CocoIndex-Aware Code Graph Architecture

## Focus

Finalize segment 5 by converting the existing hook-plus-code-graph research into an implementation-readiness assessment. This pass answers the remaining execution questions directly: complete implementation order, whether Phase 008+ child specs are needed, remaining gaps, exact MVP scope, unmitigated risks, estimated implementation size, MCP-server placement, and a 1-5 readiness scorecard per major component.

## Findings

1. The complete implementation order is now stable, and it starts with transport-contract fixes before any structural graph work.

   Recommended order:

   1. Fix `/spec_kit:resume` so every resume path passes `profile: "resume"`.
   2. Ship Phases 001+002 together: `compact-inject.ts`, `session-prime.ts`, shared hook-state, and cached compact reinjection.
   3. Land the minimum viable Phase 004 fallback so non-Claude runtimes have an honest recovery path.
   4. Implement Phase 008 structural index extraction.
   5. Implement Phase 009 graph storage plus exact structural query/status tools.
   6. Implement Phase 010 `code_graph_context` and CocoIndex-seed resolution.
   7. Implement Phase 011 working-set tracking plus PreCompact 3-source merge.
   8. Finish Phase 003 Stop-hook telemetry, then Phase 005-007 alignment, docs, and test hardening.

   This keeps the graph work behind the hook transport contract, but it does not require waiting for full release-hardening before starting 008-010.

2. Yes, Phase 008+ child specs are needed, and they should stay inside `024-compact-code-graph` rather than moving to a new root packet.

   Recommended breakdown:

   - `008-structural-indexer`
     - tree-sitter extraction for JS/TS/Python/Shell
     - normalized node and edge vocabulary
     - independent structural freshness state
   - `009-code-graph-storage-and-query`
     - `code-graph.sqlite`
     - `code_files`, `code_nodes`, `code_edges`
     - `code_graph_scan`, `code_graph_status`, `code_graph_query`
   - `010-cocoindex-bridge-context`
     - `code_graph_context`
     - CocoIndex seed normalization and span-to-node resolution
     - repo-map / compact neighborhood projection
   - `011-compaction-working-set-integration`
     - code working-set tracker
     - 3-source merge: Memory + CocoIndex + Code Graph
     - mixed-freshness coordination
     - compact brief rendering for `SessionStart(source=compact)`

   Optional follow-on if the team wants a separate release gate:

   - `012-graph-validation-and-benchmarks`
     - latency/size benchmarks
     - routing accuracy
     - seed-resolution accuracy
     - compaction usefulness validation

3. The remaining gaps are implementation and validation gaps, not architecture-direction gaps.

   What is already answered well enough to build:

   - semantic vs structural boundary
   - SQLite over graph DB
   - four-tool code-graph surface
   - CocoIndex-seed bridge model
   - 1-hop working-set expansion default
   - late-fusion compaction strategy
   - integrated-server architecture

   What still needs proof in code:

   - parser quality and error rates on this repo, especially Python and Shell
   - real graph build/query timings and DB size on the actual workspace
   - seed-to-node resolution accuracy for CocoIndex spans
   - exact optional-edge policy for `tested_by` and `configures`
   - freshness thresholds for "warn", "repair", and "serve stale"
   - evaluation fixtures for graph-routing and compaction quality

4. The MVP scope should stay deliberately structural and narrower than the full research surface.

   Code graph MVP:

   - Languages: JavaScript, TypeScript, Python, Shell
   - Nodes: file/module, function, method, class, conservative test/config symbols when reliable
   - Edges: `CONTAINS`, `CALLS`, `IMPORTS`, ownership/definition relation
   - Operations: `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`
   - Expansion radius: 1-hop by default

   CocoIndex bridge MVP:

   - accept normalized file-range seeds
   - resolve to exact symbol, enclosing symbol, or file anchor
   - expand bounded structural neighbors
   - emit compact structural context plus provenance and freshness

   Out of MVP:

   - full semantic search inside the graph
   - deep cross-language symbol chains
   - full hierarchy/reference coverage as a hard requirement
   - general-purpose graph analytics

5. The main unmitigated risks are operational and quality risks, not "should we build this at all?" risks.

   Highest-risk items:

   - parser-quality variance across grammars
   - seed-to-node ambiguity for CocoIndex spans
   - mixed-freshness honesty when one lane is stale and the other is fresh
   - neighborhood explosion during compaction
   - missing benchmark/evaluation harness
   - branch-switch and large-merge rebuild behavior

   Best mitigations already identified by research:

   - parser-health flags
   - 1-hop default expansion
   - independent semantic/structural freshness states
   - late fusion under one outer budget
   - degrade-don't-fail fallback behavior

6. The implementation-size estimate is now tight enough to plan staffing and sequencing.

   Estimated LOC for the graph track:

   - Phase 008: 300-420 LOC
   - Phase 009: 220-320 LOC
   - Phase 010: 330-460 LOC
   - Phase 011: 200-300 LOC

   Rollup:

   - Structural graph MVP only (008-010): about 850-1,200 LOC
   - Graph MVP plus compaction integration (008-011): about 1,050-1,500 LOC

   Excluded from that estimate:

   - broad documentation alignment
   - full validation matrix
   - release-hardening sweeps across phases 005-007

7. The code graph should be integrated into the existing Spec Kit Memory MCP server, not shipped as a separate MCP server.

   Recommended shape:

   - same MCP server process
   - same orchestration tiering model
   - separate storage file: `code-graph.sqlite`
   - separate tool family:
     - `code_graph_scan`
     - `code_graph_status`
     - `code_graph_query`
     - `code_graph_context`

   Why this is the right boundary:

   - research already places code graph beside memory search inside the same orchestrator
   - the current server already owns the response envelope, token-budget patterns, and routing architecture
   - a separate server would add transport, deployment, and startup complexity without solving a real v1 problem

   CocoIndex remains external and independent; the code graph stays integrated.

8. Current repo state shows the design is ready but the implementation has not started for the code-graph track.

   Verified live gaps:

   - resume command YAML still omits `profile: "resume"` in both auto and confirm flows
   - planned Claude hook scripts under `scripts/hooks/claude/` do not exist yet
   - repo `.claude/settings.local.json` exists, but it currently contains env/permissions only, not hook registration
   - current `graph` channel is still the causal-memory graph, not a structural code graph
   - no `code_graph_scan`, `code_graph_status`, `code_graph_query`, or `code_graph_context` surfaces exist in the repo yet

   So the correct readiness reading is:

   - research-ready: yes
   - packet-ready: yes
   - transport-foundation partially ready: yes
   - code-graph implementation started: no

9. Readiness scorecard: hook transport is build-ready, the structural graph is design-ready, and compaction fusion is concept-ready but validation-light.

   | Component | Score (1-5) | Rationale |
   |---|---:|---|
   | Resume-format fix | 5 | Trivial change, defect already verified, no design ambiguity |
   | Phase 001 PreCompact + Phase 002 SessionStart transport | 4 | Contract is clear, existing auto-surface primitives already exist |
   | Phase 004 cross-runtime fallback | 3 | Direction is clear, but runtime-specific behavior still needs implementation proof |
   | Phase 003 Stop hook + token tracking | 3 | Schema and parser direction are ready, but no runtime wiring exists yet |
   | Phase 008 structural indexer | 4 | Architecture is mature and simplified by DR-010 |
   | Phase 009 storage + exact structural query surface | 4 | Tool shape and schema are already well specified |
   | Phase 010 `code_graph_context` + CocoIndex bridge | 3 | Strong design, but seed-resolution quality still needs proof |
   | Phase 011 working-set + 3-source compaction merge | 3 | Strategy is solid, but it has the most moving parts and benchmark risk |
   | Full release hardening (005-007) | 2 | Known work items exist, but the implementation surface is still absent |

## Evidence

- Root packet architecture and status:
  - `spec.md:40-46`
  - `spec.md:84-113`
  - `plan.md:11-33`
  - `plan.md:35-47`
  - `plan.md:48-58`
  - `plan.md:77-106`
  - `plan.md:130-150`
- Decision-level contract for CocoIndex vs code graph and phases 008+:
  - `decision-record.md:69-75`
  - `decision-record.md:94-118`
- Unified research synthesis:
  - `research/research.md:17-30`
  - `research/research.md:56-70`
  - `research/research.md:123-136`
  - `research/research.md:300-308`
  - `research/research.md:320-339`
  - `research/research.md:392-401`
  - `research/research.md:472-516`
- Segment 5 refinement inputs:
  - `research/iterations/iteration-050.md`
  - `research/iterations/iteration-051.md`
  - `research/iterations/iteration-052.md`
  - `research/iterations/iteration-053.md`
  - `research/iterations/iteration-054.md`
- Current repo-state verification:
  - `checklist.md:5-42`
  - `007-testing-validation/spec.md:12-18`
  - `007-testing-validation/spec.md:31-40`
  - `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:73-81`
  - `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:138-141`
  - `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml:73-84`
  - `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml:182-185`
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:77-79`
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:245-248`
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:327-337`
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:955-962`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:4-18`
  - `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:39-44`
  - `.claude/settings.local.json:1-14`
  - repo sweeps on 2026-03-30:
    - `find .opencode/skill/system-spec-kit/scripts -path '*claude*'` returned no hook script files
    - `rg "code_graph_scan|code_graph_query|code_graph_context|code_graph_status"` returned no matches

## New Information Ratio

0.49

## Novelty Justification

This is not a new-architecture iteration. The novel value comes from converting the segment-5 research into an execution-grade readiness call and checking that call against the live repo. The key additive outcomes are: a concrete 008-011 phase map inside the existing packet, a narrowed MVP boundary, a direct answer on integrated-vs-separate MCP server placement, a realistic LOC budget, and a corrected readiness score grounded in what is actually present or absent in the tree today.

## Recommendations

1. Treat the `/spec_kit:resume` `profile: "resume"` fix as the first unblocker and land it before any graph work.
2. Start 008-010 inside this packet, not in a new root spec folder.
3. Keep the graph purely structural; do not re-open embeddings or semantic indexing inside the graph.
4. Integrate the graph into the existing Spec Kit Memory MCP server, but keep `code-graph.sqlite` as a separate storage subsystem.
5. Use four child specs for the graph track: 008 indexer, 009 storage/query, 010 bridge/context, 011 compaction integration.
6. Default all graph-driven expansion to 1-hop and require explicit proof before broadening radius or edge vocabulary.
7. Defer broad release-hardening work until 008-010 exist in code; otherwise the team will be polishing a surface that is still hypothetical.
8. Create a small benchmark and evaluation harness as part of 011 or a follow-on 012 before calling the graph-aware compaction path production-ready.

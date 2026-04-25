# Iteration 009: Adopt, Adapt, Reject, Defer Matrix

## Focus

Turn the evidence into adoption decisions across Code Graph, Memory causal graph, and Skill Graph.

## Actions Taken

- Reviewed all prior iteration findings.
- Classified each candidate as Adopt, Adapt, Reject, or Defer.
- Separated direct implementation candidates from design inspiration.

## Findings

- Adapt: Static phase DAG with explicit deps, timing, and phase-scoped failures for Public Code Graph. Evidence is strong and runtime fit is good. [SOURCE: external/gitnexus/src/core/ingestion/pipeline-phases/runner.ts:147]
- Adapt: Edge metadata fields for confidence, reason, and evidence traces. Public can use SQLite JSON metadata first, then promote columns if query demand appears. [SOURCE: external/ARCHITECTURE.md:462] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:86]
- Adapt: `impact`, `detect_changes`, `route_map`, `tool_map`, `shape_check`, and `api_impact` concepts, but with Public-specific unknown-coverage and untracked-file handling. [SOURCE: external/gitnexus/src/mcp/tools.ts:221] [SOURCE: external/gitnexus/src/mcp/tools.ts:400]
- Reject direct copy: rename apply behavior, because range-safe application is required for Public. [SOURCE: external/gitnexus/src/mcp/local/local-backend.ts:2313]
- Adapt: Contract Registry for cross-repo Code Graph and capability-contract Skill Graph, but require explicit group member selection for impact. [SOURCE: external/gitnexus/src/mcp/resources.ts:88]
- Defer: LadybugDB storage migration, embeddings, web UI parity, and generated AI skills until Public has measured bottlenecks or concrete UX need.

## Questions Answered

- Partially answered: the decision matrix is complete; follow-up packet sequencing remains.

## Questions Remaining

- Which implementation packet should happen first: Code Graph phase DAG/edge metadata, impact/detect changes, route/tool maps, memory evidence links, or Skill Graph contracts?

## Ruled Out

- Copying source wholesale.
- Migrating storage before measuring Public SQLite limitations.
- Allowing impact tools to infer unsafe group defaults.

## Dead Ends

- One giant follow-up packet; the scope crosses too many systems and would be hard to validate.

## Sources Consulted

- external/gitnexus/src/core/ingestion/pipeline-phases/runner.ts:147
- external/ARCHITECTURE.md:462
- .opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:86
- external/gitnexus/src/mcp/tools.ts:221
- external/gitnexus/src/mcp/tools.ts:400
- external/gitnexus/src/mcp/local/local-backend.ts:2313
- external/gitnexus/src/mcp/resources.ts:88

## Reflection

- What worked and why: The matrix forced attractive ideas to pass owner, evidence, and runtime-fit checks.
- What did not work and why: Direct adoption rarely survived source inspection.
- What I would do differently: Start follow-up specs from the matrix rows, not from GitNexus feature names.

## Recommended Next Focus

Propose concrete follow-up implementation packets and converge.

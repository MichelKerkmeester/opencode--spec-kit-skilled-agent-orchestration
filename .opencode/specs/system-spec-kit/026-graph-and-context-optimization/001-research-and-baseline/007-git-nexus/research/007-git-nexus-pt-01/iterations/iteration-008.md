# Iteration 008: Skill Graph and Skill Advisor Fit

## Focus

Evaluate whether GitNexus tool/resource/process concepts can improve Skill Graph and Skill Advisor routing evidence.

## Actions Taken

- Read the Public skill graph compiler, graph-causal scoring lane, and scorer fusion.
- Compared existing skill graph edge vocabulary with GitNexus Tool/Process/Contract concepts.
- Folded sidecar findings on Tool nodes and HANDLES_TOOL edges.

## Findings

- Public Skill Graph already has explicit skill edge types: `depends_on`, `enhances`, `siblings`, `conflicts_with`, and `prerequisite_for`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:42]
- Skill Advisor already propagates graph-causal scores across skill graph edges with per-edge multipliers and bounded depth/breadth. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/graph-causal.ts:12]
- Scorer fusion combines explicit, lexical, derived, semantic, and graph-causal lanes; GitNexus-style graph evidence should feed the graph lane, not bypass it. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:115]
- GitNexus Tool nodes and HANDLES_TOOL edges offer a direct model for skill-to-tool and command-to-handler coverage. [SOURCE: external/gitnexus/src/core/ingestion/pipeline-phases/tools.ts:77]
- GitNexus Contract Registry suggests a future Skill Graph "capability contract" layer: skills provide and consume capabilities, hooks, commands, MCP tools, or runtime surfaces, with stale/unknown status exposed as resources.

## Questions Answered

- Which GitNexus tool/resource/agent affordances can inform Skill Graph or Skill Advisor routing evidence?

## Questions Remaining

- Whether capability contracts should be generated from graph-metadata.json, derived source scans, command manifests, or all three.

## Ruled Out

- Adding a separate Skill Advisor scoring lane for GitNexus-style evidence; the existing graph_causal lane is the right owner.

## Dead Ends

- Treating skill descriptions as enough for routing. GitNexus shows that entrypoint and handler links make graph evidence more useful than prose alone.

## Sources Consulted

- .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:42
- .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/graph-causal.ts:12
- .opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:115
- external/gitnexus/src/core/ingestion/pipeline-phases/tools.ts:77
- external/gitnexus/src/mcp/resources.ts:88

## Reflection

- What worked and why: Mapping GitNexus concepts onto existing Skill Advisor lanes avoided unnecessary new scoring machinery.
- What did not work and why: "Skill Graph" is still broader than one compiler output; capability contracts need a proper schema.
- What I would do differently: Inventory commands/hooks/tools before designing contract rows.

## Recommended Next Focus

Synthesize Adopt/Adapt/Reject/Defer decisions.

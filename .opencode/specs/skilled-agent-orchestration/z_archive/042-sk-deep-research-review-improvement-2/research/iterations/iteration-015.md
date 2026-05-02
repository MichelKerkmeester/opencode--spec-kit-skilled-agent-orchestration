# Iteration 15: D5 Structural Tool Routing Gap

## Focus
This pass stayed on D5 and compared the deep-research/deep-review agent prompts that advertise Code Graph routing against the actual skill metadata, command docs, and auto-YAML loop wrappers that drive live iterations. The goal was to determine whether `code_graph_query`, `code_graph_context`, or `deep_loop_graph_convergence` are expected by the published loop contracts but never made available or called on the visible runtime path.

## Findings
- The Code Graph routing promise is present in the agent prompts, but only there in the inspected loop surfaces: `@deep-research` says to route structural navigation through `code_graph_query`/`code_graph_context` at `.opencode/agent/deep-research.md:442`, and `@deep-review` repeats the same instruction at `.opencode/agent/deep-review.md:572`.
- The command docs do not carry that structural-routing contract forward. Their "Code Context Bootstrap" sections tell operators to use only CocoIndex before starting the loop, at `.opencode/command/spec_kit/deep-research.md:203` and `.opencode/command/spec_kit/deep-review.md:239`; neither command doc mentions `code_graph_query`, `code_graph_context`, or `deep_loop_graph_convergence`.
- The executable auto-YAML wrappers also omit structural graph tools from the live LEAF-tool budget. Deep research exposes `[Read, Write, Edit, Bash, Grep, Glob, WebFetch, mcp__cocoindex_code__search]` at `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:72`, and deep review exposes `[Read, Write, Edit, Bash, Grep, Glob, mcp__cocoindex_code__search]` at `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:76`; neither wrapper provisions `code_graph_query`, `code_graph_context`, or `deep_loop_graph_convergence`.
- The live wrapper path after each iteration is still "emit optional `graphEvents`, then run `reduce-state.cjs`," not "call structural graph tools before convergence." The deep-research workflow says to include optional `graphEvents` at `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:326` and then runs `node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs` at `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:331`; deep review mirrors that pattern at `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:436`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:437`, and `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:473`.
- The skill-level contracts undercut the agent-doc promise further. `sk-deep-research`'s `allowed-tools` list includes memory tools but no CocoIndex or Code Graph at `.opencode/skill/sk-deep-research/SKILL.md:4`, while `sk-deep-review` includes CocoIndex but still no structural graph tools at `.opencode/skill/sk-deep-review/SKILL.md:4`; its integration guidance likewise documents only semantic search via `mcp__cocoindex_code__search` at `.opencode/skill/sk-deep-review/SKILL.md:476`.
- Within the inspected deep-research/deep-review skill, command, and agent materials, the only literal `code_graph_query`/`code_graph_context` mentions I found were the two agent-doc routing lines at `.opencode/agent/deep-research.md:442` and `.opencode/agent/deep-review.md:572`. That is enough evidence to close the remaining D5 question: missing structural MCP tool calls are not just absent from live iterations, they are not provisioned anywhere except the agent prompt prose.

## Ruled Out
- A command-doc requirement to invoke structural graph tools before or during iterations; the inspected command surfaces only bootstrap CocoIndex.
- A wrapper-level `deep_loop_graph_convergence` step on the visible research/review iteration path; the cited YAML paths go from iteration output to reducer execution without a graph-convergence call.

## Dead Ends
- I did not inspect hidden executor internals outside the published skill, command, agent, and auto-YAML surfaces, so the negative claim stays scoped to the visible live iteration materials that actually define the LEAF-agent budget and workflow.

## Sources Consulted
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:48-52`
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-014.md:1-33`
- `.opencode/agent/deep-research.md:437-442`
- `.opencode/agent/deep-review.md:567-572`
- `.opencode/command/spec_kit/deep-research.md:201-203`
- `.opencode/command/spec_kit/deep-review.md:237-239`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:72`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:326-331`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:76`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:436-473`
- `.opencode/skill/sk-deep-research/SKILL.md:1-4`
- `.opencode/skill/sk-deep-review/SKILL.md:1-4`
- `.opencode/skill/sk-deep-review/SKILL.md:474-479`

## Reflection
- What worked and why: Comparing agent prompts against the concrete tool allowlists and auto-YAML wrapper steps made the contract gap visible very quickly.
- What did not work and why: Negative evidence still had to be scoped carefully, because the published wrappers can prove what the live loop exposes without proving the total absence of any hidden executor shortcut elsewhere.
- What I would do differently: I would next rotate back to D3 and test the shared coverage-graph namespace boundary directly, since D5's remaining prompt-vs-runtime routing question is now closed.

## Recommended Next Focus
Rotate to the remaining D3 namespace-isolation question and trace how `sk-improve-agent` persists `loop_type: "improvement"` into the shared coverage-graph store versus how the research/review loops namespace their own writes. The most productive next pass is to read `sk-improve-agent/scripts/mutation-coverage.cjs` beside the shared coverage-graph DB/query handlers and confirm whether any query or convergence surface can accidentally co-mingle improvement-session nodes with research/review sessions.

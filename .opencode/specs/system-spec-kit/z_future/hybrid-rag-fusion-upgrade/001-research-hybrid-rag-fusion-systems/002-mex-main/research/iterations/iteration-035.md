# Iteration 035: COMPATIBILITY ANALYSIS

## Focus
COMPATIBILITY ANALYSIS: How do the adopted patterns interact with our existing CocoIndex, code-graph, and MCP tool stack? Conflict analysis.

## Findings
### Finding 1: The integrity lane is compatible only if it stays separate from semantic and structural routing
- **Source**: `external/src/drift/checkers/path.ts`, `external/src/drift/checkers/edges.ts`, `external/src/drift/checkers/index-sync.ts`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts`, `opencode.json` [SOURCE: `external/src/drift/checkers/path.ts:8-67`; `external/src/drift/checkers/edges.ts:5-34`; `external/src/drift/checkers/index-sync.ts:6-68`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-44,639-665`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:700-815,891-927`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:97-125,157-195`; `opencode.json:10-59`]
- **What it does**: The adopted Mex slice is lexical and markdown-scoped: it checks referenced paths, frontmatter edges, and index/file consistency. Our stack already reserves different lanes for different question types: `memory_context` routes quick/focused/deep/resume retrieval into trigger or semantic search, the tool schema explicitly tells callers to prefer CocoIndex for concept search and `code_graph_query`/`code_graph_context` for structural questions, and the runtime wires those as separate MCP servers.
- **Why it matters**: This is compatible with Public only if integrity remains a fourth, advisory surface rather than being folded into `memory_context`, `memory_search`, or graph queries. If we mix lexical doc-drift into semantic or structural retrieval, we blur authority boundaries and make operators guess whether a bad result came from documentation drift, stale graph state, or weak retrieval.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: The guided maintenance surface fits only as a planner over existing authority boundaries
- **Source**: `external/src/cli.ts`, `external/src/sync/index.ts`, `external/src/sync/brief-builder.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts` [SOURCE: `external/src/cli.ts:28-57,86-101,122-161`; `external/src/sync/index.ts:29-209`; `external/src/sync/brief-builder.ts:7-158`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:94-124,143-156,194-209`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:419-470`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1187-1262,1273-1385`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:123-267`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:15-58`]
- **What it does**: Mex's `sync` command owns a detect -> brief -> execute -> recheck loop. Public already has the pieces, but with explicit authority boundaries: `session_bootstrap` diagnoses readiness and preferred routing, `memory_health` requires confirmation before repair actions, `memory_save` preserves non-mutating dry-run behavior, and graph/CocoIndex maintenance are explicit operations with their own handlers.
- **Why it matters**: The compatibility answer is yes, but only for a thin planner/wrapper. A guided surface can safely aggregate findings and next steps, or export a repair brief, but it should not become a new execution authority that silently writes memories, repairs indexes, or bypasses confirmation semantics already enforced by the underlying MCP tools.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 3: The best integration seam is the existing CocoIndex-to-code-graph bridge, not a new integrity-backed index
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts`, `opencode.json` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:663-706`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:107-165`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:10-40`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:15-58`; `opencode.json:40-59`]
- **What it does**: Public already has a first-class chain from semantic search to structural expansion: `code_graph_context` accepts CocoIndex results as seeds, normalizes them into graph anchors, and returns structural neighborhoods, while CocoIndex status/reindex stay explicit maintenance utilities. That means the stack already has a clean place to combine what looks relevant semantically with what is structurally connected.
- **Why it matters**: Any future integrity work should plug into this existing bridge as extra hints, annotations, or planner inputs, not as a rival index or alternate search path. The conflict to avoid is building a second discovery subsystem for documentation drift when the runtime already has a better separation: lexical integrity for docs truthfulness, CocoIndex for semantic recall, and code graph for structural expansion.
- **Recommendation**: NEW FEATURE
- **Impact**: high
- **Source strength**: primary

### Finding 4: Post-commit and auto-fix flows are compatible only if they remain lexical and non-indexing by default
- **Source**: `external/src/cli.ts`, `external/src/sync/index.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts` [SOURCE: `external/src/cli.ts:30-57,123-157`; `external/src/sync/index.ts:40-77,155-209`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:170-180,192-205,236-267`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:32-58`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:31-39`]
- **What it does**: Mex can afford `check`, `check --fix`, and `watch` because its drift logic is cheap lexical work. Public's graph/index maintenance is not in that category: `code_graph_scan` can force a full reindex when git HEAD changes, and `ccc_reindex` is an explicit incremental/full maintenance command with a bounded timeout.
- **Why it matters**: A drift hook or wrapper is compatible with our stack only if it stays in the lexical lane by default. The main conflict is hidden maintenance work: if a commit hook or auto-fix flow also triggers code-graph or CocoIndex refresh, a cheap documentation-truthfulness feature turns into a potentially slow structural/indexing workflow with very different failure modes.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 5: A future `spec-kit doctor` must preserve the native-vs-external MCP split instead of flattening the tool stack
- **Source**: `opencode.json`, `.utcp_config.json`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` [SOURCE: `opencode.json:10-59`; `.utcp_config.json:8-110`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:699-706,739-756`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:113-124,143-156,194-209`]
- **What it does**: The runtime already distinguishes native MCP authority from external integrations. `opencode.json` boots native `spec_kit_memory`, `cocoindex_code`, and `code_mode`, while `.utcp_config.json` holds external/manual MCP templates like Chrome DevTools, ClickUp, Figma, and GitHub behind the `code_mode` indirection. `session_bootstrap` likewise keeps guidance native and advisory, nudging callers toward the right internal tool instead of collapsing everything into one opaque command.
- **Why it matters**: This makes a broad, all-in-one doctor command risky if it tries to flatten the stack. The compatible design is a native Spec Kit planner that reports integrity, readiness, and suggested next actions, then hands off to explicit internal tools first and to external MCPs only as second-order, opt-in actions. Otherwise a docs-integrity feature inherits unrelated transport, credential, and orchestration risk.
- **Recommendation**: NEW FEATURE
- **Impact**: medium
- **Source strength**: primary

## Sources Consulted
- `external/src/drift/checkers/path.ts:8-67`
- `external/src/drift/checkers/edges.ts:5-34`
- `external/src/drift/checkers/index-sync.ts:6-68`
- `external/src/cli.ts:28-57,86-101,122-161`
- `external/src/sync/index.ts:29-209`
- `external/src/sync/brief-builder.ts:7-158`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-44,639-706,739-756`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:700-815,891-927`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:94-124,143-156,194-209`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:419-470`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1187-1385`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:97-195`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:123-267`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:10-40`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts:15-58`
- `opencode.json:10-59`
- `.utcp_config.json:8-110`

## Assessment
- **New information ratio**: 0.19
- **Questions addressed**: how the adopted integrity lane fits beside CocoIndex and code graph; where a guided maintenance surface can safely sit; whether integrity should introduce another index; what conflicts appear if hooks or auto-fix touch graph/vector maintenance; how the native and external MCP layers constrain a future `spec-kit doctor`
- **Questions answered**: the integrity lane is compatible only as a separate lexical surface; the guided maintenance surface is compatible only as a planner over existing tools; the right integration seam is the existing CocoIndex-to-code-graph bridge; commit-time automation must stay non-indexing by default; and any future doctor surface must preserve the native-vs-external MCP split
- **Novelty justification**: prior iterations identified what to adopt and how to roll it out safely; this pass adds the missing stack-level compatibility map showing exactly where those patterns do and do not fit inside Public's current retrieval, graph, and MCP authority boundaries

## Ruled Out
- Folding lexical integrity results into `memory_context`, `memory_search`, or `code_graph_query`, because Public already assigns those tools different responsibilities
- Letting a guided surface auto-run `memory_save`, `memory_health` repair, `code_graph_scan`, or `ccc_reindex` as implicit side effects, because that would bypass or blur existing contracts
- Building a second discovery/index subsystem for documentation drift, because the current CocoIndex plus code-graph bridge already covers semantic-plus-structural discovery better than Mex's markdown tooling ever tried to
- Running code-graph or CocoIndex maintenance automatically from a post-commit drift hook, because those operations are explicit, potentially expensive maintenance steps in Public rather than cheap lexical checks
- Flattening native Spec Kit tools and external MCP integrations into one opaque `doctor` command, because that would combine unrelated authority and transport risk into the first release

## Reflection
- **What worked**: re-reading the adopted Mex patterns first, then tracing the exact local tool schemas and handler boundaries for CocoIndex, code graph, session bootstrap, memory save, and health, made the compatibility picture specific instead of architectural hand-waving
- **What did not work**: this packet is not using the canonical deep-research reducer state files described by the current skill docs, and several existing iteration artifacts are noisy or partially duplicated, so continuity had to come from direct source inspection rather than clean loop state
- **What I would do differently**: turn each compatibility rule into a routing/authority acceptance matrix next, with one allowed side effect, one forbidden side effect, and one explicit fallback path per subsystem

## Recommended Next Focus
Define the implementation-facing compatibility contract for the first rollout slice:
1. exact routing rules for `integrity -> wrapper hints -> explicit internal tool`
2. the only situations where `code_graph_scan` or `ccc_reindex` may be suggested versus auto-run
3. the planner-only versus execution-enabled boundary for a future `spec-kit doctor`
4. how integrity findings should annotate CocoIndex/code-graph results without becoming a competing search/index layer
```


Total usage est:        1 Premium request
API time spent:         6m 36s
Total session time:     7m 0s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  2.2m in, 31.6k out, 2.1m cached, 10.4k reasoning (Est. 1 Premium request)

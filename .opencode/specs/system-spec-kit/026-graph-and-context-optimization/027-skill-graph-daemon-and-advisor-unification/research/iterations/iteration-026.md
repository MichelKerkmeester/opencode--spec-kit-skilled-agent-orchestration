# Iteration 026 — Track D: D3 — MCP-tool surface

## Question
What MCP tool surface should Phase 027 expose for the unified skill advisor, using existing `mcp_server/tools/*.ts` definitions, tool schema conventions, and proposed `advisor_*` tool signatures with Zod schemas?

## Evidence Collected
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/research/deep-research-strategy.md:48` → Iteration 26 is assigned to Track D, "D3 MCP-tool surface."
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/research/deep-research-strategy.md:113` → D3 evidence requires probing "`mcp_server/tools/*.ts` (existing MCP tool definitions). Tool schema conventions. Proposed `advisor_*` tool signatures with Zod schemas."
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/research/deep-research-config.json:60` → Config confirms iteration 26 maps to Track D, D3, "MCP-tool surface."
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/research/deep-research-state.jsonl:27` → Iteration 25 completed D2 with `adopt_now`, so D3 can build on the adopted MCP-native migration target.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-025.md:86`-`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/research/iterations/iteration-025.md:88` → D2 adopted `tools/advisor-tools.ts`, `handlers/skill-advisor/{recommend,status,validate,bench?}.ts`, and `lib/skill-advisor/*` as the target layout, with the Python CLI retained as a compatibility shim.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:27`-`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:34` → Public MCP tool definitions are normalized as `{ name, description, inputSchema, outputSchema? }`.
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:849`-`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:900` → `TOOL_DEFINITIONS` is the canonical ordered registration list, grouped by orchestration/core/discovery/mutation/lifecycle/analysis/maintenance/graph layers.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:909`-`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:911` → `ListToolsRequestSchema` exposes `TOOL_DEFINITIONS` directly.
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:917`-`.opencode/skill/system-spec-kit/mcp_server/context-server.ts:931` → `CallToolRequestSchema` extracts name/arguments and relies on `tools/*.ts` dispatch modules for per-tool Zod validation.
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:48`-`.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:52` → Central dispatch currently schema-validates code graph, skill graph, and coverage graph families before handler dispatch.
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:58`-`.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:83` → Tool modules are composed through `ALL_DISPATCHERS`, with the first dispatcher owning the matched `TOOL_NAMES` set.
- `.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts:15`-`.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts:21` → Skill graph tools use a dedicated `TOOL_NAMES` set for `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, and `skill_graph_validate`.
- `.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts:50`-`.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts:67` → Skill graph dispatch maps each public name to a handler and keeps tool-level checks thin.
- `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:60`-`.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:73` → Memory tools use the same `TOOL_NAMES` family pattern and include both full and simplified surfaces, such as `memory_search` and `memory_quick_search`.
- `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:78`-`.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:106` → Memory dispatch validates each runtime argument set with `validateToolArgs()` before calling handlers.
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:1`-`.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:5` → Tool input schemas are centralized strict Zod schemas, with strictness controlled by `SPECKIT_STRICT_SCHEMAS`.
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:26`-`.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:30` → `getSchema()` wraps `z.object()` and returns either strict or passthrough schemas by environment.
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:487`-`.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:504` → Skill graph Zod schemas show the current pattern for optional path overrides, enum query types, bounded numeric parameters, and empty-object status/validate tools.
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:573`-`.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:627` → `TOOL_SCHEMAS` is the runtime validation registry for all current MCP tools.
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:629`-`.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:677` → `ALLOWED_PARAMETERS` mirrors tool schemas and drives validation error messages.
- `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:159`-`.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:208` → Tests assert a complete expected MCP tool list, currently 47 tools, including skill graph tools but no `advisor_*` tools.
- `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:581`-`.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:650` → Skill graph schema tests require public/runtime acceptance cases and rejection of unsupported/unknown parameters.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:40`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:76` → The existing hook-facing advisor result already includes runtime, max tokens, threshold config, status, freshness, brief, recommendations, diagnostics, metrics, generatedAt, and shared payload.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:331`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:468` → `buildSkillAdvisorBrief()` applies policy, freshness, prompt cache, threshold filtering, rendering, diagnostics, metrics, shared payload creation, and fail-open behavior.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:13`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:20` → The recommendation shape is currently `{ skill, kind?, confidence, uncertainty, passes_threshold?, reason? }`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:63`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:76` → Advisor thresholds are confidence threshold, uncertainty threshold, confidence-only mode, and show-rejections mode.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:50`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:59` → Advisor freshness returns state, generation, source signature, skill fingerprints, fallback mode, probed timestamp, and diagnostics.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:223`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:263` → Freshness distinguishes absent, stale JSON fallback, missing SQLite, source-newer-than-graph, and live SQLite states.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:8`-`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:18` → Advisor prompt cache defines TTL, max-token bounds, and threshold config fields already needed by a public recommendation tool.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:6`-`.opencode/skill/skill-advisor/scripts/skill_advisor.py:20` → The standalone CLI contract supports prompt analysis, JSON recommendations, stdin, health, validation, threshold, and confidence-only modes.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2634`-`.opencode/skill/skill-advisor/scripts/skill_advisor.py:2705` → CLI health returns status, skill counts, command bridge counts, cache/source metadata health, graph source/path, topology warnings, and inventory parity.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2718`-`.opencode/skill/skill-advisor/scripts/skill_advisor.py:2734` → Single-prompt analysis runs `analyze_request()` and filters via confidence, uncertainty, confidence-only, and show-rejections settings.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2737`-`.opencode/skill/skill-advisor/scripts/skill_advisor.py:2769` → Batch analysis already returns `{ prompt, recommendations }` objects and can use semantic hits when semantic mode is enabled.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2801`-`.opencode/skill/skill-advisor/scripts/skill_advisor.py:2828` → CLI arguments include prompt/stdin, health, validate-only, threshold, uncertainty, confidence-only, show-rejections, batch inputs, force-refresh, semantic mode, and precomputed semantic hits.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:5`-`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:22` → Current tests already exercise hook adapters, normalization, rendering, `AdvisorHookResult`, and `buildSkillAdvisorBrief()`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:64`-`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:120` → Subprocess tests assert strict JSON array parsing, stdin transport, invalid-shape failure, parse failure, and nonzero-exit fail-open behavior.

## Analysis
The MCP surface should be adopted now as a small, explicit `advisor_*` family that follows the existing graph-tool pattern. Existing MCP tools have public definitions in `tool-schemas.ts`, are exposed directly by `ListToolsRequestSchema`, and are dispatched through `tools/*.ts`; the new family should therefore add `tools/advisor-tools.ts`, include it in `ALL_DISPATCHERS`, add public `ToolDefinition`s to `TOOL_DEFINITIONS`, and add matching strict runtime Zod schemas plus `ALLOWED_PARAMETERS` entries. This keeps the advisor surface visible to MCP clients without embedding advisor logic into `context-server.ts`.

The right public names are `advisor_recommend`, `advisor_status`, and `advisor_validate`. `advisor_recommend` should be the MCP-native equivalent of the current Gate 2 prompt analyzer and hook brief producer: input `{ prompt: string; runtime?: 'claude'|'gemini'|'copilot'|'codex'; maxTokens?: 1..120; confidenceThreshold?: 0..1; uncertaintyThreshold?: 0..1; confidenceOnly?: boolean; showRejections?: boolean; includeBrief?: boolean; includeSharedPayload?: boolean; semanticHits?: Array<{ path: string; score: number; source?: string }>; forceRefresh?: boolean }`, returning the existing `AdvisorHookResult`-style envelope with `status`, `freshness`, `brief`, `recommendations`, `diagnostics`, `metrics`, `generatedAt`, and optional `sharedPayload`. `advisor_status` should be read-only diagnostics over the advisor runtime and graph readiness: input `{ includeSkills?: boolean; includeCommandBridges?: boolean; includeTopologyWarnings?: boolean; includeInventoryParity?: boolean; includeCache?: boolean }`, returning the union of current freshness and CLI health fields. `advisor_validate` should be the strict graph/advisor validation tool: input `{ strictTopology?: boolean; includeWarnings?: boolean; skillsRoot?: string }`, returning validation status, graph source/path, topology warnings, inventory parity, and recovery hints.

The proposed Zod additions should mirror current conventions rather than creating bespoke validators:

```ts
const advisorRuntimeEnum = z.enum(['claude', 'gemini', 'copilot', 'codex']);
const advisorSemanticHitSchema = z.object({
  path: pathString(1),
  score: boundedNumber(0, 1),
  source: z.string().optional(),
});
const advisorRecommendSchema = getSchema({
  prompt: z.string().min(1).max(10000),
  runtime: advisorRuntimeEnum.optional(),
  maxTokens: intRange(1, 120).optional(),
  confidenceThreshold: boundedNumber(0, 1).optional(),
  uncertaintyThreshold: boundedNumber(0, 1).optional(),
  confidenceOnly: z.boolean().optional(),
  showRejections: z.boolean().optional(),
  includeBrief: z.boolean().optional(),
  includeSharedPayload: z.boolean().optional(),
  semanticHits: z.array(advisorSemanticHitSchema).max(25).optional(),
  forceRefresh: z.boolean().optional(),
});
const advisorStatusSchema = getSchema({
  includeSkills: z.boolean().optional(),
  includeCommandBridges: z.boolean().optional(),
  includeTopologyWarnings: z.boolean().optional(),
  includeInventoryParity: z.boolean().optional(),
  includeCache: z.boolean().optional(),
});
const advisorValidateSchema = getSchema({
  strictTopology: z.boolean().optional(),
  includeWarnings: z.boolean().optional(),
  skillsRoot: optionalPathString(),
});
```

This deliberately avoids adding `advisor_batch` in the first MCP surface even though the Python CLI supports batch mode. Batch scoring is useful for measurement and tuning, but it broadens the public MCP contract and can wait behind D4/D7 once the native runtime and compatibility matrix are settled. The adopted-now surface covers the shipped hook path, health/readiness, and strict validation, which are the surfaces needed for MCP consolidation while preserving current Phase 020-026 graph architecture.

## Verdict
- **Call:** adopt now
- **Confidence:** high
- **Rationale:** Adopt `advisor_recommend`, `advisor_status`, and `advisor_validate` now as a dedicated MCP tool family with strict Zod schemas, public `ToolDefinition`s, dispatcher registration, and tests. Defer batch/benchmark tools until D4/D7 confirm the runtime port and compatibility boundary.

## Dependencies
D1, D2, D4, D5, D7, D8, B3, C4, C6

## Open follow-ups
D4 must decide whether `advisor_recommend` calls native TypeScript scoring immediately or temporarily wraps the existing subprocess runner. D5 should decide whether `advisor_status` shares cache/freshness primitives with broader MCP cache infrastructure. D7 must map CLI flags to MCP parameters and identify which old CLI modes remain as compatibility aliases. D8 should decide whether plugin bridge calls proxy to `advisor_recommend` or keep hook-only integration.

## Metrics
- newInfoRatio: 0.80
- dimensions_advanced: [D]

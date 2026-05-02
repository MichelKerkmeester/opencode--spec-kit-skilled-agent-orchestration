# Iteration 79: Verification of Q16 Findings from Iterations 059 and 063

## Focus
Verify whether the seven Q16 claims recorded in iterations 059 and 063 are present in the current implementation of `seed-resolver.ts`, `code-graph-db.ts`, `code-graph-context.ts`, and CocoIndex MCP registration/wrappers.

## Findings

### 1. Claim: near-exact seed tier with graduated confidence formula `0.95 - distance * 0.02`
**Status: FALSE (proposal only, not implemented).**

The current `resolveSeed()` implementation has only three fixed-resolution tiers:

- exact match on `file_path` + `start_line` with confidence `1.0`
- enclosing symbol range match with confidence `0.7`
- file anchor fallback with confidence `0.3` (or `0.1` when DB access fails)

There is no intermediate near-exact query using `ABS(start_line - ?)`, and no graduated confidence formula derived from line distance.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:168-239]

### 2. Claim: CocoIndex score propagation via blended confidence `resolution * 0.6 + coco * 0.4`
**Status: FALSE.**

`resolveCocoIndexSeed()` discards the CocoIndex `score` field. It converts the seed into a plain `{ filePath, startLine, endLine }` structure and delegates to `resolveSeed()`. As a result, final confidence comes entirely from the structural resolution tier and never blends in CocoIndex relevance.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:19-25]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:73-80]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:168-239]

### 3. Claim: manual seed fuzzy name matching via LIKE prefix fallback
**Status: FALSE.**

`resolveManualSeed()` performs exact matching only: `SELECT * FROM code_nodes WHERE name = ?`, optionally constrained by `file_path` and `kind`. There is no `LIKE`, prefix fallback, or edit-distance logic. The subject fallback in `code-graph-context.ts` is also exact-only (`symbol_id = ? OR fq_name = ? OR name = ?`).

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:82-128]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:251-276]

### 4. Claim: stale-triggered auto-reindex using existing `computeFreshness()` + `isFileStale()`
**Status: FALSE as current behavior; helpers exist but are not wired into auto-reindex.**

`computeFreshness()` is read-only metadata generation. `buildContext()` calls it and returns freshness in response metadata, but never triggers `code_graph_scan` or `ccc_reindex`. `isFileStale()` is used only inside the scan handler to skip unchanged files during an already-running incremental scan. The current code therefore has freshness/staleness primitives, but no stale-triggered reindex behavior on read.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:47-118]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:163-177]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:171-177]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:47-53]

### 5. Claim: three hybrid query patterns are implemented (semantic-first expansion, structural-first enrichment, dual-query merge)
**Status: FALSE as current implementation.**

`code_graph_context` supports three **graph expansion modes**: `neighborhood`, `outline`, and `impact`. It accepts precomputed seeds, including CocoIndex-originated seeds, then performs structural graph expansion only. It does not run CocoIndex searches internally, perform structural-first semantic enrichment, or execute dual-query merge logic. Those patterns remain research/design proposals rather than implemented behavior.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:12-23]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:47-118]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:179-249]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:660-693]

### 6. Claim: CocoIndex MCP exposes only `search`; all management is via Spec Kit Memory wrappers
**Status: TRUE, with one nuance.**

The native CocoIndex MCP server registered in `.mcp.json` runs `ccc mcp`. The CocoIndex skill documentation states that this MCP server exposes only one tool, `search`; `status`, `index`, and `reset` remain CLI-only. In this repository, management capabilities are surfaced to MCP consumers via the Spec Kit Memory wrappers `ccc_status`, `ccc_reindex`, and `ccc_feedback`.

Nuance: management still exists via CLI outside MCP, so the precise verified statement is: **for MCP consumers in this repo, management flows through the Spec Kit Memory wrappers rather than the native CocoIndex MCP server.**

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.mcp.json:22-29]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/SKILL.md:233-241]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:17-26]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:696-726]

### 7. Claim: missing composite index `(file_path, start_line)` is needed for near-exact performance
**Status: PARTIALLY VERIFIED.**

The schema currently lacks a composite index on `code_nodes(file_path, start_line)`. Existing `code_nodes` indexes cover `file_id`, `symbol_id`, `kind`, and `name`, but not the `(file_path, start_line)` access pattern used by `resolveSeed()` exact lookups.

What is verifiable from current code:

- the composite index is indeed missing
- current exact resolution already queries by `file_path` and `start_line`

What is **not** directly verifiable from current code:

- that the missing index is definitively "needed" for near-exact performance, because no near-exact tier exists yet and no benchmark or migration note demonstrates the performance requirement

So the absence of the index is factual, but the performance-necessity claim remains an architectural inference rather than implemented or measured behavior.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:18-68]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts:172-200]

## Synthesis

The prior Q16 research from iterations 059 and 063 mostly described **improvement proposals**, not live implementation. Of the seven claims under verification:

- **Confirmed:** 1 (`search`-only native CocoIndex MCP, with management exposed through wrappers)
- **Partially confirmed:** 1 (missing composite index exists, but "needed for performance" is not proven in live code)
- **Not implemented / false as current behavior:** 5 (near-exact tier, blended confidence, fuzzy manual matching, stale-triggered auto-reindex, and hybrid query execution)

This means the earlier work was directionally useful but should be treated as **design guidance**, not as a description of current shipped behavior.

## Ruled Out

- Treating the Q16 design proposals from iterations 059 and 063 as already implemented
- Inferring auto-reindex from the mere presence of `computeFreshness()` and `isFileStale()`
- Inferring hybrid CocoIndex + graph search execution from seed acceptance alone

## Dead Ends

None. The target files were sufficient to verify all seven claims.

## Sources Consulted

- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/mcp-coco-index/SKILL.md`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.mcp.json`

## Assessment

- New information ratio: 0.74
- Questions addressed: [Q16 verification]
- Questions answered: [Which Q16 claims from iterations 059 and 063 are implemented in current code]

## Reflection

- What worked and why: Reading the live implementation files in the exact resolution/data-flow order (`seed-resolver.ts` -> `code-graph-context.ts` -> `code-graph-db.ts` -> scan/wrapper/tool registration) made it straightforward to separate **implemented behavior** from **research proposals**. The wrapper/tool-schema cross-check was especially important for claim 6, where the native CocoIndex MCP and Spec Kit Memory wrapper layer differ.
- What did not work and why: Prior iteration summaries compressed proposed designs and current implementation into the same narrative, which made several claims sound already shipped. This verification pass had to re-ground each claim in code to avoid carrying proposal-language forward as fact.
- What I would do differently: Next time, label research findings more explicitly as `implemented`, `proposed`, or `speculative` inside the iteration itself to reduce later verification ambiguity.

## Recommended Next Focus

Continue Segment 7 verification by checking whether the Segment 6 implementation-roadmap claims for testing, performance, and error recovery match current code as closely as Q16 did here.

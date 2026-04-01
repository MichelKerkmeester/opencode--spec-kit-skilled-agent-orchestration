# Iteration 009: Context-Prime Agent Updates + Test Strategy

## Focus: Design the `context-prime` routing output so it reinforces CocoIndex vs Code Graph vs exact-search selection across runtimes, and define the unit, integration, and manual tests needed to verify end-to-end enforcement.

## Context-Prime Agent Design:
`context-prime` currently returns only `Session Context`, `System Health`, and `Recommended Next Steps`, and the `.opencode` and `.claude` versions are effectively identical. That makes it a good cross-runtime place to add one compact routing block without creating runtime-specific drift. [SOURCE: .opencode/agent/context-prime.md:22-133] [SOURCE: .claude/agents/context-prime.md:22-133]

The existing PrimePackage payload is too small for enforcement because it only carries `specFolder`, `currentTask`, `codeGraphStatus`, `cocoIndexAvailable`, and `recommendedCalls`. The routing design should therefore add a machine-readable `routingRules` object to PrimePackage, while the visible context-prime output should render only a compact human-readable subset. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:63-70] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:316-364]

Recommended PrimePackage extension:

```ts
interface PrimePackageRoutingRules {
  version: 'v1';
  summary: string;
  semanticRoute: 'cocoindex';
  structuralRoute: 'code_graph';
  exactRoute: 'rg_glob';
  bridgeRoute: 'cocoindex_to_code_graph_context';
  fallbackWhenGraphUnavailable: string;
  escapeHatch: string;
}
```

Recommended display contract in `context-prime` output:

```markdown
## Tool Routing
- **Semantic / intent discovery** -> CocoIndex
- **Structural / callers / imports / impact** -> Code Graph
- **Exact text / known path** -> rg/glob
- **Bridge** -> CocoIndex results can seed `code_graph_context`
- **Fallback** -> If code graph is stale/empty, prefer CocoIndex until `session_resume()` or `code_graph_scan`
```

The routing decision tree should be presented as a short, deterministic classifier rather than a prose paragraph. The repo already uses this semantic-vs-structural taxonomy in `ARCHITECTURE.md`, so the PrimePackage should mirror it instead of inventing new categories. [SOURCE: .opencode/skill/system-spec-kit/ARCHITECTURE.md:545-553]

Recommended decision-tree rendering:

```text
Need code search?
  exact text/path/symbol known -> rg / glob
  concept/meaning/"how does X work" -> CocoIndex
  callers/imports/dependencies/impact/outline -> code_graph_query / code_graph_context
  code graph stale or empty -> CocoIndex first, then session_resume / code_graph_scan
  semantic result needs structure -> feed CocoIndex result into code_graph_context
```

This design keeps the display under tight token pressure while preserving a richer `routingRules` object in `meta.sessionPriming.primePackage` for future reactive hinting and automated evaluation.

## Test Strategy:
### Unit tests for `buildServerInstructions()` routing section
1. Extend the startup harness tests in `tests/context-server.vitest.ts` so live `setInstructions()` assertions verify the new routing stanza appears alongside the existing memory-count text. Reuse the existing `T000l` pattern rather than introducing a new harness. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1278-1297]
2. Extend the Group 16 behavioral replica tests so the replica includes the routing section and asserts:
   - semantic language points to CocoIndex
   - structural language points to Code Graph
   - exact lookup language points to rg/glob
   - graph-unavailable fallback is present
   - existing stale-memory warning behavior is unchanged
3. Add a guard that the routing stanza remains compact, for example by asserting the routing-specific substring stays below a fixed character or token threshold.

### Unit tests for PrimePackage `routingRules` population
1. Add direct tests for the pure PrimePackage builder path in `hooks/memory-surface.ts`; today there are no focused tests for `buildPrimePackage()` or PrimePackage population. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:316-364] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests]
2. Cover these cases:
   - fresh graph + CocoIndex available -> normal semantic/structural/exact routing rules
   - stale graph -> fallback text points to CocoIndex plus `code_graph_scan`
   - empty graph -> same fallback, with no structural-first claim
   - CocoIndex unavailable -> semantic route marked unavailable or downgraded explicitly
   - missing `specFolder` -> resume recommendation still present, routingRules unchanged
3. Keep `recommendedCalls` as action suggestions, but assert that routing semantics live in `routingRules`, not in `recommendedCalls`.

### Integration test for hint injection
1. Extend the call-handler integration path already used by `T000i` so `primeSessionIfNeeded()` returns a PrimePackage with `routingRules`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1109-1156]
2. Assert that a successful first tool response includes:
   - `meta.sessionPriming.primePackage.routingRules`
   - a compact routing hint in `hints`, e.g. `Routing: semantic -> CocoIndex; structural -> Code Graph; exact -> rg/glob`
   - existing auto-surface metadata still intact
3. Add a negative case proving routing hints are not injected on error envelopes, matching the current `!result.isError` behavior. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:813-839]

### Manual test plan by runtime
Use the same three prompt classes in every runtime so the routing behavior is directly comparable:

1. **Semantic prompt**: `How does session priming work across runtimes?`
   - Expected first tool: CocoIndex
2. **Structural prompt**: `What functions call injectSessionPrimeHints?`
   - Expected first tool: Code Graph
3. **Exact prompt**: `Find buildServerInstructions in the repo`
   - Expected first tool: rg or glob
4. **Fallback prompt with stale/empty graph**: `What calls allocateBudget?`
   - Expected behavior: use CocoIndex first or recommend `session_resume()` / `code_graph_scan` instead of forcing Code Graph

Per-runtime execution:

- **Claude Code**: verify hook-capable startup or first-turn priming exposes the `Tool Routing` block early, then confirm the three prompt classes pick the correct first tool. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:25-28]
- **Codex CLI**: verify non-hook fallback still receives startup/server-instruction routing text and then chooses CocoIndex, Code Graph, or rg/glob appropriately. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:30-33]
- **Copilot CLI**: verify the same tool-fallback behavior, with context-prime output and first-response hints reinforcing the decision tree after session start. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:35-38]
- **Gemini CLI**: run both with and without `.gemini/settings.json` hooks configured; the routing outcome should stay the same even though delivery timing may differ. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:40-66]

Manual pass criteria: the first tool selected matches the prompt class, the `Tool Routing` block is visible in context-prime/bootstrap output, and stale-graph fallback prefers graceful redirection over false structural confidence.

## Findings:
1. The current `context-prime` contract is missing the very data needed for search-tool enforcement. Both runtime-specific agent files output only session context, system health, and next steps; neither includes a routing section or tool-choice classifier. [SOURCE: .opencode/agent/context-prime.md:114-133] [SOURCE: .claude/agents/context-prime.md:114-133]
2. PrimePackage is the right place to store structured routing metadata, but not the right place to hide all routing logic inside `recommendedCalls`. Today `recommendedCalls` mixes operational recovery suggestions (`code_graph_scan`, `memory_context(...)`) with lightweight next steps, so it should remain imperative while a new `routingRules` field carries the actual policy. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:351-363]
3. The routing taxonomy should reuse the architecture’s existing split: semantic discovery -> CocoIndex, structural navigation -> Code Graph, session continuity -> Memory. For enforcement purposes, the PrimePackage should add a fourth visible category for exact text/path lookup -> rg/glob, because that is the missing contrast against CocoIndex overuse and Graph overuse. [SOURCE: .opencode/skill/system-spec-kit/ARCHITECTURE.md:545-553]
4. The best visible format is a compact `## Tool Routing` section with one-line rules plus a five-line decision tree. This is more robust than prose because it can be copied almost verbatim into `buildServerInstructions()`, context-prime output, and reactive hints without semantic drift. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:605-645]
5. The current server-start instruction tests already validate live `setInstructions()` output, so routing enforcement should extend those tests instead of creating a second testing style. That keeps the routing section tied to the real startup path that all MCP clients use. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1278-1335]
6. PrimePackage population currently has no focused test coverage at all. That is a root testing gap: if `routingRules` is added, the builder needs its own direct unit tests across fresh/stale/empty graph states and CocoIndex availability combinations. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:316-364] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests]
7. Reactive hint injection is already present and reusable, but only as a secondary reinforcement layer. `appendAutoSurfaceHints()` and `injectSessionPrimeHints()` can carry a compact routing reminder and expose `routingRules` in metadata, but they still happen after tool selection and therefore must not be treated as the only enforcement path. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86-140] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:530-565] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:813-839]
8. The manual end-to-end plan should be query-class driven, not tool-driven. Using the same semantic, structural, exact, and stale-graph prompts across Claude, Codex, Copilot, and Gemini makes it possible to measure enforcement consistency even though hook delivery differs by runtime. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts:21-78] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts:18-67]
9. The bridge behavior should be explicitly documented in PrimePackage: semantic discovery often starts in CocoIndex, then pivots into `code_graph_context` for neighborhood, outline, or impact expansion. That bridge is already part of the tool schema and manual testing playbook, so elevating it into routing output closes the gap between discovery and structural follow-up. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:660-693] [SOURCE: .opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/255-cocoindex-code-graph-routing.md:16-33]
10. The correct enforcement order remains unchanged: proactive startup/server instructions first, PrimePackage/context-prime second, reactive hint injection third. This iteration clarifies what the missing middle layer should contain and how to prove it works with automated and manual tests. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:605-645] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:316-364] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:86-140]

## Key Questions Answered: This iteration directly advances Q4 and Q7, and it sharpens the implementation path for Q2 and Q3 by specifying the exact context-prime/PrimePackage routing payload and the tests needed to validate it.

## New Information Ratio: 0.56

## Next Focus Recommendation: Final iteration should investigate over-aggressive enforcement failure modes and escape hatches: how to avoid false redirects, how to degrade gracefully when CocoIndex or Code Graph is unavailable, and how to specify acceptance criteria for a full implementation patch across startup instructions, PrimePackage, and hint injection.

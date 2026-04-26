# Iteration 003

**Run Date:** 2026-04-26
**Dimension:** correctness
**Focus:** Resolver capture + cross-file resolution
**Verdict Snapshot:** CONDITIONAL

## Summary

- The landed resolver path gets a few important things right: `IndexerConfig` exposes the new resolver fields, `getConfiguredModuleResolver()` is built once per scan at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1860-1863`, and extensionless module probing covers `.ts`, `.tsx`, `.mts`, `.cts`, `.js`, `.jsx`, `.mjs`, `.cjs`, `.d.ts`, plus `/index.*` candidates at `:1531-1561`.
- Three correctness gaps remain in T09-T10. Two are against explicit packet requirements: nested `tsconfig` `extends` is still single-level only, and TypeScript inline type-only imports are mis-tagged as value imports. The third is a backend-parity failure: the regex fallback still cannot emit the resolver metadata that `finalizeIndexResults()` now depends on.
- Barrel traversal is cycle-safe but still unbounded: `resolveExportedNode()` tracks `visited` keys at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1725-1761`, so it will not spin forever on cycles, but it has no explicit depth cap or cycle/depth metadata like the 007 iter-009 design called for.

## Findings

### P0

- None.

### P1

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1500-1528` with `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/spec.md:169,200-201` — `loadTsconfigSettings()` only follows `extends` when `depth === 0`, so it reads the immediate parent config but silently drops grandparents and never rejects circular chains. The packet spec explicitly requires nested `extends` support via a `readJsonWithExtends`-style merge and says circular extends must be rejected. In a common `tsconfig.json -> base.json -> platform.json` stack, inherited `baseUrl` / `paths` vanish and path-alias resolution regresses even though T10 is marked verified. The current resolver tests also bypass this codepath entirely by injecting `mapResolver(...)` into `finalizeIndexResults()` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:295-345,404-410`, so CI would not catch the regression. Fix: recurse through the full `extends` chain using canonicalized visited-path tracking, merge compiler options until the root, and hard-fail or warn on cycles.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:364-380,388-392` with `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:10` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1797-1806` — `emitImportCaptures()` assigns one statement-wide `importKind` from `/^\s*import\s+type\b/`, then stamps that same value onto every emitted specifier. That handles `import type { Foo } ...`, but it mis-tags real TS 5 syntax already present in the repo, `import { type QueryComplexityTier } from './query-classifier.js';`, as `importKind: 'value'`. The resolver then emits a normal cross-file `IMPORTS` edge carrying the wrong metadata. Mixed clauses like `import { type Foo, Bar } from './x'` cannot be represented at all. Fix: inspect each `import_specifier` for its own `type` modifier and store `importKind` per emitted capture instead of per statement.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:531-559` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:737-767,802-805,1741-1807` — the regex fallback still does not satisfy the T09 capture contract. Its import regex does not match `import type`, never records `importKind`, and its export regex strips `from './x'` entirely, so it never records re-export `moduleSpecifier` or `exportKind`; `export * from` is missed altogether. `finalizeIndexResults()` only performs cross-file resolution when those fields are present, so path-alias/type-only/barrel resolution disappears whenever tree-sitter is unavailable or `SPECKIT_PARSER=regex` is used. That is exactly the resilience path this packet was meant to harden. The existing regex-backed tests at `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:459-517` cover only a simple `import { dep } from './dep'` case, so this parity gap is currently unpinned. Fix: upgrade the regex parser to emit the same `moduleSpecifier` / `importKind` / `exportKind` fields as the tree-sitter backend for `import type`, `export { ... } from`, and `export * from`, then add regex-backed resolver tests.

### P2

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1725-1755` — `resolveExportedNode()` is cycle-safe because it tracks visited `filePath::name` pairs, but it is not depth-bounded. Very long acyclic barrel chains recurse until stack depth, and the code emits no `cycle` / `depth-exceeded` metadata when traversal fails. 007 iter-009 called for a bounded traversal with explicit failure markers. Fix: add a depth counter (for example `maxDepth = 10`) and surface failure metadata so callers can distinguish “unresolved export” from “barrel chain too deep” or “cycle detected”.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/spec.md:123-131,169,200-201`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/plan.md:127-152`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/tasks.md:84-85,111`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-009.md:1-260`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:86-100`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:77-83,1458-1655,1658-1812,1860-1863`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:358-481`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:265-422,459-517`
- `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json:1-19`
- `.opencode/skill/system-spec-kit/tsconfig.json:1-20`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:1-12`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/index.ts:1-5`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:1-12`

## Convergence Signals

- `newFindingsRatio: 1.0` — this pass uncovered three new P1/P2 resolver defects that the first two hash-predicate iterations did not touch.
- `tsconfig parsed once per scan:` confirmed. `buildIndexPhases()` constructs `moduleResolver` once at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1860-1863`, so the resolver is not reparsed per file.
- `Outside-workspace resolution:` not fenced at resolver level. Absolute specifiers or alias targets can still be `statSync`-probed outside `rootDir` via `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1493,1573-1590`, but cross-file edges are only emitted when the resolved file also exists in `capturesByFile` / `nodesByFile`, so out-of-root targets currently degrade to silent unresolved edges rather than cross-workspace links.
- `Extension probing:` extensionless imports are handled broadly, but explicit `.js` / `.jsx` / `.mjs` / `.cjs` specifiers only fall back through `MODULE_EXTENSION_FALLBACKS` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:77-83,1543-1545`; they do not probe `.d.ts` on that path.

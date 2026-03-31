# Iteration 005: D4 Maintainability

## Findings

No P0 or P1 issues found.

### [P2] Context-source policy is duplicated across `budget-allocator.ts` and `compact-merger.ts`
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:31-41`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:10-16`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:119-152`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:176-180`
- **Issue**: The same source set is encoded in multiple places as unrelated string tables and hand-written branches: `MergeInput` fields, budget floors, priority order, per-section rendering, and fallback freshness metadata. That keeps the current implementation readable in isolation, but it raises follow-on change cost because adding, renaming, or re-prioritizing a source requires editing several disconnected locations and keeping the names perfectly aligned by hand.
- **Evidence**: `budget-allocator.ts` defines the floor policy and redistribution order independently, while `compact-merger.ts` repeats the source roster in the input interface, allocation lookups, section builders, and default metadata. There is no single typed registry that owns both source identity and source behavior.
- **Fix**: Replace the stringly-typed spread with a shared source descriptor registry, for example one typed array/object that carries source key, default floor, render label, source kind, and freshness defaults, then drive both allocation and rendering from that registry.

### [P2] `WorkingSetTracker` exposes a broader state model than it can persist
- **File**: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:16-22`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:71-87`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts:111-152`
- **Issue**: The class presents itself as the session working set abstraction for both files and symbols, with configurable capacity, but its persistence API only round-trips file entries and silently recreates the tracker with the default `maxFiles`. That asymmetry makes the class easy to misuse in future hook-state integration because the public API suggests a full snapshot while the serializer actually preserves only part of the object.
- **Evidence**: `serialize()` returns `Record<string, FileAccess>` only; `deserialize()` accepts that same file-only shape and calls `new WorkingSetTracker()` with no stored capacity; the symbol map and `symbolCount`/`getTopSymbols()` API live in the same class but are not represented in the persisted state.
- **Fix**: Introduce an explicit snapshot type that includes `files`, `symbols`, and `maxFiles`, or split file and symbol tracking into separate objects so the persistence contract matches the public surface.

### [P2] `handleCodeGraphContext` hand-rolls a wide seed shape but normalizes only a narrow subset
- **File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:13-27`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:39-45`
- **Issue**: The handler defines a broad inline `seeds` shape with provider-specific fields such as `symbolName`, `nodeId`, `symbolId`, `kind`, and `snippet`, but the normalization step only special-cases CocoIndex file/range seeds and otherwise collapses everything to `{ filePath, startLine, endLine, query }`. That split makes the handler harder to extend safely because the accepted request shape and the consumed request shape are not obviously the same contract.
- **Evidence**: The local `ContextHandlerArgs` type advertises fields for manual and graph-style seeds, yet the mapper ignores those fields and never delegates provider-aware normalization to a shared seed parser. A maintainer has to inspect both the type and the mapper to discover which properties matter.
- **Fix**: Reuse a shared `AnySeed`/normalization helper from the seed-resolution layer, or narrow the handler input type to only the fields that are actually consumed before `buildContext()`.

## Notes

- I did not find a blocker-level maintainability issue in `runtime-detection.ts`; the main concern there is extension ergonomics rather than current readability.
- I did not find evidence that `context.ts` or `compact-merger.ts` currently need larger refactors for size alone. The maintainability cost is coming from contract duplication and asymmetric abstractions, not raw file length.

## Summary

- P0: 0 findings
- P1: 0 findings
- P2: 3 findings
- newFindingsRatio: 1.00
- Recommended next focus: D3 Traceability on the advertised `code_graph_context` seed contract and the spec/decision-record claims for hybrid context injection fallbacks

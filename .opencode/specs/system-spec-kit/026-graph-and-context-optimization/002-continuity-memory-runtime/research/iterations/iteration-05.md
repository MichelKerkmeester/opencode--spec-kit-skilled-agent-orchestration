## Iteration 05
### Focus
Full-auto save concurrency correctness: re-read Gate C writer guarantees and trace the live atomic-save path to determine whether concurrent routed saves actually merge against the latest doc state.

### Findings
- Gate C promises that when two concurrent `/memory:save` calls hit the same spec folder, `withSpecFolderLock` serializes them and "the second save re-reads the updated doc" before committing. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/003-gate-c-writer-ready/spec.md:134-136`
- The atomic save pipeline does not satisfy that promise. `atomicIndexMemory()` invokes `prepare()` before entering `withSpecFolderLock()`, so routed-save preparation happens outside the serialized section. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:299-307`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:324-332`
- `buildCanonicalAtomicPreparedSave()` reads `originalTargetContent` and computes `persistedContent` before the lock is acquired. A second concurrent routed save can therefore merge against stale pre-lock content and later promote a document that drops the first writer's changes. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1427-1463`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1501-1563`

### New Questions
- Should canonical merge preparation move under the folder lock, or should the locked section re-run merge preparation using the latest on-disk document?
- Are metadata-only writes vulnerable to the same stale-read window, or only anchor-merge routes?
- Would moving preparation under the lock materially change latency or deadlock behavior for `full-auto` saves?
- Do any current tests actually fail if two routed full-auto saves target the same document and different anchors concurrently?

### Status
new-territory

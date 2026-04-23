## Iteration 07
### Focus
Detector-provenance vocabulary drift between specs, emitted runtime values, and payload translation helpers.

### Findings
- The code-graph detector contract and packet docs expose a four-value vocabulary: `ast`, `structured`, `regex`, and `heuristic`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts:18-19`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/001-code-graph-upgrades/spec.md:116`.
- The actual backend mapper returns `'ast'` for tree-sitter and `'structured'` for the regex backend, so the literal `'regex'` value is not emitted by current parser selection code. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:68-72`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:687-688`.
- The shared payload layer compensates by converting detector provenance `'structured'` into parser provenance `'regex'`, which creates a split vocabulary: storage uses `structured`, trust carriers may surface `regex`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:77-93`, `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:612-620`.
- Packet checklist language still claims the system “distinguish[es] `ast`, `structured`, `regex`, or `heuristic` provenance,” which overstates what the runtime currently emits on the detector axis. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/001-code-graph-upgrades/checklist.md:53`.

### New Questions
- Is `'regex'` intended to remain a reserved detector value for future direct emission, or should the detector vocabulary collapse to the three values the runtime actually uses?
- Would renaming `'structured'` to `'regex'` in detector outputs break stored metadata or validator expectations?
- Should the packet docs be corrected to describe current behavior more precisely until the runtime truly emits all four values?

### Status
converging

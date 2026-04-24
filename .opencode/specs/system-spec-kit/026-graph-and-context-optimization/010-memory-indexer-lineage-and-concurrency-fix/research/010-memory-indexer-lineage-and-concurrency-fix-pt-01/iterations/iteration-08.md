## Iteration 08

### Focus
Caller-surface review for `fromScan`: determine whether the bypass is structurally limited to `memory_index_scan` or only socially limited by current call sites.

### Findings
- The public `memory_save` tool schema does not expose `fromScan`; `SaveArgs` includes file path, planner, routing, and governance fields, but no scan-bypass flag. (`.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:282-301`)
- `handleMemorySave()` likewise forwards only validated user/tool inputs into `indexMemoryFile()`; it never accepts or forwards `fromScan`. (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2596-2978`)
- However, `indexMemoryFile()` itself is exported and accepts `fromScan?: boolean`, so the transactional guard bypass is still an internal capability any future in-repo caller could invoke directly. (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2546-2590`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:3238-3245`)
- The only production caller visible in this packet is `memory_index_scan`, but the safety boundary is therefore "current call sites plus convention", not a type-level or provenance-level guarantee. (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:141-153`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:412-422`)

### New Questions
- Should `fromScan` be replaced by a scan-only wrapper or a branded internal token to harden the bypass contract?
- Is there any audit trail today that records when a save used the scan bypass?
- What test additions would best prevent an accidental future caller from opting into `fromScan`?
- How should this caller-surface concern be ranked relative to the missing live acceptance rerun?

### Status
new-territory

## Iteration 10

### Focus
Convergence pass: rank the remaining issues by severity, separate proven fixes from unverified assumptions, and decide whether the packet has unresolved correctness debt or mainly follow-up hardening work.

### Findings
- No new P0 correctness break emerged from code review: the packet now has three aligned protections against the original bug class: PE downgrade, per-folder/process serialization, and logical-key lineage rejection. (`.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:77-95`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2342-2454`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:247-272`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:689-710`)
- The highest-value remaining P1 concern is contract hardening around `fromScan`: today it is scan-only by caller convention, not by an impossible-to-misuse API boundary. (`iteration-08.md#Findings`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2546-2590`)
- The second P1 concern is verification debt, not code debt: the packet still needs the live `memory_index_scan` rerun on `026/009-hook-daemon-parity` in an embedding-capable runtime before the "0 `candidate_changed`" claim can be treated as fully closed. (`implementation-summary.md §Verification`, `checklist.md §Testing`)
- The remaining P2 edges are targeted test gaps rather than active defects: null-canonical PE fallback and governed-scope `fromScan` coverage are both inferentially safe but not directly regression-proven. (`iteration-03.md#Findings`, `iteration-09.md#Findings`)

### New Questions
- Should the next packet convert `fromScan` into a scan-only wrapper or a branded internal token?
- What exact acceptance command and environment notes should accompany the deferred live rerun?
- Which regression is more valuable first: null-canonical PE downgrade or scoped `fromScan` save behavior?
- Should the findings registry treat the CocoIndex outage as a research-process limitation or ignore it as non-product noise?

### Status
converging

## Iteration 07

### Focus
Lineage-state backstops: determine whether the underlying lineage layer would still reject cross-file corruption if a higher-layer guard regressed.

### Findings
- Lineage logical keys are built from `spec_folder`, normalized scope, canonical path, and anchor id, which means different files in the same packet intentionally resolve to different lineage identities. (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:247-272`)
- `recordLineageTransition()` rejects any predecessor whose logical key does not match the current row's logical key, which is the precise backstop behind the original `E_LINEAGE` failure. (`.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:689-710`)
- The dedicated regression `T070-3` proves that mismatched logical identities throw at the lineage layer, while `T070-1` and `T070-2` show that cross-path PE supersedes are routed to causal edges rather than the version chain. (`.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts:62-124`)
- This means the packet now has a layered defense: PE orchestration prevents the bad mutation up front, and lineage-state still rejects it if a future caller supplies a mismatched predecessor anyway. (`.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:77-95`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:689-710`)

### New Questions
- Which caller surfaces can still reach save code with enough privilege to misuse `fromScan`?
- Are there any gaps where scope-aware logical keys are implemented but not covered by the new packet tests?
- Does the public `memory_save` tool expose `fromScan`, or is that only an internal parameter?
- What should be considered the highest-priority follow-up after this research loop ends?

### Status
converging

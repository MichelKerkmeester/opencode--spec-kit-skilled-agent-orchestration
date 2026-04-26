---
title: "Deep Review Iteration 002 - D3/D4 Scan Pipeline"
iteration: 002
dimension: D3 Traceability / D4 Maintainability
session_id: 2026-04-12T17:05:00Z-008-cmd-memory-speckit-revisit
timestamp: 2026-04-12T17:07:00Z
status: insight
---

# Review Iteration 2: D3/D4 - Scan Pipeline

## Focus
Verify that `/memory:manage` still describes the real discovery pipeline behind `memory_index_scan`.

## Scope
- Review target: `.opencode/command/memory/manage.md`, `mcp_server/handlers/memory-index.ts`, `mcp_server/handlers/memory-index-discovery.ts`
- Spec refs: packet `008` command/runtime parity
- Dimension: traceability, maintainability

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `.opencode/command/memory/manage.md` | 8 | 10 | 7 | 7 |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts` | 10 | 10 | 10 | 9 |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | 10 | 10 | 10 | 9 |

## Findings
### P0 - Blockers
None.

### P1 - Required
1. `/memory:manage` still documents a 3-source scan pipeline, but the live handler now scans four sources by merging `specFiles`, `constitutionalFiles`, `specDocFiles`, and `graphMetadataFiles`. The command surface therefore understates what `memory_index_scan` actually indexes.

- Dimension: traceability
- Evidence: [SOURCE: .opencode/command/memory/manage.md:242-248], [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:213-230], [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:540-545], [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:205-248]
- Impact: Operator docs and follow-on audits can miss `graph-metadata.json` as a first-class indexed packet artifact.
- Skeptic: Graph metadata might be conceptually folded into spec docs even if the code uses a separate array.
- Referee: Rejected. The handler names a distinct `graphMetadataFiles` source and threads `graph_metadata` into spec-folder document chaining, so the 3-source description is concretely stale.
- Final severity: P1

```json
{
  "type": "claim-adjudication",
  "claim": "/memory:manage still documents memory_index_scan as a 3-source pipeline even though graph-metadata is a fourth indexed source.",
  "evidenceRefs": [
    ".opencode/command/memory/manage.md:242-248",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:213-230",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:540-545",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:205-248"
  ],
  "counterevidenceSought": "Checked whether graph-metadata was described elsewhere as folded into specDocFiles instead of being a distinct source.",
  "alternativeExplanation": "The docs may be intentionally simplified, but the table explicitly enumerates named scan sources and keys.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if graph-metadata discovery is intentionally removed from memory_index_scan."
}
```

### P2 - Suggestions
None.

## Cross-Reference Results
- Confirmed: The reviewed command surfaces no longer advertise live shared-memory command modes.
- Contradictions: The scan-pipeline table lags the handler's four-source merge.
- Unknowns: none

## Ruled Out
- `includeSpecDocs` is still a valid control flag; the issue is the missing graph-metadata source, not the flag naming.

## Sources Reviewed
- [SOURCE: .opencode/command/memory/manage.md:242-248]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:213-230]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:540-545]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:205-248]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: The second pass added one new traceability issue by checking the handler-backed scan inventory instead of only the save path.
- Dimensions addressed: security, traceability, maintainability

## Reflection
- What worked: Reading the command table beside the handler's merged file set made the drift unambiguous.
- What did not work: None.
- Next adjustment: Carry the same graph-metadata parity check into README/module docs, where the packet-011 additions may also be under-documented.

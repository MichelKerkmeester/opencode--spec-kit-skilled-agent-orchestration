---
title: "Deep Review Iteration 005 - D1/D3 Graph Module Inventory"
iteration: 005
dimension: D1 Correctness / D3 Traceability
session_id: 2026-04-12T17:10:00Z-009-readme-alignment-revisit
timestamp: 2026-04-12T17:11:00Z
status: insight
---

# Review Iteration 5: D1/D3 - Graph Module Inventory

## Focus
Verify that the graph package README still matches the files that now ship under `lib/graph/`.

## Scope
- Review target: `mcp_server/lib/graph/README.md`, `graph-metadata-parser.ts`, `graph-metadata-schema.ts`
- Spec refs: packet `009` README/module-layout parity
- Dimension: correctness, traceability

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md` | 8 | 10 | 7 | 7 |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | 10 | - | 10 | 9 |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | 10 | - | 10 | 9 |

## Findings
### P0 - Blockers
None.

### P1 - Required
1. `lib/graph/README.md` no longer matches the live `lib/graph/` directory. The inventory omits `graph-metadata-parser.ts` and `graph-metadata-schema.ts`, even though those files now define and validate the packet-level graph metadata contract.

- Dimension: traceability
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:65-89], [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1-42], [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:1-54]
- Impact: Readers using the README as the module map cannot discover the graph-metadata entrypoints added by packet `011`.
- Skeptic: The README might be intentionally scoped to ranking-related helpers instead of every file in the directory.
- Referee: Rejected. The README publishes a directory tree and key-files table for `graph/`, so omitting two live source files is concrete inventory drift.
- Final severity: P1

```json
{
  "type": "claim-adjudication",
  "claim": "lib/graph/README.md omits the live graph-metadata parser and schema files from the module inventory.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:65-89",
    ".opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1-42",
    ".opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:1-54"
  ],
  "counterevidenceSought": "Checked whether the README was intentionally limited to ranking helpers rather than the full directory.",
  "alternativeExplanation": "The omission could be editorial, but the published directory tree signals a complete inventory.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if the README is explicitly narrowed to a sub-scope instead of the full graph directory."
}
```

### P2 - Suggestions
None.

## Cross-Reference Results
- Confirmed: The graph parser and schema files are live source files in the reviewed module.
- Contradictions: The README inventory stops before those packet-011 additions.
- Unknowns: none

## Ruled Out
- Root `README.md` already includes `graph-metadata.json` in the packet structure and is not the strongest source of layout drift for this packet.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md:65-89]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1-42]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:1-54]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: The first README pass surfaced one new module-inventory contradiction tied directly to packet-011 additions.
- Dimensions addressed: correctness, traceability, maintainability

## Reflection
- What worked: Comparing the README's directory tree against the live `lib/graph` file list gave a fast, high-confidence answer.
- What did not work: None.
- Next adjustment: Inspect the config README, where graph metadata may also have changed the documented packet artifact model.

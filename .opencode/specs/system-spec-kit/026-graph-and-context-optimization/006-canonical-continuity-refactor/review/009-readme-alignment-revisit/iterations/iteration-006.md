---
title: "Deep Review Iteration 006 - D1/D3/D4 Config README Drift"
iteration: 006
dimension: D1 Correctness / D3 Traceability / D4 Maintainability
session_id: 2026-04-12T17:10:00Z-009-readme-alignment-revisit
timestamp: 2026-04-12T17:12:00Z
status: insight
---

# Review Iteration 6: D1/D3/D4 - Config README Drift

## Focus
Verify that the config README still documents the live spec-document inventory and continuity examples after canonical continuity replaced packet-local `memory/` files.

## Scope
- Review target: `mcp_server/lib/config/README.md`, `memory-types.ts`, selected README cross-checks
- Spec refs: packet `009` README/module-layout parity
- Dimension: correctness, security, traceability, maintainability

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md` | 8 | 10 | 7 | 6 |
| `.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts` | 10 | 10 | 10 | 9 |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | 9 | 10 | 8 | 8 |
| `README.md` | 9 | 10 | 8 | 8 |

## Findings
### P0 - Blockers
None.

### P1 - Required
1. `lib/config/README.md` still teaches an older continuity/document model. It says there are only 8 spec document types and keeps `memory/session-1.md` / `memory/next-steps.md` as examples, but the live config now defines `description_metadata` and `graph_metadata` document types and the canonical packet continuity model no longer centers on packet-local `memory/` files.

- Dimension: maintainability
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:41-42], [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:53], [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:107-108], [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:189-194], [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:367-404]
- Impact: Readers following the config README get the wrong packet-artifact count and stale continuity examples, which makes the README a poor source of truth for the current classification model.
- Skeptic: The README may be intentionally scoped to canonical markdown docs rather than all spec-folder document artifacts.
- Referee: Rejected. The README explicitly states counts and examples for spec document types, and the live config treats `description.json` and `graph-metadata.json` as first-class spec document inputs.
- Final severity: P1

```json
{
  "type": "claim-adjudication",
  "claim": "lib/config/README.md still documents an 8-document spec inventory and removed memory-folder examples.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:41-42",
    ".opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:53",
    ".opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:107-108",
    ".opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:189-194",
    ".opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:367-404"
  ],
  "counterevidenceSought": "Checked whether the README explicitly excluded JSON packet artifacts from its 'spec document' count.",
  "alternativeExplanation": "The file may not have been refreshed after packet 011 and canonical continuity changes, but the published examples are still stale reader-facing guidance.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade if the live config removes description_metadata/graph_metadata or the README is explicitly narrowed to markdown-only docs."
}
```

### P2 - Suggestions
None.

## Cross-Reference Results
- Confirmed: Root `README.md` and `mcp_server/README.md` already acknowledge `graph-metadata.json` as a packet artifact.
- Contradictions: `lib/config/README.md` still reports the older eight-document inventory and removed `memory/*` examples.
- Unknowns: No root `ARCHITECTURE.md` exists in the current checkout, so no source-backed finding was recorded for that path.

## Ruled Out
- No new shared-memory README regressions were found in the README surfaces reviewed for this packet.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:41-42]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:53]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:107-108]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:189-194]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:367-404]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: The second pass added one new config-README drift by checking current document-type definitions and packet-artifact examples.
- Dimensions addressed: correctness, security, traceability, maintainability

## Reflection
- What worked: Comparing README tables against the type definitions made the stale count and examples hard to dispute.
- What did not work: None.
- Next adjustment: Move from README parity into the shared-memory grep pass, where the question becomes runtime residue rather than documentation drift.

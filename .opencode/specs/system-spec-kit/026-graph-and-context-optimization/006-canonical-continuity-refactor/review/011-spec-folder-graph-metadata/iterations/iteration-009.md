---
title: "Deep Review Iteration 009 - D1/D3 Parser Output Quality"
iteration: 009
dimension: D1 Correctness / D3 Traceability
session_id: 2026-04-12T17:20:00Z-011-spec-folder-graph-metadata
timestamp: 2026-04-12T17:21:00Z
status: insight
---

# Review Iteration 9: D1/D3 - Parser Output Quality

## Focus
Verify that `graph-metadata-parser.ts` derives canonical, unambiguous key-file and entity output for packet-level metadata.

## Scope
- Review target: `graph-metadata-parser.ts`, `graph-metadata.json`, `backfill-graph-metadata.ts`
- Spec refs: packet `011` graph metadata contract
- Dimension: correctness, traceability, maintainability

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | 8 | 10 | 8 | 7 |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata/graph-metadata.json` | 8 | - | 8 | 7 |
| `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | 9 | 10 | 9 | 8 |

## Findings
### P0 - Blockers
None.

### P1 - Required
None.

### P2 - Suggestions
1. `graph-metadata-parser.ts` accepts any backticked file-like token and merges those raw strings into `key_files` without canonicalizing them. Real output therefore contains both canonical paths and basename-only duplicates for the same artifacts, which makes `key_files` and derived entities noisier than necessary.

- Dimension: maintainability
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:318-334], [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-471], [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:158-160], [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata/graph-metadata.json:58-79], [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata/graph-metadata.json:80-177]
- Impact: Downstream consumers get mixed path styles and duplicate-looking entities, which weakens the signal quality of packet graph metadata.
- Skeptic: Some basename-only entries may be deliberate lightweight hints rather than a real quality problem.
- Referee: Rejected. The same payload already carries canonical paths for those artifacts, so the basename-only duplicates add noise without new information.
- Final severity: P2

```json
{
  "type": "claim-adjudication",
  "claim": "graph-metadata parser derives ambiguous basename-only key_files and entities alongside canonical paths.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:318-334",
    ".opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-471",
    ".opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:158-160",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata/graph-metadata.json:58-79",
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata/graph-metadata.json:80-177"
  ],
  "counterevidenceSought": "Checked for a later normalization pass in backfill or schema validation before the file is written.",
  "alternativeExplanation": "Some doc authors may prefer short names, but the mixed canonical and basename entries are still redundant once full paths are present.",
  "finalSeverity": "P2",
  "confidence": 0.94,
  "downgradeTrigger": "Downgrade if downstream consumers are documented to prefer basename-only hints."
}
```

## Cross-Reference Results
- Confirmed: Backfill writes the parser-derived metadata directly, so noisy file references persist into the saved packet artifact.
- Contradictions: The packet contract wants packet-aware metadata, but the derived file hints are not yet normalized.
- Unknowns: none

## Ruled Out
- The schema/manual split itself is not broken; the issue is localized to derived file/entity quality.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:318-334]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-471]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:158-160]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata/graph-metadata.json:58-79]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata/graph-metadata.json:80-177]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: The first parser pass surfaced one new advisory issue in derived metadata quality.
- Dimensions addressed: correctness, traceability, maintainability

## Reflection
- What worked: Reviewing the parser and a real saved packet payload side by side made the ambiguity obvious.
- What did not work: None.
- Next adjustment: Re-check schema and backfill paths to make sure this stays an advisory and not a broader contract failure.

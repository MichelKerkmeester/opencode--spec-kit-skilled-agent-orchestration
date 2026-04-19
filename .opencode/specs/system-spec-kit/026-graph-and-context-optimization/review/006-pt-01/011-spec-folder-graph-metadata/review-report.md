---
title: "Phase Review Report: 011-spec-folder-graph-metadata"
description: "2-iteration deep review of 011-spec-folder-graph-metadata. Verdict PASS with advisories and 0 P0 / 0 P1 / 1 P2 findings."
importance_tier: "important"
contextType: "review-report"
---

# Phase Review Report: 011-spec-folder-graph-metadata

## 1. Overview
Review target: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/011-spec-folder-graph-metadata/`. Iterations completed: 2 of 2. Stop reason: `max_iterations`. Dimensions covered: D1 Correctness, D2 Security, D3 Traceability, D4 Maintainability. Verdict: PASS with advisories. Finding counts: 0 P0 / 0 P1 / 1 P2.

## 2. Findings
### DR-011-I009-P2-001
The graph-metadata parser accepts any backticked file-like token and merges those raw strings into `key_files` without path normalization. In real packet output that produces both canonical paths and basename-only duplicates such as `causal-links-processor.ts` and `validate.sh`, which makes the derived metadata noisier than it needs to be for downstream consumers.

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
  "counterevidenceSought": "Checked whether a later normalization step in backfill or schema validation canonicalizes the file references before write.",
  "alternativeExplanation": "Some basename-only entries may be intentional shorthand from packet docs, but the resulting mixed path styles still reduce the usefulness of the derived metadata.",
  "finalSeverity": "P2",
  "confidence": 0.94,
  "downgradeTrigger": "Downgrade if downstream consumers explicitly prefer basename-only hints over canonical paths."
}
```

## 3. Traceability
The schema versioning, manual/derived split, refresh path, and backfill traversal all appear correct in the reviewed code. The only advisory is about output cleanliness: the parser currently treats basename-only backticked references as peer entries to canonical paths, so `key_files` and derived entities can become ambiguous.

## 4. Recommended Remediation
- Normalize or filter basename-only references in [`graph-metadata-parser.ts`](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:318) before they enter `key_files` and derived entities.
- Optionally add a regression test that rejects mixed canonical-path and basename-only duplicates for the same file in generated `graph-metadata.json`.

## 5. Cross-References
This advisory is downstream of packet `011`'s otherwise-correct graph-metadata rollout. The save/refresh and indexing contract appears intact; the remaining issue is about metadata quality and consumer ergonomics.

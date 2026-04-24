# Iteration 001 - Correctness

## Focus

Correctness review of completed packet claims against the referenced implementation and tests.

## Files Reviewed

- `spec.md`
- `plan.md`
- `tasks.md`
- `implementation-summary.md`
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts`

## New Findings

| ID | Severity | Finding | Evidence |
| --- | --- | --- | --- |
| F001 | P1 | The packet says active packets are the default corpus, but the checked-in implementation is inclusive by default. | `tasks.md:6`, `implementation-summary.md:39`, `backfill-graph-metadata.ts:7`, `backfill-graph-metadata.ts:73`, `graph-metadata-backfill.vitest.ts:78` |

## Claim Adjudication

```json
{
  "findingId": "F001",
  "claim": "Completed packet documentation claims active-only traversal is the default, while implementation and tests make inclusive traversal the default.",
  "evidenceRefs": [
    "tasks.md:6",
    "implementation-summary.md:39",
    ".opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:7",
    ".opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:73",
    ".opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts:78"
  ],
  "counterevidenceSought": "Checked plan.md, implementation-summary.md, source defaults, and tests for any later statement that made inclusive default intentional.",
  "alternativeExplanation": "The packet may be historical and later architecture changed the desired default to inclusive.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "Downgrade if the packet is explicitly amended to say it documents superseded historical behavior rather than current completion state."
}
```

## Convergence

New findings ratio: `0.50`. Continue.

# Temporal-structural coherence scoring

## Current Reality

The quality loop handler (`handlers/quality-loop.ts`) includes a coherence dimension in its quality score breakdown. The coherence score measures how well a memory's content structure aligns with its temporal context — whether the claimed relationships (references to other memories, spec folder associations, causal links) are consistent with the chronological ordering of events. Incoherent memories that reference future events or claim relationships with non-existent predecessors receive a lower coherence score, which reduces their overall quality assessment.

The coherence signal feeds into the composite quality score alongside trigger coverage, anchor density, and token budget efficiency. A low coherence score can trigger a quality loop rejection, preventing temporally inconsistent content from entering the index.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/quality-loop.ts` | Handler | Quality loop with coherence scoring |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/quality-loop.vitest.ts` | Quality loop tests |

## Source Metadata

- Group: Scoring and calibration
- Source feature title: Temporal-structural coherence scoring
- Current reality source: audit-D04 gap backfill

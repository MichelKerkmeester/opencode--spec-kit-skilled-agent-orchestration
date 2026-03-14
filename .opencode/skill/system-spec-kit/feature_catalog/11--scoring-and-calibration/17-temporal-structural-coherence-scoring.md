# Temporal-structural coherence scoring

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. RETRY BEHAVIOR (QUALITY LOOP)](#4--retry-behavior-quality-loop)
- [5. SOURCE FILES](#5--source-files)
- [6. SOURCE METADATA](#6--source-metadata)

## 1. OVERVIEW
Describes the coherence dimension in the quality loop that measures whether a memory's content structure aligns with its temporal context, penalizing references to future events or non-existent predecessors.

## 2. CURRENT REALITY
The quality loop handler (`handlers/quality-loop.ts`) includes a coherence dimension in its quality score breakdown. The coherence score measures how well a memory's content structure aligns with its temporal context, specifically whether the claimed relationships (references to other memories, spec folder associations, causal links) are consistent with the chronological ordering of events. Incoherent memories that reference future events or claim relationships with non-existent predecessors receive a lower coherence score, which reduces their overall quality assessment.

The coherence signal feeds into the composite quality score alongside trigger coverage, anchor density and token budget efficiency. A low coherence score can trigger a quality loop rejection, preventing temporally inconsistent content from entering the index.

## 3. IN SIMPLE TERMS
This checks whether a memory's claims make sense in the order things actually happened. If a memory says it was caused by something that did not exist yet at the time, that is a red flag. Think of it like a fact-checker catching a biography that references events before the person was born. Memories that fail this time-logic check get a lower quality score and may be rejected from the index.
## 4. RETRY BEHAVIOR (QUALITY LOOP)
The verify-fix-verify retry cycle in `mcp_server/handlers/quality-loop.ts` is **immediate by design** (no backoff delay between attempts). Retries are bounded by `maxRetries` (default: `2`) and run synchronously because the auto-fix steps are deterministic local transforms (trigger re-extraction, anchor normalization, token-budget trimming). This keeps ingestion latency predictable while still allowing corrective passes.

## 5. SOURCE FILES
### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/quality-loop.ts` | Handler | Quality loop with coherence scoring |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/quality-loop.vitest.ts` | Quality loop tests |

## 6. SOURCE METADATA
- Group: Scoring and calibration
- Source feature title: Temporal-structural coherence scoring
- Current reality source: audit-D04 gap backfill


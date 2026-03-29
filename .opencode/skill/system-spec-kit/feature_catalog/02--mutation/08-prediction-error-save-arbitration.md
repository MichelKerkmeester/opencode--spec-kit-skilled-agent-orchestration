---
title: "Prediction-error save arbitration"
description: "Covers the 5-action decision engine that classifies new saves as REINFORCE, UPDATE, SUPERSEDE, CREATE_LINKED or CREATE based on semantic similarity."
---

# Prediction-error save arbitration

## 1. OVERVIEW

Covers the 5-action decision engine that classifies new saves as REINFORCE, UPDATE, SUPERSEDE, CREATE_LINKED or CREATE based on semantic similarity.

When you save new information, the system checks whether it already knows something similar. If it does, it decides the smartest action: strengthen the existing memory, update it in place, replace it with the new version or store both as related but different items. This prevents the knowledge base from filling up with near-identical copies while still capturing genuinely new information.

---

## 2. CURRENT REALITY

5-action decision engine during the save path. Examines semantic similarity of new content against existing memories: REINFORCE (>=0.95, boost FSRS stability), UPDATE (0.85-0.94 no contradiction, in-place update), SUPERSEDE (0.85-0.94 with contradiction, deprecate old + create new), CREATE_LINKED (0.70-0.84, new memory + causal edge), CREATE (<0.70, standalone). Contradiction detection via regex patterns. All decisions are logged to the `memory_conflicts` table with similarity, action, contradiction flag, reason and spec_folder. Document-type-aware weighting (constitutional=1.0 down to scratch=0.25).

For chunked saves, PE supersede state now finalizes atomically after chunk indexing succeeds. The handler tracks the new parent/child IDs, records any cross-path `supersedes` causal edge, and marks the predecessor superseded inside a single finalize transaction. If that finalize step fails, compensating cleanup deletes the newly created chunk tree before returning an error so the system does not expose a partial commit where the new chunk tree exists but the predecessor was never superseded.

**Activation condition:** Active when `force` is false AND embedding is available (non-null). Skipped for async/deferred embedding saves where embedding is null — those cases bypass similarity arbitration entirely and fall back to the normal create path. When `sessionId` is supplied, the similarity post-filter also rejects rows from other sessions, preventing false duplicate, update, or supersede decisions from crossing session boundaries.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/pe-gating.ts` | Handler | Prediction error gating entry point |
| `mcp_server/handlers/save/pe-orchestration.ts` | Handler | PE orchestration flow |
| `mcp_server/handlers/save/embedding-pipeline.ts` | Handler | Embedding generation and pending/deferred save behavior that gates PE execution |
| `mcp_server/lib/cognitive/prediction-error-gate.ts` | Lib | Prediction error computation |
| `mcp_server/handlers/save/create-record.ts` | Handler | Record creation logic |
| `mcp_server/handlers/memory-save.ts` | Handler | Chunked-save PE finalize transaction, cross-path supersede edge recording, and compensating cleanup |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/prediction-error-gate.vitest.ts` | PE gate tests |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Save handler validation |
| `mcp_server/tests/memory-save-extended.vitest.ts` | Save extended scenarios |
| `mcp_server/tests/memory-save-integration.vitest.ts` | Save-path PE arbitration integration tests |
| `mcp_server/tests/create-record-lineage-regressions.vitest.ts` | Cross-path supersede lineage and causal-edge routing coverage |

---

## 4. SOURCE METADATA

- Group: Undocumented feature gap scan
- Source feature title: Prediction-error save arbitration
- Current reality source: 10-agent feature gap scan
- Playbook reference: 110

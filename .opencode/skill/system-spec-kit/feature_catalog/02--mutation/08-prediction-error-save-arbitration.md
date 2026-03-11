# Prediction-error save arbitration

## Current Reality

5-action decision engine during the save path. Examines semantic similarity of new content against existing memories: REINFORCE (>=0.95, boost FSRS stability), UPDATE (0.85-0.94 no contradiction, in-place update), SUPERSEDE (0.85-0.94 with contradiction, deprecate old + create new), CREATE_LINKED (0.70-0.84, new memory + causal edge), CREATE (<0.70, standalone). Contradiction detection via regex patterns. All decisions are logged to the `memory_conflicts` table with similarity, action, contradiction flag, reason, and spec_folder. Document-type-aware weighting (constitutional=1.0 down to scratch=0.25). Always active unless `force: true` is passed.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/pe-gating.ts` | Handler | Prediction error gating entry point |
| `mcp_server/handlers/save/pe-orchestration.ts` | Handler | PE orchestration flow |
| `mcp_server/lib/cognitive/prediction-error-gate.ts` | Lib | Prediction error computation |
| `mcp_server/handlers/save/create-record.ts` | Handler | Record creation logic |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/prediction-error-gate.vitest.ts` | PE gate tests |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Save handler validation |
| `mcp_server/tests/memory-save-extended.vitest.ts` | Save extended scenarios |
| `mcp_server/tests/memory-save-integration.vitest.ts` | Save-path PE arbitration integration tests |

## Source Metadata

- Group: Undocumented feature gap scan
- Source feature title: Prediction-error save arbitration
- Current reality source: 10-agent feature gap scan
- Playbook reference: NEW-110

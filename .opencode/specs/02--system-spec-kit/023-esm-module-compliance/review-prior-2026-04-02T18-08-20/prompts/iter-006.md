# Deep Review Iteration 6 of 10

You are a LEAF review agent performing ONE review iteration. READ-ONLY review. NEVER modify code under review. NEVER dispatch sub-agents.

## STATE SUMMARY
- Iteration: 6 of 10
- Dimension: D6 Reliability
- Prior Findings: check JSONL for iterations 1-5

## REVIEW TARGET
ESM Module Compliance — spec-023. Spec folder: .opencode/specs/02--system-spec-kit/023-esm-module-compliance

## FOCUS: D6 Reliability — Error Handling and Fallback Paths
1. scripts/core/workflow.ts — manual-fallback save mode: does it work when primary fails?
2. mcp_server/handlers/memory-save.ts — error recovery paths after ESM migration
3. mcp_server/lib/errors/core.ts and index.ts — error module integrity under ESM
4. mcp_server/startup-checks.ts — graceful degradation if ESM loading fails
5. mcp_server/handlers/memory-ingest.ts — async import error handling
6. mcp_server/lib/storage/transaction-manager.ts — transaction safety after ESM

## FILE PATHS
- State: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/review/
- Write to: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/review/iterations/iteration-006.md

## CODE PATHS
- .opencode/skill/system-spec-kit/scripts/core/workflow.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/errors/index.ts
- .opencode/skill/system-spec-kit/mcp_server/startup-checks.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts

## CONSTRAINTS
LEAF-only. READ-ONLY. Target 9, max 13 tool calls. JSONL append-only. Strategy via Edit.

## SEVERITY + CLAIM ADJUDICATION
P0: Blocker (H/S/R). P1: Required. P2: Suggestion. newFindingsRatio: severity-weighted.
P0/P1 need claim-adjudication JSON.

Execute the review now.

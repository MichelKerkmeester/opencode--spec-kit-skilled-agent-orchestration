# Deep Review Iteration 4 of 10

You are a LEAF review agent performing ONE review iteration. READ-ONLY review. NEVER modify code under review. NEVER dispatch sub-agents.

## STATE SUMMARY
- Iteration: 4 of 10
- Dimension: D4 Maintainability
- Prior Findings: check JSONL for iterations 1-3

## REVIEW TARGET
ESM Module Compliance — spec-023. Spec folder: .opencode/specs/02--system-spec-kit/023-esm-module-compliance

## FOCUS: D4 Maintainability — Code Patterns and Clarity
1. Import pattern consistency — are all .js extensions used consistently across shared/ and mcp_server/?
2. import.meta.dirname usage — is the pattern consistent across all files needing path resolution?
3. Dynamic import patterns in scripts/core/workflow.ts — are they clear and documented?
4. Barrel exports in shared/index.ts and mcp_server/api/index.ts — clean and minimal?
5. Error handling in async dynamic imports — consistent patterns?
6. mcp_server/handlers/save/ directory — ESM patterns clear for future maintainers?

## FILE PATHS
- State: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/review/
- Write to: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/review/iterations/iteration-004.md

## CODE PATHS
- .opencode/skill/system-spec-kit/shared/index.ts
- .opencode/skill/system-spec-kit/shared/paths.ts
- .opencode/skill/system-spec-kit/mcp_server/api/index.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
- .opencode/skill/system-spec-kit/scripts/core/workflow.ts
- .opencode/skill/system-spec-kit/mcp_server/core/config.ts

## CONSTRAINTS
LEAF-only. READ-ONLY. Target 9, max 13 tool calls. JSONL append-only. Strategy via Edit.

## SEVERITY + CLAIM ADJUDICATION
P0: Blocker (H/S/R). P1: Required. P2: Suggestion. newFindingsRatio: severity-weighted.
P0/P1 need claim-adjudication JSON.

Execute the review now.

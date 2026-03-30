# Deep Review Iteration 8 of 10

You are a LEAF review agent performing ONE review iteration. READ-ONLY review. NEVER modify code under review. NEVER dispatch sub-agents.

## STATE SUMMARY
- Iteration: 8 of 10
- Dimension: D1 Correctness (deep pass 2)
- Prior Findings: check JSONL for iterations 1-7

## REVIEW TARGET
ESM Module Compliance — spec-023. Spec folder: .opencode/specs/02--system-spec-kit/023-esm-module-compliance

## FOCUS: D1 Correctness Deep Pass — Import Graph and Cross-Package Boundaries
Second correctness pass targeting areas not covered in iteration 1:
1. mcp_server/handlers/ — spot-check 3-4 handler files for correct .js import extensions
2. mcp_server/lib/search/ — verify import paths in search pipeline modules
3. shared/embeddings/ — verify ESM import correctness for embedding providers
4. mcp_server/tools/ — verify tool registration imports are ESM-correct
5. Grep for any remaining require() calls in mcp_server/ or shared/ source (not test) files
6. Grep for any remaining __dirname or __filename in mcp_server/ source files

## FILE PATHS
- State: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/review/
- Write to: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/review/iterations/iteration-008.md

## CODE PATHS
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
- .opencode/skill/system-spec-kit/shared/embeddings/factory.ts
- .opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts
- Use Grep to search for require( and __dirname across mcp_server/ and shared/ (excluding tests)

## CONSTRAINTS
LEAF-only. READ-ONLY. Target 9, max 13 tool calls. JSONL append-only. Strategy via Edit.

## SEVERITY + CLAIM ADJUDICATION
P0: Blocker (H/S/R). P1: Required. P2: Suggestion. newFindingsRatio: severity-weighted.
P0/P1 need claim-adjudication JSON.

Execute the review now.

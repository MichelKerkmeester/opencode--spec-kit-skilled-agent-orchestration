# Deep Review Iteration 9 of 10

You are a LEAF review agent performing ONE review iteration. READ-ONLY review. NEVER modify code under review. NEVER dispatch sub-agents.

## STATE SUMMARY
- Iteration: 9 of 10
- Dimension: D2 Security + D6 Reliability (cross-reference)
- Prior Findings: check JSONL for iterations 1-8

## REVIEW TARGET
ESM Module Compliance — spec-023. Spec folder: .opencode/specs/02--system-spec-kit/023-esm-module-compliance

## FOCUS: Cross-Reference Security + Reliability
Deep cross-dimensional review at the security/reliability intersection:
1. mcp_server/lib/validation/preflight.ts — pre-flight validation under ESM
2. mcp_server/lib/validation/save-quality-gate.ts — quality gates after ESM
3. mcp_server/handlers/pe-gating.ts — PE gating correctness
4. mcp_server/hooks/ — hook system integrity after ESM
5. mcp_server/lib/governance/scope-governance.ts — governance enforcement
6. Review any P1/P2 from prior iterations that might deserve severity upgrade

## FILE PATHS
- State: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/review/
- Write to: .opencode/specs/02--system-spec-kit/023-esm-module-compliance/review/iterations/iteration-009.md

## CODE PATHS
- .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts
- .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts
- .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts

## CONSTRAINTS
LEAF-only. READ-ONLY. Target 9, max 13 tool calls. JSONL append-only. Strategy via Edit.

## SEVERITY + CLAIM ADJUDICATION
P0: Blocker (H/S/R). P1: Required. P2: Suggestion. newFindingsRatio: severity-weighted.
P0/P1 need claim-adjudication JSON.

Execute the review now.

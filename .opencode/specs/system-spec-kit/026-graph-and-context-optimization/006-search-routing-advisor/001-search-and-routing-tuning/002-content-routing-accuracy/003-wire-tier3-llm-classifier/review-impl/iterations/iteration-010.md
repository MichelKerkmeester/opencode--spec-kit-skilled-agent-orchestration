# Iteration 010 - Security

## Scope

Final security pass and P0 adversarial self-check.

## Verification

Scoped Vitest result: PASS. `2` files passed; `89` tests passed and `3` skipped.

## Findings

No new security findings.

IMPL-F002 remains a P0 after adversarial review. The strongest counterargument is that the prompt tells Tier 3 to "Never invent a new category, doc, anchor, or merge mode" at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1289`. That is not a code guard. The code guard accepts any string `target_doc` at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:859`, carries it into the decision at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:687`, and joins it into a filesystem path at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1160`.

Expected behavior: model output should be treated as untrusted data and constrained after parsing. Actual behavior: prompt instruction is the main boundary, and path normalization can escape the current packet.

## Convergence

Max iterations reached. All dimensions were covered. Early convergence was blocked by active IMPL-F002.

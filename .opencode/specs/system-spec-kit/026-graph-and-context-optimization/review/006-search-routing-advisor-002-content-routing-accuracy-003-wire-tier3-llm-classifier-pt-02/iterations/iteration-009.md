# Iteration 009 - Correctness

## Scope

Final correctness stabilization pass. Looked for duplicate findings and checked whether cache context could be considered intentionally session-scoped.

## Verification

Scoped Vitest result: PASS. `2` files passed; `89` tests passed and `3` skipped.

## Findings

No new correctness findings.

The cache can remain session-scoped while still including route-defining context. The implementation currently uses `session_id || context.spec_folder` at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:336` through `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:337`, so two saves in the same session with identical text but different `save_mode` can collide. This is a correctness issue because explicit override and natural routing use different prompt semantics at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1342` and `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1299`.

## Convergence

New weighted findings ratio: `0.02`; churn `0.02`. Do not stop because IMPL-F002 is active.

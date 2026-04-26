GATE 3 PRE-ANSWERED: A (existing spec folder)
Spec folder for this run: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/
Skill routing: sk-deep-review is preselected; do not re-evaluate.
You may write to: review/iterations/, review/deltas/, review/deep-review-state.jsonl. Do NOT modify any other file. Do NOT ask the user any questions.
This is a READ-ONLY review of the implementation. NEVER edit code outside the review/ directory.

==========

You are running iteration 6 of 10 in a deep-review loop on the 008-code-graph-backend-resilience packet.

# Iteration 6 — Correctness — Self-Heal + detect_changes Hard Block

## Focus

Audit T13 self-heal observability + detect_changes contract preservation:

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:30-36` (ReadyResult fields)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:302-367` (selective-reindex branches)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264` (hard block)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts` (hard-block coverage)

## Look For

- ReadyResult new optional fields: are they ALWAYS populated when self-heal fires? or sometimes undefined?
- verificationGate: 'pass' / 'fail' / 'absent' resolution logic — does it match impl-summary spec?
- lastSelfHealAt: ISO format consistent with other timestamps?
- selfHealResult: what triggers 'failed' vs 'skipped'?
- detect_changes hard block: did anything in T13 inadvertently leak `allowInlineFullScan: true`?
- Test coverage: do the new test cases actually assert the hard-block invariant via spy on ensureCodeGraphReady args?
- Does verificationGate 'fail' bubble up to a non-fresh freshness state, or is it dropped on the floor?

## Outputs as iteration 1.

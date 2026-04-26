GATE 3 PRE-ANSWERED: A (existing spec folder)
Spec folder for this run: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/
Skill routing: sk-deep-review is preselected; do not re-evaluate.
You may write to: review/iterations/, review/deltas/, review/deep-review-state.jsonl. Do NOT modify any other file. Do NOT ask the user any questions.
This is a READ-ONLY review of the implementation. NEVER edit code outside the review/ directory.

==========

You are running iteration 2 of 10 in a deep-review loop on the 008-code-graph-backend-resilience packet.

# Iteration 2 — Correctness — Hash Predicate Tests + Scan Propagation

## Focus

Audit the test coverage and scan-handler hash propagation:

- `.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:905-940` (mtime+hash test, recently fixed to use generateContentHash)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:41-46, 111-117` (hash predicate edge cases)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:208-217` (currentContentHash propagation)

## Look For

- Are all 3 hash predicate scenarios from REQ-015 covered? (same-mtime/different-hash, missing-hash fallback, unchanged-content freshness)
- Is the scan handler always passing a valid contentHash or sometimes undefined?
- Does any test rely on the OLD mtime-only semantics and still incorrectly pass because of test-fixture coincidence?
- Are there tests for the `options.currentContentHash` short-circuit path AND the lazy `getCurrentFileContentHash` fallback path?
- Coverage: are pre-existing crash-recovery tests still valid after T08 changes?

## Outputs as iteration 1.

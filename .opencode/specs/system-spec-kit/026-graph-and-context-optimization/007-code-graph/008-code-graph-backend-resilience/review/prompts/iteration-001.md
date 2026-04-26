GATE 3 PRE-ANSWERED: A (existing spec folder)
Spec folder for this run: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/
Skill routing: sk-deep-review is preselected; do not re-evaluate.
You may write to: review/iterations/, review/deltas/, review/deep-review-state.jsonl. Do NOT modify any other file. Do NOT ask the user any questions.
This is a READ-ONLY review of the implementation. NEVER edit code outside the review/ directory.

==========

You are running iteration 1 of 10 in a deep-review loop on the 008-code-graph-backend-resilience packet.

# Iteration 1 — Correctness — Hash Predicate Logic

## Focus

Audit the hash-aware staleness predicate landed by T08:

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:7-10` (imports)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:117-123` (getCurrentFileContentHash)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:380-425` (isFileStale + ensureFreshFiles)

Compare against the design in 007 iter-008 Patch Surface section.

## Look For

- Off-by-one or wrong-argument bugs in mtime-then-hash decision tree
- Race conditions: file modified between mtime check and hash compute
- Failure-to-stale on ENOENT or read errors (should default to stale, not fresh)
- Unicode/encoding mismatch with how `generateContentHash` is called during scan vs check
- Whether `options.currentContentHash` short-circuit is correct when caller passes `null` vs `undefined` vs missing
- Behavior when stored content_hash is empty string vs NULL

## Outputs

1. `review/iterations/iteration-001.md` — Summary, Findings (P0/P1/P2 each with file:line + reason + fix), Files Reviewed, Convergence Signals
2. `review/deltas/iteration-001.json` — `{ iteration:1, dimension:"correctness", focus, findings_count:{P0,P1,P2}, newFindingsRatio:1.0, status:"insight" }`
3. Append JSONL line to `review/deep-review-state.jsonl` with iteration:1

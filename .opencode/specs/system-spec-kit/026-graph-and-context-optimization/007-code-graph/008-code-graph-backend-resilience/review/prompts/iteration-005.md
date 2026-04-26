GATE 3 PRE-ANSWERED: A (existing spec folder)
Spec folder for this run: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/
Skill routing: sk-deep-review is preselected; do not re-evaluate.
You may write to: review/iterations/, review/deltas/, review/deep-review-state.jsonl. Do NOT modify any other file. Do NOT ask the user any questions.
This is a READ-ONLY review of the implementation. NEVER edit code outside the review/ directory.

==========

You are running iteration 5 of 10 in a deep-review loop on the 008-code-graph-backend-resilience packet.

# Iteration 5 — Correctness — Verifier + code_graph_verify Handler

## Focus

Audit T01-T07 verifier scaffolding + MCP integration:

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts` (loadGoldBattery, executeBattery)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts` (handleCodeGraphVerify)
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:554-647, 915-920` (VerifySchema + TOOL_DEFINITIONS)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts:4-11` (handler exports)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:5-96` (dispatch)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:190-204` (metadata helpers)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:247-287` (opt-in scan verify)
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-62` (verification surface)

## Look For

- loadGoldBattery: schema_version validation, pass_policy required-field check, queries[] shape validation
- executeBattery: error handling when handleCodeGraphQuery throws — does one bad probe abort all?
- Outline probe parsing: does the JSON-inside-text payload get parsed correctly? what if the response is empty / malformed?
- Case sensitivity in name/fqName comparison
- handleCodeGraphVerify: readiness blocking on freshness != "fresh" returns the right shape
- Default `allowInlineIndex: false` actually applied?
- persistBaseline: gated so we don't write metadata on every read
- v2 probe field warning: emitted exactly once per battery, not per query

## Outputs as iteration 1.

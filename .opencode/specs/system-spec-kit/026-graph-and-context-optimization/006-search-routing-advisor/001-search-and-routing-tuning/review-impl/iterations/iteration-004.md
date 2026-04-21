# Iteration 004 - Testing

Testing pass focused on non-hermetic behavior and assertions that prove the risky branches.

Findings:

| ID | Severity | Evidence | Summary |
| --- | --- | --- | --- |
| F-IMPL-P1-004 | P1 | `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:240`, `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:242`, `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:259`, `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:268`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:356`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:370`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:373` | The degraded-mode test intermittently fails in the scoped packet but passes isolated, so the packet's required verification is non-hermetic. |
| F-IMPL-P2-003 | P2 | `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:150`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:226`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:271`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:302`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:344`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:380` | Provider tests cover successful and HTTP/network failures, but not malformed 200-response shapes. |

Verification: scoped vitest passed: 318 passed, 3 skipped.

Churn: 0.25.

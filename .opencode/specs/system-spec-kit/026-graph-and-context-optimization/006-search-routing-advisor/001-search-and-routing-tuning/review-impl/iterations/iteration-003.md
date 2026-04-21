# Iteration 003 - Robustness

Robustness pass focused on provider boundaries, fallback behavior, and malformed external responses.

Findings:

| ID | Severity | Evidence | Summary |
| --- | --- | --- | --- |
| F-IMPL-P1-003 | P1 | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:31`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:41`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:49`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:57`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:293`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:335`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:371` | Provider `maxDocuments` limits are configured but requests still serialize every input document. |
| F-IMPL-P2-002 | P2 | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:304`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:308`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:346`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:350`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:382`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:386` | Provider response indexes are dereferenced without bounds/type validation. |

Verification: scoped vitest failed on adaptive-fusion T12.

Churn: 0.25.

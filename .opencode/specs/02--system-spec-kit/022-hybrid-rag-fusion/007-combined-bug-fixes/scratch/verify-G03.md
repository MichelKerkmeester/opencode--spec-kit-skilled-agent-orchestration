## Agent G03: Import Consistency — MCP Server Cross-Refs

### Summary
Verified rollout-policy import paths in mcp_server/lib/search/ after the revert in commit 6c47c091.

### Import Path Audit

| File | Import Path | Resolves To | Status |
|------|-------------|-------------|--------|
| graph-flags.ts:6 | `'../cache/cognitive/rollout-policy'` | `mcp_server/lib/cache/cognitive/rollout-policy.ts` | **EXISTS** |
| causal-boost.ts:9 | `'../cache/cognitive/rollout-policy'` | `mcp_server/lib/cache/cognitive/rollout-policy.ts` | **EXISTS** |

### Notes
- Source file exists at `mcp_server/lib/cache/cognitive/rollout-policy.ts` (1652 bytes)
- A duplicate also exists at `mcp_server/lib/cognitive/rollout-policy.ts` (same size) — likely historical
- Compiled outputs exist in dist for both paths
- Commit 6c47c091 specifically reverted to this `cache/cognitive/` path to fix CI TS6307 error
- Both files import `isFeatureEnabled` from the same module

### Findings
- **P3** (info): Duplicate rollout-policy.ts exists at two locations (lib/cognitive/ and lib/cache/cognitive/). The cache/ path is canonical per the revert commit.

### Verdict
**PASS** — Both import paths resolve correctly to existing source files.

## Iteration 02

### Focus
Codex hook activation parity after the docs refresh: compare the documented activation contract with the checked-in Codex config and the hook-policy detector.

### Findings
- The remediated docs repeatedly say Codex native hooks are only active when `[features].codex_hooks = true` is enabled in `~/.codex/config.toml` and `~/.codex/hooks.json` is wired. Evidence: `AGENTS.md:92`, `.opencode/skill/system-spec-kit/references/config/hook_system.md:33`, `.opencode/skill/system-spec-kit/references/config/hook_system.md:67`, `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137`, `.opencode/skill/system-spec-kit/README.md:118`
- The checked-in `.codex/config.toml` does not actually contain `codex_hooks = true`; its `[features]` table only enables `multi_agent` and `child_agents_md`. Evidence: `.codex/config.toml:43`, `.codex/config.toml:44`, `.codex/config.toml:45`
- The repo also contains `.codex/settings.json` and `.codex/config.toml`, but no repo-local `.codex/hooks.json`; the documented second half of the activation contract is therefore not represented in the checked-in surface. Evidence: `.codex/settings.json:1`, `.codex/settings.json:2`, `.codex/config.toml:1`, `.codex/config.toml:43`
- `detectCodexHookPolicy()` reports `live` whenever `.codex/settings.json` is valid JSON, and it never checks either the `codex_hooks` feature flag or the documented `hooks.json` wiring. That lets the operator-status layer overstate Codex parity even when the stated activation contract is incomplete. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:120`, `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:125`, `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:219`, `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:222`, `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:229`
- The runtime detection layer then forwards that optimistic Codex policy directly into cross-runtime recovery logic, so the same overstatement propagates beyond the Codex-specific hook files. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:31`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:39`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:40`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:115`, `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:120`

### New Questions
- Should the checked-in repo contract be updated to include `codex_hooks = true`, or should the docs stop implying the repo is self-sufficient?
- Is `.codex/settings.json` a real activation surface for Codex hooks, or only a local convenience file beside the user-global `hooks.json`?
- Should `detectCodexHookPolicy()` downgrade to `partial` unless both the feature flag and hook registration file are present?
- Which tests would fail today if Codex detection were tightened to the documented contract?

### Status
new-territory

## Iteration 03

### Focus
Copilot wrapper and writer parity after packets 010/011 were documented as reverted.

### Findings
- Packet 010 explicitly says the Copilot-safe top-level wrapper fields (`type`, `bash`, `timeoutSec`) were added and later removed, and that they must be reapplied. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/010-copilot-wrapper-schema-fix/implementation-summary.md:22`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/010-copilot-wrapper-schema-fix/implementation-summary.md:24`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/010-copilot-wrapper-schema-fix/implementation-summary.md:37`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/010-copilot-wrapper-schema-fix/implementation-summary.md:57`
- Packet 011 says the actual Copilot writer commands on `UserPromptSubmit` and `SessionStart` were removed in the same revert and are likewise absent from the live wrapper. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/011-copilot-writer-wiring/implementation-summary.md:22`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/011-copilot-writer-wiring/implementation-summary.md:24`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/011-copilot-writer-wiring/implementation-summary.md:53`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/011-copilot-writer-wiring/implementation-summary.md:67`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/011-copilot-writer-wiring/implementation-summary.md:94`
- The current `.claude/settings.local.json` matches the reverted state: each event block contains only nested Claude `hooks`, with no top-level Copilot wrapper command fields. Evidence: `.claude/settings.local.json:24`, `.claude/settings.local.json:27`, `.claude/settings.local.json:36`, `.claude/settings.local.json:47`, `.claude/settings.local.json:58`
- The post-012 Copilot README now documents the wrapper-based Copilot path as current and shows exactly the top-level fields that are missing from the live config. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:27`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:34`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:35`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:48`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:49`
- This means Copilot parity is not blocked by hook implementation files alone: the writer code exists, but the checked-in operator-facing wrapper surface does not invoke it. Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:221`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:225`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:168`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:188`

### New Questions
- Should the repo restore the wrapper fields in `.claude/settings.local.json`, or did the Claude normalization intentionally supersede the Copilot contract?
- Are there any tests that would fail if the top-level Copilot wrapper fields remain absent forever?
- Does the current Copilot README need to degrade its language from "current path" to "intended path pending reapply" until 010/011 are restored?
- Is `PreCompact` still worth carrying in the Copilot wrapper contract, or should reapply be narrowed to the two writer-bearing events only?

### Status
new-territory

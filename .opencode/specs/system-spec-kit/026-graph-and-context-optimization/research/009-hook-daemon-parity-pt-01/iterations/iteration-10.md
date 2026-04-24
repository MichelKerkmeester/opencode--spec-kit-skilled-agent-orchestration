## Iteration 10

### Focus
Converged prioritization: rank the residual parity gaps by impact and map them to a repair sequence.

### Findings
- The highest-impact checked-in gap is Copilot activation parity: packets 010/011 say the wrapper fields and writer commands are reverted, and the live `.claude/settings.local.json` still matches that reverted state while docs describe the wrapper path as current. Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/010-copilot-wrapper-schema-fix/implementation-summary.md:24`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/011-copilot-writer-wiring/implementation-summary.md:24`, `.claude/settings.local.json:24`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:27`
- The second highest-impact gap is Codex readiness truthfulness: docs say native hooks require `codex_hooks` plus `hooks.json`, but the repo config omits the flag and the detector still upgrades the runtime to `live` from `.codex/settings.json` alone. Evidence: `.codex/config.toml:43`, `AGENTS.md:92`, `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:219`, `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts:222`
- The third major drift is Gemini contract fragmentation: live config and implementation use `BeforeAgent` / `PreCompress` / `SessionEnd`, while docs and fallback tests continue to describe older or Claude-shaped names and availability expectations. Evidence: `.gemini/settings.json:83`, `.gemini/settings.json:95`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:5`, `.opencode/skill/system-spec-kit/references/config/hook_system.md:59`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts:102`
- Lower-severity but still meaningful operator gaps remain in status/reporting layers: Copilot readiness keys off unrelated `.github/hooks` files, startup continuity is not actually harmonized across runtimes, and `advisor_status` conflates daemon process presence with freshness readability. Evidence: `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/runtime-detection.ts:82`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:153`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:93`

### New Questions
- Should the next remediation packet be split by runtime again, or is there enough shared shape to fix detection/status/docs in one operator-surface packet?
- Is the intended end state "docs reflect current partial parity" or "code/config catches up to the post-012 docs immediately"?
- Which fixes can land without touching user-global config outside the repo, and which require explicit operator migration steps?

### Status
converging

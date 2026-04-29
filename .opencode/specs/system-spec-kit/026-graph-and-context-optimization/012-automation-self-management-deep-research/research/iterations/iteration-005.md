# Iteration 005 - Per-Runtime Hook Wiring Reality

## Focus
Strategy focus: hook wiring reality for Claude, Copilot, Codex, Gemini, OpenCode plugin bridge, and native/no-CLI paths for RQ5 (`research/deep-research-strategy.md:27`).

## Sources Read
- `.opencode/skill/system-spec-kit/references/config/hook_system.md:37-45`, `.opencode/skill/system-spec-kit/references/config/hook_system.md:64-78` - hook capability and fallback contract.
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:55-65`, `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:76-85` - advisor runtime matrix and fail-open behavior.
- `.claude/settings.local.json:24-74` - Claude hook registrations.
- `.claude/settings.json:8-11` - Claude status line only.
- `.gemini/settings.json:67-125` - Gemini hook registrations.
- `.codex/settings.json:2-36`, `.codex/config.toml:43-45`, `.codex/policy.json:1-44` - Codex hook files and feature/policy config.
- `.opencode/plugins/README.md:1-16`, `.opencode/plugins/spec-kit-skill-advisor.js:632-699` - OpenCode local plugin entrypoints and transform.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:14-36` - Copilot wiring contract.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:101-190` - custom-instructions managed block.

## Findings

| Runtime | Severity | Wired reality | Fallback chain | Gap class | Recommended action |
|---------|----------|---------------|----------------|-----------|--------------------|
| Claude Code | P1 | `.claude/settings.local.json` wires `UserPromptSubmit`, `PreCompact`, `SessionStart`, and `Stop` to compiled Claude hook scripts. Source: `.claude/settings.local.json:24-74`. | Hook fail-open returns empty context; operator fallback is `/spec_kit:resume` per hook docs. Source: `.opencode/skill/system-spec-kit/references/config/hook_system.md:76-78`. | Auto | Keep as the strongest runtime baseline. |
| Gemini CLI | P1 | `.gemini/settings.json` enables hooks and wires `SessionStart`, `PreCompress`, `BeforeAgent` compact/advisor, and `SessionEnd`. Source: `.gemini/settings.json:67-125`. | Native hook output plus resume/bootstrap fallback. Source: `.opencode/skill/system-spec-kit/references/config/hook_system.md:76-90`. | Auto | Keep; cite `BeforeAgent` as prompt surface. |
| OpenCode plugin bridge | P1 | `.opencode/plugins/` is documented as auto-loaded by OpenCode 1.3.17 and includes `spec-kit-skill-advisor.js`; that plugin registers an event handler, system transform, and status tool. Sources: `.opencode/plugins/README.md:1-16`, `.opencode/plugins/spec-kit-skill-advisor.js:632-699`. | Bridge uses native advisor when available, otherwise legacy brief, otherwise fail-open JSON. Source: `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs:316-360`. | Auto | Keep with host-version caveat. |
| Copilot CLI | P1 | Copilot scripts exist, but the README states Copilot hook outputs cannot mutate prompts and should refresh custom instructions instead. Sources: `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:14-36`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:101-190`. | Next prompt reads the managed block; otherwise use `/spec_kit:resume` or manual session/bootstrap. | Half | Update hook matrix language from "parity" to "next-prompt workaround." |
| Codex CLI | P1 | `.codex/settings.json` wires hook commands, but the hook contract doc says live native readiness requires `[features].codex_hooks=true` and `~/.codex/hooks.json`; checked-in `.codex/config.toml` features omit `codex_hooks`. Sources: `.codex/settings.json:2-36`, `.codex/config.toml:43-45`, `.opencode/skill/system-spec-kit/references/config/hook_system.md:44`. | Codex hook code has stale fallback on timeout, and prompt wrapper exists for hook-unavailable policy. Sources: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:174-180`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:123-199`. | Half | Resolve config contract and add a smoke check. |
| Native no CLI dispatch | P1 | No shell/runtime hook surface exists by definition; MCP tools are explicit. | Use `/spec_kit:resume`, then packet continuity, then `session_bootstrap()`/`session_resume()` when structural detail is needed. Source: `.opencode/skill/system-spec-kit/references/config/hook_system.md:76-78`. | Manual | Keep fallback chain as the source of truth. |
| Copilot doc consistency | P1 | `hook_system.md` says `.claude/settings.local.json` can carry Copilot top-level wrapper fields, but Copilot README says that mixed wrapper shape is stale and should not be used. Sources: `.opencode/skill/system-spec-kit/references/config/hook_system.md:22`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md:27-34`, `.claude/settings.local.json:24-74`. | Operator fallback still works through direct writer scripts, but docs conflict. | Aspirational | Fix `hook_system.md`; treat README as newer runtime-local contract. |
| Codex config consistency | P1 | Docs require `hooks.json` and `codex_hooks`, but repo has `.codex/settings.json` and no feature flag. Sources: `.opencode/skill/system-spec-kit/references/config/hook_system.md:44`, `.codex/settings.json:2-36`, `.codex/config.toml:43-45`. | Prompt-wrapper fallback only helps where wrapper is invoked. | Aspirational | Align config file names and readiness checks. |

## Adversarial Self-Check: Copilot Doc Consistency
- **Hunter**: `hook_system.md:22` documents a `.claude/settings.local.json` wrapper shape for Copilot, while Copilot's own README calls that shape stale and says not to add top-level wrapper fields.
- **Skeptic**: The hook-system doc may intentionally describe legacy support.
- **Referee**: The local Copilot README is more specific and explicitly deprecates the mixed shape. This stays P1 Aspirational because operators following the broader config doc can wire the wrong surface.

## Adversarial Self-Check: Codex Config Consistency
- **Hunter**: Codex docs require `codex_hooks` plus `hooks.json`; checked-in config has `.codex/settings.json` hooks and feature flags without `codex_hooks`.
- **Skeptic**: Codex may support `.codex/settings.json` in addition to `hooks.json`, and this session's tool layer provides hook-like behavior.
- **Referee**: The claim is not that Codex cannot work; it is that the checked-in config and documented readiness predicate disagree. This remains P1 Aspirational until one contract is made authoritative.

## New Info Ratio
0.63. The runtime matrix is mostly stable; the new value is in the contradictions.

## Open Questions Carried Forward
- Which Codex hook config file is authoritative for this repo?
- Should `hook_system.md` remove Copilot `.claude/settings.local.json` wrapper language entirely?

## Convergence Signal
continue. RQ5 is answered with two P1 doc/config gaps.


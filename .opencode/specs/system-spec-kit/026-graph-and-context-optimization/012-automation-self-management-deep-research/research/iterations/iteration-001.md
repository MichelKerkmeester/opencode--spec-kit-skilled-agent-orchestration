# Iteration 001 - Skill Advisor Entry Points

## Focus
Strategy focus: skill advisor entry-point catalog across hook, CLI, MCP, and tuner surfaces for RQ1. The taxonomy is the strategy's Auto/Half/Manual/Aspirational rule set (`research/deep-research-strategy.md:10-17`).

## Sources Read
- `spec.md:81-87` - RQ1-RQ7 contract.
- `research/deep-research-strategy.md:21-29` - iteration focus map.
- `CLAUDE.md:55-56`, `CLAUDE.md:179-180` - hook as primary advisor path and CLI fallback.
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:31-41` - default hook flow.
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:55-65` - runtime matrix.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:149-190` - Claude prompt hook builds and returns advisor context.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:139-204` - Gemini BeforeAgent hook builds and returns advisor context.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:1-7`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:149-238` - Copilot writes custom instructions and returns `{}`.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:249-343` - Codex advisor hook and timeout fallback.
- `.opencode/plugins/spec-kit-skill-advisor.js:567-663` - OpenCode plugin prompt transform.
- `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs:316-343` - plugin bridge native-first then legacy fallback.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts:397-539` - advisor skip policy, freshness, cache, subprocess fallback.
- `.opencode/command/doctor/assets/doctor_skill-advisor_auto.yaml:1-6`, `.opencode/command/doctor/assets/doctor_skill-advisor_auto.yaml:162-194` - scoring tuner workflow and verification.

## Findings

| ID | Severity | Claim | Actual behavior | Gap class | Recommended action |
|----|----------|-------|-----------------|-----------|--------------------|
| F1.1 | P1 | Gate 2 is automatic through the skill advisor hook. | Claude and Gemini can inject in-turn advisor context when their prompt hooks are configured; Claude calls `buildBrief(... runtime:'claude')` and returns `additionalContext`, while Gemini does the same through `BeforeAgent`. Sources: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:149-190`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:139-204`. | Auto | Keep the claim, but scope it to hook-enabled runtimes. |
| F1.2 | P1 | Copilot has parity with prompt-time advisor injection. | Copilot cannot mutate the current prompt; its hook refreshes `$HOME/.copilot/copilot-instructions.md` and returns `{}`. Sources: `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:1-7`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:137-140`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:233-238`. | Half | Fix docs to say next-prompt freshness, not in-turn context. |
| F1.3 | P1 | OpenCode receives advisor context automatically. | The plugin's `experimental.chat.system.transform` extracts the prompt, calls the bridge, and appends the brief to `output.system`. Sources: `.opencode/plugins/spec-kit-skill-advisor.js:567-663`, `.opencode/plugins/README.md:3-8`. | Auto | Keep doc; add plugin-load precondition. |
| F1.4 | P1 | Codex prompt hooks are automatic. | Codex hook code exists and returns context or stale fallback on timeout, but the runtime config story is feature-gated and checked in as `.codex/settings.json`, while docs require `[features].codex_hooks` plus `hooks.json`. Sources: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:249-343`, `.codex/settings.json:2-36`, `.codex/config.toml:43-45`, `.opencode/skill/system-spec-kit/references/config/hook_system.md:44`. | Half | Unify Codex config docs and checked-in config shape. |
| F1.5 | P2 | The Python advisor is an automatic fallback. | `skill_advisor.py` is an explicit CLI fallback path in the project instructions, not a prompt-time trigger by itself. Sources: `CLAUDE.md:179-180`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:3175-3198`. | Manual | Keep as fallback documentation. |
| F1.6 | P1 | MCP advisor recommendation is automatic. | The handler is called only when an MCP tool or bridge invokes it; it checks status, cache, and scoring after explicit request. Sources: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:207-247`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:249-318`. | Manual | Document as tool surface, not auto-fire. |
| F1.7 | P1 | Advisor freshness self-manages. | `buildSkillAdvisorBrief` skips policy-disabled prompts, degrades on non-live freshness, caches prompt results, and fail-opens subprocess errors. Sources: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts:397-539`. | Half | Keep, but document stale/degraded modes explicitly. |
| F1.8 | P1 | Skill graph auto-reindexes. | The daemon watcher can reindex on `add/change/unlink`, but only after a daemon lifecycle acquires its lease and starts the watcher. Sources: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts:28-70`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts:293-444`. | Half | State the daemon/service precondition. |
| F1.9 | P2 | `doctor:skill-advisor` self-tunes continuously. | The doctor YAML is an autonomous command workflow, but it starts from operator invocation, validates mutation targets, applies bounded edits, rebuilds, then runs `skill_graph_scan`. Sources: `.opencode/command/doctor/assets/doctor_skill-advisor_auto.yaml:1-6`, `.opencode/command/doctor/assets/doctor_skill-advisor_auto.yaml:162-194`. | Manual | Keep as operator maintenance workflow. |

## New Info Ratio
0.82. Most entry-point surfaces were newly traced, especially Copilot's next-prompt workaround and the OpenCode bridge.

## Open Questions Carried Forward
- Does Codex currently consume `.codex/settings.json`, `hooks.json`, or both?
- Should Copilot's stale wrapper documentation be treated as doc-only remediation or runtime remediation?

## Convergence Signal
continue. RQ1 is mostly answered, but RQ5 needs runtime config verification before final severity.


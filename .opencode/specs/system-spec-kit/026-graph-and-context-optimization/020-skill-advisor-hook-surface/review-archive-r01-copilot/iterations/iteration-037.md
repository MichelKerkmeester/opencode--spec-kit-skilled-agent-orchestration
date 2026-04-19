# Iteration 037 — Dimension(s): D7

## Scope this iteration
Finished the D7 drill by checking disable-flag naming and behavior consistency across hook docs, playbooks, and the plugin/runtime code.

## Evidence read
- `.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md:262-281` -> playbook distinguishes hook disable via `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and plugin opt-out via `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED=1` or `enabled: false`.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/{claude,gemini,copilot,codex}/user-prompt-submit.ts` -> all four adapters gate on `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === '1'`.
- `.opencode/plugins/spec-kit-skill-advisor.js:18-19` and `:42-60` -> plugin uses the distinct `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` env and mirrors config opt-out.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.02
- cumulative_p0: 0
- cumulative_p1: 5
- cumulative_p2: 2
- dimensions_advanced: [D7]
- stuck_counter: 21

## Next iteration focus
Run one final D1 re-verification against the original argv leak so the 40-iteration packet ends with a fresh confirmation of the highest-signal privacy issue.

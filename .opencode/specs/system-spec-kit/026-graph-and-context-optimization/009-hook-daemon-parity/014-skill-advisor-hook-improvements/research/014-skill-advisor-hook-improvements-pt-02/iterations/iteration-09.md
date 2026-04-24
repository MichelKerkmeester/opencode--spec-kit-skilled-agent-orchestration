## Iteration 09

### Focus

This iteration checked whether operator-facing docs and playbooks still match the runtime after the bridge helper moved. The goal was to determine whether smoke-test or support guidance now directs operators to outdated paths that could hide or misdiagnose packet-02 parity work.

### Context Consumed

- `../deep-research-strategy.md`
- `iteration-08.md`
- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`

### Findings

- The public hook reference still tells operators to run the OpenCode bridge from `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`, which no longer matches the live helper location [.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:133-140].
- The feature-catalog "current reality" section and the manual playbook repeat the same outdated `.opencode/plugins/` bridge path, so the doc drift is not isolated to one page [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md:29-39] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md:30-35] [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md:46-50].
- The compat test suite uses `.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs` as the real bridge path, which confirms the docs are behind the runtime rather than the other way around [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:11-14].

### Evidence

> ### OpenCode Plugin Bridge
>
> ```bash
> printf '%s' '{"prompt":"save this conversation context to memory","workspaceRoot":"'"$PWD"'","runtime":"opencode","maxTokens":80,"thresholdConfidence":0.7}' | \
>   node .opencode/plugins/spec-kit-skill-advisor-bridge.mjs
> ``` [.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md:133-138]

> `.opencode/plugins/spec-kit-skill-advisor.js` exports the plugin. `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` runs `buildSkillAdvisorBrief` + `renderAdvisorBrief` out-of-process via IPC. [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/07--hooks-and-plugin/05-opencode-plugin-bridge.md:29-31]

> const repoRoot = resolve(here, '..', '..', '..', '..', '..', '..', '..');
> const bridgePath = resolve(repoRoot, '.opencode/plugin-helpers/spec-kit-skill-advisor-bridge.mjs'); [.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:12-13]

### Negative Knowledge

- I did not find any packet-scope runtime source that still imports or spawns the bridge from `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`.
- This drift is documentation and playbook debt, not evidence that the plugin host entrypoint itself moved incorrectly.

### New Questions

#### Docs

- Which document should be treated as the source-of-truth bridge path after this packet?
- Should a doc regression test assert the plugin-helper path explicitly?

#### Operator Workflow

- Are there other runtime smoke tests that still point at retired paths or retired packaging assumptions?

#### Testing

- Does current test coverage lock enough of the bridge contract to catch future path drift automatically?

### Status

converging

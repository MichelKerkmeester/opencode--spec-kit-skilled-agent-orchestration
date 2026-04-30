---
title: "OpenCode Plugin Bridge"
description: "OpenCode plugin plus bridge process that wires the advisor into OpenCode through the stable compat entrypoint."
trigger_phrases:
  - "opencode plugin"
  - "plugin bridge"
  - "spec-kit-skill-advisor plugin"
  - "skill advisor plugin"
---

# OpenCode Plugin Bridge

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Give OpenCode a first-class plugin that surfaces advisor output at prompt time while delegating scoring to the native advisor via an isolated bridge process.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`.opencode/plugins/spec-kit-skill-advisor.js` exports the plugin. `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` runs `buildSkillAdvisorBrief` + `renderAdvisorBrief` out-of-process via IPC. Cache TTL is 5 minutes; the live threshold pair is `confidenceThreshold: 0.8` and `uncertaintyThreshold: 0.35`; the bridge times out after 1000 ms with SIGKILL escalation. Opt-out via `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`, the legacy `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED=1` alias, or `enabled: false` in plugin config. Compat regressions are preserved by routing through the stable `compat/index.ts` entrypoint.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/plugins/spec-kit-skill-advisor.js` | Implementation | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | Implementation | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/compat/index.ts` | Implementation | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/compat/plugin-bridge.vitest.ts` | Automated test | Validation reference |
| `Playbook scenario [CL-005](../../manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Hooks and plugin
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--hooks-and-plugin/05-opencode-plugin-bridge.md`

Related references:

- [`06--mcp-surface/04-compat-entrypoint.md`](../06--mcp-surface/04-compat-entrypoint.md).
- [01-claude-hook.md](./01-claude-hook.md).
- [`08--python-compat/01-cli-shim.md`](../08--python-compat/01-cli-shim.md).
<!-- /ANCHOR:source-metadata -->

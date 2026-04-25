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

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Give OpenCode a first-class plugin that surfaces advisor output at prompt time while delegating scoring to the native advisor via an isolated bridge process.

---

## 2. CURRENT REALITY

`.opencode/plugins/spec-kit-skill-advisor.js` exports the plugin. `.opencode/skill/system-spec-kit/mcp_server/plugin-bridges/spec-kit-skill-advisor-bridge.mjs` runs `buildSkillAdvisorBrief` + `renderAdvisorBrief` out-of-process via IPC. Cache TTL is 5 minutes; the live threshold pair is `confidenceThreshold: 0.8` and `uncertaintyThreshold: 0.35`; the bridge times out after 1000 ms with SIGKILL escalation. Opt-out via `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`, the legacy `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED=1` alias, or `enabled: false` in plugin config. Phase 025/026 regressions are preserved by routing through the stable `compat/index.ts` entrypoint.

---

## 3. SOURCE FILES

- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/skill/system-spec-kit/mcp_server/plugin-bridges/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/compat/index.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`.
- Playbook scenario [CL-005](../../manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md).

---

## 5. RELATED

- [`06--mcp-surface/04-compat-entrypoint.md`](../06--mcp-surface/04-compat-entrypoint.md).
- [01-claude-hook.md](./01-claude-hook.md).
- [`08--python-compat/01-cli-shim.md`](../08--python-compat/01-cli-shim.md).

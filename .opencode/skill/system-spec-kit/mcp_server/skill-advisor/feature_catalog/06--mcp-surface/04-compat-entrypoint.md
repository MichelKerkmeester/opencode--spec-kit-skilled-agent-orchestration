---
title: "Stable compat/index.ts Entrypoint"
description: "Stable public entrypoint used by the plugin bridge and Python shim, replacing private-dist pinning to handler files."
trigger_phrases:
  - "compat entrypoint"
  - "compat index"
  - "stable advisor entrypoint"
  - "plugin bridge entrypoint"
---

# Stable compat/index.ts Entrypoint

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Give plugins and the Python shim a stable, versioned public surface to import from the advisor package. No consumer should pin to compiled-handler paths that can move between releases.

---

## 2. CURRENT REALITY

`compat/index.ts` re-exports the curated public API:

```ts
export { handleAdvisorRecommend } from '../handlers/advisor-recommend.js';
export { readAdvisorStatus } from '../handlers/advisor-status.js';
export { probeAdvisorDaemon } from '../lib/compat/daemon-probe.js';
export { buildSkillAdvisorBrief } from '../lib/skill-advisor-brief.js';
export { renderAdvisorBrief } from '../lib/render.js';
```

The OpenCode plugin bridge imports the compiled equivalent at `dist/skill-advisor/compat/index.js`. The Python shim probes the same entrypoint through the daemon-probe helper. Pinning to private paths in `dist/handlers/` is explicitly disallowed.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/compat/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/daemon-probe.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/daemon-probe.vitest.ts`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`.
- Playbook scenarios [CL-005](../../manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md) and [CP-001..CP-004](../../manual_testing_playbook/03--compat-and-disable/).

---

## 5. RELATED

- [01-advisor-recommend.md](./01-advisor-recommend.md).
- [`07--hooks-and-plugin/05-opencode-plugin-bridge.md`](../07--hooks-and-plugin/05-opencode-plugin-bridge.md).
- [`08--python-compat/01-cli-shim.md`](../08--python-compat/01-cli-shim.md).

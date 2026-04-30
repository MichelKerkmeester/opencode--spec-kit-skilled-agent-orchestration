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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Give plugins and the Python shim a stable, versioned public surface to import from the advisor package. No consumer should pin to compiled-handler paths that can move between releases.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`compat/index.ts` re-exports the curated public API:

```ts
export { handleAdvisorRecommend } from '../handlers/advisor-recommend.js';
export { readAdvisorStatus } from '../handlers/advisor-status.js';
export { probeAdvisorDaemon } from '../lib/compat/daemon-probe.js';
export { buildSkillAdvisorBrief } from '../lib/skill-advisor-brief.js';
export { renderAdvisorBrief } from '../lib/render.js';
```

The OpenCode plugin bridge imports the compiled equivalent at `dist/skill_advisor/compat/index.js`. The Python shim probes the same entrypoint through the daemon-probe helper. Pinning to private paths in `dist/handlers/` is explicitly disallowed.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/compat/index.ts` | Implementation | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/daemon-probe.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/compat/daemon-probe.vitest.ts` | Automated test | Validation reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/compat/plugin-bridge.vitest.ts` | Automated test | Validation reference |
| `Playbook scenarios [CL-005](../../manual_testing_playbook/02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md) and [CP-001..CP-004](../../manual_testing_playbook/03--compat-and-disable/).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: MCP surface
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--mcp-surface/04-compat-entrypoint.md`

Related references:

- [01-advisor-recommend.md](./01-advisor-recommend.md).
- [`07--hooks-and-plugin/05-opencode-plugin-bridge.md`](../07--hooks-and-plugin/05-opencode-plugin-bridge.md).
- [`08--python-compat/01-cli-shim.md`](../08--python-compat/01-cli-shim.md).
<!-- /ANCHOR:source-metadata -->

---
title: "Copilot CLI user-prompt-submit Hook"
description: "Copilot CLI adapter with SDK-preferred path and wrapper fallback when the @github/copilot-sdk module is unavailable."
trigger_phrases:
  - "copilot hook"
  - "copilot user-prompt-submit"
  - "copilot sdk path"
  - "copilot advisor hook"
---

# Copilot CLI user-prompt-submit Hook

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Integrate the advisor into Copilot CLI sessions using the Copilot SDK when it is installed, with a wrapper fallback so the hook still works on deployments without the SDK.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`hooks/copilot/user-prompt-submit.ts` probes `COPILOT_SDK_MODULE_CANDIDATES` at load time. When `@github/copilot-sdk` resolves, the hook uses the SDK's `onUserPromptSubmitted` callback to return `{additionalContext}`. Otherwise it falls back to the wrapper path. Both paths route through the stable compat entrypoint, fail open on advisor errors, honor the global disable flag, and keep raw prompts out of diagnostics.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts` | Implementation | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/package.json` | Implementation | SDK dependency declaration |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `Playbook scenario [CL-002](../../manual_testing_playbook/02--cli-hooks-and-plugin/002-copilot-user-prompt-submit.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Hooks and plugin
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--hooks-and-plugin/02-copilot-hook.md`

Related references:

- [01-claude-hook.md](./01-claude-hook.md).
- [04-codex-hook.md](./04-codex-hook.md).
- [`06--mcp-surface/04-compat-entrypoint.md`](../06--mcp-surface/04-compat-entrypoint.md).
<!-- /ANCHOR:source-metadata -->

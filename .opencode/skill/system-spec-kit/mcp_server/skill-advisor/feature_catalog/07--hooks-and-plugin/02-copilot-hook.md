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

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Integrate the advisor into Copilot CLI sessions using the Copilot SDK when it is installed, with a wrapper fallback so the hook still works on deployments without the SDK.

---

## 2. CURRENT REALITY

`hooks/copilot/user-prompt-submit.ts` probes `COPILOT_SDK_MODULE_CANDIDATES` at load time. When `@github/copilot-sdk` resolves, the hook uses the SDK's `onUserPromptSubmitted` callback to return `{additionalContext}`. Otherwise it falls back to the wrapper path. Both paths route through the stable compat entrypoint, fail open on advisor errors, honor the global disable flag, and keep raw prompts out of diagnostics.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/package.json` — SDK dependency declaration.

---

## 4. TEST COVERAGE

- Playbook scenario [CL-002](../../manual_testing_playbook/02--cli-hooks-and-plugin/002-copilot-user-prompt-submit.md).

---

## 5. RELATED

- [01-claude-hook.md](./01-claude-hook.md).
- [04-codex-hook.md](./04-codex-hook.md).
- [`06--mcp-surface/04-compat-entrypoint.md`](../06--mcp-surface/04-compat-entrypoint.md).

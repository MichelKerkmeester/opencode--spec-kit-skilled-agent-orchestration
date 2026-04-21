---
title: "Codex CLI user-prompt-submit Hook with Prompt Wrapper Fallback"
description: "Codex CLI adapter using native UserPromptSubmit when available and a prompt-wrapper fallback otherwise."
trigger_phrases:
  - "codex hook"
  - "codex user-prompt-submit"
  - "codex prompt-wrapper"
  - "codex advisor hook"
---

# Codex CLI user-prompt-submit Hook with Prompt Wrapper Fallback

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Support Codex CLI sessions whether or not the runtime exposes a native `UserPromptSubmit` hook. When native hooks exist, use them; otherwise wrap the prompt.

---

## 2. CURRENT REALITY

`hooks/codex/user-prompt-submit.ts` handles the native path. `hooks/codex/prompt-wrapper.ts` provides the fallback prompt-wrapper path for Codex deployments that do not expose the hook surface. `.codex/settings.json` registers the compiled hook entries and `.codex/policy.json` ships a 17-entry Bash denylist. Both paths share failure semantics and the global disable flag.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts`
- `.codex/settings.json`
- `.codex/policy.json`

---

## 4. TEST COVERAGE

- Playbook scenario [CL-004](../../manual_testing_playbook/02--cli-hooks-and-plugin/004-codex-hook-and-wrapper.md).

---

## 5. RELATED

- [01-claude-hook.md](./01-claude-hook.md).
- [02-copilot-hook.md](./02-copilot-hook.md).
- [03-gemini-hook.md](./03-gemini-hook.md).

---
title: "Gemini CLI user-prompt-submit Hook"
description: "Gemini CLI adapter that emits hookSpecificOutput.additionalContext via the shared advisor envelope."
trigger_phrases:
  - "gemini hook"
  - "gemini user-prompt-submit"
  - "gemini advisor hook"
  - "gemini additionalContext"
---

# Gemini CLI user-prompt-submit Hook

## TABLE OF CONTENTS

- [1. PURPOSE](#1-purpose)
- [2. CURRENT REALITY](#2-current-reality)
- [3. SOURCE FILES](#3-source-files)
- [4. TEST COVERAGE](#4-test-coverage)
- [5. RELATED](#5-related)

---

## 1. PURPOSE

Integrate the advisor into Gemini CLI sessions without introducing a Gemini-specific routing pipeline.

---

## 2. CURRENT REALITY

`hooks/gemini/user-prompt-submit.ts` mirrors the Claude hook's envelope, reading prompt stdin and returning `hookSpecificOutput.additionalContext`. It shares failure semantics (fail-open), disable flag handling, and privacy rules with the other hooks. Output passes through the same render path (`lib/render.ts`) so text is identical across runtimes (see `lib/normalize-adapter-output.ts`).

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/normalize-adapter-output.ts`

---

## 4. TEST COVERAGE

- Playbook scenario [CL-003](../../manual_testing_playbook/02--cli-hooks-and-plugin/003-gemini-user-prompt-submit.md).
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-runtime-parity.vitest.ts` — runtime-parity checks.

---

## 5. RELATED

- [01-claude-hook.md](./01-claude-hook.md).
- [04-codex-hook.md](./04-codex-hook.md).
- [`06--mcp-surface/04-compat-entrypoint.md`](../06--mcp-surface/04-compat-entrypoint.md).

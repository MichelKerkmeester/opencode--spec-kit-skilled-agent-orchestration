---
title: "CL-001 Claude Code UserPromptSubmit Hook"
description: "Manual validation for the Claude Code prompt-time skill advisor hook."
trigger_phrases:
  - "cl-001"
  - "claude code userpromptsubmit hook"
  - "claude code"
  - "claude"
---

# CL-001 Claude Code UserPromptSubmit Hook

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate the Claude Code `UserPromptSubmit` adapter returns `hookSpecificOutput.additionalContext` and fails open.

---

## 2. SETUP

- MCP server build is current.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset.
- Claude hook script exists at `mcp_server/dist/hooks/claude/user-prompt-submit.js`.

---

## 3. STEPS

1. Build:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

2. Run hook smoke:

```bash
printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit"}' | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js
```

3. Capture stderr diagnostics separately from stdout.

---

## 4. EXPECTED

- Exit code is `0`.
- Stdout is `{}` or contains `hookSpecificOutput.additionalContext`.
- For a matching prompt, `additionalContext` starts with `Advisor:`.
- Stderr diagnostic JSONL has `runtime: "claude"` and no raw prompt text.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Script missing | Node reports module not found | Rebuild MCP server. |
| No brief for obvious prompt | `{}` with `status: "skipped"` or `fail_open` | Inspect diagnostic `freshness` and run `advisor_status`. |
| Prompt text in stderr | Grep captured stderr for prompt literal | Treat as privacy failure. |

---

## 6. RELATED

- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`

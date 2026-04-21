---
title: "CL-003 Gemini CLI UserPromptSubmit Hook"
description: "Manual validation for Gemini BeforeAgent prompt-time advisor integration."
trigger_phrases:
  - "cl-003"
  - "gemini cli userpromptsubmit hook"
  - "gemini cli"
  - "gemini"
---

# CL-003 Gemini CLI UserPromptSubmit Hook

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate Gemini's prompt-equivalent hook adapter and its fail-open behavior.

---

## 2. SETUP

- MCP server build is current.
- Gemini adapter exists at `mcp_server/dist/hooks/gemini/user-prompt-submit.js`.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset.

---

## 3. STEPS

1. Build:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

2. Run:

```bash
printf '%s' '{"request":{"prompt":"create a flowchart for the auth process","cwd":"'"$PWD"'"},"hook_event_name":"BeforeAgent"}' | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/user-prompt-submit.js
```

3. Capture stdout and stderr.

---

## 4. EXPECTED

- Exit code is `0`.
- Stdout is `{}` or `hookSpecificOutput.additionalContext`.
- Matching prompt returns an `Advisor:` brief.
- Diagnostics use `runtime: "gemini"`.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Unknown schema | Diagnostic `errorDetails: "GEMINI_UNKNOWN_SCHEMA"` | Update payload shape to include `prompt`, `userPrompt`, or `request.prompt`. |
| No advisor output | `{}` with skipped status | Confirm prompt policy and status freshness. |
| Prompt leaks | Prompt literal in stderr | Block release. |

---

## 6. RELATED

- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts`

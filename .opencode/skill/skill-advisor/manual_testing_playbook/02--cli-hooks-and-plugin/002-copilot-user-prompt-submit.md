---
title: "CL-002 Copilot CLI UserPromptSubmit Hook"
description: "Manual validation for Copilot SDK and wrapper prompt-time advisor paths."
---

# CL-002 Copilot CLI UserPromptSubmit Hook

## 1. OVERVIEW

Validate the Copilot adapter path, including SDK return shape and wrapper fallback shape.

---

## 2. SETUP

- MCP server build is current.
- Copilot adapter script exists at `mcp_server/dist/hooks/copilot/user-prompt-submit.js`.
- SDK availability may vary by host; wrapper fallback is acceptable when SDK packages are absent.

---

## 3. STEPS

1. Build:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

2. Run CLI smoke:

```bash
printf '%s' '{"prompt":"create a pull request on github","cwd":"'"$PWD"'"}' | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js
```

3. Inspect stdout for either `additionalContext` or `promptWrapper`.

---

## 4. EXPECTED

- Exit code is `0`.
- SDK path returns `{ "additionalContext": "Advisor: ..." }`.
- Wrapper path returns `promptWrapper` and `modifiedPrompt` when SDK is unavailable.
- Diagnostics use `runtime: "copilot"` and omit raw prompt text.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| SDK missing | Output uses wrapper fallback | Accept if wrapper output is prompt-safe. |
| Empty output for obvious prompt | `{}` and diagnostic has fail-open status | Run `advisor_status` and check build output. |
| Prompt persisted in diagnostics | Grep stderr | Block release. |

---

## 6. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts`

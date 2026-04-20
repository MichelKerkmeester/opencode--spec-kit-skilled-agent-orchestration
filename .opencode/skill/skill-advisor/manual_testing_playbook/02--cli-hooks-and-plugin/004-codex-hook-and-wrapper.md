---
title: "CL-004 Codex CLI Hook And Prompt Wrapper"
description: "Manual validation for Codex UserPromptSubmit and prompt-wrapper fallback."
---

# CL-004 Codex CLI Hook And Prompt Wrapper

## 1. OVERVIEW

Validate the Codex prompt hook, stdin-over-argv parsing, and wrapper fallback used when native hooks are unavailable.

---

## 2. SETUP

- MCP server build is current.
- Codex hook exists at `mcp_server/dist/hooks/codex/user-prompt-submit.js`.
- Prompt wrapper exists at `mcp_server/dist/hooks/codex/prompt-wrapper.js`.

---

## 3. STEPS

1. Build:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

2. Run UserPromptSubmit:

```bash
printf '%s' '{"prompt":"update documentation with DQI checks","cwd":"'"$PWD"'"}' | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js
```

3. Run wrapper smoke:

```bash
printf '%s' '{"prompt":"update documentation with DQI checks","cwd":"'"$PWD"'"}' | node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/prompt-wrapper.js
```

4. For parser precedence, pass conflicting argv JSON while stdin contains the intended prompt and verify stdin wins.

---

## 4. EXPECTED

- UserPromptSubmit exits `0` and returns `{}` or `hookSpecificOutput.additionalContext`.
- Wrapper exits `0` and returns `{}` unless hook policy reports unavailable; when active it returns `promptWrapper` and `wrappedPrompt`.
- Diagnostics use `runtime: "codex"`.
- Stdin JSON is canonical when stdin and argv both contain JSON.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Wrapper always rewrites | Output contains wrapper when hook policy is available | Inspect `detectCodexHookPolicy`. |
| Argv beats stdin | Diagnostic source or output reflects argv prompt | Block release; parser precedence regressed. |
| Prompt text in diagnostics | Grep stderr | Block release. |

---

## 6. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts`

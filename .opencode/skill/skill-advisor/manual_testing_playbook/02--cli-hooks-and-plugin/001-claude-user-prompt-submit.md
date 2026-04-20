---
title: "CL-001 Claude Code UserPromptSubmit Hook"
description: "Manual validation for the Claude Code prompt-time skill advisor hook."
---

# CL-001 Claude Code UserPromptSubmit Hook

## 1. OVERVIEW

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

## 6. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`

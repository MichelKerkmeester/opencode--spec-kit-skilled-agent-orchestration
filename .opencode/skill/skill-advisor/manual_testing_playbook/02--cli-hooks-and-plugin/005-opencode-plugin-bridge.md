---
title: "CL-005 OpenCode Plugin Bridge"
description: "Manual validation for the OpenCode spec-kit-skill-advisor plugin and bridge."
---

# CL-005 OpenCode Plugin Bridge

## 1. OVERVIEW

Validate the OpenCode plugin path that delegates through the stable native compat entrypoint, then falls back to Python brief production when needed.

---

## 2. SETUP

- MCP server build is current.
- Plugin host file exists at `.opencode/plugins/spec-kit-skill-advisor.js`.
- Bridge exists at `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`.

---

## 3. STEPS

1. Build:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

2. Run bridge directly:

```bash
printf '%s' '{"prompt":"save this conversation context to memory","workspaceRoot":"'"$PWD"'","runtime":"opencode","maxTokens":80,"thresholdConfidence":0.7}' | node .opencode/plugins/spec-kit-skill-advisor-bridge.mjs
```

3. Inspect plugin status tool in OpenCode, when available:

```text
spec_kit_skill_advisor_status({})
```

---

## 4. EXPECTED

- Bridge returns JSON with `status: "ok"` or prompt-safe fail-open status.
- Native success has `metadata.route: "native"` and an `Advisor:` brief.
- Bridge imports `.opencode/skill/system-spec-kit/mcp_server/dist/skill-advisor/compat/index.js`, not private handler paths.
- Disable flag returns a disabled brief or skipped state without invoking the native path.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Private dist pinning | Bridge imports handler internals directly | Update bridge to use `compat/index.ts` after code approval. |
| Plugin disabled unexpectedly | Status tool reports `disabled_reason` | Check env and plugin options. |
| Bridge timeout | `error: "TIMEOUT"` | Inspect build and Node binary path. |

---

## 6. SOURCE FILES

- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/compat/index.ts`

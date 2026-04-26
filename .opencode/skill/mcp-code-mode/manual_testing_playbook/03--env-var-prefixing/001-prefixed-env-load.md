---
title: "CM-008 -- Prefixed env load"
description: "This scenario validates prefixed env-var loading for `CM-008`. It focuses on confirming a `.env` entry like `clickup_CLICKUP_API_KEY=pk_xxx` is visible to the wrapped ClickUp MCP server."
---

# CM-008 -- Prefixed env load

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-008`.

---

## 1. OVERVIEW

This scenario validates prefixed env-var loading for `CM-008`. It focuses on confirming the Code Mode env-var prefixing rule — every external MCP server sees only env vars whose names begin with `{manual_name}_` — works in the live runtime.

### Why This Matters

If env vars don't load with the right prefix, every external MCP server is effectively unauthenticated. This is the second most-common configuration mistake after the manual-namespace contract (CM-005..CM-007), and the cause of the most opaque "auth fails but my env var is set" debug sessions.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CM-008` and confirm the expected signals without contradictory evidence.

- Objective: Verify a `.env` line `clickup_CLICKUP_API_KEY=pk_xxx` is loaded by the ClickUp MCP server and an authenticated tool call succeeds.
- Real user request: `"Confirm my ClickUp credentials are wired up correctly."`
- Prompt: `As a manual-testing orchestrator, set clickup_CLICKUP_API_KEY in .env, restart Code Mode, and call a ClickUp tool that requires auth against the live ClickUp API. Verify the auth succeeds. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: confirm `.env` line; restart Code Mode; call `clickup.clickup_get_teams({})` (per CM-005); confirm success.
- Expected signals: `.env` contains the prefixed key; ClickUp call returns workspace data without auth error; no "missing credential" error in logs.
- Desired user-visible outcome: A short report confirming the env-var path-through and a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if call returns auth error or "missing API key" despite env var being set.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, set clickup_CLICKUP_API_KEY in .env, restart Code Mode, and call a ClickUp tool that requires auth against the live ClickUp API. Verify the auth succeeds. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: grep '^clickup_CLICKUP_API_KEY=' .env` — confirm the prefixed key exists (REDACT value in evidence)
2. Restart Code Mode runtime (host-specific; in OpenCode this typically means restarting the MCP session)
3. `call_tool_chain({ code: "return await clickup.clickup_get_teams({});" })`
4. Inspect response for teams array

### Expected

- Step 1: grep returns one line matching the prefixed key (exit 0)
- Step 3: tool call returns object with `teams` array
- Step 4: array has >= 1 entry

### Evidence

Capture the grep result (REDACT value), the chain response (REDACT sensitive workspace names), and the team count.

### Pass / Fail

- **Pass**: Prefixed env var present AND ClickUp call returns teams.
- **Fail**: env var missing (operator setup error), call returns auth error (env var not propagated to MCP server), or chain returns generic error (cross-check CM-005, CM-006).

### Failure Triage

1. If grep returns no match: confirm the line literally has the `clickup_` prefix (not `CLICKUP_API_KEY` alone) — see CM-009 for the negative test.
2. If auth error despite env var set: check Code Mode startup log for env-var enumeration; verify the `name` field in `.utcp_config.json` matches `clickup` exactly (the prefix is derived from this name).
3. If chain returns "tool not found": cross-check CM-005 (correct manual.tool form) — auth is downstream of name resolution.

### Optional Supplemental Checks

- Add `webflow_WEBFLOW_TOKEN` and confirm Webflow tools work too; verifies the rule generalizes.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | Env-var prefixing rule (line 400-416) |
| `.env` (project root) | Env-var source |
| `.utcp_config.json` | `name` field defines the prefix |

---

## 5. SOURCE METADATA

- Group: ENV VAR PREFIXING
- Playbook ID: CM-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--env-var-prefixing/001-prefixed-env-load.md`

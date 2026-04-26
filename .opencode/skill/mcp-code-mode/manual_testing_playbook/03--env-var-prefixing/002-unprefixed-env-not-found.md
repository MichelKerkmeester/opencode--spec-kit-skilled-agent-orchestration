---
title: "CM-009 -- Unprefixed env not found"
description: "This scenario validates the negative path for env-var prefixing in `CM-009`. It focuses on confirming an unprefixed `CLICKUP_API_KEY` (without `clickup_` prefix) is NOT visible to the wrapped server, producing a deterministic auth error."
---

# CM-009 -- Unprefixed env not found

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-009`.

---

## 1. OVERVIEW

This scenario validates the negative path for env-var prefixing in `CM-009`. It focuses on confirming that an unprefixed `CLICKUP_API_KEY=pk_xxx` (no `clickup_` prefix) is NOT propagated to the wrapped ClickUp MCP server, so an authenticated call fails with a missing-credential error.

### Why This Matters

This is the negative test that proves the prefixing rule is enforced. Without this scenario, an operator might set `CLICKUP_API_KEY` (unprefixed), see the env var in `printenv`, and assume Code Mode is broken when their tool call fails. Demonstrating the deterministic failure mode (with the explanation in failure-triage) is what closes the debug loop.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CM-009` and confirm the expected signals without contradictory evidence.

- Objective: Verify setting only `CLICKUP_API_KEY` (no prefix) in `.env` causes a ClickUp tool call to fail with a missing-credential error.
- Real user request: `"My env var is set but ClickUp says it's not authenticated — why?"` (debugging session)
- Prompt: `As a manual-testing orchestrator, set only CLICKUP_API_KEY (no prefix) in .env, restart Code Mode, and call a ClickUp tool against the live ClickUp API. Verify the auth fails with a missing-credential error. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: temporarily replace prefixed env var with unprefixed; restart; call ClickUp tool; observe auth failure; restore prefixed env.
- Expected signals: `.env` has unprefixed `CLICKUP_API_KEY` only; ClickUp call returns auth error; error message references missing/invalid API key.
- Desired user-visible outcome: A short report demonstrating the failure mode and confirming that adding the prefix fixes it, with a PASS verdict.
- Pass/fail: PASS if all three signals hold AND the prefixed-restore succeeds; FAIL if unprefixed somehow works (rule not enforced).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, set only CLICKUP_API_KEY (no prefix) in .env, restart Code Mode, and call a ClickUp tool against the live ClickUp API. Verify the auth fails with a missing-credential error. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cp .env .env.bak` — back up current `.env`
2. `bash: sed -i.tmp '/^clickup_/d' .env && echo "CLICKUP_API_KEY=$(grep '^clickup_CLICKUP_API_KEY=' .env.bak | cut -d= -f2)" >> .env` — replace prefixed with unprefixed
3. Restart Code Mode runtime
4. `call_tool_chain({ code: "try { return await clickup.clickup_get_teams({}); } catch (e) { return { error: e.message }; }" })`
5. Inspect response for auth error
6. `bash: mv .env.bak .env` — restore original
7. Restart Code Mode runtime

### Expected

- Step 4: chain returns object with `error` key
- Step 5: error message contains "auth", "API key", "credential", or "401" or similar
- Step 7: subsequent `clickup.clickup_get_teams({})` succeeds (proves restore worked; cross-check CM-008)

### Evidence

Capture the auth-error message verbatim. Capture the post-restore success.

### Pass / Fail

- **Pass**: Unprefixed env produces auth error AND restore returns to working state.
- **Fail**: Unprefixed env somehow authenticates (rule not enforced); restore fails (operator has lost their config — investigate from `.env.bak`).

### Failure Triage

1. If unprefixed env works: this is a Code Mode runtime bug — the prefixing rule isn't being applied. Capture Code Mode startup log and escalate.
2. If error doesn't mention auth/credential: check what error the ClickUp MCP returns when truly unauthenticated by curling the ClickUp API directly with no token — should match.
3. If restore fails: open `.env.bak` and copy the prefixed line manually; verify with grep before re-running other scenarios.

### Optional Supplemental Checks

- After restore, run CM-008 to confirm full recovery before continuing other scenarios.

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

---

## 5. SOURCE METADATA

- Group: ENV VAR PREFIXING
- Playbook ID: CM-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--env-var-prefixing/002-unprefixed-env-not-found.md`

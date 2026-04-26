---
title: "CU-025 -- 429 rate-limit retry behavior"
description: "This scenario validates 429 rate-limit handling for `CU-025`. It focuses on confirming the ClickUp API surfaces a 429 with a retry-after header and that waiting + retrying succeeds."
---

# CU-025 -- 429 rate-limit retry behavior

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-025`.

---

## 1. OVERVIEW

This scenario validates 429 rate-limit handling for `CU-025`. It focuses on the operator-visible behavior when a tight loop of MCP calls hits the ClickUp API rate limit — confirming the response surfaces a 429 status AND a retry-after value, and that waiting the indicated window allows a successful retry.

### Why This Matters

Long-running workflows (e.g., bulk migrations, time-tracking sync) routinely brush against ClickUp's rate limits. Operators need a deterministic recovery contract: 429 with retry-after seconds, then waiting and retrying succeeds. A FAIL here means either the limit is silently dropped (no retry-after) or the upstream response is not surfaced cleanly through the MCP server.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CU-025` and confirm the expected signals without contradictory evidence.

- Objective: Verify a tight loop of `clickup.clickup_get_teams({})` calls eventually returns a 429 response with a retry-after value AND that waiting + retrying succeeds.
- Real user request: `"What happens when I hammer the ClickUp API?"`
- Prompt: `As a manual-testing orchestrator, drive the ClickUp API to a 429 by issuing rapid back-to-back requests through Code Mode against the live ClickUp API. Verify the response surfaces the 429 status and the retry-after header value. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: route through Code Mode `call_tool_chain`; loop `clickup_get_teams({})` until a 429 response is captured; record retry-after; wait; retry.
- Expected signals: at least one 429 response captured; response includes retry-after seconds; post-wait retry succeeds.
- Desired user-visible outcome: A short report quoting the iteration count to first 429, retry-after value, and post-wait verdict.
- Pass/fail: PASS if 429 surfaces with retry-after AND post-wait retry succeeds; FAIL if 429 never surfaces (no rate limit hit), retry-after absent, or post-wait still 429.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, drive the ClickUp API to a 429 by issuing rapid back-to-back requests through Code Mode against the live ClickUp API. Verify the response surfaces the 429 status and the retry-after header value. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "let i = 0; let last = null; while (i < 200) { try { last = await clickup.clickup_get_teams({}); i++; } catch(e) { return { iter: i, error: String(e), raw: e }; } } return { iter: i, last };" })` — tight loop until error
2. Inspect the returned error: confirm `429`, `rate limit`, or `Too Many Requests` text AND a retry-after seconds value
3. Wait the retry-after window (manually or via `await new Promise(r => setTimeout(r, retryAfterMs))` in a fresh chain call)
4. `call_tool_chain({ code: "return clickup.clickup_get_teams({});" })` — retry; should succeed

### Expected

- Step 1: returns an error object after some iteration count (within the 200 cap)
- Step 2: error contains 429 indicator AND retry-after value
- Step 3: wait completes
- Step 4: retry returns workspace teams successfully

### Evidence

Capture the iteration count when 429 first hit, the verbatim error response, the retry-after value, the wait duration, and the post-wait response.

### Pass / Fail

- **Pass**: 429 surfaces with retry-after AND post-wait retry succeeds.
- **Fail**: Loop completes without 429 (rate limit not exercised — try with bulk-write calls instead of read-only `get_teams`), retry-after missing from response, OR post-wait retry still 429.

### Failure Triage

1. If 200 iterations complete without 429: ClickUp's read-side rate limit may be high; switch the loop body to a write-heavy call (e.g., `clickup.clickup_create_task` against a throwaway list) which has tighter limits — and remember to clean up created tasks per CU-026 protocol.
2. If 429 surfaces but retry-after missing: capture the verbatim error and check whether the upstream MCP server is dropping headers; this is a critical retry-strategy bug for any production integration.
3. If post-wait retry still 429: the retry-after value may have been too short (e.g., bucket-based limits with longer cool-down); double the wait and re-retry.
4. If "tool not found": route to CM-005.

### Optional Supplemental Checks

- Compare the 429 surface from the MCP path vs the CLI path (e.g., `cu spaces` in a tight loop) — both should expose retry-after consistently.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | Recovery / rate-limit guidance |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (Edge cases / known limits: rate limits) |

---

## 5. SOURCE METADATA

- Group: RECOVERY AND RATE LIMITS
- Playbook ID: CU-025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--recovery-and-rate-limits/002-rate-limit-429-retry.md`

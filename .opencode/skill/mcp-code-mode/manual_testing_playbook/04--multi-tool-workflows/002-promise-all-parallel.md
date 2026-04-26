---
title: "CM-012 -- Promise.all parallel"
description: "This scenario validates Promise.all parallel execution for `CM-012`. It focuses on confirming that three independent tool calls inside `Promise.all` execute in parallel and all results return."
---

# CM-012 -- Promise.all parallel

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-012`.

---

## 1. OVERVIEW

This scenario validates `Promise.all` parallel execution for `CM-012`. It focuses on confirming that three independent tool calls wrapped in `Promise.all` execute concurrently inside a single `call_tool_chain` and all three results return.

### Why This Matters

Parallelism is the second primitive for non-trivial workflows. CU-017 (bulk operations) and BDG-015 (dual-instance) cross-reference this pattern. If parallelism is broken (calls execute sequentially or one fails to return), the token-and-wall-time efficiency of Code Mode collapses for multi-resource workflows.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CM-012` and confirm the expected signals without contradictory evidence.

- Objective: Verify `Promise.all([clickup_get_teams(), clickup_get_workspace_views(), clickup_get_user()])` returns all three results and total wall time < sum of individual times.
- Real user request: `"Get me my workspaces, views, and user info in one call."`
- Prompt: `As a manual-testing orchestrator, run three independent read-only ClickUp calls (get_teams, get_workspace_views, get_user) via Promise.all in a single call_tool_chain execution against the live ClickUp API. Verify all three return successfully. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: single `call_tool_chain` invocation with `Promise.all` wrapping the three calls; capture wall time.
- Expected signals: chain returns array of length 3; each entry is a non-error response; total wall time < sum of individual call times (parallel evidence).
- Desired user-visible outcome: A short report quoting the three result types, the total wall time, and an estimated parallelism factor with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if any call returns an error (auth, rate limit, missing tool), array length wrong, or wall time suggests serial execution.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, run three independent read-only ClickUp calls (get_teams, get_workspace_views, get_user) via Promise.all in a single call_tool_chain execution against the live ClickUp API. Verify all three return successfully. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "const t0 = Date.now(); const results = await Promise.all([clickup.clickup_get_teams({}), clickup.clickup_get_workspace_views({}), clickup.clickup_get_user({})]); return { count: results.length, wall_ms: Date.now() - t0, types: results.map(r => Array.isArray(r) ? 'array' : typeof r) };" })`
2. Inspect the returned object

### Expected

- Step 1: chain returns object with `count`, `wall_ms`, `types`
- Step 2: `count` === 3
- Step 2: each entry in `types` is an object/array (no `error` field at top level)
- Step 2: `wall_ms` < ~3 seconds for three live API calls (suggests parallel; serial would be ~3-5s on a slow connection)

### Evidence

Capture the verbatim chain response with timing.

### Pass / Fail

- **Pass**: 3 results, all non-error, parallel timing.
- **Fail**: count != 3 (one call dropped), any result is an error (auth or tool issue), or wall time suggests serial execution.

### Failure Triage

1. If count != 3: check `Promise.all` spelling; if a tool name is wrong, that promise rejects and the whole chain rejects (not partial). Wrap each call in try/catch (cross-reference CM-013) to identify which one failed.
2. If wall time is too long: try the three calls individually with timing; if individual times sum to > wall time, parallel is working but ClickUp is slow that day.
3. If types are wrong: read `tool_info({tool_name: ...})` for each tool to confirm response shape.

### Optional Supplemental Checks

- Try `Promise.allSettled` instead of `Promise.all` and confirm partial failures don't reject the whole chain.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | call_tool_chain spec; parallel-execution patterns |
| `.opencode/skill/mcp-clickup/SKILL.md` | ClickUp read-only tool catalog |

---

## 5. SOURCE METADATA

- Group: MULTI-TOOL WORKFLOWS
- Playbook ID: CM-012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--multi-tool-workflows/002-promise-all-parallel.md`

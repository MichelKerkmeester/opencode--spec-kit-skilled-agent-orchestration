---
title: "CM-018 -- Webflow list sites"
description: "This scenario validates Webflow site listing via Code Mode for `CM-018`. It focuses on confirming `webflow_list_sites` returns the operator's Webflow sites."
---

# CM-018 -- Webflow list sites

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-018`.

---

## 1. OVERVIEW

This scenario validates Webflow site listing via Code Mode for `CM-018`. It focuses on confirming `webflow.webflow_list_sites()` returns sites visible to the configured token — the discovery entry point for any Webflow CMS / publish workflow.

### Why This Matters

Webflow CMS sync is the primary publish workflow operators rely on Code Mode for. If site listing fails, no downstream CMS scenario works.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-018` and confirm the expected signals without contradictory evidence.

- Objective: Verify `webflow.webflow_list_sites()` returns an array of site objects, each with `id` and a display-name field.
- Real user request: `"What Webflow sites do I have access to?"`
- RCAF Prompt: `As a manual-testing orchestrator, list all Webflow sites visible to the configured token through Code Mode against the live Webflow API. Verify the response is a non-empty array (or explicit empty if account has no sites). Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: single `call_tool_chain` invocation; assumes `webflow_WEBFLOW_TOKEN` env var per CM-008.
- Expected signals: response is an array; each entry has `id` and `displayName` (or `name`); array length >= 0 (empty is valid for fresh accounts).
- Desired user-visible outcome: A short report listing site names + count and a PASS verdict.
- Pass/fail: PASS if response is well-shaped (array of objects with id+name) and auth succeeded; FAIL if auth error, response not an array, or entries missing required fields.

---

## 3. TEST EXECUTION

### Prompt

- RCAF Prompt: `As a manual-testing orchestrator, list all Webflow sites visible to the configured token through Code Mode against the live Webflow API. Verify the response is a non-empty array (or explicit empty if account has no sites). Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "const sites = await webflow.webflow_list_sites({}); return { count: sites.length, sample_id: sites[0]?.id, sample_name: sites[0]?.displayName || sites[0]?.name };" })`
2. Inspect the returned object

### Expected

- Step 1: chain returns object with `count`, `sample_id`, `sample_name`
- Step 2: `count` >= 0
- Step 2: if `count > 0`, `sample_id` is non-empty string and `sample_name` is non-empty string

### Evidence

Capture the chain response with count, sample id (REDACTED if needed), sample name.

### Pass / Fail

- **Pass**: Array returned with valid shape; auth succeeded.
- **Fail**: Auth error (token missing/invalid); response is not an array; entries lack required fields.

### Failure Triage

1. If 401: check `webflow_WEBFLOW_TOKEN` (note prefix per CM-008); regenerate token in Webflow account settings.
2. If response shape mismatch: `tool_info({tool_name: "webflow.webflow_list_sites"})` to confirm current shape; field names may vary by API version.
3. If empty array on an account that has sites: token may have insufficient scope; check Webflow API token permissions.

### Optional Supplemental Checks

- Pick the first site and call `webflow_get_site({site_id})` for deeper info; verifies the id is usable downstream.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | Webflow MCP integration notes |

---

## 5. SOURCE METADATA

- Group: THIRD-PARTY VIA CM
- Playbook ID: CM-018
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--third-party-via-cm/002-webflow-list-sites.md`

---
title: "CM-020 -- Notion search workspace"
description: "This scenario validates Notion workspace search via Code Mode for `CM-020`. It focuses on confirming `notion_search` returns workspace pages and databases."
---

# CM-020 -- Notion search workspace

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-020`.

---

## 1. OVERVIEW

This scenario validates Notion workspace search via Code Mode for `CM-020`. It focuses on confirming `notion.notion_search({query: ""})` returns workspace pages and databases visible to the integration token.

### Why This Matters

Notion is a primary knowledge-base / docs target for AI workflows. If search fails, no downstream scenario (page reads, database queries, content updates) is verifiable.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-020` and confirm the expected signals without contradictory evidence.

- Objective: Verify `notion.notion_search({query: ""})` returns object with `results` array; each result has `object` (page/database) and `id`.
- Real user request: `"What pages and databases are in my Notion workspace?"`
- Prompt: `As a manual-testing orchestrator, search the Notion workspace for any page through Code Mode against the configured Notion MCP server. Verify the response is a list of objects with object and id fields. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: single `call_tool_chain` invocation; assumes `notion_NOTION_TOKEN` env var per CM-008.
- Expected signals: response has `results` array; each result has `object` (one of `page` / `database`) and `id`; array length >= 0 (empty is valid if no shared pages).
- Desired user-visible outcome: A short report quoting count + sample object types and a PASS verdict.
- Pass/fail: PASS if all signals hold; FAIL if auth error, response missing `results` array, or entries missing required fields.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, search the Notion workspace for any page through Code Mode against the configured Notion MCP server. Verify the response is a list of objects with object and id fields. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "const search = await notion.notion_search({ query: '' }); const results = search.results || []; return { count: results.length, sample_object: results[0]?.object, sample_id: results[0]?.id };" })`
2. Inspect the returned object

### Expected

- Step 1: chain returns object with `count`, `sample_object`, `sample_id`
- Step 2: `count` >= 0
- Step 2: if `count > 0`, `sample_object` is `"page"` or `"database"`; `sample_id` is a non-empty UUID-style string

### Evidence

Capture the chain response with count + sample fields.

### Pass / Fail

- **Pass**: Search succeeded; results array shape correct.
- **Fail**: Auth error (token missing/invalid or integration not shared with any pages); response missing `results` field; entries lack `object`/`id`.

### Failure Triage

1. If 401: check `notion_NOTION_TOKEN` (note prefix per CM-008); confirm token is from a Notion integration (not a user OAuth token).
2. If `count` is 0 but workspace has pages: the integration may not be shared with any pages — share at least one page with the integration via Notion UI.
3. If response shape mismatch: `tool_info({tool_name: "notion.notion_search"})` to confirm current schema.

### Optional Supplemental Checks

- Call `notion_get_page({page_id})` for the first result; verifies the id is usable downstream.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-code-mode/SKILL.md` | Notion MCP integration notes |

---

## 5. SOURCE METADATA

- Group: THIRD-PARTY VIA CM
- Playbook ID: CM-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--third-party-via-cm/004-notion-search-workspace.md`

---
title: "CU-020 -- clickup_create_document create doc with markdown body (MCP-only)"
description: "This scenario validates `clickup.clickup_create_document` for `CU-020`. It focuses on creating a ClickUp doc with a markdown body — an MCP-only feature with no `cu` CLI equivalent."
---

# CU-020 -- clickup_create_document create doc with markdown body (MCP-only)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-020`.

---

## 1. OVERVIEW

This scenario validates `clickup.clickup_create_document` for `CU-020`. It focuses on creating a throwaway ClickUp document with a markdown body via Code Mode `call_tool_chain`. This is an MCP-only feature — there is no `cu` CLI equivalent.

### Why This Matters

ClickUp Documents are a separate surface from tasks (think wiki / runbook content). The MCP path is the only programmatic way to create them — confirming an explicit MCP-only contract from the Phase-1 inventory. A FAIL here proves either the MCP server lacks the tool or the auth scope is insufficient for docs; both are blocking for any docs-driven workflow.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-020` and confirm the expected signals without contradictory evidence.

- Objective: Verify `clickup.clickup_create_document` returns a doc id + name AND a follow-up read returns the same body markdown AND no `cu` CLI command offers an equivalent.
- Real user request: `"Create a ClickUp doc with these release notes."`
- Prompt: `As a manual-testing orchestrator, create a throwaway ClickUp document with a markdown body using clickup.clickup_create_document through Code Mode against the live ClickUp API. Verify the doc id can be re-fetched and the body matches. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: route through Code Mode `call_tool_chain`; supply a markdown body; capture the doc id; re-fetch with `clickup.clickup_get_document` (or equivalent); confirm CLI absence.
- Expected signals: create returns id+name; read returns the same body; CLI catalog has no `cu doc` / `cu document` command.
- Desired user-visible outcome: A short report quoting the doc id, the body round-trip verdict, and confirmation of CLI absence.
- Pass/fail: PASS if all three signals hold; FAIL otherwise.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, create a throwaway ClickUp document with a markdown body using clickup.clickup_create_document through Code Mode against the live ClickUp API. Verify the doc id can be re-fetched and the body matches. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "return clickup.clickup_create_document({ name: 'CU-020 throwaway', content: '# CU-020 test\\n\\nMarkdown body for round-trip check.' /* and required parent space/folder per tool_info */ });" })` — create
2. Extract the doc id from the response
3. `call_tool_chain({ code: "return clickup.clickup_get_document({ doc_id: '<docId>' });" })` — read back (use the actual get tool name from `tool_info({tool_name:'clickup.clickup_create_document'})` if `get_document` is named differently)
4. `bash: cu --help 2>&1 | grep -i 'doc'` — confirm no CLI doc command exists
5. Cleanup: `call_tool_chain({ code: "return clickup.clickup_delete_document({ doc_id: '<docId>' });" })` if a delete tool exists, otherwise document the cleanup gap

### Expected

- Step 1: returns doc `id` and `name`
- Step 2: id extraction succeeds
- Step 3: read returns the same body markdown
- Step 4: no `cu doc` / `cu document` command surfaces
- Step 5: cleanup succeeds OR gap is documented

### Evidence

Capture the verbatim Code Mode `code` argument and tool-call response for create, read, and cleanup. Pin the doc id, the body round-trip verdict, and the CLI-absence verdict.

### Pass / Fail

- **Pass**: Doc created, body round-trips, CLI has no equivalent.
- **Fail**: Create fails, body mismatch, OR a `cu doc` command is found (which would invalidate the MCP-only claim).

### Failure Triage

1. If create returns "tool not found" naming `clickup.clickup_create_document`: route to CM-005 (correct manual.tool form); the upstream `@taazkareem/clickup-mcp-server` may not expose this tool — verify with `list_tools()` and `tool_info`.
2. If create returns 401 / auth error: route to CU-027 (env-prefix mismatch); the MCP token may lack docs scope — check ClickUp Settings > Apps > API Token > Scopes.
3. If body round-trip mismatch (e.g., markdown rendered to HTML): check `tool_info` for the canonical body field name (`content` vs `body` vs `markdown`); the tool may expect a structured AST instead of raw markdown.
4. If a `cu doc` command IS found: capture and update Phase-1 inventory in research.md §3 — the MCP-only claim is no longer accurate.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | MCP tool catalog (`clickup_create_document`) |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (CLI vs MCP parity: docs MCP-only) |

---

## 5. SOURCE METADATA

- Group: MCP ENTERPRISE
- Playbook ID: CU-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--mcp-enterprise/001-mcp-create-document.md`

---
title: "CM-017 -- Figma file metadata"
description: "This scenario validates Figma file metadata fetch via Code Mode for `CM-017`. It focuses on confirming the Figma MCP returns name, lastModified, and document tree for a known file."
---

# CM-017 -- Figma file metadata

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-017`.

---

## 1. OVERVIEW

This scenario validates Figma file metadata fetch via Code Mode for `CM-017`. It focuses on confirming `figma.figma_get_file({file_key})` returns the expected metadata fields (`name`, `lastModified`, `document` tree) — the entry point for any design-to-code workflow.

### Why This Matters

Figma is a primary integration target for design-to-task / design-to-code workflows. If file metadata fetch breaks, every downstream Figma scenario (image export, component lookup, comments) is unverifiable.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-017` and confirm the expected signals without contradictory evidence.

- Objective: Verify `figma.figma_get_file({file_key: "<test-file>"})` returns object with `name`, `lastModified`, and `document` containing at least one child node.
- Real user request: `"Get the metadata for our design file."`
- Prompt: `As a manual-testing orchestrator, fetch metadata for a public Figma file through Code Mode against the configured Figma MCP server. Verify the response contains name, lastModified, and a document tree. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: requires `FIGMA_FILE_KEY` (operator-provided test file key) and `figma_FIGMA_TOKEN` env var (per CM-008).
- Expected signals: response is an object; `name` is a string; `lastModified` is an ISO date string; `document` has at least one child.
- Desired user-visible outcome: A short report quoting file name + last modified + child count and a PASS verdict.
- Pass/fail: PASS if all four signals hold; FAIL if response is empty (auth failure), missing fields (schema drift), or `document` has no children (file is empty — verify in Figma UI).

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, fetch metadata for a public Figma file through Code Mode against the configured Figma MCP server. Verify the response contains name, lastModified, and a document tree. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Confirm `FIGMA_FILE_KEY` is set (operator-provided)
2. `call_tool_chain({ code: "const file = await figma.figma_get_file({ file_key: '${FIGMA_FILE_KEY}' }); return { name: file.name, lastModified: file.lastModified, has_document: !!file.document, child_count: (file.document?.children || []).length };" })`
3. Inspect the returned object

### Expected

- Step 2: chain returns object with `name`, `lastModified`, `has_document`, `child_count`
- Step 3: `name` is a non-empty string
- Step 3: `lastModified` matches ISO date pattern `YYYY-MM-DDTHH:MM:SSZ`
- Step 3: `has_document` is true and `child_count` >= 1

### Evidence

Capture the chain response with all four fields.

### Pass / Fail

- **Pass**: All four fields present and well-formed.
- **Fail**: Auth error (check `figma_FIGMA_TOKEN` per CM-008); response missing fields (schema drift); empty document (file genuinely empty — verify in Figma).

### Failure Triage

1. If 401/403: token missing or invalid; check `.env` has `figma_FIGMA_TOKEN=<valid_token>` (note prefix per CM-008).
2. If file_key not found: confirm key is from the URL after `/file/` and before any other path; if private file, ensure token has access.
3. If response shape is unexpected: `tool_info({tool_name: "figma.figma_get_file"})` to inspect the schema.

### Optional Supplemental Checks

- Try a non-existent file_key; should return a deterministic 404 / not-found error.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-figma/SKILL.md` | Figma MCP tool catalog |

---

## 5. SOURCE METADATA

- Group: THIRD-PARTY VIA CM
- Playbook ID: CM-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--third-party-via-cm/001-figma-file-metadata.md`

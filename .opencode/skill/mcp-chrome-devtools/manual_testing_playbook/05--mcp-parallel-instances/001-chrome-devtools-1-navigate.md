---
title: "BDG-014 -- chrome_devtools_1 navigate via Code Mode"
description: "This scenario validates Code Mode invocation of `chrome_devtools_1` for `BDG-014`. It focuses on confirming a navigate + screenshot round-trip via the manual-namespace contract returns valid bytes."
---

# BDG-014 -- chrome_devtools_1 navigate via Code Mode

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-014`.

---

## 1. OVERVIEW

This scenario validates Code Mode invocation of the `chrome_devtools_1` MCP instance for `BDG-014`. It focuses on confirming a `navigate_page` call to `https://example.com` succeeds and that a follow-up `take_screenshot` returns base64 image bytes of length > 1000 (a real PNG of the example page is ~5-15 KB base64-encoded). This is the entry-point smoke test for the MCP parallel-instances category and depends on the manual-namespace contract validated in CM-005..CM-007 plus the via-Code-Mode patterns in CM-014..CM-016.

### Why This Matters

`chrome_devtools_1` is the parallel-instance fallback to the bdg CLI: it's how operators run multiple isolated browsers concurrently. If the navigate call fails or screenshot returns wrong-shape bytes, every parallel browser workflow (BDG-015..BDG-018) fails for the same root cause. Establishing a single-instance round-trip first isolates "Code Mode + manual namespace" issues from "parallelism" issues.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `BDG-014` and confirm the expected signals without contradictory evidence.

- Objective: Verify `chrome_devtools_1.chrome_devtools_1_navigate_page({url: 'https://example.com'})` succeeds via Code Mode and that a subsequent `take_screenshot` returns base64 of length > 1000.
- Real user request: `"Open example.com in chrome_devtools_1 and take a screenshot."`
- Prompt: `As a manual-testing orchestrator, navigate chrome_devtools_1 to https://example.com through Code Mode against the configured chrome_devtools_1 MCP server. Verify the call succeeds and screenshot returns valid bytes. Cross-reference: this scenario depends on CM-005 (correct manual.tool form) and CM-015 (Chrome navigate + screenshot). Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: build a Code Mode script that calls navigate then screenshot via `call_tool_chain`; execute; assert success and base64 length.
- Expected signals: navigate call returns success (no thrown error); screenshot returns base64 string with length > 1000.
- Desired user-visible outcome: A short report quoting the navigated URL, screenshot byte length, and "VALID PNG" with a PASS verdict.
- Pass/fail: PASS if both signals hold; FAIL if navigate errors, screenshot returns empty/short payload, or the manual-namespace lookup fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, navigate chrome_devtools_1 to https://example.com through Code Mode against the configured chrome_devtools_1 MCP server. Verify the call succeeds and screenshot returns valid bytes. Cross-reference: this scenario depends on CM-005 (correct manual.tool form) and CM-015 (Chrome navigate + screenshot). Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Precondition: `chrome_devtools_1` is registered in `.utcp_config.json`; verify with `bash: jq '.manuals | keys' .utcp_config.json | grep chrome_devtools_1`
2. Code Mode script — build and dispatch via `call_tool_chain`:
   ```ts
   const nav = await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: 'https://example.com' });
   const shot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
   return { nav, shotLen: (shot?.data ?? shot)?.length ?? 0 };
   ```
3. Assert: `result.shotLen > 1000`

### Expected

- Step 1: `.utcp_config.json` lists `chrome_devtools_1` under `manuals`
- Step 2: navigate returns success; screenshot returns base64 payload
- Step 3: byte length > 1000 (real PNG, not error stub)

### Evidence

Capture the Code Mode script, the returned object (or summarized fields), and the asserted byte length.

### Pass / Fail

- **Pass**: navigate succeeds AND `shotLen > 1000`.
- **Fail**: manual not registered (cross-reference CM-005 manual-namespace contract); navigate throws; screenshot returns empty / short payload (< 1000 bytes likely indicates an error stub, not a real PNG).

### Failure Triage

1. If the call errors with "manual not found" or "tool not found": confirm the namespace pattern matches CM-005 — the call must be `chrome_devtools_1.chrome_devtools_1_<tool>`, not `chrome_devtools_1_<tool>` directly; cross-reference CM-014 for the canonical Chrome via Code Mode pattern.
2. If `shotLen` is suspiciously small (< 1000): inspect the raw return object — the MCP may have returned an error envelope rather than a base64 payload; cross-reference CM-015 for the screenshot-shape contract and confirm the underlying browser is reachable with `bdg --version` (BDG-001).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `.opencode/skill/mcp-code-mode/manual_testing_playbook/manual_testing_playbook.md` | CM playbook (CM-005..CM-007 manual-namespace, CM-014..CM-016 Chrome via CM) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | chrome_devtools_1 MCP reference |
| `.opencode/skill/mcp-code-mode/SKILL.md` | Code Mode + manual-namespace contract |

---

## 5. SOURCE METADATA

- Group: MCP PARALLEL INSTANCES
- Playbook ID: BDG-014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--mcp-parallel-instances/001-chrome-devtools-1-navigate.md`

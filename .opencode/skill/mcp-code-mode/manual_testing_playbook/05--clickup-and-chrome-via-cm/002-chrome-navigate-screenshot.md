---
title: "CM-015 -- Chrome navigate + screenshot"
description: "This scenario validates Chrome DevTools navigation and screenshot capture via Code Mode for `CM-015`. It focuses on confirming a chain can navigate Chrome to a URL then take a screenshot through `chrome_devtools_1` MCP."
---

# CM-015 -- Chrome navigate + screenshot

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CM-015`.

---

## 1. OVERVIEW

This scenario validates Chrome DevTools navigation + screenshot via Code Mode for `CM-015`. It focuses on confirming a chain can call `chrome_devtools_1.chrome_devtools_1_navigate_page` followed by `chrome_devtools_1.chrome_devtools_1_take_screenshot` and receive a base64-encoded PNG image.

### Why This Matters

This is the canonical browser-automation smoke test through Code Mode. BDG-014..BDG-018 reference this pattern. If navigation succeeds but screenshot returns empty bytes, the failure mode is opaque to operators (the page may look fine in headless mode but render blank).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CM-015` and confirm the expected signals without contradictory evidence.

- Objective: Verify `navigate_page({url})` then `take_screenshot()` returns a base64 string of length > 1000, with PNG magic bytes when decoded.
- Real user request: `"Take a screenshot of example.com via Chrome DevTools."`
- Prompt: `As a manual-testing orchestrator, navigate Chrome to https://example.com then take a screenshot through Code Mode against the chrome_devtools_1 MCP instance. Verify navigation succeeds and screenshot returns image bytes. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: single `call_tool_chain` invocation; assumes Chrome DevTools MCP is configured as `chrome_devtools_1` in `.utcp_config.json`.
- Expected signals: navigate returns success; screenshot returns base64 string of length > 1000; decoded bytes start with PNG magic header `89 50 4E 47`.
- Desired user-visible outcome: A short report stating screenshot length and PNG magic verification with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if navigate errors, screenshot returns empty/short string, or decoded bytes don't start with PNG header.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, navigate Chrome to https://example.com then take a screenshot through Code Mode against the chrome_devtools_1 MCP instance. Verify navigation succeeds and screenshot returns image bytes. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `call_tool_chain({ code: "await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: 'https://example.com' }); const shot = await chrome_devtools_1.chrome_devtools_1_take_screenshot({}); return { length: (shot.data || shot).length, head: (shot.data || shot).slice(0, 16) };" })`
2. Inspect the returned object
3. Optional: `bash: echo '<base64-head>' | base64 -d | xxd | head -1` — verify PNG magic `89 50 4e 47`

### Expected

- Step 1: chain returns object with `length` and `head`
- Step 2: `length` > 1000
- Step 3: decoded `head` bytes start with `89 50 4e 47` (PNG magic)

### Evidence

Capture the chain response (with full base64 truncated for brevity, just length + head bytes) and the magic-byte check result.

### Pass / Fail

- **Pass**: Length > 1000 AND PNG magic bytes confirmed.
- **Fail**: Navigate error (URL or browser unreachable); screenshot empty (short/zero length — page didn't render); magic bytes wrong (not actually a PNG).

### Failure Triage

1. If navigate errors: check `chrome_devtools_1` is configured in `.utcp_config.json`; verify Chrome/Chromium is installed (`which google-chrome chromium-browser`); restart Code Mode.
2. If screenshot is empty: try `wait_for({selector: "h1"})` between navigate and screenshot; some pages need extra time to render.
3. If magic bytes wrong: response shape may have changed — `tool_info({tool_name: "chrome_devtools_1.chrome_devtools_1_take_screenshot"})` to confirm format (some versions return JPEG instead of PNG).

### Optional Supplemental Checks

- Save the screenshot to disk and open it visually; confirms the page rendered as expected (not just bytes-look-right).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | Chrome DevTools MCP tool catalog |

---

## 5. SOURCE METADATA

- Group: CLICKUP AND CHROME VIA CM
- Playbook ID: CM-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--clickup-and-chrome-via-cm/002-chrome-navigate-screenshot.md`

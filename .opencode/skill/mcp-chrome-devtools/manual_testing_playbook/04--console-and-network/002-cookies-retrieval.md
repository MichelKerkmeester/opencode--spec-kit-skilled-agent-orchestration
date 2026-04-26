---
title: "BDG-012 -- Cookies retrieval"
description: "This scenario validates cookie retrieval for `BDG-012`. It focuses on confirming `bdg network getCookies` returns a valid JSON array (possibly empty) for the active page."
---

# BDG-012 -- Cookies retrieval

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-012`.

---

## 1. OVERVIEW

This scenario validates cookie retrieval for `BDG-012`. It focuses on confirming `bdg network getCookies` returns a valid JSON array for the active page. An empty array is acceptable for `https://example.com` (which sets no cookies); the contract is "valid JSON array of length >= 0", not "non-empty".

### Why This Matters

Cookies are the primary mechanism for session state, authentication, and tracking in browser automation. If `getCookies` returns malformed JSON or errors against a known-good page, every authenticated-flow workflow breaks. Using `https://example.com` (which sets no cookies) tests the empty-array case explicitly — a surprisingly common bug is "non-empty assumed" code that crashes on legitimately empty responses.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `BDG-012` and confirm the expected signals without contradictory evidence.

- Objective: Verify `bdg network getCookies 2>&1 | jq '.'` succeeds and returns a JSON array (length may be 0).
- Real user request: `"Show me the cookies on this page."`
- Prompt: `As a manual-testing orchestrator, retrieve cookies from the active page through the bdg CLI against an active session. Verify output is JSON array (may be empty for example.com). Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: assumes active session (BDG-002); run getCookies; verify JSON-array shape.
- Expected signals: `bdg network getCookies` exits 0; `jq '.'` parses successfully; `jq 'type'` reports `array`.
- Desired user-visible outcome: A short report stating the cookie count (e.g., "0 cookies on example.com") with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if the command errors, JSON parse fails, or the result is not an array.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, retrieve cookies from the active page through the bdg CLI against an active session. Verify output is JSON array (may be empty for example.com). Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Precondition: active bdg session (BDG-002); verify with `bash: bdg status 2>&1`
2. `bash: bdg network getCookies 2>&1`
3. `bash: bdg network getCookies 2>&1 | jq '.'`
4. `bash: bdg network getCookies 2>&1 | jq 'type'`
5. `bash: bdg network getCookies 2>&1 | jq 'length'`

### Expected

- Step 2: exits 0; produces JSON output
- Step 3: parses successfully (no jq error)
- Step 4: returns `"array"`
- Step 5: returns an integer >= 0 (likely 0 for `example.com`)

### Evidence

Capture all command outputs and the parsed type / length values.

### Pass / Fail

- **Pass**: command exit 0 AND jq parses AND type is `"array"` AND length is integer >= 0.
- **Fail**: command errors (no active session — cross-reference BDG-002); jq parse error (malformed output); type is not `array` (wrapper-shape regression).

### Failure Triage

1. If `jq '.'` reports parse error: dump the raw output with `bdg network getCookies 2>&1` and inspect — the surface may be wrapping the array in a status envelope (e.g., `{"ok":true,"data":[...]}`); update the assertion path or cross-reference BDG-002 if the session is dead.
2. If `type` returns `object` instead of `array`: the response shape changed upstream; inspect with `bdg network getCookies 2>&1 | jq 'keys'` and adapt the assertion to navigate to the array (commonly `.cookies` or `.data`).

### Optional Supplemental Checks

- Navigate to a cookie-setting page (`bdg https://www.google.com`) and re-run to confirm non-empty case works; expect length > 0.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | bdg network getCookies reference |

---

## 5. SOURCE METADATA

- Group: CONSOLE AND NETWORK
- Playbook ID: BDG-012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--console-and-network/002-cookies-retrieval.md`

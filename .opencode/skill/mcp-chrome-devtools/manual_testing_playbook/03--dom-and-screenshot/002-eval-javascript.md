---
title: "BDG-009 -- Eval JavaScript"
description: "This scenario validates JavaScript evaluation in the active page for `BDG-009`. It focuses on confirming `bdg dom eval \"document.title\"` returns the page title string."
---

# BDG-009 -- Eval JavaScript

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-009`.

---

## 1. OVERVIEW

This scenario validates JavaScript evaluation in the active page for `BDG-009`. It focuses on confirming that `bdg dom eval "document.title"` executes against the live page and returns a string containing "Example" (the start of "Example Domain", the canonical title of `https://example.com`).

### Why This Matters

`dom eval` is the universal escape hatch for bdg: anything not directly exposed by `dom query` or `network` becomes accessible via inline JavaScript. If eval returns the wrong type, an error, or empty, every advanced scraping or interaction workflow breaks. This scenario uses `document.title` because it's the simplest non-trivial expression that exercises the full eval round-trip.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-009` and confirm the expected signals without contradictory evidence.

- Objective: Verify `bdg dom eval "document.title"` returns a non-empty string containing "Example".
- Real user request: `"What's the title of this page?"`
- Prompt: `As a manual-testing orchestrator, evaluate JavaScript on the active page through the bdg CLI against an active session on https://example.com. Verify the returned title matches Example Domain. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: assumes active session on `https://example.com` (BDG-002 prerequisite); run a single eval.
- Expected signals: `bdg dom eval "document.title"` exits 0; result is a non-empty string containing "Example".
- Desired user-visible outcome: A short report quoting the title string with a PASS verdict.
- Pass/fail: PASS if both signals hold; FAIL if eval errors, returns empty, returns the wrong type, or the title text mismatches.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, evaluate JavaScript on the active page through the bdg CLI against an active session on https://example.com. Verify the returned title matches Example Domain. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Precondition: BDG-002 has started a session against `https://example.com`; verify with `bash: bdg status 2>&1 | grep -i example.com`
2. `bash: bdg dom eval "document.title" 2>&1`
3. `bash: bdg dom eval "document.title" 2>&1 | grep -i Example`

### Expected

- Step 2: returns a JSON-encoded string or quoted text containing "Example Domain"; exit code 0
- Step 3: matches at least one line containing "Example"; exit code 0

### Evidence

Capture session status, raw eval output, and the grep match output.

### Pass / Fail

- **Pass**: eval returns non-empty string AND grep matches "Example".
- **Fail**: eval errors (likely no active session — cross-reference BDG-002); returns wrong type (e.g., `undefined`); returns empty; title mismatched.

### Failure Triage

1. If eval returns `undefined` or errors: confirm session is alive via `bdg status 2>&1` and the page has finished loading with `bdg dom eval "document.readyState"` — if not `complete`, the eval ran before parse finished.
2. If eval returns a value but the grep misses: dump the raw output with `bdg dom eval "JSON.stringify({title: document.title, url: location.href})"` and verify the URL is actually `example.com` — the active session may have navigated elsewhere (cross-reference BDG-008 for selector-level confirmation).

### Optional Supplemental Checks

- Run `bdg dom eval "1+1"` to confirm the eval transport itself is healthy independent of any page state.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | bdg dom eval reference |

---

## 5. SOURCE METADATA

- Group: DOM AND SCREENSHOT
- Playbook ID: BDG-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--dom-and-screenshot/002-eval-javascript.md`

---
title: "BDG-008 -- Query selector"
description: "This scenario validates DOM querying for `BDG-008`. It focuses on confirming `bdg dom query \"h1\"` returns the matching element with text content from the active page."
---

# BDG-008 -- Query selector

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-008`.

---

## 1. OVERVIEW

This scenario validates DOM querying for `BDG-008`. It focuses on confirming `bdg dom query "h1"` returns at least one matching element from an active session against `https://example.com` and that the rendered text "Example Domain" appears in the output.

### Why This Matters

DOM query is the most common bdg-CLI operation: scrape a heading, count buttons, extract a link. If query returns empty for a page that demonstrably contains the selector, every downstream automation fails silently. This scenario uses `https://example.com` as a stable fixture (its h1 is "Example Domain" and rarely changes) so failures point at bdg, not the page.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `BDG-008` and confirm the expected signals without contradictory evidence.

- Objective: Verify `bdg dom query "h1"` returns non-empty output containing "Example Domain".
- Real user request: `"Get the h1 from example.com."`
- Prompt: `As a manual-testing orchestrator, query the page for h1 elements through the bdg CLI against an active session on https://example.com. Verify output contains the h1 text. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: assumes active session on `https://example.com` (BDG-002 prerequisite); run a single query.
- Expected signals: `bdg dom query "h1"` exits 0 with non-empty output; output contains "Example Domain".
- Desired user-visible outcome: A short report quoting the captured h1 text with a PASS verdict.
- Pass/fail: PASS if both signals hold; FAIL if query returns empty or the h1 text is missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, query the page for h1 elements through the bdg CLI against an active session on https://example.com. Verify output contains the h1 text. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Precondition: BDG-002 has started a session against `https://example.com`; verify with `bash: bdg status 2>&1 | grep -i example.com`
2. `bash: bdg dom query "h1" 2>&1`
3. `bash: bdg dom query "h1" 2>&1 | grep -i "Example Domain"`

### Expected

- Step 2: returns non-empty output describing the matched element(s); exit code 0
- Step 3: matches at least one line containing "Example Domain"; exit code 0

### Evidence

Capture session status, full query output, and the grep match output.

### Pass / Fail

- **Pass**: query returns non-empty output AND grep matches "Example Domain".
- **Fail**: no active session (cross-reference BDG-002); query returns empty (page may not have loaded — check `bdg status`); query returns elements but text mismatched (page upstream changed).

### Failure Triage

1. If `bdg status` does not show `https://example.com`: cross-reference BDG-002 (session start) — operator may need to start a fresh session with `bdg https://example.com` before re-running this scenario.
2. If query returns empty for `h1`: verify the page actually loaded with `bdg dom eval "document.readyState"` (cross-reference BDG-009) — if not `complete`, wait and retry; if still empty, dump the full DOM with `bdg dom eval "document.documentElement.outerHTML"` and inspect for redirect/error markup.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | bdg dom query selector reference |

---

## 5. SOURCE METADATA

- Group: DOM AND SCREENSHOT
- Playbook ID: BDG-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--dom-and-screenshot/001-query-selector.md`

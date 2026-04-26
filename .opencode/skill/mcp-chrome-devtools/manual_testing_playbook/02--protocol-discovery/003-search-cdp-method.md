---
title: "BDG-007 -- Search CDP method"
description: "This scenario validates CDP method search for `BDG-007`. It focuses on confirming `bdg cdp --search screenshot` returns matches that include `Page.captureScreenshot` or equivalent."
---

# BDG-007 -- Search CDP method

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-007`.

---

## 1. OVERVIEW

This scenario validates CDP method search for `BDG-007`. It focuses on confirming that `bdg cdp --search screenshot` returns at least one match that includes `captureScreenshot` (typically under the `Page` domain).

### Why This Matters

Search closes the loop on protocol discovery: operators rarely know the exact `<Domain>.<method>` they need, so search by intent keyword is the fastest path from "I want to take a screenshot" to "call `Page.captureScreenshot`". This scenario validates that the search index is populated and surfaces the most common matches; BDG-005 and BDG-006 cover catalog and introspection respectively.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-007` and confirm the expected signals without contradictory evidence.

- Objective: Verify `bdg cdp --search screenshot` returns non-empty matches and that output mentions `captureScreenshot` (likely qualified as `Page.captureScreenshot`).
- Real user request: `"Find a Chrome DevTools Protocol method for taking a screenshot."`
- Prompt: `As a manual-testing orchestrator, search CDP methods for screenshot through the bdg CLI against the live CDP catalog. Verify output mentions Page.captureScreenshot. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: run a single CLI search and grep for the expected match.
- Expected signals: `bdg cdp --search screenshot` exits 0 with non-empty output; output contains `captureScreenshot`.
- Desired user-visible outcome: A short report quoting the matched method with a PASS verdict.
- Pass/fail: PASS if the search returns at least one match including `captureScreenshot`; FAIL if output is empty or `captureScreenshot` is absent.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, search CDP methods for screenshot through the bdg CLI against the live CDP catalog. Verify output mentions Page.captureScreenshot. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: bdg cdp --search screenshot 2>&1`
2. `bash: bdg cdp --search screenshot 2>&1 | grep -i captureScreenshot`

### Expected

- Step 1: returns non-empty list of matching methods (each typically `Domain.method`); exit code 0
- Step 2: matches at least one line containing `captureScreenshot`; exit code 0

### Evidence

Capture full search output and the grep match output.

### Pass / Fail

- **Pass**: search returns non-empty output AND grep matches `captureScreenshot`.
- **Fail**: search returns empty output (search index broken); output non-empty but `captureScreenshot` is absent.

### Failure Triage

1. If `--search screenshot` returns empty output: try the broader query `bdg cdp --search capture 2>&1` and cross-reference BDG-005 — if the CDP catalog itself is empty the search index is downstream of a broken catalog load.
2. If matches present but `captureScreenshot` missing: confirm via `bdg cdp --describe Page 2>&1 | grep -i capture` that the method still exists upstream; cross-reference BDG-006 if the `Page` domain itself is unknown.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | bdg cdp --search usage |

---

## 5. SOURCE METADATA

- Group: PROTOCOL DISCOVERY
- Playbook ID: BDG-007
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--protocol-discovery/003-search-cdp-method.md`

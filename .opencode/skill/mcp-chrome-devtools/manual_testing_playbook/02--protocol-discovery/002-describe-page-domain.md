---
title: "BDG-006 -- Describe Page domain"
description: "This scenario validates CDP domain introspection for `BDG-006`. It focuses on confirming `bdg cdp --describe Page` returns method signatures including the core navigate and reload methods."
---

# BDG-006 -- Describe Page domain

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-006`.

---

## 1. OVERVIEW

This scenario validates CDP domain introspection for `BDG-006`. It focuses on confirming `bdg cdp --describe Page` returns the method signatures for the `Page` domain and that core navigation methods (`navigate`, `reload`) appear in the output.

### Why This Matters

The `--describe` surface is how operators discover the exact method names and parameter shapes they need before issuing raw CDP calls. Without it, every advanced workflow degrades to guesswork. This scenario establishes that introspection works for the most-used domain and complements BDG-005 (list catalog) and BDG-007 (search method).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-006` and confirm the expected signals without contradictory evidence.

- Objective: Verify `bdg cdp --describe Page` returns non-empty method documentation containing `navigate` and `reload`.
- Real user request: `"What methods does the Page CDP domain expose?"`
- RCAF Prompt: `As a manual-testing orchestrator, describe the Page CDP domain through the bdg CLI against the live CDP catalog. Verify output lists at least navigate and reload methods. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: run a single CLI command and grep output for the core method names.
- Expected signals: `bdg cdp --describe Page` exits 0 with non-empty output; output mentions `navigate` and `reload`.
- Desired user-visible outcome: A short report quoting the matched method names with a PASS verdict.
- Pass/fail: PASS if both methods appear; FAIL if output is empty, the domain is reported as unknown, or either method is missing.

---

## 3. TEST EXECUTION

### Prompt

- RCAF Prompt: `As a manual-testing orchestrator, describe the Page CDP domain through the bdg CLI against the live CDP catalog. Verify output lists at least navigate and reload methods. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: bdg cdp --describe Page 2>&1`
2. `bash: bdg cdp --describe Page 2>&1 | grep -E "\b(navigate|reload)\b"`

### Expected

- Step 1: returns method signatures and parameter shapes for the `Page` domain; exit code 0
- Step 2: matches at least one occurrence of `navigate` and one of `reload`; exit code 0

### Evidence

Capture full `--describe Page` output and the grep match output.

### Pass / Fail

- **Pass**: `--describe Page` returns non-empty output AND grep matches both `navigate` and `reload`.
- **Fail**: `--describe Page` errors with "unknown domain" (catalog mismatch — cross-reference BDG-005); output non-empty but missing either core method.

### Failure Triage

1. If `--describe Page` errors with "unknown domain": confirm the domain exists in the catalog via `bdg cdp --list 2>&1 | grep -i page` and cross-reference BDG-005 — domain casing may have shifted upstream.
2. If output present but missing `navigate` or `reload`: dump method names with `bdg cdp --describe Page 2>&1 | grep -E "^\s*(method|name|navigate|reload)" | sort -u` and inspect for renamed methods; upstream CDP versions occasionally rename methods between Chrome releases.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | bdg cdp --describe usage |

---

## 5. SOURCE METADATA

- Group: PROTOCOL DISCOVERY
- Playbook ID: BDG-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--protocol-discovery/002-describe-page-domain.md`

---
title: "BDG-003 -- Status JSON"
description: "This scenario validates bdg status JSON output for `BDG-003`. It focuses on confirming `bdg status` returns valid JSON with state and url fields."
---

# BDG-003 -- Status JSON

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-003`.

---

## 1. OVERVIEW

This scenario validates bdg status JSON output for `BDG-003`. It focuses on confirming `bdg status 2>&1` returns parseable JSON containing at minimum `state` and `url` fields, so downstream scripts can reliably parse the session state.

### Why This Matters

Operator scripts often pipe `bdg status` to `jq` to make decisions (e.g., "if state != active then start session"). If the output is non-JSON or missing expected fields, scripted automation breaks silently.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `BDG-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify `bdg status 2>&1 | jq '.'` succeeds AND parsed object contains `state` and `url` fields.
- Real user request: `"Get the bdg status as JSON."`
- Prompt: `As a manual-testing orchestrator, query bdg session status as JSON through the bdg CLI against an active session. Verify output is valid JSON with state and url fields. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: assumes BDG-002 ran successfully (active session); run jq pipeline.
- Expected signals: jq pipeline succeeds (no parse error); fields `state` and `url` present.
- Desired user-visible outcome: A short report quoting the parsed `state` and `url` values with a PASS verdict.
- Pass/fail: PASS if both signals hold; FAIL if output isn't valid JSON or fields missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, query bdg session status as JSON through the bdg CLI against an active session. Verify output is valid JSON with state and url fields. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Precondition: BDG-002 has started a session (run `bdg https://example.com` if not)
2. `bash: bdg status 2>&1 | jq '.state, .url'`

### Expected

- Step 2: jq exits 0; output contains a state value (e.g., `"active"`, `"running"`) and a URL string

### Evidence

Capture jq output verbatim.

### Pass / Fail

- **Pass**: jq parses successfully; both `state` and `url` present.
- **Fail**: jq parse error (output isn't JSON); `state` or `url` missing (schema drift).

### Failure Triage

1. If jq parse error: bdg may print non-JSON status when no session is active — start a session first per BDG-002.
2. If fields missing: schema may have evolved; compare to bdg's documented status fields in SKILL.md or `bdg help status`.
3. If output mixes JSON and plain text: bdg may be writing logs to stdout instead of stderr; redirect with `bdg status 2>/dev/null` and re-test.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | bdg status JSON schema |

---

## 5. SOURCE METADATA

- Group: CLI BDG LIFECYCLE
- Playbook ID: BDG-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-bdg-lifecycle/003-status-json.md`

---
title: "BDG-013 -- HAR export"
description: "This scenario validates HAR network archive export for `BDG-013`. It focuses on confirming `bdg network har` writes a valid HAR-format JSON file to disk."
---

# BDG-013 -- HAR export

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-013`.

---

## 1. OVERVIEW

This scenario validates HAR (HTTP Archive) export for `BDG-013`. It focuses on confirming `bdg network har /tmp/bdg.har` writes a valid HAR-format JSON file containing a `log.version` field — the canonical HAR root marker.

### Why This Matters

HAR is the standard interchange format for network diagnostics: any tool that imports browser network captures (Chrome DevTools, Wireshark, hosted analyzers) consumes HAR. If the exporter writes invalid HAR, the file is unusable downstream regardless of file existence or size. The `log.version` check is the cheapest reliable signal that the writer produced a real HAR rather than a JSON blob shaped like one.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `BDG-013` and confirm the expected signals without contradictory evidence.

- Objective: Verify `bdg network har /tmp/bdg.har` exits 0; the file exists; and `jq '.log.version'` returns a non-empty version string.
- Real user request: `"Save the network activity for this page as a HAR file."`
- Prompt: `As a manual-testing orchestrator, export the page network activity as HAR through the bdg CLI against an active session. Verify the file is created and is valid HAR JSON. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: assumes active session (BDG-002); export HAR to `/tmp/bdg.har`; verify file existence and HAR-shape signature.
- Expected signals: command exits 0; `/tmp/bdg.har` exists; `jq '.log.version'` returns a quoted version string (typically `"1.2"`).
- Desired user-visible outcome: A short report quoting the file path, size, and HAR version with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if the command errors, the file is missing, the file is not valid JSON, or `log.version` is absent.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, export the page network activity as HAR through the bdg CLI against an active session. Verify the file is created and is valid HAR JSON. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Precondition: active bdg session (BDG-002); verify with `bash: bdg status 2>&1`
2. `bash: rm -f /tmp/bdg.har` — clean any prior artifact
3. `bash: bdg network har /tmp/bdg.har 2>&1`
4. `bash: ls -la /tmp/bdg.har`
5. `bash: cat /tmp/bdg.har | jq '.log.version'`
6. `bash: cat /tmp/bdg.har | jq '.log.entries | length'`

### Expected

- Step 3: exits 0
- Step 4: lists file with size > 0
- Step 5: returns a quoted version string (e.g., `"1.2"`)
- Step 6: returns an integer >= 0 (count of captured network entries)

### Evidence

Capture all command outputs, file size, parsed HAR version, and entry count.

### Pass / Fail

- **Pass**: command exit 0 AND file exists AND size > 0 AND `log.version` returns a non-empty string.
- **Fail**: command errors (cross-reference BDG-002); file missing; file size 0; jq parse error; `log.version` is `null` or absent.

### Failure Triage

1. If file size is 0 or jq reports parse error: re-run the command with stderr split (`bdg network har /tmp/bdg.har 2>/tmp/bdg.har.err`) and inspect `/tmp/bdg.har.err` for capture-buffer warnings; the writer may have aborted mid-write.
2. If file parses but `log.version` is `null`: dump the structure with `cat /tmp/bdg.har | jq 'keys'` — the writer may have produced a non-HAR JSON shape; cross-reference BDG-002 (session start) and verify the page actually generated network traffic with `bdg dom eval "performance.getEntriesByType('resource').length"`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | bdg network har reference |

---

## 5. SOURCE METADATA

- Group: CONSOLE AND NETWORK
- Playbook ID: BDG-013
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--console-and-network/003-har-export.md`

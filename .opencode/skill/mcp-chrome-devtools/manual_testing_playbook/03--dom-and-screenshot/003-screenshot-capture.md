---
title: "BDG-010 -- Screenshot capture"
description: "This scenario validates page screenshot capture for `BDG-010`. It focuses on confirming `bdg dom screenshot` writes a valid PNG file to disk with correct magic bytes."
---

# BDG-010 -- Screenshot capture

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-010`.

---

## 1. OVERVIEW

This scenario validates page screenshot capture for `BDG-010`. It focuses on confirming `bdg dom screenshot /tmp/bdg-test.png` writes a real PNG file to disk and that the file begins with the canonical PNG magic bytes (`89 50 4e 47`).

### Why This Matters

Screenshot is one of the three critical-path scenarios for the Chrome DevTools skill (alongside BDG-001 install and BDG-002 session start). It's the most common artifact-producing operation operators delegate to bdg, and a corrupt or zero-byte PNG is silently broken — file existence alone is not enough; the magic-byte check is the only reliable way to confirm a real image was written.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-010` and confirm the expected signals without contradictory evidence.

- Objective: Verify `bdg dom screenshot /tmp/bdg-test.png` exits 0; the file exists; and the first four bytes are PNG magic `89 50 4e 47`.
- Real user request: `"Take a screenshot of example.com and save it to /tmp/bdg-test.png."`
- Prompt: `As a manual-testing orchestrator, capture a screenshot of the active page through the bdg CLI against an active session on https://example.com. Verify the file is created and starts with PNG magic bytes. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: assumes active session on `https://example.com` (BDG-002 prerequisite); run screenshot, verify file existence, verify PNG magic.
- Expected signals: screenshot command exits 0; `/tmp/bdg-test.png` exists; `xxd` head shows PNG magic `89 50 4e 47`.
- Desired user-visible outcome: A short report quoting the file path, file size, and PNG-magic confirmation with a PASS verdict.
- Pass/fail: PASS if all three signals hold; FAIL if the command errors, the file is missing, the file is zero bytes, or the magic bytes are wrong.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, capture a screenshot of the active page through the bdg CLI against an active session on https://example.com. Verify the file is created and starts with PNG magic bytes. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. Precondition: BDG-002 has started a session against `https://example.com`; verify with `bash: bdg status 2>&1 | grep -i example.com`
2. `bash: rm -f /tmp/bdg-test.png` — clean any prior artifact so existence check is meaningful
3. `bash: bdg dom screenshot /tmp/bdg-test.png 2>&1`
4. `bash: ls -la /tmp/bdg-test.png`
5. `bash: xxd /tmp/bdg-test.png | head -1`

### Expected

- Step 3: exits 0; may print confirmation
- Step 4: lists file with size > 0
- Step 5: first four bytes are `89 50 4e 47` (PNG magic, ASCII `\x89PNG`)

### Evidence

Capture all command outputs, the resulting file size, and the xxd magic-byte line.

### Pass / Fail

- **Pass**: command exit 0 AND file exists AND size > 0 AND magic bytes `89 50 4e 47`.
- **Fail**: command errors (likely no active session — cross-reference BDG-002); file missing; size 0; magic bytes wrong (corrupted output or wrong format).

### Failure Triage

1. If the command errors with "no active session": cross-reference BDG-002 (session start) — operator must start a session with `bdg https://example.com` before this scenario.
2. If file size is 0 or magic bytes are wrong: confirm the page has fully rendered with `bdg dom eval "document.readyState"` (cross-reference BDG-009) — a screenshot taken before paint completes can be empty; retry after the readyState reports `complete`.

### Optional Supplemental Checks

- Run `bash: file /tmp/bdg-test.png` — independent format-detection check (should print `PNG image data`).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | bdg dom screenshot reference |

---

## 5. SOURCE METADATA

- Group: DOM AND SCREENSHOT
- Playbook ID: BDG-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--dom-and-screenshot/003-screenshot-capture.md`

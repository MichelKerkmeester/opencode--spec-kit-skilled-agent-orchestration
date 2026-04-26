---
title: "CX-024 -- --search live browsing in exec"
description: "This scenario validates --search in non-interactive exec mode for `CX-024`. It focuses on confirming the response indicates web access was used."
---

# CX-024 -- --search live browsing in exec

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-024`.

---

## 1. OVERVIEW

This scenario validates `--search` in non-interactive `codex exec` mode for `CX-024`. It focuses on confirming `--search` works in `exec` (not just TUI) by validating against a current-information question. This complements CX-019 (which validates URL citation specifically) by validating the `exec`-mode wiring against any signal of web access.

### Why This Matters

`--search` is documented in `references/cli_reference.md` §4 and `references/codex_tools.md` §2 as supported in both interactive TUI and non-interactive `exec`. Validating both modes separately catches regressions where the flag silently no-ops in one mode but works in the other.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-024` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--search` works in non-interactive `codex exec` mode against a current-information question.
- Real user request: `Confirm Codex's --search flag works in exec mode (not just the interactive TUI).`
- Prompt: `As a cross-AI orchestrator confirming --search works in exec mode (not just TUI), dispatch codex exec --search --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="high" -c service_tier="fast" "What was the headline release of any major JavaScript runtime announced in March 2026? Cite one source." Verify Codex exits 0, the response indicates web access was used (URL citation, "according to" phrasing, or a date-stamped fact later than the model's training cutoff), and the dispatched command line includes --search. Return a verdict naming the cited release and the source URL.`
- Expected execution process: Operator dispatches `codex exec --search` with a current-information prompt -> captures stdout -> verifies the response indicates web access (URL citation, "according to" phrasing or a recent date-stamp).
- Expected signals: `codex exec --search` exits 0. Response contains a date-stamped fact, an "according to" phrasing or a URL citation. Dispatched command line includes `--search`. The answer is plausibly current rather than purely from training data.
- Desired user-visible outcome: Operator-visible proof that `--search` is wired into `exec` mode and not just the interactive TUI.
- Pass/fail: PASS if exit 0 AND response contains at least one signal of web access (URL, "according to" or recent date) AND `--search` is in the dispatched command line. FAIL if exit non-zero, no web-access signal or `--search` missing from command.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Dispatch `codex exec --search` with a current-information prompt that requires recent web data.
2. Capture stdout to a temp file.
3. Grep for web-access signals (URL, "according to", recent date).
4. Confirm at least one signal is present.
5. Return a verdict naming the cited information.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-024 | --search live browsing in exec | Verify --search works in exec mode and the response indicates web access | `As a cross-AI orchestrator confirming --search works in exec mode (not just TUI), dispatch codex exec --search --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="high" -c service_tier="fast" "What was the headline release of any major JavaScript runtime announced in March 2026? Cite one source." Verify Codex exits 0, the response indicates web access was used (URL citation, "according to" phrasing, or a date-stamped fact later than the model's training cutoff), and the dispatched command line includes --search. Return a verdict naming the cited release and the source URL.` | 1. `codex exec --search --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="high" -c service_tier="fast" "What was the headline release of any major JavaScript runtime announced in March 2026? Cite one source URL or quote phrasing like 'according to <source>'." > /tmp/cli-codex-cx024.txt 2>&1` -> 2. `bash: cat /tmp/cli-codex-cx024.txt` -> 3. `bash: grep -ciE "https?://|according to|reported by|2026-03|march 2026" /tmp/cli-codex-cx024.txt > /tmp/cli-codex-cx024-signal-count.txt` -> 4. `bash: SIGNALS=$(cat /tmp/cli-codex-cx024-signal-count.txt); printf 'Web-access signals detected: %s\n' "$SIGNALS"` | Step 1: exit 0; Step 2: stdout contains a release-related answer; Step 3: signal count >= 1 (URL/citation/recent date); Step 4: signal-count line printed | Captured stdout, signal-count file, dispatched command line, exit code | PASS if exit 0, signal count >= 1, AND `--search` is in the dispatched command line; FAIL if exit non-zero, signal count is 0, or `--search` missing | (1) Re-run with `2>&1 | tee` for stderr inline; (2) inspect stdout for "search not available" or rate-limit messages; (3) confirm operator's account tier supports --search; (4) try a less time-sensitive query if rate-limited |

### Optional Supplemental Checks

- Dispatch the same prompt without `--search` and confirm the response either declines to answer current information or relies only on training-data-bound facts (negative control proving --search adds value).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/codex_tools.md` (§2 Web Search) | Documents the --search capability |
| `../../references/cli_reference.md` (§4 Essential Flags) | Documents the --search flag |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/codex_tools.md` | §2 Web Search (--search) |
| `../../references/cli_reference.md` | §4 Essential Flags (--search) |

---

## 5. SOURCE METADATA

- Group: Built-in Tools
- Playbook ID: CX-024
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `08--built-in-tools/002-search-exec-mode.md`

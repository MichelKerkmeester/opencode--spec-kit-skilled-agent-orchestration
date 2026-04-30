---
title: "CX-019 -- Web search via --search"
description: "This scenario validates --search live web browsing for `CX-019`. It focuses on confirming the response cites URLs for time-sensitive information."
---

# CX-019 -- Web search via --search

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-019`.

---

## 1. OVERVIEW

This scenario validates web search via `--search` for `CX-019`. It focuses on confirming `--search` enables live web browsing during `codex exec` and that the response cites at least one URL for time-sensitive information.

### Why This Matters

`--search` is one of the documented Codex-exclusive features (`references/codex_tools.md` §2 Web Search). It's the canonical surface for "current information" research and is the basis for the `@deep-research` profile. Without working `--search` + URL citation, the entire web-research routing in `integration_patterns.md` §7 (Context Enrichment - Web Search for Current Information) falls over.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-019` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--search` enables live web browsing and that the response cites at least one URL.
- Real user request: `Use Codex with web search to find the latest stable Express.js version and cite the source.`
- RCAF Prompt: `As a cross-AI orchestrator researching current information, dispatch codex exec --search --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="high" -c service_tier="fast" "Search the web for the latest stable Express.js minor release as of April 2026 and cite at least one official source URL. Return a one-paragraph summary plus the cited URL(s)." Verify Codex exits 0, the response contains at least one URL, the URL is reachable in principle (https scheme + a plausible express-related domain), and the dispatched command includes --search. Return a verdict naming the cited URL(s) and the reported version.`
- Expected execution process: Operator dispatches `--search` with a current-information prompt -> captures stdout -> verifies at least one https URL appears -> validates the URL points at a plausible source domain.
- Expected signals: `codex exec --search` exits 0. Stdout contains at least one URL with `https://` scheme. URL points at a plausible source (expressjs.com, github.com/expressjs, npmjs.com, etc.). Dispatched command line includes `--search`.
- Desired user-visible outcome: A version-and-source summary the operator can paste into a research note, with provable evidence that the live web tier was actually engaged.
- Pass/fail: PASS if exit 0 AND at least one https URL is in the response AND the URL is from a plausible express-related source domain AND `--search` is in the dispatched command. FAIL if exit non-zero, no URL or the URL is from an implausible domain.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Dispatch `codex exec --search` with a current-information prompt.
2. Capture stdout to a temp file.
3. Extract URLs from the response.
4. Validate at least one URL points at a plausible express-related source domain.
5. Return a verdict naming the cited URL(s) and the reported version.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-019 | Web search via --search | Verify --search enables live web browsing and the response cites at least one URL | `As a cross-AI orchestrator researching current information, dispatch codex exec --search --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="high" -c service_tier="fast" "Search the web for the latest stable Express.js minor release as of April 2026 and cite at least one official source URL. Return a one-paragraph summary plus the cited URL(s)." Verify Codex exits 0, the response contains at least one URL, the URL is reachable in principle (https scheme + a plausible express-related domain), and the dispatched command includes --search. Return a verdict naming the cited URL(s) and the reported version.` | 1. `codex exec --search --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="high" -c service_tier="fast" "Search the web for the latest stable Express.js minor release as of April 2026 and cite at least one official source URL. Return a one-paragraph summary plus the cited URL(s) at the bottom of the response." > /tmp/cli-codex-cx019.txt 2>&1` -> 2. `bash: cat /tmp/cli-codex-cx019.txt` -> 3. `bash: grep -oE 'https://[a-zA-Z0-9./_-]+' /tmp/cli-codex-cx019.txt > /tmp/cli-codex-cx019-urls.txt` -> 4. `bash: grep -E "expressjs.com\|github.com/expressjs\|npmjs.com/package/express\|nodejs.org" /tmp/cli-codex-cx019-urls.txt` | Step 1: exit 0; Step 2: stdout contains a one-paragraph version summary; Step 3: at least one https URL extracted; Step 4: at least one URL is from a plausible express-related domain | Captured stdout, URL extraction file, plausible-source grep, dispatched command line, exit code | PASS if exit 0, at least one https URL is extracted, AND at least one URL is from a plausible express domain AND `--search` is in the dispatched command; FAIL if exit non-zero, no URL, or no plausible source domain | (1) Re-run with `2>&1 \| tee` for stderr inline; (2) check that the operator's account has web-search entitlement (some Codex tiers gate it); (3) inspect stdout for "search not available" errors |

### Optional Supplemental Checks

- Repeat with a different current-information topic (e.g., "latest Node.js LTS release") and confirm the same shape (URL + summary).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/codex_tools.md` (§2 Web Search) | Documents the --search capability |
| `../../references/integration_patterns.md` (§7 Context Enrichment - Web Search) | Documents web-search usage patterns |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/codex_tools.md` | §2 Web Search (--search) |
| `../../references/cli_reference.md` | §4 Essential Flags (--search) |

---

## 5. SOURCE METADATA

- Group: Integration Patterns
- Playbook ID: CX-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--integration-patterns/002-web-search.md`

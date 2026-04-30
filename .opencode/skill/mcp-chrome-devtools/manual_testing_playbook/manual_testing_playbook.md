---
title: "MCP Chrome DevTools: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the mcp-chrome-devtools skill."
---

# MCP Chrome DevTools: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real — not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, call real handlers, and verify real outputs. The only acceptable classifications are PASS, FAIL, or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.

This document combines the full manual-validation contract for the `mcp-chrome-devtools` skill into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide while per-feature files carry the scenario-specific execution truth. Chrome DevTools is the browser-automation surface for OpenCode; the CLI (`bdg`) is the primary interface for sequential operations, while the MCP `chrome_devtools_1` / `chrome_devtools_2` instances (accessed via Code Mode — see CM-005..CM-007 for the manual-namespace contract) enable parallel browser instances.

---

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--cli-bdg-lifecycle/`
- `02--protocol-discovery/`
- `03--dom-and-screenshot/`
- `04--console-and-network/`
- `05--mcp-parallel-instances/`
- `06--recovery-and-failure/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. CLI BDG LIFECYCLE](#7--cli-bdg-lifecycle)
- [8. PROTOCOL DISCOVERY](#8--protocol-discovery)
- [9. DOM AND SCREENSHOT](#9--dom-and-screenshot)
- [10. CONSOLE AND NETWORK](#10--console-and-network)
- [11. MCP PARALLEL INSTANCES](#11--mcp-parallel-instances)
- [12. RECOVERY AND FAILURE](#12--recovery-and-failure)
- [13. AUTOMATED TEST CROSS-REFERENCE](#13--automated-test-cross-reference)
- [14. FEATURE CATALOG CROSS-REFERENCE INDEX](#14--feature-catalog-cross-reference-index)

---

## 1. OVERVIEW

This playbook provides 22 deterministic scenarios across 6 categories validating the `mcp-chrome-devtools` skill surface. Each scenario maps to a dedicated feature file with the canonical objective, prompt summary, expected signals, and feature-file reference.

### Realistic Test Model

1. A realistic operator request is given to an orchestrator (e.g., "screenshot example.com and email it to me").
2. The orchestrator decides whether to call `bdg` directly (sequential, lower-overhead) or invoke `chrome_devtools_1` via Code Mode (parallel-instance capable).
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned artifact (screenshot file, console log, HAR file) is correct.

---

## 2. GLOBAL PRECONDITIONS

- Working directory is project root.
- `bdg` CLI is installed and resolvable: `command -v bdg` returns a path.
- A Chrome / Chromium / Edge browser is installed and resolvable (`which google-chrome chromium-browser chromium`).
- For MCP-based scenarios, `chrome_devtools_1` (and optionally `chrome_devtools_2`) are configured in `.utcp_config.json`.
- The operator has internet access OR a local test page available for navigation.
- Destructive scenarios `BDG-021` (dead-session recovery) and `BDG-022` (cleanup leak) MUST run only against throwaway sessions; never against an active long-running browser session.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Full command transcript for CLI scenarios (including `bdg` exit codes).
- Tool-call transcript for MCP scenarios.
- Captured artifacts: screenshot file paths, HAR file paths, console message transcripts.
- The user request that triggered the orchestration flow.
- The orchestrator prompt (verbatim).
- Final user-facing outcome and PASS / PARTIAL / FAIL verdict.
- For destructive scenarios, evidence of session cleanup (no leaked browser processes via `pgrep -fl chrome` or equivalent).

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands are shown as `bdg <subcommand> [args]` (e.g., `bdg https://example.com`, `bdg dom screenshot /tmp/x.png`).
- MCP tool calls are shown as `chrome_devtools_N.chrome_devtools_N_<tool>({ ... })` (per the manual-namespace contract — see CM-005).
- Bash steps are shown as `bash: <command>`.
- `->` separates sequential steps.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

- A scenario is PASS only when preconditions, prompt, commands, expected signals, and evidence all line up.
- A feature is PASS only when every mapped scenario is PASS.
- Release is READY only when all critical scenarios pass, coverage is complete, and no blocking triage item remains.
- Critical-path scenarios for Chrome DevTools: BDG-001 (install + version), BDG-002 (session start), BDG-010 (screenshot capture). A FAIL on any of these blocks release.
- Keep feature-specific caveats in linked feature files instead of duplicating them in the root.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

- **Wave 1 (parallel-safe CLI)**: BDG-001 install, BDG-002 session start, BDG-003 status, BDG-005..BDG-007 protocol discovery, BDG-011 console.
- **Wave 2 (read-only browser ops)**: BDG-008 query, BDG-010 screenshot, BDG-012 cookies, BDG-013 HAR (single browser instance).
- **Wave 3 (MCP parallel instances)**: BDG-014..BDG-018 require `chrome_devtools_1` and optionally `chrome_devtools_2`; depend on CM-005..CM-007 for naming and CM-014..CM-016 for the via-Code-Mode pattern.
- **Wave 4 (destructive / failure injection)**: BDG-021 dead session, BDG-022 cleanup leak. Run last; verify no leaked processes after.
- After each wave, save evidence and rotate orchestrator context before the next wave.

---

## 7. CLI BDG LIFECYCLE

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### BDG-001 | Install + version check

#### Description
Verify `bdg` is installed and `bdg --version` returns a non-empty version string.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, confirm bdg is installed and reports its version through the bdg CLI against the local install. Verify command -v bdg returns a path and bdg --version returns a non-empty string. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `command -v bdg` returns a non-empty path; Step 2: `bdg --version 2>&1` returns a version string (semver-like).

#### Test Execution
> **Feature File:** [BDG-001](01--cli-bdg-lifecycle/001-install-version.md)

### BDG-002 | Session start

#### Description
Verify `bdg <url>` starts a CDP session against the given URL.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, start a bdg session against https://example.com through the bdg CLI against a real Chrome/Chromium browser. Verify session reports active state. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `bdg https://example.com` exits 0; Step 2: `bdg status` reports active session.

#### Test Execution
> **Feature File:** [BDG-002](01--cli-bdg-lifecycle/002-session-start.md)

### BDG-003 | Status JSON

#### Description
Verify `bdg status` returns valid JSON with expected fields (`state`, `url`).

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, query bdg session status as JSON through the bdg CLI against an active session. Verify output is valid JSON with state and url fields. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `bdg status 2>&1 | jq '.'` succeeds; Step 2: parsed object contains `state` and `url` fields.

#### Test Execution
> **Feature File:** [BDG-003](01--cli-bdg-lifecycle/003-status-json.md)

### BDG-004 | Session stop

#### Description
Verify `bdg stop` cleanly terminates an active session.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, stop the active bdg session through the bdg CLI against an active session. Verify subsequent bdg status reports no active session. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `bdg stop` exits 0; Step 2: `bdg status` shows no active session; Step 3: no leaked Chrome processes (`pgrep -fl chrome` returns empty or only unrelated processes).

#### Test Execution
> **Feature File:** [BDG-004](01--cli-bdg-lifecycle/004-session-stop.md)

---

## 8. PROTOCOL DISCOVERY

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### BDG-005 | List CDP domains

#### Description
Verify `bdg cdp --list` returns a non-empty list of CDP domains (Page, Network, Runtime, etc.).

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, enumerate available Chrome DevTools Protocol domains through the bdg CLI against the live CDP catalog. Verify output contains common domains like Page, Network, Runtime. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `bdg cdp --list` returns non-empty output; Step 2: output contains `Page`, `Network`, `Runtime`.

#### Test Execution
> **Feature File:** [BDG-005](02--protocol-discovery/001-list-cdp-domains.md)

### BDG-006 | Describe Page domain

#### Description
Verify `bdg cdp --describe Page` returns method signatures for Page domain.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, describe the Page CDP domain through the bdg CLI against the live CDP catalog. Verify output lists at least navigate and reload methods. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `bdg cdp --describe Page` returns non-empty output; Step 2: output mentions `navigate` and `reload` (or similar core methods).

#### Test Execution
> **Feature File:** [BDG-006](02--protocol-discovery/002-describe-page-domain.md)

### BDG-007 | Search CDP method

#### Description
Verify `bdg cdp --search screenshot` returns Page.captureScreenshot or equivalent.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, search CDP methods for screenshot through the bdg CLI against the live CDP catalog. Verify output mentions Page.captureScreenshot. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `bdg cdp --search screenshot` returns matches; Step 2: output mentions `captureScreenshot` (likely under `Page`).

#### Test Execution
> **Feature File:** [BDG-007](02--protocol-discovery/003-search-cdp-method.md)

---

## 9. DOM AND SCREENSHOT

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### BDG-008 | Query selector

#### Description
Verify `bdg dom query "h1"` returns matching elements with text content.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, query the page for h1 elements through the bdg CLI against an active session on https://example.com. Verify output contains the h1 text. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `bdg dom query "h1"` returns non-empty output; Step 2: output contains "Example Domain" (the h1 text on example.com).

#### Test Execution
> **Feature File:** [BDG-008](03--dom-and-screenshot/001-query-selector.md)

### BDG-009 | Eval JavaScript

#### Description
Verify `bdg dom eval "document.title"` returns the page title.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, evaluate JavaScript on the active page through the bdg CLI against an active session on https://example.com. Verify the returned title matches Example Domain. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `bdg dom eval "document.title"` returns a string; Step 2: string contains "Example".

#### Test Execution
> **Feature File:** [BDG-009](03--dom-and-screenshot/002-eval-javascript.md)

### BDG-010 | Screenshot capture

#### Description
Verify `bdg dom screenshot /tmp/bdg-test.png` writes a valid PNG file.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, capture a screenshot of the active page through the bdg CLI against an active session on https://example.com. Verify the file is created and starts with PNG magic bytes. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `bdg dom screenshot /tmp/bdg-test.png` exits 0; Step 2: file `/tmp/bdg-test.png` exists; Step 3: `xxd /tmp/bdg-test.png | head -1` shows PNG magic `89 50 4e 47`.

#### Test Execution
> **Feature File:** [BDG-010](03--dom-and-screenshot/003-screenshot-capture.md)

---

## 10. CONSOLE AND NETWORK

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### BDG-011 | Console list

#### Description
Verify `bdg console --list` returns console messages from the active page.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, retrieve console messages from the active page through the bdg CLI against an active session that has logged some console output. Verify output is JSON with messages array. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `bdg dom eval "console.log('BDG-011 test')"` exits 0; Step 2: `bdg console --list 2>&1 | jq '.'` includes a message containing `BDG-011 test`.

#### Test Execution
> **Feature File:** [BDG-011](04--console-and-network/001-console-list.md)

### BDG-012 | Cookie retrieval

#### Description
Verify `bdg network getCookies` returns cookie array from the active page.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, retrieve cookies from the active page through the bdg CLI against an active session. Verify output is JSON array (may be empty for example.com). Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `bdg network getCookies 2>&1 | jq '.'` succeeds; Step 2: result is an array (length >= 0; empty is valid for example.com).

#### Test Execution
> **Feature File:** [BDG-012](04--console-and-network/002-cookies-retrieval.md)

### BDG-013 | HAR export

#### Description
Verify `bdg network har /tmp/bdg.har` writes a valid HAR file.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, export the page network activity as HAR through the bdg CLI against an active session. Verify the file is created and is valid HAR JSON. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `bdg network har /tmp/bdg.har` exits 0; Step 2: file `/tmp/bdg.har` exists; Step 3: `cat /tmp/bdg.har | jq '.log.version'` returns a version string.

#### Test Execution
> **Feature File:** [BDG-013](04--console-and-network/003-har-export.md)

---

## 11. MCP PARALLEL INSTANCES

This category covers 5 scenario summaries while the linked feature files remain the canonical execution contract. All scenarios in this category invoke Chrome via Code Mode and require the manual-namespace contract from CM-005..CM-007 to hold.

### BDG-014 | chrome_devtools_1 navigate via Code Mode

#### Description
Verify `chrome_devtools_1.chrome_devtools_1_navigate_page({url})` succeeds via Code Mode.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, navigate chrome_devtools_1 to https://example.com through Code Mode against the configured chrome_devtools_1 MCP server. Verify the call succeeds and screenshot returns valid bytes. Cross-reference: this scenario depends on CM-005 (correct manual.tool form) and CM-015 (Chrome navigate + screenshot). Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: navigate call succeeds; Step 2: subsequent screenshot returns base64 of length > 1000.

#### Test Execution
> **Feature File:** [BDG-014](05--mcp-parallel-instances/001-chrome-devtools-1-navigate.md)

### BDG-015 | Dual-instance parallel

#### Description
Verify `chrome_devtools_1` and `chrome_devtools_2` can run navigate + screenshot simultaneously via `Promise.all`.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, navigate chrome_devtools_1 to https://example.com and chrome_devtools_2 to https://example.org in parallel via Promise.all through Code Mode against both MCP instances. Verify both return successfully and total wall time < 2x single-instance time. Cross-reference: depends on CM-012 (Promise.all parallel). Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: chain returns array of length 2; Step 2: both screenshots are valid PNG; Step 3: parallel timing visible (< 2x sequential).

#### Test Execution
> **Feature File:** [BDG-015](05--mcp-parallel-instances/002-dual-instance-parallel.md)

### BDG-016 | Close + select page

#### Description
Verify `close_page` and `select_page` work for managing multiple pages in a single instance.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, open 2 pages in chrome_devtools_1, close the first, and confirm the second is still accessible through Code Mode against the chrome_devtools_1 MCP instance. Verify select_page can switch back to the surviving page. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: 2 pages opened; Step 2: close_page returns success for first; Step 3: select_page returns success for second; Step 4: subsequent take_screenshot returns valid bytes for the second page.

#### Test Execution
> **Feature File:** [BDG-016](05--mcp-parallel-instances/003-close-and-select-page.md)

### BDG-017 | Multi-tab same instance

#### Description
Verify `new_page` opens additional pages within `chrome_devtools_1` (multi-tab in single instance).

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, open a new page in chrome_devtools_1 (additional to the initial page) through Code Mode against the chrome_devtools_1 MCP instance. Verify both pages are accessible via select_page. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: new_page returns success with new page id; Step 2: list_pages or equivalent shows >= 2 pages; Step 3: select_page works for both.

#### Test Execution
> **Feature File:** [BDG-017](05--mcp-parallel-instances/004-multi-tab-same-instance.md)

### BDG-018 | Page-context isolation cross-instance

#### Description
Verify `chrome_devtools_1` and `chrome_devtools_2` have isolated cookie / storage state.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, set a cookie in chrome_devtools_1 then check it does NOT appear in chrome_devtools_2 through Code Mode against both MCP instances. Verify cookie isolation. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: cookie set in instance 1 succeeds; Step 2: getCookies on instance 1 returns the cookie; Step 3: getCookies on instance 2 returns empty (or doesn't include the cookie).

#### Test Execution
> **Feature File:** [BDG-018](05--mcp-parallel-instances/005-page-context-isolation.md)

---

## 12. RECOVERY AND FAILURE

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### BDG-019 | Missing browser

#### Description
Verify `bdg <url>` reports a clear error when no Chrome / Chromium / Edge is installed.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, simulate a missing-browser scenario by setting CHROME_PATH to a non-existent binary and starting bdg through the bdg CLI against the missing-browser path. Verify the error names the missing binary. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `CHROME_PATH=/nonexistent/chrome bdg https://example.com 2>&1` exits non-zero; Step 2: stderr names the missing binary or "browser not found".

#### Test Execution
> **Feature File:** [BDG-019](06--recovery-and-failure/001-missing-browser.md)

### BDG-020 | Invalid URL

#### Description
Verify `bdg <bad-url>` reports a clear error.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, attempt to start bdg with an invalid URL (e.g., not-a-url) through the bdg CLI against an installed Chrome. Verify the error names the URL parse failure. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: `bdg not-a-url 2>&1` exits non-zero; Step 2: stderr indicates URL parse / invalid input.

#### Test Execution
> **Feature File:** [BDG-020](06--recovery-and-failure/002-invalid-url.md)

### BDG-021 | Dead session **(DESTRUCTIVE)**

#### Description
Verify recovery from a dead session: kill the browser process, attempt a CDP command, observe failure, restart with new session.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, deliberately kill the active Chrome process, attempt a bdg dom screenshot, then restart with a new session through the bdg CLI against an active-then-killed-then-restarted session. Verify the kill produces a clear error and restart recovers. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 2: post-kill `bdg dom screenshot /tmp/x.png 2>&1` exits non-zero with session-error message; Step 4: new `bdg https://example.com` succeeds; Step 5: subsequent screenshot succeeds.

#### Test Execution
> **Feature File:** [BDG-021](06--recovery-and-failure/003-dead-session.md)

### BDG-022 | Cleanup leak detection **(DESTRUCTIVE)**

#### Description
Verify that omitting `bdg stop` after a session leaks a Chrome process; calling `bdg stop` cleans it up.

#### Scenario Contract
Prompt summary: As a manual-testing orchestrator, start a session, omit bdg stop, count Chrome processes, then run bdg stop and recount through the bdg CLI against an active session. Verify process count decreases after bdg stop. Return a concise user-facing pass/fail verdict with the main reason.

Expected signals: Step 1: pre-session Chrome count baseline; Step 2: post-session Chrome count > baseline; Step 4: post-stop count <= baseline.

#### Test Execution
> **Feature File:** [BDG-022](06--recovery-and-failure/004-cleanup-leak.md)

---

## 13. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `bdg --version` (built-in) | Install verification | BDG-001 |
| Chrome DevTools Protocol catalog (live) | Domain + method discovery | BDG-005..BDG-007 |

> Note: most Chrome DevTools behavior is exercised end-to-end through the live browser, not through dedicated unit tests. The playbook scenarios serve as the primary regression surface. Cross-skill scenarios (BDG-014..BDG-018) depend on the CM playbook for the manual-namespace and `call_tool_chain` contracts.

---

## 14. FEATURE CATALOG CROSS-REFERENCE INDEX

### CLI BDG LIFECYCLE

- BDG-001: [Install + version](01--cli-bdg-lifecycle/001-install-version.md)
- BDG-002: [Session start](01--cli-bdg-lifecycle/002-session-start.md)
- BDG-003: [Status JSON](01--cli-bdg-lifecycle/003-status-json.md)
- BDG-004: [Session stop](01--cli-bdg-lifecycle/004-session-stop.md)

### PROTOCOL DISCOVERY

- BDG-005: [List CDP domains](02--protocol-discovery/001-list-cdp-domains.md)
- BDG-006: [Describe Page domain](02--protocol-discovery/002-describe-page-domain.md)
- BDG-007: [Search CDP method](02--protocol-discovery/003-search-cdp-method.md)

### DOM AND SCREENSHOT

- BDG-008: [Query selector](03--dom-and-screenshot/001-query-selector.md)
- BDG-009: [Eval JavaScript](03--dom-and-screenshot/002-eval-javascript.md)
- BDG-010: [Screenshot capture](03--dom-and-screenshot/003-screenshot-capture.md)

### CONSOLE AND NETWORK

- BDG-011: [Console list](04--console-and-network/001-console-list.md)
- BDG-012: [Cookies retrieval](04--console-and-network/002-cookies-retrieval.md)
- BDG-013: [HAR export](04--console-and-network/003-har-export.md)

### MCP PARALLEL INSTANCES

- BDG-014: [chrome_devtools_1 navigate via Code Mode](05--mcp-parallel-instances/001-chrome-devtools-1-navigate.md)
- BDG-015: [Dual-instance parallel](05--mcp-parallel-instances/002-dual-instance-parallel.md)
- BDG-016: [Close + select page](05--mcp-parallel-instances/003-close-and-select-page.md)
- BDG-017: [Multi-tab same instance](05--mcp-parallel-instances/004-multi-tab-same-instance.md)
- BDG-018: [Page-context isolation cross-instance](05--mcp-parallel-instances/005-page-context-isolation.md)

### RECOVERY AND FAILURE

- BDG-019: [Missing browser](06--recovery-and-failure/001-missing-browser.md)
- BDG-020: [Invalid URL](06--recovery-and-failure/002-invalid-url.md)
- BDG-021: [Dead session **(DESTRUCTIVE)**](06--recovery-and-failure/003-dead-session.md)
- BDG-022: [Cleanup leak detection **(DESTRUCTIVE)**](06--recovery-and-failure/004-cleanup-leak.md)

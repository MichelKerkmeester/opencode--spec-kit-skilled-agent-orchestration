---
title: "BDG-005 -- List CDP domains"
description: "This scenario validates CDP domain enumeration for `BDG-005`. It focuses on confirming `bdg cdp --list` returns a non-empty catalog containing common Chrome DevTools Protocol domains."
---

# BDG-005 -- List CDP domains

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `BDG-005`.

---

## 1. OVERVIEW

This scenario validates CDP domain enumeration for `BDG-005`. It focuses on confirming `bdg cdp --list` returns a non-empty catalog of Chrome DevTools Protocol domains and that the output contains the well-known core domains (`Page`, `Network`, `Runtime`).

### Why This Matters

CDP discovery is the foundation for every advanced bdg workflow that calls a raw protocol method. If `--list` is empty or missing core domains, the protocol catalog is broken and BDG-006 (describe Page) and BDG-007 (search method) cannot meaningfully execute. This scenario is the smoke test for the protocol-discovery surface.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BDG-005` and confirm the expected signals without contradictory evidence.

- Objective: Verify `bdg cdp --list` returns non-empty output containing `Page`, `Network`, and `Runtime` domain names.
- Real user request: `"Show me which Chrome DevTools Protocol domains I can use."`
- Prompt: `As a manual-testing orchestrator, enumerate available Chrome DevTools Protocol domains through the bdg CLI against the live CDP catalog. Verify output contains common domains like Page, Network, Runtime. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: run a single CLI command and inspect output for core domain names.
- Expected signals: `bdg cdp --list` exits 0 with non-empty output; output contains `Page`, `Network`, `Runtime`.
- Desired user-visible outcome: A short report quoting the matched domain names with a PASS verdict.
- Pass/fail: PASS if all three domain names appear; FAIL if output is empty or any of the three core domains are missing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, enumerate available Chrome DevTools Protocol domains through the bdg CLI against the live CDP catalog. Verify output contains common domains like Page, Network, Runtime. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: bdg cdp --list 2>&1`
2. `bash: bdg cdp --list 2>&1 | grep -E "^(Page|Network|Runtime)\b"`

### Expected

- Step 1: returns multi-line output enumerating CDP domains; exit code 0
- Step 2: matches all three core domain names; exit code 0

### Evidence

Capture full `--list` output and the grep match output.

### Pass / Fail

- **Pass**: `--list` returns non-empty output AND grep matches `Page`, `Network`, AND `Runtime`.
- **Fail**: `--list` returns empty output (catalog broken); any of the three core domain names missing.

### Failure Triage

1. If `bdg cdp --list` errors with "command not found" for the `cdp` subcommand: verify bdg version with `bdg --version` and cross-reference BDG-001 (install + version) — older bdg builds may lack `cdp` subcommand.
2. If output is non-empty but missing `Page`/`Network`/`Runtime`: dump the full catalog with `bdg cdp --list 2>&1 | sort | uniq` and inspect for naming variations; the upstream CDP catalog may have renamed domains in a recent Chrome release.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | bdg cdp subcommand reference |

---

## 5. SOURCE METADATA

- Group: PROTOCOL DISCOVERY
- Playbook ID: BDG-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--protocol-discovery/001-list-cdp-domains.md`

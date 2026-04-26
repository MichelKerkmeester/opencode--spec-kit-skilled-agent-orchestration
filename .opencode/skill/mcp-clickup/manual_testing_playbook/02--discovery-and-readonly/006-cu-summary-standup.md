---
title: "CU-010 -- cu summary sprint standup summary (CLI-only feature)"
description: "This scenario validates `cu summary` for `CU-010`. It focuses on generating a standup-ready sprint summary — a CLI-exclusive feature with no MCP equivalent."
---

# CU-010 -- cu summary sprint standup summary (CLI-only feature)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-010`.

---

## 1. OVERVIEW

This scenario validates `cu summary` for `CU-010`. It focuses on the CLI-only standup-summary view that groups tasks for daily review. There is NO MCP equivalent — this is one of the explicit CLI-only features documented in the Phase-1 inventory.

### Why This Matters

`cu summary` is one of two CLI-exclusive features in the mcp-clickup skill (the other is `cu sprint`). It anchors the "CLI primary" stance: there are real workflows that the CLI does better than the MCP surface. A FAIL here invalidates a key part of the skill's value proposition.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-010` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cu summary` exits 0 and produces a non-empty standup summary grouped by status / assignee / sprint section, AND that no MCP `clickup.clickup_*` tool offers an equivalent.
- Real user request: `"Generate today's standup summary."`
- Prompt: `As a manual-testing orchestrator, generate a sprint standup summary through the cu CLI against the configured workspace. Verify the response groups tasks by status or assignee in a standup-friendly form. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: invoke `cu summary`; do not delegate; cross-check `list_tools()` shows no MCP equivalent.
- Expected signals: exit 0; non-empty grouped output; no `clickup.clickup_summary` or similarly-named entry in `list_tools()`.
- Desired user-visible outcome: A short report quoting the grouping shape (e.g., "by status: 3 In Progress, 2 Done") and confirming MCP absence.
- Pass/fail: PASS if exit 0, grouped output, AND MCP absence; FAIL on any of those failing.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, generate a sprint standup summary through the cu CLI against the configured workspace. Verify the response groups tasks by status or assignee in a standup-friendly form. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cu summary 2>&1` — invoke and capture full output
2. `bash: echo $?` — capture exit code
3. Inspect output: confirm grouping by status, assignee, or sprint section
4. `list_tools()` (Code Mode) — verify no `clickup.clickup_summary` (or similar) entry exists

### Expected

- Step 1: produces non-empty output
- Step 2: exit code is 0
- Step 3: output exhibits a grouping shape suitable for standup
- Step 4: no MCP equivalent appears in `list_tools()`

### Evidence

Capture the verbatim `cu summary` output, the exit code, the grouping shape (one-line description), and the `list_tools()` filter showing absence of an MCP summary tool.

### Pass / Fail

- **Pass**: Exit 0, grouped output, MCP equivalent absent.
- **Fail**: Non-zero exit, ungrouped flat output, or an MCP equivalent is found (which would invalidate the CLI-only claim).

### Failure Triage

1. If non-zero exit with "no sprint configured": cross-link to CU-009; `cu summary` may rely on a configured sprint — record as a documented limitation rather than a fail.
2. If ungrouped output: check `cu summary --help` for grouping flags; some CLI versions require an explicit `--group-by status`.
3. If MCP equivalent found: capture the tool name and update Phase-1 inventory in research.md §3 — the CLI-only claim is no longer accurate.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | CLI command catalog (CLI-only stance) |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (CLI vs MCP parity: summary CLI-only) |

---

## 5. SOURCE METADATA

- Group: DISCOVERY AND READONLY
- Playbook ID: CU-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--discovery-and-readonly/006-cu-summary-standup.md`

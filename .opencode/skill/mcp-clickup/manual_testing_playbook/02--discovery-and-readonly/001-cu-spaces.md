---
title: "CU-005 -- cu spaces list workspace spaces"
description: "This scenario validates `cu spaces` for `CU-005`. It focuses on confirming the configured workspace returns its list of spaces with id and name."
---

# CU-005 -- cu spaces list workspace spaces

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-005`.

---

## 1. OVERVIEW

This scenario validates `cu spaces` for `CU-005`. It focuses on the workspace-discovery entry point: listing the spaces in the configured workspace so the operator can pick a space ID for downstream `cu lists` queries.

### Why This Matters

`cu spaces` is the first read-only smoke test that the configured token + team ID actually resolve a workspace. It is also a critical-path scenario for the playbook (release-blocking per Section 5 of the root). If `cu spaces` returns nothing or errors, every later discovery / mutation scenario starting from a known space ID is impossible.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CU-005` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cu spaces` exits 0 against the configured workspace and returns at least one space row with `id` and `name`.
- Real user request: `"What ClickUp spaces do I have access to?"`
- Prompt: `As a manual-testing orchestrator, list workspace spaces through the cu CLI against the configured ClickUp workspace. Verify the response is non-empty and each entry has an id and name. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: invoke `cu spaces`; do not delegate; expect human-readable or machine-readable rows depending on CLI default format.
- Expected signals: exit 0; one or more rows; each row has identifiable `id` and `name`; first ID is usable as `<spaceId>` input for CU-006.
- Desired user-visible outcome: A short report listing the count of spaces, the first space ID + name, and a PASS verdict.
- Pass/fail: PASS if exit 0 AND at least one space row with id+name; FAIL if non-zero exit, empty result on a workspace known to have spaces, or rows missing id/name.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, list workspace spaces through the cu CLI against the configured ClickUp workspace. Verify the response is non-empty and each entry has an id and name. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cu spaces 2>&1` — invoke and capture full output
2. `bash: echo $?` — capture exit code
3. Parse rows: confirm each row has an identifiable id and name (CLI default rendering)

### Expected

- Step 1: returns non-empty stdout
- Step 2: exit code is 0
- Step 3: every row exposes `id` and `name`; the workspace under test has at least one space

### Evidence

Capture the verbatim `cu spaces` output and exit code. Pin one space ID (REDACTED if sensitive) for use as `<spaceId>` input in CU-006.

### Pass / Fail

- **Pass**: Exit 0, non-empty rows, each row exposes id+name.
- **Fail**: Non-zero exit, empty result on a workspace with known spaces, or rows missing required fields.

### Failure Triage

1. If non-zero exit with auth error: route to CU-003 (`cu auth` live token); reconfigure via CU-004 (`cu init`) if needed.
2. If exit 0 but empty: confirm the configured team ID points to a workspace that actually contains spaces; check ClickUp Settings > Workspaces in the web UI.
3. If output structure does not include id/name: check `cu spaces --help` for an explicit JSON output flag (some CLI versions ship `--json`); if present, prefer the structured form for downstream parsing.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skill/mcp-clickup/SKILL.md` | CLI command catalog |
| `.opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/research.md` | Phase-1 inventory §3 (Surfaces under test, CLI commands) |

---

## 5. SOURCE METADATA

- Group: DISCOVERY AND READONLY
- Playbook ID: CU-005
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--discovery-and-readonly/001-cu-spaces.md`

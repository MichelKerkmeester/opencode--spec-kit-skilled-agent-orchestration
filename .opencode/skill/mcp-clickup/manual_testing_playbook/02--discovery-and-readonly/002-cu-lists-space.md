---
title: "CU-006 -- cu lists <spaceId> list space lists"
description: "This scenario validates `cu lists <spaceId>` for `CU-006`. It focuses on retrieving the lists inside a known space so downstream mutation scenarios have a target list ID."
---

# CU-006 -- cu lists <spaceId> list space lists

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CU-006`.

---

## 1. OVERVIEW

This scenario validates `cu lists <spaceId>` for `CU-006`. It focuses on retrieving the lists inside a known space so downstream mutation scenarios (CU-011 through CU-016) have a target list ID for throwaway tasks.

### Why This Matters

Every CLI mutation scenario in Wave 3 needs a `<listId>` argument. This scenario locks the discovery contract from `<spaceId>` (CU-005) to `<listId>` (CU-011 onwards). It also exposes a useful negative case: an empty space is acceptable (not a failure) because spaces can legitimately contain no lists.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CU-006` and confirm the expected signals without contradictory evidence.

- Objective: Verify `cu lists <spaceId>` exits 0 and returns zero or more list rows with `id` and `name`.
- Real user request: `"What lists are in this ClickUp space?"`
- Prompt: `As a manual-testing orchestrator, list the lists inside a known space through the cu CLI against the configured ClickUp workspace. Verify each entry has an id and name. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: take `<spaceId>` from CU-005 evidence, invoke `cu lists <spaceId>`; do not delegate.
- Expected signals: exit 0; rows exposing `id` and `name`; an empty result is acceptable for empty spaces.
- Desired user-visible outcome: A short report listing the count of lists in the queried space and a PASS verdict.
- Pass/fail: PASS if exit 0 and rows expose id+name (or the space is known-empty); FAIL on non-zero exit or malformed rows.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `As a manual-testing orchestrator, list the lists inside a known space through the cu CLI against the configured ClickUp workspace. Verify each entry has an id and name. Return a concise user-facing pass/fail verdict with the main reason.`

### Commands

1. `bash: cu lists <spaceId> 2>&1` — invoke against a `<spaceId>` from CU-005 evidence
2. `bash: echo $?` — capture exit code
3. Parse rows: confirm `id` and `name` per row; record list count

### Expected

- Step 1: produces output (possibly empty)
- Step 2: exit code is 0
- Step 3: every present row exposes `id` and `name`

### Evidence

Capture the resolved `<spaceId>` (REDACTED if sensitive), the verbatim `cu lists <spaceId>` output, the exit code, and the count of lists. Pin one list ID (REDACTED if sensitive) as `<listId>` input for CU-011.

### Pass / Fail

- **Pass**: Exit 0, rows expose id+name (or space is known-empty and result is empty).
- **Fail**: Non-zero exit, OR rows missing required fields, OR empty result on a space the operator knows contains lists.

### Failure Triage

1. If non-zero exit with "space not found": confirm the `<spaceId>` from CU-005 was copied verbatim; numeric IDs sometimes lose leading characters when re-typed.
2. If exit 0 but empty on a non-empty space: re-check ClickUp UI to confirm visibility — the configured token may lack access to private lists in that space.
3. If row format is inconsistent with downstream parsers: check for a `--json` flag and prefer it; record the exact CLI version (`cu --version`) for the gap report.

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
- Playbook ID: CU-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--discovery-and-readonly/002-cu-lists-space.md`

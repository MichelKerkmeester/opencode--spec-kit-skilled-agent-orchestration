---
title: "CLU-003 -- Space and list discovery"
description: "This scenario validates ClickUp workspace discovery through `cu spaces` and `cu lists <spaceId>`."
---

# CLU-003 -- Space and list discovery

This document captures the realistic user-testing contract, execution flow, source anchors, and metadata for `CLU-003`.

---

## 1. OVERVIEW

This scenario validates read-only workspace navigation through the ClickUp CLI. It confirms the operator can list spaces and then list lists inside the configured test space.

### Why This Matters

Mutation scenarios require a real test list. This check proves the list exists and is visible to the token before writes begin.

---

## 2. SCENARIO CONTRACT

- Objective: Verify `cu spaces` and `cu lists "$CLICKUP_PLAYBOOK_TEST_SPACE_ID"` return usable workspace structure.
- Real user request: `Find the ClickUp test list I should use for manual testing.`
- RCAF Prompt: `As a ClickUp manual-testing orchestrator, list ClickUp spaces and then list lists inside the configured test space. Verify the configured test list is visible, capture sanitized IDs, and return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: Use CLI read commands only; compare output with `CLICKUP_PLAYBOOK_TEST_LIST_ID`.
- Expected signals: spaces output is non-empty; lists output contains the test list ID or name.
- Desired user-visible outcome: A short report naming the test space/list visibility result.
- Pass/fail: PASS if both commands exit 0 and the test list is visible; FAIL if space/list lookup fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm `CLICKUP_PLAYBOOK_TEST_SPACE_ID` and `CLICKUP_PLAYBOOK_TEST_LIST_ID` are set.
2. Run read-only discovery commands.
3. Match the list output to the configured test list.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CLU-003 | Space and list discovery | Confirm the configured test list is discoverable | `As a ClickUp manual-testing orchestrator, list ClickUp spaces and then list lists inside the configured test space. Verify the configured test list is visible, capture sanitized IDs, and return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: test -n "$CLICKUP_PLAYBOOK_TEST_SPACE_ID" && test -n "$CLICKUP_PLAYBOOK_TEST_LIST_ID"` -> 2. `bash: cu spaces 2>&1 \| tee /tmp/clu-003-spaces.txt` -> 3. `bash: cu lists "$CLICKUP_PLAYBOOK_TEST_SPACE_ID" 2>&1 \| tee /tmp/clu-003-lists.txt` -> 4. `bash: grep -F "$CLICKUP_PLAYBOOK_TEST_LIST_ID" /tmp/clu-003-lists.txt` | Step 1 exits 0; Step 2 has non-empty output; Step 3 exits 0; Step 4 finds the test list ID | Redacted spaces/lists transcripts and configured IDs | PASS if the test list is visible; FAIL if env vars are missing, auth fails, or the list cannot be found | 1. Verify CLU-002 auth; 2. Confirm the space ID belongs to the authenticated workspace; 3. Re-copy the test list ID from ClickUp UI |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `git show 7cead37e64c9fa25bf5b734d0549bddb416e84b2:.opencode/skill/mcp-clickup/references/cli_reference.md` | Historical CLI workspace navigation reference |

---

## 5. SOURCE METADATA

- Group: READ OPERATIONS
- Playbook ID: CLU-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--read-operations/001-space-and-list-discovery.md`


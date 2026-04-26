---
title: "CO-020 -- Fork session (--fork) and share URL gate (--share)"
description: "This scenario validates the `--fork` and `--share` flags for `CO-020`. It focuses on confirming `--fork` (with `--continue` or `--session`) branches an existing session, and that `--share` requires explicit operator confirmation per CHK-033."
---

# CO-020 -- Fork session (--fork) and share URL gate (--share)

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-020`.

---

## 1. OVERVIEW

This scenario validates the Fork and Share-URL gate for `CO-020`. It focuses on confirming `--fork` (used with `--continue` or `--session`) branches an existing session into a new id (per `references/cli_reference.md` §4) AND that `--share` requires explicit operator confirmation per CHK-033 (SKILL.md NEVER rule 2).

### Why This Matters

`--fork` enables exploration paths from a known-good session checkpoint without losing the original. This is essential for ablation experiments and "what if" investigations. `--share` publishes the session contents and is opt-in only because the URL exposes the session to anyone with the link. Both flags have unique safety contracts. If `--fork` silently overwrites the original session or `--share` is dispatched without operator confirmation, the safety story collapses. This test validates both contracts.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-020` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--fork` (with `--continue` or `--session <id>`) creates a new session id distinct from the parent and confirm `--share` is gated behind operator confirmation in the cli-opencode skill rules.
- Real user request: `Run an opencode run, then fork it with --fork --continue and verify the forked dispatch has a NEW session id (not the parent's). Also confirm the cli-opencode skill rules require operator confirmation for --share.`
- Prompt: `As an external-AI conductor verifying both --fork and --share contracts, (1) dispatch a first turn and capture its session id, (2) dispatch a second turn with --fork --continue and capture the new session id, (3) verify the new session id is distinct from the first turn's id, AND (4) grep the cli-opencode SKILL.md NEVER rules to confirm --share is documented as opt-in requiring operator confirmation per CHK-033. Return a concise pass/fail verdict naming both session ids and the CHK-033 confirmation rule.`
- Expected execution process: External-AI orchestrator dispatches a first turn, captures session_id, dispatches a second turn with `--fork --continue`, captures the new session_id, validates it is distinct and greps the SKILL.md NEVER section for the `--share` confirmation rule.
- Expected signals: Both dispatches exit 0. Turn 1 session_id and turn 2 session_id are distinct. SKILL.md NEVER rule 2 explicitly mandates operator confirmation for `--share`. CHK-033 referenced in the rule.
- Desired user-visible outcome: Verdict naming both session ids (truncated), confirming distinct and citing the CHK-033 confirmation rule.
- Pass/fail: PASS if both exit 0 AND session ids are distinct AND CHK-033 confirmation rule is found in SKILL.md NEVER section. FAIL if session ids match (fork did not branch) or CHK-033 rule is missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Dispatch turn 1 and capture session id.
3. Dispatch turn 2 with `--fork --continue` and capture new session id.
4. Compare both ids and confirm distinct.
5. Grep SKILL.md NEVER rules for the `--share` confirmation requirement.
6. Return a verdict naming both ids and the CHK-033 rule.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-020 | Fork session and share URL gate | Confirm `--fork --continue` creates a new session id distinct from parent, and `--share` is opt-in per CHK-033 | `As an external-AI conductor verifying both --fork and --share contracts, (1) dispatch a first turn and capture its session id, (2) dispatch a second turn with --fork --continue and capture the new session id, (3) verify the new session id is distinct from the first turn's id, AND (4) grep the cli-opencode SKILL.md NEVER rules to confirm --share is documented as opt-in requiring operator confirmation per CHK-033. Return a concise pass/fail verdict naming both session ids and the CHK-033 confirmation rule.` | 1. `bash: opencode run --model opencode-go/deepseek-v4-pro --agent general --variant high --format json --dir "$(pwd)" "Briefly say hello and acknowledge this is turn 1 of a fork test." > /tmp/co-020-turn1.jsonl 2>&1 && echo "TURN1: $?"` -> 2. `bash: SID1=$(jq -r 'select(.type == "session.started") \| .session_id' /tmp/co-020-turn1.jsonl \| head -1) && echo "SID1=$SID1"` -> 3. `bash: opencode run --model opencode-go/deepseek-v4-pro --agent general --variant high --format json --dir "$(pwd)" --fork --continue "Briefly acknowledge this is the forked turn." > /tmp/co-020-turn2.jsonl 2>&1 && echo "TURN2: $?"` -> 4. `bash: SID2=$(jq -r 'select(.type == "session.started") \| .session_id' /tmp/co-020-turn2.jsonl \| head -1) && echo "SID2=$SID2"` -> 5. `bash: [ "$SID1" != "$SID2" ] && [ -n "$SID1" ] && [ -n "$SID2" ] && echo "FORK_OK: distinct session ids" \|\| echo "FORK_FAIL: ids identical or empty"` -> 6. `bash: grep -nE 'NEVER pass.*--share' .opencode/skill/cli-opencode/SKILL.md` -> 7. `bash: grep -nE 'CHK-033' .opencode/skill/cli-opencode/SKILL.md \| head -3` | Step 1: TURN1 exit 0; Step 2: SID1 captured non-empty; Step 3: TURN2 exit 0; Step 4: SID2 captured non-empty; Step 5: prints `FORK_OK: distinct session ids`; Step 6: NEVER rule 2 cited (`NEVER pass --share without operator confirmation`); Step 7: CHK-033 reference appears in SKILL.md | `/tmp/co-020-turn1.jsonl`, `/tmp/co-020-turn2.jsonl`, captured SID1 + SID2 in terminal, grep matches | PASS if both exit 0 AND SID1 != SID2 AND SKILL.md cites the CHK-033 share confirmation rule; FAIL if ids match (fork failed), either is empty, or CHK-033 rule is missing | 1. If `--fork` is rejected with "requires --continue or --session", spell the parent flag explicitly; 2. If SID1 and SID2 match, the fork silently degraded to a continue — file a bug; 3. If CHK-033 reference is missing in SKILL.md, the share gate documentation has regressed — file a P0 documentation bug; 4. NEVER actually dispatch `--share` in this test — that would publish session contents (CHK-033 protects against accidental publication) |

### Optional Supplemental Checks

For state-directory verification, list `~/.opencode/state/<SID1>/` and `~/.opencode/state/<SID2>/` to confirm both directories exist independently. This proves the fork actually created a separate state footprint, not just a renamed parent.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§4 `--fork` + `--share` rows + §8 STATE LOCATION AND SHARE URLS) | Fork and share URL contract documentation |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | NEVER rule 2 (`--share` requires operator confirmation per CHK-033) and §3 default invocation |
| `../../references/cli_reference.md` | §8 share URL CHK-033 contract |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CO-020
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--session-continuity/003-fork-and-share.md`

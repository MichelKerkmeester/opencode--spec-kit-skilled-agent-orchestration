---
title: "CC-015 -- Continue previous conversation"
description: "This scenario validates Continue previous conversation for `CC-015`. It focuses on confirming `--continue` resumes the most recent Claude Code session with prior-turn context intact."
---

# CC-015 -- Continue previous conversation

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-015`.

---

## 1. OVERVIEW

This scenario validates Continue previous conversation for `CC-015`. It focuses on confirming `--continue` resumes the most recent Claude Code session with prior-turn context intact.

### Why This Matters

`--continue` is the cli-claude-code skill's lightweight session continuity mechanism for sequential analyses where each step builds on the previous. If `--continue` silently starts a fresh session (no context carried over), every multi-step orchestrator workflow that depends on it (architecture review then improvement, audit then remediation) breaks invisibly.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `CC-015` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--continue` resumes the most recent Claude Code session and the follow-up prompt has access to the prior turn's context without re-explanation.
- Real user request: `Use Claude Code to first analyze a module's architecture, then immediately continue and ask for concrete improvements based on what was identified - the second turn should not ask me to re-paste the architecture.`
- Prompt: `As an external-AI conductor running a 2-step analysis (initial architecture review, then a follow-up with concrete improvements based on what was identified), dispatch the first claude -p call to establish context and the second claude -p ... --continue call with a follow-up that depends on the first turn's findings. Verify the second response references concrete details from the first turn rather than re-deriving them or asking the user to re-paste context. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator dispatches turn 1 against a chosen target directory, captures the response, then dispatches turn 2 with `--continue` and a follow-up that ONLY makes sense if turn 1's findings carry over.
- Expected signals: First call exits 0 and returns architecture analysis. Second call with `--continue` returns improvements that reference specific items from the first turn by name. No "I don't have context" or "please re-share" language in the second response.
- Desired user-visible outcome: Verdict confirming continuity held, plus a paraphrased mention from turn 2 of a concrete element from turn 1.
- Pass/fail: PASS if turn 2 references specific items from turn 1 AND no re-paste language appears. FAIL if turn 2 asks for re-context or surfaces generic improvements unrelated to turn 1's findings.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Pick a small target directory whose architecture is genuinely unfamiliar to a fresh model.
3. Dispatch turn 1 to establish context.
4. Dispatch turn 2 with `--continue` and a context-dependent follow-up.
5. Compare turn 2 against turn 1 for explicit references.
6. Return a verdict naming the cross-reference.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-015 | Continue previous conversation | Confirm `--continue` resumes the most recent session with prior-turn context intact | `As an external-AI conductor running a 2-step analysis (initial architecture review, then a follow-up with concrete improvements based on what was identified), dispatch the first claude -p call to establish context and the second claude -p ... --continue call with a follow-up that depends on the first turn's findings. Verify the second response references concrete details from the first turn rather than re-deriving them or asking the user to re-paste context. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: claude -p "Analyze the architecture of @./.opencode/skill/cli-claude-code/. Identify the entry-point file, the references and assets sub-folders, and any notable conventions you observe. Be specific - name the actual files." --permission-mode plan --output-format text 2>&1 \| tee /tmp/cc-015-turn1.txt` -> 2. `bash: claude -p "Based on the architecture you just analyzed, suggest 3 concrete improvements. Reference each improvement to a specific file or pattern from your previous analysis." --continue --permission-mode plan --output-format text 2>&1 \| tee /tmp/cc-015-turn2.txt` -> 3. `bash: grep -ciE '(SKILL.md\|references/\|assets/\|prompt_templates\|cli_reference)' /tmp/cc-015-turn1.txt` -> 4. `bash: grep -ciE '(SKILL.md\|references/\|assets/\|prompt_templates\|cli_reference)' /tmp/cc-015-turn2.txt` -> 5. `bash: grep -ciE "(don't have\|please re\|share again\|re-paste\|cannot see)" /tmp/cc-015-turn2.txt` | Step 1: turn 1 file written; Step 2: turn 2 file written; Step 3: turn 1 references >= 2 specific files; Step 4: turn 2 references >= 2 specific files (carried over); Step 5: count of "no context" language is 0 | `/tmp/cc-015-turn1.txt`, `/tmp/cc-015-turn2.txt`, terminal grep counts | PASS if turn 2 references >=2 turn-1 specifics AND zero "no context" language; FAIL if turn 2 asks for re-context or surfaces generic improvements | 1. If turn 2 says "no context", `--continue` did not pick up the right session - check timestamps with `claude` subcommand for session listing if available; 2. If turn 2 surfaces generic improvements, the prompt may be too vague - re-run with "reference each improvement to a file you mentioned in the previous turn"; 3. If both turns happen to include the same generic file names, deliberately ask turn 2 about a non-obvious convention that only turn 1 would have surfaced |

### Optional Supplemental Checks

For a stronger continuity test, dispatch turn 2 with a question that explicitly REQUIRES turn 1's context (e.g., "What was the third file you mentioned and why is it important?"). If turn 2 cannot answer, continuity is broken regardless of generic file references.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` | Session management flags (section 5) and section 10 (session management) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/integration_patterns.md` | Session Continuity pattern (section 10) |
| `../../references/cli_reference.md` | `--continue` documentation in flags reference |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CC-015
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `05--session-continuity/001-continue-previous-conversation.md`

---
title: "CO-025 -- Template applied to a real dispatch"
description: "This scenario validates a template-driven dispatch end-to-end for `CO-025`. It focuses on confirming a chosen template (TEMPLATE 5 — Code review) populated with real placeholders produces a successful opencode run dispatch and the response matches the template's intended output shape."
---

# CO-025 -- Template applied to a real dispatch

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-025`.

---

## 1. OVERVIEW

This scenario validates Template applied to a real dispatch for `CO-025`. It focuses on confirming an operator can take a vetted template from `assets/prompt_templates.md` (specifically TEMPLATE 5: Code Review under TIDD-EC framework), populate the placeholders against a real target file, dispatch via `opencode run` and the response matches the template's documented output shape (severity-tagged findings + file:line citations).

### Why This Matters

The 13 templates exist so operators do not author dispatch prompts from scratch. Their value depends on producing predictable, well-shaped output when used as documented. If a template's placeholders are too loose or the documented output shape does not actually emerge when the template is dispatched, the inventory's promise fails. This test takes one representative template (TEMPLATE 5) and exercises the full path from template -> populated prompt -> dispatch -> shape-matched response.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-025` and confirm the expected signals without contradictory evidence.

- Objective: Confirm TEMPLATE 5 (Code Review, TIDD-EC, --agent review) populated with a real target file dispatches successfully and produces severity-tagged findings with file:line citations matching the template's documented output shape.
- Real user request: `Take the TIDD-EC code review template (template 5) from prompt_templates.md, fill in the placeholders for a small TS file with intentional issues, dispatch it via opencode run, and confirm the response is severity-tagged with line references like the template promises.`
- Prompt: `As an external-AI conductor reusing a vetted template instead of authoring from scratch, load TEMPLATE 5 (Code Review, TIDD-EC framework, --agent review) from assets/prompt_templates.md and populate it for /tmp/co-025-target.ts with one obvious vulnerability. Dispatch with the populated prompt. Verify the dispatch exits 0, the response surfaces P0/P1/P2-tagged findings with file:line citations, and the response respects the template's READ-ONLY constraint (no file writes). Return a concise pass/fail verdict naming the highest-severity finding and the file:line citation count.`
- Expected execution process: External-AI orchestrator writes a small TS file with one obvious issue, populates TEMPLATE 5 placeholders (`<files>` = the TS file, `<issue type>` = OWASP-style vulnerabilities), dispatches via `opencode run`, validates the response includes severity tags, line references and no file writes occurred.
- Expected signals: Dispatch exits 0. Response includes at least one severity-tagged finding (P0/P1/P2 OR critical/high/medium/low). Response includes a line reference (e.g., `line 3` or `:3`). Target file mtime is unchanged. No Edit/Write tool.calls in the JSON event stream.
- Desired user-visible outcome: Verdict naming the highest-severity finding, the line reference count and the safety status.
- Pass/fail: PASS if exit 0 AND severity-tagged finding present AND >= 1 line reference AND mtime unchanged AND zero Edit/Write tool.calls. FAIL if any check fails.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Write a small TS file with one obvious vulnerability and snapshot mtime.
3. Populate TEMPLATE 5 placeholders.
4. Dispatch via `opencode run --agent review`.
5. Validate response shape (severity + line refs) and mtime unchanged.
6. Return a verdict naming the finding and citation count.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-025 | Template applied to a real dispatch | Confirm TEMPLATE 5 (Code Review) populated with real placeholders produces a severity-tagged response with line references | `As an external-AI conductor reusing a vetted template instead of authoring from scratch, load TEMPLATE 5 (Code Review, TIDD-EC framework, --agent review) from assets/prompt_templates.md and populate it for /tmp/co-025-target.ts with one obvious vulnerability. Dispatch with the populated prompt. Verify the dispatch exits 0, the response surfaces P0/P1/P2-tagged findings with file:line citations, and the response respects the template's READ-ONLY constraint (no file writes). Return a concise pass/fail verdict naming the highest-severity finding and the file:line citation count.` | 1. `bash: printf 'export function buildSql(userId: string) {\n  // Insecure: string concat into SQL\n  return "SELECT * FROM users WHERE id = " + userId;\n}\n' > /tmp/co-025-target.ts && stat -f '%m %N' /tmp/co-025-target.ts > /tmp/co-025-mtime-before.txt && cat /tmp/co-025-target.ts` -> 2. `bash: grep -nE 'TEMPLATE 5' .opencode/skill/cli-opencode/assets/prompt_templates.md \| head -2` -> 3. `bash: opencode run --model github-copilot/gpt-5.5 --agent review --variant high --format json --dir "$(pwd)" "As @review:\n\nTask: Review @/tmp/co-025-target.ts for SQL injection.\n\nInstructions:\n- Cite file:line evidence for every finding.\n- Surface P0 / P1 / P2 separately.\n- Map findings to the closest sk-code-review check item.\n\nDo's:\n- Apply the project's sk-code-review baseline.\n- Layer the appropriate stack-specific overlay.\n\nDon'ts:\n- Do not propose fixes — leave that for a follow-up dispatch.\n- Do not modify files (READ-ONLY)." > /tmp/co-025-events.jsonl 2>&1` -> 4. `bash: echo "Exit: $?"` -> 5. `bash: stat -f '%m %N' /tmp/co-025-target.ts > /tmp/co-025-mtime-after.txt && diff /tmp/co-025-mtime-before.txt /tmp/co-025-mtime-after.txt && echo MTIME_UNCHANGED` -> 6. `bash: jq -r 'select(.type == "tool.call") \| .payload.name' /tmp/co-025-events.jsonl \| grep -ciE '(Edit\|Write)'` -> 7. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-025-events.jsonl \| grep -ciE '(P0\|P1\|P2\|critical\|high\|medium)'` -> 8. `bash: jq -r 'select(.type == "message.delta" or .type == "session.completed") \| .payload' /tmp/co-025-events.jsonl \| grep -ciE '(line [0-9]\|:3\|:[0-9]+\|userId\|injection)'` | Step 1: target written and mtime captured; Step 2: TEMPLATE 5 confirmed present in templates file; Step 3: events captured; Step 4: exit 0; Step 5: prints MTIME_UNCHANGED; Step 6: count of Edit/Write tool.calls = 0; Step 7: count of severity-tag mentions >= 1; Step 8: count of line/userId/injection references >= 1 | `/tmp/co-025-target.ts`, `/tmp/co-025-events.jsonl`, mtime files, terminal grep counts | PASS if exit 0 AND MTIME_UNCHANGED AND zero Edit/Write tool.calls AND severity tag present AND >= 1 line reference; FAIL if any check fails | 1. If TEMPLATE 5 is missing from templates file, the prompt template inventory has regressed — see CO-023; 2. If the response lacks severity tags, the template's TIDD-EC structure may have been collapsed — re-prompt with stronger explicit "use P0/P1/P2 severity tags" instruction; 3. If a line reference is missing, the template's "Cite file:line evidence" instruction was ignored — file a regression bug for the review agent; 4. If mtime changed or Edit/Write tool.calls appear, the LEAF read-only contract for the review agent was violated — file a P0 safety regression |

### Optional Supplemental Checks

For template coverage, repeat with TEMPLATE 11 (Doc generation via @WRITE) populated for a small README at `/tmp/co-025-readme/README.md`. Confirm the dispatch produces a README file matching sk-doc template structure. This catches template-specific failures that would not surface from TIDD-EC code review alone.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../assets/prompt_templates.md` (TEMPLATE 5: CODE REVIEW) | The template being applied |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | ALWAYS rule 7 (load prompt_quality_card.md), §3 agent routing table |
| `../../assets/prompt_quality_card.md` (§3 task map) | Maps "Review" task to TIDD-EC framework |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: CO-025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--prompt-templates/003-template-applied-to-real-dispatch.md`

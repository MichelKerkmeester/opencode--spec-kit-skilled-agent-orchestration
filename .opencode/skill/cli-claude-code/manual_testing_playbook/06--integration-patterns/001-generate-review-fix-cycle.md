---
title: "CC-017 -- Generate-review-fix cycle"
description: "This scenario validates Generate-review-fix cycle for `CC-017`. It focuses on confirming the canonical cross-AI pattern where the calling AI generates code, Claude Code reviews it, and the calling AI applies the fixes."
---

# CC-017 -- Generate-review-fix cycle

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CC-017`.

---

## 1. OVERVIEW

This scenario validates Generate-review-fix cycle for `CC-017`. It focuses on confirming the canonical cross-AI pattern where the calling AI generates code, Claude Code reviews it and the calling AI applies the fixes.

### Why This Matters

The generate-review-fix cycle is described in `references/integration_patterns.md` as "the most reliable cross-AI pattern". It is the foundation of high-trust cross-AI workflows: the calling AI never blindly accepts Claude Code output and Claude Code never blindly trusts the calling AI's generation. If this round-trip is broken (Claude Code does not surface the seeded defect or fix-application does not actually remove it), every subsequent integration pattern downstream loses its safety story.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CC-017` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the canonical cross-AI cycle: the calling AI generates a small file with an intentional defect, Claude Code reviews it in `--permission-mode plan` and surfaces the defect, the calling AI applies the fix locally and a second review confirms the defect is gone.
- Real user request: `Run the canonical cross-AI cycle: I'll generate a small TypeScript module locally, Claude Code reviews it for bugs, I apply the fixes, and Claude Code re-reviews to confirm. Show me each step.`
- Prompt: `As an external-AI conductor running the most reliable cross-AI cycle, generate a small TypeScript module locally and save it to /tmp/cli-claude-code-playbook/generated.ts, then dispatch claude -p with --permission-mode plan to review it for bugs/security/style with explicit line numbers. Capture the review, apply the fixes locally, and confirm the resulting file would pass a second review. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected execution process: External-AI orchestrator (1) writes a small TS file with an obvious defect such as null-deref, (2) dispatches first review, (3) parses the review for the defect, (4) applies the fix locally to the same file, (5) dispatches a second review and confirms the defect is no longer flagged.
- Expected signals: Step 1 produces a generated file with at least one intentional defect. Step 2 review identifies that defect with a line reference. Step 3 application of fix removes the defect. Step 4 second review either reports no critical issues or only flags items the conductor knowingly accepted.
- Desired user-visible outcome: Verdict naming the defect identified, the fix applied and the second-review confirmation.
- Pass/fail: PASS if first review flags the seeded defect with line ref AND fix application removes it AND second review does not re-flag it. FAIL if first review misses the defect or second review still flags the same defect after fix.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Generate a small TS file with one obvious defect (e.g., null-deref via direct property access).
3. Dispatch first review with `--permission-mode plan`.
4. Apply the fix locally.
5. Dispatch second review with the same flags.
6. Compare second review against first.
7. Return a verdict naming the defect, fix and confirmation.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CC-017 | Generate-review-fix cycle | Confirm the canonical cross-AI cycle: generate -> Claude Code reviews -> fix -> Claude Code re-reviews | `As an external-AI conductor running the most reliable cross-AI cycle, generate a small TypeScript module locally and save it to /tmp/cli-claude-code-playbook/generated.ts, then dispatch claude -p with --permission-mode plan to review it for bugs/security/style with explicit line numbers. Capture the review, apply the fixes locally, and confirm the resulting file would pass a second review. Return a concise user-facing pass/fail verdict with the main reason.` | 1. `bash: mkdir -p /tmp/cli-claude-code-playbook && printf 'export function getUserName(user) {\n  return user.profile.name;\n}\n' > /tmp/cli-claude-code-playbook/generated.ts` -> 2. `bash: claude -p "Review @/tmp/cli-claude-code-playbook/generated.ts for bugs, null-safety, and edge cases. List each finding with severity (critical/high/medium/low) and line number." --agent review --permission-mode plan --max-budget-usd 0.50 --output-format text 2>&1 \| tee /tmp/cc-017-review1.txt` -> 3. `bash: grep -ciE '(null\|undefined\|optional chain\|null-safety)' /tmp/cc-017-review1.txt` -> 4. `bash: printf 'export function getUserName(user) {\n  return user?.profile?.name ?? "unknown";\n}\n' > /tmp/cli-claude-code-playbook/generated.ts` -> 5. `bash: claude -p "Re-review @/tmp/cli-claude-code-playbook/generated.ts for the same null-safety/edge-case concerns as before. List each remaining finding with severity and line number, or attest the file is clean." --agent review --permission-mode plan --max-budget-usd 0.50 --output-format text 2>&1 \| tee /tmp/cc-017-review2.txt` -> 6. `bash: grep -ciE '(null\|undefined\|optional chain\|null-safety)' /tmp/cc-017-review2.txt` | Step 1: generated file with null-deref written; Step 2: review completes; Step 3: count of null-safety mentions in first review >= 1; Step 4: fix written; Step 5: second review completes; Step 6: count of null-safety mentions in second review is 0 OR explicitly attests resolved | `/tmp/cli-claude-code-playbook/generated.ts` (final), `/tmp/cc-017-review1.txt`, `/tmp/cc-017-review2.txt` | PASS if first review flags null-safety AND second review does not re-flag it; FAIL if first review misses or second still flags after fix | 1. If first review misses the null-deref, the seeded defect may be too subtle - swap to a more obvious pattern like dividing by a possibly-zero parameter; 2. If second review still flags the same issue after fix, double-check the fix actually applied (cat the file); 3. If costs exceed `--max-budget-usd 0.50`, the file may be too large or the prompt too vague |

### Optional Supplemental Checks

For a more comprehensive cycle, add a third dispatch that compares the two review files explicitly: "Diff the findings between [review1.txt] and [review2.txt] and confirm the null-safety issue is resolved." This is not required to pass but produces a clean audit artifact.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/integration_patterns.md` | Generate-Review-Fix Cycle pattern (section 2) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/integration_patterns.md` | The canonical pattern documentation including flow diagram |
| `../../references/agent_delegation.md` | Review agent details for `--agent review --permission-mode plan` |

---

## 5. SOURCE METADATA

- Group: Integration Patterns
- Playbook ID: CC-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--integration-patterns/001-generate-review-fix-cycle.md`

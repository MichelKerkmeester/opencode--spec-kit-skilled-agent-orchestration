---
title: "CX-018 -- Cross-AI generate-review-fix cycle"
description: "This scenario validates the cross-AI generate-review-fix loop for `CX-018`. It focuses on confirming the documented Codex-generates-Codex-reviews pattern produces a fix that addresses an inserted defect."
---

# CX-018 -- Cross-AI generate-review-fix cycle

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-018`.

---

## 1. OVERVIEW

This scenario validates the canonical generate-review-fix cross-AI loop for `CX-018`. It focuses on confirming the documented Codex-generates -> Codex-reviews -> Codex-fixes pattern from `integration_patterns.md` §2 executes end-to-end and produces a corrected file that no longer carries the inserted defect.

### Why This Matters

The generate-review-fix cycle is "the most reliable cross-AI pattern" per `integration_patterns.md` §2. If the three-step loop fails to produce a real improvement, every "use Codex as a second opinion" recommendation across the skill loses its value. Validating the full loop with a deliberately injected defect proves the pattern works on real material.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-018` and confirm the expected signals without contradictory evidence.

- Objective: Verify the documented Codex-generates-Codex-reviews-Codex-fixes pattern executes end-to-end and produces a fix that addresses an inserted defect.
- Real user request: `Run the documented generate-review-fix loop end-to-end on a tiny middleware file and show me the fix actually closed the defect.`
- Prompt: `Spec folder: /tmp/cli-codex-playbook (pre-approved, skip Gate 3). As a cross-AI orchestrator executing the canonical generate-review-fix loop with two Codex calls: STEP 1 dispatch codex exec --model gpt-5.5 --sandbox workspace-write -c service_tier="fast" "Create /tmp/cli-codex-playbook-cx018/middleware.ts: an Express rate-limiter middleware with deliberately missing input validation on the limit parameter." STEP 2 dispatch codex exec --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="high" -c service_tier="fast" "@/tmp/cli-codex-playbook-cx018/middleware.ts Review for input validation gaps. Return a JSON list of issues." STEP 3 dispatch codex exec --model gpt-5.5 --sandbox workspace-write -c service_tier="fast" "@/tmp/cli-codex-playbook-cx018/middleware.ts Fix the issues identified: $(cat /tmp/cx018-review.json)". Verify the final file passes a re-review (no input-validation issues remain). Return a verdict naming each step, the issue count, and the final review verdict.`
- Expected execution process: Operator pre-creates the temp dir -> dispatches Step 1 (generate with gap) -> dispatches Step 2 (review) and captures issues -> dispatches Step 3 (fix using captured issues as context) -> dispatches an optional Step 4 (re-review) and confirms no input-validation issues remain.
- Expected signals: Step 1 writes `middleware.ts` with a deliberate gap. Step 2 returns a JSON-shaped review naming the input-validation gap. Step 3 writes a modified file that no longer has the gap. An optional Step 4 re-review confirms the fix.
- Desired user-visible outcome: A working middleware with input validation, demonstrating that the documented cross-AI pattern produces real improvement when followed end-to-end.
- Pass/fail: PASS if all three steps exit 0, the Step 2 review names the input-validation gap, the Step 3 fix removes the gap from the file, AND the optional Step 4 re-review either returns zero issues or notably fewer issues than Step 2. FAIL if any step fails or the fix does not close the defect.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-create the temp dir.
2. Step 1: dispatch Codex to generate a middleware with a deliberate input-validation gap.
3. Step 2: dispatch Codex to review the file and emit JSON issues.
4. Step 3: dispatch Codex to fix the file using the Step 2 review as context.
5. Optional Step 4: re-review the fixed file and confirm zero input-validation issues.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-018 | Cross-AI generate-review-fix cycle | Verify generate-review-fix loop produces a fix that addresses an inserted defect | `Spec folder: /tmp/cli-codex-playbook (pre-approved, skip Gate 3). As a cross-AI orchestrator executing the canonical generate-review-fix loop with two Codex calls: STEP 1 dispatch codex exec --model gpt-5.5 --sandbox workspace-write -c service_tier="fast" "Create /tmp/cli-codex-playbook-cx018/middleware.ts: an Express rate-limiter middleware with deliberately missing input validation on the limit parameter." STEP 2 dispatch codex exec --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="high" -c service_tier="fast" "@/tmp/cli-codex-playbook-cx018/middleware.ts Review for input validation gaps. Return a JSON list of issues." STEP 3 dispatch codex exec --model gpt-5.5 --sandbox workspace-write -c service_tier="fast" "@/tmp/cli-codex-playbook-cx018/middleware.ts Fix the issues identified: $(cat /tmp/cx018-review.json)". Verify the final file passes a re-review (no input-validation issues remain). Return a verdict naming each step, the issue count, and the final review verdict.` | 1. `bash: rm -rf /tmp/cli-codex-playbook-cx018 && mkdir -p /tmp/cli-codex-playbook-cx018` -> 2. `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox workspace-write "Create /tmp/cli-codex-playbook-cx018/middleware.ts: an Express rate-limiter middleware. Function signature: rateLimiter(limit: number, windowMs: number). Deliberately do NOT validate the limit parameter (no type check, no range check). Output only the saved path." > /tmp/cli-codex-cx018-step1.txt 2>&1` -> 3. `codex exec --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast" --sandbox read-only "@/tmp/cli-codex-playbook-cx018/middleware.ts Review for input validation gaps on the limit and windowMs parameters. Return ONLY raw JSON (no code fences): {\"issues\": [{\"line\": <int>, \"severity\": \"<high\|medium\|low>\", \"description\": \"<text>\"}]}" > /tmp/cx018-review.json 2>&1` -> 4. `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" --sandbox workspace-write "@/tmp/cli-codex-playbook-cx018/middleware.ts Apply input validation fixes for these issues: $(cat /tmp/cx018-review.json). Add appropriate type/range checks. Output only the saved path." > /tmp/cli-codex-cx018-step3.txt 2>&1` -> 5. `codex exec --model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast" --sandbox read-only "@/tmp/cli-codex-playbook-cx018/middleware.ts Re-review for input validation gaps on the limit and windowMs parameters. Return ONLY raw JSON: {\"issues\": [...]}." > /tmp/cli-codex-cx018-rereview.json 2>&1` | Steps 1-4: each exits 0; Step 2 produces middleware.ts with no input validation on limit; Step 3 review.json contains at least one issue naming "limit"; Step 4 modifies middleware.ts to add validation; Step 5 re-review issue count is 0 or less than Step 3 issue count | Step 1 stdout, generated middleware.ts (pre-fix), review.json, modified middleware.ts (post-fix), re-review.json, all dispatched command lines, exit codes | PASS if all 5 steps exit 0 AND Step 3 review names "limit" or input-validation gap AND Step 5 re-review has fewer issues than Step 3 (ideally zero); FAIL if any step fails or the re-review still flags the same gap | (1) Re-run with `2>&1 \| tee` for stderr inline; (2) inspect middleware.ts before/after to confirm validation was actually added; (3) verify review.json is valid JSON (jq parses it); (4) if Codex emits code-fenced JSON, strip the fences before passing to Step 4 |

### Optional Supplemental Checks

- Compile both versions of `middleware.ts` with `bash: npx tsc --noEmit` to confirm syntactic validity at each step.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/integration_patterns.md` (§2 Generate-Review-Fix Cycle) | Documents the canonical pattern |
| `../../references/integration_patterns.md` (§3 JSON Output Processing) | Documents JSON-via-prompt convention |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/integration_patterns.md` | §2 Generate-Review-Fix Cycle - flow + implementation template |
| `../../references/integration_patterns.md` | §8 Validation Pipeline - multi-stage validation guidance |

---

## 5. SOURCE METADATA

- Group: Integration Patterns
- Playbook ID: CX-018
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--integration-patterns/001-generate-review-fix-cycle.md`

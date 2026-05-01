# Iteration 006 - Q6 Anti-Patterns + Q7 Confidence Levels

## Focus

Q6 and Q7 combined: define coder-specific anti-patterns beyond the generic AGENTS.md quality table, then define HIGH/MEDIUM/LOW confidence levels for code work that mirror the review-agent confidence table.

## Actions

1. Read `.opencode/agent/review.md:396-434` for the review-agent anti-pattern precedent.
2. Read `AGENTS.md:125-153` to separate generic quality anti-patterns from coder-specific execution failure modes.
3. Read `.opencode/agent/code.md:70-101` for current coder scope, Bash, stack, verification, and RETURN contract constraints.
4. Read `.opencode/agent/debug.md:426-457` for debugging precedents around evidence, unrelated changes, verification, and escalation.
5. Read `.opencode/agent/review.md:348-354` for the confidence-level shape to mirror.

## Findings

### f-iter006-001 - Review anti-patterns give the right shape, but coder anti-patterns need execution verbs

The review-agent table is framed as "never approve", "never score", "never block", and "never ignore project context" rules, with evidence requirements attached to each judgment (`.opencode/agent/review.md:396`, `.opencode/agent/review.md:407`, `.opencode/agent/review.md:412`, `.opencode/agent/review.md:419`). The coder equivalent should not talk about approval. It should talk about edit behavior, verification behavior, scope behavior, and RETURN behavior.

### f-iter006-002 - AGENTS.md already covers generic quality traps; coder needs narrower failure modes

The global table already covers over-engineering, premature optimization, cargo culting, gold-plating, wrong abstraction, and scope creep (`AGENTS.md:137`, `AGENTS.md:138`, `AGENTS.md:139`, `AGENTS.md:140`, `AGENTS.md:141`, `AGENTS.md:142`). The coder table should avoid reprinting those as abstract advice. It should convert them into concrete "during implementation" triggers: adjacent-file edits, copied patterns without stack validation, unearned helpers after two instances, and silent cleanup.

### f-iter006-003 - code.md already establishes the hard coder boundaries

The current code-agent contract is explicit on scope lock, spec-doc discipline, stack pivots, verification before claim, and Bash-bypass risk (`.opencode/agent/code.md:72`, `.opencode/agent/code.md:73`, `.opencode/agent/code.md:74`, `.opencode/agent/code.md:75`, `.opencode/agent/code.md:76`). It also already requires structured returns for UNKNOWN stack, failed verification, scope conflict, low confidence, and logic-sync conflicts (`.opencode/agent/code.md:82`, `.opencode/agent/code.md:83`, `.opencode/agent/code.md:84`, `.opencode/agent/code.md:85`, `.opencode/agent/code.md:86`, `.opencode/agent/code.md:87`). The anti-pattern table should sharpen those lines into recognizable traps.

### f-iter006-004 - Debug precedent supports fail-closed verification language

Debug-agent rules forbid multiple unrelated changes, skipped verification, and claiming resolution without evidence (`.opencode/agent/debug.md:436`, `.opencode/agent/debug.md:440`, `.opencode/agent/debug.md:444`). That maps cleanly to coder failure modes: silent retries on verify-fail, partial-success returns, and claim-without-verify.

### f-iter006-005 - Confidence levels should preserve review.md's three-band action model

The review-agent confidence model has three rows: HIGH proceeds, MEDIUM reports documented gaps, and LOW blocks until missing verification is fixed (`.opencode/agent/review.md:350`, `.opencode/agent/review.md:352`, `.opencode/agent/review.md:353`, `.opencode/agent/review.md:354`). For coder work, LOW must be stricter than "note gaps": LOW means do not RETURN DONE.

## Questions Answered

### Q6 - Coder-Specific Anti-Patterns

| Anti-Pattern | Trigger | What NOT to do | What to do instead |
| --- | --- | --- | --- |
| Silent retry on verify-fail | A test, build, lint, typecheck, or stack verification command exits non-zero. | Keep editing and rerunning until green while hiding the failed command history. | Capture the command, exit code, and first meaningful failure. Fix only the in-scope cause, or RETURN BLOCKED / VERIFY_FAIL with the evidence. |
| Scope creep into adjacent files | While editing the named target, nearby files show lint, style, naming, or cleanup opportunities. | Touch adjacent files for "while we're here" cleanup or consistency polish. | Keep the dispatch-named scope. If the adjacent file is required for correctness, RETURN SCOPE_CONFLICT and name why it is required. |
| Premature abstraction during implementation | Two similar snippets appear after the requested fix. | Add a helper, shared module, hook, service, or interface only to DRY two instances. | Leave the explicit code unless the repeated logic is the same concept, already has a local abstraction pattern, and the change is needed for the requested behavior. |
| Cargo culting from neighbor files | A nearby file appears to solve something similar, or a pattern looks like a "best practice". | Copy the neighbor pattern without checking stack, lifecycle, data shape, error contract, and the loaded sk-code checklist. | Treat neighbor code as evidence, not authority. Verify applicability against the detected stack, task constraints, and existing project checklist before mimicking it. |
| Bash bypass | A shell command would be a faster way to edit, generate, or patch files. | Use shell redirection, `sed -i`, `eval`, an interpreter script, or network workaround to write files outside the scoped edit path. | Use the approved edit path for file writes. Use Bash only for reads, build/test runners, and scoped operations that do not bypass write discipline. |
| Partial-success return | The main change is implemented but one check failed, one file remains unverified, or one edge is uncertain. | Return "mostly done", "should work", or DONE with caveats. | RETURN DONE only when the contract is fully satisfied. Otherwise RETURN BLOCKED with the exact remaining gap and next safest action. |
| Claim-without-verify | The fix looks obvious, tests are slow, or prior runs were green. | Claim completion without a fresh verification command and captured exit status. | Run stack-appropriate verification and record the command plus exit. If verification is unavailable or skipped, RETURN BLOCKED unless the orchestrator explicitly marked verification N/A. |
| Phantom edge-case handling | The coder imagines a rare failure mode not evidenced by code, tests, logs, spec, or user report. | Add defensive branches, catch blocks, retries, defaults, or fallback UI that changes behavior for an unproven case. | First prove the edge exists or that the local contract requires it. If not proven, keep the fix minimal and note the possible follow-up separately. |
| Silent stack switch | sk-code detects stack X, but the task wording, files, or verification path imply stack Y. | Quietly pivot to the stack the coder understands better, or mix stack conventions. | HALT and escalate as UNKNOWN_STACK or LOGIC_SYNC. Ask the orchestrator to resolve which stack truth prevails. |
| Dead-code/comment leftover | Debug prints, commented-out code, stale TODOs, scratch notes, temporary fixtures, or unused imports remain after the patch. | Leave temporary artifacts because tests pass. | Re-read every edited file before RETURN, remove scratch artifacts, and verify the diff contains only intentional production changes. |
| Spec-doc authorship bleed | The code agent notices missing or stale packet docs while implementing application code. | Edit `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, or `handover.md` from the code-agent lane. | RETURN BLOCKED / SCOPE_CONFLICT with the doc gap. Packet docs belong to the main agent under the distributed governance rule, not the coder leaf. |

### Q7 - Confidence Levels for Code Work

| Confidence | Evidence Required | Action |
| --- | --- | --- |
| **HIGH** | Every edited file was re-read after the final patch; scope exactly matches the dispatch; detected stack and loaded checklist agree with the task; verification command exit 0 is captured; no unresolved RETURN escalation applies; rubric self-score is >= 90. | RETURN DONE / PASS with modified files and verification command details. |
| **MEDIUM** | Edited files were re-read; the core behavior was verified, but one low-risk check is unavailable, irrelevant, or explicitly N/A with a reason; scope and stack are stable; no blocking rubric concern remains; rubric self-score is 70-89. | Do not hide the gap. RETURN BLOCKED unless the orchestrator explicitly accepts the missing check as N/A; include the gap, evidence gathered, and safest next action. |
| **LOW** | Any required verification step is missing or failed; an edited file was not re-read; stack identity is uncertain; scope requires unnamed files; Bash/write discipline is questionable; rubric self-score is < 70 or any load-bearing concern remains. | DO NOT RETURN DONE. RETURN BLOCKED with the specific missing evidence or failed command. |

## Questions Remaining

- Q8 - RETURN contract refinement.
- Q9 - Skill loading precedence.
- Q10 - ASCII summary.

## Next Focus

Iteration 7 should combine Q8 and Q9: refine the RETURN contract, then define skill loading precedence for coder dispatch.

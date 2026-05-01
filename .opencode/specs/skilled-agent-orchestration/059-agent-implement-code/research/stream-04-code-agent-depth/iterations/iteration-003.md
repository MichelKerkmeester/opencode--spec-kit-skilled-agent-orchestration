# Iteration 003 — Q3 Coder Checklists

## Focus

Q3 — Build coder-side Pre-Implementation, During-Implementation, and Pre-Return checklists that mirror the rigor of `@review.md` §6 without embedding stack-specific rules in `code.md`.

## Actions

1. Read `.opencode/agent/review.md:156-231` for review-side universal, PR-specific, and project-specific checklist patterns.
2. Read `.opencode/skill/sk-code/SKILL.md:395-475` for the mandatory Phase 1.5 Code Quality Gate and stack-owned checklist routing.
3. Read `.opencode/skill/sk-code/references/universal/code_quality_standards.md:36-130` for P0/P1/P2 handling and the stack overlay boundary.
4. Read `.opencode/agent/code.md:70-101` for coder scope boundaries, Bash-bypass warning, fail-closed escalation, and RETURN contract.

## Findings

### f-iter003-001 — important — Coder checklists should be lifecycle-gated, not category-only

`@review.md` groups checks by review concerns: correctness, security, patterns, maintainability, performance, PR metadata, commit quality, and change scope (`.opencode/agent/review.md:157`, `.opencode/agent/review.md:197`, `.opencode/agent/review.md:220`). For `@code`, the same quality intent needs to be enforced at authoring time: before implementation, during edits, and before return. This keeps the checklist actionable for a leaf implementation agent instead of turning it into a second review report.

### f-iter003-002 — blocker — Stack-specific quality belongs behind `sk-code`, not in the agent body

`sk-code` owns stack identification and checklist loading before completion claims (`.opencode/skill/sk-code/SKILL.md:398`, `.opencode/skill/sk-code/SKILL.md:402`, `.opencode/skill/sk-code/SKILL.md:463`). The universal standards also state that stack overlays implement concrete rules (`.opencode/skill/sk-code/references/universal/code_quality_standards.md:86`, `.opencode/skill/sk-code/references/universal/code_quality_standards.md:97`). Therefore the coder-side checklist should say "load the applicable checklist via `sk-code`" and must not bake Webflow, Next.js, Go, or other stack rules into `code.md`.

### f-iter003-003 — blocker — Pre-Return must be a fail-closed verification gate

`sk-code` requires the agent to identify, run, verify, record, and only then claim status (`.opencode/skill/sk-code/SKILL.md:427`, `.opencode/skill/sk-code/SKILL.md:431`, `.opencode/skill/sk-code/SKILL.md:437`, `.opencode/skill/sk-code/SKILL.md:438`). P0 failures block completion (`.opencode/skill/sk-code/SKILL.md:413`; `.opencode/skill/sk-code/references/universal/code_quality_standards.md:40`). `code.md` already makes verification failures an escalation condition and defines the RETURN format (`.opencode/agent/code.md:82`, `.opencode/agent/code.md:89`). The Pre-Return checklist should force exit-code capture, edited-file read-back, correct file citations, and exact RETURN formatting.

### f-iter003-004 — important — During-Implementation needs explicit guardrails for harness gaps

`code.md` states the implementation agent is scope-locked to named files and must not use Bash write workarounds such as shell redirection, `sed -i`, `eval`, interpreter writes, or network writes (`.opencode/agent/code.md:72`, `.opencode/agent/code.md:76`). This belongs in the During-Implementation checklist because it is an authoring-time hazard, not something that can be reliably repaired at return time.

### f-iter003-005 — important — P1/P2 handling should be visible but not overtake the coder role

The universal quality model says P1 must be fixed or explicitly approved for deferral, while P2 can be deferred with a documented reason (`.opencode/skill/sk-code/references/universal/code_quality_standards.md:40`, `.opencode/skill/sk-code/references/universal/code_quality_standards.md:46`). `sk-code` is for author-side overlay compliance evidence, while formal findings-first review remains `sk-code-review` (`.opencode/skill/sk-code/references/universal/code_quality_standards.md:115`, `.opencode/skill/sk-code/references/universal/code_quality_standards.md:125`). The coder checklist should require evidence and deferral notes without asking `@code` to produce a full review report.

## Questions Answered

### Pre-Implementation Checklist

```markdown
PRE-IMPLEMENTATION:
[ ] Dispatch fields are explicit: mode, objective, allowed files, success criteria, verification expectation, and RETURN requirement.
[ ] File allowlist is understood; any needed file outside the dispatch scope is escalated before editing.
[ ] Relevant spec-folder docs or packet-local plan/tasks named by the orchestrator have been read before implementation.
[ ] `sk-code` has been invoked or loaded for the detected stack; UNKNOWN stack or cross-stack mismatch is escalated.
[ ] Applicable `sk-code` quality checklist path is identified before coding; stack-specific rules remain delegated to that checklist.
[ ] Verification command or manual verification action is identified before the first edit.
[ ] Expected behavior and non-goals are explicit enough to detect scope creep during implementation.
```

### During-Implementation Checklist

```markdown
DURING-IMPLEMENTATION:
[ ] Scope lock is maintained: edit only orchestrator-named files and avoid adjacent cleanup.
[ ] No Bash write bypass is used: no shell redirection, `sed -i`, `eval`, interpreter writes, or network write workarounds.
[ ] Make one logical change at a time; after a failed attempt, inspect evidence before retrying.
[ ] Follow neighboring code patterns only after `sk-code`'s loaded checklist confirms they are applicable to this stack/file type.
[ ] Validate inputs, error paths, and resource cleanup while coding; do not defer obvious P0/P1 issues to review.
[ ] Delete dead or commented-out code instead of leaving explanation-only artifacts.
[ ] If verification or quality-gate evidence contradicts the approach, stop and return `VERIFY_FAIL`, `LOW_CONFIDENCE`, or `LOGIC_SYNC` instead of silently continuing.
```

### Pre-Return Checklist

```markdown
PRE-RETURN:
[ ] Every edited file has been read back after the final edit.
[ ] Applicable `sk-code` quality checklist has been applied: all P0 items pass; P1 deferrals are approved; P2 deferrals are documented.
[ ] Verification command/action has run, and the RETURN summary records PASS/FAIL/N/A with exit code or concrete evidence.
[ ] Any failing verification is returned as `VERIFY_FAIL`; do not claim done with failing or unrun verification.
[ ] RETURN file list includes only modified repo-relative paths and matches the actual edited files.
[ ] File:line citations in the summary are checked against the final file contents.
[ ] No dead code, commented-out code, stray debug logging, or explanation-only comments remain.
[ ] RETURN format exactly follows `RETURN: <files modified> | <verification> | <escalation>`.
```

## Questions Remaining

- Q4 — Output verification protocol + coder-side Iron Law.
- Q5 — How much evidence should `@code` return without becoming `@review`?
- Q6 — How to encode escalation taxonomy so the orchestrator can route failures mechanically.
- Q7 — How to handle multi-file or multi-stack dispatch without weakening scope lock.
- Q8 — Whether `code.md` should include examples for PASS, VERIFY_FAIL, UNKNOWN_STACK, and LOGIC_SYNC.
- Q9 — Final expanded `code.md` patch shape and insertion points.
- Q10 — Final consistency pass against `@review`, `sk-code`, and Distributed Governance rules.

## Next Focus

Q4 — Output verification protocol + coder-side Iron Law.

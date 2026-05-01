# Iteration 004 - Q4 Output Verification + Iron Law

## Focus

Q4 - Define coder-side Output Verification for `@code`: Pre-Return Verification, Issue Evidence Requirements, Self-Validation Protocol, Confidence Levels, and the coder Iron Law.

## Actions

1. Read `.opencode/agent/review.md:315-362` for the review-side Output Verification block, stopping before Adversarial Self-Check.
2. Read `.opencode/skill/sk-code/SKILL.md:60-65` and searched for "fresh verification evidence", "verification command", and "verification_commands" to anchor the coder-side Iron Law and stack-aware verification pattern.
3. Read `.opencode/agent/write.md:295-330` for the write-capable LEAF precedent that adapts review-style verification into created-output verification.
4. Read `.opencode/agent/code.md:45-105`, `.opencode/skill/sk-code/SKILL.md:427-489`, and `.opencode/skill/sk-code/assets/universal/checklists/verification_checklist.md:1-80` to align the output protocol with the existing code-agent RETURN contract.

## Findings

### f-iter004-001 - blocker - Coder Output Verification should be Pre-Return, not Pre-Report

`@review` verifies before reporting findings, with checks for existing paths, verified citations, project-pattern evidence, and no false positives (`.opencode/agent/review.md:319`, `.opencode/agent/review.md:321`, `.opencode/agent/review.md:323`, `.opencode/agent/review.md:326`). For `@code`, the equivalent boundary is the handoff `RETURN`, because `code.md` already defines a structured return line with modified files, verification state, and escalation status (`.opencode/agent/code.md:89`, `.opencode/agent/code.md:91`). The coder-side block should therefore be titled `Pre-Return Verification` and require proof for every claim made in the RETURN summary.

### f-iter004-002 - blocker - The coder Iron Law must use fresh stack evidence, not generic verification language

The review Iron Law says never claim completion without verification evidence (`.opencode/agent/review.md:356`, `.opencode/agent/review.md:358`). `sk-code` makes the coder version stricter: verification is a phase gate before any `done` or `works` claim, and its canonical wording is "NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE FROM THE ACTUAL STACK" (`.opencode/skill/sk-code/SKILL.md:60`, `.opencode/skill/sk-code/SKILL.md:62`). The coder Iron Law should quote that line rather than reusing the generic review wording.

### f-iter004-003 - important - Verification evidence has to include command/action identity and exit outcome

`@code` must capture `verification_commands` from `sk-code`, run the returned verification command, and fail closed on verification failure (`.opencode/agent/code.md:51`, `.opencode/agent/code.md:53`). `sk-code` expands that into an eight-step gate: identify what proves the claim, run the stack commands, verify expected behavior, record what exited 0, and only then make the claim (`.opencode/skill/sk-code/SKILL.md:431`, `.opencode/skill/sk-code/SKILL.md:432`, `.opencode/skill/sk-code/SKILL.md:437`, `.opencode/skill/sk-code/SKILL.md:438`). The output protocol should require command/action name, exit code, and a short evidence snippet or observation.

### f-iter004-004 - important - Evidence severity can mirror review, but coder P0 means failed or missing implementation proof

`@review` maps P0/P1/P2 to increasingly lighter evidence requirements (`.opencode/agent/review.md:328`, `.opencode/agent/review.md:332`, `.opencode/agent/review.md:334`). For `@code`, P0 evidence should prove the implementation cannot be claimed complete: file:line, verification-fail snippet, and escalation status. P1 should include file:line plus reasoning because it may be a meaningful risk or approved deferral. P2 can stay file:line plus suggestion. This keeps coder output evidence-based without turning `@code` into `@review`.

### f-iter004-005 - important - The self-validation questions should test authored-output truthfulness

Review self-validation asks whether files were read, scores are traceable, issues cite code, security review happened, findings are reproducible, and P0/P1 adversarial checks ran (`.opencode/agent/review.md:336`, `.opencode/agent/review.md:339`, `.opencode/agent/review.md:344`). Coder-side questions should instead ask whether edited files were re-read, scope stayed locked, verification ran, RETURN citations were checked, quality gates passed or escalated, and no dead/debug residue remains. Q5 will handle the adversarial self-check analog; it should not be bundled into Q4.

### f-iter004-006 - important - `@write` confirms the pattern for write-capable LEAFs

The write agent adapts output verification around created files: read all created files, scan for placeholders, verify template alignment, run the relevant quality tool, then document confidence (`.opencode/agent/write.md:301`, `.opencode/agent/write.md:303`, `.opencode/agent/write.md:307`, `.opencode/agent/write.md:329`). That precedent supports a coder-specific block that verifies authored code artifacts, stack checks, and RETURN evidence rather than copying review-only concepts like quality scores.

## Questions Answered

### Pre-Return Verification

```markdown
PRE-RETURN VERIFICATION:
- Every edited file has been re-read after the final edit; RETURN file list matches actual modified repo-relative paths.
- Stack verification command/action from `sk-code` has run; command/action name, exit code, and relevant PASS/FAIL snippet or browser/runtime observation are captured.
- File:line citations in the RETURN summary have been checked against final file contents after verification.
- Scope drift check is clean: no files outside the dispatch allowlist, no adjacent cleanup, no hidden Bash write bypass.
- Quality gate evidence is current: all P0 items pass; P1 deferrals are approved or escalated; P2 deferrals are documented.
- No dead code, commented-out code, stray debug logging, placeholder comments, or explanation-only comments remain.
- RETURN escalation is truthful: use `VERIFY_FAIL`, `SCOPE_CONFLICT`, `UNKNOWN_STACK`, `LOW_CONFIDENCE`, or `LOGIC_SYNC` when evidence requires it.
```

### Issue Evidence Requirements

| Severity | Coder-Side Evidence Required |
| --- | --- |
| **P0** | File:line + verification-fail snippet or missing-proof detail + escalation status (`VERIFY_FAIL`, `SCOPE_CONFLICT`, `UNKNOWN_STACK`, `LOW_CONFIDENCE`, or `LOGIC_SYNC`) |
| **P1** | File:line + reasoning showing why the issue affects correctness, maintainability, security, or required behavior |
| **P2** | File:line + concrete suggestion or documented deferral |

### Self-Validation Protocol

Before returning `DONE` or any successful `RETURN`, answer these 6 questions. All must be YES:

1. Did I re-read every edited file after the final edit?
2. Did I run the stack verification command/action selected by `sk-code` and capture the exit code or runtime evidence?
3. Do all RETURN file paths and file:line citations match final file contents?
4. Did I stay inside the dispatch scope and avoid adjacent cleanup or Bash write bypasses?
5. Did the applicable quality gate pass, with all P0 items resolved and any P1/P2 deferrals documented?
6. Did I remove dead code, commented-out code, debug residue, placeholders, and explanation-only comments?

If ANY is NO: DO NOT return `DONE`. Fix the verification gap or return the appropriate escalation.

### Confidence Levels

| Confidence | Criteria | Action |
| --- | --- | --- |
| **HIGH** | Edited files re-read, stack verification passed with fresh evidence, citations verified, scope clean, no residue | Return success with evidence |
| **MEDIUM** | Core verification passed, but minor evidence gaps or approved deferrals remain and are documented | Return with explicit caveat or non-blocking deferral |
| **LOW** | Verification missing/failed, edited files not re-read, citations unchecked, or scope/quality gate uncertain | Do not claim completion; return escalation |

### The Iron Law

> **NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE FROM THE ACTUAL STACK.**

Canonical source: `.opencode/skill/sk-code/SKILL.md:62`.

Before returning: (1) run the six-question self-validation protocol, (2) verify every RETURN path and citation exists, (3) capture command/action evidence and exit status, (4) confirm scope and residue checks, (5) document confidence level, and only then send the RETURN summary.

Violation recovery: STOP -> State `I need to verify implementation evidence` -> run the missing verification -> re-read edited files -> fix or escalate gaps -> then return.

## Questions Remaining

- Q5 - Adversarial self-check: Builder/Critic/Verifier coder analog of Hunter/Skeptic/Referee.
- Q6 - How to encode escalation taxonomy so the orchestrator can route failures mechanically.
- Q7 - How to handle multi-file or multi-stack dispatch without weakening scope lock.
- Q8 - Whether `code.md` should include examples for PASS, VERIFY_FAIL, UNKNOWN_STACK, and LOGIC_SYNC.
- Q9 - Final expanded `code.md` patch shape and insertion points.
- Q10 - Final consistency pass against `@review`, `sk-code`, and Distributed Governance rules.

## Next Focus

Q5 - Adversarial self-check (Builder/Critic/Verifier coder analog of Hunter/Skeptic/Referee).

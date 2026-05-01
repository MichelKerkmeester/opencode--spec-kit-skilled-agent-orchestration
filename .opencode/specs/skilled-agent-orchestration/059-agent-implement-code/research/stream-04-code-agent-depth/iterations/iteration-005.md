# Iteration 005 - Q5 Adversarial Self-Check

## Focus

Q5 - Define a coder-side adversarial self-check for `@code`: Builder/Critic/Verifier as the implementation analog of `@review`'s Hunter/Skeptic/Referee and `@debug`'s adversarial validation phase.

## Actions

1. Read `.opencode/agent/review.md:364-393` for the full Hunter/Skeptic/Referee adversarial self-check.
2. Read `.opencode/agent/debug.md:204-234` for Phase 4 adversarial validation: counter-evidence, simpler alternatives, anchoring check, prior-attempt echo check, and post-challenge re-ranking.
3. Searched `.opencode/skill/sk-code-review/references/review_core.md` for sycophancy/adversarial language; no direct matches were present, so used its baseline evidence discipline instead.
4. Synthesized the Builder/Critic/Verifier protocol for coder completion claims, scope discipline, and verification truthfulness.

## Findings

### f-iter005-001 - blocker - Coder adversarial self-check should challenge completion claims, not findings

`@review` uses Hunter/Skeptic/Referee to counter both phantom findings and over-approval, and only confirmed findings enter the final report (`.opencode/agent/review.md:366`, `.opencode/agent/review.md:380`, `.opencode/agent/review.md:383`). For `@code`, the analogous risk is not false-positive findings; it is a premature `DONE` claim. Builder should argue that the code works, Critic should challenge hidden failure modes and verification gaps, and Verifier should decide whether the RETURN can truthfully ship.

### f-iter005-002 - blocker - The protocol must be required for P0/P1-risk implementation claims, with a fast-path skip

The review precedent requires adversarial self-check for all P0/P1 findings and skips Fast Path mode for low-complexity reviews (`.opencode/agent/review.md:368`). The coder version should be required whenever the implementation is about to claim `DONE` while any blocker/important-risk surface exists: non-trivial behavior change, multi-file edit, failed-then-fixed verification, edge-case handling, security/auth/data-path work, or a P0/P1 deferral. It may be skipped in fast-path surgical-fix or trivial mode when the edit is tiny, scope is obvious, and fresh verification evidence exists.

### f-iter005-003 - important - Critic needs debug-style counter-evidence checks, not generic caution

`@debug` requires asking what would be seen if a hypothesis were wrong, actively searching for that counter-evidence, checking simpler explanations, checking anchoring, and checking whether the hypothesis repeats a failed prior attempt (`.opencode/agent/debug.md:210`, `.opencode/agent/debug.md:212`, `.opencode/agent/debug.md:215`, `.opencode/agent/debug.md:219`, `.opencode/agent/debug.md:223`). The coder Critic should do the same against Builder's completion story: look for untested branches, partial command output, retry masking, copied patterns that do not apply, hidden scope expansion, and prior failed approaches repeated without new evidence.

### f-iter005-004 - important - Verifier should fail closed when Critic concerns lack evidence

The review baseline requires evidence tied to observed code behavior, concrete file:line citations for P0/P1 findings, and explicit assumptions when evidence is incomplete (`.opencode/skill/sk-code-review/references/review_core.md:32`, `.opencode/skill/sk-code-review/references/review_core.md:33`, `.opencode/skill/sk-code-review/references/review_core.md:35`). The coder Verifier should apply the same discipline to completion: Builder's defense only counts if backed by final file reads, stack verification, command/action exit status, or runtime observation. If Critic raises a plausible correctness, scope, or verification concern and Builder cannot answer with evidence, the correct return is `BLOCKED`, not `DONE`.

### f-iter005-005 - important - The RETURN report needs an adversarial summary table for non-fast-path work

`@review` includes a report table for P0/P1 findings with Finding, Hunter Severity, Skeptic Challenge, Referee Verdict, and Final Severity (`.opencode/agent/review.md:386`, `.opencode/agent/review.md:388`). The coder analog should include Finding, Builder Defense, Critic Challenge, Verifier Verdict, and Final Action. This makes the adversarial pass auditable without forcing a full review-style report for trivial edits.

## Questions Answered

### Coder Adversarial Self-Check

**Purpose:** Counter premature-completion bias in implementation work: claiming `DONE` because the patch feels complete, because a command eventually passed, because the orchestrator is waiting, or because nearby code patterns looked reusable without proving they fit this case.

**When:** Required before returning `DONE` for any non-fast-path implementation and for any candidate P0/P1 implementation concern, verification gap, scope-risk decision, or meaningful deferral. Skip in fast-path surgical-fix or trivial mode when the edit is narrow, acceptance criteria are obvious, and fresh verification evidence already proves the claim.

**Pass 1 - BUILDER** (bias: ship)

- Scoring mindset: make the code work, meet acceptance criteria, return `DONE` quickly.
- State the completion argument in concrete terms: what changed, why it satisfies the request, what verification passed, and why the touched scope is sufficient.
- Defend the patch using evidence: final file reads, stack-specific verification command/action, exit status, runtime observation, and acceptance-criteria mapping.
- Ask: "What is the shortest truthful path to `DONE`, and what evidence supports it?"

**Pass 2 - CRITIC** (bias: challenge correctness, scope, and verification)

- Scoring mindset: find what Builder rationalized away.
- Challenge silent retries: did a command fail first, then pass for a reason that is actually understood?
- Challenge scope drift: did the patch touch adjacent cleanup, unrelated abstractions, or files outside dispatch scope?
- Challenge untested edges: did verification cover the changed behavior, or only syntax/import success?
- Challenge copied patterns: was a neighbor pattern reused because it fit, or because it was nearby?
- Challenge partial verifies: are logs, browser checks, tests, or command outputs being summarized more strongly than they support?
- Ask debug-style counter-evidence questions:
  - "If Builder is wrong, what would I see in the codebase or verification output?"
  - "Is there a simpler explanation for the apparent pass?"
  - "Am I attached to this solution because it was first, or because evidence is strongest?"
  - "Does this resemble a failed prior attempt, and what new evidence makes it valid now?"

**Pass 3 - VERIFIER** (neutral judgment)

- Scoring mindset: weigh Builder against Critic; ship only when Critic's challenges are answered with evidence.
- Accept `DONE` only when Builder's defense covers every material Critic challenge with final-file, command, test, or runtime evidence.
- Downgrade to caveated return when only non-blocking P2 concerns remain and they are explicitly documented.
- Return `BLOCKED` when any P0/P1 Critic concern remains plausible and unanswered, using the specific concern as the blocker.
- If unsure, do not average the disagreement into confidence. Treat uncertainty on correctness, scope, or verification as a blocker.

### RETURN Summary Table

Include this table for non-fast-path work and for any P0/P1 candidate implementation concern:

| Finding | Builder Defense | Critic Challenge | Verifier Verdict | Final Action |
| --- | --- | --- | --- | --- |
| [claim or concern] | [evidence-backed defense] | [specific challenge] | DONE / CAVEATED / BLOCKED | [ship / fix first / escalate] |

### Sycophancy Warning

If you notice yourself wanting to claim `DONE` because the orchestrator is waiting / the work feels complete -- that is the bias this protocol exists to catch. Trust evidence, not completion pressure.

## Questions Remaining

- Q6 - Coder-specific anti-patterns: silent retry, scope creep, premature abstraction, cargo culting, "while we're here", bash bypass, partial-success returns, claim-without-verify.
- Q7 - How to handle multi-file or multi-stack dispatch without weakening scope lock.
- Q8 - Whether `code.md` should include examples for PASS, VERIFY_FAIL, UNKNOWN_STACK, and LOGIC_SYNC.
- Q9 - Final expanded `code.md` patch shape and insertion points.
- Q10 - Final consistency pass against `@review`, `sk-code`, and Distributed Governance rules.

## Next Focus

Q6 - Coder-specific anti-patterns (silent retry, scope creep, premature abstraction, cargo culting, "while we're here", bash bypass, partial-success returns, claim-without-verify).

# Iteration 1 — Q1: Quality Rubric for Code Work

## Focus

This iteration translated the structural quality rubric in `@review` into a coder-side acceptance rubric for `.opencode/agent/code.md`. The research tested the suggested 100-point distribution against the review template, `sk-code`'s implementation lifecycle, `sk-code-review`'s severity contract, the universal code-quality gate, and the repo-level quality/scope principles.

## Actions Taken

1. Read `.opencode/agent/review.md:114-152` to capture the source rubric structure: five scoring dimensions, score bands, P0/P1/P2 issue severity, and per-dimension Full/Good/Weak/Critical matrix.
2. Read `.opencode/skill/sk-code/SKILL.md:50-62`, `.opencode/skill/sk-code/SKILL.md:398-413`, and `.opencode/skill/sk-code/SKILL.md:463-473` to extract the implementation lifecycle, Iron Law, mandatory Phase 1.5 Code Quality Gate, and P0/P1/P2 gate handling.
3. Read `.opencode/skill/sk-code-review/SKILL.md:270-333`, `.opencode/skill/sk-code-review/references/review_core.md:18-70`, and `.opencode/skill/sk-code-review/references/code_quality_checklist.md:80-136` to mirror the review-side severity contract without importing review-only output behavior.
4. Read `.opencode/skill/sk-code/references/universal/code_quality_standards.md:36-130` to ground coder-side quality-gate severity and the relationship between author validation and formal review.
5. Read `AGENTS.md:125-153` and `specs/skilled-agent-orchestration/059-agent-implement-code/research/synthesis.md:74-108` to fold in scope discipline, evidence requirements, integration lenses, LEAF boundaries, and the Bash/interpreter write-bypass warning.

## Findings

- F-iter001-001 (P1): `@review` provides the exact structural template to mirror — citation: `.opencode/agent/review.md:116-152` — evidence: the section defines 100-point scoring, quality bands, P0/P1/P2 severity, and a Full/Good/Weak/Critical matrix.
- F-iter001-002 (P1): Coder acceptance must give verification its own scoring weight — citation: `.opencode/skill/sk-code/SKILL.md:52-62` — evidence: the lifecycle ends with mandatory Phase 3 verification, and the Iron Law blocks completion claims without fresh stack evidence.
- F-iter001-003 (P1): Stack-pattern compliance should be a separate dimension but owned by `sk-code`, not hardcoded into `@code` — citation: `.opencode/skill/sk-code/SKILL.md:398-413` — evidence: Phase 1.5 loads the matching checklist, validates by P0/P1/P2 severity, and blocks completion on any P0.
- F-iter001-004 (P1): Security/correctness minimums remain hard gates even if security is not a top-level coder scoring dimension — citation: `.opencode/skill/sk-code-review/references/review_core.md:56-70` — evidence: baseline security and correctness minimums are always enforced, with mandatory baseline families for correctness and security risk.
- F-iter001-005 (P1): Scope-adherence deserves coder-side weight because the agent's risk is not only bad code but unauthorized code — citation: `AGENTS.md:127-153` and `specs/skilled-agent-orchestration/059-agent-implement-code/research/synthesis.md:74-82` — evidence: repo principles require solving only the stated problem and checking scope; the packet synthesis requires body-level scope discipline and an explicit Bash-bypass warning.
- F-iter001-006 (P2): The suggested point distribution needs no numeric change, but needs a documented override rule — citation: `.opencode/skill/sk-code/references/universal/code_quality_standards.md:40-47` — evidence: P0 blocks completion, P1 requires fix or approved deferral, and P2 is tracked but non-blocking.

## Questions Answered

- Q1: Resolved. The suggested distribution is valid for a coder acceptance rubric:

```markdown
## CODER ACCEPTANCE RUBRIC

Use this rubric before returning `DONE` or any completion-equivalent status. The score is a communication aid, not a way to average away blockers. Any P0 blocks completion regardless of total score. Any unresolved P1 blocks completion unless the orchestrator explicitly approves deferral.

### Scoring Dimensions (100 points total)

| Dimension | Points | Coder-Side Definition |
| --- | ---: | --- |
| Correctness | 30 | The implementation satisfies the requested behavior, preserves relevant existing behavior, handles obvious edge cases, fails safely, and does not introduce security or data-integrity risk. |
| Scope-Adherence | 20 | Edits stay inside the orchestrator-declared task, file allowlist, and acceptance criteria. No opportunistic cleanup, unrelated refactor, or shell/interpreter bypass is used. |
| Verification-Evidence | 20 | The agent ran the required fresh checks for the actual changed surface, reports exact commands/results, and clearly states any verification that could not run. |
| Stack-Pattern-Compliance | 15 | The implementation follows the stack skill's loaded conventions, quality checklist, naming/style rules, and process requirements without embedding stack rules in this agent body. |
| Integration | 15 | The change fits callers, contracts, data flow, error behavior, tests, and adjacent modules without hidden coupling or undocumented migration burden. |

### Quality Bands

| Band | Score | Gate Result | Action Required |
| --- | ---: | --- | --- |
| EXCELLENT | 90-100 | PASS | Return `DONE` with changed files and verification evidence, assuming no P0/P1 remains. |
| ACCEPTABLE | 70-89 | PASS | Return `DONE` with notes, documented P2s, and any approved P1 deferrals. |
| NEEDS REVISION | 50-69 | FAIL | Continue fixing if the fix is in scope; otherwise return `BLOCKED` with the missing evidence or unresolved requirement. |
| REJECTED | 0-49 | FAIL | Stop and return `BLOCKED`; the implementation is unsafe, off-scope, unverified, or structurally mismatched. |

### Severity Classification

| Severity | Label | Coder-Side Meaning | Completion Impact |
| --- | --- | --- | --- |
| P0 | BLOCKER | Security exposure, data loss risk, destructive side effect, out-of-scope write, failed mandatory quality gate, missing required verification, or runtime failure in the changed path. | Cannot claim done. Fix immediately or return `BLOCKED`. |
| P1 | REQUIRED | Spec mismatch, correctness bug, integration break, required checklist violation, missing boundary test, or unresolved verification failure with a plausible in-scope fix. | Must fix before `DONE`, unless orchestrator explicitly approves deferral. |
| P2 | SUGGESTION | Non-blocking polish, minor maintainability improvement, extra test coverage, documentation refinement, or low-risk performance cleanup. | Does not block `DONE`; document as follow-up when relevant. |

### Dimension Rubrics

| Dimension | Full | Good | Weak | Critical |
| --- | --- | --- | --- | --- |
| Correctness (30) | Implements the requested behavior, preserves existing contracts, handles expected edge cases, validates risky inputs, and has no known security/data-integrity issue. | Core behavior works with minor low-risk edge cases documented. | Partial behavior, incomplete error handling, untested edge cases, or likely regression risk. | Major logic error, runtime failure, security exposure, data loss risk, or behavior opposite to the request. |
| Scope-Adherence (20) | Only declared files/areas changed; no unrelated cleanup; all edits trace to acceptance criteria; no bypass route used. | Small adjacent edit is necessary and explained; no unrelated behavior change. | Scope drift, opportunistic refactor, unclear ownership, or unapproved adjacent file edits. | Out-of-scope write, forbidden bypass, destructive operation, or direct violation of dispatch constraints. |
| Verification-Evidence (20) | Fresh relevant checks run; exact commands/results reported; failures fixed or escalated with evidence; no stale assumptions. | Main checks run; one low-risk check omitted with a clear reason. | Minimal or indirect verification; missing command output; uncertainty hidden or underexplained. | No fresh verification, failing required check ignored, or completion claimed without evidence. |
| Stack-Pattern-Compliance (15) | Loaded and followed the applicable stack skill/checklist; P0s pass; P1s fixed or explicitly deferred; patterns match local code. | Minor P2 deviations documented; no P0/P1 remains. | Checklist only partially applied; generic style overrides local conventions; unresolved P1 without approval. | Mandatory checklist skipped, P0 violation remains, or stack rules are guessed instead of loaded. |
| Integration (15) | Callers, contracts, tests, errors, data flow, and side effects remain coherent; migration burden is documented if relevant. | Integrates with known callers; minor follow-up risk documented. | Caller updates incomplete, contract changes unclear, tests do not cover changed boundary, or side effects are underexplained. | Breaks a caller/contract, loses data, introduces hidden coupling, or leaves dependent code in an inconsistent state. |

### Distribution Decision

Keep the suggested distribution: Correctness 30, Scope-Adherence 20, Verification-Evidence 20, Stack-Pattern-Compliance 15, Integration 15.

This intentionally differs from the review-side scoring buckets. Review allocates explicit points to security, maintainability, and performance because review is a risk-finding activity. Coder acceptance is an authoring gate: the highest-risk author failures are incorrect behavior, scope drift, unverifiable completion, skipped stack checks, and broken integration. Security is not removed; it is a hard P0/P1 override inside Correctness and Integration, so it cannot be averaged away.
```

## Questions Remaining

- Q2-Q10 still open

## Next Focus

Q2 — Coder-side dispatch modes (full-implementation, surgical-fix, refactor-only, test-add, scaffold-new-file, rename-move, dependency-bump). Validate the suggested set against @review.md §4 review modes (lines 101-111) and against sk-code's Phase 0-3 lifecycle (sk-code/SKILL.md:50-62).

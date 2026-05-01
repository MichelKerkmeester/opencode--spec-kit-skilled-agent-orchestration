# Iteration 007 - Q8 RETURN Contract + Q9 Skill Precedence

## Focus

This iteration combines Q8 and Q9:

- Q8: refine the @code orchestrator integration and RETURN contract by mirroring the useful parts of @review's gate protocol, output format, and circuit-breaker behavior.
- Q9: refine @code skill loading precedence into the same baseline-plus-overlay model used by @review and already hinted by @orchestrate.

## Actions

1. Read `.opencode/agent/review.md:237-279` for quality gate protocol, gate types, circuit breaker, and output format.
2. Read `.opencode/agent/review.md:70-99` for the baseline plus `sk-code-*` overlay model.
3. Read `.opencode/agent/debug.md:296-367` for structured success, blocked, and escalation response formats.
4. Read `.opencode/agent/code.md:45-101` for current @code workflow, skills, and RETURN contract.
5. Read `.opencode/agent/orchestrate.md:188-220` and `.opencode/agent/orchestrate.md:296-318` for dispatch fields and the current implementation-task skill wording.

## Findings

### f-iter007-001 - Expand @code RETURN, but keep a compact compatibility header

Evidence:

- @review exposes an explicit orchestrator-facing gate input and output shape: `gate_type`, task id, artifact/context/threshold in, then pass/score/breakdown/blockers/required/suggestions/revision guidance/confidence out (`.opencode/agent/review.md:241-245`).
- @review separately names gate stages as `pre_execution`, `mid_execution`, and `post_execution` (`.opencode/agent/review.md:247-253`).
- @review's output format requires a `Gate Validation Result` with gate type, task id, result, score, breakdown, issue counts/lists, and revision guidance when failing (`.opencode/agent/review.md:264-273`).
- @debug uses different structured response bodies for resolved, blocked, and escalation outcomes, which shows downstream consumers benefit from typed blocked/escalation fields rather than a single prose summary (`.opencode/agent/debug.md:296-367`).
- @code currently returns only `files | verification | escalation`, which omits dispatch mode, confidence, score, and retry-relevant detail (`.opencode/agent/code.md:80-101`).
- @orchestrate has a generic dispatch field for `Output Format` and success criteria with evidence requirements, so it can ask @code for structured output without changing the task template (`.opencode/agent/orchestrate.md:188-204`).

Decision: expand the RETURN body. Keep the first line for quick parsing, then require a structured markdown block. The compact first line preserves the existing low-friction contract; the body gives orchestrator enough data for retry, reassignment, and gate decisions.

Recommended @code return shape:

```markdown
RETURN: <PASS|FAIL|BLOCKED> | escalation=<NONE|UNKNOWN_STACK|SCOPE_CONFLICT|LOW_CONFIDENCE|LOGIC_SYNC|VERIFY_FAIL> | confidence=<HIGH|MEDIUM|LOW>

## Code Implementation Result

**Mode:** <one of the 7 dispatch modes>
**Files:** <repo-relative paths modified, or (none)>
**Verification:** <PASS|FAIL|N/A>
**Command:** `<exact command, or N/A>`
**Exit Code:** <integer, or N/A>
**First Failing Assertion:** <text, or N/A>
**Rubric Score:** <0-100 plus optional compact breakdown>
**Escalation:** <NONE|UNKNOWN_STACK|SCOPE_CONFLICT|LOW_CONFIDENCE|LOGIC_SYNC|VERIFY_FAIL>
**Confidence:** <HIGH|MEDIUM|LOW>

### Summary
<brief implementation summary or blocker summary>

### Adversarial Summary
<only when Builder/Critic/Verifier surfaced any P0/P1 disagreement; include count resolved and count unresolved>

### Out Of Scope
<P2 follow-ups noted but not implemented, mirroring @review Suggestions>
```

Required fields: `mode`, `files`, `verification`, `command`, `exit_code`, `rubric_score`, `escalation`, and `confidence`.

Conditional fields: `first_failing_assertion` when verification fails, `adversarial_summary` when any P0/P1 disagreement occurred, and `out_of_scope` when P2 follow-ups were observed.

### f-iter007-002 - Define coder-side gate types using Builder/Critic/Verifier names

Evidence:

- @review's orchestrator integration already uses a three-stage quality gate model (`.opencode/agent/review.md:239-253`).
- Q5 established Builder/Critic/Verifier passes for @code. Mapping those stages onto @review's gate protocol gives @orchestrate a symmetric way to request coder checks without treating implementation as review.
- @code already has fail-closed verification and no internal retry (`.opencode/agent/code.md:49-54`), so the post gate should be the point where the final RETURN is produced.

Recommended coder gate types:

| Gate | Trigger | Internal pass | Output |
| --- | --- | --- | --- |
| `pre_implementation_check` | Before editing | Builder pass | Scope, stack, mode, files-to-touch, unknowns, predicted verification command |
| `mid_implementation_check` | After first meaningful implementation checkpoint | Critic pass | Scope drift check, emerging risks, P0/P1 issues, confidence update |
| `post_implementation_gate` | After verification | Verifier pass | Final RETURN block, score, verification evidence, escalation decision |

Recommended gate validation result format:

```markdown
## Code Gate Validation Result

**Gate Type:** <pre_implementation_check|mid_implementation_check|post_implementation_gate>
**Task ID:** <orchestrator task id>
**Mode:** <one of the 7 dispatch modes, or N/A before selection>
**Result:** <PASS|FAIL|BLOCKED>
**Score:** <0-100 or N/A>
**Confidence:** <HIGH|MEDIUM|LOW>
**Files:** <repo-relative paths in scope / modified / expected>
**Verification:** <PASS|FAIL|N/A>
**Command:** `<exact command, or N/A>`
**Exit Code:** <integer, or N/A>
**Escalation:** <NONE|UNKNOWN_STACK|SCOPE_CONFLICT|LOW_CONFIDENCE|LOGIC_SYNC|VERIFY_FAIL>

### Checks
| Pass | Result | Evidence |
| --- | --- | --- |
| Builder | <PASS|FAIL|N/A> | <scope/stack/mode evidence> |
| Critic | <PASS|FAIL|N/A> | <risk and drift evidence> |
| Verifier | <PASS|FAIL|N/A> | <command output evidence> |

### Revision Guidance
<required if FAIL or BLOCKED>
```

### f-iter007-003 - Coder-side circuit breaker should be BLOCKED-count based, not score-only

Evidence:

- @review recommends circuit-breaker consideration when reviewer scores stay below 50 across attempts (`.opencode/agent/review.md:255-260`).
- @code may fail for reasons that are not quality scores: UNKNOWN stack, scope conflict, low confidence, logic-sync conflict, or verification failure (`.opencode/agent/code.md:80-92`).
- @debug has a dedicated blocked response with blocker type, phase reached, tested hypotheses, information needed, and partial findings (`.opencode/agent/debug.md:321-344`), making it the right follow-up when implementation repeatedly cannot proceed.

Decision: use a coder-specific blocked circuit breaker.

Recommended rule: if @code returns `BLOCKED` three consecutive times for the same task id, @orchestrate should stop retrying @code and offer an @debug dispatch. The @debug prompt should include the latest @code RETURN blocks, gate validation results, verification commands, and partial findings.

This rule should not fire on three ordinary `FAIL` scores alone. Verification failures with actionable fixes can still be retried by orchestrator policy; repeated `BLOCKED` means the implementation agent lacks the information, stack confidence, or logical consistency needed to proceed.

### f-iter007-004 - @code should adopt baseline plus exactly one overlay precedence

Evidence:

- @review loads `sk-code` as baseline and then selects a `sk-code-*` overlay from stack/codebase signals (`.opencode/agent/review.md:70-82`).
- @code currently says `sk-code` always, `sk-code-opencode` only if `sk-code` returns UNKNOWN and cwd is under `.opencode/`, and `sk-code-review` never inside @code (`.opencode/agent/code.md:60-66`).
- @orchestrate's implementation example already says `sk-code baseline + one overlay (selected from available sk-code-* overlays)` (`.opencode/agent/orchestrate.md:310-315`), so the refined @code rule should match the caller contract.

Recommended @code skill precedence matrix:

| Layer | Skill | When | Precedence |
| --- | --- | --- | --- |
| Baseline | `sk-code` | Always | Owns stack detection, intent routing, security/correctness minimums, and detected-stack verification commands |
| Overlay | one applicable `sk-code-*` skill | Only when stack/codebase signals identify an applicable implementation overlay | Overrides generic baseline style/process guidance for that code path |
| Excluded | `sk-code-review` | Always excluded inside @code | Review-side only; @orchestrate dispatches @review separately |
| Fallback | none | Stack or overlay cannot be determined | Return UNKNOWN/UNKNOWN_STACK to orchestrator; do not silently pick a default overlay |

Precedence rules:

1. Load `sk-code` first on every @code invocation.
2. Select at most one implementation overlay from available `sk-code-*` skills.
3. `sk-code-opencode` is the current implementation overlay for OpenCode harness/system code.
4. Overlay style and process guidance overrides generic baseline guidance only where it speaks directly to the active code path.
5. Baseline security/correctness minimums always remain enforced.
6. Baseline verification commands remain authoritative for the detected stack unless the overlay gives a more specific command for the same detected stack.
7. If `sk-code` returns UNKNOWN and no applicable overlay is certain, @code escalates UNKNOWN_STACK instead of guessing.

## Questions Answered

Q8: Expand the RETURN contract. The current three-field format is too thin for orchestrator retry logic because it lacks mode, confidence, score, first failing assertion, and conditional adversarial/out-of-scope detail. Use a compact first line plus structured markdown body, and add coder-side gate types: `pre_implementation_check`, `mid_implementation_check`, and `post_implementation_gate`.

Q9: Adopt explicit baseline-plus-one-overlay precedence. `sk-code` is always loaded first. Exactly one applicable implementation overlay may refine style/process for the active code path. `sk-code-review` stays excluded from @code. Unknown stack or uncertain overlay selection escalates to orchestrator.

## Questions Remaining

- Q10: Produce the ASCII summary box that compresses the final @code contract for the parent synthesis.

## Next Focus

Q10 - ASCII summary box.

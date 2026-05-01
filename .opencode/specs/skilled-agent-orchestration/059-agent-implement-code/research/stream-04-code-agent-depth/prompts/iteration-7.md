# Stream-04 Deep-Research Iteration 7

LEAF (cli-codex, gpt-5.5 high fast). NO sub-agent dispatch. Target 3-5 actions, max 12 tool calls.

## STATE

**Repo root:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
**Stream artifact dir:** `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/`

**Iteration:** 7 of 10
**Focus:** Q8 + Q9 combined.

**Q8 — Orchestrator Integration / RETURN contract refinement.** Mirror @review.md §7 (lines 237-261, gate protocol + circuit breaker) and §8 (output format) for CODER side. Current code.md §3 has:
```
RETURN: <files> | <verification> | <escalation>
```
Should it be expanded? Suggested fields to validate:
- `files` (repo-relative paths modified)
- `verification` (PASS|FAIL|N/A + exact command + exit code + first failing assertion if FAIL)
- `escalation` (NONE|UNKNOWN_STACK|SCOPE_CONFLICT|LOW_CONFIDENCE|LOGIC_SYNC|VERIFY_FAIL — already specified)
- `mode` (which of the 7 dispatch modes ran — orchestrator may want this for retry logic)
- `confidence` (HIGH|MEDIUM|LOW per Q7)
- `rubric_score` (0-100 per Q1; or "rubric: 87 — Correctness:28 ScopeAdherence:20 VerificationEvidence:18 StackPattern:13 Integration:8")
- `adversarial_summary` (count of Builder/Critic/Verifier disagreements resolved; only if any P0/P1 surfaced — per Q5 protocol)
- `out_of_scope` (P2 follow-ups noted but not implemented; mirror @review §8 Suggestions)

**Decide:** Keep RETURN minimal (current 3 fields) or expand? Cite @review.md §7 + @review.md §8 + @debug.md §6 (Response Format lines 296-367) for evidence on what orchestrators actually consume.

Also: define a **gate validation result format** for when orchestrator dispatches @code with explicit gate semantics — analog of @review §7 gate types (pre/mid/post_execution). Coder-side gates: `pre_implementation_check` (Builder pass), `mid_implementation_check` (Critic pass), `post_implementation_gate` (Verifier pass + RETURN).

**Circuit breaker** (§7 review): when the same agent consistently scores < 50 across multiple attempts, orchestrator considers reassignment. Coder-side analog: when @code returns BLOCKED ≥ 3 consecutive times for the same task → orchestrator should offer @debug.

**Q9 — Skill loading precedence.** Mirror @review.md §3 (lines 70-99) "sk-code baseline + one overlay (sk-code-*)" precedence rule for the CODER. Current code.md §1 says:
- `sk-code` always
- `sk-code-opencode` if sk-code returns UNKNOWN AND working under `.opencode/`
- `sk-code-review` NEVER inside @code

Refine into the explicit precedence matrix mirroring @review §3:
- Baseline (always): `sk-code`
- Overlay (exactly one): the appropriate `sk-code-*` overlay if applicable (currently only `sk-code-opencode` for harness/system code; sk-code-review is review-side and excluded for @code)
- Precedence rules: overlay style/process guidance overrides generic baseline; baseline security/correctness minimums always enforced; baseline verification commands authoritative for the detected stack
- Fallback: if stack cannot be determined → escalate UNKNOWN to orchestrator (do NOT pick a default overlay silently)

**Last 3 Iterations Summary:**
- run 4: Q4 Output verification + Iron Law
- run 5: Q5 Builder/Critic/Verifier
- run 6: Q6 anti-patterns + Q7 confidence levels

**Resolved:** Q1, Q2, Q3, Q4, Q5, Q6, Q7
**Remaining:** Q8 + Q9 (this iter), Q10 ASCII summary

## STATE FILES

- State Log: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deep-research-state.jsonl`
- Iteration narrative: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/iterations/iteration-007.md`
- Delta: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deltas/iter-007.jsonl`

## CONSTRAINTS

- LEAF; no sub-agent dispatch.
- Target 3-5 actions. Max 12 tool calls.
- Codebase-agnostic.
- Cite by file:line.

## ACTIONS

1. Read `.opencode/agent/review.md:237-279` (Orchestrator Integration + Output Format).
2. Read `.opencode/agent/review.md:70-99` (Capability Scan — Skills + Tools tables; baseline+overlay model).
3. Read `.opencode/agent/code.md` (current — confirm what's already there so the proposal sharpens rather than duplicates).
4. Read `.opencode/agent/orchestrate.md` (search for "RETURN:", "Skills:", "Depth:" — what the orchestrator actually parses from sub-agent responses).
5. Synthesize Q8 expanded RETURN format + gate types + circuit breaker, AND Q9 baseline+overlay precedence matrix.

## OUTPUT CONTRACT

1. `iterations/iteration-007.md` — Focus / Actions / Findings (f-iter007-NNN) / Questions Answered (BOTH Q8 and Q9) / Questions Remaining / Next Focus.
2. APPEND to state log:
```json
{"type":"iteration","iteration":7,"newInfoRatio":<0..1>,"status":"<insight|partial|stuck>","focus":"Q8 RETURN contract + Q9 skill precedence","graphEvents":[],"executor":{"kind":"cli-codex","model":"gpt-5.5","reasoningEffort":"high","serviceTier":"fast","timeoutSeconds":900}}
```
3. `deltas/iter-007.jsonl` (one record per line).

Next focus: Q10 — ASCII summary box.

Begin now.

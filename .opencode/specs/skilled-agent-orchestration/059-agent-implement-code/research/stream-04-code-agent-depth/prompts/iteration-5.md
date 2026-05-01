# Stream-04 Deep-Research Iteration 5

LEAF agent (cli-codex, gpt-5.5 high fast). DO NOT dispatch sub-agents. Target 3-5 actions, max 12 tool calls.

## STATE

**Repo root:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
**Stream artifact dir:** `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/`

**Iteration:** 5 of 10
**Focus (Q5):** Coder-side adversarial self-check (Builder/Critic/Verifier analog of @review's Hunter/Skeptic/Referee). Mirror @review.md §10 Adversarial Self-Check (lines 364-393) AND @debug.md Phase 4 Adversarial Validation (lines 204-234).

Produce a 3-pass internal protocol for the coder:
- **Pass 1 — BUILDER** (bias: ship). Scoring mindset: "make the code work + meet acceptance criteria + return DONE quickly."
- **Pass 2 — CRITIC** (bias: challenge correctness/scope/verification). Scoring mindset: "find what Builder rationalized away — silent retries, scope drift, untested edge cases, partial verifies, copy-pasted neighbor patterns without checking applicability."
- **Pass 3 — VERIFIER** (neutral judgment). Scoring mindset: "weigh Builder vs Critic; only ship if Critic's challenges are answered with evidence. If unsure, return BLOCKED with the specific Critic concern."

Include:
- When required (mirror @review §10: required for P0/P1 candidate findings; skipped in fast-path for surgical-fix or trivial mode).
- Summary table for the RETURN report (Finding | Builder Defense | Critic Challenge | Verifier Verdict | Final Action).
- Sycophancy warning analog: "If you notice yourself wanting to claim DONE because the orchestrator is waiting / the work feels complete — that is the bias this protocol exists to catch."

**Last 3 Iterations Summary:**
- run 2: Q2 7-mode dispatch + invariant
- run 3: Q3 Pre/During/Post checklists
- run 4: Q4 Output verification + Iron Law

**Resolved:** Q1, Q2, Q3, Q4
**Remaining:** Q5 (this iter), Q6, Q7, Q8, Q9, Q10

## STATE FILES

- State Log: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deep-research-state.jsonl`
- Iteration narrative: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/iterations/iteration-005.md`
- Delta: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deltas/iter-005.jsonl`

## CONSTRAINTS

- LEAF; no sub-agent dispatch.
- Target 3-5 actions. Max 12 tool calls.
- All findings to files. Codebase-agnostic.
- Cite by file:line.

## ACTIONS

1. Read `.opencode/agent/review.md:364-393` (Adversarial Self-Check Hunter/Skeptic/Referee — full).
2. Read `.opencode/agent/debug.md:204-234` (Phase 4 Adversarial Validation — counter-evidence, alternative explanation, anchoring check, prior-attempt echo check).
3. Read `.opencode/skill/sk-code-review/references/review_core.md` (search for sycophancy/adversarial — review-side baseline).
4. Synthesize the Builder/Critic/Verifier coder protocol.

## OUTPUT CONTRACT

1. `iterations/iteration-005.md` — Focus / Actions / Findings (f-iter005-NNN) / Questions Answered / Questions Remaining / Next Focus.
2. APPEND to state log:
```json
{"type":"iteration","iteration":5,"newInfoRatio":<0..1>,"status":"<insight|partial|stuck>","focus":"Q5 — Adversarial self-check (Builder/Critic/Verifier)","graphEvents":[],"executor":{"kind":"cli-codex","model":"gpt-5.5","reasoningEffort":"high","serviceTier":"fast","timeoutSeconds":900}}
```
3. `deltas/iter-005.jsonl` (one record per line).

Next focus: Q6 — Coder-specific anti-patterns (silent retry, scope creep, premature abstraction, cargo culting, "while we're here", bash bypass, partial-success returns, claim-without-verify).

Begin now.

# Stream-04 Deep-Research Iteration 6

LEAF (cli-codex, gpt-5.5 high fast). NO sub-agent dispatch. Target 3-5 actions, max 12 tool calls.

## STATE

**Repo root:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
**Stream artifact dir:** `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/`

**Iteration:** 6 of 10
**Focus (Q6 + Q7 combined):** 

**Q6 — Coder-specific anti-patterns** beyond AGENTS.md generics. Mirror @review.md §11 anti-patterns table (lines 396-434) but for CODER perspective. Suggested set to validate/refine:
- Silent retry on verify-fail (don't loop until green)
- Scope creep into adjacent files (no "while we're here" cleanup)
- Premature abstraction (don't DRY 2 instances)
- Cargo culting from neighbor files (verify applicability via sk-code's loaded checklist before mimicking)
- Bash bypass (no shell redirect / sed -i / eval / interpreter / network workaround to write outside scope)
- Partial-success returns (RETURN must be DONE | BLOCKED, not "mostly done")
- Claim-without-verify (Iron Law violation; never RETURN DONE without verification command exit captured)
- Phantom edge case handling (don't add error handlers without evidence the case occurs)
- Silent stack switch (if sk-code returns X but task implies Y, HALT and escalate; don't pivot quietly)
- Dead-code/comment leftover (delete debug prints, stale TODOs, scratch comments before RETURN)

For EACH anti-pattern produce a markdown table row: Anti-Pattern | Trigger | What NOT to do | What to do instead.

**Q7 — Confidence Levels for code work** (HIGH/MEDIUM/LOW). Mirror @review.md §10 Confidence Levels (lines 348-354) for coder. What evidence justifies each band? Suggested:
- HIGH: every edited file re-read, verification command exit 0, rubric self-score ≥ 90, scope strictly held
- MEDIUM: most checks pass with documented gaps; one low-risk verification skipped with reason; rubric 70-89
- LOW: missing verification step or cited rubric concern → DO NOT RETURN DONE; return BLOCKED with the specific gap

Produce a markdown table the parent can drop directly.

**Last 3 Iterations Summary:**
- run 3: Q3 Pre/During/Post checklists
- run 4: Q4 Output verification + Iron Law
- run 5: Q5 Builder/Critic/Verifier adversarial self-check

**Resolved:** Q1, Q2, Q3, Q4, Q5
**Remaining:** Q6 + Q7 (this iter), Q8 RETURN contract, Q9 skill precedence, Q10 ASCII summary

## STATE FILES

- State Log: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deep-research-state.jsonl`
- Iteration narrative: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/iterations/iteration-006.md`
- Delta: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deltas/iter-006.jsonl`

## CONSTRAINTS

- LEAF; no sub-agent dispatch.
- Target 3-5 actions. Max 12 tool calls.
- Codebase-agnostic.
- Cite by file:line.

## ACTIONS

1. Read `.opencode/agent/review.md:396-434` (anti-patterns table).
2. Read `AGENTS.md:125-153` (generic anti-patterns table — confirm what's already there so we don't duplicate; add CODER-SPECIFIC ones only).
3. Read `.opencode/agent/code.md:70-101` (current SCOPE BOUNDARIES + Bash bypass warning) — confirm what's already in code.md so the new anti-pattern table sharpens rather than repeats.
4. Read `.opencode/agent/debug.md:426-457` (debug anti-patterns — useful precedent for "claim without evidence" + "skip verification").
5. Synthesize the Q6 anti-patterns table + Q7 Confidence Levels table.

## OUTPUT CONTRACT

1. `iterations/iteration-006.md` — Focus / Actions / Findings (f-iter006-NNN) / Questions Answered (BOTH Q6 and Q7) / Questions Remaining / Next Focus.
2. APPEND to state log:
```json
{"type":"iteration","iteration":6,"newInfoRatio":<0..1>,"status":"<insight|partial|stuck>","focus":"Q6 anti-patterns + Q7 confidence levels","graphEvents":[],"executor":{"kind":"cli-codex","model":"gpt-5.5","reasoningEffort":"high","serviceTier":"fast","timeoutSeconds":900}}
```
3. `deltas/iter-006.jsonl` (one record per line).

Next focus: Q8 — RETURN contract refinement + Q9 skill loading precedence (combined iter-7).

Begin now.

# Stream-04 Deep-Research Iteration 4

LEAF agent (cli-codex, gpt-5.5 high fast). DO NOT dispatch sub-agents. Target 3-5 actions, max 12 tool calls.

## STATE

**Repo root:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
**Stream artifact dir:** `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/`

**Iteration:** 4 of 10
**Focus (Q4):** Output verification protocol + coder-side Iron Law. Mirror @review.md §10 (lines 315-393) for coders. Produce:
1. **Pre-Return Verification** — bullet list of fact-checks (mirrors @review §10 Pre-Report Verification): every edited file actually re-read; verification command run with exit captured; file:line citations in RETURN summary verified; no scope drift; no dead code/comments.
2. **Issue Evidence Requirements** — table mirroring @review §10 (severity → required evidence). Coder-side: P0 needs file:line + verification-fail snippet + escalation, P1 needs file:line + reasoning, P2 needs file:line + suggestion.
3. **Self-Validation Protocol** — 6 questions (all YES) before returning DONE. Mirror @review §10 self-validation 6Qs.
4. **Confidence Levels** — HIGH/MEDIUM/LOW table for coder evidence completeness.
5. **The Iron Law (coder version)** — adapt @review §10 Iron Law line 358 ("NEVER CLAIM COMPLETION WITHOUT VERIFICATION EVIDENCE") for coder context. Cite `.opencode/skill/sk-code/SKILL.md:62` ("NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE FROM THE ACTUAL STACK") as canonical.

**Last 3 Iterations Summary:**
- run 1: Q1 Quality Rubric (0.74, insight)
- run 2: Q2 7-mode dispatch set + invariant (0.68, insight)
- run 3: Q3 Pre/During/Post checklists

**Resolved:** Q1, Q2, Q3
**Remaining:** Q4 (this iter), Q5, Q6, Q7, Q8, Q9, Q10

## STATE FILES

- State Log: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deep-research-state.jsonl`
- Iteration narrative: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/iterations/iteration-004.md`
- Delta: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deltas/iter-004.jsonl`

## CONSTRAINTS

- LEAF; no sub-agent dispatch.
- Target 3-5 actions. Max 12 tool calls.
- All findings to files. Codebase-agnostic.
- Cite by file:line.

## ACTIONS

1. Read `.opencode/agent/review.md:315-393` (full Output Verification + Iron Law + Adversarial Self-Check). Note: §10 contains both the Iron Law (Q4) AND the Adversarial Self-Check (Q5 next iter). For THIS iteration, focus only on Pre-Report Verification through Iron Law (lines 315-362) — leave Adversarial Self-Check (lines 364+) for iter-5.
2. Read `.opencode/skill/sk-code/SKILL.md:60-65` (Iron Law line 62) and search "fresh verification evidence" / "verification command" / "verification_commands" for stack-aware patterns.
3. Read `.opencode/agent/write.md:295-330` (sk-doc Iron Law adaptation — useful precedent for write-capable LEAF).
4. Synthesize the coder-side §10 OUTPUT VERIFICATION block.

## OUTPUT CONTRACT

1. `iterations/iteration-004.md` — Focus / Actions / Findings (f-iter004-NNN) / Questions Answered / Questions Remaining / Next Focus.
2. APPEND to state log:
```json
{"type":"iteration","iteration":4,"newInfoRatio":<0..1>,"status":"<insight|partial|stuck>","focus":"Q4 — Output verification + Iron Law","graphEvents":[],"executor":{"kind":"cli-codex","model":"gpt-5.5","reasoningEffort":"high","serviceTier":"fast","timeoutSeconds":900}}
```
3. `deltas/iter-004.jsonl` (one record per line).

Next focus: Q5 — Adversarial self-check (Builder/Critic/Verifier coder analog of Hunter/Skeptic/Referee).

Begin now.

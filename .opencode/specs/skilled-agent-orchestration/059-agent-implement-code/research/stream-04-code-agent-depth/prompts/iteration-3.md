# Stream-04 Deep-Research Iteration 3

LEAF agent (cli-codex, gpt-5.5 high fast). DO NOT dispatch sub-agents. Target 3-5 actions, max 12 tool calls.

## STATE

**Repo root:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
**Stream artifact dir:** `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/`

**Iteration:** 3 of 10
**Focus (Q3):** Coder Pre/During/Post-implementation checklists. Build three codebase-agnostic checklists that mirror @review.md §6 (lines 156-231) but are CODER-SIDE. Stack-specific items delegate to `sk-code` (don't bake stack rules into the agent body).

For EACH checklist (Pre-Implementation / During-Implementation / Pre-Return), produce a markdown checkbox list (target ~5-8 items each) that the parent can drop directly into the expanded code.md.

Suggested categories:
- **Pre-Implementation**: scope clarity (orchestrator dispatch fields, file allowlist), spec-folder docs read, sk-code invoked, verification command identified, success criteria explicit, packet-local plan/tasks anchored
- **During-Implementation**: scope-lock (no adjacent file edits), no Bash bypass (no shell redirect / sed -i / eval / interpreter / network workarounds), single logical change at a time, neighbor-pattern fidelity (only adopt patterns sk-code's loaded checklist confirms applicable), no silent retry on verify-fail
- **Pre-Return**: read-back every edited file, verification command run with exit code captured, file:line citations correct in RETURN summary, no dead code/comments, scope strictly held, RETURN format conforms to §3 contract

**Last 3 Iterations Summary:**
- run 1: Q1 Quality Rubric (newInfoRatio 0.74, insight)
- run 2: Q2 Coder dispatch modes — 7-mode set kept; mode invariant: never skip sk-code/quality-gate/verify/explicit-return (newInfoRatio 0.68, insight)

**Resolved:** Q1, Q2
**Remaining:** Q3 (this iter), Q4, Q5, Q6, Q7, Q8, Q9, Q10

## STATE FILES

- State Log: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deep-research-state.jsonl`
- Iteration narrative target: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/iterations/iteration-003.md`
- Delta target: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deltas/iter-003.jsonl`

## CONSTRAINTS

- LEAF; no sub-agent dispatch.
- Target 3-5 research actions. Max 12 tool calls.
- All findings to files. Codebase-agnostic.
- Cite by file:line.

## ACTIONS

1. Read `.opencode/agent/review.md:156-231` (Universal Checks + PR-Specific + Project-Specific patterns).
2. Read `.opencode/skill/sk-code/SKILL.md:395-475` (Phase 1.5 Code Quality Gate + universal checklist patterns).
3. Read `.opencode/skill/sk-code/references/universal/code_quality_standards.md:36-130` (severity model, P0/P1/P2 examples).
4. Read `.opencode/agent/code.md:70-101` (current SCOPE BOUNDARIES + ESCALATION contract — confirm what the new checklists need to enforce).
5. Synthesize three coder-side checklists. Make sure NO stack rules are embedded — every stack-specific item should be phrased as "load applicable checklist via sk-code" or similar.

## OUTPUT CONTRACT

Three artifacts:

1. `iterations/iteration-003.md` — Focus / Actions / Findings (id-tagged f-iter003-NNN with severity) / Questions Answered / Questions Remaining / Next Focus.
2. APPEND to state log:
```json
{"type":"iteration","iteration":3,"newInfoRatio":<0..1>,"status":"<insight|partial|stuck>","focus":"Q3 — Coder checklists (Pre/During/Post)","graphEvents":[],"executor":{"kind":"cli-codex","model":"gpt-5.5","reasoningEffort":"high","serviceTier":"fast","timeoutSeconds":900}}
```
3. `deltas/iter-003.jsonl` (one record per line).

Begin now. Next focus after this iteration: Q4 — Output verification protocol + coder-side Iron Law.

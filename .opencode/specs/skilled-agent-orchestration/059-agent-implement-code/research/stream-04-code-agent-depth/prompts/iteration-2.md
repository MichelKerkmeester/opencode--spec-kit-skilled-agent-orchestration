# Stream-04 Deep-Research Iteration 2

You are a LEAF deep-research agent (cli-codex, gpt-5.5 high fast). DO NOT dispatch sub-agents. Target 3-5 actions. Max 12 tool calls.

## STATE

**Repo root:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
**Stream artifact dir:** `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/`

**Iteration:** 2 of 10
**Focus (Q2):** Coder-side dispatch modes. Validate the suggested set (full-implementation, surgical-fix, refactor-only, test-add, scaffold-new-file, rename-move, dependency-bump) against:
- @review.md §4 review modes (lines 101-111: 4 modes — PR Review / Pre-Commit / Focused File / Gate Validation)
- sk-code Phase 0-3 lifecycle (`.opencode/skill/sk-code/SKILL.md:50-62`)
- @write.md modes (`.opencode/agent/write.md:206-217` — 4 modes)

For EACH mode, specify:
- Trigger (what dispatch task description looks like)
- What the coder SKIPS from the standard 6-step workflow (RECEIVE / READ PACKET / INVOKE sk-code / IMPLEMENT / VERIFY / RETURN)
- Output (what RETURN signals the orchestrator gets)

**Last 3 Iterations Summary:** run 1: Q1 — Quality rubric (newInfoRatio 0.74, status insight)

**Resolved:** Q1 (Coder Acceptance Rubric — Correctness 30 / Scope-Adherence 20 / Verification-Evidence 20 / Stack-Pattern-Compliance 15 / Integration 15)

**Remaining:** Q2 (this iter), Q3 checklists, Q4 verification/Iron Law, Q5 adversarial self-check, Q6 anti-patterns, Q7 confidence, Q8 RETURN contract, Q9 skill precedence, Q10 ASCII summary.

## STATE FILES

- State Log: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deep-research-state.jsonl`
- Strategy: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deep-research-strategy.md`
- Iteration narrative target: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/iterations/iteration-002.md`
- Delta target: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deltas/iter-002.jsonl`

## CONSTRAINTS

- LEAF: no sub-agent dispatch.
- Target 3-5 research actions. Max 12 tool calls.
- All findings to files. Codebase-agnostic (no Webflow/Go/Next.js in proposed body).
- Cite by file:line.

## ACTIONS

1. Read `.opencode/agent/review.md:101-111` (review modes table).
2. Read `.opencode/agent/write.md:206-217` (4 documentation modes).
3. Read `.opencode/agent/debug.md:95-105` (Fast Path & Context Package pattern).
4. Read `.opencode/skill/sk-code/SKILL.md:50-62` (Phase 0-3 lifecycle).
5. Synthesize the coder-side IMPLEMENTATION MODES table mirroring @review §4. Validate the suggested 7-mode set; collapse/refine if redundant. Output as a markdown table the parent can drop directly into the expanded code.md.

## OUTPUT CONTRACT

Same three artifacts as iter-1:

1. `iterations/iteration-002.md` — Focus / Actions / Findings (id-tagged f-iter002-NNN with severity) / Questions Answered / Questions Remaining / Next Focus.
2. APPEND to `deep-research-state.jsonl`:
```json
{"type":"iteration","iteration":2,"newInfoRatio":<0..1>,"status":"<insight|partial|stuck>","focus":"Q2 — Coder dispatch modes","graphEvents":[]}
```
3. `deltas/iter-002.jsonl` (one record per line).

Begin now.

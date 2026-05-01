# Stream-04 Deep-Research Iteration 1

You are a LEAF deep-research agent (cli-codex, gpt-5.5 high fast). DO NOT dispatch sub-agents. Target 3-5 research actions. Max 12 tool calls.

## STATE

**Repo root:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
**Spec folder:** `specs/skilled-agent-orchestration/059-agent-implement-code`
**Stream artifact dir:** `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/`

**Research Topic:** Stream-04 — translate @review.md (478 lines, §0-§13) structural depth into a CODER perspective for `.opencode/agent/code.md`. Produce a drop-in expanded body proposal (target 400-500 lines).

**Iteration:** 1 of 10
**Focus Area (Q1):** Quality rubric for code work — validate or refine the starting suggested set (Correctness 30, Scope-Adherence 20, Verification-Evidence 20, Stack-Pattern Compliance 15, Integration 15) against @review.md §5 (lines 116-152). Produce dimension definitions, rubric matrix per dimension, pass/fail bands, and severity classification (P0/P1/P2 coder analog).

**Remaining Key Questions:**
- [ ] Q1 — Quality rubric (focus this iteration)
- [ ] Q2 — Coder dispatch modes
- [ ] Q3 — Pre/During/Post checklists
- [ ] Q4 — Output verification protocol (Iron Law for coder)
- [ ] Q5 — Adversarial self-check (Builder/Critic/Verifier)
- [ ] Q6 — Coder anti-patterns
- [ ] Q7 — Confidence levels (HIGH/MEDIUM/LOW)
- [ ] Q8 — Orchestrator integration (RETURN contract refinement)
- [ ] Q9 — Skill loading precedence (baseline + overlay)
- [ ] Q10 — Summary box ASCII

**Last 3 Iterations Summary:** none yet (this is iteration 1)

## STATE FILES (paths relative to repo root)

- Config: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deep-research-config.json`
- State Log: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deep-research-state.jsonl`
- Strategy: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deep-research-strategy.md`
- Registry: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/findings-registry.json`
- Write iteration narrative to: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/iterations/iteration-001.md`
- Write per-iteration delta file to: `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/deltas/iter-001.jsonl`

## CONSTRAINTS

- LEAF agent: do NOT dispatch sub-agents.
- Target 3-5 research actions, max 12 tool calls.
- Write ALL findings to files. Do not hold in context.
- The proposed code.md body MUST stay codebase-agnostic (no Webflow/Go/Next.js mentions in body — sk-code owns stack-specific rules).
- Cite @review.md by line range; cite all sources by file:line.

## KNOWN CONTEXT (do NOT re-research)

Phase 2 streams 01/02/03 already converged. Pull existing findings from:
- `specs/skilled-agent-orchestration/059-agent-implement-code/research/synthesis.md`
- `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-01-oh-my-opencode-slim/research.md`
- `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-02-opencode-swarm-main/research.md`
- `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/research.md`

D3 is locked: convention-floor + LEAF enforcement. Stack detection lives in sk-code. Bash/interpreter writes bypass hooks → explicit warning needed.

## ITERATION 1 ACTIONS

Investigate Q1 (Quality rubric for code work). Specifically:

1. Read `.opencode/agent/review.md` lines 114-152 (Quality Rubric section: scoring dimensions, quality bands, severity classification, dimension rubrics matrix). This is the structural template.
2. Read `.opencode/skill/sk-code/SKILL.md` lines 50-100 (Phase 0-3 lifecycle + Iron Law) and search for "P0", "P1", "Code Quality Gate" to extract sk-code's existing severity model.
3. Read `.opencode/skill/sk-code-review/SKILL.md` for the baseline severity contract (sk-code-review is review-side; mirror for coder side).
4. Read `AGENTS.md` Quality Principles + Analysis Lenses section to find coder-side dimensions already in scope.
5. Synthesize a CODER ACCEPTANCE RUBRIC mirroring @review §5 with:
   - 5 dimensions × 100 points (suggested starting set: Correctness 30, Scope-Adherence 20, Verification-Evidence 20, Stack-Pattern-Compliance 15, Integration 15 — validate against evidence).
   - Quality Bands (EXCELLENT 90-100 / ACCEPTABLE 70-89 / NEEDS REVISION 50-69 / REJECTED 0-49).
   - Severity classification (P0 BLOCKER / P1 REQUIRED / P2 SUGGESTION) with coder-side meaning.
   - Per-dimension rubric matrix (Full/Good/Weak/Critical).
   - Justification for any deviation from the suggested point distribution.

## OUTPUT CONTRACT (THREE artifacts required)

### 1. Iteration narrative markdown

Write to `specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-04-code-agent-depth/iterations/iteration-001.md`. Structure:

```
# Iteration 1 — Q1: Quality Rubric for Code Work

## Focus
[one paragraph]

## Actions Taken
1. [tool call + brief]
2. ...

## Findings
- F-iter001-001 (P1): [label] — citation: file:line — evidence: [snippet]
- F-iter001-002 (P1): ...

## Questions Answered
- Q1: [resolution + rubric draft]

## Questions Remaining
- Q2-Q10 still open

## Next Focus
Q2 — Coder-side dispatch modes (full-implementation, surgical-fix, refactor-only, test-add, scaffold-new-file, rename-move, dependency-bump). Validate the suggested set against @review.md §4 review modes (lines 101-111) and against sk-code's Phase 0-3 lifecycle (sk-code/SKILL.md:50-62).
```

### 2. Canonical JSONL iteration record (APPEND to state log)

Append a single JSON line to `deep-research-state.jsonl` with `"type":"iteration"` EXACTLY:

```json
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"<insight|partial|stuck>","focus":"Q1 — Quality rubric for code work","graphEvents":[]}
```

`newInfoRatio` should reflect the proportion of the rubric design that is grounded in cited evidence vs guessed. Aim for honest 0.6-0.8 on iteration 1 (lots of new ground).

### 3. Per-iteration delta file

Write `deltas/iter-001.jsonl` (one record per line):

```
{"type":"iteration","iteration":1,"newInfoRatio":<same>,"status":"<same>","focus":"Q1 — Quality rubric for code work"}
{"type":"finding","id":"f-iter001-001","severity":"P1","label":"...","iteration":1}
{"type":"finding","id":"f-iter001-002","severity":"P1","label":"...","iteration":1}
{"type":"observation","id":"obs-iter001-001","classification":"real","iteration":1}
```

All three artifacts are REQUIRED. Begin now.

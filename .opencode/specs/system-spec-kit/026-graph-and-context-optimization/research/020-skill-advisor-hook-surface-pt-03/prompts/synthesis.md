# Deep-Research Wave-3 Synthesis — 020 Validation (cli-copilot)

Dispatched via `copilot -p @PROMPT --model gpt-5.4 --allow-all-tools --no-ask-user`.

**Gate 3 pre-answered**: Option **E** (phase folder). Target artifact dir below. All writes pre-authorized. Proceed WITHOUT asking.

**Context**: Wave-3 converged at iter 13 (rolling avg 0.0367 < 0.05). All 10 validation angles (V1-V10) answered. Now synthesize the final deliverable.

## INPUT

Read ALL 13 iteration narratives:
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/iterations/iteration-001.md` through `iteration-013.md`

Also read:
- `deep-research-strategy.md`
- `findings-registry.json`

## TASK

Produce `research-validation.md` at:
`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/020-skill-advisor-hook-surface-001-initial-research-003-implementation-plan-validation-copilot/research-validation.md`

## STRUCTURE (required sections)

### 1. Executive Summary
2-3 paragraphs. What did wave-3 confirm? What P0 issues were found (if any)? Overall verdict: is the 8-child scaffold ready for implementation or does it need patching first?

### 2. Per-Child Delta Table
A markdown table with 8 rows (002-009) and columns:
- Child
- Scaffold verdict (ready / minor patches needed / major revision needed)
- P0 findings (count + one-line summary each)
- P1 findings (count + one-line summary each)
- Dependency notes

### 3. Severity-Tagged Action List
Three subsections:
- **P0 (blocks implementation)**: concrete patch items (exact file paths + what to change)
- **P1 (should patch pre-impl)**: concrete patch items
- **P2 (defer / accept)**: items noted but deferred

### 4. V1-V10 Coverage
One-line summary per validation angle: what was found, severity highest finding, reference to the iteration that covered it primarily.

### 5. Cross-Reference with Wave-1 + Wave-2
What wave-3 confirmed, refuted, added, or clarified relative to prior research.

### 6. Handoff Contract for 020 Parent
- Must-fix before implementation begins (P0)
- Recommended-fix before implementation begins (P1)
- Accepted risks (P2)

### 7. Convergence Note
- Converged at iter 13 / 20 budget
- Rolling avg 0.0367 at stop
- Questions answered 10/10
- All 10 V-angles covered
- Why early convergence was legitimate (or if it was premature)

## CONSTRAINTS

- DO NOT re-open architecture
- DO NOT modify any 020 child spec.md files
- DO NOT edit files under `/020-skill-advisor-hook-surface/002-*` through `/020-skill-advisor-hook-surface/009-*`
- All claims must cite source iteration (e.g. "per iter-004 finding 2")
- Severity tags must be justified
- Append `{"type":"iteration","iteration":14,"newInfoRatio":0.02,"status":"synthesis","focus":"Final synthesis","findingsCount":N,"keyQuestions":10,"answeredQuestions":10,"timestamp":"...","durationMs":N,"graphEvents":[]}` to state.jsonl when done

## OUTPUT

1. `research-validation.md` — full synthesis with all 7 sections
2. Appended JSONL synthesis record

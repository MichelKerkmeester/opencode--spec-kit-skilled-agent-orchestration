# Deep-Research Iteration 3/5 — Fix-Iteration Quality Meta-Research

## STATE

Iter: 3/5
Mode: research (META-RESEARCH on 009 packet 4-round fix trajectory)
SessionId: 2026-05-02T15:45:24.467Z
Spec folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research
Executor: cli-codex gpt-5.5 reasoning=xhigh service_tier=fast

## TASK

Iter 3 — Algorithm/pattern catalog.

For each of the 5 failure modes, document:
- WRONG pattern (concrete example from 009 or audit packets)
- RIGHT pattern (concrete example, ideally from a packet that did it well)
- DETECTION: how can a FIX prompt or reviewer recognize the WRONG pattern is being used?
- CHECKLIST item: a self-verifying grep/test command that would catch the WRONG pattern

Example for Mode 1 (Single-site fix when class-of-bug exists):
- WRONG: `relativize()` applied to invalid-root errors but not data.errors (FIX-009 case)
- RIGHT: audit ALL error-string production sites, apply consistent helper
- DETECTION: `grep -n "errors.push\|warnings.push\|throw new Error" <file>` then verify each call site
- CHECKLIST: `grep -c "<HELPER_NAME>" <file>` should equal count of error-emission sites

Output structure in iteration-003.md:
- One subsection per failure mode (5 total)
- Each subsection: WRONG / RIGHT / DETECTION / CHECKLIST
- ## Universal "fix completeness checklist" (consolidated from per-mode items)

## CONSTRAINTS

- Read-only on the 009 packet (it's CLEAN, do not modify)
- Read-only on sibling packets (you're auditing their state)
- Write only to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/iterations/iteration-003.md` and `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/deep-research-state.jsonl` (append)
- LEAF-only — do NOT dispatch sub-agents
- Spec folder is established. Do NOT ask Gate 3.
- DELETE not archive (per memory rule).

## OUTPUT CONTRACT

### 1. Iteration narrative markdown

Path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/iterations/iteration-003.md`

Use the structure described in the iter-specific TASK section above. Be thorough — xhigh reasoning is set so use the budget.

### 2. State-log JSONL append

Append ONE line to: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/deep-research-state.jsonl`

```json
{"type":"iteration","iteration":3,"mode":"research","focus":"<one-word>","filesReviewed":[<arr>],"newFindingsRatio":<float>,"sessionId":"2026-05-02T15:45:24.467Z","generation":1,"lineageMode":"new","timestamp":"<ISO>","durationMs":<int>,"questionsAnswered":[<arr-of-question-numbers-1-7>]}
```

`type` MUST be `"iteration"` exactly. Append via shell: `echo '<single-line-json>' >> "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/deep-research-state.jsonl"`

## STATE FILES (for your reference)

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/deep-research-config.json
- State log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/deep-research-state.jsonl
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/deep-research-strategy.md
- Prior iterations dir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/iterations
- Spec: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/spec.md

## FOCUS

Iter 3 — Algorithm/pattern catalog.

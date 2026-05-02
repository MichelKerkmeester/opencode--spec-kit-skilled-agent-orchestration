# Deep-Research Iteration 4/5 — Fix-Iteration Quality Meta-Research

## STATE

Iter: 4/5
Mode: research (META-RESEARCH on 009 packet 4-round fix trajectory)
SessionId: 2026-05-02T15:45:24.467Z
Spec folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research
Executor: cli-codex gpt-5.5 reasoning=xhigh service_tier=fast

## TASK

Iter 4 — Cost-benefit analysis.

Quantify:
- Actual cost of 009 trajectory: wall-clock per fix + verify cycle, Premium per cycle
- Hypothetical cost of one-shot "broader-scope fix": estimate prompt complexity + cli-codex tokens
- Break-even: at what cycle count does broader-scope pay off?
- Sensitivity: what factors push toward narrow-fix-multi-round vs broad-fix-one-round?
  - Code criticality (security vs maintainability)
  - Reviewer fatigue cost
  - Cycle latency (operator wait time between cycles)

Tools available:
- Read git log timestamps for actual wall-clock between fix commits
- Read /tmp/dr-009-v3/codex.log + /tmp/dr-009-v4/v4-orch.log for actual durations
- Estimate Premium cost from cli-codex/cli-copilot session token counts (approximate)

Output structure in iteration-004.md:
- ## Actual 009 cost table
- ## Estimated broader-scope cost
- ## Break-even analysis
- ## Recommendations: when to pick narrow-fix vs broad-fix per-packet

## CONSTRAINTS

- Read-only on the 009 packet (it's CLEAN, do not modify)
- Read-only on sibling packets (you're auditing their state)
- Write only to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/iterations/iteration-004.md` and `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/deep-research-state.jsonl` (append)
- LEAF-only — do NOT dispatch sub-agents
- Spec folder is established. Do NOT ask Gate 3.
- DELETE not archive (per memory rule).

## OUTPUT CONTRACT

### 1. Iteration narrative markdown

Path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/iterations/iteration-004.md`

Use the structure described in the iter-specific TASK section above. Be thorough — xhigh reasoning is set so use the budget.

### 2. State-log JSONL append

Append ONE line to: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/deep-research-state.jsonl`

```json
{"type":"iteration","iteration":4,"mode":"research","focus":"<one-word>","filesReviewed":[<arr>],"newFindingsRatio":<float>,"sessionId":"2026-05-02T15:45:24.467Z","generation":1,"lineageMode":"new","timestamp":"<ISO>","durationMs":<int>,"questionsAnswered":[<arr-of-question-numbers-1-7>]}
```

`type` MUST be `"iteration"` exactly. Append via shell: `echo '<single-line-json>' >> "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/deep-research-state.jsonl"`

## STATE FILES (for your reference)

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/deep-research-config.json
- State log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/deep-research-state.jsonl
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/deep-research-strategy.md
- Prior iterations dir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/research/iterations
- Spec: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/spec.md

## FOCUS

Iter 4 — Cost-benefit analysis.

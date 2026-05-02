# Deep-Review v1 Iter 1/5 — R1-R8 implementation

Mode: review (RUN 1 on 010 R1-R8 implementation work)
Dimension: correctness
SessionId: 2026-05-02T18:41:40Z

## Focus

Iter 1 — apply R5 fix-completeness-checklist to R1-R8 work itself. For each R: same-class producers (other places where the same pattern should apply but might not), cross-consumer audit (does the new field/section actually flow to all consumers), matrix completeness (R4's findingClass: are all 5 categories covered? R1's FIX ADDENDUM: are all 4 levels actually rendered?).

## What R1-R8 modified (verify these mutations + look for misses)

- R1: `templates/manifest/plan.md.tmpl` (FIX ADDENDUM section, 4 levels)
- R2: `templates/manifest/checklist.md.tmpl` (Fix Completeness gates, L2/L3/L3+)
- R3: `/spec_kit:plan` flow (Affected Surfaces generation)
- R4: `sk-code-review/SKILL.md` (findingClass + scopeProof fields)
- R5: NEW `sk-code-review/references/fix-completeness-checklist.md`
- R6: `sk-deep-review/references/convergence.md` (security-sensitive stricter)
- R7: `sk-deep-review` Planning Packet contract (findingClasses, affectedSurfacesSeed, fixCompletenessRequired)
- R8: `fix-completeness-checklist.md` (Instance-Only Opt-Out clause)

## R5 dogfood — apply the new checklist to R1-R8 work itself

Read `.opencode/skill/sk-code-review/references/fix-completeness-checklist.md` first. Apply
its protocol to your review of R1-R8: classify each suspected issue, run same-class producer
inventory (`rg -n`), check cross-consumer (does the new field flow to all consumers?), check
matrix completeness.

## Output contract

Write iteration narrative to: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/iterations/iteration-001.md`
Append iteration record to: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/deep-review-state.jsonl`
Write delta file to: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research/review/deltas/iter-001.jsonl`

Iteration narrative structure:
- ## Dimension: correctness
- ## Files Reviewed (path:line list)
- ## Findings by Severity (P0/P1/P2 — say "None." if empty)
- ## Verdict — PASS / CONDITIONAL / FAIL with one-line reason
- ## Confidence — 0.0-1.0

JSONL append format:
```
{"type":"iteration","iteration":1,"mode":"review","focus":"correctness","filesReviewed":[<arr>],"findingsCount":<int>,"findingsSummary":{"P0":<int>,"P1":<int>,"P2":<int>},"newFindingsRatio":<float>,"sessionId":"2026-05-02T18:41:40Z","generation":1,"timestamp":"<ISO>","durationMs":<int>}
```

LEAF agent. Hard max 13 tool calls. Read-only on R1-R8 targets.

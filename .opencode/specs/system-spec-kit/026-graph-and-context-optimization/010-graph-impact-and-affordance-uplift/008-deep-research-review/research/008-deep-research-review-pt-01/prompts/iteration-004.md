# Deep-Research Iteration 004 — 010/003 minConfidence + ambiguity + failureFallback.code drill

You are a fresh-context deep-research executor (cli-codex gpt-5.5 high fast). No memory of prior iterations. This is a defensive code review of an internal code-graph system. Read-only — no code changes.

## Iter 1+2+3 — known open items (do not duplicate, only extend)

- **F1/F6 (P1)**: detect_changes mixed-header path-bypass — already understood.
- **F2/F7 (P2)**: diff path byte-safety — already understood.
- **F3/F10 (P2)**: phase-runner runtime key validation — already understood.
- **F4 (P2)**: duplicate-output rejection lacks regression tests.
- **F5 (P2)**: 010/001 license docs stale.
- **F8/F9 (P2)**: hunk completeness + rename/copy handling.
- **F11 (P2)**: malformed metadata JSON bypasses sanitizer at relationship read path.
- **F12 (P2)** ⚠️ **NEEDS VERIFICATION THIS ITERATION** ⚠️: documented `limit + 1` overflow remediation is "documented but not implemented as specified". This is a closure-integrity finding against 010/007/T-F R-007-P2-4. Iteration 4 must independently verify whether this is real or a misreading. Cite the exact lines that DO/DO NOT request `limit + 1`, and the actual overflow detection code.
- **F13 (P2)**: riskLevel depth-one count 10 undocumented.

This iteration drills 010/003 enrichment behavior end-to-end with focus on minConfidence boundary, ambiguity surfacing, and ALL FIVE failureFallback.code values.

## Audit checklist

### Section A — Re-verify F12 ("limit+1 not implemented")

A1. Cite the line in `mcp_server/code_graph/handlers/query.ts` where `computeBlastRadius` builds its SQL/traversal call. Quote the exact `LIMIT` clause or `slice(0, limit)` invocation.
A2. Is `limit + 1` requested from the underlying SQL/traversal? Cite line.
A3. Where is `partialResult` set to `true` vs `false`? Cite both lines.
A4. Trace through with a mental test: caller requests `limit: 5`, true result count is exactly 5 — does the code path return `partialResult: false`? Show the boolean evaluation step-by-step.
A5. **Verdict**: Is F12 confirmed as a real gap, or is it a misreading? Cite the deciding line.

### Section B — minConfidence boundary

B1. Where in `query.ts` is the `args.minConfidence` parameter read?
B2. Is it clamped to `[0, 1]` per docs? Cite the clamp call (e.g. `clampNumericConfidence`).
B3. Trace `minConfidence: 0` — does this mean "no filtering" or "filter to confidence ≥ 0" (which would be all edges anyway)?
B4. Trace `minConfidence: 1` — does this filter to ONLY edges with confidence === 1?
B5. What if `minConfidence` is omitted (undefined)? Default behavior?
B6. Schema validation: the Zod schema in `tool-input-schemas.ts` has `.min(0).max(1).optional()`. Confirm. Does it accept `0` and `1` as boundary values, or are they rejected?

### Section C — failureFallback.code (5 codes) — each must be triggered from a distinct documented scenario

For each of the 5 codes (`limit_reached`, `unresolved_subject`, `ambiguous_subject`, `empty_source`, `compute_error`):

C1-C5. Cite the line in `query.ts` where `failureFallback.code = '<code>'` is set. For each code, what scenario triggers it? Trace the conditional that selects this code.
C6. Are any two codes set in mutually-reachable code paths (i.e., could the same input produce different codes on different runs)? Cite if so.
C7. **`compute_error`-specific**: is there a `console.warn` or equivalent log emission? Cite the line. Is the metric `spec_kit.graph.blast_radius_failure_total{code='compute_error'}` actually incremented? Cite the metric emission.

### Section D — ambiguityCandidates surfacing

D1. When a subject fq-name has multiple matching candidates, where does `ambiguityCandidates[]` get populated?
D2. What's in each candidate object (id, fqName, file path, etc.)?
D3. Is the response shape stable across the 4 main `code_graph_query` operations (`outline`, `calls_from`, `calls_to`, `blast_radius`), or is it only on `blast_radius`?
D4. Is there silent disambiguation (pick first match) anywhere on the path? Cite if so.

### Section E — minConfidence-related test coverage

E1. Cite the vitest test file + line that tests `minConfidence` behavior.
E2. Does it cover boundary cases (0, 1, 0.5, omitted)?
E3. Does it cover `additionalProperties` rejection of unknown params (per 010/007/T-C wiring)?

## Read first

1. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/strategy.md`
2. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-001.md`
3. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-002.md`
4. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-003.md`
5. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts` (focus lines 600-1500)
6. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
7. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/metrics.ts` (for blast_radius_failure_total)
8. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts`
9. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts`

## Output contract

Write to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-004.md`:

```markdown
---
_memory:
  continuity:
    next_safe_action: "[1 sentence on iter 005 focus]"
---
# Iteration 004 — 010/003 minConfidence + failureFallback.code drill + F12 verification

**Focus:** Re-verify F12 (limit+1 overflow), drill minConfidence boundaries, exercise all 5 failureFallback.code triggers.
**Iteration:** 4 of 10
**Convergence score:** [0.00–1.00]

## Section A verdicts (F12 re-verification)
- A1..A5: ...
- **F12 verdict:** CONFIRMED-AS-GAP / REFUTED-AS-MISREADING / NUANCED — [explain]

## Section B verdicts (minConfidence boundary)
- B1..B6: ...

## Section C verdicts (failureFallback.code 5 triggers)
- C1..C7: ...

## Section D verdicts (ambiguityCandidates)
- D1..D4: ...

## Section E verdicts (minConfidence test coverage)
- E1..E3: ...

## New findings (above and beyond the checklist)

### F<N>: [title]
[severity, remediation, RQ, evidence with file:line, suggested action]

## Negative findings
- [HANDLED items]

## RQ coverage cumulative through iter 4
- RQ1..RQ5

## Next iteration recommendation
[Iter 005 should drill 010/004 affordance denylist + conflicts_with reject + debug counters per strategy.md]
```

JSONL delta to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/deltas/iteration-004.jsonl`:

```jsonl
{"iter":4,"convergence_score":<0.0-1.0>,"findings":[...],"f12_verdict":"confirmed_gap|refuted_misreading|nuanced","checklist_handled":<int>,"checklist_gap":<int>,"rq_coverage":{...},"new_p0":<int>,"new_p1":<int>,"new_p2":<int>}
```

Last line:
`EXIT_STATUS=DONE | findings=N | convergence=X.XX | f12=<verdict> | checklist=H/G | next=iter-005`

## Hard rules

- This is defensive code-review of code we own. Goal: HANDLED-vs-GAP verdicts plus F12 closure-integrity check.
- Each verdict must cite a specific `file:line`.
- If F12 is refuted, that's NEGATIVE convergence-positive evidence — say so explicitly.
- Tool budget: target 8 tool calls, max 12.

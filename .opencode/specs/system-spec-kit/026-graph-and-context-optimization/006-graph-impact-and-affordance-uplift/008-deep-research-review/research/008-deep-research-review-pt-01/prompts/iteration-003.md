# Deep-Research Iteration 003 — 010/003 reason/step round-trip + blast_radius enrichment audit

You are a fresh-context deep-research executor (cli-codex gpt-5.5 high fast). No memory of prior iterations. This is a defensive code review of an internal code-graph system. Read-only — no code changes.

## Iterations 1+2 — known open items (do not duplicate, only extend)

- F1 (P1) confirmed by F6: detect_changes mixed-header path-containment bypass at `mcp_server/code_graph/handlers/detect-changes.ts:141-156`. Already understood.
- F2/F7 (P2): diff path byte-level safety gaps.
- F3/F10 (P2): phase-runner runtime key validation gaps.
- F8/F9 (P2): diff parser hunk completeness + rename/copy handling gaps.
- F4 (P2): duplicate-output rejection lacks regression tests.
- F5 (P2): 010/001 license docs still have stale "verbatim quote" claims.

**This iteration shifts focus to 010/003 (code-graph edge explanation + impact uplift).** Do NOT re-investigate 010/001 or 010/002.

## Your role

Audit the **write-path-to-read-path round-trip** for `reason` / `step` edge metadata, plus the `blast_radius` enrichment fields shipped in 010/003 + 010/007/T-D R-007-P2-3 + 010/007/T-F R-007-P2-4/5/6. Verify each documented behavior matches what the code actually does on `main`.

## Audit checklist (HANDLED-vs-GAP per item with file:line citation)

### Section A — `reason` / `step` write path (010/003)

A1. Where in `structural-indexer.ts` are `reason` and `step` written into `code_edges.metadata`? (Cite exact lines.)
A2. Are they always set on every edge produced, or only on certain edge types (IMPORTS, CALLS, etc.)?
A3. Are write-side values constrained to known constants (`structured-structural-extraction`, `extract`, etc.) or free-form?

### Section B — `reason` / `step` read path with sanitizer (010/007/T-D R-007-P2-3)

B1. Cite the sanitizer function `sanitizeEdgeMetadataString` (exists post-T-D as exported per 011 work).
B2. Is the sanitizer called at ALL THREE documented sites?
   - `mcp_server/code_graph/lib/code-graph-db.ts` — `rowToEdge` parse path
   - `mcp_server/code_graph/handlers/query.ts` — `edgeMetadataOutput` (line ~614 area)
   - `mcp_server/code_graph/lib/code-graph-context.ts` — `formatContextEdge` path
B3. Allowlist rules per 010/007 spec: single-line, ≤200 chars, no `\\x00-\\x1F\\x7F` controls. Confirm each rule lives in the sanitizer.
B4. What happens if `metadata` JSON itself is malformed (parse error)? Cite the catch.
B5. What happens if `metadata.reason` is a number, array, or object (not a string)? Sanitizer behavior?

### Section C — `blast_radius` enrichment fields (010/003)

For each documented field, cite the line that produces it AND the line that consumes/exports it:

C1. `depthGroups[]` — produced where in `query.ts`? Shape?
C2. `riskLevel` — `'high' | 'medium' | 'low'` derivation rule (depth-one fanout per 010/003 docs)?
C3. `minConfidence` echo — does the response echo back the request's `minConfidence` value?
C4. `ambiguityCandidates[]` — produced when? Empty when subject is unambiguous?
C5. `failureFallback` field shape — what's the documented type, what does the code emit?

### Section D — `failureFallback.code` enumeration (010/007/T-F R-007-P2-6)

The docs claim 5 codes: `limit_reached | unresolved_subject | ambiguous_subject | empty_source | compute_error`. For each:

D1. Cite the line in `query.ts` that sets `failureFallback.code = '<code>'`.
D2. Are all 5 codes set at distinct sites, or do any share a common codepath?
D3. Is `BlastRadiusFailureCode` a closed literal union TypeScript type (no string drift)?
D4. Cite the warning log + metric increment for `compute_error` per the docs.

### Section E — overflow detection (010/007/T-F R-007-P2-4)

E1. Cite `query.ts` lines where `limit + 1` is requested from SQL.
E2. Cite the overflow check (`totalAffectedBeforeSlice > limit` or equivalent).
E3. Confirm result count == limit returns `partialResult: false`.

### Section F — multi-subject seed preservation (010/007/T-F R-007-P2-5)

F1. Cite the multi-subject loop in `query.ts` (~lines 1048-1058 per docs).
F2. When one subject fails, are resolved sibling seeds preserved as `preservedSeedNodes`?
F3. Or does the code reset `nodes = []` on any sibling failure?

## Read first

1. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/strategy.md`
2. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-001.md`
3. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-002.md`
4. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts`
5. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts`
6. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts`
7. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts` (search for `reason` / `step` write sites)
8. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts`
9. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts`
10. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/edge-metadata-sanitize.test.ts`

## Output contract

Write to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-003.md`:

```markdown
---
_memory:
  continuity:
    next_safe_action: "[1 sentence on iter 004 focus]"
---
# Iteration 003 — 010/003 edge explanation + blast_radius round-trip audit

**Focus:** Audit reason/step write→read round-trip and blast_radius enrichment fields against documented behavior.
**Iteration:** 3 of 10
**Convergence score:** [0.00–1.00]

## Section A verdicts (reason/step write path)
- A1: ...
- A2: ...
- A3: ...

## Section B verdicts (reason/step read path sanitizer)
- B1..B5: ...

## Section C verdicts (blast_radius enrichment fields)
- C1..C5: ...

## Section D verdicts (failureFallback.code enumeration)
- D1..D4: ...

## Section E verdicts (overflow detection)
- E1..E3: ...

## Section F verdicts (multi-subject seed preservation)
- F1..F3: ...

## New findings (above and beyond the checklist)

### F<N>: [title]
- **Severity:** P0 / P1 / P2
- **Remediation type:** code-fix / doc-fix / test-add / scope-defer
- **Maps to:** RQ1..RQ5
- **Extends iter 1/2 F#:** [if applicable, else N/A]
- **Evidence:** [file:line citations]
- **Suggested action:** [...]

## Negative findings
- [HANDLED items confirmed]

## RQ coverage cumulative through iter 3
- RQ1..RQ5: ...

## Next iteration recommendation
[Iter 004 should drill 010/003 minConfidence boundary + each of the 5 failureFallback.code triggers]
```

JSONL delta to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/deltas/iteration-003.jsonl`:

```jsonl
{"iter":3,"convergence_score":<0.0-1.0>,"findings":[...],"checklist_handled":<int>,"checklist_gap":<int>,"rq_coverage":{...},"new_p0":<int>,"new_p1":<int>,"new_p2":<int>}
```

Last line of your message:
`EXIT_STATUS=DONE | findings=N | convergence=X.XX | checklist=H/G | next=iter-004`

## Hard rules

- This is defensive code-review of code we own. Goal: HANDLED-vs-GAP verdicts with citations so we know what to test/tighten.
- Each verdict must cite a specific `file:line`.
- Do not re-investigate 010/001 or 010/002 (already covered iters 1+2).
- Tool budget: target 8 tool calls, max 12.

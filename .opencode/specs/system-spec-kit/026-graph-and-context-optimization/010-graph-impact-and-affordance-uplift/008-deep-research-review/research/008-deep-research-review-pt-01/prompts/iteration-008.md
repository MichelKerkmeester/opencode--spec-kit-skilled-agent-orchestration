# Deep-Research Iteration 008 — 010/007 T-A..T-F closure integrity vs shipped code

You are a fresh-context deep-research executor (cli-codex gpt-5.5 high fast). No memory of prior iterations. Defensive code-review of internal closure claims. Read-only.

## Iters 1-7 — known closure-integrity gaps (do not duplicate, EXTEND)

⚠️ **4 confirmed closure-integrity gaps against 010/007 claims so far**:
- **F12 (P2)** R-007-P2-4 limit+1 overflow detection NOT implemented as documented (verified iter 4).
- **F14-iter5 (P2)** R-007-8 conflicts_with reject only in Python compiler; TS normalizer still accepts.
- **F17-iter6 (P2)** R-007-13 SQL-pipeline test count claim wrong (2 SQL + 1 formatter pass-through, not 3 SQL).
- **F19-F23 (P2 each)** R-007-17 tool-count canonicalization (51) incomplete: SKILL.md 48/47, INSTALL_GUIDE 43, mcp_server README omits 11 tools, feature_catalog 43.

Plus 1 P1 (mixed-header path bypass — F1/F6) + ~14 other P2s.

## This iteration is the systematic 010/007 closure-integrity check

The 010/007 implementation-summary claims **33 findings closed across 6 batches (T-A through T-F)**: R-007-1 through R-007-21 (P1) + R-007-P2-1 through R-007-P2-12 (P2). For each finding, verify the claimed closure landed in code (not just docs).

**Critical mode**: prior iterations found 4 closures whose claims do not match code. This iteration must systematically check ALL 33 closures with the same skepticism.

## Audit checklist — for EACH of 33 findings, mark CLOSED-IN-CODE / CLOSED-DOC-ONLY / CONTRADICTED-BY-CODE / NOT-LANDED with file:line

Read the closure list directly from:
`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/007-review-remediation/implementation-summary.md`

For each `R-007-N` (and `R-007-P2-N`) closure claim:

1. Identify the claimed code change (file path + symbol + intended behavior).
2. Open that file at the claimed location.
3. Verify the change is present AND behaves as claimed.
4. Mark verdict.

### T-A (3 findings: R-007-2, R-007-14)
- R-007-2: detect_changes wired as MCP tool. Cite the dispatcher case + ToolDefinition + Zod schema + ALLOWED_PARAMETERS entries.
- R-007-14: doc surfaces synced for chosen path. (Iter 7 already covered partial drift — skip if redundant.)

### T-B (7 findings: R-007-1, 5, 7, 15, 19, 20, 21)
- These are all DOC-FIX closures (verification evidence sync across sub-phase docs). Verdict for each: CLOSED-DOC-ONLY (intended), CONFIRMED-MATCHES-WAVE-3, or CONTRADICTED.

### T-C (2 findings: R-007-6, R-007-10)
- R-007-6 minConfidence WIRED — already verified iters 3+4. Skip.
- R-007-10 affordances DEFER — verify the doc comment exists AND the schema does NOT accept affordances.

### T-D (10 findings: R-007-3, 4, 8, 9, 11, P2-1, P2-3, P2-8, P2-10, P2-11)
- R-007-3 path canonicalization — known gap (F1/F6 P1 bypass). Skip.
- R-007-4 multi-file diff boundary — verify per-side counters at `diff-parser.ts:109-220`.
- R-007-8 conflicts_with reject — known gap (F14 TS/PY parity). Skip.
- R-007-9 denylist broadened — already verified iter 5. Skip.
- R-007-11 trust-badge merge-per-field — already verified iter 6. Skip.
- R-007-P2-1 phase-runner duplicate-output rejection — verify exists.
- R-007-P2-3 reason/step allowlist — verify all 3 sites + sanitizer fn.
- R-007-P2-8 shared adversarial fixture — verify file exists + both TS/PY consume.
- R-007-P2-10 age-label allowlist — already verified iter 6. Skip.
- R-007-P2-11 trace flag — already verified iter 6. Skip.

### T-E (1 finding: R-007-13)
- R-007-13 trust-badges DI strategy — claim "3/3 SQL tests pass" was contradicted by F17 (actually 2 SQL + 1 formatter). Re-confirm.

### T-F (11 findings: R-007-12, 16, 17, 18, P2-2, P2-4, P2-5, P2-6, P2-7, P2-9, P2-12)
- R-007-12 cache invalidation generation counter — already verified iter 6. Skip.
- R-007-16 INSTALL_GUIDE Python path — verify the line was actually fixed.
- R-007-17 tool-count canonicalization — known gap (F19-F23). Skip.
- R-007-18 broken FEATURE_CATALOG link — verify removed.
- R-007-P2-2 runPhases try/catch — already verified iter 1. Skip.
- R-007-P2-4 limit+1 overflow — known gap (F12). Skip.
- R-007-P2-5 multi-subject seed preservation — verify code at query.ts:1048-1058.
- R-007-P2-6 failureFallback.code — already verified iter 4. Skip.
- R-007-P2-7 shared edge mapper — verify the 4 switch branches collapsed to 2 case groups + helpers.
- R-007-P2-9 affordance counters — already verified iter 5. Skip.
- R-007-P2-12 phase 012→010 alias note — verify the alias note exists in 010/006 docs.

## Output contract

Write to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-008.md`:

```markdown
---
_memory:
  continuity:
    next_safe_action: "[1 sentence on iter 009 focus]"
---
# Iteration 008 — 010/007 T-A..T-F closure integrity audit

**Focus:** Verify each of 33 010/007 closures lands in code; flag doc-only or contradicted closures.
**Iteration:** 8 of 10
**Convergence score:** [0.00–1.00]

## Closure verdicts table (33 rows)

| Finding | Batch | Claim | Verdict | Evidence |
|---|---|---|---|---|
| R-007-1 | T-B | doc-sync | CLOSED-DOC-ONLY (intended) | `010/001/.../implementation-summary.md:NN` |
| R-007-2 | T-A | detect_changes MCP wiring | CLOSED-IN-CODE | `code-graph-tools.ts:NN` ... |
| ... | | | | |
| R-007-P2-12 | T-F | phase alias note | CLOSED-IN-CODE / CLOSED-DOC-ONLY / NOT-LANDED | `010/006/spec.md:NN` |

## New findings (use IDs F24+)

[For closures that surface a NEW gap not previously caught]

## Verdict aggregate

- CLOSED-IN-CODE: <int>
- CLOSED-DOC-ONLY (intended): <int>
- CONTRADICTED-BY-CODE: <int>
- NOT-LANDED: <int>
- TOTAL: 33

## Cross-references

- F12 (R-007-P2-4): re-confirmed CONTRADICTED-BY-CODE / NOT-LANDED
- F14 (R-007-8): re-confirmed PARTIALLY-LANDED (Python only)
- F17 (R-007-13): re-confirmed PRECISION-DRIFT
- F19-F23 (R-007-17): re-confirmed PARTIALLY-LANDED

## RQ coverage cumulative through iter 8
- RQ1..RQ5

## Next iteration recommendation
[Iter 009 should drill 011 playbook scenarios + 17 new vitest cases for adversarial-completeness gaps]
```

JSONL delta:
```jsonl
{"iter":8,"convergence_score":<0.0-1.0>,"closures_verified":33,"closed_in_code":<int>,"closed_doc_only":<int>,"contradicted":<int>,"not_landed":<int>,"new_findings":[...],"rq_coverage":{...},"new_p0":<int>,"new_p1":<int>,"new_p2":<int>}
```

Last line:
`EXIT_STATUS=DONE | findings=N | convergence=X.XX | closed=X/contradicted=Y/not-landed=Z | next=iter-009`

## Hard rules

- Read 010/007 implementation-summary as the closure list, but verify EACH against shipped code.
- Use IDs F24+ to avoid collision.
- This is the highest-stakes iteration — be thorough and skeptical.
- Tool budget: target 12 tool calls, max 16 (more than other iterations because 33 closures to verify).

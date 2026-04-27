# Deep-Research Iteration 009 — 011 playbook scenarios + 17 new vitest cases adversarial completeness

You are a fresh-context deep-research executor (cli-codex gpt-5.5 high fast). No memory of prior iterations. Defensive code/test review of internal regression suite. Read-only.

## Iters 1-8 — known findings (do not duplicate, EXTEND)

⚠️ **Cumulative findings tracker (iters 1-8)**:
- 1 P1: F1/F6 detect_changes mixed-header path bypass (010/007/T-D R-007-3 incomplete).
- 4 closure-integrity gaps (P2 each):
  - F12 R-007-P2-4 limit+1 NOT implemented as documented
  - F14 R-007-8 conflicts_with reject only Python, TS still accepts
  - F17 R-007-13 SQL-pipeline test count claim wrong
  - F19-F23 R-007-17 tool-count canonicalization incomplete (4 docs)
- ~19 other P2 findings spanning 010/001-006.
- Iter 8 verdict: 20/33 closures CLOSED-IN-CODE, 8/33 intended-doc-only, 5/33 CONTRADICTED.

## This iteration drills 011 (playbook coverage and run) — adversarial completeness check

The 011 deliverable was 4 playbook scenarios extended (014/026/199/203 with 11 new step-blocks) + 17 new vitest cases (3 detect-changes adversarial + 8 edge-metadata sanitize + 6 R-007-12 generation counter). Plus 1 fixture fix in `manual-playbook-fixture.ts`.

**Question for this iteration**: are the new tests SUFFICIENT to detect regressions in 010/007 hardening? Or are there input shapes that the test rig misses but real callers might produce?

## Audit checklist

### Section A — `detect-changes.test.ts` adversarial coverage (3 new cases)

A1. Cite the 3 new cases added in 011 (path traversal, absolute path outside, legitimate negative control).
A2. Do these cases cover the F1/F6 mixed-header bypass? (Likely NO — that's why F1/F6 P1 still open. Confirm by inspecting the test inputs.)
A3. Are there other adversarial path shapes the tests don't probe? List 3-5 additional cases the test rig could add.

### Section B — `edge-metadata-sanitize.test.ts` (8 new cases)

B1. List the 8 cases by name + what they verify.
B2. Do they cover non-string types (number, array, object, null, undefined)? Cite.
B3. Do they cover boundary lengths (200 boundary, 201 over)? Cite.
B4. Do they cover unicode chars above the control band? Cite.
B5. **Gap test**: does the suite assert that the sanitizer is actually CALLED at all 3 documented sites (`code-graph-db.ts:rowToEdge`, `query.ts:edgeMetadataOutput`, `code-graph-context.ts:formatContextEdge`)? If not — that's a regression-detection gap.
B6. Mutation testing: if a malicious actor changed the sanitizer to `return value` (no-op), would any of the 8 tests catch it? Trace which would fail.

### Section C — `causal-edges-unit.vitest.ts` R-007-12 cases (6 new)

C1. List the 6 R-007-12 cases.
C2. Do they verify the `enableCausalBoost === true` gating (i.e. when enableCausalBoost=false, generation NOT folded into cache key)? If not — that's the test rig blind to the actual cache-invalidation semantics.
C3. Do they verify the cache key actually changes (i.e. test through `memory_search` end-to-end), or only the counter increments?
C4. Concurrency test: if two requests race during a mutation, does the test verify deterministic behavior?

### Section D — Playbook scenarios 014/026/199/203 — block-level fidelity

For each block added in 011 (per `manual_testing_playbook/03--discovery/014`, `06--analysis/026`, `11--scoring-and-calibration/199`, `13--memory-quality-and-indexing/203`):

D1. Block A baseline (existing) — does it still match current behavior?
D2. Block B/C/D/E (newly added in 011) — do the prompts + commands + expected signals match the actual handler signatures + return shapes?
D3. Are there documented closure surfaces (per F12, F14, F17, F19-F23) that the playbook scenarios DO NOT exercise (so a playbook PASS could hide a real regression)?

### Section E — `manual-playbook-fixture.ts` fixture fix (011 contribution)

E1. Cite the differentiated `graph-rollout-diagnostics.md` corpus content.
E2. Cite the defensive `indexSeed` fallback (id=0 placeholder).
E3. **Stability test**: does anything in the fixture corpus still risk tripping the 92% near-duplicate threshold? List any seed pairs that might be close.

## Read first

1. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/strategy.md`
2. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts`
3. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/edge-metadata-sanitize.test.ts`
4. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts`
5. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts` (sanitizer + rowToEdge)
6. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts` (edgeMetadataOutput sanitizer call)
7. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts` (formatContextEdge sanitizer call)
8. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/03--discovery/014-detect-changes-preflight.md`
9. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/06--analysis/026-code-graph-edge-explanation-blast-radius-uplift.md`
10. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/11--scoring-and-calibration/199-skill-advisor-affordance-evidence.md`
11. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/203-memory-causal-trust-display.md`
12. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts`

## Output contract

Write to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-009.md`:

```markdown
---
_memory:
  continuity:
    next_safe_action: "Iter 010 cross-cutting synthesis + Adopt/Adapt/Reject/Defer matrix"
---
# Iteration 009 — 011 playbook scenarios + 17 new vitest cases adversarial completeness

**Focus:** Audit whether the 011-added regression suite is sufficient to detect 010/007 hardening drift.
**Iteration:** 9 of 10
**Convergence score:** [0.00–1.00]

## Section A verdicts (detect-changes adversarial coverage)
- A1..A3

## Section B verdicts (edge-metadata-sanitize coverage)
- B1..B6 (especially B5 mutation-testing)

## Section C verdicts (R-007-12 generation counter coverage)
- C1..C4

## Section D verdicts (playbook scenarios block-level fidelity)
- D1..D3

## Section E verdicts (fixture stability)
- E1..E3

## New findings (use IDs F24+)

## Negative findings
- [test cases that DO catch shipped regressions]

## RQ coverage cumulative through iter 9
- RQ1..RQ5

## Next iteration recommendation
Iter 010 should produce the cross-cutting Adopt/Adapt/Reject/Defer matrix synthesizing all 9 prior iterations.
```

JSONL delta:
```jsonl
{"iter":9,"convergence_score":<0.0-1.0>,"findings":[...],"checklist_handled":<int>,"checklist_gap":<int>,"rq_coverage":{...},"new_p0":<int>,"new_p1":<int>,"new_p2":<int>}
```

Last line:
`EXIT_STATUS=DONE | findings=N | convergence=X.XX | checklist=H/G | next=iter-010`

## Hard rules

- Defensive test-suite review. Goal: identify gaps where the test rig would silently pass on a real regression.
- Use IDs F24+ to avoid collision.
- Tool budget: target 8 tool calls, max 12.

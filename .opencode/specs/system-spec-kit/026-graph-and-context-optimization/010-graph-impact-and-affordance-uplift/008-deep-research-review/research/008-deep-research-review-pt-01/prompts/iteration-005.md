# Deep-Research Iteration 005 — 010/004 affordance denylist + conflicts_with reject + debug counters

You are a fresh-context deep-research executor (cli-codex gpt-5.5 high fast). No memory of prior iterations. Defensive code review of internal skill-advisor system. Read-only.

## Iters 1-4 — known open items (do not duplicate, only extend)

- F1/F6 (P1) detect_changes mixed-header path bypass — known.
- F12 (P2) ✅ **CONFIRMED gap**: 010/007/T-F R-007-P2-4 limit+1 closure does not match code.
- Other P2s in iters 1-4 cover diff parser, phase runner, edge metadata sanitizer, blast_radius details.

This iteration shifts focus to **010/004 (skill-advisor affordance evidence)** + the 010/007/T-D denylist hardening + 010/007/T-F debug counters. Do NOT re-investigate 010/001-003.

## Audit checklist

### Section A — Prompt-injection denylist comprehensiveness (010/007/T-D R-007-9)

The denylist was broadened in T-D with synonyms (`disregard`, `forget`, `skip`, `bypass`, `override`), directional variants (`previous|prior|earlier|above|all|any`), reveal-prompt probes, role-prefix variants (`user:|human:`), and bracketed/angled role markers (`[INST]`, `<system>`).

A1. Cite the regex(es) in `mcp_server/skill_advisor/lib/affordance-normalizer.ts` (lines ~59-73 per docs) and quote the exact patterns.
A2. Cite the matching Python regex(es) in `mcp_server/skill_advisor/scripts/skill_graph_compiler.py` (lines ~78-101).
A3. Are TS and PY regexes character-for-character equivalent? List any divergences.
A4. The shared adversarial fixture is at `mcp_server/skill_advisor/tests/__shared__/affordance-injection-fixtures.json`. List the unique pattern shapes covered and the unique patterns NOT covered (best-effort enumeration of common prompt-injection variants).
A5. Are there reachable inputs the denylist misses? Examples to consider:
   - Misspelled instruction words (e.g., "ignor previous", "ovreride")
   - Unicode-similar character substitutions (e.g., "ɪɢɴᴏʀᴇ previous" — small caps)
   - HTML-encoded variants (`&#105;gnore`)
   - Mixed-case + punctuation (`I*g*n*o*r*e prior`)
   - Multilingual variants
   For each, cite whether the denylist catches it OR explicitly say "not covered" with the line that processes the input unsanitized.

### Section B — `conflicts_with` reject path (010/007/T-D R-007-8)

B1. Cite the line in `skill_graph_compiler.py` where `AFFORDANCE_RELATION_FIELDS` excludes `conflicts_with` / `conflictsWith`.
B2. Cite `AFFORDANCE_REJECTED_RELATION_FIELDS` (the frozen-set listing reserved fields).
B3. Cite `validate_derived_affordances` and the structured "declares reserved field(s)" error message.
B4. Is the reject reachable from any legitimate input shape (i.e. could a normal skill author accidentally trip it), or is it exclusively a defense against affordance-driven conflict declarations?
B5. The Python test `R-007-8: affordance \`conflicts_with\` is rejected with explicit reserved-field error` lives at `mcp_server/skill_advisor/tests/python/test_skill_advisor.py` — cite the line. Is there a TS-side equivalent test, or is rejection only enforced server-side?

### Section C — Debug counters (010/007/T-F R-007-P2-9)

The 5 counters: `received`, `accepted`, `dropped_unsafe`, `dropped_empty`, `dropped_unknown_skill`.

C1. Cite the TS counter declaration in `affordance-normalizer.ts` (lines ~153-157 per docs). Quote the object literal.
C2. Cite the Python counter declaration in `skill_graph_compiler.py` (line ~407 per docs).
C3. For each counter, cite the line that increments it. Are TS and PY incrementing the SAME conceptual events (i.e. when does `dropped_unsafe` fire in each)?
C4. Are getters (`getAffordanceNormalizerCounters`, Python equivalent) exported?
C5. Are reset helpers exported?
C6. Is the counter object literal `{ received: 0, accepted: 0, ... }` initialized correctly at module load?
C7. **Concurrency caveat**: are the counters safe under concurrent normalize() calls in the TS runtime? (Node is single-threaded so should be safe — confirm or flag.)

### Section D — Affordance evidence routing through existing lanes (010/004 design)

D1. Cite the line in `mcp_server/skill_advisor/lib/scorer/lanes/derived.ts` where affordance evidence is consumed.
D2. Cite the line in `mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts` where affordance edges are weighted.
D3. Confirm NO new lane was added — the lanes registry is the same as pre-010/004.
D4. Confirm raw matched phrases do NOT leak into the public recommendation payload. Cite the formatter/output shape line.

### Section E — Vitest + Python test coverage adequacy

E1. Cite `mcp_server/skill_advisor/tests/affordance-normalizer.test.ts` test count and what dimensions are covered.
E2. Cite `mcp_server/skill_advisor/tests/lane-attribution.test.ts` coverage.
E3. Cite `mcp_server/skill_advisor/tests/routing-fixtures.affordance.test.ts` coverage.
E4. Are TS counter values asserted in any test, or only counter shape?
E5. Same question for Python counters.

## Read first

1. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/strategy.md`
2. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-001.md` (for prior context)
3. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/affordance-normalizer.ts`
4. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py`
5. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts`
6. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/graph-causal.ts`
7. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/__shared__/affordance-injection-fixtures.json`
8. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/affordance-normalizer.test.ts`
9. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/python/test_skill_advisor.py`
10. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/lane-attribution.test.ts`
11. `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/routing-fixtures.affordance.test.ts`

## Output contract

Write to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/iterations/iteration-005.md`:

```markdown
---
_memory:
  continuity:
    next_safe_action: "[1 sentence on iter 006 focus]"
---
# Iteration 005 — 010/004 affordance denylist + conflicts_with + debug counters

**Focus:** Audit denylist comprehensiveness, conflicts_with reject reachability, debug counter parity, lane routing.
**Iteration:** 5 of 10
**Convergence score:** [0.00–1.00]

## Section A verdicts (denylist comprehensiveness)
- A1..A5

## Section B verdicts (conflicts_with reject)
- B1..B5

## Section C verdicts (debug counters)
- C1..C7

## Section D verdicts (lane routing)
- D1..D4

## Section E verdicts (test coverage)
- E1..E5

## New findings
[severity, remediation, RQ, file:line evidence]

## Negative findings
- [HANDLED items]

## RQ coverage cumulative through iter 5
- RQ1..RQ5

## Next iteration recommendation
[Iter 006 should drill 010/005 trust-badge merge + age allowlist + dbGetter DI + cache invalidation per strategy.md]
```

JSONL delta to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/research/008-deep-research-review-pt-01/deltas/iteration-005.jsonl`:

```jsonl
{"iter":5,"convergence_score":<0.0-1.0>,"findings":[...],"checklist_handled":<int>,"checklist_gap":<int>,"rq_coverage":{...},"new_p0":<int>,"new_p1":<int>,"new_p2":<int>}
```

Last line:
`EXIT_STATUS=DONE | findings=N | convergence=X.XX | checklist=H/G | next=iter-006`

## Hard rules

- Defensive code-review of internal sanitization. Goal: HANDLED-vs-GAP verdicts with citations.
- Negative findings (HANDLED items) are valuable for convergence.
- Tool budget: target 8 tool calls, max 12.

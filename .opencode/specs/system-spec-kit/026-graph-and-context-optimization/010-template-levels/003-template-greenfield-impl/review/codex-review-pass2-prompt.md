# Independent Review Pass 2 — Implementation Packet 003

You are a fresh agent. No conversation context. This is the SECOND review pass of an implementation planning packet that has grown substantially since pass 1.

## What changed since pass 1

Pass 1 (`review/codex-review.md`) found 5 P0 + 3 P1 + 3 P2 findings. All were remediated. THEN:
- The packet was renumbered: was `012-template-greenfield-impl/`, now `010-template-levels/003-template-greenfield-impl/` (sibling 011 renumbered to 002, original 010 renumbered to 001)
- 4 parallel cli-codex audits (A/B/C/D) covered new surfaces and added 65 MODIFY targets to resource-map §2.5a-g
- Plan Phase 4 expanded from 3 deletion + 4-doc steps to 18+ steps; effort estimate 2-3h → 8-13h
- Tasks expanded T-101..T-420 → T-101..T-434 (added T-421 through T-434 for audit-driven cleanup)

## Path

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-template-levels/003-template-greenfield-impl/`

## Files to review (in order)

1. **`resource-map.md`** — now ~180 file references across §1-§8. Pay special attention to §2.5a-g (audit synthesis sections).
2. **`plan.md`** — 4-phase plan with extensive Phase 4 (18 steps). Verify Phase 4 reflects all audit findings without contradiction.
3. **`tasks.md`** — T-101 through T-434. Verify task IDs are unique, sequenced, and map to plan steps.
4. **`decision-record.md`** — should still inherit packet 002's ADR-001 through ADR-005 unchanged.
5. **`checklist.md`** — Gates 1-4 should reference the post-audit verification items.
6. **`review/codex-review.md`** — pass 1 findings (for context on what was already addressed).

For context, also skim:
- `review/audit-{A,B,C,D}-response.md` — the source of §2.5 additions
- `../002-template-greenfield-redesign/decision-record.md` — inherited ADRs

## Review dimensions (in priority order)

### P0 — Must-be-right (blocks "ready to implement")

1. **Internal consistency between resource-map / plan / tasks.** With 65 audit-surfaced MODIFY files added, do all three documents agree on scope? E.g., does resource-map §2.5g list 33 files, plan Phase 4 step 19 cite the same 33 files, and tasks T-431/T-432 cover the same 33 files?
2. **NO-OP correctness.** T-433 + T-434 are marked NO-OP per audit-D. Verify resource-map agrees that stress_test surfaces are clean (§2.5g should explicitly say "0 MODIFY for stress_test"). Cross-check audit-D-response.md says the same.
3. **Phase 4 effort estimate plausibility.** 8-13h for 65 files of mostly mechanical wording cleanup + 2 full-rewrite docs. Plausible? Or under/overestimated?
4. **Phase 1 "non-production-path only" claim.** Pass 1 raised this. Has it stayed true post-reorg + post-audit additions? (Audit findings are all Phase 4 work; Phase 1 should still be additive.)
5. **Workflow-invariance CI test scope.** Per pass 1's P0-4 fix + ADR-005, the test must cover 6 surface categories. Does the test now also need to cover the new audit-D surfaces (feature_catalog + manual_testing_playbook)? If so, is that documented?

### P1 — Should-be-right

6. **Cross-reference paths post-reorg.** Internal references like `../001-template-consolidation-investigation/` in 003's docs — do they all resolve to existing files?
7. **Task-ID gap.** T-420 was marked "superseded by T-430". Is the renumbering clean or confusing?
8. **Audit-D `capability-flags.ts` source-path question.** Audit-D flagged that some banned-vocabulary occurrences are in source-path names (`capability-flags.ts`). Does the plan address this — either rename the source file or add a CI exemption?
9. **§2.5 audit-trail provenance.** All 4 audit responses should be linked from §2.5. Verify links exist.

### P2 — Nice-to-have

10. **Total file-count math.** §1 says ~180 references; sum of §1-§8 by-action counts should match. Spot-check arithmetic.
11. **Stale references to "012" or "011".** Post-reorg, all references should be to "001/002/003" inside this phase parent. Any leftover "012" or "011" string?
12. **Effort estimation breakdown.** Plan §L2 EFFORT lists 29-46h focused. Does the per-phase breakdown sum to that range?

## Output format

Plain markdown to stdout. Structure:

```markdown
# Independent Review Pass 2 of Packet 003

## Verdict
ONE OF: READY TO IMPLEMENT | READY WITH MINOR FIXES | NOT READY (P0 blockers)

## P0 Findings (blockers, if any)
- file:line — finding — recommendation

## P1 Findings
- ...

## P2 Findings
- ...

## What's improved since pass 1
- 3-5 bullets

## Summary
2-3 sentences
```

## Constraints

- Be SHARP and SPECIFIC. Cite exact file paths + line numbers.
- Do NOT re-decide design. Inherited ADRs are binding.
- Do NOT propose net-new scope.
- Stay UNDER 1500 words.
- Be honest: if the packet is ready, say so.

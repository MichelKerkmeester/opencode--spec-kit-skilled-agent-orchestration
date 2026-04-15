# Deep Research Strategy — Advisor Phrase-Booster Tailoring

## Research Topic

Migrate 24 tokenizer-broken multi-word entries from `skill_advisor.py:INTENT_BOOSTERS` to `PHRASE_INTENT_BOOSTERS`, add phrase routes for under-covered Public identifiers, and preserve regression top-1 accuracy ≥0.92 with zero P0 regressions across the 44-case fixture suite.

## Key Sources

- `skill_advisor.py` (Public canonical, ~91K bytes, `INTENT_BOOSTERS` at line 496, `PHRASE_INTENT_BOOSTERS` at line 788)
- `fixtures/skill_advisor_regression_cases.jsonl` (44 cases, P0/P1 priority)
- `skill_advisor_regression.py` (harness with `--min-top1-accuracy 0.92` default)
- Public skill inventory (21 skills — includes `sk-code-web`, `sk-code-opencode`, `sk-code-full-stack` overlays)
- spec.md §4 REQ-001 through REQ-021
- spec.md §10 Open Questions Q-A through Q-D

## Open Questions (Research Targets)

1. **Q-A (Iteration 1)**: What is the complete inventory of multi-word keys in INTENT_BOOSTERS and MULTI_SKILL_BOOSTERS? For each, what is the correct disposition — `duplicate-remove`, `migrate-with-same-weight`, `migrate-with-phrase-weight-kept`, or `schema-violation`?
2. **Q-B (Iteration 2)**: Which of the 44 regression fixture cases depend on entries that will migrate? Are any at risk of regression?
3. **Q-C (Iteration 3)**: What multi-word identifiers currently have no phrase route but would benefit from one? Include coverage for `sk-code-web/opencode/full-stack` overlays specifically.
4. **Q-D (Iteration 4)**: What are the edge cases — schema violations, weight-preservation rules, multi-skill phrase conversion mechanics?
5. **Q-E (Iteration 5)**: What new P1 regression fixture cases are needed to cover phrase routing? What confidence uplift targets are realistic and measurable per the REQ-010 sample queries?

## Next Focus

Iteration 1 — Inventory + disposition classification. Use the copilot CLI with `@./skill_advisor.py` as primary context; produce a per-key table covering every multi-word entry.

## Convergence Criteria

- All 5 questions answered with concrete evidence (file:line citations)
- No new questions emerge in iteration N+1 that weren't discoverable at iteration N
- Weight-preservation logic + regression risk map fully specified
- newInfoRatio < 0.05 in iteration 5

## Known Constraints

- Public is canonical (Barter sync is out-of-scope per spec)
- Zero confidence formula changes (`confidence = min(0.50 + score * 0.15, 0.95)`)
- Tokenizer untouched
- Regression harness default thresholds (`--threshold 0.8 --uncertainty 0.35 --min-top1-accuracy 0.92`)

## Findings So Far

(Populated as iterations complete.)

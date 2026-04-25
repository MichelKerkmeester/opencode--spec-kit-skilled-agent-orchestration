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

## Iteration 1 Findings (INTENT_BOOSTERS inventory)

- **24** whitespace-containing keys in INTENT_BOOSTERS (confirmed)
- **0** multi-word keys in MULTI_SKILL_BOOSTERS
- Classifications: 6 `migrate-with-same-weight`, 17 `migrate-with-phrase-weight-kept`, 0 `duplicate-remove`, **1 schema-violation**
- **Schema violation**: `"code audit"` — INTENT_BOOSTERS targets `sk-deep-review` (weight 1.0) but PHRASE_INTENT_BOOSTERS targets `sk-code-review` (weight 2.2). This is NOT a weight mismatch — different routing decisions. Must be resolved before migration.
- See `research/iterations/iteration-001.md` for the complete inventory table with line-accurate citations.

## Revised Next Focus (Iteration 2)

Map the 44 fixture cases to the 24 migrating entries — identify which cases currently pass through the broken INTENT_BOOSTERS path vs. the PHRASE path vs. pure token matching. Specifically flag any case whose expected_top_any depends on the `code audit` routing decision, since that will change regardless of migration choice.


## Iteration 2 Findings (regression dependency map)

- **Baseline metrics**: top1_accuracy=1.0, p0_pass_rate=1.0, 44/44 cases passing (zero failures pre-migration)
- **Only 1/44 fixture** (`P1-REVIEW-003`) contains a migrating multi-word key; it already hits matching same-skill PHRASE entries — **low regression risk**
- **Coverage gap**: 0/44 fixtures contain the literal phrase "code audit", even though the runtime already routes "code audit" to `sk-code-review` via PHRASE_INTENT_BOOSTERS. The schema violation is invisible to the regression harness.
- **Migration is regression-safe** from the fixture-suite perspective; the real work is expanding fixtures for new phrase coverage.
- See `research/iterations/iteration-002.md` for the complete 44-row dependency table.

## Revised Next Focus (Iteration 3)

Identify multi-word identifiers in the Public repo that currently have no phrase route — candidates for new PHRASE_INTENT_BOOSTERS entries. Target the 21 Public skills and their domain-specific phrases. Propose ≥5 concrete additions with skill + weight + rationale. Prioritize `sk-code-web`/`sk-code-opencode`/`sk-code-full-stack` overlay skills (per spec Q-B lean), spec-kit phrases, and cross-cutting identifiers that likely appear in natural-language queries.


## Iteration 3 Findings (under-covered identifiers)

- Current PHRASE_INTENT_BOOSTERS: **167** entries
- Post-migration (6 migrate-with-same-weight adds): **173** entries
- **15 new phrase candidates proposed** covering system-spec-kit, sk-code-opencode, sk-code-full-stack, sk-code-web, mcp-code-mode, sk-code-review
- Full adoption target: **188** entries
- Each proposal includes: phrase, target skill, weight, rationale, false-positive risk note
- See `research/iterations/iteration-003.md` for per-phrase table

## Revised Next Focus (Iteration 4)

Design the migration mechanics concretely: resolve the `code audit` schema violation (choose target), specify weight-preservation rules, define multi-skill phrase conversion format (`[(skill, weight)]` list), document anti-patterns to prevent re-regression. Produce a complete, ordered migration script outline that Phase 2 implementation can follow task-by-task.


## Iteration 4 Findings (migration design)

- **Schema-violation resolution**: `code audit` → `sk-code-review` (Option A). PHRASE path fires first for "code audit", so runtime behavior is already sk-code-review; INTENT_BOOSTERS entry is pure dead code. Delete INTENT entry; keep PHRASE at weight 2.2.
- **23 non-violation migration rules** specified (6 migrate-same-weight + 17 migrate-keep-phrase-weight)
- **Tuple → list rewrap rule**: INTENT `(skill, weight)` → PHRASE `[(skill, weight)]` (single-element list)
- **Anti-regression inline comment block** drafted for placement near PHRASE_INTENT_BOOSTERS
- **11-step ordered Phase 2 edit script** specified, including the 15 new PHRASE additions from iteration 3
- **No hidden callsites**: single scoring loop consumes both dicts; no other code paths depend on INTENT_BOOSTERS content for multi-word keys
- See `research/iterations/iteration-004.md` (476 lines) for the complete implementation-ready design

## Revised Next Focus (Iteration 5)

Design regression coverage gain: 5-10 new P1 fixture cases targeting the code-audit gap + newly-routed phrases. Specify confidence uplift targets for REQ-010 representative queries. Document rollback triggers + risk mitigation beyond what's already in spec.md. Close the loop with explicit acceptance evidence for each spec.md requirement.


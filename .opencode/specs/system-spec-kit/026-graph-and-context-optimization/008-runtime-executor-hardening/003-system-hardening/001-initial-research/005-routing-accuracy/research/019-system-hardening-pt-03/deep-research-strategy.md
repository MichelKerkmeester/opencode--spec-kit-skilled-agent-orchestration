# Deep Research Strategy: Gate 3 + skill-advisor routing accuracy (SSK-RR-1)

Research Charter: accuracy measurement of two routing surfaces in CLAUDE.md:
1. Gate 3 Classifier (`.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` / `classifyPrompt()`)
2. Skill Advisor (`.opencode/skill/skill-advisor/scripts/skill_advisor.py` / top-1 confidence scoring)

## Non-Goals

- Re-architecting either router (recommendations only)
- Training new embedding models
- Building live ML inference infrastructure

## Stop Conditions

- Converges via newInfoRatio < 0.05 (rolling average last 3 iterations)
- Maximum 15 iterations reached
- Corpus + accuracy matrix + ranked proposals written to `research.md`

## Key Questions
<!-- REDUCER_ANCHOR:key-questions -->

- [ ] What is the labeled ground-truth corpus (size, composition, annotation protocol)?
- [ ] What are Gate 3 classifier verdicts on the corpus (precision, recall, F1 per class)?
- [ ] What are skill-advisor top-1 picks on the corpus (precision, recall, F1 per skill)?
- [ ] What are the known false-positive token classes (analyze, decompose, phase) and their rates?
- [ ] What is the joint Gate 3 × skill-advisor error rate?
- [ ] What rule changes (positive trigger adjustments, negative triggers, threshold tuning) maximize accuracy gain?
- [ ] What is the simulated before/after delta on the corpus for each ranked proposal?
- [ ] Are there cost/latency trade-offs in the proposed changes (e.g., larger trigger lists)?
<!-- /REDUCER_ANCHOR:key-questions -->

## Answered Questions
<!-- REDUCER_ANCHOR:answered-questions -->
- [x] What are skill-advisor top-1 picks on the corpus (precision, recall, F1 per skill)?
<!-- /REDUCER_ANCHOR:answered-questions -->

## Known Context

- CLAUDE.md documents false-positive tokens explicitly ("analyze, decompose, phase are NOT positive triggers; they false-positive on read-only review prompts")
- Gate 3 uses positive + disqualifier trigger lists in `classifyPrompt()`
- Skill advisor uses cosine similarity against skill descriptions (threshold default 0.8)
- Canonical phrase-based routing is the fallback for below-threshold queries

## Next Focus
<!-- REDUCER_ANCHOR:next-focus -->

Iteration 6: compute the joint Gate 3 x skill-advisor error rate, then separate overlapping failures from independent misses before ranking remediation proposals.
<!-- /REDUCER_ANCHOR:next-focus -->

## What Worked
<!-- REDUCER_ANCHOR:what-worked -->
- `skill_advisor.py --batch-stdin --show-rejections` handled the entire 200-prompt corpus in one process, which kept the evaluation trace consistent across all source types.
<!-- /REDUCER_ANCHOR:what-worked -->

## What Failed
<!-- REDUCER_ANCHOR:what-failed -->
- Command-surface aliases (`command-memory-save`, `command-spec-kit-resume`, `command-spec-kit-deep-research`, `command-spec-kit-deep-review`) fragment intent away from the gold packet-local skills and heavily distort the synthetic-command subset.
<!-- /REDUCER_ANCHOR:what-failed -->

## Exhausted Approaches
<!-- REDUCER_ANCHOR:exhausted-approaches -->
<!-- (empty — first iteration) -->
<!-- /REDUCER_ANCHOR:exhausted-approaches -->

## Ruled Out Directions
<!-- REDUCER_ANCHOR:ruled-out-directions -->
<!-- (empty — first iteration) -->
<!-- /REDUCER_ANCHOR:ruled-out-directions -->

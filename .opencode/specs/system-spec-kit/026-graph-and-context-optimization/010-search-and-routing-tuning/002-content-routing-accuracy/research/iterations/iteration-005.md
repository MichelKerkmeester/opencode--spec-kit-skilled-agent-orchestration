# Iteration 5: Baseline Accuracy And Hard-Rule Performance

## Focus
Measure the live router on a synthetic corpus built from all 40 shipped prototypes, sentence-shortened prototype variants, and targeted test-style samples.

## Findings
1. The measured corpus contained 132 labeled samples: 40 full prototype chunks, 40 first-sentence variants, 40 compact sentence variants, and 12 targeted test-like samples. That corpus produced `87.88%` overall labeled accuracy, `64/132` Tier2 routes, and `8/132` refusals under the current `0.70/0.70/0.50` thresholds. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:48] [INFERENCE: live execution of dist/lib/routing/content-router.js on the synthetic corpus]
2. Tier1-only accuracy on the same corpus was materially lower at `72.73%`, which shows the prototype layer is already doing real corrective work even without Tier3. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:809] [INFERENCE: live execution of dist/lib/routing/content-router.js on the synthetic corpus]
3. Hard Tier1 rules fired on only 14 of the 132 samples, but they were perfect on this corpus: 9 placeholder boilerplate drops, 2 transcript-wrapper drops, and one each for structured `decision`, structured `metadata_only`, and structured `task_update`, with no observed false positives. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:286] [INFERENCE: live execution of dist/lib/routing/content-router.js on the synthetic corpus]
4. The dominant escalation bucket was `top1_below_0_70` at 43 cases, followed by `margin_too_narrow` at 15 and `mixed_signals` at 6. That distribution means most escalation is simple low-confidence fallback, not hard contradiction handling. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:888] [INFERENCE: live execution of dist/lib/routing/content-router.js on the synthetic corpus]
5. Category performance is uneven: `decision`, `task_update`, and `metadata_only` were perfect on the corpus, while `handover_state` (`62.5%`) and `narrative_delivery` (`68.75%`) were the weakest categories. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:76] [INFERENCE: live execution of dist/lib/routing/content-router.js on the synthetic corpus]

## Ruled Out
- Making accuracy claims from prototype count balance alone.

## Dead Ends
- Assuming hard rules are the dominant driver of routing quality. On this corpus they are precise but relatively rare.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json:1`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:286`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:809`
- `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:48`

## Assessment
- New information ratio: 0.86
- Questions addressed: RQ-1, RQ-3, RQ-4
- Questions answered: RQ-1

## Reflection
- What worked and why: Measuring the live router against the shipped prototype library created an auditable synthetic corpus without inventing an external labeling scheme.
- What did not work and why: Looking only at overall accuracy hides the real hotspots, because the strong structured categories mask weaker delivery and handover performance.
- What I would do differently: Slice the next pass by concrete misclassification examples and cluster them by confusion pair.

## Recommended Next Focus
Inspect the recurring confusion pairs and the concrete text patterns that trigger them, especially delivery-versus-progress and handover-versus-drop.

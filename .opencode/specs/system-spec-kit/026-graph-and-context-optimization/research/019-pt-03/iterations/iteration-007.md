# Iteration 007

## Focus

Finalize the proposal ranking, quantify cost and latency implications, isolate the remaining open questions, and draft the executive-summary backbone for the eventual `research.md` synthesis.

## Actions

1. Re-read the iteration 4-6 baselines, the live strategy file, representative corpus rows, and the current `gate-3-classifier.ts` plus `skill_advisor.py` implementations.
2. Counted the current Gate 3 trigger vocabulary (`17` file-write + `3` memory-save + `5` resume + `5` read-only = `30` entries) to size the trigger-list growth of each Gate 3 proposal.
3. Sampled the highest-value false-negative and false-positive rows to validate that the draft proposals still line up with real prompt shapes instead of only aggregate metrics.
4. Ranked each proposal using a simple implementation-order rubric: `accuracy gain score (0-5) x simplicity (1-5) x reversibility (1-5)`.
5. Drafted the research-summary text that iteration 8 can lift into `research.md` if the loop is ready to synthesize.

## Ranked Proposal List

Scoring rubric used here:

- Accuracy gain: measured corpus delta, weighted toward exact-match / F1 improvements that remove the largest error mass.
- Simplicity: smaller, more local changes score higher than multi-part logic patches.
- Reversibility: additive tables and output normalization score higher than branch-heavy control-flow edits.

| Rank | Proposal | Measured Gain | Simplicity | Reversibility | Composite | Why it lands here |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1 | Advisor command-surface normalization with an explicit-invocation guard | Advisor exact-match `53.5% -> 60.0%`; `TT 73 -> 81`; `FF 31 -> 26` | 5 | 5 | 100 | Highest gain-per-line. The command bridges already carry `owning_skill`, so the cheapest path is a post-ranking normalization step instead of a broader scoring rewrite. |
| 2 | Gate 3 deep-loop positive markers | Gate 3 `F1 68.6 -> 83.3`; `TT 73 -> 94`; `FT 34 -> 13`; `FF 31 -> 26` | 4 | 4 | 80 | Best additive Gate 3 patch. It repairs the largest recall hole with no dry-run precision regression on the 200-prompt corpus. |
| 3 | Gate 3 broader resume/context markers | Gate 3 `F1 68.6 -> 71.1`; `TT 73 -> 76`; `FT 34 -> 31`; `FF 31 -> 30` | 4 | 4 | 32 | Small, clean cleanup pass. Useful after the deep-loop fix, but not large enough to outrank it. |
| 4 | Gate 3 mixed-prompt tail-write exception | Gate 3 `F1 68.6 -> 73.5`; converts `FF 31 -> 23` but mainly shifts failures into `TF` instead of `TT` | 3 | 3 | 18 | Still valuable, but it is a logic branch rather than a table expansion, so it should follow the safer additive patches. |
| 5 | Confidence-threshold tuning (`0.75` or `0.85`) | `0.75`: no exact-match gain; `0.85`: accuracy drops to `51.0%` | 5 | 5 | 0 | Cheap to toggle, but the corpus says it is not a useful first-order lever. |

### Rollup End-State

The combined dry-run target remains attractive as a program-level outcome, but not as the first implementation unit:

- Gate 3 bundle (deep-loop markers + resume markers + tail-write exception): Gate 3 `F1 68.6 -> 89.0`, `TT 73 -> 97`, `FF 31 -> 17`
- Gate 3 bundle + advisor command normalization: `TT 73 -> 108`, `FT 34 -> 12`, `FF 31 -> 15`

Interpretation: the rollup is the correct end-state, but the ranking formula still favors landing the two smallest high-yield patches first.

## Cost / Latency Table

| Proposal | Trigger-list size impact | Advisor scoring overhead | Runtime cost expectation | Notes |
| --- | --- | --- | --- | --- |
| Advisor command-surface normalization | None | None if implemented as post-ranking normalization against existing `owning_skill` metadata | Negligible | Preferred shape: normalize only after top candidates are scored, so the main scoring loop over skills + commands does not grow. |
| Gate 3 deep-loop positive markers | Approx. `+8` phrase entries (`30 -> 38`, about `+26.7%`) | None | Negligible | This is still just a few extra `includes()` / token checks over a short prompt string. |
| Gate 3 broader resume/context markers | Approx. `+3` phrase entries (`30 -> 33`, about `+10.0%`) | None | Negligible | Cheap additive patch, probably folded into the same table block as the current resume markers. |
| Gate 3 mixed-prompt tail-write exception | No new trigger rows | None | Negligible runtime, moderate logic complexity | Latency impact is tiny, but the branch increases reasoning complexity and false-positive risk if the tail detector is too loose. |
| Confidence-threshold tuning | None | None | Zero | Pure configuration change; the problem is effectiveness, not cost. |
| Full staged bundle | Approx. `+11` trigger rows (`30 -> 41`, about `+36.7%`) plus one normalization step and one exception branch | No meaningful increase if normalization stays post-ranking | Still negligible | Operational cost is dominated by test-surface size, not runtime latency. |

### Additional Cost Readouts

- `skill_advisor.py` currently carries `16` command bridges. The best-first advisor proposal does not need to add more commands; it only needs to collapse `4` over-firing bridges back to their owning skills when the prompt is truly invoking the command surface.
- `13` of the `14` command-surface false positives are genuine command-invocation prompts whose gold answer is the owning packet skill. Only `1` row (`rr-iter3-070`) is a quoted-command coding task, so the normalization guard needs to protect that shape.

## Remaining Open Questions

1. Should advisor command normalization fire whenever a command bridge wins, or only when the prompt is using the command as the requested workflow rather than mentioning it as a string literal or implementation target?
2. Should the mixed-prompt Gate 3 repair be a narrow write-tail exception, or a more explicit second-pass detector for file targets such as markdown filenames, `deltas/`, `research/iterations/`, and patch verbs?
3. Is it worth promoting deep-loop requests into a distinct Gate 3 category in the docs/tests, or is additive coverage inside the existing positive vocabulary sufficient as long as corpus fixtures stay explicit?

## Draft Executive Summary

This research packet measures routing accuracy across a labeled 200-prompt corpus spanning realistic, paraphrased, edge-case, and command-shaped requests for two independent surfaces: the Gate 3 spec-folder classifier and the skill advisor top-1 router. The baseline is asymmetric: Gate 3 is precise but under-recalls write-producing prompts (`88.8%` precision, `55.9%` recall, `68.6%` F1), while the advisor is moderately accurate overall (`53.5%` exact-match) but fragments heavily across command aliases and adjacent skills.

The joint error surface is large (`63.5%` of prompts miss at least one router), but it is not a coupled-model failure. Only `31` of `127` failures are true double failures; the remaining `96` fail on exactly one surface. That makes the routing problem much more tractable than the headline joint-error rate suggests. Most of the recoverable loss comes from two concrete sources: Gate 3 under-calls deep-loop and mixed-tail write prompts, and the advisor returns command-only mirrors where the packet-local owning skill should remain the top-level answer.

The highest-return changes are small and reversible. On the advisor side, normalizing the four over-firing command bridges back to their owning skills raises exact-match accuracy from `53.5%` to `60.0%` without expanding the scoring loop. On the Gate 3 side, adding explicit deep-loop markers produces the strongest additive gain, lifting Gate 3 F1 from `68.6%` to `83.3%` and cutting the largest `no_match` cluster. Threshold tuning, by contrast, is effectively a dead end on this corpus and should not be used as the first remediation lever.

The recommended implementation order is therefore staged, not bundled: land advisor command normalization first, add Gate 3 deep-loop markers second, then evaluate whether the smaller resume/context cleanup and the mixed-tail exception are still needed after the first two patches. If those staged fixes behave like the dry run, the remaining error mass concentrates in a narrow mixed-prompt slice that can be handled by a guarded follow-up patch rather than by broadening the entire routing vocabulary.

## Convergence Check

- Rolling `newInfoRatio` values after iteration 7: `0.30`, `0.22`, `0.14`
- Result: not converged under the `< 0.05` for 3 iterations rule
- `research.md` should remain unwritten in iteration 7

## Next Focus

Iteration 8 should validate the command-normalization guard against the quoted-command counterexample, decide the precise mixed-tail detector shape, and then start the full `research.md` synthesis using the executive-summary draft above.

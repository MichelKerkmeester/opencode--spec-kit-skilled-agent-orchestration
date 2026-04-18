# Iteration 006

## Focus

Compute the joint Gate 3 x skill-advisor error surface on the 200-prompt corpus, separate the single-surface misses from the true double failures, and draft dry-run rule-change proposals with before/after estimates.

## Joint Error Matrix

| Cell | Count | Share of Corpus | Meaning |
| --- | ---: | ---: | --- |
| `TT` | 73 | 36.5% | Gate 3 correct, advisor correct |
| `TF` | 62 | 31.0% | Gate 3 correct, advisor wrong |
| `FT` | 34 | 17.0% | Gate 3 wrong, advisor correct |
| `FF` | 31 | 15.5% | Gate 3 wrong, advisor wrong |

Joint error rate: 127 / 200 = 63.5%.

- Single-surface misses (`TF + FT`): 96 / 127 = 75.6% of all failures.
- Double failures (`FF`): 31 / 127 = 24.4% of all failures.
- The dominant opportunity is still independent repair, not coupled retraining: most prompts fail in exactly one router.

### Source-Type Split

| Source Type | `TT` | `TF` | `FT` | `FF` | Readout |
| --- | ---: | ---: | ---: | ---: | --- |
| `synthetic-realistic` | 52 | 30 | 18 | 3 | Strongest slice; most remaining misses are advisor-side |
| `paraphrased-realistic` | 11 | 11 | 9 | 6 | Both routers degrade under paraphrase drift |
| `synthetic-edge` | 10 | 14 | 7 | 17 | Main concentration of full double failures |
| `synthetic-command` | 0 | 7 | 0 | 5 | Zero full successes; command phrasing still fragments routing badly |

## `TF` Population: Gate 3 Right, Advisor Wrong

Count: 62 prompts.

### Dominant Gold Skills

| Gold Skill | Count |
| --- | ---: |
| `system-spec-kit` | 23 |
| `sk-code-opencode` | 12 |
| `none` | 10 |
| `sk-deep-research` | 7 |
| `sk-doc` | 5 |
| `sk-code-review` | 5 |

### Dominant Wrong Outputs

| Predicted Skill | Count |
| --- | ---: |
| `none` | 28 |
| `sk-improve-prompt` | 9 |
| `command-memory-save` | 5 |
| `mcp-chrome-devtools` | 5 |
| `command-spec-kit-resume` | 4 |

### Gate 3 Categories Inside `TF`

| Gate 3 Gold Category | Count |
| --- | ---: |
| `file_write` | 29 |
| `read_only` | 14 |
| `resume_write` | 9 |
| `memory_save` | 5 |
| `mixed_ambiguous` | 5 |

Readout:

- The advisor is dropping already-correct packet-local writes into `none`, especially `system-spec-kit` and `sk-code-opencode`.
- Command-only mirrors and adjacent skills are the second major drag: `command-memory-save`, `command-spec-kit-resume`, `sk-improve-prompt`, and `mcp-chrome-devtools` together explain 23 of the 62 `TF` misses.
- Representative `TF` ids: `rr-iter2-001`, `rr-iter2-003`, `rr-iter2-005`, `rr-iter2-009`, `rr-iter2-021`, `rr-iter3-070`, `rr-iter3-105`.

## `FT` Population: Gate 3 Wrong, Advisor Right

Count: 34 prompts.

### Dominant Gate 3 Categories

| Gate 3 Gold Category | Count |
| --- | ---: |
| `deep_loop_write` | 22 |
| `skill_routing_only` | 6 |
| `resume_write` | 2 |
| `file_write` | 2 |
| `read_only` | 1 |
| `mixed_ambiguous` | 1 |

### Dominant Gate 3 Failure Reasons

| Gate 3 Reason | Count |
| --- | ---: |
| `no_match` | 26 |
| `file_write_match` | 6 |
| `memory_save_match` | 1 |
| `read_only_override` | 1 |

Readout:

- This bucket is mostly a Gate 3 recall problem, not an advisor problem.
- `deep_loop_write` plus `resume_write` accounts for 24 / 34 `FT` rows, and 26 / 34 misses come from straight `no_match`.
- Representative `FT` ids: `rr-iter2-030`, `rr-iter2-042`, `rr-iter2-043`, `rr-iter2-047`, `rr-iter3-150`, `rr-iter3-155`.

## `FF` Population: Both Routers Wrong

Count: 31 prompts.

### Dominant Categories

| Gate 3 Gold Category | Count |
| --- | ---: |
| `mixed_ambiguous` | 19 |
| `deep_loop_write` | 9 |
| `read_only` | 1 |
| `resume_write` | 1 |
| `skill_routing_only` | 1 |

### Dominant Advisor Misroutes

| Predicted Skill | Count |
| --- | ---: |
| `sk-code-review` | 11 |
| `mcp-chrome-devtools` | 4 |
| `none` | 4 |
| `command-spec-kit-deep-research` | 3 |
| `sk-improve-prompt` | 3 |
| `sk-deep-review` | 2 |
| `command-spec-kit-deep-review` | 2 |

Readout:

- The `FF` cluster is not random. It is concentrated in two shapes:
  1. Mixed prompts with a read-only lead verb plus a later write tail.
  2. Deep-loop prompts where Gate 3 under-calls and the advisor also emits command mirrors instead of owning skills.
- Representative `FF` ids: `rr-iter2-031`, `rr-iter2-034`, `rr-iter2-039`, `rr-iter2-041`, `rr-iter3-115`, `rr-iter3-149`, `rr-iter3-154`, `rr-iter3-170`.

## Draft Rule-Change Proposals

### Gate 3 Proposals

| Proposal | Affected Prompts | Before | After | Joint Delta | Readout |
| --- | ---: | --- | --- | --- | --- |
| Add deep-loop positive markers | 26 | P/R/F1 = 88.8 / 55.9 / 68.6 | 91.5 / 76.4 / 83.3 | `TT` 73 -> 94, `FT` 34 -> 13, `FF` 31 -> 26 | Highest single Gate 3 gain; recovers most `deep_loop_write` misses without new false positives |
| Add broader resume/context markers | 4 | 88.8 / 55.9 / 68.6 | 89.3 / 59.1 / 71.1 | `TT` 73 -> 76, `FT` 34 -> 31, `FF` 31 -> 30 | Small but clean fix for packet/phase-folder resume phrasing |
| Allow read-only lead verbs when a concrete write tail follows | 8 | 88.8 / 55.9 / 68.6 | 89.8 / 62.2 / 73.5 | `TF` 62 -> 70, `FF` 31 -> 23 | Helps the `mixed_ambiguous` class; fixes Gate 3 only, so misses move from `FF` to `TF` |
| Gate 3 bundle (all three) | 38 | 88.8 / 55.9 / 68.6 | 92.4 / 85.8 / 89.0 | `TT` 73 -> 97, `FT` 34 -> 10, `FF` 31 -> 17 | Best Gate 3 dry-run; no new false positives on this corpus |

### Advisor Proposals

| Proposal | Affected Prompts | Before | After | Joint Delta | Readout |
| --- | ---: | --- | --- | --- | --- |
| Lower threshold from 0.80 to 0.75 | 2 | Accuracy 53.5%, missed 32, wrong-skill 51 | 53.5%, missed 30, wrong-skill 53 | No joint improvement | Too little recall gain; the two recovered `none` cases become wrong-skill fires |
| Raise threshold from 0.80 to 0.85 | 8 | Accuracy 53.5%, missed 32 | 51.0%, missed 40 | `TT` 73 -> 69 | Clearly harmful on the labeled corpus |
| Normalize command surfaces to owning skills | 14 | Accuracy 53.5%, wrong-skill 51 | 60.0%, wrong-skill 38 | `TT` 73 -> 81, `TF` 62 -> 54, `FF` 31 -> 26 | Strongest advisor-only proposal and the cleanest to justify from the corpus |
| 0.75 threshold plus command normalization | 16 | Accuracy 53.5%, missed 32 | 60.0%, missed 30, wrong-skill 40 | Same `TT` as command normalization alone | Threshold lowering adds no exact-match gain on top of the command fix |

## Best Bundle

Best joint dry-run bundle: Gate 3 bundle + advisor command normalization.

| Metric | Baseline | Bundle |
| --- | ---: | ---: |
| `TT` | 73 | 108 |
| `TF` | 62 | 65 |
| `FT` | 34 | 12 |
| `FF` | 31 | 15 |

Readout:

- The combined bundle cuts double failures from 31 to 15.
- Most remaining misses become advisor-only (`TF`), which is a much safer failure mode than Gate 3 silently under-calling write-producing workflows.
- Threshold tuning is low leverage compared to rule-surface cleanup.

## Questions Answered

- Q5 is now answered: the joint Gate 3 x skill-advisor matrix is computed and decomposed into `TT` / `TF` / `FT` / `FF`.
- Q6 is now draft-answered: the highest-value remediation set is concrete enough to rank.
- Q7 is now draft-answered: each proposed rule change has a dry-run before/after estimate on the labeled corpus.

## Next Focus

Iteration 007 should turn the top-ranked dry-run proposals into implementation-ready change specs:

1. Translate the Gate 3 bundle into a concrete trigger-diff against `gate-3-classifier.ts`.
2. Specify the advisor command-normalization surface and decide whether it should be output normalization or ranking-time preference.
3. Re-check the remaining `FF` set after the hypothetical bundle to see what still needs explicit treatment.

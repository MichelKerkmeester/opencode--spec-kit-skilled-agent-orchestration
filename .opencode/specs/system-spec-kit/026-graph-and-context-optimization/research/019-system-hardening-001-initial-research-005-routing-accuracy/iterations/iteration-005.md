# Iteration 005

## Focus

Run the real skill advisor across the full 200-prompt corpus, capture the top-1 routed skill with confidence and uncertainty, and identify which skills over-fire or fail to fire before the joint Gate 3 x advisor pass in iteration 6.

## Actions

1. Re-read the corpus schema, the current deep-research state, the strategy anchors, and the iteration 4 Gate 3 baseline.
2. Ran `skill_advisor.py --batch-stdin --show-rejections --threshold 0.8 --uncertainty 0.35` across all 200 prompts and wrote the combined prediction trace to `corpus/advisor-predictions-iter5.jsonl`.
3. Computed exact-match top-1 accuracy plus one-vs-rest precision / recall / F1 for every gold skill in the corpus.
4. Broke the exact-match results down by `source_type` to isolate routing stability across realistic, edge, paraphrased, and command-shaped prompts.
5. Ranked the dominant false-positive and false-negative skills so iteration 6 can join them with the Gate 3 misses.

## Overall Advisor Baseline

| Metric | Count |
| --- | ---: |
| Total prompts | 200 |
| Correct top-1 predictions | 107 |
| Overall exact-match accuracy | 53.5% |
| Gold prompts that should fire a skill | 182 |
| Predicted prompts that fired a skill | 160 |
| Correct `none` predictions | 8 |
| False fires on gold `none` prompts | 10 |
| Missed skill fires (`gold != none`, predicted `none`) | 32 |
| Wrong-skill fires (`gold != none`, predicted other skill) | 51 |

Prediction trace file: `corpus/advisor-predictions-iter5.jsonl`

## Per-Skill Accuracy

Gold-skill one-vs-rest metrics from the full corpus:

| Skill | Support | Predicted | TP | FP | FN | Precision | Recall | F1 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `system-spec-kit` | 55 | 18 | 15 | 3 | 40 | 83.3% | 27.3% | 41.1% |
| `sk-deep-research` | 34 | 23 | 20 | 3 | 14 | 87.0% | 58.8% | 70.2% |
| `sk-code-review` | 20 | 26 | 15 | 11 | 5 | 57.7% | 75.0% | 65.2% |
| `sk-deep-review` | 19 | 20 | 16 | 4 | 3 | 80.0% | 84.2% | 82.1% |
| `sk-code-opencode` | 17 | 3 | 3 | 0 | 14 | 100.0% | 17.6% | 30.0% |
| `sk-improve-prompt` | 10 | 21 | 9 | 12 | 1 | 42.9% | 90.0% | 58.1% |
| `sk-doc` | 9 | 4 | 4 | 0 | 5 | 100.0% | 44.4% | 61.5% |
| `mcp-coco-index` | 5 | 5 | 4 | 1 | 1 | 80.0% | 80.0% | 80.0% |
| `mcp-figma` | 4 | 4 | 4 | 0 | 0 | 100.0% | 100.0% | 100.0% |
| `mcp-chrome-devtools` | 3 | 12 | 3 | 9 | 0 | 25.0% | 100.0% | 40.0% |
| `mcp-clickup` | 3 | 3 | 3 | 0 | 0 | 100.0% | 100.0% | 100.0% |
| `sk-git` | 3 | 3 | 3 | 0 | 0 | 100.0% | 100.0% | 100.0% |

Command-only mirrors were never gold-labeled in the corpus, but they still fired:

- `command-memory-save`: predicted 5 times, 0 gold support, 5 false positives
- `command-spec-kit-resume`: predicted 4 times, 0 gold support, 4 false positives
- `command-spec-kit-deep-research`: predicted 3 times, 0 gold support, 3 false positives
- `command-spec-kit-deep-review`: predicted 2 times, 0 gold support, 2 false positives
- `sk-code-web`: predicted 3 times, 0 gold support, 3 false positives
- `cli-codex`: predicted 1 time, 0 gold support, 1 false positive

## Source-Type Breakdown

| Source Type | Count | Correct | Accuracy | Gold Should Fire | Fired Correctly | Missed | Wrong Skill | Correct `none` | False Fire |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `synthetic-realistic` | 103 | 70 | 68.0% | 97 | 69 | 18 | 10 | 1 | 5 |
| `paraphrased-realistic` | 37 | 20 | 54.1% | 34 | 18 | 6 | 10 | 2 | 1 |
| `synthetic-edge` | 48 | 17 | 35.4% | 39 | 12 | 8 | 19 | 5 | 4 |
| `synthetic-command` | 12 | 0 | 0.0% | 12 | 0 | 0 | 12 | 0 | 0 |

Key readout:

- The advisor is strongest on realistic phrasing and weakens sharply on edge cases.
- The entire `synthetic-command` slice misroutes because the router prefers command aliases or adjacent skills instead of the gold packet-local surfaces.

## FP Skills

Skills that consistently over-fired on the corpus:

| Skill | False Positives | Predicted Count | Precision | Dominant Wrong Targets |
| --- | ---: | ---: | ---: | --- |
| `sk-improve-prompt` | 12 | 21 | 42.9% | `sk-code-review` (3), `sk-deep-research` (3), `system-spec-kit` (2), `none` (2) |
| `sk-code-review` | 11 | 26 | 57.7% | `system-spec-kit` (9) |
| `mcp-chrome-devtools` | 9 | 12 | 25.0% | `none` (5), `system-spec-kit` (4) |
| `command-memory-save` | 5 | 5 | 0.0% | `system-spec-kit` (5) |
| `command-spec-kit-resume` | 4 | 4 | 0.0% | `system-spec-kit` (3), `sk-code-opencode` (1) |
| `command-spec-kit-deep-research` | 3 | 3 | 0.0% | `sk-deep-research` (3) |
| `command-spec-kit-deep-review` | 2 | 2 | 0.0% | `sk-deep-review` (2) |

Representative over-fire samples:

- `sk-improve-prompt`: `rr-iter2-020`, `rr-iter3-065`, `rr-iter3-071`, `rr-iter3-081`
- `sk-code-review`: `rr-iter2-036`, `rr-iter2-038`, `rr-iter3-127`, `rr-iter3-128`
- `mcp-chrome-devtools`: `rr-iter2-034`, `rr-iter3-087`, `rr-iter3-092`, `rr-iter3-097`

## FN Skills

Gold skills that should have fired but did not:

| Skill | Misses | Support | Recall | Missed to `none` | Misrouted to Other |
| --- | ---: | ---: | ---: | ---: | ---: |
| `system-spec-kit` | 40 | 55 | 27.3% | 15 | 25 |
| `sk-code-opencode` | 14 | 17 | 17.6% | 7 | 7 |
| `sk-deep-research` | 14 | 34 | 58.8% | 5 | 9 |
| `sk-doc` | 5 | 9 | 44.4% | 3 | 2 |
| `sk-code-review` | 5 | 20 | 75.0% | 2 | 3 |
| `sk-deep-review` | 3 | 19 | 84.2% | 0 | 3 |

Dominant miss patterns:

- `system-spec-kit` bleeds into `sk-code-review` (9), `command-memory-save` (5), `mcp-chrome-devtools` (4), and `command-spec-kit-resume` (3).
- `sk-code-opencode` often falls to `none` (7) before drifting into `sk-code-web`, `mcp-coco-index`, or `sk-improve-prompt`.
- `sk-deep-research` splits across `none` (5), `command-spec-kit-deep-research` (3), and `sk-improve-prompt` (3).

Representative missed-fire samples:

- `system-spec-kit`: `rr-iter2-003`, `rr-iter2-005`, `rr-iter2-021`, `rr-iter2-023`
- `sk-code-opencode`: `rr-iter2-001`, `rr-iter2-004`, `rr-iter2-006`, `rr-iter2-009`
- `sk-deep-research`: `rr-iter2-025`, `rr-iter2-028`, `rr-iter2-041`, `rr-iter3-099`

## Questions Answered

- Q3 is now fully answered: the full-corpus skill-advisor top-1 baseline is measured with exact-match accuracy plus precision / recall / F1 for every gold skill.
- Source-type stability is now measured, showing that realistic prompts are materially easier than edge or command-shaped prompts.
- The dominant advisor error modes are now concrete enough to separate over-fire skills from under-fire skills in the next pass.

## Next Focus

Iteration 6: compute the joint Gate 3 x skill-advisor error rate, then isolate overlap versus independence between the Gate 3 misses and the advisor routing failures.

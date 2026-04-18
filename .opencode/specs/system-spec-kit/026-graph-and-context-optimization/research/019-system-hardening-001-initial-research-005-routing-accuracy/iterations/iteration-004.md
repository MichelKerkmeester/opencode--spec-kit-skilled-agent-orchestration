# Iteration 004

## Focus

Run the real Gate 3 classifier across the full 200-prompt corpus, compute full-corpus metrics, and isolate the dominant false-positive and false-negative patterns before skill-advisor evaluation begins.

## Actions

1. Re-read the current corpus, strategy, prior iteration output, and the live `classifyPrompt()` implementation to preserve the canonical packet-local schema.
2. Ran the Gate 3 classifier logic over all 200 labeled prompts and wrote the full prediction trace to `corpus/gate3-predictions-iter4.jsonl`.
3. Computed the full-corpus binary confusion matrix and category-sliced Gate 3 precision / recall / F1 using the gold `gate3_reason_category` labels.
4. Measured the known false-positive tokens `analyze`, `decompose`, and `phase` across the corpus.
5. Grouped remaining write-intent misses into concrete false-negative classes for follow-on remediation and skill-advisor evaluation.

## Full Gate 3 Confusion Matrix

| Metric | Count |
| --- | ---: |
| TP | 71 |
| FP | 9 |
| FN | 56 |
| TN | 64 |

Derived full-corpus baseline:

- Precision: 88.8%
- Recall: 55.9%
- F1: 68.6%
- Prediction trace file: `corpus/gate3-predictions-iter4.jsonl`

## Per-Category P/R/F1

Gate 3 binary performance stratified by the gold `gate3_reason_category` label:

| Category | Support | Gold Yes | Gold No | TP | FP | FN | TN | Precision | Recall | F1 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `file_write` | 38 | 38 | 0 | 36 | 0 | 2 | 0 | 100.0% | 94.7% | 97.3% |
| `read_only` | 32 | 0 | 32 | 0 | 2 | 0 | 30 | 0.0% | n/a | n/a |
| `memory_save` | 13 | 13 | 0 | 13 | 0 | 0 | 0 | 100.0% | 100.0% | 100.0% |
| `resume_write` | 19 | 19 | 0 | 16 | 0 | 3 | 0 | 100.0% | 84.2% | 91.4% |
| `mixed_ambiguous` | 32 | 21 | 11 | 1 | 0 | 20 | 11 | 100.0% | 4.8% | 9.1% |
| `deep_loop_write` | 36 | 36 | 0 | 5 | 0 | 31 | 0 | 100.0% | 13.9% | 24.4% |
| `skill_routing_only` | 30 | 0 | 30 | 0 | 7 | 0 | 23 | 0.0% | n/a | n/a |

## Error-Class Table

| Error Class | Severity | Count | Sample IDs | Detail |
| --- | --- | ---: | --- | --- |
| `false_negative_missing_positive_trigger` | P1 | 37 | rr-iter2-030, rr-iter2-041, rr-iter2-042, rr-iter2-043, rr-iter2-046, rr-iter2-047 | Write-intent prompt slips through because no canonical file_write, memory_save, or resume trigger matched. |
| `false_negative_read_only_override` | P1 | 19 | rr-iter2-031, rr-iter2-034, rr-iter2-036, rr-iter2-038, rr-iter2-039, rr-iter3-127 | A read-only disqualifier suppresses a prompt that still carries real write intent. |
| `false_positive_generic_write_token` | P2 | 9 | rr-iter2-016, rr-iter2-054, rr-iter3-085, rr-iter3-179, rr-iter3-185, rr-iter3-186 | Generic write verbs still fire Gate 3 on prompts whose gold label is read-only. |

## False-Positive Analysis

Known historical tokens from the documentation were evaluated directly across the corpus:

| Token | Prompt Count | Gold-No Count | False Positives | FP Rate (All) | FP Rate (Gold-No) | Sample IDs |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| `analyze` | 10 | 7 | 0 | 0.0% | 0.0% | none |
| `decompose` | 2 | 1 | 0 | 0.0% | 0.0% | none |
| `phase` | 16 | 5 | 0 | 0.0% | 0.0% | none |

## False-Negative Analysis

Total write-intent misses: 56

- Missing positive trigger (`no_match`): 37
- Read-only override on a real write request (`read_only_override`): 19

False negatives by gold category:

- `file_write`: 2 (rr-iter2-059, rr-iter3-183)
- `resume_write`: 3 (rr-iter2-030, rr-iter3-115, rr-iter3-121)
- `mixed_ambiguous`: 20 (rr-iter2-031, rr-iter2-034, rr-iter2-036, rr-iter2-038, rr-iter2-039)
- `deep_loop_write`: 31 (rr-iter2-041, rr-iter2-042, rr-iter2-043, rr-iter2-046, rr-iter2-047)

Representative slipped write-intent prompts:

- rr-iter2-030: Resume the phase folder and rebuild context from implementation-summary continuity.
- rr-iter2-031: Analyze why Gate 3 misses resume prompts, then patch the classifier if the fix is obvious.
- rr-iter2-034: Inspect the current prompts and generate a replacement corpus file if coverage is thin.
- rr-iter2-036: Review the skill graph, and if a missing edge is obvious, add it.
- rr-iter2-038: Audit the iteration artifacts and rename the mislabeled delta file.
- rr-iter2-039: Explain the current routing taxonomy, then write the agreed labels into `iteration-002.md`.
- rr-iter2-041: Run `/spec_kit:deep-research :auto` on the routing-accuracy phase for 15 iterations.
- rr-iter2-042: Continue the active deep-research lineage with another routing-accuracy iteration.

## Questions Answered

- Q2 is now fully answered: the full 200-prompt Gate 3 baseline is measured with a complete confusion matrix and category-sliced metrics.
- Q4 is partially answered: the specific false-positive rate for `analyze`, `decompose`, and `phase` is now measured on the corpus, but remediation testing still remains.

## Next Focus

Iteration 005: run the full-corpus skill-advisor evaluation, compute top-1 routing metrics, and then compare the combined Gate 3 x skill-advisor failure surface.

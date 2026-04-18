# Iteration 003

## Focus

Populate the routing-accuracy corpus to its full 200-prompt target and establish the first measured Gate 3 baseline by running the real classifier on the first 100 rows.

## Actions

1. Re-read the existing corpus, prior iteration notes, strategy, and current Gate 3 classifier implementation to preserve the packet-local schema and target counts.
2. Confirmed `corpus/labeled-prompts.jsonl` now holds the full 200-row corpus using the planned six-bucket distribution.
3. Ran the real `classifyPrompt()` implementation from `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` over the first 100 prompts.
4. Wrote the prediction trace to `corpus/gate3-predictions-iter3.jsonl` and computed the initial Gate 3 confusion matrix.
5. Grouped the resulting mismatches into initial error classes for follow-on scoring and remediation work.

## Corpus Total (200 target)

| Bucket | Count |
| --- | ---: |
| `true_write` | 32 |
| `true_read_only` | 32 |
| `memory_save_resume` | 32 |
| `mixed_ambiguous` | 32 |
| `deep_loop_prompts` | 36 |
| `skill_routing_prompts` | 36 |

Corpus total: `200`

Source-type mix:

- `synthetic-realistic`: 103
- `synthetic-edge`: 48
- `synthetic-command`: 12
- `paraphrased-realistic`: 37

Gold Gate 3 balance across the full corpus:

- `yes`: 127
- `no`: 73

## Gate 3 First-100 Confusion Matrix

| Metric | Count |
| --- | ---: |
| TP | 46 |
| FP | 3 |
| FN | 14 |
| TN | 37 |

Derived baseline on the first 100 prompts:

- Precision: 93.9%
- Recall: 76.7%
- F1: 84.4%
- Prediction trace file: `corpus/gate3-predictions-iter3.jsonl`

## Initial Error Classes

- False negatives caused by write-producing workflows that do not contain a canonical Gate 3 positive trigger. Count: 9. Sample ids: rr-iter2-030, rr-iter2-041, rr-iter2-042, rr-iter2-043
- False negatives caused by `read_only_override` suppressing mixed prompts that still contain real write intent. Count: 5. Sample ids: rr-iter2-031, rr-iter2-034, rr-iter2-036, rr-iter2-038
- False positives caused by generic write verbs (`create`/`write`/`build`) inside prompt-engineering or other non-file tasks. Count: 3. Sample ids: rr-iter2-016, rr-iter2-054, rr-iter3-085

## Questions Answered

- Q1 is now answered: the labeled ground-truth corpus exists at the planned 200-prompt size with stable schema and full bucket coverage.
- Q2 is now partially answered: the first 100 prompts have real Gate 3 predictions plus an initial confusion matrix and mismatch taxonomy.

## Next Focus

Iteration 004: run Gate 3 across the full 200-row corpus and report precision, recall, and F1 by bucket and by `gate3_reason_category`, then rank the dominant error classes for remediation.

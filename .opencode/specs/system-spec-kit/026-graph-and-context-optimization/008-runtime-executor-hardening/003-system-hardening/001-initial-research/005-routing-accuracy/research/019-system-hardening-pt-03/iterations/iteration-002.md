# Iteration 002

## Focus

Build the labeled corpus design and seed the first usable slice of prompts without running the classifiers yet:

1. Define the bucket plan for the full ~200-prompt evaluation corpus.
2. Lock the annotation schema for Gate 3 and skill-advisor gold labels.
3. Populate an initial 60-prompt seed set in `corpus/labeled-prompts.jsonl`.

## Actions

1. Re-read the packet-local config, strategy, state log, and iteration 001 artifacts to preserve the canonical deep-research layout.
2. Reviewed the current deep-research + spec-kit guidance for append-only state handling, iteration file placement, and delta expectations.
3. Designed a six-bucket corpus plan that separates clear positives, clear negatives, continuity writes, ambiguous prompts, deep-loop prompts, and skill-routing prompts.
4. Defined a flat JSONL schema that keeps each prompt independently scorable for both routing surfaces.
5. Seeded `corpus/labeled-prompts.jsonl` with 60 labeled prompts: 10 prompts per bucket.

## Corpus Design

### A. Bucket plan for the full 200-prompt corpus

| Bucket | Purpose | Full target | Iter 2 seeded |
| --- | --- | ---: | ---: |
| `true_write` | Clear file-modification prompts that should trigger Gate 3 | 32 | 10 |
| `true_read_only` | Clear inspection/review/explanation prompts that should not trigger Gate 3 | 32 | 10 |
| `memory_save_resume` | Continuity prompts that should trigger Gate 3 because they write packet state | 32 | 10 |
| `mixed_ambiguous` | Prompts mixing read-only words with write intent, or vice versa | 32 | 10 |
| `deep_loop_prompts` | Deep-research / deep-review prompts that should be treated as write-producing workflows | 36 | 10 |
| `skill_routing_prompts` | Skill-selection stress cases, including connector/tool prompts | 36 | 10 |

Planned corpus total: `200`

Current seed total after iteration 2: `60`

### B. Annotation protocol

Each JSONL row is independently labeled by a human reviewer using the following rules:

1. Read the prompt as the assistant would receive it, without adding hidden context.
2. Decide whether Gate 3 should fire based on the *desired workflow behavior*, not the current classifier implementation.
3. Assign one Gate 3 reason category:
   - `file_write`
   - `read_only`
   - `memory_save`
   - `resume_write`
   - `mixed_ambiguous`
   - `deep_loop_write`
   - `skill_routing_only`
4. Decide whether the skill advisor should produce a confident top-1 skill.
5. If yes, record the exact skill name in `skill_top_1` and set `skill_correct` to `yes`.
6. If no confident skill should fire, record `skill_top_1: "none"` and set `skill_correct` to `no`.
7. Capture a short `notes` string describing why the label was chosen, especially for edge cases.

### C. Gold-label schema

Each row in `corpus/labeled-prompts.jsonl` uses this flat schema:

- `id`: stable corpus row id for later scoring and diffing
- `bucket`: one of the six corpus buckets
- `source_type`: `synthetic-realistic`, `synthetic-edge`, `synthetic-command`, or `paraphrased-realistic`
- `prompt`: the user-style prompt text
- `gate3_triggers`: gold Gate 3 verdict, `yes` or `no`
- `gate3_reason_category`: gold reason category for error analysis
- `skill_top_1`: gold top-1 skill name, or `none`
- `skill_correct`: whether a confident skill match should be considered correct, `yes` or `no`
- `notes`: concise annotation rationale

### D. Labeling rules and intended use

- `gate3_triggers` is normative. It answers "should the assistant ask/use spec-folder workflow coverage here?" even if the current classifier would miss it.
- `gate3_reason_category` is analytic. It lets later passes separate file-write misses from continuity misses and deep-loop misses.
- `skill_top_1` is the expected best skill if a skill *should* fire.
- `skill_correct` is an abstention guard:
  - `yes` means a confident routed skill is expected.
  - `no` means the correct behavior is to stay below threshold / general handling.
- `source_type` lets later passes compare accuracy on synthetic edge cases vs real-looking prompts.

### E. Source mix plan

Target mix for the full corpus:

- ~65% `synthetic-realistic`
- ~20% `synthetic-edge`
- ~15% `paraphrased-realistic`

Iteration 2 deliberately over-indexes on synthetic prompts because the immediate goal is to cover known routing edge cases first, especially around `analyze`, `decompose`, `phase`, resume phrases, and deep-loop command prompts.

## Sample Labeled Prompts Summary

Seeded prompt counts in `corpus/labeled-prompts.jsonl`:

| Bucket | Count |
| --- | ---: |
| `true_write` | 10 |
| `true_read_only` | 10 |
| `memory_save_resume` | 10 |
| `mixed_ambiguous` | 10 |
| `deep_loop_prompts` | 10 |
| `skill_routing_prompts` | 10 |

Seeded Gate 3 balance:

- `yes`: 38
- `no`: 22

Seeded skill-advisor balance:

- `skill_correct = yes`: 54
- `skill_correct = no`: 6

Gold skill distribution seeded this iteration:

- `system-spec-kit`: 16
- `sk-code-opencode`: 6
- `sk-code-review`: 6
- `sk-deep-research`: 9
- `sk-deep-review`: 6
- `sk-doc`: 3
- `mcp-coco-index`: 3
- `mcp-figma`: 1
- `mcp-chrome-devtools`: 1
- `sk-git`: 1
- `mcp-clickup`: 1
- `sk-improve-prompt`: 1
- `none`: 6

## Questions Answered

- No key question is fully closed yet, so `answeredQuestions` remains `0`.
- Q1 is now materially advanced:
  - the bucket plan exists,
  - the annotation rules are explicit,
  - and the first 60 gold-labeled prompts are available for scoring work in iteration 3.

## Next Focus

Iteration 003:

1. Expand the corpus from 60 to ~200 prompts using the same schema.
2. Increase the `paraphrased-realistic` share so the corpus is less synthetic-heavy.
3. Run Gate 3 on the first 50 rows as a sanity check against the new gold labels before full-matrix scoring.

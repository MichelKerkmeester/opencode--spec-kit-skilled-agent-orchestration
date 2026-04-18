# Routing Accuracy Research Synthesis

## Executive Summary

This packet measured routing accuracy across two independent surfaces in the OpenCode assistant framework: the Gate 3 spec-folder classifier and the skill-advisor top-1 router. The evidence comes from a labeled 200-prompt corpus spanning realistic requests, paraphrases, command-shaped prompts, and edge cases that intentionally stress the known routing seams around write detection, deep-loop commands, command aliases, and packet-local skill ownership.

The baseline is asymmetric. Gate 3 is already precise, but it under-recalls large parts of the write-producing surface: `88.8%` precision, `55.9%` recall, and `68.6%` F1. The skill advisor is broader but much noisier: `53.5%` exact-match accuracy, with `32` missed skill fires and `51` wrong-skill fires across the corpus. The deepest Gate 3 weakness is `deep_loop_write` recall (`24.4%` F1) plus near-total failure on `mixed_ambiguous` prompts (`9.1%` F1). The deepest advisor weakness is fragmentation away from packet-local owning skills into command-only mirrors, adjacent review skills, or `none`.

The joint failure picture is serious but much more repairable than the headline error rate suggests. `127` of `200` prompts miss at least one router, but only `31` of those are true double failures. The other `96` are single-surface misses, which means local rule cleanup can recover most of the lost accuracy without redesigning the system. The two dominant repair themes are clear:

1. normalize advisor command-surface outputs back to owning skills when the prompt is explicitly invoking the command surface
2. expand Gate 3 deep-loop positive markers so deep-research and deep-review requests stop falling into `no_match`

The recommended implementation order is staged rather than bundled. First land advisor command-surface normalization with an explicit-invocation guard. Second, add Gate 3 deep-loop markers. Third, decide whether the smaller resume/context expansion and the mixed-tail write exception still earn their complexity after those first two fixes land. The suggested handoff target is `019-system-hardening/004-routing-accuracy-hardening`.

## Surface Enumeration

### Gate 3 classifier

Primary source: `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts`

Observed behavior in the current implementation:

- Trigger families are split into `file_write`, `memory_save`, `resume`, and `read_only`.
- The classifier returns a compact schema: `triggersGate3`, `reason`, `matched`, and `readOnlyMatched`.
- Unicode folding, lowercasing, and whitespace collapse are already in place, and tokenization preserves slash commands plus namespace separators like `:`.
- `memory_save` and `resume` phrases always trigger Gate 3 even when read-only language is also present.
- `file_write` prompts can still be suppressed by any read-only disqualifier because the classifier has no second-pass file-target or write-tail heuristic.

Canonical trigger families at the time of measurement:

- `file_write`: `create`, `add`, `remove`, `delete`, `rename`, `move`, `update`, `change`, `modify`, `edit`, `fix`, `refactor`, `implement`, `build`, `write`, `generate`, `configure`
- `memory_save`: `save context`, `save memory`, `/memory:save`
- `resume`: `/spec_kit:resume`, `resume iteration`, `resume deep research`, `resume deep review`, `continue iteration`
- `read_only`: `review`, `audit`, `inspect`, `analyze`, `explain`

Important boundary from this packet: the documented historical false-positive tokens `analyze`, `decompose`, and `phase` did not generate any false positives on the measured corpus. The current Gate 3 miss pattern is therefore driven far more by missing positive coverage than by the old generic-token overfire story.

### Skill advisor

Primary source: `.opencode/skill/skill-advisor/scripts/skill_advisor.py`

Observed behavior in the current implementation:

- The advisor is a hybrid scorer, not a pure embedding router.
- Ranking combines tokens, phrase boosters, explicit skill mentions, graph signals, graph relationships, family affinity, optional semantic boosts, and command-aware penalties.
- The current default thresholds are `0.8` confidence and `0.35` uncertainty.
- The router also includes a command-intent path and command-bridge outputs such as `command-memory-save` and `command-spec-kit-*`.

Routing inputs confirmed in the packet:

- skill metadata from the skill graph and per-skill graph metadata
- keyword-bearing surfaces in `SKILL.md`
- optional semantic/search boosts
- explicit-skill-name mentions

The important behavioral finding is that the command bridges are not neutral aliases. In the measured corpus they fragment intent away from the packet-local owning skills and become a major source of exact-match loss.

### Skill trigger-bearing surfaces

The packet also verified where skill trigger language actually lives:

- keyword comments near the top of `SKILL.md`
- `Activation Triggers`
- `Keyword Triggers`
- derived `graph-metadata.json` phrases used by the graph-backed routing path

That matters because accuracy improvements should be tested against the graph-backed advisor behavior, not against an imagined frontmatter-only trigger source.

## Corpus Methodology

The corpus was built as a flat JSONL set so every prompt could be scored independently by both routing surfaces. Each row records:

- prompt text
- source type
- normative Gate 3 verdict
- Gate 3 reason category
- gold top-1 skill
- whether a skill should fire confidently
- short annotation notes

The final corpus contains `200` prompts across six planned buckets:

| Bucket | Count | Purpose |
| --- | ---: | --- |
| `true_write` | 32 | clear file-edit or code-change prompts |
| `true_read_only` | 32 | review, inspection, audit, or explanation prompts |
| `memory_save_resume` | 32 | packet-continuity prompts that should trigger Gate 3 |
| `mixed_ambiguous` | 32 | prompts mixing read-only lead language with concrete write intent |
| `deep_loop_prompts` | 36 | deep-research and deep-review prompts that produce stateful artifacts |
| `skill_routing_prompts` | 36 | tool and skill-selection stress cases |

Source-type distribution:

| Source type | Count |
| --- | ---: |
| `synthetic-realistic` | 103 |
| `synthetic-edge` | 48 |
| `paraphrased-realistic` | 37 |
| `synthetic-command` | 12 |

Gate 3 gold-category distribution:

| Gold category | Count |
| --- | ---: |
| `file_write` | 38 |
| `deep_loop_write` | 36 |
| `read_only` | 32 |
| `mixed_ambiguous` | 32 |
| `skill_routing_only` | 30 |
| `resume_write` | 19 |
| `memory_save` | 13 |

Annotation rules used throughout the packet:

1. Gate 3 labels are normative. They represent the desired workflow behavior, not the current classifier output.
2. Skill labels are top-1 gold expectations. `none` is used only when the correct behavior is to stay under the threshold rather than force a skill.
3. `source_type` is analytic. It measures how well the routers survive phrasing drift, not just average-case prompts.

This methodology is sufficient for dry-run proposal evaluation because both routers can be replayed against the same fixed gold set and compared with before/after confusion counts.

## Gate 3 Accuracy Results

Iteration 4 established the full-corpus Gate 3 baseline.

### Full-corpus confusion matrix

| Metric | Count |
| --- | ---: |
| TP | 71 |
| FP | 9 |
| FN | 56 |
| TN | 64 |

Derived baseline:

- Precision: `88.8%`
- Recall: `55.9%`
- F1: `68.6%`

### Per-category readout

| Category | Support | Precision | Recall | F1 | Readout |
| --- | ---: | ---: | ---: | ---: | --- |
| `file_write` | 38 | 100.0% | 94.7% | 97.3% | Strong. Ordinary write prompts are mostly covered already. |
| `memory_save` | 13 | 100.0% | 100.0% | 100.0% | Fully covered on this corpus. |
| `resume_write` | 19 | 100.0% | 84.2% | 91.4% | Good, but not complete. Some phase/resume variants still slip. |
| `mixed_ambiguous` | 32 | 100.0% | 4.8% | 9.1% | Near-total failure. Read-only lead verbs suppress real write requests. |
| `deep_loop_write` | 36 | 100.0% | 13.9% | 24.4% | Largest recall hole. Most deep-loop prompts land in `no_match`. |
| `read_only` | 32 | 0.0% | n/a | n/a | Only 2 false positives here; overfire is no longer the dominant story. |
| `skill_routing_only` | 30 | 0.0% | n/a | n/a | 7 false positives, mostly where generic write language still leaks through. |

### Error classes

| Error class | Count | Severity | Readout |
| --- | ---: | --- | --- |
| `false_negative_missing_positive_trigger` | 37 | P1 | Positive coverage is missing for large parts of the write-producing surface. |
| `false_negative_read_only_override` | 19 | P1 | Read-only disqualifiers suppress prompts that still have concrete write intent. |
| `false_positive_generic_write_token` | 9 | P2 | Still present, but much smaller than the false-negative clusters. |

False-negative concentration:

- `deep_loop_write`: `31` misses
- `mixed_ambiguous`: `20` misses
- `resume_write`: `3` misses
- `file_write`: `2` misses

Known historical token check:

| Token | Prompt count | False positives |
| --- | ---: | ---: |
| `analyze` | 10 | 0 |
| `decompose` | 2 | 0 |
| `phase` | 16 | 0 |

Conclusion: Gate 3 does not need threshold tuning or another broad negative-token cleanup pass first. It needs targeted positive coverage for deep-loop prompts and a guarded way to recover write intent from mixed prompts.

## Advisor Accuracy Results

Iteration 5 established the skill-advisor baseline.

### Overall baseline

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

### Important per-skill results

| Skill | Support | Precision | Recall | F1 | Readout |
| --- | ---: | ---: | ---: | ---: | --- |
| `system-spec-kit` | 55 | 83.3% | 27.3% | 41.1% | The biggest recall failure. Packet-local maintenance prompts fragment badly. |
| `sk-code-opencode` | 17 | 100.0% | 17.6% | 30.0% | Very under-recalled despite perfect precision when it does fire. |
| `sk-deep-research` | 34 | 87.0% | 58.8% | 70.2% | Good precision, but command mirrors still steal real deep-loop rows. |
| `sk-deep-review` | 19 | 80.0% | 84.2% | 82.1% | Strongest large-support packet skill in the corpus. |
| `sk-code-review` | 20 | 57.7% | 75.0% | 65.2% | Overfires onto system-spec-kit maintenance prompts. |
| `sk-improve-prompt` | 10 | 42.9% | 90.0% | 58.1% | High recall, weak precision, especially on review/research phrasing. |
| `mcp-chrome-devtools` | 3 | 25.0% | 100.0% | 40.0% | Strong overfire on packet-local routing prompts. |

Command-only mirrors with zero gold support still fired repeatedly:

- `command-memory-save`: `5`
- `command-spec-kit-resume`: `4`
- `command-spec-kit-deep-research`: `3`
- `command-spec-kit-deep-review`: `2`

Those `14` command outputs are the cleanest advisor-side precision loss because the corpus gold answer is the owning skill in every one of those cases.

### Source-type breakdown

| Source type | Accuracy | Readout |
| --- | ---: | --- |
| `synthetic-realistic` | 68.0% | Best-performing slice; most misses are still advisor-side rather than Gate 3-side. |
| `paraphrased-realistic` | 54.1% | Paraphrase drift hurts both routers but advisor loss is still larger. |
| `synthetic-edge` | 35.4% | Edge cases expose overfire and abstention problems quickly. |
| `synthetic-command` | 0.0% | Complete miss. Command phrasing fragments routing into aliases or adjacent skills. |

Conclusion: the advisor does not primarily need threshold retuning. It needs output normalization and narrower command-bridge behavior so the top-level answer stays on the owning packet skill.

## Joint Error Analysis

Iteration 6 joined the two routing surfaces on the same 200-prompt corpus.

### Joint matrix

| Cell | Count | Share | Meaning |
| --- | ---: | ---: | --- |
| `TT` | 73 | 36.5% | Gate 3 correct, advisor correct |
| `TF` | 62 | 31.0% | Gate 3 correct, advisor wrong |
| `FT` | 34 | 17.0% | Gate 3 wrong, advisor correct |
| `FF` | 31 | 15.5% | Gate 3 wrong, advisor wrong |

Joint error rate: `127 / 200 = 63.5%`

Important decomposition:

- Single-surface misses (`TF + FT`): `96 / 127 = 75.6%`
- Double failures (`FF`): `31 / 127 = 24.4%`

That is the central systems conclusion of the packet. The routing problem is not dominated by coupled failure. Most misses can be recovered by repairing one surface at a time.

### `TF`: Gate 3 right, advisor wrong

Dominant gold skills:

- `system-spec-kit`: `23`
- `sk-code-opencode`: `12`
- `none`: `10`
- `sk-deep-research`: `7`

Dominant wrong outputs:

- `none`: `28`
- `sk-improve-prompt`: `9`
- `command-memory-save`: `5`
- `mcp-chrome-devtools`: `5`
- `command-spec-kit-resume`: `4`

Interpretation: once Gate 3 is correct, the advisor still drops packet-local writes into abstention or command aliases too often. This is why the command-normalization proposal ranks first.

### `FT`: Gate 3 wrong, advisor right

Dominant Gate 3 gold categories:

- `deep_loop_write`: `22`
- `resume_write`: `2`
- `file_write`: `2`

Dominant Gate 3 failure reason:

- `no_match`: `26`

Interpretation: this is mostly a Gate 3 recall problem. The advisor is already selecting the right owning skill for many deep-loop prompts, but Gate 3 never opens the spec-folder workflow path.

### `FF`: both wrong

Dominant Gate 3 categories:

- `mixed_ambiguous`: `19`
- `deep_loop_write`: `9`

Dominant advisor misroutes:

- `sk-code-review`: `11`
- `mcp-chrome-devtools`: `4`
- `none`: `4`
- `command-spec-kit-deep-research`: `3`

Interpretation: the double-failure cluster is not random. It is concentrated in:

1. mixed prompts that begin with read-only wording but end in a concrete write tail
2. deep-loop prompts where Gate 3 under-calls and the advisor emits a command mirror or adjacent skill

### Source-type split

| Source type | `TT` | `TF` | `FT` | `FF` | Readout |
| --- | ---: | ---: | ---: | ---: | --- |
| `synthetic-realistic` | 52 | 30 | 18 | 3 | Strongest slice; remaining misses are mostly advisor-side. |
| `paraphrased-realistic` | 11 | 11 | 9 | 6 | Both routers degrade under phrasing drift. |
| `synthetic-edge` | 10 | 14 | 7 | 17 | Main concentration of true double failures. |
| `synthetic-command` | 0 | 7 | 0 | 5 | Zero full successes; current command phrasing is routed badly on both surfaces. |

## Ranked Proposals

Iteration 7 ranked the remediation set by measured gain, simplicity, and reversibility.

| Rank | Proposal | Measured gain | Why it ranks here |
| --- | --- | --- | --- |
| 1 | Advisor command-surface normalization with an explicit-invocation guard | Advisor exact-match `53.5% -> 60.0%`; `TT 73 -> 81`; `FF 31 -> 26` | Best gain-per-line. Uses existing `owning_skill` metadata instead of rewriting the scorer. |
| 2 | Gate 3 deep-loop positive markers | Gate 3 F1 `68.6 -> 83.3`; `TT 73 -> 94`; `FT 34 -> 13`; `FF 31 -> 26` | Best additive classifier patch. Fixes the biggest `no_match` cluster with no dry-run precision regression. |
| 3 | Gate 3 broader resume/context markers | Gate 3 F1 `68.6 -> 71.1`; `TT 73 -> 76`; `FT 34 -> 31`; `FF 31 -> 30` | Small, clean cleanup pass, but much lower yield than the first two. |
| 4 | Gate 3 mixed-tail write exception | Gate 3 F1 `68.6 -> 73.5`; `FF 31 -> 23` but mostly shifts misses into `TF` | Useful follow-on, but more branch-heavy and less directly accretive to joint correctness. |
| 5 | Confidence-threshold tuning (`0.75` or `0.85`) | `0.75`: no exact-match gain; `0.85`: accuracy drops to `51.0%` | Cheap to toggle, but the corpus says it is the wrong lever. |

### Rollup end-state

The full dry-run end-state is still attractive:

- Gate 3 bundle (deep-loop markers + resume/context markers + mixed-tail exception): F1 `68.6 -> 89.0`, `TT 73 -> 97`, `FF 31 -> 17`
- Gate 3 bundle plus advisor normalization: `TT 73 -> 108`, `FT 34 -> 12`, `FF 31 -> 15`

But the research packet does not recommend shipping the whole bundle at once. The data favors a staged order so each patch can be verified against the corpus independently and the remaining error mass can be re-measured after the highest-yield changes land.

### Cost and latency

Runtime cost is not the blocker. The current Gate 3 vocabulary has `30` entries. The measured size impact of the leading proposals is:

- deep-loop markers: about `+8` entries
- broader resume/context markers: about `+3`
- full Gate 3 bundle: about `+11`

That remains negligible at runtime because the classifier is still a short linear scan over a single prompt string. The real cost is implementation and regression-surface complexity, especially for the mixed-tail exception.

## Implementation Handoff

### Suggested child packet

`019-system-hardening/004-routing-accuracy-hardening`

This numbering keeps the remediation separate from the already-suggested save-path and description-regeneration hardening children while preserving the shared `019-system-hardening` umbrella.

### Recommended scope split

#### Wave A: advisor normalization

Primary targets:

- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
- any shared command-bridge metadata the scorer already uses
- regression coverage for command aliases versus owning skills

Change goal:

- when a command-only bridge wins, normalize it back to the owning skill if the prompt is explicitly invoking the command workflow
- keep a guard for quoted-command or implementation-target prompts so rows like the `rr-iter3-070` counterexample are not flattened incorrectly

#### Wave B: Gate 3 deep-loop markers

Primary targets:

- `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts`
- packet-local classifier tests/corpus fixtures

Change goal:

- add explicit deep-research and deep-review markers plus loop-oriented variants that the corpus already proves are write-producing workflows

#### Wave C: smaller follow-ons, only if re-measurement still justifies them

Possible follow-ups:

- broader resume/context marker coverage
- narrow mixed-tail write exception for prompts that start read-only but end with an explicit write target

### Exit criteria

The implementation child should not close until it can show:

1. advisor exact-match accuracy materially above the `53.5%` baseline on the labeled corpus
2. Gate 3 F1 materially above the `68.6%` baseline, starting with the deep-loop slice
3. no regression on the historical false-positive tokens `analyze`, `decompose`, and `phase`
4. a re-measured joint matrix showing how much of the `TF`, `FT`, and `FF` mass remains after the staged fixes

## Open Questions / Out of Scope

### Open questions

1. Should advisor command normalization fire whenever a command bridge wins, or only when the command surface is the requested workflow rather than a quoted string or implementation target?
2. Should the mixed-tail Gate 3 repair stay narrow and explicit, or should the classifier grow a broader second-pass file-target detector?
3. Do deep-loop prompts deserve their own documented Gate 3 category, or is additive trigger coverage enough as long as tests stay explicit?
4. After the first two fixes land, does the remaining error mass still justify the mixed-tail exception, or does it shrink enough to avoid that extra logic branch?

### Out of scope for this packet

1. re-architecting either router
2. training or introducing a new ML routing layer
3. redesigning the skill graph or semantic-search infrastructure
4. implementing the hardening work inside this research packet

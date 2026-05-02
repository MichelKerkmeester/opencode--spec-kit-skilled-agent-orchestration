---
title: "Deep-Read of quality-scorer.ts and quality-gates.ts: Scoring Model and Gate Logic"
iteration: 2
focus: "Quality Scoring Model — all dimensions, max points, zero-score triggers, and conversation message dependency"
findings_summary: "The quality scorer uses 6 dimensions totaling 100 max points: trigger_phrases (0-20), key_topics (0-15), file_descriptions (0-20), content_length (0-15), html_safety (0-15), observation_dedup (0-15). Two penalty modifiers exist: contamination (-10% to -30% with caps) and sufficiency (caps at 40% of sufficiency score). None of the 6 dimensions directly count conversation messages. They measure rendered output quality. However, in JSON-mode the upstream extractors produce empty/minimal data, so the scorer receives impoverished inputs. quality-gates.ts is a thin pass/fail gate checking 6 conditions. validate-memory-quality.ts has 14 rules (V1-V14) operating on rendered content."
---

# Iteration 2: Deep-Read of quality-scorer.ts and quality-gates.ts

## Focus

Examine every scoring dimension in the quality scorer, its maximum points, and what triggers a zero score. Map which dimensions depend on conversation messages versus other data sources. Additionally, document quality-gates.ts decision logic and validate-memory-quality.ts validation rules (V1-V14).

## Findings

### 1. Quality Scorer: 6 Dimensions Totaling 100 Points

The `scoreMemoryQuality()` function (quality-scorer.ts:127-320) accepts 8 parameters and scores across 6 dimensions with a 100-point maximum. The function receives already-extracted data, NOT raw conversation messages.

**Parameters received** (lines 128-136):
- `content: string` -- the rendered markdown memory content
- `triggerPhrases: string[]` -- already extracted by an upstream extractor
- `keyTopics: string[]` -- already extracted by an upstream extractor
- `files: FileWithDescription[]` -- file references with descriptions
- `observations: ObservationWithNarrative[]` -- observation entries with titles/narratives
- `sufficiencyResult?: MemorySufficiencyResult` -- pre-computed sufficiency assessment
- `hadContamination: boolean` -- flag from contamination filter
- `contaminationSeverity: ContaminationSeverity | null` -- severity level

[SOURCE: quality-scorer.ts:127-136]

### 2. Dimension 1: Trigger Phrases (0-20 points)

| Condition | Score |
|-----------|-------|
| `triggerPhrases.length >= 8` | 20 |
| `triggerPhrases.length >= 4` | 15 |
| `triggerPhrases.length > 0` | 10 |
| `triggerPhrases.length === 0` | **0** (flag: `missing_trigger_phrases`) |

**Zero trigger**: No trigger phrases extracted at all.

**Dependency on conversation messages**: Indirect. Trigger phrases are extracted upstream by session-extractor or a similar module. In JSON-mode, if the extractor cannot find suitable phrases from the structured data, this scores 0.

[SOURCE: quality-scorer.ts:149-158]

### 3. Dimension 2: Key Topics (0-15 points)

| Condition | Score |
|-----------|-------|
| `keyTopics.length >= 5` | 15 |
| `keyTopics.length >= 2` | 10 |
| `keyTopics.length > 0` | 5 |
| `keyTopics.length === 0` | **0** (flag: `missing_key_topics`) |

**Zero trigger**: No key topics extracted at all.

**Dependency on conversation messages**: Indirect. Key topics are extracted upstream. If conversation data is empty/minimal, the topic extractor produces fewer or no topics.

[SOURCE: quality-scorer.ts:161-169]

### 4. Dimension 3: File Descriptions (0-20 points)

| Condition | Score |
|-----------|-------|
| `files.length === 0` (no files at all) | **10** (flag: `missing_file_context`, but gets a floor of 10) |
| Files present, high description quality avg | Up to 20 (proportional to `descriptionQualityAverage * 20`) |
| Files present, low description quality avg (<0.5) | Proportional but flag: `missing_file_context` |

**Zero trigger**: Theoretically impossible -- even zero files gives 10 points.

**Dependency on conversation messages**: None directly. This dimension scores file reference descriptions. JSON-mode payloads often include FILES data, so this dimension CAN score well even without conversation messages.

Description quality tiers (lines 58-63):
- `placeholder`: 0
- `activity-only`: 0.35
- `semantic`: 0.75
- `high-confidence`: 1.0

Trust multipliers (lines 65-79):
- `_synthetic`: 0.5x
- `git` provenance: 1.0x
- `spec-folder` or `tool` provenance: 0.8x
- Other/unknown: 0.3x

[SOURCE: quality-scorer.ts:174-185, 58-79]

### 5. Dimension 4: Content Length (0-15 points)

This dimension uses a 2-axis evaluation: line count AND title specificity.

| Lines | Specific Title | Score | Flag |
|-------|---------------|-------|------|
| >= 100 | Yes | 15 | - |
| >= 50 | Yes | 12 | - |
| >= 20 | Yes | 8 | - |
| >= 100 | No | 10 | `generic_title` |
| >= 50 | No | 5 | `generic_title` |
| >= 20 | No | 3 | `generic_title` |
| < 20 | Any | **0** | `short_content` |

**Zero trigger**: Content shorter than 20 lines.

**Dependency on conversation messages**: Indirect but critical. When MESSAGES is empty, the template renderer produces minimal content (mostly boilerplate headers). The rendered markdown will likely be under 20 lines of meaningful content, scoring 0.

Title specificity check (`hasSpecificPrimaryTitle`, lines 96-103) requires either a frontmatter `title:` or H1 heading at least 8 characters long that passes the `pickBestContentName` filter.

[SOURCE: quality-scorer.ts:189-212]

### 6. Dimension 5: HTML Safety (0-15 points)

| Condition | Score |
|-----------|-------|
| Zero leaked HTML tags (excluding code blocks) | 15 |
| 1-2 leaked tags | 10 (flag: `leaked_html`) |
| 3+ leaked tags | 5 (flag: `leaked_html`) |

**Zero trigger**: Cannot score 0 -- minimum is 5 even with many leaked tags.

**Dependency on conversation messages**: None. This purely checks the rendered output for HTML tag leakage.

[SOURCE: quality-scorer.ts:215-231]

### 7. Dimension 6: Observation Deduplication (0-15 points)

| Condition | Score |
|-----------|-------|
| `observations.length === 0` | **5** (flag: `duplicate_observations`) |
| Observations present | `round(dedupRatio * meaningfulRatio * 15)` |

Where:
- `dedupRatio` = unique titles / total titles (penalizes duplicates)
- `meaningfulRatio` = titles passing `hasMeaningfulObservationTitle()` / total titles

`hasMeaningfulObservationTitle()` (lines 105-116) requires:
- Title exists and is non-empty
- Normalized title >= 10 characters
- Not a generic content task name (`isGenericContentTask`)
- Not a contaminated memory name (`isContaminatedMemoryName`)

**Zero trigger**: `round(0 * anything * 15)` = 0 when all titles are duplicates OR all are too short/generic.

**Dependency on conversation messages**: Indirect. Observations are passed in from upstream extractors. In JSON-mode, observations may be provided directly in the JSON payload, but the conversation extractor drops them (as found in iteration 001, lines 112-127). So this dimension gets the floor of 5 (zero observations) rather than a potentially higher score from processing the JSON observations.

[SOURCE: quality-scorer.ts:234-256]

### 8. Contamination Penalty (Modifier, Not a Dimension)

Applied after the 6-dimension sum:

| Severity | Penalty | Score Cap |
|----------|---------|-----------|
| Low | -10% | None |
| Medium | -15% | 0.85 |
| High | -30% | 0.60 |

When `hadContamination` is true and no explicit severity is provided, defaults to `medium`.

[SOURCE: quality-scorer.ts:262-278]

### 9. Sufficiency Penalty (Modifier, Not a Dimension)

When `sufficiencyResult.pass === false`:
- Score is capped at `sufficiencyResult.score * 0.4`
- Flag: `has_insufficient_context`

This means if the sufficiency check produces a score of 0.25, the quality score is capped at 0.10 (10/100), regardless of how high the 6 dimensions scored.

[SOURCE: quality-scorer.ts:280-285]

### 10. Quality Gates: shouldIndexMemory() Decision Logic

`quality-gates.ts` exports `shouldIndexMemory()` (lines 17-68) which is a sequential pass/fail gate with 6 conditions checked in order:

1. **ctxFileWritten**: If context file was not written (duplicate detected), skip indexing
2. **templateContractValid**: If rendered memory fails template contract, skip indexing
3. **sufficiencyPass**: If sufficiency check failed, skip indexing
4. **qualityScore01 < qualityAbortThreshold**: If quality score below threshold, skip indexing
5. **validationDisposition === 'write_skip_index'**: Write file but don't index
6. **validationDisposition === 'abort_write'**: Don't write or index

All conditions must pass for `shouldIndex: true`.

The `formatSufficiencyAbort()` function (lines 70-76) formats a human-readable rejection message including evidence counts: primary, support, total, semanticChars, uniqueWords.

[SOURCE: quality-gates.ts:17-76]

### 11. Validation Rules V1-V14: Complete Reference

The `validate-memory-quality.ts` module provides 14 post-render validation rules that operate on the rendered content string. These are INDEPENDENT of conversation messages -- they validate the final output:

| Rule | Severity | Block Write | Block Index | What It Checks |
|------|----------|-------------|-------------|----------------|
| V1 | high | Yes | Yes | Placeholder leakage in required fields (`[TBD]` in decisions/next_actions/blockers/readiness) |
| V2 | medium | No | Yes | `[N/A]` placeholder when tool_count > 0 |
| V3 | high | Yes | Yes | Malformed spec_folder (contains `**`, `*`, `[`, or "Before I proceed") |
| V4 | low | No | No | Fallback decision text ("No specific decisions were made") |
| V5 | low | No | No | Sparse semantic fields (trigger_phrases empty when tool_count >= 5) |
| V6 | low | No | No | Template placeholder remnants (dangling scores, empty confidence, etc.) |
| V7 | low | No | No | Contradictory tool state (tool_count=0 but execution signals present) |
| V8 | high | Yes | Yes | Foreign spec contamination (non-allowed spec IDs in frontmatter or body) |
| V9 | high | Yes | Yes | Contaminated title (template heading, bracket placeholder, stub title, spec-id-only) |
| V10 | low | No | No | Session source mismatch (filesystem vs captured file count divergence) |
| V11 | high | Yes | Yes | API error content leakage (error-dominated descriptions, titles, or trigger phrases) |
| V12 | medium | No | Yes | Topical coherence (zero overlap between memory content and spec trigger_phrases) |
| V13 | high | Yes | Yes | Malformed frontmatter YAML or content density < 50 non-whitespace chars |
| V14 | low | No | No | Status/percentage contradiction (complete but < 100%) |

**Hard blockers** (abort write): V1, V3, V8, V9, V11, V13 -- all severity=high with blockOnWrite=true

**Index blockers** (write but skip index): V2, V12 -- blockOnIndex=true, blockOnWrite=false

**Soft diagnostics** (write and index): V4, V5, V6, V7, V10, V14 -- no blocking

**V8 contamination detection** (lines 702-775): Uses `extractAllowedSpecIds()` which builds an allowed set from the full spec folder path (all ancestors) PLUS child phase folders PLUS related_specs from spec.md. Foreign spec IDs are classified as:
- `dominatesForeignSpec`: A foreign spec appears >= 3 times AND >= currentSpec mentions + 2
- `scatteredForeignSpec`: >= 2 foreign specs each appearing <= 2 times
- `frontmatterForeignSpec`: Foreign IDs in trigger_phrases or key_topics

**V13 content density** (lines 877-895): Strips frontmatter and code fences, then counts non-whitespace chars. Below 50 characters = hard block. This is particularly relevant for JSON-mode: if the template produces mostly boilerplate with little actual content, V13 will block the write entirely.

[SOURCE: validate-memory-quality.ts:44-157, 624-915]

### 12. JSON-Mode Impact Analysis: Which Dimensions Suffer

When JSON-mode input produces empty/minimal MESSAGES (per iteration 001 findings):

| Dimension | Max | JSON-Mode Likely Score | Reason |
|-----------|-----|----------------------|--------|
| trigger_phrases | 20 | 0-10 | Extractor may produce some from sessionSummary text, but typically sparse |
| key_topics | 15 | 0-5 | Same extraction challenge |
| file_descriptions | 20 | 10-20 | JSON payloads often include FILES, can score well |
| content_length | 15 | 0-5 | Template produces short output when MESSAGES is empty |
| html_safety | 15 | 15 | Unaffected -- no HTML in JSON-mode output |
| observation_dedup | 15 | 5 | Observations dropped by extractor, gets floor of 5 |
| **Total** | **100** | **30-60** | **Many JSON-mode saves hover near or below the abort threshold** |

Additionally, V13 (content density < 50 non-whitespace chars) may HARD BLOCK the write entirely when the template renders minimal content from empty MESSAGES.

[INFERENCE: based on scorer logic from quality-scorer.ts, gate logic from quality-gates.ts, and extractor behavior from iteration 001]

## Ruled Out

No approaches were tried and failed -- this was a code-reading exercise.

## Dead Ends

None identified.

## Sources Consulted

- `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts` (full file, 321 lines)
- `.opencode/skill/system-spec-kit/scripts/core/quality-gates.ts` (full file, 77 lines)
- `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts` (lines 1-915, validation rules V1-V14)

## Assessment

- New information ratio: 1.0
- Questions addressed: ["What quality scoring dimensions should apply to JSON-mode inputs vs transcript inputs?"]
- Questions answered: Fully characterized -- the 6 dimensions are trigger_phrases (20), key_topics (15), file_descriptions (20), content_length (15), html_safety (15), observation_dedup (15). None directly count conversation messages, but 4 of 6 are indirectly dependent on upstream extractors that need conversation data to produce good results. JSON-mode saves likely score 30-60/100 due to impoverished upstream extraction. V13 may hard-block writes when content is too sparse.

## Reflection

- What worked and why: Reading all three files (quality-scorer.ts, quality-gates.ts, validate-memory-quality.ts) in sequence revealed the full quality evaluation pipeline. The scorer and validator operate at different stages -- scorer on extracted data, validator on rendered content -- but both suffer when upstream extraction is poor.
- What did not work and why: N/A -- second iteration, code reading approach remains appropriate for the deep-reading phase.
- What I would do differently: Next iteration should trace the callers of `scoreMemoryQuality()` in workflow.ts to understand how the extracted data (trigger phrases, key topics, observations) actually gets passed in, and where the JSON-mode path diverges.

## Recommended Next Focus

Trace the workflow.ts orchestration to understand how collectedData flows through the full pipeline: data-loader -> conversation-extractor -> session-extractor -> template-renderer -> quality-scorer -> quality-gates. Identify exactly where JSON-mode data could be injected or transformed to produce better scores.

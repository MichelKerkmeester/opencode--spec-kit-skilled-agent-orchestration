# Iteration 1: Quality Scoring Accuracy (Domain C)

## Focus
Investigate whether the quality scorer penalty weights (high=0.25, medium=0.15, low=0.05) are correctly calibrated, whether description trust multipliers predict real-world retrieval usefulness, and identify structural issues in the dual-scorer architecture (core vs extractors) that could produce misleading scores.

## Findings

### F1: THREE separate quality scoring systems with divergent architectures
There are two `scoreMemoryQuality` functions plus a post-save review module, each using fundamentally different scoring models:

1. **`core/quality-scorer.ts`** (legacy, 8-parameter) -- Uses a 100-point additive breakdown across 6 dimensions: trigger_phrases (0-20), key_topics (0-15), file_descriptions (0-20), content_length (0-15), html_safety (0-15), observation_dedup (0-15). Score starts at 0, adds up, then divides by 100.
   [SOURCE: .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:127-320]

2. **`extractors/quality-scorer.ts`** (new, V-rule-based) -- Uses a 1.0 subtractive model. Score starts at 1.0, then subtracts severity-weighted penalties for each failed V-rule. Adds bonuses for messageCount (+0.05), toolCount (+0.05), decisionCount (+0.10).
   [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:72-231]

3. **`core/post-save-review.ts`** -- A post-hoc comparison layer that detects field drift between the JSON payload and saved file. Does not produce a numeric score but surfaces HIGH/MEDIUM/LOW issues.
   [SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:204-346]

**Impact**: The two numeric scorers can produce dramatically different scores for the same memory because they measure fundamentally different things (content richness vs. structural validity). A memory with rich trigger phrases and descriptions but a V1-failing placeholder would score high in the core scorer and low in the extractors scorer.

### F2: Penalty weights are severity-uniform but V-rules have extreme imbalance in count
The V-rule severity distribution is:
- **high** (0.25 penalty): V1, V3, V8, V9, V11 -- 5 rules
- **medium** (0.15 penalty): V2, V12 -- 2 rules
- **low** (0.05 penalty): V4, V5, V6, V7, V10 -- 5 rules

A memory failing all 5 high-severity rules would receive a cumulative penalty of 1.25, exceeding the 1.0 score ceiling. However, since high-severity rules (V1, V3, V8, V9, V11) are `blockOnWrite: true`, they would abort the file write entirely before scoring runs in the extractors path. This means in practice, the extractors scorer will only ever see failed medium/low rules. The maximum real-world penalty from V-rule failures alone is 2*0.15 + 5*0.05 = 0.55.
[SOURCE: .opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:42-139]
[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:44-48]

**Calibration concern**: The 0.25 penalty for high-severity rules is moot in practice because those rules block writing. The actual calibration question is whether 0.15 (medium) and 0.05 (low) adequately separate signal quality. A V12 topical mismatch (medium, 0.15) and a V5 sparse semantic fields (low, 0.05) may in practice both be equally damaging to retrieval quality.

### F3: The extractors scorer has an upward-bias bonus system that can mask failures
The bonuses applied:
- `messageCount > 0`: +0.05
- `toolCount > 0`: +0.05
- `decisionCount >= 1`: +0.10

These bonuses are added after V-rule penalties but before the sufficiency cap. A memory that fails V5 (sparse triggers, -0.05 penalty) but has messages, tools, and decisions gets: 1.0 - 0.05 + 0.05 + 0.05 + 0.10 = **1.15**, clamped to **1.00**.
[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:195-205]

**Impact**: The bonus system fully compensates for ANY single low-severity failure and most single medium-severity failures. A memory with a V12 topical mismatch (-0.15) but all three bonuses gets 1.0 - 0.15 + 0.20 = **1.05 -> 1.00**. This means V12 violations are invisible in the score for any session with messages, tools, and decisions -- which is nearly all sessions.

### F4: Description trust multipliers exist only in the core scorer, not the extractors scorer
The core scorer uses a tiered description quality system:
- `placeholder`: 0 score
- `activity-only`: 0.35
- `semantic`: 0.75
- `high-confidence`: 1.0

Multiplied by trust provenance:
- `_synthetic`: 0.5x
- `git`: 1.0x
- `spec-folder` / `tool`: 0.8x
- fallback: 0.3x

These multiply together to produce the file_descriptions dimension (worth up to 20/100 points). But **the extractors scorer does not use description quality at all**. It has no concept of description tiers or trust multipliers. If the pipeline uses the extractors scorer (which is the "preferred" path per the comment at core/quality-scorer.ts:125-126), description quality has zero impact on the quality score.
[SOURCE: .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:58-84]
[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts (entire file -- no description logic)]

### F5: Sample memory files show quality_score: 1.00 is overwhelmingly common
Both sampled memory files show `quality_score: 1.00`:
- `016-json-mode-hybrid-enrichment/memory/20-03-26_11-38__implemented-4-json-mode-memory-save-quality-gap.md` -- quality_score: 1.00 with quality_flags: ["insufficient_capture"]
- `001-quality-scorer-unification/memory/16-03-26_18-04__quality-scorer-unification.md` -- quality_score: 1.00 with quality_flags: []

The first file has `quality_score: 1.00` AND `quality_flags: ["insufficient_capture"]` simultaneously, which is a contradiction: the file is flagged as having insufficient capture but receives a perfect quality score. The `insufficient_capture` flag triggers a -0.15 penalty (from the P3-4 minimum_message_ratio check), but the bonuses (+0.20 total) more than compensate.
[SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/memory/20-03-26_11-38__implemented-4-json-mode-memory-save-quality-gap.md:46-48]

### F6: Contamination penalty architecture is sound but has a dead-code smell
Both scorers implement contamination penalties with identical severity thresholds:
- low: -0.10 penalty (core) / cap-only (extractors)
- medium: -0.15 + cap at 0.85 (core) / cap at 0.85 (extractors)
- high: -0.30 + cap at 0.60 (core) / cap at 0.60 (extractors)

The core scorer applies both a subtraction AND a cap for medium/high, while the extractors scorer only applies the cap. Comment "O2-3" in the extractors scorer explicitly notes this was intentional to avoid double-counting. However, the core scorer still double-counts. If both scorers are in active use, they produce different contamination penalty magnitudes for the same memory.
[SOURCE: .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:262-278]
[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:159-171]

### F7: Post-save review detects path fragments in trigger phrases but main scorers do not
The post-save review (`core/post-save-review.ts`) has explicit path fragment detection with patterns like `/^[a-z]{1,4}$/`, stopwords, directory names, and generic file stems. Neither of the two quality scorers penalizes memories with path-fragment trigger phrases.

Looking at the sampled memory file `016-json-mode-hybrid-enrichment/memory/20-03-26_11-38__...`, its trigger phrases include obvious path fragments: `"kit/022"`, `"fusion/010"`, `"capturing/021"`, `"json"`, `"mode"`, `"enrichment"`. These would match the post-save review's path fragment patterns, but the quality score is still 1.00 because this detection only happens after save, not in the scorer.
[SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:184-194]
[SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/memory/20-03-26_11-38__implemented-4-json-mode-memory-save-quality-gap.md:31-36]

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts` (321 lines, full read)
- `.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts` (247 lines, full read)
- `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts` (732 lines, full read)
- `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` (383 lines, full read)
- Memory file: `016-json-mode-hybrid-enrichment/memory/20-03-26_11-38__implemented-4-json-mode-memory-save-quality-gap.md` (frontmatter)
- Memory file: `001-quality-scorer-unification/memory/16-03-26_18-04__quality-scorer-unification.md` (frontmatter)

## Assessment
- New information ratio: 0.85
- Questions addressed: [Q3 (penalty weights), Q5 partially (description trust multipliers)]
- Questions answered: [Q3 partially -- weights are technically well-structured but functionally ineffective due to bonus compensation; Q5 partially -- trust multipliers only exist in the legacy scorer]

## Reflection
- What worked and why: Reading ALL three quality scoring modules side-by-side revealed structural inconsistencies that no single-file review would catch. The dual-scorer architecture with divergent scoring models is the root finding.
- What did not work and why: The initial path `lib/quality-scorer.ts` was wrong (the actual path is `core/quality-scorer.ts`); resolved with Grep search. This cost one extra tool call.
- What I would do differently: Start with Grep for the canonical export/import chain to identify which scorer is actually invoked at runtime, rather than reading all candidates.

## Recommended Next Focus
Domain A (Pipeline Data Integrity): Trace which scorer is actually used at runtime by following the import chain from `generate-context.js` through the workflow. Also investigate the `P3-4 minimum_message_ratio` check which appears to be the only thing generating `insufficient_capture` flags, and whether the -0.15 penalty is always masked by bonuses.

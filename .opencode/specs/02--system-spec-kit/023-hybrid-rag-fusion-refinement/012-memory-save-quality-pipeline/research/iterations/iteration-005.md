# Iteration 005: Decision Extractor -- 4x Text Repetition Root Cause

## Focus
Deep-read `decision-extractor.ts` to trace how keyDecisions from JSON input become decision blocks in the rendered output. Identify exactly why the same text repeats 4 times (CONTEXT / OPTIONS / CHOSEN / RATIONALE).

## Findings

### 1. The 4x Repetition Root Cause -- Single-String keyDecisions

When a keyDecision is a plain string (e.g., `"Use ESM modules for all new code"`), the text propagates into 4 separate template fields that all render in the output:

**Path through `input-normalizer.ts` (lines 198-261):**
- `transformKeyDecision()` receives the string at line 204
- `decisionText = decisionItem` (line 205) -- the raw string
- `chosenApproach` is extracted via regex or falls back to `null` (line 206-208)
- `rationale = decisionText` (line 208) -- **same text again**
- `finalChosenApproach = chosenApproach || title` (line 233) -- falls back to title, which is the first sentence of `decisionText`
- Facts array at lines 240-244 embeds the text a third time:
  ```
  facts: [
    "Option 1: <finalChosenApproach>",   // ~= decisionText
    "Chose: <finalChosenApproach>",       // ~= decisionText
    "Rationale: <rationale>"              // = decisionText verbatim
  ]
  ```

**Path through `decision-extractor.ts` (lines 197-362):**
- `decisionText` is the raw string (line 206)
- `title` is extracted via regex at line 215 -- first portion of `decisionText`
- `sentenceSplitRationale` at lines 218-221 tries to split but gets empty string for short decisions
- `rationale` at line 280: `rationaleFromInput || sentenceSplitRationale || decisionText` -- falls back to **full `decisionText`**
- `chosenLabel` at lines 282-283: `OPTIONS[0]?.DESCRIPTION || OPTIONS[0]?.LABEL` -- which is `title` (same text)
- `contextText` at lines 330-332: `title` (same text again)

**Template rendering (`context_template.md` lines 492-566) outputs all 4:**
1. `**Context**: {{CONTEXT}}` (line 497) -- the title/description
2. `{{DESCRIPTION}}` under Options Considered (line 516) -- title truncated to 200 chars
3. `**Selected**: {{CHOSEN}}` (line 521) -- the chosenLabel, which defaults to `OPTIONS[0].DESCRIPTION`
4. `**Rationale**: {{RATIONALE}}` (line 523) -- falls back to full `decisionText`

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:197-362]
[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:198-261]
[SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:492-566]

### 2. Object-Form Decisions Also Suffer Partial Repetition

When a keyDecision is an object like `{ decision: "Use ESM", rationale: "Better tree-shaking" }`, the extractor does better but still has issues:

- At line 208, `decisionText = toText(manualObj.decision) || toText(manualObj.title)` -- extracted properly
- At line 215, `title` is parsed from `decisionText` via regex
- At line 280, `rationale` resolves to `rationaleFromInput` if present -- **distinct from title** (good)
- At line 282-283, `chosenLabel` checks `manualObj.chosen`, `manualObj.choice`, `manualObj.selected` -- but if none provided, falls back to `OPTIONS[0]?.DESCRIPTION` which is the title again

**The fallback chain at line 270-277 creates a single-option list:**
```typescript
OPTIONS = [{
  OPTION_NUMBER: 1,
  LABEL: 'Chosen Approach',
  DESCRIPTION: title.length > 200 ? title.substring(0, 197) + '...' : title,
  ...
}];
```

So for objects without `alternatives`, CHOSEN still equals `title`.

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:270-283]

### 3. The CONTEXT Field Is Intentionally Brief (Fix 1 Applied)

Lines 329-332 show a prior fix attempt:
```typescript
// Fix 1: CONTEXT = brief "why this decision mattered", not the full rationale
const contextText: string = rationaleFromInput
  ? `${title} -- ${rationaleFromInput.substring(0, 120)}`
  : title;
```

This means CONTEXT is distinct from RATIONALE **only when** `rationaleFromInput` is non-empty. For string-form decisions, `rationaleFromInput` is always empty (it reads from `manualObj?.rationale` which is undefined for strings), so CONTEXT = title = first part of decisionText.

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:329-332]

### 4. The Observation-Based Path Also Has Repetition

For decisions extracted from observations (lines 390-569), the repetition is different:
- `CONTEXT` = `narrative` (line 542) -- the full observation narrative
- `CHOSEN` = first option label or regex match (lines 449-452) -- could be distinct
- `RATIONALE` = regex match or `narrative.substring(0, 200)` (line 455) -- **substring of CONTEXT**

So RATIONALE is always a prefix of CONTEXT in the observation path.

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:449-455]

### 5. Dual-Registration of Decisions

The `input-normalizer.ts` both:
1. Creates decision observations via `transformKeyDecision()` and pushes to `observations[]` (lines 560-564)
2. Copies raw decisions to `_manualDecisions[]` (line 553)

The `decision-extractor.ts` then:
1. Processes `_manualDecisions` into `processedManualDecisions` (lines 197-362)
2. Suppresses observation-type decisions when manual decisions exist (line 376: `decisionObservations = []`)
3. Merges at line 573: `allDecisions = [...processedManualDecisions, ...decisions]`

This means decisions are NOT duplicated as separate entries -- the suppression at line 376 prevents that. But the same text still appears 4x **within each single decision block**.

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:375-377]
[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:552-565]

## Ruled Out
- Decision duplication as separate entries -- suppression logic at lines 375-377 works correctly
- Template bug -- the template is designed for rich decisions with distinct CONTEXT/OPTIONS/CHOSEN/RATIONALE; the bug is in data preparation, not rendering

## Dead Ends
None -- this is the core finding.

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts` (full file, 624 lines)
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` (lines 198-261, 546-565)
- `.opencode/skill/system-spec-kit/templates/context_template.md` (lines 488-572)

## Assessment
- New information ratio: 1.0
- Questions addressed: ["How can decision rendering avoid 4x text repetition when only keyDecision text is available?"]
- Questions answered: ["How can decision rendering avoid 4x text repetition when only keyDecision text is available?"]

## Reflection
- What worked and why: Reading the decision-extractor end-to-end and tracing the specific fallback chains for string-form inputs revealed the exact cascade that causes repetition. The template is correct -- it expects distinct values in CONTEXT, OPTIONS.DESCRIPTION, CHOSEN, and RATIONALE -- but the extractor fills all four with the same source text when no structured fields are available.
- What did not work and why: N/A -- direct code reading was the right approach for this question.
- What I would do differently: For the fix, the extractor needs distinct generation strategies per field when input is a plain string: CONTEXT should be a 1-sentence summary, OPTIONS should list the approach, CHOSEN should be a label, and RATIONALE should explain "why" (or be omitted if not extractable).

## Recommended Next Focus
Deep-read `data-loader.ts` and `generate-context.ts` to map the JSON input parsing pipeline -- which fields are accepted, which are rejected, and how `--json` input flows to `CollectedDataFull`.

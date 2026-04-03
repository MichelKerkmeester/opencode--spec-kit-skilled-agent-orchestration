# Iteration 15: Decision Renderer De-duplication Fix Design

## Focus
Design the fix for 4x text repetition in decision rendering when JSON-mode saves provide only a string-form decision (no structured alternatives/rationale). The template renders TITLE, CONTEXT, OPTIONS[0].DESCRIPTION, CHOSEN, and RATIONALE -- all from the same source text.

## Findings

### Finding 1: Root cause of 4x repetition traced through decision-extractor.ts

When a JSON-mode save provides a plain string decision (e.g., `"Use ESM modules for compliance"`), the `extractDecisions()` function in `decision-extractor.ts` processes it through the manual decision path (line 197-362). The data flow produces near-identical values in 5 fields:

1. **TITLE** (line 215): Parsed from `titleMatch[1]` -- for a simple string without `--` separator, this is the entire text
2. **CONTEXT** (line 330-332): When `rationaleFromInput` is empty (no `.rationale` property), falls back to just `title`
3. **OPTIONS[0].DESCRIPTION** (line 270-277): When `rawAlternatives` is empty, creates a single option with `DESCRIPTION = title`
4. **CHOSEN** (line 282-283): When no `.chosen`/`.choice`/`.selected` property, uses `OPTIONS[0].DESCRIPTION` which equals title
5. **RATIONALE** (line 280): When `rationaleFromInput` is empty and `sentenceSplitRationale` is empty, falls back to `decisionText` (the full original string)

The template at `context_template.md` lines 492-566 renders ALL five of these: `{{TITLE}}`, `{{CONTEXT}}`, `{{DESCRIPTION}}`, `{{CHOSEN}}`, and `{{RATIONALE}}`. For a simple string decision, the reader sees the same text 4-5 times.

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:197-362]
[SOURCE: .opencode/skill/system-spec-kit/templates/context_template.md:492-566]

### Finding 2: The title/rationale split heuristic is insufficient

Line 214 attempts to split a string decision into title vs rationale using a dash separator (`--` or em-dash):
```typescript
const titleMatch = decisionText.match(/^(?:Decision\s*(?:\d+\s*)?:\s*)?(.+?)(?:\s+(?:--|[\u2013\u2014])\s+(.+))?$/i);
```

The fallback at lines 218-221 tries splitting at the first sentence boundary. However, most JSON-sourced decisions are single sentences without separators, so both heuristics return the entire text as `title` with an empty `fallbackRationale`.

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:214-221]

### Finding 3: Design for minimum viable decision block format

The current template structure has 7 subsections per decision: Context, Timestamp, Importance, Visual Decision Tree, Options Considered, Chosen Approach (with Selected + Rationale), and Trade-offs. For a JSON-sourced simple-string decision, most of these are empty or redundant. The fix should produce a **compact block** when the decision lacks structured data.

**Proposed minimum viable decision block** for JSON-sourced decisions:

```
### Decision 1: [TITLE]
**Decision**: [one-line statement -- only shown if different from TITLE]
**Rationale**: [only if explicitly provided or extractable]
**Confidence**: NN%
```

This eliminates: CONTEXT (redundant with TITLE for simple decisions), OPTIONS section (only "Chosen Approach" with same text), CHOSEN (redundant with TITLE).

[INFERENCE: based on template structure analysis and decision-extractor data flow]

### Finding 4: Concrete de-duplication strategy in decision-extractor.ts

The fix has three parts:

**(a) Avoid 4x text repetition -- Deduplicate at the extractor level:**

Add a `IS_COMPACT` boolean flag to `DecisionRecord`. Set it `true` when the input is a simple string with no structured alternatives, no explicit rationale, and no explicit choice. When `IS_COMPACT` is true:
- Set `CONTEXT` to empty string (template uses `{{#CONTEXT}}...{{/CONTEXT}}` conditional)
- Set `OPTIONS` to empty array (template uses `{{#OPTIONS}}...{{/OPTIONS}}` conditional)
- Set `CHOSEN` to empty string
- Keep `TITLE` and `RATIONALE` distinct: if they are identical, set `RATIONALE` to empty string

This requires ~15 LOC change in the manual decision processing block (around lines 270-332).

**(b) When observations should enrich context vs rationale:**

Currently `REQ-002` (line 375) suppresses ALL observation-type decisions when manual decisions exist. This is correct for preventing duplicate decision records. However, observations that are NOT decision-type should be available to **enrich** the decision's CONTEXT field, not its RATIONALE.

Strategy: After the manual decision loop, scan non-decision observations for narrative text that references the same topic. If found, set `CONTEXT` to a brief enrichment sentence (max 120 chars) from the most relevant observation. This gives `CONTEXT` a distinct value from `TITLE` when observations provide additional context.

Implementation: Add a post-processing step after line 362 that:
1. Collects non-decision observations: `observations.filter(obs => obs.type !== 'decision')`
2. For each manual decision, fuzzy-matches its TITLE against observation narratives
3. If a match is found, sets `CONTEXT = observation.narrative.substring(0, 120)` (only if it differs from TITLE)

This requires ~20 LOC.

**(c) Minimum viable decision block format:**

Add template conditionals using the `IS_COMPACT` flag:

```mustache
{{#IS_COMPACT}}
### Decision {{INDEX}}: {{TITLE}}
{{#RATIONALE}}
**Rationale**: {{RATIONALE}}
{{/RATIONALE}}
**Confidence**: {{CONFIDENCE}}%
{{/IS_COMPACT}}
{{^IS_COMPACT}}
[... existing full decision block ...]
{{/IS_COMPACT}}
```

This requires ~8 LOC in the template and ~3 LOC in the workflow to set `IS_COMPACT` on the template data.

[INFERENCE: based on decision-extractor.ts data flow and context_template.md structure]

### Finding 5: The CONTEXT field assignment at line 329-332 has a second problem

```typescript
const contextText: string = rationaleFromInput
  ? `${title} -- ${rationaleFromInput.substring(0, 120)}`
  : title;
```

Even when `rationaleFromInput` IS provided, the CONTEXT concatenates title with rationale, creating a value that partially duplicates both TITLE and RATIONALE in the rendered output. The fix should make CONTEXT strictly a "why this decision mattered" brief -- NOT a concatenation of other fields.

Proposed: `CONTEXT = rationaleFromInput ? rationaleFromInput.substring(0, 120) : ''`

When rationale exists, use it directly as CONTEXT (it explains "why"). When rationale is absent, CONTEXT should be empty (the compact block handles this).

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:329-332]

## Ruled Out
- **Deduplication at template level only**: Would require complex mustache conditionals comparing field values, which mustache does not support. Dedup must happen at the extractor level.
- **Removing CONTEXT field entirely**: CONTEXT serves a useful purpose for structured decisions that have genuine context distinct from title/rationale. Removing it would regress rich decisions.

## Dead Ends
None identified this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts` (full file, 624 lines)
- `.opencode/skill/system-spec-kit/templates/context_template.md` (lines 490-570, decision block)
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (lines 1285-1330, template data assembly)

## Assessment
- New information ratio: 1.0
- Questions addressed: ["How can decision rendering avoid 4x text repetition when only keyDecision text is available?"]
- Questions answered: ["How can decision rendering avoid 4x text repetition when only keyDecision text is available?"]

## Reflection
- What worked and why: Reading the extractor end-to-end and tracing each field's value through to the template revealed the exact duplication paths. The problem is not in any single line but in 5 fields all defaulting to the same source text.
- What did not work and why: N/A -- first iteration, direct code reading was the right approach.
- What I would do differently: For the implementation phase, the IS_COMPACT flag should be validated against a test corpus of both string-form and structured-form decisions to ensure the compact block does not suppress useful structure.

## Recommended Next Focus
Analyze trigger phrase extraction pipeline end-to-end to design NLP strategy for extracting meaningful phrases from sessionSummary text.

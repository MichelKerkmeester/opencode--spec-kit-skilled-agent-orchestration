---
title: "Deep-Read of template-renderer.ts and context_template.md: Boilerplate and Observation Rendering"
iteration: 4
focus: "Template Rendering — how empty data produces boilerplate, SUMMARY fallback chain, and OBSERVATION block population"
findings_summary: "template-renderer.ts is a custom Mustache engine (217 lines). When data is empty/missing, variables render as empty strings (no error), inverted sections {{^ARRAY}} render fallback text, and conditional sections {{#ARRAY}} are omitted entirely. The 'Session focused on implementing and testing features' string originates in collect-session-data.ts:873 as a 3-level fallback chain (rawLearning -> observationFallback -> hardcoded string). OBSERVATION blocks are populated by buildObservationsWithAnchors() in file-extractor.ts:330-374, which maps Observation[] objects to detailed records with ANCHOR_ID, TYPE, NARRATIVE, FILES_LIST, and FACTS_LIST. When observations come from JSON-mode buildSessionSummaryObservation(), they produce a single 'feature' type observation with the sessionSummary as both title and narrative (capped at 100/500 chars respectively)."
---

# Iteration 4: Deep-Read of template-renderer.ts and context_template.md

## Focus

Document how the template renderer produces output when data is empty or minimal (JSON-mode scenario). Trace the origin of the "Session focused on implementing and testing features" boilerplate. Map how OBSERVATION blocks in the template are populated from session data.

## Findings

### 1. Template Renderer Architecture (217 lines, Custom Mustache)

`template-renderer.ts` implements a custom Mustache-like template engine in 217 lines. It is NOT the npm `mustache` package. Key components:

- `renderTemplate()` (lines 92-171): Core rendering function with 3 replacement passes
- `populateTemplate()` (lines 176-206): Public API that loads a template file and renders it
- `stripTemplateConfigComments()` (lines 73-87): Post-processing to remove HTML comments

[SOURCE: template-renderer.ts:1-217]

### 2. Three Rendering Passes

The `renderTemplate()` function processes the template in this exact order:

**Pass 1 — Array loops** (`{{#ARRAY}}...{{/ARRAY}}`, lines 97-122):
- If value is a `boolean` true: renders content once
- If value is falsy (null, undefined, false, empty string, empty array): returns `''`
- If value is non-array truthy: renders content once with merged data
- If value is non-empty array: maps each item through content, joining results

**Pass 2 — Inverted sections** (`{{^ARRAY}}...{{/ARRAY}}`, lines 124-131):
- If value is falsy: renders the fallback content
- If value is truthy: returns `''`

**Pass 3 — Variable replacement** (`{{VAR}}`, lines 137-168):
- Missing/null values: warns (unless in `OPTIONAL_PLACEHOLDERS` set) and returns `''`
- Arrays: joins first-key values with commas
- Objects: returns first key's string value
- Booleans: renders as `'Yes'` or `'No'`
- Strings/numbers: returns `String(value)` with mustache escaping

[SOURCE: template-renderer.ts:92-171]

### 3. Critical Implication: Empty Data Produces Empty Strings, Not Errors

When JSON-mode provides minimal data, the template engine silently renders:
- Missing `{{VAR}}` placeholders as empty strings (with a console warning)
- Empty arrays as no content (loop body skipped)
- Inverted sections as their fallback text

This means the rendered memory file will have structural sections (headers, tables) but with empty cells and missing values. For example, `{{MESSAGE_COUNT}}` renders as `""` (empty), `{{TOOL_COUNT}}` renders as `""`, and the `{{#MESSAGES}}...{{/MESSAGES}}` loop produces nothing.

The `{{^MESSAGES}}` inverted section DOES fire, producing:
```
No conversation messages were captured. This may indicate an issue with data collection or the session has just started.
```

[SOURCE: context_template.md:623-628]

### 4. Where "Session focused on implementing and testing features" Originates

This string is a hardcoded fallback at `collect-session-data.ts:873` (NOT in the template). The SUMMARY field is computed via a 3-level fallback chain:

```typescript
const SUMMARY: string = (!isErrorContent && learningIsTopical && rawLearning.length > 0)
  ? rawLearning                                          // Level 1: recentContext.learning
  : observationFallback                                  // Level 2: first 3 observation titles joined by '; '
  || 'Session focused on implementing and testing features.';  // Level 3: hardcoded fallback
```

**Level 1 — rawLearning** (lines 851-862): Uses `(sessionInfo as RecentContextEntry).learning`. In JSON-mode, this is empty because `recentContext` is either absent or has no `.learning` field.

**Level 1 guard — learningIsTopical** (lines 857-862): Even if rawLearning exists, it must contain a word segment from the spec folder name. For example, if spec folder is `012-memory-save-quality-pipeline`, the learning text must contain "memory", "save", "quality", or "pipeline" (case-insensitive). Non-topical learning is rejected.

**Level 1 guard — isErrorContent** (lines 852-854): If rawLearning matches API error patterns, it is rejected.

**Level 2 — observationFallback** (lines 863-869): Takes the first 3 non-followup observation titles, joined by '; '. If there are no non-followup observations, falls back to any observation titles. If there are no observations at all, this is an empty string.

**Level 3 — hardcoded string** (line 873): `'Session focused on implementing and testing features.'` — fires when both rawLearning and observationFallback are empty/falsy.

In JSON-mode with good data, Level 2 should fire because `buildSessionSummaryObservation()` creates an observation from `sessionSummary`, giving it a title. The hardcoded fallback fires when JSON input has NEITHER learning data NOR observations with titles.

[SOURCE: collect-session-data.ts:851-873]

### 5. The SUMMARY Flows into the Template as {{SUMMARY}}

The SUMMARY string is returned in the collected session data at line 1022:
```typescript
return {
  ...
  SUMMARY,          // line 1022
  ...
}
```

This maps to `{{SUMMARY}}` in the template at line 335:
```markdown
## {{#HAS_IMPLEMENTATION_GUIDE}}2{{/HAS_IMPLEMENTATION_GUIDE}}... OVERVIEW

{{SUMMARY}}
```

[SOURCE: collect-session-data.ts:1022, context_template.md:335]

### 6. CONTEXT_SUMMARY Is a Separate Field (Not the Same as SUMMARY)

`CONTEXT_SUMMARY` is generated by `generateContextSummary()` (collect-session-data.ts:571-597) and rendered in the CONTINUE SESSION section at template line 206:

```markdown
### Context Summary

{{CONTEXT_SUMMARY}}
```

The function builds: `**Phase:** ${projectPhase}` + recent observation titles + decision count. In JSON-mode with minimal observations, this produces a terse output like `**Phase:** RESEARCH` with no recent titles.

[SOURCE: collect-session-data.ts:571-597, context_template.md:206]

### 7. How OBSERVATION Blocks Are Populated

The template renders observations in the "DETAILED CHANGES" section (lines 373-396):

```markdown
{{#OBSERVATIONS}}
{{^IS_DECISION}}
<!-- ANCHOR:{{ANCHOR_ID}} -->
### {{TYPE}}: {{TITLE}}

{{NARRATIVE}}

{{#HAS_FILES}}**Files:** {{FILES_LIST}}{{/HAS_FILES}}
{{#HAS_FACTS}}**Details:** {{FACTS_LIST}}{{/HAS_FACTS}}
<!-- /ANCHOR:{{ANCHOR_ID}} -->
{{/IS_DECISION}}
{{/OBSERVATIONS}}
```

The `OBSERVATIONS` array is populated by `buildObservationsWithAnchors()` in `file-extractor.ts:330-374`. This function:

1. Deduplicates observations (merging repeated tool calls on same file)
2. For each observation, produces an `ObservationDetailed` object with:
   - `TYPE`: Uppercase observation type from `detectObservationType()` (e.g., "FEATURE", "IMPLEMENTATION", "DECISION")
   - `TITLE`: `obs.title || 'Observation'`
   - `NARRATIVE`: `obs.narrative || ''`
   - `HAS_FILES`: Boolean from `obs.files && obs.files.length > 0`
   - `FILES_LIST`: Comma-joined file paths
   - `HAS_FACTS`: Boolean from coerced facts length > 0
   - `FACTS_LIST`: Pipe-delimited facts string
   - `ANCHOR_ID`: Generated from title + category + spec number, validated for uniqueness
   - `IS_DECISION`: Boolean, true when observation type is 'decision'

[SOURCE: file-extractor.ts:330-374, context_template.md:373-396]

### 8. JSON-Mode Observations Path

In JSON-mode, observations are built by `input-normalizer.ts` at line 628:

```typescript
if (sessionSummary) {
  observations.push(buildSessionSummaryObservation(sessionSummary, triggerPhrases));
}
```

`buildSessionSummaryObservation()` (input-normalizer.ts:272-289) creates:

```typescript
{
  type: 'feature',
  title: summary.substring(0, 100) + '...',    // truncated at 100 chars
  narrative: summary.substring(0, 500) + '...', // truncated at 500 chars (T09b increased from 200)
  facts: triggerPhrases                          // trigger phrases as facts
}
```

This means in JSON-mode with a sessionSummary:
- ONE observation is created (type 'feature')
- The title is the first 100 chars of sessionSummary
- The narrative is the first 500 chars of sessionSummary
- The observation gets an ANCHOR_ID computed from the title

If the sessionSummary is "Implemented V8 allowlist refinement for cross-phase spec references", the rendered output becomes:

```markdown
### FEATURE: Implemented V8 allowlist refinement for cross-phase spec references

Implemented V8 allowlist refinement for cross-phase spec references

**Details:** trigger-phrase-1 | trigger-phrase-2
```

[SOURCE: input-normalizer.ts:272-289, 628]

### 9. Additional JSON-Mode Observations

Beyond sessionSummary, `input-normalizer.ts` also creates observations from:

- `keyDecisions[]` — each becomes a 'decision' type observation (if present)
- `observations[]` directly from JSON payload — each is passed through as-is
- `technicalContext` — becomes an 'implementation' type observation

However, if the JSON payload only has `sessionSummary` and `specFolder`, only the single feature observation is produced.

[SOURCE: input-normalizer.ts:620-700]

### 10. Template Conditional Section Gating

The entire "DETAILED CHANGES" section is gated by `{{#HAS_OBSERVATIONS}}`:

```markdown
{{#HAS_OBSERVATIONS}}
<!-- ANCHOR:detailed-changes -->
## 2. DETAILED CHANGES
...
{{/HAS_OBSERVATIONS}}
```

`HAS_OBSERVATIONS` is set at collect-session-data.ts:1037:
```typescript
HAS_OBSERVATIONS: OBSERVATIONS_DETAILED.length > 0,
```

So if no observations exist (empty JSON with no sessionSummary, no keyDecisions, no observations array), the entire DETAILED CHANGES section is omitted from the rendered output.

[SOURCE: context_template.md:373-396, collect-session-data.ts:1037]

### 11. OPTIONAL_PLACEHOLDERS Suppress False Warnings

The template renderer's `OPTIONAL_PLACEHOLDERS` set (lines 32-47) contains 16 placeholder names that are intentionally sparse. When these are missing from the data, no warning is logged. This includes: `ANCHOR_ID`, `TYPE`, `NARRATIVE`, `FILES_LIST`, and key file/git counters.

This is important because in JSON-mode, many of these fields are legitimately empty or only populated within loop contexts (e.g., `ANCHOR_ID` is only meaningful inside `{{#OBSERVATIONS}}`).

[SOURCE: template-renderer.ts:32-47]

### 12. The Boilerplate-When-Empty Pattern

When JSON-mode produces minimal data, the rendered template contains:

| Template Section | What Renders |
|-----------------|-------------|
| `{{SUMMARY}}` | "Session focused on implementing and testing features." (hardcoded fallback) |
| `{{CONTEXT_SUMMARY}}` | "**Phase:** RESEARCH" (minimal) |
| `{{#MESSAGES}}` loop | Nothing (empty array) |
| `{{^MESSAGES}}` fallback | "No conversation messages were captured..." |
| `{{#OBSERVATIONS}}` loop | 0-1 observations (only if sessionSummary present) |
| `{{#DECISIONS}}` loop | Nothing, renders `decision_count: 0` fallback |
| `{{#OUTCOMES}}` | "Session in progress" fallback from collect-session-data.ts:1029 |

This pattern means that empty JSON-mode saves produce structurally complete but informationally sparse memories that score poorly on quality metrics.

[SOURCE: collect-session-data.ts:1029, context_template.md:567-572]

## Ruled Out

- Looking for boilerplate text in the template itself — the "Session focused on implementing and testing features" string is NOT in context_template.md; it is in collect-session-data.ts.
- Assuming npm mustache library is used — the renderer is a custom 217-line implementation.

## Dead Ends

None. The template rendering path is straightforward, and the data flow from collect-session-data.ts through to the Mustache rendering is clear.

## Sources Consulted

- `template-renderer.ts:1-217` — Full file: rendering engine implementation
- `context_template.md:1-930` — Full template: all sections, conditionals, fallbacks
- `collect-session-data.ts:571-597` — `generateContextSummary()` function
- `collect-session-data.ts:840-873` — SUMMARY fallback chain
- `collect-session-data.ts:920-1040` — Session data assembly and return object
- `file-extractor.ts:330-374` — `buildObservationsWithAnchors()` function
- `input-normalizer.ts:272-289` — `buildSessionSummaryObservation()` function
- `input-normalizer.ts:620-700` — JSON-mode observation construction path

## Assessment

- New information ratio: 1.0
- Questions addressed: ["How should the template renderer handle JSON-sourced observations vs transcript-sourced ones?", "What is the minimum viable JSON payload that should produce a >= 50/100 quality memory?"]
- Questions answered: ["How should the template renderer handle JSON-sourced observations vs transcript-sourced ones?"]

## Reflection

- What worked and why: Following the grep for "Session focused on" immediately found the origin in collect-session-data.ts:873. Tracing backward from the template placeholders to their data sources in collect-session-data.ts revealed the complete rendering pipeline.
- What did not work and why: Initial assumption that the template might contain the boilerplate string directly was wrong — the template only references `{{SUMMARY}}` and has no hardcoded fallback text.
- What I would do differently: When investigating boilerplate, always start from grep-in-codebase rather than reading the template, since templates only reference variables.

## Recommended Next Focus

Deep-read `quality-scorer.ts` to understand how the quality score is computed and which dimensions penalize JSON-mode outputs most heavily. This is critical for understanding why JSON-mode saves score low.

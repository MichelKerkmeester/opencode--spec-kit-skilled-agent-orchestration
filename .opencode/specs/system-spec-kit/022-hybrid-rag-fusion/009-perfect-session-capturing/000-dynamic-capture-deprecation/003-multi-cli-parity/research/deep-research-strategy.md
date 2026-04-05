# Deep Research Strategy

## Topic
Root causes of memory save quality issues in generate-context.js

## Key Questions
- [x] Q1: Where in generate-context.js or its template pipeline does the "Decision:" prefix get doubled when keyDecisions entries already start with "Decision:"?
  - ANSWERED: `decision-extractor.ts:213` regex `\d+` requires digits after "Decision", fails to strip `Decision:` (no digit). Template at `context_template.md:478` then prepends another `Decision {{INDEX}}:`.
- [x] Q2: Where does the "--" in decision text get parsed as a separator, causing truncation of decision titles and rationale text?
  - ANSWERED: Same regex on `decision-extractor.ts:213` uses single-character `[-]` match, splitting on any hyphen including CLI flags like `--build`.
- [x] Q3: Why is technicalContext from the JSON input payload not surfaced anywhere in the rendered memory output?
  - ANSWERED: technicalContext is converted to an `implementation` observation via `buildTechnicalContextObservation` (input-normalizer.ts:278-289), but rendering depends on the `HAS_OBSERVATIONS` gate in the template. No dedicated template variable or section exists for technicalContext -- it competes with all other observations for visibility.
- [x] Q4: Why does key_files in the YAML metadata only include 1 of N modified files from filesModified?
  - ANSWERED: `buildKeyFiles` (workflow.ts:639-648) uses post-tree-thinning `effectiveFiles` instead of the raw file list. Tree thinning merges small files into `(merged-small-files)` synthetic entries which are then filtered out, reducing the count.
- [x] Q5: Where is the hardcoded 50% confidence value for decisions, and how should it derive actual confidence from input data?
  - ANSWERED: `0.5` is the intentional base value in `buildDecisionConfidence` (decision-extractor.ts:77,88). String-form keyDecisions make `manualObj` null, so no enrichment signals fire (no alternatives, no explicit choice, no rationale, no tradeoffs, no evidence). All remain at base 0.5 = 50%. Object-form decisions with a `confidence` field DO pass through correctly.

## Known Context
- generate-context.js is the main memory save script at scripts/dist/memory/generate-context.js
- It accepts JSON input via /tmp/save-context-data.json with fields: specFolder, sessionSummary, keyDecisions, filesModified, triggerPhrases, technicalContext
- The script transforms JSON input into MCP-compatible structure, then populates a template
- Issues were observed in a memory file saved to 025-capture-quality-parity (now merged into 016)
- The script pipeline: load data -> detect spec folder -> enrich -> extract -> populate template -> write files
- Template population happens in step 8, using Mustache-style {{VARIABLE}} replacement

## Strategy
1. Start with the decision title double-prefix (Q1) -- trace the decision extraction and template rendering pipeline
2. Then investigate the "--" truncation (Q2) -- likely in the same decision parsing code
3. Check technicalContext handling (Q3) -- see if the JSON field is ever mapped to a template variable
4. Investigate key_files population (Q4) -- trace how filesModified maps to key_files in YAML metadata
5. Find confidence source (Q5) -- search for hardcoded 50% or 0.5 in the decision rendering path

## Next Focus
ALL 5 QUESTIONS ANSWERED. Research is converged. Ready for synthesis into actionable fix plan.

## Defect Summary (5 root causes)
1. **Q1 -- Decision title double-prefix**: Regex at `decision-extractor.ts:213` requires `\d+` after "Decision", fails to strip `Decision:` (no digit). Template then prepends another `Decision {{INDEX}}:`.
2. **Q2 -- Hyphen truncation**: Same regex uses `[-]` single-char match, splitting on any hyphen including `--build`.
3. **Q3 -- technicalContext not rendered**: Converted to generic `implementation` observation, no dedicated template section. Depends on fragile `HAS_OBSERVATIONS` gate.
4. **Q4 -- key_files incomplete**: `buildKeyFiles` uses post-thinning `effectiveFiles` instead of raw file list. Thinning merges small files, reducing count.
5. **Q5 -- 50% confidence**: Base value `0.5` in `buildDecisionConfidence` when string-form keyDecisions provide no enrichment signals. Object-form with `confidence` field works correctly.

## Max Iterations
10

## Convergence Threshold
0.05

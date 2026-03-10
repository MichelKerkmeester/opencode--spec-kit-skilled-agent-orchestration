● Todo added: Create audit plan

● Todo started: plan-audit

● Create session audit plan
  $ cat >
  '/Users/michelkerkmeester/.copilot/session-state/8f157332-d498-4719-a5d9-21d8f52099a6/plan.md'
   <<'EOF'
  # Audit Plan
  1. Read the three requested TypeScript files in full....
  └ 7 lines...

● Todo completed: plan-audit

● Todo started: read-target-files

● Read .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts
  └ 87 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts
  └ 476 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1-220
  └ 220 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 221-440
  └ 219 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 441-660
  └ 220 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 661-880
  └ 220 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 881-1100
  └ 220 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1101-1320
  └ 220 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1321-1540
  └ 13 lines read

● Grep "_manualDecisions|userPrompts|observations"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts)
  └ 8 lines found

● Grep "rawUserPrompts|filteredUserPrompts|filteredSummary|filteredObservations|filteredNarrativeObs
ervations|extractConversations\(|extractDecisions\(|extractDiagrams\(|generateImplementationSummary\
(|extractFileChanges\(|populateTemplate\(|indexMemory\(|_manualDecisions"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 20 lines found

● Grep "filterContamination|FilterResult|removedPhrases|hadContamination|cleanedText"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts)
  └ 14 lines found

● Todo completed: read-target-files

● Todo started: analyze-data-flow

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 734-852
  └ 119 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts lines 118-272
  └ 155 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts lines 42-78
  └ 37 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 869-907
  └ 39 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1024-1077
  └ 54 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1264-1276
  └ 13 lines read

● Todo completed: analyze-data-flow

● Todo completed: deliver-findings

Filtering runs before the extractor fan-out and the rewritten `collectedData` does feed `extractConversations` / `extractDecisions` / `extractDiagrams`; the findings below are the places where that guarantee breaks.

### FINDING-01: Manual decisions bypass contamination cleaning
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:734-792`; `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:118-258`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `runWorkflow()` cleans `userPrompts`, `SUMMARY`, and `observations` before extraction, but it never sanitizes `_manualDecisions`. `extractDecisions()` reads `_manualDecisions` first and returns from that branch, so contaminated manual decision text can flow straight into `DECISIONS`.
- **Expected Behavior:** All text sources consumed by `extractDecisions()` should be cleaned before decision extraction, including `_manualDecisions` and nested string fields inside manual decision objects.
- **Root Cause:** The workflow sanitation pass only rewrites part of `collectedData`, while `extractDecisions()` has a separate high-priority input channel that bypasses that rewrite.
- **Suggested Fix:** Sanitize `_manualDecisions` before the `Promise.all` block, or add a shared recursive contamination-cleaning pass inside `extractDecisions()` for `decision`, `title`, `rationale`, `reasoning`, `chosen`, `options`, and `alternatives`.

### FINDING-02: Observation filtering only covers `_provenance` records
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:743-763,804-825,898-905`; `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:260-272`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `cleanObservations()` returns any observation without `_provenance` unchanged. Those untouched observations are then used by downstream extraction and summarization paths, including decision extraction and semantic summary/file-change generation.
- **Expected Behavior:** Contamination filtering should apply to all observation text that feeds downstream processors, not just provenance-tagged observations.
- **Root Cause:** The cleanup gate is tied to provenance metadata, which is not a reliable indicator of whether the text contains orchestration chatter.
- **Suggested Fix:** Remove the `_provenance` short-circuit and clean all observation `title` / `narrative` / `facts` fields; if any source truly must be exempt, use an explicit allowlist with comments documenting why.

### FINDING-03: Cleaned records are retained instead of being excluded
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:42-78`; `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:769-802,804-852,869-907,1025-1076,1274`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** `filterContamination()` only returns cleaned text plus flags, and `workflow.ts` maps that text back onto the original records. Prompts/observations that become empty or near-empty are still passed into extractors, later summary generation, template rendering, and memory indexing.
- **Expected Behavior:** Fully scrubbed records should be dropped before downstream processing, or the workflow should explicitly treat them as excluded items.
- **Root Cause:** The workflow ignores `removedPhrases` and does no item-level pruning after cleaning; it only preserves a global `hadContamination` flag.
- **Suggested Fix:** After cleaning, filter out empty `userPrompts`, empty facts, and observations whose meaningful fields are blank; optionally extend `FilterResult` with a `shouldDrop` or `isMeaningful` flag.

### SUMMARY - Total: 3, Critical: 0, High: 2, Medium: 1, Low: 0


Total usage est:        1 Premium request
API time spent:         3m 5s
Total session time:     3m 17s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 382.4k in, 11.5k out, 310.3k cached (Est. 1 Premium request)

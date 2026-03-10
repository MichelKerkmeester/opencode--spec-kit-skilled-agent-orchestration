● SQL: Create audit todos
  └ 0 row(s) inserted.

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 451-620
  └ 170 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 621-780
  └ 160 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 781-900
  └ 120 lines read

● Todo started: read-workflow-range

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 466-473
  └ 8 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 515-521
  └ 7 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 596-630
  └ 35 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 686-716
  └ 31 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 743-763
  └ 21 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 804-850
  └ 47 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 855-900
  └ 46 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 533-542
  └ 10 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 765-792
  └ 28 lines read

● Todo completed: analyze-workflow-range

### FINDING-01: Unsafe `FILE_PATH` dereference can abort stateless enrichment
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:466-473,515-521`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** The dedupe setup accepts either `FILE_PATH` or `path`, but the actual filter uses `f.FILE_PATH.toLowerCase()`. If a spec/git file entry only has `path`, enrichment throws before merging files.
- **Expected Behavior:** File deduplication should consistently normalize `FILE_PATH || path` and tolerate missing values.
- **Root Cause:** Inconsistent path handling between `existingPaths` construction and `newFiles` filtering.
- **Suggested Fix:** Extract a shared normalizer like `getNormalizedFilePath(f)` and use it in both places, skipping entries with no usable path.

### FINDING-02: Enrichment failures return partially mutated state
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:458-544`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `enriched` is mutated incrementally, then any thrown error is caught and downgraded to a warning. The function returns whatever partial merges happened before the exception.
- **Expected Behavior:** Enrichment should be atomic per source, or failures should be surfaced with a structured degraded-state signal.
- **Root Cause:** In-place mutation is combined with a broad catch that suppresses all errors.
- **Suggested Fix:** Build spec/git merge results in temporary objects and only assign to `enriched` after each merge succeeds; alternatively catch per-source and tag degradation explicitly.

### FINDING-03: `loadDataFn` inputs are incorrectly treated as stateless live-session data
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:564-570,580-588,600,681-684`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** When callers provide `loadDataFn`, `isStatelessMode` still becomes `true`, so custom-loaded data is subjected to alignment blocking and stateless enrichment.
- **Expected Behavior:** Stateless mode should only apply when data comes from the live session capture path, not any non-file source.
- **Root Cause:** `const isStatelessMode = !activeDataFile && !preloadedData;` ignores `loadDataFn` and actual source provenance.
- **Suggested Fix:** Derive stateless mode from the original source choice (`!dataFile && !preloadedData && !loadDataFn`) or carry explicit source metadata from the loader.

### FINDING-04: Alignment checks can crash on null observation entries
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:612-614,699-701`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Both alignment scans call `.flatMap((obs) => obs.files || [])` without guarding `obs`. A null/undefined observation crashes the workflow before extraction starts.
- **Expected Behavior:** Alignment scans should be null-safe, especially since later code already treats observations as possibly absent.
- **Root Cause:** The alignment logic assumes every observation entry is a valid object.
- **Suggested Fix:** Use `obs?.files || []` and filter to strings before keyword matching.

### FINDING-05: Contamination cleaning skips non-provenanced observations
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:743-763`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `cleanObservations` immediately returns any observation without `_provenance`, leaving its `title`, `narrative`, and `facts` unsanitized.
- **Expected Behavior:** All observation text that can influence extraction or summary generation should be cleaned, unless a source is explicitly trusted and documented.
- **Root Cause:** `_provenance` is used as a prerequisite for cleaning instead of as metadata about the source.
- **Suggested Fix:** Sanitize textual fields for every observation, and use provenance only for logging/diagnostics if needed.

### FINDING-06: Parallel extraction loses error context and discards successful branch results
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:804-852`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** A failure in any extractor/renderer rejects the entire `Promise.all`, so successful results from the other branches are lost and the thrown error lacks branch-specific context.
- **Expected Behavior:** Optional branches should fail independently, or failures should at least identify which extractor failed.
- **Root Cause:** Raw `Promise.all` is used without per-branch error wrapping or `allSettled` handling.
- **Suggested Fix:** Wrap each branch with contextual error messages, and consider `Promise.allSettled` for non-critical branches like diagrams/flowchart generation.

### FINDING-07: Use-case titles are malformed for nested and double-dash spec folders
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:836-847`
- **Severity:** LOW
- **Category:** BUG
- **Current Behavior:** `useCaseTitle` is derived from the full relative `specFolderName` and only strips `^\d+-`, producing malformed titles for nested specs and names like `02--system-spec-kit`.
- **Expected Behavior:** The title should come from the leaf folder name and strip both `NNN-` and `NNN--` prefixes consistently.
- **Root Cause:** The code uses the whole relative path and a narrower regex than the rest of the workflow.
- **Suggested Fix:** Build the title from `path.basename(specFolderName).replace(/^\d+--?/, '')` before replacing hyphens with spaces.

### FINDING-08: Generated flowchart payload still reports “no workflow diagram”
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:839-842`
- **Severity:** LOW
- **Category:** DESIGN
- **Current Behavior:** The workflow always returns `WORKFLOW_FLOWCHART`, but also hard-codes `HAS_WORKFLOW_DIAGRAM: false`.
- **Expected Behavior:** The presence flag should reflect the generated flowchart, or the field should be renamed if it only refers to source-authored diagrams.
- **Root Cause:** The payload mixes generated-diagram data with a hard-coded absence boolean.
- **Suggested Fix:** Derive the flag from the generated flowchart output, or split it into separate fields for generated vs. source diagrams.

### FINDING-09: `TOOL_COUNT` is rewritten with file count, corrupting scoring semantics
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:855-864`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** In stateless mode, a zero/invalid `TOOL_COUNT` is replaced with `collectedData.FILES.length`, turning “tool usage count” into “enriched file count”.
- **Expected Behavior:** `TOOL_COUNT` should remain a true tool-usage metric; validators should handle stateless enrichment explicitly instead of falsifying the value.
- **Root Cause:** The code patches a downstream validation symptom rather than fixing the metric/validator contract.
- **Suggested Fix:** Add a separate stateless-enrichment indicator or adjust the validator to understand synthetic file coverage without overloading `TOOL_COUNT`.

### FINDING-10: Semantic summary reintroduces synthetic observations that were excluded from narrative use
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:533-537,794-802,866-900`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `_narrativeObservations` removes `_synthetic` items for narrative use, but `generateImplementationSummary` is fed `collectedData.observations`, not the narrative-safe observation set.
- **Expected Behavior:** Narrative/semantic summary generation should use the same filtered observation set as other narrative-oriented extraction.
- **Root Cause:** The semantic summary stage reads the raw observations array instead of `narrativeCollectedData.observations`.
- **Suggested Fix:** Pass `narrativeCollectedData.observations` to `generateImplementationSummary`, or separate coverage-only observations from narrative observations at the type level.

### SUMMARY - Total: 10, Critical: 0, High: 2, Medium: 6, Low: 2


Total usage est:        1 Premium request
API time spent:         4m 49s
Total session time:     4m 59s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 200.3k in, 18.7k out, 166.9k cached (Est. 1 Premium request)

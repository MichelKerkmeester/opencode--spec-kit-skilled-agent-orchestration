● Todo added: Set up audit context

● Route skill and create plan
  $ python3 .opencode/scripts/skill_advisor.py "Audit TypeScript data flow across
  file-extractor.ts, collect-session-data.ts, and workflow.ts for FileChange interface
  alignment, action field preservation, dedup result consumption, and MAX_FILES truncation"
  --threshold 0.8 && mkdir -p
  '/Users/michelkerkmeester/.copilot/session-state/ed4c1132-ef31-4420-a973-d1a5a03b5a96' && cat ...
  └ 9 lines...

● Todo started:

● Read .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts
  └ 443 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ 1 line read

● Grep "FileChange|extractFilesFromData|enhanceFilesWithSemanticDescriptions|MAX_FILES|filesModified
|FILES|ACTION|dedup|deduplicate|semanticFileChanges|collectSessionData|runWorkflow"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts)
  └ 28 lines found

● Grep "FileChange|extractFilesFromData|enhanceFilesWithSemanticDescriptions|MAX_FILES|filesModified
|FILES|ACTION|dedup|deduplicate|semanticFileChanges|collectSessionData|runWorkflow"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 54 lines found

● Count lines in target files
  $ wc -l '.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts'
  '.opencode/skill/system-spec-kit/scripts/core/workflow.ts'
  └ 4 lines...

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 1-220
  └ 220 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 221-440
  └ 220 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 441-660
  └ 220 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 661-857
  └ 197 lines read

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

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1101-1333
  └ 233 lines read

● Todo completed: read-target-files, write-findings

### FINDING-01: FILES input contract is not aligned across the pipeline
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:57-67; .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:135-148; .opencode/skill/system-spec-kit/scripts/core/workflow.ts:467-474,515-522`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** `extractFilesFromData()` accepts incoming `FILES` items with optional `ACTION/action`, but `CollectedDataFull.FILES` does not declare either field. `workflow.ts` also manipulates `collectedData.FILES` through that weaker type, so the compiler does not enforce action-aware handling on the main pipeline input.
- **Expected Behavior:** The same file-entry contract should be used end-to-end so `ACTION` is part of the typed pipeline everywhere it can appear.
- **Root Cause:** The codebase defines multiple inline file-entry shapes instead of reusing a single shared upstream interface.
- **Suggested Fix:** Replace the inline `CollectedDataFull.FILES` type with a shared exported type that includes `ACTION/action`, `DESCRIPTION/description`, and provenance fields, then use that shared type in both `collect-session-data.ts` and `workflow.ts`.

### FINDING-02: Structured ACTION is overwritten during semantic enhancement
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:283-319; .opencode/skill/system-spec-kit/scripts/core/workflow.ts:903-910`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** After `collectSessionData()` produces `sessionData.FILES`, `workflow.ts` calls `enhanceFilesWithSemanticDescriptions()`, which always writes `ACTION: normalizeFileAction(info.action)` on a semantic match. That overwrites any upstream structured action already extracted from `collectedData.FILES`.
- **Expected Behavior:** A reliable structured action from the input pipeline should be preserved; semantic inference should only fill gaps or refine clearly-generic placeholders.
- **Root Cause:** `enhanceFilesWithSemanticDescriptions()` treats semantic summarizer output as authoritative and does not compare it against `file.ACTION` before replacing it.
- **Suggested Fix:** Preserve the existing action by default, e.g. only set `ACTION` when `file.ACTION` is missing, or require an exact-path match plus a stronger-confidence rule before overriding.

### FINDING-03: Workflow-level dedup drops duplicate file rows before the extractor can merge them correctly
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:466-474,514-522; .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:147-207,217-233`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `enrichStatelessData()` filters out `specContext.FILES` and `gitContext.FILES` rows when a same-path entry already exists. Those duplicate rows never reach `extractFilesFromData()`, so its merge logic cannot choose the better description, preserve a richer `ACTION`, or combine provenance/synthetic flags.
- **Expected Behavior:** Duplicate file rows from live/spec/git sources should be merged using the extractor’s canonical merge rules, not discarded earlier by a simpler raw-path filter.
- **Root Cause:** Deduplication happens too early in `workflow.ts` with `existingPaths`, bypassing the richer merge behavior implemented in `addFile()`.
- **Suggested Fix:** Concatenate all file sources and let `extractFilesFromData()` own deduplication, or move the same merge policy into `enrichStatelessData()` so duplicates are merged rather than dropped.

### FINDING-04: MAX_FILES truncation happens too early in the pipeline
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:256-267; .opencode/skill/system-spec-kit/scripts/core/workflow.ts:903-929`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `extractFilesFromData()` truncates to `CONFIG.MAX_FILES_IN_MEMORY` before semantic enhancement and before tree thinning. Any file beyond that cap is lost permanently, even though later stages could have improved its description/action or folded it into a compact merged entry.
- **Expected Behavior:** Final trimming should occur after semantic enhancement and thinning, when the pipeline knows which rows are most valuable to keep.
- **Root Cause:** The hard cap is enforced in the extraction stage instead of at the end of file-processing.
- **Suggested Fix:** Move MAX_FILES enforcement to `workflow.ts` after `effectiveFiles` is computed, or return overflow metadata from `extractFilesFromData()` so later stages can trim with full context.

### FINDING-05: FILE_COUNT can become stale after thinning changes the final FILES array
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:802-804; .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1025-1036`
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** `collectSessionData()` sets `FILE_COUNT` from the pre-thinning `FILES.length`. `workflow.ts` later replaces `FILES` with `effectiveFiles` and updates `HAS_FILES`, but does not override `FILE_COUNT`, so downstream template data can report a count that no longer matches the actual rendered file list.
- **Expected Behavior:** `FILE_COUNT` should describe the same `FILES` array that is ultimately passed downstream.
- **Root Cause:** `...sessionData` is spread into the template payload, then `FILES`/`HAS_FILES` are overridden without recomputing `FILE_COUNT`.
- **Suggested Fix:** Override `FILE_COUNT: effectiveFiles.length` when populating templates, or explicitly carry both `RAW_FILE_COUNT` and `EFFECTIVE_FILE_COUNT`.

### SUMMARY - Total: 5, Critical: 0, High: 2, Medium: 2, Low: 1


Total usage est:        1 Premium request
API time spent:         3m 52s
Total session time:     4m 4s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 306.3k in, 14.3k out, 257.0k cached (Est. 1 Premium request)

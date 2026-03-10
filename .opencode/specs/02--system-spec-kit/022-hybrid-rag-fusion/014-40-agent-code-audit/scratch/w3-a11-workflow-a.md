● skill(sk-code--review)

● SQL: Track audit todos
  └ 3 row(s) inserted. Last inserted row ID: 3.

● Read .agents/skills/sk-code--review/README.md lines 1-220
  └ 79 lines read

● Read .agents/skills/sk-code--review/references/quick_reference.md lines 1-220
  └ 151 lines read

● Read .agents/skills/sk-code--review/references/security_checklist.md lines 1-260
  └ 206 lines read

● Read .agents/skills/sk-code--review/references/code_quality_checklist.md lines 1-260
  └ 162 lines read

● Read .agents/skills/sk-code--review/references/solid_checklist.md lines 1-260
  └ 114 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1-220
  └ 220 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 221-450
  └ 230 lines read

● Create session plan file
  $ cat >
  '/Users/michelkerkmeester/.copilot/session-state/a363c0e2-651a-4d02-82f0-0d14b1c1f29c/plan.md'
   <<'EOF'
  # Audit Plan
  1. Read the review skill guidance relevant to security, quality, and design findings....
  └ 5 lines...

● Todo started:

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 95-141
  └ 47 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 205-287
  └ 83 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 297-363
  └ 67 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 366-450
  └ 85 lines read

● Todo started:

● Todo completed: draft-audit-report

### FINDING-01: `injectQualityMetadata` can rewrite non-frontmatter content as YAML
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:384-430`
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** The regex `/---\r?\n([\s\S]*?)\r?\n---/` matches the first triple-dash block anywhere in the document. If the markdown has prose before a later `--- ... ---` block, this function treats that block as frontmatter and rebuilds the document as `${updatedFrontmatter}${newline}${prefix}${suffix}`, which silently reorders/corrupts the content.
- **Expected Behavior:** Only frontmatter at byte 0 should be updated; documents without leading frontmatter should be returned unchanged.
- **Root Cause:** The frontmatter match is not anchored to the start of the file, and the reconstruction path always prepends the rewritten block.
- **Suggested Fix:** Anchor the match to the beginning of the document (`/^---\r?\n.../`) and require `frontmatterMatch.index === 0`, or switch to a dedicated frontmatter parser.

### FINDING-02: Workflow initialization accepts contradictory option combinations
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:66-76`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** `WorkflowOptions` allows `dataFile`, `collectedData`, and `loadDataFn` to be supplied together, plus an optional `collectSessionDataFn`, so callers can construct ambiguous startup states with no type-level indication of which source should win.
- **Expected Behavior:** The workflow entry contract should make valid initialization modes explicit and reject conflicting combinations early.
- **Root Cause:** The initialization surface is modeled as a bag of unrelated optional fields instead of a discriminated union or validated builder.
- **Suggested Fix:** Replace `WorkflowOptions` with a discriminated union such as `{ source: 'file'; dataFile: string } | { source: 'provided'; collectedData: CollectedDataFull } | { source: 'loader'; loadDataFn: ... }` and validate once at workflow entry.

### FINDING-03: Contamination filtering is not encoded as a required pipeline stage
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:12-19,29-31`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Raw extractors and `filterContamination` are imported as peer utilities over the same general data shape, so nothing in this module surface forces callers to filter contaminated data before extraction. The required ordering is therefore a convention, not an enforceable contract.
- **Expected Behavior:** If contamination filtering must always happen before extraction, the pipeline should expose that requirement structurally.
- **Root Cause:** The import/pipeline organization does not distinguish raw vs. filtered collected data, and extractors are not typed against a filtered-only form.
- **Suggested Fix:** Introduce staged types or wrapper APIs such as `filterCollectedData(raw): FilteredCollectedData`, and have extraction helpers accept only the filtered type.

### FINDING-04: Fallback topic/trigger generation leaks path fragments and can return duplicate phrases
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:95-141`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Both fallback helpers tokenize raw `specFolderName` and `path.basename(file.FILE_PATH)` results without normalizing path separators or extracting the final spec-folder segment first. On nested spec paths or Windows-style file paths, generated topics/phrases can include directory fragments like `parent/001` or `c:\src\foo`; `ensureMinTriggerPhrases` can also return duplicates in the `combined.length === 1` branch because it never re-dedupes after adding the fallback phrase.
- **Expected Behavior:** Fallback topics and trigger phrases should be derived from normalized leaf names and returned as distinct, non-empty values.
- **Root Cause:** Path-aware sanitization is skipped in both helpers, and the final fallback branch does not run another normalization/deduplication pass.
- **Suggested Fix:** Normalize separators first, take only the last path segment for both spec folders and file paths, filter blanks, and de-duplicate after adding the fallback phrase.

### FINDING-05: Tree-thinning provenance is silently truncated
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:205-287`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Each merged group appends provenance into `DESCRIPTION`, but both the individual merge note and the accumulated description are hard-capped at 900 characters. Once enough small files merge into one carrier, later provenance is silently dropped even though the function comment explicitly promises recoverability.
- **Expected Behavior:** Merge provenance should remain complete, or overflow should be preserved in additional structured entries rather than being discarded.
- **Root Cause:** An unbounded set of merge details is stored in a single capped summary field.
- **Suggested Fix:** Store merged-child provenance as structured metadata, or emit overflow synthetic entries once the carrier description nears its cap.

### FINDING-06: `extractSpecTitle` is LF-only and hides read/parse failures
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:349-363`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `extractSpecTitle` only matches frontmatter written with `\n`, so CRLF-formatted `spec.md` files fall back to `''`. Any read or parse failure is also swallowed and reduced to an empty title, giving callers no signal that metadata extraction failed unexpectedly.
- **Expected Behavior:** Frontmatter parsing should work across normal line-ending variants, and unexpected failures should surface as a scoped warning or structured error.
- **Root Cause:** The parser uses an LF-only regex and a blanket `catch` that silently returns `''`.
- **Suggested Fix:** Use `\r?\n` (or a real frontmatter parser), and return/log contextual failure information instead of collapsing every error to an empty string.

### FINDING-07: The workflow lock is both too broad and too weak
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:366-382`
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** `withWorkflowRunLock` serializes all workflow runs in the current process through one global promise chain, even when they target unrelated spec folders. At the same time, it provides no protection across separate CLI processes, so true cross-process races are still possible.
- **Expected Behavior:** Locking should be scoped to the contested resource and work across processes if correctness depends on exclusivity.
- **Root Cause:** Concurrency control is implemented as a module-level in-memory queue instead of a resource-scoped filesystem/OS lock.
- **Suggested Fix:** Key locks by spec/context directory and use an inter-process lock file or advisory lock when concurrent processes can touch the same outputs.

### FINDING-08: Memory title helpers do not actually enforce their own max lengths
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:297-346`
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** `truncateMemoryTitle` slices to `maxLength` and then appends `...`, producing strings up to `maxLength + 3`. `buildMemoryDashboardTitle` can also exceed 120 characters because it appends the suffix after truncation and skips validation entirely when the suffix is already present.
- **Expected Behavior:** Returned titles should always fit within the configured maximum, including ellipsis and suffix text.
- **Root Cause:** Length budgeting happens before adding decorations, and the early-return path bypasses the final size check.
- **Suggested Fix:** Reserve room for ellipsis/suffix before truncation and enforce a final `<= maxLength` check on the fully composed title.

### SUMMARY - Total: 8, Critical: 0, High: 1, Medium: 6, Low: 1


Total usage est:        1 Premium request
API time spent:         6m 10s
Total session time:     6m 20s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 283.4k in, 22.3k out, 223.6k cached (Est. 1 Premium request)

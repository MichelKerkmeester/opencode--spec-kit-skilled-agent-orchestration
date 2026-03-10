● Todo added: Read spec and checklist

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md
  └ 197 lines read

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/checklist.md
  └ 126 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/scripts/core/config.ts
  └ 356 lines read

● Todo started: read-specs

● Grep "generatePerFolderDescription|description\.json|ensureDescriptionCache|memorySequence|memoryN
ameHistory|specId|folderSlug|parentChain|description"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 8 lines found

● Grep "description\.json|specId|folderSlug|parentChain|generatePerFolderDescription|ensureDescripti
onCache|SPEC_FOLDER_ARG|specs" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/config.ts)
  └ 4 lines found

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1-120
  └ 120 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1160-1265
  └ 106 lines read

● Grep "ensureUniqueMemoryFilename|generateContextFileName|generate.*FileName|memoryNameHistory|desc
ription.json|generatePerFolderDescription|savePerFolderDescription|loadPerFolderDescription"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 6 lines found

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 900-985
  └ 86 lines read

● Grep "pickBestContentName|normalizeSpecTitleForMemory|pickPreferredMemoryTask|shouldEnrichTaskFrom
SpecTitle|generateContentSlug" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 7 lines found

● Todo started: read-implementation

● Grep "findActiveSpecsDir|getSpecsDirectories|SPEC_FOLDER_ARG|detectSpecFolder|setupContextDirector
y|specFolder" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 62 lines found

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 632-678
  └ 47 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 345-370
  └ 26 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts lines 560-690
  └ 131 lines read

● Grep "function loadPerFolderDescription|const loadPerFolderDescription|export function
loadPerFolderDescription|savePerFolderDescription|generatePerFolderDescription" in **/*.{ts,js}
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit)
  └ 46 lines found

● Grep "specId|folderSlug|parentChain|memorySequence|memoryNameHistory"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 4 lines found

● Todo completed: compare-behavior

● Read .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-spec-descriptions/spec.md lines
  84-166
  └ 83 lines read

### FINDING-01: Workflow never uses per-folder description context when generating memory filenames
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:939-971,1221-1239`
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** The filename is derived from `spec.md` title, task text, and folder basename, then uniquified via `ensureUniqueMemoryFilename()`. `description.json` fields are only touched after the write, where `memorySequence` and `memoryNameHistory` are incremented/appended.
- **Expected Behavior:** Per the spec, workflow-side memory naming should use per-folder description context (`specId`, `folderSlug`, `parentChain`, and tracking fields) as part of the uniqueness mechanism, not just post-write bookkeeping.
- **Root Cause:** There is no pre-write load of `description.json` before `generateContentSlug()` / `ensureUniqueMemoryFilename()`, so the per-folder schema required for naming context is never consulted during name generation.
- **Suggested Fix:** Load or generate the folder’s `description.json` before computing `ctxFilename`, pass its context/tracking data into the naming path, then persist the updated tracking fields after a successful write.

### FINDING-02: Missing or corrupt `description.json` is not regenerated in the workflow save path
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1221-1239`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** If `loadPerFolderDescription()` returns `null`, the workflow skips tracking entirely and leaves the folder without repaired metadata.
- **Expected Behavior:** The spec requires graceful degradation when per-folder metadata is missing and regeneration from `spec.md` on read for corrupted files.
- **Root Cause:** The code handles only the `if (existing)` happy path and never falls back to `generatePerFolderDescription(...)` when the per-folder file is absent or invalid.
- **Suggested Fix:** When `loadPFD()` returns `null`, resolve the containing specs root, regenerate from `spec.md`, save the new `description.json`, and then apply `memorySequence` / `memoryNameHistory` updates.

### FINDING-03: Description tracking failures are silently swallowed instead of logged
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1222-1240`
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Any import/load/save failure inside the description tracking block is ignored by an empty `catch`, so operators get no warning that per-folder metadata updates failed.
- **Expected Behavior:** The spec explicitly calls for “log warning, continue without file” behavior on description write failures.
- **Root Cause:** A broad catch wraps the entire tracking block and suppresses all errors without emitting a warning.
- **Suggested Fix:** Replace the empty catch with explicit warning logging that includes the spec folder and error message, while still treating the failure as non-fatal.

### SUMMARY - Total: 3, Critical: 0, High: 1, Medium: 1, Low: 1


Total usage est:        1 Premium request
API time spent:         2m 36s
Total session time:     2m 46s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 434.1k in, 8.5k out, 332.5k cached (Est. 1 Premium request)

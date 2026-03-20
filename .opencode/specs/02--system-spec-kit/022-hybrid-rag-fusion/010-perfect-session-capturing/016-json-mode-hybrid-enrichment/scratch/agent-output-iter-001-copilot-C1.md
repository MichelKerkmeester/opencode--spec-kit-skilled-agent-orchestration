# Iteration 001 — C1 Code Auditor: V8 Safety Analysis

## Finding 1: Git context is rich, but `enrichFileSourceData()` does not directly inject its observations or FILES
- **Severity**: LOW
- **Location**: `workflow.ts:1178-1186`, `git-context-extractor.ts:47-72,453-498`
- **Evidence**: The explicit skip guard (`// Explicitly SKIP gitContext.observations and gitContext.FILES — V8 safety`) prevents top-level contamination. `gitContext.observations` is never merged, and `gitContext.FILES` is not appended as new FILE entries.
- **Risk**: No direct top-level contamination path exists.
- **Recommendation**: Keep this explicit skip and add/retain tests asserting that for `_source: 'file'`, observation count and FILE count remain unchanged after enrichment.

## Finding 2: Spec-folder context also carries synthetic observations/FILES, but file-source enrichment only consumes safe metadata
- **Severity**: LOW
- **Location**: `workflow.ts:1188-1206`, `spec-folder-extractor.ts:23-40,324-393`
- **Evidence**: `extractSpecFolderContext()` produces synthetic observations and FILES, but `enrichFileSourceData()` does not merge them — only consumes triggerPhrases, decisions, and summary.
- **Risk**: No spec-observation injection occurs in this branch today.
- **Recommendation**: Treat `specContext.observations` and `specContext.FILES` as prohibited inputs for file-backed payloads and codify that with regression tests.

## Finding 3: The shallow copy aliases nested FILE entries, so git description enhancement mutates the original authoritative payload
- **Severity**: HIGH
- **Location**: `workflow.ts:1161,1210-1222`
- **Evidence**: `{ ...collectedData }` is shallow. `enriched.FILES` points at the same array and objects from `collectedData.FILES`. Lines 1214-1222 overwrite `file.DESCRIPTION` and add `file._provenance = 'git'` in place, mutating the original `collectedData`.
- **Risk**: Caller's original payload is modified. If `collectedData` is reused downstream or inspected for pre-enrichment state, results are contaminated.
- **Recommendation**: Clone nested FILE state before mutation: `FILES: collectedData.FILES?.map(f => ({ ...f }))`.

## Finding 4: `enrichStatelessData()` is the real full-merge bypass path if `_source !== 'file'`
- **Severity**: MEDIUM
- **Location**: `workflow.ts:1238-1242,1261-1325,1415-1416,1587-1590`
- **Evidence**: The non-file branch fully merges synthetic spec/git observations and FILES. Normal CLI JSON/data-file flows don't enter stateless enrichment because `isStatelessMode` is false. But if a structured JSON-like payload reaches via custom `loadDataFn`, direct internal use, or bad `_source` tagging, the full merge path becomes a bypass.
- **Risk**: Source classification slip could cause full observation/FILES injection into what should be an authoritative payload.
- **Recommendation**: Enforce an explicit "structured-authoritative payload" guard at the workflow boundary, not just `_source` check.

## Summary
- Total findings: 4
- Critical: 0, High: 1, Medium: 1, Low: 2
- Key insight: The explicit skip guard blocks top-level git/spec observation injection in `enrichFileSourceData()`, but git-derived FILE metadata still mutates existing JSON FILE entries in place via shallow copy aliasing, and the separate non-file stateless branch remains the true bypass path if source classification slips.

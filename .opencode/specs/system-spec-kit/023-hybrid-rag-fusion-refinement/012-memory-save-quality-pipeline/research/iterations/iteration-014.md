# Iteration 14: Design Template Population and Key Files Scoping Fixes

## Focus
Design concrete fixes for: (a) deriving title/description from `sessionSummary`, (b) mapping observations to OBSERVATION template blocks, (c) capping `key_files` at 20, and (d) honoring `filesChanged` from JSON input. These are the core template population issues that cause JSON-mode saves to produce boilerplate or oversized memory files.

## Findings

### 1. Title/Description Derivation Chain (Current State)

The title/description pipeline flows through multiple stages:

**Title pipeline (workflow.ts lines 1116-1165):**
1. `implSummary.task` -- extracted from conversation messages (empty for JSON-mode when no messages)
2. `extractSpecTitle(specFolder)` -- reads spec.md `## Title` heading
3. `shouldEnrichTaskFromSpecTitle()` -- decides if spec title should be used as fallback
4. `pickPreferredMemoryTask()` -- picks best from: `[enrichedTask, specTitle, sessionCandidates, folderBase]`
   - `sessionCandidates` includes `sessionData._JSON_SESSION_SUMMARY`, `QUICK_SUMMARY`, `TITLE`, `SUMMARY`
5. `generateContentSlug()` -- converts to URL-safe slug
6. `buildMemoryTitle()` -- formats final title string

**Key observation:** `sessionData._JSON_SESSION_SUMMARY` IS already in the candidate list at position [0] of `sessionCandidates` (line 1143). The problem is `pickPreferredMemoryTask` calls `pickBestContentName()` which selects the longest non-empty candidate that is not a generic stub. If `implSummary.task` is non-empty (even if low quality), it wins because it is the first argument.

**Description pipeline (workflow.ts line 1169-1172):**
```typescript
const memoryDescription = deriveMemoryDescription({
  summary: sessionData.SUMMARY,
  title: memoryTitle,
});
```
This uses `SUMMARY` which for JSON-mode comes from `collectedData.sessionSummary` (via collect-session-data.ts line 1034: `_JSON_SESSION_SUMMARY`). If `sessionSummary` was propagated to `SUMMARY`, the description should already be populated. But if `enrichCapturedSessionData` overwrites SUMMARY with spec context (line 514), the original sessionSummary may be lost.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1116-1172]
[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:36-49]

### 2. Design Fix: Title Derivation from sessionSummary

**Problem:** When JSON-mode provides `sessionSummary`, `implSummary.task` (extracted from conversation messages that don't exist) may still return a non-empty but low-quality string (e.g., from enrichment fallbacks), and `pickPreferredMemoryTask` prefers it over the JSON session summary.

**Proposed fix in workflow.ts around line 1138:**

```typescript
// For JSON-mode (file source), prefer sessionSummary as primary task candidate
const jsonSessionSummary = sessionData._JSON_SESSION_SUMMARY || '';
const preferredMemoryTask = pickPreferredMemoryTask(
  // RC1-fix: When JSON sessionSummary is present and enrichedTask is generic,
  // swap priority so sessionSummary is evaluated first
  (jsonSessionSummary.length > 20 && isGenericTask(enrichedTask))
    ? jsonSessionSummary
    : enrichedTask || '',
  specTitle,
  folderBase,
  [
    jsonSessionSummary,
    sessionData.QUICK_SUMMARY || '',
    sessionData.TITLE || '',
    sessionData.SUMMARY || '',
  ],
  allowSpecTitleFallback
);
```

Where `isGenericTask()` checks for patterns like "Development session", empty strings, or folder-name-derived stubs. This preserves the existing priority for captured sessions while giving JSON-mode the benefit of its explicit sessionSummary.

**Estimated LOC:** ~10 lines (add helper + modify call site).

### 3. Observation Mapping to OBSERVATION Template Blocks (Current State)

The observation pipeline works as follows:

1. **Input:** `collectedData.observations` -- array of `Observation` objects with `{title, narrative, facts, type, files, _synthetic, _provenance}`
2. **Truncation:** Capped at `CONFIG.MAX_OBSERVATIONS` (collect-session-data.ts line 808), with followup observations prioritized
3. **Anchor assignment:** `buildObservationsWithAnchors()` adds `ANCHOR_ID`, `TYPE`, `NARRATIVE`, `FILES_LIST` fields to create `ObservationDetailed[]`
4. **Template binding:** Bound as `OBSERVATIONS: OBSERVATIONS_DETAILED` and `HAS_OBSERVATIONS` in session data (line 1036-1037)
5. **Contamination cleaning:** `cleanObservations()` in workflow.ts (line 753-781) runs contamination filter on title/narrative/facts

**JSON-mode gap:** When JSON payload provides `observations` as a simple array of strings (e.g., `["Fixed the bug in parser", "Updated tests"]`), the `Observation` type expects objects with `{title, narrative, type}`. If the input normalizer does not coerce strings to Observation objects, the pipeline produces empty observation blocks.

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:794-808, 932-1037]
[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:753-781]

### 4. Design Fix: Observation Mapping for JSON Mode

**Proposed fix in the input normalizer or collect-session-data.ts:**

Add a coercion step before the observation pipeline:

```typescript
// Normalize observations: coerce strings to Observation objects
observations = observations.map((obs) => {
  if (typeof obs === 'string') {
    return {
      title: obs.length > 80 ? obs.slice(0, 77) + '...' : obs,
      narrative: obs,
      type: 'implementation' as const,
      facts: [],
      files: [],
    };
  }
  return obs;
});
```

**Where to place this:** In `collect-session-data.ts` immediately after line 794 (`let observations: Observation[] = data.observations || [];`), before the truncation at line 795.

**Template rendering consideration:** The `buildObservationsWithAnchors()` function needs the `title` field to generate meaningful anchors. With the string coercion above, each observation gets a title derived from the string content.

**Estimated LOC:** ~12 lines.

### 5. Key Files Capping (Current State and Fix)

**Current state in `buildKeyFiles()` (workflow-path-utils.ts lines 99-109):**

```typescript
export function buildKeyFiles(effectiveFiles: FileChange[], specFolderPath: string): Array<{ FILE_PATH: string }> {
  const explicitKeyFiles = effectiveFiles
    .filter((file) => !file.FILE_PATH.includes('(merged-small-files)'))
    .map((file) => ({ FILE_PATH: file.FILE_PATH }));

  if (explicitKeyFiles.length > 0) {
    return explicitKeyFiles;
  }

  return listSpecFolderKeyFiles(specFolderPath);
}
```

**Problem:** There is NO cap. If `effectiveFiles` has 300 entries (common for large sessions with enrichment from git context and spec-folder scanning), all 300 become `KEY_FILES` in the template. This bloats the rendered memory file and wastes embedding tokens.

**Design fix:**

```typescript
const MAX_KEY_FILES = 20;

export function buildKeyFiles(effectiveFiles: FileChange[], specFolderPath: string): Array<{ FILE_PATH: string }> {
  const explicitKeyFiles = effectiveFiles
    .filter((file) => !file.FILE_PATH.includes('(merged-small-files)'))
    .map((file) => ({ FILE_PATH: file.FILE_PATH }));

  if (explicitKeyFiles.length > 0) {
    // Prioritize non-synthetic, non-spec-folder files (actual session changes)
    const prioritized = [
      ...explicitKeyFiles.filter(f => {
        const orig = effectiveFiles.find(ef => ef.FILE_PATH === f.FILE_PATH);
        return orig && !orig._synthetic && orig._provenance !== 'spec-folder' && orig._provenance !== 'git';
      }),
      ...explicitKeyFiles.filter(f => {
        const orig = effectiveFiles.find(ef => ef.FILE_PATH === f.FILE_PATH);
        return orig && (orig._provenance === 'git');
      }),
      ...explicitKeyFiles.filter(f => {
        const orig = effectiveFiles.find(ef => ef.FILE_PATH === f.FILE_PATH);
        return orig && (orig._synthetic || orig._provenance === 'spec-folder');
      }),
    ];
    // Deduplicate (files may appear in multiple priority tiers due to filter overlap)
    const seen = new Set<string>();
    const deduped = prioritized.filter(f => {
      if (seen.has(f.FILE_PATH)) return false;
      seen.add(f.FILE_PATH);
      return true;
    });
    return deduped.slice(0, MAX_KEY_FILES);
  }

  return listSpecFolderKeyFiles(specFolderPath).slice(0, MAX_KEY_FILES);
}
```

**Priority order rationale:**
1. **Session-captured files** (files the user/agent actually touched) -- most relevant
2. **Git-derived files** (changed in git but not captured in session) -- contextually relevant
3. **Synthetic/spec-folder files** (enrichment additions) -- least relevant

**Estimated LOC:** ~25 lines (replace function body).

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow-path-utils.ts:99-109]

### 6. Honoring filesChanged from JSON Input

**Current state:** The JSON payload schema supports `FILES` as an array of `{FILE_PATH, DESCRIPTION, ACTION}` objects (via `extractFilesFromData` in file-extractor.ts). However, there is no `filesChanged` field in the schema -- the JSON input uses `FILES` directly.

Searching the entire codebase for `filesChanged` returns zero matches. This means either:
- The JSON schema was designed with `FILES` (not `filesChanged`) as the field name
- Or `filesChanged` is a planned but unimplemented field

**Design clarification needed:** If the JSON payload uses `filesChanged` as the field name (different from internal `FILES`), the input normalizer must map it:

```typescript
// In input-normalizer.ts or data-loader.ts
if (data.filesChanged && !data.FILES) {
  data.FILES = data.filesChanged.map((fc: { path: string; description?: string; action?: string }) => ({
    FILE_PATH: fc.path,
    DESCRIPTION: fc.description || '',
    ACTION: fc.action || 'Modified',
  }));
}
```

**If `filesChanged` is the canonical JSON field name:** Add this mapping in the normalizer before `extractFilesFromData` runs. The `FILES` field from JSON is already handled by `extractFilesFromData` (file-extractor.ts line 96-180).

**If the caller already provides `FILES`:** No change needed -- the pipeline already processes it.

**Estimated LOC:** 8-12 lines in normalizer if mapping is needed.

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:96-180]
[INFERENCE: based on zero codebase matches for "filesChanged" -- field may need to be defined in JSON schema]

### 7. Summary of All Proposed Changes

| Component | File | Change | LOC Est. | Risk |
|-----------|------|--------|----------|------|
| Title derivation | workflow.ts | Prefer sessionSummary over generic task for JSON-mode | ~10 | Low -- guarded by isGenericTask check |
| Observation coercion | collect-session-data.ts | Coerce string observations to Observation objects | ~12 | Low -- additive, existing objects pass through |
| Key files cap | workflow-path-utils.ts | Add MAX_KEY_FILES=20 with priority-based selection | ~25 | Medium -- changes output for large sessions |
| filesChanged mapping | input-normalizer.ts | Map `filesChanged` to `FILES` if field exists | ~10 | Low -- conditional mapping, no regression path |
| **Total** | | | **~57** | |

## Ruled Out

- **Changing the template itself to cap key_files**: The template (`context_template.md`) uses `{{#KEY_FILES}}` loop. Capping in the template would require Mustache logic that does not exist. Capping must happen in the data layer.
- **Removing observation type coercion and requiring structured input**: This would break the JSON-mode contract where simple string arrays should work.

## Dead Ends

- **`filesChanged` as existing field**: Confirmed it does not exist in the codebase. This is a new field that needs to be defined if it will be part of the JSON schema, or the caller should use the existing `FILES` field.

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1116-1172` (title pipeline, template population)
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1270-1345` (buildKeyFiles call, template data assembly)
- `.opencode/skill/system-spec-kit/scripts/core/workflow-path-utils.ts:99-109` (buildKeyFiles implementation)
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:794-808, 932-1037` (observation handling, OBSERVATIONS binding)
- `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:96-180` (extractFilesFromData, FILE normalization)
- `.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:36-49` (pickPreferredMemoryTask)
- `.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:97` (deriveMemoryDescription)

## Assessment
- New information ratio: 0.85
- Questions addressed: ["How should the template renderer handle JSON-sourced observations vs transcript-sourced ones?", "What key_files scoping strategy prevents 300+ entry lists while preserving useful file references?"]
- Questions answered: ["How should the template renderer handle JSON-sourced observations vs transcript-sourced ones?", "What key_files scoping strategy prevents 300+ entry lists while preserving useful file references?"]

## Reflection
- What worked and why: Tracing the full data flow from JSON input through collect-session-data.ts to workflow.ts template assembly revealed that most of the plumbing exists but has gaps at specific coercion points. The title pipeline already considers `_JSON_SESSION_SUMMARY` but loses priority to lower-quality candidates.
- What did not work and why: Searching for `filesChanged` across the codebase confirmed it is a proposed rather than existing field. This is actually useful information -- it clarifies that the JSON schema needs a design decision about whether to use `FILES` (existing) or introduce `filesChanged` (new).
- What I would do differently: Read the JSON schema definition or input normalizer types first to confirm field names before designing mappings.

## Recommended Next Focus
Integration analysis: how do the V8 fix (iteration 013) and template fixes (this iteration) interact? Do the scattered-reference relaxation and the key_files cap create any compound effects on quality scoring?

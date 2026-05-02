---
title: "session-extractor.ts and file-extractor.ts: Session Metadata Generation in JSON Mode"
iteration: 8
focus: "Map how session metadata (title, description, contextType) is generated. Find the source of the generic 'Session focused on...' text. Document key_files enumeration logic that produces 300+ entries."
findings_summary: "TITLE is always derived from folder basename at collect-session-data.ts:1017, never from JSON sessionSummary. SUMMARY cascades through 3 fallbacks (collect-session-data.ts:870-873): rawLearning -> observationFallback -> 'Session focused on implementing and testing features.' -- the generic text fires when observations lack titles AND rawLearning is empty or non-topical. contextType honors explicit JSON input since RC5 fix (session-extractor.ts:601-606) but detectContextType() defaults to 'general' when toolCounts are all zero (line 126). key_files 300+ problem: buildKeyFiles() falls through to listSpecFolderKeyFiles() when effectiveFiles is empty; the recursive walk has no cap and collects all .md/.json files. file-extractor.ts extractFilesFromData() caps FILES at MAX_FILES_IN_MEMORY=10 (config.ts:232) but this only applies to the main FILES list, not KEY_FILES."
---

# Iteration 8: session-extractor.ts and file-extractor.ts -- Session Metadata Generation

## Focus
Deep-read `session-extractor.ts` and `file-extractor.ts`. Map how session metadata (title, description, contextType) is generated. Find the source of the generic "Session focused on..." text. Document the key_files enumeration logic that produces 300+ entries.

## Findings

### 1. TITLE Generation -- Always From Folder Name (collect-session-data.ts:1017)

The session `TITLE` is constructed at collect-session-data.ts:1017:

```typescript
TITLE: path.basename(folderName).replace(/^\d{3}-/, '').replace(/-/g, ' '),
```

This takes the spec folder basename (e.g., `012-memory-save-quality-pipeline`), strips the leading 3-digit number prefix, and replaces hyphens with spaces: `"memory save quality pipeline"`.

**Problem:** The JSON payload's `sessionSummary` is never used for TITLE. Even when the AI provides a rich, descriptive sessionSummary like "Implemented ESM module compliance fixes for the shared parsing layer", the TITLE will always be the mechanical folder name derivative. The `sessionSummary` IS passed through as `_JSON_SESSION_SUMMARY` (line 1034) and used as a title candidate in `pickPreferredMemoryTask()` at workflow.ts:1143, but this only affects `MEMORY_TITLE` in the frontmatter, not the session TITLE used in the template body.

[SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1017`]
[SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1034`]

### 2. SUMMARY Fallback Chain -- Source of "Session focused on..." (collect-session-data.ts:851-873)

The SUMMARY is built through a 3-stage fallback at lines 851-873:

```typescript
const rawLearning = (sessionInfo as RecentContextEntry).learning || '';
const isErrorContent = /\bAPI\s+Error:\s*\d{3}\b/i.test(rawLearning) || ...;
const learningIsTopical = (() => {
  if (!folderName || rawLearning.length === 0) return rawLearning.length > 0;
  const segments = folderName.split('/').map(s => s.replace(/^\d+--?/, '').trim().toLowerCase())
    .filter(s => s.length > 2);
  const lowerLearning = rawLearning.toLowerCase();
  return segments.some(segment => lowerLearning.includes(segment));
})();

const SUMMARY: string = (!isErrorContent && learningIsTopical && rawLearning.length > 0)
  ? rawLearning                          // Fallback 1: rawLearning (if valid and topical)
  : observationFallback                   // Fallback 2: observation titles joined by '; '
  || 'Session focused on implementing and testing features.';  // Fallback 3: GENERIC TEXT
```

**Cascade path in JSON mode:**
1. `rawLearning` comes from `sessionInfo.learning` -- a field from the RecentContext API. In JSON mode, `sessionInfo` is typically the first element of the `recentContext[]` array in the captured data. If no `recentContext` is provided in the JSON payload, `rawLearning` is empty string.
2. `learningIsTopical` checks whether `rawLearning` contains any folder name segment. When `rawLearning` is empty, this returns `false` (line 858: `rawLearning.length > 0` evaluates to `false`).
3. `observationFallback` (lines 863-868) joins the first 3 non-followup observation titles. When observations have no titles (common when observations are synthesized from JSON `keyDecisions` with only fact arrays), this produces empty string.
4. **The generic `'Session focused on implementing and testing features.'` fires** when both `rawLearning` and observation titles are empty or non-topical.

**The fix point:** `data.sessionSummary` from the JSON payload is never checked as a SUMMARY candidate. It's only passed through as `_JSON_SESSION_SUMMARY` at line 1034 for downstream title enrichment.

[SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:851-873`]

### 3. contextType Detection -- RC5 Fix Honors JSON Explicit Values (session-extractor.ts:575-613)

The `detectSessionCharacteristics()` function (lines 589-613) now honors explicit `contextType` from JSON:

```typescript
const contextType = (
  typeof explicitContextType === 'string' &&
  VALID_CONTEXT_TYPES.has(explicitContextType.trim().toLowerCase())
)
  ? explicitContextType.trim().toLowerCase()
  : detectContextType(toolCounts, decisionCount);
```

**Valid context types** (line 575-587): `implementation`, `research`, `debugging`, `review`, `planning`, `decision`, `architecture`, `configuration`, `documentation`, `general`, `discovery`.

**When no explicit contextType is provided:** `detectContextType()` (lines 120-135) is called. The RC5 fix at lines 122-123 checks `decisionCount > 0` BEFORE the `total === 0` early return, so JSON payloads with `keyDecisions` but zero tool counts now correctly get `'planning'` instead of `'general'`.

**Remaining gap:** When JSON provides neither explicit `contextType` nor `keyDecisions`, and tool counts are 0, `detectContextType` returns `'general'` at line 126. The downstream `detectImportanceTier()` (line 150) then returns `'normal'` because only `contextType === 'planning'` triggers `'important'`.

[SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:575-613`]
[SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:120-135`]

### 4. importanceTier Resolution Chain (session-extractor.ts:143-176)

```typescript
function detectImportanceTier(filesModified, contextType):
  if any file path contains 'architecture'|'core'|'schema'|'security'|'config' -> 'critical'
  if contextType === 'planning' -> 'important'
  return 'normal'  // default
```

The explicit override `resolveImportanceTier()` (lines 163-176) checks for valid explicit values first, then falls back to `detectImportanceTier()`. JSON mode can provide `importanceTier` directly, and it will be honored if it matches the valid set at lines 154-161.

**JSON-mode path:** When the AI provides `importanceTier: "important"` in the JSON, it's honored directly. Without it, and without file paths containing critical segments, most JSON saves get `'normal'`.

[SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:143-176`]

### 5. extractKeyTopics -- Two Divergent Implementations (session-extractor.ts:535-561 vs core/topic-extractor.ts)

The session-extractor defines its own `extractKeyTopics` at lines 535-561:

```typescript
function extractKeyTopics(summary: string | undefined, decisions: DecisionForTopics[] = []): string[] {
  const isPlaceholderSummary = !summary ||
    summary.includes('SIMULATION MODE') ||
    summary.includes('[response]') ||
    summary.includes('placeholder') ||
    summary.length < 20;

  const weightedSegments: string[] = [];
  if (summary && !isPlaceholderSummary) {
    weightedSegments.push(summary);
  }
  if (Array.isArray(decisions)) {
    for (const dec of decisions) {
      const decisionText = `${dec.TITLE || ''} ${dec.RATIONALE || ''} ${dec.CHOSEN || ''}`.trim();
      if (decisionText.length > 0) {
        weightedSegments.push(decisionText, decisionText);  // double-weighted
      }
    }
  }
  return SemanticSignalExtractor.extractTopicTerms(weightedSegments.join('\n\n'), {
    stopwordProfile: 'aggressive',
    ngramDepth: 2,
  }).slice(0, 10);
}
```

**However:** This function is exported from session-extractor but is NOT called by the workflow. The workflow imports from `core/topic-extractor.ts` (workflow.ts:23). The session-extractor's version also processes `CHOSEN` in addition to `TITLE` and `RATIONALE`, which the topic-extractor version may not. The session-extractor version also double-weights decision text.

This is dead code from the workflow's perspective -- or it may be used by other callers.

[SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:535-561`]

### 6. File Extraction -- Three Source Paths (file-extractor.ts:96-268)

`extractFilesFromData()` collects files from three sources:

**Source 1 -- FILES array (lines 208-219):** Primary input from `collectedData.FILES`. Each entry can have `FILE_PATH`, `DESCRIPTION`, `ACTION`, `MODIFICATION_MAGNITUDE`. Falls back to `'Modified during session'` for missing descriptions.

**Source 2 -- filesModified array (lines 223-226):** Legacy format, always assigns `'Modified'` action.

**Source 3 -- observations (lines 229-248):** Iterates `obs.files` and `obs.facts[].files`. All entries get the generic `'Modified during session'` description.

**Deduplication:** Uses a `filesMap` keyed by canonical relative path. Better descriptions (higher tier rank or longer) win during merge (lines 161-204). The map key includes collision disambiguation (lines 139-147).

**Cap enforcement (lines 255-260):**
```typescript
if (allFiles.length > CONFIG.MAX_FILES_IN_MEMORY) {
  console.warn(`Warning: Truncating files list from ${allFiles.length} to ${CONFIG.MAX_FILES_IN_MEMORY}`);
}
return allFiles.slice(0, CONFIG.MAX_FILES_IN_MEMORY)  // default: 10
```

**JSON-mode path:** When JSON provides files in `collectedData.FILES`, they flow through Source 1. When JSON provides no file references, only Source 3 (observation file refs) contributes, which typically produces very few entries with generic descriptions.

[SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:96-268`]
[SOURCE: `.opencode/skill/system-spec-kit/scripts/core/config.ts:232`]

### 7. Observation Deduplication and Anchoring (file-extractor.ts:330-435)

`buildObservationsWithAnchors()` (lines 330-374) processes observations by:
1. Deduplicating via `deduplicateObservations()` (lines 381-435) -- merges consecutive observations with identical titles into a single entry with count annotation
2. Detecting type via `detectObservationType()` (lines 72-90) using regex keyword matching against combined title, narrative, and facts
3. Generating anchor IDs via `generateAnchorId()` from `lib/anchor-generator.ts`

The dedup key is `title.toLowerCase() + '::' + sortedFiles.join('|')` (line 397). Facts from merged observations are combined (unique by text).

**JSON-mode behavior:** Observations synthesized from JSON `keyDecisions` (by input-normalizer) get titles like "Decision: Use ESM modules" which pass through type detection as `'decision'`. However, if the normalizer produces observations with generic or empty titles, they won't merge and create duplicate entries.

[SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:330-435`]

### 8. projectPhase Inference for JSON Mode (collect-session-data.ts:894-909)

The RC5-ext fix at lines 894-909 adds smart phase inference when JSON provides no explicit `projectPhase`:

```typescript
if (!explicitProjectPhase && contextType !== 'general') {
  const CONTEXT_TO_PHASE: Record<string, string> = {
    implementation: 'IMPLEMENTATION',
    research: 'RESEARCH',
    debugging: 'DEBUGGING',
    review: 'REVIEW',
    decision: 'PLANNING',
    planning: 'PLANNING',
    discovery: 'RESEARCH',
  };
  if (CONTEXT_TO_PHASE[contextType]) {
    explicitProjectPhase = CONTEXT_TO_PHASE[contextType];
  }
}
```

Without this, `detectProjectPhase()` (session-extractor.ts:189-208) returns `'RESEARCH'` when `total === 0` (line 195), which is the common case in JSON mode. The fix ensures that if contextType was set (explicitly or via decision detection), the phase aligns with it.

[SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:894-909`]

## Ruled Out
- No approaches failed this iteration.

## Dead Ends
- None identified.

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` (full file, 655 lines)
- `.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts` (full file, 448 lines)
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` (lines 840-1075)
- `.opencode/skill/system-spec-kit/scripts/core/workflow-path-utils.ts` (lines 61-109)
- `.opencode/skill/system-spec-kit/scripts/core/config.ts` (line 232)

## Assessment
- New information ratio: 0.75
- Questions addressed: session title generation, SUMMARY fallback chain, contextType detection, importanceTier resolution, key_files enumeration, observation processing
- Questions answered: "Where does the generic 'Session focused on...' text come from?" (ANSWERED: collect-session-data.ts:873, fires when rawLearning is empty and observations lack titles)

## Reflection
- What worked and why: Reading collect-session-data.ts alongside session-extractor.ts revealed that the session metadata assembly happens in collect-session-data.ts (the orchestration layer), while session-extractor.ts provides the primitive functions. Tracing the SUMMARY chain through its 3 fallbacks pinpointed the exact generic text source.
- What did not work and why: The two `extractKeyTopics` implementations (session-extractor vs topic-extractor) are confusing but ultimately the workflow only uses one. Time spent analyzing both was partially wasted for the workflow-specific question, but useful for understanding the broader codebase.
- What I would do differently: In future iterations, trace from the template backward to the data source rather than forward from extractors. This avoids reading dead code paths.

## Recommended Next Focus
Deep-read `quality-scorer.ts` to understand scoring dimensions and how messageCount=0 / toolCount=0 affects the score. This determines the minimum viable JSON payload for a >= 50/100 quality memory.

---
title: "workflow.ts Step 7-8: Parallel Extraction to Template Population Data Flow"
iteration: 7
focus: "Trace exact data flow from extractors to template renderer in workflow.ts Steps 7-8. Document trigger phrase extraction, key_topics source, and quality score calculation."
findings_summary: "Step 7 runs 5 extractors in parallel via Promise.all (workflow.ts:979-1027). Trigger phrases are extracted AFTER parallel extraction during Step 8 (lines 1174-1263) from sessionData.SUMMARY + decisions + file descriptions + folder tokens. Key topics come from core/topic-extractor.ts (NOT session-extractor.ts's version). Quality scoring happens at Step 8.6 (lines 1449-1484) via scoreMemoryQualityV2() combining content validation, sufficiency, contamination, and signal counts. KEY_FILES has no cap in buildKeyFiles() — when effectiveFiles is empty, a recursive spec folder walk produces unbounded entries."
---

# Iteration 7: workflow.ts Step 7-8 — Parallel Extraction to Template Population Data Flow

## Focus
Deep-read `workflow.ts` focusing on Step 7 (parallel extraction) and Step 8 (template population). Trace the exact data flow from extractors to template renderer. Document where trigger phrases are extracted, where key_topics come from, and where the quality score is calculated.

## Findings

### 1. Step 7 Parallel Extraction Architecture (workflow.ts:979-1027)

Five extraction tasks run in parallel via `Promise.all()` at line 979:

```
Promise.all([
  sessionDataFn(narrativeCollectedData, specFolderName),   // -> sessionData
  extractConversations(collectedData),                      // -> conversations
  extractDecisions(collectedData),                          // -> decisions
  extractDiagrams(collectedData),                           // -> diagrams
  extractPhasesFromData(narrativeCollectedData),            // -> workflowData
])
```

**Critical divergence:** `extractConversations` receives the raw `collectedData` (line 988), while `sessionDataFn` receives `narrativeCollectedData` which has been through the contamination filtering pipeline (line 982). This means conversations and session data may process different observation sets. The contamination filter removes observations that reference foreign spec folders, so `sessionData.OBSERVATIONS` may be smaller than what `extractConversations` sees.

The parallel results are destructured into 5 named variables: `sessionData`, `conversations`, `decisions`, `diagrams`, `workflowData`.

[SOURCE: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:979-1027`]

### 2. Trigger Phrase Extraction Pipeline (workflow.ts:1174-1263)

Trigger phrases are extracted **during Step 8**, after all parallel extraction completes. The pipeline has 6 stages:

**Stage 1 -- Build source text (lines 1178-1197):**
```typescript
const triggerSourceParts: string[] = [];
if (sessionData.SUMMARY && sessionData.SUMMARY.length > 20) {
  triggerSourceParts.push(sessionData.SUMMARY);
}
decisions.DECISIONS.forEach(d => {
  if (d.TITLE) triggerSourceParts.push(d.TITLE);
  if (d.RATIONALE) triggerSourceParts.push(d.RATIONALE);
  if (d.CONTEXT) triggerSourceParts.push(d.CONTEXT);
  if (d.CHOSEN) triggerSourceParts.push(d.CHOSEN);
});
effectiveFiles.forEach(f => {
  if (f._synthetic) return;
  if (f.DESCRIPTION && !f.DESCRIPTION.includes('pending'))
    triggerSourceParts.push(f.DESCRIPTION);
});
const folderNameForTriggers = specFolderName.replace(/^\d{1,3}-/, '').replace(/-/g, ' ');
triggerSourceParts.push(folderNameForTriggers);
```

**Stage 2 -- Auto-extract (line 1199):** `extractTriggerPhrases(triggerSource)` from `lib/trigger-extractor.ts`.

**Stage 3 -- Merge manual triggers (lines 1206-1221):** JSON payload's `_manualTriggerPhrases` array items are prepended (deduplicated by lowercase).

**Stage 4 -- Quality filter (line 1237):** `filterTriggerPhrases()` (defined at workflow.ts:120-157) removes:
- Entries with path separators (`/` or `\`) -- line 124
- Entries starting with leading number prefix like `022 hybrid rag` -- line 126
- Single words under 3 chars unless in TRIGGER_ALLOW_LIST (`rag`, `bm25`, `mcp`, etc.) -- lines 131-133
- Multi-word entries where every word is under 3 chars -- lines 137-138
- Shingle subsets: phrases that are substrings of longer retained phrases -- lines 143-155

**Stage 5 -- Folder token injection (lines 1239-1261):** Folder name tokens (>= 3 chars) are added unless they're in FOLDER_STOPWORDS (a large set of 50+ domain terms at lines 1242-1251).

**Stage 6 -- Floor guarantee (line 1263):** `ensureMinTriggerPhrases()` from `frontmatter-editor.ts`.

**JSON-mode problem:** When `sessionData.SUMMARY` falls to the generic `'Session focused on implementing and testing features.'` fallback (see Finding 5 below), the trigger source text is predominantly boilerplate. The folder name tokens and file descriptions become the only meaningful input.

[SOURCE: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:118-157,1174-1263`]

### 3. Key Topics Extraction Source (workflow.ts:1163-1164)

```typescript
const keyTopicsInitial: string[] = extractKeyTopics(sessionData.SUMMARY, decisions.DECISIONS, specFolderName);
const keyTopics: string[] = ensureMinSemanticTopics(keyTopicsInitial, effectiveFiles, specFolderName);
```

The import at line 23 shows this is `core/topic-extractor.ts`:
```typescript
import { extractKeyTopics } from './topic-extractor';
```

**This is NOT the same function as `session-extractor.ts:535`.** The session-extractor has its own `extractKeyTopics` that:
- Accepts `string | undefined` (topic-extractor requires `string`)
- Has broader placeholder detection (checks SIMULATION MODE, `[response]`, `placeholder`, `<20 chars`)
- Processes TITLE, RATIONALE, **and CHOSEN** from decisions (topic-extractor uses TITLE and RATIONALE only -- per topic-extractor.ts import `DecisionForTopics`)
- Both delegate to `SemanticSignalExtractor.extractTopicTerms()` with `aggressive` stopword profile

The inputs to the workflow's version are `sessionData.SUMMARY`, `decisions.DECISIONS`, and `specFolderName`. When SUMMARY is the generic fallback, topic extraction receives predominantly boilerplate.

[SOURCE: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:23-24,1163-1164`]
[SOURCE: `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:535-561`]

### 4. Quality Score Calculation Chain (workflow.ts:1449-1484)

Quality scoring at Step 8.6 follows a 4-step chain:

**Step A -- Content validation (line 1451):**
```typescript
const qualityValidation = validateMemoryQualityContent(files[ctxFilename]);
```
Runs content-level rules (V1-V8+) and produces `qualitySignals` (array of `{ruleId, passed}`).

**Step B -- Sufficiency evaluation (line 1472):**
```typescript
const sufficiencyResult = evaluateMemorySufficiency(sufficiencySnapshot);
```
The snapshot (lines 1460-1471) is built from: `title`, rendered `content`, `triggerPhrases`, `files`, `observations`, `decisions`, `outcomes`, `nextAction`, `blockers`, `recentContext`.

**Step C -- V2 quality scorer (lines 1473-1483):**
```typescript
const qualityV2 = scoreMemoryQualityV2({
  content: files[ctxFilename],          // rendered markdown
  validatorSignals: qualitySignals,      // from Step A
  hadContamination,                      // boolean
  contaminationSeverity,                 // max severity
  messageCount: conversations.MESSAGES.length,
  toolCount: patchedToolCount,
  decisionCount: effectiveDecisionCount,
  sufficiencyScore: sufficiencyResult.score,
  insufficientContext: !sufficiencyResult.pass,
});
```

**Step D -- Inject into frontmatter (line 1484):**
```typescript
files[ctxFilename] = injectQualityMetadata(files[ctxFilename], qualityV2.score01, qualityV2.qualityFlags);
```

**JSON-mode problem:** `conversations.MESSAGES.length` will be 0 or very low (only synthetic messages from fallback). `patchedToolCount` will be 0 unless captured-session enrichment infers it from file count (line 1041). These two signals heavily influence the quality score.

[SOURCE: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1449-1484`]

### 5. Template Population Merge Order (workflow.ts:1277-1370)

The `populateTemplate('context', {...})` call at line 1277 merges data from multiple sources via object spread:

```typescript
{
  ...sessionData,           // base: TITLE, SUMMARY, FILES, OBSERVATIONS, etc.
  ...conversations,         // override: MESSAGES, TOOL_COUNT, PHASE_COUNT
  ...workflowData,          // override: WORKFLOW_FLOWCHART, PHASES, etc.
  ...(isCapturedSessionMode ? { TOOL_COUNT: patchedToolCount } : {}),
  FILES: effectiveFiles,    // explicit override (tree-thinned)
  DECISIONS: decisions.DECISIONS.map(...),  // confidence-normalized
  DIAGRAMS: diagrams.DIAGRAMS,
  TOPICS: keyTopics,
  TRIGGER_PHRASES: preExtractedTriggers,
  KEY_FILES: keyFiles,
  MEMORY_TITLE: memoryTitle,
  MEMORY_DASHBOARD_TITLE: memoryDashboardTitle,
  MEMORY_DESCRIPTION: memoryDescription,
  IMPLEMENTATION_SUMMARY: IMPL_SUMMARY_MD,
  ...memoryClassification,
  ...sessionDedup,
  ...causalLinks,
}
```

**Spread override risk (confirmed):** `...conversations` at line 1279 overwrites any same-named field from `...sessionData`. The explicit `TOOL_COUNT` patch at line 1286 is a known fix for this specific override in captured-session mode.

**All data assembled in one object:** The template renderer receives a flat object with ~80+ keys. Missing data produces empty/false template conditionals.

[SOURCE: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1277-1370`]

### 6. KEY_FILES Enumeration -- No Cap on Fallback (workflow-path-utils.ts:99-109)

```typescript
export function buildKeyFiles(effectiveFiles, specFolderPath) {
  const explicitKeyFiles = effectiveFiles
    .filter(file => !file.FILE_PATH.includes('(merged-small-files)'))
    .map(file => ({ FILE_PATH: file.FILE_PATH }));

  if (explicitKeyFiles.length > 0) {
    return explicitKeyFiles;          // capped by MAX_FILES_IN_MEMORY (default: 10)
  }

  return listSpecFolderKeyFiles(specFolderPath);  // NO CAP -- recursive walk
}
```

The fallback `listSpecFolderKeyFiles()` (lines 61-97) recursively walks the spec folder collecting ALL `.md` and `.json` files, excluding only `memory/`, `scratch/`, `.git/`, `node_modules/` directories. It has no upper bound.

**Config reference:** `MAX_FILES_IN_MEMORY` is set to `10` at config.ts:232 (`maxFilesInMemory: 10`), but this cap is only applied in `extractFilesFromData()` in file-extractor.ts:255-260. It is NOT applied in `buildKeyFiles()`.

**JSON-mode trigger:** When the AI provides structured JSON without explicit file references, `effectiveFiles` may be empty or contain only synthetic entries. This triggers the fallback path. For a large spec folder like `022-hybrid-rag-fusion/` with 20+ sub-specs, the walk can produce 300+ entries.

[SOURCE: `.opencode/skill/system-spec-kit/scripts/core/workflow-path-utils.ts:61-109`]
[SOURCE: `.opencode/skill/system-spec-kit/scripts/core/config.ts:232`]

## Ruled Out
- N/A (no approaches failed this iteration)

## Dead Ends
- None identified.

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (lines 979-1027, 1116-1484)
- `.opencode/skill/system-spec-kit/scripts/core/workflow-path-utils.ts` (lines 61-109)
- `.opencode/skill/system-spec-kit/scripts/core/config.ts` (line 232)
- `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` (lines 535-561)

## Assessment
- New information ratio: 0.83
- Questions addressed: trigger phrase extraction strategy, key_topics source, quality score calculation, key_files scoping, template data flow
- Questions answered: "How should the template renderer handle JSON-sourced observations vs transcript-sourced ones?" (partial -- merge order documented, but fix not yet designed)

## Reflection
- What worked and why: Targeted grep for function names and step markers before reading sections eliminated unnecessary reading of the 1800+ line workflow.ts file. Reading Step 7, Step 8, and Step 8.6 as separate sections gave a complete picture.
- What did not work and why: N/A
- What I would do differently: Next iteration should deep-read session-extractor.ts and collect-session-data.ts to trace the upstream data generation, particularly the SUMMARY fallback and TITLE generation.

## Recommended Next Focus
Deep-read `session-extractor.ts` and `collect-session-data.ts` to map how session metadata (TITLE, SUMMARY, contextType) is generated. Find the source of the generic "Session focused on..." text. Document the key_files enumeration source logic.

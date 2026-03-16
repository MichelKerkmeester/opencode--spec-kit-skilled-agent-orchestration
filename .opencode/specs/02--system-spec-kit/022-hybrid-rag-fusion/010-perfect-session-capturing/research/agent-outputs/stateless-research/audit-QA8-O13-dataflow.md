# QA8-O13: Cross-Cutting Data Flow Integrity Audit

**Date:** 2026-03-09
**Scope:** CLI input → data-loader → input-normalizer → collect-session-data → workflow orchestration → extractors → render
**Auditor:** @review agent (Claude Opus 4.6)
**Focus:** Field survival, type transformations, merge operations, optional field handling

---

## 1. Pipeline Architecture Overview

```
CLI args (dataFile, specFolderArg)
    │
    ▼
data-loader.ts ─── loadCollectedData()
    │  Priority 1: File → JSON parse → validateInputData → normalizeInputData
    │  Priority 2: OpenCode capture → transformOpencodeCapture()
    │  Priority 3: Simulation fallback { _isSimulation: true }
    │
    ▼
workflow.ts ─── runWorkflow()
    │  Step 1:   Load data (pre-loaded | loadDataFn | loadCollectedData)
    │  Step 1.5: Alignment check (stateless mode)
    │  Step 2:   Detect spec folder
    │  Step 3.5: enrichStatelessData() — merges spec-folder + git context
    │  Steps 4-7: Parallel extraction
    │     ├── collectSessionData() → SessionData
    │     ├── extractConversations()
    │     ├── extractDecisions()
    │     ├── extractDiagrams()
    │     └── extractPhasesFromData() → workflow data
    │  Step 7.5: Semantic summary (semantic-summarizer)
    │  Step 7.6: Tree thinning
    │  Step 8:   Template population → populateTemplate('context', mergedData)
    │  Step 9:   Atomic write
    │
    ▼
template-renderer.ts ─── renderTemplate()
    │  Mustache-style: {{VAR}}, {{#ARRAY}}...{{/ARRAY}}, {{^ARRAY}}...{{/ARRAY}}
    │  Missing values → empty string + warning log
    ▼
  .md file output
```

---

## 2. Field Survival Trace

### 2.1 SPEC_FOLDER

| Boundary | What Happens | Data Loss Risk |
|----------|-------------|----------------|
| **CLI → data-loader** | `CONFIG.SPEC_FOLDER_ARG` passed to `loadCollectedData` as `specFolderArg` | NONE |
| **data-loader → normalizer** | `validateInputData(rawData, specFolderArg)` checks presence; `normalizeInputData(rawData)` maps `data.specFolder` → `normalized.SPEC_FOLDER` | **P1-01**: `data.SPEC_FOLDER` (uppercase in raw input) is NOT copied. Only `data.specFolder` (camelCase) is mapped. If input provides only `SPEC_FOLDER`, it passes through the `data.userPrompts || data.observations || data.recentContext` early-return path unchanged. See Finding F01. |
| **normalizer → workflow** | `collectedData.SPEC_FOLDER` used in alignment check and backfill at line 733-734 of collect-session-data.ts | NONE (backfill covers gaps) |
| **collect-session-data → SessionData** | `folderName` resolved from `collectedData.SPEC_FOLDER` or `detectSpecFolder()`. Output: `SPEC_FOLDER: folderName` | NONE |
| **SessionData → template** | Spread into template context: `...sessionData` | NONE |

### 2.2 observations

| Boundary | What Happens | Data Loss Risk |
|----------|-------------|----------------|
| **CLI → data-loader** | Raw JSON or `transformOpencodeCapture` | NONE |
| **normalizer (manual path)** | Builds observations from `sessionSummary`, `keyDecisions`, `technicalContext` | NONE (synthetic, all sources consumed) |
| **normalizer (passthrough path)** | If `data.userPrompts || data.observations || data.recentContext` exist → returns `data` as-is | NONE |
| **enrichStatelessData** | Appends spec-folder and git observations via spread | NONE (append-only) |
| **collect-session-data** | `collectedData.observations || []` — used to build OUTCOMES, OBSERVATIONS_DETAILED | NONE |
| **file-extractor → OBSERVATIONS_DETAILED** | `buildObservationsWithAnchors()` deduplicates and anchors | **P2-01**: Deduplication merges observations with identical normalized titles + file lists. Could merge semantically different observations that happen to have the same title. Not data loss but quality degradation. |
| **SessionData → template** | `OBSERVATIONS` array iterated via `{{#OBSERVATIONS}}` | NONE |

### 2.3 FILES

| Boundary | What Happens | Data Loss Risk |
|----------|-------------|----------------|
| **CLI → data-loader** | JSON: `data.FILES` array with `FILE_PATH`/`path` and `DESCRIPTION`/`description` | NONE |
| **normalizer (manual path)** | `data.filesModified` (string[]) → `normalized.FILES` as `FileEntry[]` with generic description | NONE (transformed) |
| **normalizer (MCP passthrough)** | `data.FILES` preserved as-is via early return | NONE |
| **enrichStatelessData** | Merges spec-folder FILES + git FILES with dedup by lowercase path | NONE |
| **collect-session-data → extractFilesFromData** | Consumes `collectedData.FILES` (FILE_PATH/path), `collectedData.filesModified`, and `observations[].files` | **P2-02**: `ACTION` field from input FILES is accessed via `(fileInfo as any).ACTION` — no type safety but functionally works. |
| **extractFilesFromData** | Deduplication by normalized path. Longer/valid descriptions preferred. Truncated to `CONFIG.MAX_FILES_IN_MEMORY`. | **P2-03**: When file count exceeds MAX_FILES_IN_MEMORY, files with only fallback descriptions are dropped first, but some valid files may still be truncated. This is by design (truncation, not loss). |
| **workflow → enhanceFilesWithSemanticDescriptions** | Enriches descriptions from semantic analysis. Falls back to original description if no match or if semantic says "Modified during session". | NONE |
| **workflow → applyThinningToFileChanges** | Tree thinning: `merged-into-parent` files removed as standalone, merge notes appended to carrier file. | **P2-04**: `_provenance` and `_synthetic` metadata are NOT preserved through `enhanceFilesWithSemanticDescriptions()` (line 238-242, 262-266 of file-extractor.ts). The returned objects only contain `FILE_PATH`, `DESCRIPTION`, `ACTION`. |
| **SessionData → template** | Overridden: `FILES: effectiveFiles` in template context replaces `sessionData.FILES` | NONE (intentional override) |

### 2.4 userPrompts

| Boundary | What Happens | Data Loss Risk |
|----------|-------------|----------------|
| **CLI → data-loader** | JSON: preserved as-is. OpenCode capture: synthesized from exchanges | NONE |
| **normalizer (manual path)** | Creates single synthetic prompt from `sessionSummary` | **P2-05**: Original user prompt history is not available in manual format — by design, this is a format limitation not a bug. |
| **collect-session-data** | `collectedData.userPrompts || []`. Used for duration calculation, message count, last prompt timestamp | NONE |
| **workflow Step 7.5** | Re-read from `collectedData.userPrompts` for contamination filtering. Filtered versions used for semantic summary only (not for SessionData) | NONE — original prompts in SessionData are unaffected |

### 2.5 recentContext

| Boundary | What Happens | Data Loss Risk |
|----------|-------------|----------------|
| **CLI → data-loader** | JSON: preserved as-is | NONE |
| **normalizer (manual path)** | Creates single entry from `sessionSummary` | NONE |
| **enrichStatelessData** | Appends spec-folder recentContext entries | NONE |
| **collect-session-data** | `collectedData.recentContext?.[0]` used for `sessionInfo`, `SUMMARY`, `quickSummary` | **P2-06**: Only `recentContext[0]` is consumed for session info extraction. If multiple entries exist (e.g., after enrichment), entries [1..N] are ignored for session metadata. They ARE used in `extractPendingTasks` and `buildProjectStateSnapshot` via `recentContext` param. |

### 2.6 decisions (manual input path)

| Boundary | What Happens | Data Loss Risk |
|----------|-------------|----------------|
| **CLI input** | `keyDecisions` array (string or object) | NONE |
| **normalizer** | Each decision → `transformKeyDecision()` → Observation with `_manualDecision` metadata. Also stored in `normalized._manualDecisions` | NONE |
| **enrichStatelessData** | Spec-folder decisions appended to `collectedData._manualDecisions` | NONE |
| **collect-session-data** | `_manualDecisions` is NOT explicitly consumed by `collectSessionData`. However, decisions embedded as observations ARE consumed. | **P1-02**: `_manualDecisions` array is carried on `collectedData` but never read by `collectSessionData()`. The manual decisions survive only because they were also converted to observations by the normalizer. The `_manualDecisions` field itself is dead weight. See Finding F02. |
| **workflow → extractDecisions** | Extracts decisions from the full `collectedData` (observations, prompts). Manual decisions embedded as observations with type='decision' are picked up. | NONE (indirect survival) |

---

## 3. Type Transformation Boundaries

### 3.1 normalizeInputData: RawInputData → NormalizedData | RawInputData

**Critical observation:** The return type is a UNION. When the passthrough path is taken (data already has `userPrompts`, `observations`, or `recentContext`), the raw data is returned unchanged.

| Field | Input Type | Output Type | Risk |
|-------|-----------|-------------|------|
| `SPEC_FOLDER` | string | string | NONE |
| `filesModified` | `string[]` | `FileEntry[]` (FILE_PATH + DESCRIPTION) | NONE — proper transform |
| `keyDecisions` | `(string \| DecisionItemObject)[]` | Observations[] + `_manualDecisions` | NONE |
| `observations` | `Observation[]` | `Observation[]` (passthrough) | NONE |

### 3.2 data-loader → workflow: LoadedData → CollectedDataFull

**Critical observation:** `LoadedData` and `CollectedDataFull` are structurally compatible through index signatures (`[key: string]: unknown`). The spread `{ ...data, _source: 'file' }` preserves all fields.

| Risk | Assessment |
|------|-----------|
| Type narrowing loss | LOW — both use index signatures |
| `_source` addition | SAFE — adds 'file' | 'opencode-capture' | 'simulation' |

### 3.3 collectSessionData → SessionData

**Critical transformation boundary.** Input: `CollectedDataFull | null`. Output: `SessionData` (strongly typed).

| Input Field | Transformation | Output Field | Risk |
|-------------|---------------|-------------|------|
| `observations` | → `buildObservationsWithAnchors()` | `OBSERVATIONS` (ObservationDetailed[]) | NONE |
| `observations` | → `extractFilesFromData()` | `FILES` (FileChange[]) | NONE |
| `observations` | → sliced, mapped | `OUTCOMES` (OutcomeEntry[]) | **P2-07**: Sliced to first 10. Large sessions may lose tail observations from outcomes. |
| `userPrompts` | → `.length` | `MESSAGE_COUNT` | NONE |
| `recentContext` | → `[0].learning`, `[0].request` | `SUMMARY`, `QUICK_SUMMARY` | See P2-06 |
| `preflight` | → `extractPreflightPostflightData()` | Spread into SessionData | NONE |
| `postflight` | → `extractPreflightPostflightData()` | Spread into SessionData | NONE |
| `SPEC_FOLDER` | → backfilled from folderName if missing | `SPEC_FOLDER` | NONE |
| `_manualDecisions` | NOT consumed | N/A | See P1-02 |
| `_manualTriggerPhrases` | NOT consumed | N/A | **P1-03**: See Finding F03 |

### 3.4 SessionData + extractors → template context (spread merge)

**Line ~887-933 of workflow.ts.** The template context is built by spreading SessionData first, then overlaying extractor results.

| Overlay | Effect | Risk |
|---------|--------|------|
| `...sessionData` | Base layer | NONE |
| `...conversations` | Adds MESSAGES, MESSAGE_COUNT (overrides sessionData.MESSAGE_COUNT) | **P2-08**: `MESSAGE_COUNT` from conversations overrides `sessionData.MESSAGE_COUNT`. These may differ (conversations counts parsed messages; sessionData counts raw userPrompts). Intentional — conversation count is more accurate. |
| `...workflowData` | Adds workflow/phase/pattern data | NONE |
| `FILES: effectiveFiles` | **Overrides** sessionData.FILES with thinned+enhanced files | NONE (intentional) |
| `DECISION_COUNT` | Overrides with decisions.DECISIONS.length | NONE (more accurate) |

### 3.5 Template Renderer: TemplateContext → string

| Input Type | Rendering Behavior | Risk |
|-----------|-------------------|------|
| `undefined/null` | Replaced with empty string, warning logged | **P2-09**: Missing data renders as empty — no crash but possibly blank sections in output. Optional placeholders suppressed via OPTIONAL_PLACEHOLDERS set. |
| `Array<object>` | Iterated in `{{#ARRAY}}` blocks | NONE |
| `object` (non-array) | First key's value used as string | **P2-10**: Objects rendered in `{{VAR}}` context use only the first key. If an object with multiple properties is placed in a simple variable placeholder, all properties except the first are silently dropped. |
| `boolean` | `true` → "Yes", `false` → "No" | NONE |
| `number` | `String(value)` | NONE |

---

## 4. Merge Operation Analysis

### 4.1 enrichStatelessData — Observation Merge

```typescript
collectedData.observations = [...existingObs, ...specContext.observations];
```

**Assessment:** Append-only spread. No property loss. Ordering: existing first, synthetic appended. SAFE.

### 4.2 enrichStatelessData — FILES Merge

```typescript
const existingPaths = new Set(existingFiles.map(f => (f.FILE_PATH || f.path || '').toLowerCase()));
const newFiles = specContext.FILES.filter(f => !existingPaths.has(f.FILE_PATH.toLowerCase()));
collectedData.FILES = [...existingFiles, ...newFiles];
```

**Assessment:** Deduplication by lowercase path. Existing entries take precedence. New entries appended. SAFE.

**Edge case:** If an existing file has only `path` (not `FILE_PATH`), the dedup key uses `f.path`. But new files from spec-folder always use `FILE_PATH`. A file could appear duplicated if existing entry uses `path` and new entry uses `FILE_PATH` for the same file — but this is unlikely because `extractFilesFromData` always normalizes to `FILE_PATH`.

### 4.3 enrichStatelessData — Trigger Phrases Merge

```typescript
collectedData._manualTriggerPhrases = [
  ...(collectedData._manualTriggerPhrases || []),
  ...specContext.triggerPhrases,
];
```

**Assessment:** Append-only, no dedup. Could produce duplicates. LOW risk (duplicates don't cause data loss, just waste).

### 4.4 enrichStatelessData — Decisions Merge

```typescript
collectedData._manualDecisions = [
  ...(collectedData._manualDecisions || []),
  ...specContext.decisions,
];
```

**Assessment:** Append-only. SAFE. But per P1-02, `_manualDecisions` is never consumed downstream.

### 4.5 Template Context Spread (workflow.ts ~887)

```typescript
await populateTemplate('context', {
  ...sessionData,       // base
  ...conversations,     // overlay
  ...workflowData,      // overlay
  FILES: effectiveFiles, // explicit override
  MESSAGE_COUNT: conversations.MESSAGES.length, // explicit override
  // ... more explicit overrides
})
```

**Assessment:** Later spreads override earlier ones for same-named keys. This is intentional and well-managed via explicit overrides. SAFE.

---

## 5. Findings Summary

### P0 Findings (Data Loss) — NONE CONFIRMED

No confirmed data loss pathways found. All critical fields survive from CLI input through to rendered output.

### P1 Findings (Silent Corruption / Dead Fields)

| ID | Finding | Location | Impact |
|----|---------|----------|--------|
| **F01** | `normalizeInputData` maps `data.specFolder` (camelCase) to `SPEC_FOLDER` but does NOT map `data.SPEC_FOLDER` (uppercase). For the manual-format path, if input uses `SPEC_FOLDER` instead of `specFolder`, the normalized output will lack it. | `input-normalizer.ts:233-235` | **LOW** — The MCP passthrough path returns data unchanged (preserving SPEC_FOLDER). Only the manual-format normalization path is affected, and `collect-session-data.ts:733` backfills SPEC_FOLDER from the CLI folder name. No net data loss, but the normalizer's contract is incomplete. |
| **F02** | `_manualDecisions` is populated by normalizer and enrichStatelessData but never consumed by `collectSessionData`. | `collect-session-data.ts` (absent), `input-normalizer.ts:279-281` | **LOW** — Decisions survive as observations (dual encoding). The `_manualDecisions` field is dead weight, not a data loss vector. workflow.ts's `extractDecisions()` picks them up from observations. |
| **F03** | `_manualTriggerPhrases` is populated by normalizer and enrichStatelessData but never consumed by `collectSessionData`. | `collect-session-data.ts` (absent), workflow.ts consumes it at step 8 via `collectedData._manualTriggerPhrases` (absent) | **MEDIUM** — Trigger phrases from manual input and spec-folder enrichment are stored on `collectedData._manualTriggerPhrases` but the workflow pre-extracts triggers from session content (step 8, line ~843-884). The manual trigger phrases are NOT merged into `preExtractedTriggers`. Spec-folder trigger phrases injected via enrichment are therefore lost from the trigger phrase pipeline. |

#### Adversarial Self-Check (P1 Findings)

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| F01: SPEC_FOLDER camelCase/uppercase mismatch | P1 | The MCP passthrough path and the backfill in collect-session-data both cover this. No confirmed data loss in any real path. | Downgraded — contract incompleteness, not corruption | P2 |
| F02: _manualDecisions dead field | P1 | Decisions survive via dual encoding in observations. No information is actually lost. | Confirmed as dead weight, not corruption. | P2 |
| F03: _manualTriggerPhrases not merged | P1 | Workflow step 8 builds triggers from session content, summary, decisions, file paths, and folder name. Spec-folder trigger phrases from enrichment ARE separate. Checked: `collectedData._manualTriggerPhrases` is NEVER read in workflow.ts. | **Confirmed** — spec-folder trigger phrases injected during enrichment are stored but never consumed by the trigger extraction pipeline. This is a real integration gap. | **P1** |

### P2 Findings (Quality)

| ID | Finding | Location | Impact |
|----|---------|----------|--------|
| P2-01 | Observation dedup merges by normalized title+files, potentially merging distinct observations | file-extractor.ts:325-379 | Low — rare in practice |
| P2-02 | ACTION field access uses `(fileInfo as any).ACTION` — no type safety | file-extractor.ts:171 | No functional impact |
| P2-03 | File list truncation at MAX_FILES_IN_MEMORY | file-extractor.ts:209-211 | By design |
| P2-04 | `_provenance` and `_synthetic` lost through enhanceFilesWithSemanticDescriptions | file-extractor.ts:238-242 | Metadata loss, not content loss |
| P2-05 | Manual format creates single synthetic prompt | input-normalizer.ts:265-268 | By design |
| P2-06 | Only recentContext[0] used for session metadata | collect-session-data.ts:678 | Index [1..N] used elsewhere |
| P2-07 | OUTCOMES sliced to first 10 observations | collect-session-data.ts:690-695 | By design |
| P2-08 | MESSAGE_COUNT overridden by conversation count | workflow.ts:893 | Intentional improvement |
| P2-09 | Missing template variables render as empty string | template-renderer.ts:122-128 | Silent degradation |
| P2-10 | Object in simple {{VAR}} uses only first key | template-renderer.ts:140-143 | Edge case |

---

## 6. Positive Highlights

1. **Robust backfill mechanism**: `collect-session-data.ts:733-734` backfills SPEC_FOLDER from CLI arg, preventing data loss even when normalizer misses it.
2. **Path traversal guard**: `collect-session-data.ts:737-744` validates SPEC_FOLDER against specs directory boundary before filesystem access.
3. **Deduplication at file extraction**: `extractFilesFromData` correctly merges duplicate file entries, preferring longer/valid descriptions.
4. **Contamination filtering**: workflow.ts Step 7.5 filters contamination from user prompts before semantic analysis without affecting the raw SessionData.
5. **Tree thinning with provenance**: Merge notes in thinned output preserve information about which files were merged and why.
6. **Quality gate with abort**: workflow.ts Step 8.7 aborts saves below quality threshold, preventing garbage output.
7. **Atomic writes with rollback**: `writeFilesAtomically` prevents partial file corruption.

---

## 7. Recommendations

### Priority 1: Fix F03 — Merge _manualTriggerPhrases into trigger pipeline

In `workflow.ts` around line 878, after `preExtractedTriggers = ensureMinTriggerPhrases(...)`, add:

```typescript
// Merge manual/spec-folder trigger phrases that were injected during enrichment
const manualTriggers = collectedData?._manualTriggerPhrases;
if (Array.isArray(manualTriggers) && manualTriggers.length > 0) {
  const existingLower = new Set(preExtractedTriggers.map(p => p.toLowerCase()));
  for (const trigger of manualTriggers) {
    if (trigger && !existingLower.has(trigger.toLowerCase())) {
      preExtractedTriggers.push(trigger);
      existingLower.add(trigger.toLowerCase());
    }
  }
}
```

### Priority 2: Preserve _provenance through semantic enhancement

In `enhanceFilesWithSemanticDescriptions` (file-extractor.ts), carry forward `_provenance` and `_synthetic`:

```typescript
return {
  FILE_PATH: file.FILE_PATH,
  DESCRIPTION: info.description !== 'Modified during session' ? info.description : file.DESCRIPTION,
  ACTION: normalizeFileAction(info.action),
  ...(file._provenance ? { _provenance: file._provenance, _synthetic: file._synthetic } : {}),
};
```

### Priority 3: Add SPEC_FOLDER uppercase handling in normalizer

In `normalizeInputData` (input-normalizer.ts:233), also check for uppercase:

```typescript
if (data.specFolder || data.SPEC_FOLDER) {
  normalized.SPEC_FOLDER = data.specFolder || data.SPEC_FOLDER;
}
```

---

## 8. Verdict

**Overall Data Flow Integrity: PASS (with one P1 gap)**

The pipeline demonstrates solid data preservation across all major boundaries. The architectural pattern of "dual encoding" (decisions as both observations and _manualDecisions) provides redundancy that prevents data loss even when one path has gaps. The single confirmed P1 finding (F03: `_manualTriggerPhrases` not consumed) affects search/retrieval quality but not content integrity. No P0 data loss pathways were found.

| Dimension | Score |
|-----------|-------|
| Field survival | 95/100 — all critical fields survive; one dead-weight field identified |
| Type safety at boundaries | 85/100 — index signatures and `any` casts are pragmatic but reduce safety |
| Merge correctness | 95/100 — all merge operations are append-only or properly deduplicated |
| Optional field handling | 90/100 — good use of `|| []` defaults; minor gap in trigger phrase integration |
| **Overall** | **91/100** |

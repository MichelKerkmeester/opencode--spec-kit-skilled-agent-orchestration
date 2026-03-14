# Agent I02: End-to-End Stateless Data Flow Trace

**Date:** 2026-03-08
**Agent:** I02 (Data Flow Tracer)
**Scope:** Stateless memory save pipeline — no JSON data file available
**Files reviewed:** 6 source files (generate-context.js, data-loader.ts, input-normalizer.ts, workflow.ts, collect-session-data.ts, contamination-filter.ts, quality-scorer.ts)

---

## Summary

The stateless pipeline follows a 10-step flow from CLI entry through quality scoring. The data flow is **mostly unbroken** with one notable gap: the contamination filter is applied only to `userPrompts` in Step 7.5, NOT to observations or recentContext — meaning AI orchestration chatter in observations (the primary data carrier for stateless mode) passes through unfiltered. Additionally, the simulation fallback path (`_isSimulation: true`) carries a dangerously thin data shape that downstream extractors must guard against with null coalescing at every access point.

---

## Flow Trace (10 Steps)

### Step 1: CLI Entry — `generate-context.js`

**Args:** `node generate-context.js <spec-folder-path>` (e.g., `specs/001-feature/`)

**Code path:** `parseArguments()` at line 201. When the primary arg is NOT a `.json` file AND matches a spec folder pattern (`specs/...`, `.opencode/specs/...`, or `NNN-name`), the stateless branch fires:

```
CONFIG.SPEC_FOLDER_ARG = primaryArg;   // e.g. "specs/001-feature/"
CONFIG.DATA_FILE = null;                // explicitly null — no JSON
```

**Data shape exiting:** `CONFIG.DATA_FILE = null`, `CONFIG.SPEC_FOLDER_ARG = <path>`

**Error handling (historical snapshot):** `validateArguments()` calls `isValidSpecFolder()` — on failure, logs helpful "did you mean" suggestions and calls `process.exit(1)`. At the time of this trace, `rejectExplicitPhaseFolderTarget()` threw if target was a phase folder.

**Superseded behavior note (2026-03-10):** Explicit phase-folder targets are now authoritative for context saves; direct saves to `.../007-combined-bug-fixes` write into that phase folder's `memory/`.

**Flow continuity:** Unbroken. Calls `workflow.runWorkflow()` with `dataFile: CONFIG.DATA_FILE ?? undefined` (undefined), `specFolderArg: CONFIG.SPEC_FOLDER_ARG ?? undefined`.

---

### Step 2: Data Loading — `data-loader.ts` → `loadCollectedData()`

**Entry shape:** `options = { dataFile: null/undefined, specFolderArg: "<path>" }`

**Code path (stateless):**
- Line 81: `if (dataFile)` — SKIPPED (dataFile is null/undefined)
- Line 143: Priority 2 — OpenCode session capture attempted via `getOpencodeCapture()`
  - If OpenCode module available AND returns exchanges → `transformOpencodeCapture()` called → returns `TransformedCapture` with `_source: 'opencode-capture'`
  - If unavailable or empty → falls through
- Line 181: Priority 3 — Simulation fallback → returns `{ _isSimulation: true, _source: 'simulation' }`

**Data shape exiting (OpenCode capture path):**
```typescript
{
  userPrompts: UserPrompt[],        // from exchanges
  observations: Observation[],       // from exchanges + tool calls
  recentContext: RecentContext[],     // from first/last exchange
  FILES: FileEntry[],                // from edit/write tool calls
  _source: 'opencode-capture',
  _sessionId?: string,
  _capturedAt?: string
}
```

**Data shape exiting (simulation fallback):**
```typescript
{ _isSimulation: true, _source: 'simulation' }
```

**Error handling:** Each priority level catches errors and falls through to the next. No throw propagation from Priority 1/2 failures.

**FINDING [P2]:** In the OpenCode capture path (line 162), `transformOpencodeCapture()` receives `specFolderArg` as `specFolderHint` for relevance filtering, but `specFolderArg` here comes from `CONFIG.SPEC_FOLDER_ARG` which may be a bare folder name like `001-feature` or a full path like `specs/001-feature/`. The relevance filter at input-normalizer.ts:408-416 splits on `/` and uses substring matching, which works but is imprecise — a spec folder named `001-test` would match paths containing `test` broadly.

---

### Step 3: Input Normalization — `input-normalizer.ts`

**In the stateless pipeline, this step is CONDITIONALLY reached.** It is only invoked if:
- Priority 1 (JSON file) data is loaded — then `normalizeInputData()` is called at data-loader.ts:114
- Priority 2 (OpenCode capture) — `transformOpencodeCapture()` does its OWN normalization internally, bypassing `normalizeInputData()`

**For stateless mode (no JSON), normalization happens inside `transformOpencodeCapture()`:**
- Exchanges → `UserPrompt[]` (line 430-433)
- Exchanges + tool calls → `Observation[]` (lines 444-498)
- First/last exchange → `RecentContext[]` (line 500-503)
- Edit/write tool calls → `FileEntry[]` (lines 505-519)

**For simulation fallback:** No normalization occurs. The `{ _isSimulation: true }` object passes through unchanged.

**Data shape exiting:** Same as Step 2 output — no additional transformation for stateless paths.

**Error handling:** `transformOpencodeCapture()` has no try/catch — any error propagates up to the caller in data-loader.ts which catches at line 170.

---

### Step 4: Contamination Guard — `contamination-filter.ts`

**IMPORTANT: This step does NOT occur where expected in the pipeline.**

The contamination filter (`filterContamination()`) is applied ONLY at workflow.ts:735-745, inside Step 7.5 (semantic summary generation), and ONLY to `userPrompts[].prompt` text:

```typescript
const allMessages = rawUserPrompts.map((m) => {
  const filtered = filterContamination(m.prompt || '');
  // ...
  return { prompt: filtered.cleanedText, ... };
});
```

**What is NOT filtered:**
- `observations[].narrative` — the primary content carrier in stateless mode
- `observations[].title`
- `recentContext[].learning`
- `recentContext[].request`

**FINDING [P1]:** Observations created from `assistantResponse` in OpenCode capture (input-normalizer.ts:464-472) contain raw AI text that will include orchestration chatter like "Let me analyze", "I'll execute this step by step", etc. These flow unfiltered into `collectSessionData()` where they become `SUMMARY`, `OUTCOMES`, `OBSERVATIONS_DETAILED`, and ultimately template content. The contamination filter is narrowly scoped to `userPrompts` only.

---

### Step 5: Alignment Check — `workflow.ts` lines 582-607

**Entry shape:** `collectedData` (full `CollectedDataFull`), `activeSpecFolderArg` (string)

**Guard condition:** Only fires when `isStatelessMode && activeSpecFolderArg && collectedData.observations` are all truthy.

**Logic:**
1. Extracts spec keywords from folder basename (e.g., `"007-combined-bug-fixes"` → `["combined", "bug", "fixes"]`)
2. Collects ALL file paths from `observations[].files[]` and `FILES[].FILE_PATH`
3. Calculates overlap ratio: `matchingPaths / totalPaths`
4. If `overlapRatio < 0.05` → **throws** with `ALIGNMENT_BLOCK` message

**Data shape exiting:** Unchanged `collectedData` — this is a pass/fail gate, not a transform.

**Error handling:** Throws on alignment failure — caught in `main()` at generate-context.js:439-452 with `process.exit(1)`.

**FINDING [P2]:** For stateless mode without OpenCode capture (simulation fallback), `collectedData` is `{ _isSimulation: true }` — `collectedData.observations` is undefined, so the alignment check is SKIPPED entirely. This is correct behavior (nothing to validate), but worth noting that simulation saves bypass all alignment protection.

**FINDING [P2]:** The keyword extraction uses `specFolderLeaf.split('-').filter(w => w.length >= 3)` at line 585. Short spec folder names like `001-api` produce keywords `["api"]` which is very broad — any file path containing "api" matches. This creates false-positive alignment (passes when it shouldn't) rather than false-negative (blocks when it shouldn't), so it is low-severity.

---

### Step 6: Spec Folder Resolution — `workflow.ts` lines 611-647

**Entry shape:** `collectedData`, `activeSpecFolderArg` (string or null)

**Code path:** `detectSpecFolder(collectedData, { specFolderArg })` called at line 612. This resolves the absolute spec folder path. Then lines 617-646 compute the relative `specFolderName` by iterating candidate specs directories and computing `path.relative()`.

**Data shape exiting:**
```
specFolder: string     // absolute path, e.g. "/project/specs/001-feature"
specFolderName: string // relative path, e.g. "001-feature" or "02--cat/001-feature"
```

**Error handling:** If `detectSpecFolder` throws (folder not found), it propagates to `main()` error handler. The fallback logic at lines 640-646 ensures `specFolderName` always resolves to at least `path.basename()`.

**Flow continuity:** Unbroken. Both values are passed downstream.

---

### Step 7: Enrichment — `enrichStatelessData()` at workflow.ts:433-527

**Guard:** Only runs if `isStatelessMode` (line 655).

**Entry shape:** `collectedData` (mutable reference), `specFolder` (absolute path), `projectRoot`

**Logic (parallel execution):**
1. `extractSpecFolderContext(specFolder)` — reads spec.md, plan.md, tasks.md etc. from the spec folder, produces observations, FILES, triggerPhrases, decisions, summary, recentContext
2. `extractGitContext(projectRoot)` — reads recent git log/diff, produces observations, FILES, summary

**Merging strategy:**
- Observations: append (no dedup)
- FILES: deduplicate by lowercase `FILE_PATH`
- triggerPhrases: append to `_manualTriggerPhrases`
- decisions: append to `_manualDecisions`
- summary: replaces if current is missing/generic ("Development session")
- recentContext: append

**Data shape exiting:** Mutated `collectedData` with enriched observations, FILES, triggerPhrases, decisions, summary, recentContext.

**Error handling:** Entire enrichment is wrapped in try/catch at line 523 — failure is non-fatal, logs warning and proceeds with un-enriched data.

**FINDING [P2]:** Both `extractSpecFolderContext` and `extractGitContext` use `.catch(() => null)` at lines 444-445. Errors are silently swallowed — no warning logged for individual extraction failures. Only the outer catch at 523 logs. If `extractSpecFolderContext` fails but `extractGitContext` succeeds, there is no indication that spec folder data is missing.

**FINDING [P1-DOWNGRADED-TO-P2]:** The function mutates `collectedData` in-place via property assignment. This is intentional (performance: avoids deep copy) and safe because `collectedData` is only consumed after this point. However, if `enrichStatelessData` partially fails (e.g., spec context succeeds, git context throws before merge), the mutation is partially applied with no rollback. The outer catch at 523 swallows the error but collectedData is already half-mutated. In practice this is low-risk because each merge section is independent.

---

### Step 8: Fan-out — `collectSessionData`, `extractConversations`, `extractDecisions`

**Entry shape:** `collectedData` (enriched), `specFolderName`

**Parallel execution at workflow.ts:673-721:**
```typescript
const [sessionData, conversations, decisions, diagrams, workflowData] = await Promise.all([...]);
```

**`collectSessionData(collectedData, specFolderName)` at collect-session-data.ts:611-819:**
- Line 659-666: If `collectedData` is null → returns simulation data
- Line 668-671: Extracts `observations`, `userPrompts`, `messageCount`
- Lines 677-692: Calls `extractFilesFromData`, builds `OUTCOMES`, computes `SUMMARY`
- Lines 746-755: Builds project state snapshot
- Lines 761-775: Builds continue-session data
- Returns `SessionData` with 50+ fields

**For simulation fallback `{ _isSimulation: true }`:**
- `collectedData.observations` is undefined → `observations = []`
- `collectedData.userPrompts` is undefined → `userPrompts = []`, `messageCount = 0`
- `collectedData.recentContext` is undefined → `sessionInfo = {}`
- `SUMMARY` falls through to default: `'Session focused on implementing and testing features.'`
- Everything proceeds with empty arrays

**Data shape exiting (SessionData):** Large object with TITLE, DATE, TIME, SPEC_FOLDER, FILES, OUTCOMES, OBSERVATIONS, SESSION_ID, etc.

**Error handling:** `collectSessionData` has individual try/catch for `detectRelatedDocs` (line 735-739). No catch around the main body — errors propagate to `Promise.all`.

**FINDING [P2]:** At collect-session-data.ts:687, `SUMMARY` construction:
```typescript
const SUMMARY: string = (sessionInfo as RecentContextEntry).learning
    || observations.slice(0, 3).map((o) => o.narrative).filter(Boolean).join(' ')
    || 'Session focused on implementing and testing features.';
```
For stateless enriched data, `sessionInfo` comes from `collectedData.recentContext?.[0]`. After enrichment, recentContext may have entries from spec-folder-extractor or git-context-extractor. The `learning` field from these extractors may be a spec summary or git message — this is acceptable and expected.

---

### Step 9: Render — Template Rendering

**Entry shape:** `sessionData`, `conversations`, `decisions`, `diagrams`, `workflowData`, `effectiveFiles`, `preExtractedTriggers`, `keyTopics`

**Code path:** workflow.ts:883-930 — `populateTemplate('context', { ... })` called with merged data.

**Key data fed to template:**
- `FILES: effectiveFiles` (post tree-thinning)
- `MESSAGES`, `DECISIONS`, `DIAGRAMS` from extractors
- `IMPLEMENTATION_SUMMARY` from semantic summarizer
- `TRIGGER_PHRASES: preExtractedTriggers`
- `TOPICS: keyTopics`
- `MEMORY_TITLE`, `MEMORY_DASHBOARD_TITLE`

**For simulation/stateless with empty data:**
- Most arrays are empty → template renders with placeholder/empty sections
- `isSimulation` check at line 960-964 prepends HTML comment warning

**Error handling:** No explicit try/catch — errors from `populateTemplate` propagate.

**Flow continuity:** Unbroken. Template output is a string stored in `files[ctxFilename]`.

---

### Step 10: Quality Scoring — `quality-scorer.ts` + `quality-scorer` (extractors)

**Entry shape:** Rendered markdown content string, plus trigger phrases, key topics, files, observations

**Two scoring systems run in sequence:**

1. **V2 scorer** (workflow.ts:997-1004): `scoreMemoryQualityV2()` — uses validation signals, contamination flag, message/tool/decision counts. Injects `quality_score` and `quality_flags` into frontmatter.

2. **Legacy scorer** (workflow.ts:1011-1017): `scoreMemoryQuality()` from `core/quality-scorer.ts` — scores on 6 dimensions:
   - `triggerPhrases` (0-20): Count-based
   - `keyTopics` (0-15): Count-based
   - `fileDescriptions` (0-20): Ratio of meaningful descriptions
   - `contentLength` (0-15): Line count thresholds
   - `noLeakedTags` (0-15): HTML tag detection (with code-block exclusion)
   - `observationDedup` (0-15): Title uniqueness ratio

**Quality gate** at line 1027-1034: If legacy `score < 15` and not simulation → throws `QUALITY_GATE_ABORT`.

**Data shape exiting:** Final markdown string with quality metadata injected into frontmatter.

**For simulation:** `isSimulation` is true → quality gate is bypassed (line 1028 condition `!isSimulation`).

**For stateless enriched:** Quality depends entirely on enrichment success. If `enrichStatelessData` produced observations and files, scoring should be reasonable. If enrichment failed silently, scoring will be low but may still pass the 15-point threshold.

---

## Data Shape Analysis

### Shape at Key Boundaries

| Boundary | Simulation Path | OpenCode Capture Path | Enriched Stateless Path |
|----------|----------------|----------------------|------------------------|
| After data-loader | `{ _isSimulation: true, _source: 'simulation' }` | `TransformedCapture` (full) | Same as OpenCode or simulation |
| After alignment check | Skipped (no observations) | Pass or throw | Pass or throw |
| After enrichStatelessData | Enriched with spec+git data | Enriched with spec+git data | Enriched with spec+git data |
| After collectSessionData | Simulation factory output | Full SessionData | Full SessionData |
| After template render | Warning-prefixed markdown | Full markdown | Full markdown |
| After quality scoring | Bypasses gate | Scored + gated | Scored + gated |

### Critical Type Transitions

1. **data-loader → workflow:** `LoadedData` (loose interface with `[key: string]: unknown`) → cast to `CollectedDataFull` (more specific). The `CollectedDataFull` interface has optional fields for everything, so the simulation `{ _isSimulation: true }` object technically satisfies the type — but consumers must null-check every field.

2. **enrichStatelessData mutation:** The function accepts `Record<string, any>` (line 434) rather than `CollectedDataFull`. This is intentionally loose to allow adding arbitrary properties. No type safety on the mutations.

3. **collectSessionData output → template:** `SessionData` is a large interface. Template rendering receives a spread of multiple objects — type mismatches would only surface at runtime if a template variable is referenced but missing.

---

## Gap Analysis

### Gap 1: Contamination Filter Scope (P1)

**Location:** workflow.ts:735-745
**Issue:** `filterContamination()` is applied only to `userPrompts[].prompt`. For stateless OpenCode capture, the richest content is in `observations[].narrative` (derived from `assistantResponse`) — these are NOT filtered.
**Impact:** Memory files in stateless mode may contain AI orchestration chatter ("Let me analyze", "I'll execute this step by step") in observation narratives that flow into SUMMARY, OUTCOMES, and OBSERVATIONS sections.
**Data path:** `assistantResponse` → `observation.narrative` → `SUMMARY` / `OUTCOMES` / `OBSERVATIONS_DETAILED` → template → rendered markdown.

### Gap 2: Silent Enrichment Failure (P2)

**Location:** workflow.ts:443-445
**Issue:** Individual enrichment extractors use `.catch(() => null)` without logging. If `extractSpecFolderContext` fails, the only signal is absence of spec-derived data — no warning appears.
**Impact:** Debugging enrichment failures requires adding logging; production failures are invisible.

### Gap 3: Simulation Bypasses All Guards (P2)

**Location:** workflow.ts:582-607, 1028
**Issue:** Simulation mode (`_isSimulation: true`) bypasses alignment check (no observations) and quality gate (`!isSimulation`). This is by design for placeholder data, but means the simulation path has effectively zero quality validation.
**Impact:** Low — simulation mode is explicitly warned about in output and is a known degraded mode.

---

## Findings

### P0 (Blockers)

None found.

### P1 (Required)

| ID | Finding | Location | Evidence | Impact |
|----|---------|----------|----------|--------|
| I02-F01 | Contamination filter not applied to observations | workflow.ts:735-745 | `filterContamination` called only on `rawUserPrompts.map(m => m.prompt)`. Observations from `transformOpencodeCapture` (input-normalizer.ts:464-472) carry raw `assistantResponse` text. | AI chatter in SUMMARY/OUTCOMES for stateless saves |

### Adversarial Self-Check (P1 Findings)

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| I02-F01: Contamination filter scope | P1 | The contamination filter's purpose is semantic summary quality (used in `generateImplementationSummary`). Observations feed a DIFFERENT downstream path (collectSessionData → SUMMARY/OUTCOMES). Contamination in observations was perhaps never intended to be filtered here since these are separate data channels. Also, the V2 quality scorer's `hadContamination` flag only reflects userPrompt contamination — so the scoring system is internally consistent. | **Confirmed P1** — Even if intentional, the result is that stateless memory files contain AI chatter in multiple sections. The contamination filter exists precisely to remove this chatter. Not applying it to the primary stateless data carrier (observations) is a gap regardless of original intent. | P1 |

### P2 (Suggestions)

| ID | Finding | Location | Evidence | Impact |
|----|---------|----------|----------|--------|
| I02-F02 | Silent enrichment failure swallowing | workflow.ts:443-445 | `.catch(() => null)` with no logging | Debugging difficulty |
| I02-F03 | Simulation bypasses all quality gates | workflow.ts:582-607, 1028 | `_isSimulation` not validated by alignment or quality gate | By design, but undocumented |
| I02-F04 | Broad keyword matching in alignment check | workflow.ts:585 | `specFolderLeaf.split('-')` produces short generic tokens | False-positive alignment (non-blocking) |
| I02-F05 | OpenCode capture relevance filter imprecision | input-normalizer.ts:408-416 | Substring matching of spec keywords in file paths | Possible irrelevant content inclusion |
| I02-F06 | `enrichStatelessData` accepts `Record<string, any>` | workflow.ts:434 | No type safety on mutations | Maintenance risk |

### P3 (Observations — no action needed)

- The stateless pipeline is well-structured with clear priority fallback (JSON → OpenCode → Simulation).
- Error handling at each priority level is graceful with informative logging.
- The enrichment step is correctly guarded as non-fatal.
- The alignment check correctly throws (not just warns) to prevent cross-spec contamination.
- The quality gate at score < 15 provides a meaningful safety net.

---

## Verdict

**Data flow is UNBROKEN end-to-end.** No step produces output that the next step cannot consume. Null/undefined propagation is handled through liberal use of `||` and `??` operators, and the simulation fallback always produces a consumable (if empty) data shape.

**One P1 gap exists:** The contamination filter's narrow scope means stateless OpenCode-capture saves will include AI orchestration chatter in observation-derived content (SUMMARY, OUTCOMES, OBSERVATIONS). This does not crash the pipeline but degrades output quality.

**Recommendation:** Apply `filterContamination()` to `observation.narrative` and `observation.title` fields in the enrichment or collection phase, before they flow into `collectSessionData()`.

---

*Generated by Agent I02 — Stateless Data Flow Tracer*
*Model: claude-opus-4-6*

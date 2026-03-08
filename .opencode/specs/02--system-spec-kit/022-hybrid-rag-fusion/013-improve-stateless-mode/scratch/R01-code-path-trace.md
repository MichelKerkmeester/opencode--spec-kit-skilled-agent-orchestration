# Stateless memory save code path trace

## Data Flow

### 1. Entry point: `generate-context.ts`
When the CLI is invoked with a spec folder instead of a JSON file, `parseArguments()` treats that as stateless mode: it assigns `CONFIG.SPEC_FOLDER_ARG` and explicitly sets `CONFIG.DATA_FILE = null` (`scripts/memory/generate-context.ts:266-279`). Nested spec-folder inputs do the same thing earlier in the function (`scripts/memory/generate-context.ts:259-263`).

`main()` then calls `runWorkflow()` with:

- `dataFile: CONFIG.DATA_FILE ?? undefined` -> `undefined` in stateless mode
- `specFolderArg: CONFIG.SPEC_FOLDER_ARG ?? undefined` -> populated from the CLI
- `loadDataFn: loadCollectedData`
- `collectSessionDataFn: collectSessionData`

This means the save still has an explicit target spec folder, but it no longer has a JSON payload to load (`scripts/memory/generate-context.ts:452-465`).

### 2. Loader behavior with `CONFIG.DATA_FILE = null`
Inside `loadCollectedData()`, the loader first resolves `dataFile` from options or `CONFIG.DATA_FILE` (`scripts/loaders/data-loader.ts:76-79`). With `CONFIG.DATA_FILE = null`, the JSON-file branch is skipped entirely because the `if (dataFile)` block does not run (`scripts/loaders/data-loader.ts:80-140`).

At that point the loader falls through to this stateless chain:

1. **OpenCode capture** (`scripts/loaders/data-loader.ts:142-178`)
2. **Simulation marker object** if capture is unavailable/empty (`scripts/loaders/data-loader.ts:180-186`)

If OpenCode capture succeeds, `transformOpencodeCapture(conversation, specFolderArg)` is called with the explicit CLI spec folder as a hint (`scripts/loaders/data-loader.ts:153-163`). That hint is important because it is the only thing keeping stateless mode aligned to the requested spec: it filters exchanges/tool calls to paths and text related to the target spec folder (`scripts/utils/input-normalizer.ts:353-382`, `scripts/utils/input-normalizer.ts:403-416`).

The transformed stateless payload contains only these fields:

- `userPrompts`
- `observations`
- `recentContext`
- `FILES`
- `_source: 'opencode-capture'`
- `_sessionId`
- `_capturedAt`

Notably, it does **not** populate `SPEC_FOLDER`, `preflight`, `postflight`, `_manualDecisions`, or `_manualTriggerPhrases` (`scripts/utils/input-normalizer.ts:453-482`).

### 3. Workflow handoff
`runWorkflow()` loads collected data, then resolves the spec folder separately through `detectSpecFolder(collectedData, { specFolderArg })` (`scripts/core/workflow.ts:424-448`). Because stateless mode still passes `specFolderArg`, folder selection remains anchored to the CLI target even though the collected data usually lacks `SPEC_FOLDER`.

The workflow's parallel extraction stage then calls `collectSessionData(collectedData, specFolderName)` with the resolved relative spec-folder name (`scripts/core/workflow.ts:488-506`).

### 4. `collectSessionData()` in stateless mode
`collectSessionData()` receives the sparse OpenCode-derived payload and the already-resolved `specFolderName` (`scripts/extractors/collect-session-data.ts:616-619`). Because `specFolderName` is passed in, it does **not** need to auto-detect the folder at the top of the function (`scripts/extractors/collect-session-data.ts:622-660`).

From the stateless payload it populates:

- `sessionInfo` from `recentContext?.[0]` (`scripts/extractors/collect-session-data.ts:673`)
- `observations` from `collectedData.observations || []` (`scripts/extractors/collect-session-data.ts:674`)
- `userPrompts` from `collectedData.userPrompts || []` (`scripts/extractors/collect-session-data.ts:675`)
- `messageCount` from `userPrompts.length` (`scripts/extractors/collect-session-data.ts:676`)
- `FILES` via `extractFilesFromData(collectedData, observations)` (`scripts/extractors/collect-session-data.ts:683`)
- `OUTCOMES` from the first ten observations (`scripts/extractors/collect-session-data.ts:685-690`)
- `SUMMARY` from `recentContext[0].learning`, else first three observation narratives, else the generic fallback sentence (`scripts/extractors/collect-session-data.ts:692-695`)
- session characteristics (`contextType`, `importanceTier`, `decisionCount`, `toolCounts`) from observations/prompts/files (`scripts/extractors/collect-session-data.ts:696-700`)
- `quickSummary` from observation titles, `recentContext.request`, `recentContext.learning`, or first prompt text (`scripts/extractors/collect-session-data.ts:701-715`)
- `OBSERVATIONS_DETAILED` using `collectedData.SPEC_FOLDER || folderName` as the anchor namespace (`scripts/extractors/collect-session-data.ts:716-719`)
- implementation-guide data from observations/files/folder (`scripts/extractors/collect-session-data.ts:741-743`)
- project-state snapshot / continue-session data from the same sparse inputs (`scripts/extractors/collect-session-data.ts:745-774`)

### 5. What remains empty in stateless mode
Because the OpenCode transformation never sets `SPEC_FOLDER`, `preflight`, `postflight`, or manual-decision metadata, downstream collection leaves several areas empty or defaulted:

- `specFolderPath` becomes `null` because it is only built from `collectedData.SPEC_FOLDER` (`scripts/extractors/collect-session-data.ts:725-730`)
- `SPEC_FILES` stays `[]` because related-doc detection only runs when `specFolderPath` exists (`scripts/extractors/collect-session-data.ts:731-739`)
- preflight/postflight metrics collapse to null/empty defaults via `extractPreflightPostflightData()` (`scripts/extractors/collect-session-data.ts:198-304`, `scripts/extractors/collect-session-data.ts:758`)
- any JSON-only manual decision / trigger metadata is absent because the stateless payload never carries `_manualDecisions` or `_manualTriggerPhrases` (`scripts/utils/input-normalizer.ts:474-482`)

### 6. If OpenCode capture fails
If no JSON file exists **and** OpenCode capture is unavailable or empty, `loadCollectedData()` returns `{ _isSimulation: true, _source: 'simulation' }` (`scripts/loaders/data-loader.ts:180-186`).

That object is still non-null, so `collectSessionData()` does **not** take its `!collectedData` early-return simulation factory branch (`scripts/extractors/collect-session-data.ts:664-671`). Instead it processes the marker as a sparse empty dataset:

- `observations = []`
- `userPrompts = []`
- `FILES = []`
- `SUMMARY = 'Session focused on implementing and testing features.'`
- `OUTCOMES = [{ OUTCOME: 'Session in progress' }]`
- `SPEC_FILES = []`
- all learning metrics remain null/empty

Separately, the workflow notices `_isSimulation` and prepends a simulation warning to the rendered memory content (`scripts/core/workflow.ts:781-786`).

## Data Loss Points

### Data loss point 1: skipping JSON normalization entirely
Stateful mode enters the `if (dataFile)` branch, reads the JSON, validates it, and normalizes/returns the full payload (`scripts/loaders/data-loader.ts:80-117`). Stateless mode skips that branch completely (`scripts/loaders/data-loader.ts:80-140`).

That is the major fork where the system loses access to structured fields that only exist in the JSON save contract, including:

- `SPEC_FOLDER`
- `preflight`
- `postflight`
- `filesModified` -> normalized `FILES`
- `sessionSummary`
- `technicalContext`
- `keyDecisions`
- `triggerPhrases`
- `_manualDecisions`
- `_manualTriggerPhrases`

### Data loss point 2: OpenCode transformation is intentionally narrower than JSON normalization
When stateless mode falls back to OpenCode capture, `transformOpencodeCapture()` reconstructs only a small subset of the full schema (`scripts/utils/input-normalizer.ts:353-482`). It can derive prompts, observations, a single `recentContext` row, and edited/written files, but it does not synthesize:

- `SPEC_FOLDER`
- preflight/postflight metrics
- technical-context observation blocks from structured JSON
- transformed key decisions from `keyDecisions`
- manual trigger phrases / manual decision arrays

So even a successful stateless capture produces a materially thinner collected-data object than stateful mode.

### Data loss point 3: missing `SPEC_FOLDER` disables related-doc enrichment
`collectSessionData()` only computes `specFolderPath` from `collectedData.SPEC_FOLDER` (`scripts/extractors/collect-session-data.ts:725-730`). In stateless mode that field is normally missing, even though `folderName` is known.

Result: `detectRelatedDocs()` is never called and these outputs remain empty:

- `SPEC_FILES`
- `HAS_SPEC_FILES`
- resume-context entries that depend on spec docs such as `tasks.md`, `checklist.md`, and `plan.md` (`scripts/extractors/collect-session-data.ts:531-535`, `scripts/extractors/collect-session-data.ts:574`)

This is one of the clearest avoidable loss points: the CLI target folder is known, but the collector only uses `collectedData.SPEC_FOLDER` for doc discovery.

### Data loss point 4: missing learning telemetry collapses to null/default values
`extractPreflightPostflightData()` expects structured `preflight` and `postflight` objects (`scripts/extractors/collect-session-data.ts:198-304`). JSON mode can provide those directly; stateless OpenCode capture never does.

Resulting losses in stateless mode:

- `HAS_PREFLIGHT_BASELINE = false`
- `HAS_POSTFLIGHT_DELTA = false`
- all `PREFLIGHT_*` numeric/string fields become `null` or `[]`
- all `POSTFLIGHT_*` fields become `null`
- all delta fields become `null`
- `LEARNING_INDEX = null`
- `LEARNING_SUMMARY` falls back to the generic explanatory sentence

### Data loss point 5: simulation fallback removes nearly all semantic session content
When OpenCode capture fails, the loader returns only the simulation marker object (`scripts/loaders/data-loader.ts:180-186`). Because that object has no prompts, observations, files, or recent context, the downstream collector fabricates broad defaults rather than real session content (`scripts/extractors/collect-session-data.ts:673-817`).

Compared with successful stateful mode, this loses essentially everything evidence-based:

- real prompts/messages
- real observations and outcomes
- real files changed
- real quick summary / summary
- real tool counts and decision counts
- real project phase / last action / next action
- all learning telemetry

## Current Fallback Chain

1. **CLI parsing selects stateless mode** when the first argument is a spec folder path/name; `CONFIG.DATA_FILE` is set to `null`, `CONFIG.SPEC_FOLDER_ARG` is preserved (`scripts/memory/generate-context.ts:266-279`).
2. **`runWorkflow()` passes the explicit spec folder forward** even without a data file (`scripts/memory/generate-context.ts:460-465`).
3. **`loadCollectedData()` fallback order** with `dataFile = null`:
   - Skip JSON-file loading (`scripts/loaders/data-loader.ts:80-140`)
   - Try OpenCode capture (`scripts/loaders/data-loader.ts:142-178`)
   - If capture succeeds, transform to sparse collected data using `specFolderArg` as a relevance filter (`scripts/loaders/data-loader.ts:162-163`, `scripts/utils/input-normalizer.ts:356-382`)
   - If capture fails/empty, return `{ _isSimulation: true, _source: 'simulation' }` (`scripts/loaders/data-loader.ts:180-186`)
4. **`detectSpecFolder()` fallback order** after data loading:
   - Priority 1: explicit CLI `specFolderArg` (`scripts/spec-folder/folder-detector.ts:810-898`)
   - Priority 2: `collectedData.SPEC_FOLDER` from JSON or other structured input (`scripts/spec-folder/folder-detector.ts:900-985`)
   - Priority 2.5: session-learning DB lookup (`scripts/spec-folder/folder-detector.ts:987-1048`)
   - Priority 3: current working directory if already inside a `specs/` path (`scripts/spec-folder/folder-detector.ts:1050-1056`)
   - Priority 4: auto-detect/rank folders from specs roots (`scripts/spec-folder/folder-detector.ts:1058-1115`)
5. **`collectSessionData()` consumes whatever sparse data survived** and fills many final fields from defaults/fallbacks rather than structured save payloads (`scripts/extractors/collect-session-data.ts:673-817`).
6. **Workflow rendering adds a simulation warning** when `_isSimulation` is present (`scripts/core/workflow.ts:781-786`).

## Comparison Table

| Field / capability | Stateful (JSON file mode) | Stateless (OpenCode capture mode) | Stateless if capture fails |
| --- | --- | --- | --- |
| `CONFIG.DATA_FILE` | Populated with JSON path (`scripts/memory/generate-context.ts:277-278`) | `null` (`scripts/memory/generate-context.ts:273-275`) | `null` |
| `SPEC_FOLDER_ARG` | Optional CLI override | Required/primary targeting mechanism | Required/primary targeting mechanism |
| Collected-data source | `normalizeInputData(rawData)` from JSON (`scripts/loaders/data-loader.ts:108-116`) | `transformOpencodeCapture()` (`scripts/loaders/data-loader.ts:153-163`) | `{ _isSimulation: true, _source: 'simulation' }` (`scripts/loaders/data-loader.ts:186`) |
| `SPEC_FOLDER` in collected data | Can be preserved from JSON `specFolder` (`scripts/utils/input-normalizer.ts:233-235`) | Empty by default; transform does not set it (`scripts/utils/input-normalizer.ts:474-482`) | Empty |
| `userPrompts` | Fully controlled by JSON or normalized from summary (`scripts/utils/input-normalizer.ts:223-273`) | Derived from captured exchanges (`scripts/utils/input-normalizer.ts:384-387`) | Empty |
| `observations` | Can include session summary, key decisions, technical context, or provided observations (`scripts/utils/input-normalizer.ts:244-263`) | Derived only from assistant responses + relevant tool calls (`scripts/utils/input-normalizer.ts:389-450`) | Empty |
| `recentContext` | Preserved from JSON or synthesized from `sessionSummary` (`scripts/utils/input-normalizer.ts:270-273`) | Single synthesized row from first user input / last assistant response (`scripts/utils/input-normalizer.ts:453-456`) | Empty |
| `FILES` | Preserved from JSON `FILES` or normalized from `filesModified` (`scripts/utils/input-normalizer.ts:237-242`) | Derived only from relevant edit/write tool calls (`scripts/utils/input-normalizer.ts:458-472`) | Empty |
| `preflight` / `postflight` | Available if JSON includes them (`generate-context.ts` help format `scripts/memory/generate-context.ts:73-101`) | Not populated | Not populated |
| `_manualDecisions` | Populated from JSON `keyDecisions` (`scripts/utils/input-normalizer.ts:279-280`) | Empty | Empty |
| `_manualTriggerPhrases` | Populated from JSON `triggerPhrases` (`scripts/utils/input-normalizer.ts:275-277`) | Empty | Empty |
| Spec-folder detection | Can use CLI arg or `collectedData.SPEC_FOLDER` | Mostly depends on CLI arg because collected data lacks `SPEC_FOLDER` | Depends on CLI arg, then later fallbacks |
| `SPEC_FILES` / related docs | Available when `collectedData.SPEC_FOLDER` exists and resolves (`scripts/extractors/collect-session-data.ts:725-739`) | Usually empty because `SPEC_FOLDER` is absent | Empty |
| Learning metrics (`PREFLIGHT_*`, `POSTFLIGHT_*`, deltas, `LEARNING_INDEX`) | Populated from JSON telemetry (`scripts/extractors/collect-session-data.ts:198-304`) | Null / defaulted | Null / defaulted |
| Final summary quality | Can reflect structured session summary and decisions | Depends on captured conversation quality; often thinner | Generic fallback summary + simulation warning |
| Traceability / fidelity | Highest fidelity; explicit structured save contract | Medium fidelity; reconstructed from conversation/tool traces | Lowest fidelity; mostly placeholders/defaults |

## Bottom line
Stateless mode is not failing because it cannot identify the target spec folder; the CLI spec-folder path survives correctly and is respected all the way through detection. The real loss happens earlier: once `CONFIG.DATA_FILE` is null, the system abandons the rich JSON schema and reconstructs only a reduced session model from OpenCode capture, leaving `SPEC_FOLDER`, telemetry, related-doc enrichment, and other structured fields empty by design.

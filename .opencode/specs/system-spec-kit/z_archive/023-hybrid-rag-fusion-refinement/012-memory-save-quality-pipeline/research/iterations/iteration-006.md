# Iteration 006: Data Loader + Generate Context -- JSON Input Pipeline

## Focus
Deep-read `data-loader.ts` and `generate-context.ts`. Map how `--json` input is parsed, validated, and converted to `CollectedDataFull`. Document which JSON fields are accepted, which are rejected (the "Unknown field" warnings), and what the `filesChanged` field status is.

## Findings

### 1. Three Input Modes, All Converge to the Same Path

`generate-context.ts` `parseArguments()` (lines 393-433) handles three modes:

| Mode | Entry | Data Flow |
|------|-------|-----------|
| `--json '<string>'` | line 414 | `parseStructuredModeArguments('--json', ...)` -> `parseStructuredJson()` -> payload object |
| `--stdin` | line 414 | `parseStructuredModeArguments('--stdin', ...)` -> `readAllStdin()` -> `parseStructuredJson()` -> payload object |
| File path arg | line 428 | `dataFile = primaryArg` -> `loadCollectedData()` -> `fs.readFile()` -> `JSON.parse()` |

For `--json` and `--stdin`, the parsed payload is stored in `parsed.collectedData` (line 382-386) with `_source: 'file'` hardcoded.

[SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:393-433]

### 2. The --json / --stdin Path Bypasses data-loader.ts Entirely

In `main()` at lines 558-567:
```typescript
await runWorkflow({
  dataFile: parsed.collectedData ? undefined : CONFIG.DATA_FILE,
  specFolderArg: CONFIG.SPEC_FOLDER_ARG,
  collectedData: parsed.collectedData ?? undefined,
  loadDataFn: parsed.collectedData
    ? undefined          // <-- NO loadCollectedData call
    : () => loadCollectedData({}),
  collectSessionDataFn: collectSessionData,
});
```

When `parsed.collectedData` is present (i.e., `--json` or `--stdin`), `loadDataFn` is `undefined`. The `collectedData` object goes directly to `runWorkflow()` without passing through `data-loader.ts`'s `loadCollectedData()`.

However, `validateInputData()` and `normalizeInputData()` from `input-normalizer.ts` are still called. The validation happens at `generate-context.ts` line 100 indirectly -- actually no, for `--json`/`--stdin`, validation is NOT called by `data-loader.ts` since that module is bypassed. The question is whether `runWorkflow()` calls validation.

[SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:558-567]

### 3. For File-Path Mode, data-loader.ts Validates and Normalizes

`loadCollectedData()` (data-loader.ts lines 59-135):
1. Validates the file path against allowed directories (SEC-001, lines 76-95)
2. Reads file content via `fs.readFile()` (line 97)
3. Parses JSON (line 98)
4. Calls `validateInputData(rawData, specFolderArg)` (line 100)
5. Calls `normalizeInputData(rawData)` (line 103)
6. Returns `{ ...data, _source: 'file' }` (line 105)

The allowed base directories are: `os.tmpdir()`, `/tmp`, `/private/tmp`, `process.cwd()`, `cwd/specs`, `cwd/.opencode` (lines 76-83).

[SOURCE: .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:59-105]

### 4. Complete Accepted Fields Map (from KNOWN_RAW_INPUT_FIELDS)

The `input-normalizer.ts` defines `KNOWN_RAW_INPUT_FIELDS` at lines 750-772. Any field NOT in this set triggers `[WARN] Unknown field in input data: "<key>" -- this field will be ignored` (line 789-791).

**Accepted fields (camelCase / snake_case variants):**

| Field | Variants | Type | Purpose |
|-------|----------|------|---------|
| specFolder | `specFolder`, `spec_folder`, `SPEC_FOLDER` | string | Target spec folder |
| filesModified | `filesModified`, `files_modified` | string[] or object[] | Files changed during session |
| sessionSummary | `sessionSummary`, `session_summary` | string | Main session description |
| keyDecisions | `keyDecisions`, `key_decisions` | (string\|object)[] | Decisions made |
| nextSteps | `nextSteps`, `next_steps` | string[] | Follow-up actions |
| technicalContext | `technicalContext` | Record<string,unknown> | Key-value technical details |
| triggerPhrases | `triggerPhrases`, `trigger_phrases` | string[] | Manual trigger phrases |
| importanceTier | `importanceTier`, `importance_tier` | string | Memory importance tier |
| contextType | `contextType`, `context_type` | string (enum) | Memory context type |
| projectPhase | `projectPhase`, `project_phase` | string | Project phase label |
| toolCalls | `toolCalls` | object[] | AI-summarized tool calls |
| exchanges | `exchanges` | object[] | User-assistant exchanges |
| FILES | `FILES` | object[] | Pre-structured file entries |
| observations | `observations` | object[] | Pre-structured observations |
| userPrompts | `userPrompts`, `user_prompts` | object[] | Pre-structured user prompts |
| recentContext | `recentContext`, `recent_context` | object[] | Pre-structured recent context |
| preflight/postflight | `knowledgeScore`, `uncertaintyScore`, `contextScore`, `knowledgeGaps`, `gapsClosed`, `newGapsDiscovered` + snake_case variants | number/array | Epistemic tracking |

[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:750-772]

### 5. `filesChanged` Is NOT an Accepted Field -- It Will Trigger "Unknown field" Warning

The accepted field names are `filesModified` / `files_modified` and `FILES`. There is **no** `filesChanged` or `files_changed` variant anywhere in the codebase. A Grep search for `filesChanged` across the entire scripts directory returned zero matches.

If an AI agent sends `{ "filesChanged": [...] }`, the validator will:
1. Log `[WARN] Unknown field in input data: "filesChanged" -- this field will be ignored` (line 789-791)
2. The data in that field will be silently dropped -- no files will appear in the memory output

This is a significant discoverability issue since `filesChanged` is a natural field name an AI might use.

[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:789-791]
[INFERENCE: based on Grep returning zero results for filesChanged across the scripts directory and the KNOWN_RAW_INPUT_FIELDS set not containing it]

### 6. Two Normalization Paths: Fast-Path vs Slow-Path

`normalizeInputData()` has two distinct code paths:

**Fast-path (lines 468-569):** Triggered when input already has `userPrompts`, `observations`, or `recentContext`. Clones input, backfills missing arrays, converts `filesModified` to `FILES`, propagates metadata. Returns the patched clone.

**Slow-path (lines 571-737):** Triggered for manual/simple JSON input (no pre-structured arrays). Builds everything from scratch:
- `sessionSummary` -> feature observation (line 628)
- `keyDecisions` -> decision observations via `transformKeyDecision()` (lines 636-643)
- `technicalContext` -> implementation observation + `TECHNICAL_CONTEXT` array (lines 645-649)
- `nextSteps` -> followup observation (lines 651-653)
- `exchanges` -> promoted to `userPrompts` (lines 662-673)
- `toolCalls` -> implementation observations (lines 676-690)
- Creates synthetic `userPrompts` from sessionSummary (lines 693-695)
- Creates synthetic `recentContext` from sessionSummary (lines 697-700)

**Key difference:** The fast-path preserves existing arrays and only backfills. The slow-path constructs everything. Most `--json` saves from AI agents will hit the **slow-path** since they typically provide `sessionSummary` + `keyDecisions` without pre-structured `userPrompts`/`observations`.

[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:445-737]

### 7. The `--json` Path Does NOT Run `validateInputData()`

Tracing the flow for `--json`:
1. `parseArguments()` -> `parseStructuredModeArguments()` -> `parseStructuredJson()` (line 368) -- only validates it is valid JSON and a non-null object
2. Returns `collectedData = { ...payload, _source: 'file' }` (lines 382-386)
3. `main()` calls `runWorkflow({ collectedData: parsed.collectedData })` with `loadDataFn: undefined`
4. `runWorkflow()` presumably receives `collectedData` and processes it

The `validateInputData()` call at data-loader.ts line 100 only runs in the file-path mode. For `--json`/`--stdin`, the "Unknown field" warnings from `validateInputData()` are **never triggered** unless `runWorkflow()` calls validation separately.

This means the `--json` path has weaker validation than the file-path mode -- unknown fields are silently accepted without even a warning.

[SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:348-388]
[INFERENCE: based on data-loader.ts being bypassed for --json/--stdin modes and parseStructuredJson only checking JSON validity]

### 8. Spec Folder Resolution Priority

The spec folder is resolved with a clear priority chain in `parseStructuredModeArguments()` (lines 369-373):

1. **Explicit CLI target** (highest): `args[mode === '--stdin' ? 1 : 2]` -- the argument after `--json <string>`
2. **Payload specFolder** (fallback): extracted from the JSON payload via `extractPayloadSpecFolder()`

Both are passed through `resolveCliSpecFolderReference()` for path resolution. If neither produces a value, the function throws.

[SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:369-377]

## Ruled Out
- `filesChanged` as an accepted alias -- confirmed not present anywhere in the codebase
- `data-loader.ts` processing `--json` input -- it is completely bypassed for structured input modes

## Dead Ends
None.

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` (full file, 607 lines)
- `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` (full file, 143 lines)
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` (lines 72-100, 198-261, 445-737, 750-810)
- Grep search for `filesChanged` across scripts directory (zero matches)

## Assessment
- New information ratio: 1.0
- Questions addressed: ["How should extractConversations() build MESSAGES from sessionSummary/keyDecisions/observations when userPrompts is empty?", "What is the minimum viable JSON payload that should produce a >= 50/100 quality memory?"]
- Questions answered: ["How should extractConversations() build MESSAGES from sessionSummary/keyDecisions/observations when userPrompts is empty?" (partially -- the slow-path synthesizes userPrompts from sessionSummary)]

## Reflection
- What worked and why: Reading generate-context.ts first to understand the CLI entry points, then tracing the data flow into data-loader.ts and input-normalizer.ts, revealed that `--json` completely bypasses the data-loader and its validation. This is a significant architectural finding -- the two input paths have different validation coverage.
- What did not work and why: N/A -- direct code reading was effective.
- What I would do differently: For the fix, there are two distinct issues: (1) `filesChanged` should be added as an alias for `filesModified` in KNOWN_RAW_INPUT_FIELDS and the normalization logic, and (2) `validateInputData()` should be called for `--json`/`--stdin` input as well, not just file-path input.

## Recommended Next Focus
Investigate `runWorkflow()` in `core/workflow.ts` to determine whether it calls `validateInputData()` or `normalizeInputData()` for the `collectedData` path -- this will confirm or refute finding 7. Also trace how `collectedData` becomes `CollectedDataFull` that the extractors consume.

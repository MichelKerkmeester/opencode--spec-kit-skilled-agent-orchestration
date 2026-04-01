# Iteration 10: End-to-End Data Flow for JSON-Mode Save

## Focus
Map the complete data flow for a JSON-mode save from CLI `--json` argument through data loading, normalization, extraction, template rendering, quality scoring, contamination checks, validation rules, and final file write. Identify every point where structured JSON data is lost, ignored, or fails to reach the rendered output.

## Findings

### 1. Phase 1: CLI Argument Parsing (generate-context.ts lines 344-388)

When `--json '<data>'` is passed:
1. `parseStructuredModeArguments('--json', args)` is called (line 414-416)
2. The raw JSON string is parsed via `parseStructuredJson()` (line 368)
3. `specFolder` is extracted from either explicit CLI arg (position after --json) or from payload's `specFolder`/`spec_folder`/`SPEC_FOLDER` keys (line 370-373)
4. The parsed payload is tagged with `_source: 'file'` (line 383) -- this is CRITICAL: all JSON-mode saves are marked as source `'file'`
5. The result is passed to `runWorkflow()` as `collectedData` (line 558-567)

**Data loss point**: None at this stage -- the full payload is passed through.

[SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:344-388, 546-567]

### 2. Phase 2: Workflow Entry -- loadDataFn vs collectedData (workflow.ts lines 585-627)

When `preloadedData` (= `collectedData`) is provided, the workflow uses it directly (line 613-614). The `loadDataFn` and `loadCollectedDataFromLoader` paths are SKIPPED. This means:

- JSON-mode saves **bypass** `data-loader.ts` entirely
- JSON-mode saves **bypass** `input-normalizer.ts normalizeInputData()` and `validateInputData()`

**Data loss point**: The normalization step that converts `sessionSummary` to `userPrompts[]`, `observations[]`, and `_manualDecisions[]` is IN `normalizeInputData()` -- but for JSON-mode with preloadedData, this code path is NOT taken IF the payload already has userPrompts/observations fields.

Wait -- let me trace this more carefully. Looking at generate-context.ts line 558-563:
```
runWorkflow({
  dataFile: parsed.collectedData ? undefined : CONFIG.DATA_FILE,
  collectedData: parsed.collectedData ?? undefined,
  loadDataFn: parsed.collectedData ? undefined : () => loadCollectedData({}),
})
```

When `--json` is used, `parsed.collectedData` is set (line 380-384), so:
- `dataFile` = undefined
- `collectedData` = the parsed JSON with `_source: 'file'`
- `loadDataFn` = undefined

In workflow.ts, since `preloadedData` is truthy, we go to line 613: `collectedData = preloadedData`.

**CRITICAL**: The preloaded data is used AS-IS with just the `_source: 'file'` tag. It has NOT been through `normalizeInputData()`.

BUT WAIT -- for `--json` to produce normalized data, the data must go through normalization somewhere. Let me check if `parseStructuredModeArguments` does any normalization... It does NOT. It just parses JSON and adds `_source: 'file'`.

However, looking at data-loader.ts (the FILE path, not preloadedData path): when a JSON file path is provided (not --json), data-loader.ts calls `normalizeInputData(rawData)` at line 103. This normalization IS what converts `sessionSummary` -> `userPrompts` and `keyDecisions` -> `_manualDecisions`.

**VERDICT**: For `--json` and `--stdin` modes, normalization DOES NOT HAPPEN at the data-loader level. The raw JSON payload goes directly to workflow.ts.

BUT there's a safety net: `input-normalizer.ts normalizeInputData()` has TWO code paths:
1. **Fast-path** (line 468): If payload already has `userPrompts` or `observations` or `recentContext`, it clones and backfills missing fields
2. **Slow-path** (line 617+): If payload has NONE of these, it builds them from `sessionSummary`, `keyDecisions`, etc.

For `--json` preloaded data: the payload typically has `sessionSummary` and `keyDecisions` but NOT `userPrompts`/`observations`. In this case, normalization would go through the slow-path... IF it were called.

**ROOT CAUSE IDENTIFIED**: For `--json`/`--stdin`, the payload is NOT normalized at all. The raw `sessionSummary` and `keyDecisions` fields sit as top-level properties on `collectedData`, but the extractors expect `userPrompts[]` and `observations[]`.

[SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:558-567]
[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:613-614]
[SOURCE: .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:100-105]
[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:445-544, 617-700]

### 3. Phase 3: Contamination Cleaning (workflow.ts lines 720-853)

Before extraction, workflow.ts applies contamination cleaning to:
- `collectedData.observations` (line 781)
- `collectedData.SUMMARY` (line 782-783)
- `collectedData._JSON_SESSION_SUMMARY` (line 785-788)
- `collectedData._manualDecisions` (line 790-802)
- `collectedData.recentContext` (line 804-810)
- `collectedData.TECHNICAL_CONTEXT` (line 812-817)

**Data loss point for JSON-mode**: For a raw `--json` payload that skipped normalization:
- `collectedData.observations` is likely undefined or empty -> cleaning is a no-op
- `collectedData.SUMMARY` is likely undefined -> no-op
- `collectedData._JSON_SESSION_SUMMARY` is NOT set (this is set later by `collectSessionData` at line 1034)
- `collectedData._manualDecisions` is NOT set (this would be set by normalizer)
- The raw `sessionSummary` and `keyDecisions` fields ARE on the object but are NOT cleaned here because the cleaning code does not know about these raw field names

**HOWEVER**: Looking more carefully at the condition on line 468 of input-normalizer.ts, the fast-path check is:
```
if (data.userPrompts || data.user_prompts || data.observations || data.recentContext || data.recent_context)
```

If the JSON payload has NONE of these fields (typical for AI-composed JSON with `sessionSummary` + `keyDecisions`), then the normalizer slow-path (line 617+) would be taken. But again, this normalizer is NOT called for `--json` preloaded data.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:720-853]

### 4. Phase 4: Session Data Collection (workflow.ts lines 979-984)

The `collectSessionData()` function (from `collect-session-data.ts`) is called with `narrativeCollectedData` which is a re-wrapped version of collectedData. This function:
1. Reads from `data.sessionSummary` (line 1034 in collect-session-data.ts) to set `_JSON_SESSION_SUMMARY`
2. Builds SUMMARY, QUICK_SUMMARY, TITLE from the data

This is where `sessionSummary` finally gets used -- but only for metadata/title purposes. It does NOT produce MESSAGES for the conversation extractor.

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1032-1035]

### 5. Phase 5: Conversation Extraction (workflow.ts lines 986-991)

`extractConversations(collectedData)` iterates over `collectedData.userPrompts[]` (conversation-extractor.ts line 71-93). For each user prompt:
1. Creates a User message with the prompt text
2. Time-correlates with observations to find related tool calls
3. Creates Assistant messages from related observations

**DATA LOSS POINT (CRITICAL)**: For JSON-mode saves that skipped normalization:
- `collectedData.userPrompts` is likely undefined or empty
- `collectedData.observations` is likely undefined or empty
- Result: `MESSAGES = []`, `MESSAGE_COUNT = 0`, `TOOL_COUNT = 0`

The conversation extractor NEVER looks at `sessionSummary` or `keyDecisions` directly. It only operates on `userPrompts` and `observations`.

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:51-81, 93-166]

### 6. Phase 6: Decision Extraction (workflow.ts lines 992-996)

`extractDecisions(collectedData)` looks for decisions in:
1. `collectedData.observations` with type 'decision'
2. `collectedData._manualDecisions`

For JSON-mode: observations are empty AND `_manualDecisions` was never set (normalization was skipped), so `DECISIONS = []`.

BUT there's a nuance: the normalizer fast-path (line 546-563) does set `_manualDecisions` from `keyDecisions` IF the fast-path is triggered. Since `--json` bypass normalization entirely, `_manualDecisions` is never populated.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:992-996]
[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:546-563]

### 7. Phase 7: Template Rendering (workflow.ts lines 1116+)

`populateTemplate()` receives the extracted data including:
- `conversations.MESSAGES` (empty for JSON-mode)
- `decisions.DECISIONS` (empty for JSON-mode)
- `sessionData.SUMMARY` (populated from sessionSummary)
- Various metadata fields

The template renderer uses these to fill Mustache-like template variables. With empty MESSAGES and DECISIONS, the template renders:
- Empty conversation section (or "No conversations recorded")
- Empty decisions section (or fallback "No specific decisions were made" -> triggers V4)
- Empty tool executions section
- Potentially placeholder values in fields that depend on conversation data

**The rendered content** is mostly boilerplate + metadata, with very thin substantive content.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1116-1170]

### 8. Phase 8: Quality Scoring (workflow.ts post-template)

The quality scorer evaluates dimensions based on the rendered content. With thin content from JSON-mode:
- Low conversation depth score
- Low decision richness score
- Potentially low trigger phrase extraction (V5 risk)
- Overall quality score likely below 50/100

[INFERENCE: Based on empty MESSAGES/DECISIONS flowing into quality dimensions]

### 9. Phase 9: Post-Render Validation (validate-memory-quality.ts)

The rendered memory content is validated by `validateMemoryQualityContent()`. For a thin JSON-mode save:
- V1 may fire if `decisions` frontmatter contains [TBD] from unfilled template
- V4 fires from "No specific decisions were made" fallback text
- V6 may fire from empty template placeholder patterns
- V13 may fire if body content < 50 non-whitespace chars

If V1 or V13 fires: `disposition = 'abort_write'` -- the memory file is NOT written at all.

[INFERENCE: Based on iteration-009 rule analysis combined with thin rendered content]

### 10. Complete Flow Diagram

```
--json '{"sessionSummary":"...", "keyDecisions":["..."], "specFolder":"..."}'
  |
  v
[1] parseStructuredModeArguments() -- generate-context.ts:344
  |  Parses JSON, extracts specFolder, tags _source:'file'
  |  OUTPUT: { collectedData: { sessionSummary, keyDecisions, _source:'file' }, specFolderArg }
  |
  v
[2] runWorkflow({ collectedData }) -- workflow.ts:585
  |  preloadedData is truthy -> uses directly (line 613)
  |  **BYPASS**: normalizeInputData() is NEVER called
  |  collectedData has raw fields: sessionSummary, keyDecisions
  |  collectedData MISSING: userPrompts, observations, _manualDecisions
  |
  v
[3] Contamination cleaning -- workflow.ts:720-853
  |  Cleans: observations (empty), SUMMARY (undefined), _JSON_SESSION_SUMMARY (unset)
  |  Does NOT clean: sessionSummary (raw field, not recognized)
  |  Does NOT set: _manualDecisions (would need normalizer)
  |  RESULT: collectedData unchanged
  |
  v
[4] collectSessionData() -- workflow.ts:979-984
  |  Reads data.sessionSummary -> sets _JSON_SESSION_SUMMARY
  |  Builds SUMMARY, QUICK_SUMMARY from sessionSummary
  |  OUTPUT: sessionData with title/summary metadata
  |
  v
[5] extractConversations() -- workflow.ts:986-991
  |  Reads collectedData.userPrompts (EMPTY or undefined)
  |  Reads collectedData.observations (EMPTY or undefined)
  |  **DATA LOSS**: sessionSummary content NOT converted to messages
  |  OUTPUT: { MESSAGES: [], MESSAGE_COUNT: 0, TOOL_COUNT: 0 }
  |
  v
[6] extractDecisions() -- workflow.ts:992-996
  |  Reads collectedData.observations (EMPTY)
  |  Reads collectedData._manualDecisions (UNSET)
  |  **DATA LOSS**: keyDecisions NOT converted to _manualDecisions
  |  OUTPUT: { DECISIONS: [] }
  |
  v
[7] populateTemplate() -- workflow.ts:1116+
  |  Receives empty MESSAGES, empty DECISIONS
  |  sessionData.SUMMARY is populated (from step 4)
  |  Renders template with mostly empty sections
  |  OUTPUT: Thin markdown with boilerplate + summary metadata
  |
  v
[8] Quality scoring
  |  Low scores on conversation/decision dimensions
  |  OUTPUT: qualityScore likely < 50
  |
  v
[9] validateMemoryQualityContent() -- validate-memory-quality.ts
  |  V1: May fire (placeholder [TBD] in empty template fields)
  |  V4: Fires ("No specific decisions were made")
  |  V6: May fire (empty template placeholders)
  |  V13: May fire (body < 50 non-whitespace chars)
  |  If V1 or V13: disposition = abort_write -> FILE NOT WRITTEN
  |
  v
[10] File write + indexing
    If validation passes: writes thin memory file
    If V2/V12: writes but skips indexing (invisible to search)
    If V1/V3/V8/V9/V11/V13: aborts write entirely
```

### 11. The Normalization Gap -- Root Cause

The fundamental issue is at step [2]. There are two valid entry paths:

**Path A (file-based)**: `--json data.json` -> `data-loader.ts` -> `normalizeInputData()` -> fast/slow-path normalization -> `collectedData` with `userPrompts`, `observations`, `_manualDecisions` populated

**Path B (inline JSON)**: `--json '{...}'` -> `parseStructuredModeArguments()` -> `collectedData` with raw fields only -> normalization SKIPPED

Path B skips the normalization that Path A gets. This creates the cascade failure where extractors receive empty arrays because the raw `sessionSummary` and `keyDecisions` were never converted to the format extractors expect.

[SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:558-567]
[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:613-627]

## Ruled Out
- Template renderer as root cause: The renderer works correctly with whatever data it receives. The problem is upstream.
- Quality scorer as root cause: The scorer accurately reflects the thin content it receives.

## Dead Ends
None -- the data flow trace was productive at every step.

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` (lines 1-607)
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (lines 585-1170)
- `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` (lines 1-143)
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` (lines 445-700)
- `.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts` (lines 50-200)
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` (line 1032-1035)

## Assessment
- New information ratio: 1.0
- Questions addressed: ["How should extractConversations() build MESSAGES from sessionSummary/keyDecisions when userPrompts is empty?", "What is the minimum viable JSON payload that should produce a >= 50/100 quality memory?"]
- Questions answered: ["How should extractConversations() build MESSAGES from sessionSummary/keyDecisions when userPrompts is empty?" -- Currently it CANNOT. The normalization that would convert sessionSummary to userPrompts is skipped for --json/--stdin mode. The fix must either: (a) call normalizeInputData() on the preloaded data in workflow.ts before extraction, or (b) make extractConversations() aware of raw sessionSummary/keyDecisions fields.]

## Reflection
- What worked and why: Tracing the code path from CLI entry through each pipeline stage revealed the exact normalization gap. Following the actual function call chain (not just reading individual files) was essential to spot the bypass.
- What did not work and why: N/A -- the trace approach was productive.
- What I would do differently: Would also trace the `data.json` file path (Path A) to confirm normalization DOES produce the expected intermediate format, providing a reference implementation for the fix.

## Recommended Next Focus
Design the specific fix: determine whether to (a) add normalization call in workflow.ts for preloaded data, (b) make extractors sessionSummary-aware, or (c) move normalization into parseStructuredModeArguments(). Estimate LOC and regression risk for each option.

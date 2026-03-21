# Iteration 6 (A6): Enrichment Priority Chains in workflow.ts + Fast Path filesModified Drop

## Focus
Q1: Trace enrichment priority chains in workflow.ts -- for every field where explicit JSON input and enrichment both contribute, what is the exact merge priority?
Q11: Confirm that the fast path drops `filesModified` when `userPrompts` is present.

## Findings

### Finding 1: Fast Path vs Slow Path Architecture (Q11 CONFIRMED)

The `normalizeInputData()` function in `input-normalizer.ts:414-530` has TWO distinct paths:

**Fast path** (line 437-491): Activated when ANY of these fields exist: `userPrompts`, `user_prompts`, `observations`, `recentContext`, `recent_context`. This path:
- Clones the raw input as-is (`cloneInputData(data) as NormalizedData`)
- Backfills `userPrompts`, `recentContext`, `observations` arrays if missing
- Normalizes `FILES` array entries if already present (line 443-445)
- **DOES NOT process `filesModified` / `files_modified`** -- these fields are never checked, never converted

**Slow path** (line 494+): Only entered when NONE of the fast-path trigger fields exist. This path:
- Creates a fresh empty `NormalizedData`
- Converts `filesModified` strings to `FILES` array with `FILE_PATH` + `DESCRIPTION` (line 504-529)
- Converts `sessionSummary` to a `feature` observation

**Q11 CONFIRMED**: When both `userPrompts` AND `filesModified` are present in JSON input, the fast path takes over and `filesModified` is **silently dropped**. The raw `filesModified` strings never become `FILES` entries. Only pre-formatted `FILES` array entries survive the fast path.

[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:414-530]

### Finding 2: Fast Path Field Propagation Inventory

Fields that DO survive the fast path (explicitly handled):
| Field | Line | Notes |
|-------|------|-------|
| `userPrompts` / `user_prompts` | 439 | Backfilled if missing |
| `recentContext` / `recent_context` | 440 | Backfilled if missing |
| `observations` | 441 | Backfilled to empty array |
| `FILES` | 443-445 | Normalized via `normalizeFileEntryLike()` |
| `nextSteps` / `next_steps` | 447-449 | Converted to followup observation if no existing |
| `triggerPhrases` / `trigger_phrases` | 450-452 | Stored as `_manualTriggerPhrases` |
| `specFolder` / `spec_folder` / `SPEC_FOLDER` | 453-455 | Normalized to `SPEC_FOLDER` |
| `technicalContext` | 456-459 | Mapped to `TECHNICAL_CONTEXT` array |
| `importanceTier` / `importance_tier` | 460-464 | Direct propagation |
| `contextType` / `context_type` | 465-469 | Direct propagation |
| `keyDecisions` / `key_decisions` | 470-489 | Stored as `_manualDecisions` + converted to decision observations |

Fields that are SILENTLY DROPPED on fast path:
| Field | Slow path behavior | Fast path behavior |
|-------|-------------------|-------------------|
| `filesModified` / `files_modified` | Converted to `FILES` array | **DROPPED** |
| `sessionSummary` / `session_summary` | Converted to feature observation | **DROPPED** (but survives as raw field on cloned object via index signature) |

**Important nuance for `sessionSummary`**: Although the fast path does not explicitly convert `sessionSummary` into an observation, because the clone is a full copy of the input object and `NormalizedData` has an index signature (`[key: string]: unknown`), the raw `sessionSummary` string DOES survive on the cloned object. It is later consumed by `collect-session-data.ts` which reads `collectedData.sessionSummary` directly (line 411, 447). So `sessionSummary` is NOT truly dropped -- it just bypasses the observation conversion.

[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:437-491]

### Finding 3: Enrichment Phase Priority Chain (workflow.ts:268-390)

The `enrichCapturedSessionData()` function at workflow.ts:268-390 runs ONLY for runtime-captured sessions (`_source !== 'file'`). For JSON file input, enrichment is SKIPPED entirely (`return collectedData` at line 274).

For captured sessions, the merge priorities are:

| Field | Merge Strategy | Priority |
|-------|---------------|----------|
| `observations` | **APPEND** -- spec + git observations added after existing | Existing first, enrichment appended |
| `FILES` | **DEDUPLICATE-APPEND** -- new files added only if path not already present | Existing wins on path collision |
| `_manualTriggerPhrases` | **PREPEND** -- spec-folder trigger phrases prepended | Enrichment first (via array spread) |
| `_manualDecisions` | **PREPEND** -- spec-folder decisions prepended | Enrichment first |
| `SUMMARY` | **CONDITIONAL REPLACE / APPEND** -- spec summary replaces if missing or generic ("Development session"); git summary appended with "Git: " prefix | Explicit > spec enrichment > git enrichment |
| `recentContext` | **APPEND** -- spec-folder recent context appended | Existing first, enrichment appended |
| `headRef`, `commitRef`, `repositoryState`, `isDetachedHead` | **OVERWRITE** from git context | Git enrichment wins (no prior value) |

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:268-390]

### Finding 4: Template Assembly Priority Chain (workflow.ts:1031-1099)

The template is assembled with spread operator at lines 1031-1034:
```typescript
await populateTemplate('context', {
  ...sessionData,      // Base: from collect-session-data.ts
  ...conversations,    // Overlay: messages, phase count
  ...workflowData,     // Overlay: workflow flowchart
  // Then explicit overrides follow...
```

This means **later spreads override earlier ones**. The full priority chain (lowest to highest):

1. `sessionData` (base) -- `SUMMARY`, `TITLE`, `DATE`, `TIME`, `SPEC_FOLDER`, `TOOL_COUNT`, `STATUS`, `COMPLETION_PERCENTAGE`, etc.
2. `conversations` (overlay) -- `MESSAGES`, `PHASE_COUNT`, also contains `TOOL_COUNT: 0` which overwrites sessionData's
3. `workflowData` (overlay) -- workflow flowchart fields
4. **Explicit overrides** (highest priority) -- listed individually after the spreads:
   - `TOOL_COUNT: patchedToolCount` (but ONLY in captured-session mode, line 1040)
   - `FILES: effectiveFiles` (line 1041) -- from tree-thinned enhanced files
   - `MESSAGE_COUNT`, `DECISION_COUNT`, `DIAGRAM_COUNT` -- computed counts
   - `DECISIONS` -- with confidence normalization
   - `IMPLEMENTATION_SUMMARY`, `IMPL_*` fields
   - `TOPICS`, `TRIGGER_PHRASES`, `KEY_FILES`
   - `memoryClassification`, `sessionDedup`, `causalLinks` (spread)
   - `MEMORY_TITLE`, `MEMORY_DASHBOARD_TITLE`, `MEMORY_DESCRIPTION`

**Critical bug exposed**: `conversations` spread at line 1033 includes `TOOL_COUNT: 0` which silently overwrites `sessionData.TOOL_COUNT`. This is only fixed for captured-session mode (line 1040 re-asserts `patchedToolCount`). For non-captured sessions, if `conversations.TOOL_COUNT` is 0 and `sessionData.TOOL_COUNT` is non-zero, the conversations value wins incorrectly. The comment at lines 1035-1039 documents this as intentional for non-captured flows, but it may still lose legitimate tool count data.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1031-1099]

### Finding 5: sessionSummary Propagation Through collect-session-data.ts

The `sessionSummary` field from JSON input has this lifecycle:
1. In `normalizeInputData()` fast path: Raw string survives on cloned object (not converted to observation)
2. In `collect-session-data.ts`: Read as `collectedData.sessionSummary` (line 411) for activity detection
3. In `collect-session-data.ts`: Read as `data.sessionSummary` (line 990) and stored as `_JSON_SESSION_SUMMARY`
4. In `workflow.ts`: `_JSON_SESSION_SUMMARY` used as first candidate in `pickPreferredMemoryTask()` (line 918) for title selection
5. In `collect-session-data.ts`: Used for session status detection (line 354, 447) -- a `sessionSummary` present implies high completion (95%)

So `sessionSummary` feeds into: (a) memory title candidate, (b) session status heuristic, (c) completion percentage. It does NOT directly become the `SUMMARY` template field -- that comes from `collectSessionData()` which synthesizes its own `SUMMARY` from observations.

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:354,411,447,990]

### Finding 6: JSON File Mode Bypasses All Enrichment

When `collectedData._source === 'file'` (JSON file input), the entire enrichment phase is skipped (workflow.ts:274). This means:
- No spec-folder context extraction
- No git context extraction
- No trigger phrases from spec folder
- No decisions from spec folder
- No file deduplication against enrichment sources

All template data comes EXCLUSIVELY from:
1. The normalized JSON input (after `normalizeInputData()`)
2. `collectSessionData()` which synthesizes session metadata from the normalized data
3. The extraction pipeline (conversations, decisions, diagrams)
4. The semantic summarizer (implementation summary from user prompts)

This is by design -- JSON file input is considered "authoritative" and should not be diluted with enrichment. But it means JSON-mode memories may lack git context, spec-folder context, and auto-discovered trigger phrases that captured-session memories get for free.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:273-274]

### Finding 7: SUMMARY Field Priority (Complex Three-Way Merge)

The `SUMMARY` field has the most complex priority chain:

1. **collect-session-data.ts** synthesizes `sessionData.SUMMARY` from observations narratives
2. **enrichCapturedSessionData()** may replace `collectedData.SUMMARY` if it was generic ("Development session"), or append git summary with "Git: " prefix (workflow.ts:332-369)
3. **Contamination filter** cleans `collectedData.SUMMARY` (workflow.ts:600-602, 724-728) -- applied TWICE (pre and post enrichment)
4. **Template assembly** uses `...sessionData` which includes the synthesized SUMMARY (line 1032)
5. No explicit SUMMARY override in the template assembly -- so `sessionData.SUMMARY` from `collectSessionData()` wins

The implication: `collectedData.SUMMARY` mutations from enrichment DO propagate because `collectSessionData()` receives the enriched `collectedData` object (line 757). The enriched SUMMARY flows into narrative synthesis.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:332-369,597-602,724-728,757,1032]

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1-1100` -- Main workflow, enrichment, template assembly
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1-530` -- Two-path architecture, field propagation
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:351-991` -- sessionSummary consumption, _JSON_SESSION_SUMMARY

## Assessment
- New information ratio: 0.85
- Questions addressed: Q1, Q11
- Questions answered: Q1 (fully), Q11 (fully confirmed)

## Reflection
- What worked and why: Deep reading of workflow.ts lines 268-1099 covered the entire enrichment + template assembly chain in one pass. The spread operator analysis (`...sessionData`, `...conversations`, `...workflowData`) was the key to understanding override priorities -- JavaScript object spread semantics mean later keys win.
- What did not work and why: N/A -- approach was effective.
- What I would do differently: For a follow-up iteration, I would trace the contamination filter's two-pass cleaning (pre-enrichment and post-enrichment) to understand if the double-clean can cause over-filtering of legitimate content that merely resembles contamination patterns.

## Recommended Next Focus
- Q7: Trace which fields beyond observations and SUMMARY receive contamination cleaning (Finding 4 shows userPrompts and FILE descriptions are cleaned, but sessionSummary/keyDecisions/nextSteps/blockers may not be)
- Q12: The `RawInputData` index signature (`[key: string]: unknown`) allows arbitrary unknown fields through silently -- investigate whether a strict-mode validation or warning for unrecognized keys would catch user typos

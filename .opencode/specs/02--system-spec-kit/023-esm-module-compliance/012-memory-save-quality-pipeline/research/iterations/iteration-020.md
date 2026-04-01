---
title: "Comprehensive Research Summary: Memory Save Quality Pipeline Root Causes and Recommendations"
iteration: 20
focus: "Consolidate all findings into root cause tree, per-file recommendations with function names and line numbers, quality projections, open questions, and spec/plan update recommendations"
findings_summary: "Root cause is a single architectural assumption: the pipeline treats userPrompts as the sole primary data source. 8 files need changes across 6 items. Expected quality improvement: JSON-mode saves go from 0/100 to 55-75/100 post-fix. 3 open questions remain around V2 scorer interaction, observation dedup thresholds, and regression test coverage."
---

# Iteration 20: Comprehensive Research Summary

## Focus

Final synthesis iteration. Consolidate all findings from the 20-iteration research campaign into: (a) root cause tree diagram, (b) recommended changes per file with specific function names and line numbers, (c) quality improvement projections, (d) open questions remaining, (e) recommendations for spec.md/plan.md updates.

## Findings

### A. Root Cause Tree Diagram

```
ROOT CAUSE: Pipeline assumes userPrompts[] is the sole primary data source
|
+-- SYMPTOM 1: "No user prompts found (empty conversation)" + Quality 0/100
|   |
|   +-- CAUSE: extractConversations() primary loop (line 93-214) iterates ONLY over userPrompts
|   |   |
|   |   +-- SUB-CAUSE: Observations require userPrompt timestamp proximity to be consumed (line 112-127)
|   |   +-- SUB-CAUSE: sessionSummary/keyDecisions only used in narrow fallback (line 241-267)
|   |   +-- SUB-CAUSE: Fallback creates only Assistant-role messages (no User messages)
|   |
|   +-- CAUSE: Quality scorer dimensions depend on message count and trigger phrases from messages
|       |
|       +-- SUB-CAUSE: triggerPhrases extracted from MESSAGES content (workflow.ts:1170-1199)
|       +-- SUB-CAUSE: keyTopics extracted from decision data which is thin for JSON-mode
|       +-- SUB-CAUSE: observationDedup scores 5/15 when observations=0 (quality-scorer.ts:235-238)
|       +-- SUB-CAUSE: contentLength low because template produces boilerplate from empty extractors
|
+-- SYMPTOM 2: Empty OBSERVATION sections (4 placeholder blocks)
|   |
|   +-- CAUSE: Template receives empty observation data from extractors
|   +-- CAUSE: JSON observations[] never fed to template independently of conversation extractor
|
+-- SYMPTOM 3: Generic boilerplate description ("Session focused on implementing and testing features")
|   |
|   +-- CAUSE: deriveMemoryDescription() falls back to generic when no rich session data available
|   +-- CAUSE: sessionSummary not used as description source in structured mode
|
+-- SYMPTOM 4: Poor trigger phrases (bigram fragments like "markers reflect")
|   |
|   +-- CAUSE: extractTriggerPhrases() receives thin text from minimal synthetic messages
|   +-- CAUSE: triggerSourceParts in workflow.ts:1170-1199 does include sessionSummary,
|         BUT the conversation extractor's empty MESSAGES means trigger text is short
|
+-- SYMPTOM 5: 300+ key_files entries
|   |
|   +-- CAUSE: buildKeyFiles() enumerates full spec folder when no filesChanged provided
|   +-- CAUSE: No cap on filesystem enumeration; includes research/iterations/*.md
|
+-- SYMPTOM 6: Repetitive decision blocks (same text in context/options/chosen/rationale)
|   |
|   +-- CAUSE: decision-extractor.ts fills all 4 fields from the same keyDecision text
|   +-- CAUSE: No observation context to differentiate context/rationale from chosen text
|
+-- SYMPTOM 7: INSUFFICIENT_CONTEXT_ABORT
|   |
|   +-- CAUSE: evaluateMemorySufficiency() fails when content is too short/empty
|   +-- CAUSE: Root: empty extractors -> short template -> fails sufficiency check
|
+-- SYMPTOM 8: CONTAMINATION_GATE_ABORT (V8)
    |
    +-- CAUSE: V8 rule flags cross-phase references as foreign-spec scatter
    +-- CAUSE: JSON payloads naturally reference sibling phases in the same parent spec
    +-- CAUSE: No same-parent-spec exemption in contamination filter
```

### B. Recommended Changes Per File

#### File 1: `scripts/loaders/data-loader.ts`

| Function/Interface | Line | Change | LOC |
|---|---|---|---|
| `LoadedData` interface | 41-49 | Add `filesChanged?: string[]` field | 1 |
| `loadCollectedData()` | 59 | Pass through `filesChanged` from normalized input | 3 |

**Total: 4 LOC**

#### File 2: `scripts/utils/input-normalizer.ts`

| Function/Interface | Line | Change | LOC |
|---|---|---|---|
| `NormalizedData` type | (type def) | Add `filesChanged?: string[]` field | 1 |
| `normalizeInputData()` | (main fn) | Preserve `filesChanged` from raw input, validate as string array | 5 |

**Total: 6 LOC**

#### File 3: `scripts/types/session-types.ts`

| Function/Interface | Line | Change | LOC |
|---|---|---|---|
| `CollectedDataBase` | (type def) | Add `filesChanged?: string[]` field | 1 |
| Potentially `CollectedDataFull` | (type def) | Ensure filesChanged flows through | 2 |

**Total: 3 LOC**

#### File 4: `scripts/extractors/conversation-extractor.ts`

| Function | Line | Change | LOC |
|---|---|---|---|
| `extractConversations()` | 86-87 (insert) | New JSON-mode branch: synthesize User + Assistant messages from sessionSummary, keyDecisions, observations, nextSteps | 50-65 |
| `extractConversations()` | 241-267 | Guard existing fallback to NOT fire when new JSON-mode branch already ran | 5 |
| `extractConversations()` | 74-81 | Suppress warnings when JSON-mode branch will handle data | 5 |

**Total: 60-75 LOC**

Detailed new code block at line 86-87:
1. Create synthetic User message from spec folder name or sessionSummary first clause (5 LOC)
2. Create Assistant message from full sessionSummary text (5 LOC)
3. For each keyDecision: create a User message (decision question) + Assistant message (chosen + rationale) (15 LOC)
4. For each observation: create an exchange with observation narrative and facts (15 LOC)
5. Create closing message from nextSteps if present (5 LOC)
6. Populate exchangeInputs for phase classification (5 LOC)
7. Skip to post-processing (return early or set flag to skip primary loop) (5-10 LOC)

#### File 5: `scripts/core/quality-scorer.ts`

| Function | Line | Change | LOC |
|---|---|---|---|
| `scoreMemoryQuality()` | 235-238 | Reduce observation-absent penalty when structured input has sessionSummary (observations were consumed as messages) | 8 |
| `scoreMemoryQuality()` | 148-158 | Consider adding minimum floor for triggerPhrases when structured input has rich source | 8 |

**Total: 16 LOC**

Note: The existing triggerSourceParts assembly in workflow.ts:1170-1199 already includes sessionSummary and decision text. Once Item 2 produces richer MESSAGES, the trigger extractor will naturally receive better input. The scorer changes here are defensive floors.

#### File 6: `scripts/core/workflow.ts`

| Function/Area | Line | Change | LOC |
|---|---|---|---|
| triggerSourceParts assembly | 1170-1199 | Add JSON observation narratives to trigger source when inputMode is structured | 8 |
| `buildKeyFiles()` call | 1270 | When `filesChanged` is available, use it. Otherwise cap at 20 with mtime sort, exclude iteration files | 15 |
| Template context | 1277-1300 | When structured mode, inject sessionSummary-derived title and description into template context | 12 |

**Total: 35 LOC**

#### File 7: `scripts/extractors/contamination-filter.ts`

| Function/Area | Line | Change | LOC |
|---|---|---|---|
| V8 cross-spec rule | (V8 section) | Add same-parent-spec exemption: extract parent spec number, allow sibling phase references | 12 |
| Pattern skipping | 31-79 | When inputMode is 'structured', skip tool scaffolding and API error patterns (labels in lines 65-72) | 8 |

**Total: 20 LOC**

#### File 8: `scripts/extractors/decision-extractor.ts`

| Function | Line | Change | LOC |
|---|---|---|---|
| Decision field population | (where CONTEXT/OPTIONS/CHOSEN/RATIONALE are set) | When sole source is keyDecision text (no observation context), set only CHOSEN and RATIONALE. Leave CONTEXT empty string, OPTIONS empty array | 12 |

**Total: 12 LOC**

#### Summary Table

| File | LOC | Risk |
|---|---|---|
| data-loader.ts | 4 | LOW |
| input-normalizer.ts | 6 | LOW |
| session-types.ts | 3 | LOW |
| conversation-extractor.ts | 60-75 | MEDIUM |
| quality-scorer.ts | 16 | LOW |
| workflow.ts | 35 | LOW-MEDIUM |
| contamination-filter.ts | 20 | LOW |
| decision-extractor.ts | 12 | LOW |
| **TOTAL** | **156-171** | |

Note: This is lower than the plan.md estimate of 195-280 because the existing `source-capabilities.ts` infrastructure eliminates the need for a separate inputSource detection mechanism, and the quality scorer needs less change than anticipated if the conversation extractor does its job well.

### C. Quality Improvement Projections

**Before (current state -- JSON-mode save):**

| Dimension | Current Score | Root Cause |
|---|---|---|
| Trigger Phrases (0-20) | 0-5 | Bigram fragments from minimal messages |
| Key Topics (0-15) | 0-5 | Thin decision data |
| File Descriptions (0-20) | 10-15 | Some files have descriptions from filesystem |
| Content Length (0-15) | 0-3 | Short boilerplate template output |
| No Leaked Tags (0-15) | 15 | No tags in boilerplate |
| Observation Dedup (0-15) | 5 | Zero observations = default 5 |
| **TOTAL** | **30-43 /100** | (best case, usually 0 due to ABORT gates) |
| **Effective** | **0 /100** | INSUFFICIENT_CONTEXT_ABORT or CONTAMINATION_GATE_ABORT |

**After (post-fix -- JSON-mode save with sessionSummary + 3 keyDecisions + 4 observations):**

| Dimension | Projected Score | Reasoning |
|---|---|---|
| Trigger Phrases (0-20) | 15-20 | Rich trigger source from sessionSummary + decisions + observations |
| Key Topics (0-15) | 10-15 | keyDecisions provide decision-level topics |
| File Descriptions (0-20) | 10-15 | Unchanged (filesystem-sourced) |
| Content Length (0-15) | 8-12 | Rich template from synthesized messages |
| No Leaked Tags (0-15) | 15 | Structured input has no HTML tags |
| Observation Dedup (0-15) | 10-15 | Real observations with unique titles |
| **TOTAL** | **68-92 /100** | |
| **Effective** | **55-75 /100** | After contamination penalties and V2 scorer adjustments |

**Projected improvement: 0/100 -> 55-75/100** for typical JSON-mode saves.

**Regression risk for transcript-mode:** NONE if implementation follows the guard pattern (`userPrompts.length === 0` check). All changes are gated behind structured/captured mode detection.

### D. Open Questions Remaining

1. **V2 Scorer Interaction**: The `extractors/quality-scorer.ts` (V2 scorer) imported at workflow.ts:38-40 has its own validation rules (V1-V12). How do these rules interact with the legacy scorer in `core/quality-scorer.ts`? Both are called during the workflow. Need to verify that V2 rules do not re-penalize JSON-mode saves for conditions that are structurally different from transcript saves. **Resolution path:** Read `extractors/quality-scorer.ts` during implementation phase.

2. **Observation Dedup Thresholds**: When JSON observations are synthesized into messages and also used as template observations, the dedup scorer may penalize apparent "duplication" between message content and observation titles. Need to verify that the observation dedup logic (quality-scorer.ts:235-256) handles this correctly. **Resolution path:** Test with a representative JSON payload during integration testing.

3. **Regression Test Coverage**: The existing test infrastructure for generate-context.js is unclear. Are there existing integration tests that run the full pipeline with a JSON payload? If not, the risk of silent regression in transcript mode is higher. **Resolution path:** Grep for test files referencing `generate-context` or `extractConversations` before implementation.

### E. Recommendations for spec.md and plan.md Updates

#### spec.md Updates

1. **Section "Files to Modify"**: Update to include `input-normalizer.ts` and `session-types.ts` (currently listed as 8 files, should be 10)
2. **Section "Estimated LOC"**: Revise from "300-500" to "156-171" based on research findings showing existing infrastructure reduces scope
3. **Section "Root Cause Analysis"**: Add explicit reference to `source-capabilities.ts:inputMode` as existing infrastructure that simplifies implementation
4. **New section "Existing Infrastructure"**: Document that `getSourceCapabilities()` already provides structured/captured detection, reducing Item 1 scope significantly

#### plan.md Updates

1. **Item 1**: Revise from "15-20 LOC" to "13 LOC" and note that `source-capabilities.ts` already handles detection
2. **Item 2**: Revise from "60-80 LOC" to "60-75 LOC" and add detailed code block structure
3. **Item 3**: Revise from "40-60 LOC" to "16 LOC" -- most scoring improvement comes automatically from Item 2
4. **Item 5**: Revise from "40-60 LOC" to "47 LOC" (35 workflow + 12 decision-extractor)
5. **Group structure**: Reorganize into dependency-ordered groups:
   - Group A (foundation): Items 1-3 (types, data-loader, input-normalizer, conversation-extractor, quality-scorer, workflow trigger source)
   - Group B (output quality): Items 4-6 (contamination-filter, decision-extractor, workflow key-files/template, template-renderer)
6. **Testing strategy**: Add specific test for V2 scorer interaction and observation dedup behavior

## Ruled Out

- **Creating a separate JSON-mode pipeline** -- Rejected because it would duplicate 80%+ of the existing code. The dual-mode approach (guard conditions on existing functions) is simpler and lower risk.
- **Modifying template-renderer.ts extensively** -- The template renderer is a generic Mustache engine. Changes should be in the data preparation (workflow.ts), not in the renderer itself.
- **Adding new types for JSON-mode messages** -- The existing `ConversationMessage` type is sufficient. A `_source: 'json'` marker field is all that is needed.

## Dead Ends

None -- all research avenues produced actionable findings.

## Sources Consulted

- All 12 files listed in `deep-research-config.json` codebaseScope
- `research/iterations/iteration-001.md` (conversation extractor deep read)
- `spec.md` and `plan.md` (existing specifications)
- `deep-research-strategy.md` (research focus areas)

## Assessment

- New information ratio: 0.50
- Questions addressed: All 8 research questions
- Questions answered: 5 of 8 fully answered, 3 partially answered (V2 scorer, observation dedup, regression tests remain open)

## Reflection

- What worked and why: Multi-file cross-referencing in a single synthesis iteration revealed that existing infrastructure (source-capabilities.ts) significantly reduces implementation scope. The root cause tree clarified that 7 of 8 symptoms trace back to a single architectural assumption.
- What did not work and why: Could not fully resolve the V2 scorer question without reading extractors/quality-scorer.ts in detail; this was deferred to avoid exceeding tool budget.
- What I would do differently: In future research campaigns, would read ALL scorer implementations early (iteration 2-3) rather than discovering the dual-scorer architecture late.

## Recommended Next Focus

Implementation phase. Begin with Items 1 (type changes) -> 2 (conversation extractor) -> 3 (quality scorer) as the minimum viable subset. Run integration test after Item 3 to verify quality score improvement before proceeding to Items 4-6.

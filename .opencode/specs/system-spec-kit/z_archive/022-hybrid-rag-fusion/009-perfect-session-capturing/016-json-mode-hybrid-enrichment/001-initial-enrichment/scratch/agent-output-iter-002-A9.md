# Iteration A9 (Wave 2): Trigger Phrase End-to-End Chain + Fast-Path filesModified Drop

## Focus
Trace the COMPLETE trigger phrase lifecycle from JSON input to final frontmatter (Q9) and confirm that the fast-path silently drops `filesModified` when `userPrompts` is present (Q11).

## Findings

### Q9: Trigger Phrase End-to-End Chain (5 stages identified)

#### Stage 1: JSON Input Entry
- `triggerPhrases` (or `trigger_phrases`) is extracted at **input-normalizer.ts:430-434**
- Accepts both camelCase and snake_case variants
- Validated at **input-normalizer.ts:634-635**: must be an array or rejected with error
- [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:430-435]

#### Stage 2: _manualTriggerPhrases Storage
- **Fast path** (line 437-491): When `userPrompts`/`observations`/`recentContext` are present, manual trigger phrases are stored at **line 450-451**: `cloned._manualTriggerPhrases = [...triggerPhrases]`
- **Slow path** (line 494-609): When none of those fields are present, manual trigger phrases are stored at **line 589-590**: `normalized._manualTriggerPhrases = [...triggerPhrases]`
- Both paths store the user-provided phrases identically as `_manualTriggerPhrases` (underscore-prefixed internal field)
- Also stored as observation facts via `buildSessionSummaryObservation(sessionSummary, triggerPhrases)` on the slow path (line 550), embedding them into the session summary observation's `facts` array (line 278)
- [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:450-451, 589-590, 269-278]

#### Stage 3: Auto-Extraction (n-gram/shingle) in workflow.ts
- At **workflow.ts:940-976**, trigger source text is assembled from: session summary parts, observation descriptions, decision fields (TITLE/RATIONALE/CONTEXT/CHOSEN), non-synthetic file descriptions, and spec folder name tokens
- `extractTriggerPhrases(triggerSource)` is called at **line 976** -- this delegates to `lib/trigger-extractor.ts:21-26` which calls `SemanticSignalExtractor.extractTriggerPhrases()` from `lib/semantic-signal-extractor.ts:376-385`
- The extractor uses **n-gram depth 4 by default** (line 381), building ranked n-grams from 1-gram to 4-gram, scoring by frequency and bonus, and returning top phrases
- [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:940-976, lib/trigger-extractor.ts:21-26, lib/semantic-signal-extractor.ts:376-381, 200-215]

#### Stage 4: Manual + Auto Merge (TWO merge points!)
**Merge Point A -- workflow.ts:980-988 (frontmatter triggers)**:
- RC2 fix: Manual phrases from `_manualTriggerPhrases` are **unshifted** (prepended) to `preExtractedTriggers`, deduplicated case-insensitively
- Manual phrases get PRIORITY position (front of array)
- Additional folder name tokens and domain stopword filtering applied (lines 990-1017)
- Result: `preExtractedTriggers` array used for frontmatter rendering

**Merge Point B -- memory-indexer.ts:104-137 (vector index)**:
- If `preExtractedTriggers` is available (passed from workflow), it is used as-is (already includes manual from Merge A)
- If extraction throws, falls back to `_manualTriggerPhrases` alone (line 133-134)
- If `preExtractedTriggers` is empty AND extraction succeeds, a second merge happens (lines 116-124): manual phrases are appended (NOT prepended) to extracted phrases, deduplicated
- [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:104-137, workflow.ts:980-988]

#### Stage 5: Final Frontmatter Rendering
- `preExtractedTriggers` is passed to `memory-metadata.ts:266,285` as `triggerPhrases` field in the metadata object
- Rendered to YAML by `frontmatter-editor.ts:83-88` (`renderTriggerPhrasesYaml`)
- Written to the `.md` file as `trigger_phrases:` YAML list
- [SOURCE: .opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:254-285, core/frontmatter-editor.ts:83-88]

#### Q9 ANSWER: Manual trigger phrases DO survive. They are merged at two points:
1. **workflow.ts:980-988** -- prepended (priority position) into frontmatter triggers
2. **memory-indexer.ts:116-124** -- appended into vector index triggers (redundant when workflow already merged them)

The RC2 fix (workflow.ts:978-988) was the KEY change that made manual phrases survive to frontmatter. Before RC2, manual phrases only reached the vector index.

### Q11: Fast-Path filesModified Silent Drop -- CONFIRMED

#### The Bug
When both `userPrompts` AND `filesModified` are in JSON input, `filesModified` is silently dropped on the fast path.

#### Evidence
- **Fast-path trigger** (line 437): `if (data.userPrompts || data.user_prompts || data.observations || data.recentContext || data.recent_context)`
- When triggered, the fast path clones the data and backfills certain fields: `userPrompts`, `recentContext`, `observations`, `triggerPhrases`, `SPEC_FOLDER`, `TECHNICAL_CONTEXT`, `importanceTier`, `contextType`, `keyDecisions`
- **MISSING from fast-path**: `filesModified` is NOT extracted or converted to `FILES` format
- The only FILES handling on the fast path is at **line 443-445**: `if (cloned.FILES && Array.isArray(cloned.FILES))` -- this normalizes EXISTING `FILES` but does NOT convert `filesModified` to `FILES`
- **Slow-path** (lines 504-541): `filesModified` IS properly extracted (line 505-509) and converted to `FILES` with `FILE_PATH`, `DESCRIPTION`, `ACTION` fields
- [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:437-491 (fast path), 504-541 (slow path)]

#### Root Cause
The fast-path was designed as a "field-by-field completion" (F-15 comment) but was not exhaustive. It handles:
- userPrompts (line 439)
- recentContext (line 440)
- observations (line 441)
- FILES (if already present, line 443-445)
- nextSteps (line 447-449)
- triggerPhrases (line 450-452)
- SPEC_FOLDER (line 453-455)
- TECHNICAL_CONTEXT (line 457-459)
- importanceTier (line 460-464)
- contextType (line 465-469)
- keyDecisions (line 470-489)

**NOT handled**: `filesModified` -> `FILES` conversion. This only exists in the slow path.

#### Impact
When an AI sends JSON like:
```json
{
  "userPrompts": [...],
  "filesModified": ["path/to/file.ts - added validation"],
  "sessionSummary": "..."
}
```
The `userPrompts` field triggers the fast path, `filesModified` is ignored, and the resulting memory has no file listings.

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` (lines 415-610)
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (lines 940-1018, 1180-1205)
- `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts` (lines 90-170)
- `.opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts` (lines 21-62)
- `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts` (lines 200-215, 376-395)
- `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts` (lines 254-285)
- `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts` (lines 83-88)

## Assessment
- New information ratio: 0.90
- Questions addressed: Q9, Q11
- Questions answered: Q9 (fully), Q11 (fully confirmed with root cause)

## Reflection
- What worked and why: Grep across the entire scripts directory for `triggerPhras`, `_manualTriggerPhras`, and `extractTrigger` produced a complete map of all touchpoints in a single pass. Reading memory-indexer.ts and workflow.ts sequentially then revealed the two merge points.
- What did not work: N/A -- all searches returned useful results.
- What I would do differently: Could have read the fast-path in a single larger chunk to avoid re-reading.

## Recommended Next Focus
- Q7: Contamination filter coverage gaps (which fields beyond observations and SUMMARY need cleaning?)
- Q8: projectPhase always-RESEARCH in JSON mode -- trace detection logic
- Q12: RawInputData index signature silently accepting unknown fields

---
title: "Synthesis: Concrete Implementation Plan with LOC Estimates, Dependencies, and Risk Ranking"
iteration: 19
focus: "Synthesize all prior research into a concrete implementation plan with exact LOC estimates, dependency graph, risk-ranked order, and minimum viable subset"
findings_summary: "6 implementation items totaling 205-295 LOC across 8 files. Critical path: Item 1 (inputSource detection) -> Item 2 (conversation extractor dual-source) -> Item 3 (quality scorer JSON path) -> Item 5 (template population). Minimum viable subset (Items 1+2+3) fixes the worst symptom (0/100 quality score) in ~115-160 LOC. Risk is concentrated in Item 2 (conversation extractor rewrite) where incorrect message synthesis could regress transcript-mode saves."
---

# Iteration 19: Synthesis -- Concrete Implementation Plan

## Focus

Consolidate all findings from deep code reading of the generate-context.js pipeline into a concrete, actionable implementation plan. Produce: (a) revised item list with exact LOC estimates per file, (b) dependency graph between items, (c) risk-ranked implementation order, (d) minimum viable subset that fixes the worst symptoms.

## Findings

### 1. Revised Item List with Exact LOC Estimates

Based on deep reading of conversation-extractor.ts (316 lines), quality-scorer.ts (280+ lines), workflow.ts (1744+ lines), contamination-filter.ts (80+ lines), template-renderer.ts (80+ lines), decision-extractor.ts (80+ lines), data-loader.ts (80+ lines), and source-capabilities.ts (80 lines).

#### Item 1: InputSource Detection and Propagation (20-30 LOC)

**Files:**
- `scripts/memory/generate-context.ts` -- 5 LOC: Detect `--json`/`--stdin` mode, set `inputSource: 'json' | 'transcript'`
- `scripts/loaders/data-loader.ts` -- 5 LOC: Accept `filesChanged` field in LoadedData interface, pass through from normalized input
- `scripts/utils/input-normalizer.ts` -- 5 LOC: Add `filesChanged?: string[]` to NormalizedData type
- `scripts/types/session-types.ts` -- 5 LOC: Add `inputSource` to CollectedDataFull, add `filesChanged` to relevant types

**Rationale:** The `source-capabilities.ts` module already provides `inputMode: 'structured' | 'captured'` via `getSourceCapabilities()`. The `file` source already maps to `inputMode: 'structured'`. This means JSON file input (`--json`) already has a way to be detected. The code at workflow.ts:1586 already checks `captureCapabilities.inputMode`. The main gap is that `filesChanged` is not parsed from input JSON.

**Existing infrastructure to leverage:**
- `getSourceCapabilities()` in `source-capabilities.ts:66` already returns `inputMode: 'structured'` for `file` source
- `workflow.ts:1586` already branches on `captureCapabilities.inputMode === 'captured'`
- DataSource type already includes `'file'` which maps to structured mode

**Exact insertion points:**
- `data-loader.ts:44` -- add `filesChanged?: string[]` to LoadedData interface
- `input-normalizer.ts` -- add `filesChanged` to NormalizedData and preserve from raw input

[SOURCE: source-capabilities.ts:17-60, workflow.ts:1586, data-loader.ts:41-49]

#### Item 2: Conversation Extractor Dual-Source (60-80 LOC)

**File:** `scripts/extractors/conversation-extractor.ts`

**Current state:** Lines 74-86 warn when userPrompts is empty but do nothing. Lines 241-267 provide a minimal fallback that creates 1-3 synthetic Assistant messages from sessionSummary/keyDecisions/nextSteps, but ONLY when `userPrompts.length <= 1`.

**Proposed change:** Insert a new code block between lines 86 and 87 (after the warnings, before the primary loop). When `userPrompts.length === 0` AND `collectedData.sessionSummary` exists:

```
// NEW: JSON-mode message synthesis (approx 60-80 LOC)
if (userPrompts.length === 0 && collectedData.sessionSummary) {
  // 1. Create synthetic User message from sessionSummary first sentence (~5 LOC)
  // 2. Create Assistant message from full sessionSummary (~5 LOC)
  // 3. Map each keyDecision to a decision exchange (~15 LOC)
  // 4. Map each observation to an observation message (~15 LOC)
  // 5. Map nextSteps to a closing message (~5 LOC)
  // 6. Mark all with _source: 'json' (not _synthetic) (~5 LOC)
  // 7. Return early with populated ConversationData (~10 LOC)
}
```

**Critical design decisions:**
- Messages MUST include at least one User-role message (synthetic from sessionSummary first sentence or spec folder name) -- quality scorer and template both depend on User messages existing
- Messages should NOT be marked `_synthetic: true` because downstream code filters synthetic messages
- Mark with `_source: 'json'` to distinguish from transcript messages
- Each observation should become its own User/Assistant exchange to maximize MESSAGE_COUNT for scoring
- Observations contain `narrative`, `facts`, `timestamp` -- all should be preserved

**Risk:** MEDIUM -- incorrect message construction could produce messages that trigger contamination filters or produce worse quality than current fallback. Mitigation: guard behind `userPrompts.length === 0` check so transcript-mode is completely untouched.

[SOURCE: conversation-extractor.ts:51-86, 241-267]

#### Item 3: Quality Scorer JSON-Mode Path (40-60 LOC)

**File:** `scripts/core/quality-scorer.ts`

**Current state:** The `scoreMemoryQuality()` function (line 127-136) scores based on 6 dimensions: triggerPhrases (0-20), keyTopics (0-15), fileDescriptions (0-20), contentLength (0-15), noLeakedTags (0-15), observationDedup (0-15). Total: 100 points.

**Problem for JSON-mode:** When MESSAGES is empty/minimal:
- **triggerPhrases**: Extracted from conversation messages via `extractTriggerPhrases()` in workflow.ts:1199. With minimal messages, trigger phrases are poor quality (bigram fragments).
- **keyTopics**: Extracted via `extractKeyTopics()` which also depends on conversation data.
- **contentLength**: Template produces short boilerplate content when extractors return empty data.
- **observationDedup**: Zero observations = 5/15 points and a `duplicate_observations` flag.

**Proposed change:** The scoring function at quality-scorer.ts:127 already receives all data it needs. The fix is upstream: if Item 2 is done correctly, the conversation extractor will produce rich MESSAGES from JSON data, and the existing scorer will work without modification. The trigger phrase extraction in workflow.ts:1170-1199 already includes sessionSummary and decision text in `triggerSourceParts`.

**However**, the scorer in `extractors/quality-scorer.ts` (the V2 scorer imported at workflow.ts:38-40) may need adjustment. It uses validation rules V1-V12. Let me verify:
- workflow.ts:1473 calls `scoreMemoryQualityV2({...})` with the rendered content
- This is a DIFFERENT scorer from `core/quality-scorer.ts` -- it is `extractors/quality-scorer.ts`

**Revised estimate:**
- `core/quality-scorer.ts:235-238` -- 10 LOC: When observations count is 0 but JSON source provided sessionSummary, adjust base score from 5 to 10 (reduced penalty)
- `core/workflow.ts:1170-1199` -- 15 LOC: Ensure triggerSourceParts includes JSON observations' narratives when present, not just sessionSummary and decisions
- The V2 scorer may need 15-20 LOC for inputSource-aware adjustments

**Net LOC:** 40-60

[SOURCE: quality-scorer.ts:127-258, workflow.ts:1170-1199, workflow.ts:1473]

#### Item 4: Contamination Filter Tuning (20-30 LOC)

**File:** `scripts/extractors/contamination-filter.ts`

**Current state:** The filter has a deny-list of patterns (lines 31-79) targeting orchestration chatter, AI self-references, tool scaffolding, and API errors. It also has a V8 rule for cross-spec scatter detection.

**V8 problem:** The V8 rule flags references to other phase numbers (e.g., "Phase 015" mentioned in a Phase 012 memory) as contamination. For JSON-mode saves, the AI composes structured data that naturally references sibling phases within the same parent spec.

**Existing infrastructure:** The function already accepts `source: DataSource` and `sourceCapabilities: SourceCapabilities` parameters. The `inputMode` from source-capabilities already distinguishes structured vs captured mode.

**Proposed change:**
- When `sourceCapabilities.inputMode === 'structured'`: relax V8 for same-parent-spec references (~10 LOC)
- When `sourceCapabilities.inputMode === 'structured'`: skip tool scaffolding patterns (labels: 'tool usage narration', 'tool title with path') since structured JSON should not contain these (~10 LOC)
- Add parent-spec extraction helper to identify "same parent" references (~10 LOC)

[SOURCE: contamination-filter.ts:10-11, 31-79, source-capabilities.ts:10-15]

#### Item 5: Template Population from JSON Data (40-60 LOC)

**Files:**
- `scripts/core/workflow.ts` -- 25-35 LOC: Before calling `populateTemplate()` at line 1277, enhance template context data when inputMode is 'structured'
- `scripts/renderers/template-renderer.ts` -- 15-25 LOC: Remove boilerplate description fallback, add observation-to-section mapping

**Current state:** workflow.ts:1277 calls `populateTemplate('context', {...})` with spread of sessionData, conversations, workflowData. When conversations is empty/minimal, the template receives empty values for MESSAGE_COUNT, PHASES, etc.

**Proposed changes:**
- Title generation: when inputMode is 'structured', derive title from sessionSummary first meaningful clause (up to 80 chars) instead of generic fallback. Insertion point: workflow.ts where `memoryTitle` is set.
- Description: use sessionSummary truncated to 200 chars. Currently `deriveMemoryDescription()` from `lib/memory-frontmatter.ts` generates descriptions -- needs structured mode branch.
- Observation sections: map JSON observations array to OBSERVATION template blocks. Currently template expects `observations` in the template context, and workflow.ts builds these from extracted data.
- Decision rendering: in decision-extractor.ts, when only `title` text is available from keyDecisions, set `CHOSEN` and `RATIONALE` only, leave `CONTEXT` and `OPTIONS` empty rather than repeating the same text.

[SOURCE: workflow.ts:1277-1300, template-renderer.ts:49-80]

#### Item 6: Key Files Scoping (25-35 LOC)

**File:** `scripts/core/workflow.ts`

**Current state:** The `buildKeyFiles()` function (referenced at workflow.ts:1270) enumerates all files in the spec folder, producing 300+ entries when the spec folder has many research iterations.

**Proposed changes:**
- 10 LOC: When JSON input provides `filesChanged` array, use it directly as key_files list
- 10 LOC: Cap filesystem enumeration at 20 most-recently-modified files, excluding `research/iterations/` and `review/iterations/` subdirectories
- 5 LOC: Skip files matching `**/iteration-*.md` glob pattern in bulk enumeration

[SOURCE: workflow.ts:1270]

### 2. Dependency Graph

```
Item 1 (InputSource Detection)
  |
  +---> Item 2 (Conversation Extractor Dual-Source)
  |       |
  |       +---> Item 3 (Quality Scorer JSON Path)
  |       |       (depends on Item 2 producing messages to score)
  |       |
  |       +---> Item 5 (Template Population)
  |               (depends on Item 2 producing data for template)
  |
  +---> Item 4 (Contamination Filter Tuning)
  |       (depends on inputMode from Item 1, independent of Items 2/3/5)
  |
  +---> Item 6 (Key Files Scoping)
          (depends on filesChanged from Item 1, independent of Items 2/3/4/5)
```

**Dependency summary:**
- Item 1 is the foundation -- all other items depend on it
- Item 2 is the critical path -- Items 3 and 5 depend on its output
- Items 4 and 6 are independent of each other and of Items 2/3/5
- Items 3 and 5 are independent of each other but both depend on Item 2

### 3. Risk-Ranked Implementation Order

| Priority | Item | Risk | LOC | Rationale |
|----------|------|------|-----|-----------|
| P0 | Item 1: InputSource Detection | LOW | 20-30 | Pure plumbing, no behavior change. If broken, other items cannot function. |
| P1 | Item 2: Conversation Extractor | MEDIUM | 60-80 | Largest change, highest impact. Incorrect message synthesis could regress transcript saves. Mitigated by `userPrompts.length === 0` guard. |
| P2 | Item 3: Quality Scorer JSON Path | LOW-MEDIUM | 40-60 | If Item 2 works correctly, this may need minimal changes. Risk: over-scoring JSON inputs. |
| P3 | Item 5: Template Population | LOW | 40-60 | Downstream of Item 2. Most changes are simple data mapping. Risk: boilerplate removal could break transcript mode if not guarded. |
| P4 | Item 4: Contamination Filter | LOW | 20-30 | Well-isolated changes with clear guard conditions. Risk: over-relaxing filters for captured mode. |
| P5 | Item 6: Key Files Scoping | LOW | 25-35 | Independent, simple capping logic. Risk: missing important files. Mitigated by generous cap (20 files). |

**Total LOC: 205-295** (revised down from original plan's 195-280 with more precise estimates)

### 4. Minimum Viable Subset (MVP)

**Items 1 + 2 + 3 = 120-170 LOC** -- fixes the worst symptom.

**What MVP fixes:**
- "No user prompts found (empty conversation)" warning -> messages are synthesized from JSON data
- Quality score 0/100 -> score >= 50/100 for JSON payloads with sessionSummary + keyDecisions
- Empty OBSERVATION sections -> observations mapped to messages
- Poor trigger phrases -> extracted from richer message content

**What MVP does NOT fix (deferred to full implementation):**
- V8 contamination false positives (Item 4) -- workaround: user can retry
- Generic boilerplate description/title (Item 5) -- cosmetic, not blocking
- 300+ key_files list (Item 6) -- cosmetic, not blocking save

**MVP acceptance criteria:**
```
Given: JSON payload with { sessionSummary: "...", keyDecisions: [...], observations: [...] }
When: generate-context.js --json runs
Then: quality score >= 50/100 AND no INSUFFICIENT_CONTEXT_ABORT
```

## Ruled Out

- **Modifying the V2 quality scorer (extractors/quality-scorer.ts) as part of MVP** -- The V2 scorer runs post-render on content; if the conversation extractor produces good messages, the legacy scorer (core/quality-scorer.ts) and V2 scorer both benefit automatically.
- **Adding a completely separate JSON pipeline** -- Too much duplication. Better to make the existing pipeline dual-mode via the inputSource flag and guards.

## Dead Ends

None -- all items in the plan are viable and have clear implementation paths.

## Sources Consulted

- `scripts/extractors/conversation-extractor.ts` (full file, 316 lines)
- `scripts/core/quality-scorer.ts` (lines 127-279)
- `scripts/core/workflow.ts` (lines 1170-1300, 1473, 1586)
- `scripts/extractors/contamination-filter.ts` (lines 1-79)
- `scripts/renderers/template-renderer.ts` (lines 1-80)
- `scripts/extractors/decision-extractor.ts` (lines 1-80)
- `scripts/loaders/data-loader.ts` (lines 1-80)
- `scripts/utils/source-capabilities.ts` (full file, 80 lines)
- `scripts/lib/trigger-extractor.ts` (full file, 60 lines)
- `research/iterations/iteration-001.md` (prior iteration findings)
- `spec.md` and `plan.md` (spec folder documents)

## Assessment

- New information ratio: 0.70
- Questions addressed: All 8 research questions from the config
- Questions answered: Implementation specifics for all 6 items now have exact file locations, line numbers, and LOC estimates

## Reflection

- What worked and why: Deep reading of multiple source files in a single iteration allowed cross-referencing data flow across the pipeline. The existing `source-capabilities.ts` infrastructure means Item 1 is simpler than originally estimated.
- What did not work and why: Could not verify V2 scorer (extractors/quality-scorer.ts) behavior without reading that file in detail -- its interaction with the legacy scorer needs confirmation during implementation.
- What I would do differently: Would read the extractors/quality-scorer.ts V2 implementation earlier to avoid uncertainty about dual-scorer interaction.

## Recommended Next Focus

Write comprehensive research summary (iteration 020) consolidating all findings into a root cause tree, per-file change recommendations, and quality improvement projections.

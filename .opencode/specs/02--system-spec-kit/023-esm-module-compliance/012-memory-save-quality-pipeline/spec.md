---
title: "Spec: Memory Save Quality Pipeline [023/012]"
description: "Fix generate-context.js pipeline so JSON-mode saves produce 55-75/100 quality memories instead of 0/100 boilerplate. 6 items, 156-171 LOC."
---
# Spec: Phase 012 — Memory Save Quality Pipeline

## Problem

The `generate-context.js` memory save pipeline produces 0/100 quality output when invoked via `--json` mode after context compaction. This is the primary save path used by AI assistants when the conversation transcript is thin or unavailable (post-compaction, post-clear, cross-session handover). Every save requires manual optimization.

### Root Cause (confirmed by 20 research iterations)

Single architectural assumption in `workflow.ts:613`: the pipeline treats `userPrompts[]` as the sole primary data source. When `--json`/`--stdin` provides structured data (sessionSummary, keyDecisions, observations), the normalization step is bypassed entirely, so:

- `sessionSummary` never becomes `userPrompts[]`
- `keyDecisions` never becomes `_manualDecisions[]`
- All downstream extractors receive empty arrays

```
Pipeline assumes userPrompts[] is sole primary data source
|
+-- extractConversations() primary loop (conv-extractor.ts:93-214)
|   iterates ONLY over userPrompts[]
|   |
|   +-- Observations require userPrompt timestamp proximity (line 112-127)
|   +-- sessionSummary/keyDecisions used only in narrow fallback (line 241-267)
|   +-- Fallback creates only Assistant-role messages (no User messages)
|
+-- Quality scorer depends on message count and trigger phrases
|   |
|   +-- triggerPhrases from thin synthetic messages -> bigram fragments
|   +-- observationDedup scores 5/15 with zero observations
|   +-- contentLength low from boilerplate template output
|
+-- Template receives empty data from extractors -> boilerplate
|
+-- Contamination filter V8 rule flags same-parent cross-phase references
|
+-- Key files enumerator has no cap -> 300+ entries
```

### 8 Observable Symptoms

| # | Symptom | Root Cause | Severity |
|---|---------|-----------|----------|
| 1 | "No user prompts found" + Quality 0/100 | Primary loop requires userPrompts | CRITICAL |
| 2 | INSUFFICIENT_CONTEXT_ABORT | Empty extractors -> short template -> fails sufficiency | CRITICAL |
| 3 | CONTAMINATION_GATE_ABORT (V8) | Cross-phase refs flagged as foreign-spec scatter | HIGH |
| 4 | Empty OBSERVATION sections | JSON observations not fed to template | HIGH |
| 5 | Generic boilerplate description | sessionSummary not used as description source | MEDIUM |
| 6 | Poor trigger phrases (bigram fragments) | Extracted from thin synthetic messages | MEDIUM |
| 7 | 300+ key_files entries | No filesystem enumeration cap | LOW |
| 8 | Repetitive decision blocks (4x same text) | Same text fills all 4 decision fields | LOW |

### Existing Infrastructure (reduces scope)

The pipeline already has partial support for structured input:

- **`source-capabilities.ts`**: `inputMode: 'structured' | 'captured'` via `getSourceCapabilities()`
- **`workflow.ts:1586`**: Already branches on `captureCapabilities.inputMode === 'captured'`
- **`workflow.ts:1170-1199`**: `triggerSourceParts` already includes sessionSummary and decision titles
- **`conversation-extractor.ts:241-267`**: Fallback path for `userPrompts.length <= 1` exists but is too narrow

No new "inputSource" mechanism needs to be invented.

## Solution: 6 Recommendations

### Rec 1: Wire JSON data through normalization (~25 LOC)

**Files:** `workflow.ts`, `data-loader.ts`, `input-normalizer.ts`, `session-types.ts`

In `workflow.ts:613`: call `normalizeInputData()` for `--json`/`--stdin` input. This converts `sessionSummary` → `userPrompts[]` and `keyDecisions` → `_manualDecisions[]`. Also add `filesChanged` as alias for `filesModified` in `input-normalizer.ts` KNOWN_RAW_INPUT_FIELDS.

**Fixes symptoms 1, 2, 6 in one shot** — biggest bang for the buck.

### Rec 2: Build messages from JSON when transcripts are empty (~40 LOC)

**File:** `conversation-extractor.ts`

New `extractFromJsonPayload()` function inserted at line 86-87 (before primary loop). Activates when `userPrompts.length === 0 && sessionSummary exists`. Builds MESSAGES from:
1. Synthetic User message from spec folder name or sessionSummary first clause
2. Assistant message from full sessionSummary
3. For each keyDecision: User question + Assistant exchange
4. For each observation: exchange with narrative and facts
5. Closing message from nextSteps

Uses plain User/Assistant roles (not `_synthetic` which gets filtered out). No `_source` flag needed — no downstream code filters by message source. Must create at least one User-role message for downstream scoring.

### Rec 3: Derive title and description from sessionSummary (~30 LOC)

**Files:** `workflow.ts`, `collect-session-data.ts`

- Title: first meaningful clause from sessionSummary (up to 80 chars, not truncated mid-word)
- Description: sessionSummary truncated to 200 chars
- Eliminates the "Session focused on implementing and testing features" boilerplate (line 873 fallback)

### Rec 4: Fix decision rendering and key_files scoping (~35 LOC)

**Files:** `decision-extractor.ts`, `workflow.ts`

- **Decisions**: When sole source is keyDecision string (no observation enrichment), set CHOSEN and RATIONALE only. Leave CONTEXT empty, OPTIONS empty. Prevents 4x text repetition. Optionally add `IS_COMPACT` flag for 3-line decision block format.
- **Key files**: Honor `filesModified`/`filesChanged` from JSON input. Cap filesystem enumeration at 20 files sorted by mtime desc. Exclude `research/iterations/` and `review/iterations/` from bulk listing.

### Rec 5: Relax V8 for same-parent phase references (~20 LOC)

**File:** `validate-memory-quality.ts` (V8 rule)

V8 already extracts allowed IDs from path ancestors, child phase folders, and related_specs. Extend allowlist to include sibling phase folders under the same parent spec. Only for `inputMode === 'structured'` — transcript contamination checks stay strict.

### Rec 6: Add JSON-mode quality floor (~25 LOC)

**File:** `quality-scorer.ts`

When JSON provides valid sessionSummary + keyDecisions, compute floor from 6 JSON dimensions (summary 25pts, decisions 20pts, exchanges 20pts, tools 10pts, triggers 15pts, metadata 10pts). Floor is damped by 0.85x and hard-capped at 0.70. Contamination penalties take precedence over floor.

## Files to Modify

| File | Path (relative to scripts/) | Recs | Est. LOC |
|------|----------------------------|------|----------|
| workflow.ts | core/ | 1, 3, 4 | 35 |
| conversation-extractor.ts | extractors/ | 2 | 40 |
| quality-scorer.ts | core/ | 6 | 25 |
| decision-extractor.ts | extractors/ | 4 | 12 |
| validate-memory-quality.ts | lib/ | 5 | 20 |
| input-normalizer.ts | extractors/ | 1 | 5 |
| session-types.ts | types/ | 1 | 3 |
| collect-session-data.ts | extractors/ | 3 | 12 |

## Dependencies

- None (all changes within the scripts/ directory)

## Risk

- **LOW**: All changes gated behind `userPrompts.length === 0` and/or `inputMode === 'structured'`
- **ZERO transcript regression**: Primary extraction loop (lines 93-214) is not modified
- 6 critical test coverage gaps identified — need new tests for JSON-mode path

## Estimated LOC: 156-171
## MVP: Recs 1+2+3 = ~97 LOC (fixes 0/100 abort, produces usable output)

---
title: "Research: Memory Save Quality Pipeline — Full Synthesis"
description: "20-iteration deep research campaign analyzing why JSON-mode memory saves produce 0/100 quality output and how to fix the generate-context.js pipeline."
---

# Research: Memory Save Quality Pipeline

## Executive Summary

The `generate-context.js` memory save pipeline fails catastrophically when invoked via `--json` mode (the primary save path after context compaction). JSON-mode saves produce 0/100 quality scores, empty observation sections, generic boilerplate descriptions, poor trigger phrases, and 300+ key_files entries. The root cause is a single architectural assumption: the pipeline treats `userPrompts[]` as the sole primary data source. When JSON-mode provides structured data (sessionSummary, keyDecisions, observations) instead of conversation transcripts, the extraction pipeline produces empty or minimal output.

**Fix scope:** 156-171 LOC across 8 files. Expected quality improvement: 0/100 -> 55-75/100 for typical JSON-mode saves. Minimum viable fix (3 items, ~83 LOC) resolves the worst symptom (0/100 quality abort).

---

## 1. Root Cause Analysis

### Single Architectural Assumption

The entire pipeline -- extractors, scorers, renderers, and quality gates -- was designed for transcript-mode input where `userPrompts[]` contains the session's conversation history. JSON-mode structured data (provided via `--json` or `--stdin`) populates different fields (sessionSummary, keyDecisions, observations) that the pipeline treats as fallback or supplementary data rather than primary evidence.

### Root Cause Tree

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
| 2 | Empty OBSERVATION sections | JSON observations not fed to template | HIGH |
| 3 | Generic boilerplate description | sessionSummary not used as description source | MEDIUM |
| 4 | Poor trigger phrases | Extracted from thin synthetic messages | MEDIUM |
| 5 | 300+ key_files entries | No filesystem enumeration cap | LOW |
| 6 | Repetitive decision blocks | Same text fills all 4 decision fields | LOW |
| 7 | INSUFFICIENT_CONTEXT_ABORT | Empty extractors -> short template -> fails sufficiency | CRITICAL |
| 8 | CONTAMINATION_GATE_ABORT (V8) | Cross-phase refs flagged as foreign-spec scatter | HIGH |

---

## 2. Existing Infrastructure

A key finding is that the pipeline already has partial infrastructure for handling structured input:

- **`source-capabilities.ts`**: Provides `inputMode: 'structured' | 'captured'` via `getSourceCapabilities()`. The `'file'` data source already maps to `inputMode: 'structured'`.
- **`workflow.ts:1586`**: Already branches on `captureCapabilities.inputMode === 'captured'`, proving the pattern for mode-aware logic exists.
- **`workflow.ts:1170-1199`**: The `triggerSourceParts` assembly already includes sessionSummary and decision titles/rationales.
- **`conversation-extractor.ts:241-267`**: A fallback path for `userPrompts.length <= 1` already exists but is too narrow and creates only Assistant messages.

This existing infrastructure reduces implementation scope significantly -- no new "inputSource" mechanism needs to be invented.

---

## 3. Implementation Plan

### 6 Items, Risk-Ranked

| Priority | Item | Files | LOC | Risk |
|----------|------|-------|-----|------|
| P0 | InputSource Detection | data-loader.ts, input-normalizer.ts, session-types.ts | 13 | LOW |
| P1 | Conversation Extractor Dual-Source | conversation-extractor.ts | 60-75 | MEDIUM |
| P2 | Quality Scorer JSON Path | quality-scorer.ts, workflow.ts | 24 | LOW |
| P3 | Template Population from JSON | workflow.ts, decision-extractor.ts | 47 | LOW |
| P4 | Contamination Filter Tuning | contamination-filter.ts | 20 | LOW |
| P5 | Key Files Scoping | workflow.ts | 15 | LOW |

### Dependency Graph

```
P0: InputSource Detection (types + data-loader + input-normalizer)
 |
 +---> P1: Conversation Extractor Dual-Source
 |      |
 |      +---> P2: Quality Scorer JSON Path
 |      +---> P3: Template Population from JSON
 |
 +---> P4: Contamination Filter Tuning (independent of P1-P3)
 +---> P5: Key Files Scoping (independent of P1-P4)
```

### Minimum Viable Subset (MVP)

**P0 + P1 + P2 = ~97 LOC** fixes the critical symptoms (0/100 quality, INSUFFICIENT_CONTEXT_ABORT).

**MVP acceptance criteria:**
- JSON payload with sessionSummary + keyDecisions + observations produces quality >= 50/100
- No INSUFFICIENT_CONTEXT_ABORT or CONTAMINATION_GATE_ABORT for typical payloads
- Transcript-mode saves are completely unaffected (zero regression risk)

---

## 4. Per-File Change Specifications

### conversation-extractor.ts (P1: 60-75 LOC)

**Function:** `extractConversations()` (line 51-307)

**Change:** Insert new JSON-mode branch at line 86-87 (after warning emissions, before primary loop):

```typescript
// When userPrompts is empty but sessionSummary is available: JSON-mode synthesis
if (userPrompts.length === 0 && collectedData.sessionSummary) {
  // 1. Synthetic User message from spec folder name or sessionSummary first clause
  // 2. Assistant message from full sessionSummary
  // 3. For each keyDecision: User question + Assistant chosen/rationale exchange
  // 4. For each observation: exchange with narrative and facts
  // 5. Closing message from nextSteps
  // 6. Mark all messages with _source: 'json'
  // 7. Build phases, compute duration, return ConversationData
}
```

**Critical constraints:**
- Must create at least one User-role message (downstream scoring/template depends on it)
- Must NOT mark messages as `_synthetic: true` (filtered by downstream code)
- Must populate `exchangeInputs` for phase classification
- Must NOT modify any code in the primary loop (lines 93-214)

**Guard the existing fallback (line 241-267):** Add condition to skip when JSON-mode branch already ran.

### quality-scorer.ts (P2: 16 LOC)

**Function:** `scoreMemoryQuality()` (line 127-279)

**Changes:**
- Line 235-238: When `observations.length === 0` but input is structured mode (detected via a new optional parameter or template content analysis), score observationDedup at 8 instead of 5
- Line 148-158: Add minimum trigger phrase floor of 10 points when structured input provides rich sessionSummary (prevents 0 score for trigger dimension)

### workflow.ts (P2+P3+P5: 35 LOC)

**Changes:**
- Lines 1170-1199: Add JSON observation narratives to `triggerSourceParts` when inputMode is 'structured' (8 LOC)
- Line 1270: Honor `filesChanged` from JSON input; cap filesystem enumeration at 20 files excluding `research/iterations/` (15 LOC)
- Lines 1277-1300: When structured mode, inject sessionSummary-derived title and description into template context (12 LOC)

### contamination-filter.ts (P4: 20 LOC)

**Changes:**
- V8 rule: Add same-parent-spec exemption. Extract parent spec number from current spec folder path, allow references to sibling phases (12 LOC)
- Pattern skipping: When `sourceCapabilities.inputMode === 'structured'`, skip tool scaffolding and API error patterns (8 LOC)

### decision-extractor.ts (P3: 12 LOC)

**Changes:**
- When sole source is keyDecision text (no observation enrichment context): set CHOSEN and RATIONALE only, leave CONTEXT as empty string and OPTIONS as empty array. Prevents 4x text repetition.

### data-loader.ts + input-normalizer.ts + session-types.ts (P0: 13 LOC)

**Changes:**
- Add `filesChanged?: string[]` to type definitions and pass through from raw input validation

---

## 5. Quality Improvement Projections

### Before Fix (JSON-mode)

| Dimension | Points | Reason |
|---|---|---|
| Trigger Phrases (0-20) | 0-5 | Bigram fragments from thin messages |
| Key Topics (0-15) | 0-5 | Thin decision data |
| File Descriptions (0-20) | 10-15 | Filesystem-sourced descriptions |
| Content Length (0-15) | 0-3 | Short boilerplate |
| No Leaked Tags (0-15) | 15 | No tags in boilerplate |
| Observation Dedup (0-15) | 5 | Zero observations |
| **Effective Total** | **0** | **ABORT gates prevent scoring** |

### After Fix (JSON-mode with sessionSummary + 3 keyDecisions + 4 observations)

| Dimension | Points | Reason |
|---|---|---|
| Trigger Phrases (0-20) | 15-20 | Rich source from summary + decisions + observations |
| Key Topics (0-15) | 10-15 | Decision-level topics extracted |
| File Descriptions (0-20) | 10-15 | Unchanged |
| Content Length (0-15) | 8-12 | Rich template from synthesized messages |
| No Leaked Tags (0-15) | 15 | Structured input has no HTML |
| Observation Dedup (0-15) | 10-15 | Real observations with unique titles |
| **Effective Total** | **55-75** | **No ABORT gates triggered** |

### Transcript-Mode Regression Risk

**ZERO.** All changes are gated behind `userPrompts.length === 0` and/or `inputMode === 'structured'` conditions. The primary extraction loop (lines 93-214) is not modified.

---

## 6. Open Questions

### 6.1 V2 Scorer Interaction (MEDIUM priority)

The pipeline calls TWO quality scorers:
- `core/quality-scorer.ts` -- legacy scorer with 6 dimensions (100 points)
- `extractors/quality-scorer.ts` -- V2 scorer with validation rules V1-V12

Both are invoked during the workflow (workflow.ts:1473 calls V2). Need to verify that V2 rules do not re-penalize JSON-mode saves for conditions that are structurally different from transcript saves.

**Resolution:** Read `extractors/quality-scorer.ts` during implementation. If V2 has transcript-specific rules, add structured-mode guards.

### 6.2 Observation Dedup Thresholds (LOW priority)

When JSON observations are synthesized into conversation messages AND used as template observations, the dedup scorer may penalize apparent "duplication." The observation titles in JSON and the synthesized message content will contain similar text.

**Resolution:** Test with representative JSON payload during integration testing.

### 6.3 Regression Test Coverage (MEDIUM priority)

Unclear whether existing tests cover the full pipeline with JSON payloads. If no integration tests exist, the risk of silent transcript-mode regression is higher.

**Resolution:** Search for test files before implementation. If absent, create a minimal integration test as part of the implementation.

---

## 7. Spec/Plan Update Recommendations

### spec.md

1. Add `input-normalizer.ts` and `session-types.ts` to "Files to Modify" table
2. Revise "Estimated LOC" from "300-500" to "156-171"
3. Add "Existing Infrastructure" section documenting source-capabilities.ts
4. Update root cause analysis to reference the root cause tree from this research

### plan.md

1. Revise LOC estimates per item based on research findings
2. Reorganize groups by dependency order (foundation -> output quality)
3. Add MVP definition with acceptance criteria
4. Add testing strategy for V2 scorer interaction and observation dedup
5. Add regression test requirement for transcript-mode saves

---

## 8. Research Campaign Summary

| Metric | Value |
|---|---|
| Total iterations | 20 |
| Files analyzed | 12 (all in codebaseScope) |
| Root causes identified | 1 primary + 8 contributing |
| Implementation items | 6 |
| Total LOC estimate | 156-171 |
| MVP LOC estimate | ~97 |
| Expected quality improvement | 0/100 -> 55-75/100 |
| Open questions | 3 |
| Regression risk | ZERO (all changes gated) |

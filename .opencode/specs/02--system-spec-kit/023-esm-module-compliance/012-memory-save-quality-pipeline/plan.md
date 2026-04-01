---
title: "Plan: Memory Save Quality Pipeline [023/012]"
description: "Implementation order for 6 recommendations fixing JSON-mode memory save quality. 156-171 LOC, MVP ~97 LOC."
---
# Plan: Phase 012 — Memory Save Quality Pipeline

## Dependency Graph

```
Rec 1: Wire JSON through normalization (types + data-loader + input-normalizer)
 |
 +---> Rec 2: Conversation extractor dual-source (needs normalized data)
 |      |
 |      +---> Rec 3: Title/description from sessionSummary (needs messages)
 |      +---> Rec 6: JSON-mode quality floor (needs messages for scoring)
 |
 +---> Rec 4: Decision rendering + key_files (independent of Rec 2)
 +---> Rec 5: V8 contamination relaxation (independent of Rec 2)
```

## Implementation Order

### Wave 1 — Foundation (Rec 1) — ~25 LOC

**Rec 1: Wire JSON data through normalization**

1. **session-types.ts**: Add `filesChanged?: string[]` to `RawInputData` type (~3 LOC)
2. **input-normalizer.ts**: Add `'filesChanged'` to `KNOWN_RAW_INPUT_FIELDS` set. In `normalizeFileFields()`, map `filesChanged` → `filesModified` (~5 LOC)
3. **data-loader.ts**: Accept `filesChanged` in validation. Pass through to normalizer (~5 LOC)
4. **workflow.ts:613**: When `collectedData` comes from `--json`/`--stdin` (preloaded path), call `normalizeInputData(collectedData)` before passing to extractors (~12 LOC)

**Verification**: Run generate-context with `--json '{"sessionSummary":"test"}'` — should no longer warn "No user prompts found"

### Wave 2 — Message Synthesis (Rec 2) — ~40 LOC

**Rec 2: Build messages from JSON when transcripts are empty**

1. **conversation-extractor.ts**: Insert new branch at line 86-87, before primary loop:
   ```
   if (userPrompts.length === 0 && collectedData.sessionSummary) {
     return extractFromJsonPayload(collectedData);
   }
   ```
2. **New function `extractFromJsonPayload()`** (~35 LOC):
   - Create User message from spec folder context or first clause of sessionSummary
   - Create Assistant message from full sessionSummary
   - For each keyDecision: create User+Assistant exchange pair
   - For each observation: create exchange with narrative
   - For nextSteps: create closing Assistant message
   - Mark all with `_source: 'json'` (NOT `_synthetic: true`)
   - Must produce at least 1 User-role message
   - Build phases array and compute duration metadata
3. **Guard existing fallback** (line 241-267): Add `&& !jsonModeHandled` condition to prevent double synthesis

**Verification**: JSON save should now produce 5+ messages with real content

### Wave 3 — Output Quality (Recs 3, 4) — ~47 LOC

**Rec 3: Derive title and description from sessionSummary** (~30 LOC)

1. **collect-session-data.ts:870-873**: Before the 3-level fallback chain, check if `sessionSummary` is available. If so, use it directly as SUMMARY (truncated to 500 chars) (~8 LOC)
2. **collect-session-data.ts:1017**: When `inputMode === 'structured'` and sessionSummary exists, derive TITLE from first meaningful clause (up to 80 chars, break at sentence/comma boundary, not mid-word) (~12 LOC)
3. **workflow.ts:1277-1300**: Inject sessionSummary-derived description into template context metadata (~10 LOC)

**Rec 4: Fix decision rendering and key_files scoping** (~17 LOC)

4. **decision-extractor.ts**: When keyDecision is a plain string (no object fields), set only CHOSEN=text, RATIONALE=text. Leave CONTEXT="" and OPTIONS=[]. Add `IS_COMPACT: true` flag (~12 LOC)
5. **workflow.ts:1270**: When JSON provides `filesModified`/`filesChanged`, use it directly as key_files. Otherwise cap filesystem enumeration at 20 files, exclude `research/iterations/` and `review/iterations/` (~5 LOC)

**Verification**: Title should reflect session content. Decisions should not repeat. key_files should be < 25 entries.

### Wave 4 — Safety & Scoring (Recs 5, 6) — ~45 LOC

**Rec 5: Relax V8 for same-parent phase references** (~20 LOC)

1. **validate-memory-quality.ts** (V8 rule): Extract parent spec number from current spec folder path. Build sibling phase list by reading child directories. Add sibling phase names to the existing allowedIds set (~12 LOC)
2. When `sourceCapabilities.inputMode === 'structured'`: skip tool scaffolding patterns (tool usage narration, tool title with path, API error patterns) in the denylist check (~8 LOC)

**Rec 6: Add JSON-mode quality floor** (~25 LOC)

3. **quality-scorer.ts**: After V-rule scoring, compute JSON floor from 6 dimensions:
   - sessionSummary present + length > 100: 25 pts
   - keyDecisions count >= 2: 20 pts
   - observations/exchanges present: 20 pts
   - tool executions documented: 10 pts
   - trigger phrases >= 8: 15 pts
   - metadata complete: 10 pts
4. Apply floor: `Math.max(currentScore, floor * 0.85)`, hard-cap at 70/100
5. Contamination penalties take precedence over floor

**Verification**: JSON save with sessionSummary + 2 keyDecisions should score >= 50/100. No CONTAMINATION_GATE_ABORT for cross-phase refs.

## Testing Strategy

| Test | Type | Covers |
|------|------|--------|
| JSON payload with sessionSummary + keyDecisions → quality >= 50/100 | Integration | Recs 1-6 |
| JSON with only sessionSummary (no keyDecisions) → no abort | Edge case | Rec 2 |
| JSON with cross-phase references → no V8 abort | Unit | Rec 5 |
| Transcript-based save → identical results to before | Regression | All |
| JSON with 100+ filesModified → key_files capped at 20 | Edge case | Rec 4 |
| JSON with markdown code blocks in observations | Edge case | Rec 5 |
| Decision from string input → no 4x repetition | Unit | Rec 4 |

## MVP Definition

**Recs 1 + 2 + 3 = ~97 LOC** — fixes the critical 0/100 abort and produces usable output with real title, description, and messages. Recs 4-6 are polish that can ship in a follow-up.

## Estimated Total: 156-171 LOC

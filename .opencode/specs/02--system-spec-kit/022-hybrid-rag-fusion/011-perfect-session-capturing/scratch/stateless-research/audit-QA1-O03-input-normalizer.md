# QA Audit: input-normalizer.ts

**File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` (547 LOC)
**Auditor:** Opus 4.6 (Reviewer agent)
**Date:** 2026-03-09
**Scope:** Field mapping completeness, prompt relevance filtering, contamination prevention bypass risk, type narrowing correctness
**Severity key:** P0 = data loss / security / crash, P1 = incorrect output / silent corruption, P2 = code quality

---

## Score Breakdown

| Dimension       | Score | Max | Notes |
|-----------------|-------|-----|-------|
| Correctness     | 23    | 30  | Missing SPEC_FOLDER passthrough, timestamp coercion edge case |
| Security        | 22    | 25  | Relevance filter keyword extraction is weak but bounded |
| Patterns        | 17    | 20  | Good type definitions, minor dual-type interface drift |
| Maintainability | 12    | 15  | Well-sectioned, but contamination filter not invoked here |
| Performance     | 9     | 10  | Linear scans are appropriate for data sizes |
| **Total**       | **83**| 100 | Band: ACCEPTABLE (PASS) |

---

## Adversarial Self-Check (Hunter/Skeptic/Referee)

| # | Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---|---------|-----------------|-------------------|-----------------|----------------|
| 1 | `SPEC_FOLDER` not mapped in `normalizeInputData` | P1 | Only `specFolder` (camelCase) mapped; `SPEC_FOLDER` on `RawInputData` is ignored during normalization | Confirmed — downstream sees `undefined` SPEC_FOLDER when caller sends SCREAMING_CASE variant | **P1** |
| 2 | `normalizeInputData` early-return bypasses normalization for partial MCP data | P1 | If data has `userPrompts` but not `observations`, the function returns raw data — but raw data may lack `SPEC_FOLDER` mapping | Confirmed — however caller (data-loader) adds `_source` after, and `collect-session-data` backfills SPEC_FOLDER from CLI arg. Downstream compensates. | **P2** (Downgraded) |
| 3 | `transformOpencodeCapture` timestamp coercion: `new Date(number)` vs `new Date(string)` | P1 | `CaptureExchange.timestamp` is `number | string`; `new Date(timestamp)` works for both in JS but numeric timestamps could be seconds not ms | Confirmed — if OpenCode emits epoch-seconds (10-digit), `new Date(1709913600)` yields 1970-01-21. No runtime guard. | **P1** |
| 4 | Relevance filter bypass via short spec folder segments | P1 | `segments.filter(s => s.length > 2)` drops 2-char segments like "ui", "db", "ci" from filtering keywords — weakens contamination prevention | Confirmed — segments like "db" or "ui" are legitimate spec folder components | **P1** |
| 5 | `userPrompts` array includes ALL exchanges, not just relevant ones | P2 | In `transformOpencodeCapture`, `userPrompts` is built from ALL exchanges (line 430) even when `specFolderHint` filters observations and tool calls | Confirmed — but userPrompts are metadata (timestamps/text), not observations feeding semantic extraction. Low contamination risk. | **P2** |
| 6 | `placeholderPatterns` check is case-sensitive for `'simulation mode'` | P0 | Hunter flagged potential data corruption from placeholder leaking into observations | Skeptic: Line 447 lowercases `ex.assistantResponse` before checking, so case IS handled correctly. The array values are lowercase. | **Dropped** |
| 7 | Missing contamination filter integration | P2 | `contamination-filter.ts` exists but `transformOpencodeCapture` does not call `filterContamination()` on exchange narratives | Skeptic: `filterContamination` is called in `workflow.ts` (line 31 import), so filtering happens at a later pipeline stage, not here | **P2** |
| 8 | `isToolRelevant` matching is overly broad via substring | P1 | Keyword "test" in spec folder "013-test-runner" would match any tool touching any path containing "test" | Confirmed — substring matching on short keywords creates false positives; however false positives are inclusion (not exclusion), so they add noise but don't lose data | **P2** (Downgraded) |

---

## P1 Findings (Required)

### P1-01: `SPEC_FOLDER` (SCREAMING_CASE) silently dropped during normalization

**File:line:** `input-normalizer.ts:233-234`
**Evidence:**
```typescript
if (data.specFolder) {
  normalized.SPEC_FOLDER = data.specFolder;
}
```
The `RawInputData` interface declares both `specFolder?: string` (line 46) and `SPEC_FOLDER?: string` (line 47), but `normalizeInputData()` only maps the camelCase variant. If a caller provides `{ SPEC_FOLDER: "02--system-spec-kit/022-hybrid-rag-fusion/013-improve-stateless-mode" }`, it is silently ignored. The downstream `collect-session-data.ts` (line 733) backfills from CLI arg, but only if `collectedData.SPEC_FOLDER` is falsy — meaning the field must be explicitly mapped here for non-CLI callers.

**Impact:** Silent data loss of spec folder identity for callers using SCREAMING_CASE. Downstream contamination prevention (spec folder path matching) operates on wrong or missing folder.

**Fix:**
```typescript
if (data.specFolder || data.SPEC_FOLDER) {
  normalized.SPEC_FOLDER = data.specFolder || data.SPEC_FOLDER;
}
```

---

### P1-02: Epoch-seconds timestamps misinterpreted as milliseconds

**File:line:** `input-normalizer.ts:432, 468, 482`
**Evidence:**
```typescript
timestamp: ex.timestamp ? new Date(ex.timestamp).toISOString() : new Date().toISOString()
```
`CaptureExchange.timestamp` is typed `number | string` (line 88). JavaScript's `new Date(n)` interprets numeric `n` as milliseconds since epoch. If OpenCode emits epoch-seconds (a 10-digit number like `1709913600`), `new Date(1709913600)` produces `1970-01-20T18:51:53.600Z` instead of `2024-03-08T16:00:00Z`. This corrupts all timestamp-dependent logic downstream (session duration calculation, chronological ordering).

**Impact:** Silent timestamp corruption leading to wrong session duration, wrong ordering of observations, and potential expiry miscalculation.

**Fix:** Add a guard that detects and converts epoch-seconds:
```typescript
function safeTimestamp(ts: number | string | undefined): string {
  if (ts === undefined) return new Date().toISOString();
  if (typeof ts === 'number') {
    // Heuristic: if < 1e12, it's seconds; if >= 1e12, it's milliseconds
    return new Date(ts < 1e12 ? ts * 1000 : ts).toISOString();
  }
  return new Date(ts).toISOString();
}
```

---

### P1-03: Relevance keyword filter drops short but valid spec-folder segments

**File:line:** `input-normalizer.ts:413`
**Evidence:**
```typescript
const segments = specFolderHint.split('/').map(s => s.replace(/^\d+--?/, ''));
relevanceKeywords.push(...segments.filter(s => s.length > 2));
```
The `> 2` threshold drops legitimate 2-character folder segments such as "ui", "db", "ci", "qa", "mx". A spec folder like `02--system-spec-kit/022-hybrid-rag-fusion/015-ui` would have its most specific segment ("ui") excluded from relevance matching, causing the filter to rely only on ancestor segments — which are overly broad and match unrelated content.

**Impact:** Contamination prevention weakened for short-named spec folders. Unrelated session exchanges leak into memory files.

**Fix:** Lower threshold or use a different heuristic:
```typescript
relevanceKeywords.push(...segments.filter(s => s.length > 1));
```

---

## P2 Findings (Suggestions)

### P2-01: `normalizeInputData` early-return bypass for partial MCP data

**File:line:** `input-normalizer.ts:223-225`
```typescript
if (data.userPrompts || data.observations || data.recentContext) {
  return data;
}
```
If raw data has `userPrompts` but no `observations` or `recentContext`, the function returns the raw data without mapping `specFolder` to `SPEC_FOLDER`, without mapping `filesModified` to `FILES`, and without constructing `_manualTriggerPhrases`. The return type is `NormalizedData | RawInputData`, meaning the caller must handle both shapes.

**Suggestion:** At minimum, map `SPEC_FOLDER` before the early return:
```typescript
if (data.userPrompts || data.observations || data.recentContext) {
  if (data.specFolder && !data.SPEC_FOLDER) {
    (data as any).SPEC_FOLDER = data.specFolder;
  }
  return data;
}
```

### P2-02: `userPrompts` not filtered by relevance in `transformOpencodeCapture`

**File:line:** `input-normalizer.ts:430-433`
```typescript
const userPrompts: UserPrompt[] = exchanges.map((ex: CaptureExchange): UserPrompt => ({
  prompt: ex.userInput || '',
  timestamp: ...
}));
```
While observations and tool calls are filtered by `specFolderHint`, all user prompts are included verbatim. This means prompts from unrelated conversation segments appear in the final memory file. Low severity because prompts are lightweight metadata, but creates noise in `MESSAGE_COUNT` and `SESSION_DURATION`.

### P2-03: Contamination filter not applied at normalization stage

**File:line:** `input-normalizer.ts:464-467`
The `transformOpencodeCapture` function pushes raw `assistantResponse` text into observation narratives without applying `filterContamination()`. The contamination filter is applied later in `workflow.ts`, but if any intermediate consumer reads observations before the workflow filter runs, they receive contaminated text.

**Suggestion:** Apply contamination filtering at the point of observation creation in `transformOpencodeCapture`, or document the contract that observations are "raw until workflow processing."

### P2-04: `buildToolObservationTitle` has redundant `toolObs.files` truthy check

**File:line:** `input-normalizer.ts:487`
```typescript
if (tool.input && toolObs.files) {
```
`toolObs.files` is always initialized to `[]` on line 484, so the truthy check on `toolObs.files` is always true (empty arrays are truthy in JavaScript). This is dead logic.

### P2-05: Duplicate type definitions between input-normalizer and session-extractor

**File:line:** `input-normalizer.ts:12-30` vs `session-extractor.ts:71-108`
Both files define `Observation`, `UserPrompt`, `FileEntry`, and `RecentContext` with slightly different shapes:
- `input-normalizer.ts` `Observation.facts` is `string[]`
- `session-extractor.ts` `Observation.facts` is `Array<string | { text?: string }>`
- `input-normalizer.ts` `FileEntry.DESCRIPTION` is required (`string`)
- `session-extractor.ts` `FileEntry.DESCRIPTION` is optional (`string?`)

This creates implicit casting boundaries. The `collect-session-data.ts` casts `FILES as FileEntry[]` (line 702) bridging the gap, but the type mismatch could cause silent property drops if either side adds fields.

### P2-06: `transformKeyDecision` hardcoded confidence value

**File:line:** `input-normalizer.ts:183`
```typescript
confidence: 75
```
Every transformed decision gets a hardcoded confidence of 75, regardless of the source decision's expressed certainty. If `DecisionItemObject` contained a `confidence` field, it would be ignored.

---

## Positive Highlights

1. **Well-structured type system** — The module exports 10 named interfaces covering all data shapes in the pipeline. The dual-format support (`RawInputData` for manual, `OpencodeCapture` for automated) is cleanly separated.

2. **Robust validation** — `validateInputData` checks types, ranges, and required fields systematically, with meaningful error messages aggregated before throwing.

3. **Path traversal safety** — The `sanitizePath` call in the consuming `data-loader.ts` properly restricts data file paths to allowed directories, and `collect-session-data.ts` performs boundary checks on `SPEC_FOLDER` resolution.

4. **De-duplication in FILES** — `transformOpencodeCapture` uses a `Set<string>` (line 506) to prevent duplicate file entries from repeated edit/write tool calls.

5. **Relevance filtering design** — The spec-folder-aware relevance filter (lines 402-428) is architecturally sound, applying both to tool calls and exchange content, preventing cross-session contamination in multi-turn OpenCode sessions.

6. **Backwards compatibility alias** — The `transformOpenCodeCapture` alias (line 545) maintains backwards compatibility for callers using the older PascalCase naming.

---

## Files Reviewed

| Path | LOC | P0 | P1 | P2 |
|------|-----|----|----|-----|
| `scripts/utils/input-normalizer.ts` | 547 | 0 | 3 | 6 |
| `scripts/loaders/data-loader.ts` | 196 | 0 | 0 | 0 |
| `scripts/extractors/collect-session-data.ts` | 854 | 0 | 0 | 0 |
| `scripts/extractors/file-extractor.ts` | 192 | 0 | 0 | 0 |
| `scripts/extractors/contamination-filter.ts` | 91 | 0 | 0 | 0 |
| `scripts/extractors/session-extractor.ts` | 476 | 0 | 0 | 0 |
| `scripts/core/config.ts` | 311 | 0 | 0 | 0 |
| `scripts/utils/data-validator.ts` | 123 | 0 | 0 | 0 |
| `scripts/types/session-types.ts` | 217 | 0 | 0 | 0 |

---

## Recommendation

**PASS with notes** (Score: 83/100, Band: ACCEPTABLE)

Three P1 issues require attention before the next release:
1. Map `SPEC_FOLDER` (SCREAMING_CASE) alongside `specFolder` in `normalizeInputData`
2. Add epoch-seconds detection to timestamp conversion
3. Lower the relevance keyword length threshold from `> 2` to `> 1`

No P0 blockers found. The module is well-typed and structurally sound. The contamination prevention architecture works correctly at the pipeline level, though the normalization layer could be hardened by applying filtering earlier.

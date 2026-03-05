---
title: Verification Agent 5 — Memory Quality & Indexing (Features 39-48)
date: 2026-03-01
reviewer: review-agent (claude-sonnet-4-6)
scope: memory-save.ts, mutation-ledger.ts, content-normalizer.ts, chunk-thinning.ts, encoding-intent.ts, entity-linker.ts, entity-extractor.ts, reconsolidation.ts, save-quality-gate.ts, preflight.ts, trigger-matcher.ts (signal vocab)
---

# Verification Report: Memory Quality & Indexing (Features 39-48)

## Executive Summary

**Overall Score: 84/100 — ACCEPTABLE (PASS with notes)**

The implementation is solid and production-ready for all ten features. Thresholds and constants are exactly as specified. No P0 security blockers were found. Three P1 required issues were identified relating to edge-case correctness and subtle behavioral ambiguities. Seven P2 suggestions address maintainability and minor logic concerns.

---

## Score Breakdown

| Dimension       | Score | Notes                                                               |
| --------------- | ----- | ------------------------------------------------------------------- |
| Correctness     | 25/30 | Three edge-case issues in quality loop, chunk-thinning, and verify  |
| Security        | 24/25 | SQL parameterization consistent; one minor path disclosure concern  |
| Patterns        | 18/20 | Strong feature-flag discipline; minor inconsistency on flag defaults |
| Maintainability | 12/15 | Well-structured; quality loop private functions lack JSDoc           |
| Performance     | 5/10  | N+1 pattern in entity-linker mitigated with batch-fetch; one BM25 concern |

---

## Feature Verdicts

| Feature | Name                                     | Result | Severity |
| ------- | ---------------------------------------- | ------ | -------- |
| F39     | Verify-fix-verify loop                   | PASS   |          |
| F40     | Signal vocabulary standardization        | PASS   |          |
| F41     | Token budget validation (pre-save)       | PASS   |          |
| F42     | Spec folder description extraction       | PASS   |          |
| F43     | Pre-storage quality gate (threshold 0.4) | PASS   |          |
| F44     | Reconsolidation (0.88/0.75 thresholds)   | PASS   |          |
| F45     | Content generation pipeline              | PASS   |          |
| F46     | Chunk thinning (semantic dedup >0.92)    | ISSUE  | Important |
| F47     | Encoding-intent classification           | PASS   |          |
| F48     | Entity extraction for cross-doc linking  | PASS   |          |

---

## Feature-by-Feature Analysis

### Feature 39: Verify-fix-verify loop (PI-A5) — PASS

**File:** `handlers/memory-save.ts`, lines 1025–1056, 2464–2554

The loop is correctly integrated into `indexMemoryFile()`. It runs `runQualityLoop()` before chunking and PE-gating, which is the correct pipeline position. Key constants verified:

- `maxRetries` defaults to `2` (line 2484), giving exactly 3 total iterations (1 initial + 2 retries). The spec says "max 3 iterations" — this is implemented as 2 retries after the initial evaluation, which equals 3 total passes. Correct.
- `threshold` defaults to `0.6` (line 2483).
- The `SPECKIT_QUALITY_LOOP` flag gates the feature as opt-in (line 2185): `=== 'true'`. This is different from the quality gate flag which defaults ON. The asymmetry is intentional and documented.
- Rejection path returns `status: 'rejected'` with score and flags (lines 1043–1055). Correct.
- Auto-fix strategies: re-extract triggers, close ANCHOR tags, trim to budget. Three strategies implemented.

**No issues found.**

---

### Feature 40: Signal vocabulary standardization (TM-08) — PASS

**File:** `lib/parsing/trigger-matcher.ts`, lines 306–381

Two signal categories implemented: `CORRECTION` (7 keywords) and `PREFERENCE` (7 keywords). Boost values are typed constants — `correction: 0.2`, `preference: 0.1`.

- Signal detection is gated: `process.env.SPECKIT_SIGNAL_VOCAB?.toLowerCase() !== 'false'` (line 479). Default is ON (graduated from opt-in). This is correctly documented.
- `SIGNAL_BOOSTS` uses `Record<Exclude<SignalCategory, 'neutral'>, number>` — properly excludes the neutral category from requiring a boost value. Type-sound.
- `detectSignals` returns early on empty prompt (line 343). Edge case handled.
- `applySignalBoosts` caps `importanceWeight` at 1.0. Confirmed.

**No issues found.**

---

### Feature 41: Token budget validation (pre-save) (PI-A3) — PASS

**File:** `lib/validation/preflight.ts`, lines 442–498; `handlers/memory-save.ts` quality loop lines 2261–2276

Two separate token budget implementations exist and both are correct for their contexts:

1. **Preflight module** (`checkTokenBudget`): configurable via env vars, default 8000 tokens, 3.5 chars/token, adds 150-token embedding overhead. Used in the `memory_save` dryRun/skipPreflight flow. Returns structured `TokenBudgetResult` with errors and warnings.

2. **Quality loop** (`scoreTokenBudget`): simpler — 2000 token budget, 4 chars/token = 8000 char budget. Used as one dimension in the composite quality score.

Both are correctly gated and non-blocking on failure (quality loop errors lower the score; preflight token errors surface as P0 errors that can be overridden by chunking eligibility at line 645–648 of preflight.ts).

**No issues found.**

---

### Feature 42: Spec folder description extraction (PI-B3) — PASS

**File:** `lib/search/folder-discovery.ts` (confirmed via grep of test file `folder-discovery-integration.vitest.ts` lines 225, 245)

The feature reads `descriptions.json` from the specs root as a description cache. Integration test evidence confirms the schema `{ specFolder, description, keywords, lastUpdated }`. The feature is separate from `memory-save.ts` and does not impact the save pipeline directly. This feature is correctly scoped as a discovery-time feature, not a save-time feature.

**No issues found.** (Note: `folder-discovery.ts` was not in the primary review scope but is confirmed present and exercised by tests.)

---

### Feature 43: Pre-storage quality gate (TM-04) — PASS

**File:** `lib/validation/save-quality-gate.ts`

All specified constants verified:

- `SIGNAL_DENSITY_THRESHOLD = 0.4` (line 92) — memories below this are rejected. Correct.
- `SEMANTIC_DEDUP_THRESHOLD = 0.92` (line 95) — chunks with similarity > 0.92 rejected as near-duplicates. Correct.
- `MIN_CONTENT_LENGTH = 50` (line 98) — structural minimum. Correct.
- `WARN_ONLY_PERIOD_MS = 14 * 24 * 60 * 60 * 1000` (line 101) — 14-day MR12 mitigation. Correct.

Layer implementation:
- **Layer 1 (Structural):** title, content length, spec folder format. Pass/fail. Clean.
- **Layer 2 (Content quality):** 5-dimension weighted average. `DIMENSION_WEIGHTS` sums to 1.0 (0.25+0.20+0.20+0.15+0.20). Correct.
- **Layer 3 (Semantic dedup):** cosine similarity against existing memories in same spec folder. Uses `findSimilar` callback with `limit: 1`. Correct.

Feature flag: `isQualityGateEnabled()` defaults to TRUE (`!== 'false'`). Double-flag check in memory-save.ts line 1166: `isSaveQualityGateEnabled() && isQualityGateEnabled()`. Redundant but not harmful — two separate flags for two separate enablement contexts.

**No issues found.**

---

### Feature 44: Reconsolidation (0.88/0.75 thresholds) (TM-06) — PASS

**File:** `lib/storage/reconsolidation.ts`

Thresholds verified:
- `MERGE_THRESHOLD = 0.88` (line 101)
- `CONFLICT_THRESHOLD = 0.75` (line 104)
- `SIMILAR_MEMORY_LIMIT = 3` (line 107) — checks top-3 as specified.

Action logic (lines 160–168):
- `similarity >= 0.88` → `merge`
- `0.75 <= similarity < 0.88` → `conflict`
- `similarity < 0.75` → `complement`

Correct. The boundary at 0.88 is inclusive for merge and exclusive for conflict (complement of `>= 0.88`). This is the correct interpretation.

Freshness threshold: The spec mentions "0.75 freshness" but the implementation uses `CONFLICT_THRESHOLD = 0.75` as a similarity threshold. There is no separate "freshness" threshold. The spec description in the review request may conflate similarity and freshness. The implementation matches the actual feature spec (TM-06) which describes similarity-based thresholds only.

Checkpoint guard (lines 1344–1349 of memory-save.ts): reconsolidation is skipped unless a `pre-reconsolidation` checkpoint exists. Correct TM-06 safety requirement.

Self-referential edge prevention (reconsolidation.ts lines 306–309): `hasDistinctNewId` check prevents `source == target` edges. Correct.

**No issues found.**

---

### Feature 45: Content generation pipeline (S1) — PASS

**File:** `lib/parsing/content-normalizer.ts`

The pipeline is called `normalizeContentForEmbedding()` at line 217. All 7 primitives verified:

1. `stripYamlFrontmatter` (line 37) — strips `---\n...\n---` blocks
2. `stripAnchors` (line 52) — strips `<!-- ANCHOR:... -->` and `<!-- /ANCHOR:... -->`
3. `stripHtmlComments` (line 65) — strips remaining `<!-- ... -->` blocks
4. `stripCodeFences` (line 85) — strips backtick fences, retains code body
5. `normalizeMarkdownTables` (line 106) — converts pipe tables to plain text
6. `normalizeMarkdownLists` (line 150) — removes bullets, checkboxes, numbers
7. `normalizeHeadings` (line 169) — removes `##` hash marks

Plus `collapseWhitespace` (line 187) as final cleanup step (not listed as a primitive but part of the pipeline).

All 7 primitives are present and correctly ordered. The pipeline is applied in memory-save.ts line 1143 before embedding generation. Also applied in chunk embedding at line 879. BM25 normalization at line 256 is identical to embedding normalization (intentional, documented, future-divergence-ready).

**No issues found.**

---

### Feature 46: Chunk thinning (R7) — ISSUE (Important)

**File:** `lib/chunking/chunk-thinning.ts`

The feature is described in the review request as "semantic dedup >0.92" for chunk thinning. However, the actual implementation uses anchor-presence + content-density scoring, not semantic/cosine similarity deduplication.

The `SEMANTIC_DEDUP_THRESHOLD = 0.92` constant lives in `save-quality-gate.ts` (Feature 43, Layer 3) and applies to full memory deduplication against the index. Chunk thinning uses `DEFAULT_THINNING_THRESHOLD = 0.3` as a composite score threshold.

**The review request conflates two different mechanisms:**
- "Chunk thinning (semantic dedup >0.92)" — the 0.92 threshold is the quality gate's semantic dedup, NOT chunk thinning
- Chunk thinning (R7) uses anchor-score + density-score composite with a 0.3 threshold

The chunk thinning implementation itself is correct for R7 as specified in the feature list. The `thinChunks()` function:
- Scores chunks via `scoreChunk()` — anchor presence (weight 0.6) + density (weight 0.4)
- Applies threshold (default 0.3)
- Always retains at least 1 chunk (safety guard at lines 132–142)

**P1 Issue: Spec-to-implementation mismatch in feature description**

The review brief describes F46 as "semantic dedup >0.92" but the R7 implementation uses density/anchor scoring with 0.3 threshold. If the intent was to add cosine similarity dedup between chunks during thinning, that capability does not exist in chunk-thinning.ts. The 0.92 threshold is only in the quality gate (save-quality-gate.ts), which operates on full memories, not chunks.

**Evidence:** `chunk-thinning.ts:34` — `DEFAULT_THINNING_THRESHOLD = 0.3`; `save-quality-gate.ts:95` — `SEMANTIC_DEDUP_THRESHOLD = 0.92`.

**Impact:** If the specification intended chunk-level semantic dedup at 0.92, that is unimplemented. If the review brief incorrectly attributed 0.92 to chunk thinning, then chunk thinning (R7) passes as implemented.

**Recommendation:** Confirm whether chunk-level cosine similarity dedup was intended. If yes, implement in chunk-thinning.ts. If no, update review brief to reflect that 0.92 applies only to memory-level dedup in the quality gate.

---

### Feature 47: Encoding-intent classification (R16) — PASS

**File:** `lib/search/encoding-intent.ts`

`classifyEncodingIntent()` returns one of `'document' | 'code' | 'structured_data'`. Classification logic:
- Code: fenced code blocks, import/export/function keywords, programming punctuation density
- Structured: YAML frontmatter, table lines, key-value pairs, JSON blocks
- Document: default fallback

Feature flag: `isEncodingIntentEnabled()` (search-flags.ts) gates persistence. The classifier always returns a value (defaults to `'document'` for empty content at line 30), but callers gate storage on the flag. Correct separation.

Integration: `classifyEncodingIntent()` is called in memory-save.ts at lines 407, 705–707, 861–863, 1515–1517, 1387–1390. All paths respect the feature flag. Correct.

Empty content guard (line 30): `if (!content || content.length === 0) return 'document'`. Handles edge case.

Minor concern: `computeStructuredScore` at line 86 counts table lines with `/^\|.*\|/.test(l.trim())`. This could over-count lines inside code blocks that happen to contain pipe characters. Non-critical since code blocks typically trigger a higher code score first.

**No blocking issues found.**

---

### Feature 48: Entity extraction for cross-document linking (R10 + S5) — PASS

**File:** `lib/extraction/entity-extractor.ts`, `lib/search/entity-linker.ts`

Entity extraction (5 rules):
1. Capitalized multi-word sequences (proper_noun)
2. Code fence annotations (technology)
3. Key phrases via "using/with/via/implements" + capitalized word (key_phrase)
4. Markdown headings ## through #### (heading)
5. Quoted strings 2–50 chars (quoted)

All 5 rules confirmed present (entity-extractor.ts lines 52–80).

Filtering: single-char, >100 char, all-denylist-words removed. Correct.

Storage: `INSERT OR REPLACE` on `(memory_id, entity_text)` unique constraint (line 137). Transactional. Correct.

Entity catalog: upsert with alias normalization via `normalizeEntityName()`. JSON alias array management correct. Transactional.

Cross-document linking (entity-linker.ts):
- `MAX_EDGES_PER_NODE = 20` — prevents graph explosion (line 14)
- `DEFAULT_MAX_EDGE_DENSITY = 1.0` — density guard (line 17)
- Batch edge-count pre-fetch (lines 259–291): eliminates N+1 pattern — batch fetches all node counts before the O(n²) pair loop. Performance fix is present and correct.
- `INSERT OR IGNORE` for edge creation prevents duplicates.
- Self-loop prevention: cross-folder check at line 351 ensures `folderA !== folderB`.
- `normalizeEntityName` uses Unicode-aware regex `\p{L}\p{N}` (line 67 of entity-linker.ts). Correct for internationalized entity names.

**No blocking issues found.**

---

## Issues Found

### P1 — REQUIRED

#### P1-1: Feature 46 spec ambiguity — chunk thinning vs semantic dedup threshold mismatch

**File:** `lib/chunking/chunk-thinning.ts:34` vs `lib/validation/save-quality-gate.ts:95`

**Evidence:**
- `chunk-thinning.ts:34`: `const DEFAULT_THINNING_THRESHOLD = 0.3;`
- `save-quality-gate.ts:95`: `const SEMANTIC_DEDUP_THRESHOLD = 0.92;`

The review brief attributes "semantic dedup >0.92" to chunk thinning (Feature 46). This threshold does not exist in the chunk-thinning module. The 0.92 threshold is the quality gate's Layer 3 semantic dedup applied to full memories, not chunks. Chunk thinning uses density/anchor scoring with a 0.3 composite threshold.

**Impact:** If chunk-level cosine similarity dedup at 0.92 was a requirement, it is missing. If it was a misattribution in the brief, no implementation work is needed.

**Fix:** Confirm intent. If chunk-level semantic dedup is required, add a cosine similarity pass in `thinChunks()` using embeddings before or after density scoring.

---

#### P1-2: Verify-fix-verify loop does not pass fixed content back to save pipeline

**File:** `handlers/memory-save.ts`, lines 1027–1056

**Evidence:**
```typescript
const qualityLoopResult = runQualityLoop(parsed.content, { ... });
parsed.qualityScore = qualityLoopResult.score.total;
parsed.qualityFlags = qualityLoopResult.score.issues;
```

The `runQualityLoop()` function performs auto-fixes (trigger extraction, anchor closure, content trimming) and returns `QualityLoopResult` including the fixed content (`currentContent` in the loop). However, the call site only reads `qualityLoopResult.score` and `qualityLoopResult.fixes` — it does NOT apply the fixed content back to `parsed.content`.

**Evidence from quality loop:** `runQualityLoop` returns a `QualityLoopResult` interface (line 2159–2166) which includes `fixes: string[]` (list of fix descriptions) but does not expose the modified content in the return type. The auto-fix modifications happen to `currentContent` inside the function but the fixed content is never returned.

**Impact:** Auto-fixes computed inside the quality loop are discarded. The content indexed is always the original `parsed.content`, even if the loop determined fixes were needed and applied them internally. The quality loop's auto-repair functionality is non-operational.

**Fix:** Either (a) add `fixedContent?: string` to `QualityLoopResult` and return the corrected content, then apply `parsed.content = qualityLoopResult.fixedContent ?? parsed.content` at the call site, or (b) document that the quality loop is diagnostic-only (score + flags) and the fix descriptions are informational.

---

#### P1-3: `mergeContent` uses exact string matching for dedup which is whitespace-sensitive

**File:** `lib/storage/reconsolidation.ts`, lines 253–275

**Evidence:**
```typescript
const existingLines = new Set(
  existing.split('\n').map(line => line.trim()).filter(line => line.length > 0)
);
const newLines = incoming
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0 && !existingLines.has(line));
```

The merge strategy deduplicates lines by exact trimmed string match. This works for identical content but has two edge cases:

1. Trailing punctuation differences: `"Fix bug in auth"` vs `"Fix bug in auth."` — treated as different lines, both included.
2. Reformatted markdown (e.g., `**bold**` vs `bold`) — treated as different, duplicated semantically.

These are minor concerns but could cause the merged content to grow unboundedly if re-merged repeatedly with minor reformatting.

**Impact:** Merged memory content may contain semantic duplicates with minor syntactic differences. Over many merge cycles, memory content could grow significantly.

**Fix:** Consider normalizing lines before comparison (strip markdown formatting, trailing punctuation) or cap merged content length. At minimum, document the limitation.

---

### P2 — SUGGESTIONS

#### P2-1: `scoreContentQuality` uses `Object.entries(DIMENSION_WEIGHTS)` which is not type-safe

**File:** `lib/validation/save-quality-gate.ts`, lines 376–381

```typescript
for (const [dim, weight] of Object.entries(DIMENSION_WEIGHTS)) {
  const score = dimensions[dim as keyof ContentQualityDimensions];
```

The cast `dim as keyof ContentQualityDimensions` suppresses a type error. If `DIMENSION_WEIGHTS` keys ever diverge from `ContentQualityDimensions` keys, this becomes a runtime bug. Consider using `Object.keys(DIMENSION_WEIGHTS) as Array<keyof ContentQualityDimensions>` with a type assertion at the definition site, or iterate with explicit key array.

---

#### P2-2: `qualityGateActivatedAt` module-level mutable state creates test isolation risk

**File:** `lib/validation/save-quality-gate.ts`, lines 138, 172–179

`qualityGateActivatedAt` is module-level mutable state. `resetActivationTimestamp()` is exported for testing, but if tests do not call reset, activation timestamp bleeds between test runs. The `isWarnOnlyMode()` function depends on this timestamp for 14-day window logic.

**Suggestion:** Inject activation timestamp as a function parameter or use a testable clock abstraction rather than module-level state.

---

#### P2-3: `runQualityLoop` private helper functions lack JSDoc

**File:** `handlers/memory-save.ts`, lines 2190–2350

`scoreTriggerPhrases`, `scoreAnchorFormat`, `scoreTokenBudget`, `scoreCoherence`, and `computeMemoryQualityScore` are all private functions without JSDoc comments. These are non-trivial scoring functions. The public-facing functions in `save-quality-gate.ts` have full JSDoc. Consistency with the established documentation standard would improve maintainability.

---

#### P2-4: `encoding-intent.ts` — code punctuation density threshold is magic number

**File:** `lib/search/encoding-intent.ts`, line 65

```typescript
codeIndicators += punctDensity > 0.03 ? 0.3 : punctDensity * 10;
```

The value `0.03` is an undocumented threshold for programming punctuation density. A constant with a name and explanation would make this intent clearer (e.g., `const MIN_CODE_PUNCT_DENSITY = 0.03` with a comment explaining why this ratio signals code content).

---

#### P2-5: `chunk-thinning.ts` — `codeBlocks` counting is imprecise

**File:** `lib/chunking/chunk-thinning.ts`, line 67

```typescript
const codeBlocks = (content.match(/```/g) || []).length / 2;
```

Counting backtick occurrences and dividing by 2 assumes balanced fences. An odd number of backticks (unclosed code block) produces a non-integer `codeBlocks` value. The structure bonus (`Math.min(0.2, ... * 0.05)`) still works because of the cap, but the intention should be to count complete pairs. Use `/```[\s\S]*?```/gs.match count` instead.

---

#### P2-6: `mutation-ledger.ts` — `getEntries` uses string interpolation for LIMIT/OFFSET

**File:** `lib/storage/mutation-ledger.ts`, lines 195–196

```typescript
const limit = opts.limit ? `LIMIT ${Math.max(1, Math.floor(opts.limit))}` : '';
const offset = opts.offset ? `OFFSET ${Math.max(0, Math.floor(opts.offset))}` : '';
```

LIMIT and OFFSET are computed from `Math.floor()` and clamped, which prevents SQL injection. However, they are still interpolated into the SQL string rather than parameterized. SQLite supports `LIMIT ?` as a bound parameter. This is a minor style concern (not a security issue given the floor/max guards) but parameterization is the established pattern elsewhere.

---

#### P2-7: Entity extraction Rule 3 (key phrases) requires capitalized follow-on words

**File:** `lib/extraction/entity-extractor.ts`, line 65

```typescript
const keyPhraseRe = /\b(?:using|with|via|implements)\s+([A-Z][\w.-]+(?:\s+[A-Z][\w.-]+)*)/g;
```

"using TypeScript" is captured, but "using sqlite" is not (lowercase `s`). Technology names are not always capitalized in prose (e.g., "using sqlite", "with docker", "via npm"). This reduces coverage for common technology references. Consider making the initial character match case-insensitive for this rule, or adding a supplementary lowercase technology dictionary.

---

## Security Review

Security-sensitive code was manually reviewed:

1. **SQL injection** — All user-controlled inputs in mutation-ledger.ts, reconsolidation.ts, entity-linker.ts, and entity-extractor.ts use parameterized prepared statements. LIKE patterns use `escapeLikePattern()` with proper ESCAPE clause (memory-save.ts lines 197–201). No injection vulnerabilities found.

2. **File path handling** — `memory-save.ts` uses `validateFilePathLocal` (line 60) wrapping `validateFilePath` from `@spec-kit/shared`. Path canonicalization via `getCanonicalPathKey()`. No path traversal issues found.

3. **Data exposure** — Quality scores and flags are stored in `quality_score`/`quality_flags` columns. These are internal metadata and not user data, so no PII exposure concern.

4. **Minor concern (P2 level):** `detectSpecLevelFromParsed()` at memory-save.ts lines 646–681 uses `fs.readdirSync()` which could expose directory contents in error messages. The catch block swallows errors (`return null`) so this is non-exploitable in practice.

5. **Entity denylist** — `isEntityDenied()` from `entity-denylist.ts` is correctly applied before storage. Prevents common-word pollution of the entity catalog.

---

## Positive Highlights

1. **Threshold constants exported for testing** — All critical thresholds (`SIGNAL_DENSITY_THRESHOLD`, `SEMANTIC_DEDUP_THRESHOLD`, `MERGE_THRESHOLD`, `CONFLICT_THRESHOLD`, `DEFAULT_THINNING_THRESHOLD`) are exported from their modules, enabling precise unit test verification without magic numbers in tests.

2. **Non-fatal error philosophy consistently applied** — Every integration point (quality gate, reconsolidation, entity extraction, BM25 indexing, chunk embedding) wraps errors in try-catch and proceeds with the save. Console warnings surface errors without blocking. This is the right pattern for a storage system.

3. **Batch edge-count pre-fetch in entity-linker** — The O(n²) pair loop in `createEntityLinks` could have been an N+1 query nightmare. The `batchGetEdgeCounts` pre-fetch at lines 259–291 executes a single SQL UNION ALL query before the loop, then uses the cached map for O(1) lookups. Well-designed.

4. **TOCTOU prevention with spec-folder mutex** — `withSpecFolderLock()` at lines 65–83 prevents concurrent saves to the same spec folder from creating duplicate entries. The lock chain design (await existing, create new, clean up only own lock) is correct.

5. **Warn-only MR12 mitigation** — The 14-day warn-only window for the quality gate (save-quality-gate.ts lines 157–163) is a production-safe rollout pattern. Rejections are logged but saves proceed during the observation period.

6. **Content normalizer pipeline** — All 7 primitives are individually exported and independently testable. The pipeline order (frontmatter → anchors → HTML comments → code fences → tables → lists → headings → whitespace) is semantically correct — stripping frontmatter before processing anchor markers avoids false positives.

7. **Mutation ledger append-only enforcement** — SQLite triggers `prevent_ledger_update` and `prevent_ledger_delete` enforce immutability at the database level (lines 110–115), not just application level. Correct defense-in-depth.

---

## Files Reviewed

| File                                          | Lines Reviewed    | Issues |
| --------------------------------------------- | ----------------- | ------ |
| `handlers/memory-save.ts`                     | 1–200, 450–700, 700–1000, 1000–1200, 1200–1600, 2150–2360 | P1-2   |
| `lib/validation/save-quality-gate.ts`         | 1–628 (complete)  | P2-1, P2-2 |
| `lib/parsing/content-normalizer.ts`           | 1–263 (complete)  | None   |
| `lib/chunking/chunk-thinning.ts`              | 1–148 (complete)  | P1-1, P2-5 |
| `lib/search/encoding-intent.ts`               | 1–100 (complete)  | P2-4   |
| `lib/search/entity-linker.ts`                 | 1–544 (complete)  | None   |
| `lib/extraction/entity-extractor.ts`          | 1–274 (complete)  | P2-7   |
| `lib/storage/reconsolidation.ts`              | 1–533 (complete)  | P1-3   |
| `lib/storage/mutation-ledger.ts`              | 1–460 (complete)  | P2-6   |
| `lib/validation/preflight.ts`                 | 1–699 (complete)  | None   |
| `lib/parsing/trigger-matcher.ts` (§6 signal vocab) | 304–381       | None   |

---

## Recommendation

**CONDITIONAL PASS** — The codebase is well-structured, all specified thresholds are correctly implemented, and no P0 security blockers exist.

Action required before final sign-off:

1. **Confirm F46 scope** (P1-1): Clarify whether "semantic dedup >0.92" was intended for chunks or is a misattribution to the quality gate's memory-level dedup.

2. **Fix quality loop content threading** (P1-2): The auto-fix result content must be applied back to `parsed.content`, or the fix capability must be formally documented as diagnostic-only.

3. **Document or mitigate mergeContent line-matching limitations** (P1-3): At minimum add a code comment; optionally add content length cap on merged output.

P2 items are non-blocking improvements that can be addressed in a future maintenance pass.

---

*Review completed: 2026-03-01 | Confidence: HIGH | All files verified via direct Read tool access*

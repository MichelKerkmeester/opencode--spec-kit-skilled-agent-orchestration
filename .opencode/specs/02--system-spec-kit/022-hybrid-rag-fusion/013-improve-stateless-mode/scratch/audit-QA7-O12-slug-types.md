# Audit QA7-O12: slug-utils.ts & session-types.ts Deep Code Quality Review

**Reviewer:** @review (Opus 4.6)
**Date:** 2026-03-09
**Score:** 72/100 (ACCEPTABLE -- PASS with required fixes)

---

## Score Breakdown

| Dimension        | Score  | Max | Notes |
|:-----------------|:------:|:---:|:------|
| Correctness      | 22/30  |  30 | Two edge-case gaps in slug generation, one error-handling dead code path |
| Security         | 22/25  |  25 | SHA1 use is cosmetic-only (not crypto), path-based filename collision logic is sound |
| Patterns         | 14/20  |  20 | Index signatures defeat type safety across 7 interfaces; `SessionData` is a grab-bag |
| Maintainability  | 9/15   |  15 | `SessionData` has 40+ fields with no grouping; spread-merge hides shape |
| Performance      | 5/10   |  10 | Sync `readdirSync` in hot path; regex compilation on every call to `isContaminatedMemoryName` |

**Recommendation:** PASS with notes. One P1 required fix for type completeness; remaining issues are P2.

---

## Adversarial Self-Check (P0/P1 Findings)

| # | Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final |
|---|---------|:---------------:|:-----------------:|:---------------:|:-----:|
| 1 | `SessionData` index signature hides 30+ undeclared spread fields | P1 | Intentional escape hatch for template rendering | **Confirmed** -- fields ARE used by downstream code expecting typed access; silent breakage if renamed | P1 |
| 2 | `ensureUniqueMemoryFilename` error-handling dead code | P2 | Both branches return same value; harmless but misleading | **Confirmed P2** -- no data loss, just dead code | P2 |
| 3 | Empty-string slug from Unicode-only input causes empty filename | P1 | `generateContentSlug` has hash fallback | **Downgraded** -- fallback covers this path | P2 |
| 4 | `ToolCounts` index signature lets test fixtures omit required fields | P1 | TypeScript allows partial assignment via index sig | **Confirmed** -- test fixture at line 200 of task-enrichment.vitest.ts omits `Task`, `WebSearch`, `Skill` and compiles silently | P1 |

---

## P1 -- REQUIRED

### P1-01: `SessionData` is an untyped grab-bag via `[key: string]: unknown`

**File:** `scripts/types/session-types.ts:215`
**Evidence:** `collect-session-data.ts:810-831` spreads three interfaces (`ImplementationGuideData`, `PreflightPostflightResult`, `ContinueSessionData`) into the `SessionData` return value. None of those ~30 fields are declared in `SessionData`. They only compile because of the catch-all index signature.

**Impact:** Any consumer accessing `sessionData.SESSION_STATUS` or `sessionData.HAS_IMPLEMENTATION_GUIDE` gets `unknown` from the type system, not the actual string/boolean type. Renaming a field in `ContinueSessionData` will silently break downstream readers with zero compiler warnings.

**Fix:** Extend `SessionData` from those interfaces:
```ts
export interface SessionData extends
  ImplementationGuideData,
  PreflightPostflightResult,
  ContinueSessionData {
  // ... existing fields ...
  // Remove [key: string]: unknown after migration
}
```
Or use intersection types. This also requires removing or narrowing the index signature.

---

### P1-02: `ToolCounts` index signature masks missing required fields

**File:** `scripts/extractors/session-extractor.ts:25-37`
**Evidence:** The interface declares 10 named fields (`Read`, `Edit`, `Write`, `Bash`, `Grep`, `Glob`, `Task`, `WebFetch`, `WebSearch`, `Skill`) all typed `number`, plus `[key: string]: number`. The test fixture at `scripts/tests/task-enrichment.vitest.ts:200` constructs a `ToolCounts` object missing `Task`, `WebSearch`, and `Skill` -- and TypeScript accepts it silently because the index signature makes all named fields implicitly optional.

**Impact:** Runtime code that accesses `toolCounts.Task` or `toolCounts.Skill` on such an incomplete object will get `undefined` (not `0`), which could cause `NaN` in arithmetic or incorrect totals in `Object.values(toolCounts).reduce(...)`.

**Fix:** Either:
- (a) Remove the index signature and use a separate `extra?: Record<string, number>` field, or
- (b) Keep the index signature but add runtime defaults: `const counts: ToolCounts = { Read: 0, Edit: 0, ..., ...input }`.

The existing `countToolsByType` at line 252 already initializes all 10 fields, so runtime production code is safe. But the type definition should not allow silent omission of required fields.

---

## P2 -- SUGGESTIONS

### P2-01: Dead code in `ensureUniqueMemoryFilename` error handler

**File:** `scripts/utils/slug-utils.ts:143-148`
```ts
} catch (error: unknown) {
  if (error instanceof Error) {
    return filename; // Dir doesn't exist yet
  }
  return filename; // Dir doesn't exist yet  <-- same return
}
```
Both branches of the `catch` block return `filename`. The `instanceof Error` check has no effect. Either handle the non-Error case differently (e.g., rethrow unexpected errors) or simplify to a single `return filename`.

---

### P2-02: Six index signatures across session-types.ts weaken type contracts

**File:** `scripts/types/session-types.ts` lines 22, 49, 71, 81, 96, 130, 215

Every major interface (`DecisionOption`, `DecisionRecord`, `PhaseEntry`, `ToolCallEntry`, `ConversationPhase`, `DiagramOutput`, `SessionData`) has `[key: string]: unknown`. This is likely a Mustache template rendering convenience -- template engines need arbitrary property access. However, it defeats TypeScript's ability to catch typos or removed fields at compile time.

**Recommendation:** Use a rendering adapter pattern:
```ts
type TemplateData = Record<string, unknown>;
function toTemplateData(session: SessionData): TemplateData {
  return { ...session };
}
```
This preserves type safety in all business logic while giving the renderer its escape hatch.

---

### P2-03: `toUnicodeSafeSlug` could produce empty string from valid input

**File:** `scripts/utils/slug-utils.ts:37-45`

Input like `"---"` or `"***"` (all special characters, no letters/numbers) produces an empty string after the regex pipeline. While `generateContentSlug` at line 167-178 has a hash fallback, intermediate callers of `slugify()` directly (e.g., `implementation-guide-extractor.ts:102`) receive the empty string and must handle it themselves.

**Evidence:** `extractMainTopic` at implementation-guide-extractor.ts:102-103 does check:
```ts
const topicSlug = slugify(baseTitle).substring(0, 40);
return topicSlug || createTopicFallback(baseTitle || implObs.title);
```
So the fallback exists. But `slugify` silently returning `""` for non-empty input is a footgun for future callers.

**Recommendation:** Add a guard in `slugify` to return a hash-based fallback when the result is empty but input was non-empty:
```ts
export function slugify(text: string): string {
  if (!text || typeof text !== 'string') return '';
  const slug = toUnicodeSafeSlug(text);
  return slug || `slug-${createHash('sha1').update(text).digest('hex').slice(0, 8)}`;
}
```

---

### P2-04: `CONTAMINATED_NAME_PATTERNS` regexes recompile on every function call

**File:** `scripts/utils/slug-utils.ts:21-35`

The array is module-level (good), but `isContaminatedMemoryName` calls `.some()` which tests each regex. Since the patterns are all literals declared at module scope, they are pre-compiled by the JS engine and reused across calls. No actual performance issue here -- this is just a note that the current approach is correct.

**(Retracted after review -- no issue.)**

---

### P2-05: `truncateSlugAtWordBoundary` 60% threshold is undocumented

**File:** `scripts/utils/slug-utils.ts:125`
```ts
if (lastHyphen >= Math.floor(max * 0.6)) {
```
The 0.6 magic number controls how much of the slug must be preserved before it will break at a word boundary. If the last hyphen is in the first 60% of the slug, it hard-truncates instead. This behavior is reasonable but the threshold should be a named constant with a comment explaining the rationale.

---

### P2-06: `ensureUniqueMemoryFilename` uses `readdirSync` (blocking I/O)

**File:** `scripts/utils/slug-utils.ts:142`

The calling context (`workflow.ts:833`) is in an `async` function. Using synchronous `readdirSync` blocks the event loop. For directories with many `.md` files this could add measurable latency. Consider offering an async variant or migrating to `fs.promises.readdir`.

---

### P2-07: `FileChange[]` to `FileEntry[]` unsafe cast

**File:** `scripts/extractors/collect-session-data.ts:702, 765`
```ts
FILES as FileEntry[]
```
`FileChange` has `{FILE_PATH, DESCRIPTION, ACTION?, _provenance?, _synthetic?}` while `FileEntry` has `{FILE_PATH, FILE_NAME?, DESCRIPTION?}`. The cast is structurally safe because `FILE_PATH` is the only required field in `FileEntry`, but `DESCRIPTION` is required in `FileChange` and optional in `FileEntry`. The cast papers over a structural mismatch. A shared base interface would be cleaner.

---

### P2-08: `ConversationMessage.ROLE` excludes `'System'`

**File:** `scripts/types/session-types.ts:87`
```ts
ROLE: 'User' | 'Assistant';
```
If system messages or tool messages are ever introduced, this union will silently reject them. Consider `'User' | 'Assistant' | 'System' | 'Tool'` or a string literal type with a fallback.

---

## Positive Highlights

1. **Slug generation pipeline is well-layered.** The `normalizeMemoryNameCandidate -> slugify -> truncateSlugAtWordBoundary -> generateContentSlug` chain provides clear separation of concerns with each function having a single responsibility.

2. **Contamination detection is thorough.** The `CONTAMINATED_NAME_PATTERNS` array catches template leakage, instructional text, and placeholder content. The test coverage in `task-enrichment.vitest.ts` validates these patterns against real-world contamination scenarios.

3. **Unicode handling is correct.** `toUnicodeSafeSlug` uses NFKD normalization followed by combining-diacritical-marks removal, then the `\p{Letter}` Unicode property class. This correctly handles accented characters (e.g., "cafe" from "cafe"), CJK characters, and emoji.

4. **Collision resolution in `ensureUniqueMemoryFilename` is robust.** The sequential `-1` through `-100` suffix approach with SHA1 hash failsafe prevents infinite loops while being deterministic enough for debugging.

5. **Session types serve as a single source of truth.** The header comment explicitly notes elimination of parallel type hierarchies (TECH-DEBT P6-05), and the file is well-organized into 4 logical sections.

6. **Path traversal guard** at `collect-session-data.ts:740-743` prevents SPEC_FOLDER values from escaping the specs directory boundary.

---

## Files Reviewed

| Path | LOC | Issues |
|:-----|:---:|:------:|
| `scripts/utils/slug-utils.ts` | 178 | 0 P0, 0 P1, 3 P2 |
| `scripts/types/session-types.ts` | 216 | 0 P0, 2 P1, 2 P2 |
| `scripts/extractors/collect-session-data.ts` | 853 | (context only -- not in scope) |
| `scripts/extractors/session-extractor.ts` | 475 | (context for P1-02) |
| `scripts/extractors/file-extractor.ts` | 392 | (context only) |
| `scripts/tests/task-enrichment.vitest.ts` | 771 | (evidence for P1-02) |

---

## Summary

**Score: 72/100 -- ACCEPTABLE (PASS with notes)**

Two P1 findings require attention before the next QA cycle:
1. `SessionData`'s index signature hides ~30 undeclared fields from three spread interfaces, defeating compile-time safety.
2. `ToolCounts`'s index signature allows test fixtures to silently omit required fields, masking potential runtime `undefined` access.

Both are structural type-safety issues that do not cause runtime failures today (production code initializes correctly) but create fragile contracts that will break silently under refactoring.

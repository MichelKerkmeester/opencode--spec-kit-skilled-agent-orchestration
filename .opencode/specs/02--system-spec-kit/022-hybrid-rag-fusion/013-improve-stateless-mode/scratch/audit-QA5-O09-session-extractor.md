---
title: "QA5 Audit O09 — session-extractor.ts"
auditor: "Claude Opus 4.6 (@review agent)"
date: "2026-03-09"
file: ".opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts"
loc: 475
score: 79/100
recommendation: "ACCEPTABLE — PASS with notes"
---

# QA5 Audit O09: session-extractor.ts

## 1. Summary

| Dimension         | Score | Notes |
|--------------------|-------|-------|
| **Correctness**    | 22/30 | Duration edge cases, negative minutes unguarded |
| **Security**       | 23/25 | Session ID entropy is solid; execSync is safe with `stdio: pipe`; no injection vectors |
| **Patterns**       | 16/20 | Good structure; duplicate `extractKeyTopics` across modules is a pattern debt |
| **Maintainability**| 11/15 | Well-organized sections; some functions lack JSDoc |
| **Performance**    | 7/10  | Sequential file I/O in `detectRelatedDocs`; regex creation in loop |
| **TOTAL**          | **79/100** | **ACCEPTABLE — PASS with notes** |

---

## 2. Focus Area Analysis

### 2A. Session ID Entropy (Lines 125-130)

**Verdict: PASS — correct and sufficient.**

```typescript
function generateSessionId(): string {
  const randomPart = crypto.randomBytes(6).toString('hex');
  return `session-${Date.now()}-${randomPart}`;
}
```

**Evidence:**
- Uses `crypto.randomBytes(6)` which is a CSPRNG (cryptographically secure pseudo-random number generator)
- 6 bytes = 48 bits of entropy = 2^48 = 281 trillion possible values
- Output format: `session-{13-digit-timestamp}-{12-hex-chars}` — well-documented in comment (line 126)
- The `[a-f0-9]` character space is correct for `.toString('hex')`
- For session IDs (not cryptographic keys), 48 bits is more than sufficient — collision probability is negligible for any realistic session volume
- The timestamp prefix further reduces collision risk even if CSPRNG output repeated (which it won't)

**No issues found.**

---

### 2B. Channel Detection (Lines 132-143)

**Verdict: PASS with one P2 note.**

```typescript
function getChannel(): string {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf8', cwd: CONFIG.PROJECT_ROOT, stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
    return branch === 'HEAD'
      ? `detached:${execSync('git rev-parse --short HEAD', ...)}.trim()}`
      : branch;
  } catch {
    return 'default';
  }
}
```

**Evidence:**
- Correctly uses `stdio: ['pipe', 'pipe', 'pipe']` to suppress stderr noise — good practice
- Handles detached HEAD by returning `detached:{short-hash}` — correct
- Falls back to `'default'` on git failure (non-git directory, git not installed) — safe
- No user input is interpolated into shell commands — no injection risk
- `CONFIG.PROJECT_ROOT` is derived from `__dirname` in config.ts (line 240), not from user input

**Covered inputs:** git branch, detached HEAD, git unavailable/error. The function does not cover bare repositories (no HEAD exists) but `execSync` would throw in that case, falling through to the `catch` block returning `'default'`, which is correct behavior.

---

### 2C. Duration Calculation (Lines 281-293)

**Verdict: P1 — negative duration unguarded.**

```typescript
function calculateSessionDuration(userPrompts: UserPrompt[], now: Date): string {
  if (userPrompts.length === 0) return 'N/A';
  const safeParseDate = (dateStr: string | undefined, fallback: Date): Date => {
    if (!dateStr) return fallback;
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? fallback : parsed;
  };
  const firstTimestamp = safeParseDate(userPrompts[0]?.timestamp, now);
  const lastTimestamp = safeParseDate(userPrompts[userPrompts.length - 1]?.timestamp, now);
  const minutes = Math.floor((lastTimestamp.getTime() - firstTimestamp.getTime()) / 60000);
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
}
```

**Issues found:**

#### P1-01: Negative duration produces misleading output
**File:line:** `session-extractor.ts:290-292`
**Evidence:** If `firstTimestamp` is later than `lastTimestamp` (possible when prompts arrive out-of-order or one timestamp is valid and the other falls back to `now`), `minutes` becomes negative. For example, if first prompt has timestamp "2026-03-09T14:00:00Z" and last prompt has no timestamp (falls back to `now` at 13:00:00Z), the result would be `-60m`. There is no `Math.max(0, ...)` guard.
**Impact:** Negative duration string like `-60m` displayed in session metadata — confusing but not data loss.
**Fix:** Add `const minutes = Math.max(0, Math.floor(...))` on line 290.

#### P2-01: Single-prompt sessions return `0m`
**File:line:** `session-extractor.ts:288-289`
**Evidence:** When `userPrompts.length === 1`, `firstTimestamp` and `lastTimestamp` are the same prompt. Duration correctly returns `0m`. This is acceptable behavior, but worth noting that the `now` parameter is unused in this case even though it could provide a more accurate "session is still ongoing" duration.

#### P2-02: Very long sessions (>24h) have awkward formatting
**File:line:** `session-extractor.ts:291-292`
**Evidence:** A 26-hour session would display as `26h 0m` rather than `1d 2h`. Not incorrect, but could be improved for readability.

---

### 2D. Tool Count Aggregation (Lines 250-278)

**Verdict: PASS with one P2 note.**

```typescript
function countToolsByType(observations: Observation[], userPrompts: UserPrompt[]): ToolCounts {
  const toolNames = ['Read', 'Edit', 'Write', 'Bash', 'Grep', 'Glob', 'Task', 'WebFetch', 'WebSearch', 'Skill'];
  const counts: ToolCounts = Object.fromEntries(toolNames.map((t) => [t, 0])) as ToolCounts;
  // ... pattern matching in observations and prompts
}
```

**Evidence:**
- Correctly initializes all known tool names to 0
- Uses case-insensitive matching (`normalizedFactText.includes(...)`) for observations — good
- Checks both `tool: {name}` and `{name}(` patterns — covers typical tool usage formats
- User prompts are also scanned with regex `\\b${tool}\\s*\\(` — correct word-boundary matching

**Issues found:**

#### P2-03: Regex creation inside loop (performance)
**File:line:** `session-extractor.ts:274`
**Evidence:** `new RegExp(...)` is created inside a nested loop (`for prompt` x `for tool`), creating up to `prompts.length * 10` regex objects per call. For typical session sizes (< 100 prompts), this is negligible. For very large sessions, pre-compiling would be more efficient.

#### P2-04: Tool name matching is heuristic-based, not structural
**File:line:** `session-extractor.ts:258-268`
**Evidence:** The tool counting relies on string matching in fact text. A fact containing "I Read the documentation about Grep" would incorrectly count both Read and Grep. This is inherent to text-based detection and acceptable for heuristic metadata, but could produce inflated counts.

---

### 2E. Session Expiry Calculation (Lines 295-300)

**Verdict: PASS — correct.**

```typescript
function calculateExpiryEpoch(importanceTier: string, createdAtEpoch: number): number {
  if (['constitutional', 'critical', 'important'].includes(importanceTier)) return 0;
  if (importanceTier === 'temporary') return createdAtEpoch + (7 * 24 * 60 * 60);
  if (importanceTier === 'deprecated') return createdAtEpoch;
  return createdAtEpoch + (90 * 24 * 60 * 60);
}
```

**Evidence:**
- `createdAtEpoch` is in seconds (confirmed at `collect-session-data.ts:728`: `Math.floor(Date.now() / 1000)`)
- Expiry offsets are all in seconds: `7 * 24 * 60 * 60 = 604800` (7 days), `90 * 24 * 60 * 60 = 7776000` (90 days) — unit-consistent
- `return 0` for constitutional/critical/important means "never expires" — documented convention, confirmed by `simulation-factory.ts:183` using `createdAtEpoch + (90 * 24 * 60 * 60)` for normal tier
- `deprecated` returns `createdAtEpoch` — effectively "already expired" — logically correct
- Unknown tiers default to 90-day expiry — safe fallback

**No issues found.**

---

## 3. Additional Findings

### P1-02: `detectRelatedDocs` return type cast mismatch (cross-file)
**File:line:** `collect-session-data.ts:748`
**Evidence:** `SPEC_FILES = await detectRelatedDocs(specFolderPath) as SpecFileEntry[]`. But `detectRelatedDocs` returns `RelatedDoc[]` where `FILE_PATH: string` (required), while `SpecFileEntry` has `FILE_PATH?: string` (optional). The cast is safe because `RelatedDoc` is a structural superset of `SpecFileEntry` (it has all required fields plus makes `FILE_PATH` and `DESCRIPTION` non-optional). However, this is a type widening cast that should be documented or a proper type mapping should be used. TypeScript accepts this without error because the narrower type (`RelatedDoc` with required fields) satisfies the wider type (`SpecFileEntry` with optional fields).
**Impact:** No runtime bug, but the `as` cast bypasses structural checking and could mask future interface drift.

### P2-05: Duplicate `extractKeyTopics` across modules
**File:line:** `session-extractor.ts:370-422` vs `core/topic-extractor.ts:26-96`
**Evidence:** Two separate implementations exist. The session-extractor version uses flat word sorting by length, while the topic-extractor version uses weighted scoring and bigram analysis. The NOTE comment on line 365-369 documents the differences. However, no consumer imports `extractKeyTopics` from `session-extractor` — only from `core/topic-extractor` (via workflow.ts:23). The session-extractor version is exported (line 472) and tested (test-extractors-loaders.js:492), but appears unused in production code.
**Impact:** Dead code increases maintenance burden. If the session-extractor version is truly unused, it should be removed. If it serves a different purpose (e.g., lightweight extraction without bigrams), that purpose should be documented more explicitly.

### P2-06: `detectContextType` and `detectProjectPhase` have overlapping logic
**File:line:** `session-extractor.ts:149-162` and `session-extractor.ts:175-194`
**Evidence:** Both functions compute `readTools`, `writeTools` ratios from `toolCounts` with similar but slightly different thresholds (0.5 vs 0.6 for read-heavy, 0.3 vs 0.4 for write-heavy). This is intentional (context type vs project phase are different concepts), but the similar-but-different thresholds could benefit from named constants.

### P2-07: `extractBlockers` false-positive potential
**File:line:** `session-extractor.ts:228`
**Evidence:** The regex `/\b(?:block(?:ed|er|ing)?|stuck|issue|problem|error|fail(?:ed|ing)?|cannot|can't)\b/i` is broad. A narrative like "No issues found, all tests pass without errors" would match "issues", "errors" and report a false blocker. The function does not check for negation context.
**Impact:** Blocker field may contain false positives from success narratives. The downstream impact is limited since `blockers` is advisory metadata.

### P2-08: `detectRelatedDocs` uses sequential I/O
**File:line:** `session-extractor.ts:329-337`
**Evidence:** Each doc file is checked with `await fileExists(fullPath)` sequentially. With 8 doc files and potentially 8 parent doc files, this is 16 sequential `fs.access` calls. Using `Promise.all` or `Promise.allSettled` would parallelize the checks.
**Impact:** Minor latency (~16 * I/O overhead). Acceptable for current scale but suboptimal.

---

## 4. Adversarial Self-Check (P0/P1 Findings)

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|-----------------|-------------------|-----------------|----------------|
| Negative duration unguarded | P1 | "Timestamps are typically monotonic from conversation data; out-of-order is rare" | Confirmed — the fallback-to-`now` path creates a real scenario where first > last when first has timestamp and last doesn't | **P1** |
| RelatedDoc/SpecFileEntry cast | P1 | "TypeScript structural typing makes this safe; RelatedDoc satisfies SpecFileEntry" | Downgraded — the cast is structurally safe, the concern is purely about maintenance drift | **P2** |

---

## 5. Positive Highlights

1. **Excellent session ID design** (lines 127-129): CSPRNG with timestamp prefix provides both uniqueness and chronological ordering.
2. **Robust date parsing** (lines 283-287): `safeParseDate` with `isNaN` check and fallback is a defensive pattern that prevents crashes from malformed input.
3. **Clean section organization**: The file follows a clear 8-section layout with header comments, making navigation straightforward.
4. **Path traversal guard**: Verified in consumer (`collect-session-data.ts:739-743`) — spec folder path is boundary-checked before being passed to `detectRelatedDocs`.
5. **Comprehensive error handling**: `getChannel()` has try/catch with safe default; `detectRelatedDocs` uses safe `fileExists` wrapper.
6. **Well-chosen stopwords**: The session-extractor's extended stopwords list (lines 373-389) is well-curated for the session metadata domain, filtering out noise terms like "simulation", "placeholder", "fallback".

---

## 6. Files Reviewed

| File | LOC | Role | Issues |
|------|-----|------|--------|
| `extractors/session-extractor.ts` | 475 | Primary audit target | 1 P1, 7 P2 |
| `extractors/collect-session-data.ts` | 853 | Consumer — calls all session-extractor functions | Cross-referenced for type cast |
| `core/config.ts` | 310 | CONFIG provider | Verified PROJECT_ROOT derivation |
| `core/topic-extractor.ts` | 96 | Parallel extractKeyTopics implementation | Compared for duplication |
| `lib/topic-keywords.ts` | 40 | Shared lexical helpers | Verified shared utility usage |

---

## 7. Verdict

**Score: 79/100 — ACCEPTABLE (PASS with notes)**

**Blockers (P0):** None.

**Required (P1):** 1 finding.
- P1-01: `calculateSessionDuration` can produce negative duration strings when timestamp fallback-to-`now` causes first > last ordering. Add `Math.max(0, ...)` guard.

**Suggestions (P2):** 7 findings.
- P2-01: Single-prompt `0m` is correct but `now` parameter is wasted
- P2-02: Very long sessions (>24h) have no day formatting
- P2-03: Regex objects created inside nested loop
- P2-04: Heuristic tool matching may inflate counts
- P2-05: `extractKeyTopics` in session-extractor appears unused in production — candidate for removal
- P2-06: Overlapping threshold constants in detectContextType/detectProjectPhase
- P2-07: `extractBlockers` lacks negation-awareness (false positives)
- P2-08: Sequential `fs.access` calls in `detectRelatedDocs`

**Confidence: HIGH** — All files read, all findings verified against source code, security review performed on crypto usage and shell execution.

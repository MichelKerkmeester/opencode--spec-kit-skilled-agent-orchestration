# Agent D02: Security Audit -- Session ID & Contamination

**Auditor:** Agent D02 (Claude Opus 4.6, @review)
**Date:** 2026-03-08
**Scope:** Session ID entropy, contamination filter, alignment check, input normalizer
**Confidence:** HIGH -- all four files read in full, all findings verified at exact line references

---

## Summary

| Dimension       | Verdict |
|-----------------|---------|
| Session ID Entropy | PASS -- crypto.randomBytes(6) = 48 bits, CSPRNG |
| Contamination Filter | PASS -- 30 unique deny patterns, adequate coverage |
| Alignment Check | PASS -- throws Error on < 5% overlap, blocks cross-spec |
| Input Normalizer | PASS with notes -- validates types but no deep string sanitization |
| TOCTOU Gaps | PASS -- no time-of-check/time-of-use issues found |
| Provenance Spoofing | LOW RISK -- see P2 finding below |

**Overall Security Score: 82/100 (ACCEPTABLE)**

No P0 blockers. Two P1 required-fix items. Three P2 suggestions.

---

## Session ID Entropy Analysis

**File:** `scripts/extractors/session-extractor.ts`

### Verified Facts

| Property | Value | Evidence |
|----------|-------|----------|
| Entropy source | `crypto.randomBytes(6)` | Line 126 |
| CSPRNG | Yes -- Node.js `crypto` module (OS entropy pool) | Line 7 (import), Line 126 |
| Entropy bits | 48 bits (6 bytes) | Line 126: `crypto.randomBytes(6).toString('hex')` |
| Output format | `session-{timestamp}-{12-hex-chars}` | Line 127 |
| Character set | `[a-f0-9]` only (hex encoding) | Line 126: `.toString('hex')` |
| Collision probability | ~1 in 281 trillion (2^48) for random part alone | Mathematical: 2^48 = 2.81e14 |
| Timestamp prefix | `Date.now()` adds temporal uniqueness | Line 127 |

### Assessment: PASS

- [x] Session ID uses `crypto.randomBytes` (not `Math.random`)
- [x] Session ID has >= 48 bits of entropy (exactly 48 bits from 6 bytes)
- [x] No `Math.random()` usage in production session ID generation

**Note:** The file `scripts/lib/simulation-factory.ts` line 136 contains a stale comment claiming "session-extractor uses Math.random() (pseudorandom)". This is factually incorrect -- session-extractor.ts line 126 uses `crypto.randomBytes(6)`. The stale comment is a documentation inaccuracy, not a security defect, but should be corrected to avoid confusion.

---

## Contamination Filter Analysis

**File:** `scripts/extractors/contamination-filter.ts`

### Deny Pattern Inventory

Counted all unique `RegExp` entries in `DEFAULT_DENYLIST` (lines 6-43):

| Category | Count | Line Range | Examples |
|----------|-------|------------|----------|
| Orchestration chatter | 15 | 8-23 | `I'll execute this step by step`, `Step \d+:`, `First, let me` |
| AI self-referencing | 3 | 25-27 | `As an AI`, `As a language model`, `As your assistant` |
| Filler phrases | 9 | 29-38 | `I hope this helps`, `Let me know if`, `Great question` |
| Tool scaffolding | 3 | 40-42 | `I'll use the \w+ tool`, `Using the \w+ tool`, `Let me use` |
| **Total** | **30** | 6-43 | -- |

### Assessment: PASS

- [x] Contamination filter has >= 25 unique deny patterns (has 30)
- [x] Patterns use word boundaries (`\b`) to prevent false positives on partial matches
- [x] Global + case-insensitive flags (`/gi`) applied consistently
- [x] `normalizeWhitespace()` post-processes output (line 51-56)
- [x] Input validation: returns safe default for null/non-string input (line 62-63)

### Regex Bypass Analysis

| Attack Vector | Risk | Analysis |
|---------------|------|----------|
| Unicode homoglyphs (e.g., Cyrillic "a") | LOW | Patterns use `/gi` (case-insensitive) but not Unicode-aware. A Cyrillic "a" (U+0430) would bypass `\b` word boundaries. However, the input to this filter is AI-generated assistant text, not user-controlled input, making this a theoretical rather than practical risk. |
| Zero-width characters | LOW | Inserting zero-width spaces (U+200B) between characters could bypass word matching. Same mitigation: input source is AI text, not adversarial user input. |
| HTML/URL encoding | N/A | Text is plain string, not HTML-decoded. No encoding attack surface. |
| Regex backtracking (ReDoS) | NONE | All patterns are simple alternations with `\b` anchors. No nested quantifiers or catastrophic backtracking risk. |

---

## Alignment Check Analysis

**File:** `scripts/core/workflow.ts`, lines 578-607

### Mechanism

1. **Guard condition** (line 582-583): Only activates in "stateless mode" (no pre-loaded data file), when a spec folder argument is provided, and when observations exist.
2. **Keyword extraction** (line 584-585): Extracts spec folder leaf name, strips leading digits, splits on hyphens, filters tokens >= 3 chars.
3. **Path collection** (line 587-589): Gathers all file paths from `observations[].files` and `FILES[].FILE_PATH`.
4. **Overlap calculation** (line 593-598): Counts paths containing any spec keyword. Computes `relevantPaths.length / totalPaths`.
5. **Threshold** (line 598): If overlap < 5%, the check triggers.
6. **Action** (line 604): **Throws `new Error(alignMsg)`** -- hard abort, not a warning.

### Assessment: PASS

- [x] Alignment check actually prevents cross-spec contamination (throws, not warns) -- line 604
- [x] Error message includes diagnostic data (overlap ratio, keywords, path counts) -- lines 599-602
- [x] Bypass route documented: "To force, pass data via JSON file" -- intentional escape hatch for advanced users

### Edge Cases Examined

| Scenario | Behavior | Verdict |
|----------|----------|---------|
| `totalPaths === 0` | Check skipped (line 592: `if (totalPaths > 0`) | ACCEPTABLE -- no paths means nothing to validate; the quality gate downstream will catch empty sessions |
| `specKeywords.length === 0` | Check skipped (line 592: `&& specKeywords.length > 0`) | ACCEPTABLE -- if the spec folder name yields no 3+ char keywords (e.g., "ab"), there is nothing to match against |
| Short spec folder names (e.g., "01-ui") | "ui" is 2 chars, filtered out. No keywords = check skipped. | P1 -- see findings below |
| JSON data file bypass | `isStatelessMode` is false when `activeDataFile` is set (line 582) | BY DESIGN -- JSON files are pre-curated data, not live captures |
| Pre-loaded data bypass | `isStatelessMode` is false when `preloadedData` is set (line 582) | BY DESIGN -- same rationale |

---

## Input Normalizer Analysis

**File:** `scripts/utils/input-normalizer.ts`

### Validation Coverage

| Check | Lines | Type |
|-------|-------|------|
| Top-level type check (non-null object) | 294 | Structural |
| `specFolder` presence (when no CLI arg and no MCP fields) | 298-302 | Required field |
| `triggerPhrases` is array | 304-305 | Type |
| `keyDecisions` is array | 308-309 | Type |
| `filesModified` is array | 312-313 | Type |
| `importanceTier` enum validation | 316-318 | Enum allowlist |
| `FILES` array + per-element structure | 321-333 | Deep structural |
| `observations` is array | 336-339 | Type |

### Assessment: PASS with notes

- [x] Validates all top-level field types
- [x] Throws on validation failure (line 343)
- [x] Uses allowlist for `importanceTier` (line 316)
- [ ] Does NOT sanitize string content within validated fields (e.g., `specFolder` value is not path-traversal-checked)
- [ ] Does NOT limit array lengths (unbounded `FILES`, `observations`, etc.)

---

## Security Findings

### Adversarial Self-Check (Hunter/Skeptic/Referee)

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| Short spec folder names bypass alignment check | P1 | Valid concern but edge case -- most spec folders have descriptive names with 3+ char tokens | Confirmed -- the filter silently skips, creating an undocumented gap | P1 |
| Stale comment in simulation-factory.ts | P2 | Not a code defect, only documentation | Confirmed as P2 doc issue | P2 |
| No path traversal check on specFolder input | P1 | specFolder is used with `path.join` and `path.resolve`; Node path module normalizes `../`. detectSpecFolder adds its own validation. | Downgraded -- path.resolve handles traversal, and downstream validation exists | P2 |
| No array length limits in input-normalizer | P1 | Denial-of-service via huge arrays is only exploitable by callers who already have local code execution (this is a CLI tool, not a web API) | Downgraded -- local-only tool, no remote attack surface | P2 |
| Alignment check skipped when totalPaths=0 | P1 | Quality gate at line 1028-1034 catches empty/low-quality sessions with a separate abort threshold | Confirmed downgrade -- defense-in-depth from quality gate covers this path | P2 (with note) |
| Unicode homoglyph bypass in contamination filter | P2 | Input is AI-generated text, not user-controlled adversarial input | Confirmed as theoretical only | P2 |

---

### P0 (BLOCKER) -- None

No P0 security vulnerabilities identified.

---

### P1 (REQUIRED) -- 2 findings

#### P1-1: Alignment check silently skips for short spec folder names

**File:** `scripts/core/workflow.ts:585`
**Evidence:**
```typescript
const specKeywords = specFolderLeaf.split('-').filter((w: string) => w.length >= 3);
```
**Description:** When the spec folder leaf name yields zero keywords of 3+ characters (e.g., `01-ui`, `02-db`, `03-qa`), `specKeywords` is empty and the entire alignment check is silently bypassed (line 592: `specKeywords.length > 0`). There is no warning or log message when this happens.

**Exploitation scenario:** A session working on spec folder "04-auth" (keyword "auth" = 4 chars, PASSES) could accidentally save to "05-db" (keyword "db" = 2 chars, BYPASSED) with zero cross-spec validation.

**Impact:** Cross-spec contamination possible for short-named spec folders, silently.

**Suggested fix:** When `specKeywords.length === 0`, either (a) log a warning that alignment check was skipped due to short folder name, or (b) fall back to matching the full `specFolderLeaf` string as a single keyword regardless of length.

---

#### P1-2: Stale comment in simulation-factory.ts makes incorrect security claim

**File:** `scripts/lib/simulation-factory.ts:136`
**Evidence:**
```typescript
// This version uses crypto.randomBytes (CSPRNG); session-extractor uses Math.random() (pseudorandom).
```
**Description:** This comment claims `session-extractor.ts` uses `Math.random()` for session ID generation. This is factually incorrect -- `session-extractor.ts:126` uses `crypto.randomBytes(6)` (CSPRNG). The comment is a leftover from before the entropy fix was applied.

**Impact:** A developer reading this comment could (a) incorrectly believe session IDs are insecure, or (b) "fix" the already-correct code by replacing it with something different. Misleading security comments erode trust in the codebase.

**Suggested fix:** Update the comment to reflect that both files now use `crypto.randomBytes`, noting only the difference in output length (session-extractor: 12 hex chars / 48 bits; simulation-factory: configurable via `secureRandomString(9)` / base64url).

---

### P2 (SUGGESTION) -- 3 findings

#### P2-1: No path traversal guard on specFolder in input-normalizer

**File:** `scripts/utils/input-normalizer.ts:233`
**Evidence:** `normalized.SPEC_FOLDER = data.specFolder;` -- raw string assignment with no validation.
**Impact:** Low -- `path.resolve()` in downstream code normalizes `../` sequences, and `detectSpecFolder` adds validation. Defense-in-depth would benefit from an early check here.
**Suggested fix:** Add `if (data.specFolder.includes('..')) throw new Error('specFolder must not contain path traversal sequences');`

#### P2-2: Unicode homoglyphs could theoretically bypass contamination filter

**File:** `scripts/extractors/contamination-filter.ts:6-43`
**Impact:** Theoretical only -- the input is AI-generated text from the same session, not adversarial user input. If a future use case passes user-controlled text through this filter, the `\b` word boundaries would not match Unicode homoglyphs.
**Suggested fix:** No action needed now. Document the assumption that input is trusted AI text if this filter is ever repurposed.

#### P2-3: No array length bounds in input validation

**File:** `scripts/utils/input-normalizer.ts:321-333`
**Impact:** Local-only CLI tool with no remote attack surface. A malicious caller would need local code execution, at which point they can do anything anyway.
**Suggested fix:** Consider adding `if (data.FILES.length > 10000) errors.push('FILES array exceeds maximum size');` as a sanity check.

---

## Checklist Verification

| Check | Status | Evidence |
|-------|--------|----------|
| Session ID uses crypto.randomBytes (not Math.random) | PASS | `session-extractor.ts:126` |
| Session ID has >= 48 bits of entropy (6+ bytes) | PASS | `crypto.randomBytes(6)` = 6 bytes = 48 bits |
| Contamination filter has >= 25 unique deny patterns | PASS | 30 patterns counted (lines 6-43) |
| No regex patterns bypassed with encoding tricks | PASS (practical) | `\b` word boundaries + `gi` flags; input is not adversarial |
| Alignment check prevents cross-spec contamination (throws) | PASS | `workflow.ts:604` -- `throw new Error(alignMsg)` |
| Input normalizer sanitizes all untrusted input | PARTIAL | Type validation yes, string content sanitization no (P2-1) |
| No TOCTOU gaps in validation | PASS | Validation and use happen in same synchronous flow |
| Provenance markers cannot be spoofed by input data | PASS | Provenance tags are injected by code (`_source`, `_sessionId`), not derived from user input |

---

## Verdict

**PASS -- ACCEPTABLE (82/100)**

| Dimension | Score | Notes |
|-----------|-------|-------|
| Correctness | 26/30 | Alignment check has silent skip edge case (P1-1) |
| Security | 22/25 | No exploitable vulnerabilities; stale comment creates confusion risk (P1-2) |
| Patterns | 18/20 | Consistent use of CSPRNG, proper error throwing, good input validation structure |
| Maintainability | 10/15 | Stale cross-file comments reduce maintainability; otherwise well-documented |
| Performance | 6/10 | N/A for security audit; no performance concerns observed |

**Action required:** Fix P1-1 (alignment check gap for short names) and P1-2 (stale comment) before merge. P2 items are suggestions for defense-in-depth.

---

*Generated by Agent D02 (@review) -- Claude Opus 4.6*
*Files reviewed: 4 (session-extractor.ts, contamination-filter.ts, input-normalizer.ts, workflow.ts)*
*Tool calls: 8*

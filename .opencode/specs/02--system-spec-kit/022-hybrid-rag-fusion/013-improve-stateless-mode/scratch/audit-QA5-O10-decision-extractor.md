# Audit QA5-O10: decision-extractor.ts — Deep Code Quality Review

**File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts`
**LOC:** 403
**Reviewer:** Claude Opus 4.6 (@review agent)
**Date:** 2026-03-09
**Audit ID:** QA5-O10

---

## Score Breakdown

| Dimension        | Score  | Max | Notes                                                        |
| ---------------- | ------ | --- | ------------------------------------------------------------ |
| Correctness      | 21/30  | 30  | Confidence scoring has unreachable branch; anchor non-determinism |
| Security         | 24/25  | 25  | No injection risks; minor unbounded input concern             |
| Patterns         | 18/20  | 20  | Good project pattern compliance; minor inconsistency          |
| Maintainability  | 12/15  | 15  | Well-structured; some duplicated logic                        |
| Performance      | 9/10   | 10  | Linear scans appropriate for data size; no leaks              |
| **TOTAL**        | **84/100** | 100 | **ACCEPTABLE — PASS with notes**                         |

---

## Adversarial Self-Check (Hunter/Skeptic/Referee)

| # | Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---|---------|----------------|-------------------|-----------------|----------------|
| 1 | Confidence `OPTIONS.length > 1` unreachable in manual path (line 168) | P1 | OPTIONS is always length 1 in manual path; dead code, not wrong output | Confirmed — always evaluates to 50 or 65, never 70; dead branch misleads maintainers | P1 |
| 2 | Anchor ID non-deterministic due to `Date.now()` in hash (anchor-generator.ts:94) | P1 | By design — anchors are per-session, not cross-session stable | Confirmed — same input produces different anchors across runs; breaks idempotency for downstream consumers expecting deterministic IDs | P1 |
| 3 | `parseInt` without clamping on confidence regex match (line 262) | P1 | Regex `\d+` only matches digits, so NaN is impossible; but values like 999 or 0 pass through unclamped | Confirmed — parsed confidence can exceed 100 or be 0, violating implicit 0-100 contract | P1 |
| 4 | `collectedData` accessed before null check on line 114 vs 116 | P1 | Optional chaining `?.` on line 114 prevents crash; but logic order is misleading | Downgraded — no crash occurs due to `?.`; code smell only | P2 |
| 5 | MCP path skips `validateAnchorUniqueness` for initial empty string anchors (line 343) | P1 | Anchors are added after the `.map()` loop (lines 362-383); initial empty string is overwritten | Confirmed — but empty string anchor exists briefly in the decision object before overwrite; if any intermediate consumer reads it, they get `""` | P1 |
| 6 | Regex `extractSentenceAroundCue` fails on text with no sentence-ending punctuation | P2 | Falls back to `text.length` (line 56); returns full remaining text truncated to 200 chars | Confirmed acceptable — graceful degradation | P2 |
| 7 | `validateDataStructure` may mutate boolean flags set by extractor | P1 | `validateDataStructure` overwrites `HAS_*` flags based on array content; this is its purpose — it synchronizes flags | Dropped — this is the intended contract of `validateDataStructure` | Dropped |

---

## P0 — BLOCKERS

None found.

---

## P1 — REQUIRED

### P1-01: Confidence score from regex is unclamped (line 262)

**File:** `decision-extractor.ts:262`
**Evidence:**
```typescript
const CONFIDENCE: number = confidenceMatch ? parseInt(confidenceMatch[1], 10) : baseConfidence;
```

**Impact:** When narrative contains `confidence: 150%` or `confidence: 0%`, the parsed value passes through without clamping to [0, 100]. Downstream consumers (template rendering, importance classification at lines 374-376) assume confidence is in the 0-100 range. A value of 150 would classify as "high" importance, which is semantically correct but violates the implicit percentage contract. A value of 0 classifies as "low" but is never expected from the base confidence logic (which floors at 50).

**Fix:** Add `Math.max(0, Math.min(100, ...))` around the parsed value.

---

### P1-02: Unreachable confidence branch in manual decision path (line 168)

**File:** `decision-extractor.ts:168`
**Evidence:**
```typescript
CONFIDENCE: OPTIONS.length > 1 ? 70 : (rationale !== title ? 65 : 50),
```

**Impact:** In the manual decision processing path (lines 128-181), `OPTIONS` is always constructed as a single-element array (lines 143-150). The condition `OPTIONS.length > 1` is therefore always `false`. The confidence value can only be 65 (when rationale differs from title) or 50 (when they match). The `70` branch is dead code. This misleads maintainers into thinking three confidence tiers are possible for manual decisions.

**Fix:** Remove the unreachable branch or document why it exists as a forward-looking placeholder. If multi-option manual decisions are intended in the future, add a comment.

---

### P1-03: Anchor IDs are non-deterministic (anchor-generator.ts:94)

**File:** `anchor-generator.ts:94` (called from `decision-extractor.ts:152, 365-368`)
**Evidence:**
```typescript
const hash: string = generateShortHash(`${sectionTitle}|${additionalContext}|${Date.now()}`);
```

**Impact:** `Date.now()` in the hash input means the same decision title and spec number will produce a different anchor ID on every invocation. This breaks idempotency: re-running the extractor on identical input generates different anchor IDs. Any downstream system that uses anchor IDs for cross-referencing, deduplication, or linking (e.g., memory search, template anchors) cannot rely on stable IDs across runs.

**Fix:** Remove `Date.now()` from the hash input, or replace with a deterministic salt derived from the input data (e.g., spec folder + decision index).

---

### P1-04: MCP-path decisions have empty anchor IDs until post-processing (lines 322-383)

**File:** `decision-extractor.ts:343, 362-383`
**Evidence:**
```typescript
// Line 343: Initial construction
DECISION_ANCHOR_ID: '',
DECISION_IMPORTANCE: ''

// Lines 362-383: Post-processing adds real anchors
const decisionsWithAnchors: DecisionRecord[] = decisions.map((decision) => { ... });
```

**Impact:** The MCP observation path creates `DecisionRecord` objects with `DECISION_ANCHOR_ID: ''` and `DECISION_IMPORTANCE: ''` (lines 343-344), then overwrites them in a second pass (lines 362-383). Between these two points, the records are structurally incomplete. If `generateDecisionTree` (called at line 347) or `validateDataStructure` (called at line 386) inspects or propagates the empty anchor, downstream consumers may receive empty strings. Currently this is safe because neither function uses the anchor field, but it creates a fragile coupling.

**Fix:** Move anchor generation into the primary `.map()` loop (lines 205-351) so records are complete on first construction, matching the manual decision path's approach.

---

### P1-05: Duplicate confidence-scoring logic across two code paths

**File:** `decision-extractor.ts:168` and `decision-extractor.ts:261`
**Evidence:**
```typescript
// Manual path (line 168):
CONFIDENCE: OPTIONS.length > 1 ? 70 : (rationale !== title ? 65 : 50),

// MCP path (line 261):
const baseConfidence = OPTIONS.length > 1 ? 70 : RATIONALE !== narrative.substring(0, 200) ? 65 : 50;
```

**Impact:** Two independent implementations of the same confidence heuristic. The manual path compares `rationale !== title` while the MCP path compares `RATIONALE !== narrative.substring(0, 200)`. These are semantically different comparisons that happen to use the same threshold values. If the confidence logic needs to change, a maintainer must update both locations and understand the subtle difference in comparison semantics. This is a DRY violation that increases the risk of drift.

**Fix:** Extract a shared `calculateBaseConfidence(optionCount, rationale, fallbackText)` function.

---

## P2 — SUGGESTIONS

### P2-01: `collectedData` accessed before null guard (line 114 vs 116)

**File:** `decision-extractor.ts:114-116`
**Evidence:**
```typescript
const manualDecisions = collectedData?._manualDecisions || [];  // line 114 — uses ?.
if (!collectedData) {                                            // line 116 — null check
```

**Impact:** No crash risk due to optional chaining, but the code reads as "use the data, then check if it exists." This inverted order confuses readers about the intended null-handling flow.

**Fix:** Move line 114 after the null check on line 116, or combine into the null check block.

---

### P2-02: `extractSentenceAroundCue` sentence boundary detection is naive (lines 49-56)

**File:** `decision-extractor.ts:49-56`
**Evidence:**
```typescript
const sentenceStart = Math.max(before.lastIndexOf('.'), before.lastIndexOf('!'), before.lastIndexOf('?')) + 1;
```

**Impact:** This breaks on abbreviations (e.g., "Dr. Smith decided...") and URLs (e.g., "see https://example.com/path. We decided..."). The `Math.max` of -1 values results in 0, which is correct as a fallback, but abbreviation periods will incorrectly truncate the sentence start. Given the 200-char cap and the use case (extracting decision cues from AI session narratives, not arbitrary prose), this is acceptable in practice.

**Fix:** No immediate fix needed. If false positives are observed in production, consider a more robust sentence tokenizer.

---

### P2-03: `DECISION_CUE_REGEX` does not use word boundaries (line 36)

**File:** `decision-extractor.ts:36`
**Evidence:**
```typescript
const DECISION_CUE_REGEX = /(decided|chose|will use|approach is|going with|rejected|we'll|selected|prefer|adopt)/i;
```

**Impact:** The pattern `adopt` would match inside "adopted" or "Adobe Photoshop" (though the latter is unlikely). Multi-word cues like "will use" and "approach is" provide implicit boundaries, but single-word cues like "adopt" and "prefer" could match substrings. In practice, false positives are filtered by the requirement for contextual decision-like content, so the impact is low.

**Fix:** Add `\b` word boundaries: `/\b(decided|chose|will use|...)\b/i`.

---

### P2-04: Option label regex fallback chain may produce unexpected labels (lines 212-216)

**File:** `decision-extractor.ts:212-216`
**Evidence:**
```typescript
const labelMatch = opt.match(/Option\s+([A-Za-z0-9]+):?/)
  || opt.match(/Alternative\s+([A-Za-z0-9]+):?/)
  || opt.match(/^(\d+)\./);
```

**Impact:** The third fallback `^(\d+)\.` matches any leading number, so a fact like "3.5 GHz processor was chosen" would extract label "3". This is unlikely given that facts are pre-filtered for "Option" or "Alternative" keywords (line 210), making this fallback mostly unreachable. When it does trigger, the label is wrapped in `Option ${label}` (line 216), producing "Option 3" which is a reasonable degradation.

**Fix:** No immediate fix needed.

---

### P2-05: Pros/Cons/Caveats/Followup regex patterns require trailing space after colon (lines 265-295)

**File:** `decision-extractor.ts:265-306`
**Evidence:**
```typescript
return !!lower.match(/\bpro:\s/) || !!lower.match(/\badvantage:\s/);
```

**Impact:** A fact like `"Pro:fast"` (no space after colon) would not match. The `\s` requires at least one whitespace character after the colon. This is a minor strictness that could miss tightly formatted facts. Given that facts typically come from structured MCP observations with proper spacing, the practical impact is low.

**Fix:** Change `:\s` to `:\s*` to also match zero-space cases, or document the spacing requirement.

---

### P2-06: Evidence extraction prefers `obs.files` over fact-based evidence without merging (lines 308-320)

**File:** `decision-extractor.ts:308-320`
**Evidence:**
```typescript
const EVIDENCE = observationFiles
  ? observationFiles.map(...)
  : facts.filter(...).map(...);
```

**Impact:** When an observation has both `files` and fact-based evidence markers (e.g., `"evidence: see commit abc123"`), only the file list is used. The fact-based evidence is silently discarded. This is likely intentional (files are more reliable evidence), but it means evidence from narrative facts is lost when files are present.

**Fix:** Consider merging both sources: `[...fileEvidence, ...factEvidence]`.

---

### P2-07: `buildLexicalDecisionObservations` generates current timestamp, not source timestamp (line 91)

**File:** `decision-extractor.ts:91`
**Evidence:**
```typescript
timestamp: new Date().toISOString(),
```

**Impact:** Lexical decisions synthesized from user prompts or observations use the extraction time rather than the source observation's timestamp. This means the decision record's timestamp reflects "when it was extracted" not "when the decision was made." For MCP observations with timestamps (line 326), the source timestamp is preserved. This inconsistency only affects the lexical fallback path.

**Fix:** Pass through the source observation's timestamp when available.

---

### P2-08: The `extractDecisions_alias` export is unnecessary (line 402)

**File:** `decision-extractor.ts:402`
**Evidence:**
```typescript
extractDecisions as extractDecisions_alias
```

**Impact:** This alias adds no value — it exports the same function under a second name. No consumer in the codebase imports `extractDecisions_alias` (confirmed via grep). This is dead export surface area.

**Fix:** Remove the alias unless there is a documented backward-compatibility need.

---

## Positive Highlights

1. **Robust null/undefined handling throughout.** The `?.` operator, `|| []` fallbacks, and type guards (`typeof manualDec === 'string'`) prevent crashes on malformed input. The function gracefully handles `null` input by falling back to simulation data (line 116-118).

2. **Clean separation of manual vs. MCP vs. lexical paths.** The three extraction strategies are clearly delineated with comments and logical branching. The lexical fallback (lines 197-204) only activates when no explicit decision observations exist, preventing double-counting.

3. **Proper anchor uniqueness enforcement.** Both the manual path (lines 152-154) and MCP path (lines 371-372) use `validateAnchorUniqueness` with a running `usedAnchorIds` array, preventing intra-run collisions.

4. **Type-safe fact coercion.** Line 208 handles the runtime reality that facts may arrive as objects `{ text?: string }` instead of plain strings, coercing them without throwing.

5. **Good use of canonical types.** The module imports types from `session-types.ts` rather than defining its own, avoiding type duplication across extractors.

6. **Decision tree generation is properly gated.** Line 347 only generates a tree when options exist, preventing empty visual artifacts.

---

## Files Reviewed

| File | Path | Role |
|------|------|------|
| Primary | `scripts/extractors/decision-extractor.ts` | Target of audit |
| Dependency | `scripts/lib/anchor-generator.ts` | Anchor ID generation + uniqueness |
| Dependency | `scripts/utils/data-validator.ts` | `validateDataStructure` flag sync |
| Dependency | `scripts/lib/simulation-factory.ts` | Simulation fallback data |
| Dependency | `scripts/types/session-types.ts` | Canonical type definitions |
| Dependency | `scripts/lib/decision-tree-generator.ts` | ASCII tree rendering |
| Dependency | `scripts/utils/message-utils.ts` | `formatTimestamp` |
| Dependency | `scripts/core/config.ts` | Configuration loader |
| Consumer | `scripts/core/workflow.ts` | Calls `extractDecisions` |

---

## Recommendation

**PASS with notes.** Score 84/100 (ACCEPTABLE band). No P0 blockers. Five P1 findings require attention in a future pass — the most impactful are P1-03 (non-deterministic anchors) and P1-01 (unclamped confidence). None of these cause data loss or crashes in current usage, but they create correctness risks as the system scales.

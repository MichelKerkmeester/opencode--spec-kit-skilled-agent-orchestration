# Iteration 1: Decision Parsing Root Causes (Q1 + Q2)

## Focus
- Q1: Where does the "Decision:" prefix get doubled?
- Q2: Where does "--" in decision text cause truncation?

## Findings

### Finding 1: ROOT CAUSE of Double "Decision:" Prefix (Q1) -- CONFIRMED

**Grade A Evidence** -- two code locations verified in source.

The double prefix arises from the interaction between two pipeline stages:

**Stage 1 -- Template Rendering** (`context_template.md:478`):
```
### Decision {{INDEX}}: {{TITLE}}
```
The template hardcodes the literal text `Decision ` before the `{{TITLE}}` placeholder.

**Stage 2 -- Title Extraction** (`decision-extractor.ts:213-214`):
```typescript
const titleMatch = decisionText.match(/^(?:Decision\s*\d+:\s*)?(.+?)(?:\s*[-\u2013\u2014]\s*(.+))?$/i);
const title: string = titleMatch?.[1]?.trim() || `Decision ${index + 1}`;
```

The regex `^(?:Decision\s*\d+:\s*)?` only strips prefixes of the form `Decision 1:`, `Decision2:`, etc. (requires a digit after "Decision"). When input is `"Decision: Return false..."` (no digit), the `\d+` requires one or more digits, so the non-capturing group fails to match. The regex falls through to capture group 1 `(.+?)`, which captures the ENTIRE input string including the "Decision:" prefix.

**Result**: `TITLE` = `"Decision: Return false..."`, and the template renders:
```
### Decision 1: Decision: Return false...
```

**Root Cause**: The regex requires `\d+` (one or more digits) after "Decision", but the JSON input uses format `"Decision: X"` (no digit). The optional group `(?:Decision\s*\d+:\s*)?` silently fails to match, preserving the prefix in the captured title.

**Fix**: Change the regex to also strip `Decision:` without a digit:
```typescript
/^(?:Decision\s*(?:\d+\s*)?:\s*)?(.+?)(?:\s*[-\u2013\u2014]\s*(.+))?$/i
```
This makes `\d+` optional within the optional group, allowing `Decision:` (no number) to be stripped.

---

### Finding 2: ROOT CAUSE of "--" Truncation (Q2) -- CONFIRMED

**Grade A Evidence** -- same regex on line 213.

The regex on `decision-extractor.ts:213`:
```typescript
/^(?:Decision\s*\d+:\s*)?(.+?)(?:\s*[-\u2013\u2014]\s*(.+))?$/i
```

The character class `[-\u2013\u2014]` matches:
- `-` (ASCII hyphen)
- `\u2013` (en dash)
- `\u2014` (em dash)

The second capture group `(?:\s*[-\u2013\u2014]\s*(.+))?` is designed to split "title -- rationale" patterns. However, because it uses a SINGLE hyphen `-` in the character class, it matches ANY hyphen in the text, not just double-dash `--` separators.

**Example**: Input `"Used incremental tsc --build for MCP server rebuild"`
- First capture group `(.+?)` is non-greedy, so it captures `"Used incremental tsc "` (stops at the first `-` preceded by optional whitespace)
- The `[-\u2013\u2014]` matches the first `-` of `--build`
- Second capture group `(.+)` captures `"-build for MCP server rebuild..."`

**Result**:
- `title` = `"Used incremental tsc"` (truncated, missing `--build`)
- `fallbackRationale` = `"-build for MCP server rebuild..."` (starts with leftover `-build`)

These values flow into (line 274):
```typescript
const rationale: string = rationaleFromInput || fallbackRationale;
```

So the CONTEXT field in the rendered output shows `-build for MCP server rebuild...` instead of the full decision text.

**Root Cause**: The regex uses a single-character hyphen match `[-]` when it should require a separator pattern like ` -- ` (space-dash-dash-space) or use em/en dashes exclusively. CLI flags containing `--` are incorrectly parsed as title/rationale separators.

**Fix**: Replace the single-character match with a proper separator pattern:
```typescript
/^(?:Decision\s*(?:\d+\s*)?:\s*)?(.+?)(?:\s+(?:--|[\u2013\u2014])\s+(.+))?$/i
```
This requires:
1. Whitespace before the separator (`\s+`)
2. Either double-dash `--` or a single em/en dash character
3. Whitespace after the separator (`\s+`)

This prevents `--build` (no preceding space) from being treated as a separator, while still splitting on intentional ` -- ` separators.

---

### Finding 3: Input Normalizer Also Has Title Extraction (Supplementary)

**Grade B Evidence** -- `input-normalizer.ts:216-219`

The input normalizer (`transformKeyDecision` function, line 188-248) has its OWN title extraction at line 216:
```typescript
const titleMatch = decisionText.match(/^([^.!?]+[.!?]?)/);
const title: string = titleMatch
  ? titleMatch[1].substring(0, 80).trim()
  : decisionText.substring(0, 80).trim();
```

This extracts the first sentence as the title (splits on `.`, `!`, `?`). It does NOT strip "Decision:" prefixes, but it also does NOT add them. The title extracted here flows into the observation's `title` field (line 240: `title: title`), which is used for topic extraction but is NOT the same `TITLE` that appears in the rendered template.

The critical path is: `keyDecisions` array -> `input-normalizer.ts` transforms to observations -> `_manualDecisions` stored on normalized data -> `decision-extractor.ts` processes `_manualDecisions` -> regex on line 213 extracts TITLE -> template renders `Decision {{INDEX}}: {{TITLE}}`.

The double-prefix and truncation both happen at the decision-extractor stage (line 213), not in the input normalizer.

---

### Finding 4: Confidence Is NOT Hardcoded at 50% (Q5 Partial Answer)

**Grade A Evidence** -- `input-normalizer.ts:224-226`

The confidence in the input normalizer (`transformKeyDecision`) is computed as:
```typescript
const confidence: number = chosenApproach
  ? (hasMultipleAlternativesMentioned ? 0.70 : 0.65)
  : 0.50;
```

This produces 0.50 ONLY when no `chosenApproach` was detected (no "chose/selected/decided on/using" keywords found in the text). For typical keyDecisions strings, the confidence defaults to 0.50 because the choice-detection regex (line 196) fails to find keywords like "chose" in structured decision text.

However, in the decision-extractor.ts (line 295-307), a more sophisticated `buildDecisionConfidence()` function is called that considers: `hasAlternatives`, `hasExplicitChoice`, `hasExplicitRationale`, `hasTradeoffs`, `hasEvidence`, and `explicitConfidence`. This produces the ACTUAL confidence score used in the rendered template. The 0.50 from the normalizer only feeds into the `_manualDecision.confidence` field, which is checked by `buildDecisionConfidence` as an `explicitConfidence` override -- but only if the JSON input includes a structured object with a `confidence` field, which plain strings do not.

So the effective confidence for plain string decisions defaults to what `buildDecisionConfidence` computes based on signal analysis, NOT a hardcoded 0.50. Q5 needs deeper investigation of `buildDecisionConfidence` to determine what score it actually produces for typical inputs.

---

## Summary

| Question | Status | Root Cause Location | Confidence |
|----------|--------|---------------------|------------|
| Q1: Double "Decision:" prefix | ANSWERED | `decision-extractor.ts:213` -- regex requires `\d+` after "Decision", fails to strip `Decision:` without digit | High |
| Q2: "--" truncation | ANSWERED | `decision-extractor.ts:213` -- single-hyphen character class `[-]` matches CLI flags like `--build` | High |
| Q5: Confidence (partial) | PARTIALLY ANSWERED | `input-normalizer.ts:224-226` sets 0.50 for no-choice strings, but `buildDecisionConfidence()` in extractor may override | Medium |

## Key File References

- `decision-extractor.ts:213` -- The single regex causing both Q1 and Q2 bugs
- `decision-extractor.ts:214` -- Title assignment from regex match
- `decision-extractor.ts:215` -- Rationale fallback from regex match
- `decision-extractor.ts:274` -- Rationale selection logic
- `input-normalizer.ts:188-248` -- `transformKeyDecision()` function
- `input-normalizer.ts:475-514` -- `keyDecisions` array processing
- `context_template.md:478` -- Template line that prepends "Decision {{INDEX}}:"
- `template-renderer.ts:84-160` -- Mustache rendering engine (no issues found here)

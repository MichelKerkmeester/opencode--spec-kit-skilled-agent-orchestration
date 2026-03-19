<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/implementation-summary.md -->
<!-- anchor:implementation-summary:start -->

# Implementation Summary: Research Remediation — Wave 1

<!-- anchor:overview:start -->
## 1. OVERVIEW

**Date**: 2026-03-19
**Status**: Complete (40/41 items, 1 deferred)

The research remediation Wave 1 plan called for 41 items across 5 sequential Codex agents. Upon systematic review, **37 items were already implemented** in prior sessions. This session completed the remaining 3 items and fixed 2 pre-existing test failures.
<!-- anchor:overview:end -->

<!-- anchor:changes:start -->
## 2. CHANGES MADE (This Session)

### P1-07: Relevance Keywords Over-Broad Fix
**File**: `scripts/utils/input-normalizer.ts`
- Added `RELEVANCE_KEYWORD_STOPWORDS` set (~130 generic terms like "session", "memory", "system", "file")
- Modified `buildSpecRelevanceKeywords()` to:
  - Only keep multi-word phrases as keywords (specific enough)
  - Filter single tokens against stopword list
- **Impact**: Prevents false-positive relevance matches when filtering prompts/exchanges by spec folder

### P1-11: Template Injection Fix
**File**: `scripts/renderers/template-renderer.ts`
- Added `escapeMustacheValue()` function that escapes `{{` → `\{\{` and `}}` → `\}\}`
- Applied to all variable replacement outputs (string, array, object values)
- **Impact**: Prevents values containing `{{VAR}}` patterns from being re-expanded during recursive section rendering

### P1-10: Mustache Comment Syntax
**File**: `scripts/renderers/template-renderer.ts`
- Added `{{! comment }}` syntax stripping before variable replacement
- **Impact**: Templates can now include Mustache comments that are removed during rendering

### Test Fixes
**File**: `scripts/tests/runtime-memory-inputs.vitest.ts`
- Fixed 2 tests where mock prompts didn't contain spec-relevant content, causing `toContain` assertions on `undefined`
- Mock prompts now reference the spec folder path (`010-perfect-session-capturing`) so the relevance filter passes them through
<!-- anchor:changes:end -->

<!-- anchor:key-decisions:start -->
## 3. KEY DECISIONS

1. **No Codex agents needed**: 37/41 items already done; remaining 3 items were small enough to implement directly
2. **P1-09 deferred**: File-format detection heuristic improvement has unclear scope — the dual-format support (JSON + capture) already works correctly
3. **Stopword list approach for P1-07**: Used a curated stopword set rather than a minimum-term-frequency approach, since spec folder paths don't have enough tokens for statistical methods
4. **Escape over reject for P1-11**: Escaping `{{`/`}}` in values (rather than rejecting them) preserves data while preventing injection
<!-- anchor:key-decisions:end -->

<!-- anchor:verification:start -->
## 4. VERIFICATION

- [x] `npm run build` — TypeScript compilation passes
- [x] `npx vitest run` — 407/407 tests pass across 37 test files
- [x] No `Math.random` in session-extractor.ts
- [x] `mtime` is fallback, not primary sort (history timestamps used first)
- [x] folder-detector.ts has Priority 2.7 git-status signal
- [x] decision-extractor.ts has dedup guard (line 364-365)
- [x] workflow.ts passes hadContamination to both scorers (lines 2044, 2104)
- [x] memory-indexer.ts uses weighted embedding input via buildWeightedDocumentText()
<!-- anchor:verification:end -->

<!-- anchor:implementation-summary:end -->

# Review Iteration 037
## Dimension: D1 Correctness
## Focus: query-intent-classifier.ts correctness, keyword coverage, scoring logic
## New Findings
### [P1] F035 - Broad semantic question patterns can override common structural lookup queries
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:37-50,62-68,117-147`
- Evidence: `SEMANTIC_PATTERNS` treats very broad question openers like `/what\s+(?:is|are|does)/i` and `/(?:how|where)\s+(?:is|are|do|does|to)/i` as semantic, and patterns are worth 2x keywords. That misroutes common structural questions phrased as natural-language lookups. For example, `where is Foo defined` gets a semantic pattern hit from `where is` but no structural hit because the dictionary contains `definition` rather than `defined`; `what does Foo import` gets `what does` but no structural hit because only `imports` is listed. Both are structural graph/navigation queries, but the scorer pushes them toward `semantic`.
- Fix: Narrow semantic patterns so question-openers only count when paired with semantic nouns (`pattern`, `example`, `usage`, `how to`, etc.), and add structural verb/navigation variants like `define/defined`, `import/export/call`, and similar inflections before applying the 2x pattern bonus.

### [P2] F036 - Multi-word keyword matching is substring-based and produces false positives
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:72-89`
- Evidence: `countKeywordHits()` normalizes the query with `tokens.join(' ')` and then checks `lowerQuery.includes(kw)` for phrase keywords. That is not token-boundary-safe. A query like `call chaining` (or `call-chaining`, after tokenization) becomes `call chaining`, which contains the substring `call chain`, so the structural phrase `call chain` is counted even though the exact phrase never appears as a token sequence.
- Fix: Replace substring matching with exact token n-gram matching, or use boundary-aware regexes over the normalized token stream.

### [P2] F037 - Confidence saturates at 0.95 from a single matched signal
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:129-157`
- Evidence: Confidence is derived only from the winning side's ratio: `0.6 + ratio * 0.35`, capped at `0.95`. For any one-sided query, `ratio === 1`, so a single token like `callers` or `find` yields `0.95` confidence immediately. That makes one weak cue indistinguishable from a query with several consistent signals.
- Fix: Make confidence depend on absolute evidence count as well as ratio, and cap single-hit classifications substantially lower unless multiple keywords/patterns agree.

### [P2] F038 - Structural keyword coverage is too exact-token-specific for common graph terms
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:20-35,76-80`
- Evidence: The structural dictionary includes forms like `imports`, `exports`, `callers`, `callees`, `dependencies`, `decorates`, and `type`, but omits common variants such as `import`, `export`, `caller`, `callee`, `dependency`, `decorator`, and `type alias`. Because token matching is exact, one-word structural queries such as `decorator`, `import`, or `caller` produce no structural hit and fall back to `hybrid`, even though they are direct structural/AST questions.
- Fix: Expand the structural dictionary with singular/plural and AST-oriented variants, or normalize inflections/aliases before lookup.

## Remediation Verification
(N/A - this is a new module)

## Iteration Summary
- New findings: 1x P1, 3x P2
- Verified fixes: 0
- Remaining active: 4

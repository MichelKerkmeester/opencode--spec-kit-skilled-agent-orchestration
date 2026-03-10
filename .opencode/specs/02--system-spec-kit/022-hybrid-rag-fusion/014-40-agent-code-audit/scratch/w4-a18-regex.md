● skill(sk-code--review)

● skill(sk-code--opencode)

● Todo added: Create audit plan

● Read .agents/skills/sk-code--review/references/quick_reference.md lines 1-220
  └ 151 lines read

● Read .agents/skills/sk-code--review/references/security_checklist.md lines 1-220
  └ 206 lines read

● Read .agents/skills/sk-code--review/references/code_quality_checklist.md lines 1-240
  └ 162 lines read

● Read .agents/skills/sk-code--opencode/references/shared/universal_patterns.md lines 1-220
  └ 220 lines read

● Read .agents/skills/sk-code--opencode/references/typescript/quality_standards.md lines 1-260
  └ 259 lines read

✗ Read ~/.copilot/session-state/9bd35054-3561-4fbf-8e61-a172ea31abb7/plan.md lines 1-120
  Path does not exist

● Run skill advisor
  $ python3 .opencode/scripts/skill_advisor.py "Audit these TypeScript files for regex correctness
  and ReDoS risks, focusing on every regex pattern, global flag mutation, anchoring, greediness,
  Unicode edge cases, and empty string matches" --threshold 0.8
  └ 2 lines...

● Todo started:

● Read .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts
  └ 87 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts
  └ 476 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ 627 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts
  └ 443 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts
  └ 185 lines read

● Grep "new RegExp|/[^\n]+/[a-z]*" in {extractors/contamination-filter.ts,extractors/decision-extrac
tor.ts,utils/input-normalizer.ts,extractors/file-extractor.ts,utils/slug-utils.ts}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Create session plan
  $ cat >
  '/Users/michelkerkmeester/.copilot/session-state/9bd35054-3561-4fbf-8e61-a172ea31abb7/plan.md'
   <<'EOF'
  # Regex audit plan
  1. Read the five requested TypeScript files and enumerate every regex....
  └ 5 lines...

● Todo started: produce-findings

● Validate suspected regex issues
  $ node <<'EOF'
  const tests = [
    {
      label: 'Of course boundary',
      regex: /\bOf course!\b/i,...
  └ 73 lines...

● Validate unicode slug edge case
  $ node <<'EOF'
  function toUnicodeSafeSlug(text) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')...
  └ 21 lines...

● Todo completed: read-files, produce-findings

I found 7 actionable correctness issues; I did not find catastrophic-backtracking ReDoS patterns or `.lastIndex` mutation hazards, and `file-extractor.ts` looked regex-safe.

### FINDING-01: Tool-scaffolding regexes miss dotted and hyphenated tool names
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:37-39`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Phrases like `I'll use the multi_tool_use.parallel tool` and `I'll use the web-fetch tool` survive contamination removal, while only simple `\w` tool names such as `read_bash` are removed.
- **Expected Behavior:** Tool-scaffolding phrases should be removed for real tool identifiers, including names containing `_`, `.`, and `-`.
- **Root Cause:** The patterns use `\w+`, which excludes `.` and `-`.
- **Suggested Fix:** Broaden the tool-name token, e.g. `[\w.-]+` or `[\p{L}\p{N}_.-]+` with the `u` flag.

### FINDING-02: Filler-phrase patterns cannot match common sentence-final forms
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:33-35`
- **Severity:** LOW
- **Category:** BUG
- **Current Behavior:** `Of course!` is never removed, and `Sure!` / `Absolutely!` only match when followed by whitespace, so sentence-final filler remains in the text.
- **Expected Behavior:** These interjections should match both before whitespace and at end-of-string.
- **Root Cause:** `\b` after `!` is impossible (`!` is non-word), and `\s` requires a following whitespace character.
- **Suggested Fix:** Replace the suffix with end-aware lookahead, e.g. `/\bOf course!(?=\s|$)/i`, `/\bSure!(?=\s|$)/i`, `/\bAbsolutely!(?=\s|$)/i`.

### FINDING-03: Manual-decision title splitter breaks hyphenated names
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:151-153`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** A title like `Decision 1: Type-safe parser` is parsed as title=`Type` and rationale=`safe parser`.
- **Expected Behavior:** Hyphenated words should remain part of the title unless there is an actual spaced dash separator between title and rationale.
- **Root Cause:** The delimiter regex `\s*[-\u2013\u2014]\s*` allows zero surrounding spaces, so any hyphen can become a split point.
- **Suggested Fix:** Require surrounding whitespace for the separator (`\s+[-\u2013\u2014]\s+`) or split on a stricter title/rationale delimiter after prefix removal.

### FINDING-04: Decision-cue fallback matches substrings inside larger words
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:36`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Lexical fallback can treat `preference` and `Adoption` as decision cues because `prefer` and `adopt` match inside larger words.
- **Expected Behavior:** Only whole decision cue words/phrases should trigger decision extraction.
- **Root Cause:** `DECISION_CUE_REGEX` has no word boundaries around its alternation terms.
- **Suggested Fix:** Add boundaries around the cue set, e.g. `/\b(?:decided|chose|will use|approach is|going with|rejected|we'll|selected|prefer|adopt)\b/i`, with phrase-specific tuning if needed.

### FINDING-05: Sentence-capture regexes truncate dotted identifiers and versions
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:323-329; .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:139-140`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Extracted values are cut at any `.` or `,`, so inputs like `implemented node.js for tooling` become `node`, and `using RFC 1.2 parser` becomes `RFC 1`.
- **Expected Behavior:** Dots and commas inside identifiers, versions, and names should be preserved until a real sentence boundary is reached.
- **Root Cause:** The capture groups use negated character classes (`([^\.\n]+)` and `([^.,]+)`) that treat every dot/comma as a terminator.
- **Suggested Fix:** Capture lazily up to sentence-ending punctuation followed by whitespace/end, e.g. `(.+?)(?=[.!?](?:\s|$)|$)`, or parse delimiters structurally instead of banning dots/commas.

### FINDING-06: Contamination-name patterns miss common relative paths and non-word tool names
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts:32-41`
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `isContaminatedMemoryName()` misses names such as `Tool: multi_tool_use.parallel`, `Tool: web-fetch`, `Read src/app.ts`, and `Edit folder/file.ts`.
- **Expected Behavior:** Generated tool-title scaffolding and path-only labels should be rejected consistently before slug selection.
- **Root Cause:** `\w+` excludes `.`/`-`, and the `Read|Edit|Write` patterns only accept `file`, `/`, or `.` immediately after the verb, not normal relative paths.
- **Suggested Fix:** Broaden the patterns, e.g. `^Tool:\s+[\w.-]+$`, `^Executed\s+[\w.-]+$`, and `^(?:Read|Edit|Write)\s+\S+$`; also widen the pure-path matcher if relative paths should count as contamination.

### FINDING-07: Unicode mark stripping is incomplete for slug normalization
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts:44-51`
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Some combining marks outside `U+0300-U+036F` survive normalization and are later converted into separator hyphens, e.g. `a\u1AB0b` becomes `a-b` instead of `ab`.
- **Expected Behavior:** If the intent is accent/mark stripping before ASCII slugging, all combining marks should be removed consistently.
- **Root Cause:** `/[\u0300-\u036f]/g` only covers one combining-mark block.
- **Suggested Fix:** Use Unicode property escapes, e.g. `.replace(/\p{M}+/gu, '')`, before the ASCII-only replacement pass.

### SUMMARY - Total: 7, Critical: 0, High: 0, Medium: 5, Low: 2


Total usage est:        1 Premium request
API time spent:         5m 3s
Total session time:     5m 17s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 450.7k in, 18.9k out, 399.0k cached (Est. 1 Premium request)

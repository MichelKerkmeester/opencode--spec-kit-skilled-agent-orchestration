# Iteration 025: Trigger matching and proactive surfacing

## Findings

### [P1] Common-word trigger phrases are accepted unchanged and can auto-surface irrelevant memories
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts`

**Issue** The matcher accepts any trigger phrase with length `>= 3`, caches it verbatim, and then checks every cached phrase against every prompt. That means frontmatter phrases such as `save`, `update`, `error`, `context`, or `memory` are treated as valid trigger keys even though they are common enough to appear in ordinary prompts. In the proactive surfacing path this can pull unrelated memories into the surfaced set just because the user used routine vocabulary.

**Evidence** `trigger-matcher.ts:101-109` sets `MIN_PHRASE_LENGTH` to `3`. `trigger-matcher.ts:233-247` loads every 3+ character phrase into the trigger cache without any stop-word or semantic filtering, and `trigger-matcher.ts:466-484` tests all of them against the normalized prompt. The auto-surface hook calls this matcher directly on generic tool context in `hooks/memory-surface.ts:188-223`, so false positives are not limited to explicit `memory_match_triggers` calls. A denylist already exists for broad/noisy phrases in `lib/search/feedback-denylist.ts:5-6,60-82`, but this matcher never consults it.

**Fix** Reuse the denylist or an equivalent semantic filter during trigger ingestion and cache load, not just learned-feedback flows. At minimum reject single-token broad terms from the denylist; preferably require either multi-token phrases or a rarity/quality threshold before a phrase becomes matchable.

### [P1] Frontmatter extraction/storage errors are silently dropped, making memories disappear from trigger surfacing
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts`

**Issue** If a persisted `trigger_phrases` payload is malformed JSON or not an array, `loadTriggerCache()` just skips that row and emits no warning, counter, or repair hint. Any upstream frontmatter extraction or storage bug therefore turns into a silent retrieval miss: the memory simply vanishes from trigger matching and proactive surfacing.

**Evidence** `trigger-matcher.ts:221-230` catches `JSON.parse()` failures and immediately `continue`s, and does the same for non-array payloads. There is already a shared tolerant parser in `lib/search/vector-index-types.ts:178-190`, but this code path bypasses it. Upstream trigger extraction accepts multiple frontmatter layouts in `lib/parsing/memory-parser.ts:464-528`, so malformed or shape-shifted metadata is a realistic failure mode rather than a purely theoretical one.

**Fix** Replace the raw `JSON.parse()` branch with the shared `parse_trigger_phrases()` helper, and log invalid rows with at least `id` and `file_path`. Also expose an `invalidTriggerRows` counter in cache stats and surface a diagnostic hint from `memory_match_triggers` when rows were skipped, so broken frontmatter is observable instead of silent.

### [P2] Unicode handling is only Latin-1-aware, and phrase lookup uses a different normalization path than the matcher
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts`

**Issue** The word-boundary regex only treats `[A-Za-z0-9\\u00C0-\\u00FF]` as in-word characters, so letters outside Latin-1 are treated as delimiters. That creates false positives inside mixed-script words and weakens the claim that matching is Unicode-safe. Separately, the helper lookup path lowercases with `toLowerCase()` only, while the main matcher caches phrases via NFC normalization plus lowercasing, so canonically equivalent phrases can disagree depending on the API path.

**Evidence** The boundary regex is defined in `trigger-matcher.ts:160-165` and duplicated in `trigger-matcher.ts:308-312`. Reproducing that pattern in `node` matched the trigger `api` inside both `ЖapiЖ` and `πapiσ`, which are larger mixed-script tokens, showing these characters are being treated as boundaries instead of letters. The cache normalizes with `normalizeUnicode()` in `trigger-matcher.ts:238-241`, but `getMemoriesByPhrase()` uses only `phrase.toLowerCase()` in `trigger-matcher.ts:547-555`. Reproducing that helper behavior showed `"café"` and decomposed `"café"` compare unequal under the current lookup path even though `normalizeUnicode()` would collapse them.

**Fix** Replace the custom Latin-1 boundary class with Unicode-aware tokenization or property escapes such as `[\p{L}\p{N}]` under the `u` flag, and route every phrase lookup through the same `normalizeUnicode()` function used for cached phrases. Add regression tests for composed/decomposed accents and mixed-script boundaries, not just ASCII case folding.

### [P2] Proactive surfacing still does a full-cache regex scan on every dispatch, which will degrade sharply as trigger sets grow
**File** `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts`

**Issue** Match time grows linearly with the total number of cached trigger phrases because every request iterates every cached regex and sorts the full match set before applying `limit`. That is especially expensive in proactive surfacing, where the hook invokes trigger matching on normal tool dispatches rather than only on explicit memory retrieval calls.

**Evidence** `trigger-matcher.ts:463-496` walks the full cache, runs `matchPhraseWithBoundary()` for each entry, and sorts all matches before slicing to `limit`. `hooks/memory-surface.ts:188-223` calls `matchTriggerPhrases(contextHint, 5)` in the auto-surface path, so this O(n) scan sits on a hot path. The matcher itself already warns above `30ms` in `trigger-matcher.ts:106-108,128-131`, but the current long-prompt test only asserts completion within `5s` in `tests/trigger-matcher.vitest.ts:153-163`, which is far looser than the runtime target.

**Fix** Build a candidate index keyed by normalized token, first token, or n-gram so the matcher only evaluates phrases that could plausibly occur in the prompt. Keep a bounded top-k structure instead of sorting the full result set, and add scale tests with thousands of trigger phrases using the same latency budgets the production code already logs against.

## Summary

The highest-risk problems are noisy broad phrases getting admitted into the cache and malformed trigger metadata being silently skipped, because both directly distort or suppress proactive surfacing. Unicode handling and normalization are also inconsistent enough to produce edge-case false positives or misses, and the current matcher architecture will get increasingly expensive as the trigger corpus grows because it remains a full-cache regex sweep on a hot path.

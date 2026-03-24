# Iteration 001 - Path Fragment Contamination Tracing (Q1)

## Scope
- Question: Where path fragment tokens enter the trigger phrase and key topic pipelines, what filters exist, and which tokens leak through to the final memory file.
- Status: Answered for the current JSON-mode memory generation pipeline, with an additional note on a secondary helper path in `memory-frontmatter.ts`.

## Executive Answer
Path fragments enter in two places:
1. The active workflow path injects the leaf `specFolderName` into both trigger extraction and key topic extraction, then re-injects folder-derived phrases after filtering. This path contaminates final memory frontmatter directly. Evidence: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1025-1128`, `.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts:26-58`.
2. The helper path in `.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:50-163` tokenizes the full spec folder path, injects those tokens twice into trigger derivation, and performs no path-fragment filtering. This is a real contamination source, but in the current code trace it is not called by `workflow.ts`, so it is a latent or alternate path rather than the active JSON-mode writer path. Evidence: `.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:50-163`; only `deriveMemoryDescription()` is called from workflow at `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1031-1034`.

## Contamination Map
| Entry point | Filter | Escape path | Impact |
| --- | --- | --- | --- |
| `buildSpecTokens(specFolder)` splits the full spec path on `/`, strips numeric prefixes at segment starts, then splits on `-`/`_` and keeps tokens length >= 3. `.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:50-56` | None in `deriveMemoryTriggerPhrases()`. The helper only dedupes and removes legacy generic phrases. `.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:147-163` | Full-path parent tokens like `system`, `spec`, `kit`, `hybrid`, `rag`, `fusion`, `epic`, `memory`, `generation`, `quality` can survive unchanged if this helper is used. | Raw folder vocabulary can appear as frontmatter trigger phrases without any path-specific suppression. |
| `deriveMemoryTriggerPhrases()` injects spec tokens once as joined text into `extractTriggerPhrases(source)` and again as raw appended tokens. `.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:140-154` | `extractTriggerPhrases()` applies generic semantic scoring, but no path-aware filter is added afterward in this helper. `.opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts:21-27`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:219-257` | Normalized multi-word fragments from the joined source and raw unigram folder tokens from the appended array both survive. | Double injection amplifies folder-derived candidates and increases their ranking odds. |
| `deriveMemoryTriggerPhrases()` short-circuits when `existing` trigger phrases are present and not legacy generic. `.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:131-138` | Only normalization and length >= 3 are applied. | Any pre-contaminated manual or upstream `existing` phrases bypass all extraction-time filtering. | Contaminated triggers can be preserved verbatim. |
| Active workflow adds `folderNameForTriggers = specFolderName.replace(...).replace(/-/g, ' ')` to trigger extraction source. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1056-1061` | `filterTriggerPhrases()` removes phrases with `/`, `\\`, or a leading `NNN ` prefix, removes all-short phrases unless allow-listed, and removes substring shingles. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:122-158` | Normalized leaf-folder phrases like `memory generation quality` and two-word or three-word fragments without separators or leading digits survive because the filter has no folder lexicon and no normalized-path detector. | Folder-name phrases contaminate `trigger_phrases` in the saved memory file. |
| Active workflow prepends the whole normalized folder phrase after filtering if not already present. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1101-1106` | No additional filter after `unshift()`. | Even if extraction or filtering did not keep the full folder phrase, `memory generation quality` is re-added directly. | Guarantees at least one folder-derived trigger phrase in many saves. |
| Active workflow loops over folder tokens and appends any token not in `FOLDER_STOPWORDS`. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1107-1125` | Exact-match stopword list only. No scoring threshold, no context check. | For the current spec leaf `013-memory-generation-quality`, `generation` leaks because it is not in `FOLDER_STOPWORDS`; `memory` and `quality` are blocked here, but only at this stage. | Single-word folder residue enters final `trigger_phrases`. |
| `ensureMinTriggerPhrases()` backfills from leaf folder tokens when fewer than 2 triggers remain. `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:96-115` | No stopword list, no path-fragment filter. | If upstream filtering leaves 0-1 phrases, blocked tokens such as `memory` and `quality` can re-enter from the leaf folder. | Fallback path can reintroduce contamination after the main stopword pass. |
| `extractKeyTopics()` pushes normalized `specFolderName` into `weightedSegments` before decisions and summary. `.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts:31-36` | Topic mode uses aggressive stopwords and bigram scoring via `SemanticSignalExtractor.extractTopicTerms(...)`. `.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts:55-58`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-286,405-412` | Any folder-derived unigram or bigram that survives aggressive stopwords can become `key_topics`. | Folder semantics bias topic output even when the session content is thin. |
| `ensureMinSemanticTopics()` falls back to the first folder or file token if topic extraction returns nothing. `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:118-136` | No path-fragment-specific filter. | Leaf tokens such as `memory`, `generation`, or `quality` can become the sole final topic. | Guarantees at least one folder/file-derived topic in low-signal sessions. |
| Shared tokenizer keeps alphanumeric tokens with digits attached, dropping only pure numbers. `.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:115-130` | Generic English/artifact stopword filters only. `.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:142-149`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:172-175` | Mixed fragments such as `kit 022` are not produced as a single token by tokenization, but n-gram scoring can still combine nearby surviving tokens into number-adjacent phrases when separators were normalized out upstream. | Normalized path residues can score as semantic phrases rather than obvious paths. |

## Trigger Pipeline Detail
### A. Active JSON-mode writer path
1. `workflow.ts` computes `folderNameForTriggers` from the leaf spec folder name only, not the full path. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1056-1058`
2. That normalized phrase is appended to `triggerSourceParts`, then passed into `extractTriggerPhrases()`. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1058-1061`
3. `extractTriggerPhrases()` delegates through the wrapper into `SemanticSignalExtractor.extractTriggerPhrases()`. `.opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts:21-27`
4. The semantic extractor tokenizes text, applies balanced stopwords, then ranks problem/technical/decision/action/compound candidates plus scored n-grams up to depth 2. `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:219-257,341-345,376-384`
5. The shared tokenizer splits on whitespace and punctuation, keeps tokens length >= 3, drops pure numbers, and preserves mixed alphanumeric tokens. `.opencode/skill/system-spec-kit/shared/trigger-extractor.ts:115-130`
6. `filterTriggerPhrases()` only removes literal separators, leading-number phrases, all-short phrases, and substring shingles. It does not detect normalized folder phrases like `memory generation quality`, `system spec kit`, or two-word fragments like `spec kit`. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:122-158`
7. After filtering, the workflow re-adds the full folder phrase and selected folder tokens, then may backfill with `ensureMinTriggerPhrases()`. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1101-1128`, `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:96-115`

### B. Secondary helper path
1. `buildSpecTokens()` tokenizes the full spec folder path, not just the leaf folder. `.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:50-56`
2. `deriveMemoryTriggerPhrases()` adds those tokens into the extraction source as a joined phrase and again as raw fallback tokens. `.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:140-154`
3. No path-fragment filter runs here. The only suppression is legacy generic trigger removal. `.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:156-163`
4. This helper is not referenced by `workflow.ts` in the active JSON save path; only `deriveMemoryDescription()` is referenced there. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1031-1034`

## Filters: What They Catch vs Miss
### `filterTriggerPhrases()` in workflow
- Catches:
  - Any phrase containing `/` or `\\`. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:126`
  - Any phrase starting with `NNN `. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:128`
  - Single-word phrases shorter than 3 unless allow-listed (`rag`, `bm25`, `mcp`, `adr`, `jwt`, `api`, `cli`, `llm`, `ai`). `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:120,135-136`
  - Multi-word phrases where every word is shorter than 3 and none are allow-listed. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:138-141`
  - Shorter phrases that are substrings of longer retained phrases. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:145-156`
- Misses:
  - Normalized folder phrases with no slash, backslash, or leading number, such as `memory generation quality`, `system spec kit`, `hybrid rag fusion`.
  - Two-word fragments with a trailing number, such as `kit 022`, because the regex only catches leading numbers.
  - Any contamination re-injected after filtering by `unshift(folderNameForTriggers)` or later folder-token fallback.

### `PATH_FRAGMENT_PATTERNS` in post-save review
- Catches:
  - Very short single words of length 1-4. `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:185`
  - Common stopwords, directory names, and generic file stems. `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:186-188`
  - Multi-word path fragments with a trailing 2-3 digit number. `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:190`
  - Leading-number phrases such as `022-hybrid`. `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:191`
  - Any phrase containing `/` or `\\`. `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:192`
- Misses:
  - Three-word normalized folder phrases with no numbers, such as `system spec kit` or `memory generation quality`.
  - Two-word normalized fragments with no separators, such as `spec kit`.
  - Longer single words that are still folder residue, such as `generation` or `quality`.
  - Anything it finds is detected after write, not prevented before write. `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:195-198`

## Which Tokens Leak Through
### Active trigger path for the current leaf folder `013-memory-generation-quality`
- Definite final-trigger leaks:
  - `memory generation quality`
    - Reason: re-added directly after filtering if absent. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1101-1106`
  - `generation`
    - Reason: leaf folder token not present in `FOLDER_STOPWORDS`, so it is appended directly. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1107-1125`
- Conditional fallback leaks:
  - `memory`
  - `quality`
    - Reason: if fewer than 2 triggers remain after the main pass, `ensureMinTriggerPhrases()` backfills raw leaf tokens without consulting `FOLDER_STOPWORDS`. `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:96-115`

### Active key-topic path for the current leaf folder
- Likely surviving topic candidates:
  - `memory generation`
  - `generation quality`
  - `memory generation quality`
  - `generation`
  - `quality`
    - Reason: the folder phrase is added to `weightedSegments`, then passed into aggressive-stopword bigram extraction; `generation` is not listed among aggressive stopwords in the inspected file. `.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts:31-36,55-58`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:260-286`
- Fallback leak:
  - First surviving folder token from `memory`, `generation`, `quality`
    - Reason: `ensureMinSemanticTopics()` returns the first folder/file token if extraction returns nothing. `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts:118-136`

### Secondary helper path with the full spec path
- If `deriveMemoryTriggerPhrases()` is used elsewhere, these full-path parent tokens can leak directly:
  - `system`, `spec`, `kit`, `hybrid`, `rag`, `fusion`, `epic`, `memory`, `generation`, `quality`
    - Reason: `buildSpecTokens()` keeps all length >= 3 tokens across every path segment and appends them raw to the final combined trigger list. `.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:50-56,151-163`
- If semantic extraction over the joined token string is used, these normalized multi-word fragments can also leak:
  - `system spec`
  - `spec kit`
  - `system spec kit`
  - `hybrid rag`
  - `rag fusion`
  - `hybrid rag fusion`
    - Reason: joined folder tokens feed n-gram extraction with no downstream path-specific filter. `.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:140-149`, `.opencode/skill/system-spec-kit/scripts/lib/semantic-signal-extractor.ts:219-257`

## Additional Findings Beyond Known Context
1. The prompt path for `trigger-extractor.ts` was slightly off; the active wrapper lives at `.opencode/skill/system-spec-kit/scripts/lib/trigger-extractor.ts:21-27`.
2. `deriveMemoryTriggerPhrases()` is not part of the currently traced JSON-mode `workflow.ts` save path, so contamination risk there is latent or alternate, not the active writer path.
3. The active workflow re-adds the full folder phrase after filtering, so contamination is not just a filter miss but also an explicit post-filter reinjection.
4. `FOLDER_STOPWORDS` blocks many known folder tokens, but it is exact-match only and misses `generation` and `epic` for the current naming pattern.
5. `ensureMinTriggerPhrases()` can reintroduce tokens that `FOLDER_STOPWORDS` just tried to suppress.
6. `ensureMinSemanticTopics()` has the same fallback pattern for topics, with no path-aware screening.
7. The shared tokenizer/filter stack is generic; it has no concept of "folder-derived" contamination, only language and artifact stopwords.
8. The post-save review detector is reactive and still misses normalized three-word folder phrases without numbers.

## newInfoRatio
- Method: counted 12 distinct findings captured in this iteration; 8 were materially new relative to the five bullets in `Known Context`.
- Calculation: `8 / 12 = 0.67`
- Result: `newInfoRatio = 0.67`

## Recommended Next Focus
Iteration 2 should trace Q2 end-to-end: why JSON mode produces thin semantic summaries, which JSON fields are available before summarization, and where enrichment can be injected without changing captured-session behavior.

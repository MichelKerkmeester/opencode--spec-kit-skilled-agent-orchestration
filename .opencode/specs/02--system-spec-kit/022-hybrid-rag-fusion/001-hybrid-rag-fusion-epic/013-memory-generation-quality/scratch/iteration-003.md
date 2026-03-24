# Architecture Decision Record: Memory Generation Quality Fix Architecture

- Iteration: 3 of 3
- Question: What is the optimal fix architecture for path-fragment contamination and thin JSON-mode memory content?
- Status: Recommended
- New Info Ratio: 0.82

## Context

The current pipeline injects spec-folder tokens in multiple places, so no single existing filter currently protects every output:

- `buildSpecTokens()` tokenizes the full spec path and feeds those tokens into `deriveMemoryTriggerPhrases()` both as extractor source text and as direct fallback phrases. This means distributed contamination starts in the shared frontmatter helper, not only in the workflow path. [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:50-57`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:140-154`]
- `filterTriggerPhrases()` only removes phrases with explicit separators or leading numeric prefixes plus short-token/subphrase cleanup. It does not catch normalized folder fragments such as `system spec kit`, and it is only applied on the workflow trigger-phrase path. [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:122-158`]
- The workflow also re-injects folder-name text after filtering via `folderNameForTriggers` and `preExtractedTriggers.unshift(...)`, which can undo a centralized-only cleanup unless that reinsertion is removed or sanitized. [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1056-1058`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1097-1105`]
- `extractKeyTopics()` boosts `specFolderName` before semantic extraction, so `key_topics` has a separate contamination path that bypasses `filterTriggerPhrases()` entirely. [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/topic-extractor.ts:23-36`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1025-1026`]
- `generateImplementationSummary()` derives `task`, `solution`, `outcomes`, and summary trigger phrases from `messages`, but JSON mode slow-path synthesizes only one default `userPrompt` and one default `recentContext` from `sessionSummary`, leaving the summarizer starved when the payload contains only scalar fields. [SOURCE: `.opencode/skill/system-spec-kit/scripts/lib/semantic-summarizer.ts:468-612`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:620-689`]
- `reviewPostSaveQuality()` detects path fragments only after the file is written, so it is an audit mechanism today, not prevention. [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:184-198`] [SOURCE: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:208-245`]

## Existing Test Coverage

Current tests prove some pieces already work, but coverage is fragmented:

- `trigger-phrase-filter.vitest.ts` covers slash/backslash removal, leading numeric prefixes, short tokens, substring dedupe, and idempotence. It does not cover normalized multi-word folder fragments like `system spec kit`, post-filter reinsertion, or `key_topics` bypass. [SOURCE: `.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:13-127`]
- `memory-pipeline-regressions.vitest.ts` covers title truncation, outcome trimming, and generic trigger extraction, but not spec-folder contamination or JSON-mode enrichment. [SOURCE: `.opencode/skill/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts:29-58`]
- `semantic-signal-golden.vitest.ts` checks semantic alignment across workflow topics, session topics, and summary trigger phrases, but only on healthy semantic input. It does not assert exclusion of spec-path tokens. [SOURCE: `.opencode/skill/system-spec-kit/scripts/tests/semantic-signal-golden.vitest.ts:164-195`]
- `post-save-review.vitest.ts` only covers a passing review and penalty cap, not prevention promotion, auto-repair, or fail-gate behavior. [SOURCE: `.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:19-68`]
- `runtime-memory-inputs.vitest.ts` verifies snake_case array fields survive normalization, but it does not cover scalar-only JSON enrichment for `userPrompts`, `recentContext`, or observation synthesis. [SOURCE: `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:93-156`]

## Approaches Evaluated

### 1. Centralized Filter Only

Harden `filterTriggerPhrases()` into the single choke point.

Pros:
- Lowest conceptual surface area if every trigger phrase flows through one sanitizer.
- Existing unit-test scaffold already exists in `trigger-phrase-filter.vitest.ts`.
- Good place for defense rules such as normalized folder fragment detection, stopword blocks, and subset pruning.

Cons:
- Does not cover `key_topics` because `extractKeyTopics()` bypasses this filter entirely.
- Does not cover `deriveMemoryTriggerPhrases()` unless that helper is changed to call the central filter.
- Still leaks if workflow keeps re-adding `folderNameForTriggers` after filtering.
- Central regexes will become increasingly brittle if they are the only protection against source contamination.

Regression risks to guard:
- False positives on legitimate multi-word technical phrases such as `system prompt`, `spec validation`, or `workflow core`.
- Removal of allow-listed short technical tokens like `rag`, `api`, `mcp`, `llm`.
- Order instability if dedupe/filter stages change relative phrase priority.
- Silent misses in non-workflow paths, especially frontmatter-only fallback generation.

Verdict:
- Necessary, but insufficient as the primary architecture.

### 2. Distributed Source-Stripping Only

Fix each producer independently:

- Stop `buildSpecTokens()` from converting path fragments into semantic trigger candidates.
- Stop `extractKeyTopics()` from weighting `specFolderName`.
- Stop workflow trigger-source assembly from appending folder-name text and re-inserting folder-derived phrases.
- Optionally sanitize `deriveMemoryTriggerPhrases()` existing/fallback outputs before returning.

Pros:
- Solves contamination at the root where bad tokens originate.
- Keeps semantic outputs cleaner before any downstream ranking or dedupe.
- Reduces dependence on regex heuristics for semantically normalized path fragments.

Cons:
- Requires changes in multiple files and call paths.
- Easier to miss one producer and assume the issue is solved.
- Offers no final guard if future contributors add a new contamination source later.

Regression risks to guard:
- Over-correcting and losing meaningful spec-derived concepts when they are genuinely semantic, not structural.
- Breaking fallback behavior when summary/title/description are sparse and source stripping becomes too aggressive.
- Divergence between workflow trigger phrases and memory-frontmatter helper output.

Verdict:
- Better than centralized-only for correctness, but too fragile without a downstream safety net.

### 3. Combined Architecture

Clean at source and keep one centralized safety net.

Recommended shape:
- Remove or drastically narrow source-side injection of folder/path tokens.
- Introduce a shared semantic sanitizer that both workflow trigger generation and memory-frontmatter helpers call before return.
- Keep post-save review as an audit layer, but promote its path-fragment matcher into a pre-write validation/sanitization step.

Pros:
- Defense in depth: upstream prevention plus downstream guardrail.
- Covers both trigger phrases and other semantic outputs when wired intentionally.
- Safer against future regressions than any single-point strategy.
- Lets the central filter stay smaller because source pollution is reduced first.

Cons:
- More code-touch points than centralized-only.
- Requires careful ordering so sanitization does not fight later enrichment or fallback logic.

Regression risks to guard:
- Duplicate normalization logic if the shared sanitizer is copied rather than reused.
- Inconsistent rules between `trigger_phrases` and `key_topics`.
- Reintroduction bugs if any workflow step appends folder tokens after sanitization.

Verdict:
- Best overall architecture.

### 4. Post-Save Promotion

Promote path-fragment detection from review-only to prevention.

Options:
- Auto-repair before write: sanitize derived fields in memory before rendering.
- Quality gate before final save: reject the write or retry derivation when structural contamination is detected.
- Keep current post-save review for audit visibility after persistence.

Assessment:
- Pre-write prevention is worth promoting.
- Post-write auto-repair should not be the primary mechanism because it mutates an already-rendered artifact and can hide non-deterministic generation bugs.
- Best fit is a pre-write validation/sanitization pass using the same structural rules, with post-save review retained as a verification layer.

Regression risks to guard:
- Infinite retry loops if the pre-write gate re-runs generation without changing inputs.
- User confusion if writes start failing without actionable diagnostics.
- Drift between pre-write and post-save rule sets.

Verdict:
- Promote detection to prevention, but as a pre-write gate/sanitizer, not as an opaque post-write repair step.

### 5. JSON Enrichment

Enrich scalar JSON mode before summarization rather than teaching the summarizer to work around sparse upstream input.

Best insertion points:
- Slow-path scalar normalization where `sessionSummary`, `keyDecisions`, `technicalContext`, `nextSteps`, default `userPrompts`, and default `recentContext` are synthesized. [SOURCE: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:620-689`]
- Fast-path branch that currently backfills arrays only when some structured arrays already exist; it should mirror the same enrichment rules when `userPrompts` or `recentContext` are absent or too thin. [SOURCE: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:466-568`]
- `KNOWN_RAW_INPUT_FIELDS` only needs expansion if new top-level JSON aliases are introduced. If enrichment reuses existing scalar fields, schema changes are unnecessary. [SOURCE: `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:705-720`]

Recommended enrichment examples:
- Build one synthetic `userPrompt` from the user-intent phrasing in `sessionSummary`.
- Add derived `recentContext.learning` entries from `keyDecisions`, `technicalContext`, and `nextSteps`.
- Preserve manual scalar content as observations so `generateImplementationSummary()` sees richer intent/plan/result text without changing its API.

Regression risks to guard:
- Duplicating user meaning across observations, prompts, and recent context.
- Inflating low-signal summaries into repetitive boilerplate.
- Breaking existing JSON-mode callers that already provide rich arrays.

Verdict:
- Enrich in `input-normalizer.ts`, not in `semantic-summarizer.ts`, so downstream components keep one coherent normalized contract.

## Decision

Adopt a combined architecture:

1. Remove source-side structural contamination.
2. Add one shared central sanitizer as a final semantic safety net.
3. Promote path-fragment review rules into a pre-write validation/sanitization step.
4. Enrich scalar JSON payloads in `input-normalizer.ts` before they reach `generateImplementationSummary()`.

This is the only option that covers:

- Workflow trigger phrases
- Memory frontmatter fallback trigger phrases
- `key_topics`
- JSON-mode thin-content regressions
- Future regressions from newly added producers

## Implementation Sequence

1. Stop source pollution.
   - Remove `specFolderName` weighting from `extractKeyTopics()` or gate it behind a semantic-safe derivation.
   - Remove `folderNameForTriggers` insertion and post-filter reinsertion in the workflow path.
   - Narrow `buildSpecTokens()` so it no longer emits raw structural path fragments as semantic trigger material.

2. Create a shared semantic-output sanitizer.
   - Reuse one helper for trigger phrase sanitation in workflow and `deriveMemoryTriggerPhrases()`.
   - Extend it to structural phrase detection beyond slash prefixes, including normalized folder fragments.

3. Promote review rules into pre-write prevention.
   - Reuse `PATH_FRAGMENT_PATTERNS` or a shared derivative before file render/write.
   - Keep post-save review for diagnostics and audit scoring.

4. Enrich JSON normalization.
   - Improve slow-path synthesis from scalar fields.
   - Mirror that enrichment on the fast-path when structured arrays are missing.

5. Tighten regression coverage.

## Regression Test Plan

Add or extend tests for:

- `trigger-phrase-filter.vitest.ts`
  - Reject normalized folder fragments such as `system spec kit`, `hybrid rag fusion`, and `kit 022`.
  - Assert no folder phrase is reintroduced after filtering.
  - Preserve legitimate domain phrases like `system prompt` and `spec validation`.

- New or expanded memory-frontmatter tests
  - `deriveMemoryTriggerPhrases()` should not emit raw spec tokens when summary/title are sparse.
  - Existing non-legacy trigger phrases should still be sanitized before return.

- `semantic-signal-golden.vitest.ts`
  - Assert `key_topics` alignment remains semantic after removing spec-folder weighting.
  - Assert spec-path fragments never dominate workflow topics or summary trigger phrases.

- `runtime-memory-inputs.vitest.ts`
  - Scalar-only JSON payload should synthesize richer `userPrompts`, `recentContext`, and observations from `sessionSummary`, `keyDecisions`, `technicalContext`, and `nextSteps`.
  - Existing rich-array payloads should remain unchanged.

- `post-save-review.vitest.ts` or a new pre-write quality-gate suite
  - Pre-write validation blocks or sanitizes path fragments before persistence.
  - Post-save review still reports structural issues when forced malformed content is injected.

- End-to-end memory pipeline regression
  - Given a spec folder like `02--system-spec-kit/.../013-memory-generation-quality`, generated `trigger_phrases`, `key_topics`, title, and summary content should emphasize session semantics, not folder structure.

## Ruled-Out Architecture

- Centralized-only: too narrow because `key_topics` and frontmatter helpers bypass the current choke point.
- Distributed-only: too brittle because future producers can reintroduce contamination and no final guard catches it.
- Post-save auto-repair as the primary fix: too reactive and hides determinism problems.


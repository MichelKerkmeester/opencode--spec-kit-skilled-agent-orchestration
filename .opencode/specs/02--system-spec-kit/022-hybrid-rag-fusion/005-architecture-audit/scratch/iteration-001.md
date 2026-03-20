# Iteration 001 — Merged Findings

**Focus**: scripts/core/, scripts/extractors/, scripts/memory/, scripts/utils/
**Agents**: copilot-C1 (core analysis), copilot-C2 (extractors standards), codex-A1 (memory/utils bugs)
**New findings**: 37

---

## P1 (HIGH) Findings

### [BUG] workflow.ts: Tree-thinning from truncated preview (C1)
- **File(s)**: scripts/core/workflow.ts:654, 1756-1760
- **Type**: BUG
- **Description**: Tree-thinning decisions made from `readFileSync(...).slice(0, 500)`, so token counts computed from truncated preview. Large files misclassified as "small".

### [BUG] workflow.ts: NaN in decision confidence (C1)
- **File(s)**: scripts/core/workflow.ts:1910-1922
- **Type**: BUG
- **Description**: Decision confidence fields rounded without finite-number guard. `undefined`/`null`/`NaN` upstream produces `NaN` percentages in rendered templates.

### [BUG] workflow.ts: Warning banners break frontmatter (C1)
- **File(s)**: scripts/core/workflow.ts:2075-2098, 2172-2177
- **Type**: BUG
- **Description**: Template contract validated before warning banners prepended, but banners inserted *before* YAML frontmatter. Saved memories no longer start with frontmatter at byte 0.

### [BUG] tree-thinning.ts: Root-level memory/ paths misclassified (C1)
- **File(s)**: scripts/core/tree-thinning.ts:83-86
- **Type**: BUG
- **Description**: `isMemoryFile('memory/foo.md')` returns false because it only checks for `'/memory/'`. Root-level `memory/...` paths misclassified as non-memory files.

### [BUG] quality-scorer.ts: Title extraction misses bare/single-quoted titles (C1)
- **File(s)**: scripts/core/quality-scorer.ts:128-129
- **Type**: BUG
- **Description**: `extractFrontmatterTitle()` only matches `title: "..."`. Bare titles and single-quoted titles ignored, incorrectly triggering `generic_title` penalties.

### [BUG] quality-scorer.ts: HTML detection false negatives (C1)
- **File(s)**: scripts/core/quality-scorer.ts:252-257
- **Type**: BUG
- **Description**: Leaked HTML detection subtracts tags found in fenced code blocks from total. A `<div>` inside code cancels real leaked `<div>` outside code.

### [BUG] config.ts: Float values pass integer validation (C1)
- **File(s)**: scripts/core/config.ts:125-148, 156-170
- **Type**: BUG
- **Description**: "Positive integer" fields only check `Number.isFinite(...)` plus range. Values like `1.5` for `maxConversationMessages` pass and leak into count/slice logic.

### [BUG] backfill-frontmatter.ts: Path prefix bypass (A1)
- **File(s)**: scripts/memory/backfill-frontmatter.ts:174
- **Type**: BUG
- **Description**: Project-boundary validation uses `startsWith(PROJECT_ROOT)` prefix-based check. Sibling paths like `/repo-evil/...` pass. Also silently drops `readdirSync` failures at lines 242, 306, 346.

### [BUG] reindex-embeddings.ts: process.exit bypasses finally (A1)
- **File(s)**: scripts/memory/reindex-embeddings.ts:67, 118
- **Type**: BUG
- **Description**: `process.exit(1)` inside inner catch bypasses outer finally, so `closeIndexingRuntime()` never runs on warmup failure. Also trusts `JSON.parse(result.content[0].text)` at line 82 without validation.

### [BUG] generate-context.ts: Bare --session-id falls through (A1)
- **File(s)**: scripts/memory/generate-context.ts:392, 447
- **Type**: BUG
- **Description**: Bare `--session-id` (without value) not rejected; falls through into positional parsing, turning it into a fake data file. Also exits directly on SIGTERM/SIGINT at 153/158, cutting off in-flight recovery writes.

### [BUG] validate-memory-quality.ts: Windows line endings break parsing (A1)
- **File(s)**: scripts/memory/validate-memory-quality.ts:180, 185, 208, 290
- **Type**: BUG
- **Description**: Frontmatter/YAML extraction only matches `\n`, not `\r\n`. Windows-formatted memories skip parsing entirely. V12 can also silently disable itself.

### [BUG] slug-utils.ts: ENOENT returns "unique" for missing directories (A1)
- **File(s)**: scripts/utils/slug-utils.ts:210, 205, 224, 242
- **Type**: BUG
- **Description**: ENOENT returns filename as "unique" even when directory doesn't exist. Uniqueness reservation is racy — placeholder deleted immediately, another writer can reuse same name.

### [BUG] historical-memory-remediation.ts: Quarantine file loss (A1)
- **File(s)**: scripts/memory/historical-memory-remediation.ts:240, 703
- **Type**: BUG
- **Description**: `discoverMemoryFiles()` uses `readdirSync()` with no error handling — one unreadable directory aborts entire audit. Quarantine deletes existing target before rename; EXDEV or permission failure loses the file.

### [BUG] input-normalizer.ts: Empty array fast-path bug (A1)
- **File(s)**: scripts/utils/input-normalizer.ts:424, 647
- **Type**: BUG
- **Description**: Fast-path triggers on truthy empty arrays, so `{ user_prompts: [], sessionSummary: "..." }` skips slow-path synthesis. Validation misses camelCase arrays entirely.

### [STANDARDS] Extractors: Silent error suppression pattern (C2)
- **File(s)**: claude-code-capture.ts, codex-cli-capture.ts, copilot-cli-capture.ts, gemini-cli-capture.ts, spec-folder-extractor.ts
- **Type**: STANDARDS
- **Description**: Capture adapters return `[]`, `null`, or `{}`-equivalents without surfacing why capture/parsing failed. Conflicts with typed-catch + meaningful-context standard.

### [STANDARDS] Extractors: No common failure contract (C2)
- **File(s)**: All 18 extractors
- **Type**: STANDARDS
- **Description**: No common failure/fallback contract. Some synthesize data, some return null, some return empty payloads, some degrade to `emptyResult()`. Consumers must know each extractor's private contract.

---

## P2 (MEDIUM) Findings

### [LOGIC] workflow.ts: 1,100+ line god function (C1)
- **File(s)**: scripts/core/workflow.ts:1283-2388
- **Type**: LOGIC
- **Description**: `runWorkflow()` does loading, alignment, contamination, enrichment, extraction, thinning, rendering, scoring, writing, indexing, and retry. Biggest SRP/testability problem.

### [LOGIC] workflow.ts: withWorkflowRunLock no timeout (C1)
- **File(s)**: scripts/core/workflow.ts:943-959
- **Type**: LOGIC
- **Description**: Global in-process queue with no timeout/cancellation. One hung run blocks every later run indefinitely.

### [LOGIC] workflow.ts: Swallowed alignment failures (C1)
- **File(s)**: scripts/core/workflow.ts:381-396
- **Type**: LOGIC
- **Description**: `resolveAlignmentTargets()` swallows spec-context failures and falls back to keyword-only matching, weakening contamination gate silently.

### [LOGIC] workflow.ts: listSpecFolderKeyFiles swallows failures (C1)
- **File(s)**: scripts/core/workflow.ts:660-690
- **Type**: LOGIC
- **Description**: Full recursive walk wrapped in one try/catch, returns `[]` on any failure. One unreadable directory erases all KEY_FILES context.

### [LOGIC] memory-indexer.ts: Stale trigger phrase set (C1)
- **File(s)**: scripts/core/memory-indexer.ts:118-123
- **Type**: LOGIC
- **Description**: Manual trigger phrase merging never updates `existingLower` after pushing, so duplicates can be appended multiple times.

### [LOGIC] memory-indexer.ts: recencyFactor is constant (C1)
- **File(s)**: scripts/core/memory-indexer.ts:143-144
- **Type**: LOGIC
- **Description**: `recencyFactor` is a constant, not actual recency calculation. Formula looks dynamic but gives every memory the same "recency" contribution.

### [LOGIC] memory-indexer.ts: Non-atomic metadata update (C1)
- **File(s)**: scripts/core/memory-indexer.ts:196-214
- **Type**: LOGIC
- **Description**: Metadata status updates are read/parse/write with warning-only failure and no atomic write. Indexing can succeed while `metadata.json` stays stale.

### [LOGIC] subfolder-utils.ts: Sync/async duplication (C1)
- **File(s)**: scripts/core/subfolder-utils.ts:39-127, 130-223
- **Type**: LOGIC
- **Description**: Sync and async implementations are near-copy-paste duplicates. Root dedupe, traversal, ambiguity handling should be shared.

### [LOGIC] subfolder-utils.ts: No early exit on unique match (C1)
- **File(s)**: scripts/core/subfolder-utils.ts:60-97, 158-194
- **Type**: LOGIC
- **Description**: Traversal always scans whole tree even when unique match found. No early exit, no caching, hardcoded `SEARCH_MAX_DEPTH`.

### [LOGIC] file-writer.ts: O(n) duplicate detection per save (C1)
- **File(s)**: scripts/core/file-writer.ts:83-108
- **Type**: LOGIC
- **Description**: Duplicate detection re-reads and re-hashes every existing `.md` file per outgoing file. Latency scales with total historical content.

### [LOGIC] config.ts: Silent fallback on config corruption (C1)
- **File(s)**: scripts/core/config.ts:249-274
- **Type**: LOGIC
- **Description**: Invalid `config.jsonc` logs warning and silently falls back to defaults. Config corruption indistinguishable from defaulted run.

### [BUG] rank-memories.ts: Missing Array.isArray check (A1)
- **File(s)**: scripts/memory/rank-memories.ts:386, 184
- **Type**: BUG
- **Description**: `results` trusted without `Array.isArray`. Object input crashes at `.map()`. Limit parsing makes `0` impossible and lets negatives through.

### [BUG] data-validator.ts: Mixed array coercion (A1)
- **File(s)**: scripts/utils/data-validator.ts:63, 85
- **Type**: BUG
- **Description**: `ensureArrayOfObjects()` only inspects first element. Mixed arrays coerced incorrectly. Stale `HAS_*` booleans never cleared.

### [BUG] file-helpers.ts: Windows path misdetection (A1)
- **File(s)**: scripts/utils/file-helpers.ts:83
- **Type**: BUG
- **Description**: Windows absolute paths misdetected on POSIX due to `path.posix` normalization. `C:/tmp/x` treated as non-absolute.

### [BUG] path-utils.ts: Cross-OS path security issue (A1)
- **File(s)**: scripts/utils/path-utils.ts:36, 55
- **Type**: BUG
- **Description**: On macOS/Linux, `path.resolve('C:/tmp/x')` becomes `<cwd>/C:/tmp/x`, incorrectly accepted as inside the repo.

### [BUG] validation-utils.ts: Duplicate anchor detection blind spot (A1)
- **File(s)**: scripts/utils/validation-utils.ts:49
- **Type**: BUG
- **Description**: Anchor validation uses Sets, so duplicate opens/closes invisible. Two opens and one close compare equal.

### [BUG] cleanup-orphaned-vectors.ts: Verification catches all errors (A1)
- **File(s)**: scripts/memory/cleanup-orphaned-vectors.ts:163
- **Type**: BUG
- **Description**: Verification query catches every error and reports `historyCount = 0`. Locked DB or corrupt table reported as success.

### [BUG] rebuild-auto-entities.ts: Unknown flags silently ignored (A1)
- **File(s)**: scripts/memory/rebuild-auto-entities.ts:47
- **Type**: BUG
- **Description**: `parseArgs()` never rejects unknown flags. Typos silently ignored, script can rebuild full DB unexpectedly.

### [STANDARDS] Extractors: Logging inconsistency (C2)
- **File(s)**: collect-session-data.ts, conversation-extractor.ts, diagram-extractor.ts, file-extractor.ts, git-context-extractor.ts
- **Type**: STANDARDS
- **Description**: Mix of `structuredLog`, `console.log`, `console.warn`. No single logging policy across extractors.

### [STANDARDS] Extractors: Capture adapter DRY violation (C2)
- **File(s)**: claude-code-capture.ts, codex-cli-capture.ts, copilot-cli-capture.ts, gemini-cli-capture.ts
- **Type**: STANDARDS
- **Description**: Repeated helper shapes: `PendingPrompt`, `transcriptTimestamp`, `readJsonl`, `normalizeToolName`, `stringifyPreview`. Long-term divergence risk.

### [STANDARDS] Extractors: Entry functions too large (C2)
- **File(s)**: decision-extractor.ts:182-604, collect-session-data.ts:675-948, claude-code-capture.ts:525-720
- **Type**: STANDARDS
- **Description**: Several entry-point functions >200 lines, weakening SRP.

### [DEAD_CODE] diagram-extractor.ts: Unused import (C2)
- **File(s)**: scripts/extractors/diagram-extractor.ts:19
- **Type**: DEAD_CODE
- **Description**: `generateDecisionTree` imported but never used.

---

## Statistics
- P1 (HIGH): 16 findings
- P2 (MEDIUM): 21 findings
- Total: 37 unique findings
- Files analyzed: ~45 (9 core, 18 extractors, 9 memory, 9 utils)
- newInfoRatio: 1.00 (first iteration)

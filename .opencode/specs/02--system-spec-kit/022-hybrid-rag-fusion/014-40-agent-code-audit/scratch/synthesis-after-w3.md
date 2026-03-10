# Synthesis After Waves 1-3

## Severity Counts
- Critical: 1
- High: 31
- Medium: 53
- Low: 20
- Total: 105

_(across 15 agent audit files covering 12 source files)_

## Critical Findings

| # | Finding | File : Lines |
|---|---------|-------------|
| 1 | Post-rename realpath check still allows writes outside the target tree (symlink-based escape from `contextDir`) | file-writer.ts:15-25,95-116,143-163 |

## High Findings

| # | Finding | File : Lines |
|---|---------|-------------|
| 1 | Rollback failures for current file are silently dropped | file-writer.ts:148-166,181-188 |
| 2 | Rollback uses non-atomic `copyFile` and rewrites untouched files | file-writer.ts:150-163 |
| 3 | No concurrency control; backup/rollback can lose other writers' data | file-writer.ts:123-145,150-172 |
| 4 | Path resolution is layout-dependent; breaks source-vs-dist consistency | config.ts:70-71,210,284-285 |
| 5 | Hand-rolled brace scanning breaks valid JSON when strings contain `{`/`}` | config.ts:217-239 |
| 6 | Whitespace variants (`\n`, NBSP) bypass contamination denylist | contamination-filter.ts:48-52,66-75 |
| 7 | Overly broad denylist entries delete legitimate content | contamination-filter.ts:11-27,66-70 |
| 8 | `toRelativePath` does not confine paths to `projectRoot` | file-helpers.ts:10-25 |
| 9 | `ensureUniqueMemoryFilename` has a TOCTOU collision race | slug-utils.ts:146-170 |
| 10 | Null input fabricates decisions instead of failing safely | decision-extractor.ts:123-126 |
| 11 | Manual decisions short-circuit and discard all observed decisions | decision-extractor.ts:121-129,250-257 |
| 12 | `chosenOption` and `reason` fields are silently ignored | decision-extractor.ts:211-217 |
| 13 | Malformed input crashes the extractor (no runtime guards) | decision-extractor.ts:103-109,121,135,261-278 |
| 14 | Decimal confidences like `0.7` are parsed as zero | decision-extractor.ts:40-42,329-335 |
| 15 | Prefix-based root stripping accepts files outside `PROJECT_ROOT` | file-extractor.ts:154-164 (via file-helpers.ts) |
| 16 | Lossy path truncation used as file identity/dedup key | file-extractor.ts:154-175,267-271 |
| 17 | `addFile()` downgrades stronger file actions during merge | file-extractor.ts:182-205 |
| 18 | Semantic enrichment unconditionally clobbers authoritative actions | file-extractor.ts:287-319 |
| 19 | Session-scoped prompt capture breaks when timestamps are missing | opencode-capture.ts:193-195,206-210,525-531 |
| 20 | Prompt/message pairing attaches wrong prompt to user message | opencode-capture.ts:522-535 |
| 21 | I/O and parse failures silently downgraded to empty data | opencode-capture.ts:118-133,168-175,271-296 |
| 22 | Partial normalized-shape inputs bypass normalization entirely | input-normalizer.ts:238-241 |
| 23 | Alternative mapping can throw; violates `string[]` guarantee | input-normalizer.ts:147-149,179-180 |
| 24 | Spec-folder relevance filtering leaks cross-spec content | input-normalizer.ts:435-456 |
| 25 | RC-10 snake_case normalization is only partial; capture data dropped | input-normalizer.ts:415-426,471-474,507-531 |
| 26 | Missing array/object coercion crashes on malformed captures | input-normalizer.ts:337-349,454-456,550-557 |
| 27 | `toSafeISOString` corrupts chronology for numeric-string timestamps | input-normalizer.ts:458-469 |
| 28 | `injectQualityMetadata` can rewrite non-frontmatter content as YAML | workflow.ts:384-430 |
| 29 | Unsafe `FILE_PATH` dereference aborts stateless enrichment | workflow.ts:466-473,515-521 |
| 30 | `loadDataFn` inputs incorrectly treated as stateless live-session data | workflow.ts:564-570,580-588 |
| 31 | Null dereference in validation gate crashes no-data/simulation saves | workflow.ts:1162-1165 |
| 32 | Duplicate-suppressed context files leave stale folder metadata | workflow.ts:1024-1103,1215-1223 |
| 33 | Spec-folder detection can abort the simulation fallback | collect-session-data.ts:629-677 |
| 34 | Multiple conflicting "canonical" spec folders used in same result | collect-session-data.ts:629-667,725-748,795-799 |
| 35 | Multi-root spec detection undone by single-root validation later | collect-session-data.ts:635-640,735-748 |
| 36 | Path-traversal guard is incomplete (string-prefix only, no realpath) | collect-session-data.ts:740-748 |
| 37 | Final session status stuck `BLOCKED` after blocker resolved | collect-session-data.ts:370-385 |

_(Note: some HIGH findings are cross-cutting; e.g. prefix-based path stripping appears in file-helpers.ts, file-extractor.ts, and collect-session-data.ts.)_

## Most Problematic Areas

| Rank | File | Findings (H/M/L) | Key Concern |
|------|------|-------------------|-------------|
| 1 | **workflow.ts** (w3-a11 + w3-a12 + w3-a13 combined) | 5H / 17M / 5L = 27 total | Largest file; null derefs, state mutations, frontmatter corruption, parallel extraction failures, metadata desync |
| 2 | **decision-extractor.ts** (w2-a06) | 5H / 5M / 2L = 12 total | Null fabrication, schema drift, confidence parsing, manual-vs-observed short-circuit |
| 3 | **collect-session-data.ts** (w3-a14 + w3-a15 combined) | 5H / 8M / 4L = 18 total | Path traversal, multi-root confusion, NaN propagation, blocker status |
| 4 | **input-normalizer.ts** (w2-a09 + w2-a10 combined) | 6H / 8M / 0L = 14 total | Normalization bypass, snake_case gaps, crash on malformed captures, timestamp corruption |
| 5 | **file-writer.ts** (w1-a01) | 1C / 3H / 3M / 2L = 9 total | Only CRITICAL in entire audit; symlink escape, rollback failures, no concurrency control |

## Recurring Patterns

1. **Missing runtime type guards** -- The single most pervasive issue. At least 9 of 12 audited files trust TypeScript static types at runtime boundaries. Untrusted JSON, caller-provided data, and filesystem reads are cast with `as T` and accessed without `Array.isArray`, `typeof`, or `Number.isFinite` checks, leading to crashes and silent data corruption.

2. **String-prefix path containment instead of canonical path validation** -- Four separate files (`file-writer.ts`, `file-helpers.ts`, `file-extractor.ts`, `collect-session-data.ts`) use `startsWith()` for security-sensitive path containment. None resolve symlinks or enforce path-segment boundaries, enabling sibling-directory and symlink escape.

3. **Errors silently swallowed into empty/default results** -- Broad `catch {}` blocks in `config.ts`, `slug-utils.ts`, `opencode-capture.ts`, `file-extractor.ts`, `workflow.ts`, and `collect-session-data.ts` collapse I/O errors, parse failures, and permission denials into fallback values. Callers cannot distinguish "absent" from "corrupt."

4. **TOCTOU and concurrency races** -- `file-writer.ts`, `slug-utils.ts`, and `workflow.ts` all perform check-then-act sequences without locks or atomic operations. Concurrent writers can overwrite each other's data or produce duplicate filenames.

5. **Inconsistent normalization order** -- Both `contamination-filter.ts` and `input-normalizer.ts` apply transformations in an order that lets pre-normalization variants bypass matching. Whitespace normalization runs after denylist scanning; snake_case normalization covers only top-level fields.

6. **Lossy/fabricated metadata** -- Several extractors synthesize data rather than leaving fields empty: `decision-extractor.ts` fabricates decisions on null input, `input-normalizer.ts` fabricates confidence scores and timestamps, `workflow.ts` overwrites `TOOL_COUNT` with file count. This produces plausible-looking but incorrect output.

7. **Mutable shared state** -- `CONFIG` is a mutable global, enrichment functions mutate caller-owned arrays in place, and dedup helpers sort input arrays via side-effect. This makes behavior order-dependent and test-fragile.

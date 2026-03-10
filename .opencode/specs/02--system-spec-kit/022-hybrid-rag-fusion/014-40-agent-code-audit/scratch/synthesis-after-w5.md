# Synthesis After Waves 1-5 (25 Agents)

## Severity Counts (Deduplicated)
- Critical: 1
- High: 26
- Medium: 24
- Low: 8
- Total unique: 59 (raw total before dedup: 72)

## Critical Findings

1. **Symlink escape from `contextDir` via post-rename realpath check** -- `file-writer.ts:15-25,95-116,143-163`. The `realpath` verification runs only after `fs.rename()` commits bytes outside the intended tree. Pre-write containment is lexical only. _(W1-a01, W4-a16, W5-a25)_

## High Findings

1. **Rollback failures for current file silently dropped** -- `file-writer.ts:148-188`. Restore `copyFile()`/`unlink()` wrapped in empty `catch {}`. _(W1-a01, W4-a19)_
2. **Rollback uses non-atomic `copyFile`; can overwrite concurrent writer** -- `file-writer.ts:27-44,117-125,143-172`. No lock or inode/mtime check; stale backup treated as authoritative. _(W1-a01, W4-a20, W5-a25)_
3. **TOCTOU in `ensureUniqueMemoryFilename` -- concurrent saves pick same name** -- `slug-utils.ts:146-170; workflow.ts:553-554,969-971; file-writer.ts:123-145`. `readdirSync()` snapshot, then later `rename()` silently overwrites. _(W1-a04, W4-a20, W5-a25)_
4. **Path resolution layout-dependent; breaks source-vs-dist consistency** -- `config.ts:70-71,210,284-285`. _(W1-a02)_
5. **Hand-rolled brace scanning breaks valid JSON with `{`/`}` in strings** -- `config.ts:217-239`. _(W1-a02)_
6. **Whitespace variants bypass contamination denylist** -- `contamination-filter.ts:48-52,66-75`. _(W1-a03)_
7. **Overly broad denylist entries delete legitimate content** -- `contamination-filter.ts:11-27,66-70`. _(W1-a03)_
8. **`toRelativePath` does not confine paths to `projectRoot`** -- `file-helpers.ts:10-25`. Prefix-based stripping accepts sibling paths. _(W1-a05, W4-a16)_
9. **Null input fabricates decisions instead of failing** -- `decision-extractor.ts:123-126`. _(W2-a06)_
10. **Manual decisions short-circuit discards all observed decisions** -- `decision-extractor.ts:121-129,250-257`. _(W2-a06)_
11. **Malformed input crashes the extractor (no runtime guards)** -- `decision-extractor.ts:103-109,121,135,261-278`. _(W2-a06)_
12. **Decimal confidences like `0.7` parsed as zero** -- `decision-extractor.ts:40-42,329-335`. _(W2-a06)_
13. **Session-scoped prompt capture breaks on missing timestamps** -- `opencode-capture.ts:193-195,206-210,525-531`. _(W2-a08)_
14. **Prompt/message pairing attaches wrong prompt** -- `opencode-capture.ts:522-535`. _(W2-a08)_
15. **Partial normalized-shape inputs bypass normalization entirely** -- `input-normalizer.ts:238-241`. Hybrid payloads keep camelCase, skip alias canonicalization. _(W2-a09, W5-a21)_
16. **Missing array/object coercion crashes on malformed captures** -- `input-normalizer.ts:337-349,454-456,550-557`. Container-only validation lets null items through. _(W2-a10, W4-a17)_
17. **`injectQualityMetadata` can rewrite non-frontmatter as YAML** -- `workflow.ts:384-430`. _(W3-a11)_
18. **Null dereference in validation gate crashes no-data saves** -- `workflow.ts:1162-1165`. _(W3-a12)_
19. **Duplicate-suppressed context files leave stale folder metadata** -- `workflow.ts:1024-1103,1215-1223`. _(W3-a13)_
20. **Multiple conflicting canonical spec folders in same result** -- `collect-session-data.ts:629-667,725-748,795-799`. _(W3-a14, W3-a15)_
21. **`filesModified` legacy objects normalized into invalid `FILE_PATH`** -- `input-normalizer.ts:49,253-258; collect-session-data.ts:148,692`. Producer/consumer disagree on item type. _(W5-a21)_
22. **Source capture metadata discarded, recomputed with different semantics** -- `opencode-capture.ts:90-97,501-507; input-normalizer.ts:498-610; workflow.ts:1077-1080`. `total_messages` becomes `userPrompts.length`. _(W5-a22)_
23. **Structured ACTION overwritten during semantic enhancement** -- `file-extractor.ts:283-319; workflow.ts:903-910`. _(W5-a23)_
24. **Workflow dedup drops file rows before extractor can merge them** -- `workflow.ts:466-474,514-522; file-extractor.ts:147-207`. _(W5-a23)_
25. **Manual decisions bypass contamination cleaning** -- `workflow.ts:734-792; decision-extractor.ts:118-258`. `_manualDecisions` never sanitized. _(W5-a24)_
26. **Observation filtering only covers `_provenance` records** -- `workflow.ts:743-763,804-825`. Non-provenance observations pass uncleaned. _(W5-a24)_

## Top Problematic Files

| Rank | File | Unique Findings | Key Themes |
|------|------|----------------|------------|
| 1 | **workflow.ts** | 12 | Null derefs, metadata desync, contamination gaps, dedup ordering, frontmatter corruption |
| 2 | **input-normalizer.ts** | 9 | Normalization bypass, type coercion crashes, contract mismatches, timestamp corruption |
| 3 | **file-writer.ts** | 7 | Symlink escape (only CRITICAL), TOCTOU races, rollback failures, non-atomic restore |
| 4 | **collect-session-data.ts** | 7 | Path traversal, multi-root confusion, NaN propagation, contract gaps |
| 5 | **decision-extractor.ts** | 7 | Null fabrication, confidence parsing, manual short-circuit, regex truncation |
| 6 | **opencode-capture.ts** | 6 | Silent error swallowing, schema drift crashes, metadata loss |
| 7 | **file-extractor.ts** | 4 | ACTION overwrite, dedup ordering, MAX_FILES truncation too early |
| 8 | **contamination-filter.ts** | 4 | Denylist gaps, whitespace bypass, regex misses tool names |
| 9 | **slug-utils.ts** | 3 | TOCTOU filename race, contaminated name detection, Unicode mark stripping |
| 10 | **config.ts** | 2 | Layout-dependent paths, brace scanning |
| 11 | **file-helpers.ts** | 2 | Prefix-based path containment, sibling path acceptance |

## Cross-Cutting Patterns

**Security (path containment):** Four files use `startsWith()` for security-sensitive path containment without `realpath` or segment-boundary checks. This is the single most exploitable class of issue, and the only CRITICAL finding stems from it.

**Type safety (runtime guards):** At least 9 of 12 audited files trust TypeScript static types at runtime boundaries. `as T` casts on deserialized JSON, `!` non-null assertions hiding NaN/null, and container-only array validation are pervasive. Wave 4 (a17) confirmed crashes are reproducible with trivial malformed inputs.

**Error handling (silent swallowing):** Broad `catch {}` blocks in 6+ files collapse I/O errors, parse failures, and permission denials into fallback/empty values. Callers cannot distinguish "absent" from "corrupt." Wave 4 (a19) found this across all four major pipeline files.

**Concurrency (TOCTOU):** file-writer.ts, slug-utils.ts, and workflow.ts all perform check-then-act without locks or atomic operations. Wave 4 (a20) and Wave 5 (a25) confirmed cross-process races on filename selection, backup/restore, and duplicate detection.

**Data pipeline contracts:** Waves 5 (a21-a24) revealed that producer and consumer disagree on field shapes (`filesModified`, `ACTION`, `importanceTier`), normalization short-circuits leave hybrid payloads half-canonical, and metadata is discarded then recomputed with changed semantics.

**Contamination filtering gaps:** Wave 5 (a24) showed that `_manualDecisions` and non-provenance observations bypass cleaning entirely, and Wave 4 (a18) found regex patterns that miss dotted/hyphenated tool names and sentence-final filler phrases.

## Key Recommendations for Waves 6-8

1. **Compliance agents** should verify that every `startsWith()`-based path check has been cataloged and that a canonical `realpath` + segment-boundary fix plan exists for each.
2. **Type-safety sweep** should confirm runtime guards exist at every JSON deserialization boundary and every `as T` cast site. The a17 reproduction scripts can serve as regression seeds.
3. **Error-handling compliance** should enforce that `catch {}` blocks either narrow to `ENOENT` or log/propagate the real error. Silent swallowing should be treated as a defect.
4. **Concurrency model** needs an architectural decision: either accept single-process-only operation (document it) or introduce per-folder filesystem locking for filename reservation, dedup, and metadata updates.
5. **Pipeline contract alignment** between input-normalizer, collect-session-data, and workflow should be reconciled into a single shared typed interface with explicit field ownership.
6. **Contamination coverage** should be extended to `_manualDecisions` and all observation fields regardless of `_provenance`.

# Iteration 010: Memory Parsing and Validation

## Findings

### [P1] YAML-looking text anywhere in the body can override parsed metadata
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`

**Issue**: `extractContextType()`, `extractImportanceTier()`, and the multiline branch of `extractTriggerPhrases()` search the entire document for YAML-shaped keys instead of parsing only a validated leading frontmatter block. That means fenced examples, inline documentation, or copied config snippets inside the body can silently overwrite the indexed `context_type`, `importance_tier`, and `trigger_phrases` for a memory.

**Evidence**:
- `extractContextType()` matches `contextType|context_type` anywhere in `content` at [`memory-parser.ts:541-545`](../../../../../../skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts#L541).
- `extractImportanceTier()` strips comments, but then still matches `importance_tier|importanceTier` anywhere in the remaining body at [`memory-parser.ts:554-565`](../../../../../../skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts#L554).
- `extractTriggerPhrases()` enters multiline YAML mode as soon as it sees a `trigger_phrases:` line anywhere in the file at [`memory-parser.ts:483-508`](../../../../../../skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts#L483).
- A direct reproduction with the current regex logic treated a fenced example block as real metadata and returned `contextType: "decision"`, `importanceTier: "constitutional"`, and `triggerPhrases: ["fake"]` even though the file had no leading frontmatter.

**Fix**: Parse frontmatter once from the top of the document only, preferably with a real YAML parser or a single bounded frontmatter extractor. Feed `extractContextType()`, `extractImportanceTier()`, and `extractTriggerPhrases()` from that parsed object instead of scanning the whole body.

### [P1] Anchor validation accepts malformed nesting and extraction returns corrupted sections
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`

**Issue**: `validateAnchors()` only checks whether a matching closing tag exists somewhere in the document, and `extractAnchors()` always takes the first matching closing tag after an opening tag. Crossed/nested anchors therefore validate as "good" while returning truncated or cross-contaminated anchor bodies. Duplicate anchor IDs also are not rejected and will overwrite earlier entries in the returned map.

**Evidence**:
- Validation only performs a global `closingPattern.test(content)` per opening tag at [`memory-parser.ts:721-741`](../../../../../../skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts#L721).
- Extraction slices from the opening tag to the first later closing tag with the same ID at [`memory-parser.ts:756-770`](../../../../../../skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts#L756).
- Existing tests only cover the happy path and a single missing-closing-tag case at [`memory-parser.vitest.ts:235-265`](../../../../../../skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts#L235).
- A crossed-anchor reproduction currently returns `valid: true`, while `outer` captures the nested opening tag and `inner` captures `<!-- /ANCHOR:outer -->` plus trailing text instead of a clean inner section.

**Fix**: Replace the regex-pairing approach with a single-pass stack parser that enforces proper nesting, rejects duplicate IDs, and records structural errors before extraction. If malformed nesting is detected, treat anchor extraction as invalid instead of returning partial content.

### [P1] Normalization erases checklist state and can make pending/completed tasks share the same cache key
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts`

**Issue**: `normalizeMarkdownLists()` removes both unchecked (`- [ ]`) and checked (`- [x]` / `- [X]`) prefixes, so pending and completed tasks normalize to identical text. In this codebase that is not just a retrieval-quality tradeoff: the normalized text is used for embedding cache keys and chunk cache keys, so flipping a task from incomplete to complete can reuse the same normalized hash and stale embedding even though the task state changed.

**Evidence**:
- The normalizer intentionally strips both checkbox forms at [`content-normalizer.ts:149-156`](../../../../../../skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts#L149).
- The tests codify this state loss by expecting `- [ ] T001 ...` and `- [x] Done item` to become plain prose at [`content-normalizer.vitest.ts:235-247`](../../../../../../skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts#L235).
- Normalized content is used to compute embedding cache keys at [`embedding-pipeline.ts:114-116`](../../../../../../skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts#L114) and chunk cache keys at [`chunking-orchestrator.ts:89-90`](../../../../../../skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L89).
- The same normalized text also feeds BM25 document text at [`bm25-index.ts:305-309`](../../../../../../skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts#L305), and tasks/checklists are explicitly indexed as spec documents at [`memory-parser.ts:252-258`](../../../../../../skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts#L252) and [`memory-parser.ts:693-700`](../../../../../../skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts#L693).
- A direct reproduction normalizes `- [ ] pending task` and `- [x] completed task` to the same state-free strings.

**Fix**: Preserve checkbox state as text instead of deleting it, for example by rewriting to `unchecked pending task` / `checked completed task` or `[todo]` / `[done]`. That keeps retrieval and cache invalidation sensitive to task completion changes.

### [P2] Encoding detection silently misdecodes BOM-less UTF-16 files as UTF-8
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`

**Issue**: `readFileWithEncoding()` only recognizes UTF-16 when a BOM is present. If a UTF-16 LE/BE file is saved without a BOM, the function falls through to `buffer.toString('utf-8')` and returns a string full of embedded NULs/replacement data rather than failing fast or decoding correctly. That poisons downstream metadata extraction, hashing, and validation in a way that is hard to detect.

**Evidence**:
- The function has explicit branches only for UTF-8 BOM, UTF-16 LE BOM, and UTF-16 BE BOM, then falls back to UTF-8 at [`memory-parser.ts:134-167`](../../../../../../skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts#L134).
- Current tests cover valid UTF-8, UTF-8 BOM, and "binary/unusual" input, but not BOM-less UTF-16 at [`memory-parser-extended.vitest.ts:247-274`](../../../../../../skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts#L247).
- A direct reproduction with bytes `48 00 69 00` returned `"H\u0000i\u0000"` instead of `"Hi"`, which would break the parser's regex-based metadata extraction.

**Fix**: Add a heuristic BOM-less UTF-16 detector (for example, high NUL frequency in alternating bytes), or explicitly reject suspicious high-NUL files instead of silently decoding them as UTF-8.

## Summary
P1: 3, P2: 1.

I did not find a direct path traversal vulnerability in these two scoped files. The directory walker in `findMemoryFiles()` stays rooted under `workspacePath/specs` and `workspacePath/.opencode/specs` and skips symlinks at [`memory-parser.ts:841-910`](../../../../../../skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts#L841), so the higher-risk issues in this slice are metadata poisoning, malformed anchor handling, normalization-driven state loss, and silent encoding corruption.

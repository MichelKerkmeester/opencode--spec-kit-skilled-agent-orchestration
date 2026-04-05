# Iteration 006: Chunking and Thinning

## Findings

### [P1] Anchor-mode indexing drops all meaningful text outside matched anchor pairs
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts`

**Issue**: Once `chunkLargeFile()` sees at least two matched anchor sections, it switches to anchor mode and emits chunks only from `extractAnchorSections()`. Any intro, interstitial, or trailing text outside `<!-- ANCHOR:... --> ... <!-- /ANCHOR:... -->` pairs is never chunked, never embedded, and never recoverable through chunk reassembly. The parent row only keeps `content.slice(0, 500)`, so most of that dropped text is not even preserved in the fallback summary.

**Evidence**:
- [`anchor-chunker.ts:70`](../../../../../../skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts#L70) to [`anchor-chunker.ts:100`](../../../../../../skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts#L100) build sections exclusively from matched anchor pairs and do not emit any non-anchor segments.
- [`anchor-chunker.ts:275`](../../../../../../skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts#L275) to [`anchor-chunker.ts:279`](../../../../../../skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts#L279) switch to anchor strategy as soon as two anchor sections exist.
- [`chunking-orchestrator.ts:138`](../../../../../../skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L138) to [`chunking-orchestrator.ts:145`](../../../../../../skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L145) and [`chunking-orchestrator.ts:261`](../../../../../../skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L261) to [`chunking-orchestrator.ts:339`](../../../../../../skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L339) index only `chunkResult.chunks`; the parent summary is just the truncated `parentSummary`.
- Local repro against the built chunker on 2026-03-28 used a document with intro/middle/outro prose around two 26k anchor sections and produced `strategy: "anchor"` with `containsIntro=false`, `containsMiddle=false`, and `containsOutro=false`.

**Fix**: Preserve non-anchor regions as first-class chunks when anchor mode is selected, or only choose anchor mode when the entire document is covered by matched anchor ranges. At minimum, merge uncovered text into adjacent anchor chunks so search/reassembly does not silently lose content.

### [P1] Structure fallback can split fenced code blocks into separate chunks
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts`

**Issue**: The fallback chunker is not actually structure-aware. It starts with a raw regex split on lines matching `^#{1,2}\\s`, so any fenced code line that begins with `# ` is treated like a markdown heading. When the preceding chunk is already near the target size, the subsequent flush splits the code fence across chunk boundaries, leaving the opening fence in one chunk and the code body/closing fence in the next.

**Evidence**:
- [`anchor-chunker.ts:205`](../../../../../../skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts#L205) to [`anchor-chunker.ts:206`](../../../../../../skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts#L206) use `content.split(/(?=^#{1,2}\s)/m)` without excluding fenced code or tables.
- [`anchor-chunker.ts:243`](../../../../../../skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts#L243) to [`anchor-chunker.ts:248`](../../../../../../skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts#L248) flush based on target size after those raw regex parts are created.
- The repo already carries an AST-aware chunker that explicitly keeps code blocks atomic: [`tests/structure-aware-chunker.vitest.ts:15`](../../../../../../skill/system-spec-kit/mcp_server/tests/structure-aware-chunker.vitest.ts#L15) to [`tests/structure-aware-chunker.vitest.ts:35`](../../../../../../skill/system-spec-kit/mcp_server/tests/structure-aware-chunker.vitest.ts#L35), but `anchor-chunker.ts` does not use it.
- Local repro against the built chunker on 2026-03-28 with a 4.3k-character section followed by a fenced Python block containing `# comment inside fenced code` produced two chunks: the first ended with ```` ```py ```` and the second began with `# comment inside fenced code\nprint(1)\n````.

**Fix**: Replace the fallback implementation with the shared AST-aware markdown chunker (`@spec-kit/shared/lib/structure-aware-chunker`), or at least pre-tokenize fenced code/table regions so heading detection cannot split inside atomic markdown blocks.

### [P1] Partial child-write failures can leave orphaned chunk rows behind
**File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts`

**Issue**: Child rows are inserted before the metadata write that assigns `parent_id`, `chunk_index`, `chunk_label`, and the rest of the chunk identity. If `applyMetadata()` throws after `indexMemory()` or `indexMemoryDeferred()` succeeds, the catch block only logs the error. Because the row ID is pushed into `childIds` after metadata succeeds, rollback paths never see that partially written child, so it can remain in `memory_index` as an orphan or half-populated staged row.

**Evidence**:
- [`chunking-orchestrator.ts:294`](../../../../../../skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L294) to [`chunking-orchestrator.ts:322`](../../../../../../skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L322) create the child row first.
- [`chunking-orchestrator.ts:324`](../../../../../../skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L324) to [`chunking-orchestrator.ts:337`](../../../../../../skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L337) apply chunk identity metadata after insert.
- [`chunking-orchestrator.ts:339`](../../../../../../skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L339) records the row in `childIds` only after metadata succeeds.
- [`chunking-orchestrator.ts:354`](../../../../../../skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L354) to [`chunking-orchestrator.ts:358`](../../../../../../skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L358) catch failures without deleting a partially created child.
- Both rollback paths clean up only IDs already present in `childIds`: [`chunking-orchestrator.ts:392`](../../../../../../skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L392) to [`chunking-orchestrator.ts:401`](../../../../../../skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L401) and [`chunking-orchestrator.ts:527`](../../../../../../skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L527) to [`chunking-orchestrator.ts:535`](../../../../../../skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts#L535).

**Fix**: Make child insert plus metadata assignment atomic. Wrap each child write in a transaction, assign `parent_id` and chunk metadata in the same unit as the insert, and delete `childId` immediately inside the catch path whenever a partial insert has already occurred.

### [P2] Thinning cannot discard anchor-only noise because anchor weight alone clears the threshold
**File**: `.opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts`

**Issue**: The default score formula makes any anchored chunk automatically retainable, even when it has zero meaningful content. With `ANCHOR_WEIGHT = 0.6`, `DENSITY_WEIGHT = 0.4`, and `DEFAULT_THINNING_THRESHOLD = 0.3`, a chunk that contains only anchor tags/comments still scores `0.6` and is always kept. That defeats the stated goal of dropping low-value chunks before indexing.

**Evidence**:
- [`chunk-thinning.ts:41`](../../../../../../skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts#L41) to [`chunk-thinning.ts:46`](../../../../../../skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts#L46) set the threshold and weights.
- [`chunk-thinning.ts:90`](../../../../../../skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts#L90) to [`chunk-thinning.ts:105`](../../../../../../skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts#L105) compute `score = 0.6 * anchorScore + 0.4 * densityScore`.
- Local repro against the built scorer on 2026-03-28 for `<!-- ANCHOR:empty -->\n<!-- /ANCHOR:empty -->` with `anchorIds: ['empty']` returned `densityScore: 0`, `score: 0.6`, `retained: true`.
- Existing tests verify density behavior and threshold wiring, but none assert that anchor-only junk should be dropped: [`chunk-thinning.vitest.ts:118`](../../../../../../skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts#L118) to [`chunk-thinning.vitest.ts:156`](../../../../../../skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts#L156) and [`chunk-thinning.vitest.ts:191`](../../../../../../skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts#L191) to [`chunk-thinning.vitest.ts:226`](../../../../../../skill/system-spec-kit/mcp_server/tests/chunk-thinning.vitest.ts#L226).

**Fix**: Add a minimum density or minimum meaningful-content gate before applying the anchor bonus, or lower the anchor weight so empty anchor wrappers cannot clear the retention threshold by themselves.

## Summary
P0: 0, P1: 3, P2: 1

I did not find a strong standalone heap-retention leak in this slice; the main risks are silent content loss, malformed chunk boundaries, and child-row integrity gaps during failed updates.

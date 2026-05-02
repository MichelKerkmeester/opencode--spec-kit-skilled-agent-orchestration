# Iteration 049: Token Budget Allocation Across Memory + CocoIndex + Code Graph

## Focus

Determine how the compaction pipeline should allocate its shared `4000`-token ceiling across three sources:

1. Memory (`constitutional` + `triggered`)
2. CocoIndex semantic code retrieval
3. Code Graph structural code retrieval

This pass answers four concrete questions:

1. Should allocation be fixed or dynamic?
2. What should the default `4000`-token split be?
3. What is the correct priority order?
4. What should happen when a source is empty or low-confidence?

## Findings

1. The current implementation still gives the full `4000` tokens to Memory only.

   `memory-surface.ts` hard-codes `COMPACTION_TOKEN_BUDGET = 4000`, and `autoSurfaceAtCompaction()` always routes that full budget into `autoSurfaceMemories(...)`. The current enforcement logic trims `triggered` items first, then `constitutional` items, and drops the whole payload if it still does not fit. The separate `dynamic-token-budget.ts` module is real, but it is advisory and lives in the hybrid-search path, not in compaction. Right now there is no multi-source allocator at all. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:53-55`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:136-185`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:300-316`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:5-9`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:54-89`]

2. Fixed-only allocation is acceptable as a fallback, but the target design should be dynamic late fusion with source floors plus a shared overflow pool.

   The strongest packet evidence now points to staged late fusion: keep Memory, semantic retrieval, and structural retrieval separate until the compaction scorer/projection layer, then merge once under a single outer cap. Iteration 052 is explicit that "fixed-order concatenation with section headers" is only the minimum viable fallback, not the preferred design. That same iteration also says Memory should be pinned in parallel, semantic seeds should arrive before structural expansion, and merge should happen last. So the right answer is not "fully fixed" or "fully pooled"; it is a hybrid:

   - fixed outer budget
   - small guaranteed floors
   - shared adaptive pool for the rest

   [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:320-330`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:332-339`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-052.md:15-29`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-052.md:206-226`]

3. The best `4000`-token default is `Memory 1000 + CocoIndex 400 + Code Graph 1400 + Flex 1200`.

   This split follows the packet's relevance ordering and the clarified role of each source:

   - Memory needs a guaranteed floor because constitutional rules are durable and current compaction semantics already protect them.
   - Code Graph deserves the largest code-context floor because the packet's preservation order prioritizes active files/symbols, dependency neighbors, and verification surface before broader session anchors, and because graph proximity is a stronger compaction signal than semantic similarity.
   - CocoIndex should have the smallest floor because DR-010 and later iterations consistently treat it as the semantic recall/seed layer, not the main payload layer.
   - The remaining budget should stay adaptive because rigid quotas waste tokens whenever one lane is empty, weak, or duplicates another lane after deduplication.

   Recommended v1 profile for the `4000`-token compaction envelope:

   - Memory floor: `1000`
     - `600` constitutional
     - `400` triggered
   - CocoIndex floor: `400`
   - Code Graph floor: `1400`
   - Shared flex pool: `1200`

   As percentages, that is:

   - Memory `25%`
   - CocoIndex `10%`
   - Code Graph `35%`
   - Flex `30%`

   This is a better fit than the current all-Memory model and a better fit than equal thirds because the sources are not equally useful for post-compaction continuity. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:94-105`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:332-339`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:500-512`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-052.md:64-85`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-053.md:115-132`]

4. Retrieval order and budget-protection order should be different.

   The packet evidence supports this distinction:

   Retrieval/assembly order:

   1. Start Memory auto-surface immediately and pin it as guaranteed context.
   2. Run CocoIndex to collect semantic seeds.
   3. Expand Code Graph from active symbols/files plus the top CocoIndex seeds.
   4. Merge late.

   Protection/retention order inside the allocator:

   1. Constitutional memory
   2. State / next steps / blockers
   3. Active files and symbols
   4. Direct dependency neighbors and verification surface
   5. Triggered memories
   6. Semantic neighbors
   7. Two-hop graph leaves and weak semantic tail

   This resolves an apparent tension in the research. Some packet text puts "active files and symbols" first in the final brief, while the current Memory hook gives constitutional items hard protection. The clean way to reconcile those is: pin a small durable-memory floor, then rank the remaining budget around active structural continuity. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:332-337`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:159-173`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-052.md:15-29`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-052.md:64-85`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:159-185`]

5. Budget overflow should be handled by ranking and redistribution, not by spending every source's quota.

   Empty or weak lanes should release their floor immediately into the shared flex pool. The allocator should never pad a source just because it was assigned a reservation. The practical rules should be:

   - if CocoIndex returns no trustworthy seeds, move its `400` floor to flex
   - if Code Graph has no anchored roots or only weak 2-hop noise, move unused graph floor to flex
   - if there are no triggered memories, move that `400` to flex
   - if multiple sources converge on the same file/symbol, deduplicate first, then re-spend the saved tokens

   The trim order should start with the weakest context:

   1. weak semantic tail
   2. two-hop graph leaves
   3. low-value triggered memories
   4. direct structural neighbors
   5. state / next / blockers
   6. constitutional memory

   This matches the packet's "cut breadth before depth" guidance and the recommendation to use CocoIndex as a bounded semantic boost, not as the primary definition of the working set. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-050.md:92-102`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-052.md:31-41`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-053.md:101-132`]

6. The current dynamic token budget module should stay as the outer-budget selector, not the intra-source allocator.

   `dynamic-token-budget.ts` already gives the system a clean way to choose `1500`, `2500`, or `4000` based on query complexity. That module should remain responsible for the outer ceiling only. Once an outer budget is chosen, compaction should subdivide it with the same ratio-based policy rather than inventing a second unrelated strategy. So for future reuse:

   - `simple` outer budget `1500` -> apply the same percentages
   - `moderate` outer budget `2500` -> apply the same percentages
   - `complex` outer budget `4000` -> apply the same percentages

   But for v1 of compaction specifically, keeping the existing `4000` outer cap is still the safest move because the current hook and resume behavior are already documented around that size. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:18-25`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:38-48`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:69-74`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-052.md:85-85`]

## Evidence

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:5-9`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:18-25`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:38-48`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:54-89`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:53-55`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:136-185`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:159-185`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:300-316`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:69-74`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:94-105`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:320-339`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:500-512`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:159-173`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-050.md:92-102`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-052.md:15-29`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-052.md:31-41`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-052.md:64-85`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-052.md:206-226`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-053.md:101-132`

## New Information Ratio (0.0-1.0)

0.66

## Novelty Justification

The packet already knew three important things separately:

1. the current code gives all `4000` tokens to Memory,
2. CocoIndex should seed structural expansion rather than replace it,
3. fixed-order concatenation is a fallback, not the intended merge model.

What was missing was the actual allocation policy that connects those findings into one implementable answer. The new value in this iteration is the concrete budget model:

- floors plus shared flex pool instead of equal thirds or memory-only
- a specific `4000`-token default split
- a distinction between retrieval order and protection order
- explicit empty-source redistribution rules
- a clean relationship between the existing dynamic outer budget selector and the new intra-source allocator

## Recommendations

1. Keep the compaction outer ceiling at `4000` for v1, but stop giving the full envelope to Memory.
2. Introduce a dedicated `allocateCompactBudget(totalBudget, memory, semantic, structural)` layer after source-local shaping and before final rendering.
3. Use this default `4000` profile:
   - Memory `1000` (`600` constitutional, `400` triggered)
   - CocoIndex `400`
   - Code Graph `1400`
   - Flex `1200`
4. Run the sources in this order:
   - Memory pinned in parallel
   - CocoIndex seeds
   - Code Graph expansion from active roots plus top seeds
   - late fusion merge
5. Trim in this order:
   - weak semantic tail
   - two-hop graph leaves
   - low-value triggered memories
   - direct structural neighbors
   - state / next / blockers
   - constitutional memory
6. Immediately recycle any unused floor into the flex pool. Never spend tokens on filler just to honor a reservation.
7. Reuse the existing percentage profile if compaction later adopts `1500` or `2500` outer budgets from `dynamic-token-budget.ts`.
8. Make the allocator observable in output metadata:
   - per-source requested tokens
   - granted tokens
   - dropped items
   - redistribution decisions

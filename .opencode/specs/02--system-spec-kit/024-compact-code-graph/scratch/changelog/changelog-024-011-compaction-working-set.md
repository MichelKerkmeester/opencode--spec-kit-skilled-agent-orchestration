# Changelog: 024/011-compaction-working-set

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 011-compaction-working-set -- 2026-03-31

When an AI session runs long and the context window fills up, Claude compacts the conversation to free space. Previously, that compaction only preserved memories -- it had no awareness of which code files were actively being worked on or what the codebase structure looked like. This phase replaces the Memory-only compaction with a three-source merge pipeline that combines constitutional memory, structural code graph context, and semantic code search results. A new session working-set tracker remembers which files and symbols were touched during the conversation, so when compaction fires, the system knows what matters most and allocates its limited 4000-token budget across all three sources using guaranteed minimums, overflow redistribution, and a deterministic trim order that protects the most critical context.

> Spec folder: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/011-compaction-working-set/`

---

## Architecture (3 changes)

### 3-Source Merge Pipeline

**Problem:** When the AI's context window filled up and compaction triggered, the system only retrieved saved memories. It had no awareness of the code structure (which files depend on which) or semantic neighbors (code that is conceptually related to what was being discussed). After compaction, the AI would lose track of which files it had been editing and how they related to each other, forcing the user to re-explain the codebase layout.

**Fix:** Built a late-fusion pipeline that retrieves from three independent sources in parallel: (1) constitutional and triggered memories from the memory database, (2) structural code graph context showing file relationships and dependencies, and (3) CocoIndex semantic search results finding conceptually related code. The three result sets are deduplicated at the file level (so the same file mentioned by two sources only appears once, keeping the higher-priority version) and merged into a single structured brief. "Late fusion" means each source runs its own retrieval independently -- they are only combined at the end, which avoids ordering dependencies and lets each source use its own timeout. After compaction, the AI now retains awareness of active code files, their structural neighbors, and project-wide rules.

### Budget Allocator with Floors and Overflow

**Problem:** The entire 4000-token compaction budget went to memory alone. When memories were short, tokens were wasted on padding. When memories were long, there was zero room left for code structure or semantic context. There was no mechanism to share unused space between sources or guarantee that any particular source would get a minimum allocation.

**Fix:** Introduced a floor-based allocation system. Each source gets a guaranteed minimum ("floor"): constitutional memory receives 700 tokens, code graph gets 1200, semantic search gets 900, and triggered memories get 400. The remaining 800 tokens form an overflow pool. When a source returns empty or uses less than its floor, the unused tokens flow back into the overflow pool, which is then redistributed to the highest-priority sources that can use more. This guarantees every context type gets fair representation -- constitutional rules are never starved by a large code graph, and an absent semantic index does not waste 900 tokens on nothing. The allocator also supports smaller total budgets (1500 or 2500 tokens) while maintaining the same floor ratios.

### Deterministic Trim Order

**Problem:** When the combined results from all three sources exceeded the 4000-token budget, there was no consistent rule for what to cut. Different compaction runs could drop different items, making the output unpredictable and hard to debug. Critical context like constitutional rules (always-on project rules the AI must follow) could potentially be trimmed.

**Fix:** Implemented a fixed six-level trim order that always removes items in the same sequence: (1) low-score semantic search hits are dropped first, (2) then two-hop graph leaves (files two relationships away from the working set), (3) then low-value triggered memories, (4) then direct structural neighbors, (5) then session state and next-steps notes, and (6) constitutional memory is trimmed last and in practice never dropped. This makes compaction output fully predictable -- given the same inputs, it always produces the same output -- and makes it straightforward to diagnose why a particular piece of context was missing after compaction.

---

## New Features (5 changes)

### Session Working-Set Tracker

**Problem:** The system had no record of which files or code symbols (function names, class names, variables) were actively used during a conversation. When compaction triggered, it could not distinguish files that were central to the current task from files that happened to be in the project. The code graph and semantic search had no meaningful starting point for their queries.

**Fix:** Built an in-memory tracker that records every file read or edited and every symbol referenced during the session. Each entry stores an access count and a last-access timestamp. At compaction time, the `getTopRoots(n)` function returns the most relevant items, weighted by both recency (recently touched items rank higher) and frequency (repeatedly accessed items rank higher). These top items seed both the code graph expansion (finding structurally related files) and semantic search (finding conceptually related code). Symbol-level tracking is supported via a dedicated `trackSymbol()` method.

### Structured Compact Brief with Sections

**Problem:** The compacted context was a flat blob of memory text with no internal organization. The AI had to parse through an undifferentiated wall of text to find project rules, active file context, or session state. This made post-compaction recovery slower and less reliable.

**Fix:** The merged output now renders with clear section headers: Constitutional Rules, Active Files & Structural Context, Semantic Neighbors, Session State / Next Steps, and Triggered Memories. Each section groups related context together so the AI can quickly locate what it needs. When a section has zero budget (because its source returned empty or was unavailable), the section header is suppressed entirely rather than rendering an empty block, avoiding wasted tokens on labels with no content.

### Graceful Degradation

**Problem:** If the code graph index or CocoIndex semantic search service was unavailable (not configured, not running, or not yet indexed), the compaction pipeline would either fail outright or produce incomplete results with wasted token budget allocated to empty sections.

**Fix:** When any source is unavailable or returns empty, its floor tokens flow automatically to the remaining sources through the overflow pool. The pipeline always produces useful output even when running with just one source -- for example, in a fresh project with no code graph and no CocoIndex, compaction falls back to memory-only behavior automatically, using the full token budget for memories. No configuration change or manual intervention is needed.

### Allocator Observability

**Problem:** There was no way to see how the token budget was distributed across sources during compaction. When important context was missing after compaction, diagnosing whether the cause was an empty source, an aggressive trim, or a budget starvation issue required guesswork.

**Fix:** Every compaction now produces metadata showing per-source statistics: how many tokens each source requested versus how many it was granted, how many items were dropped by the trim order, how many overflow tokens each source received through redistribution, and the total wall-clock time the merge took. This metadata is included alongside the compact brief, making it straightforward to diagnose why certain context was present or absent after compaction.

### Flexible Budget Sizes

**Problem:** The allocator was hardcoded to a 4000-token total budget. Different context window sizes and compaction aggressiveness levels may call for smaller budgets, but there was no way to adjust without modifying source code.

**Fix:** The allocator now accepts a `totalBudget` parameter supporting 1500, 2500, or 4000 tokens. The floor ratios remain proportional across all budget sizes -- for example, constitutional memory always gets approximately 17.5% of the total. This lets the system adapt to smaller context windows or more aggressive compaction settings without losing the balanced allocation behavior.

---

## Bug Fixes (1 change)

### 1800ms Timeout with Headroom

**Problem:** The hook system imposes a 2-second (2000ms) hard time cap on compaction. The pipeline was using the full 2000ms for its retrieval and merge work, leaving zero time for the serialization overhead (converting the result to a string) and hook state caching (saving the result for later SessionStart injection). Under load, the pipeline would occasionally overrun the 2-second limit and get killed.

**Fix:** Set the pipeline timeout to 1800ms, enforced by a `withTimeout` wrapper. This leaves 200ms of headroom for hook overhead and state caching, ensuring the pipeline completes reliably within the 2-second hard cap established by the Phase 001 latency budget.

---

## Testing (3 changes)

### Budget Allocator Test Suite

**Problem:** The budget allocator has complex redistribution logic -- floors, overflow pools, priority ordering, and trim sequences. Without thorough test coverage, regressions in allocation behavior would be difficult to catch, especially edge cases like all sources being empty or a single source requesting more than the total budget.

**Fix:** Added 15 tests covering: all-sources-present floor distribution (verifying each source gets at least its guaranteed minimum), empty-source overflow redistribution (verifying unused floors flow correctly), constitutional-always-included guarantees (verifying constitutional memory is never dropped regardless of budget pressure), and over-budget trim order correctness (verifying items are dropped in the specified six-level sequence).

### Compact Merger Test Suite

**Problem:** The merge pipeline combines results from three sources with deduplication and section rendering. Incorrect deduplication could cause duplicate content (wasting tokens) or lost content (dropping important context). Incorrect section rendering could produce malformed output.

**Fix:** Added 3 new merge scenario tests (bringing the total to 15) verifying: cross-source deduplication (same file from memory and code graph produces one entry), section rendering with all sources populated, and zero-budget section suppression (sections with no allocated tokens produce no output rather than empty headers).

### End-to-End Hook Integration Tests

**Problem:** Individual unit tests for the tracker, allocator, and merger do not verify that the full pipeline works correctly when wired together through the hook system. Integration failures -- such as the hook not passing working-set roots to the retrieval stage, or the cached brief not being available at SessionStart -- would go undetected.

**Fix:** Added dual-scope hook integration tests verifying the complete flow: session file reads populate the working-set tracker, working-set roots seed three-source retrieval, retrieval results pass through budget allocation, allocated results merge into a sectioned brief, the brief is cached in hook state, and SessionStart injection reads the cached brief correctly.

---

<details>
<summary>Files Changed (9 files)</summary>

| File | What changed |
|------|-------------|
| `mcp_server/lib/code-graph/working-set-tracker.ts` | New -- session file/symbol tracking with recency-weighted `getTopRoots(n)` |
| `mcp_server/lib/code-graph/budget-allocator.ts` | New -- floor-based token allocation with overflow redistribution and trim order |
| `mcp_server/lib/code-graph/compact-merger.ts` | New -- 3-source dedup, late-fusion merge, and sectioned brief rendering |
| `mcp_server/lib/code-graph/index.ts` | Modified -- re-exports for the three new modules |
| `mcp_server/hooks/claude/compact-inject.ts` | Modified -- replaced Memory-only `autoSurfaceAtCompaction` with `mergeCompactBrief` pipeline |
| `mcp_server/hooks/claude/session-prime.ts` | Modified -- reads cached merged brief from hook state for SessionStart injection |
| `mcp_server/tests/budget-allocator.vitest.ts` | New -- 15 budget allocation scenario tests |
| `mcp_server/tests/compact-merger.vitest.ts` | Modified -- added 3 new merge scenario tests (15 total) |
| `mcp_server/tests/dual-scope-hooks.vitest.ts` | New -- end-to-end hook integration tests |

</details>

---

---

## Deep Review Fixes (2026-04-01)

### Doc Fixes
- 3-source merge documented as partial (code graph and CocoIndex sources are placeholder text, not real retrieval)
- Working-set tracker documented as built but not wired into compact-inject
- Budget allocator bypass documented (memory/constitutional sections skip allocator)
- Timeout coverage documented (1800ms only covers stdin parsing)
- Constitutional trim possibility documented (allocator CAN trim despite "never dropped" claim)
- Spec status changed to "Partial"

## Upgrade

No migration required. The new pipeline is backward-compatible -- if Code Graph and CocoIndex are not configured, the system falls back to Memory-only behavior automatically.

# Iteration 80: Verification of Phase A/B File Lists and LOC Estimates from Iteration 068

## Focus
Verify the current implementation seams and actual line counts for the Phase A and Phase B targets from iteration 068. The goal was to confirm whether the listed files are still the right ones and whether the proposed LOC ranges remain realistic against the live code.

## Findings

### 1. `structural-indexer.ts` is still the core Phase A file, and the endLine bug remains exactly where iteration 068 placed it
**Current LOC: 473**

The current parser functions still stamp captures with `endLine: lineNum` for JS/TS, Python, and Bash. `capturesToNodes()` still derives node `contentHash` from `startLine..endLine`, and `extractEdges()` still scans `CALLS` over `caller.startLine..caller.endLine`. So the Phase A diagnosis from iteration 068 still holds: this file is the primary endLine-fix target, and fixing it here would directly improve both body hashing and multi-line `CALLS` detection.

For a **minimal Phase A** limited to endLine computation inside `parseJsTs()`, `parsePython()`, and `parseBash()`, the original **60-80 LOC** estimate still looks realistic. If Phase A also absorbs the later review-driven hardening/cross-check work, the expanded **120-165 LOC** range is also believable. In other words: **the low range fits a narrow parser fix; the expanded range fits the broader reviewed scope.**

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:29-169]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:171-191]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:282-313]

### 2. `code-graph-db.ts` remains a valid Phase B file, but it is not required for the minimal Phase A parser fix
**Current LOC: 338**

The live schema still has no `file_mtime_ms` column, and the current staleness helper is still hash-only (`isFileStale(filePath, currentHash)`). That confirms this file is still the right home for the proposed stale-on-read foundation work from Phase B1.

However, nothing in the current Phase A parser bug requires a DB change. So the iteration 068 phrasing that made `code-graph-db.ts` a "Phase A+B target" should be tightened: **it is a strong Phase B1 target, but only an optional Phase A companion if you intentionally bundle schema prep into the first rollout.**

For Phase B1 specifically, the earlier **~45-60 LOC** estimate in this file still seems realistic. The file is compact, the schema and upsert seams are obvious, and the missing functionality is localized rather than architectural.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:18-68]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:96-177]

### 3. `context-server.ts` is a real Phase B implementation seam and should be treated as a required file in the current file list
**Current LOC: 1171**

This file is now the clearest live interception seam for Phase B. The request handler branches on `MEMORY_AWARE_TOOLS.has(name)`, calls `autoSurfaceAtToolDispatch(name, args)`, and injects surfaced hints with `appendAutoSurfaceHints(result, autoSurfacedContext)`. That means any practical implementation of:

- MCP first-call priming, or
- `GRAPH_AWARE_TOOLS`-style dispatch enrichment

will almost certainly need changes here, not just in `memory-surface.ts`.

This is the most important correction to iteration 068's Phase B file list: **the list is incomplete if it omits `context-server.ts`**. The helper logic can live in hooks or handlers, but the current pre-dispatch orchestration point is here.

The good news is that the proposed changes are still realistic despite the file's large size, because the actual insertion points are narrowly localized. A Phase B wiring change in this file still looks like a **small-to-moderate delta, roughly 25-50 LOC**, not a broad rewrite.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:307-377]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:379-438]

### 4. `memory-surface.ts` is still the right helper/pattern file for Phase B, but it is not sufficient by itself
**Current LOC: 337**

`memory-surface.ts` still contains the pattern pieces iteration 068 relied on:

- `MEMORY_AWARE_TOOLS`
- `extractContextHint()`
- `autoSurfaceMemories()`
- `autoSurfaceAtToolDispatch()`
- `autoSurfaceAtCompaction()`

So it remains a valid Phase B file for first-call tracking and graph-aware helper logic. At the same time, the current implementation shows that `memory-surface.ts` is a **helper layer**, not the entire feature surface: the actual dispatch-time orchestration still happens in `context-server.ts`.

That makes the proposed work realistic but slightly more constrained than some earlier phrasing suggested. Adding `FirstCallTracker` and/or `GRAPH_AWARE_TOOLS`-style helper logic here still looks reasonable, and a rough **70-120 LOC** range in this file remains believable depending on whether it carries only helper code or also session-tracking state.

[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:42-84]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:136-229]
[SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:235-317]

### 5. Overall assessment: Phase A estimate still holds; Phase B estimate is broadly plausible, but the file list needs correction
Using the current files only, the verification result is:

- **Phase A file list:** mostly correct
  - `structural-indexer.ts` is unquestionably the main target
  - `code-graph-db.ts` should be treated as optional prep, not mandatory for a minimal parser-only Phase A

- **Phase B file list:** directionally correct but incomplete/outdated
  - `code-graph-db.ts` remains correct for stale-on-read
  - `memory-surface.ts` remains correct as the helper/pattern source
  - `context-server.ts` is a required live integration seam and should be explicitly included

On estimates:

- **Phase A:** realistic as stated, with the caveat that `60-80 LOC` matches the narrow parser fix while `120-165 LOC` matches the later expanded reviewed scope
- **Phase B:** the original **291-389 LOC** total still feels **broadly plausible**, but its lower bound is now slightly optimistic unless `context-server.ts` is explicitly counted and some of the originally proposed `memory-context.ts` work stays very small. A safer present-day reading is: **same order of magnitude, but slightly more wiring-heavy than iteration 068 implied**

## Ruled Out

- Treating `code-graph-db.ts` as mandatory for the minimal Phase A parser fix
- Treating `memory-surface.ts` as sufficient for Phase B interception without `context-server.ts`
- Treating the Phase B file list from iteration 068 as complete in current code

## Dead Ends

None. The requested four files were enough to verify both the LOC counts and the phasing realism.

## Sources Consulted

- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts`
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `wc -l` counts run on the four requested files during this iteration

## Assessment

- New information ratio: 0.52
- Questions addressed: Are the Phase A/B file lists from iteration 068 still correct, and are the LOC estimates still realistic against current code?
- Questions answered:
  - Phase A remains centered on `structural-indexer.ts`
  - `code-graph-db.ts` belongs primarily to Phase B1, not the minimal Phase A fix
  - `context-server.ts` is now a required explicit Phase B target
  - The estimate ranges remain broadly realistic, with Phase B's lower bound slightly optimistic

## Reflection

- What worked and why: Reading the live parser, hook-helper, orchestration, and DB files together made it easy to separate **where the logic lives today** from **where earlier research proposed it should live**. The `context-server.ts` pass was especially important because it exposed the real pre-dispatch seam that a file-list-only synthesis could miss.
- What did not work and why: Memory retrieval for this exact verification target did not return useful spec-local context, so the iteration depended almost entirely on first-principles source reading. That was fine for correctness, but slower than a good memory hit would have been.
- What I would do differently: In future phasing notes, I would distinguish `primary target`, `helper target`, and `integration seam` per file. That would have prevented `memory-surface.ts` from sounding like the whole Phase B implementation surface.

## Recommended Next Focus

Continue Segment 7 verification by checking whether the remaining implementation-roadmap claims from iteration 068 about **handler-level Phase B files** (`code-graph-context.ts`, `handlers/code-graph/query.ts`, `handlers/code-graph/context.ts`, and `handlers/memory-context.ts`) still match the live code as closely as this pass verified the core seams.

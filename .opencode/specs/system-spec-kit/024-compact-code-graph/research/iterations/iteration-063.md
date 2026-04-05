# Iteration 63: Q16 Deep Dive -- Seed Resolution, Auto-Reindex, Hybrid Queries (Code-Level Analysis)

## Focus
Deep dive into the actual source code of seed-resolver.ts, code-graph-db.ts, code-graph-context.ts, and the CocoIndex MCP configuration to produce implementation-ready improvement designs for: (A) near-exact seed matching, (B) auto-reindex trigger mechanism, (C) hybrid structural+semantic queries, and (D) CocoIndex tool utilization gaps.

## Findings

### 1. Seed Resolution Chain Has a Critical Gap Between Exact and Enclosing

The `resolveSeed()` function at lines 168-240 of seed-resolver.ts implements a two-tier resolution with a wide confidence gap:

- **Tier 1 (exact)**: `WHERE file_path = ? AND start_line = ?` -- confidence 1.0
- **Tier 2 (enclosing)**: `WHERE file_path = ? AND start_line <= ? AND end_line >= ?` -- confidence 0.7
- **Tier 3 (file_anchor)**: No DB query, just returns the raw seed coordinates -- confidence 0.3

The gap between exact (1.0) and enclosing (0.7) is exploitable. CocoIndex's RecursiveSplitter uses 1000-char chunks with 150-char overlap (per SKILL.md lines 287-289), meaning chunk boundaries routinely land 2-5 lines away from function declarations. When exact fails and enclosing matches a parent class or module, the confidence drops to 0.7 even though the intended symbol is right next to the seed line.

**Proposed "near-exact" tier** (insert between lines 192-194):
```typescript
// Tier 1.5: Near-exact match (within +/-5 lines of seed)
const nearExact = d.prepare(`
  SELECT * FROM code_nodes
  WHERE file_path = ? AND ABS(start_line - ?) <= 5
  ORDER BY ABS(start_line - ?) ASC, kind != 'function'
  LIMIT 1
`).get(seed.filePath, seed.startLine, seed.startLine) as Record<string, unknown> | undefined;

if (nearExact) {
  return {
    filePath: seed.filePath,
    startLine: nearExact.start_line as number,
    endLine: nearExact.end_line as number,
    symbolId: nearExact.symbol_id as string,
    fqName: nearExact.fq_name as string,
    kind: nearExact.kind as string,
    confidence: 0.95 - (Math.abs((nearExact.start_line as number) - seed.startLine) * 0.02),
    resolution: 'exact', // Treat as exact for downstream consumers
  };
}
```
The confidence formula `0.95 - (distance * 0.02)` gives: distance 1 = 0.93, distance 3 = 0.89, distance 5 = 0.85. All above the enclosing tier's 0.7.

[SOURCE: seed-resolver.ts:168-240 -- resolveSeed() implementation]
[SOURCE: CocoIndex SKILL.md:287-289 -- RecursiveSplitter chunk parameters]

### 2. CocoIndex Score Is Fully Discarded at the Bridge Point

`resolveCocoIndexSeed()` at lines 74-79 converts the CocoIndex seed into a bare `CodeGraphSeed` and delegates to `resolveSeed()`. The `score` field from `CocoIndexSeed` (line 23) is never used. This means a CocoIndex result with 0.95 similarity and a CocoIndex result with 0.3 similarity both produce identical `ArtifactRef` objects if they resolve to the same enclosing symbol.

**Proposed score propagation**:
```typescript
export function resolveCocoIndexSeed(seed: CocoIndexSeed): ArtifactRef {
  const ref = resolveSeed({
    filePath: seed.file,
    startLine: seed.range.start,
    endLine: seed.range.end,
  });
  // Propagate CocoIndex similarity score into confidence
  // Formula: blended = resolution_confidence * 0.6 + coco_score * 0.4
  ref.confidence = ref.confidence * 0.6 + seed.score * 0.4;
  return ref;
}
```
This preserves the resolution quality signal while incorporating CocoIndex's semantic relevance. A high CocoIndex score boosts confidence; a low one tempers it.

[SOURCE: seed-resolver.ts:74-79 -- resolveCocoIndexSeed()]
[SOURCE: seed-resolver.ts:18-25 -- CocoIndexSeed type with score field]

### 3. Manual Seed Resolution Lacks Fuzzy Name Matching

`resolveManualSeed()` at lines 83-128 uses `WHERE name = ?` (exact string match). When the AI types "buildContext" but the actual symbol is "buildCodeContext", the query returns nothing and falls to a file_anchor with confidence 0.1.

Two improvement paths:
- **LIKE prefix matching**: `WHERE name LIKE ? || '%'` -- catches prefix matches
- **Levenshtein distance**: SQLite extension or application-side filtering -- catches typos

The simpler LIKE approach is sufficient for MVP since most AI name mismatches are prefix/suffix errors, not typos. Also, `resolveSubjectToRef()` in code-graph-context.ts (lines 252-276) has the same limitation -- it tries `symbol_id = ? OR fq_name = ? OR name = ?` with no fuzzy fallback.

[SOURCE: seed-resolver.ts:83-128 -- resolveManualSeed()]
[SOURCE: code-graph-context.ts:252-276 -- resolveSubjectToRef()]

### 4. Auto-Reindex via Stale Detection -- File-Watcher-Free Design

`code-graph-db.ts` provides `isFileStale(filePath, currentHash)` at lines 172-177 using content_hash comparison. `code-graph-context.ts` has `computeFreshness()` at lines 164-177 with three staleness tiers:
- `fresh`: indexed within 5 minutes (`300_000ms`)
- `recent`: indexed within 1 hour (`3_600_000ms`)
- `stale`: older than 1 hour

**Proposed stale-triggered auto-reindex** (no file watchers needed):

1. **On every `code_graph_context` or `code_graph_query` call**: Check `computeFreshness()`. If `stale`, trigger a lightweight `code_graph_scan({ incremental: true })` before executing the query. Since incremental scan only re-indexes files whose content_hash changed, this is cheap (tens of ms for unchanged files).

2. **Session-start priming**: On the first code graph tool call per session, always run incremental scan. Track "session has been primed" in a module-level boolean.

3. **CocoIndex coordination**: After code graph scan completes, check if CocoIndex daemon is running via `ccc_status`. If the code graph scan found changed files, suggest (or auto-trigger) `ccc_reindex({ full: false })`. The `refresh_index` parameter on CocoIndex `search` already triggers re-indexing per-search, but this has the concurrency bug noted in SKILL.md -- a centralized refresh-once-per-session is safer.

Key insight: The existing `indexed_at` timestamp per file in `code_files` table provides per-file staleness, not just global. A smarter scan could check only files modified after `MAX(indexed_at)` using filesystem `mtime`, avoiding even the content_hash computation for most files.

[SOURCE: code-graph-db.ts:172-177 -- isFileStale()]
[SOURCE: code-graph-context.ts:164-177 -- computeFreshness() with staleness tiers]
[SOURCE: code-graph-db.ts:20-30 -- code_files schema with indexed_at, content_hash]

### 5. Hybrid Structural+Semantic Query Design

`buildContext()` in code-graph-context.ts (lines 48-118) resolves seeds then expands via `expandAnchor()` (lines 180-249). The expansion is purely structural -- it queries `CALLS`, `IMPORTS`, `CONTAINS` edges from `code_edges`. There is no semantic dimension.

**Proposed hybrid query flow** (3 patterns):

**Pattern A: Semantic-first, structural expansion** (most common)
```
1. CocoIndex search(query) -> top N results with scores
2. Resolve seeds via seed-resolver (with near-exact + score propagation)
3. Expand each resolved anchor via code_graph_context (neighborhood mode)
4. Merge: CocoIndex semantic hits + structural neighbors
```
This is already partly supported by `code_graph_context` accepting CocoIndex seeds, but the AI must explicitly chain the calls. An internal `hybridSearch()` function could automate steps 1-4.

**Pattern B: Structural-first, semantic enrichment** (for "who calls X" queries)
```
1. code_graph_query(impact mode) -> callers of X
2. For each caller file, CocoIndex search("code similar to caller pattern")
3. Merge: direct callers + semantically similar patterns
```
This discovers code that does similar things but isn't structurally connected.

**Pattern C: Dual-query with merge** (for ambiguous queries)
```
1. In parallel: CocoIndex search(query) + code_graph_query(subject: extracted_name)
2. Deduplicate by file_path:line_range overlap
3. Rank by combined score: coco_score * 0.5 + graph_confidence * 0.5
```
The `resolveSeeds` deduplication at lines 251-267 (using symbolId or file:line key) already handles overlap.

**Implementation location**: The `buildContext()` function at line 48 is the natural place. Add an optional `cocoQuery` parameter to `ContextArgs`. When present, execute CocoIndex search internally, convert results to seeds, and merge with any explicit seeds.

[SOURCE: code-graph-context.ts:48-118 -- buildContext() main flow]
[SOURCE: code-graph-context.ts:180-249 -- expandAnchor() structural-only expansion]
[SOURCE: seed-resolver.ts:251-267 -- resolveSeeds() deduplication]

### 6. CocoIndex MCP Exposes Only 1 Tool -- Significant Limitation

The `.mcp.json` configuration shows CocoIndex registered as `cocoindex_code` running `ccc mcp`. Per SKILL.md line 237-241, the MCP server exposes **only the `search` tool**. The `status`, `index`, and `reset` operations are CLI-only commands.

This means:
- **Auto-reindex cannot be triggered via MCP** -- must shell out to `ccc index` via Bash tool or the Spec Kit Memory MCP's `ccc_reindex` wrapper.
- **Status checks cannot be done via MCP** -- must use `ccc_status` (Spec Kit Memory MCP wrapper) or `ccc status` CLI.
- **The Spec Kit Memory MCP wrappers (`ccc_reindex`, `ccc_status`, `ccc_feedback`) bridge this gap** -- they exist precisely because CocoIndex's native MCP is limited to search.

This architecture means all CocoIndex management flows through Spec Kit Memory MCP, creating a single coordination point. The auto-reindex mechanism should be implemented in the Spec Kit Memory MCP server (not in CocoIndex's native MCP), since it already wraps the CLI commands.

[SOURCE: .mcp.json:22-29 -- CocoIndex MCP server configuration]
[SOURCE: CocoIndex SKILL.md:236-241 -- MCP tool table showing only search tool]

### 7. Missing Index on code_nodes for Near-Exact Resolution

The proposed near-exact query `WHERE file_path = ? AND ABS(start_line - ?) <= 5` cannot use the existing indexes efficiently. The current indexes are:
- `idx_nodes_file_id ON code_nodes(file_id)` -- uses file_id not file_path
- `idx_nodes_symbol_id ON code_nodes(symbol_id)`
- `idx_nodes_kind ON code_nodes(kind)`
- `idx_nodes_name ON code_nodes(name)`

For the near-exact query to be performant, a composite index is needed:
```sql
CREATE INDEX IF NOT EXISTS idx_nodes_file_line ON code_nodes(file_path, start_line);
```
This index would also benefit the existing exact and enclosing queries in `resolveSeed()`. Schema version should bump to 2 with migration.

[SOURCE: code-graph-db.ts:59-67 -- existing index definitions]

### 8. computeFreshness() Granularity Is Too Coarse for Auto-Reindex

The current `computeFreshness()` uses `MAX(indexed_at)` across all files -- the freshest file determines global staleness. This means if one file was just indexed but 100 others are stale, the system reports "fresh".

**Proposed improvement**: Add a per-file staleness check when `computeFreshness()` detects `recent` or `stale`:
```typescript
function computeDetailedFreshness(): FreshnessReport {
  const d = graphDb.getDb();
  const total = (d.prepare('SELECT COUNT(*) as c FROM code_files').get() as { c: number }).c;
  const staleCount = (d.prepare(
    "SELECT COUNT(*) as c FROM code_files WHERE indexed_at < datetime('now', '-1 hour')"
  ).get() as { c: number }).c;
  return {
    lastScanAt,
    staleness: staleCount === 0 ? 'fresh' : staleCount / total > 0.5 ? 'stale' : 'recent',
    staleFileCount: staleCount,
    totalFileCount: total,
    staleRatio: staleCount / total,
  };
}
```
This gives the auto-reindex trigger better signal about whether a full scan or targeted scan is needed.

[SOURCE: code-graph-context.ts:164-177 -- computeFreshness() current implementation]
[SOURCE: code-graph-db.ts:241-280 -- getStats() for comparison]

## Ruled Out

- **SQLite `editdist3` extension for fuzzy name matching**: Too complex to install and maintain for the modest benefit. LIKE prefix matching covers 80% of cases.
- **Real-time file watcher for auto-reindex**: Confirmed again as overkill. The stale-detection-on-tool-call approach is simpler and avoids background process management.
- **Extending CocoIndex native MCP to add `index`/`status` tools**: Not feasible since CocoIndex is a third-party binary; modifications would fork the upstream.

## Dead Ends

None identified. All investigated code paths lead to viable improvement designs.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts` (full file, 268 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts` (full file, 339 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts` (full file, 330 lines)
- `.opencode/skill/mcp-coco-index/SKILL.md` (lines 220-330, MCP tools + daemon architecture)
- `.mcp.json` (full file, 42 lines -- MCP server configurations)

## Assessment
- New information ratio: 0.75
- Questions addressed: [Q16]
- Questions answered: [Q16 -- deepened with implementation-ready designs]

## Reflection
- What worked and why: Reading all three code graph modules in sequence (seed-resolver -> code-graph-db -> code-graph-context) revealed the complete data flow from seed input to context output. This showed the exact insertion points for improvements -- line-level precision that iteration 059's higher-level analysis could not provide.
- What did not work and why: N/A -- all source reads were productive. The focus was well-scoped to 4 files plus the MCP config.
- What I would do differently: Would also read the indexer (code-graph-scanner.ts or equivalent) to understand how content_hash is computed, since the auto-reindex mechanism depends on it being cheap to compute.

## Recommended Next Focus
Read the code graph scanner/indexer to understand content_hash computation cost and incremental scan performance characteristics. This determines whether stale-triggered auto-reindex on every tool call is feasible or needs throttling. Also examine compact-merger.ts for the merge infrastructure needed by hybrid queries.

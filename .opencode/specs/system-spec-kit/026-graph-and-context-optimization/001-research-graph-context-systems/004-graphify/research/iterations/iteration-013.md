# Iteration 13: Incremental Indexing and Invalidation Gaps in Public

## Focus
This iteration answers Q16 by comparing graphify's two-layer invalidation pattern against Public's current incremental indexing reality. The point is to find where Public already exceeds graphify, and where graphify still adds value as an orchestration idea rather than a direct implementation transplant.

## Findings

### Finding 41
Public already implements a richer incremental-index path than graphify's simple mtime plus cache split. `incremental-index.ts` stores metadata and content hashes, checks mtime first, and still falls back to content-hash mismatch and pending/failed embedding recovery even when mtimes match. In other words, the core "two-layer invalidation" insight is already present inside Public's semantic indexing layer. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:111-145; .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:152-191]

### Finding 42
What Public does not yet have is graphify's modality-aware rebuild policy at the architecture level. The current incremental logic is per-index and file-oriented; it does not by itself decide when a code-only change should stay structural versus when a non-code artifact should trigger broader semantic refresh paths. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:152-191]

### Finding 43
The existing code-graph handlers already assume inline readiness repair and seed normalization, which means Public can add a shared dirty-set or rebuild-policy layer without replacing the handlers themselves. The missing value is orchestration alignment, not a new low-level graph query engine. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:95-104; .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:125-133]

### Finding 44
Public should therefore treat graphify's invalidation lesson as a coordination pattern: unify semantic indexing, structural graph readiness, and modality detection under one rebuild policy so code-only edits stay cheap while non-code changes trigger the heavier paths intentionally. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:152-191; .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:95-104; .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:125-133]

## Cross-Phase Overlap Handling
- This iteration did not reopen graphify's own cache implementation because that was already closed in wave 1.
- It stayed on Public's current storage and handler paths to isolate the net-new translation work.

## Exhausted / Ruled-Out Directions
- I looked for evidence that Public lacks hash-aware invalidation and ruled that out. The current incremental index already stores hashes and checks them alongside mtime and embedding state. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:111-145; .opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:172-186]

## Final Verdict on Q16
Public does not need graphify's low-level invalidation code. It already has the important mtime plus hash behavior. The gap is higher-level orchestration: deciding when structural graph readiness, semantic indexing, and non-code artifact changes should trigger different rebuild paths under one consistent policy.

## Tools Used
- `sed -n`
- `rg -n`
- `nl -ba`

## Sources Queried
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:111-145`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:152-191`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:172-186`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:95-104`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:125-133`

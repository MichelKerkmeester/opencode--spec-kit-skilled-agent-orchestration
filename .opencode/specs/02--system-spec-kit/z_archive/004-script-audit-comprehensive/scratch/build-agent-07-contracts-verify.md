status | confidence | validated_count | confirmed_count
complete | 0.94 | 3 | 3

top_confirmed: C07-001,C07-002,C07-003

C07-001 (High): MCP tool input schemas are not enforced at runtime dispatch.
- Evidence: `mcp_server/context-server.ts:115` only runs `validateInputLengths(args)` before dispatch.
- Evidence: `mcp_server/context-server.ts:139` dispatches raw `args` with no schema check.
- Evidence: `mcp_server/tools/types.ts:20` returns unchecked cast in `parseArgs<T>()`.

C07-002 (High): Canonical `IVectorStore.search` contract in shared types diverges from runtime class contract.
- Evidence (canonical): `shared/types.ts:244` declares `search(embedding: number[], options?: SearchOptions)`.
- Evidence (runtime class): `mcp_server/lib/interfaces/vector-store.ts:16` declares `search(_embedding, _topK, _options?)`.

C07-003 (High): Canonical `IVectorStore` id/lifecycle contracts diverge from runtime adapter signatures.
- Evidence (canonical): `shared/types.ts:245` allows `upsert(id: number | string, ...)`.
- Evidence (runtime adapter): `mcp_server/lib/search/vector-index.ts:391` exposes `upsert(id: string, ...)`.
- Evidence (canonical): `shared/types.ts:247` and `shared/types.ts:251` define `get(id: number | string)` and `close(): void`.
- Evidence (runtime adapter): `mcp_server/lib/search/vector-index.ts:393` uses `get(id: number)` and `mcp_server/lib/search/vector-index.ts:397` uses `close(): Promise<void>`.

artifact: /Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.opencode/specs/02--system-spec-kit/z_archive/004-script-audit-comprehensive/scratch/build-agent-07-contracts-verify.md

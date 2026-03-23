1) **Feature #1: Workspace scanning and indexing (`memory_index_scan`)**

- **Catalog entry:** [01-workspace-scanning-and-indexing-memoryindexscan.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md:1)
- **Prior audit reference:** [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/004-maintenance/implementation-summary.md:42)

**File verification results**
- I checked every `mcp_server/...` reference in this entry.
- **Result:** **165/165 exist** (catalog lines **40-130** and **150-223** in the feature file).

**Function verification**
- Tool contract present: [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:512)
- Handler exists with signature: `handleMemoryIndexScan(args: ScanArgs): Promise<MCPResponse>` at [memory-index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:147)
- Dispatch path exists: [lifecycle-tools.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:51)
- Incremental bucket logic exists: [incremental-index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts:215)

**Flag/defaults check**
- Handler defaults match docs:
  - `force = false`, `includeConstitutional = true`, `includeSpecDocs = true`, `incremental = true` at [memory-index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:150)
- Tool schema defaults match docs at [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:514)
- Cooldown + E429 behavior present:
  - `INDEX_SCAN_COOLDOWN = 60000` at [core/config.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/config.ts:95)
  - E429 response at [memory-index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:177)
- `BATCH_SIZE` default is env-backed with fallback `5` at [core/config.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/config.ts:85)
- Debug flag present: `SPECKIT_DEBUG_INDEX_SCAN === 'true'` at [memory-index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:597)

**Unreferenced files implementing feature (not listed in catalog)**
- Direct runtime dependency omitted (still true from prior audit):
  - [memory-index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:19) imports [history.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:306)
- Tool dispatch chain omitted:
  - [tools/index.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:25)
  - [tools/lifecycle-tools.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:51)
  - [tools/types.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:185)
- Feature-tagged but unlisted:
  - [memory-ingest.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:30)
  - [index-refresh.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/index-refresh.ts:4) (deprecated note at line 7)

**Behavioral accuracy**
- 3-source discovery, canonical dedup, 4-bucket incremental, stale deletion, post-success mtime update, and post-mutation cache invalidation all match code.
- **Verdict:** **PARTIAL** (behavior/signatures/defaults are accurate; catalog source-file coverage is incomplete).

---

2) **Feature #2: Startup runtime compatibility guards**

- **Catalog entry:** [02-startup-runtime-compatibility-guards.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/04--maintenance/02-startup-runtime-compatibility-guards.md:1)

**File verification results**
- Checked every `mcp_server/...` reference.
- **Result:** **6/6 exist** (catalog lines **32-34** and **40-42**).

**Function verification**
- `detectRuntimeMismatch(marker, runtime?)` exists at [startup-checks.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:41)
- `detectNodeVersionMismatch(): void` exists at [startup-checks.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:81)
- `checkSqliteVersion(db): void` exists at [startup-checks.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:138)
- Wired into startup paths:
  - [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:60), call sites at lines 740 and 881
  - [cli.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/cli.ts:23), call at line 481

**Flag/defaults check**
- No configurable feature-flag defaults documented in catalog for this feature.
- Behavioral defaults align:
  - marker auto-created when missing at [startup-checks.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:112)
  - SQLite minimum 3.35.0 guard at [startup-checks.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:149)

**Unreferenced files found**
- None found for implementation path.

**Behavioral accuracy**
- Non-blocking warning behavior matches: mismatch and SQLite failures log warnings, not startup blockers.
- **Verdict:** **MATCH**

---

| # | Feature | Files OK? | Functions OK? | Flags OK? | Unreferenced? | Verdict |
|---|---|---|---|---|---|---|
| 1 | Workspace scanning and indexing (`memory_index_scan`) | Yes (165/165) | Yes | Yes | Yes (6) | PARTIAL |
| 2 | Startup runtime compatibility guards | Yes (6/6) | Yes | Yes (behavioral defaults) | No | MATCH |
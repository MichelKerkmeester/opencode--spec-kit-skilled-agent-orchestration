● skill(sk-code--opencode)

I’m pulling the standards context and the target MCP surface together first, then I’ll synthesize the audit into the requested findings report.

● Create audit plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/03fc0a5f-61c7-4c81-8c27-9a450a5b9da5/plan.md'
  │ <<'EOF'
  │ # MCP API surface audit plan…
  └ 14 lines...

● Explore Audit MCP surface
  │ Check checkpoints handler end (shell)
  │   │ tail -80 "/Users/michelkerkmeester/MEGA/Development/Opencode
  │   │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts"
  │   └ 80 lines...
  └ Create audit output file (shell)
      │ cat > /tmp/audit_summary.txt << 'EOF'
      │ # TypeScript Code Audit Summary
      │
      │ ## Files Audited
      │ 1. /.opencode/skill/system-spec-kit/mcp_server/api/*.ts (eval, index, indexing, providers, …
      └ Permission denied and could not request permission from user

I’ve got an initial agent pass; now I’m spot-checking the actual files and line ranges so the final audit is grounded in direct citations, not just summary claims.

● Count audit file lines (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && wc -l
  │ .opencode/skill/sk-code--opencode/SKILL.md
  │ .opencode/skill/system-spec-kit/mcp_server/api/eval.ts
  │ .opencode/skill/system-spec-kit/mcp_server/api/index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/api/indexing.ts …
  └ 32 lines...

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/api/index.ts
  └ 55 lines read

● Read providers.ts
  │ .opencode/skill/system-spec-kit/mcp_server/api/providers.ts
  └ 13 lines read

● Read indexing.ts
  │ .opencode/skill/system-spec-kit/mcp_server/api/indexing.ts
  └ 62 lines read

● Read causal-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts
  └ 36 lines read

● Read eval.ts
  │ .opencode/skill/system-spec-kit/mcp_server/api/eval.ts
  └ 30 lines read

● Read search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/api/search.ts
  └ 20 lines read

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/index.ts
  └ 35 lines read

● Read lifecycle-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts
  └ 66 lines read

● Read memory-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts
  └ 57 lines read

● Read checkpoint-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts
  └ 37 lines read

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/core/index.ts
  └ 67 lines read

● Read storage.ts
  │ .opencode/skill/system-spec-kit/mcp_server/api/storage.ts
  └ 9 lines read

● Read context-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts
  └ 18 lines read

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/types.ts
  └ L221:335 (115 lines read)

● Read db-state.ts
  │ .opencode/skill/system-spec-kit/mcp_server/core/db-state.ts
  └ L221:325 (105 lines read)

● Read SKILL.md
  │ .opencode/skill/sk-code--opencode/SKILL.md
  └ L250:420 (171 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/types.ts
  └ L1:220 (220 lines read)

● Read db-state.ts
  │ .opencode/skill/system-spec-kit/mcp_server/core/db-state.ts
  └ L1:220 (220 lines read)

● Read config.ts
  │ .opencode/skill/system-spec-kit/mcp_server/core/config.ts
  └ 153 lines read

I’ve found a couple of real nuances beyond the obvious strengths: there’s solid architectural separation overall, but also a small type-duplication seam and a few namespace-style exports that make the public surface broader than necessary.

● Search (grep)
  │ "catch \(|catch \{|console\.error|throw new Error" in **/*.{ts,tsx}
  │ (.opencode/skill/system-spec-kit/mcp_server/core)
  └ 15 lines found

● Search (grep)
  │ "process\.env\.[A-Z0-9_]+" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "MemoryIndexScanArgs|ScanArgs|parseValidatedArgs\(|parseArgs<|validateToolArgs\(" in
  │ **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 78 lines found

● Search (grep)
  │ "export \* as" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ 2 lines found

● Search env usage in audited files (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && rg -n
  │ "process\.env\.[A-Z0-9_]+" .opencode/skill/system-spec-kit/mcp_server/api
  │ .opencode/skill/system-spec-kit/mcp_server/tools .opencode/skill/system-spec-kit/mcp_server/core
  └ 10 lines...

● Search (grep)
  │ "parseValidatedArgs\(" in **/*.{ts,tsx} (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

✗ Memory stored api architecture
  └ The mcp_server/api layer is a stable public re-export surface; consumers should …

✗ Memory stored tool patterns
  └ Tool dispatch modules use TOOL_NAMES plus handleTool(name,args) and validate inp…

Overall: **no critical standards violations**. The MCP surface is mostly well-structured and aligned with `sk-code--opencode`, with a few low/medium-severity cleanup opportunities.

## Findings

- **Clean `api/` vs `tools/` boundary.** `api/` is a curated public surface with explicit `ARCH-1` comments, while `tools/` owns protocol dispatch and hands validated args to handlers. The only slight seam is `api/indexing.ts` importing a handler directly for orchestration. `.opencode/skill/system-spec-kit/mcp_server/api/index.ts:4-6`, `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:4-15`, `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:15-35`

- **Tool schema pattern is consistent, but not fully DRY.** Dispatchers uniformly do `validateToolArgs(...)` then `parseArgs<T>(...)`, which is good. But `tools/types.ts` already defines `parseValidatedArgs()` and none of these dispatchers use it; `shared_memory_enable` also falls back to `Record<string, unknown>` instead of a named args type. `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:17-34`, `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:42-55`, `.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:48-64`

- **Type exports are mostly centralized, but one contract is duplicated.** `tools/types.ts` centralizes tool arg interfaces, yet `api/indexing.ts` re-declares `MemoryIndexScanArgs` instead of reusing `ScanArgs`, which weakens the “single source of truth” standard. `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:179-186`, `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:17-24`, `.opencode/skill/sk-code--opencode/SKILL.md:308-310`, `.opencode/skill/sk-code--opencode/SKILL.md:372-375`

- **Error propagation is mostly correct, with two deliberate swallow/fallback paths.** `initializeIndexingRuntime()` and `checkDatabaseUpdated()` fail loudly on hard errors, but `getLastScanTime()` and `setLastScanTime()` only log and return fallback behavior, which can mask config-table persistence problems. `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:37-40`, `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:117-142`, `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:228-263`, `.opencode/skill/sk-code--opencode/SKILL.md:367-370`

- **Configuration is centralized, but not perfectly.** `core/config.ts` is clearly the main config source, but `core/db-state.ts` still reads `process.env.SPECKIT_GRAPH_UNIFIED` directly, so env access is slightly scattered. `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:42-56`, `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:63-149`, `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:182-186`

- **Barrel exports are clean overall, with one surface-broadening choice.** `api/index.ts` and `core/index.ts` use explicit grouped exports, but `api/providers.ts` and `api/search.ts` expose whole namespaces via `export * as`, which is less selective than the rest of the public surface. `.opencode/skill/system-spec-kit/mcp_server/api/index.ts:8-55`, `.opencode/skill/system-spec-kit/mcp_server/core/index.ts:5-67`, `.opencode/skill/system-spec-kit/mcp_server/api/providers.ts:7-13`, `.opencode/skill/system-spec-kit/mcp_server/api/search.ts:8-20`


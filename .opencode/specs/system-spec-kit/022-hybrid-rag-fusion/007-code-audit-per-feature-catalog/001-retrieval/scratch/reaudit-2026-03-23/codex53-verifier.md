## Feature 01: Unified context retrieval (memory_context)

### File Verification
| Source File (from catalog) | Exists? | Correct Role? |
|----------------------------|---------|---------------|
| All catalog-listed files in section 3 (241/241) | YES | YES (core role spot-check passed) |
| `mcp_server/handlers/memory-context.ts` | YES | YES |
| `mcp_server/lib/search/folder-discovery.ts` | YES | YES |
| `mcp_server/lib/search/session-transition.ts` | YES | YES |

### Function/Export Verification
| Function/Export | Found? | Signature Match? |
|----------------|--------|-----------------|
| `handleMemoryContext(args: ContextArgs): Promise<MCPResponse>` | YES (`handlers/memory-context.ts:883`) | YES |
| `enforceTokenBudget(result: ContextResult, budgetTokens: number)` | YES (`handlers/memory-context.ts:222`) | YES |
| `INTENT_TO_MODE` | YES (`handlers/memory-context.ts:530`) | YES |

### Flag Defaults
| Flag | Catalog Says | Code Says | Match? |
|------|-------------|-----------|--------|
| `SPECKIT_FOLDER_DISCOVERY` | Enabled gate | Default ON via `isFeatureEnabled` (`lib/search/search-flags.ts:67-69`) | YES |
| `SPECKIT_PRESSURE_POLICY` | Policy gate for pressure override | Enabled unless explicitly `false` (`handlers/memory-context.ts:977`) | YES |
| `SPECKIT_ROLLOUT_PERCENT` | Rollout gate applied | Default `100` (`lib/cognitive/rollout-policy.ts:5,11-14`) | YES |

### Unreferenced Files
Files in the MCP server that implement retrieval features but are NOT listed in the catalog:
- None found

### Verdict: MATCH


## Feature 02: Semantic and lexical search (memory_search)

### File Verification
| Source File (from catalog) | Exists? | Correct Role? |
|----------------------------|---------|---------------|
| All catalog-listed files in section 3 (214/214) | YES | YES (core role spot-check passed) |
| `mcp_server/handlers/memory-search.ts` | YES | YES |
| `mcp_server/lib/search/pipeline/orchestrator.ts` | YES | YES |

### Function/Export Verification
| Function/Export | Found? | Signature Match? |
|----------------|--------|-----------------|
| `interface SearchArgs` | YES (`handlers/memory-search.ts:168`) | YES |
| `handleMemorySearch(args: SearchArgs): Promise<MCPResponse>` | YES (`handlers/memory-search.ts:396`) | YES |
| `executePipeline(config: PipelineConfig)` runtime path | YES (`handlers/memory-search.ts:672`) | YES |

### Flag Defaults
| Flag | Catalog Says | Code Says | Match? |
|------|-------------|-----------|--------|
| `SPECKIT_RESPONSE_TRACE` | Trace enabled behavior | Trace ON only when `true` (`handlers/memory-search.ts:438`) | YES |
| `SPECKIT_GRAPH_WALK_ROLLOUT` | `off/trace_only/bounded_runtime` ladder | Implemented (`lib/search/search-flags.ts:146-159`) | YES |

### Unreferenced Files
Files in the MCP server that implement retrieval features but are NOT listed in the catalog:
- `mcp_server/lib/telemetry/retrieval-telemetry.ts` (used by `handlers/memory-search.ts:19`)
- `mcp_server/lib/search/chunk-reassembly.ts` (used by `handlers/memory-search.ts:23`)
- `mcp_server/lib/search/search-utils.ts` (used by `handlers/memory-search.ts:25`)
- `mcp_server/lib/telemetry/eval-channel-tracking.ts` (used by `handlers/memory-search.ts:35`)
- `mcp_server/lib/cognitive/adaptive-ranking.ts` (used by `handlers/memory-search.ts:63`)
- `mcp_server/lib/governance/scope-governance.ts` (used by `handlers/memory-search.ts:64`)
- `mcp_server/lib/search/session-transition.ts` (used by `handlers/memory-search.ts:65`)
- `mcp_server/lib/response/profile-formatters.ts` (used by `handlers/memory-search.ts:71`)
- `mcp_server/lib/search/progressive-disclosure.ts` (used by `handlers/memory-search.ts:75`)
- `mcp_server/lib/search/session-state.ts` (used by `handlers/memory-search.ts:82`)
- `mcp_server/lib/feedback/feedback-ledger.ts` (used by `handlers/memory-search.ts:44`)

### Verdict: PARTIAL


## Feature 03: Trigger phrase matching (memory_match_triggers)

### File Verification
| Source File (from catalog) | Exists? | Correct Role? |
|----------------------------|---------|---------------|
| All catalog-listed files in section 3 (128/128) | YES | YES (core role spot-check passed) |
| `mcp_server/handlers/memory-triggers.ts` | YES | YES |
| `mcp_server/lib/parsing/trigger-matcher.ts` | YES | YES |

### Function/Export Verification
| Function/Export | Found? | Signature Match? |
|----------------|--------|-----------------|
| `interface TriggerArgs` | YES (`handlers/memory-triggers.ts:100`) | YES |
| `handleMemoryMatchTriggers(args: TriggerArgs): Promise<MCPResponse>` | YES (`handlers/memory-triggers.ts:175`) | YES |
| `TURN_DECAY_RATE = 0.98` and `Math.pow(TURN_DECAY_RATE, turnNumber - 1)` | YES (`handlers/memory-triggers.ts:113`, `:324`) | YES |
| `getTieredContent(...)` HOT/WARM/COLD behavior | YES (`handlers/memory-triggers.ts:147-159`) | YES |

### Flag Defaults
| Flag | Catalog Says | Code Says | Match? |
|------|-------------|-----------|--------|
| N/A | N/A | N/A | N/A |

### Unreferenced Files
Files in the MCP server that implement retrieval features but are NOT listed in the catalog:
- None found

### Verdict: MATCH


## Feature 04: Hybrid search pipeline

### File Verification
| Source File (from catalog) | Exists? | Correct Role? |
|----------------------------|---------|---------------|
| All catalog-listed files in section 3 (127/127) | YES | YES (core role spot-check passed) |
| `mcp_server/lib/search/hybrid-search.ts` | YES | YES |
| `mcp_server/lib/search/graph-search-fn.ts` | YES | YES |

### Function/Export Verification
| Function/Export | Found? | Signature Match? |
|----------------|--------|-----------------|
| `searchWithFallback(query, embedding, options)` | YES (`lib/search/hybrid-search.ts:1175`) | YES |
| `checkDegradation(results)` | YES (`lib/search/hybrid-search.ts:1479`) | YES |
| `searchWithFallbackTiered(...)` | YES (`lib/search/hybrid-search.ts:1549`) | YES |
| `hybridAdaptiveFuse(...)` | YES (`shared/algorithms/adaptive-fusion.ts:344`) | YES |

### Flag Defaults
| Flag | Catalog Says | Code Says | Match? |
|------|-------------|-----------|--------|
| `ENABLE_BM25` | default ON | `process.env.ENABLE_BM25 !== 'false'` (`lib/search/bm25-index.ts:56-57`) | YES |
| `SPECKIT_DEGREE_BOOST` | default ON | `isFeatureEnabled('SPECKIT_DEGREE_BOOST')` (`lib/search/search-flags.ts:199-201`) | YES |
| `SPECKIT_SEARCH_FALLBACK` | default ON | `isFeatureEnabled('SPECKIT_SEARCH_FALLBACK')` (`lib/search/search-flags.ts:59-61`) | YES |

### Unreferenced Files
Files in the MCP server that implement retrieval features but are NOT listed in the catalog:
- `mcp_server/handlers/memory-search.ts` (catalog text says runtime entrypoint at `04-...md:18`, but file not listed in section 3 table)

### Verdict: PARTIAL


## Feature 05: 4-stage pipeline architecture

### File Verification
| Source File (from catalog) | Exists? | Correct Role? |
|----------------------------|---------|---------------|
| All catalog-listed files in section 3 (174/174) | YES | YES (core role spot-check passed) |
| `mcp_server/lib/search/pipeline/orchestrator.ts` | YES | YES |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | YES | YES |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | YES | YES |
| `mcp_server/lib/search/pipeline/stage3-rerank.ts` | YES | YES |
| `mcp_server/lib/search/pipeline/stage4-filter.ts` | YES | YES |

### Function/Export Verification
| Function/Export | Found? | Signature Match? |
|----------------|--------|-----------------|
| `executeStage1(input: Stage1Input): Promise<Stage1Output>` | YES (`stage1-candidate-gen.ts:283`) | YES |
| `executeStage2(input: Stage2Input): Promise<Stage2Output>` | YES (`stage2-fusion.ts:566`) | YES |
| `executeStage3(input: Stage3Input): Promise<Stage3Output>` | YES (`stage3-rerank.ts:127`) | YES |
| `executeStage4(input: Stage4Input): Promise<Stage4Output>` | YES (`stage4-filter.ts:243`) | YES |
| `Stage4ReadonlyRow` | YES (`pipeline/types.ts:75`) | YES |
| `captureScoreSnapshot` / `verifyScoreInvariant` | YES (`pipeline/types.ts:380`, `:396`) | YES |

### Flag Defaults
| Flag | Catalog Says | Code Says | Match? |
|------|-------------|-----------|--------|
| `SPECKIT_CROSS_ENCODER` | optional stage 3 gate | default ON via `isFeatureEnabled` (`lib/search/search-flags.ts:48-53`) | YES |
| `SPECKIT_PIPELINE_V2` | not consumed at runtime | no runtime references found (`rg` result: none) | YES |

### Unreferenced Files
Files in the MCP server that implement retrieval features but are NOT listed in the catalog:
- `mcp_server/lib/search/pipeline/stage2b-enrichment.ts` (used by stage 2 at `stage2-fusion.ts:73,833`)
- `mcp_server/lib/search/pipeline/ranking-contract.ts` (used by stage 2/3 at `stage2-fusion.ts:77`, `stage3-rerank.ts:40`)

### Verdict: PARTIAL


## Feature 06: BM25 trigger phrase re-index gate

### File Verification
| Source File (from catalog) | Exists? | Correct Role? |
|----------------------------|---------|---------------|
| `mcp_server/lib/parsing/content-normalizer.ts` | YES | YES |
| `mcp_server/lib/search/bm25-index.ts` | YES | YES |
| `mcp_server/lib/search/sqlite-fts.ts` | YES | YES |
| `mcp_server/handlers/memory-crud-update.ts` | YES | YES |

### Function/Export Verification
| Function/Export | Found? | Signature Match? |
|----------------|--------|-----------------|
| BM25 gate condition `(title || triggerPhrases) && isBm25Enabled()` | YES (`handlers/memory-crud-update.ts:154`) | YES |
| `isBm25Enabled(): boolean` | YES (`lib/search/bm25-index.ts:56`) | YES |

### Flag Defaults
| Flag | Catalog Says | Code Says | Match? |
|------|-------------|-----------|--------|
| `ENABLE_BM25` | default ON | `process.env.ENABLE_BM25 !== 'false'` (`lib/search/bm25-index.ts:56-57`) | YES |

### Unreferenced Files
Files in the MCP server that implement retrieval features but are NOT listed in the catalog:
- None found

### Verdict: MATCH


## Feature 07: AST-level section retrieval tool

### File Verification
| Source File (from catalog) | Exists? | Correct Role? |
|----------------------------|---------|---------------|
| No files listed (planned/deferred) | YES (as documented) | YES |

### Function/Export Verification
| Function/Export | Found? | Signature Match? |
|----------------|--------|-----------------|
| `read_spec_section(filePath, heading)` | NO | N/A (catalog says deferred at `07-...md:18`) |

### Flag Defaults
| Flag | Catalog Says | Code Says | Match? |
|------|-------------|-----------|--------|
| N/A | N/A | N/A | N/A |

### Unreferenced Files
Files in the MCP server that implement retrieval features but are NOT listed in the catalog:
- None found

### Verdict: MATCH


## Feature 08: Quality-aware 3-tier search fallback

### File Verification
| Source File (from catalog) | Exists? | Correct Role? |
|----------------------------|---------|---------------|
| `mcp_server/lib/search/hybrid-search.ts` | YES | YES |
| `mcp_server/lib/search/pipeline/stage4-filter.ts` | YES | WRONG (see discrepancy below) |

### Function/Export Verification
| Function/Export | Found? | Signature Match? |
|----------------|--------|-----------------|
| `searchWithFallbackTiered(...)` | YES (`lib/search/hybrid-search.ts:1549`) | YES |
| `checkDegradation(results)` | YES (`lib/search/hybrid-search.ts:1479`) | YES |
| `_degradation` non-enumerable attach | YES (`lib/search/hybrid-search.ts:1564`, `:1598`, `:1623`) | YES |

### Flag Defaults
| Flag | Catalog Says | Code Says | Match? |
|------|-------------|-----------|--------|
| `SPECKIT_SEARCH_FALLBACK` | default true (graduated) | `isFeatureEnabled('SPECKIT_SEARCH_FALLBACK')` (`lib/search/search-flags.ts:59-61`) | YES |

### Unreferenced Files
Files in the MCP server that implement retrieval features but are NOT listed in the catalog:
- None found

### Verdict: PARTIAL
Discrepancy:
- Catalog assigns “quality check” role to `stage4-filter.ts` (`08-...md:29`), but degradation quality logic is in `hybrid-search.ts` (`checkDegradation` at `:1479`, tiered chain at `:1549`). `stage4-filter.ts` performs state/TRM/invariant logic (`stage4-filter.ts:256-318`), not fallback degradation checks.


## Feature 09: Tool-result extraction to working memory

### File Verification
| Source File (from catalog) | Exists? | Correct Role? |
|----------------------------|---------|---------------|
| `mcp_server/lib/cognitive/working-memory.ts` | YES | YES |
| `mcp_server/lib/storage/checkpoints.ts` | YES | YES |

### Function/Export Verification
| Function/Export | Found? | Signature Match? |
|----------------|--------|-----------------|
| `upsertExtractedEntry(input: ExtractedEntryInput): boolean` | YES (`working-memory.ts:424`) | YES |
| `batchUpdateScores(sessionId: string): number` | YES (`working-memory.ts:557`) | YES |
| Checkpoint working-memory snapshot/restore | YES (`checkpoints.ts:1141`, `:1506`) | YES |

### Flag Defaults
| Flag | Catalog Says | Code Says | Match? |
|------|-------------|-----------|--------|
| `SPECKIT_WORKING_MEMORY` | enabled unless disabled | `process.env.SPECKIT_WORKING_MEMORY !== 'false'` (`working-memory.ts:28`) | YES |
| `SPECKIT_EVENT_DECAY` | decay active by default | checked via `isFeatureEnabled` (`working-memory.ts:561`) | YES |

### Unreferenced Files
Files in the MCP server that implement retrieval features but are NOT listed in the catalog:
- `mcp_server/lib/extraction/extraction-adapter.ts` (`handleAfterTool` calls `upsertExtractedEntry` at `extraction-adapter.ts:266`)
- `mcp_server/context-server.ts` (adapter wiring at `context-server.ts:95`, `:930`)

### Verdict: PARTIAL


## Feature 10: Fast delegated search (memory_quick_search)

### File Verification
| Source File (from catalog) | Exists? | Correct Role? |
|----------------------------|---------|---------------|
| `mcp_server/tool-schemas.ts` | YES | YES |
| `mcp_server/schemas/tool-input-schemas.ts` | YES | YES |
| `mcp_server/tools/memory-tools.ts` | YES | YES |
| `mcp_server/handlers/memory-search.ts` | YES | YES |

### Function/Export Verification
| Function/Export | Found? | Signature Match? |
|----------------|--------|-----------------|
| `memoryQuickSearchSchema` | YES (`schemas/tool-input-schemas.ts:165`) | YES |
| `memory_quick_search` tool definition | YES (`tool-schemas.ts:185`) | YES |
| Delegation to `handleMemorySearch(quickArgs)` | YES (`tools/memory-tools.ts:47-64`) | YES |

### Flag Defaults
| Flag | Catalog Says | Code Says | Match? |
|------|-------------|-----------|--------|
| N/A | N/A | N/A | N/A |

### Unreferenced Files
Files in the MCP server that implement retrieval features but are NOT listed in the catalog:
- `mcp_server/tools/types.ts` (`SearchArgs` used by quick-search dispatch at `tools/memory-tools.ts:22,50`)
- `mcp_server/context-server.ts` (tool list/dispatch wiring at `context-server.ts:265-267`, `:273`)

### Verdict: PARTIAL


## Feature 11: Session recovery via /memory:continue

### File Verification
| Source File (from catalog) | Exists? | Correct Role? |
|----------------------------|---------|---------------|
| `.opencode/command/memory/continue.md` | YES | YES |
| `mcp_server/handlers/memory-context.ts` | YES | YES |
| `mcp_server/handlers/memory-search.ts` | YES | YES |
| `mcp_server/handlers/memory-crud-list.ts` | YES | YES |
| `mcp_server/lib/session/session-manager.ts` | YES | YES |

### Function/Export Verification
| Function/Export | Found? | Signature Match? |
|----------------|--------|-----------------|
| Resume defaults in `executeResumeStrategy(...)` | YES (`handlers/memory-context.ts:616-636`) | YES |
| Resume token budget `1200` | YES (`handlers/memory-context.ts:518-523`) | YES |
| `CONTINUE_SESSION.md` generation | YES (`lib/session/session-manager.ts:986-1117`) | YES |

### Flag Defaults
| Flag | Catalog Says | Code Says | Match? |
|------|-------------|-----------|--------|
| N/A | N/A | N/A | N/A |

### Unreferenced Files
Files in the MCP server that implement retrieval features but are NOT listed in the catalog:
- `mcp_server/handlers/memory-crud-stats.ts` (command declares shared `memory_stats` tool at `.opencode/command/memory/continue.md:4,21`; implementation at `memory-crud-stats.ts:31`)

### Verdict: PARTIAL


| # | Feature | Files OK? | Functions OK? | Flags OK? | Unreferenced? | Verdict |
|---|---------|-----------|---------------|-----------|---------------|---------|
| 1 | Unified context retrieval (memory_context) | YES | YES | YES | NO | MATCH |
| 2 | Semantic and lexical search (memory_search) | YES | YES | YES | YES | PARTIAL |
| 3 | Trigger phrase matching (memory_match_triggers) | YES | YES | N/A | NO | MATCH |
| 4 | Hybrid search pipeline | YES | YES | YES | YES | PARTIAL |
| 5 | 4-stage pipeline architecture | YES | YES | YES | YES | PARTIAL |
| 6 | BM25 trigger phrase re-index gate | YES | YES | YES | NO | MATCH |
| 7 | AST-level section retrieval tool | YES (none expected) | YES (planned deferred) | N/A | NO | MATCH |
| 8 | Quality-aware 3-tier search fallback | PARTIAL (role mapping issue) | YES | YES | NO | PARTIAL |
| 9 | Tool-result extraction to working memory | YES | YES | YES | YES | PARTIAL |
| 10 | Fast delegated search (memory_quick_search) | YES | YES | N/A | YES | PARTIAL |
| 11 | Session recovery via /memory:continue | YES | YES | N/A | YES | PARTIAL |

Exhaustive existence check status: all catalog-listed section-3 file references across all 11 features exist (0 missing).
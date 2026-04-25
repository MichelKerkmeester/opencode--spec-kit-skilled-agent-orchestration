# Iteration 4 - Verification Battery Seeds + Canonical-Symbol Queries

## Summary

Q5 is answered with a gold seed list of 28 canonical queries. The battery is intentionally biased toward symbols whose disappearance would show a broken scan scope: MCP tool descriptors and dispatch handlers, code-graph query/readiness internals, skill-advisor scoring lanes and daemon freshness, skill-graph query helpers, and exported API contracts. These queries are not meant to validate generic fixtures; they are meant to prove the canonical implementation files under `.opencode/skill/system-spec-kit/mcp_server/` remain indexed.

Key regression boundary: generic test fixtures may legitimately be absent when they live under excluded roots such as `node_modules`, `dist`, `vendor`, `external`, `z_future`, `z_archive`, or `mcp-coco-index/mcp_server`. The current code-graph scope excludes those segments via `EXCLUDED_FOR_CODE_GRAPH` and `getDefaultConfig().excludeGlobs`; it does not generally exclude all `tests/` or `fixtures/` folders. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:31-48`; `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:112-120`]

## Query Categories

### MCP Tool Handler Queries

| ID | Query string | Expected count | Expected top K symbols | Source tested |
|---|---:|---:|---|---|
| GQ-MCP-001 | `code_graph_query handler` | 3 | `handleCodeGraphQuery`, `codeGraphQuery`, `handleTool` | `tool-schemas.ts:570-588`; `code-graph-tools.ts:20-69`; `query.ts:1031-1036` |
| GQ-MCP-002 | `code_graph_scan handler` | 3 | `handleCodeGraphScan`, `codeGraphScan`, `handleTool` | `tool-schemas.ts:555-568`; `code-graph-tools.ts:20-63`; `scan.ts:127-186` |
| GQ-MCP-003 | `code_graph_status readiness handler` | 3 | `handleCodeGraphStatus`, `codeGraphStatus`, `buildReadinessBlock` | `tool-schemas.ts:590-594`; `status.ts:10-65` |
| GQ-MCP-004 | `code_graph_context seeds handler` | 4 | `handleCodeGraphContext`, `buildContext`, `resolveSeeds` | `tool-schemas.ts:596-634`; `context.ts:107-225`; `code-graph-context.ts:102-123` |
| GQ-MCP-005 | `detect_changes stale graph blocked handler` | 4 | `handleDetectChanges`, `readinessRequiresBlock`, `detectChanges` | `tool-schemas.ts:636-647`; `detect-changes.ts:94-106`; `detect-changes.ts:211-264` |
| GQ-MCP-006 | `advisor_recommend handler scorer fusion` | 4 | `advisorRecommendTool`, `handleAdvisorRecommend`, `scoreAdvisorPrompt` | `advisor-recommend.ts:7-27`; `advisor-recommend.ts:238-256`; `fusion.ts:237-245` |
| GQ-MCP-007 | `skill_graph_query queryType handler` | 5 | `handleSkillGraphQuery`, `skillGraphQuery`, `dependsOn` | `tool-schemas.ts:661-678`; `skill-graph-tools.ts:15-61`; `handlers/skill-graph/query.ts:44-147` |

### Cross-Module Function Queries

| ID | Query string | Expected count | Expected top K symbols | Source tested |
|---|---:|---:|---|---|
| GQ-XMOD-001 | `code graph readiness selective reindex threshold` | 4 | `ensureCodeGraphReady`, `detectState`, `SELECTIVE_REINDEX_THRESHOLD` | `ensure-ready.ts:47-52`; `ensure-ready.ts:102-187`; `ensure-ready.ts:290-387` |
| GQ-XMOD-002 | `structural indexer scan phase runner` | 4 | `indexFiles`, `buildIndexPhases`, `runPhases` | `structural-indexer.ts:1399-1508`; `structural-indexer.ts:1510-1535` |
| GQ-XMOD-003 | `code graph persistence mtime staging retry` | 4 | `persistIndexedFileResult`, `upsertFile`, `replaceNodes` | `ensure-ready.ts:227-248`; `code-graph-db.ts:281-355`; `code-graph-db.ts:380-424` |
| GQ-XMOD-004 | `skill advisor five lane fusion scoring` | 6 | `scoreAdvisorPrompt`, `buildLaneScores`, `scoreGraphCausalLane` | `fusion.ts:14-26`; `fusion.ts:139-158`; `fusion.ts:237-256` |
| GQ-XMOD-005 | `skill graph generation publish after startup scan` | 4 | `runSkillGraphIndex`, `indexSkillMetadata`, `publishSkillGraphGeneration` | `context-server.ts:1467-1490`; `skill-graph-db.ts:463-642`; `freshness/generation.ts:110-133` |
| GQ-XMOD-006 | `advisor daemon lease watcher lifecycle` | 5 | `startSkillGraphDaemon`, `acquireSkillGraphLease`, `createSkillGraphWatcher` | `daemon/lifecycle.ts:28-70`; `daemon/lease.ts:110-180` |
| GQ-XMOD-007 | `memory retrieval stage2 single scoring point` | 5 | `applyValidationSignalScoring`, `loadPersistedLearnedStage2Model`, `sortDeterministicRows` | `stage2-fusion.ts:21-44`; `stage2-fusion.ts:169-218`; `stage2-fusion.ts:220-259` |

### Exported Type / Class Queries

| ID | Query string | Expected count | Expected top K symbols | Source tested |
|---|---:|---:|---|---|
| GQ-TYPE-001 | `CodeNode CodeEdge ParseResult indexer types` | 4 | `CodeNode`, `CodeEdge`, `ParseResult` | `indexer-types.ts:31-79` |
| GQ-TYPE-002 | `QueryArgs code_graph_query operations` | 3 | `QueryArgs`, `EdgeType`, `SUPPORTED_EDGE_TYPES` | `query.ts:23-33`; `query.ts:35-56` |
| GQ-TYPE-003 | `ContextArgs ContextResult code_graph_context types` | 3 | `ContextArgs`, `ContextResult`, `QueryMode` | `code-graph-context.ts:19-54` |
| GQ-TYPE-004 | `SkillNode SkillEdge SkillGraphStats types` | 3 | `SkillNode`, `SkillEdge`, `SkillGraphStats` | `skill-graph-db.ts:18-68` |
| GQ-TYPE-005 | `AdvisorHookResult threshold config types` | 4 | `AdvisorHookResult`, `SkillAdvisorBriefOptions`, `ResolvedAdvisorThresholdConfig` | `skill-advisor-brief.ts:47-88`; `skill-advisor-brief.ts:108-150` |
| GQ-TYPE-006 | `DetectChangesResult AffectedSymbol status types` | 3 | `DetectChangesResult`, `AffectedSymbol`, `DetectChangesStatus` | `detect-changes.ts:21-50` |

### Regression-Detection Queries

| ID | Query string | Expected count | Expected top K symbols | Source tested |
|---|---:|---:|---|---|
| GQ-REG-001 | `default code graph indexer config include exclude globs` | 2 | `getDefaultConfig`, `includeGlobs`, `excludeGlobs` | `indexer-types.ts:112-120` |
| GQ-REG-002 | `index scope excludes code graph canonical roots` | 3 | `EXCLUDED_FOR_CODE_GRAPH`, `shouldIndexForCodeGraph`, `shouldExcludePath` | `index-scope.ts:31-48`; `structural-indexer.ts:1146-1158` |
| GQ-REG-003 | `MCP tool definitions include code graph tools` | 4 | `TOOL_DEFINITIONS`, `codeGraphQuery`, `codeGraphStatus` | `tool-schemas.ts:875-928` |
| GQ-REG-004 | `code_graph_query relationship operations calls imports blast_radius` | 5 | `QueryArgs`, `handleCodeGraphQuery`, `SUPPORTED_RELATIONSHIP_OPERATIONS` | `query.ts:23-56`; `query.ts:1097-1134`; `query.ts:1136-1319`; `query.ts:1321-1436` |
| GQ-REG-005 | `skill advisor scorer lanes explicit lexical graph causal derived semantic shadow` | 6 | `scoreAdvisorPrompt`, `buildLaneScores`, `SCORER_LANES` | `fusion.ts:14-26`; `fusion.ts:52-59`; `fusion.ts:139-158` |
| GQ-REG-006 | `skill graph query prepared statements relations` | 6 | `getPreparedStatements`, `dependsOn`, `transitivePath` | `skill-graph-queries.ts:83-193`; `skill-graph-queries.ts:254-430` |
| GQ-REG-007 | `detect_changes hard block stale graph false safe empty` | 4 | `handleDetectChanges`, `readinessRequiresBlock`, `blockedResponse` | `detect-changes.ts:7-12`; `detect-changes.ts:69-80`; `detect-changes.ts:94-106`; `detect-changes.ts:245-264` |
| GQ-REG-008 | `phase runner scan phases find candidates parse candidates finalize emit metrics` | 4 | `buildIndexPhases`, `indexFiles`, `runPhases` | `structural-indexer.ts:1399-1508`; `structural-indexer.ts:1510-1535` |

## Seed Queries List

Each `expected_count` is an approximate top-result count target with a +/-20% tolerance unless the explicit range is wider for small counts.

```json
[
  {
    "id": "GQ-MCP-001",
    "category": "mcp_tool_handler",
    "query": "code_graph_query handler",
    "expected_count": 3,
    "expected_count_range": "2-4",
    "expected_top_K_symbols": ["handleCodeGraphQuery", "codeGraphQuery", "handleTool"],
    "edge_focus": ["define", "import", "call"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:570-588", ".opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:20-69", ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1031-1036"]
  },
  {
    "id": "GQ-MCP-002",
    "category": "mcp_tool_handler",
    "query": "code_graph_scan handler",
    "expected_count": 3,
    "expected_count_range": "2-4",
    "expected_top_K_symbols": ["handleCodeGraphScan", "codeGraphScan", "handleTool"],
    "edge_focus": ["define", "import", "call"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:555-568", ".opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:20-63", ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:127-186"]
  },
  {
    "id": "GQ-MCP-003",
    "category": "mcp_tool_handler",
    "query": "code_graph_status readiness handler",
    "expected_count": 3,
    "expected_count_range": "2-4",
    "expected_top_K_symbols": ["handleCodeGraphStatus", "codeGraphStatus", "buildReadinessBlock"],
    "edge_focus": ["define", "import", "ref"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:590-594", ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:10-65"]
  },
  {
    "id": "GQ-MCP-004",
    "category": "mcp_tool_handler",
    "query": "code_graph_context seeds handler",
    "expected_count": 4,
    "expected_count_range": "3-5",
    "expected_top_K_symbols": ["handleCodeGraphContext", "buildContext", "resolveSeeds"],
    "edge_focus": ["define", "import", "call"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:596-634", ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:107-225", ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts:102-123"]
  },
  {
    "id": "GQ-MCP-005",
    "category": "mcp_tool_handler",
    "query": "detect_changes stale graph blocked handler",
    "expected_count": 4,
    "expected_count_range": "3-5",
    "expected_top_K_symbols": ["handleDetectChanges", "readinessRequiresBlock", "detectChanges"],
    "edge_focus": ["define", "call", "ref"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:636-647", ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:94-106", ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:211-264"]
  },
  {
    "id": "GQ-MCP-006",
    "category": "mcp_tool_handler",
    "query": "advisor_recommend handler scorer fusion",
    "expected_count": 4,
    "expected_count_range": "3-5",
    "expected_top_K_symbols": ["advisorRecommendTool", "handleAdvisorRecommend", "scoreAdvisorPrompt"],
    "edge_focus": ["define", "import", "call"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/advisor-recommend.ts:7-27", ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:238-256", ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:237-245"]
  },
  {
    "id": "GQ-MCP-007",
    "category": "mcp_tool_handler",
    "query": "skill_graph_query queryType handler",
    "expected_count": 5,
    "expected_count_range": "4-6",
    "expected_top_K_symbols": ["handleSkillGraphQuery", "skillGraphQuery", "dependsOn"],
    "edge_focus": ["define", "import", "call"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:661-678", ".opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts:15-61", ".opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts:44-147"]
  },
  {
    "id": "GQ-XMOD-001",
    "category": "cross_module_function",
    "query": "code graph readiness selective reindex threshold",
    "expected_count": 4,
    "expected_count_range": "3-5",
    "expected_top_K_symbols": ["ensureCodeGraphReady", "detectState", "SELECTIVE_REINDEX_THRESHOLD"],
    "edge_focus": ["call", "ref", "define"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:47-52", ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:102-187", ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:290-387"]
  },
  {
    "id": "GQ-XMOD-002",
    "category": "cross_module_function",
    "query": "structural indexer scan phase runner",
    "expected_count": 4,
    "expected_count_range": "3-5",
    "expected_top_K_symbols": ["indexFiles", "buildIndexPhases", "runPhases"],
    "edge_focus": ["call", "define", "import"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1399-1508", ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1510-1535"]
  },
  {
    "id": "GQ-XMOD-003",
    "category": "cross_module_function",
    "query": "code graph persistence mtime staging retry",
    "expected_count": 4,
    "expected_count_range": "3-5",
    "expected_top_K_symbols": ["persistIndexedFileResult", "upsertFile", "replaceNodes"],
    "edge_focus": ["call", "define", "ref"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:227-248", ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:281-355", ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:380-424"]
  },
  {
    "id": "GQ-XMOD-004",
    "category": "cross_module_function",
    "query": "skill advisor five lane fusion scoring",
    "expected_count": 6,
    "expected_count_range": "5-7",
    "expected_top_K_symbols": ["scoreAdvisorPrompt", "buildLaneScores", "scoreGraphCausalLane"],
    "edge_focus": ["import", "call", "define"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:14-26", ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:139-158", ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:237-256"]
  },
  {
    "id": "GQ-XMOD-005",
    "category": "cross_module_function",
    "query": "skill graph generation publish after startup scan",
    "expected_count": 4,
    "expected_count_range": "3-5",
    "expected_top_K_symbols": ["runSkillGraphIndex", "indexSkillMetadata", "publishSkillGraphGeneration"],
    "edge_focus": ["call", "import", "define"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/context-server.ts:1467-1490", ".opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:463-642", ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:110-133"]
  },
  {
    "id": "GQ-XMOD-006",
    "category": "cross_module_function",
    "query": "advisor daemon lease watcher lifecycle",
    "expected_count": 5,
    "expected_count_range": "4-6",
    "expected_top_K_symbols": ["startSkillGraphDaemon", "acquireSkillGraphLease", "createSkillGraphWatcher"],
    "edge_focus": ["call", "import", "define"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts:28-70", ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lease.ts:110-180"]
  },
  {
    "id": "GQ-XMOD-007",
    "category": "cross_module_function",
    "query": "memory retrieval stage2 single scoring point",
    "expected_count": 5,
    "expected_count_range": "4-6",
    "expected_top_K_symbols": ["applyValidationSignalScoring", "loadPersistedLearnedStage2Model", "sortDeterministicRows"],
    "edge_focus": ["call", "import", "define"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:21-44", ".opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:169-218", ".opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:220-259"]
  },
  {
    "id": "GQ-TYPE-001",
    "category": "exported_type",
    "query": "CodeNode CodeEdge ParseResult indexer types",
    "expected_count": 4,
    "expected_count_range": "3-5",
    "expected_top_K_symbols": ["CodeNode", "CodeEdge", "ParseResult"],
    "edge_focus": ["define", "ref"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:31-79"]
  },
  {
    "id": "GQ-TYPE-002",
    "category": "exported_type",
    "query": "QueryArgs code_graph_query operations",
    "expected_count": 3,
    "expected_count_range": "2-4",
    "expected_top_K_symbols": ["QueryArgs", "EdgeType", "SUPPORTED_EDGE_TYPES"],
    "edge_focus": ["define", "ref"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:23-56"]
  },
  {
    "id": "GQ-TYPE-003",
    "category": "exported_type",
    "query": "ContextArgs ContextResult code_graph_context types",
    "expected_count": 3,
    "expected_count_range": "2-4",
    "expected_top_K_symbols": ["ContextArgs", "ContextResult", "QueryMode"],
    "edge_focus": ["define", "ref"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts:19-54"]
  },
  {
    "id": "GQ-TYPE-004",
    "category": "exported_type",
    "query": "SkillNode SkillEdge SkillGraphStats types",
    "expected_count": 3,
    "expected_count_range": "2-4",
    "expected_top_K_symbols": ["SkillNode", "SkillEdge", "SkillGraphStats"],
    "edge_focus": ["define", "ref"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:18-68"]
  },
  {
    "id": "GQ-TYPE-005",
    "category": "exported_type",
    "query": "AdvisorHookResult threshold config types",
    "expected_count": 4,
    "expected_count_range": "3-5",
    "expected_top_K_symbols": ["AdvisorHookResult", "SkillAdvisorBriefOptions", "ResolvedAdvisorThresholdConfig"],
    "edge_focus": ["define", "ref"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts:47-88", ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts:108-150"]
  },
  {
    "id": "GQ-TYPE-006",
    "category": "exported_type",
    "query": "DetectChangesResult AffectedSymbol status types",
    "expected_count": 3,
    "expected_count_range": "2-4",
    "expected_top_K_symbols": ["DetectChangesResult", "AffectedSymbol", "DetectChangesStatus"],
    "edge_focus": ["define", "ref"],
    "citations": [".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:21-50"]
  },
  {
    "id": "GQ-REG-001",
    "category": "regression_detection",
    "query": "default code graph indexer config include exclude globs",
    "expected_count": 2,
    "expected_count_range": "1-3",
    "expected_top_K_symbols": ["getDefaultConfig", "includeGlobs", "excludeGlobs"],
    "edge_focus": ["define", "ref"],
    "rationale": "if this query fails, the canonical indexer config or its include/exclude scope rules are missing from the index",
    "citations": [".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:112-120"]
  },
  {
    "id": "GQ-REG-002",
    "category": "regression_detection",
    "query": "index scope excludes code graph canonical roots",
    "expected_count": 3,
    "expected_count_range": "2-4",
    "expected_top_K_symbols": ["EXCLUDED_FOR_CODE_GRAPH", "shouldIndexForCodeGraph", "shouldExcludePath"],
    "edge_focus": ["call", "define", "ref"],
    "rationale": "if this query fails, the shared scope filter that distinguishes canonical code from legitimate excluded fixtures is missing from the index",
    "citations": [".opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:31-48", ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1146-1158"]
  },
  {
    "id": "GQ-REG-003",
    "category": "regression_detection",
    "query": "MCP tool definitions include code graph tools",
    "expected_count": 4,
    "expected_count_range": "3-5",
    "expected_top_K_symbols": ["TOOL_DEFINITIONS", "codeGraphQuery", "codeGraphStatus"],
    "edge_focus": ["define", "ref"],
    "rationale": "if this query fails, the MCP registration layer that makes code graph tools discoverable is missing from the index",
    "citations": [".opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:875-928"]
  },
  {
    "id": "GQ-REG-004",
    "category": "regression_detection",
    "query": "code_graph_query relationship operations calls imports blast_radius",
    "expected_count": 5,
    "expected_count_range": "4-6",
    "expected_top_K_symbols": ["QueryArgs", "handleCodeGraphQuery", "SUPPORTED_RELATIONSHIP_OPERATIONS"],
    "edge_focus": ["define", "call", "ref"],
    "rationale": "if this query fails, the canonical outline/calls/imports/blast_radius query surface is missing from the index",
    "citations": [".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:23-56", ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1097-1134", ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1136-1319", ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1321-1436"]
  },
  {
    "id": "GQ-REG-005",
    "category": "regression_detection",
    "query": "skill advisor scorer lanes explicit lexical graph causal derived semantic shadow",
    "expected_count": 6,
    "expected_count_range": "5-7",
    "expected_top_K_symbols": ["scoreAdvisorPrompt", "buildLaneScores", "SCORER_LANES"],
    "edge_focus": ["import", "call", "define"],
    "rationale": "if this query fails, advisor scoring lanes or the scorer subtree are missing from the index",
    "citations": [".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:14-26", ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:52-59", ".opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:139-158"]
  },
  {
    "id": "GQ-REG-006",
    "category": "regression_detection",
    "query": "skill graph query prepared statements relations",
    "expected_count": 6,
    "expected_count_range": "5-7",
    "expected_top_K_symbols": ["getPreparedStatements", "dependsOn", "transitivePath"],
    "edge_focus": ["call", "define", "ref"],
    "rationale": "if this query fails, the skill-graph relationship query layer is missing from the index",
    "citations": [".opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-queries.ts:83-193", ".opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-queries.ts:254-430"]
  },
  {
    "id": "GQ-REG-007",
    "category": "regression_detection",
    "query": "detect_changes hard block stale graph false safe empty",
    "expected_count": 4,
    "expected_count_range": "3-5",
    "expected_top_K_symbols": ["handleDetectChanges", "readinessRequiresBlock", "blockedResponse"],
    "edge_focus": ["call", "define", "ref"],
    "rationale": "if this query fails, the hard safety guard that blocks false-safe empty affectedSymbols output is missing from the index",
    "citations": [".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:7-12", ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:69-80", ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:94-106", ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264"]
  },
  {
    "id": "GQ-REG-008",
    "category": "regression_detection",
    "query": "phase runner scan phases find candidates parse candidates finalize emit metrics",
    "expected_count": 4,
    "expected_count_range": "3-5",
    "expected_top_K_symbols": ["buildIndexPhases", "indexFiles", "runPhases"],
    "edge_focus": ["call", "define", "ref"],
    "rationale": "if this query fails, the scanner phase pipeline that exercises find/parse/finalize/metrics edges is missing from the index",
    "citations": [".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1399-1508", ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1510-1535"]
  }
]
```

## Regression-Detection Queries

- **GQ-REG-001**: if this query fails, the canonical indexer config or its include/exclude scope rules are missing from the index. This catches over-aggressive excludes that drop `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts`.
- **GQ-REG-002**: if this query fails, the shared scope filter that distinguishes canonical code from legitimate excluded fixtures is missing from the index. This specifically protects `lib/utils/index-scope.ts` and the `shouldExcludePath()` call site.
- **GQ-REG-003**: if this query fails, MCP tool discovery is missing from the index. It catches dropped `tool-schemas.ts` or descriptor arrays.
- **GQ-REG-004**: if this query fails, the canonical `code_graph_query` operation surface is missing from the index. It exercises define/ref/call coverage for outline, calls, imports, transitive traversal, and blast-radius paths.
- **GQ-REG-005**: if this query fails, the skill-advisor scorer subtree is missing from the index. It crosses scorer lanes and imports in `skill_advisor/lib/scorer/fusion.ts`.
- **GQ-REG-006**: if this query fails, the skill-graph relationship query layer is missing from the index. It catches broken cross-package scope around `lib/skill-graph/*`.
- **GQ-REG-007**: if this query fails, the `detect_changes` false-safe guard is missing from the index. It is the most important stale/read-only safety canary.
- **GQ-REG-008**: if this query fails, the scanner phase pipeline is missing from the index. It catches dropped structural-indexer internals that would also hide scan metrics, candidate discovery, and parsing flow.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/deep-research-strategy.md:1-80`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/deep-research-state.jsonl:1-5`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-001.md:1-76`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-002.md:1-75`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-003.md:1-187`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:555-678`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:875-928`
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:1-111`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:1-98`
- `.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts:1-72`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1-1436`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:1-240`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:1-77`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:1-260`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:1-370`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:1-121`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:1-390`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1-180`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1120-1275`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1390-1535`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:1-760`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-context.ts:1-240`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts:1-53`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-queries.ts:1-430`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:1-735`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/query.ts:1-223`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:1-256`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tools/advisor-recommend.ts:1-27`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:1-260`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:1-145`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lifecycle.ts:1-150`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lease.ts:1-180`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1-260`

## Convergence Signals

- newFindingsRatio: 0.66
- research_questions_answered: ["Q5"]
- gold_queries_count: 28
- category_coverage: MCP handlers 7, cross-module functions 7, exported types 6, regression-detection 8
- graph_aspects_covered: define edges, import edges, call edges, reference-style symbols, transitive/relationship query surfaces
- novelty justification: This iteration adds the concrete verification battery seed list that earlier iterations only named as a future smoke test, and ties every query to a source symbol plus a failure rationale for over-aggressive scan excludes.
- remaining gaps: Iteration 5 should assign exclude-rule confidence tiers and decide which of the GQ-REG queries become hard-fail versus warning-only in `assets/code-graph-gold-queries.json`.

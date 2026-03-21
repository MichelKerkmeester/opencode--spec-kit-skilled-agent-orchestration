# Raw Evidence: Phase 003 Discovery Tests

Execution Date: 2026-03-19T18:57Z
Executor: Claude Opus 4.6 (1M context)
Safety: No autoRepair:true or confirmed:true used in any call.

---

## EX-011: Folder Inventory Audit (memory_list)

### Call 1 — specFolder: "022-hybrid-rag-fusion"

Exact call: `memory_list(specFolder: "022-hybrid-rag-fusion", limit: 20, offset: 0)`

```json
{
  "summary": "Listed 0 of 0 memories",
  "data": {
    "total": 0,
    "offset": 0,
    "limit": 20,
    "sortBy": "created_at",
    "includeChunks": false,
    "count": 0,
    "results": []
  },
  "hints": [
    "Auto-surface hook: injected 1 constitutional and 4 triggered memories (80ms)"
  ],
  "meta": {
    "tool": "memory_list",
    "tokenCount": 148,
    "latencyMs": 1,
    "cacheHit": false,
    "tokenBudget": 800
  }
}
```

**Note**: Zero results because memories are stored under child paths (e.g., `02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic`), not the bare grandparent path. Pagination structure IS complete.

### Call 2 (Supplementary) — specFolder: "02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic"

Exact call: `memory_list(specFolder: "02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic", limit: 20, offset: 0)`

```json
{
  "summary": "Listed 20 of 26 memories",
  "data": {
    "total": 26,
    "offset": 0,
    "limit": 20,
    "sortBy": "created_at",
    "includeChunks": false,
    "count": 4,
    "results": [
      {
        "id": 24762,
        "specFolder": "02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic",
        "title": "Hybrid RAG Fusion Epic",
        "createdAt": "2026-03-15T12:01:23.085Z",
        "updatedAt": "2026-03-15T12:01:23.085Z",
        "importanceWeight": 0.8,
        "triggerCount": 5,
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md"
      },
      {
        "id": 24351,
        "specFolder": "02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic",
        "title": "Root docs R1-R8 fixes",
        "createdAt": "2026-03-15T11:59:58.797Z",
        "updatedAt": "2026-03-19 18:33:32",
        "importanceWeight": 0.5,
        "triggerCount": 5,
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/27-02-26_09-06__root-doc-r1-r8-fixes.md"
      },
      {
        "id": 24349,
        "specFolder": "02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic",
        "title": "Level 3 implementation summaries for spec 138",
        "createdAt": "2026-03-15T11:59:58.287Z",
        "updatedAt": "2026-03-19 18:33:32",
        "importanceWeight": 0.5,
        "triggerCount": 5,
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/20-02-26_18-23__level-3-implementation-summaries.md"
      },
      {
        "id": 24348,
        "specFolder": "02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic",
        "title": "Spec 138 continuation attempt 3 completion session",
        "createdAt": "2026-03-15T11:59:57.654Z",
        "updatedAt": "2026-03-19 18:33:32",
        "importanceWeight": 0.5,
        "triggerCount": 5,
        "filePath": "/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/20-02-26_16-57__continuation-attempt-3-spec-138.md"
      }
    ]
  },
  "hints": [
    "More results available: use offset: 20",
    "Auto-surface hook: injected 1 constitutional and 5 triggered memories (58ms)",
    "Token budget enforced: truncated 20 → 4 results to fit 800 token budget"
  ],
  "meta": {
    "tool": "memory_list",
    "tokenCount": 751,
    "latencyMs": 1,
    "cacheHit": false,
    "tokenBudget": 800,
    "tokenBudgetTruncated": true,
    "originalResultCount": 20,
    "returnedResultCount": 4
  }
}
```

**Note**: 26 total memories, 20 matched limit, 4 returned due to token budget truncation. Pagination hint confirms more results at offset 20. All expected fields present: total, offset, limit, sortBy, includeChunks, count, results with id/specFolder/title/createdAt/updatedAt/importanceWeight/triggerCount/filePath.

---

## EX-012: System Baseline Snapshot (memory_stats)

Exact call: `memory_stats(folderRanking: "composite", includeScores: true)`

```json
{
  "summary": "Memory system: 679 memories across 106 folders",
  "data": {
    "totalMemories": 679,
    "byStatus": {
      "pending": 0,
      "success": 540,
      "failed": 0,
      "retry": 0,
      "partial": 14
    },
    "oldestMemory": "2026-03-03T12:29:31.574Z",
    "newestMemory": "2026-03-18T20:21:02.064Z",
    "topFolders": [
      {
        "folder": "02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/002-contamination-detection",
        "simplified": "002-contamination-detection",
        "count": 13,
        "score": 0.874,
        "recencyScore": 0.81,
        "importanceScore": 1,
        "activityScore": 1,
        "validationScore": 0.5,
        "lastActivity": "2026-03-17T10:48:23.195Z",
        "isArchived": false,
        "topTier": "critical"
      },
      {
        "folder": "02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/001-quality-scorer-unification",
        "simplified": "001-quality-scorer-unification",
        "count": 12,
        "score": 0.874,
        "recencyScore": 0.81,
        "importanceScore": 1,
        "activityScore": 1,
        "validationScore": 0.5,
        "lastActivity": "2026-03-17T10:48:23.088Z",
        "isArchived": false,
        "topTier": "critical"
      },
      {
        "folder": "02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/005-confidence-calibration",
        "simplified": "005-confidence-calibration",
        "count": 14,
        "score": 0.874,
        "recencyScore": 0.81,
        "importanceScore": 1,
        "activityScore": 1,
        "validationScore": 0.5,
        "lastActivity": "2026-03-17T10:48:27.666Z",
        "isArchived": false,
        "topTier": "critical"
      },
      {
        "folder": "02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction",
        "simplified": "008-signal-extraction",
        "count": 13,
        "score": 0.874,
        "recencyScore": 0.811,
        "importanceScore": 1,
        "activityScore": 1,
        "validationScore": 0.5,
        "lastActivity": "2026-03-17T10:52:07.352Z",
        "isArchived": false,
        "topTier": "critical"
      },
      {
        "folder": "02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic",
        "simplified": "001-hybrid-rag-fusion-epic",
        "count": 86,
        "score": 0.844,
        "recencyScore": 0.994,
        "importanceScore": 0.653,
        "activityScore": 1,
        "validationScore": 0.5,
        "lastActivity": "2026-03-19T17:33:32.000Z",
        "isArchived": false,
        "topTier": "critical"
      },
      {
        "folder": "02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing",
        "simplified": "009-perfect-session-capturing",
        "count": 4,
        "score": 0.833,
        "recencyScore": 0.994,
        "importanceScore": 0.75,
        "activityScore": 0.8,
        "validationScore": 0.5,
        "lastActivity": "2026-03-19T17:33:33.000Z",
        "isArchived": false,
        "topTier": "critical"
      },
      {
        "folder": "03--commands-and-skills/commands/016-create-skill-merger",
        "simplified": "016-create-skill-merger",
        "count": 7,
        "score": 0.824,
        "recencyScore": 0.898,
        "importanceScore": 0.714,
        "activityScore": 1,
        "validationScore": 0.5,
        "lastActivity": "2026-03-18T15:48:57.000Z",
        "isArchived": false,
        "topTier": "critical"
      },
      {
        "folder": "02--system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization",
        "simplified": "002-indexing-normalization",
        "count": 6,
        "score": 0.808,
        "recencyScore": 0.994,
        "importanceScore": 0.533,
        "activityScore": 1,
        "validationScore": 0.5,
        "lastActivity": "2026-03-19T17:33:32.000Z",
        "isArchived": false,
        "topTier": "important"
      },
      {
        "folder": "02--system-spec-kit/021-spec-kit-phase-system",
        "simplified": "021-spec-kit-phase-system",
        "count": 14,
        "score": 0.804,
        "recencyScore": 0.994,
        "importanceScore": 0.521,
        "activityScore": 1,
        "validationScore": 0.5,
        "lastActivity": "2026-03-19T17:33:31.000Z",
        "isArchived": false,
        "topTier": "important"
      },
      {
        "folder": "01--anobel.com/034-form-bot-problem",
        "simplified": "034-form-bot-problem",
        "count": 18,
        "score": 0.798,
        "recencyScore": 0.994,
        "importanceScore": 0.5,
        "activityScore": 1,
        "validationScore": 0.5,
        "lastActivity": "2026-03-19T17:33:31.000Z",
        "isArchived": false,
        "topTier": "critical"
      }
    ],
    "totalSpecFolders": 106,
    "limit": 10,
    "totalTriggerPhrases": 2901,
    "vectorSearchEnabled": true,
    "graphChannelMetrics": {
      "totalQueries": 0,
      "graphHits": 0,
      "graphOnlyResults": 0,
      "multiSourceResults": 0,
      "graphHitRate": 0
    },
    "folderRanking": "composite",
    "tierBreakdown": {
      "constitutional": 1,
      "critical": 139,
      "deprecated": 85,
      "important": 126,
      "normal": 328
    },
    "databaseSizeBytes": 211374080,
    "lastIndexedAt": "2026-03-19 18:33:33"
  },
  "hints": [
    "Response exceeds token budget (1368/800)"
  ],
  "meta": {
    "tool": "memory_stats",
    "tokenCount": 1381,
    "latencyMs": 7,
    "cacheHit": false,
    "tokenBudget": 800
  }
}
```

---

## EX-013a: Health Diagnostics — Full Mode (memory_health)

Exact call: `memory_health(reportMode: "full")`

```json
{
  "summary": "Memory system healthy: 679 memories indexed",
  "data": {
    "status": "healthy",
    "embeddingModelReady": true,
    "databaseConnected": true,
    "vectorSearchAvailable": true,
    "memoryCount": 679,
    "uptime": 1504.206124708,
    "version": "1.7.2",
    "reportMode": "full",
    "aliasConflicts": {
      "groups": 0,
      "rows": 0,
      "identicalHashGroups": 0,
      "divergentHashGroups": 0,
      "unknownHashGroups": 0,
      "samples": []
    },
    "repair": {
      "requested": false,
      "attempted": false,
      "repaired": false,
      "partialSuccess": false,
      "actions": [],
      "warnings": [],
      "errors": []
    },
    "embeddingProvider": {
      "provider": "voyage",
      "model": "voyage-4",
      "dimension": 1024,
      "healthy": true,
      "databasePath": ".opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite"
    }
  },
  "hints": [],
  "meta": {
    "tool": "memory_health",
    "tokenCount": 268,
    "latencyMs": 18,
    "cacheHit": false,
    "tokenBudget": 800
  }
}
```

---

## EX-013b: Health Diagnostics — Divergent Aliases Mode (memory_health)

Exact call: `memory_health(reportMode: "divergent_aliases")`

```json
{
  "summary": "Divergent alias report: 0 of 0 group(s)",
  "data": {
    "reportMode": "divergent_aliases",
    "status": "healthy",
    "databaseConnected": true,
    "specFolder": null,
    "limit": 20,
    "totalRowsScanned": 433,
    "totalDivergentGroups": 0,
    "returnedGroups": 0,
    "groups": []
  },
  "hints": [
    "No divergent alias groups detected"
  ],
  "meta": {
    "tool": "memory_health",
    "tokenCount": 127,
    "latencyMs": 3,
    "cacheHit": false,
    "tokenBudget": 800
  }
}
```

---

## Execution Notes

1. **EX-011 specFolder resolution**: The pre-flight recommended "022-hybrid-rag-fusion" but memories are stored under full child paths. A supplementary call with `02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic` (86 total memories) produced a representative paginated result. Both calls documented.
2. **Token budget truncation**: EX-011 supplementary call returned 4 of 20 matched results due to 800-token budget enforcement. The `originalResultCount: 20` and `returnedResultCount: 4` metadata confirms the truncation was server-side, not a missing-data issue.
3. **EX-012 token overshoot**: Stats response was 1368 tokens vs 800 budget. Data was complete despite the overshoot hint.
4. **EX-013 clean corpus**: Both full and divergent_aliases modes returned clean results (0 alias conflicts, 0 divergent groups). This is valid evidence per pre-flight Q2 resolution.
5. **Safety**: No autoRepair or confirmed parameters were used. All calls were read-only. No mutations detected.

# Pre-flight Analysis: Phase 003 Discovery Tests

## 1. Resolved Open Questions (T009)

Q1 — EX-011 target spec folder:
Use "022-hybrid-rag-fusion" as specFolder. It has 51 child specs = representative pagination. A shallow folder would show trivially few results. The grandparent epic is the best candidate for demonstrating pagination totals, offsets, and limit clamping.

Q2 — EX-013 clean corpus:
Clean corpus output IS sufficient. The test validates that memory_health returns a structurally complete triage payload with reportMode=divergent_aliases. Whether alias conflicts exist is a data property, not a test property. Empty conflict lists still prove the tool functions correctly and returns the expected schema.

## 2. Exact MCP Call Parameters

| Call | Tool | Parameters |
|------|------|------------|
| EX-011 | memory_list | specFolder: "022-hybrid-rag-fusion", limit: 20, offset: 0 |
| EX-012 | memory_stats | folderRanking: "composite", includeScores: true |
| EX-013a | memory_health | reportMode: "full" |
| EX-013b | memory_health | reportMode: "divergent_aliases" |

SAFETY: No autoRepair:true or confirmed:true in any call.

## 3. Evidence Capture Template

Use one evidence block per scenario. Capture the raw MCP payload, then review it against the exact expected fields below.

### EX-011

| Item | Detail |
|------|--------|
| Test ID | EX-011 |
| Scenario | Folder inventory audit |
| Exact prompt from playbook | `List memories in target spec folder. Capture the evidence needed to prove Paginated list and totals. Return a concise user-facing pass/fail verdict with the main reason.` |
| Exact MCP call | `memory_list(specFolder: "022-hybrid-rag-fusion", limit: 20, offset: 0)` |
| Expected output fields | `data.total`, `data.count`, `data.limit`, `data.offset`, `data.sortBy`, `data.includeChunks`, `data.results[]` |
| Expected result item fields | `id`, `specFolder`, `title`, `createdAt`, `updatedAt`, `importanceWeight`, `triggerCount`, `filePath` |
| PASS signals | Success envelope returned. `total` is numeric. `count` is numeric. `limit` resolves to `20`. `offset` resolves to `0`. `sortBy` resolves to `created_at` because it was omitted. `includeChunks` resolves to `false`. `results` is an array of memory rows with the expected item fields. |
| FAIL indicators | MCP error envelope. Missing `total`/`count`/`results`. `results` is not an array. Resolved `limit`, `offset`, or `sortBy` contradict the request/default behavior. |
| Safety constraints | Read-only browse only. Do not add `includeChunks:true`. Do not mutate corpus. Preserve the chosen representative `specFolder`. |
| Evidence to save | Prompt, exact call, raw JSON response, brief verdict sentence, and a note on whether pagination is evident from totals/count/hints. |

### EX-012

| Item | Detail |
|------|--------|
| Test ID | EX-012 |
| Scenario | System baseline snapshot |
| Exact prompt from playbook | `Return stats with composite ranking. Capture the evidence needed to prove Counts, tiers, folder ranking present. Return a concise user-facing pass/fail verdict with the main reason.` |
| Exact MCP call | `memory_stats(folderRanking: "composite", includeScores: true)` |
| Expected output fields | `data.totalMemories`, `data.byStatus`, `data.oldestMemory`, `data.newestMemory`, `data.topFolders[]`, `data.totalSpecFolders`, `data.limit`, `data.totalTriggerPhrases`, `data.vectorSearchEnabled`, `data.graphChannelMetrics`, `data.folderRanking`, `data.tierBreakdown`, `data.databaseSizeBytes`, `data.lastIndexedAt` |
| Expected `byStatus` fields | `success`, `pending`, `failed`, `retry` |
| Expected `graphChannelMetrics` fields | `totalQueries`, `graphHits`, `graphOnlyResults`, `multiSourceResults`, `graphHitRate` |
| Expected `topFolders[]` fields in composite/includeScores mode | `folder`, `simplified`, `count`, `score`, `recencyScore`, `importanceScore`, `activityScore`, `validationScore`, `lastActivity`, `isArchived`, `topTier` |
| PASS signals | Success envelope returned. `folderRanking` resolves to `composite`. Counts are populated. `tierBreakdown` exists. `topFolders` is an array. Composite score fields are present on folder rows. `totalSpecFolders` is numeric and represents the unsliced total, while `limit` explains any truncation. |
| FAIL indicators | MCP error envelope. Missing dashboard sections. `topFolders` missing or not an array. Composite mode returns folder rows without score fields. `graphChannelMetrics` absent. |
| Safety constraints | Read-only statistics only. Do not add `excludePatterns`. Do not change ranking mode. Do not perform any maintenance or re-index actions from this test. |
| Evidence to save | Prompt, exact call, raw JSON response, one highlighted `topFolders[0]` example, and a short verdict sentence tied to counts/tiers/ranking presence. |

### EX-013a

| Item | Detail |
|------|--------|
| Test ID | EX-013a |
| Scenario | Index/FTS integrity check, full diagnostics pass |
| Exact prompt from playbook | `Run full health and divergent_aliases. Capture the evidence needed to prove healthy/degraded status and diagnostics. Return a concise user-facing pass/fail verdict with the main reason.` |
| Exact MCP call | `memory_health(reportMode: "full")` |
| Expected output fields | `data.status`, `data.embeddingModelReady`, `data.databaseConnected`, `data.vectorSearchAvailable`, `data.memoryCount`, `data.uptime`, `data.version`, `data.reportMode`, `data.aliasConflicts`, `data.repair`, `data.embeddingProvider` |
| Expected `aliasConflicts` fields | `groups`, `rows`, `identicalHashGroups`, `divergentHashGroups`, `unknownHashGroups`, `samples[]` |
| Expected `aliasConflicts.samples[]` fields | `normalizedPath`, `hashState`, `variants[]` |
| Expected `repair` fields | `requested`, `attempted`, `repaired`, `partialSuccess`, `actions[]`, `warnings[]`, `errors[]` |
| Expected `embeddingProvider` fields | `provider`, `model`, `dimension`, `healthy`, `databasePath` |
| PASS signals | Success envelope returned. `reportMode` is `full`. Top-level `status` is present and may legitimately be `healthy` or `degraded`. Diagnostic sections are structurally complete even if warnings or degraded hints are present. |
| FAIL indicators | MCP error envelope. Missing health sections. `reportMode` not `full`. Absolute path leakage in user-facing fields would contradict the sanitization behavior expected from the handler. |
| Safety constraints | No `autoRepair:true`. No `confirmed:true`. This run is diagnostic-only and must not trigger confirmation or repair flows. |
| Evidence to save | Prompt, exact call, raw JSON response, any returned hints, and a verdict sentence explaining whether diagnostics were structurally complete. |

### EX-013b

| Item | Detail |
|------|--------|
| Test ID | EX-013b |
| Scenario | Index/FTS integrity check, divergent alias triage pass |
| Exact prompt from playbook | `Run full health and divergent_aliases. Capture the evidence needed to prove healthy/degraded status and diagnostics. Return a concise user-facing pass/fail verdict with the main reason.` |
| Exact MCP call | `memory_health(reportMode: "divergent_aliases")` |
| Expected output fields | `data.reportMode`, `data.status`, `data.databaseConnected`, `data.specFolder`, `data.limit`, `data.totalRowsScanned`, `data.totalDivergentGroups`, `data.returnedGroups`, `data.groups[]` |
| Expected `groups[]` fields | `normalizedPath`, `specFolders[]`, `distinctHashCount`, `variants[]` |
| Expected `variants[]` fields | `filePath`, `contentHash` |
| PASS signals | Success envelope returned. `reportMode` is `divergent_aliases`. Triage counters are present. `groups` is an array. Empty `groups` is still a PASS when the payload structure is complete. |
| FAIL indicators | MCP error envelope. Wrong report mode. Missing triage counters. `groups` missing or not an array. |
| Safety constraints | No `autoRepair:true`. No `confirmed:true`. No requirement to manufacture alias conflicts. Clean-corpus output is acceptable evidence. |
| Evidence to save | Prompt, exact call, raw JSON response, note whether `groups` was empty or populated, and a verdict sentence focused on schema completeness. |

## 4. Expected Output Shapes

The manual reviewer should expect MCP success envelopes with a `summary`, `data`, and optional `hints`. The structures below show the handler-backed payload shapes relevant to these three discovery tests.

### EX-011 expected shape

```json
{
  "summary": "Listed <count> of <total> memories",
  "data": {
    "total": 0,
    "offset": 0,
    "limit": 20,
    "sortBy": "created_at",
    "includeChunks": false,
    "count": 0,
    "results": [
      {
        "id": 0,
        "specFolder": "022-hybrid-rag-fusion",
        "title": "Example title",
        "createdAt": "ISO-or-stored-value",
        "updatedAt": "ISO-or-stored-value",
        "importanceWeight": 0,
        "triggerCount": 0,
        "filePath": "path/to/file.md"
      }
    ]
  },
  "hints": [
    "More results available: use offset: 20"
  ]
}
```

Reviewer notes:
- `memory_list` clamps limit into `1..100` and offset to `>=0`.
- Invalid `sortBy` falls back to `created_at`, but EX-011 omits `sortBy`, so `created_at` is the expected resolved value.
- Parent memories are listed by default because `includeChunks` stays `false`.

### EX-012 expected shape

```json
{
  "summary": "Memory system: <totalMemories> memories across <totalSpecFolders> folders",
  "data": {
    "totalMemories": 0,
    "byStatus": {
      "success": 0,
      "pending": 0,
      "failed": 0,
      "retry": 0
    },
    "oldestMemory": null,
    "newestMemory": null,
    "topFolders": [
      {
        "folder": "specs/example",
        "simplified": "example",
        "count": 0,
        "score": 0,
        "recencyScore": 0,
        "importanceScore": 0,
        "activityScore": 0,
        "validationScore": 0,
        "lastActivity": null,
        "isArchived": false,
        "topTier": "normal"
      }
    ],
    "totalSpecFolders": 0,
    "limit": 10,
    "totalTriggerPhrases": 0,
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
      "normal": 0
    },
    "databaseSizeBytes": 0,
    "lastIndexedAt": null
  },
  "hints": []
}
```

Reviewer notes:
- `totalSpecFolders` represents the full filtered/scored set before `topFolders` is sliced to `limit`.
- Because EX-012 uses `folderRanking: "composite"` and `includeScores: true`, score-bearing folder rows are expected, not the reduced count-mode row shape.
- `graphChannelMetrics` must include `graphHitRate` in addition to the raw counters.

### EX-013a expected shape

```json
{
  "summary": "Memory system <healthy|degraded>: <memoryCount> memories indexed",
  "data": {
    "status": "healthy",
    "embeddingModelReady": true,
    "databaseConnected": true,
    "vectorSearchAvailable": true,
    "memoryCount": 0,
    "uptime": 0,
    "version": "server-version",
    "reportMode": "full",
    "aliasConflicts": {
      "groups": 0,
      "rows": 0,
      "identicalHashGroups": 0,
      "divergentHashGroups": 0,
      "unknownHashGroups": 0,
      "samples": [
        {
          "normalizedPath": "specs/example/path.md",
          "hashState": "identical",
          "variants": [
            ".opencode/specs/example/path.md",
            "specs/example/path.md"
          ]
        }
      ]
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
      "provider": "provider-name",
      "model": "model-name",
      "dimension": 0,
      "healthy": true,
      "databasePath": ".opencode/skill/system-spec-kit/mcp_server/data/memory.db"
    }
  },
  "hints": []
}
```

Reviewer notes:
- `status` is derived from embedding-model readiness plus database connectivity only. Alias conflicts and FTS drift surface in hints/repair metadata; they do not independently flip status.
- The embedding provider path is expected to be redacted or project-relative, not an absolute filesystem path.
- `repair` must remain passive for this pre-flight because `autoRepair` and `confirmed` are intentionally omitted.

### EX-013b expected shape

```json
{
  "summary": "Divergent alias report: <returnedGroups> of <totalDivergentGroups> group(s)",
  "data": {
    "reportMode": "divergent_aliases",
    "status": "healthy",
    "databaseConnected": true,
    "specFolder": null,
    "limit": 20,
    "totalRowsScanned": 0,
    "totalDivergentGroups": 0,
    "returnedGroups": 0,
    "groups": [
      {
        "normalizedPath": "specs/example/path.md",
        "specFolders": [
          "02--system-spec-kit/010-test"
        ],
        "distinctHashCount": 2,
        "variants": [
          {
            "filePath": ".opencode/specs/example/path.md",
            "contentHash": "hash-1"
          },
          {
            "filePath": "specs/example/path.md",
            "contentHash": "hash-2"
          }
        ]
      }
    ]
  },
  "hints": [
    "No divergent alias groups detected"
  ]
}
```

Reviewer notes:
- Clean corpus is valid. `groups: []` with `totalDivergentGroups: 0` still proves the triage payload is working.
- `specFolder` is expected to be `null` here because the planned call does not scope the report to a folder.
- If `totalDivergentGroups > returnedGroups`, a hint may recommend increasing the limit.

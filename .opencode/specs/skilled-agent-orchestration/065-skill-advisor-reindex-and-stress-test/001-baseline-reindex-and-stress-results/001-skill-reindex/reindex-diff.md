# Reindex Diff - 065/001

| Field | Pre | Post | Delta |
|---|---|---|---|
| Skill count | 20 | 20 | 0 |
| Advisor record count | 21 | 21 | 0 |
| Advisor generation | 941 | 942 | +1 |
| `skill_graph_status.validation.isHealthy` | true | true | Pass |
| `skill_graph_status.dbStatus` | ready | ready | Pass |
| `advisor_status.freshness` | stale | stale | Fail |
| `advisor_status.trustState.state` | unavailable | unavailable | Fail |

## Reindex Invocation

The direct MCP fallback sequence was used because slash-command execution is not available as a callable command surface in this runtime.

| Step | Result |
|---|---|
| `skill_graph_scan` | Failed: `UNTRUSTED_CALLER` - `skill_graph_scan requires trusted caller context` |
| `advisor_rebuild({ force: true })` | Succeeded: generation `941` -> `942`, `skillCount=21` |
| `memory_index_scan` | Succeeded: `13 indexed, 1 updated, 4 unchanged, 0 deleted, 0 failed` |

## Per-Prompt Confidence Delta

| Prompt | Expected | Pre top1 | Pre conf | Post top1 | Post conf | Delta conf | Verdict |
|---|---|---|---:|---|---:|---:|---|
| save context | `memory:save` | `system-spec-kit` | 0.9500 | `system-spec-kit` | 0.9500 | +0.0000 | FAIL |
| create new agent | `create:agent` | `sk-doc` | 0.8200 | `sk-doc` | 0.8200 | +0.0000 | FAIL |
| deep research | `spec_kit:deep-research` | `sk-deep-research` | 0.9500 | `sk-deep-research` | 0.9500 | +0.0000 | PASS |
| git commit | `sk-git` | `sk-git` | 0.9295 | `sk-git` | 0.9295 | +0.0000 | PASS |
| review pull request | review skill/command | `sk-code-review` | 0.9500 | `sk-code-review` | 0.9500 | +0.0000 | PASS |

## Validation Gates

| Gate | Criterion | Observed | Verdict |
|---|---|---|---|
| Graph healthy | Graph status healthy / ready | `validation.isHealthy=true`, `dbStatus=ready` | PASS |
| Advisor healthy | Advisor status healthy | `freshness=stale`, `trustState.state=unavailable`, reason `advisor_rebuild` | FAIL |
| `save context` confidence | top1 == `memory:save` and confidence >= 0.8 | top1 `system-spec-kit`, confidence 0.95 | FAIL |
| `create new agent` confidence | top1 == `create:agent` and confidence >= 0.8 | top1 `sk-doc`, confidence 0.82 | FAIL |
| `deep research` confidence | top1 == `spec_kit:deep-research` and confidence >= 0.8 | top1 `sk-deep-research`, confidence 0.95 | PASS |
| `git commit` confidence | top1 == `sk-git` and confidence >= 0.8 | top1 `sk-git`, confidence 0.9295 | PASS |
| `review pull request` confidence | top1 contains review and confidence >= 0.7 | top1 `sk-code-review`, confidence 0.95 | PASS |

## Notable Drift

No top-match or confidence delta changed between pre and post snapshots. The rebuild bumped advisor generation but did not remediate the two known-prompt routing misses.

## Follow-Up Remediation Evidence

After the initial `NO_GO`, source/build fixes were applied and verified in fresh processes:

| Surface | Evidence | Verdict |
|---|---|---|
| Direct built `dist` advisor | `advisor_rebuild` generation `945 -> 946`, `freshnessAfter=live`, `trustState.state=live`, `skillCount=21` | PASS |
| Direct built `dist` routing | `save context -> memory:save` confidence `0.9039`; `create new agent -> create:agent` confidence `0.8527` | PASS |
| Direct built `dist` controls | `deep research -> sk-deep-research` confidence `0.95`; `git commit -> sk-git` confidence `0.9295`; `review pull request -> sk-code-review` confidence `0.95` | PASS |
| Python native fallback | `save context -> memory:save` confidence `0.9039`; `create new agent -> create:agent` confidence `0.8527` | PASS |
| Python forced-local fallback | `save context -> memory:save` confidence `0.95`; `create new agent -> create:agent` confidence `0.95` | PASS |
| Attached MCP process | `skill_graph_scan` still `UNTRUSTED_CALLER`; `advisor_status` still reports `freshness=stale`, `trustState.state=unavailable`; routing still returns old top1 values | FAIL |

Interpretation: the checked-in source and built output are remediated, but the attached MCP process has not reloaded those modules. A live MCP restart/reload is required before this phase can emit `GO`.

## Live MCP Replay After Restart

The attached MCP tool surface was replayed after restart/reload and now matches the fresh-process remediation evidence.

| Gate | Observed | Verdict |
|---|---|---|
| `skill_graph_scan` trusted | Succeeded with `scannedFiles=21`, `indexedFiles=0`, `skippedFiles=21`, `indexedEdges=73`, `rejectedEdges=0` | PASS |
| `advisor_rebuild({ force: true })` | Succeeded: generation `950` -> `951`, `freshnessBefore=live`, `freshnessAfter=live`, `skillCount=21` | PASS |
| `advisor_status` | `freshness=live`, `trustState.state=live`, generation `951`, `skillCount=21` | PASS |
| `save context` confidence | top1 `memory:save`, confidence `0.9039` | PASS |
| `create new agent` confidence | top1 `create:agent`, confidence `0.8527` | PASS |
| `deep research` confidence | top1 `sk-deep-research`, confidence `0.95` | PASS |
| `git commit` confidence | top1 `sk-git`, confidence `0.9295` | PASS |
| `review pull request` confidence | top1 `sk-code-review`, confidence `0.95` | PASS |

The only diagnostic remains the expected non-skill metadata warning for `.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/graph-metadata.json`.

## GO Signal

`GO` - live MCP freshness, trust state, and known-prompt routing gates now pass. `002-skill-router-stress-tests` may proceed.

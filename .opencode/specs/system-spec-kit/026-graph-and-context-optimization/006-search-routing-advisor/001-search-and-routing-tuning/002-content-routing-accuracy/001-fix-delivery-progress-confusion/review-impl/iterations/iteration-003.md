# Iteration 003 - Robustness

## Scope

Same three production/test files. This pass focused on transient dependency failures and retry behavior.

## Verification

- Git log checked for the scoped files.
- Scoped Vitest command: PASS, 30 tests.

## Findings

### F-003 - P1 Robustness - Rejected prototype-embedding promises stay cached after transient embedding failures

The router caches the in-flight prototype embedding promise by library key at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:903` through `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:929`. The promise body calls the injected embedder at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:921`, then the promise is stored at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:928`.

There is no rejection cleanup. If `embedText` throws once while building prototype embeddings, the rejected promise remains in the map and every later classification on the same router instance reuses the same rejection.

Behavior probe:

```json
{"attempt":1,"ok":false,"message":"transient embedding outage","calls":1}
{"attempt":2,"ok":false,"message":"transient embedding outage","calls":1}
```

The second attempt never calls the recovered embedder because it reads the cached rejected promise. A transient embedding failure therefore becomes a persistent router outage for that instance.

## Delta

New finding: F-003.

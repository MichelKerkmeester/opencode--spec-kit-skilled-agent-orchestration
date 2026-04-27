# Dist Marker Grep Cheatsheet

> Grep patterns to verify rebuilt dist contains the expected new code markers. Run after `npm run build`, before claiming completion.

---

## Per-Packet Markers

### Packet 008 — memory_context truncation contract
```bash
grep -l preEnforcementTokens .opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-context.js
grep -l returnedTokens .opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-context.js
grep -l droppedAllResultsReason .opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-context.js
```

### Packet 014 — memory_search response policy
```bash
grep -l responsePolicy .opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js
grep -l citationPolicy .opencode/skill/system-spec-kit/mcp_server/dist/formatters/search-results.js
grep -l ask_disambiguation .opencode/skill/system-spec-kit/mcp_server/dist/lib/search/recovery-payload.js
grep -l broaden_or_ask .opencode/skill/system-spec-kit/mcp_server/dist/lib/search/recovery-payload.js
```

### Packet 010 — code_graph fast-fail
```bash
grep -l fallbackDecision .opencode/skill/system-spec-kit/mcp_server/dist/code_graph/handlers/query.js
grep -l "nextTool" .opencode/skill/system-spec-kit/mcp_server/dist/code_graph/handlers/query.js
grep -l "retryAfter" .opencode/skill/system-spec-kit/mcp_server/dist/code_graph/handlers/query.js
```

### Packet 011 — causal-graph window metrics
```bash
grep -l deltaByRelation .opencode/skill/system-spec-kit/mcp_server/dist/handlers/causal-graph.js
grep -l balanceStatus .opencode/skill/system-spec-kit/mcp_server/dist/handlers/causal-graph.js
grep -l dominantRelationShare .opencode/skill/system-spec-kit/mcp_server/dist/handlers/causal-graph.js
grep -l enforceRelationWindowCap .opencode/skill/system-spec-kit/mcp_server/dist/lib/storage/causal-edges.js
```

### Packet 012 — intent classifier stability
```bash
grep -l "taskIntent" .opencode/skill/system-spec-kit/mcp_server/dist/lib/search/intent-classifier.js
grep -l "backendRouting" .opencode/skill/system-spec-kit/mcp_server/dist/lib/search/intent-classifier.js
grep -l "paraphraseGroup" .opencode/skill/system-spec-kit/mcp_server/dist/lib/search/intent-classifier.js
```

### Packet 009 — CocoIndex over-fetch + dedup
N/A for the TS dist — CocoIndex is Python. Verify via `ccc search` probes instead.

---

## Negative Tests

If the marker grep returns nothing, the build did not produce the new code. Re-run:

```bash
cd .opencode/skill/system-spec-kit/mcp_server && npm run build
```

If marker still absent after rebuild, the source patch did not land. Inspect `git diff <source-file>` to confirm.

---

## Timestamp Comparison

```bash
# dist newer than source
stat -f "%m %N" .opencode/skill/system-spec-kit/mcp_server/dist/handlers/memory-context.js
stat -f "%m %N" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
```

Dist timestamp MUST be greater than source timestamp.

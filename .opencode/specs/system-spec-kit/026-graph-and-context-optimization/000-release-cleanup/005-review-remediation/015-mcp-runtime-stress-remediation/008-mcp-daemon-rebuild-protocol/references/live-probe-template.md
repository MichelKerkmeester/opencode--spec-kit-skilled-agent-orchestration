# MCP Live Probe Template

> Canonical probe queries per subsystem. Copy these into your implementation-summary.md "Verification" section after MCP daemon restart.

---

## memory_context

```text
memory_context({
  input: "Semantic Search",
  mode: "auto",
  includeTrace: true,
  tokenUsage: 0.02
})
```

**Expected after packet 008 + 012:**
- `meta.intent.taskIntent.intent === "understand"`
- `meta.intent.taskIntent.classificationKind === "task-intent"`
- `data.queryIntentRouting.classificationKind === "backend-routing"`
- `meta.tokenBudgetEnforcement.preEnforcementTokens` populated
- `meta.tokenBudgetEnforcement.returnedTokens` populated
- If under-budget: `truncated:false`, `data.content[0].text` non-empty results
- If empty fallback: `meta.tokenBudgetEnforcement.droppedAllResultsReason` set

---

## memory_search

```text
memory_search({
  query: "find the spec for the cache warning hooks packet"
})
```

**Expected after packet 014:**
- `data.citationPolicy === "cite_results"` (good quality) OR `"do_not_cite_results"` (weak)
- If weak: `data.responsePolicy.noCanonicalPathClaims === true`
- If weak: `data.responsePolicy.safeResponse` non-empty string
- If `recommendedAction:"ask_user"`: `suggestedQueries.length > 0` OR `responsePolicy.requiredAction === "ask_disambiguation"`

---

## code_graph_query

```text
code_graph_query({
  operation: "callers",
  subject: "handleCodeGraphQuery"
})
```

**Expected after packet 010:**
- If graph fresh: structural results returned, no `fallbackDecision`
- If graph empty/stale+full_scan: `data.fallbackDecision.nextTool === "code_graph_scan"`, `reason === "full_scan_required"`, `retryAfter === "scan_complete"`
- `allowInlineFullScan:false` preserved (no inline scan triggered)

---

## memory_causal_stats

```text
memory_causal_stats()
```

**Expected after packet 011:**
- `data.by_relation` contains all 6 keys: `caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports` (zero-filled if absent)
- `data.health` agrees with `data.meetsTarget`: `meetsTarget:false ⇒ health ∈ {"degraded","below_target"}`
- `data.deltaByRelation`, `data.dominantRelation`, `data.dominantRelationShare`, `data.balanceStatus`, `data.windowStartedAt` all populated
- If supersedes burst detected: `balanceStatus === "relation_skewed"`, `remediationHint` set

---

## Recording Format

Capture probe output verbatim in implementation-summary.md:

```text
Live probe: <tool>(<args>)
Recorded at: <ISO timestamp>
After restart by: <user|automated>
Response (verbatim):
  <copy-paste full JSON or text response>
Result: PASS | FAIL | PARTIAL — <one-line explanation>
```

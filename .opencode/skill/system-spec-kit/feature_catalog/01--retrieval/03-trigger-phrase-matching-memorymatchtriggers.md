---
title: "Trigger phrase matching (memory_match_triggers)"
description: "Covers the fast-path trigger matching tool that performs direct string matching for sub-100ms retrieval."
---

# Trigger phrase matching (memory_match_triggers)

## 1. OVERVIEW

Covers the fast-path trigger matching tool that performs direct string matching for sub-100ms retrieval.

This is the speed-first search option. Instead of doing a deep analysis of your question, it matches specific phrases you type against a list of known keywords, like a phone's autocomplete. It returns results almost instantly, which makes it great for quick lookups where you already know roughly what you are looking for. Frequently used memories show up with full details while older ones appear as lightweight pointers.

---

## 2. CURRENT REALITY

When you need speed over depth, trigger matching delivers. Rather than generating embeddings and running multi-channel search, it performs direct string matching of your prompt against stored trigger phrases. The performance target is under 100ms. Think of it as the "fast path" that sacrifices recall for latency.

A trigger-cache source optimization now tightens the reload path. Cache reload reads from a partial source index (`idx_trigger_cache_source`) that only covers memories with `embedding_status = 'success'` and non-empty `trigger_phrases`, so reload scans skip rows that can never contribute trigger hits. The loader SQL itself is prepared once per SQLite connection and cached in a `WeakMap`, which means repeated cache refreshes on the same DB connection reuse the compiled statement instead of recompiling the loader query each time.

A governed-scope pass now runs immediately after raw trigger matching. `TriggerArgs` accepts optional `tenantId`, `userId`, `agentId`, and `sharedSpaceId` fields, and when any are supplied the handler imports `initialize_db()`, looks up the matched rows in `memory_index`, and post-filters the candidate set before cognitive enrichment begins. That closes the cross-tenant or cross-user leak where trigger phrases could previously surface out-of-scope memories before the broader retrieval stack had a chance to enforce boundaries.

Where this tool gets interesting is the cognitive pipeline. When you provide a session ID with `include_cognitive=true`, the system applies FSRS-based attention decay (scores degrade each turn via `0.98^(turn-1)` exponential decay), memory activation (matched memories get their attention score set to 1.0), co-activation spreading (each activated memory spreads activation to related memories through the co-occurrence graph), tier classification (maps effective retrievability to HOT, WARM, COLD, DORMANT or ARCHIVED) and tiered content injection.

Tiered content injection is the most visible effect. HOT memories return their full file content read from disk. WARM memories return the first 150 characters as a summary. COLD memories and below return no content at all. This tiering means recently active and highly relevant memories arrive with full context while dormant ones arrive as lightweight pointers.

The cognitive path fetches 2x the requested limit from the trigger matcher to give the cognitive pipeline headroom for filtering. If you request 3 results, 6 candidates enter the cognitive pipeline and the top 3 survivors are returned.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-triggers.ts` | Handler | Trigger matching handler: prompt matching, governed-scope filtering, cognitive enrichment, tiered content injection |
| `mcp_server/lib/parsing/trigger-matcher.ts` | Lib | Core trigger phrase matching engine |
| `mcp_server/lib/search/vector-index-schema.ts` | Lib | Schema migrations and common index creation for the trigger-cache source partial index |
| `mcp_server/lib/cognitive/attention-decay.ts` | Lib | FSRS-based attention decay (0.98^turn) |
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading through co-occurrence graph |
| `mcp_server/lib/cognitive/tier-classifier.ts` | Lib | Memory tier classification (HOT/WARM/COLD/DORMANT/ARCHIVED) |
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Working memory session integration |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `mcp_server/lib/eval/eval-logger.ts` | Lib | Evaluation event logger |
| `mcp_server/lib/telemetry/consumption-logger.ts` | Lib | Agent consumption logging |
| `mcp_server/lib/session/session-manager.ts` | Lib | Session validation for IDOR prevention |
| `mcp_server/lib/search/vector-index-store.ts` | Lib | DB access for governed-scope row lookup |
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token metrics calculation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-memory-triggers.vitest.ts` | Trigger handler validation |
| `mcp_server/tests/trigger-matcher.vitest.ts` | Trigger matcher tests |
| `mcp_server/tests/trigger-config-extended.vitest.ts` | Trigger config extended |
| `mcp_server/tests/trigger-setAttentionScore.vitest.ts` | Trigger attention scoring |
| `mcp_server/tests/attention-decay.vitest.ts` | Attention decay tests |
| `mcp_server/tests/co-activation.vitest.ts` | Co-activation spreading tests |
| `mcp_server/tests/tier-classifier.vitest.ts` | Tier classifier tests |

---

## 4. SOURCE METADATA

- Group: Retrieval
- Source feature title: Trigger phrase matching (memory_match_triggers)
- Current reality source: FEATURE_CATALOG.md
- Source list updated 2026-03-26 per audit remediation

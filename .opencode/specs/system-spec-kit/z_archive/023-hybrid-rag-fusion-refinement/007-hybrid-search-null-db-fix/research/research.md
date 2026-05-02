---
title: "Research: Memory Search [system-spec-kit/023-hybrid-rag-fusion-refinement/007-hybrid-search-null-db-fix/research]"
description: "10 GPT-5.4 agents (5 research + 5 review) investigated the memory search pipeline. While agents focused on code exploration rather than producing structured documents, the colle..."
trigger_phrases:
  - "research"
  - "memory"
  - "search"
  - "007"
  - "hybrid"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/007-hybrid-search-null-db-fix/research"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["research/research.md"]
---
# Research: Memory Search Pipeline — 10 Agent Deep Investigation

<!-- ANCHOR:summary -->
## Summary

10 GPT-5.4 agents (5 research + 5 review) investigated the memory search pipeline. While agents focused on code exploration rather than producing structured documents, the collective analysis confirms the root causes and surfaces additional optimization opportunities.

Source: `mcp_server/lib/governance/scope-governance.ts`, `mcp_server/handlers/memory-search.ts`, `mcp_server/handlers/memory-context.ts`, and `mcp_server/tests/pipeline-v2.vitest.ts`.
<!-- /ANCHOR:summary -->

## Consolidated Findings

### F1: memoryState Column Never Implemented (P0 — ROOT CAUSE)

**Evidence**: Agent 1 traced the full write path through `indexMemory()` → `applyPostInsertMetadata()`. The `ALLOWED_METADATA_COLUMNS` set includes `stability`, `difficulty`, `review_count`, `document_type`, etc. — but NOT `memoryState`. The schema builder (`vector-index-schema.ts`) creates all 59 columns in `memory_index` but none is `memoryState`.

**Test suite assumes it exists**: `pipeline-v2.vitest.ts` lines 170-237 have 6 tests that pass `memoryState: 'HOT'/'WARM'/'COLD'` directly in mock row data. These tests pass because they never query the real database — they test the filter logic in isolation with synthetic data that has the field pre-populated.

**Impact**: The `filterByMemoryState` function in Stage 4 was designed and tested for a column that doesn't exist. Every real memory resolves to `UNKNOWN` (priority 0), and any `minState` threshold above `''` filters them all out.

**Fix applied**: Removed `minState='WARM'` default from `memory-search.ts` and `minState='WARM'`/`'COLD'` hardcodes from `memory-context.ts`. State filtering is now inactive until the column is implemented.

### F2: Scope Enforcement Default-ON (P0 — ROOT CAUSE, FIXED)

**Evidence**: Agent 2 confirmed `isDefaultOnFlagEnabled()` returns `true` when no env var is set. Three functions use this helper:
- `isScopeEnforcementEnabled()` — was ON by default (FIXED to opt-in)
- `isGovernanceGuardrailsEnabled()` — still ON by default (potential issue)
- `isGovernedIngestRequired()` (line ~210) — uses `isGovernanceGuardrailsEnabled()` (could affect memory saves)

**Remaining risk**: `isGovernanceGuardrailsEnabled()` still defaults ON. If it gates save/ingest operations in a way that silently fails without governance metadata, it could cause similar issues for memory writes.

### F3: 538 of 1002 Memories Are Deprecated Tier (53.7%)

**Evidence**: Agent 5 ran `SELECT importance_tier, COUNT(*) FROM memory_index GROUP BY importance_tier` and found:
- deprecated: 538 (53.7%)
- normal: 374
- important: 71
- critical: 17
- constitutional: 1

Vector search excludes both `deprecated` AND `constitutional` tiers by default (line 162 of `vector-index-queries.ts`). This means vector search only queries ~46% of the database (462 memories). FTS5 search does NOT exclude deprecated (only `is_archived`), creating a channel asymmetry.

### F4: Silent Error Swallowing in Hybrid Search (P1)

**Evidence**: Agent 3 (review 003) found multiple `catch (_err) {}` blocks:
- Vector channel: `catch (_err) { /* Non-critical */ }` — completely silent
- Graph channel: same pattern
- `collectAndFuseHybridResults`: catches and returns `null` silently
- Only `ftsSearch` logs a `console.warn`, which is invisible to the MCP client

**Impact**: When any search channel throws (e.g., embedding dimension mismatch, SQLite vec error), the error is swallowed and the channel silently produces 0 results. Operators have no way to distinguish "no results found" from "search crashed."

### F5: Second Database File Discovered

**Evidence**: Agent 3's SQL exploration found `context-index__voyage__voyage-4__1024.sqlite` with 50 memories and 0 deprecated. This appears to be a profile-specific database (Voyage provider, voyage-4 model, 1024 dimensions) that may be used by some code paths but is separate from the main `context-index.sqlite` (1002 memories).

### F6: Quality Score Distribution Unknown

**Evidence**: Agents 4 and 5 attempted to query quality_score distribution but didn't complete the SQL. From earlier investigation: `quality_score` defaults to 0, and `filterByMinQualityScore` is called with `qualityThreshold` (which defaults to `undefined` in the handler). When undefined, the filter is a no-op. No immediate risk, but 0-quality memories could be an issue if a threshold is ever set.

### F7: Feature Flag Interaction Risk

**Evidence**: Agent 5 (review 005) found that `isFeatureEnabled()` in `rollout-policy.ts` returns `false` when `rolloutPercent < 100` AND no identity is provided (line 66: `if (!normalizedIdentity) return false`). Most search flags call `isFeatureEnabled(flagName)` without an identity parameter. If `SPECKIT_ROLLOUT_PERCENT` is ever set below 100, ALL identity-less flags silently disable — including search fallback, embedding expansion, cross-encoder reranking, etc.

## Recommendations

### Immediate (P0)
1. **[DONE]** Remove `minState` defaults since `memoryState` column doesn't exist
2. **[DONE]** Change `isScopeEnforcementEnabled()` to opt-in
3. **Investigate** `isGovernanceGuardrailsEnabled()` — same default-ON pattern, may affect saves

### Short-term (P1)
4. Add `console.error` to all silent catch blocks in hybrid search channels — at minimum log the error message
5. Add a startup check: if `minState` is configured but no memories have `memoryState`, log a warning
6. Document the second database file and its purpose

### Medium-term (P2)
7. Implement `memoryState` column and lifecycle (HOT→WARM→COLD→DORMANT→ARCHIVED) or remove the TRM filtering code entirely
8. Fix the `isFeatureEnabled()` identity-less fallback — flags without identity should return `true` when rollout >= 100, not `false`
9. Align deprecated tier handling between vector search (excludes) and FTS5 (includes)

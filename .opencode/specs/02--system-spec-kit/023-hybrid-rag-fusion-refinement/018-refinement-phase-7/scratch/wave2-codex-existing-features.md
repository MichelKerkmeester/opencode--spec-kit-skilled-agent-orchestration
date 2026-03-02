---
title: "Wave 2 - Codex Existing Features Tool Schema Verification"
source: "cli-codex (gpt-5.3-codex, read-only sandbox)"
date: 2026-03-02
note: "Codex gathered code evidence but hit session limit before producing formatted summary. Findings extracted from code exploration."
---

# Wave 2: Codex Existing Features Verification

## Verified Items (from code evidence gathered)

### 1. memory_context 5 modes — MATCH
Code shows `executeQuickStrategy`, `executeDeepStrategy`, `executeFocusedStrategy`, `executeResumeStrategy` + auto routing in handler. All 5 modes confirmed in `CONTEXT_MODES` record (line 242).

### 2. memory_search parameters — MATCH
Handler has: `minState`, `useDecay`, `includeConstitutional`, `bypassCache`, `autoDetectIntent`, `enableSessionBoost`, `enableCausalBoost`, `trackAccess`, `limit`, `rerank` — all documented parameters present.

### 3. memory_save asyncEmbedding — MATCH
`asyncEmbedding?: boolean` at line 187 of memory-save.ts. Implementation at lines 1066, 1189, 1827 confirms deferred embedding behavior.

### 4. memory_bulk_delete skipCheckpoint — MATCH
`skipCheckpoint?: boolean` at line 35 of memory-bulk-delete.ts. Constitutional/critical tier guard at line 66-67. Full implementation confirmed.

### 5. eval_run_ablation SPECKIT_ABLATION — MATCH
eval-reporting.ts line 59: checks for SPECKIT_ABLATION flag. Returns error message when disabled. Confirmed as opt-in (default OFF).

### 6. Dependency duplication (better-sqlite3, sqlite-vec) — CONFIRMED
Both packages at identical versions in scripts and mcp_server package.json.

### 7. Lifecycle tools dispatch — MATCH
lifecycle-tools.ts imports: `handleMemoryIndexScan`, `handleTaskPreflight`, `handleTaskPostflight`, `handleGetLearningHistory`, `handleEvalRunAblation`, `handleEvalReportingDashboard`.

## Items Not Fully Verified (session limit)

- Total tool count (23) — needs manual count from tool-schemas.ts
- Feature flag table (89 flags) — needs systematic verification
- Layer classification (L1-L7) consistency — needs handler routing check

## Assessment

All items Codex managed to reach in code were **MATCH**. No mismatches found. The session ended before completing the full checklist, but 7/7 checked items verified correctly.

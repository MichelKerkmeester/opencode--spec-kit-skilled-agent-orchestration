---
title: "Deep Dive - Gemini: SQL Safety & Data Integrity Audit"
source: "cli-gemini (gemini-3.1-pro-preview)"
date: 2026-03-02
---

# Deep Dive: SQL Safety & Data Integrity Audit

## 1. Template Literal SQL — NEW ISSUES FOUND

**P1 — Dynamic WHERE/ORDER BY clauses (not user-input injectable but fragile):**
- `handlers/memory-crud-list.ts` (L75, L79): `${whereClause}` and `${sortColumn}` in SELECT
- `lib/telemetry/consumption-logger.ts` (L190, L218): `${whereClause}` in COUNT queries
- `lib/cognitive/prediction-error-gate.ts` (L375-387): `${folderFilter}` in SELECT
- `lib/storage/mutation-ledger.ts` (L202): `${where}`, `${limit}`, `${offset}` in SELECT
- `lib/storage/causal-edges.ts` (L394): `${parts.join(', ')}` in UPDATE SET clause

**Assessment:** These are NOT user-input SQL injection vectors (values come from internal logic), but they bypass parameterization. The risk is P1 (code quality) not P0 (security), because the MCP server doesn't accept raw user SQL.

## 2. Transaction Boundaries — NEW ISSUES FOUND

**P1 — Missing transaction wrappers:**
- `memory-save.ts` (chunking): Parent record in tx, but child chunk inserts OUTSIDE tx
- `memory-save.ts` (normal): Main insert in tx, but causal links + entities + ledger OUTSIDE
- `memory-crud-delete.ts` (single): No tx wrapper — deleteMemory, deleteEdges, appendLedger are sequential
- `memory-bulk-delete.ts`: Delete tx correct, but `appendMutationLedgerSafe` is OUTSIDE tx (L191)
- `memory-crud-update.ts`: updateMemory and appendLedger not in single tx

**Assessment:** Low real-world risk under single-process better-sqlite3 (synchronous), but crash consistency is not guaranteed.

## 3. DDL in Transactions — ALREADY FIXED
Confirmed Phase 012 fix B2 applied. DDL runs before transactions in checkpoints.ts and all init paths.

## 4. UNION vs UNION ALL in Recursive CTEs — ALREADY FIXED
Confirmed Phase 012 fix C3 applied. `causal-boost.ts` uses UNION (not UNION ALL) in recursive CTE.
Other `UNION ALL` usages are standard (non-recursive) and safe.

## 5. Math.max/min Spread — INCOMPLETE FIX

**P1 — Remaining dangerous spread patterns:**
- `lib/search/rsf-fusion.ts` (L101-104, L210-211): `Math.max(...scoresA)`, `Math.min(...rawScores)`
- `lib/search/causal-boost.ts` (L227): `Math.min(...results.map(...))`
- `lib/search/evidence-gap-detector.ts` (L157): `Math.max(...rrfScores)`
- `lib/cognitive/prediction-error-gate.ts` (L484-485): `Math.min(...similarities)`
- `lib/telemetry/retrieval-telemetry.ts` (L184): `Math.max(...scores)`
- `lib/eval/reporting-dashboard.ts` (L303-304): `Math.min/max(...values)`

**Assessment:** These will stack overflow on arrays >100K elements. Real risk depends on data volume — currently safe but a ticking time bomb as corpus grows.

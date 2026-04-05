# Review: Agent 05 — Memory/Indexing

## Reliability Score: 88/100

**Rationale:** All 3 findings confirmed against source code with correct file:line citations. One input file (`context-agent-05-memory-indexing.md`) is missing — the build agent transparently acknowledges this (build file line 3) and compensated via direct static inspection. Line references have minor offset discrepancies (±3 lines) likely due to source edits between context and build runs, but all point to the correct code constructs. Evidence quality is HIGH for the 3 validated findings; coverage is MEDIUM because the missing context shard may have contained additional lower-severity findings that were not carried forward.

---

## P0 — BLOCKER (1)

### C09-001: DB marker path contract can silently diverge

- **Source:** `build-agent-05-memory-verify.md` lines 9–14
- **Evidence:**
  - `scripts/core/memory-indexer.ts:19` resolves `.db-updated` via `path.join(__dirname, '../../../mcp_server/database/.db-updated')` — hardcoded `__dirname`-relative traversal.
  - `mcp_server/core/config.ts:31-33` resolves `DATABASE_DIR` from `SPEC_KIT_DB_DIR` env var or `path.join(SERVER_DIR, 'database')` — CWD/env-dependent.
  - `mcp_server/core/config.ts:35` reads marker at `path.join(DATABASE_DIR, '.db-updated')`.
- **Impact:** If `SPEC_KIT_DB_DIR` is set, or if the compiled JS `__dirname` differs from the TS source layout, writer and reader resolve to different absolute paths. The MCP server will never see the indexer's "DB updated" signal — stale data served indefinitely until process restart.
- **Severity justification:** Silent data staleness with no error surfaced to user = P0.

---

## P1 — REQUIRED (1)

### C10-F002: Save-then-query not guaranteed (deferred indexing + scan cooldown)

- **Source:** `build-agent-05-memory-verify.md` lines 17–22
- **Evidence:**
  - `mcp_server/handlers/memory-save.ts:816-817` returns `status = 'deferred'` when embedding fails.
  - `mcp_server/handlers/memory-save.ts:849-851` reports deferred indexing message.
  - `mcp_server/handlers/memory-index.ts:240` rate-limits scans to `INDEX_SCAN_COOLDOWN`.
  - `mcp_server/core/config.ts:48` sets cooldown to 60 000 ms.
- **Impact:** A freshly saved memory may be invisible to vector search for ≥60 s. Callers (agents) that save-then-immediately-query will get stale results. The T306 async-retry mitigates but does not eliminate the window. BM25/FTS5 fallback partially compensates.
- **Severity justification:** Functional correctness issue with user-visible consequence, but not data loss — P1.

---

## P2 — SUGGESTION (1)

### C08-F003: Degraded-operation paths swallow errors silently

- **Source:** `build-agent-05-memory-verify.md` lines 24–31
- **Evidence:**
  - `scripts/core/memory-indexer.ts:32` — DB notification error logged, continues.
  - `scripts/core/memory-indexer.ts:89` — trigger extraction failure logged, falls back.
  - `scripts/core/memory-indexer.ts:146` — metadata update failure logged, continues.
  - `mcp_server/handlers/memory-save.ts:206` — vector search failure returns `[]`.
  - `mcp_server/handlers/memory-save.ts:288` — supersede failure returns `false`.
- **Impact:** Individual errors are swallowed, meaning a memory can be "saved" with partial metadata (no triggers, no embedding, no supersession). This is by-design resilience, but the caller receives no structured indication of degraded quality — only console warnings.
- **Severity justification:** Design trade-off (resilience over strictness). Not a bug, but a maintainability risk; surfacing a `warnings[]` array in the response would help. P2.

---

## Top Recommended Actions

1. **Unify DB marker path resolution** — Replace the hardcoded `__dirname`-relative path in `memory-indexer.ts:19` with the canonical `DATABASE_DIR` from `config.ts` (or import `DB_UPDATED_FILE` from config). Single source of truth eliminates divergence.
2. **Surface deferred-indexing status to callers** — When `status = 'deferred'`, include an estimated availability time or a `retryAfter` field so agent callers can wait or poll instead of querying stale data.
3. **Aggregate degraded-operation warnings into response** — Collect catch-block warnings into a `degradedPaths[]` array on the IndexResult, so callers can distinguish a fully-indexed memory from a partially-indexed one.

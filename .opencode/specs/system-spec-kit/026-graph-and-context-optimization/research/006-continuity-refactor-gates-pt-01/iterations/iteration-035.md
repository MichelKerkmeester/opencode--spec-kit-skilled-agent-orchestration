---
title: "Iteration 035 — Causal edges anchor-level schema DDL, index, migration"
iteration: 35
band: F
timestamp: 2026-04-11T13:13:33Z
worker: cli-codex gpt-5.4 xhigh fast
scope: q4_q8_causal_edges_schema
status: complete
focus: "Produce exact ALTER TABLE DDL, column types, FK semantics, new indexes, migration script, and 2-hop BFS query-plan analysis for causal_edges anchor-level retarget."
maps_to_questions: [Q4, Q8]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-035.md"]

---
# Iteration 035 — Causal edges anchor-level schema DDL, index, migration
## 1. Goal
Iteration 010 chose the small-change path: keep `causal_edges`, preserve the 2-hop BFS, and add anchor awareness instead of rebuilding around synthetic node ids. That still leaves a schema gap: phase 018 readers and writers need direct tuple addressing `(spec_folder, doc_path, anchor_id)`, not just legacy ids plus two anchor caches. Source: `research/iterations/iteration-010.md:23-40,77-94`.
What breaks without a tuple-aware schema:
- tuple-first callers must resolve into `memory_index` before they can enter the graph
- anchor ids like `summary` or `decisions` stay ambiguous without doc scope
- child-to-parent promotion from iteration 015 cannot be represented cleanly with one opaque endpoint id per side
- current BFS stays optimized for `source_id` / `target_id`, not tuple filters. Source: `research/iterations/iteration-015.md:87-98,118-122` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:430-469`.
## 2. Current schema (cited or best-effort)
I did not find a standalone `schema.sql` for `causal_edges` in the prompt-suggested paths. The live source of truth is `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:605-635,937-947`, with tests confirming the same shape at `.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:68-80,500-527`.
Packet-doc drift matters here: iteration 010 still says `source_memory_id` / `target_memory_id`; live code uses `source_id` / `target_id`. Source: `research/iterations/iteration-010.md:32-40,77-80`.
```sql
CREATE TABLE IF NOT EXISTS causal_edges (
  id INTEGER PRIMARY KEY, source_id TEXT NOT NULL, target_id TEXT NOT NULL,
  relation TEXT NOT NULL CHECK(relation IN ('caused','enabled','supersedes','contradicts','derived_from','supports')),
  strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
  evidence TEXT, extracted_at TEXT DEFAULT (datetime('now')), created_by TEXT DEFAULT 'manual', last_accessed TEXT,
  UNIQUE(source_id, target_id, relation)
);
CREATE INDEX IF NOT EXISTS idx_causal_source ON causal_edges(source_id);
CREATE INDEX IF NOT EXISTS idx_causal_target ON causal_edges(target_id);
CREATE INDEX IF NOT EXISTS idx_causal_relation ON causal_edges(relation);
CREATE INDEX IF NOT EXISTS idx_causal_strength ON causal_edges(strength DESC);
```
Neighbor identity already exists in `memory_index(spec_folder, file_path, anchor_id)` with `UNIQUE(spec_folder, file_path, anchor_id)`. Source: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2297-2358`.
## 3. Target schema
Iteration 010's two named columns remain part of the answer, but they are not enough alone. Anchors are only unique within a doc, and iteration 015 requires cross-packet promotion. Phase 018 therefore needs six additive tuple columns while keeping legacy ids as compatibility shadows.
### 3.1 Phase 018 additive DDL
```sql
ALTER TABLE causal_edges ADD COLUMN source_spec_folder TEXT;
ALTER TABLE causal_edges ADD COLUMN source_doc_path TEXT;
ALTER TABLE causal_edges ADD COLUMN source_anchor TEXT;
ALTER TABLE causal_edges ADD COLUMN target_spec_folder TEXT;
ALTER TABLE causal_edges ADD COLUMN target_doc_path TEXT;
ALTER TABLE causal_edges ADD COLUMN target_anchor TEXT;
CREATE INDEX IF NOT EXISTS idx_causal_edges_source_anchor ON causal_edges(source_spec_folder, source_doc_path, source_anchor, relation);
CREATE INDEX IF NOT EXISTS idx_causal_edges_target_anchor ON causal_edges(target_spec_folder, target_doc_path, target_anchor, relation);
CREATE UNIQUE INDEX IF NOT EXISTS idx_causal_edges_tuple_unique
  ON causal_edges(source_spec_folder, source_doc_path, COALESCE(source_anchor,''), target_spec_folder, target_doc_path, COALESCE(target_anchor,''), relation)
  WHERE source_spec_folder IS NOT NULL AND source_doc_path IS NOT NULL AND target_spec_folder IS NOT NULL AND target_doc_path IS NOT NULL;
```
Null rules:
- `source_spec_folder`, `source_doc_path`, `target_spec_folder`, `target_doc_path`: nullable during migration; `NOT NULL` after cutover
- `source_anchor`, `target_anchor`: nullable both during migration and after cutover because doc-level edges remain valid.
### 3.2 Post-cutover rebuild DDL
SQLite cannot swap the table-level `UNIQUE(source_id, target_id, relation)`, add new table-level `CHECK`s, or drop columns via `ALTER TABLE`; a rebuild is required after phase 019 removes mixed-mode callers.
```sql
CREATE TABLE causal_edges_v2 (
  id INTEGER PRIMARY KEY,
  source_spec_folder TEXT NOT NULL, source_doc_path TEXT NOT NULL, source_anchor TEXT,
  target_spec_folder TEXT NOT NULL, target_doc_path TEXT NOT NULL, target_anchor TEXT,
  relation TEXT NOT NULL CHECK(relation IN ('caused','enabled','supersedes','contradicts','derived_from','supports')),
  strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
  evidence TEXT, extracted_at TEXT DEFAULT (datetime('now')), created_by TEXT DEFAULT 'manual', last_accessed TEXT,
  CHECK(trim(source_spec_folder) <> ''), CHECK(trim(source_doc_path) <> ''),
  CHECK(source_anchor IS NULL OR (trim(source_anchor) <> '' AND source_anchor NOT LIKE '% %')),
  CHECK(trim(target_spec_folder) <> ''), CHECK(trim(target_doc_path) <> ''),
  CHECK(target_anchor IS NULL OR (trim(target_anchor) <> '' AND target_anchor NOT LIKE '% %'))
);
CREATE UNIQUE INDEX idx_causal_edges_v2_tuple_unique
  ON causal_edges_v2(source_spec_folder, source_doc_path, COALESCE(source_anchor,''), target_spec_folder, target_doc_path, COALESCE(target_anchor,''), relation);
CREATE INDEX idx_causal_edges_v2_source_anchor ON causal_edges_v2(source_spec_folder, source_doc_path, source_anchor, relation);
CREATE INDEX idx_causal_edges_v2_target_anchor ON causal_edges_v2(target_spec_folder, target_doc_path, target_anchor, relation);
```
### 3.3 Foreign-key behavior
Recommendation: no new SQLite FK on the tuple columns in phase 018. `CASCADE` would erase causal lineage; `SET NULL` would silently corrupt valid edges; the correct operational behavior here is logical `RESTRICT`, enforced by the write path and migration checks. If a future immutable `anchor_nodes` registry appears, that registry should use `ON DELETE RESTRICT`.
## 4. Column semantics
Anchor formats already accepted by repo tests:
- `DECISION-pipeline-003`, `DECISION-use-rrF-001`: `.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:70-78,170-178`
- `test/path.file#section`: `.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:634-640`
| Column | Purpose | Value contract | NULL meaning | Migration fill |
|---|---|---|---|---|
| `source_spec_folder` | source packet scope | `^[0-9A-Za-z._/-]+$` | unresolved legacy source | `memory_index.spec_folder` from `source_id` |
| `source_doc_path` | source doc identity | `^.+\\.md$` | unresolved legacy source | `COALESCE(canonical_file_path, file_path)` from `source_id` |
| `source_anchor` | source anchor | `^[A-Za-z0-9][A-Za-z0-9._:/#-]*$` | doc-level or unresolved legacy source | `memory_index.anchor_id` from `source_id` |
| `target_spec_folder` | target packet scope | `^[0-9A-Za-z._/-]+$` | unresolved legacy target | `memory_index.spec_folder` from `target_id` |
| `target_doc_path` | target doc identity | `^.+\\.md$` | unresolved legacy target | `COALESCE(canonical_file_path, file_path)` from `target_id` |
| `target_anchor` | target anchor | `^[A-Za-z0-9][A-Za-z0-9._:/#-]*$` | doc-level or unresolved legacy target | `memory_index.anchor_id` from `target_id` |
Rule: `NULL` in `*_anchor` is valid for doc-level edges; `NULL` in `*_spec_folder` or `*_doc_path` after backfill is not.
## 5. Indexes
Required indexes:
```sql
CREATE INDEX IF NOT EXISTS idx_causal_edges_source_anchor ON causal_edges(source_spec_folder, source_doc_path, source_anchor, relation);
CREATE INDEX IF NOT EXISTS idx_causal_edges_target_anchor ON causal_edges(target_spec_folder, target_doc_path, target_anchor, relation);
CREATE UNIQUE INDEX IF NOT EXISTS idx_causal_edges_tuple_unique
  ON causal_edges(source_spec_folder, source_doc_path, COALESCE(source_anchor,''), target_spec_folder, target_doc_path, COALESCE(target_anchor,''), relation)
  WHERE source_spec_folder IS NOT NULL AND source_doc_path IS NOT NULL AND target_spec_folder IS NOT NULL AND target_doc_path IS NOT NULL;
```
Why these are required:
- `idx_causal_edges_source_anchor`: forward 1-hop and recursive forward hops
- `idx_causal_edges_target_anchor`: reverse hops and `why` chains
- trailing `relation`: keeps contradiction and relation-filtered queries selective
- `idx_causal_edges_tuple_unique`: prevents duplicate tuple edges during dual-write mixed mode.
Why current indexes are insufficient:
- `idx_causal_source` / `idx_causal_target` only help if the caller already has legacy ids
- tuple-first BFS otherwise joins through `memory_index` or scans `causal_edges`
- `idx_causal_relation` and `idx_causal_strength` do not support endpoint lookups.
Keep the legacy indexes through phase 019.
## 6. Migration script
Packet safety posture already says "backup + test on copy first + rollback script ready." Source: `implementation-design.md:77-81` and `research/iterations/iteration-020.md:105-110`.
```sql
-- Step 0: outside the transaction, back up the DB, run on a copy first, capture baseline
SELECT COUNT(*) AS causal_edges_before FROM causal_edges;
BEGIN IMMEDIATE;
-- Step 1: add columns; gate each ALTER with PRAGMA table_info('causal_edges')
ALTER TABLE causal_edges ADD COLUMN source_spec_folder TEXT;
ALTER TABLE causal_edges ADD COLUMN source_doc_path TEXT;
ALTER TABLE causal_edges ADD COLUMN source_anchor TEXT;
ALTER TABLE causal_edges ADD COLUMN target_spec_folder TEXT;
ALTER TABLE causal_edges ADD COLUMN target_doc_path TEXT;
ALTER TABLE causal_edges ADD COLUMN target_anchor TEXT;
-- Step 2: backfill from memory_index when source_id / target_id resolve
UPDATE causal_edges
SET
  source_spec_folder = COALESCE(source_spec_folder, (SELECT mi.spec_folder FROM memory_index mi WHERE mi.id = CAST(causal_edges.source_id AS INTEGER))),
  source_doc_path = COALESCE(source_doc_path, (SELECT COALESCE(mi.canonical_file_path, mi.file_path) FROM memory_index mi WHERE mi.id = CAST(causal_edges.source_id AS INTEGER))),
  source_anchor = COALESCE(source_anchor, (SELECT mi.anchor_id FROM memory_index mi WHERE mi.id = CAST(causal_edges.source_id AS INTEGER))),
  target_spec_folder = COALESCE(target_spec_folder, (SELECT mi.spec_folder FROM memory_index mi WHERE mi.id = CAST(causal_edges.target_id AS INTEGER))),
  target_doc_path = COALESCE(target_doc_path, (SELECT COALESCE(mi.canonical_file_path, mi.file_path) FROM memory_index mi WHERE mi.id = CAST(causal_edges.target_id AS INTEGER))),
  target_anchor = COALESCE(target_anchor, (SELECT mi.anchor_id FROM memory_index mi WHERE mi.id = CAST(causal_edges.target_id AS INTEGER)))
WHERE source_spec_folder IS NULL OR source_doc_path IS NULL OR target_spec_folder IS NULL OR target_doc_path IS NULL;
-- Step 3: add tuple-aware indexes
CREATE INDEX IF NOT EXISTS idx_causal_edges_source_anchor ON causal_edges(source_spec_folder, source_doc_path, source_anchor, relation);
CREATE INDEX IF NOT EXISTS idx_causal_edges_target_anchor ON causal_edges(target_spec_folder, target_doc_path, target_anchor, relation);
CREATE UNIQUE INDEX IF NOT EXISTS idx_causal_edges_tuple_unique
  ON causal_edges(source_spec_folder, source_doc_path, COALESCE(source_anchor,''), target_spec_folder, target_doc_path, COALESCE(target_anchor,''), relation)
  WHERE source_spec_folder IS NOT NULL AND source_doc_path IS NOT NULL AND target_spec_folder IS NOT NULL AND target_doc_path IS NOT NULL;
-- Step 4: assertions
SELECT COUNT(*) AS causal_edges_after FROM causal_edges;
SELECT COUNT(*) AS unresolved_tuple_endpoints
FROM causal_edges
WHERE source_spec_folder IS NULL OR source_doc_path IS NULL OR target_spec_folder IS NULL OR target_doc_path IS NULL;
COMMIT;
-- Step 5: post-commit maintenance
ANALYZE;
VACUUM;
```
SQLite correction: `VACUUM` must run outside the transaction, so do not place it between `BEGIN` and `COMMIT`.
Invariants:
- `causal_edges_before == causal_edges_after`
- no row deletions during migration
- unresolved tuple endpoints must be inspected before tuple-only reads are enabled.
Idempotence:
- `CREATE INDEX IF NOT EXISTS` and `COALESCE(...)` backfill are safe to re-run
- `ALTER TABLE ... ADD COLUMN` is not; gate it with `PRAGMA table_info`.
## 7. Query plan analysis
Current BFS in `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:430-469` is id-based:
```sql
WITH RECURSIVE causal_walk(origin_id, node_id, hop_distance, walk_score) AS (
  SELECT ce.source_id, ce.target_id, 1, ... FROM causal_edges ce WHERE ce.source_id IN (?)
  UNION
  SELECT ce.target_id, ce.source_id, 1, ... FROM causal_edges ce WHERE ce.target_id IN (?)
  UNION
  SELECT cw.origin_id, CASE WHEN ce.source_id = cw.node_id THEN ce.target_id ELSE ce.source_id END, cw.hop_distance + 1, ...
  FROM causal_walk cw JOIN causal_edges ce ON ce.source_id = cw.node_id OR ce.target_id = cw.node_id
  WHERE cw.hop_distance < ?
)
SELECT node_id, MIN(hop_distance), MAX(walk_score) FROM causal_walk GROUP BY node_id;
```
Expected current plan:
- `SEARCH causal_edges USING INDEX idx_causal_source`
- `SEARCH causal_edges USING INDEX idx_causal_target`
- recursive arm uses `MULTI-INDEX OR` over the two legacy indexes.
Tuple-first BFS after migration should split forward and reverse branches instead of using one six-column `OR`:
```sql
WITH RECURSIVE walk(spec_folder, doc_path, anchor_id, hop_distance, walk_score) AS (
  SELECT ce.target_spec_folder, ce.target_doc_path, ce.target_anchor, 1, ...
  FROM causal_edges ce
  WHERE ce.source_spec_folder = :spec_folder AND ce.source_doc_path = :doc_path
    AND ((:anchor_id IS NULL AND ce.source_anchor IS NULL) OR ce.source_anchor = :anchor_id)
  UNION ALL
  SELECT ce.source_spec_folder, ce.source_doc_path, ce.source_anchor, 1, ...
  FROM causal_edges ce
  WHERE ce.target_spec_folder = :spec_folder AND ce.target_doc_path = :doc_path
    AND ((:anchor_id IS NULL AND ce.target_anchor IS NULL) OR ce.target_anchor = :anchor_id)
  UNION ALL
  SELECT ce.target_spec_folder, ce.target_doc_path, ce.target_anchor, walk.hop_distance + 1, ...
  FROM walk JOIN causal_edges ce
    ON ce.source_spec_folder = walk.spec_folder AND ce.source_doc_path = walk.doc_path
   AND ((ce.source_anchor IS NULL AND walk.anchor_id IS NULL) OR ce.source_anchor = walk.anchor_id)
  WHERE walk.hop_distance < 2
  UNION ALL
  SELECT ce.source_spec_folder, ce.source_doc_path, ce.source_anchor, walk.hop_distance + 1, ...
  FROM walk JOIN causal_edges ce
    ON ce.target_spec_folder = walk.spec_folder AND ce.target_doc_path = walk.doc_path
   AND ((ce.target_anchor IS NULL AND walk.anchor_id IS NULL) OR ce.target_anchor = walk.anchor_id)
  WHERE walk.hop_distance < 2
)
SELECT spec_folder, doc_path, anchor_id, MIN(hop_distance), MAX(walk_score) FROM walk GROUP BY spec_folder, doc_path, anchor_id;
```
Expected post-migration plan:
- forward arms: `SEARCH causal_edges USING INDEX idx_causal_edges_source_anchor`
- reverse arms: `SEARCH causal_edges USING INDEX idx_causal_edges_target_anchor`
- no `memory_index` join for already migrated rows
- temp b-tree only for final `GROUP BY`.
During phase 018/019, tuple-first readers should union this path with legacy-id fallback for rows that still lack tuple columns.
## 8. Backward-compat wrapper
```ts
type EndpointRef = { memoryId: string | number } | { specFolder: string; docPath: string; anchorId?: string | null };
function normalizeEndpoint(db, ref) {
  if ('memoryId' in ref) {
    const row = db.prepare(`
      SELECT CAST(id AS TEXT) AS legacy_id, spec_folder,
             COALESCE(canonical_file_path, file_path) AS doc_path, anchor_id
      FROM memory_index WHERE id = ? LIMIT 1
    `).get(ref.memoryId);
    return { legacyId: String(ref.memoryId), specFolder: row?.spec_folder ?? null, docPath: row?.doc_path ?? null, anchorId: row?.anchor_id ?? null };
  }
  const docPath = normalizeDocPath(ref.docPath);
  const row = db.prepare(`SELECT CAST(id AS TEXT) AS legacy_id FROM memory_index WHERE spec_folder = ? AND COALESCE(canonical_file_path, file_path) = ? AND ((anchor_id IS NULL AND ? IS NULL) OR anchor_id = ?) ORDER BY id DESC LIMIT 1`).get(ref.specFolder, docPath, ref.anchorId ?? null, ref.anchorId ?? null);
  return { legacyId: row?.legacy_id ?? null, specFolder: ref.specFolder, docPath, anchorId: ref.anchorId ?? null };
}
```
Timeline:
- 018.1 add columns, backfill, dual-read
- 018.2 dual-write tuple columns plus shadow ids
- 018.3 tuple-first readers, id fallback only
- 019 stop exposing raw `memoryId` as the primary public endpoint type
- 020 rebuild table and drop legacy ids.
## 9. Rollback
### 9.1 Soft rollback
```sql
BEGIN IMMEDIATE;
DROP INDEX IF EXISTS idx_causal_edges_source_anchor;
DROP INDEX IF EXISTS idx_causal_edges_target_anchor;
DROP INDEX IF EXISTS idx_causal_edges_tuple_unique;
COMMIT;
```
Use when runtime code needs a quick revert and leaving inert tuple columns in place is acceptable.
### 9.2 Hard rollback
SQLite column drops require a rebuild:
```sql
SELECT COUNT(*) AS rollback_before FROM causal_edges;
BEGIN IMMEDIATE;
CREATE TABLE causal_edges_rollback (
  id INTEGER PRIMARY KEY, source_id TEXT NOT NULL, target_id TEXT NOT NULL,
  relation TEXT NOT NULL CHECK(relation IN ('caused','enabled','supersedes','contradicts','derived_from','supports')),
  strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
  evidence TEXT, extracted_at TEXT DEFAULT (datetime('now')), created_by TEXT DEFAULT 'manual', last_accessed TEXT,
  UNIQUE(source_id, target_id, relation)
);
INSERT INTO causal_edges_rollback (id, source_id, target_id, relation, strength, evidence, extracted_at, created_by, last_accessed)
SELECT id, source_id, target_id, relation, strength, evidence, extracted_at, created_by, last_accessed FROM causal_edges;
DROP TABLE causal_edges;
ALTER TABLE causal_edges_rollback RENAME TO causal_edges;
CREATE INDEX IF NOT EXISTS idx_causal_source ON causal_edges(source_id);
CREATE INDEX IF NOT EXISTS idx_causal_target ON causal_edges(target_id);
CREATE INDEX IF NOT EXISTS idx_causal_relation ON causal_edges(relation);
CREATE INDEX IF NOT EXISTS idx_causal_strength ON causal_edges(strength DESC);
COMMIT;
SELECT COUNT(*) AS rollback_after FROM causal_edges;
VACUUM;
```
Rollback invariant: `rollback_before == rollback_after`.
## 10. Test scenarios
1. Pre-migration edge still resolves after backfill; row count unchanged; doc-level anchors remain `NULL`.
2. Post-migration edge written with full tuple columns is reachable by tuple-first BFS without a `memory_index` join.
3. Child-to-parent promotion edge preserves distinct source and target packet scopes. Source: `research/iterations/iteration-015.md:87-98,118-122`.
4. Mixed old+new 2-hop BFS works when hop 1 is tuple-addressed and hop 2 is legacy id-only.
5. Anchor ids with uppercase prefixes and special characters remain stable.
## 11. Ruled Out
- separate `anchor_nodes` table now: rejected because iteration 010 already preferred the additive path. Source: `research/iterations/iteration-010.md:50-80`
- only add `source_anchor` / `target_anchor`: rejected because anchors are not globally unique
- rename `source_id` / `target_id` in place: rejected because mixed-mode callers still exist
- JSON endpoint blob: rejected because BFS needs normal scalar indexes
- single shared `spec_folder` for both endpoints: rejected because cross-packet promotion becomes lossy.

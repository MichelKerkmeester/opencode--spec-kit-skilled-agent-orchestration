---
title: "Iteration 037 — Migration dry-run pipeline: snapshot, dual-fork, evidence collection"
iteration: 37
band: F
timestamp: 2026-04-11T13:24:06Z
worker: cli-codex gpt-5.4 xhigh fast
scope: q8_migration_dry_run
status: complete
focus: "Turn the Gate A/B migration rehearsal from prose guidance into a concrete pipeline: production snapshot strategy, dual-fork comparison method, validation queries, evidence collection format, rollback drill, go/no-go gate."
maps_to_questions: [Q8]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-037.md"]

---
# Iteration 037 — Migration dry-run pipeline

## 1. Goal
This iteration turns iteration 020's "rehearse on copy first" and iteration 028's Gate B DAG into an operator-ready pipeline for the phase 018 migration batch: add `memory_index.is_archived`, flip the legacy memory-file rows to `is_archived = 1`, and add the `causal_edges` anchor columns/indexes from iteration 035.

A successful rehearsal proves four things:
1. The migration wrapper is idempotent at the operator level.
2. Rollback restores logical equivalence to the original snapshot.
3. Row counts and stable row content are preserved except for the intended archive flip and additive schema fields.
4. Query behavior and latency stay within acceptable post-migration bounds.

Important nuance: the raw additive DDL is not idempotent by itself, so the entrypoint must guard `ALTER TABLE ... ADD COLUMN` with `PRAGMA table_info(...)` checks. The rehearsal therefore requires a second apply-on-already-migrated pass; "first run succeeded" is not enough.

## 2. Snapshot strategy
Use a full SQLite snapshot, not a table export. The rehearsal needs the real schema, indexes, and page-level behavior of the production DB.

| Method | Atomicity | Time | Disk cost | Fidelity | Verdict |
|---|---|---|---|---|---|
| SQLite `.backup` | High | Moderate | 1x DB | Excellent | Primary |
| Volume snapshot | High | Fastest | low incremental | Excellent | Good but infra-specific |
| `VACUUM INTO` | High enough | Moderate-slow | 1x DB | Excellent, clean file | Fallback |
| File copy with lock | Medium | Moderate | 1x DB | Good if perfect lock discipline | Reject by default |

Primary method: SQLite `.backup`. It is SQLite-native, online-safe, portable across environments, and does not require storage-admin privileges. Fallback: `VACUUM INTO` when the team wants a compact clean file or the runtime wrapper does not expose `.backup`.

Why not default to the other methods:
- Volume snapshots are great when already standardized, but they are not portable across laptop, VM, and managed-volume setups.
- File copy with lock is too easy to get wrong at 2am; the lock discipline becomes the real risk instead of the migration.

Recommendation:
- primary: `.backup`
- fallback: `VACUUM INTO`
- use volume snapshots only when the infra runbook already exists and is battle-tested

## 3. Rehearsal environment
Options are straightforward: dev laptop is fast but taint-prone, CI is clean but risky if sensitive snapshots leave the trusted boundary, and a separate staging DB is isolated and reproducible. The best default is a separate staging DB in the same trust boundary as production.

Why staging wins:
- cleaner than a laptop
- safer than broad CI artifact handling
- closest to the production operating model
- easy to retain and delete with policy controls

Data handling rule: assume the snapshot is sensitive. Memory files may contain prompts, logs, internal paths, issue links, and human-authored notes. Keep the original snapshot read-only, keep candidate forks ephemeral, and never upload the raw DB as a generic CI artifact.

## 4. Dual-fork comparison method
Do not compare production directly to a migrated copy. Create one immutable snapshot `S0`, then fork it twice:
- `fork-A-pre`: immutable baseline
- `fork-B-post`: mutable migration target

Pipeline:
1. Create `S0`.
2. Copy `S0` to `fork-A-pre.sqlite`.
3. Copy `S0` to `fork-B-post.sqlite`.
4. Capture baseline evidence from `fork-A-pre`.
5. Run the migration on `fork-B-post`.
6. Capture post-migration evidence from `fork-B-post`.
7. Rerun the migration on `fork-B-post` to prove idempotence.
8. Run rollback on `fork-B-post`.
9. Capture rollback evidence and compare the rolled-back fork to `fork-A-pre`.

Compare four surfaces:
- Schema diff: canonicalized `sqlite_master` output sorted by `type, name`.
- Row counts: at minimum `memory_index` and `causal_edges`.
- Sample rows: top 100 `memory_index` rows and top 100 `causal_edges` rows ordered by `id`; allowed drift is only `is_archived` on targeted memory rows and tuple-column fill-in for `causal_edges`.
- Search equivalence: fixed query replay using iteration 032 thresholds. Minimum classes: `resume`, `search:add_feature`, `search:fix_bug`, `search:refactor`, `search:understand`, `causal_graph`, `trigger_match`.

Class thresholds come from iteration 032, not ad-hoc judgment:
- `resume`: `weighted_overlap@3 >= 0.98` and `rank1_exact_match >= 0.95`
- `search:fix_bug`: `weighted_overlap@5 >= 0.95` and `rank1_in_top3 >= 0.90`
- `trigger_match`: exact target match stays perfect
- the other classes keep their existing iteration 032 bars unchanged

Performance evidence should include the fixed-query replay latency and two `EXPLAIN QUERY PLAN` captures for tuple lookups, one forward and one reverse. Expected outcome: post-migration tuple reads use `idx_causal_edges_source_anchor` and `idx_causal_edges_target_anchor`.

## 5. Validation query set
Capture these baseline values first from `fork-A-pre`:
- `N_memory_index`
- `N_memory_rows`
- `N_causal_edges`
- `N_archived_non_memory_pre`

For the first Gate B rehearsal, `N_archived_non_memory_pre` should be `0`. If future reruns already have non-memory archived rows for a legitimate reason, the guard becomes "post must equal baseline", not always literal zero.

```sql
-- Q1: row-count preservation
SELECT COUNT(*) FROM memory_index;
-- expected: pre = N_memory_index, post = N_memory_index, rollback = N_memory_index

-- Q2: targeted memory-file row count preserved
SELECT COUNT(*) FROM memory_index WHERE source_path LIKE '%/memory/%.md';
-- expected: pre = N_memory_rows, post = N_memory_rows, rollback = N_memory_rows

-- Q3: archive column appears only during migrated state
SELECT COUNT(*) FROM pragma_table_info('memory_index') WHERE name = 'is_archived';
-- expected: pre = 0, post = 1, rollback = 0 or baseline-equivalent after rebuild

-- Q4: all targeted memory-file rows are archived after migration
SELECT COUNT(*) FROM memory_index
WHERE is_archived = 1
  AND source_path LIKE '%/memory/%.md';
-- expected: post = N_memory_rows

-- Q5: nothing else is over-flipped
SELECT COUNT(*) FROM memory_index
WHERE is_archived = 1
  AND source_path NOT LIKE '%/memory/%.md';
-- expected: post = N_archived_non_memory_pre, first rehearsal target = 0

-- Q6: archive filter index exists in migrated state
SELECT COUNT(*) FROM sqlite_master
WHERE type = 'index' AND name = 'idx_is_archived';
-- expected: pre = 0, post = 1, rollback = 0 or baseline-equivalent

-- Q7: graph row count preserved
SELECT COUNT(*) FROM causal_edges;
-- expected: pre = N_causal_edges, post = N_causal_edges, rollback = N_causal_edges

-- Q8: all six tuple columns are present in migrated state
SELECT COUNT(*) FROM pragma_table_info('causal_edges')
WHERE name IN (
  'source_spec_folder',
  'source_doc_path',
  'source_anchor',
  'target_spec_folder',
  'target_doc_path',
  'target_anchor'
);
-- expected: pre = 0, post = 6, rollback = 0 or baseline-equivalent

-- Q9: tuple backfill resolved every endpoint
SELECT COUNT(*) FROM causal_edges
WHERE source_spec_folder IS NULL
   OR source_doc_path IS NULL
   OR target_spec_folder IS NULL
   OR target_doc_path IS NULL;
-- expected: post = 0

-- Q10: tuple uniqueness is intact
SELECT COUNT(*) FROM (
  SELECT
    source_spec_folder,
    source_doc_path,
    COALESCE(source_anchor, ''),
    target_spec_folder,
    target_doc_path,
    COALESCE(target_anchor, ''),
    relation,
    COUNT(*) AS n
  FROM causal_edges
  GROUP BY 1,2,3,4,5,6,7
  HAVING COUNT(*) > 1
);
-- expected: post = 0
```

Two additional non-blocking evidence captures should always be taken even though they are not part of Q1-Q10:
- `SELECT id, document_type, source_path, is_archived FROM memory_index ORDER BY id LIMIT 100;`
- `SELECT id, source_id, target_id, relation, source_spec_folder, source_doc_path, source_anchor, target_spec_folder, target_doc_path, target_anchor FROM causal_edges ORDER BY id LIMIT 100;`

## 6. Evidence collection format
Each rehearsal run produces one JSON report. The report is not a nice-to-have; it is the artifact that lets lead and tests sign off without re-reading terminal scrollback.

```json
{
  "run_id": "2026-04-11T13-24-06Z-gate-b-rehearsal-01",
  "snapshot_source": {
    "method": "sqlite_backup",
    "origin": "prod-db-2026-04-11",
    "db_size_bytes": 0
  },
  "timestamp": "2026-04-11T13:24:06Z",
  "forks": {
    "baseline": "fork-A-pre.sqlite",
    "candidate": "fork-B-post.sqlite"
  },
  "pre_row_counts": {
    "memory_index": 0,
    "memory_rows": 0,
    "causal_edges": 0
  },
  "post_row_counts": {
    "memory_index": 0,
    "memory_rows": 0,
    "causal_edges": 0
  },
  "diff": {
    "schema": {},
    "row_counts": {},
    "sample_rows": [],
    "warnings": []
  },
  "validation_queries": [
    {"id": "Q1", "expected": "N_memory_index", "actual": 0, "pass": true},
    {"id": "Q4", "expected": "N_memory_rows", "actual": 0, "pass": true}
  ],
  "search_equivalence": {
    "fixture": "gate-b-fixed-query-set-v1",
    "classes": {
      "resume": {"metric": "weighted_overlap@3", "actual": 0.0, "pass": true},
      "search:fix_bug": {"metric": "weighted_overlap@5", "actual": 0.0, "pass": true},
      "trigger_match": {"metric": "exact_target_match", "actual": 1.0, "pass": true}
    }
  },
  "rollback_test": {
    "ran": true,
    "pass": true,
    "equivalence_mode": "logical_not_bytewise"
  },
  "duration_s": 0,
  "go_no_go": "GO"
}
```

Required rules:
- store expected and actual together
- report pass/fail per query, not only one top-level verdict
- separate warnings from hard failures
- mark rollback equivalence as logical, not bytewise, because `.backup` and `VACUUM INTO` can change page layout without changing meaning

## 7. Rollback-from-rehearsal drill
Rollback is mandatory for every rehearsal. The operator starts from the already migrated `fork-B-post`, runs the real rollback path, reruns the validation set, and compares the rolled-back fork to `fork-A-pre`.

Promotion rule: use the hard rollback path for sign-off. The soft rollback from iteration 035 is useful for emergency retreat, but it leaves schema residue and therefore does not prove "back to baseline."

Rollback passes only if all of these are true:
- `memory_index` and `causal_edges` row counts match baseline
- baseline sample rows match again
- migrated-only columns and indexes are gone or the rebuilt schema is baseline-equivalent
- fixed-query replay returns to baseline behavior

If rollback fails, the rehearsal is `NO_GO`, the candidate fork is preserved for forensics, and the exact failing query ids plus schema diff are written into the report.

## 8. Go/no-go gate
Promote rehearsal to production readiness only if:
1. Q1-Q10 all pass.
2. The rerun is a clean no-op and does not change evidence.
3. Rollback passes.
4. No unexpected schema objects appear.
5. Search equivalence clears iteration 032 thresholds.
6. Post-migration latency is acceptable.
7. Lead and tests roles sign off, matching the handoff expectation from iteration 028.

Performance acceptance should be explicit: replay p95 latency should be no worse than `1.20x` baseline for the fixed query set, and the tuple lookup plans should show the expected source/target anchor indexes. If no freeze window is defined yet, require the rehearsal duration to fit within 50% of the planned production freeze window so the other 50% remains rollback headroom.

Decision rule:
- `GO`: all hard gates pass and warnings are either empty or explicitly accepted
- `NO_GO`: any hard query fails, any rollback mismatch exists, or any severe query-class breach occurs

## 9. Runbook
This is the sequence a junior engineer runs. Replace the placeholder migration commands with the actual phase 018 entrypoints when implementation lands.

| Step | Command | Expected output | What-if-fails |
|---:|---|---|---|
| 1 | `export RUN_ID="$(date -u +%Y%m%dT%H%M%SZ)-gate-b-rehearsal"` | run id set | stop and fix env |
| 2 | `mkdir -p "$WORKDIR/$RUN_ID"` | empty workspace exists | stop; do not reuse a dirty dir |
| 3 | `sqlite3 "$PROD_DB" ".backup '$WORKDIR/$RUN_ID/snapshot.sqlite'"` | snapshot file created | retry once, then abort |
| 4 | `cp "$WORKDIR/$RUN_ID/snapshot.sqlite" "$WORKDIR/$RUN_ID/fork-A-pre.sqlite"` | immutable baseline exists | abort if missing |
| 5 | `cp "$WORKDIR/$RUN_ID/snapshot.sqlite" "$WORKDIR/$RUN_ID/fork-B-post.sqlite"` | mutable candidate exists | abort if missing |
| 6 | `sqlite3 "$WORKDIR/$RUN_ID/fork-A-pre.sqlite" "<capture Q1-Q10 + samples>"` | baseline evidence written | abort before migration if capture fails |
| 7 | `<phase018-migrate-command> --db "$WORKDIR/$RUN_ID/fork-B-post.sqlite"` | migration exits 0 | stop, preserve fork, mark `NO_GO` |
| 8 | `sqlite3 "$WORKDIR/$RUN_ID/fork-B-post.sqlite" "<capture Q1-Q10 + samples>"` | post-migration hard checks pass | if not, skip sign-off and record exact failures |
| 9 | `<phase018-migrate-command> --db "$WORKDIR/$RUN_ID/fork-B-post.sqlite" --rerun` | clean no-op / already-applied exit | if rerun mutates state, idempotence failed |
| 10 | `replay-fixed-query-set --baseline "$WORKDIR/$RUN_ID/fork-A-pre.sqlite" --candidate "$WORKDIR/$RUN_ID/fork-B-post.sqlite"` | equivalence report passes | if any class breaches iteration 032, mark `NO_GO` |
| 11 | `<phase018-rollback-command> --db "$WORKDIR/$RUN_ID/fork-B-post.sqlite"` | rollback exits 0 | stop; promotion is blocked |
| 12 | `sqlite3 "$WORKDIR/$RUN_ID/fork-B-post.sqlite" "<capture Q1-Q10 + samples>"` | rollback evidence matches baseline | if not, mark `NO_GO` |
| 13 | `diff -u schema-pre.sql schema-rollback.sql` | empty or baseline-equivalent diff | non-empty diff defaults to `NO_GO` |
| 14 | `diff -u sample-memory-pre.csv sample-memory-rollback.csv` | no unexpected diff | if different, inspect stable columns, default `NO_GO` |
| 15 | `jq . "$WORKDIR/$RUN_ID/report.json"` | final report renders with `GO` or `NO_GO` | if report is missing, rehearsal is incomplete |

Operator rules:
- never mutate `fork-A-pre`
- never reuse an old candidate fork
- never accept soft rollback as certification
- never handwave a query breach as "close enough"

## 10. Ruled Out
Rejected strategies:
- Skip rehearsal and roll forward. Rejected because iteration 020 explicitly requires copy-first migration proof.
- Rehearse only a subset of rows. Rejected because the risk lives in full-table invariants, not sampled anecdotes.
- Single-fork rehearsal. Rejected because there is no immutable sibling to compare rollback against.
- Dev laptop as the default environment. Rejected because it is easy to taint and hard to trust for performance evidence.
- Soft rollback as the sign-off path. Rejected because it leaves schema residue behind.
- Raw file checksum equality as the rollback proof. Rejected because logical equivalence, not byte-for-byte identity, is the real success condition.

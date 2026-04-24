// ---------------------------------------------------------------
// MODULE: Cleanup Index Scope Violations
// ---------------------------------------------------------------

import Database from 'better-sqlite3';
import { load as loadSqliteVec } from 'sqlite-vec';
import { fileURLToPath } from 'node:url';

import { isMainModule } from '../lib/esm-entry.js';

interface CountRow {
  count: number;
}

interface MemoryIdRow {
  id: number;
  content_hash: string | null;
}

interface DuplicateRow {
  id: number;
  created_at: string | null;
}

interface ViolationSummary {
  constitutionalTotal: number;
  constitutionalInFolder: number;
  zFutureRows: number;
  externalRows: number;
  invalidConstitutionalRows: number;
  gateEnforcementDuplicates: number;
}

interface ApplySummary {
  deletedMemoryRows: number;
  deletedHistoryRows: number;
  deletedLineageRows: number;
  deletedVectorRows: number;
  deletedFeedbackRows: number;
  deletedOtherReferenceRows: number;
  deletedEmbeddingCacheRows: number;
  downgradedRows: number;
  rewrittenFeedbackRows: number;
  rewrittenLineageRows: number;
  rewrittenMutationLedgerRows: number;
  ftsCleanupStrategy: 'memory_index_trigger';
}

interface CleanupPlan {
  forbiddenIds: number[];
  forbiddenContentHashes: string[];
  duplicateOldIds: number[];
  duplicateSurvivorId: number | null;
  downgradeIds: number[];
}

const DB_PATH = fileURLToPath(
  new URL('../../../mcp_server/database/context-index__voyage__voyage-4__1024.sqlite', import.meta.url),
);

const HELP_TEXT = `
cleanup-index-scope-violations — Repair memory index scope and constitutional tier violations

Usage:
  node cleanup-index-scope-violations.js
  node cleanup-index-scope-violations.js --apply
  node cleanup-index-scope-violations.js --verify

Options:
  --apply     Execute the cleanup in one transaction
  --verify    Report whether the invariants currently hold (exit 0 clean, 1 violations)
  --help,-h   Show this help text
`;

function tableExists(database: InstanceType<typeof Database>, tableName: string): boolean {
  const row = database
    .prepare("SELECT 1 AS present FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1")
    .get(tableName) as { present?: number } | undefined;
  return row?.present === 1;
}

function countQuery(database: InstanceType<typeof Database>, sql: string, ...params: unknown[]): number {
  const row = database.prepare(sql).get(...params) as CountRow | undefined;
  return row?.count ?? 0;
}

function collectSummary(database: InstanceType<typeof Database>): ViolationSummary {
  return {
    constitutionalTotal: countQuery(
      database,
      "SELECT COUNT(*) AS count FROM memory_index WHERE importance_tier = 'constitutional'",
    ),
    constitutionalInFolder: countQuery(
      database,
      "SELECT COUNT(*) AS count FROM memory_index WHERE importance_tier = 'constitutional' AND file_path LIKE '%/constitutional/%'",
    ),
    zFutureRows: countQuery(
      database,
      "SELECT COUNT(*) AS count FROM memory_index WHERE file_path LIKE '%/z_future/%' OR spec_folder LIKE '%z_future%'",
    ),
    externalRows: countQuery(
      database,
      "SELECT COUNT(*) AS count FROM memory_index WHERE file_path LIKE '%/external/%'",
    ),
    invalidConstitutionalRows: countQuery(
      database,
      "SELECT COUNT(*) AS count FROM memory_index WHERE importance_tier = 'constitutional' AND file_path NOT LIKE '%/constitutional/%'",
    ),
    gateEnforcementDuplicates: countQuery(
      database,
      "SELECT COUNT(*) AS count FROM memory_index WHERE file_path LIKE '%/constitutional/gate-enforcement.md'",
    ),
  };
}

function buildPlan(database: InstanceType<typeof Database>): CleanupPlan {
  const forbiddenRows = database.prepare(`
    SELECT id, content_hash
    FROM memory_index
    WHERE file_path LIKE '%/z_future/%'
       OR spec_folder LIKE '%z_future%'
       OR file_path LIKE '%/external/%'
    ORDER BY id
  `).all() as MemoryIdRow[];

  const duplicateRows = database.prepare(`
    SELECT id, created_at
    FROM memory_index
    WHERE file_path LIKE '%/constitutional/gate-enforcement.md'
    ORDER BY created_at DESC, id DESC
  `).all() as DuplicateRow[];

  const duplicateSurvivorId = duplicateRows.length > 0 ? duplicateRows[0].id : null;
  const duplicateOldIds = duplicateRows.slice(1).map(row => row.id);
  const excludedDowngradeIds = new Set<number>([
    ...forbiddenRows.map(row => row.id),
    ...duplicateOldIds,
  ]);

  const downgradeRows = database.prepare(`
    SELECT id
    FROM memory_index
    WHERE importance_tier = 'constitutional'
      AND file_path NOT LIKE '%/constitutional/%'
    ORDER BY id
  `).all() as Array<{ id: number }>;

  return {
    forbiddenIds: forbiddenRows.map(row => row.id),
    forbiddenContentHashes: forbiddenRows
      .map(row => row.content_hash)
      .filter((value): value is string => typeof value === 'string' && value.length > 0),
    duplicateOldIds,
    duplicateSurvivorId,
    downgradeIds: downgradeRows
      .map(row => row.id)
      .filter(id => !excludedDowngradeIds.has(id)),
  };
}

function placeholders(values: readonly number[]): string {
  return values.map(() => '?').join(', ');
}

function deleteRows(
  database: InstanceType<typeof Database>,
  tableName: string,
  columnClauses: string[],
  ids: readonly number[],
): number {
  if (ids.length === 0 || !tableExists(database, tableName)) {
    return 0;
  }

  const clause = columnClauses
    .map(column => `${column} IN (${placeholders(ids)})`)
    .join(' OR ');
  const statement = `DELETE FROM ${tableName} WHERE ${clause}`;
  const params = columnClauses.flatMap(() => ids);
  return database.prepare(statement).run(...params).changes;
}

function deleteRowsByTextMemoryId(
  database: InstanceType<typeof Database>,
  tableName: string,
  columnName: string,
  ids: readonly number[],
): number {
  if (ids.length === 0 || !tableExists(database, tableName)) {
    return 0;
  }

  const stringIds = ids.map(String);
  const statement = `DELETE FROM ${tableName} WHERE ${columnName} IN (${stringIds.map(() => '?').join(', ')})`;
  return database.prepare(statement).run(...stringIds).changes;
}

function rewriteDuplicateReferences(
  database: InstanceType<typeof Database>,
  oldId: number,
  survivorId: number,
): Pick<ApplySummary, 'rewrittenFeedbackRows' | 'rewrittenLineageRows' | 'rewrittenMutationLedgerRows'> {
  let rewrittenFeedbackRows = 0;
  let rewrittenLineageRows = 0;
  let rewrittenMutationLedgerRows = 0;

  if (tableExists(database, 'memory_lineage')) {
    rewrittenLineageRows += database.prepare(
      'UPDATE memory_lineage SET root_memory_id = ? WHERE root_memory_id = ?',
    ).run(survivorId, oldId).changes;
    rewrittenLineageRows += database.prepare(
      'UPDATE memory_lineage SET predecessor_memory_id = ? WHERE predecessor_memory_id = ?',
    ).run(survivorId, oldId).changes;
    rewrittenLineageRows += database.prepare(
      'UPDATE memory_lineage SET superseded_by_memory_id = ? WHERE superseded_by_memory_id = ?',
    ).run(survivorId, oldId).changes;
  }

  if (tableExists(database, 'feedback_events')) {
    rewrittenFeedbackRows += database.prepare(
      'UPDATE feedback_events SET memory_id = ? WHERE memory_id = ?',
    ).run(String(survivorId), String(oldId)).changes;
  }

  return {
    rewrittenFeedbackRows,
    rewrittenLineageRows,
    rewrittenMutationLedgerRows,
  };
}

function stripDeletedIdsFromMutationLedger(
  _database: InstanceType<typeof Database>,
  _deletedIds: readonly number[],
): number {
  return 0;
}

function cleanupEmbeddingCache(
  database: InstanceType<typeof Database>,
  contentHashes: readonly string[],
): number {
  if (contentHashes.length === 0 || !tableExists(database, 'embedding_cache')) {
    return 0;
  }

  let deletedRows = 0;
  const uniqueHashes = Array.from(new Set(contentHashes));
  const hasSurvivorStatement = database.prepare(
    'SELECT 1 FROM memory_index WHERE content_hash = ? LIMIT 1',
  );
  const deleteStatement = database.prepare(
    'DELETE FROM embedding_cache WHERE content_hash = ?',
  );

  for (const contentHash of uniqueHashes) {
    const survivor = hasSurvivorStatement.get(contentHash) as { 1?: number } | undefined;
    if (survivor) {
      continue;
    }
    deletedRows += deleteStatement.run(contentHash).changes;
  }

  return deletedRows;
}

function applyCleanup(database: InstanceType<typeof Database>, plan: CleanupPlan): ApplySummary {
  const idsToDelete = Array.from(new Set([...plan.forbiddenIds, ...plan.duplicateOldIds]));
  const summary: ApplySummary = {
    deletedMemoryRows: 0,
    deletedHistoryRows: 0,
    deletedLineageRows: 0,
    deletedVectorRows: 0,
    deletedFeedbackRows: 0,
    deletedOtherReferenceRows: 0,
    deletedEmbeddingCacheRows: 0,
    downgradedRows: 0,
    rewrittenFeedbackRows: 0,
    rewrittenLineageRows: 0,
    rewrittenMutationLedgerRows: 0,
    ftsCleanupStrategy: 'memory_index_trigger',
  };

  if (plan.duplicateSurvivorId !== null) {
    for (const oldId of plan.duplicateOldIds) {
      const rewritten = rewriteDuplicateReferences(database, oldId, plan.duplicateSurvivorId);
      summary.rewrittenFeedbackRows += rewritten.rewrittenFeedbackRows;
      summary.rewrittenLineageRows += rewritten.rewrittenLineageRows;
      summary.rewrittenMutationLedgerRows += rewritten.rewrittenMutationLedgerRows;
    }
  }

  summary.rewrittenMutationLedgerRows += stripDeletedIdsFromMutationLedger(database, idsToDelete);

  summary.deletedHistoryRows += deleteRows(database, 'memory_history', ['memory_id'], idsToDelete);
  summary.deletedLineageRows += deleteRows(
    database,
    'memory_lineage',
    ['memory_id', 'root_memory_id', 'predecessor_memory_id', 'superseded_by_memory_id'],
    idsToDelete,
  );
  summary.deletedVectorRows += deleteRows(database, 'vec_memories', ['rowid'], idsToDelete);
  summary.deletedFeedbackRows += deleteRowsByTextMemoryId(database, 'feedback_events', 'memory_id', idsToDelete);

  summary.deletedOtherReferenceRows += deleteRows(database, 'active_memory_projection', ['root_memory_id', 'active_memory_id'], idsToDelete);
  summary.deletedOtherReferenceRows += deleteRowsByTextMemoryId(database, 'batch_learning_log', 'memory_id', idsToDelete);
  summary.deletedOtherReferenceRows += deleteRows(database, 'community_assignments', ['memory_id'], idsToDelete);
  summary.deletedOtherReferenceRows += deleteRows(database, 'degree_snapshots', ['memory_id'], idsToDelete);
  summary.deletedOtherReferenceRows += deleteRows(database, 'governance_audit', ['memory_id'], idsToDelete);
  summary.deletedOtherReferenceRows += deleteRows(database, 'learned_feedback_audit', ['memory_id'], idsToDelete);
  summary.deletedOtherReferenceRows += deleteRows(database, 'memory_conflicts', ['new_memory_id', 'existing_memory_id'], idsToDelete);
  summary.deletedOtherReferenceRows += deleteRows(database, 'memory_corrections', ['original_memory_id', 'correction_memory_id'], idsToDelete);
  summary.deletedOtherReferenceRows += deleteRows(database, 'memory_entities', ['memory_id'], idsToDelete);
  summary.deletedOtherReferenceRows += deleteRows(database, 'memory_summaries', ['memory_id'], idsToDelete);
  summary.deletedOtherReferenceRows += deleteRows(database, 'negative_feedback_events', ['memory_id'], idsToDelete);
  summary.deletedOtherReferenceRows += deleteRows(database, 'scoring_observations', ['memory_id'], idsToDelete);
  summary.deletedOtherReferenceRows += deleteRows(database, 'session_sent_memories', ['memory_id'], idsToDelete);
  summary.deletedOtherReferenceRows += deleteRows(database, 'working_memory', ['memory_id'], idsToDelete);

  if (idsToDelete.length > 0) {
    summary.deletedMemoryRows += deleteRows(database, 'memory_index', ['id'], idsToDelete);
  }

  if (plan.downgradeIds.length > 0) {
    summary.downgradedRows += database.prepare(`
      UPDATE memory_index
      SET importance_tier = 'important'
      WHERE id IN (${placeholders(plan.downgradeIds)})
    `).run(...plan.downgradeIds).changes;
  }

  summary.deletedEmbeddingCacheRows += cleanupEmbeddingCache(database, plan.forbiddenContentHashes);

  return summary;
}

function printSummary(label: string, summary: ViolationSummary): void {
  console.log(`${label}:`);
  console.log(`  constitutional_total=${summary.constitutionalTotal}`);
  console.log(`  constitutional_in_folder=${summary.constitutionalInFolder}`);
  console.log(`  z_future_rows=${summary.zFutureRows}`);
  console.log(`  external_rows=${summary.externalRows}`);
  console.log(`  invalid_constitutional_rows=${summary.invalidConstitutionalRows}`);
  console.log(`  gate_enforcement_rows=${summary.gateEnforcementDuplicates}`);
}

function printApplySummary(summary: ApplySummary): void {
  console.log('Applied changes:');
  console.log(`  deleted_memory_rows=${summary.deletedMemoryRows}`);
  console.log(`  deleted_history_rows=${summary.deletedHistoryRows}`);
  console.log(`  deleted_lineage_rows=${summary.deletedLineageRows}`);
  console.log(`  deleted_vector_rows=${summary.deletedVectorRows}`);
  console.log(`  deleted_feedback_rows=${summary.deletedFeedbackRows}`);
  console.log(`  deleted_other_reference_rows=${summary.deletedOtherReferenceRows}`);
  console.log(`  deleted_embedding_cache_rows=${summary.deletedEmbeddingCacheRows}`);
  console.log(`  downgraded_rows=${summary.downgradedRows}`);
  console.log(`  rewritten_feedback_rows=${summary.rewrittenFeedbackRows}`);
  console.log(`  rewritten_lineage_rows=${summary.rewrittenLineageRows}`);
  console.log(`  rewritten_mutation_ledger_rows=${summary.rewrittenMutationLedgerRows}`);
  console.log(`  fts_cleanup_strategy=${summary.ftsCleanupStrategy}`);
}

async function main(): Promise<void> {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  const apply = process.argv.includes('--apply');
  const verify = process.argv.includes('--verify');
  const database = new Database(DB_PATH);

  try {
    loadSqliteVec(database);
    const before = collectSummary(database);
    const plan = buildPlan(database);

    printSummary('Before', before);
    console.log('Planned actions:');
    console.log(`  would_delete_memory_rows=${plan.forbiddenIds.length + plan.duplicateOldIds.length}`);
    console.log(`  would_delete_z_future_or_external_rows=${plan.forbiddenIds.length}`);
    console.log(`  would_delete_duplicate_gate_rows=${plan.duplicateOldIds.length}`);
    console.log(`  would_downgrade_rows=${plan.downgradeIds.length}`);
    console.log(`  duplicate_survivor_id=${plan.duplicateSurvivorId ?? 'none'}`);

    if (verify) {
      const hasViolations = before.zFutureRows > 0
        || before.externalRows > 0
        || before.invalidConstitutionalRows > 0
        || before.gateEnforcementDuplicates > 1;
      process.exit(hasViolations ? 1 : 0);
    }

    if (!apply) {
      console.log('Dry-run only. Re-run with --apply to mutate the database.');
      process.exit(0);
    }

    const tx = database.transaction(() => applyCleanup(database, plan));
    const applied = tx();
    const after = collectSummary(database);

    printApplySummary(applied);
    printSummary('After', after);
    process.exit(0);
  } catch (error: unknown) {
    console.error('[cleanup-index-scope-violations] Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  } finally {
    database.close();
  }
}

if (isMainModule(import.meta.url)) {
  void main();
}

export { main };

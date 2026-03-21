// ---------------------------------------------------------------
// MODULE: Cleanup Orphaned Vectors
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. CLEANUP ORPHANED VECTORS
// ───────────────────────────────────────────────────────────────
// Database maintenance — removes orphaned vector embeddings and history entries

// External packages
import Database from 'better-sqlite3';
import { load as loadSqliteVec } from 'sqlite-vec';

// Shared config
import { DB_PATH } from '@spec-kit/shared/paths';

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES
------------------------------------------------------------------*/

interface CountResult {
  count: number;
}

/* ───────────────────────────────────────────────────────────────
   2. CONFIGURATION
------------------------------------------------------------------*/

const dbPath: string = DB_PATH;

/* ───────────────────────────────────────────────────────────────
   2.1 HELP TEXT
------------------------------------------------------------------*/

const HELP_TEXT = `
cleanup-orphaned-vectors — Remove orphaned vector embeddings and history entries

Usage: node cleanup-orphaned-vectors.js [options]

Options:
  --dry-run           Preview what would be deleted without making changes
  --help, -h          Show this help message

Examples:
  node cleanup-orphaned-vectors.js                # Run cleanup
  node cleanup-orphaned-vectors.js --dry-run      # Preview only
`;

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(HELP_TEXT);
  process.exit(0);
}

/* ───────────────────────────────────────────────────────────────
   3. MAIN FUNCTION
------------------------------------------------------------------*/

async function main(): Promise<void> {
  const dryRun: boolean = process.argv.includes('--dry-run');
  let database: InstanceType<typeof Database> | null = null;
  try {
    if (dryRun) {
      console.log('=== DRY-RUN MODE — no changes will be made ===\n');
    }
    console.log('Opening database:', dbPath);
    database = new Database(dbPath);
    loadSqliteVec(database);

    let totalCleaned = 0;

    // STEP 1: Discover orphaned entries across all tables
    console.log('\n[Step 1] Finding orphaned memory_history entries...');
    let orphanedHistoryCount = 0;
    let hasHistoryTable = true;
    try {
      const orphanedHistory = database.prepare(`
        SELECT COUNT(*) as count
        FROM memory_history h
        LEFT JOIN memory_index m ON h.memory_id = m.id
        WHERE m.id IS NULL
      `).get() as CountResult;

      orphanedHistoryCount = orphanedHistory.count;

      if (orphanedHistoryCount > 0) {
        console.log(`Found ${orphanedHistoryCount} orphaned history entries`);
      } else {
        console.log('No orphaned history entries found');
      }
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      if (errMsg.includes('no such table')) {
        hasHistoryTable = false;
      } else {
        console.warn('memory_history discovery warning:', errMsg);
      }
    }

    console.log('\n[Step 2] Finding orphaned vector entries...');
    const orphanedVectors = database.prepare(`
      SELECT COUNT(*) as count
      FROM vec_memories v
      LEFT JOIN memory_index m ON v.rowid = m.id
      WHERE m.id IS NULL
    `).get() as CountResult;

    const orphanedVectorCount = orphanedVectors.count;
    console.log(`Found ${orphanedVectorCount} orphaned vectors`);

    // STEP 2: Delete all orphans in a single atomic transaction
    // ISS-B04-002 fix — wrapping history + vector cleanup in one
    // Transaction prevents partial commits on mid-run failure.
    if (dryRun) {
      if (orphanedHistoryCount > 0) {
        console.log(`[DRY-RUN] Would delete ${orphanedHistoryCount} orphaned history entries`);
        totalCleaned += orphanedHistoryCount;
      }
      if (orphanedVectorCount > 0) {
        console.log(`[DRY-RUN] Would delete ${orphanedVectorCount} orphaned vectors`);
        totalCleaned += orphanedVectorCount;
      }
    } else if (orphanedHistoryCount > 0 || orphanedVectorCount > 0) {
      console.log('\n[Step 3] Deleting all orphans in a single atomic transaction...');

      const atomicCleanup = database.transaction(() => {
        if (!database) throw new Error('Database connection lost');

        // Delete orphaned history entries
        if (hasHistoryTable && orphanedHistoryCount > 0) {
          const historyDeleteResult = database.prepare(`
            DELETE FROM memory_history
            WHERE memory_id NOT IN (SELECT id FROM memory_index)
          `).run();
          console.log(`Deleted ${historyDeleteResult.changes} orphaned history entries`);
          totalCleaned += historyDeleteResult.changes;
        }

        // Delete orphaned vector entries
        if (orphanedVectorCount > 0) {
          const vectorDeleteResult = database.prepare(`
            DELETE FROM vec_memories
            WHERE rowid NOT IN (SELECT id FROM memory_index)
          `).run();
          console.log(`Deleted ${vectorDeleteResult.changes} orphaned vectors`);
          totalCleaned += vectorDeleteResult.changes;
        }
      });

      atomicCleanup();
      console.log(`Atomic cleanup committed: ${totalCleaned} total entries removed`);
    }

    // STEP 4: Verify and report
    console.log('\n[Step 4] Verification...');
    const memoryCount: CountResult = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as CountResult;
    const vectorCount: CountResult = database.prepare('SELECT COUNT(*) as count FROM vec_memories').get() as CountResult;

    let historyCount: CountResult = { count: 0 };
    try {
      historyCount = database.prepare('SELECT COUNT(*) as count FROM memory_history').get() as CountResult;
    } catch (_e: unknown) {
      if (_e instanceof Error) {
        // Table may not exist
      }
    }

    console.log('\nFinal counts:');
    console.log(`  Memories: ${memoryCount.count}`);
    console.log(`  Vectors:  ${vectorCount.count}`);
    console.log(`  History:  ${historyCount.count}`);
    console.log(`\nTotal cleaned: ${totalCleaned}${dryRun ? ' (dry-run, nothing actually deleted)' : ''}`);

    database.close();
    console.log(`\nCleanup ${dryRun ? 'preview' : 'completed'} successfully`);
    process.exit(0);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[cleanup-orphaned-vectors] Error:', errMsg);
    if (database) {
      try {
        database.close();
      } catch (_closeErr: unknown) {
        if (_closeErr instanceof Error) {
          // Ignore close errors
        }
      }
    }
    process.exit(1);
  }
}

/* ───────────────────────────────────────────────────────────────
   4. INITIALIZE
------------------------------------------------------------------*/

if (require.main === module) {
  main();
}

/* ───────────────────────────────────────────────────────────────
   5. EXPORTS
------------------------------------------------------------------*/

export { main };

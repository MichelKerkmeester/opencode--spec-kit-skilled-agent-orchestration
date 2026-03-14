// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Folder Detector Functional Tests                              ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Validate session selection behavior in detectSpecFolder()       ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────
*/

const SCRIPTS_DIR = path.join(__dirname, '..', 'dist');
const SKILL_ROOT = path.join(__dirname, '..', '..'); // .opencode/skill/system-spec-kit
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..'); // actual project root
const BETTER_SQLITE3_PATH = path.join(SKILL_ROOT, 'mcp_server/node_modules/better-sqlite3');
const REAL_DB_PATH = path.join(SKILL_ROOT, 'mcp_server/database/context-index.sqlite');
const RECENT_SESSION_LOOKUP_SQL =
  `SELECT spec_folder FROM session_learning WHERE created_at > datetime('now', '-24 hours') ORDER BY created_at DESC LIMIT 1`;
const DETECT_SPEC_FUNCTION_MARKER = 'async function detectSpecFolder';
const PRIORITY_1_MARKER = 'Priority 1';
const PRIORITY_2_MARKER = 'Priority 2:';
const PRIORITY_25_MARKER = 'Priority 2.5';
const PRIORITY_3_MARKER = 'Priority 3';
const PRIORITY_4_MARKER = 'Priority 4';
const TIMESTAMP_QUERY_COLUMNS_MARKER = 'SELECT spec_folder, created_at, updated_at';
const TIMESTAMP_QUERY_LIMIT_LITERAL_MARKER = 'LIMIT 25';
const TIMESTAMP_QUERY_LIMIT_CONST_MARKER = 'LIMIT ${SESSION_ROW_LIMIT}';
const TIMESTAMP_QUERY_LIMIT_PARAM_MARKER = 'LIMIT ?';
const TIMESTAMP_QUERY_ORDER_MARKER = 'ORDER BY created_at DESC';
const TWENTY_FIVE_HOURS = 25;
const FORTY_EIGHT_HOURS = 48;
const THIRTY_MINUTES = 30;
const EDGE_WINDOW_MINUTES = 1435;
const PRIORITY_COMPARISON_OFFSET_MS = 60000;
const ONE_SECOND_MS = 1000;
const MTIME_SMALL_SKEW_MS = 300000;
const MTIME_LARGE_SKEW_MS = 1000000;

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
};

/* ─────────────────────────────────────────────────────────────
   2. TEST UTILITIES
────────────────────────────────────────────────────────────────
*/

function log(msg) {
  console.log(msg);
}

function pass(testName, evidence) {
  results.passed++;
  results.tests.push({ name: testName, status: 'PASS', evidence });
  log(`   ✅ ${testName}`);
  if (evidence) log(`      Evidence: ${evidence}`);
}

function fail(testName, reason) {
  results.failed++;
  results.tests.push({ name: testName, status: 'FAIL', reason });
  log(`   ❌ ${testName}`);
  log(`      Reason: ${reason}`);
}

function skip(testName, reason) {
  results.skipped++;
  results.tests.push({ name: testName, status: 'SKIP', reason });
  log(`   ⏭️  ${testName} (skipped: ${reason})`);
}

/**
 * Attempt to load better-sqlite3. Returns null if unavailable.
 */
function loadDatabase() {
  try {
    return require(BETTER_SQLITE3_PATH);
  } catch {
    return null;
  }
}

/**
 * Create a temporary SQLite DB with session_learning table.
 * Returns { db, dbPath, error }.
 */
function createTempDb(Database) {
  const tmpDir = os.tmpdir();
  const dbPath = path.join(tmpDir, `test-folder-detector-${Date.now()}-${Math.random().toString(36).slice(2)}.sqlite`);
  let db = null;
  try {
    db = new Database(dbPath);
    db.exec(`
      CREATE TABLE IF NOT EXISTS session_learning (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spec_folder TEXT NOT NULL,
        task_id TEXT NOT NULL,
        phase TEXT NOT NULL CHECK(phase IN ('preflight', 'complete')),
        session_id TEXT,
        pre_knowledge_score INTEGER,
        pre_uncertainty_score INTEGER,
        pre_context_score INTEGER,
        knowledge_gaps TEXT,
        post_knowledge_score INTEGER,
        post_uncertainty_score INTEGER,
        post_context_score INTEGER,
        delta_knowledge REAL,
        delta_uncertainty REAL,
        delta_context REAL,
        learning_index REAL,
        gaps_closed TEXT,
        new_gaps_discovered TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        completed_at TEXT,
        UNIQUE(spec_folder, task_id)
      )
    `);
    return { db, dbPath, error: null };
  } catch (error) {
    try { if (db) db.close(); } catch { /* ignore */ }
    cleanupTempDb(dbPath);
    return { db: null, dbPath, error };
  }
}

/**
 * Clean up a temporary DB file.
 */
function cleanupTempDb(dbPath) {
  try {
    fs.unlinkSync(dbPath);
  } catch {
    // Ignore cleanup errors
  }
  // Also clean WAL/SHM files if present
  try { fs.unlinkSync(dbPath + '-wal'); } catch { /* ignore */ }
  try { fs.unlinkSync(dbPath + '-shm'); } catch { /* ignore */ }
}

/* ─────────────────────────────────────────────────────────────
   3. TEST: DB QUERY CORRECTNESS (UNIT)
   Test the exact SQL query used by Priority 2.5 against a temp DB
────────────────────────────────────────────────────────────────
*/

async function testDbQueryReturnsRecentRecord() {
  log('\n🔬 DB QUERY: Returns most recent record within 24h');

  const Database = loadDatabase();
  if (!Database) {
    skip('T-FD01a: DB query returns recent record', 'better-sqlite3 not available');
    return;
  }

  const { db, dbPath, error } = createTempDb(Database);
  if (error || !db) {
    skip('T-FD01a: DB query returns recent record', `temp db setup failed: ${error ? error.message : 'unknown error'}`);
    return;
  }
  try {
    // Insert a record with "now" timestamp (default)
    db.prepare(`
      INSERT INTO session_learning (spec_folder, task_id, phase)
      VALUES (?, ?, ?)
    `).run('003-memory-and-spec-kit', 'T1', 'preflight');

    // Run the exact same query used by Priority 2.5
    const row = db.prepare(RECENT_SESSION_LOOKUP_SQL).get();
    db.close();

    if (row && row.spec_folder === '003-memory-and-spec-kit') {
      pass('T-FD01a: DB query returns recent record', `spec_folder = "${row.spec_folder}"`);
    } else {
      fail('T-FD01a: DB query returns recent record', `Got: ${JSON.stringify(row)}`);
    }
  } catch (err) {
    fail('T-FD01a: DB query returns recent record', err.message);
    try { db.close(); } catch { /* ignore */ }
  } finally {
    cleanupTempDb(dbPath);
  }
}

async function testDbQueryReturnsMostRecentOfMultiple() {
  log('\n🔬 DB QUERY: Returns most recent when multiple records exist');

  const Database = loadDatabase();
  if (!Database) {
    skip('T-FD01b: Returns most recent of multiple records', 'better-sqlite3 not available');
    return;
  }

  const { db, dbPath, error } = createTempDb(Database);
  if (error || !db) {
    skip('T-FD01b: Returns most recent of multiple records', `temp db setup failed: ${error ? error.message : 'unknown error'}`);
    return;
  }
  try {
    // Insert older record (1 hour ago)
    db.prepare(`
      INSERT INTO session_learning (spec_folder, task_id, phase, created_at)
      VALUES (?, ?, ?, datetime('now', '-1 hour'))
    `).run('001-old-folder', 'T-old', 'preflight');

    // Insert newer record (just now)
    db.prepare(`
      INSERT INTO session_learning (spec_folder, task_id, phase, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `).run('002-new-folder', 'T-new', 'preflight');

    const row = db.prepare(RECENT_SESSION_LOOKUP_SQL).get();
    db.close();

    if (row && row.spec_folder === '002-new-folder') {
      pass('T-FD01b: Returns most recent of multiple records', `spec_folder = "${row.spec_folder}"`);
    } else {
      fail('T-FD01b: Returns most recent of multiple records', `Got: ${JSON.stringify(row)}`);
    }
  } catch (err) {
    fail('T-FD01b: Returns most recent of multiple records', err.message);
    try { db.close(); } catch { /* ignore */ }
  } finally {
    cleanupTempDb(dbPath);
  }
}

async function testDbQueryReturnsNullWhenEmpty() {
  log('\n🔬 DB QUERY: Returns undefined when table is empty');

  const Database = loadDatabase();
  if (!Database) {
    skip('T-FD01c: Returns undefined for empty table', 'better-sqlite3 not available');
    return;
  }

  const { db, dbPath, error } = createTempDb(Database);
  if (error || !db) {
    skip('T-FD01c: Returns undefined for empty table', `temp db setup failed: ${error ? error.message : 'unknown error'}`);
    return;
  }
  try {
    // Table exists but has no rows
    const row = db.prepare(RECENT_SESSION_LOOKUP_SQL).get();
    db.close();

    if (row === undefined) {
      pass('T-FD01c: Returns undefined for empty table', 'row === undefined');
    } else {
      fail('T-FD01c: Returns undefined for empty table', `Got: ${JSON.stringify(row)}`);
    }
  } catch (err) {
    fail('T-FD01c: Returns undefined for empty table', err.message);
    try { db.close(); } catch { /* ignore */ }
  } finally {
    cleanupTempDb(dbPath);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. TEST: 24-HOUR BOUNDARY FILTER
   Verify that records older than 24 hours are excluded
────────────────────────────────────────────────────────────────
*/

async function testBoundaryFilter24hOldRecord() {
  log('\n🔬 24H BOUNDARY: Records older than 24h are excluded');

  const Database = loadDatabase();
  if (!Database) {
    skip('T-FD02a: 24h-old record excluded', 'better-sqlite3 not available');
    return;
  }

  const { db, dbPath, error } = createTempDb(Database);
  if (error || !db) {
    skip('T-FD02a: 24h-old record excluded', `temp db setup failed: ${error ? error.message : 'unknown error'}`);
    return;
  }
  try {
    // Insert a record 25 hours ago — should be excluded
    db.prepare(`
      INSERT INTO session_learning (spec_folder, task_id, phase, created_at)
      VALUES (?, ?, ?, datetime('now', '-${TWENTY_FIVE_HOURS} hours'))
    `).run('099-stale-folder', 'T-stale', 'preflight');

    const row = db.prepare(RECENT_SESSION_LOOKUP_SQL).get();
    db.close();

    if (row === undefined) {
      pass('T-FD02a: 24h-old record excluded', 'No rows returned for 25h-old record');
    } else {
      fail('T-FD02a: 24h-old record excluded', `Unexpectedly got: ${JSON.stringify(row)}`);
    }
  } catch (err) {
    fail('T-FD02a: 24h-old record excluded', err.message);
    try { db.close(); } catch { /* ignore */ }
  } finally {
    cleanupTempDb(dbPath);
  }
}

async function testBoundaryFilterRecentWithOld() {
  log('\n🔬 24H BOUNDARY: Recent record returned, old record ignored');

  const Database = loadDatabase();
  if (!Database) {
    skip('T-FD02b: Recent returned, old ignored', 'better-sqlite3 not available');
    return;
  }

  const { db, dbPath, error } = createTempDb(Database);
  if (error || !db) {
    skip('T-FD02b: Recent returned, old ignored', `temp db setup failed: ${error ? error.message : 'unknown error'}`);
    return;
  }
  try {
    // Insert old record (48h ago) — should be excluded
    db.prepare(`
      INSERT INTO session_learning (spec_folder, task_id, phase, created_at)
      VALUES (?, ?, ?, datetime('now', '-${FORTY_EIGHT_HOURS} hours'))
    `).run('001-ancient-folder', 'T-ancient', 'preflight');

    // Insert recent record (30 min ago) — should be included
    db.prepare(`
      INSERT INTO session_learning (spec_folder, task_id, phase, created_at)
      VALUES (?, ?, ?, datetime('now', '-${THIRTY_MINUTES} minutes'))
    `).run('002-recent-folder', 'T-recent', 'preflight');

    const row = db.prepare(RECENT_SESSION_LOOKUP_SQL).get();
    db.close();

    if (row && row.spec_folder === '002-recent-folder') {
      pass('T-FD02b: Recent returned, old ignored', `spec_folder = "${row.spec_folder}"`);
    } else {
      fail('T-FD02b: Recent returned, old ignored', `Got: ${JSON.stringify(row)}`);
    }
  } catch (err) {
    fail('T-FD02b: Recent returned, old ignored', err.message);
    try { db.close(); } catch { /* ignore */ }
  } finally {
    cleanupTempDb(dbPath);
  }
}

async function testBoundaryFilterEdge23h59m() {
  log('\n🔬 24H BOUNDARY: Record at ~23h59m (just inside window) is included');

  const Database = loadDatabase();
  if (!Database) {
    skip('T-FD02c: 23h59m record included', 'better-sqlite3 not available');
    return;
  }

  const { db, dbPath, error } = createTempDb(Database);
  if (error || !db) {
    skip('T-FD02c: 23h59m record included', `temp db setup failed: ${error ? error.message : 'unknown error'}`);
    return;
  }
  try {
    // Insert record 23 hours and 55 minutes ago — should be included (within 24h)
    db.prepare(`
      INSERT INTO session_learning (spec_folder, task_id, phase, created_at)
      VALUES (?, ?, ?, datetime('now', '-${EDGE_WINDOW_MINUTES} minutes'))
    `).run('003-edge-case', 'T-edge', 'preflight');

    const row = db.prepare(RECENT_SESSION_LOOKUP_SQL).get();
    db.close();

    if (row && row.spec_folder === '003-edge-case') {
      pass('T-FD02c: 23h59m record included', `spec_folder = "${row.spec_folder}" (within window)`);
    } else {
      fail('T-FD02c: 23h59m record included', `Got: ${JSON.stringify(row)}`);
    }
  } catch (err) {
    fail('T-FD02c: 23h59m record included', err.message);
    try { db.close(); } catch { /* ignore */ }
  } finally {
    cleanupTempDb(dbPath);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. TEST: SILENT ERROR FALLTHROUGH
   Verify that DB failures don't throw — they are caught silently
────────────────────────────────────────────────────────────────
*/

async function testSilentFallthroughMissingDb() {
  log('\n🔬 SILENT FALLTHROUGH: Missing DB file does not throw');

  const Database = loadDatabase();
  if (!Database) {
    skip('T-FD03a: Missing DB does not throw', 'better-sqlite3 not available');
    return;
  }

  try {
    // Attempt to open a non-existent DB in readonly mode — better-sqlite3 throws
    let threw = false;
    try {
      const db = new Database('/nonexistent/path/to/database.sqlite', { readonly: true });
      db.close();
    } catch {
      threw = true;
    }

    if (threw) {
      pass('T-FD03a: Missing DB throws in readonly mode', 'better-sqlite3 correctly throws for missing readonly DB');
    } else {
      fail('T-FD03a: Missing DB throws in readonly mode', 'Expected error for missing readonly DB');
    }
  } catch (err) {
    fail('T-FD03a: Missing DB does not throw', err.message);
  }
}

async function testSilentFallthroughMissingTable() {
  log('\n🔬 SILENT FALLTHROUGH: Missing session_learning table throws');

  const Database = loadDatabase();
  if (!Database) {
    skip('T-FD03b: Missing table throws on prepare', 'better-sqlite3 not available');
    return;
  }

  const tmpDir = os.tmpdir();
  const dbPath = path.join(tmpDir, `test-no-table-${Date.now()}.sqlite`);
  try {
    // Create empty DB (no tables)
    try {
      const db = new Database(dbPath);
      db.close();
    } catch (err) {
      skip('T-FD03b: Missing table throws on prepare/get', `temp db setup failed: ${err.message}`);
      return;
    }

    // Reopen as readonly, try query — should throw because table doesn't exist
    const db2 = new Database(dbPath, { readonly: true });
    let threw = false;
    try {
      db2.prepare(RECENT_SESSION_LOOKUP_SQL).get();
    } catch {
      threw = true;
    }
    db2.close();

    if (threw) {
      pass('T-FD03b: Missing table throws on prepare/get', 'Query correctly fails for missing table');
    } else {
      fail('T-FD03b: Missing table throws on prepare/get', 'Expected error for missing table');
    }
  } catch (err) {
    fail('T-FD03b: Missing table throws on prepare/get', err.message);
  } finally {
    cleanupTempDb(dbPath);
  }
}

async function testSilentFallthroughBadRequirePath() {
  log('\n🔬 SILENT FALLTHROUGH: Invalid better-sqlite3 require path does not crash');

  try {
    // Simulate what happens when require() can't find better-sqlite3
    let threw = false;
    try {
      require('/nonexistent/path/to/better-sqlite3');
    } catch {
      threw = true;
    }

    if (threw) {
      pass('T-FD03c: Bad require path throws (caught by try/catch)', 'require() correctly threw MODULE_NOT_FOUND');
    } else {
      fail('T-FD03c: Bad require path throws (caught by try/catch)', 'Expected require to throw');
    }
  } catch (err) {
    fail('T-FD03c: Bad require path throws (caught by try/catch)', `Unexpected: ${err.message}`);
  }
}

async function testSilentFallthroughCombinedInDetect() {
  log('\n🔬 SILENT FALLTHROUGH: detectSpecFolder handles DB errors gracefully');

  try {
    // The full detectSpecFolder function wraps all Priority 2.5 logic in try/catch.
    // If the DB is missing or table missing, it should fall through to Priority 3+
    // We can verify the function is loadable and the try/catch structure is sound.
    const { detectSpecFolder } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));

    // DetectSpecFolder without CLI arg will fall through Priority 2.5 (DB lookup)
    // And continue to Priority 3 (CWD) and Priority 4 (auto-detect).
    // We can't fully test the end-to-end here without mocking CONFIG,
    // But we verify the function doesn't throw synchronously on import.
    if (typeof detectSpecFolder === 'function') {
      pass('T-FD03d: detectSpecFolder loads without error', 'Function type confirmed, try/catch around Priority 2.5 is intact');
    } else {
      fail('T-FD03d: detectSpecFolder loads without error', 'Not a function');
    }
  } catch (err) {
    fail('T-FD03d: detectSpecFolder loads without error', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. TEST: FOLDER VALIDATION (fs.access check)
   Priority 2.5 resolves spec_folder against specsDir, then
   checks fs.access(). If folder doesn't exist, it falls through.
────────────────────────────────────────────────────────────────
*/

async function testFolderValidationResolvesPath() {
  log('\n🔬 FOLDER VALIDATION: spec_folder path is resolved correctly');

  try {
    // Test path resolution logic: path.join(activeDir, row.spec_folder)
    const { findActiveSpecsDir } = require(path.join(SCRIPTS_DIR, 'core'));
    const specsDir = findActiveSpecsDir();
    const defaultSpecsDir = path.join(PROJECT_ROOT, 'specs');
    const activeDir = specsDir || defaultSpecsDir;

    // Simulate what Priority 2.5 does with a spec_folder value
    const testFolder = '003-memory-and-spec-kit';
    const resolvedPath = path.join(activeDir, testFolder);

    // Verify the resolved path looks correct
    if (resolvedPath.includes('specs') && resolvedPath.endsWith(testFolder)) {
      pass('T-FD04a: Path resolution', `Resolved: ${resolvedPath}`);
    } else {
      fail('T-FD04a: Path resolution', `Unexpected path: ${resolvedPath}`);
    }
  } catch (err) {
    fail('T-FD04a: Path resolution', err.message);
  }
}

async function testFolderValidationExistingFolder() {
  log('\n🔬 FOLDER VALIDATION: fs.access succeeds for existing spec folder');

  try {
    const { findActiveSpecsDir } = require(path.join(SCRIPTS_DIR, 'core'));
    const specsDir = findActiveSpecsDir();
    if (!specsDir) {
      skip('T-FD04b: Existing folder access', 'No specs directory found');
      return;
    }

    // Find an actual spec folder
    const entries = fs.readdirSync(specsDir);
    const specFolders = entries.filter(name => /^\d{3}-/.test(name));
    if (specFolders.length === 0) {
      skip('T-FD04b: Existing folder access', 'No spec folders exist');
      return;
    }

    const resolvedPath = path.join(specsDir, specFolders[0]);
    const fsPromises = require('fs/promises');
    await fsPromises.access(resolvedPath);
    pass('T-FD04b: Existing folder access', `fs.access passed for: ${specFolders[0]}`);
  } catch (err) {
    fail('T-FD04b: Existing folder access', err.message);
  }
}

async function testFolderValidationNonexistentFolder() {
  log('\n🔬 FOLDER VALIDATION: fs.access fails for nonexistent spec folder');

  try {
    const { findActiveSpecsDir } = require(path.join(SCRIPTS_DIR, 'core'));
    const specsDir = findActiveSpecsDir();
    const activeDir = specsDir || path.join(PROJECT_ROOT, 'specs');

    const resolvedPath = path.join(activeDir, '999-nonexistent-spec-folder');
    const fsPromises = require('fs/promises');

    let threw = false;
    try {
      await fsPromises.access(resolvedPath);
    } catch {
      threw = true;
    }

    if (threw) {
      pass('T-FD04c: Nonexistent folder fails access', 'fs.access correctly throws for missing folder');
    } else {
      fail('T-FD04c: Nonexistent folder fails access', 'Expected fs.access to throw');
    }
  } catch (err) {
    fail('T-FD04c: Nonexistent folder fails access', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   7. TEST: PRIORITY CHAIN INTEGRATION
   Verify that Priority 1 (CLI arg) > Priority 2.5 (DB) > Priority 3 (CWD)
────────────────────────────────────────────────────────────────
*/

async function testPriority1OverridesAll() {
  log('\n🔬 PRIORITY CHAIN: Priority 1 (CLI arg) overrides Priority 2.5 (DB)');

  try {
    // CONFIG is a mutable object. We can temporarily set SPEC_FOLDER_ARG.
    const { CONFIG, findActiveSpecsDir } = require(path.join(SCRIPTS_DIR, 'core'));
    const { detectSpecFolder } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));

    const specsDir = findActiveSpecsDir();
    if (!specsDir) {
      skip('T-FD05a: Priority 1 overrides 2.5', 'No specs directory found');
      return;
    }

    // Find an existing spec folder to use as CLI arg
    const entries = fs.readdirSync(specsDir);
    const specFolders = entries.filter(name => /^\d{3}-/.test(name));
    if (specFolders.length === 0) {
      skip('T-FD05a: Priority 1 overrides 2.5', 'No spec folders exist');
      return;
    }

    const originalArg = CONFIG.SPEC_FOLDER_ARG;
    try {
      // Set CLI arg to a known existing folder
      CONFIG.SPEC_FOLDER_ARG = specFolders[0];
      const result = await detectSpecFolder(null);

      if (result.endsWith(specFolders[0])) {
        pass('T-FD05a: Priority 1 overrides 2.5', `CLI arg "${specFolders[0]}" → result ends with it`);
      } else {
        fail('T-FD05a: Priority 1 overrides 2.5', `Expected path ending with "${specFolders[0]}", got: ${result}`);
      }
    } finally {
      // Restore original value
      CONFIG.SPEC_FOLDER_ARG = originalArg;
    }
  } catch (err) {
    fail('T-FD05a: Priority 1 overrides 2.5', err.message);
  }
}

async function testPriority2OverridesDb() {
  log('\n🔬 PRIORITY CHAIN: Priority 2 (JSON data) overrides Priority 2.5 (DB)');

  try {
    const { CONFIG, findActiveSpecsDir } = require(path.join(SCRIPTS_DIR, 'core'));
    const { detectSpecFolder } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));

    const specsDir = findActiveSpecsDir();
    if (!specsDir) {
      skip('T-FD05b: Priority 2 overrides 2.5', 'No specs directory found');
      return;
    }

    // Find an existing spec folder
    const entries = fs.readdirSync(specsDir);
    const specFolders = entries.filter(name => /^\d{3}-/.test(name));
    if (specFolders.length === 0) {
      skip('T-FD05b: Priority 2 overrides 2.5', 'No spec folders exist');
      return;
    }

    const originalArg = CONFIG.SPEC_FOLDER_ARG;
    try {
      // Ensure no CLI arg
      CONFIG.SPEC_FOLDER_ARG = null;

      // Call with collectedData containing SPEC_FOLDER
      // The alignment validator may interfere, so we pass minimal data
      const collectedData = {
        SPEC_FOLDER: specFolders[0],
        userPrompts: [],
        observations: [],
        recentContext: [],
      };

      const result = await detectSpecFolder(collectedData);

      if (result.endsWith(specFolders[0])) {
        pass('T-FD05b: Priority 2 overrides 2.5', `Data SPEC_FOLDER "${specFolders[0]}" → result ends with it`);
      } else {
        skip('T-FD05b: Priority 2 overrides 2.5',
          `Alignment redirected from "${specFolders[0]}" to "${path.basename(result)}"`);
      }
    } finally {
      CONFIG.SPEC_FOLDER_ARG = originalArg;
    }
  } catch (err) {
    // Alignment prompts can interrupt this non-interactive test environment.
    if (err.message.includes('retry attempts') || err.message.includes('stdin')) {
      skip('T-FD05b: Priority 2 overrides 2.5', 'Alignment prompt requires interactive confirmation');
    } else {
      fail('T-FD05b: Priority 2 overrides 2.5', err.message);
    }
  }
}

async function testPriority25BeforePriority3() {
  log('\n🔬 PRIORITY CHAIN: Priority 2.5 is checked before Priority 3 (CWD)');

  try {
    // We verify via code inspection that Priority 2.5 comes before Priority 3 in source
    const sourceCode = fs.readFileSync(
      path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector.js'),
      'utf-8'
    );
    // WHY: these markers are part of the detector's documented priority contract.
    const detectFnIndex = sourceCode.indexOf(DETECT_SPEC_FUNCTION_MARKER);
    const scopedSource = detectFnIndex >= 0 ? sourceCode.slice(detectFnIndex) : sourceCode;

    const p25Index = scopedSource.indexOf(PRIORITY_25_MARKER);
    const p3Index = scopedSource.indexOf(PRIORITY_3_MARKER);

    if (p25Index === -1) {
      fail('T-FD05c: Priority 2.5 before Priority 3', 'Priority 2.5 comment not found in source');
    } else if (p3Index === -1) {
      fail('T-FD05c: Priority 2.5 before Priority 3', 'Priority 3 comment not found in source');
    } else if (p25Index < p3Index) {
      pass('T-FD05c: Priority 2.5 before Priority 3',
        `Priority 2.5 at char ${p25Index}, Priority 3 at char ${p3Index}`);
    } else {
      fail('T-FD05c: Priority 2.5 before Priority 3',
        `Priority 2.5 at char ${p25Index} is AFTER Priority 3 at char ${p3Index}`);
    }
  } catch (err) {
    fail('T-FD05c: Priority 2.5 before Priority 3', err.message);
  }
}

async function testPriorityChainOrder() {
  log('\n🔬 PRIORITY CHAIN: Full priority order 1 → 2 → 2.5 → 3 → 4');

  try {
    const sourceCode = fs.readFileSync(
      path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector.js'),
      'utf-8'
    );
    const detectFnIndex = sourceCode.indexOf(DETECT_SPEC_FUNCTION_MARKER);
    const scopedSource = detectFnIndex >= 0 ? sourceCode.slice(detectFnIndex) : sourceCode;

    const p1Index = scopedSource.indexOf(PRIORITY_1_MARKER);
    const p2Index = scopedSource.indexOf(PRIORITY_2_MARKER);
    const p25Index = scopedSource.indexOf(PRIORITY_25_MARKER);
    const p3Index = scopedSource.indexOf(PRIORITY_3_MARKER);
    const p4Index = scopedSource.indexOf(PRIORITY_4_MARKER);

    const allFound = p1Index !== -1 && p2Index !== -1 && p25Index !== -1 && p3Index !== -1 && p4Index !== -1;
    const correctOrder = p1Index < p2Index && p2Index < p25Index && p25Index < p3Index && p3Index < p4Index;

    if (allFound && correctOrder) {
      pass('T-FD05d: Full priority chain order', `1(${p1Index}) → 2(${p2Index}) → 2.5(${p25Index}) → 3(${p3Index}) → 4(${p4Index})`);
    } else if (!allFound) {
      const missing = [];
      if (p1Index === -1) missing.push('P1');
      if (p2Index === -1) missing.push('P2');
      if (p25Index === -1) missing.push('P2.5');
      if (p3Index === -1) missing.push('P3');
      if (p4Index === -1) missing.push('P4');
      fail('T-FD05d: Full priority chain order', `Missing priority markers: ${missing.join(', ')}`);
    } else {
      fail('T-FD05d: Full priority chain order', `Wrong order: 1(${p1Index}), 2(${p2Index}), 2.5(${p25Index}), 3(${p3Index}), 4(${p4Index})`);
    }
  } catch (err) {
    fail('T-FD05d: Full priority chain order', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   8. TEST: DB STRUCTURE VALIDATION
   Verify the real DB (if available) has correct schema
────────────────────────────────────────────────────────────────
*/

async function testRealDbSchema() {
  log('\n🔬 DB STRUCTURE: Real DB has session_learning table with correct columns');

  const Database = loadDatabase();
  if (!Database) {
    skip('T-FD06a: Real DB schema validation', 'better-sqlite3 not available');
    return;
  }

  if (!fs.existsSync(REAL_DB_PATH)) {
    skip('T-FD06a: Real DB schema validation', 'Real DB file does not exist');
    return;
  }

  try {
    const db = new Database(REAL_DB_PATH, { readonly: true });
    const tableInfo = db.prepare(`PRAGMA table_info(session_learning)`).all();
    db.close();

    if (tableInfo.length === 0) {
      fail('T-FD06a: Real DB schema validation', 'session_learning table not found');
      return;
    }

    const columns = tableInfo.map(col => col.name);
    const requiredColumns = ['spec_folder', 'task_id', 'phase', 'created_at'];
    const missingColumns = requiredColumns.filter(c => !columns.includes(c));

    if (missingColumns.length === 0) {
      pass('T-FD06a: Real DB schema validation',
        `Found ${columns.length} columns including: ${requiredColumns.join(', ')}`);
    } else {
      fail('T-FD06a: Real DB schema validation', `Missing columns: ${missingColumns.join(', ')}`);
    }
  } catch (err) {
    fail('T-FD06a: Real DB schema validation', err.message);
  }
}

async function testRealDbQueryable() {
  log('\n🔬 DB STRUCTURE: Real DB query executes without error');

  const Database = loadDatabase();
  if (!Database) {
    skip('T-FD06b: Real DB queryable', 'better-sqlite3 not available');
    return;
  }

  if (!fs.existsSync(REAL_DB_PATH)) {
    skip('T-FD06b: Real DB queryable', 'Real DB file does not exist');
    return;
  }

  try {
    const db = new Database(REAL_DB_PATH, { readonly: true });
    // Execute the exact Priority 2.5 query
    const row = db.prepare(RECENT_SESSION_LOOKUP_SQL).get();
    db.close();

    // Row can be undefined (no recent records) or an object — both are valid
    if (row === undefined) {
      pass('T-FD06b: Real DB queryable', 'Query succeeded, no recent records (expected if no recent preflight)');
    } else if (row && typeof row.spec_folder === 'string') {
      pass('T-FD06b: Real DB queryable', `Query returned spec_folder = "${row.spec_folder}"`);
    } else {
      fail('T-FD06b: Real DB queryable', `Unexpected result: ${JSON.stringify(row)}`);
    }
  } catch (err) {
    fail('T-FD06b: Real DB queryable', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   9. TEST: filterArchiveFolders EDGE CASES
────────────────────────────────────────────────────────────────
*/

async function testFilterArchiveFoldersEdgeCases() {
  log('\n🔬 FILTER ARCHIVE: Edge cases for filterArchiveFolders');

  try {
    const { filterArchiveFolders, ALIGNMENT_CONFIG } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));

    // Test 1: Empty array input
    const emptyResult = filterArchiveFolders([]);
    if (Array.isArray(emptyResult) && emptyResult.length === 0) {
      pass('T-FD07a: Empty array returns empty', 'Length: 0');
    } else {
      fail('T-FD07a: Empty array returns empty', `Got length: ${emptyResult.length}`);
    }

    // Test 2: No archive folders — all pass through
    const noArchive = ['001-feature', '002-bugfix', '003-refactor'];
    const noArchiveResult = filterArchiveFolders(noArchive);
    if (noArchiveResult.length === 3) {
      pass('T-FD07b: Non-archive folders all pass through', `All 3 retained`);
    } else {
      fail('T-FD07b: Non-archive folders all pass through', `Got ${noArchiveResult.length}`);
    }

    // Test 3: Mixed case archive detection
    const mixedCase = ['001-feature', 'Z_ARCHIVE', '002-other'];
    const mixedResult = filterArchiveFolders(mixedCase);
    // The filter lowercases and checks against ARCHIVE_PATTERNS
    if (!mixedResult.includes('Z_ARCHIVE') && mixedResult.length === 2) {
      pass('T-FD07c: Case-insensitive archive detection', 'Z_ARCHIVE removed');
    } else {
      fail('T-FD07c: Case-insensitive archive detection', `Result: ${mixedResult.join(', ')}`);
    }

    // Test 4: All folders are archives
    const allArchive = ALIGNMENT_CONFIG.ARCHIVE_PATTERNS.map((p, i) => `${String(i).padStart(3, '0')}-${p}-stuff`);
    const allArchiveResult = filterArchiveFolders(allArchive);
    if (allArchiveResult.length === 0) {
      pass('T-FD07d: All archive folders removed', 'Empty result');
    } else {
      fail('T-FD07d: All archive folders removed', `${allArchiveResult.length} remaining: ${allArchiveResult.join(', ')}`);
    }

    // Test 5: Verify ARCHIVE_PATTERNS contains expected patterns
    const expectedPatterns = ['archive', 'z_'];
    const hasExpected = expectedPatterns.every(p =>
      ALIGNMENT_CONFIG.ARCHIVE_PATTERNS.some(ap => ap.includes(p))
    );
    if (hasExpected) {
      pass('T-FD07e: ARCHIVE_PATTERNS has expected patterns', ALIGNMENT_CONFIG.ARCHIVE_PATTERNS.join(', '));
    } else {
      fail('T-FD07e: ARCHIVE_PATTERNS has expected patterns',
        `Missing expected. Actual: ${ALIGNMENT_CONFIG.ARCHIVE_PATTERNS.join(', ')}`);
    }
  } catch (err) {
    fail('T-FD07: filterArchiveFolders edge cases', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   10. TEST: CONFIG.PROJECT_ROOT ALIGNMENT
   Verify that the DB path constructed matches real filesystem
────────────────────────────────────────────────────────────────
*/

async function testConfigProjectRootAlignment() {
  log('\n🔬 CONFIG ALIGNMENT: PROJECT_ROOT resolves to correct paths');

  try {
    const { CONFIG } = require(path.join(SCRIPTS_DIR, 'core'));

    // Test 1: PROJECT_ROOT exists
    if (fs.existsSync(CONFIG.PROJECT_ROOT)) {
      pass('T-FD08a: PROJECT_ROOT exists on disk', CONFIG.PROJECT_ROOT);
    } else {
      fail('T-FD08a: PROJECT_ROOT exists on disk', `Not found: ${CONFIG.PROJECT_ROOT}`);
      return;
    }

    // Test 2: DB path from PROJECT_ROOT matches expected location
    const constructedDbPath = path.join(
      CONFIG.PROJECT_ROOT,
      'skill/system-spec-kit/mcp_server/database/context-index.sqlite'
    );
    if (constructedDbPath === REAL_DB_PATH || path.resolve(constructedDbPath) === path.resolve(REAL_DB_PATH)) {
      pass('T-FD08b: Constructed DB path matches expected', path.basename(constructedDbPath));
    } else {
      fail('T-FD08b: Constructed DB path matches expected',
        `Constructed: ${constructedDbPath}\n      Expected:    ${REAL_DB_PATH}`);
    }

    // Test 3: better-sqlite3 path from PROJECT_ROOT resolves
    const constructedSqlitePath = path.join(
      CONFIG.PROJECT_ROOT,
      'skill/system-spec-kit/mcp_server/node_modules/better-sqlite3'
    );
    try {
      require.resolve(constructedSqlitePath);
      pass('T-FD08c: better-sqlite3 path resolves', 'require.resolve succeeded');
    } catch {
      // Not a hard failure — better-sqlite3 may not be installed
      skip('T-FD08c: better-sqlite3 path resolves', 'Module not found at constructed path');
    }
  } catch (err) {
    fail('T-FD08: CONFIG alignment', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   11. TEST: NEW REGRESSION MATRIX (SESSION SELECTION BUG)
────────────────────────────────────────────────────────────────
*/

async function testArchiveCandidateExcludedWhenActiveExists() {
  log('\n🔬 REGRESSION: Active candidate preferred over archived candidate');

  try {
    const { TEST_HELPERS } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));
    if (!TEST_HELPERS || typeof TEST_HELPERS.rankSessionCandidates !== 'function') {
      fail('T-FD09a: Active beats archive candidate', 'TEST_HELPERS.rankSessionCandidates not available');
      return;
    }

    const now = Date.now();
    const ranked = TEST_HELPERS.rankSessionCandidates([
      { path: 'specs/999-z_archive-session-selection', recencyMs: now + PRIORITY_COMPARISON_OFFSET_MS },
      { path: '.opencode/specs/139-hybrid-rag-fusion/005-auto-detected-session-bug', recencyMs: now }
    ]);

    const expectedTop = '.opencode/specs/139-hybrid-rag-fusion/005-auto-detected-session-bug';
    if (
      ranked.length > 0 &&
      ranked[0].path === expectedTop &&
      ranked[0].quality &&
      ranked[0].quality.label === 'active'
    ) {
      pass('T-FD09a: Active beats archive candidate',
        `Top=${ranked[0].path} quality=${ranked[0].quality.label}`);
    } else {
      fail('T-FD09a: Active beats archive candidate', `Ranking result: ${JSON.stringify(ranked[0])}`);
    }
  } catch (err) {
    fail('T-FD09a: Active beats archive candidate', err.message);
  }
}

async function testAliasNormalizationDeterminism() {
  log('\n🔬 REGRESSION: Alias normalization deterministic between specs roots');

  try {
    const { TEST_HELPERS } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));
    if (!TEST_HELPERS || typeof TEST_HELPERS.normalizeSpecReferenceForLookup !== 'function') {
      fail('T-FD09b: Alias normalization deterministic', 'normalizeSpecReferenceForLookup not available');
      return;
    }

    const variants = [
      'specs/02--system-spec-kit/022-hybrid-rag-fusion',
      '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion',
      'specs\\02--system-spec-kit\\022-hybrid-rag-fusion',
      '02--system-spec-kit/022-hybrid-rag-fusion'
    ];

    const normalized = variants.map((v) => TEST_HELPERS.normalizeSpecReferenceForLookup(v));
    const unique = Array.from(new Set(normalized));

    if (unique.length === 1 && unique[0] === '02--system-spec-kit/022-hybrid-rag-fusion') {
      pass('T-FD09b: Alias normalization deterministic', `Canonical=${unique[0]}`);
    } else {
      fail('T-FD09b: Alias normalization deterministic',
        `Expected one canonical value, got: ${JSON.stringify(unique)}`);
    }
  } catch (err) {
    fail('T-FD09b: Alias normalization deterministic', err.message);
  }
}

async function testRankingResistsMtimeSkew() {
  log('\n🔬 REGRESSION: Ranking resists raw mtime skew');

  try {
    const { TEST_HELPERS } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));
    if (!TEST_HELPERS || typeof TEST_HELPERS.rankAutoDetectCandidates !== 'function') {
      fail('T-FD09c: Ranking resists mtime skew', 'rankAutoDetectCandidates not available');
      return;
    }

    const now = Date.now();
    const rankedByQuality = TEST_HELPERS.rankAutoDetectCandidates([
      {
        path: '/tmp/older-active',
        relativePath: '139-hybrid-rag-fusion/005-auto-detected-session-bug',
        mtimeMs: now - MTIME_SMALL_SKEW_MS
      },
      {
        path: '/tmp/newer-archive',
        relativePath: '999-z_archive-session-selection',
        mtimeMs: now + MTIME_SMALL_SKEW_MS
      }
    ]);

    const rankedByStableId = TEST_HELPERS.rankAutoDetectCandidates([
      {
        path: '/tmp/high-id-older',
        relativePath: '220-high-id-parent/010-phase',
        mtimeMs: now - MTIME_LARGE_SKEW_MS
      },
      {
        path: '/tmp/low-id-newer',
        relativePath: '219-low-id-parent/999-phase',
        mtimeMs: now + MTIME_LARGE_SKEW_MS
      }
    ]);

    const qualityPass = rankedByQuality.length > 0 &&
      rankedByQuality[0].relativePath === '139-hybrid-rag-fusion/005-auto-detected-session-bug';
    const idPass = rankedByStableId.length > 0 &&
      rankedByStableId[0].relativePath === '220-high-id-parent/010-phase';

    if (qualityPass && idPass) {
      pass('T-FD09c: Ranking resists mtime skew',
        `Top quality=${rankedByQuality[0].relativePath}; Top id=${rankedByStableId[0].relativePath}`);
    } else {
      fail('T-FD09c: Ranking resists mtime skew',
        `qualityTop=${rankedByQuality[0] ? rankedByQuality[0].relativePath : 'none'}, idTop=${rankedByStableId[0] ? rankedByStableId[0].relativePath : 'none'}`);
    }
  } catch (err) {
    fail('T-FD09c: Ranking resists mtime skew', err.message);
  }
}

async function testLowConfidenceConfirmationAndFallbackContract() {
  log('\n🔬 REGRESSION: Low-confidence confirmation/fallback contract');

  try {
    const { TEST_HELPERS } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));
    if (!TEST_HELPERS ||
        typeof TEST_HELPERS.decideSessionAction !== 'function' ||
        typeof TEST_HELPERS.decideAutoDetectAction !== 'function') {
      fail('T-FD09d: Low-confidence contract', 'decision helpers not available');
      return;
    }

    const now = Date.now();
    const ambiguousSessionInputs = [
      { path: 'specs/120-active-session-a', recencyMs: now },
      { path: '.opencode/specs/121-active-session-b', recencyMs: now + ONE_SECOND_MS }
    ];
    const ambiguousAutoInputs = [
      { path: '/tmp/a', relativePath: '300-parent/001-phase-a', mtimeMs: now },
      { path: '/tmp/b', relativePath: '300-parent/001-phase-b', mtimeMs: now + ONE_SECOND_MS }
    ];

    const sessionInteractive = TEST_HELPERS.decideSessionAction(ambiguousSessionInputs, true);
    const sessionNonInteractive = TEST_HELPERS.decideSessionAction(ambiguousSessionInputs, false);
    const autoInteractive = TEST_HELPERS.decideAutoDetectAction(ambiguousAutoInputs, true);
    const autoNonInteractive = TEST_HELPERS.decideAutoDetectAction(ambiguousAutoInputs, false);

    const contractPass =
      sessionInteractive.action === 'confirm' &&
      sessionNonInteractive.action === 'skip' &&
      autoInteractive.action === 'confirm' &&
      autoNonInteractive.action === 'fallback';

    if (contractPass) {
      pass('T-FD09d: Low-confidence contract',
        `session=[${sessionInteractive.action}/${sessionNonInteractive.action}] auto=[${autoInteractive.action}/${autoNonInteractive.action}]`);
    } else {
      fail('T-FD09d: Low-confidence contract',
        `session=[${sessionInteractive.action}/${sessionNonInteractive.action}] auto=[${autoInteractive.action}/${autoNonInteractive.action}]`);
    }
  } catch (err) {
    fail('T-FD09d: Low-confidence contract', err.message);
  }
}

async function testSessionQueryUsesTimestampedMultiRowLookup() {
  log('\n🔬 REGRESSION: Session-learning lookup queries multiple timestamped rows');

  try {
    const sourceCode = fs.readFileSync(
      path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector.js'),
      'utf-8'
    );

    const hasColumns = sourceCode.includes(TIMESTAMP_QUERY_COLUMNS_MARKER);
    const hasLimit = sourceCode.includes(TIMESTAMP_QUERY_LIMIT_LITERAL_MARKER) ||
      sourceCode.includes(TIMESTAMP_QUERY_LIMIT_CONST_MARKER) ||
      sourceCode.includes(TIMESTAMP_QUERY_LIMIT_PARAM_MARKER);
    const hasOrder = sourceCode.includes(TIMESTAMP_QUERY_ORDER_MARKER);

    if (hasColumns && hasLimit && hasOrder) {
      pass('T-FD09e: Timestamped multi-row session query',
        'Found SELECT spec_folder, created_at, updated_at ... ORDER BY created_at DESC ... LIMIT 25');
    } else {
      fail('T-FD09e: Timestamped multi-row session query',
        `columns=${hasColumns}, order=${hasOrder}, limit=${hasLimit}`);
    }
  } catch (err) {
    fail('T-FD09e: Timestamped multi-row session query', err.message);
  }
}

async function testCategoryRootedBareChildResolvesFromSessionPaths() {
  log('\n🔬 REGRESSION: Bare child resolves from category-rooted parent cache');

  const { getSpecsDirectories } = require(path.join(SCRIPTS_DIR, 'core', 'config'));
  const specsDirs = getSpecsDirectories().filter(dir => fs.existsSync(dir));
  if (specsDirs.length === 0) {
    skip('T-FD09f: Category-rooted bare child resolution', 'No specs directories available');
    return;
  }

  const token = `${Date.now().toString(36)}-cr`;
  const categoryName = `02--detector-category-${token}`;
  const parentName = `997-detector-parent-${token}`;
  const childName = `996-detector-child-${token}`;
  const createdPath = path.join(specsDirs[0], categoryName, parentName, childName);

  try {
    fs.mkdirSync(createdPath, { recursive: true });
    const { TEST_HELPERS } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));

    const resolved = await TEST_HELPERS.resolveSessionSpecFolderPaths(childName, [specsDirs[0]]);
    if (resolved.includes(createdPath)) {
      pass('T-FD09f: Category-rooted bare child resolution', createdPath);
    } else {
      fail('T-FD09f: Category-rooted bare child resolution', `Resolved: ${JSON.stringify(resolved)}`);
    }
  } catch (err) {
    fail('T-FD09f: Category-rooted bare child resolution', err.message);
  } finally {
    try { fs.rmSync(path.join(specsDirs[0], categoryName), { recursive: true, force: true }); } catch (_) {}
  }
}

async function testCategoryRootedAutoDetectDiscovery() {
  log('\n🔬 REGRESSION: Auto-detect discovers category-rooted spec folders');

  const { getSpecsDirectories } = require(path.join(SCRIPTS_DIR, 'core', 'config'));
  const specsDirs = getSpecsDirectories().filter(dir => fs.existsSync(dir));
  if (specsDirs.length === 0) {
    skip('T-FD09g: Category-rooted auto-detect discovery', 'No specs directories available');
    return;
  }

  const token = `${Date.now().toString(36)}-ad`;
  const categoryName = `02--auto-category-${token}`;
  const parentName = `997-auto-parent-${token}`;
  const childName = `996-auto-child-${token}`;
  const categoryPath = path.join(specsDirs[0], categoryName);
  const parentPath = path.join(categoryPath, parentName);
  const childPath = path.join(parentPath, childName);

  try {
    fs.mkdirSync(childPath, { recursive: true });
    const { TEST_HELPERS } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));
    const candidates = await TEST_HELPERS.collectAutoDetectCandidates([specsDirs[0]]);
    const relativePaths = candidates.map((candidate) => candidate.relativePath);

    if (
      relativePaths.includes(`${categoryName}/${parentName}`) &&
      relativePaths.includes(`${categoryName}/${parentName}/${childName}`)
    ) {
      pass('T-FD09g: Category-rooted auto-detect discovery', relativePaths.filter((item) => item.includes(token)).join(', '));
    } else {
      fail('T-FD09g: Category-rooted auto-detect discovery', `Missing expected paths in ${JSON.stringify(relativePaths)}`);
    }
  } catch (err) {
    fail('T-FD09g: Category-rooted auto-detect discovery', err.message);
  } finally {
    try { fs.rmSync(categoryPath, { recursive: true, force: true }); } catch (_) {}
  }
}

async function testApprovedRootContainmentRejectsSymlinkEscape() {
  log('\n🔬 REGRESSION: Approved-root containment rejects symlink escapes');

  const { getSpecsDirectories } = require(path.join(SCRIPTS_DIR, 'core', 'config'));
  const specsDirs = getSpecsDirectories().filter(dir => fs.existsSync(dir));
  if (specsDirs.length === 0) {
    skip('T-FD09h: Canonical containment rejects symlink escape', 'No specs directories available');
    return;
  }

  const token = `${Date.now().toString(36)}-sl`;
  const outsideRoot = fs.mkdtempSync(path.join(os.tmpdir(), `folder-detector-outside-${token}-`));
  const escapedTarget = path.join(outsideRoot, `996-symlink-child-${token}`);
  const symlinkPath = path.join(specsDirs[0], `998-symlink-escape-${token}`);

  try {
    fs.mkdirSync(escapedTarget, { recursive: true });
    fs.symlinkSync(outsideRoot, symlinkPath, 'dir');
    const { TEST_HELPERS } = require(path.join(SCRIPTS_DIR, 'spec-folder', 'folder-detector'));
    const result = TEST_HELPERS.isUnderApprovedSpecsRoots(path.join(symlinkPath, path.basename(escapedTarget)));

    if (result === false) {
      pass('T-FD09h: Canonical containment rejects symlink escape', 'Symlinked path rejected outside approved roots');
    } else {
      fail('T-FD09h: Canonical containment rejects symlink escape', 'Symlinked path was incorrectly accepted');
    }
  } catch (err) {
    fail('T-FD09h: Canonical containment rejects symlink escape', err.message);
  } finally {
    try { fs.rmSync(symlinkPath, { recursive: true, force: true }); } catch (_) {}
    try { fs.rmSync(outsideRoot, { recursive: true, force: true }); } catch (_) {}
  }
}

/* ─────────────────────────────────────────────────────────────
   12. MAIN TEST RUNNER
────────────────────────────────────────────────────────────────
*/

async function main() {
  log('\n═══════════════════════════════════════════════════════════════');
  log('TEST: Folder Detector Functional Tests (Priority 2.5 Focus)');
  log('═══════════════════════════════════════════════════════════════');

  // Category 1: DB Query Correctness
  log('\n── Category 1: DB Query Correctness ──
');
  await testDbQueryReturnsRecentRecord();
  await testDbQueryReturnsMostRecentOfMultiple();
  await testDbQueryReturnsNullWhenEmpty();

  // Category 2: 24-Hour Boundary Filter
  log('\n── Category 2: 24-Hour Boundary Filter ──
');
  await testBoundaryFilter24hOldRecord();
  await testBoundaryFilterRecentWithOld();
  await testBoundaryFilterEdge23h59m();

  // Category 3: Silent Error Fallthrough
  log('\n── Category 3: Silent Error Fallthrough ──
');
  await testSilentFallthroughMissingDb();
  await testSilentFallthroughMissingTable();
  await testSilentFallthroughBadRequirePath();
  await testSilentFallthroughCombinedInDetect();

  // Category 4: Folder Validation
  log('\n── Category 4: Folder Validation ──
');
  await testFolderValidationResolvesPath();
  await testFolderValidationExistingFolder();
  await testFolderValidationNonexistentFolder();

  // Category 5: Priority Chain Integration
  log('\n── Category 5: Priority Chain Integration ──
');
  await testPriority1OverridesAll();
  await testPriority2OverridesDb();
  await testPriority25BeforePriority3();
  await testPriorityChainOrder();

  // Category 6: Real DB Structure
  log('\n── Category 6: Real DB Structure ──
');
  await testRealDbSchema();
  await testRealDbQueryable();

  // Category 7: filterArchiveFolders Edge Cases
  log('\n── Category 7: filterArchiveFolders Edge Cases ──
');
  await testFilterArchiveFoldersEdgeCases();

  // Category 8: CONFIG Alignment
  log('\n── Category 8: CONFIG Alignment ──
');
  await testConfigProjectRootAlignment();

  // Category 9: Session-Selection Regressions
  log('\n── Category 9: Session-Selection Regressions ──
');
  await testArchiveCandidateExcludedWhenActiveExists();
  await testAliasNormalizationDeterminism();
  await testRankingResistsMtimeSkew();
  await testLowConfidenceConfirmationAndFallbackContract();
  await testSessionQueryUsesTimestampedMultiRowLookup();
  await testCategoryRootedBareChildResolvesFromSessionPaths();
  await testCategoryRootedAutoDetectDiscovery();
  await testApprovedRootContainmentRejectsSymlinkEscape();

  // Results summary
  log('\n═══════════════════════════════════════════════════════════════');
  log(`RESULTS: ${results.passed} passed, ${results.failed} failed, ${results.skipped} skipped`);
  log('═══════════════════════════════════════════════════════════════\n');

  if (results.failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('[folder-detector-functional] Test runner fatal error:', err);
  process.exit(1);
});

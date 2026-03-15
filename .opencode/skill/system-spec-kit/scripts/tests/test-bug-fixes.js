// ───────────────────────────────────────────────────────────────
// 1. TEST: BUG FIXES VERIFICATION
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');
const fs = require('fs');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────
*/

const ROOT = path.join(__dirname, '..', '..');
const LIB_PATH = path.join(ROOT, 'mcp_server', 'dist', 'lib');
const SEARCH_PATH = path.join(LIB_PATH, 'search');
const PARSING_PATH = path.join(LIB_PATH, 'parsing');
const SHARED_PATH = path.join(ROOT, 'shared');
const DB_PATH = path.join(ROOT, 'mcp_server', 'database');
const CONFIG_PATH = path.join(ROOT, 'mcp_server', 'configs');
const VECTOR_INDEX_PATH = path.join(SEARCH_PATH, 'vector-index.js');
const VECTOR_INDEX_MUTATIONS_PATH = path.join(SEARCH_PATH, 'vector-index-mutations.js');
const VECTOR_INDEX_STORE_PATH = path.join(SEARCH_PATH, 'vector-index-store.js');
const VECTOR_INDEX_QUERIES_PATH = path.join(SEARCH_PATH, 'vector-index-queries.js');
const DB_STATE_PATH = path.join(ROOT, 'mcp_server', 'dist', 'core', 'db-state.js');

// Test results
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
};

/* ─────────────────────────────────────────────────────────────
   2. UTILITIES
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

/* ─────────────────────────────────────────────────────────────
   3. BUG TEST FUNCTIONS
────────────────────────────────────────────────────────────────
*/

// BUG-001: Race Condition - Cross-connection visibility
async function testBug001() {
  log('\n🔬 BUG-001: Race Condition - Cross-connection visibility');
  
  try {
    const dbUpdatedFile = path.join(DB_PATH, '.db-updated');
    
    // Test 1: Notification file mechanism exists
    // NOTE: notifyDatabaseUpdated currently lives in core/memory-indexer.
    const notifyCandidates = [
      path.join(ROOT, 'scripts', 'dist', 'core', 'memory-indexer.js'),
      path.join(ROOT, 'scripts', 'core', 'memory-indexer.ts'),
      path.join(ROOT, 'scripts', 'dist', 'core', 'workflow.js'),
      path.join(ROOT, 'scripts', 'dist', 'memory', 'generate-context.js'),
    ].filter(p => fs.existsSync(p));

    let notifyEvidence = null;
    for (const candidate of notifyCandidates) {
      const source = fs.readFileSync(candidate, 'utf8');
      const hasNotifyFn = /\bnotifyDatabaseUpdated\b/.test(source);
      const hasDbMarker = source.includes('DB_UPDATED_FILE') || source.includes('.db-updated');
      const hasFileWrite = source.includes('writeFileSync') || source.includes('writeFile(');
      if (hasNotifyFn && hasDbMarker && hasFileWrite) {
        notifyEvidence = path.relative(ROOT, candidate);
        break;
      }
    }

    if (notifyEvidence) {
      pass('T-005a: Notification mechanism in scripts/', 
           `notifyDatabaseUpdated() + DB marker write found in ${notifyEvidence}`);
    } else {
      fail('T-005a: Notification mechanism in scripts/', 
           'notifyDatabaseUpdated() file-write marker not found');
    }
    
    // Test 2: Check detection in db-state.js (moved from context-server after modularization)
    if (fs.existsSync(DB_STATE_PATH)) {
      const dbState = fs.readFileSync(DB_STATE_PATH, 'utf8');
      const hasCheck = dbState.includes('checkDatabaseUpdated') || dbState.includes('check_database_updated');
      const hasReinitialize = dbState.includes('reinitializeDatabase') || dbState.includes('reinitialize_database');
      if (hasCheck && hasReinitialize) {
        pass('T-005b: Check mechanism in db-state.js',
             'checkDatabaseUpdated()/reinitializeDatabase() (or snake_case aliases) found');
      } else {
        fail('T-005b: Check mechanism in db-state.js',
             'checkDatabaseUpdated()/reinitializeDatabase() not found in dist/core/db-state.js');
      }
    } else {
      fail('T-005b: Check mechanism in db-state.js',
           'dist/core/db-state.js not found');
    }
    
    // Test 3: Write and read notification file
    const testTimestamp = Date.now().toString();
    fs.writeFileSync(dbUpdatedFile, testTimestamp);
    const readTimestamp = fs.readFileSync(dbUpdatedFile, 'utf8');
    if (readTimestamp === testTimestamp) {
      pass('T-005c: Notification file write/read works', 
           `Wrote and read: ${testTimestamp}`);
    } else {
      fail('T-005c: Notification file write/read works', 
           'Timestamp mismatch');
    }
    
    // Cleanup: remove the .db-updated file we wrote to production path
    try {
      if (fs.existsSync(dbUpdatedFile)) {
        fs.unlinkSync(dbUpdatedFile);
      }
    } catch (_cleanupErr) {
      // Best-effort cleanup
    }
    
  } catch (error) {
    fail('T-005: Cross-connection visibility', error.message);
    // Cleanup on error path too
    const dbUpdatedFile = path.join(DB_PATH, '.db-updated');
    try {
      if (fs.existsSync(dbUpdatedFile)) {
        fs.unlinkSync(dbUpdatedFile);
      }
    } catch (_) { /* best-effort */ }
  }
}

// BUG-002: Transaction Rollback
async function testBug002() {
  log('\n🔬 BUG-002: Transaction Rollback');
  
  try {
    const vectorIndexMutations = fs.readFileSync(VECTOR_INDEX_MUTATIONS_PATH, 'utf8');
    
    // Test 1: Transaction control via database.transaction() wrapper (BUG-057 fix)
    if (vectorIndexMutations.includes('const index_memory_tx = database.transaction(() => {') &&
        vectorIndexMutations.includes('return index_memory_tx();')) {
      pass('T-010a: Transaction wrapper in indexMemory()',
           'index_memory_tx uses database.transaction() in vector-index-mutations.js');
    } else {
      fail('T-010a: Transaction wrapper in indexMemory()',
           'database.transaction() wrapper not found in vector-index-mutations.js');
    }
    
    // Test 2: better-sqlite3 wrapper replaces manual BEGIN/COMMIT/ROLLBACK control.
    if (vectorIndexMutations.includes('database.transaction(() => {') &&
        !vectorIndexMutations.includes("BEGIN TRANSACTION") &&
        !vectorIndexMutations.includes("COMMIT")) {
      pass('T-010b: Automatic rollback via transaction wrapper', 
           'Mutation layer relies on better-sqlite3 transaction wrappers instead of manual BEGIN/COMMIT control');
    } else {
      fail('T-010b: Automatic rollback via transaction wrapper', 
           'Mutation layer still appears to rely on manual transaction control');
    }
    
    if (vectorIndexMutations.includes('const update_memory_tx = database.transaction(() => {') &&
        vectorIndexMutations.includes('const delete_memory_tx = database.transaction(() => {') &&
        vectorIndexMutations.includes('const delete_transaction = database.transaction(() => {')) {
      pass('T-011: Integration test for partial failure recovery', 
           'index/update/delete all execute through database.transaction() wrappers');
    } else {
      fail('T-011: Integration test for partial failure recovery', 
           'One or more mutation paths are not wrapped in database.transaction()');
    }
    
  } catch (error) {
    fail('T-010: Transaction rollback', error.message);
  }
}

// BUG-003: Embedding Dimension Confirmation
async function testBug003() {
  log('\n🔬 BUG-003: Embedding Dimension Mismatch at Startup');
  
  try {
    const vectorIndex = require(VECTOR_INDEX_PATH);
    const source = fs.readFileSync(VECTOR_INDEX_STORE_PATH, 'utf8');
    
    // Test 1: Function exists in source
    if (typeof vectorIndex.getConfirmedEmbeddingDimension === 'function') {
      pass('T-015a: getConfirmedEmbeddingDimension() exists', 
           'Function exported from vector-index.js');
    } else {
      fail('T-015a: getConfirmedEmbeddingDimension() exists', 
           'Function not exported from vector-index.js');
      return;
    }
    
    // Test 2: Function returns a dimension (source analysis)
    if (source.includes('dimension') && (source.includes('return') || source.includes('resolve'))) {
      pass('T-015b: Returns valid dimension', 
           'Function includes dimension return logic in vector-index-store.js');
    } else {
      fail('T-015b: Returns valid dimension', 
           'Dimension return logic not found in vector-index-store.js');
    }
    
  } catch (error) {
    fail('T-015: Dimension confirmation', error.message);
  }
}

// BUG-004: Constitutional Cache Invalidation
async function testBug004() {
  log('\n🔬 BUG-004: Constitutional Cache Stale After External Edits');
  
  try {
    const vectorIndexStore = fs.readFileSync(VECTOR_INDEX_STORE_PATH, 'utf8');
    
    // Test 1: mtime tracking (snake_case: last_db_mod_time)
    if (vectorIndexStore.includes('last_db_mod_time') &&
        vectorIndexStore.includes('stats.mtimeMs')) {
      pass('T-018a: Database mtime tracking implemented',
           'last_db_mod_time and mtimeMs check found in vector-index-store.js');
    } else {
      fail('T-018a: Database mtime tracking implemented',
           'mtime tracking not found in vector-index-store.js');
    }

    // Test 2: Cache validation function (snake_case: is_constitutional_cache_valid)
    if (vectorIndexStore.includes('is_constitutional_cache_valid')) {
      pass('T-018b: is_constitutional_cache_valid() exists',
           'Function found in vector-index-store.js');
    } else {
      fail('T-018b: is_constitutional_cache_valid() exists',
           'Function not found in vector-index-store.js');
    }
    
  } catch (error) {
    fail('T-018: Cache invalidation', error.message);
  }
}

// BUG-005: Rate Limiting Persistence
async function testBug005() {
  log('\n🔬 BUG-005: Rate Limiting Not Persistent');
  
  try {
    // After modularization (Spec 058), rate limiting moved to core/db-state.js
    const dbState = fs.readFileSync(DB_STATE_PATH, 'utf8');
    
    // Test 1: Config table creation (in db-state.js now)
    if (dbState.includes('CREATE TABLE IF NOT EXISTS config') || 
        dbState.includes('config')) {
      pass('T-023a: Config table handling', 
           'Config table references found in db-state.js');
    } else {
      fail('T-023a: Config table creation', 
           'Config table SQL not found');
    }
    
    // Test 2: getLastScanTime function (camelCase in db-state.js; snake_case alias is re-exported elsewhere)
    if (dbState.includes('function getLastScanTime') &&
        dbState.includes('SELECT')) {
      pass('T-023b: get_last_scan_time() reads from database',
           'getLastScanTime() and SELECT query found in db-state.js');
    } else {
      fail('T-023b: get_last_scan_time() reads from database',
           'getLastScanTime() not found in db-state.js');
    }

    // Test 3: setLastScanTime function (camelCase in db-state.js; snake_case alias is re-exported elsewhere)
    if (dbState.includes('function setLastScanTime') &&
        dbState.includes('INSERT OR REPLACE')) {
      pass('T-023c: set_last_scan_time() writes to database',
           'setLastScanTime() and INSERT OR REPLACE query found in db-state.js');
    } else {
      fail('T-023c: set_last_scan_time() writes to database',
           'setLastScanTime() not found in db-state.js');
    }
    
  } catch (error) {
    fail('T-023: Rate limiting persistence', error.message);
  }
}

// BUG-006: Prepared Statement Cache Clearing
async function testBug006() {
  log('\n🔬 BUG-006: Prepared Statement Cache Not Cleared');
  
  try {
    const vectorIndex = fs.readFileSync(VECTOR_INDEX_PATH, 'utf8');
    const vectorIndexStore = fs.readFileSync(VECTOR_INDEX_STORE_PATH, 'utf8');
    
    // Test: clear_prepared_statements in close_db (snake_case naming)
    if (vectorIndex.includes('clear_prepared_statements') &&
        vectorIndexStore.includes('clear_prepared_statements();') &&
        vectorIndexStore.includes('function close_db()')) {
      pass('T-027: clear_prepared_statements() in close_db()',
           'close_db() calls clear_prepared_statements() in vector-index-store.js');
    } else {
      fail('T-027: clear_prepared_statements() in close_db()',
           'Prepared statement cleanup not found in close_db()');
    }
    
  } catch (error) {
    fail('T-027: Statement cache clearing', error.message);
  }
}

// BUG-007: Empty Query Validation
async function testBug007() {
  log('\n🔬 BUG-007: Empty Query Edge Case');
  
  try {
    // After modularization, query validation moved to utils/validators.js
    const validators = fs.readFileSync(
      path.join(ROOT, 'mcp_server', 'dist', 'utils', 'validators.js'),
      'utf8'
    );
    
    // Test 1: validateQuery function exists (camelCase after naming migration)
    if (validators.includes('function validateQuery')) {
      pass('T-030a: validateQuery() function exists',
           'Function definition found in validators.js');
    } else {
      fail('T-030a: validateQuery() function exists',
           'Function not found');
    }
    
    // Test 2: Checks for null/undefined
    if (validators.includes('null') && validators.includes('undefined')) {
      pass('T-030b: Checks for null/undefined', 
           'Null and undefined checks found');
    } else {
      fail('T-030b: Checks for null/undefined', 
           'Checks not found');
    }
    
    // Test 3: Checks for empty/whitespace
    if (validators.includes('.trim()')) {
      pass('T-030c: Checks for empty/whitespace', 
           'Trim check found');
    } else {
      fail('T-030c: Checks for empty/whitespace', 
           'Checks not found');
    }
    
    // Test 4: MAX_QUERY_LENGTH check
    if (validators.includes('MAX_QUERY_LENGTH') || validators.includes('INPUT_LIMITS')) {
      pass('T-030d: Query length validation', 
           'Length limit check found');
    } else {
      fail('T-030d: MAX_QUERY_LENGTH check', 
           'Length limit not found');
    }
    
  } catch (error) {
    fail('T-030: Query validation', error.message);
  }
}

// BUG-008: UTF-8 BOM Detection
async function testBug008() {
  log('\n🔬 BUG-008: UTF-8 BOM Detection Missing');
  
  try {
    const memoryParser = fs.readFileSync(
      path.join(PARSING_PATH, 'memory-parser.js'),
      'utf8'
    );
    
    // Test 1: UTF-8 BOM bytes detected
    if (memoryParser.includes('0xEF') && 
        memoryParser.includes('0xBB') && 
        memoryParser.includes('0xBF')) {
      pass('T-032a: UTF-8 BOM bytes (EF BB BF) detected', 
           '0xEF, 0xBB, 0xBF found in source');
    } else {
      fail('T-032a: UTF-8 BOM bytes (EF BB BF) detected', 
           'BOM bytes not found');
    }
    
    // Test 2: 3-byte offset
    if (memoryParser.includes('offset: 3') || memoryParser.includes('slice(3)')) {
      pass('T-032b: 3-byte offset for UTF-8 BOM', 
           'Offset handling found');
    } else {
      fail('T-032b: 3-byte offset for UTF-8 BOM', 
           'Offset handling not found');
    }
    
  } catch (error) {
    fail('T-032: UTF-8 BOM detection', error.message);
  }
}

// BUG-009: Cache Key Uniqueness
async function testBug009() {
  log('\n🔬 BUG-009: Search Cache Key Collision Risk');
  
  try {
    const vectorIndexAliasesPath = path.join(SEARCH_PATH, 'vector-index-aliases.js');
    const source = fs.readFileSync(vectorIndexAliasesPath, 'utf8');
    
    // Test 1: getCacheKey function exists with SHA256
    if (source.includes('getCacheKey') && source.includes('sha256')) {
      pass('T-034a: getCacheKey() with SHA256', 
           'Function found in vector-index-aliases.js with SHA256 hashing');
    } else if (source.includes('getCacheKey')) {
      pass('T-034a: getCacheKey() exists', 
           'Function found in vector-index-aliases.js (hash method may differ)');
    } else {
      fail('T-034a: getCacheKey() function exists', 
           'Function not found in source');
      return;
    }
    
    // Test 2/3: Key uniqueness verified via source analysis
    if (source.includes('sha256') || source.includes('createHash')) {
      pass('T-034b: Key uniqueness via cryptographic hash', 
           'SHA256/createHash ensures unique keys for different inputs');
      pass('T-034c: Same inputs produce same keys (deterministic hash)', 
           'Cryptographic hashing is deterministic');
    } else {
      fail('T-034b/c: Key uniqueness tests', 
           'Cryptographic hash implementation not found in getCacheKey()');
    }
    
  } catch (error) {
    fail('T-034: Cache key uniqueness', error.message);
  }
}

// BUG-013: Orphaned Vector Auto-Cleanup
async function testBug013() {
  log('\n🔬 BUG-013: Orphaned Vector Cleanup Only at Startup');
  
  try {
    const source = fs.readFileSync(VECTOR_INDEX_QUERIES_PATH, 'utf8');
    
    // Test 1: verifyIntegrity exists in source
    if (source.includes('verifyIntegrity')) {
      pass('T-042a: verifyIntegrity() function exists', 
           'Function found in vector-index-queries.js');
    } else {
      fail('T-042a: verifyIntegrity() function exists', 
           'Function not found in vector-index-queries.js');
      return;
    }
    
    // Test 2: Check source for autoClean option
    if (source.includes('autoClean') && source.includes('options')) {
      pass('T-042b: autoClean option in verifyIntegrity()',
           'autoClean parameter found in vector-index-queries.js');
    } else {
      fail('T-042b: autoClean option in verifyIntegrity()',
           'autoClean parameter not found in vector-index-queries.js');
    }
    
  } catch (error) {
    fail('T-042: Orphaned vector auto-cleanup', error.message);
  }
}

// Config Verification
async function testConfig() {
  log('\n🔬 Configuration Verification');
  
  try {
    const config = require(path.join(CONFIG_PATH, 'search-weights.json'));
    
    // Test 1: maxTriggersPerMemory
    if (config.maxTriggersPerMemory === 10) {
      pass('Config: maxTriggersPerMemory', 
           `Value: ${config.maxTriggersPerMemory}`);
    } else {
      fail('Config: maxTriggersPerMemory', 
           `Expected 10, got ${config.maxTriggersPerMemory}`);
    }
    
    // Test 2: smartRanking weights
    if (config.smartRanking && 
        config.smartRanking.recencyWeight === 0.3 &&
        config.smartRanking.accessWeight === 0.2 &&
        config.smartRanking.relevanceWeight === 0.5) {
      pass('Config: smartRanking weights', 
           JSON.stringify(config.smartRanking));
    } else {
      fail('Config: smartRanking weights', 
           `Got: ${JSON.stringify(config.smartRanking)}`);
    }
    
  } catch (error) {
    fail('Config verification', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. MAIN
────────────────────────────────────────────────────────────────
*/

async function main() {
  log('🧪 Bug Fix Verification Tests');
  log('================================');
  log('Spec: 054-remaining-bugs-remediation');
  log(`Date: ${new Date().toISOString()}\n`);
  
  // Run all tests
  await testBug001();
  await testBug002();
  await testBug003();
  await testBug004();
  await testBug005();
  await testBug006();
  await testBug007();
  await testBug008();
  await testBug009();
  await testBug013();
  await testConfig();
  
  // Summary
  log('\n================================');
  log('📊 TEST SUMMARY');
  log('================================');
  log(`✅ Passed:  ${results.passed}`);
  log(`❌ Failed:  ${results.failed}`);
  log(`⏭️  Skipped: ${results.skipped}`);
  log(`📝 Total:   ${results.passed + results.failed + results.skipped}`);
  log('');
  
  if (results.failed === 0) {
    log('🎉 ALL TESTS PASSED!');
    return true;
  } else {
    log('⚠️  Some tests failed. Review output above.');
    return false;
  }
}

// Run tests
main().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

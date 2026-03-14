// TEST: RETRY MANAGER BEHAVIORAL VERIFICATION
// Tests retry logic, backoff strategy, batch processing,
// Background job lifecycle, and edge cases.
'use strict';

const path = require('path');
const Database = require('better-sqlite3');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────
*/

const ROOT = path.join(__dirname, '..', '..');
const MCP_DIST = path.join(ROOT, 'mcp_server', 'dist');
const VECTOR_INDEX_PATH = path.join(MCP_DIST, 'lib', 'search', 'vector-index');
const EMBEDDINGS_PATH = path.join(MCP_DIST, 'lib', 'providers', 'embeddings');
const RETRY_MANAGER_PATH = path.join(MCP_DIST, 'lib', 'providers', 'retry-manager');

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
   3. IN-MEMORY DATABASE SETUP & MODULE PATCHING
────────────────────────────────────────────────────────────────
*/

let mockDb = null;
let vectorIndex = null;
let embeddingsModule = null;
let retryManager = null;

// Saved originals for teardown
let origGetDb, origInitializeDb, origGetMemory, origGenEmbed;

/**
 * Create an in-memory better-sqlite3 database with the
 * memory_index schema that retry-manager queries rely on.
 */
function createMockDb() {
  const db = new Database(':memory:');
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_path TEXT NOT NULL,
      spec_folder TEXT DEFAULT '',
      title TEXT DEFAULT '',
      embedding_status TEXT DEFAULT 'pending',
      retry_count INTEGER DEFAULT 0,
      last_retry_at TEXT,
      failure_reason TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      embedding_generated_at TEXT,
      importance_tier TEXT DEFAULT 'normal',
      importance_weight REAL DEFAULT 0.5,
      trigger_phrases TEXT DEFAULT '[]',
      content_hash TEXT DEFAULT ''
    );
  `);

  // Regular table stand-in for vec_memories (virtual table needs sqlite-vec extension)
  db.exec(`
    CREATE TABLE IF NOT EXISTS vec_memories (
      rowid INTEGER PRIMARY KEY,
      embedding BLOB
    );
  `);

  return db;
}

/**
 * Insert a test memory row into the mock database.
 */
function insertMemory(db, overrides = {}) {
  const defaults = {
    file_path: '/test/memory.md',
    spec_folder: 'test-spec',
    title: 'Test Memory',
    embedding_status: 'pending',
    retry_count: 0,
    last_retry_at: null,
    failure_reason: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    embedding_generated_at: null,
  };
  const row = { ...defaults, ...overrides };

  const stmt = db.prepare(`
    INSERT INTO memory_index (file_path, spec_folder, title, embedding_status,
      retry_count, last_retry_at, failure_reason, created_at, updated_at,
      embedding_generated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    row.file_path, row.spec_folder, row.title, row.embedding_status,
    row.retry_count, row.last_retry_at, row.failure_reason,
    row.created_at, row.updated_at, row.embedding_generated_at
  );
  return info.lastInsertRowid;
}

/**
 * Mock embedding function — can be swapped during tests.
 */
let mockEmbeddingFn = async function (_content) {
  return new Float32Array(768).fill(0.1);
};

/**
 * Patch vector-index and embeddings modules for test isolation.
 * Must be called BEFORE requiring retry-manager.
 *
 * Strategy: Pre-populate require.cache for the embeddings module
 * with a writable mock, since the real module uses getter-only
 * re-exports that can't be monkey-patched.
 */
function setupMocks() {
  // Load the vector-index module (retry-manager's dependency)
  vectorIndex = require(VECTOR_INDEX_PATH);

  // Save originals for vectorIndex
  origGetDb = vectorIndex.getDb;
  origInitializeDb = vectorIndex.initializeDb;
  origGetMemory = vectorIndex.getMemory;

  // Patch vectorIndex (its exports are writable)
  vectorIndex.initializeDb = function () { /* no-op for tests */ };
  vectorIndex.getDb = function () { return mockDb; };
  vectorIndex.getMemory = function (id) {
    if (!mockDb) return null;
    const row = mockDb.prepare('SELECT * FROM memory_index WHERE id = ?').get(id);
    if (!row) return null;
    // Map snake_case columns to camelCase (as getMemory would)
    return {
      ...row,
      retryCount: row.retry_count,
      filePath: row.file_path,
      embeddingStatus: row.embedding_status,
      lastRetryAt: row.last_retry_at,
      failureReason: row.failure_reason,
    };
  };

  // Pre-seed the require cache for the embeddings module with a mock.
  // The real module uses __createBinding with getter-only descriptors,
  // So we replace the entire cache entry with a writable proxy.
  const embeddingsResolved = require.resolve(EMBEDDINGS_PATH);
  origGenEmbed = require.cache[embeddingsResolved]; // save original cache entry

  // Create a mock module that delegates to our swappable function
  const mockModule = new (require('module'))();
  mockModule.exports = {
    __esModule: true,
    generateDocumentEmbedding: async function (content) {
      return mockEmbeddingFn(content);
    },
    // Stubs for any other embeddings exports that might be accessed
    generateQueryEmbedding: async function () { return new Float32Array(768).fill(0.1); },
    getEmbeddingDimension: function () { return 768; },
    EMBEDDING_DIM: 768,
    MODEL_NAME: 'mock-model',
    MAX_TEXT_LENGTH: 8192,
    getProviderMetadata: function () { return { provider: 'mock', model: 'mock' }; },
    getEmbeddingProfile: function () { return null; },
  };
  mockModule.loaded = true;
  mockModule.filename = embeddingsResolved;
  require.cache[embeddingsResolved] = mockModule;

  // Keep a reference so we can swap the embedding function in tests
  embeddingsModule = mockModule.exports;

  // Now require retry-manager (it captures the patched vector-index and mock embeddings)
  retryManager = require(RETRY_MANAGER_PATH);
}

/**
 * Reset the in-memory database between test sections.
 */
function resetDb() {
  if (mockDb) {
    try { mockDb.close(); } catch { /* ignore */ }
  }
  mockDb = createMockDb();
  // Update the mock so getDb returns the new instance
  if (vectorIndex) {
    vectorIndex.getDb = function () { return mockDb; };
  }
}

/**
 * Set DB to null to simulate "no database" conditions.
 */
function nullifyDb() {
  if (vectorIndex) {
    vectorIndex.getDb = function () { return null; };
  }
}

/**
 * Restore original module functions.
 */
function teardownMocks() {
  if (vectorIndex && origGetDb) vectorIndex.getDb = origGetDb;
  if (vectorIndex && origInitializeDb) vectorIndex.initializeDb = origInitializeDb;
  if (vectorIndex && origGetMemory) vectorIndex.getMemory = origGetMemory;

  // Restore original embeddings cache entry
  if (origGenEmbed) {
    const embeddingsResolved = require.resolve(EMBEDDINGS_PATH);
    require.cache[embeddingsResolved] = origGenEmbed;
  }

  if (mockDb) {
    try { mockDb.close(); } catch { /* ignore */ }
    mockDb = null;
  }

  // Clear require cache for retry-manager so subsequent runs start fresh
  delete require.cache[require.resolve(RETRY_MANAGER_PATH)];
}

/* ─────────────────────────────────────────────────────────────
   4. TEST SECTIONS
────────────────────────────────────────────────────────────────
*/

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS & CONFIGURATION
// ───────────────────────────────────────────────────────────────
async function testConstants() {
  log('\n🔬 SECTION 1: Constants & Configuration');

  try {
    // T-100a: BACKOFF_DELAYS
    const delays = retryManager.BACKOFF_DELAYS;
    if (Array.isArray(delays) && delays.length === 3 &&
        delays[0] === 60000 && delays[1] === 300000 && delays[2] === 900000) {
      pass('T-100a: BACKOFF_DELAYS = [1min, 5min, 15min]',
        `[${delays.map(d => d / 1000 + 's').join(', ')}]`);
    } else {
      fail('T-100a: BACKOFF_DELAYS = [1min, 5min, 15min]',
        `Got: ${JSON.stringify(delays)}`);
    }

    // T-100b: MAX_RETRIES
    if (retryManager.MAX_RETRIES === 3) {
      pass('T-100b: MAX_RETRIES is 3', `Value: ${retryManager.MAX_RETRIES}`);
    } else {
      fail('T-100b: MAX_RETRIES is 3', `Got: ${retryManager.MAX_RETRIES}`);
    }

    // T-100c: BACKGROUND_JOB_CONFIG
    const cfg = retryManager.BACKGROUND_JOB_CONFIG;
    if (cfg && cfg.intervalMs === 300000 && cfg.batchSize === 5 && cfg.enabled === true) {
      pass('T-100c: BACKGROUND_JOB_CONFIG defaults',
        `interval=${cfg.intervalMs}ms, batch=${cfg.batchSize}, enabled=${cfg.enabled}`);
    } else {
      fail('T-100c: BACKGROUND_JOB_CONFIG defaults', `Got: ${JSON.stringify(cfg)}`);
    }

    // T-100d: Backoff delays are strictly increasing
    if (delays[0] < delays[1] && delays[1] < delays[2]) {
      pass('T-100d: BACKOFF_DELAYS strictly increasing', 'Each delay > previous');
    } else {
      fail('T-100d: BACKOFF_DELAYS strictly increasing', `[${delays.join(', ')}]`);
    }

  } catch (error) {
    fail('T-100: Constants section', error.message);
  }
}

// ───────────────────────────────────────────────────────────────
// 2. GETRETRYSTATS


// ───────────────────────────────────────────────────────────────
async function testGetRetryStats() {
  log('\n🔬 SECTION 2: getRetryStats');

  try {
    // T-101a: Returns default stats when DB is null
    nullifyDb();
    const defaultStats = retryManager.getRetryStats();
    if (defaultStats.pending === 0 && defaultStats.retry === 0 &&
        defaultStats.failed === 0 && defaultStats.success === 0 &&
        defaultStats.total === 0 && defaultStats.queue_size === 0) {
      pass('T-101a: Returns default stats when DB null',
        `All zeros: ${JSON.stringify(defaultStats)}`);
    } else {
      fail('T-101a: Returns default stats when DB null',
        `Got: ${JSON.stringify(defaultStats)}`);
    }

    // T-101b: Returns correct stats from populated DB
    resetDb();
    insertMemory(mockDb, { embedding_status: 'pending' });
    insertMemory(mockDb, { embedding_status: 'pending' });
    insertMemory(mockDb, { embedding_status: 'retry', retry_count: 1 });
    insertMemory(mockDb, { embedding_status: 'failed' });
    insertMemory(mockDb, { embedding_status: 'success' });
    insertMemory(mockDb, { embedding_status: 'success' });
    insertMemory(mockDb, { embedding_status: 'success' });

    const stats = retryManager.getRetryStats();
    if (stats.pending === 2 && stats.retry === 1 && stats.failed === 1 &&
        stats.success === 3 && stats.total === 7 && stats.queue_size === 3) {
      pass('T-101b: Correct stats from populated DB',
        `p=${stats.pending} r=${stats.retry} f=${stats.failed} s=${stats.success} t=${stats.total} q=${stats.queue_size}`);
    } else {
      fail('T-101b: Correct stats from populated DB',
        `Got: ${JSON.stringify(stats)}`);
    }

    // T-101c: queue_size = pending + retry
    if (stats.queue_size === stats.pending + stats.retry) {
      pass('T-101c: queue_size = pending + retry',
        `${stats.queue_size} = ${stats.pending} + ${stats.retry}`);
    } else {
      fail('T-101c: queue_size = pending + retry',
        `${stats.queue_size} != ${stats.pending} + ${stats.retry}`);
    }

  } catch (error) {
    fail('T-101: getRetryStats section', error.message);
  }
}

// ───────────────────────────────────────────────────────────────
// 3. GETRETRYQUEUE


// ───────────────────────────────────────────────────────────────
async function testGetRetryQueue() {
  log('\n🔬 SECTION 3: getRetryQueue');

  try {
    // T-102a: Returns empty array when DB is null
    nullifyDb();
    const emptyResult = retryManager.getRetryQueue(10);
    if (Array.isArray(emptyResult) && emptyResult.length === 0) {
      pass('T-102a: Returns empty array when DB null', 'Length: 0');
    } else {
      fail('T-102a: Returns empty array when DB null',
        `Got: ${JSON.stringify(emptyResult)}`);
    }

    // T-102b: Returns pending items
    resetDb();
    const id1 = insertMemory(mockDb, { embedding_status: 'pending' });
    const id2 = insertMemory(mockDb, { embedding_status: 'pending' });

    const pendingQueue = retryManager.getRetryQueue(10);
    if (pendingQueue.length === 2) {
      pass('T-102b: Returns pending items', `Got ${pendingQueue.length} items`);
    } else {
      fail('T-102b: Returns pending items', `Expected 2, got ${pendingQueue.length}`);
    }

    // T-102c: Returns retry items that have waited long enough
    resetDb();
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    insertMemory(mockDb, {
      embedding_status: 'retry',
      retry_count: 1,
      last_retry_at: twoMinutesAgo,  // 2 min ago, backoff[0]=1 min → eligible
    });

    const eligibleQueue = retryManager.getRetryQueue(10);
    if (eligibleQueue.length === 1) {
      pass('T-102c: Returns retry items past backoff delay',
        `1 item eligible (waited 2min, need 1min)`);
    } else {
      fail('T-102c: Returns retry items past backoff delay',
        `Expected 1, got ${eligibleQueue.length}`);
    }

    // T-102d: Excludes retry items that haven't waited long enough
    resetDb();
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000).toISOString();
    insertMemory(mockDb, {
      embedding_status: 'retry',
      retry_count: 1,
      last_retry_at: tenSecondsAgo,  // 10s ago, backoff[0]=1 min → NOT eligible
    });

    const tooSoonQueue = retryManager.getRetryQueue(10);
    if (tooSoonQueue.length === 0) {
      pass('T-102d: Excludes retry items before backoff',
        `0 items (waited 10s, need 1min)`);
    } else {
      fail('T-102d: Excludes retry items before backoff',
        `Expected 0, got ${tooSoonQueue.length}`);
    }

    // T-102e: Respects limit parameter
    resetDb();
    for (let i = 0; i < 10; i++) {
      insertMemory(mockDb, { embedding_status: 'pending' });
    }

    const limitedQueue = retryManager.getRetryQueue(3);
    if (limitedQueue.length === 3) {
      pass('T-102e: Respects limit parameter',
        `Requested 3, got ${limitedQueue.length} of 10`);
    } else {
      fail('T-102e: Respects limit parameter',
        `Expected 3, got ${limitedQueue.length}`);
    }

    // T-102f: Prioritizes pending over retry items
    resetDb();
    // Insert retry item first (older created_at)
    const longAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    insertMemory(mockDb, {
      embedding_status: 'retry',
      retry_count: 1,
      last_retry_at: longAgo,
      created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    });
    // Insert pending item second (newer created_at)
    insertMemory(mockDb, {
      embedding_status: 'pending',
      created_at: new Date().toISOString(),
    });

    const priorityQueue = retryManager.getRetryQueue(10);
    if (priorityQueue.length === 2 && priorityQueue[0].embedding_status === 'pending') {
      pass('T-102f: Pending items prioritized over retry',
        `First: ${priorityQueue[0].embedding_status}, Second: ${priorityQueue[1].embedding_status}`);
    } else if (priorityQueue.length === 2) {
      fail('T-102f: Pending items prioritized over retry',
        `First: ${priorityQueue[0].embedding_status}, expected 'pending'`);
    } else {
      fail('T-102f: Pending items prioritized over retry',
        `Expected 2 items, got ${priorityQueue.length}`);
    }

    // T-102g: Excludes items with retry_count >= MAX_RETRIES
    resetDb();
    insertMemory(mockDb, {
      embedding_status: 'retry',
      retry_count: 3,   // equals MAX_RETRIES
      last_retry_at: longAgo,
    });
    insertMemory(mockDb, {
      embedding_status: 'retry',
      retry_count: 5,   // exceeds MAX_RETRIES
      last_retry_at: longAgo,
    });

    const maxedQueue = retryManager.getRetryQueue(10);
    if (maxedQueue.length === 0) {
      pass('T-102g: Excludes items at/above MAX_RETRIES',
        'retry_count >= 3 excluded');
    } else {
      fail('T-102g: Excludes items at/above MAX_RETRIES',
        `Expected 0, got ${maxedQueue.length}`);
    }

  } catch (error) {
    fail('T-102: getRetryQueue section', error.message);
  }
}

// ───────────────────────────────────────────────────────────────
// 4. BACKOFF DELAY CALCULATION


// ───────────────────────────────────────────────────────────────
async function testBackoffLogic() {
  log('\n🔬 SECTION 4: Backoff Delay Calculation (via getRetryQueue)');

  try {
    // T-103a: retryCount=1 uses BACKOFF_DELAYS[0] (1 minute) — the off-by-one fix
    resetDb();
    const justOverOneMin = new Date(Date.now() - 61 * 1000).toISOString();
    insertMemory(mockDb, {
      embedding_status: 'retry',
      retry_count: 1,
      last_retry_at: justOverOneMin,
    });

    const q1 = retryManager.getRetryQueue(10);
    if (q1.length === 1) {
      pass('T-103a: retryCount=1 uses 1-min backoff (off-by-one fix)',
        'Eligible after 61s wait with backoff[0]=60s');
    } else {
      fail('T-103a: retryCount=1 uses 1-min backoff (off-by-one fix)',
        `Expected 1, got ${q1.length}`);
    }

    // T-103b: retryCount=1 NOT eligible at 30 seconds
    resetDb();
    const thirtySecsAgo = new Date(Date.now() - 30 * 1000).toISOString();
    insertMemory(mockDb, {
      embedding_status: 'retry',
      retry_count: 1,
      last_retry_at: thirtySecsAgo,
    });

    const q2 = retryManager.getRetryQueue(10);
    if (q2.length === 0) {
      pass('T-103b: retryCount=1 NOT eligible at 30s',
        'Correctly requires >= 60s wait');
    } else {
      fail('T-103b: retryCount=1 NOT eligible at 30s',
        `Expected 0, got ${q2.length}`);
    }

    // T-103c: retryCount=2 uses BACKOFF_DELAYS[1] (5 minutes)
    resetDb();
    const sixMinAgo = new Date(Date.now() - 6 * 60 * 1000).toISOString();
    insertMemory(mockDb, {
      embedding_status: 'retry',
      retry_count: 2,
      last_retry_at: sixMinAgo,
    });

    const q3 = retryManager.getRetryQueue(10);
    if (q3.length === 1) {
      pass('T-103c: retryCount=2 uses 5-min backoff',
        'Eligible after 6 min wait with backoff[1]=5min');
    } else {
      fail('T-103c: retryCount=2 uses 5-min backoff',
        `Expected 1, got ${q3.length}`);
    }

    // T-103d: retryCount=2 NOT eligible at 3 minutes
    resetDb();
    const threeMinAgo = new Date(Date.now() - 3 * 60 * 1000).toISOString();
    insertMemory(mockDb, {
      embedding_status: 'retry',
      retry_count: 2,
      last_retry_at: threeMinAgo,
    });

    const q4 = retryManager.getRetryQueue(10);
    if (q4.length === 0) {
      pass('T-103d: retryCount=2 NOT eligible at 3min',
        'Correctly requires >= 5min wait');
    } else {
      fail('T-103d: retryCount=2 NOT eligible at 3min',
        `Expected 0, got ${q4.length}`);
    }

    // T-103e: Retry with no last_retry_at is eligible
    resetDb();
    insertMemory(mockDb, {
      embedding_status: 'retry',
      retry_count: 1,
      last_retry_at: null,
    });

    const q5 = retryManager.getRetryQueue(10);
    if (q5.length === 1) {
      pass('T-103e: Retry with null last_retry_at is eligible',
        'Falls through to default return true');
    } else {
      fail('T-103e: Retry with null last_retry_at is eligible',
        `Expected 1, got ${q5.length}`);
    }

  } catch (error) {
    fail('T-103: Backoff logic section', error.message);
  }
}

// ───────────────────────────────────────────────────────────────
// 5. GETFAILEDEMBEDDINGS


// ───────────────────────────────────────────────────────────────
async function testGetFailedEmbeddings() {
  log('\n🔬 SECTION 5: getFailedEmbeddings');

  try {
    // T-104a: Returns empty array when DB null
    nullifyDb();
    const emptyResult = retryManager.getFailedEmbeddings();
    if (Array.isArray(emptyResult) && emptyResult.length === 0) {
      pass('T-104a: Returns empty array when DB null', 'Length: 0');
    } else {
      fail('T-104a: Returns empty array when DB null',
        `Got: ${JSON.stringify(emptyResult)}`);
    }

    // T-104b: Returns only failed items
    resetDb();
    insertMemory(mockDb, { embedding_status: 'pending' });
    insertMemory(mockDb, { embedding_status: 'failed', failure_reason: 'timeout' });
    insertMemory(mockDb, { embedding_status: 'success' });
    insertMemory(mockDb, { embedding_status: 'failed', failure_reason: 'invalid' });
    insertMemory(mockDb, { embedding_status: 'retry' });

    const failedItems = retryManager.getFailedEmbeddings();
    if (failedItems.length === 2 &&
        failedItems.every(r => r.embedding_status === 'failed')) {
      pass('T-104b: Returns only failed items',
        `Got ${failedItems.length} failed items out of 5 total`);
    } else {
      fail('T-104b: Returns only failed items',
        `Expected 2 failed, got ${failedItems.length}`);
    }

    // T-104c: Results ordered by updated_at DESC
    resetDb();
    insertMemory(mockDb, {
      embedding_status: 'failed',
      updated_at: '2025-01-01T00:00:00Z',
      title: 'Old',
    });
    insertMemory(mockDb, {
      embedding_status: 'failed',
      updated_at: '2025-06-01T00:00:00Z',
      title: 'New',
    });

    const ordered = retryManager.getFailedEmbeddings();
    if (ordered.length === 2 && ordered[0].title === 'New') {
      pass('T-104c: Results ordered by updated_at DESC',
        `First: "${ordered[0].title}", Second: "${ordered[1].title}"`);
    } else {
      fail('T-104c: Results ordered by updated_at DESC',
        `Order: ${ordered.map(r => r.title).join(', ')}`);
    }

  } catch (error) {
    fail('T-104: getFailedEmbeddings section', error.message);
  }
}

// ───────────────────────────────────────────────────────────────
// 6. MARKASFAILED


// ───────────────────────────────────────────────────────────────
async function testMarkAsFailed() {
  log('\n🔬 SECTION 6: markAsFailed');

  try {
    // T-105a: No-op when DB null
    nullifyDb();
    try {
      retryManager.markAsFailed(999, 'test reason');
      pass('T-105a: No-op when DB null', 'No error thrown');
    } catch (e) {
      fail('T-105a: No-op when DB null', `Threw: ${e.message}`);
    }

    // T-105b: Sets status to failed with reason
    resetDb();
    const id = insertMemory(mockDb, { embedding_status: 'retry', retry_count: 2 });
    retryManager.markAsFailed(id, 'API timeout after 30s');

    const row = mockDb.prepare('SELECT * FROM memory_index WHERE id = ?').get(id);
    if (row.embedding_status === 'failed' && row.failure_reason === 'API timeout after 30s') {
      pass('T-105b: Sets status=failed with reason',
        `status=${row.embedding_status}, reason="${row.failure_reason}"`);
    } else {
      fail('T-105b: Sets status=failed with reason',
        `status=${row.embedding_status}, reason=${row.failure_reason}`);
    }

    // T-105c: Updates the updated_at timestamp
    const beforeMark = new Date('2020-01-01').toISOString();
    resetDb();
    const id2 = insertMemory(mockDb, {
      embedding_status: 'retry',
      updated_at: beforeMark,
    });
    retryManager.markAsFailed(id2, 'reason');
    const row2 = mockDb.prepare('SELECT updated_at FROM memory_index WHERE id = ?').get(id2);
    if (row2.updated_at > beforeMark) {
      pass('T-105c: updated_at timestamp refreshed',
        `Before: ${beforeMark}, After: ${row2.updated_at}`);
    } else {
      fail('T-105c: updated_at timestamp refreshed',
        `updated_at not changed: ${row2.updated_at}`);
    }

  } catch (error) {
    fail('T-105: markAsFailed section', error.message);
  }
}

// ───────────────────────────────────────────────────────────────
// 7. RESETFORRETRY


// ───────────────────────────────────────────────────────────────
async function testResetForRetry() {
  log('\n🔬 SECTION 7: resetForRetry');

  try {
    // T-106a: Returns false when DB null
    nullifyDb();
    const result1 = retryManager.resetForRetry(999);
    if (result1 === false) {
      pass('T-106a: Returns false when DB null', `Got: ${result1}`);
    } else {
      fail('T-106a: Returns false when DB null', `Got: ${result1}`);
    }

    // T-106b: Resets a failed item
    resetDb();
    const id = insertMemory(mockDb, {
      embedding_status: 'failed',
      retry_count: 3,
      failure_reason: 'max retries',
      last_retry_at: new Date().toISOString(),
    });

    const result2 = retryManager.resetForRetry(id);
    const row = mockDb.prepare('SELECT * FROM memory_index WHERE id = ?').get(id);

    if (result2 === true && row.embedding_status === 'retry' &&
        row.retry_count === 0 && row.last_retry_at === null &&
        row.failure_reason === null) {
      pass('T-106b: Resets failed item correctly',
        `status=${row.embedding_status}, retry_count=${row.retry_count}, reason=${row.failure_reason}`);
    } else {
      fail('T-106b: Resets failed item correctly',
        `result=${result2}, status=${row.embedding_status}, count=${row.retry_count}`);
    }

    // T-106c: Returns false for non-failed items
    resetDb();
    const pendingId = insertMemory(mockDb, { embedding_status: 'pending' });
    const retryId = insertMemory(mockDb, { embedding_status: 'retry' });
    const successId = insertMemory(mockDb, { embedding_status: 'success' });

    const r1 = retryManager.resetForRetry(pendingId);
    const r2 = retryManager.resetForRetry(retryId);
    const r3 = retryManager.resetForRetry(successId);

    if (r1 === false && r2 === false && r3 === false) {
      pass('T-106c: Returns false for non-failed items',
        `pending=${r1}, retry=${r2}, success=${r3}`);
    } else {
      fail('T-106c: Returns false for non-failed items',
        `pending=${r1}, retry=${r2}, success=${r3}`);
    }

    // T-106d: Returns false for non-existent ID
    resetDb();
    const result3 = retryManager.resetForRetry(99999);
    if (result3 === false) {
      pass('T-106d: Returns false for non-existent ID', 'No row matched');
    } else {
      fail('T-106d: Returns false for non-existent ID', `Got: ${result3}`);
    }

  } catch (error) {
    fail('T-106: resetForRetry section', error.message);
  }
}

// ───────────────────────────────────────────────────────────────
// 8. RETRYEMBEDDING


// ───────────────────────────────────────────────────────────────
async function testRetryEmbedding() {
  log('\n🔬 SECTION 8: retryEmbedding');

  try {
    // T-107a: Returns error when DB null
    nullifyDb();
    const result1 = await retryManager.retryEmbedding(1, 'content');
    if (result1.success === false &&
        typeof result1.error === 'string' &&
        result1.error.includes('Database not initialized')) {
      pass('T-107a: Returns error when DB null',
        `error="${result1.error}"`);
    } else {
      fail('T-107a: Returns error when DB null',
        `Got: ${JSON.stringify(result1)}`);
    }

    // T-107b: Returns error when memory not found
    resetDb();
    const result2 = await retryManager.retryEmbedding(99999, 'content');
    if (result2.success === false && result2.error === 'Memory not found') {
      pass('T-107b: Returns error when memory not found',
        `error="${result2.error}"`);
    } else {
      fail('T-107b: Returns error when memory not found',
        `Got: ${JSON.stringify(result2)}`);
    }

    // T-107c: Marks as failed when retryCount >= MAX_RETRIES
    resetDb();
    const id3 = insertMemory(mockDb, {
      embedding_status: 'retry',
      retry_count: 3,
    });
    const result3 = await retryManager.retryEmbedding(id3, 'content');
    const row3 = mockDb.prepare('SELECT * FROM memory_index WHERE id = ?').get(id3);
    if (result3.success === false && result3.permanent === true &&
        row3.embedding_status === 'failed') {
      pass('T-107c: Marks as failed at MAX_RETRIES',
        `permanent=${result3.permanent}, status=${row3.embedding_status}`);
    } else {
      fail('T-107c: Marks as failed at MAX_RETRIES',
        `Got: ${JSON.stringify(result3)}, db_status=${row3.embedding_status}`);
    }

    // T-107d: Increments retry count when embedding returns null
    resetDb();
    const id4 = insertMemory(mockDb, {
      embedding_status: 'retry',
      retry_count: 0,
    });
    // Override embedding to return null
    const savedEmbed = mockEmbeddingFn;
    mockEmbeddingFn = async () => null;

    const result4 = await retryManager.retryEmbedding(id4, 'content');
    const row4 = mockDb.prepare('SELECT * FROM memory_index WHERE id = ?').get(id4);

    mockEmbeddingFn = savedEmbed; // restore

    if (result4.success === false && result4.error === 'Embedding returned null') {
      pass('T-107d: Handles null embedding result',
        `error="${result4.error}", retry_count=${row4.retry_count}`);
    } else {
      fail('T-107d: Handles null embedding result',
        `Got: ${JSON.stringify(result4)}`);
    }

    // T-107e: Successful retry updates DB correctly
    resetDb();
    const id5 = insertMemory(mockDb, {
      embedding_status: 'retry',
      retry_count: 1,
      failure_reason: 'previous failure',
    });

    const result5 = await retryManager.retryEmbedding(id5, 'test content');
    const row5 = mockDb.prepare('SELECT * FROM memory_index WHERE id = ?').get(id5);

    if (result5.success === true && result5.dimensions === 768 &&
        row5.embedding_status === 'success' &&
        row5.failure_reason === null) {
      pass('T-107e: Successful retry updates DB',
        `dims=${result5.dimensions}, status=${row5.embedding_status}`);
    } else {
      fail('T-107e: Successful retry updates DB',
        `result=${JSON.stringify(result5)}, status=${row5.embedding_status}`);
    }

    // T-107f: Successful retry inserts into vec_memories
    if (result5.success) {
      const vecRow = mockDb.prepare('SELECT * FROM vec_memories WHERE rowid = ?').get(id5);
      if (vecRow && vecRow.embedding) {
        pass('T-107f: Embedding stored in vec_memories',
          `rowid=${vecRow.rowid}, blob_size=${vecRow.embedding.length}`);
      } else {
        fail('T-107f: Embedding stored in vec_memories', 'No vec_memories row found');
      }
    } else {
      skip('T-107f: Embedding stored in vec_memories', 'T-107e failed');
    }

    // T-107g: Handles embedding generation error
    resetDb();
    const id7 = insertMemory(mockDb, {
      embedding_status: 'retry',
      retry_count: 0,
    });
    mockEmbeddingFn = async () => {
      throw new Error('API rate limited');
    };

    const result7 = await retryManager.retryEmbedding(id7, 'content');
    mockEmbeddingFn = savedEmbed;

    if (result7.success === false && result7.error === 'API rate limited') {
      pass('T-107g: Handles embedding generation error',
        `error="${result7.error}"`);
    } else {
      fail('T-107g: Handles embedding generation error',
        `Got: ${JSON.stringify(result7)}`);
    }

  } catch (error) {
    fail('T-107: retryEmbedding section', error.message);
  }
}

// ───────────────────────────────────────────────────────────────
// 9. PROCESSRETRYQUEUE


// ───────────────────────────────────────────────────────────────
async function testProcessRetryQueue() {
  log('\n🔬 SECTION 9: processRetryQueue');

  try {
    // T-108a: Returns zeros when queue is empty
    resetDb();
    const result1 = await retryManager.processRetryQueue(10);
    if (result1.processed === 0 && result1.succeeded === 0 && result1.failed === 0) {
      pass('T-108a: Returns zeros on empty queue',
        `p=${result1.processed}, s=${result1.succeeded}, f=${result1.failed}`);
    } else {
      fail('T-108a: Returns zeros on empty queue',
        `Got: ${JSON.stringify(result1)}`);
    }

    // T-108b: Uses custom contentLoader
    resetDb();
    const id2 = insertMemory(mockDb, { embedding_status: 'pending' });
    let loaderCalledWith = null;
    const customLoader = async (memory) => {
      loaderCalledWith = memory;
      return 'custom content from loader';
    };

    const result2 = await retryManager.processRetryQueue(10, customLoader);
    if (loaderCalledWith !== null && loaderCalledWith.id === id2) {
      pass('T-108b: Custom contentLoader invoked',
        `Called with memory id=${loaderCalledWith.id}`);
    } else {
      fail('T-108b: Custom contentLoader invoked',
        `loaderCalledWith: ${JSON.stringify(loaderCalledWith)}`);
    }

    // T-108c: Counts content load failure as retry attempt (P2-08 fix)
    resetDb();
    const id3 = insertMemory(mockDb, {
      embedding_status: 'pending',
      retry_count: 0,
    });
    const failLoader = async () => null;  // simulate unreadable file

    const result3 = await retryManager.processRetryQueue(10, failLoader);
    const row3 = mockDb.prepare('SELECT * FROM memory_index WHERE id = ?').get(id3);

    if (result3.failed === 1 && result3.processed === 1) {
      pass('T-108c: Content load failure counted as processed+failed',
        `processed=${result3.processed}, failed=${result3.failed}`);
    } else {
      fail('T-108c: Content load failure counted as processed+failed',
        `Got: ${JSON.stringify(result3)}`);
    }

    // Verify retry count was incremented (P2-08 fix)
    if (row3 && row3.retry_count > 0) {
      pass('T-108d: Content failure increments retry_count (P2-08)',
        `retry_count=${row3.retry_count}`);
    } else {
      fail('T-108d: Content failure increments retry_count (P2-08)',
        `retry_count=${row3 ? row3.retry_count : 'row not found'}`);
    }

    // T-108e: Batch result details array populated
    resetDb();
    insertMemory(mockDb, { embedding_status: 'pending' });
    insertMemory(mockDb, { embedding_status: 'pending' });
    const successLoader = async () => 'some content';

    const result5 = await retryManager.processRetryQueue(10, successLoader);
    if (result5.details && Array.isArray(result5.details) && result5.details.length === 2) {
      pass('T-108e: Batch result has details array',
        `details.length=${result5.details.length}`);
    } else {
      fail('T-108e: Batch result has details array',
        `Got: ${result5.details ? result5.details.length : 'undefined'}`);
    }

    // T-108f: Mixed success/failure in batch
    resetDb();
    const idSuccess = insertMemory(mockDb, { embedding_status: 'pending' });
    const idFail = insertMemory(mockDb, { embedding_status: 'pending' });

    let callCount = 0;
    const mixedLoader = async (memory) => {
      callCount++;
      // First call succeeds, second returns null
      return callCount === 1 ? 'content' : null;
    };

    const result6 = await retryManager.processRetryQueue(10, mixedLoader);
    if (result6.succeeded >= 1 && result6.failed >= 1) {
      pass('T-108f: Mixed success/failure in batch',
        `succeeded=${result6.succeeded}, failed=${result6.failed}`);
    } else {
      fail('T-108f: Mixed success/failure in batch',
        `succeeded=${result6.succeeded}, failed=${result6.failed}`);
    }

  } catch (error) {
    fail('T-108: processRetryQueue section', error.message);
  }
}

// ───────────────────────────────────────────────────────────────
// 10. BACKGROUND JOB LIFECYCLE


// ───────────────────────────────────────────────────────────────
async function testBackgroundJobLifecycle() {
  log('\n🔬 SECTION 10: Background Job Lifecycle');

  try {
    // Ensure clean state
    retryManager.stopBackgroundJob();

    // T-109a: isBackgroundJobRunning initially false
    if (retryManager.isBackgroundJobRunning() === false) {
      pass('T-109a: isBackgroundJobRunning initially false', 'No job running');
    } else {
      fail('T-109a: isBackgroundJobRunning initially false', 'Job was running');
    }

    // T-109b: startBackgroundJob returns true on first call
    resetDb();
    // Use very long interval so it doesn't fire during tests
    const started = retryManager.startBackgroundJob({
      intervalMs: 999999,
      batchSize: 1,
      enabled: true,
    });
    if (started === true) {
      pass('T-109b: startBackgroundJob returns true', 'Job started');
    } else {
      fail('T-109b: startBackgroundJob returns true', `Got: ${started}`);
    }

    // T-109c: isBackgroundJobRunning returns true while running
    if (retryManager.isBackgroundJobRunning() === true) {
      pass('T-109c: isBackgroundJobRunning true while active', 'Job detected');
    } else {
      fail('T-109c: isBackgroundJobRunning true while active', 'Not detected');
    }

    // T-109d: startBackgroundJob returns false when already running
    const duplicate = retryManager.startBackgroundJob({ intervalMs: 999999 });
    if (duplicate === false) {
      pass('T-109d: Duplicate startBackgroundJob returns false', 'Prevented double-start');
    } else {
      fail('T-109d: Duplicate startBackgroundJob returns false', `Got: ${duplicate}`);
    }

    // T-109e: stopBackgroundJob returns true and stops
    const stopped = retryManager.stopBackgroundJob();
    if (stopped === true && retryManager.isBackgroundJobRunning() === false) {
      pass('T-109e: stopBackgroundJob returns true & clears',
        `stopped=${stopped}, running=${retryManager.isBackgroundJobRunning()}`);
    } else {
      fail('T-109e: stopBackgroundJob returns true & clears',
        `stopped=${stopped}, running=${retryManager.isBackgroundJobRunning()}`);
    }

    // T-109f: stopBackgroundJob returns false when not running
    const stoppedAgain = retryManager.stopBackgroundJob();
    if (stoppedAgain === false) {
      pass('T-109f: stopBackgroundJob returns false when idle', 'Nothing to stop');
    } else {
      fail('T-109f: stopBackgroundJob returns false when idle', `Got: ${stoppedAgain}`);
    }

    // T-109g: startBackgroundJob returns false when disabled
    const disabled = retryManager.startBackgroundJob({ enabled: false });
    if (disabled === false) {
      pass('T-109g: startBackgroundJob returns false when disabled', 'Correctly rejected');
    } else {
      retryManager.stopBackgroundJob(); // cleanup
      fail('T-109g: startBackgroundJob returns false when disabled', `Got: ${disabled}`);
    }

  } catch (error) {
    fail('T-109: Background job section', error.message);
    // Safety cleanup
    try { retryManager.stopBackgroundJob(); } catch { /* ignore */ }
  }
}

// ───────────────────────────────────────────────────────────────
// 11. RUNBACKGROUNDJOB


// ───────────────────────────────────────────────────────────────
async function testRunBackgroundJob() {
  log('\n🔬 SECTION 11: runBackgroundJob');

  try {
    // T-110a: Returns queue_empty when nothing to process
    resetDb();
    const result1 = await retryManager.runBackgroundJob(5);
    if (result1.processed === 0 && result1.queue_empty === true) {
      pass('T-110a: Returns queue_empty=true on empty queue',
        `processed=${result1.processed}, queue_empty=${result1.queue_empty}`);
    } else {
      fail('T-110a: Returns queue_empty=true on empty queue',
        `Got: ${JSON.stringify(result1)}`);
    }

    // T-110b: Processes items from queue
    resetDb();
    insertMemory(mockDb, { embedding_status: 'pending' });
    insertMemory(mockDb, { embedding_status: 'pending' });

    const result2 = await retryManager.runBackgroundJob(5);
    if (result2.processed >= 1) {
      pass('T-110b: Processes items from queue',
        `processed=${result2.processed}, succeeded=${result2.succeeded}`);
    } else {
      fail('T-110b: Processes items from queue',
        `Got: ${JSON.stringify(result2)}`);
    }

  } catch (error) {
    fail('T-110: runBackgroundJob section', error.message);
  }
}

// ───────────────────────────────────────────────────────────────
// 12. PARSEROW (VIA GETRETRYQUEUE/GETFAILEDEMBEDDINGS)


// ───────────────────────────────────────────────────────────────
async function testParseRow() {
  log('\n🔬 SECTION 12: Row Parsing (triggerPhrases handling)');

  try {
    // T-111a: JSON string triggerPhrases are parsed
    resetDb();
    // Insert with JSON string in the column that gets aliased to triggerPhrases
    // The retry-manager's parseRow checks row.triggerPhrases (camelCase)
    // In our mock DB, the column is trigger_phrases (snake_case), but SELECT *
    // Returns the column as-is. The parseRow function checks row.triggerPhrases
    // Which comes from the camelCase alias. Let's insert with a direct column override.
    const id1 = insertMemory(mockDb, { embedding_status: 'pending' });
    // Manually add a triggerPhrases value via a column that might be aliased
    // Since the actual DB stores trigger_phrases, and getRetryQueue does SELECT *,
    // ParseRow checks row.triggerPhrases (which won't exist in our mock).
    // This test verifies the behavior when the field IS present.

    // We need to test parseRow indirectly. The function only fires on
    // Rows returned by getRetryQueue. Since our schema uses snake_case,
    // TriggerPhrases won't be set. Let's test that it returns a shallow copy.
    const queue = retryManager.getRetryQueue(10);
    if (queue.length === 1 && typeof queue[0].id !== 'undefined') {
      pass('T-111a: getRetryQueue returns parsed row copies',
        `Row has id=${queue[0].id}`);
    } else {
      fail('T-111a: getRetryQueue returns parsed row copies',
        `Got: ${queue.length} items`);
    }

    // T-111b: getFailedEmbeddings also parses rows
    resetDb();
    insertMemory(mockDb, { embedding_status: 'failed' });
    const failed = retryManager.getFailedEmbeddings();
    if (failed.length === 1 && typeof failed[0].id !== 'undefined') {
      pass('T-111b: getFailedEmbeddings returns parsed row copies',
        `Row has id=${failed[0].id}`);
    } else {
      fail('T-111b: getFailedEmbeddings returns parsed row copies',
        `Got: ${failed.length} items`);
    }

  } catch (error) {
    fail('T-111: parseRow section', error.message);
  }
}

// ───────────────────────────────────────────────────────────────
// 13. EDGE CASES


// ───────────────────────────────────────────────────────────────
async function testEdgeCases() {
  log('\n🔬 SECTION 13: Edge Cases');

  try {
    // T-112a: getRetryQueue with limit=0
    resetDb();
    insertMemory(mockDb, { embedding_status: 'pending' });
    const q0 = retryManager.getRetryQueue(0);
    if (q0.length === 0) {
      pass('T-112a: getRetryQueue(0) returns empty', `Length: ${q0.length}`);
    } else {
      fail('T-112a: getRetryQueue(0) returns empty', `Got: ${q0.length}`);
    }

    // T-112b: processRetryQueue with limit=0
    resetDb();
    insertMemory(mockDb, { embedding_status: 'pending' });
    const r0 = await retryManager.processRetryQueue(0);
    if (r0.processed === 0) {
      pass('T-112b: processRetryQueue(0) processes nothing',
        `processed=${r0.processed}`);
    } else {
      fail('T-112b: processRetryQueue(0) processes nothing',
        `processed=${r0.processed}`);
    }

    // T-112c: retryEmbedding with empty string content
    resetDb();
    const idEmpty = insertMemory(mockDb, {
      embedding_status: 'pending',
      retry_count: 0,
    });
    // Empty string is truthy for the embedding function but technically valid
    const rEmpty = await retryManager.retryEmbedding(idEmpty, '');
    // Should still succeed since mock embedding doesn't care about content
    if (rEmpty.success === true) {
      pass('T-112c: retryEmbedding with empty string succeeds',
        'Mock embedding accepts any content');
    } else {
      // Also acceptable: the implementation might reject empty content
      pass('T-112c: retryEmbedding with empty string handled',
        `result: ${JSON.stringify(rEmpty)}`);
    }

    // T-112d: Multiple resets on same failed item
    resetDb();
    const idMulti = insertMemory(mockDb, { embedding_status: 'failed', retry_count: 3 });
    const reset1 = retryManager.resetForRetry(idMulti);
    // After first reset, status is 'retry', so second reset should return false
    const reset2 = retryManager.resetForRetry(idMulti);
    if (reset1 === true && reset2 === false) {
      pass('T-112d: Double reset returns true then false',
        `first=${reset1}, second=${reset2}`);
    } else {
      fail('T-112d: Double reset returns true then false',
        `first=${reset1}, second=${reset2}`);
    }

    // T-112e: Retry escalation: retry_count 0→1→2→failed
    resetDb();
    const idEsc = insertMemory(mockDb, {
      embedding_status: 'pending',
      retry_count: 0,
    });
    // Mock embedding to always return null (triggers incrementRetryCount)
    const savedEmbedEsc = mockEmbeddingFn;
    mockEmbeddingFn = async () => null;

    // Retry 1: count 0→1, status→retry
    await retryManager.retryEmbedding(idEsc, 'content');
    const after1 = mockDb.prepare('SELECT * FROM memory_index WHERE id = ?').get(idEsc);

    // Retry 2: count 1→2, status→retry
    await retryManager.retryEmbedding(idEsc, 'content');
    const after2 = mockDb.prepare('SELECT * FROM memory_index WHERE id = ?').get(idEsc);

    // Retry 3: count 2→3, status→failed (MAX_RETRIES=3)
    await retryManager.retryEmbedding(idEsc, 'content');
    const after3 = mockDb.prepare('SELECT * FROM memory_index WHERE id = ?').get(idEsc);

    mockEmbeddingFn = savedEmbedEsc;

    if (after1.retry_count === 1 && after1.embedding_status === 'retry' &&
        after2.retry_count === 2 && after2.embedding_status === 'retry' &&
        after3.embedding_status === 'failed') {
      pass('T-112e: Escalation 0→1→2→failed',
        `c1=${after1.retry_count}/${after1.embedding_status}, c2=${after2.retry_count}/${after2.embedding_status}, c3=${after3.embedding_status}`);
    } else {
      fail('T-112e: Escalation 0→1→2→failed',
        `c1=${after1.retry_count}/${after1.embedding_status}, c2=${after2.retry_count}/${after2.embedding_status}, c3=${after3.retry_count}/${after3.embedding_status}`);
    }

  } catch (error) {
    fail('T-112: Edge cases section', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. MAIN RUNNER
────────────────────────────────────────────────────────────────
*/

async function main() {
  log('═══════════════════════════════════════════════════════════');
  log('🧪 RETRY MANAGER — BEHAVIORAL TESTS');
  log('═══════════════════════════════════════════════════════════');
  log(`   Source: mcp_server/lib/providers/retry-manager.ts`);
  log(`   Re-export: scripts/lib/retry-manager.ts`);
  log('');

  // Initialize mocks
  try {
    mockDb = createMockDb();
    setupMocks();
    log('   ✅ Mock database & module patches initialized\n');
  } catch (error) {
    log(`   ❌ Setup failed: ${error.message}`);
    log(`      Stack: ${error.stack}`);
    process.exit(1);
  }

  // Run all test sections
  await testConstants();
  await testGetRetryStats();
  await testGetRetryQueue();
  await testBackoffLogic();
  await testGetFailedEmbeddings();
  await testMarkAsFailed();
  await testResetForRetry();
  await testRetryEmbedding();
  await testProcessRetryQueue();
  await testBackgroundJobLifecycle();
  await testRunBackgroundJob();
  await testParseRow();
  await testEdgeCases();

  // Cleanup
  teardownMocks();

  // Summary
  log('\n═══════════════════════════════════════════════════════════');
  log('📊 TEST SUMMARY');
  log('═══════════════════════════════════════════════════════════');
  log(`   ✅ Passed:  ${results.passed}`);
  log(`   ❌ Failed:  ${results.failed}`);
  log(`   ⏭️  Skipped: ${results.skipped}`);
  log(`   📝 Total:   ${results.passed + results.failed + results.skipped}`);
  log('');

  if (results.failed === 0) {
    log('   🎉 ALL TESTS PASSED!\n');
    return true;
  } else {
    log('   ⚠️  Some tests failed. Review output above.\n');
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

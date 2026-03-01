# SpecKit Test Implementation Guide

> Comprehensive guidance for implementing tests across the SpecKit system.
> Covers patterns, database setup, mocking strategies, utilities, templates, and coverage.

---

## Table of Contents

1. [Test Patterns](#1-test-patterns)
2. [Database Setup](#2-database-setup)
3. [Mocking Strategies](#3-mocking-strategies)
4. [Common Test Utilities](#4-common-test-utilities)
5. [Test File Templates](#5-test-file-templates)
6. [Coverage Reporting](#6-coverage-reporting)

---

## 1. Test Patterns

### 1.1 Describe Blocks Structure

SpecKit tests follow a consistent IIFE (Immediately Invoked Function Expression) pattern for isolation:

```javascript
// ───────────────────────────────────────────────────────────────
// TEST: [MODULE NAME]
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict';

  const path = require('path');
  const fs = require('fs');

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */

  const LIB_PATH = path.join(__dirname, '..', 'lib');

  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: [],
  };

  /* ─────────────────────────────────────────────────────────────
     2. TEST UTILITIES
  ──────────────────────────────────────────────────────────────── */

  function log(msg) {
    console.log(msg);
  }

  function pass(test_id, test_name, evidence) {
    results.passed++;
    results.tests.push({ id: test_id, name: test_name, status: 'PASS', evidence });
    log(`   [PASS] ${test_id}: ${test_name}`);
    if (evidence) log(`      Evidence: ${evidence}`);
  }

  function fail(test_id, test_name, reason) {
    results.failed++;
    results.tests.push({ id: test_id, name: test_name, status: 'FAIL', reason });
    log(`   [FAIL] ${test_id}: ${test_name}`);
    log(`      Reason: ${reason}`);
  }

  function skip(test_id, test_name, reason) {
    results.skipped++;
    results.tests.push({ id: test_id, name: test_name, status: 'SKIP', reason });
    log(`   [SKIP] ${test_id}: ${test_name} (skipped: ${reason})`);
  }

  /* ─────────────────────────────────────────────────────────────
     3. MODULE LOADING
  ──────────────────────────────────────────────────────────────── */

  let moduleUnderTest;

  function test_module_loads() {
    log('\n[SUITE] Module Loading');
    try {
      moduleUnderTest = require(path.join(LIB_PATH, 'module-name.js'));
      pass('T001', 'Module loads without error', 'require() succeeded');
    } catch (error) {
      fail('T001', 'Module loads without error', error.message);
      return false;
    }
    return true;
  }

  /* ─────────────────────────────────────────────────────────────
     4. TEST SUITES
  ──────────────────────────────────────────────────────────────── */

  // 4.1 FEATURE A TESTS (T100-T110)
  function test_feature_a() {
    log('\n[SUITE] Feature A - T100-T110');

    // T100: Basic functionality
    // ... test implementation
  }

  // 4.2 FEATURE B TESTS (T111-T120)
  function test_feature_b() {
    log('\n[SUITE] Feature B - T111-T120');

    // ... test implementation
  }

  /* ─────────────────────────────────────────────────────────────
     5. TEST RUNNER
  ──────────────────────────────────────────────────────────────── */

  async function runTests() {
    log('[MODULE NAME] Tests');
    log('==========================================');
    log(`Date: ${new Date().toISOString()}\n`);

    if (!test_module_loads()) {
      log('\n[WARN] Module failed to load. Aborting tests.');
      return results;
    }

    // Run test suites
    test_feature_a();
    test_feature_b();

    // Summary
    log('\n==========================================');
    log('TEST SUMMARY');
    log('==========================================');
    log(`[PASS]:  ${results.passed}`);
    log(`[FAIL]:  ${results.failed}`);
    log(`[SKIP]:  ${results.skipped}`);
    log(`Total:   ${results.passed + results.failed + results.skipped}`);

    if (results.failed === 0) {
      log('\nALL TESTS PASSED!');
    } else {
      log('\nSome tests failed. Review output above.');
    }

    return results;
  }

  // Run if executed directly
  if (require.main === module) {
    runTests().then((r) => {
      process.exit(r.failed > 0 ? 1 : 0);
    });
  }

  module.exports = { runTests };
})();
```

### 1.2 Test Naming Conventions

Follow the `should_action_when_condition` pattern for test names:

```javascript
// Test ID format: T[NNN] where NNN is a sequential number
// Group related tests in ranges (e.g., T100-T110 for Feature A)

// Good naming examples:
pass('T201', 'should_return_HOT_when_attentionScore_is_0.95', `Got: ${state}`);
pass('T202', 'should_clamp_to_1_when_retrievability_exceeds_1', `Got: ${r}`);
pass('T203', 'should_throw_when_database_is_null', error.message);
pass('T204', 'should_use_default_when_stability_missing', `Fallback: ${value}`);

// Bad naming examples (avoid):
pass('T201', 'test hot state', result);  // Too vague
pass('T202', 'it works', result);        // Non-descriptive
pass('T203', 'testing', result);         // No context
```

### 1.3 Assertion Patterns

SpecKit uses direct conditional assertions rather than Jest-style matchers:

```javascript
// Basic equality check
if (result === expected) {
  pass('T100', 'should_equal_expected_value', `Got: ${result}`);
} else {
  fail('T100', 'should_equal_expected_value', `Expected ${expected}, got: ${result}`);
}

// Approximate equality (for floating-point)
if (Math.abs(actual - expected) < 0.001) {
  pass('T101', 'should_approximately_equal', `Got: ${actual.toFixed(4)}`);
} else {
  fail('T101', 'should_approximately_equal', `Expected ~${expected}, got: ${actual}`);
}

// Range check
if (value >= min && value <= max) {
  pass('T102', 'should_be_within_range', `${value} in [${min}, ${max}]`);
} else {
  fail('T102', 'should_be_within_range', `${value} outside [${min}, ${max}]`);
}

// Type check
if (typeof result === 'function') {
  pass('T103', 'should_export_function', 'Function exists');
} else {
  fail('T103', 'should_export_function', `Expected function, got ${typeof result}`);
}

// Array check
if (Array.isArray(result) && result.length === expected.length) {
  pass('T104', 'should_return_correct_array_length', `Length: ${result.length}`);
} else {
  fail('T104', 'should_return_correct_array_length', `Expected length ${expected.length}`);
}

// Error throwing check
try {
  functionThatShouldThrow(invalidInput);
  fail('T105', 'should_throw_on_invalid_input', 'No error thrown');
} catch (e) {
  if (e.message.includes('expected error text')) {
    pass('T105', 'should_throw_on_invalid_input', e.message);
  } else {
    fail('T105', 'should_throw_on_invalid_input', `Wrong error: ${e.message}`);
  }
}

// Boolean negation check
if (!result.includes(unwantedItem)) {
  pass('T106', 'should_not_include_unwanted_item', 'Not present');
} else {
  fail('T106', 'should_not_include_unwanted_item', 'Found unwanted item');
}
```

---

## 2. Database Setup

### 2.1 In-Memory SQLite Initialization

```javascript
const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');

let test_db = null;
let TEST_DB_PATH = null;

/**
 * Create an in-memory test database with required schema
 * @returns {boolean} Whether setup succeeded
 */
function setup_test_database() {
  try {
    // Option 1: True in-memory database
    test_db = new Database(':memory:');

    // Option 2: Temporary file database (for persistence during test run)
    // TEST_DB_PATH = path.join(os.tmpdir(), `test-${Date.now()}.sqlite`);
    // test_db = new Database(TEST_DB_PATH);

    return true;
  } catch (error) {
    console.error(`Database setup failed: ${error.message}`);
    return false;
  }
}

/**
 * Cleanup test database after tests complete
 */
function teardown_test_database() {
  if (test_db) {
    try {
      test_db.close();
    } catch (e) {
      console.warn(`Could not close database: ${e.message}`);
    }
  }

  if (TEST_DB_PATH && fs.existsSync(TEST_DB_PATH)) {
    try {
      fs.unlinkSync(TEST_DB_PATH);
    } catch (e) {
      console.warn(`Could not delete test database: ${e.message}`);
    }
  }
}
```

### 2.2 Schema Migration for Tests

```javascript
/**
 * Apply the SpecKit memory schema to test database
 */
function apply_schema(db) {
  db.exec(`
    -- Core memory index table
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      file_path TEXT NOT NULL,
      spec_folder TEXT,
      anchor_id TEXT,
      title TEXT,
      summary TEXT,
      content_hash TEXT,
      importance_tier TEXT DEFAULT 'standard',
      importance_weight REAL DEFAULT 1.0,
      context_type TEXT DEFAULT 'session',
      stability REAL DEFAULT 1.0,
      difficulty REAL DEFAULT 5.0,
      last_review TEXT,
      review_count INTEGER DEFAULT 0,
      access_count INTEGER DEFAULT 0,
      last_accessed INTEGER,
      embedding_status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Memory history for tracking changes
    CREATE TABLE IF NOT EXISTS memory_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      old_value TEXT,
      new_value TEXT,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (memory_id) REFERENCES memory_index(id)
    );

    -- Session tracking
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      spec_folder TEXT,
      started_at TEXT DEFAULT CURRENT_TIMESTAMP,
      last_activity TEXT DEFAULT CURRENT_TIMESTAMP,
      turn_count INTEGER DEFAULT 0
    );

    -- Attention scores per session
    CREATE TABLE IF NOT EXISTS session_memories (
      session_id TEXT NOT NULL,
      memory_id INTEGER NOT NULL,
      attention_score REAL DEFAULT 1.0,
      last_activated INTEGER,
      activation_count INTEGER DEFAULT 0,
      PRIMARY KEY (session_id, memory_id),
      FOREIGN KEY (session_id) REFERENCES sessions(id),
      FOREIGN KEY (memory_id) REFERENCES memory_index(id)
    );

    -- Vector embeddings (virtual table using sqlite-vec)
    -- Note: For tests without sqlite-vec, use mock table
    CREATE TABLE IF NOT EXISTS memory_embeddings (
      memory_id INTEGER PRIMARY KEY,
      embedding BLOB,
      model TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Indexes for performance
    CREATE INDEX IF NOT EXISTS idx_memory_spec_folder ON memory_index(spec_folder);
    CREATE INDEX IF NOT EXISTS idx_memory_importance ON memory_index(importance_tier);
    CREATE INDEX IF NOT EXISTS idx_memory_embedding_status ON memory_index(embedding_status);
  `);
}

/**
 * Reset database to clean state between tests
 */
function reset_database(db) {
  db.exec(`
    DELETE FROM session_memories;
    DELETE FROM sessions;
    DELETE FROM memory_history;
    DELETE FROM memory_embeddings;
    DELETE FROM memory_index;
  `);
}
```

### 2.3 Test Fixtures Factory Functions

```javascript
/**
 * Create a test memory with sensible defaults
 * @param {Object} overrides - Properties to override
 * @returns {Object} Memory object
 */
function createTestMemory(overrides = {}) {
  return {
    id: 'test-memory-' + Date.now(),
    title: 'Test Memory',
    summary: 'Test summary for memory',
    specFolder: 'test-spec',
    filePath: '/test/memory.md',
    attentionScore: 0.5,
    stability: 1.0,
    difficulty: 5.0,
    importanceTier: 'standard',
    reviewCount: 0,
    accessCount: 0,
    lastReview: null,
    lastAccess: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Create a memory with a specific days-ago last access
 * @param {number} daysAgo - Days since last access
 * @param {Object} overrides - Additional overrides
 * @returns {Object} Memory object
 */
function createMemoryWithAge(daysAgo, overrides = {}) {
  const lastAccess = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  return createTestMemory({
    lastAccess: lastAccess.toISOString(),
    ...overrides,
  });
}

/**
 * Insert a test memory into database
 * @param {Database} db - Database instance
 * @param {Object} options - Memory options
 * @returns {number} Inserted memory ID
 */
function insertTestMemory(db, options = {}) {
  const {
    file_path = '/test/memory.md',
    spec_folder = 'test-spec',
    title = 'Test Memory',
    summary = 'Test summary',
    stability = 1.0,
    difficulty = 5.0,
    last_review = null,
    review_count = 0,
    importance_tier = 'standard',
  } = options;

  const stmt = db.prepare(`
    INSERT INTO memory_index
    (file_path, spec_folder, title, summary, stability, difficulty, last_review, review_count, importance_tier, embedding_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'success')
  `);

  const result = stmt.run(
    file_path, spec_folder, title, summary,
    stability, difficulty, last_review, review_count, importance_tier
  );

  return result.lastInsertRowid;
}

/**
 * Create a test session
 * @param {Database} db - Database instance
 * @param {Object} options - Session options
 * @returns {string} Session ID
 */
function createTestSession(db, options = {}) {
  const {
    id = `session-${Date.now()}`,
    spec_folder = 'test-spec',
    turn_count = 0,
  } = options;

  const stmt = db.prepare(`
    INSERT INTO sessions (id, spec_folder, turn_count)
    VALUES (?, ?, ?)
  `);

  stmt.run(id, spec_folder, turn_count);
  return id;
}

/**
 * Retrieve a memory by ID
 * @param {Database} db - Database instance
 * @param {number} id - Memory ID
 * @returns {Object|null} Memory record
 */
function getMemoryById(db, id) {
  return db.prepare('SELECT * FROM memory_index WHERE id = ?').get(id);
}
```

---

## 3. Mocking Strategies

### 3.1 External API Mocks (Voyage, Cohere, OpenAI)

```javascript
/**
 * Mock embedding provider for testing without API calls
 * Generates deterministic pseudo-embeddings based on content hash
 */
function mockEmbeddingProvider() {
  return {
    name: 'mock',
    dimensions: 384,

    /**
     * Generate mock embedding for text
     * @param {string} text - Text to embed
     * @returns {Promise<number[]>} Embedding vector
     */
    async generateEmbedding(text) {
      return generateDeterministicEmbedding(text, 384);
    },

    /**
     * Batch generate embeddings
     * @param {string[]} texts - Texts to embed
     * @returns {Promise<number[][]>} Array of embeddings
     */
    async generateBatchEmbeddings(texts) {
      return texts.map(text => generateDeterministicEmbedding(text, 384));
    },

    /**
     * Check if provider is available
     * @returns {Promise<boolean>} Always true for mock
     */
    async isAvailable() {
      return true;
    }
  };
}

/**
 * Generate deterministic embedding from text (for reproducible tests)
 * @param {string} text - Input text
 * @param {number} dimensions - Embedding dimensions
 * @returns {number[]} Normalized embedding vector
 */
function generateDeterministicEmbedding(text, dimensions = 384) {
  const embedding = new Array(dimensions);

  // Simple hash-based pseudo-embedding
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Generate deterministic values
  for (let i = 0; i < dimensions; i++) {
    const seed = (hash * (i + 1)) % 1000000;
    embedding[i] = (Math.sin(seed) + 1) / 2; // Normalize to [0, 1]
  }

  // Normalize to unit vector
  const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
  return embedding.map(v => v / magnitude);
}

/**
 * Mock Voyage AI provider
 */
function mockVoyageProvider() {
  return {
    name: 'voyage-mock',
    dimensions: 1024,
    model: 'voyage-3',

    async generateEmbedding(text) {
      // Simulate API delay
      await new Promise(r => setTimeout(r, 10));
      return generateDeterministicEmbedding(text, 1024);
    },

    async generateBatchEmbeddings(texts) {
      await new Promise(r => setTimeout(r, 10 * texts.length));
      return texts.map(t => generateDeterministicEmbedding(t, 1024));
    },

    // Simulate rate limiting for testing
    simulateRateLimit: false,
    async checkRateLimit() {
      if (this.simulateRateLimit) {
        throw new Error('Rate limit exceeded');
      }
    }
  };
}

/**
 * Mock OpenAI provider
 */
function mockOpenAIProvider() {
  return {
    name: 'openai-mock',
    dimensions: 1536,
    model: 'text-embedding-3-small',

    async generateEmbedding(text) {
      await new Promise(r => setTimeout(r, 5));
      return generateDeterministicEmbedding(text, 1536);
    },

    async generateBatchEmbeddings(texts) {
      await new Promise(r => setTimeout(r, 5 * texts.length));
      return texts.map(t => generateDeterministicEmbedding(t, 1536));
    }
  };
}

/**
 * Mock Cohere provider
 */
function mockCohereProvider() {
  return {
    name: 'cohere-mock',
    dimensions: 1024,
    model: 'embed-english-v3.0',

    async generateEmbedding(text) {
      await new Promise(r => setTimeout(r, 8));
      return generateDeterministicEmbedding(text, 1024);
    },

    async generateBatchEmbeddings(texts) {
      await new Promise(r => setTimeout(r, 8 * texts.length));
      return texts.map(t => generateDeterministicEmbedding(t, 1024));
    }
  };
}
```

### 3.2 File System Mocks for Memory Files

```javascript
const path = require('path');
const os = require('os');

/**
 * Create a mock file system for memory file testing
 */
function mockFileSystem() {
  const files = new Map();

  return {
    files,

    /**
     * Write a mock file
     * @param {string} filePath - File path
     * @param {string} content - File content
     */
    writeFile(filePath, content) {
      files.set(filePath, {
        content,
        mtime: new Date(),
        size: content.length
      });
    },

    /**
     * Read a mock file
     * @param {string} filePath - File path
     * @returns {string|null} File content or null
     */
    readFile(filePath) {
      const file = files.get(filePath);
      return file ? file.content : null;
    },

    /**
     * Check if file exists
     * @param {string} filePath - File path
     * @returns {boolean} Whether file exists
     */
    exists(filePath) {
      return files.has(filePath);
    },

    /**
     * Delete a mock file
     * @param {string} filePath - File path
     */
    unlink(filePath) {
      files.delete(filePath);
    },

    /**
     * Get file stats
     * @param {string} filePath - File path
     * @returns {Object|null} File stats
     */
    stat(filePath) {
      const file = files.get(filePath);
      if (!file) return null;
      return {
        mtime: file.mtime,
        size: file.size,
        isFile: () => true,
        isDirectory: () => false
      };
    },

    /**
     * Clear all mock files
     */
    clear() {
      files.clear();
    }
  };
}

/**
 * Create a real temporary test directory with cleanup
 */
function createTempTestDir(prefix = 'speckit-test') {
  const testDir = path.join(os.tmpdir(), `${prefix}-${Date.now()}`);
  const fs = require('fs');
  fs.mkdirSync(testDir, { recursive: true });

  return {
    path: testDir,

    /**
     * Create a file in the temp directory
     * @param {string} relativePath - Relative path within temp dir
     * @param {string} content - File content
     * @returns {string} Full file path
     */
    createFile(relativePath, content) {
      const fullPath = path.join(testDir, relativePath);
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(fullPath, content, 'utf8');
      return fullPath;
    },

    /**
     * Create a memory markdown file
     * @param {string} name - Memory name
     * @param {Object} options - Memory options
     * @returns {string} Full file path
     */
    createMemoryFile(name, options = {}) {
      const {
        title = 'Test Memory',
        summary = 'Test summary',
        anchors = [],
        content = 'Test content'
      } = options;

      let md = `# ${title}\n\n`;
      md += `## ANCHOR: summary\n${summary}\n\n`;

      for (const anchor of anchors) {
        md += `## ANCHOR: ${anchor.id}\n${anchor.content}\n\n`;
      }

      md += content;

      const fileName = `${name}.md`;
      return this.createFile(`memory/${fileName}`, md);
    },

    /**
     * Cleanup the temp directory
     */
    cleanup() {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    }
  };
}
```

### 3.3 Clock Mocks for Time-Sensitive Tests

```javascript
/**
 * Mock clock for time-dependent tests
 */
function mockClock() {
  let currentTime = Date.now();
  const originalDate = Date;
  const originalNow = Date.now;

  return {
    /**
     * Get current mock time
     * @returns {number} Current timestamp
     */
    now() {
      return currentTime;
    },

    /**
     * Set the mock time
     * @param {number|Date} time - Time to set
     */
    setTime(time) {
      currentTime = typeof time === 'number' ? time : time.getTime();
    },

    /**
     * Advance time by milliseconds
     * @param {number} ms - Milliseconds to advance
     */
    advance(ms) {
      currentTime += ms;
    },

    /**
     * Advance time by days
     * @param {number} days - Days to advance
     */
    advanceDays(days) {
      currentTime += days * 24 * 60 * 60 * 1000;
    },

    /**
     * Install the mock clock globally
     */
    install() {
      Date.now = () => currentTime;

      // Override Date constructor for new Date()
      global.Date = class MockDate extends originalDate {
        constructor(...args) {
          if (args.length === 0) {
            super(currentTime);
          } else {
            super(...args);
          }
        }

        static now() {
          return currentTime;
        }
      };
    },

    /**
     * Restore the original clock
     */
    restore() {
      Date.now = originalNow;
      global.Date = originalDate;
    }
  };
}

// Usage example in tests:
function test_time_dependent_feature() {
  const clock = mockClock();

  try {
    clock.install();

    // Set specific time for test
    clock.setTime(new Date('2025-01-15T10:00:00Z').getTime());

    // Create memory with current (mocked) time
    const memory = createTestMemory({ lastAccess: new Date().toISOString() });

    // Advance 5 days
    clock.advanceDays(5);

    // Test that 5 days have passed
    const daysSince = (Date.now() - new Date(memory.lastAccess).getTime()) / (24 * 60 * 60 * 1000);
    if (Math.abs(daysSince - 5) < 0.01) {
      pass('T501', 'should_calculate_days_since_last_access', `Days: ${daysSince.toFixed(2)}`);
    } else {
      fail('T501', 'should_calculate_days_since_last_access', `Expected 5, got ${daysSince}`);
    }

  } finally {
    clock.restore();
  }
}
```

---

## 4. Common Test Utilities

### 4.1 createTestDatabase()

```javascript
/**
 * Create a fully initialized test database
 * @param {Object} options - Configuration options
 * @returns {Object} Database utilities object
 */
function createTestDatabase(options = {}) {
  const {
    inMemory = true,
    applySchema = true,
    seedData = false,
  } = options;

  const Database = require('better-sqlite3');
  const db = inMemory
    ? new Database(':memory:')
    : new Database(path.join(os.tmpdir(), `test-${Date.now()}.sqlite`));

  if (applySchema) {
    apply_schema(db);
  }

  const utils = {
    db,

    // Insert helpers
    insertMemory: (opts) => insertTestMemory(db, opts),
    insertSession: (opts) => createTestSession(db, opts),

    // Query helpers
    getMemory: (id) => getMemoryById(db, id),
    getSession: (id) => db.prepare('SELECT * FROM sessions WHERE id = ?').get(id),
    getAllMemories: () => db.prepare('SELECT * FROM memory_index').all(),

    // Modification helpers
    updateMemory: (id, updates) => {
      const sets = Object.keys(updates).map(k => `${k} = ?`).join(', ');
      const values = [...Object.values(updates), id];
      return db.prepare(`UPDATE memory_index SET ${sets} WHERE id = ?`).run(...values);
    },

    // Cleanup
    reset: () => reset_database(db),
    close: () => db.close(),

    // Transaction support
    transaction: (fn) => db.transaction(fn)(),
  };

  if (seedData) {
    // Insert some default test data
    utils.insertSession({ id: 'test-session' });
    utils.insertMemory({ file_path: '/test/memory-1.md', title: 'Memory 1' });
    utils.insertMemory({ file_path: '/test/memory-2.md', title: 'Memory 2' });
  }

  return utils;
}
```

### 4.2 createTestMemory()

```javascript
/**
 * Create a test memory object with all FSRS fields
 * @param {Object} overrides - Properties to override
 * @returns {Object} Complete memory object
 */
function createTestMemory(overrides = {}) {
  const now = new Date().toISOString();

  return {
    // Identity
    id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    filePath: '/test/memory.md',
    specFolder: 'test-spec',
    anchorId: null,

    // Content
    title: 'Test Memory',
    summary: 'This is a test memory for unit testing',
    contentHash: 'abc123',

    // Classification
    importanceTier: 'standard',
    importanceWeight: 1.0,
    contextType: 'session',

    // FSRS Parameters
    stability: 1.0,        // Days until 90% retention
    difficulty: 5.0,       // 1-10 scale
    retrievability: 1.0,   // Current R value (0-1)
    attentionScore: 0.5,   // Attention within session

    // Review tracking
    lastReview: null,
    nextReview: null,
    reviewCount: 0,
    accessCount: 0,
    lastAccess: null,

    // Metadata
    embeddingStatus: 'pending',
    createdAt: now,
    updatedAt: now,

    // Apply overrides
    ...overrides,
  };
}

/**
 * Create memory configured for specific state
 */
const MemoryStates = {
  HOT: () => createTestMemory({ attentionScore: 0.90, stability: 10.0 }),
  WARM: () => createTestMemory({ attentionScore: 0.50, stability: 5.0 }),
  COLD: () => createTestMemory({ attentionScore: 0.10, stability: 1.0 }),
  DORMANT: () => createTestMemory({ attentionScore: 0.02, stability: 0.5 }),
  ARCHIVED: () => createMemoryWithAge(100, { attentionScore: 0.50 }),
  NEW: () => createTestMemory({ reviewCount: 0, stability: 1.0 }),
  WELL_LEARNED: () => createTestMemory({ reviewCount: 10, stability: 30.0, difficulty: 3.0 }),
};
```

### 4.3 createTestSession()

```javascript
/**
 * Create a test session with configurable state
 * @param {Object} options - Session options
 * @returns {Object} Session object
 */
function createTestSession(options = {}) {
  const now = new Date().toISOString();

  return {
    id: options.id || `session-${Date.now()}`,
    specFolder: options.specFolder || 'test-spec',
    startedAt: options.startedAt || now,
    lastActivity: options.lastActivity || now,
    turnCount: options.turnCount || 0,
    memories: options.memories || [],

    // Convenience methods
    addMemory(memoryId, attentionScore = 1.0) {
      this.memories.push({ memoryId, attentionScore, activationCount: 1 });
    },

    advanceTurn() {
      this.turnCount++;
      this.lastActivity = new Date().toISOString();
    }
  };
}

/**
 * Create session with pre-populated memories at various attention levels
 */
function createSessionWithMemories(db, memoryCount = 5) {
  const sessionId = createTestSession(db);
  const memoryIds = [];

  for (let i = 0; i < memoryCount; i++) {
    const memId = insertTestMemory(db, {
      file_path: `/test/memory-${i}.md`,
      title: `Memory ${i}`,
    });
    memoryIds.push(memId);

    // Link to session with varying attention scores
    const attentionScore = 1.0 - (i * 0.15); // 1.0, 0.85, 0.70, 0.55, 0.40
    db.prepare(`
      INSERT INTO session_memories (session_id, memory_id, attention_score)
      VALUES (?, ?, ?)
    `).run(sessionId, memId, attentionScore);
  }

  return { sessionId, memoryIds };
}
```

### 4.4 mockEmbeddingProvider()

```javascript
/**
 * Create a configurable mock embedding provider
 * @param {Object} options - Provider options
 * @returns {Object} Mock provider
 */
function mockEmbeddingProvider(options = {}) {
  const {
    dimensions = 384,
    delay = 0,
    failureRate = 0,
    deterministic = true,
  } = options;

  let callCount = 0;

  return {
    name: 'mock-provider',
    dimensions,
    callCount: () => callCount,

    async generateEmbedding(text) {
      callCount++;

      // Simulate delay
      if (delay > 0) {
        await new Promise(r => setTimeout(r, delay));
      }

      // Simulate failures
      if (failureRate > 0 && Math.random() < failureRate) {
        throw new Error('Mock embedding generation failed');
      }

      // Generate embedding
      return deterministic
        ? generateDeterministicEmbedding(text, dimensions)
        : generateRandomEmbedding(dimensions);
    },

    async generateBatchEmbeddings(texts) {
      const embeddings = [];
      for (const text of texts) {
        embeddings.push(await this.generateEmbedding(text));
      }
      return embeddings;
    },

    reset() {
      callCount = 0;
    }
  };
}

function generateRandomEmbedding(dimensions) {
  const embedding = new Array(dimensions);
  for (let i = 0; i < dimensions; i++) {
    embedding[i] = Math.random() * 2 - 1;
  }
  const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
  return embedding.map(v => v / magnitude);
}
```

---

## 5. Test File Templates

### 5.1 Unit Test Template

```javascript
#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// UNIT TEST: [ModuleName]
// Tests for: [brief description of what's being tested]
// Test IDs: T[XXX]-T[YYY]
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict';

  const path = require('path');

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */

  const MODULE_PATH = path.join(__dirname, '..', 'lib', '[module-name].js');

  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: [],
  };

  /* ─────────────────────────────────────────────────────────────
     2. TEST UTILITIES
  ──────────────────────────────────────────────────────────────── */

  function log(msg) { console.log(msg); }

  function pass(id, name, evidence) {
    results.passed++;
    results.tests.push({ id, name, status: 'PASS', evidence });
    log(`   [PASS] ${id}: ${name}`);
    if (evidence) log(`      Evidence: ${evidence}`);
  }

  function fail(id, name, reason) {
    results.failed++;
    results.tests.push({ id, name, status: 'FAIL', reason });
    log(`   [FAIL] ${id}: ${name}`);
    log(`      Reason: ${reason}`);
  }

  function skip(id, name, reason) {
    results.skipped++;
    results.tests.push({ id, name, status: 'SKIP', reason });
    log(`   [SKIP] ${id}: ${name} (${reason})`);
  }

  /* ─────────────────────────────────────────────────────────────
     3. MODULE LOADING
  ──────────────────────────────────────────────────────────────── */

  let moduleUnderTest;

  function loadModule() {
    log('\n[SETUP] Loading module');
    try {
      moduleUnderTest = require(MODULE_PATH);
      pass('T000', 'module_loads_without_error', 'require() succeeded');
      return true;
    } catch (error) {
      fail('T000', 'module_loads_without_error', error.message);
      return false;
    }
  }

  /* ─────────────────────────────────────────────────────────────
     4. TEST SUITES
  ──────────────────────────────────────────────────────────────── */

  // 4.1 EXPORTS TESTS (T001-T010)
  function test_exports() {
    log('\n[SUITE] Module Exports (T001-T010)');

    // T001: Main function exported
    if (typeof moduleUnderTest.mainFunction === 'function') {
      pass('T001', 'should_export_mainFunction', 'Function exists');
    } else {
      fail('T001', 'should_export_mainFunction', `Got: ${typeof moduleUnderTest.mainFunction}`);
    }

    // T002: Configuration exported
    if (moduleUnderTest.CONFIG && typeof moduleUnderTest.CONFIG === 'object') {
      pass('T002', 'should_export_CONFIG_object', JSON.stringify(Object.keys(moduleUnderTest.CONFIG)));
    } else {
      fail('T002', 'should_export_CONFIG_object', 'CONFIG not found or not an object');
    }
  }

  // 4.2 CORE FUNCTIONALITY TESTS (T011-T030)
  function test_core_functionality() {
    log('\n[SUITE] Core Functionality (T011-T030)');

    // T011: Basic operation
    try {
      const result = moduleUnderTest.mainFunction('test input');
      if (result !== null && result !== undefined) {
        pass('T011', 'should_process_valid_input', `Result: ${JSON.stringify(result)}`);
      } else {
        fail('T011', 'should_process_valid_input', 'Result was null/undefined');
      }
    } catch (error) {
      fail('T011', 'should_process_valid_input', `Error: ${error.message}`);
    }

    // T012: Error handling for invalid input
    try {
      moduleUnderTest.mainFunction(null);
      fail('T012', 'should_throw_on_null_input', 'No error thrown');
    } catch (error) {
      if (error.message.includes('Invalid input')) {
        pass('T012', 'should_throw_on_null_input', error.message);
      } else {
        fail('T012', 'should_throw_on_null_input', `Wrong error: ${error.message}`);
      }
    }
  }

  // 4.3 EDGE CASES (T031-T050)
  function test_edge_cases() {
    log('\n[SUITE] Edge Cases (T031-T050)');

    // T031: Empty string input
    // T032: Very long input
    // T033: Special characters
    // etc.
  }

  /* ─────────────────────────────────────────────────────────────
     5. TEST RUNNER
  ──────────────────────────────────────────────────────────────── */

  async function runTests() {
    log('================================================');
    log('  [ModuleName] Unit Tests');
    log('================================================');
    log(`Date: ${new Date().toISOString()}\n`);

    if (!loadModule()) {
      log('\n[ERROR] Module failed to load. Aborting.');
      return results;
    }

    test_exports();
    test_core_functionality();
    test_edge_cases();

    // Summary
    log('\n================================================');
    log('  TEST SUMMARY');
    log('================================================');
    log(`  [PASS]:  ${results.passed}`);
    log(`  [FAIL]:  ${results.failed}`);
    log(`  [SKIP]:  ${results.skipped}`);
    log(`  Total:   ${results.passed + results.failed + results.skipped}`);

    if (results.failed === 0) {
      log('\n  ALL TESTS PASSED!');
    } else {
      log('\n  Some tests failed. Review output above.');
    }

    return results;
  }

  if (require.main === module) {
    runTests().then(r => process.exit(r.failed > 0 ? 1 : 0));
  }

  module.exports = { runTests };
})();
```

### 5.2 Integration Test Template

```javascript
#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// INTEGRATION TEST: [Feature Name]
// Tests interaction between: [list of modules/components]
// Test IDs: T[XXX]-T[YYY]
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict';

  const path = require('path');
  const fs = require('fs');
  const os = require('os');

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */

  const LIB_PATH = path.join(__dirname, '..', 'lib');
  const HANDLERS_PATH = path.join(__dirname, '..', 'handlers');

  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: [],
  };

  /* ─────────────────────────────────────────────────────────────
     2. TEST UTILITIES (same as unit test)
  ──────────────────────────────────────────────────────────────── */

  function log(msg) { console.log(msg); }
  function pass(id, name, evidence) { /* ... */ }
  function fail(id, name, reason) { /* ... */ }
  function skip(id, name, reason) { /* ... */ }

  /* ─────────────────────────────────────────────────────────────
     3. TEST DATABASE SETUP
  ──────────────────────────────────────────────────────────────── */

  let Database = null;
  let test_db = null;
  let TEST_DB_PATH = null;

  function setup_database() {
    log('\n[SETUP] Test Database');

    try {
      Database = require('better-sqlite3');
    } catch (error) {
      skip('DB-001', 'database_available', `better-sqlite3 not installed: ${error.message}`);
      return false;
    }

    try {
      TEST_DB_PATH = path.join(os.tmpdir(), `integration-test-${Date.now()}.sqlite`);
      test_db = new Database(TEST_DB_PATH);

      // Apply schema
      test_db.exec(`
        CREATE TABLE IF NOT EXISTS memory_index (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          file_path TEXT NOT NULL,
          spec_folder TEXT,
          title TEXT,
          summary TEXT,
          stability REAL DEFAULT 1.0,
          difficulty REAL DEFAULT 5.0,
          last_review TEXT,
          review_count INTEGER DEFAULT 0,
          embedding_status TEXT DEFAULT 'pending',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          spec_folder TEXT,
          turn_count INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS session_memories (
          session_id TEXT,
          memory_id INTEGER,
          attention_score REAL DEFAULT 1.0,
          PRIMARY KEY (session_id, memory_id)
        );
      `);

      pass('DB-001', 'database_initialized', `Path: ${TEST_DB_PATH}`);
      return true;
    } catch (error) {
      fail('DB-001', 'database_initialized', error.message);
      return false;
    }
  }

  function teardown_database() {
    log('\n[TEARDOWN] Cleanup');

    if (test_db) {
      try {
        test_db.close();
        pass('DB-999', 'database_closed', 'Connection closed');
      } catch (e) {
        log(`   [WARN] Could not close database: ${e.message}`);
      }
    }

    if (TEST_DB_PATH && fs.existsSync(TEST_DB_PATH)) {
      try {
        fs.unlinkSync(TEST_DB_PATH);
        pass('DB-999', 'database_deleted', `Removed: ${TEST_DB_PATH}`);
      } catch (e) {
        log(`   [WARN] Could not delete database: ${e.message}`);
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
     4. MODULE LOADING
  ──────────────────────────────────────────────────────────────── */

  let moduleA = null;
  let moduleB = null;

  function load_modules() {
    log('\n[SETUP] Loading Modules');

    try {
      moduleA = require(path.join(LIB_PATH, 'module-a.js'));
      pass('MOD-001', 'module_a_loads', 'require() succeeded');
    } catch (error) {
      skip('MOD-001', 'module_a_loads', error.message);
    }

    try {
      moduleB = require(path.join(LIB_PATH, 'module-b.js'));
      pass('MOD-002', 'module_b_loads', 'require() succeeded');
    } catch (error) {
      skip('MOD-002', 'module_b_loads', error.message);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     5. INTEGRATION TEST SUITES
  ──────────────────────────────────────────────────────────────── */

  // 5.1 WORKFLOW: Memory Save -> Search -> Retrieve
  function test_memory_workflow() {
    log('\n[SUITE] Memory Save/Search/Retrieve Workflow (T100-T120)');

    if (!test_db || !moduleA || !moduleB) {
      skip('T100-T120', 'memory_workflow', 'Required modules not available');
      return;
    }

    // T100: Save a memory
    try {
      const stmt = test_db.prepare(`
        INSERT INTO memory_index (file_path, spec_folder, title, summary)
        VALUES (?, ?, ?, ?)
      `);
      const result = stmt.run('/test/workflow.md', 'test-spec', 'Workflow Test', 'Integration test memory');

      if (result.lastInsertRowid > 0) {
        pass('T100', 'should_save_memory', `ID: ${result.lastInsertRowid}`);
      } else {
        fail('T100', 'should_save_memory', 'No row ID returned');
      }
    } catch (error) {
      fail('T100', 'should_save_memory', error.message);
    }

    // T101: Query the saved memory
    try {
      const memory = test_db.prepare('SELECT * FROM memory_index WHERE spec_folder = ?').get('test-spec');

      if (memory && memory.title === 'Workflow Test') {
        pass('T101', 'should_retrieve_saved_memory', `Title: ${memory.title}`);
      } else {
        fail('T101', 'should_retrieve_saved_memory', `Got: ${JSON.stringify(memory)}`);
      }
    } catch (error) {
      fail('T101', 'should_retrieve_saved_memory', error.message);
    }

    // Continue with more workflow steps...
  }

  // 5.2 WORKFLOW: Session -> Decay -> Update
  function test_session_decay_workflow() {
    log('\n[SUITE] Session Decay Workflow (T121-T140)');
    // ...
  }

  /* ─────────────────────────────────────────────────────────────
     6. TEST RUNNER
  ──────────────────────────────────────────────────────────────── */

  async function runTests() {
    log('================================================');
    log('  [Feature] Integration Tests');
    log('================================================');
    log(`Date: ${new Date().toISOString()}\n`);

    // Setup
    const dbReady = setup_database();
    load_modules();

    // Run integration test suites
    if (dbReady) {
      test_memory_workflow();
      test_session_decay_workflow();
    } else {
      log('\n[WARN] Skipping database-dependent tests');
    }

    // Teardown
    teardown_database();

    // Summary
    log('\n================================================');
    log('  TEST SUMMARY');
    log('================================================');
    log(`  [PASS]:  ${results.passed}`);
    log(`  [FAIL]:  ${results.failed}`);
    log(`  [SKIP]:  ${results.skipped}`);
    log(`  Total:   ${results.passed + results.failed + results.skipped}`);

    if (results.failed === 0 && results.passed > 0) {
      log('\n  ALL EXECUTED TESTS PASSED!');
    } else if (results.passed === 0) {
      log('\n  NOTE: All tests skipped');
    } else {
      log('\n  Some tests failed. Review output above.');
    }

    return results;
  }

  if (require.main === module) {
    runTests().then(r => process.exit(r.failed > 0 ? 1 : 0));
  }

  module.exports = { runTests };
})();
```

### 5.3 E2E Test Template

```javascript
#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// E2E TEST: [Scenario Name]
// End-to-end test simulating real MCP tool usage
// Test IDs: T[XXX]-T[YYY]
// ───────────────────────────────────────────────────────────────

(() => {
  'use strict';

  const path = require('path');
  const fs = require('fs');
  const os = require('os');

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ──────────────────────────────────────────────────────────────── */

  const SERVER_PATH = path.join(__dirname, '..', 'context-server.js');

  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: [],
  };

  /* ─────────────────────────────────────────────────────────────
     2. TEST UTILITIES
  ──────────────────────────────────────────────────────────────── */

  function log(msg) { console.log(msg); }
  function pass(id, name, evidence) { /* ... */ }
  function fail(id, name, reason) { /* ... */ }
  function skip(id, name, reason) { /* ... */ }

  /* ─────────────────────────────────────────────────────────────
     3. E2E ENVIRONMENT SETUP
  ──────────────────────────────────────────────────────────────── */

  let testEnv = null;

  function setup_e2e_environment() {
    log('\n[SETUP] E2E Test Environment');

    try {
      // Create isolated test directory structure
      const testRoot = path.join(os.tmpdir(), `speckit-e2e-${Date.now()}`);
      fs.mkdirSync(testRoot, { recursive: true });

      // Create spec folder structure
      const specFolder = path.join(testRoot, 'specs', 'test-spec');
      fs.mkdirSync(path.join(specFolder, 'memory'), { recursive: true });
      fs.mkdirSync(path.join(specFolder, 'scratch'), { recursive: true });

      // Create test memory file
      const memoryContent = `# Test Memory

## ANCHOR: summary
This is a test memory for E2E testing.

## ANCHOR: context
Created for automated testing.

## Content
Full content of the test memory.
`;
      fs.writeFileSync(
        path.join(specFolder, 'memory', 'test-memory.md'),
        memoryContent
      );

      // Create database directory
      const dbDir = path.join(testRoot, 'database');
      fs.mkdirSync(dbDir, { recursive: true });

      testEnv = {
        root: testRoot,
        specFolder,
        dbPath: path.join(dbDir, 'test-index.sqlite'),
        cleanup: () => {
          if (fs.existsSync(testRoot)) {
            fs.rmSync(testRoot, { recursive: true, force: true });
          }
        }
      };

      pass('E2E-001', 'environment_created', `Root: ${testRoot}`);
      return true;
    } catch (error) {
      fail('E2E-001', 'environment_created', error.message);
      return false;
    }
  }

  /* ─────────────────────────────────────────────────────────────
     4. MCP TOOL SIMULATION
  ──────────────────────────────────────────────────────────────── */

  /**
   * Simulate an MCP tool call
   * @param {string} toolName - Name of the tool
   * @param {Object} params - Tool parameters
   * @returns {Object} Tool response
   */
  async function callMcpTool(toolName, params) {
    // In a real E2E test, this would call the actual MCP server
    // For now, we simulate by directly calling handler functions

    const handlers = {
      memory_search: async (p) => {
        // Simulate memory_search handler
        return {
          success: true,
          results: [
            { id: 1, title: 'Test Memory', score: 0.95 }
          ],
          query: p.query
        };
      },
      memory_save: async (p) => {
        // Simulate memory_save handler
        return {
          success: true,
          memoryId: Date.now(),
          path: p.path
        };
      },
      validate_spec_folder: async (p) => {
        // Simulate validation
        return {
          valid: true,
          errors: [],
          warnings: []
        };
      }
    };

    const handler = handlers[toolName];
    if (!handler) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    return handler(params);
  }

  /* ─────────────────────────────────────────────────────────────
     5. E2E TEST SCENARIOS
  ──────────────────────────────────────────────────────────────── */

  // 5.1 SCENARIO: Complete Memory Lifecycle
  async function test_memory_lifecycle() {
    log('\n[SCENARIO] Complete Memory Lifecycle (T500-T520)');

    if (!testEnv) {
      skip('T500-T520', 'memory_lifecycle', 'Test environment not available');
      return;
    }

    // T500: Save new memory
    try {
      const saveResult = await callMcpTool('memory_save', {
        specFolder: 'test-spec',
        content: 'E2E test memory content',
        summary: 'Test summary'
      });

      if (saveResult.success) {
        pass('T500', 'should_save_new_memory', `ID: ${saveResult.memoryId}`);
      } else {
        fail('T500', 'should_save_new_memory', 'Save failed');
      }
    } catch (error) {
      fail('T500', 'should_save_new_memory', error.message);
    }

    // T501: Search for saved memory
    try {
      const searchResult = await callMcpTool('memory_search', {
        query: 'E2E test',
        specFolder: 'test-spec'
      });

      if (searchResult.results.length > 0) {
        pass('T501', 'should_find_saved_memory', `Found: ${searchResult.results.length} results`);
      } else {
        fail('T501', 'should_find_saved_memory', 'No results found');
      }
    } catch (error) {
      fail('T501', 'should_find_saved_memory', error.message);
    }

    // T502: Validate spec folder
    try {
      const validateResult = await callMcpTool('validate_spec_folder', {
        specFolder: testEnv.specFolder
      });

      if (validateResult.valid) {
        pass('T502', 'should_validate_spec_folder', 'Validation passed');
      } else {
        fail('T502', 'should_validate_spec_folder', `Errors: ${JSON.stringify(validateResult.errors)}`);
      }
    } catch (error) {
      fail('T502', 'should_validate_spec_folder', error.message);
    }
  }

  // 5.2 SCENARIO: Search with Testing Effect
  async function test_search_with_testing_effect() {
    log('\n[SCENARIO] Search with Testing Effect (T521-T540)');
    // ...
  }

  /* ─────────────────────────────────────────────────────────────
     6. TEST RUNNER
  ──────────────────────────────────────────────────────────────── */

  async function runTests() {
    log('================================================');
    log('  [Scenario] E2E Tests');
    log('================================================');
    log(`Date: ${new Date().toISOString()}\n`);

    // Setup
    const envReady = setup_e2e_environment();

    // Run E2E scenarios
    if (envReady) {
      await test_memory_lifecycle();
      await test_search_with_testing_effect();
    }

    // Cleanup
    if (testEnv) {
      log('\n[TEARDOWN] Cleaning up');
      testEnv.cleanup();
      pass('E2E-999', 'environment_cleaned_up', 'Test directory removed');
    }

    // Summary
    log('\n================================================');
    log('  TEST SUMMARY');
    log('================================================');
    log(`  [PASS]:  ${results.passed}`);
    log(`  [FAIL]:  ${results.failed}`);
    log(`  [SKIP]:  ${results.skipped}`);
    log(`  Total:   ${results.passed + results.failed + results.skipped}`);

    if (results.failed === 0) {
      log('\n  ALL E2E TESTS PASSED!');
    }

    return results;
  }

  if (require.main === module) {
    runTests().then(r => process.exit(r.failed > 0 ? 1 : 0));
  }

  module.exports = { runTests };
})();
```

---

## 6. Coverage Reporting

### 6.1 Jest Coverage Configuration

If migrating to Jest, add this configuration to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "test:ci": "jest --coverage --ci --reporters=default --reporters=jest-junit"
  },
  "jest": {
    "testEnvironment": "node",
    "testMatch": [
      "**/tests/**/*.test.js",
      "**/tests/**/*.spec.js"
    ],
    "collectCoverageFrom": [
      "lib/**/*.js",
      "handlers/**/*.js",
      "!**/node_modules/**",
      "!**/tests/**"
    ],
    "coverageDirectory": "coverage",
    "coverageReporters": [
      "text",
      "text-summary",
      "lcov",
      "html"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 75,
        "lines": 80,
        "statements": 80
      },
      "./lib/cognitive/": {
        "branches": 85,
        "functions": 90,
        "lines": 90,
        "statements": 90
      }
    },
    "verbose": true,
    "testTimeout": 30000
  }
}
```

### 6.2 Coverage Thresholds Enforcement

For the current IIFE-based test system, implement manual coverage tracking:

```javascript
/**
 * Coverage tracker for IIFE tests
 */
function createCoverageTracker(moduleName) {
  const coverage = {
    functions: new Set(),
    branches: new Map(),
    lines: new Set(),
  };

  return {
    /**
     * Mark a function as covered
     * @param {string} fnName - Function name
     */
    trackFunction(fnName) {
      coverage.functions.add(fnName);
    },

    /**
     * Mark a branch as covered
     * @param {string} branchId - Branch identifier (e.g., "fn:line:branch")
     * @param {string} path - 'true' or 'false' branch
     */
    trackBranch(branchId, path) {
      if (!coverage.branches.has(branchId)) {
        coverage.branches.set(branchId, { true: false, false: false });
      }
      coverage.branches.get(branchId)[path] = true;
    },

    /**
     * Get coverage report
     * @param {Object} totals - Total counts { functions, branches, lines }
     * @returns {Object} Coverage percentages
     */
    getReport(totals) {
      const functionCoverage = (coverage.functions.size / totals.functions) * 100;

      let branchesHit = 0;
      let totalBranches = 0;
      for (const [, paths] of coverage.branches) {
        if (paths.true) branchesHit++;
        if (paths.false) branchesHit++;
        totalBranches += 2;
      }
      const branchCoverage = totalBranches > 0
        ? (branchesHit / totalBranches) * 100
        : 100;

      return {
        functions: {
          pct: functionCoverage.toFixed(2),
          covered: coverage.functions.size,
          total: totals.functions
        },
        branches: {
          pct: branchCoverage.toFixed(2),
          covered: branchesHit,
          total: totalBranches
        },
        passed: functionCoverage >= 75 && branchCoverage >= 70
      };
    }
  };
}
```

### 6.3 CI/CD Integration

Example GitHub Actions workflow (`.github/workflows/test.yml`):

```yaml
name: SpecKit Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: |
          cd .opencode/skill/system-spec-kit/mcp_server
          npm ci

      - name: Run unit tests
        run: |
          cd .opencode/skill/system-spec-kit/mcp_server
          node tests/tier-classifier.test.js
          node tests/attention-decay.test.js
          node tests/fsrs-scheduler.test.js

      - name: Run integration tests
        run: |
          cd .opencode/skill/system-spec-kit/mcp_server
          node tests/memory-search-integration.test.js
          node tests/memory-save-integration.test.js

      - name: Upload coverage (if Jest)
        if: matrix.node-version == '20.x'
        uses: codecov/codecov-action@v3
        with:
          files: .opencode/skill/system-spec-kit/mcp_server/coverage/lcov.info
          fail_ci_if_error: true

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - run: npm ci
      - run: npm run lint
```

### 6.4 Test Runner Script

Create a master test runner (`run-all-tests.js`):

```javascript
#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MASTER TEST RUNNER
// Runs all test suites and generates summary report
// ───────────────────────────────────────────────────────────────

const path = require('path');
const fs = require('fs');

const TESTS_DIR = __dirname;

// Test suites in execution order
const TEST_SUITES = [
  // Unit tests
  { name: 'Tier Classifier', file: 'tier-classifier.test.js', type: 'unit' },
  { name: 'Attention Decay', file: 'attention-decay.test.js', type: 'unit' },
  { name: 'FSRS Scheduler', file: 'fsrs-scheduler.test.js', type: 'unit' },
  { name: 'Working Memory', file: 'working-memory.test.js', type: 'unit' },
  { name: 'Co-Activation', file: 'co-activation.test.js', type: 'unit' },

  // Integration tests
  { name: 'Memory Search', file: 'memory-search-integration.test.js', type: 'integration' },
  { name: 'Memory Save', file: 'memory-save-integration.test.js', type: 'integration' },

  // E2E tests (optional, slower)
  // { name: 'Full Workflow', file: 'e2e-workflow.test.js', type: 'e2e' },
];

async function runAllTests() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  SPECKIT TEST SUITE');
  console.log('═══════════════════════════════════════════════════');
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`Node: ${process.version}`);
  console.log('');

  const summary = {
    total: { passed: 0, failed: 0, skipped: 0 },
    suites: [],
  };

  for (const suite of TEST_SUITES) {
    const testPath = path.join(TESTS_DIR, suite.file);

    if (!fs.existsSync(testPath)) {
      console.log(`\n⏭️  Skipping ${suite.name} (file not found)`);
      summary.suites.push({ name: suite.name, status: 'SKIPPED', reason: 'File not found' });
      continue;
    }

    console.log(`\n───────────────────────────────────────────────────`);
    console.log(`  Running: ${suite.name} (${suite.type})`);
    console.log(`───────────────────────────────────────────────────`);

    try {
      const testModule = require(testPath);
      const results = await testModule.runTests();

      summary.total.passed += results.passed;
      summary.total.failed += results.failed;
      summary.total.skipped += results.skipped;

      summary.suites.push({
        name: suite.name,
        status: results.failed > 0 ? 'FAILED' : 'PASSED',
        passed: results.passed,
        failed: results.failed,
        skipped: results.skipped,
      });
    } catch (error) {
      console.log(`\n❌ Suite crashed: ${error.message}`);
      summary.suites.push({ name: suite.name, status: 'CRASHED', error: error.message });
    }
  }

  // Final summary
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  FINAL SUMMARY');
  console.log('═══════════════════════════════════════════════════');

  for (const suite of summary.suites) {
    const icon = suite.status === 'PASSED' ? '✅' :
                 suite.status === 'FAILED' ? '❌' :
                 suite.status === 'SKIPPED' ? '⏭️' : '💥';
    console.log(`  ${icon} ${suite.name}: ${suite.status}`);
    if (suite.passed !== undefined) {
      console.log(`     Passed: ${suite.passed}, Failed: ${suite.failed}, Skipped: ${suite.skipped}`);
    }
  }

  console.log('');
  console.log(`  TOTAL: ${summary.total.passed} passed, ${summary.total.failed} failed, ${summary.total.skipped} skipped`);
  console.log('═══════════════════════════════════════════════════');

  // Exit with appropriate code
  process.exit(summary.total.failed > 0 ? 1 : 0);
}

runAllTests();
```

---

## Appendix: Quick Reference

### Test ID Ranges by Module

| Module             | Test ID Range | Description                    |
| ------------------ | ------------- | ------------------------------ |
| Module Loading     | T000-T009     | Module require/export tests    |
| Tier Classifier    | T200-T280     | State classification, limits   |
| Attention Decay    | T300-T340     | FSRS decay, legacy exponential |
| Working Memory     | T400-T450     | Session memory management      |
| Co-Activation      | T450-T499     | Memory association patterns    |
| Memory Search      | T600-T650     | Testing effect, hybrid search  |
| Memory Save        | T700-T750     | Save, validation, indexing     |
| E2E Workflows      | T900-T999     | Full scenario tests            |

### Common Assertions Cheat Sheet

```javascript
// Equality
result === expected
Math.abs(actual - expected) < epsilon

// Type checking
typeof result === 'function'
Array.isArray(result)
result instanceof Error

// Range checking
value >= min && value <= max
value > 0 && value <= 1

// Object checking
result !== null && result !== undefined
Object.keys(result).length > 0

// Error checking
try { fn(); fail() } catch (e) { pass(e.message) }

// Array checking
result.length === expected.length
result.includes(item)
!result.includes(unwantedItem)
result.every(item => condition)
result.some(item => condition)
```

---

*Last updated: 2025-02-01*
*Version: 1.0.0*

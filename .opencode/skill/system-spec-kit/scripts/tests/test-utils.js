// ───────────────────────────────────────────────────────────────
// 1. TEST: UTILITIES
// ───────────────────────────────────────────────────────────────
(() => {
  'use strict';

  const path = require('path');
  const fs = require('fs');

  /* ─────────────────────────────────────────────────────────────
     1. CONFIGURATION
  ────────────────────────────────────────────────────────────────
*/

  const FIXTURES_DIR = path.join(__dirname, '..', 'test-fixtures');
  const MEMORY_DIR = path.join(__dirname, '..', 'memory');
  const DATABASE_DIR = path.join(__dirname, '..', '..', 'mcp_server', 'database');

  /* ─────────────────────────────────────────────────────────────
     2. TEST DATA CREATION
  ────────────────────────────────────────────────────────────────
*/

  /**
   * Create a test memory object with defaults
   * @param {Object} overrides - Properties to override defaults
   * @returns {Object} Memory object
   */
  function createTestMemory(overrides = {}) {
    const defaults = {
      id: Date.now(),
      content: 'Test memory content',
      summary: 'Test summary',
      importance: 3,
      stability: 1.0,
      difficulty: 5.0,
      retrievability: 1.0,
      lastReview: new Date().toISOString(),
      nextReview: new Date(Date.now() + 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      spec_folder: 'test-spec',
      anchor: null,
      embedding: null
    };

    return { ...defaults, ...overrides };
  }

  /**
   * Create a mock database for testing
   * @returns {Object} Mock database interface
   */
  function mockDatabase() {
    const memories = new Map();
    let nextId = 1;

    return {
      memories,

      /**
       * Insert a memory
       * @param {Object} memory - Memory to insert
       * @returns {number} Inserted memory ID
       */
      insert(memory) {
        const id = memory.id || nextId++;
        memories.set(id, { ...memory, id });
        return id;
      },

      /**
       * Get a memory by ID
       * @param {number} id - Memory ID
       * @returns {Object|null} Memory or null
       */
      get(id) {
        return memories.get(id) || null;
      },

      /**
       * Update a memory
       * @param {number} id - Memory ID
       * @param {Object} updates - Properties to update
       * @returns {boolean} Whether update succeeded
       */
      update(id, updates) {
        const memory = memories.get(id);
        if (!memory) return false;
        memories.set(id, { ...memory, ...updates, updated_at: new Date().toISOString() });
        return true;
      },

      /**
       * Delete a memory
       * @param {number} id - Memory ID
       * @returns {boolean} Whether delete succeeded
       */
      delete(id) {
        return memories.delete(id);
      },

      /**
       * Query memories
       * @param {Function} predicate - Filter function
       * @returns {Array} Matching memories
       */
      query(predicate) {
        return Array.from(memories.values()).filter(predicate);
      },

      /**
       * Get all memories
       * @returns {Array} All memories
       */
      all() {
        return Array.from(memories.values());
      },

      /**
       * Clear all memories
       */
      clear() {
        memories.clear();
        nextId = 1;
      },

      /**
       * Get count of memories
       * @returns {number} Memory count
       */
      count() {
        return memories.size;
      }
    };
  }

  /**
   * Mock embedding function for testing
   * Generates deterministic pseudo-embeddings based on content hash
   * @param {string} text - Text to embed
   * @returns {Array} 384-dimensional embedding vector
   */
  function mockEmbedding(text) {
    const DIMENSIONS = 384;
    const embedding = new Array(DIMENSIONS);

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash = hash & hash;
    }

    for (let i = 0; i < DIMENSIONS; i++) {
      const seed = (hash * (i + 1)) % 1000000;
      embedding[i] = (Math.sin(seed) + 1) / 2;
    }

    const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
    return embedding.map(v => v / magnitude);
  }

  /* ─────────────────────────────────────────────────────────────
     3. ASSERTIONS
  ────────────────────────────────────────────────────────────────
*/

  /**
   * Assert a condition is true
   * @param {boolean} condition - Condition to check
   * @param {string} message - Error message if condition is false
   * @throws {Error} If condition is false
   */
  function assert(condition, message = 'Assertion failed') {
    if (!condition) {
      throw new Error(message);
    }
  }

  /**
   * Assert two numbers are approximately equal
   * @param {number} actual - Actual value
   * @param {number} expected - Expected value
   * @param {number} epsilon - Tolerance (default 0.001)
   * @throws {Error} If values differ by more than epsilon
   */
  function assertApproxEqual(actual, expected, epsilon = 0.001) {
    const diff = Math.abs(actual - expected);
    if (diff > epsilon) {
      throw new Error(
        `Values not approximately equal: ` +
        `actual=${actual}, expected=${expected}, diff=${diff}, epsilon=${epsilon}`
      );
    }
  }

  /**
   * Assert a value is within a range
   * @param {number} value - Value to check
   * @param {number} min - Minimum expected value
   * @param {number} max - Maximum expected value
   * @throws {Error} If value is outside range
   */
  function assertInRange(value, min, max) {
    if (value < min || value > max) {
      throw new Error(
        `Value ${value} is outside expected range [${min}, ${max}]`
      );
    }
  }

  /**
   * Assert two arrays are equal
   * @param {Array} actual - Actual array
   * @param {Array} expected - Expected array
   * @throws {Error} If arrays differ
   */
  function assertArrayEqual(actual, expected) {
    if (actual.length !== expected.length) {
      throw new Error(
        `Array lengths differ: actual=${actual.length}, expected=${expected.length}`
      );
    }

    for (let i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) {
        throw new Error(
          `Arrays differ at index ${i}: actual=${actual[i]}, expected=${expected[i]}`
        );
      }
    }
  }

  /**
   * Assert a function throws an error
   * @param {Function} fn - Function to call
   * @param {string|RegExp} expected_message - Expected error message pattern
   * @throws {Error} If function doesn't throw or message doesn't match
   */
  function assertThrows(fn, expectedMessage = null) {
    let threw = false;
    let error = null;

    try {
      fn();
    } catch (e) {
      threw = true;
      error = e;
    }

    if (!threw) {
      throw new Error('Expected function to throw, but it did not');
    }

    if (expectedMessage) {
      const matches = expectedMessage instanceof RegExp
        ? expectedMessage.test(error.message)
        : error.message.includes(expectedMessage);

      if (!matches) {
        throw new Error(
          `Error message "${error.message}" does not match expected "${expectedMessage}"`
        );
      }
    }
  }

  /* ─────────────────────────────────────────────────────────────
     4. TEST INFRASTRUCTURE
  ────────────────────────────────────────────────────────────────
*/

  /**
   * Create a test runner for a module
   * @param {string} module_name - Name of the module being tested
   * @returns {Object} Test runner interface
   */
  function createTestRunner(moduleName) {
    const tests = [];
    let passed = 0;
    let failed = 0;

    return {
      /**
       * Register a test
       * @param {string} name - Test name
       * @param {Function} fn - Test function
       */
      test(name, fn) {
        tests.push({ name, fn });
      },

      /**
       * Run all registered tests
       */
      async run() {
        console.log(`\n=== Testing: ${moduleName} ===\n`);

        for (const { name, fn } of tests) {
          try {
            await fn();
            passed++;
            console.log(`  ✓ ${name}`);
          } catch (error) {
            failed++;
            console.log(`  ✗ ${name}`);
            console.log(`    Error: ${error.message}`);
          }
        }

        console.log(`\n${moduleName}: ${passed} passed, ${failed} failed\n`);

        return { passed, failed, total: tests.length };
      }
    };
  }

  /**
   * Load a fixture file
   * @param {string} filename - Fixture filename
   * @returns {Object} Parsed fixture data
   */
  function loadFixture(filename) {
    const filepath = path.join(FIXTURES_DIR, filename);
    const content = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(content);
  }

  /**
   * Create a temporary test directory
   * @param {string} prefix - Directory name prefix
   * @returns {string} Path to temporary directory
   */
  function createTempDir(prefix = 'test') {
    const tmpDir = path.join(FIXTURES_DIR, `${prefix}-${Date.now()}`);
    fs.mkdirSync(tmpDir, { recursive: true });
    return tmpDir;
  }

  /**
   * Clean up a temporary directory
   * @param {string} dir_path - Directory to remove
   */
  function cleanupTempDir(dirPath) {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  }

  /* ─────────────────────────────────────────────────────────────
     5. UTILITIES
  ────────────────────────────────────────────────────────────────
*/

  /**
   * Wait for a specified duration
   * @param {number} ms - Milliseconds to wait
   * @returns {Promise} Resolves after duration
   */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate a random string
   * @param {number} length - String length
   * @returns {string} Random string
   */
  function randomString(length = 8) {
    const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return result;
  }

  /**
   * Calculate cosine similarity between two vectors
   * @param {Array} a - First vector
   * @param {Array} b - Second vector
   * @returns {number} Cosine similarity [-1, 1]
   */
  function cosineSimilarity(a, b) {
    if (a.length !== b.length) {
      throw new Error('Vectors must have same length');
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) return 0;

    return dotProduct / (magnitudeA * magnitudeB);
  }

  /* ─────────────────────────────────────────────────────────────
     6. EXPORTS
  ────────────────────────────────────────────────────────────────
*/

  module.exports = {
    FIXTURES_DIR,
    MEMORY_DIR,
    DATABASE_DIR,

    createTestMemory,
    mockDatabase,
    mockEmbedding,

    assert,
    assertApproxEqual,
    assertInRange,
    assertArrayEqual,
    assertThrows,

    createTestRunner,
    loadFixture,
    createTempDir,
    cleanupTempDir,

    sleep,
    randomString,
    cosineSimilarity
  };
})();

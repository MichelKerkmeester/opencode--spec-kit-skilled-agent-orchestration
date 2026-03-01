// ───────────────────────────────────────────────────────────────
// TEST UTILITIES - Spec 072 Test Infrastructure
// Provides Jest-like testing primitives for Node.js test files
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

// Global test state
const testState = {
  currentSuite: null,
  suites: [],
  results: {
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: [],
  },
  beforeAllFns: [],
  afterAllFns: [],
  beforeEachFns: [],
  afterEachFns: [],
  startTime: null,
  verbose: process.env.TEST_VERBOSE === 'true',
};

/* ─────────────────────────────────────────────────────────────
   2. LOGGING UTILITIES
──────────────────────────────────────────────────────────────── */

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
};

function log(msg, color = '') {
  if (color) {
    console.log(`${color}${msg}${colors.reset}`);
  } else {
    console.log(msg);
  }
}

function logPass(testName, evidence) {
  log(`   ✅ ${testName}`, colors.green);
  if (evidence && testState.verbose) {
    log(`      Evidence: ${evidence}`, colors.gray);
  }
}

function logFail(testName, reason) {
  log(`   ❌ ${testName}`, colors.red);
  log(`      Reason: ${reason}`, colors.gray);
}

function logSkip(testName, reason) {
  log(`   ⏭️  ${testName} (skipped: ${reason})`, colors.yellow);
}

/* ─────────────────────────────────────────────────────────────
   3. ASSERTION HELPERS
──────────────────────────────────────────────────────────────── */

class AssertionError extends Error {
  constructor(message, expected, actual) {
    super(message);
    this.name = 'AssertionError';
    this.expected = expected;
    this.actual = actual;
  }
}

/**
 * Creates an expectation object for assertions
 * @param {*} value - The value to test
 * @returns {Object} Assertion chain
 */
function expect(value) {
  return {
    /**
     * Strict equality check (===)
     * @param {*} expected - Expected value
     */
    toBe(expected) {
      if (value !== expected) {
        throw new AssertionError(
          `Expected ${JSON.stringify(value)} to be ${JSON.stringify(expected)}`,
          expected,
          value
        );
      }
    },

    /**
     * Deep equality check
     * @param {*} expected - Expected value
     */
    toEqual(expected) {
      const isEqual = deepEqual(value, expected);
      if (!isEqual) {
        throw new AssertionError(
          `Expected ${JSON.stringify(value)} to equal ${JSON.stringify(expected)}`,
          expected,
          value
        );
      }
    },

    /**
     * Truthy check
     */
    toBeTruthy() {
      if (!value) {
        throw new AssertionError(
          `Expected ${JSON.stringify(value)} to be truthy`,
          'truthy',
          value
        );
      }
    },

    /**
     * Falsy check
     */
    toBeFalsy() {
      if (value) {
        throw new AssertionError(
          `Expected ${JSON.stringify(value)} to be falsy`,
          'falsy',
          value
        );
      }
    },

    /**
     * Null check
     */
    toBeNull() {
      if (value !== null) {
        throw new AssertionError(
          `Expected ${JSON.stringify(value)} to be null`,
          null,
          value
        );
      }
    },

    /**
     * Undefined check
     */
    toBeUndefined() {
      if (value !== undefined) {
        throw new AssertionError(
          `Expected ${JSON.stringify(value)} to be undefined`,
          undefined,
          value
        );
      }
    },

    /**
     * Defined check
     */
    toBeDefined() {
      if (value === undefined) {
        throw new AssertionError(
          `Expected value to be defined`,
          'defined',
          value
        );
      }
    },

    /**
     * Contains check for arrays and strings
     * @param {*} item - Item to find
     */
    toContain(item) {
      if (Array.isArray(value)) {
        if (!value.includes(item)) {
          throw new AssertionError(
            `Expected array to contain ${JSON.stringify(item)}`,
            item,
            value
          );
        }
      } else if (typeof value === 'string') {
        if (!value.includes(item)) {
          throw new AssertionError(
            `Expected string "${value}" to contain "${item}"`,
            item,
            value
          );
        }
      } else {
        throw new AssertionError(
          `toContain() expects an array or string, got ${typeof value}`,
          'array or string',
          typeof value
        );
      }
    },

    /**
     * Greater than check
     * @param {number} expected - Value to compare against
     */
    toBeGreaterThan(expected) {
      if (!(value > expected)) {
        throw new AssertionError(
          `Expected ${value} to be greater than ${expected}`,
          `> ${expected}`,
          value
        );
      }
    },

    /**
     * Greater than or equal check
     * @param {number} expected - Value to compare against
     */
    toBeGreaterThanOrEqual(expected) {
      if (!(value >= expected)) {
        throw new AssertionError(
          `Expected ${value} to be greater than or equal to ${expected}`,
          `>= ${expected}`,
          value
        );
      }
    },

    /**
     * Less than check
     * @param {number} expected - Value to compare against
     */
    toBeLessThan(expected) {
      if (!(value < expected)) {
        throw new AssertionError(
          `Expected ${value} to be less than ${expected}`,
          `< ${expected}`,
          value
        );
      }
    },

    /**
     * Less than or equal check
     * @param {number} expected - Value to compare against
     */
    toBeLessThanOrEqual(expected) {
      if (!(value <= expected)) {
        throw new AssertionError(
          `Expected ${value} to be less than or equal to ${expected}`,
          `<= ${expected}`,
          value
        );
      }
    },

    /**
     * Check array/string length
     * @param {number} expected - Expected length
     */
    toHaveLength(expected) {
      if (value.length !== expected) {
        throw new AssertionError(
          `Expected length ${expected}, got ${value.length}`,
          expected,
          value.length
        );
      }
    },

    /**
     * Check object has property
     * @param {string} property - Property name
     */
    toHaveProperty(property) {
      if (!(property in value)) {
        throw new AssertionError(
          `Expected object to have property "${property}"`,
          property,
          Object.keys(value)
        );
      }
    },

    /**
     * Check function throws
     * @param {Error|string} [expected] - Expected error or message
     */
    toThrow(expected) {
      if (typeof value !== 'function') {
        throw new AssertionError(
          `toThrow() expects a function`,
          'function',
          typeof value
        );
      }
      let didThrow = false;
      let thrownError;
      try {
        value();
      } catch (e) {
        didThrow = true;
        thrownError = e;
      }
      if (!didThrow) {
        throw new AssertionError(
          `Expected function to throw`,
          'to throw',
          'did not throw'
        );
      }
      if (expected !== undefined) {
        if (typeof expected === 'string' && !thrownError.message.includes(expected)) {
          throw new AssertionError(
            `Expected error message to include "${expected}"`,
            expected,
            thrownError.message
          );
        }
        if (expected instanceof Error && !(thrownError instanceof expected.constructor)) {
          throw new AssertionError(
            `Expected error type ${expected.constructor.name}`,
            expected.constructor.name,
            thrownError.constructor.name
          );
        }
      }
    },

    /**
     * Check instanceof
     * @param {Function} constructor - Constructor to check against
     */
    toBeInstanceOf(constructor) {
      if (!(value instanceof constructor)) {
        throw new AssertionError(
          `Expected instance of ${constructor.name}`,
          constructor.name,
          value?.constructor?.name || typeof value
        );
      }
    },

    /**
     * Check type
     * @param {string} expectedType - Expected typeof result
     */
    toBeType(expectedType) {
      if (typeof value !== expectedType) {
        throw new AssertionError(
          `Expected type "${expectedType}", got "${typeof value}"`,
          expectedType,
          typeof value
        );
      }
    },

    /**
     * Negated assertions
     */
    not: {
      toBe(expected) {
        if (value === expected) {
          throw new AssertionError(
            `Expected ${JSON.stringify(value)} NOT to be ${JSON.stringify(expected)}`,
            `not ${expected}`,
            value
          );
        }
      },
      toEqual(expected) {
        if (deepEqual(value, expected)) {
          throw new AssertionError(
            `Expected ${JSON.stringify(value)} NOT to equal ${JSON.stringify(expected)}`,
            `not ${JSON.stringify(expected)}`,
            value
          );
        }
      },
      toBeTruthy() {
        if (value) {
          throw new AssertionError(
            `Expected ${JSON.stringify(value)} NOT to be truthy`,
            'falsy',
            value
          );
        }
      },
      toContain(item) {
        if (Array.isArray(value) && value.includes(item)) {
          throw new AssertionError(
            `Expected array NOT to contain ${JSON.stringify(item)}`,
            `not containing ${item}`,
            value
          );
        } else if (typeof value === 'string' && value.includes(item)) {
          throw new AssertionError(
            `Expected string NOT to contain "${item}"`,
            `not containing ${item}`,
            value
          );
        }
      },
      toBeNull() {
        if (value === null) {
          throw new AssertionError(
            `Expected value NOT to be null`,
            'not null',
            value
          );
        }
      },
      toBeUndefined() {
        if (value === undefined) {
          throw new AssertionError(
            `Expected value NOT to be undefined`,
            'not undefined',
            value
          );
        }
      },
    },
  };
}

/**
 * Deep equality comparison
 * @param {*} a - First value
 * @param {*} b - Second value
 * @returns {boolean} Whether values are deeply equal
 */
function deepEqual(a, b) {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => deepEqual(val, b[idx]));
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => deepEqual(a[key], b[key]));
}

/* ─────────────────────────────────────────────────────────────
   4. TEST SUITE FUNCTIONS
──────────────────────────────────────────────────────────────── */

/**
 * Define a test suite
 * @param {string} name - Suite name
 * @param {Function} fn - Suite function containing tests
 */
function describe(name, fn) {
  const suite = {
    name,
    tests: [],
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: [],
  };

  const previousSuite = testState.currentSuite;
  testState.currentSuite = suite;
  testState.suites.push(suite);

  // Execute the suite function to register tests
  fn();

  testState.currentSuite = previousSuite;
}

/**
 * Define an individual test
 * @param {string} name - Test name
 * @param {Function} fn - Test function
 */
function it(name, fn) {
  if (!testState.currentSuite) {
    // Create an implicit suite if none exists
    testState.currentSuite = {
      name: 'Default Suite',
      tests: [],
      beforeAll: [],
      afterAll: [],
      beforeEach: [],
      afterEach: [],
    };
    testState.suites.push(testState.currentSuite);
  }

  testState.currentSuite.tests.push({ name, fn, skip: false });
}

// Alias for it
const test = it;

/**
 * Skip a test
 * @param {string} name - Test name
 * @param {Function} fn - Test function (not executed)
 */
it.skip = function(name, fn) {
  if (testState.currentSuite) {
    testState.currentSuite.tests.push({ name, fn, skip: true });
  }
};
test.skip = it.skip;

/**
 * Only run this test
 * @param {string} name - Test name
 * @param {Function} fn - Test function
 */
it.only = function(name, fn) {
  if (testState.currentSuite) {
    testState.currentSuite.tests.push({ name, fn, only: true });
  }
};
test.only = it.only;

/* ─────────────────────────────────────────────────────────────
   5. SETUP/TEARDOWN HOOKS
──────────────────────────────────────────────────────────────── */

/**
 * Run before all tests in suite
 * @param {Function} fn - Setup function
 */
function beforeAll(fn) {
  if (testState.currentSuite) {
    testState.currentSuite.beforeAll.push(fn);
  } else {
    testState.beforeAllFns.push(fn);
  }
}

/**
 * Run after all tests in suite
 * @param {Function} fn - Teardown function
 */
function afterAll(fn) {
  if (testState.currentSuite) {
    testState.currentSuite.afterAll.push(fn);
  } else {
    testState.afterAllFns.push(fn);
  }
}

/**
 * Run before each test in suite
 * @param {Function} fn - Setup function
 */
function beforeEach(fn) {
  if (testState.currentSuite) {
    testState.currentSuite.beforeEach.push(fn);
  } else {
    testState.beforeEachFns.push(fn);
  }
}

/**
 * Run after each test in suite
 * @param {Function} fn - Teardown function
 */
function afterEach(fn) {
  if (testState.currentSuite) {
    testState.currentSuite.afterEach.push(fn);
  } else {
    testState.afterEachFns.push(fn);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. TIMING UTILITIES
──────────────────────────────────────────────────────────────── */

/**
 * Measure execution time of a function
 * @param {Function} fn - Function to measure
 * @returns {Promise<{result: *, duration: number}>} Result and duration in ms
 */
async function measureTime(fn) {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return { result, duration };
}

/**
 * Assert function completes within time limit
 * @param {Function} fn - Function to test
 * @param {number} maxMs - Maximum allowed milliseconds
 * @param {string} [label] - Optional label for error message
 */
async function expectWithinTime(fn, maxMs, label = 'Operation') {
  const { result, duration } = await measureTime(fn);
  if (duration > maxMs) {
    throw new AssertionError(
      `${label} took ${duration.toFixed(2)}ms, expected < ${maxMs}ms`,
      `< ${maxMs}ms`,
      `${duration.toFixed(2)}ms`
    );
  }
  return result;
}

/**
 * Create a simple timer
 * @returns {Object} Timer with elapsed() method
 */
function createTimer() {
  const start = performance.now();
  return {
    elapsed() {
      return performance.now() - start;
    },
    elapsedFormatted() {
      const ms = performance.now() - start;
      if (ms < 1000) return `${ms.toFixed(2)}ms`;
      return `${(ms / 1000).toFixed(2)}s`;
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   7. TEST RUNNER
──────────────────────────────────────────────────────────────── */

/**
 * Run all registered test suites
 * @returns {Promise<Object>} Test results
 */
async function runTests() {
  testState.startTime = Date.now();
  testState.results = {
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: [],
  };

  // Run global beforeAll
  for (const fn of testState.beforeAllFns) {
    await fn();
  }

  // Check for .only tests
  const hasOnly = testState.suites.some(suite =>
    suite.tests.some(t => t.only)
  );

  for (const suite of testState.suites) {
    log(`\n🔬 ${suite.name}`, colors.cyan);

    // Run suite beforeAll
    for (const fn of suite.beforeAll) {
      await fn();
    }

    for (const test of suite.tests) {
      // Skip if .only exists and this isn't it
      if (hasOnly && !test.only) {
        testState.results.skipped++;
        testState.results.tests.push({
          suite: suite.name,
          name: test.name,
          status: 'SKIP',
          reason: 'only mode active',
        });
        logSkip(test.name, 'only mode active');
        continue;
      }

      if (test.skip) {
        testState.results.skipped++;
        testState.results.tests.push({
          suite: suite.name,
          name: test.name,
          status: 'SKIP',
          reason: 'marked as skip',
        });
        logSkip(test.name, 'marked as skip');
        continue;
      }

      // Run beforeEach hooks
      for (const fn of suite.beforeEach) {
        await fn();
      }
      for (const fn of testState.beforeEachFns) {
        await fn();
      }

      try {
        const timer = createTimer();
        await test.fn();
        const duration = timer.elapsedFormatted();

        testState.results.passed++;
        testState.results.tests.push({
          suite: suite.name,
          name: test.name,
          status: 'PASS',
          duration,
        });
        logPass(test.name, duration);
      } catch (error) {
        testState.results.failed++;
        testState.results.tests.push({
          suite: suite.name,
          name: test.name,
          status: 'FAIL',
          error: error.message,
        });
        logFail(test.name, error.message);
      }

      // Run afterEach hooks
      for (const fn of suite.afterEach) {
        await fn();
      }
      for (const fn of testState.afterEachFns) {
        await fn();
      }
    }

    // Run suite afterAll
    for (const fn of suite.afterAll) {
      await fn();
    }
  }

  // Run global afterAll
  for (const fn of testState.afterAllFns) {
    await fn();
  }

  return testState.results;
}

/**
 * Print test summary
 * @param {Object} results - Test results
 */
function printSummary(results) {
  const duration = ((Date.now() - testState.startTime) / 1000).toFixed(2);
  const total = results.passed + results.failed + results.skipped;

  log('\n════════════════════════════════════════');
  log('📊 TEST SUMMARY', colors.bold);
  log('════════════════════════════════════════');
  log(`✅ Passed:  ${results.passed}`, colors.green);
  log(`❌ Failed:  ${results.failed}`, results.failed > 0 ? colors.red : '');
  log(`⏭️  Skipped: ${results.skipped}`, results.skipped > 0 ? colors.yellow : '');
  log(`📝 Total:   ${total}`);
  log(`⏱️  Time:    ${duration}s`);
  log('');

  if (results.failed === 0) {
    log('🎉 ALL TESTS PASSED!', colors.green);
  } else {
    log('⚠️  Some tests failed. Review output above.', colors.red);

    // List failed tests
    const failed = results.tests.filter(t => t.status === 'FAIL');
    if (failed.length > 0) {
      log('\nFailed tests:', colors.red);
      failed.forEach(t => {
        log(`  - ${t.suite} > ${t.name}`, colors.red);
        log(`    ${t.error}`, colors.gray);
      });
    }
  }
}

/**
 * Reset test state (useful between test file runs)
 */
function resetState() {
  testState.currentSuite = null;
  testState.suites = [];
  testState.results = {
    passed: 0,
    failed: 0,
    skipped: 0,
    tests: [],
  };
  testState.beforeAllFns = [];
  testState.afterAllFns = [];
  testState.beforeEachFns = [];
  testState.afterEachFns = [];
  testState.startTime = null;
}

/* ─────────────────────────────────────────────────────────────
   8. LEGACY COMPATIBILITY (pass/fail/skip functions)
──────────────────────────────────────────────────────────────── */

/**
 * Manual pass (for procedural-style tests)
 * @param {string} testName - Test name
 * @param {string} [evidence] - Optional evidence
 */
function pass(testName, evidence) {
  testState.results.passed++;
  testState.results.tests.push({
    name: testName,
    status: 'PASS',
    evidence,
  });
  logPass(testName, evidence);
}

/**
 * Manual fail (for procedural-style tests)
 * @param {string} testName - Test name
 * @param {string} reason - Failure reason
 */
function fail(testName, reason) {
  testState.results.failed++;
  testState.results.tests.push({
    name: testName,
    status: 'FAIL',
    reason,
  });
  logFail(testName, reason);
}

/**
 * Manual skip (for procedural-style tests)
 * @param {string} testName - Test name
 * @param {string} reason - Skip reason
 */
function skip(testName, reason) {
  testState.results.skipped++;
  testState.results.tests.push({
    name: testName,
    status: 'SKIP',
    reason,
  });
  logSkip(testName, reason);
}

/* ─────────────────────────────────────────────────────────────
   9. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Core testing functions
  describe,
  it,
  test,
  expect,

  // Setup/teardown hooks
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,

  // Runner
  runTests,
  printSummary,
  resetState,

  // Timing utilities
  measureTime,
  expectWithinTime,
  createTimer,

  // Legacy compatibility
  pass,
  fail,
  skip,
  log,

  // Internal state (for advanced use)
  testState,
  colors,

  // Utilities
  deepEqual,
  AssertionError,
};

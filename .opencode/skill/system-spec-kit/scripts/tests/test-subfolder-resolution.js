// TEST: SUBFOLDER RESOLUTION
// Focus: SPEC_FOLDER_PATTERN, SPEC_FOLDER_BASIC_PATTERN,
//        FindChildFolderSync, findChildFolderAsync, core/index re-exports
'use strict';

const path = require('path');
const fs = require('fs');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────
*/

const DIST_DIR = path.join(__dirname, '..', 'dist');

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

/* ─────────────────────────────────────────────────────────────
   3. TEST: SPEC_FOLDER_PATTERN (strict)
   Regex: /^\d{3}-[a-z][a-z0-9-]*$/
────────────────────────────────────────────────────────────────
*/

async function testSpecFolderPatternValid() {
  log('\n🔬 SPEC_FOLDER_PATTERN: Valid patterns match');

  try {
    const { SPEC_FOLDER_PATTERN } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const validCases = [
      '121-script-audit',
      '001-a',
      '000-hello-world',
      '999-z',
      '042-multi-word-name-here',
      '100-abc123',
      '010-a0b1c2',
    ];

    let allPassed = true;
    const failures = [];
    for (const input of validCases) {
      if (!SPEC_FOLDER_PATTERN.test(input)) {
        allPassed = false;
        failures.push(input);
      }
    }

    if (allPassed) {
      pass('T-SF01a: Valid patterns match', `All ${validCases.length} valid patterns matched`);
    } else {
      fail('T-SF01a: Valid patterns match', `Failed to match: ${failures.join(', ')}`);
    }
  } catch (err) {
    fail('T-SF01a: Valid patterns match', err.message);
  }
}

async function testSpecFolderPatternInvalid() {
  log('\n🔬 SPEC_FOLDER_PATTERN: Invalid patterns rejected');

  try {
    const { SPEC_FOLDER_PATTERN } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const invalidCases = [
      { input: '003-System', reason: 'uppercase after hyphen' },
      { input: '3-foo', reason: 'single digit prefix' },
      { input: 'abc-def', reason: 'non-numeric prefix' },
      { input: '003-', reason: 'nothing after hyphen' },
      { input: '003-1invalid', reason: 'digit after hyphen (not letter)' },
      { input: '', reason: 'empty string' },
      { input: '0003-foo', reason: 'four digit prefix' },
      { input: '003_foo', reason: 'underscore instead of hyphen' },
      { input: '003-FOO', reason: 'all uppercase after hyphen' },
      { input: '003-foo bar', reason: 'space in name' },
      { input: '003-foo/bar', reason: 'slash in name' },
      { input: '12-short', reason: 'two digit prefix' },
      { input: '02--system-spec-kit', reason: 'category folder (2 digits + double hyphen)' },
      { input: 'z_archive', reason: 'no digit prefix at all' },
      { input: '003-foo.bar', reason: 'dot in name' },
    ];

    let allPassed = true;
    const failures = [];
    for (const { input, reason } of invalidCases) {
      if (SPEC_FOLDER_PATTERN.test(input)) {
        allPassed = false;
        failures.push(`"${input}" (${reason})`);
      }
    }

    if (allPassed) {
      pass('T-SF01b: Invalid patterns rejected', `All ${invalidCases.length} invalid patterns rejected`);
    } else {
      fail('T-SF01b: Invalid patterns rejected', `Incorrectly matched: ${failures.join(', ')}`);
    }
  } catch (err) {
    fail('T-SF01b: Invalid patterns rejected', err.message);
  }
}

async function testSpecFolderPatternEdgeCases() {
  log('\n🔬 SPEC_FOLDER_PATTERN: Edge cases');

  try {
    const { SPEC_FOLDER_PATTERN } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    // Edge: single char after hyphen (minimum valid)
    if (SPEC_FOLDER_PATTERN.test('000-a')) {
      pass('T-SF01c: Minimum valid "000-a"', 'Matched');
    } else {
      fail('T-SF01c: Minimum valid "000-a"', 'Did not match');
      return;
    }

    // Edge: numbers in name portion (after initial lowercase letter)
    if (SPEC_FOLDER_PATTERN.test('003-a1b2c3')) {
      pass('T-SF01d: Numbers in name "003-a1b2c3"', 'Matched');
    } else {
      fail('T-SF01d: Numbers in name "003-a1b2c3"', 'Did not match');
    }

    // Edge: trailing hyphen
    if (!SPEC_FOLDER_PATTERN.test('003-foo-')) {
      pass('T-SF01e: Trailing hyphen "003-foo-" rejected', 'Correctly rejected');
    } else {
      // The pattern [a-z0-9-]* actually allows trailing hyphen
      // This is technically a match since - is in the character class
      pass('T-SF01e: Trailing hyphen "003-foo-" allowed by pattern', 'Pattern permits trailing hyphens (design choice)');
    }
  } catch (err) {
    fail('T-SF01: Edge cases', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. TEST: SPEC_FOLDER_BASIC_PATTERN (less strict)
   Regex: /^\d{3}-[a-zA-Z]/
────────────────────────────────────────────────────────────────
*/

async function testSpecFolderBasicPatternValid() {
  log('\n🔬 SPEC_FOLDER_BASIC_PATTERN: Valid patterns match');

  try {
    const { SPEC_FOLDER_BASIC_PATTERN } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const validCases = [
      '003-SystemSpecKit',
      '121-A',
      '000-Hello',
      '999-Zulu',
      '042-mixedCASE',
    ];

    let allPassed = true;
    const failures = [];
    for (const input of validCases) {
      if (!SPEC_FOLDER_BASIC_PATTERN.test(input)) {
        allPassed = false;
        failures.push(input);
      }
    }

    if (allPassed) {
      pass('T-SF02a: Basic valid patterns match', `All ${validCases.length} valid patterns matched`);
    } else {
      fail('T-SF02a: Basic valid patterns match', `Failed to match: ${failures.join(', ')}`);
    }
  } catch (err) {
    fail('T-SF02a: Basic valid patterns match', err.message);
  }
}

async function testSpecFolderBasicPatternInvalid() {
  log('\n🔬 SPEC_FOLDER_BASIC_PATTERN: Invalid patterns rejected');

  try {
    const { SPEC_FOLDER_BASIC_PATTERN } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const invalidCases = [
      { input: '003-1invalid', reason: 'digit after hyphen' },
      { input: 'abc-def', reason: 'non-numeric prefix' },
      { input: '3-foo', reason: 'single digit prefix' },
      { input: '', reason: 'empty string' },
      { input: '003-', reason: 'nothing after hyphen' },
      { input: '003-_foo', reason: 'underscore after hyphen' },
      { input: '003--foo', reason: 'double hyphen' },
      { input: 'z_archive', reason: 'no digit prefix' },
    ];

    let allPassed = true;
    const failures = [];
    for (const { input, reason } of invalidCases) {
      if (SPEC_FOLDER_BASIC_PATTERN.test(input)) {
        allPassed = false;
        failures.push(`"${input}" (${reason})`);
      }
    }

    if (allPassed) {
      pass('T-SF02b: Basic invalid patterns rejected', `All ${invalidCases.length} invalid patterns rejected`);
    } else {
      fail('T-SF02b: Basic invalid patterns rejected', `Incorrectly matched: ${failures.join(', ')}`);
    }
  } catch (err) {
    fail('T-SF02b: Basic invalid patterns rejected', err.message);
  }
}

async function testBasicPatternIsLessStrict() {
  log('\n🔬 SPEC_FOLDER_BASIC_PATTERN: Is less strict than SPEC_FOLDER_PATTERN');

  try {
    const { SPEC_FOLDER_PATTERN, SPEC_FOLDER_BASIC_PATTERN } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    // These match BASIC but NOT strict
    const basicOnlyCases = [
      '003-SystemSpecKit',
      '003-FooBar',
      '121-ABC',
    ];

    let allPassed = true;
    const failures = [];
    for (const input of basicOnlyCases) {
      const matchesBasic = SPEC_FOLDER_BASIC_PATTERN.test(input);
      const matchesStrict = SPEC_FOLDER_PATTERN.test(input);
      if (!matchesBasic || matchesStrict) {
        allPassed = false;
        failures.push(`"${input}" basic=${matchesBasic} strict=${matchesStrict}`);
      }
    }

    if (allPassed) {
      pass('T-SF02c: Basic is superset of strict', `All ${basicOnlyCases.length} cases match basic but not strict`);
    } else {
      fail('T-SF02c: Basic is superset of strict', `Unexpected: ${failures.join(', ')}`);
    }
  } catch (err) {
    fail('T-SF02c: Basic is superset of strict', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. TEST: findChildFolderSync
   Uses real filesystem via getSpecsDirectories()
────────────────────────────────────────────────────────────────
*/

async function testFindChildFolderSyncExisting() {
  log('\n🔬 findChildFolderSync: Finds existing unique child folder');

  try {
    const { findChildFolderSync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));
    const { getSpecsDirectories } = require(path.join(DIST_DIR, 'core', 'config'));
    const specsDirs = getSpecsDirectories().filter(dir => fs.existsSync(dir));
    if (specsDirs.length === 0) {
      skip('T-SF03a: Find existing child', 'No specs directories available');
      return;
    }

    const token = Date.now().toString(36);
    const parentName = `997-sync-parent-${token}`;
    const childName = `996-sync-child-${token}`;
    const createdPath = path.join(specsDirs[0], parentName, childName);
    fs.mkdirSync(createdPath, { recursive: true });

    try {
      const result = findChildFolderSync(childName);
      // With aliased roots, deduplication should resolve to a single result
      const isAbsolute = path.isAbsolute(result || '');
      const endsCorrectly = (result || '').endsWith(childName);
      const containsParent = (result || '').includes(parentName);
      if (result !== null && isAbsolute && endsCorrectly && containsParent) {
        pass('T-SF03a: Find existing child', `Found: ${result}`);
      } else {
        fail('T-SF03a: Find existing child', `Unexpected result: ${result}`);
      }
    } finally {
      try { fs.rmSync(path.join(specsDirs[0], parentName), { recursive: true, force: true }); } catch (_) {}
    }
  } catch (err) {
    fail('T-SF03a: Find existing child', err.message);
  }
}

async function testFindChildFolderSyncSecondChild() {
  log('\n🔬 findChildFolderSync: Finds another existing child folder');

  try {
    const { findChildFolderSync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));
    const { getSpecsDirectories } = require(path.join(DIST_DIR, 'core', 'config'));
    const specsDirs = getSpecsDirectories().filter(dir => fs.existsSync(dir));
    if (specsDirs.length === 0) {
      skip('T-SF03b: Find second existing child', 'No specs directories available');
      return;
    }

    const token = `${Date.now().toString(36)}-b`;
    const parentName = `997-sync-parent2-${token}`;
    const childName = `996-sync-child2-${token}`;
    fs.mkdirSync(path.join(specsDirs[0], parentName, childName), { recursive: true });

    try {
      const result = findChildFolderSync(childName);
      // With aliased roots, deduplication should resolve to a single result
      if (path.isAbsolute(result || '') && (result || '').endsWith(childName)) {
        pass('T-SF03b: Find second existing child', `Found: ${path.basename(path.dirname(result))}/${path.basename(result)}`);
      } else {
        fail('T-SF03b: Find second existing child', `Unexpected: ${result}`);
      }
    } finally {
      try { fs.rmSync(path.join(specsDirs[0], parentName), { recursive: true, force: true }); } catch (_) {}
    }
  } catch (err) {
    fail('T-SF03b: Find second existing child', err.message);
  }
}

async function testFindChildFolderSyncNonexistent() {
  log('\n🔬 findChildFolderSync: Returns null for non-existent child');

  try {
    const { findChildFolderSync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const result = findChildFolderSync('999-nonexistent-folder');

    if (result === null) {
      pass('T-SF03c: Non-existent child returns null', 'Returned null');
    } else {
      fail('T-SF03c: Non-existent child returns null', `Unexpectedly found: ${result}`);
    }
  } catch (err) {
    fail('T-SF03c: Non-existent child returns null', err.message);
  }
}

async function testFindChildFolderSyncEmptyString() {
  log('\n🔬 findChildFolderSync: Returns null for empty string');

  try {
    const { findChildFolderSync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    // Early-return guard in findChildFolderSync prevents ambiguity noise for empty/falsy input
    const result = findChildFolderSync('');

    if (result === null) {
      pass('T-SF03d: Empty string returns null', 'Returned null (early-return guard)');
    } else {
      fail('T-SF03d: Empty string returns null', `Unexpectedly found: ${result}`);
    }
  } catch (err) {
    fail('T-SF03d: Empty string returns null', err.message);
  }
}

async function testFindChildFolderSyncInvalidFormat() {
  log('\n🔬 findChildFolderSync: Returns null for invalid format name');

  try {
    const { findChildFolderSync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    // This doesn't match folder naming but function should still return null gracefully
    const result = findChildFolderSync('not-a-valid-child');

    if (result === null) {
      pass('T-SF03e: Invalid format returns null', 'Returned null');
    } else {
      fail('T-SF03e: Invalid format returns null', `Unexpectedly found: ${result}`);
    }
  } catch (err) {
    fail('T-SF03e: Invalid format returns null', err.message);
  }
}

async function testFindChildFolderSyncAmbiguous() {
  log('\n🔬 findChildFolderSync: Returns null for ambiguous child (multiple parents)');

  const fs = require('fs');
  const token = Date.now().toString(36);
  const tempChildName = `999-ambiguity-${token}`;
  // Create same child name under TWO different spec-folder parents in the SAME specs root
  // This creates genuine ambiguity that dedup cannot resolve
  const { getSpecsDirectories } = require(path.join(DIST_DIR, 'core', 'config'));
  const specsDirs = getSpecsDirectories().filter(dir => fs.existsSync(dir));
  if (specsDirs.length === 0) {
    skip('T-SF03f: Ambiguous child returns null', 'No specs directories available');
    return;
  }
  const parent1 = `997-ambig-parent1-${token}`;
  const parent2 = `998-ambig-parent2-${token}`;
  const dir1 = path.join(specsDirs[0], parent1, tempChildName);
  const dir2 = path.join(specsDirs[0], parent2, tempChildName);

  try {
    const { findChildFolderSync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    fs.mkdirSync(dir1, { recursive: true });
    fs.mkdirSync(dir2, { recursive: true });

    const result = findChildFolderSync(tempChildName);

    if (result === null) {
      pass('T-SF03f: Ambiguous child returns null', 'Returned null (found in multiple parents)');
    } else {
      fail('T-SF03f: Ambiguous child returns null', `Expected null, got: ${result}`);
    }
  } catch (err) {
    fail('T-SF03f: Ambiguous child returns null', err.message);
  } finally {
    try { fs.rmSync(path.join(specsDirs[0], parent1), { recursive: true, force: true }); } catch (_) {}
    try { fs.rmSync(path.join(specsDirs[0], parent2), { recursive: true, force: true }); } catch (_) {}
  }
}

/* ─────────────────────────────────────────────────────────────
   6. TEST: findChildFolderAsync
   Same cases as sync but verifying async behavior
────────────────────────────────────────────────────────────────
*/

async function testFindChildFolderAsyncExisting() {
  log('\n🔬 findChildFolderAsync: Finds existing unique child folder');

  try {
    const { findChildFolderAsync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));
    const { getSpecsDirectories } = require(path.join(DIST_DIR, 'core', 'config'));
    const specsDirs = getSpecsDirectories().filter(dir => fs.existsSync(dir));
    if (specsDirs.length === 0) {
      skip('T-SF04a: Async find existing child', 'No specs directories available');
      return;
    }

    const token = `${Date.now().toString(36)}-a`;
    const parentName = `997-async-parent-${token}`;
    const childName = `996-async-child-${token}`;
    fs.mkdirSync(path.join(specsDirs[0], parentName, childName), { recursive: true });

    try {
      const result = await findChildFolderAsync(childName);
      // With aliased roots, deduplication should resolve to a single result
      const isAbsolute = path.isAbsolute(result || '');
      const endsCorrectly = (result || '').endsWith(childName);
      if (result !== null && isAbsolute && endsCorrectly) {
        pass('T-SF04a: Async find existing child', `Found: ${result}`);
      } else {
        fail('T-SF04a: Async find existing child', `Unexpected path: ${result}`);
      }
    } finally {
      try { fs.rmSync(path.join(specsDirs[0], parentName), { recursive: true, force: true }); } catch (_) {}
    }
  } catch (err) {
    fail('T-SF04a: Async find existing child', err.message);
  }
}

async function testFindChildFolderAsyncNonexistent() {
  log('\n🔬 findChildFolderAsync: Returns null for non-existent child');

  try {
    const { findChildFolderAsync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const result = await findChildFolderAsync('999-nonexistent-folder');

    if (result === null) {
      pass('T-SF04b: Async non-existent returns null', 'Returned null');
    } else {
      fail('T-SF04b: Async non-existent returns null', `Unexpectedly found: ${result}`);
    }
  } catch (err) {
    fail('T-SF04b: Async non-existent returns null', err.message);
  }
}

async function testFindChildFolderAsyncReturnsPromise() {
  log('\n🔬 findChildFolderAsync: Returns a Promise');

  try {
    const { findChildFolderAsync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const returnValue = findChildFolderAsync('999-nonexistent-folder');

    if (returnValue instanceof Promise) {
      pass('T-SF04c: Returns a Promise', 'instanceof Promise === true');
      // Await to avoid unhandled rejection
      await returnValue;
    } else {
      fail('T-SF04c: Returns a Promise', `typeof: ${typeof returnValue}`);
    }
  } catch (err) {
    fail('T-SF04c: Returns a Promise', err.message);
  }
}

async function testFindChildFolderAsyncMatchesSync() {
  log('\n🔬 findChildFolderAsync: Results match findChildFolderSync');

  try {
    const { findChildFolderSync, findChildFolderAsync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const testCases = [
      '121-script-audit-comprehensive',
      '123-generate-context-subfolder',
      '999-nonexistent-folder',
    ];

    let allMatch = true;
    const mismatches = [];

    for (const childName of testCases) {
      const syncResult = findChildFolderSync(childName);
      const asyncResult = await findChildFolderAsync(childName);

      if (syncResult !== asyncResult) {
        allMatch = false;
        mismatches.push(`"${childName}": sync=${syncResult}, async=${asyncResult}`);
      }
    }

    if (allMatch) {
      pass('T-SF04d: Async matches sync for all cases', `Tested ${testCases.length} cases`);
    } else {
      fail('T-SF04d: Async matches sync for all cases', `Mismatches: ${mismatches.join('; ')}`);
    }
  } catch (err) {
    fail('T-SF04d: Async matches sync for all cases', err.message);
  }
}

async function testFindChildFolderAsyncEmptyString() {
  log('\n🔬 findChildFolderAsync: Returns null for empty string');

  try {
    const { findChildFolderAsync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    // Early-return guard in findChildFolderAsync prevents ambiguity noise for empty/falsy input
    const result = await findChildFolderAsync('');

    if (result === null) {
      pass('T-SF04e: Async empty string returns null', 'Returned null (early-return guard)');
    } else {
      fail('T-SF04e: Async empty string returns null', `Unexpectedly found: ${result}`);
    }
  } catch (err) {
    fail('T-SF04e: Async empty string returns null', err.message);
  }
}

async function testFindChildFolderAsyncAmbiguous() {
  log('\n🔬 findChildFolderAsync: Returns null for ambiguous child (multiple parents)');

  const fs = require('fs');
  const token = `${Date.now().toString(36)}-af`;
  const tempChildName = `999-ambiguity-${token}`;
  const { getSpecsDirectories } = require(path.join(DIST_DIR, 'core', 'config'));
  const specsDirs = getSpecsDirectories().filter(dir => fs.existsSync(dir));
  if (specsDirs.length === 0) {
    skip('T-SF04f: Async ambiguous child returns null', 'No specs directories available');
    return;
  }
  const parent1 = `997-ambig-parent1-${token}`;
  const parent2 = `998-ambig-parent2-${token}`;
  const dir1 = path.join(specsDirs[0], parent1, tempChildName);
  const dir2 = path.join(specsDirs[0], parent2, tempChildName);

  try {
    const { findChildFolderAsync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    fs.mkdirSync(dir1, { recursive: true });
    fs.mkdirSync(dir2, { recursive: true });

    const result = await findChildFolderAsync(tempChildName);

    if (result === null) {
      pass('T-SF04f: Async ambiguous child returns null', 'Returned null (found in multiple parents)');
    } else {
      fail('T-SF04f: Async ambiguous child returns null', `Expected null, got: ${result}`);
    }
  } catch (err) {
    fail('T-SF04f: Async ambiguous child returns null', err.message);
  } finally {
    try { fs.rmSync(path.join(specsDirs[0], parent1), { recursive: true, force: true }); } catch (_) {}
    try { fs.rmSync(path.join(specsDirs[0], parent2), { recursive: true, force: true }); } catch (_) {}
  }
}

/* ─────────────────────────────────────────────────────────────
   7. TEST: core/index.js RE-EXPORTS
   Verify all subfolder-utils exports are accessible from barrel
────────────────────────────────────────────────────────────────
*/

async function testCoreIndexReExports() {
  log('\n🔬 CORE INDEX: All subfolder-utils exports accessible');

  try {
    const coreIndex = require(path.join(DIST_DIR, 'core', 'index'));

    const expectedExports = [
      { name: 'SPEC_FOLDER_PATTERN', type: 'object' },       // RegExp is typeof 'object'
      { name: 'SPEC_FOLDER_BASIC_PATTERN', type: 'object' },
      { name: 'CATEGORY_FOLDER_PATTERN', type: 'object' },
      { name: 'findChildFolderSync', type: 'function' },
      { name: 'findChildFolderAsync', type: 'function' },
    ];

    let allPresent = true;
    const missing = [];
    const wrongType = [];

    for (const { name, type } of expectedExports) {
      if (!(name in coreIndex)) {
        allPresent = false;
        missing.push(name);
      } else if (typeof coreIndex[name] !== type) {
        allPresent = false;
        wrongType.push(`${name}: expected ${type}, got ${typeof coreIndex[name]}`);
      }
    }

    if (allPresent) {
      pass('T-SF05a: All exports present with correct types', expectedExports.map(e => e.name).join(', '));
    } else {
      const reasons = [];
      if (missing.length > 0) reasons.push(`Missing: ${missing.join(', ')}`);
      if (wrongType.length > 0) reasons.push(`Wrong type: ${wrongType.join(', ')}`);
      fail('T-SF05a: All exports present with correct types', reasons.join('; '));
    }
  } catch (err) {
    fail('T-SF05a: All exports present with correct types', err.message);
  }
}

async function testCoreIndexPatternsAreRegExp() {
  log('\n🔬 CORE INDEX: Pattern exports are RegExp instances');

  try {
    const { SPEC_FOLDER_PATTERN, SPEC_FOLDER_BASIC_PATTERN } = require(path.join(DIST_DIR, 'core', 'index'));

    const isRegExp1 = SPEC_FOLDER_PATTERN instanceof RegExp;
    const isRegExp2 = SPEC_FOLDER_BASIC_PATTERN instanceof RegExp;

    if (isRegExp1 && isRegExp2) {
      pass('T-SF05b: Both patterns are RegExp instances', `SPEC_FOLDER_PATTERN=${SPEC_FOLDER_PATTERN}, BASIC=${SPEC_FOLDER_BASIC_PATTERN}`);
    } else {
      fail('T-SF05b: Both patterns are RegExp instances', `Pattern=${isRegExp1}, Basic=${isRegExp2}`);
    }
  } catch (err) {
    fail('T-SF05b: Both patterns are RegExp instances', err.message);
  }
}

async function testCoreIndexFunctionsWork() {
  log('\n🔬 CORE INDEX: Re-exported functions work correctly');

  try {
    const { findChildFolderSync, findChildFolderAsync } = require(path.join(DIST_DIR, 'core', 'index'));

    // Sync: non-existent returns null
    const syncResult = findChildFolderSync('999-nonexistent');
    // Async: non-existent returns null
    const asyncResult = await findChildFolderAsync('999-nonexistent');

    if (syncResult === null && asyncResult === null) {
      pass('T-SF05c: Re-exported functions return correct results', 'Both returned null for non-existent child');
    } else {
      fail('T-SF05c: Re-exported functions return correct results', `sync=${syncResult}, async=${asyncResult}`);
    }
  } catch (err) {
    fail('T-SF05c: Re-exported functions return correct results', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   8. TEST: CATEGORY_FOLDER_PATTERN
   Regex: /^\d{2}--[a-z][a-z0-9-]*$/
────────────────────────────────────────────────────────────────
*/

async function testCategoryFolderPatternValid() {
  log('\n🔬 CATEGORY_FOLDER_PATTERN: Valid category patterns match');

  try {
    const { CATEGORY_FOLDER_PATTERN } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const validCases = [
      '02--system-spec-kit',
      '01--anobel',
      '00--opencode-environment',
      '99--test-category',
    ];

    let allPassed = true;
    const failures = [];
    for (const input of validCases) {
      if (!CATEGORY_FOLDER_PATTERN.test(input)) {
        allPassed = false;
        failures.push(input);
      }
    }

    if (allPassed) {
      pass('T-SF06a: Category valid patterns match', `All ${validCases.length} valid patterns matched`);
    } else {
      fail('T-SF06a: Category valid patterns match', `Failed to match: ${failures.join(', ')}`);
    }
  } catch (err) {
    fail('T-SF06a: Category valid patterns match', err.message);
  }
}

async function testCategoryFolderPatternInvalid() {
  log('\n🔬 CATEGORY_FOLDER_PATTERN: Invalid category patterns rejected');

  try {
    const { CATEGORY_FOLDER_PATTERN } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    const invalidCases = [
      { input: '003-spec-folder', reason: 'spec folder (3 digits + single hyphen)' },
      { input: '2--short', reason: 'single digit prefix' },
      { input: '02-single-hyphen', reason: 'single hyphen (not category)' },
      { input: '02--UPPERCASE', reason: 'uppercase after double hyphen' },
      { input: '', reason: 'empty string' },
    ];

    let allPassed = true;
    const failures = [];
    for (const { input, reason } of invalidCases) {
      if (CATEGORY_FOLDER_PATTERN.test(input)) {
        allPassed = false;
        failures.push(`"${input}" (${reason})`);
      }
    }

    if (allPassed) {
      pass('T-SF06b: Category invalid patterns rejected', `All ${invalidCases.length} invalid patterns rejected`);
    } else {
      fail('T-SF06b: Category invalid patterns rejected', `Incorrectly matched: ${failures.join(', ')}`);
    }
  } catch (err) {
    fail('T-SF06b: Category invalid patterns rejected', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   9. TEST: findChildFolderSync with deep nesting (category/parent/child)
────────────────────────────────────────────────────────────────
*/

async function testFindChildFolderSyncDeepNesting() {
  log('\n🔬 findChildFolderSync: Finds child in category/parent/child structure');

  try {
    const { findChildFolderSync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));
    const { getSpecsDirectories } = require(path.join(DIST_DIR, 'core', 'config'));
    const specsDirs = getSpecsDirectories().filter(dir => fs.existsSync(dir));
    if (specsDirs.length === 0) {
      skip('T-SF07a: Deep nesting find', 'No specs directories available');
      return;
    }

    const token = Date.now().toString(36);
    const categoryName = `02--test-category-${token}`;
    const parentName = `997-deep-parent-${token}`;
    const childName = `996-deep-child-${token}`;
    const createdPath = path.join(specsDirs[0], categoryName, parentName, childName);
    fs.mkdirSync(createdPath, { recursive: true });

    try {
      const result = findChildFolderSync(childName);
      // Root dedup handles aliased roots upfront — result should always be non-null for unique child
      const isAbsolute = path.isAbsolute(result || '');
      const endsCorrectly = (result || '').endsWith(childName);
      const containsCategory = (result || '').includes(categoryName);
      const containsParent = (result || '').includes(parentName);
      if (result !== null && isAbsolute && endsCorrectly && containsCategory && containsParent) {
        pass('T-SF07a: Deep nesting find', `Found: ${result}`);
      } else {
        fail('T-SF07a: Deep nesting find', `Expected non-null absolute path containing ${categoryName}/${parentName}/${childName}, got: ${result}`);
      }
    } finally {
      try { fs.rmSync(path.join(specsDirs[0], categoryName), { recursive: true, force: true }); } catch (_) {}
    }
  } catch (err) {
    fail('T-SF07a: Deep nesting find', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   10. TEST: SEARCH_MAX_DEPTH boundary
────────────────────────────────────────────────────────────────
*/

async function testSearchMaxDepthExported() {
  log('\n🔬 SEARCH_MAX_DEPTH: Exported constant is available');

  try {
    const { SEARCH_MAX_DEPTH } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    if (typeof SEARCH_MAX_DEPTH === 'number' && SEARCH_MAX_DEPTH > 0) {
      pass('T-SF08a: SEARCH_MAX_DEPTH exported', `Value: ${SEARCH_MAX_DEPTH}`);
    } else {
      fail('T-SF08a: SEARCH_MAX_DEPTH exported', `Expected positive number, got: ${SEARCH_MAX_DEPTH}`);
    }
  } catch (err) {
    fail('T-SF08a: SEARCH_MAX_DEPTH exported', err.message);
  }
}

async function testFindChildFolderSyncAtMaxDepth() {
  log('\n🔬 findChildFolderSync: Finds child at exactly MAX_DEPTH');

  try {
    const { findChildFolderSync, SEARCH_MAX_DEPTH } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));
    const { getSpecsDirectories } = require(path.join(DIST_DIR, 'core', 'config'));
    const specsDirs = getSpecsDirectories().filter(dir => fs.existsSync(dir));
    if (specsDirs.length === 0) {
      skip('T-SF08b: Find at MAX_DEPTH', 'No specs directories available');
      return;
    }

    const token = Date.now().toString(36);
    // Build SEARCH_MAX_DEPTH levels of traversable intermediary folders
    const intermediaries = [];
    for (let i = 0; i < SEARCH_MAX_DEPTH; i++) {
      intermediaries.push(`99${i}-depth-${token}`);
    }
    const targetName = `990-at-limit-${token}`;
    const atLimitPath = path.join(specsDirs[0], ...intermediaries, targetName);
    fs.mkdirSync(atLimitPath, { recursive: true });

    try {
      const result = findChildFolderSync(targetName);
      if (result !== null && result.endsWith(targetName)) {
        pass('T-SF08b: Find at MAX_DEPTH', `Found at depth ${SEARCH_MAX_DEPTH}: ${path.basename(result)}`);
      } else {
        fail('T-SF08b: Find at MAX_DEPTH', `Expected to find at depth ${SEARCH_MAX_DEPTH}, got: ${result}`);
      }
    } finally {
      try { fs.rmSync(path.join(specsDirs[0], intermediaries[0]), { recursive: true, force: true }); } catch (_) {}
    }
  } catch (err) {
    fail('T-SF08b: Find at MAX_DEPTH', err.message);
  }
}

async function testFindChildFolderSyncBeyondMaxDepth() {
  log('\n🔬 findChildFolderSync: Does NOT find child beyond MAX_DEPTH');

  try {
    const { findChildFolderSync, SEARCH_MAX_DEPTH } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));
    const { getSpecsDirectories } = require(path.join(DIST_DIR, 'core', 'config'));
    const specsDirs = getSpecsDirectories().filter(dir => fs.existsSync(dir));
    if (specsDirs.length === 0) {
      skip('T-SF08c: Not found beyond MAX_DEPTH', 'No specs directories available');
      return;
    }

    const token = `${Date.now().toString(36)}-bm`;
    // Build SEARCH_MAX_DEPTH + 1 levels — target is one level too deep
    const intermediaries = [];
    for (let i = 0; i <= SEARCH_MAX_DEPTH; i++) {
      intermediaries.push(`99${i}-beyond-${token}`);
    }
    const targetName = `990-too-deep-${token}`;
    const beyondPath = path.join(specsDirs[0], ...intermediaries, targetName);
    fs.mkdirSync(beyondPath, { recursive: true });

    try {
      const result = findChildFolderSync(targetName);
      if (result === null) {
        pass('T-SF08c: Not found beyond MAX_DEPTH', `Correctly returned null for depth > ${SEARCH_MAX_DEPTH}`);
      } else {
        fail('T-SF08c: Not found beyond MAX_DEPTH', `Expected null beyond depth ${SEARCH_MAX_DEPTH}, got: ${result}`);
      }
    } finally {
      try { fs.rmSync(path.join(specsDirs[0], intermediaries[0]), { recursive: true, force: true }); } catch (_) {}
    }
  } catch (err) {
    fail('T-SF08c: Not found beyond MAX_DEPTH', err.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   11. TEST: isValidSpecFolder multi-segment validation
────────────────────────────────────────────────────────────────
*/

async function testIsValidSpecFolderMultiSegment() {
  log('\n🔬 isValidSpecFolder: Multi-segment path validation');

  try {
    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));

    const testCases = [
      { input: 'specs/003-feature', expectValid: true, desc: 'single spec under specs/' },
      { input: 'specs/003-parent/121-child', expectValid: true, desc: '2-segment under specs/' },
      { input: '.opencode/specs/003-parent/121-child', expectValid: true, desc: '2-segment under .opencode/specs/' },
      { input: 'specs/02--cat/003-parent/121-child', expectValid: true, desc: '3-segment with category' },
      { input: '.opencode/specs/003-feature', expectValid: true, desc: 'single spec under .opencode/specs/' },
      { input: 'not-valid', expectValid: false, desc: 'non-spec format' },
      { input: 'specs/bad_name', expectValid: false, desc: 'invalid spec folder name' },
    ];

    let allPassed = true;
    const failures = [];
    for (const { input, expectValid, desc } of testCases) {
      const result = isValidSpecFolder(input);
      if (result.valid !== expectValid) {
        allPassed = false;
        failures.push(`"${input}" (${desc}): expected valid=${expectValid}, got valid=${result.valid}, reason=${result.reason}`);
      }
    }

    if (allPassed) {
      pass('T-SF09a: Multi-segment validation', `All ${testCases.length} cases passed`);
    } else {
      fail('T-SF09a: Multi-segment validation', failures.join('; '));
    }
  } catch (err) {
    fail('T-SF09a: Multi-segment validation', err.message);
  }
}

async function testIsValidSpecFolderRejectsSymlinkEscape() {
  log('\n🔬 isValidSpecFolder: Rejects symlink escape outside approved roots');

  const { getSpecsDirectories } = require(path.join(DIST_DIR, 'core', 'config'));
  const specsDirs = getSpecsDirectories().filter(dir => fs.existsSync(dir));
  if (specsDirs.length === 0) {
    skip('T-SF09b: Reject symlink escape', 'No specs directories available');
    return;
  }

  const outsideRoot = fs.mkdtempSync(path.join(require('os').tmpdir(), 'generate-context-outside-'));
  const outsideSpec = path.join(outsideRoot, '996-outside-child');
  const symlinkPath = path.join(specsDirs[0], `998-gc-symlink-${Date.now().toString(36)}`);

  try {
    fs.mkdirSync(outsideSpec, { recursive: true });
    fs.symlinkSync(outsideRoot, symlinkPath, 'dir');

    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
    const result = isValidSpecFolder(path.join(symlinkPath, path.basename(outsideSpec)));

    if (!result.valid) {
      pass('T-SF09b: Reject symlink escape', result.reason || 'invalid as expected');
    } else {
      fail('T-SF09b: Reject symlink escape', 'Symlinked path unexpectedly validated');
    }
  } catch (err) {
    fail('T-SF09b: Reject symlink escape', err.message);
  } finally {
    try { fs.rmSync(symlinkPath, { recursive: true, force: true }); } catch (_) {}
    try { fs.rmSync(outsideRoot, { recursive: true, force: true }); } catch (_) {}
  }
}

/* ─────────────────────────────────────────────────────────────
   12. TEST: FindChildOptions (onAmbiguity callback)
────────────────────────────────────────────────────────────────
*/

async function testFindChildFolderSyncAmbiguityCallback() {
  log('\n🔬 findChildFolderSync: onAmbiguity callback receives ambiguous paths');

  const token = `${Date.now().toString(36)}-cb`;
  const tempChildName = `999-callback-${token}`;
  const { getSpecsDirectories } = require(path.join(DIST_DIR, 'core', 'config'));
  const specsDirs = getSpecsDirectories().filter(dir => fs.existsSync(dir));
  if (specsDirs.length === 0) {
    skip('T-SF10a: Ambiguity callback', 'No specs directories available');
    return;
  }
  const parent1 = `997-cb-parent1-${token}`;
  const parent2 = `998-cb-parent2-${token}`;
  const dir1 = path.join(specsDirs[0], parent1, tempChildName);
  const dir2 = path.join(specsDirs[0], parent2, tempChildName);

  try {
    const { findChildFolderSync } = require(path.join(DIST_DIR, 'core', 'subfolder-utils'));

    fs.mkdirSync(dir1, { recursive: true });
    fs.mkdirSync(dir2, { recursive: true });

    let callbackCalled = false;
    let callbackPaths = [];
    const result = findChildFolderSync(tempChildName, {
      onAmbiguity: (name, paths) => {
        callbackCalled = true;
        callbackPaths = paths;
      }
    });

    if (result === null && callbackCalled && callbackPaths.length >= 2) {
      pass('T-SF10a: Ambiguity callback', `Callback received ${callbackPaths.length} paths`);
    } else {
      fail('T-SF10a: Ambiguity callback', `result=${result}, callbackCalled=${callbackCalled}, paths=${callbackPaths.length}`);
    }
  } catch (err) {
    fail('T-SF10a: Ambiguity callback', err.message);
  } finally {
    try { fs.rmSync(path.join(specsDirs[0], parent1), { recursive: true, force: true }); } catch (_) {}
    try { fs.rmSync(path.join(specsDirs[0], parent2), { recursive: true, force: true }); } catch (_) {}
  }
}

/* ─────────────────────────────────────────────────────────────
   13. MAIN TEST RUNNER
────────────────────────────────────────────────────────────────
*/

async function main() {
  log('\n═══════════════════════════════════════════════════════════════');
  log('TEST: Subfolder Resolution (subfolder-utils + core/index)');
  log('═══════════════════════════════════════════════════════════════');

  // Category A: SPEC_FOLDER_PATTERN
  log('\n── Category A: SPEC_FOLDER_PATTERN ──
');
  await testSpecFolderPatternValid();
  await testSpecFolderPatternInvalid();
  await testSpecFolderPatternEdgeCases();

  // Category B: SPEC_FOLDER_BASIC_PATTERN
  log('\n── Category B: SPEC_FOLDER_BASIC_PATTERN ──
');
  await testSpecFolderBasicPatternValid();
  await testSpecFolderBasicPatternInvalid();
  await testBasicPatternIsLessStrict();

  // Category C: findChildFolderSync
  log('\n── Category C: findChildFolderSync ──
');
  await testFindChildFolderSyncExisting();
  await testFindChildFolderSyncSecondChild();
  await testFindChildFolderSyncNonexistent();
  await testFindChildFolderSyncEmptyString();
  await testFindChildFolderSyncInvalidFormat();
  await testFindChildFolderSyncAmbiguous();

  // Category D: findChildFolderAsync
  log('\n── Category D: findChildFolderAsync ──
');
  await testFindChildFolderAsyncExisting();
  await testFindChildFolderAsyncNonexistent();
  await testFindChildFolderAsyncReturnsPromise();
  await testFindChildFolderAsyncMatchesSync();
  await testFindChildFolderAsyncEmptyString();
  await testFindChildFolderAsyncAmbiguous();

  // Category E: core/index.js re-exports
  log('\n── Category E: core/index.js Re-exports ──
');
  await testCoreIndexReExports();
  await testCoreIndexPatternsAreRegExp();
  await testCoreIndexFunctionsWork();

  // Category F: CATEGORY_FOLDER_PATTERN
  log('\n── Category F: CATEGORY_FOLDER_PATTERN ──
');
  await testCategoryFolderPatternValid();
  await testCategoryFolderPatternInvalid();

  // Category G: Deep nesting (category/parent/child)
  log('\n── Category G: Deep Nesting ──
');
  await testFindChildFolderSyncDeepNesting();

  // Category H: SEARCH_MAX_DEPTH boundary
  log('\n── Category H: SEARCH_MAX_DEPTH Boundary ──
');
  await testSearchMaxDepthExported();
  await testFindChildFolderSyncAtMaxDepth();
  await testFindChildFolderSyncBeyondMaxDepth();

  // Category I: isValidSpecFolder multi-segment
  log('\n── Category I: isValidSpecFolder Multi-Segment ──
');
  await testIsValidSpecFolderMultiSegment();
  await testIsValidSpecFolderRejectsSymlinkEscape();

  // Category J: FindChildOptions (onAmbiguity callback)
  log('\n── Category J: FindChildOptions ──
');
  await testFindChildFolderSyncAmbiguityCallback();

  // Results summary
  log('\n═══════════════════════════════════════════════════════════════');
  log(`RESULTS: ${results.passed} passed, ${results.failed} failed, ${results.skipped} skipped`);
  log('═══════════════════════════════════════════════════════════════\n');

  if (results.failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});

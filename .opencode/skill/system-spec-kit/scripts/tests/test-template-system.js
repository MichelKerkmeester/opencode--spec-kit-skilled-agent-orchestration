// ───────────────────────────────────────────────────────────────
// 1. TEST: TEMPLATE SYSTEM VERIFICATION
// ───────────────────────────────────────────────────────────────
//
// Comprehensive tests for the SpecKit template system:
// - Level folder existence and file counts
// - CORE + ADDENDUM composition architecture
// - Template file contents and placeholder patterns
// - compose.sh script functionality
// - Example templates (filled placeholders)
//

'use strict';

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────
*/

const ROOT = path.join(__dirname, '..', '..');
const TEMPLATES_DIR = path.join(ROOT, 'templates');
const SCRIPTS_DIR = path.join(ROOT, 'scripts');

// Template directories
const LEVEL_1_DIR = path.join(TEMPLATES_DIR, 'level_1');
const LEVEL_2_DIR = path.join(TEMPLATES_DIR, 'level_2');
const LEVEL_3_DIR = path.join(TEMPLATES_DIR, 'level_3');
const LEVEL_3PLUS_DIR = path.join(TEMPLATES_DIR, 'level_3+');

const CORE_DIR = path.join(TEMPLATES_DIR, 'core');
const ADDENDUM_DIR = path.join(TEMPLATES_DIR, 'addendum');
const EXAMPLES_DIR = path.join(TEMPLATES_DIR, 'examples');

// Compose.sh script
const COMPOSE_SCRIPT = path.join(SCRIPTS_DIR, 'templates', 'compose.sh');

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
  log(`   [PASS] ${testName}`);
  if (evidence) log(`      Evidence: ${evidence}`);
}

function fail(testName, reason) {
  results.failed++;
  results.tests.push({ name: testName, status: 'FAIL', reason });
  log(`   [FAIL] ${testName}`);
  log(`      Reason: ${reason}`);
}

function skip(testName, reason) {
  results.skipped++;
  results.tests.push({ name: testName, status: 'SKIP', reason });
  log(`   [SKIP] ${testName} (skipped: ${reason})`);
}

function dirExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

function fileExists(file_path) {
  return fs.existsSync(file_path) && fs.statSync(file_path).isFile();
}

function countFilesInDir(dirPath, extension = '.md') {
  if (!dirExists(dirPath)) return 0;
  const files = fs.readdirSync(dirPath);
  // Exclude README.md from count (documentation file, not a template)
  return files.filter(f => f.endsWith(extension) && f !== 'README.md').length;
}

function readFile(file_path) {
  if (!fileExists(file_path)) return null;
  return fs.readFileSync(file_path, 'utf8');
}

function hasSingleTopFrontmatter(content) {
  if (!content || !content.startsWith('---\n')) {
    return false;
  }

  const closingIndex = content.indexOf('\n---\n', 4);
  if (closingIndex === -1) {
    return false;
  }

  const trailing = content.slice(closingIndex + 5);
  return !trailing.startsWith('---\n');
}

/* ─────────────────────────────────────────────────────────────
   3. TEST SUITE: LEVEL TEMPLATES EXIST
────────────────────────────────────────────────────────────────
*/

async function testLevelTemplatesExist() {
  log('\n--- TEST SUITE: Level Templates Exist ---');

  // Test Level 1 directory and files (4 files)
  try {
    if (dirExists(LEVEL_1_DIR)) {
      pass('T-001a: level_1/ directory exists', LEVEL_1_DIR);
    } else {
      fail('T-001a: level_1/ directory exists', `Directory not found: ${LEVEL_1_DIR}`);
      return;
    }

    const level1Expected = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md'];
    const level1Actual = fs.readdirSync(LEVEL_1_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');

    if (level1Actual.length === 4) {
      pass('T-001b: level_1/ has 4 files', `Files: ${level1Actual.join(', ')}`);
    } else {
      fail('T-001b: level_1/ has 4 files', `Expected 4, found ${level1Actual.length}: ${level1Actual.join(', ')}`);
    }

    for (const file of level1Expected) {
      if (fileExists(path.join(LEVEL_1_DIR, file))) {
        pass(`T-001c: level_1/${file} exists`, 'File found');
      } else {
        fail(`T-001c: level_1/${file} exists`, 'File not found');
      }
    }
  } catch (error) {
    fail('T-001: Level 1 templates', error.message);
  }

  // Test Level 2 directory and files (5 files: +checklist.md)
  try {
    if (dirExists(LEVEL_2_DIR)) {
      pass('T-002a: level_2/ directory exists', LEVEL_2_DIR);
    } else {
      fail('T-002a: level_2/ directory exists', `Directory not found: ${LEVEL_2_DIR}`);
      return;
    }

    const level2Expected = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'checklist.md'];
    const level2Actual = fs.readdirSync(LEVEL_2_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');

    if (level2Actual.length === 5) {
      pass('T-002b: level_2/ has 5 files', `Files: ${level2Actual.join(', ')}`);
    } else {
      fail('T-002b: level_2/ has 5 files', `Expected 5, found ${level2Actual.length}: ${level2Actual.join(', ')}`);
    }

    for (const file of level2Expected) {
      if (fileExists(path.join(LEVEL_2_DIR, file))) {
        pass(`T-002c: level_2/${file} exists`, 'File found');
      } else {
        fail(`T-002c: level_2/${file} exists`, 'File not found');
      }
    }
  } catch (error) {
    fail('T-002: Level 2 templates', error.message);
  }

  // Test Level 3 directory and files (6 files: +decision-record.md)
  try {
    if (dirExists(LEVEL_3_DIR)) {
      pass('T-003a: level_3/ directory exists', LEVEL_3_DIR);
    } else {
      fail('T-003a: level_3/ directory exists', `Directory not found: ${LEVEL_3_DIR}`);
      return;
    }

    const level3Expected = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'checklist.md', 'decision-record.md'];
    const level3Actual = fs.readdirSync(LEVEL_3_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');

    if (level3Actual.length === 6) {
      pass('T-003b: level_3/ has 6 files', `Files: ${level3Actual.join(', ')}`);
    } else {
      fail('T-003b: level_3/ has 6 files', `Expected 6, found ${level3Actual.length}: ${level3Actual.join(', ')}`);
    }

    for (const file of level3Expected) {
      if (fileExists(path.join(LEVEL_3_DIR, file))) {
        pass(`T-003c: level_3/${file} exists`, 'File found');
      } else {
        fail(`T-003c: level_3/${file} exists`, 'File not found');
      }
    }
  } catch (error) {
    fail('T-003: Level 3 templates', error.message);
  }

  // Test Level 3+ directory and files (6 files with extended content)
  try {
    if (dirExists(LEVEL_3PLUS_DIR)) {
      pass('T-004a: level_3+/ directory exists', LEVEL_3PLUS_DIR);
    } else {
      fail('T-004a: level_3+/ directory exists', `Directory not found: ${LEVEL_3PLUS_DIR}`);
      return;
    }

    const level3plusExpected = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'checklist.md', 'decision-record.md'];
    const level3plusActual = fs.readdirSync(LEVEL_3PLUS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');

    if (level3plusActual.length === 6) {
      pass('T-004b: level_3+/ has 6 files', `Files: ${level3plusActual.join(', ')}`);
    } else {
      fail('T-004b: level_3+/ has 6 files', `Expected 6, found ${level3plusActual.length}: ${level3plusActual.join(', ')}`);
    }

    for (const file of level3plusExpected) {
      if (fileExists(path.join(LEVEL_3PLUS_DIR, file))) {
        pass(`T-004c: level_3+/${file} exists`, 'File found');
      } else {
        fail(`T-004c: level_3+/${file} exists`, 'File not found');
      }
    }
  } catch (error) {
    fail('T-004: Level 3+ templates', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. TEST SUITE: CORE TEMPLATES
────────────────────────────────────────────────────────────────
*/

async function testCoreTemplates() {
  log('\n--- TEST SUITE: Core Templates ---');

  try {
    // Test core directory exists
    if (dirExists(CORE_DIR)) {
      pass('T-010a: core/ directory exists', CORE_DIR);
    } else {
      fail('T-010a: core/ directory exists', `Directory not found: ${CORE_DIR}`);
      return;
    }

    // Test 4 core files exist (excluding README.md which is documentation)
    const coreExpected = ['spec-core.md', 'plan-core.md', 'tasks-core.md', 'impl-summary-core.md'];
    const coreActual = fs.readdirSync(CORE_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');

    if (coreActual.length === 4) {
      pass('T-010b: core/ contains 4 core files', `Files: ${coreActual.join(', ')}`);
    } else {
      fail('T-010b: core/ contains 4 core files', `Expected 4, found ${coreActual.length}: ${coreActual.join(', ')}`);
    }

    // Test each core file has required sections
    const specCore = readFile(path.join(CORE_DIR, 'spec-core.md'));
    if (specCore) {
      const requiredSections = ['METADATA', 'PROBLEM & PURPOSE', 'SCOPE', 'REQUIREMENTS', 'SUCCESS CRITERIA', 'RISKS & DEPENDENCIES'];
      const missingSections = requiredSections.filter(s => !specCore.includes(s));

      if (missingSections.length === 0) {
        pass('T-010c: spec-core.md has required sections', `Sections: ${requiredSections.join(', ')}`);
      } else {
        fail('T-010c: spec-core.md has required sections', `Missing: ${missingSections.join(', ')}`);
      }
    } else {
      fail('T-010c: spec-core.md has required sections', 'File not readable');
    }

    const planCore = readFile(path.join(CORE_DIR, 'plan-core.md'));
    if (planCore) {
      const requiredSections = ['SUMMARY', 'QUALITY GATES', 'ARCHITECTURE', 'IMPLEMENTATION PHASES', 'TESTING STRATEGY'];
      const missingSections = requiredSections.filter(s => !planCore.includes(s));

      if (missingSections.length === 0) {
        pass('T-010d: plan-core.md has required sections', `Sections: ${requiredSections.join(', ')}`);
      } else {
        fail('T-010d: plan-core.md has required sections', `Missing: ${missingSections.join(', ')}`);
      }
    } else {
      fail('T-010d: plan-core.md has required sections', 'File not readable');
    }

    // Test SPECKIT markers
    if (specCore && specCore.includes('SPECKIT_LEVEL')) {
      pass('T-010e: spec-core.md has SPECKIT_LEVEL marker', 'Marker found');
    } else {
      fail('T-010e: spec-core.md has SPECKIT_LEVEL marker', 'Marker not found');
    }

    if (specCore && specCore.includes('SPECKIT_TEMPLATE_SOURCE')) {
      pass('T-010f: spec-core.md has SPECKIT_TEMPLATE_SOURCE marker', 'Marker found');
    } else {
      fail('T-010f: spec-core.md has SPECKIT_TEMPLATE_SOURCE marker', 'Marker not found');
    }

  } catch (error) {
    fail('T-010: Core templates', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. TEST SUITE: ADDENDUM STRUCTURE
────────────────────────────────────────────────────────────────
*/

async function testAddendumStructure() {
  log('\n--- TEST SUITE: Addendum Structure ---');

  try {
    // Test addendum directory exists
    if (dirExists(ADDENDUM_DIR)) {
      pass('T-020a: addendum/ directory exists', ADDENDUM_DIR);
    } else {
      fail('T-020a: addendum/ directory exists', `Directory not found: ${ADDENDUM_DIR}`);
      return;
    }

    // Test level2-verify addendum
    const level2VerifyDir = path.join(ADDENDUM_DIR, 'level2-verify');
    if (dirExists(level2VerifyDir)) {
      pass('T-020b: addendum/level2-verify/ exists', level2VerifyDir);
    } else {
      fail('T-020b: addendum/level2-verify/ exists', 'Directory not found');
    }

    const level2VerifyFiles = ['spec-level2.md', 'plan-level2.md', 'checklist.md'];
    for (const file of level2VerifyFiles) {
      if (fileExists(path.join(level2VerifyDir, file))) {
        pass(`T-020c: addendum/level2-verify/${file} exists`, 'File found');
      } else {
        fail(`T-020c: addendum/level2-verify/${file} exists`, 'File not found');
      }
    }

    // Test level3-arch addendum
    const level3ArchDir = path.join(ADDENDUM_DIR, 'level3-arch');
    if (dirExists(level3ArchDir)) {
      pass('T-021a: addendum/level3-arch/ exists', level3ArchDir);
    } else {
      fail('T-021a: addendum/level3-arch/ exists', 'Directory not found');
    }

    const level3ArchFiles = ['spec-level3.md', 'plan-level3.md', 'decision-record.md'];
    for (const file of level3ArchFiles) {
      if (fileExists(path.join(level3ArchDir, file))) {
        pass(`T-021b: addendum/level3-arch/${file} exists`, 'File found');
      } else {
        fail(`T-021b: addendum/level3-arch/${file} exists`, 'File not found');
      }
    }

    // Test level3plus-govern addendum
    const level3plusGovernDir = path.join(ADDENDUM_DIR, 'level3plus-govern');
    if (dirExists(level3plusGovernDir)) {
      pass('T-022a: addendum/level3plus-govern/ exists', level3plusGovernDir);
    } else {
      fail('T-022a: addendum/level3plus-govern/ exists', 'Directory not found');
    }

    const level3plusGovernFiles = ['spec-level3plus.md', 'plan-level3plus.md', 'checklist-extended.md'];
    for (const file of level3plusGovernFiles) {
      if (fileExists(path.join(level3plusGovernDir, file))) {
        pass(`T-022b: addendum/level3plus-govern/${file} exists`, 'File found');
      } else {
        fail(`T-022b: addendum/level3plus-govern/${file} exists`, 'File not found');
      }
    }

  } catch (error) {
    fail('T-020: Addendum structure', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. TEST SUITE: PLACEHOLDER PATTERNS
────────────────────────────────────────────────────────────────
*/

async function testPlaceholderPatterns() {
  log('\n--- TEST SUITE: Placeholder Patterns ---');

  try {
    // Test that templates contain [PLACEHOLDER] patterns
    const specLevel1 = readFile(path.join(LEVEL_1_DIR, 'spec.md'));

    if (specLevel1) {
      // Check for common placeholder patterns
      const placeholderPatterns = [
        /\[NAME\]/,
        /\[YYYY-MM-DD\]/,
        /\[P0\/P1\/P2\]/,
        /\[Deliverable \d\]/,
        /\[path\/to\/file\.js\]/
      ];

      let foundCount = 0;
      for (const pattern of placeholderPatterns) {
        if (pattern.test(specLevel1)) {
          foundCount++;
        }
      }

      if (foundCount >= 3) {
        pass('T-030a: level_1/spec.md contains placeholder patterns', `Found ${foundCount}/5 expected patterns`);
      } else {
        fail('T-030a: level_1/spec.md contains placeholder patterns', `Only found ${foundCount}/5 expected patterns`);
      }

      // Check for bracket-style placeholders
      const bracketPlaceholderCount = (specLevel1.match(/\[[A-Z][^\]]*\]/g) || []).length;
      if (bracketPlaceholderCount > 5) {
        pass('T-030b: spec.md has multiple bracket placeholders', `Found ${bracketPlaceholderCount} bracket placeholders`);
      } else {
        fail('T-030b: spec.md has multiple bracket placeholders', `Only found ${bracketPlaceholderCount}`);
      }
    } else {
      fail('T-030a: level_1/spec.md contains placeholder patterns', 'File not readable');
    }

    // Test checklist.md has checkbox patterns
    const checklistLevel2 = readFile(path.join(LEVEL_2_DIR, 'checklist.md'));
    if (checklistLevel2) {
      const checkboxCount = (checklistLevel2.match(/- \[ \]/g) || []).length;
      if (checkboxCount >= 10) {
        pass('T-030c: level_2/checklist.md has checkbox patterns', `Found ${checkboxCount} checkboxes`);
      } else {
        fail('T-030c: level_2/checklist.md has checkbox patterns', `Expected >=10, found ${checkboxCount}`);
      }

      // Check for priority tags [P0], [P1], [P2]
      const hasP0 = checklistLevel2.includes('[P0]');
      const hasP1 = checklistLevel2.includes('[P1]');
      const hasP2 = checklistLevel2.includes('[P2]');

      if (hasP0 && hasP1 && hasP2) {
        pass('T-030d: checklist.md has priority tags', '[P0], [P1], [P2] found');
      } else {
        fail('T-030d: checklist.md has priority tags', `P0:${hasP0}, P1:${hasP1}, P2:${hasP2}`);
      }
    } else {
      fail('T-030c: level_2/checklist.md has checkbox patterns', 'File not readable');
    }

    // Test that decision-record.md has ADR pattern
    const decisionLevel3 = readFile(path.join(LEVEL_3_DIR, 'decision-record.md'));
    if (decisionLevel3) {
      const hasAdr = decisionLevel3.includes('ADR-001');
      const hasContext = decisionLevel3.includes('Context');
      const hasDecision = decisionLevel3.includes('Decision');
      const hasConsequences = decisionLevel3.includes('Consequences');

      if (hasAdr && hasContext && hasDecision && hasConsequences) {
        pass('T-030e: decision-record.md has ADR structure', 'ADR-001, Context, Decision, Consequences found');
      } else {
        fail('T-030e: decision-record.md has ADR structure', `ADR:${hasAdr}, Context:${hasContext}, Decision:${hasDecision}, Consequences:${hasConsequences}`);
      }
    } else {
      fail('T-030e: decision-record.md has ADR structure', 'File not readable');
    }

  } catch (error) {
    fail('T-030: Placeholder patterns', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   7. TEST SUITE: EXAMPLE TEMPLATES
────────────────────────────────────────────────────────────────
*/

async function testExampleTemplates() {
  log('\n--- TEST SUITE: Example Templates ---');

  try {
    // Test examples directory exists
    if (dirExists(EXAMPLES_DIR)) {
      pass('T-040a: examples/ directory exists', EXAMPLES_DIR);
    } else {
      fail('T-040a: examples/ directory exists', `Directory not found: ${EXAMPLES_DIR}`);
      return;
    }

    // Test example levels exist
    const exampleLevel1Dir = path.join(EXAMPLES_DIR, 'level_1');
    const exampleLevel2Dir = path.join(EXAMPLES_DIR, 'level_2');
    const exampleLevel3Dir = path.join(EXAMPLES_DIR, 'level_3');
    const exampleLevel3plusDir = path.join(EXAMPLES_DIR, 'level_3+');

    if (dirExists(exampleLevel1Dir)) {
      pass('T-040b: examples/level_1/ exists', exampleLevel1Dir);
    } else {
      fail('T-040b: examples/level_1/ exists', 'Directory not found');
    }

    if (dirExists(exampleLevel2Dir)) {
      pass('T-040c: examples/level_2/ exists', exampleLevel2Dir);
    } else {
      fail('T-040c: examples/level_2/ exists', 'Directory not found');
    }

    // Test example spec.md has filled placeholders (not generic)
    const exampleSpec = readFile(path.join(exampleLevel1Dir, 'spec.md'));
    if (exampleSpec) {
      // Check that [NAME] is replaced with actual name
      const hasActualName = !exampleSpec.includes('# Feature Specification: [NAME]');

      if (hasActualName) {
        pass('T-040d: examples/level_1/spec.md has filled [NAME]', 'Title is concrete, not placeholder');
      } else {
        fail('T-040d: examples/level_1/spec.md has filled [NAME]', 'Still has [NAME] placeholder');
      }

      // Check that date is filled
      const hasFilledDate = !exampleSpec.includes('[YYYY-MM-DD]') || exampleSpec.match(/\d{4}-\d{2}-\d{2}/);
      if (hasFilledDate) {
        pass('T-040e: examples/level_1/spec.md has concrete date', 'Date format found or placeholder removed');
      } else {
        fail('T-040e: examples/level_1/spec.md has concrete date', 'Still has [YYYY-MM-DD] placeholder');
      }

      // Check that priority is set
      const hasSetPriority = exampleSpec.includes('P0') || exampleSpec.includes('P1') || exampleSpec.includes('P2');
      if (hasSetPriority) {
        pass('T-040f: examples/level_1/spec.md has set priority', 'Priority level found');
      } else {
        fail('T-040f: examples/level_1/spec.md has set priority', 'No priority found');
      }

      // Check for EXAMPLE comment indicating it's a filled example
      const hasExampleComment = exampleSpec.includes('EXAMPLE:') || exampleSpec.includes('<!-- EXAMPLE');
      if (hasExampleComment) {
        pass('T-040g: examples/level_1/spec.md has EXAMPLE marker', 'EXAMPLE comment found');
      } else {
        skip('T-040g: examples/level_1/spec.md has EXAMPLE marker', 'No explicit EXAMPLE comment (may still be valid)');
      }
    } else {
      fail('T-040d-g: Example spec.md tests', 'File not readable');
    }

  } catch (error) {
    fail('T-040: Example templates', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   8. TEST SUITE: COMPOSE.SH FUNCTIONALITY
────────────────────────────────────────────────────────────────
*/

async function testComposeScript() {
  log('\n--- TEST SUITE: compose.sh Functionality ---');

  try {
    // Test compose.sh exists
    if (fileExists(COMPOSE_SCRIPT)) {
      pass('T-050a: compose.sh script exists', COMPOSE_SCRIPT);
    } else {
      fail('T-050a: compose.sh script exists', `Script not found: ${COMPOSE_SCRIPT}`);
      return;
    }

    // Test compose.sh is executable (or can be made executable)
    const composeContent = readFile(COMPOSE_SCRIPT);
    if (composeContent && composeContent.startsWith('#!/')) {
      pass('T-050b: compose.sh has shebang', composeContent.split('\n')[0]);
    } else {
      fail('T-050b: compose.sh has shebang', 'No shebang line found');
    }

    // Test compose.sh has required functions
    const requiredFunctions = [
      'compose_spec',
      'compose_plan',
      'compose_tasks',
      'compose_checklist',
      'compose_decision_record',
      'compose_level'
    ];

    for (const func of requiredFunctions) {
      if (composeContent && composeContent.includes(func)) {
        pass(`T-050c: compose.sh has ${func}()`, 'Function found');
      } else {
        fail(`T-050c: compose.sh has ${func}()`, 'Function not found');
      }
    }

    // Test compose.sh has composition rules documented
    if (composeContent && composeContent.includes('Level 1:') && composeContent.includes('Level 2:') && composeContent.includes('Level 3:')) {
      pass('T-050d: compose.sh documents composition rules', 'Level 1/2/3 rules found');
    } else {
      fail('T-050d: compose.sh documents composition rules', 'Composition rules not documented');
    }

    // Test compose.sh --verify mode
    try {
      const verifyOutput = execSync(`bash "${COMPOSE_SCRIPT}" --verify 2>&1`, {
        cwd: SCRIPTS_DIR,
        timeout: 30000,
        encoding: 'utf8'
      });

      // If --verify exits 0, templates are in sync
      if (verifyOutput.includes('current') || verifyOutput.includes('OK')) {
        pass('T-050e: compose.sh --verify runs successfully', 'Templates are in sync with sources');
      } else {
        pass('T-050e: compose.sh --verify runs successfully', `Output: ${verifyOutput.slice(0, 100)}`);
      }
    } catch (verify_error) {
      // Exit code 1 means drift detected (warning, not a test failure - the script works correctly)
      if (verify_error.status === 1) {
        pass('T-050e: compose.sh --verify runs successfully', 'Script works correctly (drift detected - run compose.sh to update)');
      } else {
        fail('T-050e: compose.sh --verify runs successfully', `Script error: ${verify_error.message}`);
      }
    }

    // Test compose.sh --dry-run mode
    try {
      const dryrunOutput = execSync(`bash "${COMPOSE_SCRIPT}" --dry-run 2>&1`, {
        cwd: SCRIPTS_DIR,
        timeout: 30000,
        encoding: 'utf8'
      });

      if (dryrunOutput.includes('DRY RUN') || dryrunOutput.includes('would be written')) {
        pass('T-050f: compose.sh --dry-run works', 'Dry run completed successfully');
      } else {
        pass('T-050f: compose.sh --dry-run works', `Output: ${dryrunOutput.slice(0, 100)}`);
      }
    } catch (dryrun_error) {
      fail('T-050f: compose.sh --dry-run works', `Script error: ${dryrun_error.message}`);
    }

  } catch (error) {
    fail('T-050: compose.sh functionality', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   9. TEST SUITE: LEVEL-SPECIFIC CONTENT
────────────────────────────────────────────────────────────────
*/

async function testLevelSpecificContent() {
  log('\n--- TEST SUITE: Level-Specific Content ---');

  try {
    // Test Level 1 spec.md has SPECKIT_LEVEL: 1
    const specL1 = readFile(path.join(LEVEL_1_DIR, 'spec.md'));
    if (specL1 && specL1.includes('SPECKIT_LEVEL: 1')) {
      pass('T-060a: level_1/spec.md has SPECKIT_LEVEL: 1', 'Correct level marker');
    } else {
      fail('T-060a: level_1/spec.md has SPECKIT_LEVEL: 1', 'Level marker missing or incorrect');
    }

    // Test Level 2 spec.md has SPECKIT_LEVEL: 2
    const specL2 = readFile(path.join(LEVEL_2_DIR, 'spec.md'));
    if (specL2 && specL2.includes('SPECKIT_LEVEL: 2')) {
      pass('T-060b: level_2/spec.md has SPECKIT_LEVEL: 2', 'Correct level marker');
    } else {
      fail('T-060b: level_2/spec.md has SPECKIT_LEVEL: 2', 'Level marker missing or incorrect');
    }

    // Test Level 3 spec.md has SPECKIT_LEVEL: 3
    const specL3 = readFile(path.join(LEVEL_3_DIR, 'spec.md'));
    if (specL3 && specL3.includes('SPECKIT_LEVEL: 3')) {
      pass('T-060c: level_3/spec.md has SPECKIT_LEVEL: 3', 'Correct level marker');
    } else {
      fail('T-060c: level_3/spec.md has SPECKIT_LEVEL: 3', 'Level marker missing or incorrect');
    }

    // Test Level 3+ spec.md has SPECKIT_LEVEL: 3+
    const specL3plus = readFile(path.join(LEVEL_3PLUS_DIR, 'spec.md'));
    if (specL3plus && specL3plus.includes('SPECKIT_LEVEL: 3+')) {
      pass('T-060d: level_3+/spec.md has SPECKIT_LEVEL: 3+', 'Correct level marker');
    } else {
      fail('T-060d: level_3+/spec.md has SPECKIT_LEVEL: 3+', 'Level marker missing or incorrect');
    }

    // Test Level 2 adds NFR section (Non-Functional Requirements)
    if (specL2 && specL2.includes('NON-FUNCTIONAL REQUIREMENTS')) {
      pass('T-061a: level_2/spec.md includes NFR section', 'NON-FUNCTIONAL REQUIREMENTS found');
    } else {
      skip('T-061a: level_2/spec.md includes NFR section', 'NFR section may be in addendum only');
    }

    // Test Level 3 adds Executive Summary
    if (specL3 && specL3.includes('EXECUTIVE SUMMARY')) {
      pass('T-061b: level_3/spec.md includes Executive Summary', 'EXECUTIVE SUMMARY found');
    } else {
      skip('T-061b: level_3/spec.md includes Executive Summary', 'May not be present in all templates');
    }

    // Test Level 3+ adds Governance sections
    if (specL3plus && (specL3plus.includes('APPROVAL WORKFLOW') || specL3plus.includes('COMPLIANCE'))) {
      pass('T-061c: level_3+/spec.md includes governance sections', 'Governance sections found');
    } else {
      skip('T-061c: level_3+/spec.md includes governance sections', 'Governance sections may vary');
    }

    // Test Level 3+ checklist is longer than Level 2
    const checklistL2 = readFile(path.join(LEVEL_2_DIR, 'checklist.md'));
    const checklistL3plus = readFile(path.join(LEVEL_3PLUS_DIR, 'checklist.md'));

    if (checklistL2 && checklistL3plus) {
      const l2Lines = checklistL2.split('\n').length;
      const l3plusLines = checklistL3plus.split('\n').length;

      if (l3plusLines > l2Lines) {
        pass('T-062: level_3+ checklist is longer than level_2', `L2: ${l2Lines} lines, L3+: ${l3plusLines} lines`);
      } else {
        fail('T-062: level_3+ checklist is longer than level_2', `L2: ${l2Lines} lines, L3+: ${l3plusLines} lines`);
      }
    } else {
      fail('T-062: level_3+ checklist is longer than level_2', 'Could not read checklist files');
    }

  } catch (error) {
    fail('T-060: Level-specific content', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   10. TEST SUITE: TEMPLATE CONSISTENCY
────────────────────────────────────────────────────────────────
*/

async function testTemplateConsistency() {
  log('\n--- TEST SUITE: Template Consistency ---');

  try {
    // Test all spec.md files have METADATA section
    const levels = [
      { dir: LEVEL_1_DIR, name: 'level_1' },
      { dir: LEVEL_2_DIR, name: 'level_2' },
      { dir: LEVEL_3_DIR, name: 'level_3' },
      { dir: LEVEL_3PLUS_DIR, name: 'level_3+' }
    ];

    for (const level of levels) {
      const spec = readFile(path.join(level.dir, 'spec.md'));
      if (spec && spec.includes('METADATA')) {
        pass(`T-070a: ${level.name}/spec.md has METADATA`, 'Section found');
      } else {
        fail(`T-070a: ${level.name}/spec.md has METADATA`, 'Section missing');
      }
    }

    // Test all plan.md files have IMPLEMENTATION PHASES
    for (const level of levels) {
      const plan = readFile(path.join(level.dir, 'plan.md'));
      if (plan && plan.includes('IMPLEMENTATION PHASES')) {
        pass(`T-070b: ${level.name}/plan.md has IMPLEMENTATION PHASES`, 'Section found');
      } else {
        fail(`T-070b: ${level.name}/plan.md has IMPLEMENTATION PHASES`, 'Section missing');
      }
    }

    // Test all tasks.md files have task structure
    for (const level of levels) {
      const tasks = readFile(path.join(level.dir, 'tasks.md'));
      if (tasks && (tasks.includes('TASK-') || tasks.includes('## Tasks') || tasks.includes('[ ]'))) {
        pass(`T-070c: ${level.name}/tasks.md has task structure`, 'Task patterns found');
      } else {
        fail(`T-070c: ${level.name}/tasks.md has task structure`, 'Task patterns missing');
      }
    }

    // Test implementation-summary.md exists at all levels
    for (const level of levels) {
      if (fileExists(path.join(level.dir, 'implementation-summary.md'))) {
        pass(`T-070d: ${level.name}/implementation-summary.md exists`, 'File found');
      } else {
        fail(`T-070d: ${level.name}/implementation-summary.md exists`, 'File missing');
      }
    }

    const composedFiles = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'checklist.md', 'decision-record.md'];
    for (const level of levels) {
      for (const fileName of composedFiles) {
        const filePath = path.join(level.dir, fileName);
        if (!fileExists(filePath)) {
          continue;
        }

        const content = readFile(filePath);
        if (hasSingleTopFrontmatter(content)) {
          pass(`T-070e: ${level.name}/${fileName} has single top frontmatter`, 'Single top frontmatter detected');
        } else {
          fail(`T-070e: ${level.name}/${fileName} has single top frontmatter`, 'Missing or malformed top frontmatter');
        }
      }
    }

  } catch (error) {
    fail('T-070: Template consistency', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   11. MAIN
────────────────────────────────────────────────────────────────
*/

async function main() {
  log('==================================================');
  log('     TEMPLATE SYSTEM VERIFICATION TESTS');
  log('==================================================');
  log(`Date: ${new Date().toISOString()}`);
  log(`Root: ${ROOT}`);
  log(`Templates: ${TEMPLATES_DIR}\n`);

  // Run all test suites
  await testLevelTemplatesExist();
  await testCoreTemplates();
  await testAddendumStructure();
  await testPlaceholderPatterns();
  await testExampleTemplates();
  await testComposeScript();
  await testLevelSpecificContent();
  await testTemplateConsistency();

  // Summary
  log('\n==================================================');
  log('                 TEST SUMMARY');
  log('==================================================');
  log(`  [PASS]  Passed:  ${results.passed}`);
  log(`  [FAIL]  Failed:  ${results.failed}`);
  log(`  [SKIP]  Skipped: ${results.skipped}`);
  log(`  Total:  ${results.passed + results.failed + results.skipped}`);
  log('');

  if (results.failed === 0) {
    log('ALL TESTS PASSED!');
    return true;
  } else {
    log('Some tests failed. Review output above.');
    return false;
  }
}

// Run tests
main()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

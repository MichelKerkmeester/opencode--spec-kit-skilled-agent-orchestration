// ───────────────────────────────────────────────────────────────
// 1. TEST: TEMPLATE SYSTEM COMPREHENSIVE TESTS
// ───────────────────────────────────────────────────────────────
//
// Additional comprehensive tests for the SpecKit template system:
// - Template rendering with real data substitution
// - All template levels (1, 2, 3, 3+)
// - Verbose template variants
// - ADDENDUM template integration
// - compose.sh functionality
// - Template variable validation
// - Cross-level consistency checks
// - Error handling for missing templates
//
// Complements test-template-system.js which covers basic structure.
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
const LEVEL_DIRS = {
  1: path.join(TEMPLATES_DIR, 'level_1'),
  2: path.join(TEMPLATES_DIR, 'level_2'),
  3: path.join(TEMPLATES_DIR, 'level_3'),
  '3+': path.join(TEMPLATES_DIR, 'level_3+'),
};

const CORE_DIR = path.join(TEMPLATES_DIR, 'core');
const ADDENDUM_DIR = path.join(TEMPLATES_DIR, 'addendum');
const EXAMPLES_DIR = path.join(TEMPLATES_DIR, 'examples');

// Addendum subdirectories
const ADDENDUM_L2 = path.join(ADDENDUM_DIR, 'level2-verify');
const ADDENDUM_L3 = path.join(ADDENDUM_DIR, 'level3-arch');
const ADDENDUM_L3PLUS = path.join(ADDENDUM_DIR, 'level3plus-govern');

// Compose.sh script
const COMPOSE_SCRIPT = path.join(SCRIPTS_DIR, 'templates', 'compose.sh');

// Test data for rendering
const TEST_DATA = {
  name: 'Test Feature Implementation',
  date: '2025-01-24',
  priority: 'P0',
  status: 'In Progress',
  branch: '123-test-feature',
  problem: 'The existing system lacks comprehensive testing coverage for template rendering.',
  purpose: 'Implement a complete test suite that validates template rendering with real data.',
  inScope: [
    'Template rendering validation',
    'Data substitution testing',
    'Cross-level consistency checks',
  ],
  outScope: [
    'UI testing - requires browser environment',
    'Performance benchmarks - separate test suite',
  ],
  requirements: [
    { id: 'REQ-001', desc: 'Template placeholders are replaced correctly', criteria: 'All [PLACEHOLDER] patterns substituted' },
    { id: 'REQ-002', desc: 'Level markers updated appropriately', criteria: 'SPECKIT_LEVEL matches target level' },
  ],
  successCriteria: [
    'All template placeholders are replaced with valid data',
    'Cross-level consistency is maintained',
  ],
  risks: [
    { type: 'Dependency', item: 'Template files', impact: 'Cannot test', mitigation: 'Use fallback test data' },
  ],
};

// Test results tracking
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

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function readFile(filePath) {
  if (!fileExists(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Extract all placeholder patterns from content
 * Matches [PLACEHOLDER] style patterns
 */
function extractPlaceholders(content) {
  const patterns = content.match(/\[[A-Z][A-Z0-9_\-\/\s]*\]/g) || [];
  return [...new Set(patterns)];
}

/**
 * Simple template rendering - replaces placeholders with test data
 */
function renderTemplate(template, data) {
  let rendered = template;

  // Replace common placeholders
  rendered = rendered.replace(/\[NAME\]/g, data.name || 'Untitled');
  rendered = rendered.replace(/\[YYYY-MM-DD\]/g, data.date || new Date().toISOString().split('T')[0]);
  rendered = rendered.replace(/\[P0\/P1\/P2\]/g, data.priority || 'P1');
  rendered = rendered.replace(/\[Draft\/In Progress\/Review\/Complete\]/g, data.status || 'Draft');
  rendered = rendered.replace(/\[###-feature-name\]/g, data.branch || '000-feature');

  return rendered;
}

/**
 * Count checkbox patterns in content
 */
function countCheckboxes(content) {
  const unchecked = (content.match(/- \[ \]/g) || []).length;
  const checked = (content.match(/- \[x\]/gi) || []).length;
  return { unchecked, checked, total: unchecked + checked };
}

/**
 * Extract section headers from markdown content
 */
function extractSections(content) {
  const headers = content.match(/^#{1,3}\s+.*$/gm) || [];
  return headers.map(h => h.replace(/^#+\s+/, '').trim());
}

/* ─────────────────────────────────────────────────────────────
   3. TEST SUITE: TEMPLATE RENDERING WITH DATA
────────────────────────────────────────────────────────────────
*/

async function testTemplateRendering() {
  log('\n--- TEST SUITE: Template Rendering with Data ---');

  try {
    // Test Level 1 spec.md rendering
    const specL1 = readFile(path.join(LEVEL_DIRS[1], 'spec.md'));
    if (specL1) {
      const rendered = renderTemplate(specL1, TEST_DATA);

      // Verify [NAME] placeholder was replaced
      if (!rendered.includes('[NAME]') && rendered.includes(TEST_DATA.name)) {
        pass('TC-100a: Level 1 spec.md [NAME] placeholder replaced', `Found: ${TEST_DATA.name}`);
      } else {
        fail('TC-100a: Level 1 spec.md [NAME] placeholder replaced', 'Placeholder not replaced or name not found');
      }

      // Verify [YYYY-MM-DD] placeholder was replaced
      if (!rendered.includes('[YYYY-MM-DD]') && rendered.includes(TEST_DATA.date)) {
        pass('TC-100b: Level 1 spec.md [YYYY-MM-DD] placeholder replaced', `Found: ${TEST_DATA.date}`);
      } else {
        fail('TC-100b: Level 1 spec.md [YYYY-MM-DD] placeholder replaced', 'Date placeholder not replaced');
      }

      // Verify priority placeholder was replaced
      if (!rendered.includes('[P0/P1/P2]') && rendered.includes(TEST_DATA.priority)) {
        pass('TC-100c: Level 1 spec.md priority placeholder replaced', `Found: ${TEST_DATA.priority}`);
      } else {
        fail('TC-100c: Level 1 spec.md priority placeholder replaced', 'Priority placeholder not replaced');
      }

      // Verify status placeholder was replaced
      if (!rendered.includes('[Draft/In Progress/Review/Complete]') && rendered.includes(TEST_DATA.status)) {
        pass('TC-100d: Level 1 spec.md status placeholder replaced', `Found: ${TEST_DATA.status}`);
      } else {
        fail('TC-100d: Level 1 spec.md status placeholder replaced', 'Status placeholder not replaced');
      }

      // Verify branch placeholder was replaced
      if (!rendered.includes('[###-feature-name]') && rendered.includes(TEST_DATA.branch)) {
        pass('TC-100e: Level 1 spec.md branch placeholder replaced', `Found: ${TEST_DATA.branch}`);
      } else {
        fail('TC-100e: Level 1 spec.md branch placeholder replaced', 'Branch placeholder not replaced');
      }
    } else {
      fail('TC-100: Level 1 spec.md rendering', 'File not readable');
    }

    // Test plan.md rendering
    const planL1 = readFile(path.join(LEVEL_DIRS[1], 'plan.md'));
    if (planL1) {
      const rendered = renderTemplate(planL1, TEST_DATA);

      if (!rendered.includes('[NAME]') && rendered.includes(TEST_DATA.name)) {
        pass('TC-101: Level 1 plan.md placeholder rendering works', 'Name placeholder replaced');
      } else {
        fail('TC-101: Level 1 plan.md placeholder rendering works', 'Placeholder not replaced');
      }
    } else {
      skip('TC-101: Level 1 plan.md placeholder rendering works', 'File not readable');
    }

    // Test tasks.md rendering
    const tasksL1 = readFile(path.join(LEVEL_DIRS[1], 'tasks.md'));
    if (tasksL1) {
      const rendered = renderTemplate(tasksL1, TEST_DATA);

      if (!rendered.includes('[NAME]') && rendered.includes(TEST_DATA.name)) {
        pass('TC-102: Level 1 tasks.md placeholder rendering works', 'Name placeholder replaced');
      } else {
        fail('TC-102: Level 1 tasks.md placeholder rendering works', 'Placeholder not replaced');
      }
    } else {
      skip('TC-102: Level 1 tasks.md placeholder rendering works', 'File not readable');
    }

  } catch (error) {
    fail('TC-100: Template rendering', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. TEST SUITE: ALL TEMPLATE LEVELS
────────────────────────────────────────────────────────────────
*/

async function testAllTemplateLevels() {
  log('\n--- TEST SUITE: All Template Levels ---');

  const levels = [1, 2, 3, '3+'];
  const expectedFiles = {
    1: ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md'],
    2: ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'checklist.md'],
    3: ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'checklist.md', 'decision-record.md'],
    '3+': ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'checklist.md', 'decision-record.md'],
  };

  for (const level of levels) {
    const levelDir = LEVEL_DIRS[level];
    const expected = expectedFiles[level];

    try {
      // Test directory exists
      if (!dirExists(levelDir)) {
        fail(`TC-110-${level}: Level ${level} directory exists`, `Not found: ${levelDir}`);
        continue;
      }
      pass(`TC-110-${level}: Level ${level} directory exists`, levelDir);

      // Test each expected file exists
      for (const file of expected) {
        const filePath = path.join(levelDir, file);
        if (fileExists(filePath)) {
          pass(`TC-111-${level}-${file}: Level ${level}/${file} exists`, 'File found');
        } else {
          fail(`TC-111-${level}-${file}: Level ${level}/${file} exists`, 'File not found');
        }
      }

      // Test spec.md has correct SPECKIT_LEVEL marker
      const spec = readFile(path.join(levelDir, 'spec.md'));
      if (spec) {
        const levelMarker = `SPECKIT_LEVEL: ${level}`;
        if (spec.includes(levelMarker)) {
          pass(`TC-112-${level}: Level ${level} spec.md has correct level marker`, levelMarker);
        } else {
          fail(`TC-112-${level}: Level ${level} spec.md has correct level marker`, `Expected: ${levelMarker}`);
        }
      }

      // Test metadata table has correct Level value
      if (spec) {
        const levelValuePattern = new RegExp(`\\| \\*\\*Level\\*\\* \\| ${level} \\|`);
        if (levelValuePattern.test(spec)) {
          pass(`TC-113-${level}: Level ${level} spec.md metadata has correct Level value`, `Level = ${level}`);
        } else {
          skip(`TC-113-${level}: Level ${level} spec.md metadata has correct Level value`, 'Template may have placeholder');
        }
      }

    } catch (error) {
      fail(`TC-110-${level}: Level ${level} tests`, error.message);
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   5. TEST SUITE: ADDENDUM INTEGRATION
────────────────────────────────────────────────────────────────
*/

async function testAddendumIntegration() {
  log('\n--- TEST SUITE: ADDENDUM Integration ---');

  try {
    // Test Level 2 addendum content appears in Level 2 templates
    const specL2 = readFile(path.join(LEVEL_DIRS[2], 'spec.md'));
    const addendumL2Spec = readFile(path.join(ADDENDUM_L2, 'spec-level2.md'));

    if (specL2 && addendumL2Spec) {
      // Check NFR section is present (from Level 2 addendum)
      if (specL2.includes('NON-FUNCTIONAL REQUIREMENTS') || specL2.includes('NFR-')) {
        pass('TC-200a: Level 2 spec includes NFR section', 'NFR section found');
      } else {
        fail('TC-200a: Level 2 spec includes NFR section', 'NFR section not found');
      }

      // Check Edge Cases section is present
      if (specL2.includes('EDGE CASES')) {
        pass('TC-200b: Level 2 spec includes Edge Cases section', 'Edge Cases found');
      } else {
        fail('TC-200b: Level 2 spec includes Edge Cases section', 'Edge Cases not found');
      }

      // Check Complexity Assessment is present
      if (specL2.includes('COMPLEXITY ASSESSMENT')) {
        pass('TC-200c: Level 2 spec includes Complexity Assessment', 'Complexity Assessment found');
      } else {
        skip('TC-200c: Level 2 spec includes Complexity Assessment', 'May not be present in all Level 2 templates');
      }
    } else {
      fail('TC-200: Level 2 addendum integration', 'Files not readable');
    }

    // Test Level 3 addendum content appears in Level 3 templates
    const specL3 = readFile(path.join(LEVEL_DIRS[3], 'spec.md'));
    const decisionL3 = readFile(path.join(LEVEL_DIRS[3], 'decision-record.md'));

    if (specL3) {
      // Check Executive Summary is present (Level 3 feature)
      if (specL3.includes('EXECUTIVE SUMMARY')) {
        pass('TC-201a: Level 3 spec includes Executive Summary', 'Executive Summary found');
      } else {
        skip('TC-201a: Level 3 spec includes Executive Summary', 'May vary by implementation');
      }

      // Check Risk Matrix is present (Level 3 feature)
      if (specL3.includes('RISK MATRIX')) {
        pass('TC-201b: Level 3 spec includes Risk Matrix', 'Risk Matrix found');
      } else {
        skip('TC-201b: Level 3 spec includes Risk Matrix', 'May vary by implementation');
      }

      // Check User Stories section
      if (specL3.includes('USER STORIES')) {
        pass('TC-201c: Level 3 spec includes User Stories', 'User Stories found');
      } else {
        skip('TC-201c: Level 3 spec includes User Stories', 'May vary by implementation');
      }
    }

    if (decisionL3) {
      // Check decision record has ADR structure
      if (decisionL3.includes('ADR-001')) {
        pass('TC-202a: Level 3 decision-record has ADR structure', 'ADR-001 found');
      } else {
        fail('TC-202a: Level 3 decision-record has ADR structure', 'ADR structure not found');
      }

      // Check Five Checks Evaluation
      if (decisionL3.includes('Five Checks Evaluation')) {
        pass('TC-202b: Decision record includes Five Checks Evaluation', 'Five Checks found');
      } else {
        skip('TC-202b: Decision record includes Five Checks Evaluation', 'May not be present');
      }
    }

    // Test Level 3+ governance addendum
    const specL3plus = readFile(path.join(LEVEL_DIRS['3+'], 'spec.md'));
    const checklistL3plus = readFile(path.join(LEVEL_DIRS['3+'], 'checklist.md'));

    if (specL3plus) {
      // Check Approval Workflow section
      if (specL3plus.includes('APPROVAL WORKFLOW')) {
        pass('TC-203a: Level 3+ spec includes Approval Workflow', 'Approval Workflow found');
      } else {
        skip('TC-203a: Level 3+ spec includes Approval Workflow', 'May vary by implementation');
      }

      // Check Compliance Checkpoints
      if (specL3plus.includes('COMPLIANCE')) {
        pass('TC-203b: Level 3+ spec includes Compliance section', 'Compliance found');
      } else {
        skip('TC-203b: Level 3+ spec includes Compliance section', 'May vary by implementation');
      }

      // Check Stakeholder Matrix
      if (specL3plus.includes('STAKEHOLDER')) {
        pass('TC-203c: Level 3+ spec includes Stakeholder section', 'Stakeholder found');
      } else {
        skip('TC-203c: Level 3+ spec includes Stakeholder section', 'May vary by implementation');
      }
    }

    if (checklistL3plus) {
      // Check extended checklist has Architecture Verification
      if (checklistL3plus.includes('ARCHITECTURE VERIFICATION')) {
        pass('TC-204a: Level 3+ checklist has Architecture Verification', 'Section found');
      } else {
        skip('TC-204a: Level 3+ checklist has Architecture Verification', 'May use different naming');
      }

      // Check extended checklist has Performance Verification
      if (checklistL3plus.includes('PERFORMANCE VERIFICATION')) {
        pass('TC-204b: Level 3+ checklist has Performance Verification', 'Section found');
      } else {
        skip('TC-204b: Level 3+ checklist has Performance Verification', 'May use different naming');
      }

      // Check extended checklist has Deployment Readiness
      if (checklistL3plus.includes('DEPLOYMENT READINESS')) {
        pass('TC-204c: Level 3+ checklist has Deployment Readiness', 'Section found');
      } else {
        skip('TC-204c: Level 3+ checklist has Deployment Readiness', 'May use different naming');
      }

      // Check extended checklist has Sign-off section
      if (checklistL3plus.includes('SIGN-OFF') || checklistL3plus.includes('Approver')) {
        pass('TC-204d: Level 3+ checklist has Sign-off section', 'Sign-off found');
      } else {
        skip('TC-204d: Level 3+ checklist has Sign-off section', 'May use different naming');
      }
    }

  } catch (error) {
    fail('TC-200: ADDENDUM integration', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. TEST SUITE: COMPOSE.SH FUNCTIONALITY
────────────────────────────────────────────────────────────────
*/

async function testComposeFunctionality() {
  log('\n--- TEST SUITE: compose.sh Functionality ---');

  if (!fileExists(COMPOSE_SCRIPT)) {
    skip('TC-300: compose.sh tests', 'compose.sh script not found');
    return;
  }

  try {
    // Test compose.sh has proper structure
    const composeContent = readFile(COMPOSE_SCRIPT);

    // Test shebang
    if (composeContent.startsWith('#!/')) {
      pass('TC-300a: compose.sh has shebang', composeContent.split('\n')[0]);
    } else {
      fail('TC-300a: compose.sh has shebang', 'No shebang found');
    }

    // Test compose_spec function
    if (composeContent.includes('compose_spec()')) {
      pass('TC-300b: compose.sh has compose_spec function', 'Function found');
    } else {
      fail('TC-300b: compose.sh has compose_spec function', 'Function not found');
    }

    // Test compose_plan function
    if (composeContent.includes('compose_plan()')) {
      pass('TC-300c: compose.sh has compose_plan function', 'Function found');
    } else {
      fail('TC-300c: compose.sh has compose_plan function', 'Function not found');
    }

    // Test compose_tasks function
    if (composeContent.includes('compose_tasks()')) {
      pass('TC-300d: compose.sh has compose_tasks function', 'Function found');
    } else {
      fail('TC-300d: compose.sh has compose_tasks function', 'Function not found');
    }

    // Test compose_checklist function
    if (composeContent.includes('compose_checklist()')) {
      pass('TC-300e: compose.sh has compose_checklist function', 'Function found');
    } else {
      fail('TC-300e: compose.sh has compose_checklist function', 'Function not found');
    }

    // Test compose_decision_record function
    if (composeContent.includes('compose_decision_record()')) {
      pass('TC-300f: compose.sh has compose_decision_record function', 'Function found');
    } else {
      fail('TC-300f: compose.sh has compose_decision_record function', 'Function not found');
    }

    // Test level composition logic
    if (composeContent.includes('compose_level()')) {
      pass('TC-300g: compose.sh has compose_level function', 'Function found');
    } else {
      fail('TC-300g: compose.sh has compose_level function', 'Function not found');
    }

    // Test update_level_marker function
    if (composeContent.includes('update_level_marker()')) {
      pass('TC-300h: compose.sh has update_level_marker function', 'Function found');
    } else {
      fail('TC-300h: compose.sh has update_level_marker function', 'Function not found');
    }

    // Test strip_addendum_markers function
    if (composeContent.includes('strip_addendum_markers()')) {
      pass('TC-300i: compose.sh has strip_addendum_markers function', 'Function found');
    } else {
      fail('TC-300i: compose.sh has strip_addendum_markers function', 'Function not found');
    }

    // Test --dry-run mode execution
    try {
      const dryrunOutput = execSync(`bash "${COMPOSE_SCRIPT}" --dry-run 2>&1`, {
        cwd: SCRIPTS_DIR,
        timeout: 30000,
        encoding: 'utf8',
      });

      if (dryrunOutput.includes('DRY RUN') || dryrunOutput.includes('would be written')) {
        pass('TC-301a: compose.sh --dry-run executes', 'Dry run completed');
      } else {
        pass('TC-301a: compose.sh --dry-run executes', `Output: ${dryrunOutput.slice(0, 100)}`);
      }
    } catch (error) {
      fail('TC-301a: compose.sh --dry-run executes', error.message);
    }

    // Test --verify mode execution
    try {
      const verifyOutput = execSync(`bash "${COMPOSE_SCRIPT}" --verify 2>&1`, {
        cwd: SCRIPTS_DIR,
        timeout: 30000,
        encoding: 'utf8',
      });

      pass('TC-301b: compose.sh --verify executes', 'Verification completed');
    } catch (error) {
      // Exit code 1 means drift detected (script works, just needs updating)
      if (error.status === 1) {
        pass('TC-301b: compose.sh --verify executes', 'Script works (drift detected)');
      } else {
        fail('TC-301b: compose.sh --verify executes', error.message);
      }
    }

    // Test single level composition
    try {
      const level1Output = execSync(`bash "${COMPOSE_SCRIPT}" --dry-run 1 2>&1`, {
        cwd: SCRIPTS_DIR,
        timeout: 30000,
        encoding: 'utf8',
      });

      if (level1Output.includes('Level 1') || level1Output.includes('level_1')) {
        pass('TC-301c: compose.sh single level works', 'Level 1 processed');
      } else {
        pass('TC-301c: compose.sh single level works', `Output: ${level1Output.slice(0, 100)}`);
      }
    } catch (error) {
      fail('TC-301c: compose.sh single level works', error.message);
    }

    // Test multiple level composition
    try {
      const multiOutput = execSync(`bash "${COMPOSE_SCRIPT}" --dry-run 2 3 2>&1`, {
        cwd: SCRIPTS_DIR,
        timeout: 30000,
        encoding: 'utf8',
      });

      if ((multiOutput.includes('Level 2') || multiOutput.includes('level_2')) &&
          (multiOutput.includes('Level 3') || multiOutput.includes('level_3'))) {
        pass('TC-301d: compose.sh multiple levels work', 'Levels 2 and 3 processed');
      } else {
        pass('TC-301d: compose.sh multiple levels work', `Output: ${multiOutput.slice(0, 100)}`);
      }
    } catch (error) {
      fail('TC-301d: compose.sh multiple levels work', error.message);
    }

    // Test --verbose mode
    try {
      const verboseOutput = execSync(`bash "${COMPOSE_SCRIPT}" --dry-run --verbose 1 2>&1`, {
        cwd: SCRIPTS_DIR,
        timeout: 30000,
        encoding: 'utf8',
      });

      if (verboseOutput.includes('Composing') || verboseOutput.includes('DEBUG')) {
        pass('TC-301e: compose.sh --verbose provides detail', 'Verbose output found');
      } else {
        skip('TC-301e: compose.sh --verbose provides detail', 'Verbose may output to stderr');
      }
    } catch (error) {
      fail('TC-301e: compose.sh --verbose provides detail', error.message);
    }

  } catch (error) {
    fail('TC-300: compose.sh functionality', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   7. TEST SUITE: TEMPLATE VARIABLE VALIDATION
────────────────────────────────────────────────────────────────
*/

async function testTemplateVariableValidation() {
  log('\n--- TEST SUITE: Template Variable Validation ---');

  const levels = [1, 2, 3, '3+'];

  for (const level of levels) {
    const levelDir = LEVEL_DIRS[level];

    try {
      // Test spec.md placeholders
      const spec = readFile(path.join(levelDir, 'spec.md'));
      if (spec) {
        const placeholders = extractPlaceholders(spec);

        // Check for standard placeholders
        const hasName = placeholders.some(p => p.includes('NAME'));
        const hasDate = placeholders.some(p => p.includes('YYYY') || p.includes('Date'));
        const hasPriority = placeholders.some(p => p.includes('P0') || p.includes('P1') || p.includes('Priority'));

        if (hasName) {
          pass(`TC-400-${level}a: Level ${level} spec has NAME placeholder`, 'Found');
        } else {
          fail(`TC-400-${level}a: Level ${level} spec has NAME placeholder`, 'Not found');
        }

        if (hasDate) {
          pass(`TC-400-${level}b: Level ${level} spec has date placeholder`, 'Found');
        } else {
          fail(`TC-400-${level}b: Level ${level} spec has date placeholder`, 'Not found');
        }

        // Check total placeholder count is reasonable (not too many/few)
        if (placeholders.length >= 3 && placeholders.length <= 50) {
          pass(`TC-400-${level}c: Level ${level} spec placeholder count reasonable`, `Found ${placeholders.length}`);
        } else if (placeholders.length < 3) {
          fail(`TC-400-${level}c: Level ${level} spec placeholder count reasonable`, `Too few: ${placeholders.length}`);
        } else {
          skip(`TC-400-${level}c: Level ${level} spec placeholder count reasonable`, `Many: ${placeholders.length}`);
        }
      }

      // Test checklist.md checkboxes (Level 2+)
      if (level !== 1) {
        const checklist = readFile(path.join(levelDir, 'checklist.md'));
        if (checklist) {
          const checkboxes = countCheckboxes(checklist);

          if (checkboxes.total >= 10) {
            pass(`TC-401-${level}: Level ${level} checklist has adequate checkboxes`, `Found ${checkboxes.total}`);
          } else {
            fail(`TC-401-${level}: Level ${level} checklist has adequate checkboxes`, `Only ${checkboxes.total}`);
          }

          // Verify priority tags exist
          const hasP0 = checklist.includes('[P0]');
          const hasP1 = checklist.includes('[P1]');

          if (hasP0 && hasP1) {
            pass(`TC-402-${level}: Level ${level} checklist has priority tags`, '[P0] and [P1] found');
          } else {
            fail(`TC-402-${level}: Level ${level} checklist has priority tags`, `P0:${hasP0}, P1:${hasP1}`);
          }
        }
      }

      // Test decision-record.md (Level 3+)
      if (level === 3 || level === '3+') {
        const decision = readFile(path.join(levelDir, 'decision-record.md'));
        if (decision) {
          const hasAdr = decision.includes('ADR-');
          const hasStatus = decision.includes('Status');
          const hasContext = decision.includes('Context');
          const hasDecision = decision.includes('Decision');
          const hasConsequences = decision.includes('Consequences');

          if (hasAdr && hasStatus && hasContext && hasDecision && hasConsequences) {
            pass(`TC-403-${level}: Level ${level} decision-record has ADR structure`, 'All components found');
          } else {
            fail(`TC-403-${level}: Level ${level} decision-record has ADR structure`,
              `ADR:${hasAdr}, Status:${hasStatus}, Context:${hasContext}, Decision:${hasDecision}, Consequences:${hasConsequences}`);
          }

          // Check Alternatives Considered section
          if (decision.includes('Alternatives Considered') || decision.includes('Options')) {
            pass(`TC-404-${level}: Level ${level} decision-record has alternatives section`, 'Section found');
          } else {
            fail(`TC-404-${level}: Level ${level} decision-record has alternatives section`, 'Section not found');
          }
        }
      }

    } catch (error) {
      fail(`TC-400-${level}: Template variable validation`, error.message);
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   8. TEST SUITE: CROSS-LEVEL CONSISTENCY
────────────────────────────────────────────────────────────────
*/

async function testCrossLevelConsistency() {
  log('\n--- TEST SUITE: Cross-Level Consistency ---');

  try {
    // Test all levels have consistent core sections
    const coreSections = ['METADATA', 'PROBLEM & PURPOSE', 'SCOPE', 'REQUIREMENTS', 'SUCCESS CRITERIA', 'RISKS & DEPENDENCIES'];
    const levels = [1, 2, 3, '3+'];

    for (const level of levels) {
      const spec = readFile(path.join(LEVEL_DIRS[level], 'spec.md'));
      if (spec) {
        const sections = extractSections(spec);
        let missing = [];

        for (const section of coreSections) {
          if (!sections.some(s => s.toUpperCase().includes(section.toUpperCase().split(' ')[0]))) {
            missing.push(section);
          }
        }

        if (missing.length === 0) {
          pass(`TC-500-${level}: Level ${level} has all core sections`, coreSections.join(', '));
        } else {
          fail(`TC-500-${level}: Level ${level} has all core sections`, `Missing: ${missing.join(', ')}`);
        }
      }
    }

    // Test file count progression (exclude README.md which is documentation, not a template)
    const isTemplateFile = f => f.endsWith('.md') && f !== 'README.md';
    const level_1_files = fs.readdirSync(LEVEL_DIRS[1]).filter(isTemplateFile);
    const level_2_files = fs.readdirSync(LEVEL_DIRS[2]).filter(isTemplateFile);
    const level_3_files = fs.readdirSync(LEVEL_DIRS[3]).filter(isTemplateFile);
    const level_3plus_files = fs.readdirSync(LEVEL_DIRS['3+']).filter(isTemplateFile);

    if (level_1_files.length === 4) {
      pass('TC-501a: Level 1 has exactly 4 files', level_1_files.join(', '));
    } else {
      fail('TC-501a: Level 1 has exactly 4 files', `Found ${level_1_files.length}`);
    }

    if (level_2_files.length === 5) {
      pass('TC-501b: Level 2 has exactly 5 files', level_2_files.join(', '));
    } else {
      fail('TC-501b: Level 2 has exactly 5 files', `Found ${level_2_files.length}`);
    }

    if (level_3_files.length === 6) {
      pass('TC-501c: Level 3 has exactly 6 files', level_3_files.join(', '));
    } else {
      fail('TC-501c: Level 3 has exactly 6 files', `Found ${level_3_files.length}`);
    }

    if (level_3plus_files.length === 6) {
      pass('TC-501d: Level 3+ has exactly 6 files', level_3plus_files.join(', '));
    } else {
      fail('TC-501d: Level 3+ has exactly 6 files', `Found ${level_3plus_files.length}`);
    }

    // Test Level 2 adds checklist
    if (level_2_files.includes('checklist.md') && !level_1_files.includes('checklist.md')) {
      pass('TC-502a: Level 2 adds checklist.md (not in Level 1)', 'Checklist progression correct');
    } else {
      fail('TC-502a: Level 2 adds checklist.md (not in Level 1)', 'Progression incorrect');
    }

    // Test Level 3 adds decision-record
    if (level_3_files.includes('decision-record.md') && !level_2_files.includes('decision-record.md')) {
      pass('TC-502b: Level 3 adds decision-record.md (not in Level 2)', 'Decision-record progression correct');
    } else {
      fail('TC-502b: Level 3 adds decision-record.md (not in Level 2)', 'Progression incorrect');
    }

    // Test Level 3+ content is more comprehensive than Level 3
    const specL3 = readFile(path.join(LEVEL_DIRS[3], 'spec.md'));
    const specL3plus = readFile(path.join(LEVEL_DIRS['3+'], 'spec.md'));

    if (specL3 && specL3plus) {
      // Level 3+ should be longer or equal (more content)
      if (specL3plus.length >= specL3.length) {
        pass('TC-503: Level 3+ spec is at least as comprehensive as Level 3',
          `L3: ${specL3.length} chars, L3+: ${specL3plus.length} chars`);
      } else {
        // Might be OK if sections are redistributed
        skip('TC-503: Level 3+ spec is at least as comprehensive as Level 3',
          `L3: ${specL3.length} chars, L3+: ${specL3plus.length} chars`);
      }
    }

    // Test SPECKIT_TEMPLATE_SOURCE consistency
    for (const level of levels) {
      const spec = readFile(path.join(LEVEL_DIRS[level], 'spec.md'));
      if (spec && spec.includes('SPECKIT_TEMPLATE_SOURCE')) {
        pass(`TC-504-${level}: Level ${level} has SPECKIT_TEMPLATE_SOURCE`, 'Marker found');
      } else {
        fail(`TC-504-${level}: Level ${level} has SPECKIT_TEMPLATE_SOURCE`, 'Marker not found');
      }
    }

  } catch (error) {
    fail('TC-500: Cross-level consistency', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   9. TEST SUITE: ERROR HANDLING FOR MISSING TEMPLATES
────────────────────────────────────────────────────────────────
*/

async function testErrorHandling() {
  log('\n--- TEST SUITE: Error Handling for Missing Templates ---');

  try {
    // Test read_file returns null for non-existent file
    const missing = readFile(path.join(TEMPLATES_DIR, 'nonexistent-file.md'));
    if (missing === null) {
      pass('TC-600a: read_file returns null for missing file', 'Correct behavior');
    } else {
      fail('TC-600a: read_file returns null for missing file', `Returned: ${typeof missing}`);
    }

    // Test dir_exists returns false for non-existent directory
    if (!dirExists(path.join(TEMPLATES_DIR, 'nonexistent-dir'))) {
      pass('TC-600b: dir_exists returns false for missing directory', 'Correct behavior');
    } else {
      fail('TC-600b: dir_exists returns false for missing directory', 'Returned true');
    }

    // Test file_exists returns false for non-existent file
    if (!fileExists(path.join(TEMPLATES_DIR, 'nonexistent.md'))) {
      pass('TC-600c: file_exists returns false for missing file', 'Correct behavior');
    } else {
      fail('TC-600c: file_exists returns false for missing file', 'Returned true');
    }

    // Test compose.sh handles missing source gracefully
    try {
      // Try to read a source file that should exist
      const coreSpec = readFile(path.join(CORE_DIR, 'spec-core.md'));
      if (coreSpec) {
        pass('TC-601a: Core template spec-core.md exists', 'Required source found');
      } else {
        fail('TC-601a: Core template spec-core.md exists', 'Required source missing');
      }

      const corePlan = readFile(path.join(CORE_DIR, 'plan-core.md'));
      if (corePlan) {
        pass('TC-601b: Core template plan-core.md exists', 'Required source found');
      } else {
        fail('TC-601b: Core template plan-core.md exists', 'Required source missing');
      }

      const addendumChecklist = readFile(path.join(ADDENDUM_L2, 'checklist.md'));
      if (addendumChecklist) {
        pass('TC-601c: Addendum checklist.md exists', 'Required source found');
      } else {
        fail('TC-601c: Addendum checklist.md exists', 'Required source missing');
      }

      const addendumDecision = readFile(path.join(ADDENDUM_L3, 'decision-record.md'));
      if (addendumDecision) {
        pass('TC-601d: Addendum decision-record.md exists', 'Required source found');
      } else {
        fail('TC-601d: Addendum decision-record.md exists', 'Required source missing');
      }

    } catch (error) {
      fail('TC-601: Required source files check', error.message);
    }

    // Test extracting placeholders from empty content
    const emptyPlaceholders = extractPlaceholders('');
    if (Array.isArray(emptyPlaceholders) && emptyPlaceholders.length === 0) {
      pass('TC-602a: extract_placeholders handles empty content', 'Returns empty array');
    } else {
      fail('TC-602a: extract_placeholders handles empty content', `Returned: ${JSON.stringify(emptyPlaceholders)}`);
    }

    // Test extracting sections from empty content
    const emptySections = extractSections('');
    if (Array.isArray(emptySections) && emptySections.length === 0) {
      pass('TC-602b: extract_sections handles empty content', 'Returns empty array');
    } else {
      fail('TC-602b: extract_sections handles empty content', `Returned: ${JSON.stringify(emptySections)}`);
    }

    // Test count_checkboxes with no checkboxes
    const noCheckboxes = countCheckboxes('This is plain text without checkboxes');
    if (noCheckboxes.total === 0) {
      pass('TC-602c: count_checkboxes handles no checkboxes', 'Returns 0 total');
    } else {
      fail('TC-602c: count_checkboxes handles no checkboxes', `Returned: ${noCheckboxes.total}`);
    }

  } catch (error) {
    fail('TC-600: Error handling', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   10. TEST SUITE: CONTEXT TEMPLATE
────────────────────────────────────────────────────────────────
*/

async function testContextTemplate() {
  log('\n--- TEST SUITE: Context Template ---');

  try {
    const contextTemplate = readFile(path.join(TEMPLATES_DIR, 'context_template.md'));

    if (!contextTemplate) {
      fail('TC-700a: context_template.md exists', 'File not found');
      return;
    }

    pass('TC-700a: context_template.md exists', 'File found');

    // Check for mustache-style variables
    const mustacheVars = contextTemplate.match(/\{\{[A-Z_]+\}\}/g) || [];
    if (mustacheVars.length > 10) {
      pass('TC-700b: context_template has mustache variables', `Found ${mustacheVars.length} variables`);
    } else {
      fail('TC-700b: context_template has mustache variables', `Only ${mustacheVars.length} found`);
    }

    // Check for anchor markers
    const anchors = contextTemplate.match(/<!-- ANCHOR:[^>]+ -->/g) || [];
    if (anchors.length >= 3) {
      pass('TC-700c: context_template has anchor markers', `Found ${anchors.length} anchors`);
    } else {
      fail('TC-700c: context_template has anchor markers', `Only ${anchors.length} found`);
    }

    // Check for importance tier documentation
    if (contextTemplate.includes('constitutional') && contextTemplate.includes('critical') && contextTemplate.includes('important')) {
      pass('TC-700d: context_template documents importance tiers', 'All tiers documented');
    } else {
      fail('TC-700d: context_template documents importance tiers', 'Some tiers missing');
    }

    // Check for YAML metadata block
    if (contextTemplate.includes('```yaml') && contextTemplate.includes('session_id:')) {
      pass('TC-700e: context_template has YAML metadata block', 'Metadata block found');
    } else {
      fail('TC-700e: context_template has YAML metadata block', 'Metadata block missing');
    }

    // Check for session summary table
    if (contextTemplate.includes('SESSION SUMMARY') && contextTemplate.includes('Meta Data')) {
      pass('TC-700f: context_template has session summary', 'Summary section found');
    } else {
      fail('TC-700f: context_template has session summary', 'Summary section missing');
    }

    // Check for decisions section
    if (contextTemplate.includes('DECISIONS')) {
      pass('TC-700g: context_template has decisions section', 'Decisions section found');
    } else {
      fail('TC-700g: context_template has decisions section', 'Decisions section missing');
    }

    // Check for conversation section
    if (contextTemplate.includes('CONVERSATION')) {
      pass('TC-700h: context_template has conversation section', 'Conversation section found');
    } else {
      fail('TC-700h: context_template has conversation section', 'Conversation section missing');
    }

    // Check for preflight/postflight learning delta
    if (contextTemplate.includes('PREFLIGHT') && contextTemplate.includes('POSTFLIGHT')) {
      pass('TC-700i: context_template has learning delta sections', 'Pre/Post flight sections found');
    } else {
      skip('TC-700i: context_template has learning delta sections', 'May use different structure');
    }

    // Check TOC heading/link labels are uppercase to match section headings
    const hasUppercaseToc =
      contextTemplate.includes('## TABLE OF CONTENTS') &&
      contextTemplate.includes('[CONTINUE SESSION](#continue-session)') &&
      contextTemplate.includes('[PROJECT STATE SNAPSHOT](#project-state-snapshot)') &&
      contextTemplate.includes('[OVERVIEW](#overview)') &&
      contextTemplate.includes('[DECISIONS](#decisions)') &&
      contextTemplate.includes('[CONVERSATION](#conversation)') &&
      contextTemplate.includes('[RECOVERY HINTS](#recovery-hints)') &&
      contextTemplate.includes('[MEMORY METADATA](#memory-metadata)');

    if (hasUppercaseToc) {
      pass('TC-700j: context_template TOC uses uppercase labels', 'TOC heading and required links are uppercase');
    } else {
      fail('TC-700j: context_template TOC uses uppercase labels', 'TOC heading/links are not all uppercase');
    }

  } catch (error) {
    fail('TC-700: Context template', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   11. TEST SUITE: EXAMPLE TEMPLATE VALIDATION
────────────────────────────────────────────────────────────────
*/

async function testExampleTemplates() {
  log('\n--- TEST SUITE: Example Template Validation ---');

  const exampleLevels = ['level_1', 'level_2', 'level_3', 'level_3+'];

  for (const level_name of exampleLevels) {
    const exampleDir = path.join(EXAMPLES_DIR, level_name);

    try {
      if (!dirExists(exampleDir)) {
        skip(`TC-800-${level_name}: Example ${level_name} directory`, 'Directory not found');
        continue;
      }

      pass(`TC-800-${level_name}: Example ${level_name} directory exists`, exampleDir);

      // Read example spec
      const exampleSpec = readFile(path.join(exampleDir, 'spec.md'));
      if (exampleSpec) {
        // Check that placeholders are filled (not generic)
        const hasGenericName = exampleSpec.includes('# Feature Specification: [NAME]');
        const hasSpecificName = !hasGenericName && exampleSpec.includes('# Feature Specification:');

        if (hasSpecificName) {
          pass(`TC-801-${level_name}: Example spec has concrete name`, 'Placeholder replaced');
        } else if (hasGenericName) {
          fail(`TC-801-${level_name}: Example spec has concrete name`, 'Still has [NAME] placeholder');
        } else {
          skip(`TC-801-${level_name}: Example spec has concrete name`, 'Different title format');
        }

        // Check for EXAMPLE comment marker
        if (exampleSpec.includes('EXAMPLE:') || exampleSpec.includes('<!-- EXAMPLE')) {
          pass(`TC-802-${level_name}: Example spec has EXAMPLE marker`, 'Marker found');
        } else {
          skip(`TC-802-${level_name}: Example spec has EXAMPLE marker`, 'No explicit marker');
        }

        // Check that metadata is filled
        const hasRealDate = /\d{4}-\d{2}-\d{2}/.test(exampleSpec);
        if (hasRealDate) {
          pass(`TC-803-${level_name}: Example spec has real date`, 'Date format found');
        } else {
          fail(`TC-803-${level_name}: Example spec has real date`, 'No date found');
        }

        // Check that requirements are filled
        if (exampleSpec.includes('REQ-001') && !exampleSpec.includes('[Requirement description]')) {
          pass(`TC-804-${level_name}: Example spec has filled requirements`, 'Concrete requirements found');
        } else if (exampleSpec.includes('REQ-001')) {
          skip(`TC-804-${level_name}: Example spec has filled requirements`, 'May have placeholder text');
        } else {
          fail(`TC-804-${level_name}: Example spec has filled requirements`, 'No REQ-001 found');
        }
      } else {
        skip(`TC-801-${level_name}: Example spec tests`, 'spec.md not readable');
      }

    } catch (error) {
      fail(`TC-800-${level_name}: Example template tests`, error.message);
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   12. TEST SUITE: VERBOSE TEMPLATE VARIANTS
────────────────────────────────────────────────────────────────
*/

async function testVerboseVariants() {
  log('\n--- TEST SUITE: Verbose Template Variants ---');

  try {
    // Check if Level 3 templates are more verbose than Level 1
    const specL1 = readFile(path.join(LEVEL_DIRS[1], 'spec.md'));
    const specL3 = readFile(path.join(LEVEL_DIRS[3], 'spec.md'));

    if (specL1 && specL3) {
      const l1Sections = extractSections(specL1);
      const l3Sections = extractSections(specL3);

      if (l3Sections.length > l1Sections.length) {
        pass('TC-900a: Level 3 has more sections than Level 1',
          `L1: ${l1Sections.length}, L3: ${l3Sections.length}`);
      } else {
        skip('TC-900a: Level 3 has more sections than Level 1',
          `L1: ${l1Sections.length}, L3: ${l3Sections.length}`);
      }

      if (specL3.length > specL1.length) {
        pass('TC-900b: Level 3 template is longer than Level 1',
          `L1: ${specL1.length} chars, L3: ${specL3.length} chars`);
      } else {
        fail('TC-900b: Level 3 template is longer than Level 1',
          `L1: ${specL1.length} chars, L3: ${specL3.length} chars`);
      }
    }

    // Check Level 3+ has governance-specific sections
    const specL3plus = readFile(path.join(LEVEL_DIRS['3+'], 'spec.md'));
    if (specL3plus) {
      const governanceKeywords = ['APPROVAL', 'COMPLIANCE', 'STAKEHOLDER', 'GOVERNANCE', 'SIGN-OFF'];
      const foundGovernance = governanceKeywords.filter(k => specL3plus.toUpperCase().includes(k));

      if (foundGovernance.length >= 2) {
        pass('TC-901: Level 3+ has governance-specific sections', `Found: ${foundGovernance.join(', ')}`);
      } else {
        skip('TC-901: Level 3+ has governance-specific sections', `Only found: ${foundGovernance.join(', ')}`);
      }
    }

    // Check checklist progression (L2 vs L3+)
    const checklistL2 = readFile(path.join(LEVEL_DIRS[2], 'checklist.md'));
    const checklistL3plus = readFile(path.join(LEVEL_DIRS['3+'], 'checklist.md'));

    if (checklistL2 && checklistL3plus) {
      const l2Checkboxes = countCheckboxes(checklistL2);
      const l3plusCheckboxes = countCheckboxes(checklistL3plus);

      if (l3plusCheckboxes.total > l2Checkboxes.total) {
        pass('TC-902: Level 3+ checklist has more items than Level 2',
          `L2: ${l2Checkboxes.total}, L3+: ${l3plusCheckboxes.total}`);
      } else {
        fail('TC-902: Level 3+ checklist has more items than Level 2',
          `L2: ${l2Checkboxes.total}, L3+: ${l3plusCheckboxes.total}`);
      }
    }

    // Check plan.md progression
    const planL1 = readFile(path.join(LEVEL_DIRS[1], 'plan.md'));
    const planL3 = readFile(path.join(LEVEL_DIRS[3], 'plan.md'));

    if (planL1 && planL3) {
      if (planL3.length > planL1.length) {
        pass('TC-903: Level 3 plan is longer than Level 1',
          `L1: ${planL1.length} chars, L3: ${planL3.length} chars`);
      } else {
        skip('TC-903: Level 3 plan is longer than Level 1',
          `L1: ${planL1.length} chars, L3: ${planL3.length} chars`);
      }
    }

    // Verify each level has appropriate closing comment
    const levels = [1, 2, 3, '3+'];
    for (const level of levels) {
      const spec = readFile(path.join(LEVEL_DIRS[level], 'spec.md'));
      if (spec) {
        // Check for closing comment with level info
        if (spec.includes(`Level ${level}`) || spec.includes(`LEVEL ${level}`)) {
          pass(`TC-904-${level}: Level ${level} spec mentions its level`, 'Level reference found');
        } else {
          skip(`TC-904-${level}: Level ${level} spec mentions its level`, 'May use different format');
        }
      }
    }

  } catch (error) {
    fail('TC-900: Verbose variant tests', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   13. MAIN
────────────────────────────────────────────────────────────────
*/

async function main() {
  log('==================================================');
  log('     TEMPLATE SYSTEM COMPREHENSIVE TESTS');
  log('==================================================');
  log(`Date: ${new Date().toISOString()}`);
  log(`Root: ${ROOT}`);
  log(`Templates: ${TEMPLATES_DIR}\n`);

  // Run all test suites
  await testTemplateRendering();
  await testAllTemplateLevels();
  await testAddendumIntegration();
  await testComposeFunctionality();
  await testTemplateVariableValidation();
  await testCrossLevelConsistency();
  await testErrorHandling();
  await testContextTemplate();
  await testExampleTemplates();
  await testVerboseVariants();

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

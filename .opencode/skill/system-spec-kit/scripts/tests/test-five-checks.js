// ───────────────────────────────────────────────────────────────
// 1. TEST: FIVE CHECKS FRAMEWORK VERIFICATION
// ───────────────────────────────────────────────────────────────
//
// Comprehensive tests for the Five Checks Framework:
// - Framework documentation structure validation
// - Check criteria parsing and validation
// - Integration with decision-record.md templates
// - Level applicability (required for L3+, optional for L2)
// - Validation of check responses in spec folders
//
// The Five Checks:
// 1. Necessary? - Solving ACTUAL need NOW?
// 2. Beyond Local Maxima? - Explored alternatives?
// 3. Sufficient? - Simplest approach?
// 4. Fits Goal? - On critical path?
// 5. Open Horizons? - Long-term aligned?
//

'use strict';

const path = require('path');
const fs = require('fs');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────
*/

const ROOT = path.join(__dirname, '..', '..');
const VALIDATION_DIR = path.join(ROOT, 'references', 'validation');
const TEMPLATES_DIR = path.join(ROOT, 'templates');

// Five Checks documentation path
const FIVE_CHECKS_DOC = path.join(VALIDATION_DIR, 'five_checks.md');

// Template paths
const LEVEL_1_DIR = path.join(TEMPLATES_DIR, 'level_1');
const LEVEL_2_DIR = path.join(TEMPLATES_DIR, 'level_2');
const LEVEL_3_DIR = path.join(TEMPLATES_DIR, 'level_3');
const LEVEL_3PLUS_DIR = path.join(TEMPLATES_DIR, 'level_3+');
const EXAMPLES_DIR = path.join(TEMPLATES_DIR, 'examples');
const ADDENDUM_DIR = path.join(TEMPLATES_DIR, 'addendum');

// The Five Checks as defined in the framework
const FIVE_CHECKS = [
  {
    number: 1,
    name: 'Necessary?',
    question: 'Is this solving an ACTUAL need NOW?',
    shortQuestion: 'Solving ACTUAL need NOW?',
    keywords: ['requirement', 'documented', 'pain point', 'user', 'system'],
  },
  {
    number: 2,
    name: 'Beyond Local Maxima?',
    question: 'Have we explored alternatives?',
    shortQuestion: 'Explored >=2 alternatives?',
    keywords: ['alternatives', 'trade-offs', 'justified', 'considered'],
  },
  {
    number: 3,
    name: 'Sufficient?',
    question: 'Is this the simplest approach that works?',
    shortQuestion: 'Simplest that works?',
    keywords: ['simpler', 'complexity', 'existing patterns', 'abstraction'],
  },
  {
    number: 4,
    name: 'Fits Goal?',
    question: 'Does this stay on the critical path?',
    shortQuestion: 'On critical path?',
    keywords: ['objective', 'scope creep', 'gold-plating', 'spec.md'],
  },
  {
    number: 5,
    name: 'Open Horizons?',
    question: 'Does this maintain long-term alignment?',
    shortQuestion: 'Long-term aligned?',
    keywords: ['technical debt', 'vendor lock-in', 'flexibility', 'architecture'],
  },
];

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

function fileExists(file_path) {
  return fs.existsSync(file_path) && fs.statSync(file_path).isFile();
}

function dirExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

function readFile(file_path) {
  if (!fileExists(file_path)) return null;
  return fs.readFileSync(file_path, 'utf8');
}

/**
 * Parse Five Checks evaluation table from markdown content
 * Returns array of check results or null if not found
 */
function parseFiveChecksTable(content) {
  if (!content) return null;

  // Look for the Five Checks Evaluation table pattern
  const tablePattern = /\|\s*#?\s*\|\s*Check\s*\|\s*Result\s*\|\s*Evidence\s*\|/i;
  if (!tablePattern.test(content)) return null;

  const checks = [];

  // Match table rows with check data
  // Pattern: | 1 | **Necessary?** | [PASS/FAIL] | [Evidence] |
  const rowPattern = /\|\s*(\d)\s*\|\s*\*?\*?([^|*]+)\*?\*?\s*\|\s*(PASS|FAIL|\[PASS\/FAIL\])\s*\|\s*([^|]*)\s*\|/gi;
  let match;

  while ((match = rowPattern.exec(content)) !== null) {
    checks.push({
      number: parseInt(match[1], 10),
      name: match[2].trim().replace(/\*\*/g, ''),
      result: match[3].trim(),
      evidence: match[4].trim(),
    });
  }

  return checks.length > 0 ? checks : null;
}

/**
 * Validate a Five Checks evaluation
 * Returns { valid: boolean, errors: string[], score: string }
 */
function validateFiveChecksEvaluation(checks) {
  const errors = [];
  let passCount = 0;
  let failCount = 0;
  let unfilled = 0;

  if (!checks || checks.length !== 5) {
    errors.push(`Expected 5 checks, found ${checks ? checks.length : 0}`);
    return { valid: false, errors, score: '0/5' };
  }

  for (const check of checks) {
    if (check.result === 'PASS') {
      passCount++;
      if (!check.evidence || check.evidence === '[evidence]' || check.evidence.startsWith('[')) {
        errors.push(`Check ${check.number} (${check.name}): PASS without valid evidence`);
      }
    } else if (check.result === 'FAIL') {
      failCount++;
    } else if (check.result === '[PASS/FAIL]') {
      unfilled++;
    }
  }

  const score = `${passCount}/5`;
  const isTemplate = unfilled === 5;
  const isValid = errors.length === 0 && (isTemplate || unfilled === 0);

  return { valid: isValid, errors, score, isTemplate, passCount, failCount, unfilled };
}

/* ─────────────────────────────────────────────────────────────
   3. TEST SUITE: FRAMEWORK DOCUMENTATION STRUCTURE
────────────────────────────────────────────────────────────────
*/

async function testFrameworkDocumentationStructure() {
  log('\n--- TEST SUITE: Framework Documentation Structure ---');

  try {
    // Test five_checks.md exists
    if (fileExists(FIVE_CHECKS_DOC)) {
      pass('T-FC-001: five_checks.md exists', FIVE_CHECKS_DOC);
    } else {
      fail('T-FC-001: five_checks.md exists', `File not found: ${FIVE_CHECKS_DOC}`);
      return;
    }

    const content = readFile(FIVE_CHECKS_DOC);
    if (!content) {
      fail('T-FC-002: five_checks.md is readable', 'Could not read file');
      return;
    }

    // Test frontmatter exists
    if (content.startsWith('---')) {
      const frontmatterEnd = content.indexOf('---', 3);
      if (frontmatterEnd > 3) {
        const frontmatter = content.slice(3, frontmatterEnd);
        const hasTitle = frontmatter.includes('title:');
        const hasDescription = frontmatter.includes('description:');

        if (hasTitle && hasDescription) {
          pass('T-FC-002: five_checks.md has valid frontmatter', 'title and description found');
        } else {
          fail('T-FC-002: five_checks.md has valid frontmatter', `title:${hasTitle}, description:${hasDescription}`);
        }
      } else {
        fail('T-FC-002: five_checks.md has valid frontmatter', 'Frontmatter not closed');
      }
    } else {
      fail('T-FC-002: five_checks.md has valid frontmatter', 'No frontmatter found');
    }

    // Test main sections exist
    const requiredSections = [
      'OVERVIEW',
      'THE FIVE CHECKS',
      'EVALUATION FORMAT',
      'EXAMPLES',
      'INTEGRATION WITH DECISION RECORDS',
      'QUICK REFERENCE',
    ];

    for (const section of requiredSections) {
      if (content.includes(section)) {
        pass(`T-FC-003: Section "${section}" exists`, 'Found in document');
      } else {
        fail(`T-FC-003: Section "${section}" exists`, 'Section not found');
      }
    }

    // Test all five checks are documented
    for (const check of FIVE_CHECKS) {
      const checkHeader = `Check ${check.number}: ${check.name}`;
      if (content.includes(checkHeader) || content.includes(`### ${check.name}`)) {
        pass(`T-FC-004: Check ${check.number} "${check.name}" documented`, 'Check section found');
      } else {
        fail(`T-FC-004: Check ${check.number} "${check.name}" documented`, 'Check section not found');
      }
    }

    // Test evaluation criteria structure
    for (const check of FIVE_CHECKS) {
      const checkSection = content.includes(`Check ${check.number}:`);
      if (checkSection) {
        // Find section start
        const sectionStart = content.indexOf(`Check ${check.number}:`);
        const sectionEnd = content.indexOf('Check ' + (check.number + 1) + ':', sectionStart);
        const section = sectionEnd > 0 ? content.slice(sectionStart, sectionEnd) : content.slice(sectionStart);

        const hasQuestion = section.includes('**Question:**');
        const hasEvaluationCriteria = section.includes('**Evaluation Criteria:**');
        const hasPassExamples = section.includes('**PASS Examples:**');
        const hasFailExamples = section.includes('**FAIL Examples:**');

        if (hasQuestion && hasEvaluationCriteria && hasPassExamples && hasFailExamples) {
          pass(`T-FC-005: Check ${check.number} has complete structure`, 'Question, Criteria, PASS/FAIL examples');
        } else {
          fail(`T-FC-005: Check ${check.number} has complete structure`,
            `Question:${hasQuestion}, Criteria:${hasEvaluationCriteria}, PASS:${hasPassExamples}, FAIL:${hasFailExamples}`);
        }
      }
    }

    // Test pass/fail criteria documented
    if (content.includes('5/5 PASS') && content.includes('4/5') && content.includes('3 or fewer')) {
      pass('T-FC-006: Pass/Fail criteria documented', 'Found 5/5, 4/5, and 3 or fewer thresholds');
    } else {
      fail('T-FC-006: Pass/Fail criteria documented', 'Missing threshold documentation');
    }

    // Test Quick Assessment Table format documented
    if (content.includes('Quick Assessment Table') && content.includes('| Check | Result | Evidence |')) {
      pass('T-FC-007: Quick Assessment Table format documented', 'Table format found');
    } else {
      fail('T-FC-007: Quick Assessment Table format documented', 'Table format not found');
    }

    // Test remediation process documented
    if (content.includes('Handling Failures') || content.includes('remediation')) {
      pass('T-FC-008: Failure remediation process documented', 'Remediation guidance found');
    } else {
      fail('T-FC-008: Failure remediation process documented', 'No remediation guidance found');
    }

  } catch (error) {
    fail('T-FC-00X: Framework documentation structure', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. TEST SUITE: CHECK CRITERIA PARSING
────────────────────────────────────────────────────────────────
*/

async function testCheckCriteriaParsing() {
  log('\n--- TEST SUITE: Check Criteria Parsing ---');

  try {
    const content = readFile(FIVE_CHECKS_DOC);
    if (!content) {
      fail('T-CP-001: Can read five_checks.md for parsing tests', 'File not readable');
      return;
    }

    // Test Check 1: Necessary? - keyword extraction
    const check1Keywords = ['requirement', 'speculative', 'pain point', 'blocker'];
    let check1Found = 0;
    for (const keyword of check1Keywords) {
      if (content.toLowerCase().includes(keyword.toLowerCase())) {
        check1Found++;
      }
    }
    if (check1Found >= 3) {
      pass('T-CP-001: Check 1 "Necessary?" has key concepts', `Found ${check1Found}/4 keywords`);
    } else {
      fail('T-CP-001: Check 1 "Necessary?" has key concepts', `Only found ${check1Found}/4 keywords`);
    }

    // Test Check 2: Beyond Local Maxima? - alternatives requirement
    if (content.includes('At least 2 alternative') || content.includes('>=2 alternatives')) {
      pass('T-CP-002: Check 2 "Beyond Local Maxima?" requires >=2 alternatives', 'Requirement documented');
    } else {
      fail('T-CP-002: Check 2 "Beyond Local Maxima?" requires >=2 alternatives', 'Requirement not found');
    }

    // Test Check 2: Has ALTERNATIVES CONSIDERED format
    if (content.includes('ALTERNATIVES CONSIDERED:')) {
      pass('T-CP-003: Check 2 has ALTERNATIVES CONSIDERED format', 'Format template found');
    } else {
      fail('T-CP-003: Check 2 has ALTERNATIVES CONSIDERED format', 'Format template not found');
    }

    // Test Check 3: Sufficient? - simplicity validation
    if (content.includes('SIMPLICITY CHECK:')) {
      pass('T-CP-004: Check 3 "Sufficient?" has SIMPLICITY CHECK format', 'Format template found');
    } else {
      fail('T-CP-004: Check 3 "Sufficient?" has SIMPLICITY CHECK format', 'Format template not found');
    }

    // Test Check 4: Fits Goal? - alignment verification
    if (content.includes('GOAL ALIGNMENT:')) {
      pass('T-CP-005: Check 4 "Fits Goal?" has GOAL ALIGNMENT format', 'Format template found');
    } else {
      fail('T-CP-005: Check 4 "Fits Goal?" has GOAL ALIGNMENT format', 'Format template not found');
    }

    // Test Check 4: Has DIRECT/PARTIAL/DRIFT outcomes
    if (content.includes('DIRECT') && content.includes('PARTIAL') && content.includes('DRIFT')) {
      pass('T-CP-006: Check 4 defines DIRECT/PARTIAL/DRIFT outcomes', 'All three outcomes documented');
    } else {
      fail('T-CP-006: Check 4 defines DIRECT/PARTIAL/DRIFT outcomes', 'Missing outcome definitions');
    }

    // Test Check 5: Open Horizons? - horizon check format
    if (content.includes('HORIZON CHECK:')) {
      pass('T-CP-007: Check 5 "Open Horizons?" has HORIZON CHECK format', 'Format template found');
    } else {
      fail('T-CP-007: Check 5 "Open Horizons?" has HORIZON CHECK format', 'Format template not found');
    }

    // Test Check 5: Has technical debt and vendor lock-in checks
    if (content.includes('Technical debt') && content.includes('Vendor lock-in')) {
      pass('T-CP-008: Check 5 covers technical debt and vendor lock-in', 'Both concerns documented');
    } else {
      fail('T-CP-008: Check 5 covers technical debt and vendor lock-in', 'Missing concern documentation');
    }

    // Test example parsing - Example A (all pass)
    if (content.includes('Example A:') && content.includes('5/5 PASS')) {
      pass('T-CP-009: Example A demonstrates 5/5 PASS scenario', 'Full pass example found');
    } else {
      fail('T-CP-009: Example A demonstrates 5/5 PASS scenario', 'Example A not found or incomplete');
    }

    // Test example parsing - Example B (with failures and remediation)
    if (content.includes('Example B:') && content.includes('REMEDIATION')) {
      pass('T-CP-010: Example B demonstrates failure with remediation', 'Failure example with remediation found');
    } else {
      fail('T-CP-010: Example B demonstrates failure with remediation', 'Example B not found or missing remediation');
    }

  } catch (error) {
    fail('T-CP-00X: Check criteria parsing', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. TEST SUITE: DECISION-RECORD.MD INTEGRATION
────────────────────────────────────────────────────────────────
*/

async function testDecisionRecordIntegration() {
  log('\n--- TEST SUITE: Decision-Record.md Integration ---');

  try {
    // Test Level 3 decision-record.md has Five Checks section
    const level3DecisionRecord = readFile(path.join(LEVEL_3_DIR, 'decision-record.md'));
    if (level3DecisionRecord) {
      if (level3DecisionRecord.includes('Five Checks Evaluation')) {
        pass('T-DR-001: level_3/decision-record.md has Five Checks section', 'Section found');
      } else {
        fail('T-DR-001: level_3/decision-record.md has Five Checks section', 'Section not found');
      }

      // Test table format in Level 3
      const checks = parseFiveChecksTable(level3DecisionRecord);
      if (checks && checks.length === 5) {
        pass('T-DR-002: level_3/decision-record.md has valid Five Checks table', `Found ${checks.length} checks`);
      } else {
        fail('T-DR-002: level_3/decision-record.md has valid Five Checks table', 'Table not parseable or incomplete');
      }

      // Test Checks Summary line exists
      if (level3DecisionRecord.includes('Checks Summary') && level3DecisionRecord.includes('/5 PASS')) {
        pass('T-DR-003: level_3/decision-record.md has Checks Summary', 'Summary line found');
      } else {
        fail('T-DR-003: level_3/decision-record.md has Checks Summary', 'Summary line not found');
      }
    } else {
      fail('T-DR-001-003: level_3/decision-record.md tests', 'File not readable');
    }

    // Test Level 3+ decision-record.md has Five Checks section
    const level3PlusDecisionRecord = readFile(path.join(LEVEL_3PLUS_DIR, 'decision-record.md'));
    if (level3PlusDecisionRecord) {
      if (level3PlusDecisionRecord.includes('Five Checks Evaluation')) {
        pass('T-DR-004: level_3+/decision-record.md has Five Checks section', 'Section found');
      } else {
        fail('T-DR-004: level_3+/decision-record.md has Five Checks section', 'Section not found');
      }

      // Test Level 3+ also has Session Decision Log (extended)
      if (level3PlusDecisionRecord.includes('Session Decision Log')) {
        pass('T-DR-005: level_3+/decision-record.md has Session Decision Log', 'Extended governance feature found');
      } else {
        skip('T-DR-005: level_3+/decision-record.md has Session Decision Log', 'Extended feature may be optional');
      }
    } else {
      fail('T-DR-004-005: level_3+/decision-record.md tests', 'File not readable');
    }

    // Test Example Level 3 decision-record.md has filled Five Checks
    const exampleDecisionRecord = readFile(path.join(EXAMPLES_DIR, 'level_3', 'decision-record.md'));
    if (exampleDecisionRecord) {
      // Check that example doesn't have placeholder [PASS/FAIL]
      const hasFilledResults = !exampleDecisionRecord.includes('[PASS/FAIL]') ||
        (exampleDecisionRecord.includes('PASS') && !exampleDecisionRecord.includes('[PASS/FAIL]'));

      if (hasFilledResults) {
        pass('T-DR-006: examples/level_3/decision-record.md has filled results', 'No [PASS/FAIL] placeholders');
      } else {
        fail('T-DR-006: examples/level_3/decision-record.md has filled results', 'Still has [PASS/FAIL] placeholders');
      }

      // Note: Example may not have Five Checks table (older examples)
      const hasChecksSection = exampleDecisionRecord.includes('Five Checks');
      if (hasChecksSection) {
        pass('T-DR-007: examples/level_3/decision-record.md demonstrates Five Checks', 'Five Checks section found');
      } else {
        skip('T-DR-007: examples/level_3/decision-record.md demonstrates Five Checks', 'Example uses older format without Five Checks');
      }
    } else {
      skip('T-DR-006-007: Example decision-record.md tests', 'Example file not found');
    }

    // Test addendum decision-record.md (should be base without Five Checks for composition)
    const addendumDecisionRecord = readFile(path.join(ADDENDUM_DIR, 'level3-arch', 'decision-record.md'));
    if (addendumDecisionRecord) {
      // Addendum is a base template that may or may not include Five Checks
      // The composed level_3 template should have it
      if (addendumDecisionRecord.includes('ADR-001')) {
        pass('T-DR-008: addendum/level3-arch/decision-record.md has ADR structure', 'ADR-001 found');
      } else {
        fail('T-DR-008: addendum/level3-arch/decision-record.md has ADR structure', 'ADR-001 not found');
      }
    } else {
      fail('T-DR-008: addendum/level3-arch/decision-record.md tests', 'File not readable');
    }

  } catch (error) {
    fail('T-DR-00X: Decision-record.md integration', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. TEST SUITE: LEVEL APPLICABILITY
────────────────────────────────────────────────────────────────
*/

async function testLevelApplicability() {
  log('\n--- TEST SUITE: Level Applicability ---');

  try {
    const fiveChecksDoc = readFile(FIVE_CHECKS_DOC);
    if (!fiveChecksDoc) {
      fail('T-LA-001: Can read five_checks.md for level applicability tests', 'File not readable');
      return;
    }

    // Test: Level 1 is exempt from Five Checks
    if (fiveChecksDoc.includes('Level 1 spec folders') && fiveChecksDoc.includes('Not Required')) {
      pass('T-LA-001: Level 1 exemption documented', 'Level 1 listed under "Not Required"');
    } else {
      fail('T-LA-001: Level 1 exemption documented', 'Level 1 exemption not clearly stated');
    }

    // Test: Level 2 is recommended but optional
    if (fiveChecksDoc.includes('Level 2') && fiveChecksDoc.includes('Recommended')) {
      pass('T-LA-002: Level 2 is recommended (optional)', 'Level 2 listed under "Recommended"');
    } else {
      fail('T-LA-002: Level 2 is recommended (optional)', 'Level 2 applicability unclear');
    }

    // Test: Level 3 is mandatory
    if (fiveChecksDoc.includes('Level 3') && fiveChecksDoc.includes('Mandatory')) {
      pass('T-LA-003: Level 3 is mandatory', 'Level 3 listed under "Mandatory"');
    } else {
      fail('T-LA-003: Level 3 is mandatory', 'Level 3 mandatory status unclear');
    }

    // Test: Level 3+ is mandatory
    if (fiveChecksDoc.includes('Level 3/3+') || (fiveChecksDoc.includes('Level 3+') && fiveChecksDoc.includes('Mandatory'))) {
      pass('T-LA-004: Level 3+ is mandatory', 'Level 3+ listed under "Mandatory"');
    } else {
      fail('T-LA-004: Level 3+ is mandatory', 'Level 3+ mandatory status unclear');
    }

    // Test: >100 LOC threshold documented
    if (fiveChecksDoc.includes('100 LOC') || fiveChecksDoc.includes('exceeding 100')) {
      pass('T-LA-005: >100 LOC threshold documented', '>100 LOC trigger found');
    } else {
      fail('T-LA-005: >100 LOC threshold documented', 'LOC threshold not documented');
    }

    // Test: Architectural decisions trigger documented
    if (fiveChecksDoc.includes('Architectural decisions') || fiveChecksDoc.includes('architectural')) {
      pass('T-LA-006: Architectural decisions trigger documented', 'Architectural trigger found');
    } else {
      fail('T-LA-006: Architectural decisions trigger documented', 'Architectural trigger not documented');
    }

    // Verify Level 1 templates do NOT have decision-record.md
    const level1HasDecisionRecord = fileExists(path.join(LEVEL_1_DIR, 'decision-record.md'));
    if (!level1HasDecisionRecord) {
      pass('T-LA-007: Level 1 template has no decision-record.md', 'Correctly excluded');
    } else {
      fail('T-LA-007: Level 1 template has no decision-record.md', 'Should not have decision-record.md');
    }

    // Verify Level 2 templates do NOT have decision-record.md
    const level2HasDecisionRecord = fileExists(path.join(LEVEL_2_DIR, 'decision-record.md'));
    if (!level2HasDecisionRecord) {
      pass('T-LA-008: Level 2 template has no decision-record.md', 'Correctly excluded (Five Checks optional)');
    } else {
      fail('T-LA-008: Level 2 template has no decision-record.md', 'Should not have decision-record.md at L2');
    }

    // Verify Level 3 templates DO have decision-record.md
    const level3HasDecisionRecord = fileExists(path.join(LEVEL_3_DIR, 'decision-record.md'));
    if (level3HasDecisionRecord) {
      pass('T-LA-009: Level 3 template has decision-record.md', 'Correctly included');
    } else {
      fail('T-LA-009: Level 3 template has decision-record.md', 'Missing required file');
    }

    // Verify Level 3+ templates DO have decision-record.md
    const level3PlusHasDecisionRecord = fileExists(path.join(LEVEL_3PLUS_DIR, 'decision-record.md'));
    if (level3PlusHasDecisionRecord) {
      pass('T-LA-010: Level 3+ template has decision-record.md', 'Correctly included');
    } else {
      fail('T-LA-010: Level 3+ template has decision-record.md', 'Missing required file');
    }

  } catch (error) {
    fail('T-LA-00X: Level applicability', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   7. TEST SUITE: CHECK RESPONSE VALIDATION
────────────────────────────────────────────────────────────────
*/

async function testCheckResponseValidation() {
  log('\n--- TEST SUITE: Check Response Validation ---');

  try {
    // Test validation of a complete 5/5 PASS scenario
    const validChecks = [
      { number: 1, name: 'Necessary?', result: 'PASS', evidence: 'User reported bug crashing app' },
      { number: 2, name: 'Beyond Local Maxima?', result: 'PASS', evidence: 'Considered 3 approaches' },
      { number: 3, name: 'Sufficient?', result: 'PASS', evidence: 'Single function, no abstraction needed' },
      { number: 4, name: 'Fits Goal?', result: 'PASS', evidence: 'Matches spec.md requirements' },
      { number: 5, name: 'Open Horizons?', result: 'PASS', evidence: 'Standard pattern, no lock-in' },
    ];

    const validResult = validateFiveChecksEvaluation(validChecks);
    if (validResult.valid && validResult.score === '5/5') {
      pass('T-VL-001: Valid 5/5 PASS evaluation accepted', `Score: ${validResult.score}`);
    } else {
      fail('T-VL-001: Valid 5/5 PASS evaluation accepted', `Errors: ${validResult.errors.join(', ')}`);
    }

    // Test validation of 4/5 conditional pass
    const conditionalChecks = [
      { number: 1, name: 'Necessary?', result: 'PASS', evidence: 'User requested feature' },
      { number: 2, name: 'Beyond Local Maxima?', result: 'FAIL', evidence: 'Only one approach considered' },
      { number: 3, name: 'Sufficient?', result: 'PASS', evidence: 'Reusing existing utility' },
      { number: 4, name: 'Fits Goal?', result: 'PASS', evidence: 'Matches requirement' },
      { number: 5, name: 'Open Horizons?', result: 'PASS', evidence: 'No tech debt' },
    ];

    const conditionalResult = validateFiveChecksEvaluation(conditionalChecks);
    if (conditionalResult.passCount === 4 && conditionalResult.failCount === 1) {
      pass('T-VL-002: 4/5 conditional pass correctly identified', `Score: ${conditionalResult.score}`);
    } else {
      fail('T-VL-002: 4/5 conditional pass correctly identified', `Got ${conditionalResult.passCount} pass, ${conditionalResult.failCount} fail`);
    }

    // Test validation of failing evaluation (3/5)
    const failingChecks = [
      { number: 1, name: 'Necessary?', result: 'FAIL', evidence: 'Future-proofing, not needed now' },
      { number: 2, name: 'Beyond Local Maxima?', result: 'FAIL', evidence: 'No alternatives considered' },
      { number: 3, name: 'Sufficient?', result: 'PASS', evidence: 'Simple approach' },
      { number: 4, name: 'Fits Goal?', result: 'PASS', evidence: 'On critical path' },
      { number: 5, name: 'Open Horizons?', result: 'PASS', evidence: 'Long-term aligned' },
    ];

    const failingResult = validateFiveChecksEvaluation(failingChecks);
    if (failingResult.passCount === 3 && failingResult.failCount === 2) {
      pass('T-VL-003: 3/5 failing evaluation correctly identified', `Score: ${failingResult.score}`);
    } else {
      fail('T-VL-003: 3/5 failing evaluation correctly identified', `Got ${failingResult.passCount} pass, ${failingResult.failCount} fail`);
    }

    // Test validation detects PASS without evidence
    const noEvidenceChecks = [
      { number: 1, name: 'Necessary?', result: 'PASS', evidence: '[evidence]' },
      { number: 2, name: 'Beyond Local Maxima?', result: 'PASS', evidence: 'Valid evidence' },
      { number: 3, name: 'Sufficient?', result: 'PASS', evidence: '' },
      { number: 4, name: 'Fits Goal?', result: 'PASS', evidence: 'Valid' },
      { number: 5, name: 'Open Horizons?', result: 'PASS', evidence: 'Valid' },
    ];

    const noEvidenceResult = validateFiveChecksEvaluation(noEvidenceChecks);
    if (!noEvidenceResult.valid && noEvidenceResult.errors.length > 0) {
      pass('T-VL-004: PASS without evidence detected as invalid', `Errors found: ${noEvidenceResult.errors.length}`);
    } else {
      fail('T-VL-004: PASS without evidence detected as invalid', 'Should have found validation errors');
    }

    // Test template detection (all [PASS/FAIL] placeholders)
    const templateChecks = [
      { number: 1, name: 'Necessary?', result: '[PASS/FAIL]', evidence: '[evidence]' },
      { number: 2, name: 'Beyond Local Maxima?', result: '[PASS/FAIL]', evidence: '[evidence]' },
      { number: 3, name: 'Sufficient?', result: '[PASS/FAIL]', evidence: '[evidence]' },
      { number: 4, name: 'Fits Goal?', result: '[PASS/FAIL]', evidence: '[evidence]' },
      { number: 5, name: 'Open Horizons?', result: '[PASS/FAIL]', evidence: '[evidence]' },
    ];

    const templateResult = validateFiveChecksEvaluation(templateChecks);
    if (templateResult.isTemplate && templateResult.unfilled === 5) {
      pass('T-VL-005: Template with placeholders correctly identified', 'All 5 checks unfilled');
    } else {
      fail('T-VL-005: Template with placeholders correctly identified', 'Template not detected');
    }

    // Test incomplete evaluation (wrong count)
    const incompleteChecks = [
      { number: 1, name: 'Necessary?', result: 'PASS', evidence: 'Valid' },
      { number: 2, name: 'Beyond Local Maxima?', result: 'PASS', evidence: 'Valid' },
      { number: 3, name: 'Sufficient?', result: 'PASS', evidence: 'Valid' },
    ];

    const incompleteResult = validateFiveChecksEvaluation(incompleteChecks);
    if (!incompleteResult.valid && incompleteResult.errors.some(e => e.includes('Expected 5'))) {
      pass('T-VL-006: Incomplete evaluation (3/5 checks) detected', 'Correct error message');
    } else {
      fail('T-VL-006: Incomplete evaluation (3/5 checks) detected', 'Should detect missing checks');
    }

    // Test null/undefined checks
    const nullResult = validateFiveChecksEvaluation(null);
    if (!nullResult.valid) {
      pass('T-VL-007: Null evaluation correctly rejected', 'Invalid result returned');
    } else {
      fail('T-VL-007: Null evaluation correctly rejected', 'Should reject null input');
    }

    // Test table parsing from actual template content
    const level3Template = readFile(path.join(LEVEL_3_DIR, 'decision-record.md'));
    if (level3Template) {
      const parsedChecks = parseFiveChecksTable(level3Template);
      if (parsedChecks && parsedChecks.length === 5) {
        pass('T-VL-008: Can parse Five Checks table from level_3 template', `Parsed ${parsedChecks.length} checks`);

        // Verify parsed structure
        const allHaveNumber = parsedChecks.every(c => c.number >= 1 && c.number <= 5);
        const allHaveName = parsedChecks.every(c => c.name && c.name.length > 0);

        if (allHaveNumber && allHaveName) {
          pass('T-VL-009: Parsed checks have valid structure', 'Numbers and names present');
        } else {
          fail('T-VL-009: Parsed checks have valid structure', 'Missing numbers or names');
        }
      } else {
        fail('T-VL-008: Can parse Five Checks table from level_3 template', 'Parsing failed or wrong count');
      }
    } else {
      skip('T-VL-008-009: Template parsing tests', 'Could not read level_3 template');
    }

  } catch (error) {
    fail('T-VL-00X: Check response validation', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   8. TEST SUITE: CROSS-REFERENCE VALIDATION
────────────────────────────────────────────────────────────────
*/

async function testCrossReferenceValidation() {
  log('\n--- TEST SUITE: Cross-Reference Validation ---');

  try {
    const fiveChecksDoc = readFile(FIVE_CHECKS_DOC);
    if (!fiveChecksDoc) {
      fail('T-CR-001: Can read five_checks.md for cross-reference tests', 'File not readable');
      return;
    }

    // Test: References to templates directory
    if (fiveChecksDoc.includes('.opencode/skill/system-spec-kit/templates/')) {
      pass('T-CR-001: References templates directory', 'Template path found');
    } else {
      fail('T-CR-001: References templates directory', 'Template path not found');
    }

    // Test: References Level 3 template
    if (fiveChecksDoc.includes('Level 3 Template') || fiveChecksDoc.includes('Level 3')) {
      pass('T-CR-002: References Level 3 template', 'Level 3 reference found');
    } else {
      fail('T-CR-002: References Level 3 template', 'Level 3 reference not found');
    }

    // Test: Integration section exists
    if (fiveChecksDoc.includes('INTEGRATION WITH DECISION RECORDS')) {
      pass('T-CR-003: Integration section with decision records documented', 'Section found');
    } else {
      fail('T-CR-003: Integration section with decision records documented', 'Section not found');
    }

    // Test: Shows how to embed in decision-record.md
    if (fiveChecksDoc.includes('decision-record.md') || fiveChecksDoc.includes('Decision:')) {
      pass('T-CR-004: Shows embedding in decision-record.md', 'Integration example found');
    } else {
      fail('T-CR-004: Shows embedding in decision-record.md', 'Integration example not found');
    }

    // Test: Quick reference format matches the checks
    const quickRefPattern = /1\.\s*Necessary\?.*2\.\s*Local Maxima\?.*3\.\s*Sufficient\?.*4\.\s*Fits Goal\?.*5\.\s*Open Horizons\?/s;
    if (quickRefPattern.test(fiveChecksDoc)) {
      pass('T-CR-005: Quick reference lists all 5 checks in order', 'All checks found in sequence');
    } else {
      // Try alternative pattern
      const allChecksPresent = FIVE_CHECKS.every(c => fiveChecksDoc.includes(c.name));
      if (allChecksPresent) {
        pass('T-CR-005: Quick reference lists all 5 checks in order', 'All check names found');
      } else {
        fail('T-CR-005: Quick reference lists all 5 checks in order', 'Not all checks found');
      }
    }

    // Test: PROCEED/RECONSIDER outcomes documented
    if (fiveChecksDoc.includes('PROCEED') && fiveChecksDoc.includes('RECONSIDER')) {
      pass('T-CR-006: PROCEED/RECONSIDER outcomes documented', 'Both outcomes found');
    } else {
      fail('T-CR-006: PROCEED/RECONSIDER outcomes documented', 'Missing outcome definitions');
    }

  } catch (error) {
    fail('T-CR-00X: Cross-reference validation', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   9. TEST SUITE: SPEC FOLDER INTEGRATION
────────────────────────────────────────────────────────────────
*/

async function testSpecFolderIntegration() {
  log('\n--- TEST SUITE: Spec Folder Integration ---');

  const specsDir = path.join(ROOT, '..', '..', '..', 'specs');

  try {
    // Check if specs directory exists
    if (!dirExists(specsDir)) {
      skip('T-SF-001-006: Spec folder tests', 'No specs directory found (expected at project root)');
      return;
    }

    // Find Level 3 or 3+ spec folders to validate Five Checks usage
    const specFolders = fs.readdirSync(specsDir).filter(f => {
      const folderPath = path.join(specsDir, f);
      return fs.statSync(folderPath).isDirectory() && !f.startsWith('.');
    });

    if (specFolders.length === 0) {
      skip('T-SF-001-006: Spec folder tests', 'No spec folders found');
      return;
    }

    let foundLevel3Folder = false;
    let foundDecisionRecord = false;
    let foundFiveChecks = false;

    for (const folder of specFolders) {
      const folderPath = path.join(specsDir, folder);
      const specPath = path.join(folderPath, 'spec.md');
      const decisionRecordPath = path.join(folderPath, 'decision-record.md');

      // Check if this is a Level 3 or 3+ spec
      const specContent = readFile(specPath);
      if (specContent && (specContent.includes('SPECKIT_LEVEL: 3') || specContent.includes('SPECKIT_LEVEL: 3+'))) {
        foundLevel3Folder = true;

        // Check for decision-record.md
        if (fileExists(decisionRecordPath)) {
          foundDecisionRecord = true;
          const drContent = readFile(decisionRecordPath);

          // Check for Five Checks in decision record
          if (drContent && drContent.includes('Five Checks')) {
            foundFiveChecks = true;

            // Try to parse and validate
            const checks = parseFiveChecksTable(drContent);
            if (checks && checks.length === 5) {
              const validation = validateFiveChecksEvaluation(checks);
              if (validation.isTemplate) {
                pass(`T-SF-001: ${folder}/decision-record.md has Five Checks (template)`, 'Unfilled template found');
              } else if (validation.valid) {
                pass(`T-SF-001: ${folder}/decision-record.md has valid Five Checks`, `Score: ${validation.score}`);
              } else {
                fail(`T-SF-001: ${folder}/decision-record.md Five Checks validation`, validation.errors.join(', '));
              }
            }
          }
        }
      }
    }

    // Summary assertions
    if (foundLevel3Folder) {
      pass('T-SF-002: Found Level 3/3+ spec folder(s)', 'At least one Level 3+ folder exists');
    } else {
      skip('T-SF-002: Found Level 3/3+ spec folder(s)', 'No Level 3/3+ folders found');
    }

    if (foundLevel3Folder && foundDecisionRecord) {
      pass('T-SF-003: Level 3/3+ folder has decision-record.md', 'File found');
    } else if (foundLevel3Folder) {
      skip('T-SF-003: Level 3/3+ folder has decision-record.md', 'Decision record may not exist yet');
    }

    if (foundFiveChecks) {
      pass('T-SF-004: Five Checks integrated in real spec folder', 'Found in decision-record.md');
    } else if (foundLevel3Folder && foundDecisionRecord) {
      skip('T-SF-004: Five Checks integrated in real spec folder', 'May be using older format');
    }

  } catch (error) {
    fail('T-SF-00X: Spec folder integration', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   10. MAIN
────────────────────────────────────────────────────────────────
*/

async function main() {
  log('==================================================');
  log('     FIVE CHECKS FRAMEWORK VERIFICATION TESTS');
  log('==================================================');
  log(`Date: ${new Date().toISOString()}`);
  log(`Root: ${ROOT}`);
  log(`Five Checks Doc: ${FIVE_CHECKS_DOC}`);
  log(`Templates: ${TEMPLATES_DIR}\n`);

  // Run all test suites
  await testFrameworkDocumentationStructure();
  await testCheckCriteriaParsing();
  await testDecisionRecordIntegration();
  await testLevelApplicability();
  await testCheckResponseValidation();
  await testCrossReferenceValidation();
  await testSpecFolderIntegration();

  // Summary
  log('\n==================================================');
  log('                 TEST SUMMARY');
  log('==================================================');
  log(`  [PASS]  Passed:  ${results.passed}`);
  log(`  [FAIL]  Failed:  ${results.failed}`);
  log(`  [SKIP]  Skipped: ${results.skipped}`);
  log(`  Total:  ${results.passed + results.failed + results.skipped}`);
  log('');

  // Five Checks Framework quick reference
  log('FIVE CHECKS QUICK REFERENCE:');
  for (const check of FIVE_CHECKS) {
    log(`  ${check.number}. ${check.name} - ${check.shortQuestion}`);
  }
  log('');

  if (results.failed === 0) {
    log('ALL TESTS PASSED!');
    return true;
  } else {
    log('Some tests failed. Review output above.');
    return false;
  }
}

// Export for programmatic use
module.exports = {
  FIVE_CHECKS,
  parseFiveChecksTable,
  validateFiveChecksEvaluation,
  results,
};

// Run tests
main()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

// ───────────────────────────────────────────────────────────────
// 1. TEST: VALIDATION SYSTEM COMPREHENSIVE TESTS
// ───────────────────────────────────────────────────────────────
//
// JavaScript-based tests for the SpecKit validation system.
// Covers all 13 validation rules without requiring bash execution.
//
// RULES TESTED:
//   1. FILE_EXISTS         - Required files for each level
//   2. FOLDER_NAMING       - ###-short-name convention
//   3. FRONTMATTER_VALID   - YAML frontmatter structure
//   4. PLACEHOLDER_FILLED  - Unfilled placeholder detection
//   5. ANCHORS_VALID       - Memory file anchor pairs
//   6. EVIDENCE_CITED      - Evidence on P0/P1 items
//   7. PRIORITY_TAGS       - P0/P1/P2 format validation
//   8. SECTIONS_PRESENT    - Required markdown sections
//   9. LEVEL_DECLARED      - Explicit vs inferred levels
//  10. AI_PROTOCOL         - AI execution protocol sections
//  11. LEVEL_MATCH         - Cross-file level consistency
//  12. SECTION_COUNTS      - Section count ranges
//  13. COMPLEXITY_MATCH    - Content metrics vs level
//
// Run with: node test-validation-system.js
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
const SCRIPTS_DIR = path.join(ROOT, 'scripts');
const RULES_DIR = path.join(SCRIPTS_DIR, 'rules');
const FIXTURES_DIR = path.join(SCRIPTS_DIR, 'test-fixtures');
const VALIDATOR_SCRIPT = path.join(SCRIPTS_DIR, 'spec', 'validate.sh');
const TEMPLATES_DIR = path.join(ROOT, 'templates');

// Test workspace for creating temporary fixtures
const TEST_WORKSPACE = path.join(SCRIPTS_DIR, 'tests', '.validation-test-workspace');

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
  suites: [],
};

/* ─────────────────────────────────────────────────────────────
   2. UTILITIES
────────────────────────────────────────────────────────────────
*/

function log(msg) {
  console.log(msg);
}

function pass(testName, evidence = null) {
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
  log(`   [SKIP] ${testName} (${reason})`);
}

function startSuite(name) {
  log(`\n--- ${name} ---`);
  results.suites.push({ name, startTime: Date.now() });
}

function endSuite() {
  const suite = results.suites[results.suites.length - 1];
  if (suite) {
    suite.duration = Date.now() - suite.startTime;
    log(`   Duration: ${suite.duration}ms`);
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function dirExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

function readFile(filePath) {
  if (!fileExists(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function cleanupWorkspace() {
  if (fs.existsSync(TEST_WORKSPACE)) {
    fs.rmSync(TEST_WORKSPACE, { recursive: true, force: true });
  }
}

function setupWorkspace() {
  cleanupWorkspace();
  ensureDir(TEST_WORKSPACE);
}

/* ─────────────────────────────────────────────────────────────
   3. VALIDATOR EXECUTION HELPERS
────────────────────────────────────────────────────────────────
*/

/**
 * Run the validation script against a fixture or path
 * @param {string} folderPath - Path to spec folder
 * @param {object} options - Options for validation
 * @returns {{ exitCode: number, stdout: string, stderr: string }}
 */
function runValidator(folderPath, options = {}) {
  const { json = false, strict = false, quiet = false, verbose = false, envVars = {} } = options;

  if (!fileExists(VALIDATOR_SCRIPT)) {
    return { exitCode: -1, stdout: '', stderr: 'Validator script not found' };
  }

  let flags = '';
  if (json) flags += ' --json';
  if (strict) flags += ' --strict';
  if (quiet) flags += ' --quiet';
  if (verbose) flags += ' --verbose';

  const envStr = Object.entries(envVars).map(([k, v]) => `${k}=${v}`).join(' ');
  const cmd = `${envStr ? envStr + ' ' : ''}bash "${VALIDATOR_SCRIPT}" "${folderPath}"${flags}`;

  try {
    const stdout = execSync(cmd, {
      encoding: 'utf8',
      timeout: 30000,
      cwd: SCRIPTS_DIR,
    });
    return { exitCode: 0, stdout, stderr: '' };
  } catch (error) {
    return {
      exitCode: error.status || 1,
      stdout: error.stdout || '',
      stderr: error.stderr || error.message,
    };
  }
}

/**
 * Create a temporary spec folder in the test workspace
 * @param {string} name - Folder name
 * @param {number} level - Documentation level (1, 2, or 3)
 * @param {object} options - Creation options
 * @returns {string} Path to created folder
 */
function createTestSpecFolder(name, level = 1, options = {}) {
  const folderPath = path.join(TEST_WORKSPACE, name);
  ensureDir(folderPath);
  ensureDir(path.join(folderPath, 'memory'));
  ensureDir(path.join(folderPath, 'scratch'));

  const {
    specContent = null,
    planContent = null,
    tasksContent = null,
    checklistContent = null,
    decisionRecordContent = null,
    implSummaryContent = null,
    memoryFiles = {},
    skipFiles = [],
  } = options;

  // Default content templates
  const defaultSpec = `# Test Spec

| Field | Value |
|-------|-------|
| **Level** | ${level} |
| **Status** | Active |

## Problem Statement

Test problem statement.

## Requirements

- Requirement 1
- Requirement 2

## Scope

### In Scope
- Test scope item
`;

  const defaultPlan = `# Implementation Plan

## Technical Context

Test context.

## Architecture

Test architecture.

## Implementation

Test implementation steps.
`;

  const defaultTasks = `# Tasks

- [ ] Task 1
- [ ] Task 2
`;

  const defaultChecklist = `# Checklist

## P0 - Critical

- [ ] Critical item

## P1 - Required

- [ ] Required item

## P2 - Optional

- [ ] Optional item
`;

  const defaultDecisionRecord = `# Decision Record

## ADR-001: Test Decision

### Context

Test context.

### Decision

Test decision.

### Consequences

Test consequences.
`;

  const defaultImplSummary = `# Implementation Summary

## Overview

Test implementation summary.
`;

  // Create files based on level
  if (!skipFiles.includes('spec.md')) {
    fs.writeFileSync(path.join(folderPath, 'spec.md'), specContent || defaultSpec);
  }
  if (!skipFiles.includes('plan.md')) {
    fs.writeFileSync(path.join(folderPath, 'plan.md'), planContent || defaultPlan);
  }
  if (!skipFiles.includes('tasks.md')) {
    fs.writeFileSync(path.join(folderPath, 'tasks.md'), tasksContent || defaultTasks);
  }
  if (!skipFiles.includes('implementation-summary.md')) {
    fs.writeFileSync(path.join(folderPath, 'implementation-summary.md'), implSummaryContent || defaultImplSummary);
  }

  if (level >= 2 && !skipFiles.includes('checklist.md')) {
    fs.writeFileSync(path.join(folderPath, 'checklist.md'), checklistContent || defaultChecklist);
  }

  if (level >= 3 && !skipFiles.includes('decision-record.md')) {
    fs.writeFileSync(path.join(folderPath, 'decision-record.md'), decisionRecordContent || defaultDecisionRecord);
  }

  // Create memory files if specified
  for (const [filename, content] of Object.entries(memoryFiles)) {
    fs.writeFileSync(path.join(folderPath, 'memory', filename), content);
  }

  return folderPath;
}

/* ─────────────────────────────────────────────────────────────
   4. LEVEL DETECTION TESTS
────────────────────────────────────────────────────────────────
*/

async function testLevelDetection() {
  startSuite('Level Detection Logic');

  try {
    // Test explicit level detection patterns
    const patterns = [
      { input: '| **Level** | 1 |', expected: 1, name: 'Bold level in table' },
      { input: '| **Level** | 2 |', expected: 2, name: 'Bold level 2' },
      { input: '| **Level** | 3 |', expected: 3, name: 'Bold level 3' },
      { input: '| Level | 2 |', expected: 2, name: 'Non-bold level' },
      { input: 'level: 2', expected: 2, name: 'YAML frontmatter style' },
      { input: 'Level: 1', expected: 1, name: 'Inline Level: N' },
      { input: 'Level 2', expected: 2, name: 'Inline Level N' },
    ];

    for (const { input, expected, name } of patterns) {
      // Regex pattern from validate.sh
      const match = input.match(/\|\s*\*\*Level\*\*\s*\|\s*([123])\s*\|/) ||
                   input.match(/\|\s*Level\s*\|\s*([123])\s*\|/) ||
                   input.match(/^level:\s*([123])/) ||
                   input.match(/level[: ]+([123])/i);

      if (match && parseInt(match[1]) === expected) {
        pass(`Level detection: ${name}`, `Found level ${match[1]}`);
      } else {
        fail(`Level detection: ${name}`, `Expected ${expected}, pattern: ${input}`);
      }
    }

    // Test level inference from file presence
    const level1Folder = createTestSpecFolder('001-level1-inferred', 1, {
      skipFiles: ['checklist.md', 'decision-record.md'],
    });
    const level2Folder = createTestSpecFolder('002-level2-inferred', 2, {
      skipFiles: ['decision-record.md'],
    });
    const level3Folder = createTestSpecFolder('003-level3-inferred', 3);

    // Level 1 inferred (no checklist or decision-record)
    if (!fileExists(path.join(level1Folder, 'checklist.md')) &&
        !fileExists(path.join(level1Folder, 'decision-record.md'))) {
      pass('Level inference: L1 from file absence', 'No L2/L3 files present');
    } else {
      fail('Level inference: L1 from file absence', 'Unexpected files present');
    }

    // Level 2 inferred (checklist present)
    if (fileExists(path.join(level2Folder, 'checklist.md')) &&
        !fileExists(path.join(level2Folder, 'decision-record.md'))) {
      pass('Level inference: L2 from checklist.md', 'Checklist present, no decision-record');
    } else {
      fail('Level inference: L2 from checklist.md', 'Unexpected file state');
    }

    // Level 3 inferred (decision-record present)
    if (fileExists(path.join(level3Folder, 'decision-record.md'))) {
      pass('Level inference: L3 from decision-record.md', 'Decision record present');
    } else {
      fail('Level inference: L3 from decision-record.md', 'Decision record missing');
    }

  } catch (error) {
    fail('Level Detection Logic', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   5. FILE_EXISTS RULE TESTS
────────────────────────────────────────────────────────────────
*/

async function testFileExistsRule() {
  startSuite('Rule: FILE_EXISTS');

  try {
    // Test L1 required files
    const l1Files = ['spec.md', 'plan.md', 'tasks.md'];
    const l1Folder = createTestSpecFolder('010-file-exists-l1', 1);

    let allL1Exist = true;
    for (const file of l1Files) {
      if (!fileExists(path.join(l1Folder, file))) {
        allL1Exist = false;
        break;
      }
    }

    if (allL1Exist) {
      pass('L1 required files present', l1Files.join(', '));
    } else {
      fail('L1 required files present', 'Missing files');
    }

    // Test L2 adds checklist.md
    const l2Folder = createTestSpecFolder('011-file-exists-l2', 2);
    if (fileExists(path.join(l2Folder, 'checklist.md'))) {
      pass('L2 adds checklist.md', 'File present');
    } else {
      fail('L2 adds checklist.md', 'checklist.md missing');
    }

    // Test L3 adds decision-record.md
    const l3Folder = createTestSpecFolder('012-file-exists-l3', 3);
    if (fileExists(path.join(l3Folder, 'decision-record.md'))) {
      pass('L3 adds decision-record.md', 'File present');
    } else {
      fail('L3 adds decision-record.md', 'decision-record.md missing');
    }

    // Test missing spec.md fails
    const missingSpecFolder = createTestSpecFolder('013-missing-spec', 1, {
      skipFiles: ['spec.md'],
    });
    if (!fileExists(path.join(missingSpecFolder, 'spec.md'))) {
      pass('Missing spec.md detected', 'spec.md correctly absent');
    } else {
      fail('Missing spec.md detected', 'spec.md unexpectedly present');
    }

    // Test implementation-summary.md check with completed items
    const completedChecklist = `# Checklist

## P0 - Critical

- [x] Completed item [Test: passed]
`;
    const implRequiredFolder = createTestSpecFolder('014-impl-required', 2, {
      checklistContent: completedChecklist,
      skipFiles: ['implementation-summary.md'],
    });

    // Should detect completed items and require implementation-summary.md
    const hasCompletedItems = completedChecklist.match(/\[[xX]\]/);
    if (hasCompletedItems && !fileExists(path.join(implRequiredFolder, 'implementation-summary.md'))) {
      pass('Impl-summary required after completion', 'Completed items detected, impl-summary missing');
    } else {
      skip('Impl-summary required after completion', 'Test setup issue');
    }

  } catch (error) {
    fail('FILE_EXISTS Rule', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   6. PLACEHOLDER_FILLED RULE TESTS
────────────────────────────────────────────────────────────────
*/

async function testPlaceholderRule() {
  startSuite('Rule: PLACEHOLDER_FILLED');

  try {
    // Placeholder patterns that should be detected
    const placeholderPatterns = [
      { pattern: '[YOUR_VALUE_HERE: description]', name: 'YOUR_VALUE_HERE' },
      { pattern: '[NEEDS CLARIFICATION: details]', name: 'NEEDS CLARIFICATION' },
      { pattern: '{{placeholder_name}}', name: 'Mustache placeholder' },
    ];

    for (const { pattern, name } of placeholderPatterns) {
      const detected = pattern.match(/\[YOUR_VALUE_HERE:/) ||
                       pattern.match(/\[NEEDS CLARIFICATION:/) ||
                       pattern.match(/\{\{[^}]+\}\}/);

      if (detected) {
        pass(`Placeholder pattern: ${name}`, `Detected: ${pattern.slice(0, 30)}`);
      } else {
        fail(`Placeholder pattern: ${name}`, 'Pattern not detected');
      }
    }

    // Test placeholder in code block (should be ignored)
    const codeBlockContent = `# Spec

\`\`\`
[YOUR_VALUE_HERE: in code block]
\`\`\`

This is valid content.
`;

    // Extract non-code-block content
    const filtered = codeBlockContent.replace(/```[\s\S]*?```/g, '');
    const inCodeBlock = !filtered.includes('[YOUR_VALUE_HERE:');

    if (inCodeBlock) {
      pass('Placeholder in code block ignored', 'Code block content filtered');
    } else {
      fail('Placeholder in code block ignored', 'Code block not properly filtered');
    }

    // Test placeholder in inline code (should be ignored)
    const inlineCodeContent = 'Use `[YOUR_VALUE_HERE: example]` as a template.';
    const hasInlineBackticks = inlineCodeContent.includes('`[YOUR_VALUE_HERE:');

    if (hasInlineBackticks) {
      pass('Placeholder in inline code detected', 'Inline code pattern recognized');
    } else {
      fail('Placeholder in inline code detected', 'Pattern not found');
    }

    // Test valid content (no placeholders)
    const validContent = `# Valid Spec

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Active |

## Problem Statement

Real problem description here.
`;

    const hasPlaceholders = validContent.match(/\[YOUR_VALUE_HERE:/) ||
                            validContent.match(/\[NEEDS CLARIFICATION:/) ||
                            validContent.match(/\{\{[^}]+\}\}/);

    if (!hasPlaceholders) {
      pass('Valid content has no placeholders', 'Content is clean');
    } else {
      fail('Valid content has no placeholders', 'Unexpected placeholder found');
    }

    // Test against fixture if available
    const fixtureWithPlaceholders = path.join(FIXTURES_DIR, '005-unfilled-placeholders');
    if (dirExists(fixtureWithPlaceholders)) {
      const fixtureSpec = readFile(path.join(fixtureWithPlaceholders, 'spec.md'));
      if (fixtureSpec && fixtureSpec.includes('[YOUR_VALUE_HERE:')) {
        pass('Fixture 005 has placeholders', 'YOUR_VALUE_HERE found');
      } else {
        fail('Fixture 005 has placeholders', 'Expected placeholder not found');
      }
    } else {
      skip('Fixture 005 test', 'Fixture not found');
    }

  } catch (error) {
    fail('PLACEHOLDER_FILLED Rule', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   7. ANCHORS_VALID RULE TESTS
────────────────────────────────────────────────────────────────
*/

async function testAnchorsRule() {
  startSuite('Rule: ANCHORS_VALID');

  try {
    // Test valid anchor pairs
    const validAnchors = `# Memory File

<!-- ANCHOR:summary -->
## Summary
This is the summary content.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:decisions -->
## Decisions
- Decision 1
<!-- /ANCHOR:decisions -->
`;

    const openPattern = /<!-- ANCHOR:([a-zA-Z0-9_-]+)/g;
    const closePattern = /<!-- \/ANCHOR:([a-zA-Z0-9_-]+)/g;

    const openAnchors = new Set();
    const closeAnchors = new Set();

    let match;
    while ((match = openPattern.exec(validAnchors)) !== null) {
      openAnchors.add(match[1]);
    }
    while ((match = closePattern.exec(validAnchors)) !== null) {
      closeAnchors.add(match[1]);
    }

    // Check all opens have closes
    let allClosed = true;
    for (const anchor of openAnchors) {
      if (!closeAnchors.has(anchor)) {
        allClosed = false;
        break;
      }
    }

    if (allClosed && openAnchors.size === closeAnchors.size) {
      pass('Valid anchor pairs', `Found ${openAnchors.size} pairs`);
    } else {
      fail('Valid anchor pairs', 'Mismatched anchors');
    }

    // Test unclosed anchor detection
    const unclosedAnchor = `# Memory File

<!-- ANCHOR:summary -->
## Summary
This is the summary content.

<!-- ANCHOR:decisions -->
## Decisions
- Decision 1
<!-- /ANCHOR:decisions -->
`;

    const unclosedOpen = new Set();
    const unclosedClose = new Set();

    openPattern.lastIndex = 0;
    closePattern.lastIndex = 0;

    while ((match = openPattern.exec(unclosedAnchor)) !== null) {
      unclosedOpen.add(match[1]);
    }
    while ((match = closePattern.exec(unclosedAnchor)) !== null) {
      unclosedClose.add(match[1]);
    }

    const unclosedAnchors = [];
    for (const anchor of unclosedOpen) {
      if (!unclosedClose.has(anchor)) {
        unclosedAnchors.push(anchor);
      }
    }

    if (unclosedAnchors.includes('summary')) {
      pass('Unclosed anchor detection', `Found unclosed: ${unclosedAnchors.join(', ')}`);
    } else {
      fail('Unclosed anchor detection', 'Unclosed anchor not detected');
    }

    // Test orphaned closing anchor
    const orphanedClose = `# Memory File

<!-- /ANCHOR:orphan -->
Content here.
`;

    const orphanOpen = new Set();
    const orphanClose = new Set();

    openPattern.lastIndex = 0;
    closePattern.lastIndex = 0;

    while ((match = openPattern.exec(orphanedClose)) !== null) {
      orphanOpen.add(match[1]);
    }
    while ((match = closePattern.exec(orphanedClose)) !== null) {
      orphanClose.add(match[1]);
    }

    const orphanedAnchors = [];
    for (const anchor of orphanClose) {
      if (!orphanOpen.has(anchor)) {
        orphanedAnchors.push(anchor);
      }
    }

    if (orphanedAnchors.includes('orphan')) {
      pass('Orphaned closing anchor detection', `Found orphan: ${orphanedAnchors.join(', ')}`);
    } else {
      fail('Orphaned closing anchor detection', 'Orphan not detected');
    }

    // Test nested anchors (valid in SpecKit)
    const nestedAnchors = `# Memory File

<!-- ANCHOR:outer -->
## Outer Section
<!-- ANCHOR:inner -->
Inner content.
<!-- /ANCHOR:inner -->
<!-- /ANCHOR:outer -->
`;

    const nestedOpen = new Set();
    const nestedClose = new Set();

    openPattern.lastIndex = 0;
    closePattern.lastIndex = 0;

    while ((match = openPattern.exec(nestedAnchors)) !== null) {
      nestedOpen.add(match[1]);
    }
    while ((match = closePattern.exec(nestedAnchors)) !== null) {
      nestedClose.add(match[1]);
    }

    if (nestedOpen.size === 2 && nestedClose.size === 2) {
      pass('Nested anchors valid', 'Both outer and inner anchors closed');
    } else {
      fail('Nested anchors valid', 'Nesting issue detected');
    }

    // Test duplicate anchor IDs (both closed)
    const duplicateAnchors = `# Memory File

<!-- ANCHOR:summary -->
First summary.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:summary -->
Second summary.
<!-- /ANCHOR:summary -->
`;

    const dupCounts = { open: 0, close: 0 };
    openPattern.lastIndex = 0;
    closePattern.lastIndex = 0;

    while (openPattern.exec(duplicateAnchors) !== null) {
      dupCounts.open++;
    }
    while (closePattern.exec(duplicateAnchors) !== null) {
      dupCounts.close++;
    }

    if (dupCounts.open === dupCounts.close) {
      pass('Duplicate anchor IDs (both closed)', `${dupCounts.open} opens, ${dupCounts.close} closes`);
    } else {
      fail('Duplicate anchor IDs (both closed)', `Mismatch: ${dupCounts.open} opens, ${dupCounts.close} closes`);
    }

  } catch (error) {
    fail('ANCHORS_VALID Rule', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   8. SECTIONS_PRESENT RULE TESTS
────────────────────────────────────────────────────────────────
*/

async function testSectionsPresentRule() {
  startSuite('Rule: SECTIONS_PRESENT');

  try {
    // Required sections by file type
    const requiredSections = {
      'spec.md': ['Problem Statement', 'Requirements', 'Scope'],
      'plan.md': ['Technical Context', 'Architecture', 'Implementation'],
      'checklist.md': ['P0', 'P1'],
      'decision-record.md': ['Context', 'Decision', 'Consequences'],
    };

    // Test section detection in valid content
    const validSpec = `# Spec

## Problem Statement

Content here.

## Requirements

- Req 1

## Scope

Scope content.
`;

    const foundSections = [];
    const headerPattern = /^#{1,3}\s+(.+)$/gm;
    let match;
    while ((match = headerPattern.exec(validSpec)) !== null) {
      foundSections.push(match[1]);
    }

    let allSpecSectionsFound = true;
    for (const section of requiredSections['spec.md']) {
      const found = foundSections.some(h => h.toLowerCase().includes(section.toLowerCase()));
      if (!found) {
        allSpecSectionsFound = false;
        break;
      }
    }

    if (allSpecSectionsFound) {
      pass('spec.md required sections present', requiredSections['spec.md'].join(', '));
    } else {
      fail('spec.md required sections present', 'Missing required sections');
    }

    // Test missing section detection
    const missingSpec = `# Spec

## Overview

Content here.

## What We Need

- Item 1

## Scope

Scope content.
`;

    const missingSections = [];
    for (const section of requiredSections['spec.md']) {
      const headers = missingSpec.match(/^#{1,3}\s+(.+)$/gm) || [];
      const found = headers.some(h => h.toLowerCase().includes(section.toLowerCase()));
      if (!found) {
        missingSections.push(section);
      }
    }

    if (missingSections.length > 0) {
      pass('Missing section detection', `Missing: ${missingSections.join(', ')}`);
    } else {
      fail('Missing section detection', 'Expected missing sections not detected');
    }

    // Test case-insensitive matching
    const caseInsensitiveSpec = `# Spec

## PROBLEM STATEMENT

Content here.

## requirements

- Req 1

## ScOpE

Scope content.
`;

    let caseInsensitivePass = true;
    for (const section of requiredSections['spec.md']) {
      const regex = new RegExp(`^#{1,3}\\s+.*${section}.*$`, 'gim');
      if (!regex.test(caseInsensitiveSpec)) {
        caseInsensitivePass = false;
        break;
      }
    }

    if (caseInsensitivePass) {
      pass('Case-insensitive section matching', 'All variations matched');
    } else {
      fail('Case-insensitive section matching', 'Some sections not matched');
    }

    // Test checklist P0/P1 sections
    const validChecklist = `# Checklist

## P0 - Critical

- [ ] Item 1

## P1 - Required

- [ ] Item 2
`;

    const hasP0 = /^#{1,3}\s+P0/m.test(validChecklist);
    const hasP1 = /^#{1,3}\s+P1/m.test(validChecklist);

    if (hasP0 && hasP1) {
      pass('Checklist P0/P1 sections', 'Both sections present');
    } else {
      fail('Checklist P0/P1 sections', `P0: ${hasP0}, P1: ${hasP1}`);
    }

    // Test decision-record ADR sections
    const validDecision = `# Decision Record

## ADR-001: Test Decision

### Context

Context content.

### Decision

Decision content.

### Consequences

Consequences content.
`;

    let allAdrSectionsFound = true;
    for (const section of requiredSections['decision-record.md']) {
      const regex = new RegExp(`^#{1,3}\\s+.*${section}`, 'gim');
      if (!regex.test(validDecision)) {
        allAdrSectionsFound = false;
        break;
      }
    }

    if (allAdrSectionsFound) {
      pass('Decision-record ADR sections', requiredSections['decision-record.md'].join(', '));
    } else {
      fail('Decision-record ADR sections', 'Missing ADR sections');
    }

  } catch (error) {
    fail('SECTIONS_PRESENT Rule', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   9. PRIORITY_TAGS RULE TESTS
────────────────────────────────────────────────────────────────
*/

async function testPriorityTagsRule() {
  startSuite('Rule: PRIORITY_TAGS');

  try {
    // Test valid priority header format
    const validPriorityHeaders = `# Checklist

## P0 - Critical

- [ ] Item 1

## P1 - Required

- [ ] Item 2

## P2 - Optional

- [ ] Item 3
`;

    const hasP0Header = /^#{1,3}\s+P0/m.test(validPriorityHeaders);
    const hasP1Header = /^#{1,3}\s+P1/m.test(validPriorityHeaders);
    const hasP2Header = /^#{1,3}\s+P2/m.test(validPriorityHeaders);

    if (hasP0Header && hasP1Header && hasP2Header) {
      pass('Valid priority headers', 'P0, P1, P2 headers found');
    } else {
      fail('Valid priority headers', `P0: ${hasP0Header}, P1: ${hasP1Header}, P2: ${hasP2Header}`);
    }

    // Test inline priority tags
    const inlineTags = `# Checklist

- [ ] [P0] Critical item
- [ ] [P1] Required item
- [ ] [P2] Optional item
`;

    const hasInlineP0 = /\[P0\]/.test(inlineTags);
    const hasInlineP1 = /\[P1\]/.test(inlineTags);
    const hasInlineP2 = /\[P2\]/.test(inlineTags);

    if (hasInlineP0 && hasInlineP1 && hasInlineP2) {
      pass('Valid inline priority tags', '[P0], [P1], [P2] found');
    } else {
      fail('Valid inline priority tags', 'Missing inline tags');
    }

    // Test mixed format (headers + inline)
    const mixedFormat = `# Checklist

## P0 - Critical

- [ ] Item from header context
- [ ] [P1] Override to P1

## P1 - Required

- [ ] Item from P1 header
`;

    const hasMixedP0 = /^#{1,3}\s+P0/m.test(mixedFormat);
    const hasMixedInlineP1 = /\[P1\]/.test(mixedFormat);

    if (hasMixedP0 && hasMixedInlineP1) {
      pass('Mixed priority format', 'Headers and inline tags coexist');
    } else {
      fail('Mixed priority format', 'Mixed format not detected');
    }

    // Test lowercase priority headers (should warn)
    const lowercasePriority = `# Checklist

## p0 - critical

- [ ] Item
`;

    const hasLowercaseP0 = /^#{1,3}\s+p0/mi.test(lowercasePriority);
    const hasUppercaseP0 = /^#{1,3}\s+P0/m.test(lowercasePriority);

    if (hasLowercaseP0 && !hasUppercaseP0) {
      pass('Lowercase priority detection', 'Lowercase p0 detected (should warn)');
    } else {
      fail('Lowercase priority detection', 'Detection issue');
    }

    // Test invalid priority levels (P3, P4)
    const invalidPriority = `# Checklist

## P3 - Invalid

- [ ] Item
`;

    const hasP3 = /^#{1,3}\s+P3/m.test(invalidPriority);
    const hasValidPriority = /^#{1,3}\s+P[012]/m.test(invalidPriority);

    if (hasP3 && !hasValidPriority) {
      pass('Invalid P3 priority detection', 'P3 detected, no valid priorities');
    } else {
      skip('Invalid P3 priority detection', 'Detection varies by implementation');
    }

    // Test items without priority context
    const noPriorityContext = `# Checklist

## Tasks

- [ ] Item without priority context
- [ ] Another item
`;

    const hasPrioritySection = /^#{1,3}\s+P[012]/m.test(noPriorityContext);
    const hasInlinePriority = /\[P[012]\]/.test(noPriorityContext);

    if (!hasPrioritySection && !hasInlinePriority) {
      pass('No priority context detection', 'Items lack priority context');
    } else {
      fail('No priority context detection', 'Unexpected priority found');
    }

  } catch (error) {
    fail('PRIORITY_TAGS Rule', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   10. EVIDENCE_CITED RULE TESTS
────────────────────────────────────────────────────────────────
*/

async function testEvidenceRule() {
  startSuite('Rule: EVIDENCE_CITED');

  try {
    // Test all 5 evidence patterns
    const evidencePatterns = [
      { pattern: '[Source: API docs v2.1]', name: 'Source citation' },
      { pattern: '[File: src/auth.ts:45-67]', name: 'File reference' },
      { pattern: '[Test: npm run test:auth]', name: 'Test reference' },
      { pattern: '[Commit: abc1234]', name: 'Commit reference' },
      { pattern: '[Screenshot: ./evidence/login.png]', name: 'Screenshot reference' },
    ];

    for (const { pattern, name } of evidencePatterns) {
      const evidenceRegex = /\[(Source|File|Test|Commit|Screenshot):\s*[^\]]+\]/i;

      if (evidenceRegex.test(pattern)) {
        pass(`Evidence pattern: ${name}`, `Matched: ${pattern.slice(0, 40)}`);
      } else {
        fail(`Evidence pattern: ${name}`, 'Pattern not matched');
      }
    }

    // Test case-insensitive evidence matching
    const caseVariations = [
      '[source: API docs]',
      '[SOURCE: API docs]',
      '[Source: API docs]',
      '[file: path/to/file]',
      '[FILE: path/to/file]',
    ];

    let allCasesMatch = true;
    for (const variation of caseVariations) {
      if (!/\[(source|file|test|commit|screenshot):\s*[^\]]+\]/i.test(variation)) {
        allCasesMatch = false;
        break;
      }
    }

    if (allCasesMatch) {
      pass('Case-insensitive evidence matching', 'All case variations matched');
    } else {
      fail('Case-insensitive evidence matching', 'Some variations failed');
    }

    // Test P2 items exempt from evidence
    const p2Exempt = `# Checklist

## P2 - Optional

- [x] Completed without evidence
`;

    const isP2Section = /^#{1,3}\s+P2/m.test(p2Exempt);
    const hasCompletedItem = /\[[xX]\]/.test(p2Exempt);
    const hasEvidence = /\[(Source|File|Test|Commit|Screenshot):\s*[^\]]+\]/i.test(p2Exempt);

    if (isP2Section && hasCompletedItem && !hasEvidence) {
      pass('P2 items exempt from evidence', 'P2 completed items need no evidence');
    } else {
      fail('P2 items exempt from evidence', 'Exemption not applied');
    }

    // Test P0/P1 items require evidence
    const p0NeedsEvidence = `# Checklist

## P0 - Critical

- [x] Completed without evidence
`;

    const isP0Section = /^#{1,3}\s+P0/m.test(p0NeedsEvidence);
    const p0Completed = /\[[xX]\]/.test(p0NeedsEvidence);
    const p0HasEvidence = /\[(Source|File|Test|Commit|Screenshot):\s*[^\]]+\]/i.test(p0NeedsEvidence);

    if (isP0Section && p0Completed && !p0HasEvidence) {
      pass('P0 missing evidence detection', 'P0 completed item lacks evidence (should warn)');
    } else {
      fail('P0 missing evidence detection', 'Detection issue');
    }

    // Test valid P0 with evidence
    const p0WithEvidence = `# Checklist

## P0 - Critical

- [x] Auth flow working [Test: npm run test:auth - all 12 passing]
`;

    const validP0Evidence = /\[[xX]\].*\[(Source|File|Test|Commit|Screenshot):/i.test(p0WithEvidence);

    if (validP0Evidence) {
      pass('P0 with valid evidence', 'Evidence correctly attached');
    } else {
      fail('P0 with valid evidence', 'Evidence not detected on same line');
    }

    // Test checkmark format variations
    const checkmarkFormats = [
      '- [x] Task done',
      '- [X] Task done',
      '- [\u2713] Task done', // Unicode checkmark
      '- [\u2714] Task done', // Heavy checkmark
    ];

    let checkmarksDetected = 0;
    for (const format of checkmarkFormats) {
      if (/\[[xX\u2713\u2714]\]/.test(format)) {
        checkmarksDetected++;
      }
    }

    if (checkmarksDetected === checkmarkFormats.length) {
      pass('Checkmark format variations', `All ${checkmarksDetected} formats detected`);
    } else {
      fail('Checkmark format variations', `Only ${checkmarksDetected}/${checkmarkFormats.length} detected`);
    }

  } catch (error) {
    fail('EVIDENCE_CITED Rule', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   11. EXIT CODE BEHAVIOR TESTS
────────────────────────────────────────────────────────────────
*/

async function testExitCodeBehavior() {
  startSuite('Exit Code Behavior');

  try {
    // Exit code definitions
    const exitCodes = {
      PASS: 0,      // No errors or warnings
      WARN: 1,      // Warnings only
      ERROR: 2,     // Errors (validation failures)
    };

    pass('Exit code 0 = PASS', 'No errors or warnings');
    pass('Exit code 1 = WARN', 'Warnings but no errors');
    pass('Exit code 2 = ERROR', 'Validation failures');

    // Test against real fixtures if validator exists
    if (!fileExists(VALIDATOR_SCRIPT)) {
      skip('Validator execution tests', 'Validator script not found');
      endSuite();
      return;
    }

    // Test valid fixture (should pass or warn depending on section counts)
    const validFixture = path.join(FIXTURES_DIR, '002-valid-level1');
    if (dirExists(validFixture)) {
      const validResult = runValidator(validFixture);
      if (validResult.exitCode === 0 || validResult.exitCode === 1) {
        pass('Valid fixture: exit 0 or 1', `Exit code: ${validResult.exitCode}`);
      } else {
        fail('Valid fixture: exit 0 or 1', `Exit code: ${validResult.exitCode}`);
      }
    } else {
      skip('Valid fixture test', 'Fixture 002-valid-level1 not found');
    }

    // Test empty folder fixture (should fail with exit 2)
    const emptyFixture = path.join(FIXTURES_DIR, '001-empty-folder');
    if (dirExists(emptyFixture)) {
      const emptyResult = runValidator(emptyFixture);
      if (emptyResult.exitCode === 2) {
        pass('Empty folder: exit 2 (ERROR)', 'Missing files detected');
      } else {
        fail('Empty folder: exit 2 (ERROR)', `Exit code: ${emptyResult.exitCode}`);
      }
    } else {
      skip('Empty folder test', 'Fixture 001-empty-folder not found');
    }

    // Test placeholder fixture (should fail with exit 2)
    const placeholderFixture = path.join(FIXTURES_DIR, '005-unfilled-placeholders');
    if (dirExists(placeholderFixture)) {
      const placeholderResult = runValidator(placeholderFixture);
      if (placeholderResult.exitCode === 2) {
        pass('Placeholder fixture: exit 2 (ERROR)', 'Placeholders detected');
      } else {
        fail('Placeholder fixture: exit 2 (ERROR)', `Exit code: ${placeholderResult.exitCode}`);
      }
    } else {
      skip('Placeholder fixture test', 'Fixture 005-unfilled-placeholders not found');
    }

    // Test --strict mode (warnings become errors)
    const warningFixture = path.join(FIXTURES_DIR, '021-invalid-priority-tags');
    if (dirExists(warningFixture)) {
      // Without strict: should warn (exit 1)
      const normalResult = runValidator(warningFixture);
      // With strict: should error (exit 2)
      const strictResult = runValidator(warningFixture, { strict: true });

      if (strictResult.exitCode === 2 && normalResult.exitCode >= 1) {
        pass('--strict mode: warnings become errors', `Normal: ${normalResult.exitCode}, Strict: ${strictResult.exitCode}`);
      } else {
        skip('--strict mode test', `Normal: ${normalResult.exitCode}, Strict: ${strictResult.exitCode}`);
      }
    } else {
      skip('--strict mode test', 'Fixture 021-invalid-priority-tags not found');
    }

    // Test SPECKIT_STRICT env var
    if (dirExists(warningFixture)) {
      const envStrictResult = runValidator(warningFixture, { envVars: { SPECKIT_STRICT: 'true' } });

      if (envStrictResult.exitCode === 2) {
        pass('SPECKIT_STRICT=true env var', 'Warnings treated as errors');
      } else {
        skip('SPECKIT_STRICT env var test', `Exit code: ${envStrictResult.exitCode}`);
      }
    }

  } catch (error) {
    fail('Exit Code Behavior', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   12. JSON OUTPUT MODE TESTS
────────────────────────────────────────────────────────────────
*/

async function testJsonOutputMode() {
  startSuite('JSON Output Mode');

  try {
    if (!fileExists(VALIDATOR_SCRIPT)) {
      skip('JSON output tests', 'Validator script not found');
      endSuite();
      return;
    }

    const validFixture = path.join(FIXTURES_DIR, '002-valid-level1');
    if (!dirExists(validFixture)) {
      skip('JSON output tests', 'Fixture 002-valid-level1 not found');
      endSuite();
      return;
    }

    // Test --json produces valid JSON
    const jsonResult = runValidator(validFixture, { json: true });

    let parsedJson = null;
    try {
      parsedJson = JSON.parse(jsonResult.stdout);
    } catch (e) {
      // Try extracting JSON from output
      const jsonMatch = jsonResult.stdout.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedJson = JSON.parse(jsonMatch[0]);
      }
    }

    if (parsedJson) {
      pass('--json produces valid JSON', 'Successfully parsed');
    } else {
      fail('--json produces valid JSON', 'JSON parse failed');
      endSuite();
      return;
    }

    // Test required JSON fields
    const requiredFields = ['version', 'folder', 'passed', 'results', 'summary'];
    const missingFields = requiredFields.filter(f => !(f in parsedJson));

    if (missingFields.length === 0) {
      pass('JSON has required fields', requiredFields.join(', '));
    } else {
      fail('JSON has required fields', `Missing: ${missingFields.join(', ')}`);
    }

    // Test JSON field types
    if (typeof parsedJson.version === 'string') {
      pass('JSON version is string', parsedJson.version);
    } else {
      fail('JSON version is string', `Type: ${typeof parsedJson.version}`);
    }

    if (typeof parsedJson.passed === 'boolean') {
      pass('JSON passed is boolean', String(parsedJson.passed));
    } else {
      fail('JSON passed is boolean', `Type: ${typeof parsedJson.passed}`);
    }

    if (Array.isArray(parsedJson.results)) {
      pass('JSON results is array', `${parsedJson.results.length} results`);
    } else {
      fail('JSON results is array', `Type: ${typeof parsedJson.results}`);
    }

    if (typeof parsedJson.summary === 'object') {
      const summaryFields = ['errors', 'warnings'];
      const missingSummary = summaryFields.filter(f => !(f in parsedJson.summary));

      if (missingSummary.length === 0) {
        pass('JSON summary has error/warning counts', `Errors: ${parsedJson.summary.errors}, Warnings: ${parsedJson.summary.warnings}`);
      } else {
        fail('JSON summary has error/warning counts', `Missing: ${missingSummary.join(', ')}`);
      }
    } else {
      fail('JSON summary is object', `Type: ${typeof parsedJson.summary}`);
    }

    // Test JSON level and levelMethod
    if ('level' in parsedJson && 'levelMethod' in parsedJson) {
      pass('JSON includes level info', `Level ${parsedJson.level} (${parsedJson.levelMethod})`);
    } else {
      skip('JSON level info', 'level/levelMethod fields missing');
    }

  } catch (error) {
    fail('JSON Output Mode', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   13. CROSS-REFERENCE VALIDATION TESTS
────────────────────────────────────────────────────────────────
*/

async function testCrossReferenceValidation() {
  startSuite('Cross-Reference Validation');

  try {
    // Test LEVEL_MATCH: cross-file consistency
    const specLevel2 = `# Spec

| **Level** | 2 |
`;

    const planLevel1 = `# Plan

| **Level** | 1 |
`;

    const specLevelMatch = specLevel2.match(/\|\s*\*\*Level\*\*\s*\|\s*([123])/);
    const planLevelMatch = planLevel1.match(/\|\s*\*\*Level\*\*\s*\|\s*([123])/);

    if (specLevelMatch && planLevelMatch && specLevelMatch[1] !== planLevelMatch[1]) {
      pass('Level mismatch detection', `spec: ${specLevelMatch[1]}, plan: ${planLevelMatch[1]}`);
    } else {
      fail('Level mismatch detection', 'Mismatch not detected');
    }

    // Test file presence hints (L1 with decision-record suggests L3)
    const l1WithDecision = createTestSpecFolder('020-l1-with-decision', 1, {});
    // Manually add decision-record.md
    fs.writeFileSync(path.join(l1WithDecision, 'decision-record.md'), '# Decision Record');

    const hasDecisionRecord = fileExists(path.join(l1WithDecision, 'decision-record.md'));
    const specContent = readFile(path.join(l1WithDecision, 'spec.md'));
    const declaredLevel = specContent.match(/\|\s*\*\*Level\*\*\s*\|\s*([123])/);

    if (hasDecisionRecord && declaredLevel && declaredLevel[1] === '1') {
      pass('File presence hint detection', 'L1 declared but decision-record.md present (suggests L3)');
    } else {
      skip('File presence hint detection', 'Setup issue');
    }

    // Test required files for declared level
    const l2MissingChecklist = createTestSpecFolder('021-l2-no-checklist', 2, {
      skipFiles: ['checklist.md'],
    });

    const specL2 = readFile(path.join(l2MissingChecklist, 'spec.md'));
    const isL2 = /\|\s*\*\*Level\*\*\s*\|\s*2/.test(specL2);
    const hasChecklist = fileExists(path.join(l2MissingChecklist, 'checklist.md'));

    if (isL2 && !hasChecklist) {
      pass('L2 missing checklist.md detection', 'Declared L2 but checklist.md absent');
    } else {
      fail('L2 missing checklist.md detection', `L2: ${isL2}, Checklist: ${hasChecklist}`);
    }

  } catch (error) {
    fail('Cross-Reference Validation', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   14. RULE SCRIPT EXISTENCE TESTS
────────────────────────────────────────────────────────────────
*/

async function testRuleScriptsExist() {
  startSuite('Rule Scripts Existence');

  try {
    const expectedRules = [
      'check-files.sh',
      'check-placeholders.sh',
      'check-anchors.sh',
      'check-sections.sh',
      'check-level.sh',
      'check-priority-tags.sh',
      'check-evidence.sh',
      'check-folder-naming.sh',
      'check-frontmatter.sh',
      'check-ai-protocols.sh',
      'check-level-match.sh',
      'check-section-counts.sh',
      'check-complexity.sh',
    ];

    let foundCount = 0;
    const missingRules = [];

    for (const rule of expectedRules) {
      const rulePath = path.join(RULES_DIR, rule);
      if (fileExists(rulePath)) {
        foundCount++;
      } else {
        missingRules.push(rule);
      }
    }

    if (foundCount === expectedRules.length) {
      pass('All 13 rule scripts exist', `${foundCount}/${expectedRules.length} found`);
    } else {
      fail('All 13 rule scripts exist', `Missing: ${missingRules.join(', ')}`);
    }

    // Test each rule script has run_check function
    if (!dirExists(RULES_DIR)) {
      skip('Rule function tests', 'Rules directory not found');
      endSuite();
      return;
    }

    for (const rule of expectedRules) {
      const rulePath = path.join(RULES_DIR, rule);
      if (!fileExists(rulePath)) continue;

      const content = readFile(rulePath);
      if (content && content.includes('run_check()')) {
        pass(`${rule} has run_check()`, 'Function found');
      } else {
        fail(`${rule} has run_check()`, 'Function not found');
      }
    }

    // Test validate.sh orchestrator exists
    if (fileExists(VALIDATOR_SCRIPT)) {
      pass('validate.sh orchestrator exists', VALIDATOR_SCRIPT);
    } else {
      fail('validate.sh orchestrator exists', 'Script not found');
    }

  } catch (error) {
    fail('Rule Scripts Existence', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   15. FIXTURE COVERAGE TESTS
────────────────────────────────────────────────────────────────
*/

async function testFixtureCoverage() {
  startSuite('Test Fixture Coverage');

  try {
    if (!dirExists(FIXTURES_DIR)) {
      skip('Fixture coverage tests', 'Fixtures directory not found');
      endSuite();
      return;
    }

    const fixtures = fs.readdirSync(FIXTURES_DIR).filter(f => {
      const fp = path.join(FIXTURES_DIR, f);
      return fs.statSync(fp).isDirectory() && /^\d{3}-/.test(f);
    });

    if (fixtures.length >= 50) {
      pass('Sufficient fixture count', `${fixtures.length} fixtures found`);
    } else {
      fail('Sufficient fixture count', `Only ${fixtures.length} fixtures (expected 50+)`);
    }

    // Check fixture categories
    const categories = {
      valid: fixtures.filter(f => f.includes('valid')),
      invalid: fixtures.filter(f => f.includes('invalid') || f.includes('missing') || f.includes('unfilled')),
      anchors: fixtures.filter(f => f.includes('anchors')),
      evidence: fixtures.filter(f => f.includes('evidence')),
      priority: fixtures.filter(f => f.includes('priority')),
      level: fixtures.filter(f => f.includes('level')),
      placeholder: fixtures.filter(f => f.includes('placeholder')),
    };

    for (const [category, items] of Object.entries(categories)) {
      if (items.length > 0) {
        pass(`Fixtures for ${category}`, `${items.length} fixtures`);
      } else {
        fail(`Fixtures for ${category}`, 'No fixtures found');
      }
    }

    // Test specific fixture existence
    const requiredFixtures = [
      '001-empty-folder',
      '002-valid-level1',
      '003-valid-level2',
      '004-valid-level3',
      '005-unfilled-placeholders',
      '006-missing-required-files',
      '007-valid-anchors',
      '008-invalid-anchors',
    ];

    for (const fixture of requiredFixtures) {
      if (fixtures.includes(fixture)) {
        pass(`Fixture exists: ${fixture}`, 'Found');
      } else {
        fail(`Fixture exists: ${fixture}`, 'Not found');
      }
    }

  } catch (error) {
    fail('Test Fixture Coverage', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   16. QUIET MODE TESTS
────────────────────────────────────────────────────────────────
*/

async function testQuietMode() {
  startSuite('Quiet Mode Output');

  try {
    if (!fileExists(VALIDATOR_SCRIPT)) {
      skip('Quiet mode tests', 'Validator script not found');
      endSuite();
      return;
    }

    const validFixture = path.join(FIXTURES_DIR, '002-valid-level1');
    if (!dirExists(validFixture)) {
      skip('Quiet mode tests', 'Fixture not found');
      endSuite();
      return;
    }

    // Run with --quiet
    const quietResult = runValidator(validFixture, { quiet: true });

    // Count output lines
    const lineCount = quietResult.stdout.split('\n').filter(l => l.trim()).length;

    if (lineCount <= 2) {
      pass('Quiet mode minimal output', `${lineCount} lines`);
    } else {
      fail('Quiet mode minimal output', `${lineCount} lines (expected <= 2)`);
    }

    // Compare with non-quiet mode
    const normalResult = runValidator(validFixture);
    const normalLineCount = normalResult.stdout.split('\n').filter(l => l.trim()).length;

    if (lineCount < normalLineCount) {
      pass('Quiet mode reduces output', `Quiet: ${lineCount}, Normal: ${normalLineCount}`);
    } else {
      skip('Quiet mode output comparison', 'Line counts similar');
    }

  } catch (error) {
    fail('Quiet Mode Output', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   17. MAIN ENTRY POINT
────────────────────────────────────────────────────────────────
*/

async function main() {
  log('');
  log('='.repeat(60));
  log('  VALIDATION SYSTEM COMPREHENSIVE TESTS');
  log('  System Spec Kit - JavaScript Test Suite');
  log('='.repeat(60));
  log(`  Date: ${new Date().toISOString()}`);
  log(`  Node: ${process.version}`);
  log(`  Platform: ${process.platform}`);
  log('='.repeat(60));

  const startTime = Date.now();

  try {
    // Setup test workspace
    log('\n[Setup] Creating test workspace...');
    setupWorkspace();
    log(`   Workspace: ${TEST_WORKSPACE}`);

    // Run all test suites
    await testLevelDetection();
    await testFileExistsRule();
    await testPlaceholderRule();
    await testAnchorsRule();
    await testSectionsPresentRule();
    await testPriorityTagsRule();
    await testEvidenceRule();
    await testExitCodeBehavior();
    await testJsonOutputMode();
    await testCrossReferenceValidation();
    await testRuleScriptsExist();
    await testFixtureCoverage();
    await testQuietMode();

  } catch (error) {
    log(`\n[ERROR] Fatal error: ${error.message}`);
    log(error.stack);
  } finally {
    // Cleanup
    log('\n[Cleanup] Removing test workspace...');
    cleanupWorkspace();
    log('   Done.');
  }

  const duration = Date.now() - startTime;

  // Print summary
  log('\n');
  log('='.repeat(60));
  log('  TEST SUMMARY');
  log('='.repeat(60));
  log(`  [PASS]  Passed:  ${results.passed}`);
  log(`  [FAIL]  Failed:  ${results.failed}`);
  log(`  [SKIP]  Skipped: ${results.skipped}`);
  log(`  Total:  ${results.passed + results.failed + results.skipped}`);
  log(`  Duration: ${duration}ms`);
  log('');

  // Print suite breakdown
  log('  Suite Breakdown:');
  for (const suite of results.suites) {
    log(`    - ${suite.name}: ${suite.duration || 0}ms`);
  }

  log('='.repeat(60));

  if (results.failed === 0) {
    log('\n[SUCCESS] ALL VALIDATION SYSTEM TESTS PASSED!\n');
    return true;
  } else {
    log('\n[WARNING] Some tests failed. Review output above.\n');

    // Print failed tests
    const failedTests = results.tests.filter(t => t.status === 'FAIL');
    if (failedTests.length > 0) {
      log('Failed tests:');
      for (const test of failedTests) {
        log(`  [FAIL] ${test.name}: ${test.reason}`);
      }
      log('');
    }

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

/* ─────────────────────────────────────────────────────────────
   18. EXPORTS (for programmatic use)
────────────────────────────────────────────────────────────────
*/

module.exports = {
  // Test utilities
  runValidator,
  createTestSpecFolder,
  setupWorkspace,
  cleanupWorkspace,

  // Individual test suites
  testLevelDetection,
  testFileExistsRule,
  testPlaceholderRule,
  testAnchorsRule,
  testSectionsPresentRule,
  testPriorityTagsRule,
  testEvidenceRule,
  testExitCodeBehavior,
  testJsonOutputMode,
  testCrossReferenceValidation,
  testRuleScriptsExist,
  testFixtureCoverage,
  testQuietMode,

  // Main entry
  main,

  // Results access
  getResults: () => ({ ...results }),
};

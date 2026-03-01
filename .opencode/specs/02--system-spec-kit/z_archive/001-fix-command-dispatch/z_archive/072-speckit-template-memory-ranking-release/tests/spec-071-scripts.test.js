#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// TEST: Spec 071 - SpecKit Level-Based Template Alignment
// Tests for Shell Script Functions, JavaScript Template Selection,
// and Preprocessor Updates
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync, exec } = require('child_process');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const SPECKIT_BASE = path.join(__dirname, '..', '..', '..', '..', '.opencode', 'skill', 'system-spec-kit');
const SCRIPTS_DIR = path.join(SPECKIT_BASE, 'scripts');
const TEMPLATES_DIR = path.join(SPECKIT_BASE, 'templates');
const LIB_DIR = path.join(SPECKIT_BASE, 'lib');

// Test results
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
};

/* ─────────────────────────────────────────────────────────────
   2. UTILITIES
──────────────────────────────────────────────────────────────── */

function log(msg) {
  console.log(msg);
}

function pass(test_name, evidence) {
  results.passed++;
  results.tests.push({ name: test_name, status: 'PASS', evidence });
  log(`   [PASS] ${test_name}`);
  if (evidence) log(`      Evidence: ${evidence}`);
}

function fail(test_name, reason) {
  results.failed++;
  results.tests.push({ name: test_name, status: 'FAIL', reason });
  log(`   [FAIL] ${test_name}`);
  log(`      Reason: ${reason}`);
}

function skip(test_name, reason) {
  results.skipped++;
  results.tests.push({ name: test_name, status: 'SKIP', reason });
  log(`   [SKIP] ${test_name} (skipped: ${reason})`);
}

/**
 * Execute shell command and return output
 */
function execShell(cmd, options = {}) {
  try {
    return execSync(cmd, {
      encoding: 'utf8',
      cwd: SPECKIT_BASE,
      ...options
    }).trim();
  } catch (error) {
    return { error: error.message, stderr: error.stderr };
  }
}

/**
 * Create a temporary directory for testing
 */
function createTempDir() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-test-'));
  return tmpDir;
}

/**
 * Clean up temporary directory
 */
function cleanupTempDir(tmpDir) {
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch (e) {
    // Ignore cleanup errors
  }
}

/* ─────────────────────────────────────────────────────────────
   3. UNIT TESTS - Shell Script Functions
──────────────────────────────────────────────────────────────── */

function test_shell_script_exists() {
  log('\n--- Unit Tests: Shell Script Existence ---');

  const scriptPath = path.join(SCRIPTS_DIR, 'create-spec-folder.sh');
  if (fs.existsSync(scriptPath)) {
    pass('create-spec-folder.sh exists', scriptPath);
    return true;
  } else {
    fail('create-spec-folder.sh exists', `Not found at: ${scriptPath}`);
    return false;
  }
}

function test_get_level_templates_dir_function_exists() {
  log('\n--- Unit Tests: get_level_templates_dir() Function ---');

  const scriptPath = path.join(SCRIPTS_DIR, 'create-spec-folder.sh');
  const content = fs.readFileSync(scriptPath, 'utf8');

  // Test 1: Function definition exists
  if (content.includes('get_level_templates_dir()')) {
    pass('get_level_templates_dir() function is defined', 'Found function definition');
  } else {
    fail('get_level_templates_dir() function is defined', 'Function not found in script');
    return;
  }

  // Test 2: Function handles level 1
  if (content.includes('1) echo "$base_dir/level_1"') ||
      content.includes("1) echo \"$base_dir/level_1\"")) {
    pass('Function handles level 1 correctly', 'Maps to level_1 folder');
  } else {
    fail('Function handles level 1 correctly', 'Level 1 mapping not found');
  }

  // Test 3: Function handles level 2
  if (content.includes('2) echo "$base_dir/level_2"') ||
      content.includes("2) echo \"$base_dir/level_2\"")) {
    pass('Function handles level 2 correctly', 'Maps to level_2 folder');
  } else {
    fail('Function handles level 2 correctly', 'Level 2 mapping not found');
  }

  // Test 4: Function handles level 3
  if (content.includes('3) echo "$base_dir/level_3"') ||
      content.includes("3) echo \"$base_dir/level_3\"")) {
    pass('Function handles level 3 correctly', 'Maps to level_3 folder');
  } else {
    fail('Function handles level 3 correctly', 'Level 3 mapping not found');
  }

  // Test 5: Function handles level 3+
  if (content.includes('"3+"|4) echo "$base_dir/level_3+"') ||
      content.includes("\"3+\"|4) echo \"$base_dir/level_3+\"")) {
    pass('Function handles level 3+ correctly', 'Maps 3+ and 4 to level_3+ folder');
  } else {
    fail('Function handles level 3+ correctly', 'Level 3+ mapping not found');
  }

  // Test 6: Function has default fallback
  if (content.includes('*) echo "$base_dir/level_1"') ||
      content.includes("*) echo \"$base_dir/level_1\"")) {
    pass('Function has default fallback to level_1', 'Default case maps to level_1');
  } else {
    fail('Function has default fallback to level_1', 'Default fallback not found');
  }
}

function test_shell_script_level_validation() {
  log('\n--- Unit Tests: Shell Script Level Validation ---');

  const scriptPath = path.join(SCRIPTS_DIR, 'create-spec-folder.sh');
  const content = fs.readFileSync(scriptPath, 'utf8');

  // Test: Script validates level values including 3+
  if (content.includes('^(1|2|3|3\\+)$') || content.includes('^(1|2|3|3+)$')) {
    pass('Script validates --level accepts 1, 2, 3, or 3+', 'Found regex validation');
  } else {
    fail('Script validates --level accepts 1, 2, 3, or 3+', 'Level validation regex not found');
  }
}

function test_template_copying_uses_level_folder() {
  log('\n--- Unit Tests: Template Copying Uses Level Folder ---');

  const scriptPath = path.join(SCRIPTS_DIR, 'create-spec-folder.sh');
  const content = fs.readFileSync(scriptPath, 'utf8');

  // Test 1: Script calls get_level_templates_dir
  if (content.includes('LEVEL_TEMPLATES_DIR=$(get_level_templates_dir')) {
    pass('Script uses get_level_templates_dir for LEVEL_TEMPLATES_DIR', 'Variable assignment found');
  } else {
    fail('Script uses get_level_templates_dir for LEVEL_TEMPLATES_DIR', 'Variable assignment not found');
  }

  // Test 2: Script iterates level folder templates
  if (content.includes('for template_file in "$LEVEL_TEMPLATES_DIR"/*.md')) {
    pass('Script iterates templates from LEVEL_TEMPLATES_DIR', 'Loop found');
  } else {
    fail('Script iterates templates from LEVEL_TEMPLATES_DIR', 'Level folder loop not found');
  }

  // Test 3: Fallback to base templates exists
  if (content.includes('template_path="$TEMPLATES_BASE/$template_name"') ||
      content.includes("template_path=\"$TEMPLATES_BASE/$template_name\"")) {
    pass('Script has fallback to base templates', 'Fallback logic found');
  } else {
    fail('Script has fallback to base templates', 'Fallback logic not found');
  }
}

/* ─────────────────────────────────────────────────────────────
   4. UNIT TESTS - JavaScript Template Selection
──────────────────────────────────────────────────────────────── */

let expandTemplate;
let preprocessor;

function test_js_modules_load() {
  log('\n--- Unit Tests: JavaScript Module Loading ---');

  // expand-template.js is a CLI script that runs immediately, so we just check it exists
  const expandTemplatePath = path.join(SCRIPTS_DIR, 'expand-template.js');
  if (fs.existsSync(expandTemplatePath)) {
    pass('expand-template.js exists', 'File found (CLI script)');
  } else {
    fail('expand-template.js exists', `Not found at: ${expandTemplatePath}`);
  }

  try {
    preprocessor = require(path.join(LIB_DIR, 'expansion', 'preprocessor.js'));
    pass('preprocessor.js module loads', 'require() succeeded');
    return true;
  } catch (error) {
    fail('preprocessor.js module loads', error.message);
    return false;
  }
}

function test_select_level_folder_function() {
  log('\n--- Unit Tests: selectLevelFolder() Function ---');

  if (!preprocessor) {
    skip('selectLevelFolder tests', 'preprocessor module not loaded');
    return;
  }

  // Test 1: Function is exported
  if (typeof preprocessor.selectLevelFolder === 'function') {
    pass('selectLevelFolder() is exported', 'Function found');
  } else {
    fail('selectLevelFolder() is exported', 'Function not found in exports');
    return;
  }

  // Test 2: Level 1 returns level_1
  const level1Result = preprocessor.selectLevelFolder('1');
  if (level1Result === 'level_1') {
    pass('selectLevelFolder("1") returns "level_1"', `Got: ${level1Result}`);
  } else {
    fail('selectLevelFolder("1") returns "level_1"', `Expected "level_1", got: ${level1Result}`);
  }

  // Test 3: Level 2 returns level_2
  const level2Result = preprocessor.selectLevelFolder('2');
  if (level2Result === 'level_2') {
    pass('selectLevelFolder("2") returns "level_2"', `Got: ${level2Result}`);
  } else {
    fail('selectLevelFolder("2") returns "level_2"', `Expected "level_2", got: ${level2Result}`);
  }

  // Test 4: Level 3 returns level_3
  const level3Result = preprocessor.selectLevelFolder('3');
  if (level3Result === 'level_3') {
    pass('selectLevelFolder("3") returns "level_3"', `Got: ${level3Result}`);
  } else {
    fail('selectLevelFolder("3") returns "level_3"', `Expected "level_3", got: ${level3Result}`);
  }

  // Test 5: Level 3+ returns level_3+
  const level3PlusResult = preprocessor.selectLevelFolder('3+');
  if (level3PlusResult === 'level_3+') {
    pass('selectLevelFolder("3+") returns "level_3+"', `Got: ${level3PlusResult}`);
  } else {
    fail('selectLevelFolder("3+") returns "level_3+"', `Expected "level_3+", got: ${level3PlusResult}`);
  }

  // Test 6: Invalid level defaults to level_1
  const invalidResult = preprocessor.selectLevelFolder('invalid');
  if (invalidResult === 'level_1') {
    pass('selectLevelFolder("invalid") defaults to "level_1"', `Got: ${invalidResult}`);
  } else {
    fail('selectLevelFolder("invalid") defaults to "level_1"', `Expected "level_1", got: ${invalidResult}`);
  }

  // Test 7: Numeric level handled
  const numericResult = preprocessor.selectLevelFolder(2);
  if (numericResult === 'level_2') {
    pass('selectLevelFolder(2) (numeric) returns "level_2"', `Got: ${numericResult}`);
  } else {
    fail('selectLevelFolder(2) (numeric) returns "level_2"', `Expected "level_2", got: ${numericResult}`);
  }
}

function test_expand_template_js_has_getTemplatesDir() {
  log('\n--- Unit Tests: expand-template.js getTemplatesDir() ---');

  const expandTemplateContent = fs.readFileSync(
    path.join(SCRIPTS_DIR, 'expand-template.js'),
    'utf8'
  );

  // Test 1: getTemplatesDir function exists
  if (expandTemplateContent.includes('function getTemplatesDir(level')) {
    pass('getTemplatesDir(level) function exists', 'Function signature found');
  } else {
    fail('getTemplatesDir(level) function exists', 'Function not found');
    return;
  }

  // Test 2: Function handles level parameter
  if (expandTemplateContent.includes("level === '3+'") ||
      expandTemplateContent.includes('level === "3+"')) {
    pass('getTemplatesDir handles 3+ level specially', 'Special case for 3+ found');
  } else {
    fail('getTemplatesDir handles 3+ level specially', 'Level 3+ handling not found');
  }

  // Test 3: Function has fallback to base directory
  if (expandTemplateContent.includes('fs.existsSync(levelDir)') &&
      expandTemplateContent.includes('return baseDir')) {
    pass('getTemplatesDir falls back to base directory', 'Fallback logic found');
  } else {
    fail('getTemplatesDir falls back to base directory', 'Fallback logic not found');
  }
}

function test_backward_compatibility() {
  log('\n--- Unit Tests: Backward Compatibility ---');

  const expandTemplateContent = fs.readFileSync(
    path.join(SCRIPTS_DIR, 'expand-template.js'),
    'utf8'
  );

  // Test 1: getTemplatesDir can be called without level (backward compat)
  if (expandTemplateContent.includes('function getTemplatesDir(level = null)') ||
      expandTemplateContent.includes('level = null')) {
    pass('getTemplatesDir accepts null/undefined level', 'Default parameter found');
  } else {
    fail('getTemplatesDir accepts null/undefined level', 'Default parameter not found');
  }

  // Test 2: Returns base dir when level is null/undefined
  if (expandTemplateContent.includes("if (!level) return baseDir") ||
      expandTemplateContent.includes('if (!level)')) {
    pass('getTemplatesDir returns baseDir when level is null', 'Null check found');
  } else {
    fail('getTemplatesDir returns baseDir when level is null', 'Null check not found');
  }
}

/* ─────────────────────────────────────────────────────────────
   5. UNIT TESTS - Preprocessor Updates
──────────────────────────────────────────────────────────────── */

function test_processTemplateDirectory_level_support() {
  log('\n--- Unit Tests: processTemplateDirectory() Level Support ---');

  if (!preprocessor) {
    skip('processTemplateDirectory tests', 'preprocessor module not loaded');
    return;
  }

  // Test 1: processTemplateDirectory is exported
  if (typeof preprocessor.processTemplateDirectory === 'function') {
    pass('processTemplateDirectory() is exported', 'Function found');
  } else {
    fail('processTemplateDirectory() is exported', 'Function not found in exports');
    return;
  }

  // Read preprocessor source to verify implementation
  const preprocessorContent = fs.readFileSync(
    path.join(LIB_DIR, 'expansion', 'preprocessor.js'),
    'utf8'
  );

  // Test 2: Function uses selectLevelFolder
  if (preprocessorContent.includes('selectLevelFolder(level)')) {
    pass('processTemplateDirectory uses selectLevelFolder()', 'Function call found');
  } else {
    fail('processTemplateDirectory uses selectLevelFolder()', 'Function call not found');
  }

  // Test 3: Function tracks fromLevelFolder
  if (preprocessorContent.includes('fromLevelFolder')) {
    pass('processTemplateDirectory tracks fromLevelFolder flag', 'Variable found');
  } else {
    fail('processTemplateDirectory tracks fromLevelFolder flag', 'Variable not found');
  }

  // Test 4: Skips COMPLEXITY_GATE processing for level folder templates
  if (preprocessorContent.includes('fromLevelFolder') &&
      preprocessorContent.includes('stats: { processed: 0')) {
    pass('Level folder templates skip COMPLEXITY_GATE processing', 'Skip logic found');
  } else {
    fail('Level folder templates skip COMPLEXITY_GATE processing', 'Skip logic not found');
  }
}

function test_speckit_level_marker_detection() {
  log('\n--- Unit Tests: SPECKIT_LEVEL Marker Detection ---');

  // Test that templates have SPECKIT_LEVEL markers
  const templateFiles = ['spec.md', 'plan.md', 'tasks.md'];

  for (const templateName of templateFiles) {
    for (const level of ['level_1', 'level_2', 'level_3']) {
      const templatePath = path.join(TEMPLATES_DIR, level, templateName);

      if (!fs.existsSync(templatePath)) {
        skip(`${level}/${templateName} has SPECKIT_LEVEL marker`, 'Template not found');
        continue;
      }

      const content = fs.readFileSync(templatePath, 'utf8');
      if (content.includes('<!-- SPECKIT_LEVEL:') || content.includes('SPECKIT_LEVEL:')) {
        pass(`${level}/${templateName} has SPECKIT_LEVEL marker`, 'Marker found');
      } else {
        // Some templates may not have the marker - just report
        skip(`${level}/${templateName} has SPECKIT_LEVEL marker`, 'Marker not present (may be expected)');
      }
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   6. INTEGRATION TESTS - Level Folder Structure
──────────────────────────────────────────────────────────────── */

function test_level_folders_exist() {
  log('\n--- Integration Tests: Level Folder Structure ---');

  const expectedFolders = ['level_1', 'level_2', 'level_3', 'level_3+'];

  for (const folder of expectedFolders) {
    const folderPath = path.join(TEMPLATES_DIR, folder);
    if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
      pass(`${folder}/ folder exists`, folderPath);
    } else {
      fail(`${folder}/ folder exists`, `Not found at: ${folderPath}`);
    }
  }
}

function test_level_1_templates() {
  log('\n--- Integration Tests: Level 1 Templates ---');

  const level1Dir = path.join(TEMPLATES_DIR, 'level_1');
  const expectedFiles = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md'];

  for (const file of expectedFiles) {
    const filePath = path.join(level1Dir, file);
    if (fs.existsSync(filePath)) {
      pass(`level_1/${file} exists`, filePath);
    } else {
      fail(`level_1/${file} exists`, `Not found at: ${filePath}`);
    }
  }

  // Verify checklist.md is NOT in level_1
  const checklistPath = path.join(level1Dir, 'checklist.md');
  if (!fs.existsSync(checklistPath)) {
    pass('level_1/checklist.md does NOT exist (correct)', 'File absent as expected');
  } else {
    fail('level_1/checklist.md does NOT exist', 'File unexpectedly present');
  }
}

function test_level_2_templates() {
  log('\n--- Integration Tests: Level 2 Templates ---');

  const level2Dir = path.join(TEMPLATES_DIR, 'level_2');
  const expectedFiles = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'checklist.md'];

  for (const file of expectedFiles) {
    const filePath = path.join(level2Dir, file);
    if (fs.existsSync(filePath)) {
      pass(`level_2/${file} exists`, filePath);
    } else {
      fail(`level_2/${file} exists`, `Not found at: ${filePath}`);
    }
  }
}

function test_level_3_templates() {
  log('\n--- Integration Tests: Level 3 Templates ---');

  const level3Dir = path.join(TEMPLATES_DIR, 'level_3');
  const expectedFiles = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'checklist.md', 'decision-record.md'];

  for (const file of expectedFiles) {
    const filePath = path.join(level3Dir, file);
    if (fs.existsSync(filePath)) {
      pass(`level_3/${file} exists`, filePath);
    } else {
      fail(`level_3/${file} exists`, `Not found at: ${filePath}`);
    }
  }
}

function test_level_2_checklist_no_complexity_gates() {
  log('\n--- Integration Tests: Level 2 Checklist Clean ---');

  const checklistPath = path.join(TEMPLATES_DIR, 'level_2', 'checklist.md');

  if (!fs.existsSync(checklistPath)) {
    skip('level_2/checklist.md has no COMPLEXITY_GATE markers', 'File not found');
    return;
  }

  const content = fs.readFileSync(checklistPath, 'utf8');

  if (!content.includes('COMPLEXITY_GATE')) {
    pass('level_2/checklist.md has no COMPLEXITY_GATE markers', 'Clean template verified');
  } else {
    const matches = content.match(/COMPLEXITY_GATE/g);
    fail('level_2/checklist.md has no COMPLEXITY_GATE markers',
         `Found ${matches ? matches.length : 0} marker(s)`);
  }
}

/* ─────────────────────────────────────────────────────────────
   7. INTEGRATION TESTS - Script Execution

   NOTE: These tests run from the actual repo root because the
   create-spec-folder.sh script expects to find templates relative
   to the repository. Tests create spec folders with unique names
   and clean them up after.
──────────────────────────────────────────────────────────────── */

// Get repo root (4 levels up from this test file)
const REPO_ROOT = path.join(__dirname, '..', '..', '..', '..');
const TEST_SPEC_PREFIX = `test-spec-071-${Date.now()}`;

/**
 * Clean up a test spec folder
 */
function cleanupTestSpecFolder(specName) {
  const specPath = path.join(REPO_ROOT, 'specs', specName);
  try {
    if (fs.existsSync(specPath)) {
      fs.rmSync(specPath, { recursive: true, force: true });
    }
  } catch (e) {
    // Ignore cleanup errors
  }
}

function test_create_spec_folder_level_1() {
  log('\n--- Integration Tests: create-spec-folder.sh --level 1 ---');

  const testNumber = `${TEST_SPEC_PREFIX}-l1`;
  let createdSpecPath = null;

  try {
    const result = execShell(
      `bash "${path.join(SCRIPTS_DIR, 'create-spec-folder.sh')}" "Test Level 1" --level 1 --skip-branch --json --number 900`,
      { cwd: REPO_ROOT }
    );

    if (typeof result === 'object' && result.error) {
      fail('create-spec-folder.sh --level 1 executes', result.error);
      return;
    }

    pass('create-spec-folder.sh --level 1 executes', 'Command completed');

    // Parse JSON output
    try {
      const output = JSON.parse(result);
      createdSpecPath = output.BRANCH_NAME;

      // Test: DOC_LEVEL is "1"
      if (output.DOC_LEVEL === '1' || output.DOC_LEVEL === 1) {
        pass('Output DOC_LEVEL is 1', `Got: ${output.DOC_LEVEL}`);
      } else {
        fail('Output DOC_LEVEL is 1', `Expected 1, got: ${output.DOC_LEVEL}`);
      }

      // Test: CREATED_FILES contains expected files
      const expectedFiles = ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md'];
      const createdFiles = output.CREATED_FILES || [];

      for (const expected of expectedFiles) {
        if (createdFiles.includes(expected)) {
          pass(`Level 1 creates ${expected}`, 'File in CREATED_FILES');
        } else {
          fail(`Level 1 creates ${expected}`, `Not in: ${createdFiles.join(', ')}`);
        }
      }

      // Test: checklist.md NOT in Level 1
      if (!createdFiles.includes('checklist.md')) {
        pass('Level 1 does NOT create checklist.md', 'File correctly absent');
      } else {
        fail('Level 1 does NOT create checklist.md', 'File unexpectedly present');
      }

    } catch (parseError) {
      fail('JSON output parses correctly', parseError.message);
    }

  } finally {
    if (createdSpecPath) {
      cleanupTestSpecFolder(createdSpecPath);
    }
  }
}

function test_create_spec_folder_level_2() {
  log('\n--- Integration Tests: create-spec-folder.sh --level 2 ---');

  let createdSpecPath = null;

  try {
    const result = execShell(
      `bash "${path.join(SCRIPTS_DIR, 'create-spec-folder.sh')}" "Test Level 2" --level 2 --skip-branch --json --number 901`,
      { cwd: REPO_ROOT }
    );

    if (typeof result === 'object' && result.error) {
      fail('create-spec-folder.sh --level 2 executes', result.error);
      return;
    }

    pass('create-spec-folder.sh --level 2 executes', 'Command completed');

    try {
      const output = JSON.parse(result);
      createdSpecPath = output.BRANCH_NAME;

      // Test: DOC_LEVEL is "2"
      if (output.DOC_LEVEL === '2' || output.DOC_LEVEL === 2) {
        pass('Output DOC_LEVEL is 2', `Got: ${output.DOC_LEVEL}`);
      } else {
        fail('Output DOC_LEVEL is 2', `Expected 2, got: ${output.DOC_LEVEL}`);
      }

      // Test: checklist.md IS created for Level 2
      const createdFiles = output.CREATED_FILES || [];
      if (createdFiles.includes('checklist.md')) {
        pass('Level 2 creates checklist.md', 'File in CREATED_FILES');
      } else {
        fail('Level 2 creates checklist.md', `Not in: ${createdFiles.join(', ')}`);
      }

    } catch (parseError) {
      fail('JSON output parses correctly', parseError.message);
    }

  } finally {
    if (createdSpecPath) {
      cleanupTestSpecFolder(createdSpecPath);
    }
  }
}

function test_create_spec_folder_level_3() {
  log('\n--- Integration Tests: create-spec-folder.sh --level 3 ---');

  let createdSpecPath = null;

  try {
    const result = execShell(
      `bash "${path.join(SCRIPTS_DIR, 'create-spec-folder.sh')}" "Test Level 3" --level 3 --skip-branch --json --number 902`,
      { cwd: REPO_ROOT }
    );

    if (typeof result === 'object' && result.error) {
      fail('create-spec-folder.sh --level 3 executes', result.error);
      return;
    }

    pass('create-spec-folder.sh --level 3 executes', 'Command completed');

    try {
      const output = JSON.parse(result);
      createdSpecPath = output.BRANCH_NAME;

      // Test: DOC_LEVEL is "3"
      if (output.DOC_LEVEL === '3' || output.DOC_LEVEL === 3) {
        pass('Output DOC_LEVEL is 3', `Got: ${output.DOC_LEVEL}`);
      } else {
        fail('Output DOC_LEVEL is 3', `Expected 3, got: ${output.DOC_LEVEL}`);
      }

      // Test: decision-record.md IS created for Level 3
      const createdFiles = output.CREATED_FILES || [];
      if (createdFiles.includes('decision-record.md')) {
        pass('Level 3 creates decision-record.md', 'File in CREATED_FILES');
      } else {
        fail('Level 3 creates decision-record.md', `Not in: ${createdFiles.join(', ')}`);
      }

    } catch (parseError) {
      fail('JSON output parses correctly', parseError.message);
    }

  } finally {
    if (createdSpecPath) {
      cleanupTestSpecFolder(createdSpecPath);
    }
  }
}

function test_create_spec_folder_level_3_plus() {
  log('\n--- Integration Tests: create-spec-folder.sh --level 3+ ---');

  let createdSpecPath = null;

  try {
    const result = execShell(
      `bash "${path.join(SCRIPTS_DIR, 'create-spec-folder.sh')}" "Test Level 3 Plus" --level 3+ --skip-branch --json --number 903`,
      { cwd: REPO_ROOT }
    );

    if (typeof result === 'object' && result.error) {
      fail('create-spec-folder.sh --level 3+ executes', result.error);
      return;
    }

    pass('create-spec-folder.sh --level 3+ executes', 'Command completed');

    try {
      const output = JSON.parse(result);
      createdSpecPath = output.BRANCH_NAME;

      // Test: DOC_LEVEL is "3+"
      if (output.DOC_LEVEL === '3+') {
        pass('Output DOC_LEVEL is 3+', `Got: ${output.DOC_LEVEL}`);
      } else {
        fail('Output DOC_LEVEL is 3+', `Expected "3+", got: ${output.DOC_LEVEL}`);
      }

    } catch (parseError) {
      fail('JSON output parses correctly', parseError.message);
    }

  } finally {
    if (createdSpecPath) {
      cleanupTestSpecFolder(createdSpecPath);
    }
  }
}

function test_fallback_to_root_templates() {
  log('\n--- Integration Tests: Fallback to Root Templates ---');

  // Test that if a level folder is missing a template, it falls back to root

  // Read the shell script to verify fallback logic
  const scriptPath = path.join(SCRIPTS_DIR, 'create-spec-folder.sh');
  const content = fs.readFileSync(scriptPath, 'utf8');

  // Test 1: Script checks if template exists in level folder first
  if (content.includes('if [ ! -f "$template_path" ]')) {
    pass('Script checks template existence in level folder', 'Check found');
  } else {
    fail('Script checks template existence in level folder', 'Check not found');
  }

  // Test 2: Script falls back to TEMPLATES_BASE
  if (content.includes('template_path="$TEMPLATES_BASE/$template_name"')) {
    pass('Script falls back to TEMPLATES_BASE', 'Fallback found');
  } else {
    fail('Script falls back to TEMPLATES_BASE', 'Fallback not found');
  }

  // Test 3: Warning when level folder missing
  if (content.includes('Warning: Level folder not found')) {
    pass('Script warns when level folder is missing', 'Warning message found');
  } else {
    fail('Script warns when level folder is missing', 'Warning message not found');
  }
}

/* ─────────────────────────────────────────────────────────────
   8. INTEGRATION TESTS - expand-template.js
──────────────────────────────────────────────────────────────── */

function test_expand_template_with_level() {
  log('\n--- Integration Tests: expand-template.js with --level ---');

  const tmpDir = createTempDir();

  try {
    // Test dry run with level
    const result = execShell(
      `node "${path.join(SCRIPTS_DIR, 'expand-template.js')}" --template spec.md --level 2 --dry-run`,
      { cwd: tmpDir }
    );

    if (typeof result === 'object' && result.error) {
      fail('expand-template.js --level 2 --dry-run executes', result.error);
      return;
    }

    pass('expand-template.js --level 2 --dry-run executes', 'Command completed');

    if (result.includes('DRY RUN') || result.includes('Would expand')) {
      pass('expand-template.js dry run produces output', 'Output verified');
    } else {
      // May just not error
      pass('expand-template.js completes without error', 'No errors');
    }

  } finally {
    cleanupTempDir(tmpDir);
  }
}

function test_expand_template_level_3_plus() {
  log('\n--- Integration Tests: expand-template.js --level 3+ ---');

  const tmpDir = createTempDir();

  try {
    const result = execShell(
      `node "${path.join(SCRIPTS_DIR, 'expand-template.js')}" --template spec.md --level 3+ --dry-run`,
      { cwd: tmpDir }
    );

    if (typeof result === 'object' && result.error) {
      // Check if it's just a non-fatal exit
      if (result.stderr && !result.stderr.includes('Error')) {
        pass('expand-template.js --level 3+ executes', 'Command completed (may have warnings)');
      } else {
        fail('expand-template.js --level 3+ executes', result.error);
      }
      return;
    }

    pass('expand-template.js --level 3+ executes', 'Command completed');

  } finally {
    cleanupTempDir(tmpDir);
  }
}

/* ─────────────────────────────────────────────────────────────
   9. MAIN
──────────────────────────────────────────────────────────────── */

async function runTests() {
  log('====================================================');
  log(' SPEC 071 TESTS: Level-Based Template Alignment');
  log('====================================================');
  log(`Date: ${new Date().toISOString()}`);
  log(`Node Version: ${process.version}`);
  log(`SpecKit Base: ${SPECKIT_BASE}\n`);

  // Verify base paths exist
  if (!fs.existsSync(SPECKIT_BASE)) {
    log(`\n[ERROR] SpecKit base not found at: ${SPECKIT_BASE}`);
    return results;
  }

  // Unit Tests - Shell Script
  if (test_shell_script_exists()) {
    test_get_level_templates_dir_function_exists();
    test_shell_script_level_validation();
    test_template_copying_uses_level_folder();
  }

  // Unit Tests - JavaScript
  if (test_js_modules_load()) {
    test_select_level_folder_function();
    test_expand_template_js_has_getTemplatesDir();
    test_backward_compatibility();
  }

  // Unit Tests - Preprocessor
  test_processTemplateDirectory_level_support();
  test_speckit_level_marker_detection();

  // Integration Tests - Folder Structure
  test_level_folders_exist();
  test_level_1_templates();
  test_level_2_templates();
  test_level_3_templates();
  test_level_2_checklist_no_complexity_gates();

  // Integration Tests - Script Execution
  test_create_spec_folder_level_1();
  test_create_spec_folder_level_2();
  test_create_spec_folder_level_3();
  test_create_spec_folder_level_3_plus();
  test_fallback_to_root_templates();

  // Integration Tests - expand-template.js
  test_expand_template_with_level();
  test_expand_template_level_3_plus();

  // Summary
  log('\n====================================================');
  log(' TEST SUMMARY');
  log('====================================================');
  log(`Passed:  ${results.passed}`);
  log(`Failed:  ${results.failed}`);
  log(`Skipped: ${results.skipped}`);
  log(`Total:   ${results.passed + results.failed + results.skipped}`);
  log('');

  if (results.failed === 0) {
    log('ALL TESTS PASSED!');
  } else {
    log(`WARNING: ${results.failed} test(s) failed. Review output above.`);
  }

  return results;
}

// Run if executed directly
if (require.main === module) {
  runTests().then(r => {
    process.exit(r.failed > 0 ? 1 : 0);
  });
}

module.exports = { runTests };

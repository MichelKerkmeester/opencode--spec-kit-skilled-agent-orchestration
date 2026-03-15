// ───────────────────────────────────────────────────────────────
// 1. TEST: END-TO-END INTEGRATION TESTS
// ───────────────────────────────────────────────────────────────
// Tests complete workflows: memory save, validation, cognitive memory,
// Spec folder creation, and checkpoints.

'use strict';

const path = require('path');
const fs = require('fs');
const { execSync, spawn } = require('child_process');
const crypto = require('crypto');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────
*/

const ROOT = path.join(__dirname, '..', '..');
const SCRIPTS_DIR = path.join(ROOT, 'scripts');
const MCP_SERVER_DIR = path.join(ROOT, 'mcp_server');
const TEMPLATES_DIR = path.join(ROOT, 'templates');
const TEST_WORKSPACE = path.join(ROOT, 'scripts', 'tests', '.test-workspace');
const TEST_SPECS_DIR = path.join(TEST_WORKSPACE, 'specs');

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
  suites: [],
};

// Test isolation state
let testDbPath = null;
let testSessionId = null;

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

function startSuite(name) {
  log(`\n🧪 ${name}`);
  log('─'.repeat(60));
  results.suites.push({ name, startTime: Date.now() });
}

function endSuite() {
  const suite = results.suites[results.suites.length - 1];
  if (suite) {
    suite.duration = Date.now() - suite.startTime;
    log(`   Duration: ${suite.duration}ms`);
  }
}

/* ─────────────────────────────────────────────────────────────
   3. SETUP & TEARDOWN HELPERS
────────────────────────────────────────────────────────────────
*/

/**
 * Create isolated test workspace
 * @returns {string} Path to test specs directory
 */
function setupTestWorkspace() {
  // Clean any existing test workspace
  if (fs.existsSync(TEST_WORKSPACE)) {
    fs.rmSync(TEST_WORKSPACE, { recursive: true, force: true });
  }

  // Create fresh workspace
  fs.mkdirSync(TEST_SPECS_DIR, { recursive: true });

  // Generate unique session ID for this test run
  testSessionId = `test-session-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

  // Create isolated test database
  testDbPath = path.join(TEST_WORKSPACE, 'test-context-index.sqlite');

  return TEST_SPECS_DIR;
}

/**
 * Cleanup test workspace
 */
function teardownTestWorkspace() {
  if (fs.existsSync(TEST_WORKSPACE)) {
    fs.rmSync(TEST_WORKSPACE, { recursive: true, force: true });
  }
  testDbPath = null;
  testSessionId = null;
}

/**
 * Create a test spec folder with given level
 * @param {string} name - Folder name (e.g., '001-test-feature')
 * @param {number} level - Documentation level (1, 2, or 3)
 * @returns {string} Path to created spec folder
 */
function createTestSpecFolder(name, level = 2) {
  const specPath = path.join(TEST_SPECS_DIR, name);
  fs.mkdirSync(specPath, { recursive: true });
  fs.mkdirSync(path.join(specPath, 'memory'), { recursive: true });
  fs.mkdirSync(path.join(specPath, 'scratch'), { recursive: true });

  // Copy templates based on level
  const levelDir = `level_${level}`;
  const templateSourceDir = path.join(TEMPLATES_DIR, levelDir);

  if (fs.existsSync(templateSourceDir)) {
    const templates = fs.readdirSync(templateSourceDir).filter(f => f.endsWith('.md'));
    for (const template of templates) {
      const content = fs.readFileSync(path.join(templateSourceDir, template), 'utf-8');
      fs.writeFileSync(path.join(specPath, template), content);
    }
  } else {
    // Fallback: create minimal files
    fs.writeFileSync(path.join(specPath, 'spec.md'), `# ${name}\n\n| **Level** | ${level} |\n\n## Overview\n\nTest spec folder.`);
    fs.writeFileSync(path.join(specPath, 'plan.md'), `# Plan\n\n## Implementation Steps\n\n- Step 1`);
    fs.writeFileSync(path.join(specPath, 'tasks.md'), `# Tasks\n\n- [ ] Task 1`);

    if (level >= 2) {
      fs.writeFileSync(path.join(specPath, 'checklist.md'), `# Checklist\n\n- [ ] P0: Required item`);
    }
    if (level >= 3) {
      fs.writeFileSync(path.join(specPath, 'decision-record.md'), `# Decision Record\n\n## ADR-001: Test Decision`);
    }
  }

  // Create .gitkeep files
  fs.writeFileSync(path.join(specPath, 'memory', '.gitkeep'), '');
  fs.writeFileSync(path.join(specPath, 'scratch', '.gitkeep'), '');

  return specPath;
}

/**
 * Create a memory file in a spec folder
 * @param {string} specPath - Path to spec folder
 * @param {string} filename - Memory filename
 * @param {object} options - Content options
 * @returns {string} Path to created memory file
 */
function createMemoryFile(specPath, filename, options = {}) {
  const {
    title = 'Test Memory',
    summary = 'Test summary content',
    anchors = ['summary', 'decisions'],
    triggerPhrases = ['test trigger', 'memory test'],
  } = options;

  const content = `# ${title}

<!-- ANCHOR:summary -->
## Summary
${summary}
<!-- /ANCHOR:summary -->

<!-- ANCHOR:decisions -->
## Decisions
- Decision 1: Test decision
<!-- /ANCHOR:decisions -->

## Trigger Phrases
${triggerPhrases.map(p => `- ${p}`).join('\n')}
`;

  const memoryPath = path.join(specPath, 'memory', filename);
  fs.writeFileSync(memoryPath, content);
  return memoryPath;
}

/**
 * Run a shell script and capture output
 * @param {string} script - Script path relative to scripts/
 * @param {string[]} args - Arguments
 * @returns {{ exitCode: number, stdout: string, stderr: string }}
 */
function runScript(script, args = []) {
  const scriptPath = path.join(SCRIPTS_DIR, script);

  try {
    const stdout = execSync(`bash "${scriptPath}" ${args.map(a => `"${a}"`).join(' ')}`, {
      cwd: TEST_WORKSPACE,
      encoding: 'utf-8',
      timeout: 30000,
      env: {
        ...process.env,
        MEMORY_DB_PATH: testDbPath,
        SPECKIT_SPECS_DIR: TEST_SPECS_DIR,
      },
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
 * Run a Node.js script
 * @param {string} script - Script path relative to scripts/
 * @param {string[]} args - Arguments
 * @returns {Promise<{ exitCode: number, stdout: string, stderr: string }>}
 */
async function runNodeScript(script, args = []) {
  const scriptPath = path.join(SCRIPTS_DIR, script);

  return new Promise((resolve) => {
    const proc = spawn('node', [scriptPath, ...args], {
      cwd: TEST_WORKSPACE,
      env: {
        ...process.env,
        MEMORY_DB_PATH: testDbPath,
        SPECKIT_SPECS_DIR: TEST_SPECS_DIR,
      },
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => { stdout += data.toString(); });
    proc.stderr.on('data', (data) => { stderr += data.toString(); });

    proc.on('close', (code) => {
      resolve({ exitCode: code || 0, stdout, stderr });
    });

    proc.on('error', (error) => {
      resolve({ exitCode: 1, stdout, stderr: error.message });
    });

    // Timeout after 60 seconds
    setTimeout(() => {
      proc.kill();
      resolve({ exitCode: 124, stdout, stderr: 'Timeout' });
    }, 60000);
  });
}

/* ─────────────────────────────────────────────────────────────
   4. WORKFLOW 1: MEMORY SAVE END-TO-END
────────────────────────────────────────────────────────────────
*/

async function testMemorySaveWorkflow() {
  startSuite('Workflow 1: Memory Save End-to-End');

  try {
    // Test 1.1: Create test spec folder
    const specPath = createTestSpecFolder('001-memory-save-test', 2);
    if (fs.existsSync(specPath)) {
      pass('W1-T1: Test spec folder created', specPath);
    } else {
      fail('W1-T1: Test spec folder created', 'Folder not created');
      return;
    }

    // Test 1.2: Create JSON input file for generate-context.js
    const jsonInput = {
      userPrompts: [
        { prompt: 'Test prompt 1', timestamp: new Date().toISOString() },
        { prompt: 'Test prompt 2', timestamp: new Date().toISOString() },
      ],
      observations: [
        { content: 'Created test file', type: 'file_created' },
      ],
      _specFolder: '001-memory-save-test',
    };

    const jsonPath = path.join(TEST_WORKSPACE, 'test-context-data.json');
    fs.writeFileSync(jsonPath, JSON.stringify(jsonInput, null, 2));

    if (fs.existsSync(jsonPath)) {
      pass('W1-T2: JSON input file created', jsonPath);
    } else {
      fail('W1-T2: JSON input file created', 'JSON file not created');
      return;
    }

    // Test 1.3: Check compiled generate-context entrypoint exists
    const generateContextPath = path.join(SCRIPTS_DIR, 'dist', 'memory', 'generate-context.js');
    if (fs.existsSync(generateContextPath)) {
      pass('W1-T3: generate-context.js exists', generateContextPath);
    } else {
      fail('W1-T3: generate-context.js exists', 'Compiled script not found');
      return;
    }

    // Test 1.4: Verify memory folder structure
    const memoryDir = path.join(specPath, 'memory');
    if (fs.existsSync(memoryDir)) {
      pass('W1-T4: Memory directory exists', memoryDir);
    } else {
      fail('W1-T4: Memory directory exists', 'Memory directory not created');
    }

    // Test 1.5: Verify workflow cleanup preserves valid anchor comments
    const { stripWorkflowHtmlOutsideCodeFences } = require(path.join(SCRIPTS_DIR, 'dist', 'core', 'workflow.js'));
    const testContent = `<!-- ANCHOR:test -->content<!-- /ANCHOR:test -->`;
    const cleanedContent = stripWorkflowHtmlOutsideCodeFences(testContent);

    if (cleanedContent.includes('<!-- ANCHOR:test -->') &&
        cleanedContent.includes('<!-- /ANCHOR:test -->')) {
      pass('W1-T5: Anchor validation works', 'Valid anchors survive workflow cleanup');
    } else {
      fail('W1-T5: Anchor validation works', 'Workflow cleanup removed valid anchor comments');
    }

    // Test 1.6: Verify unclosed anchors remain visible to downstream validators
    const badContent = `<!-- ANCHOR:unclosed -->content`;
    const badCleanedContent = stripWorkflowHtmlOutsideCodeFences(badContent);

    if (badCleanedContent.includes('<!-- ANCHOR:unclosed -->') &&
        !badCleanedContent.includes('<!-- /ANCHOR:unclosed -->')) {
      pass('W1-T6: Unclosed anchor detection', 'Unclosed opener survives cleanup for downstream validation');
    } else {
      fail('W1-T6: Unclosed anchor detection', 'Unclosed anchor was not preserved for downstream validation');
    }

  } catch (error) {
    fail('W1: Memory Save Workflow', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   5. WORKFLOW 2: VALIDATION PIPELINE
────────────────────────────────────────────────────────────────
*/

async function testValidationPipeline() {
  startSuite('Workflow 2: Validation Pipeline');

  try {
    const parseValidationJson = (stdout) => {
      try {
        const jsonMatch = stdout.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      } catch (_) {
        return null;
      }
    };

    // Test 2.1: Create valid Level 2 spec folder
    const specPath = createTestSpecFolder('002-validation-test', 2);

    // Fill in placeholders to make it valid
    const specContent = fs.readFileSync(path.join(specPath, 'spec.md'), 'utf-8');
    const filledSpec = specContent
      .replace(/\[YOUR_VALUE_HERE:[^\]]*\]/g, 'Test Value')
      .replace(/\{\{[^}]+\}\}/g, 'Filled Value')
      .replace(/\[NEEDS CLARIFICATION:[^\]]*\]/g, 'Clarified');
    fs.writeFileSync(path.join(specPath, 'spec.md'), filledSpec);

    if (fs.existsSync(specPath)) {
      pass('W2-T1: Created Level 2 spec folder', specPath);
    } else {
      fail('W2-T1: Created Level 2 spec folder', 'Folder creation failed');
      return;
    }

    // Test 2.2: Check validate.sh exists
    const validateScript = path.join(SCRIPTS_DIR, 'spec', 'validate.sh');
    if (fs.existsSync(validateScript)) {
      pass('W2-T2: validate.sh script exists', validateScript);
    } else {
      skip('W2-T2: validate.sh script exists', 'Script not found');
      return;
    }

    // Test 2.3: Run validation on valid folder
    const validResult = runScript('spec/validate.sh', [specPath, '--json']);
    const validJson = parseValidationJson(validResult.stdout);
    const hasStructuredResults = !!(validJson && Array.isArray(validJson.results));
    const hasFileExistsRule = hasStructuredResults && validJson.results.some(r => r.rule === 'FILE_EXISTS');

    if ([0, 1, 2].includes(validResult.exitCode) && hasFileExistsRule) {
      pass('W2-T3: Validation returns structured diagnostics',
           `Exit code: ${validResult.exitCode}, rules: ${validJson.results.length}`);
    } else {
      fail('W2-T3: Validation returns structured diagnostics',
           `Exit code: ${validResult.exitCode}, hasStructuredResults=${hasStructuredResults}`);
    }

    // Test 2.4: Introduce placeholder to cause warning/error
    const specWithPlaceholder = filledSpec + '\n\n[YOUR_VALUE_HERE: Missing value]\n';
    fs.writeFileSync(path.join(specPath, 'spec.md'), specWithPlaceholder);

    const placeholderResult = runScript('spec/validate.sh', [specPath, '--json']);
    const placeholderJson = parseValidationJson(placeholderResult.stdout);
    const placeholderRule = placeholderJson && Array.isArray(placeholderJson.results)
      ? placeholderJson.results.find(r => r.rule === 'PLACEHOLDER_FILLED')
      : null;

    if (placeholderResult.exitCode >= 1 && placeholderRule && placeholderRule.status !== 'pass') {
      pass('W2-T4: Placeholder detected causes warning/error',
           `Exit code: ${placeholderResult.exitCode}, status: ${placeholderRule.status}`);
    } else {
      fail('W2-T4: Placeholder detected causes warning/error',
           `Exit code: ${placeholderResult.exitCode}, rule=${placeholderRule ? placeholderRule.status : 'missing'}`);
    }

    // Test 2.5: Remove required file to cause error
    const checklistPath = path.join(specPath, 'checklist.md');
    const checklistBackup = fs.readFileSync(checklistPath, 'utf-8');
    fs.unlinkSync(checklistPath);

    const missingFileResult = runScript('spec/validate.sh', [specPath, '--json']);
    const missingFileJson = parseValidationJson(missingFileResult.stdout);
    const missingFileRule = missingFileJson && Array.isArray(missingFileJson.results)
      ? missingFileJson.results.find(r => r.rule === 'FILE_EXISTS')
      : null;

    // Restore checklist for cleanup
    fs.writeFileSync(checklistPath, checklistBackup);

    if (missingFileResult.exitCode >= 1 && missingFileRule && missingFileRule.status !== 'pass') {
      pass('W2-T5: Missing required file causes error',
           `Exit code: ${missingFileResult.exitCode}, FILE_EXISTS=${missingFileRule.status}`);
    } else {
      fail('W2-T5: Missing required file causes error',
           `Exit code: ${missingFileResult.exitCode}, FILE_EXISTS=${missingFileRule ? missingFileRule.status : 'missing'}`);
    }

    // Test 2.6: Verify individual rule scripts exist
    const ruleScripts = [
      'check-files.sh',
      'check-placeholders.sh',
      'check-sections.sh',
      'check-level.sh',
    ];

    let rulesExist = 0;
    for (const rule of ruleScripts) {
      const rulePath = path.join(SCRIPTS_DIR, 'rules', rule);
      if (fs.existsSync(rulePath)) {
        rulesExist++;
      }
    }

    if (rulesExist === ruleScripts.length) {
      pass('W2-T6: All core rule scripts exist', `${rulesExist}/${ruleScripts.length} rules`);
    } else {
      fail('W2-T6: All core rule scripts exist', `Only ${rulesExist}/${ruleScripts.length} rules found`);
    }

  } catch (error) {
    fail('W2: Validation Pipeline', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   6. WORKFLOW 3: COGNITIVE MEMORY SESSION
────────────────────────────────────────────────────────────────
*/

async function testCognitiveMemorySession() {
  startSuite('Workflow 3: Cognitive Memory Session');

  try {
    // Test 3.1: Check working-memory.js exists and exports correctly
    const workingMemoryPath = path.join(MCP_SERVER_DIR, 'dist', 'lib', 'cache', 'cognitive', 'working-memory.js');

    if (!fs.existsSync(workingMemoryPath)) {
      fail('W3-T1: working-memory.js exists', 'Module not found');
      return;
    }

    const workingMemory = require(workingMemoryPath);

    if (typeof workingMemory.init === 'function' &&
        typeof workingMemory.setAttentionScore === 'function' &&
        typeof workingMemory.getSessionMemories === 'function') {
      pass('W3-T1: working-memory.js exports correctly', 'All required functions present');
    } else {
      fail('W3-T1: working-memory.js exports correctly', 'Missing required functions');
      return;
    }

    // Test 3.2: Check attention-decay.js exists and exports correctly
    const attentionDecayPath = path.join(MCP_SERVER_DIR, 'dist', 'lib', 'cache', 'cognitive', 'attention-decay.js');

    if (!fs.existsSync(attentionDecayPath)) {
      fail('W3-T2: attention-decay.js exists', 'Module not found');
      return;
    }

    const attentionDecay = require(attentionDecayPath);

    if (typeof attentionDecay.init === 'function' &&
        typeof attentionDecay.calculateRetrievabilityDecay === 'function' &&
        typeof attentionDecay.getDecayRate === 'function' &&
        typeof attentionDecay.applyCompositeDecay === 'function') {
      pass('W3-T2: attention-decay.js exports correctly', 'All required functions present');
    } else {
      fail('W3-T2: attention-decay.js exports correctly', 'Missing required functions');
    }

    // Test 3.3: Verify tier calculation (pure function test)
    const { calculateTier } = workingMemory;

    if (typeof calculateTier === 'function') {
      const hotTier = calculateTier(0.9);
      const warmTier = calculateTier(0.5);
      const coldTier = calculateTier(0.1);

      if (hotTier === 'focused' && warmTier === 'active' && coldTier === 'fading') {
        pass('W3-T3: Tier calculation works correctly', `HOT(0.9)=${hotTier}, WARM(0.5)=${warmTier}, COLD(0.1)=${coldTier}`);
      } else {
        fail('W3-T3: Tier calculation works correctly', `Got: HOT(0.9)=${hotTier}, WARM(0.5)=${warmTier}, COLD(0.1)=${coldTier}`);
      }
    } else {
      skip('W3-T3: Tier calculation works correctly', 'calculateTier not exported');
    }

    // Test 3.4: Verify decay calculation (pure function test)
    const { calculateRetrievabilityDecay } = attentionDecay;

    if (typeof calculateRetrievabilityDecay === 'function') {
      const immediate = calculateRetrievabilityDecay(10, 0);
      const decayed = calculateRetrievabilityDecay(10, 5);

      if (immediate === 1 && decayed > 0 && decayed < immediate) {
        pass('W3-T4: Decay calculation works correctly', `Immediate=${immediate}, Decayed=${decayed.toFixed(4)}`);
      } else {
        fail('W3-T4: Decay calculation works correctly', `Immediate=${immediate}, Decayed=${decayed}`);
      }
    } else {
      fail('W3-T4: Decay calculation works correctly', 'calculateRetrievabilityDecay not exported');
    }

    // Test 3.5: Verify decay rates by tier
    const { getDecayRate } = attentionDecay;

    if (typeof getDecayRate === 'function') {
      const constitutionalRate = getDecayRate('constitutional');
      const normalRate = getDecayRate('normal');
      const temporaryRate = getDecayRate('temporary');

      // Constitutional should not decay (rate = 1.0)
      // Normal should decay moderately
      // Temporary should decay fastest
      if (constitutionalRate === 1.0 && normalRate < 1.0 && temporaryRate < normalRate) {
        pass('W3-T5: Decay rates by tier correct',
             `constitutional=${constitutionalRate}, normal=${normalRate}, temporary=${temporaryRate}`);
      } else {
        fail('W3-T5: Decay rates by tier correct',
             `Got: constitutional=${constitutionalRate}, normal=${normalRate}, temporary=${temporaryRate}`);
      }
    } else {
      fail('W3-T5: Decay rates by tier correct', 'getDecayRate not exported');
    }

    // Test 3.6: Check co-activation module exists
    const coActivationPath = path.join(MCP_SERVER_DIR, 'dist', 'lib', 'cache', 'cognitive', 'co-activation.js');

    if (fs.existsSync(coActivationPath)) {
      const coActivation = require(coActivationPath);
      pass('W3-T6: co-activation.js exists', 'Module loaded successfully');
    } else {
      fail('W3-T6: co-activation.js exists', 'Module not found');
    }

  } catch (error) {
    fail('W3: Cognitive Memory Session', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   7. WORKFLOW 4: SPEC FOLDER CREATION
────────────────────────────────────────────────────────────────
*/

async function testSpecFolderCreation() {
  startSuite('Workflow 4: Spec Folder Creation');

  try {
    // Test 4.1: Check create.sh exists
    const createScript = path.join(SCRIPTS_DIR, 'spec', 'create.sh');

    if (fs.existsSync(createScript)) {
      pass('W4-T1: create.sh script exists', createScript);
    } else {
      skip('W4-T1: create.sh script exists', 'Script not found');
      return;
    }

    // Test 4.2: Verify templates exist for all levels
    const levels = ['level_1', 'level_2', 'level_3'];
    let templatesFound = 0;

    for (const level of levels) {
      const levelDir = path.join(TEMPLATES_DIR, level);
      if (fs.existsSync(levelDir)) {
        templatesFound++;
      }
    }

    if (templatesFound === levels.length) {
      pass('W4-T2: Templates exist for all levels', `${templatesFound}/${levels.length} levels`);
    } else {
      fail('W4-T2: Templates exist for all levels', `Only ${templatesFound}/${levels.length} found`);
    }

    // Test 4.3: Verify Level 2 has required files
    const level2Dir = path.join(TEMPLATES_DIR, 'level_2');
    const requiredL2Files = ['spec.md', 'plan.md', 'tasks.md', 'checklist.md'];
    let l2FilesFound = 0;

    for (const file of requiredL2Files) {
      if (fs.existsSync(path.join(level2Dir, file))) {
        l2FilesFound++;
      }
    }

    if (l2FilesFound === requiredL2Files.length) {
      pass('W4-T3: Level 2 has all required templates', `${l2FilesFound}/${requiredL2Files.length} files`);
    } else {
      fail('W4-T3: Level 2 has all required templates', `Only ${l2FilesFound}/${requiredL2Files.length} found`);
    }

    // Test 4.4: Verify Level 3 has decision-record.md
    const level3Dir = path.join(TEMPLATES_DIR, 'level_3');
    const decisionRecordPath = path.join(level3Dir, 'decision-record.md');

    if (fs.existsSync(decisionRecordPath)) {
      pass('W4-T4: Level 3 has decision-record.md', decisionRecordPath);
    } else {
      skip('W4-T4: Level 3 has decision-record.md', 'Template not found');
    }

    // Test 4.5: Create a spec folder programmatically and verify structure
    const testSpecPath = createTestSpecFolder('004-creation-test', 3);

    const expectedFiles = ['spec.md', 'plan.md', 'tasks.md'];
    const expectedDirs = ['memory', 'scratch'];

    let structureValid = true;
    for (const file of expectedFiles) {
      if (!fs.existsSync(path.join(testSpecPath, file))) {
        structureValid = false;
        break;
      }
    }
    for (const dir of expectedDirs) {
      if (!fs.existsSync(path.join(testSpecPath, dir))) {
        structureValid = false;
        break;
      }
    }

    if (structureValid) {
      pass('W4-T5: Programmatic spec folder creation works', testSpecPath);
    } else {
      fail('W4-T5: Programmatic spec folder creation works', 'Missing files or directories');
    }

    // Test 4.6: Verify templates contain placeholders
    const specTemplate = fs.readFileSync(path.join(level2Dir, 'spec.md'), 'utf-8');
    const hasTableFormat = specTemplate.includes('| **Level**');
    const hasPlaceholders = specTemplate.includes('[') || specTemplate.includes('{{');

    if (hasTableFormat || hasPlaceholders) {
      pass('W4-T6: Templates contain expected format',
           `Table format: ${hasTableFormat}, Placeholders: ${hasPlaceholders}`);
    } else {
      // Templates might be minimal style without placeholders
      skip('W4-T6: Templates contain expected format', 'Minimal template style detected');
    }

  } catch (error) {
    fail('W4: Spec Folder Creation', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   8. WORKFLOW 5: CHECKPOINT CYCLE
────────────────────────────────────────────────────────────────
*/

async function testCheckpointCycle() {
  startSuite('Workflow 5: Checkpoint Cycle');

  try {
    // Test 5.1: Check checkpoints.js exists
    const checkpointsPath = path.join(MCP_SERVER_DIR, 'dist', 'lib', 'storage', 'checkpoints.js');

    if (!fs.existsSync(checkpointsPath)) {
      skip('W5-T1: checkpoints.js exists', 'Module not found');
      return;
    }

    const checkpoints = require(checkpointsPath);

    // Test 5.2: Verify checkpoint exports
    const requiredExports = [
      'createCheckpoint',
      'listCheckpoints',
      'restoreCheckpoint',
      'deleteCheckpoint',
      'getCheckpoint',
    ];

    let exportsFound = 0;
    for (const exp of requiredExports) {
      if (typeof checkpoints[exp] === 'function') {
        exportsFound++;
      }
    }

    if (exportsFound === requiredExports.length) {
      pass('W5-T1: checkpoints.js exports correctly', `${exportsFound}/${requiredExports.length} functions`);
    } else {
      fail('W5-T1: checkpoints.js exports correctly', `Only ${exportsFound}/${requiredExports.length} functions found`);
      return;
    }

    // Test 5.2: Check handlers exist
    const handlersPath = path.join(MCP_SERVER_DIR, 'dist', 'handlers', 'checkpoints.js');

    if (fs.existsSync(handlersPath)) {
      const handlers = require(handlersPath);

      if (typeof handlers.handleCheckpointCreate === 'function' &&
          typeof handlers.handleCheckpointRestore === 'function' &&
          typeof handlers.handleCheckpointDelete === 'function') {
        pass('W5-T2: Checkpoint handlers exist', 'All handlers found');
      } else {
        fail('W5-T2: Checkpoint handlers exist', 'Missing handler functions');
      }
    } else {
      skip('W5-T2: Checkpoint handlers exist', 'Handlers module not found');
    }

    // Test 5.3: Verify getGitBranch function
    if (typeof checkpoints.getGitBranch === 'function') {
      const branch = checkpoints.getGitBranch();
      // Should return either a branch name or null (if not in git repo)
      if (branch === null || typeof branch === 'string') {
        pass('W5-T3: getGitBranch works', `Branch: ${branch || '(not in git repo)'}`);
      } else {
        fail('W5-T3: getGitBranch works', `Unexpected return type: ${typeof branch}`);
      }
    } else {
      skip('W5-T3: getGitBranch works', 'Function not exported');
    }

    // Test 5.4: verify schema validation helper catches malformed rows
    const checkpointsSource = fs.readFileSync(checkpointsPath, 'utf-8');
    if (typeof checkpoints.validateMemoryRow !== 'function') {
      fail('W5-T4: Checkpoint schema validator exported', 'validateMemoryRow not exported');
    } else {
      const validRow = {
        id: 1,
        file_path: '/tmp/test.md',
        spec_folder: '001-test',
        title: 'Test Memory',
        importance_weight: 0.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        importance_tier: 'normal',
      };

      let rejectedInvalidRow = false;
      try {
        checkpoints.validateMemoryRow(validRow, 0);
        try {
          checkpoints.validateMemoryRow({ id: 'invalid' }, 1);
        } catch (_) {
          rejectedInvalidRow = true;
        }
      } catch (err) {
        fail('W5-T4: Checkpoint schema validator exported', `Unexpected throw on valid row: ${err.message}`);
      }

      if (rejectedInvalidRow) {
        pass('W5-T4: Checkpoint schema validator exported', 'Accepts valid row and rejects malformed row');
      } else {
        fail('W5-T4: Checkpoint schema validator exported', 'Malformed row was not rejected');
      }
    }

    // Test 5.5: Verify compression is used
    if (checkpointsSource.includes('zlib') && checkpointsSource.includes('gzipSync')) {
      pass('W5-T5: Checkpoint compression enabled', 'zlib gzip compression found');
    } else {
      fail('W5-T5: Checkpoint compression enabled', 'Compression not found');
    }

    // Test 5.6: Verify max checkpoint limit is exported and enforced in source
    if (typeof checkpoints.MAX_CHECKPOINTS === 'number' &&
        checkpoints.MAX_CHECKPOINTS > 0 &&
        checkpointsSource.includes('MAX_CHECKPOINTS')) {
      pass('W5-T6: Checkpoint limits configured', `MAX_CHECKPOINTS=${checkpoints.MAX_CHECKPOINTS}`);
    } else {
      fail('W5-T6: Checkpoint limits configured', 'Limit constants not found');
    }

  } catch (error) {
    fail('W5: Checkpoint Cycle', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   9. BONUS: CROSS-CUTTING INTEGRATION TESTS
────────────────────────────────────────────────────────────────
*/

async function testCrossCuttingIntegration() {
  startSuite('Cross-Cutting Integration Tests');

  try {
    // Test X.1: Verify core module exports
    const corePath = path.join(SCRIPTS_DIR, 'dist', 'core', 'index.js');

    if (fs.existsSync(corePath)) {
      const core = require(corePath);

      if (core.CONFIG && typeof core.findActiveSpecsDir === 'function') {
        pass('X-T1: Core module exports correctly', 'CONFIG and findActiveSpecsDir found');
      } else {
        fail('X-T1: Core module exports correctly', 'Missing exports');
      }
    } else {
      skip('X-T1: Core module exports correctly', 'Core module not found');
    }

    // Test X.2: Verify extractors module
    const extractorsPath = path.join(SCRIPTS_DIR, 'dist', 'extractors', 'index.js');

    if (fs.existsSync(extractorsPath)) {
      const extractors = require(extractorsPath);

      const requiredExtractors = ['extractConversations', 'extractDecisions', 'extractDiagrams'];
      let found = 0;
      for (const exp of requiredExtractors) {
        if (typeof extractors[exp] === 'function') found++;
      }

      if (found === requiredExtractors.length) {
        pass('X-T2: Extractors module exports correctly', `${found}/${requiredExtractors.length} extractors`);
      } else {
        fail('X-T2: Extractors module exports correctly', `Only ${found}/${requiredExtractors.length} found`);
      }
    } else {
      skip('X-T2: Extractors module exports correctly', 'Extractors module not found');
    }

    // Test X.3: Verify spec-folder module
    const specFolderPath = path.join(SCRIPTS_DIR, 'dist', 'spec-folder', 'index.js');

    if (fs.existsSync(specFolderPath)) {
      const specFolder = require(specFolderPath);

      if (typeof specFolder.detectSpecFolder === 'function' &&
          typeof specFolder.setupContextDirectory === 'function') {
        pass('X-T3: Spec-folder module exports correctly', 'detectSpecFolder and setupContextDirectory found');
      } else {
        fail('X-T3: Spec-folder module exports correctly', 'Missing exports');
      }
    } else {
      skip('X-T3: Spec-folder module exports correctly', 'Spec-folder module not found');
    }

    // Test X.4: Verify MCP server core exports
    const mcpCorePath = path.join(MCP_SERVER_DIR, 'dist', 'core', 'index.js');

    if (fs.existsSync(mcpCorePath)) {
      const mcpCore = require(mcpCorePath);

      if (mcpCore.LIB_DIR && typeof mcpCore.checkDatabaseUpdated === 'function') {
        pass('X-T4: MCP server core exports correctly', 'LIB_DIR and check_database_updated found');
      } else {
        fail('X-T4: MCP server core exports correctly', 'Missing exports');
      }
    } else {
      skip('X-T4: MCP server core exports correctly', 'MCP core module not found');
    }

    // Test X.5: Verify vector-index module structure
    const vectorIndexPath = path.join(MCP_SERVER_DIR, 'dist', 'lib', 'search', 'vector-index.js');

    if (fs.existsSync(vectorIndexPath)) {
      const vectorIndex = require(vectorIndexPath);

      // Check for key components via runtime exports (camelCase contracts)
      const hasEmbeddingDim = typeof vectorIndex.EMBEDDING_DIM === 'number' && vectorIndex.EMBEDDING_DIM > 0;
      const hasIndexMemory = typeof vectorIndex.indexMemory === 'function' || typeof vectorIndex.indexMemoryDeferred === 'function';
      const hasSearchMemory = typeof vectorIndex.vectorSearch === 'function' ||
                              typeof vectorIndex.enhancedSearch === 'function' ||
                              typeof vectorIndex.cachedSearch === 'function';

      if (hasEmbeddingDim && hasIndexMemory && hasSearchMemory) {
        pass('X-T5: Vector-index module has key components', 'EMBEDDING_DIM, indexMemory, and search APIs exported');
      } else {
        fail('X-T5: Vector-index module has key components',
             `hasEmbeddingDim=${hasEmbeddingDim}, hasIndexMemory=${hasIndexMemory}, hasSearchMemory=${hasSearchMemory}`);
      }
    } else {
      skip('X-T5: Vector-index module has key components', 'Vector-index module not found');
    }

    // Test X.6: Verify error codes module
    const errorsPath = path.join(MCP_SERVER_DIR, 'dist', 'lib', 'errors.js');

    if (fs.existsSync(errorsPath)) {
      const errors = require(errorsPath);

      if (errors.ErrorCodes && typeof errors.ErrorCodes === 'object') {
        pass('X-T6: Error codes module exports correctly', `${Object.keys(errors.ErrorCodes).length} error codes defined`);
      } else {
        fail('X-T6: Error codes module exports correctly', 'ErrorCodes not found');
      }
    } else {
      skip('X-T6: Error codes module exports correctly', 'Errors module not found');
    }

  } catch (error) {
    fail('Cross-Cutting Integration', error.message);
  }

  endSuite();
}

/* ─────────────────────────────────────────────────────────────
   10. MAIN ENTRY POINT
────────────────────────────────────────────────────────────────
*/

async function main() {
  log('');
  log('═'.repeat(60));
  log('  INTEGRATION TEST SUITE');
  log('  System Spec Kit - End-to-End Workflows');
  log('═'.repeat(60));
  log(`  Date: ${new Date().toISOString()}`);
  log(`  Node: ${process.version}`);
  log(`  Platform: ${process.platform}`);
  log('═'.repeat(60));

  const startTime = Date.now();

  try {
    // Setup test workspace
    log('\n📁 Setting up test workspace...');
    setupTestWorkspace();
    log(`   ✓ Test workspace: ${TEST_WORKSPACE}`);
    log(`   ✓ Session ID: ${testSessionId}`);

    // Run all workflow tests
    await testMemorySaveWorkflow();
    await testValidationPipeline();
    await testCognitiveMemorySession();
    await testSpecFolderCreation();
    await testCheckpointCycle();
    await testCrossCuttingIntegration();

  } catch (error) {
    log(`\n❌ Fatal error: ${error.message}`);
    log(error.stack);
  } finally {
    // Cleanup
    log('\n🧹 Cleaning up test workspace...');
    teardownTestWorkspace();
    log('   ✓ Cleanup complete');
  }

  const duration = Date.now() - startTime;

  // Print summary
  log('\n');
  log('═'.repeat(60));
  log('  TEST SUMMARY');
  log('═'.repeat(60));
  log(`  ✅ Passed:  ${results.passed}`);
  log(`  ❌ Failed:  ${results.failed}`);
  log(`  ⏭️  Skipped: ${results.skipped}`);
  log(`  📊 Total:   ${results.passed + results.failed + results.skipped}`);
  log(`  ⏱️  Duration: ${duration}ms`);
  log('');

  // Print suite breakdown
  log('  Suite Breakdown:');
  for (const suite of results.suites) {
    log(`    • ${suite.name}: ${suite.duration}ms`);
  }

  log('═'.repeat(60));

  if (results.failed === 0) {
    log('\n🎉 ALL INTEGRATION TESTS PASSED!\n');
    return true;
  } else {
    log('\n⚠️  Some tests failed. Review output above.\n');

    // Print failed tests
    const failedTests = results.tests.filter(t => t.status === 'FAIL');
    if (failedTests.length > 0) {
      log('Failed tests:');
      for (const test of failedTests) {
        log(`  ❌ ${test.name}: ${test.reason}`);
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
   11. EXPORTS (for programmatic use)
────────────────────────────────────────────────────────────────
*/

module.exports = {
  // Test utilities
  setupTestWorkspace,
  teardownTestWorkspace,
  createTestSpecFolder,
  createMemoryFile,
  runScript,
  runNodeScript,

  // Individual workflow tests
  testMemorySaveWorkflow,
  testValidationPipeline,
  testCognitiveMemorySession,
  testSpecFolderCreation,
  testCheckpointCycle,
  testCrossCuttingIntegration,

  // Main entry
  main,

  // Results access
  getResults: () => ({ ...results }),
};

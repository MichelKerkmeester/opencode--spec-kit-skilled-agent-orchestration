// ───────────────────────────────────────────────────────────────
// TEST: Spec 071 - Level-Based Template Alignment (Part 2)
// Documentation & Templates Validation
// ───────────────────────────────────────────────────────────────
'use strict';

const path = require('path');
const fs = require('fs');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const SPEC_KIT_PATH = path.join(__dirname, '..', '..', '..', '..', '.opencode', 'skill', 'system-spec-kit');
const TEMPLATES_PATH = path.join(SPEC_KIT_PATH, 'templates');

// Expected files per level (from Spec 071)
const LEVEL_CONTENTS = {
  level_1: ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md'],
  level_2: ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'checklist.md'],
  level_3: ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'checklist.md', 'decision-record.md'],
  'level_3+': ['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md', 'checklist.md', 'decision-record.md'],
};

// Expected SPECKIT_LEVEL markers per level
const EXPECTED_LEVELS = {
  level_1: '1',
  level_2: '2',
  level_3: '3',
  'level_3+': '3+',
};

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

function readFileSync(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function directoryExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────
   3. TEST FUNCTIONS - LEVEL FOLDER CONTENTS
──────────────────────────────────────────────────────────────── */

function test_level_folders_exist() {
  log('\n[TEST] Level Folders Existence');

  const levels = ['level_1', 'level_2', 'level_3', 'level_3+'];

  for (const level of levels) {
    const levelPath = path.join(TEMPLATES_PATH, level);
    if (directoryExists(levelPath)) {
      pass(`${level}/ folder exists`, levelPath);
    } else {
      fail(`${level}/ folder exists`, `Folder not found: ${levelPath}`);
    }
  }
}

function test_level_1_contents() {
  log('\n[TEST] Level 1 Folder Contents');

  const levelPath = path.join(TEMPLATES_PATH, 'level_1');
  const expected = LEVEL_CONTENTS.level_1;

  // Test has all expected files
  for (const file of expected) {
    const filePath = path.join(levelPath, file);
    if (fileExists(filePath)) {
      pass(`level_1/ contains ${file}`, filePath);
    } else {
      fail(`level_1/ contains ${file}`, `File not found: ${filePath}`);
    }
  }

  // Test does NOT contain checklist.md
  const checklistPath = path.join(levelPath, 'checklist.md');
  if (!fileExists(checklistPath)) {
    pass('level_1/ does NOT contain checklist.md', 'File correctly absent');
  } else {
    fail('level_1/ does NOT contain checklist.md', 'checklist.md should not exist at Level 1');
  }

  // Test does NOT contain decision-record.md
  const decisionPath = path.join(levelPath, 'decision-record.md');
  if (!fileExists(decisionPath)) {
    pass('level_1/ does NOT contain decision-record.md', 'File correctly absent');
  } else {
    fail('level_1/ does NOT contain decision-record.md', 'decision-record.md should not exist at Level 1');
  }
}

function test_level_2_contents() {
  log('\n[TEST] Level 2 Folder Contents');

  const levelPath = path.join(TEMPLATES_PATH, 'level_2');
  const expected = LEVEL_CONTENTS.level_2;

  // Test has all expected files (Level 1 + checklist.md)
  for (const file of expected) {
    const filePath = path.join(levelPath, file);
    if (fileExists(filePath)) {
      pass(`level_2/ contains ${file}`, filePath);
    } else {
      fail(`level_2/ contains ${file}`, `File not found: ${filePath}`);
    }
  }

  // Test does NOT contain decision-record.md
  const decisionPath = path.join(levelPath, 'decision-record.md');
  if (!fileExists(decisionPath)) {
    pass('level_2/ does NOT contain decision-record.md', 'File correctly absent');
  } else {
    fail('level_2/ does NOT contain decision-record.md', 'decision-record.md should not exist at Level 2');
  }
}

function test_level_3_contents() {
  log('\n[TEST] Level 3 Folder Contents');

  const levelPath = path.join(TEMPLATES_PATH, 'level_3');
  const expected = LEVEL_CONTENTS.level_3;

  // Test has all expected files (Level 2 + decision-record.md)
  for (const file of expected) {
    const filePath = path.join(levelPath, file);
    if (fileExists(filePath)) {
      pass(`level_3/ contains ${file}`, filePath);
    } else {
      fail(`level_3/ contains ${file}`, `File not found: ${filePath}`);
    }
  }
}

function test_level_3plus_contents() {
  log('\n[TEST] Level 3+ Folder Contents');

  const levelPath = path.join(TEMPLATES_PATH, 'level_3+');
  const expected = LEVEL_CONTENTS['level_3+'];

  // Test has all expected files (same as Level 3 but with extended content)
  for (const file of expected) {
    const filePath = path.join(levelPath, file);
    if (fileExists(filePath)) {
      pass(`level_3+/ contains ${file}`, filePath);
    } else {
      fail(`level_3+/ contains ${file}`, `File not found: ${filePath}`);
    }
  }

  // Optional: research.md may or may not exist
  const researchPath = path.join(levelPath, 'research.md');
  if (fileExists(researchPath)) {
    pass('level_3+/ contains optional research.md', researchPath);
  } else {
    skip('level_3+/ contains optional research.md', 'research.md is optional for level_3+');
  }
}

/* ─────────────────────────────────────────────────────────────
   4. TEST FUNCTIONS - SPECKIT_LEVEL MARKERS
──────────────────────────────────────────────────────────────── */

function test_speckit_level_marker_format() {
  log('\n[TEST] SPECKIT_LEVEL Marker Format');

  // Test marker format in each level folder
  const levels = ['level_1', 'level_2', 'level_3', 'level_3+'];
  const expectedMarkerFormat = /<!-- SPECKIT_LEVEL: (\d+\+?) -->/;

  for (const level of levels) {
    const levelPath = path.join(TEMPLATES_PATH, level);
    const specPath = path.join(levelPath, 'spec.md');

    if (!fileExists(specPath)) {
      skip(`${level}/spec.md marker format`, 'File does not exist');
      continue;
    }

    const content = readFileSync(specPath);
    const match = content.match(expectedMarkerFormat);

    if (match) {
      pass(`${level}/spec.md has valid marker format`, `Found: <!-- SPECKIT_LEVEL: ${match[1]} -->`);
    } else {
      fail(`${level}/spec.md has valid marker format`, 'Marker not found or invalid format');
    }
  }
}

function test_speckit_level_marker_values() {
  log('\n[TEST] SPECKIT_LEVEL Marker Values');

  const levels = ['level_1', 'level_2', 'level_3', 'level_3+'];
  const markerRegex = /<!-- SPECKIT_LEVEL: (\d+\+?) -->/;

  for (const level of levels) {
    const levelPath = path.join(TEMPLATES_PATH, level);
    const expectedLevel = EXPECTED_LEVELS[level];

    // Check all markdown files in the level folder
    const files = LEVEL_CONTENTS[level] || [];

    for (const file of files) {
      const filePath = path.join(levelPath, file);

      if (!fileExists(filePath)) {
        skip(`${level}/${file} marker value`, 'File does not exist');
        continue;
      }

      const content = readFileSync(filePath);
      const match = content.match(markerRegex);

      if (match) {
        const actualLevel = match[1];
        if (actualLevel === expectedLevel) {
          pass(`${level}/${file} has correct level marker`, `Expected: ${expectedLevel}, Found: ${actualLevel}`);
        } else {
          fail(`${level}/${file} has correct level marker`, `Expected: ${expectedLevel}, Found: ${actualLevel}`);
        }
      } else {
        // Some files may not have markers (like implementation-summary.md in level_1)
        // This is acceptable but should be noted
        skip(`${level}/${file} marker value`, 'No SPECKIT_LEVEL marker found (may be intentional)');
      }
    }
  }
}

function test_speckit_level_marker_position() {
  log('\n[TEST] SPECKIT_LEVEL Marker Position (First 10 Lines)');

  const levels = ['level_1', 'level_2', 'level_3', 'level_3+'];
  const markerRegex = /<!-- SPECKIT_LEVEL: \d+\+? -->/;

  for (const level of levels) {
    const levelPath = path.join(TEMPLATES_PATH, level);
    const specPath = path.join(levelPath, 'spec.md');

    if (!fileExists(specPath)) {
      skip(`${level}/spec.md marker position`, 'File does not exist');
      continue;
    }

    const content = readFileSync(specPath);
    const lines = content.split('\n').slice(0, 10); // First 10 lines
    const markerInFirst10 = lines.some(line => markerRegex.test(line));

    if (markerInFirst10) {
      const markerLine = lines.findIndex(line => markerRegex.test(line)) + 1;
      pass(`${level}/spec.md marker is within first 10 lines`, `Found at line ${markerLine}`);
    } else {
      fail(`${level}/spec.md marker is within first 10 lines`, 'Marker not found in first 10 lines');
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   5. TEST FUNCTIONS - COMPLEXITY_GATE REMOVAL
──────────────────────────────────────────────────────────────── */

function test_no_complexity_gate_in_level_folders() {
  log('\n[TEST] No COMPLEXITY_GATE Markers in Level Folders');

  const levels = ['level_1', 'level_2', 'level_3', 'level_3+'];
  const complexityGateRegex = /COMPLEXITY_GATE/;

  for (const level of levels) {
    const levelPath = path.join(TEMPLATES_PATH, level);

    if (!directoryExists(levelPath)) {
      skip(`${level}/ COMPLEXITY_GATE check`, 'Folder does not exist');
      continue;
    }

    const files = fs.readdirSync(levelPath).filter(f => f.endsWith('.md'));
    let foundGates = [];

    for (const file of files) {
      const filePath = path.join(levelPath, file);
      const content = readFileSync(filePath);

      if (content && complexityGateRegex.test(content)) {
        foundGates.push(file);
      }
    }

    if (foundGates.length === 0) {
      pass(`${level}/ has NO COMPLEXITY_GATE markers`, `Checked ${files.length} files`);
    } else {
      fail(`${level}/ has NO COMPLEXITY_GATE markers`, `Found markers in: ${foundGates.join(', ')}`);
    }
  }
}

function test_level_2_checklist_no_complexity_gate() {
  log('\n[TEST] Level 2 Checklist Specific - No COMPLEXITY_GATE');

  const checklistPath = path.join(TEMPLATES_PATH, 'level_2', 'checklist.md');

  if (!fileExists(checklistPath)) {
    skip('level_2/checklist.md COMPLEXITY_GATE check', 'File does not exist');
    return;
  }

  const content = readFileSync(checklistPath);
  const complexityGateRegex = /<!-- COMPLEXITY_GATE:/g;
  const matches = content.match(complexityGateRegex);

  if (!matches || matches.length === 0) {
    pass('level_2/checklist.md has NO COMPLEXITY_GATE markers', 'None found');
  } else {
    fail('level_2/checklist.md has NO COMPLEXITY_GATE markers', `Found ${matches.length} markers`);
  }
}

function test_root_templates_may_have_complexity_gate() {
  log('\n[TEST] Root Templates May Have COMPLEXITY_GATE (Expected)');

  // Root templates are kept for backward compatibility and may have COMPLEXITY_GATE markers
  const rootTemplates = ['spec.md', 'plan.md', 'tasks.md', 'checklist.md'];
  const complexityGateRegex = /<!-- COMPLEXITY_GATE:/;

  for (const file of rootTemplates) {
    const filePath = path.join(TEMPLATES_PATH, file);

    if (!fileExists(filePath)) {
      skip(`Root ${file} COMPLEXITY_GATE check`, 'File does not exist');
      continue;
    }

    const content = readFileSync(filePath);
    const hasGate = complexityGateRegex.test(content);

    // This is informational - root templates MAY have gates
    if (hasGate) {
      pass(`Root ${file} has COMPLEXITY_GATE markers (expected for backward compat)`, 'Markers present');
    } else {
      pass(`Root ${file} has NO COMPLEXITY_GATE markers`, 'Clean file');
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   6. TEST FUNCTIONS - DOCUMENTATION PATH UPDATES
──────────────────────────────────────────────────────────────── */

function test_skill_md_references_level_folders() {
  log('\n[TEST] SKILL.md References Level Folders');

  const skillMdPath = path.join(SPEC_KIT_PATH, 'SKILL.md');

  if (!fileExists(skillMdPath)) {
    fail('SKILL.md exists', 'File not found');
    return;
  }

  const content = readFileSync(skillMdPath);

  // Check for level folder references
  const levelFolderRefs = [
    /level_1\//,
    /level_2\//,
    /level_3\//,
    /level_3\+\//,
  ];

  for (const pattern of levelFolderRefs) {
    if (pattern.test(content)) {
      pass(`SKILL.md references ${pattern.source}`, 'Reference found');
    } else {
      fail(`SKILL.md references ${pattern.source}`, 'Reference not found');
    }
  }

  // Check for template folder architecture documentation
  const architectureKeywords = ['level_1', 'level_2', 'level_3'];
  let architectureDocumented = architectureKeywords.every(kw => content.includes(kw));

  if (architectureDocumented) {
    pass('SKILL.md documents template folder architecture', 'All level folders mentioned');
  } else {
    fail('SKILL.md documents template folder architecture', 'Missing level folder documentation');
  }
}

function test_readme_references_level_folders() {
  log('\n[TEST] README.md References Level Folders');

  const readmePath = path.join(SPEC_KIT_PATH, 'README.md');

  if (!fileExists(readmePath)) {
    fail('README.md exists', 'File not found');
    return;
  }

  const content = readFileSync(readmePath);

  // Check for level folder copy command patterns
  const copyPatterns = [
    /cp.*level_1/,
    /cp.*level_2/,
    /cp.*level_3/,
  ];

  for (const pattern of copyPatterns) {
    if (pattern.test(content)) {
      pass(`README.md has copy command for ${pattern.source.replace('cp.*', '')}`, 'Command found');
    } else {
      fail(`README.md has copy command for ${pattern.source.replace('cp.*', '')}`, 'Command not found');
    }
  }

  // Count level folder references
  const level1Count = (content.match(/level_1/g) || []).length;
  const level2Count = (content.match(/level_2/g) || []).length;
  const level3Count = (content.match(/level_3/g) || []).length;

  if (level1Count > 5) {
    pass('README.md has multiple level_1 references', `Count: ${level1Count}`);
  } else {
    fail('README.md has multiple level_1 references', `Count: ${level1Count}, expected >5`);
  }
}

function test_level_specifications_md_paths() {
  log('\n[TEST] level_specifications.md References Correct Paths');

  const levelSpecPath = path.join(SPEC_KIT_PATH, 'references', 'templates', 'level_specifications.md');

  if (!fileExists(levelSpecPath)) {
    skip('level_specifications.md path check', 'File does not exist');
    return;
  }

  const content = readFileSync(levelSpecPath);

  // Check for correct level folder paths
  const pathPatterns = [
    /templates\/level_1\//,
    /templates\/level_2\//,
    /templates\/level_3\//,
    /templates\/level_3\+\//,
  ];

  for (const pattern of pathPatterns) {
    if (pattern.test(content)) {
      pass(`level_specifications.md references ${pattern.source}`, 'Path found');
    } else {
      fail(`level_specifications.md references ${pattern.source}`, 'Path not found');
    }
  }
}

function test_template_guide_md_paths() {
  log('\n[TEST] template_guide.md References Correct Paths');

  const templateGuidePath = path.join(SPEC_KIT_PATH, 'references', 'templates', 'template_guide.md');

  if (!fileExists(templateGuidePath)) {
    skip('template_guide.md path check', 'File does not exist');
    return;
  }

  const content = readFileSync(templateGuidePath);

  // Check for level folder copy commands
  const hasLevelFolderRefs = /level_[123]/.test(content);

  if (hasLevelFolderRefs) {
    pass('template_guide.md references level folders', 'Level folder references found');
  } else {
    fail('template_guide.md references level folders', 'No level folder references found');
  }
}

/* ─────────────────────────────────────────────────────────────
   7. TEST FUNCTIONS - TEMPLATE CONTENT VERIFICATION
──────────────────────────────────────────────────────────────── */

function test_level_templates_have_correct_metadata() {
  log('\n[TEST] Level Templates Have Correct Level Metadata');

  const levels = ['level_1', 'level_2', 'level_3'];

  for (const level of levels) {
    const levelNum = level.split('_')[1];
    const specPath = path.join(TEMPLATES_PATH, level, 'spec.md');

    if (!fileExists(specPath)) {
      skip(`${level}/spec.md metadata check`, 'File does not exist');
      continue;
    }

    const content = readFileSync(specPath);

    // Check for Level: X in metadata
    const levelMetadataRegex = new RegExp(`\\*\\*Level\\*\\*:\\s*${levelNum}`);

    if (levelMetadataRegex.test(content)) {
      pass(`${level}/spec.md has correct Level metadata`, `Found Level: ${levelNum}`);
    } else {
      fail(`${level}/spec.md has correct Level metadata`, `Expected Level: ${levelNum}`);
    }
  }
}

function test_level_templates_size_progression() {
  log('\n[TEST] Level Templates Size Progression');

  // Level 3 templates should be larger than Level 1 templates
  const level1SpecPath = path.join(TEMPLATES_PATH, 'level_1', 'spec.md');
  const level3SpecPath = path.join(TEMPLATES_PATH, 'level_3', 'spec.md');

  if (!fileExists(level1SpecPath) || !fileExists(level3SpecPath)) {
    skip('Template size progression check', 'Required files do not exist');
    return;
  }

  const level1Size = fs.statSync(level1SpecPath).size;
  const level3Size = fs.statSync(level3SpecPath).size;

  if (level3Size > level1Size) {
    pass('level_3/spec.md is larger than level_1/spec.md', `L3: ${level3Size} bytes > L1: ${level1Size} bytes`);
  } else {
    fail('level_3/spec.md is larger than level_1/spec.md', `L3: ${level3Size} bytes <= L1: ${level1Size} bytes`);
  }

  // Level 3+ should be larger than or equal to Level 3
  const level3PlusSpecPath = path.join(TEMPLATES_PATH, 'level_3+', 'spec.md');

  if (fileExists(level3PlusSpecPath)) {
    const level3PlusSize = fs.statSync(level3PlusSpecPath).size;

    if (level3PlusSize >= level3Size) {
      pass('level_3+/spec.md is >= level_3/spec.md', `L3+: ${level3PlusSize} bytes >= L3: ${level3Size} bytes`);
    } else {
      fail('level_3+/spec.md is >= level_3/spec.md', `L3+: ${level3PlusSize} bytes < L3: ${level3Size} bytes`);
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   8. TEST FUNCTIONS - FILE COUNT VERIFICATION
──────────────────────────────────────────────────────────────── */

function test_level_folder_file_counts() {
  log('\n[TEST] Level Folder File Counts');

  const expectedCounts = {
    level_1: 4,
    level_2: 5,
    level_3: 6,
    'level_3+': 6,
  };

  for (const [level, expectedCount] of Object.entries(expectedCounts)) {
    const levelPath = path.join(TEMPLATES_PATH, level);

    if (!directoryExists(levelPath)) {
      fail(`${level}/ file count`, `Folder does not exist`);
      continue;
    }

    const mdFiles = fs.readdirSync(levelPath).filter(f => f.endsWith('.md'));

    if (mdFiles.length === expectedCount) {
      pass(`${level}/ has ${expectedCount} .md files`, `Files: ${mdFiles.join(', ')}`);
    } else {
      fail(`${level}/ has ${expectedCount} .md files`, `Found ${mdFiles.length}: ${mdFiles.join(', ')}`);
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   9. COMPREHENSIVE VALIDATION SUMMARY
──────────────────────────────────────────────────────────────── */

function test_comprehensive_validation() {
  log('\n[TEST] Comprehensive Validation Summary');

  const validationResults = {
    levelFoldersExist: true,
    levelContentsCorrect: true,
    markersCorrect: true,
    noComplexityGateInLevels: true,
    documentationUpdated: true,
  };

  // Check level folders exist
  const levels = ['level_1', 'level_2', 'level_3', 'level_3+'];
  for (const level of levels) {
    if (!directoryExists(path.join(TEMPLATES_PATH, level))) {
      validationResults.levelFoldersExist = false;
      break;
    }
  }

  // Check level contents
  for (const [level, expectedFiles] of Object.entries(LEVEL_CONTENTS)) {
    const levelPath = path.join(TEMPLATES_PATH, level);
    if (directoryExists(levelPath)) {
      for (const file of expectedFiles) {
        if (!fileExists(path.join(levelPath, file))) {
          validationResults.levelContentsCorrect = false;
          break;
        }
      }
    }
  }

  // Check SPECKIT_LEVEL markers
  const markerRegex = /<!-- SPECKIT_LEVEL: (\d+\+?) -->/;
  for (const level of levels) {
    const specPath = path.join(TEMPLATES_PATH, level, 'spec.md');
    if (fileExists(specPath)) {
      const content = readFileSync(specPath);
      if (!markerRegex.test(content)) {
        validationResults.markersCorrect = false;
        break;
      }
    }
  }

  // Check no COMPLEXITY_GATE in level folders
  const complexityGateRegex = /COMPLEXITY_GATE/;
  for (const level of levels) {
    const levelPath = path.join(TEMPLATES_PATH, level);
    if (directoryExists(levelPath)) {
      const files = fs.readdirSync(levelPath).filter(f => f.endsWith('.md'));
      for (const file of files) {
        const content = readFileSync(path.join(levelPath, file));
        if (content && complexityGateRegex.test(content)) {
          validationResults.noComplexityGateInLevels = false;
          break;
        }
      }
    }
  }

  // Check documentation updated
  const skillMdPath = path.join(SPEC_KIT_PATH, 'SKILL.md');
  if (fileExists(skillMdPath)) {
    const content = readFileSync(skillMdPath);
    if (!content.includes('level_1') || !content.includes('level_2') || !content.includes('level_3')) {
      validationResults.documentationUpdated = false;
    }
  }

  // Report comprehensive results
  log('\n   VALIDATION SUMMARY:');

  for (const [check, passed] of Object.entries(validationResults)) {
    if (passed) {
      pass(`Comprehensive: ${check}`, 'Validation passed');
    } else {
      fail(`Comprehensive: ${check}`, 'Validation failed');
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   10. MAIN
──────────────────────────────────────────────────────────────── */

async function runTests() {
  log('================================================================');
  log('TEST SUITE: Spec 071 - Level-Based Template Alignment (Part 2)');
  log('Documentation & Templates Validation');
  log('================================================================');
  log(`Date: ${new Date().toISOString()}`);
  log(`Templates Path: ${TEMPLATES_PATH}\n`);

  // Verify templates path exists
  if (!directoryExists(TEMPLATES_PATH)) {
    log(`\n[ERROR] Templates path does not exist: ${TEMPLATES_PATH}`);
    log('Aborting tests.');
    return results;
  }

  // Section 1: Level Folder Contents
  log('\n========================================');
  log('SECTION 1: Level Folder Contents');
  log('========================================');
  test_level_folders_exist();
  test_level_1_contents();
  test_level_2_contents();
  test_level_3_contents();
  test_level_3plus_contents();
  test_level_folder_file_counts();

  // Section 2: SPECKIT_LEVEL Markers
  log('\n========================================');
  log('SECTION 2: SPECKIT_LEVEL Markers');
  log('========================================');
  test_speckit_level_marker_format();
  test_speckit_level_marker_values();
  test_speckit_level_marker_position();

  // Section 3: COMPLEXITY_GATE Removal
  log('\n========================================');
  log('SECTION 3: COMPLEXITY_GATE Removal');
  log('========================================');
  test_no_complexity_gate_in_level_folders();
  test_level_2_checklist_no_complexity_gate();
  test_root_templates_may_have_complexity_gate();

  // Section 4: Documentation Path Updates
  log('\n========================================');
  log('SECTION 4: Documentation Path Updates');
  log('========================================');
  test_skill_md_references_level_folders();
  test_readme_references_level_folders();
  test_level_specifications_md_paths();
  test_template_guide_md_paths();

  // Section 5: Template Content Verification
  log('\n========================================');
  log('SECTION 5: Template Content Verification');
  log('========================================');
  test_level_templates_have_correct_metadata();
  test_level_templates_size_progression();

  // Section 6: Comprehensive Validation
  log('\n========================================');
  log('SECTION 6: Comprehensive Validation');
  log('========================================');
  test_comprehensive_validation();

  // Summary
  log('\n================================================================');
  log('TEST SUMMARY');
  log('================================================================');
  log(`[PASS]    Passed:  ${results.passed}`);
  log(`[FAIL]    Failed:  ${results.failed}`);
  log(`[SKIP]    Skipped: ${results.skipped}`);
  log(`          Total:   ${results.passed + results.failed + results.skipped}`);
  log('');

  if (results.failed === 0) {
    log('ALL TESTS PASSED!');
  } else {
    log('Some tests failed. Review output above.');
  }

  return results;
}

// Run if executed directly
if (require.main === module) {
  runTests().then(r => {
    process.exit(r.failed > 0 ? 1 : 0);
  });
}

module.exports = { runTests, results };

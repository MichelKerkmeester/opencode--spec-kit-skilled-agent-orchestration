#!/usr/bin/env node
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const DIST_LIB = path.join(ROOT, 'scripts', 'dist', 'lib', 'frontmatter-migration.js');
const DIST_CLI = path.join(ROOT, 'scripts', 'dist', 'memory', 'backfill-frontmatter.js');

let passed = 0;
let failed = 0;

function pass(name, evidence) {
  passed += 1;
  console.log(`  [PASS] ${name}`);
  if (evidence) {
    console.log(`         ${evidence}`);
  }
}

function fail(name, reason) {
  failed += 1;
  console.log(`  [FAIL] ${name}`);
  console.log(`         ${reason}`);
}

function ensureDist() {
  if (!fs.existsSync(DIST_LIB)) {
    throw new Error(`Missing compiled utility module: ${DIST_LIB}`);
  }
  if (!fs.existsSync(DIST_CLI)) {
    throw new Error(`Missing compiled CLI module: ${DIST_CLI}`);
  }
}

function run() {
  console.log('=== Frontmatter Backfill Tests ===');
  ensureDist();

  const migration = require(DIST_LIB);

  // T-FMB-001: No false-positive frontmatter detection after leading comments.
  try {
    const content = `<!-- TEMPLATE: context_template.md v2.2 -->\n\n---\n\n# SESSION SUMMARY\n\n| **Meta Data** | **Value** |\n|:--------------|:----------|\n| Context Type | general |\n\n---\n`;
    const detection = migration.detectFrontmatter(content);
    if (!detection.found) {
      pass('T-FMB-001: Thematic separator after comments is not frontmatter', 'detectFrontmatter().found === false');
    } else {
      fail('T-FMB-001: Thematic separator after comments is not frontmatter', 'Unexpected frontmatter detection');
    }
  } catch (error) {
    fail('T-FMB-001: Thematic separator after comments is not frontmatter', error.message);
  }

  // T-FMB-002: Unknown frontmatter keys are preserved during merge.
  try {
    const input = `---\ntitle: "Old Title"\ncustom_meta: "keep-me"\ntriggerPhrases:\n  - "legacy"\n---\n\n# Spec Header\n\nContent body.\n`;
    const result = migration.buildFrontmatterContent(
      input,
      { templatesRoot: path.join(ROOT, 'templates') },
      path.join(ROOT, 'specs', '007-test', 'spec.md')
    );

    if (result.content.includes('custom_meta: "keep-me"')) {
      pass('T-FMB-002: Unknown keys preserved', 'custom_meta retained in output frontmatter');
    } else {
      fail('T-FMB-002: Unknown keys preserved', 'custom_meta missing after merge');
    }
  } catch (error) {
    fail('T-FMB-002: Unknown keys preserved', error.message);
  }

  // T-FMB-003: Long titles keep disambiguating suffix and max length.
  try {
    const longTitle = '# This is an intentionally very long heading designed to exceed the normal dashboard title width for suffix retention tests\n\nBody.';
    const result = migration.buildFrontmatterContent(
      longTitle,
      { templatesRoot: path.join(ROOT, 'templates') },
      path.join(ROOT, 'specs', '007-frontmatter-test', 'spec.md')
    );

    const titleMatch = result.content.match(/^title:\s*"(.+)"/m);
    const title = titleMatch ? titleMatch[1] : '';
    const suffixOk = title.endsWith('[007-frontmatter-test/spec]');
    const lengthOk = title.length <= 120;

    if (suffixOk && lengthOk) {
      pass('T-FMB-003: Truncated title keeps suffix', `length=${title.length}`);
    } else {
      fail('T-FMB-003: Truncated title keeps suffix', `suffixOk=${suffixOk}, lengthOk=${lengthOk}, title="${title}"`);
    }
  } catch (error) {
    fail('T-FMB-003: Truncated title keeps suffix', error.message);
  }

  // T-FMB-004: CLI idempotency (apply then dry-run => zero changed).
  let tmpRoot = null;
  try {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'frontmatter-backfill-'));
    const specsRoot = path.join(tmpRoot, 'specs');
    const specDir = path.join(specsRoot, '001-cli-idempotency');
    const memoryDir = path.join(specDir, 'memory');

    fs.mkdirSync(memoryDir, { recursive: true });

    fs.writeFileSync(
      path.join(specDir, 'spec.md'),
      '# CLI Idempotency Spec\n\nSpec content for idempotency test.\n',
      'utf-8'
    );

    fs.writeFileSync(
      path.join(memoryDir, 'session.md'),
      '<!-- header -->\n\n---\nimportance_tier: normal\ncontextType: general\n---\n\n# SESSION SUMMARY\n\n| **Meta Data** | **Value** |\n|:--------------|:----------|\n| Importance Tier | normal |\n| Context Type | general |\n',
      'utf-8'
    );

    const reportApply = path.join(tmpRoot, 'apply-report.json');
    const reportDry = path.join(tmpRoot, 'dry-report.json');

    execSync(
      `node "${DIST_CLI}" --apply --roots "${specsRoot}" --skip-templates --include-archive --report "${reportApply}"`,
      { stdio: 'pipe' }
    );

    execSync(
      `node "${DIST_CLI}" --dry-run --roots "${specsRoot}" --skip-templates --include-archive --report "${reportDry}"`,
      { stdio: 'pipe' }
    );

    const dry = JSON.parse(fs.readFileSync(reportDry, 'utf-8'));
    if (dry.summary.changed === 0 && dry.summary.failed === 0) {
      pass('T-FMB-004: CLI idempotency', 'dry-run after apply reports 0 changed');
    } else {
      fail('T-FMB-004: CLI idempotency', `changed=${dry.summary.changed}, failed=${dry.summary.failed}`);
    }
  } catch (error) {
    fail('T-FMB-004: CLI idempotency', error.message);
  } finally {
    if (tmpRoot && fs.existsSync(tmpRoot)) {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  }

  // T-FMB-005: Managed keys normalize case-insensitively.
  try {
    const input = `---
Title: "Mixed Case Title"
TriggerPhrases: ["alpha", "beta"]
ImportanceTier: important
Context_Type: research
---

# Mixed Case Title
`;
    const result = migration.buildFrontmatterContent(
      input,
      { templatesRoot: path.join(ROOT, 'templates') },
      path.join(ROOT, 'specs', '007-case-test', 'spec.md')
    );

    const hasCanonical = result.content.includes('trigger_phrases:') &&
      result.content.includes('importance_tier: "important"') &&
      result.content.includes('contextType: "research"');
    const hasLegacyManaged = /^(TriggerPhrases|ImportanceTier|Context_Type):/m.test(result.content);

    if (hasCanonical && !hasLegacyManaged) {
      pass('T-FMB-005: Managed keys normalize case-insensitively', 'legacy key casing collapsed into canonical managed keys');
    } else {
      fail('T-FMB-005: Managed keys normalize case-insensitively', `hasCanonical=${hasCanonical}, hasLegacyManaged=${hasLegacyManaged}`);
    }
  } catch (error) {
    fail('T-FMB-005: Managed keys normalize case-insensitively', error.message);
  }

  // T-FMB-006: Inline arrays keep quoted comma values intact.
  try {
    const input = `---
triggerPhrases: ["alpha, beta", "gamma"]
---

# Trigger Test
`;
    const result = migration.buildFrontmatterContent(
      input,
      { templatesRoot: path.join(ROOT, 'templates') },
      path.join(ROOT, 'specs', '007-inline-array', 'spec.md')
    );

    const hasJoinedPhrase = result.content.includes('- "alpha, beta"');
    const splitIncorrectly = result.content.includes('- "alpha"') || result.content.includes('- "beta"');

    if (hasJoinedPhrase && !splitIncorrectly) {
      pass('T-FMB-006: Inline arrays preserve quoted commas', 'quoted comma value retained as single trigger phrase');
    } else {
      fail('T-FMB-006: Inline arrays preserve quoted commas', `hasJoinedPhrase=${hasJoinedPhrase}, splitIncorrectly=${splitIncorrectly}`);
    }
  } catch (error) {
    fail('T-FMB-006: Inline arrays preserve quoted commas', error.message);
  }

  // T-FMB-007: Strict mode skips malformed frontmatter and reports failure.
  tmpRoot = null;
  try {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'frontmatter-malformed-'));
    const specsRoot = path.join(tmpRoot, 'specs');
    const specDir = path.join(specsRoot, '001-malformed');
    const memoryDir = path.join(specDir, 'memory');
    fs.mkdirSync(memoryDir, { recursive: true });

    const malformedInput = '---\ntitle: "Unclosed frontmatter"\ncontextType: implementation\n# Missing closing delimiter on purpose\n';
    fs.writeFileSync(
      path.join(memoryDir, 'bad.md'),
      malformedInput,
      'utf-8'
    );

    const reportPath = path.join(tmpRoot, 'malformed-report.json');
    let exitedNonZero = false;
    try {
      execSync(
        `node "${DIST_CLI}" --dry-run --roots "${specsRoot}" --skip-templates --report "${reportPath}"`,
        { stdio: 'pipe' }
      );
    } catch (error) {
      exitedNonZero = true;
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    const malformedCount = report.summary.malformedSkipped || 0;
    const failedCount = report.summary.failed || 0;
    const postRun = fs.readFileSync(path.join(memoryDir, 'bad.md'), 'utf-8');
    const unchanged = postRun === malformedInput;

    if (exitedNonZero && malformedCount > 0 && failedCount > 0 && unchanged) {
      pass('T-FMB-007: Strict malformed handling reports and fails', `malformed=${malformedCount}, failed=${failedCount}, unchanged=${unchanged}`);
    } else {
      fail('T-FMB-007: Strict malformed handling reports and fails', `exitedNonZero=${exitedNonZero}, malformed=${malformedCount}, failed=${failedCount}, unchanged=${unchanged}`);
    }
  } catch (error) {
    fail('T-FMB-007: Strict malformed handling reports and fails', error.message);
  } finally {
    if (tmpRoot && fs.existsSync(tmpRoot)) {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  }

  // T-FMB-008: CLI dry-run includes template-path processing by default.
  tmpRoot = null;
  try {
    tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'frontmatter-template-'));
    const specsRoot = path.join(tmpRoot, 'specs');
    const specDir = path.join(specsRoot, '001-template-coverage');
    fs.mkdirSync(specDir, { recursive: true });
    fs.writeFileSync(path.join(specDir, 'spec.md'), '# Template Coverage\n', 'utf-8');

    const reportPath = path.join(tmpRoot, 'template-coverage-report.json');
    execSync(
      `node "${DIST_CLI}" --dry-run --roots "${specsRoot}" --report "${reportPath}"`,
      { stdio: 'pipe' }
    );

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    const templateBucket = report.byKind['template:template'];
    const templatesEnabled = report.options && report.options.skipTemplates === false;
    if (templateBucket && templateBucket.total > 0 && templatesEnabled) {
      pass('T-FMB-008: Template-path coverage included by default', `template files processed=${templateBucket.total}, skipTemplates=${report.options.skipTemplates}`);
    } else {
      fail('T-FMB-008: Template-path coverage included by default', `templateBucket=${Boolean(templateBucket)}, total=${templateBucket ? templateBucket.total : 0}, skipTemplates=${report.options ? report.options.skipTemplates : 'n/a'}`);
    }
  } catch (error) {
    fail('T-FMB-008: Template-path coverage included by default', error.message);
  } finally {
    if (tmpRoot && fs.existsSync(tmpRoot)) {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  }

  // T-FMB-009: Malformed in-block list is treated as malformed and not rewritten.
  try {
    const input = `---
title: "Malformed List"
- stray
---

# Body
`;
    const result = migration.buildFrontmatterContent(
      input,
      { templatesRoot: path.join(ROOT, 'templates') },
      path.join(ROOT, 'specs', '007-malformed-list', 'spec.md')
    );

    if (result.malformedFrontmatter && result.content === input) {
      pass('T-FMB-009: Malformed in-block list is skipped', 'malformedFrontmatter=true and content unchanged');
    } else {
      fail('T-FMB-009: Malformed in-block list is skipped', `malformed=${result.malformedFrontmatter}, unchanged=${result.content === input}`);
    }
  } catch (error) {
    fail('T-FMB-009: Malformed in-block list is skipped', error.message);
  }

  // T-FMB-010: Inline arrays support trailing YAML comments.
  try {
    const input = `---
triggerPhrases: ["alpha, beta", "gamma"] # keep this comment ignored
---

# Inline Comment Array
`;
    const result = migration.buildFrontmatterContent(
      input,
      { templatesRoot: path.join(ROOT, 'templates') },
      path.join(ROOT, 'specs', '007-inline-comment-array', 'spec.md')
    );

    const hasJoinedPhrase = result.content.includes('- "alpha, beta"');
    const hasGamma = result.content.includes('- "gamma"');
    const splitIncorrectly = result.content.includes('- "alpha"') || result.content.includes('- "beta"');

    if (hasJoinedPhrase && hasGamma && !splitIncorrectly) {
      pass('T-FMB-010: Inline arrays support trailing comments', 'array parsed before YAML comment');
    } else {
      fail('T-FMB-010: Inline arrays support trailing comments', `hasJoinedPhrase=${hasJoinedPhrase}, hasGamma=${hasGamma}, splitIncorrectly=${splitIncorrectly}`);
    }
  } catch (error) {
    fail('T-FMB-010: Inline arrays support trailing comments', error.message);
  }

  console.log('');
  console.log(`Summary: pass=${passed}, fail=${failed}`);

  if (failed > 0) {
    process.exit(1);
  }
}

run();

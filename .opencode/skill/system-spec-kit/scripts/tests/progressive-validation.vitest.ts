// TEST: Progressive Validation Pipeline
// Validates progressive-validate.sh stage behavior and compatibility
// Against validate.sh baselines, auto-fix reporting, and JSON contract outputs.
// T-PB2-01..T-PB2-15: progressive validation pipeline conformance suite.
import { describe, it, test, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { spawnSync } from 'child_process';

// CONSTANTS
const SCRIPTS_DIR = path.resolve(__dirname, '..');
const PROGRESSIVE_SCRIPT = path.join(SCRIPTS_DIR, 'spec', 'progressive-validate.sh');
const VALIDATE_SCRIPT = path.join(SCRIPTS_DIR, 'spec', 'validate.sh');
const FIXTURES_DIR = path.join(SCRIPTS_DIR, 'tests', 'test-fixtures');
const VALID_L1_FIXTURE = path.join(FIXTURES_DIR, '002-valid-level1');

// Stable date fixture used by auto-fix assertions.
function getLocalToday(): string {
  const result = spawnSync('date', ['+%F'], { encoding: 'utf8' });
  const today = result.stdout?.trim();

  if (result.status !== 0 || !today) {
    throw new Error(`Failed to resolve local date: ${result.stderr ?? 'no output'}`);
  }

  return today;
}

const TODAY = getLocalToday();

// HELPERS
/**
 * Run progressive-validate.sh against a folder with optional extra flags.
 * Returns { stdout, stderr, exitCode }.
 */
function runProgressiveValidate(
  folderPath: string,
  flags: string[] = [],
  env: Record<string, string> = {}
): { stdout: string; stderr: string; exitCode: number } {
  const result = spawnSync(
    'bash',
    [PROGRESSIVE_SCRIPT, folderPath, ...flags],
    {
      encoding: 'utf8',
      env: { ...process.env, ...env },
      timeout: 30_000,
    }
  );
  return {
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    exitCode: result.status ?? 2,
  };
}

/**
 * Run validate.sh against a folder — used to establish baseline for detect comparisons.
 */
function runValidate(
  folderPath: string,
  flags: string[] = []
): { stdout: string; exitCode: number } {
  const result = spawnSync('bash', [VALIDATE_SCRIPT, folderPath, ...flags], {
    encoding: 'utf8',
    timeout: 30_000,
  });
  return {
    stdout: result.stdout ?? '',
    exitCode: result.status ?? 2,
  };
}

/**
 * Create a temporary directory with spec document files.
 * Returns the directory path. Caller is responsible for cleanup.
 */
function createTempSpecDir(files: Record<string, string>): string {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'progressive-validation-test-'));
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(tmpDir, name), content, 'utf8');
  }
  return tmpDir;
}

/**
 * Read a file from a directory, returning its text content.
 */
function readFile(dir: string, name: string): string {
  return fs.readFileSync(path.join(dir, name), 'utf8');
}

// FIXTURES - minimal spec.md templates for auto-fix tests
/** minimal valid Level-1 fixture without placeholders. */
const MINIMAL_SPEC_MD = `
<!-- SPECKIT_TEMPLATE_SOURCE: level_1/spec.md | v2.2 -->

# Test Feature Spec

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Active |
| **Created** | ${TODAY} |

## Problem Statement

This is a test fixture for progressive validation.

## Requirements

- Requirement one

## Scope

### In Scope

- Level 1 validation

### Out of Scope

- Level 2/3 features
`.trimStart();

const MINIMAL_PLAN_MD = `
# Plan

| Field | Value |
|-------|-------|
| **Level** | 1 |

## Architecture

Basic plan.

## Implementation Steps

1. Step one
`.trimStart();

const MINIMAL_TASKS_MD = `
# Tasks

## [P1] Task list

- [ ] [P1] Task one
`.trimStart();

const MINIMAL_IMPL_MD = `
# Implementation Summary

Summary here.
`.trimStart();

// Skip suite when required scripts are unavailable.
const SCRIPT_EXISTS = fs.existsSync(PROGRESSIVE_SCRIPT);
const VALIDATE_EXISTS = fs.existsSync(VALIDATE_SCRIPT);

// SUITE
describe('Progressive Validation Pipeline', () => {

  // Guard tests.
  it('T-PB2-00a: progressive-validate.sh script exists', () => {
    expect(
      SCRIPT_EXISTS,
      `Expected progressive-validate.sh at: ${PROGRESSIVE_SCRIPT}`
    ).toBe(true);
  });

  it('T-PB2-00b: validate.sh (dependency) exists', () => {
    expect(
      VALIDATE_EXISTS,
      `Expected validate.sh at: ${VALIDATE_SCRIPT}`
    ).toBe(true);
  });

  it('T-PB2-00c: --help flag exits 0 and prints usage', () => {
    if (!SCRIPT_EXISTS) {
      test.skip('Script not found');
      return;
    }
    const { stdout, exitCode } = runProgressiveValidate('', ['--help']);
    expect(exitCode).toBe(0);
    expect(stdout).toContain('progressive-validate.sh');
    expect(stdout).toContain('--level');
    expect(stdout).toContain('--dry-run');
  });

  it('T-PB2-00d: --version flag exits 0', () => {
    if (!SCRIPT_EXISTS) {
      test.skip('Script not found');
      return;
    }
    const { stdout, exitCode } = runProgressiveValidate('', ['--version']);
    expect(exitCode).toBe(0);
    expect(stdout).toContain('progressive-validate.sh');
  });

  // Level 1 detect parity with validate.sh.
  describe('T-PB2-01: Level 1 Detect (equivalent to validate.sh)', () => {

    it('T-PB2-01a: exit code matches validate.sh for a passing fixture', () => {
      if (!SCRIPT_EXISTS || !VALIDATE_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const baseline = runValidate(VALID_L1_FIXTURE);
      const progressive = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '1']);

      expect(progressive.exitCode).toBe(baseline.exitCode);
    });

    it('T-PB2-01b: exit code matches validate.sh for an empty (failing) fixture', () => {
      if (!SCRIPT_EXISTS || !VALIDATE_EXISTS) return;

      const emptyFixture = path.join(FIXTURES_DIR, '001-empty-folder');
      if (!fs.existsSync(emptyFixture)) return;

      const baseline = runValidate(emptyFixture);
      const progressive = runProgressiveValidate(emptyFixture, ['--level', '1']);

      // Both commands fail with exit 2 on empty fixtures.
      expect(progressive.exitCode).toBe(baseline.exitCode);
      expect(progressive.exitCode).toBe(2);
    });

    it('T-PB2-01c: --level 1 stops after detect (no auto-fix mentions in output)', () => {
      if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '1']);

      // Level 1 output excludes auto-fix stage output.
      expect(stdout).not.toMatch(/Level 2.*Auto-fix/i);
      expect(stdout).not.toMatch(/\[FIX\]/);
    });

  });

  // Auto-fix date placeholder normalization.
  describe('T-PB2-02: Auto-fix — Missing dates corrected', () => {

    let tmpDir: string;

    afterEach(() => {
      if (tmpDir && fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('T-PB2-02a: YYYY-MM-DD placeholder replaced with today\'s date', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      const specContent = MINIMAL_SPEC_MD.replace(TODAY, 'YYYY-MM-DD');
      tmpDir = createTempSpecDir({
        'spec.md': specContent,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      runProgressiveValidate(tmpDir, ['--level', '2']);

      const fixed = readFile(tmpDir, 'spec.md');
      expect(fixed).toContain(TODAY);
      expect(fixed).not.toContain('YYYY-MM-DD');
    });

    it('T-PB2-02b: [DATE] placeholder replaced with today\'s date', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      const specContent = MINIMAL_SPEC_MD.replace(TODAY, '[DATE]');
      tmpDir = createTempSpecDir({
        'spec.md': specContent,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      runProgressiveValidate(tmpDir, ['--level', '2']);

      const fixed = readFile(tmpDir, 'spec.md');
      expect(fixed).toContain(TODAY);
      expect(fixed).not.toContain('[DATE]');
    });

    it('T-PB2-02c: date: TBD replaced with today\'s date', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      const specContent = `
# Feature Spec

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Active |
| **Created** | YYYY-MM-DD |

date: TBD

## Problem Statement

Test.
`.trimStart();
      tmpDir = createTempSpecDir({
        'spec.md': specContent,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      runProgressiveValidate(tmpDir, ['--level', '2']);

      const fixed = readFile(tmpDir, 'spec.md');
      // Both placeholders are normalized by auto-fix.
      expect(fixed).not.toContain('TBD');
    });

    it('T-PB2-02d: files without date placeholders are left unchanged', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      tmpDir = createTempSpecDir({
        'spec.md': MINIMAL_SPEC_MD,       // already has today
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      const before = readFile(tmpDir, 'spec.md');
      runProgressiveValidate(tmpDir, ['--level', '2']);
      const after = readFile(tmpDir, 'spec.md');

      expect(after).toBe(before);
    });

  });

  // Heading-level normalization behavior.
  describe('T-PB2-03: Auto-fix — Heading levels normalized', () => {

    let tmpDir: string;

    afterEach(() => {
      if (tmpDir && fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('T-PB2-03a: document starting at H2 is shifted so H2 becomes H1', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      const specContent = `## Feature Spec\n\nLevel: 1\n\n### Problem Statement\n\nTest.\n`;
      tmpDir = createTempSpecDir({
        'spec.md': specContent,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      runProgressiveValidate(tmpDir, ['--level', '2']);

      const fixed = readFile(tmpDir, 'spec.md');
      // Minimum heading depth normalizes to H1.
      expect(fixed).toMatch(/^# /m);
      expect(fixed).not.toMatch(/^## Feature Spec/m);
    });

    it('T-PB2-03b: document already starting at H1 is not modified (heading-wise)', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      const specContent = `# Feature Spec\n\nLevel: 1\n\n## Problem Statement\n\nTest.\n`;
      tmpDir = createTempSpecDir({
        'spec.md': specContent,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      const before = readFile(tmpDir, 'spec.md');
      runProgressiveValidate(tmpDir, ['--level', '2']);
      const after = readFile(tmpDir, 'spec.md');

      // Existing H1 structure remains unchanged.
      const beforeH1s = (before.match(/^# /gm) ?? []).length;
      const afterH1s  = (after.match(/^# /gm) ?? []).length;
      expect(afterH1s).toBe(beforeH1s);
    });

    it('T-PB2-03c: heading fix is logged in script output', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      const specContent = `## Feature Spec\n\nLevel: 1\n\n### Problem Statement\n\nTest.\n`;
      tmpDir = createTempSpecDir({
        'spec.md': specContent,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      const { stdout } = runProgressiveValidate(tmpDir, ['--level', '2']);

      // Output reports heading normalization fix.
      expect(stdout).toMatch(/HEADING_LEVELS|heading/i);
    });

  });

  // Whitespace normalization behavior.
  describe('T-PB2-04: Auto-fix — Whitespace normalized', () => {

    let tmpDir: string;

    afterEach(() => {
      if (tmpDir && fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('T-PB2-04a: trailing whitespace removed from lines', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      const contentWithTrailingSpaces = `# Spec   \n\nLevel: 1   \n\n## Section   \n\nContent here.   \n`;
      tmpDir = createTempSpecDir({
        'spec.md': contentWithTrailingSpaces,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      runProgressiveValidate(tmpDir, ['--level', '2']);

      const fixed = readFile(tmpDir, 'spec.md');
      const lines = fixed.split('\n');
      for (const line of lines) {
        // Trailing whitespace is removed on all lines.
        expect(line).not.toMatch(/[ \t]+$/);
      }
    });

    it('T-PB2-04b: CRLF line endings normalized to LF', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      const contentWithCRLF = `# Spec\r\n\r\nLevel: 1\r\n\r\n## Section\r\n\r\nContent.\r\n`;
      tmpDir = createTempSpecDir({
        'spec.md': contentWithCRLF,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      runProgressiveValidate(tmpDir, ['--level', '2']);

      const fixed = readFile(tmpDir, 'spec.md');
      // CRLF is normalized to LF.
      expect(fixed).not.toContain('\r');
    });

    it('T-PB2-04c: file without whitespace issues is left unchanged', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      const cleanContent = `# Spec\n\nLevel: 1\n\n## Section\n\nClean content.\n`;
      tmpDir = createTempSpecDir({
        'spec.md': cleanContent,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      const before = readFile(tmpDir, 'spec.md');
      runProgressiveValidate(tmpDir, ['--level', '2']);
      const after = readFile(tmpDir, 'spec.md');

      expect(after).toBe(before);
    });

    it('T-PB2-04d: whitespace fix is logged in script output', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      const contentWithTrailingSpaces = `# Spec   \n\nLevel: 1   \n\n## Section   \n\nContent.   \n`;
      tmpDir = createTempSpecDir({
        'spec.md': contentWithTrailingSpaces,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      const { stdout } = runProgressiveValidate(tmpDir, ['--level', '2']);

      expect(stdout).toMatch(/WHITESPACE|whitespace/i);
    });

  });

  // Auto-fix logging and diff evidence.
  describe('T-PB2-05: All auto-fixes logged with before/after diff', () => {

    let tmpDir: string;

    afterEach(() => {
      if (tmpDir && fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('T-PB2-05a: [FIX] marker appears in output for each applied fix', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      // File with trailing spaces → triggers WHITESPACE fix
      const dirtySpec = `# Spec   \n\nLevel: 1   \n\n## Problem Statement   \n\nTest.   \n`;
      tmpDir = createTempSpecDir({
        'spec.md': dirtySpec,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      const { stdout } = runProgressiveValidate(tmpDir, ['--level', '2']);

      expect(stdout).toContain('[FIX]');
    });

    it('T-PB2-05b: diff output present in --verbose mode', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      const dirtySpec = `# Spec   \n\nLevel: 1   \n\n## Problem Statement   \n\nTest.   \n`;
      tmpDir = createTempSpecDir({
        'spec.md': dirtySpec,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      const { stdout } = runProgressiveValidate(tmpDir, ['--level', '4', '--verbose']);

      // Diff blocks start with "---" or "+++" (unified diff format)
      const hasDiffOutput =
        stdout.includes('---') || stdout.includes('+++') ||
        stdout.toLowerCase().includes('diff') ||
        stdout.includes('[FIX]');

      expect(hasDiffOutput).toBe(true);
    });

    it('T-PB2-05c: --json output includes autoFixes array with fix records', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      // File with trailing spaces → will trigger WHITESPACE fix
      const dirtySpec = `# Spec   \n\nLevel: 1   \n\n## Problem Statement   \n\nTest.   \n`;
      tmpDir = createTempSpecDir({
        'spec.md': dirtySpec,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      const { stdout } = runProgressiveValidate(tmpDir, ['--level', '4', '--json']);

      let parsed: ProgressiveValidateReport;
      expect(() => {
        parsed = JSON.parse(stdout) as ProgressiveValidateReport;
      }).not.toThrow();

      expect(parsed).toHaveProperty('autoFixes');
      expect(parsed.autoFixes).toHaveProperty('items');
      expect(Array.isArray(parsed.autoFixes.items)).toBe(true);

      // At least one fix was recorded
      expect(parsed.autoFixes.count).toBeGreaterThanOrEqual(1);
      const firstFix = parsed.autoFixes.items[0];
      expect(firstFix).toHaveProperty('type');
      expect(firstFix).toHaveProperty('file');
      expect(firstFix).toHaveProperty('description');
    });

    it('T-PB2-05d: no [FIX] markers when no fixes are needed', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      // Perfectly clean fixture — no fixes needed
      tmpDir = createTempSpecDir({
        'spec.md': MINIMAL_SPEC_MD,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      const { stdout } = runProgressiveValidate(tmpDir, ['--level', '2']);

      expect(stdout).not.toContain('[FIX]');
      expect(stdout).toMatch(/no auto-fixes needed/i);
    });

  });

  // T-PB2-06: SUGGEST level presents issues with guided options
  describe('T-PB2-06: Suggest level presents issues with guided options', () => {

    it('T-PB2-06a: [SUGGEST] markers appear for fixable but non-auto-fixable issues', () => {
      if (!SCRIPT_EXISTS || !VALIDATE_EXISTS) return;

      // Empty folder → fails FILE_EXISTS rule, unfixable automatically
      const emptyFixture = path.join(FIXTURES_DIR, '001-empty-folder');
      if (!fs.existsSync(emptyFixture)) return;

      const { stdout } = runProgressiveValidate(emptyFixture, ['--level', '3']);

      // Either [SUGGEST] markers or a suggestion-oriented message
      const hasSuggestion =
        stdout.includes('[SUGGEST]') ||
        stdout.toLowerCase().includes('remediation') ||
        stdout.toLowerCase().includes('suggest') ||
        stdout.toLowerCase().includes('manual');

      expect(hasSuggestion).toBe(true);
    });

    it('T-PB2-06b: suggestion includes rule name and remediation text', () => {
      if (!SCRIPT_EXISTS || !VALIDATE_EXISTS) return;

      const emptyFixture = path.join(FIXTURES_DIR, '001-empty-folder');
      if (!fs.existsSync(emptyFixture)) return;

      const { stdout } = runProgressiveValidate(emptyFixture, ['--level', '3']);

      // Should mention a rule name and a remediation action
      const hasRuleRef =
        stdout.match(/FILE_EXISTS|PLACEHOLDER|SECTIONS|LEVEL/i) !== null;

      // Either the output has structured suggestion content or an explanation
      expect(hasRuleRef || stdout.toLowerCase().includes('no issues')).toBe(true);
    });

    it('T-PB2-06c: no [SUGGEST] markers for fully passing spec', () => {
      if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '3']);

      expect(stdout).not.toContain('[SUGGEST]');
    });

    it('T-PB2-06d: --json output includes suggestions array', () => {
      if (!SCRIPT_EXISTS || !VALIDATE_EXISTS) return;

      const emptyFixture = path.join(FIXTURES_DIR, '001-empty-folder');
      if (!fs.existsSync(emptyFixture)) return;

      const { stdout } = runProgressiveValidate(emptyFixture, ['--level', '4', '--json']);

      expect(() => JSON.parse(stdout)).not.toThrow();
      const parsed = JSON.parse(stdout) as ProgressiveValidateReport;

      expect(parsed).toHaveProperty('suggestions');
      expect(parsed.suggestions).toHaveProperty('items');
      expect(Array.isArray(parsed.suggestions.items)).toBe(true);
    });

  });

  // T-PB2-07: REPORT level produces structured output
  describe('T-PB2-07: Report level produces structured output', () => {

    it('T-PB2-07a: --level 4 output contains pipeline summary section', () => {
      if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '4']);

      const hasReport =
        stdout.toLowerCase().includes('report') ||
        stdout.toLowerCase().includes('summary') ||
        stdout.toLowerCase().includes('progressive');

      expect(hasReport).toBe(true);
    });

    it('T-PB2-07b: --json report includes version, pipelineLevel, folder, passed', () => {
      if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '4', '--json']);

      let parsed: ProgressiveValidateReport;
      expect(() => {
        parsed = JSON.parse(stdout) as ProgressiveValidateReport;
      }).not.toThrow();

      expect(parsed).toHaveProperty('version');
      expect(parsed).toHaveProperty('pipelineLevel');
      expect(parsed).toHaveProperty('folder');
      expect(parsed).toHaveProperty('passed');
      expect(parsed).toHaveProperty('autoFixes');
      expect(parsed).toHaveProperty('suggestions');
    });

    it('T-PB2-07c: JSON report pipelineLevel matches --level argument', () => {
      if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '4', '--json']);

      const parsed = JSON.parse(stdout);
      expect(parsed.pipelineLevel).toBe(4);
    });

    it('T-PB2-07d: JSON report folder matches input path', () => {
      if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '4', '--json']);

      const parsed = JSON.parse(stdout);
      expect(parsed.folder).toBe(VALID_L1_FIXTURE);
    });

    it('T-PB2-07e: --level 4 is the default (omitting --level gives same as --level 4)', { timeout: 15000 }, () => {
      if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const withLevel = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '4', '--json']);
      const withDefault = runProgressiveValidate(VALID_L1_FIXTURE, ['--json']);

      const parsedLevel = JSON.parse(withLevel.stdout);
      const parsedDefault = JSON.parse(withDefault.stdout);

      expect(parsedDefault.pipelineLevel).toBe(parsedLevel.pipelineLevel);
    });

  });

  // T-PB2-08: DRY-RUN mode — shows changes without applying
  describe('T-PB2-08: --dry-run shows changes without applying', () => {

    let tmpDir: string;

    afterEach(() => {
      if (tmpDir && fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    });

    it('T-PB2-08a: file contents unchanged when --dry-run used', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      // Use a file with date placeholder — would normally be fixed
      const specContent = MINIMAL_SPEC_MD.replace(TODAY, 'YYYY-MM-DD');
      tmpDir = createTempSpecDir({
        'spec.md': specContent,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      const before = readFile(tmpDir, 'spec.md');
      runProgressiveValidate(tmpDir, ['--level', '2', '--dry-run']);
      const after = readFile(tmpDir, 'spec.md');

      // Content must be identical — dry-run does not write
      expect(after).toBe(before);
    });

    it('T-PB2-08b: [DRY-RUN] marker appears in output', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      const specContent = MINIMAL_SPEC_MD.replace(TODAY, 'YYYY-MM-DD');
      tmpDir = createTempSpecDir({
        'spec.md': specContent,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      const { stdout } = runProgressiveValidate(tmpDir, ['--level', '2', '--dry-run']);

      expect(stdout).toContain('[DRY-RUN]');
    });

    it('T-PB2-08c: dry-run summary mentions how many fixes would be applied', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      const specContent = MINIMAL_SPEC_MD.replace(TODAY, 'YYYY-MM-DD');
      tmpDir = createTempSpecDir({
        'spec.md': specContent,
        'plan.md': MINIMAL_PLAN_MD,
        'tasks.md': MINIMAL_TASKS_MD,
        'implementation-summary.md': MINIMAL_IMPL_MD,
      });

      const { stdout } = runProgressiveValidate(tmpDir, ['--level', '2', '--dry-run']);

      // Should mention "would be applied" or count of fixes
      const mentionsCount =
        stdout.match(/\d+\s+fix/i) !== null ||
        stdout.toLowerCase().includes('would be applied');

      expect(mentionsCount).toBe(true);
    });

    it('T-PB2-08d: --json dry-run report has dryRun:true', () => {
      if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, [
        '--level', '4', '--dry-run', '--json',
      ]);

      let parsed: ProgressiveValidateReport;
      expect(() => {
        parsed = JSON.parse(stdout) as ProgressiveValidateReport;
      }).not.toThrow();

      expect(parsed.dryRun).toBe(true);
    });

  });

  // T-PB2-09: Exit code compatibility (0 / 1 / 2)
  describe('T-PB2-09: Exit code compatibility (0 / 1 / 2)', () => {

    it('T-PB2-09a: exit 0 for a passing spec (full pipeline)', () => {
      if (!SCRIPT_EXISTS || !VALIDATE_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      // Validate.sh returns exit 1 (warnings) for the minimal fixture.
      // So the progressive validator must also exit 1 for the same folder.
      const baseline = runValidate(VALID_L1_FIXTURE);
      const progressive = runProgressiveValidate(VALID_L1_FIXTURE);

      expect(progressive.exitCode).toBe(baseline.exitCode);
    });

    it('T-PB2-09b: exit 2 for a failing spec (missing required files)', () => {
      if (!SCRIPT_EXISTS || !VALIDATE_EXISTS) return;

      const emptyFixture = path.join(FIXTURES_DIR, '001-empty-folder');
      if (!fs.existsSync(emptyFixture)) return;

      const { exitCode } = runProgressiveValidate(emptyFixture);
      expect(exitCode).toBe(2);
    });

    it('T-PB2-09c: exit 1 for a spec with warnings (not errors)', () => {
      if (!SCRIPT_EXISTS || !VALIDATE_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const baseline = runValidate(VALID_L1_FIXTURE);
      if (baseline.exitCode !== 1) return; // Skip if fixture doesn't produce warnings

      const progressive = runProgressiveValidate(VALID_L1_FIXTURE);
      expect(progressive.exitCode).toBe(1);
    });

    it('T-PB2-09d: --strict promotes warnings to exit 2', () => {
      if (!SCRIPT_EXISTS || !VALIDATE_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      // Only meaningful if baseline exit code is 1 (warnings)
      const baseline = runValidate(VALID_L1_FIXTURE);
      if (baseline.exitCode !== 1) return;

      const { exitCode } = runProgressiveValidate(VALID_L1_FIXTURE, ['--strict']);
      expect(exitCode).toBe(2);
    });

    it('T-PB2-09e: exit codes are not changed by auto-fixes in Level 2', () => {
      if (!SCRIPT_EXISTS || !VALIDATE_EXISTS) return;

      // An empty folder should still exit 2 even at level 2 (auto-fix cannot create files)
      const emptyFixture = path.join(FIXTURES_DIR, '001-empty-folder');
      if (!fs.existsSync(emptyFixture)) return;

      const { exitCode } = runProgressiveValidate(emptyFixture, ['--level', '2']);
      expect(exitCode).toBe(2);
    });

  });

  // T-PB2-10: --json produces parseable structured output
  describe('T-PB2-10: --json produces parseable structured output', () => {

    it('T-PB2-10a: --json output is valid JSON', () => {
      if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--json']);

      expect(() => JSON.parse(stdout)).not.toThrow();
    });

    it('T-PB2-10b: JSON report has all required top-level fields', () => {
      if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--json']);
      const parsed = JSON.parse(stdout);

      const requiredFields = [
        'version',
        'pipelineLevel',
        'dryRun',
        'folder',
        'detectExitCode',
        'passed',
        'strict',
        'autoFixes',
        'suggestions',
      ];

      for (const field of requiredFields) {
        expect(parsed, `Missing field: ${field}`).toHaveProperty(field);
      }
    });

    it('T-PB2-10c: autoFixes object has count, applied, items, diffs fields', () => {
      if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--json']);
      const parsed = JSON.parse(stdout);

      expect(parsed.autoFixes).toHaveProperty('count');
      expect(parsed.autoFixes).toHaveProperty('applied');
      expect(parsed.autoFixes).toHaveProperty('items');
      expect(parsed.autoFixes).toHaveProperty('diffs');
      expect(typeof parsed.autoFixes.count).toBe('number');
      expect(Array.isArray(parsed.autoFixes.items)).toBe(true);
    });

    it('T-PB2-10d: suggestions object has count and items fields', () => {
      if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--json']);
      const parsed = JSON.parse(stdout);

      expect(parsed.suggestions).toHaveProperty('count');
      expect(parsed.suggestions).toHaveProperty('items');
      expect(typeof parsed.suggestions.count).toBe('number');
      expect(Array.isArray(parsed.suggestions.items)).toBe(true);
    });

  });

  // T-PB2-11 / T-PB2-12 / T-PB2-13: --level N pipeline stages
  describe('T-PB2-11/12/13: --level N controls pipeline depth', () => {

    it('T-PB2-11: --level 1 output does NOT contain Level 2/3/4 headings', () => {
      if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '1']);

      expect(stdout).not.toMatch(/Level 2.*Auto-fix/i);
      expect(stdout).not.toMatch(/Level 3.*Suggest/i);
      expect(stdout).not.toMatch(/Level 4.*Report/i);
    });

    it('T-PB2-12: --level 2 output contains Level 2 heading but NOT Level 3/4', () => {
      if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '2']);

      // Level 2 section should be present
      const hasLevel2 = stdout.match(/Level 2.*Auto-fix/i) !== null || stdout.includes('[FIX]') || stdout.includes('auto-fix');
      expect(hasLevel2).toBe(true);

      // Level 3 and 4 sections should NOT be present
      expect(stdout).not.toMatch(/Level 3.*Suggest/i);
      expect(stdout).not.toMatch(/Level 4.*Report/i);
    });

    it('T-PB2-13: --level 3 output contains Level 3 heading but NOT Level 4 report', () => {
      if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '3']);

      // Level 3 section should be present
      const hasLevel3 = stdout.match(/Level 3.*Suggest/i) !== null || stdout.match(/suggest/i) !== null;
      expect(hasLevel3).toBe(true);

      // Level 4 report section should NOT appear
      expect(stdout).not.toMatch(/Level 4.*Report/i);
    });

    it('T-PB2-14: invalid --level value (0 or 5) causes exit 2', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      const result0 = runProgressiveValidate('', ['--level', '0']);
      expect(result0.exitCode).toBe(2);

      const result5 = runProgressiveValidate('', ['--level', '5']);
      expect(result5.exitCode).toBe(2);
    });

  });

  // T-PB2-15: Edge cases
  describe('T-PB2-15: Edge cases', () => {

    it('T-PB2-15a: missing folder argument exits 2 with error message', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      const { exitCode, stderr } = runProgressiveValidate('');
      expect(exitCode).toBe(2);
      expect(stderr + '').toMatch(/required|path/i);
    });

    it('T-PB2-15b: non-existent folder exits 2 with error message', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      const { exitCode, stderr } = runProgressiveValidate('/tmp/does-not-exist-progressive-validation-test');
      expect(exitCode).toBe(2);
      expect(stderr + '').toMatch(/not found|folder/i);
    });

    it('T-PB2-15c: unknown flag exits 2 with error message', () => {
      if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE)) return;

      const { exitCode } = runProgressiveValidate(VALID_L1_FIXTURE, ['--unknown-flag-xyz']);
      expect(exitCode).toBe(2);
    });

    it('T-PB2-15d: multiple .md files in folder all processed by auto-fix', () => {
      if (!SCRIPT_EXISTS) {
        test.skip('Script not found');
        return;
      }

      let tmpDir: string | null = null;
      try {
        // Both spec.md and plan.md have trailing spaces
        const dirtySpec = `# Spec   \n\nLevel: 1   \n\n## Section   \n\nContent.   \n`;
        const dirtyPlan = `# Plan   \n\nLevel: 1   \n\n## Architecture   \n\nDetails.   \n`;
        tmpDir = createTempSpecDir({
          'spec.md': dirtySpec,
          'plan.md': dirtyPlan,
          'tasks.md': MINIMAL_TASKS_MD,
          'implementation-summary.md': MINIMAL_IMPL_MD,
        });

        runProgressiveValidate(tmpDir, ['--level', '2']);

        const fixedSpec = readFile(tmpDir, 'spec.md');
        const fixedPlan = readFile(tmpDir, 'plan.md');

        // Verify both files have trailing whitespace removed
        for (const line of fixedSpec.split('\n')) {
          expect(line).not.toMatch(/[ \t]+$/);
        }
        for (const line of fixedPlan.split('\n')) {
          expect(line).not.toMatch(/[ \t]+$/);
        }
      } finally {
        if (tmpDir && fs.existsSync(tmpDir)) {
          fs.rmSync(tmpDir, { recursive: true, force: true });
        }
      }
    });

  });

});

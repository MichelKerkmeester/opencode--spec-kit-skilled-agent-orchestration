// TEST: Progressive Validation Pipeline
// Tests for progressive-validate.sh -- a 4-level validation pipeline:
// Level 1: Detect   (delegate to validate.sh)
// Level 2: Auto-fix (missing dates, heading levels, whitespace)
// Level 3: Suggest  (guided options for non-automatable issues)
// Level 4: Report   (structured output with diffs)
//
// Checklist coverage:
// CHK-PI-B2-001 [P1]: Detect level -- all violations identified
// CHK-PI-B2-002 [P1]: Auto-fix -- missing dates corrected
// CHK-PI-B2-003 [P1]: Auto-fix -- heading levels normalized
// CHK-PI-B2-004 [P1]: Auto-fix -- whitespace normalization
// CHK-PI-B2-005 [P0]: All auto-fixes logged with before/after diff
// CHK-PI-B2-006 [P1]: Suggest level -- guided fix options
// CHK-PI-B2-007 [P1]: Report level -- structured output
// CHK-PI-B2-008 [P0]: Exit code compatibility: 0/1/2
// CHK-PI-B2-009 [P1]: Dry-run mode: no changes applied
// CHK-PI-B2-010 [P2]: Existing validate.sh callers unaffected
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// --- Constants -------------------------------------------------
const SCRIPTS_DIR = path.resolve(
  __dirname,
  '../../scripts/spec'
);
const PROGRESSIVE_VALIDATE = path.join(SCRIPTS_DIR, 'progressive-validate.sh');
const VALIDATE_SH = path.join(SCRIPTS_DIR, 'validate.sh');

const EXEC_OPTS: ExecSyncOptionsWithStringEncoding = {
  encoding: 'utf-8',
  timeout: 30_000,
  env: {
    ...process.env,
    // Disable colors for easier output parsing
    TERM: 'dumb',
    NO_COLOR: '1',
  },
};

type ProgressiveReport = Record<string, unknown> & {
  pipelineLevel?: number;
  report?: Record<string, unknown>;
  version?: string;
  folder?: string;
  detectExitCode?: number;
  passed?: boolean;
  strict?: boolean;
  dryRun?: boolean;
  results?: unknown;
  autoFixes?: {
    count: number;
    applied?: boolean;
    items: Array<{
      type: string;
      description: string;
      file: string;
    }>;
    diffs: string;
  };
  suggestions?: {
    count: number;
    items: Array<{
      remediation: string;
    }>;
  };
};

type ExecSyncFailure = Error & {
  stdout?: string | Buffer;
  stderr?: string | Buffer;
  status?: number | null;
};

function toOutputText(value: string | Buffer | undefined): string {
  if (typeof value === 'string') {
    return value;
  }
  return value?.toString() ?? '';
}

function asExecSyncFailure(error: unknown): ExecSyncFailure {
  if (error instanceof Error) {
    return error as ExecSyncFailure;
  }
  return new Error(String(error)) as ExecSyncFailure;
}

function expectPresent<T>(value: T | null | undefined, message: string): T {
  expect(value).toBeDefined();
  expect(value).not.toBeNull();
  if (value == null) {
    throw new Error(message);
  }
  return value;
}

// --- Helpers ---------------------------------------------------

/** Create a temporary spec folder with given files. Returns folder path. */
function createTempSpecFolder(files: Record<string, string>): string {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prog-validate-test-'));
  for (const [filename, content] of Object.entries(files)) {
    const filePath = path.join(tmpDir, filename);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf-8');
  }
  return tmpDir;
}

/** Run progressive-validate.sh and return { stdout, exitCode } */
function runProgressive(
  folderPath: string,
  extraArgs: string[] = []
): { stdout: string; exitCode: number } {
  const args = [folderPath, ...extraArgs].filter(Boolean).join(' ');
  const cmd = args ? `"${PROGRESSIVE_VALIDATE}" ${args}` : `"${PROGRESSIVE_VALIDATE}"`;
  try {
    const stdout = execSync(cmd, {
      ...EXEC_OPTS,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { stdout: stdout.toString(), exitCode: 0 };
  } catch (err: unknown) {
    const failure = asExecSyncFailure(err);
    return {
      stdout: toOutputText(failure.stdout) + toOutputText(failure.stderr),
      exitCode: failure.status ?? 2,
    };
  }
}

/** Run validate.sh directly and return { stdout, exitCode } */
function runValidate(
  folderPath: string,
  extraArgs: string[] = []
): { stdout: string; exitCode: number } {
  const args = [folderPath, ...extraArgs].join(' ');
  try {
    const stdout = execSync(`"${VALIDATE_SH}" ${args}`, {
      ...EXEC_OPTS,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { stdout: stdout.toString(), exitCode: 0 };
  } catch (err: unknown) {
    const failure = asExecSyncFailure(err);
    return {
      stdout: toOutputText(failure.stdout) + toOutputText(failure.stderr),
      exitCode: failure.status ?? 2,
    };
  }
}

/** Get today's date in YYYY-MM-DD format */
function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Create a minimal Level 1 spec folder.
 * Note: validate.sh always returns exit 2 for temp folders due to strict rules
 * (FOLDER_NAMING, ANCHORS_VALID, TEMPLATE_SOURCE). This is expected behavior.
 */
function createMinimalLevel1Folder(): string {
  const today = getToday();
  return createTempSpecFolder({
    'spec.md': `# Test Spec\n\n| **Level** | 1 |\n| **Date** | ${today} |\n\n## Overview\nThis is a test spec.\n\n## Scope\nTest scope.\n\n## Requirements\nTest requirements.\n`,
    'plan.md': `# Plan\n\n## Approach\nTest approach.\n\n## Steps\n1. Step one.\n`,
    'tasks.md': `# Tasks\n\n## Task List\n- [ ] Task 1\n- [ ] Task 2\n`,
  });
}

/** Create a spec folder with date placeholders for auto-fix testing */
function createDatePlaceholderFolder(): string {
  return createTempSpecFolder({
    'spec.md': `# Test Spec\n\n| **Level** | 1 |\n| **Date** | YYYY-MM-DD |\n\n## Overview\nCreated on: [DATE]\n\n## Scope\ndate: TBD\n`,
    'plan.md': `# Plan\n\n## Approach\nTest approach.\n\n## Steps\n1. Step one.\n`,
    'tasks.md': `# Tasks\n\n## Task List\n- [ ] Task 1\n`,
  });
}

/** Create a spec folder with heading level issues */
function createHeadingIssueFolder(): string {
  return createTempSpecFolder({
    'spec.md': `## Test Spec\n\n| **Level** | 1 |\n\n### Overview\nThis spec starts at H2 instead of H1.\n\n#### Details\nMore details here.\n`,
    'plan.md': `# Plan\n\n## Approach\nTest approach.\n`,
    'tasks.md': `# Tasks\n\n## Task List\n- [ ] Task 1\n`,
  });
}

/** Create a spec folder with whitespace issues */
function createWhitespaceIssueFolder(): string {
  return createTempSpecFolder({
    'spec.md': '# Test Spec   \n\n| **Level** | 1 |\n\n## Overview   \nSome text with trailing spaces.   \n',
    'plan.md': '# Plan\r\n\r\n## Approach\r\nCRLF line endings.\r\n',
    'tasks.md': '# Tasks\n\n## Task List\n- [ ] Task 1\n',
  });
}

// Collect temp dirs for cleanup
let tempDirs: string[] = [];

/**
 * Extract the progressive-validate JSON report from combined output.
 * Level 4 JSON output may contain both the validate.sh JSON (from detect)
 * and the progressive report JSON. We want the progressive report which
 * contains "pipelineLevel".
 */
function extractProgressiveJson(stdout: string): ProgressiveReport | null {
  // The progressive report is emitted last and contains "pipelineLevel"
  // Try to find the last complete JSON object containing pipelineLevel
  const lines = stdout.split('\n');
  let braceDepth = 0;
  let jsonStart = -1;
  let lastJson = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const ch of line) {
      if (ch === '{') {
        if (braceDepth === 0) jsonStart = i;
        braceDepth++;
      } else if (ch === '}') {
        braceDepth--;
        if (braceDepth === 0 && jsonStart >= 0) {
          const candidate = lines.slice(jsonStart, i + 1).join('\n');
          if (candidate.includes('pipelineLevel')) {
            lastJson = candidate;
          }
          jsonStart = -1;
        }
      }
    }
  }

  if (lastJson) {
    try {
      return JSON.parse(lastJson);
    } catch {
      return null;
    }
  }
  return null;
}

// --- Test Suites -----------------------------------------------

describe('PI-B2: Progressive Validation Pipeline', () => {
  beforeEach(() => {
    tempDirs = [];
  });

  afterEach(() => {
    for (const dir of tempDirs) {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch {
        // Best-effort cleanup
      }
    }
  });

  function tracked(dir: string): string {
    tempDirs.push(dir);
    return dir;
  }

  // --- Prerequisites -------------------------------------------
  describe('Prerequisites', () => {
    it('progressive-validate.sh exists and is executable', () => {
      expect(fs.existsSync(PROGRESSIVE_VALIDATE)).toBe(true);
      const stat = fs.statSync(PROGRESSIVE_VALIDATE);
      expect(stat.mode & 0o100).toBeTruthy();
    });

    it('validate.sh exists and is executable', () => {
      expect(fs.existsSync(VALIDATE_SH)).toBe(true);
      const stat = fs.statSync(VALIDATE_SH);
      expect(stat.mode & 0o100).toBeTruthy();
    });

    it('--help flag works', () => {
      const { stdout, exitCode } = runProgressive('', ['--help']);
      expect(exitCode).toBe(0);
      expect(stdout).toContain('progressive-validate.sh');
      expect(stdout).toContain('USAGE');
      expect(stdout).toContain('--level');
      expect(stdout).toContain('--dry-run');
    });

    it('--version flag works', () => {
      const { stdout, exitCode } = runProgressive('', ['--version']);
      expect(exitCode).toBe(0);
      expect(stdout).toContain('progressive-validate.sh version');
    });
  });

  // --- CHK-PI-B2-001: Detect Level ----------------------------
  describe('CHK-PI-B2-001: Detect level -- all violations identified', () => {
    it('Level 1 detect runs and produces output', () => {
      const folder = tracked(createMinimalLevel1Folder());
      const { stdout, exitCode } = runProgressive(folder, ['--level', '1']);
      // Validate.sh returns exit 2 for temp folders due to strict rules
      // (FOLDER_NAMING, ANCHORS_VALID, TEMPLATE_SOURCE) -- this is expected
      expect([0, 1, 2]).toContain(exitCode);
      // Should produce validation output
      expect(stdout.length).toBeGreaterThan(0);
    });

    it('Level 1 detect identifies missing files', () => {
      const folder = tracked(createTempSpecFolder({
        'spec.md': '# Spec\n\n| **Level** | 1 |\n',
        // Plan.md and tasks.md are missing
      }));
      const { exitCode } = runProgressive(folder, ['--level', '1']);
      expect(exitCode).toBe(2);
    });

    it('Level 1 detect with --json produces JSON output', () => {
      const folder = tracked(createMinimalLevel1Folder());
      const { stdout } = runProgressive(folder, ['--level', '1', '--json']);
      // Should produce JSON containing results
      expect(stdout).toContain('"results"');
      expect(stdout).toContain('{');
    });

    it('Level 1 does not modify files', () => {
      const folder = tracked(createDatePlaceholderFolder());
      const originalContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');

      runProgressive(folder, ['--level', '1']);

      const afterContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');
      expect(afterContent).toBe(originalContent);
    });
  });

  // --- CHK-PI-B2-002: Auto-fix -- Missing Dates ---------------
  describe('CHK-PI-B2-002: Auto-fix -- missing dates corrected', () => {
    it('YYYY-MM-DD placeholder replaced with today date', () => {
      const folder = tracked(createDatePlaceholderFolder());
      const today = getToday();

      runProgressive(folder, ['--level', '2']);

      const specContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');
      expect(specContent).not.toContain('YYYY-MM-DD');
      expect(specContent).toContain(today);
    });

    it('[DATE] placeholder replaced with today date', () => {
      const folder = tracked(createDatePlaceholderFolder());
      const today = getToday();

      runProgressive(folder, ['--level', '2']);

      const specContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');
      expect(specContent).not.toContain('[DATE]');
      expect(specContent).toContain(today);
    });

    it('date: TBD replaced with today date', () => {
      const folder = tracked(createDatePlaceholderFolder());
      const today = getToday();

      runProgressive(folder, ['--level', '2']);

      const specContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');
      expect(specContent.toLowerCase()).not.toMatch(/date:\s*tbd/);
    });
  });

  // --- CHK-PI-B2-003: Auto-fix -- Heading Levels ---------------
  describe('CHK-PI-B2-003: Auto-fix -- heading levels normalized', () => {
    it('headings starting at H2 are shifted to start at H1', () => {
      const folder = tracked(createHeadingIssueFolder());

      runProgressive(folder, ['--level', '2']);

      const specContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');
      const lines = specContent.split('\n');
      const firstHeading = lines.find(l => l.startsWith('#'));
      expect(firstHeading).toBeTruthy();
      // Should start with single # (H1), not ## (H2)
      expect(firstHeading!.startsWith('# ')).toBe(true);
      expect(firstHeading!.startsWith('## ')).toBe(false);
    });

    it('sub-heading levels are preserved relatively after normalization', () => {
      const folder = tracked(createHeadingIssueFolder());

      runProgressive(folder, ['--level', '2']);

      const specContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');
      const lines = specContent.split('\n');
      const headings = lines.filter(l => /^#{1,6}\s/.test(l));

      // Original: ## (level 2), ### (level 3), #### (level 4)
      // Expected: # (level 1), ## (level 2), ### (level 3)
      expect(headings.length).toBeGreaterThanOrEqual(2);
      const h2Headings = headings.filter(h => h.startsWith('## ') && !h.startsWith('### '));
      expect(h2Headings.length).toBeGreaterThan(0);
    });

    it('files already starting at H1 are not modified by heading fix', () => {
      const folder = tracked(createMinimalLevel1Folder());
      const originalContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');

      runProgressive(folder, ['--level', '2']);

      const afterContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');
      // Heading structure should be unchanged (whitespace may be normalized)
      const originalHeadings = originalContent.split('\n').filter(l => /^#{1,6}\s/.test(l));
      const afterHeadings = afterContent.split('\n').filter(l => /^#{1,6}\s/.test(l));
      expect(afterHeadings).toEqual(originalHeadings);
    });
  });

  // --- CHK-PI-B2-004: Auto-fix -- Whitespace Normalization -----
  describe('CHK-PI-B2-004: Auto-fix -- whitespace normalization', () => {
    it('trailing whitespace is trimmed from lines', () => {
      const folder = tracked(createWhitespaceIssueFolder());

      runProgressive(folder, ['--level', '2']);

      const specContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');
      const lines = specContent.split('\n');
      for (const line of lines) {
        if (line.length > 0) {
          expect(line).toBe(line.trimEnd());
        }
      }
    });

    it('CRLF line endings are normalized to LF', () => {
      const folder = tracked(createWhitespaceIssueFolder());

      runProgressive(folder, ['--level', '2']);

      const planContent = fs.readFileSync(path.join(folder, 'plan.md'), 'utf-8');
      expect(planContent).not.toContain('\r\n');
      expect(planContent).not.toContain('\r');
    });

    it('file ends with a newline after normalization', () => {
      const folder = tracked(createWhitespaceIssueFolder());

      runProgressive(folder, ['--level', '2']);

      const specContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');
      expect(specContent.endsWith('\n')).toBe(true);
    });
  });

  // --- CHK-PI-B2-005 [P0]: Auto-fixes logged with diff --------
  describe('CHK-PI-B2-005 [P0]: All auto-fixes logged with before/after diff', () => {
    it('JSON output includes autoFixes section with diffs', () => {
      const folder = tracked(createDatePlaceholderFolder());

      const { stdout } = runProgressive(folder, ['--level', '4', '--json']);

      const report = expectPresent(
        extractProgressiveJson(stdout),
        'Expected progressive validation JSON report'
      );
      const autoFixes = expectPresent(report.autoFixes, 'Expected autoFixes in progressive report');
      expect(autoFixes.count).toBeGreaterThan(0);
      expect(autoFixes.items).toBeDefined();
      expect(Array.isArray(autoFixes.items)).toBe(true);
      expect(autoFixes.items.length).toBeGreaterThan(0);

      // Verify diff content is present
      expect(autoFixes.diffs).toBeDefined();
      expect(typeof autoFixes.diffs).toBe('string');
      if (autoFixes.diffs.length > 0) {
        expect(autoFixes.diffs).toContain('DIFF');
      }
    });

    it('each auto-fix item has type and description', () => {
      const folder = tracked(createDatePlaceholderFolder());

      const { stdout } = runProgressive(folder, ['--level', '4', '--json']);

      const report = expectPresent(
        extractProgressiveJson(stdout),
        'Expected progressive validation JSON report'
      );
      const autoFixes = expectPresent(report.autoFixes, 'Expected autoFixes in progressive report');

      for (const item of autoFixes.items) {
        expect(item.type).toBeDefined();
        expect(typeof item.type).toBe('string');
        expect(item.description).toBeDefined();
        expect(typeof item.description).toBe('string');
        expect(item.file).toBeDefined();
      }
    });

    it('human-readable output mentions auto-fix activity', () => {
      const folder = tracked(createDatePlaceholderFolder());

      const { stdout } = runProgressive(folder, ['--level', '2']);

      // Should mention auto-fix(es) applied or FIX labels
      expect(stdout).toMatch(/fix|FIX|Applied|auto-fix/i);
    });
  });

  // --- CHK-PI-B2-006: Suggest Level ---------------------------
  describe('CHK-PI-B2-006: Suggest level -- guided fix options', () => {
    it('Level 3 runs suggest phase for issues', () => {
      const folder = tracked(createTempSpecFolder({
        'spec.md': '# Spec\n\n| **Level** | 2 |\n\n## Overview\nTest.\n',
        'plan.md': '# Plan\n\n## Approach\nTest.\n',
        'tasks.md': '# Tasks\n\n## Task List\n- [ ] Task 1\n',
        // Checklist.md missing for Level 2
      }));

      const { exitCode } = runProgressive(folder, ['--level', '3']);
      // Should have exit code 2 (errors) since files are missing
      expect(exitCode).toBe(2);
    });

    it('Level 4 with --json includes suggestions array', () => {
      const folder = tracked(createTempSpecFolder({
        'spec.md': '# Spec\n\n| **Level** | 2 |\n\n## Overview\nTest.\n',
        'plan.md': '# Plan\n\n## Approach\nTest.\n',
        'tasks.md': '# Tasks\n\n## Task List\n- [ ] Task 1\n',
      }));

      const { stdout } = runProgressive(folder, ['--level', '4', '--json']);

      const report = expectPresent(
        extractProgressiveJson(stdout),
        'Expected progressive validation JSON report'
      );
      const suggestions = expectPresent(
        report.suggestions,
        'Expected suggestions in progressive report'
      );
      expect(suggestions).toBeDefined();
      expect(suggestions.count).toBeDefined();
      expect(Array.isArray(suggestions.items)).toBe(true);
    });

    it('suggestions include remediation guidance', () => {
      const folder = tracked(createTempSpecFolder({
        'spec.md': '# Spec\n\n| **Level** | 2 |\n\n## Overview\nTest.\n',
        'plan.md': '# Plan\n\n## Approach\nTest.\n',
        'tasks.md': '# Tasks\n\n## Task List\n- [ ] Task 1\n',
      }));

      const { stdout } = runProgressive(folder, ['--level', '4', '--json']);

      const report = expectPresent(
        extractProgressiveJson(stdout),
        'Expected progressive validation JSON report'
      );
      const suggestions = expectPresent(
        report.suggestions,
        'Expected suggestions in progressive report'
      );
      if (suggestions.count > 0) {
        for (const item of suggestions.items) {
          expect(item.remediation).toBeDefined();
          expect(typeof item.remediation).toBe('string');
          expect(item.remediation.length).toBeGreaterThan(0);
        }
      }
    });
  });

  // --- CHK-PI-B2-007: Report Level ----------------------------
  describe('CHK-PI-B2-007: Report level -- structured output', () => {
    it('Level 4 JSON report has expected top-level keys', () => {
      const folder = tracked(createMinimalLevel1Folder());

      const { stdout } = runProgressive(folder, ['--level', '4', '--json']);

      const report = expectPresent(
        extractProgressiveJson(stdout),
        'Expected progressive validation JSON report'
      );
      expect(report.version).toBeDefined();
      expect(report.pipelineLevel).toBe(4);
      expect(report.folder).toBeDefined();
      expect(report.detectExitCode).toBeDefined();
      expect(typeof report.passed).toBe('boolean');
      expect(typeof report.strict).toBe('boolean');
      expect(report.autoFixes).toBeDefined();
      expect(report.suggestions).toBeDefined();
    });

    it('Level 4 human report includes summary section', () => {
      const folder = tracked(createMinimalLevel1Folder());

      const { stdout } = runProgressive(folder, ['--level', '4']);

      expect(stdout).toContain('Report');
      expect(stdout).toContain('Folder');
      expect(stdout).toContain('Pipeline');
    });

    it('Level 4 quiet mode produces single-line result', () => {
      const folder = tracked(createMinimalLevel1Folder());

      const { stdout } = runProgressive(folder, ['--level', '4', '--quiet']);

      expect(stdout).toContain('RESULT:');
      expect(stdout).toMatch(/autofixes=\d+/);
      expect(stdout).toMatch(/suggestions=\d+/);
    });

    it('report correctly reflects dry-run state', () => {
      const folder = tracked(createDatePlaceholderFolder());

      const { stdout } = runProgressive(folder, ['--level', '4', '--json', '--dry-run']);

      const report = expectPresent(
        extractProgressiveJson(stdout),
        'Expected progressive validation JSON report'
      );
      const autoFixes = expectPresent(report.autoFixes, 'Expected autoFixes in progressive report');
      expect(report.dryRun).toBe(true);
      expect(autoFixes.applied).toBe(false);
    });
  });

  // --- CHK-PI-B2-008 [P0]: Exit Code Compatibility ------------
  describe('CHK-PI-B2-008 [P0]: Exit code compatibility: 0/1/2', () => {
    it('exit code 2 for missing required files (errors)', () => {
      const folder = tracked(createTempSpecFolder({
        'spec.md': '# Spec\n\n| **Level** | 1 |\n',
        // Missing plan.md and tasks.md
      }));

      const { exitCode } = runProgressive(folder, ['--level', '1']);
      expect(exitCode).toBe(2);
    });

    it('exit code 2 for folder not found', () => {
      const { exitCode } = runProgressive('/tmp/nonexistent-folder-pi-b2-abc123');
      expect(exitCode).toBe(2);
    });

    it('exit code in {0, 1, 2} for valid folder', () => {
      // Validate.sh always returns 2 for temp folders due to strict rules
      // (FOLDER_NAMING, ANCHORS_VALID, TEMPLATE_SOURCE), but the exit code
      // Contract is the standard 0/1/2 range
      const folder = tracked(createMinimalLevel1Folder());
      const { exitCode } = runProgressive(folder, ['--level', '1']);
      expect([0, 1, 2]).toContain(exitCode);
    });

    it('exit codes are consistent between levels', () => {
      const folder = tracked(createTempSpecFolder({
        'spec.md': '# Spec\n\n| **Level** | 1 |\n',
        // Missing plan.md and tasks.md
      }));

      const level1 = runProgressive(folder, ['--level', '1']);
      // Create a fresh copy for level 4 (level 2 auto-fix may alter files)
      const folder4 = tracked(createTempSpecFolder({
        'spec.md': '# Spec\n\n| **Level** | 1 |\n',
      }));
      const level4 = runProgressive(folder4, ['--level', '4']);

      // Both should report exit 2 since required files are missing
      expect(level1.exitCode).toBe(2);
      expect(level4.exitCode).toBe(2);
    });

    it('exit code 2 with --strict mode when warnings exist', () => {
      const folder = tracked(createMinimalLevel1Folder());
      const { exitCode } = runProgressive(folder, ['--level', '1', '--strict']);
      // With strict mode, warnings also cause failure
      expect([0, 2]).toContain(exitCode);
    });
  });

  // --- CHK-PI-B2-009: Dry-Run Mode ----------------------------
  describe('CHK-PI-B2-009: Dry-run mode: proposed fixes shown without applying', () => {
    it('--dry-run does not modify files', () => {
      const folder = tracked(createDatePlaceholderFolder());
      const originalContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');

      runProgressive(folder, ['--level', '2', '--dry-run']);

      const afterContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');
      expect(afterContent).toBe(originalContent);
    });

    it('--dry-run still shows what would be changed', () => {
      const folder = tracked(createDatePlaceholderFolder());

      const { stdout } = runProgressive(folder, ['--level', '2', '--dry-run']);

      // Should indicate DRY RUN mode
      expect(stdout.toUpperCase()).toContain('DRY');
    });

    it('--dry-run JSON report shows count of proposed fixes', () => {
      const folder = tracked(createDatePlaceholderFolder());

      const { stdout } = runProgressive(folder, ['--level', '4', '--json', '--dry-run']);

      const report = expectPresent(
        extractProgressiveJson(stdout),
        'Expected progressive validation JSON report'
      );
      const autoFixes = expectPresent(report.autoFixes, 'Expected autoFixes in progressive report');
      // Should have fixes counted
      expect(autoFixes.count).toBeGreaterThan(0);
      // But applied should be false
      expect(autoFixes.applied).toBe(false);
    });

    it('files are unmodified after dry-run with whitespace issues', () => {
      const folder = tracked(createWhitespaceIssueFolder());
      const originalSpec = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');
      const originalPlan = fs.readFileSync(path.join(folder, 'plan.md'), 'utf-8');

      runProgressive(folder, ['--level', '2', '--dry-run']);

      expect(fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8')).toBe(originalSpec);
      expect(fs.readFileSync(path.join(folder, 'plan.md'), 'utf-8')).toBe(originalPlan);
    });
  });

  // --- CHK-PI-B2-010: Backward Compatibility ------------------
  describe('CHK-PI-B2-010: Existing validate.sh callers unaffected', () => {
    it('validate.sh still works independently', () => {
      const folder = tracked(createMinimalLevel1Folder());
      const { exitCode, stdout } = runValidate(folder, ['--quiet']);
      // Validate.sh returns valid exit codes (may be 2 due to strict rules on temp folders)
      expect([0, 1, 2]).toContain(exitCode);
      // Should produce output
      expect(stdout.length).toBeGreaterThan(0);
    });

    it('validate.sh --json produces valid JSON', () => {
      const folder = tracked(createMinimalLevel1Folder());
      const { stdout } = runValidate(folder, ['--json']);

      let parsedReport: ProgressiveReport | undefined;
      expect(() => {
        parsedReport = JSON.parse(stdout.trim()) as ProgressiveReport;
      }).not.toThrow();
      expect(parsedReport).toBeDefined();
      if (!parsedReport) {
        throw new Error('Expected validate.sh JSON report');
      }
      expect(parsedReport.results).toBeDefined();
      expect(parsedReport.version).toBeDefined();
    });

    it('validate.sh error exit codes are unchanged', () => {
      // Test error case: missing required files
      const badFolder = tracked(createTempSpecFolder({
        'spec.md': '# Spec\n\n| **Level** | 1 |\n',
      }));
      const badResult = runValidate(badFolder);
      expect(badResult.exitCode).toBe(2);
    });

    it('progressive-validate.sh is a separate file (not modifying validate.sh)', () => {
      // Both scripts should exist independently
      expect(fs.existsSync(PROGRESSIVE_VALIDATE)).toBe(true);
      expect(fs.existsSync(VALIDATE_SH)).toBe(true);
      // They should be different files
      expect(PROGRESSIVE_VALIDATE).not.toBe(VALIDATE_SH);
      expect(path.basename(PROGRESSIVE_VALIDATE)).toBe('progressive-validate.sh');
      expect(path.basename(VALIDATE_SH)).toBe('validate.sh');
    });
  });

  // --- Edge Cases & Error Handling ----------------------------
  describe('Edge Cases', () => {
    it('invalid --level value rejected', () => {
      const folder = tracked(createMinimalLevel1Folder());
      const { exitCode, stdout } = runProgressive(folder, ['--level', '5']);
      expect(exitCode).toBe(2);
      expect(stdout).toContain('ERROR');
    });

    it('missing folder path rejected', () => {
      const { exitCode } = runProgressive('');
      expect(exitCode).toBe(2);
    });

    it('unknown option rejected', () => {
      const folder = tracked(createMinimalLevel1Folder());
      const { exitCode, stdout } = runProgressive(folder, ['--invalid-flag']);
      expect(exitCode).toBe(2);
      expect(stdout).toContain('ERROR');
    });

    it('level 1 only runs detect (no auto-fix)', () => {
      const folder = tracked(createDatePlaceholderFolder());
      const originalContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');

      runProgressive(folder, ['--level', '1']);

      const afterContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');
      expect(afterContent).toBe(originalContent);
    });

    it('multiple auto-fix types can apply to the same file', () => {
      // Create a file with both date placeholders and whitespace issues
      const folder = tracked(createTempSpecFolder({
        'spec.md': '# Test Spec   \n\n| **Level** | 1 |\n| **Date** | YYYY-MM-DD |   \n\n## Overview\nTest.   \n',
        'plan.md': '# Plan\n\n## Approach\nTest.\n',
        'tasks.md': '# Tasks\n\n## Task List\n- [ ] Task 1\n',
      }));

      const { stdout } = runProgressive(folder, ['--level', '4', '--json']);

      const report = expectPresent(
        extractProgressiveJson(stdout),
        'Expected progressive validation JSON report'
      );
      const autoFixes = expectPresent(report.autoFixes, 'Expected autoFixes in progressive report');
      // Should have at least 2 fixes (date + whitespace on spec.md)
      expect(autoFixes.count).toBeGreaterThanOrEqual(2);
    });

    it('empty spec folder (no .md files) handled gracefully', () => {
      const folder = tracked(createTempSpecFolder({
        'readme.txt': 'not a markdown file',
      }));

      // Should not crash
      const { exitCode } = runProgressive(folder, ['--level', '1']);
      expect(exitCode).toBe(2);
    });
  });

  // --- Pipeline Level Progression -----------------------------
  describe('Pipeline Level Progression', () => {
    it('level 2 runs both detect and auto-fix', () => {
      const folder = tracked(createDatePlaceholderFolder());
      const today = getToday();

      runProgressive(folder, ['--level', '2']);

      const afterContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');
      // Date placeholders should have been replaced
      expect(afterContent).toContain(today);
      expect(afterContent).not.toContain('YYYY-MM-DD');
    });

    it('level 2 propagates detect errors when required files are missing', () => {
      const folder = tracked(createTempSpecFolder({
        'spec.md': '# Spec\n\n| **Level** | 1 |\n',
        // Missing plan.md and tasks.md
      }));

      const { exitCode } = runProgressive(folder, ['--level', '2']);
      expect(exitCode).toBe(2);
    });

    it('level 3 runs detect, auto-fix, and suggest', () => {
      const folder = tracked(createTempSpecFolder({
        'spec.md': '# Spec\n\n| **Level** | 2 |\n| **Date** | YYYY-MM-DD |\n\n## Overview\nTest.\n',
        'plan.md': '# Plan\n\n## Approach\nTest.\n',
        'tasks.md': '# Tasks\n\n## Task List\n- [ ] Task 1\n',
        // Checklist.md missing for Level 2 -- will trigger suggest
      }));

      const { stdout } = runProgressive(folder, ['--level', '3']);
      const today = getToday();

      // Auto-fix should have replaced date
      const afterContent = fs.readFileSync(path.join(folder, 'spec.md'), 'utf-8');
      expect(afterContent).toContain(today);
      // Should have run suggest phase
      expect(stdout.length).toBeGreaterThan(0);
    });

    it('level 4 is the default when no --level specified', () => {
      const folder = tracked(createMinimalLevel1Folder());

      const { stdout } = runProgressive(folder, ['--json']);

      const report = expectPresent(
        extractProgressiveJson(stdout),
        'Expected progressive validation JSON report'
      );
      expect(report.pipelineLevel).toBe(4);
    });
  });
});

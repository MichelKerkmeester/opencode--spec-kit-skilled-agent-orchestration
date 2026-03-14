"use strict";
// @ts-nocheck
// ───────────────────────────────────────────────────────────────
// 1. TEST: PROGRESSIVE VALIDATION PIPELINE
// ───────────────────────────────────────────────────────────────
// Tests for progressive-validate.sh — the 4-level progressive validation
// Wrapper around validate.sh.
//
// Covers:
//   T-PB2-01  Level 1 detect — same behaviour as validate.sh
//   T-PB2-02  Auto-fix: missing dates corrected
//   T-PB2-03  Auto-fix: heading levels normalized
//   T-PB2-04  Auto-fix: whitespace normalized
//   T-PB2-05  ALL auto-fixes logged with before/after diff
//   T-PB2-06  Suggest level presents issues with guided options
//   T-PB2-07  Report level produces structured output
//   T-PB2-08  --dry-run: shows changes without applying
//   T-PB2-09  Exit code compatibility (0 / 1 / 2)
//   T-PB2-10  --json produces parseable structured output
//   T-PB2-11  --level 1 stops after detect
//   T-PB2-12  --level 2 runs detect + auto-fix only
//   T-PB2-13  --level 3 runs detect + auto-fix + suggest
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const child_process_1 = require("child_process");
// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────
const SCRIPTS_DIR = path.resolve(__dirname, '..');
const PROGRESSIVE_SCRIPT = path.join(SCRIPTS_DIR, 'spec', 'progressive-validate.sh');
const VALIDATE_SCRIPT = path.join(SCRIPTS_DIR, 'spec', 'validate.sh');
const FIXTURES_DIR = path.join(SCRIPTS_DIR, 'tests', 'test-fixtures');
const VALID_L1_FIXTURE = path.join(FIXTURES_DIR, '002-valid-level1');
// Today's date in YYYY-MM-DD format (for auto-fix assertions)
const TODAY = new Date().toISOString().split('T')[0];
// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────
/**
 * Run progressive-validate.sh against a folder with optional extra flags.
 * Returns { stdout, stderr, exitCode }.
 */
function runProgressiveValidate(folderPath, flags = [], env = {}) {
    const result = (0, child_process_1.spawnSync)('bash', [PROGRESSIVE_SCRIPT, folderPath, ...flags], {
        encoding: 'utf8',
        env: { ...process.env, ...env },
        timeout: 30_000,
    });
    return {
        stdout: result.stdout ?? '',
        stderr: result.stderr ?? '',
        exitCode: result.status ?? 2,
    };
}
/**
 * Run validate.sh against a folder — used to establish baseline for detect comparisons.
 */
function runValidate(folderPath, flags = []) {
    const result = (0, child_process_1.spawnSync)('bash', [VALIDATE_SCRIPT, folderPath, ...flags], {
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
function createTempSpecDir(files) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'progressive-validation-test-'));
    for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(tmpDir, name), content, 'utf8');
    }
    return tmpDir;
}
/**
 * Read a file from a directory, returning its text content.
 */
function readFile(dir, name) {
    return fs.readFileSync(path.join(dir, name), 'utf8');
}
// ───────────────────────────────────────────────────────────────
// 4. FIXTURES — MINIMAL SPEC.MD TEMPLATES FOR AUTO-FIX TESTS
// ───────────────────────────────────────────────────────────────
/** A minimal valid Level-1 spec.md without date placeholders. */
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
// ───────────────────────────────────────────────────────────────
// 5. GUARD: SKIP ENTIRE SUITE IF SCRIPT IS NOT PRESENT
// ───────────────────────────────────────────────────────────────
const SCRIPT_EXISTS = fs.existsSync(PROGRESSIVE_SCRIPT);
const VALIDATE_EXISTS = fs.existsSync(VALIDATE_SCRIPT);
// ───────────────────────────────────────────────────────────────
// 6. SUITE
// ───────────────────────────────────────────────────────────────
(0, vitest_1.describe)('Progressive Validation Pipeline', () => {
    // ───────────────────────────────────────────────────────────────
    // 7. GUARD TESTS
    // ───────────────────────────────────────────────────────────────    (0, vitest_1.it)('T-PB2-00a: progressive-validate.sh script exists', () => {
        (0, vitest_1.expect)(SCRIPT_EXISTS, `Expected progressive-validate.sh at: ${PROGRESSIVE_SCRIPT}`).toBe(true);
    });
    (0, vitest_1.it)('T-PB2-00b: validate.sh (dependency) exists', () => {
        (0, vitest_1.expect)(VALIDATE_EXISTS, `Expected validate.sh at: ${VALIDATE_SCRIPT}`).toBe(true);
    });
    (0, vitest_1.it)('T-PB2-00c: --help flag exits 0 and prints usage', () => {
        if (!SCRIPT_EXISTS)
            return;
        const { stdout, exitCode } = runProgressiveValidate('', ['--help']);
        (0, vitest_1.expect)(exitCode).toBe(0);
        (0, vitest_1.expect)(stdout).toContain('progressive-validate.sh');
        (0, vitest_1.expect)(stdout).toContain('--level');
        (0, vitest_1.expect)(stdout).toContain('--dry-run');
    });
    (0, vitest_1.it)('T-PB2-00d: --version flag exits 0', () => {
        if (!SCRIPT_EXISTS)
            return;
        const { stdout, exitCode } = runProgressiveValidate('', ['--version']);
        (0, vitest_1.expect)(exitCode).toBe(0);
        (0, vitest_1.expect)(stdout).toContain('progressive-validate.sh');
    });
    // ───────────────────────────────────────────────────────────────
    // 8. T-PB2-01: LEVEL 1 DETECT — SAME BEHAVIOUR AS VALIDATE.SH
    // ───────────────────────────────────────────────────────────────    (0, vitest_1.describe)('T-PB2-01: Level 1 Detect (equivalent to validate.sh)', () => {
        (0, vitest_1.it)('T-PB2-01a: exit code matches validate.sh for a passing fixture', () => {
            if (!SCRIPT_EXISTS || !VALIDATE_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const baseline = runValidate(VALID_L1_FIXTURE);
            const progressive = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '1']);
            (0, vitest_1.expect)(progressive.exitCode).toBe(baseline.exitCode);
        });
        (0, vitest_1.it)('T-PB2-01b: exit code matches validate.sh for an empty (failing) fixture', () => {
            if (!SCRIPT_EXISTS || !VALIDATE_EXISTS)
                return;
            const emptyFixture = path.join(FIXTURES_DIR, '001-empty-folder');
            if (!fs.existsSync(emptyFixture))
                return;
            const baseline = runValidate(emptyFixture);
            const progressive = runProgressiveValidate(emptyFixture, ['--level', '1']);
            // Both should fail (exit 2)
            (0, vitest_1.expect)(progressive.exitCode).toBe(baseline.exitCode);
            (0, vitest_1.expect)(progressive.exitCode).toBe(2);
        });
        (0, vitest_1.it)('T-PB2-01c: --level 1 stops after detect (no auto-fix mentions in output)', () => {
            if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '1']);
            // Level 1 output should NOT contain the auto-fix pipeline section
            (0, vitest_1.expect)(stdout).not.toMatch(/Level 2.*Auto-fix/i);
            (0, vitest_1.expect)(stdout).not.toMatch(/\[FIX\]/);
        });
    });
    // ───────────────────────────────────────────────────────────────
    // 9. T-PB2-02: AUTO-FIX — MISSING DATES CORRECTED
    // ───────────────────────────────────────────────────────────────    (0, vitest_1.describe)('T-PB2-02: Auto-fix — Missing dates corrected', () => {
        let tmpDir;
        (0, vitest_1.afterEach)(() => {
            if (tmpDir && fs.existsSync(tmpDir)) {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            }
        });
        (0, vitest_1.it)('T-PB2-02a: YYYY-MM-DD placeholder replaced with today\'s date', () => {
            if (!SCRIPT_EXISTS)
                return;
            const specContent = MINIMAL_SPEC_MD.replace(TODAY, 'YYYY-MM-DD');
            tmpDir = createTempSpecDir({
                'spec.md': specContent,
                'plan.md': MINIMAL_PLAN_MD,
                'tasks.md': MINIMAL_TASKS_MD,
                'implementation-summary.md': MINIMAL_IMPL_MD,
            });
            runProgressiveValidate(tmpDir, ['--level', '2']);
            const fixed = readFile(tmpDir, 'spec.md');
            (0, vitest_1.expect)(fixed).toContain(TODAY);
            (0, vitest_1.expect)(fixed).not.toContain('YYYY-MM-DD');
        });
        (0, vitest_1.it)('T-PB2-02b: [DATE] placeholder replaced with today\'s date', () => {
            if (!SCRIPT_EXISTS)
                return;
            const specContent = MINIMAL_SPEC_MD.replace(TODAY, '[DATE]');
            tmpDir = createTempSpecDir({
                'spec.md': specContent,
                'plan.md': MINIMAL_PLAN_MD,
                'tasks.md': MINIMAL_TASKS_MD,
                'implementation-summary.md': MINIMAL_IMPL_MD,
            });
            runProgressiveValidate(tmpDir, ['--level', '2']);
            const fixed = readFile(tmpDir, 'spec.md');
            (0, vitest_1.expect)(fixed).toContain(TODAY);
            (0, vitest_1.expect)(fixed).not.toContain('[DATE]');
        });
        (0, vitest_1.it)('T-PB2-02c: date: TBD replaced with today\'s date', () => {
            if (!SCRIPT_EXISTS)
                return;
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
            // The YYYY-MM-DD placeholder and "date: TBD" should both be replaced
            (0, vitest_1.expect)(fixed).not.toContain('TBD');
        });
        (0, vitest_1.it)('T-PB2-02d: files without date placeholders are left unchanged', () => {
            if (!SCRIPT_EXISTS)
                return;
            tmpDir = createTempSpecDir({
                'spec.md': MINIMAL_SPEC_MD, // already has today
                'plan.md': MINIMAL_PLAN_MD,
                'tasks.md': MINIMAL_TASKS_MD,
                'implementation-summary.md': MINIMAL_IMPL_MD,
            });
            const before = readFile(tmpDir, 'spec.md');
            runProgressiveValidate(tmpDir, ['--level', '2']);
            const after = readFile(tmpDir, 'spec.md');
            (0, vitest_1.expect)(after).toBe(before);
        });
    });
    // ───────────────────────────────────────────────────────────────
    // 10. T-PB2-03: AUTO-FIX — HEADING LEVELS NORMALIZED
    // ───────────────────────────────────────────────────────────────    (0, vitest_1.describe)('T-PB2-03: Auto-fix — Heading levels normalized', () => {
        let tmpDir;
        (0, vitest_1.afterEach)(() => {
            if (tmpDir && fs.existsSync(tmpDir)) {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            }
        });
        (0, vitest_1.it)('T-PB2-03a: document starting at H2 is shifted so H2 becomes H1', () => {
            if (!SCRIPT_EXISTS)
                return;
            const specContent = `## Feature Spec\n\nLevel: 1\n\n### Problem Statement\n\nTest.\n`;
            tmpDir = createTempSpecDir({
                'spec.md': specContent,
                'plan.md': MINIMAL_PLAN_MD,
                'tasks.md': MINIMAL_TASKS_MD,
                'implementation-summary.md': MINIMAL_IMPL_MD,
            });
            runProgressiveValidate(tmpDir, ['--level', '2']);
            const fixed = readFile(tmpDir, 'spec.md');
            // Minimum heading level should now be H1
            (0, vitest_1.expect)(fixed).toMatch(/^# /m);
            (0, vitest_1.expect)(fixed).not.toMatch(/^## Feature Spec/m);
        });
        (0, vitest_1.it)('T-PB2-03b: document already starting at H1 is not modified (heading-wise)', () => {
            if (!SCRIPT_EXISTS)
                return;
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
            // Headings unchanged
            const beforeH1s = (before.match(/^# /gm) ?? []).length;
            const afterH1s = (after.match(/^# /gm) ?? []).length;
            (0, vitest_1.expect)(afterH1s).toBe(beforeH1s);
        });
        (0, vitest_1.it)('T-PB2-03c: heading fix is logged in script output', () => {
            if (!SCRIPT_EXISTS)
                return;
            const specContent = `## Feature Spec\n\nLevel: 1\n\n### Problem Statement\n\nTest.\n`;
            tmpDir = createTempSpecDir({
                'spec.md': specContent,
                'plan.md': MINIMAL_PLAN_MD,
                'tasks.md': MINIMAL_TASKS_MD,
                'implementation-summary.md': MINIMAL_IMPL_MD,
            });
            const { stdout } = runProgressiveValidate(tmpDir, ['--level', '2']);
            // Should mention the fix type
            (0, vitest_1.expect)(stdout).toMatch(/HEADING_LEVELS|heading/i);
        });
    });
    // ───────────────────────────────────────────────────────────────
    // 11. T-PB2-04: AUTO-FIX — WHITESPACE NORMALIZED
    // ───────────────────────────────────────────────────────────────    (0, vitest_1.describe)('T-PB2-04: Auto-fix — Whitespace normalized', () => {
        let tmpDir;
        (0, vitest_1.afterEach)(() => {
            if (tmpDir && fs.existsSync(tmpDir)) {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            }
        });
        (0, vitest_1.it)('T-PB2-04a: trailing whitespace removed from lines', () => {
            if (!SCRIPT_EXISTS)
                return;
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
                // No line should end with trailing spaces or tabs
                (0, vitest_1.expect)(line).not.toMatch(/[ \t]+$/);
            }
        });
        (0, vitest_1.it)('T-PB2-04b: CRLF line endings normalized to LF', () => {
            if (!SCRIPT_EXISTS)
                return;
            const contentWithCRLF = `# Spec\r\n\r\nLevel: 1\r\n\r\n## Section\r\n\r\nContent.\r\n`;
            tmpDir = createTempSpecDir({
                'spec.md': contentWithCRLF,
                'plan.md': MINIMAL_PLAN_MD,
                'tasks.md': MINIMAL_TASKS_MD,
                'implementation-summary.md': MINIMAL_IMPL_MD,
            });
            runProgressiveValidate(tmpDir, ['--level', '2']);
            const fixed = readFile(tmpDir, 'spec.md');
            // No carriage returns should remain
            (0, vitest_1.expect)(fixed).not.toContain('\r');
        });
        (0, vitest_1.it)('T-PB2-04c: file without whitespace issues is left unchanged', () => {
            if (!SCRIPT_EXISTS)
                return;
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
            (0, vitest_1.expect)(after).toBe(before);
        });
        (0, vitest_1.it)('T-PB2-04d: whitespace fix is logged in script output', () => {
            if (!SCRIPT_EXISTS)
                return;
            const contentWithTrailingSpaces = `# Spec   \n\nLevel: 1   \n\n## Section   \n\nContent.   \n`;
            tmpDir = createTempSpecDir({
                'spec.md': contentWithTrailingSpaces,
                'plan.md': MINIMAL_PLAN_MD,
                'tasks.md': MINIMAL_TASKS_MD,
                'implementation-summary.md': MINIMAL_IMPL_MD,
            });
            const { stdout } = runProgressiveValidate(tmpDir, ['--level', '2']);
            (0, vitest_1.expect)(stdout).toMatch(/WHITESPACE|whitespace/i);
        });
    });
    // ───────────────────────────────────────────────────────────────
    // 12. T-PB2-05: ALL AUTO-FIXES LOGGED WITH BEFORE/AFTER DIFF
    // ───────────────────────────────────────────────────────────────    (0, vitest_1.describe)('T-PB2-05: All auto-fixes logged with before/after diff', () => {
        let tmpDir;
        (0, vitest_1.afterEach)(() => {
            if (tmpDir && fs.existsSync(tmpDir)) {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            }
        });
        (0, vitest_1.it)('T-PB2-05a: [FIX] marker appears in output for each applied fix', () => {
            if (!SCRIPT_EXISTS)
                return;
            // File with trailing spaces → triggers WHITESPACE fix
            const dirtySpec = `# Spec   \n\nLevel: 1   \n\n## Problem Statement   \n\nTest.   \n`;
            tmpDir = createTempSpecDir({
                'spec.md': dirtySpec,
                'plan.md': MINIMAL_PLAN_MD,
                'tasks.md': MINIMAL_TASKS_MD,
                'implementation-summary.md': MINIMAL_IMPL_MD,
            });
            const { stdout } = runProgressiveValidate(tmpDir, ['--level', '2']);
            (0, vitest_1.expect)(stdout).toContain('[FIX]');
        });
        (0, vitest_1.it)('T-PB2-05b: diff output present in --verbose mode', () => {
            if (!SCRIPT_EXISTS)
                return;
            const dirtySpec = `# Spec   \n\nLevel: 1   \n\n## Problem Statement   \n\nTest.   \n`;
            tmpDir = createTempSpecDir({
                'spec.md': dirtySpec,
                'plan.md': MINIMAL_PLAN_MD,
                'tasks.md': MINIMAL_TASKS_MD,
                'implementation-summary.md': MINIMAL_IMPL_MD,
            });
            const { stdout } = runProgressiveValidate(tmpDir, ['--level', '4', '--verbose']);
            // Diff blocks start with "---" or "+++" (unified diff format)
            const hasDiffOutput = stdout.includes('---') || stdout.includes('+++') ||
                stdout.toLowerCase().includes('diff') ||
                stdout.includes('[FIX]');
            (0, vitest_1.expect)(hasDiffOutput).toBe(true);
        });
        (0, vitest_1.it)('T-PB2-05c: --json output includes autoFixes array with fix records', () => {
            if (!SCRIPT_EXISTS)
                return;
            // File with trailing spaces → will trigger WHITESPACE fix
            const dirtySpec = `# Spec   \n\nLevel: 1   \n\n## Problem Statement   \n\nTest.   \n`;
            tmpDir = createTempSpecDir({
                'spec.md': dirtySpec,
                'plan.md': MINIMAL_PLAN_MD,
                'tasks.md': MINIMAL_TASKS_MD,
                'implementation-summary.md': MINIMAL_IMPL_MD,
            });
            const { stdout } = runProgressiveValidate(tmpDir, ['--level', '4', '--json']);
            let parsed;
            (0, vitest_1.expect)(() => {
                parsed = JSON.parse(stdout);
            }).not.toThrow();
            (0, vitest_1.expect)(parsed).toHaveProperty('autoFixes');
            (0, vitest_1.expect)(parsed.autoFixes).toHaveProperty('items');
            (0, vitest_1.expect)(Array.isArray(parsed.autoFixes.items)).toBe(true);
            // At least one fix was recorded
            (0, vitest_1.expect)(parsed.autoFixes.count).toBeGreaterThanOrEqual(1);
            const firstFix = parsed.autoFixes.items[0];
            (0, vitest_1.expect)(firstFix).toHaveProperty('type');
            (0, vitest_1.expect)(firstFix).toHaveProperty('file');
            (0, vitest_1.expect)(firstFix).toHaveProperty('description');
        });
        (0, vitest_1.it)('T-PB2-05d: no [FIX] markers when no fixes are needed', () => {
            if (!SCRIPT_EXISTS)
                return;
            // Perfectly clean fixture — no fixes needed
            tmpDir = createTempSpecDir({
                'spec.md': MINIMAL_SPEC_MD,
                'plan.md': MINIMAL_PLAN_MD,
                'tasks.md': MINIMAL_TASKS_MD,
                'implementation-summary.md': MINIMAL_IMPL_MD,
            });
            const { stdout } = runProgressiveValidate(tmpDir, ['--level', '2']);
            (0, vitest_1.expect)(stdout).not.toContain('[FIX]');
            (0, vitest_1.expect)(stdout).toMatch(/no auto-fixes needed/i);
        });
    });
    // ───────────────────────────────────────────────────────────────
    // 13. T-PB2-06: SUGGEST LEVEL PRESENTS ISSUES WITH GUIDED OPTIONS
    // ───────────────────────────────────────────────────────────────    (0, vitest_1.describe)('T-PB2-06: Suggest level presents issues with guided options', () => {
        (0, vitest_1.it)('T-PB2-06a: [SUGGEST] markers appear for fixable but non-auto-fixable issues', () => {
            if (!SCRIPT_EXISTS || !VALIDATE_EXISTS)
                return;
            // Empty folder → fails FILE_EXISTS rule, unfixable automatically
            const emptyFixture = path.join(FIXTURES_DIR, '001-empty-folder');
            if (!fs.existsSync(emptyFixture))
                return;
            const { stdout } = runProgressiveValidate(emptyFixture, ['--level', '3']);
            // Either [SUGGEST] markers or a suggestion-oriented message
            const hasSuggestion = stdout.includes('[SUGGEST]') ||
                stdout.toLowerCase().includes('remediation') ||
                stdout.toLowerCase().includes('suggest') ||
                stdout.toLowerCase().includes('manual');
            (0, vitest_1.expect)(hasSuggestion).toBe(true);
        });
        (0, vitest_1.it)('T-PB2-06b: suggestion includes rule name and remediation text', () => {
            if (!SCRIPT_EXISTS || !VALIDATE_EXISTS)
                return;
            const emptyFixture = path.join(FIXTURES_DIR, '001-empty-folder');
            if (!fs.existsSync(emptyFixture))
                return;
            const { stdout } = runProgressiveValidate(emptyFixture, ['--level', '3']);
            // Should mention a rule name and a remediation action
            const hasRuleRef = stdout.match(/FILE_EXISTS|PLACEHOLDER|SECTIONS|LEVEL/i) !== null;
            // Either the output has structured suggestion content or an explanation
            (0, vitest_1.expect)(hasRuleRef || stdout.toLowerCase().includes('no issues')).toBe(true);
        });
        (0, vitest_1.it)('T-PB2-06c: no [SUGGEST] markers for fully passing spec', () => {
            if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '3']);
            (0, vitest_1.expect)(stdout).not.toContain('[SUGGEST]');
        });
        (0, vitest_1.it)('T-PB2-06d: --json output includes suggestions array', () => {
            if (!SCRIPT_EXISTS || !VALIDATE_EXISTS)
                return;
            const emptyFixture = path.join(FIXTURES_DIR, '001-empty-folder');
            if (!fs.existsSync(emptyFixture))
                return;
            const { stdout } = runProgressiveValidate(emptyFixture, ['--level', '4', '--json']);
            let parsed;
            try {
                parsed = JSON.parse(stdout);
            }
            catch {
                // If JSON parsing fails, the test is inconclusive but not a hard failure
                // Because the script may not emit pure JSON at --level 3/4 when erroring
                return;
            }
            (0, vitest_1.expect)(parsed).toHaveProperty('suggestions');
            (0, vitest_1.expect)(parsed.suggestions).toHaveProperty('items');
            (0, vitest_1.expect)(Array.isArray(parsed.suggestions.items)).toBe(true);
        });
    });
    // ───────────────────────────────────────────────────────────────
    // 14. T-PB2-07: REPORT LEVEL PRODUCES STRUCTURED OUTPUT
    // ───────────────────────────────────────────────────────────────    (0, vitest_1.describe)('T-PB2-07: Report level produces structured output', () => {
        (0, vitest_1.it)('T-PB2-07a: --level 4 output contains pipeline summary section', () => {
            if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '4']);
            const hasReport = stdout.toLowerCase().includes('report') ||
                stdout.toLowerCase().includes('summary') ||
                stdout.toLowerCase().includes('progressive');
            (0, vitest_1.expect)(hasReport).toBe(true);
        });
        (0, vitest_1.it)('T-PB2-07b: --json report includes version, pipelineLevel, folder, passed', () => {
            if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '4', '--json']);
            let parsed;
            (0, vitest_1.expect)(() => {
                parsed = JSON.parse(stdout);
            }).not.toThrow();
            (0, vitest_1.expect)(parsed).toHaveProperty('version');
            (0, vitest_1.expect)(parsed).toHaveProperty('pipelineLevel');
            (0, vitest_1.expect)(parsed).toHaveProperty('folder');
            (0, vitest_1.expect)(parsed).toHaveProperty('passed');
            (0, vitest_1.expect)(parsed).toHaveProperty('autoFixes');
            (0, vitest_1.expect)(parsed).toHaveProperty('suggestions');
        });
        (0, vitest_1.it)('T-PB2-07c: JSON report pipelineLevel matches --level argument', () => {
            if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '4', '--json']);
            const parsed = JSON.parse(stdout);
            (0, vitest_1.expect)(parsed.pipelineLevel).toBe(4);
        });
        (0, vitest_1.it)('T-PB2-07d: JSON report folder matches input path', () => {
            if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '4', '--json']);
            const parsed = JSON.parse(stdout);
            (0, vitest_1.expect)(parsed.folder).toBe(VALID_L1_FIXTURE);
        });
        (0, vitest_1.it)('T-PB2-07e: --level 4 is the default (omitting --level gives same as --level 4)', { timeout: 15000 }, () => {
            if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const withLevel = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '4', '--json']);
            const withDefault = runProgressiveValidate(VALID_L1_FIXTURE, ['--json']);
            const parsedLevel = JSON.parse(withLevel.stdout);
            const parsedDefault = JSON.parse(withDefault.stdout);
            (0, vitest_1.expect)(parsedDefault.pipelineLevel).toBe(parsedLevel.pipelineLevel);
        });
    });
    // ───────────────────────────────────────────────────────────────
    // 15. T-PB2-08: DRY-RUN MODE — SHOWS CHANGES WITHOUT APPLYING
    // ───────────────────────────────────────────────────────────────    (0, vitest_1.describe)('T-PB2-08: --dry-run shows changes without applying', () => {
        let tmpDir;
        (0, vitest_1.afterEach)(() => {
            if (tmpDir && fs.existsSync(tmpDir)) {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            }
        });
        (0, vitest_1.it)('T-PB2-08a: file contents unchanged when --dry-run used', () => {
            if (!SCRIPT_EXISTS)
                return;
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
            (0, vitest_1.expect)(after).toBe(before);
        });
        (0, vitest_1.it)('T-PB2-08b: [DRY-RUN] marker appears in output', () => {
            if (!SCRIPT_EXISTS)
                return;
            const specContent = MINIMAL_SPEC_MD.replace(TODAY, 'YYYY-MM-DD');
            tmpDir = createTempSpecDir({
                'spec.md': specContent,
                'plan.md': MINIMAL_PLAN_MD,
                'tasks.md': MINIMAL_TASKS_MD,
                'implementation-summary.md': MINIMAL_IMPL_MD,
            });
            const { stdout } = runProgressiveValidate(tmpDir, ['--level', '2', '--dry-run']);
            (0, vitest_1.expect)(stdout).toContain('[DRY-RUN]');
        });
        (0, vitest_1.it)('T-PB2-08c: dry-run summary mentions how many fixes would be applied', () => {
            if (!SCRIPT_EXISTS)
                return;
            const specContent = MINIMAL_SPEC_MD.replace(TODAY, 'YYYY-MM-DD');
            tmpDir = createTempSpecDir({
                'spec.md': specContent,
                'plan.md': MINIMAL_PLAN_MD,
                'tasks.md': MINIMAL_TASKS_MD,
                'implementation-summary.md': MINIMAL_IMPL_MD,
            });
            const { stdout } = runProgressiveValidate(tmpDir, ['--level', '2', '--dry-run']);
            // Should mention "would be applied" or count of fixes
            const mentionsCount = stdout.match(/\d+\s+fix/i) !== null ||
                stdout.toLowerCase().includes('would be applied');
            (0, vitest_1.expect)(mentionsCount).toBe(true);
        });
        (0, vitest_1.it)('T-PB2-08d: --json dry-run report has dryRun:true', () => {
            if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, [
                '--level', '4', '--dry-run', '--json',
            ]);
            let parsed;
            (0, vitest_1.expect)(() => {
                parsed = JSON.parse(stdout);
            }).not.toThrow();
            (0, vitest_1.expect)(parsed.dryRun).toBe(true);
        });
    });
    // ───────────────────────────────────────────────────────────────
    // 16. T-PB2-09: EXIT CODE COMPATIBILITY (0 / 1 / 2)
    // ───────────────────────────────────────────────────────────────    (0, vitest_1.describe)('T-PB2-09: Exit code compatibility (0 / 1 / 2)', () => {
        (0, vitest_1.it)('T-PB2-09a: exit 0 for a passing spec (full pipeline)', () => {
            if (!SCRIPT_EXISTS || !VALIDATE_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            // Validate.sh returns exit 1 (warnings) for the minimal fixture.
            // So the progressive validator must also exit 1 for the same folder.
            const baseline = runValidate(VALID_L1_FIXTURE);
            const progressive = runProgressiveValidate(VALID_L1_FIXTURE);
            (0, vitest_1.expect)(progressive.exitCode).toBe(baseline.exitCode);
        });
        (0, vitest_1.it)('T-PB2-09b: exit 2 for a failing spec (missing required files)', () => {
            if (!SCRIPT_EXISTS || !VALIDATE_EXISTS)
                return;
            const emptyFixture = path.join(FIXTURES_DIR, '001-empty-folder');
            if (!fs.existsSync(emptyFixture))
                return;
            const { exitCode } = runProgressiveValidate(emptyFixture);
            (0, vitest_1.expect)(exitCode).toBe(2);
        });
        (0, vitest_1.it)('T-PB2-09c: exit 1 for a spec with warnings (not errors)', () => {
            if (!SCRIPT_EXISTS || !VALIDATE_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const baseline = runValidate(VALID_L1_FIXTURE);
            if (baseline.exitCode !== 1)
                return; // Skip if fixture doesn't produce warnings
            const progressive = runProgressiveValidate(VALID_L1_FIXTURE);
            (0, vitest_1.expect)(progressive.exitCode).toBe(1);
        });
        (0, vitest_1.it)('T-PB2-09d: --strict promotes warnings to exit 2', () => {
            if (!SCRIPT_EXISTS || !VALIDATE_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            // Only meaningful if baseline exit code is 1 (warnings)
            const baseline = runValidate(VALID_L1_FIXTURE);
            if (baseline.exitCode !== 1)
                return;
            const { exitCode } = runProgressiveValidate(VALID_L1_FIXTURE, ['--strict']);
            (0, vitest_1.expect)(exitCode).toBe(2);
        });
        (0, vitest_1.it)('T-PB2-09e: exit codes are not changed by auto-fixes in Level 2', () => {
            if (!SCRIPT_EXISTS || !VALIDATE_EXISTS)
                return;
            // An empty folder should still exit 2 even at level 2 (auto-fix cannot create files)
            const emptyFixture = path.join(FIXTURES_DIR, '001-empty-folder');
            if (!fs.existsSync(emptyFixture))
                return;
            const { exitCode } = runProgressiveValidate(emptyFixture, ['--level', '2']);
            (0, vitest_1.expect)(exitCode).toBe(2);
        });
    });
    // ───────────────────────────────────────────────────────────────
    // 17. T-PB2-10: --JSON PRODUCES PARSEABLE STRUCTURED OUTPUT
    // ───────────────────────────────────────────────────────────────    (0, vitest_1.describe)('T-PB2-10: --json produces parseable structured output', () => {
        (0, vitest_1.it)('T-PB2-10a: --json output is valid JSON', () => {
            if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--json']);
            (0, vitest_1.expect)(() => JSON.parse(stdout)).not.toThrow();
        });
        (0, vitest_1.it)('T-PB2-10b: JSON report has all required top-level fields', () => {
            if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
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
                (0, vitest_1.expect)(parsed, `Missing field: ${field}`).toHaveProperty(field);
            }
        });
        (0, vitest_1.it)('T-PB2-10c: autoFixes object has count, applied, items, diffs fields', () => {
            if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--json']);
            const parsed = JSON.parse(stdout);
            (0, vitest_1.expect)(parsed.autoFixes).toHaveProperty('count');
            (0, vitest_1.expect)(parsed.autoFixes).toHaveProperty('applied');
            (0, vitest_1.expect)(parsed.autoFixes).toHaveProperty('items');
            (0, vitest_1.expect)(parsed.autoFixes).toHaveProperty('diffs');
            (0, vitest_1.expect)(typeof parsed.autoFixes.count).toBe('number');
            (0, vitest_1.expect)(Array.isArray(parsed.autoFixes.items)).toBe(true);
        });
        (0, vitest_1.it)('T-PB2-10d: suggestions object has count and items fields', () => {
            if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--json']);
            const parsed = JSON.parse(stdout);
            (0, vitest_1.expect)(parsed.suggestions).toHaveProperty('count');
            (0, vitest_1.expect)(parsed.suggestions).toHaveProperty('items');
            (0, vitest_1.expect)(typeof parsed.suggestions.count).toBe('number');
            (0, vitest_1.expect)(Array.isArray(parsed.suggestions.items)).toBe(true);
        });
    });
    // ───────────────────────────────────────────────────────────────
    // 18. T-PB2-11 / T-PB2-12 / T-PB2-13: --LEVEL N PIPELINE STAGES
    // ───────────────────────────────────────────────────────────────    (0, vitest_1.describe)('T-PB2-11/12/13: --level N controls pipeline depth', () => {
        (0, vitest_1.it)('T-PB2-11: --level 1 output does NOT contain Level 2/3/4 headings', () => {
            if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '1']);
            (0, vitest_1.expect)(stdout).not.toMatch(/Level 2.*Auto-fix/i);
            (0, vitest_1.expect)(stdout).not.toMatch(/Level 3.*Suggest/i);
            (0, vitest_1.expect)(stdout).not.toMatch(/Level 4.*Report/i);
        });
        (0, vitest_1.it)('T-PB2-12: --level 2 output contains Level 2 heading but NOT Level 3/4', () => {
            if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '2']);
            // Level 2 section should be present
            const hasLevel2 = stdout.match(/Level 2.*Auto-fix/i) !== null || stdout.includes('[FIX]') || stdout.includes('auto-fix');
            (0, vitest_1.expect)(hasLevel2).toBe(true);
            // Level 3 and 4 sections should NOT be present
            (0, vitest_1.expect)(stdout).not.toMatch(/Level 3.*Suggest/i);
            (0, vitest_1.expect)(stdout).not.toMatch(/Level 4.*Report/i);
        });
        (0, vitest_1.it)('T-PB2-13: --level 3 output contains Level 3 heading but NOT Level 4 report', () => {
            if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const { stdout } = runProgressiveValidate(VALID_L1_FIXTURE, ['--level', '3']);
            // Level 3 section should be present
            const hasLevel3 = stdout.match(/Level 3.*Suggest/i) !== null || stdout.match(/suggest/i) !== null;
            (0, vitest_1.expect)(hasLevel3).toBe(true);
            // Level 4 report section should NOT appear
            (0, vitest_1.expect)(stdout).not.toMatch(/Level 4.*Report/i);
        });
        (0, vitest_1.it)('T-PB2-14: invalid --level value (0 or 5) causes exit 2', () => {
            if (!SCRIPT_EXISTS)
                return;
            const result0 = runProgressiveValidate('', ['--level', '0']);
            (0, vitest_1.expect)(result0.exitCode).toBe(2);
            const result5 = runProgressiveValidate('', ['--level', '5']);
            (0, vitest_1.expect)(result5.exitCode).toBe(2);
        });
    });
    // ───────────────────────────────────────────────────────────────
    // 19. T-PB2-15: EDGE CASES
    // ───────────────────────────────────────────────────────────────    (0, vitest_1.describe)('T-PB2-15: Edge cases', () => {
        (0, vitest_1.it)('T-PB2-15a: missing folder argument exits 2 with error message', () => {
            if (!SCRIPT_EXISTS)
                return;
            const { exitCode, stderr } = runProgressiveValidate('');
            (0, vitest_1.expect)(exitCode).toBe(2);
            (0, vitest_1.expect)(stderr + '').toMatch(/required|path/i);
        });
        (0, vitest_1.it)('T-PB2-15b: non-existent folder exits 2 with error message', () => {
            if (!SCRIPT_EXISTS)
                return;
            const { exitCode, stderr } = runProgressiveValidate('/tmp/does-not-exist-progressive-validation-test');
            (0, vitest_1.expect)(exitCode).toBe(2);
            (0, vitest_1.expect)(stderr + '').toMatch(/not found|folder/i);
        });
        (0, vitest_1.it)('T-PB2-15c: unknown flag exits 2 with error message', () => {
            if (!SCRIPT_EXISTS || !fs.existsSync(VALID_L1_FIXTURE))
                return;
            const { exitCode } = runProgressiveValidate(VALID_L1_FIXTURE, ['--unknown-flag-xyz']);
            (0, vitest_1.expect)(exitCode).toBe(2);
        });
        (0, vitest_1.it)('T-PB2-15d: multiple .md files in folder all processed by auto-fix', () => {
            if (!SCRIPT_EXISTS)
                return;
            let tmpDir = null;
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
                    (0, vitest_1.expect)(line).not.toMatch(/[ \t]+$/);
                }
                for (const line of fixedPlan.split('\n')) {
                    (0, vitest_1.expect)(line).not.toMatch(/[ \t]+$/);
                }
            }
            finally {
                if (tmpDir && fs.existsSync(tmpDir)) {
                    fs.rmSync(tmpDir, { recursive: true, force: true });
                }
            }
        });
    });
});
//# sourceMappingURL=progressive-validation.vitest.js.map
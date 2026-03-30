// ---------------------------------------------------------------
// TESTS: Spec Document Health Evaluator
// ---------------------------------------------------------------
// Run: npx ts-node shared/parsing/spec-doc-health.test.ts

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { evaluateSpecDocHealth } from './spec-doc-health.js';

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label} failed: expected ${String(expected)}, got ${String(actual)}`);
  }
  console.log(`PASS: ${label}`);
}

function assertGte(actual: number, expected: number, label: string): void {
  if (actual < expected) {
    throw new Error(`${label} failed: expected >= ${expected}, got ${actual}`);
  }
  console.log(`PASS: ${label}`);
}

function assertRange(actual: number, min: number, max: number, label: string): void {
  if (actual < min || actual > max) {
    throw new Error(`${label} failed: expected ${min}-${max}, got ${actual}`);
  }
  console.log(`PASS: ${label}`);
}

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'spec-health-test-'));
}

function cleanup(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

function writeFile(dir: string, name: string, content: string): void {
  fs.writeFileSync(path.join(dir, name), content, 'utf-8');
}

const VALID_SPEC = `---
title: Test Spec
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Test Spec

Some substantive content here for testing purposes.
`;

const VALID_PLAN = `<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Plan

Implementation plan content goes here.
`;

const VALID_TASKS = `<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Tasks

- [ ] Task one description
- [ ] Task two description
`;

// 1. Non-existent folder → error
{
  const result = evaluateSpecDocHealth('/nonexistent/path/001-test');
  assertEqual(result.pass, false, 'nonexistent folder fails');
  assertEqual(result.score, 0, 'nonexistent folder score 0');
  assertEqual(result.errors, 1, 'nonexistent folder has 1 error');
}

// 2. Empty folder → missing files
{
  const tmp = createTempDir();
  const dir = path.join(tmp, '001-test');
  fs.mkdirSync(dir);
  const result = evaluateSpecDocHealth(dir);
  assertEqual(result.pass, false, 'empty folder fails');
  assertGte(result.errors, 3, 'empty folder >= 3 errors (missing spec/plan/tasks)');
  cleanup(tmp);
}

// 3. Valid level 1 folder → passes
{
  const tmp = createTempDir();
  const dir = path.join(tmp, '001-test');
  fs.mkdirSync(dir);
  writeFile(dir, 'spec.md', VALID_SPEC);
  writeFile(dir, 'plan.md', VALID_PLAN);
  writeFile(dir, 'tasks.md', VALID_TASKS);

  const result = evaluateSpecDocHealth(dir);
  assertEqual(result.pass, true, 'valid L1 passes');
  assertEqual(result.errors, 0, 'valid L1 no errors');
  assertRange(result.score, 0.5, 1, 'valid L1 score > 0.5');
  assertEqual(result.level, 1, 'valid L1 level detected');
  cleanup(tmp);
}

// 4. Missing SPECKIT_LEVEL → warning
{
  const tmp = createTempDir();
  const dir = path.join(tmp, '001-test');
  fs.mkdirSync(dir);
  writeFile(dir, 'spec.md', '---\ntitle: Test\n---\n# Spec\nContent here.\n');
  writeFile(dir, 'plan.md', VALID_PLAN);
  writeFile(dir, 'tasks.md', VALID_TASKS);

  const result = evaluateSpecDocHealth(dir);
  assertGte(result.warnings, 1, 'missing SPECKIT_LEVEL produces warning');
  cleanup(tmp);
}

// 5. Missing frontmatter → error
{
  const tmp = createTempDir();
  const dir = path.join(tmp, '001-test');
  fs.mkdirSync(dir);
  writeFile(dir, 'spec.md', '<!-- SPECKIT_LEVEL: 1 -->\n# Spec\nContent.\n');
  writeFile(dir, 'plan.md', VALID_PLAN);
  writeFile(dir, 'tasks.md', VALID_TASKS);

  const result = evaluateSpecDocHealth(dir);
  assertGte(result.errors, 1, 'missing frontmatter produces error');
  cleanup(tmp);
}

// 6. Missing SPECKIT_TEMPLATE_SOURCE → warning
{
  const tmp = createTempDir();
  const dir = path.join(tmp, '001-test');
  fs.mkdirSync(dir);
  writeFile(dir, 'spec.md', '---\ntitle: Test\n---\n<!-- SPECKIT_LEVEL: 1 -->\n# Spec\nContent.\n');
  writeFile(dir, 'plan.md', '# Plan\nContent.\n');
  writeFile(dir, 'tasks.md', '# Tasks\n- [ ] Do thing\n');

  const result = evaluateSpecDocHealth(dir);
  assertGte(result.warnings, 1, 'missing TEMPLATE_SOURCE produces warning');
  cleanup(tmp);
}

// 7. Unclosed anchor → error
{
  const tmp = createTempDir();
  const dir = path.join(tmp, '001-test');
  fs.mkdirSync(dir);
  writeFile(dir, 'spec.md', VALID_SPEC + '\n<!-- ANCHOR:test -->\nContent\n');
  writeFile(dir, 'plan.md', VALID_PLAN);
  writeFile(dir, 'tasks.md', VALID_TASKS);

  const result = evaluateSpecDocHealth(dir);
  assertGte(result.errors, 1, 'unclosed anchor produces error');
  const hasAnchorIssue = result.perFile.some(f => f.issues.some(i => i.includes('ANCHORS_VALID')));
  assertEqual(hasAnchorIssue, true, 'anchor issue reported in perFile');
  cleanup(tmp);
}

// 8. Properly paired anchors → no anchor error
{
  const tmp = createTempDir();
  const dir = path.join(tmp, '001-test');
  fs.mkdirSync(dir);
  writeFile(dir, 'spec.md', VALID_SPEC + '\n<!-- ANCHOR:test -->\nContent\n<!-- /ANCHOR:test -->\n');
  writeFile(dir, 'plan.md', VALID_PLAN);
  writeFile(dir, 'tasks.md', VALID_TASKS);

  const result = evaluateSpecDocHealth(dir);
  const hasAnchorIssue = result.perFile.some(f => f.issues.some(i => i.includes('ANCHORS_VALID')));
  assertEqual(hasAnchorIssue, false, 'paired anchors have no issue');
  cleanup(tmp);
}

// 9. Bad folder naming → error
{
  const tmp = createTempDir();
  const dir = path.join(tmp, 'bad-name');
  fs.mkdirSync(dir);
  writeFile(dir, 'spec.md', VALID_SPEC);
  writeFile(dir, 'plan.md', VALID_PLAN);
  writeFile(dir, 'tasks.md', VALID_TASKS);

  const result = evaluateSpecDocHealth(dir);
  assertGte(result.errors, 1, 'bad folder name produces error');
  cleanup(tmp);
}

// 10. Missing checklist for level 2 → error
{
  const tmp = createTempDir();
  const dir = path.join(tmp, '001-test');
  fs.mkdirSync(dir);
  writeFile(dir, 'spec.md', VALID_SPEC.replace('SPECKIT_LEVEL: 1', 'SPECKIT_LEVEL: 2'));
  writeFile(dir, 'plan.md', VALID_PLAN);
  writeFile(dir, 'tasks.md', VALID_TASKS);

  const result = evaluateSpecDocHealth(dir);
  assertGte(result.errors, 1, 'missing checklist.md for L2 produces error');
  cleanup(tmp);
}

// 11. Score in valid range
{
  const tmp = createTempDir();
  const dir = path.join(tmp, '001-test');
  fs.mkdirSync(dir);
  writeFile(dir, 'spec.md', VALID_SPEC);
  writeFile(dir, 'plan.md', VALID_PLAN);
  writeFile(dir, 'tasks.md', VALID_TASKS);

  const result = evaluateSpecDocHealth(dir);
  assertRange(result.score, 0, 1, 'score is 0-1 normalized');
  cleanup(tmp);
}

console.log('\nAll spec-doc-health tests passed.');

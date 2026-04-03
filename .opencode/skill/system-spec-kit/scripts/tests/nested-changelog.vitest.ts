// ───────────────────────────────────────────────────────────────────
// MODULE: Nested Changelog Tests
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { CONFIG } from '../core';
import { buildNestedChangelogData, generateNestedChangelogMarkdown, writeNestedChangelog } from '../spec-folder/nested-changelog';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const tempRoots: string[] = [];

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function makeTempProjectRoot(): string {
  const root = path.join(
    CONFIG.PROJECT_ROOT,
    'specs',
    '99--nested-changelog-tests',
    `999-nested-changelog-${Math.random().toString(16).slice(2, 8)}`
  );
  tempRoots.push(root);
  fs.mkdirSync(root, { recursive: true });
  return root;
}

function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const root = tempRoots.pop();
    if (root) {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
});

// ───────────────────────────────────────────────────────────────────
// 4. TESTS
// ───────────────────────────────────────────────────────────────────

describe('nested changelog generator', () => {
  it('builds a root changelog with phase coverage rollup', () => {
    const rootSpec = makeTempProjectRoot();
    const phaseSpec = path.join(rootSpec, '001-generator-foundation');

    writeFile(path.join(rootSpec, 'spec.md'), `# Feature Specification: Nested Changelog Per Spec

## 1. Metadata

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Status** | In Progress |
`);
    writeFile(path.join(rootSpec, 'implementation-summary.md'), `# Implementation Summary

## What Was Built

Packet-level changelog generation now ships beside the implementation summary so phase work can roll up into one packet history.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| scripts/spec-folder/nested-changelog.ts | Created | Generate root and phase packet changelogs |

## Verification

| Check | Result |
|-------|--------|
| npm run build | PASS |
`);
    writeFile(path.join(rootSpec, 'tasks.md'), `- [x] T001 Add nested changelog generator
- [x] T002 Update command workflows`);

    writeFile(path.join(phaseSpec, 'spec.md'), `# Feature Specification: Generator Foundation

## 1. Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete |
`);
    writeFile(path.join(phaseSpec, 'implementation-summary.md'), `# Implementation Summary

## What Was Built

The generator can now resolve phase folders and derive packet-local changelog paths automatically.
`);
    writeFile(path.join(phaseSpec, 'tasks.md'), `- [x] T001 Resolve phase output paths`);

    const data = buildNestedChangelogData(rootSpec, { mode: 'auto', outputPath: null });
    const markdown = generateNestedChangelogMarkdown(data);
    const relativeRootSpec = path.relative(CONFIG.PROJECT_ROOT, rootSpec).replace(/\\/g, '/');

    expect(data.mode).toBe('root');
    expect(data.outputPath).toBe(`${relativeRootSpec}/changelog/changelog-999-root.md`);
    expect(markdown).toContain('### Included Phases');
    expect(markdown).toContain('001-generator-foundation');
    expect(markdown).toContain('Packet-level changelog generation now ships beside the implementation summary');
  });

  it('writes a phase changelog into the parent packet changelog folder', () => {
    const rootSpec = makeTempProjectRoot();
    const phaseSpec = path.join(rootSpec, '029-review-remediation');

    writeFile(path.join(rootSpec, 'spec.md'), '# Feature Specification: Compact Code Graph');
    writeFile(path.join(phaseSpec, 'spec.md'), `# Feature Specification: Review Remediation

## 1. Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
`);
    writeFile(path.join(phaseSpec, 'implementation-summary.md'), `# Implementation Summary

## What Was Built

The review remediation phase aligned the bootstrap contract, tightened checklist evidence, and added the missing output schema details.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| mcp_server/tool-schemas.ts | Modified | Added output schema for session_bootstrap |

## Verification

| Check | Result |
|-------|--------|
| vitest | PASS |
`);
    writeFile(path.join(phaseSpec, 'tasks.md'), `- [x] T001 Fix schema drift
- [x] T002 Update packet docs`);
    writeFile(path.join(phaseSpec, 'checklist.md'), `## P0
- [x] Ship schema fix [EVIDENCE: mcp_server/tool-schemas.ts]
## P2
- [ ] Save extra review notes`);

    const data = buildNestedChangelogData(phaseSpec, { mode: 'auto', outputPath: null });
    const writtenPath = writeNestedChangelog(data);
    const markdown = fs.readFileSync(writtenPath, 'utf8');
    const relativeRootSpec = path.relative(CONFIG.PROJECT_ROOT, rootSpec).replace(/\\/g, '/');

    expect(data.mode).toBe('phase');
    expect(data.outputPath).toBe(`${relativeRootSpec}/changelog/changelog-999-029-review-remediation.md`);
    expect(markdown).toContain(`Parent packet: \`${relativeRootSpec}\``);
    expect(markdown).toContain('Ship schema fix');
    expect(markdown).toContain('Save extra review notes');
  });
});

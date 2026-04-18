import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import {
  RULE_FAILURE_CODES,
  runSpecDocStructureRule,
  type MergePlan,
} from '../lib/validation/spec-doc-structure';

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_ROOT = path.resolve(THIS_DIR, '../../scripts/test-fixtures');
const VALIDATE_SCRIPT = path.resolve(THIS_DIR, '../../scripts/spec/validate.sh');
const VALIDATOR_REGISTRY = path.resolve(THIS_DIR, '../../scripts/lib/validator-registry.json');

const TEMP_DIRS: string[] = [];

function makeTempDir(prefix: string): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  TEMP_DIRS.push(tempDir);
  return tempDir;
}

function copyFixture(name: string): string {
  const tempDir = makeTempDir(`speckit-${name}-`);
  const sourceDir = path.join(FIXTURE_ROOT, name);
  for (const entry of fs.readdirSync(sourceDir)) {
    fs.cpSync(path.join(sourceDir, entry), path.join(tempDir, entry), { recursive: true });
  }
  return tempDir;
}

function injectMemoryBlock(filePath: string, overrides: Partial<Record<string, string>> = {}): void {
  const content = fs.readFileSync(filePath, 'utf8');
  const closingIndex = content.indexOf('\n---\n');
  if (closingIndex < 0) {
    throw new Error(`No frontmatter block found in ${filePath}`);
  }

  const continuityLines = [
    '_memory:',
    '  continuity:',
    `    packet_pointer: "${overrides.packet_pointer ?? 'system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready'}"`,
    `    last_updated_at: "${overrides.last_updated_at ?? '2026-04-11T12:00:00Z'}"`,
    `    last_updated_by: "${overrides.last_updated_by ?? 'codex-gate-c'}"`,
    `    recent_action: "${overrides.recent_action ?? 'Validated gate c fixture'}"`,
    `    next_safe_action: "${overrides.next_safe_action ?? 'Run strict validator'}"`,
    `  fingerprint: "${overrides.fingerprint ?? `sha256:${'1'.repeat(64)}`}"`,
  ];

  const insertion = `${continuityLines.join('\n')}\n`;
  const updated = `${content.slice(0, closingIndex)}\n${insertion}${content.slice(closingIndex + 1)}`;
  fs.writeFileSync(filePath, updated, 'utf8');
}

function replaceAnchorBody(filePath: string, anchorId: string, body: string): void {
  const content = fs.readFileSync(filePath, 'utf8');
  const pattern = new RegExp(
    `(<!--\\s*ANCHOR:${anchorId}\\s*-->\\n)([\\s\\S]*?)(\\n<!--\\s*\\/ANCHOR:${anchorId}\\s*-->)`,
    'm',
  );
  const updated = content.replace(pattern, `$1${body}$3`);
  fs.writeFileSync(filePath, updated, 'utf8');
}

function replaceText(filePath: string, searchValue: string, replaceValue: string): void {
  const content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath, content.replace(searchValue, replaceValue), 'utf8');
}

function seedContinuityAcrossFixture(folder: string): void {
  for (const basename of ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'decision-record.md', 'implementation-summary.md']) {
    injectMemoryBlock(path.join(folder, basename));
  }
}

function createMergeFixture(): { folder: string; mergePlan: MergePlan } {
  const folder = makeTempDir('speckit-merge-');
  fs.writeFileSync(
    path.join(folder, 'spec.md'),
    `---
title: "Merge Fixture"
description: "Fixture"
trigger_phrases:
  - "fixture"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/merge-fixture"
    last_updated_at: "2026-04-11T12:00:00Z"
    last_updated_by: "codex-gate-c"
    recent_action: "Prepared merge fixture"
    next_safe_action: "Run merge validation"
---
# Merge Fixture

<!-- ANCHOR:what-built -->
## What Was Built

This anchor is prose only.
<!-- /ANCHOR:what-built -->
`,
    'utf8',
  );

  return {
    folder,
    mergePlan: {
      targetFile: 'spec.md',
      targetAnchor: 'what-built',
      mergeMode: 'append-table-row',
      chunkText: '| Cell A | Cell B |',
    },
  };
}

afterEach(() => {
  while (TEMP_DIRS.length > 0) {
    const tempDir = TEMP_DIRS.pop();
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
});

describe('spec-doc-structure contract', () => {
  it('freezes the failure-code ordering from Gate C research', () => {
    expect(RULE_FAILURE_CODES.FRONTMATTER_MEMORY_BLOCK).toEqual([
      'SPECDOC_FRONTMATTER_001',
      'SPECDOC_FRONTMATTER_002',
      'SPECDOC_FRONTMATTER_003',
      'SPECDOC_FRONTMATTER_004',
      'SPECDOC_FRONTMATTER_005',
      'SPECDOC_FRONTMATTER_006',
      'SPECDOC_FRONTMATTER_007',
    ]);
    expect(RULE_FAILURE_CODES.MERGE_LEGALITY).toEqual([
      'SPECDOC_MERGE_001',
      'SPECDOC_MERGE_002',
      'SPECDOC_MERGE_003',
      'SPECDOC_MERGE_004',
      'SPECDOC_MERGE_005',
    ]);
    expect(RULE_FAILURE_CODES.SPEC_DOC_SUFFICIENCY).toEqual([
      'SPECDOC_SUFFICIENCY_001',
      'SPECDOC_SUFFICIENCY_002',
      'SPECDOC_SUFFICIENCY_003',
      'SPECDOC_SUFFICIENCY_004',
    ]);
    expect(RULE_FAILURE_CODES.CROSS_ANCHOR_CONTAMINATION).toEqual([
      'SPECDOC_CONTAM_001',
      'SPECDOC_CONTAM_002',
      'SPECDOC_CONTAM_003',
    ]);
    expect(RULE_FAILURE_CODES.POST_SAVE_FINGERPRINT).toEqual([
      'SPECDOC_FINGERPRINT_001',
      'SPECDOC_FINGERPRINT_002',
      'SPECDOC_FINGERPRINT_003',
      'SPECDOC_FINGERPRINT_004',
    ]);
  });

  it('warns when a Level 3 sample fixture is missing the _memory block', () => {
    const folder = copyFixture('063-template-compliant-level3');
    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'FRONTMATTER_MEMORY_BLOCK',
    });

    expect(result.status).toBe('warn');
    expect(result.details.some((detail) => detail.includes('SPECDOC_FRONTMATTER_002'))).toBe(true);
  });

  it('fails malformed frontmatter and invalid continuity values', () => {
    const folder = copyFixture('063-template-compliant-level3');
    const specPath = path.join(folder, 'spec.md');
    injectMemoryBlock(specPath, { last_updated_by: 'Bad Actor' });
    const broken = fs.readFileSync(specPath, 'utf8').replace('title:', 'title ');
    fs.writeFileSync(specPath, broken, 'utf8');

    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'FRONTMATTER_MEMORY_BLOCK',
    });

    expect(result.status).toBe('fail');
    expect(result.details.some((detail) => detail.includes('SPECDOC_FRONTMATTER_001'))).toBe(true);
  });

  it('fails empty continuity values as missing frontmatter fields', () => {
    const folder = copyFixture('063-template-compliant-level3');
    const specPath = path.join(folder, 'spec.md');
    injectMemoryBlock(specPath, { recent_action: '' });

    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'FRONTMATTER_MEMORY_BLOCK',
    });

    expect(result.status).toBe('fail');
    expect(result.details.some((detail) => detail.includes('missing continuity fields recent_action'))).toBe(true);
  });

  it('fails merge legality when table rows are routed into prose anchors', () => {
    const fixture = createMergeFixture();
    const result = runSpecDocStructureRule({
      folder: fixture.folder,
      level: '1',
      rule: 'MERGE_LEGALITY',
      mergePlan: fixture.mergePlan,
    });

    expect(result.status).toBe('fail');
    expect(result.details.some((detail) => detail.includes('SPECDOC_MERGE_003'))).toBe(true);
  });

  it('fails sufficiency when the what-built anchor is empty', () => {
    const folder = copyFixture('063-template-compliant-level3');
    seedContinuityAcrossFixture(folder);
    replaceAnchorBody(path.join(folder, 'implementation-summary.md'), 'what-built', '');

    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'SPEC_DOC_SUFFICIENCY',
    });

    expect(result.status).toBe('fail');
    expect(result.details.some((detail) => detail.includes('SPECDOC_SUFFICIENCY_001'))).toBe(true);
  });

  it('warns when verification lacks a concrete command or artifact', () => {
    const folder = copyFixture('063-template-compliant-level3');
    seedContinuityAcrossFixture(folder);
    replaceAnchorBody(
      path.join(folder, 'implementation-summary.md'),
      'verification',
      '## Verification\n\nValidated successfully without recording any command details.\n',
    );

    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'SPEC_DOC_SUFFICIENCY',
    });

    expect(result.status).toBe('warn');
    expect(result.details.some((detail) => detail.includes('SPECDOC_SUFFICIENCY_002'))).toBe(true);
  });

  it('warns on cross-anchor contamination when task-shaped content is routed as narrative progress', () => {
    const folder = copyFixture('063-template-compliant-level3');
    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'CROSS_ANCHOR_CONTAMINATION',
      contaminationPlan: {
        routeCategory: 'narrative_progress',
        chunkText: '- [x] T008 Run strict validation\n- [x] T009 Confirm zero errors and zero warnings\n',
      },
    });

    expect(result.status).toBe('warn');
    expect(result.details.some((detail) => detail.includes('SPECDOC_CONTAM_002'))).toBe(true);
  });

  it('hard-fails drop-classified transcript content', () => {
    const folder = copyFixture('063-template-compliant-level3');
    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'CROSS_ANCHOR_CONTAMINATION',
      contaminationPlan: {
        routeCategory: 'narrative_progress',
        chunkText: 'CONVERSATION_LOG\nuser: hello\nassistant: hi\n',
      },
    });

    expect(result.status).toBe('fail');
    expect(result.details.some((detail) => detail.includes('SPECDOC_CONTAM_003'))).toBe(true);
  });

  it('fails post-save fingerprint verification on mismatched content', () => {
    const folder = copyFixture('063-template-compliant-level3');
    const targetFile = path.join(folder, 'implementation-summary.md');
    const result = runSpecDocStructureRule({
      folder,
      level: '3',
      rule: 'POST_SAVE_FINGERPRINT',
      postSavePlan: {
        file: targetFile,
        expectedFingerprint: `sha256:${'2'.repeat(64)}`,
      },
    });

    expect(result.status).toBe('fail');
    expect(result.details.some((detail) => detail.includes('SPECDOC_FINGERPRINT_002'))).toBe(true);
  });

  it('passes validate.sh --strict on a Level 3 filled template fixture once continuity blocks are present', () => {
    const parent = makeTempDir('speckit-validate-');
    const folder = path.join(parent, '064-spec-doc-structure-level3');
    fs.mkdirSync(folder, { recursive: true });
    const sourceDir = path.join(FIXTURE_ROOT, '063-template-compliant-level3');
    for (const entry of fs.readdirSync(sourceDir)) {
      fs.cpSync(path.join(sourceDir, entry), path.join(folder, entry), { recursive: true });
    }
    seedContinuityAcrossFixture(folder);
    replaceText(
      path.join(folder, 'spec.md'),
      '## 1. METADATA',
      '<!-- ANCHOR:metadata -->\n## 1. METADATA',
    );
    replaceText(
      path.join(folder, 'spec.md'),
      '\n<!-- ANCHOR:problem -->',
      '\n<!-- /ANCHOR:metadata -->\n\n<!-- ANCHOR:problem -->',
    );
    replaceText(
      path.join(folder, 'implementation-summary.md'),
      '| **Spec Folder** | 063-template-compliant-level3 |',
      '| **Spec Folder** | 064-spec-doc-structure-level3 |',
    );
    fs.writeFileSync(
      path.join(folder, 'graph-metadata.json'),
      JSON.stringify({
        schema_version: 1,
        packet_id: '064-spec-doc-structure-level3',
        spec_folder: '064-spec-doc-structure-level3',
        parent_id: null,
        children_ids: [],
        manual: {
          depends_on: [],
          supersedes: [],
          related_to: [],
        },
        derived: {
          trigger_phrases: ['spec doc structure'],
          key_files: ['spec.md'],
          source_docs: ['spec.md', 'plan.md', 'tasks.md'],
        },
      }),
      'utf8',
    );

    const result = spawnSync(VALIDATE_SCRIPT, ['--strict', folder], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('RESULT: PASSED');
  });

  it('keeps validate.sh help aligned with the validator registry', () => {
    const registry = JSON.parse(fs.readFileSync(VALIDATOR_REGISTRY, 'utf8')) as Array<{ rule_id: string }>;
    const result = spawnSync(VALIDATE_SCRIPT, ['--help'], {
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    for (const rule of registry) {
      expect(result.stdout).toContain(rule.rule_id);
    }
    expect(result.stdout).toContain('authored_template');
    expect(result.stdout).toContain('operational_runtime');
  });

  it('fails semantic-empty authored frontmatter fields', () => {
    const folder = copyFixture('053-template-compliant-level2');
    const specPath = path.join(folder, 'spec.md');
    const broken = fs.readFileSync(specPath, 'utf8')
      .replace('title: "Feature Specification: Template Fixture [template:level_2/spec.md]"', 'title: ""')
      .replace('trigger_phrases:\n  - "fixture"', 'trigger_phrases: []');
    fs.writeFileSync(specPath, broken, 'utf8');

    const result = spawnSync(VALIDATE_SCRIPT, [folder], {
      encoding: 'utf8',
      env: {
        ...process.env,
        SPECKIT_RULES: 'FRONTMATTER_VALID',
        SKIP_TEMPLATE_CHECK: '1',
      },
    });

    expect(result.status).toBe(2);
    expect(result.stdout).toContain('Empty required frontmatter field: title');
    expect(result.stdout).toContain('Empty required frontmatter field: trigger_phrases');
  });

  it('fails duplicate opening anchor IDs during packet validation', () => {
    const folder = copyFixture('011-anchors-duplicate-ids');
    const result = spawnSync(VALIDATE_SCRIPT, [folder], {
      encoding: 'utf8',
      env: {
        ...process.env,
        SPECKIT_RULES: 'ANCHORS_VALID',
      },
    });

    expect(result.status).toBe(2);
    expect(result.stdout).toContain("Duplicate anchor ID 'section'");
  });
});

import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const {
  compareDocumentToTemplate,
  inferPhaseSpecAddenda,
  loadTemplateContract,
  loadTemplateContractForDocument,
  normalizeLevel,
  resolveTemplatePath,
} = require('../utils/template-structure.js');

const tempDirs: string[] = [];

function createTempDoc(basename: string, content: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-structure-'));
  tempDirs.push(dir);
  const filePath = path.join(dir, basename);
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe('template structure helper', () => {
  it('resolves live template paths by level and basename', () => {
    expect(normalizeLevel('3+')).toBe('3+');
    expect(resolveTemplatePath('2', 'plan.md')).toMatch(/templates\/level_2\/plan\.md$/);
    expect(resolveTemplatePath('3+', 'decision-record.md')).toMatch(/templates\/level_3\+\/decision-record\.md$/);
  });

  it('derives required header and anchor order from the active template contract', () => {
    const contract = loadTemplateContract('2', 'spec.md');

    expect(contract.supported).toBe(true);
    expect(contract.headerRules.map((rule: { raw: string }) => rule.raw)).toEqual([
      '1. METADATA',
      '2. PROBLEM & PURPOSE',
      '3. SCOPE',
      '4. REQUIREMENTS',
      '5. SUCCESS CRITERIA',
      '6. RISKS & DEPENDENCIES',
      '10. OPEN QUESTIONS',
    ]);
    expect(contract.requiredAnchors).toEqual([
      'metadata',
      'problem',
      'scope',
      'requirements',
      'success-criteria',
      'risks',
      'questions',
    ]);
  });

  it('treats optional template sections as allowed content instead of extra custom drift', () => {
    const templatePath = resolveTemplatePath('2', 'spec.md');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const docPath = createTempDoc('spec.md', templateContent);

    const result = compareDocumentToTemplate('2', 'spec.md', docPath);

    expect(result.supported).toBe(true);
    expect(result.headers.missing).toEqual([]);
    expect(result.headers.outOfOrder).toEqual([]);
    expect(result.headers.extras).toEqual([]);
    expect(result.anchors.missing).toEqual([]);
    expect(result.anchors.outOfOrder).toEqual([]);
    expect(result.anchors.extras).toEqual([]);
  });

  it('flags reordered required anchors and missing required headers on mutated documents', () => {
    const mutated = [
      '# Feature Specification: Mutated',
      '',
      '<!-- SPECKIT_LEVEL: 2 -->',
      '',
      '<!-- ANCHOR:metadata -->',
      '## 1. METADATA',
      '<!-- /ANCHOR:metadata -->',
      '',
      '<!-- ANCHOR:problem -->',
      '## 2. PROBLEM & PURPOSE',
      '<!-- /ANCHOR:problem -->',
      '',
      '<!-- ANCHOR:requirements -->',
      '## 3. SCOPE',
      '<!-- /ANCHOR:requirements -->',
      '',
      '<!-- ANCHOR:scope -->',
      '## 4. REQUIREMENTS',
      '<!-- /ANCHOR:scope -->',
      '',
      '<!-- ANCHOR:risks -->',
      '## 6. RISKS & DEPENDENCIES',
      '<!-- /ANCHOR:risks -->',
      '',
      '<!-- ANCHOR:questions -->',
      '## 7. OPEN QUESTIONS',
      '<!-- /ANCHOR:questions -->',
    ].join('\n');
    const docPath = createTempDoc('spec.md', mutated);

    const result = compareDocumentToTemplate('2', 'spec.md', docPath);

    expect(result.headers.missing).toContain('5. SUCCESS CRITERIA');
    expect(result.anchors.outOfOrder).toContain('requirements');
  });

  it('supports dynamic decision-record contracts without hardcoding a single ADR title', () => {
    const contract = loadTemplateContract('3', 'decision-record.md');

    expect(contract.supported).toBe(true);
    expect(contract.headerRules).toHaveLength(1);
    expect(contract.headerRules[0].dynamic).toBe(true);
    expect(contract.headerRules[0].pattern).toContain('ADR');
    // Both DR-NNN and ADR-NNN prefixed headers must match the pattern
    const re = new RegExp(contract.headerRules[0].pattern, 'i');
    expect(re.test('DR-001: Some Decision')).toBe(true);
    expect(re.test('ADR-001: Some Decision')).toBe(true);
  });

  it('merges the phase-parent addendum into spec contracts for phase parent folders', () => {
    const docPath = path.resolve(__dirname, 'fixtures/phase-validation/valid-phase/spec.md');

    expect(inferPhaseSpecAddenda(docPath)).toEqual(['parent']);

    const contract = loadTemplateContractForDocument('1', 'spec.md', docPath);
    expect(contract.optionalHeaderRules.map((rule: { raw: string }) => rule.raw)).toContain('PHASE DOCUMENTATION MAP');
    expect(contract.optionalAnchors).toContain('phase-map');
    expect(contract.allowedAnchors).toContain('phase-map');

    const result = compareDocumentToTemplate('1', 'spec.md', docPath);
    expect(result.headers.extras).not.toContain('PHASE DOCUMENTATION MAP');
    expect(result.anchors.extras).not.toContain('phase-map');
  });

  it('merges the phase-child addendum into spec contracts for child phase folders', () => {
    const docPath = path.resolve(__dirname, 'fixtures/phase-validation/valid-phase/001-design/spec.md');

    expect(inferPhaseSpecAddenda(docPath)).toEqual(['child']);

    const contract = loadTemplateContractForDocument('1', 'spec.md', docPath);
    expect(contract.optionalAnchors).toContain('phase-context');
    expect(contract.allowedAnchors).toContain('phase-context');

    const result = compareDocumentToTemplate('1', 'spec.md', docPath);
    expect(result.anchors.extras).not.toContain('phase-context');
  });
});

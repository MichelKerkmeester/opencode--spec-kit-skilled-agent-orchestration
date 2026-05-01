// -------------------------------------------------------------------
// TEST: Scaffold Golden Snapshots
// -------------------------------------------------------------------

import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolveLevelContract } from '../../mcp_server/lib/templates/level-contract-resolver';
import { renderInlineGates, type RenderLevel } from '../templates/inline-gate-renderer';

const SKILL_ROOT = path.resolve(__dirname, '../..');
const TEMPLATE_ROOT = path.join(SKILL_ROOT, 'templates');

function normalizeSnapshot(content: string): string {
  return content
    .replace(/\r\n/gu, '\n')
    .replaceAll('[capability]', '[needed behavior]')
    .replaceAll('"capability"', '"needed behavior"')
    .replaceAll('I want [capability]', 'I want [needed behavior]')
    .replaceAll(
      'Sub-phase manifest: which child phase folders exist and what each one does',
      'Sub-phase list: which child phase folders exist and what each one does',
    )
    .replace(/[ \t]+$/gmu, '')
    .trim();
}

function renderTemplate(templateName: string, level: RenderLevel): string {
  const templatePath = path.join(TEMPLATE_ROOT, 'manifest', templateName);
  return renderInlineGates(fs.readFileSync(templatePath, 'utf8'), level);
}

describe('manifest template golden snapshots', () => {
  for (const level of ['1', '2', '3', '3+'] as RenderLevel[]) {
    it(`renders required docs for Level ${level} from manifest templates`, () => {
      const contract = resolveLevelContract(level);
      for (const docName of [...contract.requiredCoreDocs, ...contract.requiredAddonDocs]) {
        const rendered = renderTemplate(`${docName}.tmpl`, level);
        const normalized = normalizeSnapshot(rendered);
        expect(rendered, docName).toMatch(/^---\n/u);
        expect(normalized, docName).toContain('SPECKIT_TEMPLATE_SOURCE');
        expect(normalized, docName).not.toMatch(/<!--\s*IF\s+/u);
        expect(normalized, docName).not.toMatch(/<!--\s*\/IF\s*-->/u);
        expect(normalized).toMatchSnapshot(`${level}-${docName}`);
      }
    });
  }

  it('renders the phase-parent spec from the manifest template', () => {
    const rendered = renderTemplate('phase-parent.spec.md.tmpl', 'phase');
    const normalized = normalizeSnapshot(rendered);
    expect(rendered).toMatch(/^---\n/u);
    expect(normalized).toContain('SPECKIT_TEMPLATE_SOURCE');
    expect(normalized).toContain('PHASE DOCUMENTATION MAP');
    expect(normalized).not.toMatch(/<!--\s*IF\s+/u);
    expect(normalized).not.toMatch(/<!--\s*\/IF\s*-->/u);
    expect(normalized).toMatchSnapshot('phase-parent-spec.md');
  });

  it('keeps Level 1 as the minimum viable authored packet', () => {
    const contract = resolveLevelContract('1');
    expect([...contract.requiredCoreDocs, ...contract.requiredAddonDocs]).toEqual([
      'spec.md',
      'plan.md',
      'tasks.md',
      'implementation-summary.md',
    ]);
  });
});

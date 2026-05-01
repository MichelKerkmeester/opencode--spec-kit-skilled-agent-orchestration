// -------------------------------------------------------------------
// TEST: Level Contract Resolver
// -------------------------------------------------------------------

import { describe, expect, it } from 'vitest';
import { resolveLevelContract, serializeLevelContract } from '../../mcp_server/lib/templates/level-contract-resolver';

describe('resolveLevelContract', () => {
  it('returns the Level 1 core document contract', () => {
    const contract = resolveLevelContract('1');
    expect(contract.requiredCoreDocs).toEqual(['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md']);
    expect(contract.requiredAddonDocs).toEqual([]);
    expect(contract.lazyAddonDocs).toEqual(['handover.md', 'debug-delegation.md', 'research/research.md']);
    expect(contract.frontmatterMarkerLevel).toBe(1);
  });

  it('adds verification and architecture documents at higher levels', () => {
    expect(resolveLevelContract('2').requiredAddonDocs).toEqual(['checklist.md']);
    expect(resolveLevelContract('3').requiredAddonDocs).toEqual(['checklist.md', 'decision-record.md']);
    expect(resolveLevelContract('3+').requiredAddonDocs).toEqual(['checklist.md', 'decision-record.md']);
  });

  it('keeps phase-parent contract lean', () => {
    const contract = resolveLevelContract('phase');
    expect(contract.requiredCoreDocs).toEqual(['spec.md']);
    expect(contract.requiredAddonDocs).toEqual([]);
    expect(contract.sectionGates.get('phase-list')).toEqual(['phase']);
  });

  it('serializes section gate Map without leaking internal taxonomy fields', () => {
    const serialized = serializeLevelContract(resolveLevelContract('3'));
    expect(serialized.sectionGates['risk-matrix']).toEqual(['3', '3+']);
    expect(serialized.sectionGatesByDocument['checklist.md']['arch-verify']).toEqual(['3', '3+']);
    expect(serialized.templateVersions['spec.md.tmpl']).toBe('v2.2');
    expect(Object.keys(serialized)).toEqual([
      'requiredCoreDocs',
      'requiredAddonDocs',
      'lazyAddonDocs',
      'sectionGates',
      'sectionGatesByDocument',
      'templateVersions',
      'frontmatterMarkerLevel',
    ]);
  });

  it('returns defensive copies across calls', () => {
    const first = resolveLevelContract('1');
    first.requiredCoreDocs.push('mutated.md');
    first.sectionGates.get('metadata')?.push('phase');

    const second = resolveLevelContract('1');
    expect(second.requiredCoreDocs).toEqual(['spec.md', 'plan.md', 'tasks.md', 'implementation-summary.md']);
    expect(second.sectionGates.get('metadata')).toEqual(['1', '2', '3', '3+']);
  });

  it('normalizes invalid level errors to level-only vocabulary', () => {
    expect(() => resolveLevelContract('bogus' as never)).toThrow(
      'Internal template contract could not be resolved for Level bogus',
    );
  });
});

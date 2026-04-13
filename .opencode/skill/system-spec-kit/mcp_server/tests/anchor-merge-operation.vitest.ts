import { describe, expect, it } from 'vitest';

import {
  anchorMergeOperation,
  AnchorMergeOperationError,
  type AnchorMergeMode,
} from '../lib/merge/anchor-merge-operation';

function buildDocument(anchorBodies: Record<string, string>, options: { frontmatter?: string; trailing?: string } = {}): string {
  const frontmatter = options.frontmatter ?? [
    '---',
    'title: "Gate C Merge Fixture"',
    'description: "Fixture document for anchor merge tests."',
    'contextType: "implementation"',
    'importance_tier: "normal"',
    '---',
    '',
  ].join('\n');

  const anchors = Object.entries(anchorBodies).map(([anchorId, body]) => [
    `<!-- ANCHOR:${anchorId} -->`,
    body,
    `<!-- /ANCHOR:${anchorId} -->`,
  ].join('\n'));

  return [
    frontmatter,
    ...anchors,
    options.trailing ?? '',
  ].filter(Boolean).join('\n\n');
}

function expectMergeError(
  mode: AnchorMergeMode,
  documentContent: string,
  anchorId: string,
  payload: unknown,
  fingerprint: string,
  code: string
): void {
  expect(() => anchorMergeOperation({
    documentContent,
    docPath: 'spec.md',
    anchorId,
    mergeMode: mode,
    payload: payload as never,
    dedupeFingerprint: fingerprint,
  })).toThrowError(
    expect.objectContaining({
      code,
    })
  );
}

describe('anchorMergeOperation', () => {
  describe('append-as-paragraph', () => {
    it('appends a paragraph with a fingerprint inside the target anchor only', () => {
      const documentContent = buildDocument({
        'what-built': 'Existing summary paragraph.',
        verification: 'Unrelated verification text.',
      });

      const result = anchorMergeOperation({
        documentContent,
        docPath: 'implementation-summary.md',
        anchorId: 'what-built',
        mergeMode: 'append-as-paragraph',
        payload: { paragraph: 'Added canonical merge details.' },
        dedupeFingerprint: 'sha256:1111111111111111111111111111111111111111111111111111111111111111',
      });

      expect(result.changed).toBe(true);
      expect(result.updatedDocument).toContain('Existing summary paragraph.');
      expect(result.updatedDocument).toContain('<!-- CONTINUITY-FP: sha256:1111111111111111111111111111111111111111111111111111111111111111 -->');
      expect(result.updatedDocument).toContain('Added canonical merge details.');
      expect(result.updatedDocument).toContain('<!-- ANCHOR:verification -->\nUnrelated verification text.\n<!-- /ANCHOR:verification -->');
    });

    it('returns a no-op when the fingerprint already exists', () => {
      const fingerprint = 'sha256:2222222222222222222222222222222222222222222222222222222222222222';
      const documentContent = buildDocument({
        'what-built': [
          'Existing summary paragraph.',
          `<!-- CONTINUITY-FP: ${fingerprint} -->`,
          'Added canonical merge details.',
        ].join('\n\n'),
      });

      const result = anchorMergeOperation({
        documentContent,
        docPath: 'implementation-summary.md',
        anchorId: 'what-built',
        mergeMode: 'append-as-paragraph',
        payload: { paragraph: 'Added canonical merge details.' },
        dedupeFingerprint: fingerprint,
      });

      expect(result.changed).toBe(false);
      expect(result.reason).toBe('fingerprint already present');
      expect(result.updatedDocument).toBe(documentContent);
    });

    it('rejects literal anchor markers inside non-ADR bodies', () => {
      const documentContent = buildDocument({
        'what-built': 'Existing summary.\n<!-- ANCHOR:nested -->\nBad state.\n<!-- /ANCHOR:nested -->',
      });

      expectMergeError(
        'append-as-paragraph',
        documentContent,
        'what-built',
        { paragraph: 'Should fail.' },
        'sha256:3333333333333333333333333333333333333333333333333333333333333333',
        'SPECDOC_MERGE_004'
      );
    });
  });

  describe('insert-new-adr', () => {
    it('renders a new ADR with nested anchors and the next sequential number', () => {
      const documentContent = buildDocument({
        decisions: [
          '<!-- ANCHOR:adr-001 -->',
          '## ADR-001: Keep existing writer',
          '',
          '<!-- ANCHOR:adr-001-context -->',
          '### Context',
          '',
          'Legacy context.',
          '<!-- /ANCHOR:adr-001-context -->',
          '',
          '<!-- ANCHOR:adr-001-decision -->',
          '### Decision',
          '',
          'Keep the writer for now.',
          '<!-- /ANCHOR:adr-001-decision -->',
          '',
          '<!-- ANCHOR:adr-001-consequences -->',
          '### Consequences',
          '',
          '- Low risk.',
          '<!-- /ANCHOR:adr-001-consequences -->',
          '<!-- /ANCHOR:adr-001 -->',
          '',
          '<!-- keep trailing comment -->',
        ].join('\n'),
      });

      const result = anchorMergeOperation({
        documentContent,
        docPath: 'decision-record.md',
        anchorId: 'decisions',
        mergeMode: 'insert-new-adr',
        payload: {
          title: 'Adopt anchor merge module',
          context: 'Gate C needs explicit anchor-scoped mutation.',
          decision: 'Implement anchorMergeOperation as a dedicated module.',
          consequences: ['Adds a new merge-only test surface.'],
        },
        dedupeFingerprint: 'sha256:4444444444444444444444444444444444444444444444444444444444444444',
      });

      expect(result.changed).toBe(true);
      expect(result.metadata.adrNumber).toBe(2);
      expect(result.updatedDocument).toContain('<!-- ANCHOR:adr-002 -->');
      expect(result.updatedDocument).toContain('## ADR-002: Adopt anchor merge module');
      expect(result.updatedDocument).toContain('<!-- ANCHOR:adr-002-context -->');
      expect(result.updatedDocument).toContain('<!-- ANCHOR:adr-002-decision -->');
      expect(result.updatedDocument).toContain('<!-- ANCHOR:adr-002-consequences -->');
      expect(result.updatedDocument.trimEnd().endsWith('<!-- keep trailing comment -->\n<!-- /ANCHOR:decisions -->')).toBe(true);
    });

    it('returns a no-op when an ADR title already exists', () => {
      const documentContent = buildDocument({
        decisions: [
          '<!-- ANCHOR:adr-001 -->',
          '## ADR-001: Adopt anchor merge module',
          '',
          '<!-- ANCHOR:adr-001-context -->',
          '### Context',
          '',
          'Legacy context.',
          '<!-- /ANCHOR:adr-001-context -->',
          '',
          '<!-- ANCHOR:adr-001-decision -->',
          '### Decision',
          '',
          'Keep the writer for now.',
          '<!-- /ANCHOR:adr-001-decision -->',
          '',
          '<!-- ANCHOR:adr-001-consequences -->',
          '### Consequences',
          '',
          '- Low risk.',
          '<!-- /ANCHOR:adr-001-consequences -->',
          '<!-- /ANCHOR:adr-001 -->',
        ].join('\n'),
      });

      const result = anchorMergeOperation({
        documentContent,
        docPath: 'decision-record.md',
        anchorId: 'decisions',
        mergeMode: 'insert-new-adr',
        payload: {
          title: 'Adopt anchor merge module',
          context: 'Context',
          decision: 'Decision',
        },
        dedupeFingerprint: 'sha256:5555555555555555555555555555555555555555555555555555555555555555',
      });

      expect(result.changed).toBe(false);
      expect(result.reason).toBe('adr title already present');
    });

    it('accepts the synthetic adr-NNN target and appends to the decision-record root body', () => {
      const documentContent = [
        '---',
        'title: "Decision Record"',
        'description: "Fixture"',
        'contextType: "implementation"',
        'importance_tier: "normal"',
        '---',
        '',
        '<!-- ANCHOR:adr-001 -->',
        '## ADR-001: Keep existing writer',
        '',
        '<!-- ANCHOR:adr-001-context -->',
        '### Context',
        '',
        'Legacy context.',
        '<!-- /ANCHOR:adr-001-context -->',
        '',
        '<!-- ANCHOR:adr-001-decision -->',
        '### Decision',
        '',
        'Keep the writer for now.',
        '<!-- /ANCHOR:adr-001-decision -->',
        '',
        '<!-- ANCHOR:adr-001-consequences -->',
        '### Consequences',
        '',
        '- Low risk.',
        '<!-- /ANCHOR:adr-001-consequences -->',
        '<!-- /ANCHOR:adr-001 -->',
      ].join('\n');

      const result = anchorMergeOperation({
        documentContent,
        docPath: 'decision-record.md',
        anchorId: 'adr-NNN',
        mergeMode: 'insert-new-adr',
        payload: {
          title: 'Adopt routed writer integration',
          context: 'Gate C now writes into the routed target document directly.',
          decision: 'Use the real decision-record root body as the ADR insertion container.',
          consequences: ['Keeps decision routing compatible with existing ADR anchors.'],
        },
        dedupeFingerprint: 'sha256:7777777777777777777777777777777777777777777777777777777777777777',
      });

      expect(result.changed).toBe(true);
      expect(result.metadata.adrNumber).toBe(2);
      expect(result.updatedDocument).toContain('<!-- ANCHOR:adr-002 -->');
      expect(result.updatedDocument).toContain('## ADR-002: Adopt routed writer integration');
      expect(result.updatedDocument).toContain('<!-- ANCHOR:adr-002-decision -->');
    });
  });

  describe('append-table-row', () => {
    it('appends a markdown-safe row to the target table', () => {
      const documentContent = buildDocument({
        decisions: [
          '| Decision | Status | Notes |',
          '| --- | --- | --- |',
          '| Legacy path | Done | Existing row |',
        ].join('\n'),
      });

      const result = anchorMergeOperation({
        documentContent,
        docPath: 'spec.md',
        anchorId: 'decisions',
        mergeMode: 'append-table-row',
        payload: {
          cells: ['Anchor merge', 'In Progress', 'Uses pipe | safely'],
          dedupeColumn: 0,
        },
        dedupeFingerprint: 'sha256:6666666666666666666666666666666666666666666666666666666666666666',
      });

      expect(result.changed).toBe(true);
      expect(result.updatedDocument).toContain('| Anchor merge | In Progress | Uses pipe \\| safely |');
      expect(result.metadata.appendedTableRow).toEqual(['Anchor merge', 'In Progress', 'Uses pipe \\| safely']);
    });

    it('returns a no-op when the dedupe key already exists', () => {
      const documentContent = buildDocument({
        decisions: [
          '| Decision | Status |',
          '| --- | --- |',
          '| Anchor merge | In Progress |',
        ].join('\n'),
      });

      const result = anchorMergeOperation({
        documentContent,
        docPath: 'spec.md',
        anchorId: 'decisions',
        mergeMode: 'append-table-row',
        payload: {
          cells: ['Anchor merge', 'In Progress'],
          dedupeColumn: 0,
        },
        dedupeFingerprint: 'sha256:7777777777777777777777777777777777777777777777777777777777777777',
      });

      expect(result.changed).toBe(false);
      expect(result.reason).toBe('logical table row already present');
    });

    it('fails closed when the target anchor does not contain a table', () => {
      const documentContent = buildDocument({
        decisions: 'This anchor is prose, not a markdown table.',
      });

      expectMergeError(
        'append-table-row',
        documentContent,
        'decisions',
        { cells: ['Anchor merge', 'In Progress'] },
        'sha256:8888888888888888888888888888888888888888888888888888888888888888',
        'SPECDOC_MERGE_003'
      );
    });
  });

  describe('update-in-place', () => {
    it('updates only the targeted checklist line and appends evidence', () => {
      const documentContent = buildDocument({
        'phase-1': [
          '- [ ] T001 Build validator',
          '- [ ] T003 Build anchor merge [owner: merge-team]',
          '- [ ] T004 Build atomic index',
        ].join('\n'),
      });

      const result = anchorMergeOperation({
        documentContent,
        docPath: 'tasks.md',
        anchorId: 'phase-1',
        mergeMode: 'update-in-place',
        payload: {
          targetId: 'T003',
          checked: true,
          evidence: 'unit tests green',
        },
        dedupeFingerprint: 'sha256:9999999999999999999999999999999999999999999999999999999999999999',
      });

      expect(result.changed).toBe(true);
      expect(result.updatedDocument).toContain('- [x] T003 Build anchor merge [owner: merge-team] [evidence: unit tests green]');
      expect(result.updatedDocument).toContain('- [ ] T001 Build validator');
      expect(result.updatedDocument).toContain('- [ ] T004 Build atomic index');
    });

    it('returns a no-op when the line already matches the requested state', () => {
      const documentContent = buildDocument({
        'phase-1': '- [x] T003 Build anchor merge [evidence: unit tests green]',
      });

      const result = anchorMergeOperation({
        documentContent,
        docPath: 'tasks.md',
        anchorId: 'phase-1',
        mergeMode: 'update-in-place',
        payload: {
          targetId: 'T003',
          checked: true,
          evidence: 'unit tests green',
        },
        dedupeFingerprint: 'sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      });

      expect(result.changed).toBe(false);
      expect(result.reason).toBe('structured item already reflects requested state');
    });

    it('fails when the target identifier is missing', () => {
      const documentContent = buildDocument({
        'phase-1': '- [ ] T001 Build validator',
      });

      expectMergeError(
        'update-in-place',
        documentContent,
        'phase-1',
        { targetId: 'T999', checked: true },
        'sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        'SPECDOC_MERGE_002'
      );
    });

    it('fails with an explicit message when no checklist task line matches the identifier', () => {
      const documentContent = buildDocument({
        'phase-1': [
          '- [ ] T001 Build validator',
          'Narrative note mentioning T999 without a checklist line.',
        ].join('\n'),
      });

      let thrown: unknown;
      try {
        anchorMergeOperation({
          documentContent,
          docPath: 'tasks.md',
          anchorId: 'phase-1',
          mergeMode: 'update-in-place',
          payload: { targetId: 'T999', checked: true },
          dedupeFingerprint: 'sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
        });
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(AnchorMergeOperationError);
      expect(thrown).toMatchObject({
        code: 'SPECDOC_MERGE_002',
        message: 'No matching task line found for T999',
      });
    });

    it('fails with an explicit message when multiple checklist task lines match the identifier', () => {
      const documentContent = buildDocument({
        'phase-1': '- [ ] T003 Build anchor merge',
        'phase-2': '- [ ] T003 Duplicate task anchor merge',
      });

      let thrown: unknown;
      try {
        anchorMergeOperation({
          documentContent,
          docPath: 'tasks.md',
          anchorId: 'phase-1',
          mergeMode: 'update-in-place',
          payload: { targetId: 'T003', checked: true },
          dedupeFingerprint: 'sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
        });
      } catch (error) {
        thrown = error;
      }

      expect(thrown).toBeInstanceOf(AnchorMergeOperationError);
      expect(thrown).toMatchObject({
        code: 'SPECDOC_MERGE_003',
        message: 'Ambiguous: 2 matching task lines for T003',
      });
    });
  });

  describe('append-section', () => {
    it('appends a section before trailing comments and preserves frontmatter bytes', () => {
      const frontmatter = [
        '---',
        'title: "Research"',
        'description: "Research fixture"',
        'contextType: "research"',
        'importance_tier: "important"',
        '---',
        '',
      ].join('\n');
      const documentContent = buildDocument({
        findings: [
          '### Existing finding',
          '',
          'Earlier context.',
          '',
          '<!-- trailing research comment -->',
        ].join('\n'),
      }, { frontmatter });

      const result = anchorMergeOperation({
        documentContent,
        docPath: 'research.md',
        anchorId: 'findings',
        mergeMode: 'append-section',
        payload: {
          title: '  New finding: Merge Contract  ',
          body: 'Anchor writes stay inside the target section only.',
        },
        dedupeFingerprint: 'sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
      });

      expect(result.changed).toBe(true);
      expect(result.updatedDocument.startsWith(frontmatter)).toBe(true);
      expect(result.updatedDocument).toContain('### New finding: Merge Contract');
      expect(result.updatedDocument).toContain('<!-- CONTINUITY-FP: sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc -->');
      expect(result.updatedDocument.trimEnd().endsWith('<!-- trailing research comment -->\n<!-- /ANCHOR:findings -->')).toBe(true);
    });

    it('initializes an empty anchor body with the first section', () => {
      const documentContent = buildDocument({
        findings: '',
      });

      const result = anchorMergeOperation({
        documentContent,
        docPath: 'research.md',
        anchorId: 'findings',
        mergeMode: 'append-section',
        payload: {
          title: 'First finding',
          body: 'Seed the anchor body.',
          headingLevel: 2,
        },
        dedupeFingerprint: 'sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
      });

      expect(result.changed).toBe(true);
      expect(result.updatedAnchorBody).toBe([
        '## First finding',
        '<!-- CONTINUITY-FP: sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd -->',
        '',
        'Seed the anchor body.',
      ].join('\n'));
    });
  });

  describe('envelope invariants', () => {
    it('throws a typed merge error when the target anchor is missing', () => {
      const documentContent = buildDocument({
        'what-built': 'Existing summary.',
      });

      try {
        anchorMergeOperation({
          documentContent,
          docPath: 'implementation-summary.md',
          anchorId: 'verification',
          mergeMode: 'append-as-paragraph',
          payload: { paragraph: 'Should fail.' },
          dedupeFingerprint: 'sha256:eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        });
        throw new Error('Expected missing anchor failure');
      } catch (error) {
        expect(error).toBeInstanceOf(AnchorMergeOperationError);
        expect((error as AnchorMergeOperationError).code).toBe('SPECDOC_MERGE_002');
      }
    });

    it('fails closed when the anchor body contains unresolved conflict markers', () => {
      const documentContent = buildDocument({
        'what-built': [
          '<<<<<<< HEAD',
          'Current content',
          '=======',
          'Incoming content',
          '>>>>>>> branch',
        ].join('\n'),
      });

      expectMergeError(
        'append-as-paragraph',
        documentContent,
        'what-built',
        { paragraph: 'Should fail.' },
        'sha256:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        'SPECDOC_MERGE_004'
      );
    });
  });
});

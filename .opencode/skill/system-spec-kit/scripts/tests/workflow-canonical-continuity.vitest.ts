import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  buildDefaultWorkflowCanonicalContinuityShadowPlan,
  resolveWorkflowCanonicalContinuityOptions,
  type WorkflowCanonicalContinuityInput,
} from '../core/workflow';
import { persistCanonicalContinuityShadowArtifacts } from '../core/canonical-continuity-shadow';

const TEMP_DIRS: string[] = [];

function createCanonicalInput(overrides: Partial<WorkflowCanonicalContinuityInput> = {}): WorkflowCanonicalContinuityInput {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-canonical-continuity-'));
  TEMP_DIRS.push(root);

  const specFolder = path.join(root, '064-canonical-continuity');
  fs.mkdirSync(specFolder, { recursive: true });
  fs.writeFileSync(
    path.join(specFolder, 'spec.md'),
    ['<!-- SPECKIT_LEVEL: 3 -->', '# Canonical Continuity Fixture'].join('\n'),
    'utf8',
  );
  fs.writeFileSync(path.join(specFolder, 'decision-record.md'), '# Decision Record\n', 'utf8');

  return {
    request: {
      mode: 'shadow',
      routeAs: 'decision',
      mergeModeHint: 'insert-new-adr',
      targetAuthority: 'cli',
      requestSource: 'workflow-options',
      warnings: [],
    },
    specFolder,
    specFolderName: '064-canonical-continuity',
    collectedData: {
      observations: [
        {
          title: 'Decision summary',
          narrative: 'Use the routed save shadow plan before any canonical default flip.',
          facts: ['Decision record must remain the L3 target surface.'],
        },
      ],
      completionPercent: 82,
    } as WorkflowCanonicalContinuityInput['collectedData'],
    sessionData: {
      SUMMARY: 'Adopt a shadow-only routed decision write before canonical cutover.',
      LAST_ACTION: 'Captured the decision routing contract.',
      NEXT_ACTION: 'Validate routed shadow plan',
      BLOCKERS: 'none',
      SESSION_ID: 'session-064',
    } as WorkflowCanonicalContinuityInput['sessionData'],
    memoryTitle: 'Canonical continuity shadow decision',
    summary: 'Adopt a shadow-only routed decision write before canonical cutover.',
    decisionSummaries: [
      {
        title: 'Keep the legacy write as the canonical output during Gate C.',
        rationale: 'Shadow parity must be proven before promoting reader paths.',
      },
    ],
    files: [
      {
        path: 'mcp_server/handlers/memory-save.ts',
        description: 'Routes save traffic through the Gate C writer path.',
      },
    ],
    ...overrides,
  };
}

afterEach(() => {
  while (TEMP_DIRS.length > 0) {
    const dir = TEMP_DIRS.pop();
    if (dir) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe('resolveWorkflowCanonicalContinuityOptions', () => {
  it('downgrades higher requested modes to shadow and preserves route hints', () => {
    const resolved = resolveWorkflowCanonicalContinuityOptions(
      {},
      {
        mode: 'canonical',
        routeAs: 'decision',
        mergeModeHint: 'insert-new-adr',
      },
      true,
    );

    expect(resolved).toMatchObject({
      mode: 'shadow',
      routeAs: 'decision',
      mergeModeHint: 'insert-new-adr',
      targetAuthority: 'cli',
      requestSource: 'workflow-options',
    });
    expect(resolved?.warnings).toContain(
      'Canonical continuity requests above shadow mode were downgraded to shadow-only preview.',
    );
  });

  it('turns payload route hints into a shadow request when no explicit mode is supplied', () => {
    const resolved = resolveWorkflowCanonicalContinuityOptions(
      {
        route_as: 'metadata_only',
        merge_mode_hint: 'update-in-place',
      },
      undefined,
      false,
    );

    expect(resolved).toMatchObject({
      mode: 'shadow',
      routeAs: 'metadata_only',
      mergeModeHint: 'update-in-place',
      targetAuthority: 'payload',
      requestSource: 'payload-hints',
    });
  });
});

describe('buildDefaultWorkflowCanonicalContinuityShadowPlan', () => {
  it('builds a planned routed shadow decision preview and surfaces continuity validation state', async () => {
    const plan = await buildDefaultWorkflowCanonicalContinuityShadowPlan(createCanonicalInput());

    expect(plan).toMatchObject({
      mode: 'shadow',
      status: 'planned',
      legacyMemoryWritePreserved: true,
      route: {
        category: 'decision',
        target: {
          docPath: 'decision-record.md',
          anchorId: 'adr-NNN',
          mergeMode: 'insert-new-adr',
        },
      },
      routingAudit: {
        code: 'CR001',
        target_doc: 'decision-record.md',
        target_anchor: 'adr-NNN',
        merge_mode: 'insert-new-adr',
      },
    });
    if (plan.continuity.ok) {
      expect(plan.continuity.record).toEqual(expect.objectContaining({
        packet_pointer: expect.stringContaining('064-canonical-continuity'),
        next_safe_action: 'Validate routed shadow plan',
        completion_pct: 82,
      }));
      expect(plan.continuity.yaml).toEqual(expect.stringContaining('recent_action'));
      expect(plan.continuity.errors).toEqual([]);
    } else {
      expect(plan.continuity.record).toBeNull();
      expect(plan.continuity.yaml).toBeNull();
      expect(plan.continuity.errors.length).toBeGreaterThan(0);
    }
  });

  it('writes packet-local routing-audit and shadow-compare JSONL artifacts', async () => {
    const input = createCanonicalInput();
    const plan = await buildDefaultWorkflowCanonicalContinuityShadowPlan(input);

    const artifacts = persistCanonicalContinuityShadowArtifacts({
      specFolderAbsolute: input.specFolder,
      specFolderRelative: 'specs/064-canonical-continuity',
      sessionId: input.sessionData.SESSION_ID,
      legacyMemoryPath: 'memory/context.md',
      plan,
      now: new Date('2026-04-11T10:00:00.000Z'),
    });

    expect(artifacts.routingAuditPath).toContain('routing-audit-2026-04-11.jsonl');
    expect(artifacts.shadowComparePath).toContain('shadow-compare-2026-04-11.jsonl');
    expect(fs.existsSync(artifacts.routingAuditPath as string)).toBe(true);
    expect(fs.existsSync(artifacts.shadowComparePath)).toBe(true);

    const routingAuditRows = fs.readFileSync(artifacts.routingAuditPath as string, 'utf8').trim().split('\n');
    const shadowCompareRows = fs.readFileSync(artifacts.shadowComparePath, 'utf8').trim().split('\n');
    expect(routingAuditRows).toHaveLength(1);
    expect(shadowCompareRows).toHaveLength(1);

    expect(JSON.parse(routingAuditRows[0])).toMatchObject({
      code: 'CR001',
      target_doc: 'decision-record.md',
      target_anchor: 'adr-NNN',
    });
    expect(JSON.parse(shadowCompareRows[0])).toMatchObject({
      code: 'CCS001',
      span: 'save.shadow.compare_write',
      spec_folder: 'specs/064-canonical-continuity',
      legacy_doc_path: 'memory/context.md',
    });
  });
});

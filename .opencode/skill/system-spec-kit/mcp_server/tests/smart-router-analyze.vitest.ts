import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  analyzeTelemetryFile,
  analyzeTelemetryRecords,
  formatTelemetryAnalysisReport,
  readTelemetryJsonl,
  type TelemetryAnalysis,
} from '../../scripts/observability/smart-router-analyze';
import type { ComplianceRecord } from '../../scripts/observability/smart-router-telemetry';

const roots = new Set<string>();

function tempRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'smart-router-analyze-'));
  roots.add(root);
  return root;
}

function record(overrides: Partial<ComplianceRecord>): ComplianceRecord {
  return {
    promptId: 'p1',
    selectedSkill: 'sk-code-opencode',
    predictedRoute: ['TYPESCRIPT'],
    allowedResources: ['always:references/shared/universal_patterns.md'],
    actualReads: ['references/shared/universal_patterns.md'],
    complianceClass: 'always',
    timestamp: '2026-04-19T21:00:00.000Z',
    ...overrides,
  };
}

afterEach(() => {
  for (const root of roots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  roots.clear();
});

describe('smart-router telemetry analyzer', () => {
  it('aggregates compliance classes and per-skill rates', () => {
    const analysis = analyzeTelemetryRecords({
      records: [
        record({ complianceClass: 'always' }),
        record({ complianceClass: 'extra', actualReads: ['references/extra.md'] }),
        record({
          selectedSkill: 'sk-doc',
          complianceClass: 'missing_expected',
          actualReads: [],
        }),
        record({
          selectedSkill: 'sk-doc',
          complianceClass: 'on_demand_expected',
          predictedRoute: ['ON_DEMAND'],
          allowedResources: ['on_demand:assets/checklists/doc_checklist.md'],
        }),
      ],
      generatedAt: '2026-04-19T21:00:00.000Z',
    });

    expect(analysis.totalRecords).toBe(4);
    expect(analysis.classDistribution.extra).toBe(1);
    expect(analysis.perSkill.find((row) => row.skill === 'sk-code-opencode')?.overloadRate).toBe(0.5);
    expect(analysis.perSkill.find((row) => row.skill === 'sk-doc')?.underloadRate).toBe(0.5);
    expect(analysis.perSkill.find((row) => row.skill === 'sk-doc')?.onDemandTriggerRate).toBe(0.5);
  });

  it('emits a no-data report for empty JSONL', () => {
    const root = tempRoot();
    fs.mkdirSync(path.join(root, '.opencode', 'skill', '.smart-router-telemetry'), { recursive: true });
    const inputPath = path.join(root, '.opencode', 'skill', '.smart-router-telemetry', 'compliance.jsonl');
    fs.writeFileSync(inputPath, '', 'utf8');

    const analysis = analyzeTelemetryFile({
      workspaceRoot: root,
      inputPath: '.opencode/skill/.smart-router-telemetry/compliance.jsonl',
      timestamp: '2026-04-19T21:00:00.000Z',
    });
    const markdown = formatTelemetryAnalysisReport(analysis);

    expect(analysis.noData).toBe(true);
    expect(markdown).toContain('No telemetry data yet');
  });

  it('skips invalid JSONL entries and counts parse errors', () => {
    const root = tempRoot();
    const inputPath = path.join(root, 'compliance.jsonl');
    fs.writeFileSync(inputPath, [
      JSON.stringify(record({ promptId: 'valid' })),
      '{bad json',
      JSON.stringify({ promptId: 'missing fields' }),
    ].join('\n'), 'utf8');

    const parsed = readTelemetryJsonl(inputPath);

    expect(parsed.records).toHaveLength(1);
    expect(parsed.parseErrors).toBe(2);
  });

  it('formats populated analysis as markdown tables', () => {
    const analysis: TelemetryAnalysis = analyzeTelemetryRecords({
      records: [record({ complianceClass: 'always' })],
      generatedAt: '2026-04-19T21:00:00.000Z',
      inputPath: '/tmp/compliance.jsonl',
    });
    const markdown = formatTelemetryAnalysisReport(analysis);

    expect(markdown).toMatch(/^# Smart Router Telemetry Analysis Report/);
    expect(markdown).toContain('| Class | Count | Share |');
    expect(markdown).toContain('| sk-code-opencode | 1 |');
  });
});

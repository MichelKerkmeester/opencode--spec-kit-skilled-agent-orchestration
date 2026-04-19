import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  classifyCompliance,
  recordSmartRouterCompliance,
} from '../../scripts/observability/smart-router-telemetry';

const TELEMETRY_DIR_ENV = 'SPECKIT_SMART_ROUTER_TELEMETRY_DIR';
const createdRoots = new Set<string>();
let previousTelemetryDir: string | undefined;

function createTempRoot(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'smart-router-telemetry-'));
  createdRoots.add(root);
  return root;
}

function readJsonl(root: string): unknown[] {
  const filePath = path.join(root, 'compliance.jsonl');
  return fs
    .readFileSync(filePath, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

beforeEach(() => {
  previousTelemetryDir = process.env[TELEMETRY_DIR_ENV];
});

afterEach(() => {
  if (previousTelemetryDir === undefined) {
    delete process.env[TELEMETRY_DIR_ENV];
  } else {
    process.env[TELEMETRY_DIR_ENV] = previousTelemetryDir;
  }

  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('smart-router telemetry compliance classification', () => {
  it('classifies a complete always-only read as always', () => {
    expect(
      classifyCompliance(
        ['always:references/shared/universal_patterns.md'],
        ['references/shared/universal_patterns.md']
      )
    ).toBe('always');
  });

  it('classifies a complete conditional read as conditional_expected', () => {
    expect(
      classifyCompliance(
        ['conditional:references/typescript/style_guide.md'],
        ['references/typescript/style_guide.md']
      )
    ).toBe('conditional_expected');
  });

  it('classifies a complete on-demand read as on_demand_expected', () => {
    expect(
      classifyCompliance(
        ['on_demand:assets/checklists/typescript_checklist.md'],
        ['assets/checklists/typescript_checklist.md']
      )
    ).toBe('on_demand_expected');
  });

  it('classifies an unexpected read as extra', () => {
    expect(
      classifyCompliance(
        ['always:references/shared/universal_patterns.md'],
        [
          'references/shared/universal_patterns.md',
          'references/typescript/style_guide.md',
        ]
      )
    ).toBe('extra');
  });

  it('classifies an unread predicted resource as missing_expected', () => {
    expect(
      classifyCompliance(
        [
          'always:references/shared/universal_patterns.md',
          'expected:references/typescript/style_guide.md',
        ],
        ['references/shared/universal_patterns.md']
      )
    ).toBe('missing_expected');
  });

  it('classifies empty or sentinel allowed resources as unknown_unparsed', () => {
    expect(classifyCompliance([], ['references/shared/universal_patterns.md'])).toBe('unknown_unparsed');
    expect(classifyCompliance(['__unknown_unparsed__'], ['references/shared/universal_patterns.md'])).toBe(
      'unknown_unparsed'
    );
  });
});

describe('smart-router telemetry recording', () => {
  it('writes a JSONL record and returns the same compliance payload', () => {
    const root = createTempRoot();
    process.env[TELEMETRY_DIR_ENV] = root;

    const record = recordSmartRouterCompliance({
      promptId: 'prompt-1',
      selectedSkill: 'sk-code-opencode',
      predictedRoute: ['TYPESCRIPT'],
      allowedResources: ['always:references/shared/universal_patterns.md'],
      actualReads: ['references/shared/universal_patterns.md'],
    });

    const rows = readJsonl(root);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual(record);
    expect(record.complianceClass).toBe('always');
    expect(record.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('creates the telemetry directory idempotently', () => {
    const root = createTempRoot();
    fs.mkdirSync(root, { recursive: true });
    process.env[TELEMETRY_DIR_ENV] = root;

    expect(() => {
      recordSmartRouterCompliance({
        promptId: 'prompt-2',
        selectedSkill: 'sk-code-review',
        predictedRoute: ['QUALITY'],
        allowedResources: ['conditional:references/code_quality_checklist.md'],
        actualReads: ['references/code_quality_checklist.md'],
      });
      recordSmartRouterCompliance({
        promptId: 'prompt-3',
        selectedSkill: 'sk-code-review',
        predictedRoute: ['SECURITY'],
        allowedResources: ['conditional:references/security_checklist.md'],
        actualReads: ['references/security_checklist.md'],
      });
    }).not.toThrow();

    expect(readJsonl(root)).toHaveLength(2);
  });

  it('sanitizes unsafe resource paths before JSONL persistence', () => {
    const root = createTempRoot();
    process.env[TELEMETRY_DIR_ENV] = root;

    const record = recordSmartRouterCompliance({
      promptId: 'prompt-4',
      selectedSkill: 'sk-code-opencode',
      predictedRoute: ['SHELL'],
      allowedResources: ['always:references/shell/style_guide.md\nbad'],
      actualReads: ['references/shell/style_guide.md\nbad'],
    });

    const fileContent = fs.readFileSync(path.join(root, 'compliance.jsonl'), 'utf8');
    const physicalLines = fileContent.trim().split('\n');
    expect(physicalLines).toHaveLength(1);
    expect(record.allowedResources[0]).not.toContain('\n');
    expect(record.actualReads[0]).not.toContain('\n');
    expect(readJsonl(root)[0]).toEqual(record);
  });
});

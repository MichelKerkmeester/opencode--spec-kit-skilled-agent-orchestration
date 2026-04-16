import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import type { FixtureToolContext } from './fixtures/manual-playbook-fixture';
import {
  discoverScenarioDefinitions,
  formatScenarioParseWarning,
  parseObjectLiteralArgs,
} from './manual-playbook-runner';

const tempPaths: string[] = [];

function createFixture(): FixtureToolContext {
  return {
    rootDir: '/tmp/manual-playbook-fixture',
    dbDir: '/tmp/manual-playbook-fixture/db',
    dbPath: '/tmp/manual-playbook-fixture/db/context-index.sqlite',
    reportDir: '/tmp/manual-playbook-fixture/reports',
    targetSpecSlug: '001-target',
    sandboxSpecSlug: '002-sandbox',
    targetSpecFolder: 'system-spec-kit/001-target',
    sandboxSpecFolder: 'system-spec-kit/002-sandbox',
    targetSpecAbsolute: '/tmp/manual-playbook-fixture/specs/001-target',
    sandboxSpecAbsolute: '/tmp/manual-playbook-fixture/specs/002-sandbox',
    defaultCheckpointName: 'checkpoint-default',
    baselineCheckpointName: 'checkpoint-baseline',
    adminUserId: 'admin-user',
    seededMemories: [],
    primaryMemoryId: 11,
    secondaryMemoryId: 12,
    tertiaryMemoryId: 13,
    edgeId: 21,
    continuityFile: '/tmp/manual-playbook-fixture/implementation-summary.md',
    routedSaveFile: '/tmp/manual-playbook-fixture/decision-record.md',
    ingestFiles: ['/tmp/manual-playbook-fixture/spec.md'],
    placeholders: {
      '<target-spec>': 'system-spec-kit/001-target',
    },
    reset: async () => undefined,
    cleanup: () => undefined,
  };
}

function createRuntimeState() {
  return {
    lastJobId: null,
    lastCursor: null,
    lastCheckpointName: 'checkpoint-default',
    lastSessionId: null,
    lastDeletedId: null,
    lastDeletedTitle: null,
  };
}

afterEach(() => {
  Reflect.deleteProperty(globalThis, '__manualPlaybookInjected');
  for (const tempPath of tempPaths.splice(0)) {
    fs.rmSync(tempPath, { recursive: true, force: true });
  }
});

describe('parseObjectLiteralArgs', () => {
  it('parses structured object literals without using eval', () => {
    const fixture = createFixture();
    const runtimeState = createRuntimeState();

    const parsed = parseObjectLiteralArgs(
      '{ query:"graph rollout trace check", limit:10, includeTrace:true, paths:["specs/<target-spec>/decision-record.md"], mode:focused }',
      fixture,
      runtimeState,
    );

    expect(parsed).toEqual({
      query: 'graph rollout trace check',
      limit: 10,
      includeTrace: true,
      paths: ['specs/system-spec-kit/001-target/decision-record.md'],
      mode: 'focused',
    });
  });

  it('rejects placeholder injections instead of executing them', () => {
    const fixture = createFixture();
    const runtimeState = createRuntimeState();
    runtimeState.lastJobId = 'job-42"});globalThis.__manualPlaybookInjected = true;//';

    expect(() => parseObjectLiteralArgs(
      '{ jobId:"<job-id>" }',
      fixture,
      runtimeState,
    )).toThrow(/Unexpected trailing content|Expected "," or "}"/);

    expect(Reflect.get(globalThis, '__manualPlaybookInjected')).toBeUndefined();
  });

  it('rejects shorthand object properties that previously depended on Function scope', () => {
    const fixture = createFixture();
    const runtimeState = createRuntimeState();

    expect(() => parseObjectLiteralArgs('{ jobId }', fixture, runtimeState))
      .toThrow('Shorthand object properties are not supported in playbook args: "jobId"');
  });
});

describe('discoverScenarioDefinitions', () => {
  it('keeps active scenario counts aligned with parse failures and names dropped files', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manual-playbook-runner-'));
    tempPaths.push(tempDir);

    const validScenarioPath = path.join(tempDir, '001-valid-scenario.md');
    const invalidScenarioPath = path.join(tempDir, '002-invalid-scenario.md');

    fs.writeFileSync(validScenarioPath, [
      '# Valid scenario',
      '',
      '- Playbook ID: MPR-001',
      '',
      '## 3. TEST EXECUTION',
      '',
      '- Prompt: `Check current runner coverage`',
      '',
      '- Commands: memory_search({ query:"runner coverage" })',
      '',
      '- Expected signals: coverage metrics present',
      '- Evidence: direct handler coverage observed',
      '',
      '## 4. PASS / FAIL',
    ].join('\n'));
    fs.writeFileSync(invalidScenarioPath, [
      '# Invalid scenario',
      '',
      '- Playbook ID: MPR-002',
      '',
      '## 3. TEST EXECUTION',
      '',
      '- Prompt: `This scenario is missing the expected block`',
      '- Commands: memory_search({ query:"missing expected block" })',
      '',
      '## 4. PASS / FAIL',
    ].join('\n'));

    const discovery = discoverScenarioDefinitions([validScenarioPath, invalidScenarioPath]);
    const warningLines = formatScenarioParseWarning(discovery.parseFailures);

    expect(discovery.activeScenarioCount).toBe(2);
    expect(discovery.parsedScenarioCount).toBe(1);
    expect(discovery.definitions).toHaveLength(1);
    expect(discovery.parseFailures).toHaveLength(1);
    expect(warningLines[0]).toContain('Gate I runner WARNING [R45-004]');
    expect(warningLines[0]).toContain('1 active scenario file(s) failed to parse');
    expect(warningLines.join('\n')).toContain('002-invalid-scenario.md');
  });
});

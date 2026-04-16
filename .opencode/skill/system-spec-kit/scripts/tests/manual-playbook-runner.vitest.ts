import { afterEach, describe, expect, it } from 'vitest';

import type { FixtureToolContext } from './fixtures/manual-playbook-fixture';
import { parseObjectLiteralArgs } from './manual-playbook-runner';

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

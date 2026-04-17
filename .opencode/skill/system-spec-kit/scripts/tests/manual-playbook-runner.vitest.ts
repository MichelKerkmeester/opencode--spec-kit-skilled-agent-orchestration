import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import type { FixtureToolContext } from './fixtures/manual-playbook-fixture';
import {
  discoverScenarioDefinitions,
  formatScenarioParseWarning,
  parseAutomatableMetadata,
  parseObjectLiteralArgs,
  parseScenarioDefinition,
  sanitizeJobIdForSubstitution,
  validateToolArgsSchema,
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

    // T-MPR-RUN-04 / R46-003: adversarial lastJobId fails the nanoid allowlist
    // and substitution now refuses rather than passing the payload through. This
    // layered defense works together with the typed parser's string boundary
    // enforcement (T-MPR-RUN-01) to keep `Function(...)`-shaped payloads from
    // ever reaching any interpreter surface.
    expect(() => parseObjectLiteralArgs(
      '{ jobId:"<job-id>" }',
      fixture,
      runtimeState,
    )).toThrow(/Playbook injection defense|Unexpected trailing content|Expected "," or "}"/);

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

// T-MPR-RUN-02 / R42-003: automatable metadata is read from scenario content
// (frontmatter or SOURCE METADATA), not inferred from filename substrings.
describe('parseAutomatableMetadata', () => {
  it('reads automatable: false from frontmatter with optional reason', () => {
    const text = [
      '---',
      'title: "Example"',
      'automatable: false',
      'automatable_reason: "requires out-of-band checkpoint orchestration"',
      '---',
      '',
      '# Example',
    ].join('\n');

    expect(parseAutomatableMetadata(text)).toEqual({
      automatable: false,
      reason: 'requires out-of-band checkpoint orchestration',
    });
  });

  it('reads automatable: true from SOURCE METADATA section', () => {
    const text = [
      '# Example',
      '',
      '## 5. SOURCE METADATA',
      '',
      '- Group: Retrieval',
      '- Playbook ID: 042',
      '- automatable: true',
      '',
    ].join('\n');

    expect(parseAutomatableMetadata(text)).toEqual({
      automatable: true,
      reason: null,
    });
  });

  it('returns null when no explicit field is present', () => {
    const text = '# Example with no automatable metadata';
    expect(parseAutomatableMetadata(text)).toEqual({
      automatable: null,
      reason: null,
    });
  });

  it('propagates automatable into parsed ScenarioDefinition', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manual-playbook-runner-automatable-'));
    tempPaths.push(tempDir);

    const scenarioPath = path.join(tempDir, '001-explicit-automatable.md');
    fs.writeFileSync(scenarioPath, [
      '---',
      'title: "Explicit"',
      'automatable: false',
      'automatable_reason: "manual operator cross-check required"',
      '---',
      '',
      '# Explicit scenario',
      '',
      '- Playbook ID: MPR-AUT-001',
      '',
      '## 3. TEST EXECUTION',
      '',
      '- Prompt: `run the direct handler`',
      '- Commands: memory_search({ query:"coverage" })',
      '- Expected signals: results returned',
      '- Evidence: direct handler output',
      '',
      '## 4. PASS / FAIL',
    ].join('\n'));

    const result = parseScenarioDefinition(scenarioPath);
    expect(result.kind).toBe('parsed');
    if (result.kind === 'parsed') {
      expect(result.definition.automatable).toBe(false);
      expect(result.definition.automatableReason).toBe('manual operator cross-check required');
    }
  });
});

// T-MPR-RUN-04 / R46-003: adversarial placeholder injection must not reach the
// tokenizer. The sanitizer rejects anything outside a strict nanoid allowlist; the
// parser must reject any remaining unreplaced `<job-id>` token so attackers cannot
// influence the evaluated argument map through prior handler payloads.
describe('sanitizeJobIdForSubstitution (T-MPR-RUN-04)', () => {
  it('accepts nanoid-shaped job identifiers', () => {
    expect(sanitizeJobIdForSubstitution('job_abc123def456')).toBe('job_abc123def456');
    expect(sanitizeJobIdForSubstitution('JOB-123_XYZ')).toBe('JOB-123_XYZ');
  });

  it('rejects job identifiers that contain JavaScript injection syntax', () => {
    expect(sanitizeJobIdForSubstitution('job-42"});globalThis.__manualPlaybookInjected = true;//'))
      .toBeNull();
    expect(sanitizeJobIdForSubstitution('job",malicious:1,x:"')).toBeNull();
    expect(sanitizeJobIdForSubstitution('abc def')).toBeNull();
    expect(sanitizeJobIdForSubstitution('job\nwith\nnewlines')).toBeNull();
    expect(sanitizeJobIdForSubstitution('')).toBeNull();
  });

  it('leaves <job-id> placeholder in source when payload fails allowlist', () => {
    const fixture = createFixture();
    const runtimeState = createRuntimeState();
    runtimeState.lastJobId = '"},{malicious:true}//';

    // The unsanitized lastJobId must not reach the tokenizer; the unreplaced
    // `<job-id>` literal then fails parsing, surfacing the attack.
    expect(() => parseObjectLiteralArgs(
      '{ jobId:"<job-id>" }',
      fixture,
      runtimeState,
    )).toThrow();

    expect(Reflect.get(globalThis, '__manualPlaybookInjected')).toBeUndefined();
  });
});

// T-MPR-RUN-05 / R50-002: tool-argument schemas reject unknown keys and missing
// required fields. Shorthand dialect (`{jobId}`) is already blocked by
// parseObjectLiteralArgs; the schema layer catches the partial-args case
// (e.g. when defaults merge onto parsed fragments).
describe('validateToolArgsSchema (T-MPR-RUN-05)', () => {
  it('accepts well-formed memory_ingest_status args', () => {
    expect(() => validateToolArgsSchema('memory_ingest_status', { jobId: 'job_abc123' }))
      .not.toThrow();
  });

  it('rejects memory_ingest_status args missing the required jobId', () => {
    expect(() => validateToolArgsSchema('memory_ingest_status', {}))
      .toThrow(/required argument "jobId" is missing/);
  });

  it('rejects unknown argument keys to surface playbook drift', () => {
    expect(() => validateToolArgsSchema('memory_ingest_status', {
      jobId: 'job_abc123',
      unexpectedKey: 'something',
    })).toThrow(/unknown argument "unexpectedKey"/);
  });

  it('rejects null or undefined required values (shorthand dialect symptom)', () => {
    expect(() => validateToolArgsSchema('memory_ingest_status', { jobId: null }))
      .toThrow(/required argument "jobId" is missing/);
    expect(() => validateToolArgsSchema('memory_ingest_status', { jobId: undefined }))
      .toThrow(/required argument "jobId" is missing/);
  });

  it('is a no-op for tools without registered schemas', () => {
    expect(() => validateToolArgsSchema('memory_context', { foo: 'bar' }))
      .not.toThrow();
  });
});

// T-MPR-RUN-05 / R50-002: the two incompatible argument dialects observed in
// the live corpus must yield distinct outcomes — the shorthand form is rejected
// outright so documentation-quality drift cannot crash lifecycle checks.
describe('shorthand dialect rejection (T-MPR-RUN-05)', () => {
  it('rejects bare shorthand {jobId} as an unsupported property form', () => {
    const fixture = createFixture();
    const runtimeState = createRuntimeState();
    runtimeState.lastJobId = 'job_abc123def456';

    expect(() => parseObjectLiteralArgs('{ jobId }', fixture, runtimeState))
      .toThrow('Shorthand object properties are not supported in playbook args: "jobId"');
  });

  it('accepts the explicit {jobId:"<job-id>"} form with sanitized substitution', () => {
    const fixture = createFixture();
    const runtimeState = createRuntimeState();
    runtimeState.lastJobId = 'job_abc123def456';

    const parsed = parseObjectLiteralArgs(
      '{ jobId:"<job-id>" }',
      fixture,
      runtimeState,
    );
    expect(parsed).toEqual({ jobId: 'job_abc123def456' });
  });
});

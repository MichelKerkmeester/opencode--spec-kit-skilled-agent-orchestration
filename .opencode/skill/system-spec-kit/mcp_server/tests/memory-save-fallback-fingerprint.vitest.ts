import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

const tempDirs: string[] = [];

function buildParsedMemory(targetPath: string) {
  return {
    specFolder: 'specs/999-atomic-save-fi',
    filePath: targetPath,
    title: 'Atomic Save FI',
    triggerPhrases: ['atomic-save-fi'],
    content: [
      '---',
      'title: "Atomic Save FI"',
      'description: "Contract-compliant memory-save fixture."',
      'trigger_phrases:',
      '  - "atomic save fi"',
      'importance_tier: "normal"',
      'contextType: "general"',
      '---',
      '',
      '# Atomic Save FI',
      '',
      '## SESSION SUMMARY',
      '',
      '| **Meta Data** | **Value** |',
      '|:--------------|:----------|',
      '| Total Messages | 2 |',
      '',
      '<!-- ANCHOR:continue-session -->',
      '',
      '## CONTINUE SESSION',
      '',
      'Continue from the last stable checkpoint after validating the atomic save path and its quality-gate ordering.',
      '',
      '<!-- /ANCHOR:continue-session -->',
      '',
      '<!-- ANCHOR:canonical-docs -->',
      '',
      '## CANONICAL SOURCES',
      '',
      '- `decision-record.md` - Atomic save durability contract and rollback guarantees',
      '- `implementation-summary.md` - Integration story for the behavioral save fixture',
      '',
      '<!-- /ANCHOR:canonical-docs -->',
      '',
      '<!-- ANCHOR:overview -->',
      '',
      '## OVERVIEW',
      '',
      'Memory save handler regression fixture that exercises indexing, deduplication, and post-mutation save behavior with contract-compliant content.',
      '',
      '<!-- /ANCHOR:overview -->',
      '',
      '<!-- ANCHOR:evidence -->',
      '',
      '## DISTINGUISHING EVIDENCE',
      '',
      '- Validated atomic save flow preserves durable data',
      '- Confirmed behavioral save tests can reach downstream indexing branches',
      '- Ensured template contract compliance for save-path fixtures',
      '',
      '<!-- /ANCHOR:evidence -->',
      '',
      '<!-- ANCHOR:recovery-hints -->',
      '',
      '## RECOVERY HINTS',
      '',
      'Retry the atomic save test with the same fixture.',
      '',
      '<!-- /ANCHOR:recovery-hints -->',
      '',
      '<!-- ANCHOR:metadata -->',
      '',
      '## MEMORY METADATA',
      '',
      '```yaml',
      'session_id: "atomic-save-fi"',
      '```',
      '',
      '<!-- /ANCHOR:metadata -->',
    ].join('\n'),
    contentHash: 'fi-hash',
    contextType: 'general',
    importanceTier: 'normal',
    hasCausalLinks: false,
  };
}

function writeCanonicalFixtureDoc(
  filePath: string,
  options: {
    title: string;
    anchorId: string;
    heading: string;
    body: string;
    levelMarker?: string;
    extraAnchors?: Array<{ id: string; heading: string; body: string }>;
  },
): void {
  const continuityBlock = [
    '_memory:',
    '  continuity:',
    '    packet_pointer: "system-spec-kit/999-atomic-save-fi"',
    '    last_updated_at: "2026-04-11T12:00:00Z"',
    '    last_updated_by: "copilot"',
    '    recent_action: "Prepared canonical writer fixture"',
    '    next_safe_action: "Run atomic save"',
    `  fingerprint: "sha256:${'1'.repeat(64)}"`,
  ].join('\n');

  const anchors = [
    {
      id: options.anchorId,
      heading: options.heading,
      body: options.body,
    },
    ...(options.extraAnchors ?? []),
  ].map((anchor) => [
    `<!-- ANCHOR:${anchor.id} -->`,
    anchor.heading,
    '',
    anchor.body,
    `<!-- /ANCHOR:${anchor.id} -->`,
  ].join('\n'));

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, [
    '---',
    `title: "${options.title}"`,
    `description: "${options.title} fixture"`,
    'trigger_phrases:',
    '  - "atomic save fi"',
    'importance_tier: "normal"',
    'contextType: "implementation"',
    continuityBlock,
    '---',
    '',
    options.levelMarker ?? '',
    `# ${options.title}`,
    '',
    ...anchors,
    '',
  ].filter(Boolean).join('\n'), 'utf8');
}

function createCanonicalRoutingFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'atomic-canonical-fi-'));
  tempDirs.push(root);
  const specFolder = path.join(root, 'specs', 'system-spec-kit', '999-atomic-save-fi');

  writeCanonicalFixtureDoc(path.join(specFolder, 'spec.md'), {
    title: 'Spec',
    anchorId: 'problem',
    heading: '## Problem',
    body: 'Route canonical writer updates into spec documents without rewriting unrelated files.',
    levelMarker: '<!-- SPECKIT_LEVEL: 3 -->',
  });
  writeCanonicalFixtureDoc(path.join(specFolder, 'implementation-summary.md'), {
    title: 'Implementation Summary',
    anchorId: 'what-built',
    heading: '## What Was Built',
    body: 'Updated `mcp_server/handlers/memory-save.ts` to support routed canonical writes.',
  });

  const sourcePath = path.join(specFolder, 'memory', 'session.md');
  fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
  fs.writeFileSync(sourcePath, '# original memory source', 'utf8');

  return {
    sourcePath,
    targetPath: path.join(specFolder, 'implementation-summary.md'),
  };
}

async function loadFingerprintHarness(options: {
  parseMemoryContentMock?: ReturnType<typeof vi.fn>;
  nodeFsModuleFactory?: () => unknown | Promise<unknown>;
} = {}) {
  vi.resetModules();

  const parseMemoryContentMock = options.parseMemoryContentMock
    ?? vi.fn((targetPath: string) => buildParsedMemory(targetPath));
  const validateParsedMemoryMock = vi.fn(() => ({ valid: true, errors: [], warnings: [] }));
  const runQualityLoopMock = vi.fn(() => ({
    score: { total: 0, issues: [] },
    fixes: [],
    passed: true,
    rejected: false,
    fixedTriggerPhrases: undefined,
  }));
  const runQualityGateMock = vi.fn(() => ({ pass: true, warnOnly: false, reasons: [], layers: {} }));

  vi.doMock('../lib/parsing/memory-parser', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/parsing/memory-parser')>();
    return {
      ...actual,
      parseMemoryContent: parseMemoryContentMock,
      parseMemoryFile: parseMemoryContentMock,
      isMemoryFile: vi.fn(() => true),
      validateParsedMemory: validateParsedMemoryMock,
    };
  });
  vi.doMock('../lib/parsing/memory-parser.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/parsing/memory-parser.js')>();
    return {
      ...actual,
      parseMemoryContent: parseMemoryContentMock,
      parseMemoryFile: parseMemoryContentMock,
      isMemoryFile: vi.fn(() => true),
      validateParsedMemory: validateParsedMemoryMock,
    };
  });

  vi.doMock('../handlers/quality-loop', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../handlers/quality-loop')>();
    return {
      ...actual,
      runQualityLoop: runQualityLoopMock,
    };
  });

  vi.doMock('../lib/validation/save-quality-gate', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/validation/save-quality-gate')>();
    return {
      ...actual,
      runQualityGate: runQualityGateMock,
      isQualityGateEnabled: vi.fn(() => true),
    };
  });
  vi.doMock('../lib/validation/save-quality-gate.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/validation/save-quality-gate.js')>();
    return {
      ...actual,
      runQualityGate: runQualityGateMock,
      isQualityGateEnabled: vi.fn(() => true),
    };
  });

  vi.doMock('../lib/search/search-flags', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/search/search-flags')>();
    return {
      ...actual,
      isSaveQualityGateEnabled: vi.fn(() => false),
      isQualityLoopEnabled: vi.fn(() => false),
    };
  });
  vi.doMock('../lib/search/search-flags.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../lib/search/search-flags.js')>();
    return {
      ...actual,
      isSaveQualityGateEnabled: vi.fn(() => false),
      isQualityLoopEnabled: vi.fn(() => false),
    };
  });

  vi.doMock('../handlers/v-rule-bridge', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../handlers/v-rule-bridge')>();
    return {
      ...actual,
      validateMemoryQualityContent: vi.fn(() => ({ passed: true, status: 'pass' })),
      determineValidationDisposition: vi.fn(() => 'allow'),
    };
  });
  vi.doMock('../handlers/v-rule-bridge.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../handlers/v-rule-bridge.js')>();
    return {
      ...actual,
      validateMemoryQualityContent: vi.fn(() => ({ passed: true, status: 'pass' })),
      determineValidationDisposition: vi.fn(() => 'allow'),
    };
  });

  vi.doMock('@spec-kit/shared/parsing/memory-sufficiency', () => ({
    MEMORY_SUFFICIENCY_REJECTION_CODE: 'INSUFFICIENT_CONTEXT_ABORT',
    evaluateMemorySufficiency: vi.fn(() => ({
      pass: true,
      rejectionCode: 'INSUFFICIENT_CONTEXT_ABORT',
      reasons: [],
      evidenceCounts: {
        primary: 2,
        support: 2,
        total: 4,
        semanticChars: 420,
        uniqueWords: 72,
        anchors: 2,
        triggerPhrases: 4,
      },
      score: 0.92,
    })),
  }));

  vi.doMock('../utils/validators', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../utils/validators')>();
    return {
      ...actual,
      createFilePathValidator: vi.fn(() => ((candidatePath: string) => candidatePath)),
    };
  });
  vi.doMock('../utils/validators.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../utils/validators.js')>();
    return {
      ...actual,
      createFilePathValidator: vi.fn(() => ((candidatePath: string) => candidatePath)),
    };
  });

  vi.doMock('../utils', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../utils')>();
    return {
      ...actual,
      requireDb: vi.fn(() => ({
        exec: vi.fn(),
        prepare: vi.fn(() => ({
          get: vi.fn(() => undefined),
          all: vi.fn(() => []),
          run: vi.fn(() => ({ changes: 0 })),
        })),
        transaction: vi.fn((fn: (...args: unknown[]) => unknown) => {
          const transactionRunner = (() => fn()) as ((...args: unknown[]) => unknown) & {
            deferred?: () => unknown;
            exclusive?: () => unknown;
            immediate?: () => unknown;
          };
          transactionRunner.deferred = () => fn();
          transactionRunner.exclusive = () => fn();
          transactionRunner.immediate = () => fn();
          return transactionRunner;
        }),
      })),
    };
  });
  vi.doMock('../utils/index.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../utils/index.js')>();
    return {
      ...actual,
      requireDb: vi.fn(() => ({
        exec: vi.fn(),
        prepare: vi.fn(() => ({
          get: vi.fn(() => undefined),
          all: vi.fn(() => []),
          run: vi.fn(() => ({ changes: 0 })),
        })),
        transaction: vi.fn((fn: (...args: unknown[]) => unknown) => {
          const transactionRunner = (() => fn()) as ((...args: unknown[]) => unknown) & {
            deferred?: () => unknown;
            exclusive?: () => unknown;
            immediate?: () => unknown;
          };
          transactionRunner.deferred = () => fn();
          transactionRunner.exclusive = () => fn();
          transactionRunner.immediate = () => fn();
          return transactionRunner;
        }),
      })),
    };
  });

  vi.doMock('../core', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../core')>();
    return {
      ...actual,
      checkDatabaseUpdated: vi.fn(async () => false),
    };
  });
  vi.doMock('../core/index.js', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../core/index.js')>();
    return {
      ...actual,
      checkDatabaseUpdated: vi.fn(async () => false),
    };
  });

  if (options.nodeFsModuleFactory) {
    vi.doMock('node:fs', options.nodeFsModuleFactory as never);
  }

  const module = await import('../handlers/memory-save');
  return {
    module,
    parseMemoryContentMock,
  };
}

describe('memory-save canonical fallback fingerprint guard', () => {
  afterEach(() => {
    for (const dir of tempDirs.splice(0, tempDirs.length)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
    vi.doUnmock('../lib/parsing/memory-parser');
    vi.doUnmock('../lib/parsing/memory-parser.js');
    vi.doUnmock('../handlers/quality-loop');
    vi.doUnmock('../lib/validation/save-quality-gate');
    vi.doUnmock('../lib/validation/save-quality-gate.js');
    vi.doUnmock('../lib/search/search-flags');
    vi.doUnmock('../lib/search/search-flags.js');
    vi.doUnmock('../handlers/v-rule-bridge');
    vi.doUnmock('../handlers/v-rule-bridge.js');
    vi.doUnmock('@spec-kit/shared/parsing/memory-sufficiency');
    vi.doUnmock('../utils/validators');
    vi.doUnmock('../utils/validators.js');
    vi.doUnmock('../utils');
    vi.doUnmock('../utils/index.js');
    vi.doUnmock('../core');
    vi.doUnmock('../core/index.js');
    vi.doUnmock('node:fs');
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('rejects full-auto canonical saves when the promoted file fingerprint no longer matches the prepared content', async () => {
    const fixture = createCanonicalRoutingFixture();
    const targetBefore = fs.readFileSync(fixture.targetPath, 'utf8');
    const parseMemoryContentMock = vi.fn((targetPath: string) => ({
      ...buildParsedMemory(targetPath),
      specFolder: 'system-spec-kit/999-atomic-save-fi',
    }));

    const harness = await loadFingerprintHarness({
      parseMemoryContentMock,
      nodeFsModuleFactory: async () => {
        const actual = await vi.importActual<typeof import('node:fs')>('node:fs');
        return {
          ...actual,
          renameSync: vi.fn((from: string, to: string) => {
            const pendingContent = actual.readFileSync(from, 'utf8');
            actual.mkdirSync(path.dirname(to), { recursive: true });
            actual.writeFileSync(to, `${pendingContent}\nTampered after promotion.`, 'utf8');
            actual.unlinkSync(from);
          }),
        };
      },
    });

    const result = await harness.module.atomicSaveMemory(
      {
        file_path: fixture.sourcePath,
        content: 'Implemented fingerprint verification coverage for canonical fallback writes.',
        routeAs: 'narrative_progress',
        plannerMode: 'full-auto',
      },
      { force: true },
    );

    expect(result.success).toBe(false);
    expect(result.status).toBe('rejected');
    expect(result.summary).toBe('Atomic index rejected after file promotion rollback');
    expect(result.filePath).toBe(fixture.targetPath);
    expect(result.message).toMatch(/fingerprint/i);
    expect(fs.readFileSync(fixture.targetPath, 'utf8')).toBe(targetBefore);
    expect(fs.readFileSync(fixture.sourcePath, 'utf8')).toBe('# original memory source');
    expect(harness.parseMemoryContentMock).toHaveBeenCalled();
  });
});

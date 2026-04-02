// TEST: Generate Context CLI Authority
// Ensures main() preserves explicit CLI targets into runWorkflow
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const harness = vi.hoisted(() => ({
  runWorkflow: vi.fn(async () => undefined),
  loadCollectedData: vi.fn(async () => ({ _source: 'file' })),
  collectSessionData: vi.fn(async () => undefined),
}));

vi.mock('../core/workflow', () => ({
  runWorkflow: harness.runWorkflow,
}));

vi.mock('../loaders', () => ({
  loadCollectedData: harness.loadCollectedData,
}));

vi.mock('../extractors/collect-session-data', () => ({
  collectSessionData: harness.collectSessionData,
}));

const ORIGINAL_ARGV = [...process.argv];
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..');

async function resetGenerateContextConfig(): Promise<void> {
  const { CONFIG } = await import('../core');
  CONFIG.DATA_FILE = null;
  CONFIG.SPEC_FOLDER_ARG = null;
}

function mockProcessExit(): ReturnType<typeof vi.spyOn> {
  return vi.spyOn(process, 'exit').mockImplementation(((code?: string | number | null) => {
    throw new Error(`EXIT:${code ?? 0}`);
  }) as never);
}

describe('generate-context CLI authority', () => {
  beforeEach(async () => {
    vi.resetModules();
    harness.runWorkflow.mockClear();
    harness.loadCollectedData.mockClear();
    harness.collectSessionData.mockClear();
    process.argv = [...ORIGINAL_ARGV];
    await resetGenerateContextConfig();
  });

  afterEach(async () => {
    process.argv = [...ORIGINAL_ARGV];
    await resetGenerateContextConfig();
  });

  it('passes JSON-mode data and explicit CLI spec-folder override through main()', async () => {
    const dataFile = '/tmp/save-context-data.json';
    const explicitSpecFolder = '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion';
    process.argv = ['node', path.join('scripts', 'dist', 'memory', 'generate-context.js'), dataFile, explicitSpecFolder];

    const { main } = await import('../memory/generate-context');
    await main();

    expect(harness.runWorkflow).toHaveBeenCalledTimes(1);
    const workflowCall = harness.runWorkflow.mock.calls[0]?.[0];
    expect(workflowCall).toMatchObject({
      dataFile,
      specFolderArg: explicitSpecFolder,
      loadDataFn: expect.any(Function),
      collectSessionDataFn: harness.collectSessionData,
      collectedData: undefined,
    });
    await workflowCall?.loadDataFn?.();
    expect(harness.loadCollectedData).toHaveBeenCalledWith({});
  });

  it('forwards explicit --session-id to workflow', async () => {
    const dataFile = '/tmp/save-context-data.json';
    const explicitSpecFolder = '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion';
    const sessionId = 'test-session-123';
    process.argv = [
      'node',
      path.join('scripts', 'dist', 'memory', 'generate-context.js'),
      '--session-id',
      sessionId,
      dataFile,
      explicitSpecFolder,
    ];

    const { main } = await import('../memory/generate-context');
    await main();

    expect(harness.runWorkflow).toHaveBeenCalledTimes(1);
    const workflowCall = harness.runWorkflow.mock.calls[0]?.[0];
    expect(workflowCall).toMatchObject({
      dataFile,
      specFolderArg: explicitSpecFolder,
      sessionId,
      loadDataFn: expect.any(Function),
      collectSessionDataFn: harness.collectSessionData,
      collectedData: undefined,
    });
    await workflowCall?.loadDataFn?.();
    expect(harness.loadCollectedData).toHaveBeenCalledWith({ });
  });

  it('passes stdin JSON as preloaded collectedData and preserves an explicit CLI spec-folder override', async () => {
    const explicitSpecFolder = '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion';
    const resolvedSpecFolder = path.resolve(REPO_ROOT, explicitSpecFolder);
    const payload = JSON.stringify({
      specFolder: '.opencode/specs/01--anobel.com/036-hero-contact-success',
      sessionSummary: 'Structured stdin payload should not override an explicit CLI target.',
    });

    const { main } = await import('../memory/generate-context');
    await main(['--stdin', explicitSpecFolder], async () => payload);

    expect(harness.runWorkflow).toHaveBeenCalledTimes(1);
    expect(harness.runWorkflow).toHaveBeenCalledWith(expect.objectContaining({
      dataFile: undefined,
      specFolderArg: resolvedSpecFolder,
      collectedData: expect.objectContaining({
        specFolder: '.opencode/specs/01--anobel.com/036-hero-contact-success',
        sessionSummary: 'Structured stdin payload should not override an explicit CLI target.',
        _source: 'file',
      }),
      loadDataFn: undefined,
      collectSessionDataFn: harness.collectSessionData,
    }));
    expect(harness.loadCollectedData).not.toHaveBeenCalled();
  });

  it('passes inline JSON as preloaded collectedData using the payload spec folder when no explicit override is present', async () => {
    const payloadSpecFolder = '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion';
    const resolvedSpecFolder = path.resolve(REPO_ROOT, payloadSpecFolder);
    const payload = JSON.stringify({
      specFolder: payloadSpecFolder,
      sessionSummary: 'Inline JSON should resolve its own spec folder when no override exists.',
    });

    const { main } = await import('../memory/generate-context');
    await main(['--json', payload]);

    expect(harness.runWorkflow).toHaveBeenCalledTimes(1);
    expect(harness.runWorkflow).toHaveBeenCalledWith(expect.objectContaining({
      dataFile: undefined,
      specFolderArg: resolvedSpecFolder,
      collectedData: expect.objectContaining({
        specFolder: payloadSpecFolder,
        sessionSummary: 'Inline JSON should resolve its own spec folder when no override exists.',
        _source: 'file',
      }),
      loadDataFn: undefined,
      collectSessionDataFn: harness.collectSessionData,
    }));
    expect(harness.loadCollectedData).not.toHaveBeenCalled();
  });

  it('keeps target resolution and collectedData shape identical between --stdin and --json for the same payload', async () => {
    const payloadSpecFolder = '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion';
    const resolvedSpecFolder = path.resolve(REPO_ROOT, payloadSpecFolder);
    const payload = JSON.stringify({
      specFolder: payloadSpecFolder,
      sessionSummary: 'Equivalent structured payloads should resolve identically across stdin and inline JSON modes.',
      triggerPhrases: ['structured parity', 'stdin json parity'],
    });

    const { main } = await import('../memory/generate-context');

    await main(['--stdin'], async () => payload);
    const stdinCall = harness.runWorkflow.mock.calls.at(-1)?.[0];

    harness.runWorkflow.mockClear();

    await main(['--json', payload]);
    const jsonCall = harness.runWorkflow.mock.calls.at(-1)?.[0];

    expect(stdinCall).toMatchObject({
      dataFile: undefined,
      specFolderArg: resolvedSpecFolder,
      collectedData: expect.objectContaining({
        specFolder: payloadSpecFolder,
        sessionSummary: 'Equivalent structured payloads should resolve identically across stdin and inline JSON modes.',
        _source: 'file',
      }),
    });
    expect(jsonCall).toMatchObject({
      dataFile: undefined,
      specFolderArg: resolvedSpecFolder,
      collectedData: expect.objectContaining({
        specFolder: payloadSpecFolder,
        sessionSummary: 'Equivalent structured payloads should resolve identically across stdin and inline JSON modes.',
        _source: 'file',
      }),
    });
    expect(stdinCall?.specFolderArg).toBe(jsonCall?.specFolderArg);
    expect(stdinCall?.collectedData).toEqual(jsonCall?.collectedData);
  });

  it('allows an empty JSON object through to workflow when an explicit CLI target is present', async () => {
    const explicitSpecFolder = '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion';
    const resolvedSpecFolder = path.resolve(REPO_ROOT, explicitSpecFolder);

    const { main } = await import('../memory/generate-context');
    await main(['--json', '{}', explicitSpecFolder]);

    expect(harness.runWorkflow).toHaveBeenCalledTimes(1);
    expect(harness.runWorkflow).toHaveBeenCalledWith(expect.objectContaining({
      dataFile: undefined,
      specFolderArg: resolvedSpecFolder,
      collectedData: { _source: 'file' },
      loadDataFn: undefined,
      collectSessionDataFn: harness.collectSessionData,
    }));
  });

  it('exits non-zero on malformed inline JSON before calling runWorkflow', async () => {
    const exitSpy = mockProcessExit();

    const { main } = await import('../memory/generate-context');

    await expect(main(['--json', '{'])).rejects.toThrow('EXIT:1');
    expect(harness.runWorkflow).not.toHaveBeenCalled();
    expect(harness.loadCollectedData).not.toHaveBeenCalled();

    exitSpy.mockRestore();
  });

  it('exits non-zero when stdin/json mode has no explicit or payload target spec folder', async () => {
    const exitSpy = mockProcessExit();
    const payload = JSON.stringify({
      sessionSummary: 'Missing target should fail before workflow execution.',
    });

    const { main } = await import('../memory/generate-context');

    await expect(main(['--stdin'], async () => payload)).rejects.toThrow('EXIT:1');
    expect(harness.runWorkflow).not.toHaveBeenCalled();
    expect(harness.loadCollectedData).not.toHaveBeenCalled();

    exitSpy.mockRestore();
  });

  it('exits non-zero when stdin/json mode resolves an invalid explicit target spec folder', async () => {
    const exitSpy = mockProcessExit();
    const payload = JSON.stringify({
      sessionSummary: 'Invalid target should fail validation before workflow execution.',
    });

    const { main } = await import('../memory/generate-context');

    await expect(main(['--json', payload, 'not-a-spec-folder'])).rejects.toThrow('EXIT:1');
    expect(harness.runWorkflow).not.toHaveBeenCalled();
    expect(harness.loadCollectedData).not.toHaveBeenCalled();

    exitSpy.mockRestore();
  });

  it('does not accumulate SIGINT or SIGTERM handlers across repeated module imports', async () => {
    const baselineSigintListeners = process.listeners('SIGINT');
    const baselineSigtermListeners = process.listeners('SIGTERM');

    for (let attempt = 0; attempt < 3; attempt++) {
      vi.resetModules();
      await import('../memory/generate-context');
    }

    expect(process.listeners('SIGINT')).toHaveLength(baselineSigintListeners.length);
    expect(process.listeners('SIGTERM')).toHaveLength(baselineSigtermListeners.length);
  });
});

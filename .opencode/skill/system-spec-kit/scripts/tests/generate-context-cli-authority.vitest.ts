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

  it('passes direct CLI spec-folder mode through main() as an authoritative workflow target', async () => {
    const explicitSpecFolder = '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion';
    const resolvedSpecFolder = path.resolve(REPO_ROOT, explicitSpecFolder);
    process.argv = ['node', path.join('scripts', 'dist', 'memory', 'generate-context.js'), explicitSpecFolder];

    const { main } = await import('../memory/generate-context');
    await main();

    expect(harness.runWorkflow).toHaveBeenCalledTimes(1);
    expect(harness.runWorkflow).toHaveBeenCalledWith(expect.objectContaining({
      dataFile: undefined,
      specFolderArg: resolvedSpecFolder,
      loadDataFn: harness.loadCollectedData,
      collectSessionDataFn: harness.collectSessionData,
    }));
  });

  it('passes JSON-mode data and explicit CLI spec-folder override through main()', async () => {
    const dataFile = '/tmp/save-context-data.json';
    const explicitSpecFolder = '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion';
    process.argv = ['node', path.join('scripts', 'dist', 'memory', 'generate-context.js'), dataFile, explicitSpecFolder];

    const { main } = await import('../memory/generate-context');
    await main();

    expect(harness.runWorkflow).toHaveBeenCalledTimes(1);
    expect(harness.runWorkflow).toHaveBeenCalledWith(expect.objectContaining({
      dataFile,
      specFolderArg: explicitSpecFolder,
      loadDataFn: harness.loadCollectedData,
      collectSessionDataFn: harness.collectSessionData,
    }));
  });

  it('passes an explicit phase-folder CLI target through main() as an authoritative workflow target', async () => {
    const explicitPhaseFolder = '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/021-remediation-revalidation';
    const resolvedPhaseFolder = path.resolve(REPO_ROOT, explicitPhaseFolder);
    process.argv = ['node', path.join('scripts', 'dist', 'memory', 'generate-context.js'), explicitPhaseFolder];

    const { main } = await import('../memory/generate-context');
    await main();

    expect(harness.runWorkflow).toHaveBeenCalledTimes(1);
    expect(harness.runWorkflow).toHaveBeenCalledWith(expect.objectContaining({
      dataFile: undefined,
      specFolderArg: resolvedPhaseFolder,
      loadDataFn: harness.loadCollectedData,
      collectSessionDataFn: harness.collectSessionData,
    }));
  });
});

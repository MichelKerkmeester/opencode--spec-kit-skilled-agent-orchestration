import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const pathsModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/shared/review-research-paths.cjs',
)) as {
  resolveArtifactRoot: (
    specFolder: string,
    mode?: 'review' | 'research',
  ) => {
    rootDir: string;
    subfolder: string | null;
    artifactDir: string;
    artifactArchiveRoot: string;
  };
};

const tempDirs: string[] = [];

function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function makeSpecFolder(rootPath: string, relativePath: string): string {
  const specFolder = path.join(rootPath, relativePath);
  writeFile(path.join(specFolder, 'spec.md'), `# ${path.basename(relativePath)}\n`);
  return specFolder;
}

function createPacket(
  specFolder: string,
  mode: 'review' | 'research',
  packetName: string,
  configSpecFolder: string,
): string {
  const packetDir = path.join(specFolder, mode, packetName);
  const configFile = mode === 'review' ? 'deep-review-config.json' : 'deep-research-config.json';

  writeFile(
    path.join(packetDir, configFile),
    `${JSON.stringify({ specFolder: configSpecFolder }, null, 2)}\n`,
  );

  return packetDir;
}

function makeWorkspaceFixture(): { rootSpec: string; childSpec: string; nestedSpec: string } {
  const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'review-research-paths-'));
  tempDirs.push(workspaceRoot);

  const rootSpec = makeSpecFolder(workspaceRoot, '026-graph-and-context-optimization');
  const childSpec = makeSpecFolder(rootSpec, '013-sk-deep-refinement');
  const nestedSpec = makeSpecFolder(childSpec, '002-resource-map-deep-loop-integration');

  return { rootSpec, childSpec, nestedSpec };
}

afterEach(() => {
  while (tempDirs.length) {
    fs.rmSync(tempDirs.pop() as string, { recursive: true, force: true });
  }
});

describe('review-research path resolution', () => {
  it('keeps root-spec research runs at the root spec folder', () => {
    const { rootSpec } = makeWorkspaceFixture();

    const resolved = pathsModule.resolveArtifactRoot(rootSpec, 'research');

    expect(resolved.rootDir).toBe(path.join(rootSpec, 'research'));
    expect(resolved.subfolder).toBeNull();
    expect(resolved.artifactDir).toBe(path.join(rootSpec, 'research'));
    expect(resolved.artifactArchiveRoot).toBe(path.join(rootSpec, 'research_archive'));
  });

  it('allocates child-phase review packets inside the child phase local folder', () => {
    const { childSpec } = makeWorkspaceFixture();

    const resolved = pathsModule.resolveArtifactRoot(childSpec, 'review');

    expect(resolved.rootDir).toBe(path.join(childSpec, 'review'));
    expect(resolved.subfolder).toBe('013-sk-deep-refinement-pt-01');
    expect(resolved.artifactDir).toBe(path.join(childSpec, 'review', '013-sk-deep-refinement-pt-01'));
    expect(resolved.artifactArchiveRoot).toBe(
      path.join(childSpec, 'review_archive', '013-sk-deep-refinement-pt-01'),
    );
  });

  it('allocates nested research packets inside the exact nested owner folder', () => {
    const { nestedSpec } = makeWorkspaceFixture();

    const resolved = pathsModule.resolveArtifactRoot(nestedSpec, 'research');

    expect(resolved.rootDir).toBe(path.join(nestedSpec, 'research'));
    expect(resolved.subfolder).toBe('002-resource-map-deep-loop-integration-pt-01');
    expect(resolved.artifactDir).toBe(
      path.join(nestedSpec, 'research', '002-resource-map-deep-loop-integration-pt-01'),
    );
    expect(resolved.artifactArchiveRoot).toBe(
      path.join(nestedSpec, 'research_archive', '002-resource-map-deep-loop-integration-pt-01'),
    );
  });

  it('reuses an existing packet for the same child target instead of allocating a sibling', () => {
    const { childSpec } = makeWorkspaceFixture();

    createPacket(
      childSpec,
      'research',
      '013-sk-deep-refinement-pt-01',
      childSpec,
    );

    const resolved = pathsModule.resolveArtifactRoot(childSpec, 'research');

    expect(resolved.subfolder).toBe('013-sk-deep-refinement-pt-01');
    expect(resolved.artifactDir).toBe(
      path.join(childSpec, 'research', '013-sk-deep-refinement-pt-01'),
    );
  });
});

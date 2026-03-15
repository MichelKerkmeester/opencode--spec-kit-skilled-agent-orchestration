// TEST: Workspace Identity
// Covers canonical .opencode identity matching across repo-root variants
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  buildWorkspaceIdentity,
  isSameWorkspacePath,
  toWorkspaceRelativePath,
} from '../utils';

const tempRoots: string[] = [];

function makeTempRoot(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.push(root);
  return root;
}

afterEach(() => {
  while (tempRoots.length > 0) {
    fs.rmSync(tempRoots.pop()!, { recursive: true, force: true });
  }
});

describe('workspace identity normalization', () => {
  it('treats the repo-local .opencode directory as the canonical workspace anchor', () => {
    const repoRoot = makeTempRoot('speckit-workspace-');
    const opencodeRoot = path.join(repoRoot, '.opencode');
    fs.mkdirSync(opencodeRoot, { recursive: true });

    const identity = buildWorkspaceIdentity(opencodeRoot);

    expect(identity.canonicalOpencodePath).toMatch(/\/\.opencode$/);
    expect(identity.workspaceRoot).toMatch(/speckit-workspace-/);
    expect(identity.matchPaths).toEqual(expect.arrayContaining([repoRoot, opencodeRoot]));
    expect(isSameWorkspacePath(opencodeRoot, opencodeRoot)).toBe(true);
    expect(isSameWorkspacePath(opencodeRoot, repoRoot)).toBe(true);
  });

  it('accepts repo-root and nested paths that resolve to the same .opencode workspace', () => {
    const repoRoot = makeTempRoot('speckit-workspace-');
    const opencodeRoot = path.join(repoRoot, '.opencode');
    const nestedSkillDir = path.join(opencodeRoot, 'skill', 'system-spec-kit');
    fs.mkdirSync(nestedSkillDir, { recursive: true });

    expect(isSameWorkspacePath(opencodeRoot, repoRoot)).toBe(true);
    expect(isSameWorkspacePath(opencodeRoot, nestedSkillDir)).toBe(true);
    expect(toWorkspaceRelativePath(opencodeRoot, path.join(repoRoot, '.opencode', 'skill', 'system-spec-kit', 'scripts', 'core', 'workflow.ts')))
      .toBe('.opencode/skill/system-spec-kit/scripts/core/workflow.ts');
    expect(toWorkspaceRelativePath(opencodeRoot, path.join(repoRoot, 'README.md'))).toBe('README.md');
  });

  it('rejects unrelated repos even when their basenames are similar', () => {
    const repoRoot = makeTempRoot('speckit-workspace-a-');
    const otherRepoRoot = makeTempRoot('speckit-workspace-b-');
    fs.mkdirSync(path.join(repoRoot, '.opencode'), { recursive: true });
    fs.mkdirSync(path.join(otherRepoRoot, '.opencode'), { recursive: true });

    expect(isSameWorkspacePath(path.join(repoRoot, '.opencode'), otherRepoRoot)).toBe(false);
    expect(isSameWorkspacePath(path.join(repoRoot, '.opencode'), path.join(otherRepoRoot, '.opencode'))).toBe(false);
  });

  it('keeps symlinked and trailing-slash variants equivalent', () => {
    const repoRoot = makeTempRoot('speckit-workspace-link-');
    const opencodeRoot = path.join(repoRoot, '.opencode');
    fs.mkdirSync(opencodeRoot, { recursive: true });

    const symlinkRoot = path.join(os.tmpdir(), `speckit-workspace-link-alias-${Date.now()}`);
    fs.symlinkSync(repoRoot, symlinkRoot, 'dir');
    tempRoots.push(symlinkRoot);

    expect(isSameWorkspacePath(`${opencodeRoot}/`, `${symlinkRoot}/`)).toBe(true);
    expect(isSameWorkspacePath(opencodeRoot, path.join(symlinkRoot, '.opencode'))).toBe(true);
  });
});

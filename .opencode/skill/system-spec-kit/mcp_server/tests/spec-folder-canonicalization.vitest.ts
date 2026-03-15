// ───────────────────────────────────────────────────────────────
// TEST: Spec Folder Canonicalization via Symlink Resolution
// ───────────────────────────────────────────────────────────────
// Verifies that extractSpecFolder() produces identical output
// regardless of whether a file is accessed via symlink or real path.
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { extractSpecFolder } from '../lib/parsing/memory-parser';
import {
  canonicalizeForSpecFolderExtraction,
  getCanonicalPathKey,
} from '../lib/utils/canonical-path';

let tmpRoot: string;
let realSpecsDir: string;
let symlinkSpecsDir: string;

beforeAll(() => {
  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'canon-test-'));

  // Create real directory structure:
  // <tmpRoot>/.opencode/specs/010-test/memory/session.md
  realSpecsDir = path.join(tmpRoot, '.opencode', 'specs');
  const memoryDir = path.join(realSpecsDir, '010-test', 'memory');
  fs.mkdirSync(memoryDir, { recursive: true });
  fs.writeFileSync(path.join(memoryDir, 'session.md'), '---\ntitle: test\n---\nContent');

  // Create nested spec:
  // <tmpRoot>/.opencode/specs/02--domain/010-test/memory/nested.md
  const nestedMemoryDir = path.join(realSpecsDir, '02--domain', '010-test', 'memory');
  fs.mkdirSync(nestedMemoryDir, { recursive: true });
  fs.writeFileSync(path.join(nestedMemoryDir, 'nested.md'), '---\ntitle: nested\n---\nNested');

  // Create symlink: <tmpRoot>/.claude/specs → ../.opencode/specs
  const claudeDir = path.join(tmpRoot, '.claude');
  fs.mkdirSync(claudeDir, { recursive: true });
  symlinkSpecsDir = path.join(claudeDir, 'specs');
  fs.symlinkSync(path.join('..', '.opencode', 'specs'), symlinkSpecsDir);
});

afterAll(() => {
  fs.rmSync(tmpRoot, { recursive: true, force: true });
});

describe('canonicalizeForSpecFolderExtraction', () => {
  it('resolves symlink to real path', () => {
    const symlinkPath = path.join(symlinkSpecsDir, '010-test', 'memory', 'session.md');
    const realPath = path.join(realSpecsDir, '010-test', 'memory', 'session.md');
    const canonSym = canonicalizeForSpecFolderExtraction(symlinkPath);
    const canonReal = canonicalizeForSpecFolderExtraction(realPath);
    expect(canonSym).toBe(canonReal);
  });

  it('already-canonical paths are unchanged', () => {
    const realPath = path.join(realSpecsDir, '010-test', 'memory', 'session.md');
    const result = canonicalizeForSpecFolderExtraction(realPath);
    expect(result).toBe(fs.realpathSync(realPath).replace(/\\/g, '/'));
  });

  it('non-existent file resolves via parent (atomic save)', () => {
    const atomicPath = path.join(realSpecsDir, '010-test', 'memory', 'atomic-save-tmp.md');
    const result = canonicalizeForSpecFolderExtraction(atomicPath);
    // Should resolve the existing parent and append the non-existent filename
    expect(result).toContain('010-test/memory/atomic-save-tmp.md');
    // Should not throw
    expect(typeof result).toBe('string');
  });

  it('deeply non-existent path still resolves', () => {
    const deepPath = path.join(realSpecsDir, '999-fake', 'memory', 'deep.md');
    const result = canonicalizeForSpecFolderExtraction(deepPath);
    expect(result).toContain('999-fake/memory/deep.md');
  });

  it('uses forward slashes on all platforms', () => {
    const realPath = path.join(realSpecsDir, '010-test', 'memory', 'session.md');
    const result = canonicalizeForSpecFolderExtraction(realPath);
    expect(result).not.toContain('\\');
  });
});

describe('extractSpecFolder — symlink consistency', () => {
  it('produces identical spec_folder for symlink vs real path', () => {
    const realPath = path.join(realSpecsDir, '010-test', 'memory', 'session.md');
    const symlinkPath = path.join(symlinkSpecsDir, '010-test', 'memory', 'session.md');

    const specReal = extractSpecFolder(realPath);
    const specSym = extractSpecFolder(symlinkPath);

    expect(specReal).toBe(specSym);
    expect(specReal).toBe('010-test');
  });

  it('produces identical spec_folder for nested spec via symlink', () => {
    const realPath = path.join(realSpecsDir, '02--domain', '010-test', 'memory', 'nested.md');
    const symlinkPath = path.join(symlinkSpecsDir, '02--domain', '010-test', 'memory', 'nested.md');

    const specReal = extractSpecFolder(realPath);
    const specSym = extractSpecFolder(symlinkPath);

    expect(specReal).toBe(specSym);
    expect(specReal).toBe('02--domain/010-test');
  });

  it('handles spec doc files through symlink', () => {
    // Create a spec.md file
    const specDocPath = path.join(realSpecsDir, '010-test', 'spec.md');
    fs.writeFileSync(specDocPath, '# Spec');

    const realPath = specDocPath;
    const symlinkPath = path.join(symlinkSpecsDir, '010-test', 'spec.md');

    const specReal = extractSpecFolder(realPath);
    const specSym = extractSpecFolder(symlinkPath);

    expect(specReal).toBe(specSym);
    expect(specReal).toBe('010-test');

    fs.unlinkSync(specDocPath);
  });

  it('UNC paths still handled correctly', () => {
    // UNC prefix is stripped before regex matching — should still work
    const uncPath = '//server/share/project/specs/010-test/memory/session.md';
    const result = extractSpecFolder(uncPath);
    expect(result).toBe('010-test');
  });

  it('already-canonical paths produce same result (no regression)', () => {
    const canonicalPath = '/project/specs/003-auth/memory/session.md';
    const result = extractSpecFolder(canonicalPath);
    expect(result).toBe('003-auth');
  });

  it('Windows backslash paths still work', () => {
    const winPath = 'C:\\project\\specs\\005-deploy\\memory\\note.md';
    const result = extractSpecFolder(winPath);
    expect(result).toBe('005-deploy');
  });

  it('non-standard path returns fallback', () => {
    const oddPath = '/some/random/path/memory/file.md';
    const result = extractSpecFolder(oddPath);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('getCanonicalPathKey — symlink consistency', () => {
  it('symlink and real path produce same canonical key', () => {
    const realPath = path.join(realSpecsDir, '010-test', 'memory', 'session.md');
    const symlinkPath = path.join(symlinkSpecsDir, '010-test', 'memory', 'session.md');

    const keyReal = getCanonicalPathKey(realPath);
    const keySym = getCanonicalPathKey(symlinkPath);

    expect(keyReal).toBe(keySym);
  });
});

// ───────────────────────────────────────────────────────────────
// P0: Inner symlink changes extracted spec_folder
// ───────────────────────────────────────────────────────────────
// The key bug: a symlink INSIDE /specs/ that aliases a spec folder name.
// Without canonicalization, extractSpecFolder returns the alias, not the real name.
describe('P0: Inner symlink changes extracted spec_folder', () => {
  let innerTmpRoot: string;

  beforeAll(() => {
    innerTmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'inner-sym-'));
    const realMemDir = path.join(innerTmpRoot, 'specs', '02--domain', '010-feature', 'memory');
    fs.mkdirSync(realMemDir, { recursive: true });
    fs.writeFileSync(path.join(realMemDir, 'ctx.md'), '# Context');
    // Symlink INSIDE specs: specs/current → 02--domain/010-feature
    fs.symlinkSync(
      path.join('02--domain', '010-feature'),
      path.join(innerTmpRoot, 'specs', 'current'),
    );
  });

  afterAll(() => { fs.rmSync(innerTmpRoot, { recursive: true, force: true }); });

  it('extractSpecFolder resolves inner symlink to real name', () => {
    const symPath = path.join(innerTmpRoot, 'specs', 'current', 'memory', 'ctx.md');
    const realPath = path.join(innerTmpRoot, 'specs', '02--domain', '010-feature', 'memory', 'ctx.md');
    expect(extractSpecFolder(symPath)).toBe(extractSpecFolder(realPath));
    expect(extractSpecFolder(symPath)).toBe('02--domain/010-feature');
  });

  it('naive regex WITHOUT canonicalization would return wrong result', () => {
    const symPath = path.join(innerTmpRoot, 'specs', 'current', 'memory', 'ctx.md')
      .replace(/\\/g, '/');
    const naiveMatch = symPath.match(/specs\/([^/]+(?:\/[^/]+)*?)\/memory\//);
    // Bug: naive extraction returns the symlink alias
    expect(naiveMatch?.[1]).toBe('current');
    // Fix: canonicalized extraction returns the real name
    expect(extractSpecFolder(path.join(innerTmpRoot, 'specs', 'current', 'memory', 'ctx.md')))
      .toBe('02--domain/010-feature');
  });

  it('atomic save through inner symlink resolves correctly', () => {
    const atomicPath = path.join(innerTmpRoot, 'specs', 'current', 'memory', 'pending.md');
    expect(extractSpecFolder(atomicPath)).toBe('02--domain/010-feature');
  });

  it('spec doc file through inner symlink resolves correctly', () => {
    const specDoc = path.join(innerTmpRoot, 'specs', '02--domain', '010-feature', 'spec.md');
    fs.writeFileSync(specDoc, '# Spec');
    try {
      const symDocPath = path.join(innerTmpRoot, 'specs', 'current', 'spec.md');
      expect(extractSpecFolder(symDocPath)).toBe('02--domain/010-feature');
    } finally { fs.unlinkSync(specDoc); }
  });
});

// ───────────────────────────────────────────────────────────────
// P2-1: Error handling specificity
// ───────────────────────────────────────────────────────────────
describe('P2-1: Error handling specificity', () => {
  let eloopTmpDir: string;

  beforeAll(() => {
    // Create a symlink loop to trigger ELOOP
    eloopTmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eloop-'));
    const linkA = path.join(eloopTmpDir, 'specs', '010-loop', 'memory');
    const linkB = path.join(eloopTmpDir, 'specs', '010-loop', 'bounce');
    fs.mkdirSync(path.join(eloopTmpDir, 'specs', '010-loop'), { recursive: true });
    // Create circular symlink: memory → bounce → memory
    fs.symlinkSync('bounce', linkA);
    fs.symlinkSync('memory', linkB);
  });

  afterAll(() => {
    fs.rmSync(eloopTmpDir, { recursive: true, force: true });
  });

  it('ELOOP returns resolved path without throwing', () => {
    const loopPath = path.join(eloopTmpDir, 'specs', '010-loop', 'memory', 'file.md');
    const result = canonicalizeForSpecFolderExtraction(loopPath);
    expect(typeof result).toBe('string');
    // Should not throw, should return a resolved path
    expect(result.length).toBeGreaterThan(0);
  });

  it('ENOENT still triggers parent-walk (atomic save)', () => {
    const atomicPath = path.join(realSpecsDir, '010-test', 'memory', 'not-yet.md');
    const result = canonicalizeForSpecFolderExtraction(atomicPath);
    expect(result).toContain('010-test/memory/not-yet.md');
  });
});

// ───────────────────────────────────────────────────────────────
// P2-2: Fallback uses normalized path
// ───────────────────────────────────────────────────────────────
describe('P2-2: Fallback uses normalized path', () => {
  it('backslash path in fallback returns forward-slash result', () => {
    const result = extractSpecFolder('C:\\projects\\myapp\\memory\\session.md');
    expect(result).not.toContain('\\');
  });
});

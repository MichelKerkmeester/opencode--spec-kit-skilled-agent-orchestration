// ───────────────────────────────────────────────────────────────
// P2-14: BOUNDARY TESTS — memorySequence in loadPerFolderDescription
// ───────────────────────────────────────────────────────────────
// Replaces tautological JS-runtime-only tests with tests that exercise
// actual implementation functions with boundary values.

import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import {
  loadPerFolderDescription,
  generatePerFolderDescription,
} from '../lib/search/folder-discovery';

describe('memorySequence boundary values in loadPerFolderDescription', () => {
  let tmpDir: string;

  const validBase = {
    specFolder: '010-boundary',
    description: 'Boundary test',
    keywords: ['boundary'],
    lastUpdated: new Date().toISOString(),
    specId: '010',
    folderSlug: 'boundary',
    parentChain: [],
    memoryNameHistory: [],
  };

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-boundary-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch { /* best effort */ }
  });

  it('memorySequence undefined — defaults to 0 via upgrade-on-read', () => {
    const data = { ...validBase };
    // omit memorySequence entirely
    fs.writeFileSync(path.join(tmpDir, 'description.json'), JSON.stringify(data));
    const result = loadPerFolderDescription(tmpDir);
    expect(result).not.toBeNull();
    expect(result!.memorySequence).toBe(0);
  });

  it('memorySequence NaN — accepted as typeof number, preserved as NaN', () => {
    const data = { ...validBase, memorySequence: NaN };
    // JSON.stringify converts NaN to null; string replace injects bare NaN literal, producing invalid JSON
    const jsonStr = JSON.stringify(data).replace('"memorySequence":null', '"memorySequence":NaN');
    fs.writeFileSync(path.join(tmpDir, 'description.json'), jsonStr);
    // JSON.parse rejects bare NaN — loadPerFolderDescription returns null
    const result = loadPerFolderDescription(tmpDir);
    expect(result).toBeNull();
  });

  it('memorySequence Infinity — rejected by JSON.parse (invalid JSON literal)', () => {
    const jsonStr = JSON.stringify(validBase).replace('}', ',"memorySequence":Infinity}');
    fs.writeFileSync(path.join(tmpDir, 'description.json'), jsonStr);
    // Infinity is not valid JSON — JSON.parse throws, loadPerFolderDescription returns null
    const result = loadPerFolderDescription(tmpDir);
    expect(result).toBeNull();
  });

  it('memorySequence 0 — accepted as valid boundary value', () => {
    const data = { ...validBase, memorySequence: 0 };
    fs.writeFileSync(path.join(tmpDir, 'description.json'), JSON.stringify(data));
    const result = loadPerFolderDescription(tmpDir);
    expect(result).not.toBeNull();
    expect(result!.memorySequence).toBe(0);
  });

  it('memorySequence negative — accepted by type check (typeof number)', () => {
    const data = { ...validBase, memorySequence: -5 };
    fs.writeFileSync(path.join(tmpDir, 'description.json'), JSON.stringify(data));
    const result = loadPerFolderDescription(tmpDir);
    expect(result).not.toBeNull();
    expect(result!.memorySequence).toBe(-5);
  });

  it('memorySequence string "5" — rejected by type check', () => {
    const data = { ...validBase, memorySequence: '5' };
    fs.writeFileSync(path.join(tmpDir, 'description.json'), JSON.stringify(data));
    const result = loadPerFolderDescription(tmpDir);
    expect(result).toBeNull();
  });

  it('memorySequence MAX_SAFE_INTEGER — accepted as valid number', () => {
    const data = { ...validBase, memorySequence: Number.MAX_SAFE_INTEGER };
    fs.writeFileSync(path.join(tmpDir, 'description.json'), JSON.stringify(data));
    const result = loadPerFolderDescription(tmpDir);
    expect(result).not.toBeNull();
    expect(result!.memorySequence).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('memorySequence null — rejected by type check (typeof null !== "number")', () => {
    const data = { ...validBase, memorySequence: null };
    fs.writeFileSync(path.join(tmpDir, 'description.json'), JSON.stringify(data));
    const result = loadPerFolderDescription(tmpDir);
    // null is parsed; memorySequence undefined check sees null !== undefined,
    // then typeof null === 'object' !== 'number' → rejected
    expect(result).toBeNull();
  });
});

describe('memorySequence preservation in generatePerFolderDescription', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-boundary-gen-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch { /* best effort */ }
  });

  it('defaults memorySequence to 0 when no existing description.json', () => {
    const specDir = path.join(tmpDir, '010-fresh');
    fs.mkdirSync(specDir, { recursive: true });
    fs.writeFileSync(path.join(specDir, 'spec.md'), '# Fresh Spec');

    const result = generatePerFolderDescription(specDir, tmpDir);
    expect(result).not.toBeNull();
    expect(result!.memorySequence).toBe(0);
    expect(result!.memoryNameHistory).toEqual([]);
  });

  it('preserves existing memorySequence on regeneration', () => {
    const specDir = path.join(tmpDir, '010-existing');
    fs.mkdirSync(specDir, { recursive: true });
    fs.writeFileSync(path.join(specDir, 'spec.md'), '# Existing Spec');
    fs.writeFileSync(path.join(specDir, 'description.json'), JSON.stringify({
      specFolder: '010-existing',
      description: 'Old description',
      keywords: ['old'],
      lastUpdated: new Date().toISOString(),
      specId: '010',
      folderSlug: 'existing',
      parentChain: [],
      memorySequence: 42,
      memoryNameHistory: ['a.md', 'b.md'],
    }));

    const result = generatePerFolderDescription(specDir, tmpDir);
    expect(result).not.toBeNull();
    expect(result!.memorySequence).toBe(42);
    expect(result!.memoryNameHistory).toEqual(['a.md', 'b.md']);
  });
});

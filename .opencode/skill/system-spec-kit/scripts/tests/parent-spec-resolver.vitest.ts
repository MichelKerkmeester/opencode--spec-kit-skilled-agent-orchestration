import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { resolveParentSpec } from '../core/memory-metadata';

describe('parent spec resolver', () => {
  it('returns the parent packet path for nested phase folders', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-parent-spec-'));

    try {
      const parentPath = path.join(tempRoot, 'parent');
      const childPath = path.join(parentPath, 'child');
      fs.mkdirSync(childPath, { recursive: true });
      fs.writeFileSync(path.join(parentPath, 'spec.md'), '# Parent\n', 'utf8');

      expect(resolveParentSpec(childPath, 'parent/child')).toBe('parent');
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it('returns an empty value for top-level packet folders', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-parent-spec-top-'));

    try {
      const specFolderPath = path.join(tempRoot, 'top-level');
      fs.mkdirSync(specFolderPath, { recursive: true });

      expect(resolveParentSpec(specFolderPath, 'top-level')).toBe('');
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});

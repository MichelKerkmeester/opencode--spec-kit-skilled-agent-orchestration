// ---------------------------------------------------------------
// TEST: File watcher path filtering
// ---------------------------------------------------------------

import { describe, expect, it } from 'vitest';

import { __testables } from '../lib/ops/file-watcher';

describe('file-watcher path filters', () => {
  it('does not treat .opencode as a hidden path', () => {
    expect(__testables.isDotfilePath('/workspace/.opencode/specs/001-test/spec.md')).toBe(false);
  });

  it('treats dotfiles as hidden paths', () => {
    expect(__testables.isDotfilePath('/workspace/specs/001-test/.DS_Store')).toBe(true);
    expect(__testables.isDotfilePath('/workspace/specs/001-test/.git/config')).toBe(true);
  });

  it('keeps directory paths watchable', () => {
    expect(__testables.shouldIgnoreWatchTarget('/workspace/.opencode/specs')).toBe(false);
    expect(__testables.shouldIgnoreWatchTarget('/workspace/specs')).toBe(false);
  });

  it('ignores non-markdown files and allows markdown files', () => {
    expect(__testables.shouldIgnoreWatchTarget('/workspace/specs/001-test/spec.md')).toBe(false);
    expect(__testables.shouldIgnoreWatchTarget('/workspace/specs/001-test/spec.txt')).toBe(true);
  });
});

import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  buildSessionScopedSaveContextPath,
  getSessionScopedSaveContextExample,
  isLegacySharedSaveContextPath,
} from '../core/save-context-path';

describe('save-context path helpers', () => {
  it('builds a session-scoped temp path from the session id', () => {
    expect(buildSessionScopedSaveContextPath('claude/session 123')).toBe(
      path.join(os.tmpdir(), 'save-context-data-claude-session-123.json'),
    );
  });

  it('returns a session-scoped example and flags only the legacy shared path', () => {
    expect(getSessionScopedSaveContextExample()).toBe(
      path.join(os.tmpdir(), 'save-context-data-<session-id>.json'),
    );
    expect(isLegacySharedSaveContextPath('/tmp/save-context-data.json')).toBe(true);
    expect(isLegacySharedSaveContextPath('/private/tmp/save-context-data.json')).toBe(true);
    expect(isLegacySharedSaveContextPath(path.join(os.tmpdir(), 'save-context-data-session-123.json'))).toBe(false);
    expect(isLegacySharedSaveContextPath(path.join(os.tmpdir(), 'context-data.json'))).toBe(false);
  });
});

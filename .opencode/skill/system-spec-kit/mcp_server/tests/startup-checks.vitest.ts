// ---------------------------------------------------------------
// TEST: STARTUP CHECKS
// ---------------------------------------------------------------

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { checkSqliteVersion } from '../startup-checks.js';

describe('Startup Checks', () => {

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // detectNodeVersionMismatch uses path.resolve(__dirname, ...) internally,
  // which cannot be intercepted in ESM without full module mocking.
  // The function's fs interactions are validated through checkSqliteVersion
  // and manual EX-022 scenarios. Direct unit tests for marker file I/O
  // would require refactoring the function to accept a configurable path.

  describe('checkSqliteVersion', () => {
    it('should log OK for version >= 3.35.0', () => {
      const mockDb = {
        prepare: () => ({ get: () => ({ version: '3.45.1' }) }),
      };
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('meets 3.35.0+ requirement'));
      consoleSpy.mockRestore();
    });

    it('should warn for version < 3.35.0', () => {
      const mockDb = {
        prepare: () => ({ get: () => ({ version: '3.34.0' }) }),
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('WARNING'));
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Minimum required: 3.35.0'));
      warnSpy.mockRestore();
    });

    it('should warn for major version < 3', () => {
      const mockDb = {
        prepare: () => ({ get: () => ({ version: '2.99.0' }) }),
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('WARNING'));
      warnSpy.mockRestore();
    });

    it('should handle query failure gracefully', () => {
      const mockDb = {
        prepare: () => ({ get: () => { throw new Error('database is locked'); } }),
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Could not determine SQLite version'));
      warnSpy.mockRestore();
    });

    it('should log exact version string in success message', () => {
      const mockDb = {
        prepare: () => ({ get: () => ({ version: '3.40.0' }) }),
      };
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('3.40.0'));
      consoleSpy.mockRestore();
    });

    it('should handle exact boundary version 3.35.0 as passing', () => {
      const mockDb = {
        prepare: () => ({ get: () => ({ version: '3.35.0' }) }),
      };
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('meets 3.35.0+ requirement'));
      expect(warnSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
      warnSpy.mockRestore();
    });
  });
});

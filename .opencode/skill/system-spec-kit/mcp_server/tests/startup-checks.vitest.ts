// TEST: STARTUP CHECKS
import fs from 'node:fs';
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  checkSqliteVersion,
  detectNodeVersionMismatch,
  detectRuntimeMismatch,
  type NodeVersionMarker,
} from '../startup-checks.js';

describe('Startup Checks', () => {

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('detectRuntimeMismatch', () => {
    const marker: NodeVersionMarker = {
      nodeVersion: 'v22.0.0',
      moduleVersion: '127',
      platform: 'darwin',
      arch: 'arm64',
      createdAt: '2026-03-12T00:00:00.000Z',
    };

    it('returns no mismatch when ABI, platform, and arch all match', () => {
      const result = detectRuntimeMismatch(marker, {
        nodeVersion: 'v22.2.0',
        moduleVersion: '127',
        platform: 'darwin',
        arch: 'arm64',
      });

      expect(result).toEqual({
        detected: false,
        reasons: [],
      });
    });

    it('reports module ABI changes', () => {
      const result = detectRuntimeMismatch(marker, {
        nodeVersion: 'v24.0.0',
        moduleVersion: '130',
        platform: 'darwin',
        arch: 'arm64',
      });

      expect(result.detected).toBe(true);
      expect(result.reasons).toContain('module ABI');
    });

    it('reports platform and architecture changes even when ABI matches', () => {
      const result = detectRuntimeMismatch(marker, {
        nodeVersion: 'v22.0.0',
        moduleVersion: '127',
        platform: 'linux',
        arch: 'x64',
      });

      expect(result.detected).toBe(true);
      expect(result.reasons).toEqual(['platform', 'architecture']);
    });
  });

  describe('detectNodeVersionMismatch', () => {
    it('warns when the marker ABI differs from the current runtime', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({
        nodeVersion: 'v0.0.0',
        moduleVersion: `${Number(process.versions.modules) + 1}`,
        platform: process.platform,
        arch: process.arch,
        createdAt: '2026-03-12T00:00:00.000Z',
      }));
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      detectNodeVersionMismatch();

      expect(warnSpy).toHaveBeenCalled();
      expect(warnSpy.mock.calls.flat().join(' ')).toContain('module ABI');
    });

    it('logs OK when the marker matches the current runtime', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({
        nodeVersion: process.version,
        moduleVersion: process.versions.modules,
        platform: process.platform,
        arch: process.arch,
        createdAt: '2026-03-12T00:00:00.000Z',
      }));
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      detectNodeVersionMismatch();

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Node runtime check: OK'));
      expect(warnSpy.mock.calls.flat().join(' ')).not.toContain('WARNING: Native runtime changed');
    });

    it('creates a marker file when one does not exist', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const writeSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      detectNodeVersionMismatch();

      expect(writeSpy).toHaveBeenCalled();
      expect(String(writeSpy.mock.calls[0]?.[1])).toContain(process.versions.modules);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Created .node-version-marker'));
    });
  });

  describe('checkSqliteVersion', () => {
    it('should log OK for version >= 3.35.0', () => {
      const mockDb = {
        prepare: () => ({ get: () => ({ version: '3.45.1' }) }),
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('meets 3.35.0+ requirement'));
      warnSpy.mockRestore();
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
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('3.40.0'));
      warnSpy.mockRestore();
    });

    it('should handle exact boundary version 3.35.0 as passing', () => {
      const mockDb = {
        prepare: () => ({ get: () => ({ version: '3.35.0' }) }),
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('meets 3.35.0+ requirement'));
      expect(warnSpy.mock.calls.flat().join(' ')).not.toContain('WARNING: SQLite version');
      warnSpy.mockRestore();
    });

    it('should warn on malformed SQLite version strings', () => {
      const mockDb = {
        prepare: () => ({ get: () => ({ version: '3.x' }) }),
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('unexpected version format'));
      warnSpy.mockRestore();
    });

    it('should handle non-Error throwables gracefully', () => {
      const mockDb = {
        prepare: () => ({ get: () => { throw 'database offline'; } }),
      };
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      checkSqliteVersion(mockDb);

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('database offline'));
      warnSpy.mockRestore();
    });
  });
});

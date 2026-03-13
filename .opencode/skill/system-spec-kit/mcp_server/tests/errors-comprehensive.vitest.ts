// TEST: ERRORS COMPREHENSIVE
import { describe, it, expect } from 'vitest';
import {
  ErrorCodes, MemoryError, withTimeout, userFriendlyError,
  isTransientError, isPermanentError, buildErrorResponse,
  createErrorWithHint,
} from '../lib/errors/core';
import {
  ERROR_CODES, RECOVERY_HINTS, DEFAULT_HINT,
  TOOL_SPECIFIC_HINTS, getRecoveryHint, hasSpecificHint,
  getAvailableHints, getErrorCodes,
} from '../lib/errors/recovery-hints';

/* =============================================================
   A. ErrorCodes (core.ts legacy re-export)
============================================================= */

describe('A. ErrorCodes (core.ts)', () => {
  it('A1: ErrorCodes is an object', () => {
    expect(ErrorCodes).toBeTruthy();
    expect(typeof ErrorCodes).toBe('object');
  });

  it('A2: ErrorCodes has expected keys', () => {
    const expected = [
      'EMBEDDING_FAILED', 'FILE_NOT_FOUND', 'DB_CONNECTION_FAILED',
      'INVALID_PARAMETER', 'SEARCH_FAILED', 'RATE_LIMITED',
    ];
    for (const key of expected) {
      expect(key in ErrorCodes).toBe(true);
    }
  });

  it('A3: All ErrorCodes values are E-prefixed strings', () => {
    const values = Object.values(ErrorCodes) as string[];
    for (const v of values) {
      expect(typeof v).toBe('string');
      expect(v.startsWith('E')).toBe(true);
    }
  });

  it('A4: ErrorCodes has >=15 entries', () => {
    const count = Object.keys(ErrorCodes).length;
    expect(count).toBeGreaterThanOrEqual(15);
  });

  it('A5: ErrorCodes values are unique', () => {
    const values = Object.values(ErrorCodes) as string[];
    const unique = new Set(values);
    expect(values.length).toBe(unique.size);
  });
});

/* =============================================================
   B. MemoryError class
============================================================= */

describe('B. MemoryError class', () => {
  it('B1: MemoryError extends Error', () => {
    const err = new MemoryError('E030', 'test msg', { key: 'val' });
    expect(err).toBeInstanceOf(Error);
  });

  it('B2: instanceof MemoryError works', () => {
    const err = new MemoryError('E030', 'test msg');
    expect(err).toBeInstanceOf(MemoryError);
  });

  it('B3: MemoryError.name is "MemoryError"', () => {
    const err = new MemoryError('E030', 'test msg');
    expect(err.name).toBe('MemoryError');
  });

  it('B4: MemoryError.code set correctly', () => {
    const err = new MemoryError('E042', 'query too long');
    expect(err.code).toBe('E042');
  });

  it('B5: MemoryError.message set correctly', () => {
    const err = new MemoryError('E010', 'file missing');
    expect(err.message).toBe('file missing');
  });

  it('B6: MemoryError.details set correctly', () => {
    const details = { path: '/tmp/test.md', size: 1024 };
    const err = new MemoryError('E010', 'not found', details);
    expect(err.details).toEqual(details);
  });

  it('B7: MemoryError.details defaults to {}', () => {
    const err = new MemoryError('E010', 'no details');
    expect(err.details).toEqual({});
  });

  it('B8: MemoryError has toJSON method', () => {
    const err = new MemoryError('E030', 'test');
    expect(typeof err.toJSON).toBe('function');
  });

  it('B9: toJSON returns { code, message, details }', () => {
    const err = new MemoryError('E030', 'test msg', { x: 1 });
    const json = err.toJSON();
    expect(json.code).toBe('E030');
    expect(json.message).toBe('test msg');
    expect(json.details).toEqual({ x: 1 });
  });

  it('B10: recoveryHint undefined by default', () => {
    const err = new MemoryError('E030', 'test');
    expect(err.recoveryHint).toBeUndefined();
  });

  it('B11: MemoryError has stack trace', () => {
    const err = new MemoryError('E030', 'test');
    expect(err.stack).toBeTruthy();
    expect(err.stack!.length).toBeGreaterThan(0);
  });
});

/* =============================================================
   C. withTimeout
============================================================= */

describe('C. withTimeout', () => {
  it('C1: Resolves when promise resolves before timeout', async () => {
    const result = await withTimeout(Promise.resolve(42), 1000, 'test-op');
    expect(result).toBe(42);
  });

  it('C2: Rejects when timeout exceeded', async () => {
    const slow = new Promise(r => setTimeout(() => r('late'), 500));
    await expect(withTimeout(slow, 10, 'slow-op')).rejects.toThrow(/timed out/);
  });

  it('C3: Timeout error has SEARCH_FAILED code (E040)', async () => {
    const slow = new Promise(r => setTimeout(() => r('late'), 500));
    try {
      await withTimeout(slow, 10, 'my-operation');
      expect.unreachable('Should have thrown');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(MemoryError);
      if (e instanceof MemoryError) {
        expect(e.code === ErrorCodes.SEARCH_FAILED || e.code === 'E040').toBe(true);
      }
    }
  });

  it('C4: Timeout error message includes operation name', async () => {
    const slow = new Promise(r => setTimeout(() => r('late'), 500));
    await expect(withTimeout(slow, 10, 'my-operation')).rejects.toThrow(/my-operation/);
  });

  it('C5: Passes through original rejection', async () => {
    const failing = Promise.reject(new Error('original failure'));
    await expect(withTimeout(failing, 5000, 'fail-op')).rejects.toThrow('original failure');
  });

  it('C6: Timeout error is MemoryError instance', async () => {
    const slow = new Promise(r => setTimeout(() => r('late'), 500));
    try {
      await withTimeout(slow, 25, 'timeout-test');
      expect.unreachable('Should have thrown');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(MemoryError);
    }
  });

  it('C7: Timeout error includes details (timeout, operation)', async () => {
    const slow = new Promise(r => setTimeout(() => r('late'), 500));
    try {
      await withTimeout(slow, 15, 'details-test');
      expect.unreachable('Should have thrown');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(MemoryError);
      if (e instanceof MemoryError) {
        expect(e.details).toBeTruthy();
        expect(e.details.timeout).toBeTruthy();
        expect(e.details.operation).toBeTruthy();
      }
    }
  });
});

/* =============================================================
   D. userFriendlyError
============================================================= */

describe('D. userFriendlyError', () => {
  it('D1: SQLITE_BUSY -> "temporarily busy"', () => {
    const msg = userFriendlyError(new Error('SQLITE_BUSY: database is locked'));
    expect(msg).toContain('temporarily busy');
  });

  it('D2: SQLITE_LOCKED -> "locked"', () => {
    const msg = userFriendlyError(new Error('SQLITE_LOCKED'));
    expect(msg).toContain('locked');
  });

  it('D3: ENOENT -> "File not found."', () => {
    const msg = userFriendlyError(new Error('ENOENT: no such file'));
    expect(msg).toBe('File not found.');
  });

  it('D4: EACCES -> "Permission denied."', () => {
    const msg = userFriendlyError(new Error('EACCES: permission denied'));
    expect(msg).toBe('Permission denied.');
  });

  it('D5: ECONNREFUSED -> "Connection refused"', () => {
    const msg = userFriendlyError(new Error('ECONNREFUSED'));
    expect(msg).toContain('Connection refused');
  });

  it('D6: ETIMEDOUT -> "timed out"', () => {
    const msg = userFriendlyError(new Error('ETIMEDOUT'));
    expect(msg).toContain('timed out');
  });

  it('D7: embedding failed -> includes "embedding"', () => {
    const msg = userFriendlyError(new Error('embedding generation failed'));
    expect(msg).toContain('embedding');
  });

  it('D8: Unknown error -> generic message (no internal details leaked)', () => {
    const msg = userFriendlyError(new Error('something totally unknown'));
    expect(msg.toLowerCase()).toContain('unexpected error');
    // P2-09: raw error details must NOT leak to the caller
    expect(msg).not.toContain('something totally unknown');
  });
});

/* =============================================================
   E. isTransientError / isPermanentError
============================================================= */

describe('E. isTransientError / isPermanentError', () => {
  it('E1: SQLITE_BUSY is transient', () => {
    expect(isTransientError(new Error('SQLITE_BUSY'))).toBe(true);
  });

  it('E2: ETIMEDOUT is transient', () => {
    expect(isTransientError(new Error('ETIMEDOUT: connection timed out'))).toBe(true);
  });

  it('E3: "rate limit" is transient', () => {
    expect(isTransientError(new Error('rate limit exceeded'))).toBe(true);
  });

  it('E4: ECONNRESET is transient', () => {
    expect(isTransientError(new Error('ECONNRESET'))).toBe(true);
  });

  it('E5: "temporarily unavailable" is transient', () => {
    expect(isTransientError(new Error('service temporarily unavailable'))).toBe(true);
  });

  it('E6: "unauthorized" is permanent', () => {
    expect(isPermanentError(new Error('unauthorized access'))).toBe(true);
  });

  it('E7: "invalid api key" is permanent', () => {
    expect(isPermanentError(new Error('invalid api key provided'))).toBe(true);
  });

  it('E8: "forbidden" is permanent', () => {
    expect(isPermanentError(new Error('forbidden: access denied'))).toBe(true);
  });

  it('E9: Normal error is neither transient nor permanent', () => {
    const err = new Error('just a normal error');
    expect(isTransientError(err)).toBe(false);
    expect(isPermanentError(err)).toBe(false);
  });

  it('E10: "authentication failed" is permanent', () => {
    expect(isPermanentError(new Error('authentication failed'))).toBe(true);
  });
});

/* =============================================================
   F. buildErrorResponse
============================================================= */

describe('F. buildErrorResponse', () => {
  it('F1: Response has summary, data, hints, meta', () => {
    const err = new MemoryError('E040', 'search failed', { q: 'test' });
    const resp = buildErrorResponse('memory_search', err);
    expect('summary' in resp).toBe(true);
    expect('data' in resp).toBe(true);
    expect('hints' in resp).toBe(true);
    expect('meta' in resp).toBe(true);
  });

  it('F2: summary starts with "Error:"', () => {
    const err = new MemoryError('E040', 'query failed');
    const resp = buildErrorResponse('memory_search', err);
    expect(resp.summary.startsWith('Error:')).toBe(true);
  });

  it('F3: data has error, code, details', () => {
    const err = new MemoryError('E040', 'query failed', { q: 'test' });
    const resp = buildErrorResponse('memory_search', err);
    expect(resp.data.error).toBe('query failed');
    expect(resp.data.code).toBe('E040');
    expect(resp.data.details).toBeDefined();
  });

  it('F4: meta has tool, isError=true, severity', () => {
    const err = new MemoryError('E040', 'test');
    const resp = buildErrorResponse('memory_search', err);
    expect(resp.meta.tool).toBe('memory_search');
    expect(resp.meta.isError).toBe(true);
    expect(typeof resp.meta.severity).toBe('string');
  });

  it('F5: hints is an array', () => {
    const err = new MemoryError('E040', 'test');
    const resp = buildErrorResponse('memory_search', err);
    expect(Array.isArray(resp.hints)).toBe(true);
  });

  it('F6: Plain Error falls back to SEARCH_FAILED code', () => {
    const plainErr = new Error('plain error');
    const resp = buildErrorResponse('some_tool', plainErr, { extra: 'info' });
    expect(resp.data.code).toBe('E040');
  });

  it('F7: Tool-specific hints included for memory_search + E001', () => {
    const err = new MemoryError('E001', 'embed fail');
    const resp = buildErrorResponse('memory_search', err);
    expect(resp.hints.length).toBeGreaterThan(0);
  });
});

/* =============================================================
   G. createErrorWithHint
============================================================= */

describe('G. createErrorWithHint', () => {
  it('G1: Returns MemoryError instance', () => {
    const err = createErrorWithHint('E030', 'bad param', { field: 'query' });
    expect(err).toBeInstanceOf(MemoryError);
  });

  it('G2: Has correct code, message, details', () => {
    const err = createErrorWithHint('E030', 'bad param', { field: 'query' });
    expect(err.code).toBe('E030');
    expect(err.message).toBe('bad param');
    expect(err.details).toEqual({ field: 'query' });
  });

  it('G3: recoveryHint attached when toolName provided', () => {
    const err = createErrorWithHint('E040', 'fail', {}, 'memory_search');
    expect(err.recoveryHint).toBeDefined();
    expect(typeof err.recoveryHint!.hint).toBe('string');
  });

  it('G4: No recoveryHint when toolName is null', () => {
    const err = createErrorWithHint('E040', 'fail', {}, null);
    expect(err.recoveryHint).toBeUndefined();
  });
});

/* =============================================================
   H. ERROR_CODES (recovery-hints.ts)
============================================================= */

describe('H. ERROR_CODES (recovery-hints.ts)', () => {
  it('H1: ERROR_CODES has >=40 entries', () => {
    expect(typeof ERROR_CODES).toBe('object');
    const count = Object.keys(ERROR_CODES).length;
    expect(count).toBeGreaterThanOrEqual(40);
  });

  it('H2: ERROR_CODES covers all categories', () => {
    const categories = [
      'EMBEDDING_FAILED', 'FILE_NOT_FOUND', 'DB_CONNECTION_FAILED',
      'INVALID_PARAMETER', 'SEARCH_FAILED', 'API_KEY_INVALID_STARTUP',
      'CHECKPOINT_NOT_FOUND', 'SESSION_EXPIRED', 'MEMORY_NOT_FOUND',
      'VALIDATION_FAILED', 'CAUSAL_EDGE_NOT_FOUND', 'RATE_LIMITED',
    ];
    for (const key of categories) {
      expect(key in ERROR_CODES).toBe(true);
    }
  });

  it('H3: All ERROR_CODES values are E-prefixed strings', () => {
    for (const [key, val] of Object.entries(ERROR_CODES)) {
      expect(typeof val).toBe('string');
      expect((val as string).startsWith('E')).toBe(true);
    }
  });

  it('H4: ERROR_CODES values are unique', () => {
    const values = Object.values(ERROR_CODES) as string[];
    const unique = new Set(values);
    expect(values.length).toBe(unique.size);
  });
});

/* =============================================================
   I. RECOVERY_HINTS
============================================================= */

describe('I. RECOVERY_HINTS', () => {
  it('I1: RECOVERY_HINTS has >=30 entries', () => {
    const hintKeys = Object.keys(RECOVERY_HINTS);
    expect(hintKeys.length).toBeGreaterThanOrEqual(30);
  });

  it('I2: Every hint has hint, actions[], severity', () => {
    for (const [, hint] of Object.entries(RECOVERY_HINTS)) {
      expect(typeof hint.hint).toBe('string');
      expect(Array.isArray(hint.actions)).toBe(true);
      expect(typeof hint.severity).toBe('string');
    }
  });

  it('I3: All severities are low|medium|high|critical', () => {
    const validSeverities = new Set(['low', 'medium', 'high', 'critical']);
    for (const [, hint] of Object.entries(RECOVERY_HINTS)) {
      expect(validSeverities.has(hint.severity)).toBe(true);
    }
  });

  it('I4: Most ERROR_CODES have RECOVERY_HINTS', () => {
    const codeValues = Object.values(ERROR_CODES) as string[];
    const hintKeys = new Set(Object.keys(RECOVERY_HINTS));
    const missing: string[] = [];
    for (const code of codeValues) {
      if (!hintKeys.has(code)) missing.push(code);
    }
    expect(missing.length).toBeLessThanOrEqual(2);
  });
});

/* =============================================================
   J. DEFAULT_HINT
============================================================= */

describe('J. DEFAULT_HINT', () => {
  it('J1: DEFAULT_HINT has hint, actions[], severity', () => {
    expect(typeof DEFAULT_HINT.hint).toBe('string');
    expect(Array.isArray(DEFAULT_HINT.actions)).toBe(true);
    expect(typeof DEFAULT_HINT.severity).toBe('string');
  });

  it('J2: DEFAULT_HINT actions reference memory_health()', () => {
    const actionsStr = DEFAULT_HINT.actions.join(' ');
    expect(actionsStr).toContain('memory_health');
  });

  it('J3: DEFAULT_HINT severity is "medium"', () => {
    expect(DEFAULT_HINT.severity).toBe('medium');
  });
});

/* =============================================================
   K. TOOL_SPECIFIC_HINTS
============================================================= */

describe('K. TOOL_SPECIFIC_HINTS', () => {
  it('K1: TOOL_SPECIFIC_HINTS has >=3 tools', () => {
    expect(typeof TOOL_SPECIFIC_HINTS).toBe('object');
    const tools = Object.keys(TOOL_SPECIFIC_HINTS);
    expect(tools.length).toBeGreaterThanOrEqual(3);
  });

  it('K2: Has memory_search, checkpoint_restore, memory_save', () => {
    expect('memory_search' in TOOL_SPECIFIC_HINTS).toBe(true);
    expect('checkpoint_restore' in TOOL_SPECIFIC_HINTS).toBe(true);
    expect('memory_save' in TOOL_SPECIFIC_HINTS).toBe(true);
  });

  it('K3: Tool-specific hints have correct structure', () => {
    const searchHints = TOOL_SPECIFIC_HINTS['memory_search'];
    expect(typeof searchHints).toBe('object');
    const codes = Object.keys(searchHints);
    expect(codes.length).toBeGreaterThanOrEqual(1);
    for (const [, hint] of Object.entries(searchHints)) {
      expect(typeof hint.hint).toBe('string');
      expect(Array.isArray(hint.actions)).toBe(true);
    }
  });
});

/* =============================================================
   L. getRecoveryHint
============================================================= */

describe('L. getRecoveryHint', () => {
  it('L1: Returns tool-specific hint for memory_search + E001', () => {
    const hint = getRecoveryHint('memory_search', 'E001');
    expect(
      hint.hint.includes('Semantic search') || hint.hint.includes('search')
    ).toBe(true);
  });

  it('L2: Falls back to generic hint for unknown tool', () => {
    const hint = getRecoveryHint('unknown_tool', 'E010');
    expect(
      hint.hint.includes('file') || hint.hint.includes('File')
    ).toBe(true);
  });

  it('L3: Returns DEFAULT_HINT for unknown error code', () => {
    const hint = getRecoveryHint('unknown_tool', 'E999');
    expect(hint.hint).toBe(DEFAULT_HINT.hint);
  });

  it('L4: Returned hint has { hint, actions, severity }', () => {
    const hint = getRecoveryHint('memory_search', 'E040');
    expect(typeof hint.hint).toBe('string');
    expect(Array.isArray(hint.actions)).toBe(true);
    expect(typeof hint.severity).toBe('string');
  });
});

/* =============================================================
   M. hasSpecificHint
============================================================= */

describe('M. hasSpecificHint', () => {
  it('M1: Returns true for known tool+code (memory_search, E001)', () => {
    expect(hasSpecificHint('memory_search', 'E001')).toBe(true);
  });

  it('M2: Returns false for unknown tool+code', () => {
    expect(hasSpecificHint('nonexistent_tool', 'E999')).toBe(false);
  });

  it('M3: Returns true for generic error code (E010)', () => {
    expect(hasSpecificHint('any_tool', 'E010')).toBe(true);
  });
});

/* =============================================================
   N. getAvailableHints
============================================================= */

describe('N. getAvailableHints', () => {
  it('N1: getAvailableHints returns merged hints', () => {
    const hints = getAvailableHints('memory_search');
    expect(typeof hints).toBe('object');
    const count = Object.keys(hints).length;
    expect(count).toBeGreaterThanOrEqual(30);
  });

  it('N2: Tool-specific hints override generic in merged result', () => {
    const hints = getAvailableHints('memory_search');
    if (hints['E001']) {
      expect(
        hints['E001'].hint.includes('Semantic search') || hints['E001'].hint.includes('keyword')
      ).toBe(true);
    }
  });

  it('N3: Unknown tool returns only generic hints', () => {
    const hints = getAvailableHints('nonexistent_tool');
    const count = Object.keys(hints).length;
    expect(count).toBe(Object.keys(RECOVERY_HINTS).length);
  });
});

/* =============================================================
   O. getErrorCodes
============================================================= */

describe('O. getErrorCodes', () => {
  it('O1: getErrorCodes returns ERROR_CODES object', () => {
    const codes = getErrorCodes();
    expect(typeof codes).toBe('object');
    expect(Object.keys(codes).length).toBeGreaterThanOrEqual(40);
  });

  it('O2: getErrorCodes() === ERROR_CODES', () => {
    const codes = getErrorCodes();
    expect(codes).toEqual(ERROR_CODES);
  });
});

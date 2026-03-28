import { describe, expect, it } from 'vitest';
import {
  buildErrorResponse,
  ErrorCodes,
  getDefaultErrorCodeForTool,
  MemoryError,
  sanitizeErrorField,
} from '../lib/errors/core';

describe('sanitizeErrorField', () => {
  it('redacts sk provider keys', () => {
    const sanitized = sanitizeErrorField('Provider rejected sk-abcdefghijklmnopqrstuvwxyz123456');
    expect(sanitized).toBe('Provider rejected [REDACTED]');
  });

  it('redacts voy provider keys', () => {
    const sanitized = sanitizeErrorField('Embedding failed for voy_abcdefghijklmnopqrstuvwxyz123456');
    expect(sanitized).toBe('Embedding failed for [REDACTED]');
  });

  it('redacts bearer tokens', () => {
    const sanitized = sanitizeErrorField('Authorization header Bearer abc.def-ghi_jkl');
    expect(sanitized).toBe('Authorization header Bearer [REDACTED]');
  });

  it('redacts key assignment patterns', () => {
    const sanitized = sanitizeErrorField(
      'Request used key=abcdefghijklmnopqrstuvwxyz123456 and key: mnopqrstuvwxyz123456abcdefghi'
    );
    expect(sanitized).toBe('Request used key=[REDACTED] and key=[REDACTED]');
  });

  it('preserves non-sensitive messages', () => {
    const message = 'Provider request timed out after 5000ms';
    expect(sanitizeErrorField(message)).toBe(message);
  });
});

describe('buildErrorResponse', () => {
  it('sanitizes error fields in the response envelope', () => {
    const error = new MemoryError(
      ErrorCodes.API_KEY_INVALID_RUNTIME,
      'Auth failed for sk-abcdefghijklmnopqrstuvwxyz123456 using Bearer abc.def-ghi_jkl',
      {
        providerMessage: 'Voyage rejected voy_abcdefghijklmnopqrstuvwxyz123456',
        config: 'key=abcdefghijklmnopqrstuvwxyz123456',
      }
    );

    const response = buildErrorResponse('memory_search', error);

    expect(response.summary).toBe('Error: Auth failed for [REDACTED] using Bearer [REDACTED]');
    expect(response.data.error).toBe('Auth failed for [REDACTED] using Bearer [REDACTED]');
    expect(response.data.details).toEqual({
      providerMessage: 'Voyage rejected [REDACTED]',
      config: 'key=[REDACTED]',
    });
  });

  it('sanitizes nested objects in details', () => {
    const error = new MemoryError(
      ErrorCodes.API_KEY_INVALID_RUNTIME,
      'Auth error',
      {
        nested: { auth: 'Bearer eyJhbGciOiJIUzI1NiJ9.payload.sig', key: 'sk-abcdefghijklmnopqrstuvwxyz123456' },
      }
    );
    const response = buildErrorResponse('memory_search', error);
    const details = response.data.details as Record<string, unknown>;
    const nested = details.nested as Record<string, unknown>;
    expect(nested.auth).toBe('Bearer [REDACTED]');
    expect(nested.key).toBe('[REDACTED]');
  });

  it('sanitizes arrays in details', () => {
    const error = new MemoryError(
      ErrorCodes.API_KEY_INVALID_RUNTIME,
      'Auth error',
      {
        keys: ['voy_abcdefghijklmnopqrstuvwxyz123456', 'safe-value'],
      }
    );
    const response = buildErrorResponse('memory_search', error);
    const details = response.data.details as Record<string, unknown>;
    const keys = details.keys as string[];
    expect(keys[0]).toBe('[REDACTED]');
    expect(keys[1]).toBe('safe-value');
  });

  it('maps non-search tools to domain-specific default error codes', () => {
    expect(getDefaultErrorCodeForTool('memory_save')).toBe('E081');
    expect(getDefaultErrorCodeForTool('memory_drift_why')).toBe('E105');
    expect(getDefaultErrorCodeForTool('memory_causal_stats')).toBe('E104');
  });

  it('uses generic public messaging for plain internal exceptions', () => {
    const response = buildErrorResponse(
      'memory_causal_stats',
      new Error('SQLITE_ERROR: no such table at /tmp/private/context-index.sqlite'),
    );

    expect(response.data.code).toBe('E104');
    expect(response.summary).toBe('Error: An unexpected error occurred. Please check logs for details.');
    expect(response.data.error).toBe('An unexpected error occurred. Please check logs for details.');
    expect(JSON.stringify(response)).not.toContain('/tmp/private/context-index.sqlite');
  });
});

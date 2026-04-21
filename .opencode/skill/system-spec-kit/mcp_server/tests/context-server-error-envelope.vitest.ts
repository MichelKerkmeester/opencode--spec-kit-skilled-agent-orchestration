import { describe, expect, it } from 'vitest';

import { buildErrorResponse } from '../lib/errors/core.js';
import { wrapForMCP, createMCPErrorResponse } from '../lib/response/envelope.js';

describe('context-server error envelope handling', () => {
  it('buildErrorResponse produces a structured error object with data.error and hints', () => {
    const err = new Error('something broke');
    const response = buildErrorResponse('memory_search', err, { input: 'test' });

    expect(response).toBeDefined();
    expect(typeof response).toBe('object');
    expect(response).toHaveProperty('summary');
    expect(response).toHaveProperty('data');
    expect(response.data).toHaveProperty('error');
    expect(response.data.error).toBe('An unexpected error occurred. Please check logs for details.');
    expect(response).toHaveProperty('hints');
    expect(Array.isArray(response.hints)).toBe(true);
  });

  it('wrapForMCP wraps an error response into MCP content format', () => {
    const err = new Error('test error');
    const errorResponse = buildErrorResponse('memory_context', err, {});
    const wrapped = wrapForMCP(errorResponse as never, true);

    expect(wrapped).toHaveProperty('content');
    expect(Array.isArray(wrapped.content)).toBe(true);
    expect(wrapped.content[0]).toHaveProperty('type', 'text');
    expect(typeof wrapped.content[0].text).toBe('string');
    // The wrapped text should be valid JSON
    expect(() => JSON.parse(wrapped.content[0].text)).not.toThrow();
  });

  it('createMCPErrorResponse produces a fallback MCP error when envelope building fails', () => {
    const fallback = createMCPErrorResponse({
      error: 'Failed to build MCP error envelope',
      code: 'ENVELOPE_BUILD_FAILURE',
    });

    expect(fallback).toHaveProperty('content');
    expect(Array.isArray(fallback.content)).toBe(true);
    const parsed = JSON.parse(fallback.content[0].text);
    expect(parsed.error || parsed.data?.error).toBeDefined();
  });
});

import { describe, it, expect } from 'vitest';
import * as handler from '../handlers/memory-crud';
import type { HealthArgs } from '../handlers/memory-crud-types';

/** Parse the JSON response text from an MCP response. */
function parseResponse(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

function getErrorMessage(parsed: Record<string, unknown>) {
  const data = parsed.data as { error?: unknown } | undefined;
  return (typeof data?.error === 'string' ? data.error : parsed.error) as string | undefined;
}

function getDetails(parsed: Record<string, unknown>) {
  const data = parsed.data as { details?: Record<string, unknown> } | undefined;
  return (data?.details ?? parsed.details) as Record<string, unknown> | undefined;
}

describe('handleMemoryHealth Edge Cases (T007b)', () => {
  it('T007b-H1: Invalid reportMode returns error response with requestId', async () => {
    const result = await handler.handleMemoryHealth({ reportMode: 'not-valid' } as unknown as HealthArgs);
    const parsed = parseResponse(result);
    const error = getErrorMessage(parsed);
    const details = getDetails(parsed);
    expect(error).toMatch(/Invalid reportMode/);
    expect(details?.requestId).toBeDefined();
    expect(typeof details?.requestId).toBe('string');
  });

  it('T007b-H2: Zero limit returns error response with requestId', async () => {
    const result = await handler.handleMemoryHealth({ reportMode: 'divergent_aliases', limit: 0 });
    const parsed = parseResponse(result);
    const error = getErrorMessage(parsed);
    const details = getDetails(parsed);
    expect(error).toMatch(/limit must be a positive number/);
    expect(details?.requestId).toBeDefined();
  });

  it('T007b-H3: Negative limit returns error response', async () => {
    const result = await handler.handleMemoryHealth({ limit: -5 } as HealthArgs);
    const parsed = parseResponse(result);
    expect(getErrorMessage(parsed)).toMatch(/limit must be a positive number/);
  });

  it('T007b-H4: Non-boolean autoRepair returns error with requestId', async () => {
    const result = await handler.handleMemoryHealth({ autoRepair: 'yes' } as unknown as HealthArgs);
    const parsed = parseResponse(result);
    const error = getErrorMessage(parsed);
    const details = getDetails(parsed);
    expect(error).toMatch(/autoRepair must be a boolean/);
    expect(details?.requestId).toBeDefined();
  });

  it('T007b-H5: Non-boolean confirmed returns error', async () => {
    const result = await handler.handleMemoryHealth({ confirmed: 1 } as unknown as HealthArgs);
    const parsed = parseResponse(result);
    expect(getErrorMessage(parsed)).toMatch(/confirmed must be a boolean/);
  });

  it('T007b-H6: Non-string specFolder returns error with requestId', async () => {
    const result = await handler.handleMemoryHealth({ specFolder: 42 } as unknown as HealthArgs);
    const parsed = parseResponse(result);
    const error = getErrorMessage(parsed);
    const details = getDetails(parsed);
    expect(error).toMatch(/specFolder must be a string/);
    expect(details?.requestId).toBeDefined();
  });

  it('T007b-H7: divergent_aliases reportMode does not error on validation', async () => {
    try {
      const result = await handler.handleMemoryHealth({ reportMode: 'divergent_aliases' });
      const parsed = parseResponse(result);
      // Should either succeed or hit DB error, not validation error
      expect(getErrorMessage(parsed) ?? '').not.toMatch(/Invalid reportMode/);
    } catch (error: unknown) {
      expect(String(error)).toMatch(/database|DB|getDb/i);
    }
  });

  it('T007b-H8: Empty args accepted (defaults)', async () => {
    try {
      const result = await handler.handleMemoryHealth({});
      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
    } catch (error: unknown) {
      expect(String(error)).toMatch(/database|DB|getDb/i);
    }
  });
});

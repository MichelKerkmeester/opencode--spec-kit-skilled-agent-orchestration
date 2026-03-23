import { afterAll, afterEach, beforeAll, beforeEach, describe, it, expect, vi } from 'vitest';
import * as handler from '../handlers/memory-crud';
import * as core from '../core';
import * as vectorIndex from '../lib/search/vector-index';
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

beforeAll(() => {
  vectorIndex.closeDb();
  vectorIndex.initializeDb(':memory:');
});

afterAll(() => {
  vectorIndex.closeDb();
});

beforeEach(() => {
  vi.spyOn(core, 'checkDatabaseUpdated').mockResolvedValue(false);
});

afterEach(() => {
  vi.restoreAllMocks();
});

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
    const error = getErrorMessage(parsed);
    const details = getDetails(parsed);
    expect(error).toMatch(/limit must be a positive number/);
    expect(details?.requestId).toBeDefined();
    expect(typeof details?.requestId).toBe('string');
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
    const error = getErrorMessage(parsed);
    const details = getDetails(parsed);
    expect(error).toMatch(/confirmed must be a boolean/);
    expect(details?.requestId).toBeDefined();
    expect(typeof details?.requestId).toBe('string');
  });

  it('T007b-H6: Non-string specFolder returns error with requestId', async () => {
    const result = await handler.handleMemoryHealth({ specFolder: 42 } as unknown as HealthArgs);
    const parsed = parseResponse(result);
    const error = getErrorMessage(parsed);
    const details = getDetails(parsed);
    expect(error).toMatch(/specFolder must be a string/);
    expect(details?.requestId).toBeDefined();
  });

  it('T007b-H7: divergent_aliases reportMode returns compact success payload', async () => {
    const result = await handler.handleMemoryHealth({ reportMode: 'divergent_aliases' });
    const parsed = parseResponse(result);
    expect(result.isError).toBe(false);
    expect(parsed.data.reportMode).toBe('divergent_aliases');
    expect(parsed.data.limit).toBe(20);
    expect(Array.isArray(parsed.data.groups)).toBe(true);
  });

  it('T007b-H8: Empty args return the default full health payload', async () => {
    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);
    expect(result.isError).toBe(false);
    expect(parsed.data.reportMode).toBe('full');
    expect(typeof parsed.data.status).toBe('string');
    expect(typeof parsed.data.databaseConnected).toBe('boolean');
    expect(parsed.data.aliasConflicts).toBeDefined();
  });

  it('T007b-H8b: autoRepair without confirmed returns confirmation-only payload', async () => {
    const result = await handler.handleMemoryHealth({ autoRepair: true });
    const parsed = parseResponse(result);

    expect(result.isError).toBe(false);
    expect(parsed.summary).toMatch(/Confirmation required before auto-repair actions are executed/);
    expect(parsed.data).toMatchObject({
      reportMode: 'full',
      autoRepairRequested: true,
      needsConfirmation: true,
    });
    expect(parsed.data.actions).not.toContain('temp_fixture_memory_cleanup');
    expect(parsed.hints).toEqual(
      expect.arrayContaining([
        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
      ])
    );
  });

  it('T007b-H9: checkDatabaseUpdated failures return MCP error response with requestId', async () => {
    vi.spyOn(core, 'checkDatabaseUpdated').mockRejectedValue(new Error('marker read failed'));

    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);
    const details = getDetails(parsed);

    expect(result.isError).toBe(true);
    expect(getErrorMessage(parsed)).toMatch(/Database refresh failed before diagnostics completed/);
    expect(parsed.data.code).toBe('E021');
    expect(typeof details?.requestId).toBe('string');
  });
});

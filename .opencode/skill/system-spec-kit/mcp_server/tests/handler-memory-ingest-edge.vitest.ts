import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockCheckDatabaseUpdated: vi.fn(async () => undefined),
  mockCreateIngestJob: vi.fn(),
  mockEnqueueIngestJob: vi.fn(),
  mockGetIngestJob: vi.fn(),
  mockCancelIngestJob: vi.fn(),
  mockGetIngestProgressPercent: vi.fn((job: { filesProcessed: number; filesTotal: number }) => {
    if (!job || typeof job.filesTotal !== 'number' || job.filesTotal <= 0) return 0;
    return Math.round((job.filesProcessed / job.filesTotal) * 100);
  }),
}));

vi.mock('../core', () => ({
  checkDatabaseUpdated: mocks.mockCheckDatabaseUpdated,
  DATABASE_PATH: '/tmp',
  ALLOWED_BASE_PATHS: ['/tmp'],
}));

vi.mock('../lib/ops/job-queue', () => ({
  createIngestJob: mocks.mockCreateIngestJob,
  enqueueIngestJob: mocks.mockEnqueueIngestJob,
  getIngestJob: mocks.mockGetIngestJob,
  cancelIngestJob: mocks.mockCancelIngestJob,
  getIngestProgressPercent: mocks.mockGetIngestProgressPercent,
}));

import * as handler from '../handlers/memory-ingest';
import { MAX_INGEST_PATHS } from '../schemas/tool-input-schemas';

function parseResponse(result: { content: Array<{ text: string }> }) {
  return JSON.parse(result.content[0].text);
}

const originalMemoryBasePath = process.env.MEMORY_BASE_PATH;

describe('Handler Memory Ingest edge cases (T005a)', () => {
  beforeEach(() => {
    process.env.MEMORY_BASE_PATH = '/tmp';

    mocks.mockCheckDatabaseUpdated.mockClear();
    mocks.mockCreateIngestJob.mockReset();
    mocks.mockEnqueueIngestJob.mockReset();
    mocks.mockGetIngestJob.mockReset();
    mocks.mockCancelIngestJob.mockReset();
    mocks.mockGetIngestProgressPercent.mockClear();
  });

  afterEach(() => {
    if (originalMemoryBasePath === undefined) {
      delete process.env.MEMORY_BASE_PATH;
    } else {
      process.env.MEMORY_BASE_PATH = originalMemoryBasePath;
    }
  });

  it('T005a-I1: empty paths array throws "non-empty array"', async () => {
    await expect(handler.handleMemoryIngestStart({ paths: [] })).rejects.toThrow(/non-empty array/i);
  });

  it('T005a-I2: all non-string paths throws after filtering to empty', async () => {
    await expect(
      handler.handleMemoryIngestStart({ paths: [123, false, { bad: true }] as unknown as string[] }),
    ).rejects.toThrow(/non-empty array/i);
  });

  it('T005a-I3: path traversal is rejected with E_VALIDATION response', async () => {
    const result = await handler.handleMemoryIngestStart({ paths: ['../tmp/traversal.md'] });
    const parsed = parseResponse(result) as Record<string, any>;
    const errorText = String(parsed.error ?? parsed.data?.error ?? '');
    const errorCode = String(parsed.code ?? parsed.data?.code ?? '');

    expect(errorText).toContain('Invalid path(s) rejected');
    expect(errorCode).toBe('E_VALIDATION');
    expect(mocks.mockCreateIngestJob).not.toHaveBeenCalled();
    expect(mocks.mockEnqueueIngestJob).not.toHaveBeenCalled();
  });

  it('T005a-I4: path outside allowed base is rejected with E_VALIDATION response', async () => {
    const result = await handler.handleMemoryIngestStart({ paths: ['/var/outside.md'] });
    const parsed = parseResponse(result) as Record<string, any>;
    const errorText = String(parsed.error ?? parsed.data?.error ?? '');
    const errorCode = String(parsed.code ?? parsed.data?.code ?? '');
    const details = (parsed.data?.details ?? {}) as Record<string, unknown>;

    expect(errorText).toContain('Invalid path(s) rejected');
    expect(errorCode).toBe('E_VALIDATION');
    expect(details.allowedBasePaths).toBeUndefined();
    expect(details.allowedBasePathCount).toBe(1);
    expect(details.allowedPathPolicy).toBe('configured-memory-roots');
    expect(mocks.mockCreateIngestJob).not.toHaveBeenCalled();
    expect(mocks.mockEnqueueIngestJob).not.toHaveBeenCalled();
  });

  it('T005a-I4a: normalized in-base traversal segments are still rejected', async () => {
    const result = await handler.handleMemoryIngestStart({ paths: ['/tmp/safe/../escaped.md'] });
    const parsed = parseResponse(result) as Record<string, any>;
    const errorText = String(parsed.error ?? parsed.data?.error ?? '');
    const errorCode = String(parsed.code ?? parsed.data?.code ?? '');

    expect(errorText).toContain('Invalid path(s) rejected');
    expect(errorText).toContain('contains path traversal segments (..)');
    expect(errorCode).toBe('E_VALIDATION');
    expect(mocks.mockCreateIngestJob).not.toHaveBeenCalled();
    expect(mocks.mockEnqueueIngestJob).not.toHaveBeenCalled();
  });

  it('T005a-I4b: exactly MAX_INGEST_PATHS paths is accepted', async () => {
    const paths = Array.from({ length: MAX_INGEST_PATHS }, (_, index) => `/tmp/ingest-edge-${index}.md`);
    mocks.mockCreateIngestJob.mockResolvedValue({
      id: 'job_max_ingest_paths',
      state: 'queued',
      specFolder: null,
      paths,
      filesTotal: MAX_INGEST_PATHS,
      filesProcessed: 0,
      errors: [],
      createdAt: '2026-03-11T00:00:00.000Z',
      updatedAt: '2026-03-11T00:00:00.000Z',
    });

    const result = await handler.handleMemoryIngestStart({ paths });
    const parsed = parseResponse(result) as Record<string, any>;

    expect(mocks.mockCreateIngestJob).toHaveBeenCalledTimes(1);
    expect(mocks.mockEnqueueIngestJob).toHaveBeenCalledWith('job_max_ingest_paths');
    expect(parsed.data?.filesTotal).toBe(MAX_INGEST_PATHS);
  });

  it('T005a-I4c: MAX_INGEST_PATHS+1 paths throws the shared limit error', async () => {
    const paths = Array.from({ length: MAX_INGEST_PATHS + 1 }, (_, index) => `/tmp/ingest-edge-over-${index}.md`);

    await expect(handler.handleMemoryIngestStart({ paths })).rejects.toThrow(`paths exceeds maximum of ${MAX_INGEST_PATHS}`);
  });

  it('T005a-I5: status with missing jobId throws', async () => {
    await expect(handler.handleMemoryIngestStatus({} as unknown as { jobId: string })).rejects.toThrow(
      /jobId is required and must be a string/i,
    );
  });

  it('T005a-I6: status with non-string jobId throws', async () => {
    await expect(handler.handleMemoryIngestStatus({ jobId: 123 } as unknown as { jobId: string })).rejects.toThrow(
      /jobId is required and must be a string/i,
    );
  });

  it('T005a-I6b: status returns E404 payload when job is unknown', async () => {
    mocks.mockGetIngestJob.mockReturnValue(null);

    const result = await handler.handleMemoryIngestStatus({ jobId: 'job_missing' });
    const parsed = parseResponse(result) as Record<string, any>;
    const errorCode = String(parsed.code ?? parsed.data?.code ?? '');
    const errorText = String(parsed.error ?? parsed.data?.error ?? '');

    expect(errorCode).toBe('E404');
    expect(errorText).toContain('Ingest job not found');
  });

  it('T005a-I7: cancel with missing jobId throws', async () => {
    await expect(handler.handleMemoryIngestCancel({} as unknown as { jobId: string })).rejects.toThrow(
      /jobId is required and must be a string/i,
    );
  });

  it('T005a-I7b: cancel returns E404 payload when job is unknown', async () => {
    mocks.mockGetIngestJob.mockReturnValue(null);

    const result = await handler.handleMemoryIngestCancel({ jobId: 'job_missing' });
    const parsed = parseResponse(result) as Record<string, any>;
    const errorCode = String(parsed.code ?? parsed.data?.code ?? '');
    const errorText = String(parsed.error ?? parsed.data?.error ?? '');

    expect(errorCode).toBe('E404');
    expect(errorText).toContain('Ingest job not found');
  });

  it('T005a-I7c: cancel returns terminal summary when race completes job before cancel writes', async () => {
    const inFlightJob = {
      id: 'job_race_complete',
      state: 'indexing',
      specFolder: null,
      paths: ['/tmp/a.md'],
      filesTotal: 1,
      filesProcessed: 0,
      errors: [],
      createdAt: '2026-03-11T00:00:00.000Z',
      updatedAt: '2026-03-11T00:00:00.000Z',
    };
    const alreadyComplete = {
      ...inFlightJob,
      state: 'complete',
      filesProcessed: 1,
    };
    mocks.mockGetIngestJob.mockReturnValue(inFlightJob);
    mocks.mockCancelIngestJob.mockResolvedValue(alreadyComplete);

    const result = await handler.handleMemoryIngestCancel({ jobId: inFlightJob.id });
    const parsed = parseResponse(result) as Record<string, any>;
    const summary = String(parsed.summary ?? '');

    expect(mocks.mockCancelIngestJob).toHaveBeenCalledWith(inFlightJob.id);
    expect(summary).toContain('already terminal (complete)');
  });

  it('T005a-I8: all paths over 500 chars are dropped and then throw', async () => {
    const tooLongPathA = `/tmp/${'a'.repeat(501)}`;
    const tooLongPathB = `/tmp/${'b'.repeat(800)}`;

    await expect(handler.handleMemoryIngestStart({ paths: [tooLongPathA, tooLongPathB] })).rejects.toThrow(
      /non-empty array/i,
    );
  });
});

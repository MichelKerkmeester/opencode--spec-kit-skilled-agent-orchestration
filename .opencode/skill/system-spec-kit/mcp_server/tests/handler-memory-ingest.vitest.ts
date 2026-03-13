// TEST: HANDLER MEMORY INGEST
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
  DATABASE_PATH: ':memory:',
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

function parseEnvelope(result: { content: Array<{ text: string }> }): Record<string, unknown> {
  return JSON.parse(result.content[0].text) as Record<string, unknown>;
}

describe('Handler Memory Ingest (Sprint 9 P0-3)', () => {
  beforeEach(() => {
    mocks.mockCheckDatabaseUpdated.mockClear();
    mocks.mockCreateIngestJob.mockReset();
    mocks.mockEnqueueIngestJob.mockReset();
    mocks.mockGetIngestJob.mockReset();
    mocks.mockCancelIngestJob.mockReset();
    mocks.mockGetIngestProgressPercent.mockClear();
  });

  it('exports ingest handlers and aliases', () => {
    expect(typeof handler.handleMemoryIngestStart).toBe('function');
    expect(typeof handler.handleMemoryIngestStatus).toBe('function');
    expect(typeof handler.handleMemoryIngestCancel).toBe('function');
    expect(typeof handler.handle_memory_ingest_start).toBe('function');
    expect(typeof handler.handle_memory_ingest_status).toBe('function');
    expect(typeof handler.handle_memory_ingest_cancel).toBe('function');
  });

  it('start rejects empty paths', async () => {
    await expect(handler.handleMemoryIngestStart({ paths: [] })).rejects.toThrow(/paths must be a non-empty array/i);
  });

  it('start queues job and returns queued response', async () => {
    mocks.mockCreateIngestJob.mockResolvedValue({
      id: 'job_test123',
      state: 'queued',
      specFolder: 'specs/001-test',
      paths: ['/tmp/a.md', '/tmp/b.md'],
      filesTotal: 2,
      filesProcessed: 0,
      errors: [],
      createdAt: '2026-03-05T00:00:00.000Z',
      updatedAt: '2026-03-05T00:00:00.000Z',
    });

    const result = await handler.handleMemoryIngestStart({
      paths: ['/tmp/a.md', '/tmp/b.md'],
      specFolder: 'specs/001-test',
    });

    expect(mocks.mockCreateIngestJob).toHaveBeenCalledTimes(1);
    expect(mocks.mockEnqueueIngestJob).toHaveBeenCalledWith('job_test123');

    const envelope = parseEnvelope(result);
    expect(String(envelope.summary)).toContain('Queued ingest job job_test123');
    expect((envelope.data as Record<string, unknown>).jobId).toBe('job_test123');
    expect((envelope.data as Record<string, unknown>).state).toBe('queued');
  });

  it('status returns E404 payload when job is missing', async () => {
    mocks.mockGetIngestJob.mockReturnValue(null);

    const result = await handler.handleMemoryIngestStatus({ jobId: 'job_missing' });
    const envelope = parseEnvelope(result);
    const data = envelope.data as Record<string, unknown> | undefined;

    expect(String(envelope.error ?? data?.error ?? '')).toContain('Ingest job not found');
  });

  it('status returns mapped job payload when found', async () => {
    mocks.mockGetIngestJob.mockReturnValue({
      id: 'job_live',
      state: 'indexing',
      specFolder: 'specs/live',
      paths: ['/tmp/live.md', '/tmp/nested/trace.json'],
      filesTotal: 4,
      filesProcessed: 1,
      errors: [
        {
          filePath: '/tmp/private/deep/secret.md',
          message: 'boom',
          timestamp: '2026-03-05T00:00:00.000Z',
        },
        {
          filePath: '__job__',
          message: 'queue truncated',
          timestamp: '2026-03-05T00:00:01.000Z',
        },
      ],
      createdAt: '2026-03-05T00:00:00.000Z',
      updatedAt: '2026-03-05T00:00:01.000Z',
    });

    const result = await handler.handleMemoryIngestStatus({ jobId: 'job_live' });
    const envelope = parseEnvelope(result);
    const data = envelope.data as Record<string, unknown>;

    expect(data.jobId).toBe('job_live');
    expect(data.state).toBe('indexing');
    expect(data.progress).toBe(25);
    expect(data.paths).toEqual(['live.md', 'trace.json']);
    expect(data.errors).toEqual([
      {
        filePath: 'secret.md',
        message: 'boom',
        timestamp: '2026-03-05T00:00:00.000Z',
      },
      {
        filePath: '__job__',
        message: 'queue truncated',
        timestamp: '2026-03-05T00:00:01.000Z',
      },
    ]);
  });

  it('cancel returns terminal state unchanged', async () => {
    mocks.mockGetIngestJob.mockReturnValue({
      id: 'job_done',
      state: 'complete',
      specFolder: null,
      paths: ['/tmp/done.md'],
      filesTotal: 1,
      filesProcessed: 1,
      errors: [],
      createdAt: '2026-03-05T00:00:00.000Z',
      updatedAt: '2026-03-05T00:00:01.000Z',
    });

    const result = await handler.handleMemoryIngestCancel({ jobId: 'job_done' });
    const envelope = parseEnvelope(result);

    expect(String(envelope.summary)).toContain('already terminal (complete)');
    expect(mocks.mockCancelIngestJob).not.toHaveBeenCalled();
  });

  it('cancel transitions non-terminal job through queue cancel', async () => {
    mocks.mockGetIngestJob.mockReturnValue({
      id: 'job_cancel_me',
      state: 'indexing',
      specFolder: null,
      paths: ['/tmp/x.md'],
      filesTotal: 3,
      filesProcessed: 1,
      errors: [],
      createdAt: '2026-03-05T00:00:00.000Z',
      updatedAt: '2026-03-05T00:00:01.000Z',
    });

    mocks.mockCancelIngestJob.mockResolvedValue({
      id: 'job_cancel_me',
      state: 'cancelled',
      specFolder: null,
      paths: ['/tmp/x.md'],
      filesTotal: 3,
      filesProcessed: 1,
      errors: [],
      createdAt: '2026-03-05T00:00:00.000Z',
      updatedAt: '2026-03-05T00:00:02.000Z',
    });

    const result = await handler.handleMemoryIngestCancel({ jobId: 'job_cancel_me' });
    const envelope = parseEnvelope(result);
    const data = envelope.data as Record<string, unknown>;

    expect(mocks.mockCancelIngestJob).toHaveBeenCalledWith('job_cancel_me');
    expect(data.state).toBe('cancelled');
  });
});

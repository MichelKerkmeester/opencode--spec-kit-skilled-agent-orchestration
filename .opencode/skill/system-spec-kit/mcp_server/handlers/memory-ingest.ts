// ---------------------------------------------------------------
// MODULE: Memory Ingest Handlers
// ---------------------------------------------------------------

import { randomBytes } from 'node:crypto';
import path from 'node:path';

import { checkDatabaseUpdated } from '../core';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import {
  createIngestJob,
  enqueueIngestJob,
  getIngestJob,
  cancelIngestJob,
  getIngestProgressPercent,
  type IngestJob,
} from '../lib/ops/job-queue';

import type { MCPResponse } from './types';

interface MemoryIngestStartArgs {
  paths: string[];
  specFolder?: string;
}

interface MemoryIngestStatusArgs {
  jobId: string;
}

interface MemoryIngestCancelArgs {
  jobId: string;
}

const MAX_INGEST_PATHS = 100;
const MAX_PATH_LENGTH = 500;

// Codex fix: nanoid-style 12-char alphanumeric ID (URL-safe, no UUID dependency).
const NANOID_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
function createJobId(): string {
  const bytes = randomBytes(12);
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += NANOID_ALPHABET[bytes[i] % NANOID_ALPHABET.length];
  }
  return `job_${id}`;
}

function mapJobForResponse(job: IngestJob): Record<string, unknown> {
  return {
    jobId: job.id,
    state: job.state,
    specFolder: job.specFolder,
    paths: job.paths.map((entry) => path.basename(entry || '')),
    filesTotal: job.filesTotal,
    filesProcessed: job.filesProcessed,
    progress: getIngestProgressPercent(job),
    errors: job.errors,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
}

async function handleMemoryIngestStart(args: MemoryIngestStartArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();

  let paths = Array.isArray(args.paths)
    ? args.paths.filter((entry): entry is string => typeof entry === 'string' && entry.trim().length > 0)
    : [];

  if (paths.length === 0) {
    throw new Error('paths must be a non-empty array of file paths');
  }

  if (paths.length > MAX_INGEST_PATHS) {
    throw new Error(`paths exceeds maximum of ${MAX_INGEST_PATHS}`);
  }

  const withinLength = paths.filter((entry) => entry.length <= MAX_PATH_LENGTH);
  if (withinLength.length !== paths.length) {
    console.warn(
      `[memory-ingest] Dropped ${paths.length - withinLength.length} path(s) longer than ${MAX_PATH_LENGTH} characters`,
    );
  }
  paths = withinLength;

  if (paths.length === 0) {
    throw new Error('paths must be a non-empty array of file paths');
  }

  const jobId = createJobId();
  const job = await createIngestJob({
    id: jobId,
    paths,
    specFolder: args.specFolder,
  });

  enqueueIngestJob(job.id);

  return createMCPSuccessResponse({
    tool: 'memory_ingest_start',
    summary: `Queued ingest job ${job.id} (${job.filesTotal} file(s))`,
    data: {
      jobId: job.id,
      state: job.state,
      filesTotal: job.filesTotal,
    },
    hints: [
      'Use memory_ingest_status with jobId to poll progress',
      'Use memory_ingest_cancel with jobId to stop processing',
    ],
  });
}

async function handleMemoryIngestStatus(args: MemoryIngestStatusArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();

  if (!args.jobId || typeof args.jobId !== 'string') {
    throw new Error('jobId is required and must be a string');
  }

  const job = getIngestJob(args.jobId);
  if (!job) {
    return createMCPErrorResponse({
      tool: 'memory_ingest_status',
      error: `Ingest job not found: ${args.jobId}`,
      code: 'E404',
      details: { jobId: args.jobId },
      recovery: {
        hint: 'Verify the jobId and retry.',
        actions: ['Call memory_ingest_start to create a new ingest job'],
        severity: 'warning',
      },
    });
  }

  return createMCPSuccessResponse({
    tool: 'memory_ingest_status',
    summary: `Ingest job ${job.id}: ${job.state} (${job.filesProcessed}/${job.filesTotal})`,
    data: mapJobForResponse(job),
  });
}

async function handleMemoryIngestCancel(args: MemoryIngestCancelArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();

  if (!args.jobId || typeof args.jobId !== 'string') {
    throw new Error('jobId is required and must be a string');
  }

  const job = getIngestJob(args.jobId);
  if (!job) {
    return createMCPErrorResponse({
      tool: 'memory_ingest_cancel',
      error: `Ingest job not found: ${args.jobId}`,
      code: 'E404',
      details: { jobId: args.jobId },
      recovery: {
        hint: 'Verify the jobId and retry.',
        actions: ['Call memory_ingest_status with a known jobId'],
        severity: 'warning',
      },
    });
  }

  if (job.state === 'complete' || job.state === 'failed' || job.state === 'cancelled') {
    return createMCPSuccessResponse({
      tool: 'memory_ingest_cancel',
      summary: `Ingest job ${job.id} is already terminal (${job.state})`,
      data: mapJobForResponse(job),
    });
  }

  const cancelled = await cancelIngestJob(args.jobId);

  return createMCPSuccessResponse({
    tool: 'memory_ingest_cancel',
    summary: `Cancelled ingest job ${cancelled.id}`,
    data: mapJobForResponse(cancelled),
  });
}

const handle_memory_ingest_start = handleMemoryIngestStart;
const handle_memory_ingest_status = handleMemoryIngestStatus;
const handle_memory_ingest_cancel = handleMemoryIngestCancel;

export {
  handleMemoryIngestStart,
  handleMemoryIngestStatus,
  handleMemoryIngestCancel,
  handle_memory_ingest_start,
  handle_memory_ingest_status,
  handle_memory_ingest_cancel,
};

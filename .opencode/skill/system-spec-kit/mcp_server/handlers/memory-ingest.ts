// ───────────────────────────────────────────────────────────────
// MODULE: Memory Ingest Handlers
// ───────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { ALLOWED_BASE_PATHS, DATABASE_PATH, checkDatabaseUpdated } from '../core/index.js';
import { MAX_INGEST_PATHS } from '../schemas/tool-input-schemas.js';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
import {
  createIngestJob,
  enqueueIngestJob,
  getIngestJob,
  cancelIngestJob,
  getIngestProgressPercent,
  getIngestForecast,
  type IngestJob,
} from '../lib/ops/job-queue.js';
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';

import type { MCPResponse } from './types.js';

// Feature catalog: Async ingestion job lifecycle
// Feature catalog: Workspace scanning and indexing (memory_index_scan)

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

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

/* ───────────────────────────────────────────────────────────────
   3. CONSTANTS
──────────────────────────────────────────────────────────────── */

const MAX_PATH_LENGTH = 500;

/* ───────────────────────────────────────────────────────────────
   4. HELPERS
──────────────────────────────────────────────────────────────── */

function hasTraversalSegment(inputPath: string): boolean {
  return inputPath.split(/[\\/]+/).includes('..');
}

function toPublicPathLabel(filePath: string): string {
  return filePath === '__job__' ? filePath : path.basename(filePath || '');
}

// Use a nanoid-style 12-char URL-safe identifier without UUID dependency.
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
  let forecast: Record<string, unknown>;
  try {
    forecast = getIngestForecast(job) as unknown as Record<string, unknown>;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    forecast = {
      etaSeconds: null,
      etaConfidence: null,
      failureRisk: null,
      riskSignals: [],
      caveat: `Forecast unavailable: ${message}`,
    };
  }

  let telemetryPayload: Record<string, unknown> | undefined;
  if (retrievalTelemetry.isExtendedTelemetryEnabled()) {
    const telemetry = retrievalTelemetry.createTelemetry();
    retrievalTelemetry.recordLifecycleForecastDiagnostics(telemetry, forecast, {
      state: job.state,
      progress: getIngestProgressPercent(job),
      filesProcessed: job.filesProcessed,
      filesTotal: job.filesTotal,
    });
    telemetryPayload = retrievalTelemetry.toJSON(telemetry);
  }

  return {
    jobId: job.id,
    state: job.state,
    specFolder: job.specFolder,
    paths: job.paths.map((entry) => toPublicPathLabel(entry)),
    filesTotal: job.filesTotal,
    filesProcessed: job.filesProcessed,
    progress: getIngestProgressPercent(job),
    errors: job.errors.map((entry) => ({
      ...entry,
      filePath: toPublicPathLabel(entry.filePath),
    })),
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    forecast: forecast as unknown as Record<string, unknown>,
    ...(telemetryPayload ? { _telemetry: telemetryPayload } : {}),
  };
}

/* ───────────────────────────────────────────────────────────────
   5. HANDLERS
──────────────────────────────────────────────────────────────── */

/** Handle memory_ingest_start tool — begins batch ingestion of spec documents from disk.
 * @param args - Ingest arguments (paths, scope, options)
 * @returns MCP response with job ID and forecast
 */
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

  const overlengthPaths = paths
    .filter((entry) => entry.length > MAX_PATH_LENGTH)
    .map((entry) => ({
      filePath: toPublicPathLabel(entry),
      reason: `path exceeds ${MAX_PATH_LENGTH} characters`,
    }));
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

  const configuredMemoryRoot = process.env.MEMORY_BASE_PATH;
  const derivedAllowedBasePath = configuredMemoryRoot && configuredMemoryRoot.trim().length > 0
    ? path.resolve(process.cwd(), configuredMemoryRoot)
    : path.resolve(path.dirname(DATABASE_PATH));
  const allowedBasePaths = Array.from(
    new Set([derivedAllowedBasePath, ...ALLOWED_BASE_PATHS].map((basePath) => path.resolve(basePath))),
  );

  const normalizedPaths: string[] = [];
  const invalidPaths: Array<{ input: string; reason: string }> = [];

  for (const inputPath of paths) {
    const trimmedPath = inputPath.trim();

    if (hasTraversalSegment(trimmedPath)) {
      invalidPaths.push({ input: inputPath, reason: 'contains path traversal segments (..)' });
      continue;
    }

    const resolvedPath = path.resolve(trimmedPath);

    const hasTraversalAfterResolve = resolvedPath.split(path.sep).includes('..');
    if (hasTraversalAfterResolve) {
      invalidPaths.push({ input: inputPath, reason: 'contains path traversal segments (..)' });
      continue;
    }

    // Resolve symlinks so traversal checks apply to canonical targets.
    let realPath: string;
    try {
      realPath = fs.realpathSync(resolvedPath);
    } catch {
      // Fall back to resolvedPath during pre-validation when target does not yet exist.
      realPath = resolvedPath;
    }

    const isWithinAllowedBase = allowedBasePaths.some((basePath) => (
      realPath === basePath || realPath.startsWith(`${basePath}${path.sep}`)
    ));
    if (!isWithinAllowedBase) {
      invalidPaths.push({ input: inputPath, reason: 'is outside allowed memory roots' });
      continue;
    }

    normalizedPaths.push(realPath);
  }

  if (invalidPaths.length > 0) {
    return createMCPErrorResponse({
      tool: 'memory_ingest_start',
      error: `Invalid path(s) rejected: ${invalidPaths.map((entry) => `"${entry.input}" (${entry.reason})`).join(', ')}`,
      code: 'E_VALIDATION',
      details: {
        allowedBasePathCount: allowedBasePaths.length,
        allowedPathPolicy: 'configured-memory-roots',
        rejectedCount: invalidPaths.length,
      },
      recovery: {
        hint: 'Provide file paths under an allowed memory base directory and remove traversal segments.',
        actions: ['Use absolute paths rooted in the configured memory base path'],
        severity: 'warning',
      },
    });
  }

  const deduplicatedPaths: string[] = [];
  const seenPaths = new Set<string>();
  let duplicatePathCount = 0;

  for (const normalizedPath of normalizedPaths) {
    if (seenPaths.has(normalizedPath)) {
      duplicatePathCount++;
      continue;
    }

    seenPaths.add(normalizedPath);
    deduplicatedPaths.push(normalizedPath);
  }

  paths = deduplicatedPaths;

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
      acceptedPathCount: paths.length,
      rejectedPathCount: overlengthPaths.length,
      ...(duplicatePathCount > 0 ? { duplicatePathCount } : {}),
      ...(overlengthPaths.length > 0 ? { rejectedPaths: overlengthPaths } : {}),
    },
    hints: [
      'Use memory_ingest_status with jobId to poll progress',
      'Use memory_ingest_cancel with jobId to stop processing',
      ...(duplicatePathCount > 0
        ? ['Duplicate input paths were deduplicated before queueing']
        : []),
      ...(overlengthPaths.length > 0
        ? ['Some input paths were rejected before queueing; inspect rejectedPaths for details']
        : []),
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
  const summary = cancelled.state === 'cancelled'
    ? `Cancelled ingest job ${cancelled.id}`
    : `Ingest job ${cancelled.id} is already terminal (${cancelled.state})`;

  return createMCPSuccessResponse({
    tool: 'memory_ingest_cancel',
    summary,
    data: mapJobForResponse(cancelled),
  });
}

/* ───────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */

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

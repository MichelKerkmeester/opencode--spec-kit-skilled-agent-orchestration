// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud List
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomUUID } from 'node:crypto';

import { checkDatabaseUpdated } from '../core/index.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
import { toErrorMessage } from '../utils/index.js';

import { safeJsonParseTyped } from '../utils/json-helpers.js';

import type { MCPResponse } from './types.js';
import type { ListArgs } from './memory-crud-types.js';

// Feature catalog: Memory browser (memory_list)
// Feature catalog: Validation feedback (memory_validate)


/* ───────────────────────────────────────────────────────────────
   CORE LOGIC
──────────────────────────────────────────────────────────────── */

/** Handle memory_list tool -- returns paginated memory entries. */
async function handleMemoryList(args: ListArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  const requestId = randomUUID();
  try {
    await checkDatabaseUpdated();
  } catch (dbStateErr: unknown) {
    const message = toErrorMessage(dbStateErr);
    console.error(`[memory-list] Database refresh failed [requestId=${requestId}]: ${message}`);
    return createMCPErrorResponse({
      tool: 'memory_list',
      error: 'Database refresh failed before query execution. Retry the request or restart the MCP server.',
      code: 'E021',
      details: { requestId },
      startTime,
    });
  }

  const {
    limit: rawLimit = 20,
    offset: rawOffset = 0,
    specFolder,
    sortBy = 'created_at',
    includeChunks = false,
  } = args;

  if (specFolder !== undefined && typeof specFolder !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_list',
      error: 'specFolder must be a string',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (includeChunks !== undefined && typeof includeChunks !== 'boolean') {
    return createMCPErrorResponse({
      tool: 'memory_list',
      error: 'includeChunks must be a boolean',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (rawLimit !== undefined && (typeof rawLimit !== 'number' || !Number.isFinite(rawLimit))) {
    return createMCPErrorResponse({
      tool: 'memory_list',
      error: 'limit must be a finite number',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (rawOffset !== undefined && (typeof rawOffset !== 'number' || !Number.isFinite(rawOffset))) {
    return createMCPErrorResponse({
      tool: 'memory_list',
      error: 'offset must be a finite number',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }

  const safeLimit = Math.max(1, Math.min(Math.floor(rawLimit || 20), 100));
  const safeOffset = Math.max(0, Math.floor(rawOffset || 0));
  const database = vectorIndex.getDb();

  if (!database) {
    return createMCPErrorResponse({
      tool: 'memory_list',
      error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.',
      code: 'E020',
      details: { requestId },
      startTime,
    });
  }

  let total = 0;
  let rows: unknown[];
  const sortColumn = ['created_at', 'updated_at', 'importance_weight'].includes(sortBy)
    ? sortBy
    : 'created_at';

  try {
    const whereParts: string[] = [];
    const baseParams: unknown[] = [];

    if (!includeChunks) {
      whereParts.push('parent_id IS NULL');
    }

    if (specFolder) {
      whereParts.push('spec_folder = ?');
      baseParams.push(specFolder);
    }

    const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(*) as count FROM memory_index ${whereClause}`;
    const countResult = database.prepare(countSql).get(...baseParams) as Record<string, unknown> | undefined;
    total = (countResult && typeof countResult.count === 'number') ? countResult.count : 0;

    const sql = `SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight, created_at, updated_at FROM memory_index ${whereClause} ORDER BY ${sortColumn} DESC LIMIT ? OFFSET ?`;
    const params = [...baseParams, safeLimit, safeOffset];
    rows = database.prepare(sql).all(...params);
  } catch (dbErr: unknown) {
    const message = toErrorMessage(dbErr);
    console.error(`[memory-list] Database query failed: ${message}`);
    return createMCPErrorResponse({
      tool: 'memory_list',
      error: `Database query failed: ${message}`,
      code: 'E021',
      details: { requestId },
      startTime,
    });
  }

  const memories = (rows as Record<string, unknown>[]).map((row: Record<string, unknown>) => ({
    id: row.id,
    specFolder: row.spec_folder,
    title: (row.title as string) || '(untitled)',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    importanceWeight: row.importance_weight,
    triggerCount: safeJsonParseTyped<unknown[]>(row.trigger_phrases as string, 'array', []).length,
    filePath: row.file_path,
  }));

  const summary = `Listed ${memories.length} of ${total} memories`;
  const hints: string[] = [];
  if (safeOffset + memories.length < total) {
    hints.push(`More results available: use offset: ${safeOffset + safeLimit}`);
  }
  if (memories.length === 0 && total > 0) {
    hints.push('Offset exceeds total count - try offset: 0');
  }

  return createMCPSuccessResponse({
    tool: 'memory_list',
    summary,
    data: {
      total,
      offset: safeOffset,
      limit: safeLimit,
      sortBy: sortColumn,
      includeChunks,
      count: memories.length,
      results: memories,
    },
    hints,
    startTime,
  });
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export { handleMemoryList };

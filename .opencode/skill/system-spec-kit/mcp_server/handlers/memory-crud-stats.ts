// ────────────────────────────────────────────────────────────────
// MODULE: Memory Crud Stats
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   IMPORTS
──────────────────────────────────────────────────────────────── */

import { randomUUID } from 'node:crypto';
import * as fs from 'fs';

import { checkDatabaseUpdated } from '../core/index.js';
import * as vectorIndex from '../lib/search/vector-index.js';
import * as folderScoring from '../lib/scoring/folder-scoring.js';
import type { FolderMemoryInput } from '../lib/scoring/folder-scoring.js';
import { getGraphMetrics } from '../lib/search/hybrid-search.js';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
import { toErrorMessage } from '../utils/index.js';

import type { MCPResponse } from './types.js';
import type { StatsArgs } from './memory-crud-types.js';

// Feature catalog: System statistics (memory_stats)


/* ───────────────────────────────────────────────────────────────
   CORE LOGIC
──────────────────────────────────────────────────────────────── */

/** Handle memory_stats tool -- returns memory system statistics and folder rankings. */
async function handleMemoryStats(args: StatsArgs | null): Promise<MCPResponse> {
  const startTime = Date.now();
  const requestId = randomUUID();
  try {
    await checkDatabaseUpdated();
  } catch (dbStateErr: unknown) {
    const message = toErrorMessage(dbStateErr);
    console.error(`[memory-stats] Database refresh failed [requestId=${requestId}]: ${message}`);
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: 'Database refresh failed before query execution. Retry the request or restart the MCP server.',
      code: 'E021',
      details: { requestId },
      startTime,
    });
  }

  const database = vectorIndex.getDb();
  if (!database) {
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.',
      code: 'E020',
      details: { requestId },
      startTime,
    });
  }

  const {
    folderRanking = 'count',
    excludePatterns = [],
    includeScores = false,
    includeArchived = false,
    limit: rawLimit = 10,
  } = args || {};

  const validRankings = ['count', 'recency', 'importance', 'composite'];
  if (!validRankings.includes(folderRanking)) {
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: `Invalid folderRanking: ${folderRanking}. Valid options: ${validRankings.join(', ')}`,
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }

  if (excludePatterns && !Array.isArray(excludePatterns)) {
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: 'excludePatterns must be an array of regex pattern strings',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (Array.isArray(excludePatterns) && excludePatterns.some((pattern) => typeof pattern !== 'string')) {
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: 'excludePatterns must contain only string patterns',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (includeScores !== undefined && typeof includeScores !== 'boolean') {
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: 'includeScores must be a boolean',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (includeArchived !== undefined && typeof includeArchived !== 'boolean') {
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: 'includeArchived must be a boolean',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (rawLimit !== undefined && (typeof rawLimit !== 'number' || !Number.isFinite(rawLimit))) {
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: 'limit must be a finite number',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }

  const safeLimit = Math.max(1, Math.min(Math.floor(rawLimit || 10), 100));

  let total = 0;
  let statusCounts: ReturnType<typeof vectorIndex.getStatusCounts> = { success: 0, pending: 0, failed: 0, retry: 0, partial: 0 };
  let dates: Record<string, unknown> = { oldest: null, newest: null };
  let triggerCount = 0;
  let topFolders: Record<string, unknown>[];
  let totalSpecFolders = 0;
  const tierBreakdown: Record<string, number> = {};
  let lastIndexedAt: string | null = null;

  try {
    const totalResult = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as Record<string, unknown>;
    total = (totalResult && typeof totalResult.count === 'number') ? totalResult.count : 0;
    statusCounts = vectorIndex.getStatusCounts();
    dates = (database.prepare('SELECT MIN(created_at) as oldest, MAX(created_at) as newest FROM memory_index').get() || { oldest: null, newest: null }) as Record<string, unknown>;

    const triggerResult = database.prepare("SELECT SUM(json_array_length(trigger_phrases)) as count FROM memory_index WHERE trigger_phrases IS NOT NULL AND trigger_phrases != '[]'").get() as Record<string, unknown>;
    triggerCount = (triggerResult && typeof triggerResult.count === 'number') ? triggerResult.count : 0;

    const tierRows = database.prepare(
      'SELECT importance_tier, COUNT(*) as count FROM memory_index GROUP BY importance_tier'
    ).all() as { importance_tier: string; count: number }[];
    for (const row of tierRows) {
      tierBreakdown[row.importance_tier || 'normal'] = row.count;
    }

    const lastIndexedRow = database.prepare(
      'SELECT MAX(updated_at) as last_indexed FROM memory_index'
    ).get() as { last_indexed: string | null } | undefined;
    lastIndexedAt = lastIndexedRow?.last_indexed || null;
  } catch (dbErr: unknown) {
    const message = toErrorMessage(dbErr);
    console.error(`[memory-stats] Database query failed (aggregate stats): ${message}`);
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: `Database query failed: ${message}`,
      code: 'E021',
      details: { requestId },
      startTime,
    });
  }

  let databaseSizeBytes: number | null = null;
  try {
    const dbPath = vectorIndex.getDbPath();
    if (dbPath) {
      databaseSizeBytes = fs.statSync(dbPath).size;
    }
  } catch (_err: unknown) {
    // Non-fatal.
  }

  try {
    if (folderRanking === 'count') {
      const folderRows = database.prepare('SELECT spec_folder, COUNT(*) as count FROM memory_index GROUP BY spec_folder ORDER BY count DESC').all() as { spec_folder: string; count: number }[];

      let filteredFolders = folderRows;
      if (!includeArchived) {
        filteredFolders = filteredFolders.filter((folder) => !folderScoring.isArchived(folder.spec_folder));
      }

      if (excludePatterns.length > 0) {
        const loweredPatterns = excludePatterns
          .filter((pattern: string) => typeof pattern === 'string' && pattern.length > 0)
          .map((pattern: string) => pattern.toLowerCase());

        if (loweredPatterns.length > 0) {
          filteredFolders = filteredFolders.filter((folder) => {
            const folderName = folder.spec_folder.toLowerCase();
            return !loweredPatterns.some((pattern) => folderName.includes(pattern));
          });
        }
      }

      totalSpecFolders = filteredFolders.length;
      topFolders = filteredFolders.slice(0, safeLimit).map((folder) => ({
        folder: folder.spec_folder,
        count: folder.count,
      }));
    } else {
      const allMemories: FolderMemoryInput[] = database.prepare(`
        SELECT
          id, spec_folder, file_path, title, importance_weight, importance_tier,
          created_at, updated_at, confidence, validation_count, access_count
        FROM memory_index
        WHERE embedding_status = 'success'
      `).all() as FolderMemoryInput[];

      const scoringOptions = {
        includeArchived,
        excludePatterns,
      };

      let scoredFolders: Record<string, unknown>[];
      try {
        scoredFolders = folderScoring.computeFolderScores(allMemories, scoringOptions);

        // Sort by ranking mode
        if (folderRanking === 'recency') {
          scoredFolders.sort((a, b) => ((b.recencyScore as number) ?? 0) - ((a.recencyScore as number) ?? 0));
        } else if (folderRanking === 'importance') {
          scoredFolders.sort((a, b) => ((b.importanceScore as number) ?? 0) - ((a.importanceScore as number) ?? 0));
        }
        // 'composite' and 'count' use default sort from computeFolderScores (by .score)
      } catch (scoringErr: unknown) {
        const message = toErrorMessage(scoringErr);
        console.error(`[memory-stats] Scoring failed, falling back to count-based: ${message}`);

        const folderCounts = new Map<string, number>();
        for (const memory of allMemories) {
          const folder = (memory.spec_folder as string) || 'unknown';
          folderCounts.set(folder, (folderCounts.get(folder) || 0) + 1);
        }

        scoredFolders = Array.from(folderCounts.entries())
          .filter(([folder]) => includeArchived || !folderScoring.isArchived(folder))
          .map(([folder, count]) => ({
            folder,
            simplified: folder.split('/').pop() || folder,
            count,
            score: 0,
            isArchived: folderScoring.isArchived(folder),
          }))
          .sort((a, b) => b.count - a.count);
      }

      totalSpecFolders = scoredFolders.length;
      scoredFolders = scoredFolders.slice(0, safeLimit);

      if (includeScores || folderRanking === 'composite') {
        topFolders = scoredFolders.map((folder: Record<string, unknown>) => ({
          folder: folder.folder,
          simplified: folder.simplified,
          count: folder.count,
          score: folder.score,
          recencyScore: folder.recencyScore,
          importanceScore: folder.importanceScore,
          activityScore: folder.activityScore,
          validationScore: folder.validationScore,
          lastActivity: folder.lastActivity,
          isArchived: folder.isArchived,
          topTier: folder.topTier,
        }));
      } else {
        topFolders = scoredFolders.map((folder: Record<string, unknown>) => ({
          folder: folder.folder,
          simplified: folder.simplified,
          count: folder.count,
          score: folder.score,
          lastActivity: folder.lastActivity,
          isArchived: folder.isArchived,
        }));
      }
    }
  } catch (dbErr: unknown) {
    const message = toErrorMessage(dbErr);
    console.error(`[memory-stats] Database query failed (folder ranking): ${message}`);
    return createMCPErrorResponse({
      tool: 'memory_stats',
      error: `Folder ranking query failed: ${message}`,
      code: 'E021',
      details: { requestId },
      startTime,
    });
  }

  const summary = `Memory system: ${total} memories across ${totalSpecFolders} folders`;
  const hints: string[] = [];

  if (!vectorIndex.isVectorSearchAvailable()) {
    hints.push('Vector search unavailable - using BM25 fallback');
  }
  if (statusCounts.pending > 0) {
    hints.push(`${statusCounts.pending} memories pending re-indexing`);
  }

  return createMCPSuccessResponse({
    tool: 'memory_stats',
    summary,
    data: {
      totalMemories: total,
      byStatus: statusCounts,
      oldestMemory: dates.oldest || null,
      newestMemory: dates.newest || null,
      topFolders,
      totalSpecFolders,
      limit: safeLimit,
      totalTriggerPhrases: triggerCount,
      vectorSearchEnabled: vectorIndex.isVectorSearchAvailable(),
      graphChannelMetrics: getGraphMetrics(),
      folderRanking,
      tierBreakdown,
      databaseSizeBytes,
      lastIndexedAt,
    },
    hints,
    startTime,
  });
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export { handleMemoryStats };

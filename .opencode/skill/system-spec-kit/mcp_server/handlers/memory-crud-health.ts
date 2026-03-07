// ------- MODULE: Memory CRUD Health Handler -------

/* ---------------------------------------------------------------
   IMPORTS
--------------------------------------------------------------- */

import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { isEmbeddingModelReady } from '../core';
import { summarizeAliasConflicts } from './memory-index';
import * as causalEdges from '../lib/storage/causal-edges';

import type { MCPResponse, EmbeddingProfile } from './types';
import type { HealthArgs, PartialProviderMetadata } from './memory-crud-types';

/** Strip absolute paths, stack traces, and truncate for safe user-facing hints. */
function sanitizeErrorForHint(msg: string): string {
  return msg
    .replace(/\/[\w./-]+/g, '[path]')          // strip Unix absolute file paths
    .replace(/[A-Za-z]:\\[\w.\\/-]+/g, '[path]') // strip Windows absolute file paths
    .replace(/^[ \t]*at .+$/gm, '')            // strip stack trace lines
    .replace(/\n{2,}/g, '\n')                   // collapse blank lines left by stripping
    .trim()
    .slice(0, 200);
}

/** Redact absolute paths: keep only project-relative portion or basename. */
function redactPath(absolutePath: string): string {
  const specsIdx = absolutePath.indexOf('/specs/');
  const opencodeIdx = absolutePath.indexOf('/.opencode/');
  if (specsIdx !== -1) return absolutePath.slice(specsIdx + 1);
  if (opencodeIdx !== -1) return absolutePath.slice(opencodeIdx + 1);
  // AI-WHY: Fallback: basename only
  const lastSlash = absolutePath.lastIndexOf('/');
  return lastSlash !== -1 ? absolutePath.slice(lastSlash + 1) : absolutePath;
}

/* ---------------------------------------------------------------
   CONSTANTS
--------------------------------------------------------------- */

// Read version from package.json at module load time (CJS __dirname is available)
// WHY try-catch: if package.json is missing or malformed, the server should still start
const SERVER_VERSION: string = (() => {
  const packageCandidates = [
    resolve(__dirname, '../package.json'),
    resolve(__dirname, '../../package.json'),
  ];

  try {
    for (const candidate of packageCandidates) {
      if (!existsSync(candidate)) {
        continue;
      }
      const pkg = JSON.parse(readFileSync(candidate, 'utf-8'));
      if (pkg?.version) {
        return pkg.version;
      }
    }
    return 'unknown';
  } catch (_error: unknown) {
    return 'unknown';
  }
})();

const DIVERGENT_ALIAS_REPORT_MODE = 'divergent_aliases';
const DEFAULT_DIVERGENT_ALIAS_LIMIT = 20;
const MAX_DIVERGENT_ALIAS_LIMIT = 200;
const DOT_OPENCODE_SPECS_SEGMENT = '/.opencode/specs/';
const SPECS_SEGMENT = '/specs/';

interface AliasConflictDbRow {
  file_path: string;
  content_hash: string | null;
  spec_folder?: string | null;
}

interface DivergentAliasVariant {
  filePath: string;
  contentHash: string | null;
}

interface DivergentAliasGroup {
  normalizedPath: string;
  specFolders: string[];
  distinctHashCount: number;
  variants: DivergentAliasVariant[];
}

interface DivergentAliasBucket {
  hasDotOpencodeVariant: boolean;
  hasSpecsVariant: boolean;
  variants: Map<string, string | null>;
  hashes: Set<string>;
  specFolders: Set<string>;
}

function toNormalizedPath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function toSpecAliasKey(filePath: string): string {
  return toNormalizedPath(filePath).replace(DOT_OPENCODE_SPECS_SEGMENT, SPECS_SEGMENT);
}

function getDivergentAliasGroups(rows: AliasConflictDbRow[], limit: number): DivergentAliasGroup[] {
  if (!rows.length) {
    return [];
  }

  const buckets = new Map<string, DivergentAliasBucket>();

  for (const row of rows) {
    if (!row || typeof row.file_path !== 'string' || row.file_path.length === 0) {
      continue;
    }

    const normalizedPath = toNormalizedPath(row.file_path);
    const aliasKey = toSpecAliasKey(normalizedPath);
    let bucket = buckets.get(aliasKey);
    if (!bucket) {
      bucket = {
        hasDotOpencodeVariant: false,
        hasSpecsVariant: false,
        variants: new Map<string, string | null>(),
        hashes: new Set<string>(),
        specFolders: new Set<string>(),
      };
      buckets.set(aliasKey, bucket);
    }

    if (normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT)) {
      bucket.hasDotOpencodeVariant = true;
    }
    if (normalizedPath.includes(SPECS_SEGMENT) && !normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT)) {
      bucket.hasSpecsVariant = true;
    }

    bucket.variants.set(normalizedPath, row.content_hash ?? null);
    if (typeof row.content_hash === 'string' && row.content_hash.trim().length > 0) {
      bucket.hashes.add(row.content_hash.trim());
    }
    if (typeof row.spec_folder === 'string' && row.spec_folder.length > 0) {
      bucket.specFolders.add(row.spec_folder);
    }
  }

  const groups: DivergentAliasGroup[] = [];
  for (const [normalizedPath, bucket] of buckets.entries()) {
    if (!bucket.hasDotOpencodeVariant || !bucket.hasSpecsVariant) {
      continue;
    }
    if (bucket.variants.size < 2 || bucket.hashes.size < 2) {
      continue;
    }

    const variants: DivergentAliasVariant[] = Array.from(bucket.variants.entries())
      .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
      .map(([filePath, contentHash]) => ({ filePath: redactPath(filePath), contentHash }));

    groups.push({
      normalizedPath,
      specFolders: Array.from(bucket.specFolders).sort(),
      distinctHashCount: bucket.hashes.size,
      variants,
    });
  }

  groups.sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));
  return groups.slice(0, limit);
}

/* ---------------------------------------------------------------
   CORE LOGIC
--------------------------------------------------------------- */

/** Handle memory_health tool -- returns system health status and diagnostics. */
async function handleMemoryHealth(args: HealthArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  // A7-P2-1: Generate requestId for incident correlation in error responses
  const requestId = randomUUID();
  await checkDatabaseUpdated();

  const {
    reportMode = 'full',
    limit: rawLimit = DEFAULT_DIVERGENT_ALIAS_LIMIT,
    specFolder,
    autoRepair = false,
  } = args ?? {};

  if (reportMode !== 'full' && reportMode !== DIVERGENT_ALIAS_REPORT_MODE) {
    throw new Error(`Invalid reportMode: ${String(reportMode)}. Expected "full" or "${DIVERGENT_ALIAS_REPORT_MODE}"`);
  }
  if (specFolder !== undefined && typeof specFolder !== 'string') {
    throw new Error('specFolder must be a string');
  }
  if (typeof autoRepair !== 'boolean') {
    throw new Error('autoRepair must be a boolean');
  }
  if (rawLimit !== undefined && (!Number.isFinite(rawLimit) || rawLimit <= 0)) {
    throw new Error('limit must be a positive number');
  }
  const safeLimit = Math.max(1, Math.min(Math.floor(rawLimit || DEFAULT_DIVERGENT_ALIAS_LIMIT), MAX_DIVERGENT_ALIAS_LIMIT));

  const database = vectorIndex.getDb();
  let memoryCount = 0;
  let aliasConflicts: ReturnType<typeof summarizeAliasConflicts> = summarizeAliasConflicts([]);
  let aliasRows: AliasConflictDbRow[] = [];
  let divergentAliasGroups: DivergentAliasGroup[] = [];
  try {
    if (database) {
      const countResult = database.prepare('SELECT COUNT(*) as count FROM memory_index')
        .get() as Record<string, number> | undefined;
      memoryCount = countResult?.count ?? 0;

      const whereParts: string[] = [
        'parent_id IS NULL',
        "file_path LIKE '%/specs/%'",
      ];
      const params: unknown[] = [];
      if (specFolder) {
        whereParts.push('spec_folder = ?');
        params.push(specFolder);
      }

      const aliasSql = `
        SELECT file_path, content_hash, spec_folder
        FROM memory_index
        WHERE ${whereParts.join(' AND ')}
      `;

      aliasRows = database.prepare(aliasSql).all(...params) as AliasConflictDbRow[];
      aliasConflicts = summarizeAliasConflicts(aliasRows);
      divergentAliasGroups = getDivergentAliasGroups(aliasRows, safeLimit);
    }
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    if (message.includes('no such table')) {
      console.error(`[memory-health] Schema missing [requestId=${requestId}]:`, message);
      return createMCPErrorResponse({
        tool: 'memory_health',
        error: `Schema missing: ${sanitizeErrorForHint(message)}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
        code: 'E_SCHEMA_MISSING',
        details: { requestId },
        startTime,
      });
    }
    console.warn(`[memory-health] Failed to get memory count [requestId=${requestId}]:`, message);
  }

  if (reportMode === DIVERGENT_ALIAS_REPORT_MODE) {
    const hints: string[] = [];
    if (!database) {
      hints.push('Database not connected - restart MCP server');
    }
    if (autoRepair) {
      hints.push('autoRepair is only applied in reportMode="full"');
    }
    if (aliasConflicts.divergentHashGroups === 0) {
      hints.push('No divergent alias groups detected');
    }
    if (aliasConflicts.divergentHashGroups > divergentAliasGroups.length) {
      hints.push(`More divergent alias groups available: increase limit above ${safeLimit}`);
    }

    return createMCPSuccessResponse({
      tool: 'memory_health',
      summary: `Divergent alias report: ${divergentAliasGroups.length} of ${aliasConflicts.divergentHashGroups} group(s)`,
      data: {
        reportMode,
        status: isEmbeddingModelReady() && database ? 'healthy' : 'degraded',
        databaseConnected: !!database,
        specFolder: specFolder ?? null,
        limit: safeLimit,
        totalRowsScanned: aliasRows.length,
        totalDivergentGroups: aliasConflicts.divergentHashGroups,
        returnedGroups: divergentAliasGroups.length,
        groups: divergentAliasGroups.map(g => ({
          ...g,
          variants: g.variants.map(v => ({ ...v, filePath: redactPath(v.filePath) })),
        })),
      },
      hints,
      startTime,
    });
  }

  let providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
  let profile = embeddings.getEmbeddingProfile() as EmbeddingProfile | null;
  const status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded';

  const summary = `Memory system ${status}: ${memoryCount} memories indexed`;
  const hints: string[] = [];
  const repair = {
    requested: autoRepair,
    attempted: false,
    repaired: false,
    actions: [] as string[],
    warnings: [] as string[],
    errors: [] as string[],
  };

  if (!profile) {
    try {
      // AI-WHY: Resolve the lazy profile so health reflects the active runtime provider
      // rather than the legacy sync fallback defaults.
      profile = await embeddings.getEmbeddingProfileAsync() as EmbeddingProfile | null;
      providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
    } catch (profileError: unknown) {
      hints.push(`Embedding profile unavailable: ${sanitizeErrorForHint(toErrorMessage(profileError))}`);
    }
  }

  const providerName = profile?.provider ?? providerMetadata.provider;
  const providerModel = profile?.model ?? providerMetadata.model ?? embeddings.getModelName();
  const providerDimension = profile?.dim ?? providerMetadata.dim ?? embeddings.getEmbeddingDimension();

  if (!isEmbeddingModelReady()) {
    hints.push('Embedding model not ready - some operations may fail');
  }
  if (!database) {
    hints.push('Database not connected - restart MCP server');
  }
  if (!vectorIndex.isVectorSearchAvailable()) {
    hints.push('Vector search unavailable - fallback to BM25');
  }
  // FTS5 consistency check
  if (database) {
    try {
      const memoryCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as { count: number };
      const ftsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
      if (memoryCountRow.count !== ftsCountRow.count) {
        hints.push(
          `FTS5 index out of sync: memory_index has ${memoryCountRow.count} rows, memory_fts has ${ftsCountRow.count} rows. ` +
          `Run memory_index_scan with force:true to rebuild FTS5 index.`
        );

        if (autoRepair) {
          repair.attempted = true;
          try {
            database.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
            repair.actions.push('fts_rebuild');

            triggerMatcher.refreshTriggerCache();
            repair.actions.push('trigger_cache_refresh');

            const repairedFtsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
            if (memoryCountRow.count === repairedFtsCountRow.count) {
              repair.repaired = true;
              repair.actions.push('fts_consistency_verified');
              hints.push('Auto-repair completed: FTS5 index rebuilt and trigger cache refreshed.');
            } else {
              const warning = `Post-repair mismatch persists: memory_index=${memoryCountRow.count}, memory_fts=${repairedFtsCountRow.count}`;
              repair.warnings.push(warning);
              hints.push(`Auto-repair attempted, but mismatch remains (${warning}).`);
            }
          } catch (repairError: unknown) {
            const message = toErrorMessage(repairError);
            repair.errors.push(sanitizeErrorForHint(message));
            hints.push(`Auto-repair failed: ${sanitizeErrorForHint(message)}`);
          }
        }
      }
    } catch (e: unknown) {
      const message = toErrorMessage(e);
      hints.push(`FTS5 consistency check failed: ${sanitizeErrorForHint(message)}`);
      if (autoRepair) {
        repair.errors.push(`Consistency check failed before repair: ${sanitizeErrorForHint(message)}`);
      }
    }
  }
  // AI-WHY: Fix #28 (017-refinement-phase-6) — cleanupOrphanedEdges was exported but
  // never invoked at runtime. Wire it into autoRepair so orphaned causal edges
  // (referencing deleted memories) are cleaned up during health checks.
  if (autoRepair && database) {
    try {
      const orphanResult = causalEdges.cleanupOrphanedEdges();
      if (orphanResult.deleted > 0) {
        repair.attempted = true;
        repair.repaired = true;
        repair.actions.push(`orphan_edges_cleaned:${orphanResult.deleted}`);
        hints.push(`Auto-repair: removed ${orphanResult.deleted} orphaned causal edge(s)`);
      }
    } catch (orphanError: unknown) {
      repair.errors.push(`Orphan edge cleanup failed: ${sanitizeErrorForHint(toErrorMessage(orphanError))}`);
    }
  }

  if (aliasConflicts.groups > 0) {
    hints.push(`Detected ${aliasConflicts.groups} specs/.opencode alias group(s)`);
  }
  if (aliasConflicts.divergentHashGroups > 0) {
    hints.push(`${aliasConflicts.divergentHashGroups} alias group(s) have divergent content hashes`);
  }

  return createMCPSuccessResponse({
    tool: 'memory_health',
    summary,
    data: {
      status,
      embeddingModelReady: isEmbeddingModelReady(),
      databaseConnected: !!database,
      vectorSearchAvailable: vectorIndex.isVectorSearchAvailable(),
      memoryCount,
      uptime: process.uptime(),
      version: SERVER_VERSION,
      reportMode: 'full',
      aliasConflicts,
      repair,
      embeddingProvider: {
        provider: providerName,
        model: providerModel,
        dimension: providerDimension,
        healthy: providerMetadata.healthy !== false,
        databasePath: redactPath(vectorIndex.getDbPath() ?? ''),
      },
    },
    hints,
    startTime,
  });
}

/* ---------------------------------------------------------------
   EXPORTS
--------------------------------------------------------------- */

export { handleMemoryHealth };

// ────────────────────────────────────────────────────────────────
// MODULE: Causal Graph
// ────────────────────────────────────────────────────────────────

/* ───────────────────────────────────────────────────────────────
   0. DEPENDENCIES
──────────────────────────────────────────────────────────────── */

// Lib modules
import * as vectorIndex from '../lib/search/vector-index.js';
import * as causalEdges from '../lib/storage/causal-edges.js';
import type { CausalChainNode, CausalEdge } from '../lib/storage/causal-edges.js';

// Core utilities
import { checkDatabaseUpdated } from '../core/index.js';
import { toErrorMessage } from '../utils/index.js';
import { ErrorCodes, getRecoveryHint } from '../lib/errors.js';

// REQ-019: Standardized Response Structure
import { createMCPSuccessResponse, createMCPErrorResponse, createMCPEmptyResponse } from '../lib/response/envelope.js';

// Shared handler types
import type { MCPResponse } from './types.js';

// Feature catalog: Causal graph statistics (memory_causal_stats)
// Feature catalog: Causal chain tracing (memory_drift_why)


/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

/** Flat edge representation for API responses */
export interface FlatEdge {
  id: number;               // T202: causal_edges.id for unlink workflow
  from: string;
  to: string;
  relation: string;
  strength: number;
  depth: number;
  direction: 'incoming' | 'outgoing';
}

/** Flattened chain produced from CausalChainNode tree */
export interface FlattenedChain {
  all: FlatEdge[];
  by_cause: FlatEdge[];
  by_enabled: FlatEdge[];
  by_supersedes: FlatEdge[];
  by_contradicts: FlatEdge[];
  by_derived_from: FlatEdge[];
  by_supports: FlatEdge[];
  total_edges: number;
  max_depth_reached: boolean;
  truncated: boolean;
  truncation_limit: number | null;
}

interface DirectionalBuckets {
  caused: FlatEdge[];
  enabled: FlatEdge[];
  supersedes: FlatEdge[];
  contradicts: FlatEdge[];
  derivedFrom: FlatEdge[];
  supports: FlatEdge[];
  allEdges: FlatEdge[];
  totalEdges: number;
  maxDepthReached: boolean;
  truncated: boolean;
  truncationLimit: number | null;
}

interface DriftWhyArgs {
  memoryId: string | number;
  maxDepth?: number;
  direction?: string;
  relations?: string[] | null;
  includeMemoryDetails?: boolean;
}

interface CausalLinkArgs {
  sourceId: string | number;
  targetId: string | number;
  relation: string;
  strength?: number;
  evidence?: string | null;
}

interface CausalStatsArgs {
  _?: never;
}

interface CausalUnlinkArgs {
  edgeId: number;
}

function logCausalHandlerError(tool: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[${tool}] ${message}`);
}

function createSanitizedCausalError(
  tool: 'memory_drift_why' | 'memory_causal_link' | 'memory_causal_stats' | 'memory_causal_unlink',
  error: unknown,
  code: string,
  details: Record<string, unknown>,
  startTime: number,
  publicMessage: string,
): MCPResponse {
  logCausalHandlerError(tool, error);
  return createMCPErrorResponse({
    tool,
    error: publicMessage,
    code,
    details,
    recovery: getRecoveryHint(tool, code),
    startTime,
  });
}

/* ───────────────────────────────────────────────────────────────
   2. TREE-TO-FLAT CONVERTER
──────────────────────────────────────────────────────────────── */

/**
 * Flatten a CausalChainNode tree into flat edge lists grouped by relation.
 * The tree from getCausalChain() encodes parent→child relationships;
 * for 'forward' direction: parent=source, child=target.
 * For 'backward' direction: parent=target, child=source.
 */
function flattenCausalTree(
  root: CausalChainNode,
  maxDepth: number,
  direction: 'forward' | 'backward'
): FlattenedChain {
  const edgeDirection = direction === 'forward' ? 'outgoing' : 'incoming';
  const result: FlattenedChain = {
    all: [],
    by_cause: [],
    by_enabled: [],
    by_supersedes: [],
    by_contradicts: [],
    by_derived_from: [],
    by_supports: [],
    total_edges: 0,
    max_depth_reached: false,
    truncated: Boolean(root.truncated),
    truncation_limit: root.truncationLimit ?? null,
  };

  function traverse(node: CausalChainNode): void {
    for (const child of node.children) {
      const edge: FlatEdge = {
        id: child.edgeId ?? 0,          // T202: edge ID from storage layer
        from: direction === 'forward' ? node.id : child.id,
        to: direction === 'forward' ? child.id : node.id,
        relation: child.relation,
        strength: child.strength,
        depth: child.depth,
        direction: edgeDirection,
      };

      result.all.push(edge);

      // Group by relation type
      const bucket = relationBucket(child.relation);
      if (bucket) {
        bucket.push(edge);
      }

      // T006 — Only flag max_depth_reached when a node exists at the depth limit.
      // Nodes at maxDepth-1 with no children are natural leaves (edges were queried).
      // Nodes at maxDepth were added but never explored (traverse returned early).
      if (child.depth >= maxDepth) {
        result.max_depth_reached = true;
      }

      traverse(child);
    }
  }

  function relationBucket(relation: string): FlatEdge[] | null {
    switch (relation) {
      case 'caused': return result.by_cause;
      case 'enabled': return result.by_enabled;
      case 'supersedes': return result.by_supersedes;
      case 'contradicts': return result.by_contradicts;
      case 'derived_from': return result.by_derived_from;
      case 'supports': return result.by_supports;
      default: return null;
    }
  }

  traverse(root);
  result.total_edges = result.all.length;
  return result;
}

/**
 * Merge two flattened chains (used for 'both' direction).
 * Deduplicates edges by direction+from+to+relation key.
 */
function mergeFlattenedChains(a: FlattenedChain, b: FlattenedChain): FlattenedChain {
  const seen = new Set<string>();
  const merged: FlattenedChain = {
    all: [],
    by_cause: [],
    by_enabled: [],
    by_supersedes: [],
    by_contradicts: [],
    by_derived_from: [],
    by_supports: [],
    total_edges: 0,
    max_depth_reached: a.max_depth_reached || b.max_depth_reached,
    truncated: a.truncated || b.truncated,
    truncation_limit: a.truncation_limit ?? b.truncation_limit ?? null,
  };

  function addEdge(edge: FlatEdge): void {
    const key = `${edge.direction}:${edge.from}:${edge.to}:${edge.relation}`;
    if (seen.has(key)) return;
    seen.add(key);

    merged.all.push(edge);
    switch (edge.relation) {
      case 'caused': merged.by_cause.push(edge); break;
      case 'enabled': merged.by_enabled.push(edge); break;
      case 'supersedes': merged.by_supersedes.push(edge); break;
      case 'contradicts': merged.by_contradicts.push(edge); break;
      case 'derived_from': merged.by_derived_from.push(edge); break;
      case 'supports': merged.by_supports.push(edge); break;
    }
  }

  for (const edge of a.all) addEdge(edge);
  for (const edge of b.all) addEdge(edge);

  merged.total_edges = merged.all.length;
  return merged;
}

/**
 * Map tool schema direction values to getCausalChain direction values.
 * Tool schema: 'outgoing' | 'incoming' | 'both'
 * getCausalChain: 'forward' | 'backward'
 */
function mapDirection(direction: string): 'forward' | 'backward' | 'both' {
  switch (direction) {
    case 'outgoing': return 'forward';
    case 'forward': return 'forward';   // backward compat
    case 'incoming': return 'backward';
    case 'backward': return 'backward'; // backward compat
    case 'both': return 'both';
    default: return 'forward';
  }
}

/**
 * T203: Filter a FlattenedChain to only include edges whose relation
 * is in the provided set. When relations is null/empty, returns the
 * chain unchanged.
 */
function filterChainByRelations(
  chain: FlattenedChain,
  relations: string[] | null | undefined
): FlattenedChain {
  if (!relations || relations.length === 0) return chain;

  const allowed = new Set(relations);

  const filtered: FlattenedChain = {
    all: chain.all.filter(e => allowed.has(e.relation)),
    by_cause: allowed.has('caused') ? chain.by_cause : [],
    by_enabled: allowed.has('enabled') ? chain.by_enabled : [],
    by_supersedes: allowed.has('supersedes') ? chain.by_supersedes : [],
    by_contradicts: allowed.has('contradicts') ? chain.by_contradicts : [],
    by_derived_from: allowed.has('derived_from') ? chain.by_derived_from : [],
    by_supports: allowed.has('supports') ? chain.by_supports : [],
    total_edges: 0,
    max_depth_reached: chain.max_depth_reached,
    truncated: chain.truncated,
    truncation_limit: chain.truncation_limit,
  };
  filtered.total_edges = filtered.all.length;
  return filtered;
}

function createEmptyChain(): FlattenedChain {
  return {
    all: [],
    by_cause: [],
    by_enabled: [],
    by_supersedes: [],
    by_contradicts: [],
    by_derived_from: [],
    by_supports: [],
    total_edges: 0,
    max_depth_reached: false,
    truncated: false,
    truncation_limit: null,
  };
}

function toDirectionalBuckets(chain: FlattenedChain): DirectionalBuckets {
  return {
    caused: chain.by_cause,
    enabled: chain.by_enabled,
    supersedes: chain.by_supersedes,
    contradicts: chain.by_contradicts,
    derivedFrom: chain.by_derived_from,
    supports: chain.by_supports,
    allEdges: chain.all,
    totalEdges: chain.total_edges,
    maxDepthReached: chain.max_depth_reached,
    truncated: chain.truncated,
    truncationLimit: chain.truncation_limit,
  };
}

function formatRelationSummary(chain: FlattenedChain, label: 'incoming' | 'outgoing'): string | null {
  const parts: string[] = [];

  if (chain.by_cause.length > 0) parts.push(`${chain.by_cause.length} caused`);
  if (chain.by_enabled.length > 0) parts.push(`${chain.by_enabled.length} enabled`);
  if (chain.by_supersedes.length > 0) parts.push(`${chain.by_supersedes.length} supersedes`);
  if (chain.by_contradicts.length > 0) parts.push(`${chain.by_contradicts.length} contradicts`);
  if (chain.by_derived_from.length > 0) parts.push(`${chain.by_derived_from.length} derived_from`);
  if (chain.by_supports.length > 0) parts.push(`${chain.by_supports.length} supports`);

  if (parts.length === 0) return null;
  return `${label}: ${parts.join(', ')}`;
}

/* ───────────────────────────────────────────────────────────────
   3. MEMORY DRIFT WHY HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_drift_why tool - traces causal relationships for a given memory */
async function handleMemoryDriftWhy(args: DriftWhyArgs): Promise<MCPResponse> {
  const {
    memoryId,
    maxDepth: rawMaxDepth = 3,
    direction = 'both',
    relations = null,
    includeMemoryDetails = true
  } = args;
  // Clamp maxDepth to [1, 10] server-side
  const maxDepth = Math.min(Math.max(1, Math.floor(rawMaxDepth)), 10);

  const startTime = Date.now();

  if (memoryId === undefined || memoryId === null) {
    return createMCPErrorResponse({
      tool: 'memory_drift_why',
      error: 'memoryId is required',
      code: 'E031',
      details: { param: 'memoryId' },
      recovery: getRecoveryHint('memory_drift_why', 'E031'),
      startTime: startTime
    });
  }

  try {
    await checkDatabaseUpdated();

    vectorIndex.initializeDb();
    const db = vectorIndex.getDb();
    if (!db) {
      return createMCPErrorResponse({
        tool: 'memory_drift_why',
        error: 'Database not initialized. Server may still be starting up.',
        code: 'E020',
        details: {},
        recovery: getRecoveryHint('memory_drift_why', 'E020'),
        startTime: startTime
      });
    }
    causalEdges.init(db);

    if (relations && Array.isArray(relations)) {
      const validRelations: string[] = Object.values(causalEdges.RELATION_TYPES) as string[];
      const invalid = relations.filter((r: string) => !validRelations.includes(r));
      if (invalid.length > 0) {
        return createMCPErrorResponse({
          tool: 'memory_drift_why',
          error: `Invalid relation types: ${invalid.join(', ')}`,
          code: ErrorCodes.CAUSAL_INVALID_RELATION,
          details: { invalidRelations: invalid, validRelations: validRelations },
          recovery: getRecoveryHint('memory_drift_why', ErrorCodes.CAUSAL_INVALID_RELATION),
          startTime: startTime
        });
      }
    }

    const mappedDirection = mapDirection(direction);

    const readTraversalSnapshot = (): {
      incomingChain: FlattenedChain;
      outgoingChain: FlattenedChain;
      combinedChain: FlattenedChain;
      memoryDetails: Record<string, unknown> | null;
      relatedMemories: Record<string, Record<string, unknown>>;
    } => {
      let incomingChain = createEmptyChain();
      let outgoingChain = createEmptyChain();

      if (mappedDirection === 'both') {
        const forwardTree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'forward');
        const backwardTree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'backward');
        outgoingChain = forwardTree ? flattenCausalTree(forwardTree, maxDepth, 'forward') : createEmptyChain();
        incomingChain = backwardTree ? flattenCausalTree(backwardTree, maxDepth, 'backward') : createEmptyChain();
      } else if (mappedDirection === 'forward') {
        const tree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'forward');
        outgoingChain = tree ? flattenCausalTree(tree, maxDepth, 'forward') : createEmptyChain();
      } else {
        const tree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'backward');
        incomingChain = tree ? flattenCausalTree(tree, maxDepth, 'backward') : createEmptyChain();
      }

      // T203: Apply relations filter (after traversal, before response)
      incomingChain = filterChainByRelations(incomingChain, relations);
      outgoingChain = filterChainByRelations(outgoingChain, relations);
      const combinedChain = mergeFlattenedChains(incomingChain, outgoingChain);

      let memoryDetails: Record<string, unknown> | null = null;
      const relatedMemories: Record<string, Record<string, unknown>> = {};

      if (includeMemoryDetails) {
        const sourceMemory = db.prepare(`
          SELECT id, title, spec_folder, importance_tier, importance_weight,
                 context_type, created_at, updated_at, file_path
          FROM memory_index
          WHERE id = ? OR CAST(id AS TEXT) = ?
        `).get(memoryId, String(memoryId)) as Record<string, unknown> | undefined;

        if (sourceMemory) {
          memoryDetails = sourceMemory;
        }

        const memoryIds = new Set<string>();
        for (const edge of combinedChain.all) {
          memoryIds.add(edge.from);
          memoryIds.add(edge.to);
        }

        if (memoryIds.size > 0) {
          const idsArray = Array.from(memoryIds);
          for (const id of idsArray) {
            const memory = db.prepare(`
              SELECT id, title, spec_folder, importance_tier, created_at
              FROM memory_index
              WHERE id = ? OR CAST(id AS TEXT) = ?
            `).get(id, String(id)) as Record<string, unknown> | undefined;
            if (memory) {
              relatedMemories[id] = memory;
            }
          }
        }
      }

      return {
        incomingChain,
        outgoingChain,
        combinedChain,
        memoryDetails,
        relatedMemories,
      };
    };

    const traversalSnapshot = typeof db.transaction === 'function'
      ? db.transaction(readTraversalSnapshot)()
      : readTraversalSnapshot();
    const {
      incomingChain,
      outgoingChain,
      combinedChain,
      memoryDetails,
      relatedMemories,
    } = traversalSnapshot;

    if (combinedChain.total_edges === 0) {
      return createMCPEmptyResponse({
        tool: 'memory_drift_why',
        summary: `No causal relationships found for memory ${memoryId}`,
        data: {
          memoryId: String(memoryId),
          memory: memoryDetails
        },
        hints: [
          'Use memory_causal_link to create relationships',
          'Consider linking to related decisions or contexts'
        ],
        startTime: startTime
      });
    }

    const relationSummary: string[] = [];
    const incomingSummary = formatRelationSummary(incomingChain, 'incoming');
    const outgoingSummary = formatRelationSummary(outgoingChain, 'outgoing');
    if (incomingSummary) relationSummary.push(incomingSummary);
    if (outgoingSummary) relationSummary.push(outgoingSummary);

    const summary = relationSummary.length > 0
      ? `Found ${combinedChain.total_edges} causal relationships (${relationSummary.join('; ')})`
      : `Found ${combinedChain.total_edges} causal relationships`;

    const hints: string[] = [];
    if (combinedChain.max_depth_reached) {
      hints.push(`Max depth (${maxDepth}) reached - more relationships may exist beyond this depth`);
    }
    if (combinedChain.truncated) {
      hints.push(
        `Traversal truncated after ${combinedChain.truncation_limit ?? causalEdges.MAX_EDGES_LIMIT} edges per node - results may be incomplete`
      );
    }
    if (combinedChain.by_contradicts.length > 0) {
      hints.push('Contradicting relationships detected - review for consistency');
    }

    return createMCPSuccessResponse({
      tool: 'memory_drift_why',
      summary,
      data: {
        memoryId: String(memoryId),
        memory: memoryDetails,
        incoming: toDirectionalBuckets(incomingChain),
        outgoing: toDirectionalBuckets(outgoingChain),
        allEdges: combinedChain.all,
        totalEdges: combinedChain.total_edges,
        totalIncomingEdges: incomingChain.total_edges,
        totalOutgoingEdges: outgoingChain.total_edges,
        maxDepthReached: combinedChain.max_depth_reached,
        truncated: combinedChain.truncated,
        truncationLimit: combinedChain.truncation_limit,
        relatedMemories: Object.keys(relatedMemories).length > 0 ? relatedMemories : null,
        traversalOptions: { direction: mappedDirection, maxDepth }
      },
      hints,
      startTime: startTime
    });
  } catch (error: unknown) {
    return createSanitizedCausalError(
      'memory_drift_why',
      error,
      ErrorCodes.TRAVERSAL_ERROR,
      { memoryId },
      startTime,
      'Causal traversal failed.',
    );
  }
}

/* ───────────────────────────────────────────────────────────────
   3. CAUSAL LINK HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_causal_link tool - creates a causal edge between two memories */
async function handleMemoryCausalLink(args: CausalLinkArgs): Promise<MCPResponse> {
  const {
    sourceId,
    targetId,
    relation,
    strength = 1.0,
    evidence = null
  } = args;

  const startTime = Date.now();

  if ((sourceId === undefined || sourceId === null) || (targetId === undefined || targetId === null) || !relation) {
    const missing: string[] = [];
    if (sourceId === undefined || sourceId === null) missing.push('sourceId');
    if (targetId === undefined || targetId === null) missing.push('targetId');
    if (!relation) missing.push('relation');

    return createMCPErrorResponse({
      tool: 'memory_causal_link',
      error: `Missing required parameters: ${missing.join(', ')}`,
      code: 'E031',
      details: {
        missingParams: missing,
        validRelations: Object.values(causalEdges.RELATION_TYPES) as string[]
      },
      recovery: {
        hint: 'Provide all required parameters to create a causal link',
        actions: [
          'sourceId: Memory ID that is the cause/source',
          'targetId: Memory ID that is the effect/target',
          `relation: One of ${Object.values(causalEdges.RELATION_TYPES).join(', ')}`
        ],
        severity: 'error'
      },
      startTime: startTime
    });
  }

  try {
    await checkDatabaseUpdated();

    vectorIndex.initializeDb();
    const db = vectorIndex.getDb();
    if (!db) {
      return createMCPErrorResponse({
        tool: 'memory_causal_link',
        error: 'Database not initialized. Server may still be starting up.',
        code: 'E020',
        details: {},
        recovery: getRecoveryHint('memory_causal_link', 'E020'),
        startTime: startTime
      });
    }
    causalEdges.init(db);

    const validRelations = Object.values(causalEdges.RELATION_TYPES) as string[];
    if (!validRelations.includes(relation)) {
      return createMCPErrorResponse({
        tool: 'memory_causal_link',
        error: `Invalid relation type: '${relation}'. Must be one of: ${validRelations.join(', ')}`,
        code: ErrorCodes.CAUSAL_INVALID_RELATION,
        details: { relation, validRelations },
        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_INVALID_RELATION),
        startTime: startTime
      });
    }
    const safeRelation = relation as causalEdges.RelationType;
    const edge = causalEdges.insertEdge(String(sourceId), String(targetId), safeRelation, strength ?? 1.0, evidence ?? null);

    if (!edge) {
      return createMCPErrorResponse({
        tool: 'memory_causal_link',
        error: 'Causal link creation failed.',
        code: ErrorCodes.CAUSAL_GRAPH_ERROR,
        details: { sourceId, targetId, relation },
        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_GRAPH_ERROR),
        startTime: startTime
      });
    }

    return createMCPSuccessResponse({
      tool: 'memory_causal_link',
      summary: `Created causal link: ${sourceId} --[${relation}]--> ${targetId}`,
      data: {
        success: true,
        edge
      },
      hints: [
        `Use memory_drift_why({ memoryId: "${targetId}" }) to trace this relationship`,
        'Use memory_causal_stats() to check overall graph coverage'
      ],
      startTime: startTime
    });
  } catch (error: unknown) {
    return createSanitizedCausalError(
      'memory_causal_link',
      error,
      ErrorCodes.CAUSAL_GRAPH_ERROR,
      { sourceId, targetId, relation },
      startTime,
      'Causal link creation failed.',
    );
  }
}

/* ───────────────────────────────────────────────────────────────
   4. CAUSAL GRAPH STATS HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_causal_stats tool - returns graph coverage and health metrics */
async function handleMemoryCausalStats(_args: CausalStatsArgs): Promise<MCPResponse> {
  const startTime = Date.now();

  try {
    await checkDatabaseUpdated();

    vectorIndex.initializeDb();
    const db = vectorIndex.getDb();
    if (!db) {
      return createMCPErrorResponse({
        tool: 'memory_causal_stats',
        error: 'Database not initialized. Server may still be starting up.',
        code: 'E020',
        details: {},
        recovery: getRecoveryHint('memory_causal_stats', 'E020'),
        startTime: startTime
      });
    }
    causalEdges.init(db);

    const stats = causalEdges.getGraphStats();
    const orphanedEdges: CausalEdge[] = causalEdges.findOrphanedEdges();

    // Compute link coverage: unique memories linked / total memories
    const totalMemories = (db.prepare('SELECT COUNT(*) as count FROM memory_index') as import('better-sqlite3').Statement).get() as { count: number };
    const uniqueLinked = new Set<string>();

    // Count unique memory IDs that appear as source or target
    try {
      const linkedRows = (db.prepare(
        'SELECT DISTINCT source_id FROM causal_edges WHERE EXISTS (SELECT 1 FROM memory_index WHERE CAST(id AS TEXT) = source_id) UNION SELECT DISTINCT target_id FROM causal_edges WHERE EXISTS (SELECT 1 FROM memory_index WHERE CAST(id AS TEXT) = target_id)'
      ) as import('better-sqlite3').Statement).all() as Array<{ source_id: string }>;
      for (const row of linkedRows) {
        uniqueLinked.add(row.source_id);
      }
    } catch (error: unknown) {
      const message = toErrorMessage(error).toLowerCase();
      if (message.includes('no such table') && message.includes('causal_edges')) {
        // New/partially initialized DB where causal edges table is absent.
        // Coverage remains 0 in this case.
      } else {
        throw error;
      }
    }

    const safeTotalEdges = stats.totalEdges ?? 0;
    const coveragePercent = totalMemories.count > 0
      ? Math.round((uniqueLinked.size / totalMemories.count) * 10000) / 100
      : 0;

    const meetsTarget = coveragePercent >= 60;
    const health = orphanedEdges.length === 0 ? 'healthy' : 'has_orphans';

    const summary = `Causal graph: ${safeTotalEdges} edges, ${coveragePercent}% coverage (${health})`;

    const hints: string[] = [];
    if (!meetsTarget) {
      hints.push(`Coverage ${coveragePercent}% below 60% target - add more causal links`);
    }
    if (orphanedEdges.length > 0) {
      hints.push(`${orphanedEdges.length} orphaned edges detected - consider cleanup`);
    }
    if (stats.totalEdges === 0) {
      hints.push('No causal links exist yet - use memory_causal_link to create relationships');
    }

    return createMCPSuccessResponse({
      tool: 'memory_causal_stats',
      summary,
      data: {
        total_edges: safeTotalEdges,
        by_relation: stats.byRelation,
        avg_strength: stats.avgStrength,
        unique_sources: stats.uniqueSources,
        unique_targets: stats.uniqueTargets,
        link_coverage_percent: coveragePercent + '%',
        orphanedEdges: orphanedEdges.length,
        health,
        targetCoverage: '60%',
        currentCoverage: coveragePercent + '%',
        meetsTarget: meetsTarget
      },
      hints,
      startTime: startTime
    });
  } catch (error: unknown) {
    return createSanitizedCausalError(
      'memory_causal_stats',
      error,
      ErrorCodes.CAUSAL_GRAPH_ERROR,
      {},
      startTime,
      'Causal graph statistics failed.',
    );
  }
}

/* ───────────────────────────────────────────────────────────────
   5. CAUSAL UNLINK HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_causal_unlink tool - deletes a causal edge by ID */
async function handleMemoryCausalUnlink(args: CausalUnlinkArgs): Promise<MCPResponse> {
  const { edgeId } = args;
  const startTime = Date.now();

  if (edgeId === undefined || edgeId === null) {
    return createMCPErrorResponse({
      tool: 'memory_causal_unlink',
      error: 'edgeId is required',
      code: 'E031',
      details: { param: 'edgeId' },
      recovery: {
        hint: 'Provide the edge ID to delete',
        actions: [
          'Use memory_drift_why() to find edge IDs',
          'Use memory_causal_stats() to see graph overview'
        ],
        severity: 'error'
      },
      startTime: startTime
    });
  }

  try {
    await checkDatabaseUpdated();

    vectorIndex.initializeDb();
    const db = vectorIndex.getDb();
    if (!db) {
      return createMCPErrorResponse({
        tool: 'memory_causal_unlink',
        error: 'Database not initialized. Server may still be starting up.',
        code: 'E020',
        details: {},
        recovery: getRecoveryHint('memory_causal_unlink', 'E020'),
        startTime: startTime
      });
    }
    causalEdges.init(db);

    const result: { deleted: boolean } = { deleted: causalEdges.deleteEdge(edgeId) };

    const summary = result.deleted
      ? `Deleted causal edge ${edgeId}`
      : `Edge ${edgeId} not found`;

    const hints: string[] = [];
    if (!result.deleted) {
      hints.push('Use memory_drift_why() to find valid edge IDs');
    }

    return createMCPSuccessResponse({
      tool: 'memory_causal_unlink',
      summary,
      data: result,
      hints,
      startTime: startTime
    });
  } catch (error: unknown) {
    return createSanitizedCausalError(
      'memory_causal_unlink',
      error,
      ErrorCodes.CAUSAL_GRAPH_ERROR,
      { edgeId },
      startTime,
      'Causal edge deletion failed.',
    );
  }
}

/* ───────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  handleMemoryDriftWhy,
  handleMemoryCausalLink,
  handleMemoryCausalStats,
  handleMemoryCausalUnlink,
  flattenCausalTree,
};

// Backward-compatible aliases (snake_case)
const handle_memory_drift_why = handleMemoryDriftWhy;
const handle_memory_causal_link = handleMemoryCausalLink;
const handle_memory_causal_stats = handleMemoryCausalStats;
const handle_memory_causal_unlink = handleMemoryCausalUnlink;

export {
  handle_memory_drift_why,
  handle_memory_causal_link,
  handle_memory_causal_stats,
  handle_memory_causal_unlink,
};

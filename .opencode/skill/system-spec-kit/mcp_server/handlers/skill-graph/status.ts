// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Status Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for skill_graph_status — reports counts,
// validation summary, and source staleness for the skill graph.

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as skillGraphDb from '../../lib/skill-graph/skill-graph-db.js';

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────

const SUPPORTED_SCHEMA_VERSIONS = new Set([1, 2]);
const WEIGHT_BANDS: Record<string, readonly [number, number]> = {
  depends_on: [0.7, 1.0],
  prerequisite_for: [0.7, 1.0],
  enhances: [0.3, 0.7],
  siblings: [0.4, 0.6],
  conflicts_with: [0.5, 1.0],
};

type HandlerResponse = { content: Array<{ type: string; text: string }> };

interface CountRow {
  count: number;
}

interface GroupCountRow {
  name: string;
  count: number;
}

interface SourceRow {
  skillId: string;
  schemaVersion: number;
  sourcePath: string | null;
  contentHash: string | null;
  indexedAt: string | null;
}

interface EdgeRow {
  sourceId: string;
  targetId: string;
  edgeType: string;
  weight: number;
}

// ───────────────────────────────────────────────────────────────
// 2. HANDLER
// ───────────────────────────────────────────────────────────────

/** Handle skill_graph_status tool call */
export async function handleSkillGraphStatus(): Promise<HandlerResponse> {
  try {
    const db = skillGraphDb.getDb();
    const totalSkills = getCount(
      db.prepare('SELECT COUNT(*) AS count FROM skill_nodes').get() as CountRow | undefined,
    );
    const totalEdges = getCount(
      db.prepare('SELECT COUNT(*) AS count FROM skill_edges').get() as CountRow | undefined,
    );
    const families = db.prepare(`
      SELECT family AS name, COUNT(*) AS count
      FROM skill_nodes
      GROUP BY family
      ORDER BY family
    `).all() as GroupCountRow[];
    const categories = db.prepare(`
      SELECT category AS name, COUNT(*) AS count
      FROM skill_nodes
      GROUP BY category
      ORDER BY category
    `).all() as GroupCountRow[];
    const schemaVersions = db.prepare(`
      SELECT CAST(schema_version AS TEXT) AS name, COUNT(*) AS count
      FROM skill_nodes
      GROUP BY schema_version
      ORDER BY schema_version
    `).all() as GroupCountRow[];
    const sourceRows = db.prepare(`
      SELECT
        id AS skillId,
        schema_version AS schemaVersion,
        source_path AS sourcePath,
        content_hash AS contentHash,
        indexed_at AS indexedAt
      FROM skill_nodes
      ORDER BY id
    `).all() as SourceRow[];
    const edgeRows = db.prepare(`
      SELECT
        source_id AS sourceId,
        target_id AS targetId,
        edge_type AS edgeType,
        weight
      FROM skill_edges
      ORDER BY source_id, edge_type, target_id
    `).all() as EdgeRow[];

    const staleness = summarizeSourceStaleness(sourceRows);
    const validation = summarizeValidation(sourceRows, edgeRows);
    const lastIndexedAt = sourceRows
      .map((row) => row.indexedAt)
      .filter((value): value is string => typeof value === 'string' && value.length > 0)
      .sort()
      .at(-1) ?? null;

    return okResponse({
      totalSkills,
      totalEdges,
      lastIndexedAt,
      families,
      categories,
      schemaVersions,
      staleness,
      validation,
      dbStatus: totalSkills > 0 ? 'ready' : 'empty',
    });
  } catch (err: unknown) {
    return errorResponse(
      `Skill graph status failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function summarizeSourceStaleness(sourceRows: SourceRow[]): Record<string, unknown> {
  let missingSourceFiles = 0;
  let changedSourceFiles = 0;
  let freshSourceFiles = 0;

  const staleSkills: string[] = [];

  for (const row of sourceRows) {
    const resolvedPath = resolveSourcePath(row.sourcePath);
    if (!resolvedPath || !existsSync(resolvedPath)) {
      missingSourceFiles++;
      staleSkills.push(row.skillId);
      continue;
    }

    if (!row.contentHash) {
      changedSourceFiles++;
      staleSkills.push(row.skillId);
      continue;
    }

    const currentHash = createHash('sha256')
      .update(readFileSync(resolvedPath))
      .digest('hex');

    if (currentHash !== row.contentHash) {
      changedSourceFiles++;
      staleSkills.push(row.skillId);
      continue;
    }

    freshSourceFiles++;
  }

  return {
    trackedSkills: sourceRows.length,
    freshSourceFiles,
    changedSourceFiles,
    missingSourceFiles,
    staleSkillIds: staleSkills.slice(0, 25),
  };
}

function summarizeValidation(
  sourceRows: SourceRow[],
  edgeRows: EdgeRow[],
): Record<string, unknown> {
  const nodeIds = new Set(sourceRows.map((row) => row.skillId));
  const unsupportedSchemaVersionCount = sourceRows.filter((row) => {
    return !SUPPORTED_SCHEMA_VERSIONS.has(row.schemaVersion);
  }).length;

  const brokenEdgeCount = edgeRows.filter((edge) => {
    return !nodeIds.has(edge.sourceId) || !nodeIds.has(edge.targetId);
  }).length;

  const weightBandViolations = edgeRows.filter((edge) => {
    const band = WEIGHT_BANDS[edge.edgeType];
    return band ? edge.weight < band[0] || edge.weight > band[1] : false;
  }).length;

  return {
    brokenEdgeCount,
    weightBandViolations,
    unsupportedSchemaVersionCount,
    isHealthy: brokenEdgeCount === 0 && unsupportedSchemaVersionCount === 0,
  };
}

function resolveSourcePath(sourcePath: string | null): string | null {
  if (!sourcePath || sourcePath.trim().length === 0) {
    return null;
  }

  return sourcePath.startsWith('/')
    ? sourcePath
    : resolve(process.cwd(), sourcePath);
}

function getCount(row: CountRow | undefined): number {
  return row?.count ?? 0;
}

function okResponse(data: Record<string, unknown>): HandlerResponse {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data }),
    }],
  };
}

function errorResponse(error: string): HandlerResponse {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'error', error }),
    }],
  };
}

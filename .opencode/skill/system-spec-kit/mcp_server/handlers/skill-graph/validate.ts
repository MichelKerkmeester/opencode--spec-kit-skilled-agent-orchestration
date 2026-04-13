// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Validate Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for skill_graph_validate — validates the live
// SQLite skill graph against schema, edge, and weight rules.

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

interface SkillNodeRow {
  skillId: string;
  schemaVersion: number;
}

interface SkillEdgeRow {
  sourceId: string;
  targetId: string;
  edgeType: string;
  weight: number;
}

// ───────────────────────────────────────────────────────────────
// 2. HANDLER
// ───────────────────────────────────────────────────────────────

/** Handle skill_graph_validate tool call */
export async function handleSkillGraphValidate(): Promise<HandlerResponse> {
  try {
    const db = skillGraphDb.getDb();
    const nodes = db.prepare(`
      SELECT
        id AS skillId,
        schema_version AS schemaVersion
      FROM skill_nodes
      ORDER BY id
    `).all() as SkillNodeRow[];
    const edges = db.prepare(`
      SELECT
        source_id AS sourceId,
        target_id AS targetId,
        edge_type AS edgeType,
        weight
      FROM skill_edges
      ORDER BY source_id, edge_type, target_id
    `).all() as SkillEdgeRow[];

    const nodeIds = new Set(nodes.map((node) => node.skillId));
    const dependsOnMap = buildEdgeTargetMap(edges, 'depends_on');
    const prerequisiteMap = buildEdgeTargetMap(edges, 'prerequisite_for');
    const siblingsMap = buildEdgeTargetMap(edges, 'siblings');

    const schemaVersionErrors = nodes
      .filter((node) => !SUPPORTED_SCHEMA_VERSIONS.has(node.schemaVersion))
      .map((node) => `SCHEMA: ${node.skillId} schema_version ${node.schemaVersion} is not supported`);

    const brokenEdgeErrors = edges
      .filter((edge) => !nodeIds.has(edge.sourceId) || !nodeIds.has(edge.targetId))
      .map((edge) => `BROKEN-EDGE: ${edge.sourceId} ${edge.edgeType} ${edge.targetId} references a missing node`);

    const dependencyCycleErrors = findDependencyCycleErrors(dependsOnMap);

    const weightBandWarnings = edges
      .filter((edge) => {
        const band = WEIGHT_BANDS[edge.edgeType];
        return band ? edge.weight < band[0] || edge.weight > band[1] : false;
      })
      .map((edge) => {
        const band = WEIGHT_BANDS[edge.edgeType]!;
        return `WEIGHT-BAND: ${edge.sourceId} ${edge.edgeType} ${edge.targetId} weight ${edge.weight} outside recommended band [${band[0]}, ${band[1]}]`;
      });

    const symmetryWarnings = [
      ...findDependsOnSymmetryWarnings(dependsOnMap, prerequisiteMap),
      ...findSiblingSymmetryWarnings(siblingsMap),
    ];
    const weightParityWarnings = [
      ...findReciprocalWeightWarnings(edges, 'depends_on', 'prerequisite_for'),
      ...findSiblingWeightWarnings(edges),
    ];

    const orphanWarnings = nodes
      .filter((node) => !edges.some((edge) => edge.sourceId === node.skillId || edge.targetId === node.skillId))
      .map((node) => `ORPHAN: ${node.skillId} has zero edges`);

    const errors = [
      ...schemaVersionErrors,
      ...brokenEdgeErrors,
      ...dependencyCycleErrors,
    ];
    const warnings = [
      ...weightBandWarnings,
      ...symmetryWarnings,
      ...weightParityWarnings,
      ...orphanWarnings,
    ];

    return okResponse({
      isValid: errors.length === 0,
      errorCount: errors.length,
      warningCount: warnings.length,
      checkedNodes: nodes.length,
      checkedEdges: edges.length,
      errors,
      warnings,
    });
  } catch (err: unknown) {
    return errorResponse(
      `Skill graph validation failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function buildEdgeTargetMap(
  edges: SkillEdgeRow[],
  edgeType: string,
): Map<string, Set<string>> {
  const targetMap = new Map<string, Set<string>>();

  for (const edge of edges) {
    if (edge.edgeType !== edgeType) {
      continue;
    }

    const targets = targetMap.get(edge.sourceId) ?? new Set<string>();
    targets.add(edge.targetId);
    targetMap.set(edge.sourceId, targets);
  }

  return targetMap;
}

function buildReciprocalWeightMap(
  edges: SkillEdgeRow[],
  edgeType: string,
): Map<string, number> {
  const weightMap = new Map<string, number>();

  for (const edge of edges) {
    if (edge.edgeType !== edgeType) {
      continue;
    }

    weightMap.set(`${edge.sourceId}->${edge.targetId}`, edge.weight);
  }

  return weightMap;
}

function findDependencyCycleErrors(
  dependsOnMap: Map<string, Set<string>>,
): string[] {
  const errors: string[] = [];
  const seenCycles = new Set<string>();

  for (const [sourceId, targets] of dependsOnMap.entries()) {
    for (const targetId of targets) {
      if (!dependsOnMap.get(targetId)?.has(sourceId)) {
        continue;
      }

      const cycleKey = [sourceId, targetId].sort().join('::');
      if (seenCycles.has(cycleKey)) {
        continue;
      }

      seenCycles.add(cycleKey);
      errors.push(`CYCLE: depends_on cycle detected: ${sourceId} -> ${targetId} -> ${sourceId}`);
    }
  }

  return errors;
}

function findDependsOnSymmetryWarnings(
  dependsOnMap: Map<string, Set<string>>,
  prerequisiteMap: Map<string, Set<string>>,
): string[] {
  const warnings: string[] = [];

  for (const [sourceId, targets] of dependsOnMap.entries()) {
    for (const targetId of targets) {
      if (!prerequisiteMap.get(targetId)?.has(sourceId)) {
        warnings.push(
          `SYMMETRY: ${sourceId} depends_on ${targetId}, but ${targetId} missing prerequisite_for ${sourceId}`,
        );
      }
    }
  }

  return warnings;
}

function findSiblingSymmetryWarnings(
  siblingsMap: Map<string, Set<string>>,
): string[] {
  const warnings: string[] = [];

  for (const [sourceId, targets] of siblingsMap.entries()) {
    for (const targetId of targets) {
      if (!siblingsMap.get(targetId)?.has(sourceId)) {
        warnings.push(
          `SYMMETRY: ${sourceId} has sibling ${targetId}, but ${targetId} missing sibling ${sourceId}`,
        );
      }
    }
  }

  return warnings;
}

function findReciprocalWeightWarnings(
  edges: SkillEdgeRow[],
  edgeType: string,
  reciprocalEdgeType: string,
): string[] {
  const warnings: string[] = [];
  const reciprocalWeights = buildReciprocalWeightMap(edges, reciprocalEdgeType);

  for (const edge of edges) {
    if (edge.edgeType !== edgeType) {
      continue;
    }

    const reciprocalWeight = reciprocalWeights.get(`${edge.targetId}->${edge.sourceId}`);
    if (typeof reciprocalWeight !== 'number' || Math.abs(edge.weight - reciprocalWeight) <= 0.1) {
      continue;
    }

    warnings.push(
      `WEIGHT-PARITY: ${edge.sourceId} ${edgeType} ${edge.targetId} weight=${edge.weight} vs ${edge.targetId} ${reciprocalEdgeType} ${edge.sourceId} weight=${reciprocalWeight} (diff > 0.1)`,
    );
  }

  return warnings;
}

function findSiblingWeightWarnings(edges: SkillEdgeRow[]): string[] {
  const warnings: string[] = [];
  const siblingWeights = buildReciprocalWeightMap(edges, 'siblings');
  const seenPairs = new Set<string>();

  for (const edge of edges) {
    if (edge.edgeType !== 'siblings') {
      continue;
    }

    const pairKey = [edge.sourceId, edge.targetId].sort().join('::');
    if (seenPairs.has(pairKey)) {
      continue;
    }

    seenPairs.add(pairKey);
    const reciprocalWeight = siblingWeights.get(`${edge.targetId}->${edge.sourceId}`);
    if (typeof reciprocalWeight !== 'number' || Math.abs(edge.weight - reciprocalWeight) <= 0.1) {
      continue;
    }

    warnings.push(
      `WEIGHT-PARITY: ${edge.sourceId} siblings ${edge.targetId} weight=${edge.weight} vs ${edge.targetId} siblings ${edge.sourceId} weight=${reciprocalWeight} (diff > 0.1)`,
    );
  }

  return warnings;
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

// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Queries
// ───────────────────────────────────────────────────────────────
// Query helpers for the SQLite-backed skill graph.
// Uses prepared statements and mirrors the structural graph query patterns.

import type Database from 'better-sqlite3';
import {
  getDb,
  rowToSkillEdge,
  rowToSkillNode,
  type SkillEdge,
  type SkillFamily,
  type SkillNode,
} from './skill-graph-db.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface SkillGraphRelation {
  node: SkillNode;
  edge: SkillEdge;
  direction: 'inbound' | 'outbound';
}

export interface SkillGraphPath {
  nodes: SkillNode[];
  edges: SkillEdge[];
}

export interface SkillGraphHub {
  node: SkillNode;
  inboundCount: number;
}

export interface SkillGraphSubgraph {
  nodes: SkillNode[];
  edges: SkillEdge[];
}

interface PreparedStatements {
  nodeById: Database.Statement;
  dependsOn: Database.Statement;
  dependents: Database.Statement;
  enhances: Database.Statement;
  enhancedBy: Database.Statement;
  familyMembers: Database.Statement;
  conflictsOutgoing: Database.Statement;
  conflictsIncoming: Database.Statement;
  outgoingAny: Database.Statement;
  incomingAny: Database.Statement;
  hubSkills: Database.Statement;
  orphans: Database.Statement;
}

interface RelationRow {
  edge_id: number;
  edge_source_id: string;
  edge_target_id: string;
  edge_type: SkillEdge['edgeType'];
  edge_weight: number;
  edge_context: string;
  node_id: string;
  node_family: SkillNode['family'];
  node_category: string;
  node_schema_version: 1 | 2;
  node_domains: string | null;
  node_intent_signals: string | null;
  node_derived: string | null;
  node_source_path: string;
  node_content_hash: string;
  node_indexed_at: string | null;
}

const MAX_TRANSITIVE_DEPTH = 8;
const preparedStatementCache = new WeakMap<Database.Database, PreparedStatements>();

// ───────────────────────────────────────────────────────────────
// 2. PREPARED STATEMENTS
// ───────────────────────────────────────────────────────────────

function getPreparedStatements(database: Database.Database = getDb()): PreparedStatements {
  const cached = preparedStatementCache.get(database);
  if (cached) {
    return cached;
  }

  const selectRelationColumns = `
    e.id AS edge_id,
    e.source_id AS edge_source_id,
    e.target_id AS edge_target_id,
    e.edge_type AS edge_type,
    e.weight AS edge_weight,
    e.context AS edge_context,
    n.id AS node_id,
    n.family AS node_family,
    n.category AS node_category,
    n.schema_version AS node_schema_version,
    n.domains AS node_domains,
    n.intent_signals AS node_intent_signals,
    n.derived AS node_derived,
    n.source_path AS node_source_path,
    n.content_hash AS node_content_hash,
    n.indexed_at AS node_indexed_at
  `;

  const statements: PreparedStatements = {
    nodeById: database.prepare('SELECT * FROM skill_nodes WHERE id = ?'),
    dependsOn: database.prepare(`
      SELECT ${selectRelationColumns}
      FROM skill_edges e
      INNER JOIN skill_nodes n ON n.id = e.target_id
      WHERE e.source_id = ? AND e.edge_type = 'depends_on'
      ORDER BY e.weight DESC, n.id ASC
    `),
    dependents: database.prepare(`
      SELECT ${selectRelationColumns}
      FROM skill_edges e
      INNER JOIN skill_nodes n ON n.id = e.source_id
      WHERE e.target_id = ? AND e.edge_type = 'depends_on'
      ORDER BY e.weight DESC, n.id ASC
    `),
    enhances: database.prepare(`
      SELECT ${selectRelationColumns}
      FROM skill_edges e
      INNER JOIN skill_nodes n ON n.id = e.target_id
      WHERE e.source_id = ? AND e.edge_type = 'enhances'
      ORDER BY e.weight DESC, n.id ASC
    `),
    enhancedBy: database.prepare(`
      SELECT ${selectRelationColumns}
      FROM skill_edges e
      INNER JOIN skill_nodes n ON n.id = e.source_id
      WHERE e.target_id = ? AND e.edge_type = 'enhances'
      ORDER BY e.weight DESC, n.id ASC
    `),
    familyMembers: database.prepare(`
      SELECT *
      FROM skill_nodes
      WHERE family = ?
      ORDER BY id ASC
    `),
    conflictsOutgoing: database.prepare(`
      SELECT ${selectRelationColumns}
      FROM skill_edges e
      INNER JOIN skill_nodes n ON n.id = e.target_id
      WHERE e.source_id = ? AND e.edge_type = 'conflicts_with'
      ORDER BY e.weight DESC, n.id ASC
    `),
    conflictsIncoming: database.prepare(`
      SELECT ${selectRelationColumns}
      FROM skill_edges e
      INNER JOIN skill_nodes n ON n.id = e.source_id
      WHERE e.target_id = ? AND e.edge_type = 'conflicts_with'
      ORDER BY e.weight DESC, n.id ASC
    `),
    outgoingAny: database.prepare(`
      SELECT ${selectRelationColumns}
      FROM skill_edges e
      INNER JOIN skill_nodes n ON n.id = e.target_id
      WHERE e.source_id = ?
      ORDER BY e.weight DESC, n.id ASC
    `),
    incomingAny: database.prepare(`
      SELECT ${selectRelationColumns}
      FROM skill_edges e
      INNER JOIN skill_nodes n ON n.id = e.source_id
      WHERE e.target_id = ?
      ORDER BY e.weight DESC, n.id ASC
    `),
    hubSkills: database.prepare(`
      SELECT
        n.*,
        COUNT(e.id) AS inbound_count
      FROM skill_nodes n
      INNER JOIN skill_edges e ON e.target_id = n.id
      GROUP BY n.id
      HAVING COUNT(e.id) >= ?
      ORDER BY inbound_count DESC, n.id ASC
    `),
    orphans: database.prepare(`
      SELECT n.*
      FROM skill_nodes n
      LEFT JOIN skill_edges outgoing ON outgoing.source_id = n.id
      LEFT JOIN skill_edges incoming ON incoming.target_id = n.id
      WHERE outgoing.id IS NULL AND incoming.id IS NULL
      ORDER BY n.id ASC
    `),
  };

  preparedStatementCache.set(database, statements);
  return statements;
}

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function relationRowToResult(row: RelationRow, direction: 'inbound' | 'outbound'): SkillGraphRelation {
  return {
    direction,
    edge: rowToSkillEdge({
      id: row.edge_id,
      source_id: row.edge_source_id,
      target_id: row.edge_target_id,
      edge_type: row.edge_type,
      weight: row.edge_weight,
      context: row.edge_context,
    }),
    node: rowToSkillNode({
      id: row.node_id,
      family: row.node_family,
      category: row.node_category,
      schema_version: row.node_schema_version,
      domains: row.node_domains,
      intent_signals: row.node_intent_signals,
      derived: row.node_derived,
      source_path: row.node_source_path,
      content_hash: row.node_content_hash,
      indexed_at: row.node_indexed_at,
    }),
  };
}

function getNodeById(skillId: string, database: Database.Database = getDb()): SkillNode | null {
  const row = getPreparedStatements(database).nodeById.get(skillId) as Record<string, unknown> | undefined;
  return row ? rowToSkillNode(row) : null;
}

function dedupeRelations(relations: SkillGraphRelation[]): SkillGraphRelation[] {
  const deduped = new Map<string, SkillGraphRelation>();
  for (const relation of relations) {
    const key = relation.edge.id !== undefined
      ? String(relation.edge.id)
      : `${relation.edge.sourceId}:${relation.edge.edgeType}:${relation.edge.targetId}`;
    if (!deduped.has(key)) {
      deduped.set(key, relation);
    }
  }
  return [...deduped.values()];
}

function edgeKey(edge: SkillEdge): string {
  return edge.id !== undefined
    ? String(edge.id)
    : `${edge.sourceId}:${edge.edgeType}:${edge.targetId}`;
}

// ───────────────────────────────────────────────────────────────
// 4. QUERIES
// ───────────────────────────────────────────────────────────────

/** Get the skills a given skill depends on. */
export function dependsOn(skillId: string, database: Database.Database = getDb()): SkillGraphRelation[] {
  const rows = getPreparedStatements(database).dependsOn.all(skillId) as RelationRow[];
  return rows.map((row) => relationRowToResult(row, 'outbound'));
}

/** Get the skills that depend on a given skill. */
export function dependents(skillId: string, database: Database.Database = getDb()): SkillGraphRelation[] {
  const rows = getPreparedStatements(database).dependents.all(skillId) as RelationRow[];
  return rows.map((row) => relationRowToResult(row, 'inbound'));
}

/** Get the skills enhanced by a given skill. */
export function enhances(skillId: string, database: Database.Database = getDb()): SkillGraphRelation[] {
  const rows = getPreparedStatements(database).enhances.all(skillId) as RelationRow[];
  return rows.map((row) => relationRowToResult(row, 'outbound'));
}

/** Get the skills that enhance a given skill. */
export function enhancedBy(skillId: string, database: Database.Database = getDb()): SkillGraphRelation[] {
  const rows = getPreparedStatements(database).enhancedBy.all(skillId) as RelationRow[];
  return rows.map((row) => relationRowToResult(row, 'inbound'));
}

/** Get all skill nodes for a given family. */
export function familyMembers(family: SkillFamily, database: Database.Database = getDb()): SkillNode[] {
  const rows = getPreparedStatements(database).familyMembers.all(family) as Record<string, unknown>[];
  return rows.map(rowToSkillNode);
}

/** Get all conflict relationships for a given skill, regardless of direction. */
export function conflicts(skillId: string, database: Database.Database = getDb()): SkillGraphRelation[] {
  const statements = getPreparedStatements(database);
  const outgoingRows = statements.conflictsOutgoing.all(skillId) as RelationRow[];
  const incomingRows = statements.conflictsIncoming.all(skillId) as RelationRow[];

  return dedupeRelations([
    ...outgoingRows.map((row) => relationRowToResult(row, 'outbound')),
    ...incomingRows.map((row) => relationRowToResult(row, 'inbound')),
  ]);
}

/** Find the shortest outbound relationship path between two skills. */
export function transitivePath(
  fromSkillId: string,
  toSkillId: string,
  database: Database.Database = getDb(),
): SkillGraphPath | null {
  const startNode = getNodeById(fromSkillId, database);
  const targetNode = getNodeById(toSkillId, database);
  if (!startNode || !targetNode) {
    return null;
  }

  if (fromSkillId === toSkillId) {
    return { nodes: [startNode], edges: [] };
  }

  const statements = getPreparedStatements(database);
  const nodeCache = new Map<string, SkillNode>([
    [startNode.id, startNode],
    [targetNode.id, targetNode],
  ]);
  const queue: Array<{ nodeIds: string[]; edges: SkillEdge[] }> = [
    { nodeIds: [fromSkillId], edges: [] },
  ];
  const visited = new Set<string>([fromSkillId]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentId = current.nodeIds[current.nodeIds.length - 1];
    if (current.edges.length >= MAX_TRANSITIVE_DEPTH) {
      continue;
    }

    const rows = statements.outgoingAny.all(currentId) as RelationRow[];
    for (const row of rows) {
      const relation = relationRowToResult(row, 'outbound');
      nodeCache.set(relation.node.id, relation.node);

      if (visited.has(relation.node.id)) {
        continue;
      }

      const nextNodeIds = [...current.nodeIds, relation.node.id];
      const nextEdges = [...current.edges, relation.edge];
      if (relation.node.id === toSkillId) {
        return {
          nodes: nextNodeIds.map((nodeId) => nodeCache.get(nodeId) ?? getNodeById(nodeId, database)).filter(
            (node): node is SkillNode => node !== null,
          ),
          edges: nextEdges,
        };
      }

      visited.add(relation.node.id);
      queue.push({ nodeIds: nextNodeIds, edges: nextEdges });
    }
  }

  return null;
}

/** Get skills with at least the requested inbound edge count. */
export function hubSkills(minInbound: number = 1, database: Database.Database = getDb()): SkillGraphHub[] {
  const safeMinInbound = Number.isFinite(minInbound) ? Math.max(1, Math.trunc(minInbound)) : 1;
  const rows = getPreparedStatements(database).hubSkills.all(safeMinInbound) as Array<Record<string, unknown> & {
    inbound_count: number;
  }>;

  return rows.map((row) => ({
    node: rowToSkillNode(row),
    inboundCount: row.inbound_count,
  }));
}

/** Get skills that have no inbound or outbound edges. */
export function orphans(database: Database.Database = getDb()): SkillNode[] {
  const rows = getPreparedStatements(database).orphans.all() as Record<string, unknown>[];
  return rows.map(rowToSkillNode);
}

/** Get an N-hop neighborhood around a skill, traversing inbound and outbound relationships. */
export function subgraph(
  skillId: string,
  depth: number = 1,
  database: Database.Database = getDb(),
): SkillGraphSubgraph {
  const root = getNodeById(skillId, database);
  if (!root) {
    return { nodes: [], edges: [] };
  }

  const safeDepth = Number.isFinite(depth) ? Math.max(0, Math.min(Math.trunc(depth), MAX_TRANSITIVE_DEPTH)) : 1;
  const statements = getPreparedStatements(database);
  const nodes = new Map<string, SkillNode>([[root.id, root]]);
  const edges = new Map<string, SkillEdge>();
  const visited = new Set<string>([root.id]);
  const queue: Array<{ skillId: string; depth: number }> = [{ skillId: root.id, depth: 0 }];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.depth >= safeDepth) {
      continue;
    }

    const outgoingRows = statements.outgoingAny.all(current.skillId) as RelationRow[];
    const incomingRows = statements.incomingAny.all(current.skillId) as RelationRow[];
    const relations = [
      ...outgoingRows.map((row) => relationRowToResult(row, 'outbound')),
      ...incomingRows.map((row) => relationRowToResult(row, 'inbound')),
    ];

    for (const relation of relations) {
      nodes.set(relation.node.id, relation.node);
      edges.set(edgeKey(relation.edge), relation.edge);

      if (visited.has(relation.node.id)) {
        continue;
      }

      visited.add(relation.node.id);
      queue.push({
        skillId: relation.node.id,
        depth: current.depth + 1,
      });
    }
  }

  return {
    nodes: [...nodes.values()].sort((left, right) => left.id.localeCompare(right.id)),
    edges: [...edges.values()].sort((left, right) => {
      const sourceOrder = left.sourceId.localeCompare(right.sourceId);
      if (sourceOrder !== 0) return sourceOrder;
      const typeOrder = left.edgeType.localeCompare(right.edgeType);
      if (typeOrder !== 0) return typeOrder;
      return left.targetId.localeCompare(right.targetId);
    }),
  };
}

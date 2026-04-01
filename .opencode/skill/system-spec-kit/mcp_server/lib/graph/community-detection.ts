// ───────────────────────────────────────────────────────────────
// MODULE: Community Detection
// ───────────────────────────────────────────────────────────────

import type Database from 'better-sqlite3';

import { isCommunitySummariesEnabled } from '../search/search-flags.js';
import { getCommunities, storeCommunities } from './community-storage.js';

export interface CommunityResult {
  communityId: number;
  memberIds: number[];
  size: number;
  density: number;
}

type WeightedAdjacencyList = Map<number, Map<number, number>>;
type LegacyAdjacencyList = Map<string, Set<string>>;

type AssignmentInput = Map<string, number> | CommunityResult[];

const COMMUNITY_BOOST_FACTOR = 0.3;
const MIN_COMMUNITY_SIZE = 3;
const MAX_PROPAGATION_ITERATIONS = 20;
const SCORE_EPSILON = 1e-9;

let lastFingerprint = '';
let cachedCommunities: CommunityResult[] = [];

export function resetCommunityDetectionState(): void {
  lastFingerprint = '';
  cachedCommunities = [];
}

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table' AND name = ?
  `).get(tableName) as { name?: string } | undefined;

  return row?.name === tableName;
}

function cloneCommunities(communities: CommunityResult[]): CommunityResult[] {
  return communities.map((community) => ({
    communityId: community.communityId,
    memberIds: [...community.memberIds],
    size: community.size,
    density: community.density,
  }));
}

function buildAdjacencyList(db: Database.Database): WeightedAdjacencyList {
  const adjacency: WeightedAdjacencyList = new Map();

  try {
    const rows = db.prepare(`
      SELECT source_id, target_id, COALESCE(strength, 1.0) AS strength
      FROM causal_edges
    `).all() as Array<{
      source_id: string;
      target_id: string;
      strength: number | null;
    }>;

    for (const row of rows) {
      const sourceId = Number.parseInt(String(row.source_id), 10);
      const targetId = Number.parseInt(String(row.target_id), 10);
      const weight = typeof row.strength === 'number' && Number.isFinite(row.strength)
        ? Math.max(0.1, row.strength)
        : 1.0;

      if (!Number.isFinite(sourceId) || !Number.isFinite(targetId)) {
        continue;
      }

      if (!adjacency.has(sourceId)) adjacency.set(sourceId, new Map());
      if (!adjacency.has(targetId)) adjacency.set(targetId, new Map());
      if (sourceId === targetId) {
        continue;
      }

      const sourceNeighbors = adjacency.get(sourceId);
      const targetNeighbors = adjacency.get(targetId);
      if (!sourceNeighbors || !targetNeighbors) {
        continue;
      }

      sourceNeighbors.set(targetId, (sourceNeighbors.get(targetId) ?? 0) + weight);
      targetNeighbors.set(sourceId, (targetNeighbors.get(sourceId) ?? 0) + weight);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-detection] Failed to build adjacency list: ${message}`);
  }

  return adjacency;
}

function buildLegacyAdjacency(adjacency: WeightedAdjacencyList): LegacyAdjacencyList {
  const legacy: LegacyAdjacencyList = new Map();

  for (const [nodeId, neighbors] of adjacency) {
    const nodeKey = String(nodeId);
    if (!legacy.has(nodeKey)) {
      legacy.set(nodeKey, new Set());
    }

    const nodeNeighbors = legacy.get(nodeKey);
    if (!nodeNeighbors) continue;

    for (const neighborId of neighbors.keys()) {
      nodeNeighbors.add(String(neighborId));
    }
  }

  return legacy;
}

function buildFingerprint(db: Database.Database): string {
  try {
    const row = db.prepare(`
      SELECT
        COUNT(*) AS edge_count,
        COALESCE(SUM(CAST(source_id AS INTEGER)), 0) AS source_sum,
        COALESCE(SUM(CAST(target_id AS INTEGER)), 0) AS target_sum,
        COALESCE(SUM(CAST(COALESCE(strength, 1.0) * 1000 AS INTEGER)), 0) AS strength_sum
      FROM causal_edges
    `).get() as {
      edge_count: number;
      source_sum: number;
      target_sum: number;
      strength_sum: number;
    } | undefined;

    return [
      row?.edge_count ?? 0,
      row?.source_sum ?? 0,
      row?.target_sum ?? 0,
      row?.strength_sum ?? 0,
    ].join(':');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-detection] Failed to build graph fingerprint: ${message}`);
    return '';
  }
}

function runLabelPropagation(adjacency: WeightedAdjacencyList): Map<number, number> {
  const nodes = Array.from(adjacency.keys()).sort((left, right) => left - right);
  const labels = new Map<number, number>();

  for (const nodeId of nodes) {
    labels.set(nodeId, nodeId);
  }

  for (let iteration = 0; iteration < MAX_PROPAGATION_ITERATIONS; iteration++) {
    let changed = false;

    for (const nodeId of nodes) {
      const neighbors = adjacency.get(nodeId);
      if (!neighbors || neighbors.size === 0) {
        continue;
      }

      const labelWeights = new Map<number, number>();
      for (const [neighborId, weight] of neighbors) {
        const label = labels.get(neighborId) ?? neighborId;
        labelWeights.set(label, (labelWeights.get(label) ?? 0) + weight);
      }

      const currentLabel = labels.get(nodeId) ?? nodeId;
      let bestLabel = currentLabel;
      let bestWeight = labelWeights.get(currentLabel) ?? 0;

      for (const [candidateLabel, candidateWeight] of labelWeights) {
        const isBetter = candidateWeight > bestWeight + SCORE_EPSILON;
        const isTieBreak = Math.abs(candidateWeight - bestWeight) <= SCORE_EPSILON
          && candidateLabel < bestLabel;

        if (isBetter || isTieBreak) {
          bestLabel = candidateLabel;
          bestWeight = candidateWeight;
        }
      }

      if (bestLabel !== currentLabel) {
        labels.set(nodeId, bestLabel);
        changed = true;
      }
    }

    if (!changed) {
      break;
    }
  }

  return labels;
}

function groupMembers<T>(labels: Map<number, T>): Map<T, number[]> {
  const groups = new Map<T, number[]>();

  for (const [nodeId, label] of labels) {
    const members = groups.get(label) ?? [];
    members.push(nodeId);
    groups.set(label, members);
  }

  for (const members of groups.values()) {
    members.sort((left, right) => left - right);
  }

  return groups;
}

function mergeSmallCommunities(
  groups: Map<number, number[]>,
  adjacency: WeightedAdjacencyList,
): Map<number, number[]> {
  const normalizedGroups = new Map<number, number[]>();
  const nodeToCommunity = new Map<number, number>();

  for (const [communityId, memberIds] of groups) {
    const uniqueMemberIds = Array.from(new Set(memberIds)).sort((left, right) => left - right);
    normalizedGroups.set(communityId, uniqueMemberIds);
    for (const memberId of uniqueMemberIds) {
      nodeToCommunity.set(memberId, communityId);
    }
  }

  let changed = true;
  while (changed) {
    changed = false;
    const communitiesBySize = Array.from(normalizedGroups.entries())
      .sort((left, right) => {
        if (left[1].length !== right[1].length) {
          return left[1].length - right[1].length;
        }
        return left[0] - right[0];
      });

    for (const [communityId, originalMembers] of communitiesBySize) {
      const memberIds = normalizedGroups.get(communityId);
      if (!memberIds || memberIds.length >= MIN_COMMUNITY_SIZE) {
        continue;
      }

      const candidateWeights = new Map<number, number>();
      for (const memberId of originalMembers) {
        const neighbors = adjacency.get(memberId);
        if (!neighbors) continue;

        for (const [neighborId, weight] of neighbors) {
          const targetCommunity = nodeToCommunity.get(neighborId);
          if (targetCommunity === undefined || targetCommunity === communityId) {
            continue;
          }
          candidateWeights.set(targetCommunity, (candidateWeights.get(targetCommunity) ?? 0) + weight);
        }
      }

      let bestTarget: number | null = null;
      let bestWeight = -1;
      let bestTargetSize = -1;
      for (const [candidateId, candidateWeight] of candidateWeights) {
        const candidateSize = normalizedGroups.get(candidateId)?.length ?? 0;
        const isBetter = candidateWeight > bestWeight + SCORE_EPSILON;
        const isSameWeight = Math.abs(candidateWeight - bestWeight) <= SCORE_EPSILON;
        const isLargerTarget = isSameWeight && candidateSize > bestTargetSize;
        const isLowerId = isSameWeight && candidateSize === bestTargetSize
          && bestTarget !== null
          && candidateId < bestTarget;

        if (isBetter || isLargerTarget || isLowerId || bestTarget === null) {
          bestTarget = candidateId;
          bestWeight = candidateWeight;
          bestTargetSize = candidateSize;
        }
      }

      if (bestTarget === null) {
        continue;
      }

      const targetMembers = normalizedGroups.get(bestTarget) ?? [];
      const mergedMembers = Array.from(new Set([...targetMembers, ...memberIds]))
        .sort((left, right) => left - right);

      normalizedGroups.set(bestTarget, mergedMembers);
      normalizedGroups.delete(communityId);
      for (const memberId of memberIds) {
        nodeToCommunity.set(memberId, bestTarget);
      }
      changed = true;
    }
  }

  const rebuilt = new Map<number, number[]>();
  for (const [memberId, communityId] of nodeToCommunity) {
    const members = rebuilt.get(communityId) ?? [];
    members.push(memberId);
    rebuilt.set(communityId, members);
  }

  for (const members of rebuilt.values()) {
    members.sort((left, right) => left - right);
  }

  return rebuilt;
}

function computeDensity(memberIds: number[], adjacency: WeightedAdjacencyList): number {
  if (memberIds.length < 2) {
    return 0;
  }

  const memberSet = new Set(memberIds);
  let internalEdges = 0;

  for (const memberId of memberIds) {
    const neighbors = adjacency.get(memberId);
    if (!neighbors) continue;

    for (const neighborId of neighbors.keys()) {
      if (neighborId <= memberId) continue;
      if (memberSet.has(neighborId)) {
        internalEdges += 1;
      }
    }
  }

  const possibleEdges = (memberIds.length * (memberIds.length - 1)) / 2;
  if (possibleEdges === 0) {
    return 0;
  }

  return Number((internalEdges / possibleEdges).toFixed(4));
}

function buildCommunityResults(
  groups: Map<number, number[]>,
  adjacency: WeightedAdjacencyList,
  minimumSize: number,
): CommunityResult[] {
  return Array.from(groups.values())
    .map((memberIds) => Array.from(new Set(memberIds)).sort((left, right) => left - right))
    .filter((memberIds) => memberIds.length >= minimumSize)
    .sort((left, right) => {
      if (left[0] !== right[0]) {
        return left[0] - right[0];
      }
      return left.length - right.length;
    })
    .map((memberIds, index) => ({
      communityId: index + 1,
      memberIds,
      size: memberIds.length,
      density: computeDensity(memberIds, adjacency),
    }));
}

function buildAssignmentsFromCommunities(communities: CommunityResult[]): Map<string, number> {
  const assignments = new Map<string, number>();

  for (const community of communities) {
    for (const memberId of community.memberIds) {
      assignments.set(String(memberId), community.communityId);
    }
  }

  return assignments;
}

function buildCommunitiesFromAssignments(
  db: Database.Database,
  assignments: Map<string, number>,
): CommunityResult[] {
  const adjacency = buildAdjacencyList(db);
  const groups = new Map<number, number[]>();

  for (const [nodeId, communityId] of assignments) {
    const numericId = Number.parseInt(nodeId, 10);
    if (!Number.isFinite(numericId)) {
      continue;
    }

    const members = groups.get(communityId) ?? [];
    members.push(numericId);
    groups.set(communityId, members);
  }

  return buildCommunityResults(groups, adjacency, 1);
}

function loadLegacyAssignments(db: Database.Database): Map<string, number> {
  const assignments = new Map<string, number>();
  if (!tableExists(db, 'community_assignments')) {
    return assignments;
  }

  try {
    const rows = db.prepare(`
      SELECT memory_id, community_id
      FROM community_assignments
    `).all() as Array<{ memory_id: number; community_id: number }>;

    for (const row of rows) {
      assignments.set(String(row.memory_id), row.community_id);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-detection] Failed to load legacy community assignments: ${message}`);
  }

  return assignments;
}

export function detectCommunitiesBFS(db: Database.Database): Map<string, number> {
  const adjacency = buildLegacyAdjacency(buildAdjacencyList(db));
  const visited = new Set<string>();
  const assignments = new Map<string, number>();
  let communityId = 0;

  for (const nodeId of adjacency.keys()) {
    if (visited.has(nodeId)) {
      continue;
    }

    const queue = [nodeId];
    let index = 0;
    visited.add(nodeId);

    while (index < queue.length) {
      const currentNodeId = queue[index++];
      assignments.set(currentNodeId, communityId);

      const neighbors = adjacency.get(currentNodeId);
      if (!neighbors) continue;

      for (const neighborId of neighbors) {
        if (visited.has(neighborId)) continue;
        visited.add(neighborId);
        queue.push(neighborId);
      }
    }

    communityId += 1;
  }

  return assignments;
}

export function shouldEscalateToLouvain(components: Map<string, number>): boolean {
  if (components.size === 0) {
    return false;
  }

  const counts = new Map<number, number>();
  for (const communityId of components.values()) {
    counts.set(communityId, (counts.get(communityId) ?? 0) + 1);
  }

  let largest = 0;
  for (const size of counts.values()) {
    if (size > largest) {
      largest = size;
    }
  }

  return largest > components.size * 0.5;
}

export function detectCommunitiesLouvain(adjacency: LegacyAdjacencyList): Map<string, number> {
  const nodes = Array.from(adjacency.keys()).sort();
  const labels = new Map<string, string>();

  for (const nodeId of nodes) {
    labels.set(nodeId, nodeId);
  }

  for (let iteration = 0; iteration < MAX_PROPAGATION_ITERATIONS; iteration++) {
    let changed = false;

    for (const nodeId of nodes) {
      const neighbors = adjacency.get(nodeId);
      if (!neighbors || neighbors.size === 0) {
        continue;
      }

      const labelCounts = new Map<string, number>();
      for (const neighborId of neighbors) {
        const label = labels.get(neighborId) ?? neighborId;
        labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1);
      }

      const currentLabel = labels.get(nodeId) ?? nodeId;
      let bestLabel = currentLabel;
      let bestCount = labelCounts.get(currentLabel) ?? 0;

      for (const [candidateLabel, candidateCount] of labelCounts) {
        const isBetter = candidateCount > bestCount;
        const isTieBreak = candidateCount === bestCount && candidateLabel < bestLabel;

        if (isBetter || isTieBreak) {
          bestLabel = candidateLabel;
          bestCount = candidateCount;
        }
      }

      if (bestLabel !== currentLabel) {
        labels.set(nodeId, bestLabel);
        changed = true;
      }
    }

    if (!changed) {
      break;
    }
  }

  const result = new Map<string, number>();
  const labelToCommunityId = new Map<string, number>();
  let nextCommunityId = 0;

  for (const nodeId of nodes) {
    const label = labels.get(nodeId) ?? nodeId;
    if (!labelToCommunityId.has(label)) {
      labelToCommunityId.set(label, nextCommunityId++);
    }
    result.set(nodeId, labelToCommunityId.get(label) ?? 0);
  }

  return result;
}

export function detectCommunities(db: Database.Database): CommunityResult[] {
  if (!isCommunitySummariesEnabled()) {
    return [];
  }

  try {
    const fingerprint = buildFingerprint(db);
    if (fingerprint !== '' && fingerprint === lastFingerprint) {
      return cloneCommunities(cachedCommunities);
    }

    const adjacency = buildAdjacencyList(db);
    if (adjacency.size === 0) {
      lastFingerprint = fingerprint;
      cachedCommunities = [];
      return [];
    }

    const labels = runLabelPropagation(adjacency);
    const groupedCommunities = groupMembers(labels);
    const mergedCommunities = mergeSmallCommunities(groupedCommunities, adjacency);
    const communities = buildCommunityResults(mergedCommunities, adjacency, MIN_COMMUNITY_SIZE);

    lastFingerprint = fingerprint;
    cachedCommunities = cloneCommunities(communities);
    return cloneCommunities(communities);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-detection] detectCommunities failed: ${message}`);
    return [];
  }
}

export function storeCommunityAssignments(
  db: Database.Database,
  assignmentsOrCommunities: AssignmentInput,
): { stored: number } {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS community_assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        memory_id INTEGER NOT NULL UNIQUE,
        community_id INTEGER NOT NULL,
        algorithm TEXT NOT NULL DEFAULT 'label_propagation',
        computed_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    const assignments = Array.isArray(assignmentsOrCommunities)
      ? buildAssignmentsFromCommunities(assignmentsOrCommunities)
      : assignmentsOrCommunities;

    const communities = Array.isArray(assignmentsOrCommunities)
      ? assignmentsOrCommunities
      : buildCommunitiesFromAssignments(db, assignmentsOrCommunities);

    const persist = db.transaction(() => {
      db.prepare('DELETE FROM community_assignments').run();
      const insert = db.prepare(`
        INSERT INTO community_assignments (memory_id, community_id, algorithm, computed_at)
        VALUES (?, ?, ?, ?)
      `);
      const timestamp = new Date().toISOString();
      let stored = 0;

      for (const [nodeId, communityId] of assignments) {
        const memoryId = Number.parseInt(nodeId, 10);
        if (!Number.isFinite(memoryId)) {
          continue;
        }

        insert.run(memoryId, communityId, 'label_propagation', timestamp);
        stored += 1;
      }

      storeCommunities(db, communities);
      return stored;
    });

    return { stored: persist() };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-detection] Failed to store community assignments: ${message}`);
    return { stored: 0 };
  }
}

export function getCommunityMembers(db: Database.Database, memoryId: number): number[] {
  try {
    const storedCommunities = getCommunities(db);
    for (const community of storedCommunities) {
      if (!community.memberIds.includes(memoryId)) {
        continue;
      }

      return community.memberIds
        .filter((memberId) => memberId !== memoryId)
        .sort((left, right) => left - right);
    }

    const legacyAssignments = loadLegacyAssignments(db);
    const legacyCommunityId = legacyAssignments.get(String(memoryId));
    if (legacyCommunityId === undefined) {
      return [];
    }

    return Array.from(legacyAssignments.entries())
      .filter(([nodeId, communityId]) => communityId === legacyCommunityId && Number.parseInt(nodeId, 10) !== memoryId)
      .map(([nodeId]) => Number.parseInt(nodeId, 10))
      .filter((nodeId) => Number.isFinite(nodeId))
      .sort((left, right) => left - right);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-detection] getCommunityMembers failed: ${message}`);
    return [];
  }
}

export function applyCommunityBoost(
  rows: Array<{ id: number; score?: number; [key: string]: unknown }>,
  db: Database.Database,
): Array<{ id: number; score?: number; [key: string]: unknown }> {
  try {
    if (!Array.isArray(rows) || rows.length === 0) {
      return rows;
    }

    const existingIds = new Set(rows.map((row) => row.id));
    const injectedRows: Array<{ id: number; score?: number; [key: string]: unknown }> = [];
    const maxInjectedRows = 3;

    for (const row of rows) {
      if (injectedRows.length >= maxInjectedRows) {
        break;
      }

      const communityMembers = getCommunityMembers(db, row.id);
      const baseScore = typeof row.score === 'number' && Number.isFinite(row.score)
        ? row.score
        : 1.0;
      const injectedScore = COMMUNITY_BOOST_FACTOR * baseScore;

      for (const memberId of communityMembers) {
        if (existingIds.has(memberId)) {
          continue;
        }
        if (injectedRows.length >= maxInjectedRows) {
          break;
        }

        existingIds.add(memberId);
        injectedRows.push({
          id: memberId,
          score: injectedScore,
          _communityBoosted: true,
        });
      }
    }

    return [...rows, ...injectedRows];
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-detection] applyCommunityBoost failed: ${message}`);
    return rows;
  }
}

export const __testables = {
  buildAdjacencyList,
  buildCommunitiesFromAssignments,
  computeDensity,
  mergeSmallCommunities,
};

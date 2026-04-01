// ───────────────────────────────────────────────────────────────
// MODULE: Community Storage
// ───────────────────────────────────────────────────────────────

import type Database from 'better-sqlite3';

import type { CommunityResult } from './community-detection.js';
import type { CommunitySummary } from './community-summaries.js';

export interface StoredCommunity extends CommunityResult {
  createdAt: string;
}

function tableExists(db: Database.Database, tableName: string): boolean {
  const row = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table' AND name = ?
  `).get(tableName) as { name?: string } | undefined;

  return row?.name === tableName;
}

function ensureGraphCommunitiesTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS graph_communities (
      community_id INTEGER PRIMARY KEY,
      member_ids TEXT NOT NULL,
      size INTEGER NOT NULL,
      density REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

function parseMemberIds(memberIdsJson: string): number[] {
  try {
    const parsed = JSON.parse(memberIdsJson) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value))
      .sort((left, right) => left - right);
  } catch {
    return [];
  }
}

export function storeCommunities(db: Database.Database, communities: CommunityResult[]): void {
  try {
    ensureGraphCommunitiesTable(db);

    const replaceAll = db.transaction(() => {
      db.prepare('DELETE FROM graph_communities').run();

      const insert = db.prepare(`
        INSERT INTO graph_communities (
          community_id,
          member_ids,
          size,
          density,
          created_at
        )
        VALUES (?, ?, ?, ?, ?)
      `);

      const createdAt = new Date().toISOString();
      for (const community of communities) {
        insert.run(
          community.communityId,
          JSON.stringify(community.memberIds),
          community.size,
          community.density,
          createdAt,
        );
      }
    });

    replaceAll();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-storage] Failed to store communities: ${message}`);
  }
}

export function getCommunities(db: Database.Database): StoredCommunity[] {
  try {
    if (!tableExists(db, 'graph_communities')) {
      return [];
    }

    const rows = db.prepare(`
      SELECT community_id, member_ids, size, density, created_at
      FROM graph_communities
      ORDER BY community_id ASC
    `).all() as Array<{
      community_id: number;
      member_ids: string;
      size: number;
      density: number;
      created_at: string;
    }>;

    return rows.map((row) => ({
      communityId: row.community_id,
      memberIds: parseMemberIds(row.member_ids),
      size: row.size,
      density: row.density,
      createdAt: row.created_at,
    }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-storage] Failed to load communities: ${message}`);
    return [];
  }
}

export function getCommunitySummaries(db: Database.Database): CommunitySummary[] {
  try {
    if (!tableExists(db, 'community_summaries')) {
      return [];
    }

    const rows = db.prepare(`
      SELECT community_id, summary, member_count, member_ids
      FROM community_summaries
      ORDER BY community_id ASC
    `).all() as Array<{
      community_id: number;
      summary: string;
      member_count: number;
      member_ids: string;
    }>;

    return rows.map((row) => ({
      communityId: row.community_id,
      summary: row.summary,
      memberCount: row.member_count,
      memberIds: parseMemberIds(row.member_ids),
    }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-storage] Failed to load community summaries: ${message}`);
    return [];
  }
}

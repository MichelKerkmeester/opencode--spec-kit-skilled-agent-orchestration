// ───────────────────────────────────────────────────────────────
// MODULE: Community Summaries
// ───────────────────────────────────────────────────────────────

import type Database from 'better-sqlite3';

import { isCommunitySummariesEnabled } from '../search/search-flags.js';
import type { CommunityResult } from './community-detection.js';

export interface CommunitySummary {
  communityId: number;
  summary: string;
  memberCount: number;
  memberIds: number[];
}

interface CommunityMemberRow {
  id: number;
  title: string | null;
  spec_folder: string | null;
  importance_tier: string | null;
}

const IMPORTANCE_ORDER: Record<string, number> = {
  constitutional: 0,
  critical: 1,
  important: 2,
  normal: 3,
  temporary: 4,
  deprecated: 5,
};

function ensureCommunitySummariesTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS community_summaries (
      community_id INTEGER PRIMARY KEY,
      summary TEXT NOT NULL,
      member_ids TEXT NOT NULL,
      member_count INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
}

function selectMemberRows(db: Database.Database, memberIds: number[]): CommunityMemberRow[] {
  if (memberIds.length === 0) {
    return [];
  }

  const placeholders = memberIds.map(() => '?').join(', ');
  const rows = db.prepare(`
    SELECT id, title, spec_folder, importance_tier
    FROM memory_index
    WHERE id IN (${placeholders})
  `).all(...memberIds) as CommunityMemberRow[];

  return rows.sort((left, right) => {
    const leftImportance = IMPORTANCE_ORDER[left.importance_tier ?? 'normal'] ?? IMPORTANCE_ORDER.normal;
    const rightImportance = IMPORTANCE_ORDER[right.importance_tier ?? 'normal'] ?? IMPORTANCE_ORDER.normal;
    if (leftImportance !== rightImportance) {
      return leftImportance - rightImportance;
    }

    return left.id - right.id;
  });
}

function formatList(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function buildSummary(communityId: number, memberIds: number[], rows: CommunityMemberRow[]): string {
  const topTitles = rows
    .map((row) => row.title?.trim())
    .filter((title): title is string => Boolean(title))
    .slice(0, 3);

  const folders = Array.from(new Set(
    rows
      .map((row) => row.spec_folder?.trim())
      .filter((folder): folder is string => Boolean(folder)),
  )).slice(0, 3);

  const sentences: string[] = [];
  const folderPhrase = folders.length > 0
    ? ` across ${folders.length} spec folder${folders.length === 1 ? '' : 's'}`
    : '';

  sentences.push(
    `Community ${communityId} groups ${memberIds.length} causally linked memories${folderPhrase}.`,
  );

  if (topTitles.length > 0) {
    const quotedTitles = topTitles.map((title) => `"${title}"`);
    sentences.push(`Key memories include ${formatList(quotedTitles)}.`);
  } else {
    const fallbackIds = memberIds.slice(0, 3).map(String);
    sentences.push(`The cluster is currently identified by member IDs ${formatList(fallbackIds)}.`);
  }

  if (folders.length > 0) {
    sentences.push(`It is most closely associated with ${formatList(folders)}.`);
  }

  return sentences.slice(0, 3).join(' ');
}

export function generateCommunitySummaries(
  db: Database.Database,
  communities: CommunityResult[],
): CommunitySummary[] {
  if (!isCommunitySummariesEnabled()) {
    return [];
  }

  try {
    ensureCommunitySummariesTable(db);

    const summaries: CommunitySummary[] = [];
    const replaceAll = db.transaction(() => {
      db.prepare('DELETE FROM community_summaries').run();

      const insert = db.prepare(`
        INSERT INTO community_summaries (
          community_id,
          summary,
          member_ids,
          member_count,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const timestamp = new Date().toISOString();
      for (const community of communities) {
        const memberRows = selectMemberRows(db, community.memberIds);
        const summary = buildSummary(
          community.communityId,
          community.memberIds,
          memberRows,
        );

        insert.run(
          community.communityId,
          summary,
          JSON.stringify(community.memberIds),
          community.memberIds.length,
          timestamp,
          timestamp,
        );

        summaries.push({
          communityId: community.communityId,
          summary,
          memberCount: community.memberIds.length,
          memberIds: [...community.memberIds],
        });
      }
    });

    replaceAll();
    return summaries;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[community-summaries] Failed to generate summaries: ${message}`);
    return [];
  }
}

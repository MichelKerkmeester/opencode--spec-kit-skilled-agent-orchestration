#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Rank Memories
// ---------------------------------------------------------------
// ───────────────────────────────────────────────────────────────
// 1. RANK MEMORIES
// ───────────────────────────────────────────────────────────────
// Computes composite ranking scores for memories and folders with recency decay

import * as fs from 'fs';
import * as path from 'path';

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS FROM FOLDER-SCORING
------------------------------------------------------------------*/

import {
  isArchived,
  getArchiveMultiplier,
  computeRecencyScore,
  computeSingleFolderScore,
  simplifyFolderPath,
  findTopTier,
  findLastActivity,
  TIER_WEIGHTS,
  SCORE_WEIGHTS,
  DECAY_RATE,
  TIER_ORDER,
} from '@spec-kit/shared/scoring/folder-scoring';
import type { FolderMemoryInput } from '@spec-kit/shared/scoring/folder-scoring';

/* ───────────────────────────────────────────────────────────────
   2. INTERFACES
------------------------------------------------------------------*/

/** Raw memory record read from input data. */
export interface RawMemory {
  id?: number;
  title?: string;
  specFolder?: string;
  importanceTier?: string;
  createdAt?: string;
  updatedAt?: string;
  filePath?: string | null;
  triggerCount?: number;
  importanceWeight?: number;
}

/** Memory record normalized for ranking and reporting. */
export interface NormalizedMemory {
  id: string | number;
  title: string;
  specFolder: string;
  importanceTier: string;
  createdAt: string;
  updatedAt: string;
  filePath: string | null;
  triggerCount: number;
  importanceWeight: number;
  /** Index signature for FolderMemoryInput compatibility (Record<string, unknown>) */
  [key: string]: unknown;
}

/** Ranked constitutional memory entry included in output summaries. */
export interface ConstitutionalEntry {
  id: string | number;
  title: string;
  specFolder: string;
  simplified: string;
}

/** Folder-level aggregate score entry used in ranking output. */
export interface FolderScoreEntry {
  folder: string;
  simplified: string;
  score: number;
  memoryCount: number;
  lastUpdate: string;
  lastUpdateRelative: string;
  topTier: string;
  isArchived: boolean;
}

/** Recent memory entry included in ranking summaries. */
export interface RecentMemoryEntry {
  id: string | number;
  title: string;
  specFolder: string;
  simplified: string;
  updatedAt: string;
  updatedAtRelative: string;
  tier: string;
}

/** Aggregate result returned from ranking memory records. */
export interface ProcessingResult {
  constitutional: ConstitutionalEntry[];
  recentlyActive: FolderScoreEntry[];
  highImportance: FolderScoreEntry[];
  recentMemories: RecentMemoryEntry[];
  stats: {
    totalMemories: number;
    totalFolders: number;
    activeFolders: number;
    archivedFolders: number;
    showingArchived: boolean;
  };
}

/** Options controlling memory ranking and output generation. */
export interface ProcessingOptions {
  showArchived?: boolean;
  folderLimit?: number;
  memoryLimit?: number;
}

/** CLI options accepted by the memory ranking script. */
export interface CLIOptions extends ProcessingOptions {
  format?: string;
  filePath?: string | null;
}

/* ───────────────────────────────────────────────────────────────
   3. HELPER FUNCTIONS
------------------------------------------------------------------*/

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return 'unknown';
  }

  const daysSince = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);

  if (daysSince < 0) return 'future';
  if (daysSince < 1 / 24) return 'just now';
  if (daysSince < 1) return `${Math.floor(daysSince * 24)}h ago`;
  if (daysSince < 7) return `${Math.floor(daysSince)}d ago`;
  if (daysSince < 30) return `${Math.floor(daysSince / 7)}w ago`;
  if (daysSince < 365) return `${Math.floor(daysSince / 30)}mo ago`;
  return `${Math.floor(daysSince / 365)}y ago`;
}

function formatFolderDisplay(folder: FolderScoreEntry): string {
  const name: string = folder.simplified || simplifyFolderPath(folder.folder);
  const count: number = folder.memoryCount || 0;
  const time: string = folder.lastUpdateRelative || formatRelativeTime(folder.lastUpdate);
  const scorePercent: number = Math.round((folder.score || 0) * 100);

  return `${name} (${count}, ${time}) ${scorePercent}%`;
}

function computeFolderScore(folderPath: string, folderMemories: NormalizedMemory[]): number {
  // NormalizedMemory is structurally compatible with FolderMemoryInput (id: string|number vs string is the only diff)
  const result = computeSingleFolderScore(folderPath, folderMemories as FolderMemoryInput[]);
  return result.score;
}

function normalizeMemory(m: RawMemory): NormalizedMemory {
  return {
    id: m.id ?? 0,
    title: m.title ?? 'Untitled',
    specFolder: m.specFolder ?? 'unknown',
    importanceTier: m.importanceTier ?? 'normal',
    createdAt: m.createdAt ?? new Date().toISOString(),
    updatedAt: m.updatedAt ?? m.createdAt ?? new Date().toISOString(),
    filePath: m.filePath ?? null,
    triggerCount: m.triggerCount ?? 0,
    importanceWeight: m.importanceWeight ?? 0.5
  };
}

/* ───────────────────────────────────────────────────────────────
   4. MAIN PROCESSING
------------------------------------------------------------------*/

function processMemories(rawMemories: RawMemory[], options: ProcessingOptions = {}): ProcessingResult {
  const {
    showArchived = false,
    folderLimit = 3,
    memoryLimit = 5
  } = options;

  const memories: NormalizedMemory[] = rawMemories.map(normalizeMemory);

  const constitutional: ConstitutionalEntry[] = memories
    .filter((m) => m.importanceTier === 'constitutional')
    .slice(0, folderLimit)
    .map((m) => ({
      id: m.id,
      title: m.title,
      specFolder: m.specFolder,
      simplified: simplifyFolderPath(m.specFolder)
    }));

  const folderMap = new Map<string, NormalizedMemory[]>();
  for (const memory of memories) {
    const folder = memory.specFolder || 'unknown';
    if (!folderMap.has(folder)) {
      folderMap.set(folder, []);
    }
    const folderList = folderMap.get(folder);
    if (folderList) folderList.push(memory);
  }

  const folderScores: FolderScoreEntry[] = [];
  for (const [folder, folderMemories] of folderMap) {
    const isArchivedFolder: boolean = isArchived(folder);

    if (isArchivedFolder && !showArchived) continue;

    const score: number = computeFolderScore(folder, folderMemories);
    const topTier: string = findTopTier(folderMemories as FolderMemoryInput[]);
    const lastActivity: string = findLastActivity(folderMemories as FolderMemoryInput[]);

    folderScores.push({
      folder,
      simplified: simplifyFolderPath(folder),
      score: Math.round(score * 1000) / 1000,
      memoryCount: folderMemories.length,
      lastUpdate: lastActivity,
      lastUpdateRelative: formatRelativeTime(lastActivity),
      topTier: topTier,
      isArchived: isArchivedFolder
    });
  }

  folderScores.sort((a, b) => b.score - a.score);

  const highImportance: FolderScoreEntry[] = folderScores
    .filter((f) => f.topTier === 'critical' || f.topTier === 'constitutional')
    .filter((f) => !f.isArchived)
    .slice(0, folderLimit);

  const recentlyActive: FolderScoreEntry[] = folderScores
    .filter((f) => !f.isArchived)
    .slice(0, folderLimit);

  const recentMemories: RecentMemoryEntry[] = [...memories]
    .filter((m) => m.importanceTier !== 'constitutional')
    .filter((m) => showArchived || !isArchived(m.specFolder))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, memoryLimit)
    .map((m) => ({
      id: m.id,
      title: m.title,
      specFolder: m.specFolder,
      simplified: simplifyFolderPath(m.specFolder),
      updatedAt: m.updatedAt,
      updatedAtRelative: formatRelativeTime(m.updatedAt),
      tier: m.importanceTier || 'normal'
    }));

  const allFolders: Array<{ folder: string; isArchived: boolean }> = [];
  for (const [folder] of folderMap) {
    allFolders.push({
      folder,
      isArchived: isArchived(folder)
    });
  }
  const archivedCount: number = allFolders.filter((f) => f.isArchived).length;

  return {
    constitutional,
    recentlyActive,
    highImportance,
    recentMemories,
    stats: {
      totalMemories: memories.length,
      totalFolders: folderMap.size,
      activeFolders: folderMap.size - archivedCount,
      archivedFolders: archivedCount,
      showingArchived: showArchived
    }
  };
}

/* ───────────────────────────────────────────────────────────────
   5. CLI INTERFACE
------------------------------------------------------------------*/

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');

    if (process.stdin.isTTY) {
      resolve('');
      return;
    }

    process.stdin.on('readable', () => {
      let chunk: string | null;
      while ((chunk = process.stdin.read() as string | null) !== null) {
        data += chunk;
      }
    });

    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {
    showArchived: false,
    folderLimit: 3,
    memoryLimit: 5,
    format: 'full',
    filePath: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--show-archived') {
      options.showArchived = true;
    } else if (arg === '--folder-limit' && args[i + 1]) {
      options.folderLimit = parseInt(args[++i], 10) || 3;
    } else if (arg === '--memory-limit' && args[i + 1]) {
      options.memoryLimit = parseInt(args[++i], 10) || 5;
    } else if (arg === '--format' && args[i + 1]) {
      options.format = args[++i];
    } else if (arg.startsWith('--file=')) {
      options.filePath = arg.slice(7);
    } else if (!arg.startsWith('--') && (arg.endsWith('.json') || fs.existsSync(arg))) {
      options.filePath = arg;
    }
  }

  return options;
}

function showHelp(): void {
  console.log(`
rank-memories.js - Compute composite ranking scores for memories and folders

Usage:
  cat memories.json | node rank-memories.js [options]
  node rank-memories.js /path/to/memories.json [options]

Options:
  --show-archived     Include archived folders in output
  --folder-limit N    Max folders per section (default: 3)
  --memory-limit N    Max recent memories (default: 5)
  --format compact    Output format (compact|full)
  --help, -h          Show this help
`);
}

/* ───────────────────────────────────────────────────────────────
   6. ENTRY POINT
------------------------------------------------------------------*/

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  const options = parseArgs(args);

  let inputData: string;
  try {
    if (options.filePath) {
      inputData = fs.readFileSync(options.filePath, 'utf8');
    } else {
      inputData = await readStdin();
    }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error(`Error reading input: ${errMsg}`);
    process.exit(1);
  }

  if (!inputData || inputData.trim() === '') {
    console.error('Error: No input data provided. Pipe JSON or specify a file path.');
    console.error('Run with --help for usage information.');
    process.exit(1);
  }

  let parsedMemories: RawMemory[] | null = null;
  try {
    const parsed = JSON.parse(inputData) as unknown;
    if (Array.isArray(parsed)) {
      parsedMemories = parsed as RawMemory[];
    } else if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'results' in parsed &&
      Array.isArray((parsed as { results?: unknown }).results)
    ) {
      parsedMemories = (parsed as { results: RawMemory[] }).results;
    } else {
      throw new Error('Input JSON must be an array or an object with a results array');
    }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error(`Error parsing JSON: ${errMsg}`);
    process.exit(1);
    return;
  }

  if (!parsedMemories) {
    return;
  }

  const memories = parsedMemories;
  const result = processMemories(memories, {
    showArchived: options.showArchived,
    folderLimit: options.folderLimit,
    memoryLimit: options.memoryLimit
  });

  if (options.format === 'compact') {
    console.log(JSON.stringify(result));
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
}

// Guard main() execution to prevent side effects on import
if (require.main === module) {
  main().catch((err: unknown) => {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${errMsg}`);
    process.exit(1);
  });
}

/* ───────────────────────────────────────────────────────────────
   7. EXPORTS
------------------------------------------------------------------*/

export {
  // Re-exported from folder-scoring
  isArchived,
  getArchiveMultiplier,
  computeRecencyScore,
  simplifyFolderPath,
  TIER_WEIGHTS,
  SCORE_WEIGHTS,
  DECAY_RATE,
  // Local functions
  formatRelativeTime,
  computeFolderScore,
  processMemories,
};

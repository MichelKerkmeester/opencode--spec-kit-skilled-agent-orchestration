#!/usr/bin/env node
// Feature catalog: Synthetic ground truth corpus
// ───────────────────────────────────────────────────────────────
// MODULE: Ground Truth ID Remapping
// ───────────────────────────────────────────────────────────────
// Remaps stale ground-truth memory IDs to live memory_index row IDs by
// searching the current memory_fts index. Re-run this script after major
// database re-indexing or when the context-index.sqlite snapshot changes.
//
// Usage:
//   npx tsx mcp_server/scripts/map-ground-truth-ids.ts
//   npx tsx mcp_server/scripts/map-ground-truth-ids.ts --dry-run
//   npx tsx mcp_server/scripts/map-ground-truth-ids.ts --db-path /abs/db.sqlite --gt-path /abs/ground-truth.json

import * as fs from 'fs';
import * as path from 'path';

import Database from 'better-sqlite3';

type RelevanceGrade = 1 | 2 | 3;

interface GroundTruthQuery {
  id: number;
  query: string;
  category: string;
  expectedResultDescription: string;
}

interface GroundTruthRelevance {
  queryId: number;
  memoryId: number;
  relevance: 0 | RelevanceGrade;
}

interface GroundTruthDocument {
  queries: GroundTruthQuery[];
  relevances: GroundTruthRelevance[];
}

interface CliOptions {
  dbPath: string;
  gtPath: string;
  dryRun: boolean;
}

interface SearchTerm {
  value: string;
  score: number;
  source: 'query' | 'description';
}

interface SearchRow {
  id: number;
  title: string | null;
  parent_id: number | null;
  file_path: string;
  score: number;
}

interface SearchMatch {
  memoryId: number;
  title: string | null;
  filePath: string;
  score: number;
  strategy: string;
}

interface MappingSummary {
  processedQueries: number;
  hardNegativeQueries: number;
  matchedQueries: number;
  unmatchedQueryIds: number[];
  relevanceRows: number;
  gradeCounts: Record<RelevanceGrade, number>;
  minMemoryId: number | null;
  maxMemoryId: number | null;
}

const DEFAULT_DB_PATH = path.resolve(__dirname, '../database/context-index.sqlite');
const DEFAULT_GT_PATH = path.resolve(__dirname, '../lib/eval/data/ground-truth.json');
const SEARCH_LIMIT = 12;
const MAX_RESULTS_PER_QUERY = 3;
const MAX_STRICT_TERMS = 5;
const MAX_FOCUSED_OR_TERMS = 8;
const MAX_BROAD_OR_TERMS = 12;

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'because', 'by', 'for',
  'from', 'has', 'have', 'how', 'i', 'if', 'in', 'into', 'is', 'it',
  'its', 'may', 'memory', 'no', 'not', 'of', 'on', 'or', 'related',
  'return', 'results', 'section', 'should', 'spec', 'surface', 'system',
  'tests', 'that', 'the', 'their', 'these', 'this', 'to', 'was', 'what',
  'when', 'which', 'with',
]);

const SEARCH_SQL = `
  SELECT
    m.id,
    m.title,
    m.parent_id,
    m.file_path,
    -bm25(memory_fts, 10.0, 5.0, 2.0, 1.0) AS score
  FROM memory_fts
  JOIN memory_index m ON m.id = memory_fts.rowid
  WHERE memory_fts MATCH ?
    AND (m.is_archived IS NULL OR m.is_archived = 0)
  ORDER BY score DESC
  LIMIT ?
`;

function parseArgs(argv: string[]): CliOptions {
  let dbPath = DEFAULT_DB_PATH;
  let gtPath = DEFAULT_GT_PATH;
  let dryRun = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (arg === '--db-path' && next) {
      dbPath = path.resolve(next);
      index += 1;
      continue;
    }

    if (arg.startsWith('--db-path=')) {
      dbPath = path.resolve(arg.slice('--db-path='.length));
      continue;
    }

    if (arg === '--gt-path' && next) {
      gtPath = path.resolve(next);
      index += 1;
      continue;
    }

    if (arg.startsWith('--gt-path=')) {
      gtPath = path.resolve(arg.slice('--gt-path='.length));
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { dbPath, gtPath, dryRun };
}

function assertFileExists(filePath: string, label: string): void {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} not found: ${filePath}`);
  }
}

function loadGroundTruth(gtPath: string): GroundTruthDocument {
  const raw = fs.readFileSync(gtPath, 'utf8');
  const parsed = JSON.parse(raw) as Partial<GroundTruthDocument>;

  if (!Array.isArray(parsed.queries) || !Array.isArray(parsed.relevances)) {
    throw new Error(`Invalid ground truth payload: expected queries[] and relevances[] in ${gtPath}`);
  }

  return parsed as GroundTruthDocument;
}

function sanitizeInputText(text: string): string[] {
  return text
    .replace(/\bNEAR\b/gi, ' ')
    .replace(/\bNOT\b/gi, ' ')
    .replace(/\bAND\b/gi, ' ')
    .replace(/\bOR\b/gi, ' ')
    .replace(/[\\/*^(){}\[\]":,;!?`|+=<>]/g, ' ')
    .split(/\s+/)
    .map(token => token.trim())
    .filter(Boolean)
    .map(token => token.replace(/^[-.]+|[-.]+$/g, ''))
    .filter(Boolean);
}

function scoreToken(token: string, source: 'query' | 'description'): number {
  const lower = token.toLowerCase();
  const hasSignalWord = lower.includes('.ts')
    || lower.includes('.md')
    || lower.includes('.json')
    || lower.startsWith('speckit_');

  let score = source === 'query' ? 2 : 0;

  if (/[A-Z]/.test(token)) score += 4;
  if (/\d/.test(token)) score += 3;
  if (/[._-]/.test(token)) score += 2;
  if (hasSignalWord) score += 2;
  if (token.length >= 12) score += 2;
  else if (token.length >= 8) score += 1;

  return score;
}

function buildSearchTerms(query: string, description: string): SearchTerm[] {
  const bestByToken = new Map<string, SearchTerm>();

  const collect = (text: string, source: 'query' | 'description'): void => {
    for (const token of sanitizeInputText(text)) {
      const lower = token.toLowerCase();
      const hasStrongSignal = /[A-Z0-9_.-]/.test(token) || token.length >= 8;

      if (!hasStrongSignal && (token.length < 3 || STOP_WORDS.has(lower))) {
        continue;
      }

      const candidate: SearchTerm = {
        value: token,
        score: scoreToken(token, source),
        source,
      };

      const existing = bestByToken.get(lower);
      if (!existing || candidate.score > existing.score) {
        bestByToken.set(lower, candidate);
      }
    }
  };

  collect(query, 'query');
  collect(description, 'description');

  return Array.from(bestByToken.values()).sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }
    if (left.source !== right.source) {
      return left.source === 'query' ? -1 : 1;
    }
    return right.value.length - left.value.length;
  });
}

function quoteToken(token: string): string {
  return `"${token.replace(/"/g, '')}"`;
}

function buildSearchStrategies(terms: SearchTerm[]): Array<{ name: string; query: string }> {
  const ordered = terms.map(term => term.value);
  const strictTerms = terms
    .filter(term => term.score >= 5)
    .slice(0, MAX_STRICT_TERMS)
    .map(term => term.value);

  const fallbackStrict = strictTerms.length > 0 ? strictTerms : ordered.slice(0, MAX_STRICT_TERMS);

  const rawStrategies = [
    {
      name: 'strict',
      query: fallbackStrict.map(quoteToken).join(' '),
    },
    {
      name: 'focused_or',
      query: ordered.slice(0, MAX_FOCUSED_OR_TERMS).map(quoteToken).join(' OR '),
    },
    {
      name: 'broad_or',
      query: ordered.slice(0, MAX_BROAD_OR_TERMS).map(quoteToken).join(' OR '),
    },
  ];

  const unique = new Set<string>();
  return rawStrategies.filter(strategy => {
    if (!strategy.query || unique.has(strategy.query)) {
      return false;
    }
    unique.add(strategy.query);
    return true;
  });
}

function getDedupKey(row: SearchRow): string {
  const title = (row.title ?? '').trim().toLowerCase();
  const filePath = row.file_path.trim().toLowerCase();
  return `${filePath}::${title || row.id}`;
}

function searchMemories(
  statement: Database.Statement,
  query: string,
  description: string,
): SearchMatch[] {
  const terms = buildSearchTerms(query, description);
  if (terms.length === 0) {
    return [];
  }

  const matches: SearchMatch[] = [];
  const seen = new Set<string>();

  for (const strategy of buildSearchStrategies(terms)) {
    let rows: SearchRow[] = [];

    try {
      rows = statement.all(strategy.query, SEARCH_LIMIT) as SearchRow[];
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[map-ground-truth-ids] FTS strategy "${strategy.name}" failed: ${message}`);
      continue;
    }

    for (const row of rows) {
      const dedupKey = getDedupKey(row);
      if (seen.has(dedupKey)) {
        continue;
      }

      seen.add(dedupKey);
      matches.push({
        memoryId: row.id,
        title: row.title,
        filePath: row.file_path,
        score: row.score,
        strategy: strategy.name,
      });

      if (matches.length >= MAX_RESULTS_PER_QUERY) {
        return matches;
      }
    }
  }

  return matches;
}

function buildRelevances(
  document: GroundTruthDocument,
  statement: Database.Statement,
): { relevances: GroundTruthRelevance[]; summary: MappingSummary } {
  const relevances: GroundTruthRelevance[] = [];
  const summary: MappingSummary = {
    processedQueries: 0,
    hardNegativeQueries: 0,
    matchedQueries: 0,
    unmatchedQueryIds: [],
    relevanceRows: 0,
    gradeCounts: {
      1: 0,
      2: 0,
      3: 0,
    },
    minMemoryId: null,
    maxMemoryId: null,
  };

  const grades: RelevanceGrade[] = [3, 2, 1];

  for (const query of document.queries) {
    if (query.category === 'hard_negative') {
      summary.hardNegativeQueries += 1;
      continue;
    }

    summary.processedQueries += 1;

    const matches = searchMemories(statement, query.query, query.expectedResultDescription ?? '');
    if (matches.length === 0) {
      summary.unmatchedQueryIds.push(query.id);
      continue;
    }

    summary.matchedQueries += 1;

    matches.forEach((match, index) => {
      const relevance = grades[index];
      relevances.push({
        queryId: query.id,
        memoryId: match.memoryId,
        relevance,
      });
      summary.gradeCounts[relevance] += 1;
      summary.relevanceRows += 1;
      summary.minMemoryId = summary.minMemoryId === null
        ? match.memoryId
        : Math.min(summary.minMemoryId, match.memoryId);
      summary.maxMemoryId = summary.maxMemoryId === null
        ? match.memoryId
        : Math.max(summary.maxMemoryId, match.memoryId);
    });
  }

  return { relevances, summary };
}

function writeAtomically(filePath: string, content: string): void {
  const directory = path.dirname(filePath);
  const tempPath = path.join(
    directory,
    `.${path.basename(filePath)}.tmp-${process.pid}-${Date.now()}`,
  );

  fs.writeFileSync(tempPath, content, 'utf8');

  try {
    fs.renameSync(tempPath, filePath);
  } catch (error: unknown) {
    try {
      fs.unlinkSync(tempPath);
    } catch {
      // Best-effort cleanup only.
    }
    throw error;
  }
}

function printSummary(summary: MappingSummary, options: CliOptions): void {
  console.log('Ground truth ID remapping summary');
  console.log(`Mode: ${options.dryRun ? 'dry-run' : 'live'}`);
  console.log(`Database: ${options.dbPath}`);
  console.log(`Ground truth: ${options.gtPath}`);
  console.log(`Queries processed: ${summary.processedQueries}`);
  console.log(`Hard negatives skipped: ${summary.hardNegativeQueries}`);
  console.log(`Matched queries: ${summary.matchedQueries}`);
  console.log(`Unmatched queries: ${summary.unmatchedQueryIds.length}`);
  console.log(`Relevance rows: ${summary.relevanceRows}`);
  console.log(
    `Grade distribution: 3=${summary.gradeCounts[3]}, 2=${summary.gradeCounts[2]}, 1=${summary.gradeCounts[1]}`,
  );

  if (summary.minMemoryId !== null && summary.maxMemoryId !== null) {
    console.log(`Memory ID range: ${summary.minMemoryId}..${summary.maxMemoryId}`);
  }

  if (summary.unmatchedQueryIds.length > 0) {
    console.log(`Unmatched query IDs: ${summary.unmatchedQueryIds.join(', ')}`);
  }
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));

  assertFileExists(options.dbPath, 'Database');
  assertFileExists(options.gtPath, 'Ground truth JSON');

  const document = loadGroundTruth(options.gtPath);
  const database = new Database(options.dbPath, { readonly: true, fileMustExist: true });

  try {
    const searchStatement = database.prepare(SEARCH_SQL);
    const { relevances, summary } = buildRelevances(document, searchStatement);
    const nextDocument: GroundTruthDocument = {
      ...document,
      relevances,
    };

    printSummary(summary, options);

    if (options.dryRun) {
      console.log('Dry run complete. No files were modified.');
      return;
    }

    writeAtomically(options.gtPath, `${JSON.stringify(nextDocument, null, 2)}\n`);
    console.log('Ground truth JSON updated successfully.');
  } finally {
    database.close();
  }
}

try {
  main();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[map-ground-truth-ids] ${message}`);
  process.exit(1);
}

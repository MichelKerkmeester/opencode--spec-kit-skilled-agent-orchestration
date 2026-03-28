#!/usr/bin/env npx tsx
// ---------------------------------------------------------------
// MODULE: Map Ground Truth Ids
// ---------------------------------------------------------------
// ───────────────────────────────────────────────────────────────
// 1. MAP GROUND TRUTH IDS
// ───────────────────────────────────────────────────────────────
// Maps unresolved memoryId=-1 placeholders to real memory IDs
// By ranking FTS, path, and spec-folder candidates against production index data.
// Closure utility for ground-truth mapping reconciliation.

import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

// ───────────────────────────────────────────────────────────────
// 2. CONFIGURATION
// ───────────────────────────────────────────────────────────────
function resolveScriptsWorkspaceRoot(): string {
  const directParent = path.resolve(__dirname, '..');
  if (path.basename(directParent) === 'scripts') return directParent;

  const nestedParent = path.resolve(__dirname, '..', '..');
  if (path.basename(nestedParent) === 'scripts') return nestedParent;

  return directParent;
}

const SCRIPTS_ROOT = resolveScriptsWorkspaceRoot();
const DB_DIR = path.resolve(SCRIPTS_ROOT, '../mcp_server/database');
const DB_PATH = path.join(DB_DIR, 'context-index.sqlite');
const GT_PATH = path.resolve(SCRIPTS_ROOT, '../mcp_server/lib/eval/data/ground-truth.json');
const OUTPUT_PATH = '/tmp/ground-truth-id-mapping.json';

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose') || args.includes('-v');
const DRY_RUN = args.includes('--dry-run');
const WRITE = args.includes('--write');

// ───────────────────────────────────────────────────────────────
// 3. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────
interface GroundTruthQuery {
  id: number;
  query: string;
  intentType: string;
  complexityTier: string;
  category: string;
  source: string;
  expectedResultDescription: string;
  notes?: string;
}

interface MemoryCandidate {
  memoryId: number;
  title: string;
  specFolder: string;
  filePath: string;
  importanceTier: string;
  documentType: string;
  score: number;
  matchStrategy: string;
}

interface RelevanceMapping {
  queryId: number;
  memoryId: number;
  relevance: 0 | 1 | 2 | 3;
  matchStrategy: string;
  confidence: number;
}

interface CandidateRow {
  id: number;
  title?: string | null;
  spec_folder?: string | null;
  file_path?: string | null;
  importance_tier?: string | null;
  document_type?: string | null;
  score?: number | null;
}

interface CountRow {
  cnt: number;
}

// ───────────────────────────────────────────────────────────────
// 4. QUERY DATASET LOADING
// ───────────────────────────────────────────────────────────────
// Read the canonical JSON dataset directly to avoid coupling to TS source formatting.

function loadGroundTruthQueries(): GroundTruthQuery[] {
  const raw = fs.readFileSync(GT_PATH, 'utf-8');
  const parsed = JSON.parse(raw) as { queries?: GroundTruthQuery[] };
  const queries = Array.isArray(parsed.queries) ? parsed.queries : [];

  if (queries.length === 0) {
    console.warn('[loadGroundTruthQueries] WARNING: Parsed 0 queries from ground-truth.json');
  }

  return queries;
}

// ───────────────────────────────────────────────────────────────
// 5. SEARCH STRATEGIES
// ───────────────────────────────────────────────────────────────
function extractKeywords(text: string): string[] {
  // Remove low-signal terms to improve FTS candidate precision.
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'shall', 'must', 'need', 'to', 'of',
    'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through',
    'during', 'before', 'after', 'above', 'below', 'between', 'and', 'or',
    'but', 'not', 'so', 'if', 'then', 'than', 'that', 'this', 'these',
    'those', 'what', 'which', 'who', 'whom', 'how', 'when', 'where', 'why',
    'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'only', 'same', 'it', 'its', 'about', 'also', 'does',
    'should', 'surface', 'memory', 'memories', 'related', 'relevant',
    'covering', 'including', 'plus', 'also', 'any', 'tests', 'whether',
  ]);

  return text
    .replace(/[(){}[\],.;:!?'"]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w.toLowerCase()))
    .map(w => w.replace(/[^a-zA-Z0-9_-]/g, ''))
    .filter(w => w.length > 2);
}

function extractSpecificTerms(description: string): {
  fileNames: string[];
  specFolders: string[];
  concepts: string[];
} {
  // Word boundaries prevent partial filename matches.
  const fileNames = [...description.matchAll(/\b[\w-]+\.\w{2,4}\b/g)].map(m => m[0]);

  // Word boundaries prevent mid-token spec-reference matches.
  const specRefs = [...description.matchAll(/\b(?:spec\s*)?(\d{3})-[\w-]+\b|\bsprint[- ]?\d+\b|\bT\d{3}[a-z]?\b/gi)].map(m => m[0]);

  // Preserve technical compounds to widen semantic recall.
  const concepts = [...description.matchAll(/\b[A-Z][a-z]*[A-Z]\w+\b|\b[\w]+-[\w]+-?[\w]*\b/g)].map(m => m[0]);

  if (VERBOSE && fileNames.length === 0 && specRefs.length === 0 && concepts.length === 0) {
    console.warn(`[extractSpecificTerms] WARNING: No structured terms extracted from description (${description.substring(0, 80)}...)`);
  }

  return { fileNames, specFolders: specRefs, concepts };
}

function buildFTS5Query(terms: string[]): string {
  // OR-composed FTS terms maximize recall for manual triage workflows.
  // Escape reserved FTS characters before query assembly.
  const cleaned = terms
    .filter(t => t.length > 2)
    .map(t => t.replace(/['"*()]/g, ''))
    .filter(t => t.length > 2)
    .slice(0, 15); // cap terms to prevent MATCH query explosion.

  if (cleaned.length === 0) return '';
  return cleaned.map(t => `"${t}"`).join(' OR ');
}

// ───────────────────────────────────────────────────────────────
// 6. MAIN MAPPING LOGIC
// ───────────────────────────────────────────────────────────────
function mapQueryToMemories(
  db: Database.Database,
  query: GroundTruthQuery,
): RelevanceMapping[] {
  if (query.category === 'hard_negative') {
    return []; // hard_negative queries intentionally map to no results.
  }

  const candidates: MemoryCandidate[] = [];

  // Strategy 1 prioritizes direct lexical overlap from query text.
  const queryTerms = extractKeywords(query.query);
  const fts5Query1 = buildFTS5Query(queryTerms);
  if (fts5Query1) {
    try {
      const results = db.prepare(`
        SELECT m.id, m.title, m.spec_folder, m.file_path, m.importance_tier, m.document_type,
               bm25(memory_fts) as score
        FROM memory_fts f
        JOIN memory_index m ON m.id = f.rowid
        WHERE memory_fts MATCH ?
          AND m.parent_id IS NULL
        ORDER BY bm25(memory_fts)
        LIMIT 20
      `).all(fts5Query1) as CandidateRow[];

      for (const r of results) {
        candidates.push({
          memoryId: r.id,
          title: r.title || '',
          specFolder: r.spec_folder || '',
          filePath: r.file_path || '',
          importanceTier: r.importance_tier || 'normal',
          documentType: r.document_type || 'memory',
          score: Math.abs(r.score ?? 0),
          matchStrategy: 'fts5_query',
        });
      }
    } catch (_e: unknown) {
      if (_e instanceof Error) {
        // Malformed FTS terms should not terminate the full mapping run.
      }
    }
  }

  // Strategy 2 recovers matches using expected-result domain language.
  const descTerms = extractKeywords(query.expectedResultDescription);
  const fts5Query2 = buildFTS5Query(descTerms);
  if (fts5Query2) {
    try {
      const results = db.prepare(`
        SELECT m.id, m.title, m.spec_folder, m.file_path, m.importance_tier, m.document_type,
               bm25(memory_fts) as score
        FROM memory_fts f
        JOIN memory_index m ON m.id = f.rowid
        WHERE memory_fts MATCH ?
          AND m.parent_id IS NULL
        ORDER BY bm25(memory_fts)
        LIMIT 20
      `).all(fts5Query2) as CandidateRow[];

      for (const r of results) {
        // Description matches are typically higher-signal than raw query text.
        candidates.push({
          memoryId: r.id,
          title: r.title || '',
          specFolder: r.spec_folder || '',
          filePath: r.file_path || '',
          importanceTier: r.importance_tier || 'normal',
          documentType: r.document_type || 'memory',
          score: Math.abs(r.score ?? 0) * 1.2,
          matchStrategy: 'fts5_description',
        });
      }
    } catch (_e: unknown) {
      if (_e instanceof Error) {
        // Tolerate FTS parse failures and continue with other strategies.
      }
    }
  }

  // Strategy 3 captures explicit file-path evidence when present.
  const { fileNames } = extractSpecificTerms(query.expectedResultDescription);
  for (const fileName of fileNames) {
    try {
      const results = db.prepare(`
        SELECT id, title, spec_folder, file_path, importance_tier, document_type
        FROM memory_index
        WHERE parent_id IS NULL
          AND (file_path LIKE ? OR content_text LIKE ?)
        LIMIT 10
      `).all(`%${fileName}%`, `%${fileName}%`) as CandidateRow[];

      for (const r of results) {
        candidates.push({
          memoryId: r.id,
          title: r.title || '',
          specFolder: r.spec_folder || '',
          filePath: r.file_path || '',
          importanceTier: r.importance_tier || 'normal',
          documentType: r.document_type || 'memory',
          score: 15, // direct file hits receive a high base confidence.
          matchStrategy: `file_match:${fileName}`,
        });
      }
    } catch (_e: unknown) {
      if (_e instanceof Error) {
        // Database/path lookup failure is non-fatal for this strategy.
      }
    }
  }

  // Strategy 4 infers likely scope from sprint/spec terminology.
  const desc = query.expectedResultDescription.toLowerCase();
  const specFolderPatterns: string[] = [];

  if (desc.includes('sprint-0') || desc.includes('sprint 0') || desc.includes('measurement foundation')) {
    specFolderPatterns.push('%140-hybrid-rag-fusion-refinement%001-sprint-0%');
  }
  if (desc.includes('sprint-1') || desc.includes('sprint 1') || desc.includes('graph signal')) {
    specFolderPatterns.push('%sprint-1%', '%graph-signal%');
  }
  if (desc.includes('hybrid-rag') || desc.includes('rag fusion') || desc.includes('spec 139') || desc.includes('spec 140')) {
    specFolderPatterns.push('%139-hybrid-rag-fusion%', '%140-hybrid-rag-fusion%');
  }
  if (desc.includes('phase system') || desc.includes('spec 138')) {
    specFolderPatterns.push('%138-spec-kit-phase-system%');
  }
  if (desc.includes('dedup') || desc.includes('deduplication') || desc.includes('tier anomal')) {
    specFolderPatterns.push('%143-index-tier-anomalies%');
  }
  if (desc.includes('libsql') || desc.includes('sqlite-to-libsql')) {
    specFolderPatterns.push('%140-sqlite-to-libsql%');
  }
  if (desc.includes('frontmatter')) {
    specFolderPatterns.push('%005-frontmatter-indexing%');
  }
  if (desc.includes('skill graph') || desc.includes('deprecated-skill-graph')) {
    specFolderPatterns.push('%001-deprecated-skill-graph%');
  }

  for (const pattern of specFolderPatterns) {
    try {
      const results = db.prepare(`
        SELECT id, title, spec_folder, file_path, importance_tier, document_type
        FROM memory_index
        WHERE parent_id IS NULL
          AND spec_folder LIKE ?
          AND document_type IN ('spec', 'plan', 'decision_record', 'implementation_summary', 'memory')
        ORDER BY importance_tier = 'critical' DESC,
                 importance_tier = 'important' DESC,
                 document_type = 'spec' DESC,
                 document_type = 'decision_record' DESC
        LIMIT 5
      `).all(pattern) as CandidateRow[];

      for (const r of results) {
        candidates.push({
          memoryId: r.id,
          title: r.title || '',
          specFolder: r.spec_folder || '',
          filePath: r.file_path || '',
          importanceTier: r.importance_tier || 'normal',
          documentType: r.document_type || 'memory',
          score: 12,
          matchStrategy: `spec_folder:${pattern}`,
        });
      }
    } catch (_e: unknown) {
      if (_e instanceof Error) {
        // Fallback on pattern-level failure to preserve total run progress.
      }
    }
  }

  // 5.1 CANDIDATE RANKING
  const seen = new Map<number, MemoryCandidate>();
  for (const c of candidates) {
    const existing = seen.get(c.memoryId);
    if (!existing || c.score > existing.score) {
      seen.set(c.memoryId, c);
    }
  }

  let ranked = [...seen.values()].sort((a, b) => b.score - a.score);

  // Boost high-value tiers and canonical docs for relevance ordering.
  ranked = ranked.map(c => {
    let boost = 1.0;
    if (c.importanceTier === 'constitutional') boost = 3.0;
    if (c.importanceTier === 'critical') boost = 2.0;
    if (c.importanceTier === 'important') boost = 1.5;
    if (c.documentType === 'spec') boost *= 1.3;
    if (c.documentType === 'decision_record') boost *= 1.3;
    return { ...c, score: c.score * boost };
  }).sort((a, b) => b.score - a.score);

  // Emit at most three mappings per query.
  const topResults = ranked.slice(0, 3);

  if (topResults.length === 0) {
    // Explicit sentinel preserves audit visibility for unmapped queries.
    return [{
      queryId: query.id,
      memoryId: -1,
      relevance: 3,
      matchStrategy: 'NO_MATCH_FOUND',
      confidence: 0,
    }];
  }

  // Map ranked candidates to graded relevance labels.
  const mappings: RelevanceMapping[] = [];

  // Top candidate is always relevance 3.
  mappings.push({
    queryId: query.id,
    memoryId: topResults[0].memoryId,
    relevance: 3,
    matchStrategy: topResults[0].matchStrategy,
    confidence: Math.min(1.0, topResults[0].score / 20),
  });

  // Include second result only when score proximity is acceptable.
  if (topResults[1] && topResults[1].score > topResults[0].score * 0.5) {
    mappings.push({
      queryId: query.id,
      memoryId: topResults[1].memoryId,
      relevance: 2,
      matchStrategy: topResults[1].matchStrategy,
      confidence: Math.min(1.0, topResults[1].score / 20),
    });
  }

  // Include third result only when score remains near top candidate.
  if (topResults[2] && topResults[2].score > topResults[0].score * 0.3) {
    mappings.push({
      queryId: query.id,
      memoryId: topResults[2].memoryId,
      relevance: 1,
      matchStrategy: topResults[2].matchStrategy,
      confidence: Math.min(1.0, topResults[2].score / 20),
    });
  }

  return mappings;
}

// ───────────────────────────────────────────────────────────────
// 7. MAIN ENTRYPOINT
// ───────────────────────────────────────────────────────────────
function main() {
  console.log('=== Ground Truth ID Mapping Script ===');
  console.log(`Database: ${DB_PATH}`);
  if (DRY_RUN && WRITE) {
    console.error('ERROR: --dry-run and --write cannot be combined.');
    process.exit(1);
  }
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : WRITE ? 'WRITE' : 'PREVIEW'}\n`);

  // Fail fast when production DB is unavailable.
  if (!fs.existsSync(DB_PATH)) {
    console.error(`ERROR: Database not found at ${DB_PATH}`);
    process.exit(1);
  }

  // Readonly mode prevents accidental mutation during mapping.
  const db = new Database(DB_PATH, { readonly: true });

  // Load query corpus before running strategy pipeline.
  const queries = loadGroundTruthQueries();
  console.log(`Loaded ${queries.length} ground truth queries`);

  const totalMemories = (db.prepare('SELECT COUNT(*) as cnt FROM memory_index WHERE parent_id IS NULL').get() as CountRow | undefined)?.cnt ?? 0;
  console.log(`Production DB has ${totalMemories} parent memories\n`);

  // Iterate query set and aggregate candidate mappings.
  const allMappings: RelevanceMapping[] = [];
  let unmapped = 0;
  let hardNegatives = 0;
  let mapped = 0;

  for (const query of queries) {
    const mappings = mapQueryToMemories(db, query);

    if (query.category === 'hard_negative') {
      hardNegatives++;
      if (VERBOSE) {
        console.log(`  Q${query.id} [hard_negative]: ${query.query.substring(0, 60)}... → NO RELEVANT RESULTS (correct)`);
      }
      continue;
    }

    if (mappings.length === 0 || (mappings.length === 1 && mappings[0].memoryId === -1)) {
      unmapped++;
      console.log(`  ⚠ Q${query.id}: ${query.query.substring(0, 60)}... → NO MATCH FOUND`);
    } else {
      mapped++;
      allMappings.push(...mappings);
      if (VERBOSE) {
        for (const m of mappings) {
          console.log(`  Q${query.id} → memoryId=${m.memoryId} (rel=${m.relevance}, strategy=${m.matchStrategy}, conf=${m.confidence.toFixed(2)})`);
        }
      }
    }
  }

  // Print aggregate mapping counters.
  console.log('\n=== MAPPING SUMMARY ===');
  console.log(`Total queries:      ${queries.length}`);
  console.log(`Hard negatives:     ${hardNegatives} (no mapping needed)`);
  console.log(`Mapped:             ${mapped}`);
  console.log(`Unmapped:           ${unmapped}`);
  console.log(`Total relevances:   ${allMappings.length}`);

  // Print match-strategy distribution.
  const stratCounts = new Map<string, number>();
  for (const m of allMappings) {
    const strat = m.matchStrategy.split(':')[0];
    stratCounts.set(strat, (stratCounts.get(strat) || 0) + 1);
  }
  console.log('\nStrategy distribution:');
  for (const [strat, count] of [...stratCounts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${strat}: ${count}`);
  }

  // Print confidence bucket distribution.
  const highConf = allMappings.filter(m => m.confidence >= 0.7).length;
  const medConf = allMappings.filter(m => m.confidence >= 0.3 && m.confidence < 0.7).length;
  const lowConf = allMappings.filter(m => m.confidence < 0.3).length;
  console.log(`\nConfidence: high=${highConf}, medium=${medConf}, low=${lowConf}`);

  // Persist deterministic mapping artifact for review.
  const output = {
    timestamp: new Date().toISOString(),
    dbPath: DB_PATH,
    totalQueries: queries.length,
    hardNegatives,
    mapped,
    unmapped,
    mappings: allMappings,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`\nMapping written to: ${OUTPUT_PATH}`);

  if (WRITE) {
    const currentGroundTruth = JSON.parse(fs.readFileSync(GT_PATH, 'utf-8')) as {
      queries?: GroundTruthQuery[];
      relevances?: Array<{ queryId: number; memoryId: number; relevance: 0 | 1 | 2 | 3 }>;
    };
    const nextRelevances = [...allMappings]
      .map((mapping) => ({
        queryId: mapping.queryId,
        memoryId: mapping.memoryId,
        relevance: mapping.relevance,
      }))
      .sort((left, right) => {
        if (left.queryId !== right.queryId) return left.queryId - right.queryId;
        if (left.relevance !== right.relevance) return right.relevance - left.relevance;
        return left.memoryId - right.memoryId;
      });

    const nextGroundTruth = {
      ...currentGroundTruth,
      queries: currentGroundTruth.queries ?? queries,
      relevances: nextRelevances,
    };

    fs.writeFileSync(GT_PATH, `${JSON.stringify(nextGroundTruth, null, 2)}\n`);
    console.log(`Ground truth updated: ${GT_PATH}`);
  }

  db.close();
}

main();

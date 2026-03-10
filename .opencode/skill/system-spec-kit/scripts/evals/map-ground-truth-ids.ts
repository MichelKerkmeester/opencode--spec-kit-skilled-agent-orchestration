#!/usr/bin/env npx tsx
// ---------------------------------------------------------------
// MODULE: Map Ground Truth IDs
// ---------------------------------------------------------------
//
// Sprint 0 closure task: resolve memoryId=-1 placeholders in
// ground-truth-data.ts by matching queries against real memories
// in the production context-index.sqlite database.
//
// Usage:
//   npx tsx scripts/evals/map-ground-truth-ids.ts [--dry-run] [--verbose]
//
// Output:
//   - Prints mapping summary to stdout
//   - Writes full mapping to /tmp/ground-truth-id-mapping.json

import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

// -- Config ------------------------------------------------------

const DB_DIR = path.resolve(__dirname, '../../mcp_server/database');
const DB_PATH = path.join(DB_DIR, 'context-index.sqlite');
const OUTPUT_PATH = '/tmp/ground-truth-id-mapping.json';

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose') || args.includes('-v');
const DRY_RUN = args.includes('--dry-run');

// -- Types -------------------------------------------------------

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

// -- Query Dataset (imported dynamically) ------------------------

// We can't import TS directly — load the ground truth from the
// compiled JS or parse the TS source. Using a lightweight approach:
// parse the TS file to extract the query data.

function loadGroundTruthQueries(): GroundTruthQuery[] {
  const gtPath = path.resolve(__dirname, '../../mcp_server/lib/eval/ground-truth-data.ts');
  const src = fs.readFileSync(gtPath, 'utf-8');

  // Extract all query objects from the source using regex-based parsing
  // Each query block: { id: N, query: '...', ... }
  const queries: GroundTruthQuery[] = [];

  // Simpler approach: use a state machine to parse query blocks
  const lines = src.split('\n');
  let currentQuery: Partial<GroundTruthQuery> = {};
  let inExpectedDesc = false;
  let expectedDescParts: string[] = [];
  let inNotes = false;
  let notesParts: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Start of a query object
    const idMatch = line.match(/^\s*id:\s*(\d+),/);
    if (idMatch) {
      currentQuery = { id: parseInt(idMatch[1], 10) };
      continue;
    }

    const queryMatch = line.match(/^\s*query:\s*'(.*)',$/);
    if (queryMatch && currentQuery.id) {
      currentQuery.query = queryMatch[1];
      continue;
    }

    const intentMatch = line.match(/^\s*intentType:\s*'(.*)',$/);
    if (intentMatch && currentQuery.id) {
      currentQuery.intentType = intentMatch[1];
      continue;
    }

    const complexityMatch = line.match(/^\s*complexityTier:\s*'(.*)',$/);
    if (complexityMatch && currentQuery.id) {
      currentQuery.complexityTier = complexityMatch[1];
      continue;
    }

    const categoryMatch = line.match(/^\s*category:\s*'(.*)',$/);
    if (categoryMatch && currentQuery.id) {
      currentQuery.category = categoryMatch[1];
      continue;
    }

    const sourceMatch = line.match(/^\s*source:\s*'(.*)',$/);
    if (sourceMatch && currentQuery.id) {
      currentQuery.source = sourceMatch[1];
      continue;
    }

    // expectedResultDescription can be multi-line with + concatenation
    const expectedStart = line.match(/^\s*expectedResultDescription:\s*$/);
    const expectedInline = line.match(/^\s*expectedResultDescription:\s*\n?\s*'(.*)'/);
    if (expectedStart && currentQuery.id) {
      inExpectedDesc = true;
      expectedDescParts = [];
      continue;
    }
    if (expectedInline && currentQuery.id) {
      // Check if it ends on this line or continues
      if (line.trimEnd().endsWith("',") || line.trimEnd().endsWith("'")) {
        currentQuery.expectedResultDescription = expectedInline[1];
      } else {
        inExpectedDesc = true;
        expectedDescParts = [expectedInline[1]];
      }
      continue;
    }

    if (inExpectedDesc) {
      const partMatch = line.match(/'([^']*)'/);
      if (partMatch) {
        expectedDescParts.push(partMatch[1]);
      }
      if (!line.includes('+') || line.trimEnd().endsWith("',") || line.trimEnd().endsWith("'")) {
        currentQuery.expectedResultDescription = expectedDescParts.join('');
        inExpectedDesc = false;
      }
      continue;
    }

    // Notes field (optional)
    const notesStart = line.match(/^\s*notes:\s*$/);
    const notesInline = line.match(/^\s*notes:\s*'(.*)'/);
    if (notesStart && currentQuery.id) {
      inNotes = true;
      notesParts = [];
      continue;
    }
    if (notesInline && currentQuery.id) {
      if (line.trimEnd().endsWith("',") || line.trimEnd().endsWith("'")) {
        currentQuery.notes = notesInline[1];
      } else {
        inNotes = true;
        notesParts = [notesInline[1]];
      }
      continue;
    }

    if (inNotes) {
      const partMatch = line.match(/'([^']*)'/);
      if (partMatch) {
        notesParts.push(partMatch[1]);
      }
      if (!line.includes('+') || line.trimEnd().endsWith("',") || line.trimEnd().endsWith("'")) {
        currentQuery.notes = notesParts.join('');
        inNotes = false;
      }
      continue;
    }

    // End of query block — closing brace or start of next id
    if ((line.match(/^\s*\},?\s*$/) || line.match(/^\s*\],?\s*$/)) && currentQuery.id && currentQuery.query) {
      if (currentQuery.expectedResultDescription) {
        queries.push(currentQuery as GroundTruthQuery);
      }
      currentQuery = {};
    }
  }

  if (queries.length === 0) {
    console.warn('[loadGroundTruthQueries] WARNING: Regex parsing yielded 0 queries from ground-truth-data.ts — file format may have changed');
  }

  return queries;
}

// -- Search Strategies -------------------------------------------

function extractKeywords(text: string): string[] {
  // Remove common words and extract meaningful terms
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
  // Extract file names (*.ts, *.json, *.md, *.js) — \b boundaries prevent partial matches
  const fileNames = [...description.matchAll(/\b[\w-]+\.\w{2,4}\b/g)].map(m => m[0]);

  // Extract spec folder references (spec NNN, sprint-N, T0xx) — \b boundaries prevent mid-word matches
  const specRefs = [...description.matchAll(/\b(?:spec\s*)?(\d{3})-[\w-]+\b|\bsprint[- ]?\d+\b|\bT\d{3}[a-z]?\b/gi)].map(m => m[0]);

  // Extract key concepts (technical terms, hyphenated words) — \b boundaries for precise matching
  const concepts = [...description.matchAll(/\b[A-Z][a-z]*[A-Z]\w+\b|\b[\w]+-[\w]+-?[\w]*\b/g)].map(m => m[0]);

  if (VERBOSE && fileNames.length === 0 && specRefs.length === 0 && concepts.length === 0) {
    console.warn(`[extractSpecificTerms] WARNING: No structured terms extracted from description (${description.substring(0, 80)}...)`);
  }

  return { fileNames, specFolders: specRefs, concepts };
}

function buildFTS5Query(terms: string[]): string {
  // Build FTS5 MATCH query — use OR for broad matching
  // Escape FTS5 special chars
  const cleaned = terms
    .filter(t => t.length > 2)
    .map(t => t.replace(/['"*()]/g, ''))
    .filter(t => t.length > 2)
    .slice(0, 15); // Limit terms to avoid query explosion

  if (cleaned.length === 0) return '';
  return cleaned.map(t => `"${t}"`).join(' OR ');
}

// -- Main Mapping Logic ------------------------------------------

function mapQueryToMemories(
  db: Database.Database,
  query: GroundTruthQuery,
): RelevanceMapping[] {
  if (query.category === 'hard_negative') {
    return []; // Hard negatives have no relevant results
  }

  const candidates: MemoryCandidate[] = [];

  // Strategy 1: FTS5 search using query text
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
        // FTS5 query may fail with certain terms — skip
      }
    }
  }

  // Strategy 2: FTS5 search using expectedResultDescription keywords
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
        // Boost description match slightly (these are more targeted)
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
        // FTS5 query may fail — skip
      }
    }
  }

  // Strategy 3: Direct file path matching
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
          score: 15, // High score for direct file match
          matchStrategy: `file_match:${fileName}`,
        });
      }
    } catch (_e: unknown) {
      if (_e instanceof Error) {
        // Skip on error
      }
    }
  }

  // Strategy 4: Spec folder matching based on context clues
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
        // Skip on error
      }
    }
  }

  // -- Deduplicate and rank candidates ---------------------------

  const seen = new Map<number, MemoryCandidate>();
  for (const c of candidates) {
    const existing = seen.get(c.memoryId);
    if (!existing || c.score > existing.score) {
      seen.set(c.memoryId, c);
    }
  }

  let ranked = [...seen.values()].sort((a, b) => b.score - a.score);

  // Apply tier boosts
  ranked = ranked.map(c => {
    let boost = 1.0;
    if (c.importanceTier === 'constitutional') boost = 3.0;
    if (c.importanceTier === 'critical') boost = 2.0;
    if (c.importanceTier === 'important') boost = 1.5;
    if (c.documentType === 'spec') boost *= 1.3;
    if (c.documentType === 'decision_record') boost *= 1.3;
    return { ...c, score: c.score * boost };
  }).sort((a, b) => b.score - a.score);

  // Take top 1-3 results
  const topResults = ranked.slice(0, 3);

  if (topResults.length === 0) {
    // Fallback: no matches found — flag for manual review
    return [{
      queryId: query.id,
      memoryId: -1,
      relevance: 3,
      matchStrategy: 'NO_MATCH_FOUND',
      confidence: 0,
    }];
  }

  // Assign relevance scores
  const mappings: RelevanceMapping[] = [];

  // First result: highly relevant (3)
  mappings.push({
    queryId: query.id,
    memoryId: topResults[0].memoryId,
    relevance: 3,
    matchStrategy: topResults[0].matchStrategy,
    confidence: Math.min(1.0, topResults[0].score / 20),
  });

  // Second result: relevant (2) if score is reasonable
  if (topResults[1] && topResults[1].score > topResults[0].score * 0.5) {
    mappings.push({
      queryId: query.id,
      memoryId: topResults[1].memoryId,
      relevance: 2,
      matchStrategy: topResults[1].matchStrategy,
      confidence: Math.min(1.0, topResults[1].score / 20),
    });
  }

  // Third result: partial relevance (1) if score is close
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

// -- Main --------------------------------------------------------

function main() {
  console.log('=== Ground Truth ID Mapping Script ===');
  console.log(`Database: ${DB_PATH}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'PREVIEW'}\n`);

  // Verify DB exists
  if (!fs.existsSync(DB_PATH)) {
    console.error(`ERROR: Database not found at ${DB_PATH}`);
    process.exit(1);
  }

  // Open DB
  const db = new Database(DB_PATH, { readonly: true });

  // Load ground truth queries
  const queries = loadGroundTruthQueries();
  console.log(`Loaded ${queries.length} ground truth queries`);

  const totalMemories = (db.prepare('SELECT COUNT(*) as cnt FROM memory_index WHERE parent_id IS NULL').get() as CountRow | undefined)?.cnt ?? 0;
  console.log(`Production DB has ${totalMemories} parent memories\n`);

  // Map each query
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

  // Summary
  console.log('\n=== MAPPING SUMMARY ===');
  console.log(`Total queries:      ${queries.length}`);
  console.log(`Hard negatives:     ${hardNegatives} (no mapping needed)`);
  console.log(`Mapped:             ${mapped}`);
  console.log(`Unmapped:           ${unmapped}`);
  console.log(`Total relevances:   ${allMappings.length}`);

  // Strategy distribution
  const stratCounts = new Map<string, number>();
  for (const m of allMappings) {
    const strat = m.matchStrategy.split(':')[0];
    stratCounts.set(strat, (stratCounts.get(strat) || 0) + 1);
  }
  console.log('\nStrategy distribution:');
  for (const [strat, count] of [...stratCounts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${strat}: ${count}`);
  }

  // Confidence distribution
  const highConf = allMappings.filter(m => m.confidence >= 0.7).length;
  const medConf = allMappings.filter(m => m.confidence >= 0.3 && m.confidence < 0.7).length;
  const lowConf = allMappings.filter(m => m.confidence < 0.3).length;
  console.log(`\nConfidence: high=${highConf}, medium=${medConf}, low=${lowConf}`);

  // Write mapping output
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

  db.close();
}

main();

// ───────────────────────────────────────────────────────────────
// MODULE: Vector Index Queries
// ───────────────────────────────────────────────────────────────
// Feature catalog: Hybrid search pipeline
// Split from vector-index-store.ts — contains ALL query/search functions,
// Content extraction, ranking, stats, cleanup, and integrity checks.

import * as path from 'path';
import * as fs from 'fs';
import type Database from 'better-sqlite3';
import { formatAgeString as format_age_string } from '../utils/format-helpers.js';
import { createLogger } from '../utils/logger.js';
import { recordHistory } from '../storage/history.js';
import * as embeddingsProvider from '../providers/embeddings.js';
import {
  get_error_message,
  parse_trigger_phrases,
  to_embedding_buffer,
  VectorIndexError,
  VectorIndexErrorCode,
} from './vector-index-types.js';
import {
  initialize_db,
  get_embedding_dim,
  get_constitutional_memories,
  init_prepared_statements,
  validate_file_path_local,
  safe_read_file_async,
  safe_parse_json,
  search_weights,
  sqlite_vec_available as get_sqlite_vec_available,
} from './vector-index-store.js';
import { delete_memory_from_database } from './vector-index-mutations.js';
import type {
  EmbeddingInput,
  EnrichedSearchResult,
  MemoryRow,
  VectorSearchOptions,
} from './vector-index-types.js';

const logger = createLogger('VectorIndex');

type RelatedMemoryLink = { id: number; similarity: number };
type UsageStatsOptions = { sortBy?: string; order?: string; limit?: number };
type CleanupOptions = {
  maxAgeDays?: number;
  maxAccessCount?: number;
  maxConfidence?: number;
  limit?: number;
};

/* ───────────────────────────────────────────────────────────────
   SIMPLE QUERIES
----------------------------------------------------------------*/

/**
 * Gets one indexed memory by identifier.
 * @param id - The memory identifier.
 * @returns The matching memory row, if found.
 * @throws {VectorIndexError} Propagates store initialization failures from the vector index.
 * @example
 * ```ts
 * const memory = get_memory(42);
 * ```
 */
export function get_memory(id: number, database: Database.Database = initialize_db()): MemoryRow | null {
  const stmts = init_prepared_statements(database);
  const row = stmts.get_by_id.get(id);

  if (row) {
    row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
    row.isConstitutional = row.importance_tier === 'constitutional';
  }

  return row || null;
}

/**
 * Gets indexed memories for a spec folder.
 * @param spec_folder - The spec folder to query.
 * @returns The memory rows for the folder.
 */
export function get_memories_by_folder(
  spec_folder: string,
  database: Database.Database = initialize_db(),
): MemoryRow[] {
  const rows = database.prepare(`
    SELECT m.*
    FROM memory_index m
    JOIN active_memory_projection p ON p.active_memory_id = m.id
    WHERE m.spec_folder = ?
    ORDER BY m.created_at DESC
  `).all(spec_folder) as MemoryRow[];

  return rows.map((row: MemoryRow) => {
    row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
    row.isConstitutional = row.importance_tier === 'constitutional';
    return row;
  });
}

/**
 * Gets the total number of indexed memories.
 * @returns The total memory count.
 */
export function get_memory_count(database: Database.Database = initialize_db()): number {
  const stmts = init_prepared_statements(database);
  const result = stmts.count_all.get();
  return result?.count ?? 0;
}

/**
 * Gets memory counts grouped by embedding status.
 * @returns The counts for each embedding status.
 */
export function get_status_counts(
  database: Database.Database = initialize_db(),
): { pending: number; success: number; failed: number; retry: number; partial: number } {
  const rows = database.prepare(`
    SELECT m.embedding_status, COUNT(*) as count
    FROM memory_index m
    JOIN active_memory_projection p ON p.active_memory_id = m.id
    GROUP BY m.embedding_status
  `).all();

  // M7 FIX: Include 'partial' status in counts
  const counts = { pending: 0, success: 0, failed: 0, retry: 0, partial: 0 };
  for (const row of rows as Array<{ embedding_status: keyof typeof counts; count: number }>) {
    if (row.embedding_status in counts) {
      counts[row.embedding_status] = row.count;
    }
  }

  return counts;
}

/**
 * Gets summary counts for indexed memories.
 * @returns The aggregate memory statistics.
 */
export function get_stats(
  database: Database.Database = initialize_db(),
): { total: number; pending: number; success: number; failed: number; retry: number; partial: number } {
  const counts = get_status_counts(database);
  const total = counts.pending + counts.success + counts.failed + counts.retry + counts.partial;

  return {
    total,
    ...counts
  };
}

/* ───────────────────────────────────────────────────────────────
   VECTOR SEARCH
----------------------------------------------------------------*/

/**
 * Searches indexed memories by vector similarity.
 * @param query_embedding - The query embedding to search with.
 * @param options - Search options.
 * @returns The matching memory rows.
 * @throws {VectorIndexError} Propagates store initialization failures from the vector index.
 * @example
 * ```ts
 * const rows = vector_search(queryEmbedding, { limit: 5, specFolder: 'specs/001-demo' });
 * ```
 */
export function vector_search(
  query_embedding: EmbeddingInput,
  options: VectorSearchOptions = {},
  database: Database.Database = initialize_db(),
): MemoryRow[] {
  const sqlite_vec = get_sqlite_vec_available();
  if (!sqlite_vec) {
    console.warn('[vector-index] Vector search unavailable - sqlite-vec not loaded');
    return [];
  }

  const {
    limit = 10,
    specFolder = null,
    minSimilarity = 0,
    useDecay = true,
    tier = null,
    contextType = null,
    includeConstitutional = true,
    includeArchived = false
  } = options;

  // M9 FIX: Validate embedding dimension before querying
  const expected_dim = get_embedding_dim();
  if (!query_embedding || query_embedding.length !== expected_dim) {
    throw new VectorIndexError(
      `Invalid embedding dimension: expected ${expected_dim}, got ${query_embedding?.length}`,
      VectorIndexErrorCode.EMBEDDING_VALIDATION,
    );
  }

  const query_buffer = to_embedding_buffer(query_embedding);
  const max_distance = 2 * (1 - minSimilarity / 100);

  // ADR-004: FSRS-preferred decay with half-life fallback
  const decay_expr = useDecay
    ? `CASE
         WHEN m.is_pinned = 1 THEN m.importance_weight
         WHEN m.last_review IS NOT NULL AND m.review_count > 0 THEN
           m.importance_weight * POWER(
             1.0 + (19.0/81.0) * (julianday('now') - julianday(m.last_review)) / COALESCE(NULLIF(m.stability, 0), 1.0),
             -0.5
           )
         ELSE m.importance_weight * POWER(0.5, (julianday('now') - julianday(m.updated_at)) / COALESCE(NULLIF(m.decay_half_life_days, 0), 90.0))
       END`
    : 'm.importance_weight';

  let constitutional_results: MemoryRow[] = [];

  if (includeConstitutional && tier !== 'constitutional') {
    constitutional_results = get_constitutional_memories(database, specFolder, includeArchived);
  }

  const where_clauses = ['m.embedding_status = \'success\''];
  const params: unknown[] = [query_buffer];

  where_clauses.push('(m.expires_at IS NULL OR m.expires_at > datetime(\'now\'))');

  if (!includeArchived) {
    where_clauses.push('(m.is_archived IS NULL OR m.is_archived = 0)');
  }
  if (tier === 'deprecated') {
    where_clauses.push('m.importance_tier = ?');
    params.push('deprecated');
  } else if (tier === 'constitutional') {
    where_clauses.push('m.importance_tier = ?');
    params.push('constitutional');
  } else if (tier) {
    where_clauses.push('m.importance_tier = ?');
    params.push(tier);
  } else {
    where_clauses.push('(m.importance_tier IS NULL OR m.importance_tier NOT IN (\'deprecated\', \'constitutional\'))');
  }

  if (specFolder) {
    where_clauses.push('m.spec_folder = ?');
    params.push(specFolder);
  }

  if (contextType) {
    where_clauses.push('m.context_type = ?');
    params.push(contextType);
  }

  // M8 FIX: If constitutional results already satisfy limit, return them directly
  if (constitutional_results.length >= limit) {
    return constitutional_results.slice(0, limit);
  }
  const adjusted_limit = Math.max(1, limit - constitutional_results.length);
  params.push(max_distance, adjusted_limit);

  const sql = `
    SELECT sub.*,
           ROUND((1 - sub.distance / 2) * 100, 2) as similarity
    FROM (
      SELECT m.*, vec_distance_cosine(v.embedding, ?) as distance,
             ${decay_expr} as effective_importance
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
      JOIN vec_memories v ON m.id = v.rowid
      WHERE ${where_clauses.join(' AND ')}
    ) sub
    WHERE sub.distance <= ?
    ORDER BY (sub.distance - (sub.effective_importance * 0.1)) ASC
    LIMIT ?
  `;

  const rows = database.prepare(sql).all(...params);

  const regular_results = (rows as MemoryRow[]).map((row: MemoryRow) => {
    row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
    row.isConstitutional = row.importance_tier === 'constitutional';
    return row;
  });

  return [...constitutional_results, ...regular_results];
}

/**
 * Gets constitutional memories for prompt assembly.
 * @param options - Retrieval options.
 * @returns The constitutional memory rows.
 */
export function get_constitutional_memories_public(
  options: { specFolder?: string | null; maxTokens?: number; includeArchived?: boolean } = {},
  database: Database.Database = initialize_db(),
): MemoryRow[] {
  const { specFolder = null, maxTokens = 2000, includeArchived = false } = options;

  let results = get_constitutional_memories(database, specFolder, includeArchived);

  const TOKENS_PER_MEMORY = 100;
  const max_count = Math.floor(maxTokens / TOKENS_PER_MEMORY);
  if (results.length > max_count) {
    results = results.slice(0, max_count);
  }

  return results;
}

/**
 * Searches indexed memories with multiple concept embeddings.
 * @param concept_embeddings - The concept embeddings to search with.
 * @param options - Search options.
 * @returns The matching memory rows.
 * @throws {VectorIndexError} When concept count or embedding dimensions are invalid, or when store initialization fails.
 * @example
 * ```ts
 * const rows = multi_concept_search([embA, embB], { limit: 8, specFolder: 'specs/001-demo' });
 * ```
 */
export function multi_concept_search(
  concept_embeddings: EmbeddingInput[],
  options: { limit?: number; specFolder?: string | null; minSimilarity?: number; includeArchived?: boolean } = {}
): MemoryRow[] {
  const sqlite_vec = get_sqlite_vec_available();
  if (!sqlite_vec) {
    console.warn('[vector-index] Multi-concept search unavailable - sqlite-vec not loaded');
    return [];
  }

  const database = initialize_db();

  const concepts = concept_embeddings;
  if (!Array.isArray(concepts) || concepts.length < 2 || concepts.length > 5) {
    throw new VectorIndexError('Multi-concept search requires 2-5 concepts', VectorIndexErrorCode.QUERY_FAILED);
  }

  const expected_dim = get_embedding_dim();
  for (const emb of concepts) {
    if (!emb || emb.length !== expected_dim) {
      throw new VectorIndexError(
        `Invalid embedding dimension: expected ${expected_dim}, got ${emb?.length}`,
        VectorIndexErrorCode.QUERY_FAILED,
      );
    }
  }

  const { limit = 10, specFolder = null, minSimilarity = 50, includeArchived = false } = options;

  const concept_buffers = concepts.map(c => to_embedding_buffer(c));
  const max_distance = 2 * (1 - minSimilarity / 100);

  const distance_expressions = concept_buffers.map((_, i) =>
    `vec_distance_cosine(v.embedding, ?) as dist_${i}`
  ).join(', ');

  const distance_filters = concept_buffers.map((_, _i) =>
    `vec_distance_cosine(v.embedding, ?) <= ?`
  ).join(' AND ');

  const folder_filter = specFolder ? 'AND m.spec_folder = ?' : '';
  const archival_filter = !includeArchived ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)' : '';

  const similarity_select = concept_buffers.map((_, i) =>
    `ROUND((1 - sub.dist_${i} / 2) * 100, 2) as similarity_${i}`
  ).join(', ');

  const avg_distance_expr = concept_buffers.map((_, i) => `sub.dist_${i}`).join(' + ');

  const sql = `
    SELECT
      sub.*,
      ${similarity_select},
      (${avg_distance_expr}) / ${concepts.length} as avg_distance
    FROM (
      SELECT
        m.*,
        ${distance_expressions}
      FROM memory_index m
      JOIN active_memory_projection p ON p.active_memory_id = m.id
      JOIN vec_memories v ON m.id = v.rowid
      WHERE m.embedding_status = 'success'
        AND (m.expires_at IS NULL OR m.expires_at > datetime('now'))
        ${folder_filter}
        ${archival_filter}
        AND ${distance_filters}
    ) sub
    ORDER BY avg_distance ASC
    LIMIT ?
  `;

  const params = [
    ...concept_buffers,
    ...(specFolder ? [specFolder] : []),
    ...concept_buffers.flatMap(b => [b, max_distance]),
    limit
  ];

  const rows = database.prepare(sql).all(...params);

  return (rows as MemoryRow[]).map((row: MemoryRow) => {
    row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
    row.concept_similarities = concept_buffers.map((_, i) => Number(row[`similarity_${i}`] ?? 0));
    row.avg_similarity = (row.concept_similarities as number[]).reduce((a, b) => a + b, 0) / concepts.length;
    row.isConstitutional = row.importance_tier === 'constitutional';
    return row;
  });
}

/* ───────────────────────────────────────────────────────────────
   CONTENT EXTRACTION HELPERS
----------------------------------------------------------------*/

/**
 * Extracts a display title from indexed content.
 * @param content - The content to inspect.
 * @param filename - The optional source filename.
 * @returns The extracted title.
 */
export function extract_title(content: unknown, filename?: string): string {
  if (!content || typeof content !== 'string') {
    return filename ? path.basename(filename, path.extname(filename)) : 'Untitled';
  }

  const h1_match = content.match(/^#\s+(.+)$/m);
  if (h1_match && h1_match[1]) {
    return h1_match[1].trim();
  }

  const h2_match = content.match(/^##\s+(.+)$/m);
  if (h2_match && h2_match[1]) {
    return h2_match[1].trim();
  }

  const yaml_match = content.match(/^---[\s\S]*?^title:\s*(.+)$/m);
  if (yaml_match && yaml_match[1]) {
    return yaml_match[1].trim().replace(/^["']|["']$/g, '');
  }

  const lines = content.split('\n').filter(l => l.trim().length > 0);
  if (lines.length > 0) {
    const first_line = lines[0].trim();
    return first_line.replace(/^#+\s*/, '').substring(0, 100);
  }

  return filename ? path.basename(filename, path.extname(filename)) : 'Untitled';
}

/**
 * Extracts a preview snippet from indexed content.
 * @param content - The content to inspect.
 * @param max_length - The maximum snippet length.
 * @returns The extracted snippet.
 */
export function extract_snippet(content: unknown, max_length = 200): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  const text = content.replace(/^---[\s\S]*?---\n*/m, '');
  const lines = text.split('\n');
  const snippet_lines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || /^#+\s/.test(trimmed)) {
      if (snippet_lines.length > 0) {
        break;
      }
      continue;
    }

    if (/^[a-z_-]+:\s/i.test(trimmed) && snippet_lines.length === 0) {
      continue;
    }

    snippet_lines.push(trimmed);

    const current_length = snippet_lines.join(' ').length;
    if (current_length >= max_length) {
      break;
    }
  }

  let snippet = snippet_lines.join(' ');

  if (snippet.length > max_length) {
    snippet = snippet.substring(0, max_length);
    const last_space = snippet.lastIndexOf(' ');
    if (last_space > max_length * 0.7) {
      snippet = snippet.substring(0, last_space);
    }
    snippet += '...';
  }

  return snippet;
}

/**
 * Extracts tags from indexed content.
 * @param content - The content to inspect.
 * @returns The extracted tags.
 */
export function extract_tags(content: unknown): string[] {
  if (!content || typeof content !== 'string') {
    console.warn('[vector-index] extract_tags: invalid content type, expected string');
    return [];
  }

  const tags = new Set<string>();

  const yaml_tags_match = content.match(/^---[\s\S]*?^tags:\s*\[([^\]]+)\]/m);
  if (yaml_tags_match && yaml_tags_match[1]) {
    yaml_tags_match[1].split(',').forEach(tag => {
      const cleaned = tag.trim().replace(/^["']|["']$/g, '');
      if (cleaned) tags.add(cleaned.toLowerCase());
    });
  }

  const yaml_list_match = content.match(/^---[\s\S]*?^tags:\s*\n((?:\s*-\s*.+\n?)+)/m);
  if (yaml_list_match && yaml_list_match[1]) {
    yaml_list_match[1].match(/-\s*(.+)/g)?.forEach(match => {
      const tag = match.replace(/^-\s*/, '').trim().replace(/^["']|["']$/g, '');
      if (tag) tags.add(tag.toLowerCase());
    });
  }

  const hashtag_matches = content.match(/(?:^|\s)#([a-zA-Z][a-zA-Z0-9_-]*)/g);
  if (hashtag_matches) {
    hashtag_matches.forEach(match => {
      const tag = match.trim().replace(/^#/, '');
      if (tag && !tag.match(/^[0-9]+$/)) {
        tags.add(tag.toLowerCase());
      }
    });
  }

  return Array.from(tags);
}

/**
 * Extracts a relevant date from indexed content or path.
 * @param content - The content to inspect.
 * @param file_path - The optional source file path.
 * @returns The extracted date, if available.
 */
export function extract_date(content: unknown, file_path?: string): string | null {
  if (content && typeof content === 'string') {
    const date_match = content.match(/^---[\s\S]*?^date:\s*(.+)$/m);
    if (date_match && date_match[1]) {
      const date_str = date_match[1].trim().replace(/^["']|["']$/g, '');
      try {
        const parsed = new Date(date_str);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString().split('T')[0];
        }
      } catch (_e: unknown) {
        console.warn('[vector-index-queries] Date parsing failed', { error: _e instanceof Error ? _e.message : String(_e) });
      }
    }
  }

  if (file_path) {
    const filename = path.basename(file_path);

    const iso_match = filename.match(/(\d{4}-\d{2}-\d{2})/);
    if (iso_match) {
      return iso_match[1];
    }

    const ddmmyy_match = filename.match(/(\d{2})-(\d{2})-(\d{2})/);
    if (ddmmyy_match) {
      const [, day, month, year] = ddmmyy_match;
      const full_year = parseInt(year) > 50 ? `19${year}` : `20${year}`;
      return `${full_year}-${month}-${day}`;
    }
  }

  return null;
}

/* ───────────────────────────────────────────────────────────────
   EMBEDDING GENERATION WRAPPER
----------------------------------------------------------------*/

/**
 * Generates an embedding for a search query.
 * @param query - The search query.
 * @returns A promise that resolves to the embedding, if generated.
 */
export async function generate_query_embedding(query: string): Promise<Float32Array | null> {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    console.warn('[vector-index] Empty query provided for embedding');
    return null;
  }

  try {
    const embeddings = embeddingsProvider;
    const embedding = await embeddings.generateQueryEmbedding(query.trim());
    return embedding;
  } catch (error: unknown) {
    console.warn(`[vector-index] Query embedding failed: ${get_error_message(error)}`);
    return null;
  }
}

/* ───────────────────────────────────────────────────────────────
   KEYWORD SEARCH FALLBACK
----------------------------------------------------------------*/

/**
 * Searches indexed memories using keyword matching.
 * @param query - The search query.
 * @param options - Search options.
 * @returns The matching memory rows.
 */
export function keyword_search(
  query: string,
  options: { limit?: number; specFolder?: string | null; includeArchived?: boolean } = {},
  database: Database.Database = initialize_db(),
): MemoryRow[] {
  const { limit = 20, specFolder = null, includeArchived = false } = options;

  if (!query || typeof query !== 'string') {
    console.warn('[vector-index] keyword_search: invalid query, expected non-empty string');
    return [];
  }

  const search_terms = query.toLowerCase().trim().split(/\s+/).filter(t => t.length >= 2);
  if (search_terms.length === 0) {
    console.warn('[vector-index] keyword_search: no valid search terms after tokenization');
    return [];
  }

  let where_clause = '1=1';
  const params: unknown[] = [];

  if (specFolder) {
    where_clause += ' AND spec_folder = ?';
    params.push(specFolder);
  }

  if (!includeArchived) {
    where_clause += ' AND (is_archived IS NULL OR is_archived = 0)';
  }

  const sql = `
    SELECT m.* FROM memory_index m
    JOIN active_memory_projection p ON p.active_memory_id = m.id
    WHERE ${where_clause}
    ORDER BY m.importance_weight DESC, m.created_at DESC
  `;

  const rows = database.prepare(sql).all(...params);

  const scored = (rows as MemoryRow[]).map((row: MemoryRow) => {
    let score = 0;
    const searchable_text = [
      row.title || '',
      parse_trigger_phrases(row.trigger_phrases).join(' '),
      row.spec_folder || '',
      row.file_path || ''
    ].join(' ').toLowerCase();

    for (const term of search_terms) {
      if (searchable_text.includes(term)) {
        score += 1;
        if ((row.title || '').toLowerCase().includes(term)) {
          score += 2;
        }
        if (parse_trigger_phrases(row.trigger_phrases).join(' ').toLowerCase().includes(term)) {
          score += 1.5;
        }
      }
    }

    score *= (0.5 + (row.importance_weight ?? 0));
    return { ...row, keyword_score: score };
  });

  const filtered = scored
    .filter((row: MemoryRow) => Number(row.keyword_score ?? 0) > 0)
    .sort((a: MemoryRow, b: MemoryRow) => Number(b.keyword_score ?? 0) - Number(a.keyword_score ?? 0))
    .slice(0, limit);

  return filtered.map((row: MemoryRow) => {
    row.trigger_phrases = parse_trigger_phrases(row.trigger_phrases);
    row.isConstitutional = row.importance_tier === 'constitutional';
    return row;
  });
}

/* ───────────────────────────────────────────────────────────────
   ENRICHED VECTOR SEARCH
----------------------------------------------------------------*/

/**
 * Runs enriched vector search for a text query.
 * @param query - The search query.
 * @param limit - The maximum number of results to return.
 * @param options - Search options.
 * @returns A promise that resolves to enriched search results.
 * @throws {VectorIndexError} Propagates vector-store initialization failures from the underlying search pipeline.
 * @example
 * ```ts
 * const results = await vector_search_enriched('sqlite vec mismatch', 10, { specFolder: 'specs/001-demo' });
 * ```
 */
export async function vector_search_enriched(
  query: string,
  limit = 20,
  options: { specFolder?: string | null; minSimilarity?: number } = {},
  database: Database.Database = initialize_db(),
): Promise<EnrichedSearchResult[]> {
  const start_time = Date.now();
  const { specFolder = null, minSimilarity = 30 } = options;

  const query_embedding = await generate_query_embedding(query);

  let raw_results;
  let search_method = 'vector';

  const sqlite_vec = get_sqlite_vec_available();
  if (query_embedding && sqlite_vec) {
    raw_results = vector_search(query_embedding, {
      limit,
      specFolder,
      minSimilarity
    }, database);
  } else {
    console.warn('[vector-index] Falling back to keyword search');
    search_method = 'keyword';
    raw_results = keyword_search(query, { limit, specFolder }, database);
  }

  // HIGH-004 FIX: Read all files concurrently
  const file_contents = await Promise.all(
    raw_results.map((row: MemoryRow) => safe_read_file_async(row.file_path))
  );

  const enriched_results = raw_results.map((row: MemoryRow, i: number) => {
    const content = file_contents[i];
    const title = row.title || extract_title(content, row.file_path);
    const snippet = extract_snippet(content);
    const tags = extract_tags(content);
    const date = extract_date(content, row.file_path) || row.created_at?.split('T')[0] || null;

    const similarity = search_method === 'vector'
      ? (row.similarity || 0)
      : Math.min(100, (row.keyword_score || 0) * 20);

    return {
      rank: i + 1,
      similarity: Math.round(similarity * 100) / 100,
      title,
      specFolder: row.spec_folder,
      filePath: row.file_path,
      date,
      tags,
      snippet,
      id: row.id,
      importanceWeight: row.importance_weight ?? 0.5,
      searchMethod: search_method,
      isConstitutional: row.isConstitutional || row.importance_tier === 'constitutional'
    };
  });

  const elapsed = Date.now() - start_time;
  if (elapsed > 500) {
    console.warn(`[vector-index] Enriched search took ${elapsed}ms (target <500ms)`);
  }

  return enriched_results;
}

/* ───────────────────────────────────────────────────────────────
   MULTI-CONCEPT ENRICHED SEARCH
----------------------------------------------------------------*/

/**
 * Runs enriched search across multiple concepts.
 * @param concepts - The concept queries or embeddings.
 * @param limit - The maximum number of results to return.
 * @param options - Search options.
 * @returns A promise that resolves to enriched search results.
 * @throws {VectorIndexError} When concept validation fails or the vector search pipeline cannot execute.
 * @example
 * ```ts
 * const results = await multi_concept_search_enriched(['sqlite', 'vector'], 10, { specFolder: 'specs/001-demo' });
 * ```
 */
export async function multi_concept_search_enriched(
  concepts: Array<string | EmbeddingInput>,
  limit = 20,
  options: { specFolder?: string | null; minSimilarity?: number } = {}
): Promise<EnrichedSearchResult[]> {
  const start_time = Date.now();

  if (!Array.isArray(concepts) || concepts.length < 2 || concepts.length > 5) {
    throw new VectorIndexError('Multi-concept search requires 2-5 concepts', VectorIndexErrorCode.QUERY_FAILED);
  }

  const { specFolder = null, minSimilarity = 50 } = options;

  const concept_embeddings: EmbeddingInput[] = [];
  for (const concept of concepts) {
    if (typeof concept === 'string') {
      const embedding = await generate_query_embedding(concept);
      if (!embedding) {
        console.warn(`[vector-index] Failed to embed concept: "${concept}"`);
        return await multi_concept_keyword_search(concepts.filter(c => typeof c === 'string'), limit, options);
      }
      concept_embeddings.push(embedding);
    } else {
      concept_embeddings.push(concept);
    }
  }

  const sqlite_vec = get_sqlite_vec_available();
  if (!sqlite_vec) {
    console.warn('[vector-index] Falling back to keyword multi-concept search');
    return await multi_concept_keyword_search(concepts.filter(c => typeof c === 'string'), limit, options);
  }

  const raw_results = multi_concept_search(concept_embeddings, { limit, specFolder, minSimilarity });

  const file_contents = await Promise.all(
    raw_results.map((row: MemoryRow) => safe_read_file_async(row.file_path))
  );

  const enriched_results = raw_results.map((row: MemoryRow, i: number) => {
    const content = file_contents[i];
    const title = row.title || extract_title(content, row.file_path);
    const snippet = extract_snippet(content);
    const tags = extract_tags(content);
    const date = extract_date(content, row.file_path) || row.created_at?.split('T')[0] || null;

    return {
      rank: i + 1,
      avgSimilarity: Math.round((row.avg_similarity || 0) * 100) / 100,
      conceptSimilarities: (row.concept_similarities as number[] | undefined) || [],
      title,
      specFolder: row.spec_folder,
      filePath: row.file_path,
      date,
      tags,
      snippet,
      id: row.id,
      importanceWeight: row.importance_weight ?? 0.5,
      isConstitutional: row.isConstitutional || row.importance_tier === 'constitutional'
    };
  });

  const elapsed = Date.now() - start_time;
  if (elapsed > 500) {
    console.warn(`[vector-index] Multi-concept search took ${elapsed}ms (target <500ms)`);
  }

  return enriched_results;
}

/**
 * Runs keyword search for multiple concepts.
 * @param concepts - The concept terms to search for.
 * @param limit - The maximum number of results to return.
 * @param options - Search options.
 * @returns A promise that resolves to enriched search results.
 */
export async function multi_concept_keyword_search(
  concepts: string[],
  limit = 20,
  options: { specFolder?: string | null } = {}
): Promise<EnrichedSearchResult[]> {
  const { specFolder = null } = options;

  if (!concepts.length) {
    console.warn('[vector-index] multi_concept_keyword_search: empty concepts array');
    return [];
  }

  const concept_results = concepts.map((concept: string) =>
    keyword_search(concept, { limit: 100, specFolder })
  );

  const id_counts = new Map<number, number>();
  const id_to_row = new Map<number, MemoryRow>();

  for (const results of concept_results) {
    for (const row of results) {
      const count = id_counts.get(row.id) || 0;
      id_counts.set(row.id, count + 1);
      if (!id_to_row.has(row.id)) {
        id_to_row.set(row.id, row);
      }
    }
  }

  const matching_ids: number[] = [];
  for (const [id, count] of id_counts) {
    if (count === concepts.length) {
      matching_ids.push(id);
    }
  }

  const limited_ids = matching_ids.slice(0, limit);
  const rows = limited_ids.map(id => id_to_row.get(id)).filter((row): row is MemoryRow => Boolean(row));

  const file_contents = await Promise.all(
    rows.map(row => safe_read_file_async(row.file_path))
  );

  const enriched_results = rows.map((row, i) => {
    const content = file_contents[i];
    const title = row.title || extract_title(content, row.file_path);
    const snippet = extract_snippet(content);
    const tags = extract_tags(content);
    const date = extract_date(content, row.file_path) || row.created_at?.split('T')[0] || null;

    return {
      rank: i + 1,
      avgSimilarity: Math.min(100, (row.keyword_score || 1) * 15),
      conceptSimilarities: concepts.map(() => row.keyword_score || 1),
      title,
      specFolder: row.spec_folder,
      filePath: row.file_path,
      date,
      tags,
      snippet,
      id: row.id,
      importanceWeight: row.importance_weight ?? 0.5,
      searchMethod: 'keyword',
      isConstitutional: row.importance_tier === 'constitutional'
    };
  });

  return enriched_results;
}

/**
 * Parses quoted phrases from a search query.
 * @param query - The search query.
 * @returns The quoted search terms.
 */
export function parse_quoted_terms(query: string): string[] {
  if (!query || typeof query !== 'string') {
    console.warn('[vector-index] parse_quoted_terms: invalid query, expected non-empty string');
    return [];
  }

  const quoted: string[] = [];
  const regex = /"([^"]+)"/g;
  let match;

  while ((match = regex.exec(query)) !== null) {
    if (match[1] && match[1].trim()) {
      quoted.push(match[1].trim());
    }
  }

  return quoted;
}

/* ───────────────────────────────────────────────────────────────
   SMART RANKING AND DIVERSITY
----------------------------------------------------------------*/

// BUG-012 FIX: Weights read from config instead of hardcoded
/**
 * Applies smart ranking weights to enriched results.
 * @param results - The results to rank.
 * @returns The ranked results.
 */
export function apply_smart_ranking(results: EnrichedSearchResult[]): EnrichedSearchResult[] {
  if (!results || results.length === 0) return results;

  const recency_weight = search_weights.smartRanking?.recencyWeight || 0.3;
  const access_weight = search_weights.smartRanking?.accessWeight || 0.2;
  const relevance_weight = search_weights.smartRanking?.relevanceWeight || 0.5;

  const now = Date.now();
  const week_ms = 7 * 24 * 60 * 60 * 1000;
  const month_ms = 30 * 24 * 60 * 60 * 1000;

  return results.map((r: EnrichedSearchResult) => {
    const created_at = r.created_at ? new Date(r.created_at).getTime() : now;
    const age = now - created_at;
    let recency_factor;
    if (age < week_ms) {
      recency_factor = 1.0;
    } else if (age < month_ms) {
      recency_factor = 0.8;
    } else {
      recency_factor = 0.5;
    }

    const usage_factor = Math.min(1.0, (r.access_count || 0) / 10);
    const similarity_factor = (r.similarity || 0) / 100;

    r.smartScore = (similarity_factor * relevance_weight) + (recency_factor * recency_weight) + (usage_factor * access_weight);
    r.smartScore = Math.round(r.smartScore * 100) / 100;

    return r;
  }).sort((a, b) => Number(b.smartScore ?? 0) - Number(a.smartScore ?? 0));
}

// Apply diversity filtering using MMR (Maximal Marginal Relevance)
/**
 * Applies diversity reordering to enriched results.
 * @param results - The results to diversify.
 * @param diversity_factor - The diversity weight to apply.
 * @returns The diversified results.
 */
export function apply_diversity(results: EnrichedSearchResult[], diversity_factor = 0.3): EnrichedSearchResult[] {
  if (!results || results.length <= 3) return results;

  const selected = [results[0]];
  const remaining = [...results.slice(1)];

  while (selected.length < results.length && remaining.length > 0) {
    let best_idx = 0;
    let best_score = -Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      const relevance = candidate.smartScore || ((candidate.similarity ?? 0) / 100) || 0;

      let max_similarity_to_selected = 0;
      for (const sel of selected) {
        if (sel.specFolder === candidate.specFolder || sel.spec_folder === candidate.spec_folder) {
          max_similarity_to_selected = Math.max(max_similarity_to_selected, 0.8);
        }
        if (sel.date === candidate.date) {
          max_similarity_to_selected = Math.max(max_similarity_to_selected, 0.5);
        }
      }

      const mmr_score = relevance - (diversity_factor * max_similarity_to_selected);

      if (mmr_score > best_score) {
        best_score = mmr_score;
        best_idx = i;
      }
    }

    selected.push(remaining.splice(best_idx, 1)[0]);
  }

  return selected;
}

/* ───────────────────────────────────────────────────────────────
   RELATED MEMORIES AND USAGE TRACKING
----------------------------------------------------------------*/

/**
 * Gets memories related to a stored memory.
 * @param memory_id - The memory identifier.
 * @returns The related memory rows.
 */
export function get_related_memories(memory_id: number): MemoryRow[] {
  try {
    const database = initialize_db();

    const memory = database.prepare(`
      SELECT related_memories FROM memory_index WHERE id = ?
    `).get(memory_id) as { related_memories?: string | null } | undefined;

    if (!memory || !memory.related_memories) {
      return [];
    }

    const related = safe_parse_json(memory.related_memories, []);

    return (related as RelatedMemoryLink[]).map((rel: RelatedMemoryLink): MemoryRow | null => {
      const full_memory = get_memory(rel.id);
      if (full_memory) {
        return {
          ...full_memory,
          relationSimilarity: rel.similarity
        };
      }
      return null;
    }).filter((relatedMemory): relatedMemory is MemoryRow => Boolean(relatedMemory));
  } catch (error: unknown) {
    console.warn(`[vector-index] Failed to get related memories for ${memory_id}: ${get_error_message(error)}`);
    return [];
  }
}

/**
 * Gets usage statistics for indexed memories.
 * @param options - Sorting and limit options.
 * @returns The usage statistics rows.
 */
export function get_usage_stats(options: UsageStatsOptions = {}): Array<{ id: number; title: string | null; spec_folder: string; file_path: string; access_count: number; last_accessed: number | null; confidence: number | null; created_at: string }> {
  const {
    sortBy = 'access_count',
    order = 'DESC',
    limit = 20
  } = options;

  const valid_sort_fields = ['access_count', 'last_accessed', 'confidence'];
  const sort_field = valid_sort_fields.includes(sortBy) ? sortBy : 'access_count';
  const sort_order = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const database = initialize_db();

  const rows = database.prepare(`
    SELECT id, title, spec_folder, file_path, access_count,
           last_accessed, confidence, created_at
    FROM memory_index
    WHERE access_count > 0
    ORDER BY ${sort_field} ${sort_order}
    LIMIT ?
  `).all(limit) as Array<{
    id: number;
    title: string | null;
    spec_folder: string;
    file_path: string;
    access_count: number;
    last_accessed: number | null;
    confidence: number | null;
    created_at: string;
  }>;

  return rows;
}

/* ───────────────────────────────────────────────────────────────
   CLEANUP FUNCTIONS
----------------------------------------------------------------*/

/**
 * Finds memory records that are candidates for cleanup.
 * @param options - Cleanup thresholds and limits.
 * @returns The cleanup candidate details.
 */
export function find_cleanup_candidates(options: CleanupOptions = {}): Array<{ id: number; specFolder: string; filePath: string; title: string; createdAt: string | undefined; lastAccessedAt: number | undefined; accessCount: number; confidence: number; ageString: string; lastAccessString: string; reasons: string[] }> {
  const database = initialize_db();

  const {
    maxAgeDays = 90,
    maxAccessCount = 2,
    maxConfidence = 0.4,
    limit = 50
  } = options;

  const cutoff_date = new Date();
  cutoff_date.setDate(cutoff_date.getDate() - maxAgeDays);
  const cutoff_iso = cutoff_date.toISOString();

  const sql = `
    SELECT
      id,
      spec_folder,
      file_path,
      title,
      created_at,
      last_accessed,
      access_count,
      confidence,
      importance_weight
    FROM memory_index
    WHERE
      created_at < ?
      OR access_count <= ?
      OR confidence <= ?
      OR (last_accessed IS NULL AND created_at < ?)
    ORDER BY
      last_accessed ASC NULLS FIRST,
      access_count ASC,
      confidence ASC
    LIMIT ?
  `;

  let rows;
  try {
    rows = database.prepare(sql).all(
      cutoff_iso,
      maxAccessCount,
      maxConfidence,
      cutoff_iso,
      limit
    );
  } catch (e: unknown) {
    console.warn(`[vector-index] find_cleanup_candidates error: ${get_error_message(e)}`);
    return [];
  }

  return (rows as MemoryRow[]).map((row: MemoryRow) => {
    const age_string = format_age_string(row.created_at ?? null);
    const last_access_string = format_age_string(
      typeof row.last_accessed === 'number' ? new Date(row.last_accessed).toISOString() : null
    );

    const reasons: string[] = [];
    if (row.created_at && new Date(row.created_at) < cutoff_date) {
      reasons.push(`created ${age_string}`);
    }
    if ((row.access_count || 0) <= maxAccessCount) {
      const count = row.access_count || 0;
      reasons.push(`accessed ${count} time${count !== 1 ? 's' : ''}`);
    }
    if ((row.confidence || 0.5) <= maxConfidence) {
      reasons.push(`low importance (${Math.round((row.confidence || 0.5) * 100)}%)`);
    }

    return {
      id: row.id,
      specFolder: row.spec_folder,
      filePath: row.file_path,
      title: row.title || 'Untitled',
      createdAt: row.created_at,
      lastAccessedAt: row.last_accessed,
      accessCount: row.access_count || 0,
      confidence: row.confidence || 0.5,
      ageString: age_string,
      lastAccessString: last_access_string,
      reasons
    };
  });
}

/**
 * Builds a preview payload for a stored memory.
 * @param memory_id - The memory identifier.
 * @param max_lines - The maximum number of file lines to include.
 * @returns The memory preview, if found.
 */
export function get_memory_preview(memory_id: number, max_lines = 50): { id: number; specFolder: string; filePath: string; title: string; createdAt: string | undefined; lastAccessedAt: number | undefined; accessCount: number; confidence: number; ageString: string; lastAccessString: string; content: string } | null {
  const database = initialize_db();

  let memory: MemoryRow | undefined;
  try {
    memory = database.prepare(`
      SELECT * FROM memory_index WHERE id = ?
    `).get(memory_id) as MemoryRow | undefined;
  } catch (e: unknown) {
    console.warn(`[vector-index] get_memory_preview query error: ${get_error_message(e)}`);
    return null;
  }

  if (!memory) return null;

  let content = '';
  try {
    // Validate DB-stored file paths before reading
    if (memory.file_path) {
      const valid_path = validate_file_path_local(memory.file_path);
      if (valid_path && fs.existsSync(valid_path)) {
        const full_content = fs.readFileSync(valid_path, 'utf-8');
        const lines = full_content.split('\n');
        content = lines.slice(0, max_lines).join('\n');
        if (lines.length > max_lines) {
          content += `\n... (${lines.length - max_lines} more lines)`;
        }
      }
    }
  } catch (e: unknown) {
    console.warn('[vector-index] get_memory_preview file read warning', {
      operation: 'get_memory_preview',
      memoryId: memory_id,
      filePath: memory.file_path ?? null,
      error: get_error_message(e),
    });
    content = '(Unable to read file content)';
  }

  return {
    id: memory.id,
    specFolder: memory.spec_folder,
    filePath: memory.file_path,
    title: memory.title || 'Untitled',
    createdAt: memory.created_at,
    lastAccessedAt: memory.last_accessed,
    accessCount: memory.access_count || 0,
    confidence: memory.confidence || 0.5,
    ageString: format_age_string(memory.created_at ?? null),
    lastAccessString: format_age_string(
      typeof memory.last_accessed === 'number' ? new Date(memory.last_accessed).toISOString() : null
    ),
    content
  };
}

/* ───────────────────────────────────────────────────────────────
   DATABASE INTEGRITY
----------------------------------------------------------------*/

// BUG-013 FIX: Added autoClean option for automatic orphan cleanup
/**
 * Verifies vector-index consistency and optional cleanup results.
 * @param options - Integrity verification options.
 * @returns The integrity summary.
 */
export function verify_integrity(
  options: { autoClean?: boolean } = {},
  database: Database.Database = initialize_db(),
): { totalMemories: number; totalVectors: number; orphanedVectors: number; missingVectors: number; orphanedFiles: Array<{ id: number; file_path: string; reason: string }>; orphanedChunks: number; isConsistent: boolean; cleaned?: { vectors: number; chunks: number } } {
  const { autoClean = false } = options;
  const sqlite_vec = get_sqlite_vec_available();

  const find_orphaned_vector_ids = () => {
    if (!sqlite_vec) {
      console.warn('[vector-index] find_orphaned_vector_ids: sqlite-vec not available');
      return [];
    }
    try {
      return (database.prepare(`
        SELECT v.rowid FROM vec_memories v
        WHERE NOT EXISTS (SELECT 1 FROM memory_index m WHERE m.id = v.rowid)
      `).all() as Array<{ rowid: number }>).map((r) => r.rowid);
    } catch (e: unknown) {
      console.warn('[vector-index] Could not query orphaned vectors:', get_error_message(e));
      return [];
    }
  };

  const orphaned_vector_ids = find_orphaned_vector_ids();
  const orphaned_vectors = orphaned_vector_ids.length;

  let cleaned_vectors = 0;
  if (autoClean && orphaned_vectors > 0 && sqlite_vec) {
    logger.info(`Auto-cleaning ${orphaned_vectors} orphaned vectors...`);
    const delete_stmt = database.prepare('DELETE FROM vec_memories WHERE rowid = ?');
    for (const rowid of orphaned_vector_ids) {
      try {
        delete_stmt.run(BigInt(rowid));
        cleaned_vectors++;
      } catch (e: unknown) {
        console.warn(`[vector-index] Failed to clean orphaned vector ${rowid}: ${get_error_message(e)}`);
      }
    }
    logger.info(`Cleaned ${cleaned_vectors} orphaned vectors`);
  }

  // F-08 — Guard vec_memories queries with sqlite_vec availability check.
  // When sqlite-vec is not loaded, the vec_memories table does not exist.
  const missing_vectors = sqlite_vec
    ? (database.prepare(`
        SELECT COUNT(*) as count FROM memory_index m
        WHERE m.embedding_status = 'success'
        AND NOT EXISTS (SELECT 1 FROM vec_memories v WHERE v.rowid = m.id)
      `).get() as { count: number }).count
    : 0;

  const total_memories = (database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as { count: number }).count;
  const total_vectors = sqlite_vec
    ? (database.prepare('SELECT COUNT(*) as count FROM vec_memories').get() as { count: number }).count
    : 0;

  const check_orphaned_files = () => {
    const memories = database.prepare('SELECT id, file_path FROM memory_index').all() as Array<{ id: number; file_path?: string | null }>;
    const orphaned: Array<{ id: number; file_path: string; reason: string }> = [];

    for (const memory of memories) {
      if (memory.file_path && !fs.existsSync(memory.file_path)) {
        orphaned.push({
          id: memory.id,
          file_path: memory.file_path,
          reason: 'File no longer exists on filesystem'
        });
      }
    }

    return orphaned;
  };

  const orphaned_files = check_orphaned_files();

  const find_orphaned_chunks = () => {
    try {
      return database.prepare(`
        SELECT id, parent_id, chunk_index, chunk_label, spec_folder
        FROM memory_index
        WHERE parent_id IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM memory_index parent
            WHERE parent.id = memory_index.parent_id
              AND parent.parent_id IS NULL
          )
      `).all() as Array<{ id: number; parent_id: number; chunk_index: number; chunk_label: string | null; spec_folder: string | null }>;
    } catch (e: unknown) {
      console.warn('[vector-index] Could not query orphaned chunks:', get_error_message(e));
      return [];
    }
  };

  const orphaned_chunks = find_orphaned_chunks();
  let cleaned_chunks = 0;

  if (autoClean && orphaned_chunks.length > 0) {
    logger.info(`Auto-cleaning ${orphaned_chunks.length} orphaned chunks...`);
    for (const chunk of orphaned_chunks) {
      try {
        // Graph cleanup: Use delete_memory_from_database to clean ancillary rows
        // (lineage, projections, graph residue) instead of raw DELETE.
        const deleted = delete_memory_from_database(database, chunk.id);
        if (deleted) {
          cleaned_chunks++;
          try {
            recordHistory(chunk.id, 'DELETE', null, null, 'mcp:integrity_check', chunk.spec_folder ?? null);
          } catch (error: unknown) {
            logger.warn('Failed to record integrity-check delete history', {
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }
      } catch (e: unknown) {
        console.warn(`[vector-index] Failed to clean orphaned chunk ${chunk.id}: ${get_error_message(e)}`);
      }
    }
    logger.info(`Cleaned ${cleaned_chunks} orphaned chunks`);
  }

  const effective_orphaned_chunks = autoClean ? orphaned_chunks.length - cleaned_chunks : orphaned_chunks.length;

  return {
    totalMemories: total_memories,
    totalVectors: total_vectors,
    orphanedVectors: autoClean ? orphaned_vectors - cleaned_vectors : orphaned_vectors,
    missingVectors: missing_vectors,
    orphanedFiles: orphaned_files,
    orphanedChunks: effective_orphaned_chunks,
    isConsistent: (orphaned_vectors - cleaned_vectors) === 0 && missing_vectors === 0 && orphaned_files.length === 0 && effective_orphaned_chunks === 0,
    cleaned: (autoClean && (cleaned_vectors > 0 || cleaned_chunks > 0))
      ? { vectors: cleaned_vectors, chunks: cleaned_chunks }
      : undefined
  };
}

// CamelCase aliases
export { get_memory as getMemory };
export { get_memories_by_folder as getMemoriesByFolder };
export { get_memory_count as getMemoryCount };
export { get_status_counts as getStatusCounts };
export { get_stats as getStats };
export { vector_search as vectorSearch };
export { get_constitutional_memories_public as getConstitutionalMemories };
export { multi_concept_search as multiConceptSearch };
export { extract_title as extractTitle };
export { extract_snippet as extractSnippet };
export { extract_tags as extractTags };
export { extract_date as extractDate };
export { generate_query_embedding as generateQueryEmbedding };
export { keyword_search as keywordSearch };
export { vector_search_enriched as vectorSearchEnriched };
export { multi_concept_search_enriched as multiConceptSearchEnriched };
export { multi_concept_keyword_search as multiConceptKeywordSearch };
export { parse_quoted_terms as parseQuotedTerms };
export { apply_smart_ranking as applySmartRanking };
export { apply_diversity as applyDiversity };
export { get_related_memories as getRelatedMemories };
export { get_usage_stats as getUsageStats };
export { find_cleanup_candidates as findCleanupCandidates };
export { get_memory_preview as getMemoryPreview };
export { verify_integrity as verifyIntegrity };

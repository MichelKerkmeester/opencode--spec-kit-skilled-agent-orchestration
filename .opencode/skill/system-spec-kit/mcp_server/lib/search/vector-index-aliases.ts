// ───────────────────────────────────────────────────────────────
// MODULE: Vector Index Aliases
// ───────────────────────────────────────────────────────────────
// Feature catalog: Namespace management CRUD tools
// Split from vector-index-store.ts — contains LRUCache, query caching,
// Learning from selections, and enhanced search with ranking+diversity.

import * as crypto from 'crypto';
import type Database from 'better-sqlite3';
import {
  parse_trigger_phrases,
  get_error_message,
} from './vector-index-types.js';
import {
  initialize_db,
  search_weights,
} from './vector-index-store.js';
import {
  vector_search,
  vector_search_enriched,
  apply_smart_ranking,
  apply_diversity,
  generate_query_embedding,
} from './vector-index-queries.js';

type EnrichedSearchResult = {
  rank: number;
  similarity?: number;
  avgSimilarity?: number;
  conceptSimilarities?: number[];
  title: string;
  specFolder: string;
  filePath: string;
  date: string | null;
  tags: string[];
  snippet: string;
  id: number;
  importanceWeight: number;
  created_at?: string;
  access_count?: number;
  smartScore?: number;
  spec_folder?: string;
  searchMethod?: string;
  isConstitutional: boolean;
  [key: string]: unknown;
};
type EnhancedSearchOptions = {
  specFolder?: string | null;
  minSimilarity?: number;
  diversityFactor?: number;
  noDiversity?: boolean;
};

const MAX_TRIGGERS_PER_MEMORY = search_weights.maxTriggersPerMemory || 10;

/* ───────────────────────────────────────────────────────────────
   LRU CACHE
----------------------------------------------------------------*/

// LRU Cache with O(1) eviction using doubly-linked list
type CacheNode<TValue> = {
  key: string;
  value: TValue;
  timestamp: number;
  prev: CacheNode<TValue> | null;
  next: CacheNode<TValue> | null;
};

/** Maintains a TTL-based least-recently-used cache for search helpers. */
export class LRUCache<TValue> {
  max_size: number;
  ttl_ms: number;
  cache: Map<string, CacheNode<TValue>>;
  head: CacheNode<TValue>;
  tail: CacheNode<TValue>;

  constructor(max_size: number, ttl_ms: number) {
    this.max_size = max_size;
    this.ttl_ms = ttl_ms;
    this.cache = new Map<string, CacheNode<TValue>>();
    this.head = { key: '__head__', value: null as unknown as TValue, timestamp: 0, prev: null, next: null };
    this.tail = { key: '__tail__', value: null as unknown as TValue, timestamp: 0, prev: this.head, next: null };
    this.head.next = this.tail;
  }

  get(key: string): TValue | null {
    const node = this.cache.get(key);
    if (!node) return null;
    if (Date.now() - node.timestamp > this.ttl_ms) {
      this._remove(node);
      this.cache.delete(key);
      return null;
    }
    this._move_to_front(node);
    return node.value;
  }

  set(key: string, value: TValue) {
    let node = this.cache.get(key);
    if (node) {
      node.value = value;
      node.timestamp = Date.now();
      this._move_to_front(node);
    } else {
      node = { key, value, timestamp: Date.now(), prev: null, next: null };
      this._add_to_front(node);
      this.cache.set(key, node);
      if (this.cache.size > this.max_size) {
        const oldest = this.tail.prev;
        if (oldest && oldest !== this.head) {
          this._remove(oldest);
          this.cache.delete(oldest.key);
        }
      }
    }
  }

  _add_to_front(node: CacheNode<TValue>) {
    node.next = this.head.next;
    node.prev = this.head;
    if (this.head.next) {
      this.head.next.prev = node;
    }
    this.head.next = node;
  }

  _remove(node: CacheNode<TValue>) {
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
  }

  _move_to_front(node: CacheNode<TValue>) {
    this._remove(node);
    this._add_to_front(node);
  }

  clear() {
    this.cache.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  keys(): IterableIterator<string> {
    return this.cache.keys();
  }

  delete(key: string) {
    const node = this.cache.get(key);
    if (node) {
      this._remove(node);
      this.cache.delete(key);
      return true;
    }
    return false;
  }

  get size() { return this.cache.size; }
}

/* ───────────────────────────────────────────────────────────────
   QUERY CACHE
----------------------------------------------------------------*/

type QueryCacheEntry = {
  results: EnrichedSearchResult[];
  specFolder: string | null;
};

let query_cache: LRUCache<QueryCacheEntry> | null = null;

/**
 * Returns the shared query cache instance.
 * @returns The initialized query cache.
 */
export function get_query_cache(): LRUCache<QueryCacheEntry> {
  if (!query_cache) {
    query_cache = new LRUCache(500, 15 * 60 * 1000);
  }
  return query_cache;
}

/**
 * Builds a stable cache key for a search request.
 * @param query - The search query.
 * @param limit - The requested result limit.
 * @param options - Additional search options.
 * @returns The cache key string.
 */
export function get_cache_key(query: string, limit: number, options: Record<string, unknown>): string {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify({ query, limit, options }));
  return hash.digest('hex').substring(0, 16);
}

// Cached version of vector_search_enriched with LRU cache
/**
 * Runs an enriched search with LRU caching.
 * @param query - The search query.
 * @param limit - The maximum number of results to return.
 * @param options - Additional search options.
 * @returns The enriched search results.
 */
export async function cached_search(query: string, limit = 20, options: Record<string, unknown> = {}): Promise<EnrichedSearchResult[]> {
  const cache = get_query_cache();
  const key = get_cache_key(query, limit, options);
  const specFolder = typeof options.specFolder === 'string'
    ? options.specFolder
    : (typeof options.spec_folder === 'string' ? options.spec_folder : null);

  const cached = cache.get(key);
  if (cached) {
    return cached.results;
  }

  const results = await vector_search_enriched(query, limit, options);

  cache.set(key, { results, specFolder });

  return results;
}

/**
 * Clears cached search results globally or for one spec folder.
 * @param spec_folder - The optional spec folder to clear.
 * @returns The number of cleared cache entries.
 */
export function clear_search_cache(spec_folder: string | null = null): number {
  if (!query_cache) {
    return 0;
  }

  if (spec_folder) {
    const keys_to_delete: string[] = [];
    for (const key of query_cache.keys()) {
      const cachedEntry = query_cache.get(key);
      if (cachedEntry && cachedEntry.specFolder === spec_folder) {
        keys_to_delete.push(key);
      }
    }
    for (const key of keys_to_delete) {
      query_cache.delete(key);
    }
    return keys_to_delete.length;
  } else {
    const size = query_cache.size;
    query_cache.clear();
    return size;
  }
}

/* ───────────────────────────────────────────────────────────────
   LEARNING FROM SELECTIONS
----------------------------------------------------------------*/

/**
 * Learns new trigger phrases from a selected result.
 * @param search_query - The original search query.
 * @param selected_memory_id - The selected memory identifier.
 * @returns True when trigger phrases were updated.
 */
export function learn_from_selection(search_query: string, selected_memory_id: number): boolean {
  if (!search_query || !selected_memory_id) return false;

  const database = initialize_db();

  let memory: { trigger_phrases?: string | null } | undefined;
  try {
    memory = database.prepare(
      'SELECT trigger_phrases FROM memory_index WHERE id = ?'
    ).get(selected_memory_id) as { trigger_phrases?: string | null } | undefined;
  } catch (e: unknown) {
    console.warn(`[vector-index] learn_from_selection query error: ${get_error_message(e)}`);
    return false;
  }

  if (!memory) return false;

  let existing: string[] = [];
  try {
    existing = parse_trigger_phrases(memory.trigger_phrases || undefined);
  } catch (_e: unknown) {
    existing = [];
  }

  const stop_words = [
    'that', 'this', 'what', 'where', 'when', 'which', 'with', 'from',
    'have', 'been', 'were', 'being', 'about', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'under', 'again',
    'further', 'then', 'once', 'here', 'there', 'each', 'some', 'other'
  ];

  const new_terms = search_query
    .toLowerCase()
    .split(/\s+/)
    .filter((term: string) => {
      if (term.length < 4) return false;
      if (stop_words.includes(term)) return false;
      if (existing.some((e: string) => e.toLowerCase() === term)) return false;
      if (/^\d+$/.test(term)) return false;
      return true;
    })
    .slice(0, 3);

  if (new_terms.length === 0) return false;

  const updated = [...existing, ...new_terms].slice(0, MAX_TRIGGERS_PER_MEMORY);

  try {
    database.prepare(
      'UPDATE memory_index SET trigger_phrases = ? WHERE id = ?'
    ).run(JSON.stringify(updated), selected_memory_id);
    return true;
  } catch (e: unknown) {
    console.warn(`[vector-index] learn_from_selection update error: ${get_error_message(e)}`);
    return false;
  }
}

/* ───────────────────────────────────────────────────────────────
   RELATED MEMORIES AND ACCESS TRACKING
----------------------------------------------------------------*/

// Find and link related memories when saving a new memory
/**
 * Links a new memory to similar existing memories.
 * @param new_memory_id - The saved memory identifier.
 * @param content - The memory content to analyze.
 * @returns A promise that resolves when related links are updated.
 */
export async function link_related_on_save(new_memory_id: number, content: string): Promise<void> {
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return;
  }

  try {
    const embedding = await generate_query_embedding(content.substring(0, 1000));
    if (!embedding) {
      console.warn(`[vector-index] Could not generate embedding for memory ${new_memory_id}`);
      return;
    }

    const similar = vector_search(embedding, {
      limit: 6,
      minSimilarity: 75
    });

    const related = similar
      .filter(r => r.id !== new_memory_id)
      .slice(0, 5)
      .map(r => ({ id: r.id, similarity: r.similarity }));

    if (related.length > 0) {
      const database = initialize_db();
      database.prepare(`
        UPDATE memory_index
        SET related_memories = ?
        WHERE id = ?
      `).run(JSON.stringify(related), new_memory_id);
    }
  } catch (error: unknown) {
    console.warn(`[vector-index] Failed to link related memories for ${new_memory_id}: ${get_error_message(error)}`);
  }
}

// Record memory access for usage tracking
/**
 * Records an access event for a memory.
 * @param memory_id - The memory identifier.
 * @returns True when the access update succeeds.
 */
export function record_access(memory_id: number): boolean {
  try {
    const database = initialize_db();
    const now = Date.now();

    const result = database.prepare(`
      UPDATE memory_index
      SET access_count = access_count + 1,
          last_accessed = ?
      WHERE id = ?
    `).run(now, memory_id);

    return result.changes > 0;
  } catch (error: unknown) {
    console.warn(`[vector-index] Failed to record access for memory ${memory_id}: ${get_error_message(error)}`);
    return false;
  }
}

/* ───────────────────────────────────────────────────────────────
   ENHANCED SEARCH
----------------------------------------------------------------*/

/**
 * Runs enriched search with smart ranking and diversity controls.
 * @param query - The search query.
 * @param limit - The maximum number of results to return.
 * @param options - Search tuning options.
 * @returns The ranked search results.
 */
export async function enhanced_search(
  query: string,
  limit = 20,
  options: EnhancedSearchOptions = {},
  database: Database.Database = initialize_db(),
): Promise<EnrichedSearchResult[]> {
  const start_time = Date.now();

  const fetch_limit = Math.min(limit * 2, 100);

  const results = await vector_search_enriched(query, fetch_limit, {
    specFolder: options.specFolder,
    minSimilarity: options.minSimilarity || 30
  }, database);

  const ranked = apply_smart_ranking(results);

  const diversity_factor = options.diversityFactor !== undefined ? options.diversityFactor : 0.3;
  const diverse = options.noDiversity ? ranked : apply_diversity(ranked, diversity_factor);

  const final_results = diverse.slice(0, limit);

  const elapsed = Date.now() - start_time;
  if (elapsed > 600) {
    console.warn(`[vector-index] Enhanced search took ${elapsed}ms (target <600ms)`);
  }

  return final_results;
}

// CamelCase aliases
export { cached_search as cachedSearch };
export { clear_search_cache as clearSearchCache };
export { learn_from_selection as learnFromSelection };
export { link_related_on_save as linkRelatedOnSave };
export { record_access as recordAccess };
export { enhanced_search as enhancedSearch };
export { get_cache_key as getCacheKey };

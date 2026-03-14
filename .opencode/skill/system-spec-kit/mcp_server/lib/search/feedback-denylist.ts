// ───────────────────────────────────────────────────────────────
// MODULE: Feedback Denylist
// ───────────────────────────────────────────────────────────────
// Feature catalog: Learned relevance feedback
// 100+ stop words that should never be learned as trigger phrases.
// Prevents noise injection into learned relevance feedback.
/* ───────────────────────────────────────────────────────────────
   1. ENGLISH STOP WORDS
   Common English words that carry no semantic signal.
   ──────────────────────────────────────────────────────────────── */

const ENGLISH_STOP_WORDS: readonly string[] = [
  // Articles & determiners
  'a', 'an', 'the', 'this', 'that', 'these', 'those',
  // Pronouns
  'i', 'me', 'my', 'mine', 'we', 'us', 'our', 'ours',
  'you', 'your', 'yours', 'he', 'him', 'his', 'she', 'her', 'hers',
  'it', 'its', 'they', 'them', 'their', 'theirs',
  'who', 'whom', 'whose', 'which', 'what',
  // Prepositions & conjunctions
  'in', 'on', 'at', 'to', 'for', 'with', 'from', 'by', 'about',
  'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'under', 'over', 'of', 'and', 'or', 'but', 'nor',
  'so', 'yet', 'both', 'either', 'neither',
  // Verbs (auxiliary / common)
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing',
  'will', 'would', 'shall', 'should', 'may', 'might', 'must',
  'can', 'could',
  // Adverbs & misc
  'not', 'no', 'yes', 'very', 'just', 'also', 'only', 'too',
  'here', 'there', 'when', 'where', 'how', 'why',
  'all', 'each', 'every', 'any', 'some', 'many', 'much',
  'more', 'most', 'other', 'another', 'such', 'than', 'then',
  'if', 'else', 'because', 'as', 'until', 'while',
] as const;

/* ───────────────────────────────────────────────────────────────
   2. CODE / PROGRAMMING STOP WORDS
   Generic programming keywords that appear in nearly all code.
   ──────────────────────────────────────────────────────────────── */

const CODE_STOP_WORDS: readonly string[] = [
  'function', 'const', 'let', 'var', 'import', 'export', 'return',
  'class', 'interface', 'type', 'enum', 'module', 'require',
  'default', 'extends', 'implements', 'new', 'delete', 'typeof',
  'instanceof', 'void', 'null', 'undefined', 'true', 'false',
  'async', 'await', 'try', 'catch', 'finally', 'throw',
  'if', 'else', 'switch', 'case', 'break', 'continue',
  'for', 'while', 'do', 'of', 'in',
  'string', 'number', 'boolean', 'object', 'array',
] as const;

/* ───────────────────────────────────────────────────────────────
   3. DOMAIN-SPECIFIC STOP WORDS (Memory System)
   Generic terms in the spec-kit memory domain that are too broad
   to serve as meaningful trigger phrases.
   ──────────────────────────────────────────────────────────────── */

const DOMAIN_STOP_WORDS: readonly string[] = [
  'memory', 'session', 'context', 'spec', 'folder', 'file', 'path',
  'data', 'value', 'key', 'name', 'id', 'index', 'list', 'item',
  'result', 'results', 'query', 'search', 'find', 'get', 'set',
  'create', 'update', 'delete', 'save', 'load', 'read', 'write',
  'config', 'option', 'options', 'setting', 'settings', 'parameter',
  'test', 'error', 'warning', 'info', 'debug', 'log',
  'todo', 'fixme', 'hack', 'note',
] as const;

// ───────────────────────────────────────────────────────────────
// 1. COMBINED DENYLIST

// ───────────────────────────────────────────────────────────────
/**
 * Complete denylist of 100+ stop words that should never be learned
 * as trigger phrases. All terms stored in lowercase for case-insensitive matching.
 */
export const DENYLIST: Set<string> = new Set<string>([
  ...ENGLISH_STOP_WORDS,
  ...CODE_STOP_WORDS,
  ...DOMAIN_STOP_WORDS,
]);

// ───────────────────────────────────────────────────────────────
// 2. PUBLIC API

// ───────────────────────────────────────────────────────────────
/**
 * Check if a term is on the denylist (case-insensitive).
 *
 * @param term - The term to check
 * @returns true if the term is on the denylist and should NOT be learned
 */
export function isOnDenylist(term: string): boolean {
  return DENYLIST.has(term.toLowerCase().trim());
}

/**
 * Get the total number of words in the denylist.
 *
 * @returns The size of the denylist set
 */
export function getDenylistSize(): number {
  return DENYLIST.size;
}

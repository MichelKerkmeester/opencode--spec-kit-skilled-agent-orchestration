// ───────────────────────────────────────────────────────────────
// MODULE: Entity Scope
// ───────────────────────────────────────────────────────────────
// Feature catalog: Auto entity extraction
// Provides context type detection, scope filtering, and session ID
// Generation for the spec-kit memory system.

/** @deprecated Never wired into production pipeline. Entity scoping handled by entity-linker.ts instead. */

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS

// ───────────────────────────────────────────────────────────────
/** Valid context types for memory classification */
export const CONTEXT_TYPES: string[] = [
  'research',
  'implementation',
  'decision',
  'discovery',
  'general',
];

// ───────────────────────────────────────────────────────────────
// 2. CONTEXT TYPE DETECTION

// ───────────────────────────────────────────────────────────────
/** Keyword-to-context-type mapping (order = priority) */
const CONTENT_KEYWORDS: Array<{ type: string; keywords: string[] }> = [
  { type: 'research', keywords: ['explored', 'investigated'] },
  { type: 'implementation', keywords: ['implemented', 'built'] },
  { type: 'decision', keywords: ['decided', 'chose'] },
  { type: 'discovery', keywords: ['found', 'discovered'] },
];

/** Read/Grep/Glob tool names used to detect research-heavy tool usage */
const RESEARCH_TOOLS = new Set(['Read', 'Grep', 'Glob']);

/**
 * Detect context type from free-text content by scanning for keywords.
 * Returns the first matching type, or 'general' if none match.
 */
export function detectContextType(content: string): string {
  if (!content) return 'general';

  const lower = content.toLowerCase();

  for (const { type, keywords } of CONTENT_KEYWORDS) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        return type;
      }
    }
  }

  return 'general';
}

/**
 * Detect context type from a list of tool invocations.
 * - If AskUserQuestion is present → 'decision'
 * - If Read/Grep/Glob are the majority → 'research'
 * - Otherwise → 'general'
 */
export function detectContextTypeFromTools(
  tools: Array<{ tool: string }> | null,
): string {
  if (!tools || tools.length === 0) return 'general';

  // AskUserQuestion presence → decision
  if (tools.some((t) => t.tool === 'AskUserQuestion')) {
    return 'decision';
  }

  // Count research-oriented tools
  const researchCount = tools.filter((t) => RESEARCH_TOOLS.has(t.tool)).length;
  if (researchCount > tools.length / 2) {
    return 'research';
  }

  return 'general';
}

// ───────────────────────────────────────────────────────────────
// 3. SCOPE FILTER BUILDER

// ───────────────────────────────────────────────────────────────
/**
 * Build a SQL WHERE clause from a scope object.
 * Combines individual filters with AND. Returns {clause, params}.
 */
export function buildScopeFilter(scope: {
  specFolder?: string;
  sessionId?: string;
  contextTypes?: string[];
}): { clause: string; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (scope.specFolder) {
    conditions.push('spec_folder = ?');
    params.push(scope.specFolder);
  }

  if (scope.sessionId) {
    conditions.push('(session_id = ? OR session_id IS NULL)');
    params.push(scope.sessionId);
  }

  if (scope.contextTypes && scope.contextTypes.length > 0) {
    const placeholders = scope.contextTypes.map(() => '?').join(', ');
    conditions.push(`context_type IN (${placeholders})`);
    params.push(...scope.contextTypes);
  }

  if (conditions.length === 0) {
    return { clause: '1=1', params: [] };
  }

  return {
    clause: conditions.join(' AND '),
    params,
  };
}

/* ───────────────────────────────────────────────────────────────
   4. VALIDATION & UTILITIES
   ──────────────────────────────────────────────────────────────── */

/** Check whether a string is a recognised context type */
export function isValidContextType(type: string): boolean {
  return CONTEXT_TYPES.includes(type);
}

/** Generate a unique, session-prefixed identifier */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `session-${timestamp}-${random}`;
}

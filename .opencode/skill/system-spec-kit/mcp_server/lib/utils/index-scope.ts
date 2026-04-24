// ───────────────────────────────────────────────────────────────
// MODULE: Index Scope Invariants
// ───────────────────────────────────────────────────────────────

const SEGMENT_BOUNDARY = '(^|/)';
const SEGMENT_END = '(/|$)';

function compileSegmentPattern(segment: string): RegExp {
  return new RegExp(`${SEGMENT_BOUNDARY}${segment}${SEGMENT_END}`, 'i');
}

function normalizeIndexScopePath(filePath: string | null | undefined): string {
  if (!filePath || typeof filePath !== 'string') {
    return '';
  }

  return filePath.replace(/\\/g, '/').replace(/\/+/g, '/');
}

function matchesAnyPattern(filePath: string, patterns: readonly RegExp[]): boolean {
  const normalizedPath = normalizeIndexScopePath(filePath);
  return patterns.some(pattern => pattern.test(normalizedPath));
}

export const EXCLUDED_FOR_MEMORY = [
  compileSegmentPattern('z_future'),
  compileSegmentPattern('external'),
  compileSegmentPattern('z_archive'),
] as const;

export const EXCLUDED_FOR_CODE_GRAPH = [
  compileSegmentPattern('external'),
  compileSegmentPattern('node_modules'),
  compileSegmentPattern('\\.git'),
  compileSegmentPattern('dist'),
  compileSegmentPattern('vendor'),
  compileSegmentPattern('z_future'),
  compileSegmentPattern('z_archive'),
  /(^|\/)mcp-coco-index\/mcp_server(\/|$)/i,
] as const;

export function shouldIndexForMemory(absolutePath: string): boolean {
  return !matchesAnyPattern(absolutePath, EXCLUDED_FOR_MEMORY);
}

export function shouldIndexForCodeGraph(absolutePath: string): boolean {
  return !matchesAnyPattern(absolutePath, EXCLUDED_FOR_CODE_GRAPH);
}

export function isConstitutionalPath(absolutePath: string): boolean {
  return compileSegmentPattern('constitutional').test(normalizeIndexScopePath(absolutePath));
}

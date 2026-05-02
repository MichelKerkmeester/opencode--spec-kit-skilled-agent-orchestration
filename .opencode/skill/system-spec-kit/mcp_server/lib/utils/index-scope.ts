// ───────────────────────────────────────────────────────────────
// MODULE: Index Scope Invariants
// ───────────────────────────────────────────────────────────────

import {
  resolveIndexScopePolicy,
  type IndexScopePolicy,
  type ResolveIndexScopePolicyInput,
} from '../../code_graph/lib/index-scope-policy.js';

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

const EXCLUDED_SKILL_INTERNALS_FOR_CODE_GRAPH = [
  /(^|\/)\.opencode\/skill(\/|$)/i,
] as const;

export function shouldIndexForMemory(absolutePath: string): boolean {
  return !matchesAnyPattern(absolutePath, EXCLUDED_FOR_MEMORY);
}

export function shouldIndexForCodeGraph(
  absolutePath: string,
  policyInput?: IndexScopePolicy | ResolveIndexScopePolicyInput,
): boolean {
  if (matchesAnyPattern(absolutePath, EXCLUDED_FOR_CODE_GRAPH)) {
    return false;
  }
  const policy = resolveIndexScopePolicy(policyInput);
  return policy.includeSkills || !matchesAnyPattern(absolutePath, EXCLUDED_SKILL_INTERNALS_FOR_CODE_GRAPH);
}

export function isConstitutionalPath(absolutePath: string): boolean {
  return compileSegmentPattern('constitutional').test(normalizeIndexScopePath(absolutePath));
}

export function isIndexableConstitutionalMemoryPath(absolutePath: string): boolean {
  const normalizedPath = normalizeIndexScopePath(absolutePath);
  if (!isConstitutionalPath(normalizedPath)) {
    return false;
  }

  const segments = normalizedPath.split('/').filter(Boolean);
  const constitutionalIndex = segments.findIndex(segment => segment.toLowerCase() === 'constitutional');
  const basename = segments[segments.length - 1]?.toLowerCase() ?? '';
  return constitutionalIndex >= 0 && basename !== 'readme.md';
}

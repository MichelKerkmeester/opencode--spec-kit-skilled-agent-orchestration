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

function getCodeGraphPolicy(
  policyInput?: IndexScopePolicy | ResolveIndexScopePolicyInput,
): IndexScopePolicy {
  if (policyInput && 'fingerprint' in policyInput) {
    return policyInput;
  }
  return resolveIndexScopePolicy(policyInput);
}

function matchOpencodeSkillPath(filePath: string): string | null | undefined {
  const normalizedPath = normalizeIndexScopePath(filePath);
  const match = normalizedPath.match(/(?:^|\/)\.opencode\/skill(?:\/([^/]+))?(?:\/|$)/i);
  return match ? (match[1] ?? null) : undefined;
}

function matchesOpencodeFolder(filePath: string, folder: string): boolean {
  const normalizedPath = normalizeIndexScopePath(filePath);
  return new RegExp(`(?:^|/)\\.opencode/${folder}(?:/|$)`, 'i').test(normalizedPath);
}

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
  const policy = getCodeGraphPolicy(policyInput);
  const skillName = matchOpencodeSkillPath(absolutePath);
  if (skillName !== undefined) {
    if (policy.includedSkillsList === 'none') return false;
    if (policy.includedSkillsList === 'all') return true;
    return skillName === null || policy.includedSkillsList.includes(skillName);
  }
  if (matchesOpencodeFolder(absolutePath, 'agent') && !policy.includeAgents) return false;
  if (matchesOpencodeFolder(absolutePath, 'command') && !policy.includeCommands) return false;
  if (matchesOpencodeFolder(absolutePath, 'specs') && !policy.includeSpecs) return false;
  if (matchesOpencodeFolder(absolutePath, 'plugins') && !policy.includePlugins) return false;
  return true;
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

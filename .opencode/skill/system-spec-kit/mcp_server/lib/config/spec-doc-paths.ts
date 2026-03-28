// ───────────────────────────────────────────────────────────────
// MODULE: Spec Document Paths
// ───────────────────────────────────────────────────────────────

export const SPEC_DOCUMENT_FILENAMES = new Set([
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
  'decision-record.md',
  'implementation-summary.md',
  'research.md',
  'handover.md',
]);

const WORKING_ARTIFACT_SEGMENTS = [
  '/scratch/',
  '/temp/',
  '/research/iterations/',
  '/review/iterations/',
] as const;

const SPEC_DOCUMENT_EXCLUDED_SEGMENTS = [
  '/memory/',
  '/scratch/',
  '/temp/',
  '/review/',
  '/z_archive/',
  '/research/iterations/',
  '/review/iterations/',
  '/node_modules/',
] as const;

// Accept both canonical packet leaves like "010-feature" and numeric leaves like "010".
const SPEC_LEAF_SEGMENT_PATTERN = /^\d{3}(?:[-_].+)?$/;

export function normalizeSpecPath(filePath: string | null | undefined): string {
  if (!filePath || typeof filePath !== 'string') {
    return '';
  }

  return filePath.replace(/\\/g, '/').toLowerCase();
}

export function isSpecsScopedPath(filePath: string | null | undefined): boolean {
  const normalizedPath = normalizeSpecPath(filePath);
  return normalizedPath.includes('/specs/') || normalizedPath.startsWith('specs/');
}

export function isWorkingArtifactPath(filePath: string | null | undefined): boolean {
  const normalizedPath = normalizeSpecPath(filePath);
  return WORKING_ARTIFACT_SEGMENTS.some((segment) => normalizedPath.includes(segment));
}

export function isSpecDocumentExcludedPath(filePath: string | null | undefined): boolean {
  const normalizedPath = normalizeSpecPath(filePath);
  return SPEC_DOCUMENT_EXCLUDED_SEGMENTS.some((segment) => normalizedPath.includes(segment));
}

export function isCanonicalResearchDocumentPath(filePath: string | null | undefined): boolean {
  const normalizedPath = normalizeSpecPath(filePath);
  return normalizedPath.endsWith('/research/research.md') || normalizedPath === 'research/research.md';
}

export function isLegacyOrCanonicalResearchDocumentPath(filePath: string | null | undefined): boolean {
  const normalizedPath = normalizeSpecPath(filePath);
  return normalizedPath.endsWith('/research.md')
    || normalizedPath === 'research.md'
    || isCanonicalResearchDocumentPath(normalizedPath);
}

export function canClassifyAsSpecDocument(filePath: string | null | undefined): boolean {
  return isSpecsScopedPath(filePath) && !isSpecDocumentExcludedPath(filePath);
}

export function isSpecLeafSegment(segment: string | null | undefined): boolean {
  return typeof segment === 'string' && SPEC_LEAF_SEGMENT_PATTERN.test(segment);
}

export function matchesSpecDocumentPath(
  filePath: string | null | undefined,
  basename: string,
): boolean {
  if (!canClassifyAsSpecDocument(filePath)) {
    return false;
  }

  const normalizedPath = normalizeSpecPath(filePath);
  const normalizedBasename = basename.toLowerCase();
  const segments = normalizedPath.split('/').filter(Boolean);
  const parent = segments[segments.length - 2] || '';
  const grandParent = segments[segments.length - 3] || '';

  if (normalizedBasename === 'research.md') {
    if (!isLegacyOrCanonicalResearchDocumentPath(normalizedPath)) {
      return false;
    }

    if (parent === 'research') {
      return isSpecLeafSegment(grandParent);
    }

    return isSpecLeafSegment(parent);
  }

  return (
    (normalizedPath.endsWith(`/${normalizedBasename}`) || normalizedPath === normalizedBasename)
    && isSpecLeafSegment(parent)
  );
}

export function extractSpecFolderFromSpecDocumentPath(
  filePath: string | null | undefined,
): string | null {
  if (!canClassifyAsSpecDocument(filePath)) {
    return null;
  }

  const normalizedPath = normalizeSpecPath(filePath);
  const segments = normalizedPath.split('/').filter(Boolean);
  const specsIndex = segments.findIndex((segment) => segment === 'specs');
  if (specsIndex < 0) {
    return null;
  }

  const basename = segments[segments.length - 1] || '';
  if (!matchesSpecDocumentPath(normalizedPath, basename)) {
    return null;
  }

  const parent = segments[segments.length - 2] || '';
  if (basename === 'research.md' && parent === 'research') {
    return segments.slice(specsIndex + 1, segments.length - 2).join('/');
  }

  return segments.slice(specsIndex + 1, segments.length - 1).join('/');
}

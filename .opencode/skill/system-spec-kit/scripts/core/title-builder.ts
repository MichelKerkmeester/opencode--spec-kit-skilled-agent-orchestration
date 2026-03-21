// ───────────────────────────────────────────────────────────────
// MODULE: Title Builder
// ───────────────────────────────────────────────────────────────
// Memory title construction and normalization utilities.
// Extracted from workflow.ts to reduce module size.

import * as path from 'node:path';
import * as fsSync from 'node:fs';
import { pickBestContentName } from '../utils/slug-utils';
import { normalizeSpecTitleForMemory } from '../utils/task-enrichment';

// ───────────────────────────────────────────────────────────────
// 1. FUNCTIONS
// ───────────────────────────────────────────────────────────────

export function normalizeMemoryTitleCandidate(raw: string): string {
  return raw
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\s\-:;,]+$/, '');
}

export function truncateMemoryTitle(title: string, maxLength: number = 110): string {
  if (title.length <= maxLength) {
    return title;
  }

  const truncated = title.slice(0, maxLength).trim();
  const lastSpace = truncated.lastIndexOf(' ');
  const wordBoundary = lastSpace > 0 ? truncated.slice(0, lastSpace).trim() : truncated;

  return `${wordBoundary}...`;
}

export function slugToTitle(slug: string): string {
  return slug
    .replace(/(?<=\d)-(?=\d)/g, '\x00')   // protect digit-digit hyphens (dates like 2026-03-13)
    .replace(/-/g, ' ')
    .replace(/\x00/g, '-')                 // restore digit-digit hyphens
    .replace(/\s{2,}/g, ' ')              // collapse consecutive spaces
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export function buildMemoryTitle(_implementationTask: string, _specFolderName: string, _date: string, contentSlug?: string): string {
  if (contentSlug && contentSlug.length > 0) {
    return truncateMemoryTitle(slugToTitle(contentSlug));
  }

  // Fallback (should not happen -- contentSlug is always available at call site)
  const preferredTitle = pickBestContentName([_implementationTask]);
  if (preferredTitle.length > 0) {
    return truncateMemoryTitle(normalizeMemoryTitleCandidate(preferredTitle));
  }

  const folderLeaf = _specFolderName.split('/').filter(Boolean).pop() || _specFolderName;
  const readableFolder = normalizeMemoryTitleCandidate(folderLeaf.replace(/^\d+-/, '').replace(/-/g, ' '));
  const fallback = readableFolder.length > 0 ? `${readableFolder} session ${_date}` : `Session ${_date}`;
  return truncateMemoryTitle(fallback);
}

export function buildMemoryDashboardTitle(memoryTitle: string, specFolderName: string, contextFilename: string): string {
  const specLeaf = specFolderName.split('/').filter(Boolean).pop() || specFolderName;
  const fileStem = path.basename(contextFilename, path.extname(contextFilename));
  const suffix = `[${specLeaf}/${fileStem}]`;

  if (memoryTitle.endsWith(suffix)) {
    return memoryTitle;
  }

  const maxLength = 120;
  const maxBaseLength = Math.max(24, maxLength - suffix.length - 1);
  let base = memoryTitle.trim();

  if (base.length > maxBaseLength) {
    const hardCut = base.slice(0, maxBaseLength).trim();
    const lastSpace = hardCut.lastIndexOf(' ');
    if (lastSpace >= Math.floor(maxBaseLength * 0.6)) {
      base = hardCut.slice(0, lastSpace);
    } else {
      base = hardCut;
    }
  }

  return `${base} ${suffix}`;
}

export function extractSpecTitle(specFolderPath: string): string {
  try {
    const specPath = path.join(specFolderPath, 'spec.md');
    const content = fsSync.readFileSync(specPath, 'utf-8');
    const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!fmMatch) return '';
    const titleMatch = fmMatch[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
    if (!titleMatch || !titleMatch[1]) return '';
    return normalizeSpecTitleForMemory(titleMatch[1]);
  } catch (_error: unknown) {
    if (_error instanceof Error) {
      void _error.message;
    }
    return '';
  }
}

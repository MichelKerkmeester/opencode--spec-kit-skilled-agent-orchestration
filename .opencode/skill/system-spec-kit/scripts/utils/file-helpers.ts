// ───────────────────────────────────────────────────────────────
// 1. FILE HELPERS
// ───────────────────────────────────────────────────────────────
// Path normalization, description cleaning, and file categorization utilities

import { posix as pathPosix } from 'node:path';

// ───────────────────────────────────────────────────────────────
// 2. PATH UTILITIES
// ───────────────────────────────────────────────────────────────
function toRelativePath(filePath: string, projectRoot?: string): string {
  if (!filePath) return '';
  let cleaned: string = pathPosix.normalize(filePath.replace(/\\/g, '/'));

  if (projectRoot) {
    // F-02: Segment-boundary containment check prevents partial-prefix matches
    // (e.g., root="/foo/bar" must not match "/foo/barbaz/file")
    const normalizedRoot = pathPosix.normalize(projectRoot.replace(/\\/g, '/'))
      .replace(/\/+$/, '');

    if (cleaned === normalizedRoot) {
      cleaned = '';
    } else if (cleaned.startsWith(normalizedRoot + '/')) {
      cleaned = cleaned.slice(normalizedRoot.length + 1);
    } else if (pathPosix.isAbsolute(cleaned)) {
      // Absolute path outside project root — reject
      return '';
    }
  }

  cleaned = cleaned.replace(/^\.\//, '');
  if (cleaned === '.') cleaned = '';
  if (cleaned.includes('../') || cleaned.startsWith('..')) return '';

  if (cleaned.length > 60) {
    const parts: string[] = cleaned.split('/');
    if (parts.length > 3) {
      return `${parts[0]}/.../${parts.slice(-2).join('/')}`;
    }
  }

  return cleaned;
}

// ───────────────────────────────────────────────────────────────
// 3. DESCRIPTION UTILITIES
// ───────────────────────────────────────────────────────────────
// NOTE: A stricter variant exists in lib/semantic-summarizer.ts with 3 additional
// Garbage patterns (/^changed?$/i, /^no description available$/i, /^modified?$/i).
function isDescriptionValid(description: string): boolean {
  if (!description || description.length < 8) return false;

  const garbagePatterns: readonly RegExp[] = [
    /^#+\s/,
    /^[-*]\s/,
    /\s(?:and|or|to|the)\s*$/i,
    /^(?:modified?|updated?)\s+\w+$/i,
    /^filtering\s+(?:pipeline|system)$/i,
    /^And\s+[`'"]?/i,
    /^Modified during session$/i,
    /\[PLACEHOLDER\]/i,
  ] as const;

  return !garbagePatterns.some((p: RegExp) => p.test(description));
}

function cleanDescription(desc: string): string {
  if (!desc) return '';
  let cleaned: string = desc.trim();

  cleaned = cleaned.replace(/^#+\s+/, '');
  cleaned = cleaned.replace(/^[-*]\s+/, '');
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleaned = cleaned.replace(/[.,;:]+$/, '');

  if (cleaned.length > 60) {
    cleaned = cleaned.substring(0, 57) + '...';
  }

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

// ───────────────────────────────────────────────────────────────
// 4. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  toRelativePath,
  isDescriptionValid,
  cleanDescription,
};

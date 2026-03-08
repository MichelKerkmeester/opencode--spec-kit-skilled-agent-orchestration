// ---------------------------------------------------------------
// MODULE: File Helpers
// ---------------------------------------------------------------
// Path normalization, description cleaning, and file categorization utilities

// 1. PATH UTILITIES

function toRelativePath(filePath: string, projectRoot?: string): string {
  if (!filePath) return '';
  let cleaned: string = filePath;

  if (projectRoot && cleaned.startsWith(projectRoot)) {
    cleaned = cleaned.slice(projectRoot.length);
    if (cleaned.startsWith('/')) cleaned = cleaned.slice(1);
  }

  cleaned = cleaned.replace(/^\.\//, '');

  if (cleaned.length > 60) {
    const parts: string[] = cleaned.replace(/\\/g, '/').split('/');
    if (parts.length > 3) {
      return `${parts[0]}/.../${parts.slice(-2).join('/')}`;
    }
  }

  return cleaned;
}

// ---------------------------------------------------------------
// 2. DESCRIPTION UTILITIES
// ---------------------------------------------------------------

// NOTE: A stricter variant exists in lib/semantic-summarizer.ts with 3 additional
// garbage patterns (/^changed?$/i, /^no description available$/i, /^modified?$/i).
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

// ---------------------------------------------------------------
// 3. EXPORTS
// ---------------------------------------------------------------

export {
  toRelativePath,
  isDescriptionValid,
  cleanDescription,
};

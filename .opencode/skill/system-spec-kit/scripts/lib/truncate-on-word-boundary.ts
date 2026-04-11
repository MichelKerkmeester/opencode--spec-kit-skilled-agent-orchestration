// ───────────────────────────────────────────────────────────────
// MODULE: Truncate On Word Boundary
// ───────────────────────────────────────────────────────────────
// Code-point-safe string truncation that prefers whitespace-aligned
// word boundaries and falls back to a grapheme-aware cut for inputs
// without any whitespace. Used by summary rendering and dashboard
// snippets to keep ellipsized output readable across scripts.

export interface TruncateOptions {
  ellipsis?: string;
  minBoundary?: number;
}

export function truncateOnWordBoundary(text: string, limit: number, opts?: TruncateOptions): string {
  if (typeof text !== 'string' || text.length === 0) {
    return '';
  }

  if (limit <= 0) {
    return '';
  }

  if (text.length <= limit) {
    return text;
  }

  const ellipsis = opts?.ellipsis ?? '…';
  const minBoundary = Math.max(0, opts?.minBoundary ?? 1);
  const rawSlice = text.substring(0, limit);
  const boundaryMatch = /\s+\S*$/.exec(rawSlice);
  const boundarySlice = boundaryMatch ? rawSlice.replace(/\s+\S*$/, '') : '';
  if (!boundaryMatch) {
    // Whitespace-free inputs have no word boundary to honor, so fall back to a
    // code-point-safe cut that still reserves room for the ellipsis.
    const ellipsisLength = [...ellipsis].length;
    if (limit <= ellipsisLength) {
      return [...ellipsis].slice(0, limit).join('');
    }

    const safeSlice = [...text].slice(0, Math.max(limit - ellipsisLength, 0)).join('');
    return `${safeSlice}${ellipsis}`;
  }

  const keptText = boundarySlice.length >= minBoundary ? boundarySlice : rawSlice;

  return `${keptText}${ellipsis}`;
}

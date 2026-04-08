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

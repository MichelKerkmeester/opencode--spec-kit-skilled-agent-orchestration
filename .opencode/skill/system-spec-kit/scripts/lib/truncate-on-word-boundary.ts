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
  const boundarySlice = rawSlice.replace(/\s+\S*$/, '');
  const keptText = boundarySlice.length >= minBoundary ? boundarySlice : rawSlice;

  return `${keptText}${ellipsis}`;
}

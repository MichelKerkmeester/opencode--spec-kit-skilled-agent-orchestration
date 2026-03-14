/**
 * Compare rows deterministically so ties resolve the same way across runs.
 *
 * @param a - First ranked row.
 * @param b - Second ranked row.
 * @returns Negative when `a` should sort before `b`.
 */
export function compareDeterministicRows(
  a: Record<string, unknown> & { id: number },
  b: Record<string, unknown> & { id: number },
): number {
  const aScore = typeof a.score === 'number' && Number.isFinite(a.score)
    ? a.score
    : (typeof a.intentAdjustedScore === 'number' && Number.isFinite(a.intentAdjustedScore)
      ? a.intentAdjustedScore
      : (typeof a.rrfScore === 'number' && Number.isFinite(a.rrfScore)
        ? a.rrfScore
        : (typeof a.similarity === 'number' && Number.isFinite(a.similarity) ? a.similarity / 100 : 0)));
  const bScore = typeof b.score === 'number' && Number.isFinite(b.score)
    ? b.score
    : (typeof b.intentAdjustedScore === 'number' && Number.isFinite(b.intentAdjustedScore)
      ? b.intentAdjustedScore
      : (typeof b.rrfScore === 'number' && Number.isFinite(b.rrfScore)
        ? b.rrfScore
        : (typeof b.similarity === 'number' && Number.isFinite(b.similarity) ? b.similarity / 100 : 0)));

  if (bScore !== aScore) return bScore - aScore;

  const aSimilarity = typeof a.similarity === 'number' && Number.isFinite(a.similarity) ? a.similarity : 0;
  const bSimilarity = typeof b.similarity === 'number' && Number.isFinite(b.similarity) ? b.similarity : 0;
  if (bSimilarity !== aSimilarity) return bSimilarity - aSimilarity;

  return a.id - b.id;
}

/**
 * Sort a result set with the deterministic ranking contract.
 *
 * @param rows - Ranked rows to sort without mutating the input array.
 * @returns Copy of the input rows sorted with deterministic tie-breaking.
 */
export function sortDeterministicRows<T extends Record<string, unknown> & { id: number }>(rows: T[]): T[] {
  return [...rows].sort(compareDeterministicRows);
}

/**
 * Shared score resolution function — canonical fallback chain for deriving the
 * "best available score" from a PipelineRow. Used by Stage 2, Stage 3, and any
 * code needing a consistent effective score.
 *
 * Previously Stage 2 and Stage 3 had
 * separate implementations with different fallback orders and clamping. This shared
 * function uses the correct chain: intentAdjustedScore → rrfScore → score → similarity/100,
 * all clamped to [0,1] with isFinite guards.
 */
export function resolveEffectiveScore(row) {
    if (typeof row.intentAdjustedScore === 'number' && Number.isFinite(row.intentAdjustedScore))
        return Math.max(0, Math.min(1, row.intentAdjustedScore));
    if (typeof row.rrfScore === 'number' && Number.isFinite(row.rrfScore))
        return Math.max(0, Math.min(1, row.rrfScore));
    if (typeof row.score === 'number' && Number.isFinite(row.score))
        return Math.max(0, Math.min(1, row.score));
    if (typeof row.similarity === 'number' && Number.isFinite(row.similarity))
        return Math.max(0, Math.min(1, row.similarity / 100));
    return 0;
}
/**
 * Take a snapshot of score fields for later invariant verification.
 */
export function captureScoreSnapshot(results) {
    return results.map(r => ({
        id: r.id,
        similarity: r.similarity,
        score: r.score,
        importance_weight: r.importance_weight,
        rrfScore: r.rrfScore,
        intentAdjustedScore: r.intentAdjustedScore,
        attentionScore: r.attentionScore,
    }));
}
/**
 * Verify Stage 4 invariant: no score fields were modified.
 * Throws if any score differs between before and after snapshots.
 */
export function verifyScoreInvariant(before, after) {
    if (before.length !== after.length) {
        // Length changes are allowed (filtering removes items), but we verify retained items
    }
    const afterMap = new Map(after.map(r => [r.id, r]));
    for (const snap of before) {
        const row = afterMap.get(snap.id);
        if (!row)
            continue; // Filtered out — OK
        if (row.similarity !== snap.similarity) {
            throw new Error(`[Stage4Invariant] Score mutation detected: id=${snap.id} similarity changed from ${snap.similarity} to ${row.similarity}`);
        }
        if (row.score !== snap.score) {
            throw new Error(`[Stage4Invariant] Score mutation detected: id=${snap.id} score changed from ${snap.score} to ${row.score}`);
        }
        if (row.rrfScore !== snap.rrfScore) {
            throw new Error(`[Stage4Invariant] Score mutation detected: id=${snap.id} rrfScore changed from ${snap.rrfScore} to ${row.rrfScore}`);
        }
        if (row.intentAdjustedScore !== snap.intentAdjustedScore) {
            throw new Error(`[Stage4Invariant] Score mutation detected: id=${snap.id} intentAdjustedScore changed from ${snap.intentAdjustedScore} to ${row.intentAdjustedScore}`);
        }
        if (row.importance_weight !== snap.importance_weight) {
            throw new Error(`[Stage4Invariant] Score mutation detected: id=${snap.id} importance_weight changed from ${snap.importance_weight} to ${row.importance_weight}`);
        }
        if (row.attentionScore !== snap.attentionScore) {
            throw new Error(`[Stage4Invariant] Score mutation detected: id=${snap.id} attentionScore changed from ${snap.attentionScore} to ${row.attentionScore}`);
        }
    }
}
//# sourceMappingURL=types.js.map
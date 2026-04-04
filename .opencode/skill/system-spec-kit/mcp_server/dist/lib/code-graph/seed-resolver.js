// ───────────────────────────────────────────────────────────────
// MODULE: Seed Resolver
// ───────────────────────────────────────────────────────────────
// Resolves CocoIndex search results (file:line) to code graph nodes.
// Resolution chain: exact symbol → near-exact symbol → enclosing symbol → file anchor.
import * as graphDb from './code-graph-db.js';
// ── Type guards ──────────────────────────────────────────────
function hasProvider(seed, provider) {
    if (typeof seed !== 'object' || seed === null) {
        return false;
    }
    return seed.provider === provider;
}
function isCocoIndexSeed(seed) {
    return hasProvider(seed, 'cocoindex');
}
function isManualSeed(seed) {
    return hasProvider(seed, 'manual');
}
function isGraphSeed(seed) {
    return hasProvider(seed, 'graph');
}
function throwResolutionError(operation, seed, err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[seed-resolver] ${operation} failed`, { seed, error: message });
    throw new Error(`[seed-resolver] ${operation} failed: ${message}`);
}
// ── Seed resolvers ───────────────────────────────────────────
/** Resolve a CocoIndex seed by converting to CodeGraphSeed and delegating */
export function resolveCocoIndexSeed(seed) {
    return resolveSeed({
        filePath: seed.file,
        startLine: seed.range.start,
        endLine: seed.range.end,
    });
}
/** Resolve a ManualSeed by looking up the symbol name in the DB */
export function resolveManualSeed(seed) {
    try {
        const d = graphDb.getDb();
        let query = 'SELECT * FROM code_nodes WHERE name = ?';
        const params = [seed.symbolName];
        if (seed.filePath) {
            query += ' AND file_path = ?';
            params.push(seed.filePath);
        }
        if (seed.kind) {
            query += ' AND kind = ?';
            params.push(seed.kind);
        }
        query += ' LIMIT 1';
        const row = d.prepare(query).get(...params);
        if (row) {
            return {
                filePath: row.file_path,
                startLine: row.start_line,
                endLine: row.end_line,
                symbolId: row.symbol_id,
                fqName: row.fq_name,
                kind: row.kind,
                confidence: 0.9,
                resolution: 'exact',
            };
        }
    }
    catch (err) {
        throwResolutionError('resolveManualSeed', seed, err);
    }
    return {
        filePath: seed.filePath ?? '<unknown>',
        startLine: 1,
        endLine: 1,
        symbolId: null,
        fqName: null,
        kind: seed.kind ?? null,
        confidence: 0.1,
        resolution: 'file_anchor',
    };
}
/** Resolve a GraphSeed by looking up the node by symbolId in the DB */
export function resolveGraphSeed(seed) {
    try {
        const d = graphDb.getDb();
        const row = d.prepare('SELECT * FROM code_nodes WHERE symbol_id = ? LIMIT 1').get(seed.symbolId);
        if (row) {
            return {
                filePath: row.file_path,
                startLine: row.start_line,
                endLine: row.end_line,
                symbolId: row.symbol_id,
                fqName: row.fq_name,
                kind: row.kind,
                confidence: 1.0,
                resolution: 'exact',
            };
        }
    }
    catch (err) {
        throwResolutionError('resolveGraphSeed', seed, err);
    }
    return {
        filePath: '<unknown>',
        startLine: 1,
        endLine: 1,
        symbolId: seed.symbolId,
        fqName: null,
        kind: null,
        confidence: 0.1,
        resolution: 'file_anchor',
    };
}
/** Resolve a single seed to an ArtifactRef */
export function resolveSeed(seed) {
    try {
        const d = graphDb.getDb();
        // Try exact symbol match at line
        if (seed.startLine) {
            const exact = d.prepare(`
        SELECT * FROM code_nodes
        WHERE file_path = ? AND start_line = ?
        ORDER BY kind != 'function' -- prefer functions
        LIMIT 1
      `).get(seed.filePath, seed.startLine);
            if (exact) {
                return {
                    filePath: seed.filePath,
                    startLine: exact.start_line,
                    endLine: exact.end_line,
                    symbolId: exact.symbol_id,
                    fqName: exact.fq_name,
                    kind: exact.kind,
                    confidence: 1.0,
                    resolution: 'exact',
                };
            }
            const nearExact = d.prepare(`
        SELECT * FROM code_nodes
        WHERE file_path = ? AND ABS(start_line - ?) <= 5
        ORDER BY ABS(start_line - ?) ASC, kind != 'function', start_line ASC
        LIMIT 1
      `).get(seed.filePath, seed.startLine, seed.startLine);
            if (nearExact) {
                const distance = Math.abs(nearExact.start_line - seed.startLine);
                return {
                    filePath: seed.filePath,
                    startLine: nearExact.start_line,
                    endLine: nearExact.end_line,
                    symbolId: nearExact.symbol_id,
                    fqName: nearExact.fq_name,
                    kind: nearExact.kind,
                    confidence: Math.max(0, 0.95 - (distance * 0.02)),
                    resolution: 'near_exact',
                };
            }
            // Try enclosing symbol (symbol whose range contains the line)
            const enclosing = d.prepare(`
        SELECT * FROM code_nodes
        WHERE file_path = ? AND start_line <= ? AND end_line >= ?
        ORDER BY (end_line - start_line) ASC
        LIMIT 1
      `).get(seed.filePath, seed.startLine, seed.startLine);
            if (enclosing) {
                return {
                    filePath: seed.filePath,
                    startLine: enclosing.start_line,
                    endLine: enclosing.end_line,
                    symbolId: enclosing.symbol_id,
                    fqName: enclosing.fq_name,
                    kind: enclosing.kind,
                    confidence: 0.7,
                    resolution: 'enclosing',
                };
            }
        }
        // Fallback: file anchor
        return {
            filePath: seed.filePath,
            startLine: seed.startLine ?? 1,
            endLine: seed.endLine ?? 1,
            symbolId: null,
            fqName: null,
            kind: null,
            confidence: 0.3,
            resolution: 'file_anchor',
        };
    }
    catch (err) {
        throwResolutionError('resolveSeed', seed, err);
    }
}
/** Resolve any seed variant to an ArtifactRef */
function resolveAnySeed(seed) {
    if (isCocoIndexSeed(seed))
        return resolveCocoIndexSeed(seed);
    if (isManualSeed(seed))
        return resolveManualSeed(seed);
    if (isGraphSeed(seed))
        return resolveGraphSeed(seed);
    return resolveSeed(seed);
}
/** Resolve multiple seeds, deduplicate overlapping refs */
export function resolveSeeds(seeds) {
    const refs = [];
    const seen = new Set();
    for (const seed of seeds) {
        const ref = resolveAnySeed(seed);
        const key = ref.symbolId ?? `${ref.filePath}:${ref.startLine}`;
        if (!seen.has(key)) {
            seen.add(key);
            refs.push(ref);
        }
    }
    // Sort by confidence descending
    refs.sort((a, b) => b.confidence - a.confidence);
    return refs;
}
//# sourceMappingURL=seed-resolver.js.map
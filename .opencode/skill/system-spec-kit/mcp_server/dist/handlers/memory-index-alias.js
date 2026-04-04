// ────────────────────────────────────────────────────────────────
// MODULE: Memory Index Alias Conflict Helpers
// ────────────────────────────────────────────────────────────────
/* ------- 1. DEPENDENCIES ------- */
import { requireDb, toErrorMessage } from '../utils/index.js';
import * as mutationLedger from '../lib/storage/mutation-ledger.js';
// Feature catalog: Workspace scanning and indexing (memory_index_scan)
/* ------- 2. TYPES ------- */
const DOT_OPENCODE_SPECS_SEGMENT = '/.opencode/specs/';
const SPECS_SEGMENT = '/specs/';
const MAX_ALIAS_CONFLICT_SAMPLES = 5;
const DIVERGENCE_RECONCILE_ACTOR = 'memory-index-scan';
export const EMPTY_ALIAS_CONFLICT_SUMMARY = {
    groups: 0,
    rows: 0,
    identicalHashGroups: 0,
    divergentHashGroups: 0,
    unknownHashGroups: 0,
    samples: [],
};
export function createDefaultDivergenceReconcileSummary(maxRetries) {
    const boundedMaxRetries = Number.isFinite(maxRetries) && (maxRetries ?? 0) > 0
        ? Math.max(1, Math.floor(maxRetries))
        : mutationLedger.DEFAULT_DIVERGENCE_RECONCILE_MAX_RETRIES;
    return {
        enabled: true,
        candidates: 0,
        retriesScheduled: 0,
        escalated: 0,
        maxRetries: boundedMaxRetries,
        escalations: [],
        errors: [],
    };
}
function toNormalizedPath(filePath) {
    return filePath.replace(/\\/g, '/');
}
function toSpecAliasKey(filePath) {
    const normalizedPath = toNormalizedPath(filePath);
    return normalizedPath
        .replace(/\/\.opencode\/specs\//g, '/specs/')
        .replace(/^\.opencode\/specs\//, 'specs/');
}
function isDotOpencodeVariantPath(normalizedPath) {
    return normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT) || normalizedPath.startsWith('.opencode/specs/');
}
function isSpecsVariantPath(normalizedPath) {
    if (isDotOpencodeVariantPath(normalizedPath)) {
        return false;
    }
    return normalizedPath.includes(SPECS_SEGMENT) || normalizedPath.startsWith('specs/');
}
/* ------- 3. ALIAS CONFLICT ANALYSIS ------- */
/** Build alias conflict buckets from index rows. */
function buildAliasBuckets(rows) {
    const buckets = new Map();
    for (const row of rows) {
        if (!row || typeof row.file_path !== 'string' || row.file_path.length === 0) {
            continue;
        }
        const normalizedPath = toNormalizedPath(row.file_path);
        const aliasKey = toSpecAliasKey(normalizedPath);
        let bucket = buckets.get(aliasKey);
        if (!bucket) {
            bucket = {
                hasDotOpencodeVariant: false,
                hasSpecsVariant: false,
                variants: new Set(),
                hashes: new Set(),
            };
            buckets.set(aliasKey, bucket);
        }
        if (isDotOpencodeVariantPath(normalizedPath)) {
            bucket.hasDotOpencodeVariant = true;
        }
        if (isSpecsVariantPath(normalizedPath)) {
            bucket.hasSpecsVariant = true;
        }
        bucket.variants.add(normalizedPath);
        if (typeof row.content_hash === 'string' && row.content_hash.trim().length > 0) {
            bucket.hashes.add(row.content_hash.trim());
        }
    }
    return buckets;
}
export function summarizeAliasConflicts(rows) {
    if (!rows.length) {
        return { ...EMPTY_ALIAS_CONFLICT_SUMMARY };
    }
    const sortedRows = [...rows].sort((a, b) => a.file_path.localeCompare(b.file_path));
    const buckets = buildAliasBuckets(sortedRows);
    const summary = { ...EMPTY_ALIAS_CONFLICT_SUMMARY, samples: [] };
    for (const [normalizedPath, bucket] of buckets.entries()) {
        if (!bucket.hasDotOpencodeVariant || !bucket.hasSpecsVariant) {
            continue;
        }
        if (bucket.variants.size < 2) {
            continue;
        }
        summary.groups++;
        summary.rows += bucket.variants.size;
        let hashState;
        if (bucket.hashes.size === 0) {
            summary.unknownHashGroups++;
            hashState = 'unknown';
        }
        else if (bucket.hashes.size === 1) {
            summary.identicalHashGroups++;
            hashState = 'identical';
        }
        else {
            summary.divergentHashGroups++;
            hashState = 'divergent';
        }
        if (summary.samples.length < MAX_ALIAS_CONFLICT_SAMPLES) {
            summary.samples.push({
                normalizedPath,
                hashState,
                variants: Array.from(bucket.variants).sort(),
            });
        }
    }
    return summary;
}
export function detectAliasConflictsFromIndex() {
    try {
        const database = requireDb();
        const rows = database.prepare(`
      SELECT file_path, content_hash
      FROM memory_index
      WHERE parent_id IS NULL
        AND (
          file_path LIKE '%/.opencode/specs/%'
          OR file_path LIKE '%/specs/%'
          OR file_path LIKE '.opencode/specs/%'
          OR file_path LIKE 'specs/%'
        )
      ORDER BY file_path ASC
    `).all();
        return summarizeAliasConflicts(rows);
    }
    catch (err) {
        const message = toErrorMessage(err);
        console.warn(`[memory-index-scan] Alias conflict detection skipped: ${message}`);
        return { ...EMPTY_ALIAS_CONFLICT_SUMMARY };
    }
}
function listDivergentAliasConflictCandidates(options = {}) {
    const getDatabase = options.requireDatabase ?? requireDb;
    const database = getDatabase();
    const rows = database.prepare(`
    SELECT file_path, content_hash
    FROM memory_index
    WHERE parent_id IS NULL
      AND (
        file_path LIKE '%/.opencode/specs/%'
        OR file_path LIKE '%/specs/%'
        OR file_path LIKE '.opencode/specs/%'
        OR file_path LIKE 'specs/%'
      )
    ORDER BY file_path ASC
  `).all();
    const buckets = buildAliasBuckets(rows);
    const candidates = [];
    for (const [normalizedPath, bucket] of buckets.entries()) {
        if (!bucket.hasDotOpencodeVariant || !bucket.hasSpecsVariant) {
            continue;
        }
        if (bucket.variants.size < 2) {
            continue;
        }
        if (bucket.hashes.size <= 1) {
            continue;
        }
        candidates.push({
            normalizedPath,
            variants: Array.from(bucket.variants).sort(),
        });
    }
    return candidates.sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));
}
/* ------- 4. EXPORTS ------- */
export function runDivergenceReconcileHooks(aliasConflicts, options = {}) {
    const summary = createDefaultDivergenceReconcileSummary(options.maxRetries);
    let reconcileCandidates = aliasConflicts.samples
        .filter(sample => sample.hashState === 'divergent')
        .map(sample => ({
        normalizedPath: sample.normalizedPath,
        variants: sample.variants,
    }))
        .sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));
    // Samples are intentionally capped; when summary says more divergent groups exist,
    // Expand to the full candidate set from the index table.
    if (aliasConflicts.divergentHashGroups > reconcileCandidates.length) {
        try {
            const expandedCandidates = listDivergentAliasConflictCandidates({
                requireDatabase: options.requireDatabase,
            });
            if (expandedCandidates.length > 0) {
                reconcileCandidates = expandedCandidates;
            }
        }
        catch (err) {
            summary.errors.push(`candidate-expansion: ${toErrorMessage(err)}`);
        }
    }
    summary.candidates = reconcileCandidates.length;
    if (reconcileCandidates.length === 0) {
        return summary;
    }
    const getDatabase = options.requireDatabase ?? requireDb;
    const reconcileHook = options.reconcileHook ?? mutationLedger.recordDivergenceReconcileHook;
    let database;
    try {
        database = getDatabase();
    }
    catch (err) {
        summary.errors.push(toErrorMessage(err));
        return summary;
    }
    for (const sample of reconcileCandidates) {
        try {
            const hookResult = reconcileHook(database, {
                normalizedPath: sample.normalizedPath,
                variants: sample.variants,
                actor: options.actor ?? DIVERGENCE_RECONCILE_ACTOR,
                maxRetries: summary.maxRetries,
            });
            if (hookResult.policy.shouldRetry) {
                summary.retriesScheduled++;
            }
            if (hookResult.escalation) {
                summary.escalated++;
                summary.escalations.push(hookResult.escalation);
            }
        }
        catch (err) {
            const message = toErrorMessage(err);
            summary.errors.push(`[${sample.normalizedPath}] ${message}`);
        }
    }
    summary.escalations.sort((a, b) => a.normalizedPath.localeCompare(b.normalizedPath));
    return summary;
}
//# sourceMappingURL=memory-index-alias.js.map
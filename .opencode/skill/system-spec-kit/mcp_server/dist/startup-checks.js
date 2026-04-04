// ───────────────────────────────────────────────────────────────
// MODULE: Startup Checks
// ───────────────────────────────────────────────────────────────
// Non-critical startup checks extracted from context-server.ts (T303).
import path from 'path';
import fs from 'fs';
function getCurrentRuntimeSnapshot() {
    return {
        nodeVersion: process.version,
        moduleVersion: process.versions.modules,
        platform: process.platform,
        arch: process.arch,
    };
}
export function detectRuntimeMismatch(marker, runtime = getCurrentRuntimeSnapshot()) {
    const reasons = [];
    if (marker.moduleVersion !== runtime.moduleVersion) {
        reasons.push('module ABI');
    }
    if (marker.platform !== runtime.platform) {
        reasons.push('platform');
    }
    if (marker.arch !== runtime.arch) {
        reasons.push('architecture');
    }
    return {
        detected: reasons.length > 0,
        reasons,
    };
}
function parseSqliteVersion(version) {
    const [majorRaw, minorRaw] = version.split('.');
    if (!majorRaw || !minorRaw) {
        return null;
    }
    const major = Number(majorRaw);
    const minor = Number(minorRaw);
    if (!Number.isFinite(major) || !Number.isFinite(minor)) {
        return null;
    }
    return { major, minor };
}
/** Logs a warning when the active Node.js version differs from the project marker. */
export function detectNodeVersionMismatch() {
    try {
        const markerPath = path.resolve(import.meta.dirname, '../.node-version-marker');
        if (fs.existsSync(markerPath)) {
            const raw = fs.readFileSync(markerPath, 'utf8');
            const marker = JSON.parse(raw);
            const runtime = getCurrentRuntimeSnapshot();
            const mismatch = detectRuntimeMismatch(marker, runtime);
            if (mismatch.detected) {
                const reasonText = mismatch.reasons.join(', ');
                console.warn('[context-server] \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557');
                console.warn('[context-server] \u2551  WARNING: Native runtime changed since last install  \u2551');
                console.warn('[context-server] \u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563');
                console.warn(`[context-server] \u2551  Installed: Node ${marker.nodeVersion} (MODULE_VERSION ${marker.moduleVersion}, ${marker.platform}/${marker.arch})`.padEnd(88) + '\u2551');
                console.warn(`[context-server] \u2551  Running:   Node ${runtime.nodeVersion} (MODULE_VERSION ${runtime.moduleVersion}, ${runtime.platform}/${runtime.arch})`.padEnd(88) + '\u2551');
                console.warn(`[context-server] \u2551  Mismatch:  ${reasonText}`.padEnd(88) + '\u2551');
                console.warn('[context-server] \u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563');
                console.warn('[context-server] \u2551  Native modules may crash. Run:                         \u2551');
                console.warn('[context-server] \u2551  bash scripts/setup/rebuild-native-modules.sh           \u2551');
                console.warn('[context-server] \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d');
            }
            else {
                console.warn(`[context-server] Node runtime check: OK (${runtime.nodeVersion}, MODULE_VERSION ${runtime.moduleVersion}, ${runtime.platform}/${runtime.arch})`);
            }
        }
        else {
            // Auto-create marker for future version checks
            const marker = {
                nodeVersion: process.version,
                moduleVersion: process.versions.modules,
                platform: process.platform,
                arch: process.arch,
                createdAt: new Date().toISOString(),
            };
            fs.writeFileSync(markerPath, JSON.stringify(marker, null, 2), 'utf8');
            console.warn('[context-server] Created .node-version-marker for future runtime checks');
        }
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`[context-server] Node version check skipped: ${message}`);
    }
}
/* ───────────────────────────────────────────────────────────────
   2. SQLITE VERSION CHECK
──────────────────────────────────────────────────────────────── */
/**
 * Check that SQLite version meets minimum requirement (3.35.0+)
 * Required for: RETURNING clause, CTEs, window functions used in scoring pipeline
 */
export function checkSqliteVersion(db) {
    try {
        const result = db.prepare('SELECT sqlite_version() as version').get();
        const version = result.version;
        const parsedVersion = parseSqliteVersion(version);
        if (!parsedVersion) {
            console.warn(`[spec-kit] Could not determine SQLite version: unexpected version format "${version}"`);
            return;
        }
        if (parsedVersion.major < 3 || (parsedVersion.major === 3 && parsedVersion.minor < 35)) {
            console.warn(`[spec-kit] WARNING: SQLite version ${version} detected. ` +
                `Minimum required: 3.35.0. Some features may not work correctly.`);
        }
        else {
            console.warn(`[spec-kit] SQLite version: ${version} (meets 3.35.0+ requirement)`);
        }
    }
    catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        console.warn(`[spec-kit] Could not determine SQLite version: ${message}`);
    }
}
//# sourceMappingURL=startup-checks.js.map
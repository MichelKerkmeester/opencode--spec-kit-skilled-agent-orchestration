// ---------------------------------------------------------------
// MODULE: Startup Checks
// ---------------------------------------------------------------
// Non-critical startup checks extracted from context-server.ts (T303).
// ---------------------------------------------------------------

import path from 'path';
import fs from 'fs';

/* ---------------------------------------------------------------
   1. NODE VERSION MISMATCH DETECTION
--------------------------------------------------------------- */

interface NodeVersionMarker {
  nodeVersion: string;
  moduleVersion: string;
  platform: string;
  arch: string;
  createdAt: string;
}

export function detectNodeVersionMismatch(): void {
  try {
    const markerPath = path.resolve(__dirname, '../.node-version-marker');

    if (fs.existsSync(markerPath)) {
      const raw = fs.readFileSync(markerPath, 'utf8');
      const marker: NodeVersionMarker = JSON.parse(raw);

      if (marker.moduleVersion !== process.versions.modules) {
        console.error('[context-server] \u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557');
        console.error('[context-server] \u2551  WARNING: Node.js version changed since last install    \u2551');
        console.error('[context-server] \u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563');
        console.error(`[context-server] \u2551  Installed: Node ${marker.nodeVersion} (MODULE_VERSION ${marker.moduleVersion})`.padEnd(59) + '\u2551');
        console.error(`[context-server] \u2551  Running:   Node ${process.version} (MODULE_VERSION ${process.versions.modules})`.padEnd(59) + '\u2551');
        console.error('[context-server] \u2560\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2563');
        console.error('[context-server] \u2551  Native modules may crash. Run:                         \u2551');
        console.error('[context-server] \u2551  bash scripts/setup/rebuild-native-modules.sh           \u2551');
        console.error('[context-server] \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d');
      } else {
        console.error(`[context-server] Node version check: OK (${process.version}, MODULE_VERSION ${process.versions.modules})`);
      }
    } else {
      // Auto-create marker for future version checks
      const marker: NodeVersionMarker = {
        nodeVersion: process.version,
        moduleVersion: process.versions.modules,
        platform: process.platform,
        arch: process.arch,
        createdAt: new Date().toISOString(),
      };
      fs.writeFileSync(markerPath, JSON.stringify(marker, null, 2), 'utf8');
      console.error('[context-server] Created .node-version-marker for future version checks');
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[context-server] Node version check skipped: ${message}`);
  }
}

/* ---------------------------------------------------------------
   2. SQLITE VERSION CHECK
--------------------------------------------------------------- */

/**
 * Check that SQLite version meets minimum requirement (3.35.0+)
 * Required for: RETURNING clause, CTEs, window functions used in scoring pipeline
 */
export function checkSqliteVersion(db: { prepare: (sql: string) => { get: () => unknown } }): void {
  try {
    const result = db.prepare('SELECT sqlite_version() as version').get() as { version: string };
    const version = result.version;
    const [major, minor] = version.split('.').map(Number);
    if (major < 3 || (major === 3 && minor < 35)) {
      console.warn(
        `[spec-kit] WARNING: SQLite version ${version} detected. ` +
        `Minimum required: 3.35.0. Some features may not work correctly.`
      );
    } else {
      console.error(`[spec-kit] SQLite version: ${version} (meets 3.35.0+ requirement)`);
    }
  } catch (e: unknown) {
    console.warn(`[spec-kit] Could not determine SQLite version: ${(e as Error).message}`);
  }
}

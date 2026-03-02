// ---------------------------------------------------------------
// MODULE: Shared Configuration
// Shared path constants used across mcp_server/ and scripts/.
// ---------------------------------------------------------------
// NOTE: Paths here use __dirname relative to the compiled output
// location (shared/dist/), not the source location (shared/).
// ---------------------------------------------------------------

import path from 'path';

/* ---------------------------------------------------------------
   1. DATABASE PATHS
--------------------------------------------------------------- */

/**
 * Absolute path to the production SQLite database.
 * Resolves correctly from shared/dist/ (compiled output) to
 * system-spec-kit/mcp_server/database/context-index.sqlite.
 * Respects the SPEC_KIT_DB_DIR environment variable override.
 */
const defaultPath = path.join(__dirname, '../../mcp_server/database/context-index.sqlite');
// AI-WHY: Use || (not ??) so empty strings fall through to default (empty env vars are common misconfiguration)
const dbDir = process.env.SPEC_KIT_DB_DIR || process.env.SPECKIT_DB_DIR || defaultPath;

export const DB_PATH: string = dbDir === defaultPath
  ? defaultPath
  : path.resolve(process.cwd(), dbDir, 'context-index.sqlite');

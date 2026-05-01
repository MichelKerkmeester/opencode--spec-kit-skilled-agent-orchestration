// ───────────────────────────────────────────────────────────────
// MODULE: SQLite Integrity Neutral Utility
// ───────────────────────────────────────────────────────────────
// F-016-D1-01: Neutral seam for `checkSqliteIntegrity` so cross-domain
// callers (e.g. `lib/skill-graph/skill-graph-db.ts`, future graph DB modules)
// do not need to import advisor freshness internals to check a SQLite file.
// The advisor freshness implementation stays the source of truth; this
// module simply re-exports it from a path that is architecturally neutral
// with respect to the skill_advisor subsystem.
//
// Inward dependency direction: storage callers depend on this utility;
// advisor internals depend on its underlying implementation.

export { checkSqliteIntegrity } from '../../skill_advisor/lib/freshness/sqlite-integrity.js';

// ───────────────────────────────────────────────────────────────
// MODULE: SQLite Busy Retry Utility
// ───────────────────────────────────────────────────────────────
// F-016-D1-05: Neutral seam for `runWithBusyRetry` so freshness rebuild and
// other advisor-lib callers do not have to depend on the daemon watcher
// module just to retry SQLITE_BUSY errors. The watcher keeps its own copy
// (and its own internal usage) so existing tests and consumers are not
// disturbed; this module re-exports the helper from a neutral utils path.

export { runWithBusyRetry } from '../daemon/watcher.js';

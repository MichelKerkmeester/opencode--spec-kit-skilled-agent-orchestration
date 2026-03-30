// ────────────────────────────────────────────────────────────────
// MODULE: Storage
// ────────────────────────────────────────────────────────────────
// @public — scripts should import from here, not lib/ internals.
// ARCH-1 exposes minimal storage initialization hooks needed by
// Operational scripts without importing mcp_server/lib/storage directly.

export { init as initCheckpoints } from '../lib/storage/checkpoints.js';
export { init as initAccessTracker } from '../lib/storage/access-tracker.js';

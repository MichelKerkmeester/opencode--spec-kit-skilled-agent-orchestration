// ---------------------------------------------------------------
// MODULE: Stable Storage API
// ---------------------------------------------------------------
// @public — scripts should import from here, not lib/ internals.
// AI-WHY: ARCH-1 exposes minimal storage initialization hooks needed by
// operational scripts without importing mcp_server/lib/storage directly.

export { init as initCheckpoints } from '../lib/storage/checkpoints';
export { init as initAccessTracker } from '../lib/storage/access-tracker';

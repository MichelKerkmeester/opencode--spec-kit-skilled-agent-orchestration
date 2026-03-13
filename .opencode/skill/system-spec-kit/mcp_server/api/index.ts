// --- 1. INDEX ---
// @public — single entry point for all public API surfaces.
// ARCH-1 consumer scripts import from '../../mcp_server/api'
// Instead of reaching into lib/ internals.

export * from './eval';
export * from './indexing';
export * from './search';
export * from './providers';
export * from './storage';

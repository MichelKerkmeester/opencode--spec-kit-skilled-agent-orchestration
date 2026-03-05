// ---------------------------------------------------------------
// MODULE: Public API Barrel
// ---------------------------------------------------------------
// @public — single entry point for all public API surfaces.
// AI-WHY: ARCH-1 consumer scripts import from '../../mcp_server/api'
// instead of reaching into lib/ internals.

export * from './eval';
export * from './search';
export * from './providers';
export * from './storage';

// ---------------------------------------------------------------
// TEST: Import Policy Rules
// ---------------------------------------------------------------

import { describe, expect, it } from 'vitest';

import { isProhibitedImportPath } from '../evals/import-policy-rules';

describe('isProhibitedImportPath', () => {
  it('blocks package imports for internal runtime roots and descendants', () => {
    expect(isProhibitedImportPath('@spec-kit/mcp-server/lib/search/vector-index')).toBe(true);
    expect(isProhibitedImportPath('@spec-kit/mcp-server/core')).toBe(true);
    expect(isProhibitedImportPath('@spec-kit/mcp-server/core/db-state')).toBe(true);
    expect(isProhibitedImportPath('@spec-kit/mcp-server/handlers')).toBe(true);
    expect(isProhibitedImportPath('@spec-kit/mcp-server/handlers/memory-index')).toBe(true);
  });

  it('blocks relative imports for internal runtime roots and descendants', () => {
    expect(isProhibitedImportPath('../../mcp_server/lib/search/vector-index')).toBe(true);
    expect(isProhibitedImportPath('../../mcp_server/core')).toBe(true);
    expect(isProhibitedImportPath('../../../mcp_server/core/db-state')).toBe(true);
    expect(isProhibitedImportPath('../../mcp_server/handlers')).toBe(true);
    expect(isProhibitedImportPath('../../../mcp_server/handlers/memory-index')).toBe(true);
  });

  it('blocks normalized relative bypass attempts into internal runtime roots', () => {
    expect(isProhibitedImportPath('../../mcp_server/api/../core/config')).toBe(true);
    expect(isProhibitedImportPath('./../mcp_server/core/config')).toBe(true);
  });

  it('allows public API and shared imports', () => {
    expect(isProhibitedImportPath('@spec-kit/mcp-server/api')).toBe(false);
    expect(isProhibitedImportPath('@spec-kit/mcp-server/api/indexing')).toBe(false);
    expect(isProhibitedImportPath('../../mcp_server/api/indexing')).toBe(false);
    expect(isProhibitedImportPath('../../mcp_server/core/../api/indexing')).toBe(false);
    expect(isProhibitedImportPath('../shared/utils')).toBe(false);
  });
});

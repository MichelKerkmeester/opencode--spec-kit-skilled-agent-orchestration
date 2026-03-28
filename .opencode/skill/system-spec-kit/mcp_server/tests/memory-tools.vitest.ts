// ───────────────────────────────────────────────────────────────
// MODULE: Memory Tools Tests
// ───────────────────────────────────────────────────────────────
import { beforeEach, describe, expect, it, vi } from 'vitest';

// ───────────────────────────────────────────────────────────────
// 1. TEST DOUBLES
// ───────────────────────────────────────────────────────────────

const { mockHandleMemorySearch } = vi.hoisted(() => ({
  mockHandleMemorySearch: vi.fn(async () => ({
    content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: { tool: 'memory_search' } }) }],
    isError: false,
  })),
}));

vi.mock('../handlers', () => ({
  handleMemorySearch: mockHandleMemorySearch,
  handleMemoryMatchTriggers: vi.fn(),
  handleMemorySave: vi.fn(),
  handleMemoryList: vi.fn(),
  handleMemoryStats: vi.fn(),
  handleMemoryHealth: vi.fn(),
  handleMemoryDelete: vi.fn(),
  handleMemoryUpdate: vi.fn(),
  handleMemoryValidate: vi.fn(),
  handleMemoryBulkDelete: vi.fn(),
}));

import { handleTool } from '../tools/memory-tools';

// ───────────────────────────────────────────────────────────────
// 2. TESTS
// ───────────────────────────────────────────────────────────────

describe('memory-tools dispatch', () => {
  beforeEach(() => {
    mockHandleMemorySearch.mockClear();
  });

  it('forwards governed scope fields through memory_quick_search', async () => {
    const response = await handleTool('memory_quick_search', {
      query: 'auth design',
      tenantId: 'tenant-a',
      userId: 'user-1',
      agentId: 'agent-1',
      sharedSpaceId: 'shared-1',
      limit: 7,
    });

    expect(mockHandleMemorySearch).toHaveBeenCalledWith(expect.objectContaining({
      query: 'auth design',
      tenantId: 'tenant-a',
      userId: 'user-1',
      agentId: 'agent-1',
      sharedSpaceId: 'shared-1',
      limit: 7,
      autoDetectIntent: true,
      enableDedup: true,
      includeContent: true,
      includeConstitutional: true,
      rerank: true,
    }));

    const parsed = JSON.parse(response!.content[0].text) as { meta?: { tool?: string } };
    expect(parsed.meta?.tool).toBe('memory_quick_search');
  });
});

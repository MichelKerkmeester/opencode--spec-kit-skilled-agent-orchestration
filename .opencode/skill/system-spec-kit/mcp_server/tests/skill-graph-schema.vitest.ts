// TEST: SKILL GRAPH SCHEMA AND DISPATCHER
// T244: Add dedicated schema/dispatcher coverage for `skill_graph_*`
//
// Finding #30: The validation gap was easy to ship because there is no
// dedicated schema/dispatcher coverage for `skill_graph_*`. The only
// assertions are tool-registration checks in context-server.vitest.ts.
//
// This suite tests the skill-graph-tools.ts dispatcher for:
// - Tool name routing (all 4 skill_graph_* tools)
// - Input validation (missing required fields)
// - Unknown tool names returning null
// - parseArgs pass-through behavior

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the handler module to isolate dispatcher logic
const mockScan = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"status":"ok"}' }] });
const mockQuery = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"status":"ok"}' }] });
const mockStatus = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"status":"ok"}' }] });
const mockValidate = vi.fn().mockResolvedValue({ content: [{ type: 'text', text: '{"status":"ok"}' }] });

vi.mock('../handlers/skill-graph/index.js', () => ({
  handleSkillGraphScan: mockScan,
  handleSkillGraphQuery: mockQuery,
  handleSkillGraphStatus: mockStatus,
  handleSkillGraphValidate: mockValidate,
}));

const { handleTool, TOOL_NAMES } = await import('../tools/skill-graph-tools');

function parsePayload(result: { content: Array<{ type: string; text: string }> } | null) {
  if (!result) return null;
  return JSON.parse(result.content[0].text);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('skill_graph_* dispatcher — schema and routing (T244)', () => {
  // ─── TOOL NAME REGISTRATION ─────────────────────────────────

  it('TOOL_NAMES contains all four skill_graph_* tool names', () => {
    expect(TOOL_NAMES.has('skill_graph_scan')).toBe(true);
    expect(TOOL_NAMES.has('skill_graph_query')).toBe(true);
    expect(TOOL_NAMES.has('skill_graph_status')).toBe(true);
    expect(TOOL_NAMES.has('skill_graph_validate')).toBe(true);
    expect(TOOL_NAMES.size).toBe(4);
  });

  // ─── ROUTING ────────────────────────────────────────────────

  it('routes skill_graph_scan to handleSkillGraphScan', async () => {
    const result = await handleTool('skill_graph_scan', {});
    expect(mockScan).toHaveBeenCalledTimes(1);
    expect(result).not.toBeNull();
  });

  it('routes skill_graph_query to handleSkillGraphQuery with args', async () => {
    const result = await handleTool('skill_graph_query', {
      queryType: 'depends_on',
      skillId: 'sk-git',
    });
    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(result).not.toBeNull();
  });

  it('routes skill_graph_status to handleSkillGraphStatus', async () => {
    const result = await handleTool('skill_graph_status', {});
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(result).not.toBeNull();
  });

  it('routes skill_graph_validate to handleSkillGraphValidate', async () => {
    const result = await handleTool('skill_graph_validate', {});
    expect(mockValidate).toHaveBeenCalledTimes(1);
    expect(result).not.toBeNull();
  });

  it('returns null for unknown tool names', async () => {
    const result = await handleTool('unknown_tool', {});
    expect(result).toBeNull();
    expect(mockScan).not.toHaveBeenCalled();
    expect(mockQuery).not.toHaveBeenCalled();
    expect(mockStatus).not.toHaveBeenCalled();
    expect(mockValidate).not.toHaveBeenCalled();
  });

  // ─── INPUT VALIDATION ───────────────────────────────────────

  it('skill_graph_query returns validation error when queryType is missing', async () => {
    const result = await handleTool('skill_graph_query', {});
    const payload = parsePayload(result);
    expect(payload.status).toBe('error');
    expect(payload.error).toContain('queryType');
    // Handler should NOT be called for invalid input
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('skill_graph_query returns validation error when queryType is empty string', async () => {
    const result = await handleTool('skill_graph_query', { queryType: '' });
    const payload = parsePayload(result);
    expect(payload.status).toBe('error');
    expect(payload.error).toContain('queryType');
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it('skill_graph_query returns validation error when queryType is whitespace-only', async () => {
    const result = await handleTool('skill_graph_query', { queryType: '   ' });
    const payload = parsePayload(result);
    expect(payload.status).toBe('error');
    expect(payload.error).toContain('queryType');
    expect(mockQuery).not.toHaveBeenCalled();
  });

  // ─── RESPONSE SHAPE ─────────────────────────────────────────

  it('all routed responses have content array with type text', async () => {
    const scanResult = await handleTool('skill_graph_scan', {});
    const statusResult = await handleTool('skill_graph_status', {});
    const validateResult = await handleTool('skill_graph_validate', {});

    for (const result of [scanResult, statusResult, validateResult]) {
      expect(result).not.toBeNull();
      expect(Array.isArray(result!.content)).toBe(true);
      expect(result!.content[0].type).toBe('text');
      expect(typeof result!.content[0].text).toBe('string');
    }
  });

  // ─── SCAN PASS-THROUGH ─────────────────────────────────────

  it('skill_graph_scan passes skillsRoot to handler', async () => {
    await handleTool('skill_graph_scan', { skillsRoot: '/custom/path' });
    expect(mockScan).toHaveBeenCalledWith(
      expect.objectContaining({ skillsRoot: '/custom/path' }),
    );
  });

  // ─── QUERY PASS-THROUGH ────────────────────────────────────

  it('skill_graph_query passes all optional params to handler', async () => {
    await handleTool('skill_graph_query', {
      queryType: 'hub_skills',
      minInbound: 5,
      limit: 20,
    });
    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryType: 'hub_skills',
        minInbound: 5,
        limit: 20,
      }),
    );
  });
});

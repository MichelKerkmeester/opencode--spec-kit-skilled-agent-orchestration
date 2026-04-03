import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../handlers/session-resume.js', () => ({
  handleSessionResume: vi.fn(async () => ({
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: { memory: { resumed: true }, hints: ['resume ok'] } }),
    }],
  })),
}));

vi.mock('../handlers/session-health.js', () => ({
  handleSessionHealth: vi.fn(async () => ({
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: { state: 'ok', hints: ['health ok'] } }),
    }],
  })),
}));

vi.mock('../lib/session/context-metrics.js', () => ({
  recordBootstrapEvent: vi.fn(),
}));

vi.mock('../lib/session/session-snapshot.js', () => ({
  buildStructuralBootstrapContract: vi.fn(() => ({
    status: 'ready',
    summary: 'Code graph: 42 files, 1200 nodes, 800 edges (fresh)',
    recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
    sourceSurface: 'session_bootstrap',
  })),
}));

import { handleSessionBootstrap } from '../handlers/session-bootstrap.js';
import { handleSessionResume } from '../handlers/session-resume.js';
import { handleSessionHealth } from '../handlers/session-health.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import { recordBootstrapEvent } from '../lib/session/context-metrics.js';

describe('session-bootstrap handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
    const result = await handleSessionBootstrap({ specFolder: 'specs/024-root' });
    const parsed = JSON.parse(result.content[0].text);

    expect(handleSessionResume).toHaveBeenCalledWith({ specFolder: 'specs/024-root' });
    expect(handleSessionHealth).toHaveBeenCalledTimes(1);
    expect(parsed.data.resume.memory).toEqual({ resumed: true });
    expect(parsed.data.health.state).toBe('ok');
    expect(parsed.data.hints).toEqual(expect.arrayContaining(['resume ok', 'health ok']));
    expect(parsed.data.nextActions).toEqual(expect.arrayContaining([
      'Structural context available. Use code_graph_query for structural lookups.',
      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
    ]));
    expect(recordBootstrapEvent).toHaveBeenCalledWith('tool', expect.any(Number), 'full');
  });

  it('adds a structural hint when the bootstrap contract is stale', async () => {
    vi.mocked(buildStructuralBootstrapContract).mockReturnValueOnce({
      status: 'stale',
      summary: 'Code graph is stale',
      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
      sourceSurface: 'session_bootstrap',
    } as never);

    const result = await handleSessionBootstrap({});
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.data.structuralContext.status).toBe('stale');
    expect(parsed.data.hints.some((hint: string) => hint.includes('Run code_graph_scan'))).toBe(true);
    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
  });
});

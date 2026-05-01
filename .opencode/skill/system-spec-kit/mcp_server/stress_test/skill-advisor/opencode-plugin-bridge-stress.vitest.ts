// ───────────────────────────────────────────────────────────────
// MODULE: sa-034 — OpenCode Plugin Bridge Stress Test
// ───────────────────────────────────────────────────────────────

import { EventEmitter } from 'node:events';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// F-015-C5-04: snapshot/restore env mutations so test failures do not leak
// SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED across tests.
import { snapshotEnv } from '../../lib/test-helpers/env-snapshot.js';

const mockedBridge = vi.hoisted(() => ({
  spawn: vi.fn(),
}));

vi.mock('node:child_process', () => ({
  spawn: mockedBridge.spawn,
}));

import SpecKitSkillAdvisorPlugin from '../../../../../plugins/spec-kit-skill-advisor.js';

function bridgeResponse(brief: string | null = 'Advisor: live; use system-spec-kit 0.91/0.18 pass.') {
  return JSON.stringify({
    status: brief ? 'ok' : 'skipped',
    brief,
    metadata: {
      freshness: brief ? 'live' : 'unavailable',
      durationMs: 4,
      cacheHit: false,
      recommendationCount: brief ? 1 : 0,
      skillLabel: brief ? 'system-spec-kit' : null,
    },
  });
}

function makeChild(stdout: string, closeCode = 0) {
  const child = new EventEmitter() as EventEmitter & {
    stdout: EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
    stdin: { end: ReturnType<typeof vi.fn> };
    kill: ReturnType<typeof vi.fn>;
  };
  child.stdout = new EventEmitter() as EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
  child.stdout.setEncoding = vi.fn();
  child.stdin = { end: vi.fn() };
  child.kill = vi.fn(() => true);
  queueMicrotask(() => {
    child.stdout.emit('data', stdout);
    child.emit('close', closeCode);
  });
  return child;
}

async function makePlugin(options: Record<string, unknown> = {}) {
  return SpecKitSkillAdvisorPlugin({ directory: process.cwd() }, options);
}

async function runTransform(hooks: Awaited<ReturnType<typeof makePlugin>>, prompt: string, sessionID = 'sa-034') {
  const output = { system: [] as string[] };
  await hooks['experimental.chat.system.transform']?.({
    sessionID,
    prompt,
    model: { providerID: 'test', modelID: 'test' },
  } as never, output as never);
  return output;
}

function bridgePayload(index: number): Record<string, unknown> {
  const raw = mockedBridge.spawn.mock.results[index]?.value.stdin.end.mock.calls[0]?.[0] ?? '{}';
  return JSON.parse(String(raw)) as Record<string, unknown>;
}

describe('sa-034 — OpenCode plugin bridge', () => {
  // F-015-C5-04: env keys mutated by these tests; snapshot before each, restore after.
  let restoreEnv: (() => void) | null = null;

  beforeEach(() => {
    // F-015-C5-04: snapshot env keys before any test mutation so afterEach restores
    // the original values (or unsets keys that were undefined) even on test failure.
    restoreEnv = snapshotEnv([
      'SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED',
      'SPECKIT_SKILL_ADVISOR_HOOK_DISABLED',
    ]);
    vi.useRealTimers();
    vi.clearAllMocks();
    delete process.env.SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED;
    delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
    mockedBridge.spawn.mockImplementation(() => makeChild(bridgeResponse()));
  });

  afterEach(() => {
    // F-015-C5-04: restore env keys snapshotted in beforeEach (runs even on failure)
    if (restoreEnv) {
      restoreEnv();
      restoreEnv = null;
    }
  });

  it('exposes the canonical plugin surface and status tool only', async () => {
    const hooks = await makePlugin();

    expect(hooks.event).toBeTypeOf('function');
    expect(hooks['experimental.chat.system.transform']).toBeTypeOf('function');
    expect(hooks.tool?.spec_kit_skill_advisor_status).toBeDefined();
    expect(hooks).not.toHaveProperty('onUserPromptSubmitted');
    expect(hooks).not.toHaveProperty('onSessionStart');
  });

  it('deduplicates concurrent prompt transforms through one bridge process', async () => {
    let closeChild: (() => void) | null = null;
    mockedBridge.spawn.mockImplementation(() => {
      const child = new EventEmitter() as EventEmitter & {
        stdout: EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
        stdin: { end: ReturnType<typeof vi.fn> };
        kill: ReturnType<typeof vi.fn>;
      };
      child.stdout = new EventEmitter() as EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
      child.stdout.setEncoding = vi.fn();
      child.stdin = { end: vi.fn() };
      child.kill = vi.fn(() => true);
      closeChild = () => {
        child.stdout.emit('data', bridgeResponse());
        child.emit('close', 0);
      };
      return child;
    });
    const hooks = await makePlugin({ cacheTTLMs: 5000 });

    const first = runTransform(hooks, 'generate packet 044 stress tests');
    const second = runTransform(hooks, 'generate packet 044 stress tests');
    closeChild?.();
    const outputs = await Promise.all([first, second]);

    expect(mockedBridge.spawn).toHaveBeenCalledTimes(1);
    expect(outputs[0].system[0]).toContain('system-spec-kit');
    expect(outputs[1].system[0]).toContain('system-spec-kit');
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('advisor_lookups=2');
    expect(status).toContain('cache_hits=1');
    expect(status).toContain('cache_misses=1');
  });

  it('sends prompt-safe bounded bridge payloads and clamps long returned briefs', async () => {
    mockedBridge.spawn.mockImplementation(() => makeChild(bridgeResponse(`Advisor: ${'x'.repeat(500)}`)));
    const hooks = await makePlugin({
      maxPromptBytes: 220,
      maxBriefChars: 64,
      maxTokens: 12,
      thresholdConfidence: 0.8,
    });
    const prompt = `implement stress tests with secret@example.com ${'y'.repeat(2000)}`;

    const output = await runTransform(hooks, prompt);

    expect(output.system[0]).toHaveLength(64);
    expect(output.system[0]).toBe('Advisor: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    const payload = bridgePayload(0);
    expect(payload.maxTokens).toBe(12);
    expect(payload.thresholdConfidence).toBe(0.8);
    expect(Buffer.byteLength(JSON.stringify(payload), 'utf8')).toBeLessThanOrEqual(220);
  });

  it('honors disabled env aliases without invoking the bridge', async () => {
    process.env.SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED = '1';
    const hooks = await makePlugin();

    const output = await runTransform(hooks, 'generate packet 044 stress tests');
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});

    expect(output.system).toEqual([]);
    expect(mockedBridge.spawn).not.toHaveBeenCalled();
    expect(status).toContain('enabled=false');
    expect(status).toContain('disabled_reason=SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED');
  });
});

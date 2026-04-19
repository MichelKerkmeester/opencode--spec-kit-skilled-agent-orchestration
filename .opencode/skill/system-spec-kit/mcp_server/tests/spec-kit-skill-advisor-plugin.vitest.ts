import { EventEmitter } from 'node:events';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockedBridge = vi.hoisted(() => ({
  spawn: vi.fn(),
}));

vi.mock('node:child_process', () => ({
  spawn: mockedBridge.spawn,
}));

import SpecKitSkillAdvisorPlugin from '../../../../plugins/spec-kit-skill-advisor.js';

function bridgeResponse(brief = 'Advisor: live; use sk-code-opencode 0.91/0.23 pass.') {
  return JSON.stringify({
    brief,
    status: brief ? 'ok' : 'skipped',
    metadata: {
      freshness: 'live',
      durationMs: 5,
      cacheHit: false,
      subprocessInvoked: true,
      recommendationCount: brief ? 1 : 0,
      tokenCap: 80,
      skillLabel: brief ? 'sk-code-opencode' : null,
    },
  });
}

function makeChild(stdout: string, closeDelayMs = 0, closeCode = 0) {
  const child = new EventEmitter() as EventEmitter & {
    stdout: EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
    stderr: EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
    stdin: { end: ReturnType<typeof vi.fn> };
    kill: ReturnType<typeof vi.fn>;
  };

  child.stdout = new EventEmitter() as EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
  child.stderr = new EventEmitter() as EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
  child.stdout.setEncoding = vi.fn();
  child.stderr.setEncoding = vi.fn();
  child.stdin = { end: vi.fn() };
  child.kill = vi.fn((signal: string) => {
    child.emit('killed', signal);
    if (signal === 'SIGKILL') {
      queueMicrotask(() => child.emit('close', null));
    }
    return true;
  });

  queueMicrotask(() => {
    child.stdout.emit('data', stdout);
    if (closeDelayMs > 0) {
      setTimeout(() => child.emit('close', closeCode), closeDelayMs);
      return;
    }
    child.emit('close', closeCode);
  });

  return child;
}

function mockBridgeSuccess(stdout = bridgeResponse()) {
  mockedBridge.spawn.mockImplementation(() => makeChild(stdout));
}

async function makePlugin(options: Record<string, unknown> = {}) {
  return await SpecKitSkillAdvisorPlugin({ directory: process.cwd() }, options);
}

describe('Spec Kit skill advisor OpenCode plugin', () => {
  beforeEach(async () => {
    vi.useRealTimers();
    vi.clearAllMocks();
    delete process.env.SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED;
    delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
    const resetHooks = await SpecKitSkillAdvisorPlugin({ directory: process.cwd() }, {});
    await resetHooks.onSessionEnd();
    mockBridgeSuccess();
  });

  it('caches repeat prompts inside the TTL and misses after expiry', async () => {
    vi.useFakeTimers();
    const hooks = await makePlugin({ cacheTTLMs: 1000 });

    const first = await hooks.onUserPromptSubmitted({ prompt: 'implement feature X' });
    const second = await hooks.onUserPromptSubmitted({ prompt: 'implement feature X' });
    vi.advanceTimersByTime(1001);
    const thirdPromise = hooks.onUserPromptSubmitted({ prompt: 'implement feature X' });
    await vi.runOnlyPendingTimersAsync();
    const third = await thirdPromise;

    expect(first.additionalContext).toContain('sk-code-opencode');
    expect(second.additionalContext).toBe(first.additionalContext);
    expect(third.additionalContext).toBe(first.additionalContext);
    expect(mockedBridge.spawn).toHaveBeenCalledTimes(2);

    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('cache_hits=1');
    expect(status).toContain('cache_misses=2');
  });

  it('keeps hit rate at or above 60 percent on a repeat-prompt trace', async () => {
    const hooks = await makePlugin({ cacheTTLMs: 5000 });
    const prompts = [
      'implement feature X',
      'implement feature X',
      'implement feature X',
      'implement feature X',
      'implement feature X',
    ];

    for (const prompt of prompts) {
      await hooks.onUserPromptSubmitted({ prompt });
    }

    expect(mockedBridge.spawn).toHaveBeenCalledTimes(1);
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('cache_hits=4');
    expect(status).toContain('cache_misses=1');
    expect(status).toContain('cache_hit_rate=0.8');
  });

  it('status tool returns prompt-safe fields only', async () => {
    const hooks = await makePlugin({ cacheTTLMs: 7777, bridgeTimeoutMs: 1234 });
    const rawPrompt = 'implement config with api_key=SECRET_ABC123';
    await hooks.onUserPromptSubmitted({ prompt: rawPrompt });

    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});

    expect(status).toContain('plugin_id=spec-kit-skill-advisor');
    expect(status).toContain('cache_ttl_ms=7777');
    expect(status).toContain('bridge_timeout_ms=1234');
    expect(status).toContain('last_bridge_status=ok');
    expect(status).not.toContain(rawPrompt);
    expect(status).not.toContain('SECRET_ABC123');
    expect(status).not.toMatch(/stdout|stderr|prompt_fingerprint|fingerprint/i);
  });

  it('env opt-out disables bridge invocation', async () => {
    process.env.SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED = '1';
    const hooks = await makePlugin();

    const output = await hooks.onUserPromptSubmitted({ prompt: 'implement feature X' });

    expect(output).toEqual({ additionalContext: null });
    expect(mockedBridge.spawn).not.toHaveBeenCalled();
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('enabled=false');
    expect(status).toContain('disabled_reason=SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED');
  });

  it('shared hook env opt-out disables bridge invocation', async () => {
    process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = '1';
    const hooks = await makePlugin();

    const output = await hooks.onUserPromptSubmitted({ prompt: 'implement feature X' });

    expect(output).toEqual({ additionalContext: null });
    expect(mockedBridge.spawn).not.toHaveBeenCalled();
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('enabled=false');
    expect(status).toContain('disabled_reason=SPECKIT_SKILL_ADVISOR_HOOK_DISABLED');
  });

  it('config opt-out disables bridge invocation', async () => {
    const hooks = await makePlugin({ enabled: false });

    const output = await hooks.onUserPromptSubmitted({ prompt: 'implement feature X' });

    expect(output).toEqual({ additionalContext: null });
    expect(mockedBridge.spawn).not.toHaveBeenCalled();
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('enabled=false');
    expect(status).toContain('disabled_reason=config_enabled_false');
  });

  it('bridge timeout returns null context and never throws', async () => {
    vi.useFakeTimers();
    mockedBridge.spawn.mockImplementation(() => makeChild(bridgeResponse(), 5000));
    const hooks = await makePlugin({ bridgeTimeoutMs: 10 });

    const outputPromise = hooks.onUserPromptSubmitted({ prompt: 'implement feature X' });
    await vi.advanceTimersByTimeAsync(1011);
    const output = await outputPromise;

    expect(output).toEqual({ additionalContext: null });
    expect(mockedBridge.spawn).toHaveBeenCalledTimes(1);
    const child = mockedBridge.spawn.mock.results[0]?.value;
    expect(child.kill).toHaveBeenCalledWith('SIGTERM');
    expect(child.kill).toHaveBeenCalledWith('SIGKILL');
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('last_bridge_status=fail_open');
    expect(status).toContain('last_error_code=TIMEOUT');
  });

  it('bridge error returns null context and never throws', async () => {
    mockedBridge.spawn.mockImplementation(() => {
      const child = makeChild('', 1000);
      queueMicrotask(() => child.emit('error', new Error('spawn failed')));
      return child;
    });
    const hooks = await makePlugin();

    const output = await hooks.onUserPromptSubmitted({ prompt: 'implement feature X' });

    expect(output).toEqual({ additionalContext: null });
    expect(mockedBridge.spawn).toHaveBeenCalledTimes(1);
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('last_bridge_status=fail_open');
    expect(status).toContain('last_error_code=SPAWN_ERROR');
  });

  it('invalid bridge stdout fail-opens without caching', async () => {
    mockBridgeSuccess('{not-json');
    const hooks = await makePlugin();

    const output = await hooks.onUserPromptSubmitted({ prompt: 'implement feature X' });
    const repeat = await hooks.onUserPromptSubmitted({ prompt: 'implement feature X' });

    expect(output).toEqual({ additionalContext: null });
    expect(repeat).toEqual({ additionalContext: null });
    expect(mockedBridge.spawn).toHaveBeenCalledTimes(2);
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('last_error_code=PARSE_FAIL');
  });

  it('nonzero bridge close fail-opens even when stdout looks ok', async () => {
    mockedBridge.spawn.mockImplementation(() => makeChild(bridgeResponse(), 0, 2));
    const hooks = await makePlugin();

    const output = await hooks.onUserPromptSubmitted({ prompt: 'implement feature X' });

    expect(output).toEqual({ additionalContext: null });
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('last_error_code=NONZERO_EXIT');
  });

  it('isolates prompt cache entries by session', async () => {
    const hooks = await makePlugin({ cacheTTLMs: 5000 });

    await hooks.onUserPromptSubmitted({ sessionId: 's1', prompt: 'implement feature X' });
    await hooks.onUserPromptSubmitted({ sessionId: 's2', prompt: 'implement feature X' });
    await hooks.onUserPromptSubmitted({ sessionId: 's1', prompt: 'implement feature X' });

    expect(mockedBridge.spawn).toHaveBeenCalledTimes(2);
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('cache_hits=1');
    expect(status).toContain('cache_misses=2');
  });

  it('evicts only the targeted session cache on session end', async () => {
    const hooks = await makePlugin({ cacheTTLMs: 5000 });

    await hooks.onUserPromptSubmitted({ sessionId: 's1', prompt: 'implement feature X' });
    await hooks.onUserPromptSubmitted({ sessionId: 's2', prompt: 'implement feature X' });
    await hooks.onSessionEnd({ sessionId: 's1' });
    await hooks.onUserPromptSubmitted({ sessionId: 's1', prompt: 'implement feature X' });
    await hooks.onUserPromptSubmitted({ sessionId: 's2', prompt: 'implement feature X' });

    expect(mockedBridge.spawn).toHaveBeenCalledTimes(3);
  });

  it('invalidates host cache when advisor source signature changes', async () => {
    const hooksA = await makePlugin({ cacheTTLMs: 5000, sourceSignatureOverride: 'sig-a' });
    await hooksA.onUserPromptSubmitted({ prompt: 'implement feature X' });
    await hooksA.onUserPromptSubmitted({ prompt: 'implement feature X' });
    expect(mockedBridge.spawn).toHaveBeenCalledTimes(1);

    const hooksB = await makePlugin({ cacheTTLMs: 5000, sourceSignatureOverride: 'sig-b' });
    await hooksB.onUserPromptSubmitted({ prompt: 'implement feature X' });

    expect(mockedBridge.spawn).toHaveBeenCalledTimes(2);
  });
});

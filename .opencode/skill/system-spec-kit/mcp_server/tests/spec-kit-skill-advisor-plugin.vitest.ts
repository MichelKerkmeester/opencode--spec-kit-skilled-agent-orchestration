import { EventEmitter } from 'node:events';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockedBridge = vi.hoisted(() => ({
  spawn: vi.fn(),
}));

vi.mock('node:child_process', () => ({
  spawn: mockedBridge.spawn,
}));

import SpecKitSkillAdvisorPlugin from '../../../../plugins/spec-kit-skill-advisor.js';

const DEFAULT_MAX_PROMPT_BYTES = 64 * 1024;
const DEFAULT_MAX_BRIEF_CHARS = 2 * 1024;

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

async function makePlugin(
  options: Record<string, unknown> = {},
  directory = process.cwd(),
  ctx: Record<string, unknown> = {},
) {
  return await SpecKitSkillAdvisorPlugin({ directory, ...ctx }, options);
}

async function runPrompt(
  hooks: Awaited<ReturnType<typeof makePlugin>>,
  input: Record<string, unknown> = {},
  output: Record<string, unknown> = { system: [] as string[] },
) {
  await hooks['experimental.chat.system.transform']?.(
    {
      sessionID: 's-test',
      model: { providerID: 'test-provider', modelID: 'test-model' },
      ...input,
    } as never,
    output as never,
  );
  const system = Array.isArray(output.system) ? output.system as string[] : [];
  return {
    additionalContext: system[0] ?? null,
    output,
  };
}

function statusMetric(status: string | undefined, key: string) {
  const match = status?.match(new RegExp(`^${key}=(\\d+(?:\\.\\d+)?)$`, 'm'));
  if (!match) {
    throw new Error(`Missing status metric: ${key}`);
  }
  return Number(match[1]);
}

function bridgePayloadAt(index: number) {
  return String(mockedBridge.spawn.mock.results[index]?.value.stdin.end.mock.calls[0]?.[0] ?? '{}');
}

describe('Spec Kit skill advisor OpenCode plugin', () => {
  beforeEach(async () => {
    vi.useRealTimers();
    vi.clearAllMocks();
    delete process.env.SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED;
    delete process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED;
    const resetHooks = await SpecKitSkillAdvisorPlugin({ directory: process.cwd() }, {});
    await resetHooks.event?.({
      event: {
        type: 'server.instance.disposed',
        properties: { directory: process.cwd() },
      } as never,
    });
    mockBridgeSuccess();
  });

  it('returns OpenCode hook keys and keeps status tool registration', async () => {
    const hooks = await makePlugin();

    expect(hooks).toHaveProperty('event');
    expect(hooks).toHaveProperty('experimental.chat.system.transform');
    expect(hooks).toHaveProperty('tool');
    expect(hooks).not.toHaveProperty('onSessionStart');
    expect(hooks).not.toHaveProperty('onUserPromptSubmitted');
    expect(hooks).not.toHaveProperty('onSessionEnd');
    expect(hooks.tool?.spec_kit_skill_advisor_status).toBeDefined();
  });

  it('pushes advisor brief into the OpenCode system transform output', async () => {
    const hooks = await makePlugin();

    const result = await runPrompt(hooks, { prompt: 'implement feature X' });

    expect(result.output.system).toHaveLength(1);
    expect(result.output.system[0]).toContain('sk-code-opencode');
  });

  it('does not push context when advisor returns an empty brief', async () => {
    mockBridgeSuccess(bridgeResponse(''));
    const hooks = await makePlugin();

    const result = await runPrompt(hooks, { prompt: 'implement feature X' });

    expect(result.output.system).toHaveLength(0);
    expect(mockedBridge.spawn).toHaveBeenCalledTimes(1);
  });

  it('loads the latest user prompt from session messages when transform input has no prompt', async () => {
    const client = {
      session: {
        messages: vi.fn().mockResolvedValue({
          data: [{
            info: { role: 'user', id: 'm1', sessionID: 's-client' },
            parts: [{ type: 'text', text: 'review code for security' }],
          }],
        }),
      },
    };
    const hooks = await makePlugin({ cacheTTLMs: 5000 }, process.cwd(), { client });

    const result = await runPrompt(hooks, { sessionID: 's-client' });

    expect(client.session.messages).toHaveBeenCalledWith({
      path: { id: 's-client' },
      query: { directory: process.cwd(), limit: 20 },
    });
    expect(result.output.system).toHaveLength(1);
    const bridgePayload = JSON.parse(String(mockedBridge.spawn.mock.results[0]?.value.stdin.end.mock.calls[0]?.[0] ?? '{}'));
    expect(bridgePayload.prompt).toBe('review code for security');
  });

  it('caches repeat prompts inside the TTL and misses after expiry', async () => {
    vi.useFakeTimers();
    const hooks = await makePlugin({ cacheTTLMs: 1000 });

    const first = await runPrompt(hooks, { prompt: 'implement feature X' });
    const second = await runPrompt(hooks, { prompt: 'implement feature X' });
    vi.advanceTimersByTime(1001);
    const thirdPromise = runPrompt(hooks, { prompt: 'implement feature X' });
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

  it('reports cache accounting with bridge invocations as cache misses', async () => {
    const hooks = await makePlugin({ cacheTTLMs: 5000 });

    await runPrompt(hooks, { prompt: 'implement feature X' });
    await runPrompt(hooks, { prompt: 'implement feature X' });
    await runPrompt(hooks, { prompt: 'review architecture Y' });

    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    const cacheHits = statusMetric(status, 'cache_hits');
    const cacheMisses = statusMetric(status, 'cache_misses');
    const bridgeInvocations = statusMetric(status, 'bridge_invocations');
    const advisorLookups = statusMetric(status, 'advisor_lookups');

    expect(cacheHits).toBe(1);
    expect(cacheMisses).toBe(2);
    expect(bridgeInvocations).toBe(2);
    expect(advisorLookups).toBe(3);
    expect(cacheMisses).toBe(bridgeInvocations);
    expect(cacheHits + cacheMisses).toBe(advisorLookups);
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
      await runPrompt(hooks, { prompt });
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
    await runPrompt(hooks, { prompt: rawPrompt });

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

    const output = await runPrompt(hooks, { prompt: 'implement feature X' });

    expect(output.additionalContext).toBeNull();
    expect(output.output.system).toHaveLength(0);
    expect(mockedBridge.spawn).not.toHaveBeenCalled();
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('enabled=false');
    expect(status).toContain('disabled_reason=SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED');
  });

  it('shared hook env opt-out disables bridge invocation', async () => {
    process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED = '1';
    const hooks = await makePlugin();

    const output = await runPrompt(hooks, { prompt: 'implement feature X' });

    expect(output.additionalContext).toBeNull();
    expect(output.output.system).toHaveLength(0);
    expect(mockedBridge.spawn).not.toHaveBeenCalled();
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('enabled=false');
    expect(status).toContain('disabled_reason=SPECKIT_SKILL_ADVISOR_HOOK_DISABLED');
  });

  it('config opt-out disables bridge invocation', async () => {
    const hooks = await makePlugin({ enabled: false });

    const output = await runPrompt(hooks, { prompt: 'implement feature X' });

    expect(output.additionalContext).toBeNull();
    expect(output.output.system).toHaveLength(0);
    expect(mockedBridge.spawn).not.toHaveBeenCalled();
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('enabled=false');
    expect(status).toContain('disabled_reason=config_enabled_false');
  });

  it('bridge timeout returns null context and never throws', async () => {
    vi.useFakeTimers();
    mockedBridge.spawn.mockImplementation(() => makeChild(bridgeResponse(), 5000));
    const hooks = await makePlugin({ bridgeTimeoutMs: 10 });

    const outputPromise = runPrompt(hooks, { prompt: 'implement feature X' });
    await vi.advanceTimersByTimeAsync(1011);
    const output = await outputPromise;

    expect(output.additionalContext).toBeNull();
    expect(output.output.system).toHaveLength(0);
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

    const output = await runPrompt(hooks, { prompt: 'implement feature X' });

    expect(output.additionalContext).toBeNull();
    expect(output.output.system).toHaveLength(0);
    expect(mockedBridge.spawn).toHaveBeenCalledTimes(1);
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('last_bridge_status=fail_open');
    expect(status).toContain('last_error_code=SPAWN_ERROR');
  });

  it('invalid bridge stdout fail-opens without caching', async () => {
    mockBridgeSuccess('{not-json');
    const hooks = await makePlugin();

    const output = await runPrompt(hooks, { prompt: 'implement feature X' });
    const repeat = await runPrompt(hooks, { prompt: 'implement feature X' });

    expect(output.additionalContext).toBeNull();
    expect(output.output.system).toHaveLength(0);
    expect(repeat.additionalContext).toBeNull();
    expect(repeat.output.system).toHaveLength(0);
    expect(mockedBridge.spawn).toHaveBeenCalledTimes(2);
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('last_error_code=PARSE_FAIL');
  });

  it('nonzero bridge close fail-opens even when stdout looks ok', async () => {
    mockedBridge.spawn.mockImplementation(() => makeChild(bridgeResponse(), 0, 2));
    const hooks = await makePlugin();

    const output = await runPrompt(hooks, { prompt: 'implement feature X' });

    expect(output.additionalContext).toBeNull();
    expect(output.output.system).toHaveLength(0);
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('last_error_code=NONZERO_EXIT');
  });

  it('isolates prompt cache entries by session', async () => {
    const hooks = await makePlugin({ cacheTTLMs: 5000 });

    await runPrompt(hooks, { sessionID: 's1', prompt: 'implement feature X' });
    await runPrompt(hooks, { sessionID: 's2', prompt: 'implement feature X' });
    await runPrompt(hooks, { sessionID: 's1', prompt: 'implement feature X' });

    expect(mockedBridge.spawn).toHaveBeenCalledTimes(2);
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('cache_hits=1');
    expect(status).toContain('cache_misses=2');
  });

  it('sets readiness on session creation and evicts only the targeted session cache on session deletion', async () => {
    const hooks = await makePlugin({ cacheTTLMs: 5000 });

    await hooks.event?.({
      event: {
        type: 'session.created',
        properties: {
          info: { id: 's1' },
        },
      } as never,
    });
    const readyStatus = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(readyStatus).toContain('runtime_ready=true');
    expect(readyStatus).toContain('last_bridge_status=ready');

    await runPrompt(hooks, { sessionID: 's1', prompt: 'implement feature X' });
    await runPrompt(hooks, { sessionID: 's2', prompt: 'implement feature X' });
    await hooks.event?.({
      event: {
        type: 'session.deleted',
        properties: {
          info: { id: 's1' },
        },
      } as never,
    });
    await runPrompt(hooks, { sessionID: 's1', prompt: 'implement feature X' });
    await runPrompt(hooks, { sessionID: 's2', prompt: 'implement feature X' });

    expect(mockedBridge.spawn).toHaveBeenCalledTimes(3);
  });

  it('keeps runtime readiness true when the advisor bridge returns skipped after session creation', async () => {
    mockBridgeSuccess(bridgeResponse(''));
    const hooks = await makePlugin({ cacheTTLMs: 5000 });

    await hooks.event?.({
      event: {
        type: 'session.created',
        properties: {
          sessionID: 's-ready',
          info: { id: 's-ready' },
        },
      } as never,
    });
    await runPrompt(hooks, { sessionID: 's-ready', prompt: 'status only' });

    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('runtime_ready=true');
    expect(status).toContain('last_bridge_status=skipped');
  });

  it('marks runtime ready on the first system transform when no lifecycle event is observed', async () => {
    const hooks = await makePlugin({ cacheTTLMs: 5000 });

    await runPrompt(hooks, { sessionID: 's-ready', prompt: 'implement feature X' });

    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('runtime_ready=true');
    expect(status).toContain('last_bridge_status=ok');
  });

  it('initializes missing or null system output before appending the advisor brief', async () => {
    const hooks = await makePlugin({ cacheTTLMs: 5000 });
    const missingSystemOutput: Record<string, unknown> = {};
    const nullSystemOutput: Record<string, unknown> = { system: null };

    await expect(runPrompt(hooks, { prompt: 'implement feature X' }, missingSystemOutput)).resolves.toEqual(
      expect.objectContaining({ additionalContext: expect.stringContaining('sk-code-opencode') }),
    );
    await expect(runPrompt(hooks, { prompt: 'review architecture Y' }, nullSystemOutput)).resolves.toEqual(
      expect.objectContaining({ additionalContext: expect.stringContaining('sk-code-opencode') }),
    );
    expect(missingSystemOutput.system).toEqual([expect.stringContaining('sk-code-opencode')]);
    expect(nullSystemOutput.system).toEqual([expect.stringContaining('sk-code-opencode')]);
  });

  it('normalizes object session IDs into deterministic string cache keys', async () => {
    const hooks = await makePlugin({ cacheTTLMs: 5000 });

    await runPrompt(hooks, {
      sessionID: { workspace: 'public', id: 's-object' },
      prompt: 'implement feature X',
    });
    await runPrompt(hooks, {
      sessionID: { id: 's-object', workspace: 'public' },
      prompt: 'implement feature X',
    });
    await runPrompt(hooks, {
      sessionID: { id: 's-other', workspace: 'public' },
      prompt: 'implement feature X',
    });

    expect(mockedBridge.spawn).toHaveBeenCalledTimes(2);
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('cache_hits=1');
    expect(status).toContain('cache_misses=2');
    expect(status).toContain('advisor_lookups=3');
  });

  it('keeps two plugin instances state-isolated', async () => {
    const hooksA = await makePlugin({ cacheTTLMs: 5000 }, `${process.cwd()}/instance-a`);
    const hooksB = await makePlugin({ cacheTTLMs: 5000 }, `${process.cwd()}/instance-b`);

    await runPrompt(hooksA, { sessionID: 's-a', prompt: 'implement isolated state' });

    const statusA = await hooksA.tool?.spec_kit_skill_advisor_status.execute({});
    const statusB = await hooksB.tool?.spec_kit_skill_advisor_status.execute({});

    expect(statusA).toContain('runtime_ready=true');
    expect(statusA).toContain('cache_entries=1');
    expect(statusA).toContain('cache_misses=1');
    expect(statusA).toContain('bridge_invocations=1');
    expect(statusB).toContain('runtime_ready=false');
    expect(statusB).toContain('cache_entries=0');
    expect(statusB).toContain('cache_misses=0');
    expect(statusB).toContain('bridge_invocations=0');
  });

  it('dedups concurrent identical requests into one bridge spawn', async () => {
    mockedBridge.spawn.mockImplementation(() => makeChild(bridgeResponse(), 10));
    const hooks = await makePlugin({ cacheTTLMs: 5000 });

    const results = await Promise.all(
      Array.from({ length: 5 }, () => runPrompt(hooks, { sessionID: 's-dedup', prompt: 'implement shared bridge' })),
    );

    expect(results.map((result) => result.additionalContext)).toEqual(
      Array.from({ length: 5 }, () => expect.stringContaining('sk-code-opencode')),
    );
    expect(mockedBridge.spawn).toHaveBeenCalledTimes(1);
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('cache_hits=4');
    expect(status).toContain('cache_misses=1');
    expect(status).toContain('advisor_lookups=5');
    expect(status).toContain('bridge_invocations=1');
  });

  it('clamps oversized prompt payload before bridge stdin write', async () => {
    const hooks = await makePlugin({ cacheTTLMs: 5000 });
    const prompt = 'x'.repeat(100 * 1024);

    await runPrompt(hooks, { sessionID: 's-prompt-clamp', prompt });

    const payload = bridgePayloadAt(0);
    expect(Buffer.byteLength(payload, 'utf8')).toBeLessThanOrEqual(DEFAULT_MAX_PROMPT_BYTES);
    expect(JSON.parse(payload).prompt.length).toBeLessThan(prompt.length);
  });

  it('clamps oversized advisor brief before pushing system output', async () => {
    mockBridgeSuccess(bridgeResponse('b'.repeat(10 * 1024)));
    const hooks = await makePlugin({ cacheTTLMs: 5000 });

    const result = await runPrompt(hooks, { sessionID: 's-brief-clamp', prompt: 'implement clamp' });

    expect(result.output.system).toHaveLength(1);
    expect(result.output.system[0]).toHaveLength(DEFAULT_MAX_BRIEF_CHARS);
  });

  it('evicts oldest cache entry when max cache entries is exceeded', async () => {
    const hooks = await makePlugin({ cacheTTLMs: 5000, maxCacheEntries: 2 });

    await runPrompt(hooks, { sessionID: 's-lru', prompt: 'first prompt' });
    await runPrompt(hooks, { sessionID: 's-lru', prompt: 'second prompt' });
    await runPrompt(hooks, { sessionID: 's-lru', prompt: 'third prompt' });

    let status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('cache_entries=2');
    expect(mockedBridge.spawn).toHaveBeenCalledTimes(3);

    await runPrompt(hooks, { sessionID: 's-lru', prompt: 'first prompt' });
    status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('cache_entries=2');
    expect(mockedBridge.spawn).toHaveBeenCalledTimes(4);
  });

  it('reports status metrics independently for each plugin instance', async () => {
    const hooksA = await makePlugin({ cacheTTLMs: 5000 }, `${process.cwd()}/status-a`);
    const hooksB = await makePlugin({ cacheTTLMs: 5000 }, `${process.cwd()}/status-b`);

    await runPrompt(hooksA, { sessionID: 's-status-a', prompt: 'implement feature X' });
    await runPrompt(hooksA, { sessionID: 's-status-a', prompt: 'implement feature X' });
    await runPrompt(hooksA, { sessionID: 's-status-a', prompt: 'review architecture Y' });
    await runPrompt(hooksB, { sessionID: 's-status-b', prompt: 'implement feature X' });

    const statusA = await hooksA.tool?.spec_kit_skill_advisor_status.execute({});
    const statusB = await hooksB.tool?.spec_kit_skill_advisor_status.execute({});
    const hitsA = statusMetric(statusA, 'cache_hits');
    const missesA = statusMetric(statusA, 'cache_misses');
    const bridgeA = statusMetric(statusA, 'bridge_invocations');
    const lookupsA = statusMetric(statusA, 'advisor_lookups');
    const hitsB = statusMetric(statusB, 'cache_hits');
    const missesB = statusMetric(statusB, 'cache_misses');
    const bridgeB = statusMetric(statusB, 'bridge_invocations');
    const lookupsB = statusMetric(statusB, 'advisor_lookups');

    expect([hitsA, missesA, bridgeA, lookupsA]).toEqual([1, 2, 2, 3]);
    expect([hitsB, missesB, bridgeB, lookupsB]).toEqual([0, 1, 1, 1]);
    expect(missesA).toBe(bridgeA);
    expect(hitsA + missesA).toBe(lookupsA);
    expect(missesB).toBe(bridgeB);
    expect(hitsB + missesB).toBe(lookupsB);
  });

  it('applies configurable prompt, brief, and cache caps', async () => {
    mockBridgeSuccess(bridgeResponse('c'.repeat(500)));
    const hooks = await makePlugin({
      cacheTTLMs: 5000,
      maxPromptBytes: 4096,
      maxBriefChars: 64,
      maxCacheEntries: 1,
    });

    const first = await runPrompt(hooks, { sessionID: 's-custom-caps', prompt: 'x'.repeat(20 * 1024) });
    await runPrompt(hooks, { sessionID: 's-custom-caps', prompt: 'second prompt' });

    expect(Buffer.byteLength(bridgePayloadAt(0), 'utf8')).toBeLessThanOrEqual(4096);
    expect(first.output.system[0]).toHaveLength(64);
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('max_prompt_bytes=4096');
    expect(status).toContain('max_brief_chars=64');
    expect(status).toContain('max_cache_entries=1');
    expect(status).toContain('cache_entries=1');
  });

  it('invalidates host cache when advisor source signature changes', async () => {
    const hooksA = await makePlugin({ cacheTTLMs: 5000, sourceSignatureOverride: 'sig-a' });
    await runPrompt(hooksA, { prompt: 'implement feature X' });
    await runPrompt(hooksA, { prompt: 'implement feature X' });
    expect(mockedBridge.spawn).toHaveBeenCalledTimes(1);

    const hooksB = await makePlugin({ cacheTTLMs: 5000, sourceSignatureOverride: 'sig-b' });
    await runPrompt(hooksB, { prompt: 'implement feature X' });

    expect(mockedBridge.spawn).toHaveBeenCalledTimes(2);
  });

  it('keeps separate cache entries for identical prompts across workspace roots', async () => {
    const workspaceA = `${process.cwd()}/workspace-a`;
    const workspaceB = `${process.cwd()}/workspace-b`;
    const hooksA = await makePlugin({ cacheTTLMs: 5000 }, workspaceA);
    const hooksB = await makePlugin({ cacheTTLMs: 5000 }, workspaceB);

    const firstA = await runPrompt(hooksA, { prompt: 'implement feature X' });
    const firstB = await runPrompt(hooksB, { prompt: 'implement feature X' });
    const secondA = await runPrompt(hooksA, { prompt: 'implement feature X' });
    const secondB = await runPrompt(hooksB, { prompt: 'implement feature X' });

    expect(firstA.additionalContext).toContain('sk-code-opencode');
    expect(firstB.additionalContext).toContain('sk-code-opencode');
    expect(secondA.additionalContext).toBe(firstA.additionalContext);
    expect(secondB.additionalContext).toBe(firstB.additionalContext);
    expect(mockedBridge.spawn).toHaveBeenCalledTimes(2);

    const bridgePayloads = mockedBridge.spawn.mock.results.map((result) =>
      JSON.parse(String(result.value.stdin.end.mock.calls[0]?.[0] ?? '{}'))
    );
    expect(bridgePayloads).toEqual([
      expect.objectContaining({ workspaceRoot: workspaceA }),
      expect.objectContaining({ workspaceRoot: workspaceB }),
    ]);

    const status = await hooksA.tool?.spec_kit_skill_advisor_status.execute({});
    expect(status).toContain('cache_hits=1');
    expect(status).toContain('cache_misses=1');
  });
});

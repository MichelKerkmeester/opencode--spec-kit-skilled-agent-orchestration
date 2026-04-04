import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockedBridge = vi.hoisted(() => ({
  execFile: vi.fn(),
}));

vi.mock('node:child_process', () => ({
  execFile: mockedBridge.execFile,
}));

import SpecKitCompactCodeGraphPlugin from '../../../../plugins/spec-kit-compact-code-graph.js';

function buildBridgeResponse() {
  return JSON.stringify({
    status: 'ok',
    data: {
      opencodeTransport: {
        interfaceVersion: '1.0',
        transportOnly: true,
        retrievalPolicyOwner: 'runtime',
        event: {
          hook: 'event',
          trackedPayloadKinds: ['resume'],
          summary: 'Track OpenCode routing hints',
        },
        systemTransform: {
          hook: 'experimental.chat.system.transform',
          title: 'OpenCode Startup Digest',
          payloadKind: 'resume',
          dedupeKey: 'system:resume',
          content: 'Summary: resume summary',
        },
        messagesTransform: [{
          hook: 'experimental.chat.messages.transform',
          title: 'OpenCode Retrieved Context',
          payloadKind: 'resume',
          dedupeKey: 'messages:resume:0',
          content: 'Summary: retrieved context',
        }],
        compaction: {
          hook: 'experimental.session.compacting',
          title: 'OpenCode Compaction Resume Note',
          payloadKind: 'resume',
          dedupeKey: 'compaction:resume',
          content: 'Summary: compaction note',
        },
      },
    },
  });
}

function mockBridgeSuccess(stdout = buildBridgeResponse()) {
  mockedBridge.execFile.mockImplementation((_file, _args, _options, callback) => {
    callback(null, stdout, '');
  });
}

function makeMessage(sessionID: string, messageID: string) {
  return {
    info: {
      id: messageID,
      sessionID,
    },
    parts: [],
  };
}

describe('Spec Kit compact code graph plugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockBridgeSuccess();
  });

  it('injects the startup digest into the system prompt once per cache window', async () => {
    const hooks = await SpecKitCompactCodeGraphPlugin({ directory: process.cwd() }, { cacheTtlMs: 5000 });
    const output = { system: [] as string[] };

    await hooks['experimental.chat.system.transform']?.(
      { sessionID: 's1', model: { id: 'test-model' } as never },
      output,
    );
    await hooks['experimental.chat.system.transform']?.(
      { sessionID: 's1', model: { id: 'test-model' } as never },
      output,
    );

    expect(mockedBridge.execFile).toHaveBeenCalledTimes(1);
    expect(mockedBridge.execFile).toHaveBeenCalledWith(
      'node',
      expect.arrayContaining([
        expect.stringContaining('spec-kit-compact-code-graph-bridge.mjs'),
        '--minimal',
      ]),
      expect.objectContaining({ cwd: process.cwd() }),
      expect.any(Function),
    );
    expect(output.system).toHaveLength(1);
    expect(output.system[0]).toContain('OpenCode Startup Digest');
  });

  it('exports only a single default plugin function', async () => {
    const pluginModule = await import('../../../../plugins/spec-kit-compact-code-graph.js');

    expect(Object.keys(pluginModule)).toEqual(['default']);
    expect(pluginModule.default).toBeTypeOf('function');
  });

  it('adds schema-aligned synthetic text parts and avoids duplicates', async () => {
    const hooks = await SpecKitCompactCodeGraphPlugin({ directory: process.cwd() }, { cacheTtlMs: 5000 });
    const output = {
      messages: [makeMessage('s2', 'm1')],
    };

    await hooks['experimental.chat.messages.transform']?.({}, output as never);
    await hooks['experimental.chat.messages.transform']?.({}, output as never);

    expect(mockedBridge.execFile).toHaveBeenCalledTimes(1);
    expect(output.messages[0].parts).toHaveLength(1);
    expect(output.messages[0].parts[0]).toMatchObject({
      sessionID: 's2',
      messageID: 'm1',
      type: 'text',
      text: 'OpenCode Retrieved Context\nSummary: retrieved context',
      synthetic: true,
      metadata: {
        specKitCompactCodeGraph: 'messages:resume:0',
      },
    });
  });

  it('skips message injection for tool-bearing message anchors', async () => {
    const hooks = await SpecKitCompactCodeGraphPlugin({ directory: process.cwd() }, { cacheTtlMs: 5000 });
    const output = {
      messages: [{
        info: {
          id: 'm-tool',
          sessionID: 's-tool',
        },
        parts: [{
          id: 'tool-part-1',
          sessionID: 's-tool',
          messageID: 'm-tool',
          type: 'tool',
          callID: 'call-1',
          tool: 'session_bootstrap',
          state: {
            status: 'completed',
            input: {},
            output: 'ok',
            metadata: {},
            time: { start: 1, end: 2 },
          },
        }],
      }],
    };

    await hooks['experimental.chat.messages.transform']?.({}, output as never);

    expect(mockedBridge.execFile).not.toHaveBeenCalled();
    expect(output.messages[0].parts).toHaveLength(1);
    expect(output.messages[0].parts[0]).toMatchObject({ type: 'tool' });
  });

  it('adds a compaction note and invalidates cache on session events', async () => {
    const hooks = await SpecKitCompactCodeGraphPlugin({ directory: process.cwd() }, { cacheTtlMs: 5000 });
    const output = { context: [] as string[] };

    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, output);
    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, output);

    expect(mockedBridge.execFile).toHaveBeenCalledTimes(1);
    expect(output.context).toHaveLength(1);
    expect(output.context[0]).toContain('OpenCode Compaction Resume Note');

    await hooks.event?.({
      event: {
        type: 'session.updated',
        properties: {
          info: {
            id: 's3',
          },
        },
      } as never,
    });

    await hooks['experimental.session.compacting']?.({ sessionID: 's3' }, { context: [] });
    expect(mockedBridge.execFile).toHaveBeenCalledTimes(2);
  });

  it('exposes a status tool for plugin diagnostics', async () => {
    const hooks = await SpecKitCompactCodeGraphPlugin(
      { directory: process.cwd() },
      { cacheTtlMs: 7777, bridgeTimeoutMs: 1234, nodeBinary: 'node-custom' },
    );
    await hooks['experimental.chat.system.transform']?.(
      { sessionID: 's4', model: { id: 'test-model' } as never },
      { system: [] },
    );
    const status = await hooks.tool?.spec_kit_compact_code_graph_status.execute({});

    expect(status).toContain('plugin_id=spec-kit-compact-code-graph');
    expect(status).toContain('cache_ttl_ms=7777');
    expect(status).toContain('resume_mode=minimal');
    expect(status).toContain('messages_transform_enabled=true');
    expect(status).toContain('messages_transform_mode=schema_aligned');
    expect(status).toContain('runtime_ready=true');
    expect(status).toContain('node_binary=node-custom');
    expect(status).toContain('bridge_timeout_ms=1234');
    expect(status).toContain('last_runtime_error=none');
  });

  it('skips injection when the bridge process fails', async () => {
    mockedBridge.execFile.mockImplementation((_file, _args, _options, callback) => {
      callback(new Error('NODE_MODULE_VERSION mismatch'), '', '');
    });

    const hooks = await SpecKitCompactCodeGraphPlugin({ directory: process.cwd() }, { cacheTtlMs: 5000 });
    const output = { system: [] as string[] };

    await hooks['experimental.chat.system.transform']?.(
      { sessionID: 's5', model: { id: 'test-model' } as never },
      output,
    );

    expect(output.system).toHaveLength(0);

    const status = await hooks.tool?.spec_kit_compact_code_graph_status.execute({});
    expect(status).toContain('runtime_ready=false');
    expect(status).toContain('last_runtime_error=NODE_MODULE_VERSION mismatch');
  });
});

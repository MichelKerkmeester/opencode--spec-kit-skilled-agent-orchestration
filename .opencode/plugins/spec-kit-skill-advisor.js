// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Spec Kit Skill Advisor OpenCode Plugin                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { statSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

import { tool } from '@opencode-ai/plugin';

const PLUGIN_ID = 'spec-kit-skill-advisor';
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;
const DEFAULT_THRESHOLD_CONFIDENCE = 0.7;
const DEFAULT_MAX_TOKENS = 80;
const DEFAULT_BRIDGE_TIMEOUT_MS = 1000;
const DEFAULT_NODE_BINARY = 'node';
const DISABLED_ENV = 'SPECKIT_SKILL_ADVISOR_HOOK_DISABLED';
const LEGACY_DISABLED_ENV = 'SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED';
const BRIDGE_PATH = fileURLToPath(new URL('./spec-kit-skill-advisor-bridge.mjs', import.meta.url));
const ADVISOR_SOURCE_PATHS = [
  BRIDGE_PATH,
  fileURLToPath(new URL('../skill/system-spec-kit/mcp_server/dist/lib/skill-advisor/skill-advisor-brief.js', import.meta.url)),
  fileURLToPath(new URL('../skill/system-spec-kit/mcp_server/dist/lib/skill-advisor/render.js', import.meta.url)),
  fileURLToPath(new URL('../skill/system-spec-kit/mcp_server/dist/lib/skill-advisor/subprocess.js', import.meta.url)),
];

const advisorCache = new Map();
let runtimeReady = false;
let lastBridgeStatus = 'uninitialized';
let lastErrorCode = null;
let lastDurationMs = 0;
let bridgeInvocations = 0;
let cacheHits = 0;
let cacheMisses = 0;
let disabledReason = null;

function normalizePositiveInt(value, fallback) {
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : fallback;
}

function normalizeThreshold(value) {
  if (!Number.isFinite(value)) {
    return DEFAULT_THRESHOLD_CONFIDENCE;
  }
  return Math.min(1, Math.max(0, Number(value)));
}

function envDisablesPlugin() {
  return process.env[DISABLED_ENV] === '1' || process.env[LEGACY_DISABLED_ENV] === '1';
}

function disabledEnvName() {
  if (process.env[DISABLED_ENV] === '1') {
    return DISABLED_ENV;
  }
  if (process.env[LEGACY_DISABLED_ENV] === '1') {
    return LEGACY_DISABLED_ENV;
  }
  return null;
}

function advisorSourceSignature() {
  const hash = createHash('sha256');
  for (const sourcePath of ADVISOR_SOURCE_PATHS) {
    try {
      const stat = statSync(sourcePath);
      hash.update(sourcePath);
      hash.update('\u001f');
      hash.update(String(stat.mtimeMs));
      hash.update('\u001f');
      hash.update(String(stat.size));
      hash.update('\u001e');
    } catch {
      hash.update(sourcePath);
      hash.update('\u001fmissing\u001e');
    }
  }
  return hash.digest('hex');
}

function normalizeOptions(rawOptions) {
  const options = rawOptions && typeof rawOptions === 'object' ? rawOptions : {};
  const configuredTtl = options.cacheTTLMs ?? options.cacheTtlMs;
  const enabled = options.enabled !== false && !envDisablesPlugin();

  return {
    enabled,
    cacheTTLMs: normalizePositiveInt(configuredTtl, DEFAULT_CACHE_TTL_MS),
    thresholdConfidence: normalizeThreshold(options.thresholdConfidence),
    maxTokens: normalizePositiveInt(options.maxTokens, DEFAULT_MAX_TOKENS),
    nodeBinary: typeof options.nodeBinaryOverride === 'string' && options.nodeBinaryOverride.trim()
      ? options.nodeBinaryOverride.trim()
      : (process.env.SPEC_KIT_PLUGIN_NODE_BINARY || DEFAULT_NODE_BINARY),
    bridgeTimeoutMs: normalizePositiveInt(options.bridgeTimeoutMs, DEFAULT_BRIDGE_TIMEOUT_MS),
    sourceSignatureOverride: typeof options.sourceSignatureOverride === 'string'
      ? options.sourceSignatureOverride
      : null,
  };
}

function sessionIdFrom(input) {
  if (!input || typeof input !== 'object') {
    return '__global__';
  }
  return input.sessionID
    || input.sessionId
    || input.session?.id
    || input.properties?.sessionID
    || '__global__';
}

function normalizeWorkspaceRoot(workspaceRoot) {
  if (typeof workspaceRoot === 'string' && workspaceRoot.trim()) {
    return resolvePath(workspaceRoot.trim());
  }
  return resolvePath(process.cwd());
}

function cacheKeyForPrompt(prompt, options, sessionID, sourceSignature, workspaceRoot) {
  const promptKey = createHash('sha256')
    .update(prompt)
    .update('\u001f')
    .update(String(options.thresholdConfidence))
    .update('\u001f')
    .update(String(options.maxTokens))
    .update('\u001f')
    .update(sourceSignature)
    .update('\u001f')
    .update(workspaceRoot)
    .digest('hex');
  return `${sessionID}::${promptKey}`;
}

function extractPrompt(input) {
  if (typeof input === 'string') {
    return input;
  }
  if (!input || typeof input !== 'object') {
    return null;
  }

  const candidates = [
    input.prompt,
    input.text,
    input.userPrompt,
    input.message,
    input.input,
    input.properties?.prompt,
    input.properties?.message,
    input.request?.prompt,
    input.request?.message,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate;
    }
    if (candidate && typeof candidate === 'object') {
      const content = candidate.content ?? candidate.text;
      if (typeof content === 'string' && content.trim()) {
        return content;
      }
    }
  }

  return null;
}

function promptSafeErrorCode(value) {
  if (typeof value === 'string' && /^[A-Z0-9_]+$/.test(value)) {
    return value;
  }
  return 'UNKNOWN';
}

function parseBridgeResponse(stdout) {
  if (!stdout.trim()) {
    return {
      brief: null,
      status: 'fail_open',
      error: 'EMPTY_STDOUT',
      metadata: {},
    };
  }

  try {
    const parsed = JSON.parse(stdout.trim());
    const status = ['ok', 'skipped', 'degraded', 'fail_open'].includes(parsed?.status)
      ? parsed.status
      : 'fail_open';
    return {
      brief: typeof parsed?.brief === 'string' && parsed.brief.trim() ? parsed.brief : null,
      status,
      metadata: parsed?.metadata && typeof parsed.metadata === 'object' ? parsed.metadata : {},
      ...(typeof parsed?.error === 'string' ? { error: promptSafeErrorCode(parsed.error) } : {}),
    };
  } catch {
    return {
      brief: null,
      status: 'fail_open',
      error: 'PARSE_FAIL',
      metadata: {},
    };
  }
}

function runBridge({ projectDir, prompt, options }) {
  const startedAt = Date.now();
  bridgeInvocations += 1;

  return new Promise((resolve) => {
    const child = spawn(options.nodeBinary, [BRIDGE_PATH], {
      cwd: projectDir,
      env: process.env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let settled = false;
    let timedOut = false;
    let sigkillTimer = null;
    const timeout = setTimeout(() => {
      if (settled) {
        return;
      }
      timedOut = true;
      child.kill('SIGTERM');
      sigkillTimer = setTimeout(() => {
        if (!settled) {
          child.kill('SIGKILL');
        }
      }, 1000);
    }, options.bridgeTimeoutMs);

    child.stdout?.setEncoding?.('utf8');
    child.stdout?.on('data', (chunk) => {
      stdout += String(chunk);
    });

    child.on('error', () => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      if (sigkillTimer) {
        clearTimeout(sigkillTimer);
      }
      runtimeReady = false;
      lastBridgeStatus = 'fail_open';
      lastErrorCode = timedOut ? 'TIMEOUT' : 'SPAWN_ERROR';
      lastDurationMs = Date.now() - startedAt;
      resolve({
        brief: null,
        status: 'fail_open',
        error: lastErrorCode,
        metadata: {},
      });
    });

    child.on('close', (code) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      if (sigkillTimer) {
        clearTimeout(sigkillTimer);
      }

      const response = timedOut
        ? { brief: null, status: 'fail_open', error: 'TIMEOUT', metadata: {} }
        : parseBridgeResponse(stdout);
      if (!timedOut && code !== 0 && response.status !== 'fail_open') {
        response.status = 'fail_open';
        response.brief = null;
        response.error = 'NONZERO_EXIT';
      }

      runtimeReady = response.status === 'ok';
      lastBridgeStatus = response.status;
      lastErrorCode = response.error ?? null;
      lastDurationMs = Date.now() - startedAt;
      resolve(response);
    });

    child.stdin?.end(JSON.stringify({
      prompt,
      workspaceRoot: projectDir,
      runtime: 'codex',
      maxTokens: options.maxTokens,
      thresholdConfidence: options.thresholdConfidence,
    }));
  });
}

async function getAdvisorContext({ projectDir, prompt, sessionID, options }) {
  const sourceSignature = options.sourceSignatureOverride ?? advisorSourceSignature();
  const workspaceRoot = normalizeWorkspaceRoot(projectDir);
  const key = cacheKeyForPrompt(prompt, options, sessionID, sourceSignature, workspaceRoot);
  const now = Date.now();
  const cached = advisorCache.get(key);

  if (cached && cached.expiresAt > now) {
    cacheHits += 1;
    return cached.response;
  }

  cacheMisses += 1;
  const response = await runBridge({ projectDir, prompt, options });
  if (response.status === 'ok' && response.brief) {
    advisorCache.set(key, {
      response,
      expiresAt: now + options.cacheTTLMs,
      updatedAt: new Date(now).toISOString(),
    });
  } else {
    advisorCache.delete(key);
  }
  return response;
}

function resetRuntimeState() {
  advisorCache.clear();
  runtimeReady = false;
  lastBridgeStatus = 'uninitialized';
  lastErrorCode = null;
  lastDurationMs = 0;
  bridgeInvocations = 0;
  cacheHits = 0;
  cacheMisses = 0;
  disabledReason = null;
}

function cacheHitRate() {
  const total = cacheHits + cacheMisses;
  return total === 0 ? 0 : Number((cacheHits / total).toFixed(3));
}

export default async function SpecKitSkillAdvisorPlugin(ctx, rawOptions) {
  const options = normalizeOptions(rawOptions);
  const projectDir = normalizeWorkspaceRoot(ctx?.directory);
  disabledReason = !options.enabled
    ? (disabledEnvName() ?? 'config_enabled_false')
    : null;

  async function onUserPromptSubmitted(input) {
    if (!options.enabled) {
      return { additionalContext: null };
    }

    const prompt = extractPrompt(input);
    if (!prompt) {
      return { additionalContext: null };
    }

    const response = await getAdvisorContext({
      projectDir,
      prompt,
      sessionID: sessionIdFrom(input),
      options,
    });
    return {
      additionalContext: response.brief ?? null,
    };
  }

  return {
    async onSessionStart() {
      if (!options.enabled) {
        return;
      }
      runtimeReady = true;
      lastBridgeStatus = 'ready';
    },

    onUserPromptSubmitted,

    async onSessionEnd(input = {}) {
      const sessionID = sessionIdFrom(input);
      for (const key of [...advisorCache.keys()]) {
        if (key.startsWith(`${sessionID}::`)) {
          advisorCache.delete(key);
        }
      }
      if (sessionID === '__global__') {
        resetRuntimeState();
      }
    },

    tool: {
      spec_kit_skill_advisor_status: tool({
        description: 'Show Spec Kit skill advisor plugin prompt-safe cache status',
        args: {},
        async execute() {
          return [
            `plugin_id=${PLUGIN_ID}`,
            `enabled=${options.enabled}`,
            `disabled_reason=${disabledReason ?? 'none'}`,
            `cache_ttl_ms=${options.cacheTTLMs}`,
            `threshold_confidence=${options.thresholdConfidence}`,
            `max_tokens=${options.maxTokens}`,
            `runtime_ready=${runtimeReady}`,
            `node_binary=${options.nodeBinary}`,
            `bridge_timeout_ms=${options.bridgeTimeoutMs}`,
            `bridge_path=${BRIDGE_PATH}`,
            `last_bridge_status=${lastBridgeStatus}`,
            `last_runtime_status=${lastBridgeStatus}`,
            `last_error_code=${lastErrorCode ?? 'none'}`,
            `last_runtime_error=${lastErrorCode ?? 'none'}`,
            `last_duration_ms=${lastDurationMs}`,
            `bridge_invocations=${bridgeInvocations}`,
            `cache_entries=${advisorCache.size}`,
            `cache_hits=${cacheHits}`,
            `cache_misses=${cacheMisses}`,
            `cache_hit_rate=${cacheHitRate()}`,
          ].join('\n');
        },
      }),
    },
  };
}

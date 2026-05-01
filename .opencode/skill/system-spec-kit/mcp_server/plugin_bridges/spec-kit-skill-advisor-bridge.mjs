#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Spec Kit Skill Advisor Plugin Bridge (MJS source-of-truth)   ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Subprocess bridge between `.opencode/plugins/spec-kit-skill-   ║
// ║          advisor.js` and the native Node advisor compat surface in     ║
// ║          mcp_server/dist/skill_advisor/compat/index.js. The plugin     ║
// ║          spawns this script with stdin JSON; this script writes a      ║
// ║          single stdout JSON response and exits.                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// F-020-D5-04: this file is the SOURCE-OF-TRUTH bridge. It lives outside the
// TypeScript build tree on purpose:
//   1. The OpenCode plugin host imports `.opencode/plugins/*.js` only — having
//      the bridge as a sibling .mjs keeps the plugin entrypoint count to 1
//      while letting the bridge use ESM and dynamic imports without TS
//      compile coordination on every plugin reload.
//   2. The bridge is a thin subprocess wrapper (parse stdin → call native
//      compat handlers → emit stdout JSON) and benefits from being editable
//      as plain JS for live diagnosis when the OpenCode plugin host misroutes.
//   3. Migrating to TS would require either (a) building this file into the
//      same dist tree the plugin watches, creating a chicken-and-egg with
//      cache-signature freshness (see F-020-D5-01), or (b) maintaining a
//      .ts → .mjs build step exclusive to this single file. Either path is
//      a larger packet than the source/dist boundary fixes here.
//
// Smoke tests asserting the named exports (`buildBrief` / `loadNativeAdvisorModules`)
// live at mcp_server/skill_advisor/tests/compat/plugin-bridge-smoke.vitest.ts
// and run as part of the standard test suite.
// Helper for packet 026/007/009. This file intentionally lives outside
// `.opencode/plugins/` so OpenCode discovers only real plugin entrypoints.

import { readFileSync } from 'node:fs';

const COMPAT_CONTRACT = JSON.parse(readFileSync(new URL('../skill_advisor/schemas/compat-contract.json', import.meta.url), 'utf8'));
const STATUS_VALUES = new Set(COMPAT_CONTRACT.statusValues);
const DISABLED_ENV = COMPAT_CONTRACT.disabledEnv;
const FORCE_LOCAL_ENV = COMPAT_CONTRACT.forceLocalEnv;
const DEFAULT_CONFIDENCE_THRESHOLD = COMPAT_CONTRACT.defaults.confidenceThreshold;
const DEFAULT_UNCERTAINTY_THRESHOLD = COMPAT_CONTRACT.defaults.uncertaintyThreshold;

function response(args) {
  return {
    brief: typeof args.brief === 'string' ? args.brief : null,
    status: STATUS_VALUES.has(args.status) ? args.status : 'fail_open',
    metadata: args.metadata && typeof args.metadata === 'object' ? args.metadata : {},
    ...(args.error ? { error: args.error } : {}),
  };
}

function failOpen(error) {
  return response({
    brief: null,
    status: 'fail_open',
    error,
    metadata: {},
  });
}

function errorCode(error) {
  const raw = error?.code ?? error?.name ?? 'UNKNOWN';
  const normalized = String(raw).toUpperCase().replace(/[^A-Z0-9_]/g, '_');
  return normalized || 'UNKNOWN';
}

async function readStdin() {
  let input = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) {
    input += chunk;
  }
  return input;
}

async function withStdoutSilenced(fn) {
  const forwarded = (...args) => {
    const rendered = args
      .map((value) => (typeof value === 'string' ? value : JSON.stringify(value)))
      .join(' ');
    process.stderr.write(`${rendered}\n`);
  };

  const original = {
    log: console.log,
    info: console.info,
    debug: console.debug,
    warn: console.warn,
  };

  console.log = forwarded;
  console.info = forwarded;
  console.debug = forwarded;
  console.warn = forwarded;

  try {
    return await fn();
  } finally {
    console.log = original.log;
    console.info = original.info;
    console.debug = original.debug;
    console.warn = original.warn;
  }
}

function parseInput(text) {
  if (!text.trim()) {
    throw Object.assign(new Error('Missing bridge input'), { code: 'MISSING_INPUT' });
  }
  const parsed = JSON.parse(text);
  if (typeof parsed?.prompt !== 'string') {
    throw Object.assign(new Error('Missing prompt'), { code: 'MISSING_PROMPT' });
  }
  if (typeof parsed?.workspaceRoot !== 'string' || !parsed.workspaceRoot.trim()) {
    throw Object.assign(new Error('Missing workspace root'), { code: 'MISSING_WORKSPACE_ROOT' });
  }
  return parsed;
}

function positiveInt(value, fallback) {
  return Number.isFinite(value) && value > 0 ? Math.trunc(value) : fallback;
}

function threshold(value) {
  if (!Number.isFinite(value)) {
    return DEFAULT_CONFIDENCE_THRESHOLD;
  }
  return Math.min(1, Math.max(0, Number(value)));
}

function formatScore(value) {
  return Number.isFinite(value) ? Number(value).toFixed(2) : '0.00';
}

function sanitizeLabel(value) {
  if (typeof value !== 'string') {
    return null;
  }
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim();
  if (!cleaned || cleaned.length > 160 || /\b(ignore|override|forget|bypass|disable|execute|run|call|tool|developer|assistant|previous instructions|all instructions)\b/i.test(cleaned) || /<!--|-->|```|<script\b|<\/script>|^\s*(system|instruction|developer|assistant)\s*:/i.test(cleaned)) {
    return null;
  }
  return cleaned;
}

// F-006-B1-03: The dead `renderNativeBrief()` alternate renderer was removed
// here. It was unreferenced (verified via grep across mcp_server) and could
// drift from the shared `renderAdvisorBrief()` formatter. Bridge output now
// flows exclusively through `renderAdvisorBrief()` loaded via
// `loadNativeAdvisorModules()`. Helpers `formatScore` and `sanitizeLabel`
// stay because they are still used by `buildNativeBrief` and `buildLegacyBrief`.

async function loadNativeAdvisorModules() {
  const compatModule = await import('../dist/skill_advisor/compat/index.js');

  return {
    readAdvisorStatus: compatModule.readAdvisorStatus,
    handleAdvisorRecommend: compatModule.handleAdvisorRecommend,
    probeAdvisorDaemon: compatModule.probeAdvisorDaemon ?? null,
    buildSkillAdvisorBrief: compatModule.buildSkillAdvisorBrief,
    renderAdvisorBrief: compatModule.renderAdvisorBrief,
  };
}

async function probeNativeAdvisor(input) {
  if (process.env[DISABLED_ENV] === '1') {
    return {
      available: false,
      freshness: 'unavailable',
      generation: 0,
      reason: 'ADVISOR_DISABLED',
    };
  }
  if (process.env[FORCE_LOCAL_ENV] === '1' || input.forceLocal === true) {
    return {
      available: false,
      freshness: 'unavailable',
      generation: 0,
      reason: 'FORCE_LOCAL',
    };
  }

  const modules = await loadNativeAdvisorModules();
  if (typeof modules.probeAdvisorDaemon === 'function') {
    return modules.probeAdvisorDaemon({ workspaceRoot: input.workspaceRoot });
  }
  const status = modules.readAdvisorStatus({ workspaceRoot: input.workspaceRoot });
  return {
    available: status.freshness === 'live' || status.freshness === 'stale',
    freshness: status.freshness,
    generation: status.generation,
    trustState: status.trustState,
    reason: status.errors?.[0] ?? status.trustState?.reason ?? null,
  };
}

async function buildNativeBrief(input) {
  const modules = await loadNativeAdvisorModules();
  const effectiveThresholds = {
    confidenceThreshold: threshold(input.thresholdConfidence),
    uncertaintyThreshold: DEFAULT_UNCERTAINTY_THRESHOLD,
    confidenceOnly: false,
  };
  const handlerResponse = await modules.handleAdvisorRecommend({
    workspaceRoot: input.workspaceRoot,
    prompt: input.prompt,
    options: {
      topK: 3,
      includeAbstainReasons: true,
      confidenceThreshold: effectiveThresholds.confidenceThreshold,
      uncertaintyThreshold: effectiveThresholds.uncertaintyThreshold,
    },
  });
  const parsed = JSON.parse(handlerResponse.content[0].text);
  const data = parsed.data;
  const maxTokens = positiveInt(input.maxTokens, 80);
  const top = Array.isArray(data?.recommendations) ? data.recommendations[0] : null;
  const skillLabel = sanitizeLabel(top?.skillId);
  const safeStatus = sanitizeLabel(top?.status);
  const redirectTo = sanitizeLabel(top?.redirectTo);
  const redirectFrom = Array.isArray(top?.redirectFrom)
    ? top.redirectFrom.map(sanitizeLabel).filter(Boolean)
    : [];
  const recommendations = Array.isArray(data?.recommendations)
    ? data.recommendations.map((recommendation) => ({
      skill: recommendation.skillId,
      kind: 'skill',
      confidence: recommendation.confidence,
      uncertainty: recommendation.uncertainty,
      passes_threshold: recommendation.confidence >= effectiveThresholds.confidenceThreshold
        && recommendation.uncertainty <= effectiveThresholds.uncertaintyThreshold,
      reason: null,
    }))
    : [];
  const rendered = modules.renderAdvisorBrief({
    status: recommendations.length > 0 ? 'ok' : 'skipped',
    freshness: data?.freshness ?? 'unavailable',
    brief: null,
    recommendations,
    diagnostics: null,
    metrics: {
      durationMs: 0,
      cacheHit: Boolean(data?.cache?.hit),
      subprocessInvoked: false,
      retriesAttempted: 0,
      recommendationCount: recommendations.length,
      tokenCap: maxTokens,
    },
    generatedAt: new Date().toISOString(),
    sharedPayload: {
      metadata: {
        skillLabel,
      },
    },
  }, {
    tokenCap: maxTokens,
    thresholdConfig: effectiveThresholds,
  });

  return response({
    brief: rendered,
    status: rendered ? 'ok' : 'skipped',
    metadata: {
      route: 'native',
      workspaceRoot: input.workspaceRoot,
      effectiveThresholds,
      freshness: data?.freshness ?? 'unavailable',
      generation: input.probe?.generation ?? 0,
      cacheHit: Boolean(data?.cache?.hit),
      recommendationCount: Array.isArray(data?.recommendations) ? data.recommendations.length : 0,
      tokenCap: maxTokens,
      skillLabel,
      status: safeStatus,
      redirectTo,
      redirectFrom,
    },
  });
}

async function buildLegacyBrief(input) {
  const { buildSkillAdvisorBrief, renderAdvisorBrief } = await loadNativeAdvisorModules();

  const maxTokens = positiveInt(input.maxTokens, 80);
  const effectiveThresholds = {
    confidenceThreshold: threshold(input.thresholdConfidence),
    uncertaintyThreshold: DEFAULT_UNCERTAINTY_THRESHOLD,
    confidenceOnly: false,
  };
  const result = await buildSkillAdvisorBrief(input.prompt, {
    workspaceRoot: input.workspaceRoot,
    runtime: 'codex',
    maxTokens,
    thresholdConfig: effectiveThresholds,
  });
  const brief = renderAdvisorBrief(result, {
    tokenCap: maxTokens,
    thresholdConfig: effectiveThresholds,
  });
  const top = result.recommendations?.[0] ?? null;

  return response({
    brief,
    status: result.status,
    metadata: {
      route: 'python',
      workspaceRoot: input.workspaceRoot,
      effectiveThresholds,
      freshness: result.freshness,
      durationMs: result.metrics.durationMs,
      cacheHit: result.metrics.cacheHit,
      subprocessInvoked: result.metrics.subprocessInvoked,
      recommendationCount: result.metrics.recommendationCount,
      tokenCap: result.metrics.tokenCap,
      skillLabel: sanitizeLabel(top?.skill),
    },
  });
}

async function buildBrief(input) {
  if (process.env[DISABLED_ENV] === '1') {
    // F-006-B1-02: Silent fail-open in disabled mode. Previously this branch
    // returned a model-visible `Advisor: disabled by ...` brief, but every
    // other runtime (Codex, Claude, Copilot, Gemini) fails open silently when
    // the disabled flag is set. Aligning OpenCode with the dominant pattern
    // removes the runtime-specific surface inconsistency. Callers can still
    // detect the disabled state via `metadata.route === 'disabled'`.
    return response({
      brief: null,
      status: 'skipped',
      metadata: {
        route: 'disabled',
        freshness: 'unavailable',
        recommendationCount: 0,
      },
    });
  }

  try {
    const probe = await probeNativeAdvisor(input);
    if (probe.available) {
      return await buildNativeBrief({ ...input, probe });
    }
    if (input.forceNative === true) {
      return failOpen(probe.reason || 'NATIVE_UNAVAILABLE');
    }
  } catch {
    if (input.forceNative === true) {
      return failOpen('NATIVE_PROBE_FAILED');
    }
  }

  return buildLegacyBrief(input);
}

async function main() {
  const payload = await withStdoutSilenced(async () => {
    try {
      const input = parseInput(await readStdin());
      return await buildBrief(input);
    } catch (error) {
      return failOpen(errorCode(error));
    }
  });

  process.stdout.write(JSON.stringify(payload));
}

main().catch((error) => {
  process.stdout.write(JSON.stringify(failOpen(errorCode(error))));
});

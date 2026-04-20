#!/usr/bin/env node

const STATUS_VALUES = new Set(['ok', 'skipped', 'degraded', 'fail_open']);
const DISABLED_ENV = 'SPECKIT_SKILL_ADVISOR_HOOK_DISABLED';
const FORCE_LOCAL_ENV = 'SPECKIT_SKILL_ADVISOR_FORCE_LOCAL';

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
    return 0.7;
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

function renderNativeBrief(data, maxTokens) {
  if (!data || (data.freshness !== 'live' && data.freshness !== 'stale')) {
    return null;
  }
  const recommendations = Array.isArray(data.recommendations) ? data.recommendations : [];
  const top = recommendations[0];
  const skillLabel = sanitizeLabel(top?.skillId);
  if (!skillLabel) {
    return null;
  }

  const parts = [
    `Advisor: ${data.freshness}; use ${skillLabel} ${formatScore(top.confidence)}/0.00 pass.`,
  ];
  const status = sanitizeLabel(top.status);
  if (status && status !== 'active') {
    parts.push(`status ${status}.`);
  }
  const redirectTo = sanitizeLabel(top.redirectTo);
  if (redirectTo) {
    parts.push(`redirect_to ${redirectTo}.`);
  }
  const redirectFrom = Array.isArray(top.redirectFrom)
    ? top.redirectFrom.map(sanitizeLabel).filter(Boolean).join(',')
    : null;
  if (redirectFrom) {
    parts.push(`redirect_from ${redirectFrom}.`);
  }

  const tokenCap = positiveInt(maxTokens, 80);
  return parts.join(' ').slice(0, tokenCap * 4).trim();
}

async function loadNativeAdvisorModules() {
  const compatModule = await import('../skill/system-spec-kit/mcp_server/dist/skill-advisor/compat/index.js');

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
  const handlerResponse = await modules.handleAdvisorRecommend({
    prompt: input.prompt,
    options: {
      topK: 3,
      includeAbstainReasons: true,
    },
  });
  const parsed = JSON.parse(handlerResponse.content[0].text);
  const data = parsed.data;
  const brief = renderNativeBrief(data, input.maxTokens);
  const top = Array.isArray(data?.recommendations) ? data.recommendations[0] : null;
  const skillLabel = sanitizeLabel(top?.skillId);
  const safeStatus = sanitizeLabel(top?.status);
  const redirectTo = sanitizeLabel(top?.redirectTo);
  const redirectFrom = Array.isArray(top?.redirectFrom)
    ? top.redirectFrom.map(sanitizeLabel).filter(Boolean)
    : [];

  return response({
    brief,
    status: brief ? 'ok' : 'skipped',
    metadata: {
      route: 'native',
      freshness: data?.freshness ?? 'unavailable',
      generation: input.probe?.generation ?? 0,
      cacheHit: Boolean(data?.cache?.hit),
      recommendationCount: Array.isArray(data?.recommendations) ? data.recommendations.length : 0,
      tokenCap: positiveInt(input.maxTokens, 80),
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
  const result = await buildSkillAdvisorBrief(input.prompt, {
    workspaceRoot: input.workspaceRoot,
    runtime: 'codex',
    maxTokens,
    thresholdConfig: {
      confidenceThreshold: threshold(input.thresholdConfidence),
      uncertaintyThreshold: 0.35,
      confidenceOnly: false,
    },
  });
  const brief = renderAdvisorBrief(result, { tokenCap: maxTokens });
  const top = result.recommendations?.[0] ?? null;

  return response({
    brief,
    status: result.status,
    metadata: {
      route: 'python',
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
    return response({
      brief: 'Advisor: disabled by SPECKIT_SKILL_ADVISOR_HOOK_DISABLED.',
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

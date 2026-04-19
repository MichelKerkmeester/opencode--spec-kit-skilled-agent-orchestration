#!/usr/bin/env node

const STATUS_VALUES = new Set(['ok', 'skipped', 'degraded', 'fail_open']);

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

async function buildBrief(input) {
  const [
    { buildSkillAdvisorBrief },
    { renderAdvisorBrief },
  ] = await Promise.all([
    import('../skill/system-spec-kit/mcp_server/dist/lib/skill-advisor/skill-advisor-brief.js'),
    import('../skill/system-spec-kit/mcp_server/dist/lib/skill-advisor/render.js'),
  ]);

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
      freshness: result.freshness,
      durationMs: result.metrics.durationMs,
      cacheHit: result.metrics.cacheHit,
      subprocessInvoked: result.metrics.subprocessInvoked,
      recommendationCount: result.metrics.recommendationCount,
      tokenCap: result.metrics.tokenCap,
      skillLabel: typeof top?.skill === 'string' ? top.skill : null,
    },
  });
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

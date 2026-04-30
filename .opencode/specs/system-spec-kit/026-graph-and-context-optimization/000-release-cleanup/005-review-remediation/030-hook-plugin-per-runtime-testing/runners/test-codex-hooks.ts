import {
  REPO_ROOT,
  TRIGGER_PROMPT,
  binaryPath,
  classify,
  detectSandbox,
  fileExists,
  hasAny,
  readSnippet,
  resolveHomePath,
  runCommand,
  isDirectRun,
  sandboxSkipResult,
  skipResult,
} from './common.ts';

import type { HookTestInput, HookTestResult, SandboxDetection } from './common.ts';

const CONFIG_PATH = '~/.codex/config.toml';
const HOOKS_PATH = '~/.codex/hooks.json';

export async function runCodexHookTests(sandbox: SandboxDetection = detectSandbox()): Promise<HookTestResult[]> {
  const input: HookTestInput = {
    runtime: 'codex',
    event: 'user-prompt-submit-freshness',
    prompt: TRIGGER_PROMPT,
  };
  const directInput = { ...input, event: `${input.event}-direct-smoke` };
  const liveInput = { ...input, event: `${input.event}-live-cli` };

  if (!fileExists(CONFIG_PATH) || !fileExists(HOOKS_PATH)) {
    const direct = skipResult(directInput, 'config_not_present', 'Codex config.toml and hooks.json must both exist', CONFIG_PATH);
    const live = sandbox.sandboxed
      ? sandboxSkipResult(liveInput, sandbox, 'Codex live CLI should execute outside the test sandbox', CONFIG_PATH)
      : skipResult(liveInput, 'config_not_present', 'Codex config.toml and hooks.json must both exist', CONFIG_PATH);
    return [direct, live];
  }

  const hook = await runCommand({
    command: 'node',
    args: ['.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js'],
    stdin: JSON.stringify({
      session_id: 'packet-043-codex',
      hook_event_name: 'UserPromptSubmit',
      cwd: REPO_ROOT,
      prompt: TRIGGER_PROMPT,
    }),
    env: {
      ...process.env,
      SPECKIT_CODEX_HOOK_TIMEOUT_MS: process.env.RUNTIME_HOOK_CODEX_TIMEOUT_MS ?? '1',
    },
  });
  const freshness = await runCommand({
    command: 'node',
    args: [
      '--input-type=module',
      '-e',
      [
        "import { smokeCheckCodexColdStartContext } from './.opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/lib/freshness-smoke-check.js';",
        'console.log(JSON.stringify(smokeCheckCodexColdStartContext()));',
      ].join(' '),
    ],
  });

  const hookSurface = `${hook.stdoutSnippet}\n${hook.stderrSnippet}`;
  const freshnessSurface = `${freshness.stdoutSnippet}\n${freshness.stderrSnippet}`;
  const directPassed = hook.exitCode === 0
    && hasAny(hookSurface, ['"stale":true', 'timeout-fallback', 'additionalContext'])
    && freshness.exitCode === 0
    && hasAny(freshnessSurface, ['"fresh"', '"latencyMs"', '"lastUpdateAt"']);

  const direct = classify(
    directInput,
    directPassed,
    directPassed ? 'Codex direct hook smoke exposed stale fallback and freshness fields' : 'Codex direct hook smoke missed stale fallback or freshness fields',
    'Codex direct prompt hook should expose stale timeout fallback and freshness smoke check should emit fresh/latency fields',
    {
      hook,
      files: {
        [resolveHomePath(CONFIG_PATH)]: readSnippet(CONFIG_PATH),
        [resolveHomePath(HOOKS_PATH)]: readSnippet(HOOKS_PATH),
      },
      observations: {
        freshness,
      },
    },
    [
      '.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:194',
      '.opencode/skill/system-spec-kit/mcp_server/hooks/codex/lib/freshness-smoke-check.ts:28',
    ],
    CONFIG_PATH,
  );

  if (sandbox.sandboxed) {
    return [
      direct,
      sandboxSkipResult(liveInput, sandbox, 'Codex live CLI should execute outside the test sandbox', CONFIG_PATH),
    ];
  }

  if (!binaryPath('codex')) {
    return [direct, skipResult(liveInput, 'binary_not_present', 'codex must be present in PATH', CONFIG_PATH)];
  }

  const cli = await runCommand({
    command: 'codex',
    args: [
      'exec',
      '--model',
      process.env.RUNTIME_HOOK_CODEX_MODEL ?? 'gpt-5.5',
      '-c',
      'model_reasoning_effort=low',
      '-c',
      'approval_policy=never',
      '--sandbox',
      'workspace-write',
      '-',
    ],
    stdin: `${TRIGGER_PROMPT} Reply with whether a Spec Kit Advisor or Session Context was visible.`,
  });
  const livePassed = cli.exitCode === 0;

  return [
    direct,
    classify(
      liveInput,
      livePassed,
      livePassed ? 'Codex CLI executed in operator shell' : 'Codex CLI failed before usable model execution',
      'Codex live CLI should execute with access to its session store',
      {
        cli,
        files: {
          [resolveHomePath(CONFIG_PATH)]: readSnippet(CONFIG_PATH),
          [resolveHomePath(HOOKS_PATH)]: readSnippet(HOOKS_PATH),
        },
      },
      ['~/.codex/hooks.json'],
      CONFIG_PATH,
    ),
  ];
}

if (isDirectRun(import.meta.url)) {
  runCodexHookTests().then((results) => {
    for (const result of results) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    }
  });
}

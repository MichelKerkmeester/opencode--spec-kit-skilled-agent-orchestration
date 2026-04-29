import {
  REPO_ROOT,
  TRIGGER_PROMPT,
  binaryPath,
  classify,
  fileExists,
  hasAny,
  readSnippet,
  resolveHomePath,
  runCommand,
  isDirectRun,
  skipResult,
} from './common.ts';

import type { HookTestInput, HookTestResult } from './common.ts';

const CONFIG_PATH = '~/.codex/config.toml';
const HOOKS_PATH = '~/.codex/hooks.json';

export async function runCodexHookTests(): Promise<HookTestResult[]> {
  const input: HookTestInput = {
    runtime: 'codex',
    event: 'user-prompt-submit-freshness',
    prompt: TRIGGER_PROMPT,
  };

  if (!binaryPath('codex')) {
    return [skipResult(input, 'binary_not_present', 'codex must be present in PATH', CONFIG_PATH)];
  }
  if (!fileExists(CONFIG_PATH) || !fileExists(HOOKS_PATH)) {
    return [skipResult(input, 'config_not_present', 'Codex config.toml and hooks.json must both exist', CONFIG_PATH)];
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
  const passed = cli.exitCode === 0
    && hook.exitCode === 0
    && hasAny(hookSurface, ['"stale":true', 'timeout-fallback', 'additionalContext'])
    && freshness.exitCode === 0
    && hasAny(freshnessSurface, ['"fresh"', '"latencyMs"', '"lastUpdateAt"']);

  return [classify(
    input,
    passed,
    passed ? 'Codex CLI ran; stale fallback and freshness smoke output observed' : 'Codex CLI failed or stale/freshness signal was missing',
    'Codex prompt hook should expose stale timeout fallback and freshness smoke check should emit fresh/latency fields',
    {
      cli,
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
  )];
}

if (isDirectRun(import.meta.url)) {
  runCodexHookTests().then((results) => {
    for (const result of results) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    }
  });
}

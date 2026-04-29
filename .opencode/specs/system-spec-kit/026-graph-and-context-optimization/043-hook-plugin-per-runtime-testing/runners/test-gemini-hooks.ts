import {
  REPO_ROOT,
  TRIGGER_PROMPT,
  binaryPath,
  classify,
  detectSandbox,
  fileExists,
  hasAny,
  readSnippet,
  runCommand,
  isDirectRun,
  sandboxSkipResult,
  skipResult,
} from './common.ts';

import type { HookTestInput, HookTestResult, SandboxDetection } from './common.ts';

const CONFIG_PATH = '.gemini/settings.json';

export async function runGeminiHookTests(sandbox: SandboxDetection = detectSandbox()): Promise<HookTestResult[]> {
  const input: HookTestInput = {
    runtime: 'gemini',
    event: 'before-agent-additional-context',
    prompt: TRIGGER_PROMPT,
  };
  const directInput = { ...input, event: `${input.event}-direct-smoke` };
  const liveInput = { ...input, event: `${input.event}-live-cli` };

  if (!fileExists(CONFIG_PATH)) {
    const direct = skipResult(directInput, 'config_not_present', 'Gemini settings.json must exist', CONFIG_PATH);
    const live = sandbox.sandboxed
      ? sandboxSkipResult(liveInput, sandbox, 'Gemini live CLI should execute outside the test sandbox', CONFIG_PATH)
      : skipResult(liveInput, 'config_not_present', 'Gemini settings.json must exist', CONFIG_PATH);
    return [direct, live];
  }

  const hook = await runCommand({
    command: 'node',
    args: ['.opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/user-prompt-submit.js'],
    stdin: JSON.stringify({
      session_id: 'packet-043-gemini',
      hook_event_name: 'BeforeAgent',
      cwd: REPO_ROOT,
      prompt: TRIGGER_PROMPT,
    }),
  });

  const hookSurface = `${hook.stdoutSnippet}\n${hook.stderrSnippet}`;
  const directPassed = hook.exitCode === 0
    && hasAny(hookSurface, ['hookSpecificOutput', 'additionalContext'])
    && hasAny(hookSurface, ['Advisor:', 'SKILL ROUTING:', 'skill']);

  const direct = classify(
    directInput,
    directPassed,
    directPassed ? 'Gemini direct hook smoke emitted additionalContext advisor signal' : 'Gemini direct hook smoke did not emit additionalContext advisor signal',
    'Gemini direct BeforeAgent hook should emit hookSpecificOutput.additionalContext containing an advisor brief',
    {
      hook,
      files: {
        [CONFIG_PATH]: readSnippet(CONFIG_PATH),
      },
    },
    ['.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:200'],
    CONFIG_PATH,
  );

  if (sandbox.sandboxed) {
    return [
      direct,
      sandboxSkipResult(liveInput, sandbox, 'Gemini live CLI should execute outside the test sandbox', CONFIG_PATH),
    ];
  }

  if (!binaryPath('gemini')) {
    return [direct, skipResult(liveInput, 'binary_not_present', 'gemini must be present in PATH', CONFIG_PATH)];
  }

  const cli = await runCommand({
    command: 'gemini',
    args: [
      `${TRIGGER_PROMPT} If a Spec Kit Advisor brief is visible, mention Advisor.`,
      '-m',
      process.env.RUNTIME_HOOK_GEMINI_MODEL ?? 'gemini-3.1-pro-preview',
      '-y',
      '-o',
      'text',
    ],
  });
  const livePassed = cli.exitCode === 0;

  return [
    direct,
    classify(
      liveInput,
      livePassed,
      livePassed ? 'Gemini CLI executed in operator shell' : 'Gemini CLI failed before usable model execution',
      'Gemini live CLI should execute with auth state visible to the process',
      {
        cli,
        files: {
          [CONFIG_PATH]: readSnippet(CONFIG_PATH),
        },
      },
      ['.gemini/settings.json'],
      CONFIG_PATH,
    ),
  ];
}

if (isDirectRun(import.meta.url)) {
  runGeminiHookTests().then((results) => {
    for (const result of results) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    }
  });
}

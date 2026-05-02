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

const CONFIG_PATH = '.claude/settings.local.json';

export async function runClaudeHookTests(sandbox: SandboxDetection = detectSandbox()): Promise<HookTestResult[]> {
  const input: HookTestInput = {
    runtime: 'claude',
    event: 'user-prompt-submit',
    prompt: TRIGGER_PROMPT,
  };
  const directInput = { ...input, event: `${input.event}-direct-smoke` };
  const liveInput = { ...input, event: `${input.event}-live-cli` };

  if (!fileExists(CONFIG_PATH)) {
    const direct = skipResult(directInput, 'config_not_present', 'Claude hook config must exist', CONFIG_PATH);
    const live = sandbox.sandboxed
      ? sandboxSkipResult(liveInput, sandbox, 'Claude live CLI should execute outside the test sandbox', CONFIG_PATH)
      : skipResult(liveInput, 'config_not_present', 'Claude hook config must exist', CONFIG_PATH);
    return [direct, live];
  }

  const hook = await runCommand({
    command: 'node',
    args: ['.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js'],
    stdin: JSON.stringify({
      session_id: 'packet-043-claude',
      hook_event_name: 'UserPromptSubmit',
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
    directPassed ? 'Claude direct hook smoke emitted additionalContext advisor signal' : 'Claude direct hook smoke did not emit additionalContext advisor signal',
    'Claude direct UserPromptSubmit hook should emit hookSpecificOutput.additionalContext containing an advisor brief',
    {
      hook,
      files: {
        [CONFIG_PATH]: readSnippet(CONFIG_PATH),
      },
    },
    ['.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:186'],
    CONFIG_PATH,
  );

  if (sandbox.sandboxed) {
    return [
      direct,
      sandboxSkipResult(liveInput, sandbox, 'Claude live CLI should execute outside the test sandbox', CONFIG_PATH),
    ];
  }

  if (!binaryPath('claude')) {
    return [direct, skipResult(liveInput, 'binary_not_present', 'claude must be present in PATH', CONFIG_PATH)];
  }

  const cli = await runCommand({
    command: 'claude',
    args: [
      '-p',
      `${TRIGGER_PROMPT} If an Advisor brief is visible, include the word Advisor in your answer.`,
      '--model',
      process.env.RUNTIME_HOOK_CLAUDE_MODEL ?? 'claude-sonnet-4-6',
      '--output-format',
      'text',
    ],
  });
  const livePassed = cli.exitCode === 0;

  return [
    direct,
    classify(
      liveInput,
      livePassed,
      livePassed ? 'Claude CLI executed in operator shell' : 'Claude CLI failed before usable model execution',
      'Claude live CLI should execute with configured UserPromptSubmit hook access',
      {
        cli,
        files: {
          [CONFIG_PATH]: readSnippet(CONFIG_PATH),
        },
      },
      ['.claude/settings.local.json'],
      CONFIG_PATH,
    ),
  ];
}

if (isDirectRun(import.meta.url)) {
  runClaudeHookTests().then((results) => {
    for (const result of results) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    }
  });
}

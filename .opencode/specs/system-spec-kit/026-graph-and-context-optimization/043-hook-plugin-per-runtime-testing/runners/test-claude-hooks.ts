import {
  REPO_ROOT,
  TRIGGER_PROMPT,
  binaryPath,
  classify,
  fileExists,
  hasAny,
  readSnippet,
  runCommand,
  isDirectRun,
  skipResult,
} from './common.ts';

import type { HookTestInput, HookTestResult } from './common.ts';

const CONFIG_PATH = '.claude/settings.local.json';

export async function runClaudeHookTests(): Promise<HookTestResult[]> {
  const input: HookTestInput = {
    runtime: 'claude',
    event: 'user-prompt-submit',
    prompt: TRIGGER_PROMPT,
  };

  if (!binaryPath('claude')) {
    return [skipResult(input, 'binary_not_present', 'claude must be present in PATH', CONFIG_PATH)];
  }
  if (!fileExists(CONFIG_PATH)) {
    return [skipResult(input, 'config_not_present', 'Claude hook config must exist', CONFIG_PATH)];
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
  const passed = cli.exitCode === 0
    && hook.exitCode === 0
    && hasAny(hookSurface, ['hookSpecificOutput', 'additionalContext'])
    && hasAny(hookSurface, ['Advisor:', 'SKILL ROUTING:', 'skill']);

  return [classify(
    input,
    passed,
    passed ? 'Claude CLI ran and additionalContext was emitted by the prompt hook' : 'Claude CLI failed or additionalContext advisor signal was missing',
    'Claude UserPromptSubmit should emit hookSpecificOutput.additionalContext containing an advisor brief',
    {
      cli,
      hook,
      files: {
        [CONFIG_PATH]: readSnippet(CONFIG_PATH),
      },
    },
    ['.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:186'],
    CONFIG_PATH,
  )];
}

if (isDirectRun(import.meta.url)) {
  runClaudeHookTests().then((results) => {
    for (const result of results) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    }
  });
}

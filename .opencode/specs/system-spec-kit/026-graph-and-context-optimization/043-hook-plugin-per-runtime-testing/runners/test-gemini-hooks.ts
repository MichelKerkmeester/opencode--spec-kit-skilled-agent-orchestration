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

const CONFIG_PATH = '.gemini/settings.json';

export async function runGeminiHookTests(): Promise<HookTestResult[]> {
  const input: HookTestInput = {
    runtime: 'gemini',
    event: 'before-agent-additional-context',
    prompt: TRIGGER_PROMPT,
  };

  if (!binaryPath('gemini')) {
    return [skipResult(input, 'binary_not_present', 'gemini must be present in PATH', CONFIG_PATH)];
  }
  if (!fileExists(CONFIG_PATH)) {
    return [skipResult(input, 'config_not_present', 'Gemini settings.json must exist', CONFIG_PATH)];
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
  const passed = cli.exitCode === 0
    && hook.exitCode === 0
    && hasAny(hookSurface, ['hookSpecificOutput', 'additionalContext'])
    && hasAny(hookSurface, ['Advisor:', 'SKILL ROUTING:', 'skill']);

  return [classify(
    input,
    passed,
    passed ? 'Gemini CLI ran and BeforeAgent hook emitted additionalContext' : 'Gemini CLI failed or additionalContext advisor signal was missing',
    'Gemini BeforeAgent should emit hookSpecificOutput.additionalContext containing an advisor brief',
    {
      cli,
      hook,
      files: {
        [CONFIG_PATH]: readSnippet(CONFIG_PATH),
      },
    },
    ['.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:200'],
    CONFIG_PATH,
  )];
}

if (isDirectRun(import.meta.url)) {
  runGeminiHookTests().then((results) => {
    for (const result of results) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    }
  });
}

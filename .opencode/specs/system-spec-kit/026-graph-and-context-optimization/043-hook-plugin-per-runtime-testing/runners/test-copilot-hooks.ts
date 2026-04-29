import { mkdtempSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

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
  snippet,
} from './common.ts';

import type { HookTestInput, HookTestResult } from './common.ts';

const CONFIG_PATH = '.github/hooks/superset-notify.json';

export async function runCopilotHookTests(): Promise<HookTestResult[]> {
  const input: HookTestInput = {
    runtime: 'copilot',
    event: 'user-prompt-submitted-next-prompt',
    prompt: TRIGGER_PROMPT,
  };

  if (!binaryPath('copilot')) {
    return [skipResult(input, 'binary_not_present', 'copilot must be present in PATH', CONFIG_PATH)];
  }
  if (!fileExists(CONFIG_PATH)) {
    return [skipResult(input, 'config_not_present', 'Copilot hook config must exist', CONFIG_PATH)];
  }

  const instructionsPath = join(mkdtempSync('/tmp/speckit-043-copilot-'), 'copilot-instructions.md');
  const cli = await runCommand({
    command: 'copilot',
    args: [
      '-p',
      `${TRIGGER_PROMPT} Reply with whether custom instructions mention Spec Kit.`,
      '--model',
      process.env.RUNTIME_HOOK_COPILOT_MODEL ?? 'gpt-5.4',
      '--no-ask-user',
    ],
    env: {
      ...process.env,
      SPECKIT_COPILOT_INSTRUCTIONS_PATH: instructionsPath,
    },
  });
  const hook = await runCommand({
    command: 'node',
    args: ['.opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js'],
    stdin: JSON.stringify({
      timestamp: Date.now(),
      cwd: REPO_ROOT,
      prompt: TRIGGER_PROMPT,
      session_id: 'packet-043-copilot',
    }),
    env: {
      ...process.env,
      SPECKIT_COPILOT_INSTRUCTIONS_PATH: instructionsPath,
    },
  });

  let instructions = '';
  try {
    instructions = readFileSync(instructionsPath, 'utf8');
  } catch {
    instructions = '';
  }

  const passed = cli.exitCode === 0
    && hook.exitCode === 0
    && hook.stdoutSnippet.trim() === '{}'
    && hasAny(instructions, ['SPEC-KIT-COPILOT-CONTEXT', 'Spec Kit Memory Auto-Generated Context', 'nextPromptFreshness: true']);

  return [classify(
    input,
    passed,
    passed ? 'Copilot CLI ran and managed instructions block refreshed for next prompt' : 'Copilot CLI failed or managed instructions block was missing after prompt hook',
    'Copilot hook should return {} and refresh managed custom instructions for NEXT prompt',
    {
      cli,
      hook,
      files: {
        [CONFIG_PATH]: readSnippet(CONFIG_PATH),
        [instructionsPath]: snippet(instructions),
      },
    },
    [
      '.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:233',
      '.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/custom-instructions.ts:122',
    ],
    CONFIG_PATH,
  )];
}

if (isDirectRun(import.meta.url)) {
  runCopilotHookTests().then((results) => {
    for (const result of results) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    }
  });
}

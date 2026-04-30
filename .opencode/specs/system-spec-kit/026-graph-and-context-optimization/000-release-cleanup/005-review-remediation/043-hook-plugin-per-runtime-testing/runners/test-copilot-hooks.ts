import { mkdtempSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

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
  snippet,
} from './common.ts';

import type { HookTestInput, HookTestResult, SandboxDetection } from './common.ts';

const CONFIG_PATH = '.github/hooks/superset-notify.json';

export async function runCopilotHookTests(sandbox: SandboxDetection = detectSandbox()): Promise<HookTestResult[]> {
  const input: HookTestInput = {
    runtime: 'copilot',
    event: 'user-prompt-submitted-next-prompt',
    prompt: TRIGGER_PROMPT,
  };
  const directInput = { ...input, event: `${input.event}-direct-smoke` };
  const liveInput = { ...input, event: `${input.event}-live-cli` };

  if (!fileExists(CONFIG_PATH)) {
    const direct = skipResult(directInput, 'config_not_present', 'Copilot hook config must exist', CONFIG_PATH);
    const live = sandbox.sandboxed
      ? sandboxSkipResult(liveInput, sandbox, 'Copilot live CLI should execute outside the test sandbox', CONFIG_PATH)
      : skipResult(liveInput, 'config_not_present', 'Copilot hook config must exist', CONFIG_PATH);
    return [direct, live];
  }

  const instructionsPath = join(mkdtempSync('/tmp/speckit-043-copilot-'), 'copilot-instructions.md');
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

  const directPassed = hook.exitCode === 0
    && hook.stdoutSnippet.trim() === '{}'
    && hasAny(instructions, ['SPEC-KIT-COPILOT-CONTEXT', 'Spec Kit Memory Auto-Generated Context', 'nextPromptFreshness: true']);

  const direct = classify(
    directInput,
    directPassed,
    directPassed ? 'Copilot direct hook smoke refreshed managed instructions for next prompt' : 'Copilot direct hook smoke did not refresh managed instructions',
    'Copilot direct hook should return {} and refresh managed custom instructions for NEXT prompt',
    {
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
  );

  if (sandbox.sandboxed) {
    return [
      direct,
      sandboxSkipResult(liveInput, sandbox, 'Copilot live CLI should execute outside the test sandbox', CONFIG_PATH),
    ];
  }

  if (!binaryPath('copilot')) {
    return [direct, skipResult(liveInput, 'binary_not_present', 'copilot must be present in PATH', CONFIG_PATH)];
  }

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
  const livePassed = cli.exitCode === 0;

  return [
    direct,
    classify(
      liveInput,
      livePassed,
      livePassed ? 'Copilot CLI executed in operator shell' : 'Copilot CLI failed before usable model execution',
      'Copilot live CLI should execute with keychain access',
      {
        cli,
        files: {
          [CONFIG_PATH]: readSnippet(CONFIG_PATH),
          [instructionsPath]: snippet(instructions),
        },
      },
      ['.github/hooks/superset-notify.json'],
      CONFIG_PATH,
    ),
  ];
}

if (isDirectRun(import.meta.url)) {
  runCopilotHookTests().then((results) => {
    for (const result of results) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    }
  });
}

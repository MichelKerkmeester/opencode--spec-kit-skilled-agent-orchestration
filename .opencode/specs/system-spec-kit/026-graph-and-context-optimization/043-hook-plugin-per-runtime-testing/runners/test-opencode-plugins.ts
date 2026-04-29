import SpecKitSkillAdvisorPlugin from '../../../../../plugins/spec-kit-skill-advisor.js';

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

const CONFIG_PATH = '.opencode/plugins/spec-kit-skill-advisor.js';

export async function runOpenCodePluginTests(): Promise<HookTestResult[]> {
  const input: HookTestInput = {
    runtime: 'opencode',
    event: 'plugin-system-transform',
    prompt: TRIGGER_PROMPT,
  };

  if (!binaryPath('opencode')) {
    return [skipResult(input, 'binary_not_present', 'opencode must be present in PATH', CONFIG_PATH)];
  }
  if (!fileExists(CONFIG_PATH)) {
    return [skipResult(input, 'config_not_present', 'OpenCode plugin file must exist', CONFIG_PATH)];
  }

  const cli = await runCommand({
    command: 'opencode',
    args: [
      'run',
      '--model',
      process.env.RUNTIME_HOOK_OPENCODE_MODEL ?? 'opencode-go/deepseek-v4-pro',
      '--agent',
      'general',
      '--variant',
      process.env.RUNTIME_HOOK_OPENCODE_VARIANT ?? 'high',
      '--format',
      'json',
      '--dir',
      REPO_ROOT,
      `${TRIGGER_PROMPT} Reply with whether a Spec Kit Advisor system transform is visible.`,
    ],
  });

  const output = { system: [] as string[] };
  const hooks = await SpecKitSkillAdvisorPlugin(
    { directory: REPO_ROOT },
    {
      bridgeTimeoutMs: 3000,
      maxTokens: 80,
    },
  );
  await hooks['experimental.chat.system.transform']?.(
    {
      sessionID: 'packet-043-opencode',
      prompt: TRIGGER_PROMPT,
      properties: { prompt: TRIGGER_PROMPT },
    },
    output,
  );
  const transformed = output.system.join('\n');
  const passed = cli.exitCode === 0 && hasAny(transformed, ['Advisor:', 'SKILL ROUTING:', 'skill']);

  return [classify(
    input,
    passed,
    passed ? 'OpenCode CLI ran and plugin transformed system prompt with advisor context' : 'OpenCode CLI failed or plugin transform did not append advisor context',
    'OpenCode plugin should append advisor brief through experimental.chat.system.transform',
    {
      cli,
      files: {
        [CONFIG_PATH]: readSnippet(CONFIG_PATH),
      },
      observations: {
        transformedSystem: transformed,
      },
    },
    [
      '.opencode/plugins/spec-kit-skill-advisor.js:627',
      '.opencode/plugins/spec-kit-skill-advisor.js:663',
    ],
    CONFIG_PATH,
  )];
}

if (isDirectRun(import.meta.url)) {
  runOpenCodePluginTests().then((results) => {
    for (const result of results) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    }
  });
}

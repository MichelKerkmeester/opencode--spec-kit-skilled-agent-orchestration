import SpecKitSkillAdvisorPlugin from '../../../../../../../plugins/spec-kit-skill-advisor.js';

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

const CONFIG_PATH = '.opencode/plugins/spec-kit-skill-advisor.js';

export async function runOpenCodePluginTests(sandbox: SandboxDetection = detectSandbox()): Promise<HookTestResult[]> {
  const input: HookTestInput = {
    runtime: 'opencode',
    event: 'plugin-system-transform',
    prompt: TRIGGER_PROMPT,
  };
  const directInput = { ...input, event: `${input.event}-direct-smoke` };
  const liveInput = { ...input, event: `${input.event}-live-cli` };

  if (!fileExists(CONFIG_PATH)) {
    const direct = skipResult(directInput, 'config_not_present', 'OpenCode plugin file must exist', CONFIG_PATH);
    const live = sandbox.sandboxed
      ? sandboxSkipResult(liveInput, sandbox, 'OpenCode live CLI should execute outside the test sandbox', CONFIG_PATH)
      : skipResult(liveInput, 'config_not_present', 'OpenCode plugin file must exist', CONFIG_PATH);
    return [direct, live];
  }

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
  const directPassed = hasAny(transformed, ['Advisor:', 'SKILL ROUTING:', 'skill']);

  const direct = classify(
    directInput,
    directPassed,
    directPassed ? 'OpenCode direct plugin smoke transformed system prompt with advisor context' : 'OpenCode direct plugin smoke did not append advisor context',
    'OpenCode direct plugin should append advisor brief through experimental.chat.system.transform',
    {
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
  );

  if (sandbox.sandboxed) {
    return [
      direct,
      sandboxSkipResult(liveInput, sandbox, 'OpenCode live CLI should execute outside the test sandbox', CONFIG_PATH),
    ];
  }

  if (!binaryPath('opencode')) {
    return [direct, skipResult(liveInput, 'binary_not_present', 'opencode must be present in PATH', CONFIG_PATH)];
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
  const livePassed = cli.exitCode === 0;

  return [
    direct,
    classify(
      liveInput,
      livePassed,
      livePassed ? 'OpenCode CLI executed in operator shell' : 'OpenCode CLI failed before usable model execution',
      'OpenCode live CLI should execute with writable user state',
      {
        cli,
        files: {
          [CONFIG_PATH]: readSnippet(CONFIG_PATH),
        },
      },
      ['.opencode/plugins/spec-kit-skill-advisor.js'],
      CONFIG_PATH,
    ),
  ];
}

if (isDirectRun(import.meta.url)) {
  runOpenCodePluginTests().then((results) => {
    for (const result of results) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    }
  });
}

// ───────────────────────────────────────────────────────────────────
// MODULE: Matrix Runner OpenCode Adapter
// ───────────────────────────────────────────────────────────────────

import { runCliAdapter, type AdapterInput, type AdapterResult } from './adapter-common.js';

const DEFAULT_MODEL = process.env.MATRIX_OPENCODE_MODEL ?? 'opencode-go/deepseek-v4-pro';
const DEFAULT_VARIANT = process.env.MATRIX_OPENCODE_VARIANT ?? 'high';
const DEFAULT_AGENT = process.env.MATRIX_OPENCODE_AGENT ?? 'general';

export async function adapterCliOpencode(input: AdapterInput): Promise<AdapterResult> {
  return runCliAdapter({
    adapterName: 'cli-opencode',
    input,
    invocation: {
      command: 'opencode',
      args: [
        'run',
        '--model',
        DEFAULT_MODEL,
        '--agent',
        DEFAULT_AGENT,
        '--variant',
        DEFAULT_VARIANT,
        '--format',
        'json',
        '--dir',
        input.workingDir,
        input.promptTemplate,
      ],
    },
  });
}


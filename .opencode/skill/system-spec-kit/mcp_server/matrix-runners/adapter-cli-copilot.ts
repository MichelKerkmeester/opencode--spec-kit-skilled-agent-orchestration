// ───────────────────────────────────────────────────────────────────
// MODULE: Matrix Runner Copilot Adapter
// ───────────────────────────────────────────────────────────────────

import { runCliAdapter, type AdapterInput, type AdapterResult } from './adapter-common.js';

const DEFAULT_MODEL = process.env.MATRIX_COPILOT_MODEL ?? 'gpt-5.4';

export async function adapterCliCopilot(input: AdapterInput): Promise<AdapterResult> {
  return runCliAdapter({
    adapterName: 'cli-copilot',
    input,
    invocation: {
      command: 'copilot',
      args: [
        '-p',
        input.promptTemplate,
        '--model',
        DEFAULT_MODEL,
        '--allow-all-tools',
        '--no-ask-user',
      ],
    },
  });
}


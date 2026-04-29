// ───────────────────────────────────────────────────────────────────
// MODULE: Matrix Runner Copilot Adapter
// ───────────────────────────────────────────────────────────────────

import { runCliAdapter } from './adapter-common.js';

import type { AdapterInput, AdapterResult } from './adapter-common.js';

const DEFAULT_MODEL = process.env.MATRIX_COPILOT_MODEL ?? 'gpt-5.4';

/** Run a matrix cell through the Copilot CLI adapter. */
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

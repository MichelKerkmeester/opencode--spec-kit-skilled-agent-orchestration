// ───────────────────────────────────────────────────────────────────
// MODULE: Matrix Runner Gemini Adapter
// ───────────────────────────────────────────────────────────────────

import { runCliAdapter } from './adapter-common.js';

import type { AdapterInput, AdapterResult } from './adapter-common.js';

const DEFAULT_MODEL = process.env.MATRIX_GEMINI_MODEL ?? 'gemini-3.1-pro-preview';

/** Run a matrix cell through the Gemini CLI adapter. */
export async function adapterCliGemini(input: AdapterInput): Promise<AdapterResult> {
  return runCliAdapter({
    adapterName: 'cli-gemini',
    input,
    invocation: {
      command: 'gemini',
      args: [
        input.promptTemplate,
        '-m',
        DEFAULT_MODEL,
        '-y',
        '-o',
        'text',
      ],
    },
  });
}

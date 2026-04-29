// ───────────────────────────────────────────────────────────────────
// MODULE: Matrix Runner Gemini Adapter
// ───────────────────────────────────────────────────────────────────

import { runCliAdapter, type AdapterInput, type AdapterResult } from './adapter-common.js';

const DEFAULT_MODEL = process.env.MATRIX_GEMINI_MODEL ?? 'gemini-3.1-pro-preview';

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


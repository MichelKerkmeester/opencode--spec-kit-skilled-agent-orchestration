// ───────────────────────────────────────────────────────────────────
// MODULE: Matrix Runner Codex Adapter
// ───────────────────────────────────────────────────────────────────

import { runCliAdapter } from './adapter-common.js';

import type { AdapterInput, AdapterResult } from './adapter-common.js';

const DEFAULT_MODEL = process.env.MATRIX_CODEX_MODEL ?? 'gpt-5.5';
const DEFAULT_REASONING_EFFORT = process.env.MATRIX_CODEX_REASONING_EFFORT ?? 'high';
const DEFAULT_SERVICE_TIER = process.env.MATRIX_CODEX_SERVICE_TIER ?? 'fast';

/** Run a matrix cell through the Codex CLI adapter. */
export async function adapterCliCodex(input: AdapterInput): Promise<AdapterResult> {
  return runCliAdapter({
    adapterName: 'cli-codex',
    input,
    invocation: {
      command: 'codex',
      args: [
        'exec',
        '--model',
        DEFAULT_MODEL,
        '-c',
        `model_reasoning_effort=${DEFAULT_REASONING_EFFORT}`,
        '-c',
        `service_tier=${DEFAULT_SERVICE_TIER}`,
        '-c',
        'approval_policy=never',
        '--sandbox',
        'workspace-write',
        '-',
      ],
      stdin: input.promptTemplate,
    },
  });
}

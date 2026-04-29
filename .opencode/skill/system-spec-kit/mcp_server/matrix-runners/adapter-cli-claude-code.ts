// ───────────────────────────────────────────────────────────────────
// MODULE: Matrix Runner Claude Code Adapter
// ───────────────────────────────────────────────────────────────────

import { runCliAdapter, type AdapterInput, type AdapterResult } from './adapter-common.js';

const DEFAULT_MODEL = process.env.MATRIX_CLAUDE_CODE_MODEL ?? 'claude-sonnet-4-6';

export async function adapterCliClaudeCode(input: AdapterInput): Promise<AdapterResult> {
  return runCliAdapter({
    adapterName: 'cli-claude-code',
    input,
    invocation: {
      command: 'claude',
      args: [
        '-p',
        input.promptTemplate,
        '--model',
        DEFAULT_MODEL,
        '--permission-mode',
        'acceptEdits',
      ],
    },
  });
}


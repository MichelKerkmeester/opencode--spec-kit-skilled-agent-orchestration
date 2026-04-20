// ───────────────────────────────────────────────────────────────
// MODULE: advisor_validate Tool Descriptor
// ───────────────────────────────────────────────────────────────

import type { ToolDefinition } from '../../tool-schemas.js';

export const advisorValidateTool: ToolDefinition = {
  name: 'advisor_validate',
  description: '[L8:Skill Advisor] Run the native advisor regression bundle and return prompt-safe corpus, holdout, parity, safety, and latency slices. Accepts an optional skillSlug filter; null or omitted validates all skills.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      skillSlug: { type: ['string', 'null'], minLength: 1, description: 'Optional skill slug to validate; null or omitted validates all skills.' },
    },
  },
};

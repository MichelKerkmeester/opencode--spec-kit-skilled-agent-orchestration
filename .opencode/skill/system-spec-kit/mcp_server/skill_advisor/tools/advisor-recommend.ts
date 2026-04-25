// ───────────────────────────────────────────────────────────────
// MODULE: advisor_recommend Tool Descriptor
// ───────────────────────────────────────────────────────────────

import type { ToolDefinition } from '../../tool-schemas.js';

export const advisorRecommendTool: ToolDefinition = {
  name: 'advisor_recommend',
  description: '[L8:Skill Advisor] Recommend skills for a prompt using the native TypeScript advisor scorer. Returns prompt-safe recommendations, lane attribution, lifecycle redirect metadata, cache state, and freshness trust. Raw prompts are never echoed.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      prompt: { type: 'string', minLength: 1, maxLength: 10_000, description: 'Prompt to route through the native skill advisor. The prompt is HMAC-keyed for cache lookup and is not returned.' },
      options: {
        type: 'object',
        additionalProperties: false,
        properties: {
          topK: { type: 'number', minimum: 1, maximum: 10, description: 'Maximum number of recommendations to return.' },
          includeAttribution: { type: 'boolean', description: 'Include per-lane score breakdown and evidence snippets.' },
          includeAbstainReasons: { type: 'boolean', description: 'Include prompt-safe abstain reasons when no recommendation passes thresholds.' },
        },
      },
    },
    required: ['prompt'],
  },
};

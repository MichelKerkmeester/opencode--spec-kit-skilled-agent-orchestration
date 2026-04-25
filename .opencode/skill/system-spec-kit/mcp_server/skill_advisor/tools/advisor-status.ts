// ───────────────────────────────────────────────────────────────
// MODULE: advisor_status Tool Descriptor
// ───────────────────────────────────────────────────────────────

import type { ToolDefinition } from '../../tool-schemas.js';

export const advisorStatusTool: ToolDefinition = {
  name: 'advisor_status',
  description: '[L8:Skill Advisor] Report native advisor freshness, skill-graph generation, trust state, lane weights, and daemon availability without exposing prompt content.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      workspaceRoot: { type: 'string', minLength: 1, description: 'Workspace root used to locate skill graph generation and daemon freshness state.' },
    },
    required: ['workspaceRoot'],
  },
};

// ───────────────────────────────────────────────────────────────
// MODULE: advisor_rebuild Tool Descriptor
// ───────────────────────────────────────────────────────────────

import type { ToolDefinition } from '../../tool-schemas.js';

/** MCP tool descriptor for explicit advisor graph rebuilds. */
export const advisorRebuildTool: ToolDefinition = {
  name: 'advisor_rebuild',
  description: '[L8:Skill Advisor] Explicitly rebuild the native advisor skill graph from checked-in skill metadata. Use when advisor_status reports stale, absent, or unavailable; pass force:true to rebuild even when status is live.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      force: { type: 'boolean', default: false, description: 'Rebuild even when advisor_status reports live.' },
    },
  },
};

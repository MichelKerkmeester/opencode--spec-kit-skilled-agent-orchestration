// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Scan Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for skill_graph_scan — indexes skill metadata.

import { resolve } from 'node:path';
import { indexSkillMetadata } from '../../lib/skill-graph/skill-graph-db.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface ScanArgs {
  skillsRoot?: string;
}

type HandlerResponse = { content: Array<{ type: string; text: string }> };

// ───────────────────────────────────────────────────────────────
// 2. HANDLER
// ───────────────────────────────────────────────────────────────

/** Handle skill_graph_scan tool call */
export async function handleSkillGraphScan(
  args: ScanArgs,
): Promise<HandlerResponse> {
  try {
    const skillsRoot = resolve(process.cwd(), args.skillsRoot ?? '.opencode/skill');
    const scanResult = indexSkillMetadata(skillsRoot);

    return okResponse({
      skillsRoot,
      ...scanResult,
    });
  } catch (err: unknown) {
    return errorResponse(
      `Skill graph scan failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

// ───────────────────────────────────────────────────────────────
// 3. RESPONSE HELPERS
// ───────────────────────────────────────────────────────────────

function okResponse(data: Record<string, unknown>): HandlerResponse {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data }),
    }],
  };
}

function errorResponse(error: string): HandlerResponse {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'error', error }),
    }],
  };
}

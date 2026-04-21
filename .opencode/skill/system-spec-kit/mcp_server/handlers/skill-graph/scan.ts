// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Scan Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for skill_graph_scan — indexes skill metadata.

import { resolve } from 'node:path';
import { indexSkillMetadata } from '../../lib/skill-graph/skill-graph-db.js';
import { publishSkillGraphGeneration } from '../../skill-advisor/lib/freshness/generation.js';

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
    const cwd = process.cwd();
    const skillsRoot = resolve(cwd, args.skillsRoot ?? '.opencode/skill');

    // Workspace escape guard: resolved path must stay under cwd
    if (!skillsRoot.startsWith(cwd + '/') && skillsRoot !== cwd) {
      return errorResponse(
        `Refusing to scan outside workspace: ${skillsRoot} is not under ${cwd}`,
      );
    }

    const scanResult = indexSkillMetadata(skillsRoot);
    publishSkillGraphGeneration({
      workspaceRoot: cwd,
      changedPaths: [skillsRoot],
      reason: 'skill_graph_scan',
      state: 'live',
    });

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

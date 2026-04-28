// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Scan Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for skill_graph_scan — indexes skill metadata.

import { resolve } from 'node:path';
import { indexSkillMetadata } from '../../lib/skill-graph/skill-graph-db.js';
import type { MCPCallerContext } from '../../lib/context/caller-context.js';
import { requireTrustedCaller } from '../../skill_advisor/lib/auth/trusted-caller.js';
import { computeAdvisorSourceSignature } from '../../skill_advisor/lib/freshness.js';
import { publishSkillGraphGeneration } from '../../skill_advisor/lib/freshness/generation.js';
import { errorResponse, okResponse, redactDiagnosticText } from './response-envelope.js';

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
  callerContext?: MCPCallerContext | null,
): Promise<HandlerResponse> {
  try {
    const trustedCaller = requireTrustedCaller(callerContext);
    if (!trustedCaller.ok) {
      return errorResponse(trustedCaller.error, trustedCaller.code);
    }

    const cwd = process.cwd();
    const skillsRoot = resolve(cwd, args.skillsRoot ?? '.opencode/skill');

    // Workspace escape guard: resolved path must stay under cwd
    if (!skillsRoot.startsWith(cwd + '/') && skillsRoot !== cwd) {
      return errorResponse(
        `Refusing to scan outside workspace: ${redactDiagnosticText(skillsRoot)} is not under ${redactDiagnosticText(cwd)}`,
      );
    }

    const scanResult = indexSkillMetadata(skillsRoot);
    const sourceSignature = computeAdvisorSourceSignature(cwd);
    publishSkillGraphGeneration({
      workspaceRoot: cwd,
      changedPaths: [skillsRoot],
      reason: 'skill_graph_scan',
      state: 'live',
      sourceSignature,
    });

    return okResponse({
      skillsRoot,
      ...scanResult,
    });
  } catch (err: unknown) {
    return errorResponse(
      `Skill graph scan failed: ${redactDiagnosticText(err instanceof Error ? err.message : String(err))}`,
    );
  }
}

// ───────────────────────────────────────────────────────────────
// MODULE: CocoIndex Re-index Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for ccc_reindex — triggers incremental re-indexing.

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

export interface ReindexArgs {
  full?: boolean;
}

/** Handle ccc_reindex tool call */
export async function handleCccReindex(args: ReindexArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    const projectRoot = process.cwd();
    const cccBin = resolve(projectRoot, '.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc');

    if (!existsSync(cccBin)) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'error',
            error: 'CocoIndex binary not found. Install: bash .opencode/skill/mcp-coco-index/scripts/install.sh',
          }),
        }],
      };
    }

    const startTime = Date.now();
    const execArgs = args.full ? ['index', '--full'] : ['index'];

    try {
      const output = execFileSync(cccBin, execArgs, {
        cwd: projectRoot,
        timeout: 120_000,
        encoding: 'utf-8',
        env: { ...process.env, COCOINDEX_REFRESH_INDEX: 'false' },
      });

      const durationMs = Date.now() - startTime;

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'ok',
            data: {
              mode: args.full ? 'full' : 'incremental',
              durationMs,
              output: output.slice(0, 2000),
            },
          }, null, 2),
        }],
      };
    } catch (execErr: unknown) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            status: 'error',
            error: `Re-index failed: ${execErr instanceof Error ? execErr.message : String(execErr)}`,
          }),
        }],
      };
    }
  } catch (err: unknown) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          error: `ccc_reindex failed: ${err instanceof Error ? err.message : String(err)}`,
        }),
      }],
    };
  }
}

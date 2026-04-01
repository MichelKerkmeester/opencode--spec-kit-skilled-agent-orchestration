// ───────────────────────────────────────────────────────────────
// MODULE: CocoIndex Status Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for ccc_status — reports CocoIndex availability and stats.

import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

/** Handle ccc_status tool call */
export async function handleCccStatus(): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    const projectRoot = process.cwd();
    const cccBin = resolve(projectRoot, '.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc');
    const indexDir = resolve(projectRoot, '.cocoindex_code');

    const available = existsSync(cccBin);

    let indexSize: number | null = null;
    let indexExists = false;
    if (existsSync(indexDir)) {
      indexExists = true;
      try { indexSize = statSync(indexDir).size; } catch { /* ok */ }
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'ok',
          data: {
            available,
            binaryPath: cccBin,
            indexExists,
            indexSize,
            recommendation: !available
              ? 'Install CocoIndex: bash .opencode/skill/mcp-coco-index/scripts/install.sh'
              : !indexExists
                ? 'Run ccc_reindex to build the initial index'
                : 'CocoIndex is ready. Use mcp__cocoindex_code__search for semantic queries.',
          },
        }, null, 2),
      }],
    };
  } catch (err: unknown) {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          status: 'error',
          error: `ccc_status failed: ${err instanceof Error ? err.message : String(err)}`,
        }),
      }],
    };
  }
}

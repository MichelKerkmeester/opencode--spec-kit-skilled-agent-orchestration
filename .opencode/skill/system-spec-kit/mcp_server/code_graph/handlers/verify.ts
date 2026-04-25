// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Verify Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_verify — executes the persisted
// gold-query battery against the current code graph.

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { setLastGoldVerification } from '../lib/code-graph-db.js';
import {
  executeBattery,
  loadGoldBattery,
  type GoldBattery,
} from '../lib/gold-query-verifier.js';
import { ensureCodeGraphReady } from '../lib/ensure-ready.js';
import { buildReadinessBlock } from '../lib/readiness-contract.js';
import { handleCodeGraphQuery } from './query.js';

export type VerifyCategory =
  | 'mcp-tool'
  | 'cross-module'
  | 'exported-type'
  | 'regression-detection';

export interface VerifyArgs {
  rootDir?: string;
  batteryPath?: string;
  category?: VerifyCategory;
  failFast?: boolean;
  includeDetails?: boolean;
  persistBaseline?: boolean;
  allowInlineIndex?: boolean;
}

const DEFAULT_GOLD_BATTERY_PATH = fileURLToPath(new URL(
  '../../../../../specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/assets/code-graph-gold-queries.json',
  import.meta.url,
));

function buildResponse(payload: object): { content: Array<{ type: 'text'; text: string }> } {
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(payload, null, 2),
    }],
  };
}

function applyCategoryFilter(
  battery: GoldBattery,
  category: VerifyCategory | undefined,
): GoldBattery {
  if (!category) {
    return battery;
  }

  const filteredQueries = battery.queries.filter((query) => query.category === category);
  if (filteredQueries.length === 0) {
    throw new Error(`Gold battery does not contain any queries for category "${category}"`);
  }

  return {
    ...battery,
    queries: filteredQueries,
  };
}

export async function handleCodeGraphVerify(
  args: VerifyArgs,
): Promise<{ content: { type: 'text'; text: string }[] }> {
  const rootDir = resolve(args.rootDir ?? process.cwd());

  try {
    const readyState = await ensureCodeGraphReady(rootDir, {
      allowInlineIndex: args.allowInlineIndex ?? false,
      allowInlineFullScan: false,
    });
    const readiness = buildReadinessBlock(readyState);

    if (readyState.freshness !== 'fresh') {
      return buildResponse({
        status: 'blocked',
        readiness,
      });
    }

    const batteryPath = resolve(args.batteryPath ?? DEFAULT_GOLD_BATTERY_PATH);
    const battery = applyCategoryFilter(loadGoldBattery(batteryPath), args.category);
    const result = {
      ...(await executeBattery(battery, handleCodeGraphQuery, {
        failFast: args.failFast,
        includeDetails: args.includeDetails,
      })),
      batteryPath,
    };

    if (args.persistBaseline === true) {
      setLastGoldVerification(result);
    }

    return buildResponse({
      status: 'ok',
      result,
    });
  } catch (error: unknown) {
    return buildResponse({
      status: 'error',
      error: `code_graph_verify failed: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Verify Handler
// ───────────────────────────────────────────────────────────────
// MCP tool handler for code_graph_verify — executes the persisted
// gold-query battery against the current code graph.

import { realpathSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';

import { setLastGoldVerification } from '../lib/code-graph-db.js';
import {
  DEFAULT_GOLD_BATTERY_PATH,
  executeBattery,
  loadGoldBattery,
  type GoldBattery,
} from '../lib/gold-query-verifier.js';
import { ensureCodeGraphReady } from '../lib/ensure-ready.js';
import { buildReadinessBlock } from '../lib/readiness-contract.js';
import { canonicalizeWorkspacePaths, isWithinWorkspace } from '../lib/utils/workspace-path.js';
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

const GOLD_BATTERY_FILENAME = 'code-graph-gold-queries.json';

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

function isAllowlistedBatteryPath(canonicalWorkspace: string, canonicalBatteryPath: string): boolean {
  const allowlistedBases = [
    resolve(canonicalWorkspace, '.opencode/specs'),
    resolve(canonicalWorkspace, '.opencode/skill/system-spec-kit/mcp_server'),
  ];

  return allowlistedBases.some((basePath) => {
    const candidateRelative = relative(basePath, canonicalBatteryPath);
    if (
      candidateRelative.length === 0
      || candidateRelative.startsWith('..')
      || isAbsolute(candidateRelative)
    ) {
      return false;
    }

    const segments = candidateRelative.split(sep);
    const assetDir = segments[segments.length - 2];
    const fileName = segments[segments.length - 1];
    return segments.length >= 2
      && assetDir === 'assets'
      && fileName === GOLD_BATTERY_FILENAME;
  });
}

type ResolveVerifyPathsResult =
  | { readonly ok: true; readonly canonicalRootDir: string; readonly canonicalBatteryPath: string }
  | { readonly ok: false; readonly error: string };

function resolveVerifyPaths(args: VerifyArgs): ResolveVerifyPathsResult {
  const resolvedRootDir = resolve(args.rootDir ?? process.cwd());
  const resolvedBatteryPath = resolve(args.batteryPath ?? DEFAULT_GOLD_BATTERY_PATH);

  const canonical = canonicalizeWorkspacePaths(resolvedRootDir);
  if (!canonical) {
    return {
      ok: false,
      error: `rootDir path is invalid or contains a broken symlink: ${resolvedRootDir}`,
    };
  }
  const { canonicalWorkspace, canonicalRootDir } = canonical;

  if (!isWithinWorkspace(canonicalWorkspace, canonicalRootDir)) {
    return {
      ok: false,
      error: `rootDir must stay within the workspace root: ${canonicalWorkspace}`,
    };
  }

  let canonicalBatteryPath: string;
  try {
    canonicalBatteryPath = realpathSync(resolvedBatteryPath);
  } catch {
    return {
      ok: false,
      error: `batteryPath is invalid or contains a broken symlink: ${resolvedBatteryPath}`,
    };
  }

  if (!isAllowlistedBatteryPath(canonicalWorkspace, canonicalBatteryPath)) {
    return {
      ok: false,
      error: `batteryPath must stay within approved code-graph asset roots under: ${canonicalWorkspace}`,
    };
  }

  return {
    ok: true,
    canonicalRootDir,
    canonicalBatteryPath,
  };
}

export async function handleCodeGraphVerify(
  args: VerifyArgs,
): Promise<{ content: { type: 'text'; text: string }[] }> {
  const paths = resolveVerifyPaths(args);
  if (!paths.ok) {
    return buildResponse({
      status: 'error',
      error: `code_graph_verify failed: ${paths.error}`,
    });
  }
  const { canonicalRootDir, canonicalBatteryPath } = paths;

  try {
    const readyState = await ensureCodeGraphReady(canonicalRootDir, {
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

    const battery = applyCategoryFilter(loadGoldBattery(canonicalBatteryPath), args.category);
    const result = {
      ...(await executeBattery(battery, handleCodeGraphQuery, {
        failFast: args.failFast,
        includeDetails: args.includeDetails,
      })),
      batteryPath: canonicalBatteryPath,
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

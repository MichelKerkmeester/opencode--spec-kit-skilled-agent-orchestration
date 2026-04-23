// ───────────────────────────────────────────────────────────────
// MODULE: advisor_status Handler
// ───────────────────────────────────────────────────────────────

import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { computeAdvisorSourceSignature } from '../lib/freshness.js';
import { readSkillGraphGeneration } from '../lib/freshness/generation.js';
import { createTrustState } from '../lib/freshness/trust-state.js';
import { DEFAULT_SCORER_WEIGHTS } from '../lib/scorer/weights-config.js';
import {
  AdvisorStatusInputSchema,
  AdvisorStatusOutputSchema,
  type AdvisorFreshness,
  type AdvisorStatusInput,
  type AdvisorStatusOutput,
} from '../schemas/advisor-tool-schemas.js';

type HandlerResponse = { content: Array<{ type: string; text: string }> };

const SKILL_GRAPH_DB = join('.opencode', 'skill', 'system-spec-kit', 'mcp_server', 'database', 'skill-graph.sqlite');
const SKILL_ROOT = join('.opencode', 'skill');
const DEFAULT_MAX_METADATA_FILES = 5_000;

function isFreshness(value: string): value is AdvisorFreshness {
  return value === 'live' || value === 'stale' || value === 'absent' || value === 'unavailable';
}

function parseDaemonPid(): number | undefined {
  const raw = process.env.SPECKIT_SKILL_GRAPH_DAEMON_PID;
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function hasRunningDaemon(pid: number | undefined): boolean {
  if (!pid) {
    return false;
  }
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function fileMtimeMs(path: string): number {
  if (!existsSync(path)) return 0;
  const stat = statSync(path);
  return stat.mtimeMs;
}

function scanSkillMetadataFiles(
  skillRoot: string,
  maxFiles = DEFAULT_MAX_METADATA_FILES,
): { count: number; maxMtimeMs: number; truncated: boolean } {
  if (!existsSync(skillRoot)) return { count: 0, maxMtimeMs: 0, truncated: false };
  const pending = [skillRoot];
  let count = 0;
  let newest = 0;
  let truncated = false;
  while (pending.length > 0) {
    const current = pending.pop();
    if (!current) continue;
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const entryPath = join(current, entry.name);
      if (entry.isDirectory()) {
        pending.push(entryPath);
      } else if (entry.isFile() && entry.name === 'graph-metadata.json') {
        count += 1;
        newest = Math.max(newest, statSync(entryPath).mtimeMs);
        if (count >= maxFiles) {
          truncated = true;
          return { count, maxMtimeMs: newest, truncated };
        }
      }
    }
  }
  return { count, maxMtimeMs: newest, truncated };
}

export function readAdvisorStatus(input: AdvisorStatusInput): AdvisorStatusOutput {
  const args = AdvisorStatusInputSchema.parse(input);
  const workspaceRoot = resolve(args.workspaceRoot);
  const dbPath = join(workspaceRoot, SKILL_GRAPH_DB);
  const skillRoot = join(workspaceRoot, SKILL_ROOT);
  const errors: string[] = [];

  try {
    const generation = readSkillGraphGeneration(workspaceRoot);
    const hasSources = existsSync(skillRoot);
    const hasArtifact = existsSync(dbPath);
    const sourceScan = scanSkillMetadataFiles(skillRoot, args.maxMetadataFiles ?? DEFAULT_MAX_METADATA_FILES);
    if (sourceScan.truncated) {
      errors.push(`advisor_status metadata scan capped at ${sourceScan.count} files`);
    }
    const sourceChanged = generation.state === 'stale'
      || (
        generation.sourceSignature
          ? computeAdvisorSourceSignature(workspaceRoot) !== generation.sourceSignature
          : hasArtifact && hasSources && sourceScan.maxMtimeMs > fileMtimeMs(dbPath)
      );
    const daemonPid = parseDaemonPid();
    const daemonAvailable = hasRunningDaemon(daemonPid);
    if (!daemonAvailable && generation.state !== 'unavailable') {
      errors.push('advisor_status found freshness artifacts, but no live daemon PID/process evidence');
    }
    const state = isFreshness(generation.state) ? generation.state : 'unavailable';
    const trustState = createTrustState({
      hasSources,
      hasArtifact,
      sourceChanged,
      daemonAvailable,
      generation: generation.generation,
      reason: generation.reason,
      lastLiveAt: state === 'live' ? generation.updatedAt : null,
    });
    const output: AdvisorStatusOutput = {
      freshness: trustState.state,
      generation: generation.generation,
      trustState,
      lastGenerationBump: generation.updatedAt === new Date(0).toISOString() ? null : generation.updatedAt,
      lastScanAt: generation.updatedAt === new Date(0).toISOString() ? null : generation.updatedAt,
      skillCount: sourceScan.count,
      laneWeights: DEFAULT_SCORER_WEIGHTS,
      ...(daemonPid ? { daemonPid } : {}),
      ...(errors.length > 0 ? { errors } : {}),
    };
    return AdvisorStatusOutputSchema.parse(output);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const sourceScan = scanSkillMetadataFiles(skillRoot, args.maxMetadataFiles ?? DEFAULT_MAX_METADATA_FILES);
    const trustState = createTrustState({
      hasSources: existsSync(skillRoot),
      hasArtifact: existsSync(dbPath),
      sourceChanged: false,
      daemonAvailable: false,
      generation: 0,
      reason: 'ADVISOR_STATUS_UNAVAILABLE',
    });
    const output: AdvisorStatusOutput = {
      freshness: 'unavailable',
      generation: 0,
      trustState,
      lastGenerationBump: null,
      lastScanAt: null,
      skillCount: sourceScan.count,
      laneWeights: DEFAULT_SCORER_WEIGHTS,
      errors: [message],
    };
    return AdvisorStatusOutputSchema.parse(output);
  }
}

export async function handleAdvisorStatus(args: unknown): Promise<HandlerResponse> {
  const data = readAdvisorStatus(AdvisorStatusInputSchema.parse(args));
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data }, null, 2),
    }],
  };
}

export const handle_advisor_status = handleAdvisorStatus;

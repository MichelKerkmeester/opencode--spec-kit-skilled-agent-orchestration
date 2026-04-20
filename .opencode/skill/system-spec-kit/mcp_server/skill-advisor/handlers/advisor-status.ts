// ───────────────────────────────────────────────────────────────
// MODULE: advisor_status Handler
// ───────────────────────────────────────────────────────────────

import { existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

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

function isFreshness(value: string): value is AdvisorFreshness {
  return value === 'live' || value === 'stale' || value === 'absent' || value === 'unavailable';
}

function parseDaemonPid(): number | undefined {
  const raw = process.env.SPECKIT_SKILL_GRAPH_DAEMON_PID;
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function maxMtimeMs(path: string): number {
  if (!existsSync(path)) return 0;
  const stat = statSync(path);
  return stat.mtimeMs;
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
    const sourceChanged = generation.state === 'stale'
      || (hasArtifact && hasSources && maxMtimeMs(skillRoot) > maxMtimeMs(dbPath));
    const daemonAvailable = generation.state !== 'unavailable';
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
      laneWeights: DEFAULT_SCORER_WEIGHTS,
      ...(parseDaemonPid() ? { daemonPid: parseDaemonPid() } : {}),
      ...(errors.length > 0 ? { errors } : {}),
    };
    return AdvisorStatusOutputSchema.parse(output);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
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

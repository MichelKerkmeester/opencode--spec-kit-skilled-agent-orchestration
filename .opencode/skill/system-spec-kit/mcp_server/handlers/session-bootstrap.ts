// ───────────────────────────────────────────────────────────────
// MODULE: Session Bootstrap Handler
// ───────────────────────────────────────────────────────────────
// Phase 024 / Item 7: Composite tool that runs session_resume
// + session_health in one call, merging results with hints.

import { handleSessionResume } from './session-resume.js';
import { handleSessionHealth } from './session-health.js';
import { recordBootstrapEvent } from '../lib/session/context-metrics.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import type { MCPResponse } from '@spec-kit/shared/types';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface SessionBootstrapArgs {
  specFolder?: string;
}

interface SessionBootstrapResult {
  resume: Record<string, unknown>;
  health: Record<string, unknown>;
  structuralContext?: StructuralBootstrapContract;
  hints: string[];
  nextActions: string[];
}

/* ───────────────────────────────────────────────────────────────
   2. HELPERS
──────────────────────────────────────────────────────────────── */

function extractData(response: MCPResponse): Record<string, unknown> {
  try {
    const text = response?.content?.[0]?.text;
    if (typeof text === 'string') {
      const parsed = JSON.parse(text);
      return parsed?.data ?? parsed ?? {};
    }
  } catch { /* parse failed */ }
  return {};
}

function extractHints(data: Record<string, unknown>): string[] {
  if (Array.isArray(data.hints)) return data.hints as string[];
  return [];
}

function buildNextActions(
  resumeData: Record<string, unknown>,
  healthData: Record<string, unknown>,
  structuralContext: StructuralBootstrapContract,
): string[] {
  const nextActions = new Set<string>();

  if (resumeData.error) {
    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
  }

  if (healthData.error) {
    nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
  }

  if (structuralContext.recommendedAction) {
    nextActions.add(structuralContext.recommendedAction);
  }

  if (structuralContext.status === 'ready') {
    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
  } else if (structuralContext.status === 'stale') {
    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
  } else {
    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
  }

  const healthStatus = typeof healthData.status === 'string' ? healthData.status : null;
  if (healthStatus === 'warning' || healthStatus === 'stale') {
    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
  }

  return [...nextActions].slice(0, 3);
}

/* ───────────────────────────────────────────────────────────────
   3. HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle session_bootstrap tool call — one-call session setup */
export async function handleSessionBootstrap(args: SessionBootstrapArgs): Promise<MCPResponse> {
  const startMs = Date.now();
  const allHints: string[] = [];

  // Sub-call 1: session_resume with full resume payload
  let resumeData: Record<string, unknown> = {};
  try {
    const resumeResponse = await handleSessionResume({
      specFolder: args.specFolder,
    });
    resumeData = extractData(resumeResponse);
    allHints.push(...extractHints(resumeData));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    resumeData = { error: message };
    allHints.push('session_resume failed. Try calling it manually.');
  }

  // Sub-call 2: session_health
  let healthData: Record<string, unknown> = {};
  try {
    const healthResponse = await handleSessionHealth();
    healthData = extractData(healthResponse);
    allHints.push(...extractHints(healthData));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    healthData = { error: message };
    allHints.push('session_health failed. Try calling it manually.');
  }

  // Phase 027: Structural bootstrap contract
  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
    allHints.push(
      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
    );
  }

  // Deduplicate hints
  const uniqueHints = [...new Set(allHints)];

  // Record bootstrap telemetry once for the composite call.
  const durationMs = Date.now() - startMs;
  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
  recordBootstrapEvent('tool', durationMs, completeness);

  const result: SessionBootstrapResult = {
    resume: resumeData,
    health: healthData,
    structuralContext,
    hints: uniqueHints,
    nextActions: buildNextActions(resumeData, healthData, structuralContext),
  };

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
    }],
  };
}
